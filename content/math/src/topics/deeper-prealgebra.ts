// Further knowledge points for topics of Prealgebra, each a skill the topic's own
// points leave out: working backwards, combining a fact with another, an edge
// condition, or a word problem built on the idea. See `deeperPrealgebraPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";

import { numberProblem } from "../problems.ts";
import { tableFigure } from "./early-grades-more-kit.ts";
import { lesson, type Off, valued } from "./grade-6-kit.ts";
import { equalTape, tapeFigure } from "./upper-grades-kit.ts";

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

const wholesBetweenFractions: KnowledgePointDef = {
  id: "whole-numbers-between-two-improper-fractions",
  title: t("Whole numbers between two improper fractions", "两个假分数之间的整数"),
  explanation: t(
    "Improper fractions with different denominators are hard to compare by their numerators, but as mixed numbers they sit clearly on the number line. The whole part of a mixed number tells which two whole numbers it lies between. So rewrite both fractions and list the whole numbers above the smaller one and up to the whole part of the larger one. The whole part of the smaller fraction is below it, so it does not count.",
    "分母不同的假分数很难只看分子来比较，但化成带分数后，它们在数轴上的位置就很清楚了。带分数的整数部分说明它位于哪两个整数之间。所以把两个分数都改写，然后列出比较小的数大、且不超过较大数的整数部分的所有整数。较小分数的整数部分比它本身小，所以不算在内。",
  ),
  generate(rng) {
    const d = rng.pick([3, 4, 5, 7, 8]);
    const e = rng.pick([3, 4, 5, 7, 8]);
    const low = rng.int(2, 9);
    const high = low + rng.int(2, 7);
    const r = rng.pick([1, 2, 3, 4, 5, 6, 7].filter((v) => v < d && gcdPre(v, d) === 1));
    const s = rng.pick([1, 2, 3, 4, 5, 6, 7].filter((v) => v < e && gcdPre(v, e) === 1));
    const a = d * low + r;
    const b = e * high + s;
    const answer = high - low;
    return numberProblem({
      prompt: t(
        `How many whole numbers lie strictly between $\\frac{${a}}{${d}}$ and $\\frac{${b}}{${e}}$?`,
        `严格位于 $\\frac{${a}}{${d}}$ 和 $\\frac{${b}}{${e}}$ 之间的整数有多少个？`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1, answer - 1, high, b - a, answer + 2],
      solution: t(
        `As mixed numbers they are $${low}\\frac{${r}}{${d}}$ and $${high}\\frac{${s}}{${e}}$. The whole numbers between them run from $${low + 1}$ to $${high}$, and that makes $${answer}$ of them.`,
        `化成带分数是 $${low}\\frac{${r}}{${d}}$ 和 $${high}\\frac{${s}}{${e}}$。它们之间的整数从 $${low + 1}$ 到 $${high}$，一共 $${answer}$ 个。`,
      ),
    });
  },
};

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
const percentOrDollars: KnowledgePointDef = {
  id: "percent-off-or-dollars-off",
  title: t("Percent off or dollars off", "打折还是减价"),
  explanation: t(
    "A percent discount depends on the price, while a fixed discount in dollars does not. That is why neither kind of coupon is always better: on an expensive item the percent discount tends to save more, and on a cheap item the fixed amount often does. To compare them, turn the percent into dollars for this particular price. Then the two savings are in the same unit, and subtracting them shows how much the better coupon adds.",
    "百分比折扣取决于价格，而固定金额的折扣则不然。所以哪种优惠券都不是总更好：贵的商品上百分比折扣往往省得多，便宜的商品上固定金额常常更划算。要比较它们，就把百分数按这个价格换算成美元。这样两种节省的金额单位相同，相减就能看出较好的优惠券多省了多少。",
  ),
  generate(rng) {
    const price = 20 * rng.int(3, 20);
    const rate = rng.pick([10, 15, 20, 25, 30, 40]);
    const fromRate = (price * rate) / 100;
    const raw = 5 * rng.int(2, Math.min(12, price / 10));
    const fixed = raw === fromRate ? raw + 5 : raw;
    const answer = Math.abs(fromRate - fixed);
    const better = Math.max(fromRate, fixed);
    return numberProblem({
      prompt: t(
        `A jacket costs $${price}$ dollars. One coupon takes $${rate}\\%$ off the price, and another takes $${fixed}$ dollars off. Only one coupon can be used. How many more dollars does the better coupon save than the other?`,
        `一件夹克售价 $${price}$ 美元。一张优惠券减价 $${rate}\\%$，另一张减 $${fixed}$ 美元。只能用一张。较好的优惠券比另一张多省多少美元？`,
      ),
      answer,
      form: "integer",
      wrong: [
        better,
        price - better,
        fromRate + fixed,
        Math.abs(rate - fixed),
        Math.min(fromRate, fixed),
        price - Math.min(fromRate, fixed),
        Q.of(fixed * rate, 100),
      ],
      solution: t(
        `The percent coupon saves $${rate}\\%$ of $${price}$, which is $${fromRate}$ dollars, and the other saves $${fixed}$ dollars. The difference between the savings is $${answer}$ dollars.`,
        `百分比优惠券省下 $${price}$ 的 $${rate}\\%$，也就是 $${fromRate}$ 美元；另一张省 $${fixed}$ 美元。两者相差 $${answer}$ 美元。`,
      ),
    });
  },
};

const shrinkflation: KnowledgePointDef = {
  id: "percent-change-in-a-unit-price",
  title: t("Percent change in a unit price", "单价的百分比变化"),
  explanation: t(
    "When a package shrinks but its price stays fixed, the unit price rises, and by a larger percent than the package fell. The same money now pays for less, so each unit costs more. Work out how many times as large the old amount is as the new amount: the unit price grows by exactly this factor. Then measure the change from the old unit price. The drop in size and the rise in price are different percents.",
    "当包装变小而价格不变时，单价就上升了，而且上升的百分比比包装减少的百分比更大。同样的钱现在买到的更少，所以每单位更贵。算出旧的量是新的量的多少倍：单价正好变成原来的这么多倍。然后以旧单价为基准计算变化。量的减少和单价的上升是两个不同的百分数。",
  ),
  generate(rng) {
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
    return numberProblem({
      prompt: t(
        `A ${item} shrinks from $${a * size}$ ${unit} to $${b * size}$ ${unit}, and its price stays at $${price}$ dollars. By what percent does the price per $${single}$ rise?`,
        `${itemZh}从 $${a * size}$ ${unitZh}减少到 $${b * size}$ ${unitZh}，价格仍是 $${price}$ 美元。每${unitZh}的价格上升了百分之几？`,
      ),
      answer,
      form: "decimal",
      percent: true,
      wrong: [Q.of(100 * (a - b), a), Q.of(100 * a, b), Q.of(100 * b, a), Q.of((a - b) * size)],
      solution: t(
        `With the same price, the unit price changes by the factor $${a * size} \\div ${b * size} = ${dec(Q.of(a, b))}$. A factor of $${dec(Q.of(a, b))}$ is a rise of $${dec(answer)}\\%$, measured from the old unit price.`,
        `价格不变，所以单价变成原来的 $${a * size} \\div ${b * size} = ${dec(Q.of(a, b))}$ 倍。这相当于比旧单价上升了 $${dec(answer)}\\%$。`,
      ),
    });
  },
};

const raiseFromNew: KnowledgePointDef = {
  id: "the-amount-of-an-increase-from-the-new-value",
  title: t("The amount of an increase from the new value", "由新值求增加的量"),
  explanation: t(
    "When only the value after an increase is known, the percent cannot be applied to that value, because the percent was measured from the original. So first work backwards: dividing by the multiplier gives the original value. Then the increase is the new value minus the original. Taking the percent of the new value gives an amount that is too large, since the new value already includes the increase, and that is the trap in this kind of question.",
    "当只知道增加之后的值时，不能把百分数直接用在这个值上，因为百分数是相对原值而言的。所以要先倒着算：除以乘数得到原值。然后增加的量就是新值减去原值。对新值取百分数得到的量会偏大，因为新值已经包含了增加的部分，这正是这类问题的陷阱。",
  ),
  generate(rng) {
    const rate = rng.pick([5, 10, 20, 25, 50]);
    const original = 200 * rng.int(1, 15);
    const increase = (original * rate) / 100;
    const final = original + increase;
    const naive = Q.of(final * rate, 100);
    const [en, zh] = rng.pick([
      [`After a raise of ${rate}%, a monthly wage is ${final} dollars.`, `加薪 ${rate}% 后，月薪是 ${final} 美元。`],
      [`After a rise of ${rate}%, a monthly rent is ${final} dollars.`, `上涨 ${rate}% 后，月租是 ${final} 美元。`],
      [`After a price increase of ${rate}%, a bicycle costs ${final} dollars.`, `涨价 ${rate}% 后，一辆自行车售价 ${final} 美元。`],
    ]) as [string, string];
    return numberProblem({
      prompt: t(`${en} By how many dollars did it go up?`, `${zh}上涨了多少美元？`),
      answer: increase,
      form: "decimal",
      wrong: [naive, original, Q.of(final).sub(naive), Q.of(rate)],
      solution: t(
        `The multiplier is $${dec(Q.of(100 + rate, 100))}$, so the original value is $${final} \\div ${dec(Q.of(100 + rate, 100))} = ${original}$ dollars. The increase is $${final} - ${original} = ${increase}$ dollars.`,
        `乘数是 $${dec(Q.of(100 + rate, 100))}$，所以原值是 $${final} \\div ${dec(Q.of(100 + rate, 100))} = ${original}$ 美元。增加的量是 $${final} - ${original} = ${increase}$ 美元。`,
      ),
    });
  },
};

const missingSubtrahend: KnowledgePointDef = {
  id: "the-number-subtracted-from-a-negative-number",
  figure: gradeDrawings4["subtracting-a-positive-number-from-a-negative-number#the-number-subtracted-from-a-negative-number"],
  title: t("The number subtracted from a negative number", "从负数中减去的数"),
  explanation: t(
    "Subtracting a positive number moves to the left on the number line, so a result further below zero than the start shows how far the move went. The amount subtracted is the distance between the start and the result. Since both of them lie below zero, this distance is the difference of their sizes, not the sum. Putting the number found back into the subtraction is a quick way of checking that it lands on the stated result.",
    "减去一个正数就是在数轴上向左移动，所以结果比起点离零更远，就能说明移动了多远。减去的量就是起点和结果之间的距离。因为两者都在零的下方，这个距离是它们大小之差，而不是和。把求出的数代回减法中，可以很快检验是否正好得到题目给出的结果。",
  ),
  generate(rng) {
    const start = rng.int(2, 25);
    const answer = rng.int(2, 25);
    const end = start + answer;
    const inContext = rng.bool();
    return numberProblem({
      prompt: inContext
        ? t(
            `The temperature was $-${start}^{\\circ}\\text{C}$ and it fell to $-${end}^{\\circ}\\text{C}$. How many degrees did it fall?`,
            `气温原来是 $-${start}^{\\circ}\\text{C}$，后来降到 $-${end}^{\\circ}\\text{C}$。气温下降了多少度？`,
          )
        : t(
            `What positive number goes in the box? $$-${start} - \\square = -${end}$$`,
            `方框里应填哪个正数？$$-${start} - \\square = -${end}$$`,
          ),
      answer,
      form: "integer",
      wrong: [start + end, -answer, -(start + end), end, start],
      solution: t(
        `Both numbers are below zero, $${start}$ and $${end}$ units away from it. The distance between them is $${end} - ${start} = ${answer}$. Check: $-${start} - ${answer} = -${end}$.`,
        `两个数都在零的下方，离零分别是 $${start}$ 和 $${end}$ 个单位。它们之间的距离是 $${end} - ${start} = ${answer}$。检验：$-${start} - ${answer} = -${end}$。`,
      ),
    });
  },
};

const untilBelowZero: KnowledgePointDef = {
  id: "how-many-additions-until-below-zero",
  title: t("How many additions until below zero", "加多少次后低于零"),
  explanation: t(
    "Adding the same negative number again and again lowers the total by equal steps, and so division can count the steps. Dividing the starting value by the size of each step tells how many steps fit without going below zero. A total of exactly zero is not yet below zero, and so one further step is always needed after all the full steps. Trying the count and the count before it confirms that the first negative total has been found.",
    "反复加同一个负数，总数会按相同的步长下降，所以可以用除法来数步数。用起始值除以每步的大小，就知道在不低于零的情况下能走多少步。总数恰好为零还不算低于零，所以走完所有完整的步之后，总还要再走一步。试一试这个次数和它的前一次，就能确认找到了第一个负的总数。",
  ),
  generate(rng) {
    const step = rng.int(3, 15);
    const full = rng.int(3, 14);
    const left = rng.int(0, step - 1);
    const start = step * full + left;
    const answer = full + 1;
    const after = start - step * answer;
    const inContext = rng.bool();
    return numberProblem({
      prompt: inContext
        ? t(
            `A player starts a game with $${start}$ points, and each wrong move adds $-${step}$ to the score. After how many wrong moves is the score first below zero?`,
            `一名玩家开始时有 $${start}$ 分，每次走错都在分数上加 $-${step}$。走错多少次后，分数第一次低于零？`,
          )
        : t(
            `Start at $${start}$ and keep adding $-${step}$. After how many additions is the total first negative?`,
            `从 $${start}$ 开始，不断加 $-${step}$。加多少次后，总数第一次变成负数？`,
          ),
      answer,
      form: "integer",
      wrong: [full, full + 2, full - 1, start - step, left + 1],
      solution: t(
        `After $${full}$ additions the total is $${start} - ${step * full} = ${left}$, which is not below zero. One more addition gives $${after}$, so the count is $${answer}$.`,
        `加 $${full}$ 次后总数是 $${start} - ${step * full} = ${left}$，还没有低于零。再加一次得 $${after}$，所以是 $${answer}$ 次。`,
      ),
    });
  },
};

const startFromChanges: KnowledgePointDef = {
  id: "the-start-from-a-sequence-of-changes",
  title: t("The start from a sequence of changes", "由一连串变化求起始值"),
  explanation: t(
    "To find where a sequence of changes began, undo them from the end. A rise is undone by subtracting, and a fall is undone by adding. The order does not affect the result for additions and subtractions, but the direction of each change must be reversed. Using the changes as they are stated gives a value further along instead of an earlier one. Running the changes forward from the answer confirms that the final value is reached.",
    "要找一连串变化的起点，就从最后往前撤销这些变化。上升通过减法撤销，下降通过加法撤销。对加减法来说顺序不影响结果，但每个变化的方向都必须反过来。照题目所说的变化直接计算，得到的是更靠后的值，而不是更早的值。从答案开始正向走一遍这些变化，可以确认能得到最终的值。",
  ),
  generate(rng) {
    const up = Q.of(rng.int(11, 90), 10);
    const drawnDown = Q.of(rng.int(11, 90), 10);
    const down = drawnDown.eq(up) ? up.add(Q.of(1, 10)) : drawnDown;
    const startTenths = rng.pick([rng.int(-60, -1), rng.int(1, 60)]);
    const start = Q.of(startTenths, 10);
    const raw = start.add(up).sub(down);
    const end = raw.isInteger() && raw.sign() === 0 ? up : raw;
    const answer = end.sub(up).add(down);
    return numberProblem({
      prompt: t(
        `During a day the temperature rose $${dec(up)}$ degrees and later fell $${dec(down)}$ degrees. It finished at $${dec(end)}^{\\circ}\\text{C}$. What was the temperature at the start, in degrees Celsius?`,
        `一天中气温先上升 $${dec(up)}$ 度，后来又下降 $${dec(down)}$ 度，最后是 $${dec(end)}^{\\circ}\\text{C}$。开始时的气温是多少摄氏度？`,
      ),
      answer,
      form: "decimal",
      wrong: [end.add(up).sub(down), end.sub(up).sub(down), end.add(up).add(down), end, answer.neg()],
      solution: t(
        `Undo each change: add back the fall and take away the rise. So the start is $${dec(end)} + ${dec(down)} - ${dec(up)} = ${dec(answer)}$ degrees.`,
        `撤销每个变化：把下降的加回来，把上升的减掉。所以开始时是 $${dec(end)} + ${dec(down)} - ${dec(up)} = ${dec(answer)}$ 度。`,
      ),
    });
  },
};

const largestProduct: KnowledgePointDef = {
  id: "the-largest-product-of-two-from-a-list",
  title: t("The largest product of two from a list", "从一列数中取两个数的最大积"),
  explanation: t(
    "The product of two negative numbers is positive, so the largest product from a list need not use the largest numbers. There are two candidates: the two greatest positive numbers, and the two negative numbers that are furthest below zero. Work out both and take the larger. A pair with one positive and one negative factor is never a candidate when another pair of the same sign exists, because its product is negative and lies below every positive product.",
    "两个负数的积是正数，所以一列数中的最大积不一定用到最大的数。有两个候选：最大的两个正数，以及离零最远的两个负数。把两个都算出来，取较大的。一正一负的一对数不可能是答案，只要还有同号的一对，因为它们的积是负数，比任何正的积都小。",
  ),
  generate(rng) {
    const a = rng.int(5, 15);
    const b = a + rng.int(1, 5);
    const posHigh = rng.int(3, 12);
    const posMid = posHigh - rng.int(1, 2);
    const posLow = rng.int(1, posMid);
    const values = [-a, -b, posHigh, posMid, posLow === posMid ? posMid - 1 : posLow];
    for (let i = values.length - 1; i > 0; i--) {
      const j = rng.int(0, i);
      const held = values[i] as number;
      values[i] = values[j] as number;
      values[j] = held;
    }
    const negatives = a * b;
    const positives = posHigh * posMid;
    const answer = Math.max(negatives, positives);
    return numberProblem({
      prompt: t(
        `Two different numbers are chosen from the list ${values.map((v) => `$${v}$`).join(", ")} and multiplied. What is the largest possible product?`,
        `从 ${values.map((v) => `$${v}$`).join("、")} 中选两个不同的数相乘。积最大是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [positives, negatives, -b * posHigh, -negatives, b * b],
      solution: t(
        `Two positives give at most $${posHigh} \\times ${posMid} = ${positives}$. Two negatives give $(-${a}) \\times (-${b}) = ${negatives}$. The larger of these is $${answer}$.`,
        `两个正数的积最大是 $${posHigh} \\times ${posMid} = ${positives}$。两个负数的积是 $(-${a}) \\times (-${b}) = ${negatives}$。其中较大的是 $${answer}$。`,
      ),
    });
  },
};

const changePerHour: KnowledgePointDef = {
  id: "a-steady-change-per-hour",
  title: t("A steady change per hour", "每小时的稳定变化"),
  explanation: t(
    "A steady change means an equal change in each hour, so the total change is shared equally by dividing. The total change is the final value minus the first value, in that order, and its sign says whether the quantity went up or down. Dividing a negative total by a positive number of hours gives a negative rate. Adding the two values, or leaving out the sign, are the usual mistakes, especially when the quantity crosses zero on the way.",
    "稳定变化是指每小时的变化相同，所以用除法把总变化平均分开。总变化是最终值减去最初的值，顺序不能反，它的符号说明这个量是上升还是下降。负的总变化除以正的小时数，得到负的比率。把两个值相加，或者漏掉符号，是常见的错误，尤其是当这个量中途跨过零的时候。",
  ),
  generate(rng) {
    const hours = rng.int(2, 8);
    const rate = rng.int(2, 5);
    const drawn = rng.pick([rng.int(-5, -1), rng.int(1, 25)]);
    const start = drawn === hours * rate ? drawn + 1 : drawn;
    const end = start - hours * rate;
    const falling = rng.bool();
    const first = falling ? start : end;
    const last = falling ? end : start;
    const answer = falling ? -rate : rate;
    return numberProblem({
      prompt: t(
        `Over $${hours}$ hours the temperature changed steadily from $${first}^{\\circ}\\text{C}$ to $${last}^{\\circ}\\text{C}$. What was the change per hour, in degrees? Use a negative number for a fall.`,
        `在 $${hours}$ 小时内，气温从 $${first}^{\\circ}\\text{C}$ 稳定地变化到 $${last}^{\\circ}\\text{C}$。每小时变化多少度？下降用负数表示。`,
      ),
      answer,
      form: "integer",
      wrong: [-answer, last - first, Q.of(first + last, hours), Q.of(last, hours)],
      solution: t(
        `The total change is $${differenceLatex(last, first)} = ${last - first}$ degrees. Sharing it over $${hours}$ hours gives $${last - first} \\div ${hours} = ${answer}$ degrees per hour.`,
        `总变化是 $${differenceLatex(last, first)} = ${last - first}$ 度。平均分到 $${hours}$ 小时，得 $${last - first} \\div ${hours} = ${answer}$ 度每小时。`,
      ),
    });
  },
};

const undefinedFraction: KnowledgePointDef = {
  id: "the-value-that-makes-a-fraction-undefined",
  title: t("The value where a fraction is not defined", "使分数没有意义的值"),
  explanation: t(
    "Division by zero has no value, so a fraction with a variable fails for any value that turns its denominator into zero. Only the denominator matters here: a numerator of zero just makes the whole fraction equal to zero, which is a perfectly good value. So set the expression below the bar equal to zero and solve. Substituting the result into the denominator confirms it gives zero, and the fraction is defined for every other value.",
    "除以零没有结果，所以含变量的分数在分母等于零的值处没有意义。这里只有分母才重要：分子为零只会让整个分数等于零，这是完全正常的值。所以让分数线下面的式子等于零，然后求解。把结果代回分母可以确认它等于零，而对其他所有值，这个分数都有意义。",
  ),
  generate(rng) {
    const k = rng.int(2, 9);
    const value = rng.pick([rng.int(-9, -2), rng.int(2, 9)]);
    const top = rng.int(2, 15);
    const topPlus = rng.bool();
    const topZero = topPlus ? -top : top;
    const constant = k * value;
    const bottom = constant > 0 ? `${k}x - ${constant}` : `${k}x + ${-constant}`;
    const numerator = topPlus ? `x + ${top}` : `x - ${top}`;
    return numberProblem({
      prompt: t(
        `For what value of $x$ is $\\frac{${numerator}}{${bottom}}$ not defined?`,
        `当 $x$ 取何值时，$\\frac{${numerator}}{${bottom}}$ 没有意义？`,
      ),
      answer: value,
      form: "integer",
      wrong: [-value, topZero, 0, constant, -constant],
      solution: t(
        `A fraction is not defined when its denominator is zero. Solving $${bottom} = 0$ gives $x = ${value}$.`,
        `分母为零时分数没有意义。解 $${bottom} = 0$，得 $x = ${value}$。`,
      ),
    });
  },
};

const cancellingCoefficient: KnowledgePointDef = {
  id: "the-coefficient-that-removes-a-term",
  title: t("The coefficient that removes a term", "消去一项的系数"),
  explanation: t(
    "Combining like terms adds their coefficients, and a term disappears from the simplified expression when its coefficient becomes zero. So asking for a term to vanish gives a small equation: the coefficients of that variable must add up to zero. Collect the known coefficients first and then choose the opposite of their total. The constant terms play no part in this, since they are not like terms with the variable, and they stay in the expression whatever happens.",
    "合并同类项就是把系数相加，当系数变成零时，这一项就从化简后的式子中消失了。所以要求一项消失，就得到一个小方程：这个变量的系数之和必须等于零。先合并已知的系数，再取它们总和的相反数。常数项与此无关，因为它们和含变量的项不是同类项，无论如何都留在式子中。",
  ),
  generate(rng) {
    const a = rng.int(2, 12);
    const d = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((v) => v !== a));
    const e = rng.int(2, 20);
    const f = rng.int(2, 20);
    const v = rng.pick(["x", "n", "y", "m"]);
    const answer = d - a;
    const known = a - d === 1 ? v : a - d === -1 ? `-${v}` : `${a - d}${v}`;
    return numberProblem({
      prompt: t(
        `For what value of $k$ does the expression $${a}${v} + ${e} - ${d}${v} + k${v} - ${f}$ have no $${v}$ term after simplifying?`,
        `当 $k$ 取何值时，式子 $${a}${v} + ${e} - ${d}${v} + k${v} - ${f}$ 化简后没有 $${v}$ 项？`,
      ),
      answer,
      form: "integer",
      wrong: [a - d, a + d, -(a + d), a, d],
      solution: t(
        `The known terms combine to $${known}$. For the $${v}$ term to vanish, $k$ must be the opposite of $${a - d}$, which is ${answer < 0 ? `$${answer}$` : answer}.`,
        `已知的项合并为 $${known}$。要让 $${v}$ 项消失，$k$ 必须是 $${a - d}$ 的相反数，也就是 ${answer < 0 ? `$${answer}$` : answer}。`,
      ),
    });
  },
};

const coefficientFromSolution: KnowledgePointDef = {
  id: "a-missing-coefficient-from-a-solution",
  title: t("A missing coefficient from a solution", "由解求缺失的系数"),
  explanation: t(
    "An ordered pair is a solution exactly when its values make the equation true. So a known solution can be used in reverse, to pin down an unknown number in the equation. Replace the variables by the coordinates, taking the first for $x$ and the second for $y$. What is left is a one-variable equation for the missing coefficient. Swapping the coordinates, or losing a negative sign during the substitution, is what usually goes wrong here.",
    "一个有序数对是解，当且仅当它的值使方程成立。所以已知的解可以反过来用，确定方程中未知的数。用坐标替换变量，第一个代入 $x$，第二个代入 $y$。剩下的就是关于缺失系数的一元方程。把坐标对调，或者在代入时丢掉负号，是这里常见的错误。",
  ),
  generate(rng) {
    const a = rng.int(2, 7);
    const k = rng.pick([rng.int(-9, -2), rng.int(2, 9)]);
    const x = rng.pick([rng.int(-6, -1), rng.int(1, 6)]);
    const y = rng.pick([rng.int(-6, -2), rng.int(2, 6)]);
    const c = a * x + k * y;
    const rest = c - a * x;
    const first = a * x;
    const yTerm = y < 0 ? `- ${-y}k` : `+ ${y}k`;
    return numberProblem({
      prompt: t(
        `The ordered pair $(${x}, ${y})$ is a solution of $${a}x + ky = ${c}$. What is the value of $k$?`,
        `有序数对 $(${x}, ${y})$ 是 $${a}x + ky = ${c}$ 的一个解。$k$ 的值是多少？`,
      ),
      answer: k,
      wrong: [rest, Q.of(c - a * y, x), Q.of(c + a * x, y), -k, Q.of(c, y)],
      solution: t(
        `Substituting gives $${first} ${yTerm} = ${c}$. So $${y}k = ${rest}$, and dividing by $${y}$ gives $k = ${k}$.`,
        `代入得 $${first} ${yTerm} = ${c}$。所以 $${y}k = ${rest}$，两边除以 $${y}$，得 $k = ${k}$。`,
      ),
    });
  },
};

const extremeInteger: KnowledgePointDef = {
  id: "the-extreme-integer-solution-of-an-inequality",
  figure: gradeDrawings4["solving-multi-step-inequalities#the-extreme-integer-solution-of-an-inequality"],
  title: t("The extreme integer solution of an inequality", "不等式的最大或最小整数解"),
  explanation: t(
    "Solving an inequality gives a boundary, and that boundary is often not a whole number. To find the least or greatest integer solution, solve first and then look along the number line from the boundary in the allowed direction. If the boundary is itself an integer, it counts only when the sign includes equality. A negative coefficient flips the sign during the division, and this changes which direction is allowed. Testing the integer found, and its neighbor, confirms the result.",
    "解不等式会得到一个边界，这个边界常常不是整数。要找最小或最大的整数解，先求解，再从边界开始沿着允许的方向在数轴上查看。如果边界本身是整数，只有当符号包含等号时它才算解。负系数在除法时会让不等号改变方向，这也改变了允许的方向。把找到的整数和它相邻的整数代入检验，就能确认结果。",
  ),
  generate(rng) {
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
    const sign = negative ? (strict ? ">" : "\\ge") : strict ? ">" : "\\ge";
    const solved = negative ? (strict ? "<" : "\\le") : strict ? ">" : "\\ge";
    const wordEn = negative ? "greatest" : "least";
    const wordZh = negative ? "最大" : "最小";
    return numberProblem({
      prompt: t(
        `What is the ${wordEn} integer $x$ that satisfies $${lead} ${shift} ${sign} ${c}$?`,
        `满足 $${lead} ${shift} ${sign} ${c}$ 的${wordZh}整数 $x$ 是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1, answer - 1, -answer, right, answer + 2],
      solution: t(
        `Moving the constant gives $${lead} ${sign} ${right}$, so $x ${solved} ${boundQ.toLatex()}$${negative ? ", with the sign flipped by the negative coefficient" : ""}. The ${wordEn} integer on that side is $${answer}$.`,
        `移项得 $${lead} ${sign} ${right}$，所以 $x ${solved} ${boundQ.toLatex()}$${negative ? "（负系数使不等号改变方向）" : ""}。这一侧${wordZh}的整数是 $${answer}$。`,
      ),
    });
  },
};

const wholeWithRootBetween: KnowledgePointDef = {
  id: "whole-numbers-with-a-root-between-two-integers",
  title: t("Whole numbers with a root between two integers", "平方根在两个整数之间的整数"),
  explanation: t(
    "A square root grows as the number under it grows, so bounds on a root turn into bounds on the number when everything is squared. Squaring the two integer bounds gives a range of whole numbers to count. Whether the ends belong depends on the signs: a strict sign leaves out the perfect squares at each end, and an inclusive sign keeps them. Counting a range of whole numbers is the last step, and it is where an error of one is easy to make.",
    "平方根随被开方数增大而增大，所以把所有部分都平方后，平方根的范围就变成了这个数的范围。把两个整数边界平方，得到要数的整数范围。两端是否算在内取决于符号：严格的符号不包括两端的完全平方数，包含等号的符号则包括。最后一步是数这个范围内的整数，这里很容易差一个。",
  ),
  generate(rng) {
    const p = rng.int(2, 15);
    const q = p + rng.int(1, 4);
    const strict = rng.bool();
    const gap = q * q - p * p;
    const answer = strict ? gap - 1 : gap + 1;
    const sign = strict ? "<" : "\\le";
    return numberProblem({
      prompt: t(
        `How many whole numbers $n$ satisfy $${p} ${sign} \\sqrt{n} ${sign} ${q}$?`,
        `有多少个整数 $n$ 满足 $${p} ${sign} \\sqrt{n} ${sign} ${q}$？`,
      ),
      answer,
      form: "integer",
      wrong: [gap, strict ? gap + 1 : gap - 1, q - p, q * q, p + q],
      solution: t(
        `Squaring gives $${p * p} ${sign} n ${sign} ${q * q}$. ${strict ? `So $n$ runs from ${p * p + 1} to ${q * q - 1}` : `So $n$ runs from ${p * p} to ${q * q}, ends included`}, which is ${answer} whole numbers.`,
        `平方得 $${p * p} ${sign} n ${sign} ${q * q}$。${strict ? `所以 $n$ 从 ${p * p + 1} 到 ${q * q - 1}` : `所以 $n$ 从 ${p * p} 到 ${q * q}，包括两端`}，共 ${answer} 个整数。`,
      ),
    });
  },
};

const fencePosts: KnowledgePointDef = {
  id: "fence-posts-along-a-border",
  title: t("Fence posts along a border", "沿边界立的栅栏柱"),
  explanation: t(
    "Evenly spaced posts divide a border into equal gaps, and counting posts means counting gaps with care. On a closed loop such as the border of a field, the path returns to where it began, so there are just as many posts as gaps. On a straight line with a post at each end, there is one more post than gaps. So the perimeter is used for a loop, and the length of the line for a straight fence.",
    "等距的柱子把边界分成相等的间隔，数柱子就是要仔细地数间隔。在封闭的回路上，比如田地的边界，路径会回到起点，所以柱子数和间隔数一样多。在两端都有柱子的直线上，柱子比间隔多一根。所以回路要用周长，而直线栅栏要用线段的长度。",
  ),
  generate(rng) {
    const gap = rng.pick([2, 3, 4, 5, 6, 8, 10]);
    const length = gap * rng.int(5, 20);
    const width = gap * rng.int(2, 12);
    const closed = rng.bool();
    if (closed) {
      const perimeter = 2 * (length + width);
      const answer = perimeter / gap;
      return numberProblem({
        prompt: t(
          `A rectangular field is $${length}$ m long and $${width}$ m wide. Posts stand all the way around its border, $${gap}$ m apart, with one at each corner. How many posts are there?`,
          `一块长方形田地长 $${length}$ 米、宽 $${width}$ 米。沿边界一圈立柱子，间隔 $${gap}$ 米，每个角上都有一根。一共有多少根柱子？`,
        ),
        answer,
        form: "integer",
        wrong: [answer + 1, answer + 4, (length + width) / gap, Q.of(length * width, gap)],
        solution: t(
          `The border is $2(${length} + ${width}) = ${perimeter}$ m long. On a closed loop there are as many posts as gaps, and $${perimeter} \\div ${gap} = ${answer}$.`,
          `边界长 $2(${length} + ${width}) = ${perimeter}$ 米。封闭回路上柱子数等于间隔数，$${perimeter} \\div ${gap} = ${answer}$。`,
        ),
      });
    }
    const gaps = length / gap;
    return numberProblem({
      prompt: t(
        `A straight fence is $${length}$ m long. Posts stand along it, $${gap}$ m apart, with one at each end. How many posts are there?`,
        `一道直栅栏长 $${length}$ 米。沿栅栏立柱子，间隔 $${gap}$ 米，两端都有一根。一共有多少根柱子？`,
      ),
      answer: gaps + 1,
      form: "integer",
      wrong: [gaps, gaps - 1, gaps + 2, length - gap],
      solution: t(
        `There are $${length} \\div ${gap} = ${gaps}$ gaps. With a post at each end, a straight line has one more post than gaps, which makes $${gaps + 1}$.`,
        `共有 $${length} \\div ${gap} = ${gaps}$ 个间隔。两端都有柱子时，直线上的柱子比间隔多一根，所以是 $${gaps + 1}$ 根。`,
      ),
    });
  },
};

const squareUnits: KnowledgePointDef = {
  id: "converting-square-and-cubic-units",
  title: t("Converting square and cubic units", "换算平方单位和立方单位"),
  explanation: t(
    "A unit of area is a square, so converting it uses the length conversion twice: once along each side. A unit of volume is a cube, so its length conversion is used three times. Picturing one large square filled with small squares shows why. A single row holds as many small squares as the length conversion, and there are that many rows. Using the length conversion only once is the most common mistake here, and it gives an answer far too small.",
    "面积单位是一个正方形，所以换算时要用两次长度换算：每条边各一次。体积单位是一个立方体，所以要用三次长度换算。想象一个大正方形里铺满小正方形，就能看出原因。一行里的小正方形个数等于长度换算的系数，而这样的行也有那么多。只用一次长度换算是这里最常见的错误，得到的结果会小得多。",
  ),
  generate(rng) {
    const [big, small, bigZh, smallZh, factor] = rng.pick([
      ["m", "cm", "米", "厘米", 100],
      ["cm", "mm", "厘米", "毫米", 10],
      ["ft", "in", "英尺", "英寸", 12],
      ["yd", "ft", "码", "英尺", 3],
    ]) as [string, string, string, string, number];
    const power = rng.pick([2, 3]);
    const scale = factor ** power;
    const n = rng.int(2, 40);
    const down = rng.bool();
    const nameEn = power === 2 ? "area" : "volume";
    const nameZh = power === 2 ? "面积" : "体积";
    const unitBig = `\\text{${big}}^{${power}}`;
    const unitSmall = `\\text{${small}}^{${power}}`;
    const wordZh = power === 2 ? "平方" : "立方";
    const subjectEn = power === 2 ? "A region has" : "A tank has";
    const subjectZh = power === 2 ? "一块区域" : "一个水箱";
    if (down) {
      const answer = n * scale;
      return numberProblem({
        prompt: t(
          `${subjectEn} ${nameEn} $${n} \\ ${unitBig}$. What is this ${nameEn} in $${unitSmall}$?`,
          `${subjectZh}的${nameZh}是 $${n} \\ ${unitBig}$。这个${nameZh}是多少 $${unitSmall}$？`,
        ),
        answer,
        form: "integer",
        wrong: [n * factor, n * factor ** (5 - power), Q.of(n, scale), n * factor * power],
        solution: t(
          `One ${big} is $${factor}$ ${small}, so one $${unitBig}$ is $${factor}^{${power}} = ${scale}$ $${unitSmall}$. Then $${n} \\times ${scale} = ${answer}$.`,
          `$1$ ${bigZh}等于 $${factor}$ ${smallZh}，所以 $1$ ${wordZh}${bigZh}等于 $${factor}^{${power}} = ${scale}$ ${wordZh}${smallZh}。于是 $${n} \\times ${scale} = ${answer}$。`,
        ),
      });
    }
    const start = n * scale;
    return numberProblem({
      prompt: t(
        `${subjectEn} ${nameEn} $${start} \\ ${unitSmall}$. What is this ${nameEn} in $${unitBig}$?`,
        `${subjectZh}的${nameZh}是 $${start} \\ ${unitSmall}$。这个${nameZh}是多少 $${unitBig}$？`,
      ),
      answer: n,
      form: "integer",
      wrong: [Q.of(start, factor), Q.of(start, factor ** (5 - power)), start * scale, Q.of(start, factor * power)],
      solution: t(
        `One $${unitBig}$ is $${factor}^{${power}} = ${scale}$ $${unitSmall}$, so divide: $${start} \\div ${scale} = ${n}$.`,
        `$1$ ${wordZh}${bigZh}等于 $${factor}^{${power}} = ${scale}$ ${wordZh}${smallZh}，所以做除法：$${start} \\div ${scale} = ${n}$。`,
      ),
    });
  },
};

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
  "units-of-area-and-volume": [squareUnits],
};
