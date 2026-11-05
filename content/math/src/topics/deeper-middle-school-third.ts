// A third knowledge point for the school topics on rates, signed numbers, exponents, roots and expressions,
// shared by Prealgebra and 7th and 8th Grade Math: the missing number, the reverse question and the usual traps.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { chooseMath, whole } from "./early-grades-more-kit.ts";
import { decimal, frac, fraction, gcd, integer, signed, skill, tenths } from "./third-kit.ts";

/** deeperMiddleSchoolThirdPoints holds these third knowledge points, by topic. */
export const deeperMiddleSchoolThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "unit-rates-associated-with-ratios-of-fractions": [
    skill(
      "the-rate-the-other-way",
      ["The rate the other way", "反过来的比率"],
      [
        "Every ratio gives two unit rates, one for each order of the quantities. Hours per mile is the reciprocal of miles per hour, so the question decides which number is divided by which.",
        "每个比都有两个单位比率，对应两种顺序。每英里的小时数是每小时英里数的倒数，所以要由问题决定谁除以谁。",
      ],
      (rng) => {
        const [a, b] = rng.pick<[number, number]>([
          [1, 2],
          [2, 3],
          [3, 4],
          [3, 5],
          [4, 5],
          [5, 6],
          [3, 8],
          [5, 8],
          [7, 8],
          [2, 5],
        ]);
        const [c, d] = rng.pick<[number, number]>([
          [1, 3],
          [1, 4],
          [2, 5],
          [3, 7],
          [1, 6],
          [2, 7],
          [4, 9],
          [5, 9],
          [3, 10],
        ]);
        const dist = Q.of(a, b);
        const time = Q.of(c, d);
        return fraction(
          [
            `A hiker walks $${frac(a, b)}$ mile in $${frac(c, d)}$ hour. How many hours does the hiker take per mile?`,
            `一名徒步者 $${frac(c, d)}$ 小时走 $${frac(a, b)}$ 英里。每英里要用多少小时？`,
          ],
          time.div(dist),
          [dist.div(time), dist.mul(time), time],
          [
            `Divide hours by miles: $${frac(c, d)} \\div ${frac(a, b)} = ${frac(c, d)} \\times ${frac(b, a)}$.`,
            `小时数除以英里数：$${frac(c, d)} \\div ${frac(a, b)} = ${frac(c, d)} \\times ${frac(b, a)}$。`,
          ],
        );
      },
    ),
  ],
  "understanding-proportional-relationships-from-descriptions": [
    skill(
      "predicting-from-one-pair",
      ["Predicting from one pair", "由一组数预测"],
      [
        "A single pair of values fixes a proportional relationship, because the constant of proportionality is their quotient. Multiplying any other input by that constant gives its output.",
        "一组数就能确定正比例关系，因为比例常数是它们的商。用这个常数乘其他输入，就得到对应的输出。",
      ],
      (rng) => {
        const k = rng.int(2, 15);
        const x = rng.int(2, 12);
        let z = rng.int(2, 30);
        if (z === x) z += 1;
        return whole(
          [
            `$y$ is proportional to $x$, and $y = ${k * x}$ when $x = ${x}$. What is $y$ when $x = ${z}$?`,
            `$y$ 与 $x$ 成正比例，当 $x = ${x}$ 时 $y = ${k * x}$。当 $x = ${z}$ 时 $y$ 是多少？`,
          ],
          k * z,
          [k * x + (z - x > 0 ? z - x : x - z), k + z, k * x * z],
          [
            `The constant is $${k * x} \\div ${x} = ${k}$, and $${k} \\times ${z} = ${k * z}$. Adding the same amount to both is not proportional.`,
            `常数是 $${k * x} \\div ${x} = ${k}$，$${k} \\times ${z} = ${k * z}$。两边加同样的数不是正比例。`,
          ],
        );
      },
    ),
  ],
  "applying-percentage-increases": [
    skill(
      "the-price-before-the-increase",
      ["The price before the increase", "涨价前的价格"],
      [
        "After an increase the new amount is more than 100 percent of the original. So the original comes from dividing by the multiplier, and taking the percent off the new amount gives too small a number.",
        "涨价后新价是原价的百分之一百多。所以原价要用新价除以这个倍数；从新价中减去这个百分比，结果会偏小。",
      ],
      (rng) => {
        const p = rng.pick([10, 20, 25, 40, 50, 60, 75]);
        const orig = rng.int(2, 30) * 20;
        const now = (orig * (100 + p)) / 100;
        return whole(
          [
            `After a ${p}% increase, a bike costs ${now} dollars. What did it cost before the increase, in dollars?`,
            `涨价 ${p}% 后，一辆自行车售价 ${now} 美元。涨价前是多少美元？`,
          ],
          orig,
          [Math.round((now * (100 - p)) / 100), now - p, now],
          [
            `$${now} \\div ${(100 + p) / 100} = ${orig}$, since the new price is ${100 + p}% of the old one.`,
            `$${now} \\div ${(100 + p) / 100} = ${orig}$，因为新价是原价的 ${100 + p}%。`,
          ],
        );
      },
    ),
  ],
  "subtracting-a-positive-number-from-a-smaller-positive-number": [
    skill(
      "the-number-taken-away",
      ["The number taken away", "减去的数"],
      [
        "To land below zero, a subtraction first takes away the whole starting number and then keeps going. So the number taken away is the start plus the distance below zero.",
        "要减到零以下，先减掉整个起始数，再继续减。所以减去的数等于起始数加上零以下的距离。",
      ],
      (rng) => {
        const a = rng.int(2, 60);
        const b = rng.int(2, 60);
        return whole(
          [`Fill in the box: $$${a} - \\square = -${b}$$`, `填方框：$$${a} - \\square = -${b}$$`],
          a + b,
          [Math.abs(a - b) === a + b ? a + b + 1 : Math.abs(a - b), b, a],
          [`Go ${a} down to zero and ${b} further: $${a} + ${b} = ${a + b}$.`, `先减 ${a} 到零，再减 ${b}：$${a} + ${b} = ${a + b}$。`],
        );
      },
    ),
  ],
  "subtracting-a-positive-fraction-from-a-smaller-fraction": [
    skill(
      "the-fraction-taken-away",
      ["The fraction taken away", "减去的分数"],
      [
        "The fraction taken away must cover the starting fraction and the distance below zero. With a common denominator, this is a sum of the two numerators over that denominator.",
        "减去的分数要覆盖起始分数和零以下的距离。通分后，就是两个分子的和除以公分母。",
      ],
      (rng) => {
        const d = rng.int(3, 15);
        const a = rng.int(1, d - 1);
        const b = rng.int(1, d - 1);
        return fraction(
          [`Fill in the box: $$${frac(a, d)} - \\square = -${frac(b, d)}$$`, `填方框：$$${frac(a, d)} - \\square = -${frac(b, d)}$$`],
          Q.of(a + b, d),
          [Q.of(a - b, d), Q.of(b - a, d), Q.of(a + b, 2 * d)],
          [
            `Add the distances from zero: $${frac(a, d)} + ${frac(b, d)} = ${frac(a + b, d)}$.`,
            `把到零的距离相加：$${frac(a, d)} + ${frac(b, d)} = ${frac(a + b, d)}$。`,
          ],
        );
      },
    ),
  ],
  "subtracting-a-positive-decimal-from-a-smaller-decimal": [
    skill(
      "climbing-back-from-below-zero",
      ["Climbing back from below zero", "从零以下回升"],
      [
        "A value below zero must first climb back to zero before it can reach a positive target. So the amount needed is the distance below zero plus the target.",
        "零以下的值要先回到零，才能达到正的目标。所以需要的量是零以下的距离加上目标。",
      ],
      (rng) => {
        const have = rng.int(11, 99);
        const spend = have + rng.int(5, 90);
        const target = rng.int(5, 50);
        const need = spend - have + target;
        return decimal(
          [
            `An account has ${tenths(have)} dollars and ${tenths(spend)} dollars are spent. How many dollars must then be paid in for the balance to reach ${tenths(target)} dollars?`,
            `一个账户有 ${tenths(have)} 美元，花掉 ${tenths(spend)} 美元。之后要存入多少美元，余额才能达到 ${tenths(target)} 美元？`,
          ],
          Q.of(need, 10),
          [Q.of(spend - have, 10), Q.of(Math.abs(spend - have - target), 10), Q.of(spend + target, 10)],
          [
            `The balance is $-${tenths(spend - have)}$, and $${tenths(spend - have)} + ${tenths(target)} = ${tenths(need)}$.`,
            `余额是 $-${tenths(spend - have)}$，$${tenths(spend - have)} + ${tenths(target)} = ${tenths(need)}$。`,
          ],
        );
      },
    ),
  ],
  "adding-a-positive-number-to-a-negative-number": [
    skill(
      "the-number-added-to-a-negative",
      ["The number added to a negative", "加到负数上的数"],
      [
        "The number added to a negative start is the distance moved to the right. So it equals the end minus the start, and subtracting a negative start makes this larger.",
        "加到负数上的数，是向右移动的距离。所以它等于终点减起点，减去负的起点会使结果变大。",
      ],
      (rng) => {
        const a = rng.int(3, 60);
        const b = rng.int(2, 60);
        const end = rng.bool() ? b : -rng.int(1, a - 1);
        const answer = end + a;
        return whole(
          [`Fill in the box: $$-${a} + \\square = ${end}$$`, `填方框：$$-${a} + \\square = ${end}$$`],
          answer,
          [Math.abs(end - a), a, Math.abs(end)],
          [`$\\square = ${end} - (-${a}) = ${answer}$.`, `$\\square = ${end} - (-${a}) = ${answer}$。`],
        );
      },
    ),
  ],
  "interpreting-additive-opposites-and-addition-using-absolute-value": [
    skill(
      "from-a-number-to-its-opposite",
      ["From a number to its opposite", "从一个数到它的相反数"],
      [
        "A number and its opposite are the same distance from zero, on either side. So getting from one to the other means crossing that distance twice, once to zero and once beyond it.",
        "一个数和它的相反数到零的距离相同，分在两侧。所以从一个到另一个要走两倍的距离：一次到零，一次过零。",
      ],
      (rng) => {
        const a = rng.int(2, 80);
        const neg = rng.bool();
        const start = neg ? -a : a;
        return integer(
          [`What number must be added to $${start}$ to get its opposite?`, `$${start}$ 加上什么数得到它的相反数？`],
          -2 * start,
          [-start, 2 * start, 0],
          [
            `The opposite is $${-start}$, and $${-start} - (${start}) = ${-2 * start}$.`,
            `相反数是 $${-start}$，$${-start} - (${start}) = ${-2 * start}$。`,
          ],
        );
      },
    ),
  ],
  "multiplying-positive-numbers-with-negative-numbers": [
    skill(
      "the-missing-factor-with-a-sign",
      ["The missing factor with a sign", "带符号的缺失因数"],
      [
        "A positive times a negative gives a negative. So when one factor is positive and the product is negative, the missing factor must be negative, and its size comes from dividing the sizes.",
        "正数乘负数得负数。所以一个因数为正、积为负时，缺失的因数一定是负数，大小由两数大小相除得到。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = rng.int(2, 15);
        return integer(
          [`Fill in the box: $$${a} \\times \\square = -${a * b}$$`, `填方框：$$${a} \\times \\square = -${a * b}$$`],
          -b,
          [b, -a * b + a, a - b === -b ? -b - 1 : a - b],
          [
            `The product is negative and ${a} is positive, so the factor is negative: $-${a * b} \\div ${a} = -${b}$.`,
            `积为负，${a} 为正，所以这个因数为负：$-${a * b} \\div ${a} = -${b}$。`,
          ],
        );
      },
    ),
  ],
  "equivalent-fractions-with-negative-numbers": [
    skill(
      "the-one-with-the-other-sign",
      ["The one with the other sign", "符号不同的那个"],
      [
        "A fraction with exactly one negative sign is negative, wherever that sign is written. Two negative signs cancel, so a fraction with both signs is positive and has a different value.",
        "只有一个负号的分数是负数，不管负号写在哪里。两个负号相互抵消，所以有两个负号的分数是正数，值不同。",
      ],
      (rng) => {
        const b = rng.int(3, 25);
        let a = rng.int(1, b - 1);
        if (gcd(a, b) !== 1) a = 1;
        return chooseMath(
          rng,
          [`Which of these is not equal to $-${frac(a, b)}$?`, `哪个不等于 $-${frac(a, b)}$？`],
          frac(-a, -b),
          [frac(-a, b), frac(a, -b), `-${frac(2 * a, 2 * b)}`],
          [
            `$${frac(-a, -b)}$ has two negative signs, which cancel, so it is positive.`,
            `$${frac(-a, -b)}$ 有两个负号，相互抵消，所以是正数。`,
          ],
        );
      },
    ),
  ],
  "dividing-with-negative-decimals-and-fractions": [
    skill(
      "the-number-before-a-signed-division",
      ["The number before a signed division", "带符号除法的被除数"],
      [
        "A division is undone by multiplying the quotient by the divisor, and the sign rules still hold. Two negatives give a positive number, and one negative gives a negative number.",
        "除法可以用商乘除数还原，符号规则仍然适用。两个负数得正数，一个负数得负数。",
      ],
      (rng) => {
        const d = rng.int(2, 19);
        const q = rng.int(2, 19);
        const negD = rng.bool();
        const negQ = rng.bool();
        const dd = negD ? -d : d;
        const qq = negQ ? -q : q;
        const show = (n: number) => (n < 0 ? `\\left(-${tenths(-n)}\\right)` : tenths(n));
        const answer = Q.of(dd * qq, 100);
        return decimal(
          [
            `Fill in the box: $$\\square \\div ${show(dd)} = ${negQ ? "-" : ""}${tenths(q)}$$`,
            `填方框：$$\\square \\div ${show(dd)} = ${negQ ? "-" : ""}${tenths(q)}$$`,
          ],
          answer,
          [Q.of(-dd * qq, 100), Q.of(dd * qq, 10), Q.of(dd + qq, 10)],
          [`Multiply the quotient by the divisor: the result is $${(dd * qq) / 100}$.`, `商乘除数：结果是 $${(dd * qq) / 100}$。`],
        );
      },
    ),
  ],
  "reciprocals-of-rational-numbers": [
    skill(
      "the-multiplier-that-replaces-a-division",
      ["The multiplier that replaces a division", "替代除法的乘数"],
      [
        "Dividing by a number is the same as multiplying by its reciprocal, and a reciprocal keeps the sign of the number. Changing the sign as well is a common slip.",
        "除以一个数等于乘它的倒数，而倒数与原数同号。把符号也改变是常见错误。",
      ],
      (rng) => {
        const b = rng.int(2, 15);
        let a = rng.int(2, 15);
        if (a === b) a += 1;
        const n = rng.int(2, 30);
        return fraction(
          [
            `Fill in the box with a fraction: $$${n} \\div \\left(-${frac(a, b)}\\right) = ${n} \\times \\square$$`,
            `在方框中填一个分数：$$${n} \\div \\left(-${frac(a, b)}\\right) = ${n} \\times \\square$$`,
          ],
          Q.of(-b, a),
          [Q.of(b, a), Q.of(a, b), Q.of(-a, b)],
          [
            `The reciprocal of $-${frac(a, b)}$ is $-${frac(b, a)}$, with the same sign.`,
            `$-${frac(a, b)}$ 的倒数是 $-${frac(b, a)}$，符号相同。`,
          ],
        );
      },
    ),
  ],
  "divisibility-of-integers-by-2-5-10-4-and-8": [
    skill(
      "the-missing-digit-for-divisibility-by-4",
      ["The missing digit for divisibility by 4", "能被 4 整除时缺少的数字"],
      [
        "Only the last two digits decide whether a number divides by 4, since every multiple of 100 does. So try the digits in order until the last two digits form a multiple of 4.",
        "能否被 4 整除只看最后两位，因为 100 的倍数都能被 4 整除。所以依次试数字，直到最后两位是 4 的倍数。",
      ],
      (rng) => {
        const head = rng.int(10, 99);
        const u = rng.pick([0, 2, 4, 6, 8]);
        let d = 0;
        while ((10 * d + u) % 4 !== 0) d += 1;
        return whole(
          [
            `What is the smallest digit that can go in the box so that the number divides by 4? $$${head}\\square${u}$$`,
            `方框里填什么最小的数字，才能使这个数被 4 整除？$$${head}\\square${u}$$`,
          ],
          d,
          [d + 1, d + 2, u],
          [
            `The last two digits must form a multiple of 4, and $${10 * d + u} \\div 4 = ${(10 * d + u) / 4}$.`,
            `最后两位必须是 4 的倍数，$${10 * d + u} \\div 4 = ${(10 * d + u) / 4}$。`,
          ],
        );
      },
    ),
  ],
  "prime-factors": [
    skill(
      "the-number-from-its-prime-factors",
      ["The number from its prime factors", "由质因数还原这个数"],
      [
        "A prime factorization names exactly one number, so multiplying the powers together recovers it. Each exponent says how many times its prime is used, and it is not a multiplier.",
        "质因数分解对应唯一的数，所以把各个幂相乘就能还原。指数表示质数用了几次，不是乘数。",
      ],
      (rng) => {
        const a = rng.int(1, 5);
        const b = rng.int(0, 3);
        const c = rng.int(1, 2);
        const q = rng.pick([5, 7, 11]);
        const n = 2 ** a * 3 ** b * q ** c;
        const parts = [`2^{${a}}`, ...(b > 0 ? [`3^{${b}}`] : []), `${q}^{${c}}`];
        return whole(
          [`What number has the prime factorization $${parts.join(" \\cdot ")}$?`, `质因数分解为 $${parts.join(" \\cdot ")}$ 的数是多少？`],
          n,
          [2 * a * (b > 0 ? 3 * b : 1) * q * c, 2 ** a + 3 ** b + q ** c, n * 2],
          [`Multiply the powers: the result is ${n}.`, `把各个幂相乘：结果是 ${n}。`],
        );
      },
    ),
  ],
  "cubing-rational-numbers": [
    skill(
      "the-greatest-of-the-powers",
      ["The greatest of the powers", "几个幂中最大的"],
      [
        "Between 0 and 1, higher powers get smaller, so a number is greater than its square and cube. Between $-1$ and 0, odd powers stay negative, so the square is the greatest.",
        "在 0 和 1 之间，幂越高越小，所以这个数大于它的平方和立方。在 $-1$ 和 0 之间，奇次幂仍为负数，所以平方最大。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const n = rng.int(1, d - 1);
        const neg = rng.bool();
        const x = `${neg ? "-" : ""}${frac(n, d)}`;
        return chooseMath(
          rng,
          [`Let $x = ${x}$. Which value is the greatest?`, `设 $x = ${x}$。哪个值最大？`],
          neg ? "x^{2}" : "x",
          neg ? ["x", "x^{3}", "x^{4}"] : ["x^{2}", "x^{3}", "x^{4}"],
          neg
            ? [
                `$x$ and $x^{3}$ are negative, and $x^{2}$ is greater than $x^{4}$ because the size of $x$ is below 1.`,
                `$x$ 和 $x^{3}$ 是负数；$x$ 的大小小于 1，所以 $x^{2}$ 大于 $x^{4}$。`,
              ]
            : [
                `$x$ is between 0 and 1, so each higher power is smaller, leaving $x$ the greatest.`,
                `$x$ 在 0 和 1 之间，幂越高越小，所以 $x$ 最大。`,
              ],
        );
      },
    ),
  ],
  "powers-of-negative-one": [
    skill(
      "a-long-sum-of-powers",
      ["A long sum of powers", "一长串幂的和"],
      [
        "Consecutive powers of $-1$ alternate, so each odd power and the next even power cancel. A sum with an even number of terms is 0, and with an odd number of terms it is $-1$.",
        "$-1$ 的连续幂交替出现，所以一个奇次幂和下一个偶次幂相互抵消。偶数项之和是 0，奇数项之和是 $-1$。",
      ],
      (rng) => {
        const n = rng.int(5, 120);
        const answer = n % 2 === 0 ? 0 : -1;
        return integer(
          [
            `Evaluate $(-1)^{1} + (-1)^{2} + (-1)^{3} + \\cdots + (-1)^{${n}}$.`,
            `计算 $(-1)^{1} + (-1)^{2} + (-1)^{3} + \\cdots + (-1)^{${n}}$。`,
          ],
          answer,
          [n, -n, 1],
          [
            `The terms cancel in pairs, and ${n} terms leave ${n % 2 === 0 ? "nothing over, so the sum is 0" : "one $-1$ over"}.`,
            `各项两两抵消，${n} 项${n % 2 === 0 ? "没有剩余，所以和是 0" : "剩下一个 $-1$"}。`,
          ],
        );
      },
    ),
  ],
  "the-quotient-rule-for-exponents": [
    skill(
      "the-missing-exponent-in-a-quotient",
      ["The missing exponent in a quotient", "商中缺失的指数"],
      [
        "A quotient of powers subtracts the exponents, so a missing exponent in the denominator is the top exponent minus the result. A negative result only means the denominator had the larger power.",
        "幂的商是指数相减，所以分母中缺失的指数等于分子指数减结果。结果为负，只说明分母的幂更大。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const c = rng.int(-9, 12);
        const v = rng.pick(["x", "y", "a", "t"]);
        return integer(
          [
            `What number goes in the box? $$${frac(`${v}^{${a}}`, `${v}^{\\square}`)} = ${v}^{${c}}$$`,
            `方框里是什么数？$$${frac(`${v}^{${a}}`, `${v}^{\\square}`)} = ${v}^{${c}}$$`,
          ],
          a - c,
          [a + c, c - a, a],
          [
            `$${a} - \\square = ${c}$, so the exponent is found by $${a} - (${c})$.`,
            `$${a} - \\square = ${c}$，所以指数是 $${a} - (${c})$。`,
          ],
        );
      },
    ),
  ],
  "the-power-of-product-rule-for-exponents": [
    skill(
      "the-exponent-inside-the-parentheses",
      ["The exponent inside the parentheses", "括号内的指数"],
      [
        "Raising a product to a power applies that power to every factor. So a missing exponent inside is the outer result divided by the outer power, while the coefficient is raised to it.",
        "积的乘方要把每个因数都乘方。所以括号内缺失的指数等于结果的指数除以外面的指数，而系数要乘方。",
      ],
      (rng) => {
        const k = rng.int(2, 5);
        const a = rng.int(2, 8);
        const n = rng.int(2, 4);
        return whole(
          [
            `What number goes in the box? $$(${k}x^{\\square})^{${n}} = ${k ** n}x^{${a * n}}$$`,
            `方框里是什么数？$$(${k}x^{\\square})^{${n}} = ${k ** n}x^{${a * n}}$$`,
          ],
          a,
          [a * n - n, a * n, a + n],
          [`$\\square \\times ${n} = ${a * n}$, so the exponent is ${a}.`, `$\\square \\times ${n} = ${a * n}$，所以指数是 ${a}。`],
        );
      },
    ),
  ],
  "the-power-of-quotient-rule-for-exponents": [
    skill(
      "a-negative-power-turns-the-fraction-over",
      ["A negative power turns the fraction over", "负指数把分数颠倒"],
      [
        "A negative exponent means the reciprocal, so a fraction to a negative power is the turned-over fraction to the positive power. The result is not negative because of the exponent's sign.",
        "负指数表示倒数，所以分数的负次幂等于颠倒后的分数的正次幂。结果并不因指数为负而成为负数。",
      ],
      (rng) => {
        const [a, b] = rng.pick<[number, number]>([
          [2, 3],
          [3, 4],
          [2, 5],
          [3, 5],
          [4, 5],
          [1, 2],
          [1, 3],
          [5, 6],
          [3, 7],
          [2, 7],
          [5, 7],
          [1, 4],
          [3, 8],
          [5, 8],
          [4, 7],
        ]);
        const n = rng.int(1, 3) === 3 ? 3 : 2;
        return fraction(
          [`Evaluate $\\left(${frac(a, b)}\\right)^{-${n}}$.`, `计算 $\\left(${frac(a, b)}\\right)^{-${n}}$。`],
          Q.of(b ** n, a ** n),
          [Q.of(a ** n, b ** n), Q.of(-(a ** n), b ** n), Q.of(b * n, a * n)],
          [
            `Turn the fraction over: $\\left(${frac(b, a)}\\right)^{${n}} = ${frac(b ** n, a ** n)}$.`,
            `把分数颠倒：$\\left(${frac(b, a)}\\right)^{${n}} = ${frac(b ** n, a ** n)}$。`,
          ],
        );
      },
    ),
  ],
  "combining-the-rules-of-exponents": [
    skill(
      "the-power-that-does-not-match",
      ["The power that does not match", "不相等的幂"],
      [
        "Multiplying powers adds exponents and raising a power to a power multiplies them. Mixing these two rules up is the usual slip, so check which operation each form really has.",
        "幂相乘是指数相加，幂的乘方是指数相乘。把这两条规则混淆是常见错误，所以要看清每个式子是哪种运算。",
      ],
      (rng) => {
        const [p, q] = rng.pick<[number, number]>([
          [2, 3],
          [2, 4],
          [2, 5],
          [3, 4],
          [2, 6],
          [3, 5],
          [2, 7],
          [3, 6],
          [4, 5],
          [3, 7],
        ]);
        const n = p * q;
        const k = rng.int(2, 9);
        const r = rng.int(2, n - 2);
        const v = rng.pick(["x", "y", "a", "m"]);
        return chooseMath(
          rng,
          [`Which of these is not equal to $${v}^{${n}}$?`, `哪个不等于 $${v}^{${n}}$？`],
          `${v}^{${p}} \\cdot ${v}^{${q}}`,
          [`(${v}^{${p}})^{${q}}`, `${v}^{${r}} \\cdot ${v}^{${n - r}}`, frac(`${v}^{${n + k}}`, `${v}^{${k}}`)],
          [
            `$${v}^{${p}} \\cdot ${v}^{${q}} = ${v}^{${p + q}}$, since multiplying adds the exponents.`,
            `$${v}^{${p}} \\cdot ${v}^{${q}} = ${v}^{${p + q}}$，因为相乘是指数相加。`,
          ],
        );
      },
    ),
  ],
  "converting-scientific-notation-to-standard-notation": [
    skill(
      "zeros-at-the-end",
      ["Zeros at the end", "末尾的零"],
      [
        "The power of ten counts the places the point moves, and some of those places are filled by the digits already after the point. Only the places left over become zeros.",
        "10 的指数表示小数点移动的位数，其中一些位由小数点后已有的数字占据。只有剩下的位才变成零。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const two = rng.bool();
        const c = rng.int(1, 9);
        const n = rng.int(4, 12);
        const text = two ? `${a}.${b}${c}` : `${a}.${b}`;
        const zeros = n - (two ? 2 : 1);
        return whole(
          [
            `How many zeros does $${text} \\times 10^{${n}}$ end with when written in standard notation?`,
            `$${text} \\times 10^{${n}}$ 写成普通形式后，末尾有几个零？`,
          ],
          zeros,
          [n, n + 1, zeros - 1],
          [
            `The point moves ${n} places and ${two ? 2 : 1} of them are taken by digits, leaving ${zeros} zeros.`,
            `小数点移动 ${n} 位，其中 ${two ? 2 : 1} 位由数字占据，剩下 ${zeros} 个零。`,
          ],
        );
      },
    ),
  ],
  "comparing-numbers-in-scientific-notation": [
    skill(
      "the-greatest-of-four-in-scientific-notation",
      ["The greatest of four", "四个数中最大的"],
      [
        "In scientific notation, the power of ten decides first, and the leading number decides only between equal powers. This holds for negative powers too, where a power closer to zero is greater.",
        "科学记数法中先看 10 的指数，指数相同时才比较前面的数。负指数也是如此，离零更近的指数更大。",
      ],
      (rng) => {
        const n = rng.int(-9, 9);
        const big = rng.int(2, 9);
        const low = () => rng.int(11, 99);
        return chooseMath(
          rng,
          ["Which number is the greatest?", "哪个数最大？"],
          `${big}.${rng.int(1, 9)} \\times 10^{${n}}`,
          [`${tenths(low())} \\times 10^{${n - 1}}`, `${tenths(low())} \\times 10^{${n - 2}}`, `1.${rng.int(1, 9)} \\times 10^{${n}}`],
          [
            `The greatest power of ten is $10^{${n}}$, and between the two numbers with it, the one with the larger leading number wins.`,
            `最大的指数是 $10^{${n}}$；有这个指数的两个数中，前面的数大的更大。`,
          ],
        );
      },
    ),
  ],
  "addition-and-subtraction-in-scientific-notation": [
    skill(
      "a-difference-below-one",
      ["A difference below 1", "差小于 1"],
      [
        "When a difference of the leading numbers falls below 1, the answer is not yet in scientific notation. Multiply the leading number by ten and lower the power of ten by one.",
        "前面的数之差小于 1 时，结果还不是科学记数法。把前面的数乘 10，同时把 10 的指数减 1。",
      ],
      (rng) => {
        const d = rng.int(1, 9);
        const a = rng.int(11, 80);
        const n = rng.int(3, 15);
        return chooseMath(
          rng,
          [
            `Find $${tenths(a + d)} \\times 10^{${n}} - ${tenths(a)} \\times 10^{${n}}$ in scientific notation.`,
            `用科学记数法表示 $${tenths(a + d)} \\times 10^{${n}} - ${tenths(a)} \\times 10^{${n}}$。`,
          ],
          `${d} \\times 10^{${n - 1}}`,
          [`${d} \\times 10^{${n}}`, `0.${d} \\times 10^{${n}}`, `${d} \\times 10^{${n + 1}}`],
          [
            `The difference is $0.${d} \\times 10^{${n}}$, and moving to a leading number of at least 1 gives $${d} \\times 10^{${n - 1}}$.`,
            `差是 $0.${d} \\times 10^{${n}}$，把前面的数变成至少为 1，得 $${d} \\times 10^{${n - 1}}$。`,
          ],
        );
      },
    ),
  ],
  "addition-in-scientific-notation-with-different-powers-of-ten": [
    skill(
      "matching-the-powers-first",
      ["Matching the powers first", "先统一指数"],
      [
        "Numbers can be added only when their powers of ten match. Raising the power by one means making the leading number ten times smaller, so the value stays the same.",
        "10 的指数相同时才能相加。指数加 1 时，前面的数要缩小为十分之一，这样值不变。",
      ],
      (rng) => {
        const a = rng.int(11, 99);
        const n = rng.int(2, 15);
        return decimal(
          [
            `What number goes in the box? $$${tenths(a)} \\times 10^{${n}} = \\square \\times 10^{${n + 1}}$$`,
            `方框里是什么数？$$${tenths(a)} \\times 10^{${n}} = \\square \\times 10^{${n + 1}}$$`,
          ],
          Q.of(a, 100),
          [Q.of(a, 1), Q.of(a, 10), Q.of(a, 1000)],
          [
            `A power one higher needs a leading number ten times smaller: $${(a / 100).toFixed(2)}$.`,
            `指数大 1，前面的数要缩小为十分之一：$${(a / 100).toFixed(2)}$。`,
          ],
        );
      },
    ),
  ],
  "subtraction-in-scientific-notation-with-different-powers-of-ten": [
    skill(
      "when-the-smaller-hardly-matters",
      ["When the smaller hardly matters", "小数几乎不起作用时"],
      [
        "When two powers of ten are far apart, the smaller number barely changes the larger one. So the difference is very close to the larger number, which is a quick way to check an answer.",
        "两个指数相差很大时，小数几乎不改变大数。所以差非常接近大数，可以用来快速检验答案。",
      ],
      (rng) => {
        const a = rng.int(11, 99);
        let b = rng.int(11, 99);
        if (b === a) b = a === 99 ? 98 : a + 1;
        const n = rng.int(4, 12);
        const gap = rng.int(6, 9);
        return chooseMath(
          rng,
          [
            `Which is closest to $${tenths(a)} \\times 10^{${n}} - ${tenths(b)} \\times 10^{${n - gap}}$?`,
            `哪个最接近 $${tenths(a)} \\times 10^{${n}} - ${tenths(b)} \\times 10^{${n - gap}}$？`,
          ],
          `${tenths(a)} \\times 10^{${n}}`,
          [`${tenths(a)} \\times 10^{${n - gap}}`, `${tenths(b)} \\times 10^{${n}}`, `${tenths(a)} \\times 10^{${n - 1}}`],
          [
            `The second number is about $10^{${gap}}$ times smaller, so taking it away changes almost nothing.`,
            `第二个数大约小 $10^{${gap}}$ 倍，减去它几乎没有变化。`,
          ],
        );
      },
    ),
  ],
  "further-addition-in-scientific-notation-with-different-powers-of-ten": [
    skill(
      "a-sum-as-a-decimal",
      ["A sum as a decimal", "和写成小数"],
      [
        "Negative powers of ten name decimal places, so they can be read directly into a decimal. Each number fills its own place, and the sum can be written down digit by digit.",
        "10 的负指数对应小数位，可以直接读成小数。每个数占自己的数位，和可以逐位写出。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const n = rng.int(1, 3);
        const answer = Q.of(a * 10 + b, 10 ** (n + 1));
        return decimal(
          [
            `Write $${a} \\times 10^{-${n}} + ${b} \\times 10^{-${n + 1}}$ as a decimal.`,
            `把 $${a} \\times 10^{-${n}} + ${b} \\times 10^{-${n + 1}}$ 写成小数。`,
          ],
          answer,
          [Q.of(a + b, 10 ** n), Q.of(a + b, 10 ** (n + 1)), Q.of(a * 10 + b, 10 ** n)],
          [
            `The digit ${a} goes in place ${n} after the point and ${b} in the place after it: $${((a * 10 + b) / 10 ** (n + 1)).toFixed(n + 1)}$.`,
            `数字 ${a} 在小数点后第 ${n} 位，${b} 在下一位：$${((a * 10 + b) / 10 ** (n + 1)).toFixed(n + 1)}$。`,
          ],
        );
      },
    ),
  ],
  "multiplying-numbers-in-scientific-notation": [
    skill(
      "the-power-after-tidying-the-product",
      ["The power after tidying the product", "整理积后的指数"],
      [
        "Multiplying adds the powers of ten, but the product of the leading numbers may reach 10. Then it must be tidied, which raises the power of ten by one more.",
        "相乘时指数相加，但前面的数之积可能达到 10。这时要整理，指数还要再加 1。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(Math.ceil(10 / a), 9);
        const m = rng.int(-9, 12);
        const n = rng.int(2, 12);
        const power = m + n + 1;
        return integer(
          [
            `In scientific notation, $(${a} \\times 10^{${m}})(${b} \\times 10^{${n}}) = c \\times 10^{k}$ with $c$ between 1 and 10. What is $k$?`,
            `用科学记数法表示，$(${a} \\times 10^{${m}})(${b} \\times 10^{${n}}) = c \\times 10^{k}$，其中 $c$ 在 1 和 10 之间。$k$ 是多少？`,
          ],
          power,
          [m + n, m * n, m + n + 2],
          [
            `$${a} \\times ${b} = ${a * b}$ needs tidying, so $k = ${m} + ${n} + 1 = ${power}$.`,
            `$${a} \\times ${b} = ${a * b}$ 需要整理，所以 $k = ${m} + ${n} + 1 = ${power}$。`,
          ],
        );
      },
    ),
  ],
  "evaluating-rational-number-expressions-without-exponents": [
    skill(
      "where-the-parentheses-go",
      ["Where the parentheses go", "括号放在哪里"],
      [
        "Without parentheses, multiplication comes before addition. Parentheses can change that order and the value, so the same numbers and signs may give several different results.",
        "没有括号时，先乘后加。括号可以改变顺序，也改变结果，所以相同的数和符号可能得到不同的值。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = a + rng.int(1, 9);
        const c = rng.int(2, 9);
        const value = (b - a) * c;
        return chooseMath(
          rng,
          [`Which expression equals ${value}?`, `哪个表达式等于 ${value}？`],
          `(-${a} + ${b}) \\times ${c}`,
          [`-${a} + (${b} \\times ${c})`, `-(${a} + ${b} \\times ${c})`, `-(${a} + ${b}) \\times ${c}`],
          [
            `$-${a} + ${b} = ${b - a}$, and $${b - a} \\times ${c} = ${value}$.`,
            `$-${a} + ${b} = ${b - a}$，$${b - a} \\times ${c} = ${value}$。`,
          ],
        );
      },
    ),
  ],
  "evaluating-expressions-with-positive-integer-exponents": [
    skill(
      "substituting-a-negative-into-a-square",
      ["Substituting a negative into a square", "把负数代入平方"],
      [
        "In $-x^{2}$ the square comes first and the negative sign after it, so the result is negative even when $x$ is negative. Writing the substituted value in parentheses keeps this clear.",
        "在 $-x^{2}$ 中先平方，再取负，所以即使 $x$ 是负数，结果也是负数。代入时加上括号可以避免出错。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const y = rng.int(1, 30);
        return integer(
          [`Evaluate $-x^{2} + y$ when $x = -${a}$ and $y = ${y}$.`, `当 $x = -${a}$，$y = ${y}$ 时，计算 $-x^{2} + y$。`],
          y - a * a,
          [a * a + y, -a * a - y, y + 2 * a],
          [
            `$(-${a})^{2} = ${a * a}$, so $-${a * a} + ${y} = ${y - a * a}$.`,
            `$(-${a})^{2} = ${a * a}$，所以 $-${a * a} + ${y} = ${y - a * a}$。`,
          ],
        );
      },
    ),
  ],
  "evaluating-expressions-with-integer-exponents": [
    skill(
      "the-negative-exponent-that-fits",
      ["The negative exponent that fits", "符合的负指数"],
      [
        "A fraction with 1 over a power can be written with a negative exponent. So a missing exponent is found by writing the denominator as a power of the base and then changing the sign.",
        "分子为 1、分母为幂的分数可以写成负指数。所以缺失的指数这样求：把分母写成底数的幂，再改变符号。",
      ],
      (rng) => {
        const b = rng.pick([2, 3, 4, 5, 10]);
        const n = rng.int(1, 4);
        const k = rng.int(1, 9);
        const lhs = k === 1 ? "" : `${k} \\cdot `;
        return integer(
          [
            `What number goes in the box? $$${lhs}${b}^{\\square} = ${frac(k, b ** n)}$$`,
            `方框里是什么数？$$${lhs}${b}^{\\square} = ${frac(k, b ** n)}$$`,
          ],
          -n,
          [n, b ** n, -(b ** n)],
          [`$${b ** n} = ${b}^{${n}}$, so its reciprocal is $${b}^{-${n}}$.`, `$${b ** n} = ${b}^{${n}}$，所以它的倒数是 $${b}^{-${n}}$。`],
        );
      },
    ),
  ],
  "the-square-root-of-a-perfect-square": [
    skill(
      "the-root-of-a-sum",
      ["The root of a sum", "和的平方根"],
      [
        "The square root of a sum is not the sum of the square roots. Work out what is under the root first, and only then take the root, as the root sign acts like parentheses.",
        "和的平方根不等于平方根的和。先算出根号下的值，再开方，因为根号的作用类似于括号。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick<[number, number, number]>([
          [3, 4, 5],
          [5, 12, 13],
          [8, 15, 17],
          [7, 24, 25],
          [20, 21, 29],
        ]);
        const k = rng.int(1, 6);
        const p = a * k;
        const q = b * k;
        return whole(
          [`Evaluate $\\sqrt{${p * p} + ${q * q}}$.`, `计算 $\\sqrt{${p * p} + ${q * q}}$。`],
          c * k,
          [p + q, p * q, c * k + 1],
          [
            `$${p * p} + ${q * q} = ${(c * k) ** 2}$, and $\\sqrt{${(c * k) ** 2}} = ${c * k}$.`,
            `$${p * p} + ${q * q} = ${(c * k) ** 2}$，$\\sqrt{${(c * k) ** 2}} = ${c * k}$。`,
          ],
        );
      },
    ),
  ],
  "squaring-a-square-root": [
    skill(
      "the-root-of-a-negative-squared",
      ["The root of a negative squared", "负数平方后的根"],
      [
        "Squaring and then taking the root does not always return the start. The square makes a negative number positive, and the square root sign means the root that is not negative.",
        "先平方再开方不一定回到原数。平方把负数变成正数，而根号表示非负的那个根。",
      ],
      (rng) => {
        const a = rng.int(2, 60);
        return integer(
          [`Evaluate $\\sqrt{(-${a})^{2}}$.`, `计算 $\\sqrt{(-${a})^{2}}$。`],
          a,
          [-a, a * a, -a * a],
          [`$(-${a})^{2} = ${a * a}$, whose square root is ${a}.`, `$(-${a})^{2} = ${a * a}$，它的平方根是 ${a}。`],
        );
      },
    ),
  ],
  "the-cube-root-of-a-perfect-cube": [
    skill(
      "sums-of-cube-roots",
      ["Sums of cube roots", "立方根的和"],
      [
        "A negative number has a negative cube root, because three negative factors multiply to a negative number. So each cube root in a sum carries its own sign.",
        "负数的立方根是负数，因为三个负因数的积是负数。所以和中的每个立方根都带着自己的符号。",
      ],
      (rng) => {
        const a = rng.int(2, 10);
        const b = rng.int(2, 10);
        const k = rng.int(2, 6);
        return integer(
          [`Evaluate $${k}\\sqrt[3]{${b ** 3}} + \\sqrt[3]{-${a ** 3}}$.`, `计算 $${k}\\sqrt[3]{${b ** 3}} + \\sqrt[3]{-${a ** 3}}$。`],
          k * b - a,
          [k * b + a, b - a, k * (b - a)],
          [
            `$\\sqrt[3]{${b ** 3}} = ${b}$ and $\\sqrt[3]{-${a ** 3}} = -${a}$, so $${k * b} - ${a} = ${k * b - a}$.`,
            `$\\sqrt[3]{${b ** 3}} = ${b}$，$\\sqrt[3]{-${a ** 3}} = -${a}$，所以 $${k * b} - ${a} = ${k * b - a}$。`,
          ],
        );
      },
    ),
  ],
  "classifying-rational-and-irrational-numbers": [
    skill(
      "irrationals-that-become-rational",
      ["Irrationals that become rational", "变成有理数的无理数"],
      [
        "Adding or multiplying an irrational number by a nonzero rational keeps it irrational. Squaring a square root removes the root, though, so the result is a rational number.",
        "无理数加上有理数或乘非零有理数，仍是无理数。但平方根再平方就消去了根号，结果是有理数。",
      ],
      (rng) => {
        const n = rng.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23]);
        const k = rng.int(2, 12);
        return chooseMath(
          rng,
          ["Which of these numbers is rational?", "哪个数是有理数？"],
          `(\\sqrt{${n}})^{2} + ${k}`,
          [`\\sqrt{${n}} + ${k}`, `${k}\\sqrt{${n}}`, frac(`\\sqrt{${n}}`, k)],
          [
            `$(\\sqrt{${n}})^{2} = ${n}$, so the sum is ${n + k}. The others still contain $\\sqrt{${n}}$.`,
            `$(\\sqrt{${n}})^{2} = ${n}$，所以和是 ${n + k}。其他的仍含 $\\sqrt{${n}}$。`,
          ],
        );
      },
    ),
  ],
  surds: [
    skill(
      "counting-the-surds",
      ["Counting the surds", "数一数根式"],
      [
        "A surd is a root that cannot be written as a fraction. Roots of perfect squares and perfect cubes are whole numbers in disguise, so simplify each root before counting it.",
        "根式是不能写成分数的根。完全平方数和完全立方数的根其实是整数，所以先化简再计数。",
      ],
      (rng) => {
        const items = Array.from({ length: rng.int(4, 6) }, () => {
          const kind = rng.int(0, 3);
          if (kind === 0) return { latex: `\\sqrt{${rng.int(2, 15) ** 2}}`, surd: false };
          if (kind === 1) return { latex: `\\sqrt[3]{${rng.int(2, 6) ** 3}}`, surd: false };
          if (kind === 2) return { latex: `\\sqrt{${rng.pick([2, 3, 5, 6, 7, 10, 11, 13, 15, 17])}}`, surd: true };
          return { latex: `\\sqrt[3]{${rng.pick([2, 3, 4, 5, 6, 7, 9, 10, 15, 25])}}`, surd: true };
        });
        const count = items.filter((x) => x.surd).length;
        const list = items.map((x) => x.latex).join(",\\quad ");
        return whole(
          [`How many of these are surds? $$${list}$$`, `其中有几个根式（不能化为有理数）？$$${list}$$`],
          count,
          [items.length, items.length - count, count + 1],
          [
            `Roots of perfect squares and cubes are whole numbers, which leaves ${count} ${count === 1 ? "surd" : "surds"}.`,
            `完全平方数和完全立方数的根是整数，剩下 ${count} 个根式。`,
          ],
        );
      },
    ),
  ],
  "the-product-rule-for-radicals": [
    skill(
      "the-missing-number-under-a-root",
      ["The missing number under a root", "根号下缺少的数"],
      [
        "A product of square roots is the root of the product. So if the result is a whole number, its square is the product under the root, and division gives the missing number.",
        "平方根的积等于积的平方根。所以结果是整数时，它的平方就是根号下的积，用除法求缺少的数。",
      ],
      (rng) => {
        const k = rng.pick([2, 3, 5, 6, 7, 10, 11]);
        const m = rng.int(2, 9);
        return whole(
          [
            `What number goes in the box? $$\\sqrt{${k}} \\cdot \\sqrt{\\square} = ${k * m}$$`,
            `方框里是什么数？$$\\sqrt{${k}} \\cdot \\sqrt{\\square} = ${k * m}$$`,
          ],
          k * m * m,
          [m, k * m, m * m],
          [
            `Square both sides: $${k} \\cdot \\square = ${(k * m) ** 2}$, so the box holds ${k * m * m}.`,
            `两边平方：$${k} \\cdot \\square = ${(k * m) ** 2}$，所以方框里是 ${k * m * m}。`,
          ],
        );
      },
    ),
  ],
  "the-quotient-rule-for-radicals": [
    skill(
      "the-missing-number-in-a-quotient-of-roots",
      ["The missing number in a quotient of roots", "根式商中缺少的数"],
      [
        "A quotient of square roots is the root of the quotient. Squaring the result gives that quotient, and multiplying by the number under the lower root gives the number under the upper one.",
        "平方根的商等于商的平方根。把结果平方得到这个商，再乘分母根号下的数，就得到分子根号下的数。",
      ],
      (rng) => {
        const a = rng.pick([2, 3, 5, 6, 7, 10, 11, 13]);
        const b = rng.int(2, 10);
        return whole(
          [
            `What number goes in the box? $$${frac("\\sqrt{\\square}", `\\sqrt{${a}}`)} = ${b}$$`,
            `方框里是什么数？$$${frac("\\sqrt{\\square}", `\\sqrt{${a}}`)} = ${b}$$`,
          ],
          a * b * b,
          [a * b, b * b, a + b * b],
          [
            `Square both sides: the quotient is ${b * b}, and $${a} \\times ${b * b} = ${a * b * b}$.`,
            `两边平方：商是 ${b * b}，$${a} \\times ${b * b} = ${a * b * b}$。`,
          ],
        );
      },
    ),
  ],
  "evaluating-rational-expressions": [
    skill(
      "when-it-has-no-value",
      ["When it has no value", "什么时候没有值"],
      [
        "Division by zero has no meaning, so a rational expression has no value where its denominator is zero. A zero numerator causes no trouble, as it only makes the whole fraction zero.",
        "除以零没有意义，所以分母为零时有理式没有值。分子为零没有问题，只是整个分数为零。",
      ],
      (rng) => {
        const a = rng.int(1, 20);
        const b = rng.int(1, 20);
        const k = rng.int(2, 6);
        const neg = rng.bool();
        const den = neg ? `${k}x + ${k * b}` : `${k}x - ${k * b}`;
        const answer = neg ? -b : b;
        return integer(
          [`For what value of $x$ does $${frac(`x + ${a}`, den)}$ have no value?`, `$x$ 为何值时，$${frac(`x + ${a}`, den)}$ 没有值？`],
          answer,
          [-answer, -a, k * b],
          [`The denominator is zero when $${den} = 0$, which gives $x = ${answer}$.`, `当 $${den} = 0$ 时分母为零，得 $x = ${answer}$。`],
        );
      },
    ),
  ],
  "the-distributive-law-with-three-terms": [
    skill(
      "a-missing-coefficient-with-three-terms",
      ["A missing coefficient with three terms", "三项中缺失的系数"],
      [
        "The outside factor multiplies all three terms and carries its sign into each of them. So dividing a term of the expansion by the factor gives the term inside, with the correct sign.",
        "外面的因数要乘三项，并把符号带进每一项。所以用展开式中的项除以这个因数，就得到括号内带正确符号的项。",
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const neg = rng.bool();
        const f = neg ? -k : k;
        return integer(
          [
            `Fill in the box: $$${f}(${a}x + \\square y + ${c}) = ${f * a}x${signed(f * b)}y${signed(f * c)}$$`,
            `填方框：$$${f}(${a}x + \\square y + ${c}) = ${f * a}x${signed(f * b)}y${signed(f * c)}$$`,
          ],
          b,
          [-b, f * b, b + k],
          [`$${f} \\times \\square = ${f * b}$, so the box holds ${b}.`, `$${f} \\times \\square = ${f * b}$，所以方框里是 ${b}。`],
        );
      },
    ),
  ],
  "distributing-the-negative-sign-in-a-linear-expression": [
    skill(
      "subtracting-a-difference",
      ["Subtracting a difference", "减去一个差"],
      [
        "A minus sign before parentheses changes the sign of every term inside. So subtracting a difference turns the term being taken away into a term that is added.",
        "括号前的负号要改变括号内每一项的符号。所以减去一个差时，原来被减去的项变成加上。",
      ],
      (rng) => {
        const p = rng.int(2, 30);
        let q = rng.int(2, 30);
        if (q === p) q += 1;
        const v = rng.pick(["x", "y", "m", "t"]);
        return chooseMath(
          rng,
          [`Simplify $${p} - (${q} - ${v})$.`, `化简 $${p} - (${q} - ${v})$。`],
          `${v}${signed(p - q)}`,
          [`-${v}${signed(p - q)}`, `${v}${signed(p + q)}`, `-${v}${signed(p + q)}`],
          [
            `Removing the parentheses gives $${p} - ${q} + ${v}$, which is $${v}${signed(p - q)}$.`,
            `去括号得 $${p} - ${q} + ${v}$，即 $${v}${signed(p - q)}$。`,
          ],
        );
      },
    ),
  ],
  "simplifying-linear-expressions-using-the-distributive-law": [
    skill(
      "subtracting-a-group",
      ["Subtracting a group", "减去一组"],
      [
        "When a group is subtracted, the factor in front is negative and it multiplies each term. A negative times a negative inside the group gives a positive term in the result.",
        "减去一组时，前面的因数是负的，要乘每一项。负数乘括号内的负项，结果得正。",
      ],
      (rng) => {
        const c = rng.int(2, 9);
        const a = c + rng.int(2, 8);
        const b = rng.int(1, 9);
        const d = rng.int(1, 9);
        return chooseMath(
          rng,
          [`Simplify $${a}(x + ${b}) - ${c}(x - ${d})$.`, `化简 $${a}(x + ${b}) - ${c}(x - ${d})$。`],
          `${a - c}x + ${a * b + c * d}`,
          [
            `${a - c}x${signed(a * b - c * d - (a * b - c * d === a * b + c * d ? 1 : 0))}`,
            `${a + c}x + ${a * b + c * d}`,
            `${a - c}x + ${a * b + d}`,
          ],
          [
            `$${a}x + ${a * b} - ${c}x + ${c * d} = ${a - c}x + ${a * b + c * d}$.`,
            `$${a}x + ${a * b} - ${c}x + ${c * d} = ${a - c}x + ${a * b + c * d}$。`,
          ],
        );
      },
    ),
  ],
  "simplifying-linear-expressions-containing-fractions": [
    skill(
      "two-fractions-of-the-variable",
      ["Two fractions of the variable", "变量的两个分数"],
      [
        "A term such as $x$ over a number has a fractional coefficient, and combining two such terms means adding fractions. So it needs a common denominator, and the denominators are not added.",
        "$x$ 除以一个数的项有分数系数，合并这样的两项就是分数相加。所以要通分，而不是把分母相加。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        let b = rng.int(2, 12);
        if (b === a) b += 1;
        return fraction(
          [
            `Simplify $${frac("x", a)} + ${frac("x", b)}$ to a single term. What is the coefficient of $x$?`,
            `把 $${frac("x", a)} + ${frac("x", b)}$ 化成一项。$x$ 的系数是多少？`,
          ],
          Q.of(a + b, a * b),
          [Q.of(2, a + b), Q.of(1, a + b), Q.of(2, a * b)],
          [
            `$${frac(1, a)} + ${frac(1, b)} = ${frac(b, a * b)} + ${frac(a, a * b)} = ${frac(a + b, a * b)}$.`,
            `$${frac(1, a)} + ${frac(1, b)} = ${frac(b, a * b)} + ${frac(a, a * b)} = ${frac(a + b, a * b)}$。`,
          ],
        );
      },
    ),
  ],
  "factoring-numerical-expressions": [
    skill(
      "factoring-three-numbers",
      ["Factoring three numbers", "提取三个数的公因数"],
      [
        "The greatest common factor must divide all three numbers, and each number then leaves its own quotient in the parentheses. Multiplying back is a quick check of the result.",
        "最大公因数必须能整除三个数，每个数留下自己的商在括号里。乘回去可以快速检验结果。",
      ],
      (rng) => {
        const g = rng.int(2, 12);
        const [a, b, c] = rng.pick<[number, number, number]>([
          [2, 3, 5],
          [3, 4, 5],
          [2, 5, 7],
          [3, 5, 7],
          [4, 5, 7],
          [2, 3, 7],
          [5, 6, 7],
          [3, 7, 8],
          [2, 7, 9],
          [4, 7, 9],
        ]);
        return whole(
          [
            `Fill in the box, where ${g} is the greatest common factor: $$${g * a} + ${g * b} + ${g * c} = ${g}(${a} + ${b} + \\square)$$`,
            `填方框，其中 ${g} 是最大公因数：$$${g * a} + ${g * b} + ${g * c} = ${g}(${a} + ${b} + \\square)$$`,
          ],
          c,
          [g * c, g * c - g, c + g],
          [
            `Each term inside is the term divided by the factor, so $${g * c} \\div ${g} = ${c}$.`,
            `括号内每一项等于原项除以公因数，所以 $${g * c} \\div ${g} = ${c}$。`,
          ],
        );
      },
    ),
  ],
  "solving-linear-equations-by-trial-and-error": [
    skill(
      "trapping-the-solution-between-whole-numbers",
      ["Trapping the solution", "把解夹在整数之间"],
      [
        "A solution need not be a whole number. When one trial gives too little and the next whole number gives too much, the solution lies between them, which already says a lot about it.",
        "解不一定是整数。如果一次试的结果太小，下一个整数的结果太大，解就在它们之间，这已经说明了很多。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const n = rng.int(2, 15);
        const b = rng.int(1, 20);
        const c = a * n + b + rng.int(1, a - 1);
        return whole(
          [
            `The solution of $${a}x + ${b} = ${c}$ lies between two consecutive whole numbers. What is the smaller one?`,
            `$${a}x + ${b} = ${c}$ 的解在两个相邻整数之间。较小的那个是多少？`,
          ],
          n,
          [n + 1, n - 1, Math.floor(c / a)],
          [
            `$x = ${n}$ gives ${a * n + b}, which is too little, and $x = ${n + 1}$ gives ${a * (n + 1) + b}, which is too much.`,
            `$x = ${n}$ 得 ${a * n + b}，太小；$x = ${n + 1}$ 得 ${a * (n + 1) + b}，太大。`,
          ],
        );
      },
    ),
  ],
};
