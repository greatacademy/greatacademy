// A third knowledge point for the school topics that live in the algebra shard because the algebra courses build on them.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";

import { equalAnglesInAnAngle } from "./angles.ts";
import { oddFractionOut } from "./fractions.ts";
import { drawn, lesson, valued } from "./grade-6-kit.ts";
import { boxPlotFigure, dotPlotFigure } from "./statistics.ts";
import { equalTape } from "./upper-grades-kit.ts";

/** frac writes a fraction in LaTeX. */
const frac = (n: number, d: number) => `\\frac{${n}}{${d}}`;

/** deeperAlgebraThirdPoints holds the third knowledge points of these school topics, by topic. */
export const deeperAlgebraThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  ratios: [
    lesson(
      "a-part-as-a-fraction-of-the-whole",
      ["A part as a fraction of the whole", "部分占整体的几分之几"],
      [
        [
          "A ratio compares one part with another part; a fraction of the whole compares a part with everything. So the sum of the ratio's numbers becomes the denominator. Red to blue $2 : 3$ means $2$ red in every $2 + 3 = 5$ marbles, so $\\frac{2}{5}$ are red.",
          "比是一部分和另一部分比；占整体的分数是一部分和全部比。所以比的各项之和成为分母。红与蓝是 $2 : 3$，表示每 $2 + 3 = 5$ 颗弹珠中有 $2$ 颗红的，所以红的占 $\\frac{2}{5}$。",
        ],
        ["$\\frac{2}{5} + \\frac{3}{5} = 1$, the whole bag.", "$\\frac{2}{5} + \\frac{3}{5} = 1$，正好是整袋。"],
        [
          "The denominator is the total, not the other part. $\\frac{2}{3}$ is red compared with blue.",
          "分母是总数，不是另一部分。$\\frac{2}{3}$ 是红和蓝的比。",
        ],
      ],
      (rng) => {
        let a = rng.int(2, 15);
        let b = rng.int(2, 15);
        while (a === b) b = rng.int(2, 15);
        const blue = rng.bool();
        if (blue) [a, b] = [b, a];
        const [it, other, itZh, otherZh] = blue ? ["blue", "red", "蓝", "红"] : ["red", "blue", "红", "蓝"];
        const answer = Q.of(a, a + b);
        return valued(
          [
            `A bag has red and blue marbles in the ratio ${blue ? `$${b} : ${a}$` : `$${a} : ${b}$`}. What fraction of the marbles are ${it}?`,
            `一个袋子里红、蓝弹珠的比是 ${blue ? `$${b} : ${a}$` : `$${a} : ${b}$`}。${itZh}弹珠占全部弹珠的几分之几？`,
          ],
          answer,
          [
            [["Count the whole", "求总份数"], ["Add the ratio's numbers:", "把比的各项相加："], [`${a} + ${b} = ${a + b}`]],
            [
              ["Write the fraction", "写出分数"],
              [`The ${it} parts over all the parts:`, `${itZh}的份数比总份数：`],
              [`\\frac{${a}}{${a + b}}${answer.toLatex() !== frac(a, a + b) ? ` = ${answer.toLatex()}` : ""}`],
            ],
          ],
          [
            `The ${other} marbles are $\\frac{${b}}{${a + b}}$, and $\\frac{${a}}{${a + b}} + \\frac{${b}}{${a + b}} = 1$.`,
            `${otherZh}弹珠占 $\\frac{${b}}{${a + b}}$，$\\frac{${a}}{${a + b}} + \\frac{${b}}{${a + b}} = 1$。`,
          ],
          [
            [
              Q.of(a, b),
              `That compares ${it} with ${other}, not with all the marbles.`,
              `这是${itZh}和${otherZh}的比，不是和全部弹珠的比。`,
            ],
            [Q.of(b, a + b), `That is the fraction that are ${other}.`, `这是${otherZh}弹珠占的分数。`],
            [Q.of(a + b, a), "That is upside down.", "这颠倒了。"],
          ],
          { form: "fraction" },
        );
      },
      equalTape(5, "1", "5", 2),
    ),
  ],
  "equivalent-fractions": [oddFractionOut],
  "angles-and-angle-measures": [equalAnglesInAnAngle],
  "dot-plots": [
    lesson(
      "the-fraction-of-the-dots",
      ["The fraction of the dots", "点数所占的分数"],
      [
        [
          "Each dot in a dot plot is one value, so the number of dots is the size of the data set. A fraction of the data compares the dots that qualify with all of the dots. If $5$ of $20$ dots are at least $7$, then $\\frac{5}{20} = \\frac{1}{4}$ of the values are at least $7$.",
          "点图中每个点是一个数据，所以点的总数就是数据的个数。数据所占的分数，是符合条件的点数与所有点数的比。如果 $20$ 个点中有 $5$ 个不小于 $7$，那么不小于 $7$ 的数据占 $\\frac{5}{20} = \\frac{1}{4}$。",
        ],
        ["$\\frac{1}{4}$ of $20$ dots is $5$ dots.", "$20$ 个点的 $\\frac{1}{4}$ 是 $5$ 个点。"],
        ["Put all the dots in the denominator, not only the dots that do not qualify.", "分母是所有的点数，不只是不符合条件的点数。"],
      ],
      (rng) => {
        for (;;) {
          const lo = rng.int(0, 9);
          const n = rng.pick([10, 12, 15, 16, 18, 20, 24]);
          const xs = [lo, lo + 8, ...Array.from({ length: n - 2 }, () => rng.int(lo, lo + 8))];
          const v = ([...xs].sort((a, b) => a - b)[Math.floor(n / 2)] as number) + rng.int(0, 1);
          const count = xs.filter((x) => x >= v).length;
          if (count === 0 || count === n) continue;
          const stacks = Array.from({ length: lo + 9 - v }, (_, i) => xs.filter((x) => x === v + i).length);
          return valued(
            [
              `The dot plot shows a data set. What fraction of the values are at least $${v}$?`,
              `点图表示一组数据。不小于 $${v}$ 的数据占几分之几？`,
            ],
            Q.of(count, n),
            [
              [
                ["Count the dots that qualify", "数符合条件的点"],
                [`The stacks at $${v}$ and to its right hold:`, `$${v}$ 及其右边各处的点数是：`],
                [`${stacks.join(" + ")} = ${count}`],
              ],
              [
                ["Compare with all the dots", "与总点数比较"],
                [`There are $${n}$ dots in all:`, `一共有 $${n}$ 个点：`],
                [`\\frac{${count}}{${n}} = ${Q.of(count, n).toLatex()}`],
              ],
            ],
            [
              `The other $${n - count}$ dots are below $${v}$, and $\\frac{${count}}{${n}} + \\frac{${n - count}}{${n}} = 1$.`,
              `其余 $${n - count}$ 个点小于 $${v}$，而 $\\frac{${count}}{${n}} + \\frac{${n - count}}{${n}} = 1$。`,
            ],
            [
              [Q.of(n - count, n), `That is the fraction below $${v}$.`, `这是小于 $${v}$ 的数据所占的分数。`],
              [
                Q.of(count, n - count),
                "That compares with the dots that do not qualify, not with all the dots.",
                "这是与不符合条件的点数比，不是与所有点数比。",
              ],
              [
                Q.of(xs.filter((x) => x > v).length, n),
                `That leaves out the dots at $${v}$; “at least” includes $${v}$.`,
                `这漏掉了 $${v}$ 上的点；“不小于”包括 $${v}$。`,
              ],
            ],
            { form: "fraction", figure: dotPlotFigure(xs, { min: lo, max: lo + 8, step: 1 }) },
          );
        }
      },
      drawn(gradeDrawings4["dot-plots#the-fraction-of-the-dots"]),
    ),
  ],
  "box-plots": [
    lesson(
      "how-many-values-from-the-quarters",
      ["How many values from the quarters", "由四分之一求个数"],
      [
        [
          "A box plot cuts the data into four parts with about the same number of values, however wide each part looks. So the number of values in a part comes from the size of the data set. With $40$ scores, each part holds about $40 \\div 4 = 10$, and the box, two parts, holds about $20$.",
          "箱线图把数据分成四部分，每部分的数据个数大致相同，不管看起来多宽。所以每部分的个数由数据总数决定。有 $40$ 个分数时，每部分大约 $40 \\div 4 = 10$ 个，箱子占两部分，大约 $20$ 个。",
        ],
        ["$10 + 10 + 10 + 10 = 40$, all the scores.", "$10 + 10 + 10 + 10 = 40$，正是全部分数。"],
        [
          "Count the parts, not their widths. A wide part holds no more values than a narrow one.",
          "数的是部分的个数，不是宽度。宽的部分并不比窄的部分包含更多数据。",
        ],
      ],
      (rng) => {
        const n = rng.pick([20, 40, 60, 80, 100, 120, 200]);
        const q1 = rng.int(3, 7);
        const med = q1 + rng.int(1, 4);
        const q3 = med + rng.int(1, 4);
        const lo = rng.int(0, q1 - 1);
        const hi = q3 + rng.int(1, 5);
        const [en, zh, parts] = rng.pick([
          [`greater than $${q3}$`, `大于 $${q3}$`, 1],
          [`less than $${q1}$`, `小于 $${q1}$`, 1],
          [`between $${q1}$ and $${q3}$`, `在 $${q1}$ 和 $${q3}$ 之间`, 2],
          [`greater than $${q1}$`, `大于 $${q1}$`, 3],
        ] as const);
        const each = n / 4;
        const answer = parts * each;
        return valued(
          [
            `The box plot summarizes $${n}$ scores. About how many of the scores are ${en}?`,
            `箱线图概括了 $${n}$ 个分数。大约有多少个分数${zh}？`,
          ],
          answer,
          [
            [
              ["One part", "一部分"],
              ["Each of the four parts holds about the same number:", "四部分各有大致相同的个数："],
              [`${n} \\div 4 = ${each}`],
            ],
            [
              ["Count the parts", "数部分"],
              [`That range covers $${parts}$ of the $4$ parts:`, `这个范围占 $4$ 部分中的 $${parts}$ 部分：`],
              [`${parts} \\times ${each} = ${answer}`],
            ],
          ],
          [
            `The other $${4 - parts}$ ${4 - parts === 1 ? "part holds" : "parts hold"} about $${n - answer}$, and $${answer} + ${n - answer} = ${n}$.`,
            `其余 $${4 - parts}$ 部分大约有 $${n - answer}$ 个，而 $${answer} + ${n - answer} = ${n}$。`,
          ],
          [
            [n, "That is all the scores.", "这是全部分数的个数。"],
            [n / 2, "That is half of the scores; count the parts again.", "这是一半的分数，再数一数占几部分。"],
            [n - answer, "That counts the parts on the other side.", "这数的是另一边的部分。"],
            [q3 - q1, "That is the interquartile range, a width on the plot, not a count.", "这是四分位距，是图上的宽度，不是个数。"],
          ],
          { figure: boxPlotFigure([lo, q1, med, q3, hi], { min: 0, max: 20, step: 1, labelEvery: 2 }) },
        );
      },
      drawn(gradeDrawings4["box-plots#how-many-values-from-the-quarters"]),
    ),
  ],
};
