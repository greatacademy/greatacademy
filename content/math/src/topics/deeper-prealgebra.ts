// Further knowledge points for topics of Prealgebra, each a skill the topic's own
// points leave out: working backwards, combining a fact with another, an edge
// condition, or a word problem built on the idea. See `deeperPrealgebraPoints`.

import type { Figure, KnowledgePointDef } from "@ga/content";
import { dec, paren, Q } from "@ga/subject-math";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";
import { remainingDrawings4 } from "../explanation-drawings-remaining-4.ts";

import { tableFigure } from "./early-grades-more-kit.ts";
import { convertingSquareAndCubicUnits } from "./grade-5-measurement.ts";
import { drawn, lesson, type Off, valued } from "./grade-6-kit.ts";
import { equalTape, lineFigure, tapeFigure } from "./upper-grades-kit.ts";

/** gcdPre is the greatest common factor of two positive integers. */
const gcdPre = (a: number, b: number): number => (b === 0 ? a : gcdPre(b, a % b));

/** differenceLatex writes the subtraction of b from a, as an addition when b is negative. */
const differenceLatex = (a: number, b: number): string => (b < 0 ? `${a} + ${-b}` : `${a} - ${b}`);

/** ordinalEn writes a positive integer as an English ordinal such as "21st" or "112th". */
function ordinalEn(n: number): string {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  const last = n % 10;
  return `${n}${last === 1 ? "st" : last === 2 ? "nd" : last === 3 ? "rd" : "th"}`;
}

/** repeatingBlock lists the digits of the repeating block of a proper fraction whose decimal repeats from the first place. */
function repeatingBlock(n: number, d: number): number[] {
  const digits: number[] = [];
  let rest = n;
  do {
    rest *= 10;
    digits.push(Math.floor(rest / d));
    rest %= d;
  } while (rest !== n);
  return digits;
}

const wholesBetweenFractions: KnowledgePointDef = lesson(
  "whole-numbers-between-two-improper-fractions",
  ["Whole numbers between two improper fractions", "两个假分数之间的整数"],
  [
    [
      "Improper fractions with different denominators are hard to compare by their numerators, but as mixed numbers they sit clearly on the number line. The whole part of a mixed number tells which two whole numbers it lies between. So rewrite both fractions and list the whole numbers above the smaller one and up to the whole part of the larger one. The whole part of the smaller fraction is below it, so it does not count.\n\nBetween $\\frac{17}{5} = 3\\frac{2}{5}$ and $\\frac{31}{4} = 7\\frac{3}{4}$ lie $4$, $5$, $6$ and $7$: four whole numbers.",
      "分母不同的假分数很难只看分子来比较，但化成带分数后，它们在数轴上的位置就很清楚了。带分数的整数部分说明它位于哪两个整数之间。所以把两个分数都改写，然后列出比较小的数大、且不超过较大数的整数部分的所有整数。较小分数的整数部分比它本身小，所以不算在内。\n\n在 $\\frac{17}{5} = 3\\frac{2}{5}$ 和 $\\frac{31}{4} = 7\\frac{3}{4}$ 之间有 $4$、$5$、$6$、$7$，共四个整数。",
    ],
    [
      "Test the ends with whole numbers written as fractions: $\\frac{20}{5} = 4$ is above $\\frac{17}{5}$, and $\\frac{28}{4} = 7$ is below $\\frac{31}{4}$.",
      "把端点处的整数写成分数来检验：$\\frac{20}{5} = 4$ 大于 $\\frac{17}{5}$，$\\frac{28}{4} = 7$ 小于 $\\frac{31}{4}$。",
    ],
    [
      "Count from the whole number just above the smaller fraction, not from its whole part, which lies below it.",
      "要从比较小的分数大的第一个整数开始数，而不是从它的整数部分开始，那个数在它的下方。",
    ],
  ],
  (rng) => {
    const d = rng.pick([3, 4, 5, 7, 8]);
    const e = rng.pick([3, 4, 5, 7, 8]);
    const low = rng.int(2, 9);
    const high = low + rng.int(2, 7);
    const r = rng.pick([1, 2, 3, 4, 5, 6, 7].filter((v) => v < d && gcdPre(v, d) === 1));
    const s = rng.pick([1, 2, 3, 4, 5, 6, 7].filter((v) => v < e && gcdPre(v, e) === 1));
    const a = d * low + r;
    const b = e * high + s;
    const answer = high - low;
    return valued(
      [
        `How many whole numbers lie strictly between $\\frac{${a}}{${d}}$ and $\\frac{${b}}{${e}}$?`,
        `严格位于 $\\frac{${a}}{${d}}$ 和 $\\frac{${b}}{${e}}$ 之间的整数有多少个？`,
      ],
      answer,
      [
        [
          ["Write mixed numbers", "化成带分数"],
          ["Divide each numerator by its denominator:", "用分子除以分母："],
          [`\\frac{${a}}{${d}} = ${low}\\frac{${r}}{${d}}`, `\\frac{${b}}{${e}} = ${high}\\frac{${s}}{${e}}`],
        ],
        [
          ["Count", "计数"],
          [`The whole numbers between them run from $${low + 1}$ up to $${high}$:`, `它们之间的整数从 $${low + 1}$ 到 $${high}$：`],
          [`${high} - ${low + 1} + 1 = ${answer}`],
        ],
      ],
      [
        `Test the ends: $${low + 1} = \\frac{${(low + 1) * d}}{${d}}$ is above $\\frac{${a}}{${d}}$, and $${high} = \\frac{${high * e}}{${e}}$ is below $\\frac{${b}}{${e}}$.`,
        `检验端点：$${low + 1} = \\frac{${(low + 1) * d}}{${d}}$ 大于 $\\frac{${a}}{${d}}$，$${high} = \\frac{${high * e}}{${e}}$ 小于 $\\frac{${b}}{${e}}$。`,
      ],
      [
        [
          answer + 1,
          `You counted $${low}$, the whole part of the smaller fraction. It lies below that fraction.`,
          `你把 $${low}$ 也数进去了，它是较小分数的整数部分，在那个分数的下方。`,
        ],
        [
          answer - 1,
          `You left out $${high}$. It is below $\\frac{${b}}{${e}}$, so it counts.`,
          `你漏掉了 $${high}$。它小于 $\\frac{${b}}{${e}}$，应当算上。`,
        ],
        [
          high,
          `That is the whole part of the larger fraction, not how many whole numbers there are.`,
          `这是较大分数的整数部分，不是整数的个数。`,
        ],
        [
          b - a,
          "You subtracted the numerators, but the denominators differ. Write mixed numbers first.",
          "你把分子相减了，但分母不同。应先化成带分数。",
        ],
      ],
      {
        form: "integer",
        figure: lineFigure(
          {
            lo: low,
            hi: high + 1,
            step: 1,
            labels: Array.from({ length: high - low + 2 }, (_, i) => low + i),
            marks: [
              { at: a / d, text: `${a}/${d}` },
              { at: b / e, text: `${b}/${e}` },
            ],
          },
          [
            `A number line from ${low} to ${high + 1} with ${a}/${d} and ${b}/${e} marked.`,
            `一条从 ${low} 到 ${high + 1} 的数轴，标出 ${a}/${d} 和 ${b}/${e}。`,
          ],
        ),
      },
    );
  },
  drawn(remainingDrawings4["mixed-numbers#whole-numbers-between-two-improper-fractions"]),
);

const farDigit = lesson(
  "a-far-digit-of-a-repeating-decimal",
  ["A far digit of a repeating decimal", "循环小数中很远的一位"],
  [
    [
      "A repeating decimal repeats one block of digits forever, so a far digit can be found without writing them all. Divide the position by the length of the block; the remainder says which digit of the block it is. $\\frac{1}{7} = 0.\\overline{142857}$, and $20 \\div 6 = 3$ R $2$, so the $20$th digit is the $2$nd of the block, $4$.",
      "循环小数不断重复同一个循环节，所以很远的一位不必全写出来。用位置除以循环节的长度，余数说明是循环节中的第几个数字。$\\frac{1}{7} = 0.\\overline{142857}$，$20 \\div 6 = 3$ 余 $2$，所以第 $20$ 位是循环节的第 $2$ 个数字，即 $4$。",
    ],
    [
      "Three full blocks fill $18$ places; places $19$ and $20$ are $1$ and $4$.",
      "三个完整的循环节占 $18$ 位；第 $19$、$20$ 位是 $1$ 和 $4$。",
    ],
    [
      "A remainder of $0$ means the place ends a full block, so the digit is the last of the block, not the first.",
      "余数是 $0$ 表示这一位正好是一个完整循环节的末尾，所以是循环节的最后一个数字，不是第一个。",
    ],
  ],
  (rng) => {
    const d = rng.pick([7, 13, 27, 37]);
    const n = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12].filter((v) => v < d && gcdPre(v, d) === 1));
    const block = repeatingBlock(n, d);
    const size = block.length;
    const position = rng.int(20, 400);
    const remainder = position % size;
    const index = (remainder + size - 1) % size;
    const answer = block[index] as number;
    const full = Math.floor(position / size);
    const block1 = Math.ceil(position / size);
    const start = (block1 - 1) * size + 1;
    const offs: Off[] = [
      [block[remainder % size] as number, "That is the digit one place further along the block.", "这是循环节中再往后一位的数字。"],
      [
        remainder,
        "That is the remainder, a place in the block, not the digit there.",
        "这是余数，表示循环节中的位置，不是那一位上的数字。",
      ],
      [size, "That is the length of the block.", "这是循环节的长度。"],
      [block[0] as number, "That is the first digit of the block.", "这是循环节的第一个数字。"],
      [block[size - 1] as number, "That is the last digit of the block.", "这是循环节的最后一个数字。"],
    ];
    return valued(
      [
        `What is the ${ordinalEn(position)} digit after the decimal point in the decimal form of $\\frac{${n}}{${d}}$?`,
        `$\\frac{${n}}{${d}}$ 写成小数后，小数点后第 $${position}$ 位上的数字是多少？`,
      ],
      answer,
      [
        [
          ["Find the block", "找出循环节"],
          [`Divide $${n}$ by $${d}$; the block has $${size}$ digits:`, `用 $${n}$ 除以 $${d}$，循环节有 $${size}$ 位：`],
          [`\\frac{${n}}{${d}} = 0.\\overline{${block.join("")}}`],
        ],
        [
          ["Divide the place", "用位置除"],
          ["By the length of the block:", "除以循环节的长度："],
          [`${position} \\div ${size} = ${full} \\text{ R } ${remainder}`],
        ],
        [
          ["Read the digit", "读出数字"],
          remainder === 0
            ? ["Remainder $0$ ends a full block, so take the last digit:", "余数是 $0$，正好是完整循环节的末尾，取最后一个数字："]
            : [
                `Remainder $${remainder}$ means digit number $${remainder}$ of the block:`,
                `余数是 $${remainder}$，就是循环节的第 $${remainder}$ 个数字：`,
              ],
          [`${answer}`],
        ],
      ],
      [
        `Block number $${block1}$ fills places $${start}$ to $${start + size - 1}$, and place $${position}$ is its digit number $${index + 1}$: in $${block.join("")}$ that is $${answer}$.`,
        `第 $${block1}$ 个循环节占第 $${start}$ 到第 $${start + size - 1}$ 位，第 $${position}$ 位是其中的第 $${index + 1}$ 个数字：在 $${block.join("")}$ 中是 $${answer}$。`,
      ],
      offs,
    );
  },
  tableFigure(["1", "2", "3", "4", "5", "6"], [1, 4, 2, 8, 5, 7]),
);
const joiningRatios = lesson(
  "joining-two-ratios-through-a-shared-part",
  ["Joining two ratios through a shared part", "通过共同部分连接两个比"],
  [
    [
      "Two ratios that share an amount can be joined into one, once the shared amount has the same number in both. Scale each ratio so the shared part becomes a common multiple. Cats to dogs $2 : 3$ and dogs to rabbits $4 : 5$: make the dogs $12$, giving $8 : 12$ and $12 : 15$, so cats, dogs and rabbits are $8 : 12 : 15$.",
      "两个比如果有一个共同的量，先让这个量在两个比中对应的数相同，就能连成一个比。把每个比都扩大，使共同部分变成公倍数。猫和狗是 $2 : 3$，狗和兔子是 $4 : 5$：让狗变成 $12$，得到 $8 : 12$ 和 $12 : 15$，所以猫、狗、兔子的比是 $8 : 12 : 15$。",
    ],
    ["$8 : 12 = 2 : 3$ and $12 : 15 = 4 : 5$.", "$8 : 12 = 2 : 3$，$12 : 15 = 4 : 5$。"],
    [
      "Do not join the outer numbers straight away. $2 : 5$ is wrong, because the $3$ dogs and the $4$ dogs are different sizes of group.",
      "不能直接把外侧两个数连起来。$2 : 5$ 是错的，因为 $3$ 份狗和 $4$ 份狗的每份大小不同。",
    ],
  ],
  (rng) => {
    const firstPairs: readonly (readonly [number, number])[] = [
      [2, 3],
      [3, 4],
      [1, 2],
      [3, 2],
      [5, 4],
      [2, 5],
      [4, 3],
      [5, 6],
    ];
    const [p, q] = rng.pick(firstPairs);
    const [r, s] = rng.pick(firstPairs.filter(([first]) => first !== q));
    const common = (q * r) / gcdPre(q, r);
    const scale = rng.int(2, 7);
    const first = (scale * p * common) / q;
    const middle = scale * common;
    const last = (scale * s * common) / r;
    const pa = (p * common) / q;
    const sc = (s * common) / r;
    const [a, b, c, aZh, bZh, cZh, measure] = rng.pick([
      ["cats", "dogs", "rabbits", "猫", "狗", "兔子", "只"],
      ["violins", "cellos", "flutes", "小提琴", "大提琴", "长笛", "件"],
      ["apples", "pears", "plums", "苹果", "梨", "李子", "个"],
      ["red beads", "blue beads", "green beads", "红珠子", "蓝珠子", "绿珠子", "颗"],
    ]) as [string, string, string, string, string, string, string];
    return valued(
      [
        `The ratio of ${a} to ${b} is $${p} : ${q}$, and the ratio of ${b} to ${c} is $${r} : ${s}$. There are $${last}$ ${c}. How many ${a} are there?`,
        `${aZh}和${bZh}的比是 $${p} : ${q}$，${bZh}和${cZh}的比是 $${r} : ${s}$。${cZh}有 $${last}$ ${measure}。${aZh}有多少${measure}？`,
      ],
      first,
      [
        [
          ["Match the shared part", "统一共同部分"],
          [`Make the ${b} $${common}$ in both ratios:`, `让${bZh}在两个比中都是 $${common}$：`],
          [`${p} : ${q} = ${pa} : ${common}`, `${r} : ${s} = ${common} : ${sc}`],
        ],
        [["Join them", "连成一个比"], [`${a}, ${b} and ${c}:`, `${aZh}、${bZh}、${cZh}：`], [`${pa} : ${common} : ${sc}`]],
        [
          ["Scale up", "按倍数扩大"],
          [
            `$${last}$ ${c} is $${last} \\div ${sc} = ${scale}$ times $${sc}$:`,
            `${cZh} $${last}$ ${measure}是 $${sc}$ 的 $${last} \\div ${sc} = ${scale}$ 倍：`,
          ],
          [`${pa} \\times ${scale} = ${first}`],
        ],
      ],
      [
        `Then there are $${middle}$ ${b}: $${first} : ${middle} = ${p} : ${q}$ and $${middle} : ${last} = ${r} : ${s}$.`,
        `这时${bZh}有 $${middle}$ ${measure}：$${first} : ${middle} = ${p} : ${q}$，$${middle} : ${last} = ${r} : ${s}$。`,
      ],
      [
        [
          Q.of(last * p, s),
          `That joins $${p}$ and $${s}$ directly, before matching the ${b}.`,
          `这是没有统一${bZh}就直接连接 $${p}$ 和 $${s}$。`,
        ],
        [middle, `That is the number of ${b}, not ${a}.`, `这是${bZh}的数量，不是${aZh}的。`],
        [first + middle, `That adds the ${b} to the ${a}.`, `这是把${bZh}加到了${aZh}上。`],
        [first + scale, "That is one group too many.", "这多算了一组。"],
      ],
    );
  },
  tapeFigure(
    [
      { total: "8", pieces: [{ size: 8, text: "8" }] },
      { total: "12", pieces: [{ size: 12, text: "12", lit: true }] },
      { total: "15", pieces: [{ size: 15, text: "15" }] },
    ],
    [
      "With the middle amount made 12 in both ratios, 2 : 3 and 4 : 5 join as 8 : 12 : 15.",
      "让中间的量在两个比中都是 12，2 : 3 和 4 : 5 就连成 8 : 12 : 15。",
    ],
  ),
);

const ratioFromFraction = lesson(
  "the-ratio-of-parts-from-a-fraction-of-the-whole",
  ["The ratio of parts from a fraction of the whole", "由占整体的分数求两部分的比"],
  [
    [
      "A fraction of a group compares a part with the whole; a ratio of parts compares one part with the other. Split the whole into as many shares as the denominator. If $\\frac{2}{5}$ of a class are girls, girls take $2$ shares and boys the other $5 - 2 = 3$, so girls to boys is $\\frac{2}{3}$.",
      "占整体的分数是部分和整体比；两部分的比是一部分和另一部分比。把整体分成分母那么多份。如果全班的 $\\frac{2}{5}$ 是女生，女生占 $2$ 份，男生占其余的 $5 - 2 = 3$ 份，所以女生和男生的比是 $\\frac{2}{3}$。",
    ],
    [
      "In a class of $30$: $12$ girls and $18$ boys, and $\\frac{12}{18} = \\frac{2}{3}$.",
      "如果全班 $30$ 人：女生 $12$ 人，男生 $18$ 人，$\\frac{12}{18} = \\frac{2}{3}$。",
    ],
    [
      "The denominator is the whole, not the other part. $\\frac{2}{5}$ compares girls with the whole class, not with the boys.",
      "分母是整体，不是另一部分。$\\frac{2}{5}$ 是女生和全班比，不是和男生比。",
    ],
  ],
  (rng) => {
    const q = rng.pick([5, 7, 8, 9, 10, 11, 12, 13, 15, 16]);
    const p = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].filter((v) => v <= q - 2 && gcdPre(v, q) === 1));
    const rest = q - p;
    const reversed = rng.bool();
    const [item, one, other, itemZh, oneZh, otherZh] = rng.pick([
      ["students in a class", "girls", "boys", "班上的学生", "女生", "男生"],
      ["beads in a bag", "red beads", "blue beads", "袋子里的珠子", "红珠子", "蓝珠子"],
      ["trees in a park", "oaks", "maples", "公园里的树", "橡树", "枫树"],
      ["books on a shelf", "novels", "atlases", "书架上的书", "小说", "地图册"],
    ]) as [string, string, string, string, string, string];
    const [top, bottom] = reversed ? [rest, p] : [p, rest];
    const answer = Q.of(top, bottom);
    const size = q * rng.int(2, 4);
    return valued(
      [
        `Of the ${item}, $\\frac{${p}}{${q}}$ are ${one} and the rest are ${other}. Write the ratio of ${reversed ? `${other} to ${one}` : `${one} to ${other}`} as a fraction in simplest form.`,
        `${itemZh}中，$\\frac{${p}}{${q}}$ 是${oneZh}，其余是${otherZh}。把${reversed ? `${otherZh}和${oneZh}` : `${oneZh}和${otherZh}`}的比写成最简分数。`,
      ],
      answer,
      [
        [
          ["Count the shares", "数份数"],
          [`Split the whole into $${q}$ shares; ${one} take $${p}$:`, `把整体分成 $${q}$ 份，${oneZh}占 $${p}$ 份：`],
          [`${q} - ${p} = ${rest}`],
        ],
        [
          ["Compare the parts", "两部分相比"],
          [reversed ? `${other} to ${one}:` : `${one} to ${other}:`, reversed ? `${otherZh}比${oneZh}：` : `${oneZh}比${otherZh}：`],
          [`\\frac{${top}}{${bottom}} = ${answer.toLatex()}`],
        ],
      ],
      [
        `With $${size}$ in all there are $${(size * p) / q}$ ${one} and $${(size * rest) / q}$ ${other}, and the ratio is again $${answer.toLatex()}$.`,
        `如果总数是 $${size}$，${oneZh}有 $${(size * p) / q}$，${otherZh}有 $${(size * rest) / q}$，比仍是 $${answer.toLatex()}$。`,
      ],
      [
        [Q.of(p, q), `That is the ${one} out of the whole, not out of the ${other}.`, `这是${oneZh}占整体的分数，不是和${otherZh}的比。`],
        [Q.of(rest, q), `That is the ${other} out of the whole.`, `这是${otherZh}占整体的分数。`],
        [Q.of(bottom, top), "That is upside down: the order of the words sets the order.", "这颠倒了：比的顺序按题目里的先后。"],
        [reversed ? Q.of(q, p) : Q.of(q, rest), "That compares the whole with a part.", "这是整体和一部分的比。"],
      ],
      { form: "fraction" },
    );
  },
  equalTape(5, "1", "5", 2),
);
const rateUnits = lesson(
  "changing-the-units-of-a-rate",
  ["Changing the units of a rate", "换算比率的单位"],
  [
    [
      "A rate has a unit on top and a unit below, and each is changed on its own. A train at $90$ km per hour: $90$ km is $90{,}000$ m, and an hour is $60$ minutes, so it goes $90{,}000 \\div 60 = 1{,}500$ m per minute.",
      "比率上面有一个单位，下面有一个单位，要分别换算。火车每小时行 $90$ 千米：$90$ 千米是 $90000$ 米，$1$ 小时是 $60$ 分钟，所以每分钟行 $90000 \\div 60 = 1500$ 米。",
    ],
    ["$1{,}500 \\times 60 = 90{,}000$ m, which is $90$ km in an hour.", "$1500 \\times 60 = 90000$ 米，就是每小时 $90$ 千米。"],
    [
      "Change both units. Turning km into m but keeping hours gives $90{,}000$ m per hour, not per minute.",
      "两个单位都要换。只把千米换成米而不换小时，得到的是每小时 $90000$ 米，不是每分钟。",
    ],
  ],
  (rng) => {
    const [value, top, bottom, en, enTo, zh, zhTo, upEn, upZh, downEn, downZh] = rng.pick([
      [
        6 * rng.int(8, 50),
        1000,
        60,
        "A train travels at {v} kilometers per hour",
        "meters per minute",
        "一列火车的速度是每小时 {v} 千米",
        "每分钟多少米",
        "A kilometer is $1000$ meters:",
        "$1$ 千米是 $1000$ 米：",
        "An hour is $60$ minutes:",
        "$1$ 小时是 $60$ 分钟：",
      ],
      [
        5 * rng.int(2, 8),
        3600,
        1000,
        "A car travels at {v} meters per second",
        "kilometers per hour",
        "一辆汽车的速度是每秒 {v} 米",
        "每小时多少千米",
        "An hour is $3600$ seconds:",
        "$1$ 小时是 $3600$ 秒：",
        "A kilometer is $1000$ meters:",
        "$1$ 千米是 $1000$ 米：",
      ],
      [
        3 * rng.int(3, 30),
        100,
        60,
        "A worker earns {v} dollars per hour",
        "cents per minute",
        "一名工人每小时挣 {v} 美元",
        "每分钟多少美分",
        "A dollar is $100$ cents:",
        "$1$ 美元是 $100$ 美分：",
        "An hour is $60$ minutes:",
        "$1$ 小时是 $60$ 分钟：",
      ],
      [
        3 * rng.int(1, 20),
        1000,
        60,
        "A hose delivers {v} liters per minute",
        "milliliters per second",
        "一根水管每分钟出水 {v} 升",
        "每秒多少毫升",
        "A liter is $1000$ milliliters:",
        "$1$ 升是 $1000$ 毫升：",
        "A minute is $60$ seconds:",
        "$1$ 分钟是 $60$ 秒：",
      ],
      [
        50 * rng.int(1, 6),
        60,
        1000,
        "A runner covers {v} meters per minute",
        "kilometers per hour",
        "一名跑步者每分钟跑 {v} 米",
        "每小时多少千米",
        "An hour is $60$ minutes:",
        "$1$ 小时是 $60$ 分钟：",
        "A kilometer is $1000$ meters:",
        "$1$ 千米是 $1000$ 米：",
      ],
    ]) as [number, number, number, string, string, string, string, string, string, string, string];
    const answer = Q.of(value * top, bottom);
    return valued(
      [`${en.replace("{v}", `$${value}$`)}. What is this rate in ${enTo}?`, `${zh.replace("{v}", `$${value}$`)}。这个比率相当于${zhTo}？`],
      answer,
      [
        [["Multiply", "乘"], [upEn, upZh], [`${value} \\times ${top} = ${value * top}`]],
        [["Divide", "除"], [downEn, downZh], [`${value * top} \\div ${bottom} = ${answer.toLatex()}`]],
      ],
      [
        `Back again: $${answer.toLatex()} \\times ${bottom} \\div ${top} = ${value}$.`,
        `换回去：$${answer.toLatex()} \\times ${bottom} \\div ${top} = ${value}$。`,
      ],
      [
        [Q.of(value * top), "That changes only one unit; the other is left as it was.", "这只换了一个单位，另一个没换。"],
        [Q.of(value, bottom), "That only divides; the multiplying step is missing.", "这只做了除法，漏了乘的那一步。"],
        [Q.of(value * bottom, top), "That multiplies and divides the wrong way round.", "这把乘和除弄反了。"],
        [Q.of(value * top * bottom), "That multiplies by both numbers; one of them should divide.", "这是两个数都乘了，其中一个应该除。"],
      ],
    );
  },
  tableFigure(["1", "60"], [1500, 90000]),
);
const percentOfPercent = lesson(
  "a-percent-of-a-percent-of-a-group",
  ["A percent of a percent of a group", "一个群体的百分数的百分数"],
  [
    [
      "When a second percent is about part of a group, use it on that part, not on the whole group. Work in two steps. A school has $200$ students and $40\\%$ are in the band, so $80$ are in the band. If $25\\%$ of the band play brass, that is $25\\%$ of $80$, which is $20$.",
      "当第二个百分数说的是群体的一部分时，要把它用在这一部分上，而不是整个群体上。分两步做。一所学校有 $200$ 名学生，$40\\%$ 在乐队里，所以乐队有 $80$ 人。如果乐队中 $25\\%$ 演奏铜管乐器，就是 $80$ 的 $25\\%$，即 $20$ 人。",
    ],
    ["$40\\% \\times 25\\% = 10\\%$, and $10\\%$ of $200$ is $20$.", "$40\\% \\times 25\\% = 10\\%$，$200$ 的 $10\\%$ 是 $20$。"],
    [
      "Do not add the percents. $40\\% + 25\\% = 65\\%$ of the school would be $130$, far more than the band.",
      "不能把两个百分数相加。全校的 $40\\% + 25\\% = 65\\%$ 是 $130$ 人，比乐队人数还多。",
    ],
  ],
  (rng) => {
    const k = rng.int(1, 10);
    const j = rng.int(1, 5);
    const total = 200 * k;
    const p = 10 * j;
    const q = rng.pick([5, 10, 20, 25, 50]);
    const part = (total * p) / 100;
    const answer = (part * q) / 100;
    const [en, enFirst, enSecond, zh, zhFirst, zhSecond] = rng.pick(
      [
        ["A school has", "students", "are in the band", "play brass instruments", "一所学校有", "名学生", "在乐队里", "演奏铜管乐器"],
        ["A club has", "members", "joined the hiking group", "own a tent", "一个俱乐部有", "名成员", "参加了徒步小组", "有帐篷"],
        ["A town has", "households", "own a car", "own an electric car", "一个小镇有", "户家庭", "有汽车", "有电动汽车"],
      ].map(([a, b, c, d, e, f, g, h]) => [`${a} $${total}$ ${b}`, c, d, `${e} $${total}$ ${f}`, g, h]),
    ) as [string, string, string, string, string, string];
    return valued(
      [
        `${en}. Of these, $${p}\\%$ ${enFirst}, and $${q}\\%$ of that group ${enSecond}. How many are in this last group?`,
        `${zh}。其中 $${p}\\%$ ${zhFirst}，这部分中又有 $${q}\\%$ ${zhSecond}。最后这部分有多少？`,
      ],
      answer,
      [
        [
          ["Find the first group", "求第一部分"],
          [`$${p}\\%$ of the whole:`, `整体的 $${p}\\%$：`],
          [`${total} \\times ${dec(Q.of(p, 100))} = ${part}`],
        ],
        [
          ["Take the second percent", "再求第二个百分数"],
          [`$${q}\\%$ of that group:`, `这部分的 $${q}\\%$：`],
          [`${part} \\times ${dec(Q.of(q, 100))} = ${answer}`],
        ],
      ],
      [
        `In one step: $${p}\\% \\times ${q}\\% = ${dec(Q.of(p * q, 100))}\\%$, and $${dec(Q.of(p * q, 100))}\\%$ of $${total}$ is $${answer}$.`,
        `一步算：$${p}\\% \\times ${q}\\% = ${dec(Q.of(p * q, 100))}\\%$，$${total}$ 的 $${dec(Q.of(p * q, 100))}\\%$ 是 $${answer}$。`,
      ],
      [
        [(total * q) / 100, `That takes $${q}\\%$ of the whole, not of the smaller group.`, `这是整体的 $${q}\\%$，不是那部分的。`],
        [part, "That is only the first group.", "这只是第一部分。"],
        [(total * (p + q)) / 100, "That adds the two percents.", "这是把两个百分数相加了。"],
        [part - answer, "That is the rest of the first group.", "这是第一部分中剩下的。"],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "200",
        pieces: [
          { size: 80, text: "80", lit: true },
          { size: 120, text: "120" },
        ],
      },
      {
        total: "80",
        pieces: [
          { size: 20, text: "20", lit: true },
          { size: 60, text: "60" },
        ],
      },
    ],
    ["40% of 200 is 80, then 25% of those 80 is 20.", "200 的 40% 是 80，这 80 的 25% 是 20。"],
  ),
);

const scoreNeeded = lesson(
  "correct-answers-needed-for-a-target-percent",
  ["Correct answers needed for a target percent", "达到目标百分比需要答对的题数"],
  [
    [
      "A percent target for a whole test fixes how many answers must be right in all. Take the percent of all the questions, then subtract the ones already right. A test of $40$ questions with a target of $75\\%$ needs $30$ right; with $14$ right so far, $30 - 14 = 16$ more are needed.",
      "全卷的百分比目标决定了一共要答对多少题。用全部题数求百分数，再减去已经答对的。$40$ 道题、目标 $75\\%$，共需答对 $30$ 道；已经答对 $14$ 道，还需 $30 - 14 = 16$ 道。",
    ],
    ["$14 + 16 = 30$, and $\\frac{30}{40} = 75\\%$.", "$14 + 16 = 30$，$\\frac{30}{40} = 75\\%$。"],
    [
      "Take the percent of the whole test, not of the questions left. The answers already right count too.",
      "要用全卷题数求百分数，不是只用剩下的题数。已经答对的题也要算上。",
    ],
  ],
  (rng) => {
    const total = 20 * rng.int(2, 6);
    const target = rng.pick([60, 65, 70, 75, 80, 85, 90]);
    const needed = (total * target) / 100;
    const done = total / 2 + 10 * rng.int(-1, 1);
    const left = total - done;
    const low = Math.max(2, needed - left);
    const high = Math.min(done, needed - 1);
    const right = rng.int(low, high);
    const answer = needed - right;
    const name = rng.pick(["Mia", "Leo", "Ana", "Sam"]);
    const nameZh = { Mia: "米娅", Leo: "利奥", Ana: "安娜", Sam: "萨姆" }[name] as string;
    return valued(
      [
        `A test has $${total}$ questions. ${name} has finished the first $${done}$ and has $${right}$ of them right. ${name} wants at least $${target}\\%$ on the whole test. What is the fewest of the remaining questions that must be right?`,
        `一场考试有 $${total}$ 道题。${nameZh}做完了前 $${done}$ 道，答对了 $${right}$ 道。${nameZh}希望全卷至少得 $${target}\\%$。剩下的题中至少要答对多少道？`,
      ],
      answer,
      [
        [
          ["Find the total needed", "求一共要答对的题数"],
          [`$${target}\\%$ of all $${total}$ questions:`, `全部 $${total}$ 道题的 $${target}\\%$：`],
          [`${total} \\times ${dec(Q.of(target, 100))} = ${needed}`],
        ],
        [
          ["Subtract what is right", "减去已答对的"],
          [`${name} already has $${right}$:`, `${nameZh}已经答对 $${right}$ 道：`],
          [`${needed} - ${right} = ${answer}`],
        ],
      ],
      [
        `$${right} + ${answer} = ${needed}$, and $\\frac{${needed}}{${total}} = ${target}\\%$; one fewer would give $${needed - 1}$, below the target.`,
        `$${right} + ${answer} = ${needed}$，$\\frac{${needed}}{${total}} = ${target}\\%$；少答对一道只有 $${needed - 1}$ 道，达不到目标。`,
      ],
      [
        [needed, "That is the total needed; some are already right.", "这是一共要答对的题数，其中一些已经答对了。"],
        [Q.of(left * target, 100), `That takes $${target}\\%$ of the questions left only.`, `这只求了剩下题数的 $${target}\\%$。`],
        [done - right, "That is the number wrong so far.", "这是目前答错的题数。"],
        [left - answer, "That is how many of the rest may be wrong.", "这是剩下的题中最多可以答错的题数。"],
        [answer + 1, "That is one more than needed.", "这比需要的多了一道。"],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "40",
        pieces: [
          { size: 14, text: "14", lit: true },
          { size: 16, text: "16", lit: true, dashed: true },
          { size: 10, text: "10" },
        ],
      },
    ],
    ["75% of 40 is 30: 14 already right and 16 more.", "40 的 75% 是 30：已答对 14 道，还需 16 道。"],
  ),
);
const percentOrDollars = lesson(
  "percent-off-or-dollars-off",
  ["Percent off or dollars off", "打折还是减价"],
  [
    [
      "A percent coupon saves more on a dear item and less on a cheap one; a dollars-off coupon always saves the same. To compare them, turn the percent into dollars for this price, then subtract the two savings. On a $120$-dollar jacket, $20\\%$ off saves $24$ dollars and $15$ dollars off saves $15$, so the percent coupon saves $24 - 15 = 9$ dollars more.",
      "百分比优惠券在贵的商品上省得多，在便宜的商品上省得少；减固定金额的优惠券总是省一样多。要比较它们，先按这个价格把百分数换成美元，再把两种节省相减。一件 $120$ 美元的夹克，打 $20\\%$ 折扣省 $24$ 美元，减 $15$ 美元就省 $15$ 美元，所以百分比优惠券多省 $24 - 15 = 9$ 美元。",
    ],
    [
      "The prices to pay are $120 - 24 = 96$ and $120 - 15 = 105$, and $105 - 96 = 9$ as well.",
      "要付的钱分别是 $120 - 24 = 96$ 和 $120 - 15 = 105$，$105 - 96 = 9$，也相差 $9$。",
    ],
    [
      "The percent and the dollars are different units, so never subtract $20$ and $15$ straight away. Turn the percent into dollars first.",
      "百分数和美元单位不同，不能直接拿 $20$ 和 $15$ 相减。要先把百分数换成美元。",
    ],
  ],
  (rng) => {
    const price = 20 * rng.int(3, 20);
    const rate = rng.pick([10, 15, 20, 25, 30, 40]);
    const fromRate = (price * rate) / 100;
    const raw = 5 * rng.int(2, Math.min(12, price / 10));
    const fixed = raw === fromRate ? raw + 5 : raw;
    const answer = Math.abs(fromRate - fixed);
    const better = Math.max(fromRate, fixed);
    const percentWins = fromRate > fixed;
    return valued(
      [
        `A jacket costs $${price}$ dollars. One coupon takes $${rate}\\%$ off the price, and another takes $${fixed}$ dollars off. Only one coupon can be used. How many more dollars does the better coupon save than the other?`,
        `一件夹克售价 $${price}$ 美元。一张优惠券减价 $${rate}\\%$，另一张减 $${fixed}$ 美元。只能用一张。较好的优惠券比另一张多省多少美元？`,
      ],
      answer,
      [
        [
          ["Turn the percent into dollars", "把百分数换成美元"],
          [`The percent coupon saves $${rate}\\%$ of $${price}$:`, `百分比优惠券省下 $${price}$ 的 $${rate}\\%$：`],
          [`${price} \\times ${dec(Q.of(rate, 100))} = ${fromRate}`],
        ],
        [
          ["Compare the savings", "比较两种节省"],
          [
            `The ${percentWins ? "percent" : "dollars-off"} coupon saves more. Subtract the smaller saving from the larger:`,
            `${percentWins ? "百分比" : "减固定金额的"}优惠券省得多。用大的节省减去小的：`,
          ],
          [`${better} - ${Math.min(fromRate, fixed)} = ${answer}`],
        ],
      ],
      [
        `The prices to pay are $${price - fromRate}$ and $${price - fixed}$ dollars, and they differ by $${answer}$ too.`,
        `要付的钱分别是 $${price - fromRate}$ 美元和 $${price - fixed}$ 美元，同样相差 $${answer}$。`,
      ],
      [
        [better, "That is what the better coupon saves, not how much more it saves.", "这是较好的优惠券省下的钱，不是多省的钱。"],
        [price - better, "That is the price after the better coupon.", "这是用较好的优惠券之后的价格。"],
        [fromRate + fixed, "That adds the two savings, but only one coupon can be used.", "这把两种节省加起来了，但只能用一张优惠券。"],
        [
          Math.abs(rate - fixed),
          "That subtracts a percent and dollars as if they were the same unit.",
          "这把百分数和美元当成同一单位直接相减了。",
        ],
        [Math.min(fromRate, fixed), "That is what the worse coupon saves.", "这是较差的优惠券省下的钱。"],
        [price - Math.min(fromRate, fixed), "That is the price after the worse coupon.", "这是用较差的优惠券之后的价格。"],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "24",
        pieces: [
          { size: 15, text: "15" },
          { size: 9, text: "9", lit: true },
        ],
      },
    ],
    ["20% of 120 is 24 dollars, which is 9 more than 15 dollars.", "120 的 20% 是 24 美元，比 15 美元多 9 美元。"],
  ),
);

const shrinkflation = lesson(
  "percent-change-in-a-unit-price",
  ["Percent change in a unit price", "单价的百分比变化"],
  [
    [
      "When a package shrinks but its price stays the same, each gram costs more. The unit price grows by the factor old amount $\\div$ new amount, and the rise is measured from the old unit price. A bag going from $500$ g to $400$ g at the same price: $500 \\div 400 = 1.25$, so the price per gram rises by $25\\%$.",
      "包装变小而价格不变时，每克就更贵了。单价变成原来的（旧的量 $\\div$ 新的量）倍，上升的百分比以旧单价为基准。一袋从 $500$ 克变成 $400$ 克、价格不变：$500 \\div 400 = 1.25$，所以每克的价格上升了 $25\\%$。",
    ],
    [
      "With a price of $5$ dollars: $5 \\div 500 = 0.01$ and $5 \\div 400 = 0.0125$ dollars per gram, and $0.0125 \\div 0.01 = 1.25$.",
      "设价格是 $5$ 美元：每克 $5 \\div 500 = 0.01$ 美元和 $5 \\div 400 = 0.0125$ 美元，$0.0125 \\div 0.01 = 1.25$。",
    ],
    [
      "The bag got $20\\%$ smaller, but the unit price rose by $25\\%$. The two percents are not the same, because they are measured from different amounts.",
      "袋子小了 $20\\%$，单价却上升了 $25\\%$。两个百分数不一样，因为它们的基准不同。",
    ],
  ],
  (rng) => {
    const [a, b] = rng.pick([
      [5, 4],
      [4, 1],
      [5, 2],
      [8, 5],
    ]) as [number, number];
    const size = rng.pick([20, 30, 40, 50, 60, 100]);
    const price = rng.int(2, 9);
    const [item, unit, single, itemZh, unitZh] = rng.pick([
      ["bag of nuts", "grams", "gram", "一袋坚果", "克"],
      ["bottle of juice", "milliliters", "milliliter", "一瓶果汁", "毫升"],
      ["box of cereal", "grams", "gram", "一盒麦片", "克"],
    ]) as [string, string, string, string, string];
    const answer = Q.of(100 * (a - b), b);
    const factor = dec(Q.of(a, b));
    return valued(
      [
        `A ${item} shrinks from $${a * size}$ ${unit} to $${b * size}$ ${unit}, and its price stays at $${price}$ dollars. By what percent does the price per ${single} rise?`,
        `${itemZh}从 $${a * size}$ ${unitZh}减少到 $${b * size}$ ${unitZh}，价格仍是 $${price}$ 美元。每${unitZh}的价格上升了百分之几？`,
      ],
      answer,
      [
        [
          ["Find the factor", "求倍数"],
          [
            "The same money buys less, so the unit price grows by the old amount over the new amount:",
            "同样的钱买到的更少，所以单价变成原来的（旧的量 ÷ 新的量）倍：",
          ],
          [`${a * size} \\div ${b * size} = ${factor}`],
        ],
        [
          ["Turn the factor into a percent", "把倍数换成百分比"],
          [`A factor of $${factor}$ means the old unit price plus:`, `变成 $${factor}$ 倍，就是比旧单价多了：`],
          [`${factor} - 1 = ${dec(Q.of(a - b, b))} = ${dec(answer)}\\%`],
        ],
      ],
      [
        `Buying $${a * size}$ ${unit} in the new packages takes $${factor}$ packages, which cost $${price} \\times ${factor} = ${dec(Q.of(price * a, b))}$ dollars instead of $${price}$: a rise of $${dec(answer)}\\%$.`,
        `用新包装买 $${a * size}$ ${unitZh}要 $${factor}$ 包，花 $${price} \\times ${factor} = ${dec(Q.of(price * a, b))}$ 美元，而不是 $${price}$ 美元：上升了 $${dec(answer)}\\%$。`,
      ],
      [
        [Q.of(100 * (a - b), a), "That is how much smaller the package got, measured from the old size.", "这是包装按旧的量缩小的百分比。"],
        [
          Q.of(100 * a, b),
          "That is the new unit price as a percent of the old one; take away the first 100%.",
          "这是新单价占旧单价的百分比，还要减去原来的 100%。",
        ],
        [Q.of(100 * b, a), "That is the new size as a percent of the old size.", "这是新的量占旧的量的百分比。"],
        [Q.of((a - b) * size), "That is how many units the package lost, not a percent.", "这是包装少了多少单位，不是百分比。"],
      ],
      { form: "decimal", percent: true },
    );
  },
  tapeFigure(
    [
      {
        total: "500",
        pieces: [
          { size: 400, text: "400", lit: true },
          { size: 100, text: "100", dashed: true },
        ],
      },
    ],
    ["500 g shrinks to 400 g; 500 divided by 400 is 1.25.", "500 克缩小到 400 克；500 除以 400 等于 1.25。"],
  ),
);

const raiseFromNew = lesson(
  "the-amount-of-an-increase-from-the-new-value",
  ["The amount of an increase from the new value", "由新值求增加的量"],
  [
    [
      "If you only know the value after an increase, work backwards first. Divide by the multiplier to get the original value, then subtract. A wage that rose $25\\%$ to $1500$ dollars was $1500 \\div 1.25 = 1200$ dollars, so it went up by $1500 - 1200 = 300$ dollars.",
      "如果只知道增加之后的值，要先倒着算。除以乘数得到原值，再相减。月薪上涨 $25\\%$ 后是 $1500$ 美元，原来是 $1500 \\div 1.25 = 1200$ 美元，所以涨了 $1500 - 1200 = 300$ 美元。",
    ],
    ["$25\\%$ of $1200$ is $300$, and $1200 + 300 = 1500$.", "$1200$ 的 $25\\%$ 是 $300$，$1200 + 300 = 1500$。"],
    [
      "Do not take the percent of the new value. The new value already holds the increase, so $25\\%$ of $1500$ is too big.",
      "不能对新值求百分数。新值已经包含了增加的部分，所以 $1500$ 的 $25\\%$ 偏大。",
    ],
  ],
  (rng) => {
    const rate = rng.pick([5, 10, 20, 25, 50]);
    const original = 200 * rng.int(1, 15);
    const increase = (original * rate) / 100;
    const final = original + increase;
    const naive = Q.of(final * rate, 100);
    const multiplier = dec(Q.of(100 + rate, 100));
    const [en, zh] = rng.pick([
      [`After a raise of $${rate}\\%$, a monthly wage is $${final}$ dollars.`, `加薪 $${rate}\\%$ 后，月薪是 $${final}$ 美元。`],
      [`After a rise of $${rate}\\%$, a monthly rent is $${final}$ dollars.`, `上涨 $${rate}\\%$ 后，月租是 $${final}$ 美元。`],
      [
        `After a price increase of $${rate}\\%$, a bicycle costs $${final}$ dollars.`,
        `涨价 $${rate}\\%$ 后，一辆自行车售价 $${final}$ 美元。`,
      ],
    ]) as [string, string];
    return valued(
      [`${en} By how many dollars did it go up?`, `${zh}上涨了多少美元？`],
      increase,
      [
        [
          ["Find the original value", "求原值"],
          [
            `A rise of $${rate}\\%$ multiplies by $${multiplier}$, so divide to undo it:`,
            `上涨 $${rate}\\%$ 就是乘 $${multiplier}$，所以用除法倒回去：`,
          ],
          [`${final} \\div ${multiplier} = ${original}`],
        ],
        [
          ["Subtract", "相减"],
          ["The increase is the new value minus the original:", "增加的量是新值减去原值："],
          [`${final} - ${original} = ${increase}`],
        ],
      ],
      [
        `$${rate}\\%$ of $${original}$ is $${increase}$, and $${original} + ${increase} = ${final}$.`,
        `$${original}$ 的 $${rate}\\%$ 是 $${increase}$，$${original} + ${increase} = ${final}$。`,
      ],
      [
        [
          naive,
          "That takes the percent of the new value, which already holds the increase.",
          "这是对新值求百分数，而新值已经包含了增加的部分。",
        ],
        [original, "That is the value before the increase, not the increase.", "这是增加之前的值，不是增加的量。"],
        [
          Q.of(final).sub(naive),
          "That takes the percent off the new value instead of dividing by the multiplier.",
          "这是从新值中减去百分数，而不是除以乘数。",
        ],
        [rate, "That is the percent, not the number of dollars.", "这是百分数，不是美元数。"],
      ],
      { form: "decimal" },
    );
  },
  tapeFigure(
    [
      {
        total: "1500",
        pieces: [
          { size: 1200, text: "1200" },
          { size: 300, text: "300", lit: true },
        ],
      },
    ],
    ["1500 is 1200 plus a 25% increase of 300.", "1500 是 1200 加上 25% 的增加量 300。"],
  ),
);
/** signedLine draws a number line of integers from lo to hi with the marked points labeled, and jumps as arcs. */
const signedLine = (lo: number, hi: number, marks: readonly number[], jumps: readonly (readonly [number, number])[] = []): Figure =>
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
      `A number line from ${lo} to ${hi} with ${marks.join(" and ")} marked.`,
      `一条从 ${lo} 到 ${hi} 的数轴，标出了 ${marks.join(" 和 ")}。`,
    ],
  );

const missingSubtrahend = lesson(
  "the-number-subtracted-from-a-negative-number",
  ["The number subtracted from a negative number", "从负数中减去的数"],
  [
    [
      "Subtracting a positive number moves left, so the number subtracted is how far you moved. When the start and the result are both below zero, that distance is the difference of their sizes. In $-4 - \\square = -11$, the move is $11 - 4 = 7$.",
      "减去一个正数就是向左移动，所以减去的数就是移动的距离。起点和结果都在零下面时，这个距离是它们大小之差。$-4 - \\square = -11$ 中，移动了 $11 - 4 = 7$。",
    ],
    ["$-4 - 7 = -11$.", "$-4 - 7 = -11$。"],
    [
      "Both numbers are on the same side of zero, so do not add the sizes. The answer is $7$, not $15$.",
      "两个数在零的同一侧，所以不能把大小相加。答案是 $7$，不是 $15$。",
    ],
  ],
  (rng) => {
    const start = rng.int(2, 25);
    const answer = rng.int(2, 25);
    const end = start + answer;
    const inContext = rng.bool();
    return valued(
      inContext
        ? [
            `The temperature was $-${start}^{\\circ}\\text{C}$ and it fell to $-${end}^{\\circ}\\text{C}$. How many degrees did it fall?`,
            `气温原来是 $-${start}^{\\circ}\\text{C}$，后来降到 $-${end}^{\\circ}\\text{C}$。气温下降了多少度？`,
          ]
        : [
            `What positive number goes in the box? $$-${start} - \\square = -${end}$$`,
            `方框里应填哪个正数？$$-${start} - \\square = -${end}$$`,
          ],
      answer,
      [
        [
          ["Compare the sizes", "比较大小"],
          [
            `Both numbers are below zero, $${start}$ and $${end}$ units away from it, and the result is further down.`,
            `两个数都在零下面，离零分别是 $${start}$ 和 $${end}$ 个单位，结果更靠下。`,
          ],
        ],
        [
          ["Find the distance", "求距离"],
          ["The move is the difference of the sizes:", "移动的距离是大小之差："],
          [`${end} - ${start} = ${answer}`],
        ],
      ],
      [`Put it back in: $-${start} - ${answer} = -${end}$.`, `代回去：$-${start} - ${answer} = -${end}$。`],
      [
        [start + end, "That adds the sizes, but both numbers are on the same side of zero.", "这把大小相加了，但两个数在零的同一侧。"],
        [-answer, "The question asks for a positive number: how far it moved.", "题目要的是正数，也就是移动了多远。"],
        [end, "That is how far the result is from zero, not from the start.", "这是结果离零的距离，不是离起点的距离。"],
        [start, "That is how far the start is from zero.", "这是起点离零的距离。"],
      ],
    );
  },
  drawn(gradeDrawings4["subtracting-a-positive-number-from-a-negative-number#the-number-subtracted-from-a-negative-number"]),
);

const untilBelowZero = lesson(
  "how-many-additions-until-below-zero",
  ["How many additions until below zero", "加多少次后低于零"],
  [
    [
      "Adding the same negative number again and again lowers the total in equal steps. Divide the start by the size of a step to see how many full steps fit; zero is not below zero, so one more step is needed. From $10$, adding $-3$: three steps reach $1$, and the fourth reaches $-2$.",
      "反复加同一个负数，总数按相同的步长下降。用起始值除以每步的大小，看能走几个完整的步；零还不算低于零，所以还要再走一步。从 $10$ 开始加 $-3$：三步到 $1$，第四步到 $-2$。",
    ],
    [
      "$10 + 4 \\cdot (-3) = -2$, and $10 + 3 \\cdot (-3) = 1$ is still positive.",
      "$10 + 4 \\cdot (-3) = -2$，而 $10 + 3 \\cdot (-3) = 1$ 仍是正数。",
    ],
    [
      "Landing exactly on $0$ is not below zero. If the steps divide the start exactly, you still need one more.",
      "正好到 $0$ 不算低于零。如果步长正好整除起始值，也还要再走一步。",
    ],
  ],
  (rng) => {
    const step = rng.int(3, 15);
    const full = rng.int(3, 14);
    const left = rng.int(0, step - 1);
    const start = step * full + left;
    const answer = full + 1;
    const after = start - step * answer;
    const inContext = rng.bool();
    return valued(
      inContext
        ? [
            `A player starts a game with $${start}$ points, and each wrong move adds $-${step}$ to the score. After how many wrong moves is the score first below zero?`,
            `一名玩家开始时有 $${start}$ 分，每次走错都在分数上加 $-${step}$。走错多少次后，分数第一次低于零？`,
          ]
        : [
            `Start at $${start}$ and keep adding $-${step}$. After how many additions is the total first negative?`,
            `从 $${start}$ 开始，不断加 $-${step}$。加多少次后，总数第一次变成负数？`,
          ],
      answer,
      [
        [
          ["Count the full steps", "数完整的步"],
          [`$${step}$ fits into $${start}$ this many times:`, `$${start}$ 里能装下几个 $${step}$：`],
          [`${start} = ${step} \\times ${full} + ${left}`],
        ],
        [
          ["Take one more step", "再走一步"],
          [
            `After $${full}$ steps the total is $${left}$, which is not below zero. One more step:`,
            `走 $${full}$ 步后总数是 $${left}$，还没有低于零。再走一步：`,
          ],
          [`${left} + (-${step}) = ${after}`],
        ],
      ],
      [
        `$${start} + ${answer} \\cdot (-${step}) = ${after}$ is negative, but $${start} + ${full} \\cdot (-${step}) = ${left}$ is not.`,
        `$${start} + ${answer} \\cdot (-${step}) = ${after}$ 是负数，而 $${start} + ${full} \\cdot (-${step}) = ${left}$ 不是。`,
      ],
      [
        [full, "After that many the total is not yet below zero.", "加这么多次后，总数还没有低于零。"],
        [
          full + 2,
          "That is one more than needed; the total is already negative one step earlier.",
          "这多了一次；早一步总数就已经是负数了。",
        ],
        [full - 1, "That stops two steps short.", "这少了两步。"],
        [start - step, "That is the total after one step, not a count of steps.", "这是加一次后的总数，不是次数。"],
      ],
    );
  },
  signedLine(
    -3,
    11,
    [10, 1, -2],
    [
      [10, 7],
      [7, 4],
      [4, 1],
      [1, -2],
    ],
  ),
);

const startFromChanges = lesson(
  "the-start-from-a-sequence-of-changes",
  ["The start from a sequence of changes", "由一连串变化求起始值"],
  [
    [
      "To find where a run of changes began, undo them from the end: undo a rise by subtracting and a fall by adding. If it rose $3.5$ degrees, fell $6$ degrees and ended at $-1$, the start was $-1 + 6 - 3.5 = 1.5$ degrees.",
      "要找一连串变化的起点，就从最后往前撤销：上升用减法撤销，下降用加法撤销。如果气温先升 $3.5$ 度，再降 $6$ 度，最后是 $-1$ 度，那么开始时是 $-1 + 6 - 3.5 = 1.5$ 度。",
    ],
    ["Run it forward: $1.5 + 3.5 - 6 = -1$.", "正着走一遍：$1.5 + 3.5 - 6 = -1$。"],
    [
      "Reverse every change. Using the changes as they are stated takes you further along, not back to the start.",
      "每个变化都要反过来。照原样用这些变化，只会往后走，而不是回到起点。",
    ],
  ],
  (rng) => {
    const up = Q.of(rng.int(11, 90), 10);
    const drawnDown = Q.of(rng.int(11, 90), 10);
    const down = drawnDown.eq(up) ? up.add(Q.of(1, 10)) : drawnDown;
    const startTenths = rng.pick([rng.int(-60, -1), rng.int(1, 60)]);
    const start = Q.of(startTenths, 10);
    const raw = start.add(up).sub(down);
    const end = raw.isInteger() && raw.sign() === 0 ? up : raw;
    const answer = end.sub(up).add(down);
    const mid = end.add(down);
    const sum = (x: Q, y: Q) => (y.sign() < 0 ? `${dec(x)} - ${dec(y.neg())}` : `${dec(x)} + ${dec(y)}`);
    return valued(
      [
        `During a day the temperature rose $${dec(up)}$ degrees and later fell $${dec(down)}$ degrees. It finished at $${dec(end)}^{\\circ}\\text{C}$. What was the temperature at the start, in degrees Celsius?`,
        `一天中气温先上升 $${dec(up)}$ 度，后来又下降 $${dec(down)}$ 度，最后是 $${dec(end)}^{\\circ}\\text{C}$。开始时的气温是多少摄氏度？`,
      ],
      answer,
      [
        [
          ["Undo the fall", "撤销下降"],
          ["The last change was a fall, so add it back:", "最后一个变化是下降，所以把它加回来："],
          [`${dec(end)} + ${dec(down)} = ${dec(mid)}`],
        ],
        [
          ["Undo the rise", "撤销上升"],
          ["Before that it rose, so take the rise away:", "在那之前上升了，所以把上升的减掉："],
          [`${dec(mid)} - ${dec(up)} = ${dec(answer)}`],
        ],
      ],
      [
        `Run it forward: $${sum(answer, up)} = ${dec(answer.add(up))}$, then $${dec(answer.add(up))} - ${dec(down)} = ${dec(end)}$.`,
        `正着走一遍：$${sum(answer, up)} = ${dec(answer.add(up))}$，再 $${dec(answer.add(up))} - ${dec(down)} = ${dec(end)}$。`,
      ],
      [
        [
          end.add(up).sub(down),
          "That uses the changes as stated, which goes further along instead of back.",
          "这是照原样用了这些变化，是往后走而不是倒回去。",
        ],
        [end.sub(up).sub(down), "That takes away the fall too; a fall is undone by adding.", "这把下降也减掉了；撤销下降要用加法。"],
        [end.add(up).add(down), "That adds back the rise too; a rise is undone by subtracting.", "这把上升也加上了；撤销上升要用减法。"],
        [end, "That is where it finished, not where it started.", "这是最后的气温，不是开始时的。"],
        [answer.neg(), "That has the wrong sign.", "符号错了。"],
      ],
      { form: "decimal" },
    );
  },
  tapeFigure(
    [
      {
        total: "6",
        pieces: [
          { size: 3.5, text: "3.5", lit: true },
          { size: 2.5, text: "2.5", dashed: true },
        ],
      },
    ],
    [
      "A fall of 6 is a rise of 3.5 plus 2.5 more, so the start was 2.5 above the end.",
      "下降的 6 是上升的 3.5 再加 2.5，所以开始时比最后高 2.5。",
    ],
  ),
);

const largestProduct = lesson(
  "the-largest-product-of-two-from-a-list",
  ["The largest product of two from a list", "从一列数中取两个数的最大积"],
  [
    [
      "Two negative numbers multiply to a positive, so the largest product need not use the largest numbers. Check two pairs: the two biggest positive numbers, and the two negative numbers furthest below zero. From $-7, -6, 2, 5$: $5 \\cdot 2 = 10$ but $(-7)(-6) = 42$, so the largest is $42$.",
      "两个负数相乘得正数，所以最大的积不一定用到最大的数。要比较两对：最大的两个正数，以及离零最远的两个负数。从 $-7, -6, 2, 5$ 中：$5 \\cdot 2 = 10$，而 $(-7)(-6) = 42$，所以最大是 $42$。",
    ],
    [
      "A mixed pair such as $5 \\cdot (-7) = -35$ is negative, so it can never win.",
      "一正一负的一对，比如 $5 \\cdot (-7) = -35$，是负数，不可能最大。",
    ],
    [
      "Do not just take the two biggest numbers. The two most negative numbers may give a larger product.",
      "不能只取最大的两个数。最负的两个数可能乘出更大的积。",
    ],
  ],
  (rng) => {
    const a = rng.int(5, 15);
    const b = a + rng.int(1, 5);
    const posHigh = rng.int(3, 12);
    const posMid = posHigh - rng.int(1, 2);
    const posLow = rng.int(1, posMid);
    const values = rng.shuffle([-a, -b, posHigh, posMid, posLow === posMid ? posMid - 1 : posLow]);
    const negatives = a * b;
    const positives = posHigh * posMid;
    const answer = Math.max(negatives, positives);
    return valued(
      [
        `Two different numbers are chosen from the list ${values.map((v) => `$${v}$`).join(", ")} and multiplied. What is the largest possible product?`,
        `从 ${values.map((v) => `$${v}$`).join("、")} 中选两个不同的数相乘。积最大是多少？`,
      ],
      answer,
      [
        [
          ["Try the two biggest positives", "试最大的两个正数"],
          ["Their product is:", "它们的积是："],
          [`${posHigh} \\times ${posMid} = ${positives}`],
        ],
        [
          ["Try the two negatives", "试两个负数"],
          [`Two negatives give a positive product. Then take the larger:`, `两个负数的积是正数。再取较大的：`],
          [`(-${a}) \\times (-${b}) = ${negatives}`],
        ],
      ],
      [
        `Any mixed pair is negative, for example $${posHigh} \\times (-${b}) = ${-posHigh * b}$, so $${answer}$ is the largest.`,
        `一正一负的积都是负数，比如 $${posHigh} \\times (-${b}) = ${-posHigh * b}$，所以最大是 $${answer}$。`,
      ],
      [
        [positives, "That uses only the positive numbers; the two negatives give more.", "这只用了正数；两个负数的积更大。"],
        [negatives, "That uses only the negative numbers; the two positives give more.", "这只用了负数；两个正数的积更大。"],
        [-b * posHigh, "That pairs a positive with a negative, which gives a negative product.", "这把一正一负相乘，积是负数。"],
        [-negatives, "That has the wrong sign: two negatives multiply to a positive.", "符号错了：两个负数相乘得正数。"],
        [b * b, "That uses the same number twice; the two numbers must be different.", "这把同一个数用了两次；两个数必须不同。"],
      ],
    );
  },
  tableFigure(["5·2", "(−7)(−6)", "5·(−7)"], [10, 42, -35]),
);

const changePerHour = lesson(
  "a-steady-change-per-hour",
  ["A steady change per hour", "每小时的稳定变化"],
  [
    [
      "A steady change is the same every hour, so share the total change equally. The total change is the last value minus the first, and its sign says up or down. From $5$ degrees to $-3$ degrees in $4$ hours: $-3 - 5 = -8$, and $-8 \\div 4 = -2$ degrees per hour.",
      "稳定变化指每小时变化相同，所以把总变化平均分。总变化是最后的值减去最初的值，它的符号说明是升还是降。$4$ 小时内从 $5$ 度变到 $-3$ 度：$-3 - 5 = -8$，$-8 \\div 4 = -2$ 度每小时。",
    ],
    ["$5 + 4 \\cdot (-2) = -3$.", "$5 + 4 \\cdot (-2) = -3$。"],
    [
      "Subtract last minus first, in that order. First minus last gives the right size but the wrong sign.",
      "要用最后的值减去最初的值，顺序不能反。反过来减，大小对但符号错。",
    ],
  ],
  (rng) => {
    const hours = rng.int(2, 8);
    const rate = rng.int(2, 5);
    const drawnStart = rng.pick([rng.int(-5, -1), rng.int(1, 25)]);
    const start = drawnStart === hours * rate ? drawnStart + 1 : drawnStart;
    const end = start - hours * rate;
    const falling = rng.bool();
    const first = falling ? start : end;
    const last = falling ? end : start;
    const answer = falling ? -rate : rate;
    const total = last - first;
    return valued(
      [
        `Over $${hours}$ hours the temperature changed steadily from $${first}^{\\circ}\\text{C}$ to $${last}^{\\circ}\\text{C}$. What was the change per hour, in degrees? Use a negative number for a fall.`,
        `在 $${hours}$ 小时内，气温从 $${first}^{\\circ}\\text{C}$ 稳定地变化到 $${last}^{\\circ}\\text{C}$。每小时变化多少度？下降用负数表示。`,
      ],
      answer,
      [
        [
          ["Find the total change", "求总变化"],
          ["Last value minus first value:", "最后的值减去最初的值："],
          [`${differenceLatex(last, first)} = ${total}`],
        ],
        [
          ["Share it out", "平均分"],
          [`Divide by the $${hours}$ hours:`, `除以 $${hours}$ 小时：`],
          [`${total} \\div ${hours} = ${answer}`],
        ],
      ],
      [
        `Start at $${first}$ and change by $${answer}$ each hour for $${hours}$ hours: $${first} + ${hours} \\cdot (${answer}) = ${last}$.`,
        `从 $${first}$ 开始，每小时变化 $${answer}$，共 $${hours}$ 小时：$${first} + ${hours} \\cdot (${answer}) = ${last}$。`,
      ],
      [
        [
          -answer,
          falling ? "The temperature fell, so the change is negative." : "The temperature rose, so the change is positive.",
          falling ? "气温下降了，所以变化是负数。" : "气温上升了，所以变化是正数。",
        ],
        [total, "That is the total change, not the change per hour.", "这是总变化，不是每小时的变化。"],
        [Q.of(first + last, hours), "That adds the two temperatures instead of subtracting.", "这把两个温度相加了，而不是相减。"],
        [Q.of(last, hours), "That divides the last temperature, not the change.", "这是拿最后的温度去除，不是拿变化去除。"],
      ],
    );
  },
  signedLine(
    -4,
    6,
    [5, -3],
    [
      [5, 3],
      [3, 1],
      [1, -1],
      [-1, -3],
    ],
  ),
);

const undefinedFraction = lesson(
  "the-value-that-makes-a-fraction-undefined",
  ["The value where a fraction is not defined", "使分数没有意义的值"],
  [
    [
      "You cannot divide by zero, so a fraction with $x$ in it is not defined where its bottom equals zero. Only the bottom matters: a zero on top just makes the fraction $0$. For $\\frac{x + 1}{2x - 6}$, solve $2x - 6 = 0$ to get $x = 3$.",
      "不能除以零，所以含 $x$ 的分数在分母等于零的地方没有意义。只看分母：分子为零只会让分数等于 $0$。对 $\\frac{x + 1}{2x - 6}$，解 $2x - 6 = 0$，得 $x = 3$。",
    ],
    ["$2 \\cdot 3 - 6 = 0$.", "$2 \\cdot 3 - 6 = 0$。"],
    [
      "Do not set the top equal to zero. $x = -1$ makes $\\frac{x + 1}{2x - 6}$ equal to $0$, which is a fine value.",
      "不要让分子等于零。$x = -1$ 使 $\\frac{x + 1}{2x - 6}$ 等于 $0$，这是正常的值。",
    ],
  ],
  (rng) => {
    const k = rng.int(2, 9);
    const value = rng.pick([rng.int(-9, -2), rng.int(2, 9)]);
    const top = rng.int(2, 15);
    const topPlus = rng.bool();
    const topZero = topPlus ? -top : top;
    const constant = k * value;
    const bottom = constant > 0 ? `${k}x - ${constant}` : `${k}x + ${-constant}`;
    const numerator = topPlus ? `x + ${top}` : `x - ${top}`;
    return valued(
      [
        `For what value of $x$ is $\\frac{${numerator}}{${bottom}}$ not defined?`,
        `当 $x$ 取何值时，$\\frac{${numerator}}{${bottom}}$ 没有意义？`,
      ],
      value,
      [
        [
          ["Set the bottom to zero", "令分母为零"],
          ["A fraction is not defined when its bottom is zero:", "分母为零时分数没有意义："],
          [`${bottom} = 0`],
        ],
        [
          ["Solve", "求解"],
          ["Move the number across, then divide:", "把常数移过去，再相除："],
          [`${k}x = ${constant}`, `x = ${constant} \\div ${k} = ${value}`],
        ],
      ],
      [
        `Put it into the bottom: $${k} \\cdot ${paren(value)} ${constant > 0 ? `- ${constant}` : `+ ${-constant}`} = ${constant} ${constant > 0 ? `- ${constant}` : `+ ${-constant}`} = 0$.`,
        `代入分母：$${k} \\cdot ${paren(value)} ${constant > 0 ? `- ${constant}` : `+ ${-constant}`} = ${constant} ${constant > 0 ? `- ${constant}` : `+ ${-constant}`} = 0$。`,
      ],
      [
        [-value, "That has the wrong sign: moving the number across changes its sign.", "符号错了：把常数移过去要变号。"],
        [topZero, "That makes the top zero, so the fraction is $0$, which is defined.", "这使分子为零，分数等于 $0$，是有意义的。"],
        [0, "At $x = 0$ the bottom is not zero.", "$x = 0$ 时分母不为零。"],
        [constant, "That forgets to divide by the number in front of $x$.", "这忘了除以 $x$ 前面的系数。"],
        [-constant, "That forgets to divide, and has the wrong sign.", "这忘了相除，符号也错了。"],
      ],
      { solveFor: "x" },
    );
  },
  tableFigure(["x", "2x−6"], [3, 0]),
);
const cancellingCoefficient = lesson(
  "the-coefficient-that-removes-a-term",
  ["The coefficient that removes a term", "消去一项的系数"],
  [
    [
      "Combining like terms adds their coefficients, and a term disappears when its coefficient becomes $0$. So first combine the known coefficients, then choose $k$ as the opposite of their total. In $5x + 2 - 3x + kx$, the known part is $2x$, so $k = -2$.",
      "合并同类项就是把系数相加，系数变成 $0$ 时这一项就消失了。所以先合并已知的系数，再取 $k$ 为它们总和的相反数。$5x + 2 - 3x + kx$ 中，已知部分是 $2x$，所以 $k = -2$。",
    ],
    ["$5 - 3 + (-2) = 0$, so the $x$ terms cancel and only $2$ is left.", "$5 - 3 + (-2) = 0$，所以 $x$ 项抵消，只剩下 $2$。"],
    [
      "The constants play no part: they are not like terms with $x$, and they stay whatever $k$ is.",
      "常数项与此无关：它们和 $x$ 项不是同类项，不管 $k$ 是多少都留着。",
    ],
  ],
  (rng) => {
    const a = rng.int(2, 12);
    const d = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((v) => v !== a));
    const e = rng.int(2, 20);
    const f = rng.int(2, 20);
    const v = rng.pick(["x", "n", "y", "m"]);
    const answer = d - a;
    const known = a - d === 1 ? v : a - d === -1 ? `-${v}` : `${a - d}${v}`;
    return valued(
      [
        `For what value of $k$ does the expression $${a}${v} + ${e} - ${d}${v} + k${v} - ${f}$ have no $${v}$ term after simplifying?`,
        `当 $k$ 取何值时，式子 $${a}${v} + ${e} - ${d}${v} + k${v} - ${f}$ 化简后没有 $${v}$ 项？`,
      ],
      answer,
      [
        [
          ["Combine the known terms", "合并已知的项"],
          [`Add the coefficients of the known $${v}$ terms:`, `把已知 $${v}$ 项的系数相加：`],
          [`${a}${v} - ${d}${v} = ${known}`],
        ],
        [
          ["Cancel it", "抵消它"],
          [
            `For the $${v}$ term to vanish, $k$ must be the opposite of $${a - d}$:`,
            `要让 $${v}$ 项消失，$k$ 必须是 $${a - d}$ 的相反数：`,
          ],
          [`${a - d} + k = 0`, `k = ${answer}`],
        ],
      ],
      [
        `$${a} - ${d} ${answer < 0 ? `- ${-answer}` : `+ ${answer}`} = 0$, and the expression simplifies to $${e - f}$, with no $${v}$.`,
        `$${a} - ${d} ${answer < 0 ? `- ${-answer}` : `+ ${answer}`} = 0$，式子化简为 $${e - f}$，没有 $${v}$。`,
      ],
      [
        [a - d, "That is the total of the known coefficients; $k$ must be its opposite.", "这是已知系数的总和；$k$ 应该是它的相反数。"],
        [a + d, `That reads $-${d}${v}$ as $+${d}${v}$.`, `这把 $-${d}${v}$ 当成了 $+${d}${v}$。`],
        [
          -(a + d),
          `That reads $-${d}${v}$ as $+${d}${v}$, then takes the opposite.`,
          `这把 $-${d}${v}$ 当成了 $+${d}${v}$，再取了相反数。`,
        ],
        [a, `That cancels only $${a}${v}$ and forgets $-${d}${v}$.`, `这只抵消了 $${a}${v}$，忘了 $-${d}${v}$。`],
        [d, `That cancels only $-${d}${v}$ and forgets $${a}${v}$.`, `这只抵消了 $-${d}${v}$，忘了 $${a}${v}$。`],
      ],
    );
  },
  tableFigure(["5x", "−3x", "kx"], [5, -3, -2]),
);
const coefficientFromSolution = lesson(
  "a-missing-coefficient-from-a-solution",
  ["A missing coefficient from a solution", "由解求缺失的系数"],
  [
    [
      "A solution makes the equation true, so a known solution can find a missing number in the equation. Put the first coordinate in for $x$ and the second for $y$; what is left is an equation in $k$. $(2, -3)$ solves $3x + ky = 18$: $6 - 3k = 18$, so $-3k = 12$ and $k = -4$.",
      "解能使方程成立，所以已知的解可以用来求方程中缺少的数。把第一个坐标代入 $x$，第二个代入 $y$，剩下的就是关于 $k$ 的方程。$(2, -3)$ 是 $3x + ky = 18$ 的解：$6 - 3k = 18$，所以 $-3k = 12$，$k = -4$。",
    ],
    ["With $k = -4$: $3(2) - 4(-3) = 6 + 12 = 18$.", "$k = -4$ 时：$3(2) - 4(-3) = 6 + 12 = 18$。"],
    [
      "Keep the order and the signs: $x = 2$ and $y = -3$, so $ky$ becomes $-3k$, not $3k$.",
      "注意顺序和符号：$x = 2$，$y = -3$，所以 $ky$ 变成 $-3k$，不是 $3k$。",
    ],
  ],
  (rng) => {
    const a = rng.int(2, 7);
    const k = rng.pick([rng.int(-9, -2), rng.int(2, 9)]);
    const x = rng.pick([rng.int(-6, -1), rng.int(1, 6)]);
    const y = rng.pick([rng.int(-6, -2), rng.int(2, 6)]);
    const c = a * x + k * y;
    const rest = c - a * x;
    const first = a * x;
    const yTerm = y < 0 ? `- ${-y}k` : `+ ${y}k`;
    const kTerm = k < 0 ? `- ${-k} \\cdot ${paren(y)}` : `+ ${k} \\cdot ${paren(y)}`;
    return valued(
      [
        `The ordered pair $(${x}, ${y})$ is a solution of $${a}x + ky = ${c}$. What is the value of $k$?`,
        `有序数对 $(${x}, ${y})$ 是 $${a}x + ky = ${c}$ 的一个解。$k$ 的值是多少？`,
      ],
      k,
      [
        [
          ["Substitute", "代入"],
          [`Put $x = ${x}$ and $y = ${y}$ into the equation:`, `把 $x = ${x}$，$y = ${y}$ 代入方程：`],
          [`${first} ${yTerm} = ${c}`],
        ],
        [
          ["Solve for k", "求 k"],
          [`Take $${paren(first)}$ from both sides, then divide by $${y}$:`, `两边同时减去 $${paren(first)}$，再除以 $${y}$：`],
          [`${y}k = ${rest}`, `k = ${k}`],
        ],
      ],
      [
        `Put $k = ${k}$ back: $${a} \\cdot ${paren(x)} ${kTerm} = ${first} ${k * y < 0 ? `- ${-k * y}` : `+ ${k * y}`} = ${c}$.`,
        `把 $k = ${k}$ 代回去：$${a} \\cdot ${paren(x)} ${kTerm} = ${first} ${k * y < 0 ? `- ${-k * y}` : `+ ${k * y}`} = ${c}$。`,
      ],
      [
        [rest, `That is $${y}k$; it still has to be divided by $${y}$.`, `这是 $${y}k$；还要除以 $${y}$。`],
        [Q.of(c - a * y, x), "That swaps the coordinates: $x$ is the first number.", "这把坐标对调了：$x$ 是第一个数。"],
        [Q.of(c + a * x, y), `That adds $${paren(first)}$ instead of taking it away.`, `这是加上 $${paren(first)}$，而不是减去。`],
        [-k, "That has the wrong sign.", "符号错了。"],
        [Q.of(c, y), `That forgets the $${a}x$ term.`, `这忘了 $${a}x$ 这一项。`],
      ],
    );
  },
  tableFigure(["x", "y", "k"], [2, -3, -4]),
);
const extremeInteger = lesson(
  "the-extreme-integer-solution-of-an-inequality",
  ["The extreme integer solution of an inequality", "不等式的最大或最小整数解"],
  [
    [
      "Solve first, then walk from the boundary in the allowed direction to the first integer. $3x + 2 > 13$ gives $3x > 11$, so $x > \\frac{11}{3} \\approx 3.67$; the least integer solution is $4$. A boundary that is itself an integer counts only with $\\le$ or $\\ge$.",
      "先解不等式，再从边界出发，沿允许的方向找到第一个整数。$3x + 2 > 13$ 得 $3x > 11$，所以 $x > \\frac{11}{3} \\approx 3.67$；最小的整数解是 $4$。如果边界本身是整数，只有 $\\le$ 或 $\\ge$ 时才算。",
    ],
    [
      "$x = 4$: $3(4) + 2 = 14 > 13$ works, while $x = 3$: $3(3) + 2 = 11$ does not.",
      "$x = 4$：$3(4) + 2 = 14 > 13$ 成立；$x = 3$：$3(3) + 2 = 11$ 不成立。",
    ],
    [
      "A negative coefficient reverses the symbol, and then the allowed side is the other way: you look for the greatest integer, not the least.",
      "系数为负时不等号改变方向，允许的一侧也就反过来了：要找最大的整数，而不是最小的。",
    ],
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const b = rng.pick([rng.int(-20, -2), rng.int(2, 20)]);
    const c = rng.int(-30, 30);
    const strict = rng.bool();
    const negative = rng.bool();
    const shift = b < 0 ? `- ${-b}` : `+ ${b}`;
    const right = c - b;
    const lead = negative ? `-${a}x` : `${a}x`;
    const bound = negative ? -right / a : right / a;
    const boundQ = negative ? Q.of(-right, a) : Q.of(right, a);
    const answer = (negative ? (strict ? Math.ceil(bound) - 1 : Math.floor(bound)) : strict ? Math.floor(bound) + 1 : Math.ceil(bound)) + 0;
    const sign = strict ? ">" : "\\ge";
    const solved = negative ? (strict ? "<" : "\\le") : strict ? ">" : "\\ge";
    const wordEn = negative ? "greatest" : "least";
    const wordZh = negative ? "最大" : "最小";
    const next = negative ? answer + 1 : answer - 1;
    const further = negative ? answer - 1 : answer + 1;
    const value = (x: number) => (negative ? -a : a) * x + b;
    const at = (x: number) => `${negative ? `-${a}` : a}(${x}) ${shift} = ${value(x)}`;
    const exact = Number.isInteger(bound);
    return valued(
      [
        `What is the ${wordEn} integer $x$ that satisfies $${lead} ${shift} ${sign} ${c}$?`,
        `满足 $${lead} ${shift} ${sign} ${c}$ 的${wordZh}整数 $x$ 是多少？`,
      ],
      answer,
      [
        [
          ["Solve", "解不等式"],
          [
            `Move the constant, then divide by $${negative ? -a : a}$${negative ? ", reversing the symbol" : ""}:`,
            `移走常数，再除以 $${negative ? -a : a}$${negative ? "，并改变不等号方向" : ""}：`,
          ],
          [`${lead} ${sign} ${right}`, `x ${solved} ${boundQ.toLatex()}`],
        ],
        [
          ["Find the integer", "找出整数"],
          exact
            ? [
                `The boundary $${boundQ.toLatex()}$ is an integer, and it ${strict ? "does not count" : "counts"} with $${solved}$:`,
                `边界 $${boundQ.toLatex()}$ 是整数，在 $${solved}$ 下它${strict ? "不算" : "算"}：`,
              ]
            : [
                `$${boundQ.toLatex()}$ is between two integers; go ${negative ? "down" : "up"} to the first one:`,
                `$${boundQ.toLatex()}$ 在两个整数之间；向${negative ? "小" : "大"}的方向找到第一个整数：`,
              ],
          [`x = ${answer}`],
        ],
      ],
      [
        `$${at(answer)}$, and $${value(answer)} ${sign} ${c}$ is true; one step back, $${at(next)}$, and $${value(next)} ${sign} ${c}$ is false.`,
        `$${at(answer)}$，$${value(answer)} ${sign} ${c}$ 成立；退一步，$${at(next)}$，$${value(next)} ${sign} ${c}$ 不成立。`,
      ],
      [
        [next, "That one fails: it is on the wrong side of the boundary.", "这个数不行：它在边界的另一侧。"],
        [further, `That works, but it is not the ${wordEn}: $${answer}$ works too.`, `这个数可以，但不是${wordZh}的：$${answer}$ 也可以。`],
        [-answer, "That has the wrong sign.", "符号错了。"],
        [right, `That stops before dividing by $${negative ? -a : a}$.`, `这是除以 $${negative ? -a : a}$ 之前的值。`],
      ],
    );
  },
  drawn(gradeDrawings4["solving-multi-step-inequalities#the-extreme-integer-solution-of-an-inequality"]),
);
const wholeWithRootBetween: KnowledgePointDef = lesson(
  "whole-numbers-with-a-root-between-two-integers",
  ["Whole numbers with a root between two integers", "平方根在两个整数之间的整数"],
  [
    [
      "A square root grows as the number under it grows, so square every part: $3 < \\sqrt{n} < 5$ becomes $9 < n < 25$. Then $n$ runs from $10$ to $24$, which is $24 - 10 + 1 = 15$ whole numbers. With $\\le$ signs instead, the ends $9$ and $25$ count too, which makes $17$.",
      "平方根随被开方数增大而增大，所以把每一部分都平方：$3 < \\sqrt{n} < 5$ 变成 $9 < n < 25$。于是 $n$ 从 $10$ 到 $24$，共 $24 - 10 + 1 = 15$ 个整数。如果是 $\\le$ 号，两端的 $9$ 和 $25$ 也算，共 $17$ 个。",
    ],
    [
      "Count everything from $9$ to $25$: $17$ numbers. Taking off the two ends leaves $15$.",
      "把 $9$ 到 $25$ 全数上：$17$ 个。去掉两端剩 $15$ 个。",
    ],
    [
      "To count from one number to another, subtract and add $1$; a strict $<$ leaves out the perfect squares at the ends.",
      "从一个数数到另一个数，要相减再加 $1$；严格的 $<$ 不包括两端的完全平方数。",
    ],
  ],
  (rng) => {
    const p = rng.int(2, 15);
    const q = p + rng.int(1, 4);
    const strict = rng.bool();
    const gap = q * q - p * p;
    const answer = strict ? gap - 1 : gap + 1;
    const sign = strict ? "<" : "\\le";
    const [first, last] = strict ? [p * p + 1, q * q - 1] : [p * p, q * q];
    return valued(
      [
        `How many whole numbers $n$ satisfy $${p} ${sign} \\sqrt{n} ${sign} ${q}$?`,
        `有多少个整数 $n$ 满足 $${p} ${sign} \\sqrt{n} ${sign} ${q}$？`,
      ],
      answer,
      [
        [
          ["Square every part", "把每一部分平方"],
          ["The root grows with $n$, so squaring keeps the order:", "平方根随 $n$ 增大而增大，所以平方后大小顺序不变："],
          [`${p * p} ${sign} n ${sign} ${q * q}`],
        ],
        [
          ["Count the whole numbers", "数出整数"],
          [
            strict
              ? `The signs are strict, so $n$ runs from $${first}$ to $${last}$:`
              : `The signs keep the ends, so $n$ runs from $${first}$ to $${last}$:`,
            strict ? `是严格的不等号，所以 $n$ 从 $${first}$ 到 $${last}$：` : `不等号包括两端，所以 $n$ 从 $${first}$ 到 $${last}$：`,
          ],
          [`${last} - ${first} + 1 = ${answer}`],
        ],
      ],
      strict
        ? [
            `Count all of $${p * p}$ to $${q * q}$: $${gap} + 1 = ${gap + 1}$ numbers; leaving out the two ends gives $${gap + 1} - 2 = ${answer}$.`,
            `把 $${p * p}$ 到 $${q * q}$ 全数上：$${gap} + 1 = ${gap + 1}$ 个；去掉两端得 $${gap + 1} - 2 = ${answer}$。`,
          ]
        : [
            `Count the numbers strictly between, $${q * q} - ${p * p} - 1 = ${gap - 1}$, and add back the two ends: $${gap - 1} + 2 = ${answer}$.`,
            `先数两端之间的数：$${q * q} - ${p * p} - 1 = ${gap - 1}$，再加回两端：$${gap - 1} + 2 = ${answer}$。`,
          ],
      [
        [gap, "That subtracts the ends but does not add $1$ to count from one to the other.", "这是两端相减了，但没有加 $1$。"],
        strict
          ? [gap + 1, "That keeps both perfect squares, but the signs are strict.", "这是把两端的完全平方数也算进去了，但不等号是严格的。"]
          : [gap - 1, "That leaves out both perfect squares, but $\\le$ keeps them.", "这是去掉了两端的完全平方数，但 $\\le$ 包括它们。"],
        [q - p, "That counts whole-number roots, not the numbers $n$.", "这是数平方根的个数，不是 $n$ 的个数。"],
        [q * q, "That is the largest square, not how many numbers there are.", "这是较大的那个平方数，不是数的个数。"],
      ],
    );
  },
  lineFigure({ lo: 9, hi: 25, step: 1, labels: [9, 10, 24, 25], marks: [{ at: 10 }, { at: 24 }] }, [
    "A number line from 9 to 25 with 10 and 24 marked: the whole numbers strictly between 9 and 25.",
    "一条从 9 到 25 的数轴，标出了 10 和 24：严格位于 9 和 25 之间的整数。",
  ]),
);

const fencePosts: KnowledgePointDef = lesson(
  "fence-posts-along-a-border",
  ["Fence posts along a border", "沿边界立的栅栏柱"],
  [
    [
      "Posts spaced evenly split a border into equal gaps. On a straight fence with a post at each end, there is one more post than gaps: a $12$ m fence with posts $3$ m apart has $12 \\div 3 = 4$ gaps and $5$ posts. On a closed loop, such as the border of a field, the last gap ends at the first post, so there are as many posts as gaps.",
      "等距的柱子把边界分成相等的间隔。两端都有柱子的直栅栏上，柱子比间隔多一根：$12$ 米长、每隔 $3$ 米一根的栅栏有 $12 \\div 3 = 4$ 个间隔、$5$ 根柱子。在封闭的回路上，比如田地的边界，最后一个间隔在第一根柱子处结束，所以柱子数等于间隔数。",
    ],
    [
      "List where the posts stand: $0$, $3$, $6$, $9$, $12$ m, which is $5$ posts.",
      "列出柱子的位置：$0$、$3$、$6$、$9$、$12$ 米，共 $5$ 根。",
    ],
    [
      "Do not count the corner posts of a field twice: each corner post ends one side and starts the next.",
      "不要把田地角上的柱子数两遍：每根角柱既是一边的终点，又是下一边的起点。",
    ],
  ],
  (rng) => {
    const gap = rng.pick([2, 3, 4, 5, 6, 8, 10]);
    const length = gap * rng.int(5, 20);
    const width = gap * rng.int(2, 12);
    if (rng.bool()) {
      const perimeter = 2 * (length + width);
      const answer = perimeter / gap;
      const [along, across] = [length / gap - 1, width / gap - 1];
      return valued(
        [
          `A rectangular field is $${length}$ m long and $${width}$ m wide. Posts stand all the way around its border, $${gap}$ m apart, with one at each corner. How many posts are there?`,
          `一块长方形田地长 $${length}$ 米、宽 $${width}$ 米。沿边界一圈立柱子，间隔 $${gap}$ 米，每个角上都有一根。一共有多少根柱子？`,
        ],
        answer,
        [
          [
            ["Find the border", "求边界长"],
            ["The border is the perimeter:", "边界长就是周长："],
            [`2(${length} + ${width}) = ${perimeter}`],
          ],
          [
            ["Count the gaps", "数间隔"],
            ["On a closed loop there are as many posts as gaps:", "封闭回路上柱子数等于间隔数："],
            [`${perimeter} \\div ${gap} = ${answer}`],
          ],
        ],
        [
          `Count side by side: each long side has $${along}$ posts between its corners, each short side $${across}$, plus $4$ corners: $2 \\cdot ${along} + 2 \\cdot ${across} + 4 = ${answer}$.`,
          `一条边一条边地数：每条长边两角之间有 $${along}$ 根，每条短边有 $${across}$ 根，再加 $4$ 根角柱：$2 \\cdot ${along} + 2 \\cdot ${across} + 4 = ${answer}$。`,
        ],
        [
          [
            answer + 1,
            "That adds an end post as on a straight fence, but the loop comes back to the first post.",
            "这是像直栅栏那样多加了一根，但回路会回到第一根柱子。",
          ],
          [answer + 4, "That counts each corner post twice, once for each side.", "这是把每根角柱数了两遍，每条边各一遍。"],
          [(length + width) / gap, "That uses only half of the border, one length and one width.", "这只用了边界的一半，一个长加一个宽。"],
          [
            Q.of(length * width, gap),
            "That divides the area, but the posts stand along the border.",
            "这是用面积来除，但柱子是沿边界立的。",
          ],
        ],
      );
    }
    const gaps = length / gap;
    return valued(
      [
        `A straight fence is $${length}$ m long. Posts stand along it, $${gap}$ m apart, with one at each end. How many posts are there?`,
        `一道直栅栏长 $${length}$ 米。沿栅栏立柱子，间隔 $${gap}$ 米，两端都有一根。一共有多少根柱子？`,
      ],
      gaps + 1,
      [
        [["Count the gaps", "数间隔"], ["Divide the length by the spacing:", "用长度除以间隔："], [`${length} \\div ${gap} = ${gaps}`]],
        [
          ["Add the end post", "加上末端的柱子"],
          [
            "Each gap has a post at its start, and the last gap also needs one at its end:",
            "每个间隔起点有一根柱子，最后一个间隔的终点还要一根：",
          ],
          [`${gaps} + 1 = ${gaps + 1}`],
        ],
      ],
      [
        `List where the posts stand: $0, ${gap}, ${2 * gap}, \\ldots, ${length}$ m, which is $${gaps}$ steps of $${gap}$ after the first post, so $${gaps + 1}$ posts.`,
        `列出柱子的位置：$0, ${gap}, ${2 * gap}, \\ldots, ${length}$ 米，第一根之后走了 $${gaps}$ 步，每步 $${gap}$ 米，所以共 $${gaps + 1}$ 根。`,
      ],
      [
        [gaps, "That counts the gaps; a straight fence needs one more post than gaps.", "这是间隔数；直栅栏的柱子比间隔多一根。"],
        [gaps - 1, "That leaves out both end posts.", "这是漏掉了两端的柱子。"],
        [gaps + 2, "That adds two extra posts, but only the end needs one more.", "这是多加了两根，但只有末端需要多一根。"],
        [length - gap, "That subtracts the spacing instead of dividing by it.", "这是减去间隔，应该用间隔去除。"],
      ],
      { figure: equalTape(gaps, `${gap} m`, `${length} m`) },
    );
  },
  tapeFigure(
    [{ total: "12 m", pieces: [1, 2, 3, 4].map(() => ({ size: 1, text: "3 m" })) }],
    [
      "A 12 m fence cut into 4 gaps of 3 m; posts stand at the 5 ends of the gaps.",
      "一道 12 米长的栅栏分成 4 个 3 米的间隔；柱子立在这些间隔的 5 个端点上。",
    ],
  ),
);
/** deeperPrealgebraPoints maps topics of Prealgebra to further knowledge points. */
export const deeperPrealgebraPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "mixed-numbers": [wholesBetweenFractions],
  "fractions-and-decimals": [farDigit],
  "further-reasoning-with-equivalent-ratios": [joiningRatios],
  "writing-ratios-using-fractions": [ratioFromFraction],
  "unit-rates": [rateUnits],
  "finding-part-of-a-number-given-a-whole-and-a-percentage-word-problems": [percentOfPercent],
  "finding-a-percentage-given-two-numbers-word-problems": [scoreNeeded],
  "applying-percentage-decreases": [percentOrDollars],
  "calculating-percentage-change": [shrinkflation],
  "finding-original-values-from-percentage-increases": [raiseFromNew],
  "subtracting-a-positive-number-from-a-negative-number": [missingSubtrahend],
  "adding-a-negative-number": [untilBelowZero],
  "solving-problems-using-addition-and-subtraction-of-rational-numbers": [startFromChanges],
  "multiplying-negative-numbers": [largestProduct],
  "dividing-with-negative-numbers": [changePerHour],
  "multiplying-and-dividing-with-zero": [undefinedFraction],
  "combining-like-terms": [cancellingCoefficient],
  "two-variable-linear-equations-and-their-solutions": [coefficientFromSolution],
  "solving-multi-step-inequalities": [extremeInteger],
  "approximating-square-roots": [wholeWithRootBetween],
  perimeter: [fencePosts],
  "units-of-area-and-volume": [convertingSquareAndCubicUnits],
};
