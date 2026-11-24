// The further knowledge points of 4th Grade Math topics, written to the teaching
// standard: each a skill the topic's own points leave out, such as working
// backwards or reasoning about a whole problem. The maps in deeper-grade-4*.ts
// attach them to their topics.

import type { Figure, KnowledgePointDef } from "@ga/content";
import { type Pair, pickedMath, type Walk } from "./early-grades-more-kit.ts";
import {
  answered,
  areaGridFigure,
  digitsChart,
  equalTape,
  grouped,
  groupedTex,
  lineFigure,
  type Miss,
  placeChartFigure,
  placesOf,
  point,
  tapeFigure,
} from "./upper-grades-kit.ts";

/** g writes a whole number for LaTeX with commas: 12{,}345. */
const g = groupedTex;
/** p writes a whole number for prose with commas: 12,345. */
const p = grouped;

/** row writes the digits of n under `places` columns of a place-value chart, blank on the left. */
const row = (n: number, places: number): string[] =>
  String(n)
    .padStart(places, " ")
    .split("")
    .map((c) => c.trim());

/** placeEn names the place 10ᵏ in English. */
const placeEn = ["ones", "tens", "hundreds", "thousands", "ten thousands", "hundred thousands", "millions"];
/** placeZh names the place 10ᵏ in Chinese. */
const placeZh = ["个位", "十位", "百位", "千位", "万位", "十万位", "百万位"];
// ---------------------------------------------------------------------------
// Place value

/** largestFromFourDigits makes the largest or smallest number from four digits. */
export const largestFromFourDigits: KnowledgePointDef = point(
  "the-largest-number-from-four-digits",
  ["The largest number from four digits", "用四个数字组成最大的数"],
  [
    "A digit on the left is worth more. So for the largest number, put the biggest digit first, then the next biggest. From 3, 8, 1 and 5 the largest is 8,531.\n\nCheck: the smallest uses the same digits the other way round: 1,358. It is less than 8,531.\n\n> **Watch out.** Do not keep the digits in the order they are given.",
    "数字越靠左，表示的值越大。所以要组成最大的数，就把最大的数字放在最前面，接着放第二大的。用 3、8、1、5 组成的最大数是 8,531。\n\n检验：最小的数是倒过来排的 1,358，比 8,531 小。\n\n> **注意。** 不要按题目给出的顺序写数字。",
  ],
  (rng) => {
    const ds = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 4) as number[];
    const big = rng.bool();
    const sorted = [...ds].sort((a, b) => (big ? b - a : a - b));
    const value = Number(sorted.join(""));
    const other = Number([...sorted].reverse().join(""));
    return answered(
      big
        ? [
            `Use each of the digits ${ds.join(", ")} once to make the largest possible number.`,
            `用 ${ds.join("、")} 这四个数字各一次，组成最大的数。`,
          ]
        : [
            `Use each of the digits ${ds.join(", ")} once to make the smallest possible number.`,
            `用 ${ds.join("、")} 这四个数字各一次，组成最小的数。`,
          ],
      value,
      [
        [
          ["Choose the first digit", "定千位"],
          big
            ? [`The thousands place counts most, so it gets the biggest digit, ${sorted[0]}.`, `千位最重要，放最大的数字 ${sorted[0]}。`]
            : [`The thousands place counts most, so it gets the smallest digit, ${sorted[0]}.`, `千位最重要，放最小的数字 ${sorted[0]}。`],
        ],
        [
          ["Fill the other places", "填其余数位"],
          [
            `Keep going ${big ? "from biggest to smallest" : "from smallest to biggest"}: ${p(value)}.`,
            `继续${big ? "从大到小" : "从小到大"}排：${p(value)}。`,
          ],
        ],
      ],
      big
        ? [
            `Swap any two digits and the number gets smaller. For example, ${p(Number([sorted[1], sorted[0], sorted[2], sorted[3]].join("")))} < ${p(value)}.`,
            `任意交换两个数字，数都会变小。例如 ${p(Number([sorted[1], sorted[0], sorted[2], sorted[3]].join("")))} < ${p(value)}。`,
          ]
        : [
            `Swap any two digits and the number gets bigger. For example, ${p(Number([sorted[1], sorted[0], sorted[2], sorted[3]].join("")))} > ${p(value)}.`,
            `任意交换两个数字，数都会变大。例如 ${p(Number([sorted[1], sorted[0], sorted[2], sorted[3]].join("")))} > ${p(value)}。`,
          ],
      [
        [
          other,
          big ? "That is the smallest number. The biggest digit goes first." : "That is the largest number. The smallest digit goes first.",
          big ? "这是最小的数。最大的数字要放在最前面。" : "这是最大的数。最小的数字要放在最前面。",
        ],
        [Number(ds.join("")), "That keeps the digits in the order given.", "这是按给出的顺序写的。"],
        [
          Number([sorted[0], sorted[1], sorted[3], sorted[2]].join("")),
          "The last two digits are the wrong way round.",
          "最后两个数字的顺序反了。",
        ],
      ],
      { figure: digitsChart([value]) },
    );
  },
  placeChartFigure(
    [1000, 100, 10, 1],
    [
      ["8", "5", "3", "1"],
      ["1", "3", "5", "8"],
    ],
    0,
  ),
);

/** timesAsGreatDigit compares the values of a digit that appears twice in a number. */
export const timesAsGreatDigit: KnowledgePointDef = point(
  "how-many-times-as-great-a-digit-is",
  ["How many times as great a digit is", "一个数字的值是另一个的多少倍"],
  [
    "Each place is worth 10 times the place to its right. In 3,030,000 the first 3 is worth 3,000,000 and the second 3 is worth 30,000. They are two places apart, so the first is $10 \\times 10 = 100$ times the second.\n\nCheck: $30{,}000 \\times 100 = 3{,}000{,}000$.\n\n> **Watch out.** Count the places between them, not the zeros you see.",
    "每一位的单位是右边一位的 10 倍。在 3,030,000 中，第一个 3 表示 3,000,000，第二个 3 表示 30,000。它们相差两位，所以前者是后者的 $10 \\times 10 = 100$ 倍。\n\n检验：$30{,}000 \\times 100 = 3{,}000{,}000$。\n\n> **注意。** 要数相差几个数位，不是数看到了几个 0。",
  ],
  (rng) => {
    const d = rng.int(1, 9);
    const hi = rng.int(4, 6);
    const lo = hi - rng.int(1, 3);
    const len = hi + 1;
    const ds = Array.from({ length: len }, (_, k) =>
      k === hi || k === lo ? d : rng.pick([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== d)),
    );
    const n = Number([...ds].reverse().join(""));
    const value = 10 ** (hi - lo);
    return answered(
      [
        `In $${g(n)}$, the value of the ${d} in the ${placeEn[hi]} place is how many times the value of the ${d} in the ${placeEn[lo]} place?`,
        `在 $${g(n)}$ 中，${placeZh[hi]}上的 ${d} 表示的值是${placeZh[lo]}上的 ${d} 的多少倍？`,
      ],
      value,
      [
        [
          ["Find both values", "求出两个值"],
          [
            `The first ${d} is worth ${p(d * 10 ** hi)}. The second is worth ${p(d * 10 ** lo)}.`,
            `第一个 ${d} 表示 ${p(d * 10 ** hi)}，第二个表示 ${p(d * 10 ** lo)}。`,
          ],
        ],
        [["Divide", "相除"], ["", ""], [`${g(d * 10 ** hi)} \\div ${g(d * 10 ** lo)} = ${g(value)}`]],
      ],
      [
        `They are ${hi - lo} place${hi - lo > 1 ? "s" : ""} apart, and each place is 10 times: ${
          hi - lo > 1
            ? `$${Array(hi - lo)
                .fill("10")
                .join(" \\times ")} = ${g(value)}$`
            : "10"
        }.`,
        `它们相差 ${hi - lo} 位，每一位是 10 倍：${
          hi - lo > 1
            ? `$${Array(hi - lo)
                .fill("10")
                .join(" \\times ")} = ${g(value)}$`
            : "10"
        }。`,
      ],
      [
        [hi - lo, "That counts the places between them. Each place multiplies by 10.", "这是相差的位数。每差一位要乘 10。"],
        [value * 10, "That is one place too many.", "这多算了一位。"],
        [d, "That is the digit itself. Compare the values.", "这是数字本身，要比较它们表示的值。"],
      ],
      { figure: digitsChart([n], len - 1 - hi) },
    );
  },
  placeChartFigure(placesOf(7), [row(3030000, 7), row(30000, 7)], 0),
);

/** wordsForZeroDigit picks the number named by words that skip a place. */
export const wordsForZeroDigit: KnowledgePointDef = point(
  "the-words-for-a-zero-digit",
  ["Where a zero digit goes in words", "零在读法中的位置"],
  [
    "Words do not name a place that holds 0. But the digit 0 must still be written. Forty thousand, six hundred two has no thousands and no tens: 40,602.\n\nCheck: $40{,}000 + 600 + 2 = 40{,}602$.\n\n> **Watch out.** Write a 0 for every place the words skip.",
    "读数时，0 所在的数位不读出来，但写数时 0 一定要写。四万零六百零二没有千和十：40,602。\n\n检验：$40{,}000 + 600 + 2 = 40{,}602$。\n\n> **注意。** 读法里跳过的每个数位都要写 0。",
  ],
  (rng) => {
    const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const zh = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    const a = rng.int(2, 9);
    const x = rng.int(1, 9);
    const o = rng.int(1, 9);
    const n = a * 10000 + x * 100 + o;
    return pickedMath(
      rng,
      [`Which number is ${tens[a]} thousand, ${ones[x]} hundred ${ones[o]}?`, `哪个数是${zh[a]}万零${zh[x]}百零${zh[o]}？`],
      g(n),
      [
        [
          g(a * 1000 + x * 100 + o),
          "That leaves out the zero in the thousands, so it is only four digits.",
          "这漏写了千位的 0，只有四位。",
        ],
        [g(a * 10000 + x * 10 + o), "That puts the hundreds digit in the tens place.", "这把百位上的数字写到了十位。"],
        [g(a * 10000 + x * 100 + o * 10), "That puts the ones digit in the tens place.", "这把个位上的数字写到了十位。"],
      ],
      [
        [
          ["Fill the places named", "填写读到的数位"],
          [`${a} ten thousands, ${x} hundreds and ${o} ones.`, `万位 ${a}，百位 ${x}，个位 ${o}。`],
        ],
        [
          ["Write 0 in the rest", "其余数位写 0"],
          [`No thousands and no tens: ${p(n)}.`, `千位和十位写 0：${p(n)}。`],
        ],
      ],
      [`$${g(a * 10000)} + ${x * 100} + ${o} = ${g(n)}$.`, `$${g(a * 10000)} + ${x * 100} + ${o} = ${g(n)}$。`],
      digitsChart([n]),
    );
  },
  placeChartFigure(placesOf(5), [row(40602, 5)], 1),
);

/** digitNamedByWords finds the digit of one place from a number in words. */
export const digitNamedByWords: KnowledgePointDef = point(
  "the-digit-named-by-words",
  ["A digit named by words", "由读法确定数字"],
  [
    "Each word group fills one place. Seven thousand, two hundred nine: the thousands digit is 7, the hundreds digit is 2, the tens digit is 0 and the ones digit is 9.\n\nCheck: the number is 7,209, and its hundreds digit is 2.\n\n> **Watch out.** A place the words skip holds 0.",
    "读法里的每一部分填一个数位。七千二百零九：千位是 7，百位是 2，十位是 0，个位是 9。\n\n检验：这个数是 7,209，百位是 2。\n\n> **注意。** 读法跳过的数位上是 0。",
  ],
  (rng) => {
    const words = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const zh = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    const [a, c, b] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3) as [number, number, number];
    const n = a * 1000 + c * 100 + b;
    return answered(
      [
        `What digit is in the hundreds place of ${words[a]} thousand, ${words[c]} hundred ${words[b]}?`,
        `${zh[a]}千${zh[c]}百零${zh[b]}的百位上是几？`,
      ],
      c,
      [
        [
          ["Write the number", "写出这个数"],
          [`${a} thousands, ${c} hundreds, no tens and ${b} ones: ${p(n)}.`, `${a} 个千、${c} 个百、没有十、${b} 个一：${p(n)}。`],
        ],
        [
          ["Read the hundreds digit", "读出百位"],
          [`The hundreds digit of ${p(n)} is ${c}.`, `${p(n)} 的百位是 ${c}。`],
        ],
      ],
      [`The words "${words[c]} hundred" say ${c} hundreds directly.`, `读法中的“${zh[c]}百”直接说明百位是 ${c}。`],
      [
        [a, "That is the thousands digit.", "这是千位上的数字。"],
        [b, "That is the ones digit.", "这是个位上的数字。"],
        [0, "That is the tens digit, the place the words skip.", "这是十位上的数字，读法跳过了这一位。"],
      ],
      { figure: digitsChart([n], 1) },
    );
  },
  placeChartFigure([1000, 100, 10, 1], [["7", "2", "0", "9"]], 1),
);

/** termsInExpandedForm counts the terms of an expanded form. */
export const termsInExpandedForm: KnowledgePointDef = point(
  "the-number-of-terms-in-an-expanded-form",
  ["How many terms an expanded form has", "展开式有几项"],
  [
    "An expanded form has one term for each digit that is not 0. A 0 adds nothing, so it gets no term. $30{,}402 = 30{,}000 + 400 + 2$ has 3 terms, though the number has 5 digits.\n\nCheck: count the digits that are not 0 in 30,402: 3, 4 and 2. That is 3.\n\n> **Watch out.** Do not count the zeros.",
    "展开式中每个不是 0 的数字对应一项。0 不表示任何值，不写成一项。$30{,}402 = 30{,}000 + 400 + 2$ 有 3 项，虽然这个数有 5 位。\n\n检验：数一数 30,402 中不是 0 的数字：3、4、2，是 3 个。\n\n> **注意。** 0 不算一项。",
  ],
  (rng) => {
    const ds = Array.from({ length: 5 }, (_, i) => (i === 0 ? rng.int(1, 9) : rng.bool() ? 0 : rng.int(1, 9)));
    const n = Number(ds.join(""));
    const terms = ds.map((d, i) => d * 10 ** (4 - i)).filter((x) => x > 0);
    const count = terms.length;
    return answered(
      [`How many terms does the expanded form of $${g(n)}$ have?`, `$${g(n)}$ 的展开式有几项？`],
      count,
      [
        [["Write the expanded form", "写出展开式"], ["", ""], [`${g(n)} = ${terms.map(g).join(" + ")}`]],
        [
          ["Count the terms", "数项数"],
          [`There ${count === 1 ? "is 1 term" : `are ${count} terms`}.`, `一共 ${count} 项。`],
        ],
      ],
      [
        `Count the digits that are not 0 in ${p(n)}: ${ds.filter((d) => d > 0).join(", ")}. That is ${count}.`,
        `数一数 ${p(n)} 中不是 0 的数字：${ds.filter((d) => d > 0).join("、")}，是 ${count} 个。`,
      ],
      [
        [5, "That counts every digit. Zeros give no term.", "这是把每个数字都数了，0 不算一项。"],
        [5 - count, "That counts the zeros instead.", "这数的是 0 的个数。"],
        [count + 1, "That is one term too many.", "这多数了一项。"],
      ],
      { figure: digitsChart([n]) },
    );
  },
  placeChartFigure(placesOf(5), [row(30000, 5), row(400, 5), row(2, 5), row(30402, 5)]),
);

/** expandedWithGap writes an expanded form that skips places as a number. */
export const expandedWithGap: KnowledgePointDef = point(
  "expanded-forms-with-a-gap",
  ["Expanded forms with a gap", "有空位的展开式"],
  [
    "When an expanded form skips a place, write 0 in that place. In $60{,}000 + 400 + 2$ there are no thousands and no tens. So the number is 60,402.\n\nCheck: 60,402 has 5 digits, the same as 60,000.\n\n> **Watch out.** Without the zeros you get 642, which is far too small.",
    "展开式跳过了某个数位，这一位就写 0。$60{,}000 + 400 + 2$ 中没有千和十，所以这个数是 60,402。\n\n检验：60,402 是五位数，和 60,000 一样。\n\n> **注意。** 不写 0 就成了 642，小太多了。",
  ],
  (rng) => {
    const [a, b, c] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
    const n = a * 10000 + b * 100 + c;
    return answered(
      [`Write $${g(a * 10000)} + ${b * 100} + ${c}$ as a number.`, `把 $${g(a * 10000)} + ${b * 100} + ${c}$ 写成一个数。`],
      n,
      [
        [
          ["Count the places", "确定位数"],
          [`${p(a * 10000)} has 5 digits, so the number has 5 digits.`, `${p(a * 10000)} 是五位数，所以这个数也是五位数。`],
        ],
        [
          ["Fill each place", "填好每一位"],
          [
            `${a} ten thousands, 0 thousands, ${b} hundreds, 0 tens, ${c} ones: ${p(n)}.`,
            `万位 ${a}，千位 0，百位 ${b}，十位 0，个位 ${c}：${p(n)}。`,
          ],
        ],
      ],
      [
        `Expand it again: $${g(n)} = ${g(a * 10000)} + ${b * 100} + ${c}$.`,
        `再展开一次：$${g(n)} = ${g(a * 10000)} + ${b * 100} + ${c}$。`,
      ],
      [
        [a * 1000 + b * 100 + c, "That leaves out the 0 in the thousands.", "这漏写了千位的 0。"],
        [a * 10000 + b * 10 + c, "That puts the hundreds digit in the tens place.", "这把百位的数字写到了十位。"],
        [a * 100 + b * 10 + c, "That leaves out both zeros.", "这把两个 0 都漏了。"],
      ],
      { figure: placeChartFigure(placesOf(5), [row(a * 10000, 5), row(b * 100, 5), row(c, 5), row(n, 5)]) },
    );
  },
  placeChartFigure(placesOf(5), [row(60000, 5), row(400, 5), row(2, 5), row(60402, 5)]),
);

/** sameNumberOtherUnits counts thousands as hundreds. */
export const sameNumberOtherUnits: KnowledgePointDef = point(
  "the-same-number-in-other-units",
  ["The same number in other units", "用其他单位表示同一个数"],
  [
    "One thousand is ten hundreds. So 7 thousands are $7 \\times 10 = 70$ hundreds. A smaller unit needs a bigger count.\n\nCheck: 7 thousands is 7,000, and 70 hundreds is also 7,000.\n\n> **Watch out.** Multiply by 10, not 100. One thousand is 10 hundreds.",
    "1 个千是 10 个百。所以 7 个千是 $7 \\times 10 = 70$ 个百。单位越小，个数越多。\n\n检验：7 个千是 7,000，70 个百也是 7,000。\n\n> **注意。** 要乘 10，不是乘 100。1 个千是 10 个百。",
  ],
  (rng) => {
    const a = rng.int(2, 99);
    return answered(
      [
        `What number goes in the box? $$${a} \\text{ thousands} = \\square \\text{ hundreds}$$`,
        `方框里填几？$$${a} \\text{ 个千} = \\square \\text{ 个百}$$`,
      ],
      a * 10,
      [
        [
          ["Trade one thousand", "换一个千"],
          ["Each thousand is 10 hundreds.", "每个千是 10 个百。"],
        ],
        [["Multiply", "相乘"], ["", ""], [`${a} \\times 10 = ${a * 10}`]],
      ],
      [
        `Both sides are $${g(a * 1000)}$: $${a} \\times 1{,}000 = ${a * 10} \\times 100$.`,
        `两边都是 $${g(a * 1000)}$：$${a} \\times 1{,}000 = ${a * 10} \\times 100$。`,
      ],
      [
        [a * 100, "That multiplies by 100. One thousand is only 10 hundreds.", "这乘了 100。1 个千只有 10 个百。"],
        [a, "That keeps the count. Hundreds are smaller, so you need more of them.", "个数没变。百比千小，要更多个。"],
        [a * 1000, "That is the number itself, not the count of hundreds.", "这是这个数本身，不是百的个数。"],
      ],
      {
        figure: placeChartFigure(placesOf(String(a * 1000).length), [row(a * 1000, String(a * 1000).length)], String(a * 1000).length - 3),
      },
    );
  },
  placeChartFigure(
    [1000, 100, 10, 1],
    [
      ["7", "0", "0", "0"],
      ["", "70", "0", "0"],
    ],
    1,
  ),
);

/** tensLeftAfterHundreds trades tens for hundreds and finds the tens left. */
export const tensLeftAfterHundreds: KnowledgePointDef = point(
  "tens-left-after-making-hundreds",
  ["Tens left after making hundreds", "换成百后剩下的十"],
  [
    "Ten tens make one hundred. To trade 47 tens, take away groups of ten: 4 groups make 4 hundreds, and 7 tens are left.\n\nCheck: 4 hundreds and 7 tens is 470, and 47 tens is also 470.\n\n> **Watch out.** The question asks for the tens left, not the hundreds made.",
    "10 个十是 1 个百。把 47 个十换成百，就是一组组地拿走 10 个：4 组换成 4 个百，剩下 7 个十。\n\n检验：4 个百和 7 个十是 470，47 个十也是 470。\n\n> **注意。** 问的是剩下几个十，不是换成了几个百。",
  ],
  (rng) => {
    let tens: number;
    do tens = rng.int(11, 99);
    while (tens % 10 === 0);
    const h = Math.floor(tens / 10);
    const left = tens % 10;
    return answered(
      [
        `$${tens}$ tens are traded for as many hundreds as possible. How many tens are left over?`,
        `把 $${tens}$ 个十尽量换成百。还剩几个十？`,
      ],
      left,
      [
        [
          ["Make hundreds", "换成百"],
          [
            `Each hundred takes 10 tens. ${tens} tens make ${h} hundred${h > 1 ? "s" : ""}, using ${h * 10} tens.`,
            `每个百要 10 个十。${tens} 个十能换 ${h} 个百，用掉 ${h * 10} 个十。`,
          ],
        ],
        [["Find what is left", "求剩下的"], ["", ""], [`${tens} - ${h * 10} = ${left}`]],
      ],
      [
        `${h} hundred${h > 1 ? "s" : ""} and ${left} tens is $${h * 100 + left * 10}$, and $${tens} \\times 10 = ${tens * 10}$ too.`,
        `${h} 个百和 ${left} 个十是 $${h * 100 + left * 10}$，$${tens} \\times 10 = ${tens * 10}$ 也一样。`,
      ],
      [
        [h, "That is the number of hundreds made, not the tens left.", "这是换成的百的个数，不是剩下的十。"],
        [tens, "That trades nothing.", "这一个也没换。"],
        [10 - left, "That counts how many more tens make the next hundred.", "这是再要几个十才能凑成下一个百。"],
      ],
      {
        figure: placeChartFigure(
          [100, 10],
          [
            ["", `${tens}`],
            [`${h}`, `${left}`],
          ],
          1,
        ),
      },
    );
  },
  placeChartFigure(
    [100, 10],
    [
      ["", "47"],
      ["4", "7"],
    ],
    1,
  ),
);

/** openingAThousand trades a thousand for ten hundreds. */
export const openingAThousand: KnowledgePointDef = point(
  "opening-a-thousand",
  ["Opening a thousand", "拆开一个千"],
  [
    "Borrowing changes how a number is written, not how big it is. Open 1 thousand into 10 hundreds. Then 3 thousands and 2 hundreds become 2 thousands and 12 hundreds.\n\nCheck: $2{,}000 + 1{,}200 = 3{,}200$.\n\n> **Watch out.** Add the 10 hundreds to the hundreds already there.",
    "借位只改变数的写法，不改变数的大小。把 1 个千拆成 10 个百，3 个千 2 个百就变成 2 个千 12 个百。\n\n检验：$2{,}000 + 1{,}200 = 3{,}200$。\n\n> **注意。** 拆出的 10 个百要加上原来的百。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const b = rng.int(0, 9);
    const c = rng.int(0, 9);
    const n = a * 1000 + b * 100 + c;
    return answered(
      [
        `Fill in the box: $${g(n)} = ${a - 1}\\text{ thousands} + \\square\\text{ hundreds} + ${c}\\text{ ones}$`,
        `填方框：$${g(n)} = ${a - 1}\\text{ 个千} + \\square\\text{ 个百} + ${c}\\text{ 个一}$`,
      ],
      b + 10,
      [
        [
          ["See what was opened", "看拆了什么"],
          [
            `The thousands went from ${a} to ${a - 1}, so 1 thousand became 10 hundreds.`,
            `千从 ${a} 个变成 ${a - 1} 个，1 个千拆成了 10 个百。`,
          ],
        ],
        [["Add the hundreds", "加上原来的百"], ["", ""], [`10 + ${b} = ${b + 10}`]],
      ],
      [
        `$${g((a - 1) * 1000)} + ${g((b + 10) * 100)} + ${c} = ${g(n)}$.`,
        `$${g((a - 1) * 1000)} + ${g((b + 10) * 100)} + ${c} = ${g(n)}$。`,
      ],
      [
        [b, "That leaves the hundreds as they were. They got 10 more.", "百没有变。它们应该多了 10 个。"],
        [b + 1, "That adds 1 hundred. A thousand is 10 hundreds.", "这只加了 1 个百。1 个千是 10 个百。"],
        [10, `That forgets the ${b} hundreds already there.`, `这忘了原来的 ${b} 个百。`],
      ],
      { figure: placeChartFigure([1000, 100, 10, 1], [row(n, 4), [`${a - 1}`, "?", "", `${c}`]], 1) },
    );
  },
  placeChartFigure(
    [1000, 100, 10, 1],
    [
      ["3", "2", "0", "0"],
      ["2", "12", "0", "0"],
    ],
    1,
  ),
);

/** tenthOfTheValue finds a digit's value one place to the right. */
export const tenthOfTheValue: KnowledgePointDef = point(
  "a-tenth-of-the-value",
  ["One tenth of the value", "值的十分之一"],
  [
    "Move a digit one place to the right and it is worth a tenth as much. A 6 worth 600 becomes a 6 worth 60. That is $600 \\div 10$.\n\nCheck: go back. $60 \\times 10 = 600$.\n\n> **Watch out.** Moving right makes the value smaller. Divide by 10, do not multiply.",
    "数字向右移一位，表示的值变成原来的十分之一。表示 600 的 6 右移一位，就表示 60，也就是 $600 \\div 10$。\n\n检验：倒回去，$60 \\times 10 = 600$。\n\n> **注意。** 向右移值变小，要除以 10，不是乘 10。",
  ],
  (rng) => {
    const d = rng.int(1, 9);
    const k = rng.int(2, 5);
    const v = d * 10 ** k;
    return answered(
      [
        `A digit ${d} is worth $${g(v)}$. How much is the same digit worth one place to its right?`,
        `数字 ${d} 表示 $${g(v)}$。同样的数字在它右边一位时表示多少？`,
      ],
      v / 10,
      [
        [
          ["Find its place", "找出数位"],
          [`${p(v)} puts the ${d} in the ${placeEn[k]} place.`, `${p(v)} 说明 ${d} 在${placeZh[k]}上。`],
        ],
        [
          ["Move one place right", "右移一位"],
          [`One place right is the ${placeEn[k - 1]} place, a tenth as much.`, `右边一位是${placeZh[k - 1]}，值是十分之一。`],
          [`${g(v)} \\div 10 = ${g(v / 10)}`],
        ],
      ],
      [`Multiply back: $${g(v / 10)} \\times 10 = ${g(v)}$.`, `乘回去：$${g(v / 10)} \\times 10 = ${g(v)}$。`],
      [
        [v * 10, "That moves the digit left. Right means smaller.", "这是向左移了。向右移值变小。"],
        [d, "That is the digit alone, not its value.", "这只是数字本身，不是它的值。"],
        [v / 100, "That moves two places.", "这移了两位。"],
      ],
      { figure: placeChartFigure(placesOf(k + 1), [row(v, k + 1), row(v / 10, k + 1)], 1) },
    );
  },
  placeChartFigure(
    [100, 10, 1],
    [
      ["6", "0", "0"],
      ["", "6", "0"],
    ],
    1,
  ),
);

/** orderingFourNumbers orders four numbers and names the second. */
export const orderingFourNumbers: KnowledgePointDef = point(
  "ordering-four-whole-numbers",
  ["Ordering four whole numbers", "给四个整数排序"],
  [
    "First compare the number of digits. Fewer digits means smaller. Then compare numbers of the same length from the left. 482, 4,615, 4,630 and 4,710 are in order from least to greatest.\n\nCheck: each number is less than the next: 482 < 4,615 < 4,630 < 4,710.\n\n> **Watch out.** A 3-digit number comes before every 4-digit number, even if it starts with a big digit.",
    "先比位数，位数少的小。位数相同时，从左往右比。482、4,615、4,630、4,710 是从小到大排的。\n\n检验：每个数都比后一个小：482 < 4,615 < 4,630 < 4,710。\n\n> **注意。** 三位数比任何四位数都小，即使它的第一位很大。",
  ],
  (rng) => {
    const base = rng.int(1, 8) * 1000 + rng.int(0, 9) * 100;
    const set = [base + rng.int(10, 49), base + rng.int(50, 99), base + 100 + rng.int(0, 99), Math.floor(base / 10) + rng.int(1, 9)];
    const shown = rng.shuffle(set);
    const sorted = [...set].sort((a, b) => a - b);
    return answered(
      [
        `Put $${shown.map(g).join(",\\ ")}$ in order from least to greatest. Which number is second?`,
        `把 $${shown.map(g).join(",\\ ")}$ 从小到大排列。第二个数是多少？`,
      ],
      sorted[1]!,
      [
        [
          ["Compare the lengths", "比位数"],
          [`${p(sorted[0]!)} has the fewest digits, so it is first.`, `${p(sorted[0]!)} 位数最少，排第一。`],
        ],
        [
          ["Compare from the left", "从左往右比"],
          [
            `The other three have 4 digits. In order: ${sorted.slice(1).map(p).join(", ")}.`,
            `其余三个都是四位数，按顺序是 ${sorted.slice(1).map(p).join("、")}。`,
          ],
        ],
      ],
      [`Each is less than the next: $${sorted.map(g).join(" < ")}$.`, `每个都比后一个小：$${sorted.map(g).join(" < ")}$。`],
      [
        [sorted[0]!, "That is the first number, the least.", "这是第一个数，最小的。"],
        [sorted[2]!, "That is the third number.", "这是第三个数。"],
        [sorted[3]!, "That is the greatest number, the last.", "这是最大的数，排最后。"],
      ],
      { figure: digitsChart(sorted) },
    );
  },
  digitsChart([482, 4615, 4630, 4710]),
);

/** fiveDigitFromCards makes the largest or smallest five-digit number from digit cards that may include 0. */
export const fiveDigitFromCards: KnowledgePointDef = point(
  "the-largest-or-smallest-number-from-digits",
  ["The largest or smallest number from digits", "用数字组成最大或最小的数"],
  [
    "For the largest number, put the digits from biggest to smallest. For the smallest, put them from smallest to biggest, but never start with 0. From 0, 2, 5, 7 and 9: the largest is 97,520 and the smallest is 20,579.\n\nCheck: 02,579 is not a five-digit number, so 2 goes first and the 0 goes next.\n\n> **Watch out.** A number cannot start with 0.",
    "组成最大的数，数字从大到小排；组成最小的数，从小到大排，但 0 不能放在最前面。用 0、2、5、7、9：最大是 97,520，最小是 20,579。\n\n检验：02,579 不是五位数，所以 2 放最前，0 放第二位。\n\n> **注意。** 0 不能放在最高位。",
  ],
  (rng) => {
    const ds = [0, ...(rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 4) as number[])];
    const shown = rng.shuffle(ds);
    const big = rng.bool();
    const up = [...ds].sort((a, b) => a - b);
    const largest = Number([...up].reverse().join(""));
    const smallest = Number([up[1], 0, ...up.slice(2)].join(""));
    const value = big ? largest : smallest;
    return answered(
      [
        `Using each of the digits ${shown.join(", ")} exactly once, what is the ${big ? "largest" : "smallest"} five-digit number you can make?`,
        `用 ${shown.join("、")} 每个数字各一次，能组成的${big ? "最大" : "最小"}五位数是多少？`,
      ],
      value,
      big
        ? [
            [
              ["Order the digits", "排数字"],
              ["The biggest digit goes in the highest place.", "最大的数字放在最高位。"],
            ],
            [
              ["Write the number", "写出这个数"],
              [`From biggest to smallest: ${p(value)}.`, `从大到小：${p(value)}。`],
            ],
          ]
        : [
            [
              ["Choose the first digit", "定最高位"],
              [`0 cannot go first, so the smallest other digit, ${up[1]}, goes first.`, `0 不能在最高位，所以放最小的非零数字 ${up[1]}。`],
            ],
            [
              ["Fill the rest", "填其余数位"],
              [`Then 0, then the rest from smallest to biggest: ${p(value)}.`, `接着放 0，其余从小到大：${p(value)}。`],
            ],
          ],
      big
        ? [
            `With the same digits the smallest number is ${p(smallest)}, which is less.`,
            `用同样的数字组成的最小数是 ${p(smallest)}，确实更小。`,
          ]
        : [
            `With the same digits the largest number is ${p(largest)}, which is greater.`,
            `用同样的数字组成的最大数是 ${p(largest)}，确实更大。`,
          ],
      big
        ? [
            [smallest, "That is the smallest number.", "这是最小的数。"],
            [
              Number(shown.join("")) >= 10000 ? Number(shown.join("")) : largest - 9,
              "That does not put the biggest digits first.",
              "这没有把大的数字放在前面。",
            ],
            [
              Number(`${[...up].reverse().slice(0, 3).join("")}0${up[1]}`),
              "The last two digits are the wrong way round.",
              "最后两个数字的顺序反了。",
            ],
          ]
        : [
            [Number(up.slice(1).join("")), "That leaves out the 0, so it has only four digits.", "这漏掉了 0，只有四位。"],
            [
              Number([up[1], ...up.slice(2), 0].join("")),
              "That puts the 0 last. In the second place it makes the number smaller.",
              "这把 0 放在了最后。0 放在第二位数更小。",
            ],
            [largest, "That is the largest number.", "这是最大的数。"],
          ],
      { figure: digitsChart([value]) },
    );
  },
  placeChartFigure(placesOf(5), [row(97520, 5), row(20579, 5)], 0),
);

// ---------------------------------------------------------------------------
// Rounding backwards

/** blockLine draws the stretch of numbers that round to `value`, from `lo` to `hi`. */
const blockLine = (value: number, unit: number, lo: number, hi: number): Figure =>
  lineFigure(
    {
      lo: value - unit,
      hi: value + unit,
      step: unit / 10,
      labels: [value - unit, value, value + unit],
      marks: [
        { at: lo, text: p(lo) },
        { at: hi, text: p(hi), result: true },
      ],
    },
    [
      `A number line from ${p(value - unit)} to ${p(value + unit)} with ${p(lo)} and ${p(hi)} marked.`,
      `一条从 ${p(value - unit)} 到 ${p(value + unit)} 的数轴，标出 ${p(lo)} 和 ${p(hi)}。`,
    ],
  );

/** largestThatRoundsDown finds the largest number that rounds down to a value. */
export const largestThatRoundsDown: KnowledgePointDef = point(
  "the-largest-that-rounds-down",
  ["The largest that rounds down", "能舍去的最大数"],
  [
    "A number rounds down to 700 when what follows the hundreds is less than 50. 750 is halfway, and halfway rounds up. So the largest number that rounds down to 700 is $750 - 1 = 749$.\n\nCheck: 749 has 4 tens, less than 5, so it rounds to 700.\n\n> **Watch out.** 750 itself rounds up to 800.",
    "百位后面的部分小于 50 时，才舍成 700。750 在正中间，正中间要进一。所以舍成 700 的最大数是 $750 - 1 = 749$。\n\n检验：749 的十位是 4，小于 5，舍成 700。\n\n> **注意。** 750 本身要进一成 800。",
  ],
  (rng) => {
    const step = rng.pick([100, 1000]);
    const base = step * rng.int(2, 90);
    const half = base + step / 2;
    const value = half - 1;
    const name: Pair = step === 100 ? ["hundred", "百位"] : ["thousand", "千位"];
    return answered(
      [
        `A whole number rounds down to $${g(base)}$ when rounded to the nearest ${name[0]}. What is the largest it could be?`,
        `一个整数四舍五入到${name[1]}后舍成 $${g(base)}$。它最大可能是多少？`,
      ],
      value,
      [
        [
          ["Find the halfway point", "找中点"],
          [
            `Halfway to the next ${name[0]} is ${p(half)}, and halfway rounds up.`,
            `到下一个整${step === 100 ? "百" : "千"}的中点是 ${p(half)}，正中间要进一。`,
          ],
        ],
        [["Step one below", "往下一个"], ["", ""], [`${g(half)} - 1 = ${g(value)}`]],
      ],
      [
        `${p(value)} rounds down to ${p(base)}, and ${p(half)} rounds up to ${p(base + step)}.`,
        `${p(value)} 舍成 ${p(base)}，而 ${p(half)} 进一成 ${p(base + step)}。`,
      ],
      [
        [half, "That is halfway, and halfway rounds up.", "这是正中间，要进一。"],
        [base + step - 1, `That rounds up to ${p(base + step)}.`, `这会进一成 ${p(base + step)}。`],
        [base, "That rounds down, but it is not the largest.", "这能舍去，但不是最大的。"],
      ],
      { figure: blockLine(base, step, base, value) },
    );
  },
  blockLine(700, 100, 700, 749),
);

/** smallestThatRounds finds the smallest or largest number that rounds to a value. */
export const smallestThatRounds: KnowledgePointDef = point(
  "the-smallest-number-that-rounds-to-a-value",
  ["The smallest or largest number that rounds to a value", "四舍五入到某值的最小数或最大数"],
  [
    "Many numbers round to the same value. To the nearest hundred, the numbers that round to 600 run from 550 to 649. 550 is halfway and rounds up to 600. 650 would round up to 700.\n\nCheck: 549 rounds to 500 and 650 rounds to 700, just outside.\n\n> **Watch out.** The two ends are not the same distance away: 50 below but only 49 above.",
    "很多数四舍五入后得到同一个值。四舍五入到百位得 600 的数是 550 到 649。550 在正中间，进一成 600；650 会进一成 700。\n\n检验：549 约等于 500，650 约等于 700，都在外面。\n\n> **注意。** 两端离 600 不一样远：下面 50，上面只有 49。",
  ],
  (rng) => {
    const place = rng.pick([10, 100, 1000]);
    const value = rng.int(2, 90) * place;
    const smallest = rng.bool();
    const half = place / 2;
    const answer = smallest ? value - half : value + half - 1;
    const name: Pair = place === 10 ? ["ten", "十位"] : place === 100 ? ["hundred", "百位"] : ["thousand", "千位"];
    return answered(
      [
        `A whole number rounds to $${g(value)}$ when rounded to the nearest ${name[0]}. What is the ${smallest ? "smallest" : "largest"} that number can be?`,
        `一个整数四舍五入到${name[1]}后是 $${g(value)}$。这个数${smallest ? "最小" : "最大"}是多少？`,
      ],
      answer,
      smallest
        ? [
            [
              ["Find the halfway point below", "找下面的中点"],
              [
                `Halfway between ${p(value - place)} and ${p(value)} is ${p(value - half)}.`,
                `${p(value - place)} 和 ${p(value)} 的中点是 ${p(value - half)}。`,
              ],
            ],
            [
              ["Halfway rounds up", "中点要进一"],
              [
                `So ${p(value - half)} rounds up to ${p(value)}. It is the smallest.`,
                `所以 ${p(value - half)} 进一成 ${p(value)}，它就是最小的。`,
              ],
            ],
          ]
        : [
            [
              ["Find the halfway point above", "找上面的中点"],
              [
                `Halfway between ${p(value)} and ${p(value + place)} is ${p(value + half)}.`,
                `${p(value)} 和 ${p(value + place)} 的中点是 ${p(value + half)}。`,
              ],
            ],
            [
              ["Step one below it", "往下一个"],
              [
                `${p(value + half)} rounds up to ${p(value + place)}, so the largest is one less.`,
                `${p(value + half)} 会进一成 ${p(value + place)}，所以最大的比它少 1。`,
              ],
              [`${g(value + half)} - 1 = ${g(answer)}`],
            ],
          ],
      smallest
        ? [
            `${p(answer - 1)} rounds down to ${p(value - place)}, so nothing smaller works.`,
            `${p(answer - 1)} 会舍成 ${p(value - place)}，所以不能再小了。`,
          ]
        : [
            `${p(answer + 1)} rounds up to ${p(value + place)}, so nothing larger works.`,
            `${p(answer + 1)} 会进一成 ${p(value + place)}，所以不能再大了。`,
          ],
      [
        [
          smallest ? answer + 1 : answer + 1,
          smallest ? "That rounds correctly, but one less also does." : "That is halfway, and it rounds up to the next value.",
          smallest ? "这也对，但再小 1 也可以。" : "这是正中间，会进一到下一个值。",
        ],
        [
          smallest ? value - place : value + place,
          "That is the next round number. It rounds to itself.",
          "这是相邻的整数，它约等于它自己。",
        ],
        [value, "That is the value itself, not the end of the block.", "这是这个值本身，不是这一段的端点。"],
        [
          smallest ? answer - 1 : answer - 1,
          smallest ? "That is just below halfway, so it rounds down." : "That rounds correctly, but one more also does.",
          smallest ? "这在中点下面，会舍去。" : "这也对，但再大 1 也可以。",
        ],
      ],
      { figure: blockLine(value, place, value - half, value + half - 1) },
    );
  },
  blockLine(600, 100, 550, 649),
);

/** smallestPastNines finds the smallest number that rounds up to a round thousand at the hundreds. */
export const smallestPastNines: KnowledgePointDef = point(
  "the-smallest-that-rounds-up-past-nines",
  ["The smallest that rounds up", "能入的最小数"],
  [
    "Rounding to the nearest hundred can carry through a 9. 2,950 has 9 hundreds and 5 tens. The 5 says round up, and 29 hundreds become 30 hundreds: 3,000. So 2,950 is the smallest number that rounds up to 3,000.\n\nCheck: 2,949 has 4 tens, so it rounds down to 2,900.\n\n> **Watch out.** The smallest is 50 below, not 100 below. 2,900 rounds to itself.",
    "四舍五入到百位时，可能经过 9 连续进位。2,950 有 9 个百和 5 个十。十位是 5，要进一，29 个百变成 30 个百：3,000。所以 2,950 是能入成 3,000 的最小数。\n\n检验：2,949 的十位是 4，舍成 2,900。\n\n> **注意。** 最小的数比 3,000 少 50，不是少 100。2,900 约等于它自己。",
  ],
  (rng) => {
    const th = rng.int(2, 90) * 1000;
    const value = th - 50;
    return answered(
      [
        `A whole number rounds up to $${g(th)}$ when rounded to the nearest hundred. What is the smallest it could be?`,
        `一个整数四舍五入到百位后入成 $${g(th)}$。它最小可能是多少？`,
      ],
      value,
      [
        [
          ["Find the hundred below", "找下面的整百"],
          [`The hundred just below ${p(th)} is ${p(th - 100)}.`, `${p(th)} 下面一个整百是 ${p(th - 100)}。`],
        ],
        [
          ["Go to halfway", "找中点"],
          [`Halfway is ${p(value)}, and halfway rounds up to ${p(th)}.`, `中点是 ${p(value)}，中点要进一，得 ${p(th)}。`],
        ],
      ],
      [`${p(value - 1)} has 4 tens, so it rounds down to ${p(th - 100)}.`, `${p(value - 1)} 的十位是 4，会舍成 ${p(th - 100)}。`],
      [
        [th - 100, "That rounds to itself, not up.", "这约等于它自己，不会进一。"],
        [th - 49, "That rounds up too, but one less also does.", "这也会进一，但再小 1 也可以。"],
        [th - 500, "That is halfway to the thousand, not to the hundred.", "这是到千的中点，不是到百的中点。"],
      ],
      { figure: blockLine(th, 100, value, th + 49) },
    );
  },
  blockLine(3000, 100, 2950, 3049),
);

// ---------------------------------------------------------------------------
// Estimates

/** estimateLine draws the exact answer and the estimate on a number line. */
const estimateLine = (exact: number, estimate: number, unit: number): Figure => {
  const lo = Math.floor(Math.min(exact, estimate) / unit) * unit;
  let hi = Math.ceil(Math.max(exact, estimate) / unit) * unit;
  if (hi === lo) hi += unit;
  return lineFigure(
    {
      lo,
      hi,
      step: unit / 10,
      labels: Array.from({ length: (hi - lo) / unit + 1 }, (_, i) => lo + i * unit),
      marks: [
        { at: exact, text: p(exact) },
        { at: estimate, result: true },
      ],
      jumps: [[estimate, exact]],
    },
    [
      `A number line with the estimate ${p(estimate)} and the exact answer ${p(exact)}.`,
      `一条数轴，标出估算结果 ${p(estimate)} 和准确结果 ${p(exact)}。`,
    ],
  );
};

/** estimateError finds how far an estimate is from the exact sum. */
export const estimateError: KnowledgePointDef = point(
  "how-far-an-estimate-is-from-the-exact-sum",
  ["How far an estimate is from the exact sum", "估算值与准确和相差多少"],
  [
    "An estimate is quick but not exact. To see how far off it is, find both and subtract the smaller from the larger. $468 + 237 \\approx 500 + 200 = 700$. The exact sum is 705. They are 5 apart.\n\nCheck: 468 went up by 32 and 237 went down by 37. $37 - 32 = 5$.\n\n> **Watch out.** The answer is the gap, not the estimate.",
    "估算快，但不准确。要知道差多少，就把估算值和准确值都算出来，用大的减小的。$468 + 237 \\approx 500 + 200 = 700$，准确的和是 705，相差 5。\n\n检验：468 多算了 32，237 少算了 37，$37 - 32 = 5$。\n\n> **注意。** 答案是两者的差距，不是估算值。",
  ],
  (rng) => {
    let a: number;
    let b: number;
    const round = (n: number) => Math.round(n / 100) * 100;
    do {
      a = rng.int(120, 980);
      b = rng.int(120, 980);
    } while (round(a) + round(b) === a + b);
    const estimate = round(a) + round(b);
    const exact = a + b;
    const answer = Math.abs(estimate - exact);
    return answered(
      [
        `Estimate $${a} + ${b}$ by rounding each number to the nearest hundred before adding. How far is the estimate from the exact sum?`,
        `先把每个数四舍五入到百位，再相加来估算 $${a} + ${b}$。估算值与准确和相差多少？`,
      ],
      answer,
      [
        [["Estimate", "估算"], ["", ""], [`${round(a)} + ${round(b)} = ${g(estimate)}`]],
        [
          ["Find the exact sum and the gap", "求准确和与差距"],
          ["", ""],
          [`${a} + ${b} = ${g(exact)}`, `${g(Math.max(estimate, exact))} - ${g(Math.min(estimate, exact))} = ${answer}`],
        ],
      ],
      [
        `Look at the changes: ${a} moved by ${Math.abs(round(a) - a)} and ${b} moved by ${Math.abs(round(b) - b)}, ${(round(a) - a) * (round(b) - b) >= 0 ? "the same way, so add" : "opposite ways, so subtract"}: ${answer}.`,
        `看变化：${a} 变了 ${Math.abs(round(a) - a)}，${b} 变了 ${Math.abs(round(b) - b)}，${(round(a) - a) * (round(b) - b) >= 0 ? "方向相同，相加" : "方向相反，相减"}：${answer}。`,
      ],
      [
        [estimate, "That is the estimate, not the gap.", "这是估算值，不是差距。"],
        [exact, "That is the exact sum, not the gap.", "这是准确和，不是差距。"],
        [Math.abs(round(a) - a), `That is only how much ${a} moved.`, `这只是 ${a} 的变化。`],
      ],
      { figure: estimateLine(exact, estimate, 100) },
    );
  },
  estimateLine(705, 700, 100),
);

/** exactSensible uses an estimate to spot the sensible exact answer. */
export const exactSensible: KnowledgePointDef = point(
  "is-the-exact-answer-sensible",
  ["Is the exact answer sensible", "准确答案是否合理"],
  [
    "An estimate shows whether an exact answer makes sense. $6{,}210 - 2{,}180 \\approx 6{,}000 - 2{,}000 = 4{,}000$. An answer of 403 is far too small, so a place has slipped. The answer 4,030 is close.\n\nCheck: $4{,}030 + 2{,}180 = 6{,}210$.\n\n> **Watch out.** A sensible answer is close to the estimate, not equal to it.",
    "估算可以看出准确答案是否合理。$6{,}210 - 2{,}180 \\approx 6{,}000 - 2{,}000 = 4{,}000$。答案 403 太小了，一定是错了位。答案 4,030 很接近。\n\n检验：$4{,}030 + 2{,}180 = 6{,}210$。\n\n> **注意。** 合理的答案接近估算值，不一定等于它。",
  ],
  (rng) => {
    const a = rng.int(4, 9) * 1000 + rng.int(100, 400);
    const b = rng.int(1, 3) * 1000 + rng.int(100, 400);
    const exact = a - b;
    const est = Math.round(a / 1000) * 1000 - Math.round(b / 1000) * 1000;
    return pickedMath(
      rng,
      [
        `Rounding to thousands estimates $${g(a)} - ${g(b)}$ as $${g(est)}$. Which answer is sensible?`,
        `四舍五入到千位时，$${g(a)} - ${g(b)}$ 的估算值是 $${g(est)}$。哪个答案合理？`,
      ],
      g(exact),
      [
        [g(Math.floor(exact / 10)), "That is about ten times too small. A place has slipped.", "这小了大约十倍，错了一位。"],
        [g(exact * 10), "That is about ten times too large.", "这大了大约十倍。"],
        [g(a + b), "That is the sum, far bigger than the estimate.", "这是和，比估算值大太多。"],
      ],
      [
        [
          ["Compare with the estimate", "和估算值比"],
          [`Only ${p(exact)} is close to ${p(est)}.`, `只有 ${p(exact)} 接近 ${p(est)}。`],
        ],
        [
          ["Rule out the rest", "排除其他"],
          ["The others are about ten times too small or too big, or they add.", "其他答案小了或大了大约十倍，或者是相加的结果。"],
        ],
      ],
      [`Add back: $${g(exact)} + ${g(b)} = ${g(a)}$.`, `加回去：$${g(exact)} + ${g(b)} = ${g(a)}$。`],
      estimateLine(exact, est, 1000),
    );
  },
  estimateLine(4030, 4000, 1000),
);

// ---------------------------------------------------------------------------
// Missing numbers in sums and differences

/** partWhole draws a bar of two parts under a total. */
const partWhole = (a: string, b: string, sizes: [number, number], total: string): Figure =>
  tapeFigure(
    [
      {
        total,
        pieces: [
          { size: sizes[0], text: a, dashed: a === "?" },
          { size: sizes[1], text: b, dashed: b === "?", lit: b === "?" },
        ],
      },
    ],
    [`A bar of two parts, ${a} and ${b}, with ${total} over the whole bar.`, `一个长条分成两段：${a} 和 ${b}，整条上方是 ${total}。`],
  );

/** missingAddendKP builds the knowledge point of a missing addend, for addends in the given ranges. */
function missingAddendKP(id: string, title: Pair, lo: [number, number], hi: [number, number], ex: [number, number]): KnowledgePointDef {
  const [ea, eb] = ex;
  return point(
    id,
    title,
    [
      `A missing addend is found by subtracting. In $${g(eb)} + \\square = ${g(ea + eb)}$, take the part you know from the total: $${g(ea + eb)} - ${g(eb)} = ${g(ea)}$.\n\nCheck: add back. $${g(eb)} + ${g(ea)} = ${g(ea + eb)}$.\n\n> **Watch out.** Do not add the two numbers you see. The total is already the biggest number.`,
      `求缺少的加数用减法。在 $${g(eb)} + \\square = ${g(ea + eb)}$ 中，用和减去已知的加数：$${g(ea + eb)} - ${g(eb)} = ${g(ea)}$。\n\n检验：加回去，$${g(eb)} + ${g(ea)} = ${g(ea + eb)}$。\n\n> **注意。** 不要把看到的两个数相加，和已经是最大的数了。`,
    ],
    (rng) => {
      const a = rng.int(lo[0], lo[1]);
      const b = rng.int(hi[0], hi[1]);
      const sum = a + b;
      return answered(
        [`Find the missing number: $$${g(b)} + \\square = ${g(sum)}$$`, `求缺少的数：$$${g(b)} + \\square = ${g(sum)}$$`],
        a,
        [
          [
            ["Undo the addition", "用减法还原"],
            [
              `The total is ${p(sum)} and one part is ${p(b)}. Subtract to find the other part.`,
              `和是 ${p(sum)}，一个加数是 ${p(b)}。用减法求另一个加数。`,
            ],
          ],
          [["Subtract", "相减"], ["", ""], [`${g(sum)} - ${g(b)} = ${g(a)}`]],
        ],
        [`Add back: $${g(b)} + ${g(a)} = ${g(sum)}$.`, `加回去：$${g(b)} + ${g(a)} = ${g(sum)}$。`],
        [
          [sum + b, "That adds the two numbers. The total is already given.", "这把两个数相加了。和已经给出了。"],
          [a + 10, "That forgets that a place lent 1 when subtracting.", "这减的时候忘了某一位借出了 1。"],
          [a > 10 ? a - 10 : a + 100, "That borrows when it does not need to.", "这在不需要时借了位。"],
        ],
        { figure: partWhole(p(b), "?", [b, a], p(sum)) },
      );
    },
    partWhole(p(eb), "?", [eb, ea], p(ea + eb)),
  );
}

/** missingTwoDigitAddend finds a missing two-digit addend. */
export const missingTwoDigitAddend = missingAddendKP(
  "the-missing-two-digit-addend",
  ["The missing two-digit addend", "缺少的两位数加数"],
  [12, 89],
  [12, 89],
  [27, 46],
);
/** missingAddendThreeDigitSum finds a missing two-digit addend of a three-digit sum. */
export const missingAddendThreeDigitSum = missingAddendKP(
  "the-missing-two-digit-addend-with-a-three-digit-sum",
  ["A missing addend in a three-digit sum", "和是三位数时缺少的加数"],
  [12, 89],
  [110, 899],
  [48, 365],
);
/** missingThreeDigitAddend finds a missing three-digit addend. */
export const missingThreeDigitAddend = missingAddendKP(
  "the-missing-three-digit-addend",
  ["The missing three-digit addend", "缺少的三位数加数"],
  [110, 899],
  [110, 899],
  [276, 458],
);
/** missingFiveDigitAddend finds a missing addend of up to five digits. */
export const missingFiveDigitAddend = missingAddendKP(
  "the-missing-addend-up-to-five-digits",
  ["The missing addend up to five digits", "最多五位数的缺少加数"],
  [1100, 45999],
  [1100, 45999],
  [12475, 30318],
);
/** largeMissingAddend finds a missing addend in the millions. */
export const largeMissingAddend = missingAddendKP(
  "a-missing-addend-in-a-large-sum",
  ["A missing addend in a large sum", "大数加法中缺少的加数"],
  [10000, 4000000],
  [10000, 4000000],
  [1305420, 2186315],
);

/** thirdFromTotal finds the third of three numbers from their total. */
export const thirdFromTotal: KnowledgePointDef = point(
  "the-third-number-from-a-total",
  ["The third number from a total", "由总数求第三个数"],
  [
    "Three towns have 12,000 people in all. Two have 4,500 and 3,200. Add the two you know: 7,700. Then take that from the total: $12{,}000 - 7{,}700 = 4{,}300$.\n\nCheck: $4{,}500 + 3{,}200 + 4{,}300 = 12{,}000$.\n\n> **Watch out.** Take away both known numbers, not just one.",
    "三个镇一共 12,000 人，其中两个镇有 4,500 人和 3,200 人。先把已知的加起来：7,700。再用总数减去它：$12{,}000 - 7{,}700 = 4{,}300$。\n\n检验：$4{,}500 + 3{,}200 + 4{,}300 = 12{,}000$。\n\n> **注意。** 两个已知的数都要减去，不能只减一个。",
  ],
  (rng) => {
    const a = rng.int(1200, 9800);
    const b = rng.int(1200, 9800);
    const answer = rng.int(1200, 9800);
    const total = a + b + answer;
    return answered(
      [
        `Three towns have $${g(total)}$ people in all. One town has $${g(a)}$ people and another has $${g(b)}$. How many people does the third town have?`,
        `三个镇一共有 $${g(total)}$ 人。一个镇有 $${g(a)}$ 人，另一个镇有 $${g(b)}$ 人。第三个镇有多少人？`,
      ],
      answer,
      [
        [["Add the known towns", "加已知的两个镇"], ["", ""], [`${g(a)} + ${g(b)} = ${g(a + b)}`]],
        [["Take them from the total", "从总数里减去"], ["", ""], [`${g(total)} - ${g(a + b)} = ${g(answer)}`]],
      ],
      [
        `Take them away one at a time: $${g(total)} - ${g(a)} = ${g(total - a)}$ and $${g(total - a)} - ${g(b)} = ${g(answer)}$.`,
        `一个一个减：$${g(total)} - ${g(a)} = ${g(total - a)}$，$${g(total - a)} - ${g(b)} = ${g(answer)}$。`,
      ],
      [
        [total - a, "That takes away only the first town.", "这只减去了第一个镇。"],
        [total - b, "That takes away only the second town.", "这只减去了第二个镇。"],
        [a + b, "That is the two known towns together, not the third.", "这是已知两个镇的和，不是第三个镇。"],
      ],
      {
        figure: tapeFigure(
          [
            {
              total: p(total),
              pieces: [
                { size: a, text: p(a) },
                { size: b, text: p(b) },
                { size: answer, text: "?", dashed: true, lit: true },
              ],
            },
          ],
          [
            `A bar of three parts, ${p(a)}, ${p(b)} and ?, with ${p(total)} over it.`,
            `一个长条分成三段：${p(a)}、${p(b)} 和 ?，整条是 ${p(total)}。`,
          ],
        ),
      },
    );
  },
  tapeFigure(
    [
      {
        total: "12,000",
        pieces: [
          { size: 4500, text: "4,500" },
          { size: 3200, text: "3,200" },
          { size: 4300, text: "?", dashed: true, lit: true },
        ],
      },
    ],
    ["A bar of three parts, 4,500, 3,200 and ?, with 12,000 over it.", "一个长条分成三段：4,500、3,200 和 ?，整条是 12,000。"],
  ),
);

/** missingStartKP builds the knowledge point of the number a subtraction started from. */
function missingStartKP(id: string, title: Pair, lo: [number, number], hi: [number, number], ex: [number, number]): KnowledgePointDef {
  const [ec, eb] = ex;
  return point(
    id,
    title,
    [
      `Adding undoes subtracting. In $\\square - ${g(eb)} = ${g(ec)}$, what was taken away and what is left make the start: $${g(ec)} + ${g(eb)} = ${g(ec + eb)}$.\n\nCheck: $${g(ec + eb)} - ${g(eb)} = ${g(ec)}$.\n\n> **Watch out.** Do not subtract the two numbers you see. The start is the biggest number.`,
      `加法可以还原减法。在 $\\square - ${g(eb)} = ${g(ec)}$ 中，减去的和剩下的合起来就是被减数：$${g(ec)} + ${g(eb)} = ${g(ec + eb)}$。\n\n检验：$${g(ec + eb)} - ${g(eb)} = ${g(ec)}$。\n\n> **注意。** 不要把看到的两个数相减，被减数是最大的数。`,
    ],
    (rng) => {
      const c = rng.int(lo[0], lo[1]);
      const b = rng.int(hi[0], hi[1]);
      return answered(
        [`Find the missing number: $$\\square - ${g(b)} = ${g(c)}$$`, `求缺少的数：$$\\square - ${g(b)} = ${g(c)}$$`],
        b + c,
        [
          [
            ["Undo the subtraction", "用加法还原"],
            [
              `${p(b)} was taken away and ${p(c)} is left. Together they make the start.`,
              `减去了 ${p(b)}，剩下 ${p(c)}，合起来就是原来的数。`,
            ],
          ],
          [["Add", "相加"], ["", ""], [`${g(c)} + ${g(b)} = ${g(b + c)}`]],
        ],
        [`Subtract to check: $${g(b + c)} - ${g(b)} = ${g(c)}$.`, `减一减来检验：$${g(b + c)} - ${g(b)} = ${g(c)}$。`],
        [
          [Math.abs(b - c), "That subtracts. The start must be bigger than both numbers.", "这是相减。被减数一定比这两个数都大。"],
          [b + c - 10, "That forgets a carry into the tens.", "这漏了向十位的进位。"],
          [b + c + 10, "That carries into the tens when it should not.", "这在十位多进了 1。"],
        ],
        { figure: partWhole(p(b), p(c), [b, c], "?") },
      );
    },
    partWhole(p(eb), p(ec), [eb, ec], "?"),
  );
}

/** startOfTwoDigitSubtraction finds the start of a two-digit subtraction. */
export const startOfTwoDigitSubtraction = missingStartKP(
  "the-start-of-a-two-digit-subtraction",
  ["The start of a two-digit subtraction", "两位数减法的被减数"],
  [12, 49],
  [12, 49],
  [27, 38],
);
/** startOfThreeDigitSubtraction finds the start of a subtraction with a three-digit difference. */
export const startOfThreeDigitSubtraction = missingStartKP(
  "the-start-of-a-three-digit-subtraction",
  ["The start of a three-digit subtraction", "三位数减法的被减数"],
  [110, 899],
  [12, 99],
  [346, 58],
);
/** startOfLongSubtraction finds the start of a subtraction of numbers up to five digits. */
export const startOfLongSubtraction = missingStartKP(
  "the-start-of-a-long-subtraction",
  ["The start of a long subtraction", "多位数减法的被减数"],
  [1100, 45999],
  [1100, 45999],
  [23465, 18270],
);
/** numberBeforeSubtraction finds the start of a subtraction in the millions. */
export const numberBeforeSubtraction = missingStartKP(
  "the-number-before-a-subtraction",
  ["The number before a subtraction", "减法之前的数"],
  [1000, 900000],
  [1000, 900000],
  [405200, 376150],
);

/** largestDifference makes the largest difference of two numbers from the same three digits. */
export const largestDifference: KnowledgePointDef = point(
  "the-largest-difference-from-three-digits",
  ["The largest difference from three digits", "用三个数字组成的最大差"],
  [
    "To make the difference as large as possible, make the first number as large as you can and the second as small as you can. With 2, 5 and 8: $852 - 258 = 594$.\n\nCheck: any other pair is closer together. For example, $825 - 285 = 540$, which is less.\n\n> **Watch out.** Use both the largest and the smallest number, not the largest twice.",
    "要让差最大，就让被减数尽量大，减数尽量小。用 2、5、8：$852 - 258 = 594$。\n\n检验：换别的两个数，差都更小。例如 $825 - 285 = 540$，更小。\n\n> **注意。** 要用最大的数减最小的数。",
  ],
  (rng) => {
    const [a, b, c] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3) as [number, number, number];
    const [low, middle, high] = [a, b, c].sort((x, y) => x - y) as [number, number, number];
    const largest = 100 * high + 10 * middle + low;
    const smallest = 100 * low + 10 * middle + high;
    const answer = largest - smallest;
    const other = 100 * high + 10 * low + middle - (100 * low + 10 * high + middle);
    return answered(
      [
        `Use the digits ${a}, ${b} and ${c}, each once, to write a three-digit number. Then use them again to write a second three-digit number. What is the largest possible difference between the two numbers?`,
        `用数字 ${a}、${b}、${c} 各一次写一个三位数，再用它们写第二个三位数。这两个数的差最大是多少？`,
      ],
      answer,
      [
        [
          ["Make the largest and the smallest", "组成最大数和最小数"],
          [`Largest: ${largest}. Smallest: ${smallest}.`, `最大的是 ${largest}，最小的是 ${smallest}。`],
        ],
        [["Subtract", "相减"], ["", ""], [`${largest} - ${smallest} = ${answer}`]],
      ],
      [
        `Add back: $${answer} + ${smallest} = ${largest}$. Another pair such as $${100 * high + 10 * low + middle} - ${100 * low + 10 * high + middle} = ${other}$ is smaller.`,
        `加回去：$${answer} + ${smallest} = ${largest}$。换一对，如 $${100 * high + 10 * low + middle} - ${100 * low + 10 * high + middle} = ${other}$，更小。`,
      ],
      [
        [largest, "That is the largest number, not the difference.", "这是最大的数，不是差。"],
        [largest + smallest, "That adds the numbers.", "这是把两个数相加了。"],
        [other, "That pair is not the largest and smallest.", "这两个数不是最大数和最小数。"],
      ],
      { figure: placeChartFigure([100, 10, 1], [row(largest, 3), row(smallest, 3), row(answer, 3)]) },
    );
  },
  placeChartFigure(
    [100, 10, 1],
    [
      ["8", "5", "2"],
      ["2", "5", "8"],
      ["5", "9", "4"],
    ],
  ),
);

// ---------------------------------------------------------------------------
// Expressions and word problems

/** missingFactorInExpression finds a missing factor in a × □ + b = c. */
export const missingFactorInExpression: KnowledgePointDef = point(
  "a-missing-factor-in-a-two-step-expression",
  ["A missing factor in a two-step expression", "两步算式中缺少的因数"],
  [
    "Work backwards. In $4 \\times \\square + 5 = 33$, the product plus 5 is 33. So the product is $33 - 5 = 28$. Then $4 \\times \\square = 28$, so the box is 7.\n\nCheck: $4 \\times 7 + 5 = 28 + 5 = 33$.\n\n> **Watch out.** Undo the adding first. Do not divide 33 by 4.",
    "倒着想。在 $4 \\times \\square + 5 = 33$ 中，积加 5 得 33，所以积是 $33 - 5 = 28$。再由 $4 \\times \\square = 28$，方框里是 7。\n\n检验：$4 \\times 7 + 5 = 28 + 5 = 33$。\n\n> **注意。** 先还原加法，不要直接用 33 除以 4。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const x = rng.int(2, 12);
    const b = rng.int(1, 20);
    const c = a * x + b;
    return answered(
      [
        `What number makes this true? $${a} \\times \\square + ${b} = ${c}$`,
        `方框里填几，等式才成立？$${a} \\times \\square + ${b} = ${c}$`,
      ],
      x,
      [
        [["Undo the adding", "还原加法"], ["", ""], [`${c} - ${b} = ${a * x}`]],
        [["Undo the multiplying", "还原乘法"], ["", ""], [`${a * x} \\div ${a} = ${x}`]],
      ],
      [
        `Put it back: $${a} \\times ${x} + ${b} = ${a * x} + ${b} = ${c}$.`,
        `代回去：$${a} \\times ${x} + ${b} = ${a * x} + ${b} = ${c}$。`,
      ],
      [
        [c - b, "That is the product, not the missing factor.", "这是积，不是缺少的因数。"],
        [Math.round(c / a), "That divides before taking away the added part.", "这没有先减去加上的数就除了。"],
        [x + 1, "That makes the left side too big.", "这样左边太大了。"],
      ],
      { figure: equalTape(a, "?", `${c - b}`, a) },
    );
  },
  equalTape(4, "?", "28", 4),
);

/** parenthesesWithDivision evaluates a ÷ (b × c). */
export const parenthesesWithDivision: KnowledgePointDef = point(
  "parentheses-with-division",
  ["Parentheses with division", "带括号的除法"],
  [
    "Work out the parentheses first. In $48 \\div (2 \\times 3)$, first $2 \\times 3 = 6$. Then $48 \\div 6 = 8$.\n\nCheck: divide in two steps. $48 \\div 2 = 24$ and $24 \\div 3 = 8$.\n\n> **Watch out.** Going left to right without the parentheses gives $48 \\div 2 \\times 3 = 72$, a different answer.",
    "先算括号里的。在 $48 \\div (2 \\times 3)$ 中，先算 $2 \\times 3 = 6$，再算 $48 \\div 6 = 8$。\n\n检验：分两步除，$48 \\div 2 = 24$，$24 \\div 3 = 8$。\n\n> **注意。** 不看括号从左往右算，$48 \\div 2 \\times 3 = 72$，答案就不同了。",
  ],
  (rng) => {
    const b = rng.int(2, 5);
    const c = rng.int(2, 5);
    const q = rng.int(2, 9);
    const a = b * c * q;
    return answered(
      [`Evaluate $${a} \\div (${b} \\times ${c})$.`, `计算 $${a} \\div (${b} \\times ${c})$。`],
      q,
      [
        [["Parentheses first", "先算括号"], ["", ""], [`${b} \\times ${c} = ${b * c}`]],
        [["Divide", "再除"], ["", ""], [`${a} \\div ${b * c} = ${q}`]],
      ],
      [
        `Divide by each factor in turn: $${a} \\div ${b} = ${a / b}$ and $${a / b} \\div ${c} = ${q}$.`,
        `依次除以两个因数：$${a} \\div ${b} = ${a / b}$，$${a / b} \\div ${c} = ${q}$。`,
      ],
      [
        [(a / b) * c, "That works left to right and ignores the parentheses.", "这是不看括号从左往右算的。"],
        [b * c, "That stops after the parentheses.", "这只算了括号里的。"],
        [a - b * c, "That subtracts instead of dividing.", "这是用减法，不是除法。"],
      ],
      { figure: equalTape(b * c, `${q}`, `${a}`, 0) },
    );
  },
  equalTape(6, "8", "48"),
);

/** equalSharesOfTotal builds a total, removes a part and shares the rest. */
export const equalSharesOfTotal: KnowledgePointDef = point(
  "equal-shares-of-a-total",
  ["Equal shares of a total", "总数的平均分配"],
  [
    "Some problems build a total, take some away, then share the rest. 5 boxes of 12 pens is 60 pens. Keep 4, so 56 are shared. Among 7 teams: $56 \\div 7 = 8$ pens each.\n\nCheck: $7 \\times 8 + 4 = 60$, and $5 \\times 12 = 60$.\n\n> **Watch out.** Take away the pens kept before you divide.",
    "有些题要先求总数，去掉一部分，再把剩下的平均分。5 盒笔，每盒 12 支，共 60 支。留下 4 支，分 56 支。分给 7 个小组：$56 \\div 7 = 8$ 支。\n\n检验：$7 \\times 8 + 4 = 60$，$5 \\times 12 = 60$。\n\n> **注意。** 要先减去留下的，再平均分。",
  ],
  (rng) => {
    let boxes: number;
    let per: number;
    let teams: number;
    let each: number;
    let keep: number;
    do {
      boxes = rng.int(3, 9);
      per = rng.int(12, 40);
      teams = rng.int(3, 9);
      each = rng.int(5, 30);
      keep = boxes * per - teams * each;
    } while (keep <= 0 || keep >= per * 2);
    const total = boxes * per;
    return answered(
      [
        `A club has ${boxes} boxes with ${per} pens in each box. It keeps ${keep} pens and shares the rest equally among ${teams} teams. How many pens does each team get?`,
        `一个社团有 ${boxes} 盒笔，每盒 ${per} 支。留下 ${keep} 支，其余平均分给 ${teams} 个小组。每组得到多少支？`,
      ],
      each,
      [
        [["Find the total", "求总数"], ["", ""], [`${boxes} \\times ${per} = ${total}`]],
        [["Take away the pens kept", "减去留下的"], ["", ""], [`${total} - ${keep} = ${total - keep}`]],
        [["Share equally", "平均分"], ["", ""], [`${total - keep} \\div ${teams} = ${each}`]],
      ],
      [`Work back: $${teams} \\times ${each} + ${keep} = ${total}$ pens.`, `倒推：$${teams} \\times ${each} + ${keep} = ${total}$ 支。`],
      [
        [Math.floor(total / teams), "That shares all the pens and forgets the ones kept.", "这把所有笔都分了，忘了留下的。"],
        [each + keep, "That adds the kept pens to one team.", "这把留下的笔加给了一个小组。"],
        [total - keep, "That is the pens shared by all the teams, not each team.", "这是所有小组一共分到的，不是每组的。"],
      ],
      {
        figure: tapeFigure(
          [
            {
              total: `${total}`,
              pieces: [...Array.from({ length: teams }, () => ({ size: each, text: "?", lit: true })), { size: keep, text: `${keep}` }],
            },
          ],
          [
            `A bar of ${total} with ${teams} equal parts and a part of ${keep}.`,
            `一个长条共 ${total}，分成 ${teams} 个相等的部分和一段 ${keep}。`,
          ],
        ),
      },
    );
  },
  tapeFigure(
    [{ total: "60", pieces: [...Array.from({ length: 7 }, () => ({ size: 8, text: "?", lit: true })), { size: 4, text: "4" }] }],
    ["A bar of 60 with 7 equal parts and a part of 4.", "一个长条共 60，分成 7 个相等的部分和一段 4。"],
  ),
);

/** whatToDoWithRemainder decides what a remainder means in a story. */
export const whatToDoWithRemainder: KnowledgePointDef = point(
  "what-to-do-with-the-remainder",
  ["What to do with the remainder", "如何处理余数"],
  [
    "The story decides what a remainder means. 30 students ride in vans of 8. $30 \\div 8 = 3$ R 6. The 6 students still need a seat, so 4 vans are needed. If we ask how many vans are full, the answer is 3.\n\nCheck: $3 \\times 8 + 6 = 30$.\n\n> **Watch out.** Read the question again before you write the answer. It may want the quotient, one more, or the remainder.",
    "余数是什么意思，要看题目。30 名学生坐车，每辆坐 8 人。$30 \\div 8 = 3$ 余 6。剩下 6 人也要坐车，所以需要 4 辆。如果问能坐满几辆，答案就是 3。\n\n检验：$3 \\times 8 + 6 = 30$。\n\n> **注意。** 写答案前再读一遍问题：要的可能是商，可能是商加 1，也可能是余数。",
  ],
  (rng) => {
    const per = rng.int(4, 9);
    const q = rng.int(4, 30);
    const r = rng.int(1, per - 1);
    const n = per * q + r;
    const form = rng.int(0, 2);
    const answer = form === 0 ? q + 1 : form === 1 ? q : r;
    const prompts: Pair[] = [
      [
        `${n} students ride in vans that hold ${per} each. How many vans are needed?`,
        `${n} 名学生坐车，每辆车坐 ${per} 人。需要多少辆车？`,
      ],
      [
        `${n} eggs are packed into cartons of ${per}. How many cartons can be filled?`,
        `${n} 个鸡蛋装入每盒 ${per} 个的盒子。能装满多少盒？`,
      ],
      [
        `${n} stickers are shared equally among ${per} children, as many as possible each. How many stickers are left over?`,
        `${n} 张贴纸平均分给 ${per} 个孩子，每人尽量多分。还剩多少张？`,
      ],
    ];
    const decide: Pair[] = [
      [`The ${r} students left over still need a van, so add one: ${q + 1}.`, `剩下的 ${r} 名学生也要坐车，所以再加一辆：${q + 1}。`],
      [`The ${r} extra eggs do not fill a carton, so only ${q} are full.`, `多出的 ${r} 个鸡蛋装不满一盒，所以只能装满 ${q} 盒。`],
      [`The remainder is what is left over: ${r}.`, `余数就是剩下的：${r} 张。`],
    ];
    return answered(
      prompts[form]!,
      answer,
      [
        [["Divide", "相除"], ["", ""], [`${n} \\div ${per} = ${q} \\text{ R } ${r}`]],
        [["Decide what the remainder means", "看余数的意思"], decide[form]!],
      ],
      [`$${per} \\times ${q} + ${r} = ${n}$, so the division is right.`, `$${per} \\times ${q} + ${r} = ${n}$，除法没有算错。`],
      form === 0
        ? [
            [q, `That leaves ${r} students without a seat.`, `这样有 ${r} 名学生没有座位。`],
            [r, "That is the remainder, not the number of vans.", "这是余数，不是车的辆数。"],
          ]
        : form === 1
          ? [
              [q + 1, `The last carton would hold only ${r} eggs, so it is not full.`, `最后一盒只有 ${r} 个，没装满。`],
              [r, "That is the eggs left over, not the cartons.", "这是剩下的鸡蛋，不是盒数。"],
            ]
          : [
              [q, "That is how many each child gets, not how many are left.", "这是每人分到的，不是剩下的。"],
              [per - r, "That is how many more would make another round.", "这是再要几张才能每人再分一张。"],
            ],
      {
        figure: tapeFigure(
          [
            {
              total: `${n}`,
              pieces: [
                ...Array.from({ length: Math.min(q, 12) }, () => ({ size: per, text: `${per}` })),
                ...(q > 12 ? [{ size: per * (q - 12), text: "…" }] : []),
                { size: r, text: `${r}`, lit: true },
              ],
            },
          ],
          [`A bar of ${n} cut into ${q} parts of ${per} and a part of ${r}.`, `一个长条共 ${n}，分成 ${q} 段 ${per} 和一段 ${r}。`],
        ),
      },
    );
  },
  tapeFigure(
    [
      {
        total: "30",
        pieces: [
          { size: 8, text: "8" },
          { size: 8, text: "8" },
          { size: 8, text: "8" },
          { size: 6, text: "6", lit: true },
        ],
      },
    ],
    ["A bar of 30 cut into three parts of 8 and a part of 6.", "一个长条共 30，分成三段 8 和一段 6。"],
  ),
);

/** timesVersusMore tells times as many from more than. */
export const timesVersusMore: KnowledgePointDef = point(
  "times-as-many-versus-more-than",
  ["Times as many or more than", "几倍还是多多少"],
  [
    '3 times as many as 5 means three 5s: $3 \\times 5 = 15$. 3 more than 5 means add 3: $5 + 3 = 8$.\n\nCheck: draw the bars. Three bars of 5 are much longer than one bar of 5 with 3 added.\n\n> **Watch out.** "Times" means multiply. "More than" means add.',
    "5 的 3 倍是 3 个 5：$3 \\times 5 = 15$。比 5 多 3 是加 3：$5 + 3 = 8$。\n\n检验：画长条看。3 段 5 比 1 段 5 再加 3 长得多。\n\n> **注意。** “倍”用乘法，“多”用加法。",
  ],
  (rng) => {
    const k = rng.int(2, 9);
    const n = rng.int(3, 12);
    const times = rng.bool();
    return answered(
      times
        ? [`What number is ${k} times as many as ${n}?`, `${n} 的 ${k} 倍是多少？`]
        : [`What number is ${k} more than ${n}?`, `比 ${n} 多 ${k} 的数是多少？`],
      times ? k * n : k + n,
      [
        [
          ["Read the comparison", "读懂比较"],
          times
            ? [`"${k} times as many" means ${k} groups of ${n}.`, `“${k} 倍”就是 ${k} 个 ${n}。`]
            : [`"${k} more than" means ${n} and ${k} more.`, `“多 ${k}”就是 ${n} 再加 ${k}。`],
        ],
        [
          [times ? "Multiply" : "Add", times ? "相乘" : "相加"],
          ["", ""],
          [times ? `${k} \\times ${n} = ${k * n}` : `${n} + ${k} = ${n + k}`],
        ],
      ],
      times
        ? [
            `Add ${n} ${k} times: $${Array(k).fill(n).join(" + ")} = ${k * n}$.`,
            `把 ${k} 个 ${n} 加起来：$${Array(k).fill(n).join(" + ")} = ${k * n}$。`,
          ]
        : [
            `Count on ${k} from ${n}: ${Array.from({ length: k }, (_, i) => n + i + 1).join(", ")}.`,
            `从 ${n} 往后数 ${k} 个：${Array.from({ length: k }, (_, i) => n + i + 1).join("、")}。`,
          ],
      times
        ? [
            [k + n, "That adds. Times as many means multiply.", "这是加法。“倍”要用乘法。"],
            [k * n + n, "That is one group too many.", "这多了一组。"],
          ]
        : [
            [k * n, "That multiplies. More than means add.", "这是乘法。“多”要用加法。"],
            [
              n - k > 0 ? n - k : n + k + 1,
              n - k > 0 ? "That subtracts. More than means add." : "That counts one too many.",
              n - k > 0 ? "这是减法。“多”要用加法。" : "这多数了一个。",
            ],
          ],
      {
        figure: times
          ? equalTape(k, `${n}`, "?", 0)
          : tapeFigure(
              [
                {
                  total: "?",
                  pieces: [
                    { size: n, text: `${n}` },
                    { size: k, text: `${k}`, lit: true },
                  ],
                },
              ],
              [`A bar of ${n} with ${k} more added.`, `一个长条 ${n}，再接上 ${k}。`],
            ),
      },
    );
  },
  tapeFigure(
    [
      {
        pieces: [
          { size: 5, text: "5" },
          { size: 5, text: "5" },
          { size: 5, text: "5" },
        ],
      },
      {
        pieces: [
          { size: 5, text: "5" },
          { size: 3, text: "3", lit: true },
        ],
      },
    ],
    ["One bar of three 5s and one bar of 5 and 3.", "一个长条是 3 个 5，另一个长条是 5 再加 3。"],
  ),
);

/** equationForSmaller writes the equation for the smaller amount of a times comparison. */
export const equationForSmaller: KnowledgePointDef = point(
  "the-equation-for-the-smaller-amount",
  ["The equation for the smaller amount", "表示较小数量的方程"],
  [
    "If Emma has 24 books and that is 4 times as many as Jade's $m$, then 24 is 4 groups of $m$. So $m = 24 \\div 4 = 6$.\n\nCheck: $4 \\times 6 = 24$.\n\n> **Watch out.** The smaller amount comes from dividing, not multiplying.",
    "艾玛有 24 本书，是杰德的 $m$ 本的 4 倍，那么 24 就是 4 组 $m$。所以 $m = 24 \\div 4 = 6$。\n\n检验：$4 \\times 6 = 24$。\n\n> **注意。** 求较小的数用除法，不是乘法。",
  ],
  (rng) => {
    const k = rng.int(2, 9);
    const m = rng.int(3, 12);
    const big = k * m;
    return pickedMath(
      rng,
      [
        `Emma has ${big} books, which is ${k} times as many as Jade's $m$ books. Which equation gives $m$?`,
        `艾玛有 ${big} 本书，是杰德的 $m$ 本的 ${k} 倍。哪个方程能求出 $m$？`,
      ],
      `m = ${big} \\div ${k}`,
      [
        [`m = ${big} \\times ${k}`, `That makes Jade's books ${k} times as many as Emma's.`, `这样杰德的书反而是艾玛的 ${k} 倍。`],
        [`m = ${big} - ${k}`, `That reads "${k} times as many" as "${k} more".`, `这把“${k} 倍”当成了“多 ${k}”。`],
        [`m = ${big} + ${k}`, "That makes Jade's amount bigger, but it is smaller.", "这让杰德的书更多了，可它应该更少。"],
      ],
      [
        [["Write the comparison", "写出比较"], [`${big} is ${k} groups of $m$.`, `${big} 是 ${k} 组 $m$。`], [`${k} \\times m = ${big}`]],
        [["Undo the multiplying", "还原乘法"], ["", ""], [`m = ${big} \\div ${k}`]],
      ],
      [`Then $m = ${m}$, and $${k} \\times ${m} = ${big}$.`, `所以 $m = ${m}$，$${k} \\times ${m} = ${big}$。`],
      tapeFigure(
        [
          { total: `${big}`, pieces: Array.from({ length: k }, () => ({ size: 1, text: "m" })) },
          { pieces: [{ size: 1, text: "m", lit: true }] },
        ],
        [`A bar of ${big} cut into ${k} parts m, and one part m below.`, `一个长条 ${big} 分成 ${k} 段 m，下面是一段 m。`],
      ),
    );
  },
  tapeFigure(
    [{ total: "24", pieces: Array.from({ length: 4 }, () => ({ size: 1, text: "m" })) }, { pieces: [{ size: 1, text: "m", lit: true }] }],
    ["A bar of 24 cut into 4 parts m, and one part m below.", "一个长条 24 分成 4 段 m，下面是一段 m。"],
  ),
);

/** totalFromTimes splits a total into two amounts, one a multiple of the other. */
export const totalFromTimes: KnowledgePointDef = point(
  "two-amounts-from-a-total-and-a-times-comparison",
  ["Two amounts from a total and a times comparison", "由总数和倍数求两个量"],
  [
    "Maya has 3 times as many stickers as Leo, and they have 48 in all. Draw Leo as 1 part and Maya as 3 parts. That is 4 equal parts. One part is $48 \\div 4 = 12$. Leo has 12 and Maya has 36.\n\nCheck: $12 + 36 = 48$ and $36 = 3 \\times 12$.\n\n> **Watch out.** Divide by the number of parts, $3 + 1$, not by 3.",
    "玛雅的贴纸是利奥的 3 倍，两人一共 48 张。把利奥画成 1 份，玛雅画成 3 份，一共 4 份。1 份是 $48 \\div 4 = 12$。利奥有 12 张，玛雅有 36 张。\n\n检验：$12 + 36 = 48$，$36 = 3 \\times 12$。\n\n> **注意。** 要除以总份数 $3 + 1$，不是除以 3。",
  ],
  (rng) => {
    const k = rng.int(2, 6);
    const small = rng.int(4, 30);
    const total = small * (k + 1);
    const asksLarge = rng.bool();
    const answer = asksLarge ? k * small : small;
    return answered(
      [
        `Maya and Leo have ${total} stickers in all. Maya has ${k} times as many as Leo. How many stickers does ${asksLarge ? "Maya" : "Leo"} have?`,
        `玛雅和利奥一共有 ${total} 张贴纸。玛雅的贴纸是利奥的 ${k} 倍。${asksLarge ? "玛雅" : "利奥"}有多少张贴纸？`,
      ],
      answer,
      [
        [
          ["Count the parts", "数份数"],
          [`Leo is 1 part and Maya is ${k} parts: ${k + 1} parts in all.`, `利奥 1 份，玛雅 ${k} 份，一共 ${k + 1} 份。`],
        ],
        [["Find one part", "求 1 份"], ["", ""], [`${total} \\div ${k + 1} = ${small}`]],
        ...(asksLarge ? ([[["Find Maya's amount", "求玛雅的"], ["", ""], [`${k} \\times ${small} = ${k * small}`]]] as Walk[]) : []),
      ],
      [
        `$${small} + ${k * small} = ${total}$, and $${k * small} = ${k} \\times ${small}$.`,
        `$${small} + ${k * small} = ${total}$，并且 $${k * small} = ${k} \\times ${small}$。`,
      ],
      [
        [
          asksLarge ? small : k * small,
          asksLarge ? "That is Leo's amount." : "That is Maya's amount.",
          asksLarge ? "这是利奥的。" : "这是玛雅的。",
        ],
        [Math.floor(total / k), `That divides by ${k}. There are ${k + 1} parts.`, `这除以了 ${k}，其实一共有 ${k + 1} 份。`],
        [total - k, `That reads "${k} times as many" as "${k} more".`, `这把“${k} 倍”当成了“多 ${k}”。`],
      ],
      {
        figure: tapeFigure(
          [
            { pieces: Array.from({ length: k }, () => ({ size: 1, text: "?", lit: asksLarge })) },
            { pieces: [{ size: 1, text: "?", lit: !asksLarge }] },
          ],
          [
            `Two bars: one of ${k} equal parts and one of a single part; ${total} in all.`,
            `两个长条：一个是 ${k} 份，一个是 1 份，一共 ${total}。`,
          ],
        ),
      },
    );
  },
  tapeFigure(
    [{ pieces: Array.from({ length: 3 }, () => ({ size: 1, text: "12" })) }, { pieces: [{ size: 1, text: "12", lit: true }] }],
    ["Two bars: one of three parts of 12 and one of a single part of 12.", "两个长条：一个是 3 段 12，一个是 1 段 12。"],
  ),
);

/** patternLine draws the first terms of an adding pattern as hops on a number line. */
const patternLine = (first: number, step: number, terms: number): Figure => {
  const values = Array.from({ length: terms }, (_, i) => first + i * step);
  return lineFigure(
    { lo: first, hi: values[values.length - 1]!, step, labels: values, jumps: values.slice(1).map((v) => [v - step, v] as const) },
    [
      `A number line with hops of ${step} from ${first}: ${values.join(", ")}.`,
      `一条数轴，从 ${first} 开始每次跳 ${step}：${values.join("、")}。`,
    ],
  );
};

/** farTermOfPattern finds a far term of an adding pattern. */
export const farTermOfPattern: KnowledgePointDef = point(
  "a-far-term-of-an-adding-pattern",
  ["A far term of an adding pattern", "加法规律中较远的项"],
  [
    "A pattern starts at 4 and adds 3. To reach term 20, do not list every term. From term 1 to term 20 there are 19 steps. So term 20 is $4 + 19 \\times 3 = 61$.\n\nCheck: term 2 is $4 + 1 \\times 3 = 7$, which matches the list 4, 7, 10.\n\n> **Watch out.** Term 20 is 19 steps after term 1, not 20.",
    "一个规律从 4 开始，每次加 3。求第 20 项，不用一项项写。从第 1 项到第 20 项要走 19 步，所以第 20 项是 $4 + 19 \\times 3 = 61$。\n\n检验：第 2 项是 $4 + 1 \\times 3 = 7$，和 4、7、10 对得上。\n\n> **注意。** 第 20 项在第 1 项后面 19 步，不是 20 步。",
  ],
  (rng) => {
    const first = rng.int(2, 20);
    const step = rng.int(2, 9);
    const n = rng.int(12, 40);
    const answer = first + (n - 1) * step;
    return answered(
      [
        `A pattern starts at ${first} and adds ${step} each time. What is term number ${n}?`,
        `一个规律从 ${first} 开始，每次加 ${step}。第 ${n} 项是多少？`,
      ],
      answer,
      [
        [
          ["Count the steps", "数步数"],
          [`From term 1 to term ${n} is ${n - 1} steps.`, `从第 1 项到第 ${n} 项要走 ${n - 1} 步。`],
        ],
        [["Add the steps", "加上这些步"], ["", ""], [`${first} + ${n - 1} \\times ${step} = ${first} + ${(n - 1) * step} = ${answer}`]],
      ],
      [
        `Try the rule on term 3: $${first} + 2 \\times ${step} = ${first + 2 * step}$, which matches ${first}, ${first + step}, ${first + 2 * step}.`,
        `用这个方法算第 3 项：$${first} + 2 \\times ${step} = ${first + 2 * step}$，和 ${first}、${first + step}、${first + 2 * step} 对得上。`,
      ],
      [
        [
          first + n * step,
          `That takes ${n} steps. Term ${n} is only ${n - 1} steps after term 1.`,
          `这走了 ${n} 步。第 ${n} 项在第 1 项后面只有 ${n - 1} 步。`,
        ],
        [n * step, "That forgets the starting number.", "这忘了起始的数。"],
        [first + n - 1 + step, "That adds instead of multiplying the steps.", "这把步数和步长相加了，应该相乘。"],
      ],
      { figure: patternLine(first, step, 4) },
    );
  },
  patternLine(4, 3, 4),
);

/** positionInPattern finds which term of an adding pattern a number is. */
export const positionInPattern: KnowledgePointDef = point(
  "the-position-of-a-number-in-a-pattern",
  ["The position of a number in a pattern", "一个数在规律中的位置"],
  [
    "A pattern starts at 4 and adds 3. Which term is 31? From 4 to 31 is 27. That is $27 \\div 3 = 9$ steps. Term 1 plus 9 steps is term 10.\n\nCheck: term 10 is $4 + 9 \\times 3 = 31$.\n\n> **Watch out.** Add 1 to the number of steps, because the first term is term 1.",
    "一个规律从 4 开始，每次加 3。31 是第几项？从 4 到 31 相差 27，是 $27 \\div 3 = 9$ 步。第 1 项再走 9 步是第 10 项。\n\n检验：第 10 项是 $4 + 9 \\times 3 = 31$。\n\n> **注意。** 步数要加 1，因为第一个数是第 1 项。",
  ],
  (rng) => {
    const first = rng.int(2, 20);
    const step = rng.int(2, 9);
    const n = rng.int(8, 40);
    const value = first + (n - 1) * step;
    return answered(
      [
        `A pattern starts at ${first} and adds ${step} each time. Which term number is ${value}?`,
        `一个规律从 ${first} 开始，每次加 ${step}。${value} 是第几项？`,
      ],
      n,
      [
        [["Find the distance", "求相差多少"], ["", ""], [`${value} - ${first} = ${value - first}`]],
        [
          ["Count the steps", "求步数"],
          [
            `That is ${n - 1} steps, and term 1 plus ${n - 1} steps is term ${n}.`,
            `这是 ${n - 1} 步，第 1 项再走 ${n - 1} 步是第 ${n} 项。`,
          ],
          [`${value - first} \\div ${step} = ${n - 1}`],
        ],
      ],
      [`Term ${n} is $${first} + ${n - 1} \\times ${step} = ${value}$.`, `第 ${n} 项是 $${first} + ${n - 1} \\times ${step} = ${value}$。`],
      [
        [n - 1, "That is the number of steps. Add 1 for the first term.", "这是步数，还要加上第 1 项。"],
        [Math.floor(value / step), "That forgets the starting number.", "这忘了起始的数。"],
        [n + 1, "That counts one term too many.", "这多数了一项。"],
      ],
      { figure: patternLine(first, step, 4) },
    );
  },
  patternLine(4, 3, 4),
);

// ---------------------------------------------------------------------------
// Factors, multiples and division

/** factorList lists the factors of n in increasing order. */
const factorList = (n: number): number[] => Array.from({ length: n }, (_, i) => i + 1).filter((k) => n % k === 0);

/** gcdOf is the greatest common factor of two positive whole numbers. */
const gcdOf = (a: number, b: number): number => (b === 0 ? a : gcdOf(b, a % b));

/** pairsFigure draws the factor pairs of n as rows of a chart: each pair on one row. */
const pairsFigure = (n: number): Figure => {
  const small = factorList(n).filter((k) => k * k <= n);
  return tapeFigure(
    small.map((k) => ({ pieces: Array.from({ length: k }, () => ({ size: 1 / k, text: String(n / k) })) })),
    [`Bars of ${n}, cut into ${small.join(", ")} equal parts.`, `几个长 ${n} 的长条，分别平均分成 ${small.join("、")} 份。`],
  );
};

/** windowLine draws a short number line from lo to hi with `at` marked. */
const windowLine = (lo: number, hi: number, at: number): Figure =>
  lineFigure({ lo, hi, step: 1, labels: [lo, hi], marks: [{ at, text: String(at), result: true }] }, [
    `A number line from ${lo} to ${hi} with ${at} marked.`,
    `一条从 ${lo} 到 ${hi} 的数轴，标出 ${at}。`,
  ]);

/** hopsLine draws hops of `step` on a number line from 0, with `mark` shown. */
const hopsLine = (step: number, hops: number, mark?: number, hi = step * hops): Figure =>
  lineFigure(
    {
      lo: 0,
      hi,
      step,
      labels: Array.from({ length: Math.floor(hi / step) + 1 }, (_, i) => i * step).filter(
        (v, i, a) => a.length <= 8 || i % Math.ceil(a.length / 6) === 0 || v === hi,
      ),
      jumps: Array.from({ length: hops }, (_, i) => [i * step, (i + 1) * step] as const),
      ...(mark !== undefined && { marks: [{ at: mark, text: String(mark), result: true }] }),
    },
    [`A number line with hops of ${step} from 0.`, `一条数轴，从 0 开始每次跳 ${step}。`],
  );

/** twoHops draws the multiples of a and of b on two number lines up to their meeting point. */
const twoHops = (a: number, b: number, meet: number): Figure =>
  tapeFigure(
    [
      { pieces: Array.from({ length: meet / a }, () => ({ size: a, text: String(a) })) },
      { pieces: Array.from({ length: meet / b }, () => ({ size: b, text: String(b) })) },
    ],
    [
      `Two bars of length ${meet}, one cut into pieces of ${a}, the other into pieces of ${b}.`,
      `两个长 ${meet} 的长条，一个分成每段 ${a}，另一个分成每段 ${b}。`,
    ],
  );

/** remainderTape draws q groups of d and r left over, with the whole marked `total`. */
const remainderTape = (d: number, q: number, r: number, total: string): Figure => {
  const shown = Math.min(q, 8);
  return tapeFigure(
    [
      {
        total,
        pieces: [
          ...Array.from({ length: shown }, () => ({ size: d, text: String(d) })),
          ...(q > shown ? [{ size: d * 2, text: "…" }] : []),
          ...(r > 0 ? [{ size: Math.max(r, d / 2), text: String(r), lit: true }] : []),
        ],
      },
    ],
    [
      `A bar of ${q} pieces of ${d}${r ? ` and ${r} more` : ""}, marked ${total}.`,
      `一个长条：${q} 段 ${d}${r ? `，再加 ${r}` : ""}，整体标着 ${total}。`,
    ],
  );
};

/** countingFactors counts the factors of a number by listing them in pairs. */
export const countingFactors: KnowledgePointDef = point(
  "counting-the-factors-of-a-number",
  ["Counting the factors of a number", "数一个数的因数个数"],
  [
    "Factors come in pairs. For 36, try 1, 2, 3 and so on: $1 \\times 36$, $2 \\times 18$, $3 \\times 12$, $4 \\times 9$, $6 \\times 6$. That gives 1, 2, 3, 4, 6, 9, 12, 18 and 36, so 9 factors.\n\nCheck: stop when the pairs meet. After $6 \\times 6$ they start again in reverse.\n\n> **Watch out.** In $6 \\times 6$, count the 6 only once.",
    "因数是成对出现的。找 36 的因数，依次试 1、2、3……：$1 \\times 36$，$2 \\times 18$，$3 \\times 12$，$4 \\times 9$，$6 \\times 6$。得到 1、2、3、4、6、9、12、18、36，共 9 个。\n\n检验：两数相遇就停。$6 \\times 6$ 以后就会倒过来重复。\n\n> **注意。** $6 \\times 6$ 里的 6 只能算一次。",
  ],
  (rng) => {
    const n = rng.int(12, 100);
    const fs = factorList(n);
    const pairs = fs.filter((k) => k * k <= n);
    const square = pairs.some((k) => k * k === n);
    return answered(
      [`How many different factors does ${n} have?`, `${n} 有多少个不同的因数？`],
      fs.length,
      [
        [["List the pairs", "成对列出"], ["", ""], pairs.map((k) => `${k} \\times ${n / k} = ${n}`)],
        [
          ["Count", "数一数"],
          [`The factors are ${fs.join(", ")}: ${fs.length} in all.`, `因数是 ${fs.join("、")}，共 ${fs.length} 个。`],
        ],
      ],
      [
        `There are ${pairs.length} pairs, so ${pairs.length} × 2${square ? " − 1 for the square" : ""} = ${fs.length}.`,
        `有 ${pairs.length} 对，所以是 ${pairs.length} × 2${square ? " − 1（平方数）" : ""} = ${fs.length}。`,
      ],
      [
        [
          square ? fs.length + 1 : fs.length - 1,
          square ? "That counts the repeated factor twice." : "That misses a factor.",
          square ? "这把重复的因数算了两次。" : "这漏掉了一个因数。",
        ],
        [pairs.length, "That counts the pairs, not the factors.", "这数的是对数，不是因数个数。"],
        [fs.length - 2, "That leaves out 1 and the number itself.", "这漏掉了 1 和它本身。"],
      ],
      { figure: pairsFigure(n) },
    );
  },
  pairsFigure(36),
);

/** nextPrime finds the first prime after a number. */
export const nextPrime: KnowledgePointDef = point(
  "the-next-prime-after-a-number",
  ["The next prime after a number", "一个数之后的下一个质数"],
  [
    "Test the numbers after it one at a time. After 48: 49 is $7 \\times 7$, 50 is even, 51 is $3 \\times 17$, 52 is even, 53 has no factor but 1 and itself. So the next prime is 53.\n\nCheck: 53 is not divisible by 2, 3, 5 or 7, and $7 \\times 7 = 49$ is less than 53 while $8 \\times 8 = 64$ is more.\n\n> **Watch out.** Odd numbers like 51 and 91 can still be composite.",
    "依次检验后面的数。48 之后：49 是 $7 \\times 7$，50 是偶数，51 是 $3 \\times 17$，52 是偶数，53 只有 1 和它本身两个因数。所以下一个质数是 53。\n\n检验：53 不能被 2、3、5、7 整除，而 $8 \\times 8 = 64$ 已经比 53 大。\n\n> **注意。** 像 51、91 这样的奇数也可能是合数。",
  ],
  (rng) => {
    const isPrime = (v: number) => v > 1 && factorList(v).length === 2;
    const n = rng.int(10, 110);
    let answer = n + 1;
    while (!isPrime(answer)) answer += 1;
    const skipped = Array.from({ length: answer - n - 1 }, (_, i) => n + 1 + i);
    const decoy = skipped.find((v) => v % 2 !== 0);
    const smallest = (v: number) => factorList(v)[1]!;
    let after = answer + 1;
    while (!isPrime(after)) after += 1;
    return answered(
      [`What is the first prime number greater than ${n}?`, `比 ${n} 大的第一个质数是多少？`],
      answer,
      [
        [
          ["Rule out", "排除"],
          skipped.length
            ? [
                `${skipped.map((v) => `${v} = ${smallest(v)} × ${v / smallest(v)}`).join("; ")}.`,
                `${skipped.map((v) => `${v} = ${smallest(v)} × ${v / smallest(v)}`).join("；")}。`,
              ]
            : ["No number comes between.", "中间没有别的数。"],
        ],
        [
          ["Test the next", "检验下一个"],
          [`${answer} has no factor but 1 and itself, so it is prime.`, `${answer} 只有 1 和它本身两个因数，是质数。`],
        ],
      ],
      [`Try dividing ${answer} by 2, 3, 5 and 7: none goes in evenly.`, `用 2、3、5、7 去除 ${answer}，都除不尽。`],
      [
        [
          decoy ?? n + 1,
          decoy ? `${decoy} = ${smallest(decoy)} × ${decoy / smallest(decoy)}, so it is not prime.` : `${n + 1} is not prime.`,
          decoy ? `${decoy} = ${smallest(decoy)} × ${decoy / smallest(decoy)}，不是质数。` : `${n + 1} 不是质数。`,
        ],
        [after, `That is a prime, but ${answer} comes first.`, `这是质数，但 ${answer} 更靠前。`],
        [n, "That is the number itself, not a number greater than it.", "这是它本身，不比它大。"],
      ],
      {
        figure: lineFigure({ lo: n, hi: n + 8, step: 1, labels: [n, n + 8], marks: [{ at: answer, text: String(answer), result: true }] }, [
          `A number line from ${n} to ${n + 8}.`,
          `一条从 ${n} 到 ${n + 8} 的数轴。`,
        ]),
      },
    );
  },
  lineFigure({ lo: 48, hi: 56, step: 1, labels: [48, 56], marks: [{ at: 53, text: "53", result: true }] }, [
    "A number line from 48 to 56.",
    "一条从 48 到 56 的数轴。",
  ]),
);

/** whenEventsMeet finds when two repeating events next happen together. */
export const whenEventsMeet: KnowledgePointDef = point(
  "when-two-repeating-events-meet-again",
  ["When two repeating events meet again", "两件重复的事何时再次同时发生"],
  [
    "One light flashes every 4 seconds, another every 6. Both flash now. They flash together again at the first common multiple: 4, 8, **12** and 6, **12**. So after 12 seconds.\n\nCheck: $12 \\div 4 = 3$ and $12 \\div 6 = 2$, and no smaller number works.\n\n> **Watch out.** $4 \\times 6 = 24$ is a time they meet, but not the first.",
    "一盏灯每 4 秒闪一次，另一盏每 6 秒闪一次，现在同时闪。下一次同时闪是在第一个公倍数：4、8、**12** 和 6、**12**。所以过 12 秒。\n\n检验：$12 \\div 4 = 3$，$12 \\div 6 = 2$，没有更小的数满足。\n\n> **注意。** $4 \\times 6 = 24$ 时也会同时闪，但不是第一次。",
  ],
  (rng) => {
    const a = rng.pick([4, 6, 8, 9, 10, 12]);
    const b = rng.pick([4, 6, 8, 9, 10, 12, 14, 15].filter((v) => v !== a && gcdOf(v, a) > 1));
    const answer = (a * b) / gcdOf(a, b);
    const big = Math.max(a, b);
    const small = Math.min(a, b);
    const scene = rng.pick([
      ["Two lights flash together now", "两盏灯现在同时闪", "seconds", "秒", "flash"],
      ["Two buses leave the stop together now", "两路公交车现在同时发车", "minutes", "分钟", "leave"],
      ["Two bells ring together now", "两口钟现在同时响", "minutes", "分钟", "ring"],
    ] as const);
    return answered(
      [
        `${scene[0]}. One repeats every ${a} ${scene[2]} and the other every ${b} ${scene[2]}. After how many ${scene[2]} do they next ${scene[4]} together?`,
        `${scene[1]}。一个每 ${a} ${scene[3]}一次，另一个每 ${b} ${scene[3]}一次。再过多少${scene[3]}它们又同时发生？`,
      ],
      answer,
      [
        [
          ["List multiples of the larger", "列出较大数的倍数"],
          ["", ""],
          [Array.from({ length: answer / big }, (_, i) => big * (i + 1)).join(", ")],
        ],
        [
          ["Find the first that fits", "找第一个也是另一个数的倍数的"],
          [`${answer} is the first that ${small} divides.`, `${answer} 是第一个能被 ${small} 整除的。`],
        ],
      ],
      [
        `$${answer} \\div ${a} = ${answer / a}$ and $${answer} \\div ${b} = ${answer / b}$.`,
        `$${answer} \\div ${a} = ${answer / a}$，$${answer} \\div ${b} = ${answer / b}$。`,
      ],
      [
        [a * b, "That is a time they meet, but not the first.", "这时也会同时发生，但不是第一次。"],
        [a + b, "That adds the two gaps.", "这把两个间隔相加了。"],
        [gcdOf(a, b), "That is the greatest common factor, not a common multiple.", "这是最大公因数，不是公倍数。"],
      ],
      { figure: twoHops(a, b, answer) },
    );
  },
  twoHops(4, 6, 12),
);

/** largestEqualGroups shares two amounts into the most identical groups. */
export const largestEqualGroups: KnowledgePointDef = point(
  "the-largest-equal-groups",
  ["The largest equal groups", "最多能分成多少个相同的组"],
  [
    "Share 12 pencils and 18 erasers into identical groups with none left. The number of groups must divide 12 and 18. The greatest such number is 6, so 6 groups, each with 2 pencils and 3 erasers.\n\nCheck: $6 \\times 2 = 12$ and $6 \\times 3 = 18$.\n\n> **Watch out.** This needs a common factor, not a common multiple.",
    "把 12 支铅笔和 18 块橡皮分成相同的组，没有剩余。组数要同时整除 12 和 18，最大的是 6，所以分 6 组，每组 2 支铅笔、3 块橡皮。\n\n检验：$6 \\times 2 = 12$，$6 \\times 3 = 18$。\n\n> **注意。** 这里要找公因数，不是公倍数。",
  ],
  (rng) => {
    const gg = rng.int(3, 9);
    const x = rng.int(2, 6);
    const y = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => v !== x && gcdOf(v, x) === 1));
    const a = gg * x;
    const b = gg * y;
    const asksGroups = rng.bool();
    const answer = asksGroups ? gg : x + y;
    return answered(
      [
        `A teacher shares ${a} pencils and ${b} erasers into identical groups, with none left over, making as many groups as possible. ${asksGroups ? "How many groups are there?" : "How many items in all are in each group?"}`,
        `老师把 ${a} 支铅笔和 ${b} 块橡皮分成相同的组，没有剩余，组数尽量多。${asksGroups ? "一共有几组？" : "每组一共有几件？"}`,
      ],
      answer,
      [
        [
          ["Find the greatest common factor", "求最大公因数"],
          [
            `The factors shared by ${a} and ${b} are ${factorList(gg).join(", ")}. The greatest is ${gg}.`,
            `${a} 和 ${b} 的公因数是 ${factorList(gg).join("、")}，最大的是 ${gg}。`,
          ],
        ],
        [
          ["Make the groups", "分组"],
          ["", ""],
          [`${a} \\div ${gg} = ${x}`, `${b} \\div ${gg} = ${y}`],
        ],
      ],
      [
        `${gg} groups of ${x} + ${y} = ${x + y} items make $${gg} \\times ${x + y} = ${a + b}$, all the items.`,
        `${gg} 组，每组 ${x} + ${y} = ${x + y} 件，共 $${gg} \\times ${x + y} = ${a + b}$ 件，正好全部。`,
      ],
      [
        [
          asksGroups ? x + y : gg,
          asksGroups ? "That is the number of items in a group." : "That is the number of groups.",
          asksGroups ? "这是每组的件数。" : "这是组数。",
        ],
        [(a * b) / gg, "That is the least common multiple. Sharing needs a common factor.", "这是最小公倍数，分组要用公因数。"],
        [a + b, "That is all the items together.", "这是全部物品的总数。"],
      ],
      {
        figure: tapeFigure(
          [
            { total: String(a), pieces: Array.from({ length: gg }, () => ({ size: x, text: String(x) })) },
            { total: String(b), pieces: Array.from({ length: gg }, () => ({ size: y, text: String(y) })) },
          ],
          [`Two bars of ${a} and ${b}, each cut into ${gg} equal parts.`, `两个长条 ${a} 和 ${b}，各平均分成 ${gg} 份。`],
        ),
      },
    );
  },
  tapeFigure(
    [
      { total: "12", pieces: Array.from({ length: 6 }, () => ({ size: 2, text: "2" })) },
      { total: "18", pieces: Array.from({ length: 6 }, () => ({ size: 3, text: "3" })) },
    ],
    ["Two bars of 12 and 18, each cut into 6 equal parts.", "两个长条 12 和 18，各平均分成 6 份。"],
  ),
);

/** countingMultiples counts the multiples of a number up to a limit by dividing. */
export const countingMultiples: KnowledgePointDef = point(
  "counting-multiples-up-to-a-number",
  ["Counting multiples up to a number", "数到某个数为止的倍数个数"],
  [
    "How many multiples of 7 are from 1 to 50? Each multiple is one more group of 7. $50 \\div 7 = 7$ R 1, so 7 groups fit. There are 7 multiples, and the last one is 49.\n\nCheck: the next multiple, 56, is more than 50.\n\n> **Watch out.** Ignore the remainder. A part of a group is not a multiple.",
    "从 1 到 50 有几个 7 的倍数？每个倍数就是多一组 7。$50 \\div 7 = 7$ 余 1，能放下 7 组，所以有 7 个倍数，最后一个是 49。\n\n检验：下一个倍数 56 比 50 大。\n\n> **注意。** 余数不用管，不满一组不是倍数。",
  ],
  (rng) => {
    const k = rng.int(3, 12);
    let limit = rng.int(40, 300);
    while (limit % k === 0) limit = rng.int(40, 300);
    const answer = Math.floor(limit / k);
    return answered(
      [`How many multiples of ${k} are there from 1 to ${limit}?`, `从 1 到 ${limit} 有多少个 ${k} 的倍数？`],
      answer,
      [
        [["Divide", "相除"], ["", ""], [`${limit} = ${k} \\times ${answer} + ${limit % k}`]],
        [
          ["Count the full groups", "数满组"],
          [`${answer} groups of ${k} fit, so there are ${answer} multiples.`, `能放下 ${answer} 组 ${k}，所以有 ${answer} 个倍数。`],
        ],
      ],
      [
        `The last is $${k} \\times ${answer} = ${k * answer}$, and the next, ${k * (answer + 1)}, is more than ${limit}.`,
        `最后一个是 $${k} \\times ${answer} = ${k * answer}$，下一个 ${k * (answer + 1)} 比 ${limit} 大。`,
      ],
      [
        [
          answer + 1,
          `$${k} \\times ${answer + 1} = ${k * (answer + 1)}$ is more than ${limit}.`,
          `$${k} \\times ${answer + 1} = ${k * (answer + 1)}$ 比 ${limit} 大。`,
        ],
        [limit % k, "That is the remainder.", "这是余数。"],
        [k * answer, "That is the last multiple, not how many there are.", "这是最后一个倍数，不是个数。"],
      ],
      { figure: remainderTape(k, answer, limit % k, String(limit)) },
    );
  },
  hopsLine(7, 7, 50, 56),
);

/** dividendFromQuotient rebuilds a number from its divisor, quotient and remainder. */
export const dividendFromQuotient: KnowledgePointDef = point(
  "the-dividend-from-the-quotient-and-remainder",
  ["The dividend from the quotient and remainder", "由商和余数求被除数"],
  [
    "A number divided by 8 gives 6 R 3. Undo it: the number is 6 groups of 8 and 3 more. $8 \\times 6 + 3 = 51$.\n\nCheck: $51 \\div 8 = 6$ R 3.\n\n> **Watch out.** Multiply first, then add the remainder.",
    "一个数除以 8，商 6 余 3。倒过来想：这个数是 6 个 8 再加 3。$8 \\times 6 + 3 = 51$。\n\n检验：$51 \\div 8 = 6$ 余 3。\n\n> **注意。** 先乘，再加余数。",
  ],
  (rng) => {
    const d = rng.int(3, 12);
    const q = rng.int(6, 99);
    const r = rng.int(1, d - 1);
    const answer = q * d + r;
    return answered(
      [
        `When a number is divided by ${d}, the quotient is ${q} and the remainder is ${r}. What is the number?`,
        `一个数除以 ${d}，商是 ${q}，余数是 ${r}。这个数是多少？`,
      ],
      answer,
      [
        [["Multiply", "相乘"], ["", ""], [`${d} \\times ${q} = ${d * q}`]],
        [["Add the remainder", "加余数"], ["", ""], [`${d * q} + ${r} = ${answer}`]],
      ],
      [
        `Divide back: ${answer} − ${r} = ${d * q}, and $${d * q} \\div ${d} = ${q}$.`,
        `倒回去：${answer} − ${r} = ${d * q}，$${d * q} \\div ${d} = ${q}$。`,
      ],
      [
        [q * d, "That forgets the remainder.", "这忘了加余数。"],
        [q * d - r, "That subtracts the remainder.", "这减去了余数。"],
        [q + d + r, "That adds all three numbers.", "这把三个数加起来了。"],
      ],
      { figure: remainderTape(d, q, r, "?") },
    );
  },
  remainderTape(8, 6, 3, "?"),
);

/** largestWithQuotient finds the largest number with a given quotient. */
export const largestWithQuotient: KnowledgePointDef = point(
  "the-largest-number-with-a-given-quotient",
  ["The largest number with a given quotient", "商一定时的最大被除数"],
  [
    "A remainder is always less than the divisor. Dividing by 5, it can be at most 4. So the largest number with quotient 8 is $5 \\times 8 + 4 = 44$.\n\nCheck: $45 \\div 5 = 9$, so 45 already has a bigger quotient.\n\n> **Watch out.** The remainder cannot equal the divisor.",
    "余数总比除数小。除以 5 时，余数最大是 4。所以商是 8 的最大的数是 $5 \\times 8 + 4 = 44$。\n\n检验：$45 \\div 5 = 9$，45 的商已经变大了。\n\n> **注意。** 余数不能等于除数。",
  ],
  (rng) => {
    const d = rng.int(3, 12);
    const q = rng.int(5, 60);
    const answer = q * d + d - 1;
    return answered(
      [
        `A whole number divided by ${d} has quotient ${q} and some remainder. What is the largest the number can be?`,
        `一个整数除以 ${d}，商是 ${q}，有余数。这个数最大是多少？`,
      ],
      answer,
      [
        [
          ["Find the largest remainder", "求最大余数"],
          [`Dividing by ${d}, the remainder is at most ${d - 1}.`, `除以 ${d}，余数最大是 ${d - 1}。`],
        ],
        [["Build the number", "求这个数"], ["", ""], [`${d} \\times ${q} + ${d - 1} = ${answer}`]],
      ],
      [
        `One more, ${answer + 1}, is $${d} \\times ${q + 1}$, which has quotient ${q + 1}.`,
        `再大 1 是 ${answer + 1}，等于 $${d} \\times ${q + 1}$，商变成 ${q + 1}。`,
      ],
      [
        [answer + 1, `That is $${d} \\times ${q + 1}$, with quotient ${q + 1}.`, `这是 $${d} \\times ${q + 1}$，商是 ${q + 1}。`],
        [q * d, `That has no remainder, and larger numbers still have quotient ${q}.`, `这没有余数，比它大的数商还是 ${q}。`],
        [q * d + 1, "That uses the smallest remainder, not the largest.", "这用的是最小的余数。"],
      ],
      { figure: windowLine(d * q, d * (q + 1), answer) },
    );
  },
  windowLine(40, 45, 44),
);

/** fullHundreds reads full groups of 10, 100 or 1,000 and the leftover from the digits. */
export const fullHundreds: KnowledgePointDef = point(
  "how-many-full-groups-of-a-power-of-ten",
  ["How many full groups of a power of ten", "能装满多少组 10、100 或 1,000"],
  [
    "Pack 4,237 nails into boxes of 100. Cover the last two digits: 42 full boxes. The covered digits, 37, are left over.\n\nCheck: $42 \\times 100 + 37 = 4{,}237$.\n\n> **Watch out.** For boxes of 1,000, cover three digits, not two.",
    "把 4,237 枚钉子装进每盒 100 枚的盒子。盖住最后两位：能装满 42 盒，盖住的 37 是剩下的。\n\n检验：$42 \\times 100 + 37 = 4{,}237$。\n\n> **注意。** 每盒 1,000 枚时要盖住三位，不是两位。",
  ],
  (rng) => {
    const size = rng.pick([10, 100, 1000]);
    let count = rng.int(1200, 98000);
    if (count % size === 0) count += rng.int(1, 9);
    const groups = Math.floor(count / size);
    const left = count % size;
    const asksLeft = rng.bool();
    const zeros = String(size).length - 1;
    return answered(
      [
        `A factory packs $${g(count)}$ nails into boxes of $${g(size)}$. ${asksLeft ? "How many nails are left after filling as many boxes as possible?" : "How many boxes can it fill?"}`,
        `工厂把 $${g(count)}$ 枚钉子装进每盒 $${g(size)}$ 枚的盒子。${asksLeft ? "尽量装满后还剩多少枚？" : "能装满多少盒？"}`,
      ],
      asksLeft ? left : groups,
      [
        [
          ["Cover the digits", "盖住数字"],
          [
            `${p(size)} has ${zeros} zero${zeros > 1 ? "s" : ""}, so cover the last ${zeros} digit${zeros > 1 ? "s" : ""}.`,
            `${p(size)} 有 ${zeros} 个 0，所以盖住最后 ${zeros} 位。`,
          ],
        ],
        [
          ["Read both parts", "读出两部分"],
          [`${p(groups)} full boxes and ${left} left over.`, `装满 ${p(groups)} 盒，剩下 ${left} 枚。`],
        ],
      ],
      [`$${g(groups)} \\times ${g(size)} + ${left} = ${g(count)}$.`, `$${g(groups)} \\times ${g(size)} + ${left} = ${g(count)}$。`],
      [
        [
          asksLeft ? groups : left,
          asksLeft ? "That is the number of full boxes." : "That is what is left over.",
          asksLeft ? "这是装满的盒数。" : "这是剩下的枚数。",
        ],
        [
          asksLeft ? size - left : groups + 1,
          asksLeft ? "That is how many more would fill another box." : "The last box would not be full.",
          asksLeft ? "这是再装满一盒还差的数。" : "最后一盒装不满。",
        ],
        [asksLeft ? count % (size * 10) : Math.floor(count / (size * 10)), "That covers one digit too many.", "这多盖住了一位。"],
      ],
      { figure: digitsChart([count]) },
    );
  },
  digitsChart([4237]),
);

/** missingDigitInFactor finds a hidden digit of a factor by dividing the product. */
export const missingDigitInFactor: KnowledgePointDef = point(
  "a-missing-digit-in-a-multiplication",
  ["A missing digit in a multiplication", "乘法中缺失的数字"],
  [
    "In $3\\square4 \\times 6 = 2{,}124$, undo the multiplication: $2{,}124 \\div 6 = 354$. So the missing digit is 5.\n\nCheck: $354 \\times 6 = 2{,}124$.\n\n> **Watch out.** Divide the product by the factor you know, not by the hidden one.",
    "在 $3\\square4 \\times 6 = 2{,}124$ 中，把乘法倒过来：$2{,}124 \\div 6 = 354$。所以缺失的数字是 5。\n\n检验：$354 \\times 6 = 2{,}124$。\n\n> **注意。** 用积除以已知的因数。",
  ],
  (rng) => {
    const m = rng.int(3, 9);
    const hundreds = rng.int(1, 9);
    const tens = rng.int(0, 9);
    const ones = rng.int(1, 9);
    const hiddenTens = rng.bool();
    const factor = 100 * hundreds + 10 * tens + ones;
    const product = factor * m;
    const shown = hiddenTens ? `${hundreds}\\square${ones}` : `${hundreds}${tens}\\square`;
    const digit = hiddenTens ? tens : ones;
    return answered(
      [`Find the missing digit: $$${shown} \\times ${m} = ${g(product)}$$`, `求缺失的数字：$$${shown} \\times ${m} = ${g(product)}$$`],
      digit,
      [
        [["Undo the multiplication", "倒过来除"], ["", ""], [`${g(product)} \\div ${m} = ${factor}`]],
        [
          ["Read the digit", "读出数字"],
          [`The ${hiddenTens ? "tens" : "ones"} digit of ${factor} is ${digit}.`, `${factor} 的${hiddenTens ? "十" : "个"}位是 ${digit}。`],
        ],
      ],
      [`$${factor} \\times ${m} = ${g(product)}$.`, `$${factor} \\times ${m} = ${g(product)}$。`],
      [
        [
          (digit + 1) % 10,
          `$${factor + (hiddenTens ? 10 : 1) * (((digit + 1) % 10) - digit)} \\times ${m}$ is not ${p(product)}.`,
          `$${factor + (hiddenTens ? 10 : 1) * (((digit + 1) % 10) - digit)} \\times ${m}$ 不等于 ${p(product)}。`,
        ],
        [
          (digit + 9) % 10,
          `$${factor + (hiddenTens ? 10 : 1) * (((digit + 9) % 10) - digit)} \\times ${m}$ is not ${p(product)}.`,
          `$${factor + (hiddenTens ? 10 : 1) * (((digit + 9) % 10) - digit)} \\times ${m}$ 不等于 ${p(product)}。`,
        ],
        [m, "That is the other factor.", "这是另一个因数。"],
      ],
      { figure: digitsChart([factor, product]) },
    );
  },
  digitsChart([354, 2124]),
);

/** threeLcm finds the least common multiple of three numbers two at a time. */
export const threeLcm: KnowledgePointDef = point(
  "the-least-common-multiple-of-three-numbers",
  ["The least common multiple of three numbers", "三个数的最小公倍数"],
  [
    "Find it two at a time. For 4, 6 and 10: the least common multiple of 4 and 6 is 12. Then the least common multiple of 12 and 10 is 60.\n\nCheck: $60 \\div 4 = 15$, $60 \\div 6 = 10$, $60 \\div 10 = 6$.\n\n> **Watch out.** $4 \\times 6 \\times 10 = 240$ is a common multiple, but not the least.",
    "两个两个地求。4、6、10：4 和 6 的最小公倍数是 12，12 和 10 的最小公倍数是 60。\n\n检验：$60 \\div 4 = 15$，$60 \\div 6 = 10$，$60 \\div 10 = 6$。\n\n> **注意。** $4 \\times 6 \\times 10 = 240$ 是公倍数，但不是最小的。",
  ],
  (rng) => {
    const lcmOf = (x: number, y: number) => (x * y) / gcdOf(x, y);
    let a = 0;
    let b = 0;
    let c = 0;
    do [a, b, c] = rng.sample([2, 3, 4, 5, 6, 8, 9, 10, 12, 15], 3) as [number, number, number];
    while (lcmOf(lcmOf(a, b), c) === a * b * c || lcmOf(lcmOf(a, b), c) > 360);
    const ab = lcmOf(a, b);
    const answer = lcmOf(ab, c);
    return answered(
      [`What is the least common multiple of ${a}, ${b} and ${c}?`, `${a}、${b} 和 ${c} 的最小公倍数是多少？`],
      answer,
      [
        [
          ["Take two", "先求两个"],
          [`The least common multiple of ${a} and ${b} is ${ab}.`, `${a} 和 ${b} 的最小公倍数是 ${ab}。`],
        ],
        [
          ["Add the third", "再加第三个"],
          [`The least common multiple of ${ab} and ${c} is ${answer}.`, `${ab} 和 ${c} 的最小公倍数是 ${answer}。`],
        ],
      ],
      [
        `$${answer} \\div ${a} = ${answer / a}$, $${answer} \\div ${b} = ${answer / b}$, $${answer} \\div ${c} = ${answer / c}$.`,
        `$${answer} \\div ${a} = ${answer / a}$，$${answer} \\div ${b} = ${answer / b}$，$${answer} \\div ${c} = ${answer / c}$。`,
      ],
      [
        [a * b * c, "That is a common multiple, but not the least.", "这是公倍数，但不是最小的。"],
        [ab, `That is not a multiple of ${c}.`, `这不是 ${c} 的倍数。`],
        [gcdOf(gcdOf(a, b), c), "That is a common factor.", "这是公因数。"],
      ],
      { figure: hopsLine(Math.max(a, b, c), answer / Math.max(a, b, c), answer) },
    );
  },
  hopsLine(10, 6, 60),
);

/** missingPartial finds the partial product for the ones of the second factor. */
export const missingPartial: KnowledgePointDef = point(
  "a-missing-partial-product",
  ["A missing partial product", "缺少的部分积"],
  [
    "$34 \\times 27 = 34 \\times 20 + 34 \\times 7$. If $680$ is given, the missing part is $34 \\times 7 = 238$.\n\nCheck: $680 + 238 = 918$, and $34 \\times 27 = 918$.\n\n> **Watch out.** Multiply by the ones digit, 7, not by 27.",
    "$34 \\times 27 = 34 \\times 20 + 34 \\times 7$。如果已知 $680$，缺少的部分就是 $34 \\times 7 = 238$。\n\n检验：$680 + 238 = 918$，而 $34 \\times 27 = 918$。\n\n> **注意。** 乘的是个位上的 7，不是 27。",
  ],
  (rng) => {
    const a = rng.int(12, 99);
    const tens = rng.int(1, 9) * 10;
    const ones = rng.int(2, 9);
    const answer = a * ones;
    return answered(
      [
        `What number makes this true? $$${a} \\times ${tens + ones} = ${g(a * tens)} + \\square$$`,
        `什么数使下式成立？$$${a} \\times ${tens + ones} = ${g(a * tens)} + \\square$$`,
      ],
      answer,
      [
        [["Split the factor", "拆开因数"], ["", ""], [`${tens + ones} = ${tens} + ${ones}`]],
        [["Multiply by the ones", "乘个位"], ["", ""], [`${a} \\times ${ones} = ${answer}`]],
      ],
      [
        `$${g(a * tens)} + ${answer} = ${g(a * (tens + ones))}$, which is $${a} \\times ${tens + ones}$.`,
        `$${g(a * tens)} + ${answer} = ${g(a * (tens + ones))}$，正是 $${a} \\times ${tens + ones}$。`,
      ],
      [
        [a * (tens + ones), "That is the whole product.", "这是整个积。"],
        [a + ones, "That adds instead of multiplying.", "这是相加，应该相乘。"],
        [a * tens, "That is the part already given.", "这是已经给出的部分。"],
      ],
      { figure: areaGridFigure([String(a)], [String(tens), String(ones)], [[p(a * tens), "?"]], [1], [tens, Math.max(ones, tens / 4)]) },
    );
  },
  areaGridFigure(["34"], ["20", "7"], [["680", "?"]], [1], [20, 7]),
);

/** theDividend counts all the objects from full groups and the leftover. */
export const theDividend: KnowledgePointDef = point(
  "the-dividend-from-a-quotient-and-remainder",
  ["The dividend from a quotient and remainder", "由商和余数求被除数"],
  [
    "A model shows 7 full groups of 4 and 3 left over. All the objects are $7 \\times 4 + 3 = 31$. So the division was $31 \\div 4 = 7$ R 3.\n\nCheck: count by 4s to 28, then 29, 30, 31.\n\n> **Watch out.** The leftover objects belong to the total too.",
    "一个模型有 7 个满组，每组 4 个，还剩 3 个。一共是 $7 \\times 4 + 3 = 31$ 个，所以这是 $31 \\div 4 = 7$ 余 3。\n\n检验：按 4 数到 28，再数 29、30、31。\n\n> **注意。** 剩下的也要算进总数。",
  ],
  (rng) => {
    const d = rng.int(3, 9);
    const q = rng.int(4, 12);
    const r = rng.int(1, d - 1);
    const answer = d * q + r;
    return answered(
      [
        `Some counters are put into groups of ${d}. There are ${q} full groups and ${r} left over. How many counters are there?`,
        `一些圆片每 ${d} 个分成一组，有 ${q} 个满组，还剩 ${r} 个。一共有多少个圆片？`,
      ],
      answer,
      [
        [["Count the full groups", "算满组"], ["", ""], [`${q} \\times ${d} = ${d * q}`]],
        [["Add the leftover", "加上剩下的"], ["", ""], [`${d * q} + ${r} = ${answer}`]],
      ],
      [
        `$${answer} \\div ${d}$: ${q} groups use ${d * q}, and ${r} are left.`,
        `$${answer} \\div ${d}$：${q} 组用 ${d * q} 个，剩 ${r} 个。`,
      ],
      [
        [d * q, "That forgets the leftover.", "这忘了剩下的。"],
        [d * (q + 1), "That counts the leftover as a full group.", "这把剩下的算成了一个满组。"],
        [q + d + r, "That adds the numbers instead of multiplying.", "这是相加，应该先乘。"],
      ],
      { figure: remainderTape(d, q, r, "?") },
    );
  },
  remainderTape(4, 7, 3, "?"),
);

/** largestRemainder finds the largest possible remainder for a divisor. */
export const largestRemainder: KnowledgePointDef = point(
  "the-largest-possible-remainder",
  ["The largest possible remainder", "最大可能的余数"],
  [
    "Share things into groups of 6. If 6 were left, they would make one more group. So at most 5 can be left. The largest remainder is one less than the divisor.\n\nCheck: $6 \\times 3 + 5 = 23$ works, but 24 is exactly 4 groups.\n\n> **Watch out.** The remainder can never equal the divisor.",
    "按每组 6 个分。如果剩下 6 个，就能再分一组，所以最多剩 5 个。最大的余数比除数小 1。\n\n检验：$6 \\times 3 + 5 = 23$ 可以，而 24 正好是 4 组。\n\n> **注意。** 余数不能等于除数。",
  ],
  (rng) => {
    const d = rng.int(3, 30);
    const items = rng.pick<Pair>([
      ["marbles", "弹珠"],
      ["stickers", "贴纸"],
      ["cards", "卡片"],
      ["beads", "珠子"],
    ]);
    return answered(
      [
        `Some ${items[0]} are put into groups of ${d}, with some left over. What is the largest number that can be left over?`,
        `把一些${items[1]}每 ${d} 个分成一组，还有剩余。最多能剩多少个？`,
      ],
      d - 1,
      [
        [
          ["Think of a full group", "想一个满组"],
          [`If ${d} were left, they would make another group.`, `如果剩 ${d} 个，就能再分一组。`],
        ],
        [["Take one less", "少一个"], ["", ""], [`${d} - 1 = ${d - 1}`]],
      ],
      [`${d - 1} is less than ${d}, so no new group fits.`, `${d - 1} 比 ${d} 小，不能再分一组。`],
      [
        [d, `${d} left over would make another group.`, `剩 ${d} 个还能再分一组。`],
        [d + 1, `That is more than ${d}.`, `这比 ${d} 还多。`],
        [1, "That is the smallest remainder, not the largest.", "这是最小的余数。"],
      ],
      { figure: remainderTape(d, 3, d - 1, "?") },
    );
  },
  remainderTape(6, 3, 5, "?"),
);

/** twoGroupsFewer multiplies by a number two below a round one. */
export const twoGroupsFewer: KnowledgePointDef = point(
  "two-groups-fewer",
  ["Two groups fewer", "少两组"],
  [
    "To find $8 \\times 15$, start from $10 \\times 15 = 150$. 8 is 2 less than 10, so take away 2 groups of 15: $150 - 30 = 120$.\n\nCheck: $8 \\times 15 = 8 \\times 10 + 8 \\times 5 = 80 + 40 = 120$.\n\n> **Watch out.** Take away 2 groups of 15, not just 2.",
    "求 $8 \\times 15$，从 $10 \\times 15 = 150$ 开始。8 比 10 少 2，就去掉 2 个 15：$150 - 30 = 120$。\n\n检验：$8 \\times 15 = 8 \\times 10 + 8 \\times 5 = 80 + 40 = 120$。\n\n> **注意。** 去掉的是 2 个 15，不是 2。",
  ],
  (rng) => {
    const a = rng.int(12, 49);
    const k = rng.int(1, 3);
    const m = 10 * k - 2;
    return answered(
      [
        `Use $${10 * k} \\times ${a} = ${g(10 * k * a)}$ to find $${m} \\times ${a}$.`,
        `利用 $${10 * k} \\times ${a} = ${g(10 * k * a)}$ 求 $${m} \\times ${a}$。`,
      ],
      m * a,
      [
        [
          ["Count the extra groups", "数多出的组"],
          [`${m} is 2 less than ${10 * k}, so 2 groups of ${a} are extra.`, `${m} 比 ${10 * k} 少 2，多算了 2 个 ${a}。`],
          [`2 \\times ${a} = ${2 * a}`],
        ],
        [["Take them away", "去掉"], ["", ""], [`${g(10 * k * a)} - ${2 * a} = ${g(m * a)}`]],
      ],
      [
        `Split ${a}: $${m} \\times ${a - (a % 10)} + ${m} \\times ${a % 10} = ${g(m * (a - (a % 10)))} + ${m * (a % 10)} = ${g(m * a)}$.`,
        `拆开 ${a}：$${m} \\times ${a - (a % 10)} + ${m} \\times ${a % 10} = ${g(m * (a - (a % 10)))} + ${m * (a % 10)} = ${g(m * a)}$。`,
      ],
      [
        [10 * k * a - a, "That takes away only one group.", "这只去掉了一组。"],
        [10 * k * a - 2, "That takes away 2, not 2 groups.", "这只去掉了 2，不是 2 组。"],
        [10 * k * a + 2 * a, "That adds the groups instead of taking them away.", "这把两组加上了，应该去掉。"],
      ],
      {
        figure: tapeFigure(
          [
            {
              total: String(10 * k),
              pieces: [
                { size: m, text: String(m) },
                { size: 2, text: "2", lit: true },
              ],
            },
          ],
          [`A bar of ${10 * k} groups: ${m} groups and 2 extra.`, `一个长条，${10 * k} 组：${m} 组和多出的 2 组。`],
        ),
      },
    );
  },
  tapeFigure(
    [
      {
        total: "10",
        pieces: [
          { size: 8, text: "8" },
          { size: 2, text: "2", lit: true },
        ],
      },
    ],
    ["A bar of 10 groups: 8 groups and 2 extra.", "一个长条，10 组：8 组和多出的 2 组。"],
  ),
);

/** factorsFromParts finds the other factor from the parts of an area model. */
export const factorsFromParts: KnowledgePointDef = point(
  "the-factors-from-the-parts",
  ["The factors from the parts", "由各部分求因数"],
  [
    "An area model has side 4 and parts 80 and 12. The other side was split into $80 \\div 4 = 20$ and $12 \\div 4 = 3$. So it is $20 + 3 = 23$.\n\nCheck: $4 \\times 23 = 92 = 80 + 12$.\n\n> **Watch out.** Add the side lengths, not the areas.",
    "一个面积模型一边是 4，两部分面积是 80 和 12。另一边分成 $80 \\div 4 = 20$ 和 $12 \\div 4 = 3$，所以是 $20 + 3 = 23$。\n\n检验：$4 \\times 23 = 92 = 80 + 12$。\n\n> **注意。** 加的是边长，不是面积。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const tens = rng.int(1, 9);
    const ones = rng.int(1, 9);
    const n = tens * 10 + ones;
    return answered(
      [
        `An area model has one side of ${a}. Its two parts have areas ${a * tens * 10} and ${a * ones}. What two-digit number is the other side?`,
        `一个面积模型一边是 ${a}，两部分面积是 ${a * tens * 10} 和 ${a * ones}。另一边是哪个两位数？`,
      ],
      n,
      [
        [
          ["Divide each part", "每部分除以边长"],
          ["", ""],
          [`${a * tens * 10} \\div ${a} = ${tens * 10}`, `${a * ones} \\div ${a} = ${ones}`],
        ],
        [["Add the lengths", "长度相加"], ["", ""], [`${tens * 10} + ${ones} = ${n}`]],
      ],
      [
        `$${a} \\times ${n} = ${a * n}$, and $${a * tens * 10} + ${a * ones} = ${a * n}$.`,
        `$${a} \\times ${n} = ${a * n}$，而 $${a * tens * 10} + ${a * ones} = ${a * n}$。`,
      ],
      [
        [a * n, "That adds the areas.", "这是面积相加。"],
        [ones * 10 + tens, "That swaps the tens and the ones.", "这把十位和个位换了。"],
        [tens + ones, "That adds the digits.", "这把数字相加了。"],
      ],
      {
        figure: areaGridFigure(
          [String(a)],
          ["?", "?"],
          [[String(a * tens * 10), String(a * ones)]],
          [1],
          [tens * 10, Math.max(ones, tens * 3)],
        ),
      },
    );
  },
  areaGridFigure(["4"], ["?", "?"], [["80", "12"]], [1], [20, 6]),
);

/** largestPart finds the largest part of a three-digit area model. */
export const largestPart: KnowledgePointDef = point(
  "the-largest-part-of-the-model",
  ["The largest part of the model", "模型中最大的部分"],
  [
    "In the model for $6 \\times 348$, the parts are $6 \\times 300$, $6 \\times 40$ and $6 \\times 8$. The hundreds part is the largest: $6 \\times 300 = 1{,}800$.\n\nCheck: the other parts, 240 and 48, are much smaller.\n\n> **Watch out.** The largest part is not the whole product.",
    "$6 \\times 348$ 的模型分成 $6 \\times 300$、$6 \\times 40$、$6 \\times 8$。百位这一部分最大：$6 \\times 300 = 1{,}800$。\n\n检验：另外两部分 240 和 48 小得多。\n\n> **注意。** 最大的部分不是整个积。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const h = rng.int(1, 9);
    const t = rng.int(1, 9);
    const o = rng.int(1, 9);
    const n = 100 * h + 10 * t + o;
    return answered(
      [
        `An area model shows $${a} \\times ${n}$, split by place value. What is the area of its largest part?`,
        `一个面积模型表示 $${a} \\times ${n}$，按数位拆分。最大部分的面积是多少？`,
      ],
      a * h * 100,
      [
        [["Split by place", "按数位拆"], ["", ""], [`${n} = ${100 * h} + ${10 * t} + ${o}`]],
        [["Multiply the hundreds", "乘百位"], ["", ""], [`${a} \\times ${100 * h} = ${g(a * h * 100)}`]],
      ],
      [
        `The other parts are $${a} \\times ${10 * t} = ${a * t * 10}$ and $${a} \\times ${o} = ${a * o}$, both smaller.`,
        `另外两部分是 $${a} \\times ${10 * t} = ${a * t * 10}$ 和 $${a} \\times ${o} = ${a * o}$，都更小。`,
      ],
      [
        [a * n, "That is the whole product.", "这是整个积。"],
        [a * h * 10, "That is ten times too small.", "这小了十倍。"],
        [a * t * 10, "That is the tens part.", "这是十位那一部分。"],
      ],
      {
        figure: areaGridFigure(
          [String(a)],
          [String(100 * h), String(10 * t), String(o)],
          [["?", String(a * t * 10), String(a * o)]],
          [1],
          [100 * h, Math.max(10 * t, 40), 30],
        ),
      },
    );
  },
  areaGridFigure(["6"], ["300", "40", "8"], [["?", "240", "48"]], [1], [300, 60, 30]),
);

/** tensTimesTens finds the largest part of a two-by-two area model. */
export const tensTimesTens: KnowledgePointDef = point(
  "tens-times-tens-first",
  ["Tens times tens first", "先算十乘十"],
  [
    "In the model for $36 \\times 42$, the four parts are $30 \\times 40$, $30 \\times 2$, $6 \\times 40$ and $6 \\times 2$. Tens times tens is the largest: $30 \\times 40 = 1{,}200$.\n\nCheck: $3 \\times 4 = 12$, then two zeros: 1,200.\n\n> **Watch out.** $30 \\times 40$ has two zeros, so it is 1,200, not 120.",
    "$36 \\times 42$ 的模型有四部分：$30 \\times 40$、$30 \\times 2$、$6 \\times 40$、$6 \\times 2$。十乘十最大：$30 \\times 40 = 1{,}200$。\n\n检验：$3 \\times 4 = 12$，再添两个 0，是 1,200。\n\n> **注意。** $30 \\times 40$ 末尾有两个 0，是 1,200，不是 120。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const x1 = rng.int(1, 9);
    const y1 = rng.int(1, 9);
    const x = a * 10 + x1;
    const y = b * 10 + y1;
    return answered(
      [
        `What is the area of the largest of the four parts of an area model for $${x} \\times ${y}$?`,
        `$${x} \\times ${y}$ 的面积模型有四部分，最大部分的面积是多少？`,
      ],
      a * b * 100,
      [
        [
          ["Take the tens", "取十位"],
          [`The tens are ${a * 10} and ${b * 10}.`, `十位上是 ${a * 10} 和 ${b * 10}。`],
        ],
        [
          ["Multiply", "相乘"],
          ["", ""],
          [`${a} \\times ${b} = ${a * b}`, `${a * 10} \\times ${b * 10} = ${g(a * b * 100)}`],
        ],
      ],
      [
        `The next biggest part, $${a * 10} \\times ${y1}$ or $${x1} \\times ${b * 10}$, is at most ${Math.max(a * 10 * y1, x1 * b * 10)}.`,
        `次大的部分 $${a * 10} \\times ${y1}$ 或 $${x1} \\times ${b * 10}$ 最多是 ${Math.max(a * 10 * y1, x1 * b * 10)}。`,
      ],
      [
        [x * y, "That is the whole product.", "这是整个积。"],
        [a * b * 10, "That has only one zero.", "这只添了一个 0。"],
        [a * b, "That forgets both zeros.", "这两个 0 都忘了。"],
      ],
      {
        figure: areaGridFigure(
          [String(a * 10), String(x1)],
          [String(b * 10), String(y1)],
          [
            ["?", ""],
            ["", ""],
          ],
          [a * 10, Math.max(x1, 4)],
          [b * 10, Math.max(y1, 4)],
        ),
      },
    );
  },
  areaGridFigure(
    ["30", "6"],
    ["40", "2"],
    [
      ["?", ""],
      ["", ""],
    ],
    [30, 6],
    [40, 4],
  ),
);

/** rebuildDividendKP builds the knowledge point of rebuilding a number from a division with quotients in `range`. */
function rebuildDividendKP(id: string, title: Pair, range: [number, number], ex: [number, number, number]): KnowledgePointDef {
  const [ed, eq, er] = ex;
  const en = ed * eq + er;
  return point(
    id,
    title,
    [
      `A division by ${ed} gives ${p(eq)} R ${er}. To find the number divided, multiply back and add the remainder: $${ed} \\times ${g(eq)} + ${er} = ${g(en)}$.\n\nCheck: $${g(en)} - ${er} = ${g(ed * eq)}$, and $${g(ed * eq)} \\div ${ed} = ${g(eq)}$.\n\n> **Watch out.** Multiply by the divisor. Do not divide again.`,
      `一个数除以 ${ed} 得 ${p(eq)} 余 ${er}。求被除数，就乘回去再加余数：$${ed} \\times ${g(eq)} + ${er} = ${g(en)}$。\n\n检验：$${g(en)} - ${er} = ${g(ed * eq)}$，$${g(ed * eq)} \\div ${ed} = ${g(eq)}$。\n\n> **注意。** 要乘除数，不要再除一次。`,
    ],
    (rng) => {
      const d = rng.int(2, 9);
      const q = rng.int(range[0], range[1]);
      const r = rng.int(0, d - 1);
      const n = d * q + r;
      return answered(
        r > 0
          ? [
              `A division by ${d} gives $${g(q)}$ with remainder ${r}. What number was divided?`,
              `一个数除以 ${d} 得 $${g(q)}$，余 ${r}。被除数是多少？`,
            ]
          : [
              `A division by ${d} gives $${g(q)}$ with no remainder. What number was divided?`,
              `一个数除以 ${d} 得 $${g(q)}$，没有余数。被除数是多少？`,
            ],
        n,
        [
          [["Multiply back", "乘回去"], ["", ""], [`${d} \\times ${g(q)} = ${g(d * q)}`]],
          [["Add the remainder", "加余数"], ["", ""], [`${g(d * q)} + ${r} = ${g(n)}`]],
        ],
        [
          `Divide: $${g(n)} \\div ${d}$ gives ${p(q)}${r ? ` R ${r}` : ""}.`,
          `再除：$${g(n)} \\div ${d}$ 得 ${p(q)}${r ? ` 余 ${r}` : ""}。`,
        ],
        [
          ...(r > 0 ? ([[d * q, "That forgets the remainder.", "这忘了加余数。"]] as Miss[]) : []),
          [d + q + r, "That adds instead of multiplying.", "这是相加，应该相乘。"],
          [Math.floor(q / d), "That divides again instead of multiplying back.", "这又除了一次，应该乘回去。"],
          [d * (q + 1) + r, "That uses one group too many.", "这多算了一组。"],
        ],
        { figure: remainderTape(d, Math.min(q, 6), r, "?") },
      );
    },
    remainderTape(ed, Math.min(eq, 6), er, "?"),
  );
}

/** numberDividedTwoDigits rebuilds a dividend from a two-digit quotient. */
export const numberDividedTwoDigits = rebuildDividendKP(
  "the-number-divided-up-to-two-digits",
  ["The number that was divided", "被除数是多少"],
  [12, 49],
  [6, 14, 2],
);
/** numberDividedThreeDigits rebuilds a dividend from a three-digit quotient. */
export const numberDividedThreeDigits = rebuildDividendKP(
  "the-number-divided-up-to-three-digits",
  ["The number divided, from three digits", "三位数的被除数"],
  [112, 899],
  [4, 213, 3],
);
/** numberDividedFourDigits rebuilds a dividend from a four-digit quotient. */
export const numberDividedFourDigits = rebuildDividendKP(
  "the-number-divided-up-to-four-digits",
  ["The number divided, from four digits", "四位数的被除数"],
  [1120, 4999],
  [3, 1205, 2],
);

/** splittingDividend picks a split of the dividend whose parts both divide evenly. */
export const splittingDividend: KnowledgePointDef = point(
  "splitting-a-dividend-to-divide",
  ["Which split divides evenly", "哪种拆分能整除"],
  [
    "For $156 \\div 4$, split 156 into parts that 4 goes into: $120 + 36$. Then $120 \\div 4 = 30$ and $36 \\div 4 = 9$, so the answer is 39.\n\nCheck: $4 \\times 39 = 156$.\n\n> **Watch out.** Check that both parts divide evenly, not just the first one.",
    "计算 $156 \\div 4$，把 156 拆成 4 能整除的两部分：$120 + 36$。$120 \\div 4 = 30$，$36 \\div 4 = 9$，所以得 39。\n\n检验：$4 \\times 39 = 156$。\n\n> **注意。** 两部分都要检查能否被 4 整除。",
  ],
  (rng) => {
    const d = rng.int(3, 9);
    const q1 = rng.int(1, 9) * 10;
    const q2 = rng.int(2, 9);
    const n = d * (q1 + q2);
    const a = d * q1;
    const b = d * q2;
    return pickedMath(
      rng,
      [`Which split of ${n} lets you divide each part evenly by ${d}?`, `把 ${n} 怎样拆分，两部分都能被 ${d} 整除？`],
      `${a} + ${b}`,
      [
        [`${a + 1} + ${b - 1}`, `${a + 1} does not divide evenly by ${d}.`, `${a + 1} 不能被 ${d} 整除。`],
        [`${a - 1} + ${b + 1}`, `${a - 1} does not divide evenly by ${d}.`, `${a - 1} 不能被 ${d} 整除。`],
        [`${a + 2} + ${b - 2}`, `${a + 2} does not divide evenly by ${d}.`, `${a + 2} 不能被 ${d} 整除。`],
      ],
      [
        [["Test the first part", "检查第一部分"], ["", ""], [`${a} = ${d} \\times ${q1}`]],
        [["Test the second part", "检查第二部分"], ["", ""], [`${b} = ${d} \\times ${q2}`]],
      ],
      [
        `$${q1} + ${q2} = ${q1 + q2}$, and $${d} \\times ${q1 + q2} = ${n}$.`,
        `$${q1} + ${q2} = ${q1 + q2}$，而 $${d} \\times ${q1 + q2} = ${n}$。`,
      ],
      tapeFigure(
        [
          {
            total: String(n),
            pieces: [
              { size: a, text: String(a) },
              { size: Math.max(b, n / 5), text: String(b) },
            ],
          },
        ],
        [`A bar of ${n} split into ${a} and ${b}.`, `一个长条 ${n}，拆成 ${a} 和 ${b}。`],
      ),
    );
  },
  tapeFigure(
    [
      {
        total: "156",
        pieces: [
          { size: 120, text: "120" },
          { size: 36, text: "36" },
        ],
      },
    ],
    ["A bar of 156 split into 120 and 36.", "一个长条 156，拆成 120 和 36。"],
  ),
);

/** betweenRoundQuotients traps a quotient between two multiples of 10. */
export const betweenRoundQuotients: KnowledgePointDef = point(
  "between-two-round-quotients",
  ["Between two round quotients", "商在两个整十数之间"],
  [
    "For $331 \\div 4$: $4 \\times 80 = 320$ and $4 \\times 90 = 360$. 331 is between 320 and 360, so the quotient is between 80 and 90.\n\nCheck: $331 \\div 4 = 82$ R 3, and 82 is between 80 and 90.\n\n> **Watch out.** Compare with the multiples of the divisor, not with the dividend itself.",
    "计算 $331 \\div 4$：$4 \\times 80 = 320$，$4 \\times 90 = 360$。331 在 320 和 360 之间，所以商在 80 和 90 之间。\n\n检验：$331 \\div 4 = 82$ 余 3，82 在 80 和 90 之间。\n\n> **注意。** 要和除数的倍数比，不是和被除数比。",
  ],
  (rng) => {
    const d = rng.int(3, 9);
    const k = rng.int(2, 9);
    const n = d * k * 10 + rng.int(1, d * 10 - 1);
    return answered(
      [
        `The quotient $${n} \\div ${d}$ lies between two multiples of 10. What is the smaller one?`,
        `商 $${n} \\div ${d}$ 在两个相邻的整十数之间。较小的是多少？`,
      ],
      k * 10,
      [
        [
          ["Try multiples of 10", "试整十数"],
          ["", ""],
          [`${d} \\times ${k * 10} = ${d * k * 10}`, `${d} \\times ${(k + 1) * 10} = ${d * (k + 1) * 10}`],
        ],
        [
          ["Place the dividend", "看被除数的位置"],
          [
            `${n} is between ${d * k * 10} and ${d * (k + 1) * 10}, so the quotient is between ${k * 10} and ${(k + 1) * 10}.`,
            `${n} 在 ${d * k * 10} 和 ${d * (k + 1) * 10} 之间，所以商在 ${k * 10} 和 ${(k + 1) * 10} 之间。`,
          ],
        ],
      ],
      [
        `$${n} \\div ${d} = ${Math.floor(n / d)}$ R ${n % d}, between ${k * 10} and ${(k + 1) * 10}.`,
        `$${n} \\div ${d} = ${Math.floor(n / d)}$ 余 ${n % d}，在 ${k * 10} 和 ${(k + 1) * 10} 之间。`,
      ],
      [
        [(k + 1) * 10, "That is the larger one.", "这是较大的那个。"],
        [d * 10, "That multiplies the divisor by 10.", "这是除数乘 10。"],
        [(k - 1) * 10, `$${d} \\times ${(k - 1) * 10}$ is too far below ${n}.`, `$${d} \\times ${(k - 1) * 10}$ 离 ${n} 太远了。`],
      ],
      {
        figure: lineFigure(
          {
            lo: d * k * 10,
            hi: d * (k + 1) * 10,
            step: d * 5,
            labels: [d * k * 10, d * (k + 1) * 10],
            marks: [{ at: n, text: String(n), result: true }],
          },
          [
            `A number line from ${d * k * 10} to ${d * (k + 1) * 10} with ${n} marked.`,
            `一条从 ${d * k * 10} 到 ${d * (k + 1) * 10} 的数轴，标出 ${n}。`,
          ],
        ),
      },
    );
  },
  lineFigure({ lo: 320, hi: 360, step: 20, labels: [320, 360], marks: [{ at: 331, text: "331", result: true }] }, [
    "A number line from 320 to 360 with 331 marked.",
    "一条从 320 到 360 的数轴，标出 331。",
  ]),
);

/** totalAreaFromSides finds the dividend of a division area model from its side lengths. */
export const totalAreaFromSides: KnowledgePointDef = point(
  "the-total-area-from-the-side-lengths",
  ["The dividend from the model", "由模型求被除数"],
  [
    "A division model has side 4, and the other side is split into 20 and 3. The total area is the number divided: $4 \\times 20 + 4 \\times 3 = 80 + 12 = 92$.\n\nCheck: $92 \\div 4 = 23 = 20 + 3$.\n\n> **Watch out.** Multiply each part by the side. Do not just add the lengths.",
    "一个除法模型一边是 4，另一边分成 20 和 3。总面积就是被除数：$4 \\times 20 + 4 \\times 3 = 80 + 12 = 92$。\n\n检验：$92 \\div 4 = 23 = 20 + 3$。\n\n> **注意。** 每部分都要乘边长，不能只把长相加。",
  ],
  (rng) => {
    const d = rng.int(2, 9);
    const tt = rng.int(1, 3) * 10;
    const o = rng.int(1, 9);
    return answered(
      [
        `A division model has side ${d} on one edge, and the other edge is split into ${tt} and ${o}. What number was divided?`,
        `一个除法模型一边是 ${d}，另一边分成 ${tt} 和 ${o}。被除数是多少？`,
      ],
      d * (tt + o),
      [
        [
          ["Find each area", "求每部分面积"],
          ["", ""],
          [`${d} \\times ${tt} = ${d * tt}`, `${d} \\times ${o} = ${d * o}`],
        ],
        [["Add the areas", "面积相加"], ["", ""], [`${d * tt} + ${d * o} = ${d * (tt + o)}`]],
      ],
      [`$${d * (tt + o)} \\div ${d} = ${tt + o}$, which is ${tt} + ${o}.`, `$${d * (tt + o)} \\div ${d} = ${tt + o}$，正是 ${tt} + ${o}。`],
      [
        [d + tt + o, "That adds the lengths.", "这是把长相加了。"],
        [d * tt, "That leaves out the second part.", "这漏掉了第二部分。"],
        [tt + o, "That is the quotient, not the number divided.", "这是商，不是被除数。"],
      ],
      { figure: areaGridFigure([String(d)], [String(tt), String(o)], [["?", "?"]], [1], [tt, Math.max(o, tt / 3)]) },
    );
  },
  areaGridFigure(["4"], ["20", "3"], [["?", "?"]], [1], [20, 7]),
);

/** remainsAfterPartial finds what is left after two partial quotients. */
export const remainsAfterPartial: KnowledgePointDef = point(
  "what-remains-after-a-partial-quotient",
  ["What remains after two partial quotients", "两次部分商之后还剩多少"],
  [
    "For $96 \\div 4$, Jade takes away 10 groups of 4, then 10 more. That is 20 groups, or 80. $96 - 80 = 16$ is still left to divide.\n\nCheck: 16 is 4 more groups of 4, so the answer will be $20 + 4 = 24$.\n\n> **Watch out.** Take away groups of 4, not just the numbers 10 and 10.",
    "计算 $96 \\div 4$，杰德先去掉 10 组 4，再去掉 10 组，一共 20 组，是 80。$96 - 80 = 16$，还剩 16 要除。\n\n检验：16 是 4 组 4，所以商是 $20 + 4 = 24$。\n\n> **注意。** 去掉的是若干组 4，不是 10 和 10。",
  ],
  (rng) => {
    const d = rng.int(3, 7);
    const q1 = rng.int(1, 2) * 10;
    const q2 = rng.int(2, 5);
    const q3 = rng.int(1, 9);
    const n = d * (q1 + q2 + q3);
    return answered(
      [
        `To find $${n} \\div ${d}$, Jade first takes away ${q1} groups of ${d} and then ${q2} more groups of ${d}. How much is left to divide?`,
        `计算 $${n} \\div ${d}$，杰德先去掉 ${q1} 组 ${d}，再去掉 ${q2} 组 ${d}。还剩多少要除？`,
      ],
      d * q3,
      [
        [
          ["Count what is taken", "算去掉的"],
          ["", ""],
          [`${d} \\times ${q1} + ${d} \\times ${q2} = ${d * q1} + ${d * q2} = ${d * (q1 + q2)}`],
        ],
        [["Subtract", "相减"], ["", ""], [`${n} - ${d * (q1 + q2)} = ${d * q3}`]],
      ],
      [
        `$${d * q3} = ${d} \\times ${q3}$, so the quotient is $${q1} + ${q2} + ${q3} = ${q1 + q2 + q3}$, and $${d} \\times ${q1 + q2 + q3} = ${n}$.`,
        `$${d * q3} = ${d} \\times ${q3}$，商是 $${q1} + ${q2} + ${q3} = ${q1 + q2 + q3}$，而 $${d} \\times ${q1 + q2 + q3} = ${n}$。`,
      ],
      [
        [q3, "That is the groups still to take, not the amount left.", "这是还要去掉的组数，不是剩下的数。"],
        [n - d * q1, "That takes away only the first groups.", "这只去掉了第一次的组。"],
        [n - q1 - q2, "That takes away the numbers of groups, not the groups.", "这减去的是组数，不是组。"],
      ],
      {
        figure: tapeFigure(
          [
            {
              total: String(n),
              pieces: [
                { size: d * q1, text: String(d * q1) },
                { size: Math.max(d * q2, n / 6), text: String(d * q2) },
                { size: Math.max(d * q3, n / 6), text: "?", lit: true },
              ],
            },
          ],
          [`A bar of ${n} with ${d * q1} and ${d * q2} taken away.`, `一个长条 ${n}，去掉 ${d * q1} 和 ${d * q2}。`],
        ),
      },
    );
  },
  tapeFigure(
    [
      {
        total: "96",
        pieces: [
          { size: 40, text: "40" },
          { size: 40, text: "40" },
          { size: 16, text: "?", lit: true },
        ],
      },
    ],
    ["A bar of 96 with 40 and 40 taken away.", "一个长条 96，去掉 40 和 40。"],
  ),
);
