// A third knowledge point for the other 5th Grade Math topics, on fraction division, decimals, exponents,
// units, patterns and quadrilaterals: the reverse question, a size check and the usual traps.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { earlyNames } from "../early-grades-kit.ts";
import { numberProblem } from "../problems.ts";
import { choose, chooseMath, type Pair, whole } from "./early-grades-more-kit.ts";

/** skill builds a knowledge point from its texts and generator. */
const skill = (id: string, title: Pair, explanation: Pair, generate: KnowledgePointDef["generate"]): KnowledgePointDef => ({
  id,
  title: t(title[0], title[1]),
  explanation: t(explanation[0], explanation[1]),
  generate,
});

/** fraction builds a problem whose answer is a fraction, dropping wrong answers equal to it. */
const fraction = (prompt: Pair, answer: Q, wrong: readonly Q[], solution: Pair) =>
  numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    wrong: wrong.filter((w) => !w.eq(answer)),
    solution: t(solution[0], solution[1]),
  });

/** decimal builds a problem whose answer is a decimal, dropping wrong answers equal to it. */
const decimal = (prompt: Pair, answer: Q, wrong: readonly Q[], solution: Pair) =>
  numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    form: "decimal",
    wrong: wrong.filter((w) => !w.eq(answer)),
    solution: t(solution[0], solution[1]),
  });

/** frac writes a fraction in LaTeX. */
const frac = (n: number | string, d: number | string) => `\\frac{${n}}{${d}}`;

/** show writes a count of tenths, hundredths or thousandths as a decimal. */
const show = (n: number, places: number) => (n / 10 ** places).toFixed(places);

/** commas writes a whole number with thousands separators for LaTeX. */
const commas = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}");

/** placeNames names the places around the decimal point, from thousands down to thousandths. */
const placeNames: readonly (readonly [number, string, string])[] = [
  [3, "thousands", "千位"],
  [2, "hundreds", "百位"],
  [1, "tens", "十位"],
  [0, "ones", "个位"],
  [-1, "tenths", "十分位"],
  [-2, "hundredths", "百分位"],
  [-3, "thousandths", "千分位"],
];

/** placeOf finds the names of a place from its power of ten. */
const placeOf = (power: number): Pair => {
  const p = placeNames.find((x) => x[0] === power)!;
  return [p[1], p[2]];
};

/** toLarger builds the knowledge point of several equal items written in a larger metric unit. */
const toLarger = (id: string, title: Pair, item: Pair, small: Pair, big: Pair) =>
  skill(
    id,
    title,
    [
      `To write a total in a larger unit, first find the total in ${small[0]} and then divide by 1,000, which moves the decimal point three places to the left.`,
      `要用较大的单位表示总量，先求出以${small[1]}为单位的总量，再除以 1,000，也就是把小数点向左移三位。`,
    ],
    (rng) => {
      const k = rng.int(3, 24);
      const size = rng.pick([125, 150, 175, 240, 250, 320, 350, 450, 500, 750]);
      const total = k * size;
      return decimal(
        [
          `Each ${item[0]} has ${size} ${small[0]}. How many ${big[0]} do ${k} of them have in all?`,
          `每个${item[1]}有 ${size} ${small[1]}。${k} 个一共有多少${big[1]}？`,
        ],
        Q.of(total, 1000),
        [Q.of(total, 100), Q.of(total, 10000), Q.of(size, 1000)],
        [
          `$${k} \\times ${size} = ${commas(total)}$ ${small[0]}, and $${commas(total)} \\div 1000 = ${show(total, 3).replace(/0+$/, "").replace(/\.$/, "")}$ ${big[0]}.`,
          `$${k} \\times ${size} = ${commas(total)}$ ${small[1]}，$${commas(total)} \\div 1000 = ${show(total, 3).replace(/0+$/, "").replace(/\.$/, "")}$ ${big[1]}。`,
        ],
      );
    },
  );

/** deeperGrade5Third2Points holds the third knowledge points of more 5th Grade Math topics, by topic. */
export const deeperGrade5Third2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "dividing-whole-numbers-by-fractions-using-models-fractional-results": [
    skill(
      "full-groups-in-a-fractional-result",
      ["Full groups in a fractional result", "商是分数时的完整组数"],
      [
        "When a division by a fraction does not come out even, the last group is only partly filled. A story that counts full bags uses the whole part of the quotient and leaves the rest.",
        "除以分数不能整除时，最后一组只装了一部分。只数装满的袋子时，用商的整数部分，其余的舍去。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const [n, d] = rng.pick<readonly [number, number]>([
          [2, 3],
          [3, 4],
          [2, 5],
          [3, 5],
          [4, 5],
          [5, 6],
          [2, 7],
          [3, 7],
          [3, 8],
          [5, 8],
          [2, 9],
          [4, 9],
          [7, 9],
        ]);
        let k = rng.int(2, 12);
        if (k % n === 0) k += 1;
        const q = Math.floor((k * d) / n);
        return whole(
          [
            `${who} has ${k} pounds of nuts and fills bags of $${frac(n, d)}$ pound each. How many bags can be filled completely?`,
            `${who} 有 ${k} 磅坚果，每袋装 $${frac(n, d)}$ 磅。能装满多少袋？`,
          ],
          q,
          [q + 1, k * d, k * n],
          [
            `$${k} \\div ${frac(n, d)} = ${frac(k * d, n)}$, which is ${q} and a part, so ${q} bags are full.`,
            `$${k} \\div ${frac(n, d)} = ${frac(k * d, n)}$，即 ${q} 又一部分，所以装满 ${q} 袋。`,
          ],
        );
      },
    ),
  ],
  "dividing-fractions-by-whole-numbers-using-models": [
    skill(
      "the-amount-from-its-shares",
      ["The amount from its shares", "由每份求总量"],
      [
        "A model of a share can be read backwards. Equal shares put together give the amount that was divided, so multiply the share by the number of shares and simplify.",
        "表示一份的模型可以倒过来读。相等的几份合起来就是被分的量，所以把一份乘份数再约分。",
      ],
      (rng) => {
        const d = rng.int(3, 15);
        const n = rng.int(1, 5);
        const k = rng.int(2, 6);
        return fraction(
          [
            `A model is split into ${k} equal shares, and each share is $${frac(n, d)}$ of the bar. What fraction of the bar did the model start with?`,
            `一个模型分成 ${k} 等份，每份是长条的 $${frac(n, d)}$。模型开始时是长条的几分之几？`,
          ],
          Q.of(n * k, d),
          [Q.of(n, d * k), Q.of(n + k, d), Q.of(n, d)],
          [`$${k} \\times ${frac(n, d)} = ${frac(n * k, d)}$.`, `$${k} \\times ${frac(n, d)} = ${frac(n * k, d)}$。`],
        );
      },
    ),
  ],
  "dividing-fractions-by-whole-numbers": [
    skill(
      "the-missing-whole-divisor",
      ["The missing whole divisor", "缺少的整数除数"],
      [
        "Dividing a fraction by a whole number multiplies its denominator by that number. So a missing divisor is the factor by which the denominator has grown from one side to the other.",
        "分数除以整数，就是分母乘这个整数。所以缺少的除数就是分母变大的倍数。",
      ],
      (rng) => {
        const b = rng.int(2, 12);
        const a = rng.int(1, 9);
        const k = rng.int(2, 12);
        return whole(
          [
            `Fill in the box: $$${frac(a, b)} \\div \\square = ${frac(a, b * k)}$$`,
            `填方框：$$${frac(a, b)} \\div \\square = ${frac(a, b * k)}$$`,
          ],
          k,
          [b * k, b, a * k],
          [`The denominator grew from ${b} to ${b * k}, which is ${k} times as large.`, `分母从 ${b} 变成 ${b * k}，是原来的 ${k} 倍。`],
        );
      },
    ),
  ],
  "dividing-fractions-using-models": [
    skill(
      "a-quotient-below-one",
      ["A quotient below one", "小于 1 的商"],
      [
        "A quotient asks how many of the second fraction fit in the first. If the first is smaller than the second, not even one fits, so the quotient is less than 1.",
        "商表示第一个分数里有几个第二个分数。第一个比第二个小时，连一个都放不下，所以商小于 1。",
      ],
      (rng) => {
        const pool: readonly [number, number][] = [
          [1, 2],
          [1, 3],
          [2, 3],
          [1, 4],
          [3, 4],
          [1, 5],
          [2, 5],
          [3, 5],
          [4, 5],
          [1, 6],
          [5, 6],
        ];
        const [p, q, r, s] = rng.sample(pool, 4) as [[number, number], [number, number], [number, number], [number, number]];
        const v = (x: [number, number]) => x[0] / x[1];
        const small = v(p) < v(q) ? p : q;
        const large = v(p) < v(q) ? q : p;
        const big2 = (x: [number, number], y: [number, number]) =>
          v(x) > v(y) ? `${frac(x[0], x[1])} \\div ${frac(y[0], y[1])}` : `${frac(y[0], y[1])} \\div ${frac(x[0], x[1])}`;
        return chooseMath(
          rng,
          ["Which quotient is less than 1?", "哪个商小于 1？"],
          `${frac(small[0], small[1])} \\div ${frac(large[0], large[1])}`,
          [`${frac(large[0], large[1])} \\div ${frac(small[0], small[1])}`, big2(r, s), big2(p, r)],
          [
            `$${frac(small[0], small[1])}$ is smaller than $${frac(large[0], large[1])}$, so less than one group fits. In the others, the first fraction is the larger.`,
            `$${frac(small[0], small[1])}$ 小于 $${frac(large[0], large[1])}$，所以放不下一组。其他的都是第一个分数较大。`,
          ],
        );
      },
    ),
  ],
  "the-place-value-system-with-decimals": [
    skill(
      "how-many-times-as-large-a-digit-is",
      ["How many times as large a digit is", "同一数字的值相差多少倍"],
      [
        "Each place to the left is worth ten times as much. So the same digit two places further left is worth a hundred times as much, whichever side of the decimal point it is on.",
        "每向左一位，值变成十倍。所以同样的数字向左两位，值就是一百倍，无论在小数点哪一边。",
      ],
      (rng) => {
        const d = rng.int(1, 9);
        const other = (d % 9) + 1;
        const ones = ((d + 1) % 9) + 1;
        const last = rng.int(1, 3);
        const text = last === 3 ? `${d}.${other}${other}${d}` : last === 2 ? `${ones}.${d}${other}${d}` : `${ones}.${d}${d}${other}`;
        return whole(
          [
            `In $${text}$, how many times as large is the value of the first ${d} as the value of the second ${d}?`,
            `在 $${text}$ 中，第一个 ${d} 的值是第二个 ${d} 的多少倍？`,
          ],
          10 ** last,
          [10 ** (last + 1), last === 1 ? 2 : 10 ** (last - 1), d],
          [
            `The two ${d}s are ${last} place${last > 1 ? "s" : ""} apart, and each place is worth ten times the next: $${commas(10 ** last)}$.`,
            `两个 ${d} 相隔 ${last} 位，每一位都是下一位的十倍：$${commas(10 ** last)}$ 倍。`,
          ],
        );
      },
    ),
  ],
  "reading-and-writing-decimals-written-in-words": [
    skill(
      "and-marks-the-point",
      ["The word and marks the point", "“又”标出小数点"],
      [
        "In English the word and marks the decimal point, and the last word names the place of the final digit. So twelve and six thousandths needs zeros in the tenths and hundredths places.",
        "读小数时，“又”标出小数点，最后的词说明最后一位数字的数位。所以十二又千分之六的十分位和百分位要写 0。",
      ],
      (rng) => {
        const w = rng.int(2, 19);
        const words = [
          "",
          "one",
          "two",
          "three",
          "four",
          "five",
          "six",
          "seven",
          "eight",
          "nine",
          "ten",
          "eleven",
          "twelve",
          "thirteen",
          "fourteen",
          "fifteen",
          "sixteen",
          "seventeen",
          "eighteen",
          "nineteen",
        ];
        const zh = [
          "",
          "一",
          "二",
          "三",
          "四",
          "五",
          "六",
          "七",
          "八",
          "九",
          "十",
          "十一",
          "十二",
          "十三",
          "十四",
          "十五",
          "十六",
          "十七",
          "十八",
          "十九",
        ];
        const n = rng.int(1, 9);
        return chooseMath(
          rng,
          [`Write "${words[w]} and ${words[n]} thousandths" as a decimal.`, `把“${zh[w]}又千分之${zh[n]}”写成小数。`],
          `${w}.00${n}`,
          [`${w}.${n}`, `${w}.0${n}`, `${w}{,}00${n}`],
          [
            `Thousandths are three places after the point, so the ${n} is in the third place: $${w}.00${n}$.`,
            `千分位是小数点后第三位，所以 ${n} 在第三位：$${w}.00${n}$。`,
          ],
        );
      },
    ),
  ],
  "converting-decimals-from-standard-to-expanded-form": [
    skill(
      "a-missing-term-of-an-expanded-decimal",
      ["A missing term of an expanded decimal", "小数展开式中缺少的项"],
      [
        "Each term of an expanded form is one digit at its own value. So a missing term can be read directly from the digit in the missing place, without any calculation.",
        "展开式的每一项是一个数字在它所在数位上的值。所以缺少的项可以直接从相应数位读出，不需要计算。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const x = rng.int(1, 9);
        const y = rng.int(1, 9);
        const z = rng.int(1, 9);
        const text = `${a}.${x}${y}${z}`;
        const k = rng.int(0, 2);
        const terms = [`0.${x}`, `0.0${y}`, `0.00${z}`];
        const shown = terms.map((s, i) => (i === k ? "\\square" : s)).join(" + ");
        const answer = Q.of([x, y, z][k]!, 10 ** (k + 1));
        return decimal(
          [`Fill in the box: $$${text} = ${a} + ${shown}$$`, `填方框：$$${text} = ${a} + ${shown}$$`],
          answer,
          [Q.of([x, y, z][k]!, 1), Q.of([x, y, z][k]!, 10 ** (k === 2 ? 2 : k + 2))],
          [
            `The digit ${[x, y, z][k]} is in the ${placeOf(-k - 1)[0]} place, so its value is $${terms[k]}$.`,
            `数字 ${[x, y, z][k]} 在${placeOf(-k - 1)[1]}，所以它的值是 $${terms[k]}$。`,
          ],
        );
      },
    ),
  ],
  "converting-decimals-from-expanded-to-standard-form": [
    skill(
      "regrouping-tenths-in-an-expanded-form",
      ["Regrouping tenths", "把十分之几重新组合"],
      [
        "A count of ten or more tenths cannot sit in one place. Ten tenths trade for one whole, so the extra goes to the ones place and only the rest remains in the tenths place.",
        "十个或更多的十分之一不能放在同一位。10 个十分之一换成 1 个一，所以多出来的进到个位，只留下其余的在十分位。",
      ],
      (rng) => {
        const a = rng.int(1, 30);
        const tenths = rng.int(11, 39);
        const h = rng.int(1, 9);
        const total = a * 100 + tenths * 10 + h;
        return decimal(
          [
            `Write $${a}$ ones, ${tenths} tenths and ${h} hundredths as a decimal.`,
            `把 ${a} 个一、${tenths} 个十分之一和 ${h} 个百分之一写成小数。`,
          ],
          Q.of(total, 100),
          [Q.of(a * 1000 + tenths * 10 + h, 1000), Q.of(a * 100 + tenths + h, 100), Q.of(total, 10)],
          [
            `${tenths} tenths are ${show(tenths, 1)}, and $${a} + ${show(tenths, 1)} + 0.0${h} = ${show(total, 2)}$.`,
            `${tenths} 个十分之一是 ${show(tenths, 1)}，$${a} + ${show(tenths, 1)} + 0.0${h} = ${show(total, 2)}$。`,
          ],
        );
      },
    ),
  ],
  "equivalent-decimals": [
    skill(
      "the-decimal-that-is-not-equal",
      ["The decimal that is not equal", "不相等的小数"],
      [
        "Zeros at the far right of a decimal change nothing, but a zero placed right after the point pushes every digit down one place. So 8.50 equals 8.5, while 8.05 does not.",
        "小数末尾的零不改变值，但紧跟在小数点后的零会把每个数字都向右推一位。所以 8.50 等于 8.5，而 8.05 不等。",
      ],
      (rng) => {
        const a = rng.int(1, 60);
        const x = rng.int(1, 9);
        return chooseMath(
          rng,
          [`Which decimal is not equal to $${a}.${x}$?`, `哪个小数不等于 $${a}.${x}$？`],
          `${a}.0${x}`,
          [`${a}.${x}0`, `${a}.${x}00`, `${a}.${x}000`],
          [
            `$${a}.0${x}$ has ${x} in the hundredths place, not the tenths place. Zeros at the far right do not change a value.`,
            `$${a}.0${x}$ 的 ${x} 在百分位，不在十分位。末尾的零不改变值。`,
          ],
        );
      },
    ),
  ],
  "rounding-down-decimals": [
    skill(
      "the-largest-decimal-that-rounds-down",
      ["The largest decimal that rounds down", "能舍去的最大小数"],
      [
        "A decimal rounds down to a tenth when the next digit is below 5. So among decimals with two places, the largest one that rounds down has a 4 in the hundredths place.",
        "下一位小于 5 时，小数舍到十分位。所以两位小数中，能舍去的最大数百分位是 4。",
      ],
      (rng) => {
        const a = rng.int(1, 80);
        const x = rng.int(1, 9);
        const start = a * 100 + x * 10;
        return decimal(
          [
            `A decimal with two places rounds down to $${a}.${x}$ at the nearest tenth. What is the largest it could be?`,
            `一个两位小数四舍五入到十分位后舍成 $${a}.${x}$。它最大是多少？`,
          ],
          Q.of(start + 4, 100),
          [Q.of(start + 5, 100), Q.of(start + 9, 100), Q.of(start, 100)],
          [
            `$${show(start + 5, 2)}$ would round up, so the largest is $${show(start + 4, 2)}$.`,
            `$${show(start + 5, 2)}$ 要入，所以最大是 $${show(start + 4, 2)}$。`,
          ],
        );
      },
    ),
  ],
  "estimating-decimal-addition-and-subtraction": [
    skill(
      "whether-an-estimate-is-too-high",
      ["Whether an estimate is too high", "估算值是否偏大"],
      [
        "The direction of rounding tells whether an estimate is too high. A sum rounded up in both numbers is too high, and a sum rounded down in both is too low.",
        "取整的方向说明估算值是否偏大。两个加数都向上取整，和偏大；都向下取整，和偏小。",
      ],
      (rng) => {
        const a = rng.int(5, 90);
        const b = rng.int(5, 90);
        const up = rng.bool();
        const x = up ? rng.int(6, 9) : rng.int(1, 4);
        const y = up ? rng.int(6, 9) : rng.int(1, 4);
        const est = up ? a + b + 2 : a + b;
        return choose(
          rng,
          [
            `Rounding each number to the nearest whole number estimates $${a}.${x} + ${b}.${y}$ as ${est}. How does the estimate compare with the exact sum?`,
            `把每个数四舍五入到整数，估算 $${a}.${x} + ${b}.${y}$ 得 ${est}。估算值与准确值相比如何？`,
          ],
          up ? ["Greater than the exact sum", "大于准确值"] : ["Less than the exact sum", "小于准确值"],
          [
            up ? ["Less than the exact sum", "小于准确值"] : ["Greater than the exact sum", "大于准确值"],
            ["Equal to the exact sum", "等于准确值"],
          ],
          up
            ? [`Both numbers were rounded up, so the estimate is too high.`, `两个数都向上取整，所以估算值偏大。`]
            : [`Both numbers were rounded down, so the estimate is too low.`, `两个数都向下取整，所以估算值偏小。`],
        );
      },
    ),
  ],
  "adding-decimals": [
    skill(
      "the-decimal-that-makes-a-whole",
      ["The decimal that makes a whole", "凑成整数的小数"],
      [
        "To make a whole number, the digits after the point must carry all the way up. The hundredths must make 10, and the tenths then must make 9 with the carry included.",
        "要凑成整数，小数点后的数字必须一路进位。百分位相加要得 10，十分位加上进位也要得 10，所以十分位相加得 9。",
      ],
      (rng) => {
        const a = rng.int(101, 999);
        const up = Math.ceil(a / 100);
        return decimal(
          [`What must be added to $${show(a, 2)}$ to make ${up}?`, `$${show(a, 2)}$ 加上多少等于 ${up}？`],
          Q.of(up * 100 - a, 100),
          [Q.of(a % 100, 100), Q.of(up * 100 - a + 10, 100), Q.of(up * 100 - a, 10)],
          [
            `$${up} - ${show(a, 2)} = ${show(up * 100 - a, 2)}$, and adding it back gives ${up}.`,
            `$${up} - ${show(a, 2)} = ${show(up * 100 - a, 2)}$，加回去得 ${up}。`,
          ],
        );
      },
    ),
  ],
  "addition-with-unequal-numbers-of-decimals": [
    skill(
      "lining-up-the-points",
      ["Lining up the points", "小数点对齐"],
      [
        "Adding by place means lining up decimal points, not right-hand digits. A number with fewer places can be filled out with zeros, so that tenths add to tenths and hundredths to hundredths.",
        "按数位相加要对齐小数点，而不是对齐最右边的数字。位数少的数可以补零，使十分位加十分位，百分位加百分位。",
      ],
      (rng) => {
        const a = rng.int(11, 99);
        const b = rng.int(101, 999);
        const right = a + b * 10;
        return chooseMath(
          rng,
          [`Which is the correct value of $${show(a, 2)} + ${show(b, 1)}$?`, `$${show(a, 2)} + ${show(b, 1)}$ 的正确值是哪个？`],
          show(right, 2),
          [show(a + b, 2), show(a + b, 1), show(a * 10 + b * 10 + 1, 2)],
          [
            `Write $${show(b, 1)}$ as $${show(b * 10, 2)}$ so the points line up: $${show(a, 2)} + ${show(b * 10, 2)} = ${show(right, 2)}$. Lining up the right-hand digits gives $${show(a + b, 2)}$.`,
            `把 $${show(b, 1)}$ 写成 $${show(b * 10, 2)}$，使小数点对齐：$${show(a, 2)} + ${show(b * 10, 2)} = ${show(right, 2)}$。对齐最右边的数字会得到 $${show(a + b, 2)}$。`,
          ],
        );
      },
    ),
  ],
  "estimating-decimal-addition-with-benchmarks": [
    skill(
      "the-sum-that-is-above-one",
      ["The sum that is above one", "大于 1 的和"],
      [
        "Two decimals above 0.5 must add to more than 1, and two below 0.5 must add to less. Comparing with this benchmark settles the question without working out the sum.",
        "两个大于 0.5 的小数相加一定大于 1，两个小于 0.5 的相加一定小于 1。用这个基准比较，不必算出和就能判断。",
      ],
      (rng) => {
        const high = () => rng.int(52, 95);
        const low = () => rng.int(11, 48);
        return chooseMath(
          rng,
          ["Which sum must be greater than 1?", "哪个和一定大于 1？"],
          `0.${high()} + 0.${high()}`,
          [`0.${low()} + 0.${low()}`, `0.${low()} + 0.${low()}`, `0.${low()} + 0.${low()}`],
          [
            "Only that sum has both numbers above 0.5. In the others, both numbers are below 0.5, so the sum is below 1.",
            "只有这个和的两个数都大于 0.5。其他的两个数都小于 0.5，所以和小于 1。",
          ],
        );
      },
    ),
  ],
  "estimating-decimal-subtraction-with-benchmarks": [
    skill(
      "the-difference-close-to-one-half",
      ["The difference close to one half", "接近二分之一的差"],
      [
        "Rounding each number to 0, 0.5 or 1 shows the size of a difference at a glance. A number near 1 minus one near 0.5 is near 0.5, while two numbers near the same benchmark differ by almost 0.",
        "把每个数取整到 0、0.5 或 1，差的大小一眼可见。接近 1 的数减接近 0.5 的数约为 0.5，而接近同一基准的两个数相差约为 0。",
      ],
      (rng) => {
        const nearOne = () => rng.int(91, 99);
        const nearHalf = () => rng.int(46, 54);
        const nearZero = () => `0${rng.int(2, 8)}`;
        return chooseMath(
          rng,
          ["Which difference is closest to 0.5?", "哪个差最接近 0.5？"],
          `0.${nearOne()} - 0.${nearHalf()}`,
          [`0.${nearOne()} - 0.${nearZero()}`, `0.${nearOne()} - 0.${rng.int(85, 90)}`, `0.${nearHalf()} - 0.${rng.int(40, 45)}`],
          [
            "A number near 1 minus a number near 0.5 is near 0.5. The others are near 1 or near 0.",
            "接近 1 的数减接近 0.5 的数约为 0.5。其他的约为 1 或 0。",
          ],
        );
      },
    ),
  ],
  "multiplying-decimals-by-powers-of-ten-using-place-value": [
    skill(
      "where-a-digit-lands-after-multiplying",
      ["Where a digit lands after multiplying", "乘后数字落在哪一位"],
      [
        "Multiplying by 10 moves every digit one place to the left, and each further factor of 10 moves it one place more. So a digit's new place can be named without working out the product.",
        "乘 10 时每个数字向左移一位，每多乘一个 10 就再移一位。所以不必算出积，也能说出数字的新数位。",
      ],
      (rng) => {
        const start = rng.int(-3, -1);
        const p = rng.int(1, 3);
        const n = rng.int(1, 9);
        const digit = rng.int(2, 9);
        const text = start === -1 ? `${n}.${digit}` : start === -2 ? `${n}.1${digit}` : `${n}.12${digit}`;
        const land = placeOf(start + p);
        const wrongs = [placeOf(start), placeOf(Math.min(start + p + 1, 3)), placeOf(Math.max(start + p - 1, -3))].filter(
          (w, i, all) => w[0] !== land[0] && all.findIndex((v) => v[0] === w[0]) === i,
        );
        const options = placeNames.map((x): Pair => [x[1], x[2]]).filter((x) => x[0] !== land[0] && !wrongs.some((w) => w[0] === x[0]));
        return choose(
          rng,
          [
            `In $${text}$, the digit ${digit} is in the ${placeOf(start)[0]} place. Which place is it in after multiplying by $${commas(10 ** p)}$?`,
            `在 $${text}$ 中，数字 ${digit} 在${placeOf(start)[1]}。乘 $${commas(10 ** p)}$ 后它在哪一位？`,
          ],
          [`The ${land[0]} place`, land[1]],
          [...wrongs, ...options].slice(0, 3).map((w): Pair => [`The ${w[0]} place`, w[1]]),
          [
            `$${commas(10 ** p)}$ moves each digit ${p} place${p > 1 ? "s" : ""} to the left, from the ${placeOf(start)[0]} to the ${land[0]}.`,
            `$${commas(10 ** p)}$ 使每个数字向左移 ${p} 位，从${placeOf(start)[1]}到${land[1]}。`,
          ],
        );
      },
    ),
  ],
  "multiplying-decimals-by-powers-of-ten-using-decimal-point-placement": [
    skill(
      "the-number-before-multiplying",
      ["The number before multiplying", "乘之前的数"],
      [
        "Moving the point to the right multiplies by a power of ten, so moving it back to the left undoes that. A missing number is found by moving the point the other way.",
        "小数点右移是乘 10 的幂，所以左移可以还原。缺少的数只要把小数点反方向移动就能求出。",
      ],
      (rng) => {
        const n = rng.int(11, 999);
        const places = rng.int(1, 3);
        const p = rng.int(1, 3);
        const product = Q.of(n * 10 ** p, 10 ** places);
        const answer = Q.of(n, 10 ** places);
        const productText = (n * 10 ** p) / 10 ** places;
        return decimal(
          [
            `Find the missing number: $$\\square \\times ${commas(10 ** p)} = ${String(productText).includes(".") ? productText : commas(productText)}$$`,
            `求缺少的数：$$\\square \\times ${commas(10 ** p)} = ${String(productText).includes(".") ? productText : commas(productText)}$$`,
          ],
          answer,
          [product.mul(Q.of(10 ** p, 1)), answer.mul(Q.of(10, 1)), answer.mul(Q.of(1, 10))],
          [
            `Undo the multiplication by moving the point ${p} place${p > 1 ? "s" : ""} to the left: $${show(n, places)}$.`,
            `把小数点向左移 ${p} 位来还原：$${show(n, places)}$。`,
          ],
        );
      },
    ),
  ],
  "estimating-decimal-multiplication": [
    skill(
      "the-product-of-about-the-right-size",
      ["The product of about the right size", "大小合适的积"],
      [
        "An estimate shows where the decimal point belongs. Moving the point in one factor changes the product by a factor of ten, so only one placement is near the estimate.",
        "估算可以说明小数点的位置。移动一个因数的小数点，积就变化十倍，所以只有一种放法接近估算值。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const x = a * 10 + rng.pick([-1, 1, 2, -2]);
        const y = b * 10 + rng.pick([-1, 1, 2, -2]);
        const target = a * b;
        return chooseMath(
          rng,
          [`Which product is about ${target}?`, `哪个积约等于 ${target}？`],
          `${show(x, 1)} \\times ${show(y, 1)}`,
          [`${show(x, 2)} \\times ${show(y, 1)}`, `${x} \\times ${show(y, 1)}`, `${show(x, 2)} \\times ${show(y, 2)}`],
          [
            `$${show(x, 1)}$ is about ${a} and $${show(y, 1)}$ is about ${b}, and $${a} \\times ${b} = ${target}$.`,
            `$${show(x, 1)}$ 约等于 ${a}，$${show(y, 1)}$ 约等于 ${b}，$${a} \\times ${b} = ${target}$。`,
          ],
        );
      },
    ),
  ],
  "multiplying-a-decimal-by-a-one-digit-whole-number": [
    skill(
      "change-from-a-purchase",
      ["Change from a purchase", "购物找零"],
      [
        "Many money problems take two steps with decimals. Multiply the price by the number of items to get the cost, and then subtract the cost from what was paid.",
        "很多与钱有关的问题要用小数分两步做。单价乘件数得到总价，再从付的钱中减去总价。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const price = rng.int(105, 975);
        const k = rng.int(2, 9);
        const cost = price * k;
        const pay = (Math.floor(cost / 1000) + 1) * 1000 + rng.pick([0, 1000]);
        return decimal(
          [
            `${who} buys ${k} notebooks at ${show(price, 2)} dollars each and pays with ${pay / 100} dollars. How many dollars of change are due?`,
            `${who} 买了 ${k} 本笔记本，每本 ${show(price, 2)} 美元，付了 ${pay / 100} 美元。应找回多少美元？`,
          ],
          Q.of(pay - cost, 100),
          [Q.of(cost, 100), Q.of(pay - price, 100), Q.of(pay - cost + 100, 100)],
          [
            `The cost is $${k} \\times ${show(price, 2)} = ${show(cost, 2)}$, and $${pay / 100} - ${show(cost, 2)} = ${show(pay - cost, 2)}$.`,
            `总价是 $${k} \\times ${show(price, 2)} = ${show(cost, 2)}$，$${pay / 100} - ${show(cost, 2)} = ${show(pay - cost, 2)}$。`,
          ],
        );
      },
    ),
  ],
  "multiplying-two-digit-decimals-by-three-digit-decimals": [
    skill(
      "decimal-places-in-a-product",
      ["Decimal places in a product", "积的小数位数"],
      [
        "Before any final zeros are dropped, a product has as many decimal places as its factors have together. This count places the point, and final zeros can be dropped afterward.",
        "在去掉末尾的零之前，积的小数位数等于两个因数小数位数之和。用它确定小数点的位置，之后再去掉末尾的零。",
      ],
      (rng) => {
        const p = rng.int(1, 3);
        const q = rng.int(1, 3);
        const a = rng.int(11, 99) * 10 + rng.int(1, 9);
        const b = rng.int(11, 99);
        return whole(
          [
            `How many decimal places does $${show(a, p)} \\times ${show(b, q)}$ have, before any final zeros are dropped?`,
            `$${show(a, p)} \\times ${show(b, q)}$ 在去掉末尾的零之前有几位小数？`,
          ],
          p + q,
          [Math.max(p, q), p * q === p + q ? p + q + 1 : p * q, p + q + 1],
          [
            `The factors have ${p} and ${q} places, and $${p} + ${q} = ${p + q}$.`,
            `两个因数分别有 ${p} 位和 ${q} 位小数，$${p} + ${q} = ${p + q}$。`,
          ],
        );
      },
    ),
  ],
  "multiplying-three-digit-decimals": [
    skill(
      "using-a-whole-number-product",
      ["Using a whole-number product", "利用整数的积"],
      [
        "A decimal product has the same digits as the whole-number product of the same digits. Only the position of the point differs, and it is fixed by counting the decimal places.",
        "小数的积与相同数字的整数积有相同的数字。只有小数点的位置不同，它由小数位数决定。",
      ],
      (rng) => {
        const a = rng.int(101, 999);
        const b = rng.int(101, 999);
        const p = rng.int(1, 2);
        const q = rng.int(1, 2);
        const product = a * b;
        return chooseMath(
          rng,
          [
            `Given $${a} \\times ${b} = ${commas(product)}$, find $${show(a, p)} \\times ${show(b, q)}$.`,
            `已知 $${a} \\times ${b} = ${commas(product)}$，求 $${show(a, p)} \\times ${show(b, q)}$。`,
          ],
          show(product, p + q),
          [show(product, p + q + 1), show(product, p + q - 1), show(product, p + q + 2)],
          [
            `There are $${p} + ${q} = ${p + q}$ decimal places, so the point goes ${p + q} places from the right.`,
            `一共有 $${p} + ${q} = ${p + q}$ 位小数，所以小数点从右数第 ${p + q} 位。`,
          ],
        );
      },
    ),
  ],
  "dividing-decimals-by-powers-of-ten-using-place-value": [
    skill(
      "where-a-digit-lands-after-dividing",
      ["Where a digit lands after dividing", "除后数字落在哪一位"],
      [
        "Dividing by 10 moves every digit one place to the right, and each further factor of 10 moves it one place more. Naming the new place is a quick check on the point's position.",
        "除以 10 时每个数字向右移一位，每多除一个 10 就再移一位。说出新数位可以快速检验小数点的位置。",
      ],
      (rng) => {
        const start = rng.int(0, 3);
        const p = rng.int(1, 3);
        const digit = rng.int(2, 9);
        const rest = "1".repeat(start);
        const text = commas(Number(`${digit}${rest}`));
        const land = placeOf(start - p);
        const others = placeNames
          .map((x): Pair => [x[1], x[2]])
          .filter((x) => x[0] !== land[0])
          .sort(
            (x, y) =>
              Math.abs(placeNames.findIndex((z) => z[1] === x[0]) - (3 - (start - p))) -
              Math.abs(placeNames.findIndex((z) => z[1] === y[0]) - (3 - (start - p))),
          )
          .slice(0, 3);
        return choose(
          rng,
          [
            `In $${text}$, the digit ${digit} is in the ${placeOf(start)[0]} place. Which place is it in after dividing by $${commas(10 ** p)}$?`,
            `在 $${text}$ 中，数字 ${digit} 在${placeOf(start)[1]}。除以 $${commas(10 ** p)}$ 后它在哪一位？`,
          ],
          [`The ${land[0]} place`, land[1]],
          others.map((w): Pair => [`The ${w[0]} place`, w[1]]),
          [
            `$${commas(10 ** p)}$ moves each digit ${p} place${p > 1 ? "s" : ""} to the right, from the ${placeOf(start)[0]} to the ${land[0]}.`,
            `$${commas(10 ** p)}$ 使每个数字向右移 ${p} 位，从${placeOf(start)[1]}到${land[1]}。`,
          ],
        );
      },
    ),
  ],
  "dividing-decimals-by-powers-of-ten-using-decimal-point-placement": [
    skill(
      "the-number-before-dividing",
      ["The number before dividing", "除之前的数"],
      [
        "Dividing by a power of ten moves the point to the left, and multiplying moves it back. So a number that was divided can be recovered by moving the point to the right.",
        "除以 10 的幂时小数点左移，乘就把它移回来。所以被除数可以通过把小数点右移求出。",
      ],
      (rng) => {
        const n = rng.int(11, 999);
        const places = rng.int(1, 4);
        const p = rng.int(1, 3);
        const quotient = show(n, places);
        const answer = Q.of(n * 10 ** p, 10 ** places);
        return decimal(
          [
            `Find the missing number: $$\\square \\div ${commas(10 ** p)} = ${quotient}$$`,
            `求缺少的数：$$\\square \\div ${commas(10 ** p)} = ${quotient}$$`,
          ],
          answer,
          [Q.of(n, 10 ** (places + p)), Q.of(n * 10 ** (p + 1), 10 ** places), Q.of(n, 10 ** places)],
          [
            `Multiply back by $${commas(10 ** p)}$: the point moves ${p} place${p > 1 ? "s" : ""} to the right.`,
            `乘回 $${commas(10 ** p)}$：小数点向右移 ${p} 位。`,
          ],
        );
      },
    ),
  ],
  "estimating-decimal-division": [
    skill(
      "the-quotient-of-about-the-right-size",
      ["The quotient of about the right size", "大小合适的商"],
      [
        "Compatible numbers show about how large a quotient is, and so where its point belongs. Dividing by a decimal below 1 makes a quotient larger than the number being divided.",
        "相容数可以说明商的大小，从而确定小数点的位置。除以小于 1 的小数，商比被除数大。",
      ],
      (rng) => {
        const q = rng.int(3, 9);
        const d = rng.int(2, 9);
        const dd = d * 10 + rng.pick([-1, 1, 2]);
        const nn = q * d * 10 + rng.pick([-2, -1, 1, 2]);
        return chooseMath(
          rng,
          [`Which quotient is about ${q}?`, `哪个商约等于 ${q}？`],
          `${show(nn, 1)} \\div ${show(dd, 1)}`,
          [`${show(nn, 2)} \\div ${show(dd, 1)}`, `${nn} \\div ${show(dd, 1)}`, `${show(nn, 1)} \\div ${show(dd, 2)}`],
          [
            `$${show(nn, 1)} \\div ${show(dd, 1)}$ is about $${q * d} \\div ${d} = ${q}$.`,
            `$${show(nn, 1)} \\div ${show(dd, 1)}$ 约等于 $${q * d} \\div ${d} = ${q}$。`,
          ],
        );
      },
    ),
  ],
  "dividing-decimals-using-place-value-strategies": [
    skill(
      "pieces-measured-in-a-smaller-unit",
      ["Pieces measured in a smaller unit", "用较小单位表示每段长度"],
      [
        "A decimal length can be divided first and then converted, or converted first and then divided. Using centimeters turns a decimal division into a whole-number division, which is often easier.",
        "小数长度可以先除再换算，也可以先换算再除。换成厘米后，小数除法变成整数除法，通常更容易。",
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const each = rng.int(2, 40) * 5;
        const total = k * each;
        return whole(
          [
            `A rope $${show(total, 2)}$ meters long is cut into ${k} equal pieces. How many centimeters long is each piece?`,
            `一根 $${show(total, 2)}$ 米长的绳子剪成 ${k} 段相等的。每段多少厘米？`,
          ],
          each,
          [total, Math.round(each / 10) === each ? each + 1 : Math.round(each / 10), each * 10],
          [
            `$${show(total, 2)}$ meters is ${total} centimeters, and $${total} \\div ${k} = ${each}$.`,
            `$${show(total, 2)}$ 米是 ${total} 厘米，$${total} \\div ${k} = ${each}$。`,
          ],
        );
      },
    ),
  ],
  "division-of-whole-numbers-with-decimal-quotients": [
    skill(
      "a-fraction-as-a-terminating-decimal",
      ["A fraction as a decimal", "把分数写成小数"],
      [
        "A fraction is a division waiting to be done. Dividing the top by the bottom and adding zeros after the point gives its decimal form, and eighths need three places.",
        "分数就是还没做的除法。分子除以分母，在小数点后添零，就得到它的小数形式；八分之几需要三位小数。",
      ],
      (rng) => {
        const d = rng.pick([4, 8, 8, 16, 20, 25, 40]);
        const n = rng.int(1, d - 1);
        return decimal(
          [`Write $${frac(n, d)}$ as a decimal.`, `把 $${frac(n, d)}$ 写成小数。`],
          Q.of(n, d),
          [Q.of(d, n), Q.of(n, 10), Q.of(n, 100)],
          [
            `Divide ${n} by ${d}, adding zeros after the point: $${n} \\div ${d} = ${String(n / d)}$.`,
            `用 ${n} 除以 ${d}，在小数点后添零：$${n} \\div ${d} = ${String(n / d)}$。`,
          ],
        );
      },
    ),
  ],
  "division-of-whole-numbers-with-decimal-quotients-and-rounding": [
    skill(
      "a-bill-to-the-nearest-cent",
      ["A bill to the nearest cent", "账单精确到美分"],
      [
        "A share of money that does not come out even is rounded to the nearest cent, which is the nearest hundredth of a dollar. So the third decimal place decides the rounding.",
        "分不尽的钱要四舍五入到最接近的美分，也就是百分之一美元。所以第三位小数决定如何取舍。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const k = rng.pick([3, 7, 9, 11, 13]);
        let bill = rng.int(10, 120);
        if (bill % k === 0) bill += 1;
        const cents = Math.round((bill * 100) / k);
        return decimal(
          [
            `${who} and friends, ${k} people in all, split a bill of ${bill} dollars equally. To the nearest cent, how many dollars does each pay?`,
            `${who} 和朋友共 ${k} 人平分 ${bill} 美元的账单。精确到美分，每人付多少美元？`,
          ],
          Q.of(cents, 100),
          [Q.of(cents + 1, 100), Q.of(Math.round(cents / 10), 10), Q.of(cents - 1, 100)],
          [
            `$${bill} \\div ${k} = ${(Math.floor((bill * 1000) / k) / 1000).toFixed(3)}\\ldots$, and the third decimal place rounds this to ${show(cents, 2)}.`,
            `$${bill} \\div ${k} = ${(Math.floor((bill * 1000) / k) / 1000).toFixed(3)}\\ldots$，看第三位小数，取整为 ${show(cents, 2)}。`,
          ],
        );
      },
    ),
  ],
  "dividing-four-digit-and-five-digit-decimals": [
    skill(
      "the-whole-number-divisor-version",
      ["The version with a whole-number divisor", "把除数变成整数"],
      [
        "Moving the point in both numbers by the same number of places keeps a quotient the same, since both are multiplied by the same power of ten. Choose the move that makes the divisor whole.",
        "两个数的小数点移动相同的位数，商不变，因为它们乘了同一个 10 的幂。要移动到除数变成整数。",
      ],
      (rng) => {
        const a = rng.int(1001, 9999);
        const b = rng.int(11, 99);
        const p = rng.int(1, 2);
        return chooseMath(
          rng,
          [
            `Which division has the same quotient as $${show(a, p)} \\div ${show(b, 1)}$ and a whole-number divisor?`,
            `哪个除法与 $${show(a, p)} \\div ${show(b, 1)}$ 的商相同，且除数是整数？`,
          ],
          `${show(a, p - 1)} \\div ${b}`,
          [`${show(a, p)} \\div ${b}`, `${show(a, p + 1)} \\div ${b}`, `${a} \\div ${show(b, 1)}`],
          [
            `Multiplying both numbers by 10 makes the divisor ${b} and moves the other point one place: $${show(a, p - 1)}$.`,
            `两个数都乘 10，除数变成 ${b}，另一个数的小数点也移一位：$${show(a, p - 1)}$。`,
          ],
        );
      },
    ),
  ],
  "multiplying-decimals-by-powers-of-ten-with-exponents": [
    skill(
      "the-decimal-before-the-power",
      ["The decimal before the power", "乘幂之前的小数"],
      [
        "An exponent on 10 says how many places the point moves. To recover the decimal in front of the power, move the point back that many places to the left.",
        "10 的指数说明小数点移动几位。要求幂前面的小数，就把小数点向左移回这么多位。",
      ],
      (rng) => {
        const n = rng.int(11, 99);
        const e = rng.int(2, 7);
        const value = n * 10 ** (e - 1);
        return decimal(
          [
            `Find the missing number: $$\\square \\times 10^{${e}} = ${commas(value)}$$`,
            `求缺少的数：$$\\square \\times 10^{${e}} = ${commas(value)}$$`,
          ],
          Q.of(n, 10),
          [Q.of(n, 100), Q.of(n, 1), Q.of(n, 1000)],
          [
            `$10^{${e}}$ moves the point ${e} places, and moving it back from $${commas(value)}$ gives $${show(n, 1)}$.`,
            `$10^{${e}}$ 使小数点移动 ${e} 位，从 $${commas(value)}$ 移回得 $${show(n, 1)}$。`,
          ],
        );
      },
    ),
  ],
  "evaluating-exponents-with-decimal-bases": [
    skill(
      "decimal-places-in-a-power",
      ["Decimal places in a power", "幂的小数位数"],
      [
        "Each factor of a decimal with one place brings one decimal place to the product. So a power of such a decimal has as many places as its exponent, before any final zeros are dropped.",
        "一位小数的每个因数都给积带来一位小数。所以这种小数的幂，在去掉末尾的零之前，小数位数等于指数。",
      ],
      (rng) => {
        const whole_ = rng.int(0, 2);
        const tenth = rng.pick([1, 2, 3, 4, 6, 7, 8, 9]);
        const e = rng.int(2, 8);
        return whole(
          [
            `How many decimal places does $${whole_}.${tenth}^{${e}}$ have, written out in full?`,
            `$${whole_}.${tenth}^{${e}}$ 完整写出后有几位小数？`,
          ],
          e,
          [1, e + 1, 2 * e],
          [
            `It is a product of ${e} factors with one decimal place each, so ${e} places, and its last digit is not zero.`,
            `它是 ${e} 个一位小数的积，所以有 ${e} 位小数，且最后一位不是 0。`,
          ],
        );
      },
    ),
  ],
  "evaluating-whole-number-expressions-containing-exponents": [
    skill(
      "a-squared-sum-versus-a-sum-of-squares",
      ["A squared sum and a sum of squares", "和的平方与平方和"],
      [
        "An exponent does not spread across a sum. Adding first and then squaring gives more than squaring each number first, so the parentheses matter a great deal here.",
        "指数不能分配到和的每一项。先加再平方，比分别平方再相加的结果大，所以这里括号非常重要。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const big = (a + b) ** 2;
        const small = a * a + b * b;
        return whole(
          [`How much greater is $(${a} + ${b})^{2}$ than $${a}^{2} + ${b}^{2}$?`, `$(${a} + ${b})^{2}$ 比 $${a}^{2} + ${b}^{2}$ 大多少？`],
          big - small,
          [a * b, 0, big],
          [
            `$(${a} + ${b})^{2} = ${big}$ and $${a}^{2} + ${b}^{2} = ${small}$, and $${big} - ${small} = ${big - small}$.`,
            `$(${a} + ${b})^{2} = ${big}$，$${a}^{2} + ${b}^{2} = ${small}$，$${big} - ${small} = ${big - small}$。`,
          ],
        );
      },
    ),
  ],
  "converting-metric-units-of-length-to-larger-units": [
    skill(
      "adding-lengths-in-two-units",
      ["Adding lengths in two units", "不同单位的长度相加"],
      [
        "Lengths in different units cannot be added digit by digit. Write both in kilometers first, moving the point three places for the meters, and then add as decimals.",
        "单位不同的长度不能直接相加。先都写成千米，米数的小数点移三位，然后按小数相加。",
      ],
      (rng) => {
        const km = rng.int(11, 99);
        const m = rng.int(120, 950);
        const total = km * 100 + m;
        return decimal(
          [
            `A runner goes $${show(km, 1)}$ kilometers and then ${m} meters more. How many kilometers is that in all?`,
            `一名跑步者跑了 $${show(km, 1)}$ 千米，又跑了 ${m} 米。一共多少千米？`,
          ],
          Q.of(total, 1000),
          [Q.of(km * 10 + m, 10), Q.of(km * 100 + m * 10, 100), Q.of(km + m, 10)],
          [
            `${m} meters is $${show(m, 3)}$ kilometers, and $${show(km, 1)} + ${show(m, 3)} = ${show(total, 3)}$.`,
            `${m} 米是 $${show(m, 3)}$ 千米，$${show(km, 1)} + ${show(m, 3)} = ${show(total, 3)}$。`,
          ],
        );
      },
    ),
  ],
  "converting-customary-units-of-length-to-larger-units": [
    skill(
      "full-yards-in-inches",
      ["Full yards in inches", "英寸中有几个整码"],
      [
        "There are 36 inches in a yard, since a yard is 3 feet and a foot is 12 inches. Dividing by 36 gives the full yards, and the remainder is the inches left over.",
        "1 码是 3 英尺，1 英尺是 12 英寸，所以 1 码是 36 英寸。除以 36 得到整码数，余数是剩下的英寸。",
      ],
      (rng) => {
        const y = rng.int(2, 30);
        const r = rng.int(1, 35);
        const n = 36 * y + r;
        return whole(
          [`How many full yards are in ${n} inches?`, `${n} 英寸中有多少个整码？`],
          y,
          [Math.floor(n / 12), y + 1, Math.floor(n / 3)],
          [`$${n} \\div 36$ is ${y} with remainder ${r}, so ${y} full yards.`, `$${n} \\div 36$ 得 ${y} 余 ${r}，所以有 ${y} 个整码。`],
        );
      },
    ),
  ],
  "converting-units-of-volume-to-larger-units": [
    toLarger(
      "total-volume-in-liters",
      ["A total volume in liters", "以升为单位的总容积"],
      ["bottle", "瓶子"],
      ["milliliters", "毫升"],
      ["liters", "升"],
    ),
  ],
  "converting-units-of-mass-to-larger-units": [
    toLarger(
      "total-mass-in-kilograms",
      ["A total mass in kilograms", "以千克为单位的总质量"],
      ["small bag", "小袋"],
      ["grams", "克"],
      ["kilograms", "千克"],
    ),
  ],
  "operations-on-fractions-with-line-plots": [
    skill(
      "comparing-two-columns-of-a-line-plot",
      ["Comparing two columns", "比较两列"],
      [
        "Each column of a line plot stands for a total: the value times its number of marks. To compare two columns, find each column's total and then subtract them.",
        "线图的每一列代表一个总量：值乘标记数。要比较两列，先求各列的总量，再相减。",
      ],
      (rng) => {
        const a = rng.int(1, 6);
        const c = rng.int(1, 8);
        const top = 3 * c - a === 0 ? 3 * (c + 1) - a : 3 * c - a;
        const cc = 3 * c - a === 0 ? c + 1 : c;
        const answer = Q.of(Math.abs(top), 4);
        return fraction(
          [
            `A line plot has ${a} mark${a > 1 ? "s" : ""} above $${frac(1, 4)}$ pound and ${cc} mark${cc > 1 ? "s" : ""} above $${frac(3, 4)}$ pound. How many pounds apart are the totals of these two columns?`,
            `线图中 $${frac(1, 4)}$ 磅上方有 ${a} 个标记，$${frac(3, 4)}$ 磅上方有 ${cc} 个标记。这两列的总量相差多少磅？`,
          ],
          answer,
          [Q.of(a + 3 * cc, 4), Q.of(Math.abs(cc - a) + 1, 2), Q.of(Math.abs(a - cc) + 3, 4)],
          [
            `The totals are $${frac(a, 4)}$ and $${frac(3 * cc, 4)}$ pounds, which are $${frac(Math.abs(top), 4)}$ apart.`,
            `两列的总量分别是 $${frac(a, 4)}$ 和 $${frac(3 * cc, 4)}$ 磅，相差 $${frac(Math.abs(top), 4)}$ 磅。`,
          ],
        );
      },
    ),
  ],
  "describing-the-coordinate-plane": [
    skill(
      "distance-along-a-grid-line",
      ["Distance along a grid line", "沿网格线的距离"],
      [
        "Two points with the same first coordinate lie on one vertical line, and two with the same second coordinate lie on one horizontal line. The distance is the difference of the other coordinates.",
        "第一个坐标相同的两点在同一条竖直线上，第二个坐标相同的两点在同一条水平线上。距离就是另一个坐标的差。",
      ],
      (rng) => {
        const s = rng.int(1, 15);
        const lo = rng.int(0, 10);
        const hi = lo + rng.int(1, 12);
        const vertical = rng.bool();
        const p = vertical ? `(${s}, ${lo})` : `(${lo}, ${s})`;
        const q = vertical ? `(${s}, ${hi})` : `(${hi}, ${s})`;
        return whole(
          [`How many units apart are the points $${p}$ and $${q}$?`, `点 $${p}$ 和 $${q}$ 相距多少个单位？`],
          hi - lo,
          [hi + lo, hi, s],
          [
            `One coordinate matches, so subtract the other: $${hi} - ${lo} = ${hi - lo}$.`,
            `一个坐标相同，所以另一个坐标相减：$${hi} - ${lo} = ${hi - lo}$。`,
          ],
        );
      },
    ),
  ],
  "comparing-patterns": [
    skill(
      "the-matching-term-of-another-pattern",
      ["The matching term of another pattern", "另一个数列的对应项"],
      [
        "When two patterns start at 0, each term of one is a fixed number of times the matching term of the other. That factor gives any matching term without listing the patterns.",
        "两个数列都从 0 开始时，一个数列的每一项是另一个数列对应项的固定倍数。用这个倍数不必列出数列就能求出任意对应项。",
      ],
      (rng) => {
        const a = rng.int(2, 6);
        const k = rng.int(2, 6);
        const steps = rng.int(4, 40);
        const term = a * steps;
        return whole(
          [
            `Pattern A starts at 0 and adds ${a} each time. Pattern B starts at 0 and adds ${a * k} each time. When a term of A is ${term}, what is the matching term of B?`,
            `数列 A 从 0 开始，每次加 ${a}。数列 B 从 0 开始，每次加 ${a * k}。当 A 的一项是 ${term} 时，B 的对应项是多少？`,
          ],
          term * k,
          [term + a * k, term * a, steps * a],
          [
            `Each term of B is ${k} times the matching term of A: $${term} \\times ${k} = ${term * k}$.`,
            `B 的每一项是 A 的对应项的 ${k} 倍：$${term} \\times ${k} = ${term * k}$。`,
          ],
        );
      },
    ),
  ],
  "graphing-patterns": [
    skill(
      "a-far-point-on-the-graph",
      ["A far point on the graph", "图像上较远的点"],
      [
        "Points graphed from two patterns that start at 0 lie on a line through the origin. The second coordinate is a fixed multiple of the first, which reaches points far beyond the graph.",
        "由两个从 0 开始的数列画出的点在一条过原点的直线上。第二个坐标是第一个坐标的固定倍数，由此可以求出图外很远的点。",
      ],
      (rng) => {
        const a = rng.int(1, 5);
        const k = rng.int(2, 6);
        const x = a * rng.int(11, 60);
        return whole(
          [
            `A graph shows the points $(0, 0)$, $(${a}, ${a * k})$ and $(${2 * a}, ${2 * a * k})$, formed from two patterns. If the patterns continue, what is the second coordinate when the first is ${x}?`,
            `一个图像显示由两个数列得到的点 $(0, 0)$、$(${a}, ${a * k})$ 和 $(${2 * a}, ${2 * a * k})$。如果数列继续下去，第一个坐标是 ${x} 时，第二个坐标是多少？`,
          ],
          x * k,
          [x + k, x + a * k, x * a],
          [
            `The second coordinate is always ${k} times the first: $${x} \\times ${k} = ${x * k}$.`,
            `第二个坐标总是第一个的 ${k} 倍：$${x} \\times ${k} = ${x * k}$。`,
          ],
        );
      },
    ),
  ],
  quadrilaterals: [
    skill(
      "the-missing-angle-of-a-quadrilateral",
      ["The missing angle of a quadrilateral", "四边形中缺少的角"],
      [
        "A diagonal cuts any quadrilateral into two triangles, so its angles total $360^\\circ$. The missing angle is what remains after subtracting the three known angles from that total.",
        "对角线把任意四边形分成两个三角形，所以内角和是 $360^\\circ$。从总和中减去三个已知角，就得到缺少的角。",
      ],
      (rng) => {
        const a = rng.int(65, 115);
        const b = rng.int(65, 115);
        const c = rng.int(65, 115);
        const d = 360 - a - b - c;
        return whole(
          [
            `Three angles of a quadrilateral measure $${a}^\\circ$, $${b}^\\circ$ and $${c}^\\circ$. What is the fourth angle, in degrees?`,
            `四边形的三个角分别是 $${a}^\\circ$、$${b}^\\circ$ 和 $${c}^\\circ$。第四个角是多少度？`,
          ],
          d,
          [Math.abs(180 - a - b - c), a + b + c, 360 - a - b],
          [`The angles total 360, and $360 - ${a} - ${b} - ${c} = ${d}$.`, `内角和是 360，$360 - ${a} - ${b} - ${c} = ${d}$。`],
        );
      },
    ),
  ],
  "perimeters-of-shapes": [
    skill(
      "a-side-from-a-regular-perimeter",
      ["A side from a regular perimeter", "由正多边形的周长求边长"],
      [
        "A regular polygon's sides are all equal, so its perimeter is the side times the number of sides. Dividing the perimeter by the number of sides undoes that.",
        "正多边形的各边都相等，所以周长是边长乘边数。周长除以边数就能还原边长。",
      ],
      (rng) => {
        const shapes: readonly [string, string, number][] = [
          ["square", "正方形", 4],
          ["regular pentagon", "正五边形", 5],
          ["regular hexagon", "正六边形", 6],
          ["regular octagon", "正八边形", 8],
          ["equilateral triangle", "等边三角形", 3],
        ];
        const [en, zh, n] = rng.pick(shapes);
        const side = rng.int(11, 199);
        return decimal(
          [
            `A ${en} has a perimeter of $${show(side * n, 1)}$ meters. How many meters long is each side?`,
            `一个${zh}的周长是 $${show(side * n, 1)}$ 米。每条边长多少米？`,
          ],
          Q.of(side, 10),
          [Q.of(side * n, 10 * (n + 1)), Q.of(side * n, 100), Q.of(side * 2, 10)],
          [
            `It has ${n} equal sides: $${show(side * n, 1)} \\div ${n} = ${show(side, 1)}$.`,
            `它有 ${n} 条相等的边：$${show(side * n, 1)} \\div ${n} = ${show(side, 1)}$。`,
          ],
        );
      },
    ),
  ],
  "classifying-quadrilaterals": [
    skill(
      "one-right-angle-settles-the-rest",
      ["One right angle settles the rest", "一个直角决定其余的角"],
      [
        "Next to each other, the angles of a parallelogram add to $180^\\circ$. So a parallelogram with one right angle has four, making it a rectangle, and a square if its sides are also equal.",
        "平行四边形的相邻两角和是 $180^\\circ$。所以有一个直角的平行四边形有四个直角，是长方形；如果边也都相等，就是正方形。",
      ],
      (rng) => {
        const a = rng.int(3, 20);
        const b = a + rng.int(1, 9);
        const angle = rng.int(40, 140);
        const form = rng.int(0, 3);
        const sq: Pair = ["Square", "正方形"];
        const re: Pair = ["Rectangle", "长方形"];
        const rh: Pair = ["Rhombus", "菱形"];
        const pa: Pair = ["Parallelogram", "平行四边形"];
        const unequal = angle === 90 ? 75 : angle;
        const data: readonly [Pair, Pair, Pair][] = [
          [
            [
              `A parallelogram has a right angle and adjacent sides of ${a} cm and ${a} cm.`,
              `一个平行四边形有一个直角，相邻两边是 ${a} 厘米和 ${a} 厘米。`,
            ],
            sq,
            [`One right angle gives four, and all the sides are equal.`, `一个直角意味着四个直角，且各边相等。`],
          ],
          [
            [
              `A parallelogram has a right angle and adjacent sides of ${a} cm and ${b} cm.`,
              `一个平行四边形有一个直角，相邻两边是 ${a} 厘米和 ${b} 厘米。`,
            ],
            re,
            [`One right angle gives four, but the adjacent sides differ.`, `一个直角意味着四个直角，但相邻两边不等。`],
          ],
          [
            [
              `A parallelogram has an angle of $${unequal}^\\circ$ and adjacent sides of ${a} cm and ${a} cm.`,
              `一个平行四边形有一个 $${unequal}^\\circ$ 的角，相邻两边是 ${a} 厘米和 ${a} 厘米。`,
            ],
            rh,
            [`All the sides are equal, but no angle is right.`, `各边相等，但没有直角。`],
          ],
          [
            [
              `A parallelogram has an angle of $${unequal}^\\circ$ and adjacent sides of ${a} cm and ${b} cm.`,
              `一个平行四边形有一个 $${unequal}^\\circ$ 的角，相邻两边是 ${a} 厘米和 ${b} 厘米。`,
            ],
            pa,
            [
              `No angle is right and the adjacent sides differ, so no more specific name fits.`,
              `没有直角，相邻两边也不等，所以没有更具体的名称。`,
            ],
          ],
        ];
        const [desc, correct, why] = data[form]!;
        return choose(
          rng,
          [`${desc[0]} What is its most specific name?`, `${desc[1]}它最具体的名称是什么？`],
          correct,
          [sq, re, rh, pa].filter((x) => x !== correct),
          why,
        );
      },
    ),
  ],
};
