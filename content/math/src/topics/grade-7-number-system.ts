import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";

import { isTerminating, mixedLatex } from "../problems.ts";
import { compared, type Pair, tableFigure, type Walk } from "./early-grades-more-kit.ts";
import { chosen, chosenMath, drawn, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { lineFigure, tapeFigure } from "./upper-grades-kit.ts";

// 7th Grade Math: adding, subtracting, multiplying and dividing rational numbers, opposites, reciprocals and zero,
// rational numbers as terminating or repeating decimals, and powers with rational bases.

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

/** gcd is the greatest common divisor of two positive whole numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** names are the people in word problems. */
const names = ["Ava", "Ben", "Chloe", "Diego", "Emma", "Felix", "Grace", "Hana", "Ivan", "Jade"];

/** Kind is how a rational number is written: as an integer or fraction, as a mixed number, or as a decimal. */
type Kind = "fraction" | "mixed" | "decimal";

/** show writes a rational number in the given kind: "-\frac{7}{4}", "-1\frac{3}{4}" or "-1.75". */
function show(q: Q, kind: Kind): string {
  if (kind === "decimal") return dec(q);
  if (kind === "mixed") return mixedLatex(q);
  return q.toLatex();
}

/** par writes a number, in parentheses when it is negative: "(-3)". */
const par = (q: Q, kind: Kind = "fraction") => (q.sign() < 0 ? `\\left(${show(q, kind)}\\right)` : show(q, kind));

/** cents writes an amount of cents as dollars with two decimal places: 1250 → "12.50". */
const cents = (c: number) => (c / 100).toFixed(2);

/** properQ draws a proper fraction n/d in lowest terms with d from 2 to maxDen. */
function properQ(rng: Rng, maxDen = 9): Q {
  const d = rng.int(2, maxDen);
  let n: number;
  do n = rng.int(1, d - 1);
  while (gcd(n, d) !== 1);
  return Q.of(n, d);
}

/** decQ draws a positive decimal with the given number of places, from lo to hi in units of the last place, not a whole number. */
function decQ(rng: Rng, places: number, lo: number, hi: number): Q {
  const scale = 10 ** places;
  let n: number;
  do n = rng.int(lo, hi);
  while (n % 10 === 0);
  return Q.of(n, scale);
}

/** subtractAcross is the result of the common mistake (a − c)/(b − d) for a/b − c/d, when it is defined and differs from the answer. */
function subtractAcross(x: Q, y: Q): Q[] {
  const den = x.d - y.d;
  return den === 0n ? [] : [Q.of(x.n - y.n, den)];
}

// ---------------------------------------------------------------------------
// Addition and subtraction of rational numbers

/** moveLine draws a move from one value to another on a number line from lo to hi, with ticks every step and text under lo, 0 and hi. */
function moveLine(
  lo: number,
  hi: number,
  step: number,
  from: [number, string],
  to: [number, string],
  alt: Pair,
  label?: (v: number) => string,
): Figure {
  return lineFigure(
    {
      lo,
      hi,
      step,
      labels: [lo, 0, hi],
      ...(label && { label }),
      marks: [
        { at: from[0], text: from[1] },
        { at: to[0], text: to[1], result: true },
      ],
      jumps: [[from[0], to[0]]],
    },
    alt,
  );
}

/** plainLabel writes a whole number on a number line. */
const plainLabel = (v: number) => String(Math.round(v));

/** subtractingAPositiveNumberFromASmallerPositiveNumber subtracts a larger positive number from a smaller one. */
export const subtractingAPositiveNumberFromASmallerPositiveNumber = withIntro(
  topic(
    "subtracting-a-positive-number-from-a-smaller-positive-number",
    t("Subtracting a Positive Number From a Smaller Positive Number", "较小的正数减去较大的正数"),
    t(
      "Subtracting b moves b units to the left on the number line, so when b is larger than a, a − b lands left of 0: a − b = −(b − a). For example, 4 − 9 = −5.",
      "减去 b 就是在数轴上向左移动 b 个单位，所以当 b 比 a 大时，a − b 落在 0 的左边：a − b = −(b − a)。例如 4 − 9 = −5。",
    ),
    ["interpreting-negative-numbers", "identifying-rational-numbers-on-a-number-line"],
    ["7.NS.A.1", "7.NS.A.1c"],
    [
      lesson(
        "smaller-minus-larger",
        ["Subtracting a larger number", "减去较大的数"],
        [
          [
            "Subtracting a positive number means moving left on the number line. When the number taken away is larger, the move passes zero and the result is negative. $4 - 9$: start at $4$ and move $9$ units left. $4$ units reach $0$, and $5$ more reach $-5$. So $4 - 9 = -(9 - 4) = -5$.",
            "减去一个正数，就是在数轴上向左移动。减去的数更大时，会越过零，结果是负数。$4 - 9$：从 $4$ 出发向左移动 $9$ 个单位。移动 $4$ 个单位到 $0$，再移动 $5$ 个单位到 $-5$。所以 $4 - 9 = -(9 - 4) = -5$。",
          ],
          ["Add back: $-5 + 9 = 4$, the number we started from.", "加回去：$-5 + 9 = 4$，正是起始的数。"],
          ["$4 - 9$ is not $5$: the result is below zero, so it is $-5$.", "$4 - 9$ 不是 $5$：结果在零以下，所以是 $-5$。"],
        ],
        (rng) => {
          const a = rng.int(1, 30);
          const b = rng.int(a + 1, a + 40);
          return valued(
            [`Evaluate $${a} - ${b}$.`, `计算 $${a} - ${b}$。`],
            a - b,
            [
              [
                ["Compare", "比较"],
                [
                  `$${b}$ is larger than $${a}$, so the result is negative. Find the difference:`,
                  `$${b}$ 比 $${a}$ 大，所以结果是负数。先求两数之差：`,
                ],
                [`${b} - ${a} = ${b - a}`],
              ],
              [
                ["Write the sign", "写上符号"],
                ["Put a negative sign in front:", "在前面写上负号："],
                [`${a} - ${b} = -(${b} - ${a}) = ${a - b}`],
              ],
            ],
            [`Add back: $${a - b} + ${b} = ${a}$.`, `加回去：$${a - b} + ${b} = ${a}$。`],
            [
              [b - a, "That forgets the negative sign: the result is below zero.", "这是忘了负号：结果在零以下。"],
              [-(a + b), "That adds the two numbers before making the result negative.", "这是先把两个数相加，再写成负数。"],
              [a + b, "That adds instead of subtracting.", "这是做了加法，而不是减法。"],
            ],
          );
        },
        drawn(gradeDrawings3["subtracting-a-positive-number-from-a-smaller-positive-number#smaller-minus-larger"]),
      ),
      lesson(
        "smaller-minus-larger-in-context",
        ["Going below zero in context", "实际情境中低于零"],
        [
          [
            "A drop, a payment or a descent that is larger than the starting amount takes the value below zero. Subtract as usual; the answer is negative, and its size is how far below zero the value ends up. The temperature is $4^{\\circ}\\text{C}$ and falls by $9^{\\circ}\\text{C}$: $4 - 9 = -5$, so it is $-5^{\\circ}\\text{C}$.",
            "下降、支付或下行的量大于原来的量时，结果会低于零。照常相减，答案是负数，它的大小表示比零低多少。气温是 $4^{\\circ}\\text{C}$，下降了 $9^{\\circ}\\text{C}$：$4 - 9 = -5$，所以是 $-5^{\\circ}\\text{C}$。",
          ],
          [
            "Rising $9^{\\circ}\\text{C}$ from $-5^{\\circ}\\text{C}$ brings it back to $4^{\\circ}\\text{C}$.",
            "从 $-5^{\\circ}\\text{C}$ 上升 $9^{\\circ}\\text{C}$，又回到 $4^{\\circ}\\text{C}$。",
          ],
          ["A temperature below zero is written with a negative sign: $-5$, not $5$.", "零下的温度要写负号：$-5$，不是 $5$。"],
        ],
        (rng) => {
          const who = rng.pick(names);
          const a = rng.int(1, 25);
          const b = rng.int(a + 1, a + 30);
          const ctx = rng.int(0, 2);
          const prompt: Pair =
            ctx === 0
              ? [
                  `The temperature at noon is $${a}^{\\circ}\\text{C}$. By midnight it has fallen by $${b}^{\\circ}\\text{C}$. What is the temperature at midnight, in degrees Celsius?`,
                  `中午气温是 $${a}^{\\circ}\\text{C}$，到午夜下降了 $${b}^{\\circ}\\text{C}$。午夜气温是多少摄氏度？`,
                ]
              : ctx === 1
                ? [
                    `${who} has $\\$${a}$ in a bank account and makes a payment of $\\$${b}$ from it. What is the new balance, in dollars?`,
                    `${who} 的银行账户里有 $\\$${a}$，从中支付了 $\\$${b}$。账户余额变为多少美元？`,
                  ]
                : [
                    `A hiking trail starts at an elevation of $${a}$ meters above sea level and descends $${b}$ meters into a valley. What is the elevation at the end of the trail, in meters?`,
                    `一条徒步路线的起点海拔为 $${a}$ 米，沿路线下降了 $${b}$ 米，进入一个山谷。路线终点的海拔是多少米？`,
                  ];
          return valued(
            prompt,
            a - b,
            [
              [
                ["Write the subtraction", "列减法"],
                ["A fall, a payment or a descent subtracts:", "下降、支付或下行都是减法："],
                [`${a} - ${b}`],
              ],
              [
                ["Below zero", "低于零"],
                [`Taking away more than $${a}$ goes below zero by the difference:`, `减去的比 $${a}$ 多，结果就比零低，低的就是两数之差：`],
                [`${a} - ${b} = -(${b} - ${a}) = ${a - b}`],
              ],
            ],
            [`Going back up by $${b}$: $${a - b} + ${b} = ${a}$.`, `再加回 $${b}$：$${a - b} + ${b} = ${a}$。`],
            [
              [b - a, "That forgets the negative sign: the value ends below zero.", "这是忘了负号：结果在零以下。"],
              [-(a + b), "That adds the two numbers before making the result negative.", "这是先把两个数相加，再写成负数。"],
              [a + b, "That adds the drop instead of subtracting it.", "这是把减少的量加上了，应该减去。"],
            ],
          );
        },
        moveLine(
          -6,
          6,
          1,
          [4, "4"],
          [-5, "-5"],
          ["A number line: a jump of 9 to the left from 4 lands on -5.", "数轴：从 4 向左跳 9 格，落在 -5。"],
          plainLabel,
        ),
      ),
    ],
  ),
  [
    "The temperature is $4^{\\circ}\\text{C}$ and drops by $9^{\\circ}\\text{C}$. What is the temperature now?",
    "气温是 $4^{\\circ}\\text{C}$，下降了 $9^{\\circ}\\text{C}$。现在气温是多少？",
  ],
  [
    "$4$ steps down reach $0$, and $5$ more reach $-5$: $4 - 9 = -5$. Indeed $-5 + 9 = 4$.",
    "下降 $4$ 到 $0$，再下降 $5$ 到 $-5$：$4 - 9 = -5$。而 $-5 + 9 = 4$。",
  ],
  ["subtract a larger positive number from a smaller one and get a negative result.", "用较小的正数减去较大的正数，得到负数。"],
);

/** subtractingAPositiveNumberFromANegativeNumber subtracts a positive number from a negative one. */
export const subtractingAPositiveNumberFromANegativeNumber = withIntro(
  topic(
    "subtracting-a-positive-number-from-a-negative-number",
    t("Subtracting a Positive Number From a Negative Number", "负数减去正数"),
    t(
      "Starting left of 0 and moving further left, the result is more negative: −a − b = −(a + b). For example, −4 − 7 = −11.",
      "从 0 的左边出发，再向左移动，结果更小：−a − b = −(a + b)。例如 −4 − 7 = −11。",
    ),
    ["subtracting-a-positive-number-from-a-smaller-positive-number"],
    ["7.NS.A.1", "7.NS.A.1c"],
    [
      lesson(
        "negative-minus-positive",
        ["A negative number minus a positive number", "负数减正数"],
        [
          [
            "Starting from a negative number and subtracting a positive one moves further left, away from zero. The result is negative, and its distance from zero is the sum of the two distances. $-4 - 7$: start at $-4$ and move $7$ units left to $-11$, so $-4 - 7 = -(4 + 7) = -11$.",
            "从一个负数出发再减去一个正数，会继续向左移动，离零更远。结果是负数，它到零的距离等于两段距离之和。$-4 - 7$：从 $-4$ 出发向左移动 $7$ 个单位，到达 $-11$，所以 $-4 - 7 = -(4 + 7) = -11$。",
          ],
          ["Add back: $-11 + 7 = -4$.", "加回去：$-11 + 7 = -4$。"],
          ["The answer is not $-3$: both moves go left, so the distances add.", "答案不是 $-3$：两次都向左移动，所以距离要相加。"],
        ],
        (rng) => {
          const a = rng.int(1, 40);
          const b = rng.int(1, 40);
          return valued(
            [`Evaluate $-${a} - ${b}$.`, `计算 $-${a} - ${b}$。`],
            -a - b,
            [
              [
                ["Both go left", "都向左"],
                [
                  `Start $${a}$ units left of $0$ and move $${b}$ more units left. Add the distances:`,
                  `从 $0$ 左边 $${a}$ 个单位处出发，再向左移动 $${b}$ 个单位。把距离相加：`,
                ],
                [`${a} + ${b} = ${a + b}`],
              ],
              [
                ["Write the sign", "写上符号"],
                ["The result is left of $0$, so it is negative:", "结果在 $0$ 的左边，所以是负数："],
                [`-${a} - ${b} = -(${a} + ${b}) = ${-a - b}`],
              ],
            ],
            [`Add back: $${-a - b} + ${b} = -${a}$.`, `加回去：$${-a - b} + ${b} = -${a}$。`],
            [
              [b - a, "That subtracts the distances; both moves go left, so they add.", "这是把距离相减；两次都向左，所以距离要相加。"],
              ...(a !== b ? [[a - b, "That subtracts the distances and drops the sign.", "这是把距离相减，又丢了符号。"] as const] : []),
              [a + b, "That forgets the negative sign: the result is left of zero.", "这是忘了负号：结果在零的左边。"],
            ],
          );
        },
        moveLine(
          -12,
          2,
          1,
          [-4, "-4"],
          [-11, "-11"],
          ["A number line: a jump of 7 to the left from -4 lands on -11.", "数轴：从 -4 向左跳 7 格，落在 -11。"],
          plainLabel,
        ),
      ),
      lesson(
        "negative-minus-positive-in-context",
        ["Going further below zero", "在零以下继续下降"],
        [
          [
            "When a quantity is already below zero, such as a depth or a debt, a further decrease makes it more negative. Subtract the decrease from the negative starting value. A diver at $-12$ meters descends $7$ more meters: $-12 - 7 = -19$ meters.",
            "当一个量已经低于零时，比如深度或欠款，再减少会使它变得更负。用负的起始值减去减少的量。潜水员在 $-12$ 米处，又下潜 $7$ 米：$-12 - 7 = -19$ 米。",
          ],
          ["Coming back up $7$ meters from $-19$ gives $-12$.", "从 $-19$ 米再上升 $7$ 米，得 $-12$ 米。"],
          ["Going deeper makes the number more negative, so the answer is below $-12$.", "潜得更深，数就更负，所以答案比 $-12$ 小。"],
        ],
        (rng) => {
          const a = rng.int(2, 30);
          const b = rng.int(2, 30);
          const ctx = rng.int(0, 2);
          const prompt: Pair =
            ctx === 0
              ? [
                  `The temperature at midnight is $-${a}^{\\circ}\\text{C}$. By dawn it has fallen another $${b}^{\\circ}\\text{C}$. What is the temperature at dawn, in degrees Celsius?`,
                  `午夜气温是 $-${a}^{\\circ}\\text{C}$，到黎明又下降了 $${b}^{\\circ}\\text{C}$。黎明时气温是多少摄氏度？`,
                ]
              : ctx === 1
                ? [
                    `A diver is at an elevation of $-${a}$ meters and descends another $${b}$ meters. What is the diver's new elevation, in meters?`,
                    `一名潜水员在海拔 $-${a}$ 米处，又下潜了 $${b}$ 米。潜水员现在的海拔是多少米？`,
                  ]
                : [
                    `A bank account has a balance of $-\\$${a}$. A fee of $\\$${b}$ is taken out. What is the new balance, in dollars?`,
                    `一个银行账户的余额是 $-\\$${a}$，又被扣除了 $\\$${b}$ 的手续费。账户余额变为多少美元？`,
                  ];
          return valued(
            prompt,
            -a - b,
            [
              [
                ["Write the subtraction", "列减法"],
                ["A further fall subtracts from the negative start:", "继续减少，就用负的起始值去减："],
                [`-${a} - ${b}`],
              ],
              [
                ["Add the distances", "距离相加"],
                ["Both are below zero, so the distances add:", "两段都在零以下，所以距离相加："],
                [`-(${a} + ${b}) = ${-a - b}`],
              ],
            ],
            [`Coming back up by $${b}$: $${-a - b} + ${b} = -${a}$.`, `再加回 $${b}$：$${-a - b} + ${b} = -${a}$。`],
            [
              [b - a, "That subtracts the distances; both are below zero, so they add.", "这是把距离相减；两段都在零以下，所以要相加。"],
              ...(a !== b ? [[a - b, "That subtracts the distances and drops the sign.", "这是把距离相减，又丢了符号。"] as const] : []),
              [a + b, "That forgets the negative sign: the value is below zero.", "这是忘了负号：结果在零以下。"],
            ],
          );
        },
        moveLine(
          -20,
          0,
          1,
          [-12, "-12"],
          [-19, "-19"],
          ["A number line: a jump of 7 to the left from -12 lands on -19.", "数轴：从 -12 向左跳 7 格，落在 -19。"],
          plainLabel,
        ),
      ),
    ],
  ),
  ["A diver is at $-4$ meters and goes $7$ meters deeper. Where is the diver now?", "潜水员在 $-4$ 米处，又下潜 $7$ 米。现在在哪里？"],
  [
    "Both moves go down, so $-4 - 7 = -(4 + 7) = -11$ meters; and $-11 + 7 = -4$.",
    "两次都向下，所以 $-4 - 7 = -(4 + 7) = -11$ 米；而 $-11 + 7 = -4$。",
  ],
  ["subtract a positive number from a negative one by adding the distances below zero.", "用负数减去正数：把零以下的距离相加。"],
);

/** twelfths writes a value on a number line in twelfths as a fraction in lowest terms. */
const twelfths = (v: number): string => {
  const n = Math.round(v * 12);
  if (n % 12 === 0) return String(n / 12);
  const g = gcd(Math.abs(n), 12);
  return `${n / g}/${12 / g}`;
};

/** subtractingAPositiveFractionFromASmallerFraction subtracts a larger fraction or mixed number from a smaller one. */
export const subtractingAPositiveFractionFromASmallerFraction = withIntro(
  topic(
    "subtracting-a-positive-fraction-from-a-smaller-fraction",
    t("Subtracting a Positive Fraction From a Smaller Fraction", "较小的分数减去较大的分数"),
    t(
      "As with whole numbers, a − b = −(b − a) when b > a: subtract the smaller fraction from the larger and make the result negative. 1/4 − 2/3 = −(8/12 − 3/12) = −5/12.",
      "与整数一样，当 b > a 时，a − b = −(b − a)：用较大的分数减去较小的分数，再把结果写成负数。1/4 − 2/3 = −(8/12 − 3/12) = −5/12。",
    ),
    ["subtracting-a-positive-number-from-a-smaller-positive-number", "subtracting-fractions-with-unlike-denominators"],
    ["7.NS.A.1", "7.NS.A.1c"],
    [
      lesson(
        "smaller-fraction-minus-larger-fraction",
        ["Fractions", "分数"],
        [
          [
            "To subtract fractions, first rewrite them with a common denominator. If the fraction being subtracted is larger, the difference is negative: subtract the smaller numerator from the larger and put a negative sign in front. $\\frac{1}{4} - \\frac{2}{3} = \\frac{3}{12} - \\frac{8}{12} = -\\frac{5}{12}$.",
            "分数相减时，先通分。如果减数更大，差就是负数：用较大的分子减去较小的分子，再在前面加上负号。$\\frac{1}{4} - \\frac{2}{3} = \\frac{3}{12} - \\frac{8}{12} = -\\frac{5}{12}$。",
          ],
          [
            "Add back: $-\\frac{5}{12} + \\frac{8}{12} = \\frac{3}{12} = \\frac{1}{4}$.",
            "加回去：$-\\frac{5}{12} + \\frac{8}{12} = \\frac{3}{12} = \\frac{1}{4}$。",
          ],
          ["Do not subtract the tops and the bottoms separately: use a common denominator first.", "不要把分子、分母分别相减：先通分。"],
        ],
        (rng) => {
          let a: Q;
          let b: Q;
          do {
            a = properQ(rng, 10);
            b = properQ(rng, 10);
          } while (a.cmp(b) >= 0);
          const r = a.sub(b);
          const den = Number((a.d * b.d) / BigInt(gcd(Number(a.d), Number(b.d))));
          const an = Number(a.n) * (den / Number(a.d));
          const bn = Number(b.n) * (den / Number(b.d));
          return valued(
            [`Evaluate $${a.toLatex()} - ${b.toLatex()}$.`, `计算 $${a.toLatex()} - ${b.toLatex()}$。`],
            r,
            [
              [
                ["Common denominator", "通分"],
                [`Write both fractions over $${den}$:`, `把两个分数都化成分母是 $${den}$ 的分数：`],
                [`${a.toLatex()} - ${b.toLatex()} = \\frac{${an}}{${den}} - \\frac{${bn}}{${den}}`],
              ],
              [
                ["Subtract", "相减"],
                [`$\\frac{${bn}}{${den}}$ is larger, so the result is negative:`, `$\\frac{${bn}}{${den}}$ 更大，所以结果是负数：`],
                [`-\\frac{${bn} - ${an}}{${den}} = ${r.toLatex()}`],
              ],
            ],
            [
              `Add back: $${r.toLatex()} + ${b.toLatex()} = ${a.toLatex()}$.`,
              `加回去：$${r.toLatex()} + ${b.toLatex()} = ${a.toLatex()}$。`,
            ],
            [
              [r.neg(), "That forgets the negative sign: the larger fraction is taken away.", "这是忘了负号：减去的是较大的分数。"],
              ...subtractAcross(a, b).map(
                (v) => [v, "That subtracts the tops and the bottoms separately.", "这是把分子、分母分别相减。"] as const,
              ),
              [a.add(b).neg(), "That adds the fractions before making the result negative.", "这是先把两个分数相加，再写成负数。"],
            ],
          );
        },
        moveLine(
          -1,
          1,
          1 / 12,
          [0.25, "1/4"],
          [-5 / 12, "-5/12"],
          [
            "A number line in twelfths: a jump of 2/3 to the left from 1/4 lands on -5/12.",
            "以十二分之一为单位的数轴：从 1/4 向左跳 2/3，落在 -5/12。",
          ],
          twelfths,
        ),
      ),
      lesson(
        "smaller-mixed-number-minus-larger-mixed-number",
        ["Whole and mixed numbers", "整数与带分数"],
        [
          [
            "When a smaller mixed number has a larger one taken from it, the result is negative. Subtract the smaller from the larger, regrouping if needed, and make the answer negative. $2 - 3\\frac{1}{2} = -\\left(3\\frac{1}{2} - 2\\right) = -1\\frac{1}{2}$.",
            "用较小的带分数减去较大的带分数，结果是负数。先用大的减去小的，必要时借位，再把答案写成负数。$2 - 3\\frac{1}{2} = -\\left(3\\frac{1}{2} - 2\\right) = -1\\frac{1}{2}$。",
          ],
          ["Add back: $-1\\frac{1}{2} + 3\\frac{1}{2} = 2$.", "加回去：$-1\\frac{1}{2} + 3\\frac{1}{2} = 2$。"],
          [
            "Keep the negative sign on the whole mixed number: $-1\\frac{1}{2}$ means $-\\left(1 + \\frac{1}{2}\\right)$.",
            "负号是整个带分数的：$-1\\frac{1}{2}$ 表示 $-\\left(1 + \\frac{1}{2}\\right)$。",
          ],
        ],
        (rng) => {
          let a: Q;
          let b: Q;
          do {
            a = rng.bool(0.3) ? Q.of(rng.int(1, 5)) : properQ(rng, 8).add(Q.of(rng.int(0, 4)));
            b = properQ(rng, 8).add(Q.of(rng.int(1, 6)));
          } while (a.cmp(b) >= 0);
          const r = a.sub(b);
          return valued(
            [`Evaluate $${mixedLatex(a)} - ${mixedLatex(b)}$.`, `计算 $${mixedLatex(a)} - ${mixedLatex(b)}$。`],
            r,
            [
              [
                ["Compare", "比较"],
                [
                  `$${mixedLatex(b)}$ is larger, so the result is negative. Subtract the other way:`,
                  `$${mixedLatex(b)}$ 更大，所以结果是负数。反过来相减：`,
                ],
                [`${mixedLatex(b)} - ${mixedLatex(a)} = ${mixedLatex(r.neg())}`],
              ],
              [
                ["Write the sign", "写上符号"],
                ["Put a negative sign in front:", "在前面写上负号："],
                [`${mixedLatex(a)} - ${mixedLatex(b)} = ${mixedLatex(r)}`],
              ],
            ],
            [
              `Add back: $${mixedLatex(r)} + ${mixedLatex(b)} = ${mixedLatex(a)}$.`,
              `加回去：$${mixedLatex(r)} + ${mixedLatex(b)} = ${mixedLatex(a)}$。`,
            ],
            [
              [r.neg(), "That forgets the negative sign: the larger number is taken away.", "这是忘了负号：减去的是较大的数。"],
              [a.add(b).neg(), "That adds the numbers before making the result negative.", "这是先把两个数相加，再写成负数。"],
              [r.sub(Q.one), "That is one whole too far: check the regrouping.", "这里多减了 $1$：检查一下借位。"],
            ],
          );
        },
        moveLine(
          -2,
          3,
          0.5,
          [2, "2"],
          [-1.5, "-1 1/2"],
          [
            "A number line in halves: a jump of 3 1/2 to the left from 2 lands on -1 1/2.",
            "以二分之一为单位的数轴：从 2 向左跳 3 1/2，落在 -1 1/2。",
          ],
          plainLabel,
        ),
      ),
    ],
  ),
  ["What is $\\frac{1}{4} - \\frac{2}{3}$?", "$\\frac{1}{4} - \\frac{2}{3}$ 等于多少？"],
  [
    "$\\frac{3}{12} - \\frac{8}{12} = -\\frac{5}{12}$, and $-\\frac{5}{12} + \\frac{8}{12} = \\frac{3}{12} = \\frac{1}{4}$.",
    "$\\frac{3}{12} - \\frac{8}{12} = -\\frac{5}{12}$，而 $-\\frac{5}{12} + \\frac{8}{12} = \\frac{3}{12} = \\frac{1}{4}$。",
  ],
  ["subtract a larger fraction or mixed number from a smaller one.", "用较小的分数或带分数减去较大的分数或带分数。"],
);

/** subtractingAPositiveDecimalFromASmallerDecimal subtracts a larger decimal from a smaller one. */
export const subtractingAPositiveDecimalFromASmallerDecimal = withIntro(
  topic(
    "subtracting-a-positive-decimal-from-a-smaller-decimal",
    t("Subtracting a Positive Decimal From a Smaller Decimal", "较小的小数减去较大的小数"),
    t(
      "Line up the decimal points and subtract the smaller decimal from the larger, then make the result negative: 2.3 − 5.75 = −(5.75 − 2.30) = −3.45.",
      "对齐小数点，用较大的小数减去较小的小数，再把结果写成负数：2.3 − 5.75 = −(5.75 − 2.30) = −3.45。",
    ),
    ["subtracting-a-positive-number-from-a-smaller-positive-number", "subtraction-with-unequal-numbers-of-decimals"],
    ["7.NS.A.1", "7.NS.A.1c"],
    [
      lesson(
        "smaller-decimal-minus-larger-decimal",
        ["Decimals", "小数"],
        [
          [
            "When the decimal being subtracted is larger, the difference is negative. Line up the decimal points, subtract the smaller decimal from the larger, and write a negative sign in front. $2.3 - 5.75 = -(5.75 - 2.30) = -3.45$; write $2.3$ as $2.30$ so the places line up.",
            "减数是较大的小数时，差是负数。把小数点对齐，用大的小数减去小的小数，再在结果前写上负号。$2.3 - 5.75 = -(5.75 - 2.30) = -3.45$；把 $2.3$ 写成 $2.30$，使数位对齐。",
          ],
          ["Add back: $-3.45 + 5.75 = 2.30$.", "加回去：$-3.45 + 5.75 = 2.30$。"],
          [
            "Line up the decimal points, not the last digits: $2.3$ is $2.30$, not $0.23$.",
            "要对齐小数点，不是对齐末位：$2.3$ 是 $2.30$，不是 $0.23$。",
          ],
        ],
        (rng) => {
          let a: Q;
          let b: Q;
          do {
            a = decQ(rng, 1, 1, 99);
            b = decQ(rng, 2, 101, 1999);
          } while (a.cmp(b) >= 0);
          if (rng.bool(0.4)) a = decQ(rng, 2, 1, Number((b.n * 100n) / b.d) - 1);
          const r = a.sub(b);
          const misaligned = b.sub(Q.of(a.n, a.d * 10n)).neg();
          return valued(
            [`Evaluate $${dec(a)} - ${dec(b)}$.`, `计算 $${dec(a)} - ${dec(b)}$。`],
            r,
            [
              [
                ["Compare", "比较"],
                [
                  `$${dec(b)}$ is larger, so the result is negative. Subtract the other way:`,
                  `$${dec(b)}$ 更大，所以结果是负数。反过来相减：`,
                ],
                [`${dec(b)} - ${dec(a)} = ${dec(r.neg())}`],
              ],
              [
                ["Write the sign", "写上符号"],
                ["Put a negative sign in front:", "在前面写上负号："],
                [`${dec(a)} - ${dec(b)} = ${dec(r)}`],
              ],
            ],
            [`Add back: $${dec(r)} + ${dec(b)} = ${dec(a)}$.`, `加回去：$${dec(r)} + ${dec(b)} = ${dec(a)}$。`],
            [
              [r.neg(), "That forgets the negative sign: the larger decimal is taken away.", "这是忘了负号：减去的是较大的小数。"],
              [a.add(b).neg(), "That adds the decimals before making the result negative.", "这是先把两个小数相加，再写成负数。"],
              [misaligned, "That lines up the last digits instead of the decimal points.", "这是对齐了末位，而不是对齐小数点。"],
            ],
            { form: "decimal" },
          );
        },
        moveLine(
          -4,
          3,
          1,
          [2.3, "2.3"],
          [-3.45, "-3.45"],
          ["A number line: a jump of 5.75 to the left from 2.3 lands on -3.45.", "数轴：从 2.3 向左跳 5.75，落在 -3.45。"],
          plainLabel,
        ),
      ),
      lesson(
        "smaller-decimal-minus-larger-decimal-in-context",
        ["Decimals in context", "实际情境中的小数"],
        [
          [
            "When spending is more than the money available, the balance drops below zero, and a negative balance shows how much is owed. A balance of $\\$12.50$ with a $\\$20.75$ purchase becomes $12.50 - 20.75 = -8.25$ dollars.",
            "花的钱比现有的钱多时，余额会低于零，负的余额表示欠了多少钱。余额 $\\$12.50$，消费 $\\$20.75$ 后变为 $12.50 - 20.75 = -8.25$ 美元。",
          ],
          ["Paying in $\\$20.75$ again: $-8.25 + 20.75 = 12.50$.", "再存入 $\\$20.75$：$-8.25 + 20.75 = 12.50$。"],
          ["A balance below zero is negative: $-8.25$, not $8.25$.", "低于零的余额是负数：$-8.25$，不是 $8.25$。"],
        ],
        (rng) => {
          let a: Q;
          let b: Q;
          let prompt: Pair;
          if (rng.bool()) {
            a = decQ(rng, 1, 1, 150);
            b = decQ(rng, 1, Number(a.mul(Q.of(10)).n) + 1, 300);
            prompt = [
              `The temperature is $${dec(a)}^{\\circ}\\text{C}$. It falls by $${dec(b)}^{\\circ}\\text{C}$. What is the new temperature, in degrees Celsius?`,
              `气温是 $${dec(a)}^{\\circ}\\text{C}$，下降了 $${dec(b)}^{\\circ}\\text{C}$。现在气温是多少摄氏度？`,
            ];
          } else {
            let x: number;
            let y: number;
            do {
              x = rng.int(100, 5000);
              y = rng.int(200, 9000);
            } while (x >= y || x % 100 === 0 || y % 100 === 0);
            [a, b] = [Q.of(x, 100), Q.of(y, 100)];
            const name = rng.pick(names);
            prompt = [
              `${name} has $\\$${cents(x)}$ on a transit card and takes a trip that costs $\\$${cents(y)}$. The card allows a negative balance. What is the new balance, in dollars?`,
              `${name} 的交通卡里有 $\\$${cents(x)}$，乘了一次车，车费 $\\$${cents(y)}$。这张卡允许余额为负。现在余额是多少美元？`,
            ];
          }
          const r = a.sub(b);
          return valued(
            prompt,
            r,
            [
              [
                ["Compare", "比较"],
                [
                  "More is taken away than there is, so the result is negative. Subtract the other way:",
                  "减去的比原有的多，所以结果是负数。反过来相减：",
                ],
                [`${dec(b)} - ${dec(a)} = ${dec(r.neg())}`],
              ],
              [
                ["Write the sign", "写上符号"],
                ["Put a negative sign in front:", "在前面写上负号："],
                [`${dec(a)} - ${dec(b)} = ${dec(r)}`],
              ],
            ],
            [`Add back: $${dec(r)} + ${dec(b)} = ${dec(a)}$.`, `加回去：$${dec(r)} + ${dec(b)} = ${dec(a)}$。`],
            [
              [r.neg(), "That forgets the negative sign: the value ends below zero.", "这是忘了负号：结果在零以下。"],
              [a.add(b).neg(), "That adds the two amounts before making the result negative.", "这是先把两个量相加，再写成负数。"],
            ],
            { form: "decimal" },
          );
        },
        moveLine(
          -10,
          14,
          2,
          [12.5, "12.50"],
          [-8.25, "-8.25"],
          ["A number line: a jump of 20.75 to the left from 12.50 lands on -8.25.", "数轴：从 12.50 向左跳 20.75，落在 -8.25。"],
          plainLabel,
        ),
      ),
    ],
  ),
  [
    "A transit card has $\\$12.50$ on it, and a trip costs $\\$20.75$. The card may go below zero. What is the balance after the trip?",
    "交通卡里有 $\\$12.50$，乘一次车要 $\\$20.75$。卡可以透支。乘车后余额是多少？",
  ],
  [
    "$20.75 - 12.50 = 8.25$, so the balance is $-8.25$ dollars; and $-8.25 + 20.75 = 12.50$.",
    "$20.75 - 12.50 = 8.25$，所以余额是 $-8.25$ 美元；而 $-8.25 + 20.75 = 12.50$。",
  ],
  ["subtract a larger decimal from a smaller one, lining up the decimal points.", "用较小的小数减去较大的小数，注意对齐小数点。"],
);

/** signedValue draws a nonzero rational of a kind: an integer, a fraction or mixed number, or a decimal. */
function signedValue(rng: Rng, kind: Kind, sign: 1 | -1 = rng.sign()): Q {
  const v =
    kind === "decimal" ? decQ(rng, rng.int(1, 2), 1, 999) : kind === "mixed" ? properQ(rng, 8).add(Q.of(rng.int(0, 5))) : properQ(rng, 10);
  return sign < 0 ? v.neg() : v;
}

/** rationalKind draws fraction, mixed or decimal. */
const rationalKind = (rng: Rng): Kind => rng.pick(["fraction", "mixed", "decimal"] as const);

/** kindForm is the answer option for a kind, empty for fractions and mixed numbers. */
const kindForm = (kind: Kind) => (kind === "decimal" ? { form: "decimal" as const } : {});

/** addingAPositiveNumberToANegativeNumber adds a positive number to a negative one. */
export const addingAPositiveNumberToANegativeNumber = withIntro(
  topic(
    "adding-a-positive-number-to-a-negative-number",
    t("Adding a Positive Number to a Negative Number", "负数加正数"),
    t(
      "Adding b moves b units to the right. From −a, the result is negative if b < a and positive if b > a; its size is the difference of the distances: −8 + 3 = −5 and −3 + 8 = 5.",
      "加上 b 就是向右移动 b 个单位。从 −a 出发，若 b < a，结果为负；若 b > a，结果为正；结果的绝对值是两段距离之差：−8 + 3 = −5，−3 + 8 = 5。",
    ),
    ["subtracting-a-positive-number-from-a-negative-number", "absolute-value"],
    ["7.NS.A.1", "7.NS.A.1b"],
    [
      lesson(
        "negative-plus-positive-integers",
        ["Integers", "整数"],
        [
          [
            "Adding a positive number moves right on the number line. Starting from a negative number, the sum stays negative if the move is shorter than the distance to zero, and becomes positive if it is longer. $-8 + 3$: from $-8$ move $3$ right to $-5$. $-3 + 8$: from $-3$ move $8$ right, past $0$, to $5$.",
            "加上一个正数，就是在数轴上向右移动。从负数出发时，如果移动的距离比到零的距离短，和仍是负数；如果更长，和就是正数。$-8 + 3$：从 $-8$ 向右移动 $3$ 到 $-5$。$-3 + 8$：从 $-3$ 向右移动 $8$，越过 $0$，到 $5$。",
          ],
          ["Subtract back: $-5 - 3 = -8$ and $5 - 8 = -3$.", "减回去：$-5 - 3 = -8$，$5 - 8 = -3$。"],
          [
            "The sign comes from the longer distance, not always from the first number.",
            "符号由距离更长的那个数决定，不一定跟第一个数相同。",
          ],
        ],
        (rng) => {
          let a: number;
          let b: number;
          do {
            a = rng.int(1, 40);
            b = rng.int(1, 40);
          } while (a === b);
          const r = b - a;
          return valued(
            [`Evaluate $-${a} + ${b}$.`, `计算 $-${a} + ${b}$。`],
            r,
            [
              [
                ["Compare the distances", "比较距离"],
                [
                  `The distances from zero are $${a}$ to the left and $${b}$ to the right. The ${b > a ? "right" : "left"} one is longer, so the result is ${b > a ? "positive" : "negative"}.`,
                  `到零的距离：向左 $${a}$，向右 $${b}$。${b > a ? "向右" : "向左"}的更长，所以结果是${b > a ? "正数" : "负数"}。`,
                ],
              ],
              [
                ["Subtract the distances", "距离相减"],
                ["Subtract the shorter distance from the longer one:", "用长的距离减去短的距离："],
                [`-${a} + ${b} = ${r < 0 ? `-(${a} - ${b})` : `${b} - ${a}`} = ${r}`],
              ],
            ],
            [`Subtract back: $${r} - ${b} = -${a}$.`, `减回去：$${r} - ${b} = -${a}$。`],
            [
              [-r, "The sign is wrong: it comes from the longer distance.", "符号错了：符号由更长的距离决定。"],
              [-(a + b), "That adds the distances; with different signs they subtract.", "这是把距离相加；符号不同时应该相减。"],
              [a + b, "That adds the distances and drops the signs.", "这是把距离相加，还丢了符号。"],
            ],
          );
        },
        drawn(gradeDrawings3["adding-a-positive-number-to-a-negative-number#negative-plus-positive-integers"]),
      ),
      lesson(
        "negative-plus-positive-rationals",
        ["Fractions and decimals", "分数与小数"],
        [
          [
            "To add numbers with different signs, subtract the smaller absolute value from the larger one. The sum takes the sign of the number with the larger absolute value. $-2.75 + 1.5 = -(2.75 - 1.5) = -1.25$, and $-\\frac{1}{3} + \\frac{3}{4} = \\frac{3}{4} - \\frac{1}{3} = \\frac{5}{12}$.",
            "符号不同的两个数相加，用较大的绝对值减去较小的绝对值，和的符号与绝对值较大的数相同。$-2.75 + 1.5 = -(2.75 - 1.5) = -1.25$；$-\\frac{1}{3} + \\frac{3}{4} = \\frac{3}{4} - \\frac{1}{3} = \\frac{5}{12}$。",
          ],
          ["Subtract back: $-1.25 - 1.5 = -2.75$.", "减回去：$-1.25 - 1.5 = -2.75$。"],
          ["Do not add the absolute values: with different signs, subtract them.", "不要把绝对值相加：符号不同时要相减。"],
        ],
        (rng) => {
          const kind = rationalKind(rng);
          let a: Q;
          let b: Q;
          do {
            a = signedValue(rng, kind, 1);
            b = signedValue(rng, kind, 1);
          } while (a.eq(b));
          const r = b.sub(a);
          const bigger = b.cmp(a) > 0;
          return valued(
            [`Evaluate $${show(a.neg(), kind)} + ${show(b, kind)}$.`, `计算 $${show(a.neg(), kind)} + ${show(b, kind)}$。`],
            r,
            [
              [
                ["Compare", "比较"],
                [
                  `$|${show(a.neg(), kind)}| = ${show(a, kind)}$ and $|${show(b, kind)}| = ${show(b, kind)}$. The ${bigger ? "positive" : "negative"} number has the larger absolute value, so the sum is ${bigger ? "positive" : "negative"}.`,
                  `$|${show(a.neg(), kind)}| = ${show(a, kind)}$，$|${show(b, kind)}| = ${show(b, kind)}$。${bigger ? "正数" : "负数"}的绝对值更大，所以和是${bigger ? "正数" : "负数"}。`,
                ],
              ],
              [
                ["Subtract", "相减"],
                ["Subtract the smaller absolute value from the larger:", "用较大的绝对值减去较小的绝对值："],
                [
                  bigger
                    ? `${show(b, kind)} - ${show(a, kind)} = ${show(r, kind)}`
                    : `-\\left(${show(a, kind)} - ${show(b, kind)}\\right) = ${show(r, kind)}`,
                ],
              ],
            ],
            [
              `Subtract back: $${show(r, kind)} - ${show(b, kind)} = ${show(a.neg(), kind)}$.`,
              `减回去：$${show(r, kind)} - ${show(b, kind)} = ${show(a.neg(), kind)}$。`,
            ],
            [
              [r.neg(), "The sign is wrong: it comes from the larger absolute value.", "符号错了：符号由绝对值较大的数决定。"],
              [
                a.add(b).neg(),
                "That adds the absolute values; with different signs they subtract.",
                "这是把绝对值相加；符号不同时应该相减。",
              ],
              [a.add(b), "That adds the absolute values and drops the signs.", "这是把绝对值相加，还丢了符号。"],
            ],
            kindForm(kind),
          );
        },
        moveLine(
          -3,
          1,
          0.25,
          [-2.75, "-2.75"],
          [-1.25, "-1.25"],
          [
            "A number line in quarters: a jump of 1.5 to the right from -2.75 lands on -1.25.",
            "以四分之一为单位的数轴：从 -2.75 向右跳 1.5，落在 -1.25。",
          ],
          plainLabel,
        ),
      ),
    ],
  ),
  ["A diver at $-8$ meters swims $3$ meters up. Where is the diver now?", "潜水员在 $-8$ 米处，向上游了 $3$ 米。现在在哪里？"],
  [
    "$-8 + 3 = -(8 - 3) = -5$ meters, still below the surface; and $-5 - 3 = -8$.",
    "$-8 + 3 = -(8 - 3) = -5$ 米，仍在水面以下；而 $-5 - 3 = -8$。",
  ],
  [
    "add a positive number to a negative one by subtracting the distances and keeping the sign of the longer one.",
    "负数加正数：把距离相减，符号与距离较长的数相同。",
  ],
);

/** addingANegativeNumber adds a negative number to a positive or a negative number. */
export const addingANegativeNumber = withIntro(
  topic(
    "adding-a-negative-number",
    t("Adding a Negative Number", "加上一个负数"),
    t(
      "Adding a negative number moves to the left: adding −b is the same as subtracting b. So 5 + (−8) = 5 − 8 = −3, and −4 + (−6) = −4 − 6 = −10.",
      "加上一个负数就是向左移动：加 −b 等于减 b。所以 5 + (−8) = 5 − 8 = −3，−4 + (−6) = −4 − 6 = −10。",
    ),
    ["adding-a-positive-number-to-a-negative-number"],
    ["7.NS.A.1", "7.NS.A.1b", "7.NS.A.1d"],
    [
      lesson(
        "positive-plus-negative",
        ["A positive number plus a negative number", "正数加负数"],
        [
          [
            "Adding a negative number has the same effect as subtracting its absolute value: it moves left on the number line. So rewrite the sum as a subtraction and work it out. $5 + (-8) = 5 - 8 = -3$ and $9 + (-4) = 9 - 4 = 5$.",
            "加上一个负数，与减去它的绝对值效果相同，都是在数轴上向左移动。所以把加法改写成减法再计算。$5 + (-8) = 5 - 8 = -3$；$9 + (-4) = 9 - 4 = 5$。",
          ],
          ["Add the opposite back: $-3 + 8 = 5$.", "加回相反数：$-3 + 8 = 5$。"],
          ["Adding a negative makes the number smaller: $5 + (-8)$ is not $13$.", "加上负数会使数变小：$5 + (-8)$ 不是 $13$。"],
        ],
        (rng) => {
          const kind: Kind = rng.bool(0.6) ? "fraction" : "decimal";
          let a: Q;
          let b: Q;
          do {
            a = kind === "fraction" ? Q.of(rng.int(1, 40)) : decQ(rng, 1, 1, 400);
            b = kind === "fraction" ? Q.of(rng.int(1, 40)) : decQ(rng, 1, 1, 400);
          } while (a.eq(b));
          const r = a.sub(b);
          return valued(
            [`Evaluate $${show(a, kind)} + ${par(b.neg(), kind)}$.`, `计算 $${show(a, kind)} + ${par(b.neg(), kind)}$。`],
            r,
            [
              [
                ["Rewrite", "改写"],
                [
                  `Adding $${show(b.neg(), kind)}$ is subtracting $${show(b, kind)}$:`,
                  `加 $${show(b.neg(), kind)}$ 就是减 $${show(b, kind)}$：`,
                ],
                [`${show(a, kind)} + ${par(b.neg(), kind)} = ${show(a, kind)} - ${show(b, kind)}`],
              ],
              [
                ["Subtract", "相减"],
                ["Work out the subtraction:", "算出减法："],
                [`${show(a, kind)} - ${show(b, kind)} = ${show(r, kind)}`],
              ],
            ],
            [
              `Add back: $${show(r, kind)} + ${show(b, kind)} = ${show(a, kind)}$.`,
              `加回去：$${show(r, kind)} + ${show(b, kind)} = ${show(a, kind)}$。`,
            ],
            [
              [a.add(b), "That adds the absolute values; adding a negative moves left.", "这是把绝对值相加；加负数要向左移动。"],
              [r.neg(), "The sign is wrong: compare the two absolute values.", "符号错了：比较两个绝对值的大小。"],
              [a.add(b).neg(), "That treats both numbers as negative.", "这是把两个数都当成了负数。"],
            ],
            kindForm(kind),
          );
        },
        drawn(gradeDrawings3["adding-a-negative-number#positive-plus-negative"]),
      ),
      lesson(
        "negative-plus-negative",
        ["A negative number plus a negative number", "负数加负数"],
        [
          [
            "When both numbers are negative, both moves go left, so the distances add and the sum is negative. $-4 + (-6) = -4 - 6 = -(4 + 6) = -10$.",
            "两个数都是负数时，两次都向左移动，所以距离相加，和为负数。$-4 + (-6) = -4 - 6 = -(4 + 6) = -10$。",
          ],
          ["Add the opposite back: $-10 + 6 = -4$.", "加回相反数：$-10 + 6 = -4$。"],
          ["The sum of two negatives is never positive.", "两个负数的和不可能是正数。"],
        ],
        (rng) => {
          const kind: Kind = rng.pick(["fraction", "fraction", "decimal", "mixed"] as const);
          const a = kind === "fraction" && rng.bool() ? Q.of(rng.int(1, 40)) : signedValue(rng, kind, 1);
          const b = kind === "fraction" && a.isInteger() ? Q.of(rng.int(1, 40)) : signedValue(rng, kind, 1);
          const r = a.add(b).neg();
          return valued(
            [`Evaluate $${show(a.neg(), kind)} + ${par(b.neg(), kind)}$.`, `计算 $${show(a.neg(), kind)} + ${par(b.neg(), kind)}$。`],
            r,
            [
              [
                ["Rewrite", "改写"],
                [
                  `Adding $${show(b.neg(), kind)}$ is subtracting $${show(b, kind)}$:`,
                  `加 $${show(b.neg(), kind)}$ 就是减 $${show(b, kind)}$：`,
                ],
                [`${show(a.neg(), kind)} + ${par(b.neg(), kind)} = ${show(a.neg(), kind)} - ${show(b, kind)}`],
              ],
              [
                ["Add the distances", "距离相加"],
                ["Both moves go left, so the distances add:", "两次都向左，所以距离相加："],
                [`-\\left(${show(a, kind)} + ${show(b, kind)}\\right) = ${show(r, kind)}`],
              ],
            ],
            [
              `Add back: $${show(r, kind)} + ${show(b, kind)} = ${show(a.neg(), kind)}$.`,
              `加回去：$${show(r, kind)} + ${show(b, kind)} = ${show(a.neg(), kind)}$。`,
            ],
            [
              [r.neg(), "The sign is wrong: two negatives add to a negative.", "符号错了：两个负数的和是负数。"],
              [a.sub(b), "That subtracts the distances; both moves go left, so they add.", "这是把距离相减；两次都向左，所以要相加。"],
              [b.sub(a), "That subtracts the distances; both moves go left, so they add.", "这是把距离相减；两次都向左，所以要相加。"],
            ],
            kindForm(kind),
          );
        },
        moveLine(
          -11,
          1,
          1,
          [-4, "-4"],
          [-10, "-10"],
          ["A number line: a jump of 6 to the left from -4 lands on -10.", "数轴：从 -4 向左跳 6 格，落在 -10。"],
          plainLabel,
        ),
      ),
    ],
  ),
  ["Mia owes $\\$4$ and borrows $\\$6$ more. Write her balance as a sum.", "Mia 欠 $\\$4$，又借了 $\\$6$。用加法写出她的余额。"],
  ["$-4 + (-6) = -4 - 6 = -10$ dollars; and $-10 + 6 = -4$.", "$-4 + (-6) = -4 - 6 = -10$ 美元；而 $-10 + 6 = -4$。"],
  ["add a negative number by subtracting its absolute value.", "加上一个负数，就是减去它的绝对值。"],
);

/** subtractingANegativeNumber subtracts a negative number by adding its opposite. */
export const subtractingANegativeNumber = withIntro(
  topic(
    "subtracting-a-negative-number",
    t("Subtracting a Negative Number", "减去一个负数"),
    t(
      "Subtracting a number is adding its opposite, so subtracting −b is adding b: 5 − (−3) = 5 + 3 = 8 and −2 − (−7) = −2 + 7 = 5. The difference a − b is also the distance from b to a, with a sign.",
      "减去一个数等于加上它的相反数，所以减 −b 就是加 b：5 − (−3) = 5 + 3 = 8，−2 − (−7) = −2 + 7 = 5。差 a − b 也是从 b 到 a 的带符号的距离。",
    ),
    ["adding-a-negative-number"],
    ["7.NS.A.1", "7.NS.A.1c"],
    [
      lesson(
        "subtracting-a-negative-integer",
        ["Integers", "整数"],
        [
          [
            "Subtracting a negative number is the same as adding its opposite, a positive number. Change the subtraction to addition and the negative number to positive, then add. $5 - (-3) = 5 + 3 = 8$ and $-9 - (-4) = -9 + 4 = -5$.",
            "减去一个负数，等于加上它的相反数，也就是一个正数。把减法改成加法，把负数改成正数，再相加。$5 - (-3) = 5 + 3 = 8$；$-9 - (-4) = -9 + 4 = -5$。",
          ],
          ["Add back: $8 + (-3) = 5$.", "加回去：$8 + (-3) = 5$。"],
          [
            "Change both signs: the minus becomes plus and $-3$ becomes $3$. Changing only one gives $5 - 3 = 2$, which is wrong.",
            "两个符号都要变：减号变加号，$-3$ 变 $3$。只变一个会得 $5 - 3 = 2$，是错的。",
          ],
        ],
        (rng) => {
          const a = rng.nonZero(-30, 30);
          const b = rng.int(1, 30);
          const r = a + b;
          return valued(
            [`Evaluate $${a} - (-${b})$.`, `计算 $${a} - (-${b})$。`],
            r,
            [
              [
                ["Add the opposite", "加相反数"],
                [`Subtracting $-${b}$ is adding $${b}$:`, `减 $-${b}$ 就是加 $${b}$：`],
                [`${a} - (-${b}) = ${a} + ${b}`],
              ],
              [["Add", "相加"], ["Work out the sum:", "算出和："], [`${a} + ${b} = ${r}`]],
            ],
            [`Add back: $${r} + (-${b}) = ${a}$.`, `加回去：$${r} + (-${b}) = ${a}$。`],
            [
              [a - b, `That subtracts $${b}$; subtracting $-${b}$ adds $${b}$.`, `这是减 $${b}$；减 $-${b}$ 应该是加 $${b}$。`],
              [-r, "The sign is wrong.", "符号错了。"],
              [-a - b, "That changes the sign of the first number too.", "这是把第一个数的符号也改了。"],
            ],
          );
        },
        moveLine(
          -1,
          9,
          1,
          [5, "5"],
          [8, "8"],
          ["A number line: subtracting -3 from 5 jumps 3 to the right, to 8.", "数轴：5 减 -3 就是向右跳 3 格，到 8。"],
          plainLabel,
        ),
      ),
      lesson(
        "subtracting-a-negative-rational",
        ["Fractions and decimals", "分数与小数"],
        [
          [
            "The rule for subtracting a negative is the same for fractions and decimals: subtracting a negative number means adding its opposite. Rewrite, then add as usual. $-\\frac{1}{2} - \\left(-\\frac{3}{4}\\right) = -\\frac{1}{2} + \\frac{3}{4} = \\frac{1}{4}$, and $1.2 - (-0.85) = 1.2 + 0.85 = 2.05$.",
            "分数和小数减去负数的规则相同：减去一个负数，就是加上它的相反数。先改写，再照常相加。$-\\frac{1}{2} - \\left(-\\frac{3}{4}\\right) = -\\frac{1}{2} + \\frac{3}{4} = \\frac{1}{4}$；$1.2 - (-0.85) = 1.2 + 0.85 = 2.05$。",
          ],
          ["Add back: $2.05 + (-0.85) = 1.2$.", "加回去：$2.05 + (-0.85) = 1.2$。"],
          [
            "$1.2 - (-0.85)$ is not $1.2 - 0.85$: the two minus signs make a plus.",
            "$1.2 - (-0.85)$ 不是 $1.2 - 0.85$：两个负号合起来是加。",
          ],
        ],
        (rng) => {
          const kind = rationalKind(rng);
          let a: Q;
          let b: Q;
          do {
            a = signedValue(rng, kind);
            b = signedValue(rng, kind, 1);
          } while (a.add(b).isZero());
          const r = a.add(b);
          return valued(
            [`Evaluate $${show(a, kind)} - ${par(b.neg(), kind)}$.`, `计算 $${show(a, kind)} - ${par(b.neg(), kind)}$。`],
            r,
            [
              [
                ["Add the opposite", "加相反数"],
                [
                  `Subtracting $${show(b.neg(), kind)}$ is adding $${show(b, kind)}$:`,
                  `减 $${show(b.neg(), kind)}$ 就是加 $${show(b, kind)}$：`,
                ],
                [`${show(a, kind)} - ${par(b.neg(), kind)} = ${show(a, kind)} + ${show(b, kind)}`],
              ],
              [["Add", "相加"], ["Work out the sum:", "算出和："], [`${show(a, kind)} + ${show(b, kind)} = ${show(r, kind)}`]],
            ],
            [
              `Add back: $${show(r, kind)} + ${par(b.neg(), kind)} = ${show(a, kind)}$.`,
              `加回去：$${show(r, kind)} + ${par(b.neg(), kind)} = ${show(a, kind)}$。`,
            ],
            [
              [
                a.sub(b),
                `That subtracts $${show(b, kind)}$; subtracting a negative adds.`,
                `这是减 $${show(b, kind)}$；减去负数应该是加。`,
              ],
              [r.neg(), "The sign is wrong.", "符号错了。"],
              [a.neg().sub(b), "That changes the sign of the first number too.", "这是把第一个数的符号也改了。"],
            ],
            kindForm(kind),
          );
        },
        moveLine(
          -1,
          3,
          0.25,
          [1.2, "1.2"],
          [2.05, "2.05"],
          ["A number line: subtracting -0.85 from 1.2 jumps 0.85 to the right, to 2.05.", "数轴：1.2 减 -0.85 就是向右跳 0.85，到 2.05。"],
          plainLabel,
        ),
      ),
      lesson(
        "differences-across-zero",
        ["Differences across zero", "跨越零的差"],
        [
          [
            "The difference between a positive and a negative value, such as a high and a low temperature, is the higher value minus the lower one. Subtracting the negative adds the two distances from zero. The high was $7^{\\circ}\\text{C}$ and the low $-5^{\\circ}\\text{C}$: the high was $7 - (-5) = 12$ degrees warmer.",
            "一个正值与一个负值之差，比如最高气温与最低气温之差，等于较大的值减去较小的值。减去负数相当于把两段到零的距离相加。最高气温 $7^{\\circ}\\text{C}$，最低气温 $-5^{\\circ}\\text{C}$：最高气温比最低气温高 $7 - (-5) = 12$ 度。",
          ],
          [
            "Count on the number line: $5$ degrees from $-5$ up to $0$, then $7$ more, $5 + 7 = 12$.",
            "在数轴上数：从 $-5$ 到 $0$ 是 $5$ 度，再到 $7$ 是 $7$ 度，$5 + 7 = 12$。",
          ],
          ["The gap is not $7 - 5 = 2$: the values are on opposite sides of zero.", "差距不是 $7 - 5 = 2$：两个值在零的两边。"],
        ],
        (rng) => {
          const hot = rng.bool();
          const hi = hot ? rng.int(1, 30) : 10 * rng.int(5, 90);
          const lo = hot ? rng.int(1, 30) : 10 * rng.int(2, 40);
          const [unit, zhUnit] = hot ? ["degrees", "度"] : ["meters", "米"];
          return valued(
            hot
              ? [
                  `One day the high temperature was $${hi}^{\\circ}\\text{C}$ and the low was $-${lo}^{\\circ}\\text{C}$. How many degrees warmer was the high than the low?`,
                  `某天最高气温是 $${hi}^{\\circ}\\text{C}$，最低气温是 $-${lo}^{\\circ}\\text{C}$。最高气温比最低气温高多少度？`,
                ]
              : [
                  `A plane flies at $${hi}$ meters above sea level, directly above a submarine at $-${lo}$ meters. How many meters apart are they?`,
                  `一架飞机在海拔 $${hi}$ 米处飞行，正下方有一艘潜艇位于海拔 $-${lo}$ 米处。它们相距多少米？`,
                ],
            hi + lo,
            [
              [["Subtract", "相减"], ["Take the lower value from the higher one:", "用较高的值减去较低的值："], [`${hi} - (-${lo})`]],
              [["Add the opposite", "加相反数"], ["Subtracting a negative adds:", "减去负数就是加："], [`${hi} + ${lo} = ${hi + lo}`]],
            ],
            [
              `Count across zero: $${lo}$ ${unit} up to $0$, then $${hi}$ more, $${lo} + ${hi} = ${hi + lo}$.`,
              `跨过零来数：到 $0$ 是 $${lo}$ ${zhUnit}，再加 $${hi}$ ${zhUnit}，$${lo} + ${hi} = ${hi + lo}$。`,
            ],
            [
              [
                Math.abs(hi - lo),
                "That subtracts the distances; the values are on opposite sides of zero, so they add.",
                "这是把距离相减；两个值在零的两边，所以要相加。",
              ],
              [-(hi + lo), "A distance or a gap is not negative.", "距离或差距不是负数。"],
            ],
          );
        },
        moveLine(
          -6,
          8,
          1,
          [-5, "-5"],
          [7, "7"],
          ["A number line from -5 to 7: 5 up to zero and 7 more, 12 in all.", "数轴从 -5 到 7：到零是 5，再加 7，共 12。"],
          plainLabel,
        ),
      ),
    ],
  ),
  [
    "The high today was $7^{\\circ}\\text{C}$ and the low was $-5^{\\circ}\\text{C}$. How much warmer was the high?",
    "今天最高气温 $7^{\\circ}\\text{C}$，最低气温 $-5^{\\circ}\\text{C}$。最高气温高多少度？",
  ],
  [
    "$7 - (-5) = 7 + 5 = 12$ degrees; counting, $5$ up to $0$ and $7$ more is $12$.",
    "$7 - (-5) = 7 + 5 = 12$ 度；数一数，到 $0$ 是 $5$，再加 $7$，共 $12$。",
  ],
  ["subtract a negative number by adding its opposite, and find gaps across zero.", "减去负数就是加上它的相反数，并求跨越零的差。"],
);

/** additiveInversesOfNumbers finds opposites and uses a + (−a) = 0. */
export const additiveInversesOfNumbers = withIntro(
  topic(
    "additive-inverses-of-numbers",
    t("Additive Inverses of Numbers", "相反数（加法逆元）"),
    t(
      "The additive inverse of a number is its opposite: the number that adds to it to make 0. The additive inverse of 3/4 is −3/4, and that of −2.5 is 2.5, because −2.5 + 2.5 = 0. In a sum, a number and its inverse cancel.",
      "一个数的加法逆元就是它的相反数，即与它相加得 0 的数。3/4 的相反数是 −3/4，−2.5 的相反数是 2.5，因为 −2.5 + 2.5 = 0。在求和时，一个数与它的相反数可以相互抵消。",
    ),
    ["adding-a-positive-number-to-a-negative-number"],
    ["7.NS.A.1a", "7.NS.A.1b"],
    [
      lesson(
        "finding-the-additive-inverse",
        ["Finding the additive inverse", "求相反数"],
        [
          [
            "The additive inverse of a number, also called its opposite, is the number that adds with it to zero. It has the same absolute value and the opposite sign. The additive inverse of $-\\frac{2}{5}$ is $\\frac{2}{5}$.",
            "一个数的加法逆元，也叫相反数，是与它相加得零的数。它的绝对值与原数相同，符号相反。$-\\frac{2}{5}$ 的相反数是 $\\frac{2}{5}$。",
          ],
          ["$-\\frac{2}{5} + \\frac{2}{5} = 0$.", "$-\\frac{2}{5} + \\frac{2}{5} = 0$。"],
          [
            "It is not the reciprocal $-\\frac{5}{2}$: the opposite changes the sign, not the fraction.",
            "它不是倒数 $-\\frac{5}{2}$：相反数只改变符号，不把分数颠倒。",
          ],
        ],
        (rng) => {
          const kind = rationalKind(rng);
          const v = rng.bool(0.25) ? Q.of(rng.nonZero(-50, 50)) : signedValue(rng, kind);
          const r = v.neg();
          return valued(
            [`What is the additive inverse of $${show(v, kind)}$?`, `$${show(v, kind)}$ 的加法逆元（相反数）是多少？`],
            r,
            [
              [
                ["Same size", "大小相同"],
                ["The inverse has the same absolute value:", "相反数的绝对值相同："],
                [`|${show(v, kind)}| = ${show(v.abs(), kind)}`],
              ],
              [
                ["Opposite sign", "符号相反"],
                [
                  `${v.sign() < 0 ? "The number is negative, so its inverse is positive" : "The number is positive, so its inverse is negative"}:`,
                  `${v.sign() < 0 ? "原数是负数，所以相反数是正数" : "原数是正数，所以相反数是负数"}：`,
                ],
                [`${show(r, kind)}`],
              ],
            ],
            [`$${show(v, kind)} + ${par(r, kind)} = 0$.`, `$${show(v, kind)} + ${par(r, kind)} = 0$。`],
            [
              [v, "That is the number itself; the inverse has the opposite sign.", "这是原数本身；相反数的符号相反。"],
              [
                Q.one.div(v),
                "That is the reciprocal, which multiplies to $1$, not adds to $0$.",
                "这是倒数，相乘得 $1$，而不是相加得 $0$。",
              ],
              [Q.one.div(v).neg(), "That flips the number as well as changing its sign.", "这是既改变了符号，又把数颠倒了。"],
            ],
            !v.isInteger() ? kindForm(kind) : {},
          );
        },
        lineFigure(
          {
            lo: -1,
            hi: 1,
            step: 0.2,
            labels: [-1, 0, 1],
            label: plainLabel,
            marks: [
              { at: -0.4, text: "-2/5" },
              { at: 0.4, text: "2/5", result: true },
            ],
          },
          [
            "A number line: -2/5 and 2/5 are the same distance from zero on opposite sides.",
            "数轴：-2/5 和 2/5 在零的两边，到零的距离相同。",
          ],
        ),
      ),
      lesson(
        "using-additive-inverses-in-a-sum",
        ["Inverses cancel in a sum", "相反数在求和中抵消"],
        [
          [
            "A number and its opposite add to zero, so in a sum they cancel each other. Look for opposite pairs first; the terms of a sum can be added in any order. In $-\\frac{4}{9} + 13 + \\frac{4}{9}$, the terms $-\\frac{4}{9}$ and $\\frac{4}{9}$ add to $0$, so the sum is $13$.",
            "一个数与它的相反数相加得零，所以在加法中它们互相抵消。先找出互为相反数的一对；加法中各项可以按任意顺序相加。在 $-\\frac{4}{9} + 13 + \\frac{4}{9}$ 中，$-\\frac{4}{9}$ 与 $\\frac{4}{9}$ 相加得 $0$，所以和是 $13$。",
          ],
          [
            "From left to right: $-\\frac{4}{9} + 13 = 12\\frac{5}{9}$, and $12\\frac{5}{9} + \\frac{4}{9} = 13$.",
            "从左往右算：$-\\frac{4}{9} + 13 = 12\\frac{5}{9}$，$12\\frac{5}{9} + \\frac{4}{9} = 13$。",
          ],
          ["The pair cancels to $0$, not to twice the number.", "这一对抵消为 $0$，不是这个数的两倍。"],
        ],
        (rng) => {
          const kind = rationalKind(rng);
          const v = signedValue(rng, kind);
          const w = Q.of(rng.nonZero(-40, 40));
          const order = rng.int(0, 2);
          const shown =
            order === 0
              ? [show(v, kind), par(w), par(v.neg(), kind)]
              : order === 1
                ? [w.toLatex(), par(v, kind), par(v.neg(), kind)]
                : [show(v, kind), par(v.neg(), kind), par(w)];
          const expr = shown.join(" + ");
          return valued(
            [`Evaluate $${expr}$.`, `计算 $${expr}$。`],
            w,
            [
              [
                ["Find the pair", "找出一对"],
                [
                  `$${show(v, kind)}$ and $${show(v.neg(), kind)}$ are additive inverses:`,
                  `$${show(v, kind)}$ 与 $${show(v.neg(), kind)}$ 互为相反数：`,
                ],
                [`${show(v, kind)} + ${par(v.neg(), kind)} = 0`],
              ],
              [["Add what is left", "加上剩下的"], ["Only one term is left:", "只剩下一项："], [`0 + ${par(w)} = ${w.toLatex()}`]],
            ],
            [
              `From left to right: $${shown[0]} + ${shown[1]} = ${show(order === 1 ? w.add(v) : order === 0 ? v.add(w) : Q.zero, kind)}$, then add $${shown[2]}$ to get $${w.toLatex()}$.`,
              `从左往右算：$${shown[0]} + ${shown[1]} = ${show(order === 1 ? w.add(v) : order === 0 ? v.add(w) : Q.zero, kind)}$，再加 $${shown[2]}$ 得 $${w.toLatex()}$。`,
            ],
            [
              [
                w.add(v.mul(Q.of(2))),
                "That doubles one of the pair instead of letting the pair cancel.",
                "这是把其中一个数加倍了，而没有让这一对抵消。",
              ],
              [
                w.sub(v.mul(Q.of(2))),
                "That doubles one of the pair instead of letting the pair cancel.",
                "这是把其中一个数加倍了，而没有让这一对抵消。",
              ],
              [w.neg(), "The sign of the term that is left is wrong.", "剩下那一项的符号错了。"],
            ],
          );
        },
        tableFigure(["-4/9 + 4/9", "0 + 13"], [0, 13]),
      ),
    ],
  ),
  ["Is $-2.5 + 7 + 2.5$ more than $7$, less than $7$, or equal to $7$?", "$-2.5 + 7 + 2.5$ 比 $7$ 大、比 $7$ 小，还是等于 $7$？"],
  [
    "$-2.5$ and $2.5$ cancel, so it equals $7$; left to right, $-2.5 + 7 = 4.5$ and $4.5 + 2.5 = 7$.",
    "$-2.5$ 与 $2.5$ 抵消，所以等于 $7$；从左往右，$-2.5 + 7 = 4.5$，$4.5 + 2.5 = 7$。",
  ],
  ["find the opposite of a number and let opposites cancel in a sum.", "求一个数的相反数，并在求和时让相反数抵消。"],
);

/** interpretingAdditiveOppositesAndAdditionUsingAbsoluteValue reads sums and differences as moves and distances. */
export const interpretingAdditiveOppositesAndAdditionUsingAbsoluteValue = withIntro(
  topic(
    "interpreting-additive-opposites-and-addition-using-absolute-value",
    t("Interpreting Additive Opposites and Addition Using Absolute Value", "用绝对值理解相反数与加法"),
    t(
      "On a number line, p + q is the point |q| units from p: to the right if q is positive and to the left if q is negative. The distance between two rational numbers p and q is |p − q|.",
      "在数轴上，p + q 是距离 p 为 |q| 个单位的点：q 为正时在 p 的右边，q 为负时在 p 的左边。两个有理数 p 与 q 之间的距离是 |p − q|。",
    ),
    ["adding-a-negative-number", "interpreting-absolute-value"],
    ["7.NS.A.1b", "7.NS.A.1c"],
    [
      lesson(
        "locating-a-sum-on-the-number-line",
        ["Where is p + q?", "p + q 在哪里？"],
        [
          [
            "The sum $p + q$ lies at distance $|q|$ from $p$ on the number line: to the right of $p$ when $q$ is positive and to the left when $q$ is negative. $3.5 + (-6)$ is $|-6| = 6$ units to the left of $3.5$, at $-2.5$.",
            "在数轴上，和 $p + q$ 与 $p$ 的距离是 $|q|$：$q$ 是正数时在 $p$ 的右边，$q$ 是负数时在 $p$ 的左边。$3.5 + (-6)$ 在 $3.5$ 左边 $|-6| = 6$ 个单位处，即 $-2.5$。",
          ],
          ["$3.5 - 6 = -2.5$, and $-2.5$ is $6$ units from $3.5$.", "$3.5 - 6 = -2.5$，而 $-2.5$ 到 $3.5$ 的距离是 $6$。"],
          [
            "Start from $p$, not from $0$: the move is measured from the first number.",
            "要从 $p$ 出发，不是从 $0$ 出发：移动是从第一个数开始量的。",
          ],
        ],
        (rng) => {
          const kind: Kind = rng.bool() ? "fraction" : "decimal";
          const p = kind === "fraction" ? Q.of(rng.nonZero(-15, 15)) : decQ(rng, 1, 1, 150).mul(Q.of(rng.sign()));
          let q: Q;
          do q = Q.of(rng.nonZero(-15, 15));
          while (q.abs().eq(p.abs()));
          const right = q.sign() > 0;
          const m = q.abs();
          const where = (dist: Q, from: Q, toRight: boolean): Pair => [
            `$${show(dist, kind)}$ units to the ${toRight ? "right" : "left"} of $${show(from, kind)}$`,
            `在 $${show(from, kind)}$ ${toRight ? "右" : "左"}边 $${show(dist, kind)}$ 个单位处`,
          ];
          return chosen(
            rng,
            [`On a number line, where is $${show(p, kind)} + ${par(q)}$?`, `在数轴上，$${show(p, kind)} + ${par(q)}$ 在哪里？`],
            where(m, p, right),
            [
              [
                where(m, p, !right),
                `$${q.toLatex()}$ is ${right ? "positive" : "negative"}, so the move is to the ${right ? "right" : "left"}.`,
                `$${q.toLatex()}$ 是${right ? "正数" : "负数"}，所以要向${right ? "右" : "左"}移动。`,
              ],
              [
                where(p.abs(), q, p.sign() > 0 ? !right : right),
                "That measures from the second number by the size of the first.",
                "这是从第二个数出发，按第一个数的大小移动。",
              ],
              [
                where(m, p.neg(), right),
                `That starts from $${show(p.neg(), kind)}$, the opposite of the first number.`,
                `这是从第一个数的相反数 $${show(p.neg(), kind)}$ 出发。`,
              ],
            ],
            [
              [
                ["The distance", "距离"],
                [`The move is $|${q.toLatex()}|$ units long:`, `移动的长度是 $|${q.toLatex()}|$ 个单位：`],
                [`|${q.toLatex()}| = ${m.toLatex()}`],
              ],
              [
                ["The direction", "方向"],
                [
                  `$${q.toLatex()}$ is ${right ? "positive" : "negative"}, so move ${right ? "right" : "left"} from $${show(p, kind)}$.`,
                  `$${q.toLatex()}$ 是${right ? "正数" : "负数"}，所以从 $${show(p, kind)}$ 向${right ? "右" : "左"}移动。`,
                ],
              ],
            ],
            [
              `$${show(p, kind)} + ${par(q)} = ${show(p.add(q), kind)}$, and $|${show(p.add(q), kind)} - ${par(p, kind)}| = ${m.toLatex()}$.`,
              `$${show(p, kind)} + ${par(q)} = ${show(p.add(q), kind)}$，而 $|${show(p.add(q), kind)} - ${par(p, kind)}| = ${m.toLatex()}$。`,
            ],
          );
        },
        drawn(gradeDrawings3["interpreting-additive-opposites-and-addition-using-absolute-value#locating-a-sum-on-the-number-line"]),
      ),
      lesson(
        "distance-between-rational-numbers",
        ["The distance between two numbers", "两数之间的距离"],
        [
          [
            "The distance between two numbers on the number line is the absolute value of their difference. Subtract in either order and take the absolute value; a distance is never negative. The distance between $-4.5$ and $2.25$ is $|2.25 - (-4.5)| = |6.75| = 6.75$.",
            "数轴上两个数之间的距离，等于它们之差的绝对值。用哪个数减哪个数都可以，再取绝对值；距离永远不是负数。$-4.5$ 与 $2.25$ 之间的距离是 $|2.25 - (-4.5)| = |6.75| = 6.75$。",
          ],
          [
            "Across zero: $4.5$ from $-4.5$ to $0$, and $2.25$ more, $4.5 + 2.25 = 6.75$.",
            "跨过零：从 $-4.5$ 到 $0$ 是 $4.5$，再加 $2.25$，$4.5 + 2.25 = 6.75$。",
          ],
          ["The numbers are on opposite sides of zero, so their distances from zero add.", "两个数在零的两边，所以它们到零的距离要相加。"],
        ],
        (rng) => {
          const kind: Kind = rng.pick(["fraction", "mixed", "decimal"] as const);
          let p: Q;
          let q: Q;
          do {
            p = signedValue(rng, kind, -1).sub(Q.of(rng.int(0, 6)));
            q = signedValue(rng, kind, 1).add(Q.of(rng.int(0, 6)));
          } while (p.abs().eq(q.abs()));
          const [x, y] = rng.bool() ? [p, q] : [q, p];
          const d = q.sub(p);
          return valued(
            [
              `What is the distance between $${show(x, kind)}$ and $${show(y, kind)}$ on the number line?`,
              `在数轴上，$${show(x, kind)}$ 与 $${show(y, kind)}$ 之间的距离是多少？`,
            ],
            d,
            [
              [
                ["Subtract", "相减"],
                ["Subtract the two numbers:", "两数相减："],
                [`${show(q, kind)} - ${par(p, kind)} = ${show(q, kind)} + ${show(p.neg(), kind)} = ${show(d, kind)}`],
              ],
              [
                ["Absolute value", "取绝对值"],
                ["A distance is never negative:", "距离不是负数："],
                [`|${show(d, kind)}| = ${show(d, kind)}`],
              ],
            ],
            [
              `Across zero: $${show(p.neg(), kind)}$ up to $0$ and $${show(q, kind)}$ more, $${show(p.neg(), kind)} + ${show(q, kind)} = ${show(d, kind)}$.`,
              `跨过零：到 $0$ 是 $${show(p.neg(), kind)}$，再加 $${show(q, kind)}$，$${show(p.neg(), kind)} + ${show(q, kind)} = ${show(d, kind)}$。`,
            ],
            [
              [
                q.add(p).abs(),
                "That subtracts the distances from zero; on opposite sides of zero they add.",
                "这是把到零的距离相减；在零的两边时应该相加。",
              ],
              [q.sub(p).neg(), "A distance is never negative.", "距离不会是负数。"],
            ],
            kindForm(kind),
          );
        },
        drawn(gradeDrawings3["interpreting-additive-opposites-and-addition-using-absolute-value#distance-between-rational-numbers"]),
      ),
    ],
  ),
  ["Where is $3.5 + (-6)$ on the number line, and how far is it from $3.5$?", "$3.5 + (-6)$ 在数轴上的什么位置？它离 $3.5$ 多远？"],
  ["It is $6$ units left of $3.5$, at $-2.5$; and $|-2.5 - 3.5| = 6$.", "在 $3.5$ 左边 $6$ 个单位处，即 $-2.5$；而 $|-2.5 - 3.5| = 6$。"],
  ["read a sum as a move along the number line and find the distance between two numbers.", "把加法看成在数轴上移动，并求两数之间的距离。"],
);

/** solvingProblemsUsingAdditionAndSubtractionOfRationalNumbers solves word problems with signed sums and differences. */
export const solvingProblemsUsingAdditionAndSubtractionOfRationalNumbers = withIntro(
  topic(
    "solving-problems-using-addition-and-subtraction-of-rational-numbers",
    t("Solving Problems Using Addition and Subtraction of Rational Numbers", "用有理数加减法解决问题"),
    t(
      "Write each change as a signed number, a rise or deposit as positive and a fall or withdrawal as negative, then add. To compare two values, subtract: the difference between 8.5 m above sea level and 3.25 m below it is 8.5 − (−3.25) = 11.75 m.",
      "把每次变化写成带符号的数，上升或存入记为正，下降或取出记为负，然后相加。比较两个值就相减：海拔 8.5 米与海拔 −3.25 米之差是 8.5 − (−3.25) = 11.75 米。",
    ),
    ["subtracting-a-negative-number", "interpreting-additive-opposites-and-addition-using-absolute-value"],
    ["7.NS.A.1d", "7.NS.A.3"],
    [
      lesson(
        "a-sequence-of-changes",
        ["A sequence of changes", "连续的变化"],
        [
          [
            "Write each change as a signed number: rises and gains are positive, falls and losses are negative. Starting from the first value, add the changes in order. At 6 a.m. it was $-3.5^{\\circ}\\text{C}$; it rose $8.25$ degrees and then fell $6.5$ degrees: $-3.5 + 8.25 - 6.5 = -1.75^{\\circ}\\text{C}$.",
            "把每次变化写成带符号的数：上升和增加为正，下降和减少为负。从起始值开始，依次加上各次变化。早上 6 点气温是 $-3.5^{\\circ}\\text{C}$，上升了 $8.25$ 度，又下降了 $6.5$ 度：$-3.5 + 8.25 - 6.5 = -1.75^{\\circ}\\text{C}$。",
          ],
          [
            "Add the changes first: $8.25 - 6.5 = 1.75$, and $-3.5 + 1.75 = -1.75$.",
            "先把变化合起来：$8.25 - 6.5 = 1.75$，$-3.5 + 1.75 = -1.75$。",
          ],
          ["The start is below zero: begin from $-3.5$, not $3.5$.", "起始值在零以下：要从 $-3.5$ 开始，不是 $3.5$。"],
        ],
        (rng) => {
          const start = decQ(rng, 1, 1, 120).neg();
          const up = decQ(rng, 2, 100, 1500);
          const down = decQ(rng, 1, 10, 200);
          const noon = start.add(up);
          const r = noon.sub(down);
          const net = up.sub(down);
          return valued(
            [
              `At $6$ a.m. the temperature was $${dec(start)}^{\\circ}\\text{C}$. By noon it had risen $${dec(up)}$ degrees, and by evening it had fallen $${dec(down)}$ degrees from the noon temperature. What was the evening temperature, in degrees Celsius?`,
              `早上 $6$ 点气温是 $${dec(start)}^{\\circ}\\text{C}$。到中午上升了 $${dec(up)}$ 度，到傍晚又比中午下降了 $${dec(down)}$ 度。傍晚气温是多少摄氏度？`,
            ],
            r,
            [
              [["Noon", "中午"], ["Add the rise:", "加上上升的度数："], [`${dec(start)} + ${dec(up)} = ${dec(noon)}`]],
              [["Evening", "傍晚"], ["Subtract the fall:", "减去下降的度数："], [`${dec(noon)} - ${dec(down)} = ${dec(r)}`]],
            ],
            [
              `Add the changes first: $${dec(up)} - ${dec(down)} = ${dec(net)}$, and $${dec(start)} + ${par(net, "decimal")} = ${dec(r)}$.`,
              `先把变化合起来：$${dec(up)} - ${dec(down)} = ${dec(net)}$，$${dec(start)} + ${par(net, "decimal")} = ${dec(r)}$。`,
            ],
            [
              [
                start.neg().add(up).sub(down),
                "That starts from a temperature above zero; the start is negative.",
                "这是从零上的温度开始算；起始温度是负数。",
              ],
              [start.add(up).add(down), "That adds the fall instead of subtracting it.", "这是把下降的度数加上了，应该减去。"],
              [start.sub(up).add(down), "That turns the rise into a fall and the fall into a rise.", "这是把上升和下降弄反了。"],
            ],
            { form: "decimal" },
          );
        },
        lineFigure(
          {
            lo: -4,
            hi: 5,
            step: 1,
            labels: [-4, 0, 5],
            label: plainLabel,
            marks: [
              { at: -3.5, text: "-3.5" },
              { at: 4.75, text: "4.75" },
              { at: -1.75, text: "-1.75", result: true },
            ],
            jumps: [
              [-3.5, 4.75],
              [4.75, -1.75],
            ],
          },
          ["A number line: from -3.5 up 8.25 to 4.75, then down 6.5 to -1.75.", "数轴：从 -3.5 上升 8.25 到 4.75，再下降 6.5 到 -1.75。"],
        ),
      ),
      lesson(
        "differences-of-signed-quantities",
        ["Comparing signed quantities", "比较带符号的量"],
        [
          [
            "Give values above a reference level, such as sea level, positive signs and values below it negative signs. The difference between two levels is the higher one minus the lower one. A hill is $8\\frac{1}{2}$ m above sea level and a cave floor is $3\\frac{1}{4}$ m below it: the difference is $8\\frac{1}{2} - \\left(-3\\frac{1}{4}\\right) = 11\\frac{3}{4}$ m.",
            "在某个基准之上的值，比如高于海平面，记为正；低于基准的值记为负。两个高度之差等于较高的减去较低的。山丘高出海平面 $8\\frac{1}{2}$ 米，洞底低于海平面 $3\\frac{1}{4}$ 米：高度差是 $8\\frac{1}{2} - \\left(-3\\frac{1}{4}\\right) = 11\\frac{3}{4}$ 米。",
          ],
          [
            "Across sea level: $3\\frac{1}{4}$ up to $0$ and $8\\frac{1}{2}$ more, $11\\frac{3}{4}$ in all.",
            "跨过海平面：到 $0$ 是 $3\\frac{1}{4}$，再加 $8\\frac{1}{2}$，共 $11\\frac{3}{4}$。",
          ],
          [
            "Below sea level is negative, so subtracting it adds: the answer is not $8\\frac{1}{2} - 3\\frac{1}{4}$.",
            "海平面以下是负数，减去它就是加：答案不是 $8\\frac{1}{2} - 3\\frac{1}{4}$。",
          ],
        ],
        (rng) => {
          const kind: Kind = rng.bool() ? "mixed" : "decimal";
          const a = kind === "mixed" ? properQ(rng, 8).add(Q.of(rng.int(2, 40))) : decQ(rng, 2, 200, 9999);
          const b = kind === "mixed" ? properQ(rng, 8).add(Q.of(rng.int(1, 30))) : decQ(rng, 2, 100, 5000);
          const r = a.add(b);
          // Prices change in cents, so the stock context only takes decimals.
          const ctx = kind === "mixed" || rng.bool();
          return valued(
            ctx
              ? [
                  `The top of a hill is $${show(a, kind)}$ meters above sea level, and the floor of a nearby cave is $${show(b, kind)}$ meters below sea level. How many meters higher is the top of the hill than the cave floor?`,
                  `山顶高出海平面 $${show(a, kind)}$ 米，附近一个洞穴的洞底低于海平面 $${show(b, kind)}$ 米。山顶比洞底高多少米？`,
                ]
              : [
                  `On Monday a stock's price rose by $\\$${show(a, kind)}$; on Tuesday it fell by $\\$${show(b, kind)}$. By how many dollars was Monday's change greater than Tuesday's change?`,
                  `某只股票周一上涨了 $\\$${show(a, kind)}$，周二下跌了 $\\$${show(b, kind)}$。周一的变化量比周二的变化量大多少美元？`,
                ],
            r,
            [
              [
                ["Signs", "写符号"],
                [
                  `Write ${ctx ? "the cave floor" : "Tuesday's change"} as a negative number:`,
                  `把${ctx ? "洞底" : "周二的变化"}写成负数：`,
                ],
                [`${show(b.neg(), kind)}`],
              ],
              [
                ["Subtract", "相减"],
                ["Take the lower value from the higher one:", "用较大的值减去较小的值："],
                [`${show(a, kind)} - ${par(b.neg(), kind)} = ${show(a, kind)} + ${show(b, kind)} = ${show(r, kind)}`],
              ],
            ],
            [
              `Across zero: $${show(b, kind)}$ up to $0$ and $${show(a, kind)}$ more, $${show(r, kind)}$ in all.`,
              `跨过零：到 $0$ 是 $${show(b, kind)}$，再加 $${show(a, kind)}$，共 $${show(r, kind)}$。`,
            ],
            [
              [
                a.sub(b),
                "That subtracts the sizes; the values are on opposite sides of zero, so they add.",
                "这是把大小相减；两个值在零的两边，所以要相加。",
              ],
              [
                b.sub(a),
                "That subtracts the sizes; the values are on opposite sides of zero, so they add.",
                "这是把大小相减；两个值在零的两边，所以要相加。",
              ],
              [r.neg(), "A difference of the higher minus the lower is not negative.", "较大值减较小值的差不是负数。"],
            ],
            kindForm(kind),
          );
        },
        lineFigure(
          {
            lo: -4,
            hi: 9,
            step: 1,
            labels: [-4, 0, 9],
            label: plainLabel,
            marks: [
              { at: -3.25, text: "-3 1/4" },
              { at: 8.5, text: "8 1/2", result: true },
            ],
          },
          [
            "A number line: the cave floor at -3 1/4 and the hill top at 8 1/2, on opposite sides of zero.",
            "数轴：洞底在 -3 1/4，山顶在 8 1/2，在零的两边。",
          ],
        ),
      ),
    ],
  ),
  [
    "A hill top is $8.5$ m above sea level and a cave floor is $3.25$ m below. How much higher is the hill top?",
    "山顶高出海平面 $8.5$ 米，洞底低于海平面 $3.25$ 米。山顶高多少米？",
  ],
  [
    "$8.5 - (-3.25) = 8.5 + 3.25 = 11.75$ m; across sea level, $3.25 + 8.5 = 11.75$.",
    "$8.5 - (-3.25) = 8.5 + 3.25 = 11.75$ 米；跨过海平面，$3.25 + 8.5 = 11.75$。",
  ],
  ["solve problems by writing changes as signed numbers and adding or subtracting them.", "把变化写成带符号的数，用加减法解决问题。"],
);

// ---------------------------------------------------------------------------
// Multiplication and division of rational numbers

/** smallFactor draws a rational factor of a kind that keeps products easy: a fraction with denominator up to 9, or a decimal with one or two places. */
function smallFactor(rng: Rng, kind: Kind): Q {
  if (kind === "decimal") return rng.bool() ? decQ(rng, 1, 1, 99) : Q.of(rng.int(2, 12));
  if (kind === "mixed") return properQ(rng, 6).add(Q.of(rng.int(1, 3)));
  return rng.bool(0.3) ? Q.of(rng.int(2, 12)) : properQ(rng, 9);
}

/** multiplyingPositiveNumbersWithNegativeNumbers multiplies numbers of opposite signs. */
export const multiplyingPositiveNumbersWithNegativeNumbers = withIntro(
  topic(
    "multiplying-positive-numbers-with-negative-numbers",
    t("Multiplying Positive Numbers With Negative Numbers", "正数与负数相乘"),
    t(
      "A product of a positive and a negative number is negative: 3 × (−4) means three groups of −4, which is −12. Multiply the sizes, then make the result negative: (−2/3) × 9/4 = −3/2.",
      "正数与负数的积是负数：3 × (−4) 表示 3 个 −4 相加，等于 −12。先把两数的绝对值相乘，再取负号：(−2/3) × 9/4 = −3/2。",
    ),
    ["adding-a-negative-number", "multiplying-fractions", "multiplying-two-digit-decimals"],
    ["7.NS.A.2a", "7.NS.A.2c"],
    [
      lesson(
        "positive-times-negative-integers",
        ["Integers", "整数"],
        [
          [
            "Multiplying by a positive whole number means repeated addition, and adding several negative numbers gives a negative result. So a positive times a negative is negative, whichever order the factors come in. $3 \\times (-4) = (-4) + (-4) + (-4) = -12$, and $(-6) \\times 5 = -30$.",
            "乘一个正整数就是重复相加，而几个负数相加结果是负数。所以正数乘负数得负数，与因数的顺序无关。$3 \\times (-4) = (-4) + (-4) + (-4) = -12$；$(-6) \\times 5 = -30$。",
          ],
          ["Divide back: $-12 \\div 3 = -4$.", "除回去：$-12 \\div 3 = -4$。"],
          ["The product is not $12$: the signs are different, so it is negative.", "积不是 $12$：两数符号不同，所以积为负数。"],
        ],
        (rng) => {
          const a = rng.int(2, 15);
          const b = rng.int(2, 15);
          const negFirst = rng.bool();
          const [x, y] = negFirst ? [Q.of(-a), Q.of(b)] : [Q.of(a), Q.of(-b)];
          const r = -a * b;
          return valued(
            [`Evaluate $${par(x)} \\times ${par(y)}$.`, `计算 $${par(x)} \\times ${par(y)}$。`],
            r,
            [
              [
                ["The sign", "定符号"],
                ["One factor is positive and one is negative, so the product is negative.", "一个因数是正数，一个是负数，所以积是负数。"],
              ],
              [
                ["The size", "算大小"],
                ["Multiply the absolute values and put on the sign:", "把绝对值相乘，再加上符号："],
                [`${a} \\times ${b} = ${a * b}`, `${par(x)} \\times ${par(y)} = ${r}`],
              ],
            ],
            [`Divide back: $${r} \\div ${par(y)} = ${x.toLatex()}$.`, `除回去：$${r} \\div ${par(y)} = ${x.toLatex()}$。`],
            [
              [a * b, "The sign is wrong: different signs give a negative product.", "符号错了：异号两数相乘，积为负数。"],
              [x.add(y), "That adds the factors instead of multiplying them.", "这是把两个因数相加了，应该相乘。"],
              [-(a + b), "That adds the sizes instead of multiplying them.", "这是把绝对值相加了，应该相乘。"],
            ],
          );
        },
        lineFigure(
          {
            lo: -13,
            hi: 1,
            step: 1,
            labels: [-12, -8, -4, 0],
            label: plainLabel,
            marks: [{ at: -12, text: "-12", result: true }],
            jumps: [
              [0, -4],
              [-4, -8],
              [-8, -12],
            ],
          },
          [
            "A number line: three jumps of -4 from 0 land on -12, so 3 × (-4) = -12.",
            "数轴：从 0 出发跳三次 -4，落在 -12，所以 3 × (-4) = -12。",
          ],
        ),
      ),
      lesson(
        "positive-times-negative-rationals",
        ["Fractions and decimals", "分数与小数"],
        [
          [
            "The sign rule holds for fractions and decimals too: when one factor is positive and the other negative, the product is negative. Multiply the absolute values, then attach the negative sign. $\\left(-\\frac{2}{3}\\right) \\times \\frac{9}{4} = -\\frac{18}{12} = -\\frac{3}{2}$, and $0.4 \\times (-2.5) = -1$.",
            "分数和小数同样遵守符号法则：一个因数为正、另一个为负时，积为负数。先把绝对值相乘，再加上负号。$\\left(-\\frac{2}{3}\\right) \\times \\frac{9}{4} = -\\frac{18}{12} = -\\frac{3}{2}$；$0.4 \\times (-2.5) = -1$。",
          ],
          ["Divide back: $-1 \\div 0.4 = -2.5$.", "除回去：$-1 \\div 0.4 = -2.5$。"],
          ["Only the sign changes: the size is still the product of the sizes.", "只有符号改变：大小仍是两个绝对值的积。"],
        ],
        (rng) => {
          const kind: Kind = rng.pick(["fraction", "decimal", "mixed"] as const);
          let a: Q;
          let b: Q;
          do {
            a = smallFactor(rng, kind);
            b = smallFactor(rng, kind);
          } while (a.isInteger() && b.isInteger());
          const negFirst = rng.bool();
          const [x, y] = negFirst ? [a.neg(), b] : [a, b.neg()];
          const r = x.mul(y);
          return valued(
            [`Evaluate $${par(x, kind)} \\times ${par(y, kind)}$.`, `计算 $${par(x, kind)} \\times ${par(y, kind)}$。`],
            r,
            [
              [
                ["The sign", "定符号"],
                ["The signs are different, so the product is negative.", "两数符号不同，所以积是负数。"],
              ],
              [
                ["The size", "算大小"],
                ["Multiply the absolute values and put on the sign:", "把绝对值相乘，再加上符号："],
                [
                  `${show(a, kind)} \\times ${show(b, kind)} = ${show(a.mul(b), kind)}`,
                  `${par(x, kind)} \\times ${par(y, kind)} = ${show(r, kind)}`,
                ],
              ],
            ],
            [
              `Divide back: $${show(r, kind)} \\div ${par(y, kind)} = ${show(x, kind)}$.`,
              `除回去：$${show(r, kind)} \\div ${par(y, kind)} = ${show(x, kind)}$。`,
            ],
            [
              [r.neg(), "The sign is wrong: different signs give a negative product.", "符号错了：异号两数相乘，积为负数。"],
              [x.add(y), "That adds the factors instead of multiplying them.", "这是把两个因数相加了，应该相乘。"],
              kind === "decimal"
                ? [
                    r.mul(Q.of(10)),
                    "The decimal point is in the wrong place: count the decimal places of both factors.",
                    "小数点位置错了：要数清两个因数一共有几位小数。",
                  ]
                : [x.div(y), "That divides instead of multiplying.", "这是做了除法，应该相乘。"],
            ],
            kindForm(kind),
          );
        },
        lineFigure(
          {
            lo: -2,
            hi: 0.5,
            step: 0.25,
            labels: [-2, -1, 0],
            label: plainLabel,
            marks: [{ at: -1.5, text: "-1.5", result: true }],
            jumps: [
              [0, -0.75],
              [-0.75, -1.5],
            ],
          },
          [
            "A number line: two jumps of -0.75 from 0 land on -1.5, so 2 × (-0.75) = -1.5.",
            "数轴：从 0 出发跳两次 -0.75，落在 -1.5，所以 2 × (-0.75) = -1.5。",
          ],
        ),
      ),
    ],
  ),
  [
    "A diver goes down $4$ meters each minute. Where is the diver after $3$ minutes, compared with the start?",
    "潜水员每分钟下降 $4$ 米。$3$ 分钟后，他在起点的什么位置？",
  ],
  [
    "$3 \\times (-4) = -12$, that is $12$ meters below; and $(-4) + (-4) + (-4) = -12$.",
    "$3 \\times (-4) = -12$，即在起点下方 $12$ 米；而 $(-4) + (-4) + (-4) = -12$。",
  ],
  [
    "multiply a positive number by a negative one: multiply the sizes and make the product negative.",
    "正数乘负数：把绝对值相乘，积取负号。",
  ],
);

/** multiplyingNegativeNumbers multiplies two or more negative factors. */
export const multiplyingNegativeNumbers = withIntro(
  topic(
    "multiplying-negative-numbers",
    t("Multiplying Negative Numbers", "负数相乘"),
    t(
      "The product of two negative numbers is positive: (−3) × (−4) = 12. With several factors, count the negative ones: an even number of negative factors gives a positive product, an odd number a negative product.",
      "两个负数的积是正数：(−3) × (−4) = 12。多个因数相乘时，数一数负因数的个数：偶数个负因数，积为正；奇数个负因数，积为负。",
    ),
    ["multiplying-positive-numbers-with-negative-numbers"],
    ["7.NS.A.2a", "7.NS.A.2c"],
    [
      lesson(
        "two-negative-factors",
        ["Two negative factors", "两个负因数"],
        [
          [
            "The product of two negative numbers is positive. Look at the pattern $2 \\times (-4) = -8$, $1 \\times (-4) = -4$, $0 \\times (-4) = 0$: each step adds $4$, so $(-1) \\times (-4) = 4$ and $(-2) \\times (-4) = 8$. Multiply the absolute values and keep the result positive: $\\left(-\\frac{1}{2}\\right) \\times \\left(-\\frac{4}{5}\\right) = \\frac{2}{5}$.",
            "两个负数的积是正数。看这组算式：$2 \\times (-4) = -8$，$1 \\times (-4) = -4$，$0 \\times (-4) = 0$，每次增加 $4$，所以 $(-1) \\times (-4) = 4$，$(-2) \\times (-4) = 8$。把绝对值相乘，结果取正：$\\left(-\\frac{1}{2}\\right) \\times \\left(-\\frac{4}{5}\\right) = \\frac{2}{5}$。",
          ],
          ["Divide back: $8 \\div (-4) = -2$.", "除回去：$8 \\div (-4) = -2$。"],
          [
            "Two negatives do not make a negative: $(-3) \\times (-4)$ is $12$, not $-12$.",
            "两个负数相乘不是负数：$(-3) \\times (-4)$ 是 $12$，不是 $-12$。",
          ],
        ],
        (rng) => {
          const kind: Kind = rng.pick(["fraction", "fraction", "decimal"] as const);
          const ints = kind === "fraction" && rng.bool();
          const a = ints ? Q.of(rng.int(2, 15)) : smallFactor(rng, kind);
          const b = ints ? Q.of(rng.int(2, 15)) : smallFactor(rng, kind);
          const r = a.mul(b);
          return valued(
            [
              `Evaluate $${par(a.neg(), kind)} \\times ${par(b.neg(), kind)}$.`,
              `计算 $${par(a.neg(), kind)} \\times ${par(b.neg(), kind)}$。`,
            ],
            r,
            [
              [
                ["The sign", "定符号"],
                ["Both factors are negative, so the product is positive.", "两个因数都是负数，所以积是正数。"],
              ],
              [
                ["The size", "算大小"],
                ["Multiply the absolute values:", "把绝对值相乘："],
                [`${show(a, kind)} \\times ${show(b, kind)} = ${show(r, kind)}`],
              ],
            ],
            [
              `Divide back: $${show(r, kind)} \\div ${par(b.neg(), kind)} = ${show(a.neg(), kind)}$.`,
              `除回去：$${show(r, kind)} \\div ${par(b.neg(), kind)} = ${show(a.neg(), kind)}$。`,
            ],
            [
              [r.neg(), "The sign is wrong: two negative factors give a positive product.", "符号错了：两个负因数的积是正数。"],
              [a.add(b).neg(), "That adds the factors instead of multiplying them.", "这是把两个因数相加了，应该相乘。"],
              [a.add(b), "That adds the sizes instead of multiplying them.", "这是把绝对值相加了，应该相乘。"],
            ],
            kindForm(kind),
          );
        },
        tableFigure(["2(-4)", "1(-4)", "0(-4)", "-1(-4)", "-2(-4)"], [-8, -4, 0, 4, 8]),
      ),
      lesson(
        "several-factors",
        ["Several factors", "多个因数"],
        [
          [
            "In a product of several numbers, each pair of negative factors gives a positive. Count the negative factors: an even number of them makes the product positive, and an odd number makes it negative. $(-2) \\times 3 \\times (-1) \\times (-5)$ has three negative factors, an odd number, so it is negative: $-(2 \\times 3 \\times 1 \\times 5) = -30$.",
            "几个数相乘时，每两个负因数相乘得正数。数一数负因数的个数：偶数个时积为正，奇数个时积为负。$(-2) \\times 3 \\times (-1) \\times (-5)$ 有三个负因数，是奇数个，所以积为负：$-(2 \\times 3 \\times 1 \\times 5) = -30$。",
          ],
          [
            "Multiply from left to right: $(-2) \\times 3 = -6$, $(-6) \\times (-1) = 6$, $6 \\times (-5) = -30$.",
            "从左往右乘：$(-2) \\times 3 = -6$，$(-6) \\times (-1) = 6$，$6 \\times (-5) = -30$。",
          ],
          ["Count every negative factor: missing one flips the sign of the answer.", "每个负因数都要数到：漏掉一个，答案的符号就反了。"],
        ],
        (rng) => {
          const n = rng.int(3, 4);
          let fs: number[];
          do fs = Array.from({ length: n }, () => rng.nonZero(-6, 6));
          while (fs.filter((f) => f < 0).length < 2 || fs.every((f) => Math.abs(f) === 1));
          const negs = fs.filter((f) => f < 0).length;
          const r = fs.reduce((p, f) => p * f, 1);
          const even = negs % 2 === 0;
          const running: string[] = [];
          let acc = fs[0] as number;
          for (const f of fs.slice(1)) {
            running.push(`${par(Q.of(acc))} \\times ${par(Q.of(f))} = ${acc * f}`);
            acc *= f;
          }
          return valued(
            [`Evaluate $${fs.map((f) => par(Q.of(f))).join(" \\times ")}$.`, `计算 $${fs.map((f) => par(Q.of(f))).join(" \\times ")}$。`],
            r,
            [
              [
                ["Count the negatives", "数负因数"],
                [
                  `There are $${negs}$ negative factors, an ${even ? "even" : "odd"} number, so the product is ${even ? "positive" : "negative"}.`,
                  `负因数有 $${negs}$ 个，是${even ? "偶" : "奇"}数个，所以积为${even ? "正" : "负"}数。`,
                ],
              ],
              [
                ["The size", "算大小"],
                ["Multiply the absolute values and put on the sign:", "把绝对值相乘，再加上符号："],
                [`${r < 0 ? "-" : ""}(${fs.map((f) => Math.abs(f)).join(" \\times ")}) = ${r}`],
              ],
            ],
            [`Multiply from left to right: $${running.join("$, $")}$.`, `从左往右乘：$${running.join("$，$")}$。`],
            [
              [-r, "The sign is wrong: count the negative factors again.", "符号错了：再数一数负因数的个数。"],
              [fs.reduce((p, f) => p + f, 0), "That adds the factors instead of multiplying them.", "这是把因数相加了，应该相乘。"],
              [
                fs.reduce((p, f) => p + Math.abs(f), 0),
                "That adds the sizes instead of multiplying them.",
                "这是把绝对值相加了，应该相乘。",
              ],
            ],
          );
        },
        tableFigure(["(-2)(3)", "×(-1)", "×(-5)"], [-6, 6, -30]),
      ),
    ],
  ),
  ["Is $(-3) \\times (-4)$ equal to $12$ or $-12$?", "$(-3) \\times (-4)$ 等于 $12$ 还是 $-12$？"],
  [
    "It is $12$: two negative factors give a positive product; and $12 \\div (-4) = -3$.",
    "等于 $12$：两个负因数的积是正数；而 $12 \\div (-4) = -3$。",
  ],
  ["multiply negative numbers by counting the negative factors to find the sign.", "负数相乘：数负因数的个数来确定符号。"],
);

/** dividingWithNegativeNumbers divides integers with signs and finds missing factors. */
export const dividingWithNegativeNumbers = withIntro(
  topic(
    "dividing-with-negative-numbers",
    t("Dividing With Negative Numbers", "负数的除法"),
    t(
      "Division follows the same sign rules as multiplication, because a ÷ b is the number that multiplies b to give a: −24 ÷ 6 = −4 since 6 × (−4) = −24, and −24 ÷ (−6) = 4 since (−6) × 4 = −24.",
      "除法的符号法则与乘法相同，因为 a ÷ b 就是乘 b 得 a 的那个数：−24 ÷ 6 = −4，因为 6 × (−4) = −24；−24 ÷ (−6) = 4，因为 (−6) × 4 = −24。",
    ),
    ["multiplying-negative-numbers"],
    ["7.NS.A.2b"],
    [
      lesson(
        "dividing-signed-integers",
        ["Dividing integers", "整数相除"],
        [
          [
            "Division follows the same sign rules as multiplication, since it undoes multiplication. If the two numbers have the same sign the quotient is positive; if their signs differ it is negative. $\\frac{-36}{9} = -4$, $36 \\div (-9) = -4$ and $\\frac{-36}{-9} = 4$.",
            "除法是乘法的逆运算，所以符号法则与乘法相同。两个数同号，商为正；异号，商为负。$\\frac{-36}{9} = -4$，$36 \\div (-9) = -4$，$\\frac{-36}{-9} = 4$。",
          ],
          ["Multiply back: $9 \\times (-4) = -36$.", "乘回去：$9 \\times (-4) = -36$。"],
          [
            "Two negatives divide to a positive: $\\frac{-36}{-9}$ is $4$, not $-4$.",
            "两个负数相除得正数：$\\frac{-36}{-9}$ 是 $4$，不是 $-4$。",
          ],
        ],
        (rng) => {
          const q = rng.int(2, 15);
          const d = rng.int(2, 12);
          const [sa, sb] = rng.pick([
            [-1, 1],
            [1, -1],
            [-1, -1],
          ] as const);
          const a = sa * q * d;
          const b = sb * d;
          const r = a / b;
          const shown = rng.bool() ? `\\frac{${a}}{${b}}` : `${a} \\div ${par(Q.of(b))}`;
          return valued(
            [`Evaluate $${shown}$.`, `计算 $${shown}$。`],
            r,
            [
              [
                ["The sign", "定符号"],
                [
                  sa === sb
                    ? "Both numbers are negative, so the quotient is positive."
                    : "The signs are different, so the quotient is negative.",
                  sa === sb ? "两个数都是负数，所以商是正数。" : "两数符号不同，所以商是负数。",
                ],
              ],
              [
                ["The size", "算大小"],
                ["Divide the absolute values and put on the sign:", "把绝对值相除，再加上符号："],
                [`${q * d} \\div ${d} = ${q}`, `${shown} = ${r}`],
              ],
            ],
            [
              `Multiply back: $${par(Q.of(b))} \\times ${par(Q.of(r))} = ${a}$.`,
              `乘回去：$${par(Q.of(b))} \\times ${par(Q.of(r))} = ${a}$。`,
            ],
            [
              [
                -r,
                "The sign is wrong: same signs give a positive quotient, different signs a negative one.",
                "符号错了：同号相除得正，异号相除得负。",
              ],
              [Q.of(b, a), "That divides the other way round.", "这是把除数和被除数弄反了。"],
              [a * b, "That multiplies instead of dividing.", "这是做了乘法，应该相除。"],
            ],
          );
        },
        tableFigure(["6(-4)", "-24÷6", "-24÷(-6)"], [-24, -4, 4]),
      ),
      lesson(
        "finding-a-missing-factor",
        ["Finding a missing factor", "求缺少的因数"],
        [
          [
            "A missing factor is found by division: divide the product by the known factor. Then check the sign of the answer with the multiplication rules. $(-6) \\times \\square = 42$: $\\square = 42 \\div (-6) = -7$.",
            "求未知的因数用除法：用积除以已知的因数。然后用乘法的符号法则检验答案的符号。$(-6) \\times \\square = 42$：$\\square = 42 \\div (-6) = -7$。",
          ],
          ["Multiply back: $(-6) \\times (-7) = 42$.", "乘回去：$(-6) \\times (-7) = 42$。"],
          [
            "Mind the sign: a negative factor and a positive product need a negative missing factor.",
            "注意符号：已知因数是负数、积是正数时，缺少的因数是负数。",
          ],
        ],
        (rng) => {
          const f = rng.nonZero(-12, 12);
          let m: number;
          do m = rng.nonZero(-12, 12);
          while (f > 0 && m > 0);
          const p = f * m;
          const shown = rng.bool() ? `${par(Q.of(f))} \\times \\square = ${p}` : `\\square \\times ${par(Q.of(f))} = ${p}`;
          return valued(
            [`Find the missing number. $$${shown}$$`, `求方框中的数。$$${shown}$$`],
            m,
            [
              [
                ["Divide", "相除"],
                ["Divide the product by the known factor:", "用积除以已知的因数："],
                [`\\square = ${p} \\div ${par(Q.of(f))}`],
              ],
              [
                ["The sign", "定符号"],
                [
                  p > 0 === f > 0
                    ? "The signs are the same, so the quotient is positive:"
                    : "The signs are different, so the quotient is negative:",
                  p > 0 === f > 0 ? "两数同号，所以商为正数：" : "两数异号，所以商为负数：",
                ],
                [`${p} \\div ${par(Q.of(f))} = ${m}`],
              ],
            ],
            [
              `Multiply back: $${par(Q.of(f))} \\times ${par(Q.of(m))} = ${p}$.`,
              `乘回去：$${par(Q.of(f))} \\times ${par(Q.of(m))} = ${p}$。`,
            ],
            [
              [-m, "The sign is wrong: multiply back to check it.", "符号错了：乘回去检验一下。"],
              [p - f, "That subtracts the factor; a missing factor is found by dividing.", "这是减去了因数；求缺少的因数要用除法。"],
              [p + f, "That adds the factor; a missing factor is found by dividing.", "这是加上了因数；求缺少的因数要用除法。"],
            ],
          );
        },
        tableFigure(["(-6)(?)", "42÷(-6)"], [42, -7]),
      ),
    ],
  ),
  ["What is $-24 \\div (-6)$?", "$-24 \\div (-6)$ 等于多少？"],
  ["It is $4$: same signs give a positive quotient; and $(-6) \\times 4 = -24$.", "等于 $4$：同号相除得正数；而 $(-6) \\times 4 = -24$。"],
  ["divide with negative numbers using the same sign rules as multiplication.", "用与乘法相同的符号法则做负数的除法。"],
);

/** signedFraction writes ±n/±d with the signs where they were drawn: "\frac{-3}{4}", "\frac{3}{-4}", "-\frac{3}{4}". */
const signedFraction = (n: number, d: number, outside = false) => (outside ? `-\\frac{${n}}{${d}}` : `\\frac{${n}}{${d}}`);

/** fractionOf writes a nonzero rational as a signed fraction with both parts shown, whole numbers over 1: "-\frac{5}{1}". */
const fractionOf = (v: Q) => `${v.sign() < 0 ? "-" : ""}\\frac{${v.abs().n}}{${v.abs().d}}`;

/** threeQuarterLine draws -3/4 on a number line from -1 to 1 in quarters. */
const threeQuarterLine = (alt: Pair): Figure =>
  lineFigure({ lo: -1, hi: 1, step: 0.25, labels: [-1, 0, 1], label: plainLabel, marks: [{ at: -0.75, text: "-3/4", result: true }] }, alt);

/** equivalentFractionsWithNegativeNumbers moves the sign of a fraction between numerator, denominator and front. */
export const equivalentFractionsWithNegativeNumbers = withIntro(
  topic(
    "equivalent-fractions-with-negative-numbers",
    t("Equivalent Fractions With Negative Numbers", "含负数的等值分数"),
    t(
      "A fraction is a quotient, so its sign follows the division rules: −(p/q) = (−p)/q = p/(−q), while (−p)/(−q) = p/q. A negative fraction can be simplified like any other: 15/(−20) = −3/4.",
      "分数是一个商，所以它的符号遵循除法法则：−(p/q) = (−p)/q = p/(−q)，而 (−p)/(−q) = p/q。负分数也可以像其他分数一样约分：15/(−20) = −3/4。",
    ),
    ["dividing-with-negative-numbers"],
    ["7.NS.A.2b"],
    [
      lesson(
        "where-the-negative-sign-goes",
        ["Where the negative sign goes", "负号的位置"],
        [
          [
            "A fraction is a division, so one negative sign makes it negative wherever it is placed: in front, in the numerator or in the denominator. Two negative signs cancel and make the fraction positive. $-\\frac{3}{4} = \\frac{-3}{4} = \\frac{3}{-4}$, but $\\frac{-3}{-4} = \\frac{3}{4}$.",
            "分数表示除法，所以只有一个负号时，不论它写在分数前面、分子上还是分母上，分数都是负的。两个负号互相抵消，分数为正。$-\\frac{3}{4} = \\frac{-3}{4} = \\frac{3}{-4}$，但 $\\frac{-3}{-4} = \\frac{3}{4}$。",
          ],
          [
            "Read each as a division: $-3 \\div 4 = -0.75$ and $3 \\div (-4) = -0.75$.",
            "把每个分数看成除法：$-3 \\div 4 = -0.75$，$3 \\div (-4) = -0.75$。",
          ],
          [
            "Do not put a negative sign in both places: $\\frac{-3}{-4}$ is positive.",
            "不要在分子分母上都放负号：$\\frac{-3}{-4}$ 是正数。",
          ],
        ],
        (rng) => {
          let p: number;
          let q: number;
          do {
            p = rng.int(1, 12);
            q = rng.int(2, 13);
          } while (gcd(p, q) !== 1 || p === q);
          const form = rng.int(0, 2);
          const target = form === 0 ? signedFraction(p, q, true) : form === 1 ? signedFraction(-p, q) : signedFraction(p, -q);
          const equal = [signedFraction(p, q, true), signedFraction(-p, q), signedFraction(p, -q)].filter((s) => s !== target);
          return chosenMath(
            rng,
            [`Which fraction is equal to $${target}$?`, `哪个分数等于 $${target}$？`],
            rng.pick(equal),
            [
              [
                signedFraction(-p, -q),
                "Two negative signs cancel, so this fraction is positive.",
                "两个负号互相抵消，所以这个分数是正数。",
              ],
              [signedFraction(p, q), "This fraction has no negative sign, so it is positive.", "这个分数没有负号，是正数。"],
              [signedFraction(-q, p), "The numerator and denominator are swapped.", "分子和分母颠倒了。"],
              [signedFraction(q, -p), "The numerator and denominator are swapped.", "分子和分母颠倒了。"],
            ],
            [
              [
                ["Count the signs", "数负号"],
                [`$${target}$ has one negative sign, so it is negative.`, `$${target}$ 只有一个负号，所以是负数。`],
              ],
              [
                ["Move the sign", "移动负号"],
                ["One negative sign gives the same value wherever it is written:", "只有一个负号时，不论写在哪里，值都相同："],
                [`-\\frac{${p}}{${q}} = \\frac{-${p}}{${q}} = \\frac{${p}}{-${q}}`],
              ],
            ],
            [
              `As divisions, $-${p} \\div ${q}$ and $${p} \\div (-${q})$ have the same value, $-\\frac{${p}}{${q}}$.`,
              `看成除法，$-${p} \\div ${q}$ 与 $${p} \\div (-${q})$ 的值相同，都是 $-\\frac{${p}}{${q}}$。`,
            ],
          );
        },
        threeQuarterLine([
          "A number line: -3/4, (-3)/4 and 3/(-4) are all the same point, three quarters left of zero.",
          "数轴：-3/4、(-3)/4 和 3/(-4) 是同一个点，在零左边四分之三处。",
        ]),
      ),
      lesson(
        "simplifying-fractions-with-negative-signs",
        ["Simplifying", "约分"],
        [
          [
            "To simplify a fraction with negative signs, first decide the sign of the whole fraction, then simplify the absolute values by dividing by their greatest common factor. $\\frac{15}{-20} = -\\frac{15}{20} = -\\frac{3}{4}$ and $\\frac{-12}{-18} = \\frac{12}{18} = \\frac{2}{3}$.",
            "化简带负号的分数时，先确定整个分数的符号，再用分子分母绝对值的最大公因数去约分。$\\frac{15}{-20} = -\\frac{15}{20} = -\\frac{3}{4}$；$\\frac{-12}{-18} = \\frac{12}{18} = \\frac{2}{3}$。",
          ],
          [
            "Scale back: $-\\frac{3 \\times 5}{4 \\times 5} = -\\frac{15}{20}$, the same as $\\frac{15}{-20}$.",
            "放大回去：$-\\frac{3 \\times 5}{4 \\times 5} = -\\frac{15}{20}$，与 $\\frac{15}{-20}$ 相同。",
          ],
          ["Divide the numerator and the denominator by the same number.", "分子和分母要除以同一个数。"],
        ],
        (rng) => {
          let p: number;
          let q: number;
          do {
            p = rng.int(1, 9);
            q = rng.int(2, 10);
          } while (gcd(p, q) !== 1 || p === q);
          const k = rng.int(2, 8);
          const [sn, sd] = rng.pick([
            [-1, 1],
            [1, -1],
            [-1, -1],
          ] as const);
          const r = Q.of(sn * sd * p, q);
          const neg = sn * sd < 0;
          const given = `\\frac{${sn * p * k}}{${sd * q * k}}`;
          return valued(
            [`Write $${given}$ as a fraction in simplest form.`, `把 $${given}$ 化成最简分数。`],
            r,
            [
              [
                ["The sign", "定符号"],
                [
                  neg
                    ? "The fraction has one negative sign, so it is negative:"
                    : "The fraction has two negative signs, so it is positive:",
                  neg ? "分数中有一个负号，所以是负数：" : "分数中有两个负号，所以是正数：",
                ],
                [`${given} = ${neg ? "-" : ""}\\frac{${p * k}}{${q * k}}`],
              ],
              [
                ["Simplify", "约分"],
                [`Divide the numerator and denominator by $${k}$:`, `分子分母同除以 $${k}$：`],
                [`${neg ? "-" : ""}\\frac{${p * k} \\div ${k}}{${q * k} \\div ${k}} = ${r.toLatex()}`],
              ],
            ],
            [
              `Scale back: $${neg ? "-" : ""}\\frac{${p} \\times ${k}}{${q} \\times ${k}} = ${neg ? "-" : ""}\\frac{${p * k}}{${q * k}}$, the same as $${given}$.`,
              `放大回去：$${neg ? "-" : ""}\\frac{${p} \\times ${k}}{${q} \\times ${k}} = ${neg ? "-" : ""}\\frac{${p * k}}{${q * k}}$，与 $${given}$ 相同。`,
            ],
            [
              [
                r.neg(),
                neg ? "The sign is wrong: one negative sign makes the fraction negative." : "The sign is wrong: two negative signs cancel.",
                neg ? "符号错了：一个负号使分数为负。" : "符号错了：两个负号互相抵消。",
              ],
              [Q.of(sn * sd * q, p), "The fraction is upside down.", "分数颠倒了。"],
              [Q.of(sn * sd * p * k, q), `That divides only the denominator by $${k}$.`, `这是只把分母除以了 $${k}$。`],
            ],
            { form: "fraction" },
          );
        },
        threeQuarterLine([
          "A number line: 15/(-20) simplifies to -3/4, three quarters left of zero.",
          "数轴：15/(-20) 约分后是 -3/4，在零左边四分之三处。",
        ]),
      ),
    ],
  ),
  ["Is $\\frac{3}{-4}$ the same number as $-\\frac{3}{4}$?", "$\\frac{3}{-4}$ 与 $-\\frac{3}{4}$ 是同一个数吗？"],
  [
    "Yes: one negative sign makes it negative; and $3 \\div (-4) = -0.75 = -\\frac{3}{4}$.",
    "是的：只有一个负号，所以是负数；而 $3 \\div (-4) = -0.75 = -\\frac{3}{4}$。",
  ],
  ["move the negative sign of a fraction and simplify fractions with negative signs.", "移动分数的负号，并化简带负号的分数。"],
);

/** dividingWithNegativeDecimalsAndFractions divides signed fractions, mixed numbers and decimals. */
export const dividingWithNegativeDecimalsAndFractions = withIntro(
  topic(
    "dividing-with-negative-decimals-and-fractions",
    t("Dividing With Negative Decimals and Fractions", "负小数与负分数的除法"),
    t(
      "Divide the sizes as usual, multiplying by the reciprocal for fractions, then apply the sign rule: −2/3 ÷ 4/5 = −2/3 × 5/4 = −5/6, and −4.8 ÷ (−0.6) = 8.",
      "像往常一样计算绝对值的商，分数除法就乘除数的倒数，再按符号法则确定符号：−2/3 ÷ 4/5 = −2/3 × 5/4 = −5/6；−4.8 ÷ (−0.6) = 8。",
    ),
    ["dividing-with-negative-numbers", "dividing-fractions", "dividing-decimals-using-the-standard-algorithm"],
    ["7.NS.A.2b", "7.NS.A.2c"],
    [
      lesson(
        "dividing-signed-fractions",
        ["Fractions and mixed numbers", "分数与带分数"],
        [
          [
            "To divide by a fraction, multiply by its reciprocal. Decide the sign with the usual rule, same signs positive and different signs negative, then simplify. $-\\frac{2}{3} \\div \\frac{4}{5} = -\\frac{2}{3} \\times \\frac{5}{4} = -\\frac{10}{12} = -\\frac{5}{6}$.",
            "除以一个分数，等于乘它的倒数。按通常的法则确定符号，同号为正、异号为负，再化简。$-\\frac{2}{3} \\div \\frac{4}{5} = -\\frac{2}{3} \\times \\frac{5}{4} = -\\frac{10}{12} = -\\frac{5}{6}$。",
          ],
          [
            "Multiply back: $-\\frac{5}{6} \\times \\frac{4}{5} = -\\frac{20}{30} = -\\frac{2}{3}$.",
            "乘回去：$-\\frac{5}{6} \\times \\frac{4}{5} = -\\frac{20}{30} = -\\frac{2}{3}$。",
          ],
          ["Flip the divisor, not the first number.", "要把除数颠倒，不是把被除数颠倒。"],
        ],
        (rng) => {
          const kind: Kind = rng.bool(0.7) ? "fraction" : "mixed";
          let a: Q;
          let b: Q;
          do {
            a = smallFactor(rng, kind);
            b = smallFactor(rng, kind);
          } while (a.eq(b) || (a.isInteger() && b.isInteger()));
          const [sa, sb] = rng.pick([
            [-1, 1],
            [1, -1],
            [-1, -1],
          ] as const);
          const [x, y] = [a.mul(Q.of(sa)), b.mul(Q.of(sb))];
          const r = x.div(y);
          return valued(
            [`Evaluate $${show(x, kind)} \\div ${par(y, kind)}$.`, `计算 $${show(x, kind)} \\div ${par(y, kind)}$。`],
            r,
            [
              [
                ["The size", "算大小"],
                ["Multiply the sizes by the reciprocal of the divisor:", "用被除数的绝对值乘除数绝对值的倒数："],
                [`${a.toLatex()} \\times ${Q.one.div(b).toLatex()} = ${a.div(b).toLatex()}`],
              ],
              [
                ["The sign", "定符号"],
                [
                  sa === sb
                    ? "Both numbers are negative, so the quotient is positive:"
                    : "The signs are different, so the quotient is negative:",
                  sa === sb ? "两个数都是负数，所以商是正数：" : "两数符号不同，所以商是负数：",
                ],
                [r.toLatex()],
              ],
            ],
            [`Multiply back: $${par(r)} \\times ${par(y)} = ${x.toLatex()}$.`, `乘回去：$${par(r)} \\times ${par(y)} = ${x.toLatex()}$。`],
            [
              [
                r.neg(),
                "The sign is wrong: same signs give a positive quotient, different signs a negative one.",
                "符号错了：同号相除得正，异号相除得负。",
              ],
              [x.mul(y), "That multiplies without flipping the divisor.", "这是直接相乘，没有把除数颠倒。"],
              [y.div(x), "That divides the other way round.", "这是把除数和被除数弄反了。"],
            ],
          );
        },
        lineFigure(
          {
            lo: -1,
            hi: 0.5,
            step: 1 / 6,
            labels: [-1, 0],
            label: plainLabel,
            marks: [{ at: -5 / 6, text: "-5/6", result: true }],
          },
          [
            "A number line in sixths: -2/3 divided by 4/5 is -5/6, just right of -1.",
            "以六分之一为单位的数轴：-2/3 除以 4/5 得 -5/6，在 -1 右边一点。",
          ],
        ),
      ),
      lesson(
        "dividing-signed-decimals",
        ["Decimals", "小数"],
        [
          [
            "To divide decimals, multiply both numbers by the same power of ten until the divisor is a whole number. The sign of the quotient follows the same rule as for integers. $-4.8 \\div 0.6 = -48 \\div 6 = -8$: multiplying both numbers by $10$ does not change the quotient.",
            "小数相除时，把两个数同时乘以 $10$ 的同一个幂，直到除数变成整数。商的符号与整数除法的法则相同。$-4.8 \\div 0.6 = -48 \\div 6 = -8$：把两个数都乘 $10$，商不变。",
          ],
          ["Multiply back: $-8 \\times 0.6 = -4.8$.", "乘回去：$-8 \\times 0.6 = -4.8$。"],
          ["Move the decimal point in both numbers by the same number of places.", "两个数的小数点要移动同样的位数。"],
        ],
        (rng) => {
          const d = decQ(rng, 1, 2, 30);
          const q = rng.bool() ? Q.of(rng.int(2, 15)) : decQ(rng, 1, 2, 60);
          const [sa, sb] = rng.pick([
            [-1, 1],
            [1, -1],
            [-1, -1],
          ] as const);
          const a = q.mul(d).mul(Q.of(sa));
          const b = d.mul(Q.of(sb));
          const r = a.div(b);
          const ten = Q.of(10);
          return valued(
            [`Evaluate $${dec(a)} \\div ${par(b, "decimal")}$.`, `计算 $${dec(a)} \\div ${par(b, "decimal")}$。`],
            r,
            [
              [
                ["Make the divisor whole", "把除数变成整数"],
                ["Multiply both numbers by $10$; the quotient does not change:", "两个数都乘 $10$，商不变："],
                [`${dec(a)} \\div ${par(b, "decimal")} = ${dec(a.mul(ten))} \\div ${par(b.mul(ten), "decimal")}`],
              ],
              [
                ["Divide and sign", "相除并定符号"],
                [
                  sa === sb
                    ? "Both numbers are negative, so the quotient is positive:"
                    : "The signs are different, so the quotient is negative:",
                  sa === sb ? "两个数都是负数，所以商是正数：" : "两数符号不同，所以商是负数：",
                ],
                [`${dec(a.mul(ten))} \\div ${par(b.mul(ten), "decimal")} = ${dec(r)}`],
              ],
            ],
            [
              `Multiply back: $${par(r, "decimal")} \\times ${par(b, "decimal")} = ${dec(a)}$.`,
              `乘回去：$${par(r, "decimal")} \\times ${par(b, "decimal")} = ${dec(a)}$。`,
            ],
            [
              [
                r.neg(),
                "The sign is wrong: same signs give a positive quotient, different signs a negative one.",
                "符号错了：同号相除得正，异号相除得负。",
              ],
              [r.mul(ten), "The decimal point is in the wrong place: move it in both numbers.", "小数点位置错了：两个数的小数点都要移动。"],
              [r.div(ten), "The decimal point is in the wrong place: move it in both numbers.", "小数点位置错了：两个数的小数点都要移动。"],
            ],
            { form: "decimal" },
          );
        },
        tableFigure(["-4.8÷0.6", "-48÷6"], [-8, -8]),
      ),
    ],
  ),
  [
    "A tank's water level drops $4.8$ cm in $0.6$ hours. What is the change per hour?",
    "水箱的水位在 $0.6$ 小时内下降了 $4.8$ 厘米。每小时变化多少？",
  ],
  [
    "$-4.8 \\div 0.6 = -48 \\div 6 = -8$ cm per hour; and $-8 \\times 0.6 = -4.8$.",
    "$-4.8 \\div 0.6 = -48 \\div 6 = -8$ 厘米每小时；而 $-8 \\times 0.6 = -4.8$。",
  ],
  [
    "divide negative fractions and decimals: divide the sizes, then use the sign rule.",
    "负分数和负小数的除法：先算绝对值的商，再用符号法则。",
  ],
);

/** reciprocalDecimals are decimals whose reciprocals are simple. */
const reciprocalDecimals = [
  "0.25",
  "0.2",
  "0.5",
  "1.25",
  "2.5",
  "0.4",
  "0.125",
  "0.8",
  "0.75",
  "0.05",
  "0.1",
  "1.5",
  "0.6",
  "2.25",
  "0.04",
  "0.02",
];

/** flipFractionPart is the mistake of flipping only the fraction part of a mixed number: −2 1/3 → −(2 + 3) = −5. */
function flipFractionPart(v: Q): Q {
  const a = v.abs();
  const whole = Q.of(a.n / a.d);
  const flipped = whole.add(Q.one.div(a.sub(whole)));
  return v.sign() < 0 ? flipped.neg() : flipped;
}

/** reciprocalsOfRationalNumbers finds reciprocals of negative fractions, mixed numbers and decimals. */
export const reciprocalsOfRationalNumbers = withIntro(
  topic(
    "reciprocals-of-rational-numbers",
    t("Reciprocals of Rational Numbers", "有理数的倒数"),
    t(
      "The reciprocal of a nonzero number is the number that multiplies it to give 1. A number and its reciprocal have the same sign: the reciprocal of −2 1/3 = −7/3 is −3/7, and that of −0.25 = −1/4 is −4. Zero has no reciprocal.",
      "一个非零数的倒数是与它相乘得 1 的数。一个数与它的倒数符号相同：−2 1/3 = −7/3 的倒数是 −3/7，−0.25 = −1/4 的倒数是 −4。0 没有倒数。",
    ),
    ["reciprocals", "multiplying-negative-numbers"],
    ["7.NS.A.2b", "7.NS.A.2c"],
    [
      lesson(
        "reciprocals-of-negative-fractions-and-mixed-numbers",
        ["Fractions and mixed numbers", "分数与带分数"],
        [
          [
            "The reciprocal of a number is the number that multiplies with it to $1$. Write a mixed number as an improper fraction and flip it. A negative number has a negative reciprocal, because the product must be positive. $-2\\frac{1}{3} = -\\frac{7}{3}$, so its reciprocal is $-\\frac{3}{7}$.",
            "一个数的倒数是与它相乘得 $1$ 的数。先把带分数化成假分数，再把分子分母颠倒。负数的倒数也是负数，因为两数之积必须是正数。$-2\\frac{1}{3} = -\\frac{7}{3}$，所以它的倒数是 $-\\frac{3}{7}$。",
          ],
          [
            "Multiply: $\\left(-\\frac{7}{3}\\right) \\times \\left(-\\frac{3}{7}\\right) = 1$.",
            "相乘：$\\left(-\\frac{7}{3}\\right) \\times \\left(-\\frac{3}{7}\\right) = 1$。",
          ],
          ["Keep the sign: the reciprocal of a negative number is negative, not positive.", "符号不变：负数的倒数是负数，不是正数。"],
        ],
        (rng) => {
          const kind: Kind = rng.pick(["fraction", "mixed", "fraction"] as const);
          const base =
            kind === "mixed" ? properQ(rng, 9).add(Q.of(rng.int(1, 5))) : rng.bool(0.2) ? Q.of(rng.int(2, 20)) : properQ(rng, 12);
          const v = rng.bool(0.75) ? base.neg() : base;
          const r = Q.one.div(v);
          return valued(
            [`What is the reciprocal of $${show(v, kind)}$?`, `$${show(v, kind)}$ 的倒数是多少？`],
            r,
            [
              kind === "mixed"
                ? [
                    ["As a fraction", "写成分数"],
                    ["Write the mixed number as an improper fraction:", "把带分数化成假分数："],
                    [`${show(v, kind)} = ${fractionOf(v)}`],
                  ]
                : [
                    ["The sign", "定符号"],
                    [
                      `The number is ${v.sign() < 0 ? "negative" : "positive"}, so its reciprocal is ${v.sign() < 0 ? "negative" : "positive"} too.`,
                      `这个数是${v.sign() < 0 ? "负数" : "正数"}，所以它的倒数也是${v.sign() < 0 ? "负数" : "正数"}。`,
                    ],
                  ],
              [
                ["Flip", "颠倒"],
                ["Swap the numerator and denominator and keep the sign:", "交换分子与分母，符号不变："],
                [`${fractionOf(v)} \\to ${r.toLatex()}`],
              ],
            ],
            [`Multiply: $${par(v)} \\times ${par(r)} = 1$.`, `相乘：$${par(v)} \\times ${par(r)} = 1$。`],
            [
              [r.neg(), "The sign is wrong: a number and its reciprocal have the same sign.", "符号错了：一个数与它的倒数符号相同。"],
              [
                v.neg(),
                "That is the opposite, which adds to $0$; the reciprocal multiplies to $1$.",
                "这是相反数，相加得 $0$；倒数是相乘得 $1$。",
              ],
              ...(kind === "mixed"
                ? ([
                    [
                      flipFractionPart(v),
                      "That flips only the fraction part; write an improper fraction first.",
                      "这是只颠倒了分数部分；要先化成假分数。",
                    ],
                  ] as const)
                : []),
            ],
          );
        },
        tableFigure(["(-7/3)(-3/7)", "(-1/4)(-4)"], [1, 1]),
      ),
      lesson(
        "reciprocals-of-decimals",
        ["Decimals", "小数"],
        [
          [
            "To find the reciprocal of a decimal, first write the decimal as a fraction in simplest form. Then flip the fraction and keep the sign. $-0.25 = -\\frac{1}{4}$, so its reciprocal is $-4$. $1.25 = \\frac{5}{4}$, so its reciprocal is $\\frac{4}{5} = 0.8$.",
            "求小数的倒数，先把小数化成最简分数，再把分子分母颠倒，符号不变。$-0.25 = -\\frac{1}{4}$，所以它的倒数是 $-4$。$1.25 = \\frac{5}{4}$，所以它的倒数是 $\\frac{4}{5} = 0.8$。",
          ],
          ["Multiply: $1.25 \\times 0.8 = 1$.", "相乘：$1.25 \\times 0.8 = 1$。"],
          ["Do not change the sign: the reciprocal of $-0.25$ is $-4$, not $4$.", "不要改变符号：$-0.25$ 的倒数是 $-4$，不是 $4$。"],
        ],
        (rng) => {
          const s = rng.pick(reciprocalDecimals);
          const [w, f = ""] = s.split(".");
          const v0 = Q.of(Number(w) * 10 ** f.length + Number(f), 10 ** f.length);
          const v = rng.bool(0.7) ? v0.neg() : v0;
          const r = Q.one.div(v);
          const rShown = `${r.toLatex()}${r.d !== 1n && isTerminating(r) ? ` = ${dec(r)}` : ""}`;
          return valued(
            [`What is the reciprocal of $${dec(v)}$?`, `$${dec(v)}$ 的倒数是多少？`],
            r,
            [
              [
                ["As a fraction", "写成分数"],
                ["Write the decimal as a fraction in simplest form:", "把小数化成最简分数："],
                [`${dec(v)} = ${v.toLatex()}`],
              ],
              [["Flip", "颠倒"], ["Swap the numerator and denominator and keep the sign:", "交换分子与分母，符号不变："], [rShown]],
            ],
            [`Multiply: $${par(v, "decimal")} \\times ${par(r)} = 1$.`, `相乘：$${par(v, "decimal")} \\times ${par(r)} = 1$。`],
            [
              [r.neg(), "The sign is wrong: a number and its reciprocal have the same sign.", "符号错了：一个数与它的倒数符号相同。"],
              [
                v.neg(),
                "That is the opposite, which adds to $0$; the reciprocal multiplies to $1$.",
                "这是相反数，相加得 $0$；倒数是相乘得 $1$。",
              ],
              [v, "That is the number itself.", "这是原数本身。"],
            ],
          );
        },
        tableFigure(["(-0.25)(-4)", "(1.25)(0.8)"], [1, 1]),
      ),
    ],
  ),
  ["What number times $-0.25$ gives $1$?", "什么数乘 $-0.25$ 得 $1$？"],
  [
    "$-0.25 = -\\frac{1}{4}$, so the number is $-4$; and $(-0.25) \\times (-4) = 1$.",
    "$-0.25 = -\\frac{1}{4}$，所以这个数是 $-4$；而 $(-0.25) \\times (-4) = 1$。",
  ],
  ["find the reciprocal of a negative fraction, mixed number or decimal, keeping its sign.", "求负分数、带分数或小数的倒数，符号不变。"],
);

/** undefinedPair is the option for a quotient with divisor 0. */
const undefinedPair: Pair = ["Not defined", "无意义"];

/** mathPair writes one piece of math as an option in both languages. */
const mathPair = (latex: string): Pair => [`$${latex}$`, `$${latex}$`];

/** multiplyingAndDividingWithZero evaluates products and quotients with zero and recognizes division by zero. */
export const multiplyingAndDividingWithZero = withIntro(
  topic(
    "multiplying-and-dividing-with-zero",
    t("Multiplying and Dividing With Zero", "与零相乘和相除"),
    t(
      "Any number times 0 is 0, and 0 divided by any nonzero number is 0: (−5) × 0 = 0 and 0 ÷ (−5) = 0. Dividing by 0 is not defined: no number times 0 gives −5, so −5 ÷ 0 has no value.",
      "任何数乘 0 都得 0，0 除以任何非零数都得 0：(−5) × 0 = 0，0 ÷ (−5) = 0。除以 0 没有意义：没有哪个数乘 0 得 −5，所以 −5 ÷ 0 没有值。",
    ),
    ["dividing-with-negative-numbers"],
    ["7.NS.A.2b"],
    [
      lesson(
        "a-single-operation-with-zero",
        ["One operation with zero", "与零的一次运算"],
        [
          [
            "Any number times zero is zero, and zero divided by any nonzero number is zero. Dividing by zero is not defined, because no number can be multiplied by zero to give a nonzero result. $0 \\div (-7) = 0$ because $(-7) \\times 0 = 0$. But $-7 \\div 0$ is not defined, because no number times $0$ equals $-7$.",
            "任何数乘零都得零，零除以任何非零的数也得零。除以零没有意义，因为没有一个数乘零能得到非零的结果。$0 \\div (-7) = 0$，因为 $(-7) \\times 0 = 0$。但 $-7 \\div 0$ 没有意义，因为没有哪个数乘 $0$ 等于 $-7$。",
          ],
          [
            "Undo with multiplication: $0 \\div (-7) = 0$ since $0 \\times (-7) = 0$.",
            "用乘法还原：$0 \\div (-7) = 0$，因为 $0 \\times (-7) = 0$。",
          ],
          [
            "$0 \\div (-7)$ and $-7 \\div 0$ are different: only dividing by zero has no value.",
            "$0 \\div (-7)$ 与 $-7 \\div 0$ 不同：只有除以零才没有值。",
          ],
        ],
        (rng) => {
          const kind: Kind = rng.pick(["fraction", "fraction", "decimal"] as const);
          const a = kind === "fraction" && rng.bool() ? Q.of(rng.nonZero(-30, 30)) : signedValue(rng, kind, rng.bool(0.7) ? -1 : 1);
          const shape = rng.int(0, 4);
          const expr = [
            `${show(a, kind)} \\times 0`,
            `0 \\times ${par(a, kind)}`,
            `0 \\div ${par(a, kind)}`,
            `${show(a, kind)} \\div 0`,
            `\\frac{0}{${show(a, kind)}}`,
          ][shape] as string;
          const product = shape <= 1;
          const byZero = shape === 3;
          const aText = mathPair(show(a, kind));
          const negText = mathPair(show(a.neg(), kind));
          const zeroText = mathPair("0");
          const walk: Walk[] = byZero
            ? [
                [
                  ["The divisor", "看除数"],
                  ["The divisor is $0$.", "除数是 $0$。"],
                ],
                [
                  ["Undo", "还原"],
                  [
                    `A quotient times $0$ would have to give $${show(a, kind)}$, but any number times $0$ is $0$. So there is no value.`,
                    `商乘 $0$ 要得 $${show(a, kind)}$，可是任何数乘 $0$ 都得 $0$。所以没有值。`,
                  ],
                ],
              ]
            : product
              ? [
                  [
                    ["A factor is zero", "有一个因数是零"],
                    ["One factor is $0$.", "有一个因数是 $0$。"],
                  ],
                  [["The product", "积"], ["Any number times $0$ is $0$:", "任何数乘 $0$ 都得 $0$："], [`${expr} = 0`]],
                ]
              : [
                  [
                    ["The dividend", "看被除数"],
                    [`$0$ is divided by $${show(a, kind)}$, which is not zero.`, `$0$ 除以 $${show(a, kind)}$，除数不是零。`],
                  ],
                  [["The quotient", "商"], ["Zero divided by a nonzero number is $0$:", "零除以非零数得 $0$："], [`${expr} = 0`]],
                ];
          return chosen(
            rng,
            [`What is the value of $${expr}$?`, `$${expr}$ 的值是多少？`],
            byZero ? undefinedPair : zeroText,
            byZero
              ? [
                  [
                    zeroText,
                    "Dividing by zero is not $0$: no number times $0$ gives a nonzero number.",
                    "除以零不得 $0$：没有哪个数乘 $0$ 得非零的数。",
                  ],
                  [aText, "Dividing by zero does not leave the number unchanged.", "除以零并不会让这个数保持不变。"],
                  [negText, "Dividing by zero does not change the sign; it has no value.", "除以零不是改变符号；它没有值。"],
                ]
              : [
                  [
                    undefinedPair,
                    product ? "A product with zero is defined: it is $0$." : "Only dividing by zero is not defined; here zero is divided.",
                    product ? "与零的乘积有意义：它是 $0$。" : "只有除以零才没有意义；这里是零被除。",
                  ],
                  [
                    aText,
                    product ? "Multiplying by zero does not leave the number unchanged." : "Zero divided by a number is not that number.",
                    product ? "乘零不会让这个数保持不变。" : "零除以一个数不等于那个数。",
                  ],
                  [negText, "Zero has no sign: the answer is $0$.", "零没有正负：答案是 $0$。"],
                ],
            walk,
            byZero
              ? [
                  `Try a value: if $${show(a, kind)} \\div 0$ were some number $q$, then $q \\times 0 = ${show(a, kind)}$, which is impossible.`,
                  `试一试：如果 $${show(a, kind)} \\div 0$ 等于某个数 $q$，那么 $q \\times 0 = ${show(a, kind)}$，这不可能。`,
                ]
              : product
                ? [`Divide back: $0 \\div ${par(a, kind)} = 0$.`, `除回去：$0 \\div ${par(a, kind)} = 0$。`]
                : [`Multiply back: $0 \\times ${par(a, kind)} = 0$.`, `乘回去：$0 \\times ${par(a, kind)} = 0$。`],
          );
        },
        tableFigure(["(-7)(0)", "0÷(-7)", "-7÷0"], [0, 0, null]),
      ),
      lesson(
        "zero-inside-an-expression",
        ["Zero inside an expression", "式子中出现的零"],
        [
          [
            "Work out each part first and look for a zero. A zero factor makes a product $0$, and a zero numerator makes a fraction $0$, but a zero denominator makes it not defined. In $\\frac{8}{3 - 3}$ the denominator is $0$, so it is not defined. In $(4 + (-4)) \\times 17$ the first factor is $0$, so the product is $0$.",
            "先算出每一部分，看看有没有零。因数是零，积就是 $0$；分子是零，分数就是 $0$；但分母是零，分数就没有意义。$\\frac{8}{3 - 3}$ 的分母是 $0$，所以它没有意义。$(4 + (-4)) \\times 17$ 的第一个因数是 $0$，所以积是 $0$。",
          ],
          [
            "Check $(4 + (-4)) \\times 17$ by distributing: $4 \\times 17 + (-4) \\times 17 = 68 - 68 = 0$.",
            "用分配律检验 $(4 + (-4)) \\times 17$：$4 \\times 17 + (-4) \\times 17 = 68 - 68 = 0$。",
          ],
          [
            "Zero on top gives $0$; zero on the bottom gives no value. Do not mix them up.",
            "零在分子上得 $0$；零在分母上没有值。不要弄混。",
          ],
        ],
        (rng) => {
          const b = Q.of(rng.nonZero(-20, 20));
          const c = rng.int(1, 15);
          const z = rng.pick([`${c} - ${c}`, `${c} + (-${c})`, `-${c} + ${c}`]);
          const shape = rng.int(0, 3);
          const expr = [
            `(${z}) \\times ${par(b)}`,
            `\\frac{${b.toLatex()}}{${z}}`,
            `\\frac{${z}}{${b.toLatex()}}`,
            `${par(b)} \\times ${c} \\div ${c}`,
          ][shape] as string;
          const bText = mathPair(b.toLatex());
          const negText = mathPair(b.neg().toLatex());
          const zeroText = mathPair("0");
          const correct = shape === 1 ? undefinedPair : shape === 3 ? bText : zeroText;
          const others: [Pair, string, string][] = [
            [
              zeroText,
              shape === 1
                ? "A zero denominator does not give $0$; it gives no value."
                : "Nothing here is multiplied by zero: multiplying and dividing by the same number undo each other.",
              shape === 1 ? "分母为零不得 $0$；它没有值。" : "这里没有乘零：乘一个数再除以同一个数，互相抵消。",
            ],
            [
              undefinedPair,
              shape === 3 ? "Nothing is divided by zero here." : "The denominator is not zero, so the value is defined.",
              shape === 3 ? "这里没有除以零。" : "分母不是零，所以有意义。",
            ],
            [
              bText,
              shape === 1 ? "Dividing by zero does not leave the number unchanged." : "A zero part does not leave the number unchanged.",
              shape === 1 ? "除以零并不会让这个数保持不变。" : "有一部分是零，这个数不会保持不变。",
            ],
            [
              negText,
              shape === 3
                ? "Multiplying and dividing by a positive number does not change the sign."
                : "The sign has not changed; look for a zero instead.",
              shape === 3 ? "乘、除一个正数不会改变符号。" : "符号没有改变；要找出式子里的零。",
            ],
          ];
          const walk: Walk[] =
            shape === 0
              ? [
                  [["Find the zero", "找出零"], ["Work out the parentheses:", "先算括号："], [`${z} = 0`]],
                  [["Multiply", "相乘"], ["A zero factor makes the product zero:", "因数是零，积就是零："], [`0 \\times ${par(b)} = 0`]],
                ]
              : shape === 1
                ? [
                    [["Find the zero", "找出零"], ["Work out the denominator:", "先算分母："], [`${z} = 0`]],
                    [
                      ["Divide", "相除"],
                      ["The denominator is $0$, and division by $0$ is not defined.", "分母是 $0$，除以 $0$ 没有意义。"],
                    ],
                  ]
                : shape === 2
                  ? [
                      [["Find the zero", "找出零"], ["Work out the numerator:", "先算分子："], [`${z} = 0`]],
                      [["Divide", "相除"], ["Zero divided by a nonzero number is zero:", "零除以非零数得零："], [`0 \\div ${par(b)} = 0`]],
                    ]
                  : [
                      [
                        ["Multiply", "相乘"],
                        ["Work from left to right:", "从左往右算："],
                        [`${par(b)} \\times ${c} = ${b.mul(Q.of(c)).toLatex()}`],
                      ],
                      [
                        ["Divide", "相除"],
                        [`Dividing by $${c}$ undoes multiplying by $${c}$:`, `除以 $${c}$ 抵消了乘 $${c}$：`],
                        [`${b.mul(Q.of(c)).toLatex()} \\div ${c} = ${b.toLatex()}`],
                      ],
                    ];
          return chosen(
            rng,
            [`What is the value of $${expr}$?`, `$${expr}$ 的值是多少？`],
            correct,
            others.filter(([p]) => p !== correct),
            walk,
            shape === 1
              ? [
                  `If it had a value $q$, then $q \\times 0 = ${b.toLatex()}$, which is impossible.`,
                  `如果它有值 $q$，那么 $q \\times 0 = ${b.toLatex()}$，这不可能。`,
                ]
              : shape === 3
                ? [
                    `$${c} \\div ${c} = 1$, and $${par(b)} \\times 1 = ${b.toLatex()}$.`,
                    `$${c} \\div ${c} = 1$，而 $${par(b)} \\times 1 = ${b.toLatex()}$。`,
                  ]
                : shape === 0
                  ? [
                      `Distribute: $${c} \\times ${par(b)} - ${c} \\times ${par(b)} = 0$.`,
                      `用分配律：$${c} \\times ${par(b)} - ${c} \\times ${par(b)} = 0$。`,
                    ]
                  : [`Multiply back: $0 \\times ${par(b)} = 0$.`, `乘回去：$0 \\times ${par(b)} = 0$。`],
          );
        },
        tableFigure(["8÷(3-3)", "(4-4)17"], [null, 0]),
      ),
    ],
  ),
  ["Is $0 \\div (-5)$ the same as $-5 \\div 0$?", "$0 \\div (-5)$ 与 $-5 \\div 0$ 一样吗？"],
  [
    "No: $0 \\div (-5) = 0$ since $0 \\times (-5) = 0$, but $-5 \\div 0$ has no value, as no number times $0$ is $-5$.",
    "不一样：$0 \\div (-5) = 0$，因为 $0 \\times (-5) = 0$；但 $-5 \\div 0$ 没有值，因为没有哪个数乘 $0$ 得 $-5$。",
  ],
  ["multiply and divide with zero, and recognize when dividing by zero leaves no value.", "做与零有关的乘除法，并认出除以零没有值的情况。"],
);

/** productLine writes the product of two fractions with the numerators and denominators multiplied: "\frac{2 \times 3}{3 \times 5}". */
const productLine = (a: Q, b: Q) =>
  `${a.toLatex()} \\times ${b.toLatex()} = \\frac{${a.n} \\times ${b.n}}{${a.d} \\times ${b.d}} = ${a.mul(b).toLatex()}`;

/** fractionsOfFractions finds a fraction of a fraction by multiplying. */
export const fractionsOfFractions = withIntro(
  topic(
    "fractions-of-fractions",
    t("Fractions of Fractions", "分数的几分之几"),
    t(
      "A fraction of a quantity means that fraction times the quantity, so a fraction of a fraction is a product: 2/3 of 3/5 is 2/3 × 3/5 = 2/5. If 3/4 of a class are girls and 2/5 of the girls play soccer, then 2/5 × 3/4 = 3/10 of the class are girls who play soccer.",
      "一个量的几分之几就是用这个分数乘这个量，所以一个分数的几分之几是一个乘积：3/5 的 2/3 是 2/3 × 3/5 = 2/5。如果全班 3/4 是女生，女生中 2/5 踢足球，那么全班的 2/5 × 3/4 = 3/10 是踢足球的女生。",
    ),
    ["multiplying-fractions-word-problems"],
    ["7.NS.A.2a", "7.NS.A.3"],
    [
      lesson(
        "a-fraction-of-a-fraction",
        ["A fraction of a fraction", "分数的几分之几"],
        [
          [
            "Taking a fraction of an amount means multiplying by that fraction. So a fraction of a fraction is their product: multiply the numerators and multiply the denominators, then simplify. $\\frac{2}{3}$ of $\\frac{3}{5}$ is $\\frac{2}{3} \\times \\frac{3}{5} = \\frac{6}{15} = \\frac{2}{5}$.",
            "求一个量的几分之几，就是乘这个分数。所以一个分数的几分之几是两个分数之积：分子乘分子，分母乘分母，再化简。$\\frac{3}{5}$ 的 $\\frac{2}{3}$ 是 $\\frac{2}{3} \\times \\frac{3}{5} = \\frac{6}{15} = \\frac{2}{5}$。",
          ],
          [
            "Divide back: $\\frac{2}{5} \\div \\frac{3}{5} = \\frac{2}{5} \\times \\frac{5}{3} = \\frac{2}{3}$.",
            "除回去：$\\frac{2}{5} \\div \\frac{3}{5} = \\frac{2}{5} \\times \\frac{5}{3} = \\frac{2}{3}$。",
          ],
          [
            "A fraction of a fraction less than $1$ is smaller than both: do not add them.",
            "一个小于 $1$ 的分数的几分之几比两个分数都小：不要把它们相加。",
          ],
        ],
        (rng) => {
          let a: Q;
          let b: Q;
          do {
            a = properQ(rng, 9);
            b = properQ(rng, 9);
          } while (a.eq(b));
          const r = a.mul(b);
          return valued(
            [`What is $${a.toLatex()}$ of $${b.toLatex()}$?`, `$${b.toLatex()}$ 的 $${a.toLatex()}$ 是多少？`],
            r,
            [
              [
                ["Of means times", "“的几分之几”用乘法"],
                [`$${a.toLatex()}$ of $${b.toLatex()}$ is a product:`, `$${b.toLatex()}$ 的 $${a.toLatex()}$ 是一个乘积：`],
                [`${a.toLatex()} \\times ${b.toLatex()}`],
              ],
              [
                ["Multiply", "相乘"],
                ["Multiply the numerators and the denominators, then simplify:", "分子乘分子，分母乘分母，再化简："],
                [productLine(a, b)],
              ],
            ],
            [
              `Divide back: $${r.toLatex()} \\div ${b.toLatex()} = ${a.toLatex()}$.`,
              `除回去：$${r.toLatex()} \\div ${b.toLatex()} = ${a.toLatex()}$。`,
            ],
            [
              [a.add(b), "That adds the fractions; a fraction of a fraction is a product.", "这是把分数相加；一个分数的几分之几要用乘法。"],
              [b.div(a), "That divides instead of multiplying.", "这是做了除法，应该相乘。"],
              [a.div(b), "That divides instead of multiplying.", "这是做了除法，应该相乘。"],
            ],
          );
        },
        tapeFigure(
          [
            {
              total: "1",
              pieces: [
                { size: 3, text: "3/5", lit: true },
                { size: 2, text: "2/5" },
              ],
            },
            {
              pieces: [
                { size: 2, text: "2/5", lit: true },
                { size: 1, text: "1/5", dashed: true },
              ],
            },
          ],
          [
            "A bar with 3/5 shaded; 2/3 of that part is 2 of the 5 fifths, so 2/3 of 3/5 is 2/5.",
            "长条中 3/5 涂色；这一部分的 2/3 是五份中的 2 份，所以 3/5 的 2/3 是 2/5。",
          ],
        ),
      ),
      lesson(
        "a-fraction-of-a-part-in-context",
        ["A fraction of a part", "部分中的几分之几"],
        [
          [
            "When a fraction is taken of a part, and the part is itself a fraction of the whole, multiply the two fractions to get the fraction of the whole. $\\frac{2}{3}$ of a garden is vegetables, and $\\frac{1}{4}$ of the vegetable part is carrots. Carrots fill $\\frac{1}{4} \\times \\frac{2}{3} = \\frac{1}{6}$ of the garden.",
            "从一个部分中再取几分之几，而这个部分本身是整体的几分之几时，把两个分数相乘，就得到占整体的几分之几。菜园的 $\\frac{2}{3}$ 种蔬菜，蔬菜部分的 $\\frac{1}{4}$ 种胡萝卜。胡萝卜占菜园的 $\\frac{1}{4} \\times \\frac{2}{3} = \\frac{1}{6}$。",
          ],
          [
            "Try $12$ beds: $\\frac{2}{3}$ of $12$ is $8$ vegetable beds, and $\\frac{1}{4}$ of $8$ is $2$; $\\frac{2}{12} = \\frac{1}{6}$.",
            "设有 $12$ 块地：$12$ 的 $\\frac{2}{3}$ 是 $8$ 块菜地，$8$ 的 $\\frac{1}{4}$ 是 $2$ 块；$\\frac{2}{12} = \\frac{1}{6}$。",
          ],
          [
            "$\\frac{1}{4}$ is a fraction of the vegetable part, not of the whole garden.",
            "$\\frac{1}{4}$ 是蔬菜部分的几分之几，不是整个菜园的几分之几。",
          ],
        ],
        (rng) => {
          const who = rng.pick(names);
          const a = properQ(rng, 8);
          const b = properQ(rng, 8);
          const r = a.mul(b);
          const ctx = rng.int(0, 2);
          const [A, B] = [a.toLatex(), b.toLatex()];
          const prompt: Pair =
            ctx === 0
              ? [
                  `$${A}$ of the students in a class are girls, and $${B}$ of the girls play soccer. What fraction of all the students in the class are girls who play soccer?`,
                  `某班学生中 $${A}$ 是女生，女生中有 $${B}$ 踢足球。踢足球的女生占全班学生的几分之几？`,
                ]
              : ctx === 1
                ? [
                    `$${A}$ of a garden is planted with vegetables, and $${B}$ of the vegetable part is planted with carrots. What fraction of the whole garden is planted with carrots?`,
                    `菜园的 $${A}$ 种蔬菜，蔬菜部分的 $${B}$ 种胡萝卜。胡萝卜占整个菜园的几分之几？`,
                  ]
                : [
                    `$${A}$ of a pizza is left over, and ${who} eats $${B}$ of the leftover part. What fraction of the whole pizza is eaten?`,
                    `一个比萨还剩 $${A}$，${who} 吃了剩下部分的 $${B}$。吃掉的是整个比萨的几分之几？`,
                  ];
          const [part, zhPart] =
            ctx === 0 ? ["the girls", "女生"] : ctx === 1 ? ["the vegetable part", "蔬菜部分"] : ["the leftover part", "剩下的部分"];
          return valued(
            prompt,
            r,
            [
              [
                ["Of which part", "是谁的几分之几"],
                [
                  `$${B}$ is a fraction of ${part}, which is $${A}$ of the whole.`,
                  `$${B}$ 是${zhPart}的几分之几，而${zhPart}是整体的 $${A}$。`,
                ],
              ],
              [["Multiply", "相乘"], ["Multiply the two fractions:", "把两个分数相乘："], [productLine(b, a)]],
            ],
            [`Divide back: $${r.toLatex()} \\div ${A} = ${B}$.`, `除回去：$${r.toLatex()} \\div ${A} = ${B}$。`],
            [
              [b, `That is the fraction of ${part}, not of the whole.`, `这是占${zhPart}的几分之几，不是占整体的。`],
              [a.add(b), "That adds the fractions; a fraction of a part is a product.", "这是把分数相加；部分中的几分之几要用乘法。"],
              [
                a.sub(b).abs(),
                "That subtracts the fractions; a fraction of a part is a product.",
                "这是把分数相减；部分中的几分之几要用乘法。",
              ],
            ],
          );
        },
        tapeFigure(
          [
            {
              total: "1",
              pieces: [
                { size: 8, text: "2/3", lit: true },
                { size: 4, text: "1/3" },
              ],
            },
            {
              pieces: [
                { size: 2, text: "1/6", lit: true },
                { size: 6, text: "1/2", dashed: true },
              ],
            },
          ],
          [
            "The garden: 2/3 is vegetables; 1/4 of that part, the carrots, is 1/6 of the garden.",
            "菜园：2/3 种蔬菜；这一部分的 1/4 种胡萝卜，占菜园的 1/6。",
          ],
        ),
      ),
      lesson(
        "a-fraction-of-a-fraction-of-a-quantity",
        ["A fraction of a fraction of a quantity", "一个量的几分之几的几分之几"],
        [
          [
            "Each fraction of a fraction is another multiplication, so the whole chain becomes one product. Multiply the fractions first, simplifying where you can, then multiply by the quantity. $\\frac{2}{3}$ of $\\frac{3}{4}$ of $48$ liters is $\\frac{2}{3} \\times \\frac{3}{4} \\times 48 = \\frac{1}{2} \\times 48 = 24$ liters.",
            "每次求几分之几都是一次乘法，所以整串运算就是一个乘积。可以先把分数相乘并约分，再乘这个量。$48$ 升的 $\\frac{3}{4}$ 的 $\\frac{2}{3}$ 是 $\\frac{2}{3} \\times \\frac{3}{4} \\times 48 = \\frac{1}{2} \\times 48 = 24$ 升。",
          ],
          [
            "One step at a time: $\\frac{3}{4}$ of $48$ is $36$, and $\\frac{2}{3}$ of $36$ is $24$.",
            "一步一步算：$48$ 的 $\\frac{3}{4}$ 是 $36$，$36$ 的 $\\frac{2}{3}$ 是 $24$。",
          ],
          ["Use both fractions: stopping at $36$ takes only one of them.", "两个分数都要用：停在 $36$ 只用了其中一个。"],
        ],
        (rng) => {
          const a = properQ(rng, 6);
          const b = properQ(rng, 6);
          const ab = a.mul(b);
          const total = Number(ab.d) * rng.int(1, Math.max(2, Math.floor(300 / Number(ab.d))));
          const T = Q.of(total);
          const r = ab.mul(T);
          const mid = b.mul(T);
          return valued(
            [`What is $${a.toLatex()}$ of $${b.toLatex()}$ of $${total}$?`, `$${total}$ 的 $${b.toLatex()}$ 的 $${a.toLatex()}$ 是多少？`],
            r,
            [
              [["Multiply the fractions", "先乘分数"], ["Multiply the two fractions first:", "先把两个分数相乘："], [productLine(a, b)]],
              [
                ["Multiply the quantity", "再乘这个量"],
                ["Then take that fraction of the quantity:", "再求这个量的这几分之几："],
                [`${ab.toLatex()} \\times ${total} = ${r.toLatex()}`],
              ],
            ],
            [
              `One step at a time: $${b.toLatex()}$ of $${total}$ is $${mid.toLatex()}$, and $${a.toLatex()}$ of $${mid.toLatex()}$ is $${r.toLatex()}$.`,
              `一步一步算：$${total}$ 的 $${b.toLatex()}$ 是 $${mid.toLatex()}$，$${mid.toLatex()}$ 的 $${a.toLatex()}$ 是 $${r.toLatex()}$。`,
            ],
            [
              [
                mid,
                `That stops after one fraction; $${a.toLatex()}$ of it is still to be taken.`,
                `这是只用了一个分数；还要再求它的 $${a.toLatex()}$。`,
              ],
              [a.add(b).mul(T), "That adds the fractions; each “of” is a multiplication.", "这是把分数相加；每个“的几分之几”都是乘法。"],
              [a.mul(T), `That skips the fraction $${b.toLatex()}$.`, `这是漏掉了分数 $${b.toLatex()}$。`],
            ],
          );
        },
        tapeFigure(
          [
            {
              total: "48",
              pieces: [
                { size: 36, text: "36", lit: true },
                { size: 12, text: "12" },
              ],
            },
            {
              pieces: [
                { size: 24, text: "24", lit: true },
                { size: 12, text: "12", dashed: true },
              ],
            },
          ],
          ["A bar of 48: 3/4 of it is 36, and 2/3 of 36 is 24.", "长条 48：它的 3/4 是 36，36 的 2/3 是 24。"],
        ),
      ),
    ],
  ),
  [
    "A jug holds $48$ liters. It is $\\frac{3}{4}$ full, and $\\frac{2}{3}$ of the water is poured out. How much is poured out?",
    "一个水罐能装 $48$ 升，现在装了 $\\frac{3}{4}$，倒出其中的 $\\frac{2}{3}$。倒出多少升？",
  ],
  [
    "$\\frac{2}{3} \\times \\frac{3}{4} \\times 48 = \\frac{1}{2} \\times 48 = 24$ liters; step by step, $36$ then $24$.",
    "$\\frac{2}{3} \\times \\frac{3}{4} \\times 48 = \\frac{1}{2} \\times 48 = 24$ 升；一步一步算，先得 $36$，再得 $24$。",
  ],
  ["find a fraction of a fraction, and of a quantity, by multiplying.", "用乘法求一个分数的几分之几，以及一个量的几分之几的几分之几。"],
);

/** RateSituation is a situation that a product or quotient of signed numbers models. */
interface RateSituation {
  readonly text: Pair;
  readonly correct: string;
  readonly wrong: readonly [string, string, string][];
  readonly walk: readonly Walk[];
  readonly check: Pair;
}

/** rateSituation draws a situation modeled by n × (−r) or (−d) ÷ n. */
function rateSituation(rng: Rng): RateSituation {
  const n = rng.int(2, 12);
  const r = rng.bool() ? Q.of(rng.int(2, 15)) : decQ(rng, 1, 11, 95);
  const rs = dec(r);
  const kind = rng.int(0, 4);
  const who = rng.pick(names);
  const totalQ = r.mul(Q.of(n));
  if (kind <= 2) {
    const text: Pair = [
      [
        `A diver descends at a constant rate of $${rs}$ meters per minute for $${n}$ minutes. Which expression gives the change in her elevation, in meters?`,
        `一名潜水员以每分钟 $${rs}$ 米的速度匀速下潜了 $${n}$ 分钟。哪个式子表示她高度的变化量（米）？`,
      ] as Pair,
      [
        `The temperature falls by $${rs}$ degrees every hour for $${n}$ hours. Which expression gives the total change in temperature, in degrees?`,
        `气温每小时下降 $${rs}$ 度，持续了 $${n}$ 小时。哪个式子表示气温的总变化量（度）？`,
      ] as Pair,
      [
        `${who} withdraws $\\$${rs}$ from a bank account every week for $${n}$ weeks. Which expression gives the change in the account balance, in dollars?`,
        `${who} 连续 $${n}$ 周每周从银行账户取出 $\\$${rs}$。哪个式子表示账户余额的变化量（美元）？`,
      ] as Pair,
    ][kind] as Pair;
    const [unit, zhUnit] = kind === 0 ? ["minute", "分钟"] : kind === 1 ? ["hour", "小时"] : ["week", "周"];
    return {
      text,
      correct: `${n} \\times (-${rs})`,
      wrong: [
        [`${n} + (-${rs})`, "That counts the change once; a repeated change is a product.", "这只算了一次变化；重复的变化要用乘法。"],
        [
          `(-${rs}) \\div ${n}`,
          `That shares the change out; here it happens $${n}$ times.`,
          `这是把变化平均分开；这里变化发生了 $${n}$ 次。`,
        ],
        [`${n} \\times ${rs}`, "The quantity goes down, so the change each time is negative.", "数量在减少，所以每次的变化量是负数。"],
        [
          `(-${n}) \\times (-${rs})`,
          "The number of times is not negative; this gives a rise instead of a fall.",
          "次数不是负数；这样算出的是增加而不是减少。",
        ],
      ],
      walk: [
        [
          ["Each time", "每一次"],
          [
            `Each ${unit} the change is $-${rs}$, negative because the quantity goes down.`,
            `每${zhUnit}的变化量是 $-${rs}$，数量在减少，所以是负数。`,
          ],
        ],
        [
          ["Repeat", "重复"],
          [`The change happens $${n}$ times, so multiply:`, `变化发生了 $${n}$ 次，所以相乘：`],
          [`${n} \\times (-${rs}) = -${dec(totalQ)}`],
        ],
      ],
      check: [
        `Repeated addition: $${n}$ changes of $-${rs}$ add up to $-${dec(totalQ)}$, the same as $${n} \\times (-${rs})$.`,
        `重复相加：$${n}$ 个 $-${rs}$ 相加得 $-${dec(totalQ)}$，与 $${n} \\times (-${rs})$ 相同。`,
      ],
    };
  }
  const total = dec(totalQ);
  const dollars = cents(Number(r.mul(Q.of(n * 100)).n));
  const text: Pair =
    kind === 3
      ? [
          `A submarine's elevation changes by $-${total}$ meters in $${n}$ minutes, at a constant rate. Which expression gives the change in elevation per minute, in meters?`,
          `一艘潜艇的高度在 $${n}$ 分钟内匀速变化了 $-${total}$ 米。哪个式子表示每分钟高度的变化量（米）？`,
        ]
      : [
          `A stock loses $\\$${dollars}$ in value over $${n}$ days, losing the same amount each day. Which expression gives the change in its value per day, in dollars?`,
          `某只股票在 $${n}$ 天内价值共下跌了 $\\$${dollars}$，每天跌得一样多。哪个式子表示每天价值的变化量（美元）？`,
        ];
  const [unit, zhUnit] = kind === 3 ? ["minutes", "分钟"] : ["days", "天"];
  return {
    text,
    correct: `(-${total}) \\div ${n}`,
    wrong: [
      [
        `${n} \\div (-${total})`,
        "That divides the other way round: the total is shared among the parts.",
        "这是除反了：应该用总量除以份数。",
      ],
      [`(-${total}) \\times ${n}`, "That multiplies; sharing a total equally is a division.", "这是乘法；把总量平均分开要用除法。"],
      [`${total} \\div ${n}`, "The value goes down, so the total change is negative.", "数值在减少，所以总变化量是负数。"],
      [`(-${total}) - ${n}`, "That subtracts; sharing a total equally is a division.", "这是减法；把总量平均分开要用除法。"],
    ],
    walk: [
      [
        ["The total", "总量"],
        [`The total change is $-${total}$, negative because the value goes down.`, `总变化量是 $-${total}$，数值在减少，所以是负数。`],
      ],
      [
        ["Share it", "平均分"],
        [`Share it equally among $${n}$ ${unit}:`, `平均分到 $${n}$ ${zhUnit}：`],
        [`(-${total}) \\div ${n} = -${rs}`],
      ],
    ],
    check: [
      `Multiply back: $${n} \\times (-${rs}) = -${total}$, the total change.`,
      `乘回去：$${n} \\times (-${rs}) = -${total}$，正是总变化量。`,
    ],
  };
}

/** interpretingProductsAndQuotientsOfRationalNumbers models situations with signed products and quotients and predicts signs. */
export const interpretingProductsAndQuotientsOfRationalNumbers = withIntro(
  topic(
    "interpreting-products-and-quotients-of-rational-numbers",
    t("Interpreting Products and Quotients of Rational Numbers", "理解有理数的乘积与商"),
    t(
      "A repeated loss is a product with a negative factor: losing \\$4.50 a week for 6 weeks is 6 × (−4.50). A total change shared equally is a quotient: a drop of 18 degrees over 6 hours is (−18) ÷ 6 per hour. The sign of a product or quotient depends only on how many negative numbers it has.",
      "重复的减少可以用含负因数的乘积表示：连续 6 周每周减少 \\$4.50 是 6 × (−4.50)。平均分配总变化量用商表示：6 小时下降 18 度，每小时是 (−18) ÷ 6。乘积或商的符号只取决于其中负数的个数。",
    ),
    ["dividing-with-negative-numbers"],
    ["7.NS.A.2a", "7.NS.A.2b"],
    [
      lesson(
        "choosing-the-expression-for-a-situation",
        ["Choosing the expression", "选择式子"],
        [
          [
            "A repeated change is a product: the number of times times the signed change each time. Sharing a total change equally is a quotient: the signed total divided by the number of parts. A diver descends $4.5$ meters per minute for $6$ minutes: the change is $6 \\times (-4.5)$. A stock loses $\\$18$ over $6$ days: the change per day is $(-18) \\div 6$.",
            "重复发生的变化用乘法表示：次数乘每次带符号的变化量。把总变化平均分开用除法表示：带符号的总量除以份数。潜水员每分钟下潜 $4.5$ 米，持续 $6$ 分钟：变化量是 $6 \\times (-4.5)$。某只股票 $6$ 天下跌 $\\$18$：每天的变化量是 $(-18) \\div 6$。",
          ],
          [
            "Check the meaning: $6 \\times (-4.5) = -27$, so the diver is $27$ meters lower; and $(-18) \\div 6 = -3$, a loss of $\\$3$ a day.",
            "检验含义：$6 \\times (-4.5) = -27$，潜水员低了 $27$ 米；$(-18) \\div 6 = -3$，每天损失 $\\$3$。",
          ],
          ["A loss or a fall is negative: leaving out the sign describes a gain.", "减少或下降是负数：漏掉负号就变成了增加。"],
        ],
        (rng) => {
          const s = rateSituation(rng);
          return chosenMath(rng, s.text, s.correct, s.wrong, s.walk, s.check);
        },
        tableFigure(["6(-4.5)", "(-18)÷6"], [-27, -3]),
      ),
      lesson(
        "the-sign-of-a-product-or-quotient",
        ["The sign of a product or quotient", "积或商的符号"],
        [
          [
            "For a mix of multiplications and divisions, the sign depends only on how many negative numbers there are. An even count gives a positive value and an odd count gives a negative value. $(-3.2) \\times 5 \\div (-0.4) \\times (-7)$ has three negative numbers, an odd number, so its value is negative.",
            "乘除混合运算的符号只取决于负数的个数。偶数个时值为正，奇数个时值为负。$(-3.2) \\times 5 \\div (-0.4) \\times (-7)$ 中有三个负数，是奇数个，所以它的值是负数。",
          ],
          [
            "Follow the sign step by step: $-$, then $-$ again, then $+$, then $-$.",
            "一步一步跟踪符号：先是 $-$，乘 $5$ 后仍是 $-$，除以负数后变 $+$，再乘负数变 $-$。",
          ],
          ["Count every negative number, divisors included.", "每个负数都要数，包括除数。"],
        ],
        (rng) => {
          const n = rng.int(3, 5);
          let vs: Q[];
          do vs = Array.from({ length: n }, () => (rng.bool() ? Q.of(rng.nonZero(-20, 20)) : decQ(rng, 1, 1, 99).mul(Q.of(rng.sign()))));
          while (vs.filter((v) => v.sign() < 0).length === 0);
          const ops = Array.from({ length: n - 1 }, () => (rng.bool() ? "\\times" : "\\div"));
          const expr = vs.map((v, i) => (i === 0 ? show(v, "decimal") : `${ops[i - 1]} ${par(v, "decimal")}`)).join(" ");
          const negs = vs.filter((v) => v.sign() < 0).length;
          const positive = negs % 2 === 0;
          const signs: string[] = [];
          let s = 1;
          for (const v of vs) {
            s *= v.sign();
            signs.push(s > 0 ? "+" : "-");
          }
          const pos: Pair = ["Positive", "正数"];
          const neg: Pair = ["Negative", "负数"];
          return chosen(
            rng,
            [`Without calculating it, is the value of $${expr}$ positive or negative?`, `不计算，判断 $${expr}$ 的值是正数还是负数。`],
            positive ? pos : neg,
            [
              [
                positive ? neg : pos,
                `There ${negs === 1 ? "is" : "are"} $${negs}$ negative numbers; count them again.`,
                `负数有 $${negs}$ 个；再数一数。`,
              ],
            ],
            [
              [
                ["Count the negatives", "数负数"],
                [
                  `There ${negs === 1 ? "is" : "are"} $${negs}$ negative number${negs === 1 ? "" : "s"} in all.`,
                  `一共有 $${negs}$ 个负数。`,
                ],
              ],
              [
                ["Even or odd", "偶数还是奇数"],
                [
                  `$${negs}$ is ${positive ? "even" : "odd"}, so the value is ${positive ? "positive" : "negative"}.`,
                  `$${negs}$ 是${positive ? "偶" : "奇"}数，所以值为${positive ? "正" : "负"}数。`,
                ],
              ],
            ],
            [
              `Follow the sign from left to right: $${signs.join("$, $")}$. It ends ${positive ? "positive" : "negative"}.`,
              `从左往右跟踪符号：$${signs.join("$，$")}$。最后是${positive ? "正" : "负"}的。`,
            ],
          );
        },
        tableFigure(["(-)", "(-)(-)", "(-)(-)(-)"], [-1, 1, -1]),
      ),
    ],
  ),
  [
    "A stock loses $\\$18$ over $6$ days, the same each day. Write the change per day as a quotient.",
    "某只股票 $6$ 天共下跌 $\\$18$，每天一样多。把每天的变化量写成一个商。",
  ],
  ["$(-18) \\div 6 = -3$ dollars a day; and $6 \\times (-3) = -18$.", "$(-18) \\div 6 = -3$ 美元每天；而 $6 \\times (-3) = -18$。"],
  ["write a situation as a product or quotient of signed numbers and predict its sign.", "把情境写成带符号数的积或商，并预测它的符号。"],
);

/** Evaluation is an expression with its value, the two steps of its work, a check and the values common slips give. */
interface Evaluation {
  readonly expr: string;
  readonly value: Q;
  readonly walk: readonly Walk[];
  readonly check: Pair;
  readonly slips: readonly [Q, string, string][];
}

/** orderedExpression draws an expression of three or four numbers that needs the order of operations. */
function orderedExpression(rng: Rng, draw: () => Q, kind: Kind): Evaluation {
  const [a, b, c, d] = [draw(), draw(), draw(), draw()];
  const s = (q: Q) => show(q, kind);
  const p = (q: Q) => par(q, kind);
  const sign = ["The sign is wrong: apply the sign rules at each step.", "符号错了：每一步都要用符号法则。"] as const;
  const multiplyFirst: Pair = ["Multiply and divide before adding and subtracting:", "先乘除，后加减："];
  let form = rng.int(0, 3);
  // A decimal quotient need not terminate; products and differences of decimals always do.
  if (form === 2 && kind === "decimal" && !isTerminating(a.sub(b).div(c))) form = 0;
  switch (form) {
    case 0: {
      const bc = b.mul(c);
      const v = a.sub(bc);
      return {
        expr: `${s(a)} - ${p(b)} \\times ${p(c)}`,
        value: v,
        walk: [
          [["Multiply first", "先算乘法"], multiplyFirst, [`${p(b)} \\times ${p(c)} = ${s(bc)}`]],
          [["Then subtract", "再算减法"], ["Subtract the product:", "减去这个积："], [`${s(a)} - ${p(bc)} = ${s(v)}`]],
        ],
        check: [`Add the opposite instead: $${s(a)} + ${p(bc.neg())} = ${s(v)}$.`, `改成加相反数：$${s(a)} + ${p(bc.neg())} = ${s(v)}$。`],
        slips: [
          [a.sub(b).mul(c), "That subtracts before multiplying.", "这是先做了减法，应该先乘。"],
          [a.add(bc), "That adds the product; it is subtracted.", "这是加上了积；应该减去它。"],
          [v.neg(), sign[0], sign[1]],
        ],
      };
    }
    case 1: {
      const q = b.mul(c);
      const v = a.add(b);
      return {
        expr: `${s(a)} + ${p(q)} \\div ${p(c)}`,
        value: v,
        walk: [
          [["Divide first", "先算除法"], multiplyFirst, [`${p(q)} \\div ${p(c)} = ${s(b)}`]],
          [["Then add", "再算加法"], ["Add the quotient:", "加上这个商："], [`${s(a)} + ${p(b)} = ${s(v)}`]],
        ],
        check: [
          `Multiply back: $${p(b)} \\times ${p(c)} = ${s(q)}$, and $${s(v)} - ${p(b)} = ${s(a)}$.`,
          `乘回去：$${p(b)} \\times ${p(c)} = ${s(q)}$，而 $${s(v)} - ${p(b)} = ${s(a)}$。`,
        ],
        slips: [
          [a.add(q).div(c), "That adds before dividing.", "这是先做了加法，应该先除。"],
          [a.sub(b), "That subtracts the quotient; it is added.", "这是减去了商；应该加上它。"],
          [v.neg(), sign[0], sign[1]],
        ],
      };
    }
    case 2: {
      const diff = a.sub(b);
      const v = diff.div(c);
      return {
        expr: `\\left(${s(a)} - ${p(b)}\\right) \\div ${p(c)}`,
        value: v,
        walk: [
          [["Parentheses first", "先算括号"], ["Work inside the parentheses:", "先算括号里面的："], [`${s(a)} - ${p(b)} = ${s(diff)}`]],
          [["Then divide", "再算除法"], ["Divide the result:", "再把结果相除："], [`${p(diff)} \\div ${p(c)} = ${s(v)}`]],
        ],
        check: [
          `Multiply back: $${p(v)} \\times ${p(c)} = ${s(diff)}$, the value inside the parentheses.`,
          `乘回去：$${p(v)} \\times ${p(c)} = ${s(diff)}$，正是括号里的值。`,
        ],
        slips: [
          [a.sub(b.div(c)), "That divides before working inside the parentheses.", "这是没先算括号，先做了除法。"],
          [a.add(b).div(c), `That adds $${s(b)}$ instead of subtracting it.`, `这是加上了 $${s(b)}$，应该减去它。`],
          [v.neg(), sign[0], sign[1]],
        ],
      };
    }
    default: {
      const ab = a.mul(b);
      const cd = c.mul(d);
      const v = ab.sub(cd);
      return {
        expr: `${p(a)} \\times ${p(b)} - ${p(c)} \\times ${p(d)}`,
        value: v,
        walk: [
          [["Multiply first", "先算乘法"], multiplyFirst, [`${p(a)} \\times ${p(b)} = ${s(ab)}`, `${p(c)} \\times ${p(d)} = ${s(cd)}`]],
          [
            ["Then subtract", "再算减法"],
            ["Subtract the second product from the first:", "用第一个积减去第二个积："],
            [`${s(ab)} - ${p(cd)} = ${s(v)}`],
          ],
        ],
        check: [
          `Add the opposite instead: $${s(ab)} + ${p(cd.neg())} = ${s(v)}$.`,
          `改成加相反数：$${s(ab)} + ${p(cd.neg())} = ${s(v)}$。`,
        ],
        slips: [
          [
            ab.sub(c).mul(d),
            "That works from left to right, subtracting before the second multiplication.",
            "这是从左往右算，在第二个乘法之前先做了减法。",
          ],
          [ab.add(cd), "That adds the second product; it is subtracted.", "这是加上了第二个积；应该减去它。"],
          [v.neg(), sign[0], sign[1]],
        ],
      };
    }
  }
}

/** evaluatingRationalNumberExpressionsWithoutExponents applies the order of operations with signed numbers. */
export const evaluatingRationalNumberExpressionsWithoutExponents = withIntro(
  topic(
    "evaluating-rational-number-expressions-without-exponents",
    t("Evaluating Rational Number Expressions Without Exponents", "计算不含乘方的有理数式子"),
    t(
      "The order of operations is the same for signed numbers: parentheses first, then multiplication and division from left to right, then addition and subtraction from left to right. Keep track of each sign: 4 − (−3) × 5 = 4 − (−15) = 19.",
      "有理数的运算顺序不变：先算括号，再从左到右算乘除，最后从左到右算加减。注意每一步的符号：4 − (−3) × 5 = 4 − (−15) = 19。",
    ),
    ["dividing-with-negative-numbers", "subtracting-a-negative-number"],
    ["7.NS.A.3", "7.EE.B.3"],
    [
      lesson(
        "integer-expressions",
        ["Integers", "整数"],
        [
          [
            "The order of operations is the same with negative numbers: work inside parentheses first, then multiply and divide from left to right, then add and subtract from left to right. Apply the sign rules at each step. $4 - (-3) \\times 5$: multiply first, $(-3) \\times 5 = -15$, then $4 - (-15) = 19$.",
            "有负数时运算顺序不变：先算括号内的，再从左到右算乘除，最后从左到右算加减。每一步都要用符号法则。$4 - (-3) \\times 5$：先算乘法，$(-3) \\times 5 = -15$，再算 $4 - (-15) = 19$。",
          ],
          ["Add the opposite instead: $4 + 15 = 19$.", "改成加相反数：$4 + 15 = 19$。"],
          [
            "Working left to right gives $(4 - (-3)) \\times 5 = 35$, which is wrong: multiply first.",
            "从左往右算会得 $(4 - (-3)) \\times 5 = 35$，是错的：要先算乘法。",
          ],
        ],
        (rng) => {
          const e = orderedExpression(rng, () => Q.of(rng.nonZero(-9, 9)), "fraction");
          return valued([`Evaluate $${e.expr}$.`, `计算 $${e.expr}$。`], e.value, e.walk, e.check, e.slips);
        },
        tableFigure(["(-3)(5)", "4-(-15)"], [-15, 19]),
      ),
      lesson(
        "fraction-and-decimal-expressions",
        ["Fractions and decimals", "分数与小数"],
        [
          [
            "Fractions and decimals follow the same order of operations as integers: multiply and divide before adding and subtracting. Keep track of the sign of every intermediate result. $2.5 - 1.5 \\times (-4) = 2.5 - (-6) = 8.5$, and $-\\frac{1}{2} + \\frac{3}{4} \\times \\left(-\\frac{2}{3}\\right) = -\\frac{1}{2} + \\left(-\\frac{1}{2}\\right) = -1$.",
            "分数和小数的运算顺序与整数相同：先乘除，后加减。注意每个中间结果的符号。$2.5 - 1.5 \\times (-4) = 2.5 - (-6) = 8.5$；$-\\frac{1}{2} + \\frac{3}{4} \\times \\left(-\\frac{2}{3}\\right) = -\\frac{1}{2} + \\left(-\\frac{1}{2}\\right) = -1$。",
          ],
          ["Add the opposite instead: $2.5 + 6 = 8.5$.", "改成加相反数：$2.5 + 6 = 8.5$。"],
          ["Subtracting the negative product $-6$ adds $6$; it does not take $6$ away.", "减去负的积 $-6$ 就是加上 $6$，不是减去 $6$。"],
        ],
        (rng) => {
          const kind: Kind = rng.bool() ? "fraction" : "decimal";
          const draw = () => {
            const v =
              kind === "decimal"
                ? rng.bool()
                  ? decQ(rng, 1, 1, 50)
                  : Q.of(rng.int(1, 9))
                : rng.bool(0.3)
                  ? Q.of(rng.int(1, 6))
                  : properQ(rng, 6);
            return rng.bool() ? v.neg() : v;
          };
          let e: Evaluation;
          do e = orderedExpression(rng, draw, kind);
          while (kind === "decimal" && !isTerminating(e.value));
          return valued(
            [`Evaluate $${e.expr}$.`, `计算 $${e.expr}$。`],
            e.value,
            e.walk,
            e.check,
            e.slips.filter(([x]) => kind !== "decimal" || isTerminating(x)),
            kindForm(kind),
          );
        },
        tableFigure(["1.5(-4)", "2.5-(-6)"], [-6, 8.5]),
      ),
    ],
  ),
  ["What is $4 - (-3) \\times 5$?", "$4 - (-3) \\times 5$ 等于多少？"],
  [
    "Multiply first: $(-3) \\times 5 = -15$, then $4 - (-15) = 19$; adding the opposite, $4 + 15 = 19$.",
    "先算乘法：$(-3) \\times 5 = -15$，再算 $4 - (-15) = 19$；改成加相反数，$4 + 15 = 19$。",
  ],
  ["evaluate expressions with signed numbers in the right order of operations.", "按正确的运算顺序计算含有理数的式子。"],
);

/** solvingProblemsUsingMultiplicationAndDivisionOfRationalNumbers solves rate problems with signed changes. */
export const solvingProblemsUsingMultiplicationAndDivisionOfRationalNumbers = withIntro(
  topic(
    "solving-problems-using-multiplication-and-division-of-rational-numbers",
    t("Solving Problems Using Multiplication and Division of Rational Numbers", "用有理数乘除法解决问题"),
    t(
      "A steady change of r per unit for n units is a total change of n × r; a total change spread evenly over n units is a change of (total) ÷ n per unit; and the number of units needed for a total change is (total) ÷ r. Decreases are negative throughout.",
      "每单位变化 r，共 n 个单位，总变化量是 n × r；总变化量平均分到 n 个单位，每单位变化 (总变化量) ÷ n；达到某个总变化量需要的单位数是 (总变化量) ÷ r。减少量始终记为负数。",
    ),
    ["interpreting-products-and-quotients-of-rational-numbers", "dividing-with-negative-decimals-and-fractions"],
    ["7.NS.A.2a", "7.NS.A.2b", "7.NS.A.3"],
    [
      lesson(
        "total-change-at-a-constant-rate",
        ["The total change", "总变化量"],
        [
          [
            "When something changes by the same amount each time, the total change is the rate times the number of times. A decrease is a negative rate, so the total change is negative. The temperature falls $2.5$ degrees per hour for $4$ hours: the change is $4 \\times (-2.5) = -10$ degrees.",
            "当一个量每次变化相同的量时，总变化等于每次的变化量乘次数。减少用负数表示，所以总变化是负数。气温每小时下降 $2.5$ 度，持续 $4$ 小时：变化量是 $4 \\times (-2.5) = -10$ 度。",
          ],
          ["Divide back: $-10 \\div 4 = -2.5$ degrees per hour.", "除回去：$-10 \\div 4 = -2.5$ 度每小时。"],
          ["A fall is negative: the total change is $-10$, not $10$.", "下降是负数：总变化量是 $-10$，不是 $10$。"],
        ],
        (rng) => {
          const n = rng.int(2, 12);
          const r = decQ(rng, rng.int(1, 2), 11, 450);
          const start = rng.int(-10, 25);
          const askEnd = rng.bool();
          const change = r.mul(Q.of(-n));
          const end = Q.of(start).add(change);
          const rate: Walk = [
            ["The rate", "变化率"],
            [
              `A fall is negative, so the change each ${askEnd ? "hour" : "day"} is $-${dec(r)}$.`,
              `下降是负数，所以每${askEnd ? "小时" : "天"}的变化量是 $-${dec(r)}$。`,
            ],
          ];
          const times: Walk = [
            ["Multiply", "相乘"],
            [`It happens $${n}$ times:`, `共发生 $${n}$ 次：`],
            [`${n} \\times (-${dec(r)}) = ${dec(change)}`],
          ];
          return askEnd
            ? valued(
                [
                  `At midnight the temperature is $${start}^{\\circ}\\text{C}$. It falls by $${dec(r)}$ degrees every hour for $${n}$ hours. What is the temperature then, in degrees Celsius?`,
                  `午夜气温是 $${start}^{\\circ}\\text{C}$，之后每小时下降 $${dec(r)}$ 度，持续 $${n}$ 小时。那时气温是多少摄氏度？`,
                ],
                end,
                [
                  times,
                  [
                    ["Add the change", "加上变化量"],
                    ["Add the change to the starting temperature:", "把变化量加到起始气温上："],
                    [`${start} + ${par(change, "decimal")} = ${dec(end)}`],
                  ],
                ],
                [
                  `Work back: $${dec(end)} + ${n} \\times ${dec(r)} = ${start}$, the midnight temperature.`,
                  `倒推回去：$${dec(end)} + ${n} \\times ${dec(r)} = ${start}$，正是午夜气温。`,
                ],
                [
                  [Q.of(start).sub(change), "That adds the fall; the temperature goes down.", "这是把下降的度数加上了；气温是在下降。"],
                  [Q.of(start).sub(r), "That uses only one hour's fall.", "这只算了一小时的下降。"],
                  [change, "That is the change, not the temperature.", "这是变化量，不是气温。"],
                ],
                { form: "decimal" },
              )
            : valued(
                [
                  `The water level in a reservoir falls by $${dec(r)}$ centimeters every day for $${n}$ days. What is the total change in the water level, in centimeters? Write a decrease as a negative number.`,
                  `水库水位连续 $${n}$ 天每天下降 $${dec(r)}$ 厘米。水位的总变化量是多少厘米？减少用负数表示。`,
                ],
                change,
                [rate, times],
                [
                  `Divide back: $${dec(change)} \\div ${n} = -${dec(r)}$ centimeters per day.`,
                  `除回去：$${dec(change)} \\div ${n} = -${dec(r)}$ 厘米每天。`,
                ],
                [
                  [change.neg(), "A decrease is written as a negative number.", "减少要用负数表示。"],
                  [r.neg(), "That is one day's change only.", "这只是一天的变化。"],
                  [
                    r.add(Q.of(n)).neg(),
                    "That adds the rate and the number of days; the total is a product.",
                    "这是把变化率和天数相加；总变化量是乘积。",
                  ],
                ],
                { form: "decimal" },
              );
        },
        lineFigure(
          {
            lo: -11,
            hi: 1,
            step: 1,
            labels: [-10, -5, 0],
            label: plainLabel,
            marks: [{ at: -10, text: "-10", result: true }],
            jumps: [
              [0, -2.5],
              [-2.5, -5],
              [-5, -7.5],
              [-7.5, -10],
            ],
          },
          ["A number line: four jumps of -2.5 from 0 land on -10.", "数轴：从 0 出发跳四次 -2.5，落在 -10。"],
        ),
      ),
      lesson(
        "average-change-per-unit",
        ["The change per unit", "每单位的变化量"],
        [
          [
            "The average change per unit of time is the total change divided by the number of units. A negative total change gives a negative average, meaning a decrease each time on average. Over $6$ days a stock's price changed by $-\\$13.50$. On average it changed by $(-13.50) \\div 6 = -\\$2.25$ per day.",
            "每单位时间的平均变化等于总变化除以单位数。总变化为负时，平均变化也为负，表示平均每次都在减少。某只股票 $6$ 天内价格变化了 $-\\$13.50$。平均每天变化 $(-13.50) \\div 6 = -\\$2.25$。",
          ],
          ["Multiply back: $6 \\times (-2.25) = -13.50$.", "乘回去：$6 \\times (-2.25) = -13.50$。"],
          ["Divide the total by the number of days, not the days by the total.", "用总量除以天数，不是用天数除以总量。"],
        ],
        (rng) => {
          const n = rng.int(2, 10);
          const per0 = Q.of(rng.int(5, 400), 100).neg();
          const what = rng.bool();
          const per = what ? per0 : per0.mul(Q.of(10));
          const total = per.mul(Q.of(n));
          return valued(
            what
              ? [
                  `Over $${n}$ days, the price of a stock changed by $${dec(total)}$ dollars. What was the average change per day, in dollars?`,
                  `$${n}$ 天内，某只股票的价格变化了 $${dec(total)}$ 美元。平均每天变化多少美元？`,
                ]
              : [
                  `A hot-air balloon's elevation changed by $${dec(total)}$ meters in $${n}$ minutes, at a constant rate. What was the change in elevation per minute, in meters?`,
                  `一个热气球的高度在 $${n}$ 分钟内匀速变化了 $${dec(total)}$ 米。每分钟高度变化多少米？`,
                ],
            per,
            [
              [
                ["The total", "总变化量"],
                [
                  `The total change is $${dec(total)}$, negative because it went down.`,
                  `总变化量是 $${dec(total)}$，因为是下降，所以是负数。`,
                ],
              ],
              [
                ["Share it", "平均分"],
                [`Divide by the $${n}$ ${what ? "days" : "minutes"}:`, `除以 $${n}$ ${what ? "天" : "分钟"}：`],
                [`(${dec(total)}) \\div ${n} = ${dec(per)}`],
              ],
            ],
            [`Multiply back: $${n} \\times (${dec(per)}) = ${dec(total)}$.`, `乘回去：$${n} \\times (${dec(per)}) = ${dec(total)}$。`],
            [
              [per.neg(), "A decrease is written as a negative number.", "减少要用负数表示。"],
              [total.mul(Q.of(n)), "That multiplies; sharing a total is a division.", "这是乘法；平均分总量要用除法。"],
              ...(isTerminating(Q.of(n).div(total))
                ? ([[Q.of(n).div(total), "That divides the other way round.", "这是除反了。"]] as const)
                : []),
            ],
            { form: "decimal" },
          );
        },
        tableFigure(["(-13.5)÷6", "6(-2.25)"], [-2.25, -13.5]),
      ),
      lesson(
        "time-for-a-total-change",
        ["How long does it take?", "需要多长时间？"],
        [
          [
            "To find how long a total change takes, divide the total change by the change per unit of time. Both are negative for a decrease, so the time comes out positive. A pond's water level falls $0.75$ cm per day. A change of $-6$ cm takes $(-6) \\div (-0.75) = 8$ days.",
            "要求总变化需要多长时间，就用总变化除以每单位时间的变化。减少时两者都是负数，所以时间是正数。池塘水位每天下降 $0.75$ 厘米。水位变化 $-6$ 厘米需要 $(-6) \\div (-0.75) = 8$ 天。",
          ],
          ["Multiply back: $8 \\times (-0.75) = -6$.", "乘回去：$8 \\times (-0.75) = -6$。"],
          ["A time is never negative: two negatives divide to a positive.", "时间不会是负数：两个负数相除得正数。"],
        ],
        (rng) => {
          const r = rng.pick([Q.of(1, 4), Q.of(1, 2), Q.of(3, 4), Q.of(5, 4), Q.of(3, 2), Q.of(5, 2), Q.of(2, 5), Q.of(6, 5), Q.of(8, 5)]);
          const n = rng.int(3, 20);
          const total = r.mul(Q.of(n));
          const diver = rng.bool();
          const [unit, zhUnit] = diver ? ["seconds", "秒"] : ["days", "天"];
          return valued(
            diver
              ? [
                  `A diver descends at a constant rate of $${dec(r)}$ meters per second. How many seconds does it take her to change elevation by $-${dec(total)}$ meters?`,
                  `一名潜水员以每秒 $${dec(r)}$ 米的速度匀速下潜。她的高度变化 $-${dec(total)}$ 米需要多少秒？`,
                ]
              : [
                  `The water level in a pond falls by $${dec(r)}$ centimeters per day. How many days does it take for the level to change by $-${dec(total)}$ centimeters?`,
                  `池塘的水位每天下降 $${dec(r)}$ 厘米。水位变化 $-${dec(total)}$ 厘米需要多少天？`,
                ],
            n,
            [
              [
                ["Signed numbers", "写成带符号的数"],
                [
                  `The total change is $-${dec(total)}$ and the change each ${diver ? "second" : "day"} is $-${dec(r)}$.`,
                  `总变化量是 $-${dec(total)}$，每${zhUnit}的变化量是 $-${dec(r)}$。`,
                ],
              ],
              [
                ["Divide", "相除"],
                ["Two negatives divide to a positive number of units:", "两个负数相除，得到正的单位数："],
                [`(-${dec(total)}) \\div (-${dec(r)}) = ${n}`],
              ],
            ],
            [`Multiply back: $${n} \\times (-${dec(r)}) = -${dec(total)}$.`, `乘回去：$${n} \\times (-${dec(r)}) = -${dec(total)}$。`],
            [
              [-n, `A number of ${unit} is not negative.`, `${zhUnit}数不会是负数。`],
              [total.mul(r), "That multiplies instead of dividing.", "这是做了乘法，应该相除。"],
              [r.div(total), "That divides the other way round.", "这是除反了。"],
            ],
          );
        },
        tableFigure(["(-6)÷(-0.75)", "8(-0.75)"], [8, -6]),
      ),
    ],
  ),
  [
    "A pond falls $0.75$ cm a day. How many days until it has changed by $-6$ cm?",
    "池塘水位每天下降 $0.75$ 厘米。多少天后水位变化 $-6$ 厘米？",
  ],
  ["$(-6) \\div (-0.75) = 8$ days; and $8 \\times (-0.75) = -6$.", "$(-6) \\div (-0.75) = 8$ 天；而 $8 \\times (-0.75) = -6$。"],
  ["solve rate problems with signed numbers by multiplying and dividing.", "用带符号数的乘除法解决变化率问题。"],
);

/** solvingProblemsUsingTheFourOperationsOnRationalNumbers combines all four operations in context. */
export const solvingProblemsUsingTheFourOperationsOnRationalNumbers = withIntro(
  topic(
    "solving-problems-using-the-four-operations-on-rational-numbers",
    t("Solving Problems Using the Four Operations on Rational Numbers", "用有理数四则运算解决问题"),
    t(
      "Many problems combine operations: a balance of \\$45.80 after three withdrawals of \\$18.25 and a deposit of \\$30 is 45.80 + 3 × (−18.25) + 30 = \\$21.05. The mean of several signed numbers is their sum divided by how many there are.",
      "很多问题要综合运用几种运算：余额 \\$45.80，取款 3 次每次 \\$18.25，再存入 \\$30，结果是 45.80 + 3 × (−18.25) + 30 = \\$21.05。几个带符号的数的平均数是它们的和除以个数。",
    ),
    [
      "solving-problems-using-multiplication-and-division-of-rational-numbers",
      "solving-problems-using-addition-and-subtraction-of-rational-numbers",
    ],
    ["7.NS.A.3", "7.EE.B.3"],
    [
      lesson(
        "a-balance-after-several-transactions",
        ["A balance after several transactions", "多次收支后的余额"],
        [
          [
            "Write deposits as positive numbers and withdrawals as negative numbers. Repeated equal transactions can be multiplied, and everything is then added to the starting balance. $\\$45.80$, then three withdrawals of $\\$18.25$ and a deposit of $\\$30$: $45.80 + 3 \\times (-18.25) + 30 = 45.80 - 54.75 + 30 = 21.05$ dollars.",
            "把存款写成正数，取款写成负数。重复的相同交易可以用乘法，然后把所有交易都加到起始余额上。余额 $\\$45.80$，取款三次每次 $\\$18.25$，再存入 $\\$30$：$45.80 + 3 \\times (-18.25) + 30 = 45.80 - 54.75 + 30 = 21.05$ 美元。",
          ],
          ["Work back: $21.05 - 30 + 54.75 = 45.80$, the starting balance.", "倒推回去：$21.05 - 30 + 54.75 = 45.80$，正是起始余额。"],
          [
            "Count every withdrawal: three of them take away $3 \\times 18.25$, not $18.25$.",
            "每次取款都要算：三次取款共减去 $3 \\times 18.25$，不是 $18.25$。",
          ],
        ],
        (rng) => {
          const name = rng.pick(names);
          const start = rng.int(1000, 9000);
          const n = rng.int(2, 6);
          const w = 5 * rng.int(100, 900);
          const d = 100 * rng.int(5, 80);
          const end = start - n * w + d;
          const q = (c: number) => Q.of(c, 100);
          return valued(
            [
              `${name}'s bank account has a balance of $\\$${cents(start)}$. ${name} makes $${n}$ withdrawals of $\\$${cents(w)}$ each and then deposits $\\$${cents(d)}$. What is the balance now, in dollars? Write a negative balance as a negative number.`,
              `${name} 的银行账户余额是 $\\$${cents(start)}$。${name} 取款 $${n}$ 次，每次 $\\$${cents(w)}$，然后存入 $\\$${cents(d)}$。现在余额是多少美元？余额为负时用负数表示。`,
            ],
            q(end),
            [
              [
                ["The withdrawals", "取款"],
                ["Each withdrawal is negative, and there are several:", "每次取款都是负数，共有几次："],
                [`${n} \\times (-${cents(w)}) = -${cents(n * w)}`],
              ],
              [
                ["Add it all", "全部相加"],
                ["Add the withdrawals and the deposit to the balance:", "把取款和存款都加到余额上："],
                [`${cents(start)} - ${cents(n * w)} + ${cents(d)} = ${dec(q(end))}`],
              ],
            ],
            [
              `Work back: $${dec(q(end))} - ${cents(d)} + ${cents(n * w)} = ${cents(start)}$, the starting balance.`,
              `倒推回去：$${dec(q(end))} - ${cents(d)} + ${cents(n * w)} = ${cents(start)}$，正是起始余额。`,
            ],
            [
              [q(start - w + d), "That counts only one withdrawal.", "这只算了一次取款。"],
              [q(start + n * w + d), "That adds the withdrawals; they take money out.", "这是把取款加上了；取款是把钱拿走。"],
              [q(start - n * w - d), "That subtracts the deposit; it puts money in.", "这是减去了存款；存款是把钱放进去。"],
            ],
            { form: "decimal" },
          );
        },
        tableFigure(["45.80", "3(-18.25)", "+30"], [45.8, -54.75, 30]),
      ),
      lesson(
        "the-mean-of-signed-numbers",
        ["The mean of signed numbers", "带符号数的平均数"],
        [
          [
            "The mean of a set of numbers is their sum divided by how many there are, and this works for negative numbers too. Add the signed values carefully, then divide. The low temperatures on four days were $-6$, $2$, $-3.5$ and $-4.5$ degrees. The mean is $(-6 + 2 - 3.5 - 4.5) \\div 4 = -12 \\div 4 = -3$ degrees.",
            "一组数的平均数等于它们的和除以个数，对负数也一样。仔细把带符号的数相加，再相除。四天的最低气温分别是 $-6$、$2$、$-3.5$ 和 $-4.5$ 度。平均数是 $(-6 + 2 - 3.5 - 4.5) \\div 4 = -12 \\div 4 = -3$ 度。",
          ],
          ["Multiply back: $4 \\times (-3) = -12$, the sum.", "乘回去：$4 \\times (-3) = -12$，正是总和。"],
          ["Keep the signs when adding: ignoring them gives a mean that is too high.", "相加时要保留符号：忽略符号会让平均数偏高。"],
        ],
        (rng) => {
          const n = rng.int(4, 6);
          let vs: Q[];
          let mean: Q;
          do {
            vs = Array.from({ length: n }, () => Q.of(rng.int(-30, 12), 2));
            mean = vs.reduce((s, v) => s.add(v), Q.zero).div(Q.of(n));
          } while (!isTerminating(mean) || mean.d > 4n || mean.sign() >= 0 || vs.every((v) => v.isInteger()));
          const sum = vs.reduce((s, v) => s.add(v), Q.zero);
          const absMean = vs.reduce((s, v) => s.add(v.abs()), Q.zero).div(Q.of(n));
          const list = vs.map((v) => dec(v));
          const added = list.map((v, i) => (i === 0 ? v : v.startsWith("-") ? `- ${v.slice(1)}` : `+ ${v}`)).join(" ");
          return valued(
            [
              `The low temperatures, in degrees Celsius, over $${n}$ days were $${list.join("$, $")}$. What was the mean low temperature?`,
              `连续 $${n}$ 天的最低气温（摄氏度）分别是 $${list.join("$、$")}$。最低气温的平均数是多少？`,
            ],
            mean,
            [
              [["Add", "相加"], ["Add the signed values:", "把带符号的数相加："], [`${added} = ${dec(sum)}`]],
              [["Divide", "相除"], [`Divide by the $${n}$ days:`, `除以 $${n}$ 天：`], [`${dec(sum)} \\div ${n} = ${dec(mean)}`]],
            ],
            [
              `Multiply back: $${n} \\times (${dec(mean)}) = ${dec(sum)}$, the sum.`,
              `乘回去：$${n} \\times (${dec(mean)}) = ${dec(sum)}$，正是总和。`,
            ],
            [
              [mean.neg(), "The sign is wrong: the sum is negative.", "符号错了：总和是负数。"],
              ...(isTerminating(absMean) ? ([[absMean, "That ignores the signs of the values.", "这是忽略了数的符号。"]] as const) : []),
              [sum, "That is the sum; divide by the number of days.", "这是总和；还要除以天数。"],
            ],
            { form: "decimal" },
          );
        },
        tableFigure(["-6+2-3.5-4.5", "-12÷4"], [-12, -3]),
      ),
    ],
  ),
  [
    "Four low temperatures were $-6$, $2$, $-3.5$ and $-4.5$ degrees. What is their mean?",
    "四天的最低气温是 $-6$、$2$、$-3.5$ 和 $-4.5$ 度。平均数是多少？",
  ],
  [
    "$(-6 + 2 - 3.5 - 4.5) \\div 4 = -12 \\div 4 = -3$ degrees; and $4 \\times (-3) = -12$.",
    "$(-6 + 2 - 3.5 - 4.5) \\div 4 = -12 \\div 4 = -3$ 度；而 $4 \\times (-3) = -12$。",
  ],
  ["solve problems that combine adding, subtracting, multiplying and dividing signed numbers.", "解决综合运用带符号数加减乘除的问题。"],
);

/** solvingMultistepProblemsWithRationalNumbers solves longer problems with fractions, decimals and signs. */
export const solvingMultistepProblemsWithRationalNumbers = withIntro(
  topic(
    "solving-multistep-problems-with-rational-numbers",
    t("Solving Multistep Problems With Rational Numbers", "解多步有理数问题"),
    t(
      "Break a long problem into steps, write each quantity with its sign, and keep fractions or decimals exact until the end. A profit is income minus costs; a negative result is a loss.",
      "把复杂的问题分成几步，每个量都带上符号，分数或小数保持精确直到最后。利润等于收入减去成本，结果为负表示亏损。",
    ),
    ["solving-problems-using-the-four-operations-on-rational-numbers", "fractions-of-fractions"],
    ["7.NS.A.3", "7.EE.B.3"],
    [
      lesson(
        "multistep-elevation-problems",
        ["Elevations with fractions", "含分数的海拔问题"],
        [
          [
            "Write the starting position and each move as a signed number: up is positive and down is negative. A move made several times is a product. Put everything into one expression and use the order of operations. A diver at $-12\\frac{1}{2}$ m rises $3$ times by $2\\frac{3}{4}$ m and then sinks $5\\frac{1}{4}$ m: $-12\\frac{1}{2} + 3 \\times 2\\frac{3}{4} - 5\\frac{1}{4} = -12\\frac{1}{2} + 8\\frac{1}{4} - 5\\frac{1}{4} = -9\\frac{1}{2}$ m.",
            "把起始位置和每次移动都写成带符号的数：向上为正，向下为负。同一个移动做了好几次，就用乘法。把它们合成一个算式，按运算顺序计算。潜水员在 $-12\\frac{1}{2}$ 米处，上升 $3$ 次，每次 $2\\frac{3}{4}$ 米，然后下沉 $5\\frac{1}{4}$ 米：$-12\\frac{1}{2} + 3 \\times 2\\frac{3}{4} - 5\\frac{1}{4} = -12\\frac{1}{2} + 8\\frac{1}{4} - 5\\frac{1}{4} = -9\\frac{1}{2}$ 米。",
          ],
          [
            "Work back from the end: $-9\\frac{1}{2} + 5\\frac{1}{4} - 8\\frac{1}{4} = -12\\frac{1}{2}$, the starting elevation.",
            "从终点倒推：$-9\\frac{1}{2} + 5\\frac{1}{4} - 8\\frac{1}{4} = -12\\frac{1}{2}$，正是起始海拔。",
          ],
          ["A rise made $3$ times counts $3$ times: multiply it before adding.", "上升了 $3$ 次就要算 $3$ 次：先相乘，再相加。"],
        ],
        (rng) => {
          let start: Q, n: number, up: Q, down: Q, end: Q;
          do {
            start = Q.of(rng.int(20, 160), rng.pick([2, 4])).neg();
            n = rng.int(2, 5);
            up = Q.of(rng.int(5, 40), 4);
            down = Q.of(rng.int(3, 40), 4);
            end = start.add(up.mul(Q.of(n))).sub(down);
          } while (end.sign() >= 0 || start.isInteger() || up.isInteger() || down.isInteger());
          const rise = up.mul(Q.of(n));
          const m = mixedLatex;
          return valued(
            [
              `A diver is at an elevation of $${m(start)}$ meters, rises $${m(up)}$ meters $${n}$ times and then descends $${m(down)}$ meters. What is the diver's elevation now, in meters?`,
              `一名潜水员在海拔 $${m(start)}$ 米处，上升 $${n}$ 次，每次 $${m(up)}$ 米，然后下潜 $${m(down)}$ 米。潜水员现在的海拔是多少米？`,
            ],
            end,
            [
              [
                ["The whole rise", "一共上升多少"],
                [`The diver rises $${n}$ times, so multiply:`, `潜水员上升了 $${n}$ 次，所以相乘：`],
                [`${n} \\times ${m(up)} = ${m(rise)}`],
              ],
              [
                ["Combine the moves", "合并所有移动"],
                ["Start below zero, add the rise and subtract the descent:", "从零下的位置出发，加上上升的，减去下潜的："],
                [`${m(start)} + ${m(rise)} - ${m(down)} = ${m(end)}`],
              ],
            ],
            [
              `Work back from the end: $${m(end)} + ${m(down)} - ${m(rise)} = ${m(start)}$, the starting elevation.`,
              `从终点倒推：$${m(end)} + ${m(down)} - ${m(rise)} = ${m(start)}$，正是起始海拔。`,
            ],
            [
              [
                start.add(up).sub(down),
                `That counts the rise once; the diver rises $${n}$ times.`,
                `这只算了一次上升；潜水员上升了 $${n}$ 次。`,
              ],
              [
                start.sub(rise).add(down),
                "That swaps the directions: rising is positive and descending is negative.",
                "这是把方向弄反了：上升为正，下潜为负。",
              ],
              [
                start.neg().add(rise).sub(down),
                "That starts above the surface; the diver starts below zero.",
                "这是从水面以上出发；潜水员是从零以下出发的。",
              ],
            ],
          );
        },
        lineFigure(
          {
            lo: -14,
            hi: 0,
            step: 1,
            labels: [-14, -7, 0],
            marks: [
              { at: -12.5, text: "-12.5" },
              { at: -4.25, text: "-4.25" },
              { at: -9.5, text: "-9.5", result: true },
            ],
            jumps: [
              [-12.5, -4.25],
              [-4.25, -9.5],
            ],
          },
          [
            "A number line from -14 to 0: a jump up from -12.5 to -4.25 for the three rises, then down to -9.5.",
            "从 -14 到 0 的数轴：三次上升从 -12.5 跳到 -4.25，再下沉到 -9.5。",
          ],
        ),
      ),
      lesson(
        "profit-and-loss",
        ["Profit and loss", "盈利与亏损"],
        [
          [
            "Profit is income minus costs. Find the income first, subtract the costs, then share the result. A negative result means the costs were larger: that is a loss. A club pays $\\$85.50$ for supplies and sells $24$ cups of lemonade at $\\$1.75$ each, then splits the result among $3$ members: the income is $24 \\times 1.75 = 42$, the profit is $42 - 85.50 = -43.50$, and each member gets $-43.50 \\div 3 = -14.50$ dollars, a loss.",
            "利润等于收入减去成本。先算收入，再减去成本，最后把结果平分。结果是负数表示成本更高，也就是亏损。一个社团花 $\\$85.50$ 买材料，卖出 $24$ 杯柠檬水，每杯 $\\$1.75$，再由 $3$ 名成员平分结果：收入是 $24 \\times 1.75 = 42$，利润是 $42 - 85.50 = -43.50$，每人分得 $-43.50 \\div 3 = -14.50$ 美元，即亏损。",
          ],
          [
            "Multiply back: $3 \\times (-14.50) = -43.50$, and $-43.50 + 85.50 = 42$, the income.",
            "乘回去：$3 \\times (-14.50) = -43.50$，而 $-43.50 + 85.50 = 42$，正是收入。",
          ],
          ["Costs are subtracted from the income, never added to it.", "成本要从收入中减去，不能加上。"],
        ],
        (rng) => {
          const k = rng.int(2, 5);
          let price: number, n: number, cost: number;
          // Redraw everything: with an even k and an odd n·price/25, no cost would split evenly.
          do {
            price = 25 * rng.int(3, 12);
            n = rng.int(10, 60);
            cost = 50 * rng.int(10, 120);
          } while ((n * price - cost) % k !== 0 || n * price === cost);
          const profit = Q.of(n * price - cost, 100);
          const share = profit.div(Q.of(k));
          const gain = cents(n * price - cost);
          const gainPar = n * price < cost ? `(${gain})` : gain;
          return valued(
            [
              `A club spends $\\$${cents(cost)}$ on supplies. It sells ${n} cups of lemonade for $\\$${cents(price)}$ each. The profit is shared equally among ${k} members. How much does each member get, in dollars? Write a loss as a negative number.`,
              `一个社团花 $\\$${cents(cost)}$ 买材料，卖出 ${n} 杯柠檬水，每杯 $\\$${cents(price)}$。利润由 ${k} 名成员平分。每人分得多少美元？亏损用负数表示。`,
            ],
            share,
            [
              [
                ["The income", "收入"],
                ["Multiply the cups by the price:", "杯数乘单价："],
                [`${n} \\times ${cents(price)} = ${cents(n * price)}`],
              ],
              [
                ["The profit", "利润"],
                ["Subtract the costs from the income:", "用收入减去成本："],
                [`${cents(n * price)} - ${cents(cost)} = ${gain}`],
              ],
              [
                ["Each share", "每人一份"],
                [`Divide among the ${k} members:`, `平分给 ${k} 名成员：`],
                [`${gainPar} \\div ${k} = ${dec(share)}`],
              ],
            ],
            [
              `Multiply back: $${k} \\times ${par(share, "decimal")} = ${gain}$, and $${gain} + ${cents(cost)} = ${cents(n * price)}$, the income.`,
              `乘回去：$${k} \\times ${par(share, "decimal")} = ${gain}$，而 $${gain} + ${cents(cost)} = ${cents(n * price)}$，正是收入。`,
            ],
            [
              [
                share.neg(),
                "The sign is wrong: profit is income minus costs, not costs minus income.",
                "符号错了：利润是收入减成本，不是成本减收入。",
              ],
              [profit, `That is the whole club's profit; it is shared among ${k} members.`, `这是整个社团的利润；还要平分给 ${k} 名成员。`],
              [
                Q.of(n * price + cost, 100 * k),
                "That adds the costs; they are subtracted from the income.",
                "这是加上了成本；成本应该从收入中减去。",
              ],
            ],
            { form: "decimal" },
          );
        },
        tableFigure(["24(1.75)", "42-85.5", "-43.5/3"], [42, -43.5, -14.5]),
      ),
    ],
  ),
  [
    "A club sells $24$ cups at $\\$1.75$ but spent $\\$85.50$. Did it make money?",
    "社团以每杯 $\\$1.75$ 卖出 $24$ 杯，但花了 $\\$85.50$。它赚钱了吗？",
  ],
  [
    "The income is $24 \\times 1.75 = 42$ and $42 - 85.50 = -43.50$: a loss. Adding back, $-43.50 + 85.50 = 42$.",
    "收入是 $24 \\times 1.75 = 42$，$42 - 85.50 = -43.50$：亏损了。加回去，$-43.50 + 85.50 = 42$。",
  ],
  ["break a long problem with signed fractions and decimals into steps.", "把含带符号分数和小数的复杂问题分成几步来解。"],
);

/** Expansion is the decimal expansion of a positive rational: whole part, digits before the repeating block, and the block. */
interface Expansion {
  readonly whole: bigint;
  readonly pre: string;
  readonly rep: string;
}

/** expansion finds the decimal expansion of a positive rational by long division. */
function expansion(q: Q): Expansion {
  const whole = q.n / q.d;
  let r = q.n % q.d;
  const seen = new Map<bigint, number>();
  let digits = "";
  while (r !== 0n && !seen.has(r)) {
    seen.set(r, digits.length);
    r *= 10n;
    digits += String(r / q.d);
    r %= q.d;
  }
  if (r === 0n) return { whole, pre: digits, rep: "" };
  const at = seen.get(r)!;
  return { whole, pre: digits.slice(0, at), rep: digits.slice(at) };
}

/** expansionValue is the rational number an expansion stands for. */
function expansionValue(e: Expansion): Q {
  const p = 10 ** e.pre.length;
  const head = Q.of(Number(e.whole)).add(Q.of(Number(e.pre || "0"), p));
  return e.rep ? head.add(Q.of(Number(e.rep), p * (10 ** e.rep.length - 1))) : head;
}

/** expansionLatex writes an expansion with a bar over the repeating block: "0.1\overline{6}". */
const expansionLatex = (e: Expansion, sign = "") =>
  `${sign}${e.whole}${e.pre || e.rep ? "." : ""}${e.pre}${e.rep ? `\\overline{${e.rep}}` : ""}`;

/** repeatingDenominators are denominators whose fractions repeat with short periods. */
const repeatingDenominators = [3, 6, 9, 11, 12, 15, 18, 22, 30, 33, 36, 45];

/** factorLatex writes a whole number as a product of primes with exponents: "2^{2} \times 3". */
function factorLatex(n: number): string {
  const parts: string[] = [];
  let m = n;
  for (let p = 2; m > 1; p++) {
    let e = 0;
    while (m % p === 0) {
      m /= p;
      e++;
    }
    if (e > 0) parts.push(e > 1 ? `${p}^{${e}}` : `${p}`);
  }
  return parts.join(" \\times ");
}

/** rationalNumbersAsFiniteOrRepeatingDecimals converts fractions to decimals that terminate or repeat. */
export const rationalNumbersAsFiniteOrRepeatingDecimals = withIntro(
  topic(
    "rational-numbers-as-finite-or-repeating-decimals",
    t("Rational Numbers as Finite or Repeating Decimals", "有理数是有限小数或无限循环小数"),
    t(
      "Dividing the numerator by the denominator turns any fraction into a decimal that either ends or repeats. In lowest terms, a fraction terminates exactly when its denominator has no prime factors other than 2 and 5: $-\\frac{3}{8} = -0.375$, but $\\frac{5}{6} = 0.8333\\ldots = 0.8\\overline{3}$.",
      "用分子除以分母，任何分数都能化成有限小数或无限循环小数。化成最简分数后，分母只含质因数 2 和 5 时才是有限小数：$-\\frac{3}{8} = -0.375$，而 $\\frac{5}{6} = 0.8333\\ldots = 0.8\\overline{3}$。",
    ),
    ["dividing-with-negative-numbers", "division-of-whole-numbers-with-decimal-quotients"],
    ["7.NS.A.2d"],
    [
      lesson(
        "writing-a-fraction-as-a-terminating-decimal",
        ["Terminating decimals", "化成有限小数"],
        [
          [
            "A fraction bar means division. To write a fraction as a decimal, divide the numerator by the denominator. If the division ends with no remainder, the decimal terminates. A negative fraction gives a negative decimal: $-\\frac{3}{8} = -(3 \\div 8) = -0.375$.",
            "分数线表示除法。把分数化成小数，就用分子除以分母。如果除到没有余数为止，得到的就是有限小数。负分数化成的小数也是负数：$-\\frac{3}{8} = -(3 \\div 8) = -0.375$。",
          ],
          [
            "Make the denominator a power of ten: $\\frac{3}{8} = \\frac{375}{1000} = 0.375$.",
            "把分母变成 10 的幂：$\\frac{3}{8} = \\frac{375}{1000} = 0.375$。",
          ],
          ["$-\\frac{3}{8}$ is not $-3.8$: the fraction bar is not a decimal point.", "$-\\frac{3}{8}$ 不是 $-3.8$：分数线不是小数点。"],
        ],
        (rng) => {
          const d = rng.pick([4, 8, 16, 20, 25, 40, 50, 80]);
          let n: number;
          do n = rng.int(1, 2 * d);
          while (gcd(n, d) !== 1);
          const sign = rng.bool(0.7) ? -1 : 1;
          const v = Q.of(sign * n, d);
          const digits = String(d).length;
          const misread = Q.of(sign * (n * 10 ** digits + d), 10 ** digits);
          let power = 10;
          while (power % d !== 0) power *= 10;
          const scale = power / d;
          const minus = sign < 0 ? "-" : "";
          return valued(
            [`Write $${v.toLatex()}$ as a decimal.`, `把 $${v.toLatex()}$ 化成小数。`],
            v,
            [
              [["Divide", "做除法"], ["The fraction bar means division:", "分数线表示除法："], [`${n} \\div ${d} = ${dec(Q.of(n, d))}`]],
              [
                ["The sign", "符号"],
                sign < 0
                  ? ["The fraction is negative, so the decimal is negative:", "分数是负的，小数也是负的："]
                  : ["The fraction is positive, so the decimal is positive:", "分数是正的，小数也是正的："],
                [`${v.toLatex()} = ${dec(v)}`],
              ],
            ],
            [
              `Make the denominator a power of ten: $${minus}\\frac{${n}}{${d}} = ${minus}\\frac{${n * scale}}{${power}} = ${dec(v)}$.`,
              `把分母变成 10 的幂：$${minus}\\frac{${n}}{${d}} = ${minus}\\frac{${n * scale}}{${power}} = ${dec(v)}$。`,
            ],
            [
              [
                v.neg(),
                sign < 0
                  ? "The sign is lost: a negative fraction gives a negative decimal."
                  : "The fraction is positive, so the decimal is positive.",
                sign < 0 ? "符号丢了：负分数化成的小数也是负数。" : "分数是正的，所以小数也是正的。",
              ],
              [
                misread,
                "That reads the fraction bar as a decimal point; the bar means division.",
                "这是把分数线当成了小数点；分数线表示除法。",
              ],
              Q.of(sign * d, n).d === 1n
                ? [
                    Q.of(sign * d, n),
                    "That divides the denominator by the numerator; divide the numerator by the denominator.",
                    "这是用分母除以分子；应该用分子除以分母。",
                  ]
                : [
                    Q.of(sign * n, 10 ** digits),
                    "That only writes the numerator after the decimal point; divide it by the denominator.",
                    "这只是把分子写在小数点后面；要用分子除以分母。",
                  ],
            ],
            { form: "decimal" },
          );
        },
        tableFigure(["3 ÷ 8", "-3/8"], [0.375, -0.375]),
      ),
      lesson(
        "terminating-or-repeating",
        ["Terminating or repeating", "有限还是循环"],
        [
          [
            "First write the fraction in lowest terms, then break the denominator into prime factors. If the only primes are $2$ and $5$, the decimal terminates; any other prime makes it repeat. $\\frac{9}{12} = \\frac{3}{4}$ and $4 = 2^{2}$, so it terminates: $0.75$. $\\frac{7}{12}$ is in lowest terms and $12 = 2^{2} \\times 3$ has the factor $3$, so it repeats: $0.58\\overline{3}$.",
            "先把分数化成最简分数，再把分母分解质因数。如果只有质因数 $2$ 和 $5$，就是有限小数；有其他质因数，就是循环小数。$\\frac{9}{12} = \\frac{3}{4}$，$4 = 2^{2}$，所以是有限小数：$0.75$。$\\frac{7}{12}$ 已是最简分数，$12 = 2^{2} \\times 3$ 含因数 $3$，所以是循环小数：$0.58\\overline{3}$。",
          ],
          [
            "Divide to be sure: $9 \\div 12 = 0.75$ ends, and $7 \\div 12 = 0.58333\\ldots$ never ends.",
            "做除法验证：$9 \\div 12 = 0.75$ 除尽了，而 $7 \\div 12 = 0.58333\\ldots$ 永远除不尽。",
          ],
          [
            "Simplify first: $\\frac{9}{12}$ has the factor $3$ in $12$, yet it terminates, because the $3$ cancels.",
            "要先约分：$\\frac{9}{12}$ 的分母 $12$ 含因数 $3$，却是有限小数，因为 $3$ 被约掉了。",
          ],
        ],
        (rng) => {
          const terminates = rng.bool();
          const base = terminates ? rng.pick([2, 4, 5, 8, 10, 20, 25, 40]) : rng.pick([3, 6, 7, 9, 11, 12, 15, 18, 30]);
          let n: number;
          do n = rng.int(1, 3 * base);
          while (gcd(n, base) !== 1);
          const k = terminates ? rng.pick([1, 3, 3, 7, 9]) : rng.pick([1, 1, 2, 5]);
          const sign = rng.bool(0.5) ? "-" : "";
          const [sn, sd] = [n * k, base * k];
          const e = expansion(Q.of(n, base));
          const terminating: Pair = ["Terminating", "有限小数"];
          const repeating: Pair = ["Repeating", "无限循环小数"];
          return chosen(
            rng,
            [
              `Is $${sign}\\frac{${sn}}{${sd}}$ a terminating decimal or a repeating decimal?`,
              `$${sign}\\frac{${sn}}{${sd}}$ 是有限小数还是无限循环小数？`,
            ],
            terminates ? terminating : repeating,
            [
              terminates
                ? [
                    repeating,
                    `In lowest terms the denominator is $${base}$, whose only prime factors are 2 and 5, so the division ends.`,
                    `化成最简分数后分母是 $${base}$，只含质因数 2 和 5，所以能除尽。`,
                  ]
                : [
                    terminating,
                    `In lowest terms the denominator $${base}$ has a prime factor other than 2 and 5, so the division never ends.`,
                    `化成最简分数后分母 $${base}$ 含有 2 和 5 以外的质因数，所以永远除不尽。`,
                  ],
            ],
            [
              [
                ["Lowest terms", "化成最简分数"],
                k > 1
                  ? [`Divide the top and bottom by $${k}$:`, `分子分母同除以 $${k}$：`]
                  : ["The fraction is already in lowest terms:", "这个分数已经是最简分数："],
                [k > 1 ? `\\frac{${sn}}{${sd}} = \\frac{${n}}{${base}}` : `\\frac{${n}}{${base}}`],
              ],
              [
                ["Prime factors", "分解质因数"],
                terminates
                  ? ["The denominator has only the primes 2 and 5, so the decimal terminates:", "分母只含质因数 2 和 5，所以是有限小数："]
                  : [
                      "The denominator has a prime other than 2 and 5, so the decimal repeats:",
                      "分母含有 2 和 5 以外的质因数，所以是循环小数：",
                    ],
                [`${base} = ${factorLatex(base)}`],
              ],
            ],
            [
              `Divide: $${sign}\\frac{${n}}{${base}} = ${expansionLatex(e, sign)}$.`,
              `做除法：$${sign}\\frac{${n}}{${base}} = ${expansionLatex(e, sign)}$。`,
            ],
          );
        },
        tableFigure(["9/12", "3/4"], [0.75, 0.75]),
      ),
      lesson(
        "writing-a-repeating-decimal",
        ["Writing a repeating decimal", "写出循环小数"],
        [
          [
            "When the division never ends, the remainders start to repeat, and so do the digits. Write the repeating block once with a bar over it; digits that come before the block get no bar. $\\frac{5}{11} = 0.454545\\ldots = 0.\\overline{45}$, and $\\frac{1}{6} = 0.1666\\ldots = 0.1\\overline{6}$.",
            "如果除法永远除不尽，余数会开始重复，数字也随之重复。把重复的一组数字写一次，并在上面画一条横线；循环节之前的数字不画横线。$\\frac{5}{11} = 0.454545\\ldots = 0.\\overline{45}$；$\\frac{1}{6} = 0.1666\\ldots = 0.1\\overline{6}$。",
          ],
          ["Multiply back: $11 \\times 0.4545 = 4.9995$, which is almost $5$.", "乘回去：$11 \\times 0.4545 = 4.9995$，几乎就是 $5$。"],
          [
            "The bar covers only the digits that repeat: $\\frac{1}{6}$ is $0.1\\overline{6}$, not $0.\\overline{16}$.",
            "横线只覆盖重复的数字：$\\frac{1}{6}$ 是 $0.1\\overline{6}$，不是 $0.\\overline{16}$。",
          ],
        ],
        (rng) => {
          const d = rng.pick(repeatingDenominators);
          let n: number;
          do n = rng.int(1, d - 1);
          while (gcd(n, d) !== 1);
          const sign = rng.bool(0.4) ? "-" : "";
          const v = Q.of(n, d);
          const e = expansion(v);
          const all = e.pre + e.rep;
          const said: [Expansion, string, string][] = [
            e.pre
              ? [
                  { whole: e.whole, pre: "", rep: all },
                  `The bar also covers $${e.pre}$, but those digits come only once.`,
                  `横线也盖住了 $${e.pre}$，但这些数字只出现一次。`,
                ]
              : [
                  { whole: e.whole, pre: e.rep.slice(0, -1), rep: e.rep.slice(-1) },
                  `Only the last digit is under the bar, but the whole block $${e.rep}$ repeats.`,
                  `横线只盖住最后一位，但整组 $${e.rep}$ 都在重复。`,
                ],
            [
              { whole: e.whole, pre: all, rep: "" },
              "That stops after one block; the digits repeat forever, so the block needs a bar.",
              "这是写完一组就停了；数字会永远重复，循环节上要画横线。",
            ],
            [
              { whole: e.whole, pre: all + e.rep, rep: "" },
              "That stops after two blocks; the digits repeat forever, so the block needs a bar.",
              "这是写完两组就停了；数字会永远重复，循环节上要画横线。",
            ],
            [
              expansion(Q.of(d, n)),
              "That divides the denominator by the numerator; divide the numerator by the denominator.",
              "这是用分母除以分子；应该用分子除以分母。",
            ],
          ];
          const seen: Q[] = [v];
          const wrong: [string, string, string][] = [];
          for (const [w, en, zh] of said) {
            const value = expansionValue(w);
            if (seen.some((s) => s.eq(value))) continue;
            seen.push(value);
            wrong.push([expansionLatex(w, sign), en, zh]);
          }
          const digits = all + e.rep;
          const cut = Q.of(Number(`${e.whole}${digits}`), 10 ** digits.length);
          return chosenMath(
            rng,
            [`Which decimal is equal to $${sign}\\frac{${n}}{${d}}$?`, `哪个小数等于 $${sign}\\frac{${n}}{${d}}$？`],
            expansionLatex(e, sign),
            wrong,
            [
              [
                ["Divide", "做除法"],
                [`Divide $${n}$ by $${d}$; the digits never end:`, `用 $${n}$ 除以 $${d}$；数字没有尽头：`],
                [`${n} \\div ${d} = ${e.whole}.${digits}${e.rep}\\ldots`],
              ],
              [
                ["Mark the block", "标出循环节"],
                e.pre
                  ? [
                      `After $${e.pre}$ the block $${e.rep}$ repeats, so the bar goes over $${e.rep}$ only:`,
                      `在 $${e.pre}$ 之后，$${e.rep}$ 不断重复，所以横线只画在 $${e.rep}$ 上：`,
                    ]
                  : [
                      `The block $${e.rep}$ repeats from the start, so the bar goes over it:`,
                      `$${e.rep}$ 从一开始就不断重复，所以横线画在它上面：`,
                    ],
                [`${sign}\\frac{${n}}{${d}} = ${expansionLatex(e, sign)}`],
              ],
            ],
            [
              `Multiply back: $${d} \\times ${dec(cut)} = ${dec(cut.mul(Q.of(d)))}$, which is almost $${n}$.`,
              `乘回去：$${d} \\times ${dec(cut)} = ${dec(cut.mul(Q.of(d)))}$，几乎就是 $${n}$。`,
            ],
          );
        },
        tableFigure(["10 - 6", "40 - 36"], [4, 4]),
      ),
    ],
  ),
  ["Does $\\frac{1}{3}$ end when you divide $1$ by $3$?", "用 $1$ 除以 $3$，$\\frac{1}{3}$ 能除尽吗？"],
  [
    "No: $1 \\div 3 = 0.333\\ldots$, because the remainder is $1$ every time; the denominator $3$ is not made of 2s and 5s, so it repeats: $0.\\overline{3}$.",
    "不能：$1 \\div 3 = 0.333\\ldots$，因为每次余数都是 $1$；分母 $3$ 不是由 2 和 5 组成的，所以是循环小数：$0.\\overline{3}$。",
  ],
  ["write fractions as decimals and tell whether they terminate or repeat.", "把分数化成小数，并判断是有限小数还是循环小数。"],
);

// ---------------------------------------------------------------------------
// Exponents

/** powerBase writes a base for a power, in parentheses when it is negative or a fraction: "\left(-\frac{2}{3}\right)". */
const powerBase = (q: Q, kind: Kind) =>
  q.sign() < 0 || (!q.isInteger() && kind !== "decimal") ? `\\left(${show(q, kind)}\\right)` : show(q, kind);

/** places counts the decimal places of a terminating decimal. */
function places(q: Q): number {
  let p = 0;
  for (let v = q; !v.isInteger(); v = v.mul(Q.of(10))) p++;
  return p;
}

/** powerSign says what the sign of b^n is and why. */
function powerSign(b: Q, n: number): Pair {
  const even = n % 2 === 0;
  return b.sign() < 0
    ? [
        `There are $${n}$ negative factors, an ${even ? "even" : "odd"} number, so the result is ${even ? "positive" : "negative"}.`,
        `有 $${n}$ 个负因数，是${even ? "偶" : "奇"}数个，所以结果为${even ? "正" : "负"}。`,
      ]
    : ["Every factor is positive, so the result is positive.", "每个因数都是正的，所以结果为正。"];
}

/** signSlip is the reason for a power with the wrong sign. */
function signSlip(b: Q, n: number): [string, string] {
  const [en, zh] = powerSign(b, n);
  return [`The sign is wrong. ${en}`, `符号错了。${zh}`];
}

/** powerProblem asks for b^n, works it as repeated factors, checks it another way, and names the typical slips: the sign, multiplying by n, and the place of the point or the denominator. */
function powerProblem(b: Q, n: number, kind: Kind): Problem {
  const r = b.pow(n);
  const base = powerBase(b, kind);
  const factors = Array.from({ length: n }, () => base).join(" \\times ");
  const size = b.abs().pow(n);
  let check: Pair;
  if (kind === "decimal" && !b.isInteger()) {
    const p = places(b);
    const k = Number(b.abs().mul(Q.of(10 ** p)).n);
    check = [
      `Leave out the decimal point: $${k}^{${n}} = ${k ** n}$. The power has $${n} \\times ${p} = ${n * p}$ decimal places, so its size is $${show(size, kind)}$.`,
      `先不看小数点：$${k}^{${n}} = ${k ** n}$。乘方的小数位数是 $${n} \\times ${p} = ${n * p}$ 位，所以它的大小是 $${show(size, kind)}$。`,
    ];
  } else if (!b.isInteger()) {
    const top = b.abs().n;
    check = [
      `Raise the top and the bottom separately: $${top}^{${n}} = ${top ** BigInt(n)}$ and $${b.d}^{${n}} = ${b.d ** BigInt(n)}$, so its size is $${size.toLatex()}$.`,
      `分子和分母分别乘方：$${top}^{${n}} = ${top ** BigInt(n)}$，$${b.d}^{${n}} = ${b.d ** BigInt(n)}$，所以它的大小是 $${size.toLatex()}$。`,
    ];
  } else {
    const rest = b.pow(n - 1);
    check = [
      `Divide back: $${show(r, kind)} \\div ${par(b, kind)} = ${show(rest, kind)}$, which is ${n === 2 ? "the base itself" : `$${base}^{${n - 1}}$`}.`,
      `除回去：$${show(r, kind)} \\div ${par(b, kind)} = ${show(rest, kind)}$，正是${n === 2 ? "底数本身" : `$${base}^{${n - 1}}$`}。`,
    ];
  }
  const [sEn, sZh] = signSlip(b, n);
  return valued(
    [`Evaluate $${base}^{${n}}$.`, `计算 $${base}^{${n}}$。`],
    r,
    [
      [
        ["Write the factors", "写成因数相乘"],
        [`The exponent $${n}$ says the base is a factor $${n}$ times:`, `指数 $${n}$ 表示底数作为因数出现 $${n}$ 次：`],
        [`${base}^{${n}} = ${factors}`],
      ],
      [["Multiply", "相乘"], powerSign(b, n), [`${factors} = ${show(r, kind)}`]],
    ],
    check,
    [
      [r.neg(), sEn, sZh],
      [
        b.mul(Q.of(n)),
        `That multiplies the base by $${n}$; the exponent counts how many times the base is a factor.`,
        `这是用底数乘 $${n}$；指数表示底数作为因数出现几次。`,
      ],
      ...(kind === "decimal"
        ? [
            [
              r.mul(Q.of(10)),
              `The decimal point is one place off: count the decimal places of all $${n}$ factors.`,
              `小数点错了一位：要把 $${n}$ 个因数的小数位数都数上。`,
            ] as const,
          ]
        : [
            [
              Q.of(b.n ** BigInt(n), b.d),
              "That raises only the numerator; raise the denominator too.",
              "这只把分子乘方了；分母也要乘方。",
            ] as const,
          ]),
    ],
    kindForm(kind),
  );
}

/** smallBase draws a base for a power: a fraction with a small denominator, or a decimal with one place. */
function smallBase(rng: Rng, kind: Kind, n: number): Q {
  const v =
    kind === "decimal" ? decQ(rng, 1, 1, n === 2 ? 30 : 15) : n === 2 ? properQ(rng, 12).add(Q.of(rng.bool(0.2) ? 1 : 0)) : properQ(rng, 6);
  return rng.bool(0.7) ? v.neg() : v;
}

/** squaringRationalNumbers squares negative numbers, fractions and decimals. */
export const squaringRationalNumbers = withIntro(
  topic(
    "squaring-rational-numbers",
    t("Squaring Rational Numbers", "有理数的平方"),
    t(
      "The square of a number is the number times itself, so the square of a negative number is positive: (−3/4)² = 9/16 and (−0.3)² = 0.09. Without parentheses, −0.3² means −(0.3²) = −0.09.",
      "一个数的平方是这个数乘它自己，所以负数的平方是正数：(−3/4)² = 9/16，(−0.3)² = 0.09。没有括号时，−0.3² 表示 −(0.3²) = −0.09。",
    ),
    ["evaluating-exponents-with-fractional-bases", "evaluating-exponents-with-decimal-bases", "multiplying-negative-numbers"],
    ["7.NS.A.2a", "7.NS.A.3"],
    [
      lesson(
        "squaring-negative-fractions",
        ["Fractions and integers", "分数与整数"],
        [
          [
            "Squaring a number means multiplying it by itself. A negative times a negative is positive, so a square is never negative. For a fraction, square the numerator and the denominator: $\\left(-\\frac{3}{4}\\right)^{2} = \\left(-\\frac{3}{4}\\right) \\times \\left(-\\frac{3}{4}\\right) = \\frac{9}{16}$.",
            "平方就是一个数乘它自己。负数乘负数得正数，所以平方永远不会是负数。分数的平方要把分子和分母都平方：$\\left(-\\frac{3}{4}\\right)^{2} = \\left(-\\frac{3}{4}\\right) \\times \\left(-\\frac{3}{4}\\right) = \\frac{9}{16}$。",
          ],
          ["Square the top and the bottom separately: $3^{2} = 9$ and $4^{2} = 16$.", "分子和分母分别平方：$3^{2} = 9$，$4^{2} = 16$。"],
          [
            "Square the denominator too: $\\left(\\frac{3}{4}\\right)^{2}$ is $\\frac{9}{16}$, not $\\frac{9}{4}$.",
            "分母也要平方：$\\left(\\frac{3}{4}\\right)^{2}$ 是 $\\frac{9}{16}$，不是 $\\frac{9}{4}$。",
          ],
        ],
        (rng) => {
          const b = rng.bool(0.25) ? Q.of(-rng.int(2, 20)) : smallBase(rng, "fraction", 2);
          return powerProblem(b, 2, "fraction");
        },
        tableFigure(["(-3)(-3)", "4 × 4"], [9, 16]),
      ),
      lesson(
        "squaring-decimals",
        ["Decimals", "小数"],
        [
          [
            "To square a decimal, multiply it by itself. The decimal places of the two factors add, so the square has twice as many decimal places as the number. $(-0.3)^{2} = (-0.3) \\times (-0.3) = 0.09$: tenths times tenths are hundredths.",
            "小数的平方就是它乘它自己。两个因数的小数位数要相加，所以平方的小数位数是原数的两倍。$(-0.3)^{2} = (-0.3) \\times (-0.3) = 0.09$：十分位乘十分位得百分位。",
          ],
          [
            "Leave out the point: $3^{2} = 9$, then give it $2$ decimal places: $0.09$.",
            "先不看小数点：$3^{2} = 9$，再点上 $2$ 位小数：$0.09$。",
          ],
          [
            "$(-0.3)^{2}$ is $0.09$, not $0.9$: count the decimal places of both factors.",
            "$(-0.3)^{2}$ 是 $0.09$，不是 $0.9$：两个因数的小数位数都要数。",
          ],
        ],
        (rng) => powerProblem(smallBase(rng, "decimal", 2), 2, "decimal"),
        tableFigure(["(-0.3)(-0.3)", "3 × 3"], [0.09, 9]),
      ),
      lesson(
        "the-opposite-of-a-square",
        ["$-a^{2}$ and $(-a)^{2}$", "$-a^{2}$ 与 $(-a)^{2}$"],
        [
          [
            "Look at what the exponent touches. In $\\left(-\\frac{2}{5}\\right)^{2}$ the parentheses hold the negative number, so all of it is squared: $\\frac{4}{25}$. In $-\\left(\\frac{2}{5}\\right)^{2}$ only $\\frac{2}{5}$ is squared and the minus sign comes after: $-\\frac{4}{25}$. Likewise $-6^{2} = -36$, but $(-6)^{2} = 36$.",
            "看清指数作用在谁身上。$\\left(-\\frac{2}{5}\\right)^{2}$ 的括号里是负数，整个负数被平方：$\\frac{4}{25}$。$-\\left(\\frac{2}{5}\\right)^{2}$ 中只有 $\\frac{2}{5}$ 被平方，负号最后再加：$-\\frac{4}{25}$。同样，$-6^{2} = -36$，而 $(-6)^{2} = 36$。",
          ],
          ["Read $-6^{2}$ as $-1 \\times 6^{2} = -1 \\times 36 = -36$.", "把 $-6^{2}$ 看成 $-1 \\times 6^{2} = -1 \\times 36 = -36$。"],
          [
            "Without parentheses the minus sign is not squared: $-6^{2}$ is $-36$, not $36$.",
            "没有括号时负号不参与平方：$-6^{2}$ 是 $-36$，不是 $36$。",
          ],
        ],
        (rng) => {
          const kind: Kind = rng.pick(["fraction", "decimal", "fraction"] as const);
          const a = kind === "decimal" ? decQ(rng, 1, 1, 30) : rng.bool(0.4) ? Q.of(rng.int(2, 15)) : properQ(rng, 10);
          const inside = rng.bool(0.35);
          const s = (q: Q) => show(q, kind);
          const negBase = powerBase(a.neg(), kind);
          const base = powerBase(a, kind);
          const expr = inside ? `${negBase}^{2}` : `-${base}^{2}`;
          const sq = a.pow(2);
          const r = inside ? sq : sq.neg();
          return valued(
            [`Evaluate $${expr}$.`, `计算 $${expr}$。`],
            r,
            inside
              ? [
                  [
                    ["What is squared", "谁被平方"],
                    ["The parentheses hold the negative number, so all of it is squared:", "括号里是负数，整个负数被平方："],
                    [`${expr} = ${negBase} \\times ${negBase}`],
                  ],
                  [
                    ["Multiply", "相乘"],
                    ["Two negative factors give a positive result:", "两个负因数相乘得正数："],
                    [`${negBase} \\times ${negBase} = ${s(sq)}`],
                  ],
                ]
              : [
                  [
                    ["What is squared", "谁被平方"],
                    [`The exponent belongs to $${s(a)}$ only; the minus sign waits:`, `指数只作用于 $${s(a)}$；负号最后再加：`],
                    [`${expr} = -\\left(${base} \\times ${base}\\right)`],
                  ],
                  [
                    ["Then the sign", "再加负号"],
                    ["Square, then take the opposite:", "先平方，再取相反数："],
                    [`-\\left(${s(sq)}\\right) = ${s(r)}`],
                  ],
                ],
            inside
              ? [
                  `A number and its opposite have the same square: $${base}^{2} = ${s(sq)}$ too.`,
                  `一个数和它的相反数平方相同：$${base}^{2}$ 也等于 $${s(sq)}$。`,
                ]
              : [
                  `Read it as $-1 \\times ${base}^{2} = -1 \\times ${s(sq)} = ${s(r)}$.`,
                  `把它看成 $-1 \\times ${base}^{2} = -1 \\times ${s(sq)} = ${s(r)}$。`,
                ],
            [
              inside
                ? [
                    r.neg(),
                    "The minus sign is inside the parentheses, so it is squared too and the result is positive.",
                    "负号在括号里，也被平方了，所以结果是正数。",
                  ]
                : [
                    r.neg(),
                    `That squares the minus sign too; without parentheses only $${s(a)}$ is squared.`,
                    `这是把负号也平方了；没有括号时只有 $${s(a)}$ 被平方。`,
                  ],
              [
                a.mul(Q.of(inside ? 2 : -2)),
                "That doubles instead of squaring; a square multiplies the number by itself.",
                "这是乘了 2，不是平方；平方是这个数乘它自己。",
              ],
            ],
            kindForm(kind),
          );
        },
        tableFigure(["-(6 × 6)", "(-6)(-6)"], [-36, 36]),
      ),
    ],
  ),
  ["Is $(-5)^{2}$ positive or negative?", "$(-5)^{2}$ 是正数还是负数？"],
  [
    "Positive: $(-5) \\times (-5) = 25$, two negative factors; and $5^{2} = 25$ as well.",
    "正数：$(-5) \\times (-5) = 25$，两个负因数相乘；而且 $5^{2}$ 也等于 $25$。",
  ],
  [
    "square negative numbers, fractions and decimals, and tell $-a^{2}$ from $(-a)^{2}$.",
    "求负数、分数和小数的平方，并分清 $-a^{2}$ 与 $(-a)^{2}$。",
  ],
);

/** cubingRationalNumbers cubes negative fractions and decimals. */
export const cubingRationalNumbers = withIntro(
  topic(
    "cubing-rational-numbers",
    t("Cubing Rational Numbers", "有理数的立方"),
    t(
      "The cube of a number is the number multiplied by itself three times. Three negative factors give a negative product, so the cube of a negative number is negative: (−2/3)³ = −8/27 and (−0.2)³ = −0.008.",
      "一个数的立方是三个这个数相乘。三个负因数的积为负，所以负数的立方是负数：(−2/3)³ = −8/27，(−0.2)³ = −0.008。",
    ),
    ["squaring-rational-numbers"],
    ["7.NS.A.2a", "7.NS.A.3"],
    [
      lesson(
        "cubing-fractions",
        ["Fractions and integers", "分数与整数"],
        [
          [
            "Cubing a number means using it as a factor three times. Three negative factors give a negative product, so the cube of a negative number stays negative. Cube both the numerator and the denominator: $\\left(-\\frac{2}{3}\\right)^{3} = \\left(-\\frac{2}{3}\\right) \\times \\left(-\\frac{2}{3}\\right) \\times \\left(-\\frac{2}{3}\\right) = -\\frac{8}{27}$.",
            "立方就是把一个数作为因数连乘三次。三个负因数相乘积为负，所以负数的立方仍是负数。分子和分母都要立方：$\\left(-\\frac{2}{3}\\right)^{3} = \\left(-\\frac{2}{3}\\right) \\times \\left(-\\frac{2}{3}\\right) \\times \\left(-\\frac{2}{3}\\right) = -\\frac{8}{27}$。",
          ],
          [
            "Cube the top and the bottom separately: $2^{3} = 8$ and $3^{3} = 27$, and three negatives make the sign negative.",
            "分子和分母分别立方：$2^{3} = 8$，$3^{3} = 27$；三个负数相乘，符号为负。",
          ],
          [
            "A cube of a negative number is negative, unlike a square: $(-2)^{3} = -8$.",
            "负数的立方是负数，这和平方不同：$(-2)^{3} = -8$。",
          ],
        ],
        (rng) => {
          const b = rng.bool(0.2) ? Q.of(-rng.int(2, 10)) : smallBase(rng, "fraction", 3);
          return powerProblem(b, 3, "fraction");
        },
        tableFigure(["(-2)(-2)(-2)", "3 × 3 × 3"], [-8, 27]),
      ),
      lesson(
        "cubing-decimals",
        ["Decimals", "小数"],
        [
          [
            "The cube of a decimal has three times as many decimal places as the number, because the places of the three factors add. Its sign is the sign of the number, since three negative factors give a negative result. $(-0.2)^{3} = -0.008$: tenths three times give thousandths.",
            "小数的立方的小数位数是原数的三倍，因为三个因数的小数位数要相加。它的符号与原数相同，因为三个负因数相乘结果为负。$(-0.2)^{3} = -0.008$：三个十分位相乘得千分位。",
          ],
          [
            "Leave out the point: $2^{3} = 8$, then give it $3$ decimal places and the sign: $-0.008$.",
            "先不看小数点：$2^{3} = 8$，再点上 $3$ 位小数，加上符号：$-0.008$。",
          ],
          [
            "$(-0.2)^{3}$ is $-0.008$, not $-0.08$: each of the three factors brings one decimal place.",
            "$(-0.2)^{3}$ 是 $-0.008$，不是 $-0.08$：三个因数各带一位小数。",
          ],
        ],
        (rng) => powerProblem(smallBase(rng, "decimal", 3), 3, "decimal"),
        tableFigure(["(-0.2)³", "2³"], [-0.008, 8]),
      ),
    ],
  ),
  ["Is $(-2)^{3}$ positive or negative?", "$(-2)^{3}$ 是正数还是负数？"],
  [
    "Negative: $(-2) \\times (-2) = 4$ and $4 \\times (-2) = -8$; three negative factors give a negative product.",
    "负数：$(-2) \\times (-2) = 4$，$4 \\times (-2) = -8$；三个负因数相乘积为负。",
  ],
  ["cube negative fractions and decimals and get the sign right.", "求负分数和负小数的立方，并定准符号。"],
);

/** exponentsWithRationalBases evaluates and compares higher powers of fractions and decimals. */
export const exponentsWithRationalBases = withIntro(
  topic(
    "exponents-with-rational-bases",
    t("Exponents With Rational Bases", "底数为有理数的乘方"),
    t(
      "Any positive integer power of a rational number is repeated multiplication: (−1/2)⁵ = −1/32. A negative base gives a positive power for an even exponent and a negative one for an odd exponent. Powers of a number between 0 and 1 get smaller as the exponent grows.",
      "有理数的正整数次幂就是重复相乘：(−1/2)⁵ = −1/32。底数为负时，偶数次幂为正，奇数次幂为负。0 与 1 之间的数，指数越大，幂越小。",
    ),
    ["cubing-rational-numbers"],
    ["7.NS.A.2a", "7.NS.A.3"],
    [
      lesson(
        "higher-powers-of-rational-numbers",
        ["Higher powers", "高次幂"],
        [
          [
            "A power with exponent $n$ uses the base as a factor $n$ times. With a negative base, an even exponent gives a positive result and an odd exponent a negative one. $\\left(-\\frac{1}{2}\\right)^{5} = -\\frac{1}{32}$, with five negative factors, and $(-0.1)^{4} = 0.0001$, with four.",
            "指数为 $n$ 的乘方是把底数作为因数连乘 $n$ 次。底数为负时，偶数次幂是正数，奇数次幂是负数。$\\left(-\\frac{1}{2}\\right)^{5} = -\\frac{1}{32}$，有五个负因数；$(-0.1)^{4} = 0.0001$，有四个。",
          ],
          [
            "Raise the top and the bottom separately: $1^{5} = 1$ and $2^{5} = 32$; five negative factors make it $-\\frac{1}{32}$.",
            "分子和分母分别乘方：$1^{5} = 1$，$2^{5} = 32$；五个负因数，结果是 $-\\frac{1}{32}$。",
          ],
          [
            "The exponent counts factors: $\\left(-\\frac{1}{2}\\right)^{5}$ is not $5 \\times \\left(-\\frac{1}{2}\\right)$.",
            "指数表示因数的个数：$\\left(-\\frac{1}{2}\\right)^{5}$ 不是 $5 \\times \\left(-\\frac{1}{2}\\right)$。",
          ],
        ],
        (rng) => {
          const n = rng.int(4, 6);
          const kind: Kind = rng.bool(0.7) ? "fraction" : "decimal";
          const bases =
            kind === "decimal"
              ? [Q.of(1, 10), Q.of(2, 10), Q.of(3, 10), Q.of(5, 10), Q.of(11, 10), Q.of(15, 10)]
              : [Q.of(1, 2), Q.of(1, 3), Q.of(2, 3), Q.of(3, 2), Q.of(1, 4), Q.of(3, 4), Q.of(2, 5), Q.of(1, 5), Q.of(5, 2), Q.of(1, 10)];
          const b0 = rng.pick(bases.filter((b) => n <= 5 || b.n < 3n));
          const b = rng.bool(0.7) ? b0.neg() : b0;
          return powerProblem(b, n, kind);
        },
        tableFigure(["(-1)⁵", "2⁵"], [-1, 32]),
      ),
      lesson(
        "comparing-powers-of-a-fraction",
        ["Comparing powers", "比较乘方的大小"],
        [
          [
            "To compare two powers of the same base, find both values and compare them. Multiplying a positive number by a number less than $1$ makes it smaller, so for a base between $0$ and $1$ the higher power is smaller: $\\left(\\frac{2}{3}\\right)^{2} = \\frac{4}{9} = \\frac{12}{27}$ is greater than $\\left(\\frac{2}{3}\\right)^{3} = \\frac{8}{27}$. With a negative base, compare the signs first.",
            "比较同一个底数的两个乘方，先求出两个值再比较。正数乘一个小于 $1$ 的数会变小，所以底数在 $0$ 和 $1$ 之间时，指数越高，幂越小：$\\left(\\frac{2}{3}\\right)^{2} = \\frac{4}{9} = \\frac{12}{27}$，大于 $\\left(\\frac{2}{3}\\right)^{3} = \\frac{8}{27}$。底数为负时，先比较符号。",
          ],
          [
            "One more factor of $\\frac{2}{3}$ takes away a third: $\\frac{4}{9} \\times \\frac{2}{3} = \\frac{8}{27}$, so the cube is smaller.",
            "再乘一个 $\\frac{2}{3}$ 就少了三分之一：$\\frac{4}{9} \\times \\frac{2}{3} = \\frac{8}{27}$，所以立方更小。",
          ],
          [
            "A higher exponent does not always mean a greater value: for a base below $1$ it is smaller.",
            "指数更高不一定值更大：底数小于 $1$ 时反而更小。",
          ],
        ],
        (rng) => {
          const b0 = rng.pick([Q.of(1, 2), Q.of(2, 3), Q.of(3, 4), Q.of(1, 3), Q.of(3, 5), Q.of(4, 5), Q.of(3, 2), Q.of(5, 4), Q.of(4, 3)]);
          const b = rng.bool(0.4) ? b0.neg() : b0;
          const m = rng.int(2, 3);
          const n = m + rng.int(1, 2);
          const [x, y] = [b.pow(m), b.pow(n)];
          const swap = rng.bool();
          const [l, r, ln, rn] = swap ? [y, x, n, m] : [x, y, m, n];
          const base = powerBase(b, "fraction");
          const rel = l.cmp(r) + 1;
          const sym = ["<", "=", ">"][rel]!;
          const den = (l.d * r.d) / BigInt(gcd(Number(l.d), Number(r.d)));
          const over = (q: Q) => `${q.sign() < 0 ? "-" : ""}\\frac{${(q.abs().n * den) / q.d}}{${den}}`;
          const small = b.abs().cmp(Q.one) < 0;
          const higher = rn > ln ? "right" : "left";
          const higherZh = rn > ln ? "右边" : "左边";
          let check: Pair;
          if (b.sign() < 0 && ln % 2 !== rn % 2) {
            check = [
              "Look at the signs: the power with an odd exponent is negative and the one with an even exponent is positive.",
              "看符号：奇数次幂是负数，偶数次幂是正数。",
            ];
          } else if (b.sign() < 0 && ln % 2 === 1) {
            check = small
              ? [
                  `Both are negative, and the ${higher} power has the smaller size, so it is closer to zero and greater.`,
                  `两个都是负数，${higherZh}的幂绝对值更小，离零更近，所以更大。`,
                ]
              : [
                  `Both are negative, and the ${higher} power has the larger size, so it is further below zero and smaller.`,
                  `两个都是负数，${higherZh}的幂绝对值更大，离零更远，所以更小。`,
                ];
          } else {
            check = small
              ? [
                  `Both are positive, and each extra factor is less than $1$, so the ${higher} power is smaller.`,
                  `两个都是正数，每多一个因数都小于 $1$，所以${higherZh}的幂更小。`,
                ]
              : [
                  `Both are positive, and each extra factor is greater than $1$, so the ${higher} power is greater.`,
                  `两个都是正数，每多一个因数都大于 $1$，所以${higherZh}的幂更大。`,
                ];
          }
          return compared(
            `${base}^{${ln}}`,
            `${base}^{${rn}}`,
            rel,
            [
              [
                ["Each power", "求出每个乘方"],
                ["Multiply out both powers:", "把两个乘方都算出来："],
                [`${base}^{${ln}} = ${l.toLatex()}`, `${base}^{${rn}} = ${r.toLatex()}`],
              ],
              [["Compare", "比较"], ["Write both over the same denominator:", "化成同分母再比较："], [`${over(l)} ${sym} ${over(r)}`]],
            ],
            check,
            [
              ["The left value is greater, not smaller.", "左边的值更大，不是更小。"],
              ["The two powers have different values.", "这两个乘方的值不相等。"],
              ["The left value is smaller, not greater.", "左边的值更小，不是更大。"],
            ],
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 1,
            step: 0.25,
            labels: [0, 1],
            marks: [
              { at: 8 / 27, text: "8/27" },
              { at: 4 / 9, text: "4/9", result: true },
            ],
          },
          ["A number line from 0 to 1 with 8/27 to the left of 4/9.", "从 0 到 1 的数轴，8/27 在 4/9 的左边。"],
        ),
      ),
    ],
  ),
  [
    "Which is greater, $\\left(\\frac{1}{2}\\right)^{2}$ or $\\left(\\frac{1}{2}\\right)^{3}$?",
    "$\\left(\\frac{1}{2}\\right)^{2}$ 和 $\\left(\\frac{1}{2}\\right)^{3}$ 哪个大？",
  ],
  [
    "$\\left(\\frac{1}{2}\\right)^{2} = \\frac{1}{4}$ and $\\left(\\frac{1}{2}\\right)^{3} = \\frac{1}{8}$, so the square is greater; one more factor of $\\frac{1}{2}$ halves it.",
    "$\\left(\\frac{1}{2}\\right)^{2} = \\frac{1}{4}$，$\\left(\\frac{1}{2}\\right)^{3} = \\frac{1}{8}$，所以平方更大；再乘一个 $\\frac{1}{2}$ 就减半了。",
  ],
  ["evaluate and compare higher powers of fractions and decimals.", "计算并比较分数和小数的高次幂。"],
);

/** evaluatingExpressionsWithPositiveIntegerExponents applies the order of operations with powers of signed numbers. */
export const evaluatingExpressionsWithPositiveIntegerExponents = withIntro(
  topic(
    "evaluating-expressions-with-positive-integer-exponents",
    t("Evaluating Expressions With Positive Integer Exponents", "计算含正整数指数的式子"),
    t(
      "Exponents come right after parentheses in the order of operations, before multiplication and division: (−2)³ + 4 × 3² = −8 + 4 × 9 = 28. Remember that −3² = −9 while (−3)² = 9.",
      "在运算顺序中，乘方紧跟在括号之后，先于乘除：(−2)³ + 4 × 3² = −8 + 4 × 9 = 28。注意 −3² = −9，而 (−3)² = 9。",
    ),
    [
      "exponents-with-rational-bases",
      "evaluating-rational-number-expressions-without-exponents",
      "evaluating-whole-number-expressions-containing-exponents",
    ],
    ["7.NS.A.3", "7.EE.B.3"],
    [
      lesson(
        "integer-expressions-with-exponents",
        ["Integers", "整数"],
        [
          [
            "In the order of operations, powers come right after parentheses and before multiplication and division. Work out every power first, watching whether the minus sign is inside the parentheses, then multiply and divide, then add and subtract. $(-2)^{3} + 4 \\times 3^{2} = -8 + 4 \\times 9 = -8 + 36 = 28$.",
            "在运算顺序中，乘方紧跟在括号之后，先于乘除。先算出每个乘方，注意负号是否在括号里面，再算乘除，最后算加减。$(-2)^{3} + 4 \\times 3^{2} = -8 + 4 \\times 9 = -8 + 36 = 28$。",
          ],
          [
            "Write the powers as factors: $(-2) \\times (-2) \\times (-2) = -8$ and $4 \\times 3 \\times 3 = 36$; together $28$.",
            "把乘方写成因数相乘：$(-2) \\times (-2) \\times (-2) = -8$，$4 \\times 3 \\times 3 = 36$；合起来是 $28$。",
          ],
          [
            "Do the power before the multiplication: $4 \\times 3^{2}$ is $36$, not $12^{2} = 144$.",
            "先算乘方再算乘法：$4 \\times 3^{2}$ 是 $36$，不是 $12^{2} = 144$。",
          ],
        ],
        (rng) => {
          const a = rng.int(2, 5);
          const n = a <= 3 ? rng.int(2, 3) : 2;
          const b = rng.nonZero(-6, 6);
          const c = rng.int(2, 5);
          const d = rng.nonZero(-9, 9);
          const pa = Q.of(-a).pow(n);
          const pq = (v: number) => par(Q.of(v), "fraction");
          const shape = rng.int(0, 2);
          if (shape === 0) {
            const bcc = b * c * c;
            const v = pa.add(Q.of(bcc));
            const factors = Array.from({ length: n }, () => `(-${a})`).join(" \\times ");
            const [sEn, sZh] = signSlip(Q.of(-a), n);
            return valued(
              [`Evaluate $(-${a})^{${n}} + ${pq(b)} \\times ${c}^{2}$.`, `计算 $(-${a})^{${n}} + ${pq(b)} \\times ${c}^{2}$。`],
              v,
              [
                [
                  ["Powers first", "先算乘方"],
                  ["Work out each power:", "算出每个乘方："],
                  [`(-${a})^{${n}} = ${pa.toLatex()}`, `${c}^{2} = ${c * c}`],
                ],
                [
                  ["Multiply, then add", "先乘后加"],
                  ["Multiply before adding:", "先算乘法，再算加法："],
                  [`${pq(b)} \\times ${c * c} = ${bcc}`, `${pa.toLatex()} + ${pq(bcc)} = ${v.toLatex()}`],
                ],
              ],
              [
                `Write the powers as factors: $${factors} = ${pa.toLatex()}$ and $${pq(b)} \\times ${c} \\times ${c} = ${bcc}$; together $${v.toLatex()}$.`,
                `把乘方写成因数相乘：$${factors} = ${pa.toLatex()}$，$${pq(b)} \\times ${c} \\times ${c} = ${bcc}$；合起来是 $${v.toLatex()}$。`,
              ],
              [
                [pa.neg().add(Q.of(bcc)), `The sign of $(-${a})^{${n}}$ is wrong. ${sEn}`, `$(-${a})^{${n}}$ 的符号错了。${sZh}`],
                [
                  pa.add(Q.of(b * c)).mul(Q.of(c)),
                  "That works from left to right; do the power and the multiplication before adding.",
                  "这是从左往右算的；要先算乘方和乘法，再算加法。",
                ],
                [pa.add(Q.of(b * c * 2)), `That doubles $${c}$ instead of squaring it.`, `这是把 $${c}$ 乘了 2，不是平方。`],
              ],
            );
          }
          if (shape === 1) {
            const v = d - a * a;
            return valued(
              [`Evaluate $-${a}^{2} + ${pq(d)}$.`, `计算 $-${a}^{2} + ${pq(d)}$。`],
              v,
              [
                [
                  ["The power first", "先算乘方"],
                  [`The exponent belongs to $${a}$ only:`, `指数只作用于 $${a}$：`],
                  [`-${a}^{2} = -(${a} \\times ${a}) = -${a * a}`],
                ],
                [["Then add", "再算加法"], [`Add $${d}$:`, `加上 $${d}$：`], [`-${a * a} + ${pq(d)} = ${v}`]],
              ],
              [
                `Undo the addition: $${v} - ${pq(d)} = -${a * a}$, which is $-${a}^{2}$.`,
                `撤销加法：$${v} - ${pq(d)} = -${a * a}$，正是 $-${a}^{2}$。`,
              ],
              [
                [
                  a * a + d,
                  `That squares the minus sign too; without parentheses only $${a}$ is squared.`,
                  `这是把负号也平方了；没有括号时只有 $${a}$ 被平方。`,
                ],
                [-2 * a + d, `That doubles $${a}$ instead of squaring it.`, `这是把 $${a}$ 乘了 2，不是平方。`],
              ],
            );
          }
          const e = d - b;
          const cee = c * e * e;
          const v = a - cee;
          return valued(
            [`Evaluate $${a} - ${c}(${d} - ${pq(b)})^{2}$.`, `计算 $${a} - ${c}(${d} - ${pq(b)})^{2}$。`],
            v,
            [
              [["Parentheses first", "先算括号"], ["Work inside the parentheses:", "先算括号里面的："], [`${d} - ${pq(b)} = ${e}`]],
              [["Then the power", "再算乘方"], ["Square the result:", "把结果平方："], [`${pq(e)}^{2} = ${e * e}`]],
              [
                ["Multiply, then subtract", "先乘后减"],
                ["Multiply before subtracting:", "先算乘法，再算减法："],
                [`${c} \\times ${e * e} = ${cee}`, `${a} - ${cee} = ${v}`],
              ],
            ],
            [`Add back: $${v} + ${cee} = ${a}$, the first number.`, `加回去：$${v} + ${cee} = ${a}$，正是第一个数。`],
            [
              [(a - c) * e * e, `That subtracts before multiplying; multiply by $${c}$ first.`, `这是先做了减法；要先乘 $${c}$。`],
              [
                a - (c * e) ** 2,
                `That squares $${c}$ too; the exponent belongs to the parentheses only.`,
                `这是把 $${c}$ 也平方了；指数只作用于括号。`,
              ],
              [a + cee, "That adds the product; it is subtracted.", "这是加上了积；应该减去它。"],
            ],
          );
        },
        tableFigure(["(-2)³", "4 × 3²"], [-8, 36]),
      ),
      lesson(
        "rational-expressions-with-exponents",
        ["Fractions and decimals", "分数与小数"],
        [
          [
            "Fractions and decimals follow the same order: powers first, then multiplication and division, then addition and subtraction. A negative base raised to an even power is positive. $\\left(-\\frac{1}{2}\\right)^{2} - \\frac{3}{4} = \\frac{1}{4} - \\frac{3}{4} = -\\frac{1}{2}$, and $(-0.5)^{3} \\times 8 = -0.125 \\times 8 = -1$.",
            "分数和小数的运算顺序相同：先乘方，再乘除，最后加减。负数的偶次幂是正数。$\\left(-\\frac{1}{2}\\right)^{2} - \\frac{3}{4} = \\frac{1}{4} - \\frac{3}{4} = -\\frac{1}{2}$；$(-0.5)^{3} \\times 8 = -0.125 \\times 8 = -1$。",
          ],
          [
            "Add back: $-\\frac{1}{2} + \\frac{3}{4} = \\frac{1}{4}$, the value of the power.",
            "加回去：$-\\frac{1}{2} + \\frac{3}{4} = \\frac{1}{4}$，正是乘方的值。",
          ],
          [
            "Raise only the base, then multiply: $(-0.5)^{3} \\times 8$ is not $(-0.5 \\times 8)^{3}$.",
            "只把底数乘方，再相乘：$(-0.5)^{3} \\times 8$ 不是 $(-0.5 \\times 8)^{3}$。",
          ],
        ],
        (rng) => {
          const kind: Kind = rng.bool() ? "fraction" : "decimal";
          const b0 =
            kind === "decimal" ? rng.pick([Q.of(1, 2), Q.of(1, 5), Q.of(3, 10), Q.of(1, 10), Q.of(3, 2), Q.of(2, 5)]) : properQ(rng, 6);
          const b = rng.bool(0.7) ? b0.neg() : b0;
          const n = rng.int(2, 3);
          const p = b.pow(n);
          const s = (q: Q) => show(q, kind);
          const base = powerBase(b, kind);
          const factors = Array.from({ length: n }, () => base).join(" \\times ");
          const [sEn, sZh] = signSlip(b, n);
          const power: Walk = [["The power first", "先算乘方"], powerSign(b, n), [`${base}^{${n}} = ${factors} = ${s(p)}`]];
          const timesN: [string, string] = [
            `That multiplies the base by $${n}$ instead of raising it to the power $${n}$.`,
            `这是用底数乘 $${n}$，不是求 $${n}$ 次方。`,
          ];
          if (rng.bool()) {
            const c = kind === "decimal" ? decQ(rng, 1, 1, 30) : properQ(rng, 8);
            const v = p.sub(c);
            return valued(
              [`Evaluate $${base}^{${n}} - ${s(c)}$.`, `计算 $${base}^{${n}} - ${s(c)}$。`],
              v,
              [power, [["Then subtract", "再算减法"], [`Subtract $${s(c)}$:`, `减去 $${s(c)}$：`], [`${s(p)} - ${s(c)} = ${s(v)}`]]],
              [`Add back: $${s(v)} + ${s(c)} = ${s(p)}$, the value of the power.`, `加回去：$${s(v)} + ${s(c)} = ${s(p)}$，正是乘方的值。`],
              [
                [p.neg().sub(c), sEn, sZh],
                [b.mul(Q.of(n)).sub(c), ...timesN],
                [
                  c.sub(p),
                  "That subtracts the other way round; take the second number from the power.",
                  "这是减反了；应该用乘方的值减去后面的数。",
                ],
              ],
              kindForm(kind),
            );
          }
          const m = kind === "decimal" ? Q.of(rng.pick([2, 4, 5, 8, 10, 20])) : Q.of(Number(b.d) ** n).mul(Q.of(rng.int(1, 3)));
          const v = p.mul(m);
          return valued(
            [`Evaluate $${base}^{${n}} \\times ${s(m)}$.`, `计算 $${base}^{${n}} \\times ${s(m)}$。`],
            v,
            [
              power,
              [["Then multiply", "再算乘法"], [`Multiply by $${s(m)}$:`, `乘 $${s(m)}$：`], [`${par(p, kind)} \\times ${s(m)} = ${s(v)}`]],
            ],
            [
              `Divide back: $${s(v)} \\div ${s(m)} = ${s(p)}$, the value of the power.`,
              `除回去：$${s(v)} \\div ${s(m)} = ${s(p)}$，正是乘方的值。`,
            ],
            [
              [v.neg(), sEn, sZh],
              [
                b.mul(m).pow(n),
                "That raises the product to the power; raise only the base, then multiply.",
                "这是把乘积乘方了；应该只把底数乘方，再相乘。",
              ],
              [b.mul(Q.of(n)).mul(m), ...timesN],
            ],
            kindForm(kind),
          );
        },
        tableFigure(["(-1/2)²", "1/4-3/4"], [0.25, -0.5]),
      ),
    ],
  ),
  ["What is $-3^{2} + (-3)^{2}$?", "$-3^{2} + (-3)^{2}$ 等于多少？"],
  [
    "$-3^{2} = -9$ and $(-3)^{2} = 9$, so the sum is $0$: the two are opposites.",
    "$-3^{2} = -9$，$(-3)^{2} = 9$，所以和是 $0$：它们互为相反数。",
  ],
  ["evaluate expressions with powers of signed numbers in the right order.", "按正确的顺序计算含带符号数乘方的式子。"],
);

/** grade7NumberSystemTopics lists the 7th grade topics on operations with rational numbers and exponents. */
export const grade7NumberSystemTopics: readonly TopicDef[] = [
  subtractingAPositiveNumberFromASmallerPositiveNumber,
  subtractingAPositiveNumberFromANegativeNumber,
  subtractingAPositiveFractionFromASmallerFraction,
  subtractingAPositiveDecimalFromASmallerDecimal,
  addingAPositiveNumberToANegativeNumber,
  addingANegativeNumber,
  subtractingANegativeNumber,
  additiveInversesOfNumbers,
  interpretingAdditiveOppositesAndAdditionUsingAbsoluteValue,
  solvingProblemsUsingAdditionAndSubtractionOfRationalNumbers,
  multiplyingPositiveNumbersWithNegativeNumbers,
  multiplyingNegativeNumbers,
  dividingWithNegativeNumbers,
  equivalentFractionsWithNegativeNumbers,
  dividingWithNegativeDecimalsAndFractions,
  reciprocalsOfRationalNumbers,
  multiplyingAndDividingWithZero,
  fractionsOfFractions,
  interpretingProductsAndQuotientsOfRationalNumbers,
  evaluatingRationalNumberExpressionsWithoutExponents,
  solvingProblemsUsingMultiplicationAndDivisionOfRationalNumbers,
  solvingProblemsUsingTheFourOperationsOnRationalNumbers,
  solvingMultistepProblemsWithRationalNumbers,
  rationalNumbersAsFiniteOrRepeatingDecimals,
  squaringRationalNumbers,
  cubingRationalNumbers,
  exponentsWithRationalBases,
  evaluatingExpressionsWithPositiveIntegerExponents,
];
