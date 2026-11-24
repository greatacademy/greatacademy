import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, lcm, num, Q, q } from "@ga/subject-math";

import { mixedLatex, numberProblem, steps } from "../problems.ts";
import { pickedMath, type Walk } from "./early-grades-more-kit.ts";
import { barFigure, twoBarsFigure } from "./grade-4-fractions.ts";
import { groupedBarsFigure, partsTape, productGrid } from "./grade-5-fractions.ts";
import { answered, equalTape, point, tapeFigure } from "./upper-grades-kit.ts";

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

/** simplestStep is the walk step that writes n/d in simplest form, or no step when it already is. */
const simplestStep = (n: number, d: number): Walk[] => {
  const v = q(n, d);
  const last = v.isInteger() || v.cmp(Q.one) < 0 ? num(v) : `${improper(v)} = ${mixedLatex(v)}`;
  return fracOf(n, d) === last
    ? []
    : [[["Simplify", "化简"], ["Write the answer in simplest form.", "把结果写成最简形式。"], [`${fracOf(n, d)} = ${last}`]]];
};

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
    point(
      "like-denominators",
      ["Like denominators", "同分母"],
      [
        "$\\frac{5}{9} + \\frac{1}{9} = \\frac{6}{9} = \\frac{2}{3}$. The parts are all ninths, so add the tops and keep the bottom.\n\nCheck: $\\frac{6}{9} - \\frac{1}{9} = \\frac{5}{9}$.\n\n> **Watch out.** Keep the bottom. $\\frac{6}{18}$ adds the bottoms too.",
        "$\\frac{5}{9} + \\frac{1}{9} = \\frac{6}{9} = \\frac{2}{3}$。每份都是九分之一，所以分子相加，分母不变。\n\n检验：$\\frac{6}{9} - \\frac{1}{9} = \\frac{5}{9}$。\n\n> **注意。** 分母不变。$\\frac{6}{18}$ 把分母也加起来了。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const add = rng.bool();
        const a = rng.int(add ? 1 : 2, d - 1);
        const b = add ? rng.int(1, d - 1) : rng.int(1, a - 1);
        const raw = add ? a + b : a - b;
        const op = add ? "+" : "-";
        const undo = add ? "-" : "+";
        return answered(
          [`Find $${fracOf(a, d)} ${op} ${fracOf(b, d)}$.`, `计算 $${fracOf(a, d)} ${op} ${fracOf(b, d)}$。`],
          q(raw, d),
          [
            [
              add ? ["Add the tops", "分子相加"] : ["Subtract the tops", "分子相减"],
              [
                `Both count parts of $${fracOf(1, d)}$, so the bottom stays ${d}.`,
                `两个分数都是几个 $${fracOf(1, d)}$，所以分母还是 ${d}。`,
              ],
              [`${fracOf(a, d)} ${op} ${fracOf(b, d)} = ${fracOf(raw, d)}`],
            ],
            ...simplestStep(raw, d),
          ],
          [
            `Undo it: $${fracOf(raw, d)} ${undo} ${fracOf(b, d)} = ${fracOf(a, d)}$.`,
            `倒过来算：$${fracOf(raw, d)} ${undo} ${fracOf(b, d)} = ${fracOf(a, d)}$。`,
          ],
          add
            ? [
                [q(raw, 2 * d), "That adds the bottoms too. The bottom stays the same.", "这是把分母也加起来了。分母应该不变。"],
                [q(Math.abs(a - b), d), "That subtracts instead of adding.", "这是做成减法了。"],
                [raw, "That is only the top. The bottom is missing.", "这只是分子，漏掉了分母。"],
              ]
            : [
                [q(a + b, d), "That adds instead of subtracting.", "这是做成加法了。"],
                [raw, "That is only the top. The bottom is missing.", "这只是分子，漏掉了分母。"],
                [q(d - raw, d), "That is what is left to make 1.", "这是凑成 1 还差的部分。"],
              ],
          {
            form: "fraction",
            figure: fractionBars(
              [
                [a, d],
                [b, d],
              ],
              `Two bars cut into ${d} equal parts, with ${a} and ${b} parts shaded.`,
              `两个长条都平均分成 ${d} 份，分别涂了 ${a} 份和 ${b} 份。`,
            ),
          },
        );
      },
      fractionBars(
        [
          [5, 9],
          [1, 9],
        ],
        "Two bars cut into 9 equal parts, with 5 and 1 parts shaded.",
        "两个长条都平均分成 9 份，分别涂了 5 份和 1 份。",
      ),
    ),
    point(
      "unlike-denominators",
      ["Unlike denominators", "异分母"],
      [
        "For $\\frac{3}{4} - \\frac{1}{6}$, use twelfths: $\\frac{9}{12} - \\frac{2}{12} = \\frac{7}{12}$.\n\nCheck: $\\frac{7}{12} + \\frac{2}{12} = \\frac{9}{12} = \\frac{3}{4}$.\n\n> **Watch out.** Change both fractions to the same bottom first. Do not subtract the tops right away.",
        "计算 $\\frac{3}{4} - \\frac{1}{6}$，都化成十二分之几：$\\frac{9}{12} - \\frac{2}{12} = \\frac{7}{12}$。\n\n检验：$\\frac{7}{12} + \\frac{2}{12} = \\frac{9}{12} = \\frac{3}{4}$。\n\n> **注意。** 先把两个分数化成同分母，不能直接把分子相减。",
      ],
      (rng) => {
        let x = properFraction(rng, 10);
        let y = properFraction(rng, 10);
        while (x.d === y.d) y = properFraction(rng, 10);
        const add = rng.bool();
        if (!add && x.cmp(y) < 0) [x, y] = [y, x];
        const op = add ? "+" : "-";
        const undo = add ? "-" : "+";
        const [xn, xd, yn, yd] = [Number(x.n), Number(x.d), Number(y.n), Number(y.d)];
        const L = lcm(xd, yd);
        const [xs, ys] = [(xn * L) / xd, (yn * L) / yd];
        const raw = add ? xs + ys : xs - ys;
        return answered(
          [`Find $${num(x)} ${op} ${num(y)}$.`, `计算 $${num(x)} ${op} ${num(y)}$。`],
          q(raw, L),
          [
            [
              ["Find a common bottom", "通分"],
              [`${L} is the smallest number that both ${xd} and ${yd} go into.`, `${L} 是 ${xd} 和 ${yd} 的最小公倍数。`],
              [`${num(x)} = ${fracOf(xs, L)}`, `${num(y)} = ${fracOf(ys, L)}`],
            ],
            [
              add ? ["Add the tops", "分子相加"] : ["Subtract the tops", "分子相减"],
              [`Now both count parts of $${fracOf(1, L)}$.`, `现在两个分数都是几个 $${fracOf(1, L)}$。`],
              [`${fracOf(xs, L)} ${op} ${fracOf(ys, L)} = ${fracOf(raw, L)}`],
            ],
            ...simplestStep(raw, L),
          ],
          [
            `Undo it: $${fracOf(raw, L)} ${undo} ${fracOf(ys, L)} = ${fracOf(xs, L)} = ${num(x)}$.`,
            `倒过来算：$${fracOf(raw, L)} ${undo} ${fracOf(ys, L)} = ${fracOf(xs, L)} = ${num(x)}$。`,
          ],
          [
            [
              q(add ? xn + yn : xn - yn, xd + yd),
              "That works on the tops and the bottoms as they are. Find a common bottom first.",
              "这是直接把分子、分母分别相加减了。要先通分。",
            ],
            [q(add ? xn + yn : xn - yn, L), "That changes the bottoms but not the tops.", "这里只改了分母，没有改分子。"],
            [
              add ? q(Math.abs(xs - ys), L) : q(xs + ys, L),
              add ? "That subtracts instead of adding." : "That adds instead of subtracting.",
              add ? "这是做成减法了。" : "这是做成加法了。",
            ],
          ],
          {
            form: "fraction",
            figure: fractionBars(
              [
                [xn, xd],
                [yn, yd],
              ],
              `Two bars of the same length showing ${xn}/${xd} and ${yn}/${yd}.`,
              `两个同样长的长条，分别表示 ${xn}/${xd} 和 ${yn}/${yd}。`,
            ),
          },
        );
      },
      fractionBars(
        [
          [3, 4],
          [1, 6],
        ],
        "Two bars of the same length showing 3/4 and 1/6.",
        "两个同样长的长条，分别表示 3/4 和 1/6。",
      ),
    ),
  ],
  intro: t(
    "Mia eats $\\frac{1}{4}$ of a pizza and Leo eats $\\frac{1}{3}$. In twelfths that is $\\frac{3}{12} + \\frac{4}{12} = \\frac{7}{12}$ of the pizza.\n\nCheck: $\\frac{7}{12} - \\frac{4}{12} = \\frac{3}{12} = \\frac{1}{4}$, which is Mia's part.\n\nIn this lesson we add and subtract fractions with the same or different bottoms.",
    "米娅吃了一个比萨饼的 $\\frac{1}{4}$，利奥吃了 $\\frac{1}{3}$。化成十二分之几，就是 $\\frac{3}{12} + \\frac{4}{12} = \\frac{7}{12}$ 个比萨饼。\n\n检验：$\\frac{7}{12} - \\frac{4}{12} = \\frac{3}{12} = \\frac{1}{4}$，正是米娅吃的部分。\n\n本课我们做同分母和异分母分数的加减法。",
  ),
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
    point(
      "fraction-times-fraction",
      ["Fraction times fraction", "分数乘分数"],
      [
        "$\\frac{2}{3} \\times \\frac{3}{5} = \\frac{2 \\times 3}{3 \\times 5} = \\frac{6}{15} = \\frac{2}{5}$.\n\nCheck: in a square cut into 3 rows and 5 columns, 2 rows and 3 columns overlap in 6 of the 15 boxes.\n\n> **Watch out.** Multiply the tops and multiply the bottoms. Do not add the fractions.",
        "$\\frac{2}{3} \\times \\frac{3}{5} = \\frac{2 \\times 3}{3 \\times 5} = \\frac{6}{15} = \\frac{2}{5}$。\n\n检验：把正方形分成 3 行 5 列，涂 2 行和 3 列，重叠的是 15 格中的 6 格。\n\n> **注意。** 分子乘分子，分母乘分母。不要把两个分数相加。",
      ],
      (rng) => {
        const x = properFraction(rng, 9);
        const y = properFraction(rng, 9);
        const [a, b, c, d] = [Number(x.n), Number(x.d), Number(y.n), Number(y.d)];
        return answered(
          [`Find $${num(x)} \\times ${num(y)}$.`, `计算 $${num(x)} \\times ${num(y)}$。`],
          x.mul(y),
          [
            [
              ["Multiply the tops", "分子相乘"],
              ["The tops give the boxes shaded twice.", "分子相乘，得到涂了两次的格数。"],
              [`${a} \\times ${c} = ${a * c}`],
            ],
            [
              ["Multiply the bottoms", "分母相乘"],
              ["The bottoms give all the boxes.", "分母相乘，得到一共的格数。"],
              [`${b} \\times ${d} = ${b * d}`, `${num(x)} \\times ${num(y)} = ${fracOf(a * c, b * d)}`],
            ],
            ...simplestStep(a * c, b * d),
          ],
          [
            `Count in the grid: ${a * c} of the ${b * d} small boxes are shaded twice, which is $${fracOf(a * c, b * d)}$.`,
            `在方格中数一数：${b * d} 个小格中有 ${a * c} 个涂了两次，就是 $${fracOf(a * c, b * d)}$。`,
          ],
          [
            [x.add(y), "That adds the fractions instead of multiplying.", "这是把两个分数相加了，应该相乘。"],
            [x.div(y), "That flips the second fraction, which divides.", "这是把第二个分数倒过来了，那是除法。"],
            [q(a * c, b + d), "That adds the bottoms. Multiply them.", "这是把分母相加了，应该相乘。"],
          ],
          { form: "fraction", figure: productGrid(c, d, a, b) },
        );
      },
      productGrid(3, 5, 2, 3),
    ),
    point(
      "fraction-of-a-whole-number",
      ["A fraction of a whole number", "求整数的几分之几"],
      [
        "$\\frac{3}{4}$ of 20: one fourth of 20 is $20 \\div 4 = 5$, so three fourths is $3 \\times 5 = 15$.\n\nCheck: $\\frac{3 \\times 20}{4} = \\frac{60}{4} = 15$.\n\n> **Watch out.** Divide by the bottom too. $3 \\times 20 = 60$ is far too big.",
        "求 20 的 $\\frac{3}{4}$：20 的四分之一是 $20 \\div 4 = 5$，所以四分之三是 $3 \\times 5 = 15$。\n\n检验：$\\frac{3 \\times 20}{4} = \\frac{60}{4} = 15$。\n\n> **注意。** 还要除以分母。$3 \\times 20 = 60$ 太大了。",
      ],
      (rng) => {
        const f = properFraction(rng, 9);
        const [n, d] = [Number(f.n), Number(f.d)];
        const part = rng.int(2, 12);
        const w = d * part;
        const answer = n * part;
        return answered(
          [`What is $${num(f)}$ of ${w}?`, `${w} 的 $${num(f)}$ 是多少？`],
          answer,
          [
            [
              ["Find one part", "求一份"],
              [`Split ${w} into ${d} equal parts.`, `把 ${w} 平均分成 ${d} 份。`],
              [`${w} \\div ${d} = ${part}`],
            ],
            [
              ["Take the parts you need", "取需要的份数"],
              [`Take ${n} of the parts.`, `取其中 ${n} 份。`],
              [`${n} \\times ${part} = ${answer}`],
            ],
          ],
          [
            `Multiply first: $${n} \\times ${w} = ${n * w}$, and $${n * w} \\div ${d} = ${answer}$.`,
            `先乘：$${n} \\times ${w} = ${n * w}$，再算 $${n * w} \\div ${d} = ${answer}$。`,
          ],
          [
            [part, "That is only one part.", "这只是一份。"],
            [n * w, `That forgets to divide by ${d}.`, `这里忘了除以 ${d}。`],
            [w - answer, "That is the part that is left over.", "这是剩下的部分。"],
          ],
          { figure: equalTape(d, String(part), String(w), n) },
        );
      },
      equalTape(4, "5", "20", 3),
    ),
  ],
  intro: t(
    "Half of a garden has flowers, and $\\frac{2}{3}$ of the flower bed is roses. Roses cover $\\frac{2}{3} \\times \\frac{1}{2} = \\frac{2}{6} = \\frac{1}{3}$ of the garden.\n\nCheck: cut the garden into 6 equal boxes. The flowers fill 3 boxes, and the roses fill 2 of them, which is $\\frac{2}{6}$.\n\nIn this lesson we multiply fractions and find a fraction of a whole number.",
    "一个花园的一半种了花，花坛的 $\\frac{2}{3}$ 是玫瑰。玫瑰占整个花园的 $\\frac{2}{3} \\times \\frac{1}{2} = \\frac{2}{6} = \\frac{1}{3}$。\n\n检验：把花园平均分成 6 格。花占 3 格，其中玫瑰占 2 格，就是 $\\frac{2}{6}$。\n\n本课我们学习分数乘分数，以及求一个整数的几分之几。",
  ),
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
    point(
      "reciprocals",
      ["Reciprocals", "倒数"],
      [
        "The reciprocal of $\\frac{4}{7}$ is $\\frac{7}{4}$. The reciprocal of 6 is $\\frac{1}{6}$. For $2\\frac{1}{3} = \\frac{7}{3}$, it is $\\frac{3}{7}$.\n\nCheck: $\\frac{4}{7} \\times \\frac{7}{4} = \\frac{28}{28} = 1$.\n\n> **Watch out.** Change a mixed number to a fraction before you flip it.",
        "$\\frac{4}{7}$ 的倒数是 $\\frac{7}{4}$。6 的倒数是 $\\frac{1}{6}$。$2\\frac{1}{3} = \\frac{7}{3}$，它的倒数是 $\\frac{3}{7}$。\n\n检验：$\\frac{4}{7} \\times \\frac{7}{4} = \\frac{28}{28} = 1$。\n\n> **注意。** 带分数要先化成假分数，再倒过来。",
      ],
      (rng) => {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const n = rng.int(2, 12);
          return answered(
            [`Find the reciprocal of ${n}.`, `求 ${n} 的倒数。`],
            q(1, n),
            [
              [["Write a fraction", "写成分数"], [`${n} is ${n} wholes.`, `${n} 就是 ${n} 个整体。`], [`${n} = ${fracOf(n, 1)}`]],
              [["Flip", "倒过来"], ["Swap the top and the bottom.", "交换分子和分母。"], [`${fracOf(n, 1)} \\to ${fracOf(1, n)}`]],
            ],
            [
              `Multiply: $${n} \\times ${fracOf(1, n)} = ${fracOf(n, n)} = 1$.`,
              `相乘：$${n} \\times ${fracOf(1, n)} = ${fracOf(n, n)} = 1$。`,
            ],
            [
              [n, "That is the same number. It is not flipped.", "这还是原来的数，没有倒过来。"],
              [1, `That writes ${n} on the top and the bottom, which is 1.`, `这是分子分母都写 ${n}，等于 1。`],
              [q(n - 1, n), `That is what is left after taking $${fracOf(1, n)}$ from 1.`, `这是 1 减去 $${fracOf(1, n)}$ 剩下的部分。`],
            ],
            { form: "fraction", figure: barFigure(n, 1) },
          );
        }
        if (kind === 1) {
          const f = properFraction(rng, 12);
          const [a, b] = [Number(f.n), Number(f.d)];
          return answered(
            [`Find the reciprocal of $${num(f)}$.`, `求 $${num(f)}$ 的倒数。`],
            q(b, a),
            [
              [
                ["Flip", "倒过来"],
                [`The top ${a} goes to the bottom, and the bottom ${b} goes to the top.`, `分子 ${a} 换到下面，分母 ${b} 换到上面。`],
                [`${fracOf(a, b)} \\to ${fracOf(b, a)}`],
              ],
            ],
            [
              `Multiply: $${fracOf(a, b)} \\times ${fracOf(b, a)} = ${fracOf(a * b, a * b)} = 1$.`,
              `相乘：$${fracOf(a, b)} \\times ${fracOf(b, a)} = ${fracOf(a * b, a * b)} = 1$。`,
            ],
            [
              [f, "That is the same number. It is not flipped.", "这还是原来的数，没有倒过来。"],
              [q(b - a, b), "That is what is left to make 1.", "这是凑成 1 还差的部分。"],
              [a * b, "That multiplies the top and the bottom.", "这是把分子和分母相乘了。"],
              [b + 1, "That adds 1 to the bottom.", "这是给分母加了 1。"],
            ],
            { form: "fraction", figure: groupedBarsFigure(1, b, a) },
          );
        }
        const w = rng.int(1, 4);
        const f = properFraction(rng, 8);
        const [a, b] = [Number(f.n), Number(f.d)];
        const top = w * b + a;
        return answered(
          [`Find the reciprocal of $${w}${num(f)}$.`, `求 $${w}${num(f)}$ 的倒数。`],
          q(b, top),
          [
            [
              ["Write a fraction", "化成假分数"],
              [
                `${w} wholes are ${w * b} parts of $${fracOf(1, b)}$, and ${a} more makes ${top}.`,
                `${w} 个整体是 ${w * b} 个 $${fracOf(1, b)}$，再加 ${a} 个是 ${top} 个。`,
              ],
              [`${w}${num(f)} = ${fracOf(top, b)}`],
            ],
            [["Flip", "倒过来"], ["Swap the top and the bottom.", "交换分子和分母。"], [`${fracOf(top, b)} \\to ${fracOf(b, top)}`]],
          ],
          [
            `Multiply: $${fracOf(top, b)} \\times ${fracOf(b, top)} = ${fracOf(top * b, top * b)} = 1$.`,
            `相乘：$${fracOf(top, b)} \\times ${fracOf(b, top)} = ${fracOf(top * b, top * b)} = 1$。`,
          ],
          [
            [
              q(w * a + b, a),
              `That flips only the fraction part to get $${w}${fracOf(b, a)}$.`,
              `这只把分数部分倒过来，得到 $${w}${fracOf(b, a)}$。`,
            ],
            [q(b, a), `That flips $${num(f)}$ and drops the ${w}.`, `这只把 $${num(f)}$ 倒过来，丢掉了 ${w}。`],
            [q(top, b), "That is the same number written as a fraction.", "这只是把原来的数写成了假分数。"],
          ],
          { form: "fraction", figure: barFigure(b, top, w + 1) },
        );
      },
      barFigure(7, 4),
    ),
    point(
      "dividing-by-a-fraction",
      ["Dividing by a fraction", "除以分数"],
      [
        "Keep the first fraction, flip the second, and multiply: $\\frac{3}{4} \\div \\frac{2}{5} = \\frac{3}{4} \\times \\frac{5}{2} = \\frac{15}{8} = 1\\frac{7}{8}$. The answer is bigger than $\\frac{3}{4}$, since we divide by a number less than 1.\n\nCheck: multiply back: $\\frac{15}{8} \\times \\frac{2}{5} = \\frac{30}{40} = \\frac{3}{4}$.\n\n> **Watch out.** Flip only the second fraction. Flipping $\\frac{3}{4}$ gives the wrong answer.",
        "第一个分数不变，把第二个倒过来，再相乘：$\\frac{3}{4} \\div \\frac{2}{5} = \\frac{3}{4} \\times \\frac{5}{2} = \\frac{15}{8} = 1\\frac{7}{8}$。除以一个小于 1 的数，结果比 $\\frac{3}{4}$ 大。\n\n检验：乘回去：$\\frac{15}{8} \\times \\frac{2}{5} = \\frac{30}{40} = \\frac{3}{4}$。\n\n> **注意。** 只把第二个分数倒过来。把 $\\frac{3}{4}$ 倒过来就错了。",
      ],
      (rng) => {
        const whole = rng.bool(0.2);
        const x = whole ? Q.of(rng.int(2, 6)) : properFraction(rng, 10);
        let y = properFraction(rng, 10);
        while (x.eq(y)) y = properFraction(rng, 10);
        const [a, b, c, d] = [Number(x.n), Number(x.d), Number(y.n), Number(y.d)];
        return answered(
          [`Find $${num(x)} \\div ${num(y)}$.`, `计算 $${num(x)} \\div ${num(y)}$。`],
          x.div(y),
          [
            [
              ["Flip the divisor", "除数变成倒数"],
              [`Dividing by $${num(y)}$ is multiplying by $${fracOf(d, c)}$.`, `除以 $${num(y)}$ 等于乘 $${fracOf(d, c)}$。`],
              [`${num(x)} \\div ${num(y)} = ${num(x)} \\times ${fracOf(d, c)}`],
            ],
            [
              ["Multiply", "相乘"],
              ["Multiply the tops and the bottoms.", "分子乘分子，分母乘分母。"],
              [`${num(x)} \\times ${fracOf(d, c)} = ${fracOf(a * d, b * c)}`],
            ],
            ...simplestStep(a * d, b * c),
          ],
          [
            `Multiply back: $${fracOf(a * d, b * c)} \\times ${num(y)} = ${fracOf(a * d * c, b * c * d)} = ${num(x)}$.`,
            `乘回去：$${fracOf(a * d, b * c)} \\times ${num(y)} = ${fracOf(a * d * c, b * c * d)} = ${num(x)}$。`,
          ],
          [
            [x.mul(y), "That multiplies without flipping.", "这里没有倒过来就相乘了。"],
            [y.div(x), "That flips the wrong fraction. Only the second one is flipped.", "这里倒错了分数。只有第二个分数要倒过来。"],
            [Q.one.div(x.mul(y)), "That flips both fractions.", "这是把两个分数都倒过来了。"],
          ],
          { form: "mixed", figure: whole ? groupedBarsFigure(a, d, c) : twoBarsFigure(b, a, d, c) },
        );
      },
      twoBarsFigure(4, 3, 5, 2),
    ),
  ],
  intro: t(
    "Jo has $\\frac{3}{4}$ pound of beads and fills bags of $\\frac{1}{8}$ pound. $\\frac{3}{4} \\div \\frac{1}{8} = \\frac{3}{4} \\times 8 = 6$ bags.\n\nCheck: $6 \\times \\frac{1}{8} = \\frac{6}{8} = \\frac{3}{4}$.\n\nIn this lesson we find reciprocals and divide by a fraction by multiplying by its reciprocal.",
    "乔有 $\\frac{3}{4}$ 磅珠子，每袋装 $\\frac{1}{8}$ 磅。$\\frac{3}{4} \\div \\frac{1}{8} = \\frac{3}{4} \\times 8 = 6$ 袋。\n\n检验：$6 \\times \\frac{1}{8} = \\frac{6}{8} = \\frac{3}{4}$。\n\n本课我们求倒数，并用乘倒数的方法除以分数。",
  ),
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

/** aFractionOfAFractionOfANumber takes one fraction of a number and then a second fraction of the result. */
export const aFractionOfAFractionOfANumber = point(
  "a-fraction-of-a-fraction-of-a-number",
  ["A fraction of a fraction of a number", "一个数的几分之几的几分之几"],
  [
    "A class has 24 kids. $\\frac{3}{4}$ of them walk to school, and $\\frac{1}{3}$ of the walkers walk with a parent. $\\frac{3}{4}$ of 24 is 18, and $\\frac{1}{3}$ of 18 is 6.\n\nCheck: $\\frac{1}{3} \\times \\frac{3}{4} = \\frac{1}{4}$, and $\\frac{1}{4}$ of 24 is 6.\n\n> **Watch out.** Take the second fraction of the walkers, 18, not of all 24 kids.",
    "一个班有 24 个孩子。其中 $\\frac{3}{4}$ 步行上学，步行的孩子中有 $\\frac{1}{3}$ 由家长陪同。24 的 $\\frac{3}{4}$ 是 18，18 的 $\\frac{1}{3}$ 是 6。\n\n检验：$\\frac{1}{3} \\times \\frac{3}{4} = \\frac{1}{4}$，24 的 $\\frac{1}{4}$ 是 6。\n\n> **注意。** 第二个分数是步行人数 18 的几分之几，不是全部 24 人的。",
  ],
  (rng) => {
    const a = rng.int(2, 5);
    const b = rng.pick([3, 4, 5, 6]);
    const c = rng.int(1, b - 1);
    const unit = rng.int(1, 6);
    const n = a * b * unit;
    const first = (n * c) / b;
    const answer = first / a;
    return answered(
      [
        `A school has ${n} students. $${fracOf(c, b)}$ of them walk to school, and $${fracOf(1, a)}$ of the walkers walk with a parent. How many students walk with a parent?`,
        `一所学校有 ${n} 名学生。其中 $${fracOf(c, b)}$ 步行上学，步行的学生中有 $${fracOf(1, a)}$ 由家长陪同。由家长陪同步行的学生有多少名？`,
      ],
      answer,
      [
        [
          ["Find the walkers", "求步行的人数"],
          [`Take $${fracOf(c, b)}$ of ${n}.`, `求 ${n} 的 $${fracOf(c, b)}$。`],
          [`${n} \\div ${b} \\times ${c} = ${first}`],
        ],
        [
          ["Find those with a parent", "求有家长陪同的人数"],
          [`Take $${fracOf(1, a)}$ of the ${first} walkers.`, `求 ${first} 名步行学生的 $${fracOf(1, a)}$。`],
          [`${first} \\div ${a} = ${answer}`],
        ],
      ],
      [
        `Multiply the fractions first: $${fracOf(1, a)} \\times ${fracOf(c, b)} = ${fracOf(c, a * b)}$. Then $${n} \\div ${a * b} \\times ${c} = ${answer}$.`,
        `先把两个分数相乘：$${fracOf(1, a)} \\times ${fracOf(c, b)} = ${fracOf(c, a * b)}$。再算 $${n} \\div ${a * b} \\times ${c} = ${answer}$。`,
      ],
      [
        [first, "That is all the walkers, not those with a parent.", "这是全部步行的人数，不是有家长陪同的人数。"],
        [n - first, "That is the students who do not walk.", "这是不步行的学生人数。"],
        [n / a, `That takes $${fracOf(1, a)}$ of all the students.`, `这是求全部学生的 $${fracOf(1, a)}$。`],
      ],
      { figure: equalTape(b, String(n / b), String(n), c) },
    );
  },
  equalTape(4, "6", "24", 3),
);

/** theWholeFromAFractionOfIt finds a number from a known fraction of it, one part at a time. */
export const theWholeFromAFractionOfIt = point(
  "the-whole-from-a-fraction-of-it",
  ["The whole from a fraction of it", "由几分之几求整体"],
  [
    "$\\frac{2}{5}$ of a number is 12. One fifth is $12 \\div 2 = 6$, so the number is $5 \\times 6 = 30$.\n\nCheck: $\\frac{2}{5}$ of 30 is $30 \\div 5 \\times 2 = 12$.\n\n> **Watch out.** The number is bigger than 12. Do not take $\\frac{2}{5}$ of 12.",
    "一个数的 $\\frac{2}{5}$ 是 12。五分之一是 $12 \\div 2 = 6$，所以这个数是 $5 \\times 6 = 30$。\n\n检验：30 的 $\\frac{2}{5}$ 是 $30 \\div 5 \\times 2 = 12$。\n\n> **注意。** 这个数比 12 大。不要去求 12 的 $\\frac{2}{5}$。",
  ],
  (rng) => {
    const d = rng.int(3, 10);
    let n = rng.int(2, d - 1);
    while (gcd(n, d) !== 1) n--;
    const part = rng.int(2, 12);
    const known = n * part;
    const answer = d * part;
    return answered(
      [`$${fracOf(n, d)}$ of a number is ${known}. What is the number?`, `一个数的 $${fracOf(n, d)}$ 是 ${known}。这个数是多少？`],
      answer,
      [
        [["Find one part", "求一份"], [`${n} parts make ${known}.`, `${n} 份是 ${known}。`], [`${known} \\div ${n} = ${part}`]],
        [["Find the whole", "求整体"], [`The number has ${d} parts.`, `这个数有 ${d} 份。`], [`${d} \\times ${part} = ${answer}`]],
      ],
      [
        `Take $${fracOf(n, d)}$ of ${answer}: $${answer} \\div ${d} \\times ${n} = ${known}$.`,
        `求 ${answer} 的 $${fracOf(n, d)}$：$${answer} \\div ${d} \\times ${n} = ${known}$。`,
      ],
      [
        [
          q(known * n, d),
          `That takes $${fracOf(n, d)}$ of ${known}, which is too small.`,
          `这是求 ${known} 的 $${fracOf(n, d)}$，太小了。`,
        ],
        [part, "That is one part, not the whole number.", "这只是一份，不是整个数。"],
        [known * d, `That multiplies by ${d} but forgets to divide by ${n}.`, `这里乘了 ${d}，但忘了除以 ${n}。`],
      ],
      { figure: partsTape("?", n, d) },
    );
  },
  partsTape("?", 2, 5),
);
