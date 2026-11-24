// A third knowledge point for the 3rd Grade Math topics that had two: facts used
// backwards, a second representation, or the same skill in a short story.

import type { Figure, KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { svgDocument } from "@ga/subject-math";
import {
  arrayFigure,
  barGraphFigure,
  baseTenFigure,
  clockFigure,
  earlyNames,
  earlyPoint,
  earlyThings,
  gridFigure,
  labeledRectangleFigure,
  numberLineFigure,
} from "../early-grades-kit.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import {
  areaModelFigure,
  captioned,
  factTriangleFigure,
  fractionLineFigure,
  fractionLinePlotFigure,
  halfPictureGraphFigure,
  hopsFigure,
  lShapeFigure,
  type Pair,
  partWholeBarFigure,
  picked,
  pickedMath,
  solved,
  twoFractionLinesFigure,
  type Wrong,
} from "./early-grades-more-kit.ts";

/** skill builds a knowledge point from its texts, generator and figure. */
const skill = earlyPoint;

/** storyThing picks a name and a thing for a word problem. */
const storyThing = (rng: Rng) => ({ who: rng.pick(earlyNames), thing: rng.pick(earlyThings) });

/** times writes a product in LaTeX. */
const times = (a: number | string, b: number | string) => `${a} \\times ${b}`;

/** betweenProducts builds the knowledge point of a product one step from a known fact, for the factors in a list. */
const betweenProducts = (id: string, title: Pair, factors: readonly number[]) => {
  const [ea, eb] = factors[0] === 3 ? [4, 6] : [6, 7];
  return skill(
    id,
    title,
    [
      `Given $${times(ea, eb)} = ${ea * eb}$, find $${times(ea, eb + 1)}$. That is one more group of ${ea}: $${ea * eb} + ${ea} = ${ea * (eb + 1)}$.\n\nCheck: $${ea * (eb + 1)} - ${ea} = ${ea * eb}$, back to $${times(ea, eb)}$.\n\n> **Watch out.** One more group adds ${ea}, the size of a group. It does not add 1.`,
      `已知 $${times(ea, eb)} = ${ea * eb}$，求 $${times(ea, eb + 1)}$。这是多一组 ${ea}：$${ea * eb} + ${ea} = ${ea * (eb + 1)}$。\n\n检验：$${ea * (eb + 1)} - ${ea} = ${ea * eb}$，又回到 $${times(ea, eb)}$。\n\n> **注意。** 多一组就加上 ${ea}，也就是一组的大小，不是加 1。`,
    ],
    (rng) => {
      const a = rng.pick(factors);
      const b = rng.int(2, 9);
      const up = rng.bool();
      const other = up ? b + 1 : b - 1;
      const sign = up ? "+" : "-";
      return solved(
        [
          `Given that $${times(a, b)} = ${a * b}$, what is $${times(a, other)}$?`,
          `已知 $${times(a, b)} = ${a * b}$，$${times(a, other)}$ 是多少？`,
        ],
        a * other,
        [
          [["Start from the known fact", "从已知算式出发"], [`${b} groups of ${a}:`, `${b} 组 ${a}：`], [`${times(a, b)} = ${a * b}`]],
          [
            [up ? "Add one group" : "Take away one group", up ? "加一组" : "减一组"],
            [
              `${other} is one ${up ? "more" : "less"} than ${b}, so ${up ? "add" : "take away"} one ${a}:`,
              `${other} 比 ${b} ${up ? "多" : "少"} 1，所以${up ? "加上" : "减去"}一个 ${a}：`,
            ],
            [`${a * b} ${sign} ${a} = ${a * other}`],
          ],
        ],
        [
          `$${a * other} ${up ? "-" : "+"} ${a} = ${a * b}$, back to the known fact.`,
          `$${a * other} ${up ? "-" : "+"} ${a} = ${a * b}$，又回到已知算式。`,
        ],
        [
          [a * b + (up ? 1 : -1), `That changes the product by 1, not by a group of ${a}.`, `这只把积改变了 1，不是一组 ${a}。`],
          [up ? a * b - a : a * b + a, "That goes the wrong way.", "方向反了。"],
          [up ? a * other + a : a * other - a, "That moves two groups, not one.", "这移动了两组，不是一组。"],
        ],
        hopsFigure([a * b, a * other], true),
      );
    },
    captioned(
      hopsFigure([ea * eb, ea * (eb + 1)]),
      `One hop of ${ea} from ${ea * eb} to ${ea * (eb + 1)}.`,
      `从 ${ea * eb} 跳一次 ${ea}，到 ${ea * (eb + 1)}。`,
    ),
  );
};

/** halfSquaresFigure draws whole unit squares and half squares cut along a diagonal, ten to a row. */
function halfSquaresFigure(full: number, halves: number): Figure {
  const size = 22;
  const gap = 6;
  const at = (i: number) => [20 + (i % 10) * (size + gap), 8 + Math.floor(i / 10) * (size + gap)] as const;
  let body = "";
  for (let i = 0; i < full + halves; i++) {
    const [x, y] = at(i);
    body +=
      i < full
        ? `<rect x="${x}" y="${y}" width="${size}" height="${size}" class="accent" fill="currentColor" fill-opacity="0.25"/><rect x="${x}" y="${y}" width="${size}" height="${size}"/>`
        : `<polygon points="${x},${y} ${x + size},${y + size} ${x},${y + size}" class="accent" fill="currentColor" fill-opacity="0.25"/><polygon points="${x},${y} ${x + size},${y + size} ${x},${y + size}"/>`;
  }
  const rows = Math.ceil((full + halves) / 10);
  return {
    svg: svgDocument(16 + rows * (size + gap), body),
    alt: t(`${full} whole squares and ${halves} half squares.`, `${full} 个整格和 ${halves} 个半格。`),
  };
}

/** deeperGrade3ThirdPoints holds the third knowledge points of 3rd Grade Math, by topic. */
export const deeperGrade3ThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "multiplication-as-equal-groups": [
    skill(
      "what-a-product-means",
      ["What a product means", "积表示什么"],
      [
        "$4 \\times 6$ means 4 groups of 6. So it is 4 bags with 6 apples in each bag, and $6 + 6 + 6 + 6 = 24$.\n\nCheck: count by 6s four times: 6, 12, 18, 24.\n\n> **Watch out.** The first number counts the groups. 6 bags of 4 is a different story.",
        "$4 \\times 6$ 表示 4 组，每组 6 个。也就是 4 个袋子，每袋 6 个苹果，$6 + 6 + 6 + 6 = 24$。\n\n检验：6 个 6 个地数 4 次：6、12、18、24。\n\n> **注意。** 第一个数是组数。6 个袋子每袋 4 个是另一个故事。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        let b = rng.int(2, 9);
        if (a === b) b = a === 9 ? 8 : a + 1;
        const { thing } = storyThing(rng);
        const line = (x: number, y: number): Pair => [
          `${x} bags with ${y} ${thing.en} in each bag`,
          `${x} 个袋子，每袋 ${y} 个${thing.zh}`,
        ];
        return picked(
          rng,
          [
            `Which story matches the groups in $${times(a, b)}$, read as $${a}$ groups of $${b}$?`,
            `把 $${times(a, b)}$ 读作 $${a}$ 组、每组 $${b}$ 个，哪个故事与它相符？`,
          ],
          line(a, b),
          [
            [
              line(b, a),
              `That is ${b} groups of ${a}. The total is the same, but the groups are swapped.`,
              `这是 ${b} 组、每组 ${a} 个。总数一样，但组数和每组个数换了。`,
            ],
            [
              [`${a} bags and ${b} more ${thing.en}`, `${a} 个袋子，另外还有 ${b} 个${thing.zh}`],
              `That adds ${b}. It does not put ${b} in each bag.`,
              `这是再加 ${b} 个，不是每袋 ${b} 个。`,
            ],
            [
              [`${a + b} bags with just 1 in each bag`, `${a + b} 个袋子，每袋 1 个${thing.zh}`],
              `That is only ${a + b} in all, not ${a} groups of ${b}.`,
              `这一共只有 ${a + b} 个，不是 ${a} 组 ${b} 个。`,
            ],
          ],
          [
            [
              ["Read the first number", "看第一个数"],
              [`${a} is the number of groups: ${a} bags.`, `${a} 是组数：${a} 个袋子。`],
            ],
            [
              ["Read the second number", "看第二个数"],
              [`${b} is the size of each group: ${b} in each bag.`, `${b} 是每组的个数：每袋 ${b} 个。`],
            ],
          ],
          [
            `${a} bags of ${b} make $${times(a, b)} = ${a * b}$ ${thing.en}.`,
            `${a} 袋，每袋 ${b} 个，共 $${times(a, b)} = ${a * b}$ 个${thing.zh}。`,
          ],
          arrayFigure(a, b),
        );
      },
      captioned(arrayFigure(4, 6), "4 rows of 6 dots: 4 groups with 6 in each.", "4 行，每行 6 个点：4 组，每组 6 个。"),
    ),
  ],
  "multiplication-with-arrays": [
    skill(
      "rows-and-columns-swapped",
      ["An array turned on its side", "把数组转过来"],
      [
        "An array has 3 rows of 7, so $3 \\times 7 = 21$ dots. Turn it on its side. Now it has 7 rows of 3, and $7 \\times 3 = 21$.\n\nCheck: no dot moved away, so the total is still 21.\n\n> **Watch out.** After turning, each row holds 3, the old number of rows. It does not hold 7.",
        "一个数组有 3 行，每行 7 个，共 $3 \\times 7 = 21$ 个点。把它转过来，现在是 7 行，每行 3 个，$7 \\times 3 = 21$。\n\n检验：没有点被拿走，所以总数还是 21。\n\n> **注意。** 转过来后，每行是原来的行数 3，不是 7。",
      ],
      (rng) => {
        const r = rng.int(2, 9);
        let c = rng.int(2, 9);
        if (c === r) c = r === 9 ? 8 : r + 1;
        return solved(
          [
            `An array has ${r} rows of ${c}. It is turned on its side so that it has ${c} rows. How many dots are in each row now?`,
            `一个数组有 ${r} 行，每行 ${c} 个。把它转过来变成 ${c} 行。现在每行有多少个点？`,
          ],
          r,
          [
            [["Count all the dots", "数出总数"], [`${r} rows of ${c}:`, `${r} 行，每行 ${c} 个：`], [`${times(r, c)} = ${r * c}`]],
            [["Share into the new rows", "分到新的行里"], [`Now there are ${c} rows:`, `现在有 ${c} 行：`], [`${r * c} \\div ${c} = ${r}`]],
          ],
          [
            `Each old column of ${r} dots becomes a row, so ${c} rows of ${r}: $${times(c, r)} = ${r * c}$.`,
            `原来每列 ${r} 个点变成一行，所以是 ${c} 行，每行 ${r} 个：$${times(c, r)} = ${r * c}$。`,
          ],
          [
            [c, "That is the old row. Rows and columns swap when the array turns.", "这是原来一行的个数。转过来后行和列互换。"],
            [r * c, "That is all the dots, not one row.", "这是全部的点，不是一行。"],
            [r + c, "That adds the rows and the columns.", "这是把行数和列数相加了。"],
          ],
          arrayFigure(r, c),
        );
      },
      captioned(arrayFigure(3, 7), "3 rows of 7 dots, 21 in all.", "3 行，每行 7 个点，共 21 个。"),
    ),
  ],
  "multiplying-by-2-5-and-10": [
    skill(
      "fives-as-half-of-tens",
      ["Fives as half of tens", "乘 5 是乘 10 的一半"],
      [
        "Find $5 \\times 8$. Ten 8s are $10 \\times 8 = 80$. Five is half of ten, so $5 \\times 8$ is half of 80, which is 40.\n\nCheck: $40 + 40 = 80$. Two fives make ten.\n\n> **Watch out.** Halve the product. Do not take 5 away from it.",
        "求 $5 \\times 8$。10 个 8 是 $10 \\times 8 = 80$。5 是 10 的一半，所以 $5 \\times 8$ 是 80 的一半，就是 40。\n\n检验：$40 + 40 = 80$。两个 5 是 10。\n\n> **注意。** 要把积除以 2，不是从积里减去 5。",
      ],
      (rng) => {
        const a = rng.int(2, 29);
        const known = 10 * a;
        return solved(
          [
            `Given that $${times(10, a)} = ${known}$, what is $${times(5, a)}$?`,
            `已知 $${times(10, a)} = ${known}$，$${times(5, a)}$ 是多少？`,
          ],
          5 * a,
          [
            [["Start from ten groups", "从 10 组出发"], ["Given:", "已知："], [`${times(10, a)} = ${known}`]],
            [["Halve it", "取一半"], ["5 groups are half of 10 groups:", "5 组是 10 组的一半："], [`${known} \\div 2 = ${5 * a}`]],
          ],
          [`$${5 * a} + ${5 * a} = ${known}$, and two fives make ten.`, `$${5 * a} + ${5 * a} = ${known}$，两个 5 是 10。`],
          [
            [known - 5, "That takes away 5, not half.", "这是减去 5，不是取一半。"],
            [known, "That is 10 groups, not 5.", "这是 10 组，不是 5 组。"],
            [2 * a, `That is 2 groups of ${a}.`, `这是 2 组 ${a}。`],
          ],
          partWholeBarFigure([5 * a, 5 * a], 1),
        );
      },
      captioned(partWholeBarFigure([40, 40], -2), "A bar of 80 cut into two halves of 40.", "一个 80 的长条分成两半，每半 40。"),
    ),
  ],
  "multiplying-by-3-and-4": [
    betweenProducts("threes-and-fours-from-a-neighbor", ["Threes and fours from a neighbor", "由相邻算式求乘 3 和乘 4"], [3, 4]),
  ],
  "multiplying-by-6-7-8-and-9": [
    betweenProducts("sixes-to-nines-from-a-neighbor", ["Sixes to nines from a neighbor", "由相邻算式求乘 6 到乘 9"], [6, 7, 8, 9]),
  ],
  "multiplying-by-0-and-1": [
    skill(
      "zero-and-one-in-stories",
      ["Zero and one in stories", "故事中的零和一"],
      [
        "Ava has 5 empty boxes, with 0 pens in each. $5 \\times 0 = 0$: there are no pens. Ben has 1 box with 5 pens in it. $1 \\times 5 = 5$.\n\nCheck: $0 + 0 + 0 + 0 + 0 = 0$, and one box holds just its 5 pens.\n\n> **Watch out.** Empty boxes hold nothing. The answer is 0, not the number of boxes.",
        "Ava 有 5 个空盒子，每盒 0 支笔。$5 \\times 0 = 0$：一支笔也没有。Ben 有 1 个盒子，里面有 5 支笔。$1 \\times 5 = 5$。\n\n检验：$0 + 0 + 0 + 0 + 0 = 0$，一个盒子里就是那 5 支笔。\n\n> **注意。** 空盒子里什么也没有。答案是 0，不是盒子的个数。",
      ],
      (rng) => {
        const n = rng.int(12, 99);
        const zero = rng.bool();
        const { who, thing } = storyThing(rng);
        return zero
          ? solved(
              [
                `${who} has ${n} empty boxes with 0 ${thing.en} in each. How many ${thing.en} is that?`,
                `${who} 有 ${n} 个空盒子，每盒 0 个${thing.zh}。一共有多少个${thing.zh}？`,
              ],
              0,
              [
                [["Write the groups", "写出算式"], [`${n} boxes with 0 in each:`, `${n} 个盒子，每盒 0 个：`], [times(n, 0)]],
                [["Use the rule for 0", "用 0 的规则"], ["Groups of nothing make nothing:", "很多个 0 还是 0："], [`${times(n, 0)} = 0`]],
              ],
              ["Adding 0 again and again, $0 + 0 + \\dots$, is still 0.", "一直加 0，$0 + 0 + \\dots$，还是 0。"],
              [
                [n, "That counts the boxes, not the things in them.", "这是盒子的个数，不是里面东西的个数。"],
                [1, "1 is the rule for one group. These groups are empty.", "1 是一组时的规则。这些盒子是空的。"],
              ],
            )
          : solved(
              [
                `${who} has 1 box with ${n} ${thing.en} in it. How many ${thing.en} is that?`,
                `${who} 有 1 个盒子，里面有 ${n} 个${thing.zh}。一共有多少个${thing.zh}？`,
              ],
              n,
              [
                [["Write the groups", "写出算式"], [`1 box with ${n} in it:`, `1 个盒子，里面 ${n} 个：`], [times(1, n)]],
                [["Use the rule for 1", "用 1 的规则"], [`One group of ${n} is ${n}:`, `一组 ${n} 就是 ${n}：`], [`${times(1, n)} = ${n}`]],
              ],
              [`Count what is in the one box: ${n} ${thing.en}.`, `数一数这一个盒子里的东西：${n} 个${thing.zh}。`],
              [
                [1, "That counts the box, not the things in it.", "这是盒子的个数，不是里面东西的个数。"],
                [0, "0 is for empty boxes. This box is not empty.", "0 是空盒子的答案。这个盒子不是空的。"],
                [n + 1, "That adds the box to the things.", "这是把盒子也加进去了。"],
              ],
            );
      },
      captioned(arrayFigure(1, 5), "1 row of 5 dots: one group of 5 is 5.", "1 行 5 个点：一组 5 就是 5。"),
    ),
  ],
  "properties-of-multiplication": [
    skill(
      "the-box-in-a-regrouped-product",
      ["The box in a regrouped product", "重新分组后的方框"],
      [
        "$(2 \\times 3) \\times 4 = 2 \\times (\\square \\times 4)$. Both sides use the same three factors. The left has 2, 3 and 4. The right has 2 and 4. So the box is 3.\n\nCheck: $6 \\times 4 = 24$ and $2 \\times 12 = 24$.\n\n> **Watch out.** The box is one factor. Do not put the product $2 \\times 3 = 6$ in it.",
        "$(2 \\times 3) \\times 4 = 2 \\times (\\square \\times 4)$。两边用的是同样的三个因数。左边有 2、3 和 4，右边有 2 和 4，所以方框里是 3。\n\n检验：$6 \\times 4 = 24$，$2 \\times 12 = 24$。\n\n> **注意。** 方框里是一个因数。不要填积 $2 \\times 3 = 6$。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        return solved(
          [
            `What number goes in the box? $$(${times(a, b)}) \\times ${c} = ${a} \\times (\\square \\times ${c})$$`,
            `方框里填几？$$(${times(a, b)}) \\times ${c} = ${a} \\times (\\square \\times ${c})$$`,
          ],
          b,
          [
            [
              ["List the factors on the left", "列出左边的因数"],
              [`The left side uses ${a}, ${b} and ${c}.`, `左边用了 ${a}、${b} 和 ${c}。`],
            ],
            [
              ["Find the one not used", "找出没用到的"],
              [`The right side has ${a} and ${c}, so the box is ${b}.`, `右边有 ${a} 和 ${c}，所以方框里是 ${b}。`],
            ],
          ],
          [
            `$${times(a * b, c)} = ${a * b * c}$ and $${times(a, b * c)} = ${a * b * c}$.`,
            `$${times(a * b, c)} = ${a * b * c}$，$${times(a, b * c)} = ${a * b * c}$。`,
          ],
          [
            [a * b, `That is $${times(a, b)}$, a product, not one factor.`, `这是积 $${times(a, b)}$，不是一个因数。`],
            [b * c, `That is $${times(b, c)}$, the whole inside of the parentheses.`, `这是 $${times(b, c)}$，是整个括号里的积。`],
            [a + c, "That adds the two factors you can see.", "这是把看得到的两个因数相加了。"],
          ],
        );
      },
      captioned(arrayFigure(6, 4), "6 rows of 4 dots: (2 × 3) × 4 = 24.", "6 行，每行 4 个点：(2 × 3) × 4 = 24。"),
    ),
  ],
  "splitting-a-factor-to-multiply": [
    skill(
      "splitting-with-subtraction",
      ["Splitting with subtraction", "用减法拆分"],
      [
        "Find $6 \\times 9$. 9 is one less than 10. $6 \\times 10 = 60$. Then take away one group of 6: $60 - 6 = 54$.\n\nCheck: count by 9s six times: 9, 18, 27, 36, 45, 54.\n\n> **Watch out.** Take away a whole group of 6, not just 1.",
        "求 $6 \\times 9$。9 比 10 少 1。$6 \\times 10 = 60$，再去掉一组 6：$60 - 6 = 54$。\n\n检验：9 个 9 个地数 6 次：9、18、27、36、45、54。\n\n> **注意。** 要去掉整整一组 6，不是只减 1。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const tens = rng.pick([10, 20, 30, 40]);
        const b = tens - 1;
        return solved(
          [`Use $${times(a, tens)}$ to find $${times(a, b)}$.`, `利用 $${times(a, tens)}$ 求 $${times(a, b)}$。`],
          a * b,
          [
            [
              ["Use the round number", "用整十数"],
              [`${b} is one less than ${tens}:`, `${b} 比 ${tens} 少 1：`],
              [`${times(a, tens)} = ${a * tens}`],
            ],
            [
              ["Take away one group", "去掉一组"],
              [`That is one group of ${a} too many:`, `这多了一组 ${a}：`],
              [`${a * tens} - ${a} = ${a * b}`],
            ],
          ],
          [`Put the group back: $${a * b} + ${a} = ${a * tens}$.`, `把那一组加回去：$${a * b} + ${a} = ${a * tens}$。`],
          [
            [a * tens - 1, `That takes away 1, not a group of ${a}.`, `这只减了 1，不是一组 ${a}。`],
            [a * tens + a, `That adds a group, but ${b} is less than ${tens}.`, `这是加了一组，可是 ${b} 比 ${tens} 小。`],
            [a * tens, `That is $${times(a, tens)}$, one group too many.`, `这是 $${times(a, tens)}$，多了一组。`],
          ],
          areaModelFigure(a, [b, 1], ["?", `${a}`]),
        );
      },
      captioned(
        areaModelFigure(6, [9, 1], ["54", "6"]),
        "A 6 by 10 rectangle cut into 6 by 9 and 6 by 1.",
        "一个 6 乘 10 的长方形分成 6 乘 9 和 6 乘 1 两块。",
      ),
    ),
  ],
  "multiplying-by-multiples-of-10": [
    skill(
      "the-missing-multiple-of-ten",
      ["The missing multiple of ten", "缺少的整十因数"],
      [
        "$4 \\times \\square = 240$. Think $4 \\times 6 = 24$. 240 is 24 tens, so the box is 6 tens, which is 60.\n\nCheck: $240 \\div 4 = 60$.\n\n> **Watch out.** The box is 60, not 6. $4 \\times 6$ is only 24.",
        "$4 \\times \\square = 240$。想 $4 \\times 6 = 24$。240 是 24 个十，所以方框里是 6 个十，就是 60。\n\n检验：$240 \\div 4 = 60$。\n\n> **注意。** 方框里是 60，不是 6。$4 \\times 6$ 只有 24。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const p = a * b * 10;
        return solved(
          [`What number goes in the box? $$${a} \\times \\square = ${p}$$`, `方框里填几？$$${a} \\times \\square = ${p}$$`],
          b * 10,
          [
            [
              ["Use the basic fact", "用基本算式"],
              [`${p} is ${a * b} tens, and:`, `${p} 是 ${a * b} 个十，而：`],
              [`${times(a, b)} = ${a * b}`],
            ],
            [["Count in tens", "以十为单位"], [`So the box is ${b} tens:`, `所以方框里是 ${b} 个十：`], [`${times(a, b * 10)} = ${p}`]],
          ],
          [`$${p} \\div ${a} = ${b * 10}$.`, `$${p} \\div ${a} = ${b * 10}$。`],
          [
            [b, `That is the basic fact. $${times(a, b)}$ is only ${a * b}.`, `这是基本算式。$${times(a, b)}$ 只有 ${a * b}。`],
            [b * 100, "That is ten times too big.", "这大了 10 倍。"],
            [a * b, "That is the basic product, not the missing factor.", "这是基本算式的积，不是缺少的因数。"],
          ],
          factTriangleFigure(p, a, null, "×"),
        );
      },
      captioned(factTriangleFigure(240, 4, 60, "×"), "A fact triangle: 4 and 60 make 240.", "算式三角形：4 和 60 相乘得 240。"),
    ),
  ],
  "division-as-sharing": [
    skill(
      "sharing-and-the-whole",
      ["The whole from the shares", "由每份求总数"],
      [
        "Mia shared some stickers among 3 friends, and each got 4. That is 3 shares of 4: $3 \\times 4 = 12$ stickers.\n\nCheck: $12 \\div 3 = 4$ each.\n\n> **Watch out.** Multiply to find the whole. $3 + 4$ is wrong.",
        "Mia 把一些贴纸平均分给 3 个朋友，每人得到 4 张。这是 3 份，每份 4 张：$3 \\times 4 = 12$ 张。\n\n检验：$12 \\div 3 = 4$，每人 4 张。\n\n> **注意。** 求总数要用乘法。$3 + 4$ 是错的。",
      ],
      (rng) => {
        const each = rng.int(2, 9);
        const n = rng.int(2, 9);
        const { who, thing } = storyThing(rng);
        return solved(
          [
            `${who} shared some ${thing.en} equally among ${n} friends, and each friend got ${each}. How many ${thing.en} were shared?`,
            `${who} 把一些${thing.zh}平均分给 ${n} 个朋友，每人得到 ${each} 个。一共分了多少个${thing.zh}？`,
          ],
          each * n,
          [
            [
              ["See the shares", "看清每份"],
              [`${n} friends got ${each} each: ${n} shares of ${each}.`, `${n} 个朋友每人 ${each} 个：${n} 份，每份 ${each} 个。`],
            ],
            [["Multiply", "相乘"], ["The whole:", "总数："], [`${times(n, each)} = ${each * n}`]],
          ],
          [`Share again: $${each * n} \\div ${n} = ${each}$ each.`, `再分一次：$${each * n} \\div ${n} = ${each}$，每人 ${each} 个。`],
          [
            [each + n, `That adds. ${n} shares of ${each} needs multiplying.`, `这是相加。${n} 份每份 ${each} 个要用乘法。`],
            [each * n + n, `That counts ${n} extra.`, `这多算了 ${n} 个。`],
            [each * n + each, "That counts one share too many.", "这多算了一份。"],
          ],
          partWholeBarFigure(
            Array.from({ length: n }, () => each),
            -1,
          ),
        );
      },
      captioned(partWholeBarFigure([4, 4, 4], -2), "Three shares of 4 make 12.", "3 份，每份 4，合起来是 12。"),
    ),
  ],
  "division-as-making-groups": [
    skill(
      "a-group-size-from-the-count",
      ["A group size from the count", "由组数求每组数量"],
      [
        "24 pens fill 6 bags, with the same number in each. $24 \\div 6 = 4$ pens in each bag.\n\nCheck: $6 \\times 4 = 24$.\n\n> **Watch out.** The answer is the size of a bag, 4. It is not the number of bags, 6.",
        "24 支笔正好装满 6 个袋子，每袋一样多。$24 \\div 6 = 4$，每袋 4 支。\n\n检验：$6 \\times 4 = 24$。\n\n> **注意。** 答案是每袋的个数 4，不是袋子的个数 6。",
      ],
      (rng) => {
        const each = rng.int(2, 9);
        let n = rng.int(2, 9);
        if (n === each) n = each === 9 ? 8 : each + 1;
        const { thing } = storyThing(rng);
        return solved(
          [
            `${each * n} ${thing.en} fill ${n} bags, with the same number in each bag. How many ${thing.en} go in each bag?`,
            `${each * n} 个${thing.zh}装满 ${n} 个袋子，每袋数量相同。每袋有多少个${thing.zh}？`,
          ],
          each,
          [
            [
              ["Find the whole and the bags", "找出总数和袋数"],
              [`${each * n} go into ${n} equal bags.`, `${each * n} 个平均装进 ${n} 个袋子。`],
            ],
            [["Divide", "相除"], ["Each bag:", "每袋："], [`${each * n} \\div ${n} = ${each}`]],
          ],
          [`$${times(n, each)} = ${each * n}$.`, `$${times(n, each)} = ${each * n}$。`],
          [
            [n, "That is the number of bags, not the number in each.", "这是袋子的个数，不是每袋的个数。"],
            [each * n - n, `That takes away ${n} instead of dividing.`, `这是减去 ${n}，不是除以 ${n}。`],
            [
              each + 1,
              `That is one too many: $${times(n, each + 1)} = ${n * (each + 1)}$.`,
              `这多了 1：$${times(n, each + 1)} = ${n * (each + 1)}$。`,
            ],
          ],
          partWholeBarFigure(
            Array.from({ length: n }, () => each),
            0,
          ),
        );
      },
      captioned(partWholeBarFigure([4, 4, 4, 4, 4, 4], -2), "24 cut into 6 equal parts of 4.", "24 平均分成 6 份，每份 4。"),
    ),
  ],
  "relating-multiplication-and-division": [
    skill(
      "the-fact-that-does-not-belong",
      ["The fact that does not belong", "不属于这一家的算式"],
      [
        "The family of $4 \\times 6 = 24$ is $4 \\times 6$, $6 \\times 4$, $24 \\div 4$ and $24 \\div 6$. $4 \\div 24 = 6$ is not in it, because 24 must be the number divided.\n\nCheck: $24 \\div 4 = 6$, but 4 cut into 24 parts is much less than 6.\n\n> **Watch out.** In a family division, the biggest number comes first.",
        "$4 \\times 6 = 24$ 这一家是 $4 \\times 6$、$6 \\times 4$、$24 \\div 4$ 和 $24 \\div 6$。$4 \\div 24 = 6$ 不在里面，因为被除数必须是 24。\n\n检验：$24 \\div 4 = 6$，而把 4 分成 24 份，每份比 6 小得多。\n\n> **注意。** 这一家的除法里，最大的数写在最前面。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        let b = rng.int(2, 9);
        if (a === b) b = a === 9 ? 8 : a + 1;
        const p = a * b;
        return pickedMath(
          rng,
          [`Which sentence is not in the same family as $${times(a, b)} = ${p}$?`, `哪个算式与 $${times(a, b)} = ${p}$ 不属于同一家族？`],
          `${a} \\div ${p} = ${b}`,
          [
            [`${times(b, a)} = ${p}`, "This one belongs: swapping the factors keeps the product.", "这个属于这一家：交换因数，积不变。"],
            [
              `${p} \\div ${a} = ${b}`,
              `This one belongs: ${p} shared into ${a} groups gives ${b}.`,
              `这个属于这一家：${p} 平均分成 ${a} 份，每份 ${b}。`,
            ],
            [
              `${p} \\div ${b} = ${a}`,
              `This one belongs: ${p} shared into ${b} groups gives ${a}.`,
              `这个属于这一家：${p} 平均分成 ${b} 份，每份 ${a}。`,
            ],
          ],
          [
            [
              ["Find the three numbers", "找出三个数"],
              [`The family uses ${a}, ${b} and ${p}, and ${p} is the product.`, `这一家用 ${a}、${b} 和 ${p}，${p} 是积。`],
            ],
            [
              ["Look at each division", "看每个除法"],
              [
                `In the family, ${p} is divided. $${a} \\div ${p}$ divides ${a} instead.`,
                `这一家里被除数是 ${p}。$${a} \\div ${p}$ 却是用 ${a} 作被除数。`,
              ],
            ],
          ],
          [
            `$${p} \\div ${a} = ${b}$, so $${a} \\div ${p}$ cannot also be ${b}.`,
            `$${p} \\div ${a} = ${b}$，所以 $${a} \\div ${p}$ 不可能也等于 ${b}。`,
          ],
          factTriangleFigure(p, a, b, "×"),
        );
      },
      captioned(factTriangleFigure(24, 4, 6, "×"), "A fact triangle of 4, 6 and 24.", "4、6 和 24 的算式三角形。"),
    ),
  ],
  "division-facts-to-100": [
    skill(
      "the-divisor-from-a-fact",
      ["The missing number being divided", "缺少的被除数"],
      [
        "$\\square \\div 7 = 6$. The box is the number being divided. Division undoes multiplication, so multiply: $7 \\times 6 = 42$.\n\nCheck: $42 \\div 7 = 6$.\n\n> **Watch out.** Multiply the two numbers you see. Do not divide them.",
        "$\\square \\div 7 = 6$。方框是被除数。除法是乘法的逆运算，所以相乘：$7 \\times 6 = 42$。\n\n检验：$42 \\div 7 = 6$。\n\n> **注意。** 要把看到的两个数相乘，不要相除。",
      ],
      (rng) => {
        const b = rng.int(2, 10);
        const c = rng.int(2, 10);
        return solved(
          [`What number goes in the box? $$\\square \\div ${b} = ${c}$$`, `方框里填几？$$\\square \\div ${b} = ${c}$$`],
          b * c,
          [
            [
              ["See what is missing", "看缺什么"],
              ["The box is the number being divided.", "方框是被除数。"],
            ],
            [["Multiply", "相乘"], [`It is ${b} groups of ${c}:`, `它是 ${b} 组 ${c}：`], [`${times(b, c)} = ${b * c}`]],
          ],
          [`$${b * c} \\div ${b} = ${c}$.`, `$${b * c} \\div ${b} = ${c}$。`],
          [
            [b + c, "That adds the two numbers. Multiply them.", "这是相加。要相乘。"],
            [b * c + b, `That is one group of ${b} too many.`, `这多了一组 ${b}。`],
            [Math.max(b, c), "That is a number you can already see.", "这是题目里已经有的数。"],
          ],
          factTriangleFigure(null, b, c, "×"),
        );
      },
      captioned(factTriangleFigure(42, 7, 6, "×"), "A fact triangle of 7, 6 and 42.", "7、6 和 42 的算式三角形。"),
    ),
  ],
  "multiplication-and-division-word-problems": [
    skill(
      "times-as-many-backwards",
      ["Times as many, backwards", "由几倍求原数"],
      [
        "Ben has 24 cards. That is 4 times as many as Leo has. So 24 is 4 groups the size of Leo's amount: $24 \\div 4 = 6$.\n\nCheck: $4 \\times 6 = 24$.\n\n> **Watch out.** Leo has fewer, so divide. $24 \\times 4$ is far too many.",
        "Ben 有 24 张卡片，是 Leo 的 4 倍。所以 24 是 4 份 Leo 的数量：$24 \\div 4 = 6$。\n\n检验：$4 \\times 6 = 24$。\n\n> **注意。** Leo 的少，所以要除。$24 \\times 4$ 就太多了。",
      ],
      (rng) => {
        const small = rng.int(2, 9);
        const k = rng.int(2, 9);
        const big = small * k;
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        return solved(
          [
            `${p} has ${big} ${thing.en}, which is ${k} times as many as ${q} has. How many ${thing.en} does ${q} have?`,
            `${p} 有 ${big} 个${thing.zh}，是 ${q} 的 ${k} 倍。${q} 有多少个${thing.zh}？`,
          ],
          small,
          [
            [
              ["See the groups", "看出份数"],
              [`${p}'s ${big} is ${k} groups the size of ${q}'s amount.`, `${p} 的 ${big} 个是 ${k} 份 ${q} 的数量。`],
            ],
            [["Divide", "相除"], [`${q} has one group:`, `${q} 有一份：`], [`${big} \\div ${k} = ${small}`]],
          ],
          [`$${times(k, small)} = ${big}$.`, `$${times(k, small)} = ${big}$。`],
          [
            [big * k, `That multiplies. ${q} has fewer, so divide.`, `这是乘法。${q} 的少，要用除法。`],
            [big - k, `That takes away ${k} instead of dividing by ${k}.`, `这是减去 ${k}，不是除以 ${k}。`],
            [big + k, `That adds ${k}. ${q} has fewer.`, `这是加上 ${k}。${q} 的更少。`],
          ],
          partWholeBarFigure(
            Array.from({ length: k }, () => small),
            0,
          ),
        );
      },
      captioned(partWholeBarFigure([6, 6, 6, 6], -2), "24 cut into 4 equal parts of 6.", "24 平均分成 4 份，每份 6。"),
    ),
  ],
  "two-step-word-problems-with-all-operations": [
    skill(
      "the-sentence-for-two-steps",
      ["The sentence for two steps", "两步问题的算式"],
      [
        "Zoe has 3 packs of 8 cards and gives away 4. First the packs: $3 \\times 8 = 24$. Then take away 4. So $n = (3 \\times 8) - 4 = 20$.\n\nCheck: $20 + 4 = 24$, all the cards again.\n\n> **Watch out.** Giving away means subtract. Put the first step in parentheses.",
        "Zoe 有 3 包卡片，每包 8 张，送出 4 张。先算包里的：$3 \\times 8 = 24$。再减去 4。所以 $n = (3 \\times 8) - 4 = 20$。\n\n检验：$20 + 4 = 24$，又是全部的卡片。\n\n> **注意。** 送出要用减法。先算的那一步加上括号。",
      ],
      (rng) => {
        const packs = rng.int(2, 9);
        const per = rng.int(3, 9);
        const total = packs * per;
        const more = rng.int(2, Math.min(20, total - 1));
        const { who, thing } = storyThing(rng);
        return pickedMath(
          rng,
          [
            `${who} has ${packs} packs with ${per} ${thing.en} in each and gives away ${more}. Which equation gives $n$, the number left?`,
            `${who} 有 ${packs} 包${thing.zh}，每包 ${per} 个，送出 ${more} 个。哪个方程能求出剩下的数量 $n$？`,
          ],
          `n = (${times(packs, per)}) - ${more}`,
          [
            [
              `n = (${packs} + ${per}) - ${more}`,
              `That adds ${packs} and ${per}. ${packs} packs of ${per} need multiplying.`,
              `这是把 ${packs} 和 ${per} 相加。${packs} 包每包 ${per} 个要用乘法。`,
            ],
            [`n = (${times(packs, per)}) + ${more}`, "Giving away takes things away, so subtract.", "送出是拿走，要用减法。"],
            [`n = ${packs} \\times (${per} + ${more})`, `That puts ${more} more in each pack.`, `这是每包再多放 ${more} 个。`],
          ],
          [
            [["Count what the packs hold", "求包里的数量"], ["The packs hold:", "包里一共有："], [`${times(packs, per)} = ${total}`]],
            [
              ["Take away what is given", "减去送出的"],
              [`Giving away ${more} subtracts:`, `送出 ${more} 个就减去：`],
              [`n = ${total} - ${more} = ${total - more}`],
            ],
          ],
          [
            `$${total - more} + ${more} = ${total}$, all the ${thing.en} again.`,
            `$${total - more} + ${more} = ${total}$，又是全部的${thing.zh}。`,
          ],
          partWholeBarFigure([total - more, more], 0),
        );
      },
      captioned(partWholeBarFigure([20, 4], -2), "24 cut into 20 left and 4 given away.", "24 分成剩下的 20 和送出的 4。"),
    ),
  ],
  "expressions-with-two-operations": [
    skill(
      "subtraction-and-multiplication-together",
      ["Subtraction and multiplication together", "减法和乘法同时出现"],
      [
        "$30 - 4 \\times 5$. Multiply first: $4 \\times 5 = 20$. Then $30 - 20 = 10$.\n\nCheck: $10 + 20 = 30$.\n\n> **Watch out.** Do not work left to right. Doing $30 - 4 = 26$ first gives the wrong answer.",
        "$30 - 4 \\times 5$。先算乘法：$4 \\times 5 = 20$。再算 $30 - 20 = 10$。\n\n检验：$10 + 20 = 30$。\n\n> **注意。** 不能从左往右算。先算 $30 - 4 = 26$ 就错了。",
      ],
      (rng) => {
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const a = b * c + rng.int(1, 30);
        return solved(
          [`What is $${a} - ${times(b, c)}$?`, `$${a} - ${times(b, c)}$ 是多少？`],
          a - b * c,
          [
            [["Multiply first", "先算乘法"], ["", ""], [`${times(b, c)} = ${b * c}`]],
            [["Then subtract", "再算减法"], ["", ""], [`${a} - ${b * c} = ${a - b * c}`]],
          ],
          [`$${a - b * c} + ${b * c} = ${a}$.`, `$${a - b * c} + ${b * c} = ${a}$。`],
          [
            [(a - b) * c, "That subtracts first. Multiply first.", "这是先算了减法。要先算乘法。"],
            [a - b - c, "That subtracts both numbers instead of multiplying them.", "这是把两个数都减掉了，没有相乘。"],
            [a + b * c, "That adds the product. The sign is minus.", "这是加上了积。符号是减号。"],
          ],
          partWholeBarFigure([a - b * c, b * c], 0),
        );
      },
      captioned(partWholeBarFigure([10, 20], -2), "30 cut into 10 and 20.", "30 分成 10 和 20。"),
    ),
  ],
  "arithmetic-patterns": [
    skill(
      "patterns-in-a-times-table",
      ["Patterns in a times table", "乘法表中的规律"],
      [
        "Is 45 a multiple of 5? Multiples of 5 go 5, 10, 15, 20, … and all end in 0 or 5. 45 ends in 5, so yes.\n\nCheck: $45 \\div 5 = 9$, with nothing left over.\n\n> **Watch out.** Look at the last digit, not the first. 54 starts with 5, but it is not a multiple of 5.",
        "45 是 5 的倍数吗？5 的倍数是 5、10、15、20……个位都是 0 或 5。45 的个位是 5，所以是。\n\n检验：$45 \\div 5 = 9$，没有剩余。\n\n> **注意。** 看个位，不是看第一位。54 的第一位是 5，但它不是 5 的倍数。",
      ],
      (rng) => {
        const k = rng.pick([2, 5, 10]);
        const right = k * rng.int(5, 40);
        const off = (x: number) => (k === 2 ? x * 2 + 1 : k === 5 ? x * 5 + rng.pick([1, 2, 3, 4]) : x * 10 + rng.int(1, 9));
        const others = [off(rng.int(5, 40)), off(rng.int(41, 80)), off(rng.int(81, 120))];
        const rule: Pair =
          k === 2 ? ["ends in an even digit", "个位是偶数"] : k === 5 ? ["ends in 0 or 5", "个位是 0 或 5"] : ["ends in 0", "个位是 0"];
        const wrong = others.map(
          (o): Wrong => [
            [`${o}`, `${o}`],
            k === 2 ? `${o} ends in ${o % 10}, which is odd.` : `${o} ends in ${o % 10}, not ${k === 5 ? "0 or 5" : "0"}.`,
            k === 2 ? `${o} 的个位是 ${o % 10}，是奇数。` : `${o} 的个位是 ${o % 10}，不是 ${k === 5 ? "0 或 5" : "0"}。`,
          ],
        );
        return picked(
          rng,
          [`Which of these numbers is a multiple of ${k}?`, `下面哪个数是 ${k} 的倍数？`],
          [`${right}`, `${right}`],
          wrong,
          [
            [
              ["Recall the pattern", "回想规律"],
              [`Every multiple of ${k} ${rule[0]}.`, `${k} 的倍数${rule[1]}。`],
            ],
            [
              ["Look at the last digits", "看个位"],
              [`Of these, only ${right} does.`, `这些数中只有 ${right} 符合。`],
            ],
          ],
          [`$${right} \\div ${k} = ${right / k}$, with nothing left over.`, `$${right} \\div ${k} = ${right / k}$，没有剩余。`],
        );
      },
      captioned(hopsFigure([0, 5, 10, 15, 20]), "Hops of 5 from 0: 5, 10, 15, 20.", "从 0 开始每次跳 5：5、10、15、20。"),
    ),
  ],
  "understanding-three-digit-numbers": [
    skill(
      "ten-or-a-hundred-more-in-a-digit",
      ["The digit that changes", "哪个数字变了"],
      [
        "What is the tens digit of $342 + 10$? Adding 10 adds one ten, so 4 tens become 5 tens. $342 + 10 = 352$, and the tens digit is 5.\n\nCheck: $352 - 10 = 342$.\n\n> **Watch out.** Adding 10 changes the tens digit. The ones digit stays the same.",
        "$342 + 10$ 的十位数字是几？加 10 就是多一个十，4 个十变成 5 个十。$342 + 10 = 352$，十位数字是 5。\n\n检验：$352 - 10 = 342$。\n\n> **注意。** 加 10 变的是十位，个位不变。",
      ],
      (rng) => {
        const h = rng.int(1, 8);
        const te = rng.int(0, 8);
        const o = rng.int(0, 9);
        const n = h * 100 + te * 10 + o;
        const hundred = rng.bool();
        const add = hundred ? 100 : 10;
        const place: Pair = hundred ? ["hundreds", "百"] : ["tens", "十"];
        return solved(
          [`What is the ${place[0]} digit of $${n} + ${add}$?`, `$${n} + ${add}$ 的${place[1]}位数字是几？`],
          hundred ? h + 1 : te + 1,
          [
            [
              ["Add", "相加"],
              [`Adding ${add} adds one ${hundred ? "hundred" : "ten"}:`, `加 ${add} 就是多一个${place[1]}：`],
              [`${n} + ${add} = ${n + add}`],
            ],
            [
              ["Read the digit", "读出数字"],
              [
                `The ${place[0]} digit of ${n + add} is ${hundred ? h + 1 : te + 1}.`,
                `${n + add} 的${place[1]}位数字是 ${hundred ? h + 1 : te + 1}。`,
              ],
            ],
          ],
          [
            `$${n + add} - ${add} = ${n}$, and only the ${place[0]} digit changed.`,
            `$${n + add} - ${add} = ${n}$，只有${place[1]}位变了。`,
          ],
          hundred
            ? [
                [h, "That is the hundreds digit before adding 100.", "这是加 100 以前的百位数字。"],
                [te, "That is the tens digit.", "这是十位数字。"],
                [o, "That is the ones digit.", "这是个位数字。"],
              ]
            : [
                [te, "That is the tens digit before adding 10.", "这是加 10 以前的十位数字。"],
                [h, "That is the hundreds digit.", "这是百位数字。"],
                [o, "That is the ones digit.", "这是个位数字。"],
              ],
          baseTenFigure(h, te, o),
        );
      },
      captioned(baseTenFigure(3, 4, 2), "3 hundreds, 4 tens and 2 ones make 342.", "3 个百、4 个十和 2 个一组成 342。"),
    ),
  ],
  "rounding-to-the-nearest-ten": [
    skill(
      "the-largest-that-rounds-to-a-ten",
      ["The largest that rounds to a ten", "四舍五入到某个十的最大数"],
      [
        "Which whole numbers round to 40? The halfway points are 35 and 45. 35 rounds up to 40, and 45 rounds up to 50. So 35 to 44 round to 40, and the largest is 44.\n\nCheck: 44 is 4 from 40 and 6 from 50, so it is closer to 40.\n\n> **Watch out.** 45 does not round to 40. A 5 in the ones place rounds up.",
        "哪些整数四舍五入后是 40？中点是 35 和 45。35 入到 40，45 入到 50。所以 35 到 44 都四舍五入为 40，最大是 44。\n\n检验：44 离 40 是 4，离 50 是 6，所以更接近 40。\n\n> **注意。** 45 不会舍到 40。个位是 5 要向上入。",
      ],
      (rng) => {
        const tens = rng.int(2, 90) * 10;
        const largest = rng.bool();
        return largest
          ? solved(
              [
                `A whole number rounds to ${tens} when rounded to the nearest ten. What is the largest it could be?`,
                `一个整数四舍五入到十位后是 ${tens}。它最大可能是多少？`,
              ],
              tens + 4,
              [
                [
                  ["Find the halfway point", "找出中点"],
                  [
                    `Halfway between ${tens} and ${tens + 10} is ${tens + 5}, and it rounds up.`,
                    `${tens} 和 ${tens + 10} 的中点是 ${tens + 5}，它要向上入。`,
                  ],
                ],
                [["Stay below it", "比它小一点"], ["The largest is one less:", "最大的数比它小 1："], [`${tens + 5} - 1 = ${tens + 4}`]],
              ],
              [
                `${tens + 4} is 4 from ${tens} and 6 from ${tens + 10}, so it rounds to ${tens}.`,
                `${tens + 4} 离 ${tens} 是 4，离 ${tens + 10} 是 6，所以四舍五入为 ${tens}。`,
              ],
              [
                [tens + 5, `${tens + 5} rounds up to ${tens + 10}.`, `${tens + 5} 要入到 ${tens + 10}。`],
                [tens + 9, `${tens + 9} is closer to ${tens + 10}.`, `${tens + 9} 更接近 ${tens + 10}。`],
                [
                  tens - 5,
                  `That is the smallest number that rounds to ${tens}, not the largest.`,
                  `这是四舍五入为 ${tens} 的最小数，不是最大数。`,
                ],
              ],
              numberLineFigure(tens - 10, tens + 10, 5),
            )
          : solved(
              [
                `A whole number rounds to ${tens} when rounded to the nearest ten. What is the smallest it could be?`,
                `一个整数四舍五入到十位后是 ${tens}。它最小可能是多少？`,
              ],
              tens - 5,
              [
                [
                  ["Find the halfway point", "找出中点"],
                  [`Halfway between ${tens - 10} and ${tens} is ${tens - 5}.`, `${tens - 10} 和 ${tens} 的中点是 ${tens - 5}。`],
                ],
                [
                  ["Round the halfway point", "看中点怎么入"],
                  [`A 5 rounds up, so ${tens - 5} rounds up to ${tens}.`, `个位是 5 要向上入，所以 ${tens - 5} 入到 ${tens}。`],
                ],
              ],
              [
                `One less, ${tens - 6}, rounds down to ${tens - 10}, so ${tens - 5} is the smallest.`,
                `再小 1 的 ${tens - 6} 舍到 ${tens - 10}，所以 ${tens - 5} 最小。`,
              ],
              [
                [tens - 4, `${tens - 5} also rounds to ${tens}, and it is smaller.`, `${tens - 5} 也四舍五入为 ${tens}，而且更小。`],
                [tens - 9, `${tens - 9} is closer to ${tens - 10}.`, `${tens - 9} 更接近 ${tens - 10}。`],
                [
                  tens + 4,
                  `That is the largest number that rounds to ${tens}, not the smallest.`,
                  `这是四舍五入为 ${tens} 的最大数，不是最小数。`,
                ],
              ],
              numberLineFigure(tens - 10, tens + 10, 5),
            );
      },
      captioned(
        numberLineFigure(30, 50, 5),
        "A number line from 30 to 50, with 35 and 45 halfway between the tens.",
        "从 30 到 50 的数轴，35 和 45 在两个整十数的中间。",
      ),
    ),
  ],
  "rounding-to-the-nearest-hundred": [
    skill(
      "estimating-with-hundreds",
      ["Estimating with hundreds", "用整百估算"],
      [
        "Estimate $289 + 412$. 289 rounds to 300 and 412 rounds to 400. $300 + 400 = 700$.\n\nCheck: the exact sum is $289 + 412 = 701$, close to 700.\n\n> **Watch out.** Round first, then add. 289 rounds up to 300, not down to 200.",
        "估算 $289 + 412$。289 约等于 300，412 约等于 400。$300 + 400 = 700$。\n\n检验：准确的和是 $289 + 412 = 701$，接近 700。\n\n> **注意。** 先四舍五入，再相加。289 要入到 300，不是舍到 200。",
      ],
      (rng) => {
        const a = rng.int(120, 480);
        const b = rng.int(120, 480);
        const ra = Math.round(a / 100) * 100;
        const rb = Math.round(b / 100) * 100;
        return solved(
          [
            `Round each number to the nearest hundred to estimate $${a} + ${b}$. What is the estimate?`,
            `把每个数四舍五入到百位，估算 $${a} + ${b}$。估算结果是多少？`,
          ],
          ra + rb,
          [
            [
              ["Round each number", "把每个数四舍五入"],
              [`${a} rounds to ${ra} and ${b} rounds to ${rb}.`, `${a} 约等于 ${ra}，${b} 约等于 ${rb}。`],
            ],
            [["Add the hundreds", "整百相加"], ["", ""], [`${ra} + ${rb} = ${ra + rb}`]],
          ],
          [`The exact sum, $${a} + ${b} = ${a + b}$, is close to ${ra + rb}.`, `准确的和 $${a} + ${b} = ${a + b}$，接近 ${ra + rb}。`],
          [
            [a + b, "That is the exact sum, not the estimate.", "这是准确的和，不是估算结果。"],
            [ra + rb + 100, "That rounds one number up when it should go down.", "这是把一个该舍的数入上去了。"],
            [ra + rb - 100, "That rounds one number down when it should go up.", "这是把一个该入的数舍掉了。"],
          ],
          partWholeBarFigure([ra, rb], -1),
        );
      },
      captioned(partWholeBarFigure([300, 400], -2), "A bar of 700 cut into 300 and 400.", "一个 700 的长条分成 300 和 400。"),
    ),
  ],
  "adding-within-1000": [
    skill(
      "three-addends-within-1000",
      ["Three addends within 1000", "1000 以内三个数相加"],
      [
        "$215 + 130 + 342$. First $215 + 130 = 345$. Then $345 + 342 = 687$.\n\nCheck: add in another order. $130 + 342 = 472$, and $472 + 215 = 687$.\n\n> **Watch out.** Add all three numbers. Stopping after two leaves one out.",
        "$215 + 130 + 342$。先算 $215 + 130 = 345$，再算 $345 + 342 = 687$。\n\n检验：换个顺序加。$130 + 342 = 472$，$472 + 215 = 687$。\n\n> **注意。** 三个数都要加。只加两个就漏了一个。",
      ],
      (rng) => {
        const a = rng.int(101, 299);
        const b = rng.int(101, 299);
        const c = rng.int(101, 399);
        return solved(
          [`What is $${a} + ${b} + ${c}$?`, `$${a} + ${b} + ${c}$ 是多少？`],
          a + b + c,
          [
            [["Add the first two", "先加前两个"], ["", ""], [`${a} + ${b} = ${a + b}`]],
            [["Add the third", "再加第三个"], ["", ""], [`${a + b} + ${c} = ${a + b + c}`]],
          ],
          [
            `In another order: $${b} + ${c} = ${b + c}$, and $${b + c} + ${a} = ${a + b + c}$.`,
            `换个顺序：$${b} + ${c} = ${b + c}$，$${b + c} + ${a} = ${a + b + c}$。`,
          ],
          [
            [a + b, `That leaves out ${c}.`, `这漏掉了 ${c}。`],
            [a + b + c + 100, "That carries one hundred too many.", "这多进了一个百。"],
            [a + b + c - 10, "That loses a ten that was carried.", "这漏掉了进上去的一个十。"],
          ],
          partWholeBarFigure([a, b, c], -1),
        );
      },
      captioned(
        partWholeBarFigure([215, 130, 342], -2),
        "A bar of 687 cut into 215, 130 and 342.",
        "一个 687 的长条分成 215、130 和 342。",
      ),
    ),
  ],
  "subtracting-within-1000": [
    skill(
      "checking-a-difference-by-adding",
      ["Checking a difference by adding", "用加法验算差"],
      [
        "Lily found $523 - 148 = 375$. To check, add the parts back: $375 + 148 = 523$. That is the start, so the answer is right.\n\nCheck: count up from 148. $148 + 2 = 150$, $150 + 350 = 500$, $500 + 23 = 523$, and $2 + 350 + 23 = 375$.\n\n> **Watch out.** Add the answer to the number taken away, 148. Adding it to 523 checks nothing.",
        "Lily 算得 $523 - 148 = 375$。验算时把两部分加回去：$375 + 148 = 523$。正好是开始的数，所以答案对。\n\n检验：从 148 往上数。$148 + 2 = 150$，$150 + 350 = 500$，$500 + 23 = 523$，而 $2 + 350 + 23 = 375$。\n\n> **注意。** 要把差和减去的数 148 相加。把差加到 523 上什么也检验不了。",
      ],
      (rng) => {
        const a = rng.int(310, 990);
        const b = rng.int(110, a - 110);
        const diff = a - b;
        const who = rng.pick(earlyNames);
        return solved(
          [
            `${who} found that $${a} - ${b} = ${diff}$. To check, what should $${diff} + ${b}$ equal?`,
            `${who} 算得 $${a} - ${b} = ${diff}$。为了验算，$${diff} + ${b}$ 应该等于多少？`,
          ],
          a,
          [
            [
              ["See the parts", "看出两部分"],
              [`${diff} and ${b} are the two parts of ${a}.`, `${diff} 和 ${b} 是 ${a} 的两部分。`],
            ],
            [["Put them together", "合起来"], ["", ""], [`${diff} + ${b} = ${a}`]],
          ],
          [`$${a} - ${b} = ${diff}$, as ${who} found.`, `$${a} - ${b} = ${diff}$，和 ${who} 算的一样。`],
          [
            [diff, "That is the difference, not the start.", "这是差，不是开始的数。"],
            [b, "That is the part taken away.", "这是减去的部分。"],
            [a + 10, "That carries one ten too many.", "这多进了一个十。"],
          ],
          partWholeBarFigure([diff, b], -1),
        );
      },
      captioned(partWholeBarFigure([375, 148], -2), "A bar of 523 cut into 375 and 148.", "一个 523 的长条分成 375 和 148。"),
    ),
  ],
  "unit-fractions": [
    skill(
      "a-unit-fraction-of-a-number",
      ["A unit fraction of a number", "一个数的几分之一"],
      [
        "Sam has 12 shells and gives away $\\frac{1}{3}$ of them. Split 12 into 3 equal parts: $12 \\div 3 = 4$. One part is 4 shells.\n\nCheck: $3 \\times 4 = 12$.\n\n> **Watch out.** $\\frac{1}{3}$ of 12 is the size of one part, 4. It is not 3, the number of parts.",
        "Sam 有 12 个贝壳，送出其中的 $\\frac{1}{3}$。把 12 平均分成 3 份：$12 \\div 3 = 4$。一份是 4 个贝壳。\n\n检验：$3 \\times 4 = 12$。\n\n> **注意。** 12 的 $\\frac{1}{3}$ 是一份的大小 4，不是份数 3。",
      ],
      (rng) => {
        const d = rng.int(2, 8);
        const each = rng.int(2, 10);
        const total = d * each;
        const { who, thing } = storyThing(rng);
        return solved(
          [
            `${who} has ${total} ${thing.en} and gives away $\\frac{1}{${d}}$ of them. How many does ${who} give away?`,
            `${who} 有 ${total} 个${thing.zh}，送出其中的 $\\frac{1}{${d}}$。送出了多少个？`,
          ],
          each,
          [
            [
              ["Split into equal parts", "平均分"],
              [`$\\frac{1}{${d}}$ means ${d} equal parts:`, `$\\frac{1}{${d}}$ 表示平均分成 ${d} 份：`],
              [`${total} \\div ${d} = ${each}`],
            ],
            [
              ["Take one part", "取一份"],
              [`One part is ${each}.`, `一份是 ${each} 个。`],
            ],
          ],
          [`$${times(d, each)} = ${total}$.`, `$${times(d, each)} = ${total}$。`],
          [
            [total - each, "That is what is left, not what was given away.", "这是剩下的，不是送出的。"],
            [d, "That is the number of parts, not the size of one part.", "这是份数，不是一份的大小。"],
            [each + d, `That adds ${d} to one part.`, `这是在一份上又加了 ${d}。`],
          ],
          partWholeBarFigure(
            Array.from({ length: d }, () => each),
            0,
          ),
        );
      },
      captioned(partWholeBarFigure([4, 4, 4], -2), "12 cut into 3 equal parts of 4.", "12 平均分成 3 份，每份 4。"),
    ),
  ],
  "fractions-as-parts-of-a-whole": [
    skill(
      "the-part-not-shaded",
      ["The part not shaded", "没有涂色的部分"],
      [
        "A bar has 8 equal parts, and 3 are shaded. The rest are not: $8 - 3 = 5$. So $\\frac{5}{8}$ of the bar is not shaded.\n\nCheck: $\\frac{3}{8} + \\frac{5}{8} = \\frac{8}{8}$, the whole bar.\n\n> **Watch out.** The bottom number stays 8. Only the number of parts on top changes.",
        "一个长条平均分成 8 份，3 份涂了色。剩下的没涂色：$8 - 3 = 5$。所以长条的 $\\frac{5}{8}$ 没有涂色。\n\n检验：$\\frac{3}{8} + \\frac{5}{8} = \\frac{8}{8}$，是整个长条。\n\n> **注意。** 分母还是 8。只有上面的份数变了。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const n = rng.int(1, d - 1);
        return solved(
          [
            `A bar is cut into ${d} equal parts, and $\\frac{${n}}{${d}}$ of it is shaded. The part not shaded is $\\frac{a}{${d}}$. What is $a$?`,
            `一个长条被平均分成 ${d} 份，其中 $\\frac{${n}}{${d}}$ 涂了色。没有涂色的部分是 $\\frac{a}{${d}}$。$a$ 是多少？`,
          ],
          d - n,
          [
            [
              ["Count all the parts", "数出全部份数"],
              [`The whole bar is ${d} parts.`, `整个长条是 ${d} 份。`],
            ],
            [["Take away the shaded parts", "减去涂色的份数"], ["", ""], [`${d} - ${n} = ${d - n}`]],
          ],
          [
            `$\\frac{${n}}{${d}} + \\frac{${d - n}}{${d}} = \\frac{${d}}{${d}}$, the whole bar.`,
            `$\\frac{${n}}{${d}} + \\frac{${d - n}}{${d}} = \\frac{${d}}{${d}}$，是整个长条。`,
          ],
          [
            [n, "That is the shaded part.", "这是涂色的部分。"],
            [d, "That is all the parts, not the ones left.", "这是全部的份数，不是剩下的。"],
            [d - n + 1, "That counts one part too many.", "这多数了一份。"],
          ],
          gridFigure(1, d, n),
        );
      },
      captioned(gridFigure(1, 8, 3), "A bar of 8 equal parts with 3 shaded.", "一个平均分成 8 份的长条，3 份涂了色。"),
    ),
  ],
  "fractions-on-the-number-line": [
    {
      ...skill(
        "the-point-past-one",
        ["A point past one", "超过 1 的点"],
        [
          "Each whole has 4 equal parts. Count 5 parts from 0. 1 is 4 parts, and 1 more part makes 5. So the point is $\\frac{5}{4}$, between 1 and 2.\n\nCheck: 2 is 8 parts, and $8 - 3 = 5$.\n\n> **Watch out.** Count the parts from 0, not from 1. Starting at 1 gives $\\frac{1}{4}$.",
          "每个单位平均分成 4 份。从 0 开始数 5 份。1 是 4 份，再多 1 份就是 5 份。所以这个点是 $\\frac{5}{4}$，在 1 和 2 之间。\n\n检验：2 是 8 份，$8 - 3 = 5$。\n\n> **注意。** 要从 0 开始数，不是从 1 开始。从 1 开始数会得到 $\\frac{1}{4}$。",
        ],
        (rng) => {
          const d = rng.int(2, 8);
          const k = rng.int(1, 2);
          const extra = rng.int(1, d - 1);
          const n = k * d + extra;
          return solved(
            [
              `Each space from one whole number to the next on a number line is cut into ${d} equal parts. A point is ${extra} part${extra > 1 ? "s" : ""} past ${k}. It is at $\\frac{a}{${d}}$. What is $a$?`,
              `数轴上每两个相邻整数之间都平均分成 ${d} 份。一个点在 ${k} 之后 ${extra} 份。它的位置是 $\\frac{a}{${d}}$。$a$ 是多少？`,
            ],
            n,
            [
              [
                ["Count the parts up to the whole number", "数到整数的份数"],
                [`${k} is ${k} whole${k > 1 ? "s" : ""} of ${d} parts:`, `${k} 是 ${k} 个单位，每个 ${d} 份：`],
                [`${times(k, d)} = ${k * d}`],
              ],
              [["Add the extra parts", "加上多出的份数"], ["", ""], [`${k * d} + ${extra} = ${n}`]],
            ],
            [
              `${k + 1} is ${(k + 1) * d} parts, and going back ${d - extra} gives $${(k + 1) * d} - ${d - extra} = ${n}$.`,
              `${k + 1} 是 ${(k + 1) * d} 份，往回数 ${d - extra} 份：$${(k + 1) * d} - ${d - extra} = ${n}$。`,
            ],
            [
              [extra, `That counts only the parts past ${k}. Count from 0.`, `这只数了 ${k} 之后的份数。要从 0 开始数。`],
              [k + extra, "That counts each whole as one part.", "这是把一个单位当成一份了。"],
              [n + d, "That is one whole too far.", "这多了一个单位。"],
            ],
            fractionLineFigure(k + 1, d, n),
          );
        },
      ),
      figure: gradeDrawings2["fractions-on-the-number-line#the-point-past-one"],
    },
  ],
  "equal-fractions-with-pictures": [
    skill(
      "a-whole-in-different-parts",
      ["A whole in different parts", "用不同份数表示 1"],
      [
        "$\\frac{6}{6} = \\frac{\\square}{9}$. $\\frac{6}{6}$ takes all 6 parts, so it is one whole. One whole cut into 9 parts has all 9 of them. So the box is 9.\n\nCheck: $\\frac{9}{9}$ also takes every part, so it is 1 too.\n\n> **Watch out.** The box is not 6. The new whole has 9 parts.",
        "$\\frac{6}{6} = \\frac{\\square}{9}$。$\\frac{6}{6}$ 取了全部 6 份，所以是 1。把 1 分成 9 份，全部就是 9 份。所以方框里是 9。\n\n检验：$\\frac{9}{9}$ 也取了每一份，所以也是 1。\n\n> **注意。** 方框里不是 6。新的整体有 9 份。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const e = rng.int(2, 12);
        const n = e === d ? e + 1 : e;
        return solved(
          [
            `What number goes in the box? $$\\frac{${d}}{${d}} = \\frac{\\square}{${n}}$$`,
            `方框里填几？$$\\frac{${d}}{${d}} = \\frac{\\square}{${n}}$$`,
          ],
          n,
          [
            [
              ["See the whole", "看出整体"],
              [`$\\frac{${d}}{${d}}$ takes all ${d} parts, so it is 1.`, `$\\frac{${d}}{${d}}$ 取了全部 ${d} 份，所以是 1。`],
            ],
            [
              ["Write 1 with the new parts", "用新的份数写 1"],
              [`One whole cut into ${n} parts has all ${n}:`, `把 1 分成 ${n} 份，全部是 ${n} 份：`],
              [`\\frac{${n}}{${n}} = 1`],
            ],
          ],
          [
            `Both bars are fully shaded: $\\frac{${d}}{${d}} = 1 = \\frac{${n}}{${n}}$.`,
            `两个长条都涂满了：$\\frac{${d}}{${d}} = 1 = \\frac{${n}}{${n}}$。`,
          ],
          [
            [d, `That keeps the old number of parts. The new whole has ${n}.`, `这还是原来的份数。新的整体有 ${n} 份。`],
            [1, "That is the value, 1, not the number of parts.", "这是分数的大小 1，不是份数。"],
            [n + 1, "That is more than one whole.", "这比 1 还多。"],
          ],
          gridFigure(1, d, d),
        );
      },
      captioned(gridFigure(1, 6, 6), "A bar of 6 equal parts, all shaded: one whole.", "一个平均分成 6 份的长条，全部涂色：就是 1。"),
    ),
  ],
  "comparing-fractions-with-a-common-part": [
    skill(
      "ordering-with-a-common-part",
      ["Ordering with a common part", "有相同部分的分数排序"],
      [
        "Which is greatest: $\\frac{1}{4}$, $\\frac{1}{8}$ or $\\frac{1}{3}$? Each takes 1 part. Fewer cuts make bigger parts, so $\\frac{1}{3}$ is greatest.\n\nCheck: on number lines, $\\frac{1}{3}$ lies farther from 0 than $\\frac{1}{8}$.\n\n> **Watch out.** A bigger bottom number means smaller parts. $\\frac{1}{8}$ is the least.",
        "哪个最大：$\\frac{1}{4}$、$\\frac{1}{8}$ 还是 $\\frac{1}{3}$？每个都只取 1 份。分的份数越少，每份越大，所以 $\\frac{1}{3}$ 最大。\n\n检验：在数轴上，$\\frac{1}{3}$ 比 $\\frac{1}{8}$ 离 0 更远。\n\n> **注意。** 分母越大，每份越小。$\\frac{1}{8}$ 最小。",
      ],
      (rng) => {
        const sameBottom = rng.bool();
        const greatest = rng.bool();
        const nums = rng.sample([1, 2, 3, 4, 5, 6, 7], 4);
        const dens = rng.sample([2, 3, 4, 5, 6, 8, 10, 12], 4);
        const d = rng.int(8, 12);
        const items = sameBottom ? nums.map((x) => ({ a: x, b: d })) : dens.map((x) => ({ a: 1, b: x }));
        const value = (x: { a: number; b: number }) => x.a / x.b;
        const ordered = [...items].sort((x, y) => value(x) - value(y));
        const answer = (greatest ? ordered[ordered.length - 1] : ordered[0]) ?? { a: 1, b: d };
        const show = (x: { a: number; b: number }) => `\\frac{${x.a}}{${x.b}}`;
        return pickedMath(
          rng,
          greatest
            ? ["Which of these fractions is the greatest?", "下面哪个分数最大？"]
            : ["Which of these fractions is the least?", "下面哪个分数最小？"],
          show(answer),
          items
            .filter((x) => x !== answer)
            .map((x) =>
              sameBottom
                ? [
                    show(x),
                    `${x.a} ${x.a === 1 ? "part is" : "parts are"} ${greatest ? "fewer" : "more"} than ${answer.a} ${answer.a === 1 ? "part" : "parts"} of the same size.`,
                    `${x.a} 份比同样大小的 ${answer.a} 份${greatest ? "少" : "多"}。`,
                  ]
                : [
                    show(x),
                    `Parts of ${x.b} are ${greatest ? "smaller" : "larger"} than parts of ${answer.b}.`,
                    `分成 ${x.b} 份，每份比分成 ${answer.b} 份${greatest ? "小" : "大"}。`,
                  ],
            ),
          sameBottom
            ? [
                [
                  ["See what is shared", "看哪部分相同"],
                  [`All have denominator ${d}, so the parts are the same size.`, `分母都是 ${d}，所以每份一样大。`],
                ],
                [
                  ["Compare the parts taken", "比较份数"],
                  [
                    `${greatest ? "More" : "Fewer"} parts make ${greatest ? "more" : "less"}, and ${answer.a} is the ${greatest ? "most" : "fewest"}.`,
                    `份数${greatest ? "多的大" : "少的小"}，${answer.a} 份${greatest ? "最多" : "最少"}。`,
                  ],
                ],
              ]
            : [
                [
                  ["See what is shared", "看哪部分相同"],
                  ["All take 1 part, so the size of a part decides.", "都只取 1 份，所以由每份的大小决定。"],
                ],
                [
                  ["Compare the parts", "比较每份大小"],
                  [
                    `Fewer cuts make bigger parts, so denominator ${answer.b} gives the ${greatest ? "largest" : "smallest"} part.`,
                    `分的份数越少，每份越大，所以分母 ${answer.b} 的一份${greatest ? "最大" : "最小"}。`,
                  ],
                ],
              ],
          [`In order: $${ordered.map(show).join(" < ")}$.`, `从小到大：$${ordered.map(show).join(" < ")}$。`],
        );
      },
      captioned(
        twoFractionLinesFigure(3, 1, 8, 1),
        "Two number lines from 0 to 1: 1/3 lies farther from 0 than 1/8.",
        "两条从 0 到 1 的数轴：1/3 比 1/8 离 0 更远。",
      ),
    ),
  ],
  "telling-time-to-the-minute": [
    skill(
      "minutes-before-the-next-hour",
      ["Minutes before the next hour", "还有几分钟到下一个整点"],
      [
        "It is 4:47. An hour has 60 minutes, and 47 have passed. $60 - 47 = 13$ minutes to 5:00.\n\nCheck: $47 + 13 = 60$, a full hour.\n\n> **Watch out.** An hour has 60 minutes, not 100. $100 - 47$ is wrong.",
        "现在是 4:47。一小时有 60 分钟，已经过了 47 分钟。$60 - 47 = 13$，还有 13 分钟到 5:00。\n\n检验：$47 + 13 = 60$，正好一小时。\n\n> **注意。** 一小时是 60 分钟，不是 100 分钟。$100 - 47$ 是错的。",
      ],
      (rng) => {
        const h = rng.int(1, 11);
        const m = rng.int(6, 59);
        const time = `${h}:${String(m).padStart(2, "0")}`;
        return solved(
          [`A clock shows ${time}. How many minutes is it until ${h + 1}:00?`, `钟面显示 ${time}。还有多少分钟到 ${h + 1}:00？`],
          60 - m,
          [
            [
              ["Recall the hour", "想一小时"],
              ["An hour has 60 minutes.", "一小时有 60 分钟。"],
            ],
            [
              ["Subtract the minutes passed", "减去已过的分钟"],
              [`${m} minutes have passed:`, `已经过了 ${m} 分钟：`],
              [`60 - ${m} = ${60 - m}`],
            ],
          ],
          [`$${m} + ${60 - m} = 60$, a full hour.`, `$${m} + ${60 - m} = 60$，正好一小时。`],
          [
            [m, "That is the minutes already passed.", "这是已经过去的分钟数。"],
            [100 - m, "An hour has 60 minutes, not 100.", "一小时是 60 分钟，不是 100 分钟。"],
            [60 - m + 1, "That counts one minute too many.", "这多数了 1 分钟。"],
          ],
          clockFigure(h, m),
        );
      },
      captioned(clockFigure(4, 47), "A clock at 4:47.", "钟面显示 4:47。"),
    ),
  ],
  "elapsed-time-in-minutes": [
    skill(
      "the-start-from-the-end",
      ["The start from the end", "由结束时间求开始时间"],
      [
        "A clip ends at 3:10 and lasts 25 minutes. Back to 3:00 is 10 minutes, so $25 - 10 = 15$ are left. 15 minutes before 3:00 is 2:45.\n\nCheck: from 2:45 to 3:00 is 15 minutes, and 10 more make 25.\n\n> **Watch out.** Count back from the end. Adding 25 minutes to 3:10 goes the wrong way.",
        "一段影片在 3:10 结束，时长 25 分钟。往回到 3:00 是 10 分钟，还剩 $25 - 10 = 15$ 分钟。3:00 之前 15 分钟是 2:45。\n\n检验：从 2:45 到 3:00 是 15 分钟，再过 10 分钟，共 25 分钟。\n\n> **注意。** 要从结束时间往回数。在 3:10 上加 25 分钟就反了。",
      ],
      (rng) => {
        const h = rng.int(2, 11);
        const endM = rng.int(5, 40);
        const len = rng.int(endM + 5, 55);
        const rest = len - endM;
        const startM = 60 - rest;
        const end = `${h}:${String(endM).padStart(2, "0")}`;
        return solved(
          [
            `A movie clip ends at ${end} and lasts ${len} minutes. It started at ${h - 1}:$\\square$. What number of minutes goes in the box?`,
            `一段影片在 ${end} 结束，时长 ${len} 分钟。它开始于 ${h - 1}:$\\square$。方框里的分钟数是多少？`,
          ],
          startM,
          [
            [
              ["Go back to the hour", "先退到整点"],
              [`From ${end} back to ${h}:00 is ${endM} minutes, so this many are left:`, `从 ${end} 退到 ${h}:00 是 ${endM} 分钟，还剩：`],
              [`${len} - ${endM} = ${rest}`],
            ],
            [
              ["Cross the hour", "跨过整点"],
              [`${rest} minutes before ${h}:00:`, `${h}:00 之前 ${rest} 分钟：`],
              [`60 - ${rest} = ${startM}`],
            ],
          ],
          [
            `From ${h - 1}:${startM} to ${h}:00 is ${rest} minutes, and ${endM} more make $${rest} + ${endM} = ${len}$.`,
            `从 ${h - 1}:${startM} 到 ${h}:00 是 ${rest} 分钟，再过 ${endM} 分钟，共 $${rest} + ${endM} = ${len}$ 分钟。`,
          ],
          [
            [rest, "That is the minutes before the hour, not the start time.", "这是整点之前的分钟数，不是开始时间。"],
            [startM + 10, "That is 10 minutes too late.", "这晚了 10 分钟。"],
            [endM + len, "That adds the length. Count back from the end.", "这是加上了时长。要从结束时间往回数。"],
          ],
          clockFigure(h, endM),
        );
      },
      captioned(clockFigure(3, 10), "A clock at 3:10, when the clip ends.", "钟面显示 3:10，影片在这时结束。"),
    ),
  ],
  "grams-kilograms-and-liters": [
    skill(
      "kilograms-as-grams",
      ["Kilograms as grams", "千克换算成克"],
      [
        "A melon is 2 kilograms 300 grams. 1 kilogram is 1000 grams, so 2 kilograms are 2000 grams. $2000 + 300 = 2300$ grams.\n\nCheck: 2300 grams is 2 thousands and 300, which is 2 kilograms 300 grams.\n\n> **Watch out.** 1 kilogram is 1000 grams, not 100. 2 kilograms are 2000 grams.",
        "一个甜瓜重 2 千克 300 克。1 千克是 1000 克，所以 2 千克是 2000 克。$2000 + 300 = 2300$ 克。\n\n检验：2300 克是 2 个一千和 300，就是 2 千克 300 克。\n\n> **注意。** 1 千克是 1000 克，不是 100 克。2 千克是 2000 克。",
      ],
      (rng) => {
        const kg = rng.int(1, 6);
        const g = rng.int(1, 9) * 100;
        const things: readonly Pair[] = [
          ["bag of rice", "一袋大米"],
          ["melon", "一个甜瓜"],
          ["box of books", "一箱书"],
          ["bag of apples", "一袋苹果"],
        ];
        const it = rng.pick(things);
        const total = kg * 1000 + g;
        return solved(
          [
            `A ${it[0]} has a mass of ${kg} kilograms ${g} grams. What is its mass in grams?`,
            `${it[1]}的质量是 ${kg} 千克 ${g} 克。它是多少克？`,
          ],
          total,
          [
            [
              ["Change kilograms to grams", "把千克换成克"],
              ["1 kilogram is 1000 grams:", "1 千克是 1000 克："],
              [`${times(kg, 1000)} = ${kg * 1000}`],
            ],
            [["Add the grams", "加上克数"], ["", ""], [`${kg * 1000} + ${g} = ${total}`]],
          ],
          [
            `${total} grams is ${kg} thousands and ${g}, which is ${kg} kilograms ${g} grams.`,
            `${total} 克是 ${kg} 个一千和 ${g}，就是 ${kg} 千克 ${g} 克。`,
          ],
          [
            [kg * 100 + g, "1 kilogram is 1000 grams, not 100.", "1 千克是 1000 克，不是 100 克。"],
            [kg + g, "That adds kilograms to grams without changing units.", "这是没换单位就把千克和克相加了。"],
            [kg * 1000, `That leaves out the ${g} grams.`, `这漏掉了 ${g} 克。`],
          ],
          partWholeBarFigure([kg * 1000, g], -1),
        );
      },
      captioned(partWholeBarFigure([2000, 300], -2), "2300 grams as 2000 and 300.", "2300 克分成 2000 克和 300 克。"),
    ),
  ],
  "scaled-picture-graphs": [
    skill(
      "dots-from-a-value",
      ["Dots from a value", "由数值求点数"],
      [
        "Each dot stands for 5 votes. A row must show 20 votes. 20 is 4 groups of 5: $20 \\div 5 = 4$ dots.\n\nCheck: $4 \\times 5 = 20$ votes.\n\n> **Watch out.** Do not draw 20 dots. Each dot already counts 5.",
        "每个点代表 5 票。一行要表示 20 票。20 是 4 个 5：$20 \\div 5 = 4$，画 4 个点。\n\n检验：$4 \\times 5 = 20$ 票。\n\n> **注意。** 不要画 20 个点。每个点已经代表 5 票。",
      ],
      (rng) => {
        const per = rng.pick([2, 3, 4, 5, 10]);
        const dots = rng.int(2, 9);
        const votes = per * dots;
        return solved(
          [
            `In a picture graph, each dot stands for ${per} votes. A row must show ${votes} votes. How many dots should it have?`,
            `在一张图画统计图中，每个点代表 ${per} 票。一行要表示 ${votes} 票。应该画几个点？`,
          ],
          dots,
          [
            [
              ["Read the key", "看图例"],
              [`Each dot is ${per} votes.`, `每个点是 ${per} 票。`],
            ],
            [["Divide", "相除"], [`How many ${per}s make ${votes}?`, `${votes} 里有几个 ${per}？`], [`${votes} \\div ${per} = ${dots}`]],
          ],
          [`$${times(dots, per)} = ${votes}$ votes.`, `$${times(dots, per)} = ${votes}$ 票。`],
          [
            [votes, "That is the number of votes, not dots.", "这是票数，不是点数。"],
            [per, "That is what one dot is worth.", "这是一个点代表的票数。"],
            [dots + 1, `That is one dot too many: ${(dots + 1) * per} votes.`, `这多画了一个点：${(dots + 1) * per} 票。`],
          ],
        );
      },
      captioned(
        halfPictureGraphFigure(["A"], [4]),
        "A row of 4 dots: at 5 votes each, that is 20 votes.",
        "一行 4 个点：每个点 5 票，共 20 票。",
      ),
    ),
  ],
  "scaled-bar-graphs": [
    skill(
      "a-bar-between-the-lines",
      ["A bar between the lines", "条形停在两条线之间"],
      [
        "Lines are every 10. Bar A stops halfway between 10 and 20. Half a step is $10 \\div 2 = 5$, so bar A shows $10 + 5 = 15$.\n\nCheck: $20 - 5 = 15$, half a step down from the upper line.\n\n> **Watch out.** Halfway is half a step. It is not 1 more than the lower line.",
        "每隔 10 有一条线。条形 A 停在 10 和 20 的正中间。半个步长是 $10 \\div 2 = 5$，所以条形 A 表示 $10 + 5 = 15$。\n\n检验：$20 - 5 = 15$，从上面的线往下半个步长。\n\n> **注意。** 正中间是半个步长，不是比下面的线多 1。",
      ],
      (rng) => {
        const step = rng.pick([2, 4, 10, 20]);
        const k = rng.int(1, 9);
        const lo = step * k;
        const half = step / 2;
        return solved(
          [
            `A bar graph has lines every ${step}. A bar stops halfway between ${lo} and ${lo + step}. What is its value?`,
            `一张条形统计图每隔 ${step} 有一条线。一个条形停在 ${lo} 和 ${lo + step} 的正中间。它的值是多少？`,
          ],
          lo + half,
          [
            [["Find half a step", "求半个步长"], ["", ""], [`${step} \\div 2 = ${half}`]],
            [["Add to the lower line", "加到下面的线上"], ["", ""], [`${lo} + ${half} = ${lo + half}`]],
          ],
          [
            `$${lo + step} - ${half} = ${lo + half}$, half a step down from the upper line.`,
            `$${lo + step} - ${half} = ${lo + half}$，从上面的线往下半个步长。`,
          ],
          [
            [lo, "That is the lower line. The bar goes past it.", "这是下面那条线。条形超过了它。"],
            [lo + step, "That is the upper line. The bar stops below it.", "这是上面那条线。条形没到它。"],
            [lo + 1, "That adds 1, not half a step.", "这是加 1，不是加半个步长。"],
          ],
          barGraphFigure(["A", "B"], [lo + half, lo + step], step),
        );
      },
      captioned(
        barGraphFigure(["A", "B"], [15, 20], 10),
        "Bar A stops halfway between 10 and 20. Bar B reaches 20.",
        "条形 A 停在 10 和 20 的正中间，条形 B 到 20。",
      ),
    ),
  ],
  "line-plots-of-measurements": [
    skill(
      "the-total-length-on-a-line-plot",
      ["The total length on a line plot", "线状图上的总长度"],
      [
        "A line plot shows 2 ribbons of 3 inches and 3 ribbons of 5 inches. $2 \\times 3 = 6$ and $3 \\times 5 = 15$. The total is $6 + 15 = 21$ inches.\n\nCheck: add them one by one. $3 + 3 + 5 + 5 + 5 = 21$.\n\n> **Watch out.** Each mark is one ribbon. Count a length once for every mark above it.",
        "一张线状图上有 2 条 3 英寸的丝带和 3 条 5 英寸的丝带。$2 \\times 3 = 6$，$3 \\times 5 = 15$。总长是 $6 + 15 = 21$ 英寸。\n\n检验：一条一条地加。$3 + 3 + 5 + 5 + 5 = 21$。\n\n> **注意。** 每个标记是一条丝带。长度上方有几个标记，就要算几次。",
      ],
      (rng) => {
        const l = [rng.int(2, 4), rng.int(5, 7), rng.int(8, 10)] as const;
        const m = [rng.int(1, 4), rng.int(1, 4), rng.int(1, 4)] as const;
        const parts = [l[0] * m[0], l[1] * m[1], l[2] * m[2]] as const;
        const total = parts[0] + parts[1] + parts[2];
        const each = l.flatMap((len, i) => Array.from({ length: m[i] ?? 0 }, () => len));
        return solved(
          [
            `A line plot of ribbon lengths has ${m[0]} ${m[0] === 1 ? "mark" : "marks"} at ${l[0]} inches, ${m[1]} at ${l[1]} inches and ${m[2]} at ${l[2]} inches. What is the total length of the ribbons, in inches?`,
            `一张丝带长度线状图上，${l[0]} 英寸处有 ${m[0]} 个标记，${l[1]} 英寸处有 ${m[1]} 个，${l[2]} 英寸处有 ${m[2]} 个。这些丝带的总长度是多少英寸？`,
          ],
          total,
          [
            [
              ["Multiply each length by its marks", "每个长度乘标记数"],
              ["", ""],
              [`${times(m[0], l[0])} = ${parts[0]}`, `${times(m[1], l[1])} = ${parts[1]}`, `${times(m[2], l[2])} = ${parts[2]}`],
            ],
            [["Add", "相加"], ["", ""], [`${parts[0]} + ${parts[1]} + ${parts[2]} = ${total}`]],
          ],
          [`Add the ribbons one by one: $${each.join(" + ")} = ${total}$.`, `一条一条地加：$${each.join(" + ")} = ${total}$。`],
          [
            [l[0] + l[1] + l[2], "That adds each length once, not once for every mark.", "这是每个长度只加了一次，没有按标记数来加。"],
            [m[0] + m[1] + m[2], "That counts the ribbons, not their length.", "这是丝带的条数，不是总长度。"],
            [total + l[0], `That counts one ribbon of ${l[0]} inches too many.`, `这多算了一条 ${l[0]} 英寸的丝带。`],
          ],
          captioned(
            fractionLinePlotFigure(
              each.map((v) => v * 4),
              4,
              40,
              4,
            ),
            `A line plot of ${each.length} ribbon lengths from 1 to 10 inches.`,
            `一张线状图，有 ${each.length} 条丝带的长度，从 1 英寸到 10 英寸。`,
          ),
        );
      },
      captioned(
        fractionLinePlotFigure([12, 12, 20, 20, 20], 8, 24, 4),
        "A line plot with 2 marks at 3 inches and 3 marks at 5 inches.",
        "一张线状图：3 英寸处有 2 个标记，5 英寸处有 3 个标记。",
      ),
    ),
  ],
  "area-with-unit-squares": [
    skill(
      "half-squares-in-an-area",
      ["Half squares in an area", "面积中的半格"],
      [
        "A shape covers 6 whole squares and 4 half squares. Two halves make one whole, so 4 halves make 2 wholes. The area is $6 + 2 = 8$ square units.\n\nCheck: count halves. 6 wholes are 12 halves, $12 + 4 = 16$ halves, and $16 \\div 2 = 8$.\n\n> **Watch out.** A half square is not a whole square. Counting $6 + 4 = 10$ is too much.",
        "一个图形覆盖 6 个整格和 4 个半格。两个半格拼成一个整格，所以 4 个半格是 2 个整格。面积是 $6 + 2 = 8$ 平方单位。\n\n检验：按半格数。6 个整格是 12 个半格，$12 + 4 = 16$ 个半格，$16 \\div 2 = 8$。\n\n> **注意。** 半格不是整格。数成 $6 + 4 = 10$ 就多了。",
      ],
      (rng) => {
        const full = rng.int(3, 20);
        const pairs = rng.int(1, 6);
        return solved(
          [
            `A shape covers ${full} whole unit squares and ${2 * pairs} half squares. What is its area, in square units?`,
            `一个图形覆盖 ${full} 个整格和 ${2 * pairs} 个半格。它的面积是多少平方单位？`,
          ],
          full + pairs,
          [
            [
              ["Pair the halves", "把半格配对"],
              ["Two halves make one whole:", "两个半格拼成一个整格："],
              [`${2 * pairs} \\div 2 = ${pairs}`],
            ],
            [["Add the wholes", "加上整格"], ["", ""], [`${full} + ${pairs} = ${full + pairs}`]],
          ],
          [
            `Count halves: $${2 * full} + ${2 * pairs} = ${2 * (full + pairs)}$ halves, and $${2 * (full + pairs)} \\div 2 = ${full + pairs}$.`,
            `按半格数：$${2 * full} + ${2 * pairs} = ${2 * (full + pairs)}$ 个半格，$${2 * (full + pairs)} \\div 2 = ${full + pairs}$。`,
          ],
          [
            [full + 2 * pairs, "That counts each half square as a whole one.", "这是把半格当成整格了。"],
            [full, "That leaves out the half squares.", "这漏掉了半格。"],
            [full + pairs + 1, "That counts one square too many.", "这多数了一格。"],
          ],
          halfSquaresFigure(full, 2 * pairs),
        );
      },
      captioned(halfSquaresFigure(6, 4), "6 whole squares and 4 half squares.", "6 个整格和 4 个半格。"),
    ),
  ],
  "area-of-a-rectangle-by-multiplying": [
    {
      ...skill(
        "doubling-a-side-of-a-rectangle",
        ["Doubling a side of a rectangle", "把长方形的一边加倍"],
        [
          "A rectangle is 3 by 2, so its area is $3 \\times 2 = 6$. Double the side of 3 to make it 6. The new area is $6 \\times 2 = 12$.\n\nCheck: $2 \\times 6 = 12$. Double one side, and the area doubles.\n\n> **Watch out.** Only one side changes. Doubling both sides would make 4 times the area.",
          "一个长方形是 3 乘 2，面积是 $3 \\times 2 = 6$。把 3 的那条边加倍，变成 6。新的面积是 $6 \\times 2 = 12$。\n\n检验：$2 \\times 6 = 12$。一边加倍，面积也加倍。\n\n> **注意。** 只有一条边变了。两条边都加倍，面积会变成 4 倍。",
        ],
        (rng) => {
          const a = rng.int(2, 12);
          const b = rng.int(2, 12);
          const k = rng.int(2, 3);
          return solved(
            [
              `A rectangle is ${a} cm by ${b} cm. Its side of ${a} cm is made ${k} times as long, and the other side stays. What is the new area, in square centimeters?`,
              `一个长方形长 ${a} 厘米、宽 ${b} 厘米。把 ${a} 厘米的边变成原来的 ${k} 倍，另一边不变。新的面积是多少平方厘米？`,
            ],
            k * a * b,
            [
              [["Find the new side", "求新的边长"], ["", ""], [`${times(k, a)} = ${k * a}`]],
              [["Multiply the sides", "两边相乘"], ["", ""], [`${times(k * a, b)} = ${k * a * b}`]],
            ],
            [
              `The old area is $${times(a, b)} = ${a * b}$, and $${times(k, a * b)} = ${k * a * b}$.`,
              `原来的面积是 $${times(a, b)} = ${a * b}$，$${times(k, a * b)} = ${k * a * b}$。`,
            ],
            [
              [a * b, "That is the old area.", "这是原来的面积。"],
              [k * a + b, "That adds the sides. Area multiplies them.", "这是把两边相加了。面积要相乘。"],
              [k * k * a * b, "That makes both sides longer.", "这是把两条边都变长了。"],
            ],
            labeledRectangleFigure(a, b, "cm"),
          );
        },
      ),
      figure: gradeDrawings2["area-of-a-rectangle-by-multiplying#doubling-a-side-of-a-rectangle"],
    },
  ],
  "area-of-combined-rectangles": [
    {
      ...skill(
        "an-l-shape-from-its-sides",
        ["An L shape from a big rectangle", "由大长方形求 L 形"],
        [
          "An L is an 8 by 6 rectangle with a 5 by 3 corner taken out. The big rectangle is $8 \\times 6 = 48$. The corner is $5 \\times 3 = 15$. The L is $48 - 15 = 33$.\n\nCheck: split the L instead. $8 \\times 3 = 24$ and $3 \\times 3 = 9$, and $24 + 9 = 33$.\n\n> **Watch out.** Subtract the corner. Adding it makes the shape bigger, not smaller.",
          "一个 L 形是 8 乘 6 的长方形去掉一个 5 乘 3 的角。大长方形是 $8 \\times 6 = 48$，角是 $5 \\times 3 = 15$，L 形是 $48 - 15 = 33$。\n\n检验：换个方法，把 L 形分成两块。$8 \\times 3 = 24$，$3 \\times 3 = 9$，$24 + 9 = 33$。\n\n> **注意。** 角要减去。加上它，图形就变大了。",
        ],
        (rng) => {
          const w = rng.int(6, 12);
          const h = rng.int(6, 12);
          const a = rng.int(2, w - 2);
          const b = rng.int(2, h - 2);
          const area = w * h - a * b;
          return solved(
            [
              `An L-shaped floor is a ${w} m by ${h} m rectangle with a ${a} m by ${b} m corner removed. What is its area, in square meters?`,
              `一块 L 形地面是由 ${w} 米乘 ${h} 米的长方形去掉一个 ${a} 米乘 ${b} 米的角得到的。它的面积是多少平方米？`,
            ],
            area,
            [
              [["Find the big rectangle", "求大长方形"], ["", ""], [`${times(w, h)} = ${w * h}`]],
              [
                ["Take out the corner", "去掉角"],
                [`The corner is $${times(a, b)} = ${a * b}$:`, `角是 $${times(a, b)} = ${a * b}$：`],
                [`${w * h} - ${a * b} = ${area}`],
              ],
            ],
            [
              `Split the L: $${times(w, h - b)} = ${w * (h - b)}$ and $${times(w - a, b)} = ${(w - a) * b}$, and $${w * (h - b)} + ${(w - a) * b} = ${area}$.`,
              `把 L 形分成两块：$${times(w, h - b)} = ${w * (h - b)}$，$${times(w - a, b)} = ${(w - a) * b}$，$${w * (h - b)} + ${(w - a) * b} = ${area}$。`,
            ],
            [
              [w * h + a * b, "That adds the corner. It was taken out.", "这是加上了角。角是去掉的。"],
              [w * h, "That leaves the corner in.", "这没有去掉角。"],
              [(w - a) * (h - b), "That is only part of the L.", "这只是 L 形的一部分。"],
            ],
            lShapeFigure(w, h, a, b, { bottom: `${w}`, left: `${h}`, notchBottom: `${a}`, notchSide: `${b}` }),
          );
        },
      ),
      figure: gradeDrawings2["area-of-combined-rectangles#an-l-shape-from-its-sides"],
    },
  ],
  "perimeter-of-polygons": [
    {
      ...skill(
        "a-side-from-a-regular-perimeter",
        ["A side from a perimeter with equal sides", "由周长求等边图形的边长"],
        [
          "A pentagon has 5 equal sides and a perimeter of 40 cm. Each side is $40 \\div 5 = 8$ cm.\n\nCheck: $5 \\times 8 = 40$.\n\n> **Watch out.** Divide by the number of sides, 5. Taking 5 away from 40 is wrong.",
          "一个五边形有 5 条相等的边，周长是 40 厘米。每条边是 $40 \\div 5 = 8$ 厘米。\n\n检验：$5 \\times 8 = 40$。\n\n> **注意。** 要除以边数 5。用 40 减去 5 是错的。",
        ],
        (rng) => {
          const kinds: readonly [Pair, number][] = [
            [["equilateral triangle", "等边三角形"], 3],
            [["square", "正方形"], 4],
            [["pentagon with all sides equal", "各边相等的五边形"], 5],
            [["hexagon with all sides equal", "各边相等的六边形"], 6],
            [["octagon with all sides equal", "各边相等的八边形"], 8],
          ];
          const [name, n] = rng.pick(kinds);
          const s = rng.int(2, 12);
          return solved(
            [
              `A ${name[0]} has a perimeter of ${n * s} cm. How long is each side, in centimeters?`,
              `一个${name[1]}的周长是 ${n * s} 厘米。每条边长多少厘米？`,
            ],
            s,
            [
              [
                ["Count the sides", "数边"],
                [`It has ${n} equal sides.`, `它有 ${n} 条相等的边。`],
              ],
              [["Divide", "相除"], ["One side:", "一条边："], [`${n * s} \\div ${n} = ${s}`]],
            ],
            [`$${times(n, s)} = ${n * s}$.`, `$${times(n, s)} = ${n * s}$。`],
            [
              [n * s - n, `That takes away ${n} instead of dividing by ${n}.`, `这是减去 ${n}，不是除以 ${n}。`],
              [n, "That is the number of sides, not the length of one.", "这是边数，不是一条边的长度。"],
              [
                s + 1,
                `That is 1 cm too long: $${times(n, s + 1)} = ${n * (s + 1)}$.`,
                `这长了 1 厘米：$${times(n, s + 1)} = ${n * (s + 1)}$。`,
              ],
            ],
            partWholeBarFigure(
              Array.from({ length: n }, () => s),
              0,
            ),
          );
        },
      ),
      figure: gradeDrawings2["perimeter-of-polygons#a-side-from-a-regular-perimeter"],
    },
  ],
  "same-perimeter-or-same-area": [
    {
      ...skill(
        "the-longest-perimeter-for-an-area",
        ["The longest perimeter for an area", "面积一定时最大的周长"],
        [
          "Rectangles with area 16 include 1 by 16 and 4 by 4. The thin one has perimeter $2 \\times (1 + 16) = 34$. The square has $2 \\times (4 + 4) = 16$.\n\nCheck: 2 by 8 has perimeter $2 \\times (2 + 8) = 20$, between the two.\n\n> **Watch out.** The same area does not mean the same perimeter. The thinnest rectangle goes around the farthest.",
          "面积是 16 的长方形有 1 乘 16，也有 4 乘 4。细长的那个周长是 $2 \\times (1 + 16) = 34$，正方形是 $2 \\times (4 + 4) = 16$。\n\n检验：2 乘 8 的周长是 $2 \\times (2 + 8) = 20$，在两者之间。\n\n> **注意。** 面积相同，周长不一定相同。最细长的长方形周长最大。",
        ],
        (rng) => {
          const area = rng.int(12, 60);
          const p = 2 * (area + 1);
          const next = [2, 3, 4, 5, 6, 7].find((f) => area % f === 0 && f * f <= area);
          return solved(
            [
              `A rectangle with whole-number sides has an area of ${area} square centimeters. What is the largest perimeter it can have, in centimeters?`,
              `一个边长为整数的长方形面积是 ${area} 平方厘米。它的周长最大是多少厘米？`,
            ],
            p,
            [
              [
                ["Make it as thin as possible", "让它尽量细长"],
                [`The thinnest has a side of 1: 1 cm by ${area} cm.`, `最细长的一条边是 1：1 厘米乘 ${area} 厘米。`],
              ],
              [["Find its perimeter", "求周长"], ["", ""], [`2 \\times (1 + ${area}) = ${p}`]],
            ],
            next === undefined
              ? [
                  `${area} is only $1 \\times ${area}$, so no other rectangle has this area.`,
                  `${area} 只能是 $1 \\times ${area}$，没有别的长方形面积是它。`,
                ]
              : [
                  `The next thinnest, ${next} by ${area / next}, has perimeter $2 \\times (${next} + ${area / next}) = ${2 * (next + area / next)}$, which is less.`,
                  `第二细长的是 ${next} 乘 ${area / next}，周长是 $2 \\times (${next} + ${area / next}) = ${2 * (next + area / next)}$，更小。`,
                ],
            [
              [area + 1, "That is half the perimeter. Double it.", "这是周长的一半。还要乘 2。"],
              [2 * area, "That doubles the area, not the sum of the sides.", "这是把面积乘 2，不是把两边之和乘 2。"],
              [
                4 * Math.ceil(Math.sqrt(area)),
                "That is about a square, which has the shortest perimeter.",
                "这大约是正方形的周长，正方形的周长最短。",
              ],
            ],
          );
        },
      ),
      figure: gradeDrawings2["same-perimeter-or-same-area#the-longest-perimeter-for-an-area"],
    },
  ],
  "sorting-quadrilaterals": [
    {
      ...skill(
        "true-of-every-rectangle",
        ["True of every shape in a family", "一族图形共有的性质"],
        [
          "A square and a long rectangle both have four right angles, so both are rectangles. Only the square has four equal sides. So every rectangle must have four right angles, but not four equal sides.\n\nCheck: stretch the rectangle longer. Its corners stay right angles.\n\n> **Watch out.** A feature that only some rectangles have is not a must. Test it on a long, thin one.",
          "正方形和长长的长方形都有四个直角，所以都是长方形。只有正方形有四条相等的边。所以每个长方形一定有四个直角，但不一定有四条相等的边。\n\n检验：把长方形拉长，它的角还是直角。\n\n> **注意。** 只有一部分长方形才有的特点，不是“一定有”的。用一个又长又窄的长方形试一试。",
        ],
        (rng) => {
          const facts: readonly [Pair, Pair, readonly Wrong[]][] = [
            [
              ["rectangle", "长方形"],
              ["four right angles", "四个直角"],
              [
                [
                  ["four equal sides", "四条相等的边"],
                  "A long, thin rectangle has sides of different lengths.",
                  "又长又窄的长方形边长不同。",
                ],
                [["no parallel sides", "没有平行的边"], "Opposite sides of a rectangle are always parallel.", "长方形的对边总是平行的。"],
                [
                  ["exactly one pair of parallel sides", "恰好一组平行的边"],
                  "A rectangle has two pairs of parallel sides.",
                  "长方形有两组平行的边。",
                ],
              ],
            ],
            [
              ["rhombus", "菱形"],
              ["four equal sides", "四条相等的边"],
              [
                [["four right angles", "四个直角"], "A slanted rhombus has no right angles.", "斜着的菱形没有直角。"],
                [["no parallel sides", "没有平行的边"], "Opposite sides of a rhombus are always parallel.", "菱形的对边总是平行的。"],
                [
                  ["exactly one pair of parallel sides", "恰好一组平行的边"],
                  "A rhombus has two pairs of parallel sides.",
                  "菱形有两组平行的边。",
                ],
              ],
            ],
            [
              ["square", "正方形"],
              ["four equal sides and four right angles", "四条相等的边和四个直角"],
              [
                [
                  ["four equal sides and no right angles", "四条相等的边，没有直角"],
                  "Every corner of a square is a right angle.",
                  "正方形的每个角都是直角。",
                ],
                [["exactly one right angle", "恰好一个直角"], "A square has four right angles, not one.", "正方形有四个直角，不是一个。"],
                [
                  ["exactly one pair of parallel sides", "恰好一组平行的边"],
                  "A square has two pairs of parallel sides.",
                  "正方形有两组平行的边。",
                ],
              ],
            ],
            [
              ["trapezoid", "梯形"],
              ["at least one pair of parallel sides", "至少一组平行的边"],
              [
                [
                  ["four right angles", "四个直角"],
                  "Many trapezoids have slanted sides and no right angles.",
                  "很多梯形的边是斜的，没有直角。",
                ],
                [["four equal sides", "四条相等的边"], "Most trapezoids have sides of different lengths.", "大多数梯形的边长不同。"],
                [
                  ["no parallel sides", "没有平行的边"],
                  "A trapezoid always has at least one pair of parallel sides.",
                  "梯形总有至少一组平行的边。",
                ],
              ],
            ],
          ];
          const [name, right, wrong] = rng.pick(facts);
          const who = rng.pick(earlyNames);
          return picked(
            rng,
            [`${who} draws a ${name[0]}. What must it have, however it is drawn?`, `${who} 画了一个${name[1]}。无论怎么画，它一定有什么？`],
            right,
            wrong,
            [
              [
                ["Recall what the name means", "回想名称的意思"],
                [`Being a ${name[0]} means having ${right[0]}.`, `是${name[1]}，就要有${right[1]}。`],
              ],
              [
                ["Test the other features", "检验其他特点"],
                [
                  `Each other feature fails for some shapes of this kind, or for all of them.`,
                  `其他特点对一些${name[1]}不成立，或者对所有${name[1]}都不成立。`,
                ],
              ],
            ],
            [`Draw the ${name[0]} another way, and it still has ${right[0]}.`, `换一种画法画这个${name[1]}，它还是有${right[1]}。`],
          );
        },
      ),
      figure: gradeDrawings2["sorting-quadrilaterals#true-of-every-rectangle"],
    },
  ],
  "equal-parts-of-shapes": [
    skill(
      "how-many-equal-parts-from-the-area",
      ["How many equal parts from the area", "由面积求份数"],
      [
        "A garden of 12 square meters is cut into parts of 3 square meters. $12 \\div 3 = 4$ parts. So each part is $\\frac{1}{4}$ of the garden.\n\nCheck: $4 \\times 3 = 12$ square meters.\n\n> **Watch out.** $n$ is the number of parts, 4. It is not the area of one part, 3.",
        "一块 12 平方米的花园被分成每份 3 平方米。$12 \\div 3 = 4$ 份。所以每份是花园的 $\\frac{1}{4}$。\n\n检验：$4 \\times 3 = 12$ 平方米。\n\n> **注意。** $n$ 是份数 4，不是一份的面积 3。",
      ],
      (rng) => {
        const each = rng.int(2, 9);
        const parts = rng.int(2, 8);
        const area = each * parts;
        return solved(
          [
            `A garden with an area of ${area} square meters is cut into parts of ${each} square meters each. Each part is $\\frac{1}{n}$ of the garden. What is $n$?`,
            `一块面积为 ${area} 平方米的花园被分成若干份，每份 ${each} 平方米。每份是花园的 $\\frac{1}{n}$。$n$ 是多少？`,
          ],
          parts,
          [
            [["Count the parts", "求份数"], ["", ""], [`${area} \\div ${each} = ${parts}`]],
            [
              ["Name the fraction", "写出分数"],
              [
                `${parts} equal parts, so each is $\\frac{1}{${parts}}$ of the garden.`,
                `${parts} 份一样大，所以每份是花园的 $\\frac{1}{${parts}}$。`,
              ],
            ],
          ],
          [`$${times(parts, each)} = ${area}$ square meters.`, `$${times(parts, each)} = ${area}$ 平方米。`],
          [
            [each, "That is the area of one part, not the number of parts.", "这是一份的面积，不是份数。"],
            [area, "That is the whole area.", "这是总面积。"],
            [parts + 1, "That is one part too many.", "这多了一份。"],
          ],
        );
      },
      captioned(partWholeBarFigure([3, 3, 3, 3], -2), "12 square meters cut into 4 parts of 3.", "12 平方米分成 4 份，每份 3。"),
    ),
  ],
};
