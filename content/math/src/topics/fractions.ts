import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, lcm, num, Q, q } from "@ga/subject-math";

import { mixedLatex, numberProblem, steps, why } from "../problems.ts";
import { pickedMath } from "./early-grades-more-kit.ts";
import { answered, point, tapeFigure } from "./upper-grades-kit.ts";

/** properFraction draws a fraction in lowest terms between 0 and 1 with a denominator in [2, maxDen]. */
function properFraction(rng: Rng, maxDen = 12): Q {
  for (;;) {
    const d = rng.int(2, maxDen);
    const n = rng.int(1, d - 1);
    if (gcd(n, d) === 1) return q(n, d);
  }
}

/** fracOf writes n/d unreduced: "\frac{6}{8}". */
const fracOf = (n: number | bigint, d: number | bigint) => `\\frac{${n}}{${d}}`;

/** signedFrac writes n/d unreduced with the sign in front: "-\frac{3}{6}". */
const signedFrac = (n: bigint, d: number) => (n < 0n ? `-${fracOf(-n, d)}` : fracOf(n, d));

/** parenFrac writes a number, in tall parentheses when negative, for use after an operator. */
const parenFrac = (v: Q) => (v.sign() < 0 ? `\\left(${num(v)}\\right)` : num(v));

/** improper writes a mixed number's value as an improper fraction: "\frac{7}{3}". */
const improper = (v: Q) => fracOf(v.n, v.d);

/** fractionBars draws fractions as bars of the same length, each cut into its bottom number of pieces with its top number shaded. */
const fractionBars = (fractions: readonly (readonly [number, number])[], en: string, zh: string) =>
  tapeFigure(
    fractions.map(([n, d]) => ({ pieces: Array.from({ length: d }, (_, i) => ({ size: 1 / d, text: "", lit: i < n })) })),
    [en, zh],
  );

export const equivalentFractions: TopicDef = {
  id: "equivalent-fractions",
  title: t("Equivalent Fractions", "等值分数"),
  summary: t(
    "Simplify fractions to lowest terms and find missing terms of equivalent fractions.",
    "把分数化成最简分数，求等值分数中缺少的项。",
  ),
  prerequisites: ["greatest-common-factor"],
  encompasses: [{ topic: "greatest-common-factor", weight: 0.2 }],
  xp: 10,
  standards: ["CCSS.4.NF.A.1"],
  intro: t(
    "Two friends have pizzas of the same size. Mia cuts hers into 4 slices and eats 2. Leo cuts his into 8 slices and eats 4. They ate the same amount: $\\frac{2}{4} = \\frac{4}{8}$.\n\nCheck: 2 of 4 slices and 4 of 8 slices are both half a pizza.\n\nIn this lesson we make equal fractions by multiplying, simplify fractions by dividing, and spot a fraction that is not equal.",
    "两个朋友各有一张同样大的比萨。米娅把她的切成 4 块，吃了 2 块。利奥把他的切成 8 块，吃了 4 块。他们吃得一样多：$\\frac{2}{4} = \\frac{4}{8}$。\n\n检验：4 块中的 2 块和 8 块中的 4 块都是半张比萨。\n\n本课我们用乘法写出相等的分数，用除法约分，并找出不相等的分数。",
  ),
  knowledgePoints: [
    point(
      "missing-terms",
      ["Finding equivalent fractions", "求等值分数"],
      [
        "Mia cuts a cake into 4 pieces and eats 3, so she eats $\\frac{3}{4}$. Leo cuts the same cake into 8 pieces. Each of Mia's pieces is 2 of his, so the same amount is $\\frac{3 \\times 2}{4 \\times 2} = \\frac{6}{8}$.\n\nCheck: the shaded parts of the two bars are the same length.\n\n> **Watch out.** Multiply the top and the bottom by the same number. Adding the same number to both changes the fraction.",
        "米娅把一个蛋糕切成 4 块，吃了 3 块，也就是 $\\frac{3}{4}$。利奥把同样的蛋糕切成 8 块。米娅的每一块是利奥的 2 块，所以同样多是 $\\frac{3 \\times 2}{4 \\times 2} = \\frac{6}{8}$。\n\n检验：两个长条涂色的部分一样长。\n\n> **注意。** 分子和分母要同时乘同一个数。同时加同一个数，分数就变了。",
      ],
      (rng) => {
        const f = properFraction(rng);
        const k = rng.int(2, 9);
        const n = Number(f.n);
        const d = Number(f.d);
        const figure =
          d * k <= 24
            ? fractionBars(
                [
                  [n, d],
                  [0, d * k],
                ],
                `A bar cut into ${d} equal parts with ${n} shaded, above a bar of the same length cut into ${d * k} equal parts.`,
                `一个长条平均分成 ${d} 份，涂色 ${n} 份；下面是同样长的长条，平均分成 ${d * k} 份。`,
              )
            : undefined;
        if (rng.bool()) {
          return answered(
            [`Find the missing top number: $${num(f)} = \\frac{?}{${d * k}}$.`, `求缺少的分子：$${num(f)} = \\frac{?}{${d * k}}$。`],
            n * k,
            [
              [
                ["Find the multiplier", "找出乘的数"],
                [
                  `$${d} \\times ${k} = ${d * k}$, so the bottom was multiplied by ${k}.`,
                  `$${d} \\times ${k} = ${d * k}$，所以分母乘了 ${k}。`,
                ],
              ],
              [
                ["Multiply the top", "分子也乘"],
                [
                  `$${n} \\times ${k} = ${n * k}$, so $${num(f)} = ${fracOf(n * k, d * k)}$.`,
                  `$${n} \\times ${k} = ${n * k}$，所以 $${num(f)} = ${fracOf(n * k, d * k)}$。`,
                ],
              ],
            ],
            [
              `Divide the top and the bottom of $${fracOf(n * k, d * k)}$ by ${k}: $${n * k} \\div ${k} = ${n}$ and $${d * k} \\div ${k} = ${d}$.`,
              `把 $${fracOf(n * k, d * k)}$ 的分子和分母同时除以 ${k}：$${n * k} \\div ${k} = ${n}$，$${d * k} \\div ${k} = ${d}$。`,
            ],
            [
              [
                n + d * k - d,
                `That adds ${d * k - d} to the top, as was added to the bottom. Adding changes the fraction.`,
                `这是分子也加了 ${d * k - d}，和分母加的一样。加法会改变分数的值。`,
              ],
              [k, "That is the number the bottom was multiplied by, not the new top.", "这是分母乘的数，不是新的分子。"],
              [n + k, `That adds ${k} to the top instead of multiplying by it.`, `这是分子加 ${k}，应该乘 ${k}。`],
            ],
            { form: "integer", ...(figure && { figure }) },
          );
        }
        return answered(
          [`Find the missing bottom number: $${num(f)} = \\frac{${n * k}}{?}$.`, `求缺少的分母：$${num(f)} = \\frac{${n * k}}{?}$。`],
          d * k,
          [
            [
              ["Find the multiplier", "找出乘的数"],
              [`$${n} \\times ${k} = ${n * k}$, so the top was multiplied by ${k}.`, `$${n} \\times ${k} = ${n * k}$，所以分子乘了 ${k}。`],
            ],
            [
              ["Multiply the bottom", "分母也乘"],
              [
                `$${d} \\times ${k} = ${d * k}$, so $${num(f)} = ${fracOf(n * k, d * k)}$.`,
                `$${d} \\times ${k} = ${d * k}$，所以 $${num(f)} = ${fracOf(n * k, d * k)}$。`,
              ],
            ],
          ],
          [
            `Divide the top and the bottom of $${fracOf(n * k, d * k)}$ by ${k}: $${n * k} \\div ${k} = ${n}$ and $${d * k} \\div ${k} = ${d}$.`,
            `把 $${fracOf(n * k, d * k)}$ 的分子和分母同时除以 ${k}：$${n * k} \\div ${k} = ${n}$，$${d * k} \\div ${k} = ${d}$。`,
          ],
          [
            [
              d + n * k - n,
              `That adds ${n * k - n} to the bottom, as was added to the top. Adding changes the fraction.`,
              `这是分母也加了 ${n * k - n}，和分子加的一样。加法会改变分数的值。`,
            ],
            [k, "That is the number the top was multiplied by, not the new bottom.", "这是分子乘的数，不是新的分母。"],
            [d + k, `That adds ${k} to the bottom instead of multiplying by it.`, `这是分母加 ${k}，应该乘 ${k}。`],
          ],
          { form: "integer", ...(figure && { figure }) },
        );
      },
      fractionBars(
        [
          [3, 4],
          [6, 8],
        ],
        "Two bars of the same length. The first is cut into 4 equal parts with 3 shaded; the second into 8 equal parts with 6 shaded. The shaded parts are the same length.",
        "两个同样长的长条。第一个平均分成 4 份，涂色 3 份；第二个平均分成 8 份，涂色 6 份。涂色部分一样长。",
      ),
    ),
    point(
      "simplifying-fractions",
      ["Simplifying fractions", "约分"],
      [
        "Sam has $\\frac{6}{8}$ of a pizza. Every 2 eighths make a quarter, so 6 eighths are 3 quarters: $\\frac{6 \\div 2}{8 \\div 2} = \\frac{3}{4}$. Only 1 divides both 3 and 4, so $\\frac{3}{4}$ is in lowest terms.\n\nCheck: $\\frac{3 \\times 2}{4 \\times 2} = \\frac{6}{8}$.\n\n> **Watch out.** Divide the top and the bottom by the same number. Keep going until only 1 divides both.",
        "萨姆有 $\\frac{6}{8}$ 张比萨。每 2 个八分之一合成一个四分之一，所以 6 个八分之一是 3 个四分之一：$\\frac{6 \\div 2}{8 \\div 2} = \\frac{3}{4}$。3 和 4 的公因数只有 1，所以 $\\frac{3}{4}$ 是最简分数。\n\n检验：$\\frac{3 \\times 2}{4 \\times 2} = \\frac{6}{8}$。\n\n> **注意。** 分子和分母要同时除以同一个数，一直除到公因数只剩 1 为止。",
      ],
      (rng) => {
        const f = properFraction(rng);
        const k = rng.pick([2, 3, 4, 5, 6, 8, 9, 10, 12]);
        const [a, b] = [Number(f.n), Number(f.d)];
        const n = a * k;
        const d = b * k;
        return answered(
          [`Simplify $${fracOf(n, d)}$ to lowest terms.`, `把 $${fracOf(n, d)}$ 化成最简分数。`],
          f,
          [
            [
              ["Find the greatest common factor", "找最大公因数"],
              [`The greatest number that divides both ${n} and ${d} is ${k}.`, `同时能整除 ${n} 和 ${d} 的最大的数是 ${k}。`],
            ],
            [
              ["Divide both", "同时除"],
              [
                `$${fracOf(n, d)} = \\frac{${n} \\div ${k}}{${d} \\div ${k}} = ${num(f)}$. Only 1 divides both ${a} and ${b}.`,
                `$${fracOf(n, d)} = \\frac{${n} \\div ${k}}{${d} \\div ${k}} = ${num(f)}$。${a} 和 ${b} 的公因数只有 1。`,
              ],
            ],
          ],
          [
            `Multiply back: $\\frac{${a} \\times ${k}}{${b} \\times ${k}} = ${fracOf(n, d)}$.`,
            `乘回去：$\\frac{${a} \\times ${k}}{${b} \\times ${k}} = ${fracOf(n, d)}$。`,
          ],
          [
            [
              q(n - 1, d - 1),
              "That takes 1 from the top and the bottom. Subtracting changes the fraction.",
              "这是分子分母同时减 1，减法会改变分数的值。",
            ],
            [q(n, b), `That divides only the bottom by ${k}.`, `这只把分母除以了 ${k}。`],
            [q(a, d), `That divides only the top by ${k}.`, `这只把分子除以了 ${k}。`],
          ],
          { form: "fraction" },
        );
      },
      fractionBars(
        [
          [6, 8],
          [3, 4],
        ],
        "Two bars of the same length. The first is cut into 8 equal parts with 6 shaded; the second into 4 equal parts with 3 shaded. The shaded parts are the same length.",
        "两个同样长的长条。第一个平均分成 8 份，涂色 6 份；第二个平均分成 4 份，涂色 3 份。涂色部分一样长。",
      ),
    ),
  ],
};

/** oddFractionOut finds the fraction in a list that is not equal to the others: it adds the same number to the top and bottom. */
export const oddFractionOut = point(
  "the-fraction-that-does-not-belong",
  ["The fraction that does not belong", "找出不相等的分数"],
  [
    "Mia writes $\\frac{2}{3}$, $\\frac{4}{6}$, $\\frac{6}{9}$ and $\\frac{3}{4}$. The first three come from multiplying 2 and 3 by the same number, by 2 and by 3. But $\\frac{3}{4}$ adds 1 to both, so it does not belong.\n\nCheck: on bars of the same length, $\\frac{3}{4}$ is longer than $\\frac{2}{3}$.\n\n> **Watch out.** Adding the same number to the top and the bottom changes the fraction.",
    "米娅写了 $\\frac{2}{3}$、$\\frac{4}{6}$、$\\frac{6}{9}$ 和 $\\frac{3}{4}$。前三个都是把 2 和 3 同时乘同一个数得到的，分别乘 2 和乘 3。$\\frac{3}{4}$ 却是同时加 1，所以它和别的不相等。\n\n检验：在同样长的长条上，$\\frac{3}{4}$ 比 $\\frac{2}{3}$ 长。\n\n> **注意。** 分子和分母同时加同一个数，分数就变了。",
  ],
  (rng) => {
    const d = rng.int(3, 9);
    const n = rng.int(1, d - 1);
    const add = rng.int(1, 5);
    const [a, b, c] = rng.sample([2, 3, 4, 5, 6], 3) as [number, number, number];
    const odd = fracOf(n + add, d + add);
    const big = d * (d + add);
    const times = (m: number) =>
      [
        fracOf(n * m, d * m),
        `This is $${fracOf(n, d)}$ with the top and the bottom multiplied by ${m}.`,
        `这是把 $${fracOf(n, d)}$ 的分子和分母同时乘 ${m}。`,
      ] as const;
    return pickedMath(
      rng,
      [`Which fraction is not equal to $${fracOf(n, d)}$?`, `哪个分数不等于 $${fracOf(n, d)}$？`],
      odd,
      [times(a), times(b), times(c)],
      [
        [
          ["Look for a multiplier", "找乘的数"],
          [
            `For each fraction, ask what $${fracOf(n, d)}$ was multiplied by to get it.`,
            `看每个分数是 $${fracOf(n, d)}$ 的分子分母同时乘几得到的。`,
          ],
        ],
        [
          ["Find the odd one", "找出不相等的"],
          [
            `The fraction $${odd}$ adds ${add} to both numbers instead. No one number times ${n} and ${d} gives ${n + add} and ${d + add}.`,
            `$${odd}$ 却是分子分母同时加 ${add}。没有一个数能把 ${n} 和 ${d} 同时乘成 ${n + add} 和 ${d + add}。`,
          ],
        ],
      ],
      [
        `Give both the bottom ${big}. Then $${fracOf(n, d)}$ is $${fracOf(n * (d + add), big)}$, but $${odd}$ is $${fracOf(d * (n + add), big)}$, and ${n * (d + add)} is not ${d * (n + add)}.`,
        `把两个分数的分母都化成 ${big}。$${fracOf(n, d)}$ 是 $${fracOf(n * (d + add), big)}$，而 $${odd}$ 是 $${fracOf(d * (n + add), big)}$，${n * (d + add)} 和 ${d * (n + add)} 不相等。`,
      ],
    );
  },
  fractionBars(
    [
      [2, 3],
      [4, 6],
      [3, 4],
    ],
    "Three bars of the same length showing 2/3, 4/6 and 3/4. The shaded parts of 2/3 and 4/6 are the same length; 3/4 is longer.",
    "三个同样长的长条，分别表示 2/3、4/6 和 3/4。2/3 和 4/6 的涂色部分一样长，3/4 的更长。",
  ),
);

export const addingAndSubtractingFractions: TopicDef = {
  id: "adding-and-subtracting-fractions",
  title: t("Adding and Subtracting Fractions", "分数加减法"),
  summary: t("Add and subtract fractions with like and unlike denominators.", "同分母与异分母分数的加减。"),
  prerequisites: ["equivalent-fractions", "least-common-multiple"],
  encompasses: [
    { topic: "equivalent-fractions", weight: 0.5 },
    { topic: "least-common-multiple", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.5.NF.A.1"],
  knowledgePoints: [
    {
      id: "like-denominators",
      title: t("Like denominators", "同分母"),
      explanation: t(
        "Fractions with the same denominator count pieces of the same size, so add or subtract the numerators and keep the denominator:\n\n$$\\frac{5}{9} + \\frac{1}{9} = \\frac{6}{9} = \\frac{2}{3}$$\n\nAlways simplify the result. Never add the denominators: $\\frac{5}{9} + \\frac{1}{9}$ is not $\\frac{6}{18}$.",
        "同分母的分数表示同样大小的份数，所以分子相加减，分母不变：\n\n$$\\frac{5}{9} + \\frac{1}{9} = \\frac{6}{9} = \\frac{2}{3}$$\n\n结果要约分。分母不能相加：$\\frac{5}{9} + \\frac{1}{9}$ 不等于 $\\frac{6}{18}$。",
      ),
      generate(rng) {
        const d = rng.int(3, 15);
        const a = rng.int(1, d - 1);
        const add = rng.bool();
        const b = add ? rng.int(1, d - 1) : rng.int(1, a);
        if (!add && a === b) return this.generate(rng);
        const result = add ? q(a + b, d) : q(a - b, d);
        const raw = add ? a + b : a - b;
        const op = add ? "+" : "-";
        return numberProblem({
          prompt: t(`Evaluate $${fracOf(a, d)} ${op} ${fracOf(b, d)}$.`, `计算 $${fracOf(a, d)} ${op} ${fracOf(b, d)}$。`),
          answer: result,
          form: "fraction",
          wrong: [q(raw, 2 * d)],
          solution: t(
            `The denominators are equal, so ${add ? "add" : "subtract"} the numerators:${steps(`${fracOf(a, d)} ${op} ${fracOf(b, d)} = ${fracOf(raw, d)}${result.d === BigInt(d) ? "" : ` = ${num(result)}`}`)}`,
            `分母相同，分子相${add ? "加" : "减"}：${steps(`${fracOf(a, d)} ${op} ${fracOf(b, d)} = ${fracOf(raw, d)}${result.d === BigInt(d) ? "" : ` = ${num(result)}`}`)}`,
          ),
        });
      },
    },
    {
      id: "unlike-denominators",
      title: t("Unlike denominators", "异分母"),
      explanation: t(
        "To add or subtract fractions with different denominators, first rewrite them as equivalent fractions with a **common denominator**. The least common multiple of the denominators keeps the numbers smallest.\n\nFor $\\frac{3}{4} - \\frac{1}{6}$: the LCM of $4$ and $6$ is $12$, so\n\n$$\\frac{3}{4} - \\frac{1}{6} = \\frac{9}{12} - \\frac{2}{12} = \\frac{7}{12}$$",
        "异分母分数相加减，先把它们通分成**公分母**相同的等值分数。用分母的最小公倍数作公分母，数最小。\n\n例如 $\\frac{3}{4} - \\frac{1}{6}$：$4$ 和 $6$ 的最小公倍数是 $12$，所以\n\n$$\\frac{3}{4} - \\frac{1}{6} = \\frac{9}{12} - \\frac{2}{12} = \\frac{7}{12}$$",
      ),
      generate(rng) {
        let x = properFraction(rng, 10);
        let y = properFraction(rng, 10);
        while (x.d === y.d) y = properFraction(rng, 10);
        const add = rng.bool();
        if (!add && x.cmp(y) < 0) [x, y] = [y, x];
        const op = add ? "+" : "-";
        const L = lcm(Number(x.d), Number(y.d));
        const xn = (Number(x.n) * L) / Number(x.d);
        const yn = (Number(y.n) * L) / Number(y.d);
        const raw = add ? xn + yn : xn - yn;
        const result = add ? x.add(y) : x.sub(y);
        return numberProblem({
          prompt: t(`Evaluate $${num(x)} ${op} ${num(y)}$.`, `计算 $${num(x)} ${op} ${num(y)}$。`),
          answer: result,
          form: "fraction",
          mistakes: [
            why(
              q(add ? Number(x.n) + Number(y.n) : Number(x.n) - Number(y.n), Number(x.d) + Number(y.d)),
              "You added the denominators. Rewrite both fractions over a common denominator; then only the numerators combine.",
              "你把分母也相加了。先通分；通分后只有分子相加减。",
            ),
          ],
          solution: t(
            `The least common multiple of $${x.d}$ and $${y.d}$ is $${L}$:${steps(`${num(x)} ${op} ${num(y)} = ${fracOf(xn, L)} ${op} ${fracOf(yn, L)} = ${fracOf(raw, L)}${result.d === BigInt(L) ? "" : ` = ${num(result)}`}`)}`,
            `$${x.d}$ 和 $${y.d}$ 的最小公倍数是 $${L}$：${steps(`${num(x)} ${op} ${num(y)} = ${fracOf(xn, L)} ${op} ${fracOf(yn, L)} = ${fracOf(raw, L)}${result.d === BigInt(L) ? "" : ` = ${num(result)}`}`)}`,
          ),
        });
      },
    },
  ],
};

export const mixedNumbers: TopicDef = {
  id: "mixed-numbers",
  title: t("Mixed Numbers", "带分数"),
  summary: t(
    "Convert between mixed numbers and improper fractions, and add and subtract mixed numbers.",
    "带分数与假分数互化，带分数的加减。",
  ),
  prerequisites: ["adding-and-subtracting-fractions"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.4.NF.B.3.C", "CCSS.5.NF.A.1"],
  knowledgePoints: [
    {
      id: "improper-to-mixed",
      title: t("Improper fractions as mixed numbers", "假分数化带分数"),
      explanation: t(
        "A fraction whose numerator is at least its denominator is **improper**. It can be written as a **mixed number**: a whole number and a proper fraction. Divide the numerator by the denominator; the quotient is the whole number and the remainder is the new numerator.\n\n$$\\frac{17}{5}: \\quad 17 \\div 5 = 3 \\text{ remainder } 2, \\quad \\text{so } \\frac{17}{5} = 3\\frac{2}{5}$$\n\nIn the other direction, $3\\frac{2}{5} = \\frac{3 \\cdot 5 + 2}{5} = \\frac{17}{5}$.",
        "分子大于或等于分母的分数是**假分数**，可以写成**带分数**：一个整数加一个真分数。用分子除以分母，商是整数部分，余数是新的分子。\n\n$$\\frac{17}{5}: \\quad 17 \\div 5 = 3 \\text{ 余 } 2, \\quad \\text{所以 } \\frac{17}{5} = 3\\frac{2}{5}$$\n\n反过来，$3\\frac{2}{5} = \\frac{3 \\cdot 5 + 2}{5} = \\frac{17}{5}$。",
      ),
      generate(rng) {
        const f = properFraction(rng);
        const w = rng.int(1, 9);
        const v = f.add(Q.of(w));
        const d = Number(f.d);
        const r = Number(f.n);
        return numberProblem({
          prompt: t(`Write $${improper(v)}$ as a mixed number.`, `把 $${improper(v)}$ 写成带分数。`),
          answer: v,
          form: "mixed",
          // Swapping the quotient and the remainder.
          wrong: r < d && w < d ? [Q.of(r).add(q(w, d))] : [],
          solution: t(
            `$${v.n} \\div ${d} = ${w}$ remainder $${r}$, so $${improper(v)} = ${mixedLatex(v)}$.`,
            `$${v.n} \\div ${d} = ${w}$ 余 $${r}$，所以 $${improper(v)} = ${mixedLatex(v)}$。`,
          ),
        });
      },
    },
    {
      id: "adding-and-subtracting-mixed-numbers",
      title: t("Adding and subtracting mixed numbers", "带分数的加减"),
      explanation: t(
        "One reliable method: write each mixed number as an improper fraction, add or subtract, then write the result as a mixed number.\n\n$$2\\frac{1}{3} + 1\\frac{3}{4} = \\frac{7}{3} + \\frac{7}{4} = \\frac{28}{12} + \\frac{21}{12} = \\frac{49}{12} = 4\\frac{1}{12}$$",
        "一种可靠的方法：把带分数都化成假分数，计算加减，再把结果写成带分数。\n\n$$2\\frac{1}{3} + 1\\frac{3}{4} = \\frac{7}{3} + \\frac{7}{4} = \\frac{28}{12} + \\frac{21}{12} = \\frac{49}{12} = 4\\frac{1}{12}$$",
      ),
      generate(rng) {
        let x = properFraction(rng, 8).add(Q.of(rng.int(1, 6)));
        let y = properFraction(rng, 8).add(Q.of(rng.int(1, 6)));
        const add = rng.bool();
        if (!add && x.cmp(y) <= 0) [x, y] = [y, x];
        if (x.eq(y)) return this.generate(rng);
        const op = add ? "+" : "-";
        const result = add ? x.add(y) : x.sub(y);
        // A common mistake: combining the whole numbers and the fractions separately without regrouping.
        const wholes = (v: Q) => Q.of(v.n / v.d);
        const naive = add ? wholes(x).add(wholes(y)) : wholes(x).sub(wholes(y));
        return numberProblem({
          prompt: t(`Evaluate $${mixedLatex(x)} ${op} ${mixedLatex(y)}$.`, `计算 $${mixedLatex(x)} ${op} ${mixedLatex(y)}$。`),
          answer: result,
          form: "fraction",
          wrong: [naive],
          solution: t(
            `Write both as improper fractions:${steps(`${mixedLatex(x)} ${op} ${mixedLatex(y)} = ${improper(x)} ${op} ${improper(y)} = ${num(result)}${result.isInteger() || result.cmp(Q.one) < 0 ? "" : ` = ${mixedLatex(result)}`}`)}`,
            `先化成假分数：${steps(`${mixedLatex(x)} ${op} ${mixedLatex(y)} = ${improper(x)} ${op} ${improper(y)} = ${num(result)}${result.isInteger() || result.cmp(Q.one) < 0 ? "" : ` = ${mixedLatex(result)}`}`)}`,
          ),
        });
      },
    },
  ],
};

export const multiplyingFractions: TopicDef = {
  id: "multiplying-fractions",
  title: t("Multiplying Fractions", "分数乘法"),
  summary: t("Multiply fractions and find a fraction of a whole number.", "分数相乘，求一个整数的几分之几。"),
  prerequisites: ["equivalent-fractions"],
  encompasses: [{ topic: "equivalent-fractions", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.5.NF.B.4", "CCSS.5.NF.B.6"],
  knowledgePoints: [
    {
      id: "fraction-times-fraction",
      title: t("Fraction times fraction", "分数乘分数"),
      explanation: t(
        "To multiply fractions, multiply the numerators and multiply the denominators:\n\n$$\\frac{2}{3} \\cdot \\frac{9}{10} = \\frac{2 \\cdot 9}{3 \\cdot 10} = \\frac{18}{30} = \\frac{3}{5}$$\n\nYou can simplify before multiplying by cancelling a factor shared by any numerator and any denominator: $\\frac{2}{3} \\cdot \\frac{9}{10} = \\frac{1}{1} \\cdot \\frac{3}{5}$ after cancelling $2$ and $3$.",
        "分数相乘，分子乘分子，分母乘分母：\n\n$$\\frac{2}{3} \\cdot \\frac{9}{10} = \\frac{2 \\cdot 9}{3 \\cdot 10} = \\frac{18}{30} = \\frac{3}{5}$$\n\n也可以先约分再乘：任一分子与任一分母的公因数都可以约去。$\\frac{2}{3} \\cdot \\frac{9}{10}$ 约去 $2$ 和 $3$ 后得 $\\frac{1}{1} \\cdot \\frac{3}{5}$。",
      ),
      generate(rng) {
        const x = properFraction(rng);
        const y = properFraction(rng);
        const p = x.mul(y);
        const rawN = x.n * y.n;
        const rawD = x.d * y.d;
        return numberProblem({
          prompt: t(`Evaluate $${num(x)} \\cdot ${num(y)}$.`, `计算 $${num(x)} \\cdot ${num(y)}$。`),
          answer: p,
          form: "fraction",
          mistakes: [
            why(x.add(y), "You added the fractions. Here they are multiplied.", "你把两个分数相加了。这里要相乘。"),
            why(
              Q.of(x.n * y.d, x.d * y.n),
              "You divided: that flips the second fraction. To multiply, keep both as they are.",
              "你做的是除法，把第二个分数颠倒了。相乘时两个分数都不颠倒。",
            ),
          ],
          solution: t(
            `Multiply the numerators and the denominators:${steps(`${num(x)} \\cdot ${num(y)} = ${fracOf(rawN, rawD)}${p.d === rawD ? "" : ` = ${num(p)}`}`)}`,
            `分子乘分子，分母乘分母：${steps(`${num(x)} \\cdot ${num(y)} = ${fracOf(rawN, rawD)}${p.d === rawD ? "" : ` = ${num(p)}`}`)}`,
          ),
        });
      },
    },
    {
      id: "fraction-of-a-whole-number",
      title: t("A fraction of a whole number", "求整数的几分之几"),
      explanation: t(
        '"$\\frac{3}{4}$ of $20$" means $\\frac{3}{4} \\cdot 20$. Divide by the denominator to find one part, then multiply by the numerator:\n\n$$\\frac{3}{4} \\cdot 20 = \\frac{3 \\cdot 20}{4} = 3 \\cdot 5 = 15$$',
        "“$20$ 的 $\\frac{3}{4}$”就是 $\\frac{3}{4} \\cdot 20$。先除以分母求出一份，再乘分子：\n\n$$\\frac{3}{4} \\cdot 20 = \\frac{3 \\cdot 20}{4} = 3 \\cdot 5 = 15$$",
      ),
      generate(rng) {
        const f = properFraction(rng);
        const w = Number(f.d) * rng.int(2, 15);
        const part = w / Number(f.d);
        const answer = part * Number(f.n);
        return numberProblem({
          prompt: t(`What is $${num(f)}$ of $${w}$?`, `$${w}$ 的 $${num(f)}$ 是多少？`),
          answer,
          wrong: [part],
          mistakes: [
            why(
              w * Number(f.n),
              "You multiplied by the numerator only. Divide by the denominator as well.",
              "你只乘了分子，还要除以分母。",
            ),
          ],
          solution: t(
            `${steps(`${num(f)} \\cdot ${w} = ${f.n} \\cdot (${w} \\div ${f.d}) = ${f.n} \\cdot ${part} = ${answer}`)}`,
            `${steps(`${num(f)} \\cdot ${w} = ${f.n} \\cdot (${w} \\div ${f.d}) = ${f.n} \\cdot ${part} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

export const dividingFractions: TopicDef = {
  id: "dividing-fractions",
  title: t("Dividing Fractions", "分数除法"),
  summary: t("Find reciprocals and divide by a fraction by multiplying by its reciprocal.", "求倒数，除以一个分数等于乘它的倒数。"),
  prerequisites: ["multiplying-fractions"],
  encompasses: [{ topic: "multiplying-fractions", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.6.NS.A.1"],
  knowledgePoints: [
    {
      id: "reciprocals",
      title: t("Reciprocals", "倒数"),
      explanation: t(
        "Two numbers are **reciprocals** when their product is $1$. The reciprocal of $\\frac{a}{b}$ is $\\frac{b}{a}$: flip the fraction. The reciprocal of a whole number $n$ is $\\frac{1}{n}$, and the reciprocal of $\\frac{1}{n}$ is $n$. The number $0$ has no reciprocal.",
        "乘积为 $1$ 的两个数互为**倒数**。$\\frac{a}{b}$ 的倒数是 $\\frac{b}{a}$：把分数倒过来。整数 $n$ 的倒数是 $\\frac{1}{n}$，$\\frac{1}{n}$ 的倒数是 $n$。$0$ 没有倒数。",
      ),
      generate(rng) {
        const v = rng.bool(0.3)
          ? Q.of(rng.int(2, 20))
          : rng.bool(0.5)
            ? properFraction(rng, 15)
            : properFraction(rng, 9).add(Q.of(rng.int(1, 4)));
        const r = Q.one.div(v);
        const shown = v.isInteger() ? num(v) : v.cmp(Q.one) > 0 && rng.bool() ? mixedLatex(v) : improper(v);
        return numberProblem({
          prompt: t(`Find the reciprocal of $${shown}$.`, `求 $${shown}$ 的倒数。`),
          answer: r,
          form: "fraction",
          wrong: [v.neg()],
          solution: t(
            `${shown === improper(v) ? "" : `Write it as a fraction: $${shown} = ${improper(v)}$. `}Flip it: the reciprocal is $${num(r)}$, because $${improper(v)} \\cdot ${num(r)} = 1$.`,
            `${shown === improper(v) ? "" : `先写成分数：$${shown} = ${improper(v)}$。`}把它倒过来，倒数是 $${num(r)}$，因为 $${improper(v)} \\cdot ${num(r)} = 1$。`,
          ),
        });
      },
    },
    {
      id: "dividing-by-a-fraction",
      title: t("Dividing by a fraction", "除以分数"),
      explanation: t(
        "Dividing by a number is the same as multiplying by its reciprocal:\n\n$$\\frac{3}{4} \\div \\frac{2}{5} = \\frac{3}{4} \\cdot \\frac{5}{2} = \\frac{15}{8}$$\n\nThis works because $\\frac{15}{8} \\cdot \\frac{2}{5} = \\frac{3}{4}$: the quotient times the divisor gives back the dividend. Only the divisor (the second number) is flipped.",
        "除以一个数等于乘它的倒数：\n\n$$\\frac{3}{4} \\div \\frac{2}{5} = \\frac{3}{4} \\cdot \\frac{5}{2} = \\frac{15}{8}$$\n\n这是因为 $\\frac{15}{8} \\cdot \\frac{2}{5} = \\frac{3}{4}$：商乘除数等于被除数。只把除数（第二个数）倒过来。",
      ),
      generate(rng) {
        const x = rng.bool(0.2) ? Q.of(rng.int(2, 9)) : properFraction(rng, 10);
        const y = properFraction(rng, 10);
        if (x.eq(y)) return this.generate(rng);
        const result = x.div(y);
        return numberProblem({
          prompt: t(`Evaluate $${num(x)} \\div ${num(y)}$.`, `计算 $${num(x)} \\div ${num(y)}$。`),
          answer: result,
          form: "fraction",
          mistakes: [
            why(
              x.mul(y),
              "You multiplied without flipping. To divide, multiply by the reciprocal of the divisor.",
              "你没有颠倒就相乘了。除以一个数，等于乘以它的倒数。",
            ),
            why(
              y.div(x),
              "You flipped the wrong fraction. Only the divisor, the second fraction, is flipped.",
              "你颠倒错了分数。只颠倒除数，也就是第二个分数。",
            ),
          ],
          solution: t(
            `Multiply by the reciprocal of $${num(y)}$:${steps(`${num(x)} \\div ${num(y)} = ${num(x)} \\cdot ${improper(Q.one.div(y))} = ${num(result)}`)}`,
            `乘 $${num(y)}$ 的倒数：${steps(`${num(x)} \\div ${num(y)} = ${num(x)} \\cdot ${improper(Q.one.div(y))} = ${num(result)}`)}`,
          ),
        });
      },
    },
  ],
};

export const operationsWithRationalNumbers: TopicDef = {
  id: "operations-with-rational-numbers",
  title: t("Operations With Negative Fractions", "负分数的运算"),
  summary: t("Add, subtract, multiply and divide fractions with signs.", "带符号分数的加、减、乘、除。"),
  prerequisites: ["adding-and-subtracting-fractions", "dividing-fractions", "subtracting-integers", "dividing-integers"],
  encompasses: [
    { topic: "adding-and-subtracting-fractions", weight: 0.5 },
    { topic: "dividing-fractions", weight: 0.4 },
    { topic: "subtracting-integers", weight: 0.3 },
    { topic: "dividing-integers", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.7.NS.A.1", "CCSS.7.NS.A.2"],
  knowledgePoints: [
    {
      id: "adding-and-subtracting-signed-fractions",
      title: t("Adding and subtracting", "加法与减法"),
      explanation: t(
        "The sign rules for integers hold for all fractions. Subtracting a number is adding its opposite, and with a common denominator the numerators follow the integer rules:\n\n$$-\\frac{1}{2} - \\frac{1}{3} = -\\frac{3}{6} + \\left(-\\frac{2}{6}\\right) = -\\frac{5}{6}$$\n\nA negative fraction can carry its sign in front, in the numerator or in the denominator: $-\\frac{5}{6} = \\frac{-5}{6} = \\frac{5}{-6}$.",
        "整数的符号法则对所有分数都成立。减去一个数等于加上它的相反数；通分后，分子按整数的法则计算：\n\n$$-\\frac{1}{2} - \\frac{1}{3} = -\\frac{3}{6} + \\left(-\\frac{2}{6}\\right) = -\\frac{5}{6}$$\n\n负分数的负号可以写在前面、分子上或分母上：$-\\frac{5}{6} = \\frac{-5}{6} = \\frac{5}{-6}$。",
      ),
      keyPrerequisites: ["adding-and-subtracting-fractions", "subtracting-integers"],
      generate(rng) {
        const x = properFraction(rng, 9).mul(Q.of(rng.sign()));
        const y = properFraction(rng, 9).mul(Q.of(rng.sign()));
        const add = rng.bool();
        const op = add ? "+" : "-";
        const result = add ? x.add(y) : x.sub(y);
        if (result.isZero()) return this.generate(rng);
        const L = lcm(Number(x.d), Number(y.d));
        const xs = Q.of(x.n * BigInt(L / Number(x.d)));
        const ys = Q.of(y.n * BigInt(L / Number(y.d)));
        const raw = add ? xs.add(ys) : xs.sub(ys);
        const yl = signedFrac(ys.n, L);
        const rawLatex = signedFrac(raw.n, L);
        const line = `${num(x)} ${op} ${parenFrac(y)} = ${signedFrac(xs.n, L)} ${op} ${ys.n < 0n ? `\\left(${yl}\\right)` : yl} = ${rawLatex}${rawLatex === num(result) ? "" : ` = ${num(result)}`}`;
        return numberProblem({
          prompt: t(`Evaluate $${num(x)} ${op} ${parenFrac(y)}$.`, `计算 $${num(x)} ${op} ${parenFrac(y)}$。`),
          answer: result,
          form: "fraction",
          wrong: [result.neg(), add ? x.sub(y) : x.add(y)],
          solution: t(`Use the common denominator $${L}$:${steps(line)}`, `通分，公分母为 $${L}$：${steps(line)}`),
        });
      },
    },
    {
      id: "multiplying-and-dividing-signed-fractions",
      title: t("Multiplying and dividing", "乘法与除法"),
      explanation: t(
        "Multiply or divide the absolute values as usual, then choose the sign as for integers: the result is positive when the signs are the same and negative when they differ.\n\n$$-\\frac{2}{3} \\div \\left(-\\frac{4}{9}\\right) = \\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{3}{2}$$",
        "先按通常的方法计算绝对值的积或商，再像整数那样确定符号：同号得正，异号得负。\n\n$$-\\frac{2}{3} \\div \\left(-\\frac{4}{9}\\right) = \\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{3}{2}$$",
      ),
      keyPrerequisites: ["dividing-fractions", "dividing-integers"],
      generate(rng) {
        const sx = rng.sign();
        const sy = sx > 0 ? -1 : rng.sign();
        const x = properFraction(rng, 10).mul(Q.of(sx));
        const y = properFraction(rng, 10).mul(Q.of(sy));
        const mul = rng.bool();
        const result = mul ? x.mul(y) : x.div(y);
        const op = mul ? "\\cdot" : "\\div";
        const same = sx === sy;
        return numberProblem({
          prompt: t(`Evaluate $${num(x)} ${op} ${parenFrac(y)}$.`, `计算 $${num(x)} ${op} ${parenFrac(y)}$。`),
          answer: result,
          form: "fraction",
          wrong: [result.neg(), mul ? x.div(y) : x.mul(y)],
          solution: t(
            `The signs are ${same ? "the same, so the result is positive" : "different, so the result is negative"}.${steps(`${num(x.abs())} ${op} ${num(y.abs())} = ${num(result.abs())}`)}So $${num(x)} ${op} ${parenFrac(y)} = ${num(result)}$.`,
            `两数${same ? "同号，结果为正" : "异号，结果为负"}。${steps(`${num(x.abs())} ${op} ${num(y.abs())} = ${num(result.abs())}`)}所以 $${num(x)} ${op} ${parenFrac(y)} = ${num(result)}$。`,
          ),
        });
      },
    },
  ],
};

/** fractionTopics are the topics on fractions and mixed numbers, including negative fractions. */
export const fractionTopics: readonly TopicDef[] = [
  equivalentFractions,
  addingAndSubtractingFractions,
  mixedNumbers,
  multiplyingFractions,
  dividingFractions,
  operationsWithRationalNumbers,
];
