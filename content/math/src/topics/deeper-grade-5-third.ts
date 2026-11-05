// A third knowledge point for the first 5th Grade Math topics on expressions, whole-number operations
// and fraction operations: the reverse question, a useful check and the usual traps.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { earlyNames, lowestNumerator } from "../early-grades-kit.ts";
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

/** frac writes a fraction in LaTeX. */
const frac = (n: number | string, d: number | string) => `\\frac{${n}}{${d}}`;

/** commas writes a whole number with thousands separators for LaTeX. */
const commas = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}");

/** gcd finds the greatest common factor of two whole numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** lcm finds the least common multiple of two whole numbers. */
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

/** deeperGrade5ThirdPoints holds the third knowledge points of these 5th Grade Math topics, by topic. */
export const deeperGrade5ThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "evaluating-whole-number-expressions": [
    skill(
      "where-the-parentheses-go",
      ["Where the parentheses go", "括号放在哪里"],
      [
        "Parentheses decide which operation happens first, so moving them can change the value. To match a given value, evaluate each placement in turn rather than guessing from the look of it.",
        "括号决定先做哪个运算，所以移动括号可能改变结果。要得到给定的值，就逐个计算每种放法，不要凭外观猜测。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const c = rng.int(2, 9);
        const value = (a + b) * c;
        return chooseMath(
          rng,
          [`Which expression has the value ${value}?`, `哪个表达式的值是 ${value}？`],
          `(${a} + ${b}) \\times ${c}`,
          [`${a} + (${b} \\times ${c})`, `(${a} \\times ${c}) + ${b}`, `(${a} + ${c}) \\times ${b + (b + c === a + b ? 1 : 0)}`],
          [
            `$(${a} + ${b}) \\times ${c} = ${a + b} \\times ${c} = ${value}$. Multiplying first would give a different value.`,
            `$(${a} + ${b}) \\times ${c} = ${a + b} \\times ${c} = ${value}$。先做乘法会得到不同的值。`,
          ],
        );
      },
    ),
  ],
  "creating-and-interpreting-whole-number-expressions": [
    skill(
      "an-expression-for-a-story",
      ["An expression for a story", "为故事写表达式"],
      [
        "In a story, each group of equal amounts becomes a product, and what is given away afterward is subtracted from that product. Parentheses are needed only when a sum or difference must be found first.",
        "在故事中，每一组相等的量写成积，之后送出的量从积中减去。只有需要先求和或差时才用括号。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const p = rng.int(3, 12);
        const n = rng.int(4, 24);
        const g = rng.int(2, 15);
        return chooseMath(
          rng,
          [
            `${who} buys ${p} packs of ${n} pens and gives away ${g} pens. Which expression gives the pens that remain?`,
            `${who} 买了 ${p} 包笔，每包 ${n} 支，送出 ${g} 支。哪个表达式表示剩下的笔数？`,
          ],
          `${p} \\times ${n} - ${g}`,
          [`${p} \\times (${n} - ${g})`, `${p} + ${n} - ${g}`, `${g} - ${p} \\times ${n}`],
          [
            `All the pens are $${p} \\times ${n}$, and the ${g} given away come off once, not from each pack.`,
            `所有的笔是 $${p} \\times ${n}$，送出的 ${g} 支只减一次，不是每包都减。`,
          ],
        );
      },
    ),
  ],
  "creating-whole-number-expressions-from-terminology": [
    skill(
      "the-words-for-an-expression",
      ["The words for an expression", "表达式的文字说法"],
      [
        "The outermost operation names the expression. So $(a + b) \\div c$ is the quotient of a sum by $c$, while $a + b \\div c$ is the sum of $a$ and a quotient.",
        "最后做的运算决定表达式的名称。所以 $(a + b) \\div c$ 是和除以 $c$ 的商，而 $a + b \\div c$ 是 $a$ 与一个商的和。",
      ],
      (rng) => {
        const a = rng.int(10, 90);
        const b = rng.int(10, 90);
        const c = rng.int(2, 9);
        return choose(
          rng,
          [`Which description matches $(${a} + ${b}) \\div ${c}$?`, `哪种说法与 $(${a} + ${b}) \\div ${c}$ 相符？`],
          [`the sum of ${a} and ${b}, divided by ${c}`, `${a} 与 ${b} 的和除以 ${c}`],
          [
            [`${a} plus the quotient of ${b} and ${c}`, `${a} 加上 ${b} 除以 ${c} 的商`],
            [`the sum of ${a} and ${b}, times ${c}`, `${a} 与 ${b} 的和乘 ${c}`],
            [`${c} divided by the sum of ${a} and ${b}`, `${c} 除以 ${a} 与 ${b} 的和`],
          ],
          [`The parentheses are done first, and the last operation is the division by ${c}.`, `先算括号，最后一步是除以 ${c}。`],
        );
      },
    ),
  ],
  "additive-comparisons-of-whole-number-expressions": [
    skill(
      "two-changes-at-once",
      ["Two changes at once", "同时有两处变化"],
      [
        "When both parts of a sum change, the sum changes by the combined effect. An increase and a decrease partly cancel, so the difference can be found without adding up the large numbers.",
        "和的两部分都变化时，和的变化是两者合起来的效果。增加和减少会部分抵消，所以不必算大数的和就能求出差。",
      ],
      (rng) => {
        const x = rng.int(1000, 4000);
        const y = rng.int(1000, 4000);
        const down = rng.int(5, 90);
        const up = down + rng.int(5, 90);
        return whole(
          [
            `How much greater is $${commas(x + up)} + ${commas(y - down)}$ than $${commas(x)} + ${commas(y)}$?`,
            `$${commas(x + up)} + ${commas(y - down)}$ 比 $${commas(x)} + ${commas(y)}$ 大多少？`,
          ],
          up - down,
          [up + down, up, down],
          [
            `The first number rises by ${up} and the second falls by ${down}, so the sum rises by $${up} - ${down} = ${up - down}$.`,
            `第一个数增加 ${up}，第二个数减少 ${down}，所以和增加 $${up} - ${down} = ${up - down}$。`,
          ],
        );
      },
    ),
  ],
  "multiplicative-comparisons-of-whole-number-expressions": [
    skill(
      "the-factor-that-scales",
      ["The factor that scales", "放大的因数"],
      [
        "When two products share a factor, comparing them only needs the other factor. To make one product a given number of times as large, multiply the other factor by that number.",
        "两个积有相同的因数时，比较它们只需看另一个因数。要使一个积变成若干倍，就把另一个因数乘这个倍数。",
      ],
      (rng) => {
        const k = rng.int(2, 12);
        const n = rng.int(2, 9);
        const x = rng.int(100, 400);
        const y = rng.int(10, 90);
        return whole(
          [
            `$\\square \\times (${x} + ${y})$ is ${n} times as large as $${k} \\times (${x} + ${y})$. What number goes in the box?`,
            `$\\square \\times (${x} + ${y})$ 是 $${k} \\times (${x} + ${y})$ 的 ${n} 倍。方框里填几？`,
          ],
          k * n,
          [k + n, k, n],
          [
            `Both share the factor $(${x} + ${y})$, so the other factor must be $${k} \\times ${n} = ${k * n}$.`,
            `两者都有因数 $(${x} + ${y})$，所以另一个因数是 $${k} \\times ${n} = ${k * n}$。`,
          ],
        );
      },
    ),
  ],
  "comparing-negative-numbers": [
    skill(
      "how-far-apart-two-temperatures-are",
      ["How far apart two temperatures are", "两个温度相差多少"],
      [
        "On a thermometer, two temperatures below zero are compared by their distance from zero. The one further below is colder, and the gap between them is the difference of those distances.",
        "在温度计上，两个零下温度通过它们到零的距离来比较。离零更远的更冷，它们之间的差就是两个距离的差。",
      ],
      (rng) => {
        const a = rng.int(2, 30);
        const b = a + rng.int(1, 25);
        return whole(
          [
            `One town is at $-${a}$ degrees and another is at $-${b}$ degrees. How many degrees colder is the colder town?`,
            `一个城镇的气温是 $-${a}$ 度，另一个是 $-${b}$ 度。较冷的城镇冷多少度？`,
          ],
          b - a,
          [a + b, b, a],
          [
            `$-${b}$ is colder because it is further below zero, by $${b} - ${a} = ${b - a}$ degrees.`,
            `$-${b}$ 离零更远，所以更冷，冷 $${b} - ${a} = ${b - a}$ 度。`,
          ],
        );
      },
    ),
  ],
  "multiplying-numbers-by-powers-of-ten-using-place-value": [
    skill(
      "zeros-at-the-end-of-a-product",
      ["Zeros at the end of a product", "积末尾的零"],
      [
        "Multiplying by a power of ten adds as many zeros as the power has, on top of any the number already ends in. So $50 \\times 1000$ ends in four zeros, not three.",
        "乘 10 的幂时，增加的零的个数等于这个幂的零的个数，还要算上原数末尾的零。所以 $50 \\times 1000$ 末尾有四个零，不是三个。",
      ],
      (rng) => {
        const own = rng.int(0, 2);
        const lead = rng.pick([12, 13, 23, 37, 41, 56, 7, 9, 3, 81]);
        const p = rng.int(1, 5);
        const n = lead * 10 ** own;
        return whole(
          [
            `How many zeros are at the end of $${commas(n)} \\times ${commas(10 ** p)}$?`,
            `$${commas(n)} \\times ${commas(10 ** p)}$ 的末尾有几个零？`,
          ],
          own + p,
          [p, own === 0 ? p + 1 : own, own + p + 1],
          [
            `$${commas(10 ** p)}$ brings ${p} and $${commas(n)}$ already has ${own}, for ${own + p} in all.`,
            `$${commas(10 ** p)}$ 带来 ${p} 个，$${commas(n)}$ 本身有 ${own} 个，共 ${own + p} 个。`,
          ],
        );
      },
    ),
  ],
  "two-digit-by-one-digit-multiplication": [
    skill(
      "the-missing-digit-of-a-factor",
      ["The missing digit of a factor", "因数中缺少的数字"],
      [
        "A missing digit can be found by undoing the multiplication: divide the product by the one-digit factor. The quotient is the whole two-digit factor, and its digits can be read off.",
        "缺少的数字可以用除法求：积除以一位数因数。商就是那个两位数，从中读出数字。",
      ],
      (rng) => {
        const tens = rng.int(1, 9);
        const ones = rng.int(1, 9);
        const f = rng.int(3, 9);
        const n = tens * 10 + ones;
        const missTens = rng.bool();
        return whole(
          [
            `What digit goes in the box? $$${missTens ? `\\square ${ones}` : `${tens} \\square`} \\times ${f} = ${n * f}$$`,
            `方框里填哪个数字？$$${missTens ? `\\square ${ones}` : `${tens} \\square`} \\times ${f} = ${n * f}$$`,
          ],
          missTens ? tens : ones,
          [missTens ? ones : tens, f, missTens ? tens + 1 : ones + 1],
          [
            `$${n * f} \\div ${f} = ${n}$, so the digit is ${missTens ? tens : ones}.`,
            `$${n * f} \\div ${f} = ${n}$，所以这个数字是 ${missTens ? tens : ones}。`,
          ],
        );
      },
    ),
  ],
  "three-and-four-digit-by-one-digit-multiplication": [
    skill(
      "the-ones-digit-of-a-product",
      ["The ones digit of a product", "积的个位数字"],
      [
        "The ones digit of a product depends only on the ones digits of the factors. This gives a fast check of a long multiplication: if the last digit is off, the answer is wrong.",
        "积的个位只取决于因数的个位。这可以快速检验长乘法：个位不对，答案一定错。",
      ],
      (rng) => {
        const n = rng.int(101, 9999);
        const f = rng.int(2, 9);
        const ans = (n * f) % 10;
        return whole(
          [
            `Without multiplying it all out, what is the ones digit of $${commas(n)} \\times ${f}$?`,
            `不必全部算出，$${commas(n)} \\times ${f}$ 的个位数字是几？`,
          ],
          ans,
          [n % 10, f, (n % 10) + f === ans ? ans + 1 : ((n % 10) + f) % 10],
          [
            `Only the ones digits count: $${n % 10} \\times ${f} = ${(n % 10) * f}$, which ends in ${ans}.`,
            `只看个位：$${n % 10} \\times ${f} = ${(n % 10) * f}$，个位是 ${ans}。`,
          ],
        );
      },
    ),
  ],
  "five-and-six-digit-by-one-digit-multiplication": [
    skill(
      "how-many-digits-the-product-has",
      ["How many digits the product has", "积有几位"],
      [
        "A product has either as many digits as the long factor or one more. Multiplying the leading digit by the one-digit factor shows which: a carry into a new place adds a digit.",
        "积的位数要么等于较长因数的位数，要么多一位。用最高位乘一位数因数就知道：进到新的一位就多一位。",
      ],
      (rng) => {
        const digits = rng.int(5, 6);
        const lead = rng.int(1, 9);
        const n = lead * 10 ** (digits - 1) + rng.int(0, 10 ** (digits - 1) - 1);
        const f = rng.int(2, 9);
        const len = String(n * f).length;
        return whole(
          [`How many digits does $${commas(n)} \\times ${f}$ have?`, `$${commas(n)} \\times ${f}$ 是几位数？`],
          len,
          [digits === len ? digits + 1 : digits, digits + 2, digits - 1],
          [`The product is $${commas(n * f)}$, which has ${len} digits.`, `积是 $${commas(n * f)}$，是 ${len} 位数。`],
        );
      },
    ),
  ],
  "two-digit-by-one-digit-division": [
    skill(
      "how-much-more-to-divide-evenly",
      ["How much more to divide evenly", "再加多少能整除"],
      [
        "A remainder says how far a number is past a multiple of the divisor. The next multiple is the divisor minus the remainder away, and adding that much makes the division come out evenly.",
        "余数表示这个数超过除数的倍数多少。下一个倍数还差“除数减余数”，加上这么多就能整除。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const q = rng.int(3, 30);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return whole(
          [
            `What is the smallest number that can be added to ${n} so that it divides evenly by ${d}?`,
            `${n} 至少加上多少才能被 ${d} 整除？`,
          ],
          d - r,
          [r, d, d - r + 1],
          [
            `$${n} \\div ${d}$ leaves remainder ${r}, so $${d} - ${r} = ${d - r}$ more reaches the next multiple, ${n + d - r}.`,
            `$${n} \\div ${d}$ 余 ${r}，再加 $${d} - ${r} = ${d - r}$ 就到下一个倍数 ${n + d - r}。`,
          ],
        );
      },
    ),
  ],
  "three-digit-by-one-digit-division": [
    skill(
      "how-many-digits-the-quotient-has",
      ["How many digits the quotient has", "商有几位"],
      [
        "Comparing the first digit with the divisor predicts the quotient's size. If the first digit is smaller than the divisor, the hundreds place is empty and the quotient has only two digits.",
        "比较最高位和除数可以预测商的大小。最高位比除数小时，百位没有商，商只有两位。",
      ],
      (rng) => {
        const d = rng.int(2, 9);
        const n = rng.int(100, 999);
        const len = String(Math.floor(n / d)).length;
        return whole(
          [`How many digits does the whole-number quotient of $${n} \\div ${d}$ have?`, `$${n} \\div ${d}$ 的整数商是几位数？`],
          len,
          [len === 3 ? 2 : 3, 1, 4],
          [
            `The first digit ${String(n)[0]} ${Number(String(n)[0]) >= d ? "is at least" : "is smaller than"} ${d}, and the quotient is ${Math.floor(n / d)}.`,
            `最高位 ${String(n)[0]}${Number(String(n)[0]) >= d ? "不小于" : "小于"} ${d}，商是 ${Math.floor(n / d)}。`,
          ],
        );
      },
    ),
  ],
  "four-digit-by-one-digit-division": [
    skill(
      "a-zero-inside-the-quotient",
      ["A zero inside the quotient", "商中间的零"],
      [
        "When a digit brought down is too small to divide, that place of the quotient holds a zero. Skipping the zero is a common slip and gives an answer far too small.",
        "落下来的数不够除时，商的这一位要写 0。漏写这个 0 是常见错误，会使答案小很多。",
      ],
      (rng) => {
        const d = rng.int(2, 9);
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const q = rng.bool() ? a * 100 + b : a * 100 + b * 10;
        const n = d * q;
        const noZero = Number(String(q).replace("0", ""));
        return whole(
          [`Find $${commas(n)} \\div ${d}$.`, `计算 $${commas(n)} \\div ${d}$。`],
          q,
          [noZero, q * 10, q + 10],
          [
            `$${d} \\times ${q} = ${commas(n)}$. Where a digit brought down was too small to divide, the quotient has a zero.`,
            `$${d} \\times ${q} = ${commas(n)}$。落下来的数不够除时，商要写 0。`,
          ],
        );
      },
    ),
  ],
  "using-fractions-to-represent-division-of-whole-numbers": [
    skill(
      "the-total-from-one-share",
      ["The total from one share", "由一份求总数"],
      [
        "A fair share times the number of people gives back what was shared. When the share is a mixed number, multiply its improper form by the number of people, which equals its denominator here.",
        "每人的份额乘人数，就回到被分的总量。份额是带分数时，把它化成假分数再乘人数；这里人数等于它的分母。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const a = rng.int(1, 9);
        const n = lowestNumerator(rng, d);
        const who = rng.pick(earlyNames);
        return whole(
          [
            `${who} shared some ribbon equally among ${d} people, and each got $${a}${frac(n, d)}$ yards. How many yards were shared?`,
            `${who} 把一些丝带平均分给 ${d} 个人，每人得到 $${a}${frac(n, d)}$ 码。一共分了多少码？`,
          ],
          a * d + n,
          [a * d, a + n, a * n + d],
          [
            `$${a}${frac(n, d)} = ${frac(a * d + n, d)}$, and $${d} \\times ${frac(a * d + n, d)} = ${a * d + n}$.`,
            `$${a}${frac(n, d)} = ${frac(a * d + n, d)}$，$${d} \\times ${frac(a * d + n, d)} = ${a * d + n}$。`,
          ],
        );
      },
    ),
  ],
  "dividing-numbers-by-one-digit-numbers-with-rounding": [
    skill(
      "the-smallest-number-that-rounds-to-a-quotient",
      ["The smallest number with a rounded quotient", "商四舍五入后的最小被除数"],
      [
        "A quotient rounds up to a whole number when it is at most a half below it. Multiplying that halfway value by the divisor gives the smallest whole number that works.",
        "商不小于“某整数减二分之一”时，四舍五入后就是这个整数。把这个中间值乘除数，就得到符合条件的最小整数。",
      ],
      (rng) => {
        const d = rng.pick([2, 4, 6, 8]);
        const q = rng.int(11, 95);
        const n = d * q - d / 2;
        return whole(
          [
            `Dividing a whole number by ${d} gives a quotient that rounds to ${q} at the nearest whole number. What is the smallest the number could be?`,
            `一个整数除以 ${d}，商四舍五入到整数后是 ${q}。这个整数最小是多少？`,
          ],
          n,
          [d * q, d * q - d, n - 1],
          [
            `The quotient must be at least $${q} - ${frac(1, 2)}$, and $${d} \\times ${q - 1}${frac(1, 2)} = ${n}$.`,
            `商至少是 $${q} - ${frac(1, 2)}$，$${d} \\times ${q - 1}${frac(1, 2)} = ${n}$。`,
          ],
        );
      },
    ),
  ],
  "dividing-numbers-by-one-digit-numbers-interpreting-the-remainder": [
    skill(
      "how-many-more-to-fill-the-last-box",
      ["How many more to fill the last box", "还差多少装满最后一盒"],
      [
        "A remainder counts what sits in the last, partly filled box. What the box still lacks is the box's size minus the remainder, which is another question than how many boxes are needed.",
        "余数表示最后一个没装满的盒子里有多少。这个盒子还差的量是盒子容量减余数，这和需要几个盒子是不同的问题。",
      ],
      (rng) => {
        const size = rng.int(4, 9);
        const q = rng.int(12, 300);
        const r = rng.int(1, size - 1);
        const n = size * q + r;
        return whole(
          [
            `${n} books are packed in boxes that hold ${size} each. How many more books would fill the last box?`,
            `${n} 本书装箱，每箱 ${size} 本。最后一箱还差多少本才能装满？`,
          ],
          size - r,
          [r, q + 1, size],
          [
            `$${n} \\div ${size}$ is ${q} remainder ${r}, so the last box holds ${r} and lacks $${size} - ${r} = ${size - r}$.`,
            `$${n} \\div ${size}$ 得 ${q} 余 ${r}，最后一箱有 ${r} 本，还差 $${size} - ${r} = ${size - r}$ 本。`,
          ],
        );
      },
    ),
  ],
  "dividing-by-two-digit-numbers-by-connecting-multiplication-and-division": [
    skill(
      "estimating-with-a-round-divisor",
      ["Estimating with a round divisor", "把除数凑整来估算"],
      [
        "Rounding a two-digit divisor to the nearest ten gives a first try for the quotient. Dividing by a multiple of ten is easy, and the estimate is then checked by multiplying with the real divisor.",
        "把两位数除数四舍五入到整十，可以得到商的初步估计。除以整十数很容易，然后再用实际的除数相乘来检验。",
      ],
      (rng) => {
        const tens = rng.int(2, 9);
        const e = rng.int(2, 9);
        const shift = rng.pick([-2, -1, 1, 2]);
        const d = tens * 10 + shift;
        const n = tens * 10 * e;
        return whole(
          [
            `Round the divisor to the nearest ten to estimate $${n} \\div ${d}$. What is the estimate?`,
            `把除数四舍五入到整十，估算 $${n} \\div ${d}$。估算值是多少？`,
          ],
          e,
          [e + 1, tens, tens * e],
          [
            `$${d}$ rounds to ${tens * 10}, and $${n} \\div ${tens * 10} = ${e}$.`,
            `$${d}$ 约等于 ${tens * 10}，$${n} \\div ${tens * 10} = ${e}$。`,
          ],
        );
      },
    ),
  ],
  "dividing-by-two-digit-numbers-with-remainders-by-connecting-multiplication-and-division": [
    skill(
      "a-remainder-that-is-too-big",
      ["A remainder that is too big", "余数太大"],
      [
        "A remainder must be smaller than the divisor. If it is not, the quotient was too small: another group fits, so raise the quotient by one and take the divisor off the remainder.",
        "余数必须小于除数。否则说明商太小，还能再分一组，所以商加 1，余数减去除数。",
      ],
      (rng) => {
        const d = rng.int(12, 48);
        const q = rng.int(3, 8);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return whole(
          [
            `A student found $${n} \\div ${d}$ to be ${q - 1} with remainder ${r + d}. What is the correct whole-number quotient?`,
            `一名学生算出 $${n} \\div ${d}$ 得 ${q - 1} 余 ${r + d}。正确的整数商是多少？`,
          ],
          q,
          [q - 1, q + 1, r],
          [
            `${r + d} is not smaller than ${d}, so one more group fits: the quotient is ${q} with remainder ${r}.`,
            `${r + d} 不小于 ${d}，还能再分一组：商是 ${q}，余 ${r}。`,
          ],
        );
      },
    ),
  ],
  "multi-digit-by-two-digit-division-using-partial-quotients": [
    skill(
      "the-first-partial-quotient",
      ["The first partial quotient", "第一个部分商"],
      [
        "A good first partial quotient is the largest multiple of ten whose product with the divisor still fits. This takes away most of the dividend in one step and leaves a small division.",
        "好的第一个部分商是使积不超过被除数的最大整十数。这样一步就减去被除数的大部分，只剩下较小的除法。",
      ],
      (rng) => {
        const d = rng.int(12, 48);
        const q = rng.int(21, 99);
        const r = rng.int(0, d - 1);
        const n = d * q + r;
        const first = Math.floor(q / 10) * 10;
        return whole(
          [
            `To find $${commas(n)} \\div ${d}$, what is the largest multiple of 10 that works as the first partial quotient?`,
            `计算 $${commas(n)} \\div ${d}$ 时，第一个部分商最大可以取哪个整十数？`,
          ],
          first,
          [first + 10, first / 10, q],
          [
            `$${d} \\times ${first} = ${commas(d * first)}$ fits, but $${d} \\times ${first + 10} = ${commas(d * (first + 10))}$ is too large.`,
            `$${d} \\times ${first} = ${commas(d * first)}$ 不超过被除数，而 $${d} \\times ${first + 10} = ${commas(d * (first + 10))}$ 太大。`,
          ],
        );
      },
    ),
  ],
  "adding-fractions-and-whole-numbers-using-models": [
    skill(
      "full-bars-in-a-sum",
      ["Full bars in a sum", "和中有几个完整的长条"],
      [
        "A model of a whole number plus an improper fraction has full bars from both. The improper fraction's top divided by its bottom gives the extra full bars, with the remainder in a partly shaded bar.",
        "整数加假分数的模型中，两者都有完整的长条。假分数的分子除以分母得到多出来的完整长条，余数在部分涂色的长条中。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const d = rng.int(2, 8);
        const n = rng.int(d + 1, 4 * d);
        const full = a + Math.floor(n / d);
        return whole(
          [
            `A model shows $${a} + ${frac(n, d)}$. How many bars in the model are completely full?`,
            `一个模型表示 $${a} + ${frac(n, d)}$。模型中有几个完全涂满的长条？`,
          ],
          full,
          [a, Math.floor(n / d), full + 1],
          [
            `$${frac(n, d)}$ fills ${Math.floor(n / d)} bar${Math.floor(n / d) > 1 ? "s" : ""}, and with the ${a} already full that makes ${full}.`,
            `$${frac(n, d)}$ 涂满 ${Math.floor(n / d)} 个长条，加上已满的 ${a} 个，共 ${full} 个。`,
          ],
        );
      },
    ),
  ],
  "adding-fractions-and-whole-numbers": [
    skill(
      "a-missing-whole-number",
      ["A missing whole number", "缺少的整数"],
      [
        "Adding a whole number changes the whole part and leaves the fraction part alone. So a missing whole number is the difference of the whole parts, provided the fraction parts match.",
        "加一个整数只改变整数部分，分数部分不变。所以缺少的整数是两个整数部分的差，前提是分数部分相同。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const n = rng.int(1, d - 1);
        const a = rng.int(1, 20);
        const k = rng.int(2, 30);
        return whole(
          [
            `Fill in the box: $$\\square + ${a}${frac(n, d)} = ${a + k}${frac(n, d)}$$`,
            `填方框：$$\\square + ${a}${frac(n, d)} = ${a + k}${frac(n, d)}$$`,
          ],
          k,
          [a + k, a, k + 1],
          [
            `The fraction parts match, so only the whole parts differ: $${a + k} - ${a} = ${k}$.`,
            `分数部分相同，只有整数部分不同：$${a + k} - ${a} = ${k}$。`,
          ],
        );
      },
    ),
  ],
  "subtracting-fractions-and-whole-numbers-using-models": [
    skill(
      "parts-left-after-crossing-out",
      ["Parts left after crossing out", "划掉后剩下的份数"],
      [
        "Whole bars can be read as parts. With each bar cut by the denominator, the whole number becomes a count of parts, and crossing out the fraction leaves a simple subtraction of counts.",
        "完整的长条也可以看成份数。每个长条按分母切开，整数就变成份数，划掉分数部分后就是简单的份数相减。",
      ],
      (rng) => {
        const k = rng.int(2, 6);
        const d = rng.int(3, 10);
        const n = rng.int(1, d * k - 1);
        return whole(
          [
            `A model shows ${k} bars, each cut into ${d} equal parts, to find $${k} - ${frac(n, d)}$. How many parts are left after crossing out?`,
            `一个模型用 ${k} 个长条，每条分成 ${d} 等份，来求 $${k} - ${frac(n, d)}$。划掉后剩下多少份？`,
          ],
          k * d - n,
          [k * d, n, d - n > 0 ? d - n : k * d - n + d],
          [
            `There are $${k} \\times ${d} = ${k * d}$ parts, and $${k * d} - ${n} = ${k * d - n}$ remain.`,
            `一共有 $${k} \\times ${d} = ${k * d}$ 份，$${k * d} - ${n} = ${k * d - n}$ 份剩下。`,
          ],
        );
      },
    ),
  ],
  "subtracting-fractions-and-whole-numbers": [
    skill(
      "the-fraction-taken-from-a-whole",
      ["The fraction taken from a whole", "从整数中减去的分数"],
      [
        "When a whole number minus a fraction leaves one whole fewer plus some parts, the two fractions together make exactly 1. So the missing top is the denominator minus the top that remains.",
        "整数减分数，结果是少一个整数再加几份时，这两个分数合起来正好是 1。所以缺少的分子是分母减去剩下的分子。",
      ],
      (rng) => {
        const k = rng.int(2, 25);
        const d = rng.int(3, 12);
        const r = rng.int(1, d - 1);
        return whole(
          [
            `Fill in the box: $$${k} - \\frac{\\square}{${d}} = ${k - 1}${frac(r, d)}$$`,
            `填方框：$$${k} - \\frac{\\square}{${d}} = ${k - 1}${frac(r, d)}$$`,
          ],
          d - r,
          [r, d, d - r + 1],
          [
            `$${frac(r, d)}$ and the missing fraction make 1, so the top is $${d} - ${r} = ${d - r}$.`,
            `$${frac(r, d)}$ 和缺少的分数合起来是 1，所以分子是 $${d} - ${r} = ${d - r}$。`,
          ],
        );
      },
    ),
  ],
  "estimating-sums-and-differences-of-fractions": [
    skill(
      "catching-an-unreasonable-sum",
      ["Catching an unreasonable sum", "发现不合理的和"],
      [
        "A benchmark estimate catches the common mistake of adding tops and bottoms. If both fractions are above one half, their sum must be above 1, so any answer below 1 cannot be right.",
        "用基准数估算可以发现“分子加分子、分母加分母”这种常见错误。两个分数都大于二分之一时，和一定大于 1，所以小于 1 的答案都不对。",
      ],
      (rng) => {
        const [b, d] = rng.sample([5, 6, 7, 8, 9, 10, 11, 12], 2) as [number, number];
        const a = rng.int(Math.floor(b / 2) + 1, b - 1);
        const c = rng.int(Math.floor(d / 2) + 1, d - 1);
        const top = a * d + c * b;
        const bottom = b * d;
        return chooseMath(
          rng,
          [
            `Both fractions are above one half. Which is the reasonable value of $${frac(a, b)} + ${frac(c, d)}$?`,
            `两个分数都大于二分之一。$${frac(a, b)} + ${frac(c, d)}$ 的合理值是哪个？`,
          ],
          frac(top, bottom),
          [frac(a + c, b + d), frac(a * c, bottom), frac(a + c, bottom)],
          [
            `The sum must be above 1, and only $${frac(top, bottom)}$ is. The value $${frac(a + c, b + d)}$ comes from adding tops and bottoms.`,
            `和一定大于 1，只有 $${frac(top, bottom)}$ 符合。$${frac(a + c, b + d)}$ 来自分子、分母分别相加的错误。`,
          ],
        );
      },
    ),
  ],
  "adding-fractions-with-unlike-denominators-using-models": [
    skill(
      "parts-of-a-common-size-in-a-sum",
      ["Parts of a common size in a sum", "和中有几个相同大小的份"],
      [
        "Two models can be added once they use parts of one size. The least common denominator gives that size, and each fraction then becomes a count of those parts.",
        "两个模型用同样大小的份时才能相加。最小公分母给出这个大小，每个分数都变成这种份的个数。",
      ],
      (rng) => {
        const [b, d] = rng.sample([2, 3, 4, 5, 6, 8, 10, 12], 2) as [number, number];
        const a = rng.int(1, b - 1);
        const c = rng.int(1, d - 1);
        const l = lcm(b, d);
        const count = (a * l) / b + (c * l) / d;
        return whole(
          [
            `Models of $${frac(a, b)}$ and $${frac(c, d)}$ are recut into parts of size $${frac(1, l)}$. How many such parts do they cover together?`,
            `把表示 $${frac(a, b)}$ 和 $${frac(c, d)}$ 的模型重新切成每份 $${frac(1, l)}$。它们一共占多少份？`,
          ],
          count,
          [a + c, l, (a * l) / b],
          [
            `$${frac(a, b)} = ${frac((a * l) / b, l)}$ and $${frac(c, d)} = ${frac((c * l) / d, l)}$, so ${(a * l) / b} and ${(c * l) / d} make ${count}.`,
            `$${frac(a, b)} = ${frac((a * l) / b, l)}$，$${frac(c, d)} = ${frac((c * l) / d, l)}$，所以 ${(a * l) / b} 和 ${(c * l) / d} 共 ${count} 份。`,
          ],
        );
      },
    ),
  ],
  "subtracting-fractions-with-unlike-denominators-using-models": [
    skill(
      "parts-of-a-common-size-in-a-difference",
      ["Parts of a common size in a difference", "差中有几个相同大小的份"],
      [
        "Recutting two models into parts of one size shows how far apart the fractions are. The difference is then a count of those parts, found by subtracting the two counts.",
        "把两个模型重新切成同样大小的份，就能看出两个分数相差多少。差就是这种份的个数，用两个个数相减求出。",
      ],
      (rng) => {
        const [b, d] = rng.sample([2, 3, 4, 5, 6, 8, 10, 12], 2) as [number, number];
        const l = lcm(b, d);
        let a = rng.int(1, b - 1);
        let c = rng.int(1, d - 1);
        if ((a * l) / b === (c * l) / d) a = a < b - 1 ? a + 1 : a - 1;
        if (a === 0 || (a * l) / b === (c * l) / d) c = c < d - 1 ? c + 1 : c - 1;
        if (a === 0) a = 1;
        const x = (a * l) / b;
        const y = (c * l) / d;
        const [hiN, hiD, loN, loD, hi, lo] = x > y ? [a, b, c, d, x, y] : [c, d, a, b, y, x];
        return whole(
          [
            `Models of $${frac(hiN, hiD)}$ and $${frac(loN, loD)}$ are recut into parts of size $${frac(1, l)}$. How many such parts apart are they?`,
            `把表示 $${frac(hiN, hiD)}$ 和 $${frac(loN, loD)}$ 的模型重新切成每份 $${frac(1, l)}$。它们相差多少份？`,
          ],
          hi - lo,
          [hi + lo, Math.abs(hiN - loN) === hi - lo ? hi - lo + 1 : Math.abs(hiN - loN), l],
          [
            `$${frac(hiN, hiD)} = ${frac(hi, l)}$ and $${frac(loN, loD)} = ${frac(lo, l)}$, and $${hi} - ${lo} = ${hi - lo}$.`,
            `$${frac(hiN, hiD)} = ${frac(hi, l)}$，$${frac(loN, loD)} = ${frac(lo, l)}$，$${hi} - ${lo} = ${hi - lo}$。`,
          ],
        );
      },
    ),
  ],
  "adding-mixed-numbers-with-unlike-denominators": [
    skill(
      "the-whole-part-when-denominators-differ",
      ["The whole part when denominators differ", "分母不同时和的整数部分"],
      [
        "Whether a sum of mixed numbers carries depends on the fraction parts, and with unlike denominators that shows only after rewriting. Comparing each fraction part with one half often settles it quickly.",
        "带分数相加是否进位取决于分数部分，分母不同时要改写后才能看出。把分数部分与二分之一比较，常常能很快判断。",
      ],
      (rng) => {
        const [b, d] = rng.sample([2, 3, 4, 5, 6, 8, 10, 12], 2) as [number, number];
        const x = rng.int(1, 15);
        const y = rng.int(1, 15);
        const a = rng.int(1, b - 1);
        const c = rng.int(1, d - 1);
        const carry = a * d + c * b >= b * d ? 1 : 0;
        return whole(
          [
            `What is the whole-number part of $${x}${frac(a, b)} + ${y}${frac(c, d)}$, written as a mixed number?`,
            `$${x}${frac(a, b)} + ${y}${frac(c, d)}$ 写成带分数后，整数部分是多少？`,
          ],
          x + y + carry,
          [x + y + 1 - carry, x + y + 2, x * y],
          [
            `The fraction parts total $${frac(a * d + c * b, b * d)}$, which is ${carry ? "at least 1, so one whole carries" : "less than 1, so nothing carries"}: ${x + y + carry}.`,
            `分数部分的和是 $${frac(a * d + c * b, b * d)}$，${carry ? "不小于 1，所以进一" : "小于 1，所以不进位"}：${x + y + carry}。`,
          ],
        );
      },
    ),
  ],
  "subtracting-mixed-numbers-with-unlike-denominators": [
    skill(
      "which-difference-needs-regrouping",
      ["Which difference needs regrouping", "哪个减法需要退位"],
      [
        "A subtraction needs regrouping when the fraction being taken away is larger than the fraction above it. With unlike denominators, rewrite or compare with a benchmark before deciding.",
        "被减的分数比上面的分数大时就需要退位。分母不同时，要先改写或用基准数比较，再作判断。",
      ],
      (rng) => {
        const x = rng.int(4, 20);
        const y = rng.int(1, 3);
        const small = rng.pick<[number, number]>([
          [1, 4],
          [1, 5],
          [1, 6],
          [1, 8],
          [1, 3],
          [2, 7],
          [3, 10],
        ]);
        const big = rng.pick<[number, number]>([
          [2, 3],
          [3, 4],
          [4, 5],
          [5, 6],
          [5, 8],
          [7, 9],
          [7, 10],
        ]);
        return chooseMath(
          rng,
          ["Which subtraction needs regrouping?", "哪个减法需要退位？"],
          `${x}${frac(small[0], small[1])} - ${y}${frac(big[0], big[1])}`,
          [
            `${x}${frac(big[0], big[1])} - ${y}${frac(small[0], small[1])}`,
            `${x + 1}${frac(big[0], big[1])} - ${y + 1}${frac(1, 9)}`,
            `${x + 2}${frac(4, 7)} - ${y}${frac(small[0], small[1])}`,
          ],
          [
            `In $${x}${frac(small[0], small[1])} - ${y}${frac(big[0], big[1])}$ the fraction taken away, $${frac(big[0], big[1])}$, is above one half and $${frac(small[0], small[1])}$ is below it.`,
            `在 $${x}${frac(small[0], small[1])} - ${y}${frac(big[0], big[1])}$ 中，被减的 $${frac(big[0], big[1])}$ 大于二分之一，而 $${frac(small[0], small[1])}$ 小于二分之一。`,
          ],
        );
      },
    ),
  ],
  "subtracting-mixed-numbers-with-unlike-denominators-using-improper-fractions": [
    skill(
      "the-top-over-a-common-denominator",
      ["The top over a common denominator", "通分后的分子"],
      [
        "Writing a mixed number as an improper fraction over a common denominator takes two steps at once. Multiply the whole part by the new denominator, and add the fraction part's rewritten top.",
        "把带分数写成通分后的假分数有两步：整数部分乘新分母，再加上改写后分数部分的分子。",
      ],
      (rng) => {
        const b = rng.pick([2, 3, 4, 5, 6]);
        const k = rng.int(2, 4);
        const l = b * k;
        const a = rng.int(1, b - 1);
        const x = rng.int(2, 15);
        return whole(
          [`Fill in the box: $$${x}${frac(a, b)} = \\frac{\\square}{${l}}$$`, `填方框：$$${x}${frac(a, b)} = \\frac{\\square}{${l}}$$`],
          x * l + a * k,
          [x * l + a, x * b + a, x + a * k],
          [
            `$${x} \\times ${l} = ${x * l}$ and $${frac(a, b)} = ${frac(a * k, l)}$, so the top is $${x * l} + ${a * k} = ${x * l + a * k}$.`,
            `$${x} \\times ${l} = ${x * l}$，$${frac(a, b)} = ${frac(a * k, l)}$，所以分子是 $${x * l} + ${a * k} = ${x * l + a * k}$。`,
          ],
        );
      },
    ),
  ],
  "multiplying-fractions-by-unit-fractions-using-models": [
    skill(
      "the-missing-unit-fraction",
      ["The missing unit fraction", "缺少的单位分数"],
      [
        "The product of two unit fractions is a unit fraction whose denominator is the product of theirs. So a missing denominator comes from dividing the product's denominator by the known one.",
        "两个单位分数的积还是单位分数，分母是两个分母的积。所以缺少的分母可以用积的分母除以已知的分母求出。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        return whole(
          [
            `Fill in the box: $$${frac(1, a)} \\times \\frac{1}{\\square} = ${frac(1, a * b)}$$`,
            `填方框：$$${frac(1, a)} \\times \\frac{1}{\\square} = ${frac(1, a * b)}$$`,
          ],
          b,
          [a * b, a * b - a, a + b],
          [`$${a} \\times \\square = ${a * b}$, so the box holds ${b}.`, `$${a} \\times \\square = ${a * b}$，所以方框里是 ${b}。`],
        );
      },
    ),
  ],
  "multiplying-fractions-using-models": [
    skill(
      "double-shaded-cells",
      ["Double-shaded cells", "涂了两次的格子"],
      [
        "A model of a product shades columns for one fraction and rows for the other. The cells shaded twice are the product's top, and they are the columns shaded times the rows shaded.",
        "积的模型用列表示一个分数，用行表示另一个分数。涂了两次的格子数就是积的分子，等于涂色的列数乘涂色的行数。",
      ],
      (rng) => {
        const b = rng.int(2, 9);
        const d = rng.int(2, 9);
        const a = rng.int(1, b - 1);
        const c = rng.int(1, d - 1);
        return whole(
          [
            `A square is cut into ${b} columns and ${d} rows to show $${frac(a, b)} \\times ${frac(c, d)}$. How many cells are shaded twice?`,
            `一个正方形分成 ${b} 列 ${d} 行，表示 $${frac(a, b)} \\times ${frac(c, d)}$。有多少个格子涂了两次？`,
          ],
          a * c,
          [b * d, a + c, a * d + c * b - a * c],
          [
            `${a} columns and ${c} rows overlap in $${a} \\times ${c} = ${a * c}$ cells.`,
            `${a} 列和 ${c} 行重叠的格子有 $${a} \\times ${c} = ${a * c}$ 个。`,
          ],
        );
      },
    ),
  ],
  "multiplying-fractions-by-swapping-denominators": [
    skill(
      "the-number-that-makes-the-swap-true",
      ["The number that makes the swap true", "使交换成立的数"],
      [
        "The tops of a product can be paired with either bottom, since multiplication can be done in any order. So the swapped product keeps the same four numbers, only rearranged.",
        "因为乘法可以按任意顺序做，分子可以与任意一个分母搭配。所以交换后的积还是原来这四个数，只是位置变了。",
      ],
      (rng) => {
        const [a, c] = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 11], 2) as [number, number];
        const [b, d] = rng.sample([5, 6, 7, 8, 9, 10, 12, 14, 15, 16], 2) as [number, number];
        return whole(
          [
            `Fill in the box: $$${frac(a, b)} \\times ${frac(c, d)} = ${frac(a, d)} \\times \\frac{\\square}{${b}}$$`,
            `填方框：$$${frac(a, b)} \\times ${frac(c, d)} = ${frac(a, d)} \\times \\frac{\\square}{${b}}$$`,
          ],
          c,
          [a, b, d],
          [
            `Only the denominators ${b} and ${d} changed places, so the second top stays ${c}.`,
            `只有分母 ${b} 和 ${d} 交换了位置，所以第二个分子仍是 ${c}。`,
          ],
        );
      },
    ),
  ],
  "multiplying-mixed-numbers-by-whole-numbers": [
    skill(
      "multiplying-each-part-of-a-mixed-number",
      ["Multiplying each part", "分别乘每一部分"],
      [
        "A mixed number is a sum, so a whole number multiplies both of its parts. The whole part gives a whole number, and the fraction part gives a fraction that may be improper.",
        "带分数是一个和，所以整数要乘它的两部分。整数部分得到整数，分数部分得到分数，可能是假分数。",
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const a = rng.int(1, 12);
        const d = rng.int(3, 12);
        const n = rng.int(1, d - 1);
        return whole(
          [
            `Fill in the box: $$${k} \\times ${a}${frac(n, d)} = ${k * a} + \\frac{\\square}{${d}}$$`,
            `填方框：$$${k} \\times ${a}${frac(n, d)} = ${k * a} + \\frac{\\square}{${d}}$$`,
          ],
          k * n,
          [n, k + n, k * d],
          [
            `${k} also multiplies the fraction part: $${k} \\times ${frac(n, d)} = ${frac(k * n, d)}$.`,
            `${k} 也要乘分数部分：$${k} \\times ${frac(n, d)} = ${frac(k * n, d)}$。`,
          ],
        );
      },
    ),
  ],
  "multiplying-mixed-numbers-by-fractions": [
    skill(
      "the-number-that-makes-one",
      ["The fraction that makes 1", "使积为 1 的分数"],
      [
        "Two numbers whose product is 1 are reciprocals. To find the reciprocal of a mixed number, first write it as an improper fraction, and then turn that fraction over.",
        "积为 1 的两个数互为倒数。求带分数的倒数时，先写成假分数，再把这个分数颠倒过来。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const a = rng.int(1, 6);
        const n = lowestNumerator(rng, d);
        const top = a * d + n;
        return fraction(
          [`What fraction times $${a}${frac(n, d)}$ equals 1?`, `什么分数乘 $${a}${frac(n, d)}$ 等于 1？`],
          Q.of(d, top),
          [Q.of(d, n), Q.of(top, d), Q.of(d - n, d)],
          [
            `$${a}${frac(n, d)} = ${frac(top, d)}$, and turning it over gives $${frac(d, top)}$.`,
            `$${a}${frac(n, d)} = ${frac(top, d)}$，颠倒后得 $${frac(d, top)}$。`,
          ],
        );
      },
    ),
  ],
  "multiplying-mixed-numbers": [
    skill(
      "bounds-for-a-mixed-product",
      ["Bounds for a mixed product", "带分数积的范围"],
      [
        "Rounding both mixed numbers down gives a product that is too small, and rounding both up gives one that is too large. The true product lies between these two whole-number products.",
        "两个带分数都向下取整，得到的积偏小；都向上取整，得到的积偏大。真正的积在这两个整数积之间。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = rng.int(2, 15);
        const [d, e] = rng.sample([2, 3, 4, 5, 6, 8], 2) as [number, number];
        const n = lowestNumerator(rng, d);
        const m = lowestNumerator(rng, e);
        const up = rng.bool();
        return whole(
          up
            ? [
                `The product $${a}${frac(n, d)} \\times ${b}${frac(m, e)}$ is less than which product of the next whole numbers? Give that product.`,
                `$${a}${frac(n, d)} \\times ${b}${frac(m, e)}$ 小于两个数都向上取整后的积。这个积是多少？`,
              ]
            : [
                `The product $${a}${frac(n, d)} \\times ${b}${frac(m, e)}$ is greater than which product of the whole parts? Give that product.`,
                `$${a}${frac(n, d)} \\times ${b}${frac(m, e)}$ 大于两个整数部分的积。这个积是多少？`,
              ],
          up ? (a + 1) * (b + 1) : a * b,
          up ? [a * b, a * b + 1, (a + 1) * b] : [(a + 1) * (b + 1), a + b, a * (b + 1)],
          up
            ? [
                `Rounding both up gives $${a + 1} \\times ${b + 1} = ${(a + 1) * (b + 1)}$.`,
                `都向上取整得 $${a + 1} \\times ${b + 1} = ${(a + 1) * (b + 1)}$。`,
              ]
            : [`Rounding both down gives $${a} \\times ${b} = ${a * b}$.`, `都向下取整得 $${a} \\times ${b} = ${a * b}$。`],
        );
      },
    ),
  ],
  "multiplying-mixed-numbers-word-problems": [
    skill(
      "half-a-batch-more",
      ["Half a batch more", "多半批"],
      [
        "Scaling by a mixed number means the whole amount and part of it again. So how much more than the whole-number scale is just the fraction part times the amount.",
        "按带分数放大，就是整倍再加上一部分。所以比整数倍多出的部分，就是分数部分乘这个量。",
      ],
      (rng) => {
        const d = rng.pick([2, 3, 4, 5, 6, 8]);
        const a = rng.int(1, 6);
        const n = lowestNumerator(rng, d);
        const k = rng.int(2, 6);
        const amount = Q.of(a * d + n, d);
        const extra = amount.mul(Q.of(1, 2));
        return fraction(
          [
            `A recipe uses $${a}${frac(n, d)}$ cups of flour per batch. How many more cups do $${k}${frac(1, 2)}$ batches use than ${k} batches?`,
            `每批食谱用 $${a}${frac(n, d)}$ 杯面粉。$${k}${frac(1, 2)}$ 批比 ${k} 批多用多少杯？`,
          ],
          extra,
          [amount, amount.mul(Q.of(k, 1)), Q.of(1, 2)],
          [
            `The extra is half a batch: $${frac(1, 2)} \\times ${frac(a * d + n, d)} = ${frac(a * d + n, 2 * d)}$ cups.`,
            `多出来的是半批：$${frac(1, 2)} \\times ${frac(a * d + n, d)} = ${frac(a * d + n, 2 * d)}$ 杯。`,
          ],
        );
      },
    ),
  ],
  "connecting-fraction-multiplication-and-area": [
    skill(
      "tiles-that-fill-the-unit-square",
      ["Tiles that fill the unit square", "铺满单位正方形的小块"],
      [
        "A tile with sides of two unit fractions fits a whole number of times into the unit square. The rows times the columns gives that number, which is also why the tile's area is one over it.",
        "边长为两个单位分数的小块，正好若干块铺满单位正方形。行数乘列数就是块数，这也说明小块的面积是它的倒数。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = rng.int(2, 15);
        return whole(
          [
            `A tile measures $${frac(1, a)}$ unit by $${frac(1, b)}$ unit. How many of these tiles fill a square of side 1 unit?`,
            `一块小砖长 $${frac(1, a)}$ 单位、宽 $${frac(1, b)}$ 单位。铺满边长 1 单位的正方形需要多少块？`,
          ],
          a * b,
          [a + b, 2 * (a + b), a],
          [
            `${a} tiles fit along one side and ${b} along the other: $${a} \\times ${b} = ${a * b}$.`,
            `一边能放 ${a} 块，另一边能放 ${b} 块：$${a} \\times ${b} = ${a * b}$。`,
          ],
        );
      },
    ),
  ],
  "finding-areas-using-fraction-multiplication": [
    skill(
      "the-area-of-a-fractional-square",
      ["The area of a fractional square", "分数边长正方形的面积"],
      [
        "A square's area multiplies its side by itself, so both the top and the bottom get squared. Doubling the side instead is the usual slip, and it gives the wrong value and the wrong units.",
        "正方形的面积是边长乘自身，所以分子和分母都要平方。把边长乘 2 是常见错误，结果和单位都不对。",
      ],
      (rng) => {
        const d = rng.int(2, 15);
        const n = rng.int(1, d - 1);
        const s = Q.of(n, d);
        return fraction(
          [
            `A square has side $${frac(n, d)}$ meter. What is its area, in square meters?`,
            `一个正方形的边长是 $${frac(n, d)}$ 米。它的面积是多少平方米？`,
          ],
          s.mul(s),
          [s.mul(Q.of(2, 1)), s.mul(Q.of(4, 1)), Q.of(n * n, d)],
          [
            `$${frac(n, d)} \\times ${frac(n, d)} = ${frac(n * n, d * d)}$.`,
            `$${frac(n, d)} \\times ${frac(n, d)} = ${frac(n * n, d * d)}$。`,
          ],
        );
      },
    ),
  ],
  "fraction-multiplication-number-sense": [
    skill(
      "the-product-closest-to-the-number",
      ["The product closest to the number", "最接近原数的积"],
      [
        "Multiplying by a number near 1 changes a value only a little. So the factor closest to 1 keeps the product closest to the original, whichever side of 1 the factor lies on.",
        "乘接近 1 的数，值变化很小。所以最接近 1 的因数使积最接近原数，不管这个因数比 1 大还是小。",
      ],
      (rng) => {
        const n = rng.int(40, 400);
        const near = rng.pick<[number, number]>([
          [9, 10],
          [11, 10],
          [7, 8],
          [9, 8],
          [11, 12],
          [13, 12],
        ]);
        const others = rng.sample<[number, number]>(
          [
            [1, 2],
            [3, 2],
            [1, 3],
            [5, 2],
            [2, 3],
            [7, 4],
            [1, 4],
            [9, 4],
          ],
          3,
        );
        return chooseMath(
          rng,
          [`Without multiplying, which product is closest to ${n}?`, `不用计算，哪个积最接近 ${n}？`],
          `${frac(near[0], near[1])} \\times ${n}`,
          others.map((o) => `${frac(o[0], o[1])} \\times ${n}`),
          [
            `$${frac(near[0], near[1])}$ is the factor closest to 1, so it changes ${n} the least.`,
            `$${frac(near[0], near[1])}$ 是最接近 1 的因数，所以它使 ${n} 变化最小。`,
          ],
        );
      },
    ),
  ],
  "interpreting-fraction-division-using-area-models": [
    skill(
      "checking-a-division-with-a-product",
      ["Checking a division with a product", "用乘法检验除法"],
      [
        "Every division has a matching multiplication: the quotient times the divisor gives back the dividend. So a division by a unit fraction is checked by counting that many unit fractions.",
        "每个除法都对应一个乘法：商乘除数等于被除数。所以除以单位分数时，可以数这么多个单位分数来检验。",
      ],
      (rng) => {
        const k = rng.int(2, 12);
        const d = rng.int(2, 12);
        return chooseMath(
          rng,
          [
            `Which multiplication checks that $${k} \\div ${frac(1, d)} = ${k * d}$?`,
            `哪个乘法可以检验 $${k} \\div ${frac(1, d)} = ${k * d}$？`,
          ],
          `${k * d} \\times ${frac(1, d)} = ${k}`,
          [`${k} \\times ${frac(1, d)} = ${k * d}`, `${k * d} \\times ${k} = ${frac(1, d)}`, `${d} \\times ${frac(1, k)} = ${k * d}`],
          [
            `The quotient ${k * d} times the divisor $${frac(1, d)}$ must return ${k}, and $${k * d}$ copies of $${frac(1, d)}$ do.`,
            `商 ${k * d} 乘除数 $${frac(1, d)}$ 必须等于 ${k}，而 ${k * d} 个 $${frac(1, d)}$ 正好是 ${k}。`,
          ],
        );
      },
    ),
  ],
  "dividing-whole-numbers-by-unit-fractions-using-models": [
    skill(
      "servings-still-left",
      ["Servings still left", "还剩多少份"],
      [
        "A model of a division shows every serving at once. Once some are used, what remains is the total count of servings minus those used, so the division comes first.",
        "除法模型把所有份都显示出来。用掉一些后，剩下的是总份数减去用掉的份数，所以要先做除法。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const k = rng.int(2, 9);
        const d = rng.int(2, 8);
        const used = rng.int(1, k * d - 1);
        return whole(
          [
            `${who} has ${k} pounds of nuts and fills bags of $${frac(1, d)}$ pound each. After filling ${used} bags, how many more bags can be filled?`,
            `${who} 有 ${k} 磅坚果，每袋装 $${frac(1, d)}$ 磅。装了 ${used} 袋后，还能再装多少袋？`,
          ],
          k * d - used,
          [k * d, k - used > 0 ? k - used : k * d - used + 1, used],
          [
            `$${k} \\div ${frac(1, d)} = ${k * d}$ bags in all, and $${k * d} - ${used} = ${k * d - used}$ remain.`,
            `一共 $${k} \\div ${frac(1, d)} = ${k * d}$ 袋，$${k * d} - ${used} = ${k * d - used}$ 袋还能装。`,
          ],
        );
      },
    ),
  ],
  "dividing-whole-numbers-by-unit-fractions": [
    skill(
      "the-missing-unit-fraction-divisor",
      ["The missing unit fraction divisor", "缺少的单位分数除数"],
      [
        "Dividing a whole number by a unit fraction multiplies it by the denominator. So a missing denominator comes from comparing the quotient with the whole number.",
        "整数除以单位分数，就是乘分母。所以缺少的分母可以比较商和这个整数得到。",
      ],
      (rng) => {
        const k = rng.int(2, 15);
        const d = rng.int(2, 15);
        return whole(
          [`Fill in the box: $$${k} \\div \\frac{1}{\\square} = ${k * d}$$`, `填方框：$$${k} \\div \\frac{1}{\\square} = ${k * d}$$`],
          d,
          [k * d, k, k + d],
          [`$${k} \\times \\square = ${k * d}$, so the box holds ${d}.`, `$${k} \\times \\square = ${k * d}$，所以方框里是 ${d}。`],
        );
      },
    ),
  ],
  "dividing-unit-fractions-by-whole-numbers-using-models": [
    skill(
      "pieces-that-fill-the-whole-bar",
      ["Pieces that fill the whole bar", "铺满整个长条的块数"],
      [
        "Cutting a unit fraction into equal pieces makes each piece a smaller unit fraction of the whole bar. The number that fill the bar is the old denominator times the number of pieces.",
        "把单位分数切成相等的小块，每块是整个长条的更小的单位分数。铺满长条的块数是原分母乘切分的块数。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const k = rng.int(2, 12);
        return whole(
          [
            `A model shows $${frac(1, a)} \\div ${k}$. How many of the small pieces would fill the whole bar?`,
            `一个模型表示 $${frac(1, a)} \\div ${k}$。多少个这样的小块能铺满整个长条？`,
          ],
          a * k,
          [a + k, a, k],
          [
            `Each of the ${a} parts is cut into ${k} pieces, so $${a} \\times ${k} = ${a * k}$ pieces fill the bar.`,
            `${a} 份中每份切成 ${k} 块，所以 $${a} \\times ${k} = ${a * k}$ 块铺满长条。`,
          ],
        );
      },
    ),
  ],
  "dividing-unit-fractions-by-whole-numbers": [
    skill(
      "the-largest-share",
      ["The largest share", "最大的一份"],
      [
        "Sharing a unit fraction among people makes a share with denominator equal to the product of the two numbers. The smaller that product, the larger the share, so compare products.",
        "把单位分数分给几个人，每份的分母是这两个数的积。积越小，每份越大，所以比较积。",
      ],
      (rng) => {
        const pairs = rng.sample<[number, number]>(
          [
            [2, 2],
            [2, 3],
            [2, 5],
            [3, 3],
            [3, 4],
            [2, 8],
            [4, 4],
            [3, 6],
            [5, 5],
            [4, 6],
            [3, 9],
            [6, 6],
          ],
          8,
        );
        const seen = new Set<number>();
        const distinct = pairs.filter((p) => {
          const v = p[0] * p[1];
          if (seen.has(v)) return false;
          seen.add(v);
          return true;
        });
        const four = distinct.slice(0, 4).sort((x, y) => x[0] * x[1] - y[0] * y[1]);
        const [best, ...rest] = four as [[number, number], ...[number, number][]];
        return chooseMath(
          rng,
          ["Which quotient is the largest?", "哪个商最大？"],
          `${frac(1, best[0])} \\div ${best[1]}`,
          rest.map((p) => `${frac(1, p[0])} \\div ${p[1]}`),
          [
            `$${frac(1, best[0])} \\div ${best[1]} = ${frac(1, best[0] * best[1])}$ has the smallest denominator, ${best[0] * best[1]}.`,
            `$${frac(1, best[0])} \\div ${best[1]} = ${frac(1, best[0] * best[1])}$ 的分母 ${best[0] * best[1]} 最小。`,
          ],
        );
      },
    ),
  ],
  "dividing-whole-numbers-by-fractions-using-models-whole-number-results": [
    skill(
      "the-total-from-the-groups",
      ["The total from the groups", "由组数求总量"],
      [
        "A division by a fraction counts groups, so multiplying the number of groups by the size of each gives back the total. This also tells what amount a model must have started with.",
        "除以分数是在数组数，所以组数乘每组的大小就回到总量。这也说明模型开始时的量是多少。",
      ],
      (rng) => {
        const d = rng.int(2, 9);
        const n = rng.int(2, 9);
        const k = rng.int(1, 8);
        const q = d * k;
        const total = n * k;
        return whole(
          [
            `A model is split into ${q} groups of $${frac(n, d)}$. How many wholes does the model show?`,
            `一个模型分成 ${q} 组，每组 $${frac(n, d)}$。这个模型表示多少个整体？`,
          ],
          total,
          [q, q * n, n + k],
          [`$${q} \\times ${frac(n, d)} = ${frac(q * n, d)} = ${total}$.`, `$${q} \\times ${frac(n, d)} = ${frac(q * n, d)} = ${total}$。`],
        );
      },
    ),
  ],
};
