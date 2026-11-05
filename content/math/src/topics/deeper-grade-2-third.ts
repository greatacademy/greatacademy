// A third knowledge point for the 2nd Grade Math topics that had two: the same idea
// run backwards, carried across a hundred, or used in a short story.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";

import { earlyNames, earlyThings } from "../early-grades-kit.ts";
import { choose, chooseMath, type Pair, whole } from "./early-grades-more-kit.ts";

/** skill builds a knowledge point from its texts and generator. */
const skill = (id: string, title: Pair, explanation: Pair, generate: KnowledgePointDef["generate"]): KnowledgePointDef => ({
  id,
  title: t(title[0], title[1]),
  explanation: t(explanation[0], explanation[1]),
  generate,
});

/** storyThing picks a name and a thing for a word problem. */
const storyThing = (rng: Rng) => ({ who: rng.pick(earlyNames), thing: rng.pick(earlyThings) });

/** deeperGrade2ThirdPoints holds the third knowledge points of 2nd Grade Math, by topic. */
export const deeperGrade2ThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "skip-counting-by-2s-5s-and-10s": [
    skill(
      "counting-back-by-a-step",
      ["Skip counting backward", "倒着跳数"],
      [
        "Skip counting also runs backward: each number is one step less than the one before. Find the step from two neighbors, then take it away once more to get the next number.",
        "跳数也可以倒着进行：每个数都比前一个少一步。先由相邻的两个数找出步长，再减去一次，就得到下一个数。",
      ],
      (rng) => {
        const step = rng.pick([2, 5, 10]);
        const start = step * rng.int(8, 30);
        const list = [0, 1, 2, 3].map((i) => start - i * step).join(", ");
        const answer = start - 4 * step;
        return whole(
          [`What number comes next? $${list}, \\square$`, `下一个数是几？$${list}, \\square$`],
          answer,
          [start - 3 * step + step, start - 3 * step - 1, answer - step],
          [
            `Each number is ${step} less than the one before, and ${start - 3 * step} minus ${step} is ${answer}.`,
            `每个数都比前一个少 ${step}，${start - 3 * step} 减 ${step} 得 ${answer}。`,
          ],
        );
      },
    ),
  ],
  "even-and-odd-numbers": [
    skill(
      "even-or-odd-from-the-last-digit",
      ["Even or odd from the last digit", "由个位判断奇偶"],
      [
        "Tens and hundreds can always be split into pairs, so only the ones decide. A number is even when its last digit is 0, 2, 4, 6 or 8, and odd when it is 1, 3, 5, 7 or 9.",
        "整十和整百总能分成两两一对，所以只由个位决定。个位是 0、2、4、6、8 的数是偶数，个位是 1、3、5、7、9 的数是奇数。",
      ],
      (rng) => {
        const wantEven = rng.bool();
        const tens = rng.int(1, 89);
        const pick = (even: boolean) => tens * 10 + (even ? rng.pick([0, 2, 4, 6, 8]) : rng.pick([1, 3, 5, 7, 9]));
        const answer = pick(wantEven);
        const others = [pick(!wantEven) + 100, pick(!wantEven) + 200, pick(!wantEven) + 300];
        const shown = rng.shuffle([answer, ...others]);
        const word: Pair = wantEven ? ["even", "偶数"] : ["odd", "奇数"];
        return choose(
          rng,
          [`Which of ${shown.join(", ")} is ${word[0]}?`, `${shown.join("、")} 中哪个数是${word[1]}？`],
          [`${answer}`, `${answer}`],
          others.map((n): Pair => [`${n}`, `${n}`]),
          [
            `Only the last digit decides: ${answer} ends in ${answer % 10}, so it is ${word[0]}, while the others end in digits that are not.`,
            `只看个位：${answer} 的个位是 ${answer % 10}，所以是${word[1]}，其他数的个位都不符合。`,
          ],
        );
      },
    ),
  ],
  "arrays-and-repeated-addition": [
    skill(
      "rows-and-columns-give-the-same-total",
      ["Rows and columns give the same total", "按行按列总数相同"],
      [
        "An array can be added by rows or by columns. A count of 3 rows of 5 and a count of 5 columns of 3 cover the same dots, so both sums have the same total.",
        "数组可以按行加，也可以按列加。3 行每行 5 个和 5 列每列 3 个数的是同样的点，所以两个和相同。",
      ],
      (rng) => {
        const r = rng.int(2, 6);
        const c = rng.int(2, 6);
        const rows = Array.from({ length: r }, () => c).join(" + ");
        const cols = Array.from({ length: c }, () => r).join(" + ");
        return chooseMath(
          rng,
          [
            `An array has ${r} rows with ${c} dots in each row. The rows give $${rows}$. Which sum adds its columns?`,
            `一个数组有 ${r} 行，每行 ${c} 个点。按行相加是 $${rows}$。哪个和是按列相加？`,
          ],
          cols,
          [
            Array.from({ length: c + 1 }, () => r).join(" + "),
            `${r} + ${c}`,
            Array.from({ length: c }, () => r + 1).join(" + "),
            Array.from({ length: r + c }, () => 1).join(" + "),
          ],
          [
            `There are ${c} columns with ${r} dots in each, so the column sum is $${cols}$, and it also totals ${r * c}.`,
            `一共有 ${c} 列，每列 ${r} 个点，所以按列相加是 $${cols}$，总数也是 ${r * c}。`,
          ],
        );
      },
    ),
  ],
  "hundreds-as-bundles-of-tens": [
    skill(
      "tens-needed-for-the-next-hundred",
      ["Tens needed for the next hundred", "到下一个整百还要几个十"],
      [
        "Ten tens make a hundred. To reach the next hundred from a round number, count the tens still missing: from 340 to 400 takes 6 more tens.",
        "10 个十是一百。从一个整十数到下一个整百，要数还缺几个十：从 340 到 400 还要 6 个十。",
      ],
      (rng) => {
        const h = rng.int(1, 8);
        const tens = rng.int(1, 9);
        const n = h * 100 + tens * 10;
        return whole(
          [`How many more tens does it take to go from ${n} to ${(h + 1) * 100}?`, `从 ${n} 到 ${(h + 1) * 100} 还要几个十？`],
          10 - tens,
          [tens, 100 - tens * 10, 10 - tens + 1],
          [
            `${(h + 1) * 100} - ${n} = ${100 - tens * 10}, and ${100 - tens * 10} is ${10 - tens} tens.`,
            `${(h + 1) * 100} - ${n} = ${100 - tens * 10}，${100 - tens * 10} 是 ${10 - tens} 个十。`,
          ],
        );
      },
    ),
  ],
  "skip-counting-by-100s": [
    skill(
      "counting-back-by-hundreds",
      ["Counting back by hundreds", "一百一百地倒着数"],
      [
        "Counting back by 100s lowers only the hundreds digit, one each time, and leaves the tens and ones as they are. So 738 back 3 hundreds is 438.",
        "一百一百地倒着数，每次只让百位减 1，十位和个位不变。所以 738 倒数 3 个一百是 438。",
      ],
      (rng) => {
        const n = rng.int(450, 999);
        const k = rng.int(2, 4);
        return whole(
          [`Start at ${n} and count back by 100s, ${k} times. Where do you land?`, `从 ${n} 开始一百一百地倒着数 ${k} 次。落在几？`],
          n - k * 100,
          [n - k * 10, n - k, n - (k + 1) * 100],
          [
            `Each count lowers the hundreds digit by one, so ${k} counts take away ${k * 100}: $${n} - ${k * 100} = ${n - k * 100}$.`,
            `每数一次百位减 1，所以数 ${k} 次减去 ${k * 100}：$${n} - ${k * 100} = ${n - k * 100}$。`,
          ],
        );
      },
    ),
  ],
  "place-value-up-to-1000": [
    skill(
      "building-a-number-from-digit-clues",
      ["Building a number from digit clues", "由数位线索组成数"],
      [
        "Each place holds its own digit. Clues given in any order can be sorted into hundreds, tens and ones, and then read from left to right to write the number.",
        "每个数位都有自己的数字。线索不管按什么顺序给出，都可以分别放到百位、十位、个位，再从左到右读出这个数。",
      ],
      (rng) => {
        const [h, te, o] = [rng.int(1, 9), rng.int(0, 9), rng.int(1, 9)];
        const n = h * 100 + te * 10 + o;
        return whole(
          [
            `A number has ${o} in the ones place, ${h} in the hundreds place and ${te} in the tens place. What is the number?`,
            `一个数个位是 ${o}，百位是 ${h}，十位是 ${te}。这个数是多少？`,
          ],
          n,
          [o * 100 + h * 10 + te, o * 100 + te * 10 + h, h * 100 + o * 10 + te],
          [
            `Reading the places in order, hundreds, tens, ones, gives ${h}, ${te}, ${o}: the number ${n}.`,
            `按百位、十位、个位的顺序读，依次是 ${h}、${te}、${o}：这个数是 ${n}。`,
          ],
        );
      },
    ),
  ],
  "expanded-form-up-to-1000": [
    skill(
      "expanded-form-out-of-order",
      ["Expanded form out of order", "打乱顺序的展开式"],
      [
        "Addends can come in any order, so an expanded form may start with the ones. Add the parts by their values, not by their positions, to find the number.",
        "加数可以按任意顺序排列，所以展开式可能从个位开始。按各部分的值而不是位置相加，就能得到这个数。",
      ],
      (rng) => {
        const [h, te, o] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
        const parts = rng.shuffle([h * 100, te * 10, o]);
        const n = h * 100 + te * 10 + o;
        return whole(
          [`What number is $${parts.join(" + ")}$?`, `$${parts.join(" + ")}$ 是多少？`],
          n,
          [o * 100 + te * 10 + h, h * 100 + o * 10 + te, h + te + o],
          [
            `The parts are ${h * 100}, ${te * 10} and ${o}, whatever their order, so the number is ${n}.`,
            `各部分是 ${h * 100}、${te * 10} 和 ${o}，与顺序无关，所以这个数是 ${n}。`,
          ],
        );
      },
    ),
  ],
  "number-names-up-to-1000": [
    skill(
      "names-with-no-tens",
      ["Names with no tens", "没有十位的数的读法"],
      [
        "A number name skips any place that holds zero, yet its digits still hold that place. Two hundred six has no tens, so a 0 is written in the tens place: 206.",
        "数的读法会跳过为零的数位，但写的时候这个数位仍要占位。二百零六没有十，所以十位要写 0：206。",
      ],
      (rng) => {
        const words = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        const zh = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        const h = rng.int(1, 9);
        const o = rng.int(1, 9);
        const n = h * 100 + o;
        return whole(
          [`Write this number with digits: ${words[h]} hundred ${words[o]}.`, `用数字写出这个数：${zh[h]}百零${zh[o]}。`],
          n,
          [h * 10 + o, h * 100 + o * 10, n + 10],
          [
            `There are ${h} hundreds, no tens and ${o} ones, so a 0 holds the tens place: ${n}.`,
            `有 ${h} 个百，没有十，${o} 个一，所以十位用 0 占位：${n}。`,
          ],
        );
      },
    ),
  ],
  "comparing-numbers-up-to-1000": [
    skill(
      "the-digit-that-keeps-it-true",
      ["The digit that keeps it true", "使不等式成立的数字"],
      [
        "When the hundreds match, the tens decide. To make a comparison true, look at which digit is free and find the largest or smallest digit that still keeps the sign true.",
        "百位相同时由十位决定。要使比较成立，看哪个数字可以改变，找出仍能使符号成立的最大或最小的数字。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const te = rng.int(2, 8);
        const o = rng.int(0, 9);
        const n = h * 100 + te * 10 + o;
        const less = rng.bool();
        const answer = less ? te - 1 : te + 1;
        const blank = `${h}\\square${o === 9 && less ? o : 5}`;
        const trail = o === 9 && less ? o : 5;
        const correct = less ? (trail < o ? te : te - 1) : trail > o ? te : te + 1;
        return whole(
          less
            ? [`What is the largest digit that can go in the box? $$${blank} < ${n}$$`, `方框里最大能填几？$$${blank} < ${n}$$`]
            : [`What is the smallest digit that can go in the box? $$${blank} > ${n}$$`, `方框里最小能填几？$$${blank} > ${n}$$`],
          correct,
          [answer === correct ? te : answer, te === correct ? te + 1 : te, correct + 2, Math.max(correct - 2, 0)],
          [
            `The hundreds match, so compare what follows: ${correct} gives ${h}${correct}${trail}, which is ${less ? "less" : "greater"} than ${n}, and going one digit ${less ? "higher" : "lower"} no longer works.`,
            `百位相同，比较后面的数：填 ${correct} 得到 ${h}${correct}${trail}，${less ? "小于" : "大于"} ${n}，再${less ? "大" : "小"}一个数字就不成立了。`,
          ],
        );
      },
    ),
  ],
  "adding-and-subtracting-10-or-100": [
    skill(
      "ten-or-a-hundred-across-a-boundary",
      ["Ten or a hundred more or less, undone", "由加减十或百求原数"],
      [
        "Adding 10 or 100 is undone by subtracting the same amount. If a number and 100 make 642, the number is 100 less than 642, which is 542.",
        "加 10 或 100 可以用减去同样的数还原。如果一个数加 100 得 642，这个数就比 642 少 100，也就是 542。",
      ],
      (rng) => {
        const by = rng.pick([10, 100]);
        const n = rng.int(120, 880);
        const added = rng.bool();
        const shown = added ? n + by : n - by;
        return whole(
          added
            ? [`What number goes in the box? $$\\square + ${by} = ${shown}$$`, `方框里填几？$$\\square + ${by} = ${shown}$$`]
            : [`What number goes in the box? $$\\square - ${by} = ${shown}$$`, `方框里填几？$$\\square - ${by} = ${shown}$$`],
          n,
          [added ? shown + by : shown - by, shown, n + (by === 10 ? 100 : 10)],
          added
            ? [
                `Undo adding ${by} by taking ${by} away: $${shown} - ${by} = ${n}$.`,
                `减去 ${by} 来还原加 ${by}：$${shown} - ${by} = ${n}$。`,
              ]
            : [
                `Undo taking ${by} away by adding ${by}: $${shown} + ${by} = ${n}$.`,
                `加上 ${by} 来还原减 ${by}：$${shown} + ${by} = ${n}$。`,
              ],
        );
      },
    ),
  ],
  "adding-and-subtracting-within-20-quickly": [
    skill(
      "the-box-on-either-side",
      ["The box on either side", "方框在任意一边"],
      [
        "Knowing a fact well means using it in any position. Whether the box is first, second or the answer, the same three numbers belong together, so think of the fact you know.",
        "熟记一个算式，就能在任何位置使用它。不管方框在前面、后面还是答案处，都是同样的三个数，想想你知道的那个算式。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.int(3, 9);
        const s = a + b;
        const form = rng.int(0, 2);
        const prompt = form === 0 ? `\\square + ${b} = ${s}` : form === 1 ? `${s} - \\square = ${b}` : `${s} = ${b} + \\square`;
        return whole(
          [`What number goes in the box? $$${prompt}$$`, `方框里填几？$$${prompt}$$`],
          a,
          [s + b, b === a ? a + 1 : b, a + 2],
          [`${a} and ${b} make ${s}, so the box holds ${a}.`, `${a} 和 ${b} 合起来是 ${s}，所以方框里是 ${a}。`],
        );
      },
    ),
  ],
  "adding-several-two-digit-numbers": [
    skill(
      "choosing-a-friendly-pair",
      ["Choosing a friendly pair", "找好算的一对"],
      [
        "Addends can be added in any order, so look for two whose ones make ten. Adding that pair first gives a round number, and the rest is then easy.",
        "加数可以按任意顺序相加，所以找个位相加得十的两个数。先加这一对得到整十数，剩下的就好算了。",
      ],
      (rng) => {
        const o = rng.int(1, 9);
        const x = rng.int(1, 3) * 10 + o;
        const y = rng.int(1, 3) * 10 + (10 - o);
        const z = rng.int(11, 39);
        const list = rng.shuffle([x, y, z]);
        return whole(
          [
            `Add the two numbers whose ones make ten first. What is $${list.join(" + ")}$?`,
            `先把个位相加得十的两个数相加。$${list.join(" + ")}$ 是多少？`,
          ],
          x + y + z,
          [x + y, x + y + z + 10, x + y + z - 10],
          [
            `$${x} + ${y} = ${x + y}$, a round number, and $${x + y} + ${z} = ${x + y + z}$.`,
            `$${x} + ${y} = ${x + y}$ 是整十数，$${x + y} + ${z} = ${x + y + z}$。`,
          ],
        );
      },
    ),
  ],
  "missing-numbers-within-100": [
    skill(
      "the-whole-before-a-subtraction",
      ["The whole before a subtraction", "减法之前的整体"],
      [
        "In $\\square - 28 = 45$ the box is the whole. Taking 28 away left 45, so the whole is found by putting those parts back together with addition.",
        "在 $\\square - 28 = 45$ 中，方框是整体。去掉 28 后剩下 45，所以把这两部分用加法合起来，就得到整体。",
      ],
      (rng) => {
        const b = rng.int(11, 49);
        const c = rng.int(11, 49);
        return whole(
          [`What number goes in the box? $$\\square - ${b} = ${c}$$`, `方框里填几？$$\\square - ${b} = ${c}$$`],
          b + c,
          [Math.abs(c - b), b + c + 10, b + c - 10],
          [
            `The box is the whole, with parts ${b} and ${c}, so it is $${b} + ${c} = ${b + c}$.`,
            `方框是整体，两部分是 ${b} 和 ${c}，所以它是 $${b} + ${c} = ${b + c}$。`,
          ],
        );
      },
    ),
  ],
  "adding-within-1000-with-models": [
    skill(
      "regrouping-tens-into-a-hundred",
      ["Regrouping tens into a hundred", "把十换成百"],
      [
        "Ten tens can be traded for one hundred. If the tens of two numbers add to more than nine, trade ten of them, and the hundreds grow by one.",
        "10 个十可以换成 1 个百。如果两个数的十相加超过九，就换走十个，百位多 1。",
      ],
      (rng) => {
        const [ha, hb] = [rng.int(1, 4), rng.int(1, 4)];
        const ta = rng.int(3, 9);
        const tb = rng.int(10 - ta, 9);
        const [oa, ob] = [rng.int(0, 4), rng.int(0, 5)];
        const a = ha * 100 + ta * 10 + oa;
        const b = hb * 100 + tb * 10 + ob;
        return whole(
          [`The tens need a trade. What is $${a} + ${b}$?`, `十位需要进位。$${a} + ${b}$ 是多少？`],
          a + b,
          [a + b - 100, (ha + hb) * 100 + ((ta + tb) % 10) * 10 + oa + ob, a + b + 100],
          [
            `${ta} tens and ${tb} tens are ${ta + tb} tens, which trade for 1 hundred and ${ta + tb - 10} tens. With ${ha + hb} hundreds and ${oa + ob} ones the sum is ${a + b}.`,
            `${ta} 个十和 ${tb} 个十是 ${ta + tb} 个十，换成 1 个百和 ${ta + tb - 10} 个十。加上 ${ha + hb} 个百和 ${oa + ob} 个一，和是 ${a + b}。`,
          ],
        );
      },
    ),
  ],
  "subtracting-within-1000-with-models": [
    skill(
      "opening-a-hundred",
      ["Opening a hundred", "拆开一个百"],
      [
        "When there are too few tens to take away, open one hundred into ten tens. The hundreds go down by one and the tens go up by ten, and the number stays the same.",
        "十不够减时，把一个百拆成十个十。百位少 1，十位多 10，这个数的大小不变。",
      ],
      (rng) => {
        const ha = rng.int(3, 9);
        const ta = rng.int(0, 5);
        const oa = rng.int(5, 9);
        const hb = rng.int(1, ha - 1);
        const tb = rng.int(ta + 1, 9);
        const ob = rng.int(0, oa);
        const a = ha * 100 + ta * 10 + oa;
        const b = hb * 100 + tb * 10 + ob;
        return whole(
          [`The tens need a hundred opened. What is $${a} - ${b}$?`, `十位不够减，要拆开一个百。$${a} - ${b}$ 是多少？`],
          a - b,
          [a - b + 100, (ha - hb) * 100 + (tb - ta) * 10 + oa - ob, a - b - 100],
          [
            `Open a hundred: ${a} is ${ha - 1} hundreds, ${ta + 10} tens and ${oa} ones. Taking away gives ${ha - 1 - hb} hundreds, ${ta + 10 - tb} tens and ${oa - ob} ones, which is ${a - b}.`,
            `拆开一个百：${a} 是 ${ha - 1} 个百、${ta + 10} 个十和 ${oa} 个一。减去后得 ${ha - 1 - hb} 个百、${ta + 10 - tb} 个十和 ${oa - ob} 个一，也就是 ${a - b}。`,
          ],
        );
      },
    ),
  ],
  "comparing-word-problems-within-100": [
    skill(
      "how-many-to-catch-up",
      ["How many to catch up", "还要多少才赶上"],
      [
        "To catch up, one person must gain exactly the difference. The comparison can also be read from the other side: having 12 more is the same as the other having 12 fewer.",
        "要赶上别人，就要增加正好等于差的数量。比较也可以从另一边读：多 12 个等于对方少 12 个。",
      ],
      (rng) => {
        const a = rng.int(12, 60);
        const d = rng.int(7, 35);
        const [p, q] = rng.shuffle(earlyNames).slice(0, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        return whole(
          [
            `${p} has ${a} ${thing.en}, which is ${d} fewer than ${q} has. ${q} gives away ${d} ${thing.en}. How many does ${q} have now?`,
            `${p} 有 ${a} 个${thing.zh}，比 ${q} 少 ${d} 个。${q} 送出 ${d} 个${thing.zh}。${q} 现在有多少个？`,
          ],
          a,
          [a + d, a + 2 * d, a - d > 0 ? a - d : a + 1],
          [
            `${q} had ${d} more than ${p}, which is ${a + d}. Giving away those ${d} leaves ${a}, the same as ${p}.`,
            `${q} 比 ${p} 多 ${d} 个，也就是 ${a + d} 个。送出这 ${d} 个后剩 ${a} 个，和 ${p} 一样多。`,
          ],
        );
      },
    ),
  ],
  "two-step-word-problems-within-100": [
    skill(
      "working-back-to-the-start",
      ["Working back to the start", "倒推回开始"],
      [
        "If a story gives the end, undo the steps in reverse order. Each gain is undone by subtracting and each loss is undone by adding, last step first.",
        "如果故事给出了结果，就按相反的顺序还原每一步。得到的用减法还原，失去的用加法还原，从最后一步开始。",
      ],
      (rng) => {
        const start = rng.int(15, 50);
        const gain = rng.int(6, 30);
        const lose = rng.int(4, start);
        const end = start + gain - lose;
        const { who, thing } = storyThing(rng);
        return whole(
          [
            `${who} got ${gain} ${thing.en} and then gave away ${lose}. Now ${who} has ${end}. How many did ${who} have at the start?`,
            `${who} 得到 ${gain} 个${thing.zh}，然后送出 ${lose} 个，现在有 ${end} 个。${who} 开始有多少个？`,
          ],
          start,
          [end + gain - lose, end + gain + lose, end - gain + lose + 2],
          [
            `Go backward: before giving away there were $${end} + ${lose} = ${end + lose}$, and before getting more there were $${end + lose} - ${gain} = ${start}$.`,
            `倒推：送出之前有 $${end} + ${lose} = ${end + lose}$ 个，得到之前有 $${end + lose} - ${gain} = ${start}$ 个。`,
          ],
        );
      },
    ),
  ],
  "measuring-length-in-inches-and-centimeters": [
    skill(
      "the-other-end-on-a-ruler",
      ["The other end on a ruler", "尺子上的另一端"],
      [
        "A length is the distance between the two ends. If one end is at a mark and the length is known, the other end is that many units further along the ruler.",
        "长度是两端之间的距离。如果知道一端的刻度和长度，另一端就在尺子上再往后这么多个单位。",
      ],
      (rng) => {
        const start = rng.int(1, 9);
        const len = rng.int(2, 14);
        const unit: Pair = rng.bool() ? ["inch", "英寸"] : ["centimeter", "厘米"];
        return whole(
          [
            `A straw is ${len} ${unit[0]}${len > 1 ? (unit[0] === "inch" ? "es" : "s") : ""} long. One end lines up with the ${start} mark on a ruler. Which mark does the other end reach, going up?`,
            `一根吸管长 ${len} ${unit[1]}。一端对着尺子上的 ${start} 刻度。另一端往大的方向对着哪个刻度？`,
          ],
          start + len,
          [len, start + len + 1, Math.abs(len - start)],
          [
            `The other end is ${len} further along from ${start}: $${start} + ${len} = ${start + len}$.`,
            `另一端从 ${start} 再往后 ${len}：$${start} + ${len} = ${start + len}$。`,
          ],
        );
      },
    ),
  ],
  "feet-and-meters": [
    skill(
      "feet-and-inches-together",
      ["Feet and inches together", "英尺和英寸合起来"],
      [
        "A length in feet and inches can be turned into inches alone. Each foot is 12 inches, so find the inches in the feet and then add the extra inches.",
        "用英尺和英寸表示的长度可以全部换成英寸。每英尺是 12 英寸，先算出这些英尺是多少英寸，再加上多出的英寸。",
      ],
      (rng) => {
        const f = rng.int(1, 5);
        const i = rng.int(1, 11);
        const things: readonly Pair[] = [
          ["board", "木板"],
          ["rope", "绳子"],
          ["table", "桌子"],
          ["ladder", "梯子"],
          ["fence", "栅栏"],
        ];
        const thing = rng.pick(things);
        return whole(
          [`A ${thing[0]} is ${f} feet ${i} inches long. How long is it in inches?`, `${thing[1]}长 ${f} 英尺 ${i} 英寸。它是多少英寸？`],
          f * 12 + i,
          [f + i, f * 10 + i, f * 12],
          [
            `${f} feet are $${f} \\times 12 = ${f * 12}$ inches, and ${i} more make ${f * 12 + i}.`,
            `${f} 英尺是 $${f} \\times 12 = ${f * 12}$ 英寸，再加 ${i} 英寸是 ${f * 12 + i}。`,
          ],
        );
      },
    ),
  ],
  "same-length-in-different-units": [
    skill(
      "from-small-blocks-to-big-blocks",
      ["From small blocks to big blocks", "从小块到大块"],
      [
        "Going to a larger unit makes the count smaller. If 3 small blocks match one big block, then 12 small blocks match 4 big ones, so count groups of small blocks.",
        "换成更大的单位，数量就变小。如果 3 个小块等于 1 个大块，那么 12 个小块等于 4 个大块，所以要数有几组小块。",
      ],
      (rng) => {
        const per = rng.int(2, 5);
        const big = rng.int(2, 9);
        return whole(
          [
            `A shelf is ${per * big} small blocks long. One big block is as long as ${per} small blocks. How many big blocks long is the shelf?`,
            `书架长 ${per * big} 个小块。1 个大块和 ${per} 个小块一样长。书架长几个大块？`,
          ],
          big,
          [per * big, per * big + per, big + 1],
          [
            `Each big block replaces ${per} small ones, and ${per * big} small ones make ${big} groups of ${per}.`,
            `每个大块代替 ${per} 个小块，${per * big} 个小块可以分成 ${big} 组，每组 ${per} 个。`,
          ],
        );
      },
    ),
  ],
  "estimating-lengths": [
    skill(
      "the-nearer-ten",
      ["Estimating from a list of guesses", "从几个估计中选择"],
      [
        "An estimate should be close to the true length. Compare each guess with a length you know: a finger is about a centimeter wide and a door is about two meters tall.",
        "估计值应该接近真实长度。把每个猜测和你知道的长度比较：手指宽大约 1 厘米，门高大约 2 米。",
      ],
      (rng) => {
        const items: readonly [Pair, string, readonly string[]][] = [
          [["a door", "门"], "2 m", ["2 cm", "20 m", "200 m"]],
          [["a pencil", "铅笔"], "18 cm", ["18 m", "1 cm", "80 m"]],
          [["a car", "小汽车"], "4 m", ["4 cm", "40 cm", "40 m"]],
          [["a classroom", "教室"], "9 m", ["9 cm", "90 cm", "90 m"]],
          [["a book", "书"], "25 cm", ["25 m", "2 cm", "2 m"]],
          [["a paper clip", "回形针"], "3 cm", ["3 m", "30 cm", "30 m"]],
          [["a bus", "公共汽车"], "12 m", ["12 cm", "120 cm", "120 m"]],
          [["a spoon", "勺子"], "15 cm", ["15 m", "1 cm", "1 m"]],
        ];
        const [thing, right, others] = rng.pick(items);
        const who = rng.pick(earlyNames);
        return choose(
          rng,
          [`${who} wants a sensible estimate. About how long is ${thing[0]}?`, `${who} 想做一个合理的估计。${thing[1]}大约多长？`],
          [right, right],
          others.map((o): Pair => [o, o]),
          [
            `Compare with a centimeter, about a finger's width, and a meter, about a long step: ${thing[0]} is about ${right}.`,
            `和 1 厘米（约手指宽）、1 米（约一大步）比较：${thing[1]}大约是 ${right}。`,
          ],
        );
      },
    ),
  ],
  "comparing-lengths-by-measuring": [
    skill(
      "the-longer-length-from-the-difference",
      ["The longer length from the difference", "由差求较长的长度"],
      [
        "A comparison can give a length that was not measured. If one ribbon is 14 inches and another is 9 inches longer, then the longer one is $14 + 9$ inches.",
        "比较可以求出没有量过的长度。如果一根丝带长 14 英寸，另一根比它长 9 英寸，那么较长的一根是 $14 + 9$ 英寸。",
      ],
      (rng) => {
        const a = rng.int(9, 60);
        const d = rng.int(3, 30);
        const longer = rng.bool();
        const items: readonly Pair[] = [
          ["ribbon", "丝带"],
          ["rope", "绳子"],
          ["string", "细绳"],
          ["wire", "铁丝"],
        ];
        const it = rng.pick(items);
        const answer = longer ? a + d : a;
        const shown = longer ? a : a + d;
        return whole(
          longer
            ? [
                `A ${it[0]} is ${a} centimeters long. A second ${it[0]} is ${d} centimeters longer. How long is the second, in centimeters?`,
                `一根${it[1]}长 ${a} 厘米。第二根比它长 ${d} 厘米。第二根长多少厘米？`,
              ]
            : [
                `A ${it[0]} is ${shown} centimeters long. A second ${it[0]} is ${d} centimeters shorter. How long is the second, in centimeters?`,
                `一根${it[1]}长 ${shown} 厘米。第二根比它短 ${d} 厘米。第二根长多少厘米？`,
              ],
          answer,
          [longer ? (a - d > 0 ? a - d : a + 1) : a + 2 * d, d, answer + 10],
          [
            `${longer ? "Longer means add" : "Shorter means subtract"}: the second is ${answer} centimeters.`,
            `${longer ? "长就用加法" : "短就用减法"}：第二根是 ${answer} 厘米。`,
          ],
        );
      },
    ),
  ],
  "length-word-problems": [
    skill(
      "the-length-before-the-cut",
      ["The length before the cut", "剪之前的长度"],
      [
        "If a piece was cut off and the rest is known, the original length is the two pieces together. Add them, because cutting only separated what was already there.",
        "如果剪掉一段，并且知道剩下的长度，那么原长就是两段合起来。用加法，因为剪只是把原有的长度分开了。",
      ],
      (rng) => {
        const cut = rng.int(11, 45);
        const left = rng.int(11, 54);
        const who = rng.pick(earlyNames);
        return whole(
          [
            `${who} cuts ${cut} centimeters off a ribbon and ${left} centimeters are left. How long was the ribbon before the cut, in centimeters?`,
            `${who} 从一根丝带上剪下 ${cut} 厘米，还剩 ${left} 厘米。剪之前丝带长多少厘米？`,
          ],
          cut + left,
          [Math.abs(left - cut), cut + left + 10, cut + left - 10],
          [
            `The two pieces together are the whole ribbon: $${cut} + ${left} = ${cut + left}$.`,
            `两段合起来就是整根丝带：$${cut} + ${left} = ${cut + left}$。`,
          ],
        );
      },
    ),
  ],
  "sums-and-differences-on-a-number-line": [
    skill(
      "the-size-of-the-jump",
      ["The size of the jump", "跳了多远"],
      [
        "The jump between two points on a number line is their difference, in either direction. Subtract the smaller from the larger to find how far apart they are.",
        "数轴上两点之间的跳跃距离就是它们的差，不论方向。用大数减小数，就知道相隔多远。",
      ],
      (rng) => {
        const a = rng.int(5, 60);
        const d = rng.int(5, 39);
        const right = rng.bool();
        const [x, y] = right ? [a, a + d] : [a + d, a];
        return whole(
          [
            `On a number line, a jump starts at ${x} and lands on ${y}. How long is the jump?`,
            `数轴上，一次跳跃从 ${x} 开始，落在 ${y}。这次跳了多远？`,
          ],
          d,
          [a + a + d, y, d + 1],
          [
            `The distance between ${a} and ${a + d} is $${a + d} - ${a} = ${d}$, whichever way the jump goes.`,
            `${a} 和 ${a + d} 之间的距离是 $${a + d} - ${a} = ${d}$，与跳的方向无关。`,
          ],
        );
      },
    ),
  ],
  "telling-time-to-five-minutes": [
    skill(
      "five-minute-steps-later",
      ["Five-minute steps later", "再过几个五分钟"],
      [
        "The long hand moves from one number to the next in 5 minutes. So 10 minutes after 3:20 it has moved two numbers, and the time is 3:30.",
        "长针从一个数走到下一个数要 5 分钟。所以 3:20 过 10 分钟，长针走过两个数，时间是 3:30。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const m = rng.int(1, 7) * 5;
        const steps = rng.int(1, 4);
        return whole(
          [
            `A clock shows ${h}:${String(m).padStart(2, "0")}. The long hand moves on ${steps} number${steps > 1 ? "s" : ""}. How many minutes past the hour is it now?`,
            `钟面显示 ${h}:${String(m).padStart(2, "0")}。长针又走过 ${steps} 个数。现在是这个小时过了多少分钟？`,
          ],
          m + steps * 5,
          [m + steps, m + steps * 10, m],
          [
            `Each number is 5 minutes, so ${steps} number${steps > 1 ? "s are" : " is"} ${steps * 5} minutes, and $${m} + ${steps * 5} = ${m + steps * 5}$.`,
            `每个数是 5 分钟，${steps} 个数是 ${steps * 5} 分钟，$${m} + ${steps * 5} = ${m + steps * 5}$。`,
          ],
        );
      },
    ),
  ],
  "a-m-and-p-m": [
    skill(
      "crossing-noon-or-midnight",
      ["Crossing noon or midnight", "跨过中午或午夜"],
      [
        "The label changes at noon and at midnight. A.m. runs from midnight to noon and p.m. from noon to midnight, so a time a few hours after 10 a.m. may be p.m.",
        "标记在中午和午夜改变。a.m. 从午夜到中午，p.m. 从中午到午夜，所以上午 10 点过几小时可能已经是 p.m.。",
      ],
      (rng) => {
        const am = rng.bool();
        const start = rng.int(8, 11);
        const d = rng.int(13 - start, 6);
        const end = start + d - 12;
        const tag = (x: boolean) => (x ? "a.m." : "p.m.");
        const right = `${end}:00 ${tag(!am)}`;
        return choose(
          rng,
          [
            `The clock says ${start}:00 ${tag(am)} What time will it be in ${d} hours?`,
            `现在是 ${start}:00 ${tag(am)}。${d} 小时后是几点？`,
          ],
          [right, right],
          [`${end}:00 ${tag(am)}`, `${start + d - 12 + 1}:00 ${tag(!am)}`, `${start}:00 ${tag(!am)}`].map((o): Pair => [o, o]),
          [
            `Counting ${d} hours from ${start} passes 12, where the label changes, and ends at ${right}`,
            `从 ${start} 点数 ${d} 小时会经过 12 点，标记在那里改变，结果是 ${right}。`,
          ],
        );
      },
    ),
  ],
  "counting-coins": [
    skill(
      "coins-to-reach-a-dollar",
      ["Coins to reach a dollar", "凑够一美元"],
      [
        "A dollar is worth 100 cents. To find how much is still needed, count the coins you have, then count up from that total to 100.",
        "一美元是 100 美分。要知道还差多少，先数出已有硬币的钱数，再从这个数往上数到 100。",
      ],
      (rng) => {
        const q = rng.int(1, 2);
        const d = rng.int(1, 3);
        const n = rng.int(1, 3);
        const have = q * 25 + d * 10 + n * 5;
        const who = rng.pick(earlyNames);
        return whole(
          [
            `${who} has ${q} quarters, ${d} dimes and ${n} nickels. How many more cents does ${who} need to have one dollar?`,
            `${who} 有 ${q} 个 25 美分硬币、${d} 个 10 美分硬币和 ${n} 个 5 美分硬币。还差多少美分才够一美元？`,
          ],
          100 - have,
          [have, 100 - have + 5, 100 - have + 10],
          [
            `The coins are worth $${q * 25} + ${d * 10} + ${n * 5} = ${have}$ cents, and $100 - ${have} = ${100 - have}$.`,
            `这些硬币值 $${q * 25} + ${d * 10} + ${n * 5} = ${have}$ 美分，$100 - ${have} = ${100 - have}$。`,
          ],
        );
      },
    ),
  ],
  "dollars-and-cents": [
    skill(
      "change-from-a-bill",
      ["Change from a bill", "找零"],
      [
        "Change is what is left of the money paid after the price is taken away. Subtract the price from the bill, or count up from the price to the bill.",
        "找零是付的钱减去价钱后剩下的部分。用钞票面额减去价钱，或者从价钱往上数到面额。",
      ],
      (rng) => {
        const bill = rng.pick([5, 10, 20, 50]);
        const price = rng.int(1, bill - 1);
        const things: readonly Pair[] = [
          ["book", "书"],
          ["ball", "球"],
          ["hat", "帽子"],
          ["toy car", "玩具车"],
          ["puzzle", "拼图"],
        ];
        const thing = rng.pick(things);
        const who = rng.pick(earlyNames);
        return whole(
          [
            `A ${thing[0]} costs ${price} dollars. ${who} pays with a ${bill}-dollar bill. How many dollars of change does ${who} get?`,
            `一个${thing[1]}${price} 美元。${who} 用一张 ${bill} 美元的钞票付款。应找回多少美元？`,
          ],
          bill - price,
          [bill + price, price, bill - price + 1],
          [
            `Take the price from the bill: $${bill} - ${price} = ${bill - price}$. Counting up from ${price} to ${bill} gives the same.`,
            `用面额减去价钱：$${bill} - ${price} = ${bill - price}$。从 ${price} 往上数到 ${bill} 结果也一样。`,
          ],
        );
      },
    ),
  ],
  "line-plots-of-lengths": [
    skill(
      "marks-in-all-from-a-description",
      ["How many marks in all", "一共有多少个标记"],
      [
        "Each mark on a line plot stands for one thing measured. To find how many were measured, add the marks above every length, not the lengths themselves.",
        "线状图上每个标记代表一个被测量的物品。要知道测量了多少个，就把每个长度上方的标记数相加，而不是把长度相加。",
      ],
      (rng) => {
        const lens = [rng.int(2, 5), rng.int(6, 8), rng.int(9, 12)];
        const marks = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)];
        return whole(
          [
            `A line plot of pencil lengths has ${marks[0]} marks above ${lens[0]} inches, ${marks[1]} above ${lens[1]} inches and ${marks[2]} above ${lens[2]} inches. How many pencils were measured?`,
            `一张铅笔长度线状图上，${lens[0]} 英寸上方有 ${marks[0]} 个标记，${lens[1]} 英寸上方有 ${marks[1]} 个，${lens[2]} 英寸上方有 ${marks[2]} 个。一共测量了多少支铅笔？`,
          ],
          marks[0]! + marks[1]! + marks[2]!,
          [lens[0]! + lens[1]! + lens[2]!, marks[0]! + marks[1]!, Math.max(...marks)],
          [
            `Each mark is one pencil, so add the marks: $${marks[0]} + ${marks[1]} + ${marks[2]} = ${marks[0]! + marks[1]! + marks[2]!}$.`,
            `每个标记是一支铅笔，所以把标记数相加：$${marks[0]} + ${marks[1]} + ${marks[2]} = ${marks[0]! + marks[1]! + marks[2]!}$。`,
          ],
        );
      },
    ),
  ],
  "picture-graphs-of-single-units": [
    skill(
      "the-missing-row",
      ["The missing row", "缺少的一行"],
      [
        "If the total of a graph is known, a hidden row can be worked out. Add the rows you can see and subtract from the total; the rest belongs to the hidden row.",
        "如果知道统计图的总数，就能算出被遮住的一行。把看得见的行相加，再从总数中减去，剩下的就是被遮住的一行。",
      ],
      (rng) => {
        const [a, b, c] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
        const total = a + b + c;
        return whole(
          [
            `A picture graph shows ${total} votes in all. Row A has ${a} dots and row B has ${b}. Each dot is one vote. How many dots does row C have?`,
            `一张图画统计图一共有 ${total} 票。A 行有 ${a} 个点，B 行有 ${b} 个点。每个点代表一票。C 行有多少个点？`,
          ],
          c,
          [a + b, total, c + 1],
          [
            `Rows A and B hold $${a} + ${b} = ${a + b}$, and $${total} - ${a + b} = ${c}$ are left for row C.`,
            `A、B 两行共有 $${a} + ${b} = ${a + b}$，$${total} - ${a + b} = ${c}$，所以 C 行有 ${c} 个点。`,
          ],
        );
      },
    ),
  ],
  "reading-bar-graphs": [
    skill(
      "the-bar-from-a-comparison",
      ["A bar from a comparison", "由比较求条形的值"],
      [
        "A comparison tells where a bar must stop. If bar B is 6 more than bar A, its top is 6 above the top of bar A; if 6 fewer, it is 6 below.",
        "比较可以告诉我们条形应该到哪里。如果 B 比 A 多 6，它的顶端就比 A 高 6；如果少 6，就比 A 低 6。",
      ],
      (rng) => {
        const a = rng.int(12, 40);
        const d = rng.int(2, 11);
        const more = rng.bool();
        const answer = more ? a + d : a - d;
        return whole(
          more
            ? [
                `Bar A on a graph stops at ${a}. Bar B is ${d} more than bar A. Where does bar B stop?`,
                `统计图上 A 条形到 ${a}。B 条形比 A 多 ${d}。B 条形到几？`,
              ]
            : [
                `Bar A on a graph stops at ${a}. Bar B is ${d} fewer than bar A. Where does bar B stop?`,
                `统计图上 A 条形到 ${a}。B 条形比 A 少 ${d}。B 条形到几？`,
              ],
          answer,
          [more ? a - d : a + d, d, answer + 1],
          [
            `${more ? "More means add" : "Fewer means subtract"}: bar B stops at ${answer}.`,
            `${more ? "多就用加法" : "少就用减法"}：B 条形到 ${answer}。`,
          ],
        );
      },
    ),
  ],
  "naming-polygons-by-their-sides": [
    skill(
      "sides-from-the-name",
      ["Sides from the name", "由名称说边数"],
      [
        "A polygon's name tells its number of sides: triangle 3, quadrilateral 4, pentagon 5, hexagon 6, octagon 8. Several of the same shape have that many sides each.",
        "多边形的名称说明了它的边数：三角形 3，四边形 4，五边形 5，六边形 6，八边形 8。几个相同的图形，每个都有这么多条边。",
      ],
      (rng) => {
        const kinds: readonly [Pair, number][] = [
          [["triangles", "三角形"], 3],
          [["quadrilaterals", "四边形"], 4],
          [["pentagons", "五边形"], 5],
          [["hexagons", "六边形"], 6],
          [["octagons", "八边形"], 8],
        ];
        const [name, sides] = rng.pick(kinds);
        const k = rng.int(2, 9);
        return whole(
          [`How many sides do ${k} ${name[0]} have in all? They do not touch.`, `${k} 个${name[1]}一共有多少条边？它们互不接触。`],
          k * sides,
          [k + sides, sides, k * (sides + 1)],
          [
            `Each of the ${name[0]} has ${sides} sides, so ${k} of them have $${k} \\times ${sides} = ${k * sides}$.`,
            `每个${name[1]}有 ${sides} 条边，所以 ${k} 个有 $${k} \\times ${sides} = ${k * sides}$ 条。`,
          ],
        );
      },
    ),
  ],
  "counting-sides-and-angles": [
    skill(
      "angles-match-sides",
      ["Angles match sides", "角数和边数相同"],
      [
        "Every polygon has as many angles as sides, because each corner joins two sides and going around meets each once. So the angle count gives the side count at once.",
        "每个多边形的角数和边数相同，因为每个角连接两条边，绕一圈每个都遇到一次。所以知道角数就立刻知道边数。",
      ],
      (rng) => {
        const a = rng.int(3, 12);
        const k = rng.int(2, 6);
        return whole(
          [
            `A closed shape with straight sides has ${a} angles. Grace draws ${k} of these shapes. How many sides do they have in all?`,
            `一个由直边围成的封闭图形有 ${a} 个角。Grace 画了 ${k} 个这样的图形。它们一共有多少条边？`,
          ],
          a * k,
          [a + k, a, a * k + k],
          [
            `Each shape has as many sides as angles, ${a}, so ${k} shapes have $${k} \\times ${a} = ${a * k}$ sides.`,
            `每个图形的边数和角数相同，都是 ${a}，所以 ${k} 个图形有 $${k} \\times ${a} = ${a * k}$ 条边。`,
          ],
        );
      },
    ),
  ],
  "faces-of-a-cube": [
    skill(
      "faces-seen-in-a-row-of-cubes",
      ["Faces hidden in a row of cubes", "一排方块中被遮住的面"],
      [
        "A cube has 6 faces. When cubes are glued in a row, each join hides two faces, one from each cube, so the faces left showing are fewer than 6 for each cube.",
        "一个正方体有 6 个面。方块粘成一排时，每处接缝遮住两个面（两个方块各一个），所以露在外面的面比每块 6 个要少。",
      ],
      (rng) => {
        const k = rng.int(2, 12);
        const total = 6 * k - 2 * (k - 1);
        const kind: Pair = rng.pick([
          ["cubes", "正方体"],
          ["wooden cubes", "木制正方体"],
          ["gift boxes shaped like cubes", "正方体礼盒"],
        ] as const);
        return whole(
          [
            `${k} ${kind[0]} are glued face to face in a straight row. How many faces can still be seen from outside, including the bottom?`,
            `${k} 个${kind[1]}面对面粘成一条直排。从外面还能看到多少个面（包括底面）？`,
          ],
          total,
          [6 * k, 6 * k - (k - 1), total + 2],
          [
            `${k} cubes have ${6 * k} faces. The ${k - 1} join${k > 2 ? "s" : ""} hide${k > 2 ? "" : "s"} two faces each, ${2 * (k - 1)} in all, leaving ${total}.`,
            `${k} 个方块共有 ${6 * k} 个面。${k - 1} 处接缝各遮住两个面，共 ${2 * (k - 1)} 个，剩下 ${total} 个。`,
          ],
        );
      },
    ),
  ],
  "rows-and-columns-of-squares": [
    skill(
      "the-missing-rows-from-the-total",
      ["Rows from the total", "由总数求行数"],
      [
        "A rectangle cut into equal rows has the same number of squares in each row. Counting by that number shows how many rows it takes to reach the total.",
        "分成相同行的长方形，每行方块数相同。按这个数往上数，就能知道多少行才到总数。",
      ],
      (rng) => {
        const per = rng.int(2, 5);
        const rows = rng.int(2, 5);
        const who = rng.pick(earlyNames);
        return whole(
          [
            `${who} cuts a tray of brownies into ${per * rows} equal pieces, with ${per} pieces in each row. How many rows are there?`,
            `${who} 把一盘布朗尼切成 ${per * rows} 块相同的，每行 ${per} 块。一共有几行？`,
          ],
          rows,
          [per * rows, per, rows + 1],
          [
            `Counting by ${per}s reaches ${per * rows} after ${rows} counts, so there are ${rows} rows.`,
            `${per} 个 ${per} 个地数，数 ${rows} 次到 ${per * rows}，所以有 ${rows} 行。`,
          ],
        );
      },
    ),
  ],
};
