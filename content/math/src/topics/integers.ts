import type { Figure, TopicDef } from "@ga/content";
import { t, tierRange } from "@ga/content";
import { num, paren } from "@ga/subject-math";
import { remainingDrawings4 } from "../explanation-drawings-remaining-4.ts";
import { numberProblem, steps, why } from "../problems.ts";
import { compared, type Pair, type Walk, walkThrough } from "./early-grades-more-kit.ts";
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

export const addingIntegers: TopicDef = {
  id: "adding-integers",
  title: t("Adding Integers", "整数加法"),
  summary: t("Add integers with the same sign and with different signs.", "同号整数相加与异号整数相加。"),
  prerequisites: ["absolute-value"],
  encompasses: [{ topic: "absolute-value", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.7.NS.A.1"],
  knowledgePoints: [
    {
      id: "same-signs",
      title: t("Adding integers with the same sign", "同号整数相加"),
      figure: remainingDrawings4["adding-integers#same-signs"],
      explanation: t(
        "To add two integers with the **same sign**, add their absolute values and keep the common sign. For example, $(-6) + (-9)$: the absolute values add to $6 + 9 = 15$, and both numbers are negative, so the sum is $-15$.\n\nOn the number line: starting at $-6$ and moving $9$ more units to the left lands on $-15$.",
        "**同号**两数相加，把它们的绝对值相加，并保留共同的符号。例如 $(-6) + (-9)$：绝对值之和为 $6 + 9 = 15$，两个数都是负数，所以和为 $-15$。\n\n在数轴上看：从 $-6$ 出发再向左移动 $9$ 个单位，到达 $-15$。",
      ),
      keyPrerequisites: ["absolute-value"],
      tiered: true,
      generate(rng, difficulty) {
        const [lo, hi] = tierRange(difficulty, 2, 60);
        const s = rng.bool(0.8) ? -1 : 1;
        const a = s * rng.int(lo, hi);
        const b = s * rng.int(lo, hi);
        const sum = a + b;
        return numberProblem({
          prompt: t(`Evaluate $${num(a)} + ${paren(b)}$.`, `计算 $${num(a)} + ${paren(b)}$。`),
          answer: sum,
          wrong: [-sum],
          mistakes: [
            why(
              a - b,
              "You subtracted. Numbers of the same sign add up in the same direction, so the sizes add.",
              "你做了减法。同号的数朝同一方向累加，所以大小要相加。",
            ),
          ],
          solution: t(
            `Both numbers are ${s < 0 ? "negative" : "positive"}. Add the absolute values, $${abs(a)} + ${abs(b)} = ${abs(sum)}$, and keep the sign: $${num(a)} + ${paren(b)} = ${num(sum)}$.`,
            `两个数都是${s < 0 ? "负数" : "正数"}。把绝对值相加：$${abs(a)} + ${abs(b)} = ${abs(sum)}$，并保留符号：$${num(a)} + ${paren(b)} = ${num(sum)}$。`,
          ),
        });
      },
    },
    {
      id: "different-signs",
      title: t("Adding integers with different signs", "异号整数相加"),
      figure: remainingDrawings4["adding-integers#different-signs"],
      explanation: t(
        "To add two integers with **different signs**, subtract the smaller absolute value from the larger one, and give the result the sign of the number with the larger absolute value. For example, $(-11) + 4$: $11 - 4 = 7$, and $-11$ has the larger absolute value, so the sum is $-7$.\n\nOn the number line: starting at $-11$ and moving $4$ units to the right lands on $-7$. A number plus its opposite is $0$.",
        "**异号**两数相加，用较大的绝对值减去较小的绝对值，结果取绝对值较大的那个数的符号。例如 $(-11) + 4$：$11 - 4 = 7$，$-11$ 的绝对值较大，所以和为 $-7$。\n\n在数轴上看：从 $-11$ 出发向右移动 $4$ 个单位，到达 $-7$。一个数与它的相反数相加得 $0$。",
      ),
      keyPrerequisites: ["absolute-value"],
      tiered: true,
      generate(rng, difficulty) {
        const [lo, hi] = tierRange(difficulty, 1, 60);
        let a = rng.int(lo, hi);
        let b = rng.int(lo, hi);
        while (a === b) b = rng.int(lo, hi);
        if (rng.bool()) a = -a;
        else b = -b;
        const sum = a + b;
        const [big, small] = abs(a) > abs(b) ? [a, b] : [b, a];
        return numberProblem({
          prompt: t(`Evaluate $${num(a)} + ${paren(b)}$.`, `计算 $${num(a)} + ${paren(b)}$。`),
          answer: sum,
          wrong: [-sum],
          mistakes: [
            why(
              abs(a) + abs(b),
              "You added the sizes. Numbers of opposite signs pull in opposite directions, so the sizes partly cancel.",
              "你把大小相加了。异号的数方向相反，大小会部分抵消。",
            ),
            why(
              -(abs(a) + abs(b)),
              "You added the sizes. Numbers of opposite signs pull in opposite directions, so the sizes partly cancel.",
              "你把大小相加了。异号的数方向相反，大小会部分抵消。",
            ),
          ],
          solution: t(
            `The signs differ. Subtract the absolute values: $${abs(big)} - ${abs(small)} = ${abs(sum)}$. The number with the larger absolute value, $${num(big)}$, is ${big < 0 ? "negative" : "positive"}, so $${num(a)} + ${paren(b)} = ${num(sum)}$.`,
            `两数异号。绝对值相减：$${abs(big)} - ${abs(small)} = ${abs(sum)}$。绝对值较大的数 $${num(big)}$ 是${big < 0 ? "负数" : "正数"}，所以 $${num(a)} + ${paren(b)} = ${num(sum)}$。`,
          ),
        });
      },
    },
  ],
};

export const subtractingIntegers: TopicDef = {
  id: "subtracting-integers",
  title: t("Subtracting Integers", "整数减法"),
  summary: t("Subtract integers by adding the opposite.", "把减法化为加上相反数来计算整数减法。"),
  prerequisites: ["adding-integers"],
  encompasses: [{ topic: "adding-integers", weight: 1 }],
  xp: 12,
  standards: ["CCSS.7.NS.A.1.C"],
  knowledgePoints: [
    {
      id: "subtracting-a-positive",
      title: t("Subtracting a positive integer", "减去正整数"),
      figure: remainingDrawings4["subtracting-integers#subtracting-a-positive"],
      explanation: t(
        "On the number line, subtracting a positive number moves left. Rewriting the subtraction as adding the opposite lets you use the rules for adding integers.\n\nSubtracting a number is the same as adding its opposite: $a - b = a + (-b)$. For example, $3 - 8 = 3 + (-8) = -5$, and $-4 - 6 = -4 + (-6) = -10$.",
        "在数轴上，减去一个正数就是向左移动。把减法改写成加上相反数，就可以用整数加法的法则来计算。\n\n减去一个数，等于加上这个数的相反数：$a - b = a + (-b)$。例如 $3 - 8 = 3 + (-8) = -5$，$-4 - 6 = -4 + (-6) = -10$。",
      ),
      keyPrerequisites: ["adding-integers"],
      tiered: true,
      generate(rng, difficulty) {
        const [lo, hi] = tierRange(difficulty, 2, 50);
        const b = rng.int(lo, hi);
        const a = rng.bool(0.5) ? rng.int(0, b - 1) : -rng.int(1, hi);
        const d = a - b;
        return numberProblem({
          prompt: t(`Evaluate $${num(a)} - ${b}$.`, `计算 $${num(a)} - ${b}$。`),
          answer: d,
          wrong: [b - a, -(a + b)],
          mistakes: [
            why(
              a + b,
              "You added. Subtracting a positive number moves down the number line.",
              "你做了加法。减去一个正数是在数轴上向左移动。",
            ),
          ],
          solution: t(
            `Add the opposite: ${steps(`${num(a)} - ${b} = ${num(a)} + (-${b}) = ${num(d)}`)}`,
            `加上相反数：${steps(`${num(a)} - ${b} = ${num(a)} + (-${b}) = ${num(d)}`)}`,
          ),
        });
      },
    },
    {
      id: "subtracting-a-negative",
      title: t("Subtracting a negative integer", "减去负整数"),
      figure: remainingDrawings4["subtracting-integers#subtracting-a-negative"],
      explanation: t(
        "Taking away a negative amount, such as removing a debt, makes the total larger. That is why subtracting a negative number moves right on the number line.\n\nTo subtract a negative number, add its opposite, which is positive: $a - (-b) = a + b$. For example, $-9 - (-4) = -9 + 4 = -5$.",
        "拿走一个负的量，比如免除一笔欠款，会使总量变大。所以减去一个负数在数轴上是向右移动。\n\n减去一个负数，等于加上它的相反数（一个正数）：$a - (-b) = a + b$。例如 $-9 - (-4) = -9 + 4 = -5$。",
      ),
      keyPrerequisites: ["adding-integers"],
      tiered: true,
      generate(rng, difficulty) {
        const [lo, hi] = tierRange(difficulty, 2, 50);
        const a = rng.nonZero(-hi, hi);
        const b = rng.int(lo, hi);
        const d = a + b;
        return numberProblem({
          prompt: t(`Evaluate $${num(a)} - (-${b})$.`, `计算 $${num(a)} - (-${b})$。`),
          answer: d,
          wrong: [-a - b, -d],
          mistakes: [
            why(
              a - b,
              "You left the two minus signs as one subtraction. Subtracting a negative number is the same as adding its opposite.",
              "你把两个负号当成了一次减法。减去一个负数等于加上它的相反数。",
            ),
          ],
          solution: t(
            `Add the opposite of $-${b}$, which is $${b}$: ${steps(`${num(a)} - (-${b}) = ${num(a)} + ${b} = ${num(d)}`)}`,
            `加上 $-${b}$ 的相反数 $${b}$：${steps(`${num(a)} - (-${b}) = ${num(a)} + ${b} = ${num(d)}`)}`,
          ),
        });
      },
    },
  ],
};

export const multiplyingIntegers: TopicDef = {
  id: "multiplying-integers",
  title: t("Multiplying Integers", "整数乘法"),
  summary: t("Multiply integers using the sign rules.", "运用符号法则做整数乘法。"),
  prerequisites: ["integers-and-opposites"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.7.NS.A.2"],
  knowledgePoints: [
    {
      id: "two-factors",
      title: t("Multiplying two integers", "两个整数相乘"),
      explanation: t(
        "Multiply the absolute values, then decide the sign:\n\n- same signs give a **positive** product: $(-3)(-5) = 15$;\n- different signs give a **negative** product: $(-3) \\cdot 5 = -15$.\n\nAny number times $0$ is $0$.",
        "先把绝对值相乘，再确定符号：\n\n- 同号相乘得**正数**：$(-3)(-5) = 15$；\n- 异号相乘得**负数**：$(-3) \\cdot 5 = -15$。\n\n任何数乘以 $0$ 都得 $0$。",
      ),
      generate(rng) {
        let a = rng.nonZero(-12, 12);
        const b = rng.nonZero(-12, 12);
        if (a > 0 && b > 0) a = -a;
        const p = a * b;
        const same = a < 0 === b < 0;
        return numberProblem({
          prompt: t(`Evaluate $${num(a)} \\cdot ${paren(b)}$.`, `计算 $${num(a)} \\cdot ${paren(b)}$。`),
          answer: p,
          wrong: [-p],
          mistakes: [why(a + b, "You added the numbers. Here they are multiplied.", "你把两个数相加了。这里要相乘。")],
          solution: t(
            `$${abs(a)} \\cdot ${abs(b)} = ${abs(p)}$, and the signs are ${same ? "the same, so the product is positive" : "different, so the product is negative"}: $${num(a)} \\cdot ${paren(b)} = ${num(p)}$.`,
            `$${abs(a)} \\cdot ${abs(b)} = ${abs(p)}$，两数${same ? "同号，所以积为正" : "异号，所以积为负"}：$${num(a)} \\cdot ${paren(b)} = ${num(p)}$。`,
          ),
        });
      },
    },
    {
      id: "several-factors",
      title: t("Multiplying several integers", "多个整数相乘"),
      explanation: t(
        "When several nonzero numbers are multiplied, count the negative factors: an **even** number of negative factors gives a positive product, an **odd** number gives a negative product. For example, $(-2)(-3)(-4)$ has three negative factors, so it equals $-24$.",
        "多个非零数相乘时，数一数负因数的个数：负因数有**偶数**个，积为正；有**奇数**个，积为负。例如 $(-2)(-3)(-4)$ 有三个负因数，所以等于 $-24$。",
      ),
      generate(rng) {
        const fs = [rng.nonZero(-9, 9), rng.nonZero(-9, 9), rng.nonZero(-6, 6)];
        if (fs.every((f) => f > 0)) fs[rng.int(0, 2)]! *= -1;
        const p = fs.reduce((x, y) => x * y, 1);
        const negatives = fs.filter((f) => f < 0).length;
        const expr = fs.map(paren).join(" \\cdot ");
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: p,
          wrong: [-p],
          solution: t(
            `$${fs.map(abs).join(" \\cdot ")} = ${abs(p)}$. There ${negatives === 1 ? "is 1 negative factor" : `are ${negatives} negative factors`}, an ${negatives % 2 ? "odd" : "even"} number, so the product is $${num(p)}$.`,
            `$${fs.map(abs).join(" \\cdot ")} = ${abs(p)}$。负因数有 ${negatives} 个，是${negatives % 2 ? "奇" : "偶"}数个，所以积为 $${num(p)}$。`,
          ),
        });
      },
    },
  ],
};

export const dividingIntegers: TopicDef = {
  id: "dividing-integers",
  title: t("Dividing Integers", "整数除法"),
  summary: t("Divide integers using the sign rules.", "运用符号法则做整数除法。"),
  prerequisites: ["multiplying-integers"],
  encompasses: [{ topic: "multiplying-integers", weight: 0.5 }],
  xp: 10,
  standards: ["CCSS.7.NS.A.2.B"],
  knowledgePoints: [
    {
      id: "division-sign",
      title: t("Dividing integers", "两个整数相除"),
      explanation: t(
        "Division follows the same sign rules as multiplication, because $a \\div b = c$ exactly when $b \\cdot c = a$:\n\n- same signs give a positive quotient: $(-24) \\div (-6) = 4$;\n- different signs give a negative quotient: $24 \\div (-6) = -4$.\n\nDivision by $0$ is undefined.",
        "除法的符号法则与乘法相同，因为 $a \\div b = c$ 当且仅当 $b \\cdot c = a$：\n\n- 同号相除得正数：$(-24) \\div (-6) = 4$；\n- 异号相除得负数：$24 \\div (-6) = -4$。\n\n除以 $0$ 没有意义。",
      ),
      keyPrerequisites: ["multiplying-integers"],
      generate(rng) {
        const b = rng.nonZero(-12, 12);
        let c = rng.nonZero(-12, 12);
        if (b > 0 && c > 0) c = -c;
        const a = b * c;
        return numberProblem({
          prompt: t(`Evaluate $${num(a)} \\div ${paren(b)}$.`, `计算 $${num(a)} \\div ${paren(b)}$。`),
          answer: c,
          wrong: [-c],
          solution: t(
            `$${abs(a)} \\div ${abs(b)} = ${abs(c)}$, and the signs are ${a < 0 === b < 0 ? "the same, so the quotient is positive" : "different, so the quotient is negative"}: $${num(a)} \\div ${paren(b)} = ${num(c)}$.`,
            `$${abs(a)} \\div ${abs(b)} = ${abs(c)}$，两数${a < 0 === b < 0 ? "同号，所以商为正" : "异号，所以商为负"}：$${num(a)} \\div ${paren(b)} = ${num(c)}$。`,
          ),
        });
      },
    },
    {
      id: "fraction-bar",
      title: t("The fraction bar as division", "分数线表示除法"),
      explanation: t(
        "A fraction bar means division: $\\dfrac{a}{b} = a \\div b$. A negative sign may sit in the numerator, in the denominator or in front, with the same value: $\\dfrac{-12}{4} = \\dfrac{12}{-4} = -\\dfrac{12}{4} = -3$.",
        "分数线表示除法：$\\dfrac{a}{b} = a \\div b$。负号可以写在分子、分母或分数前面，值都相同：$\\dfrac{-12}{4} = \\dfrac{12}{-4} = -\\dfrac{12}{4} = -3$。",
      ),
      generate(rng) {
        const b = rng.nonZero(-12, 12);
        const c = rng.nonZero(-12, 12);
        const a = b * c;
        const outside = rng.bool(0.35);
        const expr = `${outside ? "-" : ""}\\dfrac{${num(a)}}{${num(b)}}`;
        const value = outside ? -c : c;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: value,
          wrong: [-value],
          solution: outside
            ? t(
                `First $\\dfrac{${num(a)}}{${num(b)}} = ${num(c)}$; the sign in front gives its opposite, $${num(value)}$.`,
                `先算 $\\dfrac{${num(a)}}{${num(b)}} = ${num(c)}$；前面的负号取它的相反数，得 $${num(value)}$。`,
              )
            : t(
                `$\\dfrac{${num(a)}}{${num(b)}} = ${num(a)} \\div ${paren(b)} = ${num(c)}$.`,
                `$\\dfrac{${num(a)}}{${num(b)}} = ${num(a)} \\div ${paren(b)} = ${num(c)}$。`,
              ),
        });
      },
    },
  ],
};

export const powersOfIntegers: TopicDef = {
  id: "powers-of-integers",
  title: t("Powers of Integers", "整数的乘方"),
  summary: t("Evaluate powers with negative bases, and tell $(-a)^n$ from $-a^n$.", "计算底数为负数的乘方，区分 $(-a)^n$ 与 $-a^n$。"),
  prerequisites: ["multiplying-integers"],
  encompasses: [{ topic: "multiplying-integers", weight: 0.5 }],
  xp: 10,
  standards: ["CCSS.6.EE.A.1"],
  knowledgePoints: [
    {
      id: "negative-bases",
      title: t("Powers of negative numbers", "负数的乘方"),
      explanation: t(
        "A power is repeated multiplication: $a^n$ means $n$ factors of $a$. For a negative base, the parentheses are part of the base: $(-2)^3 = (-2)(-2)(-2) = -8$.\n\nAn **even** power of a negative number is positive, an **odd** power is negative.",
        "乘方是重复的乘法：$a^n$ 表示 $n$ 个 $a$ 相乘。底数为负数时，括号是底数的一部分：$(-2)^3 = (-2)(-2)(-2) = -8$。\n\n负数的**偶数**次幂为正，**奇数**次幂为负。",
      ),
      keyPrerequisites: ["multiplying-integers"],
      generate(rng) {
        const [base, n] = rng.pick<[number, number]>([
          [rng.int(2, 10), 2],
          [rng.int(2, 5), 3],
          [rng.int(2, 3), rng.int(4, 5)],
          [1, rng.int(5, 20)],
        ]);
        const value = (-base) ** n;
        const product = n <= 5 ? `${Array(n).fill(`(-${base})`).join("")} = ` : "";
        return numberProblem({
          prompt: t(`Evaluate $(-${base})^{${n}}$.`, `计算 $(-${base})^{${n}}$。`),
          answer: value,
          wrong: [-value, -base * n],
          solution: t(
            `${steps(`(-${base})^{${n}} = ${product}${num(value)}`)}There are ${n} negative factors, an ${n % 2 ? "odd" : "even"} number, so the result is ${n % 2 ? "negative" : "positive"}.`,
            `${steps(`(-${base})^{${n}} = ${product}${num(value)}`)}共有 ${n} 个负因数，是${n % 2 ? "奇" : "偶"}数个，所以结果为${n % 2 ? "负" : "正"}。`,
          ),
        });
      },
    },
    {
      id: "negative-of-a-power",
      title: t("The opposite of a power", "乘方的相反数"),
      explanation: t(
        "An exponent applies only to what is directly in front of it. In $-3^2$ there are no parentheses, so the exponent applies to $3$ alone and the minus sign is applied afterwards: $-3^2 = -(3^2) = -9$, whereas $(-3)^2 = 9$.",
        "指数只作用于紧挨在它前面的部分。$-3^2$ 中没有括号，所以指数只作用于 $3$，负号在乘方之后再作用：$-3^2 = -(3^2) = -9$，而 $(-3)^2 = 9$。",
      ),
      generate(rng) {
        const [base, n] = rng.pick<[number, number]>([
          [rng.int(2, 12), 2],
          [rng.int(2, 5), 3],
          [rng.int(2, 3), 4],
        ]);
        const parens = rng.bool(0.3);
        const value = parens ? (-base) ** n : -(base ** n);
        const other = parens ? -(base ** n) : (-base) ** n;
        const expr = parens ? `(-${base})^{${n}}` : `-${base}^{${n}}`;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: value,
          wrong: [other, -base * n],
          solution: parens
            ? t(`The base is $-${base}$: $${expr} = ${num(value)}$.`, `底数是 $-${base}$：$${expr} = ${num(value)}$。`)
            : t(
                `The exponent applies to $${base}$ only: ${steps(`${expr} = -(${base}^{${n}}) = -${base ** n}`)}`,
                `指数只作用于 $${base}$：${steps(`${expr} = -(${base}^{${n}}) = -${base ** n}`)}`,
              ),
        });
      },
    },
  ],
};

export const orderOfOperationsWithIntegers: TopicDef = {
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
      id: "without-exponents",
      title: t("Multiplication before addition", "先乘除后加减"),
      explanation: t(
        "Evaluate in this order:\n\n1. inside parentheses;\n2. exponents;\n3. multiplication and division, from left to right;\n4. addition and subtraction, from left to right.\n\nSo $5 - 3 \\cdot (-2) = 5 - (-6) = 11$, but $(5 - 3) \\cdot (-2) = 2 \\cdot (-2) = -4$.",
        "按以下顺序计算：\n\n1. 括号内；\n2. 乘方；\n3. 乘法和除法，从左到右；\n4. 加法和减法，从左到右。\n\n所以 $5 - 3 \\cdot (-2) = 5 - (-6) = 11$，而 $(5 - 3) \\cdot (-2) = 2 \\cdot (-2) = -4$。",
      ),
      keyPrerequisites: ["subtracting-integers", "multiplying-integers"],
      generate(rng) {
        const a = rng.nonZero(-20, 20);
        const b = rng.nonZero(-9, 9);
        const c = rng.nonZero(-9, 9);
        switch (rng.int(0, 2)) {
          case 0: {
            const v = a - b * c;
            return numberProblem({
              prompt: t(`Evaluate $${num(a)} - ${paren(b)} \\cdot ${paren(c)}$.`, `计算 $${num(a)} - ${paren(b)} \\cdot ${paren(c)}$。`),
              answer: v,
              wrong: [(a - b) * c, a + b * c],
              solution: t(
                `Multiply first: ${steps(`${num(a)} - ${paren(b)} \\cdot ${paren(c)} = ${num(a)} - ${paren(b * c)} = ${num(v)}`)}`,
                `先算乘法：${steps(`${num(a)} - ${paren(b)} \\cdot ${paren(c)} = ${num(a)} - ${paren(b * c)} = ${num(v)}`)}`,
              ),
            });
          }
          case 1: {
            const v = (a - b) * c;
            return numberProblem({
              prompt: t(
                `Evaluate $(${num(a)} - ${paren(b)}) \\cdot ${paren(c)}$.`,
                `计算 $(${num(a)} - ${paren(b)}) \\cdot ${paren(c)}$。`,
              ),
              answer: v,
              wrong: [a - b * c, (a + b) * c],
              solution: t(
                `Parentheses first: ${steps(`(${num(a)} - ${paren(b)}) \\cdot ${paren(c)} = ${paren(a - b)} \\cdot ${paren(c)} = ${num(v)}`)}`,
                `先算括号：${steps(`(${num(a)} - ${paren(b)}) \\cdot ${paren(c)} = ${paren(a - b)} \\cdot ${paren(c)} = ${num(v)}`)}`,
              ),
            });
          }
          default: {
            const d = rng.nonZero(-20, 20);
            const v = a - b + d;
            return numberProblem({
              prompt: t(`Evaluate $${num(a)} - ${paren(b)} + ${paren(d)}$.`, `计算 $${num(a)} - ${paren(b)} + ${paren(d)}$。`),
              answer: v,
              wrong: [a - (b + d), a + b + d],
              solution: t(
                `Add and subtract from left to right: ${steps(`${num(a)} - ${paren(b)} + ${paren(d)} = ${num(a - b)} + ${paren(d)} = ${num(v)}`)}`,
                `从左到右依次加减：${steps(`${num(a)} - ${paren(b)} + ${paren(d)} = ${num(a - b)} + ${paren(d)} = ${num(v)}`)}`,
              ),
            });
          }
        }
      },
    },
    {
      id: "with-exponents-and-division",
      title: t("Exponents and division", "含乘方与除法的运算"),
      explanation: t(
        "With negative numbers the order of operations does not change. Evaluate powers carefully: a negative base in parentheses raised to an odd power stays negative.\n\nExponents come before multiplication and division, which come before addition and subtraction. For example, $-7 + (-2)^3 \\div 4 = -7 + (-8) \\div 4 = -7 + (-2) = -9$.",
        "有负数时运算顺序不变。计算乘方时要细心：括号里的负数作底数，奇次幂仍是负数。\n\n乘方先于乘除，乘除先于加减。例如 $-7 + (-2)^3 \\div 4 = -7 + (-8) \\div 4 = -7 + (-2) = -9$。",
      ),
      keyPrerequisites: ["powers-of-integers", "dividing-integers"],
      generate(rng) {
        const a = rng.nonZero(-20, 20);
        if (rng.bool()) {
          const b = rng.nonZero(-6, 6);
          const v = a - b * b;
          return numberProblem({
            prompt: t(`Evaluate $${num(a)} - ${paren(b)}^{2}$.`, `计算 $${num(a)} - ${paren(b)}^{2}$。`),
            answer: v,
            wrong: [(a - b) ** 2, a + b * b],
            solution: t(
              `Exponent first: ${steps(`${num(a)} - ${paren(b)}^{2} = ${num(a)} - ${b * b} = ${num(v)}`)}`,
              `先算乘方：${steps(`${num(a)} - ${paren(b)}^{2} = ${num(a)} - ${b * b} = ${num(v)}`)}`,
            ),
          });
        }
        const c = rng.nonZero(-6, 6);
        const qt = rng.nonZero(-9, 9);
        const b = c * qt;
        const v = a + qt;
        return numberProblem({
          prompt: t(`Evaluate $${num(a)} + ${paren(b)} \\div ${paren(c)}$.`, `计算 $${num(a)} + ${paren(b)} \\div ${paren(c)}$。`),
          answer: v,
          wrong: [a - qt, ...((a + b) % c === 0 ? [(a + b) / c] : [])],
          solution: t(
            `Divide first: ${steps(`${num(a)} + ${paren(b)} \\div ${paren(c)} = ${num(a)} + ${paren(qt)} = ${num(v)}`)}`,
            `先算除法：${steps(`${num(a)} + ${paren(b)} \\div ${paren(c)} = ${num(a)} + ${paren(qt)} = ${num(v)}`)}`,
          ),
        });
      },
    },
  ],
};

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
