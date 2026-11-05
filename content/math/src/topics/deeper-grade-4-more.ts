// A second set of further knowledge points for 4th Grade Math, mostly the same facts run
// backwards. See `deeperGrade4MorePoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem } from "../problems.ts";

/** Pair holds a text in English and Simplified Chinese. */
type Pair = readonly [string, string];

/** skill builds a knowledge point from its texts and generator. */
const skill = (id: string, title: Pair, explanation: Pair, generate: KnowledgePointDef["generate"]): KnowledgePointDef => ({
  id,
  title: t(title[0], title[1]),
  explanation: t(explanation[0], explanation[1]),
  generate,
});

/** usableWrong keeps whole-number wrong answers and fills the list up to three. */
const usableWrong = (answer: number, wrong: readonly number[]) => {
  const kept = [...new Set(wrong.filter((w) => w >= 0 && Number.isInteger(w) && w !== answer))];
  for (let k = 1; kept.length < 3; k++) if (!kept.includes(answer + k)) kept.push(answer + k);
  return kept;
};

/** whole builds a problem whose answer is a whole number. */
const whole = (prompt: Pair, answer: number, wrong: readonly number[], solution: Pair) =>
  numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    form: "integer",
    wrong: usableWrong(answer, wrong),
    solution: t(solution[0], solution[1]),
  });

/** commas writes a whole number with thousands separators. */
const commas = (n: number) => String(n).replace(/\B(?=(\d{3})+$)/g, ",");

/** texCommas writes a whole number with thousands separators for math. */
const texCommas = (n: number) => String(n).replace(/\B(?=(\d{3})+$)/g, "{,}");

/** gcd is the greatest common factor of two positive whole numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const placeNames: readonly Pair[] = [
  ["ones", "个位"],
  ["tens", "十位"],
  ["hundreds", "百位"],
  ["thousands", "千位"],
  ["ten thousands", "万位"],
  ["hundred thousands", "十万位"],
  ["millions", "百万位"],
];

const timesAsGreat = skill(
  "how-many-times-as-great-a-digit-is",
  ["How many times as great a digit is", "一个数字的值是另一个的多少倍"],
  [
    "The same digit is worth ten times as much each time it moves one place to the left. So when a digit appears in two places, count the places between them and multiply by ten that many times. Two places apart means 100 times, and three places apart means 1,000 times.",
    "同一个数字每向左移动一位，它的值就变成原来的十倍。所以当一个数字出现在两个数位上时，先数它们相隔几位，再乘相应次数的十。相隔两位是 100 倍，相隔三位是 1,000 倍。",
  ],
  (rng) => {
    const d = rng.int(1, 9);
    const others = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== d);
    const lo = rng.int(0, 4);
    const hi = rng.int(lo + 1, 6);
    let value = 0;
    for (let i = 6; i >= 0; i--) {
      const digit = i === hi || i === lo ? d : rng.pick(i === 6 ? others.filter((v) => v > 0) : others);
      value = value * 10 + digit;
    }
    const gap = hi - lo;
    const answer = 10 ** gap;
    const [high, low] = [placeNames[hi] as Pair, placeNames[lo] as Pair];
    return whole(
      [
        `In ${commas(value)}, the value of the ${d} in the ${high[0]} place is how many times the value of the ${d} in the ${low[0]} place?`,
        `在 ${commas(value)} 中，${high[1]}上的 ${d} 表示的值是${low[1]}上的 ${d} 表示的值的多少倍？`,
      ],
      answer,
      [gap, answer * 10, gap === 1 ? 100 : answer / 10, d * answer],
      [
        `The two places are ${gap} ${gap === 1 ? "place" : "places"} apart, and each place multiplies the value by 10, which gives ${commas(answer)}.`,
        `这两个数位相隔 ${gap} 位，每隔一位值乘 10，所以是 ${commas(answer)} 倍。`,
      ],
    );
  },
);

const fromDigitCards = skill(
  "the-largest-or-smallest-number-from-digits",
  ["The largest or smallest number from given digits", "用给定数字组成最大或最小的数"],
  [
    "The leftmost place matters most when comparing numbers. So the largest number puts the digits in decreasing order. The smallest puts them in increasing order, except that a number cannot start with 0, so the smallest nonzero digit goes first and the 0 goes second.",
    "比较数的大小时，最左边的数位最重要。所以最大的数把数字从大到小排列。最小的数把数字从小到大排列，但一个数不能以 0 开头，所以最小的非零数字放在最前面，0 放在第二位。",
  ],
  (rng) => {
    const digits = rng.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 5);
    const list = digits.join(", ");
    const down = [...digits].sort((a, b) => b - a);
    const up = [...digits].sort((a, b) => a - b);
    const read = (ds: readonly number[]) => Number(ds.join(""));
    const largest = rng.bool();
    if (largest) {
      const answer = read(down);
      return whole(
        [
          `Using each of the digits ${list} exactly once, what is the largest five-digit number you can make?`,
          `每个数字恰好用一次，用 ${list} 能组成的最大五位数是多少？`,
        ],
        answer,
        [
          read([down[1], down[0], down[2], down[3], down[4]] as number[]),
          read([down[0], down[1], down[2], down[4], down[3]] as number[]),
          read(up[0] === 0 ? [...up.slice(1), 0] : up),
        ],
        [`Put the digits in decreasing order, which gives ${commas(answer)}.`, `把数字从大到小排列，得到 ${commas(answer)}。`],
      );
    }
    const ordered = up[0] === 0 ? ([up[1], 0, up[2], up[3], up[4]] as number[]) : up;
    const answer = read(ordered);
    return whole(
      [
        `Using each of the digits ${list} exactly once, what is the smallest five-digit number you can make?`,
        `每个数字恰好用一次，用 ${list} 能组成的最小五位数是多少？`,
      ],
      answer,
      [
        read(down),
        read([ordered[0], ordered[2], ordered[1], ordered[3], ordered[4]] as number[]),
        read([ordered[0], ordered[1], ordered[2], ordered[4], ordered[3]] as number[]),
      ],
      [
        up[0] === 0
          ? `A number cannot start with 0, so start with ${up[1]}, put 0 next and continue upward: ${commas(answer)}.`
          : `Put the digits in increasing order, which gives ${commas(answer)}.`,
        up[0] === 0
          ? `一个数不能以 0 开头，所以先放 ${up[1]}，再放 0，然后从小到大排列：${commas(answer)}。`
          : `把数字从小到大排列，得到 ${commas(answer)}。`,
      ],
    );
  },
);

const largeMissingAddend = skill(
  "a-missing-addend-in-a-large-sum",
  ["A missing addend in a large sum", "大数加法中缺少的加数"],
  [
    "Addition and subtraction undo each other. When a sum and one of its parts are known, the other part is the sum minus the known part. Line the digits up by place and subtract as usual, then add back to check the result.",
    "加法和减法互为逆运算。已知和与其中一个加数时，另一个加数就是和减去已知的加数。按数位对齐，照常做减法，再加回去检验结果。",
  ],
  (rng) => {
    const a = rng.int(10000, 4000000);
    const answer = rng.int(10000, 4000000);
    const c = a + answer;
    return whole(
      [
        `What number makes this true? $${texCommas(a)} + \\square = ${texCommas(c)}$`,
        `什么数使下面的式子成立？$${texCommas(a)} + \\square = ${texCommas(c)}$`,
      ],
      answer,
      [c + a, answer + 1000, answer - 1000, answer + 10],
      [
        `Subtract the known addend: $${texCommas(c)} - ${texCommas(a)} = ${texCommas(answer)}$.`,
        `减去已知的加数：$${texCommas(c)} - ${texCommas(a)} = ${texCommas(answer)}$。`,
      ],
    );
  },
);

const startingNumber = skill(
  "the-number-before-a-subtraction",
  ["The number before a subtraction", "减法之前的数"],
  [
    "A subtraction can be checked by adding, and the same idea finds a missing starting number. What was taken away and what is left together make up the start. So add the difference and the number subtracted to find the number you began with.",
    "减法可以用加法检验，同样的想法可以求出缺少的被减数。减去的数和剩下的数合起来就是原来的数。所以把差和减数相加，就得到一开始的数。",
  ],
  (rng) => {
    const b = rng.int(1000, 900000);
    const c = rng.int(1000, 900000);
    const answer = b + c;
    return whole(
      [
        `What number makes this true? $\\square - ${texCommas(b)} = ${texCommas(c)}$`,
        `什么数使下面的式子成立？$\\square - ${texCommas(b)} = ${texCommas(c)}$`,
      ],
      answer,
      [Math.abs(b - c), answer + 1000, answer - 1000, answer + 100],
      [
        `The start is what was left plus what was taken away: $${texCommas(c)} + ${texCommas(b)} = ${texCommas(answer)}$.`,
        `原来的数等于剩下的数加上减去的数：$${texCommas(c)} + ${texCommas(b)} = ${texCommas(answer)}$。`,
      ],
    );
  },
);

const threeLcm = skill(
  "the-least-common-multiple-of-three-numbers",
  ["The least common multiple of three numbers", "三个数的最小公倍数"],
  [
    "The least common multiple of three numbers can be found two at a time. First find the least common multiple of two of them, then find the least common multiple of that result and the third number. The result is a multiple of all three, and no smaller number is.",
    "三个数的最小公倍数可以两个两个地求。先求其中两个数的最小公倍数，再求这个结果与第三个数的最小公倍数。结果是这三个数的倍数，而且没有更小的数是。",
  ],
  (rng) => {
    const [a, b, c] = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15], 3) as [number, number, number];
    const lcm = (x: number, y: number) => (x * y) / gcd(x, y);
    const ab = lcm(a, b);
    const answer = lcm(ab, c);
    return whole(
      [`What is the least common multiple of ${a}, ${b} and ${c}?`, `${a}、${b} 和 ${c} 的最小公倍数是多少？`],
      answer,
      [a * b * c === answer ? 2 * answer : a * b * c, ab, answer + c, gcd(gcd(a, b), c)],
      [
        `The least common multiple of ${a} and ${b} is ${ab}, and the least common multiple of ${ab} and ${c} is ${answer}.`,
        `${a} 和 ${b} 的最小公倍数是 ${ab}，${ab} 和 ${c} 的最小公倍数是 ${answer}。`,
      ],
    );
  },
);

const missingPartial = skill(
  "a-missing-partial-product",
  ["A missing partial product", "缺少的部分积"],
  [
    "A product of two-digit numbers splits into two partial products, one for the tens of the second factor and one for its ones. If the first partial product is given, the other one comes from multiplying the first factor by the ones digit. Their sum is the whole product.",
    "两个两位数的积可以分成两个部分积，一个对应第二个因数的十位，一个对应它的个位。如果给出了第一个部分积，另一个就是第一个因数乘个位数字。它们的和就是整个积。",
  ],
  (rng) => {
    const a = rng.int(12, 99);
    const tens = rng.int(1, 9) * 10;
    const ones = rng.int(2, 9);
    const answer = a * ones;
    return whole(
      [
        `What number makes this true? $${a} \\times ${tens + ones} = ${a * tens} + \\square$`,
        `什么数使下面的式子成立？$${a} \\times ${tens + ones} = ${a * tens} + \\square$`,
      ],
      answer,
      [a * (tens + ones), a + ones, a * tens, answer + 10],
      [
        `$${tens + ones}$ is $${tens} + ${ones}$, so the missing part is $${a} \\times ${ones} = ${answer}$.`,
        `$${tens + ones}$ 是 $${tens} + ${ones}$，所以缺少的部分是 $${a} \\times ${ones} = ${answer}$。`,
      ],
    );
  },
);

const theDividend = skill(
  "the-dividend-from-a-quotient-and-remainder",
  ["The dividend from a quotient and remainder", "由商和余数求被除数"],
  [
    "Division with a remainder says that the dividend is made of equal groups plus a few left over. So the dividend equals the divisor times the quotient, plus the remainder. This is also how to check any division with a remainder after it is finished.",
    "有余数的除法说明，被除数由若干相等的组和剩下的几个组成。所以被除数等于除数乘商，再加余数。做完任何有余数的除法后，也可以这样检验。",
  ],
  (rng) => {
    const d = rng.int(3, 9);
    const q = rng.int(4, 60);
    const r = rng.int(1, d - 1);
    const answer = d * q + r;
    return whole(
      [
        `A number divided by ${d} gives ${q} with a remainder of ${r}. What is the number?`,
        `一个数除以 ${d}，商是 ${q}，余数是 ${r}。这个数是多少？`,
      ],
      answer,
      [d * q, d * q - r, d * (q + r), q + d + r],
      [
        `Make the groups and add the rest: $${d} \\times ${q} + ${r} = ${answer}$.`,
        `先算相等的组，再加上剩下的：$${d} \\times ${q} + ${r} = ${answer}$。`,
      ],
    );
  },
);

const largestRemainder = skill(
  "the-largest-possible-remainder",
  ["The largest possible remainder", "最大可能的余数"],
  [
    "A remainder is what is left after making as many full groups as possible. If as many as the divisor were left over, they would make one more group. So a remainder is always smaller than the divisor, and the largest it can be is one less than the divisor.",
    "余数是尽可能多地分成满组后剩下的部分。如果剩下的和除数一样多，就可以再分一组。所以余数总是小于除数，最大是比除数小 1。",
  ],
  (rng) => {
    const d = rng.int(3, 60);
    const items: Pair = rng.pick<Pair>([
      ["marbles", "弹珠"],
      ["stickers", "贴纸"],
      ["cards", "卡片"],
      ["beads", "珠子"],
    ]);
    const answer = d - 1;
    return whole(
      [
        `Some ${items[0]} are shared equally into groups of ${d}, with some left over. What is the largest number that can be left over?`,
        `把一些${items[1]}按每组 ${d} 个分组，还有剩余。剩余最多是多少个？`,
      ],
      answer,
      [d, d + 1, Math.floor(d / 2), answer - 1],
      [
        `${d} left over would make another group, so at most ${answer} can be left.`,
        `如果剩下 ${d} 个，就能再分一组，所以最多剩下 ${answer} 个。`,
      ],
    );
  },
);

const missingFactorInExpression = skill(
  "a-missing-factor-in-a-two-step-expression",
  ["A missing factor in a two-step expression", "两步算式中缺少的因数"],
  [
    "An expression like $a \\times \\square + b = c$ was built in two steps, multiplying and then adding. To find the missing number, undo the steps in reverse order. Subtract $b$ from $c$ first, which undoes the addition, and then divide by $a$, which undoes the multiplication.",
    "像 $a \\times \\square + b = c$ 这样的算式是分两步得到的，先乘再加。要求缺少的数，就按相反的顺序撤销这些步骤。先从 $c$ 减去 $b$，撤销加法，再除以 $a$，撤销乘法。",
  ],
  (rng) => {
    const a = rng.int(2, 12);
    const answer = rng.int(2, 15);
    const b = rng.int(1, 40);
    const c = a * answer + b;
    return whole(
      [
        `What number makes this true? $${a} \\times \\square + ${b} = ${c}$`,
        `什么数使下面的式子成立？$${a} \\times \\square + ${b} = ${c}$`,
      ],
      answer,
      [c - b, Math.floor(c / a), answer + 1, c - a - b],
      [
        `First $${c} - ${b} = ${c - b}$, then $${c - b} \\div ${a} = ${answer}$.`,
        `先算 $${c} - ${b} = ${c - b}$，再算 $${c - b} \\div ${a} = ${answer}$。`,
      ],
    );
  },
);

const fractionsBetween = skill(
  "counting-fractions-between-two-fractions",
  ["Counting fractions between two fractions", "数两个分数之间的分数"],
  [
    "Fractions with the same denominator are ordered by their numerators, like counting by one part at a time. So the fractions strictly between two of them have the numerators strictly between. Those numerators can be counted, and the two end fractions are not included in the count.",
    "分母相同的分数按分子排序，就像一份一份地数。所以严格介于两个分数之间的分数，分子也严格介于它们的分子之间。可以数出这些分子，两端的分数不计在内。",
  ],
  (rng) => {
    const n = rng.int(7, 24);
    const a = rng.int(1, n - 4);
    const b = rng.int(a + 3, n - 1);
    const answer = b - a - 1;
    return whole(
      [
        `How many fractions with denominator ${n} are strictly between $\\frac{${a}}{${n}}$ and $\\frac{${b}}{${n}}$?`,
        `分母为 ${n} 且严格介于 $\\frac{${a}}{${n}}$ 和 $\\frac{${b}}{${n}}$ 之间的分数有多少个？`,
      ],
      answer,
      [b - a, b - a + 1, n - b, b],
      [
        `The numerators run from ${a + 1} to ${b - 1}, which is ${answer} ${answer === 1 ? "number" : "numbers"}.`,
        `分子从 ${a + 1} 到 ${b - 1}，共 ${answer} 个数。`,
      ],
    );
  },
);

const fractionOfGroup = skill(
  "a-fraction-of-a-group-of-objects",
  ["A fraction of a group of objects", "一组物体的几分之几"],
  [
    "To find a fraction of a group, split the group into as many equal parts as the denominator says, then take as many parts as the numerator says. So dividing by the denominator and multiplying by the numerator gives the size of that fraction of the group.",
    "要求一组物体的几分之几，先按分母把这组物体分成相等的几份，再按分子取其中的几份。所以先除以分母，再乘分子，就得到这部分的大小。",
  ],
  (rng) => {
    const den = rng.int(3, 12);
    let num = rng.int(2, den - 1);
    while (gcd(num, den) !== 1) num--;
    return fractionOfGroupOf(num, den, rng.int(2, 12));
  },
);

/** fractionOfGroupOf asks for a proper fraction of a multiple of its denominator. */
function fractionOfGroupOf(num: number, d: number, count: number) {
  const total = d * count;
  const answer = (total / d) * num;
  return whole(
    [
      `A class has ${total} books, and $\\frac{${num}}{${d}}$ of them are about animals. How many books are about animals?`,
      `班里有 ${total} 本书，其中 $\\frac{${num}}{${d}}$ 是关于动物的。关于动物的书有多少本？`,
    ],
    answer,
    [total / d, total - answer, total * num, answer + d],
    [
      `One of ${d} equal parts is $${total} \\div ${d} = ${total / d}$, and ${num} of those parts make ${answer}.`,
      `${d} 等份中的一份是 $${total} \\div ${d} = ${total / d}$，${num} 份是 ${answer}。`,
    ],
  );
}

const countingHundredths = skill(
  "counting-the-hundredths-in-a-decimal",
  ["Counting the hundredths in a decimal", "数一个小数含有多少个百分之一"],
  [
    "A decimal can be read as one count of its smallest unit. One whole is 100 hundredths and one tenth is 10 hundredths. So a number with two decimal places is a count of hundredths, which is the number you get by ignoring the decimal point.",
    "一个小数可以看成若干个最小单位。1 是 100 个百分之一，0.1 是 10 个百分之一。所以一个两位小数就是若干个百分之一，个数就是去掉小数点后得到的数。",
  ],
  (rng) => {
    const answer = rng.int(101, 2499);
    const text = (answer / 100).toFixed(2);
    return whole(
      [`How many hundredths are in ${text}?`, `${text} 含有多少个百分之一？`],
      answer,
      [Math.floor(answer / 10), answer * 10, answer % 100, Math.floor(answer / 100)],
      [
        `${text} written as hundredths is $\\frac{${answer}}{100}$, so there are ${answer} hundredths.`,
        `${text} 写成百分之几是 $\\frac{${answer}}{100}$，所以有 ${answer} 个百分之一。`,
      ],
    );
  },
);

const twoUnitLengths = skill(
  "adding-lengths-given-in-two-units",
  ["Adding lengths given in two units", "相加用两种单位表示的长度"],
  [
    "Lengths written in meters and centimeters are hard to add directly when the centimeters pass 100. Converting each length to centimeters first removes the problem, since each meter is 100 centimeters. Then the two lengths are ordinary whole numbers, which can be added in the usual way.",
    "用米和厘米表示的长度，当厘米数超过 100 时不容易直接相加。先把每个长度都换算成厘米就没有这个问题了，因为每米是 100 厘米。这样两个长度都是普通整数，可以照常相加。",
  ],
  (rng) => {
    const [m1, m2] = [rng.int(1, 9), rng.int(1, 9)];
    const [c1, c2] = [rng.int(15, 95), rng.int(15, 95)];
    const answer = 100 * (m1 + m2) + c1 + c2;
    return whole(
      [
        `A rope of ${m1} m ${c1} cm is tied to a rope of ${m2} m ${c2} cm, ignoring the knot. How many centimeters long are they in all?`,
        `把一根 ${m1} 米 ${c1} 厘米的绳子和一根 ${m2} 米 ${c2} 厘米的绳子接起来（不计绳结）。总共多少厘米？`,
      ],
      answer,
      [m1 + m2 + c1 + c2, 100 * (m1 + m2) + c1, 10 * (m1 + m2) + c1 + c2, answer + 100],
      [`$${100 * m1 + c1} + ${100 * m2 + c2} = ${answer}$ centimeters.`, `$${100 * m1 + c1} + ${100 * m2 + c2} = ${answer}$ 厘米。`],
    );
  },
);

const bagsFromKilograms = skill(
  "how-many-equal-bags-from-a-mass",
  ["How many equal bags from a mass", "一定质量能装多少袋"],
  [
    "When a total is in kilograms and each portion is in grams, the two must be put in the same unit before dividing. Since 1 kilogram is 1,000 grams, multiply the kilograms by 1,000. Then dividing by the grams in one portion gives the number of portions.",
    "当总量用千克表示而每份用克表示时，要先统一单位再做除法。因为 1 千克是 1,000 克，所以把千克数乘 1,000。然后除以每份的克数，就得到份数。",
  ],
  (rng) => {
    const g = rng.pick([100, 125, 200, 250, 500]);
    const kg = rng.int(2, 30);
    const answer = (kg * 1000) / g;
    return whole(
      [
        `${kg} kg of rice is packed into bags of ${g} g each. How many bags are filled?`,
        `把 ${kg} 千克大米装进每袋 ${g} 克的袋子。能装满多少袋？`,
      ],
      answer,
      [answer / 10, answer * 10, kg * g, answer + kg],
      [
        `${kg} kg is ${commas(kg * 1000)} g, and $${kg * 1000} \\div ${g} = ${answer}$.`,
        `${kg} 千克是 ${commas(kg * 1000)} 克，$${kg * 1000} \\div ${g} = ${answer}$。`,
      ],
    );
  },
);

const minuteHand = skill(
  "how-far-the-minute-hand-turns",
  ["How far the minute hand turns", "分针转过的角度"],
  [
    "The minute hand makes a full turn of $360^\\circ$ in 60 minutes. So in one minute it turns $360 \\div 60 = 6$ degrees. To find the turn for any number of minutes, multiply that number by 6. Fifteen minutes gives a right angle, as the clock face shows.",
    "分针 60 分钟转一整圈，即 $360^\\circ$。所以它每分钟转 $360 \\div 60 = 6$ 度。要求任意分钟数转过的角度，就用分钟数乘 6。15 分钟正好是一个直角，从钟面上也能看出来。",
  ],
  (rng) => {
    const m = rng.int(2, 58);
    const answer = 6 * m;
    return whole(
      [`Through how many degrees does the minute hand of a clock turn in ${m} minutes?`, `钟面上的分针 ${m} 分钟转过多少度？`],
      answer,
      [30 * m, m, 360 - answer, answer + 6],
      [`It turns 6 degrees each minute, and $6 \\times ${m} = ${answer}$.`, `它每分钟转 6 度，$6 \\times ${m} = ${answer}$。`],
    );
  },
);

const aroundAPoint = skill(
  "the-angle-left-around-a-point",
  ["The angle left around a point", "一点周围剩下的角"],
  [
    "Angles that fill the space around a point make one full turn, which is $360^\\circ$. So when all the angles but one are known, add the known angles and subtract the total from 360. The answer may be larger than a straight angle, in which case it is a reflex angle.",
    "铺满一点周围的角合起来是一整圈，即 $360^\\circ$。所以当只有一个角未知时，把已知的角相加，再用 360 减去这个和。结果可能比平角大，这时它是一个优角。",
  ],
  (rng) => {
    const a = rng.int(25, 130);
    const b = rng.int(25, 110);
    const c = rng.int(25, 90);
    const answer = 360 - a - b - c;
    return whole(
      [
        `Four angles fill the space around a point. Three of them measure $${a}^\\circ$, $${b}^\\circ$ and $${c}^\\circ$. How many degrees is the fourth?`,
        `四个角铺满一点的周围。其中三个角分别是 $${a}^\\circ$、$${b}^\\circ$ 和 $${c}^\\circ$。第四个角是多少度？`,
      ],
      answer,
      [180 - (a + b + c) > 0 ? 180 - (a + b + c) : a + b + c, a + b + c, answer + 10, answer - 10],
      [
        `The three angles add to ${a + b + c} degrees, and $360 - ${a + b + c} = ${answer}$.`,
        `这三个角的和是 ${a + b + c} 度，$360 - ${a + b + c} = ${answer}$。`,
      ],
    );
  },
);

/** deeperGrade4MorePoints maps topics of 4th Grade Math to a second set of further knowledge points. */
export const deeperGrade4MorePoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "place-value-with-numbers-up-to-seven-digits": [timesAsGreat],
  "comparing-whole-numbers-using-place-value": [fromDigitCards],
  "adding-numbers-up-to-seven-digits": [largeMissingAddend],
  "subtracting-numbers-up-to-seven-digits": [startingNumber],
  "least-common-multiple": [threeLcm],
  "two-digit-by-two-digit-multiplication-using-place-value": [missingPartial],
  "understanding-remainders-using-models": [theDividend],
  "two-digit-by-one-digit-division-with-remainders-using-partial-quotients": [largestRemainder],
  "evaluating-expressions-involving-addition-and-multiplication": [missingFactorInExpression],
  "comparing-fractions": [fractionsBetween],
  "multiplying-fractions-by-whole-numbers": [fractionOfGroup],
  "decimal-fractions": [countingHundredths],
  "converting-metric-units-of-length-to-smaller-units": [twoUnitLengths],
  "converting-units-of-mass-to-smaller-units": [bagsFromKilograms],
  "connecting-angles-and-circles": [minuteHand],
  "acute-obtuse-and-reflex-angles": [aroundAPoint],
};
