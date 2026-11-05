// Added topics of 3rd Grade Math: strategies for facts, letters for unknowns, reasonable
// answers, fractions on number lines and equal fractions, elapsed time on a line, scales
// and rulers, graphs with halves, area stories, L shapes, perimeter and quadrilaterals.

import type { CourseDef, Figure, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { svgDocument } from "@ga/subject-math";
import {
  arrayFigure,
  barGraphFigure,
  clockFigure,
  earlyNames,
  earlyPoint,
  earlyThings,
  earlyTopic,
  labeledRectangleFigure,
  polygonFigure,
} from "../early-grades-kit.ts";
import { gradeDrawings } from "../explanation-drawings-grades.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import { reasoned } from "../wrong-reasons.ts";
import {
  areaModelFigure,
  beakerFigure,
  choose,
  chooseMath,
  dialScaleFigure,
  factTriangleFigure,
  fractionLineFigure,
  fractionLinePlotFigure,
  halfPictureGraphFigure,
  inchRulerFigure,
  lShapeFigure,
  type Pair,
  timesTableFigure,
  twoFractionLinesFigure,
  whole,
} from "./early-grades-more-kit.ts";
import { compareProblem, fr, mx, twoBarsFigure } from "./grade-4-fractions.ts";

/** clockText writes minutes after midnight as on a digital clock. */
const clockText = (minutes: number) => {
  const hour = ((Math.floor(minutes / 60) - 1 + 12) % 12) + 1;
  return `${hour}:${String(minutes % 60).padStart(2, "0")}`;
};

/** timeHopsFigure draws a time line with jumps through the given times, in minutes, with the end or one jump hidden when asked. */
function timeHopsFigure(stops: readonly number[], hideEnd = false, hideHop = -1): Figure {
  const low = stops[0] as number;
  const high = stops[stops.length - 1] as number;
  const weights = stops.slice(1).map((v, i) => Math.sqrt(v - (stops[i] as number)));
  const whole = weights.reduce((a, b) => a + b, 0);
  const at = (v: number) => {
    const i = stops.indexOf(v);
    return 34 + (weights.slice(0, i).reduce((a, b) => a + b, 0) / whole) * 252;
  };
  const label = (x: number, y: number, s: string) =>
    `<text x="${x.toFixed(1)}" y="${y}" text-anchor="middle" stroke="none" fill="currentColor" font-size="13">${s}</text>`;
  let body = `<line x1="8" y1="60" x2="312" y2="60"/>`;
  stops.forEach((v, i) => {
    const hidden = hideEnd && i === stops.length - 1;
    body += `<line x1="${at(v).toFixed(1)}" y1="54" x2="${at(v).toFixed(1)}" y2="66"/>${label(at(v), 82, hidden ? "?" : clockText(v))}`;
  });
  stops.slice(1).forEach((v, i) => {
    const from = at(stops[i] as number);
    const to = at(v);
    const middle = (from + to) / 2;
    body += `<g class="accent"><path d="M ${from.toFixed(1)} 54 Q ${middle.toFixed(1)} 22 ${to.toFixed(1)} 54"/><path d="M ${(to - 7).toFixed(1)} 45 L ${to.toFixed(1)} 54 L ${(to - 1).toFixed(1)} 43"/></g>`;
    body += label(middle, 24, i === hideHop ? "?" : `+${v - (stops[i] as number)}`);
  });
  return {
    svg: svgDocument(92, body),
    alt: t(
      `A time line with jumps starting at ${clockText(low)}${hideEnd ? " and ending at an unknown time" : ` and ending at ${clockText(high)}`}.`,
      `一条时间线，从 ${clockText(low)} 开始跳${hideEnd ? "，结束的时间不知道" : `，到 ${clockText(high)} 结束`}。`,
    ),
  };
}

/** equalPairs lists equal fractions with bottom numbers 2, 3, 4, 6 and 8, as top and bottom of each fraction. */
const equalPairs: readonly (readonly [number, number, number, number])[] = [
  [1, 2, 2, 4],
  [1, 2, 3, 6],
  [1, 2, 4, 8],
  [1, 3, 2, 6],
  [2, 3, 4, 6],
  [1, 4, 2, 8],
  [3, 4, 6, 8],
  [2, 4, 4, 8],
  [2, 4, 3, 6],
  [3, 6, 4, 8],
];

/** pickEqualPair draws two equal fractions, with either one first. */
function pickEqualPair(rng: Rng) {
  const [n, d, m, e] = rng.pick(equalPairs);
  return rng.bool() ? { n, d, m, e } : { n: m, d: e, m: n, e: d };
}

/** times writes a multiplication in LaTeX. */
const times = (a: number | string, b: number | string) => `${a} \\times ${b}`;

/** div writes a division in LaTeX. */
const div = (a: number | string, b: number | string) => `${a} \\div ${b}`;

const usingKnownFacts = earlyTopic(
  "using-known-facts-to-multiply",
  ["Using Known Facts to Multiply", "用会的乘法算不会的"],
  [
    "Double a known fact, add one more group, or take one group away to find a harder fact.",
    "把会的乘法算式翻倍、多加一组或减去一组，算出较难的乘法。",
  ],
  ["splitting-a-factor-to-multiply"],
  ["3.OA.C.7"],
  [
    earlyPoint(
      "doubling-a-known-fact",
      ["Doubling a known fact", "把会的算式翻倍"],
      [
        "Four groups are two groups and two groups more, so a times-4 fact is double a times-2 fact. In the same way, 6 groups are double 3 groups, and 8 groups are double 4 groups. If you know that $3 \\times 7 = 21$, then $6 \\times 7$ is double 21, which is 42.",
        "4 组就是 2 组再加 2 组，所以乘 4 的结果是乘 2 的两倍。同样，6 组是 3 组的两倍，8 组是 4 组的两倍。知道 $3 \\times 7 = 21$，那么 $6 \\times 7$ 就是 21 的两倍，等于 42。",
      ],
      (rng) => {
        const small = rng.pick([2, 3, 4, 5]);
        const n = rng.int(2, 10);
        const known = small * n;
        const answer = 2 * known;
        return whole(
          [
            `You know that $${times(small, n)} = ${known}$. What is $${times(2 * small, n)}$?`,
            `已知 $${times(small, n)} = ${known}$。$${times(2 * small, n)}$ 等于多少？`,
          ],
          answer,
          [known + 2, known + n, known + small],
          [
            `$${2 * small}$ groups are double $${small}$ groups, and double ${known} is ${answer}.`,
            `$${2 * small}$ 组是 $${small}$ 组的两倍，${known} 的两倍是 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "one-more-group",
      ["One more group", "多加一组"],
      [
        "Going from one fact to the next means adding one more group. If you know that $5 \\times 7 = 35$, then $6 \\times 7$ is one more 7, so it is $35 + 7$, or 42. The number you add is the size of a group, and not the number of groups. Adding 1 instead is a very common slip.",
        "从一个算式到下一个算式，就是多加一组。知道 $5 \\times 7 = 35$，那么 $6 \\times 7$ 就是再加一个 7，也就是 $35 + 7$，等于 42。要加的是每组的个数，不是组数。常见的错误是只加 1。",
      ],
      (rng) => {
        const groups = rng.pick([2, 4, 5, 9, 10]);
        const size = rng.int(3, 9);
        const known = groups * size;
        return whole(
          [
            `What number goes in the box? $${times(groups + 1, size)} = ${known} + \\square$`,
            `方框里填几？$${times(groups + 1, size)} = ${known} + \\square$`,
          ],
          size,
          [1, groups, groups + 1, known],
          [
            `$${groups + 1}$ groups of ${size} are $${groups}$ groups of ${size} and one more ${size}.`,
            `$${groups + 1}$ 个 ${size} 就是 $${groups}$ 个 ${size} 再加一个 ${size}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "one-group-less",
      ["One group less", "减去一组"],
      [
        "A fact just below an easy fact can be found by taking one group away. Nine groups are ten groups with one group less. So $9 \\times 6$ is $60 - 6$, which is 54. Four groups are five groups with one group less, so $4 \\times 8$ is $40 - 8$, which is 32. Take away one whole group, and not just 1.",
        "比容易的算式少一组时，可以减去一组。9 组就是 10 组少一组。所以 $9 \\times 6$ 就是 $60 - 6$，等于 54。4 组就是 5 组少一组，所以 $4 \\times 8$ 就是 $40 - 8$，等于 32。要减去整整一组，不是只减 1。",
      ],
      (rng) => {
        const groups = rng.pick([3, 5, 10]);
        const size = rng.int(3, 11);
        const big = groups * size;
        const answer = (groups - 1) * size;
        return whole(
          [
            `You know that $${times(groups, size)} = ${big}$. What is $${times(groups - 1, size)}$?`,
            `已知 $${times(groups, size)} = ${big}$。$${times(groups - 1, size)}$ 等于多少？`,
          ],
          answer,
          [big - 1, big + size, big - groups],
          [`Take away one group of ${size}: $${big} - ${size} = ${answer}$.`, `减去一组 ${size}：$${big} - ${size} = ${answer}$。`],
        );
      },
    ),
  ],
);

const tablePatterns = earlyTopic(
  "patterns-in-the-multiplication-table",
  ["Patterns in the Multiplication Table", "乘法表中的规律"],
  [
    "Find products in a table, and explain patterns such as even products and steps along a row.",
    "在乘法表中找出乘积，并说明乘积的奇偶和每行变化的规律。",
  ],
  ["multiplying-by-6-7-8-and-9"],
  ["3.OA.D.9"],
  [
    earlyPoint(
      "finding-a-product-in-the-table",
      ["Finding a product in the table", "在表中找乘积"],
      [
        "In a multiplication table, the number at the start of a row and the number at the top of a column are the factors. The product sits where that row and that column meet. Run one finger along the row and another down the column until they meet. Only some cells are filled in here, so work out the missing one.",
        "在乘法表中，每行最前面的数和每列最上面的数是两个因数，乘积在这一行和这一列相交的地方。用一根手指沿着这一行走，另一根手指沿着这一列走，直到它们相遇。这里只填了一部分，请算出缺少的数。",
      ],
      (rng) => {
        const rows = rng.sample([2, 3, 4, 5, 6, 7, 8, 9], 3).sort((a, b) => a - b);
        const columns = rng.sample([2, 3, 4, 5, 6, 7, 8, 9], 4).sort((a, b) => a - b);
        const r = rng.int(0, 2);
        const c = rng.int(0, 3);
        const a = rows[r] as number;
        const b = columns[c] as number;
        return whole(
          ["What number goes at the question mark in this table?", "表中问号处应该填几？"],
          a * b,
          [a + b, a * b + a, a * b - b],
          [
            `The question mark is in row ${a} and column ${b}, and $${times(a, b)} = ${a * b}$.`,
            `问号在 ${a} 这一行、${b} 这一列，$${times(a, b)} = ${a * b}$。`,
          ],
          timesTableFigure(rows, columns, (i, j) => i !== r && j !== c, [r, c]),
        );
      },
    ),
    earlyPoint(
      "steps-along-a-row",
      ["Steps along a row", "沿着一行走"],
      [
        "Look along one row of the table. Each number is more than the one before it by the same amount, and that amount is the number at the start of the row. In the row of 4, the numbers go 4, 8, 12, 16. This pattern is skip counting, so you can use it to check any number in the row.",
        "沿着表中的一行看，每个数都比前一个数多同样多，多的就是这一行最前面的数。在 4 这一行，数是 4、8、12、16。这个规律就是跳着数，所以可以用它来检查这一行的任何一个数。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const start = rng.int(1, 4);
        const columns = [0, 1, 2, 3, 4].map((i) => start + i);
        const at = rng.int(1, 4);
        const b = columns[at] as number;
        return whole(
          ["What number goes at the question mark in this row?", "这一行问号处应该填几？"],
          a * b,
          [a * b + 1, a * b + b, a + b],
          [
            `Each step along the row adds ${a}, and $${times(a, b)} = ${a * b}$.`,
            `沿着这一行每走一步就加 ${a}，$${times(a, b)} = ${a * b}$。`,
          ],
          timesTableFigure([a], columns, (_, j) => j !== at, [0, at]),
        );
      },
    ),
    earlyPoint(
      "even-and-odd-products",
      ["Even and odd products", "乘积的奇偶"],
      [
        "If either factor is even, the product is even, because the groups can be split into two equal halves. A product is odd only when both factors are odd. So $4 \\times 7$ is even, and $3 \\times 5$ is odd. You can answer this question without working out the product, by looking only at the two factors.",
        "只要有一个因数是偶数，乘积就是偶数，因为可以把这些组平均分成两半。只有两个因数都是奇数，乘积才是奇数。所以 $4 \\times 7$ 的积是偶数，$3 \\times 5$ 的积是奇数。不用算出乘积，只看两个因数就能回答。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const even = (a * b) % 2 === 0;
        const reason: Pair = even
          ? [`Even, because at least one factor is even`, `偶数，因为至少有一个因数是偶数`]
          : [`Odd, because both factors are odd`, `奇数，因为两个因数都是奇数`];
        const wrongs: Pair[] = even
          ? [
              [`Odd, because both factors are odd`, `奇数，因为两个因数都是奇数`],
              [`Odd, because at least one factor is odd`, `奇数，因为至少有一个因数是奇数`],
              [`Even, because both factors are odd`, `偶数，因为两个因数都是奇数`],
            ]
          : [
              [`Even, because at least one factor is even`, `偶数，因为至少有一个因数是偶数`],
              [`Even, because both factors are odd`, `偶数，因为两个因数都是奇数`],
              [`Odd, because at least one factor is even`, `奇数，因为至少有一个因数是偶数`],
            ];
        return choose(
          rng,
          [`Is the product $${times(a, b)}$ even or odd?`, `$${times(a, b)}$ 的积是偶数还是奇数？`],
          reason,
          rng.shuffle(wrongs),
          [`$${times(a, b)} = ${a * b}$, which is ${even ? "even" : "odd"}.`, `$${times(a, b)} = ${a * b}$，是${even ? "偶数" : "奇数"}。`],
        );
      },
    ),
  ],
);

const factFamilies = earlyTopic(
  "fact-families-for-multiplying-and-dividing",
  ["Fact Families for Multiplying and Dividing", "乘法和除法的一组算式"],
  [
    "Use fact triangles to link multiplication and division, and see division as a missing factor.",
    "用算式三角形把乘法和除法联系起来，把除法看作求缺少的因数。",
  ],
  ["relating-multiplication-and-division"],
  ["3.OA.B.6"],
  [
    {
      ...earlyPoint(
        "the-missing-number-in-a-triangle",
        ["The missing number in a triangle", "三角形中缺少的数"],
        [
          "A fact triangle shows three numbers that belong together. The product goes on top, and the two factors go at the bottom corners. If the top is missing, multiply the two corners. If a corner is missing, divide the top by the corner you can see. The same triangle gives you two multiplication facts and two division facts.",
          "算式三角形表示三个有关系的数。积写在上面，两个因数写在下面的两个角上。上面的数不知道，就把下面两个数相乘。下面的数不知道，就用上面的数除以看得到的那个因数。一个三角形可以写出两个乘法算式和两个除法算式。",
        ],
        (rng) => {
          const a = rng.int(2, 9);
          const b = rng.int(2, 9);
          const product = a * b;
          const where = rng.int(0, 2);
          const answer = where === 0 ? product : where === 1 ? a : b;
          return whole(
            [
              "The top number is the product of the two bottom numbers. What number goes at the question mark?",
              "上面的数是下面两个数的积。问号处应该填几？",
            ],
            answer,
            where === 0 ? [a + b, product + a, product - b] : [product - (where === 1 ? b : a), product, product + (where === 1 ? b : a)],
            where === 0
              ? [
                  `The top is the product of the bottom two: $${times(a, b)} = ${product}$.`,
                  `上面的数是下面两个数的积：$${times(a, b)} = ${product}$。`,
                ]
              : [
                  `A missing bottom number times the other gives the top, so divide the top by the other: $${div(product, where === 1 ? b : a)} = ${answer}$.`,
                  `下面缺的数乘另一个数得上面的数，所以用上面的数除以另一个数：$${div(product, where === 1 ? b : a)} = ${answer}$。`,
                ],
            factTriangleFigure(where === 0 ? null : product, where === 1 ? null : a, where === 2 ? null : b, "×"),
          );
        },
      ),
      figure: gradeDrawings2["fact-families-for-multiplying-and-dividing#the-missing-number-in-a-triangle"],
    },
    earlyPoint(
      "division-as-a-missing-factor",
      ["Division as a missing factor", "把除法看成求因数"],
      [
        "Every division can be turned into a multiplication with a missing factor. To find $56 \\div 8$, ask what number times 8 makes 56. Since $7 \\times 8 = 56$, the answer is 7. This is often easier than sharing things out, and it means that once you know your times tables, you also know your division facts.",
        "每个除法都可以变成求缺少因数的乘法。求 $56 \\div 8$，就想：几乘 8 等于 56？因为 $7 \\times 8 = 56$，所以答案是 7。这常常比一个一个地分容易。会了乘法口诀，除法也就会了。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.int(3, 9);
        const product = a * b;
        return chooseMath(
          rng,
          [`Which multiplication helps you find $${div(product, b)}$?`, `求 $${div(product, b)}$ 时，哪个乘法算式能帮上忙？`],
          `\\square \\times ${b} = ${product}`,
          rng.shuffle([
            `${product} \\times ${b} = \\square`,
            `\\square \\times ${product} = ${b}`,
            `${b} + \\square = ${product}`,
            `${product} \\times \\square = ${b}`,
          ]),
          [
            `Dividing ${product} by ${b} asks what number times ${b} makes ${product}. That number is ${a}.`,
            `${product} 除以 ${b}，就是问几乘 ${b} 等于 ${product}。这个数是 ${a}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "which-fact-does-not-belong",
      ["Which fact does not belong", "哪个算式不属于这一组"],
      [
        "A fact family uses the same three numbers. The largest is always the product. In a multiplication, the product stands alone after the equal sign. In a division, the product comes first. A sentence that starts by dividing a smaller number by the product is not true, even though it uses the right three numbers. Check each sentence.",
        "一组算式用的是相同的三个数，其中最大的数是积。乘法算式中，积写在等号后面。除法算式中，积写在最前面。如果用小的数除以积，即使用的是这三个数，算式也不对。要一个一个地检查。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        let b = rng.int(2, 9);
        if (b === a) b = a === 9 ? 8 : a + 1;
        const c = a * b;
        return chooseMath(
          rng,
          [
            `The numbers ${a}, ${b} and ${c} make a fact family. Which sentence is not true?`,
            `${a}、${b} 和 ${c} 这三个数可以写成一组算式。哪个算式不对？`,
          ],
          rng.pick([`${div(a, c)} = ${b}`, `${div(b, c)} = ${a}`]),
          rng.shuffle([`${times(a, b)} = ${c}`, `${times(b, a)} = ${c}`, `${div(c, a)} = ${b}`, `${div(c, b)} = ${a}`]),
          [
            `The product ${c} must come first in a division, so dividing ${Math.min(a, b)} or ${Math.max(a, b)} by ${c} is not right.`,
            `除法中积 ${c} 要写在最前面，所以用 ${Math.min(a, b)} 或 ${Math.max(a, b)} 除以 ${c} 是不对的。`,
          ],
        );
      },
    ),
  ],
);

const unknownAnywhere = earlyTopic(
  "the-unknown-in-multiplication-and-division",
  ["The Unknown in Multiplication and Division", "乘除法中的未知数"],
  ["Find a missing number in any position of a multiplication or division sentence.", "找出乘法或除法算式中任何位置上缺少的数。"],
  ["division-facts-to-100"],
  ["3.OA.A.4"],
  [
    earlyPoint(
      "a-missing-factor",
      ["A missing factor", "缺少的因数"],
      [
        "To find a missing factor, ask yourself how many groups of the known factor make the product. For $\\square \\times 6 = 42$, count by sixes to 42, or remember that $7 \\times 6 = 42$. The missing factor is 7. Do not add or subtract the two numbers you can see. A multiplication sentence needs a multiplication fact.",
        "要求缺少的因数，就问自己：几个已知的因数才等于积？对于 $\\square \\times 6 = 42$，可以六个六个地数到 42，或者想到 $7 \\times 6 = 42$，所以缺少的因数是 7。不要把看到的两个数相加或相减。乘法算式要用乘法口诀来想。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = a * b;
        const first = rng.bool();
        const sentence = first ? `\\square \\times ${b} = ${c}` : `${b} \\times \\square = ${c}`;
        return whole(
          [`What number goes in the box? $${sentence}$`, `方框里填几？$${sentence}$`],
          a,
          [c - b, c + b, c],
          [`$${times(a, b)} = ${c}$, so the missing factor is ${a}.`, `$${times(a, b)} = ${c}$，所以缺少的因数是 ${a}。`],
        );
      },
    ),
    earlyPoint(
      "a-missing-divisor",
      ["A missing divisor", "缺少的除数"],
      [
        "In a sentence such as $48 \\div \\square = 6$, the box is the number you divide by. Think of it as 48 shared into some equal groups, with 6 in each group. How many groups are there? Since $8 \\times 6 = 48$, there are 8 groups, so the box is 8. A check is to divide 48 by your answer.",
        "在 $48 \\div \\square = 6$ 这样的算式中，方框是除数。可以想成：48 平均分成几组，每组 6 个，一共有几组？因为 $8 \\times 6 = 48$，所以有 8 组，方框里填 8。可以用 48 除以你的答案来检查。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = a * b;
        return whole(
          [`What number goes in the box? $${c} \\div \\square = ${b}$`, `方框里填几？$${c} \\div \\square = ${b}$`],
          a,
          [c - b, c + b, c * b],
          [`$${times(a, b)} = ${c}$, so $${div(c, a)} = ${b}$.`, `$${times(a, b)} = ${c}$，所以 $${div(c, a)} = ${b}$。`],
        );
      },
    ),
    earlyPoint(
      "a-missing-dividend",
      ["A missing dividend", "缺少的被除数"],
      [
        "When the box comes first, as in $\\square \\div 4 = 7$, the box stands for the whole amount before it was shared. There were 4 groups with 7 in each group, so the whole amount is $4 \\times 7$, which is 28. Notice that here you must multiply the two numbers you can see, even though the sentence uses division.",
        "方框写在最前面时，比如 $\\square \\div 4 = 7$，方框表示分之前的总数。分成了 4 组，每组 7 个，所以总数是 $4 \\times 7$，等于 28。注意，虽然算式是除法，这里却要把看到的两个数相乘。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 10);
        const c = a * b;
        return whole(
          [`What number goes in the box? $\\square \\div ${a} = ${b}$`, `方框里填几？$\\square \\div ${a} = ${b}$`],
          c,
          [a + b, Math.abs(a - b) + 1, c + a],
          [`The whole is ${a} groups of ${b}, and $${times(a, b)} = ${c}$.`, `总数是 ${a} 个 ${b}，$${times(a, b)} = ${c}$。`],
        );
      },
    ),
  ],
);

const areaModels = earlyTopic(
  "area-models-for-multiplying",
  ["Area Models for Multiplying", "用面积模型做乘法"],
  ["Split a rectangle into two parts to multiply a one-digit number by a teen number.", "把长方形分成两部分，算一位数乘十几。"],
  ["splitting-a-factor-to-multiply", "area-of-a-rectangle-by-multiplying"],
  ["3.MD.C.7", "3.OA.B.5"],
  [
    {
      ...earlyPoint(
        "the-area-of-one-part",
        ["The area of one part", "一部分的面积"],
        [
          "A larger multiplication can be drawn as a rectangle. Split the long side into tens and ones, so the rectangle has two parts. Each part is a smaller multiplication. The side of each part goes on the outside, and its area goes on the inside. To find a part's area, multiply the two sides of that part only.",
          "较大的乘法可以画成一个长方形。把长边分成十和一，长方形就分成了两部分，每部分都是一个较小的乘法。每部分的边长写在外面，面积写在里面。求一部分的面积，只要把这部分的两条边相乘。",
        ],
        (rng) => {
          const h = rng.int(3, 8);
          const ones = rng.int(2, 9);
          const tensPart = rng.bool();
          const answer = tensPart ? 10 * h : ones * h;
          return whole(
            ["What is the area of the part with the question mark?", "问号这部分的面积是多少？"],
            answer,
            tensPart ? [h + 10, h, 10 * h + ones * h] : [h + ones, ones, 10 * h + ones * h],
            tensPart
              ? [`This part is $${h}$ by 10, and $${times(h, 10)} = ${answer}$.`, `这部分是 $${h}$ 乘 10，$${times(h, 10)} = ${answer}$。`]
              : [
                  `This part is $${h}$ by ${ones}, and $${times(h, ones)} = ${answer}$.`,
                  `这部分是 $${h}$ 乘 ${ones}，$${times(h, ones)} = ${answer}$。`,
                ],
            areaModelFigure(h, [10, ones], tensPart ? ["?", `${ones * h}`] : [`${10 * h}`, "?"]),
          );
        },
      ),
      figure: gradeDrawings2["area-models-for-multiplying#the-area-of-one-part"],
    },
    {
      ...earlyPoint(
        "adding-the-two-parts",
        ["Adding the two parts", "把两部分加起来"],
        [
          "The whole rectangle is made of its two parts, so the product is the sum of their areas. For $6 \\times 14$, the parts are $6 \\times 10$, which is 60, and $6 \\times 4$, which is 24. Together they make 84. Remember to add the two areas. Multiplying them or forgetting one of them gives a wrong answer.",
          "整个长方形由两部分组成，所以积就是两部分面积的和。求 $6 \\times 14$，两部分是 $6 \\times 10 = 60$ 和 $6 \\times 4 = 24$，合起来是 84。记住要把两个面积相加。把它们相乘或漏掉一个，答案都不对。",
        ],
        (rng) => {
          const h = rng.int(3, 8);
          const ones = rng.int(2, 9);
          const n = 10 + ones;
          return whole(
            [`The rectangle shows $${times(h, n)}$. What is the product?`, `这个长方形表示 $${times(h, n)}$。积是多少？`],
            h * n,
            [10 * h, ones * h, h + n, h * n + 10],
            [
              `The whole rectangle is its two parts together: $${10 * h} + ${ones * h} = ${h * n}$.`,
              `整个长方形等于它的两部分之和：$${10 * h} + ${ones * h} = ${h * n}$。`,
            ],
            areaModelFigure(h, [10, ones], [`${10 * h}`, `${ones * h}`]),
          );
        },
      ),
      figure: gradeDrawings["adding-the-two-parts"],
    },
    earlyPoint(
      "choosing-the-split",
      ["Choosing the split", "选择怎样拆分"],
      [
        "To multiply by a teen number, split it into 10 and its ones, and multiply each part by the other factor. So $7 \\times 13$ becomes $7 \\times 10$ plus $7 \\times 3$. Both parts must be multiplied by the 7. It is a common mistake to multiply only the 10, and then just add the ones on at the end.",
        "乘十几时，把它拆成 10 和几，再分别乘另一个因数。所以 $7 \\times 13$ 变成 $7 \\times 10$ 加 $7 \\times 3$。两部分都要乘 7。常见的错误是只把 10 乘 7，最后再加上几。",
      ],
      (rng) => {
        const h = rng.int(3, 9);
        const ones = rng.int(2, 9);
        const n = 10 + ones;
        return reasoned(
          chooseMath(
            rng,
            [`Which is the same as $${times(h, n)}$?`, `哪个算式和 $${times(h, n)}$ 相等？`],
            `${times(h, 10)} + ${times(h, ones)}`,
            rng.shuffle([
              `${times(h, 10)} + ${ones}`,
              `${h} + ${times(10, ones)}`,
              `${times(h, 10)} \\times ${times(h, ones)}`,
              `${times(h, 1)} + ${times(h, ones)}`,
            ]),
            [`${n} is 10 and ${ones}, and each part is multiplied by ${h}.`, `${n} 是 10 和 ${ones}，两部分都要乘 ${h}。`],
          ),
          [
            [`$${times(h, 10)} + ${ones}$`, `The ${ones} must also be multiplied by ${h}.`, `${ones} 也要乘以 ${h}。`],
            [
              `$${h} + ${times(10, ones)}$`,
              `This multiplies 10 by ${ones} and leaves ${h} on its own, but both parts of ${n} are multiplied by ${h}.`,
              `这里用 10 乘 ${ones}，而 ${h} 单独放着，但 ${n} 的两部分都要乘以 ${h}。`,
            ],
            [`$${times(h, 10)} \\times ${times(h, ones)}$`, "The two parts are added, not multiplied.", "两部分要相加，不是相乘。"],
            [`$${times(h, 1)} + ${times(h, ones)}$`, `The tens part of ${n} is 10, not 1.`, `${n} 中十的部分是 10，不是 1。`],
          ],
        );
      },
    ),
  ],
);

const arrayMeasureStories = earlyTopic(
  "array-and-measure-word-problems",
  ["Array and Measure Word Problems", "阵列和度量的应用题"],
  ["Multiply and divide in stories about rows of things and equal measures.", "在有关成行的东西和相同长度的故事中做乘除法。"],
  ["multiplication-and-division-word-problems"],
  ["3.OA.A.3"],
  [
    earlyPoint(
      "rows-of-things",
      ["Rows of things", "成行的东西"],
      [
        "Many things in real life come in rows: seats in a hall, eggs in a carton and plants in a garden. When every row has the same number, you can multiply instead of counting one by one. The number of rows times the number in each row gives the total. Adding the two numbers does not.",
        "生活中很多东西是成行的：礼堂的座位、盒子里的鸡蛋、园子里的植物。每行个数相同时，就可以用乘法，不用一个一个地数。行数乘每行的个数就是总数。把这两个数相加是不对的。",
      ],
      (rng) => {
        const rows = rng.int(3, 7);
        const cols = rng.int(3, 8);
        const setting = rng.pick<readonly [string, string, string]>([
          ["chairs in a hall", "礼堂里的椅子", "把"],
          ["plants in a garden", "园子里的植物", "棵"],
          ["desks in a classroom", "教室里的课桌", "张"],
          ["trees in an orchard", "果园里的树", "棵"],
          ["tiles on a wall", "墙上的瓷砖", "块"],
        ]);
        return whole(
          [
            `The picture shows ${setting[0]}, with ${rows} rows and ${cols} in each row. How many are there in all?`,
            `图上是${setting[1]}，有 ${rows} 行，每行 ${cols} ${setting[2]}。一共有多少${setting[2]}？`,
          ],
          rows * cols,
          [rows + cols, rows * cols + cols, rows * cols - rows],
          [
            `${rows} equal rows of ${cols} make $${times(rows, cols)} = ${rows * cols}$.`,
            `${rows} 行，每行 ${cols}，一共是 $${times(rows, cols)} = ${rows * cols}$。`,
          ],
          arrayFigure(rows, cols),
        );
      },
    ),
    earlyPoint(
      "how-many-in-each-row",
      ["How many in each row", "每行有多少"],
      [
        "If you know the total and the number of rows, divide to find how many go in each row. If you know the total and the number in each row, divide to find the number of rows. Either way, you are finding a missing factor. You can check your answer by multiplying it back to get the total.",
        "知道总数和行数，就用除法求每行有多少。知道总数和每行的个数，就用除法求有多少行。这两种情况都是在求缺少的因数。可以用乘法检查答案，看能不能得到总数。",
      ],
      (rng) => {
        const rows = rng.int(3, 9);
        const cols = rng.int(3, 9);
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const total = rows * cols;
        return rng.bool()
          ? whole(
              [
                `${name} arranges ${total} ${thing.en} in ${rows} equal rows. How many ${thing.en} are in each row?`,
                `${name} 把 ${total} ${thing.unit}${thing.zh}摆成 ${rows} 行，每行同样多。每行有多少${thing.unit}？`,
              ],
              cols,
              [total - rows, total, total + rows],
              [
                `Sharing ${total} equally among ${rows} rows means dividing: $${div(total, rows)} = ${cols}$.`,
                `把 ${total} 平均分到 ${rows} 行，要用除法：$${div(total, rows)} = ${cols}$。`,
              ],
            )
          : whole(
              [
                `${name} arranges ${total} ${thing.en} with ${cols} in each row. How many rows are there?`,
                `${name} 把 ${total} ${thing.unit}${thing.zh}摆成几行，每行 ${cols} ${thing.unit}。一共有多少行？`,
              ],
              rows,
              [total - cols, total, total + cols],
              [
                `Finding how many groups of ${cols} make ${total} means dividing: $${div(total, cols)} = ${rows}$.`,
                `求 ${total} 里有几个 ${cols}，要用除法：$${div(total, cols)} = ${rows}$。`,
              ],
            );
      },
    ),
    earlyPoint(
      "equal-measures",
      ["Equal measures", "相同的长度和重量"],
      [
        "Multiplying and dividing work for measures just as they do for objects. If each ribbon is 6 meters long, then 4 ribbons are $4 \\times 6$, or 24 meters. If 24 meters of ribbon are cut into pieces 6 meters long, then there are $24 \\div 6$, or 4 pieces. Think about whether the answer should be larger or smaller.",
        "乘除法用在度量上，和用在物体上一样。每条丝带长 6 米，4 条丝带就是 $4 \\times 6$，等于 24 米。24 米丝带剪成每段 6 米，就有 $24 \\div 6$，等于 4 段。想一想答案应该变大还是变小。",
      ],
      (rng) => {
        const size = rng.int(2, 9);
        const count = rng.int(3, 9);
        const total = size * count;
        const form = rng.int(0, 2);
        if (form === 0)
          return whole(
            [
              `Each ribbon is ${size} meters long. How many meters long are ${count} ribbons in all?`,
              `每条丝带长 ${size} 米。${count} 条丝带一共长多少米？`,
            ],
            total,
            [size + count, total + size, total - size],
            [
              `${count} equal lengths of ${size} meters make $${times(count, size)} = ${total}$ meters.`,
              `${count} 个 ${size} 米合起来是 $${times(count, size)} = ${total}$ 米。`,
            ],
          );
        if (form === 1)
          return whole(
            [
              `A rope ${total} meters long is cut into pieces of ${size} meters each. How many pieces are there?`,
              `一根 ${total} 米长的绳子，剪成每段 ${size} 米。可以剪成多少段？`,
            ],
            count,
            [total - size, total + size, total],
            [
              `Counting how many ${size}s fit in ${total} means dividing: $${div(total, size)} = ${count}$ pieces.`,
              `求 ${total} 里有几个 ${size}，要用除法：$${div(total, size)} = ${count}$ 段。`,
            ],
          );
        return whole(
          [
            `A bag of rice has a mass of ${size} kilograms. What is the mass of ${count} such bags, in kilograms?`,
            `一袋大米重 ${size} 千克。${count} 袋这样的大米重多少千克？`,
          ],
          total,
          [size + count, total + size, total - count],
          [`$${times(count, size)} = ${total}$ kilograms.`, `$${times(count, size)} = ${total}$ 千克。`],
        );
      },
    ),
  ],
);

const usingALetter = earlyTopic(
  "using-a-letter-for-the-unknown",
  ["Using a Letter for the Unknown", "用字母表示未知数"],
  [
    "Use a letter to stand for an unknown number, find its value, and write an equation for a story.",
    "用字母表示未知数，求出它的值，并为故事写出等式。",
  ],
  ["two-step-word-problems-with-all-operations", "the-unknown-in-multiplication-and-division"],
  ["3.OA.D.8"],
  [
    earlyPoint(
      "finding-the-value-of-a-letter",
      ["Finding the value of a letter", "求字母的值"],
      [
        "A letter in an equation does the same job as a box: it stands for a number that we do not know yet. So $n + 14 = 30$ asks what number and 14 make 30. The answer is 16. In $4 \\times n = 28$, the letter is multiplied by 4. So you should ask what number times 4 makes 28.",
        "等式中的字母和方框的作用一样，都表示一个现在还不知道的数。所以 $n + 14 = 30$ 就是问：几和 14 合起来是 30？答案是 16。在 $4 \\times n = 28$ 中，4 乘这个字母。所以要问：4 乘几等于 28？",
      ],
      (rng) => {
        const letter = rng.pick(["n", "m", "k", "x", "y"]);
        const form = rng.int(0, 2);
        if (form === 0) {
          const a = rng.int(5, 40);
          const b = rng.int(5, 40);
          return whole(
            [`What is the value of $${letter}$? $${letter} + ${a} = ${a + b}$`, `$${letter}$ 等于多少？$${letter} + ${a} = ${a + b}$`],
            b,
            [a + b + a, a + b, b + 1],
            [
              `Adding ${a} to $${letter}$ gives ${a + b}, so take the ${a} back off: $${a + b} - ${a} = ${b}$.`,
              `$${letter}$ 加 ${a} 得 ${a + b}，所以把 ${a} 减回去：$${a + b} - ${a} = ${b}$。`,
            ],
          );
        }
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        if (form === 1)
          return whole(
            [
              `What is the value of $${letter}$? $${a} \\times ${letter} = ${a * b}$`,
              `$${letter}$ 等于多少？$${a} \\times ${letter} = ${a * b}$`,
            ],
            b,
            [a * b - a, a * b, a * b + a],
            [
              `Ask what times ${a} makes ${a * b}. Since $${times(a, b)} = ${a * b}$, the letter stands for ${b}.`,
              `想一想 ${a} 乘几得 ${a * b}。因为 $${times(a, b)} = ${a * b}$，所以这个字母表示 ${b}。`,
            ],
          );
        return whole(
          [`What is the value of $${letter}$? $${letter} \\div ${a} = ${b}$`, `$${letter}$ 等于多少？$${letter} \\div ${a} = ${b}$`],
          a * b,
          [a + b, a * b + a, a * b - b],
          [
            `Dividing $${letter}$ by ${a} gives ${b}, so multiply to undo it: $${times(a, b)} = ${a * b}$.`,
            `$${letter}$ 除以 ${a} 得 ${b}，所以用乘法还原：$${times(a, b)} = ${a * b}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "an-equation-for-a-story",
      ["An equation for a story", "为故事写等式"],
      [
        "To write an equation for a story, first decide what the letter stands for. Then write down what happens, using numbers from the story and the letter for the unknown amount. If 5 boxes hold $n$ pencils each and there are 40 in all, then $5 \\times n = 40$. Read your equation aloud to see whether it tells the story.",
        "为故事写等式时，先想好字母表示什么。再把发生的事写下来，用故事里的数，不知道的数用字母表示。5 盒铅笔，每盒 $n$ 支，一共 40 支，那么 $5 \\times n = 40$。把等式读一读，看它是否说的就是这个故事。",
      ],
      (rng) => {
        const boxes = rng.int(3, 9);
        const each = rng.int(3, 9);
        const total = boxes * each;
        const letter = rng.pick(["n", "m", "k"]);
        const thing = rng.pick(earlyThings);
        return chooseMath(
          rng,
          [
            `There are ${boxes} boxes with $${letter}$ ${thing.en} in each box, and ${total} ${thing.en} in all. Which equation tells this story?`,
            `有 ${boxes} 盒${thing.zh}，每盒 $${letter}$ ${thing.unit}，一共 ${total} ${thing.unit}。哪个等式能表示这个故事？`,
          ],
          `${boxes} \\times ${letter} = ${total}`,
          rng.shuffle([
            `${boxes} + ${letter} = ${total}`,
            `${total} \\times ${boxes} = ${letter}`,
            `${letter} \\div ${boxes} = ${total}`,
            `${boxes} \\div ${letter} = ${total}`,
          ]),
          [
            `Equal groups mean multiplying: ${boxes} boxes of $${letter}$ each make ${total}, so ${boxes} times $${letter}$ is ${total}.`,
            `同样多的几组要用乘法：${boxes} 盒，每盒 $${letter}$，合起来是 ${total}，所以 ${boxes} 乘 $${letter}$ 等于 ${total}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "a-letter-for-the-answer-to-two-steps",
      ["A letter in a two-step story", "两步故事中的字母"],
      [
        "A letter can also stand for the answer to a two-step problem. If you buy 3 packs of 6 cards and already have 5 cards, then the total $t$ is given by $t = 3 \\times 6 + 5$. Do the multiplication first, because it tells how many cards are in the packs. Then add what you already had.",
        "字母也可以表示两步问题的答案。买了 3 包卡片，每包 6 张，原来有 5 张，总数 $t$ 就是 $t = 3 \\times 6 + 5$。先算乘法，因为它算的是这几包有多少张。再加上原来的张数。",
      ],
      (rng) => {
        const packs = rng.int(2, 8);
        const each = rng.int(3, 9);
        const extra = rng.int(2, 20);
        const plus = rng.bool();
        const value = plus ? packs * each + extra : packs * each - Math.min(extra, packs * each - 1);
        const change = plus ? extra : Math.min(extra, packs * each - 1);
        const name = rng.pick(earlyNames);
        return whole(
          plus
            ? [
                `${name} has ${change} cards and buys ${packs} packs of ${each} cards. The total is $t = ${times(packs, each)} + ${change}$. What is $t$?`,
                `${name} 有 ${change} 张卡片，又买了 ${packs} 包，每包 ${each} 张。总数是 $t = ${times(packs, each)} + ${change}$。$t$ 等于多少？`,
              ]
            : [
                `${name} buys ${packs} packs of ${each} cards and gives away ${change}. The number left is $t = ${times(packs, each)} - ${change}$. What is $t$?`,
                `${name} 买了 ${packs} 包卡片，每包 ${each} 张，送出去 ${change} 张。剩下的张数是 $t = ${times(packs, each)} - ${change}$。$t$ 等于多少？`,
              ],
          value,
          [packs + each + change, packs * each, packs * (each + change)],
          [
            `$${times(packs, each)} = ${packs * each}$, and then $${packs * each} ${plus ? "+" : "-"} ${change} = ${value}$.`,
            `$${times(packs, each)} = ${packs * each}$，然后 $${packs * each} ${plus ? "+" : "-"} ${change} = ${value}$。`,
          ],
        );
      },
    ),
  ],
);

const reasonableAnswers = earlyTopic(
  "is-the-answer-reasonable",
  ["Is the Answer Reasonable?", "答案合理吗"],
  [
    "Round to estimate sums and differences, and use the estimate to judge an answer.",
    "用四舍五入来估算和与差，并用估算来判断答案是否合理。",
  ],
  ["rounding-to-the-nearest-hundred", "adding-within-1000"],
  ["3.OA.D.8", "3.NBT.A.1"],
  [
    earlyPoint(
      "estimating-a-sum",
      ["Estimating a sum", "估算和"],
      [
        "To estimate a sum, round each number and then add the rounded numbers. So 389 + 412 is about $400 + 400$, or 800. The estimate is not the exact answer, but it is quick, and it tells you about how large the true answer should be. Round both numbers to the same place before you add.",
        "估算和时，先把每个数四舍五入，再把得到的数相加。所以 389 加 412 大约是 $400 + 400$，等于 800。估算不是准确的答案，但是很快，能告诉你真正的答案大约有多大。相加之前，两个数要四舍五入到同一位。",
      ],
      (rng) => {
        const a = rng.int(112, 480);
        const b = rng.int(112, 480);
        const round = (v: number) => Math.round(v / 100) * 100;
        const answer = round(a) + round(b);
        return whole(
          [
            `Round each number to the nearest hundred and add. About how much is $${a} + ${b}$?`,
            `把每个数四舍五入到百位，再相加。$${a} + ${b}$ 大约是多少？`,
          ],
          answer,
          [a + b, answer + 100, answer - 100],
          [
            `${a} rounds to ${round(a)}, and ${b} rounds to ${round(b)}. Their sum is ${answer}.`,
            `${a} 约等于 ${round(a)}，${b} 约等于 ${round(b)}，它们的和是 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "estimating-a-difference",
      ["Estimating a difference", "估算差"],
      [
        "Estimating a difference works the same way. Round both numbers, and then subtract the rounded numbers. So $73 - 28$ is about $70 - 30$, or 40. The estimate does not need to match the exact answer. It only needs to be close enough for you to see whether an answer makes sense. Be careful to round before you subtract.",
        "估算差的方法一样。先把两个数四舍五入，再把得到的数相减。所以 $73 - 28$ 大约是 $70 - 30$，等于 40。估算不必和准确答案一样，只要足够接近，能看出答案合不合理就行。一定要先四舍五入，再相减。",
      ],
      (rng) => {
        const a = rng.int(410, 980);
        const b = rng.int(110, 390);
        const place = rng.bool() ? 100 : 10;
        const round = (v: number) => Math.round(v / place) * place;
        const answer = round(a) - round(b);
        return whole(
          place === 100
            ? [
                `Round each number to the nearest hundred and subtract. About how much is $${a} - ${b}$?`,
                `把每个数四舍五入到百位，再相减。$${a} - ${b}$ 大约是多少？`,
              ]
            : [
                `Round each number to the nearest ten and subtract. About how much is $${a} - ${b}$?`,
                `把每个数四舍五入到十位，再相减。$${a} - ${b}$ 大约是多少？`,
              ],
          answer,
          [a - b, answer + place, answer - place, round(a) + round(b)],
          [
            `${a} rounds to ${round(a)}, and ${b} rounds to ${round(b)}. Their difference is ${answer}.`,
            `${a} 约等于 ${round(a)}，${b} 约等于 ${round(b)}，它们的差是 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "judging-an-answer",
      ["Judging an answer", "判断答案"],
      [
        "Once you have an estimate, you can use it to judge any answer that someone gives. An answer far away from the estimate must be wrong. Answers that are hundreds too large or too small often come from a slip with the hundreds digits. Note that an answer near the estimate may still be wrong, but it is at least reasonable.",
        "有了估算，就能判断别人给出的答案。离估算很远的答案一定是错的。多了几百或少了几百的答案，常常是百位算错了。注意，接近估算的答案也可能是错的，但至少是合理的。",
      ],
      (rng) => {
        const a = rng.int(205, 495);
        const b = rng.int(205, 495);
        const sum = a + b;
        const name = rng.pick(earlyNames);
        const near = sum + rng.pick([-2, 0, 0, 1]);
        const far = sum + 200;
        const farther = sum - 200;
        return choose(
          rng,
          [`${name} worked out $${a} + ${b}$. Which answer is reasonable?`, `${name} 算了 $${a} + ${b}$。哪个答案是合理的？`],
          [`${near}`, `${near}`],
          [
            [`${far}`, `${far}`],
            [`${farther}`, `${farther}`],
            [`${sum + 400}`, `${sum + 400}`],
          ],
          [
            `${a} is about ${Math.round(a / 100) * 100} and ${b} is about ${Math.round(b / 100) * 100}, so the sum is about ${(Math.round(a / 100) + Math.round(b / 100)) * 100}.`,
            `${a} 约等于 ${Math.round(a / 100) * 100}，${b} 约等于 ${Math.round(b / 100) * 100}，所以和大约是 ${(Math.round(a / 100) + Math.round(b / 100)) * 100}。`,
          ],
        );
      },
    ),
  ],
);

const mentalWithin1000 = earlyTopic(
  "mental-strategies-within-1000",
  ["Mental Strategies Within 1000", "1000 以内的心算策略"],
  [
    "Make friendly numbers to add and subtract in your head, and group numbers that make hundreds.",
    "凑成好算的数来心算加减法，并把能凑成整百的数放在一起。",
  ],
  ["subtracting-within-1000"],
  ["3.NBT.A.2"],
  [
    earlyPoint(
      "keeping-the-difference-the-same",
      ["Keeping the difference the same", "保持差不变"],
      [
        "If you add the same amount to both numbers in a subtraction, the difference does not change. They are still the same distance apart. So $503 - 198$ is the same as $505 - 200$, and that is easy to work out in your head. Be sure to change both numbers in the same direction, and by the same amount.",
        "减法中，两个数都加上同样的数，差不变，因为它们之间的距离没变。所以 $503 - 198$ 和 $505 - 200$ 相等，这样就很容易心算了。两个数一定要朝同一个方向变，而且变的大小要相同。",
      ],
      (rng) => {
        const gap = rng.int(1, 4);
        const b = 100 * rng.int(1, 4) - gap;
        const a = rng.int(b + 40, 900);
        return whole(
          [`What number goes in the box? $${a} - ${b} = \\square - ${b + gap}$`, `方框里填几？$${a} - ${b} = \\square - ${b + gap}$`],
          a + gap,
          [a - gap, a, a - b],
          [
            `${b} went up by ${gap}, so ${a} must go up by ${gap} too: ${a + gap}.`,
            `${b} 增加了 ${gap}，所以 ${a} 也要增加 ${gap}：${a + gap}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "subtracting-a-near-hundred",
      ["Subtracting a near hundred", "减去接近整百的数"],
      [
        "To subtract a number close to a hundred, subtract the hundred and then put back what you took away too many. To find $645 - 298$, subtract 300 to get 345. You took away 2 too many, so add 2 back to get 347. Students often subtract the 2 as well, which gives an answer that is 4 too small.",
        "减去接近整百的数时，可以先减去整百，再把多减的加回来。求 $645 - 298$，先减 300 得 345。多减了 2，所以再加 2，得 347。常见的错误是再减 2，这样答案就少了 4。",
      ],
      (rng) => {
        const gap = rng.int(1, 4);
        const hundreds = rng.int(1, 5);
        const b = 100 * hundreds - gap;
        const a = rng.int(100 * hundreds + 11, 980);
        const answer = a - b;
        return whole(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [answer - 2 * gap, answer + 10, a - 100 * hundreds],
          [
            `$${a} - ${100 * hundreds} = ${a - 100 * hundreds}$, and adding back ${gap} gives ${answer}.`,
            `$${a} - ${100 * hundreds} = ${a - 100 * hundreds}$，再加回 ${gap}，得 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "grouping-to-make-hundreds",
      ["Grouping to make hundreds", "凑成整百"],
      [
        "You may add numbers in any order, so look for pairs that make a round number. In $125 + 67 + 75$, the numbers 125 and 75 make 200, so the sum is $200 + 67$, or 267. Doing the addition from left to right would also work, but it takes more steps. It also gives you more chances to make a mistake.",
        "加法可以按任何顺序来算，所以要找能凑成整数的两个数。在 $125 + 67 + 75$ 中，125 和 75 合起来是 200，所以和是 $200 + 67$，等于 267。从左往右算也可以，但步骤更多，也更容易出错。",
      ],
      (rng) => {
        const a = 5 * rng.int(5, 39);
        const pairTotal = 100 * Math.ceil((a + 5) / 100);
        const c = pairTotal - a;
        const b = rng.int(11, 99);
        const [x, y, z] = rng.bool() ? [a, b, c] : [c, b, a];
        return whole(
          [`What is $${x} + ${y} + ${z}$?`, `$${x} + ${y} + ${z}$ 等于多少？`],
          a + b + c,
          [pairTotal, a + b, a + b + c + 100, c + b],
          [
            `$${a} + ${c} = ${pairTotal}$, and $${pairTotal} + ${b} = ${pairTotal + b}$.`,
            `$${a} + ${c} = ${pairTotal}$，$${pairTotal} + ${b} = ${pairTotal + b}$。`,
          ],
        );
      },
    ),
  ],
);

const unitFractionsOnLine = earlyTopic(
  "placing-unit-fractions-on-the-number-line",
  ["Placing Unit Fractions on the Number Line", "在数轴上找单位分数"],
  [
    "Cut the space from 0 to 1 into equal parts to place a unit fraction, and see which is closest to 0.",
    "把 0 到 1 之间平均分，找到单位分数的位置，并看出哪个离 0 最近。",
  ],
  ["fractions-on-the-number-line"],
  ["3.NF.A.2"],
  [
    {
      ...earlyPoint(
        "one-space-from-zero",
        ["One space from zero", "离 0 一格"],
        [
          "The whole on a number line is the space from 0 to 1. If it is cut into 4 equal spaces, each space is one fourth, so the first mark after 0 is $\\frac{1}{4}$. Count the spaces, not the marks. There is one more mark than there are spaces, so counting marks would give a wrong answer of one fifth.",
          "数轴上的一个整体，就是从 0 到 1 这一段。如果平均分成 4 格，每格就是四分之一，所以 0 后面的第一个刻度是 $\\frac{1}{4}$。要数格子，不是数刻度。刻度比格子多一个，数刻度就会错答成五分之一。",
        ],
        (rng) => {
          const d = rng.pick([2, 3, 4, 6, 8]);
          const wholes = rng.bool() ? 1 : 2;
          return chooseMath(
            rng,
            ["What fraction does the dot show?", "这个点表示什么分数？"],
            fr(1, d),
            rng.shuffle([fr(1, d + 1), fr(d, 1), fr(1, d * 2), fr(2, d + 1)]),
            [`There are ${d} equal spaces from 0 to 1, and the dot is 1 space from 0.`, `从 0 到 1 平均分成 ${d} 格，这个点离 0 有 1 格。`],
            fractionLineFigure(wholes, d, 1),
          );
        },
      ),
      figure: gradeDrawings["one-space-from-zero"],
    },
    earlyPoint(
      "how-many-to-reach-one",
      ["How many to reach one", "几个单位分数到 1"],
      [
        "A unit fraction is one space on the line from 0 to 1. To reach 1, you need as many spaces as the bottom number says. It takes 3 jumps of one third to reach 1, and 8 jumps of one eighth to reach 1. So the bottom number of a fraction tells how many of its parts make the whole.",
        "单位分数就是从 0 到 1 这条线上的一格。要到 1，需要的格数就是分母。跳 3 次三分之一就到 1，跳 8 次八分之一也到 1。所以分母告诉我们，几个这样的一份才能合成一个整体。",
      ],
      (rng) => {
        const d = rng.pick([2, 3, 4, 6, 8]);
        const wholes = rng.int(1, 6);
        const total = d * wholes;
        return whole(
          [
            `Starting at 0, how many jumps of $${fr(1, d)}$ does it take to reach ${wholes}?`,
            `从 0 开始，每次跳 $${fr(1, d)}$，跳多少次才能到 ${wholes}？`,
          ],
          total,
          [d + 1, total + d, total === 1 ? 2 : total - 1],
          [
            `Each whole has ${d} jumps of $${fr(1, d)}$, so ${wholes} ${wholes === 1 ? "whole takes" : "wholes take"} ${total}.`,
            `每个整体有 ${d} 个 $${fr(1, d)}$，所以到 ${wholes} 需要跳 ${total} 次。`,
          ],
        );
      },
    ),
    earlyPoint(
      "closest-to-zero",
      ["Closest to zero", "离 0 最近"],
      [
        "When the whole is cut into more parts, each part is smaller. So a unit fraction with a larger bottom number sits closer to 0 and farther from 1. The fraction $\\frac{1}{8}$ is closer to 0 than $\\frac{1}{3}$, even though 8 is greater than 3. It helps to picture cutting a cake among more friends, as each slice gets smaller.",
        "一个整体分的份数越多，每份就越小。所以分母越大的单位分数，离 0 越近，离 1 越远。$\\frac{1}{8}$ 比 $\\frac{1}{3}$ 离 0 更近，虽然 8 比 3 大。可以想象把一块蛋糕分给更多的朋友，每一块就更小了。",
      ],
      (rng) => {
        const closest = rng.bool();
        const why: Pair = [
          `The ${closest ? "larger" : "smaller"} the bottom number, the ${closest ? "smaller" : "larger"} the part, so the fraction lies ${closest ? "nearer to 0" : "nearer to 1"}.`,
          `分母越${closest ? "大" : "小"}，每份就越${closest ? "小" : "大"}，这个分数就离 ${closest ? "0" : "1"} 越近。`,
        ];
        if (rng.bool()) {
          const ds = rng.sample([2, 3, 4, 6, 8], 4);
          const target = closest ? Math.max(...ds) : Math.min(...ds);
          return chooseMath(
            rng,
            closest
              ? ["Which fraction is closest to 0 on the number line?", "在数轴上，哪个分数离 0 最近？"]
              : ["Which fraction is closest to 1 on the number line?", "在数轴上，哪个分数离 1 最近？"],
            fr(1, target),
            ds.filter((d) => d !== target).map((d) => fr(1, d)),
            why,
          );
        }
        const [a, b] = rng.sample([2, 3, 4, 6, 8], 2) as [number, number];
        const target = closest ? Math.max(a, b) : Math.min(a, b);
        const other = target === a ? b : a;
        const place = closest ? 0 : 1;
        return choose(
          rng,
          [
            `On the number line, which is closer to ${place}: $${fr(1, a)}$ or $${fr(1, b)}$?`,
            `在数轴上，$${fr(1, a)}$ 和 $${fr(1, b)}$ 哪个离 ${place} 更近？`,
          ],
          [`$${fr(1, target)}$`, `$${fr(1, target)}$`],
          [
            [`$${fr(1, other)}$`, `$${fr(1, other)}$`],
            ["They are the same distance away", "一样近"],
          ],
          why,
        );
      },
    ),
  ],
);

const fractionsBeyondOne = earlyTopic(
  "fractions-greater-than-one-on-a-number-line",
  ["Fractions Greater Than One on a Number Line", "数轴上大于 1 的分数"],
  [
    "Keep counting spaces past 1 to name fractions greater than one, and write whole numbers as fractions.",
    "过了 1 继续数格子，读出大于 1 的分数，并把整数写成分数。",
  ],
  ["placing-unit-fractions-on-the-number-line"],
  ["3.NF.A.2", "3.NF.A.3"],
  [
    earlyPoint(
      "counting-past-one",
      ["Counting past one", "过了 1 继续数"],
      [
        "Fractions do not stop at 1. Keep counting spaces, and the top number keeps growing, while the bottom number stays the same because the spaces are the same size. On a line cut into fourths, the first mark after 1 is $\\frac{5}{4}$. The top number of a fraction may well be larger than the bottom number.",
        "分数不是到 1 就停了。继续数格子，分子会一直变大，而分母不变，因为每格的大小没变。在分成四份的数轴上，1 后面的第一个刻度是 $\\frac{5}{4}$。分子可以比分母大。",
      ],
      (rng) => {
        const d = rng.pick([2, 3, 4, 6, 8]);
        const wholes = rng.int(2, 3);
        let n = rng.int(d + 1, d * wholes - 1);
        if (n % d === 0) n += 1;
        return chooseMath(
          rng,
          ["What fraction does the dot show?", "这个点表示什么分数？"],
          fr(n, d),
          rng.shuffle([fr(d, n), fr(n, d * wholes), fr(n + 1, d), fr(n - d, d)]),
          [`Each whole has ${d} spaces, and the dot is ${n} spaces from 0.`, `每个整体有 ${d} 格，这个点离 0 有 ${n} 格。`],
          fractionLineFigure(wholes, d, n),
        );
      },
    ),
    earlyPoint(
      "fractions-at-whole-numbers",
      ["Fractions at whole numbers", "在整数位置上的分数"],
      [
        "Some fractions sit exactly on a whole number. On a line cut into thirds, $\\frac{3}{3}$ is at 1, $\\frac{6}{3}$ is at 2, and $\\frac{9}{3}$ is at 3. To find which whole number a fraction equals, count how many groups of the bottom number fit into the top number. That means dividing the top by the bottom.",
        "有些分数正好在整数的位置上。在分成三份的数轴上，$\\frac{3}{3}$ 在 1，$\\frac{6}{3}$ 在 2，$\\frac{9}{3}$ 在 3。要知道一个分数等于哪个整数，就看分子里面有几个分母，也就是用分子除以分母。",
      ],
      (rng) => {
        const d = rng.pick([2, 3, 4, 6]);
        const w = rng.int(1, 4);
        const wholes = rng.int(w, 4);
        return whole(
          [`Look at this number line. What whole number is equal to $${fr(d * w, d)}$?`, `看这条数轴。$${fr(d * w, d)}$ 等于哪个整数？`],
          w,
          [d, d * w, w + 1],
          [
            `${d * w} spaces make ${w} ${w === 1 ? "group" : "groups"} of ${d} spaces, so the fraction sits at ${w}.`,
            `${d * w} 格里有 ${w} 个 ${d} 格，所以这个分数在 ${w} 的位置。`,
          ],
          fractionLineFigure(Math.max(wholes, 2), d),
        );
      },
    ),
    earlyPoint(
      "whole-numbers-as-fractions",
      ["Whole numbers as fractions", "把整数写成分数"],
      [
        "Any whole number can be written as a fraction. If the bottom number is 1, the top is the number itself, so $4 = \\frac{4}{1}$. For other bottom numbers, multiply the whole number by the bottom number to find the top. So 3 wholes cut into fourths make 12 fourths, and that means $3 = \\frac{12}{4}$.",
        "任何整数都可以写成分数。分母是 1 时，分子就是这个数本身，所以 $4 = \\frac{4}{1}$。分母是别的数时，用整数乘分母，就得到分子。3 个整体，每个平均分成 4 份，就是 12 份，所以 $3 = \\frac{12}{4}$。",
      ],
      (rng) => {
        const w = rng.int(2, 8);
        const d = rng.pick([1, 2, 3, 4, 6, 8]);
        return whole(
          [`What number goes in the box? $${w} = ${fr("\\square", d)}$`, `方框里填几？$${w} = ${fr("\\square", d)}$`],
          w * d,
          [w + d, w * d + 1, d === 1 ? w + 2 : w],
          [
            `${w} wholes with ${d} ${d === 1 ? "part" : "parts"} each make ${w * d} parts in all.`,
            `${w} 个整体，每个 ${d} 份，一共 ${w * d} 份。`,
          ],
        );
      },
    ),
  ],
);

const equivalentOnLines = earlyTopic(
  "equivalent-fractions-on-number-lines",
  ["Equivalent Fractions on Number Lines", "数轴上相等的分数"],
  ["See that fractions at the same point on two number lines are equal.", "知道在两条数轴的同一位置上的分数相等。"],
  ["equal-fractions-with-pictures"],
  ["3.NF.A.3"],
  [
    {
      ...earlyPoint(
        "the-same-point-on-two-lines",
        ["The same point on two lines", "两条线上的同一点"],
        [
          "Two fractions are equal if they sit at the same point on the number line. To see this, draw one line under another, both from 0 to 1. If one line is cut into twice as many spaces, then each mark on the top line lines up with a mark on the bottom line. The two names are for the same number.",
          "两个分数如果在数轴的同一个位置，它们就相等。可以把一条数轴画在另一条下面，都从 0 到 1。如果下面一条分的格数是上面的两倍，上面的每个刻度都会对着下面的一个刻度。这两个名称说的是同一个数。",
        ],
        (rng) => {
          const { n, d, m, e } = pickEqualPair(rng);
          return chooseMath(
            rng,
            [
              `The top dot shows $${fr(n, d)}$. What fraction on the bottom line is equal to it?`,
              `上面的点表示 $${fr(n, d)}$。下面数轴上哪个分数和它相等？`,
            ],
            fr(m, e),
            rng.shuffle([fr(n, e), fr(m, d), fr(m + 1, e), fr(m === 1 ? 3 : m - 1, e)]),
            [
              `It lines up with the mark ${m} ${m === 1 ? "space" : "spaces"} along the bottom line, which has ${e} spaces.`,
              `它对着下面数轴的第 ${m} 格，下面的数轴一共有 ${e} 格。`,
            ],
            twoFractionLinesFigure(d, n, e, m),
          );
        },
      ),
      figure: gradeDrawings2["equivalent-fractions-on-number-lines#the-same-point-on-two-lines"],
    },
    earlyPoint(
      "spaces-on-the-bottom-line",
      ["Spaces on the bottom line", "下面数轴上的格数"],
      [
        "If the bottom line has twice as many spaces as the top line, then each space on the top is two spaces on the bottom. So one space along the top matches two along the bottom, and two along the top match four. When the spaces do not fit so neatly, follow the dot straight down and count the bottom spaces from 0.",
        "如果下面数轴的格数是上面的两倍，上面的每一格就对着下面的两格。所以上面一格对着下面两格，上面两格对着下面四格。如果格子对得不这么整齐，就从这个点一直往下看，再从 0 开始数下面的格子。",
      ],
      (rng) => {
        const atOne = rng.bool(0.4);
        const pair = pickEqualPair(rng);
        const { d, e } = pair;
        const n = atOne ? d : pair.n;
        const m = atOne ? e : pair.m;
        return whole(
          [
            "The dot on the top line is exactly above a mark on the bottom line. How many spaces from 0 is that mark?",
            "上面数轴的点正好对着下面数轴的一个刻度。这个刻度离 0 有多少格？",
          ],
          m,
          [n, m + 1, e + 1, n + 1],
          [
            `The top dot is $${fr(n, d)}$ of the way along, and on the bottom line that is ${m} of the ${e} spaces.`,
            `上面的点在 $${fr(n, d)}$ 的位置，在下面的数轴上，就是 ${e} 格中的第 ${m} 格。`,
          ],
          twoFractionLinesFigure(d, n, e, undefined),
        );
      },
    ),
    earlyPoint(
      "equal-or-not-on-two-lines",
      ["Equal or not on two lines", "两条线上的点相等吗"],
      [
        "To test whether two fractions are equal, mark them on lines of the same length. If one dot sits directly above the other, then the fractions are equal. If one dot is farther along, then that fraction is greater. The numbers in the fractions may look quite different, so trust the positions you can see.",
        "要检查两个分数是否相等，就把它们标在一样长的数轴上。如果一个点正好在另一个点的上面，这两个分数就相等。如果一个点更靠右，那个分数就更大。分数里的数可能看起来差很多，所以要相信看到的位置。",
      ],
      (rng) => {
        const { n, d, m: same, e } = pickEqualPair(rng);
        const shift = rng.pick([0, 0, 1, -1]);
        const m = same + shift <= 0 || same + shift >= e ? same : same + shift;
        const top: Pair = ["The fraction on the top line is greater", "上面的分数更大"];
        const bottom: Pair = ["The fraction on the bottom line is greater", "下面的分数更大"];
        const equal: Pair = ["The two fractions are equal", "两个分数相等"];
        const unsure: Pair = ["They cannot be compared", "无法比较"];
        const rel = m === same ? equal : m > same ? bottom : top;
        return choose(
          rng,
          [
            `The dots show $${fr(n, d)}$ and $${fr(m, e)}$. How do they compare?`,
            `这两个点表示 $${fr(n, d)}$ 和 $${fr(m, e)}$。它们比较起来怎么样？`,
          ],
          rel,
          [equal, bottom, top, unsure].filter((x) => x !== rel),
          m === same
            ? ["One dot is directly above the other, so the fractions are equal.", "一个点正好在另一个点的上面，所以两个分数相等。"]
            : [`The ${m > same ? "bottom" : "top"} dot is farther from 0.`, `${m > same ? "下面" : "上面"}的点离 0 更远。`],
          twoFractionLinesFigure(d, n, e, m),
        );
      },
    ),
  ],
);

const makingEquivalents = earlyTopic(
  "making-equivalent-fractions",
  ["Making Equivalent Fractions", "写出相等的分数"],
  [
    "Use bars to write a fraction equal to a given one, and recognize pairs that are not equal.",
    "用长条写出与已知分数相等的分数，并认出不相等的分数。",
  ],
  ["equivalent-fractions-on-number-lines"],
  ["3.NF.A.3"],
  [
    earlyPoint(
      "cutting-the-parts-again",
      ["Cutting the parts again", "把每份再分"],
      [
        "If you cut each part of a bar into 2 smaller parts, there are twice as many parts in all. The number of shaded parts doubles as well, but the shaded amount stays exactly the same. So $\\frac{1}{3}$ of a bar is also $\\frac{2}{6}$ of it. This is why two different fractions can name the same amount.",
        "把长条的每一份再分成 2 小份，总份数就变成两倍。涂色的份数也变成两倍，但涂色的部分一点也没变。所以长条的 $\\frac{1}{3}$ 也是它的 $\\frac{2}{6}$。这就是两个不同的分数可以表示同样多的原因。",
      ],
      (rng) => {
        const { n, d, m, e } = pickEqualPair(rng);
        const left = rng.bool();
        const sentence = left ? `${fr(n, d)} = ${fr("\\square", e)}` : `${fr("\\square", e)} = ${fr(n, d)}`;
        return whole(
          [
            `The two bars are the same size and show equal amounts. What number goes in the box? $${sentence}$`,
            `两个长条一样大，涂色部分也一样多。方框里填几？$${sentence}$`,
          ],
          m,
          [n, e, m + 1, m === 1 ? 2 : m - 1],
          [
            `The shaded part covers ${m} of the ${e} parts of the second bar, the same length as ${n} of the ${d} parts of the first.`,
            `第二个长条的涂色部分占 ${e} 份中的 ${m} 份，和第一个长条 ${d} 份中的 ${n} 份一样长。`,
          ],
          twoBarsFigure(d, n, e, m),
        );
      },
    ),
    earlyPoint(
      "finding-the-new-bottom-number",
      ["Finding the new bottom number", "求新的分母"],
      [
        "If the shaded parts have been doubled, then all of the parts must have been doubled. The same goes for tripling. So if $\\frac{1}{2}$ is written with 3 on top, it must have 6 on the bottom, as $1 \\times 3$ goes with $2 \\times 3$. Top and bottom must always be multiplied by the same number, or divided by the same number when going the other way.",
        "如果涂色的份数变成两倍，总份数也一定变成两倍。三倍也是一样。所以把 $\\frac{1}{2}$ 的分子写成 3，分母就一定是 6，因为分子乘 3，分母也要乘 3。分子和分母总要乘同一个数；反过来，就要除以同一个数。",
      ],
      (rng) => {
        const pair = rng.pick(equalPairs.filter(([a, b, c, f]) => c % a === 0 && f % b === 0));
        const [a, b, c, f] = pair;
        const up = rng.bool();
        const k = c / a;
        const [n, d, m, e] = up ? [a, b, c, f] : [c, f, a, b];
        const left = rng.bool();
        const sentence = left ? `${fr(n, d)} = ${fr(m, "\\square")}` : `${fr(m, "\\square")} = ${fr(n, d)}`;
        return whole(
          [`What number goes in the box? $${sentence}$`, `方框里填几？$${sentence}$`],
          e,
          [d, up ? d + m - n : d - (n - m), m, e + 1],
          up
            ? [
                `The top was multiplied by ${k}, so the bottom must be too: $${times(d, k)} = ${e}$.`,
                `分子乘了 ${k}，分母也要乘 ${k}：$${times(d, k)} = ${e}$。`,
              ]
            : [
                `The top was divided by ${k}, so the bottom must be too: $${div(d, k)} = ${e}$.`,
                `分子除以了 ${k}，分母也要除以 ${k}：$${div(d, k)} = ${e}$。`,
              ],
        );
      },
    ),
    earlyPoint(
      "which-is-not-equal",
      ["Which is not equal", "哪个不相等"],
      [
        "Adding the same number to the top and bottom does not make an equal fraction. For example, $\\frac{1}{2}$ is not equal to $\\frac{2}{3}$, which you can see by drawing the bars. To check two fractions, look at whether the same number multiplies both the top and the bottom. Only multiplying keeps the amount the same.",
        "分子和分母加上同一个数，得到的分数不相等。比如 $\\frac{1}{2}$ 和 $\\frac{2}{3}$ 不相等，画出长条就能看出来。要检查两个分数，就看分子和分母是不是乘了同一个数。只有乘同一个数，大小才不变。",
      ],
      (rng) => {
        // Third-grade denominators are 2, 3, 4, 6 and 8, which limits the families with enough equal fractions.
        const family = rng.pick<{
          readonly equal: readonly (readonly [number, number])[];
          readonly other: readonly (readonly [number, number])[];
        }>([
          {
            equal: [
              [1, 2],
              [2, 4],
              [3, 6],
              [4, 8],
            ],
            other: [
              [1, 3],
              [2, 3],
              [1, 4],
              [3, 4],
              [2, 6],
              [4, 6],
              [5, 6],
              [3, 8],
              [5, 8],
            ],
          },
          {
            equal: [
              [2, 2],
              [3, 3],
              [4, 4],
              [6, 6],
              [8, 8],
            ],
            other: [
              [1, 2],
              [2, 3],
              [3, 4],
              [5, 6],
              [7, 8],
              [3, 2],
              [4, 3],
              [5, 4],
            ],
          },
        ]);
        const [base, ...goods] = rng.sample(family.equal, 4) as [readonly [number, number], ...(readonly [number, number])[]];
        const [other] = rng.sample(family.other, 1) as [readonly [number, number]];
        const notEqual = fr(other[0], other[1]);
        const name = fr(base[0], base[1]);
        return chooseMath(
          rng,
          [`Which fraction is not equal to $${name}$?`, `哪个分数和 $${name}$ 不相等？`],
          notEqual,
          goods.map(([n, d]) => fr(n, d)),
          [
            `Draw the bars: each of the others covers the same part of the whole as $${name}$, and $${notEqual}$ does not.`,
            `画出长条：其他分数都和 $${name}$ 占整体同样多，而 $${notEqual}$ 不是。`,
          ],
        );
      },
    ),
  ],
);

const comparingWithPictures = earlyTopic(
  "comparing-fractions-with-pictures-and-lines",
  ["Comparing Fractions With Pictures and Lines", "用图和数轴比较分数"],
  [
    "Compare fractions with bars and number lines, and explain why the wholes must be the same size.",
    "用长条和数轴比较分数，并说明为什么整体要一样大。",
  ],
  ["comparing-fractions-with-a-common-part"],
  ["3.NF.A.3"],
  [
    earlyPoint(
      "comparing-on-two-bars",
      ["Comparing on two bars", "用两个长条比较"],
      [
        "When two bars are the same size, you can compare fractions by comparing how much of each bar is shaded. The bar with more shading shows the greater fraction. This works even when the bars are cut into different numbers of parts. Be sure to look at the amount shaded, rather than the number of shaded pieces.",
        "两个长条一样大时，比较涂色部分有多少，就能比较分数。涂色多的长条表示的分数更大。即使两个长条分的份数不同，这样比也行。要看涂色部分有多少，不要只数涂了几小块。",
      ],
      (rng) => {
        const [d1, d2] = rng.sample([2, 3, 4, 6, 8], 2) as [number, number];
        const n1 = rng.int(1, d1 - 1);
        const n2 = rng.int(1, d2 - 1);
        const diff = n1 * d2 - n2 * d1;
        return compareProblem(
          fr(n1, d1),
          fr(n2, d2),
          diff < 0 ? 0 : diff === 0 ? 1 : 2,
          diff === 0
            ? t("The shaded parts of the two bars are the same length.", "两个长条的涂色部分一样长。")
            : t(
                `The shaded part of the ${diff > 0 ? "top" : "bottom"} bar is longer.`,
                `${diff > 0 ? "上面" : "下面"}长条的涂色部分更长。`,
              ),
          twoBarsFigure(d1, n1, d2, n2),
        );
      },
    ),
    {
      ...earlyPoint(
        "comparing-on-two-lines",
        ["Comparing on two lines", "用两条数轴比较"],
        [
          "On number lines of the same length, the fraction farther to the right is the greater one. It does not matter how the lines are cut. Find each dot, and see which is farther from 0. If the dots line up, the fractions are equal. This method also works well for fractions with quite different bottom numbers.",
          "在一样长的数轴上，越靠右的分数越大，和数轴怎样分没有关系。找到每个点，看哪个离 0 更远。如果两个点对齐，两个分数就相等。分母差得很多的分数，也可以用这个方法。",
        ],
        (rng) => {
          const [d1, d2] = rng.sample([2, 3, 4, 6, 8], 2) as [number, number];
          const n1 = rng.int(1, d1 - 1);
          const n2 = rng.int(1, d2 - 1);
          const diff = n1 * d2 - n2 * d1;
          return compareProblem(
            fr(n1, d1),
            fr(n2, d2),
            diff < 0 ? 0 : diff === 0 ? 1 : 2,
            diff === 0
              ? t("The two dots line up, so the fractions are equal.", "两个点对齐，所以两个分数相等。")
              : t(`The ${diff > 0 ? "top" : "bottom"} dot is farther from 0.`, `${diff > 0 ? "上面" : "下面"}的点离 0 更远。`),
            twoFractionLinesFigure(d1, n1, d2, n2),
          );
        },
      ),
      figure: gradeDrawings2["comparing-fractions-with-pictures-and-lines#comparing-on-two-lines"],
    },
    earlyPoint(
      "the-whole-matters",
      ["The whole matters", "整体很重要"],
      [
        "Fractions can only be compared fairly when they are fractions of the same whole. One half of a small pizza is less than one half of a large pizza, even though both are one half. One fourth of a big cake could even be more than one half of a tiny cake. So always ask what each fraction is a fraction of.",
        "只有整体相同，才能公平地比较分数。小披萨的一半比大披萨的一半少，虽然它们都是二分之一。大蛋糕的四分之一甚至可能比很小的蛋糕的一半还多。所以一定要问：这是谁的几分之几？",
      ],
      (rng) => {
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const food = rng.pick<Pair>([
          ["pizza", "披萨"],
          ["cake", "蛋糕"],
          ["pie", "馅饼"],
          ["sandwich", "三明治"],
          ["chocolate bar", "巧克力"],
        ]);
        const d = rng.pick([2, 3, 4, 6, 8]);
        const unit =
          food[0] === "chocolate bar" ? "块" : food[0] === "sandwich" ? "个" : food[0] === "pizza" || food[0] === "pie" ? "张" : "块";
        const correct: Pair = [`${p}, because the same fraction of a larger whole is more`, `${p}，因为整体越大，同样的几分之几就越多`];
        return choose(
          rng,
          [
            `${p} eats $${fr(1, d)}$ of a large ${food[0]}. ${q} eats $${fr(1, d)}$ of a small ${food[0]}. Who eats more?`,
            `${p} 吃了一${unit}大${food[1]}的 $${fr(1, d)}$，${q} 吃了一${unit}小${food[1]}的 $${fr(1, d)}$。谁吃得多？`,
          ],
          correct,
          rng.shuffle<Pair>([
            [`${q}, because the same fraction of a smaller whole is more`, `${q}，因为整体越小，同样的几分之几就越多`],
            [`They eat the same, because the fractions are the same`, `一样多，因为分数相同`],
            [`${q}, because small pieces are worth more`, `${q}，因为小的部分更值钱`],
          ]),
          [
            `Both ate $${fr(1, d)}$, but of different wholes, and ${p}'s whole is larger.`,
            `两人都吃了 $${fr(1, d)}$，但整体不同，${p} 的整体更大。`,
          ],
        );
      },
    ),
  ],
);

const elapsedOnALine = earlyTopic(
  "elapsed-time-on-a-number-line",
  ["Elapsed Time on a Number Line", "在时间线上算经过的时间"],
  [
    "Use jumps on a time line to find an end time, a length of time or a missing jump.",
    "用时间线上的跳跃，求出结束时间、经过的时间或缺少的一跳。",
  ],
  ["elapsed-time-in-minutes"],
  ["3.MD.A.1"],
  [
    {
      ...earlyPoint(
        "jumping-to-an-end-time",
        ["Jumping to an end time", "跳到结束时间"],
        [
          "A time line works like a number line whose numbers are times. Start at the first time and jump forward by the minutes you have. It helps to make the first jump land on the hour, because the minutes begin again from zero there. Remember that an hour has 60 minutes, and not 100, so 3:50 and 10 minutes is 4:00.",
          "时间线就像写着时间的数轴。从开始的时间出发，往前跳给定的分钟数。第一跳最好落在整点，因为那里分钟又从 0 开始。记住，一小时是 60 分钟，不是 100 分钟，所以 3:50 过 10 分钟是 4:00。",
        ],
        (rng) => {
          const hour = rng.int(1, 10);
          const toHour = 5 * rng.int(1, 6);
          const start = 60 * hour + 60 - toHour;
          const after = 5 * rng.int(2, 8);
          const end = start + toHour + after;
          const answer = clockText(end);
          return reasoned(
            choose(
              rng,
              ["The jumps start at the first time. What time do they end?", "从第一个时间开始跳。跳到什么时间结束？"],
              [answer, answer],
              rng.shuffle([clockText(end + 60), clockText(end - 60), clockText(end - 10), clockText(end + 10)]).map((s): Pair => [s, s]),
              [
                `${toHour} minutes reach ${clockText(start + toHour)}, and ${after} more minutes reach ${answer}.`,
                `${toHour} 分钟到 ${clockText(start + toHour)}，再过 ${after} 分钟到 ${answer}。`,
              ],
              timeHopsFigure([start, start + toHour, end], true),
            ),
            [
              [
                clockText(end + 60),
                "This is one hour too late: the jumps add only minutes here.",
                "这晚了一小时：这里的跳跃加的只是分钟。",
              ],
              [
                clockText(end - 60),
                "This is one hour too early: the hour changes when the jumps pass the hour mark.",
                "这早了一小时：跳跃经过整点时，小时才会变。",
              ],
              [clockText(end - 10), "This is 10 minutes too early: add both jumps.", "这早了 10 分钟：两次跳跃都要加上。"],
              [clockText(end + 10), "This is 10 minutes too late: add only the two jumps.", "这晚了 10 分钟：只加这两次跳跃。"],
            ],
          );
        },
      ),
      figure: gradeDrawings["jumping-to-an-end-time"],
    },
    earlyPoint(
      "adding-the-jumps",
      ["Adding the jumps", "把跳的时间加起来"],
      [
        "To find how long something lasted, jump from the start time to the end time, and add up all your jumps. The answer is the total of the numbers above the jumps, and not the numbers on the line. So going from 2:45 to 3:20 takes a jump of 15 minutes and a jump of 20 minutes, which makes 35 minutes.",
        "要求一件事用了多长时间，就从开始的时间跳到结束的时间，再把跳的分钟数都加起来。答案是跳跃上方的数的和，不是线上的时间。所以从 2:45 到 3:20，要跳 15 分钟和 20 分钟，一共 35 分钟。",
      ],
      (rng) => {
        const hour = rng.int(1, 10);
        const toHour = 5 * rng.int(1, 7);
        const start = 60 * hour + 60 - toHour;
        const after = 5 * rng.int(1, 8);
        const end = start + toHour + after;
        return whole(
          ["How many minutes long is the time from the first time to the last?", "从第一个时间到最后一个时间，一共是多少分钟？"],
          toHour + after,
          [toHour, after, toHour + after + 60, Math.abs((end % 60) - (start % 60))],
          [
            `The time is the two jumps together: $${toHour} + ${after} = ${toHour + after}$ minutes.`,
            `经过的时间是两次跳的和：$${toHour} + ${after} = ${toHour + after}$ 分钟。`,
          ],
          timeHopsFigure([start, start + toHour, end]),
        );
      },
    ),
    earlyPoint(
      "the-missing-time-jump",
      ["The missing time jump", "缺少的一跳"],
      [
        "If you know the times at both ends of a jump, you can find how long it is. A jump that ends on the hour is the number of minutes left in that hour. So a jump from 4:35 to 5:00 is 25 minutes. A jump that starts on the hour is the minutes shown on the later clock. So 5:00 to 5:40 is 40 minutes.",
        "知道一跳两端的时间，就能求出这一跳有多长。跳到整点的那一跳，就是这个小时还剩下的分钟数。所以从 4:35 到 5:00 是 25 分钟。从整点开始的那一跳，就是后面时间的分钟数。所以从 5:00 到 5:40 是 40 分钟。",
      ],
      (rng) => {
        const hour = rng.int(1, 10);
        const toHour = 5 * rng.int(1, 8);
        const start = 60 * hour + 60 - toHour;
        const after = 5 * rng.int(1, 9);
        const end = start + toHour + after;
        const first = rng.bool();
        const answer = first ? toHour : after;
        return whole(
          ["How many minutes is the jump with the question mark?", "问号这一跳是多少分钟？"],
          answer,
          first ? [100 - (60 - toHour), 60 - toHour, after] : [toHour, 60 - after, toHour + after],
          [
            `That jump goes from ${clockText(first ? start : start + toHour)} to ${clockText(first ? start + toHour : end)}, which is ${answer} minutes.`,
            `这一跳从 ${clockText(first ? start : start + toHour)} 到 ${clockText(first ? start + toHour : end)}，是 ${answer} 分钟。`,
          ],
          timeHopsFigure([start, start + toHour, end], false, first ? 0 : 1),
        );
      },
    ),
  ],
);

const startAndEnd = earlyTopic(
  "start-and-end-times",
  ["Start and End Times", "开始和结束的时间"],
  [
    "Find an end time or a start time from a clock and an amount of time, or from two activities in a row.",
    "根据钟面和经过的时间，或者连续的两件事，求出结束或开始的时间。",
  ],
  ["elapsed-time-on-a-number-line"],
  ["3.MD.A.1"],
  [
    earlyPoint(
      "finding-the-end-time",
      ["Finding the end time", "求结束的时间"],
      [
        "To find when something ends, start from the time on the clock and count on the minutes it lasts. Add the minutes. If you pass 60, go to the next hour, and keep what is over 60 as the new minutes. Read the clock carefully first, as the short hand tells the hour and the long hand tells the minutes.",
        "要求一件事什么时候结束，就从钟面上的时间开始，往后数它用的分钟数。把分钟加起来，超过 60，就进到下一个小时，超过的部分就是新的分钟数。先仔细读钟面：短针表示小时，长针表示分钟。",
      ],
      (rng) => {
        const h = rng.int(1, 10);
        const m = rng.int(1, 11) * 5 + rng.pick([0, 0, 2, 3]);
        const add = rng.int(3, 11) * 5;
        const start = 60 * h + m;
        const answer = clockText(start + add);
        const job = rng.pick<Pair>([
          ["A movie clip", "一段影片"],
          ["A swim lesson", "一节游泳课"],
          ["A piano lesson", "一节钢琴课"],
          ["A soccer game", "一场足球赛"],
          ["A craft class", "一节手工课"],
        ]);
        return choose(
          rng,
          [
            `${job[0]} starts at the time on this clock and lasts ${add} minutes. When does it end?`,
            `${job[1]}在钟面显示的时间开始，一共 ${add} 分钟。它什么时候结束？`,
          ],
          [answer, answer],
          rng
            .shuffle([clockText(start + add + 40), clockText(start + add - 60), clockText(start + add + 10), clockText(start)])
            .map((s): Pair => [s, s]),
          [`${clockText(start)} and ${add} minutes later is ${answer}.`, `${clockText(start)} 过 ${add} 分钟是 ${answer}。`],
          clockFigure(h, m),
        );
      },
    ),
    earlyPoint(
      "finding-the-start-time",
      ["Finding the start time", "求开始的时间"],
      [
        "To find when something started, count back from the end. If a class ended at 2:15 and lasted 40 minutes, jump back 15 minutes to 2:00, and then 25 more minutes to 1:35. Going back past the hour means the hour number goes down by 1. Check your answer by counting forward again to see that you reach the end time.",
        "要求一件事什么时候开始，就从结束的时间往回数。一节课 2:15 结束，用了 40 分钟，先往回跳 15 分钟到 2:00，再往回跳 25 分钟到 1:35。往回跨过整点时，小时数要减 1。可以再往后数一遍来检查，看能不能回到结束的时间。",
      ],
      (rng) => {
        const h = rng.int(2, 11);
        const m = rng.int(1, 8) * 5;
        const take = m + rng.int(1, 7) * 5;
        const end = 60 * h + m;
        const answer = clockText(end - take);
        const name = rng.pick(earlyNames);
        const job = rng.pick<Pair>([
          ["reading", "看书"],
          ["painting", "画画"],
          ["practicing piano", "练钢琴"],
          ["cleaning up", "打扫"],
          ["doing homework", "做作业"],
        ]);
        return choose(
          rng,
          [
            `${name} finished ${job[0]} at the time on this clock, after ${take} minutes. What time did ${name} start?`,
            `${name} ${job[1]}用了 ${take} 分钟，结束时的时间如钟面所示。${name} 是几点几分开始的？`,
          ],
          [answer, answer],
          rng
            .shuffle([clockText(end + take), clockText(end - take + 60), clockText(end - take + 10), clockText(end - take - 10)])
            .map((s): Pair => [s, s]),
          [
            `Going back ${m} minutes reaches ${h}:00, and ${take - m} more minutes reach ${answer}.`,
            `往回 ${m} 分钟到 ${h}:00，再往回 ${take - m} 分钟到 ${answer}。`,
          ],
          clockFigure(h, m),
        );
      },
    ),
    earlyPoint(
      "two-activities-in-a-row",
      ["Two activities in a row", "连续的两件事"],
      [
        "When one activity follows another, add their times together first to get the total minutes. Then count on from the start. If someone reads for 25 minutes and then draws for 20, that makes 45 minutes altogether. If the reader started at 4:10, the drawing ends at 4:55. Both activities have to be counted, and not only the last.",
        "一件事接着另一件事时，先把两段时间加起来，再从开始的时间往后数。看书 25 分钟，再画画 20 分钟，一共 45 分钟。如果 4:10 开始看书，画画就在 4:55 结束。两件事都要算上，不能只算最后一件。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const h = rng.int(1, 10);
        const m = 5 * rng.int(0, 5);
        const a = 5 * rng.int(2, 7);
        const b = 5 * rng.int(2, 7);
        const start = 60 * h + m;
        const answer = clockText(start + a + b);
        return choose(
          rng,
          [
            `${name} starts reading at ${clockText(start)}. ${name} reads for ${a} minutes and then draws for ${b} minutes. When does ${name} finish?`,
            `${name} ${clockText(start)} 开始看书，看了 ${a} 分钟，接着画了 ${b} 分钟的画。${name} 什么时候结束？`,
          ],
          [answer, answer],
          rng
            .shuffle([clockText(start + a), clockText(start + b), clockText(start + a + b + 10), clockText(start + a + b + 60)])
            .map((s): Pair => [s, s]),
          [
            `$${a} + ${b} = ${a + b}$ minutes in all, and ${clockText(start)} plus ${a + b} minutes is ${answer}.`,
            `一共 $${a} + ${b} = ${a + b}$ 分钟，${clockText(start)} 过 ${a + b} 分钟是 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const scalesAndBeakers = earlyTopic(
  "reading-scales-and-beakers",
  ["Reading Scales and Beakers", "读秤和量杯"],
  [
    "Read masses on a dial and liquid volumes in a measuring cup, working out what each mark means.",
    "读秤盘上的质量和量杯中的液体体积，并弄清每个刻度表示多少。",
  ],
  ["grams-kilograms-and-liters"],
  ["3.MD.A.2"],
  [
    earlyPoint(
      "reading-a-dial",
      ["Reading a dial", "读秤盘"],
      [
        "A dial on a scale has marks around a curve, and a needle points to the mass. Not every mark has a number. First find what each small mark is worth, by looking at two numbered marks and counting the spaces between them. Then read from the nearest number. A dial that goes up by 100 cannot be read as if it went up by 10.",
        "秤盘上有一圈刻度，指针指着质量。不是每个刻度都标了数。先看两个标了数的刻度，数一数它们之间有几格，算出每小格表示多少。再从最近的数开始读。每格 100 的秤盘，不能当作每格 10 来读。",
      ],
      (rng) => {
        const kg = rng.bool();
        const max = kg ? rng.pick([10, 20]) : 1000;
        const step = kg ? max / 10 : 100;
        const value = step * rng.int(1, 9);
        const unit = kg ? ["kg", "千克"] : ["g", "克"];
        return whole(
          [`What mass does the scale show, in ${kg ? "kilograms" : "grams"}?`, `这个秤显示的质量是多少${unit[1]}？`],
          value,
          [value + step, value - step, value / step],
          [
            `Each mark is worth ${step}, and the needle is ${value / step} marks from 0, which is ${value}.`,
            `每个刻度表示 ${step}，指针离 0 有 ${value / step} 格，表示 ${value}。`,
          ],
          dialScaleFigure(value, max, step, unit[0] as string, 2),
        );
      },
    ),
    earlyPoint(
      "reading-a-measuring-cup",
      ["Reading a measuring cup", "读量杯"],
      [
        "A measuring cup has marks up its side. To read it, look at where the top of the liquid is, level with your eye. As with a dial, not every mark may have a number, so work out what each one is worth. If the numbers go up by 2 and there is a mark halfway between them, that mark is worth 1.",
        "量杯的侧面有刻度。读数时，眼睛要和液面平齐，看液面到了哪里。和秤盘一样，不一定每个刻度都标了数，所以要算出每格表示多少。如果标的数每次多 2，两个数中间有一个刻度，那么每格就是 1。",
      ],
      (rng) => {
        const step = rng.pick([1, 2, 5]);
        const max = step * 10;
        const level = step * rng.int(1, 9);
        return whole(
          ["How many liters of water are in this measuring cup?", "这个量杯里有多少升水？"],
          level,
          [level + step, level - step, level / step],
          [
            `Each mark is worth ${step} ${step === 1 ? "liter" : "liters"}, and the water is at ${level}.`,
            `每个刻度表示 ${step} 升，水面到了 ${level}。`,
          ],
          beakerFigure(level, max, step, "L", 2),
        );
      },
    ),
    earlyPoint(
      "adding-to-a-measure",
      ["Adding to a measure", "在读数的基础上增减"],
      [
        "Once you have read a scale or a beaker, you can use the number in a story. If there are 6 liters in a tub and someone pours in 3 more, then add. If some are poured out, then subtract. If you need to know how much more will fill it up, subtract what is there from the top of the scale.",
        "读出秤或量杯的数后，就可以用在故事里。桶里有 6 升水，又倒进 3 升，就用加法。如果倒出一些，就用减法。如果要知道还要多少才能装满，就用最上面的刻度减去现在的数。",
      ],
      (rng) => {
        const max = 10;
        const level = rng.int(2, 8);
        const form = rng.int(0, 2);
        const figure = beakerFigure(level, max, 1, "L", 2);
        if (form === 0) {
          const more = rng.int(1, max - level);
          return whole(
            [
              `${more} more ${more === 1 ? "liter is" : "liters are"} poured into this beaker. How many liters are in it now?`,
              `再往这个量杯里倒 ${more} 升水。现在有多少升水？`,
            ],
            level + more,
            [Math.abs(level - more), level, level + more + 1],
            [
              `The beaker shows ${level} liters, and $${level} + ${more} = ${level + more}$.`,
              `量杯里有 ${level} 升，$${level} + ${more} = ${level + more}$。`,
            ],
            figure,
          );
        }
        if (form === 1) {
          const out = rng.int(1, level - 1);
          return whole(
            [
              `${out} ${out === 1 ? "liter is" : "liters are"} poured out of this beaker. How many liters are left?`,
              `从这个量杯里倒出 ${out} 升水。还剩多少升水？`,
            ],
            level - out,
            [level + out, level, out],
            [
              `The beaker shows ${level} liters, and $${level} - ${out} = ${level - out}$.`,
              `量杯里有 ${level} 升，$${level} - ${out} = ${level - out}$。`,
            ],
            figure,
          );
        }
        return whole(
          ["How many more liters will fill this beaker up to the top mark?", "还要倒多少升水，才能到最上面的刻度？"],
          max - level,
          [level, max, max + level],
          [
            `The top mark is ${max} and the water is at ${level}, and $${max} - ${level} = ${max - level}$.`,
            `最上面的刻度是 ${max}，水面在 ${level}，$${max} - ${level} = ${max - level}$。`,
          ],
          figure,
        );
      },
    ),
  ],
);

const measuringFourths = earlyTopic(
  "measuring-to-halves-and-fourths-of-an-inch",
  ["Measuring to Halves and Fourths of an Inch", "量到半英寸和四分之一英寸"],
  ["Read a ruler marked in halves and fourths of an inch.", "读标有半英寸和四分之一英寸刻度的尺子。"],
  ["measuring-length-in-inches-and-centimeters"],
  ["3.MD.B.4"],
  [
    earlyPoint(
      "to-the-nearest-half-inch",
      ["To the nearest half inch", "量到半英寸"],
      [
        "On a ruler with marks halfway between the inches, each small space is half of an inch. To read a length, first look at how many whole inches it passes. Then see whether it also reaches the half mark. A bar that ends halfway between 2 and 3 is $2\\frac{1}{2}$ inches long. It is not $3\\frac{1}{2}$ inches long.",
        "如果尺子上每英寸的中间有一个刻度，每一小格就是半英寸。读长度时，先看过了几个整英寸，再看有没有到中间的刻度。在 2 和 3 正中间结束的长条，长 $2\\frac{1}{2}$ 英寸，不是 $3\\frac{1}{2}$ 英寸。",
      ],
      (rng) => {
        const w = rng.int(1, 5);
        const inches = rng.int(w + 1, 6);
        const answer = mx(w, 1, 2);
        return chooseMath(
          rng,
          ["How many inches long is the bar?", "这个长条长多少英寸？"],
          answer,
          rng.shuffle([mx(w + 1, 1, 2), mx(w, 1, 4), `${w}`, `${w + 1}`]),
          [`The bar passes ${w} ${w === 1 ? "inch" : "inches"} and reaches the halfway mark.`, `长条过了 ${w} 英寸，又到了中间的刻度。`],
          inchRulerFigure(4 * w + 2, inches, 2),
        );
      },
    ),
    earlyPoint(
      "to-the-nearest-fourth-inch",
      ["To the nearest fourth of an inch", "量到四分之一英寸"],
      [
        "On a ruler marked in fourths, there are 4 spaces in each inch. The longest marks are the inches, the middle ones are the halves, and the shortest ones are the odd fourths. Count spaces past the last whole inch. One space is $\\frac{1}{4}$, two spaces are $\\frac{1}{2}$, and three spaces are $\\frac{3}{4}$. Counting marks instead of spaces will mislead you.",
        "标有四分之一英寸的尺子，每英寸有 4 格。最长的刻度是整英寸，中等的是半英寸，最短的是四分之一和四分之三。从最后一个整英寸开始往后数格子。一格是 $\\frac{1}{4}$，两格是 $\\frac{1}{2}$，三格是 $\\frac{3}{4}$。数刻度而不是数格子，就会出错。",
      ],
      (rng) => {
        const w = rng.int(0, 4);
        const r = rng.pick([1, 3]);
        const inches = rng.int(Math.max(w + 1, 3), 5);
        const answer = mx(w, r, 4);
        return chooseMath(
          rng,
          ["How many inches long is the bar?", "这个长条长多少英寸？"],
          answer,
          rng.shuffle([mx(w, 4 - r, 4), mx(w + 1, r, 4), mx(w, 1, 2), mx(w, r, 8)]),
          [
            `The bar is ${r} ${r === 1 ? "space" : "spaces"} past ${w}, and each space is $${fr(1, 4)}$ of an inch.`,
            `长条比 ${w} 多 ${r} 格，每格是 $${fr(1, 4)}$ 英寸。`,
          ],
          inchRulerFigure(4 * w + r, inches, 4),
        );
      },
    ),
    earlyPoint(
      "how-many-fourths-in-all",
      ["How many fourths in all", "一共有几个四分之一"],
      [
        "Since 4 fourths make an inch, you can count a whole length in fourths. A bar that is 2 inches long has 8 fourths, and with 1 more fourth it has 9. To find the total, multiply the whole inches by 4, and then add the extra fourths. Each space on the ruler is one of these fourths.",
        "4 个四分之一英寸是 1 英寸，所以可以把整个长度用四分之一英寸来数。2 英寸长的长条有 8 个四分之一英寸，再多 1 格就是 9 个。要求总数，就用整英寸数乘 4，再加上多出来的格数。尺子上每一格就是一个四分之一英寸。",
      ],
      (rng) => {
        const w = rng.int(0, 4);
        const r = rng.int(1, 3);
        const inches = rng.int(Math.max(w + 1, 3), 5);
        const total = 4 * w + r;
        return whole(
          [
            `Each space on this ruler is $${fr(1, 4)}$ of an inch. How many of these spaces long is the bar?`,
            `尺子上每格是 $${fr(1, 4)}$ 英寸。这个长条有多少格长？`,
          ],
          total,
          [w + r, total + 4, total + 1],
          [
            `${w} ${w === 1 ? "inch is" : "inches are"} ${4 * w} spaces, and ${r} more ${r === 1 ? "makes" : "make"} ${total}.`,
            `${w} 英寸是 ${4 * w} 格，再加 ${r} 格是 ${total} 格。`,
          ],
          inchRulerFigure(total, inches, 4),
        );
      },
    ),
  ],
);

/** halfDots picks the row values of a picture graph in whole and half symbols. */
function halfDots(rng: Rng, rows: number): number[] {
  return [...Array(rows).keys()].map(() => rng.int(1, 6) + rng.pick([0, 0.5]));
}

const halfSymbols = earlyTopic(
  "picture-graphs-with-half-symbols",
  ["Picture Graphs With Half Symbols", "有半个图案的象形统计图"],
  ["Read picture graphs where half a symbol stands for half of the key.", "读半个图案表示一半的象形统计图。"],
  ["scaled-picture-graphs"],
  ["3.MD.B.3"],
  [
    {
      ...earlyPoint(
        "what-half-a-symbol-means",
        ["What half a symbol means", "半个图案表示多少"],
        [
          "In a picture graph, a key tells you what one whole symbol stands for. Half a symbol stands for half of that amount. So if a whole circle means 10 books, a half circle means 5 books. Halves only work for keys that can be cut in half evenly, such as 2, 4, 6 and 10, so graphs like these use those keys.",
          "象形统计图的图例告诉你一个完整的图案表示多少。半个图案就表示它的一半。所以如果一个圆表示 10 本书，半个圆就表示 5 本书。只有 2、4、6、10 这样能平均分成两半的数，才能这样用半个图案，所以这种图常用这些数作图例。",
        ],
        (rng) => {
          const per = rng.pick([2, 4, 6, 8, 10, 20]);
          const rowCount = rng.int(2, 3);
          const labels = ["A", "B", "C"].slice(0, rowCount);
          return whole(
            [
              `In this graph, each whole circle stands for ${per} books. How many books does a half circle stand for?`,
              `在这张图中，一个完整的圆表示 ${per} 本书。半个圆表示多少本书？`,
            ],
            per / 2,
            [per, 2 * per, per - 1],
            [
              `A half circle stands for half of what a whole circle does, and half of ${per} is ${per / 2}.`,
              `半个圆表示的是一个圆的一半，${per} 的一半是 ${per / 2}。`,
            ],
            halfPictureGraphFigure(labels, halfDots(rng, rowCount)),
          );
        },
      ),
      figure: gradeDrawings2["picture-graphs-with-half-symbols#what-half-a-symbol-means"],
    },
    {
      ...earlyPoint(
        "reading-a-row-with-a-half",
        ["Reading a row with a half", "读有半个图案的一行"],
        [
          "To read a row with a half symbol, multiply the whole symbols by the key, and then add half of the key. If each circle is 4 and there are 3 and a half circles, then the row shows $3 \\times 4$, which is 12, and then 2 more for the half, making 14. Counting the half as a whole symbol gives 16.",
          "读有半个图案的一行时，先用完整图案的个数乘图例的数，再加上图例的一半。如果每个圆表示 4，有 3 个半圆，就是 $3 \\times 4 = 12$，再加半个圆的 2，一共 14。把半个圆当成一整个，就会算成 16。",
        ],
        (rng) => {
          const per = rng.pick([2, 4, 6, 10]);
          const labels = ["A", "B", "C"];
          const dots = halfDots(rng, 3);
          dots[rng.int(0, 2)] = rng.int(1, 5) + 0.5;
          const half = dots.findIndex((v) => v % 1 !== 0);
          const value = dots[half] as number;
          const answer = value * per;
          return whole(
            [
              `Each whole circle stands for ${per} stickers. How many stickers does row ${labels[half]} show?`,
              `一个完整的圆表示 ${per} 张贴纸。${labels[half]} 这一行表示多少张贴纸？`,
            ],
            answer,
            [(Math.floor(value) + 1) * per, Math.floor(value) * per, Math.floor(value) + 1],
            [
              `${Math.floor(value)} whole circles make ${Math.floor(value) * per}, and the half circle adds ${per / 2}, which makes ${answer}.`,
              `${Math.floor(value)} 个完整的圆是 ${Math.floor(value) * per}，半个圆再加 ${per / 2}，一共 ${answer}。`,
            ],
            halfPictureGraphFigure(labels, dots),
          );
        },
      ),
      figure: gradeDrawings["reading-a-row-with-a-half"],
    },
    {
      ...earlyPoint(
        "comparing-rows-with-halves",
        ["Comparing rows with halves", "比较有半个图案的行"],
        [
          "To compare two rows, you can find the value of each row and subtract. There is also a quicker way. Find how many more symbols one row has, and multiply that by the key. If one row has $1\\frac{1}{2}$ more circles and each circle is 4, then it has $4 + 2$, or 6, more. Either way gives the same answer.",
          "要比较两行，可以先算出每行的值，再相减。还有一种更快的办法：先看一行比另一行多几个图案，再乘图例的数。如果一行多 $1\\frac{1}{2}$ 个圆，每个圆表示 4，就多 $4 + 2$，等于 6。两种方法答案一样。",
        ],
        (rng) => {
          const per = rng.pick([2, 4, 6, 10]);
          const labels = ["A", "B", "C"];
          const dots = halfDots(rng, 3);
          const [i, j] = rng.sample([0, 1, 2], 2) as [number, number];
          dots[i] = (dots[j] as number) + rng.int(1, 3) + 0.5;
          const big = dots[i] as number;
          const small = dots[j] as number;
          const answer = (big - small) * per;
          return whole(
            [
              `Each whole circle stands for ${per} votes. How many more votes does row ${labels[i]} have than row ${labels[j]}?`,
              `一个完整的圆表示 ${per} 票。${labels[i]} 这一行比 ${labels[j]} 这一行多多少票？`,
            ],
            answer,
            [big - small + 0.5, big * per, small * per, answer + per].map((v) => Math.round(v)),
            [
              `Row ${labels[i]} has ${big * per} votes and row ${labels[j]} has ${small * per}, and $${big * per} - ${small * per} = ${answer}$.`,
              `${labels[i]} 这一行有 ${big * per} 票，${labels[j]} 这一行有 ${small * per} 票，$${big * per} - ${small * per} = ${answer}$。`,
            ],
            halfPictureGraphFigure(labels, dots),
          );
        },
      ),
      figure: gradeDrawings2["picture-graphs-with-half-symbols#comparing-rows-with-halves"],
    },
  ],
);

const choosingScale = earlyTopic(
  "choosing-a-scale-and-drawing-bars",
  ["Choosing a Scale and Drawing Bars", "选择刻度和画条形图"],
  [
    "Choose a sensible scale for a set of data, and work out how tall each bar should be.",
    "为一组数据选择合适的刻度，并算出每个条应该画多高。",
  ],
  ["scaled-bar-graphs"],
  ["3.MD.B.3"],
  [
    {
      ...earlyPoint(
        "which-scale-fits",
        ["Which scale fits", "哪种刻度合适"],
        [
          "A good scale lets all the bars fit on the graph, and lets you read them exactly. If the numbers are all multiples of 5, a scale that counts by 5s is a good choice. A scale that counts by 1s would make the graph much too tall, and a scale that counts by 100s would make all of the bars tiny and hard to read.",
          "好的刻度能让所有的条都画得下，读起来也准确。如果这些数都是 5 的倍数，按 5 增加的刻度就很合适。按 1 增加，图就太高了。按 100 增加，所有的条都很矮，很难读。",
        ],
        (rng) => {
          const options: readonly { step: number; say: Pair }[] = [
            { step: 2, say: ["Count by 2s", "按 2 增加"] },
            { step: 5, say: ["Count by 5s", "按 5 增加"] },
            { step: 10, say: ["Count by 10s", "按 10 增加"] },
            { step: 100, say: ["Count by 100s", "按 100 增加"] },
            { step: 1000, say: ["Count by 1000s", "按 1000 增加"] },
          ];
          const at = rng.int(0, 3);
          const best = options[at] as (typeof options)[number];
          const pool: readonly number[] = best.step === 5 ? [1, 3, 5, 7, 9] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const data = rng.sample(pool, 4).map((v) => v * best.step);
          const others = options.filter((o) => o !== best);
          return choose(
            rng,
            [
              `These numbers go on a bar graph: ${data.join(", ")}. Which scale is the best choice?`,
              `要把这些数画成条形图：${data.join("、")}。哪种刻度最合适？`,
            ],
            best.say,
            rng.shuffle(others).map((o) => o.say),
            [
              `All of the numbers are multiples of ${best.step}, and a scale counting by ${best.step}s fits them with a graph of a good size.`,
              `这些数都是 ${best.step} 的倍数，按 ${best.step} 增加的刻度，图的大小也正合适。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["choosing-a-scale-and-drawing-bars#which-scale-fits"],
    },
    {
      ...earlyPoint(
        "how-many-spaces-tall",
        ["How many spaces tall", "画多少格高"],
        [
          "When a scale counts by more than 1, a bar is not as many spaces tall as its value. To find the height, divide the value by the step. A value of 35 on a scale counting by 5s is 7 spaces tall, as $35 \\div 5 = 7$. If you drew 35 spaces, then the bar would not fit on the graph.",
          "刻度不是按 1 增加时，条的格数和它表示的数不一样。求高度，就用这个数除以每格的大小。按 5 增加的刻度上，35 就是 7 格高，因为 $35 \\div 5 = 7$。如果画 35 格，就画不下了。",
        ],
        (rng) => {
          const step = rng.pick([2, 5, 10, 20]);
          const spaces = rng.int(2, 9);
          const value = step * spaces;
          return whole(
            [
              `A bar graph's scale counts by ${step}s. How many spaces tall should a bar for ${value} be?`,
              `条形图的刻度按 ${step} 增加。表示 ${value} 的条应该画多少格高？`,
            ],
            spaces,
            [value, value + step, spaces + 1],
            [
              `Each space stands for ${step}, so divide: $${div(value, step)} = ${spaces}$ spaces.`,
              `每格表示 ${step}，所以用除法：$${div(value, step)} = ${spaces}$ 格。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["choosing-a-scale-and-drawing-bars#how-many-spaces-tall"],
    },
    earlyPoint(
      "reading-a-bar-between-marks",
      ["Reading a bar between marks", "读两个刻度之间的条"],
      [
        "A bar may stop halfway between two marks on the scale. Its value is then halfway between those two numbers. On a scale counting by 10s, a bar stopping halfway between 30 and 40 shows 35. You can only use this when the marks are far enough apart for a halfway point to make sense, as with 2s, 10s and 20s.",
        "条可能停在两个刻度的正中间，它表示的数就在这两个数的正中间。在按 10 增加的刻度上，停在 30 和 40 正中间的条表示 35。只有每格足够大，比如 2、10、20，才会这样读。",
      ],
      (rng) => {
        const step = rng.pick([2, 10, 20]);
        const labels = ["A", "B", "C"];
        const at = rng.int(0, 2);
        const values = labels.map(() => step * rng.int(1, 6));
        const asked = (values[at] as number) + step / 2;
        values[at] = asked;
        return whole(
          [`What number does bar ${labels[at]} show?`, `${labels[at]} 这个条表示什么数？`],
          asked,
          [asked - step / 2, asked + step / 2, asked + step],
          [
            `The bar stops halfway between ${asked - step / 2} and ${asked + step / 2}, so it shows ${asked}.`,
            `这个条停在 ${asked - step / 2} 和 ${asked + step / 2} 的正中间，所以表示 ${asked}。`,
          ],
          barGraphFigure(labels, values, step),
        );
      },
    ),
  ],
);

/** plotValues draws lengths in fourths for a line plot running from the given start to four steps later. */
function plotValues(rng: Rng, lo: number, step: number) {
  const ticks = [0, 1, 2, 3, 4].map((i) => lo + i * step);
  const counts = ticks.map(() => rng.int(0, 5));
  counts[rng.int(0, 4)] = rng.int(1, 5);
  counts[0] = Math.max(counts[0] as number, 1);
  return { ticks, counts, values: ticks.flatMap((v, i) => Array<number>(counts[i] as number).fill(v)) };
}

/** fourthsMath writes a length in fourths in LaTeX, in lowest terms. */
const fourthsMath = (fourths: number) => {
  const w = Math.floor(fourths / 4);
  const r = fourths % 4;
  return r === 2 ? mx(w, 1, 2) : mx(w, r, 4);
};

const fractionLinePlots = earlyTopic(
  "line-plots-with-fractions",
  ["Line Plots With Fractions", "有分数的线图"],
  ["Read line plots of lengths measured to the nearest half or fourth of an inch.", "读量到半英寸或四分之一英寸的长度线图。"],
  ["line-plots-of-measurements", "measuring-to-halves-and-fourths-of-an-inch"],
  ["3.MD.B.4"],
  [
    earlyPoint(
      "dots-above-a-fraction",
      ["Dots above a fraction", "分数上面的点"],
      [
        "A line plot can use fractions as well as whole numbers on its line. Each dot still means one thing that was measured. The number of dots above a length tells how many things were that long. A line plot marked in fourths is read in the same way as one marked in wholes, but the marks are closer together.",
        "线图的数轴上也可以用分数。每个点还是表示量过的一样东西。一个长度上面有几个点，就有几样东西是这么长。标四分之一的线图和标整数的线图读法相同，只是刻度更密。",
      ],
      (rng) => {
        const lo = 4 * rng.int(1, 4);
        const step = rng.pick([1, 2]);
        const { ticks, counts, values } = plotValues(rng, lo, step);
        const i = rng.int(0, 4);
        const v = ticks[i] as number;
        const n = counts[i] as number;
        return whole(
          [
            `This line plot shows the lengths of some leaves, in inches. How many leaves are $${fourthsMath(v)}$ inches long?`,
            `这张线图表示一些树叶的长度，单位是英寸。长 $${fourthsMath(v)}$ 英寸的树叶有多少片？`,
          ],
          n,
          [n + 1, values.length, n === 0 ? 2 : n - 1],
          [
            `There ${n === 1 ? "is" : "are"} ${n} ${n === 1 ? "dot" : "dots"} above $${fourthsMath(v)}$.`,
            `$${fourthsMath(v)}$ 上面有 ${n} 个点。`,
          ],
          fractionLinePlotFigure(values, lo, lo + 4 * step, step),
        );
      },
    ),
    earlyPoint(
      "more-or-less-than-a-length",
      ["More or less than a length", "比某个长度长或短"],
      [
        "To find how many things are longer than some length, add the dots to the right of that mark. To find how many are shorter, add the dots to its left. Do not count the dots above the mark itself, since those things are exactly that long. They are neither longer nor shorter than the length in the question.",
        "要求比某个长度长的有多少，就把这个刻度右边的点加起来。要求比它短的有多少，就把左边的点加起来。这个刻度上面的点不算，因为那些东西正好这么长，既不比它长，也不比它短。",
      ],
      (rng) => {
        const lo = 4 * rng.int(1, 4);
        const step = rng.pick([1, 2]);
        const { ticks, counts, values } = plotValues(rng, lo, step);
        const i = rng.int(1, 3);
        const v = ticks[i] as number;
        const longer = rng.bool();
        const answer = values.filter((x) => (longer ? x > v : x < v)).length;
        const atMark = counts[i] as number;
        return whole(
          longer
            ? [
                `This line plot shows the lengths of some pencils, in inches. How many pencils are longer than $${fourthsMath(v)}$ inches?`,
                `这张线图表示一些铅笔的长度，单位是英寸。比 $${fourthsMath(v)}$ 英寸长的铅笔有多少支？`,
              ]
            : [
                `This line plot shows the lengths of some pencils, in inches. How many pencils are shorter than $${fourthsMath(v)}$ inches?`,
                `这张线图表示一些铅笔的长度，单位是英寸。比 $${fourthsMath(v)}$ 英寸短的铅笔有多少支？`,
              ],
          answer,
          [atMark === 0 ? answer + 1 : answer + atMark, values.length, values.length - answer],
          [
            `Add the dots to the ${longer ? "right" : "left"} of that mark, which gives ${answer}.`,
            `把这个刻度${longer ? "右" : "左"}边的点加起来，得 ${answer}。`,
          ],
          fractionLinePlotFigure(values, lo, lo + 4 * step, step),
        );
      },
    ),
    earlyPoint(
      "the-most-common-length",
      ["The most common length", "最常见的长度"],
      [
        "The most common length is the one with the most dots above it, which makes the tallest stack on the plot. Be careful not to choose the longest length, which is the one farthest to the right. Tallest and farthest right are two different things. The stack shows how often it occurs, and the line shows the length.",
        "最常见的长度，就是上面的点最多的那个长度，也就是线图上最高的那一摞。注意不要选最长的长度，那是最右边的。最高和最靠右是两回事。一摞点表示出现了多少次，数轴表示长度。",
      ],
      (rng) => {
        const lo = 4 * rng.int(1, 4);
        const step = rng.pick([1, 2]);
        const { ticks, counts } = plotValues(rng, lo, step);
        const top = rng.int(0, 3);
        counts.forEach((c, i) => {
          counts[i] = Math.min(c, 4);
        });
        counts[top] = 5;
        const values = ticks.flatMap((v, i) => Array<number>(counts[i] as number).fill(v));
        const answer = fourthsMath(ticks[top] as number);
        return chooseMath(
          rng,
          ["Which length is the most common on this line plot?", "这张线图上，哪个长度最常见？"],
          answer,
          ticks.filter((_, i) => i !== top).map(fourthsMath),
          [
            `The tallest stack has ${counts[top]} dots, and it is above $${answer}$.`,
            `最高的一摞有 ${counts[top]} 个点，在 $${answer}$ 的上面。`,
          ],
          fractionLinePlotFigure(values, lo, lo + 4 * step, step),
        );
      },
    ),
  ],
);

const areaStories = earlyTopic(
  "area-word-problems",
  ["Area Word Problems", "面积应用题"],
  ["Solve stories that need the area of a rectangle or one of its missing sides.", "解决要用长方形面积或求缺少的边的故事题。"],
  ["area-of-a-rectangle-by-multiplying"],
  ["3.MD.C.7"],
  [
    earlyPoint(
      "covering-a-floor",
      ["Covering a floor", "铺地面"],
      [
        "Stories about covering a surface are about area. A floor 6 meters long and 4 meters wide needs $6 \\times 4$, or 24, one-meter squares to cover it. Area is measured in square units, such as square meters or square feet, and each one is a square with sides of that length. Multiply the two sides, and do not add them.",
        "关于铺满一个面的故事，说的就是面积。长 6 米、宽 4 米的地面，要用 $6 \\times 4 = 24$ 块边长 1 米的正方形才能铺满。面积的单位是平方单位，比如平方米或平方英尺。要把两条边相乘，不是相加。",
      ],
      (rng) => {
        const w = rng.int(3, 12);
        const h = rng.int(2, 9);
        const room = rng.pick<Pair>([
          ["kitchen", "厨房"],
          ["bedroom", "卧室"],
          ["classroom", "教室"],
          ["patio", "露台"],
          ["garden", "花园"],
        ]);
        return whole(
          [
            `A ${room[0]} floor is ${w} meters long and ${h} meters wide. How many square meters is its area?`,
            `${room[1]}的地面长 ${w} 米，宽 ${h} 米。它的面积是多少平方米？`,
          ],
          w * h,
          [w + h, 2 * (w + h), w * h + h],
          [`$${times(w, h)} = ${w * h}$ square meters.`, `$${times(w, h)} = ${w * h}$ 平方米。`],
          labeledRectangleFigure(w, h, "m"),
        );
      },
    ),
    {
      ...earlyPoint(
        "finding-a-missing-side-from-area",
        ["Finding a missing side from area", "由面积求边长"],
        [
          "If you know the area of a rectangle and one side, you can find the other side by dividing. A rug has an area of 42 square feet and is 7 feet long. The other side times 7 must make 42, so it is $42 \\div 7$, or 6 feet. Subtracting the side from the area does not mean anything here.",
          "知道长方形的面积和一条边，就能用除法求另一条边。一块地毯面积是 42 平方英尺，长 7 英尺。另一条边乘 7 要等于 42，所以是 $42 \\div 7$，等于 6 英尺。用面积减边长，在这里没有意义。",
        ],
        (rng) => {
          const w = rng.int(3, 9);
          const h = rng.int(3, 9);
          const area = w * h;
          const feet: Pair = ["feet", "英尺"];
          const meters: Pair = ["meters", "米"];
          const inches: Pair = ["inches", "英寸"];
          const [thing, measure] = rng.pick<readonly [Pair, Pair]>([
            [["rug", "地毯"], feet],
            [["garden bed", "花坛"], feet],
            [["garden bed", "花坛"], meters],
            [["hall floor", "大厅地面"], meters],
            [["poster", "海报"], inches],
            [["table top", "桌面"], feet],
            [["place mat", "餐垫"], inches],
          ]);
          return whole(
            [
              `A rectangular ${thing[0]} has an area of ${area} square ${measure[0]}. One side is ${w} ${measure[0]} long. How many ${measure[0]} long is the other side?`,
              `一个长方形的${thing[1]}，面积是 ${area} 平方${measure[1]}，一条边长 ${w} ${measure[1]}。另一条边长多少${measure[1]}？`,
            ],
            h,
            [area - w, area + w, area],
            [
              `Area is one side times the other, so divide the area by the side you know: $${div(area, w)} = ${h}$ ${measure[0]}.`,
              `面积等于一条边乘另一条边，所以用面积除以已知的边：$${div(area, w)} = ${h}$ ${measure[1]}。`,
            ],
          );
        },
      ),
      figure: gradeDrawings["finding-a-missing-side-from-area"],
    },
    {
      ...earlyPoint(
        "comparing-two-areas",
        ["Comparing two areas", "比较两个面积"],
        [
          "To compare two rectangles, find the area of each one and then compare the two areas. A longer rectangle is not always larger, because the other side also matters. A rectangle 8 by 2 has an area of 16, while a rectangle 5 by 4 has an area of 20. So the shorter one in this case is larger.",
          "要比较两个长方形，先求出每个的面积，再比较。长一点的长方形不一定大，因为另一条边也有关系。8 乘 2 的长方形面积是 16，而 5 乘 4 的长方形面积是 20。所以这里更短的那个反而更大。",
        ],
        (rng) => {
          const [p, q] = rng.sample(earlyNames, 2) as [string, string];
          const w1 = rng.int(3, 10);
          const h1 = rng.int(2, 7);
          const w2 = rng.int(3, 10);
          let h2 = rng.int(2, 7);
          if (w1 * h1 === w2 * h2) h2 = h2 === 7 ? 6 : h2 + 1;
          const a1 = w1 * h1;
          const a2 = w2 * h2;
          return whole(
            [
              `${p}'s garden is ${w1} meters by ${h1} meters. ${q}'s garden is ${w2} meters by ${h2} meters. How many square meters larger is the larger garden?`,
              `${p} 的花园长 ${w1} 米、宽 ${h1} 米，${q} 的花园长 ${w2} 米、宽 ${h2} 米。大的花园比小的花园大多少平方米？`,
            ],
            Math.abs(a1 - a2),
            [Math.abs(w1 + h1 - w2 - h2) + 1, Math.max(a1, a2), a1 + a2],
            [
              `The areas are ${a1} and ${a2} square meters, and their difference is ${Math.abs(a1 - a2)}.`,
              `面积分别是 ${a1} 和 ${a2} 平方米，相差 ${Math.abs(a1 - a2)} 平方米。`,
            ],
          );
        },
      ),
      figure: gradeDrawings["comparing-two-areas"],
    },
  ],
);

/** lData picks the sizes of an L shape, with its notch cut from the top right. */
function lData(rng: Rng) {
  const w = rng.int(5, 10);
  const h = rng.int(4, 8);
  const cw = rng.int(2, w - 2);
  const ch = rng.int(1, h - 2);
  return { w, h, cw, ch, area: w * h - cw * ch };
}

const lShapes = earlyTopic(
  "area-of-l-shapes",
  ["Area of L Shapes", "L 形的面积"],
  [
    "Find the area of an L shape by counting, by splitting into rectangles, or by taking away a corner.",
    "用数格子、分成长方形或减去一个角的方法，求 L 形的面积。",
  ],
  ["area-of-combined-rectangles"],
  ["3.MD.C.7"],
  [
    {
      ...earlyPoint(
        "counting-squares-in-an-l",
        ["Counting squares in an L", "数 L 形里的方格"],
        [
          "An L shape on a grid is made of unit squares. Its area is how many squares are inside it. Rather than counting one at a time, count the squares in each row, or look for rectangles you can find quickly. Do not count the squares in the cut-out corner, because they are not part of the shape at all.",
          "方格纸上的 L 形由单位正方形组成，它的面积就是里面有多少个方格。不用一个一个地数，可以按行来数，或者找能很快算出的长方形。缺掉的那个角里的方格不算，因为它们根本不属于这个图形。",
        ],
        (rng) => {
          const { w, h, cw, ch, area } = lData(rng);
          return whole(
            [
              "Each small square is 1 square unit. What is the area of this shape, in square units?",
              "每个小方格是 1 平方单位。这个图形的面积是多少平方单位？",
            ],
            area,
            [w * h, cw * ch, area + 1, 2 * (w + h)],
            [
              `The full rectangle would have ${w * h} squares, and the cut-out corner removes ${cw * ch}, which leaves ${area}.`,
              `完整的长方形有 ${w * h} 个方格，缺掉的角少了 ${cw * ch} 个，还剩 ${area} 个。`,
            ],
            lShapeFigure(w, h, cw, ch, {}, { grid: true }),
          );
        },
      ),
      figure: gradeDrawings["counting-squares-in-an-l"],
    },
    {
      ...earlyPoint(
        "splitting-an-l-into-two",
        ["Splitting an L into two", "把 L 形分成两部分"],
        [
          "An L shape can be split into two rectangles by a straight line. Find the area of each rectangle, and then add the two areas together. You sometimes have to work out a side that is not labeled, by subtracting. In this picture, the dashed line shows one way to split the shape, and there is another way that also works.",
          "L 形可以用一条直线分成两个长方形。分别求出每个长方形的面积，再加起来。有时要用减法算出没有标的边。在这张图上，虚线是一种分法，还有另一种分法也可以。",
        ],
        (rng) => {
          const { w, h, cw, ch, area } = lData(rng);
          return whole(
            [
              "The dashed line splits this shape into two rectangles. What is the total area, in square units?",
              "虚线把这个图形分成两个长方形。总面积是多少平方单位？",
            ],
            area,
            [w * h, area + cw, w + h, area - ch],
            [`The two rectangles have areas that add up to ${area}.`, `两个长方形的面积加起来是 ${area}。`],
            lShapeFigure(
              w,
              h,
              cw,
              ch,
              { bottom: `${w}`, right: `${h - ch}`, notchBottom: `${cw}`, notchSide: `${ch}`, top: `${w - cw}`, left: `${h}` },
              { split: true },
            ),
          );
        },
      ),
      figure: gradeDrawings["splitting-an-l-into-two"],
    },
    {
      ...earlyPoint(
        "taking-away-a-corner",
        ["Taking away a corner", "减去一个角"],
        [
          "Another way to find the area of an L shape is to imagine the whole rectangle around it. Find the area of that big rectangle. Then find the area of the missing corner, and take it away. This often uses fewer steps than splitting the shape. Check that the sides you use belong to the rectangle you want.",
          "求 L 形面积的另一种方法，是想象它外面的大长方形。先求大长方形的面积，再求缺掉的角的面积，然后减去。这常常比分成两部分步骤更少。要检查用的边是不是属于要算的那个长方形。",
        ],
        (rng) => {
          const { w, h, cw, ch, area } = lData(rng);
          // A 2 by 2 corner has as much area as its sides add up to, so the sum would be right there.
          const notTheCorner = cw + ch === cw * ch ? ([cw, `${cw}`] as const) : ([cw + ch, `${cw} + ${ch}`] as const);
          return reasoned(
            chooseMath(
              rng,
              ["Which calculation gives the area of this shape?", "哪个算式能算出这个图形的面积？"],
              `${times(w, h)} - ${times(cw, ch)}`,
              rng.shuffle([
                `${times(w, h)} + ${times(cw, ch)}`,
                `${w} + ${h} - ${cw} - ${ch}`,
                `${times(w - cw, h - ch)}`,
                `${times(w, h)} - ${notTheCorner[0]}`,
              ]),
              [
                `The big rectangle is $${times(w, h)}$, and the missing corner is $${times(cw, ch)}$. The area is ${area}.`,
                `大长方形是 $${times(w, h)}$，缺掉的角是 $${times(cw, ch)}$，面积是 ${area}。`,
              ],
              lShapeFigure(w, h, cw, ch, { bottom: `${w}`, left: `${h}`, notchBottom: `${cw}`, notchSide: `${ch}` }),
            ),
            [
              [
                `$${times(w, h)} + ${times(cw, ch)}$`,
                "The corner is missing, so its area is taken away, not added.",
                "这个角是缺的，所以它的面积要减去，不是加上。",
              ],
              [
                `$${w} + ${h} - ${cw} - ${ch}$`,
                "This adds and subtracts side lengths, but area comes from multiplying.",
                "这是在加减边长，但面积要用乘法。",
              ],
              [
                `$${times(w - cw, h - ch)}$`,
                "This is only the small rectangle left at one corner: the L shape has more than that.",
                "这只是一角剩下的小长方形：L 形比它大。",
              ],
              [
                `$${times(w, h)} - ${notTheCorner[0]}$`,
                `The corner's area is $${times(cw, ch)}$, not $${notTheCorner[1]}$.`,
                `这个角的面积是 $${times(cw, ch)}$，不是 $${notTheCorner[1]}$。`,
              ],
            ],
          );
        },
      ),
      figure: gradeDrawings["taking-away-a-corner"],
    },
  ],
);

const perimeterStories = earlyTopic(
  "perimeter-of-rectangles-and-word-problems",
  ["Perimeter of Rectangles and Word Problems", "长方形的周长和应用题"],
  [
    "Find perimeters in stories, a missing side from a perimeter, and the perimeter of an L shape.",
    "在故事中求周长，由周长求缺少的边，并求 L 形的周长。",
  ],
  ["perimeter-of-polygons", "area-of-l-shapes"],
  ["3.MD.D.8"],
  [
    {
      ...earlyPoint(
        "putting-a-fence-around",
        ["Putting a fence around", "围栅栏"],
        [
          "Stories about fences, borders and frames are asking for a perimeter, which is the distance all the way around. In a rectangle, add the long side and the short side, and then double the result, because each length appears twice. So a garden 7 meters by 3 meters needs $2 \\times 10$, or 20, meters of fence. Do not multiply the two sides.",
          "关于栅栏、花边和相框的故事，问的是周长，也就是绕一圈的距离。长方形要把长边和短边相加，再乘 2，因为每个长度都出现两次。所以长 7 米、宽 3 米的花园，需要 $2 \\times 10 = 20$ 米栅栏。不要把两条边相乘。",
        ],
        (rng) => {
          const w = rng.int(4, 15);
          const h = rng.int(2, 9);
          const job = rng.pick<readonly [string, string, string, string]>([
            ["garden", "fence", "花园", "四周围一圈栅栏"],
            ["playground", "fence", "操场", "四周围一圈栅栏"],
            ["pond", "path", "水池", "四周修一圈小路"],
            ["vegetable garden", "low wall", "菜园", "四周砌一圈矮墙"],
          ]);
          return whole(
            [
              `A rectangular ${job[0]} is ${w} meters long and ${h} meters wide, with a ${job[1]} all the way around it. How many meters long is the ${job[1]}?`,
              `一个长方形的${job[2]}长 ${w} 米、宽 ${h} 米，${job[3]}。这一圈长多少米？`,
            ],
            2 * (w + h),
            [w + h, w * h, 2 * w + h],
            [
              `$${w} + ${h} = ${w + h}$, and $${times(2, w + h)} = ${2 * (w + h)}$ meters.`,
              `$${w} + ${h} = ${w + h}$，$${times(2, w + h)} = ${2 * (w + h)}$ 米。`,
            ],
          );
        },
      ),
      figure: gradeDrawings["putting-a-fence-around"],
    },
    {
      ...earlyPoint(
        "a-missing-side-from-the-perimeter",
        ["A missing side from the perimeter", "由周长求一条边"],
        [
          "If you know a rectangle's perimeter and one side, work back. Half of the perimeter is one long side and one short side together. Subtract the side you know from this half, and you get the other side. So with a perimeter of 26 and a side of 8, half is 13, and the other side is 5.",
          "知道长方形的周长和一条边，可以倒着算。周长的一半就是一条长边和一条短边的和。用这一半减去知道的边，就得到另一条边。所以周长是 26，一条边是 8，一半是 13，另一条边是 5。",
        ],
        (rng) => {
          const w = rng.int(4, 15);
          let h = rng.int(2, 12);
          if (h === w) h += 1;
          const p = 2 * (w + h);
          return whole(
            [
              `A rectangle has a perimeter of ${p} centimeters. One side is ${w} centimeters long. How many centimeters long is the side next to it?`,
              `一个长方形的周长是 ${p} 厘米，一条边长 ${w} 厘米。和它相邻的一条边长多少厘米？`,
            ],
            h,
            [p - w, p - 2 * w, w + h],
            [
              `Half of ${p} is ${w + h}, and $${w + h} - ${w} = ${h}$ centimeters.`,
              `${p} 的一半是 ${w + h}，$${w + h} - ${w} = ${h}$ 厘米。`,
            ],
          );
        },
      ),
      figure: gradeDrawings["perimeter-of-rectangles-and-word-problems#a-missing-side-from-the-perimeter"],
    },
    {
      ...earlyPoint(
        "perimeter-of-an-l",
        ["Perimeter of an L", "L 形的周长"],
        [
          "An L shape has 6 sides, so add 6 lengths to find its perimeter. A surprising fact is that its perimeter equals that of the rectangle around it, because the two inner sides of the notch make up for the parts that were cut away. You can use this as a shortcut, or as a check on your answer.",
          "L 形有 6 条边，所以要加 6 个长度才能求出周长。有趣的是，它的周长和外面大长方形的周长一样，因为缺口里面的两条边正好补上了切掉的部分。可以用这一点算得更快，也可以用来检查答案。",
        ],
        (rng) => {
          const { w, h, cw, ch } = lData(rng);
          const p = 2 * (w + h);
          return whole(
            ["What is the perimeter of this shape, in units?", "这个图形的周长是多少单位？"],
            p,
            [w + h, p - cw, p - ch, w * h - cw * ch],
            [
              `$${w} + ${h - ch} + ${cw} + ${ch} + ${w - cw} + ${h} = ${p}$.`,
              `$${w} + ${h - ch} + ${cw} + ${ch} + ${w - cw} + ${h} = ${p}$。`,
            ],
            lShapeFigure(w, h, cw, ch, {
              bottom: `${w}`,
              right: `${h - ch}`,
              notchBottom: `${cw}`,
              notchSide: `${ch}`,
              top: `${w - cw}`,
              left: `${h}`,
            }),
          );
        },
      ),
      figure: gradeDrawings["perimeter-of-an-l"],
    },
  ],
);

/** quadKinds lists quadrilateral kinds with a way of drawing an example, on the 0 to 10 grid, whose steps are 20 pixels across and 12 pixels up. */
const quadKinds: readonly { name: Pair; make: (rng: Rng) => (readonly [number, number])[] }[] = [
  {
    name: ["square", "正方形"],
    make: (rng) => {
      const k = rng.int(2, 4) / 2;
      const w = 3 * k;
      const h = 5 * k;
      const x = rng.int(0, 2);
      const y = rng.int(0, 2);
      return [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h],
      ];
    },
  },
  {
    name: ["rectangle", "长方形"],
    make: (rng) => {
      const w = rng.int(6, 10);
      const h = rng.int(2, 4);
      const x = rng.int(0, 10 - w);
      const y = rng.int(1, 5);
      return [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h],
      ];
    },
  },
  {
    name: ["rhombus", "菱形"],
    make: (rng) => {
      const a = rng.int(2, 4);
      const b = rng.int(5, 8 - a + 3);
      return [
        [5 - a, 5],
        [5, 5 - b / 2],
        [5 + a, 5],
        [5, 5 + b / 2],
      ];
    },
  },
];

const quadCategories = earlyTopic(
  "quadrilateral-categories",
  ["Quadrilateral Categories", "四边形的分类"],
  [
    "Tell how squares, rectangles and rhombuses fit together, and recognize other quadrilaterals.",
    "说明正方形、长方形和菱形之间的关系，并认识其他四边形。",
  ],
  ["sorting-quadrilaterals"],
  ["3.G.A.1"],
  [
    {
      ...earlyPoint(
        "naming-the-special-quadrilaterals",
        ["Naming the special quadrilaterals", "认识特殊的四边形"],
        [
          "A rectangle has 4 square corners. A rhombus has 4 equal sides. A square has both of these features, so it has 4 square corners and 4 equal sides. To name a shape, look at its corners and then at its sides. A shape can be turned on its side and still have the same name, so do not go by how it is placed.",
          "长方形有 4 个直角。菱形有 4 条相等的边。正方形这两个特点都有：4 个直角，4 条相等的边。说图形的名称时，先看角，再看边。图形转一转，名称也不变，所以不要只看它是怎么放的。",
        ],
        (rng) => {
          const kind = rng.pick(quadKinds);
          const other: Pair[] = [...quadKinds.filter((k) => k !== kind).map((k) => k.name), ["pentagon", "五边形"], ["triangle", "三角形"]];
          return choose(
            rng,
            ["Which is the best name for this shape?", "这个图形最准确的名称是什么？"],
            kind.name,
            rng.shuffle(other),
            kind.name[0] === "square"
              ? ["It has 4 square corners and 4 equal sides.", "它有 4 个直角和 4 条相等的边。"]
              : kind.name[0] === "rectangle"
                ? ["It has 4 square corners, but its sides are not all equal.", "它有 4 个直角，但边不都相等。"]
                : ["It has 4 equal sides, but its corners are not square.", "它有 4 条相等的边，但角不是直角。"],
            polygonFigure(kind.make(rng), t("A quadrilateral.", "一个四边形。")),
          );
        },
      ),
      figure: gradeDrawings["naming-the-special-quadrilaterals"],
    },
    {
      ...earlyPoint(
        "which-statement-is-true",
        ["Which statement is true", "哪句话是对的"],
        [
          "Categories can overlap. Every square is a rectangle, because it has 4 square corners. Every square is also a rhombus, because it has 4 equal sides. All three are quadrilaterals. But the reverse is not always true: many rectangles are not squares, and many rhombuses are not squares. Think of a picture to test each statement.",
          "类别之间可以重叠。每个正方形都是长方形，因为它有 4 个直角。每个正方形也都是菱形，因为它有 4 条相等的边。这三种都是四边形。但反过来不一定对：很多长方形不是正方形，很多菱形也不是正方形。想一个图形来检验每句话。",
        ],
        (rng) => {
          const yes = rng.pick<Pair>([
            ["Every square is a rectangle", "每个正方形都是长方形"],
            ["Every square is a rhombus", "每个正方形都是菱形"],
            ["Every rectangle is a quadrilateral", "每个长方形都是四边形"],
            ["Every rhombus is a quadrilateral", "每个菱形都是四边形"],
            ["Every square is a quadrilateral", "每个正方形都是四边形"],
            ["Some rectangles are squares", "有些长方形是正方形"],
            ["Some rhombuses are squares", "有些菱形是正方形"],
          ]);
          return choose(
            rng,
            ["Which statement is true?", "哪句话是对的？"],
            yes,
            rng.shuffle<Pair>([
              ["Every rectangle is a square", "每个长方形都是正方形"],
              ["Every rhombus is a square", "每个菱形都是正方形"],
              ["Every quadrilateral is a rectangle", "每个四边形都是长方形"],
              ["Every quadrilateral is a rhombus", "每个四边形都是菱形"],
              ["No square is a rectangle", "正方形都不是长方形"],
              ["No rhombus is a quadrilateral", "菱形都不是四边形"],
            ]),
            [
              `"${yes[0]}" is true, and the others each have a shape that shows they are false.`,
              `“${yes[1]}”是对的，其他几句话都能找到不符合的图形。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["quadrilateral-categories#which-statement-is-true"],
    },
    {
      ...earlyPoint(
        "quadrilaterals-of-other-kinds",
        ["Quadrilaterals of other kinds", "其他的四边形"],
        [
          "A quadrilateral is any closed shape with 4 straight sides, and many quadrilaterals belong to none of the special categories. A shape can have 4 sides of different lengths and no square corners. It is still a quadrilateral, even though it is not a rectangle, a rhombus or a square. Count the sides to decide.",
          "四边形是有 4 条直边的封闭图形。很多四边形不属于任何一种特殊的类别。一个图形可以有 4 条长短不同的边，也没有直角，它还是四边形，虽然不是长方形、菱形或正方形。数一数边就能判断。",
        ],
        (rng) => {
          const corners: [number, number][] = [
            [rng.int(0, 2), rng.int(2, 3)],
            [rng.int(7, 10), rng.int(0, 1)],
            [rng.int(6, 9), rng.int(7, 9)],
            [rng.int(1, 3), rng.int(5, 6)],
          ];
          return choose(
            rng,
            ["Which statement about this shape is true?", "关于这个图形，哪句话是对的？"],
            ["It is a quadrilateral, but not a rectangle", "它是四边形，但不是长方形"],
            rng.shuffle<Pair>([
              ["It is a rectangle", "它是长方形"],
              ["It is a square", "它是正方形"],
              ["It is not a quadrilateral", "它不是四边形"],
              ["It is a rhombus", "它是菱形"],
            ]),
            [
              "It has 4 straight sides, but its sides are not all equal and its corners are not square.",
              "它有 4 条直边，但边不都相等，角也不是直角。",
            ],
            polygonFigure(corners, t("A closed shape with straight sides.", "一个由直边围成的封闭图形。")),
          );
        },
      ),
      figure: gradeDrawings2["quadrilateral-categories#quadrilaterals-of-other-kinds"],
    },
  ],
);

/** gradeThreeMoreTopics are the added topics of 3rd Grade Math. */
export const gradeThreeMoreTopics: readonly TopicDef[] = [
  usingKnownFacts,
  tablePatterns,
  factFamilies,
  unknownAnywhere,
  areaModels,
  arrayMeasureStories,
  usingALetter,
  reasonableAnswers,
  mentalWithin1000,
  unitFractionsOnLine,
  fractionsBeyondOne,
  equivalentOnLines,
  makingEquivalents,
  comparingWithPictures,
  elapsedOnALine,
  startAndEnd,
  scalesAndBeakers,
  measuringFourths,
  halfSymbols,
  choosingScale,
  fractionLinePlots,
  areaStories,
  lShapes,
  perimeterStories,
  quadCategories,
];

/** gradeThreeMoreUnits are the units that place the added topics in 3rd Grade Math. */
export const gradeThreeMoreUnits: CourseDef["units"] = [
  {
    title: t("Multiplication and Division Strategies", "乘除法的策略"),
    modules: [
      {
        title: t("Working With Facts", "运用乘除法口诀"),
        topics: [
          "using-known-facts-to-multiply",
          "patterns-in-the-multiplication-table",
          "fact-families-for-multiplying-and-dividing",
          "the-unknown-in-multiplication-and-division",
        ],
      },
      { title: t("Models and Stories", "模型和故事"), topics: ["area-models-for-multiplying", "array-and-measure-word-problems"] },
    ],
  },
  {
    title: t("Reasoning With Numbers", "用数来推理"),
    modules: [
      {
        title: t("Letters, Estimates and Mental Math", "字母、估算和心算"),
        topics: ["using-a-letter-for-the-unknown", "is-the-answer-reasonable", "mental-strategies-within-1000"],
      },
    ],
  },
  {
    title: t("Fractions on Lines and Equal Fractions", "数轴上的分数和相等的分数"),
    modules: [
      {
        title: t("Fractions on the Line", "数轴上的分数"),
        topics: ["placing-unit-fractions-on-the-number-line", "fractions-greater-than-one-on-a-number-line"],
      },
      {
        title: t("Equal Fractions and Comparing", "相等的分数和比较"),
        topics: ["equivalent-fractions-on-number-lines", "making-equivalent-fractions", "comparing-fractions-with-pictures-and-lines"],
      },
    ],
  },
  {
    title: t("Time and Measures", "时间和度量"),
    modules: [
      { title: t("Elapsed Time", "经过的时间"), topics: ["elapsed-time-on-a-number-line", "start-and-end-times"] },
      {
        title: t("Reading Measuring Tools", "读测量工具"),
        topics: ["reading-scales-and-beakers", "measuring-to-halves-and-fourths-of-an-inch"],
      },
    ],
  },
  {
    title: t("Graphs", "统计图"),
    modules: [
      {
        title: t("Reading and Drawing Graphs", "读图和画图"),
        topics: ["picture-graphs-with-half-symbols", "choosing-a-scale-and-drawing-bars", "line-plots-with-fractions"],
      },
    ],
  },
  {
    title: t("Area and Perimeter", "面积和周长"),
    modules: [
      {
        title: t("Stories and L Shapes", "故事和 L 形"),
        topics: ["area-word-problems", "area-of-l-shapes", "perimeter-of-rectangles-and-word-problems"],
      },
    ],
  },
  {
    title: t("Thinking About Quadrilaterals", "思考四边形"),
    modules: [{ title: t("Categories of Shapes", "图形的类别"), topics: ["quadrilateral-categories"] }],
  },
];
