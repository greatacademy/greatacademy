// A second set of further knowledge points for 5th Grade Math, mostly the same facts run
// backwards or used in a longer setting. See `deeperGrade5MorePoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

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

/** money builds a problem whose answer is an amount given in cents and answered as a decimal. */
const money = (prompt: Pair, cents: number, wrong: readonly number[], solution: Pair) =>
  numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer: Q.of(cents, 100),
    form: "decimal",
    wrong: wrong.filter((w) => w > 0).map((w) => Q.of(w, 100)),
    solution: t(solution[0], solution[1]),
  });

/** fraction builds a problem whose answer is a fraction. */
const fraction = (prompt: Pair, answer: Q, wrong: readonly Q[], solution: Pair) =>
  numberProblem({ prompt: t(prompt[0], prompt[1]), answer, wrong, solution: t(solution[0], solution[1]) });

/** usd writes an amount in cents with two decimal places. */
const usd = (cents: number) => (cents / 100).toFixed(2);

/** texCommas writes a whole number with thousands separators for math. */
const texCommas = (n: number) => String(n).replace(/\\B(?=(\\d{3})+$)/g, "{,}");
/** gcd is the greatest common factor of two positive whole numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const nearbyProduct = skill(
  "a-product-from-a-nearby-product",
  ["A product from a nearby product", "由相近的积求积"],
  [
    "Multiplication distributes over addition, so a known product gives its neighbors cheaply. If $a \\times b$ is known, then $a \\times (b + 1)$ is just one more group of $a$, and $a \\times (b - 1)$ is one group fewer. There is no need to start the multiplication over.",
    "乘法对加法有分配律，所以由一个已知的积很容易得到相近的积。如果知道 $a \\times b$，那么 $a \\times (b + 1)$ 只是多一组 $a$，$a \\times (b - 1)$ 只是少一组 $a$。不必从头再乘一遍。",
  ],
  (rng) => {
    const a = rng.int(23, 987);
    const b = rng.int(12, 89);
    const up = rng.bool();
    const other = up ? b + 1 : b - 1;
    const answer = a * other;
    return whole(
      [
        `Given that $${a} \\times ${b} = ${texCommas(a * b)}$, what is $${a} \\times ${other}$?`,
        `已知 $${a} \\times ${b} = ${texCommas(a * b)}$，$${a} \\times ${other}$ 是多少？`,
      ],
      answer,
      [up ? a * b + 1 : a * b - 1, up ? a * b + b : a * b - b, up ? answer + a : answer - a, answer + 10],
      [
        `${up ? "One more" : "One fewer"} group of ${a} gives $${texCommas(a * b)} ${up ? "+" : "-"} ${a} = ${texCommas(answer)}$.`,
        `${up ? "多" : "少"}一组 ${a}，得到 $${texCommas(a * b)} ${up ? "+" : "-"} ${a} = ${texCommas(answer)}$。`,
      ],
    );
  },
);

const theDivisor = skill(
  "the-divisor-from-a-quotient-and-remainder",
  ["The divisor from a quotient and remainder", "由商和余数求除数"],
  [
    "The dividend is made of equal groups plus a remainder. So taking the remainder away leaves exactly the divisor times the quotient. Dividing what is left by the quotient gives the divisor. The result must be larger than the remainder, which is a useful way to check the work.",
    "被除数由相等的组和余数组成。所以去掉余数后，剩下的恰好是除数乘商。用剩下的数除以商就得到除数。结果必须大于余数，这是检验的好办法。",
  ],
  (rng) => {
    const d = rng.int(12, 45);
    const q = rng.int(11, 40);
    const r = rng.int(1, d - 1);
    const dividend = d * q + r;
    return whole(
      [
        `When ${dividend} is divided by a number, the quotient is ${q} and the remainder is ${r}. What is the number?`,
        `${dividend} 除以一个数，商是 ${q}，余数是 ${r}。这个数是多少？`,
      ],
      d,
      [Math.floor(dividend / q) === d ? d + 1 : Math.floor(dividend / q), q, d - 1, d + r],
      [
        `Take away the remainder: $${dividend} - ${r} = ${d * q}$, then $${d * q} \\div ${q} = ${d}$.`,
        `去掉余数：$${dividend} - ${r} = ${d * q}$，再算 $${d * q} \\div ${q} = ${d}$。`,
      ],
    );
  },
);

const restOfTheWhole = skill(
  "the-part-left-of-a-whole",
  ["The part left of a whole", "整体中剩下的部分"],
  [
    "All the parts of a whole add up to 1. So when two fractional parts with different denominators are known, add them over a common denominator and subtract the sum from 1. Writing 1 as a fraction with that same denominator makes the subtraction a matter of numerators.",
    "整体的所有部分加起来是 1。所以当已知两个分母不同的部分时，先通分相加，再用 1 减去这个和。把 1 写成同分母的分数后，减法就只需计算分子。",
  ],
  (rng) => {
    const [a, b] = rng.sample([3, 4, 5, 6, 8, 10, 12], 2) as [number, number];
    const answer = Q.of(1, 1).add(Q.of(-1, a)).add(Q.of(-1, b));
    const sum = Q.of(1, a).add(Q.of(1, b));
    return fraction(
      [
        `A garden has $\\frac{1}{${a}}$ of its area in beans and $\\frac{1}{${b}}$ in peas. The rest is in corn. What fraction of the garden is in corn?`,
        `一个菜园的 $\\frac{1}{${a}}$ 种豆子，$\\frac{1}{${b}}$ 种豌豆，其余种玉米。玉米占菜园的几分之几？`,
      ],
      answer,
      [sum, Q.of(1, a + b), Q.of(a + b - 2, a + b), Q.of(1, a * b)].filter((v) => !v.eq(answer)),
      [
        `The beans and peas take $${sum.toLatex()}$, and $1 - ${sum.toLatex()} = ${answer.toLatex()}$.`,
        `豆子和豌豆占 $${sum.toLatex()}$，$1 - ${sum.toLatex()} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const fractionOfFraction = skill(
  "a-fraction-of-a-fraction-of-a-number",
  ["A fraction of a fraction of a number", "一个数的几分之几的几分之几"],
  [
    "When a fraction of a fraction of a quantity is asked for, the two can be taken one after the other, working from the inside. Find the first fraction of the quantity, then take the second fraction of the result. Multiplying the two fractions first gives the same answer.",
    "求一个量的几分之几的几分之几时，可以从里到外依次计算。先求这个量的第一个分数，再求结果的第二个分数。先把两个分数相乘，答案也相同。",
  ],
  (rng) => {
    const [a, b] = [rng.int(2, 5), rng.pick([3, 4, 5, 6])];
    const c = rng.int(1, b - 1);
    const unit = rng.int(1, 9);
    const n = a * b * unit;
    const first = (n * c) / b;
    const answer = first / a;
    return whole(
      [
        `A school has ${n} students. $\\frac{${c}}{${b}}$ of them walk to school, and $\\frac{1}{${a}}$ of the walkers walk with a parent. How many students walk with a parent?`,
        `一所学校有 ${n} 名学生。其中 $\\frac{${c}}{${b}}$ 步行上学，步行的学生中有 $\\frac{1}{${a}}$ 由家长陪同。由家长陪同步行的学生有多少名？`,
      ],
      answer,
      [first, n - first, first - answer, n / a],
      [
        `$\\frac{${c}}{${b}}$ of ${n} is ${first}, and $\\frac{1}{${a}}$ of ${first} is ${answer}.`,
        `${n} 的 $\\frac{${c}}{${b}}$ 是 ${first}，${first} 的 $\\frac{1}{${a}}$ 是 ${answer}。`,
      ],
    );
  },
);

const wholeFromPart = skill(
  "the-whole-from-a-fraction-of-it",
  ["The whole from a fraction of it", "由几分之几求整体"],
  [
    "If a fraction of a number is known, the number itself can be found by dividing by the fraction. This is the same as a two-step picture: dividing by the numerator gives the size of one part, and multiplying by the denominator gives all the parts of the whole.",
    "如果知道一个数的几分之几，就可以用除以这个分数求出这个数。这也可以看成两步：除以分子得到一份的大小，再乘分母得到整体的所有份。",
  ],
  (rng) => {
    const d = rng.int(3, 12);
    let n = rng.int(2, d - 1);
    while (gcd(n, d) !== 1) n--;
    const part = rng.int(2, 15);
    const known = n * part;
    const answer = d * part;
    return whole(
      [`$\\frac{${n}}{${d}}$ of a number is ${known}. What is the number?`, `一个数的 $\\frac{${n}}{${d}}$ 是 ${known}。这个数是多少？`],
      answer,
      [(known * n) / d, known * n, known + d, answer + part],
      [
        `One part is $${known} \\div ${n} = ${part}$, and ${d} parts make ${answer}.`,
        `一份是 $${known} \\div ${n} = ${part}$，${d} 份是 ${answer}。`,
      ],
    );
  },
);

const decimalTimes = skill(
  "how-many-times-as-great-a-decimal-digit-is",
  ["How many times as great a decimal digit is", "小数中一个数字的值是另一个的多少倍"],
  [
    "Decimal places follow the same pattern as whole number places. Moving one place to the left multiplies the value of a digit by 10, whether or not the decimal point lies between the places. So count the places between two copies of a digit and multiply by that many tens.",
    "小数的数位与整数的数位遵循同样的规律。向左移动一位，数字的值就乘 10，不管中间是否隔着小数点。所以数一数相同数字之间隔了几位，就乘相应个数的 10。",
  ],
  (rng) => {
    const d = rng.int(1, 9);
    const others = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== d);
    // Positions run from 0 for thousandths up to 4 for tens.
    const lo = rng.int(0, 3);
    const hi = rng.int(lo + 1, 4);
    const names: readonly Pair[] = [
      ["thousandths", "千分位"],
      ["hundredths", "百分位"],
      ["tenths", "十分位"],
      ["ones", "个位"],
      ["tens", "十位"],
    ];
    const digits = [0, 1, 2, 3, 4].map((i) =>
      i === lo || i === hi ? d : i === 4 ? rng.pick(others.filter((v) => v > 0)) : rng.pick(others),
    );
    const text = `${digits[4]}${digits[3]}.${digits[2]}${digits[1]}${digits[0]}`;
    const gap = hi - lo;
    const answer = 10 ** gap;
    const [high, low] = [names[hi] as Pair, names[lo] as Pair];
    return whole(
      [
        `In $${text}$, the ${d} in the ${high[0]} place is worth how many times the ${d} in the ${low[0]} place?`,
        `在 $${text}$ 中，${high[1]}上的 ${d} 表示的值是${low[1]}上的 ${d} 表示的值的多少倍？`,
      ],
      answer,
      [gap, answer * 10, gap === 1 ? 100 : answer / 10, d * answer],
      [
        `The places are ${gap} apart, and each place left multiplies by 10, which gives ${answer}.`,
        `这两个数位相隔 ${gap} 位，每向左一位乘 10，所以是 ${answer} 倍。`,
      ],
    );
  },
);

const countingSigFigs = skill(
  "counting-significant-figures",
  ["Counting significant figures", "数有效数字"],
  [
    "Significant figures start at the first nonzero digit. Zeros in front of it only show the size of the number and do not count. Every digit after it does count, including zeros in the middle and zeros at the end of a decimal, since those record how precisely it was measured.",
    "有效数字从第一个非零数字开始。它前面的零只表示数的大小，不计入。它后面的每个数字都计入，包括中间的零和小数末尾的零，因为这些零记录了测量的精确程度。",
  ],
  (rng) => {
    const leading = rng.int(0, 3);
    const middle = rng.int(1, 4);
    const body = [rng.int(1, 9), ...Array.from({ length: middle }, () => rng.pick([0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))];
    const trailing = rng.bool() ? "0" : "";
    const text = `0.${"0".repeat(leading)}${body.join("")}${trailing}`;
    const answer = body.length + trailing.length;
    return whole(
      [`How many significant figures does ${text} have?`, `${text} 有几位有效数字？`],
      answer,
      [answer + leading + 1, body.filter((v) => v !== 0).length, answer + 1, answer - 1],
      [
        `Start counting at the first nonzero digit, ${body[0]}. From there to the end there are ${answer} digits.`,
        `从第一个非零数字 ${body[0]} 开始数，到末尾共有 ${answer} 个数字。`,
      ],
    );
  },
);

const leftOfTen = skill(
  "the-rest-of-a-decimal-total",
  ["The rest of a decimal total", "小数总量剩下的部分"],
  [
    "When two decimal amounts are taken from a total, either subtract them one at a time or add them first and subtract the sum once. In both cases line up the decimal points, and write the whole number total with zeros after the point so that every place has a digit.",
    "从总量中取走两个小数量时，可以一个一个地减，也可以先把它们相加再减去和。两种做法都要对齐小数点，并在整数总量的小数点后补零，使每个数位都有数字。",
  ],
  (rng) => {
    const total = rng.pick([10, 20, 50, 100]);
    const a = rng.int(105, (total * 100) / 2 - 1);
    const b = rng.int(55, (total * 100) / 2 - 1);
    const answer = total * 100 - a - b;
    return money(
      [
        `A runner plans ${total} km in all. The first two stages are ${usd(a)} km and ${usd(b)} km. How many kilometers are left?`,
        `一名跑者计划跑 ${total} 千米。前两段分别是 ${usd(a)} 千米和 ${usd(b)} 千米。还剩多少千米？`,
      ],
      answer,
      [a + b, answer + 100, answer - 10, total * 100 - a],
      [
        `The two stages add to $${usd(a + b)}$, and $${total} - ${usd(a + b)} = ${usd(answer)}$.`,
        `两段相加是 $${usd(a + b)}$，$${total} - ${usd(a + b)} = ${usd(answer)}$。`,
      ],
    );
  },
);

const changeFromPayment = skill(
  "change-from-a-bulk-purchase",
  ["Change from a bulk purchase", "批量购买的找零"],
  [
    "A purchase of many identical items takes two steps. Multiply the price by the number of items to find the cost, keeping track of the decimal places. Then subtract the cost from the amount paid. An estimate of the cost first shows whether the payment is enough and the answer reasonable.",
    "购买许多相同物品要分两步。先用单价乘数量求出总价，注意小数位数。再用付的钱减去总价。先估算总价可以看出付的钱是否足够、答案是否合理。",
  ],
  (rng) => {
    const count = rng.int(11, 28);
    const price = rng.int(26, 95) * 5;
    const cost = count * price;
    const paid = (Math.floor(cost / 5000) + 1) * 5000;
    const answer = paid - cost;
    return money(
      [
        `A club buys ${count} notebooks at ${usd(price)} dollars each and pays with ${paid / 100} dollars. How many dollars of change does it get?`,
        `一个社团买 ${count} 本笔记本，每本 ${usd(price)} 美元，付了 ${paid / 100} 美元。应找回多少美元？`,
      ],
      answer,
      [cost, paid - price, answer + price, answer + 100],
      [
        `The notebooks cost $${count} \\times ${usd(price)} = ${usd(cost)}$, and $${paid / 100} - ${usd(cost)} = ${usd(answer)}$.`,
        `笔记本共 $${count} \\times ${usd(price)} = ${usd(cost)}$ 美元，$${paid / 100} - ${usd(cost)} = ${usd(answer)}$ 美元。`,
      ],
    );
  },
);

const unitPrice = skill(
  "comparing-unit-prices",
  ["Comparing unit prices", "比较单价"],
  [
    "Packs of different sizes cannot be compared by their prices alone. Dividing the price of a pack by the number of items gives the price of one item, called the unit price. The pack with the smaller unit price is the better value, whichever pack costs less in total.",
    "大小不同的包装不能只看总价比较。用一包的价格除以物品个数，得到一个物品的价格，叫作单价。单价较低的包装更划算，不管哪一包的总价更低。",
  ],
  (rng) => {
    const [n1, n2] = rng.sample([3, 4, 5, 6, 8], 2) as [number, number];
    const u1 = rng.int(11, 59) * 5;
    let u2 = rng.int(11, 59) * 5;
    if (u2 === u1) u2 += 15;
    const answer = Math.min(u1, u2);
    return money(
      [
        `A pack of ${n1} pens costs ${usd(n1 * u1)} dollars, and a pack of ${n2} pens costs ${usd(n2 * u2)} dollars. What is the lower price per pen, in dollars?`,
        `${n1} 支装的钢笔卖 ${usd(n1 * u1)} 美元，${n2} 支装的卖 ${usd(n2 * u2)} 美元。较低的每支单价是多少美元？`,
      ],
      answer,
      [Math.max(u1, u2), Math.min(n1 * u1, n2 * u2), Math.abs(u1 - u2), answer + 10],
      [
        `The prices per pen are ${usd(u1)} and ${usd(u2)}, and the lower is ${usd(answer)}.`,
        `每支的单价分别是 ${usd(u1)} 和 ${usd(u2)}，较低的是 ${usd(answer)}。`,
      ],
    );
  },
);

const zerosInProduct = skill(
  "zeros-in-a-product-of-powers-of-ten",
  ["Zeros in a product of powers of ten", "十的幂之积中零的个数"],
  [
    "The exponent of a power of ten counts its zeros, since each factor of 10 adds one zero. When powers of ten are multiplied, all the factors of 10 are simply listed together. So the number of zeros in the product is the sum of the two exponents.",
    "十的幂的指数就是它的零的个数，因为每个因数 10 增加一个零。十的幂相乘时，所有因数 10 就排在一起。所以积中零的个数是两个指数的和。",
  ],
  (rng) => {
    const [a, b] = [rng.int(2, 15), rng.int(2, 15)];
    const answer = a + b;
    return whole(
      [
        `How many zeros does $10^{${a}} \\times 10^{${b}}$ have when written out in standard form?`,
        `把 $10^{${a}} \\times 10^{${b}}$ 写成普通形式后，有多少个零？`,
      ],
      answer,
      [a * b, answer + 1, answer - 1, Math.max(a, b)],
      [
        `Each factor of 10 adds one zero, and there are $${a} + ${b} = ${answer}$ factors of 10.`,
        `每个因数 10 增加一个零，共有 $${a} + ${b} = ${answer}$ 个因数 10。`,
      ],
    );
  },
);

const missingBase = skill(
  "finding-a-missing-base",
  ["Finding a missing base", "求缺少的底数"],
  [
    "An exponent says how many equal factors are multiplied, so finding a missing base means finding the number that repeats. Try small whole numbers and compute the power until the value appears. The powers grow fast, so a few tries are enough, and the size of the value suggests where to start.",
    "指数说明相同的因数乘了几次，所以求缺少的底数，就是找那个重复的数。试一试较小的整数并算出幂，直到得到这个值。幂增长很快，试几次就够了，而值的大小也提示从哪里开始试。",
  ],
  (rng) => {
    const e = rng.int(2, 4);
    const max = e === 2 ? 25 : e === 3 ? 12 : 7;
    const answer = rng.int(2, max);
    const value = answer ** e;
    return whole(
      [`What whole number makes this true? $\\square^{${e}} = ${value}$`, `什么整数使下面的式子成立？$\\square^{${e}} = ${value}$`],
      answer,
      [value / e, value - e, answer + 1, answer - 1],
      [
        `$${Array.from({ length: e }, () => answer).join(" \\times ")} = ${value}$, so the base is ${answer}.`,
        `$${Array.from({ length: e }, () => answer).join(" \\times ")} = ${value}$，所以底数是 ${answer}。`,
      ],
    );
  },
);

const elapsedMinutes = skill(
  "elapsed-minutes-across-hours",
  ["Elapsed minutes across hours", "跨小时的经过分钟数"],
  [
    "To find the time between two clock readings, change each reading to minutes after the same starting point by multiplying the hours by 60 and adding the minutes. Then subtract. This avoids borrowing an hour by hand, which is where mistakes tend to happen when the minutes of the later time are smaller.",
    "要求两个时刻之间的时间，把每个时刻都换算成从同一起点算起的分钟数：小时数乘 60 再加分钟数。然后相减。这样就不用手动从小时借位，而当后一时刻的分钟数较小时，借位最容易出错。",
  ],
  (rng) => {
    const h1 = rng.int(1, 6);
    const m1 = rng.int(10, 55);
    const answer = rng.int(70, 200);
    const end = 60 * h1 + m1 + answer;
    const [h2, m2] = [Math.floor(end / 60), end % 60];
    const clock = (h: number, m: number) => `${h}:${String(m).padStart(2, "0")}`;
    return whole(
      [
        `A film starts at ${clock(h1, m1)} and ends at ${clock(h2, m2)} on the same afternoon. How many minutes long is it?`,
        `一部电影下午 ${clock(h1, m1)} 开始，同一个下午 ${clock(h2, m2)} 结束。它有多少分钟长？`,
      ],
      answer,
      [100 * (h2 - h1) + m2 - m1, Math.abs(m2 - m1), answer + 60, answer - 60],
      [
        `These are $${60 * h1 + m1}$ and $${end}$ minutes after 12:00, and $${end} - ${60 * h1 + m1} = ${answer}$.`,
        `它们是 12:00 之后的 $${60 * h1 + m1}$ 分钟和 $${end}$ 分钟，$${end} - ${60 * h1 + m1} = ${answer}$。`,
      ],
    );
  },
);

const areaOnMap = skill(
  "the-area-of-a-rectangle-on-a-map",
  ["The area of a rectangle on a map", "地图上长方形的面积"],
  [
    "When the sides of a rectangle follow the grid lines of a coordinate plane, each side length is a difference of coordinates. Subtract the two $x$-coordinates for the width and the two $y$-coordinates for the height. The area is then the product of the width and the height, in grid squares.",
    "当长方形的边沿着坐标平面的网格线时，每条边长都是坐标之差。两个 $x$ 坐标之差是宽，两个 $y$ 坐标之差是高。面积就是宽乘高，单位是网格的方格。",
  ],
  (rng) => {
    const [x1, y1] = [rng.int(1, 9), rng.int(1, 9)];
    const [w, h] = [rng.int(2, 12), rng.int(2, 12)];
    const [x2, y2] = [x1 + w, y1 + h];
    const answer = w * h;
    return whole(
      [
        `A park on a map is a rectangle with opposite corners at $(${x1}, ${y1})$ and $(${x2}, ${y2})$. Its sides follow the grid lines. How many grid squares does it cover?`,
        `地图上的一个公园是长方形，相对的两个角在 $(${x1}, ${y1})$ 和 $(${x2}, ${y2})$，边沿着网格线。它占多少个方格？`,
      ],
      answer,
      [x2 * y2, 2 * (w + h), w + h, x1 * y1 + answer],
      [
        `The width is $${x2} - ${x1} = ${w}$ and the height is $${y2} - ${y1} = ${h}$, so the area is ${answer}.`,
        `宽是 $${x2} - ${x1} = ${w}$，高是 $${y2} - ${y1} = ${h}$，所以面积是 ${answer}。`,
      ],
    );
  },
);

const layersFromCount = skill(
  "the-height-from-a-count-of-cubes",
  ["The height from a count of cubes", "由立方块个数求高"],
  [
    "A box packed with unit cubes is a stack of equal layers, and each layer holds length times width cubes. So the number of layers, which is the height of the box, is the total number of cubes divided by the number of cubes in one layer.",
    "装满单位立方块的盒子是若干相同层的堆叠，每层有长乘宽个立方块。所以层数，也就是盒子的高，等于立方块总数除以一层的立方块个数。",
  ],
  (rng) => {
    const [l, w] = [rng.int(2, 12), rng.int(2, 9)];
    const answer = rng.int(2, 12);
    const total = l * w * answer;
    return whole(
      [
        `A box ${l} cubes long and ${w} cubes wide is filled with ${total} unit cubes. How many cubes high is it?`,
        `一个盒子长 ${l} 个立方块，宽 ${w} 个立方块，装满了 ${total} 个单位立方块。它有多少个立方块高？`,
      ],
      answer,
      [total / l, total / w, total - l - w, l * w],
      [
        `One layer holds $${l} \\times ${w} = ${l * w}$ cubes, and $${total} \\div ${l * w} = ${answer}$.`,
        `一层有 $${l} \\times ${w} = ${l * w}$ 个立方块，$${total} \\div ${l * w} = ${answer}$。`,
      ],
    );
  },
);

/** deeperGrade5MorePoints maps topics of 5th Grade Math to a second set of further knowledge points. */
export const deeperGrade5MorePoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "multi-digit-by-two-digit-multiplication": [nearbyProduct],
  "three-digit-by-two-digit-division": [theDivisor],
  "subtracting-fractions-with-unlike-denominators": [restOfTheWhole],
  "multiplying-fractions": [fractionOfFraction],
  "dividing-fractions": [wholeFromPart],
  "comparing-place-values-with-decimals": [decimalTimes],
  "significant-figures": [countingSigFigs],
  "subtracting-decimals": [leftOfTen],
  "multiplying-a-decimal-by-a-multi-digit-whole-number": [changeFromPayment],
  "dividing-decimals-using-the-standard-algorithm": [unitPrice],
  "powers-of-ten": [zerosInProduct],
  "introduction-to-exponents": [missingBase],
  "converting-units-of-time-to-larger-units": [elapsedMinutes],
  "coordinate-planes-as-maps": [areaOnMap],
  "understanding-volume-using-unit-cubes": [layersFromCount],
};
