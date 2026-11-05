// A third knowledge point for the school topics that live in the algebra shard because the algebra courses build on them.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";

import { numberProblem } from "../problems.ts";
import { chooseMath, type Pair, whole } from "./early-grades-more-kit.ts";
import { boxPlotFigure, dotPlotFigure } from "./statistics.ts";

/** skill builds a knowledge point from its texts and generator. */
const skill = (id: string, title: Pair, explanation: Pair, generate: KnowledgePointDef["generate"]): KnowledgePointDef => ({
  id,
  title: t(title[0], title[1]),
  explanation: t(explanation[0], explanation[1]),
  generate,
});

/** fraction builds a problem whose answer is a fraction, dropping wrong answers equal to it. */
const fraction = (prompt: Pair, answer: Q, wrong: readonly Q[], solution: Pair) =>
  numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    wrong: wrong.filter((w) => !w.eq(answer)),
    solution: t(solution[0], solution[1]),
  });

/** frac writes a fraction in LaTeX. */
const frac = (n: number, d: number) => `\\frac{${n}}{${d}}`;

/** deeperAlgebraThirdPoints holds the third knowledge points of these school topics, by topic. */
export const deeperAlgebraThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  ratios: [
    skill(
      "a-part-as-a-fraction-of-the-whole",
      ["A part as a fraction of the whole", "部分占整体的几分之几"],
      [
        "A ratio compares one part with another, while a fraction of the whole compares a part with the total. So the total of the ratio's numbers becomes the denominator of the fraction.",
        "比是一部分与另一部分的比较，而分数是部分与总数的比较。所以比的各项之和成为分数的分母。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = rng.int(2, 15);
        return fraction(
          [
            `A bag has red and blue marbles in the ratio ${a} : ${b}. What fraction of the marbles are red?`,
            `一个袋子里红、蓝弹珠的比是 ${a} : ${b}。红弹珠占全部弹珠的几分之几？`,
          ],
          Q.of(a, a + b),
          [Q.of(a, b), Q.of(b, a + b), Q.of(a + b, a)],
          [
            `For every ${a} red there are ${a + b} marbles in all, so the fraction is $${frac(a, a + b)}$.`,
            `每 ${a} 个红弹珠对应共 ${a + b} 个弹珠，所以是 $${frac(a, a + b)}$。`,
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
            `$${frac(n + add, d + add)}$ adds $${add}$ to both numbers, which changes the value. The others multiply both by the same number.`,
            `$${frac(n + add, d + add)}$ 是分子分母同时加 $${add}$，值变了。其他的都是同时乘同一个数。`,
          ],
        );
      },
    ),
  ],
  "angles-and-angle-measures": [
    {
      ...skill(
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
              `Rays from the vertex cut an angle of $${whole_}^\\circ$ into $${k}$ equal angles. What is the measure of each, in degrees?`,
              `从顶点引出的射线把 $${whole_}^\\circ$ 的角分成 $${k}$ 个相等的角。每个角是多少度？`,
            ],
            each,
            [whole_ - k, whole_ * k, k + each],
            [
              `The $${k}$ equal angles fill the whole angle, so $${whole_} \\div ${k} = ${each}$.`,
              `$${k}$ 个相等的角合成整个角，所以 $${whole_} \\div ${k} = ${each}$。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["angles-and-angle-measures#an-angle-cut-into-equal-angles"],
    },
  ],
  "dot-plots": [
    {
      ...skill(
        "the-fraction-of-the-dots",
        ["The fraction of the dots", "点数所占的分数"],
        [
          "Each dot in a dot plot is one value, so the number of dots is the size of the data set. A fraction of the data compares the dots that qualify with all of the dots.",
          "点图中每个点是一个数据，所以点的总数就是数据的个数。数据所占的分数，是符合条件的点数与所有点数的比。",
        ],
        (rng) => {
          const lo = rng.int(0, 9);
          const n = rng.pick([10, 12, 15, 16, 18, 20, 24]);
          const xs = [lo, lo + 8, ...Array.from({ length: n - 2 }, () => rng.int(lo, lo + 8))];
          const v = [...xs].sort((a, b) => a - b)[Math.floor(n / 2)]! + rng.int(0, 1);
          const count = xs.filter((x) => x >= v).length;
          return {
            ...fraction(
              [
                `The dot plot shows a data set. What fraction of the values are at least $${v}$?`,
                `点图表示一组数据。至少为 $${v}$ 的数据占几分之几？`,
              ],
              Q.of(count, n),
              [Q.of(n - count, n), Q.of(count, n + 1), Q.of(xs.filter((x) => x > v).length, n)],
              [
                `$${count}$ of the $${n}$ dots are at $${v}$ or above, so the fraction is $${frac(count, n)}$.`,
                `$${n}$ 个点中有 $${count}$ 个在 $${v}$ 或以上，所以是 $${frac(count, n)}$。`,
              ],
            ),
            figure: dotPlotFigure(xs, { min: lo, max: lo + 8, step: 1 }),
          };
        },
      ),
      figure: gradeDrawings4["dot-plots#the-fraction-of-the-dots"],
    },
  ],
  "box-plots": [
    {
      ...skill(
        "how-many-values-from-the-quarters",
        ["How many values from the quarters", "由四分之一求个数"],
        [
          "A box plot cuts the data into four parts with about the same number of values, however wide each part looks. So the number of values in a part comes from the size of the data set.",
          "箱线图把数据分成四部分，每部分的数据个数大致相同，不管看起来多宽。所以每部分的个数由数据总数决定。",
        ],
        (rng) => {
          const n = rng.pick([20, 40, 60, 80, 100, 120, 200]);
          const q1 = rng.int(3, 7);
          const med = q1 + rng.int(1, 4);
          const q3 = med + rng.int(1, 4);
          const lo = rng.int(0, q1 - 1);
          const hi = q3 + rng.int(1, 5);
          const form = rng.int(0, 3);
          const [en, zh, parts] = (
            [
              [`greater than ${q3}`, `大于 ${q3}`, 1],
              [`less than ${q1}`, `小于 ${q1}`, 1],
              [`between ${q1} and ${q3}`, `在 ${q1} 和 ${q3} 之间`, 2],
              [`greater than ${q1}`, `大于 ${q1}`, 3],
            ] as const
          )[form]!;
          const answer = (n * parts) / 4;
          return whole(
            [
              `The box plot summarizes $${n}$ scores. About how many of the scores are ${en}?`,
              `箱线图概括了 $${n}$ 个分数。大约有多少个分数${zh}？`,
            ],
            answer,
            [n, n / 2 === answer ? n / 4 : n / 2, (n * (parts === 3 ? 1 : 3)) / 4, q3 - q1],
            [
              `That range covers $${parts}$ of the $4$ parts, and $${n} \\times ${frac(parts, 4)} = ${answer}$.`,
              `这个范围占 $4$ 部分中的 $${parts}$ 部分，$${n} \\times ${frac(parts, 4)} = ${answer}$。`,
            ],
            boxPlotFigure([lo, q1, med, q3, hi], { min: 0, max: 20, step: 1, labelEvery: 2 }),
          );
        },
      ),
      figure: gradeDrawings4["box-plots#how-many-values-from-the-quarters"],
    },
  ],
};
