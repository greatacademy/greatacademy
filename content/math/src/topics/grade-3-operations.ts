// 3rd Grade Math: the meaning of multiplication and division, the facts up to
// 10 times 10, the properties, word problems, patterns, rounding and three-digit
// addition and subtraction.

import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import {
  arrayFigure,
  baseTenFigure,
  countersFigure,
  earlyNames,
  earlyPoint,
  earlyThings,
  earlyTopic,
  nearbyWrong,
  numberLineFigure,
} from "../early-grades-kit.ts";
import { numberProblem } from "../problems.ts";
import { pickChoice } from "./grade-4-fractions.ts";

/** whole builds a problem whose answer is a whole number. */
function whole(prompt: readonly [string, string], answer: number, wrong: readonly number[], solution: readonly [string, string]): Problem {
  return numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    form: "integer",
    wrong: nearbyWrong(answer, ...wrong),
    solution: t(solution[0], solution[1]),
  });
}

/** factorPair picks a fact whose first factor comes from the list and whose second runs from 2 to 10. */
function factorPair(rng: Rng, factors: readonly number[]): [number, number] {
  const a = rng.pick(factors);
  const b = rng.int(2, 10);
  return rng.bool() ? [a, b] : [b, a];
}

/** factPoints is a knowledge point that asks for products of the listed factors, both bare and in a word problem. */
function factPoints(prefix: string, factors: readonly number[]) {
  const shown = factors.join(", ");
  return [
    earlyPoint(
      `${prefix}-facts`,
      ["Finding the product", "求积"],
      [
        `Multiplying by ${shown} gets faster when you notice how these facts are built. Each new fact is one more group than the fact before, so you can step up from a fact you already know by adding one more group. Practice until these answers come quickly, because later work leans on them.`,
        `乘 ${shown} 时，留意这些算式是怎样构成的就会更快。每个新算式都比前一个多一组，所以可以从已经会的算式出发，再加一组。要练到能很快说出答案，因为后面的学习都要用到它们。`,
      ],
      (rng) => {
        const [a, b] = factorPair(rng, factors);
        const answer = a * b;
        return whole(
          [`What is $${a} \\times ${b}$?`, `$${a} \\times ${b}$ 等于多少？`],
          answer,
          [a + b, answer + a, answer - b],
          [
            `$${a} \\times ${b}$ means ${a} groups of ${b}, and ${a} groups of ${b} make ${answer}.`,
            `$${a} \\times ${b}$ 表示 ${a} 个 ${b}，${a} 个 ${b} 是 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      `${prefix}-missing-factors`,
      ["Finding a missing factor", "求未知因数"],
      [
        "A multiplication fact can be read with a part missing. Ask how many groups, or how many in each group, would give the product. Skip counting by the known factor until you reach the product tells you the answer, and the number of skips is the missing factor. Multiply to check that it really gives the product.",
        "乘法算式可以缺一部分来读。想一想多少组，或者每组多少个，才能得到这个积。用已知的因数跳着数，一直数到积，跳了几次，未知因数就是几。再乘一下，检验确实能得到这个积。",
      ],
      (rng) => {
        const [a, b] = factorPair(rng, factors);
        const product = a * b;
        return whole(
          [`What number goes in the box? $${a} \\times \\square = ${product}$`, `方框里填几？$${a} \\times \\square = ${product}$`],
          b,
          [product - a, product, a],
          [
            `Count by ${a} until you reach ${product}. That takes ${b} skips, so $${a} \\times ${b} = ${product}$.`,
            `${a} 个 ${a} 地数，数到 ${product}。一共数了 ${b} 次，所以 $${a} \\times ${b} = ${product}$。`,
          ],
        );
      },
    ),
  ];
}

const multiplicationAsEqualGroups = earlyTopic(
  "multiplication-as-equal-groups",
  ["Multiplication as Equal Groups", "乘法表示相同的组"],
  [
    "Read a multiplication as a number of equal groups, and connect it with repeated addition.",
    "把乘法理解成若干相同的组，并与重复相加联系起来。",
  ],
  ["arrays-and-repeated-addition"],
  ["3.OA.A.1"],
  [
    earlyPoint(
      "counting-equal-groups",
      ["Counting equal groups", "数相同的组"],
      [
        "When things come in groups of the same size, you do not need to count them one by one. Multiplication counts them all at once. The first number tells how many groups there are, and the second tells how many are in each group. The answer, the product, is how many there are altogether.",
        "当东西分成大小相同的组时，不需要一个一个地数。乘法一下子就能数出全部。第一个数说明有多少组，第二个数说明每组有多少个。结果，也就是积，说明一共有多少个。",
      ],
      (rng) => {
        const groups = rng.int(2, 9);
        const each = rng.int(2, 9);
        const thing = rng.pick(earlyThings);
        const answer = groups * each;
        return whole(
          [
            `There are ${groups} bags with ${each} ${thing.en} in each bag. How many ${thing.en} are there altogether?`,
            `有 ${groups} 个袋子，每个袋子里有 ${each} ${thing.unit}${thing.zh}。一共有多少${thing.unit}${thing.zh}？`,
          ],
          answer,
          [groups + each],
          [
            `There are ${groups} equal groups of ${each}, so we multiply: $${groups} \\times ${each} = ${answer}$.`,
            `有 ${groups} 个相同的组，每组 ${each} ${thing.unit}，所以用乘法：$${groups} \\times ${each} = ${answer}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "from-repeated-addition-to-multiplication",
      ["From repeated addition to multiplication", "从重复相加到乘法"],
      [
        "Adding the same number again and again is the same as multiplying. Count how many times the number is written: that count is the number of groups, and the number itself is the size of each group. Writing a long sum as a product is shorter, and it also gets the answer much sooner.",
        "同一个数一遍一遍地加，和乘法是一样的。数一数这个数写了几次：这个次数就是组数，这个数本身就是每组的大小。把长长的加法写成乘法更简短，也能更快得到答案。",
      ],
      (rng) => {
        const count = rng.int(3, 7);
        const each = rng.int(2, 9);
        const sum = Array(count).fill(`${each}`).join(" + ");
        const asksFactor = rng.bool();
        return asksFactor
          ? whole(
              [
                `The sum $${sum}$ equals $\\square \\times ${each}$. What number goes in the box?`,
                `$${sum}$ 等于 $\\square \\times ${each}$。方框里填几？`,
              ],
              count,
              [each * count, count + each],
              [
                `The number ${each} is added ${count} times, so the sum is $${count} \\times ${each}$.`,
                `${each} 加了 ${count} 次，所以这个和是 $${count} \\times ${each}$。`,
              ],
            )
          : whole(
              [`Write $${sum}$ as a product and find its value.`, `把 $${sum}$ 写成乘法，并求出它的值。`],
              count * each,
              [count + each],
              [
                `The number ${each} is added ${count} times, so the sum is $${count} \\times ${each} = ${count * each}$.`,
                `${each} 加了 ${count} 次，所以和是 $${count} \\times ${each} = ${count * each}$。`,
              ],
            );
      },
    ),
  ],
);

const multiplicationWithArrays = earlyTopic(
  "multiplication-with-arrays",
  ["Multiplication With Arrays", "用点阵表示乘法"],
  [
    "Use rows and columns to see a product, and see why turning an array keeps the product the same.",
    "用行和列来看积，并明白把点阵转一下积不变。",
  ],
  ["multiplication-as-equal-groups"],
  ["3.OA.A.1", "3.OA.A.3"],
  [
    earlyPoint(
      "counting-an-array",
      ["Counting an array", "数点阵"],
      [
        "An array puts things in straight rows, with the same number in each row. Each row is an equal group, so the number of rows times the number in each row gives the total. Rows go across and columns go up and down. This picture of multiplication comes back later when you study area.",
        "点阵把东西排成整齐的行，每行个数相同。每一行就是一个相同的组，所以行数乘每行的个数就是总数。行是横着的，列是竖着的。这种乘法的图形，以后学面积时还会用到。",
      ],
      (rng) => {
        const rows = rng.int(2, 8);
        const columns = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== rows));
        const answer = rows * columns;
        return {
          ...whole(
            ["How many dots are in this array?", "这个点阵里有多少个点？"],
            answer,
            [rows + columns, rows * 2 + columns * 2],
            [
              `There are ${rows} rows with ${columns} dots in each row, so $${rows} \\times ${columns} = ${answer}$.`,
              `有 ${rows} 行，每行 ${columns} 个点，所以 $${rows} \\times ${columns} = ${answer}$。`,
            ],
          ),
          figure: arrayFigure(rows, columns),
        };
      },
    ),
    earlyPoint(
      "rows-from-the-total",
      ["Rows from the total", "由总数求行数"],
      [
        "If you know how many things are in an array and how many are in each row, you can find the number of rows. Build the array one row at a time and count by the row size until you reach the total. The number of rows you built is the answer, and multiplying checks your count.",
        "如果知道点阵里一共有多少个，每行有多少个，就能求出有多少行。一行一行地摆，按每行的个数数，一直数到总数。摆了几行，答案就是几，再用乘法检验。",
      ],
      (rng) => {
        const rows = rng.int(2, 9);
        const columns = rng.int(2, 9);
        const total = rows * columns;
        const thing = rng.pick(earlyThings);
        return whole(
          [
            `A shelf holds ${total} ${thing.en} in equal rows, with ${columns} in each row. How many rows are there?`,
            `架子上有 ${total} ${thing.unit}${thing.zh}，排成相同的若干行，每行 ${columns} ${thing.unit}。有多少行？`,
          ],
          rows,
          [total - columns, total + columns],
          [
            `Counting by ${columns} reaches ${total} after ${rows} rows, since $${rows} \\times ${columns} = ${total}$.`,
            `按 ${columns} 数，数 ${rows} 行到 ${total}，因为 $${rows} \\times ${columns} = ${total}$。`,
          ],
        );
      },
    ),
  ],
);

const multiplyingByTwoFiveTen = earlyTopic(
  "multiplying-by-2-5-and-10",
  ["Multiplying by 2, 5 and 10", "乘 2、5 和 10"],
  [
    "Know the products of 2, 5 and 10, using skip counting and the patterns in their last digits.",
    "掌握乘 2、5、10 的积，利用跳着数和末位数字的规律。",
  ],
  ["multiplication-with-arrays"],
  ["3.OA.C.7"],
  factPoints("twos-fives-and-tens", [2, 5, 10]),
);

const multiplyingByThreeFour = earlyTopic(
  "multiplying-by-3-and-4",
  ["Multiplying by 3 and 4", "乘 3 和 4"],
  ["Know the products of 3 and 4, by building on doubles and adding one more group.", "掌握乘 3 和 4 的积：在二倍的基础上再加一组。"],
  ["multiplying-by-2-5-and-10"],
  ["3.OA.C.7"],
  factPoints("threes-and-fours", [3, 4]),
);

const multiplyingBySixToNine = earlyTopic(
  "multiplying-by-6-7-8-and-9",
  ["Multiplying by 6, 7, 8 and 9", "乘 6、7、8 和 9"],
  ["Know the harder products, by building them from facts already learned.", "掌握较难的积：用已经学过的算式来构成。"],
  ["multiplying-by-3-and-4"],
  ["3.OA.C.7"],
  factPoints("sixes-to-nines", [6, 7, 8, 9]),
);

const multiplyingByZeroAndOne = earlyTopic(
  "multiplying-by-0-and-1",
  ["Multiplying by 0 and 1", "乘 0 和 1"],
  ["See why a product with 0 is 0, and a product with 1 keeps the other number.", "明白为什么和 0 相乘得 0，和 1 相乘得原来的数。"],
  ["multiplying-by-2-5-and-10"],
  ["3.OA.B.5"],
  [
    earlyPoint(
      "products-with-zero-and-one",
      ["Products with 0 and 1", "含 0 和 1 的积"],
      [
        "Think of groups. If each of several groups holds nothing, then there is nothing altogether, so multiplying by zero gives zero. One group of some number is just that number, so multiplying by one changes nothing. These two facts work for every number, however large it is, so no times table is needed.",
        "想一想组。如果几组里每组都没有东西，那一共也没有东西，所以乘 0 得 0。一组某个数还是那个数，所以乘 1 什么也没变。这两条对每个数都成立，不管多大，都不需要乘法表。",
      ],
      (rng) => {
        const n = rng.int(2, 999);
        const zero = rng.bool();
        const first = rng.bool();
        const answer = zero ? 0 : n;
        const k = zero ? 0 : 1;
        const shown = first ? `${n} \\times ${k}` : `${k} \\times ${n}`;
        return whole(
          [`What is $${shown}$?`, `$${shown}$ 等于多少？`],
          answer,
          [n + k, n + 1, 1, zero ? n : 0],
          zero
            ? [`Any number of groups of 0, or 0 groups of any number, make 0.`, `任意多组 0，或者 0 组任意的数，都是 0。`]
            : [`One group of ${n}, or ${n} groups of one, make ${n}.`, `一组 ${n}，或者 ${n} 组 1，都是 ${n}。`],
        );
      },
    ),
    earlyPoint(
      "choosing-the-factor-zero-or-one",
      ["Choosing the factor 0 or 1", "选择因数 0 或 1"],
      [
        "When a product equals the other factor, the missing factor must be one, because only one group leaves a number as it is. When a product equals zero, and the other factor is not zero, then the missing factor must be zero. Noticing the size of the product tells you which case you have.",
        "当积等于另一个因数时，未知因数一定是 1，因为只有一组才能让一个数保持不变。当积等于 0，而另一个因数不是 0 时，未知因数一定是 0。看一看积的大小，就知道是哪种情况。",
      ],
      (rng) => {
        const n = rng.int(2, 500);
        const zero = rng.bool();
        const answer = zero ? 0 : 1;
        const product = zero ? 0 : n;
        return whole(
          [`What number goes in the box? $${n} \\times \\square = ${product}$`, `方框里填几？$${n} \\times \\square = ${product}$`],
          answer,
          [n, n + 1, 2, 10],
          zero
            ? [`The product is 0, and only 0 groups of ${n} make 0.`, `积是 0，只有 0 组 ${n} 才是 0。`]
            : [`The product is ${n} itself, and one group of ${n} is ${n}.`, `积就是 ${n}，一组 ${n} 就是 ${n}。`],
        );
      },
    ),
  ],
);

const propertiesOfMultiplication = earlyTopic(
  "properties-of-multiplication",
  ["Order and Grouping in Multiplication", "乘法的顺序与结合"],
  ["Change the order or the grouping of factors to make a product easier.", "改变因数的顺序或组合方式，使计算更容易。"],
  ["multiplying-by-3-and-4"],
  ["3.OA.B.5"],
  [
    earlyPoint(
      "swapping-the-factors",
      ["Swapping the factors", "交换因数"],
      [
        "Turn an array on its side and its rows become columns, but no dots appear or disappear. So two factors can swap places without changing the product. This cuts the number of facts to learn nearly in half, since knowing a fact one way means knowing it the other way too.",
        "把点阵转过来，行就变成了列，但点没有增加也没有减少。所以两个因数可以交换位置，积不变。这几乎让要记的算式减少一半，因为知道一种写法就等于知道了另一种。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
        const asksBox = rng.bool();
        return asksBox
          ? whole(
              [
                `What number goes in the box? $${a} \\times ${b} = ${b} \\times \\square$`,
                `方框里填几？$${a} \\times ${b} = ${b} \\times \\square$`,
              ],
              a,
              [b, a * b, a + b],
              [`Swapping the factors keeps the product, so the box holds ${a}.`, `交换因数，积不变，所以方框里是 ${a}。`],
            )
          : whole(
              [
                `Given that $${a} \\times ${b} = ${a * b}$, what is $${b} \\times ${a}$?`,
                `已知 $${a} \\times ${b} = ${a * b}$，$${b} \\times ${a}$ 等于多少？`,
              ],
              a * b,
              [a + b, a * b + a],
              [`The factors have only swapped places, so the product is still ${a * b}.`, `因数只是交换了位置，所以积还是 ${a * b}。`],
            );
      },
    ),
    earlyPoint(
      "grouping-three-factors",
      ["Grouping three factors", "组合三个因数"],
      [
        "With three factors, you may multiply any two of them first, and the product does not change. So look for a pair that is easy to work with, especially one that makes ten. Multiply this pair first, and then multiply by the factor that is left. Choosing well turns a hard product into an easy one.",
        "三个因数相乘时，可以先乘其中任意两个，积不变。所以要找容易计算的一对，特别是能得 10 的一对。先乘这一对，再乘剩下的因数。选得好，难题就变容易了。",
      ],
      (rng) => {
        const [a, b] = rng.pick([
          [2, 5],
          [5, 2],
          [2, 3],
          [3, 2],
          [2, 4],
          [4, 2],
          [3, 3],
        ]) as [number, number];
        const c = rng.int(2, 9);
        const inFront = rng.bool();
        const shown = inFront ? `${c} \\times ${a} \\times ${b}` : `${a} \\times ${c} \\times ${b}`;
        const answer = a * b * c;
        return whole(
          [`What is $${shown}$?`, `$${shown}$ 等于多少？`],
          answer,
          [a + b + c, a * b + c, a * c + b],
          [
            `Multiply $${a} \\times ${b} = ${a * b}$ first. Then $${a * b} \\times ${c} = ${answer}$.`,
            `先算 $${a} \\times ${b} = ${a * b}$。再算 $${a * b} \\times ${c} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const splittingAFactor = earlyTopic(
  "splitting-a-factor-to-multiply",
  ["Splitting a Factor to Multiply", "拆开因数来乘"],
  ["Break a factor into two easier parts, multiply each, and add the results.", "把一个因数拆成两个容易的部分，分别相乘，再把结果相加。"],
  ["multiplying-by-6-7-8-and-9"],
  ["3.OA.B.5", "3.MD.C.7"],
  [
    earlyPoint(
      "the-missing-part-of-a-split",
      ["The missing part of a split", "拆分中缺少的部分"],
      [
        "A hard fact can be built from two easy ones. Eight groups of a number are five groups together with three more groups. So you may split one factor into two parts, as long as the parts add up to it. Both parts are multiplied by the other factor, and neither may be left out.",
        "一个难的算式可以由两个容易的算式组成。8 组某个数就是 5 组再加 3 组。所以可以把一个因数拆成两部分，只要这两部分加起来等于它。两部分都要乘另一个因数，哪个也不能漏掉。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const big = rng.int(6, 9);
        const part = rng.pick([2, 5]);
        const rest = big - part;
        return whole(
          [
            `What number goes in the box? $${a} \\times ${big} = ${a} \\times ${part} + ${a} \\times \\square$`,
            `方框里填几？$${a} \\times ${big} = ${a} \\times ${part} + ${a} \\times \\square$`,
          ],
          rest,
          [big, part, a, big + part],
          [
            `Since ${big} is ${part} and ${rest} together, the box holds ${rest}.`,
            `因为 ${big} 由 ${part} 和 ${rest} 组成，所以方框里是 ${rest}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "multiplying-by-splitting-a-teen-factor",
      ["Multiplying by a number past ten", "乘大于十的数"],
      [
        "Splitting works for factors greater than ten as well. Break the larger factor into ten and what is left. Multiply each of those parts, and add the two answers. Ten times a number is quick, so only one small fact needs any thought. This same idea is the heart of multiplying large numbers on paper.",
        "拆分也适用于大于十的因数。把较大的因数拆成 10 和剩下的部分。分别相乘，再把两个答案相加。乘 10 很快，所以只有一个小算式需要想一想。这个想法正是以后笔算大数乘法的核心。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const rest = rng.int(1, 9);
        const big = 10 + rest;
        const answer = a * big;
        return whole(
          [`Split ${big} into 10 and ${rest} to find $${a} \\times ${big}$.`, `把 ${big} 拆成 10 和 ${rest}，求 $${a} \\times ${big}$。`],
          answer,
          [a * 10, a + big, a * rest, a * 10 + rest],
          [
            `$${a} \\times 10 = ${a * 10}$ and $${a} \\times ${rest} = ${a * rest}$. Adding them gives ${answer}.`,
            `$${a} \\times 10 = ${a * 10}$，$${a} \\times ${rest} = ${a * rest}$。相加得 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const multiplyingByMultiplesOfTen = earlyTopic(
  "multiplying-by-multiples-of-10",
  ["Multiplying by Multiples of 10", "乘整十数"],
  ["Multiply a one-digit number by 10, 20, up to 90, using a known fact and place value.", "用已知的算式和数位，把一位数乘 10、20……90。"],
  ["multiplying-by-6-7-8-and-9"],
  ["3.NBT.A.3"],
  [
    earlyPoint(
      "products-with-a-multiple-of-ten",
      ["Products with a multiple of ten", "乘整十数的积"],
      [
        "A multiple of ten is a number of tens: 40 is 4 tens. So 3 times 40 is 3 groups of 4 tens, which makes 12 tens. Use the basic fact to count the tens, and then write the result as a number. The zero is there because the answer counts tens, and not because of a rule about zeros.",
        "整十数就是若干个十：40 是 4 个十。所以 3 乘 40 就是 3 组 4 个十，也就是 12 个十。用基本算式数出有多少个十，再把结果写成数。末尾的 0 是因为答案数的是十，而不是因为什么关于零的规定。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const tens = rng.int(2, 9);
        const answer = a * tens * 10;
        return whole(
          [`What is $${a} \\times ${tens * 10}$?`, `$${a} \\times ${tens * 10}$ 等于多少？`],
          answer,
          [a * tens, answer * 10, a + tens * 10, answer + 10],
          [
            `$${a} \\times ${tens}$ tens is ${a * tens} tens, which is ${answer}.`,
            `$${a} \\times ${tens}$ 个十是 ${a * tens} 个十，也就是 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "word-problems-with-multiples-of-ten",
      ["Word problems with multiples of ten", "整十数的应用题"],
      [
        "Packs and boxes often hold 10, 20 or 50 things, so everyday problems use these products. Find how many groups there are and how many are in each group. Then use a basic fact to count the tens. Saying the answer in tens first, such as 18 tens, makes it harder to lose or add a zero.",
        "一包一盒常常装 10、20 或 50 个东西，所以日常问题会用到这样的乘法。找出有多少组、每组多少个。再用基本算式数出有多少个十。先说出有多少个十，比如 18 个十，就不容易少写或多写一个 0。",
      ],
      (rng) => {
        const boxes = rng.int(2, 9);
        const tens = rng.int(2, 9);
        const thing = rng.pick(earlyThings);
        const each = tens * 10;
        const answer = boxes * each;
        return whole(
          [
            `A store has ${boxes} boxes with ${each} ${thing.en} in each box. How many ${thing.en} does it have?`,
            `商店有 ${boxes} 箱${thing.zh}，每箱 ${each} ${thing.unit}。一共有多少${thing.unit}${thing.zh}？`,
          ],
          answer,
          [boxes * tens, boxes + each, answer * 10],
          [
            `There are ${boxes} groups of ${tens} tens, which is ${boxes * tens} tens, or ${answer}.`,
            `一共是 ${boxes} 组 ${tens} 个十，也就是 ${boxes * tens} 个十，即 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const divisionAsSharing = earlyTopic(
  "division-as-sharing",
  ["Division as Sharing", "除法表示平均分"],
  ["Share a number of things equally, and find how many each group gets.", "把一些东西平均分，求每组得到多少。"],
  ["multiplication-with-arrays"],
  ["3.OA.A.2"],
  [
    earlyPoint(
      "sharing-into-equal-groups",
      ["Sharing into equal groups", "平均分成几组"],
      [
        "Sharing fairly means every group gets the same number, with nothing left over. Division tells how many each group gets. Picture handing things out one at a time, once around all the groups, again and again until none are left. The number of things each group ends up with is the answer to the division.",
        "公平地分，就是每组得到的一样多，也没有剩余。除法告诉我们每组得到多少。想象一个一个地发，每组发一个，一轮又一轮，直到发完。每组最后得到几个，除法的答案就是几。",
      ],
      (rng) => {
        const groups = rng.int(2, 9);
        const each = rng.int(2, 9);
        const total = groups * each;
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        return whole(
          [
            `${name} shares ${total} ${thing.en} equally among ${groups} friends. How many does each friend get?`,
            `${name} 把 ${total} ${thing.unit}${thing.zh}平均分给 ${groups} 个朋友。每个朋友得到多少${thing.unit}？`,
          ],
          each,
          [total - groups, total + groups, groups],
          [
            `$${total} \\div ${groups} = ${each}$, because ${groups} groups of ${each} make ${total}.`,
            `$${total} \\div ${groups} = ${each}$，因为 ${groups} 组 ${each} 是 ${total}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "reading-a-share-from-a-picture",
      ["Reading a share from a picture", "从图中读出平均分"],
      [
        "A picture of counters can show a division. Each row stands for one group, and the counters in a row are one group's share. To check a division, count the rows and the counters in each row, and be sure the rows are all the same length. The whole picture then shows the number being divided.",
        "圆片图可以表示除法。每一行代表一组，一行里的圆片就是一组分到的。要检验除法，就数一数行数和每行的个数，并确认每行一样长。整张图表示的就是被除的数。",
      ],
      (rng) => {
        const rows = rng.int(2, 6);
        const each = rng.int(2, 7);
        const total = rows * each;
        return {
          ...whole(
            [
              `The ${total} counters are shared equally into ${rows} rows, as shown. What is $${total} \\div ${rows}$?`,
              `如图，${total} 个圆片平均分成 ${rows} 行。$${total} \\div ${rows}$ 等于多少？`,
            ],
            each,
            [total - rows, rows],
            [
              `Each of the ${rows} rows holds ${each} counters, so $${total} \\div ${rows} = ${each}$.`,
              `${rows} 行中每行有 ${each} 个圆片，所以 $${total} \\div ${rows} = ${each}$。`,
            ],
          ),
          figure: countersFigure(total, each),
        };
      },
    ),
  ],
);

const divisionAsGrouping = earlyTopic(
  "division-as-making-groups",
  ["Division as Making Groups", "除法表示分组"],
  ["Find how many groups of a given size can be made.", "求可以分成多少个大小一定的组。"],
  ["division-as-sharing"],
  ["3.OA.A.2"],
  [
    earlyPoint(
      "how-many-groups",
      ["How many groups", "可以分几组"],
      [
        "Division answers a second question. When the size of each group is known, it tells how many groups can be made. Take away one group at a time and count how many times you can do it. Both kinds of problem are written in the same way, but it helps to picture which question is being asked.",
        "除法还回答另一个问题。知道每组的大小时，它告诉我们可以分成多少组。每次拿走一组，数一数可以拿几次。这两种问题写法相同，但在脑子里想清楚问的是哪一种会有帮助。",
      ],
      (rng) => {
        const each = rng.int(2, 9);
        const groups = rng.int(2, 9);
        const total = each * groups;
        const thing = rng.pick(earlyThings);
        return whole(
          [
            `There are ${total} ${thing.en}. Each bag holds ${each} of them. How many bags are needed for all of them?`,
            `有 ${total} ${thing.unit}${thing.zh}。每个袋子装 ${each} ${thing.unit}。装完需要多少个袋子？`,
          ],
          groups,
          [total - each, total + each, each],
          [
            `$${total} \\div ${each} = ${groups}$, because ${groups} bags of ${each} hold ${total}.`,
            `$${total} \\div ${each} = ${groups}$，因为 ${groups} 袋、每袋 ${each} ${thing.unit}，一共 ${total} ${thing.unit}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "division-by-repeated-subtraction",
      ["Division by repeated subtraction", "用连减做除法"],
      [
        "Taking away the same number again and again until nothing is left is another way to see division. Each time you subtract, you make one more group. So the number of subtractions is the quotient. A number line shows this as equal jumps backward from the starting number all the way down to zero.",
        "一次又一次减去同一个数，直到减完，是看待除法的另一种方式。每减一次，就多分出一组。所以减的次数就是商。在数轴上，这就是从开始的数向左等距地跳，一直跳到 0。",
      ],
      (rng) => {
        const each = rng.int(2, 6);
        const jumps = rng.int(2, 8);
        const total = each * jumps;
        return {
          ...whole(
            [
              `On the number line, start at ${total} and jump back by ${each} each time. How many jumps reach 0?`,
              `在数轴上，从 ${total} 开始，每次向回跳 ${each}。跳多少次到 0？`,
            ],
            jumps,
            [total - each, each],
            [
              `Counting back by ${each} from ${total} reaches 0 after ${jumps} jumps, so $${total} \\div ${each} = ${jumps}$.`,
              `从 ${total} 开始 ${each} 个 ${each} 个地往回数，跳 ${jumps} 次到 0，所以 $${total} \\div ${each} = ${jumps}$。`,
            ],
          ),
          figure: numberLineFigure(0, total, each, total),
        };
      },
    ),
  ],
);

const relatingMultiplicationDivision = earlyTopic(
  "relating-multiplication-and-division",
  ["Relating Multiplication and Division", "乘法和除法的关系"],
  ["Use a multiplication fact to find a quotient, and write the facts that belong together.", "用乘法算式求商，并写出相关的一组算式。"],
  ["division-as-making-groups", "multiplying-by-3-and-4"],
  ["3.OA.B.6", "3.OA.A.4"],
  [
    earlyPoint(
      "a-quotient-from-a-product",
      ["A quotient from a product", "由积求商"],
      [
        "Division undoes multiplication. To divide, ask what number times the divisor gives the number being divided. So a division can be read as a multiplication with a missing factor, and every multiplication fact you know also gives you two division facts. This is the fastest way to divide without counting.",
        "除法是乘法的逆运算。做除法时，想一想什么数乘除数得到被除数。所以除法可以读成缺一个因数的乘法，你知道的每个乘法算式还给出了两个除法算式。这是不用数就能做除法的最快办法。",
      ],
      (rng) => {
        const a = rng.int(2, 10);
        const b = rng.int(2, 10);
        const product = a * b;
        return whole(
          [
            `Given that $${a} \\times ${b} = ${product}$, what is $${product} \\div ${a}$?`,
            `已知 $${a} \\times ${b} = ${product}$，$${product} \\div ${a}$ 等于多少？`,
          ],
          b,
          [product - a, product + a, a === b ? a + 1 : a],
          [
            `Division undoes multiplication: $${a} \\times ${b} = ${product}$, so $${product} \\div ${a} = ${b}$.`,
            `除法是乘法的逆运算：$${a} \\times ${b} = ${product}$，所以 $${product} \\div ${a} = ${b}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "the-unknown-in-a-division",
      ["The unknown in a division", "除法中的未知数"],
      [
        "A box can stand for any number in a division, even the first one. If the box is the number being divided, multiply the other two numbers to find it. If the box is the divisor, then ask what number the first one is split into. Rewriting the sentence as a multiplication makes each case clear.",
        "方框可以代表除法中的任何一个数，甚至是第一个数。如果方框是被除数，就把另外两个数相乘。如果方框是除数，就想一想第一个数被分成了多少份。把算式改写成乘法，每种情况都很清楚。",
      ],
      (rng) => {
        const divisor = rng.int(2, 9);
        const quotient = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== divisor));
        const total = divisor * quotient;
        const first = rng.bool();
        return first
          ? whole(
              [
                `What number goes in the box? $\\square \\div ${divisor} = ${quotient}$`,
                `方框里填几？$\\square \\div ${divisor} = ${quotient}$`,
              ],
              total,
              [divisor + quotient, divisor, quotient],
              [
                `The number being divided is the product of the other two: $${divisor} \\times ${quotient} = ${total}$.`,
                `被除数是另外两个数的积：$${divisor} \\times ${quotient} = ${total}$。`,
              ],
            )
          : whole(
              [
                `What number goes in the box? $${total} \\div \\square = ${quotient}$`,
                `方框里填几？$${total} \\div \\square = ${quotient}$`,
              ],
              divisor,
              [total - quotient, quotient, total],
              [
                `The sentence says $\\square \\times ${quotient} = ${total}$, so the box holds ${divisor}.`,
                `这个算式就是 $\\square \\times ${quotient} = ${total}$，所以方框里是 ${divisor}。`,
              ],
            );
      },
    ),
  ],
);

const divisionFacts = earlyTopic(
  "division-facts-to-100",
  ["Division Facts to 100", "100 以内的除法"],
  ["Know the quotients that come from the facts up to 10 times 10.", "掌握由 10 乘 10 以内的算式得到的商。"],
  ["relating-multiplication-and-division", "multiplying-by-6-7-8-and-9"],
  ["3.OA.C.7"],
  [
    earlyPoint(
      "finding-a-quotient",
      ["Finding a quotient", "求商"],
      [
        "To find a quotient quickly, think of the matching multiplication fact and not of the division. Say the divisor times what gives the number being divided. The larger facts, with factors from six to nine, deserve the most practice. When the answer comes without counting, you know that fact well enough to use in longer problems.",
        "要很快求出商，就想对应的乘法算式，而不是除法本身。说一说除数乘几得被除数。因数在 6 到 9 之间的较大算式最需要练习。当不用数就能说出答案时，这个算式就熟到可以用在更长的题目中了。",
      ],
      (rng) => {
        const divisor = rng.int(2, 10);
        const answer = rng.int(2, 10);
        const total = divisor * answer;
        return whole(
          [`What is $${total} \\div ${divisor}$?`, `$${total} \\div ${divisor}$ 等于多少？`],
          answer,
          [total - divisor, divisor + answer],
          [
            `$${divisor} \\times ${answer} = ${total}$, so $${total} \\div ${divisor} = ${answer}$.`,
            `$${divisor} \\times ${answer} = ${total}$，所以 $${total} \\div ${divisor} = ${answer}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "dividing-with-zero-one-and-itself",
      ["Dividing with 0, 1 and the number itself", "含 0、1 和自身的除法"],
      [
        "A few divisions follow simple rules. A number divided by one stays the same, as one group gets everything. A number divided by itself is one. Zero divided by any other number is zero, since nothing is being shared. Dividing by zero, however, has no answer, because no number of empty groups can make anything.",
        "有几种除法遵循简单的规律。一个数除以 1 还是它本身，因为一组得到全部。一个数除以它本身得 1。0 除以任何别的数都得 0，因为没有东西可分。但是除以 0 没有答案，因为多少个空组也凑不出任何东西。",
      ],
      (rng) => {
        const n = rng.int(2, 200);
        const kind = rng.int(0, 2);
        const shown = kind === 0 ? `${n} \\div 1` : kind === 1 ? `${n} \\div ${n}` : `0 \\div ${n}`;
        const answer = kind === 0 ? n : kind === 1 ? 1 : 0;
        return whole(
          [`What is $${shown}$?`, `$${shown}$ 等于多少？`],
          answer,
          [n, 0, 1, n + 1, n - 1],
          kind === 0
            ? [`One group gets all ${n}, so the answer is ${n}.`, `一组得到全部 ${n} 个，所以答案是 ${n}。`]
            : kind === 1
              ? [`${n} things in groups of ${n} make exactly 1 group.`, `${n} 个东西，每组 ${n} 个，正好是 1 组。`]
              : [`There is nothing to share, so each group gets 0.`, `没有东西可分，所以每组得 0。`],
        );
      },
    ),
  ],
);

const multiplyDivideWordProblems = earlyTopic(
  "multiplication-and-division-word-problems",
  ["Multiplication and Division Word Problems", "乘除法应用题"],
  ["Decide whether a situation calls for multiplying or dividing, and solve it.", "判断一个情境该用乘法还是除法，并解决问题。"],
  ["division-facts-to-100"],
  ["3.OA.A.3"],
  [
    earlyPoint(
      "multiply-or-divide",
      ["Multiply or divide", "乘还是除"],
      [
        "In an equal-groups story there are three numbers: the number of groups, the size of each group, and the total. If the total is missing, multiply. If the total is known and one of the others is missing, divide. So before you calculate, find out which of the three numbers the question is asking for.",
        "在相同的组的故事里有三个数：组数、每组的大小和总数。如果总数不知道，就用乘法。如果知道总数，缺的是另外两个中的一个，就用除法。所以计算之前，先看清问题问的是这三个数中的哪一个。",
      ],
      (rng) => {
        const a = rng.int(2, 10);
        const b = rng.int(2, 10);
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        const multiply = rng.bool();
        return multiply
          ? whole(
              [
                `${name} fills ${a} boxes with ${b} ${thing.en} each. How many ${thing.en} is that?`,
                `${name} 装了 ${a} 盒${thing.zh}，每盒 ${b} ${thing.unit}。一共有多少${thing.unit}？`,
              ],
              a * b,
              [a + b],
              [
                `The total is missing, so multiply: $${a} \\times ${b} = ${a * b}$.`,
                `总数不知道，所以用乘法：$${a} \\times ${b} = ${a * b}$。`,
              ],
            )
          : whole(
              [
                `${name} puts ${a * b} ${thing.en} into ${a} equal boxes. How many ${thing.en} go in each box?`,
                `${name} 把 ${a * b} ${thing.unit}${thing.zh}平均放进 ${a} 个盒子。每盒放多少${thing.unit}？`,
              ],
              b,
              [a * b - a, a * b + a, a * b * a],
              [
                `The total is known and the size of a group is missing, so divide: $${a * b} \\div ${a} = ${b}$.`,
                `知道总数，缺每组的大小，所以用除法：$${a * b} \\div ${a} = ${b}$。`,
              ],
            );
      },
    ),
    earlyPoint(
      "times-as-many",
      ["Times as many", "几倍"],
      [
        "Saying that one amount is some number of times as many as another is a comparison, and it also calls for multiplication. Three times as many means three groups the size of the smaller amount. Going the other way, if the larger amount and the times are known, then dividing gives the smaller amount.",
        "说一个量是另一个量的几倍，是一种比较，也要用乘法。3 倍就是 3 组和较小的量一样大的组。反过来，如果知道较大的量和倍数，用除法就得到较小的量。",
      ],
      (rng) => {
        const small = rng.int(2, 10);
        const times = rng.int(2, 9);
        const thing = rng.pick(earlyThings);
        const [p, q] = rng.pick(earlyNames.flatMap((a) => earlyNames.filter((b) => b !== a).map((b) => [a, b] as const)));
        const forward = rng.bool();
        return forward
          ? whole(
              [
                `${p} has ${small} ${thing.en}. ${q} has ${times} times as many. How many does ${q} have?`,
                `${p} 有 ${small} ${thing.unit}${thing.zh}。${q} 的${thing.zh}是 ${p} 的 ${times} 倍。${q} 有多少${thing.unit}？`,
              ],
              small * times,
              [small + times],
              [
                `${times} times as many as ${small} is $${times} \\times ${small} = ${small * times}$.`,
                `${small} 的 ${times} 倍是 $${times} \\times ${small} = ${small * times}$。`,
              ],
            )
          : whole(
              [
                `${q} has ${small * times} ${thing.en}, which is ${times} times as many as ${p} has. How many does ${p} have?`,
                `${q} 有 ${small * times} ${thing.unit}${thing.zh}，是 ${p} 的 ${times} 倍。${p} 有多少${thing.unit}？`,
              ],
              small,
              [small * times - times, small * times + times, small * times * times],
              [
                `Dividing undoes the times: $${small * times} \\div ${times} = ${small}$.`,
                `用除法还原倍数：$${small * times} \\div ${times} = ${small}$。`,
              ],
            );
      },
    ),
  ],
);

const twoStepWordProblems = earlyTopic(
  "two-step-word-problems-with-all-operations",
  ["Two-Step Word Problems", "两步应用题"],
  ["Solve problems that take two steps, using a letter for the unknown when it helps.", "解决需要两步的问题，必要时用字母表示未知数。"],
  ["multiplication-and-division-word-problems"],
  ["3.OA.D.8"],
  [
    earlyPoint(
      "groups-and-then-more",
      ["Groups and then more", "先分组再增减"],
      [
        "Some problems need two steps. First work out the part that the story tells you about groups, and then use it to add or take away. Write down the result of the first step so that you do not lose it. At the end, read the question again to be sure you have answered what it asks.",
        "有些问题需要两步。先算出故事中关于组的那部分，再用它来加或减。把第一步的结果写下来，以免忘记。最后再读一遍问题，确认回答的就是它所问的。",
      ],
      (rng) => {
        const groups = rng.int(2, 9);
        const each = rng.int(2, 9);
        const extra = rng.int(2, 15);
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        const lost = rng.bool() && groups * each > extra;
        const answer = lost ? groups * each - extra : groups * each + extra;
        return whole(
          lost
            ? [
                `${name} has ${groups} packs of ${each} ${thing.en}, and gives away ${extra} of them. How many ${thing.en} are left?`,
                `${name} 有 ${groups} 包${thing.zh}，每包 ${each} ${thing.unit}，送出了 ${extra} ${thing.unit}。还剩多少${thing.unit}？`,
              ]
            : [
                `${name} has ${groups} packs of ${each} ${thing.en}, and ${extra} more loose ones. How many ${thing.en} is that altogether?`,
                `${name} 有 ${groups} 包${thing.zh}，每包 ${each} ${thing.unit}，另外还有 ${extra} ${thing.unit}散的。一共有多少${thing.unit}？`,
              ],
          answer,
          [groups * each, groups + each + extra, groups * (each + extra)],
          [
            `First, $${groups} \\times ${each} = ${groups * each}$. Then $${groups * each} ${lost ? "-" : "+"} ${extra} = ${answer}$.`,
            `先算 $${groups} \\times ${each} = ${groups * each}$。再算 $${groups * each} ${lost ? "-" : "+"} ${extra} = ${answer}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "sharing-what-is-left",
      ["Sharing what is left", "平均分剩下的"],
      [
        "In this kind of problem, some of the total is taken away before the rest is shared. The order matters. Subtract first to find how many are left to share, and only then divide. Dividing the whole amount, and then subtracting, tells a different story and gives a different answer. Using a letter for the unknown can keep it clear.",
        "在这类问题中，先拿走总数的一部分，再把剩下的平均分。顺序很重要。先减，算出还剩多少要分，然后才除。先除总数再减，讲的是另一个故事，答案也不同。用字母表示未知数可以把关系理清楚。",
      ],
      (rng) => {
        const groups = rng.int(2, 9);
        const each = rng.int(2, 9);
        const kept = rng.int(2, 12);
        const total = groups * each + kept;
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        return whole(
          [
            `${name} has ${total} ${thing.en}, keeps ${kept} of them, and shares the rest equally among ${groups} friends. How many does each friend get?`,
            `${name} 有 ${total} ${thing.unit}${thing.zh}，自己留下 ${kept} ${thing.unit}，把其余的平均分给 ${groups} 个朋友。每个朋友得到多少${thing.unit}？`,
          ],
          each,
          [total - kept, groups * each, total - groups],
          [
            `First, $${total} - ${kept} = ${total - kept}$ are left to share. Then $${total - kept} \\div ${groups} = ${each}$.`,
            `先算 $${total} - ${kept} = ${total - kept}$，这是要分的。再算 $${total - kept} \\div ${groups} = ${each}$。`,
          ],
        );
      },
    ),
  ],
);

const orderOfOperationsEarly = earlyTopic(
  "expressions-with-two-operations",
  ["Expressions With Two Operations", "含两种运算的算式"],
  ["Multiply or divide before adding or subtracting, unless parentheses say otherwise.", "先乘除后加减，除非括号另有说明。"],
  ["multiplying-by-3-and-4"],
  ["3.OA.D.8"],
  [
    earlyPoint(
      "multiplying-before-adding",
      ["Multiplying before adding", "先乘后加"],
      [
        "When an expression has both a product and a sum, everyone must work in the same order to get the same answer. The rule is to multiply or divide first, and then add or subtract, working from left to right. A story explains this: groups must be counted before extras can be added to them.",
        "当算式里既有乘法又有加法时，大家必须按同样的顺序计算，才能得到同样的答案。规定是先乘除，后加减，从左到右。一个故事可以说明：要先数出各组有多少，才能再加上多出来的。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const first = rng.bool();
        const shown = first ? `${b} \\times ${c} + ${a}` : `${a} + ${b} \\times ${c}`;
        const answer = a + b * c;
        return whole(
          [`What is $${shown}$?`, `$${shown}$ 等于多少？`],
          answer,
          [(a + b) * c, b * (c + a), a + b + c],
          [
            `Multiply first: $${b} \\times ${c} = ${b * c}$. Then add ${a} to get ${answer}.`,
            `先算乘法：$${b} \\times ${c} = ${b * c}$。再加 ${a}，得 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "parentheses-come-first",
      ["Parentheses come first", "先算括号里的"],
      [
        "Parentheses change the order, because whatever is inside them is worked out first. The same three numbers can have different values with and without parentheses. They are useful when a story needs a sum or difference to be found before it is multiplied or shared, such as adding two amounts and then doubling the total.",
        "括号会改变顺序，因为括号里的要先算。同样的三个数，有括号和没括号的值可能不同。当一个故事要先求和或差，再去乘或分时，括号就很有用，比如先把两个量相加，再把总数乘二。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const answer = (a + b) * c;
        return whole(
          [`What is $(${a} + ${b}) \\times ${c}$?`, `$(${a} + ${b}) \\times ${c}$ 等于多少？`],
          answer,
          [a + b * c, a * c + b, a + b + c],
          [
            `The parentheses come first: $${a} + ${b} = ${a + b}$. Then $${a + b} \\times ${c} = ${answer}$.`,
            `先算括号：$${a} + ${b} = ${a + b}$。再算 $${a + b} \\times ${c} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const arithmeticPatterns = earlyTopic(
  "arithmetic-patterns",
  ["Number Patterns", "数的规律"],
  ["Find and explain patterns in sums and products, including even and odd numbers.", "找出并说明和与积中的规律，包括奇数和偶数。"],
  ["multiplying-by-3-and-4"],
  ["3.OA.D.9"],
  [
    earlyPoint(
      "the-next-number-in-a-pattern",
      ["The next number in a pattern", "规律中的下一个数"],
      [
        "A number pattern follows a rule, such as adding the same number each time. Look at how each number differs from the one before it. If the difference stays the same, then the rule is to add that difference. Apply it again to find the next number, and check that it works for the numbers you were given.",
        "数的规律遵循一条规则，比如每次都加同一个数。看一看每个数和前一个数相差多少。如果相差的数不变，规则就是加这个差。再用一次就得到下一个数，并检验它对已给的数都成立。",
      ],
      (rng) => {
        const step = rng.int(2, 12);
        const start = rng.int(1, 40);
        const terms = [0, 1, 2, 3].map((i) => start + i * step);
        const answer = start + 4 * step;
        return whole(
          [`What number comes next? $${terms.join(",\\ ")},\\ \\square$`, `下一个数是几？$${terms.join(",\\ ")},\\ \\square$`],
          answer,
          [answer + step, (terms[3] as number) + 1, (terms[3] as number) + step + 1],
          [
            `Each number is ${step} more than the one before, so the next is $${terms[3]} + ${step} = ${answer}$.`,
            `每个数都比前一个多 ${step}，所以下一个是 $${terms[3]} + ${step} = ${answer}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "even-and-odd-products",
      ["Even and odd products", "积的奇偶"],
      [
        "An even number can be split into two equal parts, while an odd number has one left over. A product is odd only when both of its factors are odd. If even one factor is even, the whole product is even, since it is a number of equal pairs. So you can tell without finding the product at all.",
        "偶数可以分成相等的两部分，奇数则会多出一个。只有两个因数都是奇数时，积才是奇数。只要有一个因数是偶数，整个积就是偶数，因为它可以看成若干对。所以不用算出积就能判断。",
      ],
      (rng) => {
        const a = rng.int(11, 99);
        const b = rng.int(11, 99);
        const odd = a % 2 === 1 && b % 2 === 1;
        const even = t("Even", "偶数");
        const oddText = t("Odd", "奇数");
        return pickChoice(
          rng,
          t(`Is the product $${a} \\times ${b}$ even or odd?`, `积 $${a} \\times ${b}$ 是偶数还是奇数？`),
          odd ? oddText : even,
          [
            odd ? even : oddText,
            t("It depends on the order of the factors", "取决于因数的顺序"),
            t("It cannot be told without multiplying", "不算出来就不能判断"),
          ],
          odd
            ? t(`Both ${a} and ${b} are odd, and a product of two odd numbers is odd.`, `${a} 和 ${b} 都是奇数，两个奇数的积是奇数。`)
            : t(`At least one of ${a} and ${b} is even, so the product is even.`, `${a} 和 ${b} 中至少有一个是偶数，所以积是偶数。`),
        );
      },
    ),
  ],
);

const placeValueThreeDigits = earlyTopic(
  "understanding-three-digit-numbers",
  ["Understanding Three-Digit Numbers", "理解三位数"],
  [
    "See a three-digit number as hundreds, tens and ones, and regroup between the places.",
    "把三位数看成几百、几十和几，并在数位之间转换。",
  ],
  ["place-value-up-to-1000"],
  ["3.NBT.A.1"],
  [
    earlyPoint(
      "reading-base-ten-blocks",
      ["Reading base-ten blocks", "读十进制积木"],
      [
        "Base-ten blocks show the value of each digit. A large square is one hundred, a long rod is ten, and a small cube is one. To name the number, count the squares, the rods and the cubes separately. Then write these three counts as digits, in the places for hundreds, tens and ones.",
        "十进制积木显示每个数字的值。大正方形是一百，长条是十，小方块是一。要说出这个数，就分别数大正方形、长条和小方块。然后把这三个数写成数字，放在百位、十位和个位上。",
      ],
      (rng) => {
        const hundreds = rng.int(1, 3);
        const tens = rng.int(0, 9);
        const ones = rng.int(0, 9);
        const answer = 100 * hundreds + 10 * tens + ones;
        return {
          ...whole(
            ["What number do these blocks show?", "这些积木表示多少？"],
            answer,
            [hundreds + tens + ones, 100 * ones + 10 * tens + hundreds, 100 * tens + 10 * hundreds + ones],
            [
              `There ${hundreds === 1 ? "is 1 hundred" : `are ${hundreds} hundreds`}, ${tens} ${tens === 1 ? "ten" : "tens"} and ${ones} ${ones === 1 ? "one" : "ones"}, which make ${answer}.`,
              `有 ${hundreds} 个百、${tens} 个十和 ${ones} 个一，合起来是 ${answer}。`,
            ],
          ),
          figure: baseTenFigure(hundreds, tens, ones),
        };
      },
    ),
    earlyPoint(
      "tens-in-a-three-digit-number",
      ["Tens in a three-digit number", "三位数里有多少个十"],
      [
        "Ten tens make one hundred, so hundreds can always be traded for tens. Counting the tens in a number therefore means counting those in the hundreds as well, and not only reading the tens digit. Trading in this way is what makes adding and subtracting possible when one place has too few or too many.",
        "十个十是一百，所以百总可以换成十。因此，数一个数里有多少个十时，也要算上百里的十，而不能只读十位上的数字。这样的交换，正是在某一位不够或太多时，加减法能够进行的原因。",
      ],
      (rng) => {
        const hundreds = rng.int(1, 9);
        const tens = rng.int(1, 9);
        const ones = rng.int(1, 9);
        const n = 100 * hundreds + 10 * tens + ones;
        const answer = 10 * hundreds + tens;
        return whole(
          [
            `How many tens in all are there in ${n}? Count every ten, including those inside the hundreds, and ignore the ones.`,
            `${n} 里一共有多少个十？要数上百里的十，个位不算。`,
          ],
          answer,
          [tens, hundreds, hundreds + tens, n],
          [
            `Each hundred holds 10 tens, so ${hundreds} ${hundreds === 1 ? "hundred holds" : "hundreds hold"} ${10 * hundreds} tens. With ${tens} more ${tens === 1 ? "ten" : "tens"}, that makes ${answer}.`,
            `每个百有 10 个十，所以 ${hundreds} 个百有 ${10 * hundreds} 个十。再加 ${tens} 个十，一共 ${answer} 个十。`,
          ],
        );
      },
    ),
  ],
);

const roundingToNearestTen = earlyTopic(
  "rounding-to-the-nearest-ten",
  ["Rounding to the Nearest Ten", "取整到十位"],
  ["Round a number to the closer ten, and use it to estimate.", "把一个数取近似到较近的整十数，并用来估算。"],
  ["understanding-three-digit-numbers"],
  ["3.NBT.A.1"],
  [
    earlyPoint(
      "the-closer-ten",
      ["The closer ten", "较近的整十数"],
      [
        "Rounding replaces a number with a nearby one that is easier to use. A number lies between two tens, and rounding picks the closer of them. The ones digit decides: less than 5 goes down to the lower ten, and 5 or more goes up to the higher one. Numbers ending in 5 are halfway, and they go up by agreement.",
        "取近似是用一个更好用的相近的数来代替。一个数位于两个整十数之间，取近似就选较近的那个。个位数字决定方向：小于 5 就向下取较小的整十数，大于或等于 5 就向上取较大的。末位是 5 的数正好在中间，约定向上。",
      ],
      (rng) => {
        const n = rng.int(12, 989);
        const number = n % 10 === 0 ? n + 3 : n;
        const answer = Math.round(number / 10) * 10;
        const low = Math.floor(number / 10) * 10;
        const other = answer === low ? low + 10 : low;
        return {
          ...whole(
            [`Round ${number} to the nearest ten.`, `把 ${number} 取近似到十位。`],
            answer,
            [other, Math.round(number / 100) * 100, number],
            [
              `${number} lies between ${low} and ${low + 10}. Its ones digit is ${number % 10}, so it rounds ${answer === low ? "down" : "up"} to ${answer}.`,
              `${number} 在 ${low} 和 ${low + 10} 之间。个位是 ${number % 10}，所以向${answer === low ? "下" : "上"}取 ${answer}。`,
            ],
          ),
          figure: numberLineFigure(low, low + 10, 1, number),
        };
      },
    ),
    earlyPoint(
      "estimating-a-sum-with-tens",
      ["Estimating a sum with tens", "用整十数估算和"],
      [
        "An estimate tells about how large an answer should be. Round each number to the nearest ten, and then add the rounded numbers. This can be done in your head, and it gives a quick way of checking an exact answer. If an exact answer is far from the estimate, then it is worth working it out again.",
        "估算告诉我们答案大约有多大。把每个数取近似到十位，再把近似数相加。这可以心算，也是检验准确答案的快速方法。如果准确答案和估算相差很远，就值得重新算一遍。",
      ],
      (rng) => {
        const a = rng.int(11, 89);
        const b = rng.int(11, 89);
        const x = a % 10 === 0 ? a + 1 : a;
        const y = b % 10 === 0 ? b + 2 : b;
        const rx = Math.round(x / 10) * 10;
        const ry = Math.round(y / 10) * 10;
        return whole(
          [
            `Round each number to the nearest ten to estimate $${x} + ${y}$. What is the estimate?`,
            `把每个数取近似到十位，估算 $${x} + ${y}$。估算的结果是多少？`,
          ],
          rx + ry,
          [x + y, rx + ry + 10, rx + ry - 10],
          [
            `${x} rounds to ${rx} and ${y} rounds to ${ry}, and $${rx} + ${ry} = ${rx + ry}$.`,
            `${x} 取近似是 ${rx}，${y} 取近似是 ${ry}，$${rx} + ${ry} = ${rx + ry}$。`,
          ],
        );
      },
    ),
  ],
);

const roundingToNearestHundred = earlyTopic(
  "rounding-to-the-nearest-hundred",
  ["Rounding to the Nearest Hundred", "取整到百位"],
  ["Round a number to the closer hundred, looking at the tens digit.", "看十位数字，把一个数取近似到较近的整百数。"],
  ["rounding-to-the-nearest-ten"],
  ["3.NBT.A.1"],
  [
    earlyPoint(
      "the-closer-hundred",
      ["The closer hundred", "较近的整百数"],
      [
        "Rounding to the nearest hundred works just like rounding to the nearest ten, one place over. The number lies between two hundreds, and the tens digit decides which is closer. Below 5 goes down and 5 or more goes up. The ones digit does not matter here, so it is a mistake to round in two stages.",
        "取近似到百位和取近似到十位一样，只是往左移了一位。这个数位于两个整百数之间，十位数字决定哪个更近。小于 5 向下，大于或等于 5 向上。这里个位数字不起作用，所以分两步取近似是错的。",
      ],
      (rng) => {
        const n = rng.int(110, 990);
        const number = n % 100 === 0 ? n + 30 : n;
        const low = Math.floor(number / 100) * 100;
        const answer = Math.round(number / 100) * 100;
        return whole(
          [`Round ${number} to the nearest hundred.`, `把 ${number} 取近似到百位。`],
          answer,
          [answer === low ? low + 100 : low, Math.round(number / 10) * 10, number],
          [
            `${number} lies between ${low} and ${low + 100}. Its tens digit is ${Math.floor(number / 10) % 10}, so it rounds ${answer === low ? "down" : "up"} to ${answer}.`,
            `${number} 在 ${low} 和 ${low + 100} 之间。十位是 ${Math.floor(number / 10) % 10}，所以向${answer === low ? "下" : "上"}取 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "numbers-that-round-to-a-hundred",
      ["Numbers that round to a hundred", "取近似后是某个整百数的数"],
      [
        "Many different numbers round to the same hundred. The smallest is 50 below it, since halfway rounds up, and the largest is 49 above it. Thinking about this range helps when a question gives the rounded value and asks what the exact value might have been. A rounded number tells only roughly how large something is.",
        "许多不同的数取近似后得到同一个整百数。最小的比它小 50，因为正好在中间时向上取；最大的比它大 49。在题目给出近似值、问准确值可能是多少时，想一想这个范围很有帮助。近似数只大致说明一个量有多大。",
      ],
      (rng) => {
        const hundred = 100 * rng.int(2, 19);
        const asksSmallest = rng.bool();
        const answer = asksSmallest ? hundred - 50 : hundred + 49;
        return whole(
          [
            `A whole number rounds to ${hundred} when rounded to the nearest hundred. What is the ${asksSmallest ? "smallest" : "largest"} it could be?`,
            `一个整数取近似到百位后是 ${hundred}。它${asksSmallest ? "最小" : "最大"}可能是多少？`,
          ],
          answer,
          [
            asksSmallest ? hundred - 49 : hundred + 50,
            asksSmallest ? hundred - 100 : hundred + 99,
            hundred,
            asksSmallest ? hundred - 51 : hundred + 48,
          ],
          asksSmallest
            ? [
                `${hundred - 50} is exactly halfway, and halfway rounds up to ${hundred}. Anything smaller rounds down.`,
                `${hundred - 50} 正好在中间，向上取得 ${hundred}。再小就向下取了。`,
              ]
            : [
                `${hundred + 49} has a tens digit of 4, so it rounds down to ${hundred}. The next number, ${hundred + 50}, rounds up.`,
                `${hundred + 49} 的十位是 4，所以向下取 ${hundred}。下一个数 ${hundred + 50} 就向上取了。`,
              ],
        );
      },
    ),
  ],
);

const addingWithinThousand = earlyTopic(
  "adding-within-1000",
  ["Adding Within 1,000", "1000 以内的加法"],
  ["Add three-digit numbers place by place, regrouping when a place reaches ten.", "按数位相加三位数，某一位满十时进位。"],
  ["understanding-three-digit-numbers"],
  ["3.NBT.A.2"],
  [
    earlyPoint(
      "adding-with-regrouping",
      ["Adding with regrouping", "进位加法"],
      [
        "Add numbers one place at a time, starting with the ones. When the digits in a place add up to ten or more, trade ten of them for one in the next place to the left. It is easy to forget this extra one, so write it down at the top of the next column before adding that column.",
        "按数位一位一位地加，从个位开始。当某一位的数字加起来满十或超过十，就用十个换左边一位的一个。这个多出来的一很容易忘记，所以在加下一列之前，把它写在那一列的上面。",
      ],
      (rng) => {
        const a = rng.int(115, 589);
        const b = rng.int(115, 399);
        const answer = a + b;
        const noCarry =
          (Math.floor(a / 100) + Math.floor(b / 100)) * 100 +
          (((Math.floor(a / 10) % 10) + (Math.floor(b / 10) % 10)) % 10) * 10 +
          (((a % 10) + (b % 10)) % 10);
        return whole(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          answer,
          [noCarry, answer + 100, answer - 100, answer + 10],
          [
            `Ones: $${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}$. Add the tens and then the hundreds in the same way, carrying whenever a place reaches ten. The total is ${answer}.`,
            `个位：$${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}$。十位和百位同样地加，满十就进位。总和是 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "a-missing-addend-within-1000",
      ["A missing addend within 1,000", "1000 以内求未知加数"],
      [
        "If one addend and the total are known, the other addend is what is still needed. Subtracting the known addend from the total gives this. Another way is to count up from the known addend, first to a nearby ten or hundred, then the rest of the way. Adding your answer to the known addend checks it.",
        "如果知道一个加数和总和，另一个加数就是还需要的部分。用总和减去已知的加数，就得到它。另一种办法是从已知加数往上数，先到相近的整十或整百，再数剩下的。把答案和已知加数相加来检验。",
      ],
      (rng) => {
        const a = rng.int(120, 480);
        const answer = rng.int(110, 480);
        const total = a + answer;
        return whole(
          [`What number goes in the box? $${a} + \\square = ${total}$`, `方框里填几？$${a} + \\square = ${total}$`],
          answer,
          [total + a, answer + 100, answer - 100, answer + 10],
          [
            `Subtract: $${total} - ${a} = ${answer}$. Check: $${a} + ${answer} = ${total}$.`,
            `做减法：$${total} - ${a} = ${answer}$。检验：$${a} + ${answer} = ${total}$。`,
          ],
        );
      },
    ),
  ],
);

const subtractingWithinThousand = earlyTopic(
  "subtracting-within-1000",
  ["Subtracting Within 1,000", "1000 以内的减法"],
  ["Subtract three-digit numbers place by place, trading from the next place when needed.", "按数位相减三位数，不够减时向前一位借。"],
  ["adding-within-1000"],
  ["3.NBT.A.2"],
  [
    earlyPoint(
      "subtracting-with-regrouping",
      ["Subtracting with regrouping", "退位减法"],
      [
        "Subtract one place at a time, starting with the ones. If the top digit is too small, trade one from the next place to the left for ten in this place. Then subtract as usual. A common mistake is to subtract the smaller digit from the larger whichever is on top, which gives a result that adds back wrongly.",
        "按数位一位一位地减，从个位开始。如果上面的数字太小，就从左边一位借一个，换成这一位的十个。然后照常减。常见的差错是不管哪个在上，都用大的减小的，这样的结果加回去就不对了。",
      ],
      (rng) => {
        const b = rng.int(112, 468);
        const answer = rng.int(112, 468);
        const a = b + answer;
        const wrongDigits = [0, 1, 2].reduce(
          (sum, i) => sum + Math.abs((Math.floor(a / 10 ** i) % 10) - (Math.floor(b / 10 ** i) % 10)) * 10 ** i,
          0,
        );
        return whole(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [wrongDigits, a + b, answer + 100, answer + 10],
          [
            `Subtract place by place, trading from the next place wherever the top digit is too small. The result is ${answer}, and $${answer} + ${b} = ${a}$ checks it.`,
            `按数位相减，上面的数字不够减就向前一位借。结果是 ${answer}，$${answer} + ${b} = ${a}$ 可以检验。`,
          ],
        );
      },
    ),
    earlyPoint(
      "subtracting-across-a-zero",
      ["Subtracting across a zero", "跨过零的减法"],
      [
        "When the digit in the next place is zero, there is nothing to trade from there. Go one more place to the left: trade one hundred for ten tens, and then one of those tens for ten ones. Taking both steps in order keeps the number the same in value. Rounding the top number and adjusting is another good way.",
        "当前一位的数字是 0 时，那里没有东西可借。再往左一位：把一个百换成十个十，再把其中一个十换成十个一。按顺序做这两步，数的大小不变。把上面的数取整再调整，也是好办法。",
      ],
      (rng) => {
        const hundreds = rng.int(2, 9);
        const ones = rng.int(0, 5);
        const a = 100 * hundreds + ones;
        const b = rng.int(ones + 11, 100 * (hundreds - 1) + 89);
        const answer = a - b;
        return whole(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [answer + 100, answer + 10, answer - 10, a + b],
          [
            `Trade one hundred for 10 tens, and one of those tens for 10 ones, wherever a digit is too small. The result is ${answer}, and $${answer} + ${b} = ${a}$ checks it.`,
            `遇到不够减时，把一个百换成 10 个十，再把其中一个十换成 10 个一。结果是 ${answer}，$${answer} + ${b} = ${a}$ 可以检验。`,
          ],
        );
      },
    ),
  ],
);

/** gradeThreeOperationTopics are the number and operation topics of 3rd Grade Math, in teaching order. */
export const gradeThreeOperationTopics: readonly TopicDef[] = [
  multiplicationAsEqualGroups,
  multiplicationWithArrays,
  multiplyingByTwoFiveTen,
  multiplyingByThreeFour,
  multiplyingBySixToNine,
  multiplyingByZeroAndOne,
  propertiesOfMultiplication,
  splittingAFactor,
  multiplyingByMultiplesOfTen,
  divisionAsSharing,
  divisionAsGrouping,
  relatingMultiplicationDivision,
  divisionFacts,
  multiplyDivideWordProblems,
  twoStepWordProblems,
  orderOfOperationsEarly,
  arithmeticPatterns,
  placeValueThreeDigits,
  roundingToNearestTen,
  roundingToNearestHundred,
  addingWithinThousand,
  subtractingWithinThousand,
];
