// A third knowledge point for the 4th Grade Math topics on fractions, decimals, units, line plots and
// basic geometry: stories built on the skill, the reverse question and the usual traps.

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

/** fraction builds a problem whose answer is a fraction. */
const fraction = (prompt: Pair, answer: Q, wrong: readonly Q[], solution: Pair) =>
  numberProblem({ prompt: t(prompt[0], prompt[1]), answer, wrong, solution: t(solution[0], solution[1]) });

/** frac writes a fraction in LaTeX. */
const frac = (n: number, d: number) => `\\frac{${n}}{${d}}`;

/** commas writes a whole number with thousands separators for LaTeX. */
const commas = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}");

/** gcd finds the greatest common factor of two whole numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** metricGap builds the knowledge point of how far apart two amounts in different metric units are. */
const metricGap = (id: string, big: Pair, small: Pair, title: Pair) =>
  skill(
    id,
    title,
    [
      `To compare amounts in ${big[0]} and ${small[0]}, write both in ${small[0]} first. There are 1,000 ${small[0]} in each of the ${big[0]}, and then a plain subtraction gives the gap.`,
      `比较以${big[1]}和${small[1]}为单位的量时，先都化成${small[1]}。1 ${big[1]}等于 1,000 ${small[1]}，然后用减法求出相差多少。`,
    ],
    (rng) => {
      const k = rng.int(2, 15);
      const other = (k - 1) * 1000 + rng.int(100, 950);
      return whole(
        [
          `How many ${small[0]} more is ${k} ${big[0]} than ${commas(other)} ${small[0]}?`,
          `${k} ${big[1]}比 ${commas(other)} ${small[1]}多多少${small[1]}？`,
        ],
        k * 1000 - other,
        [other - k, Math.abs(k * 100 - other), k * 1000 + other],
        [
          `$${k} \\times 1000 = ${commas(k * 1000)}$ ${small[0]}, and $${commas(k * 1000)} - ${commas(other)} = ${commas(k * 1000 - other)}$.`,
          `$${k} \\times 1000 = ${commas(k * 1000)}$ ${small[1]}，$${commas(k * 1000)} - ${commas(other)} = ${commas(k * 1000 - other)}$。`,
        ],
      );
    },
  );

/** deeperGrade4Third2Points holds the third knowledge points of more 4th Grade Math topics, by topic. */
export const deeperGrade4Third2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "converting-improper-fractions-to-mixed-numbers": [
    skill(
      "whole-things-from-equal-pieces",
      ["Whole things from equal pieces", "由等份拼成整体"],
      [
        "An improper fraction counts pieces, and its mixed number says how many whole things those pieces make. Dividing the top by the bottom gives the whole things, and the remainder is the pieces left over.",
        "假分数数的是份数，化成带分数后可以看出这些份能拼成几个整体。分子除以分母得到整体的个数，余数是剩下的份数。",
      ],
      (rng) => {
        const d = rng.pick([3, 4, 5, 6, 8]);
        const q = rng.int(2, 9);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return whole(
          [
            `A baker has ${n} slices of pie, each $${frac(1, d)}$ of a pie. How many whole pies can the slices make?`,
            `面包师有 ${n} 块馅饼，每块是一个馅饼的 $${frac(1, d)}$。这些馅饼块能拼成几个完整的馅饼？`,
          ],
          q,
          [q + 1, r, d],
          [
            `$${frac(n, d)} = ${q}${frac(r, d)}$, so ${q} whole pies and ${r} slices left over.`,
            `$${frac(n, d)} = ${q}${frac(r, d)}$，所以能拼成 ${q} 个完整的馅饼，还剩 ${r} 块。`,
          ],
        );
      },
    ),
  ],
  "converting-mixed-numbers-to-improper-fractions": [
    skill(
      "counting-the-equal-pieces",
      ["Counting the equal pieces", "数等份的个数"],
      [
        "The top of an improper fraction counts every equal piece. Each whole holds as many pieces as the denominator, and the pieces of the fraction part are added on at the end.",
        "假分数的分子数的是所有等份。每个整体有分母那么多份，最后再加上分数部分的份数。",
      ],
      (rng) => {
        const d = rng.pick([2, 3, 4, 5, 6, 8]);
        const a = rng.int(2, 9);
        const n = rng.int(1, d - 1);
        return whole(
          [
            `A cook has $${a}${frac(n, d)}$ cakes and cuts them into pieces of $${frac(1, d)}$ of a cake. How many pieces are there?`,
            `厨师有 $${a}${frac(n, d)}$ 个蛋糕，切成每块为一个蛋糕的 $${frac(1, d)}$。一共有多少块？`,
          ],
          a * d + n,
          [a * d, a + n, a * n + d],
          [
            `$${a} \\times ${d} = ${a * d}$ pieces from the whole cakes, plus ${n} more: ${a * d + n}.`,
            `整个的蛋糕有 $${a} \\times ${d} = ${a * d}$ 块，再加 ${n} 块：共 ${a * d + n} 块。`,
          ],
        );
      },
    ),
  ],
  "finding-equivalent-fractions-using-area-models": [
    skill(
      "cutting-every-part-again",
      ["Cutting every part again", "把每份再切开"],
      [
        "Cutting every part of a model into the same number of smaller parts multiplies both the shaded count and the total count by that number. The shaded amount itself does not change.",
        "把模型的每一份都切成同样多的小份，涂色的份数和总份数都乘上这个数。涂色部分的大小不变。",
      ],
      (rng) => {
        const d = rng.int(2, 8);
        const a = rng.int(1, d - 1);
        const k = rng.int(2, 6);
        const askShaded = rng.bool();
        return whole(
          askShaded
            ? [
                `A bar shows $${frac(a, d)}$ shaded. Every part is cut into ${k} equal smaller parts. How many small parts are shaded now?`,
                `一个长条涂了 $${frac(a, d)}$。每份再切成 ${k} 个相等的小份。现在涂了多少小份？`,
              ]
            : [
                `A bar shows $${frac(a, d)}$ shaded. Every part is cut into ${k} equal smaller parts. How many small parts does the bar have now?`,
                `一个长条涂了 $${frac(a, d)}$。每份再切成 ${k} 个相等的小份。现在长条一共有多少小份？`,
              ],
          askShaded ? a * k : d * k,
          askShaded ? [d * k, a + k, a] : [a * k, d + k, d],
          [
            `The fraction becomes $${frac(a * k, d * k)}$, since both counts are multiplied by ${k}.`,
            `分数变成 $${frac(a * k, d * k)}$，因为两个数都乘了 ${k}。`,
          ],
        );
      },
    ),
  ],
  "equivalent-fractions": [
    skill(
      "the-fraction-that-does-not-belong",
      ["The fraction that does not belong", "找出不相等的分数"],
      [
        "Equivalent fractions come from multiplying the top and the bottom by the same number. Adding the same number to both does not keep the value, and that is the usual slip.",
        "分子和分母同时乘同一个数，得到相等的分数。同时加同一个数不能保持分数的值，这是常见的错误。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const n = rng.int(1, d - 1);
        const add = rng.int(1, 5);
        const [a, b, c] = rng.sample([2, 3, 4, 5, 6], 3) as [number, number, number];
        return chooseMath(
          rng,
          [`Which fraction is not equal to $${frac(n, d)}$?`, `哪个分数不等于 $${frac(n, d)}$？`],
          frac(n + add, d + add),
          [frac(n * a, d * a), frac(n * b, d * b), frac(n * c, d * c)],
          [
            `$${frac(n + add, d + add)}$ adds ${add} to both numbers, which changes the value. The others multiply both by the same number.`,
            `$${frac(n + add, d + add)}$ 是分子分母同时加 ${add}，值变了。其他的都是同时乘同一个数。`,
          ],
        );
      },
    ),
  ],
  "least-common-denominators": [
    skill(
      "the-least-common-denominator-of-three",
      ["The least common denominator of three fractions", "三个分数的最小公分母"],
      [
        "The least common denominator of three fractions is the smallest number that all three denominators divide into. List the multiples of the largest denominator and test each against the others.",
        "三个分数的最小公分母是三个分母都能整除的最小的数。列出最大分母的倍数，逐个用其他分母检验。",
      ],
      (rng) => {
        const [a, b, c] = rng.sample([2, 3, 4, 5, 6, 8, 9, 10, 12], 3) as [number, number, number];
        const lcm2 = (x: number, y: number) => (x * y) / gcd(x, y);
        const l = lcm2(lcm2(a, b), c);
        return whole(
          [
            `Find the least common denominator of $${frac(1, a)}$, $${frac(1, b)}$ and $${frac(1, c)}$.`,
            `求 $${frac(1, a)}$、$${frac(1, b)}$ 和 $${frac(1, c)}$ 的最小公分母。`,
          ],
          l,
          [a * b * c === l ? l * 2 : a * b * c, Math.max(a, b, c), a + b + c],
          [
            `${l} is the first multiple of ${Math.max(a, b, c)} that ${a}, ${b} and ${c} all divide.`,
            `${l} 是 ${Math.max(a, b, c)} 的倍数中第一个能同时被 ${a}、${b}、${c} 整除的数。`,
          ],
        );
      },
    ),
  ],
  "writing-fractions-in-lowest-terms": [
    skill(
      "the-fraction-before-simplifying",
      ["The fraction before simplifying", "约分之前的分数"],
      [
        "Simplifying divides the top and bottom by the same number, so multiplying by that number gives back the original. The lowest-terms form alone does not tell which fraction it came from, but the factor does.",
        "约分是分子分母同时除以一个数，所以乘这个数就能还原。只看最简分数不知道原来的分数，但知道约去的因数就可以。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const n = rng.int(1, d - 1);
        const k = rng.int(2, 9);
        const a = n / gcd(n, d);
        const b = d / gcd(n, d);
        const top = rng.bool();
        return whole(
          top
            ? [
                `A fraction simplifies to $${frac(a, b)}$ after dividing its top and bottom by ${k}. What was its top number?`,
                `一个分数的分子分母同时除以 ${k} 后约成 $${frac(a, b)}$。原来的分子是多少？`,
              ]
            : [
                `A fraction simplifies to $${frac(a, b)}$ after dividing its top and bottom by ${k}. What was its bottom number?`,
                `一个分数的分子分母同时除以 ${k} 后约成 $${frac(a, b)}$。原来的分母是多少？`,
              ],
          top ? a * k : b * k,
          top ? [b * k, a + k, a] : [a * k, b + k, b],
          [`Multiply back by ${k}: the fraction was $${frac(a * k, b * k)}$.`, `乘回 ${k}：原来的分数是 $${frac(a * k, b * k)}$。`],
        );
      },
    ),
  ],
  "comparing-fractions-using-unit-benchmarks": [
    skill(
      "the-fraction-closest-to-one",
      ["The fraction closest to one", "最接近 1 的分数"],
      [
        "A fraction one part short of a whole is a single unit fraction away from 1. The larger the denominator, the smaller that part, and so the closer the fraction is to 1.",
        "只差一份就到 1 的分数，与 1 的距离是一个单位分数。分母越大，这一份越小，分数就越接近 1。",
      ],
      (rng) => {
        const ds = (rng.sample([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20], 4) as number[]).sort((a, b) => b - a);
        const [best, ...others] = ds as [number, ...number[]];
        return chooseMath(
          rng,
          ["Which fraction is closest to 1?", "哪个分数最接近 1？"],
          frac(best - 1, best),
          others.map((d) => frac(d - 1, d)),
          [
            `Each is one part short of 1, and $${frac(1, best)}$ is the smallest part, so $${frac(best - 1, best)}$ is closest.`,
            `每个分数都差一份到 1，其中 $${frac(1, best)}$ 这一份最小，所以 $${frac(best - 1, best)}$ 最接近 1。`,
          ],
        );
      },
    ),
  ],
  "comparing-fractions-using-one-half-benchmarks": [
    skill(
      "half-of-the-denominator",
      ["Half of the denominator", "分母的一半"],
      [
        "A fraction equals one half when its top is half of its bottom. So comparing the top with half of the bottom tells at once whether the fraction is above or below one half.",
        "分子是分母的一半时，分数等于二分之一。所以把分子和分母的一半比较，立刻知道分数大于还是小于二分之一。",
      ],
      (rng) => {
        const half = rng.int(3, 30);
        const d = half * 2;
        const above = rng.bool();
        return whole(
          above
            ? [
                `What is the smallest whole number $n$ that makes $\\frac{n}{${d}}$ greater than $${frac(1, 2)}$?`,
                `使 $\\frac{n}{${d}}$ 大于 $${frac(1, 2)}$ 的最小整数 $n$ 是多少？`,
              ]
            : [
                `What is the largest whole number $n$ that makes $\\frac{n}{${d}}$ less than $${frac(1, 2)}$?`,
                `使 $\\frac{n}{${d}}$ 小于 $${frac(1, 2)}$ 的最大整数 $n$ 是多少？`,
              ],
          above ? half + 1 : half - 1,
          [half, above ? half - 1 : half + 1, d],
          [
            `Half of ${d} is ${half}, so $${frac(half, d)} = ${frac(1, 2)}$ exactly. The next number ${above ? "up" : "down"} is ${above ? half + 1 : half - 1}.`,
            `${d} 的一半是 ${half}，所以 $${frac(half, d)} = ${frac(1, 2)}$。${above ? "再大一点" : "再小一点"}的整数是 ${above ? half + 1 : half - 1}。`,
          ],
        );
      },
    ),
  ],
  "comparing-fraction-models-using-common-denominators": [
    skill(
      "how-many-small-parts-apart",
      ["How many small parts apart", "相差几小份"],
      [
        "Once two models are cut into parts of the same size, the difference between them is simply the difference in shaded parts. Rewrite the coarser model first, or the counts cannot be compared.",
        "两个模型切成同样大小的份后，它们的差就是涂色份数的差。要先改写分得较粗的模型，否则份数不能比较。",
      ],
      (rng) => {
        const d = rng.int(2, 6);
        const k = rng.int(2, 4);
        const a = rng.int(1, d - 1);
        let c = rng.int(1, d * k - 1);
        if (c === a * k) c = c < d * k - 1 ? c + 1 : c - 1;
        return whole(
          [
            `Two equal bars show $${frac(a, d)}$ and $${frac(c, d * k)}$. Using parts of size $${frac(1, d * k)}$, how many parts apart are they?`,
            `两个一样大的长条表示 $${frac(a, d)}$ 和 $${frac(c, d * k)}$。以 $${frac(1, d * k)}$ 为一份，它们相差多少份？`,
          ],
          Math.abs(a * k - c),
          [Math.abs(a - c), a * k + c, d * k - c],
          [
            `$${frac(a, d)} = ${frac(a * k, d * k)}$, and ${a * k} and ${c} are ${Math.abs(a * k - c)} apart.`,
            `$${frac(a, d)} = ${frac(a * k, d * k)}$，${a * k} 和 ${c} 相差 ${Math.abs(a * k - c)}。`,
          ],
        );
      },
    ),
  ],
  "comparing-fractions-using-common-denominators": [
    skill(
      "the-largest-top-that-stays-below",
      ["The largest top that stays below", "仍然较小的最大分子"],
      [
        "To find which tops keep one fraction below another, rewrite the other fraction with the same denominator. Then the unknown top only has to stay below the new top.",
        "要找出哪些分子能使分数小于另一个分数，先把另一个分数改写成相同分母。然后未知的分子只要小于新的分子。",
      ],
      (rng) => {
        const d = rng.int(2, 8);
        const k = rng.int(2, 5);
        const a = rng.int(1, d - 1);
        return whole(
          [
            `What is the largest whole number $n$ with $\\frac{n}{${d * k}} < ${frac(a, d)}$?`,
            `满足 $\\frac{n}{${d * k}} < ${frac(a, d)}$ 的最大整数 $n$ 是多少？`,
          ],
          a * k - 1,
          [a * k, a - 1, a * k + 1],
          [
            `$${frac(a, d)} = ${frac(a * k, d * k)}$, so $n$ must be below ${a * k}, and the largest such number is ${a * k - 1}.`,
            `$${frac(a, d)} = ${frac(a * k, d * k)}$，所以 $n$ 要小于 ${a * k}，最大是 ${a * k - 1}。`,
          ],
        );
      },
    ),
  ],
  "adding-fractions-with-like-denominators-using-models": [
    skill(
      "parts-still-needed-for-a-whole",
      ["Parts still needed for a whole", "还差几份到整体"],
      [
        "A whole bar has as many parts as the denominator. After shading two amounts, the unshaded parts are the denominator minus both numerators, and that is what the sum still lacks to reach 1.",
        "一个完整的长条有分母那么多份。涂了两部分后，未涂的份数是分母减去两个分子，这就是和距离 1 还差的部分。",
      ],
      (rng) => {
        const d = rng.int(4, 15);
        const a = rng.int(1, d - 2);
        const b = rng.int(1, d - a - 1);
        return whole(
          [
            `A model shows $${frac(a, d)} + ${frac(b, d)}$. How many more parts of size $${frac(1, d)}$ are needed to fill a whole bar?`,
            `一个模型表示 $${frac(a, d)} + ${frac(b, d)}$。还需要多少个 $${frac(1, d)}$ 才能填满一个长条？`,
          ],
          d - a - b,
          [a + b, d - a, d],
          [
            `The sum shows ${a + b} of the ${d} parts, leaving $${d} - ${a + b} = ${d - a - b}$.`,
            `和是 ${d} 份中的 ${a + b} 份，还差 $${d} - ${a + b} = ${d - a - b}$ 份。`,
          ],
        );
      },
    ),
  ],
  "adding-fractions-with-like-denominators": [
    skill(
      "a-missing-fraction-in-a-sum",
      ["A missing fraction in a sum", "加法中缺少的分数"],
      [
        "When the denominators match, only the tops are counted. A missing addend is found by subtracting tops, just as it is with whole numbers, and the denominator stays the same.",
        "分母相同时，只数分子。缺少的加数用分子相减求出，和整数一样，分母不变。",
      ],
      (rng) => {
        const d = rng.int(3, 20);
        const a = rng.int(1, d - 1);
        const b = rng.int(1, d);
        return whole(
          [
            `Fill in the box: $$${frac(a, d)} + \\frac{\\square}{${d}} = ${frac(a + b, d)}$$`,
            `填方框：$$${frac(a, d)} + \\frac{\\square}{${d}} = ${frac(a + b, d)}$$`,
          ],
          b,
          [a + b, 2 * a + b, b === d ? d - 1 : d],
          [`The tops must total ${a + b}, and $${a + b} - ${a} = ${b}$.`, `分子的和是 ${a + b}，$${a + b} - ${a} = ${b}$。`],
        );
      },
    ),
  ],
  "subtracting-fractions-with-like-denominators": [
    skill(
      "a-missing-fraction-in-a-difference",
      ["A missing fraction in a difference", "减法中缺少的分数"],
      [
        "A difference with a missing amount taken away is still about the tops alone. Subtract the difference's top from the starting top; the size of the parts never changes.",
        "减去的数未知时，仍然只看分子。用被减数的分子减去差的分子；每份的大小不变。",
      ],
      (rng) => {
        const d = rng.int(4, 20);
        const c = rng.int(3, d);
        const r = rng.int(1, c - 1);
        return whole(
          [
            `Fill in the box: $$${frac(c, d)} - \\frac{\\square}{${d}} = ${frac(r, d)}$$`,
            `填方框：$$${frac(c, d)} - \\frac{\\square}{${d}} = ${frac(r, d)}$$`,
          ],
          c - r,
          [c + r, d - r, r],
          [
            `$${c} - ${r} = ${c - r}$, so $${frac(c - r, d)}$ was taken away.`,
            `$${c} - ${r} = ${c - r}$，所以减去了 $${frac(c - r, d)}$。`,
          ],
        );
      },
    ),
  ],
  "adding-fractions-with-like-denominators-word-problems": [
    skill(
      "the-part-not-yet-done",
      ["The part not yet done", "还没完成的部分"],
      [
        "A whole job is 1, which can be written with any denominator. After adding the parts already done, subtract their sum from the whole to get the part that remains.",
        "整件事是 1，可以写成任意分母的形式。把已完成的部分相加，再从整体中减去，就得到剩下的部分。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const d = rng.pick([5, 6, 7, 8, 9, 10, 11, 12]);
        const a = rng.int(1, d - 2);
        const b = rng.int(1, d - a - 1);
        const left = d - a - b;
        return fraction(
          [
            `${who} painted $${frac(a, d)}$ of a fence on Monday and $${frac(b, d)}$ of it on Tuesday. What fraction of the fence is still unpainted?`,
            `${who} 周一刷了栅栏的 $${frac(a, d)}$，周二刷了 $${frac(b, d)}$。栅栏还有几分之几没刷？`,
          ],
          Q.of(left, d),
          [Q.of(a + b, d), Q.of(left, 2 * d), Q.of(a, d)].filter((w) => !w.eq(Q.of(left, d))),
          [
            `The painted part is $${frac(a + b, d)}$, and $${frac(d, d)} - ${frac(a + b, d)} = ${frac(left, d)}$.`,
            `已刷的部分是 $${frac(a + b, d)}$，$${frac(d, d)} - ${frac(a + b, d)} = ${frac(left, d)}$。`,
          ],
        );
      },
    ),
  ],
  "subtracting-fractions-with-like-denominators-word-problems": [
    skill(
      "how-much-there-was-at-first",
      ["How much there was at first", "原来有多少"],
      [
        "When an amount was used and some is left, what there was at first is the sum of the two. A story that says used and left is a subtraction told backwards, so it calls for adding.",
        "用掉一部分还剩一部分时，原来的量是两者之和。说“用掉”和“剩下”的故事是倒过来讲的减法，所以要用加法。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const d = rng.pick([5, 6, 7, 8, 9, 10, 11, 12]);
        const used = rng.int(1, d - 2);
        const left = rng.int(1, d - used - 1);
        const first = Q.of(used + left, d);
        return fraction(
          [
            `${who} used $${frac(used, d)}$ cup of flour and has $${frac(left, d)}$ cup left. How many cups were there at first?`,
            `${who} 用了 $${frac(used, d)}$ 杯面粉，还剩 $${frac(left, d)}$ 杯。原来有多少杯？`,
          ],
          first,
          [Q.of(Math.abs(used - left) + d, 2 * d), Q.of(used + left, 2 * d), Q.of(d + 1, d)].filter((w) => !w.eq(first)),
          [
            `What was used and what is left make up the start: $${frac(used, d)} + ${frac(left, d)} = ${frac(used + left, d)}$.`,
            `用掉的和剩下的合起来就是原来的量：$${frac(used, d)} + ${frac(left, d)} = ${frac(used + left, d)}$。`,
          ],
        );
      },
    ),
  ],
  "decomposing-fractions-into-sums-using-models": [
    skill(
      "copies-of-a-non-unit-fraction",
      ["Copies of a larger piece", "较大份的个数"],
      [
        "A model can be split into pieces larger than one part. Each piece of two parts uses up two of the shaded parts, so the number of pieces is the shaded count divided by two.",
        "模型可以拆成比一份更大的块。每块两份会用掉两个涂色的份，所以块数是涂色份数除以 2。",
      ],
      (rng) => {
        const size = rng.int(2, 4);
        const copies = rng.int(2, 6);
        const n = size * copies;
        const d = n + rng.int(1, 6);
        return whole(
          [
            `A model shows $${frac(n, d)}$. How many copies of $${frac(size, d)}$ add up to it?`,
            `一个模型表示 $${frac(n, d)}$。多少个 $${frac(size, d)}$ 相加等于它？`,
          ],
          copies,
          [n, n - size, d],
          [
            `$${n} \\div ${size} = ${copies}$, so ${copies} copies of $${frac(size, d)}$ are needed.`,
            `$${n} \\div ${size} = ${copies}$，所以需要 ${copies} 个 $${frac(size, d)}$。`,
          ],
        );
      },
    ),
  ],
  "decomposing-fractions-into-sums": [
    skill(
      "unit-fractions-in-a-mixed-number",
      ["Unit fractions in a mixed number", "带分数中的单位分数"],
      [
        "A mixed number can also be written as a sum of unit fractions. Each whole gives as many copies as the denominator, and the fraction part gives as many as its top.",
        "带分数也可以写成单位分数的和。每个整体贡献分母那么多个，分数部分贡献分子那么多个。",
      ],
      (rng) => {
        const d = rng.int(2, 10);
        const a = rng.int(1, 6);
        const n = rng.int(1, d - 1);
        return whole(
          [`How many copies of $${frac(1, d)}$ add up to $${a}${frac(n, d)}$?`, `多少个 $${frac(1, d)}$ 相加等于 $${a}${frac(n, d)}$？`],
          a * d + n,
          [a + n, a * d, d + n],
          [`$${a} \\times ${d} + ${n} = ${a * d + n}$ copies.`, `$${a} \\times ${d} + ${n} = ${a * d + n}$ 个。`],
        );
      },
    ),
  ],
  "adding-mixed-numbers-with-like-denominators": [
    skill(
      "the-whole-part-of-a-mixed-sum",
      ["The whole part of a mixed sum", "带分数和的整数部分"],
      [
        "The whole part of a sum is not always just the sum of the whole parts. When the fraction parts total one or more, one extra whole carries over, so check the tops first.",
        "和的整数部分不一定只是整数部分相加。分数部分的和达到 1 或更多时，要多进一个整数，所以先看分子。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const a = rng.int(1, 15);
        const b = rng.int(1, 15);
        const n = rng.int(1, d - 1);
        const m = rng.int(1, d - 1);
        const carry = n + m >= d ? 1 : 0;
        return whole(
          [
            `What is the whole-number part of $${a}${frac(n, d)} + ${b}${frac(m, d)}$, written as a mixed number?`,
            `$${a}${frac(n, d)} + ${b}${frac(m, d)}$ 写成带分数后，整数部分是多少？`,
          ],
          a + b + carry,
          [a + b + 1 - carry, a + b + 2, a + b + n + m],
          [
            `The tops total ${n + m}, which ${carry ? `is at least ${d}, so one whole carries over` : `is less than ${d}, so nothing carries`}. The whole part is ${a + b + carry}.`,
            `分子的和是 ${n + m}，${carry ? `不小于 ${d}，所以进一个整数` : `小于 ${d}，所以不进位`}。整数部分是 ${a + b + carry}。`,
          ],
        );
      },
    ),
  ],
  "subtracting-mixed-numbers-with-like-denominators": [
    skill(
      "up-to-the-next-whole",
      ["Up to the next whole", "到下一个整数"],
      [
        "The gap from a mixed number up to the next whole number is what its fraction part lacks. It depends only on the fraction part, and the whole part has no effect on it.",
        "带分数到下一个整数的差，是分数部分距离 1 所缺的量。它只取决于分数部分，与整数部分无关。",
      ],
      (rng) => {
        const d = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
        const a = rng.int(1, 30);
        const n = rng.int(1, d - 1);
        const gap = Q.of(d - n, d);
        return fraction(
          [`What must be added to $${a}${frac(n, d)}$ to reach ${a + 1}?`, `$${a}${frac(n, d)}$ 加上多少等于 ${a + 1}？`],
          gap,
          [Q.of(n, d), Q.of(d + 1, d), Q.of(d - n, d + 1)].filter((w) => !w.eq(gap)),
          [`$${frac(n, d)}$ needs $${frac(d - n, d)}$ more to make a whole.`, `$${frac(n, d)}$ 再加 $${frac(d - n, d)}$ 就是 1。`],
        );
      },
    ),
  ],
  "subtracting-mixed-numbers-with-like-denominators-using-improper-fractions": [
    skill(
      "trading-a-whole-for-parts",
      ["Trading a whole for parts", "用一个整数换成份"],
      [
        "Before subtracting a larger fraction part, trade one whole for parts. The whole part drops by one, and the top rises by the denominator, so the value stays the same.",
        "减去较大的分数部分之前，先把一个整数换成份。整数部分减 1，分子加上分母，值保持不变。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const a = rng.int(2, 20);
        const n = rng.int(1, d - 1);
        return whole(
          [
            `Fill in the box: $$${a}${frac(n, d)} = ${a - 1}\\frac{\\square}{${d}}$$`,
            `填方框：$$${a}${frac(n, d)} = ${a - 1}\\frac{\\square}{${d}}$$`,
          ],
          n + d,
          [n, n + 1, d],
          [
            `One whole is $${frac(d, d)}$, so the top becomes $${n} + ${d} = ${n + d}$.`,
            `一个整数是 $${frac(d, d)}$，所以分子变成 $${n} + ${d} = ${n + d}$。`,
          ],
        );
      },
    ),
  ],
  "adding-mixed-numbers-with-like-denominators-word-problems": [
    skill(
      "room-left-in-the-tank",
      ["Room left in the tank", "水箱还能装多少"],
      [
        "Some stories add two amounts and then ask how much more fits. Find the total first, then subtract it from the capacity, and check that the total does not already exceed it.",
        "有些故事先把两个量相加，再问还能装多少。先求总量，再从容量中减去，并确认总量没有超过容量。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const d = rng.pick([3, 4, 5, 6, 8, 10, 12]);
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const n = rng.int(1, d - 1);
        let m = rng.int(1, d - 1);
        if (n + m === d) m = m > 1 ? m - 1 : m + 1;
        if (n + m === d) m = 1;
        const tops = (a + b) * d + n + m;
        const capacity = Math.ceil(tops / d);
        const room = Q.of(capacity * d - tops, d);
        return fraction(
          [
            `A tank holds ${capacity} liters. ${who} pours in $${a}${frac(n, d)}$ liters and then $${b}${frac(m, d)}$ liters more. How many more liters will fit?`,
            `一个水箱能装 ${capacity} 升。${who} 先倒入 $${a}${frac(n, d)}$ 升，又倒入 $${b}${frac(m, d)}$ 升。还能装多少升？`,
          ],
          room,
          [Q.of(tops, d), Q.of((n + m) % d, d), Q.of(1, d).add(room)].filter((w) => !w.eq(room)),
          [
            `Together that is $${frac(tops, d)}$ liters, and $${capacity} = ${frac(capacity * d, d)}$ leaves $${frac(capacity * d - tops, d)}$ liter.`,
            `合起来是 $${frac(tops, d)}$ 升，$${capacity} = ${frac(capacity * d, d)}$，还能装 $${frac(capacity * d - tops, d)}$ 升。`,
          ],
        );
      },
    ),
  ],
  "subtracting-mixed-numbers-with-like-denominators-word-problems": [
    skill(
      "full-bottles-from-what-is-left",
      ["Full bottles from what is left", "用剩下的能装满几瓶"],
      [
        "After a subtraction, a story may count only full containers. Find what remains as a mixed number, and then the whole part is the answer, since the fraction part cannot fill another one.",
        "减完之后，故事可能只数装满的容器。求出剩下的带分数，整数部分就是答案，因为分数部分装不满下一个。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const d = rng.pick([3, 4, 5, 6, 8, 10]);
        const b = rng.int(1, 6);
        const m = rng.int(1, d - 1);
        const left = rng.int(2, 12) * d + rng.int(1, d - 1);
        const start = (b * d + m + left) / d;
        const a = Math.floor(start);
        const n = b * d + m + left - a * d;
        if (n === 0) {
          return whole(
            [
              `A jug holds ${a} liters of juice. ${who} pours out $${b}${frac(m, d)}$ liters. How many full 1-liter bottles can the rest fill?`,
              `一个罐子装有 ${a} 升果汁。${who} 倒出 $${b}${frac(m, d)}$ 升。剩下的能装满多少个 1 升的瓶子？`,
            ],
            Math.floor(left / d),
            [Math.floor(left / d) + 1, a - b, a],
            [
              `$${a} - ${b}${frac(m, d)} = ${Math.floor(left / d)}${frac(left % d, d)}$, and only whole liters fill a bottle.`,
              `$${a} - ${b}${frac(m, d)} = ${Math.floor(left / d)}${frac(left % d, d)}$，只有整升才能装满瓶子。`,
            ],
          );
        }
        return whole(
          [
            `A jug holds $${a}${frac(n, d)}$ liters of juice. ${who} pours out $${b}${frac(m, d)}$ liters. How many full 1-liter bottles can the rest fill?`,
            `一个罐子装有 $${a}${frac(n, d)}$ 升果汁。${who} 倒出 $${b}${frac(m, d)}$ 升。剩下的能装满多少个 1 升的瓶子？`,
          ],
          Math.floor(left / d),
          [Math.floor(left / d) + 1, a - b === Math.floor(left / d) ? a - b - 1 : a - b, a],
          [
            `$${a}${frac(n, d)} - ${b}${frac(m, d)} = ${Math.floor(left / d)}${frac(left % d, d)}$, and only whole liters fill a bottle.`,
            `$${a}${frac(n, d)} - ${b}${frac(m, d)} = ${Math.floor(left / d)}${frac(left % d, d)}$，只有整升才能装满瓶子。`,
          ],
        );
      },
    ),
  ],
  "multiplying-unit-fractions-by-whole-numbers-using-models": [
    skill(
      "copies-of-a-unit-fraction-that-make-wholes",
      ["Copies that make whole numbers", "凑成整数需要几个"],
      [
        "As many copies of a unit fraction as its denominator make exactly 1. So a whole number of wholes takes that whole number times the denominator.",
        "分母那么多个单位分数正好是 1。所以若干个 1 需要的个数是这个整数乘分母。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const k = rng.int(2, 9);
        return whole(
          [`How many copies of $${frac(1, d)}$ are needed to make ${k}?`, `要凑成 ${k}，需要多少个 $${frac(1, d)}$？`],
          k * d,
          [k + d, d, k],
          [
            `${d} copies make 1, so $${k} \\times ${d} = ${k * d}$ copies make ${k}.`,
            `${d} 个凑成 1，所以 $${k} \\times ${d} = ${k * d}$ 个凑成 ${k}。`,
          ],
        );
      },
    ),
  ],
  "multiplying-fractions-by-whole-numbers-using-models": [
    skill(
      "groups-needed-to-reach-a-whole",
      ["Groups needed to reach a whole", "达到一个整体需要几组"],
      [
        "Repeated groups of a fraction add their tops. To reach at least one whole, the running top has to reach the denominator, so count how many groups it takes to get there.",
        "重复的几组分数，把分子相加。要达到至少一个整体，分子的和要达到分母，所以数一数需要几组。",
      ],
      (rng) => {
        const d = rng.int(5, 25);
        const a = rng.int(2, Math.min(d - 1, 9));
        const g = Math.ceil(d / a);
        return whole(
          [
            `What is the smallest number of groups of $${frac(a, d)}$ that make at least one whole?`,
            `至少多少组 $${frac(a, d)}$ 才能达到一个整体？`,
          ],
          g,
          [g + 1, Math.floor(d / a) === g ? g - 1 : Math.floor(d / a), d],
          [
            `$${g} \\times ${a} = ${g * a}$ reaches ${d}, and $${g - 1} \\times ${a} = ${(g - 1) * a}$ does not.`,
            `$${g} \\times ${a} = ${g * a}$ 达到 ${d}，而 $${g - 1} \\times ${a} = ${(g - 1) * a}$ 没有。`,
          ],
        );
      },
    ),
  ],
  "strategies-to-simplify-whole-number-and-fraction-multiplication": [
    skill(
      "batches-that-use-whole-cups",
      ["Batches that use whole cups", "几批正好用整数杯"],
      [
        "When the number of batches is a multiple of the denominator, the product is a whole number. Dividing first keeps the numbers small: divide the batches by the denominator, then multiply by the top.",
        "批数是分母的倍数时，积是整数。先除可以让数变小：批数除以分母，再乘分子。",
      ],
      (rng) => {
        const d = rng.int(2, 8);
        const n = rng.int(1, d + 2);
        const k = d * rng.int(2, 9);
        return whole(
          [
            `A recipe uses $${frac(n, d)}$ cup of oil per batch. How many cups of oil do ${k} batches use?`,
            `每批食谱用 $${frac(n, d)}$ 杯油。${k} 批要用多少杯油？`,
          ],
          (k / d) * n,
          [k * n, k + n, k / d],
          [
            `$${k} \\div ${d} = ${k / d}$, and $${k / d} \\times ${n} = ${(k / d) * n}$.`,
            `$${k} \\div ${d} = ${k / d}$，$${k / d} \\times ${n} = ${(k / d) * n}$。`,
          ],
        );
      },
    ),
  ],
  "plotting-decimals-on-number-lines": [
    skill(
      "hundredth-steps-between-two-decimals",
      ["Hundredth steps between two decimals", "两个小数之间的百分之一步"],
      [
        "Each tenth on a number line holds ten hundredths. To count the steps of 0.01 between two decimals, write both in hundredths and subtract.",
        "数轴上每个十分之一有十个百分之一。要数两个小数之间有几步 0.01，就把它们都写成百分之几再相减。",
      ],
      (rng) => {
        const a = rng.int(1, 8);
        const b = rng.int(a * 10 + 1, 99);
        const bText = (b / 100).toFixed(2);
        return whole(
          [
            `A point starts at $0.${a}$ and moves in steps of $0.01$ up to $${bText}$. How many steps does it take?`,
            `一个点从 $0.${a}$ 出发，每步走 $0.01$，走到 $${bText}$。要走多少步？`,
          ],
          b - a * 10,
          [b - a, b, b - a * 10 + 1],
          [
            `$0.${a}$ is ${a * 10} hundredths and $${bText}$ is ${b} hundredths, and $${b} - ${a * 10} = ${b - a * 10}$.`,
            `$0.${a}$ 是 ${a * 10} 个百分之一，$${bText}$ 是 ${b} 个百分之一，$${b} - ${a * 10} = ${b - a * 10}$。`,
          ],
        );
      },
    ),
  ],
  "converting-fractions-to-decimals": [
    skill(
      "comparing-fractions-with-decimals",
      ["Comparing fractions with decimals", "比较分数和小数"],
      [
        "A fraction and a decimal can be compared once both are written the same way. Rewriting each fraction as hundredths turns the question into comparing whole numbers of hundredths.",
        "分数和小数写成同样的形式后才能比较。把每个分数改写成百分之几，问题就变成比较百分之几的个数。",
      ],
      (rng) => {
        const f: readonly [string, number][] = [
          [frac(1, 2), 50],
          [frac(1, 4), 25],
          [frac(3, 4), 75],
          [frac(1, 5), 20],
          [frac(2, 5), 40],
          [frac(3, 5), 60],
          [frac(4, 5), 80],
          [frac(3, 10), 30],
          [frac(7, 10), 70],
          [frac(9, 10), 90],
        ];
        const picks = rng.sample(f, 2) as [string, number][];
        const used = new Set(picks.map((p) => p[1]));
        const pool = [8, 9, 15, 35, 45, 55, 65, 85, 95, 12, 28, 72].filter((v) => !used.has(v));
        const decs = (rng.sample(pool, 2) as number[]).map((v): [string, number] => [`0.${String(v).padStart(2, "0")}`, v]);
        const all = [...picks, ...decs].sort((a, b) => b[1] - a[1]);
        const [best, ...rest] = all as [[string, number], ...[string, number][]];
        return chooseMath(
          rng,
          ["Which of these is the greatest?", "下面哪个最大？"],
          best[0],
          rest.map((x) => x[0]),
          [
            `In hundredths they are ${all.map((x) => x[1]).join(", ")}, so $${best[0]}$ is the greatest.`,
            `写成百分之几分别是 ${all.map((x) => x[1]).join("、")}，所以 $${best[0]}$ 最大。`,
          ],
        );
      },
    ),
  ],
  "converting-mixed-numbers-to-decimals": [
    skill(
      "a-zero-after-the-point",
      ["A zero after the point", "小数点后的零"],
      [
        "Hundredths take two places after the point. So a fraction part with a top below 10 over 100 needs a zero in the tenths place, and leaving it out gives a value ten times too large.",
        "百分之几要占小数点后两位。所以分母是 100、分子小于 10 的分数部分，十分位要写 0，漏掉它值就大了十倍。",
      ],
      (rng) => {
        const a = rng.int(1, 40);
        const n = rng.int(1, 9);
        return chooseMath(
          rng,
          [`Write $${a}${frac(n, 100)}$ as a decimal.`, `把 $${a}${frac(n, 100)}$ 写成小数。`],
          `${a}.0${n}`,
          [`${a}.${n}`, `${a}.${n}0`, `0.${a}0${n}`],
          [
            `${n} hundredths sit in the second place, so the tenths place holds a zero: $${a}.0${n}$.`,
            `${n} 个百分之一在第二位，所以十分位是 0：$${a}.0${n}$。`,
          ],
        );
      },
    ),
  ],
  "converting-decimals-to-fractions": [
    skill(
      "tenths-as-hundredths",
      ["Tenths as hundredths", "把十分之几写成百分之几"],
      [
        "One tenth equals ten hundredths, so a decimal in tenths can always be written over 100 by placing a zero after it. This is what lets decimals of different lengths be compared.",
        "1 个十分之一等于 10 个百分之一，所以十分位的小数都能在后面添 0，写成分母为 100 的分数。这样不同长度的小数才能比较。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const w = rng.int(0, 3);
        const value = w * 100 + a * 10;
        return whole(
          [`Fill in the box: $$${w}.${a} = \\frac{\\square}{100}$$`, `填方框：$$${w}.${a} = \\frac{\\square}{100}$$`],
          value,
          [w * 10 + a, w * 100 + a, value * 10],
          [`$${w}.${a}$ is $${w}.${a}0$, which is ${value} hundredths.`, `$${w}.${a}$ 就是 $${w}.${a}0$，也就是 ${value} 个百分之一。`],
        );
      },
    ),
  ],
  "converting-decimals-to-mixed-numbers": [
    skill(
      "dollars-and-cents-from-a-decimal",
      ["Dollars and cents from a decimal", "由小数读出元和分"],
      [
        "An amount of money is a mixed number: the digits before the point are whole dollars, and the two digits after it are hundredths of a dollar, which are cents.",
        "钱数是一个带分数：小数点前面是整美元，后面两位是百分之几美元，也就是美分。",
      ],
      (rng) => {
        const a = rng.int(1, 60);
        const c = rng.int(1, 99);
        const cents = String(c).padStart(2, "0");
        return whole(
          [
            `An item costs $${a}.${cents}$ dollars. How many cents are there beyond the whole dollars?`,
            `一件商品售价 $${a}.${cents}$ 美元。除整美元外还有多少美分？`,
          ],
          c,
          [c * 10, a, 100 - c],
          [
            `$${a}.${cents} = ${a}${frac(c, 100)}$, and $${frac(c, 100)}$ of a dollar is ${c} cents.`,
            `$${a}.${cents} = ${a}${frac(c, 100)}$，$${frac(c, 100)}$ 美元是 ${c} 美分。`,
          ],
        );
      },
    ),
  ],
  "units-of-length": [
    metricGap(
      "how-much-longer-across-units",
      ["kilometers", "千米"],
      ["meters", "米"],
      ["How much longer, across units", "跨单位比较长度"],
    ),
  ],
  "units-of-mass": [
    metricGap(
      "how-much-heavier-across-units",
      ["kilograms", "千克"],
      ["grams", "克"],
      ["How much heavier, across units", "跨单位比较质量"],
    ),
  ],
  "units-of-volume": [
    metricGap("how-much-more-across-units", ["liters", "升"], ["milliliters", "毫升"], ["How much more, across units", "跨单位比较容积"]),
  ],
  "converting-customary-units-of-length-to-smaller-units": [
    skill(
      "yards-to-inches-in-two-steps",
      ["Yards to inches in two steps", "分两步把码化成英寸"],
      [
        "When two units are not directly related, go through the one in between. A yard is 3 feet and a foot is 12 inches, so one yard is $3 \\times 12 = 36$ inches.",
        "两个单位没有直接关系时，通过中间的单位换算。1 码是 3 英尺，1 英尺是 12 英寸，所以 1 码是 $3 \\times 12 = 36$ 英寸。",
      ],
      (rng) => {
        const y = rng.int(2, 30);
        return whole(
          [`How many inches are in ${y} yards?`, `${y} 码是多少英寸？`],
          36 * y,
          [12 * y, 3 * y, 15 * y],
          [
            `$${y} \\times 3 = ${3 * y}$ feet, and $${3 * y} \\times 12 = ${36 * y}$ inches.`,
            `$${y} \\times 3 = ${3 * y}$ 英尺，$${3 * y} \\times 12 = ${36 * y}$ 英寸。`,
          ],
        );
      },
    ),
  ],
  "converting-units-of-volume-to-smaller-units": [
    skill(
      "small-cups-from-liters",
      ["Small cups from liters", "几升能倒多少小杯"],
      [
        "To find how many small containers a large volume fills, write the volume in the small unit first. A liter is 1,000 milliliters, and then a division gives the number of containers.",
        "要求大容量能装满多少个小容器，先把容量化成小单位。1 升是 1,000 毫升，然后用除法求出容器的个数。",
      ],
      (rng) => {
        const size = rng.pick([100, 125, 200, 250, 500]);
        const l = rng.int(1, 12);
        const count = (l * 1000) / size;
        return whole(
          [
            `How many ${size}-milliliter cups can be filled from ${l} liter${l > 1 ? "s" : ""} of water?`,
            `${l} 升水能装满多少个 ${size} 毫升的杯子？`,
          ],
          count,
          [(l * 100) / size > 1 ? Math.floor((l * 100) / size) : count + 1, l * size, count * 10],
          [
            `${l} liter${l > 1 ? "s are" : " is"} ${commas(l * 1000)} milliliters, and $${commas(l * 1000)} \\div ${size} = ${count}$.`,
            `${l} 升是 ${commas(l * 1000)} 毫升，$${commas(l * 1000)} \\div ${size} = ${count}$。`,
          ],
        );
      },
    ),
  ],
  "creating-and-interpreting-line-plots": [
    skill(
      "marks-from-a-data-list",
      ["Marks from a data list", "由数据写出标记"],
      [
        "A line plot puts one mark above a value for each time it appears in the data. So the height of a column is a count, and the data can be checked by adding up all the marks.",
        "线图中，数据每出现一次，就在该值上方画一个标记。所以每列的高度是一个次数，把所有标记加起来可以检验数据。",
      ],
      (rng) => {
        const low = rng.int(0, 5);
        const data = Array.from({ length: rng.int(8, 13) }, () => rng.int(low, low + 4));
        const v = rng.pick(data);
        const count = data.filter((x) => x === v).length;
        return whole(
          [
            `A line plot is made from these data: ${data.join(", ")}. How many marks go above ${v}?`,
            `用这些数据画线图：${data.join("、")}。${v} 的上方有多少个标记？`,
          ],
          count,
          [data.length, count + 1, v],
          [
            `${v} appears ${count} time${count > 1 ? "s" : ""} in the list, and each time gets one mark.`,
            `${v} 在数据中出现 ${count} 次，每次一个标记。`,
          ],
        );
      },
    ),
  ],
  "creating-and-interpreting-line-plots-with-fractions": [
    skill(
      "equal-fractions-share-a-column",
      ["Equal fractions share a column", "相等的分数在同一列"],
      [
        "Data on a fraction line plot may be written in different ways. Equal fractions such as two fourths and one half belong above the same point, so rewrite the data before counting marks.",
        "分数线图的数据可能写法不同。相等的分数，如四分之二和二分之一，要标在同一点上方，所以先改写再数标记。",
      ],
      (rng) => {
        const options: readonly [string, number][] = [
          [frac(1, 4), 1],
          [frac(1, 2), 2],
          [frac(2, 4), 2],
          [frac(3, 4), 3],
          [frac(4, 4), 4],
          ["1", 4],
        ];
        const data = Array.from({ length: rng.int(7, 11) }, () => rng.pick(options));
        const target = rng.pick([2, 4]);
        if (!data.some((x) => x[1] === target)) data[0] = target === 2 ? [frac(2, 4), 2] : ["1", 4];
        const count = data.filter((x) => x[1] === target).length;
        const name = target === 2 ? frac(1, 2) : "1";
        return whole(
          [
            `A line plot is made from these lengths, in inches: $${data.map((x) => x[0]).join(",\\ ")}$. How many marks go above $${name}$?`,
            `用这些长度（英寸）画线图：$${data.map((x) => x[0]).join(",\\ ")}$。$${name}$ 的上方有多少个标记？`,
          ],
          count,
          [
            data.filter((x) => x[0] === name).length === count ? count + 1 : data.filter((x) => x[0] === name).length,
            data.length,
            count + 2,
          ],
          [
            `Every length equal to $${name}$ counts, however it is written: there are ${count}.`,
            `所有等于 $${name}$ 的长度都算，不管怎么写：共 ${count} 个。`,
          ],
        );
      },
    ),
  ],
  "points-lines-rays-and-segments": [
    skill(
      "another-name-for-a-ray",
      ["Another name for a ray", "射线的另一个名字"],
      [
        "A ray's name starts at its endpoint and goes through any other point on it. So a ray may have several names, but swapping the two letters gives a different ray pointing the opposite way.",
        "射线的名字从端点开始，再经过射线上任意另一点。所以一条射线可以有几个名字，但交换两个字母就是方向相反的另一条射线。",
      ],
      (rng) => {
        const [a, b, c] = rng.sample(["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M"], 3) as [string, string, string];
        return chooseMath(
          rng,
          [
            `Points $${a}$, $${b}$ and $${c}$ lie on a line in that order. Which names the same ray as $\\overrightarrow{${a}${b}}$?`,
            `点 $${a}$、$${b}$、$${c}$ 按顺序在一条直线上。哪个与 $\\overrightarrow{${a}${b}}$ 是同一条射线？`,
          ],
          `\\overrightarrow{${a}${c}}`,
          [`\\overrightarrow{${b}${a}}`, `\\overrightarrow{${c}${a}}`, `\\overrightarrow{${b}${c}}`],
          [
            `Both rays start at $${a}$ and head toward $${b}$ and $${c}$. Starting at $${b}$ or $${c}$ would give a different ray.`,
            `两条射线都从 $${a}$ 出发，朝 $${b}$ 和 $${c}$ 的方向。从 $${b}$ 或 $${c}$ 出发就是另一条射线。`,
          ],
        );
      },
    ),
  ],
  "angles-and-angle-measures": [
    skill(
      "an-angle-cut-into-equal-angles",
      ["An angle cut into equal angles", "把角平均分"],
      [
        "Angle measures add up, so rays from the vertex cut an angle into smaller angles whose measures total the original. Equal smaller angles are found by dividing.",
        "角的度数可以相加，所以从顶点引出的射线把角分成几个小角，小角的度数和等于原来的角。相等的小角用除法求。",
      ],
      (rng) => {
        const k = rng.int(2, 6);
        const each = rng.int(5, 30);
        const whole_ = k * each;
        return whole(
          [
            `Rays from the vertex cut an angle of $${whole_}^\\circ$ into ${k} equal angles. What is the measure of each, in degrees?`,
            `从顶点引出的射线把 $${whole_}^\\circ$ 的角分成 ${k} 个相等的角。每个角是多少度？`,
          ],
          each,
          [whole_ - k, whole_ * k, k + each],
          [`$${whole_} \\div ${k} = ${each}$.`, `$${whole_} \\div ${k} = ${each}$。`],
        );
      },
    ),
  ],
  "measuring-angles-using-a-protractor": [
    skill(
      "the-other-scale-of-a-protractor",
      ["The other scale of a protractor", "量角器的另一圈刻度"],
      [
        "A protractor has two scales that run opposite ways, and the two numbers at any mark add to 180. If a reading does not fit how the angle looks, the other scale is the one to use.",
        "量角器有两圈方向相反的刻度，同一刻度线上的两个数相加等于 180。如果读数与角的样子不符，就应该用另一圈刻度。",
      ],
      (rng) => {
        const wrong = rng.int(91, 175);
        return whole(
          [
            `An angle is clearly acute, but a student read $${wrong}^\\circ$ from the wrong scale of a protractor. What is its measure, in degrees?`,
            `一个角明显是锐角，但学生从量角器的错误刻度上读到 $${wrong}^\\circ$。它是多少度？`,
          ],
          180 - wrong,
          [wrong - 90, 90 - (wrong - 90) + 10, 360 - wrong],
          [
            `The two scales add to 180 at each mark: $180 - ${wrong} = ${180 - wrong}$.`,
            `同一刻度线上的两个数相加是 180：$180 - ${wrong} = ${180 - wrong}$。`,
          ],
        );
      },
    ),
  ],
  "right-straight-full-and-null-angles": [
    skill(
      "how-far-a-minute-hand-turns",
      ["How far a minute hand turns", "分针转过的角度"],
      [
        "A full turn is $360^\\circ$ and the minute hand makes one in 60 minutes. So it sweeps $6^\\circ$ each minute, and a quarter of an hour is a right angle.",
        "转一整圈是 $360^\\circ$，分针 60 分钟转一圈。所以每分钟转 $6^\\circ$，一刻钟正好是一个直角。",
      ],
      (rng) => {
        const m = rng.int(1, 60);
        return whole(
          [`How many degrees does a clock's minute hand turn in ${m} minute${m > 1 ? "s" : ""}?`, `钟面上的分针 ${m} 分钟转过多少度？`],
          6 * m,
          [m, 30 * m, 360 - 6 * m],
          [
            `Each minute is $360 \\div 60 = 6$ degrees, so $${m} \\times 6 = ${6 * m}$.`,
            `每分钟转 $360 \\div 60 = 6$ 度，所以 $${m} \\times 6 = ${6 * m}$。`,
          ],
        );
      },
    ),
  ],
  "classifying-figures-based-on-angles": [
    skill(
      "classifying-from-two-angles",
      ["Classifying from two angles", "由两个角判断类型"],
      [
        "The angles of a triangle total $180^\\circ$, so two angles fix the third. Find it before classifying, since the third angle may be the right or obtuse one.",
        "三角形的内角和是 $180^\\circ$，所以知道两个角就能求出第三个。先求出它再判断类型，因为第三个角可能是直角或钝角。",
      ],
      (rng) => {
        const kind = rng.int(0, 2);
        const c = kind === 0 ? rng.int(50, 85) : kind === 1 ? 90 : rng.int(95, 150);
        const a = rng.int(5, 180 - c - 5);
        const b = 180 - c - a;
        if (kind === 0 && (a >= 90 || b >= 90)) {
          const fixedA = rng.int(50, 85);
          const fixedC = rng.int(Math.max(50, 95 - fixedA), 85);
          const fixedB = 180 - fixedA - fixedC;
          return choose(
            rng,
            [
              `Two angles of a triangle measure $${fixedA}^\\circ$ and $${fixedB}^\\circ$. What kind of triangle is it?`,
              `三角形的两个角是 $${fixedA}^\\circ$ 和 $${fixedB}^\\circ$。它是什么三角形？`,
            ],
            ["Acute", "锐角三角形"],
            [
              ["Right", "直角三角形"],
              ["Obtuse", "钝角三角形"],
            ],
            [
              `The third angle is $${fixedC}^\\circ$, and all three are under $90^\\circ$.`,
              `第三个角是 $${fixedC}^\\circ$，三个角都小于 $90^\\circ$。`,
            ],
          );
        }
        const names: readonly Pair[] = [
          ["Acute", "锐角三角形"],
          ["Right", "直角三角形"],
          ["Obtuse", "钝角三角形"],
        ];
        return choose(
          rng,
          [
            `Two angles of a triangle measure $${a}^\\circ$ and $${b}^\\circ$. What kind of triangle is it?`,
            `三角形的两个角是 $${a}^\\circ$ 和 $${b}^\\circ$。它是什么三角形？`,
          ],
          names[kind]!,
          names.filter((_, i) => i !== kind),
          kind === 0
            ? [
                `The third angle is $${c}^\\circ$, and all three are under $90^\\circ$.`,
                `第三个角是 $${c}^\\circ$，三个角都小于 $90^\\circ$。`,
              ]
            : kind === 1
              ? [
                  `The third angle is $180^\\circ - ${a + b}^\\circ = 90^\\circ$, a right angle.`,
                  `第三个角是 $180^\\circ - ${a + b}^\\circ = 90^\\circ$，是直角。`,
                ]
              : [
                  `The third angle is $180^\\circ - ${a + b}^\\circ = ${c}^\\circ$, which is obtuse.`,
                  `第三个角是 $180^\\circ - ${a + b}^\\circ = ${c}^\\circ$，是钝角。`,
                ],
        );
      },
    ),
  ],
  "parallel-and-perpendicular-lines": [
    skill(
      "chains-of-line-relations",
      ["Chains of line relations", "直线关系的传递"],
      [
        "In a flat plane, two lines perpendicular to the same line never meet, so they are parallel. A line perpendicular to one of two parallel lines is perpendicular to the other as well.",
        "在同一平面内，垂直于同一条直线的两条直线不相交，所以互相平行。垂直于两条平行线之一的直线，也垂直于另一条。",
      ],
      (rng) => {
        const [a, b, c] = rng.sample(["k", "l", "m", "n", "p", "q", "r", "s"], 3) as [string, string, string];
        const form = rng.int(0, 2);
        const sign = (x: boolean) => (x ? "\\perp" : "\\parallel");
        const first = form !== 1;
        const second = form !== 1 ? form === 0 : false;
        const isParallel = first === second;
        const parallel: Pair = ["Parallel", "平行"];
        const perpendicular: Pair = ["Perpendicular", "垂直"];
        return choose(
          rng,
          [
            `In a plane, line $${a} ${sign(first)} ${b}$ and line $${b} ${sign(second)} ${c}$. How are lines $${a}$ and $${c}$ related?`,
            `在同一平面内，$${a} ${sign(first)} ${b}$，$${b} ${sign(second)} ${c}$。直线 $${a}$ 和 $${c}$ 有什么关系？`,
          ],
          isParallel ? parallel : perpendicular,
          [isParallel ? perpendicular : parallel, ["They meet, but not at a right angle", "相交但不垂直"]],
          isParallel
            ? [
                `Both relations to $${b}$ match, so $${a}$ and $${c}$ run the same way and never meet.`,
                `两条直线与 $${b}$ 的关系相同，所以 $${a}$ 和 $${c}$ 方向相同，不会相交。`,
              ]
            : [
                `$${c}$ runs the same way as $${b}$, and $${a}$ crosses $${b}$ at a right angle, so $${a} \\perp ${c}$.`,
                `$${c}$ 与 $${b}$ 方向相同，$${a}$ 与 $${b}$ 垂直相交，所以 $${a} \\perp ${c}$。`,
              ],
        );
      },
    ),
  ],
};
