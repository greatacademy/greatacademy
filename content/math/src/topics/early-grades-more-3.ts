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
  gridFigure,
  labeledRectangleFigure,
  polygonFigure,
} from "../early-grades-kit.ts";
import { gradeDrawings } from "../explanation-drawings-grades.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import {
  areaModelFigure,
  beakerFigure,
  captioned,
  compared,
  dialScaleFigure,
  factTriangleFigure,
  fractionLineFigure,
  fractionLinePlotFigure,
  halfPictureGraphFigure,
  hopsFigure,
  inchRulerFigure,
  lShapeFigure,
  type MathWrong,
  type Pair,
  partWholeBarFigure,
  picked,
  pickedMath,
  solved,
  tableFigure,
  timesTableFigure,
  twoFractionLinesFigure,
  type Walk,
  type Wrong,
} from "./early-grades-more-kit.ts";
import { barFigure, fr, mx, twoBarsFigure } from "./grade-4-fractions.ts";

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
        "You know $3 \\times 7 = 21$. 6 rows of 7 are 3 rows and 3 rows more, so $6 \\times 7$ is double 21: $21 + 21 = 42$.\n\nCheck: count on by sevens from 21: 28, 35, 42.\n\n> **Watch out.** Double the whole product, 21. Adding 2 or 3 to it is not doubling.",
        "已知 $3 \\times 7 = 21$。6 行 7 个就是 3 行再加 3 行，所以 $6 \\times 7$ 是 21 的两倍：$21 + 21 = 42$。\n\n检验：从 21 开始七个七个地往上数：28、35、42。\n\n> **注意。** 要把整个积 21 翻倍。给它加 2 或加 3 不是翻倍。",
      ],
      (rng) => {
        const small = rng.pick([2, 3, 4, 5]);
        const n = rng.int(2, 10);
        const known = small * n;
        const answer = 2 * known;
        return solved(
          [
            `You know that $${times(small, n)} = ${known}$. What is $${times(2 * small, n)}$?`,
            `已知 $${times(small, n)} = ${known}$。$${times(2 * small, n)}$ 等于多少？`,
          ],
          answer,
          [
            [
              ["See the double", "看出两倍"],
              [`${2 * small} groups are ${small} groups and ${small} groups more.`, `${2 * small} 组就是 ${small} 组再加 ${small} 组。`],
            ],
            [["Double the product", "把积翻倍"], [`Double ${known}:`, `${known} 的两倍：`], [`${known} + ${known} = ${answer}`]],
          ],
          [
            `Count on ${small} more groups of ${n} from ${known}: ${Array.from({ length: small }, (_, i) => known + n * (i + 1)).join(", ")}.`,
            `从 ${known} 开始再数 ${small} 个 ${n}：${Array.from({ length: small }, (_, i) => known + n * (i + 1)).join("、")}。`,
          ],
          [
            [known + 2, "That adds 2 instead of doubling the product.", "这是加 2，不是把积翻倍。"],
            [known + n, `That adds only one more group of ${n}.`, `这只多加了一组 ${n}。`],
            [known + small, `That adds ${small}, not ${small} more groups.`, `这是加 ${small}，不是再加 ${small} 组。`],
          ],
          arrayFigure(2 * small, n),
        );
      },
      captioned(
        arrayFigure(6, 7),
        "6 rows of 7: the top 3 rows make 21 and the bottom 3 rows make 21 more.",
        "6 行，每行 7 个：上面 3 行是 21，下面 3 行又是 21。",
      ),
    ),
    earlyPoint(
      "one-more-group",
      ["One more group", "多加一组"],
      [
        "You know $5 \\times 7 = 35$. $6 \\times 7$ is one more row of 7, so it is $35 + 7 = 42$.\n\nCheck: $6 \\times 7$ is double $3 \\times 7 = 21$, and $21 + 21 = 42$.\n\n> **Watch out.** Add the size of a group, 7, not 1. $35 + 1 = 36$ is wrong.",
        "已知 $5 \\times 7 = 35$。$6 \\times 7$ 就是再多一行 7，所以是 $35 + 7 = 42$。\n\n检验：$6 \\times 7$ 是 $3 \\times 7 = 21$ 的两倍，$21 + 21 = 42$。\n\n> **注意。** 要加的是每组的个数 7，不是 1。$35 + 1 = 36$ 是错的。",
      ],
      (rng) => {
        const groups = rng.pick([2, 4, 5, 9, 10]);
        const size = rng.int(3, 9);
        const known = groups * size;
        return solved(
          [
            `What number goes in the box? $${times(groups + 1, size)} = ${known} + \\square$`,
            `方框里填几？$${times(groups + 1, size)} = ${known} + \\square$`,
          ],
          size,
          [
            [["Find the known fact", "找出会的算式"], ["The first part is:", "前面一部分是："], [`${times(groups, size)} = ${known}`]],
            [
              ["Add one group", "再加一组"],
              [
                `${groups + 1} groups is one more group of ${size}, so the box is ${size}.`,
                `${groups + 1} 组就是再加一组 ${size}，所以方框里是 ${size}。`,
              ],
            ],
          ],
          [
            `$${known} + ${size} = ${known + size}$, and $${times(groups + 1, size)} = ${known + size}$.`,
            `$${known} + ${size} = ${known + size}$，而 $${times(groups + 1, size)} = ${known + size}$。`,
          ],
          [
            [1, "That adds 1. One more group adds the size of a group.", "这是加 1。多一组要加每组的个数。"],
            [groups, "That is the number of groups, not the size of one group.", "这是组数，不是每组的个数。"],
            [groups + 1, "That is the new number of groups, not the size of one group.", "这是新的组数，不是每组的个数。"],
            [known, "That is the known product again, not the group to add.", "这是已知的积，不是要加的那一组。"],
          ],
          arrayFigure(groups + 1, size),
        );
      },
      captioned(arrayFigure(6, 7), "5 rows of 7 make 35, and one more row of 7 makes 42.", "5 行 7 个是 35，再多一行 7 个是 42。"),
    ),
    earlyPoint(
      "one-group-less",
      ["One group less", "减去一组"],
      [
        "You know $10 \\times 6 = 60$. 9 groups of 6 are one group of 6 less, so $9 \\times 6 = 60 - 6 = 54$.\n\nCheck: $54 + 6 = 60$.\n\n> **Watch out.** Take away a whole group, 6, not just 1. $60 - 1 = 59$ is wrong.",
        "已知 $10 \\times 6 = 60$。9 组 6 就是少一组 6，所以 $9 \\times 6 = 60 - 6 = 54$。\n\n检验：$54 + 6 = 60$。\n\n> **注意。** 要减去整整一组 6，不是只减 1。$60 - 1 = 59$ 是错的。",
      ],
      (rng) => {
        const groups = rng.pick([3, 5, 10]);
        const size = rng.int(3, 11);
        const big = groups * size;
        const answer = (groups - 1) * size;
        return solved(
          [
            `You know that $${times(groups, size)} = ${big}$. What is $${times(groups - 1, size)}$?`,
            `已知 $${times(groups, size)} = ${big}$。$${times(groups - 1, size)}$ 等于多少？`,
          ],
          answer,
          [
            [
              ["Compare the facts", "比较两个算式"],
              [
                `${groups - 1} groups of ${size} is one group of ${size} less than ${groups} groups.`,
                `${groups - 1} 组 ${size} 比 ${groups} 组少一组 ${size}。`,
              ],
            ],
            [["Take one group away", "减去一组"], [`Subtract ${size}:`, `减去 ${size}：`], [`${big} - ${size} = ${answer}`]],
          ],
          [`$${answer} + ${size} = ${big}$.`, `$${answer} + ${size} = ${big}$。`],
          [
            [big - 1, `That takes away 1, not a whole group of ${size}.`, `这只减了 1，不是一整组 ${size}。`],
            [big + size, "That adds a group instead of taking one away.", "这是多加了一组，不是减去一组。"],
            [big - groups, `That takes away ${groups}, the number of groups.`, `这是减去了组数 ${groups}。`],
          ],
          arrayFigure(groups - 1, size),
        );
      },
      captioned(
        arrayFigure(9, 6),
        "9 rows of 6: one row fewer than 10 rows of 6, so 60 − 6 = 54.",
        "9 行，每行 6 个：比 10 行少一行，所以 60 − 6 = 54。",
      ),
    ),
  ],
  [
    "Sam does not remember $6 \\times 8$, but he knows $3 \\times 8 = 24$. Six eights are two lots of three eights, so $24 + 24 = 48$.\n\nCheck: $5 \\times 8 = 40$, and one more 8 makes 48.\n\nIn this lesson we double a known fact, add one more group, or take one group away to find a harder fact.",
    "Sam 记不住 $6 \\times 8$，但他知道 $3 \\times 8 = 24$。6 个 8 是两个 3 个 8，所以 $24 + 24 = 48$。\n\n检验：$5 \\times 8 = 40$，再加一个 8 是 48。\n\n本课我们把会的乘法翻倍、多加一组或减去一组，算出较难的乘法。",
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
        "The question mark is in row 4 and column 7. The row and column numbers are the factors, and the product sits where they meet: $4 \\times 7 = 28$.\n\nCheck: the cell to its left is $4 \\times 6 = 24$, and $24 + 4 = 28$.\n\n> **Watch out.** Multiply the row and column numbers. $4 + 7 = 11$ adds them.",
        "问号在 4 这一行、7 这一列。行首和列首的数是因数，乘积在它们相交的地方：$4 \\times 7 = 28$。\n\n检验：它左边一格是 $4 \\times 6 = 24$，$24 + 4 = 28$。\n\n> **注意。** 要把行首和列首的数相乘。$4 + 7 = 11$ 是相加。",
      ],
      (rng) => {
        const rows = rng.sample([2, 3, 4, 5, 6, 7, 8, 9], 3).sort((a, b) => a - b);
        const columns = rng.sample([2, 3, 4, 5, 6, 7, 8, 9], 4).sort((a, b) => a - b);
        const r = rng.int(0, 2);
        const c = rng.int(0, 3);
        const a = rows[r] as number;
        const b = columns[c] as number;
        return solved(
          ["What number goes at the question mark in this table?", "表中问号处应该填几？"],
          a * b,
          [
            [
              ["Find the factors", "找因数"],
              [`The question mark is in row ${a} and column ${b}.`, `问号在 ${a} 这一行、${b} 这一列。`],
            ],
            [["Multiply", "相乘"], ["Where they meet:", "相交处："], [`${times(a, b)} = ${a * b}`]],
          ],
          [`$${times(b, a)} = ${a * b}$ as well, in the other order.`, `换个顺序 $${times(b, a)} = ${a * b}$，也一样。`],
          [
            [a + b, "That adds the row and column numbers. Multiply them.", "这把行首和列首的数相加了。要相乘。"],
            [a * b + a, `That is one group of ${a} too many.`, `多了一组 ${a}。`],
            [a * b - b, `That is one group of ${b} too few.`, `少了一组 ${b}。`],
          ],
          timesTableFigure(rows, columns, (x, y) => x !== a && y !== b, [a, b]),
        );
      },
      captioned(
        timesTableFigure([3, 4, 5], [5, 6, 7, 8], () => true, [4, 7]),
        "A part of the times table with rows 3, 4, 5 and columns 5 to 8: the question mark is in row 4, column 7.",
        "乘法表的一部分，行是 3、4、5，列是 5 到 8：问号在 4 这一行、7 这一列。",
      ),
    ),
    earlyPoint(
      "steps-along-a-row",
      ["Steps along a row", "沿着一行走"],
      [
        "In the row of 4, the numbers go 4, 8, 12, 16, 20. Each step along the row adds 4, the number at the start of the row. So the cell after 16 is $16 + 4 = 20$.\n\nCheck: $4 \\times 5 = 20$.\n\n> **Watch out.** Each step adds the row number, not 1.",
        "在 4 这一行，数是 4、8、12、16、20。沿着这一行每走一步就加 4，也就是行首的数。所以 16 后面一格是 $16 + 4 = 20$。\n\n检验：$4 \\times 5 = 20$。\n\n> **注意。** 每走一步加的是行首的数，不是 1。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const start = rng.int(1, 4);
        const columns = [0, 1, 2, 3, 4].map((i) => start + i);
        const at = rng.int(1, 4);
        const b = columns[at] as number;
        const before = a * (b - 1);
        return solved(
          ["What number goes at the question mark in this row?", "这一行问号处应该填几？"],
          a * b,
          [
            [
              ["Find the step", "找每步加几"],
              [`This is the row of ${a}, so each step adds ${a}.`, `这是 ${a} 这一行，每走一步加 ${a}。`],
            ],
            [["Step on", "往后走一步"], [`The cell before it is ${before}:`, `它前一格是 ${before}：`], [`${before} + ${a} = ${a * b}`]],
          ],
          [`$${times(a, b)} = ${a * b}$.`, `$${times(a, b)} = ${a * b}$。`],
          [
            [a * b + 1, "That is 1 more. Each step adds the row number.", "多了 1。每步加的是行首的数。"],
            [a * b + b, "That adds the column number instead of the row number.", "这加的是列首的数，不是行首的数。"],
            [a + b, "That adds the row and column numbers. Multiply them.", "这把行首和列首的数相加了。要相乘。"],
          ],
          timesTableFigure([a], columns, () => true, [a, b]),
        );
      },
      captioned(
        timesTableFigure([4], [1, 2, 3, 4, 5], () => true),
        "The row of 4: 4, 8, 12, 16, 20. Each step adds 4.",
        "4 这一行：4、8、12、16、20。每走一步加 4。",
      ),
    ),
    earlyPoint(
      "even-and-odd-products",
      ["Even and odd products", "乘积的奇偶"],
      [
        "Is $4 \\times 7$ even or odd? 4 is even, so the 4 rows split into two equal halves of 2 rows. The product is even.\n\nCheck: $4 \\times 7 = 28$, which is even.\n\n> **Watch out.** One even factor is enough. A product is odd only when both factors are odd.",
        "$4 \\times 7$ 的积是偶数还是奇数？4 是偶数，4 行可以分成相等的两半，每半 2 行。所以积是偶数。\n\n检验：$4 \\times 7 = 28$，是偶数。\n\n> **注意。** 只要有一个因数是偶数就够了。只有两个因数都是奇数，积才是奇数。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const even = (a * b) % 2 === 0;
        const kind = (n: number): Pair => (n % 2 === 0 ? ["even", "偶数"] : ["odd", "奇数"]);
        const evenEven: Pair = ["Even, because at least one factor is even", "偶数，因为至少有一个因数是偶数"];
        const oddOdd: Pair = ["Odd, because both factors are odd", "奇数，因为两个因数都是奇数"];
        const wrongs: Wrong[] = even
          ? [
              [oddOdd, "At least one factor here is even, so they are not both odd.", "这里至少有一个因数是偶数，不是两个都是奇数。"],
              [
                ["Odd, because at least one factor is odd", "奇数，因为至少有一个因数是奇数"],
                "One odd factor does not make the product odd. Any even factor makes it even.",
                "有一个奇数因数并不能使积是奇数。只要有偶数因数，积就是偶数。",
              ],
              [
                ["Even, because both factors are odd", "偶数，因为两个因数都是奇数"],
                "Two odd factors make an odd product, so the reason is wrong.",
                "两个奇数相乘得奇数，这个理由不对。",
              ],
            ]
          : [
              [evenEven, "Neither factor here is even.", "这里两个因数都不是偶数。"],
              [
                ["Even, because both factors are odd", "偶数，因为两个因数都是奇数"],
                "Two odd factors make an odd product.",
                "两个奇数相乘得奇数。",
              ],
              [
                ["Odd, because at least one factor is even", "奇数，因为至少有一个因数是偶数"],
                "Neither factor is even, and an even factor would make the product even.",
                "两个因数都不是偶数，而且有偶数因数时积是偶数。",
              ],
            ];
        return picked(
          rng,
          [`Is the product $${times(a, b)}$ even or odd?`, `$${times(a, b)}$ 的积是偶数还是奇数？`],
          even ? evenEven : oddOdd,
          wrongs,
          [
            [
              ["Look at each factor", "看每个因数"],
              [`${a} is ${kind(a)[0]} and ${b} is ${kind(b)[0]}.`, `${a} 是${kind(a)[1]}，${b} 是${kind(b)[1]}。`],
            ],
            [
              ["Decide", "判断"],
              even
                ? ["At least one factor is even, so the product is even.", "至少有一个因数是偶数，所以积是偶数。"]
                : ["Both factors are odd, so the product is odd.", "两个因数都是奇数，所以积是奇数。"],
            ],
          ],
          [`$${times(a, b)} = ${a * b}$, which is ${kind(a * b)[0]}.`, `$${times(a, b)} = ${a * b}$，是${kind(a * b)[1]}。`],
        );
      },
      captioned(arrayFigure(4, 7), "4 rows of 7 split into two halves of 2 rows: 28 is even.", "4 行 7 个分成两半，每半 2 行：28 是偶数。"),
    ),
  ],
  [
    "Lily colors every even number in her times table. She sees that the rows of 2, 4, 6 and 8 are all colored, and so are the columns of even numbers.\n\nCheck: $4 \\times 3 = 12$ sits in the row of 4, and it is even.\n\nIn this lesson we find products in a times table and explain its patterns.",
    "Lily 把乘法表里所有的偶数都涂上颜色。她发现 2、4、6、8 这几行全被涂了，偶数的那几列也是。\n\n检验：$4 \\times 3 = 12$ 在 4 这一行，是偶数。\n\n本课我们在乘法表中找乘积，并说明其中的规律。",
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
          "The triangle has 24 at the top and 6 at a corner. The top is the product, so the missing corner times 6 makes 24. Divide: $24 \\div 6 = 4$.\n\nCheck: $6 \\times 4 = 24$.\n\n> **Watch out.** When a corner is missing, divide. Multiplying 24 by 6 goes the wrong way.",
          "三角形上面是 24，一个角上是 6。上面的数是积，所以缺的数乘 6 等于 24。用除法：$24 \\div 6 = 4$。\n\n检验：$6 \\times 4 = 24$。\n\n> **注意。** 缺的是下面的角时，要用除法。用 24 乘 6 就反了。",
        ],
        (rng) => {
          const a = rng.int(2, 9);
          const b = rng.int(2, 9);
          const product = a * b;
          const where = rng.int(0, 2);
          const known = where === 1 ? b : a;
          const answer = where === 0 ? product : where === 1 ? a : b;
          return solved(
            [
              "The top number is the product of the two bottom numbers. What number goes at the question mark?",
              "上面的数是下面两个数的积。问号处应该填几？",
            ],
            answer,
            where === 0
              ? [
                  [
                    ["See what is missing", "看缺什么"],
                    ["The top, the product, is missing.", "缺的是上面的积。"],
                  ],
                  [["Multiply", "相乘"], ["The two corners:", "下面两个数："], [`${times(a, b)} = ${product}`]],
                ]
              : [
                  [
                    ["See what is missing", "看缺什么"],
                    [`A corner is missing: it times ${known} makes ${product}.`, `缺的是下面的一个数：它乘 ${known} 等于 ${product}。`],
                  ],
                  [["Divide", "相除"], ["The top by the known corner:", "上面的数除以已知的数："], [`${div(product, known)} = ${answer}`]],
                ],
            where === 0
              ? [`$${div(product, a)} = ${b}$.`, `$${div(product, a)} = ${b}$。`]
              : [`$${times(answer, known)} = ${product}$.`, `$${times(answer, known)} = ${product}$。`],
            where === 0
              ? [
                  [a + b, "That adds the corners. The top is their product.", "这把下面两个数相加了。上面是它们的积。"],
                  [product + a, `That is one group of ${a} too many.`, `多了一组 ${a}。`],
                  [product - b, `That is one group of ${b} too few.`, `少了一组 ${b}。`],
                ]
              : [
                  [product - known, "That subtracts. A missing factor is found by dividing.", "这是相减。求缺的因数要用除法。"],
                  [product, "That is the top number, already given.", "这是上面已经给出的数。"],
                  [product + known, "That adds. A missing factor is found by dividing.", "这是相加。求缺的因数要用除法。"],
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
        "To find $56 \\div 8$, ask: what number times 8 makes 56? Since $7 \\times 8 = 56$, the answer is 7.\n\nCheck: share 56 into 8 equal groups: each gets 7, because $8 \\times 7 = 56$.\n\n> **Watch out.** The total 56 goes after the equal sign. $56 \\times 8$ is a different question.",
        "求 $56 \\div 8$，就想：几乘 8 等于 56？因为 $7 \\times 8 = 56$，所以答案是 7。\n\n检验：把 56 平均分成 8 组，每组 7 个，因为 $8 \\times 7 = 56$。\n\n> **注意。** 总数 56 要写在等号后面。$56 \\times 8$ 是另一个问题。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.int(3, 9);
        const product = a * b;
        return pickedMath(
          rng,
          [`Which multiplication helps you find $${div(product, b)}$?`, `求 $${div(product, b)}$ 时，哪个乘法算式能帮上忙？`],
          `\\square \\times ${b} = ${product}`,
          rng.sample<MathWrong>(
            [
              [
                `${product} \\times ${b} = \\square`,
                `That multiplies ${product} by ${b}, which gives a much bigger number.`,
                `这是用 ${product} 乘 ${b}，得到的数大得多。`,
              ],
              [
                `\\square \\times ${product} = ${b}`,
                `That puts ${product} as a factor. ${product} is the product, after the equal sign.`,
                `这把 ${product} 当成了因数。${product} 是积，要写在等号后面。`,
              ],
              [
                `${b} + \\square = ${product}`,
                "That adds. Division undoes multiplication, not addition.",
                "这是加法。除法是乘法的逆运算，不是加法的。",
              ],
              [
                `${product} \\times \\square = ${b}`,
                `That makes ${b} the product, but ${b} is smaller than ${product}.`,
                `这把 ${b} 当成了积，但 ${b} 比 ${product} 小。`,
              ],
            ],
            3,
          ),
          [
            [
              ["Turn it around", "反过来想"],
              [
                `Dividing ${product} by ${b} asks what number times ${b} makes ${product}:`,
                `${product} 除以 ${b}，就是问几乘 ${b} 等于 ${product}：`,
              ],
              [`\\square \\times ${b} = ${product}`],
            ],
            [["Use the fact", "用乘法口诀"], ["The missing factor is:", "缺的因数是："], [`${times(a, b)} = ${product}`]],
          ],
          [
            `$${div(product, b)} = ${a}$, and $${times(a, b)} = ${product}$.`,
            `$${div(product, b)} = ${a}$，$${times(a, b)} = ${product}$。`,
          ],
        );
      },
      captioned(
        factTriangleFigure(56, 8, null, "×"),
        "A fact triangle with 56 at the top and 8 at a corner: the other corner is 7.",
        "算式三角形上面是 56，一个角是 8：另一个角是 7。",
      ),
    ),
    earlyPoint(
      "which-fact-does-not-belong",
      ["Which fact does not belong", "哪个算式不属于这一组"],
      [
        "3, 4 and 12 make a fact family. 12 is the largest, so it is the product. True facts: $3 \\times 4 = 12$, $4 \\times 3 = 12$, $12 \\div 3 = 4$, $12 \\div 4 = 3$. But $3 \\div 12 = 4$ is not true.\n\nCheck: $4 \\times 12 = 48$, not 3.\n\n> **Watch out.** In a division the product comes first. Dividing a small number by 12 is wrong.",
        "3、4 和 12 是一组算式的三个数。12 最大，所以是积。对的算式有：$3 \\times 4 = 12$，$4 \\times 3 = 12$，$12 \\div 3 = 4$，$12 \\div 4 = 3$。但 $3 \\div 12 = 4$ 不对。\n\n检验：$4 \\times 12 = 48$，不是 3。\n\n> **注意。** 除法中积要写在最前面。小的数除以 12 是错的。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        let b = rng.int(2, 9);
        if (b === a) b = a === 9 ? 8 : a + 1;
        const c = a * b;
        const flipped = rng.pick([
          [a, b],
          [b, a],
        ] as const);
        return pickedMath(
          rng,
          [
            `The numbers ${a}, ${b} and ${c} make a fact family. Which sentence is not true?`,
            `${a}、${b} 和 ${c} 这三个数可以写成一组算式。哪个算式不对？`,
          ],
          `${div(flipped[0], c)} = ${flipped[1]}`,
          rng.sample<MathWrong>(
            [
              [`${times(a, b)} = ${c}`, `This is true: ${a} groups of ${b} make ${c}.`, `这个对：${a} 个 ${b} 是 ${c}。`],
              [`${times(b, a)} = ${c}`, "This is true: the order of the factors does not matter.", "这个对：因数交换位置，积不变。"],
              [
                `${div(c, a)} = ${b}`,
                `This is true: ${c} shared into ${a} groups gives ${b}.`,
                `这个对：${c} 平均分成 ${a} 组，每组 ${b}。`,
              ],
              [
                `${div(c, b)} = ${a}`,
                `This is true: ${c} shared into ${b} groups gives ${a}.`,
                `这个对：${c} 平均分成 ${b} 组，每组 ${a}。`,
              ],
            ],
            3,
          ),
          [
            [
              ["Find the product", "找出积"],
              [`${c} is the largest, so it is the product.`, `${c} 最大，所以是积。`],
            ],
            [
              ["Check each division", "检查每个除法"],
              [
                `A division must start with ${c}. The sentence that divides ${flipped[0]} by ${c} is not true.`,
                `除法要从 ${c} 开始。${flipped[0]} 除以 ${c} 的算式不对。`,
              ],
            ],
          ],
          [
            `$${times(flipped[1], c)} = ${flipped[1] * c}$, not ${flipped[0]}.`,
            `$${times(flipped[1], c)} = ${flipped[1] * c}$，不是 ${flipped[0]}。`,
          ],
        );
      },
      captioned(
        factTriangleFigure(12, 3, 4, "×"),
        "A fact triangle with 12 at the top and 3 and 4 at the corners.",
        "算式三角形上面是 12，两个角是 3 和 4。",
      ),
    ),
  ],
  [
    "Mia has 12 stickers in 3 rows of 4. She writes four facts with the same three numbers: $3 \\times 4 = 12$, $4 \\times 3 = 12$, $12 \\div 3 = 4$ and $12 \\div 4 = 3$.\n\nCheck: each fact describes the same 3 rows of 4.\n\nIn this lesson we use fact triangles to link multiplication and division.",
    "Mia 有 12 张贴纸，排成 3 行，每行 4 张。她用这三个数写了四个算式：$3 \\times 4 = 12$，$4 \\times 3 = 12$，$12 \\div 3 = 4$，$12 \\div 4 = 3$。\n\n检验：每个算式说的都是同样的 3 行 4 张。\n\n本课我们用算式三角形把乘法和除法联系起来。",
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
        "For $\\square \\times 6 = 42$, ask: how many sixes make 42? Count by sixes: 6, 12, 18, 24, 30, 36, 42. That is 7 sixes, so the box is 7.\n\nCheck: $7 \\times 6 = 42$.\n\n> **Watch out.** Do not subtract: $42 - 6 = 36$ is not a factor here.",
        "对于 $\\square \\times 6 = 42$，就问：几个 6 是 42？六个六个地数：6、12、18、24、30、36、42。一共 7 个 6，所以方框里填 7。\n\n检验：$7 \\times 6 = 42$。\n\n> **注意。** 不要相减：$42 - 6 = 36$ 不是这里的因数。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = a * b;
        const first = rng.bool();
        const sentence = first ? `\\square \\times ${b} = ${c}` : `${b} \\times \\square = ${c}`;
        return solved(
          [`What number goes in the box? $${sentence}$`, `方框里填几？$${sentence}$`],
          a,
          [
            [
              ["Ask the question", "想一想"],
              [`How many groups of ${b} make ${c}?`, `几个 ${b} 是 ${c}？`],
            ],
            [
              ["Use a fact", "用乘法口诀"],
              [`Count by ${b}s to ${c}, or use the fact:`, `${b} 个 ${b} 个地数到 ${c}，或者用口诀：`],
              [`${times(a, b)} = ${c}`],
            ],
          ],
          [`$${div(c, b)} = ${a}$.`, `$${div(c, b)} = ${a}$。`],
          [
            [c - b, `That subtracts ${b} from ${c}. A missing factor comes from dividing.`, `这是用 ${c} 减 ${b}。缺的因数要用除法求。`],
            [c + b, "That adds the two numbers. A missing factor comes from dividing.", "这是把两个数相加。缺的因数要用除法求。"],
            [c, "That is the product, already given.", "这是已经给出的积。"],
          ],
          factTriangleFigure(c, null, b, "×"),
        );
      },
      captioned(
        factTriangleFigure(42, null, 6, "×"),
        "A fact triangle with 42 at the top and 6 at a corner: the missing corner is 7.",
        "算式三角形上面是 42，一个角是 6：缺的角是 7。",
      ),
    ),
    earlyPoint(
      "a-missing-divisor",
      ["A missing divisor", "缺少的除数"],
      [
        "In $48 \\div \\square = 6$, 48 is shared into equal groups with 6 in each. How many groups? $8 \\times 6 = 48$, so there are 8 groups, and the box is 8.\n\nCheck: $48 \\div 8 = 6$.\n\n> **Watch out.** Do not multiply 48 by 6. The box is smaller than 48.",
        "在 $48 \\div \\square = 6$ 中，48 平均分成几组，每组 6 个。有几组？$8 \\times 6 = 48$，所以有 8 组，方框里填 8。\n\n检验：$48 \\div 8 = 6$。\n\n> **注意。** 不要用 48 乘 6。方框里的数比 48 小。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = a * b;
        return solved(
          [`What number goes in the box? $${c} \\div \\square = ${b}$`, `方框里填几？$${c} \\div \\square = ${b}$`],
          a,
          [
            [
              ["Think in groups", "想成分组"],
              [`${c} is shared into equal groups with ${b} in each. How many groups?`, `${c} 平均分成几组，每组 ${b} 个。有几组？`],
            ],
            [["Use a fact", "用乘法口诀"], ["The number of groups:", "组数："], [`${times(a, b)} = ${c}`]],
          ],
          [`$${div(c, a)} = ${b}$.`, `$${div(c, a)} = ${b}$。`],
          [
            [
              c - b,
              `That subtracts ${b} from ${c}. Think how many groups of ${b} make ${c}.`,
              `这是用 ${c} 减 ${b}。要想几个 ${b} 是 ${c}。`,
            ],
            [c + b, "That adds the two numbers.", "这是把两个数相加。"],
            [c * b, `That multiplies ${c} by ${b}, which is far bigger than ${c}.`, `这是用 ${c} 乘 ${b}，比 ${c} 大得多。`],
          ],
          factTriangleFigure(c, null, b, "×"),
        );
      },
      captioned(
        factTriangleFigure(48, null, 6, "×"),
        "A fact triangle with 48 at the top and 6 at a corner: the missing corner is 8.",
        "算式三角形上面是 48，一个角是 6：缺的角是 8。",
      ),
    ),
    earlyPoint(
      "a-missing-dividend",
      ["A missing dividend", "缺少的被除数"],
      [
        "In $\\square \\div 4 = 7$, the box is the whole before sharing. There are 4 groups of 7, so the whole is $4 \\times 7 = 28$.\n\nCheck: $28 \\div 4 = 7$.\n\n> **Watch out.** Here you multiply, even though the sentence shows division. $7 \\div 4$ does not make sense here.",
        "在 $\\square \\div 4 = 7$ 中，方框是分之前的总数。分成 4 组，每组 7 个，所以总数是 $4 \\times 7 = 28$。\n\n检验：$28 \\div 4 = 7$。\n\n> **注意。** 虽然算式里是除法，这里却要用乘法。$7 \\div 4$ 在这里讲不通。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 10);
        const c = a * b;
        return solved(
          [`What number goes in the box? $\\square \\div ${a} = ${b}$`, `方框里填几？$\\square \\div ${a} = ${b}$`],
          c,
          [
            [
              ["See the whole", "看出总数"],
              [`The box is the whole: ${a} groups with ${b} in each.`, `方框是总数：${a} 组，每组 ${b} 个。`],
            ],
            [["Multiply", "相乘"], ["The whole:", "总数："], [`${times(a, b)} = ${c}`]],
          ],
          [`$${div(c, a)} = ${b}$.`, `$${div(c, a)} = ${b}$。`],
          [
            [
              a + b,
              "That adds the two numbers. The whole is groups times the number in each.",
              "这是把两个数相加。总数等于组数乘每组的个数。",
            ],
            [c + a, `That is one group of ${a} too many.`, `多了一组 ${a}。`],
            [c - a, `That is one group of ${a} too few.`, `少了一组 ${a}。`],
          ],
          arrayFigure(a, b),
        );
      },
      captioned(arrayFigure(4, 7), "4 rows of 7 make the whole, 28.", "4 行，每行 7 个，总数是 28。"),
    ),
  ],
  [
    "Leo puts 24 cookies on plates, 6 on each plate. He writes $24 \\div \\square = 6$ and thinks: how many sixes make 24? $4 \\times 6 = 24$, so he needs 4 plates.\n\nCheck: $24 \\div 4 = 6$.\n\nIn this lesson we find a missing number anywhere in a multiplication or division sentence.",
    "Leo 把 24 块饼干放到盘子里，每盘 6 块。他写下 $24 \\div \\square = 6$，想：几个 6 是 24？$4 \\times 6 = 24$，所以要 4 个盘子。\n\n检验：$24 \\div 4 = 6$。\n\n本课我们找出乘法或除法算式中任何位置上缺少的数。",
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
          "To find $4 \\times 13$, draw a rectangle 4 by 13 and split 13 into 10 and 3. The left part is $4 \\times 10 = 40$ and the right part is $4 \\times 3 = 12$.\n\nCheck: $40 + 12 = 52$, and 13 fours are 52.\n\n> **Watch out.** Use only the sides of that part. The right part is 4 by 3, not 4 by 13.",
          "求 $4 \\times 13$，画一个 4 乘 13 的长方形，把 13 拆成 10 和 3。左边部分是 $4 \\times 10 = 40$，右边部分是 $4 \\times 3 = 12$。\n\n检验：$40 + 12 = 52$，13 个 4 是 52。\n\n> **注意。** 只用这一部分的边长。右边部分是 4 乘 3，不是 4 乘 13。",
        ],
        (rng) => {
          const h = rng.int(3, 8);
          const ones = rng.int(2, 9);
          const tensPart = rng.bool();
          const side = tensPart ? 10 : ones;
          const answer = side * h;
          return solved(
            ["What is the area of the part with the question mark?", "问号这部分的面积是多少？"],
            answer,
            [
              [
                ["Read its sides", "读出边长"],
                [`The part with the question mark is ${h} by ${side}.`, `问号这部分是 ${h} 乘 ${side}。`],
              ],
              [["Multiply", "相乘"], ["Its area:", "它的面积："], [`${times(h, side)} = ${answer}`]],
            ],
            [
              `The two parts make $${10 * h} + ${ones * h} = ${(10 + ones) * h}$, which is $${times(h, 10 + ones)}$.`,
              `两部分合起来是 $${10 * h} + ${ones * h} = ${(10 + ones) * h}$，正是 $${times(h, 10 + ones)}$。`,
            ],
            [
              [h + side, "That adds the two sides. Area is found by multiplying.", "这是把两条边相加。面积要用乘法算。"],
              [10 * h + ones * h, "That is the area of the whole rectangle, not one part.", "这是整个长方形的面积，不是一部分。"],
              [side, `That is only one side. Multiply it by ${h}.`, `这只是一条边，还要乘 ${h}。`],
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
          "For $6 \\times 14$, the rectangle splits into $6 \\times 10 = 60$ and $6 \\times 4 = 24$. The whole is the two parts together: $60 + 24 = 84$.\n\nCheck: $6 \\times 14$ is a bit more than $6 \\times 10 = 60$ and less than $6 \\times 20 = 120$, and 84 is between.\n\n> **Watch out.** Add both parts. Leaving out the 24 gives only 60.",
          "求 $6 \\times 14$，长方形分成 $6 \\times 10 = 60$ 和 $6 \\times 4 = 24$ 两部分。整个长方形是两部分合起来：$60 + 24 = 84$。\n\n检验：$6 \\times 14$ 比 $6 \\times 10 = 60$ 大一些，比 $6 \\times 20 = 120$ 小，84 在它们之间。\n\n> **注意。** 两部分都要加上。漏掉 24 就只剩 60。",
        ],
        (rng) => {
          const h = rng.int(3, 8);
          const ones = rng.int(2, 9);
          const n = 10 + ones;
          return solved(
            [`The rectangle shows $${times(h, n)}$. What is the product?`, `这个长方形表示 $${times(h, n)}$。积是多少？`],
            h * n,
            [
              [
                ["Find each part", "求每部分"],
                ["The two parts are:", "两部分是："],
                [`${times(h, 10)} = ${10 * h}`, `${times(h, ones)} = ${ones * h}`],
              ],
              [["Add the parts", "把两部分相加"], ["The whole rectangle:", "整个长方形："], [`${10 * h} + ${ones * h} = ${h * n}`]],
            ],
            [
              `$${times(h, n)}$ lies between $${times(h, 10)} = ${10 * h}$ and $${times(h, 20)} = ${20 * h}$, and ${h * n} does too.`,
              `$${times(h, n)}$ 在 $${times(h, 10)} = ${10 * h}$ 和 $${times(h, 20)} = ${20 * h}$ 之间，${h * n} 也是。`,
            ],
            [
              [10 * h, `That is only the part ${h} by 10.`, `这只是 ${h} 乘 10 那部分。`],
              [ones * h, `That is only the part ${h} by ${ones}.`, `这只是 ${h} 乘 ${ones} 那部分。`],
              [h + n, "That adds the two sides instead of multiplying.", "这是把两条边相加，不是相乘。"],
              [
                10 * h + ones,
                `That adds ${ones} instead of ${ones * h}, the area of the small part.`,
                `这里加的是 ${ones}，应该加小部分的面积 ${ones * h}。`,
              ],
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
        "To find $7 \\times 13$, split 13 into 10 and 3. Multiply each part by 7: $7 \\times 10 + 7 \\times 3 = 70 + 21 = 91$.\n\nCheck: 13 sevens are 10 sevens and 3 sevens, $70 + 21 = 91$.\n\n> **Watch out.** Both parts are multiplied by 7. $7 \\times 10 + 3$ forgets to multiply the 3.",
        "求 $7 \\times 13$，把 13 拆成 10 和 3。每部分都乘 7：$7 \\times 10 + 7 \\times 3 = 70 + 21 = 91$。\n\n检验：13 个 7 就是 10 个 7 加 3 个 7，$70 + 21 = 91$。\n\n> **注意。** 两部分都要乘 7。$7 \\times 10 + 3$ 忘了把 3 乘 7。",
      ],
      (rng) => {
        const h = rng.int(3, 9);
        const ones = rng.int(2, 9);
        const n = 10 + ones;
        return pickedMath(
          rng,
          [`Which is the same as $${times(h, n)}$?`, `哪个算式和 $${times(h, n)}$ 相等？`],
          `${times(h, 10)} + ${times(h, ones)}`,
          rng.sample<MathWrong>(
            [
              [`${times(h, 10)} + ${ones}`, `The ${ones} must also be multiplied by ${h}.`, `${ones} 也要乘 ${h}。`],
              [
                `${h} + ${times(10, ones)}`,
                `This multiplies 10 by ${ones} and leaves ${h} on its own, but both parts of ${n} are multiplied by ${h}.`,
                `这里用 10 乘 ${ones}，而 ${h} 单独放着，但 ${n} 的两部分都要乘 ${h}。`,
              ],
              [`${times(h, 10)} \\times ${times(h, ones)}`, "The two parts are added, not multiplied.", "两部分要相加，不是相乘。"],
              [`${times(h, 1)} + ${times(h, ones)}`, `The tens part of ${n} is 10, not 1.`, `${n} 中十的部分是 10，不是 1。`],
            ],
            3,
          ),
          [
            [
              ["Split the teen number", "拆开十几"],
              [`${n} is 10 and ${ones}.`, `${n} 是 10 和 ${ones}。`],
            ],
            [
              ["Multiply each part", "每部分都乘"],
              [`Both parts are multiplied by ${h}:`, `两部分都乘 ${h}：`],
              [`${times(h, 10)} + ${times(h, ones)} = ${10 * h} + ${ones * h} = ${h * n}`],
            ],
          ],
          [`${n} groups of ${h} are ${h * n}, the same.`, `${n} 个 ${h} 是 ${h * n}，一样。`],
          areaModelFigure(h, [10, ones], ["?", "?"]),
        );
      },
      captioned(
        areaModelFigure(7, [10, 3], ["70", "21"]),
        "A 7 by 13 rectangle split into 7 by 10, which is 70, and 7 by 3, which is 21.",
        "7 乘 13 的长方形分成 7 乘 10 是 70，和 7 乘 3 是 21。",
      ),
    ),
  ],
  [
    "A garden bed is 5 feet by 12 feet. Ana splits it into a part 5 by 10 and a part 5 by 2. The parts are 50 and 10 square feet, so the bed is 60 square feet.\n\nCheck: $5 \\times 12 = 60$.\n\nIn this lesson we split a rectangle into two parts to multiply by a teen number.",
    "一块花坛长 12 英尺、宽 5 英尺。Ana 把它分成 5 乘 10 和 5 乘 2 两部分。两部分是 50 和 10 平方英尺，所以花坛是 60 平方英尺。\n\n检验：$5 \\times 12 = 60$。\n\n本课我们把长方形分成两部分，算一位数乘十几。",
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
        "A hall has 5 rows of chairs with 8 chairs in each row. Every row is the same, so multiply: $5 \\times 8 = 40$ chairs.\n\nCheck: count by eights: 8, 16, 24, 32, 40.\n\n> **Watch out.** Do not add the rows and the chairs in a row: $5 + 8 = 13$ is far too few.",
        "礼堂里有 5 排椅子，每排 8 把。每排一样多，所以用乘法：$5 \\times 8 = 40$ 把。\n\n检验：八个八个地数：8、16、24、32、40。\n\n> **注意。** 不要把排数和每排的把数相加：$5 + 8 = 13$ 太少了。",
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
        return solved(
          [
            `The picture shows ${setting[0]}, with ${rows} rows and ${cols} in each row. How many are there in all?`,
            `图上是${setting[1]}，有 ${rows} 行，每行 ${cols} ${setting[2]}。一共有多少${setting[2]}？`,
          ],
          rows * cols,
          [
            [
              ["See equal rows", "看出每行一样多"],
              [`There are ${rows} rows with ${cols} in each.`, `有 ${rows} 行，每行 ${cols} ${setting[2]}。`],
            ],
            [["Multiply", "相乘"], ["Rows times the number in each row:", "行数乘每行的个数："], [`${times(rows, cols)} = ${rows * cols}`]],
          ],
          [
            `Count by ${cols}s ${rows} times: ${Array.from({ length: rows }, (_, i) => cols * (i + 1)).join(", ")}.`,
            `${cols} 个 ${cols} 个地数 ${rows} 次：${Array.from({ length: rows }, (_, i) => cols * (i + 1)).join("、")}。`,
          ],
          [
            [rows + cols, "That adds the rows and the number in each row. Multiply them.", "这是把行数和每行的个数相加。要相乘。"],
            [rows * cols + cols, "That counts one row too many.", "多数了一行。"],
            [rows * cols - rows, "That counts one column too few.", "少数了一列。"],
          ],
          arrayFigure(rows, cols),
        );
      },
      captioned(arrayFigure(5, 8), "5 rows of 8 chairs make 40 chairs.", "5 排，每排 8 把椅子，一共 40 把。"),
    ),
    earlyPoint(
      "how-many-in-each-row",
      ["How many in each row", "每行有多少"],
      [
        "Mo puts 24 apples in 4 equal rows. How many in each row? Share 24 into 4 rows: $24 \\div 4 = 6$.\n\nCheck: $4 \\times 6 = 24$.\n\n> **Watch out.** The answer must be smaller than the total. $24 - 4 = 20$ only takes away 4 apples.",
        "Mo 把 24 个苹果摆成 4 行，每行同样多。每行几个？把 24 平均分成 4 行：$24 \\div 4 = 6$。\n\n检验：$4 \\times 6 = 24$。\n\n> **注意。** 答案要比总数小。$24 - 4 = 20$ 只是拿走了 4 个苹果。",
      ],
      (rng) => {
        const rows = rng.int(3, 9);
        const cols = rng.int(3, 9);
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const total = rows * cols;
        const findEach = rng.bool();
        const known = findEach ? rows : cols;
        const answer = findEach ? cols : rows;
        return solved(
          findEach
            ? [
                `${name} arranges ${total} ${thing.en} in ${rows} equal rows. How many ${thing.en} are in each row?`,
                `${name} 把 ${total} ${thing.unit}${thing.zh}摆成 ${rows} 行，每行同样多。每行有多少${thing.unit}？`,
              ]
            : [
                `${name} arranges ${total} ${thing.en} with ${cols} in each row. How many rows are there?`,
                `${name} 把 ${total} ${thing.unit}${thing.zh}摆成几行，每行 ${cols} ${thing.unit}。一共有多少行？`,
              ],
          answer,
          [
            [
              ["Choose the operation", "选运算"],
              findEach
                ? [`${total} is shared equally into ${rows} rows, so divide.`, `把 ${total} 平均分成 ${rows} 行，要用除法。`]
                : [`Ask how many groups of ${cols} make ${total}, so divide.`, `问 ${total} 里有几个 ${cols}，要用除法。`],
            ],
            [["Divide", "相除"], ["Use the multiplication fact:", "用乘法口诀："], [`${div(total, known)} = ${answer}`]],
          ],
          [`$${times(rows, cols)} = ${total}$.`, `$${times(rows, cols)} = ${total}$。`],
          [
            [
              total - known,
              `That subtracts ${known} from ${total}. Sharing equally is division.`,
              `这是用 ${total} 减 ${known}。平均分要用除法。`,
            ],
            [total, "That is the total, already given.", "这是已经给出的总数。"],
            [total + known, `That adds ${known}. The answer must be smaller than the total.`, `这是加 ${known}。答案要比总数小。`],
          ],
          arrayFigure(rows, cols),
        );
      },
      captioned(arrayFigure(4, 6), "24 apples in 4 equal rows: 6 in each row.", "24 个苹果摆成 4 行：每行 6 个。"),
    ),
    earlyPoint(
      "equal-measures",
      ["Equal measures", "相同的长度和重量"],
      [
        "Each ribbon is 6 meters long. 4 ribbons are 4 equal lengths of 6 meters: $4 \\times 6 = 24$ meters.\n\nCheck: $24 \\div 6 = 4$ ribbons.\n\n> **Watch out.** Joining ribbons makes the length longer. $6 + 4 = 10$ adds the count to one length.",
        "每条丝带长 6 米。4 条丝带就是 4 个 6 米：$4 \\times 6 = 24$ 米。\n\n检验：$24 \\div 6 = 4$ 条。\n\n> **注意。** 把丝带接起来会更长。$6 + 4 = 10$ 是把条数加到一条的长度上。",
      ],
      (rng) => {
        const size = rng.int(2, 9);
        const count = rng.int(3, 9);
        const total = size * count;
        const form = rng.int(0, 2);
        const bar = partWholeBarFigure(
          Array.from({ length: count }, () => size),
          form === 1 ? -2 : -1,
        );
        if (form === 1)
          return solved(
            [
              `A rope ${total} meters long is cut into pieces of ${size} meters each. How many pieces are there?`,
              `一根 ${total} 米长的绳子，剪成每段 ${size} 米。可以剪成多少段？`,
            ],
            count,
            [
              [
                ["Choose the operation", "选运算"],
                [`Ask how many ${size}s fit in ${total}, so divide.`, `问 ${total} 里有几个 ${size}，要用除法。`],
              ],
              [["Divide", "相除"], ["The number of pieces:", "段数："], [`${div(total, size)} = ${count}`]],
            ],
            [
              `${count} pieces of ${size} meters make $${times(count, size)} = ${total}$ meters.`,
              `${count} 段，每段 ${size} 米，合起来是 $${times(count, size)} = ${total}$ 米。`,
            ],
            [
              [
                total - size,
                `That takes away one piece. Count how many pieces of ${size} fit.`,
                `这只是剪掉了一段。要数能剪出几段 ${size} 米。`,
              ],
              [total + size, "That adds, but cutting gives fewer pieces than meters.", "这是相加，可是段数比米数少。"],
              [total, "That is the length of the rope, not the number of pieces.", "这是绳子的长度，不是段数。"],
            ],
            bar,
          );
        const rice = form === 2;
        const unit: Pair = rice ? ["kilograms", "千克"] : ["meters", "米"];
        return solved(
          rice
            ? [
                `A bag of rice has a mass of ${size} kilograms. What is the mass of ${count} such bags, in kilograms?`,
                `一袋大米重 ${size} 千克。${count} 袋这样的大米重多少千克？`,
              ]
            : [
                `Each ribbon is ${size} meters long. How many meters long are ${count} ribbons in all?`,
                `每条丝带长 ${size} 米。${count} 条丝带一共长多少米？`,
              ],
          total,
          [
            [
              ["See equal groups", "看出同样多的几组"],
              [`There are ${count} equal amounts of ${size} ${unit[0]}.`, `有 ${count} 个 ${size} ${unit[1]}。`],
            ],
            [["Multiply", "相乘"], ["In all:", "一共："], [`${times(count, size)} = ${total}`]],
          ],
          [
            `$${div(total, size)} = ${count}$, the number of ${rice ? "bags" : "ribbons"}.`,
            `$${div(total, size)} = ${count}$，正是${rice ? "袋数" : "条数"}。`,
          ],
          [
            [size + count, "That adds the count to one amount. Multiply them.", "这是把个数加到一份上。要相乘。"],
            [total + size, `That is one ${rice ? "bag" : "ribbon"} too many.`, `多算了一${rice ? "袋" : "条"}。`],
            [total - size, `That is one ${rice ? "bag" : "ribbon"} too few.`, `少算了一${rice ? "袋" : "条"}。`],
          ],
          bar,
        );
      },
      captioned(
        partWholeBarFigure([6, 6, 6, 6], -1),
        "4 ribbons of 6 meters each, joined into one length of 24 meters.",
        "4 条丝带，每条 6 米，接起来是 24 米。",
      ),
    ),
  ],
  [
    "A baker puts 4 rows of buns on a tray, with 5 buns in each row. Instead of counting one by one, she multiplies: $4 \\times 5 = 20$ buns.\n\nCheck: $5 + 5 + 5 + 5 = 20$.\n\nIn this lesson we multiply and divide in stories about rows of things and equal measures.",
    "面包师在烤盘上摆了 4 行面包，每行 5 个。她不用一个一个地数，而是用乘法：$4 \\times 5 = 20$ 个。\n\n检验：$5 + 5 + 5 + 5 = 20$。\n\n本课我们在有关成行的东西和相同长度的故事中做乘除法。",
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
        "A letter works like a box. In $n + 14 = 30$, the whole is 30 and one part is 14, so $n = 30 - 14 = 16$.\n\nCheck: $16 + 14 = 30$.\n\n> **Watch out.** Do not add 14 to 30. The letter is a part, so it is smaller than 30.",
        "字母和方框的作用一样。在 $n + 14 = 30$ 中，总数是 30，一部分是 14，所以 $n = 30 - 14 = 16$。\n\n检验：$16 + 14 = 30$。\n\n> **注意。** 不要用 30 加 14。字母是一部分，比 30 小。",
      ],
      (rng) => {
        const letter = rng.pick(["n", "m", "k", "x", "y"]);
        const form = rng.int(0, 2);
        if (form === 0) {
          const a = rng.int(5, 40);
          const b = rng.int(5, 40);
          return solved(
            [`What is the value of $${letter}$? $${letter} + ${a} = ${a + b}$`, `$${letter}$ 等于多少？$${letter} + ${a} = ${a + b}$`],
            b,
            [
              [
                ["Find the parts", "找出部分和总数"],
                [`The whole is ${a + b}, and one part is ${a}.`, `总数是 ${a + b}，一部分是 ${a}。`],
              ],
              [["Subtract", "相减"], ["The other part:", "另一部分："], [`${a + b} - ${a} = ${b}`]],
            ],
            [`$${b} + ${a} = ${a + b}$.`, `$${b} + ${a} = ${a + b}$。`],
            [
              [
                a + b + a,
                `That adds ${a} again. The letter is a part, smaller than ${a + b}.`,
                `这是又加了 ${a}。字母是一部分，比 ${a + b} 小。`,
              ],
              [a + b, "That is the whole, already given.", "这是已经给出的总数。"],
              [b + 1, "That is 1 too many. Check the subtraction.", "多了 1。再算一遍减法。"],
            ],
            partWholeBarFigure([b, a], 0),
          );
        }
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        if (form === 1)
          return solved(
            [
              `What is the value of $${letter}$? $${a} \\times ${letter} = ${a * b}$`,
              `$${letter}$ 等于多少？$${a} \\times ${letter} = ${a * b}$`,
            ],
            b,
            [
              [
                ["Ask the question", "想一想"],
                [`What number times ${a} makes ${a * b}?`, `${a} 乘几等于 ${a * b}？`],
              ],
              [["Use a fact", "用乘法口诀"], ["The letter is:", "字母是："], [`${div(a * b, a)} = ${b}`]],
            ],
            [`$${times(a, b)} = ${a * b}$.`, `$${times(a, b)} = ${a * b}$。`],
            [
              [a * b - a, `That subtracts ${a}. A missing factor comes from dividing.`, `这是减 ${a}。缺的因数要用除法求。`],
              [a * b, "That is the product, already given.", "这是已经给出的积。"],
              [a * b + a, `That adds ${a}. A missing factor comes from dividing.`, `这是加 ${a}。缺的因数要用除法求。`],
            ],
            factTriangleFigure(a * b, a, null, "×"),
          );
        return solved(
          [`What is the value of $${letter}$? $${letter} \\div ${a} = ${b}$`, `$${letter}$ 等于多少？$${letter} \\div ${a} = ${b}$`],
          a * b,
          [
            [
              ["See the whole", "看出总数"],
              [`$${letter}$ is shared into ${a} groups with ${b} in each.`, `$${letter}$ 平均分成 ${a} 组，每组 ${b}。`],
            ],
            [["Multiply", "相乘"], ["The whole:", "总数："], [`${times(a, b)} = ${a * b}`]],
          ],
          [`$${div(a * b, a)} = ${b}$.`, `$${div(a * b, a)} = ${b}$。`],
          [
            [a + b, "That adds the two numbers. Multiply to undo dividing.", "这是相加。要用乘法还原除法。"],
            [a * b + a, `That is one group of ${a} too many.`, `多了一组 ${a}。`],
            [a * b - b, `That is one group of ${b} too few.`, `少了一组 ${b}。`],
          ],
          factTriangleFigure(null, a, b, "×"),
        );
      },
      captioned(
        partWholeBarFigure([16, 14], 0),
        "A bar of 30 split into the unknown part and 14: the unknown part is 16.",
        "总数 30 的条形分成未知部分和 14：未知部分是 16。",
      ),
    ),
    earlyPoint(
      "an-equation-for-a-story",
      ["An equation for a story", "为故事写等式"],
      [
        "5 boxes each hold $n$ pencils, and there are 40 pencils in all. Equal groups mean multiplying, so the equation is $5 \\times n = 40$.\n\nCheck: read it aloud: 5 boxes of $n$ make 40. Then $n = 8$, and 5 boxes of 8 are 40.\n\n> **Watch out.** $5 + n = 40$ would mean 5 pencils and $n$ more, not 5 boxes.",
        "5 盒铅笔，每盒 $n$ 支，一共 40 支。同样多的几组要用乘法，所以等式是 $5 \\times n = 40$。\n\n检验：读一读：5 盒，每盒 $n$ 支，一共 40 支。那么 $n = 8$，5 盒 8 支是 40 支。\n\n> **注意。** $5 + n = 40$ 的意思是 5 支再加 $n$ 支，不是 5 盒。",
      ],
      (rng) => {
        const boxes = rng.int(3, 9);
        const each = rng.int(3, 9);
        const total = boxes * each;
        const letter = rng.pick(["n", "m", "k"]);
        const thing = rng.pick(earlyThings);
        return pickedMath(
          rng,
          [
            `There are ${boxes} boxes with $${letter}$ ${thing.en} in each box, and ${total} ${thing.en} in all. Which equation tells this story?`,
            `有 ${boxes} 盒${thing.zh}，每盒 $${letter}$ ${thing.unit}，一共 ${total} ${thing.unit}。哪个等式能表示这个故事？`,
          ],
          `${boxes} \\times ${letter} = ${total}`,
          rng.sample<MathWrong>(
            [
              [
                `${boxes} + ${letter} = ${total}`,
                `That means ${boxes} ${thing.en} and $${letter}$ more, not ${boxes} boxes.`,
                `这表示 ${boxes} ${thing.unit}再加 $${letter}$ ${thing.unit}，不是 ${boxes} 盒。`,
              ],
              [
                `${total} \\times ${boxes} = ${letter}`,
                `That makes $${letter}$ much bigger than ${total}, but one box holds fewer than all.`,
                `这样 $${letter}$ 比 ${total} 大得多，可是一盒比总数少。`,
              ],
              [
                `${letter} \\div ${boxes} = ${total}`,
                `That makes ${total} the amount in each part, but ${total} is the total.`,
                `这把 ${total} 当成了每份的数，但 ${total} 是总数。`,
              ],
              [
                `${boxes} \\div ${letter} = ${total}`,
                `That divides the ${boxes} boxes, but ${total} is the total, made by multiplying.`,
                `这是把 ${boxes} 盒相除，但总数 ${total} 是用乘法得到的。`,
              ],
            ],
            3,
          ),
          [
            [
              ["Name the letter", "说清字母"],
              [`$${letter}$ is the number of ${thing.en} in one box.`, `$${letter}$ 是一盒里${thing.zh}的${thing.unit}数。`],
            ],
            [
              ["Write what happens", "写出发生的事"],
              [`${boxes} equal boxes of $${letter}$ make ${total}:`, `${boxes} 盒，每盒 $${letter}$，合起来是 ${total}：`],
              [`${boxes} \\times ${letter} = ${total}`],
            ],
          ],
          [
            `Then $${letter} = ${each}$, and ${boxes} boxes of ${each} are $${times(boxes, each)} = ${total}$.`,
            `那么 $${letter} = ${each}$，${boxes} 盒每盒 ${each} ${thing.unit}，是 $${times(boxes, each)} = ${total}$。`,
          ],
          arrayFigure(boxes, each),
        );
      },
      captioned(
        arrayFigure(5, 8),
        "5 boxes of 8 pencils, shown as 5 rows of 8: 40 in all.",
        "5 盒铅笔，每盒 8 支，画成 5 行 8 个：一共 40 支。",
      ),
    ),
    earlyPoint(
      "a-letter-for-the-answer-to-two-steps",
      ["A letter in a two-step story", "两步故事中的字母"],
      [
        "Kim has 5 cards and buys 3 packs of 6 cards. The total is $t = 3 \\times 6 + 5$. First multiply: $3 \\times 6 = 18$. Then add: $t = 18 + 5 = 23$.\n\nCheck: $23 - 5 = 18$, the cards in the packs.\n\n> **Watch out.** Multiply first. $3 \\times 11 = 33$ adds 5 to the 6 before multiplying.",
        "Kim 有 5 张卡片，又买了 3 包，每包 6 张。总数是 $t = 3 \\times 6 + 5$。先算乘法：$3 \\times 6 = 18$。再算加法：$t = 18 + 5 = 23$。\n\n检验：$23 - 5 = 18$，正是这几包的张数。\n\n> **注意。** 先算乘法。$3 \\times 11 = 33$ 是先把 5 加到 6 上再乘，是错的。",
      ],
      (rng) => {
        const packs = rng.int(2, 8);
        const each = rng.int(3, 9);
        const extra = rng.int(2, 20);
        const plus = rng.bool();
        const change = plus ? extra : Math.min(extra, packs * each - 1);
        const value = plus ? packs * each + change : packs * each - change;
        const name = rng.pick(earlyNames);
        const sign = plus ? "+" : "-";
        return solved(
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
          [
            [["Multiply first", "先算乘法"], ["The cards in the packs:", "这几包的张数："], [`${times(packs, each)} = ${packs * each}`]],
            [
              [plus ? "Then add" : "Then subtract", plus ? "再算加法" : "再算减法"],
              ["The value of $t$:", "$t$ 的值："],
              [`${packs * each} ${sign} ${change} = ${value}`],
            ],
          ],
          plus
            ? [
                `$${value} - ${change} = ${packs * each}$, the cards in the packs.`,
                `$${value} - ${change} = ${packs * each}$，正是这几包的张数。`,
              ]
            : [
                `$${value} + ${change} = ${packs * each}$, the cards in the packs.`,
                `$${value} + ${change} = ${packs * each}$，正是这几包的张数。`,
              ],
          [
            [packs + each + change, "That adds all three numbers. The packs must be multiplied.", "这是把三个数都相加了。几包要用乘法。"],
            [
              packs * each,
              `That is only the first step. ${plus ? "Add" : "Subtract"} ${change} next.`,
              `这只是第一步。还要${plus ? "加" : "减"} ${change}。`,
            ],
            [
              packs * (each + (plus ? change : -change)),
              `That ${plus ? "adds" : "subtracts"} ${change} before multiplying. Multiply first.`,
              `这是先${plus ? "加" : "减"} ${change} 再乘。要先算乘法。`,
            ],
          ],
          plus ? partWholeBarFigure([packs * each, change], -1) : partWholeBarFigure([value, change], 0),
        );
      },
      captioned(
        partWholeBarFigure([18, 5], -1),
        "18 cards from 3 packs of 6 and 5 cards Kim had make the total.",
        "3 包每包 6 张共 18 张，加上原来的 5 张，就是总数。",
      ),
    ),
  ],
  [
    "Zoe has some marbles. After she gets 12 more, she has 30. She writes $m + 12 = 30$, where $m$ is the marbles she had. Then $m = 30 - 12 = 18$.\n\nCheck: $18 + 12 = 30$.\n\nIn this lesson we use a letter for an unknown number, find its value, and write equations for stories.",
    "Zoe 有一些弹珠。她又得到 12 颗后，一共有 30 颗。她写下 $m + 12 = 30$，$m$ 是她原来的弹珠数。那么 $m = 30 - 12 = 18$。\n\n检验：$18 + 12 = 30$。\n\n本课我们用字母表示未知数，求出它的值，并为故事写出等式。",
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
        "About how much is $389 + 412$? Round each number to the nearest hundred: 389 is about 400 and 412 is about 400. Then $400 + 400 = 800$.\n\nCheck: the exact sum is 801, close to 800.\n\n> **Watch out.** Round first, then add. The estimate should be a round number.",
        "$389 + 412$ 大约是多少？把每个数四舍五入到百位：389 约等于 400，412 约等于 400。再算 $400 + 400 = 800$。\n\n检验：准确的和是 801，和 800 很接近。\n\n> **注意。** 先四舍五入，再相加。估算的结果应该是整百数。",
      ],
      (rng) => {
        const a = rng.int(112, 480);
        const b = rng.int(112, 480);
        const round = (v: number) => Math.round(v / 100) * 100;
        const answer = round(a) + round(b);
        return solved(
          [
            `Round each number to the nearest hundred and add. About how much is $${a} + ${b}$?`,
            `把每个数四舍五入到百位，再相加。$${a} + ${b}$ 大约是多少？`,
          ],
          answer,
          [
            [
              ["Round each number", "四舍五入每个数"],
              [`${a} is about ${round(a)}, and ${b} is about ${round(b)}.`, `${a} 约等于 ${round(a)}，${b} 约等于 ${round(b)}。`],
            ],
            [["Add", "相加"], ["The estimate:", "估算："], [`${round(a)} + ${round(b)} = ${answer}`]],
          ],
          [`The exact sum is ${a + b}, which is close to ${answer}.`, `准确的和是 ${a + b}，和 ${answer} 很接近。`],
          [
            [a + b, "That is the exact sum. Round each number first.", "这是准确的和。要先把每个数四舍五入。"],
            [answer + 100, "That is 100 too many. Check how each number rounds.", "多了 100。看看每个数是怎样四舍五入的。"],
            [answer - 100, "That is 100 too few. Check how each number rounds.", "少了 100。看看每个数是怎样四舍五入的。"],
          ],
          hopsFigure([round(a), answer], true),
        );
      },
      captioned(
        hopsFigure([400, 800]),
        "From 400, a jump of 400 lands at 800, the estimate of 389 + 412.",
        "从 400 跳 400 到 800，这是 389 + 412 的估算。",
      ),
    ),
    earlyPoint(
      "estimating-a-difference",
      ["Estimating a difference", "估算差"],
      [
        "About how much is $73 - 28$? Round to the nearest ten: 73 is about 70 and 28 is about 30. Then $70 - 30 = 40$.\n\nCheck: the exact difference is 45, close to 40.\n\n> **Watch out.** Subtract the rounded numbers. Adding them, $70 + 30 = 100$, is not a difference.",
        "$73 - 28$ 大约是多少？四舍五入到十位：73 约等于 70，28 约等于 30。再算 $70 - 30 = 40$。\n\n检验：准确的差是 45，和 40 很接近。\n\n> **注意。** 要把四舍五入后的数相减。相加 $70 + 30 = 100$ 求的不是差。",
      ],
      (rng) => {
        const a = rng.int(410, 980);
        const b = rng.int(110, 340);
        const place = rng.bool() ? 100 : 10;
        const round = (v: number) => Math.round(v / place) * place;
        const answer = round(a) - round(b);
        return solved(
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
          [
            [
              ["Round each number", "四舍五入每个数"],
              [`${a} is about ${round(a)}, and ${b} is about ${round(b)}.`, `${a} 约等于 ${round(a)}，${b} 约等于 ${round(b)}。`],
            ],
            [["Subtract", "相减"], ["The estimate:", "估算："], [`${round(a)} - ${round(b)} = ${answer}`]],
          ],
          [`The exact difference is ${a - b}, which is close to ${answer}.`, `准确的差是 ${a - b}，和 ${answer} 很接近。`],
          [
            [a - b, "That is the exact difference. Round each number first.", "这是准确的差。要先把每个数四舍五入。"],
            [answer + place, `That is ${place} too many. Check how each number rounds.`, `多了 ${place}。看看每个数是怎样四舍五入的。`],
            [answer - place, `That is ${place} too few. Check how each number rounds.`, `少了 ${place}。看看每个数是怎样四舍五入的。`],
            [round(a) + round(b), "That adds the rounded numbers. Subtract them.", "这是把四舍五入后的数相加了。要相减。"],
          ],
          hopsFigure([round(b), round(a)], false, 0),
        );
      },
      captioned(
        hopsFigure([30, 70]),
        "From 30 to 70 is a jump of 40, the estimate of 73 − 28.",
        "从 30 到 70 跳了 40，这是 73 − 28 的估算。",
      ),
    ),
    earlyPoint(
      "judging-an-answer",
      ["Judging an answer", "判断答案"],
      [
        "Ben says $296 + 405 = 901$. Estimate: $300 + 400 = 700$. 901 is about 200 away from 700, so Ben's answer is not reasonable. The real sum is 701.\n\nCheck: $701 - 405 = 296$.\n\n> **Watch out.** An answer hundreds away from the estimate is wrong. Look again at the hundreds digits.",
        "Ben 说 $296 + 405 = 901$。估算：$300 + 400 = 700$。901 比 700 多了大约 200，所以 Ben 的答案不合理。真正的和是 701。\n\n检验：$701 - 405 = 296$。\n\n> **注意。** 离估算差几百的答案一定是错的。再看一看百位上的数。",
      ],
      (rng) => {
        const a = rng.int(205, 495);
        const b = rng.int(205, 495);
        const sum = a + b;
        const name = rng.pick(earlyNames);
        const near = sum + rng.pick([-2, 0, 0, 1]);
        const ra = Math.round(a / 100) * 100;
        const rb = Math.round(b / 100) * 100;
        const estimate = ra + rb;
        const n = (v: number): Pair => [`${v}`, `${v}`];
        return picked(
          rng,
          [`${name} worked out $${a} + ${b}$. Which answer is reasonable?`, `${name} 算了 $${a} + ${b}$。哪个答案是合理的？`],
          n(near),
          [
            [n(sum + 200), `That is about 200 more than the estimate ${estimate}.`, `这比估算 ${estimate} 多了大约 200。`],
            [n(sum - 200), `That is about 200 less than the estimate ${estimate}.`, `这比估算 ${estimate} 少了大约 200。`],
            [n(sum + 400), `That is about 400 more than the estimate ${estimate}.`, `这比估算 ${estimate} 多了大约 400。`],
          ],
          [
            [
              ["Estimate", "估算"],
              [`${a} is about ${ra} and ${b} is about ${rb}:`, `${a} 约等于 ${ra}，${b} 约等于 ${rb}：`],
              [`${ra} + ${rb} = ${estimate}`],
            ],
            [
              ["Compare", "比较"],
              [`Only ${near} is close to ${estimate}.`, `只有 ${near} 接近 ${estimate}。`],
            ],
          ],
          [`The exact sum is ${sum}, close to ${near}.`, `准确的和是 ${sum}，和 ${near} 很接近。`],
          hopsFigure([ra, estimate]),
        );
      },
      captioned(
        hopsFigure([300, 700]),
        "From 300, a jump of 400 lands at 700, the estimate of 296 + 405.",
        "从 300 跳 400 到 700，这是 296 + 405 的估算。",
      ),
    ),
  ],
  [
    "Eva adds $312 + 289$ and gets 501. She estimates: $300 + 300 = 600$. 501 is far from 600, so she adds again and finds 601.\n\nCheck: $601 - 289 = 312$.\n\nIn this lesson we round to estimate sums and differences, and use the estimate to judge an answer.",
    "Eva 算 $312 + 289$，得到 501。她估算：$300 + 300 = 600$。501 离 600 太远，于是她重新算，得到 601。\n\n检验：$601 - 289 = 312$。\n\n本课我们用四舍五入估算和与差，并用估算判断答案是否合理。",
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
        "$503 - 198$ is hard. Add 2 to both numbers: $505 - 200$. Both moved up by 2, so they are still the same distance apart. $505 - 200 = 305$.\n\nCheck: $305 + 198 = 503$.\n\n> **Watch out.** Change both numbers the same way. Adding 2 to one and taking 2 from the other changes the difference.",
        "$503 - 198$ 不好算。两个数都加 2：$505 - 200$。两个数都增加了 2，它们之间的距离没变。$505 - 200 = 305$。\n\n检验：$305 + 198 = 503$。\n\n> **注意。** 两个数要同样地变。一个加 2、另一个减 2，差就变了。",
      ],
      (rng) => {
        const gap = rng.int(1, 4);
        const b = 100 * rng.int(1, 4) - gap;
        const a = rng.int(b + 40, 900);
        return solved(
          [`What number goes in the box? $${a} - ${b} = \\square - ${b + gap}$`, `方框里填几？$${a} - ${b} = \\square - ${b + gap}$`],
          a + gap,
          [
            [
              ["See the change", "看变化"],
              [`${b} went up by ${gap} to ${b + gap}.`, `${b} 增加了 ${gap}，变成 ${b + gap}。`],
            ],
            [
              ["Move the other the same way", "另一个数同样地变"],
              [`${a} must go up by ${gap} too:`, `${a} 也要增加 ${gap}：`],
              [`${a} + ${gap} = ${a + gap}`],
            ],
          ],
          [
            `$${a} - ${b} = ${a - b}$ and $${a + gap} - ${b + gap} = ${a - b}$.`,
            `$${a} - ${b} = ${a - b}$，$${a + gap} - ${b + gap} = ${a - b}$。`,
          ],
          [
            [
              a - gap,
              `That takes ${gap} away, but ${b} went up. Both must move the same way.`,
              `这是减了 ${gap}，可是 ${b} 是增加的。两个数要同样地变。`,
            ],
            [
              a,
              `That keeps ${a}, but ${b} went up by ${gap}, so the difference would shrink.`,
              `这里 ${a} 没变，可是 ${b} 增加了 ${gap}，差就变小了。`,
            ],
            [a - b, "That is the difference, not the number in the box.", "这是差，不是方框里的数。"],
          ],
          hopsFigure([b, b + gap]),
        );
      },
      captioned(
        hopsFigure([198, 200]),
        "198 moves up 2 to 200, so 503 moves up 2 to 505 as well.",
        "198 增加 2 变成 200，所以 503 也增加 2 变成 505。",
      ),
    ),
    earlyPoint(
      "subtracting-a-near-hundred",
      ["Subtracting a near hundred", "减去接近整百的数"],
      [
        "To find $645 - 298$, subtract 300: $645 - 300 = 345$. That took away 2 too many, so add 2 back: $345 + 2 = 347$.\n\nCheck: $347 + 298 = 645$.\n\n> **Watch out.** Add the 2 back. Taking it away again gives 343, which is 4 too small.",
        "求 $645 - 298$，先减 300：$645 - 300 = 345$。多减了 2，所以再加回 2：$345 + 2 = 347$。\n\n检验：$347 + 298 = 645$。\n\n> **注意。** 要把 2 加回来。再减 2 得 343，少了 4。",
      ],
      (rng) => {
        const gap = rng.int(1, 4);
        const hundreds = rng.int(1, 5);
        const round = 100 * hundreds;
        const b = round - gap;
        const a = rng.int(round + 11, 980);
        const answer = a - b;
        return solved(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [
            [
              ["Subtract the hundred", "先减整百"],
              [`${b} is ${gap} less than ${round}:`, `${b} 比 ${round} 少 ${gap}：`],
              [`${a} - ${round} = ${a - round}`],
            ],
            [["Add back", "再加回来"], [`That took away ${gap} too many:`, `多减了 ${gap}：`], [`${a - round} + ${gap} = ${answer}`]],
          ],
          [`$${answer} + ${b} = ${a}$.`, `$${answer} + ${b} = ${a}$。`],
          [
            [answer - 2 * gap, `That takes ${gap} away again instead of adding it back.`, `这是又减了 ${gap}，应该加回来。`],
            [a - round, `That forgets to add back the ${gap}.`, `这忘了把 ${gap} 加回来。`],
            [answer + 10, "That is 10 too many. Check the tens.", "多了 10。再看看十位。"],
          ],
          hopsFigure([a - round, answer], true),
        );
      },
      captioned(
        hopsFigure([345, 347]),
        "After 645 − 300 = 345, a jump of 2 back up lands at 347.",
        "645 − 300 = 345 之后，再往回跳 2 到 347。",
      ),
    ),
    earlyPoint(
      "grouping-to-make-hundreds",
      ["Grouping to make hundreds", "凑成整百"],
      [
        "In $125 + 67 + 75$, look for a pair that makes a round number: $125 + 75 = 200$. Then $200 + 67 = 267$.\n\nCheck: from left to right, $125 + 67 = 192$ and $192 + 75 = 267$.\n\n> **Watch out.** Keep the third number. 200 is only the pair; add the 67 too.",
        "在 $125 + 67 + 75$ 中，找能凑成整数的两个数：$125 + 75 = 200$。再算 $200 + 67 = 267$。\n\n检验：从左往右算，$125 + 67 = 192$，$192 + 75 = 267$。\n\n> **注意。** 别忘了第三个数。200 只是那两个数的和，还要加上 67。",
      ],
      (rng) => {
        const a = 5 * rng.int(5, 39);
        const pairTotal = 100 * Math.ceil((a + 5) / 100);
        const c = pairTotal - a;
        const b = rng.int(11, 99);
        const [x, y, z] = rng.bool() ? [a, b, c] : [c, b, a];
        return solved(
          [`What is $${x} + ${y} + ${z}$?`, `$${x} + ${y} + ${z}$ 等于多少？`],
          a + b + c,
          [
            [
              ["Find the pair", "找出能凑整的两个数"],
              [`${x} and ${z} make a round number:`, `${x} 和 ${z} 能凑成整百：`],
              [`${x} + ${z} = ${pairTotal}`],
            ],
            [["Add the third", "加上第三个数"], ["Then:", "然后："], [`${pairTotal} + ${b} = ${pairTotal + b}`]],
          ],
          [
            `From left to right: $${x} + ${y} = ${x + y}$ and $${x + y} + ${z} = ${a + b + c}$.`,
            `从左往右算：$${x} + ${y} = ${x + y}$，$${x + y} + ${z} = ${a + b + c}$。`,
          ],
          [
            [pairTotal, `That is only the pair. Add the ${b} too.`, `这只是两个数的和，还要加上 ${b}。`],
            [a + b, `That leaves out ${c}.`, `这漏掉了 ${c}。`],
            [c + b, `That leaves out ${a}.`, `这漏掉了 ${a}。`],
            [a + b + c + 100, "That is 100 too many. Check the hundreds.", "多了 100。再看看百位。"],
          ],
          partWholeBarFigure([a, c, b], -1),
        );
      },
      captioned(
        partWholeBarFigure([125, 75, 67], -1),
        "A bar of 125, 75 and 67: the first two make 200.",
        "条形分成 125、75 和 67：前两个合起来是 200。",
      ),
    ),
  ],
  [
    "Raj needs $399 + 245$. He thinks of 399 as 400 less 1: $400 + 245 = 645$, then takes 1 away to get 644.\n\nCheck: $644 - 245 = 399$.\n\nIn this lesson we make friendly numbers to add and subtract in our heads.",
    "Raj 要算 $399 + 245$。他把 399 想成 400 少 1：$400 + 245 = 645$，再减去 1，得 644。\n\n检验：$644 - 245 = 399$。\n\n本课我们凑成好算的数，来心算加减法。",
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
          "The space from 0 to 1 is cut into 4 equal spaces. Each space is one fourth, so the first mark after 0 is $\\frac{1}{4}$.\n\nCheck: 4 jumps of $\\frac{1}{4}$ reach 1.\n\n> **Watch out.** Count the spaces, not the marks. There are 5 marks, but $\\frac{1}{5}$ is wrong.",
          "从 0 到 1 平均分成 4 格。每格是四分之一，所以 0 后面的第一个刻度是 $\\frac{1}{4}$。\n\n检验：跳 4 次 $\\frac{1}{4}$ 正好到 1。\n\n> **注意。** 要数格子，不是数刻度。有 5 个刻度，但 $\\frac{1}{5}$ 是错的。",
        ],
        (rng) => {
          const d = rng.pick([2, 3, 4, 6, 8]);
          const wholes = rng.int(1, 3);
          return pickedMath(
            rng,
            rng.pick<Pair>([
              ["What fraction does the dot show?", "这个点表示什么分数？"],
              ["Which fraction is at the dot?", "点所在的位置是哪个分数？"],
            ]),
            fr(1, d),
            [
              [
                fr(1, d + 1),
                `That counts the ${d + 1} marks from 0 to 1. Count the ${d} spaces.`,
                `这是数了 0 到 1 的 ${d + 1} 个刻度。要数 ${d} 个格子。`,
              ],
              [fr(d, 1), "That turns the fraction upside down.", "这把分子和分母弄反了。"],
              wholes > 1
                ? [
                    fr(1, wholes * d),
                    `That counts the spaces from 0 to ${wholes}. The whole is from 0 to 1.`,
                    `这是数了 0 到 ${wholes} 的格子。整体是从 0 到 1。`,
                  ]
                : [fr(2, d), "That is 2 spaces from 0, but the dot is 1 space from 0.", "这是离 0 两格，可是这个点离 0 只有一格。"],
            ],
            [
              [
                ["Count the spaces", "数格子"],
                [
                  `From 0 to 1 there are ${d} equal spaces, so each is $${fr(1, d)}$.`,
                  `从 0 到 1 平均分成 ${d} 格，每格是 $${fr(1, d)}$。`,
                ],
              ],
              [
                ["Find the dot", "找到点"],
                [`The dot is 1 space from 0, so it shows $${fr(1, d)}$.`, `这个点离 0 有 1 格，所以表示 $${fr(1, d)}$。`],
              ],
            ],
            [`${d} jumps of $${fr(1, d)}$ reach 1.`, `跳 ${d} 次 $${fr(1, d)}$ 正好到 1。`],
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
        "Each jump of $\\frac{1}{3}$ is one space on a line cut into thirds. From 0 it takes 3 jumps to reach 1, and 6 jumps to reach 2.\n\nCheck: $\\frac{3}{3} = 1$ and $\\frac{6}{3} = 2$.\n\n> **Watch out.** Count jumps, not marks. Counting the mark at 0 gives one too many.",
        "在分成三份的数轴上，每跳一次 $\\frac{1}{3}$ 就是一格。从 0 开始，跳 3 次到 1，跳 6 次到 2。\n\n检验：$\\frac{3}{3} = 1$，$\\frac{6}{3} = 2$。\n\n> **注意。** 要数跳了几次，不是数刻度。把 0 处的刻度也数上，就多了一个。",
      ],
      (rng) => {
        const d = rng.pick([2, 3, 4, 6, 8]);
        const wholes = rng.int(1, 6);
        const total = d * wholes;
        return solved(
          [
            `Starting at 0, how many jumps of $${fr(1, d)}$ does it take to reach ${wholes}?`,
            `从 0 开始，每次跳 $${fr(1, d)}$，跳多少次才能到 ${wholes}？`,
          ],
          total,
          [
            [
              ["One whole", "一个整体"],
              [`It takes ${d} jumps of $${fr(1, d)}$ to reach 1.`, `跳 ${d} 次 $${fr(1, d)}$ 到 1。`],
            ],
            [
              ["All the wholes", "所有的整体"],
              [`${wholes} ${wholes === 1 ? "whole needs" : "wholes need"}:`, `${wholes} 个整体需要：`],
              [`${times(wholes, d)} = ${total}`],
            ],
          ],
          [`$${fr(total, d)} = ${wholes}$.`, `$${fr(total, d)} = ${wholes}$。`],
          [
            [d + 1, "That counts the marks from 0 to 1, including 0.", "这是数了 0 到 1 的刻度，把 0 也数进去了。"],
            [total + d, "That is one whole too far.", "这多跳了一个整体。"],
            [total + 1, "That counts the mark at 0 as a jump.", "这把 0 处的刻度也当成了一次跳。"],
          ],
          wholes <= 3 ? fractionLineFigure(wholes, d) : undefined,
        );
      },
      captioned(
        fractionLineFigure(2, 3),
        "A line from 0 to 2 cut into thirds: 3 jumps reach 1 and 6 jumps reach 2.",
        "从 0 到 2 的数轴，每个整体分成三份：跳 3 次到 1，跳 6 次到 2。",
      ),
    ),
    earlyPoint(
      "closest-to-zero",
      ["Closest to zero", "离 0 最近"],
      [
        "Which is closer to 0, $\\frac{1}{8}$ or $\\frac{1}{3}$? Cutting the whole into 8 parts makes smaller parts than cutting it into 3. So $\\frac{1}{8}$ is closer to 0.\n\nCheck: on the two lines, the first mark after 0 is nearer to 0 on the line cut into eighths.\n\n> **Watch out.** A bigger bottom number means a smaller part. 8 is bigger than 3, but $\\frac{1}{8}$ is smaller than $\\frac{1}{3}$.",
        "$\\frac{1}{8}$ 和 $\\frac{1}{3}$ 哪个离 0 更近？把整体分成 8 份，每份比分成 3 份时小。所以 $\\frac{1}{8}$ 离 0 更近。\n\n检验：在两条数轴上，分成八份的那条，0 后面第一个刻度离 0 更近。\n\n> **注意。** 分母越大，每份越小。8 比 3 大，但 $\\frac{1}{8}$ 比 $\\frac{1}{3}$ 小。",
      ],
      (rng) => {
        const closest = rng.bool();
        const place = closest ? 0 : 1;
        const rule: Walk = [
          ["Compare the parts", "比较每份大小"],
          [
            `The ${closest ? "larger" : "smaller"} the bottom number, the ${closest ? "smaller" : "larger"} each part.`,
            `分母越${closest ? "大" : "小"}，每份就越${closest ? "小" : "大"}。`,
          ],
        ];
        if (rng.bool()) {
          const ds = rng.sample([2, 3, 4, 6, 8], 4);
          const target = closest ? Math.max(...ds) : Math.min(...ds);
          const next = closest ? Math.max(...ds.filter((d) => d !== target)) : Math.min(...ds.filter((d) => d !== target));
          return pickedMath(
            rng,
            closest
              ? ["Which fraction is closest to 0 on the number line?", "在数轴上，哪个分数离 0 最近？"]
              : ["Which fraction is closest to 1 on the number line?", "在数轴上，哪个分数离 1 最近？"],
            fr(1, target),
            ds
              .filter((d) => d !== target)
              .map((d) =>
                closest
                  ? [
                      fr(1, d),
                      `${d} parts are bigger than ${target} parts, so $${fr(1, d)}$ is farther from 0.`,
                      `分成 ${d} 份比分成 ${target} 份每份大，所以 $${fr(1, d)}$ 离 0 更远。`,
                    ]
                  : [
                      fr(1, d),
                      `${d} parts are smaller than ${target} parts, so $${fr(1, d)}$ is farther from 1.`,
                      `分成 ${d} 份比分成 ${target} 份每份小，所以 $${fr(1, d)}$ 离 1 更远。`,
                    ],
              ),
            [
              rule,
              [
                ["Choose", "选出"],
                [
                  `$${fr(1, target)}$ is the ${closest ? "smallest" : "largest"} part, so it is closest to ${place}.`,
                  `$${fr(1, target)}$ 的一份最${closest ? "小" : "大"}，所以离 ${place} 最近。`,
                ],
              ],
            ],
            [
              `On a line cut into ${target} parts and a line cut into ${next} parts, the first mark after 0 is ${closest ? "nearer to 0" : "nearer to 1"} on the line of ${target}.`,
              `分成 ${target} 份和分成 ${next} 份的两条数轴上，0 后面第一个刻度在 ${target} 份的那条上离 ${place} 更近。`,
            ],
            twoFractionLinesFigure(target, 1, next, 1),
          );
        }
        const [a, b] = rng.sample([2, 3, 4, 6, 8], 2) as [number, number];
        const target = closest ? Math.max(a, b) : Math.min(a, b);
        const other = target === a ? b : a;
        return picked(
          rng,
          [
            `On the number line, which is closer to ${place}: $${fr(1, a)}$ or $${fr(1, b)}$?`,
            `在数轴上，$${fr(1, a)}$ 和 $${fr(1, b)}$ 哪个离 ${place} 更近？`,
          ],
          [`$${fr(1, target)}$`, `$${fr(1, target)}$`],
          [
            [
              [`$${fr(1, other)}$`, `$${fr(1, other)}$`],
              closest
                ? `${other} parts are bigger than ${target} parts, so $${fr(1, other)}$ is farther from 0.`
                : `${other} parts are smaller than ${target} parts, so $${fr(1, other)}$ is farther from 1.`,
              closest
                ? `分成 ${other} 份每份更大，所以 $${fr(1, other)}$ 离 0 更远。`
                : `分成 ${other} 份每份更小，所以 $${fr(1, other)}$ 离 1 更远。`,
            ],
            [
              ["They are the same distance away", "一样近"],
              "The bottom numbers differ, so the parts are different sizes.",
              "两个分母不同，每份的大小也不同。",
            ],
          ],
          [
            rule,
            [
              ["Choose", "选出"],
              [`$${fr(1, target)}$ is closer to ${place}.`, `$${fr(1, target)}$ 离 ${place} 更近。`],
            ],
          ],
          [
            `On the two lines, the first mark after 0 is ${closest ? "nearer to 0" : "nearer to 1"} on the line cut into ${target} parts.`,
            `在两条数轴上，分成 ${target} 份的那条，0 后面第一个刻度离 ${place} 更近。`,
          ],
          twoFractionLinesFigure(a, 1, b, 1),
        );
      },
      captioned(
        twoFractionLinesFigure(3, 1, 8, 1),
        "Two lines from 0 to 1: one third is farther from 0 than one eighth.",
        "两条从 0 到 1 的数轴：三分之一比八分之一离 0 远。",
      ),
    ),
  ],
  [
    "A path from the house to the gate is 1 mile. Posts cut it into 4 equal parts. The first post is $\\frac{1}{4}$ mile from the house.\n\nCheck: 4 parts of $\\frac{1}{4}$ mile make the whole mile.\n\nIn this lesson we cut the space from 0 to 1 into equal parts to place unit fractions.",
    "从家到大门的小路长 1 英里。几根柱子把它平均分成 4 段。第一根柱子离家 $\\frac{1}{4}$ 英里。\n\n检验：4 段 $\\frac{1}{4}$ 英里合起来是 1 英里。\n\n本课我们把 0 到 1 之间平均分，在数轴上找到单位分数。",
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
        "On a line cut into fourths, keep counting spaces past 1: $\\frac{4}{4}$ is at 1, and the next mark is $\\frac{5}{4}$.\n\nCheck: $\\frac{5}{4}$ is 1 whole and $\\frac{1}{4}$ more.\n\n> **Watch out.** The bottom number stays 4, because every space is still a fourth. Do not count all the spaces on the line as the bottom.",
        "在分成四份的数轴上，过了 1 继续数格子：$\\frac{4}{4}$ 在 1，下一个刻度是 $\\frac{5}{4}$。\n\n检验：$\\frac{5}{4}$ 是 1 个整体再多 $\\frac{1}{4}$。\n\n> **注意。** 分母还是 4，因为每格还是四分之一。不要把整条线上所有的格子数当成分母。",
      ],
      (rng) => {
        const d = rng.pick([2, 3, 4, 6, 8]);
        const wholes = rng.int(2, 3);
        let n = rng.int(d + 1, d * wholes - 1);
        if (n % d === 0) n += 1;
        return pickedMath(
          rng,
          ["What fraction does the dot show?", "这个点表示什么分数？"],
          fr(n, d),
          rng.sample<MathWrong>(
            [
              [fr(d, n), "That turns the fraction upside down.", "这把分子和分母弄反了。"],
              [
                fr(n, d * wholes),
                `That uses all ${d * wholes} spaces as the bottom. Each whole has ${d} spaces.`,
                `这把全部 ${d * wholes} 格当成了分母。每个整体只有 ${d} 格。`,
              ],
              [fr(n + 1, d), "That counts marks, including the one at 0. Count spaces.", "这是数刻度，把 0 也数进去了。要数格子。"],
              [fr(n - d, d), "That starts counting at 1 instead of 0.", "这是从 1 开始数的，应该从 0 开始。"],
            ],
            3,
          ),
          [
            [
              ["Find the bottom", "找分母"],
              [`Each whole has ${d} equal spaces, so each space is $${fr(1, d)}$.`, `每个整体平均分成 ${d} 格，每格是 $${fr(1, d)}$。`],
            ],
            [
              ["Count from 0", "从 0 数"],
              [`The dot is ${n} spaces from 0, so it shows $${fr(n, d)}$.`, `这个点离 0 有 ${n} 格，所以表示 $${fr(n, d)}$。`],
            ],
          ],
          [
            `$${fr(n, d)}$ is ${Math.floor(n / d)} ${Math.floor(n / d) === 1 ? "whole" : "wholes"} and $${fr(n % d, d)}$ more, just where the dot is.`,
            `$${fr(n, d)}$ 是 ${Math.floor(n / d)} 个整体再多 $${fr(n % d, d)}$，正是点的位置。`,
          ],
          fractionLineFigure(wholes, d, n),
        );
      },
      captioned(
        fractionLineFigure(2, 4, 5),
        "A line from 0 to 2 cut into fourths, with a dot at five fourths, one space past 1.",
        "从 0 到 2 的数轴，每个整体分成四份，点在 1 后面一格，是四分之五。",
      ),
    ),
    earlyPoint(
      "fractions-at-whole-numbers",
      ["Fractions at whole numbers", "在整数位置上的分数"],
      [
        "On a line cut into thirds, $\\frac{6}{3}$ is 6 spaces from 0. Each whole has 3 spaces, and 6 spaces are 2 groups of 3, so $\\frac{6}{3}$ sits at 2.\n\nCheck: $6 \\div 3 = 2$.\n\n> **Watch out.** The answer is not the top number 6. Count how many wholes the 6 spaces cover.",
        "在分成三份的数轴上，$\\frac{6}{3}$ 离 0 有 6 格。每个整体有 3 格，6 格是 2 个 3 格，所以 $\\frac{6}{3}$ 在 2 的位置。\n\n检验：$6 \\div 3 = 2$。\n\n> **注意。** 答案不是分子 6。要看这 6 格占了几个整体。",
      ],
      (rng) => {
        const d = rng.pick([2, 3, 4, 6]);
        const w = rng.int(1, 4);
        const wholes = rng.int(w, 4);
        return solved(
          [`Look at this number line. What whole number is equal to $${fr(d * w, d)}$?`, `看这条数轴。$${fr(d * w, d)}$ 等于哪个整数？`],
          w,
          [
            [
              ["Count spaces", "数格子"],
              [
                `$${fr(d * w, d)}$ is ${d * w} spaces from 0, and each whole has ${d} spaces.`,
                `$${fr(d * w, d)}$ 离 0 有 ${d * w} 格，每个整体有 ${d} 格。`,
              ],
            ],
            [["Find the wholes", "找出几个整体"], ["Groups of the bottom number:", "里面有几个分母："], [`${div(d * w, d)} = ${w}`]],
          ],
          [
            `${w} ${w === 1 ? "whole" : "wholes"} of ${d} spaces make $${times(w, d)} = ${d * w}$ spaces.`,
            `${w} 个整体，每个 ${d} 格，一共 $${times(w, d)} = ${d * w}$ 格。`,
          ],
          [
            [d, "That is the bottom number, the spaces in one whole.", "这是分母，是一个整体里的格数。"],
            [d * w, "That is the top number, the spaces from 0.", "这是分子，是离 0 的格数。"],
            [w + 1, "That is one whole too far.", "多了一个整体。"],
          ],
          fractionLineFigure(Math.max(wholes, 2), d),
        );
      },
      captioned(
        fractionLineFigure(3, 3, 6),
        "A line from 0 to 3 cut into thirds, with a dot at six thirds, which is at 2.",
        "从 0 到 3 的数轴，每个整体分成三份，点在三分之六，也就是 2 的位置。",
      ),
    ),
    earlyPoint(
      "whole-numbers-as-fractions",
      ["Whole numbers as fractions", "把整数写成分数"],
      [
        "3 wholes, each cut into 4 equal parts, make $3 \\times 4 = 12$ parts. So $3 = \\frac{12}{4}$.\n\nCheck: $12 \\div 4 = 3$.\n\n> **Watch out.** Multiply, do not add. $3 + 4 = 7$, and $\\frac{7}{4}$ is less than 2.",
        "3 个整体，每个平均分成 4 份，一共是 $3 \\times 4 = 12$ 份。所以 $3 = \\frac{12}{4}$。\n\n检验：$12 \\div 4 = 3$。\n\n> **注意。** 要相乘，不是相加。$3 + 4 = 7$，而 $\\frac{7}{4}$ 比 2 还小。",
      ],
      (rng) => {
        const w = rng.int(2, 8);
        const d = rng.pick([1, 2, 3, 4, 6, 8]);
        return solved(
          [`What number goes in the box? $${w} = ${fr("\\square", d)}$`, `方框里填几？$${w} = ${fr("\\square", d)}$`],
          w * d,
          [
            [
              ["See the parts", "看出份数"],
              [`Each whole has ${d} ${d === 1 ? "part" : "equal parts"}.`, `每个整体有 ${d} 份。`],
            ],
            [["Multiply", "相乘"], [`${w} wholes have:`, `${w} 个整体一共：`], [`${times(w, d)} = ${w * d}`]],
          ],
          [`$${div(w * d, d)} = ${w}$.`, `$${div(w * d, d)} = ${w}$。`],
          [
            [w + d, "That adds the whole number and the bottom number. Multiply them.", "这是把整数和分母相加。要相乘。"],
            [w * d + 1, "That is one part too many.", "多了一份。"],
            [
              d === 1 ? w + 2 : w,
              d === 1 ? "That is 2 parts too many." : "That is the whole number. The top counts the parts.",
              d === 1 ? "多了 2 份。" : "这是整数本身。分子是份数。",
            ],
          ],
          partWholeBarFigure(
            Array.from({ length: w }, () => d),
            -1,
          ),
        );
      },
      captioned(partWholeBarFigure([4, 4, 4], -1), "3 wholes with 4 parts each make 12 parts.", "3 个整体，每个 4 份，一共 12 份。"),
    ),
  ],
  [
    "Amy runs around a track cut into 4 equal parts. After 4 parts she has run 1 lap. She keeps going: 5 parts is $\\frac{5}{4}$ laps.\n\nCheck: $\\frac{5}{4}$ is 1 lap and $\\frac{1}{4}$ lap more.\n\nIn this lesson we keep counting past 1 to name fractions greater than one, and write whole numbers as fractions.",
    "一条跑道平均分成 4 段。Amy 跑完 4 段就是 1 圈。她接着跑：5 段是 $\\frac{5}{4}$ 圈。\n\n检验：$\\frac{5}{4}$ 是 1 圈再多 $\\frac{1}{4}$ 圈。\n\n本课我们过了 1 继续数格子，读出大于 1 的分数，并把整数写成分数。",
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
          "The top line is cut into thirds and the bottom line into sixths. The dot at $\\frac{2}{3}$ is straight above the mark 4 spaces along the bottom line. So $\\frac{2}{3} = \\frac{4}{6}$.\n\nCheck: each third is 2 sixths, so 2 thirds are 4 sixths.\n\n> **Watch out.** Count spaces on the bottom line from 0. Keeping the top number 2 gives $\\frac{2}{6}$, which is too small.",
          "上面的数轴分成三份，下面的分成六份。$\\frac{2}{3}$ 处的点正对着下面数轴的第 4 格。所以 $\\frac{2}{3} = \\frac{4}{6}$。\n\n检验：一个三分之一是 2 个六分之一，2 个三分之一就是 4 个六分之一。\n\n> **注意。** 要从 0 开始数下面数轴的格子。分子还写 2，得 $\\frac{2}{6}$，就太小了。",
        ],
        (rng) => {
          const { n, d, m, e } = pickEqualPair(rng);
          return pickedMath(
            rng,
            [
              `The top dot shows $${fr(n, d)}$. What fraction on the bottom line is equal to it?`,
              `上面的点表示 $${fr(n, d)}$。下面数轴上哪个分数和它相等？`,
            ],
            fr(m, e),
            rng.sample<MathWrong>(
              [
                [
                  fr(n, e),
                  `That keeps the top number ${n}. On the bottom line the dot is ${m} spaces from 0.`,
                  `这里分子还是 ${n}。在下面的数轴上，点离 0 有 ${m} 格。`,
                ],
                [
                  fr(m, d),
                  `That uses the top line's ${d} spaces as the bottom. The bottom line has ${e}.`,
                  `这把上面数轴的 ${d} 格当成了分母。下面的数轴有 ${e} 格。`,
                ],
                [fr(m + 1, e), "That counts one space too many.", "多数了一格。"],
                [
                  fr(m === 1 ? 3 : m - 1, e),
                  m === 1 ? "That counts too many spaces." : "That counts one space too few.",
                  m === 1 ? "多数了格子。" : "少数了一格。",
                ],
              ],
              3,
            ),
            [
              [
                ["Follow the dot down", "顺着点往下看"],
                [
                  `The dot is straight above a mark on the bottom line, which has ${e} spaces.`,
                  `这个点正对着下面数轴的一个刻度，下面的数轴有 ${e} 格。`,
                ],
              ],
              [
                ["Count from 0", "从 0 数"],
                [
                  `That mark is ${m} ${m === 1 ? "space" : "spaces"} from 0, so it is $${fr(m, e)}$.`,
                  `这个刻度离 0 有 ${m} 格，所以是 $${fr(m, e)}$。`,
                ],
              ],
            ],
            [
              `Each $${fr(1, Math.min(d, e))}$ is ${Math.max(d, e) / Math.min(d, e)} spaces of $${fr(1, Math.max(d, e))}$, so $${fr(n, d)} = ${fr(m, e)}$.`,
              `每个 $${fr(1, Math.min(d, e))}$ 是 ${Math.max(d, e) / Math.min(d, e)} 个 $${fr(1, Math.max(d, e))}$，所以 $${fr(n, d)} = ${fr(m, e)}$。`,
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
        "The top line has 2 spaces and the bottom line has 4. The dot at $\\frac{1}{2}$ is straight above a mark on the bottom line. Count from 0 along the bottom: that mark is 2 spaces from 0.\n\nCheck: $\\frac{2}{4} = \\frac{1}{2}$, both halfway to 1.\n\n> **Watch out.** Count spaces, not marks. Counting the mark at 0 gives 3.",
        "上面的数轴有 2 格，下面的有 4 格。$\\frac{1}{2}$ 处的点正对着下面数轴的一个刻度。在下面的数轴上从 0 开始数：这个刻度离 0 有 2 格。\n\n检验：$\\frac{2}{4} = \\frac{1}{2}$，都在 0 到 1 的正中间。\n\n> **注意。** 要数格子，不是数刻度。把 0 处的刻度也数上就得 3。",
      ],
      (rng) => {
        const atOne = rng.bool(0.4);
        const pair = pickEqualPair(rng);
        const { d, e } = pair;
        const n = atOne ? d : pair.n;
        const m = atOne ? e : pair.m;
        return solved(
          [
            "The dot on the top line is exactly above a mark on the bottom line. How many spaces from 0 is that mark?",
            "上面数轴的点正好对着下面数轴的一个刻度。这个刻度离 0 有多少格？",
          ],
          m,
          [
            [
              ["Read the top", "读上面"],
              [`The top dot is $${fr(n, d)}$ of the way from 0 to 1.`, `上面的点在 0 到 1 的 $${fr(n, d)}$ 处。`],
            ],
            [
              ["Count the bottom", "数下面"],
              [
                `Below it, count the spaces of the bottom line from 0: ${m} of the ${e}.`,
                `在它下面，从 0 开始数下面数轴的格子：${e} 格中的 ${m} 格。`,
              ],
            ],
          ],
          [`$${fr(m, e)} = ${fr(n, d)}$.`, `$${fr(m, e)} = ${fr(n, d)}$。`],
          [
            [n, "That counts the spaces on the top line.", "这数的是上面数轴的格子。"],
            [m + 1, "That counts the mark at 0 too. Count spaces.", "这把 0 处的刻度也数上了。要数格子。"],
            [e + 1, "That counts all the marks on the bottom line.", "这数的是下面数轴所有的刻度。"],
            [n + 1, "That counts the marks on the top line.", "这数的是上面数轴的刻度。"],
          ],
          twoFractionLinesFigure(d, n, e, undefined),
        );
      },
      captioned(
        twoFractionLinesFigure(2, 1, 4, 2),
        "Halves on top and fourths below: the dot at one half is above the mark 2 spaces from 0.",
        "上面分成两份，下面分成四份：二分之一处的点正对着下面离 0 两格的刻度。",
      ),
    ),
    earlyPoint(
      "equal-or-not-on-two-lines",
      ["Equal or not on two lines", "两条线上的点相等吗"],
      [
        "Are $\\frac{3}{4}$ and $\\frac{5}{8}$ equal? Mark them on two lines of the same length. The dot at $\\frac{5}{8}$ is left of the dot at $\\frac{3}{4}$, so they are not equal, and $\\frac{3}{4}$ is greater.\n\nCheck: $\\frac{3}{4} = \\frac{6}{8}$, which is more than $\\frac{5}{8}$.\n\n> **Watch out.** Bigger numbers do not mean a bigger fraction. Trust where the dots are.",
        "$\\frac{3}{4}$ 和 $\\frac{5}{8}$ 相等吗？把它们标在两条一样长的数轴上。$\\frac{5}{8}$ 的点在 $\\frac{3}{4}$ 的点左边，所以不相等，$\\frac{3}{4}$ 更大。\n\n检验：$\\frac{3}{4} = \\frac{6}{8}$，比 $\\frac{5}{8}$ 大。\n\n> **注意。** 分数里的数大，不代表分数大。要相信点的位置。",
      ],
      (rng) => {
        const { n, d, m: same, e } = pickEqualPair(rng);
        const shift = rng.pick([0, 0, 1, -1]);
        const m = same + shift <= 0 || same + shift >= e ? same : same + shift;
        const top: Pair = ["The fraction on the top line is greater", "上面的分数更大"];
        const bottom: Pair = ["The fraction on the bottom line is greater", "下面的分数更大"];
        const equal: Pair = ["The two fractions are equal", "两个分数相等"];
        const unsure: Pair = ["They cannot be compared", "无法比较"];
        const where: Pair =
          m === same
            ? ["One dot is straight above the other.", "一个点正好在另一个点的上面。"]
            : [`The ${m > same ? "bottom" : "top"} dot is farther from 0.`, `${m > same ? "下面" : "上面"}的点离 0 更远。`];
        const reasons: readonly Wrong[] = [
          [equal, "The dots do not line up, so the fractions are not equal.", "两个点没有对齐，所以两个分数不相等。"],
          [
            bottom,
            m === same ? "The dots line up, so neither is greater." : "The bottom dot is nearer to 0, so its fraction is smaller.",
            m === same ? "两个点对齐，哪个也不更大。" : "下面的点离 0 更近，它的分数更小。",
          ],
          [
            top,
            m === same ? "The dots line up, so neither is greater." : "The top dot is nearer to 0, so its fraction is smaller.",
            m === same ? "两个点对齐，哪个也不更大。" : "上面的点离 0 更近，它的分数更小。",
          ],
          [
            unsure,
            "Both lines go from 0 to 1 and are the same length, so the dots can be compared.",
            "两条数轴都从 0 到 1，一样长，所以可以比较两个点。",
          ],
        ];
        const rel = m === same ? equal : m > same ? bottom : top;
        return picked(
          rng,
          [
            `The dots show $${fr(n, d)}$ and $${fr(m, e)}$. How do they compare?`,
            `这两个点表示 $${fr(n, d)}$ 和 $${fr(m, e)}$。它们比较起来怎么样？`,
          ],
          rel,
          reasons.filter(([option]) => option !== rel),
          [
            [["Look at the dots", "看两个点"], where],
            [
              ["Decide", "判断"],
              [`So: ${rel[0].toLowerCase()}.`, `所以${rel[1]}。`],
            ],
          ],
          [
            `$${fr(n, d)} = ${fr(same, e)}$, and $${fr(m, e)}$ is ${m === same ? "the same" : m > same ? "more" : "less"}.`,
            `$${fr(n, d)} = ${fr(same, e)}$，$${fr(m, e)}$ ${m === same ? "和它一样" : m > same ? "比它大" : "比它小"}。`,
          ],
          twoFractionLinesFigure(d, n, e, m),
        );
      },
      captioned(
        twoFractionLinesFigure(4, 3, 8, 5),
        "Three fourths on top and five eighths below: the bottom dot is nearer to 0.",
        "上面是四分之三，下面是八分之五：下面的点离 0 更近。",
      ),
    ),
  ],
  [
    "Two ribbons are the same length. Nia cuts one into 2 equal pieces and the other into 4. One piece of the first is as long as two pieces of the second, so $\\frac{1}{2} = \\frac{2}{4}$.\n\nCheck: both reach halfway along the ribbon.\n\nIn this lesson we see that fractions at the same point on two number lines are equal.",
    "两条丝带一样长。Nia 把一条平均剪成 2 段，另一条平均剪成 4 段。第一条的一段和第二条的两段一样长，所以 $\\frac{1}{2} = \\frac{2}{4}$。\n\n检验：两者都到丝带的正中间。\n\n本课我们知道，在两条数轴同一位置上的分数相等。",
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
        "A bar shows $\\frac{1}{3}$. Cut each part into 2 smaller parts. Now there are 6 parts, and the shaded amount is 2 of them. So $\\frac{1}{3} = \\frac{2}{6}$.\n\nCheck: the shaded part has the same length on both bars.\n\n> **Watch out.** The shaded parts double too. $\\frac{1}{6}$ forgets to cut the shaded part.",
        "一个长条表示 $\\frac{1}{3}$。把每一份再分成 2 小份。现在一共 6 份，涂色的是其中 2 份。所以 $\\frac{1}{3} = \\frac{2}{6}$。\n\n检验：两个长条的涂色部分一样长。\n\n> **注意。** 涂色的份数也要变成两倍。$\\frac{1}{6}$ 是忘了把涂色的那份也分开。",
      ],
      (rng) => {
        const { n, d, m, e } = pickEqualPair(rng);
        const left = rng.bool();
        const sentence = left ? `${fr(n, d)} = ${fr("\\square", e)}` : `${fr("\\square", e)} = ${fr(n, d)}`;
        return solved(
          [
            `The two bars are the same size and show equal amounts. What number goes in the box? $${sentence}$`,
            `两个长条一样大，涂色部分也一样多。方框里填几？$${sentence}$`,
          ],
          m,
          [
            [
              ["Look at the second bar", "看第二个长条"],
              [`It is cut into ${e} equal parts.`, `它平均分成 ${e} 份。`],
            ],
            [
              ["Count the shaded parts", "数涂色的份数"],
              [
                `The shaded part covers ${m} of them, the same length as ${n} of the ${d} parts above.`,
                `涂色部分占其中 ${m} 份，和上面 ${d} 份中的 ${n} 份一样长。`,
              ],
            ],
          ],
          [`$${fr(m, e)}$ and $${fr(n, d)}$ reach the same point on the bar.`, `$${fr(m, e)}$ 和 $${fr(n, d)}$ 在长条上到同一个位置。`],
          [
            [
              n,
              "That keeps the old top number. The parts changed size, so the count changes.",
              "这里分子没变。每份的大小变了，份数也要变。",
            ],
            [e, "That is the number of parts in all, not the shaded parts.", "这是总份数，不是涂色的份数。"],
            [m + 1, "That counts one part too many.", "多数了一份。"],
            [
              m === 1 ? 2 : m - 1,
              m === 1 ? "That counts one part too many." : "That counts one part too few.",
              m === 1 ? "多数了一份。" : "少数了一份。",
            ],
          ],
          twoBarsFigure(d, n, e, m),
        );
      },
      captioned(
        twoBarsFigure(3, 1, 6, 2),
        "One third of a bar and two sixths of the same bar cover the same length.",
        "一个长条的三分之一和同样长条的六分之二一样长。",
      ),
    ),
    earlyPoint(
      "finding-the-new-bottom-number",
      ["Finding the new bottom number", "求新的分母"],
      [
        "$\\frac{1}{2} = \\frac{3}{\\square}$. The top went from 1 to 3, so it was multiplied by 3. The bottom must be multiplied by 3 too: $2 \\times 3 = 6$.\n\nCheck: 3 of 6 parts is half the bar, just like 1 of 2 parts.\n\n> **Watch out.** Multiply, do not add. Adding 2 to both gives $\\frac{3}{4}$, which is more than one half.",
        "$\\frac{1}{2} = \\frac{3}{\\square}$。分子从 1 变成 3，是乘了 3。分母也要乘 3：$2 \\times 3 = 6$。\n\n检验：6 份中的 3 份是长条的一半，和 2 份中的 1 份一样。\n\n> **注意。** 要相乘，不是相加。分子分母都加 2 得 $\\frac{3}{4}$，比一半还多。",
      ],
      (rng) => {
        const pair = rng.pick(equalPairs.filter(([a, b, c, f]) => c % a === 0 && f % b === 0));
        const [a, b, c, f] = pair;
        const up = rng.bool();
        const k = c / a;
        const [n, d, m, e] = up ? [a, b, c, f] : [c, f, a, b];
        const left = rng.bool();
        const sentence = left ? `${fr(n, d)} = ${fr(m, "\\square")}` : `${fr(m, "\\square")} = ${fr(n, d)}`;
        return solved(
          [`What number goes in the box? $${sentence}$`, `方框里填几？$${sentence}$`],
          e,
          [
            [
              ["Compare the tops", "比较分子"],
              up
                ? [`The top went from ${n} to ${m}, so it was multiplied by ${k}.`, `分子从 ${n} 变成 ${m}，是乘了 ${k}。`]
                : [`The top went from ${n} to ${m}, so it was divided by ${k}.`, `分子从 ${n} 变成 ${m}，是除以了 ${k}。`],
            ],
            [
              ["Do the same to the bottom", "分母也这样变"],
              ["The bottom:", "分母："],
              [up ? `${times(d, k)} = ${e}` : `${div(d, k)} = ${e}`],
            ],
          ],
          [`$${fr(m, e)}$ and $${fr(n, d)}$ shade the same length of a bar.`, `$${fr(m, e)}$ 和 $${fr(n, d)}$ 在长条上涂色一样长。`],
          [
            [d, "That keeps the old bottom number. The bottom changes the same way as the top.", "这里分母没变。分母要和分子同样地变。"],
            [
              up ? d + m - n : d - (n - m),
              up ? `That adds ${m - n} to the bottom. Multiply instead.` : `That subtracts ${n - m} from the bottom. Divide instead.`,
              up ? `这是给分母加了 ${m - n}。要用乘法。` : `这是给分母减了 ${n - m}。要用除法。`,
            ],
            [m, "That copies the top number.", "这是照抄了分子。"],
            [e + 1, "That is 1 too many.", "多了 1。"],
          ],
          barFigure(d, n),
        );
      },
      captioned(
        twoBarsFigure(2, 1, 6, 3),
        "One half of a bar and three sixths of the same bar cover the same length.",
        "一个长条的二分之一和同样长条的六分之三一样长。",
      ),
    ),
    earlyPoint(
      "which-is-not-equal",
      ["Which is not equal", "哪个不相等"],
      [
        "Which is not equal to $\\frac{1}{2}$: $\\frac{2}{4}$, $\\frac{3}{6}$ or $\\frac{2}{3}$? In $\\frac{2}{4}$ and $\\frac{3}{6}$ the bottom is twice the top, so they are halves. In $\\frac{2}{3}$ it is not, so $\\frac{2}{3}$ is not equal.\n\nCheck: on a bar, $\\frac{2}{3}$ reaches past the middle.\n\n> **Watch out.** Adding 1 to the top and bottom of $\\frac{1}{2}$ gives $\\frac{2}{3}$, which is not equal. Only multiplying keeps the amount.",
        "哪个和 $\\frac{1}{2}$ 不相等：$\\frac{2}{4}$、$\\frac{3}{6}$ 还是 $\\frac{2}{3}$？$\\frac{2}{4}$ 和 $\\frac{3}{6}$ 的分母都是分子的两倍，都是一半。$\\frac{2}{3}$ 不是，所以 $\\frac{2}{3}$ 不相等。\n\n检验：在长条上，$\\frac{2}{3}$ 超过了中间。\n\n> **注意。** $\\frac{1}{2}$ 的分子分母都加 1 得 $\\frac{2}{3}$，不相等。只有乘同一个数，大小才不变。",
      ],
      (rng) => {
        // Third-grade denominators are 2, 3, 4, 6 and 8, which limits the families with enough equal fractions.
        const half = rng.bool();
        const equal: readonly (readonly [number, number])[] = half
          ? [
              [1, 2],
              [2, 4],
              [3, 6],
              [4, 8],
            ]
          : [
              [2, 2],
              [3, 3],
              [4, 4],
              [6, 6],
              [8, 8],
            ];
        const others: readonly (readonly [number, number])[] = half
          ? [
              [1, 3],
              [2, 3],
              [1, 4],
              [3, 4],
              [2, 6],
              [4, 6],
              [5, 6],
              [3, 8],
              [5, 8],
            ]
          : [
              [1, 2],
              [2, 3],
              [3, 4],
              [5, 6],
              [7, 8],
              [3, 2],
              [4, 3],
              [5, 4],
            ];
        const [base, ...goods] = rng.sample(equal, 4) as [readonly [number, number], ...(readonly [number, number])[]];
        const other = rng.pick(others);
        const notEqual = fr(other[0], other[1]);
        const name = fr(base[0], base[1]);
        const rule: Pair = half ? ["the bottom is twice the top", "分母是分子的两倍"] : ["the top equals the bottom", "分子等于分母"];
        const what: Pair = half ? ["one half", "一半"] : ["one whole", "一个整体"];
        return pickedMath(
          rng,
          [`Which fraction is not equal to $${name}$?`, `哪个分数和 $${name}$ 不相等？`],
          notEqual,
          goods.map(
            ([n, d]) =>
              [fr(n, d), `This one is equal: ${rule[0]}, so it is ${what[0]} too.`, `这个相等：${rule[1]}，所以也是${what[1]}。`] as const,
          ),
          [
            [
              ["Find the pattern", "找规律"],
              [`$${name}$ is ${what[0]}: ${rule[0]}.`, `$${name}$ 是${what[1]}：${rule[1]}。`],
            ],
            [
              ["Test each one", "逐个检查"],
              [`Only in $${notEqual}$ is it not true that ${rule[0]}.`, `只有 $${notEqual}$ 不是${rule[1]}。`],
            ],
          ],
          [`On a bar, $${notEqual}$ does not reach the same point as $${name}$.`, `在长条上，$${notEqual}$ 和 $${name}$ 到的位置不一样。`],
          other[0] <= other[1] ? twoBarsFigure(base[1], base[0], other[1], other[0]) : barFigure(base[1], base[0]),
        );
      },
      captioned(
        twoBarsFigure(2, 1, 3, 2),
        "One half of a bar and two thirds of the same bar: two thirds reaches farther.",
        "一个长条的二分之一和同样长条的三分之二：三分之二更长。",
      ),
    ),
  ],
  [
    "Jo cuts a sandwich into 2 halves and eats 1. Max cuts the same kind of sandwich into 4 quarters and eats 2. They ate the same amount: $\\frac{1}{2} = \\frac{2}{4}$.\n\nCheck: 2 quarters fit exactly on 1 half.\n\nIn this lesson we use bars to write equal fractions and spot ones that are not equal.",
    "Jo 把一个三明治切成 2 半，吃了 1 半。Max 把同样的三明治切成 4 份，吃了 2 份。他们吃得一样多：$\\frac{1}{2} = \\frac{2}{4}$。\n\n检验：2 个四分之一正好和 1 个二分之一一样大。\n\n本课我们用长条写出相等的分数，并找出不相等的分数。",
  ],
);

/** twoWholesFigure draws a large bar and a small bar, each cut into d equal parts with one part shaded. */
function twoWholesFigure(d: number): Figure {
  let body = "";
  [
    [280, 8],
    [140, 52],
  ].forEach(([w = 0, y = 0]) => {
    const part = w / d;
    body += `<rect x="20" y="${y}" width="${part.toFixed(1)}" height="30" class="accent" fill="currentColor" fill-opacity="0.3"/>`;
    for (let i = 0; i < d; i++) body += `<rect x="${(20 + i * part).toFixed(1)}" y="${y}" width="${part.toFixed(1)}" height="30"/>`;
  });
  return {
    svg: svgDocument(90, body),
    alt: t(
      `A large bar and a bar half as long, each cut into ${d} equal parts with one part shaded.`,
      `一个大长条和一个只有它一半长的长条，各平均分成 ${d} 份，各涂了 1 份。`,
    ),
  };
}

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
        "Compare $\\frac{2}{3}$ and $\\frac{3}{6}$ on two bars of the same size. The shaded part of the $\\frac{2}{3}$ bar is longer, so $\\frac{2}{3} > \\frac{3}{6}$.\n\nCheck: $\\frac{3}{6}$ is one half, and $\\frac{2}{3}$ is more than half.\n\n> **Watch out.** Look at how much is shaded, not how many pieces. 3 small pieces can be less than 2 big ones.",
        "在两个一样大的长条上比较 $\\frac{2}{3}$ 和 $\\frac{3}{6}$。$\\frac{2}{3}$ 那个长条涂色部分更长，所以 $\\frac{2}{3} > \\frac{3}{6}$。\n\n检验：$\\frac{3}{6}$ 是一半，$\\frac{2}{3}$ 比一半多。\n\n> **注意。** 要看涂色部分有多长，不是数涂了几块。3 小块可能比 2 大块少。",
      ],
      (rng) => {
        const [d1, d2] = rng.sample([2, 3, 4, 6, 8], 2) as [number, number];
        const n1 = rng.int(1, d1 - 1);
        const n2 = rng.int(1, d2 - 1);
        const diff = n1 * d2 - n2 * d1;
        const rel = diff < 0 ? 0 : diff === 0 ? 1 : 2;
        const a = fr(n1, d1);
        const b = fr(n2, d2);
        return compared(
          a,
          b,
          rel,
          [
            [
              ["Look at the bars", "看长条"],
              [
                `The top bar shows $${a}$ and the bottom bar shows $${b}$; the bars are the same size.`,
                `上面的长条表示 $${a}$，下面的表示 $${b}$；两个长条一样大。`,
              ],
            ],
            [
              ["Compare the shading", "比较涂色部分"],
              diff === 0
                ? ["The shaded parts are the same length.", "两个涂色部分一样长。"]
                : [
                    `The shaded part of the ${diff > 0 ? "top" : "bottom"} bar is longer.`,
                    `${diff > 0 ? "上面" : "下面"}长条的涂色部分更长。`,
                  ],
            ],
          ],
          [
            `With ${d1 * d2} equal parts in each bar, $${a}$ is ${n1 * d2} parts and $${b}$ is ${n2 * d1} parts.`,
            `把每个长条都分成 ${d1 * d2} 份，$${a}$ 是 ${n1 * d2} 份，$${b}$ 是 ${n2 * d1} 份。`,
          ],
          [
            ["That would mean the top shading is shorter, but it is not.", "那表示上面的涂色部分更短，但并不是。"],
            ["That would mean the shaded parts are the same length, but they are not.", "那表示两个涂色部分一样长，但并不是。"],
            ["That would mean the top shading is longer, but it is not.", "那表示上面的涂色部分更长，但并不是。"],
          ],
          twoBarsFigure(d1, n1, d2, n2),
        );
      },
      captioned(
        twoBarsFigure(3, 2, 6, 3),
        "Two thirds of a bar is longer than three sixths of the same bar.",
        "一个长条的三分之二比同样长条的六分之三长。",
      ),
    ),
    {
      ...earlyPoint(
        "comparing-on-two-lines",
        ["Comparing on two lines", "用两条数轴比较"],
        [
          "Compare $\\frac{3}{4}$ and $\\frac{2}{3}$ on two lines from 0 to 1. The dot at $\\frac{3}{4}$ is farther to the right, so $\\frac{3}{4} > \\frac{2}{3}$.\n\nCheck: $\\frac{3}{4}$ is $\\frac{1}{4}$ from 1 and $\\frac{2}{3}$ is $\\frac{1}{3}$ from 1. $\\frac{1}{4}$ is the smaller gap, so $\\frac{3}{4}$ is closer to 1.\n\n> **Watch out.** Look at where the dots are, not at which numbers are bigger.",
          "在两条从 0 到 1 的数轴上比较 $\\frac{3}{4}$ 和 $\\frac{2}{3}$。$\\frac{3}{4}$ 的点更靠右，所以 $\\frac{3}{4} > \\frac{2}{3}$。\n\n检验：$\\frac{3}{4}$ 离 1 还差 $\\frac{1}{4}$，$\\frac{2}{3}$ 离 1 还差 $\\frac{1}{3}$。$\\frac{1}{4}$ 更小，所以 $\\frac{3}{4}$ 离 1 更近。\n\n> **注意。** 要看点在哪里，不要看哪个数大。",
        ],
        (rng) => {
          const [d1, d2] = rng.sample([2, 3, 4, 6, 8], 2) as [number, number];
          const n1 = rng.int(1, d1 - 1);
          const n2 = rng.int(1, d2 - 1);
          const diff = n1 * d2 - n2 * d1;
          const rel = diff < 0 ? 0 : diff === 0 ? 1 : 2;
          const a = fr(n1, d1);
          const b = fr(n2, d2);
          return compared(
            a,
            b,
            rel,
            [
              [
                ["Find the dots", "找到两个点"],
                [`The top dot is at $${a}$ and the bottom dot is at $${b}$.`, `上面的点在 $${a}$，下面的点在 $${b}$。`],
              ],
              [
                ["Compare positions", "比较位置"],
                diff === 0
                  ? ["The dots line up, so the fractions are equal.", "两个点对齐，所以两个分数相等。"]
                  : [`The ${diff > 0 ? "top" : "bottom"} dot is farther from 0.`, `${diff > 0 ? "上面" : "下面"}的点离 0 更远。`],
              ],
            ],
            [
              `With ${d1 * d2} equal spaces on each line, $${a}$ is ${n1 * d2} spaces and $${b}$ is ${n2 * d1} spaces from 0.`,
              `把每条数轴都分成 ${d1 * d2} 格，$${a}$ 离 0 有 ${n1 * d2} 格，$${b}$ 离 0 有 ${n2 * d1} 格。`,
            ],
            [
              ["That would mean the top dot is nearer to 0, but it is not.", "那表示上面的点离 0 更近，但并不是。"],
              ["That would mean the dots line up, but they do not.", "那表示两个点对齐，但并没有。"],
              ["That would mean the top dot is farther from 0, but it is not.", "那表示上面的点离 0 更远，但并不是。"],
            ],
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
        "Ann eats $\\frac{1}{4}$ of a large pizza and Bo eats $\\frac{1}{4}$ of a small pizza. A fourth of a large pizza is a bigger piece, so Ann eats more.\n\nCheck: in the picture, the shaded part of the large bar is longer than the shaded part of the small bar.\n\n> **Watch out.** The same fraction is not the same amount when the wholes are different sizes.",
        "Ann 吃了一张大披萨的 $\\frac{1}{4}$，Bo 吃了一张小披萨的 $\\frac{1}{4}$。大披萨的四分之一更大，所以 Ann 吃得多。\n\n检验：图中，大长条的涂色部分比小长条的涂色部分长。\n\n> **注意。** 整体大小不同时，同样的分数不是同样多。",
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
        const unit = food[0] === "sandwich" ? "个" : food[0] === "pizza" || food[0] === "pie" ? "张" : "块";
        return picked(
          rng,
          [
            `${p} eats $${fr(1, d)}$ of a large ${food[0]}. ${q} eats $${fr(1, d)}$ of a small ${food[0]}. Who eats more?`,
            `${p} 吃了一${unit}大${food[1]}的 $${fr(1, d)}$，${q} 吃了一${unit}小${food[1]}的 $${fr(1, d)}$。谁吃得多？`,
          ],
          [`${p}, because the same fraction of a larger whole is more`, `${p}，因为整体越大，同样的几分之几就越多`],
          [
            [
              [`${q}, because the same fraction of a smaller whole is more`, `${q}，因为整体越小，同样的几分之几就越多`],
              "A smaller whole gives smaller parts, so it is less.",
              "整体越小，每份也越小，所以更少。",
            ],
            [
              ["They eat the same, because the fractions are the same", "一样多，因为分数相同"],
              "The fractions are the same, but the wholes are not, so the amounts differ.",
              "分数相同，但整体不同，所以吃的不一样多。",
            ],
            [
              [`${q}, because small pieces are worth more`, `${q}，因为小的部分更值钱`],
              "We compare how much is eaten, and a smaller piece is less.",
              "比的是吃了多少，小的部分更少。",
            ],
          ],
          [
            [
              ["Compare the fractions", "比较分数"],
              [`Both ate $${fr(1, d)}$.`, `两人都吃了 $${fr(1, d)}$。`],
            ],
            [
              ["Compare the wholes", "比较整体"],
              [
                `${p}'s ${food[0]} is larger, so its $${fr(1, d)}$ is a bigger piece.`,
                `${p} 的${food[1]}更大，所以它的 $${fr(1, d)}$ 也更大。`,
              ],
            ],
          ],
          [`In the picture, the shaded part of the large bar is longer.`, `图中，大长条的涂色部分更长。`],
          twoWholesFigure(d),
        );
      },
      captioned(
        twoWholesFigure(4),
        "One fourth of a large bar is longer than one fourth of a small bar.",
        "大长条的四分之一比小长条的四分之一长。",
      ),
    ),
  ],
  [
    "Sara and Tom each get $\\frac{1}{2}$ of a bar. Sara's bar is twice as long as Tom's, so her half is twice as big. To compare fractions fairly, the wholes must be the same size.\n\nCheck: half of 8 inches is 4 inches, half of 4 inches is 2 inches.\n\nIn this lesson we compare fractions with bars and number lines.",
    "Sara 和 Tom 各分到一根长条的 $\\frac{1}{2}$。Sara 的长条是 Tom 的两倍长，所以她的一半也是两倍大。要公平地比较分数，整体必须一样大。\n\n检验：8 英寸的一半是 4 英寸，4 英寸的一半是 2 英寸。\n\n本课我们用长条和数轴比较分数。",
  ],
);

/** timeWrongs turns wrong times, in minutes after midnight, into choice options with reasons, dropping any that read the same as the answer or an earlier one. */
function timeWrongs(answer: string, wrong: readonly (readonly [number, string, string])[]): Wrong[] {
  const seen = new Set([answer]);
  return wrong
    .filter(([v]) => {
      const s = clockText(v);
      if (seen.has(s)) return false;
      seen.add(s);
      return true;
    })
    .map(([v, en, zh]): Wrong => [[clockText(v), clockText(v)], en, zh]);
}

/** passing works out in English and Chinese how adding minutes to a time carries into the next hour. */
const passing = (from: number, add: number): Walk => {
  const total = (from % 60) + add;
  const sum = `$${from % 60} + ${add} = ${total}$`;
  return [
    ["Add the minutes", "加分钟"],
    total >= 60
      ? [
          `${sum}, which passes 60, so go to the next hour with ${total - 60} minutes: ${clockText(from + add)}.`,
          `${sum}，超过了 60，所以进到下一个小时，还剩 ${total - 60} 分钟：${clockText(from + add)}。`,
        ]
      : [`${sum}, still in the same hour: ${clockText(from + add)}.`, `${sum}，还在同一个小时里：${clockText(from + add)}。`],
  ];
};

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
          "Start at 3:50 and go 35 minutes. First jump 10 minutes to land on the hour, 4:00. Then jump the other 25 minutes to 4:25.\n\nCheck: the jumps add up: $10 + 25 = 35$ minutes.\n\n> **Watch out.** An hour has 60 minutes, not 100. 3:50 and 10 minutes is 4:00, not 3:60.",
          "从 3:50 开始，过 35 分钟。先跳 10 分钟，落在整点 4:00。再跳剩下的 25 分钟，到 4:25。\n\n检验：两跳加起来：$10 + 25 = 35$ 分钟。\n\n> **注意。** 一小时是 60 分钟，不是 100 分钟。3:50 过 10 分钟是 4:00，不是 3:60。",
        ],
        (rng) => {
          const hour = rng.int(1, 10);
          const toHour = 5 * rng.int(1, 6);
          const start = 60 * hour + 60 - toHour;
          const after = 5 * rng.int(2, 8);
          const end = start + toHour + after;
          const answer = clockText(end);
          return picked(
            rng,
            ["The jumps start at the first time. What time do they end?", "从第一个时间开始跳。跳到什么时间结束？"],
            [answer, answer],
            rng
              .shuffle(
                timeWrongs(answer, [
                  [end + 60, "This is one hour too late: the jumps add only minutes here.", "这晚了一小时：这里的跳跃加的只是分钟。"],
                  [
                    end - 60,
                    "This is one hour too early: the hour changes when the jumps pass the hour mark.",
                    "这早了一小时：跳跃经过整点时，小时就要变。",
                  ],
                  [end - 10, "This is 10 minutes too early: add both jumps in full.", "这早了 10 分钟：两次跳跃都要加够。"],
                  [end + 10, "This is 10 minutes too late: add only the two jumps.", "这晚了 10 分钟：只加这两次跳跃。"],
                ]),
              )
              .slice(0, 3),
            [
              [
                ["Jump to the hour", "跳到整点"],
                [
                  `${toHour} minutes from ${clockText(start)} reach ${clockText(start + toHour)}.`,
                  `从 ${clockText(start)} 跳 ${toHour} 分钟到 ${clockText(start + toHour)}。`,
                ],
              ],
              [
                ["Jump the rest", "跳剩下的"],
                [`${after} more minutes reach ${answer}.`, `再跳 ${after} 分钟到 ${answer}。`],
              ],
            ],
            [
              `From ${clockText(start)} to ${answer} is $${toHour} + ${after} = ${toHour + after}$ minutes, the two jumps together.`,
              `从 ${clockText(start)} 到 ${answer} 是 $${toHour} + ${after} = ${toHour + after}$ 分钟，正是两跳之和。`,
            ],
            timeHopsFigure([start, start + toHour, end], true),
          );
        },
      ),
      figure: gradeDrawings["jumping-to-an-end-time"],
    },
    earlyPoint(
      "adding-the-jumps",
      ["Adding the jumps", "把跳的时间加起来"],
      [
        "How long is it from 2:45 to 3:20? Jump 15 minutes from 2:45 to 3:00, then 20 minutes to 3:20. Add the jumps: $15 + 20 = 35$ minutes.\n\nCheck: 2:45 and 35 minutes is 3:20.\n\n> **Watch out.** Add the numbers above the jumps, not the times on the line. $45 - 20 = 25$ is wrong.",
        "从 2:45 到 3:20 有多长？从 2:45 跳 15 分钟到 3:00，再跳 20 分钟到 3:20。把两跳加起来：$15 + 20 = 35$ 分钟。\n\n检验：2:45 过 35 分钟是 3:20。\n\n> **注意。** 要加跳跃上方的数，不是线上的时间。$45 - 20 = 25$ 是错的。",
      ],
      (rng) => {
        const hour = rng.int(1, 10);
        const toHour = 5 * rng.int(1, 7);
        const start = 60 * hour + 60 - toHour;
        const after = 5 * rng.int(1, 8);
        const end = start + toHour + after;
        return solved(
          ["How many minutes long is the time from the first time to the last?", "从第一个时间到最后一个时间，一共是多少分钟？"],
          toHour + after,
          [
            [
              ["Read the jumps", "读出每一跳"],
              [
                `${clockText(start)} to ${clockText(start + toHour)} is ${toHour} minutes, and ${clockText(start + toHour)} to ${clockText(end)} is ${after} minutes.`,
                `${clockText(start)} 到 ${clockText(start + toHour)} 是 ${toHour} 分钟，${clockText(start + toHour)} 到 ${clockText(end)} 是 ${after} 分钟。`,
              ],
            ],
            [["Add them", "加起来"], ["In all:", "一共："], [`${toHour} + ${after} = ${toHour + after}`]],
          ],
          [
            `${clockText(start)} and ${toHour + after} minutes is ${clockText(end)}.`,
            `${clockText(start)} 过 ${toHour + after} 分钟是 ${clockText(end)}。`,
          ],
          [
            [toHour, "That is only the first jump.", "这只是第一跳。"],
            [after, "That is only the second jump.", "这只是第二跳。"],
            [toHour + after + 60, "That adds an hour. The time is less than an hour.", "这多加了一小时。经过的时间不到一小时。"],
            [
              Math.abs((end % 60) - (start % 60)),
              "That subtracts the minutes on the clocks. Add the jumps instead.",
              "这是把钟上的分钟数相减了。要把两跳加起来。",
            ],
          ],
          timeHopsFigure([start, start + toHour, end]),
        );
      },
      captioned(
        timeHopsFigure([165, 180, 200]),
        "A time line from 2:45: a jump of 15 minutes to 3:00 and a jump of 20 minutes to 3:20.",
        "从 2:45 开始的时间线：跳 15 分钟到 3:00，再跳 20 分钟到 3:20。",
      ),
    ),
    earlyPoint(
      "the-missing-time-jump",
      ["The missing time jump", "缺少的一跳"],
      [
        "A jump goes from 4:35 to 5:00. 35 minutes have passed in that hour, so $60 - 35 = 25$ minutes are left. The jump is 25 minutes.\n\nCheck: count by fives from 4:35: 4:40, 4:45, 4:50, 4:55, 5:00 is 5 fives, 25 minutes.\n\n> **Watch out.** An hour is 60 minutes. $100 - 35 = 65$ is wrong.",
        "有一跳从 4:35 到 5:00。这个小时已经过了 35 分钟，还剩 $60 - 35 = 25$ 分钟。这一跳是 25 分钟。\n\n检验：从 4:35 五分五分地数：4:40、4:45、4:50、4:55、5:00，是 5 个 5 分钟，25 分钟。\n\n> **注意。** 一小时是 60 分钟。$100 - 35 = 65$ 是错的。",
      ],
      (rng) => {
        const hour = rng.int(1, 10);
        const toHour = 5 * rng.int(1, 8);
        const start = 60 * hour + 60 - toHour;
        const after = 5 * rng.int(1, 9);
        const end = start + toHour + after;
        const first = rng.bool();
        const answer = first ? toHour : after;
        const from = first ? start : start + toHour;
        const to = first ? start + toHour : end;
        return solved(
          ["How many minutes is the jump with the question mark?", "问号这一跳是多少分钟？"],
          answer,
          [
            [
              ["Read its ends", "读出两端"],
              [`The jump goes from ${clockText(from)} to ${clockText(to)}.`, `这一跳从 ${clockText(from)} 到 ${clockText(to)}。`],
            ],
            first
              ? [
                  ["Find the minutes left", "求剩下的分钟"],
                  [`${start % 60} minutes have passed in the hour, so:`, `这个小时已经过了 ${start % 60} 分钟，所以：`],
                  [`60 - ${start % 60} = ${answer}`],
                ]
              : [
                  ["Read the minutes", "读分钟"],
                  [
                    `It starts on the hour, so it is the minutes of the later time: ${answer}.`,
                    `它从整点开始，所以就是后面时间的分钟数：${answer}。`,
                  ],
                ],
          ],
          [`${clockText(from)} and ${answer} minutes is ${clockText(to)}.`, `${clockText(from)} 过 ${answer} 分钟是 ${clockText(to)}。`],
          first
            ? [
                [100 - (60 - toHour), "That uses 100 minutes in an hour. An hour has 60.", "这是把一小时当成 100 分钟。一小时是 60 分钟。"],
                [
                  60 - toHour,
                  "That is the minutes on the clock, not the minutes left in the hour.",
                  "这是钟上的分钟数，不是这个小时还剩的分钟。",
                ],
                [after, "That is the other jump.", "这是另一跳。"],
              ]
            : [
                [toHour, "That is the other jump.", "这是另一跳。"],
                [
                  60 - after,
                  "That is the minutes left in the hour, but this jump starts on the hour.",
                  "这是这个小时还剩的分钟，可这一跳是从整点开始的。",
                ],
                [toHour + after, "That is both jumps together.", "这是两跳的和。"],
              ],
          timeHopsFigure([start, start + toHour, end], false, first ? 0 : 1),
        );
      },
      captioned(
        timeHopsFigure([275, 300, 340], false, 0),
        "A time line from 4:35 to 5:00 with an unknown jump, then 40 minutes to 5:40.",
        "时间线从 4:35 到 5:00 是未知的一跳，再跳 40 分钟到 5:40。",
      ),
    ),
  ],
  [
    "A show starts at 6:40 and lasts 45 minutes. Lin draws a time line: 20 minutes to 7:00, then 25 more to 7:25. The show ends at 7:25.\n\nCheck: $20 + 25 = 45$ minutes.\n\nIn this lesson we use jumps on a time line to find end times and lengths of time.",
    "一个节目 6:40 开始，演 45 分钟。Lin 画了一条时间线：跳 20 分钟到 7:00，再跳 25 分钟到 7:25。节目 7:25 结束。\n\n检验：$20 + 25 = 45$ 分钟。\n\n本课我们用时间线上的跳跃，求结束时间和经过的时间。",
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
        "A lesson starts at 3:40 and lasts 35 minutes. Add the minutes: $40 + 35 = 75$. That passes 60, so go to the next hour: $75 - 60 = 15$. It ends at 4:15.\n\nCheck: 3:40 to 4:00 is 20 minutes, and 4:00 to 4:15 is 15 more: $20 + 15 = 35$.\n\n> **Watch out.** 3:75 is not a time. Past 60 minutes, move to the next hour.",
        "一节课 3:40 开始，上 35 分钟。把分钟加起来：$40 + 35 = 75$。超过了 60，进到下一个小时：$75 - 60 = 15$。4:15 结束。\n\n检验：3:40 到 4:00 是 20 分钟，4:00 到 4:15 又是 15 分钟：$20 + 15 = 35$。\n\n> **注意。** 3:75 不是时间。超过 60 分钟，就要进到下一个小时。",
      ],
      (rng) => {
        const h = rng.int(1, 10);
        const m = rng.int(1, 11) * 5 + rng.pick([0, 0, 2, 3]);
        const add = rng.int(3, 11) * 5;
        const start = 60 * h + m;
        const end = start + add;
        const answer = clockText(end);
        const job = rng.pick<Pair>([
          ["A movie clip", "一段影片"],
          ["A swim lesson", "一节游泳课"],
          ["A piano lesson", "一节钢琴课"],
          ["A soccer game", "一场足球赛"],
          ["A craft class", "一节手工课"],
        ]);
        return picked(
          rng,
          [
            `${job[0]} starts at the time on this clock and lasts ${add} minutes. When does it end?`,
            `${job[1]}在钟面显示的时间开始，一共 ${add} 分钟。它什么时候结束？`,
          ],
          [answer, answer],
          rng
            .shuffle(
              timeWrongs(answer, [
                [end + 40, "That treats an hour as 100 minutes.", "这是把一小时当成了 100 分钟。"],
                [end - 60, "That forgets to move to the next hour after 60 minutes.", "这是过了 60 分钟却没进到下一个小时。"],
                [end + 10, "That is 10 minutes too late.", "这晚了 10 分钟。"],
                [start, "That is the start time, not the end.", "这是开始的时间，不是结束的时间。"],
              ]),
            )
            .slice(0, 3),
          [
            [
              ["Read the clock", "读钟面"],
              [`The short hand and long hand show ${clockText(start)}.`, `短针和长针表示 ${clockText(start)}。`],
            ],
            passing(start, add),
          ],
          [
            `From ${answer}, count back ${add} minutes to reach ${clockText(start)}.`,
            `从 ${answer} 往回数 ${add} 分钟，回到 ${clockText(start)}。`,
          ],
          clockFigure(h, m),
        );
      },
      captioned(clockFigure(3, 40), "A clock showing 3:40, the start of the lesson.", "钟面显示 3:40，是上课开始的时间。"),
    ),
    earlyPoint(
      "finding-the-start-time",
      ["Finding the start time", "求开始的时间"],
      [
        "A class ended at 2:15 and lasted 40 minutes. Count back: 15 minutes to 2:00, then 25 more minutes to 1:35. It started at 1:35.\n\nCheck: 1:35 and 40 minutes is 2:15.\n\n> **Watch out.** Going back past the hour, the hour goes down by 1. 2:35 is after the end, not before it.",
        "一节课 2:15 结束，上了 40 分钟。往回数：先 15 分钟到 2:00，再 25 分钟到 1:35。课是 1:35 开始的。\n\n检验：1:35 过 40 分钟是 2:15。\n\n> **注意。** 往回跨过整点时，小时数要减 1。2:35 在结束之后，不在之前。",
      ],
      (rng) => {
        const h = rng.int(2, 11);
        const m = rng.int(1, 8) * 5;
        const take = m + rng.int(1, 7) * 5;
        const end = 60 * h + m;
        const begin = end - take;
        const answer = clockText(begin);
        const name = rng.pick(earlyNames);
        const job = rng.pick<Pair>([
          ["reading", "看书"],
          ["painting", "画画"],
          ["practicing piano", "练钢琴"],
          ["cleaning up", "打扫"],
          ["doing homework", "做作业"],
        ]);
        return picked(
          rng,
          [
            `${name} finished ${job[0]} at the time on this clock, after ${take} minutes. What time did ${name} start?`,
            `${name} ${job[1]}用了 ${take} 分钟，结束时的时间如钟面所示。${name} 是几点几分开始的？`,
          ],
          [answer, answer],
          rng
            .shuffle(
              timeWrongs(answer, [
                [end + take, "That counts forward. To find the start, count back.", "这是往后数。求开始的时间要往回数。"],
                [begin + 60, "That forgets to take 1 from the hour when going back past it.", "这是往回跨过整点时忘了把小时数减 1。"],
                [begin + 10, "That is 10 minutes too late.", "这晚了 10 分钟。"],
                [begin - 10, "That is 10 minutes too early.", "这早了 10 分钟。"],
              ]),
            )
            .slice(0, 3),
          [
            [
              ["Back to the hour", "往回到整点"],
              [`Going back ${m} minutes from ${clockText(end)} reaches ${h}:00.`, `从 ${clockText(end)} 往回 ${m} 分钟到 ${h}:00。`],
            ],
            [
              ["Back the rest", "再往回"],
              [`${take - m} more minutes back reach ${answer}.`, `再往回 ${take - m} 分钟到 ${answer}。`],
            ],
          ],
          [`${answer} and ${take} minutes is ${clockText(end)}.`, `${answer} 过 ${take} 分钟是 ${clockText(end)}。`],
          clockFigure(h, m),
        );
      },
      captioned(clockFigure(2, 15), "A clock showing 2:15, when the class ended.", "钟面显示 2:15，是下课的时间。"),
    ),
    earlyPoint(
      "two-activities-in-a-row",
      ["Two activities in a row", "连续的两件事"],
      [
        "Ivy reads for 25 minutes from 4:10 and then draws for 20 minutes. Add the times: $25 + 20 = 45$ minutes. 4:10 and 45 minutes is 4:55.\n\nCheck: reading ends at 4:35, and 20 minutes later is 4:55.\n\n> **Watch out.** Count both activities. 4:35 is only when the reading ends.",
        "Ivy 从 4:10 开始看书，看了 25 分钟，接着画了 20 分钟的画。先把时间加起来：$25 + 20 = 45$ 分钟。4:10 过 45 分钟是 4:55。\n\n检验：看书 4:35 结束，再过 20 分钟是 4:55。\n\n> **注意。** 两件事都要算上。4:35 只是看完书的时间。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const h = rng.int(1, 10);
        const m = 5 * rng.int(0, 5);
        const a = 5 * rng.int(2, 7);
        const b = 5 * rng.int(2, 7);
        const start = 60 * h + m;
        const end = start + a + b;
        const answer = clockText(end);
        return picked(
          rng,
          [
            `${name} starts reading at ${clockText(start)}. ${name} reads for ${a} minutes and then draws for ${b} minutes. When does ${name} finish?`,
            `${name} ${clockText(start)} 开始看书，看了 ${a} 分钟，接着画了 ${b} 分钟的画。${name} 什么时候结束？`,
          ],
          [answer, answer],
          rng
            .shuffle(
              timeWrongs(answer, [
                [start + a, "That is when the reading ends. Add the drawing too.", "这是看完书的时间。还要加上画画的时间。"],
                [start + b, "That counts only the drawing.", "这只算了画画的时间。"],
                [end + 10, "That is 10 minutes too late.", "这晚了 10 分钟。"],
                [end + 60, "That is one hour too late.", "这晚了一小时。"],
              ]),
            )
            .slice(0, 3),
          [[["Add the times", "把时间加起来"], ["Both activities:", "两件事一共："], [`${a} + ${b} = ${a + b}`]], passing(start, a + b)],
          [
            `Reading ends at ${clockText(start + a)}, and ${b} minutes later is ${answer}.`,
            `看书在 ${clockText(start + a)} 结束，再过 ${b} 分钟是 ${answer}。`,
          ],
          timeHopsFigure([start, start + a, end], true),
        );
      },
      captioned(
        timeHopsFigure([250, 275, 295]),
        "A time line from 4:10: 25 minutes of reading to 4:35, then 20 minutes of drawing to 4:55.",
        "从 4:10 开始的时间线：看书 25 分钟到 4:35，再画画 20 分钟到 4:55。",
      ),
    ),
  ],
  [
    "Soccer practice starts at 5:30 and lasts 50 minutes. 30 minutes take it to 6:00, and 20 more take it to 6:20. Practice ends at 6:20.\n\nCheck: $30 + 20 = 50$ minutes.\n\nIn this lesson we find end times and start times from a clock and an amount of time.",
    "足球训练 5:30 开始，练 50 分钟。30 分钟到 6:00，再 20 分钟到 6:20。训练 6:20 结束。\n\n检验：$30 + 20 = 50$ 分钟。\n\n本课我们根据钟面和经过的时间，求结束和开始的时间。",
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
        "A dial goes from 0 to 1000 grams with 10 equal spaces, so each mark is worth $1000 \\div 10 = 100$ grams. The needle is 6 marks from 0, so it shows 600 grams.\n\nCheck: 600 is 400 less than 1000, and the needle is 4 marks before the top.\n\n> **Watch out.** Work out what one mark is worth first. Reading the 6 marks as 6 grams is wrong.",
        "秤盘从 0 到 1000 克，平均分成 10 格，所以每格表示 $1000 \\div 10 = 100$ 克。指针离 0 有 6 格，所以表示 600 克。\n\n检验：600 比 1000 少 400，指针离最大刻度也正好差 4 格。\n\n> **注意。** 先算出每格表示多少。把 6 格读成 6 克是错的。",
      ],
      (rng) => {
        const kg = rng.bool();
        const max = kg ? rng.pick([10, 20]) : 1000;
        const step = kg ? max / 10 : 100;
        const marks = rng.int(1, 9);
        const value = step * marks;
        const unit = kg ? ["kg", "千克"] : ["g", "克"];
        return solved(
          [`What mass does the scale show, in ${kg ? "kilograms" : "grams"}?`, `这个秤显示的质量是多少${unit[1]}？`],
          value,
          [
            [
              ["Find one mark", "求每格"],
              [`The dial goes to ${max} in 10 equal spaces:`, `秤盘到 ${max}，平均分成 10 格：`],
              [`${div(max, 10)} = ${step}`],
            ],
            [
              ["Read the needle", "读指针"],
              [`The needle is ${marks} marks from 0:`, `指针离 0 有 ${marks} 格：`],
              [`${times(marks, step)} = ${value}`],
            ],
          ],
          [
            `The needle is ${10 - marks} marks before ${max}, and $${max} - ${times(10 - marks, step)} = ${value}$.`,
            `指针离 ${max} 还差 ${10 - marks} 格，$${max} - ${times(10 - marks, step)} = ${value}$。`,
          ],
          [
            [value + step, "That is one mark too far.", "多读了一格。"],
            [value - step, "That is one mark too few.", "少读了一格。"],
            [marks, `That counts the marks but forgets each one is worth ${step}.`, `这只数了格数，忘了每格表示 ${step}。`],
          ],
          dialScaleFigure(value, max, step, unit[0] as string, 2),
        );
      },
      captioned(
        dialScaleFigure(600, 1000, 100, "g", 2),
        "A dial from 0 to 1000 grams with marks every 100 grams; the needle points to 600.",
        "秤盘从 0 到 1000 克，每格 100 克；指针指着 600。",
      ),
    ),
    earlyPoint(
      "reading-a-measuring-cup",
      ["Reading a measuring cup", "读量杯"],
      [
        "A cup is marked 0, 10, 20 up its side with a mark between each pair, so each mark is worth $10 \\div 2 = 5$ liters. The water is 3 marks above 20, at 35 liters.\n\nCheck: 35 is 5 less than 40, one mark below the 40.\n\n> **Watch out.** Not every mark has a number. Do not count each mark as 1 liter.",
        "量杯侧面标着 0、10、20，每两个数中间还有一个刻度，所以每格表示 $10 \\div 2 = 5$ 升。水面在 20 上面 3 格，是 35 升。\n\n检验：35 比 40 少 5，正好在 40 下面一格。\n\n> **注意。** 不是每个刻度都标了数。不要把每格都当成 1 升。",
      ],
      (rng) => {
        const step = rng.pick([1, 2, 5]);
        const max = step * 10;
        const marks = rng.int(1, 9);
        const level = step * marks;
        return solved(
          ["How many liters of water are in this measuring cup?", "这个量杯里有多少升水？"],
          level,
          [
            [
              ["Find one mark", "求每格"],
              [`The cup goes to ${max} in 10 equal spaces:`, `量杯到 ${max}，平均分成 10 格：`],
              [`${div(max, 10)} = ${step}`],
            ],
            [
              ["Read the water", "读水面"],
              [`The water is ${marks} marks up:`, `水面在第 ${marks} 格：`],
              [`${times(marks, step)} = ${level}`],
            ],
          ],
          [
            `It is ${10 - marks} marks below the top, and $${max} - ${times(10 - marks, step)} = ${level}$.`,
            `离最上面还差 ${10 - marks} 格，$${max} - ${times(10 - marks, step)} = ${level}$。`,
          ],
          [
            [level + step, "That is one mark too high.", "多读了一格。"],
            [level - step, "That is one mark too low.", "少读了一格。"],
            [marks, `That counts the marks but forgets each one is worth ${step}.`, `这只数了格数，忘了每格表示 ${step}。`],
          ],
          beakerFigure(level, max, step, "L", 2),
        );
      },
      captioned(
        beakerFigure(35, 50, 5, "L", 2),
        "A measuring cup up to 50 liters with marks every 5 liters; the water is at 35.",
        "量杯到 50 升，每格 5 升；水面在 35。",
      ),
    ),
    earlyPoint(
      "adding-to-a-measure",
      ["Adding to a measure", "在读数的基础上增减"],
      [
        "A beaker holds 6 liters, and the top mark is 10. How much more fills it? Subtract what is there from the top: $10 - 6 = 4$ liters.\n\nCheck: $6 + 4 = 10$.\n\n> **Watch out.** Read the beaker first, then add or subtract. Adding 6 and 10 overfills it.",
        "量杯里有 6 升水，最上面的刻度是 10。还要多少才满？用最上面的刻度减去现在的数：$10 - 6 = 4$ 升。\n\n检验：$6 + 4 = 10$。\n\n> **注意。** 先读出量杯里的数，再加或减。把 6 和 10 相加就溢出来了。",
      ],
      (rng) => {
        const max = 10;
        const level = rng.int(2, 8);
        const form = rng.int(0, 2);
        const figure = beakerFigure(level, max, 1, "L", 2);
        const read: Walk = [
          ["Read the beaker", "读量杯"],
          [`The water is at ${level} liters.`, `水面在 ${level} 升。`],
        ];
        if (form === 0) {
          const more = rng.int(1, max - level);
          return solved(
            [
              `${more} more ${more === 1 ? "liter is" : "liters are"} poured into this beaker. How many liters are in it now?`,
              `再往这个量杯里倒 ${more} 升水。现在有多少升水？`,
            ],
            level + more,
            [read, [["Add", "相加"], ["Pouring in adds:", "倒进去要加："], [`${level} + ${more} = ${level + more}`]]],
            [`$${level + more} - ${more} = ${level}$.`, `$${level + more} - ${more} = ${level}$。`],
            [
              [Math.abs(level - more), "That subtracts. Pouring in adds.", "这是相减。倒进去要用加法。"],
              [level, "That is the amount before pouring.", "这是倒之前的量。"],
              [level + more + 1, "That is 1 liter too many.", "多了 1 升。"],
            ],
            figure,
          );
        }
        if (form === 1) {
          const out = rng.int(1, level - 1);
          return solved(
            [
              `${out} ${out === 1 ? "liter is" : "liters are"} poured out of this beaker. How many liters are left?`,
              `从这个量杯里倒出 ${out} 升水。还剩多少升水？`,
            ],
            level - out,
            [read, [["Subtract", "相减"], ["Pouring out takes away:", "倒出去要减："], [`${level} - ${out} = ${level - out}`]]],
            [`$${level - out} + ${out} = ${level}$.`, `$${level - out} + ${out} = ${level}$。`],
            [
              [level + out, "That adds. Pouring out takes away.", "这是相加。倒出去要用减法。"],
              [level, "That is the amount before pouring.", "这是倒之前的量。"],
              [out, "That is the amount poured out, not what is left.", "这是倒出的量，不是剩下的量。"],
            ],
            figure,
          );
        }
        return solved(
          ["How many more liters will fill this beaker up to the top mark?", "还要倒多少升水，才能到最上面的刻度？"],
          max - level,
          [
            read,
            [
              ["Subtract from the top", "用最上面的刻度减"],
              [`The top mark is ${max}:`, `最上面的刻度是 ${max}：`],
              [`${max} - ${level} = ${max - level}`],
            ],
          ],
          [`$${level} + ${max - level} = ${max}$.`, `$${level} + ${max - level} = ${max}$。`],
          [
            [level, "That is how much is in it now.", "这是现在有的量。"],
            [max, "That is the top mark, not how much more.", "这是最上面的刻度，不是还要多少。"],
            [max + level, "That adds. Subtract what is there from the top.", "这是相加。要用最上面的刻度减去现有的量。"],
          ],
          figure,
        );
      },
      captioned(
        beakerFigure(6, 10, 1, "L", 2),
        "A beaker up to 10 liters with water at 6: 4 more liters fill it.",
        "量杯到 10 升，水面在 6：再倒 4 升就满了。",
      ),
    ),
  ],
  [
    "A recipe needs 600 grams of flour. Max puts flour on a scale whose dial goes to 1000 grams with a mark every 100 grams. He stops when the needle points 6 marks from 0.\n\nCheck: $6 \\times 100 = 600$ grams.\n\nIn this lesson we read scales and beakers by working out what each mark is worth.",
    "一份食谱要 600 克面粉。Max 把面粉放在秤上，秤盘到 1000 克，每格 100 克。指针离 0 有 6 格时，他就停下来。\n\n检验：$6 \\times 100 = 600$ 克。\n\n本课我们算出每格表示多少，来读秤和量杯。",
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
        "A bar starts at 0 and ends halfway between 2 and 3 on a ruler marked in halves. It passes 2 whole inches and reaches the half mark, so it is $2\\frac{1}{2}$ inches long.\n\nCheck: it is longer than 2 inches and shorter than 3.\n\n> **Watch out.** Use the last whole inch it passes, 2. $3\\frac{1}{2}$ is past 3.",
        "一个长条从 0 开始，在标有半英寸的尺子上 2 和 3 的正中间结束。它过了 2 个整英寸，又到了中间的刻度，所以长 $2\\frac{1}{2}$ 英寸。\n\n检验：它比 2 英寸长，比 3 英寸短。\n\n> **注意。** 要用它过了的最后一个整英寸 2。$3\\frac{1}{2}$ 已经过了 3。",
      ],
      (rng) => {
        const w = rng.int(1, 5);
        const inches = rng.int(w + 1, 6);
        const answer = mx(w, 1, 2);
        return pickedMath(
          rng,
          ["How many inches long is the bar?", "这个长条长多少英寸？"],
          answer,
          rng.sample<MathWrong>(
            [
              [
                mx(w + 1, 1, 2),
                `That uses the next inch, ${w + 1}. The bar has not reached ${w + 1}.`,
                `这用了下一个整英寸 ${w + 1}。长条还没到 ${w + 1}。`,
              ],
              [mx(w, 1, 4), "The mark halfway between inches is a half, not a fourth.", "两个整英寸正中间的刻度是一半，不是四分之一。"],
              [`${w}`, "That leaves off the half inch past the last whole inch.", "这漏掉了最后一个整英寸后面的半英寸。"],
              [`${w + 1}`, `The bar stops halfway, before ${w + 1}.`, `长条在中间就停了，没到 ${w + 1}。`],
            ],
            3,
          ),
          [
            [
              ["Whole inches", "整英寸"],
              [`The bar passes ${w} whole ${w === 1 ? "inch" : "inches"}.`, `长条过了 ${w} 个整英寸。`],
            ],
            [
              ["The extra part", "多出的部分"],
              [`It ends at the half mark, so it is $${answer}$ inches.`, `它在中间的刻度结束，所以是 $${answer}$ 英寸。`],
            ],
          ],
          [`$${answer}$ is between ${w} and ${w + 1}, where the bar ends.`, `$${answer}$ 在 ${w} 和 ${w + 1} 之间，正是长条结束的地方。`],
          inchRulerFigure(4 * w + 2, inches, 2),
        );
      },
      captioned(
        inchRulerFigure(10, 3, 2),
        "A ruler marked in halves; the bar ends halfway between 2 and 3.",
        "标有半英寸的尺子；长条在 2 和 3 的正中间结束。",
      ),
    ),
    earlyPoint(
      "to-the-nearest-fourth-inch",
      ["To the nearest fourth of an inch", "量到四分之一英寸"],
      [
        "Each inch on this ruler has 4 spaces. A bar ends 3 spaces past 1, so it is $1\\frac{3}{4}$ inches long.\n\nCheck: it is 1 space short of 2, and $2 - \\frac{1}{4} = 1\\frac{3}{4}$.\n\n> **Watch out.** Count spaces after the last whole inch, not marks. Counting the mark at 1 gives one too many.",
        "这把尺子每英寸有 4 格。长条在 1 后面 3 格处结束，所以长 $1\\frac{3}{4}$ 英寸。\n\n检验：它离 2 还差 1 格，$2 - \\frac{1}{4} = 1\\frac{3}{4}$。\n\n> **注意。** 要从最后一个整英寸往后数格子，不是数刻度。把 1 处的刻度也数上就多了一个。",
      ],
      (rng) => {
        const w = rng.int(0, 4);
        const r = rng.pick([1, 3]);
        const inches = rng.int(Math.max(w + 1, 3), 5);
        const answer = mx(w, r, 4);
        return pickedMath(
          rng,
          ["How many inches long is the bar?", "这个长条长多少英寸？"],
          answer,
          rng.sample<MathWrong>(
            [
              [
                mx(w, 4 - r, 4),
                `That counts the spaces still to go to ${w + 1}. Count the spaces past ${w}.`,
                `这数的是到 ${w + 1} 还差的格数。要数 ${w} 后面的格数。`,
              ],
              [mx(w + 1, r, 4), "That is one whole inch too many.", "多了一个整英寸。"],
              [
                mx(w, 1, 2),
                `That is the half mark, but the bar is ${r} ${r === 1 ? "space" : "spaces"} past ${w}.`,
                `这是中间的刻度，可是长条在 ${w} 后面 ${r} 格。`,
              ],
              [
                mx(w, r, 8),
                "Each inch has 4 spaces, so the parts are fourths, not eighths.",
                "每英寸有 4 格，所以是四分之几，不是八分之几。",
              ],
            ],
            3,
          ),
          [
            [
              ["Whole inches", "整英寸"],
              [`The last whole inch the bar passes is ${w}.`, `长条过了的最后一个整英寸是 ${w}。`],
            ],
            [
              ["Count the spaces", "数格子"],
              [
                `It ends ${r} ${r === 1 ? "space" : "spaces"} past ${w}, and each space is $${fr(1, 4)}$ inch: $${answer}$.`,
                `它在 ${w} 后面 ${r} 格结束，每格 $${fr(1, 4)}$ 英寸：$${answer}$。`,
              ],
            ],
          ],
          [
            `The bar is ${4 - r} ${4 - r === 1 ? "space" : "spaces"} short of ${w + 1}, which agrees.`,
            `长条离 ${w + 1} 还差 ${4 - r} 格，相符。`,
          ],
          inchRulerFigure(4 * w + r, inches, 4),
        );
      },
      captioned(
        inchRulerFigure(7, 3, 4),
        "A ruler marked in fourths; the bar ends 3 spaces past 1.",
        "标有四分之一英寸的尺子；长条在 1 后面 3 格处结束。",
      ),
    ),
    earlyPoint(
      "how-many-fourths-in-all",
      ["How many fourths in all", "一共有几个四分之一"],
      [
        "A bar is 2 inches and 1 space long on a ruler marked in fourths. Each inch has 4 spaces, so 2 inches are $2 \\times 4 = 8$ spaces. With 1 more, the bar is 9 spaces long.\n\nCheck: count every space from 0: 1, 2, …, 9.\n\n> **Watch out.** Each inch is 4 spaces, not 1. $2 + 1 = 3$ is wrong.",
        "在标有四分之一英寸的尺子上，一个长条长 2 英寸多 1 格。每英寸有 4 格，所以 2 英寸是 $2 \\times 4 = 8$ 格。再加 1 格，长条有 9 格长。\n\n检验：从 0 开始一格一格地数：1、2、……、9。\n\n> **注意。** 每英寸是 4 格，不是 1 格。$2 + 1 = 3$ 是错的。",
      ],
      (rng) => {
        const w = rng.int(1, 4);
        const r = rng.int(1, 3);
        const inches = rng.int(Math.max(w + 1, 3), 5);
        const total = 4 * w + r;
        return solved(
          [
            `Each space on this ruler is $${fr(1, 4)}$ of an inch. How many of these spaces long is the bar?`,
            `尺子上每格是 $${fr(1, 4)}$ 英寸。这个长条有多少格长？`,
          ],
          total,
          [
            [
              ["Whole inches", "整英寸"],
              [`${w} whole ${w === 1 ? "inch has" : "inches have"} 4 spaces each:`, `${w} 个整英寸，每英寸 4 格：`],
              [`${times(w, 4)} = ${4 * w}`],
            ],
            [
              ["Add the extra spaces", "加上多出的格"],
              [`${r} more ${r === 1 ? "space" : "spaces"}:`, `再加 ${r} 格：`],
              [`${4 * w} + ${r} = ${total}`],
            ],
          ],
          [
            `$${fr(total, 4)} = ${mx(w, r, 4)}$ inches, which is where the bar ends.`,
            `$${fr(total, 4)} = ${mx(w, r, 4)}$ 英寸，正是长条结束的地方。`,
          ],
          [
            [w + r, "That counts each inch as 1 space. Each inch is 4 spaces.", "这把每英寸当成了 1 格。每英寸是 4 格。"],
            [total + 4, "That is one inch too many.", "多了一英寸。"],
            [total + 1, "That counts marks, including the one at 0.", "这是数刻度，把 0 也数进去了。"],
          ],
          inchRulerFigure(total, inches, 4),
        );
      },
      captioned(
        inchRulerFigure(9, 3, 4),
        "A ruler marked in fourths; the bar ends 1 space past 2, which is 9 spaces from 0.",
        "标有四分之一英寸的尺子；长条在 2 后面 1 格处结束，离 0 有 9 格。",
      ),
    ),
  ],
  [
    "Lucy measures a pencil with a ruler marked in fourths. It passes 4 inches and goes 1 more space, so it is $4\\frac{1}{4}$ inches long.\n\nCheck: it is between 4 and $4\\frac{1}{2}$ inches.\n\nIn this lesson we read rulers marked in halves and fourths of an inch.",
    "Lucy 用标有四分之一英寸的尺子量一支铅笔。铅笔过了 4 英寸，又多 1 格，所以长 $4\\frac{1}{4}$ 英寸。\n\n检验：它在 4 英寸和 $4\\frac{1}{2}$ 英寸之间。\n\n本课我们读标有半英寸和四分之一英寸的尺子。",
  ],
);

/** halfDots picks the row values of a picture graph in whole and half symbols. */
function halfDots(rng: Rng, rows: number): number[] {
  return [...Array(rows).keys()].map(() => rng.int(1, 6) + rng.pick([0, 0.5]));
}

/** circles writes a count of whole and half circles, such as 3½. */
const circles = (v: number): string => `${Math.floor(v)}${v % 1 !== 0 ? "½" : ""}`;

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
          "The key says a whole circle stands for 10 books. Half a circle stands for half of that: $10 \\div 2 = 5$ books.\n\nCheck: two half circles make a whole, and $5 + 5 = 10$.\n\n> **Watch out.** A half circle is not 1 book and not 10 books. It is half of the key.",
          "图例说一个完整的圆表示 10 本书。半个圆表示它的一半：$10 \\div 2 = 5$ 本。\n\n检验：两个半圆合成一个圆，$5 + 5 = 10$。\n\n> **注意。** 半个圆不是 1 本，也不是 10 本，而是图例的一半。",
        ],
        (rng) => {
          const per = rng.pick([2, 4, 6, 8, 10, 20]);
          const rowCount = rng.int(2, 3);
          const labels = ["A", "B", "C"].slice(0, rowCount);
          return solved(
            [
              `In this graph, each whole circle stands for ${per} books. How many books does a half circle stand for?`,
              `在这张图中，一个完整的圆表示 ${per} 本书。半个圆表示多少本书？`,
            ],
            per / 2,
            [
              [
                ["Read the key", "读图例"],
                [`A whole circle is ${per} books.`, `一个完整的圆是 ${per} 本书。`],
              ],
              [["Take half", "取一半"], ["A half circle is half of that:", "半个圆是它的一半："], [`${div(per, 2)} = ${per / 2}`]],
            ],
            [
              `Two half circles make a whole: $${per / 2} + ${per / 2} = ${per}$.`,
              `两个半圆合成一个圆：$${per / 2} + ${per / 2} = ${per}$。`,
            ],
            [
              [per, "That is a whole circle, not a half.", "这是一整个圆，不是半个。"],
              [2 * per, "That doubles the key instead of halving it.", "这是把图例翻倍，不是取一半。"],
              [per - 1, "That takes away 1 instead of taking half.", "这是减 1，不是取一半。"],
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
          "A row has 3 and a half circles, and each whole circle is 4. The 3 whole circles are $3 \\times 4 = 12$. The half circle is half of 4, which is 2. So the row shows $12 + 2 = 14$.\n\nCheck: 4 whole circles would be 16, and the row is half a circle less: $16 - 2 = 14$.\n\n> **Watch out.** The half circle is worth 2, not 4. Counting it as a whole gives 16.",
          "一行有 3½ 个圆，每个完整的圆表示 4。3 个完整的圆是 $3 \\times 4 = 12$。半个圆是 4 的一半，就是 2。所以这一行表示 $12 + 2 = 14$。\n\n检验：4 个完整的圆是 16，这一行少半个圆：$16 - 2 = 14$。\n\n> **注意。** 半个圆是 2，不是 4。把它当成一整个圆就得 16。",
        ],
        (rng) => {
          const per = rng.pick([2, 4, 6, 10]);
          const labels = ["A", "B", "C"];
          const dots = halfDots(rng, 3);
          dots[rng.int(0, 2)] = rng.int(1, 5) + 0.5;
          const half = dots.findIndex((v) => v % 1 !== 0);
          const value = dots[half] as number;
          const w = Math.floor(value);
          const answer = value * per;
          return solved(
            [
              `Each whole circle stands for ${per} stickers. How many stickers does row ${labels[half]} show?`,
              `一个完整的圆表示 ${per} 张贴纸。${labels[half]} 这一行表示多少张贴纸？`,
            ],
            answer,
            [
              [
                ["Whole circles", "完整的圆"],
                [`Row ${labels[half]} has ${w} whole ${w === 1 ? "circle" : "circles"}:`, `${labels[half]} 这一行有 ${w} 个完整的圆：`],
                [`${times(w, per)} = ${w * per}`],
              ],
              [
                ["Add the half", "加上半个圆"],
                [`The half circle is ${per / 2}:`, `半个圆是 ${per / 2}：`],
                [`${w * per} + ${per / 2} = ${answer}`],
              ],
            ],
            [
              `${w + 1} whole circles would be ${(w + 1) * per}, and half a circle less is $${(w + 1) * per} - ${per / 2} = ${answer}$.`,
              `${w + 1} 个完整的圆是 ${(w + 1) * per}，少半个圆是 $${(w + 1) * per} - ${per / 2} = ${answer}$。`,
            ],
            [
              [(w + 1) * per, "That counts the half circle as a whole one.", "这把半个圆当成了一整个圆。"],
              [w * per, "That leaves out the half circle.", "这漏掉了半个圆。"],
              [w + 1, "That counts the circles but forgets what each stands for.", "这只数了圆的个数，忘了每个圆表示多少。"],
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
          "One row has 3½ circles and another has 2, with each circle worth 4. The first row has 1½ more circles. 1 circle is 4 and half a circle is 2, so it has $4 + 2 = 6$ more.\n\nCheck: the rows show 14 and 8, and $14 - 8 = 6$.\n\n> **Watch out.** 1½ is the number of extra circles, not the answer. Turn the circles into votes.",
          "一行有 3½ 个圆，另一行有 2 个圆，每个圆表示 4。第一行多 1½ 个圆。1 个圆是 4，半个圆是 2，所以多 $4 + 2 = 6$。\n\n检验：两行分别表示 14 和 8，$14 - 8 = 6$。\n\n> **注意。** 1½ 是多出的圆的个数，不是答案。要把圆换算成票数。",
        ],
        (rng) => {
          const per = rng.pick([2, 4, 6, 10]);
          const labels = ["A", "B", "C"];
          const dots = halfDots(rng, 3);
          const [i, j] = rng.sample([0, 1, 2], 2) as [number, number];
          dots[i] = (dots[j] as number) + rng.int(1, 3) + 0.5;
          const big = dots[i] as number;
          const small = dots[j] as number;
          const extra = big - small;
          const answer = extra * per;
          const more = circles(extra);
          return solved(
            [
              `Each whole circle stands for ${per} votes. How many more votes does row ${labels[i]} have than row ${labels[j]}?`,
              `一个完整的圆表示 ${per} 票。${labels[i]} 这一行比 ${labels[j]} 这一行多多少票？`,
            ],
            answer,
            [
              [
                ["Count the extra circles", "数多出的圆"],
                [
                  `Row ${labels[i]} has ${more} more circles than row ${labels[j]}.`,
                  `${labels[i]} 这一行比 ${labels[j]} 这一行多 ${more} 个圆。`,
                ],
              ],
              [
                ["Turn them into votes", "换算成票数"],
                [`Each whole circle is ${per} and a half is ${per / 2}:`, `每个完整的圆是 ${per}，半个圆是 ${per / 2}：`],
                [`${times(Math.floor(extra), per)} + ${per / 2} = ${answer}`],
              ],
            ],
            [
              `Row ${labels[i]} is ${big * per} and row ${labels[j]} is ${small * per}, and $${big * per} - ${small * per} = ${answer}$.`,
              `${labels[i]} 这一行是 ${big * per}，${labels[j]} 这一行是 ${small * per}，$${big * per} - ${small * per} = ${answer}$。`,
            ],
            [
              [Math.ceil(extra), "That counts the extra circles, not the votes they stand for.", "这只数了多出的圆，没有换算成票数。"],
              [big * per, `That is all of row ${labels[i]}, not how many more.`, `这是 ${labels[i]} 这一行的全部票数，不是多出的。`],
              [small * per, `That is all of row ${labels[j]}, not how many more.`, `这是 ${labels[j]} 这一行的全部票数，不是多出的。`],
              [answer + per / 2, "That counts the half circle as a whole one.", "这把半个圆当成了一整个圆。"],
            ],
            halfPictureGraphFigure(labels, dots),
          );
        },
      ),
      figure: gradeDrawings2["picture-graphs-with-half-symbols#comparing-rows-with-halves"],
    },
  ],
  [
    "In a class picture graph, each smiley face stands for 2 children. The row for apples has 4 and a half faces. 4 faces are 8 children, and the half face is 1 more child, so 9 children like apples.\n\nCheck: 5 whole faces would be 10, one child more than 9.\n\nIn this lesson we read picture graphs where half a symbol stands for half of the key.",
    "在班级的象形统计图中，每个笑脸表示 2 个孩子。苹果这一行有 4½ 个笑脸。4 个笑脸是 8 个孩子，半个笑脸再多 1 个孩子，所以有 9 个孩子喜欢苹果。\n\n检验：5 个完整的笑脸是 10，比 9 多 1 个孩子。\n\n本课我们读半个图案表示图例一半的象形统计图。",
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
          "The numbers 15, 35 and 25 are all multiples of 5, so a scale that counts by fives fits them: the bars are 3, 7 and 5 spaces tall.\n\nCheck: $35 \\div 5 = 7$ spaces, a good height for a graph.\n\n> **Watch out.** Counting by 1s would need 35 spaces, far too tall. Counting by 100s would make every bar tiny.",
          "15、35 和 25 都是 5 的倍数，所以按 5 增加的刻度正合适：三个条分别高 3、7、5 格。\n\n检验：$35 \\div 5 = 7$ 格，图的高度正好。\n\n> **注意。** 按 1 增加要画 35 格，太高了。按 100 增加，每个条都很矮。",
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
          const top = Math.max(...data);
          const others = options.filter((o) => o !== best);
          const why = (o: { step: number }): [string, string] => {
            if (o.step < best.step)
              return [
                `Counting by ${o.step}s, the bar for ${top} would be ${top / o.step} spaces tall, far too tall.`,
                `按 ${o.step} 增加，${top} 的条要画 ${top / o.step} 格，太高了。`,
              ];
            const odd = data.find((v) => v % o.step !== 0);
            return odd === undefined
              ? [`Counting by ${o.step}s, every bar would be tiny and hard to read.`, `按 ${o.step} 增加，每个条都很矮，很难读。`]
              : [
                  `${odd} is not a multiple of ${o.step}, so its bar would stop between marks and the bars would be tiny.`,
                  `${odd} 不是 ${o.step} 的倍数，它的条会停在两个刻度之间，而且条都很矮。`,
                ];
          };
          return picked(
            rng,
            [
              `These numbers go on a bar graph: ${data.join(", ")}. Which scale is the best choice?`,
              `要把这些数画成条形图：${data.join("、")}。哪种刻度最合适？`,
            ],
            best.say,
            rng.sample(others, 3).map((o): Wrong => [o.say, ...why(o)]),
            [
              [
                ["Look for a common step", "找共同的倍数"],
                [`All of the numbers are multiples of ${best.step}.`, `这些数都是 ${best.step} 的倍数。`],
              ],
              [
                ["Check the height", "看高度"],
                [`The tallest bar, ${top}, would be:`, `最高的条 ${top} 要画：`],
                [`${div(top, best.step)} = ${top / best.step}`],
              ],
            ],
            [
              `${top / best.step} spaces is a good height, and every bar ends on a mark.`,
              `${top / best.step} 格高度正好，每个条都停在刻度上。`,
            ],
            tableFigure(["A", "B", "C", "D"], data),
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
          "A scale counts by fives. How many spaces tall is a bar for 35? Each space is 5, so divide: $35 \\div 5 = 7$ spaces.\n\nCheck: count by fives 7 times: 5, 10, 15, 20, 25, 30, 35.\n\n> **Watch out.** The bar is not 35 spaces tall. Each space stands for 5.",
          "刻度按 5 增加。表示 35 的条要画多少格高？每格是 5，所以用除法：$35 \\div 5 = 7$ 格。\n\n检验：五个五个地数 7 次：5、10、15、20、25、30、35。\n\n> **注意。** 这个条不是 35 格高。每格表示 5。",
        ],
        (rng) => {
          const step = rng.pick([2, 5, 10, 20]);
          const spaces = rng.int(2, 9);
          const value = step * spaces;
          return solved(
            [
              `A bar graph's scale counts by ${step}s. How many spaces tall should a bar for ${value} be?`,
              `条形图的刻度按 ${step} 增加。表示 ${value} 的条应该画多少格高？`,
            ],
            spaces,
            [
              [
                ["One space", "每格"],
                [`Each space stands for ${step}.`, `每格表示 ${step}。`],
              ],
              [
                ["Divide", "相除"],
                [`How many ${step}s make ${value}:`, `${value} 里有几个 ${step}：`],
                [`${div(value, step)} = ${spaces}`],
              ],
            ],
            [
              `Count by ${step}s ${spaces} times: ${Array.from({ length: spaces }, (_, k) => step * (k + 1)).join(", ")}.`,
              `${step} 个 ${step} 个地数 ${spaces} 次：${Array.from({ length: spaces }, (_, k) => step * (k + 1)).join("、")}。`,
            ],
            [
              [value, `That is the value, but each space stands for ${step}.`, `这是数值本身，可是每格表示 ${step}。`],
              [value + step, `That is the value plus one step, not the number of spaces.`, `这是数值再加一格，不是格数。`],
              [spaces + 1, "That is one space too tall.", "多画了一格。"],
            ],
            barGraphFigure(["A"], [value], step),
          );
        },
      ),
      figure: gradeDrawings2["choosing-a-scale-and-drawing-bars#how-many-spaces-tall"],
    },
    earlyPoint(
      "reading-a-bar-between-marks",
      ["Reading a bar between marks", "读两个刻度之间的条"],
      [
        "On a scale counting by 10s, a bar stops halfway between 30 and 40. Halfway between them is 5 more than 30, so the bar shows 35.\n\nCheck: 35 is 5 less than 40, also halfway.\n\n> **Watch out.** Do not read the mark below or above. The bar is between them.",
        "在按 10 增加的刻度上，一个条停在 30 和 40 的正中间。正中间比 30 多 5，所以这个条表示 35。\n\n检验：35 比 40 少 5，也在正中间。\n\n> **注意。** 不要读下面或上面的刻度。这个条在它们之间。",
      ],
      (rng) => {
        const step = rng.pick([2, 10, 20]);
        const labels = ["A", "B", "C"];
        const at = rng.int(0, 2);
        const values = labels.map(() => step * rng.int(1, 6));
        const asked = (values[at] as number) + step / 2;
        values[at] = asked;
        const low = asked - step / 2;
        const high = asked + step / 2;
        return solved(
          [`What number does bar ${labels[at]} show?`, `${labels[at]} 这个条表示什么数？`],
          asked,
          [
            [
              ["Find the marks", "找刻度"],
              [`Bar ${labels[at]} stops halfway between ${low} and ${high}.`, `${labels[at]} 这个条停在 ${low} 和 ${high} 的正中间。`],
            ],
            [
              ["Take half a step", "加半格"],
              [`Half of ${step} is ${step / 2}:`, `${step} 的一半是 ${step / 2}：`],
              [`${low} + ${step / 2} = ${asked}`],
            ],
          ],
          [`$${high} - ${step / 2} = ${asked}$ as well.`, `$${high} - ${step / 2} = ${asked}$，也一样。`],
          [
            [low, "That is the mark below the top of the bar.", "这是条顶下面的刻度。"],
            [high, "That is the mark above the top of the bar.", "这是条顶上面的刻度。"],
            [asked + step, "That is one whole step too high.", "多了一整格。"],
          ],
          barGraphFigure(labels, values, step),
        );
      },
      captioned(
        barGraphFigure(["A", "B", "C"], [20, 35, 50], 10),
        "A bar graph counting by 10s; bar B stops halfway between 30 and 40.",
        "按 10 增加的条形图；B 条停在 30 和 40 的正中间。",
      ),
    ),
  ],
  [
    "Ana asks her class about pets and gets 15, 35 and 25. Counting by 1s, the graph would be 35 spaces tall. She counts by 5s instead, so the tallest bar is 7 spaces.\n\nCheck: $7 \\times 5 = 35$.\n\nIn this lesson we choose a scale for a bar graph and work out how tall each bar is.",
    "Ana 调查全班养的宠物，得到 15、35 和 25。按 1 增加，图要画 35 格高。她改成按 5 增加，最高的条就是 7 格。\n\n检验：$7 \\times 5 = 35$。\n\n本课我们为条形图选择刻度，并算出每个条有多高。",
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

/** samplePlot is the line plot the explanations of fractionLinePlots describe: 1 to 2 inches in fourths. */
const samplePlot = [4, 4, 5, 5, 5, 6, 7, 7, 8];

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
        "A line plot of leaf lengths runs from 1 to 2 inches in fourths. Each dot is one leaf. Above $1\\frac{1}{4}$ there are 3 dots, so 3 leaves are $1\\frac{1}{4}$ inches long.\n\nCheck: count the dots in that stack again: 1, 2, 3.\n\n> **Watch out.** Count only the stack above that mark, not every dot on the plot.",
        "一张树叶长度的线图，从 1 英寸到 2 英寸，每格四分之一英寸。每个点表示一片树叶。$1\\frac{1}{4}$ 上面有 3 个点，所以有 3 片树叶长 $1\\frac{1}{4}$ 英寸。\n\n检验：把这一摞点再数一遍：1、2、3。\n\n> **注意。** 只数这个刻度上面的那一摞，不要数图上所有的点。",
      ],
      (rng) => {
        const lo = 4 * rng.int(1, 4);
        const step = rng.pick([1, 2]);
        const { ticks, counts, values } = plotValues(rng, lo, step);
        const i = rng.int(0, 4);
        const v = ticks[i] as number;
        const n = counts[i] as number;
        return solved(
          [
            `This line plot shows the lengths of some leaves, in inches. How many leaves are $${fourthsMath(v)}$ inches long?`,
            `这张线图表示一些树叶的长度，单位是英寸。长 $${fourthsMath(v)}$ 英寸的树叶有多少片？`,
          ],
          n,
          [
            [
              ["Find the mark", "找刻度"],
              [`Find $${fourthsMath(v)}$ on the line.`, `在数轴上找到 $${fourthsMath(v)}$。`],
            ],
            [
              ["Count its dots", "数点"],
              [`Each dot is one leaf, and there ${n === 1 ? "is" : "are"} ${n} above it.`, `每个点表示一片树叶，它上面有 ${n} 个点。`],
            ],
          ],
          [
            `All the stacks together make ${values.length} leaves, and this stack is ${n} of them.`,
            `所有的点一共 ${values.length} 片树叶，这一摞是其中的 ${n} 片。`,
          ],
          [
            [n + 1, "That counts one dot too many.", "多数了一个点。"],
            [values.length, "That counts every dot on the plot, not just that stack.", "这数了图上所有的点，不只是这一摞。"],
            [
              n === 0 ? 2 : n - 1,
              n === 0 ? "There are no dots above that mark." : "That counts one dot too few.",
              n === 0 ? "这个刻度上面没有点。" : "少数了一个点。",
            ],
          ],
          fractionLinePlotFigure(values, lo, lo + 4 * step, step),
        );
      },
      captioned(
        fractionLinePlotFigure(samplePlot, 4, 8, 1),
        "A line plot from 1 to 2 inches in fourths, with 3 dots above one and one fourth.",
        "从 1 英寸到 2 英寸、每格四分之一英寸的线图，一又四分之一上面有 3 个点。",
      ),
    ),
    earlyPoint(
      "more-or-less-than-a-length",
      ["More or less than a length", "比某个长度长或短"],
      [
        "On the plot, how many leaves are longer than $1\\frac{1}{2}$ inches? Add the dots to the right of that mark: 2 above $1\\frac{3}{4}$ and 1 above 2 make 3.\n\nCheck: there are 9 leaves in all. $2 + 3 + 1 = 6$ are not longer, and $6 + 3 = 9$.\n\n> **Watch out.** Do not count the dots above $1\\frac{1}{2}$ itself. Those leaves are exactly that long.",
        "在线图上，比 $1\\frac{1}{2}$ 英寸长的树叶有多少片？把这个刻度右边的点加起来：$1\\frac{3}{4}$ 上面 2 个，2 上面 1 个，一共 3 个。\n\n检验：一共 9 片树叶，不比它长的有 $2 + 3 + 1 = 6$ 片，$6 + 3 = 9$。\n\n> **注意。** $1\\frac{1}{2}$ 上面的点不算。那些树叶正好这么长。",
      ],
      (rng) => {
        const lo = 4 * rng.int(1, 4);
        const step = rng.pick([1, 2]);
        const { ticks, counts, values } = plotValues(rng, lo, step);
        const i = rng.int(1, 3);
        const v = ticks[i] as number;
        const longer = rng.bool();
        const side = values.filter((x) => (longer ? x > v : x < v));
        const answer = side.length;
        const atMark = counts[i] as number;
        const stacks = ticks
          .map((x, k) => [x, counts[k] as number] as const)
          .filter(([x, c]) => c > 0 && (longer ? x > v : x < v))
          .map(([, c]) => c);
        return solved(
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
          [
            [
              ["Choose a side", "选一边"],
              [
                `${longer ? "Longer" : "Shorter"} lengths are to the ${longer ? "right" : "left"} of $${fourthsMath(v)}$; the dots above it do not count.`,
                `比它${longer ? "长" : "短"}的在 $${fourthsMath(v)}$ 的${longer ? "右" : "左"}边；它上面的点不算。`,
              ],
            ],
            [
              ["Add the stacks", "把几摞加起来"],
              ["The dots on that side:", "那一边的点："],
              [stacks.length === 0 ? "0" : `${stacks.join(" + ")} = ${answer}`],
            ],
          ],
          [
            `The other dots are ${values.length - answer}, and $${answer} + ${values.length - answer} = ${values.length}$, every pencil.`,
            `其余的点有 ${values.length - answer} 个，$${answer} + ${values.length - answer} = ${values.length}$，正是所有的铅笔。`,
          ],
          [
            [
              atMark === 0 ? answer + 1 : answer + atMark,
              atMark === 0 ? "That counts one dot too many." : `That also counts the ${atMark} dots above $${fourthsMath(v)}$ itself.`,
              atMark === 0 ? "多数了一个点。" : `这把 $${fourthsMath(v)}$ 上面的 ${atMark} 个点也算进去了。`,
            ],
            [values.length, "That counts every dot on the plot.", "这数了图上所有的点。"],
            [values.length - answer, `That counts the dots on the other side and at the mark.`, `这数的是另一边和刻度上的点。`],
          ],
          fractionLinePlotFigure(values, lo, lo + 4 * step, step),
        );
      },
      captioned(
        fractionLinePlotFigure(samplePlot, 4, 8, 1),
        "The same leaf plot: 3 dots lie to the right of one and a half.",
        "同一张树叶线图：一又二分之一右边有 3 个点。",
      ),
    ),
    earlyPoint(
      "the-most-common-length",
      ["The most common length", "最常见的长度"],
      [
        "The most common length has the tallest stack of dots. On the leaf plot the tallest stack, 3 dots, is above $1\\frac{1}{4}$, so the most common length is $1\\frac{1}{4}$ inches.\n\nCheck: every other stack has fewer than 3 dots.\n\n> **Watch out.** The longest length, 2 inches, is farthest right. That is not the most common.",
        "最常见的长度，上面的点摞得最高。在树叶线图上，最高的一摞有 3 个点，在 $1\\frac{1}{4}$ 上面，所以最常见的长度是 $1\\frac{1}{4}$ 英寸。\n\n检验：其他每一摞都不到 3 个点。\n\n> **注意。** 最长的长度 2 英寸在最右边，那不是最常见的。",
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
        return pickedMath(
          rng,
          ["Which length is the most common on this line plot?", "这张线图上，哪个长度最常见？"],
          answer,
          ticks
            .map((v, i) => [v, i] as const)
            .filter(([, i]) => i !== top)
            .map(
              ([v, i]): MathWrong =>
                i === 4
                  ? [
                      fourthsMath(v),
                      "That is the longest length, farthest right, not the most common.",
                      "这是最长的长度，在最右边，不是最常见的。",
                    ]
                  : [
                      fourthsMath(v),
                      `Only ${counts[i]} ${counts[i] === 1 ? "dot is" : "dots are"} above it, fewer than 5.`,
                      `它上面只有 ${counts[i]} 个点，比 5 个少。`,
                    ],
            ),
          [
            [
              ["Find the tallest stack", "找最高的一摞"],
              [`The tallest stack has ${counts[top]} dots.`, `最高的一摞有 ${counts[top]} 个点。`],
            ],
            [
              ["Read its length", "读它的长度"],
              [`It is above $${answer}$.`, `它在 $${answer}$ 的上面。`],
            ],
          ],
          [`Every other stack has at most 4 dots.`, `其他每一摞最多 4 个点。`],
          fractionLinePlotFigure(values, lo, lo + 4 * step, step),
        );
      },
      captioned(
        fractionLinePlotFigure(samplePlot, 4, 8, 1),
        "The leaf plot: the tallest stack, 3 dots, is above one and one fourth.",
        "树叶线图：最高的一摞有 3 个点，在一又四分之一上面。",
      ),
    ),
  ],
  [
    "Leo measures 9 leaves to the nearest fourth of an inch. He puts a dot above each length on a line from 1 to 2 inches. The stack above $1\\frac{1}{4}$ is tallest, with 3 dots.\n\nCheck: all the dots together make 9, one for each leaf.\n\nIn this lesson we read line plots of lengths in halves and fourths of an inch.",
    "Leo 量了 9 片树叶，量到四分之一英寸。他在从 1 到 2 英寸的数轴上，每个长度上面画一个点。$1\\frac{1}{4}$ 上面的一摞最高，有 3 个点。\n\n检验：所有的点合起来是 9 个，每片树叶一个。\n\n本课我们读以半英寸和四分之一英寸为单位的长度线图。",
  ],
);

/** twoRectanglesFigure draws two rectangles side by side to the same scale, with their side lengths. */
function twoRectanglesFigure(w1: number, h1: number, w2: number, h2: number): Figure {
  const u = Math.min(120 / Math.max(w1, w2), 90 / Math.max(h1, h2));
  const label = (x: number, y: number, s: number) =>
    `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" stroke="none" fill="currentColor" font-size="12">${s}</text>`;
  let body = "";
  [
    [w1, h1, 30],
    [w2, h2, 180],
  ].forEach(([w = 0, h = 0, x = 0]) => {
    body += `<rect x="${x}" y="8" width="${(w * u).toFixed(1)}" height="${(h * u).toFixed(1)}" class="accent" fill="currentColor" fill-opacity="0.15"/>`;
    body += `<rect x="${x}" y="8" width="${(w * u).toFixed(1)}" height="${(h * u).toFixed(1)}"/>`;
    body += label(x + (w * u) / 2, 8 + h * u + 16, w) + label(x - 12, 8 + (h * u) / 2 + 4, h);
  });
  return {
    svg: svgDocument(Math.max(h1, h2) * u + 30, body),
    alt: t(
      `A rectangle ${w1} by ${h1} beside a rectangle ${w2} by ${h2}.`,
      `一个 ${w1} 乘 ${h1} 的长方形，旁边是一个 ${w2} 乘 ${h2} 的长方形。`,
    ),
  };
}

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
        "A floor is 6 meters long and 4 meters wide. Covering it is about area, so multiply: $6 \\times 4 = 24$ square meters.\n\nCheck: 4 rows of 6 one-meter squares: $6 + 6 + 6 + 6 = 24$.\n\n> **Watch out.** Do not add the sides. $6 + 4 = 10$ is not an area.",
        "一块地面长 6 米、宽 4 米。铺满它说的是面积，所以用乘法：$6 \\times 4 = 24$ 平方米。\n\n检验：4 行，每行 6 块 1 米的方块：$6 + 6 + 6 + 6 = 24$。\n\n> **注意。** 不要把两条边相加。$6 + 4 = 10$ 不是面积。",
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
        return solved(
          [
            `A ${room[0]} floor is ${w} meters long and ${h} meters wide. How many square meters is its area?`,
            `${room[1]}的地面长 ${w} 米，宽 ${h} 米。它的面积是多少平方米？`,
          ],
          w * h,
          [
            [
              ["Think of squares", "想成方块"],
              [`The floor holds ${h} rows of ${w} one-meter squares.`, `地面可以铺 ${h} 行，每行 ${w} 块 1 米的方块。`],
            ],
            [["Multiply", "相乘"], ["Area:", "面积："], [`${times(w, h)} = ${w * h}`]],
          ],
          [`$${times(h, w)} = ${w * h}$ in the other order.`, `换个顺序 $${times(h, w)} = ${w * h}$。`],
          [
            [w + h, "That adds the two sides. Area comes from multiplying.", "这是把两条边相加。面积要用乘法。"],
            [2 * (w + h), "That is the distance around, the perimeter, not the area.", "这是周长，不是面积。"],
            [w * h + h, "That is one row of squares too many.", "多算了一列方块。"],
          ],
          labeledRectangleFigure(w, h, "m"),
        );
      },
      captioned(
        gridFigure(4, 6),
        "A floor 6 meters by 4 meters covered by 4 rows of 6 one-meter squares.",
        "6 米乘 4 米的地面，铺了 4 行，每行 6 块 1 米的方块。",
      ),
    ),
    {
      ...earlyPoint(
        "finding-a-missing-side-from-area",
        ["Finding a missing side from area", "由面积求边长"],
        [
          "A rug has an area of 42 square feet and one side of 7 feet. The other side times 7 makes 42, so it is $42 \\div 7 = 6$ feet.\n\nCheck: $7 \\times 6 = 42$.\n\n> **Watch out.** Divide, do not subtract. $42 - 7 = 35$ feet would make a huge rug.",
          "一块地毯面积是 42 平方英尺，一条边长 7 英尺。另一条边乘 7 等于 42，所以是 $42 \\div 7 = 6$ 英尺。\n\n检验：$7 \\times 6 = 42$。\n\n> **注意。** 要用除法，不是减法。$42 - 7 = 35$ 英尺，那地毯就太大了。",
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
          return solved(
            [
              `A rectangular ${thing[0]} has an area of ${area} square ${measure[0]}. One side is ${w} ${measure[0]} long. How many ${measure[0]} long is the other side?`,
              `一个长方形的${thing[1]}，面积是 ${area} 平方${measure[1]}，一条边长 ${w} ${measure[1]}。另一条边长多少${measure[1]}？`,
            ],
            h,
            [
              [
                ["Ask the question", "想一想"],
                [`What number times ${w} makes ${area}?`, `几乘 ${w} 等于 ${area}？`],
              ],
              [["Divide", "相除"], ["The other side:", "另一条边："], [`${div(area, w)} = ${h}`]],
            ],
            [`$${times(w, h)} = ${area}$ square ${measure[0]}.`, `$${times(w, h)} = ${area}$ 平方${measure[1]}。`],
            [
              [area - w, "That subtracts the side from the area. Divide instead.", "这是用面积减边长。要用除法。"],
              [area + w, "That adds the side to the area. Divide instead.", "这是把面积和边长相加。要用除法。"],
              [area, "That is the area, already given.", "这是已经给出的面积。"],
            ],
            labeledRectangleFigure(w, h, measure === inches ? "in" : measure === feet ? "ft" : "m"),
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
          "One garden is 8 by 2 meters and another is 5 by 4. Their areas are $8 \\times 2 = 16$ and $5 \\times 4 = 20$ square meters. The second is larger by $20 - 16 = 4$ square meters.\n\nCheck: $16 + 4 = 20$.\n\n> **Watch out.** The longer garden is not always larger. Work out both areas first.",
          "一个花园长 8 米、宽 2 米，另一个长 5 米、宽 4 米。面积分别是 $8 \\times 2 = 16$ 和 $5 \\times 4 = 20$ 平方米。第二个大 $20 - 16 = 4$ 平方米。\n\n检验：$16 + 4 = 20$。\n\n> **注意。** 长一些的花园不一定更大。先把两个面积都算出来。",
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
          const big = Math.max(a1, a2);
          const small = Math.min(a1, a2);
          return solved(
            [
              `${p}'s garden is ${w1} meters by ${h1} meters. ${q}'s garden is ${w2} meters by ${h2} meters. How many square meters larger is the larger garden?`,
              `${p} 的花园长 ${w1} 米、宽 ${h1} 米，${q} 的花园长 ${w2} 米、宽 ${h2} 米。大的花园比小的花园大多少平方米？`,
            ],
            big - small,
            [
              [
                ["Find each area", "求每个面积"],
                ["The two gardens:", "两个花园："],
                [`${times(w1, h1)} = ${a1}`, `${times(w2, h2)} = ${a2}`],
              ],
              [["Subtract", "相减"], ["The difference:", "相差："], [`${big} - ${small} = ${big - small}`]],
            ],
            [`$${small} + ${big - small} = ${big}$.`, `$${small} + ${big - small} = ${big}$。`],
            [
              [Math.abs(w1 + h1 - w2 - h2), "That compares the sides added together, not the areas.", "这比较的是两条边的和，不是面积。"],
              [big, "That is the larger area, not how much larger.", "这是较大的面积，不是大多少。"],
              [a1 + a2, "That adds the two areas. Subtract to find how much larger.", "这是把两个面积相加。求大多少要用减法。"],
            ],
            twoRectanglesFigure(w1, h1, w2, h2),
          );
        },
      ),
      figure: gradeDrawings["comparing-two-areas"],
    },
  ],
  [
    "Mia wants to cover a board 5 feet long and 3 feet wide with square tiles 1 foot on a side. 3 rows of 5 tiles cover it, so she needs $5 \\times 3 = 15$ tiles. The area is 15 square feet.\n\nCheck: $5 + 5 + 5 = 15$.\n\nIn this lesson we solve stories about area and missing sides.",
    "Mia 想用边长 1 英尺的方砖铺满一块长 5 英尺、宽 3 英尺的木板。铺 3 行，每行 5 块，要 $5 \\times 3 = 15$ 块。面积是 15 平方英尺。\n\n检验：$5 + 5 + 5 = 15$。\n\n本课我们解决有关面积和缺少的边的故事题。",
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
          "An L shape is 6 squares wide at the bottom and 5 rows tall, with a 3 by 3 corner missing. Count by rows: the 2 bottom rows have 6 squares each, and the 3 top rows have 3 each. $12 + 9 = 21$ square units.\n\nCheck: the full rectangle has 30 squares, and $30 - 9 = 21$.\n\n> **Watch out.** Do not count the missing corner. Those squares are not part of the shape.",
          "一个 L 形底下宽 6 格，一共 5 行，缺了一个 3 乘 3 的角。按行数：下面 2 行每行 6 格，上面 3 行每行 3 格。$12 + 9 = 21$ 平方单位。\n\n检验：完整的长方形有 30 格，$30 - 9 = 21$。\n\n> **注意。** 缺掉的角不要数。那些方格不属于这个图形。",
        ],
        (rng) => {
          const { w, h, cw, ch, area } = lData(rng);
          const low = h - ch;
          return solved(
            [
              "Each small square is 1 square unit. What is the area of this shape, in square units?",
              "每个小方格是 1 平方单位。这个图形的面积是多少平方单位？",
            ],
            area,
            [
              [
                ["Count the long rows", "数长的行"],
                [`The bottom ${low} ${low === 1 ? "row has" : "rows have"} ${w} squares each:`, `下面 ${low} 行，每行 ${w} 格：`],
                [`${times(low, w)} = ${low * w}`],
              ],
              [
                ["Count the short rows", "数短的行"],
                [`The top ${ch} ${ch === 1 ? "row has" : "rows have"} ${w - cw} squares each:`, `上面 ${ch} 行，每行 ${w - cw} 格：`],
                [`${times(ch, w - cw)} = ${ch * (w - cw)}`, `${low * w} + ${ch * (w - cw)} = ${area}`],
              ],
            ],
            [
              `The full rectangle has ${w * h} squares, and $${w * h} - ${cw * ch} = ${area}$.`,
              `完整的长方形有 ${w * h} 格，$${w * h} - ${cw * ch} = ${area}$。`,
            ],
            [
              [w * h, "That counts the missing corner too.", "这把缺掉的角也数进去了。"],
              [cw * ch, "That is the missing corner, not the shape.", "这是缺掉的角，不是这个图形。"],
              [area + 1, "That counts one square too many.", "多数了一格。"],
              [2 * (w + h), "That is the distance around the full rectangle, not an area.", "这是大长方形的周长，不是面积。"],
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
          "A dashed line splits the L into a rectangle 3 by 5 and a rectangle 3 by 2. Their areas are $3 \\times 5 = 15$ and $3 \\times 2 = 6$, so the L is $15 + 6 = 21$ square units.\n\nCheck: the whole 6 by 5 rectangle less the 3 by 3 corner is $30 - 9 = 21$.\n\n> **Watch out.** Add the two areas, not the side lengths.",
          "虚线把 L 形分成一个 3 乘 5 的长方形和一个 3 乘 2 的长方形。面积是 $3 \\times 5 = 15$ 和 $3 \\times 2 = 6$，所以 L 形是 $15 + 6 = 21$ 平方单位。\n\n检验：整个 6 乘 5 的长方形减去 3 乘 3 的角，$30 - 9 = 21$。\n\n> **注意。** 要把两个面积相加，不是把边长相加。",
        ],
        (rng) => {
          const { w, h, cw, ch, area } = lData(rng);
          const tall = w - cw;
          return solved(
            [
              "The dashed line splits this shape into two rectangles. What is the total area, in square units?",
              "虚线把这个图形分成两个长方形。总面积是多少平方单位？",
            ],
            area,
            [
              [
                ["Find each part", "求每部分"],
                [`The rectangles are ${tall} by ${h} and ${cw} by ${h - ch}:`, `两个长方形是 ${tall} 乘 ${h} 和 ${cw} 乘 ${h - ch}：`],
                [`${times(tall, h)} = ${tall * h}`, `${times(cw, h - ch)} = ${cw * (h - ch)}`],
              ],
              [["Add the parts", "把两部分相加"], ["Total area:", "总面积："], [`${tall * h} + ${cw * (h - ch)} = ${area}`]],
            ],
            [
              `The whole ${w} by ${h} rectangle less the ${cw} by ${ch} corner is $${w * h} - ${cw * ch} = ${area}$.`,
              `整个 ${w} 乘 ${h} 的长方形减去 ${cw} 乘 ${ch} 的角，$${w * h} - ${cw * ch} = ${area}$。`,
            ],
            [
              [w * h, "That uses the whole rectangle, with the corner that is missing.", "这用了整个大长方形，把缺掉的角也算进去了。"],
              [area + cw, `That is ${cw} too many. Check each part's sides.`, `多了 ${cw}。再看看每部分的边长。`],
              [w + h, "That adds side lengths. Area comes from multiplying.", "这是把边长相加。面积要用乘法。"],
              [area - ch, `That is ${ch} too few. Check each part's sides.`, `少了 ${ch}。再看看每部分的边长。`],
            ],
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
          "Picture the 6 by 5 rectangle around the L. Its area is $6 \\times 5 = 30$. The missing corner is $3 \\times 3 = 9$. Take it away: $30 - 9 = 21$ square units.\n\nCheck: splitting the L gives $15 + 6 = 21$ as well.\n\n> **Watch out.** The corner is missing, so subtract its area. Adding it gives 39.",
          "想象 L 形外面 6 乘 5 的大长方形。它的面积是 $6 \\times 5 = 30$。缺掉的角是 $3 \\times 3 = 9$。减去它：$30 - 9 = 21$ 平方单位。\n\n检验：把 L 形分成两部分，也是 $15 + 6 = 21$。\n\n> **注意。** 这个角是缺的，所以要减去它的面积。加上它就得 39。",
        ],
        (rng) => {
          const { w, h, cw, ch, area } = lData(rng);
          // A 2 by 2 corner has as much area as its sides add up to, so the sum would be right there.
          const notTheCorner = cw + ch === cw * ch ? ([cw, `${cw}`] as const) : ([cw + ch, `${cw} + ${ch}`] as const);
          return pickedMath(
            rng,
            ["Which calculation gives the area of this shape?", "哪个算式能算出这个图形的面积？"],
            `${times(w, h)} - ${times(cw, ch)}`,
            rng.sample<MathWrong>(
              [
                [
                  `${times(w, h)} + ${times(cw, ch)}`,
                  "The corner is missing, so its area is taken away, not added.",
                  "这个角是缺的，所以它的面积要减去，不是加上。",
                ],
                [
                  `${w} + ${h} - ${cw} - ${ch}`,
                  "This adds and subtracts side lengths, but area comes from multiplying.",
                  "这是在加减边长，但面积要用乘法。",
                ],
                [
                  `${times(w - cw, h - ch)}`,
                  "This is only the small rectangle left at one corner: the L shape has more than that.",
                  "这只是一角剩下的小长方形：L 形比它大。",
                ],
                [
                  `${times(w, h)} - ${notTheCorner[0]}`,
                  `The corner's area is $${times(cw, ch)}$, not $${notTheCorner[1]}$.`,
                  `这个角的面积是 $${times(cw, ch)}$，不是 $${notTheCorner[1]}$。`,
                ],
              ],
              3,
            ),
            [
              [["The big rectangle", "大长方形"], ["Around the L:", "L 形外面："], [`${times(w, h)} = ${w * h}`]],
              [
                ["Take away the corner", "减去角"],
                [`The missing corner is $${times(cw, ch)} = ${cw * ch}$:`, `缺掉的角是 $${times(cw, ch)} = ${cw * ch}$：`],
                [`${w * h} - ${cw * ch} = ${area}`],
              ],
            ],
            [
              `Splitting the L gives $${times(w - cw, h)} + ${times(cw, h - ch)} = ${(w - cw) * h} + ${cw * (h - ch)} = ${area}$ as well.`,
              `把 L 形分成两部分，$${times(w - cw, h)} + ${times(cw, h - ch)} = ${(w - cw) * h} + ${cw * (h - ch)} = ${area}$，也一样。`,
            ],
            lShapeFigure(w, h, cw, ch, { bottom: `${w}`, left: `${h}`, notchBottom: `${cw}`, notchSide: `${ch}` }),
          );
        },
      ),
      figure: gradeDrawings["taking-away-a-corner"],
    },
  ],
  [
    "Ben's room is shaped like an L. He pictures it as a 6 by 5 rectangle with a 3 by 3 corner cut off. The rectangle is 30 square meters, so the room is $30 - 9 = 21$ square meters.\n\nCheck: the L splits into $3 \\times 5 = 15$ and $3 \\times 2 = 6$, and $15 + 6 = 21$.\n\nIn this lesson we find the area of L shapes by counting, splitting or taking away a corner.",
    "Ben 的房间是 L 形的。他把它想成一个 6 乘 5 的长方形，切掉了一个 3 乘 3 的角。长方形是 30 平方米，所以房间是 $30 - 9 = 21$ 平方米。\n\n检验：L 形可以分成 $3 \\times 5 = 15$ 和 $3 \\times 2 = 6$，$15 + 6 = 21$。\n\n本课我们用数格子、分成两部分或减去一个角，求 L 形的面积。",
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
          "A garden is 7 meters by 3 meters. A fence goes around all four sides: two sides of 7 and two of 3. $7 + 3 = 10$, and $2 \\times 10 = 20$ meters.\n\nCheck: $7 + 3 + 7 + 3 = 20$.\n\n> **Watch out.** A fence is a perimeter, not an area. $7 \\times 3 = 21$ is wrong here.",
          "一个花园长 7 米、宽 3 米。栅栏围住四条边：两条 7 米，两条 3 米。$7 + 3 = 10$，$2 \\times 10 = 20$ 米。\n\n检验：$7 + 3 + 7 + 3 = 20$。\n\n> **注意。** 栅栏是周长，不是面积。这里算 $7 \\times 3 = 21$ 是错的。",
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
          return solved(
            [
              `A rectangular ${job[0]} is ${w} meters long and ${h} meters wide, with a ${job[1]} all the way around it. How many meters long is the ${job[1]}?`,
              `一个长方形的${job[2]}长 ${w} 米、宽 ${h} 米，${job[3]}。这一圈长多少米？`,
            ],
            2 * (w + h),
            [
              [["One long and one short side", "一条长边加一条短边"], ["Half of the way around:", "绕半圈："], [`${w} + ${h} = ${w + h}`]],
              [["Double it", "乘 2"], ["Each length appears twice:", "每个长度都出现两次："], [`${times(2, w + h)} = ${2 * (w + h)}`]],
            ],
            [`$${w} + ${h} + ${w} + ${h} = ${2 * (w + h)}$.`, `$${w} + ${h} + ${w} + ${h} = ${2 * (w + h)}$。`],
            [
              [w + h, "That goes only halfway around. Double it.", "这只绕了半圈。还要乘 2。"],
              [
                w * h,
                "That multiplies the sides, which gives the area, not the distance around.",
                "这是把两条边相乘，得到的是面积，不是绕一圈的长度。",
              ],
              [2 * w + h, "That leaves out one short side.", "这漏掉了一条短边。"],
            ],
            labeledRectangleFigure(w, h, "m"),
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
          "A rectangle has a perimeter of 26 and one side of 8. Half of 26 is 13, which is one long side and one short side together. So the other side is $13 - 8 = 5$.\n\nCheck: $8 + 5 + 8 + 5 = 26$.\n\n> **Watch out.** Halve the perimeter first. $26 - 8 = 18$ takes away only one side.",
          "一个长方形的周长是 26，一条边是 8。26 的一半是 13，就是一条长边和一条短边的和。所以另一条边是 $13 - 8 = 5$。\n\n检验：$8 + 5 + 8 + 5 = 26$。\n\n> **注意。** 先求周长的一半。$26 - 8 = 18$ 只减去了一条边。",
        ],
        (rng) => {
          const w = rng.int(4, 15);
          let h = rng.int(2, 12);
          if (h === w) h += 1;
          const p = 2 * (w + h);
          return solved(
            [
              `A rectangle has a perimeter of ${p} centimeters. One side is ${w} centimeters long. How many centimeters long is the side next to it?`,
              `一个长方形的周长是 ${p} 厘米，一条边长 ${w} 厘米。和它相邻的一条边长多少厘米？`,
            ],
            h,
            [
              [
                ["Halve the perimeter", "求周长的一半"],
                ["One long and one short side:", "一条长边加一条短边："],
                [`${div(p, 2)} = ${w + h}`],
              ],
              [["Subtract the known side", "减去已知的边"], ["The other side:", "另一条边："], [`${w + h} - ${w} = ${h}`]],
            ],
            [`$${w} + ${h} + ${w} + ${h} = ${p}$.`, `$${w} + ${h} + ${w} + ${h} = ${p}$。`],
            [
              [p - w, "That takes away only one side. Halve the perimeter first.", "这只减去了一条边。要先求周长的一半。"],
              [p - 2 * w, "That is both of the other sides together, not one.", "这是另外两条边的和，不是一条。"],
              [
                w + h,
                "That is half the perimeter, one long side and one short side together.",
                "这是周长的一半，是一条长边和一条短边的和。",
              ],
            ],
            partWholeBarFigure([w, h], 1),
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
          "An L shape has sides 6, 2, 3, 3, 3 and 5. Add them all: $6 + 2 + 3 + 3 + 3 + 5 = 22$.\n\nCheck: the 6 by 5 rectangle around it has perimeter $2 \\times (6 + 5) = 22$, the same, because the inner sides of the notch make up for the cut.\n\n> **Watch out.** An L has 6 sides. Adding only 4 of them leaves some out.",
          "一个 L 形的边长是 6、2、3、3、3 和 5。把它们都加起来：$6 + 2 + 3 + 3 + 3 + 5 = 22$。\n\n检验：外面 6 乘 5 的长方形周长是 $2 \\times (6 + 5) = 22$，一样，因为缺口里的两条边正好补上了切掉的部分。\n\n> **注意。** L 形有 6 条边。只加 4 条就漏掉了。",
        ],
        (rng) => {
          const { w, h, cw, ch } = lData(rng);
          const p = 2 * (w + h);
          const sides = [w, h - ch, cw, ch, w - cw, h];
          return solved(
            ["What is the perimeter of this shape, in units?", "这个图形的周长是多少单位？"],
            p,
            [
              [
                ["List the sides", "列出各边"],
                [`Going around, the 6 sides are ${sides.join(", ")}.`, `绕一圈，6 条边是 ${sides.join("、")}。`],
              ],
              [["Add them", "加起来"], ["The perimeter:", "周长："], [`${sides.join(" + ")} = ${p}`]],
            ],
            [
              `The ${w} by ${h} rectangle around it has perimeter $${times(2, `(${w} + ${h})`)} = ${p}$, the same.`,
              `外面 ${w} 乘 ${h} 的长方形周长是 $${times(2, `(${w} + ${h})`)} = ${p}$，一样。`,
            ],
            [
              [w + h, "That adds only two sides.", "这只加了两条边。"],
              [p - cw, `That leaves out a side of ${cw}.`, `这漏掉了一条长 ${cw} 的边。`],
              [p - ch, `That leaves out a side of ${ch}.`, `这漏掉了一条长 ${ch} 的边。`],
              [w * h - cw * ch, "That is the area, not the distance around.", "这是面积，不是周长。"],
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
  [
    "Sam puts a ribbon around a picture frame 9 inches by 6 inches. Two long sides and two short sides: $9 + 6 = 15$, and $2 \\times 15 = 30$ inches of ribbon.\n\nCheck: $9 + 6 + 9 + 6 = 30$.\n\nIn this lesson we find perimeters in stories, a missing side from a perimeter, and the perimeter of an L shape.",
    "Sam 给一个长 9 英寸、宽 6 英寸的相框围一圈丝带。两条长边和两条短边：$9 + 6 = 15$，$2 \\times 15 = 30$ 英寸丝带。\n\n检验：$9 + 6 + 9 + 6 = 30$。\n\n本课我们在故事中求周长，由周长求一条边，并求 L 形的周长。",
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

/** quadFeatures says which features each special quadrilateral has, in English and Chinese. */
const quadFeatures: Record<"square" | "rectangle" | "rhombus", Pair> = {
  square: ["It has 4 square corners and 4 equal sides.", "它有 4 个直角和 4 条相等的边。"],
  rectangle: ["It has 4 square corners, but its sides are not all equal.", "它有 4 个直角，但边不都相等。"],
  rhombus: ["It has 4 equal sides, but its corners are not square.", "它有 4 条相等的边，但角不是直角。"],
};

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
          "A shape has 4 sides, 4 square corners and 4 equal sides. Square corners make it a rectangle and equal sides make it a rhombus, so its best name is square.\n\nCheck: a rectangle with 4 equal sides is a square.\n\n> **Watch out.** Look at corners and sides, not at how the shape is turned.",
          "一个图形有 4 条边、4 个直角，4 条边都相等。有直角说明它是长方形，边都相等说明它是菱形，所以最准确的名称是正方形。\n\n检验：4 条边都相等的长方形就是正方形。\n\n> **注意。** 要看角和边，不要看图形是怎么放的。",
        ],
        (rng) => {
          const kind = rng.pick(quadKinds);
          const key = kind.name[0];
          const wrongFor = (name: Pair): Wrong => {
            if (name[0] === "pentagon")
              return [name, "A pentagon has 5 sides, but this shape has 4.", "五边形有 5 条边，这个图形只有 4 条。"];
            if (name[0] === "triangle")
              return [name, "A triangle has 3 sides, but this shape has 4.", "三角形有 3 条边，这个图形有 4 条。"];
            if (name[0] === "square")
              return [
                name,
                key === "rectangle"
                  ? "A square needs 4 equal sides, and these are not."
                  : "A square needs square corners, and these are not.",
                key === "rectangle" ? "正方形要 4 条边相等，这个不是。" : "正方形要有直角，这个没有。",
              ];
            if (name[0] === "rectangle")
              return [
                name,
                key === "square"
                  ? "It is a rectangle, but square is the better name: its sides are also equal."
                  : "A rectangle needs square corners, and these are not.",
                key === "square" ? "它是长方形，但正方形更准确：它的边也都相等。" : "长方形要有直角，这个没有。",
              ];
            return [
              name,
              key === "square"
                ? "It is a rhombus, but square is the better name: its corners are also square."
                : "A rhombus needs 4 equal sides, and these are not.",
              key === "square" ? "它是菱形，但正方形更准确：它的角也都是直角。" : "菱形要 4 条边相等，这个不是。",
            ];
          };
          const names: Pair[] = [...quadKinds.filter((k) => k !== kind).map((k) => k.name), ["pentagon", "五边形"], ["triangle", "三角形"]];
          return picked(
            rng,
            ["Which is the best name for this shape?", "这个图形最准确的名称是什么？"],
            kind.name,
            rng.sample(names, 3).map(wrongFor),
            [
              [
                ["Count the sides", "数边"],
                ["It has 4 straight sides, so it is a quadrilateral.", "它有 4 条直边，是四边形。"],
              ],
              [["Look at corners and sides", "看角和边"], quadFeatures[key === "square" || key === "rectangle" ? key : "rhombus"]],
            ],
            [`A ${key} is exactly a quadrilateral with these features.`, `${kind.name[1]}正是有这些特点的四边形。`],
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
          "Is every square a rectangle? A rectangle needs 4 square corners, and a square has them, so yes. Is every rectangle a square? No: a long, thin rectangle does not have 4 equal sides.\n\nCheck: a square also has 4 equal sides, so it is a rhombus too.\n\n> **Watch out.** Turning a statement around can make it false. Test it with a picture.",
          "每个正方形都是长方形吗？长方形要有 4 个直角，正方形有，所以是。每个长方形都是正方形吗？不是：又长又窄的长方形没有 4 条相等的边。\n\n检验：正方形也有 4 条相等的边，所以它也是菱形。\n\n> **注意。** 把一句话反过来说，可能就不对了。画个图来检验。",
        ],
        (rng) => {
          const [yes, why] = rng.pick<readonly [Pair, Pair]>([
            [
              ["Every square is a rectangle", "每个正方形都是长方形"],
              ["Every square has 4 square corners.", "每个正方形都有 4 个直角。"],
            ],
            [
              ["Every square is a rhombus", "每个正方形都是菱形"],
              ["Every square has 4 equal sides.", "每个正方形都有 4 条相等的边。"],
            ],
            [
              ["Every rectangle is a quadrilateral", "每个长方形都是四边形"],
              ["Every rectangle has 4 straight sides.", "每个长方形都有 4 条直边。"],
            ],
            [
              ["Every rhombus is a quadrilateral", "每个菱形都是四边形"],
              ["Every rhombus has 4 straight sides.", "每个菱形都有 4 条直边。"],
            ],
            [
              ["Every square is a quadrilateral", "每个正方形都是四边形"],
              ["Every square has 4 straight sides.", "每个正方形都有 4 条直边。"],
            ],
            [
              ["Some rectangles are squares", "有些长方形是正方形"],
              ["A rectangle with 4 equal sides is a square.", "4 条边都相等的长方形就是正方形。"],
            ],
            [
              ["Some rhombuses are squares", "有些菱形是正方形"],
              ["A rhombus with 4 square corners is a square.", "有 4 个直角的菱形就是正方形。"],
            ],
          ]);
          const falses: readonly Wrong[] = [
            [
              ["Every rectangle is a square", "每个长方形都是正方形"],
              "A long, thin rectangle does not have 4 equal sides.",
              "又长又窄的长方形没有 4 条相等的边。",
            ],
            [["Every rhombus is a square", "每个菱形都是正方形"], "A slanted rhombus has no square corners.", "斜着的菱形没有直角。"],
            [
              ["Every quadrilateral is a rectangle", "每个四边形都是长方形"],
              "Many quadrilaterals have no square corners.",
              "很多四边形没有直角。",
            ],
            [
              ["Every quadrilateral is a rhombus", "每个四边形都是菱形"],
              "Many quadrilaterals have sides of different lengths.",
              "很多四边形的边长短不同。",
            ],
            [
              ["No square is a rectangle", "正方形都不是长方形"],
              "Every square has 4 square corners, so it is a rectangle.",
              "每个正方形都有 4 个直角，所以都是长方形。",
            ],
            [
              ["No rhombus is a quadrilateral", "菱形都不是四边形"],
              "Every rhombus has 4 sides, so it is a quadrilateral.",
              "每个菱形都有 4 条边，所以都是四边形。",
            ],
          ];
          return picked(
            rng,
            ["Which statement is true?", "哪句话是对的？"],
            yes,
            rng.sample(falses, 3),
            [
              [
                ["Recall the rules", "回想定义"],
                [
                  "A rectangle has 4 square corners, a rhombus has 4 equal sides, and a square has both.",
                  "长方形有 4 个直角，菱形有 4 条相等的边，正方形两样都有。",
                ],
              ],
              [
                ["Test the statement", "检验这句话"],
                [`"${yes[0]}": ${why[0]}`, `“${yes[1]}”：${why[1]}`],
              ],
            ],
            ["Each other statement has a shape that breaks it.", "其他每句话都能找到不符合的图形。"],
            polygonFigure(quadKinds[1]?.make(rng) ?? [], t("A rectangle that is not a square.", "一个不是正方形的长方形。")),
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
          "A shape has 4 straight sides of different lengths and no square corners. It has 4 sides, so it is a quadrilateral. But it is not a rectangle, a rhombus or a square.\n\nCheck: count the sides again: 1, 2, 3, 4.\n\n> **Watch out.** A shape does not need square corners or equal sides to be a quadrilateral. It only needs 4 straight sides.",
          "一个图形有 4 条长短不同的直边，没有直角。它有 4 条边，所以是四边形。但它不是长方形、菱形或正方形。\n\n检验：再数一遍边：1、2、3、4。\n\n> **注意。** 四边形不一定有直角，也不一定边相等，只要有 4 条直边就行。",
        ],
        (rng) => {
          const corners: [number, number][] = [
            [rng.int(0, 2), rng.int(2, 3)],
            [rng.int(7, 10), rng.int(0, 1)],
            [rng.int(6, 9), rng.int(7, 9)],
            [rng.int(1, 3), rng.int(5, 6)],
          ];
          return picked(
            rng,
            ["Which statement about this shape is true?", "关于这个图形，哪句话是对的？"],
            ["It is a quadrilateral, but not a rectangle", "它是四边形，但不是长方形"],
            rng.sample<Wrong>(
              [
                [["It is a rectangle", "它是长方形"], "Its corners are not square.", "它的角不是直角。"],
                [
                  ["It is a square", "它是正方形"],
                  "Its sides are not equal and its corners are not square.",
                  "它的边不相等，角也不是直角。",
                ],
                [
                  ["It is not a quadrilateral", "它不是四边形"],
                  "It has 4 straight sides, so it is a quadrilateral.",
                  "它有 4 条直边，所以是四边形。",
                ],
                [["It is a rhombus", "它是菱形"], "Its sides are not all equal.", "它的边不都相等。"],
              ],
              3,
            ),
            [
              [
                ["Count the sides", "数边"],
                ["It has 4 straight sides, so it is a quadrilateral.", "它有 4 条直边，所以是四边形。"],
              ],
              [
                ["Check corners and sides", "看角和边"],
                ["Its corners are not square and its sides are not all equal.", "它的角不是直角，边也不都相等。"],
              ],
            ],
            ["So it is a quadrilateral, but not a rectangle, a rhombus or a square.", "所以它是四边形，但不是长方形、菱形或正方形。"],
            polygonFigure(corners, t("A closed shape with straight sides.", "一个由直边围成的封闭图形。")),
          );
        },
      ),
      figure: gradeDrawings2["quadrilateral-categories#quadrilaterals-of-other-kinds"],
    },
  ],
  [
    "Kai sorts shapes into boxes for rectangles and rhombuses. A square fits both boxes: it has 4 square corners and 4 equal sides.\n\nCheck: a square with its corners pushed over loses its square corners and is only a rhombus.\n\nIn this lesson we see how squares, rectangles and rhombuses fit together.",
    "Kai 把图形分到「长方形」和「菱形」两个盒子里。正方形两个盒子都能放：它有 4 个直角，也有 4 条相等的边。\n\n检验：把正方形推斜，它就没有直角了，只是菱形。\n\n本课我们说明正方形、长方形和菱形之间的关系。",
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
