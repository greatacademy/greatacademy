// A third knowledge point for the first 6th Grade Math topics on ratios, percents, fraction division,
// signed numbers, expressions and one-step equations: the reverse question, a further step and the usual traps.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { earlyNames } from "../early-grades-kit.ts";
import { numberProblem } from "../problems.ts";
import { chooseMath, type Pair, whole } from "./early-grades-more-kit.ts";

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

/** integer builds a problem whose answer is an integer that may be negative. */
const integer = (prompt: Pair, answer: number, wrong: readonly number[], solution: Pair) => {
  const kept = [...new Set(wrong.filter((w) => w !== answer))];
  for (let k = 1; kept.length < 3; k++) if (!kept.includes(answer + k)) kept.push(answer + k);
  return numberProblem({ prompt: t(prompt[0], prompt[1]), answer, form: "integer", wrong: kept, solution: t(solution[0], solution[1]) });
};

/** frac writes a fraction in LaTeX. */
const frac = (n: number | string, d: number | string) => `\\frac{${n}}{${d}}`;

/** commas writes a whole number with thousands separators for LaTeX. */
const commas = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}");

/** gcd finds the greatest common factor of two whole numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** tenths writes a count of tenths as a decimal. */
const tenths = (n: number) => (n / 10).toFixed(1);

/** deeperGrade6ThirdPoints holds the third knowledge points of these 6th Grade Math topics, by topic. */
export const deeperGrade6ThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "equivalent-ratios": [
    skill(
      "sharing-a-total-in-a-ratio",
      ["Sharing a total in a ratio", "按比分配总数"],
      [
        "To share a total in a given ratio, add the ratio's numbers to find how many equal shares there are. Dividing the total by this number gives one share, and each part is a number of shares.",
        "按比分配总数时，先把比的各项相加，得到一共有几份。总数除以份数得到一份，各部分就是若干份。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const k = rng.int(3, 25);
        const first = rng.bool();
        return whole(
          first
            ? [
                `Two friends share ${(a + b) * k} stickers in the ratio ${a} : ${b}. How many stickers does the first friend get?`,
                `两个朋友按 ${a} : ${b} 分 ${(a + b) * k} 张贴纸。第一个朋友得到多少张？`,
              ]
            : [
                `Two friends share ${(a + b) * k} stickers in the ratio ${a} : ${b}. How many stickers does the second friend get?`,
                `两个朋友按 ${a} : ${b} 分 ${(a + b) * k} 张贴纸。第二个朋友得到多少张？`,
              ],
          (first ? a : b) * k,
          [(first ? b : a) * k === (first ? a : b) * k ? k : (first ? b : a) * k, k, (a + b) * k - 1],
          [
            `There are $${a} + ${b} = ${a + b}$ shares of ${k} each, and $${first ? a : b} \\times ${k} = ${(first ? a : b) * k}$.`,
            `一共 $${a} + ${b} = ${a + b}$ 份，每份 ${k} 张，$${first ? a : b} \\times ${k} = ${(first ? a : b) * k}$。`,
          ],
        );
      },
    ),
  ],
  "comparing-ratios": [
    skill(
      "the-greatest-of-four-ratios",
      ["The greatest of four ratios", "四个比中最大的"],
      [
        "Ratios are compared by their values, which are the quotients of their two numbers. A ratio with larger numbers need not be larger, since only the quotient matters.",
        "比的大小由比值决定，比值是两个数的商。数大的比不一定大，因为只有商才重要。",
      ],
      (rng) => {
        const pool = rng.sample<[number, number]>(
          [
            [1, 2],
            [2, 3],
            [3, 4],
            [3, 5],
            [4, 5],
            [5, 8],
            [7, 10],
            [5, 6],
            [7, 8],
            [9, 10],
            [2, 5],
            [3, 8],
            [4, 7],
            [5, 7],
          ],
          4,
        );
        const scaled = pool.map((p): [number, number, number] => {
          const k = rng.int(1, 4);
          return [p[0] * k, p[1] * k, p[0] / p[1]];
        });
        const sorted = [...scaled].sort((x, y) => y[2] - x[2]);
        const [best, ...rest] = sorted as [[number, number, number], ...[number, number, number][]];
        return chooseMath(
          rng,
          ["Which ratio has the greatest value?", "哪个比的比值最大？"],
          `${best[0]} : ${best[1]}`,
          rest.map((r) => `${r[0]} : ${r[1]}`),
          [
            `The quotient of ${best[0]} by ${best[1]} is about ${best[2].toFixed(2)}, the largest of the four.`,
            `${best[0]} 除以 ${best[1]} 约为 ${best[2].toFixed(2)}，是四个中最大的。`,
          ],
        );
      },
    ),
  ],
  "approximating-ratios": [
    skill(
      "about-how-many-times-as-many",
      ["About how many times as many", "大约是多少倍"],
      [
        "Rounding both numbers of a ratio to friendly numbers shows about how many times one is the other. The result is an estimate, useful for a quick check rather than an exact answer.",
        "把比的两个数都取整成好算的数，可以看出一个大约是另一个的多少倍。结果是估计值，适合快速检验，不是准确答案。",
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const b = rng.int(4, 30) * 10;
        const x = b + rng.int(-3, 3);
        const y = k * b + rng.int(-7, 7);
        return whole(
          [
            `A town has $${commas(y)}$ cars and ${x} buses. To the nearest whole number, about how many times as many cars as buses are there?`,
            `一个城镇有 $${commas(y)}$ 辆汽车和 ${x} 辆公共汽车。汽车的数量大约是公共汽车的多少倍（精确到整数）？`,
          ],
          k,
          [k + 1, k * 10, k - 1],
          [
            `$${commas(y)}$ is close to $${commas(k * b)}$ and ${x} is close to ${b}, and $${commas(k * b)} \\div ${b} = ${k}$.`,
            `$${commas(y)}$ 接近 $${commas(k * b)}$，${x} 接近 ${b}，$${commas(k * b)} \\div ${b} = ${k}$。`,
          ],
        );
      },
    ),
  ],
  "ratio-tables": [
    skill(
      "adding-two-columns",
      ["Adding two columns", "把两列相加"],
      [
        "Adding two columns of a ratio table gives another column in the same ratio. This is often the quickest way to a value that is not a simple multiple of the first column.",
        "把比例表的两列相加，得到的还是比相同的一列。要求的值不是第一列的简单倍数时，这常常是最快的方法。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 12);
        const p = rng.int(2, 6);
        const q = rng.int(p + 1, 11);
        return whole(
          [
            `A ratio table has the columns $(${a * p}, ${b * p})$ and $(${a * q}, ${b * q})$. Adding them gives a new column. What goes below ${a * (p + q)}?`,
            `比例表有两列 $(${a * p}, ${b * p})$ 和 $(${a * q}, ${b * q})$。相加得到新的一列。${a * (p + q)} 下面是多少？`,
          ],
          b * (p + q),
          [b * p * q, a * (p + q) + b, b * q],
          [`Add the lower numbers: $${b * p} + ${b * q} = ${b * (p + q)}$.`, `把下面的数相加：$${b * p} + ${b * q} = ${b * (p + q)}$。`],
        );
      },
    ),
  ],
  "graphing-ratios": [
    skill(
      "the-height-at-one",
      ["The height at x = 1", "x = 1 时的高度"],
      [
        "A graph of equivalent ratios is a line through the origin. Dividing any point's height by its first coordinate gives the height where $x = 1$, which is the unit rate of the graph.",
        "等值比的图像是一条过原点的直线。任意一点的纵坐标除以横坐标，就得到 $x = 1$ 时的高度，也就是图像的单位比率。",
      ],
      (rng) => {
        const x = rng.int(2, 12);
        const y = rng.int(1, 30);
        return fraction(
          [
            `A graph of equivalent ratios of $x$ to $y$ passes through $(${x}, ${y})$. What is $y$ when $x = 1$?`,
            `$x$ 与 $y$ 的等值比图像经过 $(${x}, ${y})$。$x = 1$ 时 $y$ 是多少？`,
          ],
          Q.of(y, x),
          [Q.of(x, y), Q.of(y - x + 40, 1), Q.of(x + y, x)],
          [`Divide both coordinates by ${x}: $y = ${frac(y, x)}$.`, `两个坐标都除以 ${x}：$y = ${frac(y, x)}$。`],
        );
      },
    ),
  ],
  "solving-problems-using-unit-rates": [
    skill(
      "how-many-for-a-given-cost",
      ["How many for a given cost", "一定的钱能买多少"],
      [
        "A unit rate can be used in either direction. Dividing a cost by the price per item gives the number of items, so the question is the reverse of finding a total cost.",
        "单位比率可以双向使用。总价除以单价得到件数，所以这个问题与求总价相反。",
      ],
      (rng) => {
        const price = rng.int(2, 12);
        const n = rng.int(3, 12);
        const m = rng.int(n + 1, 40);
        return whole(
          [
            `${n} notebooks cost ${n * price} dollars. At the same price, how many notebooks can be bought for ${m * price} dollars?`,
            `${n} 本笔记本售价 ${n * price} 美元。按同样的价格，${m * price} 美元能买多少本？`,
          ],
          m,
          [m * price, n + m, m * n],
          [
            `Each costs $${n * price} \\div ${n} = ${price}$ dollars, and $${m * price} \\div ${price} = ${m}$.`,
            `每本 $${n * price} \\div ${n} = ${price}$ 美元，$${m * price} \\div ${price} = ${m}$。`,
          ],
        );
      },
    ),
  ],
  "understanding-percentages-using-models": [
    skill(
      "parts-of-a-bar-for-a-percent",
      ["Parts of a bar for a percent", "百分数对应几份"],
      [
        "A whole bar is 100 percent, so each of its equal parts is 100 divided by the number of parts. The number of parts to shade is the percent divided by the size of one part.",
        "整个长条是百分之百，所以每一等份是 100 除以份数。要涂的份数是百分数除以每份的大小。",
      ],
      (rng) => {
        const parts = rng.pick([2, 4, 5, 10, 20, 25, 50]);
        const each = 100 / parts;
        const k = rng.int(1, parts - 1);
        return whole(
          [
            `A bar is split into ${parts} equal parts. How many parts must be shaded to show ${k * each}%?`,
            `一个长条分成 ${parts} 等份。要表示 ${k * each}% 需要涂几份？`,
          ],
          k,
          [k * each, parts - k, k + 1],
          [`Each part is ${each}%, and $${k * each} \\div ${each} = ${k}$.`, `每份是 ${each}%，$${k * each} \\div ${each} = ${k}$。`],
        );
      },
    ),
  ],
  "converting-between-percentages-and-fractions": [
    skill(
      "percents-over-one-hundred-as-fractions",
      ["Percents over 100 as fractions", "超过 100% 的百分数化分数"],
      [
        "A percent over 100 means more than the whole, so its fraction is greater than 1. Writing it over 100 and simplifying gives an improper fraction, which may also be written as a mixed number.",
        "超过 100% 的百分数表示比整体多，所以对应的分数大于 1。写成分母为 100 的分数再约分，得到一个假分数，也可以写成带分数。",
      ],
      (rng) => {
        let p = rng.int(21, 79) * 5;
        if (p % 100 === 0) p += 5;
        return fraction(
          [`Write ${p}% as a fraction in simplest form.`, `把 ${p}% 写成最简分数。`],
          Q.of(p, 100),
          [Q.of(100, p), Q.of(p, 1000), Q.of(p - 100, 100)],
          [
            `$${p}\\% = ${frac(p, 100)} = ${frac(p / gcd(p, 100), 100 / gcd(p, 100))}$, which is more than 1 because ${p}% is more than the whole.`,
            `$${p}\\% = ${frac(p, 100)} = ${frac(p / gcd(p, 100), 100 / gcd(p, 100))}$，它大于 1，因为 ${p}% 比整体多。`,
          ],
        );
      },
    ),
  ],
  "converting-between-percentages-and-decimals": [
    skill(
      "percents-below-one-as-decimals",
      ["Percents below 1 as decimals", "小于 1% 的百分数化小数"],
      [
        "Moving the point two places to the left works for every percent, even one below 1. So half of one percent is 0.005, and writing 0.5 for it would mean fifty percent.",
        "小数点左移两位适用于所有百分数，包括小于 1% 的。所以 0.5% 是 0.005；写成 0.5 就成了 50%。",
      ],
      (rng) => {
        const k = rng.int(1, 9);
        const form = rng.int(0, 2);
        const two = rng.int(1, 9) * 10 + k;
        const percent = form === 0 ? `0.${k}` : form === 1 ? `0.0${k}` : `0.${two}`;
        const answer = form === 0 ? `0.00${k}` : form === 1 ? `0.000${k}` : `0.00${two}`;
        return chooseMath(
          rng,
          [`Write ${percent}% as a decimal.`, `把 ${percent}% 写成小数。`],
          answer,
          [percent, form === 0 ? `0.0${k}` : form === 1 ? `0.00${k}` : `0.0${two}`, form === 0 ? `${k}` : form === 1 ? `0.${k}` : `${two}`],
          [`Divide by 100, moving the point two places to the left: $${answer}$.`, `除以 100，小数点向左移两位：$${answer}$。`],
        );
      },
    ),
  ],
  "finding-a-percentage-given-two-numbers": [
    skill(
      "the-percent-that-did-not",
      ["The percent that did not", "没有做到的百分比"],
      [
        "The two parts of a whole have percents that add to 100. So the percent of those who did not do something can be found from those who did, by subtracting from 100.",
        "整体的两部分的百分比之和是 100。所以没有做某事的百分比，可以用 100 减去做了的百分比求出。",
      ],
      (rng) => {
        const total = rng.pick([20, 40, 60, 80, 100, 200, 300, 400, 500]);
        const p = rng.int(2, 19) * 5;
        const yes = (total * p) / 100;
        return whole(
          [
            `In a school of ${total} students, ${yes} walk to school. What percent of the students do not walk to school?`,
            `一所有 ${total} 名学生的学校中，${yes} 人步行上学。不步行上学的学生占百分之几？`,
          ],
          100 - p,
          [p, total - yes, 100 - yes > 0 ? 100 - yes : 100 - p + 5],
          [
            `$${yes} \\div ${total} = ${p}\\%$ walk, so $100\\% - ${p}\\% = ${100 - p}\\%$ do not.`,
            `$${yes} \\div ${total} = ${p}\\%$ 步行，所以 $100\\% - ${p}\\% = ${100 - p}\\%$ 不步行。`,
          ],
        );
      },
    ),
  ],
  "converting-units-of-length-to-larger-units-using-long-division": [
    skill(
      "feet-left-after-whole-miles",
      ["Feet left after whole miles", "整英里之后剩下的英尺"],
      [
        "A mile is 5,280 feet, which is too large for mental work, so long division is the natural tool. The quotient is the whole miles and the remainder is the feet that are left over.",
        "1 英里是 5,280 英尺，心算太难，所以用长除法。商是整英里数，余数是剩下的英尺。",
      ],
      (rng) => {
        const m = rng.int(2, 12);
        const r = rng.int(100, 5000);
        const n = 5280 * m + r;
        return whole(
          [
            `Write $${commas(n)}$ feet in miles and feet. How many feet are left over after the whole miles?`,
            `把 $${commas(n)}$ 英尺写成英里和英尺。整英里之后还剩多少英尺？`,
          ],
          r,
          [m, r + 5280, n - 5000 * m],
          [
            `$5{,}280 \\times ${m} = ${commas(5280 * m)}$, and $${commas(n)} - ${commas(5280 * m)} = ${commas(r)}$.`,
            `$5{,}280 \\times ${m} = ${commas(5280 * m)}$，$${commas(n)} - ${commas(5280 * m)} = ${commas(r)}$。`,
          ],
        );
      },
    ),
  ],
  "dividing-fractions-word-problems": [
    skill(
      "the-length-left-after-cutting",
      ["The length left after cutting", "剪完后剩下的长度"],
      [
        "A division that does not come out even leaves a piece too short to use. Its length is what remains after taking away the full pieces, and it is not simply the fractional part of the quotient.",
        "不能整除时，会剩下一段不够长的。它的长度是减去所有完整段后剩下的，并不等于商的分数部分。",
      ],
      (rng) => {
        const d = rng.pick([6, 8, 10, 12]);
        const piece = rng.pick([2, 3, 4].filter((x) => x < d));
        const count = rng.int(2, 7);
        const left = rng.int(1, piece - 1);
        const total = piece * count + left;
        return fraction(
          [
            `A ribbon $${frac(total, d)}$ yards long is cut into as many pieces of $${frac(piece, d)}$ yard as possible. How many yards are left over?`,
            `一根 $${frac(total, d)}$ 码长的丝带尽量剪成每段 $${frac(piece, d)}$ 码。还剩多少码？`,
          ],
          Q.of(left, d),
          [Q.of(left, piece), Q.of(piece, d), Q.of(count, d), Q.of(total, d), Q.of(left + piece, d)],
          [
            `${count} pieces use $${frac(piece * count, d)}$ yards, leaving $${frac(left, d)}$ yard.`,
            `${count} 段用去 $${frac(piece * count, d)}$ 码，剩下 $${frac(left, d)}$ 码。`,
          ],
        );
      },
    ),
  ],
  "dividing-mixed-numbers-by-whole-numbers": [
    skill(
      "the-number-before-dividing-by-a-whole",
      ["The number before dividing", "除之前的数"],
      [
        "A division by a whole number is undone by multiplying. So the number that was divided is the quotient times the whole number, simplified if that is possible.",
        "除以整数可以用乘法还原。所以被除数是商乘这个整数，能约分就约分。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const a = rng.int(1, 6);
        const n = rng.int(1, d - 1);
        const k = rng.int(2, 9);
        return fraction(
          [`Fill in the box: $$\\square \\div ${k} = ${a}${frac(n, d)}$$`, `填方框：$$\\square \\div ${k} = ${a}${frac(n, d)}$$`],
          Q.of((a * d + n) * k, d),
          [Q.of(a * d + n, d * k), Q.of(a * d + n * k, d), Q.of(a * k * d + n, d)],
          [
            `Multiply back: $${k} \\times ${frac(a * d + n, d)} = ${frac((a * d + n) * k, d)}$.`,
            `乘回去：$${k} \\times ${frac(a * d + n, d)} = ${frac((a * d + n) * k, d)}$。`,
          ],
        );
      },
    ),
  ],
  "dividing-mixed-numbers-by-fractions": [
    skill(
      "full-scoops-from-a-mixed-amount",
      ["Full scoops from a mixed amount", "带分数的量能舀几满勺"],
      [
        "Dividing an amount by a scoop size tells how many scoops it holds. A story that counts only full scoops uses the whole part of the quotient, even when the fraction is almost a whole.",
        "总量除以每勺的大小，得到能舀几勺。只数满勺时用商的整数部分，即使分数部分已接近 1。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const d = rng.pick([4, 5, 6, 7, 8, 9]);
        const c = rng.pick([2, 3].filter((x) => gcd(x, d) === 1).concat(d === 6 ? [5] : []));
        const a = rng.int(2, 9);
        let n = rng.int(1, d - 1);
        if ((a * d + n) % c === 0) n = n < d - 1 ? n + 1 : n - 1;
        const top = a * d + n;
        return whole(
          [
            `${who} has $${a}${frac(n, d)}$ cups of flour and a scoop that holds $${frac(c, d)}$ cup. How many full scoops can be made?`,
            `${who} 有 $${a}${frac(n, d)}$ 杯面粉，勺子每勺 $${frac(c, d)}$ 杯。能舀多少满勺？`,
          ],
          Math.floor(top / c),
          [Math.floor(top / c) + 1, a * c, top],
          [
            `$${a}${frac(n, d)} \\div ${frac(c, d)} = ${frac(top, c)}$, whose whole part is ${Math.floor(top / c)}.`,
            `$${a}${frac(n, d)} \\div ${frac(c, d)} = ${frac(top, c)}$，整数部分是 ${Math.floor(top / c)}。`,
          ],
        );
      },
    ),
  ],
  "dividing-whole-numbers-by-mixed-numbers": [
    skill(
      "the-mixed-number-divisor",
      ["The mixed number divisor", "作为除数的带分数"],
      [
        "In a division, the divisor is the dividend divided by the quotient. So a missing divisor is found by another division, and the result may well be a mixed number.",
        "除法中，除数等于被除数除以商。所以缺少的除数要用另一个除法求出，结果很可能是带分数。",
      ],
      (rng) => {
        const q = rng.int(2, 9);
        const k = rng.int(3, 40);
        const top = k % q === 0 ? k + 1 : k;
        return fraction(
          [`Fill in the box: $$${top} \\div \\square = ${q}$$`, `填方框：$$${top} \\div \\square = ${q}$$`],
          Q.of(top, q),
          [Q.of(q, top), Q.of(top * q, 1), Q.of(top - q, 1)],
          [
            `The divisor is $${top} \\div ${q} = ${frac(top, q)}$. Check: $${q} \\times ${frac(top, q)} = ${top}$.`,
            `除数是 $${top} \\div ${q} = ${frac(top, q)}$。检验：$${q} \\times ${frac(top, q)} = ${top}$。`,
          ],
        );
      },
    ),
  ],
  "dividing-fractions-by-mixed-numbers": [
    skill(
      "the-reciprocal-of-the-mixed-divisor",
      ["The reciprocal of the mixed divisor", "带分数除数的倒数"],
      [
        "Dividing by a mixed number means multiplying by its reciprocal, but the mixed number must become an improper fraction first. Turning over only the fraction part is the common slip.",
        "除以带分数就是乘它的倒数，但要先把带分数化成假分数。只颠倒分数部分是常见错误。",
      ],
      (rng) => {
        const d = rng.int(2, 9);
        const n = rng.int(1, d - 1);
        const x = rng.int(1, 6);
        const b = rng.int(2, 9);
        const a = rng.int(1, b - 1);
        return fraction(
          [
            `Fill in the box with a fraction: $$${frac(a, b)} \\div ${x}${frac(n, d)} = ${frac(a, b)} \\times \\square$$`,
            `在方框中填一个分数：$$${frac(a, b)} \\div ${x}${frac(n, d)} = ${frac(a, b)} \\times \\square$$`,
          ],
          Q.of(d, x * d + n),
          [Q.of(d, n), Q.of(x * d + n, d), Q.of(x * n + 1, d)],
          [
            `$${x}${frac(n, d)} = ${frac(x * d + n, d)}$, whose reciprocal is $${frac(d, x * d + n)}$.`,
            `$${x}${frac(n, d)} = ${frac(x * d + n, d)}$，它的倒数是 $${frac(d, x * d + n)}$。`,
          ],
        );
      },
    ),
  ],
  "dividing-mixed-numbers": [
    skill(
      "a-speed-from-mixed-numbers",
      ["A speed from mixed numbers", "由带分数求速度"],
      [
        "A rate per one unit comes from dividing the amount by the number of units. Both may be mixed numbers, and writing both as improper fractions makes the division routine.",
        "每单位的比率用总量除以单位数。两者都可能是带分数，都化成假分数后除法就很常规了。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const d = rng.pick([2, 3, 4, 5]);
        const n = rng.int(1, d - 1);
        const a = rng.int(1, 5);
        const e = rng.pick([2, 3, 4, 6]);
        const m = rng.int(1, e - 1);
        const b = rng.int(1, 4);
        const dist = Q.of(a * d + n, d);
        const time = Q.of(b * e + m, e);
        const speed = dist.div(time);
        return fraction(
          [
            `${who} walks $${a}${frac(n, d)}$ miles in $${b}${frac(m, e)}$ hours. At this rate, how many miles does ${who} walk in one hour?`,
            `${who} 在 $${b}${frac(m, e)}$ 小时内走了 $${a}${frac(n, d)}$ 英里。按这个速度，${who} 一小时走多少英里？`,
          ],
          speed,
          [time.div(dist), dist.mul(time), dist],
          [
            `Divide miles by hours: $${frac(a * d + n, d)} \\div ${frac(b * e + m, e)} = ${frac(a * d + n, d)} \\times ${frac(e, b * e + m)}$.`,
            `英里数除以小时数：$${frac(a * d + n, d)} \\div ${frac(b * e + m, e)} = ${frac(a * d + n, d)} \\times ${frac(e, b * e + m)}$。`,
          ],
        );
      },
    ),
  ],
  "estimating-multi-digit-division-with-decimals": [
    skill(
      "dividing-can-make-a-number-larger",
      ["Dividing can make a number larger", "除法可能使数变大"],
      [
        "Dividing by a number between 0 and 1 asks how many small pieces fit, so the quotient is larger than the number being divided. Dividing by a number above 1 makes it smaller.",
        "除以 0 和 1 之间的数，是在问能放下多少小块，所以商比被除数大。除以大于 1 的数，商比被除数小。",
      ],
      (rng) => {
        const n = rng.int(12, 900);
        const below = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const above = rng.int(11, 90);
        return chooseMath(
          rng,
          [`Which value is greater than ${n}?`, `哪个值大于 ${n}？`],
          `${n} \\div 0.${below}`,
          [`${n} \\div ${tenths(above)}`, `${n} \\times 0.${below}`, `${n} - 0.${below}`],
          [
            `Dividing by $0.${below}$, a number below 1, gives more than ${n}. The other operations all make ${n} smaller.`,
            `除以小于 1 的 $0.${below}$，结果大于 ${n}。其他运算都使 ${n} 变小。`,
          ],
        );
      },
    ),
  ],
  "interpreting-negative-numbers": [
    skill(
      "a-depth-after-rising",
      ["A depth after rising", "上升之后的深度"],
      [
        "Heights below sea level are negative, so rising means adding. Starting from a negative height, a rise may stop below sea level or pass above it, and the sign shows which.",
        "海平面以下的高度是负数，所以上升就是加。从负的高度出发，上升后可能仍在海平面以下，也可能超过海平面，符号可以说明。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const a = rng.int(5, 60);
        const b = rng.int(2, 80);
        const answer = b - a === 0 ? 1 : b - a;
        const rise = answer + a;
        return integer(
          [
            `${who} is at $-${a}$ meters compared with sea level and rises ${rise} meters. What number gives the new height, in meters?`,
            `${who} 位于海平面 $-${a}$ 米处，上升了 ${rise} 米。新的高度用什么数表示（单位：米）？`,
          ],
          answer,
          [a + rise, -(a + rise), -answer],
          [`Rising adds: $-${a} + ${rise} = ${answer}$.`, `上升就是加：$-${a} + ${rise} = ${answer}$。`],
        );
      },
    ),
  ],
  "natural-numbers-integers-and-rational-numbers": [
    skill(
      "how-many-are-integers",
      ["How many are integers", "其中有几个整数"],
      [
        "A number's form can hide its kind. A fraction whose top divides evenly by its bottom is an integer, so simplify each number before classifying it, whatever it looks like.",
        "数的写法可能掩盖它的类型。分子能被分母整除的分数是整数，所以不管外观如何，都要先化简再分类。",
      ],
      (rng) => {
        const items: { latex: string; isInt: boolean }[] = [];
        const count = rng.int(4, 6);
        for (let i = 0; i < count; i++) {
          const kind = rng.int(0, 3);
          const d = rng.int(2, 6);
          const k = rng.int(1, 9);
          const sign = rng.bool() ? "-" : "";
          if (kind === 0) items.push({ latex: `${sign}${frac(d * k, d)}`, isInt: true });
          else if (kind === 1) items.push({ latex: `${sign}${k}`, isInt: true });
          else if (kind === 2) items.push({ latex: `${sign}${frac(d * k + 1, d)}`, isInt: false });
          else items.push({ latex: `${sign}${k}.5`, isInt: false });
        }
        const answer = items.filter((x) => x.isInt).length;
        return whole(
          [
            `How many of these numbers are integers? $$${items.map((x) => x.latex).join(",\\quad ")}$$`,
            `这些数中有几个是整数？$$${items.map((x) => x.latex).join(",\\quad ")}$$`,
          ],
          answer,
          [count, count - answer, answer + 1],
          [
            `Simplify the fractions first. Those with a top divisible by the bottom are integers, and the count is ${answer}.`,
            `先化简分数。分子能被分母整除的是整数，一共 ${answer} 个。`,
          ],
        );
      },
    ),
  ],
  "comparing-rational-numbers": [
    skill(
      "farthest-from-zero",
      ["Farthest from zero", "离零最远"],
      [
        "Distance from zero ignores the sign, so a very negative number can be farther from zero than a large positive one. Being farther from zero is not the same as being greater.",
        "到零的距离不看符号，所以很小的负数可能比很大的正数离零更远。离零更远不等于更大。",
      ],
      (rng) => {
        const big = rng.int(30, 95);
        const others = rng.sample([5, 8, 12, 15, 18, 21, 24, 28], 3) as number[];
        const asDec = (x: number) => tenths(x);
        const sign = rng.bool() ? "-" : "";
        return chooseMath(
          rng,
          ["Which number is farthest from zero?", "哪个数离零最远？"],
          `${sign}${asDec(big)}`,
          [`${sign === "" ? "-" : ""}${asDec(others[0]!)}`, asDec(others[1]!), `-${asDec(others[2]!)}`],
          [
            `Without signs, ${asDec(big)} is the largest distance, so it is the farthest from zero.`,
            `不看符号时，${asDec(big)} 的距离最大，所以它离零最远。`,
          ],
        );
      },
    ),
  ],
  "ordering-rational-numbers": [
    skill(
      "the-number-between-two-negatives",
      ["The number between two negatives", "两个负数之间的数"],
      [
        "Among negative numbers, the one nearer zero is the greater. So a number between two negatives must be nearer zero than one of them and farther from zero than the other.",
        "负数中离零较近的较大。所以两个负数之间的数，要比其中一个离零近，比另一个离零远。",
      ],
      (rng) => {
        const lo = rng.int(2, 30);
        const hi = lo + 1;
        const d = rng.pick([2, 4, 5]);
        const n = rng.int(1, d - 1);
        return chooseMath(
          rng,
          [`Which number lies between $-${hi}$ and $-${lo}$?`, `哪个数在 $-${hi}$ 和 $-${lo}$ 之间？`],
          `-${lo}${frac(n, d)}`,
          [`${lo}${frac(n, d)}`, `-${hi}${frac(n, d)}`, `-${lo - 1}${frac(n, d)}`],
          [
            `$-${lo}${frac(n, d)}$ is farther from zero than ${lo} and nearer than ${hi}, so it is between them.`,
            `$-${lo}${frac(n, d)}$ 比 ${lo} 离零远，比 ${hi} 离零近，所以在它们之间。`,
          ],
        );
      },
    ),
  ],
  "the-cartesian-coordinate-system": [
    skill(
      "reflecting-a-point-in-an-axis",
      ["Reflecting a point in an axis", "点关于坐标轴对称"],
      [
        "Reflecting a point in the $x$-axis changes the sign of its second coordinate, since the point moves up or down. Reflecting in the $y$-axis changes the sign of its first coordinate instead.",
        "关于 $x$ 轴对称时，点上下移动，第二个坐标变号。关于 $y$ 轴对称时，第一个坐标变号。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = a + rng.int(1, 9);
        const sa = rng.bool() ? a : -a;
        const sb = rng.bool() ? b : -b;
        const xAxis = rng.bool();
        return chooseMath(
          rng,
          xAxis
            ? [`Where does $(${sa}, ${sb})$ land after a reflection in the $x$-axis?`, `$(${sa}, ${sb})$ 关于 $x$ 轴对称的点是哪个？`]
            : [`Where does $(${sa}, ${sb})$ land after a reflection in the $y$-axis?`, `$(${sa}, ${sb})$ 关于 $y$ 轴对称的点是哪个？`],
          xAxis ? `(${sa}, ${-sb})` : `(${-sa}, ${sb})`,
          [xAxis ? `(${-sa}, ${sb})` : `(${sa}, ${-sb})`, `(${-sa}, ${-sb})`, `(${sb}, ${sa})`],
          xAxis
            ? [
                `The first coordinate stays and the second changes sign: $(${sa}, ${-sb})$.`,
                `第一个坐标不变，第二个变号：$(${sa}, ${-sb})$。`,
              ]
            : [
                `The second coordinate stays and the first changes sign: $(${-sa}, ${sb})$.`,
                `第二个坐标不变，第一个变号：$(${-sa}, ${sb})$。`,
              ],
        );
      },
    ),
  ],
  "rational-numbers-in-the-coordinate-plane": [
    skill(
      "distance-across-an-axis",
      ["Distance across an axis", "跨过坐标轴的距离"],
      [
        "When two points on a grid line are on opposite sides of an axis, their distances to the axis add. Subtracting those distances, as for points on one side, is the usual slip.",
        "网格线上的两点在坐标轴两侧时，它们到坐标轴的距离要相加。像同侧的点那样相减是常见错误。",
      ],
      (rng) => {
        const s = rng.int(-6, 6);
        const up = rng.int(1, 9) * 5;
        const down = rng.int(1, 9) * 5;
        const value = (x: number) => (x / 10).toFixed(1);
        const vertical = rng.bool();
        const p = vertical ? `(${s}, ${value(up)})` : `(${value(up)}, ${s})`;
        const q = vertical ? `(${s}, -${value(down)})` : `(-${value(down)}, ${s})`;
        return decimal(
          [`How far apart are the points $${p}$ and $${q}$?`, `点 $${p}$ 和 $${q}$ 相距多远？`],
          Q.of(up + down, 10),
          [Q.of(Math.abs(up - down), 10), Q.of(up + down, 100), Q.of(up, 10)],
          [
            `They are on opposite sides of the axis, so add: $${value(up)} + ${value(down)} = ${value(up + down)}$.`,
            `它们在坐标轴两侧，所以相加：$${value(up)} + ${value(down)} = ${value(up + down)}$。`,
          ],
        );
      },
    ),
  ],
  "solving-problems-in-the-coordinate-plane": [
    skill(
      "the-area-from-opposite-corners",
      ["The area from opposite corners", "由对角顶点求面积"],
      [
        "Two opposite corners of a rectangle with sides parallel to the axes give both side lengths. The width comes from the first coordinates and the height from the second coordinates.",
        "边平行于坐标轴的长方形，由两个对角顶点可以得到两条边长。宽来自第一个坐标，高来自第二个坐标。",
      ],
      (rng) => {
        const x1 = rng.int(-9, 2);
        const y1 = rng.int(-9, 2);
        const w = rng.int(2, 12);
        const h = rng.int(2, 12);
        const area = rng.bool();
        return whole(
          area
            ? [
                `A rectangle with sides parallel to the axes has opposite corners $(${x1}, ${y1})$ and $(${x1 + w}, ${y1 + h})$. What is its area?`,
                `边平行于坐标轴的长方形有对角顶点 $(${x1}, ${y1})$ 和 $(${x1 + w}, ${y1 + h})$。它的面积是多少？`,
              ]
            : [
                `A rectangle with sides parallel to the axes has opposite corners $(${x1}, ${y1})$ and $(${x1 + w}, ${y1 + h})$. What is its perimeter?`,
                `边平行于坐标轴的长方形有对角顶点 $(${x1}, ${y1})$ 和 $(${x1 + w}, ${y1 + h})$。它的周长是多少？`,
              ],
          area ? w * h : 2 * (w + h),
          area ? [2 * (w + h), w + h, w * h + 1] : [w * h, w + h, 2 * (w + h) + 2],
          [
            `The width is ${w} and the height is ${h}, so the ${area ? `area is $${w} \\times ${h} = ${w * h}$` : `perimeter is $2(${w} + ${h}) = ${2 * (w + h)}$`}.`,
            `宽是 ${w}，高是 ${h}，所以${area ? `面积是 $${w} \\times ${h} = ${w * h}$` : `周长是 $2(${w} + ${h}) = ${2 * (w + h)}$`}。`,
          ],
        );
      },
    ),
  ],
  "introduction-to-algebraic-expressions": [
    skill(
      "less-than-goes-backwards",
      ["Less than goes backwards", "“比……少”的顺序"],
      [
        "The phrase less than reverses the order of the words. So five less than a number means the number minus five, and writing the five first would describe a different quantity.",
        "“比……少”的顺序要注意。比一个数少 5，是这个数减 5；把 5 写在前面，表示的就是另一个量了。",
      ],
      (rng) => {
        const v = rng.pick(["x", "y", "m", "n", "t", "w", "p"]);
        const a = rng.int(2, 40);
        return chooseMath(
          rng,
          [`Write an expression for ${a} less than $${v}$.`, `写出比 $${v}$ 少 ${a} 的表达式。`],
          `${v} - ${a}`,
          [`${a} - ${v}`, `${a}${v}`, `${v} + ${a}`],
          [`Start with $${v}$ and take ${a} away: $${v} - ${a}$.`, `从 $${v}$ 开始，减去 ${a}：$${v} - ${a}$。`],
        );
      },
    ),
  ],
  "constructing-algebraic-expressions": [
    skill(
      "a-fee-and-a-rate",
      ["A fee and a rate", "固定费用加单价"],
      [
        "Many costs have a part that is paid once and a part that grows with the amount used. The growing part is a product with the variable, and the part paid once is added to it.",
        "很多费用有一次性的部分和随用量增长的部分。增长的部分是含变量的积，一次性的部分加在后面。",
      ],
      (rng) => {
        const fee = rng.int(2, 30);
        let rate = rng.int(2, 12);
        if (rate === fee) rate += 1;
        const v = rng.pick(["m", "h", "d", "k"]);
        const unit: Pair =
          v === "m" ? ["miles", "英里"] : v === "h" ? ["hours", "小时"] : v === "d" ? ["days", "天"] : ["kilometers", "千米"];
        return chooseMath(
          rng,
          [
            `A rental costs ${fee} dollars plus ${rate} dollars for each of $${v}$ ${unit[0]}. Which expression gives the total cost in dollars?`,
            `租用费用是 ${fee} 美元，每${unit[1]}再加 ${rate} 美元，共 $${v}$ ${unit[1]}。哪个表达式表示总费用（美元）？`,
          ],
          `${rate}${v} + ${fee}`,
          [`${fee}${v} + ${rate}`, `(${fee} + ${rate})${v}`, `${fee} + ${rate} + ${v}`],
          [
            `The ${rate} dollars repeat $${v}$ times, which is $${rate}${v}$, and the ${fee} dollars are paid once.`,
            `${rate} 美元重复 $${v}$ 次，即 $${rate}${v}$，${fee} 美元只付一次。`,
          ],
        );
      },
    ),
  ],
  "evaluating-algebraic-expressions": [
    skill(
      "the-exponent-binds-first",
      ["The exponent binds first", "指数先算"],
      [
        "In $3x^{2}$ the exponent applies only to $x$, so the squaring comes before the multiplying. Parentheses are needed to square the whole product, as in $(3x)^{2}$.",
        "在 $3x^{2}$ 中，指数只作用于 $x$，所以先平方再乘。要把整个积平方，需要括号，如 $(3x)^{2}$。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const x = rng.int(2, 9);
        const v = rng.pick(["x", "y", "n", "t"]);
        return whole(
          [`Evaluate $${a}${v}^{2}$ when $${v} = ${x}$.`, `当 $${v} = ${x}$ 时，求 $${a}${v}^{2}$ 的值。`],
          a * x * x,
          [(a * x) ** 2, 2 * a * x, a + x * x],
          [
            `Square first: $${x}^{2} = ${x * x}$. Then $${a} \\times ${x * x} = ${a * x * x}$.`,
            `先平方：$${x}^{2} = ${x * x}$。再算 $${a} \\times ${x * x} = ${a * x * x}$。`,
          ],
        );
      },
    ),
  ],
  "identifying-terms-in-linear-expressions": [
    skill(
      "a-term-keeps-its-sign",
      ["A term keeps its sign", "项带着符号"],
      [
        "A term includes the sign in front of it, because subtracting is the same as adding the opposite. So in $5x - 3y$ the second term is $-3y$, and not $3y$.",
        "项包括它前面的符号，因为减去一个数等于加上它的相反数。所以在 $5x - 3y$ 中，第二项是 $-3y$，而不是 $3y$。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = rng.int(2, 15);
        const c = rng.int(2, 15);
        const [u, v] = rng.sample(["x", "y", "m", "n", "p", "t"], 2) as [string, string];
        return chooseMath(
          rng,
          [
            `What is the term containing $${v}$ in $${a}${u} - ${b}${v} + ${c}$?`,
            `在 $${a}${u} - ${b}${v} + ${c}$ 中，含 $${v}$ 的项是什么？`,
          ],
          `-${b}${v}`,
          [`${b}${v}`, `${v}`, `-${b}`],
          [`The sign in front belongs to the term, so it is $-${b}${v}$.`, `前面的符号属于这一项，所以是 $-${b}${v}$。`],
        );
      },
    ),
  ],
  "identifying-coefficients-and-constants": [
    skill(
      "the-sum-of-the-coefficients",
      ["The sum of the coefficients", "系数之和"],
      [
        "Each coefficient carries the sign in front of its term, and a variable alone has coefficient 1 or $-1$. A constant has no variable, so it is not counted among the coefficients.",
        "每个系数都带着项前面的符号，单独的变量系数是 1 或 $-1$。常数项没有变量，不算系数。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const c = rng.int(2, 30);
        const minus = rng.bool();
        const [u, v] = rng.sample(["x", "y", "m", "n", "p", "t"], 2) as [string, string];
        const second = minus ? -1 : 1;
        return integer(
          [
            `What is the sum of the coefficients of $${u}$ and $${v}$ in $${a}${u} ${minus ? "-" : "+"} ${v} + ${c}$?`,
            `在 $${a}${u} ${minus ? "-" : "+"} ${v} + ${c}$ 中，$${u}$ 和 $${v}$ 的系数之和是多少？`,
          ],
          a + second,
          [a, a + second + c, a - second],
          [
            `The coefficients are ${a} and ${second}, and their sum is ${a + second}. The constant ${c} is not a coefficient.`,
            `系数是 ${a} 和 ${second}，和是 ${a + second}。常数 ${c} 不是系数。`,
          ],
        );
      },
    ),
  ],
  "identifying-like-terms-in-linear-expressions": [
    skill(
      "terms-left-after-combining",
      ["Terms left after combining", "合并后还有几项"],
      [
        "Combining like terms leaves one term for each different variable, and one for the constants. So the number of terms afterward is the number of kinds of term, not the number at the start.",
        "合并同类项后，每个不同的变量留下一项，常数也留下一项。所以合并后的项数是项的种类数，而不是开始时的项数。",
      ],
      (rng) => {
        const [u, v] = rng.sample(["x", "y", "m", "n", "p", "t"], 2) as [string, string];
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const d = rng.int(1, 9);
        const e = rng.int(1, 9);
        const form = rng.int(0, 2);
        const [text, count] =
          form === 0
            ? ([`${a}${u} + ${d} + ${b}${u} + ${c}${v}`, 3] as const)
            : form === 1
              ? ([`${a}${u} + ${b}${u} + ${d} + ${e}`, 2] as const)
              : ([`${a}${u} + ${d} + ${c}${v} + ${b}${u} + ${e}`, 3] as const);
        return whole(
          [`How many terms does $${text}$ have after like terms are combined?`, `$${text}$ 合并同类项后有几项？`],
          count,
          [form === 2 ? 5 : 4, count === 3 ? 2 : 3, 1],
          [
            `There is one term for each kind: ${count === 3 ? `$${u}$, $${v}$ and a constant` : `$${u}$ and a constant`}. That makes ${count}.`,
            `每种留下一项：${count === 3 ? `$${u}$、$${v}$ 和常数` : `$${u}$ 和常数`}，共 ${count} 项。`,
          ],
        );
      },
    ),
  ],
  "the-greatest-common-factor-of-two-linear-expressions": [
    skill(
      "the-gcf-of-three-terms",
      ["The GCF of three terms", "三项的最大公因数"],
      [
        "A common factor must divide every term. If even one term has no variable, the variable cannot be part of the greatest common factor, however many of the other terms contain it.",
        "公因数必须能整除每一项。只要有一项不含变量，这个变量就不能在最大公因数中，不管其他项有多少含它。",
      ],
      (rng) => {
        const g = rng.int(2, 9);
        const [a, b, c] = rng.pick<[number, number, number]>([
          [2, 3, 5],
          [3, 4, 5],
          [2, 5, 7],
          [3, 5, 7],
          [4, 5, 7],
          [2, 3, 7],
          [5, 6, 7],
        ]);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        return chooseMath(
          rng,
          [
            `Find the greatest common factor of $${g * a}${v}$, $${g * b}${v}$ and $${g * c}$.`,
            `求 $${g * a}${v}$、$${g * b}${v}$ 和 $${g * c}$ 的最大公因数。`,
          ],
          `${g}`,
          [`${g}${v}`, `${v}`, `${g * c}`],
          [
            `${g} divides all three numbers, and $${g * c}$ has no $${v}$, so the factor is ${g}.`,
            `${g} 能整除三个数，而 $${g * c}$ 不含 $${v}$，所以最大公因数是 ${g}。`,
          ],
        );
      },
    ),
  ],
  "applying-the-distributive-law-to-linear-expressions": [
    skill(
      "the-missing-number-in-a-distribution",
      ["The missing number in a distribution", "分配律中缺少的数"],
      [
        "Every term inside the parentheses gets multiplied by the outside factor. So a missing number inside is found by dividing the matching term of the expanded form by that factor.",
        "括号内的每一项都要乘外面的因数。所以括号内缺少的数，用展开式中对应的项除以这个因数求出。",
      ],
      (rng) => {
        const k = rng.int(2, 12);
        const a = rng.int(2, 9);
        const b = rng.int(2, 15);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        return whole(
          [
            `Fill in the box: $$${k}(${a}${v} + \\square) = ${k * a}${v} + ${k * b}$$`,
            `填方框：$$${k}(${a}${v} + \\square) = ${k * a}${v} + ${k * b}$$`,
          ],
          b,
          [k * b, k * b - k, b + k],
          [`$${k} \\times \\square = ${k * b}$, so the box holds ${b}.`, `$${k} \\times \\square = ${k * b}$，所以方框里是 ${b}。`],
        );
      },
    ),
  ],
  "factoring-linear-expressions": [
    skill(
      "the-one-left-behind",
      ["The 1 left behind", "留下的 1"],
      [
        "When a term equals the common factor, dividing it by the factor leaves 1, and not nothing. Forgetting that 1 gives an expression that no longer expands back to the original.",
        "某一项等于公因数时，除以公因数得 1，不是什么都没有。漏掉这个 1，展开后就不等于原式了。",
      ],
      (rng) => {
        const g = rng.int(2, 15);
        const a = rng.int(2, 9);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        return chooseMath(
          rng,
          [`Factor $${g * a}${v} + ${g}$.`, `因式分解 $${g * a}${v} + ${g}$。`],
          `${g}(${a}${v} + 1)`,
          [`${g}(${a}${v})`, `${g}(${a}${v} + ${g})`, `${g * a}(${v} + ${g})`],
          [
            `$${g} \\div ${g} = 1$, so a 1 stays in the parentheses. Check: $${g} \\times 1 = ${g}$, the original term.`,
            `$${g} \\div ${g} = 1$，所以括号里留下 1。检验：$${g} \\times 1 = ${g}$，正是原来的项。`,
          ],
        );
      },
    ),
  ],
  "identifying-equivalent-expressions": [
    skill(
      "the-one-that-is-not-equivalent",
      ["The one that is not equivalent", "不等价的表达式"],
      [
        "Two expressions are equivalent when they agree for every value of the variable. A single value that gives different results shows that they are not equivalent, so it is a quick test.",
        "两个表达式对变量的每个值都相等时才等价。只要有一个值使结果不同，就说明不等价，所以这是快速的检验方法。",
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const a = rng.int(2, 15);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        return chooseMath(
          rng,
          [`Which expression is not equivalent to $${k}(${v} + ${a})$?`, `哪个表达式与 $${k}(${v} + ${a})$ 不等价？`],
          `${k}${v} + ${a}`,
          [`${k}${v} + ${k * a}`, `${k}(${a} + ${v})`, `${k * a} + ${k}${v}`],
          [
            `$${k}${v} + ${a}$ multiplies only $${v}$ by ${k}, so ${a} was never multiplied. The others all give $${k}${v} + ${k * a}$.`,
            `$${k}${v} + ${a}$ 只把 $${v}$ 乘了 ${k}，${a} 没有乘。其他的都等于 $${k}${v} + ${k * a}$。`,
          ],
        );
      },
    ),
  ],
  "identifying-solutions-to-linear-equations": [
    skill(
      "the-equation-a-value-solves",
      ["The equation a value solves", "这个值是哪个方程的解"],
      [
        "A value solves an equation when substituting it makes both sides equal. To find which equation it solves, substitute it into each and compare the two sides.",
        "代入一个值后两边相等，它就是方程的解。要找它是哪个方程的解，就逐个代入，比较两边。",
      ],
      (rng) => {
        const x = rng.int(2, 12);
        const a = rng.int(2, 9);
        const b = rng.int(1, 20);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        return chooseMath(
          rng,
          [`For which equation is $${v} = ${x}$ a solution?`, `$${v} = ${x}$ 是哪个方程的解？`],
          `${a}${v} + ${b} = ${a * x + b}`,
          [`${a}${v} + ${b} = ${a * x + b + a}`, `${a}${v} - ${b} = ${a * x + b}`, `${a}(${v} + ${b}) = ${a * x + b}`],
          [`$${a} \\times ${x} + ${b} = ${a * x + b}$, so both sides agree.`, `$${a} \\times ${x} + ${b} = ${a * x + b}$，两边相等。`],
        );
      },
    ),
  ],
  "one-step-addition-equations": [
    skill(
      "a-negative-solution-to-an-addition",
      ["A negative solution", "负数解"],
      [
        "When the number added is larger than the total, the unknown must be negative. Subtracting from both sides still works, as adding a negative number makes a number smaller.",
        "加上的数比和还大时，未知数一定是负数。两边同时减去这个数仍然可行，因为加负数会使数变小。",
      ],
      (rng) => {
        const b = rng.int(2, 40);
        const a = b + rng.int(1, 40);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        return integer(
          [`Solve $${v} + ${a} = ${b}$.`, `解方程 $${v} + ${a} = ${b}$。`],
          b - a,
          [a - b, a + b, -(a + b)],
          [`Subtract ${a} from both sides: $${v} = ${b} - ${a} = ${b - a}$.`, `两边同时减去 ${a}：$${v} = ${b} - ${a} = ${b - a}$。`],
        );
      },
    ),
  ],
  "one-step-subtraction-equations": [
    skill(
      "subtracting-the-variable-with-a-negative-solution",
      ["Subtracting the variable, with a negative solution", "减去未知数时的负数解"],
      [
        "If a number minus the unknown is larger than the number, then the unknown was negative. Taking away a negative number makes a value larger, and the solution can be checked by substituting.",
        "如果一个数减去未知数后比这个数还大，未知数就是负数。减去负数使值变大，解可以代入检验。",
      ],
      (rng) => {
        const a = rng.int(2, 40);
        const b = a + rng.int(1, 40);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        return integer(
          [`Solve $${a} - ${v} = ${b}$.`, `解方程 $${a} - ${v} = ${b}$。`],
          a - b,
          [b - a, a + b, -(a + b)],
          [
            `$${v} = ${a} - ${b} = ${a - b}$. Check: $${a} - (${a - b}) = ${b}$.`,
            `$${v} = ${a} - ${b} = ${a - b}$。检验：$${a} - (${a - b}) = ${b}$。`,
          ],
        );
      },
    ),
  ],
  "one-step-multiplication-equations-containing-fractions": [
    skill(
      "a-fraction-of-an-unknown-number",
      ["A fraction of an unknown number", "未知数的几分之几"],
      [
        "When a fraction of a number is known, write an equation and multiply both sides by the reciprocal. The answer should be larger than the known part if the fraction is less than 1.",
        "已知一个数的几分之几时，列方程并在两边同乘倒数。分数小于 1 时，答案应比已知部分大。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const n = rng.int(2, d - 1);
        const k = rng.int(2, 20);
        const part = n * k;
        const who = rng.pick(earlyNames);
        return whole(
          [
            `${who} has read ${part} pages, which is $${frac(n, d)}$ of a book. How many pages does the book have?`,
            `${who} 读了 ${part} 页，是一本书的 $${frac(n, d)}$。这本书有多少页？`,
          ],
          d * k,
          [Math.round((part * n) / d) === d * k ? d * k + 1 : Math.round((part * n) / d), part + d, part * d],
          [
            `$${frac(n, d)}p = ${part}$, so $p = ${part} \\times ${frac(d, n)} = ${d * k}$.`,
            `$${frac(n, d)}p = ${part}$，所以 $p = ${part} \\times ${frac(d, n)} = ${d * k}$。`,
          ],
        );
      },
    ),
  ],
  "one-step-division-equations": [
    skill(
      "a-division-equation-with-a-negative-quotient",
      ["A negative quotient", "商为负数"],
      [
        "A negative quotient with a positive divisor means the number that was divided is negative. Multiplying both sides by the divisor keeps the sign and gives the solution.",
        "除数是正数而商是负数时，被除数是负数。两边同乘除数，符号不变，就得到解。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const q = rng.int(2, 15);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        return integer(
          [`Solve $${frac(v, d)} = -${q}$.`, `解方程 $${frac(v, d)} = -${q}$。`],
          -d * q,
          [d * q, -d - q, -q],
          [
            `Multiply both sides by ${d}: $${v} = ${d} \\times (-${q}) = ${-d * q}$.`,
            `两边同乘 ${d}：$${v} = ${d} \\times (-${q}) = ${-d * q}$。`,
          ],
        );
      },
    ),
  ],
  "modeling-real-world-problems-using-one-step-equations": [
    skill(
      "choosing-the-equation-for-a-reverse-story",
      ["The equation for a story told backwards", "倒着讲的故事的方程"],
      [
        "A story gives events in order, and the equation follows them from the unknown start. Subtraction in the story stays subtraction in the equation, even though solving it will need adding.",
        "故事按顺序讲述事件，方程从未知的开始量写起。故事中的减法在方程中仍是减法，尽管解方程时要用加法。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const give = rng.int(3, 30);
        const left = rng.int(5, 60);
        const v = rng.pick(["c", "s", "n", "k"]);
        return chooseMath(
          rng,
          [
            `${who} gave away ${give} cards and now has ${left}. If $${v}$ is the number of cards at the start, which equation fits?`,
            `${who} 送出 ${give} 张卡片，现在有 ${left} 张。设开始时有 $${v}$ 张，哪个方程符合？`,
          ],
          `${v} - ${give} = ${left}`,
          [`${v} + ${give} = ${left}`, `${give} - ${v} = ${left}`, `${give}${v} = ${left}`],
          [
            `Start with $${v}$ and take away ${give} to reach ${left}: $${v} - ${give} = ${left}$.`,
            `从 $${v}$ 开始，减去 ${give}，得到 ${left}：$${v} - ${give} = ${left}$。`,
          ],
        );
      },
    ),
  ],
  "solving-real-world-problems-using-one-step-equations": [
    skill(
      "solving-and-using-the-answer",
      ["Solving and using the answer", "解出后再使用"],
      [
        "Sometimes the solution of an equation is only a step toward what a story asks. Solve for the unknown, and then read the question again to see what must still be done with it.",
        "有时方程的解只是回答问题的一步。解出未知数后，再读一遍问题，看还要用它做什么。",
      ],
      (rng) => {
        const each = rng.int(3, 12);
        const n = rng.int(3, 12);
        const more = rng.int(2, 9);
        const total = each * n;
        return whole(
          [
            `${n} equal tickets cost ${total} dollars in all. How much would ${n + more} of the same tickets cost, in dollars?`,
            `${n} 张相同的票共 ${total} 美元。${n + more} 张同样的票要多少美元？`,
          ],
          each * (n + more),
          [total + more, each, total * more],
          [
            `$${n}p = ${total}$ gives $p = ${each}$, and $${n + more} \\times ${each} = ${each * (n + more)}$.`,
            `$${n}p = ${total}$，得 $p = ${each}$，$${n + more} \\times ${each} = ${each * (n + more)}$。`,
          ],
        );
      },
    ),
  ],
  "representing-inequalities-on-number-lines": [
    skill(
      "whole-numbers-on-the-graph",
      ["Whole numbers on the graph", "图像上的整数"],
      [
        "A filled circle includes its endpoint and an open circle leaves it out. So counting the whole numbers in a graph between two endpoints depends on the kind of circle at each end.",
        "实心圆包含端点，空心圆不包含。所以数两个端点之间图像上的整数时，要看两端是什么圆。",
      ],
      (rng) => {
        const lo = rng.int(-9, 15);
        const hi = lo + rng.int(3, 14);
        const leftIn = rng.bool();
        const rightIn = rng.bool();
        const count = hi - lo - 1 + (leftIn ? 1 : 0) + (rightIn ? 1 : 0);
        const expr = `${lo} ${leftIn ? "\\le" : "<"} x ${rightIn ? "\\le" : "<"} ${hi}`;
        return whole(
          [`How many integers satisfy $${expr}$?`, `有多少个整数满足 $${expr}$？`],
          count,
          [hi - lo, hi - lo + 1, hi - lo - 1 === count ? hi - lo - 2 : hi - lo - 1],
          [
            `Between ${lo} and ${hi} strictly there are ${hi - lo - 1} integers, and ${leftIn || rightIn ? "each included endpoint adds one" : "neither endpoint is included"}, so ${count}.`,
            `严格在 ${lo} 和 ${hi} 之间有 ${hi - lo - 1} 个整数，${leftIn || rightIn ? "每个包含的端点再加一个" : "两个端点都不包含"}，所以是 ${count} 个。`,
          ],
        );
      },
    ),
  ],
  "introduction-to-two-variable-equations": [
    skill(
      "an-equation-from-a-table",
      ["An equation from a table", "由表格得到方程"],
      [
        "When $y$ rises by the same amount for each step of $x$, that amount is the multiplier of $x$. The number still needed to match the table is then added on as a constant.",
        "$x$ 每增加 1，$y$ 增加相同的量时，这个量就是 $x$ 的乘数。还需要补上的数作为常数加上。",
      ],
      (rng) => {
        const m = rng.int(2, 9);
        let b = rng.int(1, 12);
        if (b === m) b += 1;
        const x0 = rng.int(1, 4);
        const pts = [x0, x0 + 1, x0 + 2].map((x) => `(${x}, ${m * x + b})`).join(",\\ ");
        return chooseMath(
          rng,
          [`The pairs $(x, y)$ are $${pts}$. Which equation fits them all?`, `数对 $(x, y)$ 是 $${pts}$。哪个方程符合所有数对？`],
          `y = ${m}x + ${b}`,
          [`y = ${b}x + ${m}`, `y = x + ${m + b}`, `y = ${m}x + ${b + 1}`],
          [
            `$y$ rises by ${m} for each step, and at $x = ${x0}$ we need $${m} \\times ${x0} + ${b} = ${m * x0 + b}$.`,
            `$x$ 每增加 1，$y$ 增加 ${m}；当 $x = ${x0}$ 时，$${m} \\times ${x0} + ${b} = ${m * x0 + b}$。`,
          ],
        );
      },
    ),
  ],
  "two-variable-equations-solving-for-the-independent-variable": [
    skill(
      "the-input-with-a-fee-and-a-rate",
      ["The input, with a fee and a rate", "有固定费用时求输入"],
      [
        "With both a fee and a rate, two steps undo the rule. First take away the fee from the output, and then divide by the rate, reversing the order in which the rule was applied.",
        "既有固定费用又有单价时，要两步还原。先从输出中减去固定费用，再除以单价，与规则的顺序相反。",
      ],
      (rng) => {
        const rate = rng.int(2, 12);
        const fee = rng.int(1, 30);
        const x = rng.int(2, 25);
        const y = rate * x + fee;
        return whole(
          [
            `A cost $c$ in dollars is $c = ${rate}h + ${fee}$, where $h$ is the number of hours. For how many hours is the cost ${y} dollars?`,
            `费用 $c$（美元）满足 $c = ${rate}h + ${fee}$，其中 $h$ 是小时数。费用为 ${y} 美元时是多少小时？`,
          ],
          x,
          [Math.floor(y / rate), y - fee, y - rate],
          [
            `$${y} - ${fee} = ${y - fee}$, and $${y - fee} \\div ${rate} = ${x}$.`,
            `$${y} - ${fee} = ${y - fee}$，$${y - fee} \\div ${rate} = ${x}$。`,
          ],
        );
      },
    ),
  ],
};
