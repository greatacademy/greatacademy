import type { Difficulty, Figure, Problem, Rng, TopicDef } from "@ga/content";
import { t, tierRange } from "@ga/content";
import { num, paren } from "@ga/subject-math";
import { remainingDrawings4 } from "../explanation-drawings-remaining-4.ts";
import { numberProblem } from "../problems.ts";
import { compared, type Pair, tableFigure, type Walk, walkThrough } from "./early-grades-more-kit.ts";
import { chosen, drawn, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { answered, lineFigure, point } from "./upper-grades-kit.ts";

const abs = Math.abs;

/** intLine draws a number line of integers from lo to hi with 0 and the marked points labeled, and jumps as arcs. */
const intLine = (lo: number, hi: number, marks: readonly number[], jumps: readonly (readonly [number, number])[] = []): Figure =>
  lineFigure(
    {
      lo,
      hi,
      step: 1,
      labels: [...new Set([lo, 0, hi, ...marks])].filter((v) => v >= lo && v <= hi),
      label: (v) => (v < 0 ? `−${-v}` : String(v)),
      marks: marks.map((at) => ({ at })),
      jumps,
    },
    [
      `A number line from ${lo} to ${hi}${marks.length ? ` with ${marks.join(" and ")} marked` : ""}.`,
      `一条从 ${lo} 到 ${hi} 的数轴${marks.length ? `，标出了 ${marks.join(" 和 ")}` : ""}。`,
    ],
  );

/** signedAnswer asks for an integer that may be negative, works it in labelled steps with a check, and says why each listed wrong value is wrong. */
const signedAnswer = (
  prompt: Pair,
  answer: number,
  walk: readonly Walk[],
  check: Pair,
  misses: readonly (readonly [number, string, string])[],
  figure: Figure,
) => ({
  ...numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    form: "integer",
    mistakes: misses
      .filter(([v], i) => v !== answer && misses.findIndex(([w]) => w === v) === i)
      .map(([value, en, zh]) => ({ value, why: t(en, zh) })),
    solution: walkThrough(walk, check),
  }),
  figure,
});

export const integersAndOpposites: TopicDef = {
  id: "integers-and-opposites",
  title: t("Integers and Opposites", "整数与相反数"),
  summary: t("Place integers on the number line, find opposites, and compare integers.", "在数轴上表示整数，求相反数，比较整数大小。"),
  prerequisites: [],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.6.NS.C.5", "CCSS.6.NS.C.6", "CCSS.6.NS.C.7"],
  knowledgePoints: [
    point(
      "opposites",
      ["Opposites", "相反数"],
      [
        "The opposite of 7 is $-7$: both are 7 steps from 0, on different sides. The opposite of $-3$ is 3, so $-(-3) = 3$.\n\nCheck: on a number line, $-3$ and 3 are each 3 steps from 0.\n\n> **Watch out.** The opposite of a negative number is positive. The opposite of $-3$ is not $-3$.",
        "7 的相反数是 $-7$：它们离 0 都是 7 格，在 0 的两边。$-3$ 的相反数是 3，所以 $-(-3) = 3$。\n\n检验：在数轴上，$-3$ 和 3 离 0 都是 3 格。\n\n> **注意。** 负数的相反数是正数。$-3$ 的相反数不是 $-3$。",
      ],
      (rng) => {
        const a = rng.nonZero(-12, 12);
        const n = abs(a) + 2;
        if (rng.bool()) {
          return signedAnswer(
            [`What is the opposite of $${num(a)}$?`, `$${num(a)}$ 的相反数是多少？`],
            -a,
            [
              [
                ["Find the distance", "找距离"],
                [`$${num(a)}$ is ${abs(a)} steps from 0.`, `$${num(a)}$ 离 0 有 ${abs(a)} 格。`],
              ],
              [
                ["Go to the other side", "到另一边"],
                [`Go ${abs(a)} steps from 0 the other way.`, `从 0 往另一边走 ${abs(a)} 格。`],
                [`-(${num(a)}) = ${num(-a)}`],
              ],
            ],
            [`Both $${num(a)}$ and $${num(-a)}$ are ${abs(a)} steps from 0.`, `$${num(a)}$ 和 $${num(-a)}$ 离 0 都是 ${abs(a)} 格。`],
            [
              [a, "That is the same number. Its opposite is on the other side of 0.", "这还是原来的数。相反数在 0 的另一边。"],
              [0, "0 is the middle point, not the opposite.", "0 是中间的点，不是相反数。"],
              [-a + Math.sign(-a), "That is one step too far from 0.", "这离 0 多走了一格。"],
            ],
            intLine(-n, n, [a, -a]),
          );
        }
        const b = abs(a);
        return signedAnswer(
          [`Find $-(-${b})$.`, `计算 $-(-${b})$。`],
          b,
          [
            [
              ["Read it", "读懂算式"],
              [`$-(-${b})$ means the opposite of $-${b}$.`, `$-(-${b})$ 表示 $-${b}$ 的相反数。`],
            ],
            [
              ["Go to the other side", "到另一边"],
              [
                `$-${b}$ is ${b} steps left of 0, so its opposite is ${b} steps right.`,
                `$-${b}$ 在 0 左边 ${b} 格，它的相反数在 0 右边 ${b} 格。`,
              ],
              [`-(-${b}) = ${b}`],
            ],
          ],
          [`Both $-${b}$ and ${b} are ${b} steps from 0, on opposite sides.`, `$-${b}$ 和 ${b} 离 0 都是 ${b} 格，在 0 的两边。`],
          [
            [-b, "That keeps the minus sign. The opposite of a negative number is positive.", "这里保留了负号。负数的相反数是正数。"],
            [0, "That cancels the numbers out. The answer is a point, not 0.", "这是把两个数抵消成 0 了。结果是另一个点，不是 0。"],
            [b + 1, "That is one step too far from 0.", "这离 0 多走了一格。"],
          ],
          intLine(-b - 2, b + 2, [-b, b]),
        );
      },
      intLine(-5, 5, [-3, 3]),
    ),
    point(
      "comparing-integers",
      ["Comparing integers", "比较整数大小"],
      [
        "$-2 > -7$, because $-2$ is to the right of $-7$ on the number line.\n\nCheck: start at $-7$ and count up 5 steps to reach $-2$.\n\n> **Watch out.** For negative numbers, the one closer to 0 is greater. $-7$ is less than $-2$, even though 7 is more than 2.",
        "$-2 > -7$，因为在数轴上 $-2$ 在 $-7$ 的右边。\n\n检验：从 $-7$ 往右数 5 格就到 $-2$。\n\n> **注意。** 两个负数比较，离 0 近的那个大。$-7$ 比 $-2$ 小，尽管 7 比 2 大。",
      ],
      (rng) => {
        const a = rng.int(-12, 12);
        const b = rng.bool(0.1) ? a : rng.bool(0.6) ? -rng.int(1, 12) : rng.int(-12, 12);
        const rel = a < b ? 0 : a === b ? 1 : 2;
        const [lo, hi] = [Math.min(a, b), Math.max(a, b)];
        const bothNegative = a < 0 && b < 0;
        const left: Pair =
          bothNegative && a > b
            ? [
                `$${num(a)}$ is closer to 0 than $${num(b)}$, so it is not less, even though ${abs(a)} is less than ${abs(b)}.`,
                `$${num(a)}$ 比 $${num(b)}$ 离 0 近，所以它不小，尽管 ${abs(a)} 比 ${abs(b)} 小。`,
              ]
            : [`$${num(a)}$ is not to the left of $${num(b)}$.`, `$${num(a)}$ 不在 $${num(b)}$ 的左边。`];
        const right: Pair =
          bothNegative && a < b
            ? [
                `$${num(a)}$ is farther left than $${num(b)}$, so it is less, even though ${abs(a)} is more than ${abs(b)}.`,
                `$${num(a)}$ 在 $${num(b)}$ 的左边更远处，所以它更小，尽管 ${abs(a)} 比 ${abs(b)} 大。`,
              ]
            : [`$${num(a)}$ is not to the right of $${num(b)}$.`, `$${num(a)}$ 不在 $${num(b)}$ 的右边。`];
        return compared(
          num(a),
          num(b),
          rel,
          [
            [
              ["Find both points", "找到两个点"],
              [`Find $${num(a)}$ and $${num(b)}$ on the number line.`, `在数轴上找到 $${num(a)}$ 和 $${num(b)}$。`],
            ],
            [
              ["Compare", "比较"],
              a === b
                ? ["They are the same point.", "它们是同一个点。"]
                : [`$${num(lo)}$ is to the left, so it is less.`, `$${num(lo)}$ 在左边，所以它小。`],
            ],
          ],
          a === b
            ? ["The two numbers are written the same way.", "两个数写法完全一样。"]
            : [
                `Start at $${num(lo)}$ and count up ${hi - lo} steps to reach $${num(hi)}$.`,
                `从 $${num(lo)}$ 往右数 ${hi - lo} 格就到 $${num(hi)}$。`,
              ],
          [left, ["The two numbers are at different points.", "两个数在不同的点上。"], right],
          intLine(-13, 13, a === b ? [a] : [a, b]),
        );
      },
      intLine(-8, 2, [-7, -2], [[-7, -2]]),
    ),
  ],
  intro: t(
    "On a cold morning it is $-5$ degrees. At noon it is 5 degrees. $-5$ and 5 are the same distance from 0, on opposite sides, so they are opposites.\n\nCheck: on a number line, both are 5 steps from 0.\n\nIn this lesson we put integers on a number line, find opposites and compare integers.",
    "一个寒冷的早上气温是 $-5$ 度，中午是 5 度。$-5$ 和 5 到 0 的距离相同，分别在 0 的两边，所以它们互为相反数。\n\n检验：在数轴上，它们离 0 都是 5 格。\n\n本课我们在数轴上表示整数，求相反数，并比较整数的大小。",
  ),
};

export const absoluteValue: TopicDef = {
  id: "absolute-value",
  title: t("Absolute Value", "绝对值"),
  summary: t("Find the distance of an integer from zero.", "求整数到零的距离。"),
  prerequisites: ["integers-and-opposites"],
  encompasses: [{ topic: "integers-and-opposites", weight: 0.3 }],
  xp: 8,
  standards: ["CCSS.6.NS.C.7.C"],
  knowledgePoints: [
    point(
      "evaluating-absolute-values",
      ["Evaluating absolute values", "求绝对值"],
      [
        "$|-8| = 8$, because $-8$ is 8 steps from 0.\n\nCheck: 8 is also 8 steps from 0, so $|8| = 8$ too.\n\n> **Watch out.** A distance is never negative. $|-8|$ is not $-8$.",
        "$|-8| = 8$，因为 $-8$ 离 0 有 8 格。\n\n检验：8 离 0 也是 8 格，所以 $|8| = 8$。\n\n> **注意。** 距离不会是负数。$|-8|$ 不等于 $-8$。",
      ],
      (rng) => {
        const a = rng.bool(0.75) ? -rng.int(1, 15) : rng.int(1, 15);
        return signedAnswer(
          [`Find $|${num(a)}|$.`, `计算 $|${num(a)}|$。`],
          abs(a),
          [
            [
              ["Find the point", "找到这个点"],
              [`$${num(a)}$ is ${a < 0 ? "left" : "right"} of 0.`, `$${num(a)}$ 在 0 的${a < 0 ? "左" : "右"}边。`],
            ],
            [
              ["Count the steps to 0", "数到 0 的格数"],
              [`It is ${abs(a)} steps from 0.`, `它离 0 有 ${abs(a)} 格。`],
              [`|${num(a)}| = ${abs(a)}`],
            ],
          ],
          [
            `Its opposite $${num(-a)}$ is just as far from 0, and $|${num(-a)}| = ${abs(a)}$ too.`,
            `它的相反数 $${num(-a)}$ 离 0 一样远，$|${num(-a)}|$ 也等于 ${abs(a)}。`,
          ],
          [
            [-abs(a), "That keeps a minus sign. A distance is never negative.", "这里带了负号。距离不会是负数。"],
            [abs(a) - 1, "That is one step short.", "这里少数了一格。"],
            [abs(a) + 1, "That counts 0 as a step too.", "这里把 0 也多数了一格。"],
          ],
          intLine(-16, 16, [a], [[0, a]]),
        );
      },
      intLine(-10, 10, [-8], [[0, -8]]),
    ),
    point(
      "expressions-with-absolute-values",
      ["Expressions with absolute values", "含绝对值的式子"],
      [
        "$|-4| + |3| = 4 + 3 = 7$. Find each absolute value first, then add.\n\nCheck: $-4$ is 4 steps from 0 and 3 is 3 steps from 0, which makes 7 steps in all.\n\n> **Watch out.** Find the absolute values before you add. $-4 + 3 = -1$ is a different question.",
        "$|-4| + |3| = 4 + 3 = 7$。先求出每个绝对值，再相加。\n\n检验：$-4$ 离 0 有 4 格，3 离 0 有 3 格，一共 7 格。\n\n> **注意。** 先求绝对值，再相加。$-4 + 3 = -1$ 是另一个问题。",
      ],
      (rng) => {
        const a = rng.nonZero(-12, 12);
        const b = rng.nonZero(-12, 12);
        const [x, y] = [abs(a), abs(b)];
        const find: Walk = [
          ["Find each absolute value", "先求绝对值"],
          ["Count each number's steps from 0.", "数一数每个数离 0 有几格。"],
          [`|${num(a)}| = ${x}`, `|${num(b)}| = ${y}`],
        ];
        switch (rng.int(0, 2)) {
          case 0:
            return signedAnswer(
              [`Find $-|${num(a)}|$.`, `计算 $-|${num(a)}|$。`],
              -x,
              [
                [
                  ["Find the absolute value", "先求绝对值"],
                  [`$${num(a)}$ is ${x} steps from 0.`, `$${num(a)}$ 离 0 有 ${x} 格。`],
                  [`|${num(a)}| = ${x}`],
                ],
                [
                  ["Take the opposite", "取相反数"],
                  ["The minus sign outside the bars comes last.", "绝对值外面的负号最后再算。"],
                  [`-|${num(a)}| = ${num(-x)}`],
                ],
              ],
              [
                `On the number line, $${num(-x)}$ is ${x} steps left of 0, the opposite of ${x}.`,
                `在数轴上，$${num(-x)}$ 在 0 左边 ${x} 格，是 ${x} 的相反数。`,
              ],
              [
                [x, "That forgets the minus sign outside the bars.", "这里忘了绝对值外面的负号。"],
                [0, "That cancels the signs. The answer is a point, not 0.", "这是把符号抵消成 0 了。结果是另一个点，不是 0。"],
                [-x - 1, "That is one step too far from 0.", "这离 0 多走了一格。"],
              ],
              intLine(-13, 13, [a, -x]),
            );
          case 1:
            return signedAnswer(
              [`Find $|${num(a)}| + |${num(b)}|$.`, `计算 $|${num(a)}| + |${num(b)}|$。`],
              x + y,
              [find, [["Add", "相加"], ["Add the two distances.", "把两个距离相加。"], [`${x} + ${y} = ${x + y}`]]],
              [`Add in the other order: $${y} + ${x} = ${x + y}$.`, `换个顺序相加：$${y} + ${x} = ${x + y}$。`],
              [
                [a + b, "That adds the numbers before finding the absolute values.", "这是先把两个数相加了，没有先求绝对值。"],
                [abs(a + b), "That adds first and then takes the absolute value.", "这是先相加，再求绝对值。"],
                [x - y, "That subtracts instead of adding.", "这是做成减法了。"],
              ],
              intLine(-13, 13, [a, b]),
            );
          default:
            return signedAnswer(
              [`Find $|${num(a)}| - |${num(b)}|$.`, `计算 $|${num(a)}| - |${num(b)}|$。`],
              x - y,
              [
                find,
                [
                  ["Subtract", "相减"],
                  ["Take the second distance from the first.", "用第一个距离减去第二个距离。"],
                  [`${x} - ${y} = ${num(x - y)}`],
                ],
              ],
              [`Add back: $${num(x - y)} + ${y} = ${x}$.`, `加回去：$${num(x - y)} + ${y} = ${x}$。`],
              [
                [a - b, "That subtracts the numbers before finding the absolute values.", "这是先把两个数相减了，没有先求绝对值。"],
                [abs(a - b), "That subtracts first and then takes the absolute value.", "这是先相减，再求绝对值。"],
                [y - x, "That subtracts in the wrong order.", "这是减的顺序反了。"],
              ],
              intLine(-13, 13, [a, b]),
            );
        }
      },
      intLine(-5, 5, [-4, 3]),
    ),
  ],
  intro: t(
    "A diver is 6 meters below the sea, at $-6$. A bird is 6 meters above it, at 6. Both are 6 meters from the surface: $|-6| = 6$ and $|6| = 6$.\n\nCheck: on a number line, count 6 steps from 0 to $-6$.\n\nIn this lesson we find absolute values, the distance of a number from 0.",
    "一个潜水员在海面下 6 米，记作 $-6$。一只鸟在海面上 6 米，记作 6。它们离海面都是 6 米：$|-6| = 6$，$|6| = 6$。\n\n检验：在数轴上，从 0 数到 $-6$ 是 6 格。\n\n本课我们求绝对值，也就是一个数到 0 的距离。",
  ),
};

/** sameSigns adds two integers of one sign, at the given difficulty. */
function sameSigns(rng: Rng, difficulty?: Difficulty): Problem {
  const [lo, hi] = tierRange(difficulty, 2, 60);
  const s = rng.bool(0.8) ? -1 : 1;
  const a = s * rng.int(lo, hi);
  const b = s * rng.int(lo, hi);
  const sum = a + b;
  const kind: Pair = s < 0 ? ["negative", "负数"] : ["positive", "正数"];
  return valued(
    [`Evaluate $${num(a)} + ${paren(b)}$.`, `计算 $${num(a)} + ${paren(b)}$。`],
    sum,
    [
      [
        ["Add the sizes", "大小相加"],
        [
          `Both numbers are ${kind[0]}, so they move the same way. Add their absolute values:`,
          `两个数都是${kind[1]}，朝同一个方向走。把绝对值相加：`,
        ],
        [`${abs(a)} + ${abs(b)} = ${abs(sum)}`],
      ],
      [["Keep the sign", "保留符号"], [`The sum is ${kind[0]} too:`, `和也是${kind[1]}：`], [`${num(a)} + ${paren(b)} = ${num(sum)}`]],
    ],
    [
      `Start at $${num(a)}$ on a number line and move $${abs(b)}$ units to the ${s < 0 ? "left" : "right"}: you land on $${num(sum)}$.`,
      `在数轴上从 $${num(a)}$ 出发，向${s < 0 ? "左" : "右"}移动 $${abs(b)}$ 个单位，到达 $${num(sum)}$。`,
    ],
    [
      [-sum, `That has the wrong sign. Two ${kind[0]} numbers add to a ${kind[0]} number.`, `符号错了。两个${kind[1]}相加还是${kind[1]}。`],
      [
        a - b,
        "You subtracted. Numbers of the same sign move the same way, so the sizes add.",
        "你做了减法。同号的数朝同一方向走，所以大小要相加。",
      ],
      [
        b - a,
        "You subtracted. Numbers of the same sign move the same way, so the sizes add.",
        "你做了减法。同号的数朝同一方向走，所以大小要相加。",
      ],
    ],
    { figure: intLine(Math.min(0, sum) - 1, Math.max(0, sum) + 1, [a, sum], [[a, sum]]) },
  );
}

/** differentSigns adds a positive and a negative integer, at the given difficulty. */
function differentSigns(rng: Rng, difficulty?: Difficulty): Problem {
  const [lo, hi] = tierRange(difficulty, 1, 60);
  let a = rng.int(lo, hi);
  let b = rng.int(lo, hi);
  while (a === b) b = rng.int(lo, hi);
  if (rng.bool()) a = -a;
  else b = -b;
  const sum = a + b;
  const [big, small] = abs(a) > abs(b) ? [a, b] : [b, a];
  return valued(
    [`Evaluate $${num(a)} + ${paren(b)}$.`, `计算 $${num(a)} + ${paren(b)}$。`],
    sum,
    [
      [
        ["Subtract the sizes", "大小相减"],
        [
          "The signs differ, so the two numbers pull opposite ways. Take the smaller size from the larger:",
          "两个数异号，方向相反，会互相抵消。用较大的绝对值减去较小的：",
        ],
        [`${abs(big)} - ${abs(small)} = ${abs(sum)}`],
      ],
      [
        ["Take the sign of the bigger size", "取绝对值较大的数的符号"],
        [
          `$${num(big)}$ has the larger size and is ${big < 0 ? "negative" : "positive"}, so:`,
          `$${num(big)}$ 的绝对值较大，是${big < 0 ? "负数" : "正数"}，所以：`,
        ],
        [`${num(a)} + ${paren(b)} = ${num(sum)}`],
      ],
    ],
    [
      `Start at $${num(a)}$ and move $${abs(b)}$ units to the ${b < 0 ? "left" : "right"}: you land on $${num(sum)}$.`,
      `从 $${num(a)}$ 出发，向${b < 0 ? "左" : "右"}移动 $${abs(b)}$ 个单位，到达 $${num(sum)}$。`,
    ],
    [
      [
        -sum,
        `That takes the sign of $${num(small)}$, but $${num(big)}$ has the larger size.`,
        `这取了 $${num(small)}$ 的符号，但 $${num(big)}$ 的绝对值更大。`,
      ],
      [abs(a) + abs(b), "You added the sizes. Numbers of opposite signs partly cancel.", "你把大小相加了。异号的数会部分抵消。"],
      [-(abs(a) + abs(b)), "You added the sizes. Numbers of opposite signs partly cancel.", "你把大小相加了。异号的数会部分抵消。"],
    ],
    { figure: intLine(Math.min(0, a, sum) - 1, Math.max(0, a, sum) + 1, [a, sum], [[a, sum]]) },
  );
}

/** addingIntegers teaches adding integers of the same sign and of different signs. */
export const addingIntegers: TopicDef = withIntro(
  {
    id: "adding-integers",
    title: t("Adding Integers", "整数加法"),
    summary: t("Add integers with the same sign and with different signs.", "同号整数相加与异号整数相加。"),
    prerequisites: ["absolute-value"],
    encompasses: [{ topic: "absolute-value", weight: 0.5 }],
    xp: 12,
    standards: ["CCSS.7.NS.A.1"],
    knowledgePoints: [
      {
        ...lesson(
          "same-signs",
          ["Adding integers with the same sign", "同号整数相加"],
          [
            [
              "Two numbers with the **same sign** move the same way on a number line. Add their absolute values and keep the sign. For $(-6) + (-9)$: $6 + 9 = 15$, and both are negative, so the sum is $-15$.",
              "**同号**的两个数在数轴上朝同一方向走。把绝对值相加，保留共同的符号。$(-6) + (-9)$：$6 + 9 = 15$，两个数都是负数，所以和是 $-15$。",
            ],
            ["Start at $-6$ and move $9$ units left: you land on $-15$.", "从 $-6$ 出发向左移动 $9$ 个单位，到达 $-15$。"],
            [
              "Two negatives make a negative sum, never a positive one. $(-6) + (-9)$ is $-15$, not $15$.",
              "两个负数相加，和是负数，不会是正数。$(-6) + (-9)$ 是 $-15$，不是 $15$。",
            ],
          ],
          sameSigns,
          drawn(remainingDrawings4["adding-integers#same-signs"]),
        ),
        keyPrerequisites: ["absolute-value"],
        tiered: true,
      },
      {
        ...lesson(
          "different-signs",
          ["Adding integers with different signs", "异号整数相加"],
          [
            [
              "Two numbers with **different signs** pull opposite ways, so they partly cancel. Take the smaller size from the larger, and give the answer the sign of the number with the larger size. For $(-11) + 4$: $11 - 4 = 7$, and $-11$ is bigger in size, so the sum is $-7$.",
              "**异号**的两个数方向相反，会部分抵消。用较大的绝对值减去较小的，结果取绝对值较大的那个数的符号。$(-11) + 4$：$11 - 4 = 7$，$-11$ 的绝对值更大，所以和是 $-7$。",
            ],
            ["Start at $-11$ and move $4$ units right: you land on $-7$.", "从 $-11$ 出发向右移动 $4$ 个单位，到达 $-7$。"],
            [
              "Do not add the sizes when the signs differ. $(-11) + 4$ is not $-15$; the $4$ cancels part of the $-11$.",
              "异号时不能把大小相加。$(-11) + 4$ 不是 $-15$；$4$ 抵消了 $-11$ 的一部分。",
            ],
          ],
          differentSigns,
          drawn(remainingDrawings4["adding-integers#different-signs"]),
        ),
        keyPrerequisites: ["absolute-value"],
        tiered: true,
      },
    ],
  },
  [
    "A diver is $3$ m below the surface, at $-3$ m. She swims down $4$ m more, which is $-4$. Now she is at $(-3) + (-4) = -7$ m.",
    "一名潜水员在水面下 $3$ 米，也就是 $-3$ 米。她又往下游了 $4$ 米，也就是 $-4$。现在她在 $(-3) + (-4) = -7$ 米处。",
  ],
  ["On a number line, start at $-3$ and move $4$ units left: you land on $-7$.", "在数轴上从 $-3$ 出发向左移动 $4$ 个单位，到达 $-7$。"],
  [
    "add integers with the same sign and with different signs, and add long lists of them.",
    "学习同号整数相加、异号整数相加，以及一长串整数相加。",
  ],
);

/** addingALongList adds a list of positive and negative integers by grouping each sign. */
export const addingALongList = lesson(
  "adding-a-long-list",
  ["Adding a long list", "一长串相加"],
  [
    [
      "Numbers can be added in any order. For a long list, add all the positive numbers, add all the negative numbers, then combine the two totals. For $12 + (-5) + 8 + (-9)$: the positives make $20$, the negatives make $-14$, and $20 + (-14) = 6$.",
      "加法可以按任何顺序进行。一长串数相加时，先把正数加起来，再把负数加起来，最后合并两个总和。$12 + (-5) + 8 + (-9)$：正数和是 $20$，负数和是 $-14$，$20 + (-14) = 6$。",
    ],
    ["Left to right: $12 - 5 = 7$, $7 + 8 = 15$, $15 - 9 = 6$.", "从左到右：$12 - 5 = 7$，$7 + 8 = 15$，$15 - 9 = 6$。"],
    [
      "Keep each sign with its number when you group. Moving $-5$ to the end still means adding $-5$.",
      "分组时，每个数要带着自己的符号走。把 $-5$ 挪到后面，仍然是加 $-5$。",
    ],
  ],
  (rng) => {
    const pos = [rng.int(5, 40), rng.int(5, 40), rng.int(5, 40)];
    const neg = [-rng.int(5, 40), -rng.int(5, 40)];
    const list = rng.shuffle([...pos, ...neg]);
    const p = pos.reduce((s, x) => s + x, 0);
    const n = neg.reduce((s, x) => s + x, 0);
    const text = list.map((x, i) => (i === 0 ? `${x}` : x < 0 ? `+ (${x})` : `+ ${x}`)).join(" ");
    const running: number[] = [];
    list.reduce((s, x) => {
      running.push(s + x);
      return s + x;
    }, 0);
    return valued(
      [`Evaluate $${text}$.`, `计算 $${text}$。`],
      p + n,
      [
        [
          ["Group by sign", "按符号分组"],
          ["Add the positive numbers, then the negative numbers:", "把正数加起来，再把负数加起来："],
          [`${pos.join(" + ")} = ${p}`, `${neg.map((x, i) => (i === 0 ? `${x}` : `(${x})`)).join(" + ")} = ${n}`],
        ],
        [
          ["Combine the totals", "合并两个总和"],
          ["The signs differ, so the sizes partly cancel:", "两个总和异号，大小会部分抵消："],
          [`${p} + (${n}) = ${num(p + n)}`],
        ],
      ],
      [
        `Left to right, the running totals are $${running.join(", ")}$, ending on $${num(p + n)}$.`,
        `从左到右逐个相加，依次得到 $${running.join(", ")}$，最后是 $${num(p + n)}$。`,
      ],
      [
        [p - n, "That adds the negative numbers as if they were positive.", "这把负数当成正数加了。"],
        [-(p + n), "That has the wrong sign: the positives total more.", "符号错了：正数的总和更大。"],
        [p, "That leaves out the negative numbers.", "这漏掉了负数。"],
        [n, "That leaves out the positive numbers.", "这漏掉了正数。"],
      ],
    );
  },
  tableFigure(["+", "−", "="], [20, -14, 6]),
);

/** subtractingIntegers teaches subtraction of integers as adding the opposite. */
export const subtractingIntegers: TopicDef = withIntro(
  {
    id: "subtracting-integers",
    title: t("Subtracting Integers", "整数减法"),
    summary: t("Subtract integers by adding the opposite.", "把减法化为加上相反数来计算整数减法。"),
    prerequisites: ["adding-integers"],
    encompasses: [{ topic: "adding-integers", weight: 1 }],
    xp: 12,
    standards: ["CCSS.7.NS.A.1.C"],
    knowledgePoints: [
      {
        ...lesson(
          "subtracting-a-positive",
          ["Subtracting a positive integer", "减去正整数"],
          [
            [
              "Subtracting a number is the same as adding its opposite: $a - b = a + (-b)$. Subtracting a positive number moves left on the number line. So $3 - 8 = 3 + (-8) = -5$ and $-4 - 6 = -4 + (-6) = -10$.",
              "减去一个数，等于加上它的相反数：$a - b = a + (-b)$。减去正数就是在数轴上向左移动。所以 $3 - 8 = 3 + (-8) = -5$，$-4 - 6 = -4 + (-6) = -10$。",
            ],
            ["Add back what was taken: $-5 + 8 = 3$.", "把减去的加回来：$-5 + 8 = 3$。"],
            [
              "$3 - 8$ is not $8 - 3$. Taking $8$ from $3$ goes below zero, so the answer is $-5$, not $5$.",
              "$3 - 8$ 不等于 $8 - 3$。从 $3$ 里减去 $8$ 会低于零，所以结果是 $-5$，不是 $5$。",
            ],
          ],
          (rng: Rng, difficulty?: Difficulty) => {
            const [lo, hi] = tierRange(difficulty, 2, 50);
            const b = rng.int(lo, hi);
            const a = rng.bool(0.5) ? rng.int(0, b - 1) : -rng.int(1, hi);
            const d = a - b;
            return valued(
              [`Evaluate $${num(a)} - ${b}$.`, `计算 $${num(a)} - ${b}$。`],
              d,
              [
                [
                  ["Add the opposite", "加上相反数"],
                  [`Subtracting $${b}$ is adding $-${b}$:`, `减去 $${b}$ 就是加上 $-${b}$：`],
                  [`${num(a)} - ${b} = ${num(a)} + (-${b})`],
                ],
                [
                  ["Add", "相加"],
                  [
                    a < 0
                      ? "Both are negative, so add the sizes and keep the minus sign:"
                      : `The signs differ, and $-${b}$ is bigger in size:`,
                    a < 0 ? "两个数都是负数，大小相加，保留负号：" : `两个数异号，$-${b}$ 的绝对值更大：`,
                  ],
                  [`${num(a)} + (-${b}) = ${num(d)}`],
                ],
              ],
              [`Add back what was taken: $${num(d)} + ${b} = ${num(a)}$.`, `把减去的加回来：$${num(d)} + ${b} = ${num(a)}$。`],
              [
                [b - a, "That subtracts the other way round.", "这是倒过来相减了。"],
                [a + b, "You added. Subtracting a positive number moves left.", "你做了加法。减去正数是向左移动。"],
                a < 0
                  ? [
                      -(abs(a) - b),
                      "That subtracts the sizes; taking more away from a negative number goes further below zero.",
                      "这是把大小相减了；从负数里再减去，只会离零更远。",
                    ]
                  : [-(a + b), `That adds the sizes as if $${a}$ were negative too.`, `这把大小相加了，好像 $${a}$ 也是负数一样。`],
              ],
              { figure: intLine(d - 1, Math.max(0, a) + 1, [a, d], [[a, d]]) },
            );
          },
          drawn(remainingDrawings4["subtracting-integers#subtracting-a-positive"]),
        ),
        keyPrerequisites: ["adding-integers"],
        tiered: true,
      },
      {
        ...lesson(
          "subtracting-a-negative",
          ["Subtracting a negative integer", "减去负整数"],
          [
            [
              "Taking away a negative amount, like crossing out a debt, makes you better off. So subtracting a negative number moves right: $a - (-b) = a + b$. For example, $-9 - (-4) = -9 + 4 = -5$.",
              "拿走一个负的量，比如免掉一笔欠款，会让你更宽裕。所以减去负数是向右移动：$a - (-b) = a + b$。例如 $-9 - (-4) = -9 + 4 = -5$。",
            ],
            ["Add back what was taken: $-5 + (-4) = -9$.", "把减去的加回来：$-5 + (-4) = -9$。"],
            [
              "Two minus signs side by side do not make a bigger subtraction. $-9 - (-4)$ is $-5$, not $-13$.",
              "两个负号挨在一起，不是减得更多。$-9 - (-4)$ 是 $-5$，不是 $-13$。",
            ],
          ],
          (rng: Rng, difficulty?: Difficulty) => {
            const [lo, hi] = tierRange(difficulty, 2, 50);
            const a = rng.nonZero(-hi, hi);
            const b = rng.int(lo, hi);
            const d = a + b;
            return valued(
              [`Evaluate $${num(a)} - (-${b})$.`, `计算 $${num(a)} - (-${b})$。`],
              d,
              [
                [
                  ["Add the opposite", "加上相反数"],
                  [`The opposite of $-${b}$ is $${b}$:`, `$-${b}$ 的相反数是 $${b}$：`],
                  [`${num(a)} - (-${b}) = ${num(a)} + ${b}`],
                ],
                [["Add", "相加"], ["Move right from the first number:", "从第一个数向右移动："], [`${num(a)} + ${b} = ${num(d)}`]],
              ],
              [`Add back what was taken: $${num(d)} + (-${b}) = ${num(a)}$.`, `把减去的加回来：$${num(d)} + (-${b}) = ${num(a)}$。`],
              [
                [
                  a - b,
                  "That reads the two minus signs as one subtraction. Subtracting a negative is adding its opposite.",
                  "这把两个负号当成了一次减法。减去负数等于加上它的相反数。",
                ],
                [-a - b, "That changes the sign of the first number too.", "这把第一个数的符号也改了。"],
                [-d, "That has the wrong sign.", "符号错了。"],
              ],
              { figure: intLine(Math.min(0, a) - 1, Math.max(0, d) + 1, [a, d], [[a, d]]) },
            );
          },
          drawn(remainingDrawings4["subtracting-integers#subtracting-a-negative"]),
        ),
        keyPrerequisites: ["adding-integers"],
        tiered: true,
      },
    ],
  },
  [
    "At dawn it is $-2$ degrees, and by noon it is $5$ degrees. The rise is $5 - (-2) = 5 + 2 = 7$ degrees.",
    "清晨气温是 $-2$ 度，中午是 $5$ 度。上升了 $5 - (-2) = 5 + 2 = 7$ 度。",
  ],
  [
    "From $-2$ up to $0$ is $2$ degrees, and from $0$ up to $5$ is $5$ more: $2 + 5 = 7$.",
    "从 $-2$ 升到 $0$ 是 $2$ 度，从 $0$ 升到 $5$ 又是 $5$ 度：$2 + 5 = 7$。",
  ],
  [
    "subtract positive and negative integers by adding the opposite, and find the distance between two numbers.",
    "把减法化成加上相反数，学习减去正整数和负整数，并求两个数之间的距离。",
  ],
);

/** theDistanceBetweenTwoNumbers finds how far apart a floor above ground and one below are. */
export const theDistanceBetweenTwoNumbers = lesson(
  "the-distance-between-two-numbers",
  ["The distance between two numbers", "两个数之间的距离"],
  [
    [
      "The distance between two numbers is the bigger one minus the smaller one. When they lie on opposite sides of zero, this is the sum of their sizes. From $-3$ to $4$: $4 - (-3) = 4 + 3 = 7$.",
      "两个数之间的距离是大数减小数。两个数在零的两边时，距离就是它们的大小之和。从 $-3$ 到 $4$：$4 - (-3) = 4 + 3 = 7$。",
    ],
    ["Count in two parts: $3$ steps up to $0$, then $4$ more, $3 + 4 = 7$.", "分两段数：到 $0$ 是 $3$ 格，再走 $4$ 格，$3 + 4 = 7$。"],
    [
      "Across zero, do not subtract the sizes. The distance from $-3$ to $4$ is $7$, not $4 - 3 = 1$.",
      "跨过零时，不能把大小相减。从 $-3$ 到 $4$ 的距离是 $7$，不是 $4 - 3 = 1$。",
    ],
  ],
  (rng) => {
    const hi = rng.int(1, 40);
    const lo = -rng.int(1, 60);
    const answer = hi - lo;
    return valued(
      [
        `An elevator at floor $${hi}$ goes down to floor $${lo}$, with underground floors shown as negative integers. How many floors does it travel?`,
        `电梯从 $${hi}$ 层降到 $${lo}$ 层（地下层用负整数表示）。它走了多少层？`,
      ],
      answer,
      [
        [
          ["Subtract the lower floor", "用高的楼层减去低的"],
          ["The distance is the higher floor minus the lower one:", "距离是高的楼层减去低的楼层："],
          [`${hi} - (${lo}) = ${hi} + ${-lo}`],
        ],
        [["Add", "相加"], ["Subtracting a negative is adding its size:", "减去负数就是加上它的大小："], [`${hi} + ${-lo} = ${answer}`]],
      ],
      [
        `Going up $${answer}$ floors from floor $${lo}$ reaches $${lo} + ${answer} = ${hi}$.`,
        `从 $${lo}$ 层往上走 $${answer}$ 层，到达 $${lo} + ${answer} = ${hi}$ 层。`,
      ],
      [
        [
          abs(hi + lo),
          "That subtracts the sizes, but the floors lie on opposite sides of zero.",
          "这是把大小相减了，但两个楼层在零的两边。",
        ],
        [hi, "That counts only the floors above ground.", "这只算了地上的楼层。"],
        [-lo, "That counts only the floors below ground.", "这只算了地下的楼层。"],
      ],
    );
  },
  drawn(remainingDrawings4["subtracting-integers#the-distance-between-two-numbers"]),
);

/** multiplyingIntegers teaches the sign rules of multiplication. */
export const multiplyingIntegers: TopicDef = withIntro(
  {
    id: "multiplying-integers",
    title: t("Multiplying Integers", "整数乘法"),
    summary: t("Multiply integers using the sign rules.", "运用符号法则做整数乘法。"),
    prerequisites: ["integers-and-opposites"],
    encompasses: [],
    xp: 10,
    standards: ["CCSS.7.NS.A.2"],
    knowledgePoints: [
      lesson(
        "two-factors",
        ["Multiplying two integers", "两个整数相乘"],
        [
          [
            "Multiply the absolute values, then choose the sign. Same signs give a **positive** product: $(-3)(-5) = 15$. Different signs give a **negative** product: $4 \\cdot (-3) = -12$, which is four jumps of $-3$.",
            "先把绝对值相乘，再定符号。同号相乘得**正数**：$(-3)(-5) = 15$。异号相乘得**负数**：$4 \\cdot (-3) = -12$，就是走四次 $-3$。",
          ],
          ["$(-3) + (-3) + (-3) + (-3) = -12$.", "$(-3) + (-3) + (-3) + (-3) = -12$。"],
          [
            "Two negatives multiply to a positive, even though two negatives add to a negative. $(-3)(-5) = 15$, but $(-3) + (-5) = -8$.",
            "两个负数相乘得正数，虽然两个负数相加得负数。$(-3)(-5) = 15$，而 $(-3) + (-5) = -8$。",
          ],
        ],
        (rng) => {
          let a = rng.nonZero(-12, 12);
          const b = rng.nonZero(-12, 12);
          if (a > 0 && b > 0) a = -a;
          const p = a * b;
          const same = a < 0 === b < 0;
          return valued(
            [`Evaluate $${num(a)} \\cdot ${paren(b)}$.`, `计算 $${num(a)} \\cdot ${paren(b)}$。`],
            p,
            [
              [
                ["Multiply the sizes", "大小相乘"],
                ["Leave the signs for now:", "先不管符号："],
                [`${abs(a)} \\cdot ${abs(b)} = ${abs(p)}`],
              ],
              [
                ["Choose the sign", "定符号"],
                same
                  ? ["Both factors are negative, so the product is positive:", "两个因数都是负数，所以积为正："]
                  : ["One factor is negative and one is positive, so the product is negative:", "一个因数是负数，一个是正数，所以积为负："],
                [`${num(a)} \\cdot ${paren(b)} = ${num(p)}`],
              ],
            ],
            [`Divide back: $${num(p)} \\div ${paren(b)} = ${num(a)}$.`, `用除法倒回去：$${num(p)} \\div ${paren(b)} = ${num(a)}$。`],
            [
              [
                -p,
                same ? "Two negative factors give a positive product." : "A negative times a positive is negative.",
                same ? "两个负因数相乘，积为正。" : "负数乘正数，积为负。",
              ],
              [a + b, "You added the numbers. Here they are multiplied.", "你把两个数相加了。这里要相乘。"],
            ],
          );
        },
        intLine(
          -13,
          1,
          [-12],
          [
            [0, -3],
            [-3, -6],
            [-6, -9],
            [-9, -12],
          ],
        ),
      ),
      lesson(
        "several-factors",
        ["Multiplying several integers", "多个整数相乘"],
        [
          [
            "When several nonzero numbers are multiplied, count the negative factors. An **even** count gives a positive product and an **odd** count gives a negative one. $(-2)(-3)(-4)$ has three negative factors, so it is $-24$.",
            "多个非零数相乘时，数一数负因数的个数。负因数有**偶数**个，积为正；有**奇数**个，积为负。$(-2)(-3)(-4)$ 有三个负因数，所以等于 $-24$。",
          ],
          ["Left to right: $(-2)(-3) = 6$, then $6 \\cdot (-4) = -24$.", "从左到右：$(-2)(-3) = 6$，再 $6 \\cdot (-4) = -24$。"],
          [
            "Count every negative factor, not just the first two. One more negative factor flips the sign again.",
            "每个负因数都要数，不能只看前两个。多一个负因数，符号就再变一次。",
          ],
        ],
        (rng) => {
          const fs = [rng.nonZero(-9, 9), rng.nonZero(-9, 9), rng.nonZero(-6, 6)];
          if (fs.every((f) => f > 0)) fs[rng.int(0, 2)]! *= -1;
          const [f0, f1, f2] = fs as [number, number, number];
          const p = f0 * f1 * f2;
          const negatives = fs.filter((f) => f < 0).length;
          const expr = fs.map(paren).join(" \\cdot ");
          return valued(
            [`Evaluate $${expr}$.`, `计算 $${expr}$。`],
            p,
            [
              [
                ["Multiply the sizes", "大小相乘"],
                ["Leave the signs for now:", "先不管符号："],
                [`${fs.map(abs).join(" \\cdot ")} = ${abs(p)}`],
              ],
              [
                ["Count the negatives", "数负因数"],
                [
                  `There ${negatives === 1 ? "is $1$ negative factor" : `are $${negatives}$ negative factors`}, an ${negatives % 2 ? "odd" : "even"} count, so the product is ${negatives % 2 ? "negative" : "positive"}:`,
                  `负因数有 $${negatives}$ 个，是${negatives % 2 ? "奇" : "偶"}数个，所以积为${negatives % 2 ? "负" : "正"}：`,
                ],
                [`${expr} = ${num(p)}`],
              ],
            ],
            [
              `Left to right: $${paren(f0)} \\cdot ${paren(f1)} = ${num(f0 * f1)}$, then $${num(f0 * f1)} \\cdot ${paren(f2)} = ${num(p)}$.`,
              `从左到右：$${paren(f0)} \\cdot ${paren(f1)} = ${num(f0 * f1)}$，再 $${num(f0 * f1)} \\cdot ${paren(f2)} = ${num(p)}$。`,
            ],
            [
              [
                -p,
                `That has the wrong sign: $${negatives}$ negative ${negatives === 1 ? "factor makes" : "factors make"} an ${negatives % 2 ? "odd" : "even"} count.`,
                `符号错了：$${negatives}$ 个负因数是${negatives % 2 ? "奇" : "偶"}数个。`,
              ],
              [f0 + f1 + f2, "You added the numbers. Here they are multiplied.", "你把几个数相加了。这里要相乘。"],
            ],
          );
        },
        tableFigure(["(−2)", "·(−3)", "·(−4)", "·(−1)"], [-2, 6, -24, 24]),
      ),
    ],
  },
  [
    "A tank loses $3$ liters of water every hour, a change of $-3$ each hour. After $4$ hours the change is $4 \\cdot (-3) = -12$ liters.",
    "一个水箱每小时漏掉 $3$ 升水，每小时的变化是 $-3$。$4$ 小时后，变化是 $4 \\cdot (-3) = -12$ 升。",
  ],
  ["Add the four changes: $(-3) + (-3) + (-3) + (-3) = -12$.", "把四次变化相加：$(-3) + (-3) + (-3) + (-3) = -12$。"],
  ["multiply two or more integers and decide the sign of the product.", "学习两个或多个整数相乘，并判断积的符号。"],
);

/** theSignFromACountOfNegatives decides the sign of a long product from how many factors are negative. */
export const theSignFromACountOfNegatives = lesson(
  "the-sign-from-a-count-of-negatives",
  ["The sign from a count of negatives", "由负数个数定符号"],
  [
    [
      "You can tell the sign of a product without working it out. Negative factors pair up to make positives, so an even count of negatives gives a positive product and an odd count gives a negative one. $(-1)(-1)(-1)(-1)(-1)$ has five, so it is negative.",
      "不用算出积，也能知道积的符号。负因数两两配对变成正数，所以负因数有偶数个时积为正，有奇数个时积为负。$(-1)(-1)(-1)(-1)(-1)$ 有五个负因数，所以是负数。",
    ],
    [
      "$(-1)(-1) = 1$, two pairs make $1$, and the fifth $(-1)$ makes it $-1$.",
      "$(-1)(-1) = 1$，两对得 $1$，第五个 $(-1)$ 使它变成 $-1$。",
    ],
    [
      "Only the negative factors count. Positive factors never change the sign, however many there are.",
      "只数负因数。正因数不管有多少个，都不会改变符号。",
    ],
  ],
  (rng) => {
    const negs = rng.int(2, 7);
    const posCount = rng.int(1, 4);
    const factors = rng.shuffle([
      ...Array.from({ length: negs }, () => -rng.int(1, 19)),
      ...Array.from({ length: posCount }, () => rng.int(1, 19)),
    ]);
    const negative = negs % 2 === 1;
    const expr = factors.map((f) => (f < 0 ? `(${f})` : `${f}`)).join(" \\cdot ");
    const pairs = Math.floor(negs / 2);
    const right: Pair = negative ? ["Negative", "负数"] : ["Positive", "正数"];
    const other: Pair = negative ? ["Positive", "正数"] : ["Negative", "负数"];
    return chosen(
      rng,
      [`What is the sign of $${expr}$?`, `$${expr}$ 的符号是什么？`],
      right,
      [
        [
          other,
          negative
            ? "One negative factor is left over after pairing, so the product is negative."
            : "The negative factors all pair up, so the product is positive.",
          negative ? "配对之后还剩一个负因数，所以积为负。" : "负因数正好两两配对，所以积为正。",
        ],
        [["Zero", "零"], "No factor is $0$, so the product cannot be $0$.", "没有一个因数是 $0$，所以积不可能是 $0$。"],
        [
          ["It cannot be decided", "无法确定"],
          "The sign depends only on how many factors are negative, and you can count them.",
          "符号只取决于负因数的个数，而个数是数得出来的。",
        ],
      ],
      [
        [
          ["Count the negatives", "数负因数"],
          [`There are $${negs}$ negative factors.`, `负因数有 $${negs}$ 个。`],
        ],
        [
          ["Pair them up", "两两配对"],
          [
            `They make $${pairs}$ ${pairs === 1 ? "pair" : "pairs"}${negative ? " with one left over" : " with none left"}, so the product is ${negative ? "negative" : "positive"}.`,
            `它们组成 $${pairs}$ 对，${negative ? "还剩一个" : "没有剩下"}，所以积为${negative ? "负" : "正"}。`,
          ],
        ],
      ],
      [
        `Replace each factor by its sign: $(-1)^{${negs}} = ${negative ? "-1" : "1"}$, and the positive factors do not change it.`,
        `把每个因数换成它的符号：$(-1)^{${negs}} = ${negative ? "-1" : "1"}$，正因数不会改变它。`,
      ],
    );
  },
  tableFigure(["1", "2", "3", "4", "5"], [-1, 1, -1, 1, -1]),
);

/** dividingIntegers teaches the sign rules of division and the fraction bar. */
export const dividingIntegers: TopicDef = withIntro(
  {
    id: "dividing-integers",
    title: t("Dividing Integers", "整数除法"),
    summary: t("Divide integers using the sign rules.", "运用符号法则做整数除法。"),
    prerequisites: ["multiplying-integers"],
    encompasses: [{ topic: "multiplying-integers", weight: 0.5 }],
    xp: 10,
    standards: ["CCSS.7.NS.A.2.B"],
    knowledgePoints: [
      {
        ...lesson(
          "division-sign",
          ["Dividing integers", "两个整数相除"],
          [
            [
              "Division has the same sign rules as multiplication, because $a \\div b = c$ exactly when $b \\cdot c = a$. Same signs give a positive quotient: $(-24) \\div (-6) = 4$. Different signs give a negative one: $-12 \\div 3 = -4$.",
              "除法的符号法则和乘法一样，因为 $a \\div b = c$ 恰好意味着 $b \\cdot c = a$。同号相除得正数：$(-24) \\div (-6) = 4$。异号相除得负数：$-12 \\div 3 = -4$。",
            ],
            ["Multiply back: $3 \\cdot (-4) = -12$.", "乘回去：$3 \\cdot (-4) = -12$。"],
            [
              "A negative divided by a negative is positive. $(-24) \\div (-6)$ is $4$, not $-4$.",
              "负数除以负数得正数。$(-24) \\div (-6)$ 是 $4$，不是 $-4$。",
            ],
          ],
          (rng) => {
            const b = rng.nonZero(-12, 12);
            let c = rng.nonZero(-12, 12);
            if (b > 0 && c > 0) c = -c;
            const a = b * c;
            const same = a < 0 === b < 0;
            return valued(
              [`Evaluate $${num(a)} \\div ${paren(b)}$.`, `计算 $${num(a)} \\div ${paren(b)}$。`],
              c,
              [
                [["Divide the sizes", "大小相除"], ["Leave the signs for now:", "先不管符号："], [`${abs(a)} \\div ${abs(b)} = ${abs(c)}`]],
                [
                  ["Choose the sign", "定符号"],
                  same
                    ? ["The signs are the same, so the quotient is positive:", "两数同号，所以商为正："]
                    : ["The signs differ, so the quotient is negative:", "两数异号，所以商为负："],
                  [`${num(a)} \\div ${paren(b)} = ${num(c)}`],
                ],
              ],
              [`Multiply back: $${num(b)} \\cdot ${paren(c)} = ${num(a)}$.`, `乘回去：$${num(b)} \\cdot ${paren(c)} = ${num(a)}$。`],
              [
                [
                  -c,
                  same ? "Same signs give a positive quotient." : "Different signs give a negative quotient.",
                  same ? "同号相除，商为正。" : "异号相除，商为负。",
                ],
                [a - b, "You subtracted. Here the numbers are divided.", "你做了减法。这里要相除。"],
              ],
            );
          },
          intLine(
            -13,
            1,
            [-12, -4],
            [
              [0, -4],
              [-4, -8],
              [-8, -12],
            ],
          ),
        ),
        keyPrerequisites: ["multiplying-integers"],
      },
      lesson(
        "fraction-bar",
        ["The fraction bar as division", "分数线表示除法"],
        [
          [
            "A fraction bar means division: $\\dfrac{a}{b} = a \\div b$. One minus sign may sit on top, at the bottom or in front, and the value is the same: $\\dfrac{-12}{4} = \\dfrac{12}{-4} = -\\dfrac{12}{4} = -3$.",
            "分数线表示除法：$\\dfrac{a}{b} = a \\div b$。一个负号写在分子、分母或分数前面，值都一样：$\\dfrac{-12}{4} = \\dfrac{12}{-4} = -\\dfrac{12}{4} = -3$。",
          ],
          ["$4 \\cdot (-3) = -12$ and $(-4) \\cdot (-3) = 12$.", "$4 \\cdot (-3) = -12$，$(-4) \\cdot (-3) = 12$。"],
          [
            "A minus sign in front applies after the division. $-\\dfrac{-12}{4}$ is the opposite of $-3$, which is $3$.",
            "分数前面的负号在除完之后才起作用。$-\\dfrac{-12}{4}$ 是 $-3$ 的相反数，也就是 $3$。",
          ],
        ],
        (rng) => {
          const b = rng.nonZero(-12, 12);
          const c = rng.nonZero(-12, 12);
          const a = b * c;
          const outside = rng.bool(0.35);
          const expr = `${outside ? "-" : ""}\\dfrac{${num(a)}}{${num(b)}}`;
          const value = outside ? -c : c;
          return valued(
            [`Evaluate $${expr}$.`, `计算 $${expr}$。`],
            value,
            [
              [
                ["Divide", "相除"],
                [`The bar means $${num(a)} \\div ${paren(b)}$:`, `分数线表示 $${num(a)} \\div ${paren(b)}$：`],
                [`${num(a)} \\div ${paren(b)} = ${num(c)}`],
              ],
              outside
                ? [
                    ["Apply the sign in front", "处理前面的负号"],
                    ["The minus sign in front gives the opposite:", "前面的负号取相反数："],
                    [`-(${num(c)}) = ${num(value)}`],
                  ]
                : [
                    ["Check the sign", "检查符号"],
                    [
                      a < 0 === b < 0
                        ? "Top and bottom have the same sign, so the value is positive."
                        : "Top and bottom have different signs, so the value is negative.",
                      a < 0 === b < 0 ? "分子分母同号，所以值为正。" : "分子分母异号，所以值为负。",
                    ],
                  ],
            ],
            [
              `$${num(b)} \\cdot ${paren(c)} = ${num(a)}$, so the fraction is $${num(c)}$${outside ? `, and its opposite is $${num(value)}$` : ""}.`,
              `$${num(b)} \\cdot ${paren(c)} = ${num(a)}$，所以分数等于 $${num(c)}$${outside ? `，它的相反数是 $${num(value)}$` : ""}。`,
            ],
            [
              outside
                ? [c, "That leaves out the minus sign in front.", "这漏掉了前面的负号。"]
                : [-value, "That has the wrong sign.", "符号错了。"],
              [a * b, "You multiplied. A fraction bar means divide.", "你做了乘法。分数线表示除法。"],
            ],
          );
        },
        tableFigure(["−12/4", "12/−4", "−(12/4)"], [-3, -3, -3]),
      ),
    ],
  },
  [
    "Over $4$ days a pond drops $12$ cm, the same each day. The change per day is $-12 \\div 4 = -3$ cm.",
    "一个池塘的水位在 $4$ 天里下降了 $12$ 厘米，每天一样多。每天的变化是 $-12 \\div 4 = -3$ 厘米。",
  ],
  ["Four days of $-3$ cm: $4 \\cdot (-3) = -12$.", "四天，每天 $-3$ 厘米：$4 \\cdot (-3) = -12$。"],
  ["divide integers, read a fraction bar as division, and share a change equally.", "学习整数除法，把分数线读作除法，并把变化平均分配。"],
);

/** anAverageChange shares a total change equally over several days. */
export const anAverageChange = lesson(
  "an-average-change",
  ["An average change", "平均变化"],
  [
    [
      "A total change shared equally over several days gives the change per day, and the sign of the total stays. A fall of $15$ cents over $5$ days is a change of $-15 \\div 5 = -3$ cents a day.",
      "把总变化平均分到几天，就得到每天的变化，总变化的符号保留下来。$5$ 天下跌 $15$ 美分，每天的变化是 $-15 \\div 5 = -3$ 美分。",
    ],
    ["Five days of $-3$: $5 \\cdot (-3) = -15$.", "五天，每天 $-3$：$5 \\cdot (-3) = -15$。"],
    [
      "A fall stays a fall when shared out. The change per day is $-3$, not $3$.",
      "下跌分到每一天，还是下跌。每天的变化是 $-3$，不是 $3$。",
    ],
  ],
  (rng) => {
    const days = rng.int(2, 12);
    const each = rng.int(2, 15);
    const fall = rng.bool();
    const total = (fall ? -each : each) * days;
    const per = total / days;
    return valued(
      [
        `A share price changes by $${total}$ cents in $${days}$ days, by the same amount each day. What is the change per day, in cents?`,
        `股价在 $${days}$ 天内变化 $${total}$ 美分，每天变化相同。每天变化多少美分？`,
      ],
      per,
      [
        [
          ["Read the sign", "看符号"],
          [
            fall
              ? `The total is negative, so the price fell, and each day is a fall too.`
              : "The total is positive, so the price rose, and each day is a rise too.",
            fall ? "总变化是负数，股价下跌了，每天也是下跌。" : "总变化是正数，股价上涨了，每天也是上涨。",
          ],
        ],
        [
          ["Share it out", "平均分"],
          ["Divide the total by the number of days:", "用总变化除以天数："],
          [`${total} \\div ${days} = ${num(per)}`],
        ],
      ],
      [`Multiply back: $${days} \\cdot ${paren(per)} = ${total}$.`, `乘回去：$${days} \\cdot ${paren(per)} = ${total}$。`],
      [
        [-per, "That has the wrong sign; the direction of the total change stays.", "符号错了；总变化的方向要保留。"],
        [total, "That is the total change, not the change per day.", "这是总变化，不是每天的变化。"],
        [total + days, "That adds the days instead of dividing by them.", "这把天数加上了，而不是除以天数。"],
      ],
    );
  },
  intLine(
    -16,
    1,
    [-15],
    [
      [0, -3],
      [-3, -6],
      [-6, -9],
      [-9, -12],
      [-12, -15],
    ],
  ),
);

/** powersOfIntegers teaches powers of negative numbers and the opposite of a power. */
export const powersOfIntegers: TopicDef = withIntro(
  {
    id: "powers-of-integers",
    title: t("Powers of Integers", "整数的乘方"),
    summary: t("Evaluate powers with negative bases, and tell $(-a)^n$ from $-a^n$.", "计算底数为负数的乘方，区分 $(-a)^n$ 与 $-a^n$。"),
    prerequisites: ["multiplying-integers"],
    encompasses: [{ topic: "multiplying-integers", weight: 0.5 }],
    xp: 10,
    standards: ["CCSS.6.EE.A.1"],
    knowledgePoints: [
      {
        ...lesson(
          "negative-bases",
          ["Powers of negative numbers", "负数的乘方"],
          [
            [
              "A power is repeated multiplication: $a^n$ means $n$ factors of $a$. With a negative base the parentheses belong to the base: $(-2)^3 = (-2)(-2)(-2) = -8$. An **even** power of a negative number is positive, and an **odd** power is negative.",
              "乘方是重复的乘法：$a^n$ 表示 $n$ 个 $a$ 相乘。底数是负数时，括号属于底数：$(-2)^3 = (-2)(-2)(-2) = -8$。负数的**偶数**次幂为正，**奇数**次幂为负。",
            ],
            ["Build it up: $(-2)^2 = 4$, then $4 \\cdot (-2) = -8$.", "一步步乘：$(-2)^2 = 4$，再 $4 \\cdot (-2) = -8$。"],
            [
              "The exponent counts factors; it does not multiply the base. $(-2)^3$ is $-8$, not $-6$.",
              "指数表示因数的个数，不是拿底数去乘它。$(-2)^3$ 是 $-8$，不是 $-6$。",
            ],
          ],
          (rng) => {
            const [base, n] = rng.pick<[number, number]>([
              [rng.int(2, 10), 2],
              [rng.int(2, 5), 3],
              [rng.int(2, 3), rng.int(4, 5)],
              [1, rng.int(5, 20)],
            ]);
            const value = (-base) ** n;
            const odd = n % 2 === 1;
            const running = Array.from({ length: Math.min(n, 5) }, (_, i) => (-base) ** (i + 1));
            return valued(
              [`Evaluate $(-${base})^{${n}}$.`, `计算 $(-${base})^{${n}}$。`],
              value,
              [
                [
                  ["Find the size", "求大小"],
                  [`There are $${n}$ factors of $${base}$:`, `$${n}$ 个 $${base}$ 相乘：`],
                  [`${base}^{${n}} = ${base ** n}`],
                ],
                [
                  ["Choose the sign", "定符号"],
                  [
                    `There are $${n}$ negative factors, an ${odd ? "odd" : "even"} count, so the result is ${odd ? "negative" : "positive"}:`,
                    `共有 $${n}$ 个负因数，是${odd ? "奇" : "偶"}数个，所以结果为${odd ? "负" : "正"}：`,
                  ],
                  [`(-${base})^{${n}} = ${num(value)}`],
                ],
              ],
              n <= 5
                ? [
                    `Multiply one factor at a time: $${running.map(num).join(", ")}$.`,
                    `一个因数一个因数地乘：$${running.map(num).join(", ")}$。`,
                  ]
                : [
                    `The products of $(-1)$s go $-1, 1, -1, 1, \\dots$, negative after an odd count and positive after an even one, so after $${n}$ they give $${num(value)}$.`,
                    `$(-1)$ 连乘依次得到 $-1, 1, -1, 1, \\dots$，奇数个为负，偶数个为正，所以 $${n}$ 个相乘得 $${num(value)}$。`,
                  ],
              [
                [-value, `That has the wrong sign: $${n}$ is ${odd ? "odd" : "even"}.`, `符号错了：$${n}$ 是${odd ? "奇" : "偶"}数。`],
                [-base * n, "That multiplies the base by the exponent.", "这是拿底数乘指数了。"],
                [base * n, "That multiplies the base by the exponent and drops the sign.", "这是拿底数乘指数，还丢了符号。"],
              ],
            );
          },
          tableFigure(["(−2)^1", "(−2)^2", "(−2)^3", "(−2)^4"], [-2, 4, -8, 16]),
        ),
        keyPrerequisites: ["multiplying-integers"],
      },
      lesson(
        "negative-of-a-power",
        ["The opposite of a power", "乘方的相反数"],
        [
          [
            "An exponent applies only to what is right in front of it. In $-3^2$ there are no parentheses, so the exponent applies to $3$ alone and the minus sign comes afterwards: $-3^2 = -(3^2) = -9$. With parentheses, $(-3)^2 = 9$.",
            "指数只作用于紧挨在它前面的部分。$-3^2$ 没有括号，所以指数只作用于 $3$，负号最后才起作用：$-3^2 = -(3^2) = -9$。有括号时，$(-3)^2 = 9$。",
          ],
          [
            "$-3^2$ means $-(3 \\cdot 3) = -9$, and $(-3)^2$ means $(-3)(-3) = 9$.",
            "$-3^2$ 表示 $-(3 \\cdot 3) = -9$，$(-3)^2$ 表示 $(-3)(-3) = 9$。",
          ],
          [
            "Without parentheses the minus sign is not part of the base. $-3^2$ is $-9$, not $9$.",
            "没有括号时，负号不属于底数。$-3^2$ 是 $-9$，不是 $9$。",
          ],
        ],
        (rng) => {
          const [base, n] = rng.pick<[number, number]>([
            [rng.int(2, 12), 2],
            [rng.int(2, 5), 3],
            [rng.int(2, 3), 4],
          ]);
          const parens = rng.bool(0.3);
          const value = parens ? (-base) ** n : -(base ** n);
          const other = parens ? -(base ** n) : (-base) ** n;
          const expr = parens ? `(-${base})^{${n}}` : `-${base}^{${n}}`;
          const factors = Array(n).fill(parens ? `(-${base})` : `${base}`);
          return valued(
            [`Evaluate $${expr}$.`, `计算 $${expr}$。`],
            value,
            [
              [
                ["Find the base", "找底数"],
                parens
                  ? [`The parentheses make $-${base}$ the base.`, `有括号，底数是 $-${base}$。`]
                  : [
                      `There are no parentheses, so the base is $${base}$ and the minus sign comes last.`,
                      `没有括号，底数是 $${base}$，负号最后才起作用。`,
                    ],
              ],
              [
                ["Evaluate", "计算"],
                parens
                  ? ["Multiply the factors:", "把因数相乘："]
                  : ["Work out the power, then take the opposite:", "先算乘方，再取相反数："],
                [parens ? `${expr} = ${num(value)}` : `${expr} = -(${base}^{${n}}) = ${num(value)}`],
              ],
            ],
            [
              parens
                ? `Written out: $${factors.join("")} = ${num(value)}$.`
                : `Written out: $-(${factors.join(" \\cdot ")}) = ${num(value)}$.`,
              parens ? `展开写：$${factors.join("")} = ${num(value)}$。` : `展开写：$-(${factors.join(" \\cdot ")}) = ${num(value)}$。`,
            ],
            [
              [
                other,
                parens
                  ? `That reads it as $-${base}^{${n}}$; here the minus sign is inside the base.`
                  : `That reads it as $(-${base})^{${n}}$; without parentheses the minus sign is not part of the base.`,
                parens ? `这当成了 $-${base}^{${n}}$；这里负号在底数里。` : `这当成了 $(-${base})^{${n}}$；没有括号，负号不属于底数。`,
              ],
              [-base * n, "That multiplies the base by the exponent.", "这是拿底数乘指数了。"],
            ],
          );
        },
        tableFigure(["(−3)^2", "−3^2"], [9, -9]),
      ),
    ],
  },
  [
    "$(-2)^3$ means $(-2)(-2)(-2)$. The first two make $4$, and then $4 \\cdot (-2) = -8$.",
    "$(-2)^3$ 表示 $(-2)(-2)(-2)$。前两个相乘得 $4$，再 $4 \\cdot (-2) = -8$。",
  ],
  ["Three negative factors is an odd count, so the result is negative, and $2^3 = 8$.", "三个负因数是奇数个，所以结果为负；$2^3 = 8$。"],
  ["find powers of negative numbers and tell $(-a)^n$ from $-a^n$.", "学习求负数的乘方，并区分 $(-a)^n$ 与 $-a^n$。"],
);

/** thePowerOfAPowerOfANegative compares a power of a negative with the opposite of a power. */
export const thePowerOfAPowerOfANegative = lesson(
  "the-power-of-a-power-of-a-negative",
  ["Comparing powers of negatives", "比较负数的幂"],
  [
    [
      "With parentheses the sign is multiplied too; without them the power comes first and the minus sign last. So $(-a)^n$ and $-a^n$ are equal when $n$ is odd and opposite when $n$ is even. $(-2)^4 = 16$ but $-2^4 = -16$, while $(-2)^3 = -2^3 = -8$.",
      "有括号时，符号也参与相乘；没有括号时，先乘方，最后才取负。所以 $n$ 为奇数时 $(-a)^n$ 与 $-a^n$ 相等，$n$ 为偶数时互为相反数。$(-2)^4 = 16$，而 $-2^4 = -16$；$(-2)^3 = -2^3 = -8$。",
    ],
    [
      "$(-2)^4 = (-2)(-2)(-2)(-2) = 16$ and $-2^4 = -(2 \\cdot 2 \\cdot 2 \\cdot 2) = -16$.",
      "$(-2)^4 = (-2)(-2)(-2)(-2) = 16$，$-2^4 = -(2 \\cdot 2 \\cdot 2 \\cdot 2) = -16$。",
    ],
    [
      "Work out each power fully before subtracting, and keep its sign. Subtracting a negative value adds its size.",
      "相减之前，先把每个乘方算完，保留符号。减去负数等于加上它的大小。",
    ],
  ],
  (rng) => {
    const a = rng.int(2, 12);
    const n = rng.pick([2, 3, 4, 5]);
    const first = (-a) ** n;
    const second = -(a ** n);
    const odd = n % 2 === 1;
    const answer = first - second;
    return valued(
      [`Evaluate $(-${a})^{${n}} - (-${a}^{${n}})$.`, `计算 $(-${a})^{${n}} - (-${a}^{${n}})$。`],
      answer,
      [
        [
          ["Evaluate each power", "分别计算乘方"],
          [
            `With parentheses the base is $-${a}$; without them the minus sign comes last:`,
            `有括号时底数是 $-${a}$；没有括号时负号最后才起作用：`,
          ],
          [`(-${a})^{${n}} = ${num(first)}`, `-${a}^{${n}} = ${num(second)}`],
        ],
        [["Subtract", "相减"], ["Keep both signs:", "保留两个符号："], [`${num(first)} - ${paren(second)} = ${num(answer)}`]],
      ],
      odd
        ? [`$${n}$ is odd, so the two powers are equal and their difference is $0$.`, `$${n}$ 是奇数，两个乘方相等，差是 $0$。`]
        : [
            `$${n}$ is even, so the two powers are opposites, and the difference is $2 \\cdot ${a ** n} = ${answer}$.`,
            `$${n}$ 是偶数，两个乘方互为相反数，差是 $2 \\cdot ${a ** n} = ${answer}$。`,
          ],
      [
        [first + second, "That adds the two values instead of subtracting.", "这是把两个值相加了，而不是相减。"],
        [second - first, "That subtracts in the wrong order.", "这是倒过来相减了。"],
        odd
          ? [
              2 * a ** n,
              "That takes $(-a)^n$ as positive, but an odd power of a negative number is negative.",
              "这把 $(-a)^n$ 当成了正数，但负数的奇次幂是负数。",
            ]
          : [
              0,
              "That treats $-a^n$ as $(-a)^n$; without parentheses the minus sign comes after the power.",
              "这把 $-a^n$ 当成了 $(-a)^n$；没有括号时，负号在乘方之后才起作用。",
            ],
      ],
    );
  },
  tableFigure(["(−2)^3", "−2^3", "(−2)^4", "−2^4"], [-8, -8, 16, -16]),
);

/** orderOfOperationsWithIntegers teaches the order of operations with negative numbers. */
export const orderOfOperationsWithIntegers: TopicDef = withIntro(
  {
    id: "order-of-operations-with-integers",
    title: t("Order of Operations with Integers", "整数的混合运算"),
    summary: t("Evaluate expressions with integers using the order of operations.", "按运算顺序计算含整数的式子。"),
    prerequisites: ["subtracting-integers", "dividing-integers", "powers-of-integers"],
    encompasses: [
      { topic: "subtracting-integers", weight: 0.5 },
      { topic: "dividing-integers", weight: 0.5 },
      { topic: "powers-of-integers", weight: 0.5 },
    ],
    xp: 15,
    standards: ["CCSS.7.NS.A.3"],
    knowledgePoints: [
      {
        ...lesson(
          "without-exponents",
          ["Multiplication before addition", "先乘除后加减"],
          [
            [
              "Work inside parentheses first, then exponents, then multiplication and division from left to right, and last addition and subtraction from left to right. So $5 - 3 \\cdot (-2) = 5 - (-6) = 11$, but $(5 - 3) \\cdot (-2) = 2 \\cdot (-2) = -4$.",
              "先算括号里面，再算乘方，然后从左到右算乘除，最后从左到右算加减。所以 $5 - 3 \\cdot (-2) = 5 - (-6) = 11$，而 $(5 - 3) \\cdot (-2) = 2 \\cdot (-2) = -4$。",
            ],
            ["Subtracting $3 \\cdot (-2)$ is adding $6$: $5 + 6 = 11$.", "减去 $3 \\cdot (-2)$ 就是加上 $6$：$5 + 6 = 11$。"],
            [
              "Do not work from left to right when a multiplication comes later. In $5 - 3 \\cdot (-2)$, the $3 \\cdot (-2)$ goes first.",
              "后面有乘法时，不能直接从左往右算。$5 - 3 \\cdot (-2)$ 要先算 $3 \\cdot (-2)$。",
            ],
          ],
          (rng) => {
            const a = rng.nonZero(-20, 20);
            const b = rng.nonZero(-9, 9);
            const c = rng.nonZero(-9, 9);
            switch (rng.int(0, 2)) {
              case 0: {
                const v = a - b * c;
                return valued(
                  [`Evaluate $${num(a)} - ${paren(b)} \\cdot ${paren(c)}$.`, `计算 $${num(a)} - ${paren(b)} \\cdot ${paren(c)}$。`],
                  v,
                  [
                    [
                      ["Multiply first", "先算乘法"],
                      ["Multiplication comes before subtraction:", "乘法在减法之前："],
                      [`${paren(b)} \\cdot ${paren(c)} = ${num(b * c)}`],
                    ],
                    [["Subtract", "相减"], ["Subtract the product:", "减去这个积："], [`${num(a)} - ${paren(b * c)} = ${num(v)}`]],
                  ],
                  [
                    `Subtracting $${num(b * c)}$ is adding $${num(-b * c)}$: $${num(a)} + ${paren(-b * c)} = ${num(v)}$.`,
                    `减去 $${num(b * c)}$ 就是加上 $${num(-b * c)}$：$${num(a)} + ${paren(-b * c)} = ${num(v)}$。`,
                  ],
                  [
                    [(a - b) * c, "That subtracts before multiplying.", "这是先减后乘了。"],
                    [a + b * c, "That adds the product instead of subtracting it.", "这是加上了积，而不是减去。"],
                  ],
                );
              }
              case 1: {
                const v = (a - b) * c;
                return valued(
                  [`Evaluate $(${num(a)} - ${paren(b)}) \\cdot ${paren(c)}$.`, `计算 $(${num(a)} - ${paren(b)}) \\cdot ${paren(c)}$。`],
                  v,
                  [
                    [
                      ["Parentheses first", "先算括号"],
                      ["Work out the subtraction inside:", "先算括号里的减法："],
                      [`${num(a)} - ${paren(b)} = ${num(a - b)}`],
                    ],
                    [["Multiply", "相乘"], ["Then multiply:", "再相乘："], [`${paren(a - b)} \\cdot ${paren(c)} = ${num(v)}`]],
                  ],
                  [
                    `Multiply each part: $${paren(a)} \\cdot ${paren(c)} - ${paren(b)} \\cdot ${paren(c)} = ${num(a * c)} - ${paren(b * c)} = ${num(v)}$.`,
                    `每部分分别相乘：$${paren(a)} \\cdot ${paren(c)} - ${paren(b)} \\cdot ${paren(c)} = ${num(a * c)} - ${paren(b * c)} = ${num(v)}$。`,
                  ],
                  [
                    [a - b * c, "That ignores the parentheses and multiplies first.", "这忽略了括号，先算了乘法。"],
                    [(a + b) * c, "That adds inside the parentheses instead of subtracting.", "这在括号里做了加法，而不是减法。"],
                  ],
                );
              }
              default: {
                const d = rng.nonZero(-20, 20);
                const v = a - b + d;
                return valued(
                  [`Evaluate $${num(a)} - ${paren(b)} + ${paren(d)}$.`, `计算 $${num(a)} - ${paren(b)} + ${paren(d)}$。`],
                  v,
                  [
                    [["Subtract first", "先算减法"], ["Go from left to right:", "从左到右："], [`${num(a)} - ${paren(b)} = ${num(a - b)}`]],
                    [["Add", "再加"], ["Then add the last number:", "再加上最后一个数："], [`${num(a - b)} + ${paren(d)} = ${num(v)}`]],
                  ],
                  [
                    `Add the opposite of $${num(b)}$ and $${num(d)}$ to $${num(a)}$ together: $${num(a)} + ${paren(d - b)} = ${num(v)}$.`,
                    `把 $${num(b)}$ 的相反数和 $${num(d)}$ 一起加到 $${num(a)}$ 上：$${num(a)} + ${paren(d - b)} = ${num(v)}$。`,
                  ],
                  [
                    [
                      a - (b + d),
                      "That adds the last two first, as if they were in parentheses.",
                      "这先把后两个数加起来了，好像它们在括号里一样。",
                    ],
                    [a + b + d, "That adds the second number instead of subtracting it.", "这把第二个数加上了，而不是减去。"],
                  ],
                );
              }
            }
          },
          tableFigure(["3·(−2)", "5−(−6)"], [-6, 11]),
        ),
        keyPrerequisites: ["subtracting-integers", "multiplying-integers"],
      },
      {
        ...lesson(
          "with-exponents-and-division",
          ["Exponents and division", "含乘方与除法的运算"],
          [
            [
              "Negative numbers do not change the order of operations: exponents first, then multiplication and division, then addition and subtraction. $-7 + (-2)^3 \\div 4 = -7 + (-8) \\div 4 = -7 + (-2) = -9$.",
              "有负数时运算顺序不变：先乘方，再乘除，最后加减。$-7 + (-2)^3 \\div 4 = -7 + (-8) \\div 4 = -7 + (-2) = -9$。",
            ],
            ["Undo the last step: $-9 - (-2) = -7$.", "倒回最后一步：$-9 - (-2) = -7$。"],
            [
              "A square is never negative. $(-3)^2$ is $9$, so $5 - (-3)^2$ is $5 - 9 = -4$.",
              "平方不会是负数。$(-3)^2$ 是 $9$，所以 $5 - (-3)^2$ 是 $5 - 9 = -4$。",
            ],
          ],
          (rng) => {
            const a = rng.nonZero(-20, 20);
            if (rng.bool()) {
              const b = rng.nonZero(-6, 6);
              const v = a - b * b;
              return valued(
                [`Evaluate $${num(a)} - ${paren(b)}^{2}$.`, `计算 $${num(a)} - ${paren(b)}^{2}$。`],
                v,
                [
                  [["Exponent first", "先算乘方"], ["A square is never negative:", "平方不会是负数："], [`${paren(b)}^{2} = ${b * b}`]],
                  [["Subtract", "相减"], ["Then subtract:", "再相减："], [`${num(a)} - ${b * b} = ${num(v)}`]],
                ],
                [`Add the square back: $${num(v)} + ${b * b} = ${num(a)}$.`, `把平方加回去：$${num(v)} + ${b * b} = ${num(a)}$。`],
                [
                  [(a - b) ** 2, "That subtracts before squaring.", "这是先减后乘方了。"],
                  [a + b * b, "That takes the square as negative, so it adds it.", "这把平方当成了负数，结果加上了它。"],
                  [a - 2 * abs(b), "That doubles the number instead of squaring it.", "这是乘 2，而不是平方。"],
                ],
              );
            }
            const c = rng.nonZero(-6, 6);
            const qt = rng.nonZero(-9, 9);
            const b = c * qt;
            const v = a + qt;
            return valued(
              [`Evaluate $${num(a)} + ${paren(b)} \\div ${paren(c)}$.`, `计算 $${num(a)} + ${paren(b)} \\div ${paren(c)}$。`],
              v,
              [
                [
                  ["Divide first", "先算除法"],
                  ["Division comes before addition:", "除法在加法之前："],
                  [`${paren(b)} \\div ${paren(c)} = ${num(qt)}`],
                ],
                [["Add", "相加"], ["Then add:", "再相加："], [`${num(a)} + ${paren(qt)} = ${num(v)}`]],
              ],
              [
                `$${num(v)} - ${paren(a)} = ${num(qt)}$, and $${num(qt)} \\cdot ${paren(c)} = ${num(b)}$.`,
                `$${num(v)} - ${paren(a)} = ${num(qt)}$，$${num(qt)} \\cdot ${paren(c)} = ${num(b)}$。`,
              ],
              [
                [a - qt, "That has the wrong sign for the quotient.", "商的符号错了。"],
                ...((a + b) % c === 0 ? [[(a + b) / c, "That adds before dividing.", "这是先加后除了。"] as const] : []),
              ],
            );
          },
          tableFigure(["(−2)^3", "−8÷4", "−7+(−2)"], [-8, -2, -9]),
        ),
        keyPrerequisites: ["powers-of-integers", "dividing-integers"],
      },
    ],
  },
  [
    "To work out $5 - 3 \\cdot (-2)$, multiply first: $3 \\cdot (-2) = -6$. Then $5 - (-6) = 11$.",
    "计算 $5 - 3 \\cdot (-2)$ 时，先算乘法：$3 \\cdot (-2) = -6$。再算 $5 - (-6) = 11$。",
  ],
  ["Subtracting $-6$ is adding $6$, and $5 + 6 = 11$.", "减去 $-6$ 就是加上 $6$，$5 + 6 = 11$。"],
  [
    "use the order of operations with negative numbers, exponents, division and fraction bars.",
    "学习在有负数、乘方、除法和分数线时按运算顺序计算。",
  ],
);

/** aFractionBarGroups evaluates a fraction whose top and bottom must each be worked out first. */
export const aFractionBarGroups = lesson(
  "a-fraction-bar-groups",
  ["A fraction bar groups", "分数线有分组作用"],
  [
    [
      "A fraction bar acts like parentheses around the top and around the bottom. Work each part out fully, keeping its sign, and divide last. $\\dfrac{20 - 4}{3^2 - 1} = \\dfrac{16}{8} = 2$.",
      "分数线相当于给分子和分母各加了括号。先把每部分算完，保留符号，最后才相除。$\\dfrac{20 - 4}{3^2 - 1} = \\dfrac{16}{8} = 2$。",
    ],
    ["$2 \\cdot 8 = 16$, which is the top.", "$2 \\cdot 8 = 16$，正好是分子。"],
    [
      "Do not divide one number on top by one on the bottom. Finish the top and the bottom first.",
      "不能拿分子里的一个数去除分母里的一个数。要先把分子和分母都算完。",
    ],
  ],
  (rng) => {
    const q = rng.nonZero(-9, 9);
    const a = rng.int(3, 5);
    const b = rng.nonZero(-6, 6);
    const d = a * a + b;
    const c = rng.int(1, 20);
    const top = q * d + c;
    const expr = `\\dfrac{${top} - ${c}}{${a}^{2}${b < 0 ? ` - ${-b}` : ` + ${b}`}}`;
    return valued(
      [`Evaluate $${expr}$.`, `计算 $${expr}$。`],
      q,
      [
        [
          ["Work out the top and bottom", "算出分子和分母"],
          ["The bar groups each part:", "分数线把每部分分成一组："],
          [`${top} - ${c} = ${q * d}`, `${a}^{2}${b < 0 ? ` - ${-b}` : ` + ${b}`} = ${a * a}${b < 0 ? ` - ${-b}` : ` + ${b}`} = ${d}`],
        ],
        [["Divide", "相除"], ["Divide the top by the bottom:", "用分子除以分母："], [`${q * d} \\div ${d} = ${num(q)}`]],
      ],
      [`Multiply back: $${num(q)} \\cdot ${d} = ${q * d}$, which is the top.`, `乘回去：$${num(q)} \\cdot ${d} = ${q * d}$，正好是分子。`],
      [
        [-q, "That has the wrong sign.", "符号错了。"],
        [q * d, "That is only the top; it still has to be divided.", "这只是分子，还要相除。"],
        [d, "That is only the bottom.", "这只是分母。"],
      ],
    );
  },
  tableFigure(["20−4", "3^2−1", "16÷8"], [16, 8, 2]),
);
/** integerTopics are the topics of the integers unit, in teaching order. */
export const integerTopics: readonly TopicDef[] = [
  integersAndOpposites,
  absoluteValue,
  addingIntegers,
  subtractingIntegers,
  multiplyingIntegers,
  dividingIntegers,
  powersOfIntegers,
  orderOfOperationsWithIntegers,
];

/** integersBetweenANegativeAndAPositive counts the integers strictly between a negative and a positive number. */
export const integersBetweenANegativeAndAPositive = point(
  "counting-integers-between-a-negative-and-a-positive",
  ["Counting integers between a negative and a positive", "数一个负数和一个正数之间的整数"],
  [
    "Between $-3$ and 2 lie $-2, -1, 0, 1$, which is 4 integers. The distance is $3 + 2 = 5$, and there is one fewer integer inside.\n\nCheck: count them on the number line: $-2, -1, 0, 1$.\n\n> **Watch out.** Do not count the two ends. 5 is one too many.",
    "$-3$ 和 2 之间有 $-2, -1, 0, 1$，共 4 个整数。两端的距离是 $3 + 2 = 5$，中间的整数比它少 1 个。\n\n检验：在数轴上数一数：$-2, -1, 0, 1$。\n\n> **注意。** 两端的数不算。5 多算了一个。",
  ],
  (rng) => {
    const a = rng.int(2, 12);
    const b = rng.int(2, 12);
    const answer = a + b - 1;
    return answered(
      [`How many integers lie strictly between $-${a}$ and ${b}?`, `严格在 $-${a}$ 和 ${b} 之间的整数有多少个？`],
      answer,
      [
        [
          ["Find the distance", "求距离"],
          [`From $-${a}$ to 0 is ${a}, and from 0 to ${b} is ${b}.`, `从 $-${a}$ 到 0 是 ${a}，从 0 到 ${b} 是 ${b}。`],
          [`${a} + ${b} = ${a + b}`],
        ],
        [
          ["Leave out the ends", "去掉两端"],
          ["The integers inside are one fewer than the steps.", "中间的整数比格数少 1。"],
          [`${a + b} - 1 = ${answer}`],
        ],
      ],
      [
        `Count by sides: ${a - 1} on the negative side, ${b - 1} on the positive side, and 0. That makes $${a - 1} + ${b - 1} + 1 = ${answer}$.`,
        `分两边数：负数一侧 ${a - 1} 个，正数一侧 ${b - 1} 个，再加上 0。一共 $${a - 1} + ${b - 1} + 1 = ${answer}$ 个。`,
      ],
      [
        [a + b, "That is the distance. It counts one end too.", "这是两端的距离，多算了一端。"],
        [a + b + 1, "That counts both ends.", "这是把两端都算进去了。"],
        [Math.abs(a - b), "That subtracts the numbers instead of adding the distances.", "这是把两个数相减了，应该把两段距离相加。"],
      ],
      { figure: intLine(-a, b, [-a, b]) },
    );
  },
  intLine(-4, 3, [-3, 2]),
);

/** countingIntegersWithASmallAbsoluteValue counts the integers whose distance from 0 is less than, or at most, a number. */
export const countingIntegersWithASmallAbsoluteValue = point(
  "counting-integers-with-small-absolute-value",
  ["Counting integers with a small absolute value", "数绝对值较小的整数"],
  [
    "The integers with absolute value less than 3 are $-2, -1, 0, 1, 2$. That is $2 \\times 2 + 1 = 5$.\n\nCheck: count them on the number line, from $-2$ to 2.\n\n> **Watch out.** Do not forget 0. Its absolute value is 0.",
    "绝对值小于 3 的整数有 $-2, -1, 0, 1, 2$，共 $2 \\times 2 + 1 = 5$ 个。\n\n检验：在数轴上从 $-2$ 数到 2。\n\n> **注意。** 不要忘了 0，它的绝对值是 0。",
  ],
  (rng) => {
    const n = rng.int(2, 15);
    const inclusive = rng.bool();
    const k = inclusive ? n : n - 1;
    const answer = 2 * k + 1;
    return answered(
      [
        `How many integers have an absolute value ${inclusive ? "of at most" : "less than"} ${n}?`,
        `有多少个整数的绝对值${inclusive ? "不超过" : "小于"} ${n}？`,
      ],
      answer,
      [
        [
          ["Count one side", "数一边"],
          [`On the positive side they are 1 to ${k}: ${k} of them.`, `正数一侧是 1 到 ${k}，共 ${k} 个。`],
        ],
        [["Double it", "乘 2"], ["The negative side has just as many.", "负数一侧也有这么多。"], [`2 \\times ${k} = ${2 * k}`]],
        [["Add 0", "加上 0"], ["0 is one of them too.", "0 也在其中。"], [`${2 * k} + 1 = ${answer}`]],
      ],
      [`Count from $${num(-k)}$ to ${k}: $${k} + 1 + ${k} = ${answer}$.`, `从 $${num(-k)}$ 数到 ${k}：$${k} + 1 + ${k} = ${answer}$。`],
      [
        [2 * k, "That forgets 0.", "这里忘了 0。"],
        [k, "That counts only the positive side.", "这只数了正数一侧。"],
        inclusive
          ? [2 * n - 1, `That leaves out $-${n}$ and ${n}, but "at most" includes them.`, `这里漏掉了 $-${n}$ 和 ${n}，“不超过”包括它们。`]
          : [2 * n + 1, `That counts $-${n}$ and ${n}, but "less than" leaves them out.`, `这里算上了 $-${n}$ 和 ${n}，“小于”不包括它们。`],
      ],
      { figure: intLine(-n - 1, n + 1, [-k, k]) },
    );
  },
  intLine(-4, 4, [-2, 2]),
);
