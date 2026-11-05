// A third knowledge point for the 4th Grade Math topics on place value, whole-number
// operations and the first fractions: facts run backwards, a check, or a reversed question.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { lowestNumerator } from "../early-grades-kit.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import { numberProblem } from "../problems.ts";
import { choose, chooseMath, type Pair, whole } from "./early-grades-more-kit.ts";

/** skill builds a knowledge point from its texts and generator. */
const skill = (id: string, title: Pair, explanation: Pair, generate: KnowledgePointDef["generate"]): KnowledgePointDef => ({
  id,
  title: t(title[0], title[1]),
  explanation: t(explanation[0], explanation[1]),
  generate,
});

/** commas writes a whole number with thousands separators for LaTeX. */
const commas = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}");

/** fraction builds a problem whose answer is a fraction. */
const fraction = (prompt: Pair, answer: Q, wrong: readonly Q[], solution: Pair) =>
  numberProblem({ prompt: t(prompt[0], prompt[1]), answer, wrong, solution: t(solution[0], solution[1]) });

/** missingAddend builds the knowledge point of a missing addend, for addends in a range. */
const missingAddend = (id: string, title: Pair, lo: [number, number], hi: [number, number]) =>
  skill(
    id,
    title,
    [
      "A sum with a missing addend is undone by subtracting. Take the addend you can see away from the total, and check by adding the two addends back together.",
      "缺少一个加数的加法可以用减法还原。用和减去看得见的加数，再把两个加数相加来验算。",
    ],
    (rng) => {
      const a = rng.int(lo[0], lo[1]);
      const b = rng.int(hi[0], hi[1]);
      const sum = a + b;
      return whole(
        [
          `Find the missing number: $$${commas(b)} + \\square = ${commas(sum)}$$`,
          `求缺少的数：$$${commas(b)} + \\square = ${commas(sum)}$$`,
        ],
        a,
        [sum + b, a + 10, a > 10 ? a - 10 : a + 100],
        [
          `Subtract the known addend: $${commas(sum)} - ${commas(b)} = ${commas(a)}$. Adding back gives $${commas(sum)}$, as it should.`,
          `减去已知的加数：$${commas(sum)} - ${commas(b)} = ${commas(a)}$。加回去得 $${commas(sum)}$，正确。`,
        ],
      );
    },
  );

/** missingStart builds the knowledge point of the number a subtraction started from. */
const missingStart = (id: string, title: Pair, lo: [number, number], hi: [number, number]) =>
  skill(
    id,
    title,
    [
      "A subtraction is undone by adding. When the difference and the amount taken away are known, their sum is the number the subtraction started from.",
      "减法可以用加法还原。知道差和减去的数时，它们的和就是被减数。",
    ],
    (rng) => {
      const c = rng.int(lo[0], lo[1]);
      const b = rng.int(hi[0], hi[1]);
      return whole(
        [`Find the missing number: $$\\square - ${commas(b)} = ${commas(c)}$$`, `求缺少的数：$$\\square - ${commas(b)} = ${commas(c)}$$`],
        b + c,
        [Math.abs(b - c), b + c + 10, b + c + 100],
        [
          `Adding undoes subtracting: $${commas(c)} + ${commas(b)} = ${commas(b + c)}$.`,
          `加法可以还原减法：$${commas(c)} + ${commas(b)} = ${commas(b + c)}$。`,
        ],
      );
    },
  );

/** rebuildDividend builds the knowledge point of rebuilding a number from a division. */
const rebuildDividend = (id: string, title: Pair, quotient: [number, number]) =>
  skill(
    id,
    title,
    [
      "A division can be checked by multiplying. The divisor times the quotient, plus any remainder, must give back the number that was divided.",
      "除法可以用乘法验算。除数乘商，再加上余数，一定等于被除数。",
    ],
    (rng) => {
      const d = rng.int(2, 9);
      const q = rng.int(quotient[0], quotient[1]);
      const r = rng.int(0, d - 1);
      const n = d * q + r;
      const rest: Pair = r > 0 ? [` with remainder ${r}`, `，余 ${r}`] : ["", ""];
      return whole(
        [
          `A division by ${d} gives $${commas(q)}$${rest[0]}. What number was divided?`,
          `一个数除以 ${d} 得 $${commas(q)}$${rest[1]}。被除数是多少？`,
        ],
        n,
        [d * q, d + q + r, d * q - r + 2 * d],
        [
          `Multiply back: $${d} \\times ${commas(q)} = ${commas(d * q)}$${r > 0 ? `, then add the remainder to get $${commas(n)}$` : ""}.`,
          `乘回去：$${d} \\times ${commas(q)} = ${commas(d * q)}$${r > 0 ? `，再加上余数得 $${commas(n)}$` : ""}。`,
        ],
      );
    },
  );

/** deeperGrade4ThirdPoints holds the third knowledge points of these 4th Grade Math topics, by topic. */
export const deeperGrade4ThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "place-value-with-numbers-up-to-four-digits": [
    skill(
      "the-largest-number-from-four-digits",
      ["The largest number from four digits", "用四个数字组成最大的数"],
      [
        "The further left a digit stands, the more it is worth. So the largest number from a set of digits puts the largest digit first, and the smallest number puts the smallest non-zero digit first.",
        "数字越靠左，值越大。所以用一组数字组成最大的数时，把最大的数字放在最前面；组成最小的数时，把最小的非零数字放在最前面。",
      ],
      (rng) => {
        const ds = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 4) as number[];
        const big = rng.bool();
        const sorted = [...ds].sort((a, b) => (big ? b - a : a - b));
        const value = Number(sorted.join(""));
        return whole(
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
          [Number([...sorted].reverse().join("")), Number(ds.join("")), value + 9],
          [
            `The thousands place counts most, so the digits go from ${big ? "largest to smallest" : "smallest to largest"}: $${commas(value)}$.`,
            `千位最重要，所以数字按${big ? "从大到小" : "从小到大"}排列：$${commas(value)}$。`,
          ],
        );
      },
    ),
  ],
  "writing-whole-numbers-in-words": [
    skill(
      "the-words-for-a-zero-digit",
      ["Where a zero digit goes in words", "零在读法中的位置"],
      [
        "A zero digit is not said in a number's name, but it changes the words around it. Thirty thousand, five has no thousands, hundreds or tens beyond the thirty thousand, only five ones.",
        "中文读法中，中间的 0 读作“零”，但不读出它的数位。例如 30,005 读作三万零五，没有千、百、十。",
      ],
      (rng) => {
        const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
        const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        const zh = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        const a = rng.int(2, 9);
        const o = rng.int(1, 9);
        const x = rng.int(1, 9);
        const n = a * 10000 + x * 100 + o;
        return chooseMath(
          rng,
          [`Which number is ${tens[a]} thousand, ${ones[x]} hundred ${ones[o]}?`, `哪个数是${zh[a]}万${zh[x]}百零${zh[o]}？`],
          commas(n),
          [commas(a * 1000 + x * 100 + o), commas(a * 10000 + x * 10 + o), commas(a * 10000 + x * 100 + o * 10)],
          [
            `There are ${a} ten thousands, no thousands, ${x} hundreds, no tens and ${o} ones: $${commas(n)}$.`,
            `有 ${a} 个万，没有千，${x} 个百，没有十，${o} 个一：$${commas(n)}$。`,
          ],
        );
      },
    ),
  ],
  "reading-whole-numbers-written-in-words": [
    skill(
      "the-digit-named-by-words",
      ["A digit named by words", "由读法确定数字"],
      [
        "Each group of words fills one group of digits. Reading a name such as seven thousand, twenty, the thousands digit is 7, the hundreds digit is 0 and the tens digit is 2.",
        "每组词对应一组数字。读七千零二十这样的名字时，千位是 7，百位是 0，十位是 2。",
      ],
      (rng) => {
        const words = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        const zh = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        const a = rng.int(1, 9);
        const c = rng.int(1, 9);
        const b = rng.int(1, 9);
        return whole(
          [
            `What digit is in the hundreds place of ${words[a]} thousand, ${words[c]} hundred ${words[b]}?`,
            `${zh[a]}千${zh[c]}百零${zh[b]}的百位上是几？`,
          ],
          c,
          [a, b, a === c ? c + 1 : 0],
          [`The words ${words[c]} hundred fill the hundreds place with a ${c}.`, `“${zh[c]}百”说明百位是 ${c}。`],
        );
      },
    ),
  ],
  "converting-from-standard-form-to-expanded-form": [
    skill(
      "the-number-of-terms-in-an-expanded-form",
      ["How many terms an expanded form has", "展开式有几项"],
      [
        "An expanded form has one term for each digit that is not zero. A zero digit adds nothing, so it needs no term, and the number of terms may be fewer than the number of digits.",
        "展开式中每个非零数字对应一项。数字 0 不增加任何值，不需要写，所以项数可能比数字的个数少。",
      ],
      (rng) => {
        const ds = Array.from({ length: 5 }, (_, i) => (i === 0 ? rng.int(1, 9) : rng.bool() ? 0 : rng.int(1, 9)));
        const n = Number(ds.join(""));
        const count = ds.filter((d) => d !== 0).length;
        return whole(
          [`How many terms does the expanded form of $${commas(n)}$ have?`, `$${commas(n)}$ 的展开式有几项？`],
          count,
          [5, 5 - count, count + 1],
          [
            `Each non-zero digit gives one term, and $${commas(n)}$ has ${count} non-zero digit${count > 1 ? "s" : ""}.`,
            `每个非零数字对应一项，$${commas(n)}$ 有 ${count} 个非零数字。`,
          ],
        );
      },
    ),
  ],
  "converting-from-expanded-form-to-standard-form": [
    skill(
      "expanded-forms-with-a-gap",
      ["Expanded forms with a gap", "有空位的展开式"],
      [
        "When an expanded form skips a place, that place holds a zero in the number. In $6000 + 40 + 2$ there are no hundreds, so the number is 6042 and not 642.",
        "展开式跳过某个数位时，这个数位要写 0。在 $6000 + 40 + 2$ 中没有百，所以这个数是 6042，而不是 642。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const c = rng.int(1, 9);
        const n = a * 10000 + b * 100 + c;
        return whole(
          [`Write $${commas(a * 10000)} + ${b * 100} + ${c}$ as a number.`, `把 $${commas(a * 10000)} + ${b * 100} + ${c}$ 写成一个数。`],
          n,
          [a * 1000 + b * 100 + c, a * 10000 + b * 10 + c, a * 100 + b * 10 + c],
          [
            `There are no thousands and no tens, so zeros hold those places: $${commas(n)}$.`,
            `没有千和十，所以这些数位用 0 占位：$${commas(n)}$。`,
          ],
        );
      },
    ),
  ],
  "equivalent-place-value-representations": [
    skill(
      "the-same-number-in-other-units",
      ["The same number in other units", "用其他单位表示同一个数"],
      [
        "A round number can be counted in different units. Since one thousand is ten hundreds, 7 thousands are 70 hundreds, and a larger unit always needs a smaller count.",
        "整数可以用不同的单位来数。因为 1 千等于 10 个百，所以 7 千等于 70 个百，单位越大，需要的个数越少。",
      ],
      (rng) => {
        const a = rng.int(2, 99);
        return whole(
          [
            `What number goes in the box? $$${a} \\text{ thousands} = \\square \\text{ hundreds}$$`,
            `方框里填几？$$${a} \\text{ 千} = \\square \\text{ 百}$$`,
          ],
          a * 10,
          [a * 100, a, a * 1000],
          [`Each thousand is 10 hundreds, so ${a} thousands are ${a * 10} hundreds.`, `每个千是 10 个百，所以 ${a} 千是 ${a * 10} 个百。`],
        );
      },
    ),
  ],
  "more-on-equivalent-place-value-representations": [
    skill(
      "tens-left-after-making-hundreds",
      ["Tens left after making hundreds", "换成百后剩下的十"],
      [
        "Ten tens trade for one hundred. A count of tens over ten can be split into whole hundreds and leftover tens by taking away groups of ten tens.",
        "10 个十可以换成 1 个百。超过十个的十可以分成整百和剩下的十，方法是取走若干组十个十。",
      ],
      (rng) => {
        const tens = rng.int(11, 99);
        return whole(
          [
            `$${tens}$ tens are traded for as many hundreds as possible. How many tens are left over?`,
            `把 $${tens}$ 个十尽量换成百。还剩几个十？`,
          ],
          tens % 10,
          [Math.floor(tens / 10), tens, tens % 10 === 0 ? 10 : 10 - (tens % 10)],
          [
            `$${tens}$ tens are ${Math.floor(tens / 10)} groups of ten tens and ${tens % 10} more, so ${tens % 10} tens are left.`,
            `$${tens}$ 个十是 ${Math.floor(tens / 10)} 组十个十，再加 ${tens % 10} 个，所以剩下 ${tens % 10} 个十。`,
          ],
        );
      },
    ),
  ],
  "equivalent-place-value-representations-and-borrowing": [
    skill(
      "opening-a-thousand",
      ["Opening a thousand", "拆开一个千"],
      [
        "Borrowing rewrites a number without changing it. One thousand becomes ten hundreds, so 3 thousands and 2 hundreds are the same as 2 thousands and 12 hundreds.",
        "借位只改写一个数，不改变它的大小。1 个千变成 10 个百，所以 3 千 2 百等于 2 千 12 百。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(0, 9);
        const c = rng.int(0, 9);
        const n = a * 1000 + b * 100 + c;
        return whole(
          [
            `Fill in the box: $${commas(n)} = ${a - 1}\\text{ thousands} + \\square\\text{ hundreds} + ${c}\\text{ ones}$`,
            `填方框：$${commas(n)} = ${a - 1}\\text{ 千} + \\square\\text{ 百} + ${c}\\text{ 个一}$`,
          ],
          b + 10,
          [b, b + 1, b + 100],
          [
            `One thousand was opened into 10 hundreds, joining the ${b} already there: $10 + ${b} = ${b + 10}$.`,
            `把 1 个千拆成 10 个百，加上原来的 ${b} 个百：$10 + ${b} = ${b + 10}$。`,
          ],
        );
      },
    ),
  ],
  "comparing-place-values": [
    skill(
      "a-tenth-of-the-value",
      ["One tenth of the value", "值的十分之一"],
      [
        "Moving a digit one place to the right makes it worth a tenth as much. So a 6 in the hundreds place is worth 600, and a 6 one place to the right is worth 60.",
        "数字向右移一位，它的值变成原来的十分之一。百位上的 6 值 600，右移一位的 6 值 60。",
      ],
      (rng) => {
        const d = rng.int(1, 9);
        const k = rng.int(2, 5);
        const v = d * 10 ** k;
        return whole(
          [
            `A digit ${d} is worth $${commas(v)}$. How much is the same digit worth one place to its right?`,
            `数字 ${d} 的值是 $${commas(v)}$。同样的数字在它右边一位时值多少？`,
          ],
          v / 10,
          [v * 10, d, v - 10],
          [
            `One place to the right is a tenth of the value: $${commas(v)} \\div 10 = ${commas(v / 10)}$.`,
            `右移一位，值变成十分之一：$${commas(v)} \\div 10 = ${commas(v / 10)}$。`,
          ],
        );
      },
    ),
  ],
  "comparing-whole-numbers": [
    skill(
      "ordering-four-whole-numbers",
      ["Ordering four whole numbers", "给四个整数排序"],
      [
        "To order numbers, first compare how many digits they have, since more digits mean a larger number. Among numbers of the same length, compare the digits from the left.",
        "给数排序时先比位数，位数多的数大。位数相同时，从左边开始比较各位数字。",
      ],
      (rng) => {
        const base = rng.int(1, 8) * 1000 + rng.int(0, 9) * 100;
        const set = [base + rng.int(10, 49), base + rng.int(50, 99), base + 100 + rng.int(0, 99), Math.floor(base / 10) + rng.int(1, 9)];
        const shown = rng.shuffle(set);
        const sorted = [...set].sort((a, b) => a - b);
        return whole(
          [
            `Put $${shown.map(commas).join(",\\ ")}$ in order from least to greatest. Which number is second?`,
            `把 $${shown.map(commas).join(",\\ ")}$ 从小到大排列。第二个数是多少？`,
          ],
          sorted[1]!,
          [sorted[0]!, sorted[2]!, sorted[3]!],
          [
            `In order they are $${sorted.map(commas).join(",\\ ")}$: the shortest number comes first and the rest follow by their digits.`,
            `按顺序是 $${sorted.map(commas).join(",\\ ")}$：位数最少的在最前面，其余按数字比较。`,
          ],
        );
      },
    ),
  ],
  "rounding-down-whole-numbers": [
    skill(
      "the-largest-that-rounds-down",
      ["The largest that rounds down", "能舍去的最大数"],
      [
        "A number rounds down to a hundred when what follows is under 50. So the largest whole number that rounds down to 700 is 749, because 750 would round up.",
        "后面部分小于 50 时，这个数舍到整百。所以舍到 700 的最大整数是 749，因为 750 要入。",
      ],
      (rng) => {
        const step = rng.pick([100, 1000]);
        const base = step * rng.int(2, 90);
        return whole(
          [
            `A whole number rounds down to $${commas(base)}$ when rounded to the nearest ${step === 100 ? "hundred" : "thousand"}. What is the largest it could be?`,
            `一个整数四舍五入到${step === 100 ? "百" : "千"}位时舍成 $${commas(base)}$。它最大可能是多少？`,
          ],
          base + step / 2 - 1,
          [base + step / 2, base + step - 1, base + step / 2 - 10],
          [
            `Half a step above is $${commas(base + step / 2)}$, which already rounds up, so the largest is one less: $${commas(base + step / 2 - 1)}$.`,
            `再加半个单位是 $${commas(base + step / 2)}$，它已经要入，所以最大的数比它少 1：$${commas(base + step / 2 - 1)}$。`,
          ],
        );
      },
    ),
  ],
  "rounding-up-the-digit-9": [
    skill(
      "the-smallest-that-rounds-up-past-nines",
      ["The smallest that rounds up", "能入的最小数"],
      [
        "Rounding can carry through nines. The smallest number that rounds up to 3,000 at the nearest hundred is 2,950, since the digit 5 in the tens sends 29 hundreds to 30 hundreds.",
        "四舍五入可能连续进位。四舍五入到百位后等于 3,000 的最小数是 2,950，因为十位的 5 使 29 个百变成 30 个百。",
      ],
      (rng) => {
        const th = rng.int(2, 90) * 1000;
        return whole(
          [
            `A whole number rounds up to $${commas(th)}$ when rounded to the nearest hundred. What is the smallest it could be?`,
            `一个整数四舍五入到百位时入成 $${commas(th)}$。它最小可能是多少？`,
          ],
          th - 50,
          [th - 100, th - 49, th - 500],
          [
            `$${commas(th - 50)}$ has 9 hundreds and 5 tens, which rounds up across the 9s to $${commas(th)}$. One less, $${commas(th - 51)}$, rounds down.`,
            `$${commas(th - 50)}$ 有 9 个百和 5 个十，连续进位后得 $${commas(th)}$。比它少 1 的 $${commas(th - 51)}$ 要舍。`,
          ],
        );
      },
    ),
  ],
  "adding-two-digit-whole-numbers": [
    missingAddend("the-missing-two-digit-addend", ["The missing two-digit addend", "缺少的两位数加数"], [12, 89], [12, 89]),
  ],
  "adding-three-digit-and-two-digit-numbers": [
    missingAddend(
      "the-missing-two-digit-addend-with-a-three-digit-sum",
      ["A missing addend in a three-digit sum", "和是三位数时缺少的加数"],
      [12, 89],
      [110, 899],
    ),
  ],
  "adding-three-digit-numbers": [
    missingAddend("the-missing-three-digit-addend", ["The missing three-digit addend", "缺少的三位数加数"], [110, 899], [110, 899]),
  ],
  "adding-numbers-up-to-five-digits": [
    missingAddend(
      "the-missing-addend-up-to-five-digits",
      ["The missing addend up to five digits", "最多五位数的缺少加数"],
      [1100, 45999],
      [1100, 45999],
    ),
  ],
  "subtracting-two-digit-numbers": [
    missingStart(
      "the-start-of-a-two-digit-subtraction",
      ["The start of a two-digit subtraction", "两位数减法的被减数"],
      [12, 49],
      [12, 49],
    ),
  ],
  "subtracting-two-digit-numbers-from-three-digit-numbers": [
    missingStart(
      "the-start-of-a-three-digit-subtraction",
      ["The start of a three-digit subtraction", "三位数减法的被减数"],
      [110, 899],
      [12, 99],
    ),
  ],
  "subtracting-numbers-up-to-five-digits": [
    missingStart(
      "the-start-of-a-long-subtraction",
      ["The start of a long subtraction", "多位数减法的被减数"],
      [1100, 45999],
      [1100, 45999],
    ),
  ],
  "estimating-multi-digit-subtraction": [
    skill(
      "is-the-exact-answer-sensible",
      ["Is the exact answer sensible", "准确答案是否合理"],
      [
        "An estimate tells whether an exact answer is sensible. If rounding gives about 3,000 and a calculation gives 300, a place has slipped, and the calculation should be done again.",
        "估算可以判断准确答案是否合理。如果估算约为 3,000，而计算结果是 300，就是错了一位，应该重新计算。",
      ],
      (rng) => {
        const a = rng.int(4, 9) * 1000 + rng.int(100, 400);
        const b = rng.int(1, 3) * 1000 + rng.int(100, 400);
        const exact = a - b;
        const est = Math.round(a / 1000) * 1000 - Math.round(b / 1000) * 1000;
        return chooseMath(
          rng,
          [
            `Rounding to thousands estimates $${commas(a)} - ${commas(b)}$ as $${commas(est)}$. Which answer is sensible?`,
            `四舍五入到千位时，$${commas(a)} - ${commas(b)}$ 的估算值是 $${commas(est)}$。哪个答案合理？`,
          ],
          commas(exact),
          [commas(Math.floor(exact / 10)), commas(exact * 10), commas(a + b)],
          [
            `Only $${commas(exact)}$ is close to the estimate of $${commas(est)}$. The others are far too small or too large.`,
            `只有 $${commas(exact)}$ 接近估算值 $${commas(est)}$。其他答案太小或太大。`,
          ],
        );
      },
    ),
  ],
  "multiplying-using-repeated-subtraction": [
    skill(
      "two-groups-fewer",
      ["Two groups fewer", "少两组"],
      [
        "Being below a friendly factor by two means two groups too many. To find $8 \\times 15$ from $10 \\times 15$, take away two groups of 15, which is 30.",
        "比好算的因数少 2，就是多算了两组。由 $10 \\times 15$ 求 $8 \\times 15$ 时，要去掉两组 15，也就是 30。",
      ],
      (rng) => {
        const a = rng.int(12, 49);
        const k = rng.int(1, 3);
        const m = 10 * k - 2;
        return whole(
          [
            `Use $${10 * k} \\times ${a} = ${10 * k * a}$ to find $${m} \\times ${a}$.`,
            `利用 $${10 * k} \\times ${a} = ${10 * k * a}$ 求 $${m} \\times ${a}$。`,
          ],
          m * a,
          [10 * k * a - a, 10 * k * a - 2, 10 * k * a + 2 * a],
          [
            `${m} is 2 less than ${10 * k}, so take away two groups of ${a}: $${10 * k * a} - ${2 * a} = ${m * a}$.`,
            `${m} 比 ${10 * k} 少 2，所以去掉两组 ${a}：$${10 * k * a} - ${2 * a} = ${m * a}$。`,
          ],
        );
      },
    ),
  ],
  "two-digit-by-one-digit-multiplication-using-area-models": [
    {
      ...skill(
        "the-factors-from-the-parts",
        ["The factors from the parts", "由各部分求因数"],
        [
          "An area model's parts show the factors. If the parts are 80 and 12 and the side is 4, then the other side was split into $80 \\div 4 = 20$ and $12 \\div 4 = 3$, which is 23.",
          "面积模型的各部分显示了因数。如果两部分是 80 和 12，一边是 4，另一边就分成 $80 \\div 4 = 20$ 和 $12 \\div 4 = 3$，也就是 23。",
        ],
        (rng) => {
          const a = rng.int(2, 9);
          const tens = rng.int(1, 9);
          const ones = rng.int(1, 9);
          return whole(
            [
              `An area model has one side of ${a}. Its two parts have areas ${a * tens * 10} and ${a * ones}. What two-digit number is the other side?`,
              `一个面积模型的一边是 ${a}，两部分的面积分别是 ${a * tens * 10} 和 ${a * ones}。另一边是什么两位数？`,
            ],
            tens * 10 + ones,
            [a * tens * 10 + a * ones, ones * 10 + tens, tens + ones],
            [
              `Divide each part by ${a}: ${tens * 10} and ${ones}. Together the side is ${tens * 10 + ones}.`,
              `每部分除以 ${a}：得 ${tens * 10} 和 ${ones}。合起来这一边是 ${tens * 10 + ones}。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["two-digit-by-one-digit-multiplication-using-area-models#the-factors-from-the-parts"],
    },
  ],
  "multi-digit-by-one-digit-multiplication-using-area-models": [
    skill(
      "the-largest-part-of-the-model",
      ["The largest part of the model", "模型中最大的部分"],
      [
        "The part made by the leading digit is the largest and gives a first estimate of the product. For $6 \\times 348$, the part for 300 is 1800, so the product is a little above that.",
        "由最高位得到的部分最大，可以作为积的初步估计。算 $6 \\times 348$ 时，300 对应的部分是 1800，所以积比它大一些。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const h = rng.int(1, 9);
        const rest = rng.int(11, 99);
        const n = h * 100 + rest;
        return whole(
          [
            `An area model shows $${a} \\times ${n}$, split by place value. What is the area of its largest part?`,
            `一个面积模型表示 $${a} \\times ${n}$，按数位拆分。最大的部分面积是多少？`,
          ],
          a * h * 100,
          [a * n, a * rest, a * h * 10],
          [
            `The largest part uses the hundreds: $${a} \\times ${h * 100} = ${a * h * 100}$.`,
            `最大的部分来自百位：$${a} \\times ${h * 100} = ${a * h * 100}$。`,
          ],
        );
      },
    ),
  ],
  "two-digit-by-two-digit-multiplication-using-area-models": [
    skill(
      "tens-times-tens-first",
      ["Tens times tens first", "先算十乘十"],
      [
        "In a two-by-two model, the tens of each factor make the largest part, and this part alone shows the size of the product. For $36 \\times 42$ it is $30 \\times 40 = 1200$.",
        "在两位数乘两位数的模型中，两个因数的十相乘得到最大的部分，仅这一部分就能显示积的大小。算 $36 \\times 42$ 时，它是 $30 \\times 40 = 1200$。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const x = a * 10 + rng.int(1, 9);
        const y = b * 10 + rng.int(1, 9);
        return whole(
          [
            `What is the area of the largest of the four parts of an area model for $${x} \\times ${y}$?`,
            `$${x} \\times ${y}$ 的面积模型有四部分，其中最大部分的面积是多少？`,
          ],
          a * b * 100,
          [x * y, a * b * 10, a * b],
          [
            `The largest part is tens times tens: $${a * 10} \\times ${b * 10} = ${a * b * 100}$.`,
            `最大的部分是十乘十：$${a * 10} \\times ${b * 10} = ${a * b * 100}$。`,
          ],
        );
      },
    ),
  ],
  "dividing-by-one-digit-numbers-using-multiplication": [
    rebuildDividend("the-number-divided-up-to-two-digits", ["The number that was divided", "被除数是多少"], [12, 49]),
  ],
  "dividing-using-place-value-strategies": [
    skill(
      "splitting-a-dividend-to-divide",
      ["Which split divides evenly", "哪种拆分能整除"],
      [
        "A number can be split into parts that each divide evenly. For $156 \\div 4$, the split $120 + 36$ works, because 4 goes into both, and the two quotients add up.",
        "一个数可以拆成各能整除的部分。算 $156 \\div 4$ 时，拆成 $120 + 36$ 可以，因为两部分都能被 4 整除，两个商相加即可。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const q1 = rng.int(1, 9) * 10;
        const q2 = rng.int(2, 9);
        const n = d * (q1 + q2);
        const good = `${d * q1} + ${d * q2}`;
        return chooseMath(
          rng,
          [`Which split of ${n} lets you divide each part evenly by ${d}?`, `把 ${n} 怎样拆分，才能使每部分都能被 ${d} 整除？`],
          good,
          [`${d * q1 + 1} + ${d * q2 - 1}`, `${d * q1 - 1} + ${d * q2 + 1}`, `${d * q1 + 2} + ${d * q2 - 2}`],
          [
            `$${d} \\times ${q1} = ${d * q1}$ and $${d} \\times ${q2} = ${d * q2}$, so both parts divide by ${d}, giving ${q1} and ${q2}.`,
            `$${d} \\times ${q1} = ${d * q1}$，$${d} \\times ${q2} = ${d * q2}$，所以两部分都能被 ${d} 整除，商是 ${q1} 和 ${q2}。`,
          ],
        );
      },
    ),
  ],
  "estimating-multi-digit-division": [
    skill(
      "between-two-round-quotients",
      ["Between two round quotients", "商在两个整十数之间"],
      [
        "Multiples of a divisor can trap a quotient. For $331 \\div 4$, since $4 \\times 80 = 320$ and $4 \\times 90 = 360$, the quotient lies between 80 and 90, without working out more.",
        "除数的倍数可以夹住商。算 $331 \\div 4$ 时，因为 $4 \\times 80 = 320$，$4 \\times 90 = 360$，所以不必再算就知道商在 80 和 90 之间。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const k = rng.int(2, 9);
        const n = d * k * 10 + rng.int(1, d * 10 - 1);
        return whole(
          [
            `The quotient $${n} \\div ${d}$ lies between two multiples of 10. What is the smaller one?`,
            `商 $${n} \\div ${d}$ 在两个相邻的整十数之间。较小的是多少？`,
          ],
          k * 10,
          [(k + 1) * 10, d * 10, (k - 1) * 10],
          [
            `$${d} \\times ${k * 10} = ${d * k * 10}$ and $${d} \\times ${(k + 1) * 10} = ${d * (k + 1) * 10}$, and ${n} is between them.`,
            `$${d} \\times ${k * 10} = ${d * k * 10}$，$${d} \\times ${(k + 1) * 10} = ${d * (k + 1) * 10}$，${n} 在它们之间。`,
          ],
        );
      },
    ),
  ],
  "two-digit-by-one-digit-division-using-area-models": [
    {
      ...skill(
        "the-total-area-from-the-side-lengths",
        ["The dividend from the model", "由模型求被除数"],
        [
          "A division area model has the divisor on one side and the quotient's parts on the other. Its total area is the number divided, so multiply each part and add them.",
          "除法面积模型的一边是除数，另一边是商的各部分。总面积就是被除数，所以把每部分相乘再相加。",
        ],
        (rng) => {
          const d = rng.int(2, 9);
          const t10 = rng.int(1, 3) * 10;
          const o = rng.int(1, 9);
          return whole(
            [
              `A division model has side ${d} on one edge, and the other edge is split into ${t10} and ${o}. What number was divided?`,
              `一个除法模型一边长 ${d}，另一边分成 ${t10} 和 ${o}。被除数是多少？`,
            ],
            d * (t10 + o),
            [d + t10 + o, d * t10, d * o],
            [
              `The area is $${d} \\times ${t10} + ${d} \\times ${o} = ${d * t10} + ${d * o} = ${d * (t10 + o)}$.`,
              `面积是 $${d} \\times ${t10} + ${d} \\times ${o} = ${d * t10} + ${d * o} = ${d * (t10 + o)}$。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["two-digit-by-one-digit-division-using-area-models#the-total-area-from-the-side-lengths"],
    },
  ],
  "multi-digit-by-one-digit-division-using-area-models": [
    rebuildDividend("the-number-divided-up-to-three-digits", ["The number divided, from three digits", "三位数的被除数"], [112, 899]),
  ],
  "more-multi-digit-by-one-digit-division-using-area-models": [
    rebuildDividend("the-number-divided-up-to-four-digits", ["The number divided, from four digits", "四位数的被除数"], [1120, 4999]),
  ],
  "two-digit-by-one-digit-division-using-partial-quotients": [
    skill(
      "what-remains-after-a-partial-quotient",
      ["What remains after two partial quotients", "两次部分商之后还剩多少"],
      [
        "Partial quotients take away groups in stages. After each stage, what remains is what still has to be divided. Keep track of it to know when you are done.",
        "部分商法分几次减去若干组。每次之后，剩下的就是还要继续除的部分。记住它才知道什么时候算完。",
      ],
      (rng) => {
        const d = rng.int(3, 7);
        const q1 = rng.int(1, 2) * 10;
        const q2 = rng.int(2, 5);
        const q3 = rng.int(1, 9);
        const n = d * (q1 + q2 + q3);
        return whole(
          [
            `To find $${n} \\div ${d}$, Jade first takes away ${q1} groups of ${d} and then ${q2} more groups of ${d}. How much is left to divide?`,
            `求 $${n} \\div ${d}$ 时，Jade 先减去 ${q1} 组 ${d}，再减去 ${q2} 组 ${d}。还剩多少要除？`,
          ],
          d * q3,
          [q3, n - d * q1, n - q1 - q2],
          [
            `The groups used are $${d} \\times ${q1 + q2} = ${d * (q1 + q2)}$, and $${n} - ${d * (q1 + q2)} = ${d * q3}$.`,
            `已减去 $${d} \\times ${q1 + q2} = ${d * (q1 + q2)}$，$${n} - ${d * (q1 + q2)} = ${d * q3}$。`,
          ],
        );
      },
    ),
  ],
  "evaluating-expressions-containing-multiplication-and-division": [
    skill(
      "parentheses-with-division",
      ["Parentheses with division", "带括号的除法"],
      [
        "Parentheses come before everything else and can change the result. In $48 \\div (2 \\times 3)$ the product is found first, giving $48 \\div 6 = 8$ instead of the left-to-right value 72.",
        "括号里的先算，可能改变结果。在 $48 \\div (2 \\times 3)$ 中先算积，得 $48 \\div 6 = 8$，而不是从左到右算得的 72。",
      ],
      (rng) => {
        const b = rng.int(2, 5);
        const c = rng.int(2, 5);
        const q = rng.int(2, 9);
        const a = b * c * q;
        return whole(
          [`Evaluate $${a} \\div (${b} \\times ${c})$.`, `计算 $${a} \\div (${b} \\times ${c})$。`],
          q,
          [(a / b) * c, b * c, a - b * c],
          [
            `First the parentheses: $${b} \\times ${c} = ${b * c}$. Then $${a} \\div ${b * c} = ${q}$.`,
            `先算括号：$${b} \\times ${c} = ${b * c}$。再算 $${a} \\div ${b * c} = ${q}$。`,
          ],
        );
      },
    ),
  ],
  "solving-multistep-word-problems-using-number-operations": [
    skill(
      "equal-shares-of-a-total",
      ["Equal shares of a total", "总数的平均分配"],
      [
        "Some problems first build a total and then share it. Find the total from the groups, add or remove anything extra, and only then divide into equal shares.",
        "有些问题要先求总数再分配。先由各组求总数，加上或去掉多余的部分，然后再平均分。",
      ],
      (rng) => {
        const boxes = rng.int(3, 9);
        const per = rng.int(12, 40);
        const friends = rng.int(3, 9);
        const each = rng.int(5, 30);
        const extra = boxes * per - friends * each;
        const keep = Math.max(extra, 0);
        const b2 = extra > 0 ? boxes : Math.ceil((friends * each) / per) + 1;
        const keep2 = extra > 0 ? keep : b2 * per - friends * each;
        return whole(
          [
            `A club has ${b2} boxes with ${per} pens in each box. It keeps ${keep2} pens and shares the rest equally among ${friends} teams. How many pens does each team get?`,
            `一个社团有 ${b2} 盒笔，每盒 ${per} 支。留下 ${keep2} 支，其余平均分给 ${friends} 个小组。每组得到多少支？`,
          ],
          each,
          [Math.floor((b2 * per) / friends), each + keep2, b2 * per - keep2],
          [
            `Total $${b2} \\times ${per} = ${b2 * per}$, minus ${keep2} is ${friends * each}, and $${friends * each} \\div ${friends} = ${each}$.`,
            `总数 $${b2} \\times ${per} = ${b2 * per}$，减去 ${keep2} 得 ${friends * each}，$${friends * each} \\div ${friends} = ${each}$。`,
          ],
        );
      },
    ),
  ],
  "further-solving-multistep-word-problems-using-the-four-operations": [
    skill(
      "what-to-do-with-the-remainder",
      ["What to do with the remainder", "如何处理余数"],
      [
        "The story decides what a remainder means. If everyone needs a seat, round up to one more van. If only full boxes count, drop the remainder. Sometimes the remainder is itself the answer.",
        "故事决定余数的含义。如果每个人都要有座位，就多加一辆车。如果只算装满的盒子，就舍去余数。有时余数本身就是答案。",
      ],
      (rng) => {
        const per = rng.int(4, 9);
        const q = rng.int(4, 30);
        const r = rng.int(1, per - 1);
        const n = per * q + r;
        const form = rng.int(0, 2);
        const answer = form === 0 ? q + 1 : form === 1 ? q : r;
        return whole(
          form === 0
            ? [
                `${n} students ride in vans that hold ${per} each. How many vans are needed?`,
                `${n} 名学生坐车，每辆车坐 ${per} 人。需要多少辆车？`,
              ]
            : form === 1
              ? [
                  `${n} eggs are packed into cartons of ${per}. How many cartons can be filled?`,
                  `${n} 个鸡蛋装入每盒 ${per} 个的盒子。能装满多少盒？`,
                ]
              : [
                  `${n} stickers are shared equally among ${per} children, as many as possible each. How many stickers are left over?`,
                  `${n} 张贴纸平均分给 ${per} 个孩子，每人尽量多分。还剩多少张？`,
                ],
          answer,
          form === 2 ? [q, q + 1, per - r] : form === 0 ? [q, r, q + 2] : [q + 1, r, q - 1],
          form === 0
            ? [
                `$${n} \\div ${per}$ is ${q} remainder ${r}. Those ${r} students still need a van, so ${q + 1}.`,
                `$${n} \\div ${per}$ 得 ${q} 余 ${r}。这 ${r} 名学生也要坐车，所以需要 ${q + 1} 辆。`,
              ]
            : form === 1
              ? [
                  `$${n} \\div ${per}$ is ${q} remainder ${r}, and the ${r} extra eggs do not fill a carton, so ${q}.`,
                  `$${n} \\div ${per}$ 得 ${q} 余 ${r}，多出的 ${r} 个鸡蛋装不满一盒，所以是 ${q} 盒。`,
                ]
              : [
                  `$${n} \\div ${per}$ is ${q} remainder ${r}, and the remainder is what is left: ${r}.`,
                  `$${n} \\div ${per}$ 得 ${q} 余 ${r}，余数就是剩下的：${r} 张。`,
                ],
        );
      },
    ),
  ],
  "interpreting-multiplication-equations-as-a-comparison": [
    skill(
      "times-as-many-versus-more-than",
      ["Times as many or more than", "几倍还是多多少"],
      [
        "Three times as many means multiply by 3, while 3 more than means add 3. Reading the words carefully tells which operation the comparison uses.",
        "“3 倍”表示乘 3，“多 3”表示加 3。仔细读题就知道比较用的是哪种运算。",
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const n = rng.int(3, 12);
        const times = rng.bool();
        return whole(
          times
            ? [`What number is ${k} times as many as ${n}?`, `${n} 的 ${k} 倍是多少？`]
            : [`What number is ${k} more than ${n}?`, `比 ${n} 多 ${k} 的数是多少？`],
          times ? k * n : k + n,
          times ? [k + n, k * n + n, k * n - n] : [k * n, k + n + 1, n],
          times
            ? [`Times as many means multiply: $${k} \\times ${n} = ${k * n}$.`, `几倍用乘法：$${k} \\times ${n} = ${k * n}$。`]
            : [`More than means add: $${n} + ${k} = ${n + k}$.`, `多多少用加法：$${n} + ${k} = ${n + k}$。`],
        );
      },
    ),
  ],
  "representing-comparison-statements-as-equations": [
    skill(
      "the-equation-for-the-smaller-amount",
      ["The equation for the smaller amount", "表示较小数量的方程"],
      [
        "A comparison can be written two ways: the larger amount as a product, or the smaller amount as a quotient. If $a$ is 4 times $b$, then $a = 4b$ and $b = a \\div 4$ say the same thing.",
        "比较可以写成两种形式：把较大的数写成积，或把较小的数写成商。如果 $a$ 是 $b$ 的 4 倍，那么 $a = 4b$ 和 $b = a \\div 4$ 说的是同一件事。",
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const big = k * rng.int(3, 12);
        return chooseMath(
          rng,
          [
            `Emma has ${big} books, which is ${k} times as many as Jade's $m$ books. Which equation gives $m$?`,
            `Emma 有 ${big} 本书，是 Jade 的 $m$ 本的 ${k} 倍。哪个方程能求出 $m$？`,
          ],
          `m = ${big} \\div ${k}`,
          [`m = ${big} \\times ${k}`, `m = ${big} - ${k}`, `m = ${big} + ${k}`],
          [
            `${big} is ${k} groups of $m$, so dividing ${big} by ${k} gives $m$.`,
            `${big} 是 ${k} 组 $m$，所以 ${big} 除以 ${k} 得到 $m$。`,
          ],
        );
      },
    ),
  ],
  "fraction-models": [
    skill(
      "shading-more-to-reach-a-fraction",
      ["Shading more to reach a fraction", "再涂多少到某个分数"],
      [
        "To go from one fraction to a larger one with the same denominator, shade the difference in parts. The denominator stays the same, because the size of each part has not changed.",
        "从一个分数到分母相同的更大分数，要多涂的份数就是分子之差。分母不变，因为每份的大小没有变。",
      ],
      (rng) => {
        const d = rng.int(4, 12);
        const a = rng.int(1, d - 2);
        const b = rng.int(a + 1, d);
        return whole(
          [
            `A bar has ${d} equal parts, with $\\frac{${a}}{${d}}$ shaded. How many more parts must be shaded so that $\\frac{${b}}{${d}}$ is shaded?`,
            `一个长条有 ${d} 等份，已涂 $\\frac{${a}}{${d}}$。还要涂多少份才涂到 $\\frac{${b}}{${d}}$？`,
          ],
          b - a,
          [b, a, d - a],
          [`The parts go from ${a} to ${b}, which is ${b - a} more.`, `份数从 ${a} 到 ${b}，要多涂 ${b - a} 份。`],
        );
      },
    ),
  ],
  "modeling-fractions-using-number-lines": [
    skill(
      "the-parts-between-zero-and-one",
      ["The parts between zero and one", "0 和 1 之间的份数"],
      [
        "The denominator counts the equal spaces between 0 and 1, not the tick marks. A line cut into 5 equal spaces has 6 ticks when both ends are counted.",
        "分母数的是 0 和 1 之间的等份，而不是刻度。分成 5 等份的线段，算上两端有 6 个刻度。",
      ],
      (rng) => {
        const spaces = rng.int(2, 24);
        const ticks = spaces + 1;
        if (rng.bool()) {
          return whole(
            [
              `A number line from 0 to 1 has ${ticks} tick marks, counting both ends, evenly spaced. Each space shows the unit fraction $\\frac{1}{n}$. What is $n$?`,
              `一条从 0 到 1 的数轴有 ${ticks} 个等距刻度（包括两端）。每段表示分数 $\\frac{1}{n}$。$n$ 是多少？`,
            ],
            spaces,
            [ticks, ticks + 1, spaces > 2 ? spaces - 1 : 5],
            [
              `${ticks} ticks leave ${spaces} spaces between them, so each space is $\\frac{1}{${spaces}}$.`,
              `${ticks} 个刻度之间有 ${spaces} 段，所以每段是 $\\frac{1}{${spaces}}$。`,
            ],
          );
        }
        return whole(
          [
            `A number line from 0 to 1 is marked in steps of $\\frac{1}{${spaces}}$. How many tick marks does it have, counting both ends?`,
            `一条从 0 到 1 的数轴按 $\\frac{1}{${spaces}}$ 一格标记。算上两端，一共有多少个刻度？`,
          ],
          ticks,
          [spaces, ticks + 1, spaces > 2 ? spaces - 1 : 5],
          [`There are ${spaces} spaces, and one more tick than spaces: ${ticks}.`, `有 ${spaces} 段，刻度比段数多 1：${ticks} 个。`],
        );
      },
    ),
  ],
  "writing-unit-fractions-in-words": [
    skill(
      "unit-fractions-from-a-share",
      ["Which unit fraction is larger, in words", "用文字比较单位分数"],
      [
        "With one part taken, the fewer the parts in the whole, the bigger each part. So one third is larger than one eighth, even though eight is the larger number.",
        "只取一份时，整体分成的份数越少，每份越大。所以三分之一大于八分之一，尽管八是较大的数。",
      ],
      (rng) => {
        const names: readonly [Pair, number][] = [
          [["one half", "二分之一"], 2],
          [["one third", "三分之一"], 3],
          [["one fourth", "四分之一"], 4],
          [["one fifth", "五分之一"], 5],
          [["one sixth", "六分之一"], 6],
          [["one eighth", "八分之一"], 8],
          [["one tenth", "十分之一"], 10],
          [["one twelfth", "十二分之一"], 12],
        ];
        const four = rng.sample(names, 4) as [Pair, number][];
        const answer = four.reduce((a, b) => (b[1] < a[1] ? b : a));
        return choose(
          rng,
          ["Which of these is the largest amount of the same pizza?", "下面哪个是同一张比萨中最大的量？"],
          answer[0],
          four.filter((x) => x !== answer).map((x) => x[0]),
          [
            `Each is one part, and ${answer[0][0]} cuts the pizza into the fewest parts, so each part is largest.`,
            `每个都是一份，${answer[0][1]}把比萨分成的份数最少，所以每份最大。`,
          ],
        );
      },
    ),
  ],
  "writing-fractions-in-words": [
    skill(
      "words-for-fractions-with-larger-tops",
      ["Words for several parts", "用文字写几份"],
      [
        "The top number says how many parts and the bottom names their size. So three fifths means 3 parts that are each one fifth; a plural size word shows there is more than one part.",
        "分子说明有几份，分母说明每份的大小。所以五分之三表示 3 份，每份是五分之一；英语中复数表示不止一份。",
      ],
      (rng) => {
        const tops = ["", "one", "two", "three", "four", "five", "six", "seven"];
        const bottoms: readonly [string, string, number][] = [
          ["thirds", "三", 3],
          ["fourths", "四", 4],
          ["fifths", "五", 5],
          ["sixths", "六", 6],
          ["eighths", "八", 8],
          ["sevenths", "七", 7],
          ["ninths", "九", 9],
          ["tenths", "十", 10],
          ["elevenths", "十一", 11],
          ["twelfths", "十二", 12],
        ];
        const [word, zh, d] = rng.pick(bottoms);
        const coprime = (x: number, y: number): boolean => (y === 0 ? x === 1 : coprime(y, x % y));
        const n = rng.pick([2, 3, 4, 5, 6, 7].filter((top) => top < d && coprime(top, d)));
        const zhn = ["", "一", "二", "三", "四", "五", "六", "七"][n];
        return fraction(
          [`Write "${tops[n]} ${word}" as a fraction.`, `把“${zh}分之${zhn}”写成分数。`],
          Q.of(n, d),
          [Q.of(d, n), Q.of(1, d), Q.of(n, d + 1)],
          [
            `${tops[n]} is the number of parts, on top, and ${word} names the size, on the bottom: $\\frac{${n}}{${d}}$.`,
            `份数 ${n} 写在分子，大小“${zh}分之一”的 ${d} 写在分母：$\\frac{${n}}{${d}}$。`,
          ],
        );
      },
    ),
  ],
  "interpreting-fractions-as-division": [
    skill(
      "a-fraction-as-a-division",
      ["A fraction as a division", "把分数写成除法"],
      [
        "The bar of a fraction means divide. So $\\frac{3}{4}$ is the same as $3 \\div 4$: the top is the number shared and the bottom is the number of shares.",
        "分数线表示除以。所以 $\\frac{3}{4}$ 等于 $3 \\div 4$：分子是被分的数，分母是份数。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const n = rng.int(1, d - 1);
        return chooseMath(
          rng,
          [`Which division has the same value as $\\frac{${n}}{${d}}$?`, `哪个除法与 $\\frac{${n}}{${d}}$ 的值相同？`],
          `${n} \\div ${d}`,
          [`${d} \\div ${n}`, `${n} \\times ${d}`, `${d} - ${n}`],
          [
            `The top is divided by the bottom, so $\\frac{${n}}{${d}} = ${n} \\div ${d}$.`,
            `分子除以分母，所以 $\\frac{${n}}{${d}} = ${n} \\div ${d}$。`,
          ],
        );
      },
    ),
  ],
  "improper-fractions": [
    skill(
      "the-whole-as-an-improper-fraction",
      ["A whole number as an improper fraction", "把整数写成假分数"],
      [
        "A whole number can be cut into equal parts of any size. Each whole gives as many parts as the denominator, so 3 wholes are $\\frac{12}{4}$ when each whole has 4 parts.",
        "整数可以分成任意大小的等份。每个 1 有分母那么多份，所以每份为四分之一时，3 个 1 是 $\\frac{12}{4}$。",
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const d = rng.int(2, 12);
        return whole(
          [`What number goes in the box? $$${k} = \\frac{\\square}{${d}}$$`, `方框里填几？$$${k} = \\frac{\\square}{${d}}$$`],
          k * d,
          [k + d, k, d],
          [
            `Each whole holds ${d} parts, so ${k} wholes hold $${k} \\times ${d} = ${k * d}$ parts.`,
            `每个 1 有 ${d} 份，所以 ${k} 个 1 有 $${k} \\times ${d} = ${k * d}$ 份。`,
          ],
        );
      },
    ),
  ],
  "models-for-mixed-numbers": [
    skill(
      "how-many-bars-a-mixed-number-needs",
      ["How many bars a mixed number needs", "带分数需要几个长条"],
      [
        "Each whole in a mixed number fills one bar, and the fraction needs one more bar partly shaded. So a mixed number with a whole part of 3 needs 4 bars in all.",
        "带分数中每个整数部分占满一个长条，分数部分还需要一个部分涂色的长条。所以整数部分为 3 的带分数一共需要 4 个长条。",
      ],
      (rng) => {
        const a = rng.int(1, 12);
        const d = rng.int(2, 9);
        const n = lowestNumerator(rng, d);
        return whole(
          [
            `How many bars are needed to shade $${a}\\frac{${n}}{${d}}$, where each bar is one whole?`,
            `每个长条表示 1，要涂出 $${a}\\frac{${n}}{${d}}$ 需要几个长条？`,
          ],
          a + 1,
          [a, d, a + n],
          [
            `${a} ${a === 1 ? "bar is" : "bars are"} full and one more shows $\\frac{${n}}{${d}}$, so ${a + 1} bars.`,
            `${a} 个长条涂满，还有 1 个表示 $\\frac{${n}}{${d}}$，所以需要 ${a + 1} 个。`,
          ],
        );
      },
    ),
  ],
  "modeling-mixed-numbers-using-number-lines": [
    skill(
      "the-whole-numbers-around-a-mixed-number",
      ["The whole numbers around a mixed number", "带分数两边的整数"],
      [
        "A mixed number lies between its whole part and the next whole number, because its fraction is more than 0 and less than 1. Knowing this locates it on the line before counting any parts.",
        "带分数位于它的整数部分和下一个整数之间，因为分数部分大于 0 且小于 1。知道这一点，不必数份数就能在数轴上找到大致位置。",
      ],
      (rng) => {
        const a = rng.int(1, 20);
        const d = rng.int(2, 9);
        const n = lowestNumerator(rng, d);
        const upper = rng.bool();
        return whole(
          upper
            ? [
                `$${a}\\frac{${n}}{${d}}$ lies between two whole numbers on a number line. What is the larger one?`,
                `$${a}\\frac{${n}}{${d}}$ 在数轴上位于两个相邻整数之间。较大的是几？`,
              ]
            : [
                `$${a}\\frac{${n}}{${d}}$ lies between two whole numbers on a number line. What is the smaller one?`,
                `$${a}\\frac{${n}}{${d}}$ 在数轴上位于两个相邻整数之间。较小的是几？`,
              ],
          upper ? a + 1 : a,
          upper ? [a, a + 2, d] : [a + 1, a > 1 ? a - 1 : a + 2, n],
          [
            `The fraction is between 0 and 1, so the number is between ${a} and ${a + 1}.`,
            `分数部分在 0 和 1 之间，所以这个数在 ${a} 和 ${a + 1} 之间。`,
          ],
        );
      },
    ),
  ],
  "interpreting-division-problems-as-mixed-numbers": [
    skill(
      "the-whole-part-of-a-quotient",
      ["The whole part of a quotient", "商的整数部分"],
      [
        "When a division becomes a mixed number, the whole part is the quotient and the top of the fraction is the remainder, over the divisor. So $17 \\div 5$ is $3\\frac{2}{5}$.",
        "除法写成带分数时，整数部分是商，分数的分子是余数，分母是除数。所以 $17 \\div 5$ 是 $3\\frac{2}{5}$。",
      ],
      (rng) => {
        const d = rng.int(2, 9);
        const q = rng.int(2, 15);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        const askTop = rng.bool();
        return whole(
          askTop
            ? [
                `Write $${n} \\div ${d}$ as a mixed number with denominator ${d}. What is the top number of its fraction?`,
                `把 $${n} \\div ${d}$ 写成分母是 ${d} 的带分数。分数部分的分子是几？`,
              ]
            : [`Write $${n} \\div ${d}$ as a mixed number. What is its whole part?`, `把 $${n} \\div ${d}$ 写成带分数。整数部分是几？`],
          askTop ? r : q,
          askTop ? [q, d, d - r] : [r, d, q + 1],
          [
            `$${d} \\times ${q} = ${d * q}$ leaves a remainder of ${r}, so the mixed number is $${q}\\frac{${r}}{${d}}$.`,
            `$${d} \\times ${q} = ${d * q}$，余 ${r}，所以带分数是 $${q}\\frac{${r}}{${d}}$。`,
          ],
        );
      },
    ),
  ],
};
