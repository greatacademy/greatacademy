// 2nd Grade Math: skip counting, even and odd numbers, arrays, place value to
// 1,000, adding and subtracting within 100 and with models within 1,000, and word
// problems within 100.

import type { Figure, Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import {
  arrayFigure,
  baseTenFigure,
  countersFigure,
  earlyNames,
  earlyPoint,
  earlyThings,
  earlyTopic,
  jumpsFigure,
  nearbyWrong,
  numberLineFigure,
} from "../early-grades-kit.ts";
import { numberProblem } from "../problems.ts";
import { compareProblem, mathText, pickChoice } from "./grade-4-fractions.ts";

/** whole builds a problem whose answer is a whole number, with a figure when one is given. */
function whole(
  prompt: readonly [string, string],
  answer: number,
  wrong: readonly number[],
  solution: readonly [string, string],
  figure?: Figure,
): Problem {
  const problem = numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    form: "integer",
    wrong: nearbyWrong(answer, ...wrong),
    solution: t(solution[0], solution[1]),
  });
  return figure ? { ...problem, figure } : problem;
}

const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tensWords = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const digitsZh = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** numberWordsEn writes a whole number from 1 to 1,000 in English words, such as three hundred forty-two. */
export function numberWordsEn(n: number): string {
  if (n === 1000) return "one thousand";
  if (n >= 100) {
    const rest = n % 100;
    return `${ones[Math.floor(n / 100)]} hundred${rest ? ` ${numberWordsEn(rest)}` : ""}`;
  }
  if (n >= 20) return `${tensWords[Math.floor(n / 10)]}${n % 10 ? `-${ones[n % 10]}` : ""}`;
  return n >= 10 ? (teens[n - 10] as string) : (ones[n] as string);
}

/** numberWordsZh writes a whole number from 1 to 1,000 in Chinese numerals, such as 三百四十二. */
export function numberWordsZh(n: number): string {
  if (n === 1000) return "一千";
  const h = Math.floor(n / 100);
  const ten = Math.floor((n % 100) / 10);
  const one = n % 10;
  if (h === 0) {
    const tens = ten === 0 ? "" : ten === 1 ? "十" : `${digitsZh[ten]}十`;
    return `${tens}${one ? digitsZh[one] : ""}`;
  }
  const tens = ten === 0 ? (one ? "零" : "") : `${digitsZh[ten]}十`;
  return `${digitsZh[h]}百${tens}${one ? digitsZh[one] : ""}`;
}

/** blocksFigure draws base-ten blocks with an alt text that names only the kinds of block present, in the right number. */
export function blocksFigure(hundreds: number, tens: number, single: number): Figure {
  const _en = (n: number, word: string, many: string) => (n === 0 ? [] : [`${n} ${n === 1 ? word : many}`]);
  const _zh = (n: number, word: string) => (n === 0 ? [] : [`${n} 个${word}`]);
  return {
    svg: baseTenFigure(hundreds, tens, single).svg,
    alt: t(
      `Base-ten blocks, where large squares are hundreds, rods are tens and small squares are ones: ${[..._en(hundreds, "large square", "large squares"), ..._en(tens, "rod", "rods"), ..._en(single, "small square", "small squares")].join(", ")}.`,
      `十进制积木，大方块是百，长条是十，小方块是一：${[..._zh(hundreds, "大方块"), ..._zh(tens, "长条"), ..._zh(single, "小方块")].join("、")}。`,
    ),
  };
}

/** fittingBlocks picks hundreds, tens and ones whose blocks fit across a figure. */
function fittingBlocks(rng: Rng): [number, number, number] {
  const h = rng.int(1, 4);
  return [h, rng.int(0, h === 4 ? 5 : 9), rng.int(0, 9)];
}

/** plural writes a count with its noun, adding s unless the count is 1. */
export const plural = (n: number, noun: string) => `${n} ${noun}${n === 1 ? "" : "s"}`;

/** placeWords names counts of hundreds, tens and ones, such as 3 hundreds, 1 ten and 4 ones. */
function placeWords(hundreds: number, tens: number, single: number): string {
  return `${plural(hundreds, "hundred")}, ${plural(tens, "ten")} and ${plural(single, "one")}`;
}

/** expanded writes a number's nonzero place parts joined by plus signs. */
function expanded(n: number): string {
  const parts = [Math.floor(n / 100) * 100, Math.floor((n % 100) / 10) * 10, n % 10].filter((p) => p > 0);
  return parts.join(" + ");
}

const skipCountingTwosFivesTens = earlyTopic(
  "skip-counting-by-2s-5s-and-10s",
  ["Skip Counting by 2s, 5s and 10s", "2 个 2 个、5 个 5 个、10 个 10 个地数"],
  ["Count forward by twos, fives and tens, and find a missing number in a count.", "按 2、按 5、按 10 往后数，并找出数列中缺少的数。"],
  ["counting-to-120"],
  ["2.NBT.A.2"],
  [
    earlyPoint(
      "the-next-number-in-a-skip-count",
      ["The next number in a skip count", "跳着数的下一个数"],
      [
        "Skip counting means saying only some of the numbers, with the same jump every time. Look at two numbers next to each other to see the size of the jump. Then make that same jump once more. Counting by fives ends in 5 or 0, and counting by tens keeps the ones digit the same, which helps you check.",
        "跳着数就是只说其中一些数，每次跳的大小都一样。看相邻的两个数，就知道每次跳多少。然后再跳一次同样的大小。按 5 数时，个位总是 5 或 0；按 10 数时，个位不变，这可以帮你检查。",
      ],
      (rng) => {
        const step = rng.pick([2, 5, 10]);
        const start = step * rng.int(1, step === 2 ? 40 : step === 5 ? 16 : 8);
        const shown = [0, 1, 2, 3].map((i) => start + i * step);
        const answer = start + 4 * step;
        const list = shown.join(", ");
        return whole(
          [`What number comes next? $${list}, \\square$`, `下一个数是多少？$${list}, \\square$`],
          answer,
          [answer - step + 1, answer + step],
          [
            `Each number is ${step} more than the one before, so the next number is $${answer - step} + ${step} = ${answer}$.`,
            `每个数都比前一个多 ${step}，所以下一个数是 $${answer - step} + ${step} = ${answer}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "a-missing-point-on-a-skip-count",
      ["A missing point on a skip count", "跳着数时缺少的点"],
      [
        "A number line can show skip counting, with one tick mark for each jump. Start at the number you know and count the jumps to the marked point, saying the skip count aloud as you go. The size of the jump never changes, so every space between two tick marks is worth the same amount as the others.",
        "数轴可以表示跳着数，每跳一次对应一个刻度。从知道的数出发，数一数到标出的点要跳几次，一边跳一边大声数。每次跳的大小不变，所以任意两个相邻刻度之间的一格都代表同样多。",
      ],
      (rng) => {
        const step = rng.pick([2, 5, 10]);
        const lo = step * rng.int(0, step === 2 ? 30 : step === 5 ? 12 : 6);
        const jumps = rng.int(4, 7);
        const at = rng.int(1, jumps - 1);
        const answer = lo + at * step;
        return {
          ...whole(
            [`This number line counts by ${step}s. What number is at the marked point?`, `这条数轴按 ${step} 数。标出的点是多少？`],
            answer,
            [lo + at, answer - step + 1],
            [
              `The point is ${at === 1 ? "1 jump" : `${at} jumps`} of ${step} from ${lo}. Counting on gives ${answer}.`,
              `这个点离 ${lo} 有 ${at} 跳，每跳 ${step}。往后数得到 ${answer}。`,
            ],
            numberLineFigure(lo, lo + jumps * step, step, answer, false),
          ),
          solutionFigure: jumpsFigure(
            lo,
            lo + jumps * step,
            step,
            Array.from({ length: at + 1 }, (_, i) => lo + i * step),
            false,
          ),
        };
      },
    ),
  ],
);

const evenAndOdd = earlyTopic(
  "even-and-odd-numbers",
  ["Even and Odd Numbers", "偶数和奇数"],
  [
    "Tell even numbers from odd ones by pairing things up, and write an even number as two equal addends.",
    "通过两两配对分辨偶数和奇数，并把偶数写成两个相同的加数。",
  ],
  ["skip-counting-by-2s-5s-and-10s", "doubles-and-near-doubles"],
  ["2.OA.C.3"],
  [
    earlyPoint(
      "pairing-counters-to-see-even-or-odd",
      ["Pairing counters to see even or odd", "配对看偶数和奇数"],
      [
        "Put things into pairs, two at a time. If every thing has a partner, the number is even. If one thing is left with no partner, the number is odd. You do not always need to pair them: a number is even when its last digit is 0, 2, 4, 6 or 8.",
        "把东西两个两个地配成对。如果每个都有伙伴，这个数就是偶数。如果剩下一个没有伙伴，这个数就是奇数。不一定每次都要配对：一个数的个位是 0、2、4、6 或 8，它就是偶数。",
      ],
      (rng) => {
        const asksPicture = rng.bool();
        if (asksPicture) {
          const n = rng.int(7, 20);
          const kind = (v: number) =>
            v % 2 === 0
              ? t(`${v} counters, an even number`, `${v} 个圆片，是偶数`)
              : t(`${v} counters, an odd number`, `${v} 个圆片，是奇数`);
          const flipped =
            n % 2 === 0
              ? t(`${n} counters, an odd number`, `${n} 个圆片，是奇数`)
              : t(`${n} counters, an even number`, `${n} 个圆片，是偶数`);
          return pickChoice(
            rng,
            t("Count these counters and pair them up. Which of these is right?", "数一数这些圆片，再两个两个地配对。下面哪一句是对的？"),
            kind(n),
            [flipped, kind(n + 1), kind(n - 1)],
            n % 2 === 0
              ? t(
                  `There are ${n} counters, and each one has a partner, so ${n} is even.`,
                  `一共有 ${n} 个圆片，每个都有伙伴，所以 ${n} 是偶数。`,
                )
              : t(
                  `There are ${n} counters, and one is left with no partner, so ${n} is odd.`,
                  `一共有 ${n} 个圆片，剩下一个没有伙伴，所以 ${n} 是奇数。`,
                ),
            countersFigure(n, 2),
          );
        }
        const asksEven = rng.bool();
        const pick = (even: boolean) => 2 * rng.int(2, 49) + (even ? 0 : 1);
        const correct = pick(asksEven);
        const others = new Set<number>();
        while (others.size < 3) others.add(pick(!asksEven));
        return pickChoice(
          rng,
          t(`Which of these numbers is ${asksEven ? "even" : "odd"}?`, `下面哪个数是${asksEven ? "偶数" : "奇数"}？`),
          mathText(`${correct}`),
          [...others].map((v) => mathText(`${v}`)),
          t(
            `${correct} ends in ${correct % 10}, so it is ${asksEven ? "even" : "odd"}, and the other numbers are not.`,
            `${correct} 的个位是 ${correct % 10}，所以它是${asksEven ? "偶数" : "奇数"}，其他的数都不是。`,
          ),
        );
      },
    ),
    earlyPoint(
      "even-numbers-as-two-equal-addends",
      ["Even numbers as two equal addends", "偶数等于两个相同的加数"],
      [
        "When a number is even, you can share it into two equal piles, with nothing left over. That means it is a number added to itself, as in $8 = 4 + 4$. To find the addend, take the pairs apart and put one from each pair into each pile. Adding the two piles gets you back to the number.",
        "一个数是偶数时，就能把它分成同样多的两堆，没有剩余。也就是说，它是一个数加上自己，比如 $8 = 4 + 4$。要求这个加数，就把每一对拆开，一边放一个。再把两堆加起来，就回到原来的数。",
      ],
      (rng) => {
        const half = rng.int(2, 20);
        const n = 2 * half;
        const thing = rng.pick(earlyThings);
        return rng.bool()
          ? whole(
              [
                `The same number goes in both boxes. What is it? $${n} = \\square + \\square$`,
                `两个方框里填同一个数。这个数是多少？$${n} = \\square + \\square$`,
              ],
              half,
              [n, n - 2],
              [`$${half} + ${half} = ${n}$, so each box holds ${half}.`, `$${half} + ${half} = ${n}$，所以每个方框里是 ${half}。`],
            )
          : whole(
              [
                `${rng.pick(earlyNames)} shares ${n} ${thing.en} into two equal piles. How many ${thing.en} go in each pile?`,
                `把 ${n} ${thing.unit}${thing.zh}分成同样多的两堆。每堆有多少${thing.unit}？`,
              ],
              half,
              [n, n - 2],
              [`$${half} + ${half} = ${n}$, so each pile has ${half}.`, `$${half} + ${half} = ${n}$，所以每堆有 ${half} ${thing.unit}。`],
            );
      },
    ),
  ],
);

const arraysAndRepeatedAddition = earlyTopic(
  "arrays-and-repeated-addition",
  ["Arrays and Repeated Addition", "点阵和重复相加"],
  ["Find how many are in an array by adding its equal rows.", "把点阵中相同的行加起来，求出一共有多少个。"],
  ["skip-counting-by-2s-5s-and-10s"],
  ["2.OA.C.4"],
  [
    earlyPoint(
      "adding-the-rows-of-an-array",
      ["Adding the rows of an array", "把点阵的每行加起来"],
      [
        "An array is a set of things lined up in straight rows, with the same number in every row. Instead of counting one at a time, count how many are in one row, and add that number once for each row. Skip counting works too. This is faster, and you are less likely to miss any.",
        "点阵是把东西排成整齐的行，每行个数都一样。不用一个一个地数，先数一行有几个，有几行就把这个数加几次。跳着数也可以。这样更快，也不容易漏掉。",
      ],
      (rng) => {
        const rows = rng.int(2, 5);
        const columns = rng.int(2, 5);
        const answer = rows * columns;
        const sum = Array(rows).fill(`${columns}`).join(" + ");
        return whole(
          rng.pick([
            ["How many dots are in this array?", "这个点阵里有多少个点？"],
            ["Add the rows of this array. How many dots are there in all?", "把这个点阵的每行加起来。一共有多少个点？"],
            ["Each row of this array is one addend. What is the sum?", "这个点阵的每一行是一个加数。和是多少？"],
          ] as const),
          answer,
          [rows + columns],
          [
            `There are ${rows} rows with ${columns} dots in each, so add: $${sum} = ${answer}$.`,
            `有 ${rows} 行，每行 ${columns} 个点，所以相加：$${sum} = ${answer}$。`,
          ],
          arrayFigure(rows, columns),
        );
      },
    ),
    earlyPoint(
      "matching-an-array-to-a-sum",
      ["Matching an array to a sum", "找出点阵对应的加法"],
      [
        "Each row of an array is one addend in a sum, so the addends are all the same. The number you write again and again is how many are in a row, and how many times you write it is how many rows there are. Check both things before choosing a sum, because a sum can look close and be wrong.",
        "点阵的每一行是加法中的一个加数，所以这些加数都一样。重复写的那个数是每行的个数，写了几次就是有几行。选算式之前两样都要检查，因为有的算式看起来差不多，其实是错的。",
      ],
      (rng) => {
        const rows = rng.int(3, 5);
        const columns = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => v !== rows));
        const sum = (count: number, each: number) => mathText(Array(count).fill(`${each}`).join(" + "));
        return pickChoice(
          rng,
          rng.pick([
            t("This array has one addend for each row. Which sum matches it?", "这个点阵每一行对应一个加数。哪个加法与它相符？"),
            t("Which sum adds the rows of this array?", "哪个加法是把这个点阵的每行加起来？"),
          ]),
          sum(rows, columns),
          [mathText(`${rows} + ${columns}`), sum(rows - 1, columns), sum(rows + 1, columns)],
          t(
            `There are ${rows} rows with ${columns} dots in each, so ${columns} is added ${rows} times.`,
            `有 ${rows} 行，每行 ${columns} 个点，所以 ${columns} 加了 ${rows} 次。`,
          ),
          arrayFigure(rows, columns),
        );
      },
    ),
  ],
);

const understandingHundreds = earlyTopic(
  "hundreds-as-bundles-of-tens",
  ["Hundreds as Bundles of Tens", "百是十个十"],
  [
    "See that 10 tens make a hundred, and count how many tens are in a number of hundreds.",
    "明白 10 个十是一百，并数出若干个百里有多少个十。",
  ],
  ["tens-and-ones", "skip-counting-by-2s-5s-and-10s"],
  ["2.NBT.A.1"],
  [
    earlyPoint(
      "tens-in-whole-hundreds",
      ["Tens in whole hundreds", "整百里有几个十"],
      [
        "Ten ones can be bundled into a ten, and in the same way ten tens can be bundled into a hundred. So one hundred is the same as 10 tens, two hundreds are 20 tens, and so on. You are not changing how many things there are. You are only changing the size of the bundles you count them in.",
        "10 个一可以捆成一个十，同样，10 个十可以捆成一个百。所以一个百就是 10 个十，两个百就是 20 个十，以此类推。东西的总数没有变，变的只是用来数它们的那一捆的大小。",
      ],
      (rng) => {
        const h = rng.int(2, 9);
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        return rng.bool()
          ? whole(
              [
                `${name} needs ${h * 100} ${thing.en}, and they come in packs of 10. How many packs does ${name} need?`,
                `${name} 需要 ${h * 100} ${thing.unit}${thing.zh}，每包 10 ${thing.unit}。${name} 需要多少包？`,
              ],
              h * 10,
              [h, h * 100],
              [
                `Each hundred is 10 tens, so ${h} hundreds are ${h * 10} tens, which is ${h * 10} packs of 10.`,
                `每个百是 10 个十，所以 ${h} 个百是 ${h * 10} 个十，也就是 ${h * 10} 包。`,
              ],
            )
          : whole(
              [
                `${name} has ${h * 10} packs of ${thing.en}, with 10 in each pack. How many hundreds of ${thing.en} is that?`,
                `${name} 有 ${h * 10} 包${thing.zh}，每包 10 ${thing.unit}。这是多少个百？`,
              ],
              h,
              [h * 10, h * 100],
              [
                `Every 10 packs make one hundred, and ${h * 10} packs are ${h} sets of 10 packs.`,
                `每 10 包是一个百，${h * 10} 包就是 ${h} 个 10 包。`,
              ],
            );
      },
    ),
    earlyPoint(
      "tens-in-hundreds-and-tens",
      ["Counting all the tens", "数出所有的十"],
      [
        "When a picture shows hundreds and tens, you can count everything in tens. Each large square is 10 tens, because it can be cut into ten long rods. Count ten for each large square, and then keep counting for the rods. This way of thinking helps later when you trade a hundred for tens in subtraction.",
        "图中既有百又有十时，可以把它们都按十来数。每个大方块是 10 个十，因为它能切成十根长条。每个大方块数 10 个十，再接着数长条。这样想，以后做减法时把一个百换成十就容易了。",
      ],
      (rng) => {
        const h = rng.int(1, 4);
        const tens = rng.int(1, h === 4 ? 5 : 9);
        const answer = 10 * h + tens;
        return whole(
          ["How many tens do these blocks make in all?", "这些积木一共是多少个十？"],
          answer,
          [h + tens, 100 * h + 10 * tens],
          [
            `${h === 1 ? "One hundred is" : `${h} hundreds are`} ${10 * h} tens. With the ${tens} more, that makes ${answer} tens.`,
            `${h} 个百是 ${10 * h} 个十，再加上 ${tens} 个十，一共是 ${answer} 个十。`,
          ],
          blocksFigure(h, tens, 0),
        );
      },
    ),
  ],
);

const skipCountingByHundreds = earlyTopic(
  "skip-counting-by-100s",
  ["Counting by 10s and 100s Up to 1,000", "在 1000 以内按 10 和按 100 数"],
  [
    "Count on by tens and hundreds from any number, and count how many jumps there are.",
    "从任意一个数开始按 10 和按 100 往后数，并数出跳了几次。",
  ],
  ["hundreds-as-bundles-of-tens"],
  ["2.NBT.A.2"],
  [
    earlyPoint(
      "counting-on-by-hundreds",
      ["Counting on by hundreds", "按 100 往后数"],
      [
        "When you count by hundreds, only the hundreds digit changes. The tens and ones stay exactly as they are, because you are adding whole hundreds and nothing smaller. So look at the hundreds digit and move it up by one for every jump. The same idea works for tens, where only the tens digit moves up, until it passes 9.",
        "按 100 数时，只有百位变。十位和个位保持不变，因为加的是整百，没有更小的部分。所以看百位，每跳一次就加 1。按 10 数也是同样的道理，只有十位在变，直到它超过 9。",
      ],
      (rng) => {
        const start = 100 * rng.int(1, 5) + 10 * rng.int(0, 9) + rng.int(0, 9);
        const jumps = rng.int(2, 3);
        const shown = Array.from({ length: jumps + 1 }, (_, i) => start + i * 100).join(", ");
        const answer = start + (jumps + 1) * 100;
        return whole(
          [`Count by 100s. What number comes next? $${shown}, \\square$`, `按 100 数。下一个数是多少？$${shown}, \\square$`],
          answer,
          [answer - 90, answer - 99],
          [
            `Only the hundreds digit changes when you count by 100s, so the next number is ${answer}.`,
            `按 100 数时只有百位变，所以下一个数是 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "how-many-jumps-of-ten-or-a-hundred",
      ["How many jumps of 10 or 100", "跳了几次 10 或 100"],
      [
        "You can use skip counting to find how far apart two numbers are. Put your finger on the first number and make jumps of the same size, counting the jumps until you land on the second number. The count of jumps is your answer, and it should be a small number even when the numbers themselves are large.",
        "跳着数可以用来求两个数相差多远。把手指放在第一个数上，每次跳同样的大小，一边跳一边数跳了几次，直到落在第二个数上。跳的次数就是答案，即使这两个数很大，这个次数也不大。",
      ],
      (rng) => {
        const step = rng.pick([10, 100]);
        const jumps = rng.int(3, 7);
        const lo = step === 100 ? 100 * rng.int(0, 2) + 10 * rng.int(0, 9) : 10 * rng.int(10, 80);
        const hi = lo + jumps * step;
        return whole(
          [`How many jumps of ${step} go from ${lo} to ${hi}?`, `从 ${lo} 到 ${hi}，每次跳 ${step}，要跳几次？`],
          jumps,
          [hi - lo, jumps * 10],
          [
            `Counting ${lo}, then ${lo + step}, then ${lo + 2 * step} and on to ${hi} takes ${jumps} jumps.`,
            `从 ${lo} 数到 ${lo + step}，再数到 ${lo + 2 * step}，一直数到 ${hi}，一共跳了 ${jumps} 次。`,
          ],
          numberLineFigure(lo, hi, step, undefined, false),
        );
      },
    ),
  ],
);

const placeValueToThousand = earlyTopic(
  "place-value-up-to-1000",
  ["Place Value Up to 1,000", "1000 以内的数位"],
  ["Read a number from hundreds, tens and ones, and say what each digit is worth.", "根据百、十、一读出一个数，并说出每个数字代表多少。"],
  ["hundreds-as-bundles-of-tens"],
  ["2.NBT.A.1"],
  [
    earlyPoint(
      "reading-blocks-as-a-number",
      ["Reading blocks as a number", "把积木读成一个数"],
      [
        "A three-digit number tells how many hundreds, how many tens and how many ones it has, reading from left to right. A large square is a hundred, a rod is a ten, and a small square is a one. Count each kind on its own and write the counts in order, using a zero if a kind is missing.",
        "三位数从左到右说明有几个百、几个十、几个一。大方块是一个百，长条是一个十，小方块是一个一。每种积木分开数，再按顺序写下来；哪一种没有，就在那一位写 0。",
      ],
      (rng) => {
        const [h, tens, single] = fittingBlocks(rng);
        const answer = 100 * h + 10 * tens + single;
        return whole(
          ["What number do these blocks show?", "这些积木表示什么数？"],
          answer,
          [h + tens + single, 100 * single + 10 * tens + h, 100 * h + 10 * single + tens],
          [
            `The blocks are ${placeWords(h, tens, single)}, and that is ${answer}.`,
            `有 ${h} 个百、${tens} 个十和 ${single} 个一，这个数是 ${answer}。`,
          ],
          blocksFigure(h, tens, single),
        );
      },
    ),
    earlyPoint(
      "the-value-of-a-digit",
      ["The value of a digit", "数字代表多少"],
      [
        "The same digit can be worth different amounts, depending on where it sits. In the ones place a 4 is worth 4. In the tens place it is worth 40, and in the hundreds place it is worth 400. So before you say what a digit is worth, find which place it is in, counting from the right.",
        "同一个数字因为所在的位置不同，代表的大小也不同。在个位上，4 就是 4；在十位上，它是 40；在百位上，它是 400。所以说一个数字代表多少之前，先从右边数，看它在哪一位。",
      ],
      (rng) => {
        const [h, tens, single] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3) as [number, number, number];
        const n = 100 * h + 10 * tens + single;
        const place = rng.int(0, 2);
        const digit = [h, tens, single][place] as number;
        const answer = digit * ([100, 10, 1][place] as number);
        return whole(
          [`In the number ${n}, what is the digit ${digit} worth?`, `在 ${n} 这个数中，数字 ${digit} 代表多少？`],
          answer,
          [digit, digit * 10, digit * 100],
          [
            `The ${digit} is in the ${["hundreds", "tens", "ones"][place]} place, so it is worth ${answer}.`,
            `${digit} 在${["百", "十", "个"][place]}位上，所以它代表 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const expandedForm = earlyTopic(
  "expanded-form-up-to-1000",
  ["Expanded Form Up to 1,000", "1000 以内数的展开式"],
  ["Write a three-digit number as hundreds plus tens plus ones, and back again.", "把三位数写成几百加几十加几，也能倒过来写。"],
  ["place-value-up-to-1000"],
  ["2.NBT.A.3"],
  [
    earlyPoint(
      "from-expanded-form-to-a-number",
      ["From expanded form to a number", "由展开式写出数"],
      [
        "Expanded form pulls a number apart to show what each digit is worth, so 346 is $300 + 40 + 6$. To go back, put each part in its own place. If a part is missing, as in $300 + 6$, there are no tens, so a zero must hold the tens place. Without that zero the number would be much smaller.",
        "展开式把一个数拆开，显示每个数字代表多少，比如 346 是 $300 + 40 + 6$。要写回去，就把每一部分放回自己的数位。如果缺一部分，比如 $300 + 6$，就是没有十，十位要写 0 占位。没有这个 0，这个数就小多了。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const tens = rng.int(0, 9);
        const single = tens === 0 ? rng.int(1, 9) : rng.int(0, 9);
        const n = 100 * h + 10 * tens + single;
        return whole(
          [`What number is $${expanded(n)}$?`, `$${expanded(n)}$ 是多少？`],
          n,
          [h + tens + single, 10 * h + tens + single, 100 * h + 10 * single + tens, 100 * h + single],
          [
            `Put each part in its place: ${h} in the hundreds, ${tens} in the tens and ${single} in the ones make ${n}.`,
            `把每部分放回自己的数位：百位 ${h}，十位 ${tens}，个位 ${single}，这个数是 ${n}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "the-missing-part-of-expanded-form",
      ["The missing part of expanded form", "展开式中缺少的部分"],
      [
        "When a part of expanded form is missing, read the digit in the number and work out what it is worth where it sits. The answer is not just the digit, unless that digit is in the ones place. A digit in the tens place needs one zero after it, and a digit in the hundreds place needs two.",
        "展开式缺一部分时，看这个数中对应的数字，想一想它在这一位上代表多少。答案不只是这个数字本身，除非它在个位上。十位上的数字后面要加一个 0，百位上的数字后面要加两个 0。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const tens = rng.int(1, 9);
        const single = rng.int(1, 9);
        const n = 100 * h + 10 * tens + single;
        const blank = rng.int(0, 2);
        const parts = [100 * h, 10 * tens, single];
        const answer = parts[blank] as number;
        const shown = parts.map((p, i) => (i === blank ? "\\square" : `${p}`)).join(" + ");
        const digit = [h, tens, single][blank] as number;
        return whole(
          [`What number goes in the box? $${n} = ${shown}$`, `方框里填几？$${n} = ${shown}$`],
          answer,
          [digit, digit * 10, digit * 100],
          [
            `The digit ${digit} in ${n} is in the ${["hundreds", "tens", "ones"][blank]} place, so it is worth ${answer}.`,
            `${n} 中的 ${digit} 在${["百", "十", "个"][blank]}位上，所以它代表 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const numberNames = earlyTopic(
  "number-names-up-to-1000",
  ["Number Names Up to 1,000", "1000 以内数的读法"],
  ["Read and write three-digit numbers in words.", "读出并写出三位数的文字形式。"],
  ["place-value-up-to-1000"],
  ["2.NBT.A.3"],
  [
    earlyPoint(
      "from-words-to-a-number",
      ["From words to a number", "由文字写出数"],
      [
        "The name of a three-digit number tells you its digits in order. First comes how many hundreds, then the tens, and then the ones. Listen for what is missing. Three hundred five has no tens at all, so the tens place holds a zero, and the number is 305, and neither 35 nor 350.",
        "三位数的读法按顺序说出它的数字。先说几百，再说几十，最后说几。要留意缺了什么。三百零五没有十，所以十位上是 0，这个数是 305，不是 35，也不是 350。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const tens = rng.int(0, 9);
        const single = rng.int(0, 9);
        const n = 100 * h + 10 * tens + single;
        const en = numberWordsEn(n);
        const zh = numberWordsZh(n);
        return whole(
          [`Write this number with digits: ${en}.`, `用数字写出这个数：${zh}。`],
          n,
          [100 * h + 10 * single + tens, 10 * h + tens + single, 10 * h + single, 100 * h + single * 10],
          [
            `The name tells the digits in order: ${h} in the hundreds place, ${tens} in the tens place and ${single} in the ones place, which is ${n}.`,
            `读法按顺序说出数字：百位是 ${h}，十位是 ${tens}，个位是 ${single}，写作 ${n}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "from-a-number-to-words",
      ["From a number to words", "由数写出读法"],
      [
        "To say a three-digit number, read the hundreds digit and say the word hundred, and then say the rest as a two-digit number. A zero in the tens place is not said in English, and it is read as a linking word in Chinese. Check your words by writing the digits again from what you said.",
        "读三位数时，先读百位上的数字，加上“百”字，再把后面两位当作两位数来读。十位上的 0 读作“零”。读完之后，再按读法写出数字，检查一下。",
      ],
      (rng) => {
        const h = rng.int(1, 8);
        const tens = rng.int(0, 8);
        const single = rng.int(0, 9);
        const n = 100 * h + 10 * tens + single;
        const words = (v: number) => t(numberWordsEn(v), numberWordsZh(v));
        return pickChoice(
          rng,
          t(`Which is the name of $${n}$?`, `$${n}$ 怎么读？`),
          words(n),
          [words(100 * h + 10 * single + tens), words(n + 100), words(n + 10), words(n + 1)],
          t(
            `${n} has ${h} in the hundreds place, ${tens} in the tens place and ${single} in the ones place, so its name is ${numberWordsEn(n)}.`,
            `${n} 的百位是 ${h}，十位是 ${tens}，个位是 ${single}，所以读作${numberWordsZh(n)}。`,
          ),
        );
      },
    ),
  ],
);

const comparingToThousand = earlyTopic(
  "comparing-numbers-up-to-1000",
  ["Comparing Numbers Up to 1,000", "比较 1000 以内的数"],
  ["Compare three-digit numbers by looking at hundreds, then tens, then ones.", "按百、十、一的顺序比较三位数。"],
  ["place-value-up-to-1000", "comparing-two-digit-numbers"],
  ["2.NBT.A.4"],
  [
    earlyPoint(
      "the-symbol-between-two-numbers",
      ["The symbol between two numbers", "两个数之间的符号"],
      [
        "To compare, start at the left, as the hundreds are worth the most. If the hundreds are different, the number with more hundreds is greater, whatever the other digits are. If they match, look at the tens, and then the ones. The symbols point at the smaller number: $<$ means less than, and $>$ means greater than.",
        "比较时从最左边开始，因为百位代表的最大。百位不同，百位大的那个数就大，不用管其他数字。百位相同，就看十位，再看个位。符号的尖头指向较小的数：$<$ 表示小于，$>$ 表示大于。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const a = 100 * h + rng.int(0, 99);
        const kind = rng.int(0, 7);
        const b =
          kind === 0
            ? a
            : kind <= 3
              ? 100 * h + rng.pick([...Array(100).keys()].filter((v) => v !== a % 100))
              : 100 * rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== h)) + (a % 100);
        const rel = a < b ? 0 : a === b ? 1 : 2;
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        return compareProblem(
          `${a}`,
          `${b}`,
          rel,
          rel === 1
            ? t("The two numbers have the same digits in every place, so they are equal.", "两个数每一位上的数字都相同，所以它们相等。")
            : t(
                `Comparing from the left, the first place that differs shows ${big} is greater than ${small}.`,
                `从左边开始比，第一个不同的数位说明 ${big} 大于 ${small}。`,
              ),
        );
      },
    ),
    earlyPoint(
      "greatest-and-least-of-four-numbers",
      ["Greatest and least of four numbers", "四个数中最大和最小的"],
      [
        "With several numbers, compare them all in the same way. Look at the hundreds first and set aside any that cannot be the answer. Then look at the tens of the numbers still left, and then the ones if you need to. You do not have to check every digit once one number has already pulled ahead.",
        "有几个数时，都用同样的方法比。先看百位，把不可能的数放到一边。再看剩下的数的十位，必要时再看个位。一旦有一个数已经领先，就不用再看其余的数字了。",
      ],
      (rng) => {
        const base = 100 * rng.int(1, 8);
        const pool = rng.sample(
          [...Array(200).keys()].map((v) => base + v),
          4,
        );
        const asksGreatest = rng.bool();
        const sorted = [...pool].sort((x, y) => x - y);
        const correct = (asksGreatest ? sorted[3] : sorted[0]) as number;
        return pickChoice(
          rng,
          t(`Which of these numbers is the ${asksGreatest ? "greatest" : "least"}?`, `下面哪个数${asksGreatest ? "最大" : "最小"}？`),
          mathText(`${correct}`),
          pool.filter((v) => v !== correct).map((v) => mathText(`${v}`)),
          t(
            `Comparing hundreds, then tens, then ones puts them in the order ${sorted.join(", ")}, so the ${asksGreatest ? "greatest" : "least"} is ${correct}.`,
            `先比百位，再比十位，最后比个位，顺序是 ${sorted.join("、")}，所以${asksGreatest ? "最大" : "最小"}的是 ${correct}。`,
          ),
        );
      },
    ),
  ],
);

const addingTenOrHundred = earlyTopic(
  "adding-and-subtracting-10-or-100",
  ["Adding and Subtracting 10 or 100", "加减 10 或 100"],
  ["Add or take away 10 or 100 in your head by changing one digit.", "通过改变一个数字，心算加减 10 或 100。"],
  ["place-value-up-to-1000", "ten-more-and-ten-less"],
  ["2.NBT.B.8"],
  [
    earlyPoint(
      "adding-ten-or-a-hundred-in-your-head",
      ["Adding 10 or 100 in your head", "心算加 10 或 100"],
      [
        "Adding 10 puts one more ten into the number, so the tens digit goes up by one and the ones stay put. Adding 100 does the same to the hundreds digit. The one to watch is a 9. If the tens digit is 9, then adding 10 makes a new hundred, and the tens digit goes to 0.",
        "加 10 就是多一个十，所以十位加 1，个位不变。加 100 同样是百位加 1。要注意的是 9。如果十位是 9，加 10 就会满一百，十位变成 0。",
      ],
      (rng) => {
        const crossing = rng.int(0, 4) === 0;
        const n = crossing ? 100 * rng.int(1, 8) + 90 + rng.int(0, 9) : 100 + rng.int(0, 799);
        const step = crossing ? 10 : rng.pick([10, 100]);
        const answer = n + step;
        return whole(
          [`What is $${n} + ${step}$?`, `$${n} + ${step}$ 等于多少？`],
          answer,
          [n + 1, n + (step === 10 ? 100 : 10), n - step],
          [
            `Adding ${step} adds one to the ${step === 10 ? "tens" : "hundreds"}. So ${n} becomes ${answer}.`,
            `加 ${step} 就是${step === 10 ? "十位" : "百位"}加 1。所以 ${n} 变成 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "taking-away-ten-or-a-hundred-in-your-head",
      ["Taking away 10 or 100 in your head", "心算减 10 或 100"],
      [
        "Taking away 10 takes one ten out of the number, so the tens digit goes down by one and the ones stay put. Taking away 100 does the same to the hundreds digit. If there are no tens to take, as in 305, trade one hundred for ten tens first, so 305 take away 10 is 295.",
        "减 10 就是拿走一个十，所以十位减 1，个位不变。减 100 同样是百位减 1。如果十位上没有十可拿，比如 305，就先把一个百换成十个十，所以 305 减 10 得 295。",
      ],
      (rng) => {
        const crossing = rng.int(0, 4) === 0;
        const n = crossing ? 100 * rng.int(2, 9) + rng.int(0, 9) : 110 + rng.int(0, 880);
        const step = crossing || n < 200 ? 10 : rng.pick([10, 100]);
        const answer = n - step;
        return whole(
          [`What is $${n} - ${step}$?`, `$${n} - ${step}$ 等于多少？`],
          answer,
          [n - 1, n + step, n - (step === 10 ? 100 : 10)],
          [
            `Taking away ${step} takes one from the ${step === 10 ? "tens" : "hundreds"}. So ${n} becomes ${answer}.`,
            `减 ${step} 就是${step === 10 ? "十位" : "百位"}减 1。所以 ${n} 变成 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const factsWithinTwenty = earlyTopic(
  "adding-and-subtracting-within-20-quickly",
  ["Adding and Subtracting Within 20 Quickly", "快速计算 20 以内的加减法"],
  [
    "Know sums and differences within 20 quickly, using strategies that make them easy.",
    "运用让计算变容易的方法，快速算出 20 以内的和与差。",
  ],
  ["subtracting-through-ten", "related-addition-and-subtraction-facts"],
  ["2.OA.B.2"],
  [
    earlyPoint(
      "sums-to-twenty-by-strategy",
      ["Sums to 20 by strategy", "用方法算 20 以内的和"],
      [
        "By now you do not need to count on your fingers for small sums. Use what you already know. Make a ten by moving a little from one number to the other, or use a double you remember. Each time you use a way like this, the fact gets easier, until the answer comes to you straight away.",
        "现在，算小数相加已经不需要掰手指了。用你已经会的。从一个数挪一点给另一个数，凑成十，或者用你记得的两个相同数相加。每用一次这样的方法，这个算式就更容易，直到答案一下子就能想出来。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.int(3, 9);
        const answer = a + b;
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        return whole(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          answer,
          [answer + 1, answer - 1, a * b],
          answer > 10
            ? [
                `Make a ten: $${big} + ${10 - big} = 10$, which leaves ${small - (10 - big)} more, and $10 + ${small - (10 - big)} = ${answer}$.`,
                `凑十：$${big} + ${10 - big} = 10$，还剩 ${small - (10 - big)}，$10 + ${small - (10 - big)} = ${answer}$。`,
              ]
            : [`Start from ${big} and count on ${small} to reach ${answer}.`, `从 ${big} 开始，往后数 ${small}，得到 ${answer}。`],
        );
      },
    ),
    earlyPoint(
      "differences-from-a-sum-you-know",
      ["Differences from a sum you know", "用会的加法算差"],
      [
        "Subtraction is the same fact as addition, read another way. To work out 15 take away 7, ask what must be added to 7 to reach 15. When you know the sum, you know the difference as well. Thinking in this way is quicker and safer than counting backwards, where it is easy to lose your place.",
        "减法和加法是同一个算式，只是换了一种读法。要算 15 减 7，就想 7 加几得 15。知道了和，也就知道了差。这样想，比倒着数更快也更稳，倒着数很容易数错。",
      ],
      (rng) => {
        const b = rng.int(3, 9);
        const answer = rng.int(3, 9);
        const a = b + answer;
        return whole(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [a + b, answer + 2],
          [`$${b} + ${answer} = ${a}$, so $${a} - ${b} = ${answer}$.`, `$${b} + ${answer} = ${a}$，所以 $${a} - ${b} = ${answer}$。`],
        );
      },
    ),
  ],
);

const addingWithinHundred = earlyTopic(
  "adding-within-100",
  ["Adding Within 100", "100 以内的加法"],
  [
    "Add two-digit numbers by adding tens and ones, trading ten ones for a ten when needed.",
    "把十和一分别相加来计算两位数加法，必要时把十个一换成一个十。",
  ],
  ["adding-and-subtracting-within-20-quickly", "adding-tens-to-two-digit-numbers"],
  ["2.NBT.B.5"],
  [
    earlyPoint(
      "adding-tens-and-ones",
      ["Adding tens and ones", "十和一分别相加"],
      [
        "A two-digit number is some tens and some ones, so you can add the tens together and the ones together. Keeping the two kinds apart makes the work small: two little sums rather than one big one. Then put the two results back together. Your answer should be a bit larger than the bigger number you started with.",
        "两位数由几个十和几个一组成，所以可以整十和整十相加，个位和个位相加。两种分开，计算就变小了：两个小的加法，而不是一个大的。最后把两个结果合起来。答案应该比开始时较大的那个数大一些。",
      ],
      (rng) => {
        const at = rng.int(1, 7);
        const bt = rng.int(1, 8 - at);
        const ao = rng.int(1, 8);
        const bo = rng.int(1, 9 - ao);
        const a = 10 * at + ao;
        const b = 10 * bt + bo;
        const answer = a + b;
        return whole(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          answer,
          [answer + 10, answer - 10, at + bt + ao + bo],
          [
            `Tens: $${10 * at} + ${10 * bt} = ${10 * (at + bt)}$. Ones: $${ao} + ${bo} = ${ao + bo}$. Together they make ${answer}.`,
            `整十：$${10 * at} + ${10 * bt} = ${10 * (at + bt)}$。个位：$${ao} + ${bo} = ${ao + bo}$。合起来是 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "trading-ten-ones-for-a-ten",
      ["Trading ten ones for a ten", "把十个一换成一个十"],
      [
        "If you have more than nine ones, you have enough to make a new ten. Take ten of the small squares, trade them for one rod, and put it with the other tens. What is left of the ones stays in the ones place. The number has not changed, only the way it is shown, and now it is easy to read.",
        "如果个位上的一超过九个，就够组成一个新的十了。拿十个小方块，换成一根长条，和别的十放在一起。剩下的一还在个位。这个数并没有变，变的只是表示方法，现在就很容易读了。",
      ],
      (rng) => {
        const tens = rng.int(2, 6);
        const single = rng.int(11, 18);
        const answer = 10 * tens + single;
        return whole(
          ["Trade ten ones for one ten. What number do these blocks show?", "把十个一换成一个十。这些积木表示什么数？"],
          answer,
          [10 * tens + single - 10, 10 * (tens + single), tens + single, 10 * single + tens],
          [
            `${single} ones are 1 ten and ${plural(single - 10, "one")}. So ${tens} tens and ${single} ones are ${tens + 1} tens and ${plural(single - 10, "one")}, which is ${answer}.`,
            `${single} 个一是 1 个十和 ${single - 10} 个一。所以 ${tens} 个十和 ${single} 个一就是 ${tens + 1} 个十和 ${single - 10} 个一，也就是 ${answer}。`,
          ],
          blocksFigure(0, tens, single),
        );
      },
    ),
    earlyPoint(
      "adding-with-a-new-ten",
      ["Adding with a new ten", "相加时产生新的十"],
      [
        "Sometimes the ones add up to ten or more, such as 7 and 8 making 15. That 15 is a ten and 5 ones, so the ten goes with the other tens. Add the tens as usual and then count one more. Forgetting that extra ten is the most common slip, so check that your answer makes sense.",
        "有时个位加起来达到十或更多，比如 7 加 8 得 15。15 是一个十和 5 个一，所以这个十要和别的十放在一起。先像平常一样把十相加，再多算一个十。忘记这个十是最常见的差错，所以要检查答案合不合理。",
      ],
      (rng) => {
        const ao = rng.int(2, 9);
        const bo = rng.int(Math.max(1, 10 - ao), 9);
        const at = rng.int(1, 7);
        const bt = rng.int(1, 8 - at);
        const a = 10 * at + ao;
        const b = 10 * bt + bo;
        const answer = a + b;
        return whole(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          answer,
          [answer - 10, answer + 10, at + bt + ao + bo],
          [
            `Ones: $${ao} + ${bo} = ${ao + bo}$, which is ${ao + bo === 10 ? "a new ten" : `a new ten and ${ao + bo - 10} more`}. Tens: $${10 * at} + ${10 * bt} + 10 = ${10 * (at + bt + 1)}$. Together they make ${answer}.`,
            `个位：$${ao} + ${bo} = ${ao + bo}$，是${ao + bo === 10 ? "一个新的十" : `一个新的十和 ${ao + bo - 10}`}。十位：$${10 * at} + ${10 * bt} + 10 = ${10 * (at + bt + 1)}$。合起来是 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const subtractingWithinHundred = earlyTopic(
  "subtracting-within-100",
  ["Subtracting Within 100", "100 以内的减法"],
  [
    "Subtract two-digit numbers by taking tens and ones, trading a ten for ten ones when needed.",
    "把十和一分别相减来计算两位数减法，必要时把一个十换成十个一。",
  ],
  ["adding-within-100", "subtracting-multiples-of-ten"],
  ["2.NBT.B.5"],
  [
    earlyPoint(
      "taking-away-tens-and-ones",
      ["Taking away tens and ones", "十和一分别相减"],
      [
        "To subtract a two-digit number, take away its tens from the tens and its ones from the ones. When there are enough ones to take, this works straight away. Then put the tens and ones that remain together. You can check by adding your answer to the number you took away, which should bring you back to where you began.",
        "减两位数时，十位减十位，个位减个位。如果个位够减，直接就能算。再把剩下的十和一合起来。可以把答案和减去的数相加来检验，应该回到开始的那个数。",
      ],
      (rng) => {
        const at = rng.int(3, 9);
        const bt = rng.int(1, at - 1);
        const ao = rng.int(2, 9);
        const bo = rng.int(1, ao);
        const a = 10 * at + ao;
        const b = 10 * bt + bo;
        const answer = a - b;
        return whole(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [a + b, answer + 10, answer - 10],
          [
            `Tens: $${at * 10} - ${bt * 10} = ${(at - bt) * 10}$. Ones: $${ao} - ${bo} = ${ao - bo}$. Together they make ${answer}.`,
            `整十：$${at * 10} - ${bt * 10} = ${(at - bt) * 10}$。个位：$${ao} - ${bo} = ${ao - bo}$。合起来是 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "trading-a-ten-for-ten-ones",
      ["Trading a ten for ten ones", "把一个十换成十个一"],
      [
        "If there are not enough ones to take away, open up one of the tens. Trade one rod for ten small squares, and add those to the ones you already have. You now have one ten fewer and ten ones more, and the number itself has not changed. Now there are enough ones, and the subtraction can go ahead.",
        "如果个位不够减，就打开一个十。把一根长条换成十个小方块，和原来的一放在一起。现在少了一个十，多了十个一，这个数本身没有变。这样一就够减了，可以接着算。",
      ],
      (rng) => {
        const at = rng.int(2, 9);
        const ao = rng.int(0, 8);
        const bo = rng.int(ao + 1, 9);
        const bt = rng.int(1, at - 1);
        const a = 10 * at + ao;
        const b = 10 * bt + bo;
        const answer = ao + 10;
        return whole(
          [
            `To work out $${a} - ${b}$, you trade one ten for ten ones. How many ones do you have after the trade?`,
            `计算 $${a} - ${b}$ 时，要把一个十换成十个一。换了以后有多少个一？`,
          ],
          answer,
          [ao, bo, at - 1, ao + 1],
          [
            `${a} starts with ${ao === 0 ? "no ones" : plural(ao, "one")}, and the trade brings ten more, so $${ao} + 10 = ${answer}$ ones.`,
            `${a} 本来有 ${ao} 个一，换来十个一，所以 $${ao} + 10 = ${answer}$ 个一。`,
          ],
        );
      },
    ),
    earlyPoint(
      "subtracting-with-a-trade",
      ["Subtracting with a trade", "需要换的减法"],
      [
        "Look at the ones first. If the top ones are fewer than the ones being taken away, trade a ten, so that the top has ten more ones and one less ten. Then subtract the ones and the tens. A common slip is to take the smaller digit from the larger one, whichever it belongs to, and that gives a wrong answer.",
        "先看个位。如果上面个位的数比要减去的数小，就换一个十，这样上面多了十个一，少了一个十。再分别减个位和十位。常见的差错是不管哪个在上，都用大数字减小数字，这样答案就错了。",
      ],
      (rng) => {
        const at = rng.int(3, 9);
        const ao = rng.int(0, 8);
        const bo = rng.int(ao + 1, 9);
        const bt = rng.int(1, at - 2);
        const a = 10 * at + ao;
        const b = 10 * bt + bo;
        const answer = a - b;
        return whole(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [10 * (at - bt) + (bo - ao), answer + 10, answer - 10],
          [
            `Trade a ten: ${a} is ${plural(at - 1, "ten")} and ${ao + 10} ones. Ones: $${ao + 10} - ${bo} = ${ao + 10 - bo}$. Tens: $${at - 1} - ${bt} = ${at - 1 - bt}$. The answer is ${answer}.`,
            `换一个十：${a} 是 ${at - 1} 个十和 ${ao + 10} 个一。个位：$${ao + 10} - ${bo} = ${ao + 10 - bo}$。十位：$${at - 1} - ${bt} = ${at - 1 - bt}$。答案是 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const addingSeveral = earlyTopic(
  "adding-several-two-digit-numbers",
  ["Adding Several Two-Digit Numbers", "几个两位数相加"],
  [
    "Add three or four two-digit numbers, adding the tens and ones and looking for easy pairs.",
    "把三四个两位数相加，分别加十和一，并找容易相加的数对。",
  ],
  ["adding-within-100"],
  ["2.NBT.B.6"],
  [
    earlyPoint(
      "adding-three-two-digit-numbers",
      ["Adding three two-digit numbers", "三个两位数相加"],
      [
        "You can add three numbers in any order, because moving them around does not change how many there are. Look for two ones digits that make ten, and add these first. Otherwise, add all the tens and then all the ones, and put them together. It helps to write each step down, so that nothing gets lost along the way.",
        "三个数可以按任意顺序相加，因为换个位置总数不会变。找一找哪两个个位能凑成十，先加它们。不然就把所有的十相加，再把所有的一相加，最后合起来。把每一步写下来有帮助，这样中途不会漏掉什么。",
      ],
      (rng) => {
        const nums = [rng.int(11, 39), rng.int(11, 39), rng.int(11, 29)] as const;
        const [a, b, c] = nums;
        const answer = a + b + c;
        const tens = 10 * nums.reduce((s, v) => s + Math.floor(v / 10), 0);
        const single = nums.reduce((s, v) => s + (v % 10), 0);
        return whole(
          [`What is $${a} + ${b} + ${c}$?`, `$${a} + ${b} + ${c}$ 等于多少？`],
          answer,
          [answer - 10, answer + 10, a + b],
          [
            `The tens make ${tens} and the ones make ${single}, and $${tens} + ${single} = ${answer}$.`,
            `整十加起来是 ${tens}，个位加起来是 ${single}，$${tens} + ${single} = ${answer}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "adding-four-two-digit-numbers",
      ["Adding four two-digit numbers", "四个两位数相加"],
      [
        "Four numbers take a little more care than three, but no new idea. Add all the tens first, which gives you a round number that is simple to hold in your head. Then add all the ones, one at a time, and put the two totals together. Pairing numbers that make a round total keeps the steps small.",
        "四个数比三个数多费一点心，但没有新的道理。先把所有的十相加，得到一个整十数，很容易记住。再把所有的一逐个相加，最后把两个总数合起来。把能凑成整十的数配成一对，每一步都会更小。",
      ],
      (rng) => {
        const nums = [rng.int(11, 29), rng.int(11, 29), rng.int(11, 29), rng.int(11, 29)] as const;
        const shown = nums.join(" + ");
        const answer = nums.reduce((s, v) => s + v, 0);
        const tens = 10 * nums.reduce((s, v) => s + Math.floor(v / 10), 0);
        const single = nums.reduce((s, v) => s + (v % 10), 0);
        return whole(
          [`What is $${shown}$?`, `$${shown}$ 等于多少？`],
          answer,
          [answer - 10, answer + 10, answer - (nums[3] as number)],
          [
            `The tens make ${tens} and the ones make ${single}, and $${tens} + ${single} = ${answer}$.`,
            `整十加起来是 ${tens}，个位加起来是 ${single}，$${tens} + ${single} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const missingNumbers = earlyTopic(
  "missing-numbers-within-100",
  ["Missing Numbers Within 100", "100 以内的未知数"],
  ["Find the unknown number in an addition or subtraction sentence within 100.", "求出 100 以内加减算式中的未知数。"],
  ["subtracting-within-100"],
  ["2.NBT.B.5", "2.OA.A.1"],
  [
    earlyPoint(
      "the-missing-addend-within-100",
      ["The missing addend", "未知加数"],
      [
        "If you know a total and one part, then the other part is what you still need. Starting from the part you have, count up to the total, going by tens and then by ones. Or you can take the part you have away from the total. Both ways tell you the same missing number, and each checks the other.",
        "知道总数和一部分时，另一部分就是还差的那些。从已有的部分开始，先按十，再按一，数到总数。也可以用总数减去已有的部分。两种办法得到的未知数一样，还能互相检验。",
      ],
      (rng) => {
        const a = rng.int(12, 58);
        const answer = rng.int(12, 40);
        const total = a + answer;
        const first = rng.bool();
        const shown = first ? `${a} + \\square = ${total}` : `\\square + ${a} = ${total}`;
        return whole(
          [`What number goes in the box? $${shown}$`, `方框里填几？$${shown}$`],
          answer,
          [total, a + total, answer + 10],
          [
            `The missing part is the total take away the part you know: $${total} - ${a} = ${answer}$.`,
            `未知的部分等于总数减去已知的部分：$${total} - ${a} = ${answer}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "the-missing-number-in-a-subtraction",
      ["The missing number in a subtraction", "减法中的未知数"],
      [
        "A subtraction sentence can hide any of its numbers. If the start is missing, it was the part taken away together with the part left, so add those two. If the amount taken away is missing, find how far the start is above what was left. Thinking about the whole and its two parts tells you which to do.",
        "减法算式的任何一个数都可能未知。如果开始的数未知，它等于减去的部分加上剩下的部分，所以把这两个数相加。如果减去的数未知，就求开始的数比剩下的多多少。想一想整体和它的两部分，就知道该怎么做。",
      ],
      (rng) => {
        const take = rng.int(11, 39);
        const left = rng.int(11, 45);
        const start = take + left;
        return rng.bool()
          ? whole(
              [`What number goes in the box? $\\square - ${take} = ${left}$`, `方框里填几？$\\square - ${take} = ${left}$`],
              start,
              [left - take > 0 ? left - take : left, start + 10],
              [
                `The start was the ${take} taken away and the ${left} left: $${take} + ${left} = ${start}$.`,
                `开始的数等于减去的 ${take} 加上剩下的 ${left}：$${take} + ${left} = ${start}$。`,
              ],
            )
          : whole(
              [`What number goes in the box? $${start} - \\square = ${left}$`, `方框里填几？$${start} - \\square = ${left}$`],
              take,
              [start + left, left, take + 10],
              [
                `What was taken away is the distance from ${left} up to ${start}: $${start} - ${left} = ${take}$.`,
                `减去的数就是从 ${left} 到 ${start} 的距离：$${start} - ${left} = ${take}$。`,
              ],
            );
      },
    ),
  ],
);

const addingWithModels = earlyTopic(
  "adding-within-1000-with-models",
  ["Adding Within 1,000 With Blocks", "用积木计算 1000 以内的加法"],
  [
    "Add three-digit numbers by putting hundreds with hundreds, tens with tens and ones with ones.",
    "百和百、十和十、一和一放在一起，计算三位数加法。",
  ],
  ["adding-within-100", "expanded-form-up-to-1000"],
  ["2.NBT.B.7"],
  [
    earlyPoint(
      "adding-to-the-blocks",
      ["Adding to the blocks", "往积木上加"],
      [
        "Adding larger numbers works just as it does with smaller ones: keep like blocks together. Hundreds go with hundreds, tens with tens and ones with ones. Read the blocks first to see the number they show. Then add each part of the new number to the matching kind of block, and read the total at the end.",
        "大一些的数相加，和小数相加的做法一样：相同的积木放在一起。百和百，十和十，一和一。先读积木，看看它们表示什么数。再把新数的每一部分加到相同的积木上，最后读出总数。",
      ],
      (rng) => {
        const [h, tens, single] = fittingBlocks(rng);
        const n = 100 * h + 10 * tens + single;
        const bh = rng.int(1, 9 - h);
        const bt = rng.int(0, 9 - tens);
        const bo = rng.int(0, 9 - single);
        const b = 100 * bh + 10 * bt + bo;
        const answer = n + b;
        return whole(
          [`These blocks show a number. Add $${b}$ to it. What is the total?`, `这些积木表示一个数。把它加上 $${b}$。总数是多少？`],
          answer,
          [answer + 100, answer - 100, answer + 10, answer - 10, b],
          [
            `The blocks show ${n}. Adding the places gives ${placeWords(h + bh, tens + bt, single + bo)}, which is ${answer}.`,
            `积木表示 ${n}。按数位相加，得到 ${h + bh} 个百、${tens + bt} 个十和 ${single + bo} 个一，也就是 ${answer}。`,
          ],
          blocksFigure(h, tens, single),
        );
      },
    ),
    earlyPoint(
      "making-a-new-ten-with-three-digit-numbers",
      ["Making a new ten", "凑成新的十"],
      [
        "If the ones add up to ten or more, you can bundle ten of them into a new ten, just as you did with smaller numbers. Add the ones and make the trade, then add the tens and that new ten, and finally add the hundreds. Picturing the blocks helps you see where the new ten has to go.",
        "如果个位加起来达到十或更多，就可以把其中十个捆成一个新的十，和小一些的数一样。先加个位并换好，再把十和这个新的十相加，最后加百。在心里想着积木，就能看出这个新的十该放在哪里。",
      ],
      (rng) => {
        const h = rng.int(1, 3);
        const tens = rng.int(0, 7);
        const single = rng.int(3, 9);
        const n = 100 * h + 10 * tens + single;
        const bh = rng.int(1, 5);
        const bt = rng.int(0, 8 - tens);
        const bo = rng.int(10 - single, 9);
        const b = 100 * bh + 10 * bt + bo;
        const answer = n + b;
        return whole(
          [`These blocks show a number. Add $${b}$ to it. What is the total?`, `这些积木表示一个数。把它加上 $${b}$。总数是多少？`],
          answer,
          [answer - 10, answer + 100, answer + 10],
          [
            `The blocks show ${n}. The ones make $${single} + ${bo} = ${single + bo}$, which is a new ten and ${plural(single + bo - 10, "one")}. So the total has ${placeWords(h + bh, tens + bt + 1, single + bo - 10)}, which is ${answer}.`,
            `积木表示 ${n}。个位相加是 $${single} + ${bo} = ${single + bo}$，是一个新的十和 ${single + bo - 10} 个一。所以总数有 ${h + bh} 个百、${tens + bt + 1} 个十和 ${single + bo - 10} 个一，也就是 ${answer}。`,
          ],
          blocksFigure(h, tens, single),
        );
      },
    ),
  ],
);

const subtractingWithModels = earlyTopic(
  "subtracting-within-1000-with-models",
  ["Subtracting Within 1,000 With Blocks", "用积木计算 1000 以内的减法"],
  [
    "Subtract three-digit numbers by taking away blocks of each kind, opening a ten when needed.",
    "分别拿走每种积木来计算三位数减法，必要时打开一个十。",
  ],
  ["subtracting-within-100", "adding-within-1000-with-models"],
  ["2.NBT.B.7"],
  [
    earlyPoint(
      "taking-away-from-the-blocks",
      ["Taking away from the blocks", "从积木中拿走"],
      [
        "Picture the blocks for the larger number and take away some of each kind. Take the hundreds from the large squares, the tens from the rods and the ones from the small squares. What is left is the answer. If the picture still looks like a lot, that is fine: you only have to read what remains.",
        "想象较大的数对应的积木，每种都拿走一些。百从大方块里拿，十从长条里拿，一从小方块里拿。剩下的就是答案。如果图上看起来还有很多，也没关系，只要读出剩下的就行。",
      ],
      (rng) => {
        const [hRaw, tens, single] = fittingBlocks(rng);
        const h = Math.max(2, hRaw);
        const n = 100 * h + 10 * tens + single;
        const bh = rng.int(1, h - 1);
        const bt = rng.int(0, tens);
        const bo = rng.int(0, single);
        const b = 100 * bh + 10 * bt + bo;
        const answer = n - b;
        return whole(
          [`These blocks show a number. Take away $${b}$. How much is left?`, `这些积木表示一个数。拿走 $${b}$。还剩多少？`],
          answer,
          [n + b, answer + 100, answer + 10],
          [
            `The blocks show ${n}. Taking away ${b} leaves ${placeWords(h - bh, tens - bt, single - bo)}, which is ${answer}.`,
            `积木表示 ${n}。拿走 ${b} 后，剩下 ${h - bh} 个百、${tens - bt} 个十和 ${single - bo} 个一，也就是 ${answer}。`,
          ],
          blocksFigure(h, tens, single),
        );
      },
    ),
    earlyPoint(
      "opening-a-ten-with-three-digit-numbers",
      ["Opening a ten", "打开一个十"],
      [
        "When there are not enough small squares to take away, open up one of the rods. It becomes ten small squares, and then you can take away as many as you need. The same goes for hundreds, as a large square can be opened into ten rods. No blocks disappear in a trade; they only change into a smaller size.",
        "小方块不够拿时，就打开一根长条。它变成十个小方块，这样就能拿走需要的数量。百也是一样，一个大方块可以打开成十根长条。换的时候积木没有变少，只是变成了更小的积木。",
      ],
      (rng) => {
        const h = rng.int(2, 4);
        const tens = rng.int(1, 5);
        const single = rng.int(0, 8);
        const n = 100 * h + 10 * tens + single;
        const bh = rng.int(1, h - 1);
        const bt = rng.int(0, tens - 1);
        const bo = rng.int(single + 1, 9);
        const b = 100 * bh + 10 * bt + bo;
        const answer = n - b;
        return whole(
          [`These blocks show a number. Take away $${b}$. How much is left?`, `这些积木表示一个数。拿走 $${b}$。还剩多少？`],
          answer,
          [100 * (h - bh) + 10 * (tens - bt) + (bo - single), answer + 10, answer + 100],
          [
            `The blocks show ${n}. Open one ten to get ${single + 10} ones, and the ones left are $${single + 10} - ${bo} = ${single + 10 - bo}$. Then the tens are $${tens - 1} - ${bt} = ${tens - 1 - bt}$ and the hundreds are $${h} - ${bh} = ${h - bh}$, which makes ${answer}.`,
            `积木表示 ${n}。打开一个十，得到 ${single + 10} 个一，$${single + 10} - ${bo} = ${single + 10 - bo}$ 个一。再算 $${tens - 1} - ${bt} = ${tens - 1 - bt}$ 个十，$${h} - ${bh} = ${h - bh}$ 个百，也就是 ${answer}。`,
          ],
          blocksFigure(h, tens, single),
        );
      },
    ),
  ],
);

const wordProblems = earlyTopic(
  "word-problems-within-100",
  ["Word Problems Within 100", "100 以内的应用题"],
  [
    "Solve stories about adding to, taking from and missing starts, with numbers up to 100.",
    "解决 100 以内关于增加、减少和求原来有多少的应用题。",
  ],
  ["missing-numbers-within-100"],
  ["2.OA.A.1"],
  [
    earlyPoint(
      "adding-to-stories",
      ["Stories about adding to", "增加的故事"],
      [
        "In some stories, more things come along, or two groups are put together. These are adding stories, because the end amount is larger than each part. Before you calculate, say the story to yourself in your own words and decide what you are being asked. After you have an answer, read the story again with your answer to check it.",
        "有些故事里，东西变多了，或者把两组合在一起。这是加法的故事，因为最后的数量比每一部分都大。计算之前，用自己的话把故事说一遍，弄清问的是什么。得出答案后，带着答案再读一遍故事来检查。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const a = rng.int(12, 58);
        const b = rng.int(11, 40);
        const answer = a + b;
        return whole(
          rng.bool()
            ? [
                `${name} has ${a} ${thing.en} and gets ${b} more. How many ${thing.en} does ${name} have now?`,
                `${name} 有 ${a} ${thing.unit}${thing.zh}，又得到 ${b} ${thing.unit}。${name} 现在有多少${thing.unit}${thing.zh}？`,
              ]
            : [
                `There are ${a} ${thing.en} in one box and ${b} ${thing.en} in another. How many ${thing.en} are there in all?`,
                `一个盒子里有 ${a} ${thing.unit}${thing.zh}，另一个盒子里有 ${b} ${thing.unit}。一共有多少${thing.unit}${thing.zh}？`,
              ],
          answer,
          [Math.abs(a - b), answer + 10, answer - 10],
          [`The two amounts are put together, so add: $${a} + ${b} = ${answer}$.`, `两部分合在一起，所以相加：$${a} + ${b} = ${answer}$。`],
        );
      },
    ),
    earlyPoint(
      "taking-from-stories",
      ["Stories about taking from", "减少的故事"],
      [
        "In other stories, things are given away, used or lost, so the amount goes down. These are subtracting stories. Start with the amount at the beginning and take away what is gone, and what remains is your answer. Your answer has to be less than the amount you started with, and that is a quick check to make.",
        "还有一些故事，东西送人了、用掉了或丢了，所以数量变少。这是减法的故事。从开始的数量里减去没有了的，剩下的就是答案。答案一定比开始的数量少，这是一个很快的检查方法。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const answer = rng.int(11, 50);
        const b = rng.int(11, 39);
        const a = answer + b;
        return whole(
          [
            `${name} has ${a} ${thing.en} and gives away ${b} of them. How many ${thing.en} does ${name} have left?`,
            `${name} 有 ${a} ${thing.unit}${thing.zh}，送给别人 ${b} ${thing.unit}。${name} 还剩多少${thing.unit}${thing.zh}？`,
          ],
          answer,
          [a + b, answer + 10, answer - 10],
          [
            `What is given away comes off the start, so subtract: $${a} - ${b} = ${answer}$.`,
            `送出去的要从开始的数量里减掉，所以相减：$${a} - ${b} = ${answer}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "stories-with-a-missing-start",
      ["Stories with a missing start", "求原来有多少的故事"],
      [
        "Some stories hide the beginning. You are told what happened and how things ended, and you need to find how they started. Run the story backwards. If some were given away, then adding them back gives the start. If some were added, then taking them away gives the start. Words like gave do not always mean subtract.",
        "有些故事把开头藏起来了。告诉你发生了什么，结果怎样，要你求开始有多少。把故事倒过来想。如果送走了一些，把它们加回来就是开始的数量。如果多了一些，把它们减掉就是开始的数量。像“送”这样的词，不一定就是减法。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const change = rng.int(11, 35);
        const start = change + rng.int(11, 50);
        return rng.bool()
          ? whole(
              [
                `${name} gave away ${change} ${thing.en} and has ${start - change} left. How many ${thing.en} did ${name} have at the start?`,
                `${name} 送出 ${change} ${thing.unit}${thing.zh}，还剩 ${start - change} ${thing.unit}。${name} 原来有多少${thing.unit}${thing.zh}？`,
              ],
              start,
              [start - 2 * change > 0 ? start - 2 * change : change, start + 10, start - 10],
              [
                `Put back what was given away: $${start - change} + ${change} = ${start}$.`,
                `把送出去的加回来：$${start - change} + ${change} = ${start}$。`,
              ],
            )
          : whole(
              [
                `${name} got ${change} more ${thing.en} and now has ${start}. How many ${thing.en} did ${name} have at the start?`,
                `${name} 又得到 ${change} ${thing.unit}${thing.zh}，现在有 ${start} ${thing.unit}。${name} 原来有多少${thing.unit}${thing.zh}？`,
              ],
              start - change,
              [start + change, start - change + 10],
              [
                `Take away what was added: $${start} - ${change} = ${start - change}$.`,
                `减去后来得到的：$${start} - ${change} = ${start - change}$。`,
              ],
            );
      },
    ),
  ],
);

const comparingWordProblems = earlyTopic(
  "comparing-word-problems-within-100",
  ["Comparing Word Problems Within 100", "100 以内的比较应用题"],
  ["Solve stories that compare two amounts, with words like more and fewer.", "解决比较两个数量的应用题，题中有“多”和“少”这样的词。"],
  ["word-problems-within-100"],
  ["2.OA.A.1"],
  [
    earlyPoint(
      "how-many-more-or-fewer",
      ["How many more or fewer", "多多少或少多少"],
      [
        "When a story asks how many more, it is asking for the gap between two amounts. Picture the two groups lined up side by side. The ones that match cancel out, and the extras are the answer. You find that gap by subtracting the smaller amount from the larger amount, whichever one the story mentions first.",
        "故事问多多少时，问的是两个数量之间的差。想象把两组东西并排摆好。一一对应的部分不用管，多出来的就是答案。用较大的数减较小的数，就能求出这个差，不管故事先说哪一个。",
      ],
      (rng) => {
        const [n1, n2] = rng.sample(earlyNames, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        const small = rng.int(12, 50);
        const answer = rng.int(5, 39);
        const big = small + answer;
        const fewer = rng.bool();
        return whole(
          fewer
            ? [
                `${n1} has ${big} ${thing.en} and ${n2} has ${small}. How many fewer ${thing.en} does ${n2} have than ${n1}?`,
                `${n1} 有 ${big} ${thing.unit}${thing.zh}，${n2} 有 ${small} ${thing.unit}。${n2} 比 ${n1} 少多少${thing.unit}？`,
              ]
            : [
                `${n1} has ${small} ${thing.en} and ${n2} has ${big}. How many more ${thing.en} does ${n2} have than ${n1}?`,
                `${n1} 有 ${small} ${thing.unit}${thing.zh}，${n2} 有 ${big} ${thing.unit}。${n2} 比 ${n1} 多多少${thing.unit}？`,
              ],
          answer,
          [big + small, answer + 10, big],
          [
            `The gap between the two amounts is the larger take away the smaller: $${big} - ${small} = ${answer}$.`,
            `两个数量之间的差等于较大的减较小的：$${big} - ${small} = ${answer}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "finding-an-amount-from-a-comparison",
      ["Finding an amount from a comparison", "由比较求数量"],
      [
        "Sometimes you know one amount and how it compares with another. Be careful here, as the word more does not always mean add. Ask who has more. If the one you want has more, add the difference. If the one you want has less, subtract it. A quick sketch of two bars can show you which is longer.",
        "有时知道一个数量，以及它和另一个数量的比较。这里要小心，“多”这个字不一定表示加。先问谁多。要求的那个多，就加上差；要求的那个少，就减去差。画两个长条的草图，就能看出哪个长。",
      ],
      (rng) => {
        const [n1, n2] = rng.sample(earlyNames, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        const known = rng.int(25, 60);
        const diff = rng.int(5, 24);
        const more = rng.bool();
        const hidden = rng.bool();
        // In the "hidden" wording the known amount belongs to the person being compared, so the word and the operation disagree.
        const adds = hidden ? !more : more;
        const answer = adds ? known + diff : known - diff;
        return whole(
          hidden
            ? [
                `${n1} has ${known} ${thing.en}. That is ${diff} ${more ? "more" : "fewer"} than ${n2} has. How many ${thing.en} does ${n2} have?`,
                `${n1} 有 ${known} ${thing.unit}${thing.zh}，比 ${n2} ${more ? "多" : "少"} ${diff} ${thing.unit}。${n2} 有多少${thing.unit}？`,
              ]
            : [
                `${n1} has ${known} ${thing.en}. ${n2} has ${diff} ${more ? "more" : "fewer"} than ${n1}. How many ${thing.en} does ${n2} have?`,
                `${n1} 有 ${known} ${thing.unit}${thing.zh}。${n2} 比 ${n1} ${more ? "多" : "少"} ${diff} ${thing.unit}。${n2} 有多少${thing.unit}？`,
              ],
          answer,
          [adds ? known - diff : known + diff, answer + 10, diff],
          [
            `${n2} has ${adds ? "more" : "fewer"} than ${n1}, so ${adds ? `add: $${known} + ${diff}` : `subtract: $${known} - ${diff}`} = ${answer}$.`,
            `${n2} 比 ${n1} ${adds ? "多" : "少"}，所以${adds ? `相加：$${known} + ${diff}` : `相减：$${known} - ${diff}`} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const twoStepWordProblems = earlyTopic(
  "two-step-word-problems-within-100",
  ["Two-Step Word Problems Within 100", "100 以内的两步应用题"],
  ["Solve stories that take two steps of adding or subtracting.", "解决需要两步加减的应用题。"],
  ["comparing-word-problems-within-100"],
  ["2.OA.A.1"],
  [
    earlyPoint(
      "one-change-after-another",
      ["One change after another", "接连两次变化"],
      [
        "Some stories have two things happening, one after the other. Do them in the order they happen. Work out where the amount stands after the first change, and write that down. This number becomes the start of the second step. Going one step at a time means you never have to hold the whole story in your head at once.",
        "有些故事接连发生两件事。按发生的顺序来算。先算第一次变化后是多少，把它写下来。这个数就是第二步的开始。一步一步地算，就不用把整个故事都记在脑子里了。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const start = rng.int(20, 50);
        const gain = rng.int(11, 35);
        const lose = rng.int(11, start + gain - 11);
        const answer = start + gain - lose;
        const loseFirst = rng.bool() && lose < start;
        return whole(
          loseFirst
            ? [
                `${name} has ${start} ${thing.en}, gives away ${lose}, and then gets ${gain} more. How many ${thing.en} does ${name} have now?`,
                `${name} 有 ${start} ${thing.unit}${thing.zh}，送出 ${lose} ${thing.unit}，又得到 ${gain} ${thing.unit}。${name} 现在有多少${thing.unit}${thing.zh}？`,
              ]
            : [
                `${name} has ${start} ${thing.en}, gets ${gain} more, and then gives away ${lose}. How many ${thing.en} does ${name} have now?`,
                `${name} 有 ${start} ${thing.unit}${thing.zh}，又得到 ${gain} ${thing.unit}，然后送出 ${lose} ${thing.unit}。${name} 现在有多少${thing.unit}${thing.zh}？`,
              ],
          answer,
          [start + gain, start + gain + lose, loseFirst ? start - lose : Math.abs(gain - lose)],
          loseFirst
            ? [
                `First, $${start} - ${lose} = ${start - lose}$. Then $${start - lose} + ${gain} = ${answer}$.`,
                `先算 $${start} - ${lose} = ${start - lose}$。再算 $${start - lose} + ${gain} = ${answer}$。`,
              ]
            : [
                `First, $${start} + ${gain} = ${start + gain}$. Then $${start + gain} - ${lose} = ${answer}$.`,
                `先算 $${start} + ${gain} = ${start + gain}$。再算 $${start + gain} - ${lose} = ${answer}$。`,
              ],
        );
      },
    ),
    earlyPoint(
      "putting-together-then-comparing",
      ["Putting together, then comparing", "先合起来，再比较"],
      [
        "A story may ask you to compare something you first have to work out. Find the total of the two groups before comparing it with the third amount. The question at the end tells you what to find, so read it twice, and then ask what you need to know first. That in-between number is the first step of your plan.",
        "故事可能要你比较一个需要先算出来的数。先求出两组的总数，再和第三个数量比较。最后的问题告诉你要求什么，所以读两遍，再想一想先要知道什么。这个中间的数就是计划的第一步。",
      ],
      (rng) => {
        const [n1, n2] = rng.sample(earlyNames, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        const a = rng.int(11, 35);
        const b = rng.int(11, 35);
        const answer = rng.int(4, 25);
        const other = a + b + answer;
        return whole(
          [
            `${n1} has ${a} ${thing.en} in one bag and ${b} in another. ${n2} has ${other} ${thing.en}. How many more ${thing.en} does ${n2} have than ${n1}?`,
            `${n1} 的一个袋子里有 ${a} ${thing.unit}${thing.zh}，另一个袋子里有 ${b} ${thing.unit}。${n2} 有 ${other} ${thing.unit}${thing.zh}。${n2} 比 ${n1} 多多少${thing.unit}？`,
          ],
          answer,
          [a + b, other - a, other - b],
          [
            `First, ${n1} has $${a} + ${b} = ${a + b}$ in all. Then the gap is $${other} - ${a + b} = ${answer}$.`,
            `先算 ${n1} 一共有 $${a} + ${b} = ${a + b}$ ${thing.unit}。再求差：$${other} - ${a + b} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

/** gradeTwoNumberTopics are the number and operation topics of 2nd Grade Math, in teaching order. */
export const gradeTwoNumberTopics: readonly TopicDef[] = [
  skipCountingTwosFivesTens,
  evenAndOdd,
  arraysAndRepeatedAddition,
  understandingHundreds,
  skipCountingByHundreds,
  placeValueToThousand,
  expandedForm,
  numberNames,
  comparingToThousand,
  addingTenOrHundred,
  factsWithinTwenty,
  addingWithinHundred,
  subtractingWithinHundred,
  addingSeveral,
  missingNumbers,
  addingWithModels,
  subtractingWithModels,
  wordProblems,
  comparingWordProblems,
  twoStepWordProblems,
];
