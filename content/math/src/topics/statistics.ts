import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Axis, boxPlot, dec, dotPlot, type FiveNumberSummary, Q } from "@ga/subject-math";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";

import { isTerminating } from "../problems.ts";
import { type Pair, tableFigure, type Walk } from "./early-grades-more-kit.ts";
import { chosen, drawn, lesson, type Off, valued, withIntro } from "./grade-6-kit.ts";
import { lineFigure, tapeFigure } from "./upper-grades-kit.ts";

/** list writes a data set: "12, 7, 9". */
const list = (xs: readonly number[]) => xs.join(", ");

const sorted = (xs: readonly number[]) => [...xs].sort((a, b) => a - b);
const sum = (xs: readonly number[]) => xs.reduce((s, x) => s + x, 0);
const mean = (xs: readonly number[]) => Q.of(sum(xs), xs.length);

/** median is the middle value of a data set, or the mean of the two middle values. */
function median(xs: readonly number[]): Q {
  const s = sorted(xs);
  const h = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? Q.of(s[h]!) : Q.of(s[h - 1]! + s[h]!, 2);
}

/** quartiles are the medians of the lower and upper halves, the median itself excluded when the count is odd. */
function quartiles(xs: readonly number[]): [Q, Q] {
  const s = sorted(xs);
  const h = Math.floor(s.length / 2);
  return [median(s.slice(0, h)), median(s.slice(s.length - h))];
}

/** isOutlier tells whether x lies outside the fences Q₁ − 1.5·IQR and Q₃ + 1.5·IQR of xs. */
function isOutlier(xs: readonly number[], x: number): boolean {
  const [q1, q3] = quartiles(xs);
  const k = q3.sub(q1).mul(Q.of(3, 2));
  return Q.of(x).cmp(q1.sub(k)) < 0 || Q.of(x).cmp(q3.add(k)) > 0;
}

/** data draws n integers in [lo, hi]. */
const data = (rng: Rng, n: number, lo: number, hi: number) => Array.from({ length: n }, () => rng.int(lo, hi));

/** terminatingMean draws data whose mean has at most two decimal places. */
function terminatingMean(rng: Rng, n: number, lo: number, hi: number): number[] {
  for (;;) {
    const xs = data(rng, n, lo, hi);
    if (mean(xs).mul(Q.of(100)).isInteger()) return xs;
  }
}

/** dotPlotFigure draws a data set as a dot plot, with alt text listing how many dots sit at each value. */
export function dotPlotFigure(xs: readonly number[], axis: Axis): Figure {
  const counts = [...new Set(sorted(xs))].map((v) => [v, xs.filter((x) => x === v).length] as const);
  return {
    svg: dotPlot(xs, axis),
    alt: t(
      `Dot plot: ${counts.map(([v, n]) => `${n} at ${v}`).join(", ")}.`,
      `点图：${counts.map(([v, n]) => `${v} 处 ${n} 个点`).join("，")}。`,
    ),
  };
}

/** boxPlotFigure draws a five-number summary as a box plot, with alt text giving the five numbers. */
export function boxPlotFigure(s: FiveNumberSummary, axis: Axis): Figure {
  const [lo, q1, med, q3, hi] = s;
  return {
    svg: boxPlot(s, axis),
    alt: t(
      `Box plot: minimum ${lo}, first quartile ${q1}, median ${med}, third quartile ${q3}, maximum ${hi}.`,
      `箱线图：最小值 ${lo}，第一四分位数 ${q1}，中位数 ${med}，第三四分位数 ${q3}，最大值 ${hi}。`,
    ),
  };
}

/** setOptions are the two data sets of a comparison. */
const _setOptions: readonly Text[] = [t("Data set A", "数据集 A"), t("Data set B", "数据集 B")];

/** unitAxis is a number line from 0 to 10 for the small example data sets. */
const unitAxis: Axis = { min: 0, max: 10, step: 1 };

/** balance splits the distances of xs from m into the total above and the total below, which are equal when m is the mean. */
function balance(xs: readonly number[], fs: readonly number[], m: number): [number, number] {
  const above = sum(xs.map((x, i) => (x > m ? (x - m) * (fs[i] ?? 1) : 0)));
  const below = sum(xs.map((x, i) => (x < m ? (m - x) * (fs[i] ?? 1) : 0)));
  return [above, below];
}

export const meanOfADataSet: TopicDef = withIntro(
  {
    id: "mean-of-a-data-set",
    title: t("The Mean of a Data Set", "数据的平均数"),
    summary: t("Compute the mean of a data set, and find a missing value from the mean.", "计算一组数据的平均数，并由平均数求缺失的数据。"),
    prerequisites: ["decimal-arithmetic"],
    encompasses: [],
    xp: 10,
    standards: ["CCSS.6.SP.B.5.C"],
    knowledgePoints: [
      lesson(
        "computing-the-mean",
        ["Computing the mean", "计算平均数"],
        [
          [
            "The **mean** of a data set is the sum of the values divided by how many values there are. For $4, 9, 5, 6$ the sum is $24$ and there are $4$ values, so the mean is $24 \\div 4 = 6$. It is the share each would get if the total were shared equally.",
            "一组数据的**平均数**等于所有数据之和除以数据的个数。对于 $4, 9, 5, 6$，和是 $24$，共 $4$ 个数，所以平均数是 $24 \\div 4 = 6$。它就是把总数平均分时每份的大小。",
          ],
          ["$4 \\times 6 = 24$, the same total.", "$4 \\times 6 = 24$，总数不变。"],
          [
            "Divide by the number of values, not by one less. The mean need not be one of the values, or a whole number.",
            "要除以数据的个数，不是比它少一。平均数不一定是其中某个数，也不一定是整数。",
          ],
        ],
        (rng) => {
          const n = rng.int(4, 8);
          const xs = terminatingMean(rng, n, 1, 40);
          const m = mean(xs);
          const offs: Off[] = [
            [sum(xs), `That is the sum. Divide it by the $${n}$ values.`, `这是和，还要除以 $${n}$。`],
            [Q.of(sum(xs), n - 1), `That divides by $${n - 1}$; there are $${n}$ values.`, `这是除以 $${n - 1}$，可是一共有 $${n}$ 个数。`],
          ];
          if (isTerminating(median(xs))) offs.push([median(xs), "That is the median, the middle value.", "这是中位数，即中间的数。"]);
          offs.push([m.add(Q.one), "That is one more than the mean.", "这比平均数多 $1$。"]);
          return valued(
            [`Find the mean of the data set $${list(xs)}$.`, `求数据 $${list(xs)}$ 的平均数。`],
            m,
            [
              [["Add", "求和"], [`Add the $${n}$ values:`, `把 $${n}$ 个数相加：`], [`${xs.join(" + ")} = ${sum(xs)}`]],
              [
                ["Divide", "相除"],
                [`Share the total among $${n}$ values:`, `把总和平均分成 $${n}$ 份：`],
                [`${sum(xs)} \\div ${n} = ${dec(m)}`],
              ],
            ],
            [`$${n} \\times ${dec(m)} = ${sum(xs)}$.`, `$${n} \\times ${dec(m)} = ${sum(xs)}$。`],
            offs,
            { form: "decimal" },
          );
        },
        dotPlotFigure([4, 9, 5, 6], unitAxis),
      ),
      lesson(
        "finding-a-missing-value",
        ["Finding a missing value", "求缺失的数据"],
        [
          [
            "If the mean of $n$ values is $m$, their sum is $n \\times m$. A missing value is that total minus the known values. Five scores have mean $8$ and four are $7, 9, 6, 10$: the total is $5 \\times 8 = 40$, the four add to $32$, so the fifth is $40 - 32 = 8$.",
            "如果 $n$ 个数的平均数是 $m$，它们的和就是 $n \\times m$。缺失的数等于这个总和减去已知的数。五个分数的平均数是 $8$，其中四个是 $7, 9, 6, 10$：总和是 $5 \\times 8 = 40$，四个数之和是 $32$，所以第五个是 $40 - 32 = 8$。",
          ],
          ["$7 + 9 + 6 + 10 + 8 = 40$, and $40 \\div 5 = 8$.", "$7 + 9 + 6 + 10 + 8 = 40$，$40 \\div 5 = 8$。"],
          ["Multiply the mean by all $n$ values, including the missing one.", "平均数要乘全部 $n$ 个数的个数，包括缺失的那个。"],
        ],
        (rng) => {
          for (;;) {
            const n = rng.int(4, 7);
            const m = rng.int(5, 30);
            const known = data(rng, n - 1, Math.max(1, m - 10), m + 10);
            const x = n * m - sum(known);
            if (x < 1 || x > 60) continue;
            return valued(
              [
                `The mean of $${n}$ numbers is $${m}$, and $${n - 1}$ of them are $${list(known)}$. What is the missing number?`,
                `$${n}$ 个数的平均数是 $${m}$，其中 $${n - 1}$ 个是 $${list(known)}$。缺失的数是多少？`,
              ],
              x,
              [
                [
                  ["Find the total", "求总和"],
                  [`$${n}$ numbers with mean $${m}$:`, `$${n}$ 个数，平均数是 $${m}$：`],
                  [`${n} \\times ${m} = ${n * m}`],
                ],
                [
                  ["Subtract the known", "减去已知的数"],
                  [`The known numbers add to $${sum(known)}$:`, `已知的数之和是 $${sum(known)}$：`],
                  [`${n * m} - ${sum(known)} = ${x}`],
                ],
              ],
              [
                `$(${sum(known)} + ${x}) \\div ${n} = ${n * m} \\div ${n} = ${m}$.`,
                `$(${sum(known)} + ${x}) \\div ${n} = ${n * m} \\div ${n} = ${m}$。`,
              ],
              [
                [
                  (n - 1) * m - sum(known),
                  `That uses $${n - 1}$ numbers for the total; there are $${n}$.`,
                  `这是用 $${n - 1}$ 个数求总和，其实有 $${n}$ 个。`,
                ],
                [m, "That is the mean, not the missing number.", "这是平均数，不是缺失的数。"],
                [n * m, "That is the total of all the numbers.", "这是所有数的总和。"],
              ],
            );
          }
        },
        tapeFigure(
          [
            {
              total: "40",
              pieces: [
                { size: 7, text: "7" },
                { size: 9, text: "9" },
                { size: 6, text: "6" },
                { size: 10, text: "10" },
                { size: 8, text: "8", lit: true, dashed: true },
              ],
            },
          ],
          [
            "Five scores with mean 8 make 40; the four known add to 32, so the missing one is 8.",
            "平均数是 8 的五个分数共 40；已知的四个共 32，所以缺失的是 8。",
          ],
        ),
      ),
    ],
  },
  [
    "Four friends have $4$, $9$, $5$ and $6$ stickers. If they pooled them and shared them out equally, how many would each get?",
    "四个朋友分别有 $4$、$9$、$5$、$6$ 张贴纸。如果把贴纸合在一起再平均分，每人能得到几张？",
  ],
  ["They have $24$ in all, and $24 \\div 4 = 6$ each.", "一共有 $24$ 张，$24 \\div 4 = 6$，每人 $6$ 张。"],
  ["find the mean of a data set, and use the mean to find a missing value.", "求一组数据的平均数，并用平均数求缺失的数据。"],
);

export const medianAndMode: TopicDef = withIntro(
  {
    id: "median-and-mode",
    title: t("The Median and the Mode", "中位数与众数"),
    summary: t("Find the middle value and the most frequent value of a data set.", "求一组数据的中间值和出现次数最多的值。"),
    prerequisites: ["decimal-arithmetic"],
    encompasses: [],
    xp: 10,
    standards: ["CCSS.6.SP.B.5.C"],
    knowledgePoints: [
      lesson(
        "finding-the-median",
        ["The median", "中位数"],
        [
          [
            "The **median** is the middle value once the data are **sorted**. With an odd number of values it is the one in the middle; with an even number it is the mean of the two middle values. $9, 2, 7, 4, 5$ sorted is $2, 4, 5, 7, 9$, so the median is $5$.",
            "**中位数**是把数据**排序**后位于中间的值。数据个数为奇数时取正中间的数；为偶数时取中间两个数的平均数。$9, 2, 7, 4, 5$ 排序后是 $2, 4, 5, 7, 9$，所以中位数是 $5$。",
          ],
          [
            "Two values, $2$ and $4$, are below $5$ and two, $7$ and $9$, are above it.",
            "比 $5$ 小的有 $2$ 和 $4$ 两个，比 $5$ 大的有 $7$ 和 $9$ 两个。",
          ],
          [
            "Sort first. The middle of the unsorted list $9, 2, 7, 4, 5$ is $7$, which is not the median.",
            "先排序。没排序时 $9, 2, 7, 4, 5$ 中间的是 $7$，它不是中位数。",
          ],
        ],
        (rng) => {
          const n = rng.int(5, 10);
          const xs = data(rng, n, 1, 60);
          const s = sorted(xs);
          const m = median(xs);
          const h = Math.floor(n / 2);
          const odd = n % 2 === 1;
          const offs: Off[] = [[xs[h] as number, "That is the middle of the list before sorting.", "这是排序前列表中间的数。"]];
          if (!odd) {
            offs.push([
              s[h] as number,
              "That is only the second of the two middle values; take their mean.",
              "这只是中间两个数中的后一个，要取它们的平均数。",
            ]);
            offs.push([
              s[h - 1] as number,
              "That is only the first of the two middle values; take their mean.",
              "这只是中间两个数中的前一个，要取它们的平均数。",
            ]);
          } else {
            offs.push([s[h + 1] as number, "That is one place past the middle.", "这比中间多数了一个。"]);
          }
          if (isTerminating(mean(xs))) offs.push([mean(xs), "That is the mean, not the middle value.", "这是平均数，不是中间的数。"]);
          return valued(
            [`Find the median of the data set $${list(xs)}$.`, `求数据 $${list(xs)}$ 的中位数。`],
            m,
            [
              [["Sort", "排序"], ["From smallest to largest:", "从小到大排列："], [list(s)]],
              [
                ["Find the middle", "找中间"],
                odd
                  ? [`There are $${n}$ values, so take number $${h + 1}$:`, `共 $${n}$ 个数，取第 $${h + 1}$ 个：`]
                  : [
                      `There are $${n}$ values, so take the mean of numbers $${h}$ and $${h + 1}$:`,
                      `共 $${n}$ 个数，取第 $${h}$ 个和第 $${h + 1}$ 个的平均数：`,
                    ],
                [odd ? `${dec(m)}` : `\\frac{${s[h - 1]} + ${s[h]}}{2} = ${dec(m)}`],
              ],
            ],
            odd
              ? [
                  `$${h}$ values lie before it and $${h}$ after it in the sorted list.`,
                  `排序后它前面有 $${h}$ 个数，后面也有 $${h}$ 个数。`,
                ]
              : [
                  `$${h}$ values lie at or below $${s[h - 1]}$ and $${h}$ at or above $${s[h]}$, and $${dec(m)}$ is halfway between them.`,
                  `$${s[h - 1]}$ 及之前有 $${h}$ 个数，$${s[h]}$ 及之后也有 $${h}$ 个数，而 $${dec(m)}$ 正在两者中间。`,
                ],
            offs,
            { form: "decimal" },
          );
        },
        dotPlotFigure([2, 4, 5, 7, 9], unitAxis),
      ),
      lesson(
        "finding-the-mode",
        ["The mode", "众数"],
        [
          [
            "The **mode** is the value that occurs most often. In $3, 7, 7, 2, 9, 7, 3$ the value $7$ occurs three times, more than any other, so the mode is $7$. Sorting the data or tallying each value makes the mode easy to see.",
            "**众数**是出现次数最多的值。在 $3, 7, 7, 2, 9, 7, 3$ 中，$7$ 出现了三次，比其他值都多，所以众数是 $7$。把数据排序或逐个计数，众数就一目了然。",
          ],
          ["Tally: $2$ once, $3$ twice, $7$ three times, $9$ once.", "计数：$2$ 一次，$3$ 两次，$7$ 三次，$9$ 一次。"],
          [
            "The mode is the value, not how many times it occurs. Here the mode is $7$, not $3$.",
            "众数是那个值，不是它出现的次数。这里众数是 $7$，不是 $3$。",
          ],
        ],
        (rng) => {
          const [mode, twice, ...singles] = rng.sample(
            Array.from({ length: 30 }, (_, i) => i + 1),
            rng.int(4, 6),
          ) as [number, number, ...number[]];
          const xs = rng.shuffle([mode, mode, mode, twice, twice, ...singles]);
          return valued(
            [`Find the mode of the data set $${list(xs)}$.`, `求数据 $${list(xs)}$ 的众数。`],
            mode,
            [
              [["Sort", "排序"], ["Equal values sit together:", "相同的值排在一起："], [list(sorted(xs))]],
              [
                ["Count", "计数"],
                [
                  `$${mode}$ occurs $3$ times and $${twice}$ twice; the rest once:`,
                  `$${mode}$ 出现 $3$ 次，$${twice}$ 出现 $2$ 次，其余各 $1$ 次：`,
                ],
                [`\\text{mode} = ${mode}`],
              ],
            ],
            [
              `Taking away the three copies of $${mode}$ leaves $${xs.length - 3}$ values, none of which occurs three times.`,
              `去掉三个 $${mode}$ 后剩下 $${xs.length - 3}$ 个数，没有一个出现三次。`,
            ],
            [
              [twice, "That value occurs only twice.", "这个值只出现了两次。"],
              [Math.max(...xs), "That is the largest value, not the most frequent.", "这是最大的值，不是出现最多的。"],
              [3, "That is how many times the mode occurs, not the mode.", "这是众数出现的次数，不是众数。"],
            ],
          );
        },
        dotPlotFigure([3, 7, 7, 2, 9, 7, 3], unitAxis),
      ),
    ],
  },
  [
    "Seven players scored $2, 3, 3, 5, 6, 6, 6$ points. Which score is in the middle, and which comes up most?",
    "七名球员分别得了 $2, 3, 3, 5, 6, 6, 6$ 分。哪个分数在中间？哪个分数出现得最多？",
  ],
  [
    "The middle of the seven sorted scores is the fourth, $5$; the score $6$ comes up three times.",
    "七个排好序的分数中，中间的是第四个 $5$；$6$ 出现了三次。",
  ],
  ["find the median, the middle value, and the mode, the most frequent value.", "求中位数（中间的值）和众数（出现次数最多的值）。"],
);

export const rangeAndInterquartileRange: TopicDef = withIntro(
  {
    id: "range-and-interquartile-range",
    title: t("Range, Quartiles and Interquartile Range", "极差、四分位数与四分位距"),
    summary: t("Measure the spread of a data set with its range and its interquartile range.", "用极差和四分位距衡量数据的离散程度。"),
    prerequisites: ["median-and-mode"],
    encompasses: [{ topic: "median-and-mode", weight: 0.4 }],
    xp: 10,
    standards: ["CCSS.6.SP.B.5.C"],
    knowledgePoints: [
      lesson(
        "range",
        ["The range", "极差"],
        [
          [
            "The **range** is the largest value minus the smallest; it measures how spread out the data are. For $12, 5, 20, 9$ the range is $20 - 5 = 15$.",
            "**极差**是最大值减最小值，用来衡量数据的分散程度。对 $12, 5, 20, 9$，极差是 $20 - 5 = 15$。",
          ],
          ["$5 + 15 = 20$: from the smallest, the range reaches the largest.", "$5 + 15 = 20$：从最小值加上极差就到最大值。"],
          [
            "Use the largest and smallest, not the first and last in the list. $9 - 12$ is not the range.",
            "要用最大值和最小值，不是列表里的第一个和最后一个。$9 - 12$ 不是极差。",
          ],
        ],
        (rng) => {
          const xs = data(rng, rng.int(5, 9), 1, 99);
          const [lo, hi] = [Math.min(...xs), Math.max(...xs)];
          return valued(
            [`Find the range of the data set $${list(xs)}$.`, `求数据 $${list(xs)}$ 的极差。`],
            hi - lo,
            [
              [
                ["Find the extremes", "找最大值和最小值"],
                ["Scan the list:", "看一遍数据："],
                [`\\text{largest} = ${hi}, \\ \\text{smallest} = ${lo}`],
              ],
              [["Subtract", "相减"], ["Largest minus smallest:", "最大值减最小值："], [`${hi} - ${lo} = ${hi - lo}`]],
            ],
            [`$${lo} + ${hi - lo} = ${hi}$.`, `$${lo} + ${hi - lo} = ${hi}$。`],
            [
              [hi, "That is the largest value alone.", "这只是最大值。"],
              [
                Math.abs((xs[xs.length - 1] as number) - (xs[0] as number)),
                "That uses the first and last values in the list.",
                "这用的是列表中的第一个和最后一个数。",
              ],
              [hi + lo, "That adds the largest and smallest.", "这是把最大值和最小值相加。"],
            ],
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 25,
            step: 5,
            labels: [0, 25],
            marks: [{ at: 5, text: "5" }, { at: 9 }, { at: 12 }, { at: 20, text: "20" }],
            jumps: [[5, 20]],
          },
          ["The values 12, 5, 20 and 9 span from 5 to 20, a range of 15.", "12、5、20、9 这几个数从 5 到 20，极差是 15。"],
        ),
      ),
      lesson(
        "quartiles-and-iqr",
        ["Quartiles and the interquartile range", "四分位数与四分位距"],
        [
          [
            "The median splits the sorted data into a lower and an upper half; with an odd count, the median itself is in neither. The **first quartile** $Q_1$ is the median of the lower half and the **third quartile** $Q_3$ the median of the upper half. The **interquartile range** is $Q_3 - Q_1$. For $1, 3, 4, 6, 8, 9, 12$: $Q_1 = 3$, $Q_3 = 9$, $\\text{IQR} = 6$.",
            "中位数把排好序的数据分成下半部分和上半部分；个数为奇数时，中位数本身不属于任何一半。**第一四分位数** $Q_1$ 是下半部分的中位数，**第三四分位数** $Q_3$ 是上半部分的中位数。**四分位距**是 $Q_3 - Q_1$。对 $1, 3, 4, 6, 8, 9, 12$：$Q_1 = 3$，$Q_3 = 9$，$\\text{IQR} = 6$。",
          ],
          [
            "$3 + 6 = 9$, and $3, 4, 6, 8, 9$ are the middle values, between $Q_1$ and $Q_3$.",
            "$3 + 6 = 9$；$3, 4, 6, 8, 9$ 是位于 $Q_1$ 和 $Q_3$ 之间的中间部分。",
          ],
          [
            "The IQR is the spread of the middle half, not of all the data. $12 - 1 = 11$ is the range.",
            "四分位距是中间一半数据的分散程度，不是全部数据的。$12 - 1 = 11$ 是极差。",
          ],
        ],
        (rng) => {
          const n = rng.int(7, 12);
          const xs = data(rng, n, 1, 60);
          const s = sorted(xs);
          const [q1, q3] = quartiles(xs);
          const iqr = q3.sub(q1);
          const h = Math.floor(n / 2);
          const [lower, upper] = [s.slice(0, h), s.slice(n - h)];
          return valued(
            [`Find the interquartile range of the data set $${list(xs)}$.`, `求数据 $${list(xs)}$ 的四分位距。`],
            iqr,
            [
              [
                ["Sort and halve", "排序并分半"],
                [
                  `Sorted, the lower half is $${list(lower)}$ and the upper half $${list(upper)}$:`,
                  `排序后，下半部分是 $${list(lower)}$，上半部分是 $${list(upper)}$：`,
                ],
                [list(s)],
              ],
              [
                ["Find the quartiles", "求四分位数"],
                ["The median of each half:", "每一半的中位数："],
                [`Q_1 = ${dec(q1)}, \\ Q_3 = ${dec(q3)}`],
              ],
              [["Subtract", "相减"], ["$Q_3 - Q_1$:", "$Q_3 - Q_1$："], [`${dec(q3)} - ${dec(q1)} = ${dec(iqr)}`]],
            ],
            [
              `$${dec(q1)} + ${dec(iqr)} = ${dec(q3)}$, the span of the middle half.`,
              `$${dec(q1)} + ${dec(iqr)} = ${dec(q3)}$，正是中间一半数据的跨度。`,
            ],
            [
              [(s[n - 1] as number) - (s[0] as number), "That is the range of all the data.", "这是全部数据的极差。"],
              [q3, "That is $Q_3$ alone.", "这只是 $Q_3$。"],
              [
                median(s.slice(Math.ceil(n / 2))).sub(median(s.slice(0, Math.ceil(n / 2)))),
                "That puts the median into both halves.",
                "这把中位数放进了两半。",
              ],
            ],
            { form: "decimal" },
          );
        },
        boxPlotFigure([1, 3, 6, 9, 12], { min: 0, max: 14, step: 1, labelEvery: 2 }),
      ),
    ],
  },
  [
    "Two classes both have a median score of $7$, but in one the scores run from $6$ to $8$ and in the other from $1$ to $10$.",
    "两个班的成绩中位数都是 $7$，但一个班的成绩在 $6$ 到 $8$ 之间，另一个班在 $1$ 到 $10$ 之间。",
  ],
  [
    "The ranges are $8 - 6 = 2$ and $10 - 1 = 9$, so the second class is much more spread out.",
    "极差分别是 $8 - 6 = 2$ 和 $10 - 1 = 9$，所以第二个班的成绩分散得多。",
  ],
  [
    "measure spread with the range, find the quartiles, and use the interquartile range.",
    "用极差衡量分散程度，求四分位数，并使用四分位距。",
  ],
);

export const meanAbsoluteDeviation: TopicDef = withIntro(
  {
    id: "mean-absolute-deviation",
    title: t("Mean Absolute Deviation", "平均绝对偏差"),
    summary: t("Measure spread as the average distance of the values from the mean.", "用各数据到平均数的平均距离来衡量离散程度。"),
    prerequisites: ["mean-of-a-data-set", "absolute-value"],
    encompasses: [{ topic: "mean-of-a-data-set", weight: 0.5 }],
    xp: 12,
    standards: ["CCSS.6.SP.B.5.C"],
    knowledgePoints: [
      lesson(
        "computing-the-mad",
        ["Computing the mean absolute deviation", "计算平均绝对偏差"],
        [
          [
            "The **mean absolute deviation** (MAD) is the mean distance of the values from the mean. Find the mean, find each value's distance from it, then take the mean of those distances. For $2, 4, 6, 8$: the mean is $5$, the distances are $3, 1, 1, 3$, and the MAD is $8 \\div 4 = 2$.",
            "**平均绝对偏差**（MAD）是各数据到平均数距离的平均值。先求平均数，再求每个数到它的距离，最后求这些距离的平均数。对 $2, 4, 6, 8$：平均数是 $5$，距离是 $3, 1, 1, 3$，MAD 是 $8 \\div 4 = 2$。",
          ],
          [
            "The distances above the mean, $1 + 3 = 4$, equal those below, $3 + 1 = 4$, as they always do.",
            "平均数以上的距离 $1 + 3 = 4$ 等于以下的距离 $3 + 1 = 4$，总是如此。",
          ],
          [
            "Distances are never negative. Without absolute values the deviations would add to $0$.",
            "距离不会是负数。如果不取绝对值，偏差加起来总是 $0$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const n = rng.pick([4, 5, 8]);
            const m = rng.int(5, 30);
            const xs = data(rng, n, Math.max(0, m - 9), m + 9);
            if (sum(xs) !== n * m) continue;
            const d = xs.map((x) => Math.abs(x - m));
            if (sum(d) === 0) continue;
            const mad = Q.of(sum(d), n);
            const [above, below] = balance(xs, [], m);
            return valued(
              [`Find the mean absolute deviation of the data set $${list(xs)}$.`, `求数据 $${list(xs)}$ 的平均绝对偏差。`],
              mad,
              [
                [["Find the mean", "求平均数"], [`Add and divide by $${n}$:`, `求和再除以 $${n}$：`], [`${sum(xs)} \\div ${n} = ${m}`]],
                [["Find the distances", "求距离"], [`Each value's distance from $${m}$:`, `每个数到 $${m}$ 的距离：`], [list(d)]],
                [["Average them", "求平均"], ["Mean of the distances:", "距离的平均数："], [`${sum(d)} \\div ${n} = ${dec(mad)}`]],
              ],
              [
                `The distances above the mean add to $${above}$ and those below to $${below}$, equal as they must be, and $${above} + ${below} = ${sum(d)}$.`,
                `平均数以上的距离之和是 $${above}$，以下的是 $${below}$，两者相等，而 $${above} + ${below} = ${sum(d)}$。`,
              ],
              [
                [sum(d), `That is the total distance. Divide it by $${n}$.`, `这是距离之和，还要除以 $${n}$。`],
                [m, "That is the mean, not the mean distance from it.", "这是平均数，不是到平均数的平均距离。"],
                [Q.of(Math.max(...xs) - Math.min(...xs), 2), "That is half the range.", "这是极差的一半。"],
              ],
              { form: "decimal" },
            );
          }
        },
        lineFigure(
          {
            lo: 0,
            hi: 10,
            step: 1,
            labels: [0, 5, 10],
            marks: [{ at: 2 }, { at: 4 }, { at: 6 }, { at: 8 }, { at: 5, text: "5", result: true }],
            jumps: [
              [5, 2],
              [5, 4],
              [5, 6],
              [5, 8],
            ],
          },
          [
            "The values 2, 4, 6 and 8 lie 3, 1, 1 and 3 from their mean 5, so the MAD is 2.",
            "2、4、6、8 到平均数 5 的距离是 3、1、1、3，所以 MAD 是 2。",
          ],
        ),
      ),
      lesson(
        "the-mad-from-a-frequency-table",
        ["The MAD from a frequency table", "由频数表求平均绝对偏差"],
        [
          [
            "In a frequency table each value counts as many times as its frequency, in the mean and in the distances. With values $1, 3, 5$ and frequencies $2, 1, 1$: $N = 4$, the mean is $(2 + 3 + 5) \\div 4 = 2.5$, and the MAD is $(2 \\times 1.5 + 0.5 + 2.5) \\div 4 = 1.5$.",
            "在频数表中，每个数值按它的频数重复计入，求平均数和距离时都是这样。数值 $1, 3, 5$ 的频数是 $2, 1, 1$：$N = 4$，平均数是 $(2 + 3 + 5) \\div 4 = 2.5$，MAD 是 $(2 \\times 1.5 + 0.5 + 2.5) \\div 4 = 1.5$。",
          ],
          [
            "Above the mean: $0.5 + 2.5 = 3$; below: $2 \\times 1.5 = 3$. They balance.",
            "平均数以上：$0.5 + 2.5 = 3$；以下：$2 \\times 1.5 = 3$。两边相等。",
          ],
          [
            "Divide by the number of data values $N$, not by the number of different values.",
            "要除以数据的总个数 $N$，不是除以不同数值的个数。",
          ],
        ],
        (rng) => {
          for (;;) {
            const k = rng.pick([3, 4]);
            const start = rng.int(0, 20);
            const xs: number[] = [];
            for (let i = 0, x = start; i < k; i++) {
              xs.push(x);
              x += rng.int(1, 4);
            }
            const fs = xs.map(() => rng.int(1, 6));
            const n = sum(fs);
            const total = sum(xs.map((x, i) => x * (fs[i] ?? 0)));
            if (total % n !== 0) continue;
            const m = total / n;
            const d = xs.map((x) => Math.abs(x - m));
            const fd = d.map((v, i) => v * (fs[i] ?? 0));
            const mad = Q.of(sum(fd), n);
            if (mad.isZero() || !isTerminating(mad)) continue;
            const [above, below] = balance(xs, fs, m);
            const table = `$$\\begin{array}{c|${"c".repeat(k)}} x & ${xs.join(" & ")} \\\\ \\hline f & ${fs.join(" & ")} \\end{array}$$`;
            const products = d.map((v, i) => `${fs[i]} \\times ${v}`).join(" + ");
            return valued(
              [
                `The frequency table shows how often each value $x$ occurs in a data set. Find the mean absolute deviation.${table}`,
                `频数表给出了数据中每个数值 $x$ 出现的次数 $f$。求平均绝对偏差。${table}`,
              ],
              mad,
              [
                [
                  ["Find the mean", "求平均数"],
                  [`There are $N = ${n}$ values:`, `共有 $N = ${n}$ 个数据：`],
                  [`${total} \\div ${n} = ${m}`],
                ],
                [
                  ["Weight the distances", "按频数计算距离"],
                  [`The distances are $${list(d)}$; count each by its frequency:`, `各数值的距离是 $${list(d)}$，按频数计入：`],
                  [`${products} = ${sum(fd)}`],
                ],
                [["Divide by N", "除以 N"], ["Mean distance:", "平均距离："], [`${sum(fd)} \\div ${n} = ${dec(mad)}`]],
              ],
              [
                `The weighted distances above the mean add to $${above}$ and those below to $${below}$, which balance, and $${above} + ${below} = ${sum(fd)}$.`,
                `平均数以上按频数计的距离之和是 $${above}$，以下的是 $${below}$，两边相等，而 $${above} + ${below} = ${sum(fd)}$。`,
              ],
              [
                [
                  Q.of(sum(d), k),
                  "That ignores the frequencies and divides by the number of different values.",
                  "这忽略了频数，还除以了不同数值的个数。",
                ],
                [Q.of(sum(fd), k), "That divides by the number of different values, not by $N$.", "这是除以不同数值的个数，不是除以 $N$。"],
                [Q.of(sum(d), n), "That leaves out the frequencies in the distances.", "这在求距离时漏掉了频数。"],
                [sum(fd), "That is the total distance. Divide it by $N$.", "这是距离之和，还要除以 $N$。"],
              ],
              { form: "decimal" },
            );
          }
        },
        tableFigure(["1", "3", "5"], [2, 1, 1]),
      ),
    ],
  },
  [
    "Two archers both average $5$ points. One always scores $4$, $5$ or $6$; the other's scores jump between $1$ and $9$.",
    "两名射箭手的平均分都是 $5$。一个总是得 $4$、$5$ 或 $6$ 分，另一个的分数在 $1$ 到 $9$ 之间跳来跳去。",
  ],
  [
    "The first archer's scores sit about $1$ from the mean, the second's about $4$, so the second is less steady.",
    "第一个人的分数离平均数大约 $1$ 分，第二个人大约 $4$ 分，所以第二个人不够稳定。",
  ],
  [
    "measure spread by the mean distance from the mean, from a list and from a frequency table.",
    "用到平均数的平均距离衡量分散程度，数据可以是列表，也可以是频数表。",
  ],
);

/** valueBars draws two data sets as bars, each value a piece as long as the value, set A above set B. */
function valueBars(a: readonly number[], b: readonly number[]): Figure {
  const bar = (xs: readonly number[], lit: boolean) => ({ pieces: xs.map((v) => ({ size: v, text: `${v}`, lit })) });
  return tapeFigure(
    [bar(a, true), bar(b, false)],
    [
      `Two bars, each value a piece as long as the value: set A (${list(a)}) above, set B (${list(b)}) below.`,
      `两个长条，每个数值是一段，长度等于这个数值：上面是 A（${list(a)}），下面是 B（${list(b)}）。`,
    ],
  );
}

/** sortedBars draws two data sets in order as bars of equal pieces, set A above set B. */
function sortedBars(a: readonly number[], b: readonly number[]): Figure {
  const bar = (xs: readonly number[], lit: boolean) => ({ pieces: sorted(xs).map((v) => ({ size: 1, text: `${v}`, lit })) });
  return tapeFigure(
    [bar(a, true), bar(b, false)],
    [
      `Two bars of equal pieces holding the values in order: set A (${list(sorted(a))}) above, set B (${list(sorted(b))}) below.`,
      `两个由相等小段组成的长条，按从小到大写着数值：上面是 A（${list(sorted(a))}），下面是 B（${list(sorted(b))}）。`,
    ],
  );
}

/** twoGroupsTape draws two groups as bars as long as their sizes, each labeled with its mean. */
function twoGroupsTape(a: number, meanA: number, b: number, meanB: number): Figure {
  return tapeFigure(
    [
      { total: `${a}`, pieces: [{ size: a, text: `${meanA}`, lit: true }] },
      { total: `${b}`, pieces: [{ size: b, text: `${meanB}` }] },
    ],
    [
      `Two bars as long as the groups, ${a} and ${b} members, labeled with their means ${meanA} and ${meanB}.`,
      `两个长条，长度分别是两组的人数 ${a} 和 ${b}，标着各自的平均数 ${meanA} 和 ${meanB}。`,
    ],
  );
}

/** theMeanOfTwoGroupsTogether combines the means of two groups of different sizes into the mean of everyone, the third knowledge point of comparing data sets. */
export const theMeanOfTwoGroupsTogether = lesson(
  "the-mean-of-two-groups-together",
  ["The mean of two groups together", "两组合起来的平均数"],
  [
    [
      "A group of $4$ students averages $90$ points and a group of $6$ averages $80$. Each group’s total is its mean times its size: $4 \\times 90 = 360$ and $6 \\times 80 = 480$. Together, $\\frac{360 + 480}{10} = 84$.",
      "一组 $4$ 名学生平均 $90$ 分，另一组 $6$ 名平均 $80$ 分。每组的总分是平均数乘人数：$4 \\times 90 = 360$，$6 \\times 80 = 480$。合起来是 $\\frac{360 + 480}{10} = 84$。",
    ],
    [
      "The mean of everyone balances the distances: the $4$ students are $6$ above $84$ and the $6$ students are $4$ below, and $4 \\times 6 = 6 \\times 4$.",
      "全体的平均数使距离平衡：$4$ 名学生比 $84$ 高 $6$，$6$ 名学生比 $84$ 低 $4$，而 $4 \\times 6 = 6 \\times 4$。",
    ],
    [
      "Averaging the two means, $\\frac{90 + 80}{2} = 85$, is right only when the groups are the same size.",
      "直接平均两个平均数，$\\frac{90 + 80}{2} = 85$，只有两组人数相同时才对。",
    ],
  ],
  (rng) => {
    const n1 = rng.int(2, 12);
    const n2 = n1 + rng.int(1, 12);
    const combined = rng.int(50, 90);
    // The smaller group's mean stays at 20 or more.
    const d = rng.int(1, Math.min(6, Math.floor((combined - 20) / n1)));
    const m1 = combined + d * n2;
    const m2 = combined - d * n1;
    const total = n1 * m1 + n2 * m2;
    const [what, whatZh] = rng.pick([
      ["minutes of reading a week", "每周阅读分钟数"],
      ["minutes of exercise a week", "每周锻炼分钟数"],
      ["pages read in a month", "每月阅读页数"],
    ] as const);
    const offs: Off[] = [
      [
        Q.of(m1 + m2, 2),
        "That averages the two means as if the groups were the same size.",
        "这是把两个平均数直接平均，好像两组人数相同。",
      ],
      [total, "That is the total of everyone, not yet divided by the number of members.", "这是全体的总和，还没有除以总人数。"],
      [Q.of(total, 2), "That divides by the $2$ groups instead of by the members.", "这是除以组数 $2$，而不是总人数。"],
      [m1 + m2, "That adds the two means.", "这是把两个平均数相加。"],
    ];
    return valued(
      [
        `A group of $${n1}$ students averages $${m1}$ ${what}, and a group of $${n2}$ students averages $${m2}$. What is the mean for all $${n1 + n2}$ students together?`,
        `一组 $${n1}$ 名学生的${whatZh}平均是 $${m1}$，另一组 $${n2}$ 名学生平均是 $${m2}$。全部 $${n1 + n2}$ 名学生合起来的平均数是多少？`,
      ],
      combined,
      [
        [
          ["Find each total", "求各组的总和"],
          ["A mean times its group’s size is the group’s total:", "平均数乘人数就是这组的总和："],
          [`${n1} \\times ${m1} = ${n1 * m1}`, `${n2} \\times ${m2} = ${n2 * m2}`],
        ],
        [
          ["Divide by everyone", "除以总人数"],
          [`There are $${n1} + ${n2} = ${n1 + n2}$ students:`, `一共 $${n1} + ${n2} = ${n1 + n2}$ 名学生：`],
          [`\\frac{${n1 * m1} + ${n2 * m2}}{${n1 + n2}} = \\frac{${total}}{${n1 + n2}} = ${combined}`],
        ],
      ],
      [
        `The distances balance: the $${n1}$ students are $${m1 - combined}$ above $${combined}$ and the $${n2}$ students are $${combined - m2}$ below, and $${n1} \\times ${m1 - combined} = ${n2} \\times ${combined - m2} = ${n1 * (m1 - combined)}$.`,
        `距离平衡：$${n1}$ 名学生比 $${combined}$ 高 $${m1 - combined}$，$${n2}$ 名学生比它低 $${combined - m2}$，而 $${n1} \\times ${m1 - combined} = ${n2} \\times ${combined - m2} = ${n1 * (m1 - combined)}$。`,
      ],
      offs,
      { figure: twoGroupsTape(n1, m1, n2, m2) },
    );
  },
  twoGroupsTape(4, 90, 6, 80),
);

/** comparingDataSets compares two data sets by a measure of center and by the interquartile range. */
export const comparingDataSets: TopicDef = withIntro(
  {
    id: "comparing-data-sets",
    title: t("Comparing Data Sets", "比较数据集"),
    summary: t("Compare two data sets by their centers and by their spreads.", "通过集中趋势和离散程度比较两组数据。"),
    prerequisites: ["mean-absolute-deviation", "range-and-interquartile-range"],
    encompasses: [{ topic: "mean-of-a-data-set", weight: 0.6 }],
    xp: 12,
    standards: ["CCSS.7.SP.B.3", "CCSS.7.SP.B.4"],
    knowledgePoints: [
      lesson(
        "comparing-centers",
        ["Comparing centers", "比较集中趋势"],
        [
          [
            "The mean and the median describe where a data set is centered. To compare two data sets, compute the same measure for both and subtract. The heights (cm) of two seedling trays are A: $12, 15, 9, 14$ and B: $8, 10, 7, 11$. Their means are $\\frac{50}{4} = 12.5$ and $\\frac{36}{4} = 9$, so tray A is $3.5$ cm taller on average.",
            "平均数和中位数描述一组数据的中心位置。比较两组数据时，对两组计算同一个量再相减。两盘幼苗的高度（厘米）为 A：$12, 15, 9, 14$，B：$8, 10, 7, 11$。平均数分别是 $\\frac{50}{4} = 12.5$ 和 $\\frac{36}{4} = 9$，所以 A 盘平均高 $3.5$ 厘米。",
          ],
          [
            "Both trays have $4$ seedlings, so compare the totals: $50 - 36 = 14$ cm, shared by $4$ seedlings, is $\\frac{14}{4} = 3.5$ cm.",
            "两盘都有 $4$ 棵，所以可以比较总和：$50 - 36 = 14$ 厘米，分给 $4$ 棵就是 $\\frac{14}{4} = 3.5$ 厘米。",
          ],
          [
            "Compare like with like: the mean of one set against the mean of the other, never a mean against a median.",
            "要用同一种量比较：一组的平均数对另一组的平均数，不能用平均数对中位数。",
          ],
        ],
        (rng) => {
          const n = rng.pick([4, 5]);
          const useMedian = rng.bool(0.4);
          for (;;) {
            const a = data(rng, n, 10, 50);
            const b = data(rng, n, 5, 45);
            const [ca, cb] = useMedian ? [median(a), median(b)] : [mean(a), mean(b)];
            const diff = ca.sub(cb);
            if (diff.sign() <= 0) continue;
            const [m, mZh] = useMedian ? ["median", "中位数"] : ["mean", "平均数"];
            const h = Math.floor(n / 2);
            // The middle of the data as listed, without sorting.
            const unsorted = (xs: readonly number[]) => (n % 2 === 1 ? Q.of(xs[h]!) : Q.of(xs[h - 1]! + xs[h]!, 2));
            const offs: Off[] = useMedian
              ? [
                  [unsorted(a).sub(unsorted(b)), "That takes the middle values before sorting the data.", "这是没有排序就取了中间的数。"],
                  [ca, "That is the median of A alone.", "这只是 A 的中位数。"],
                  [mean(a).sub(mean(b)), "That compares the means, not the medians.", "这比较的是平均数，而不是中位数。"],
                ]
              : [
                  [
                    sum(a) - sum(b),
                    `That subtracts the totals without dividing by the $${n}$ values.`,
                    `这是总和相减，没有除以数据个数 $${n}$。`,
                  ],
                  [ca, "That is the mean of A alone.", "这只是 A 的平均数。"],
                  [median(a).sub(median(b)), "That compares the medians, not the means.", "这比较的是中位数，而不是平均数。"],
                ];
            return valued(
              [
                `Data set A is $${list(a)}$ and data set B is $${list(b)}$. How much greater is the ${m} of A than the ${m} of B?`,
                `数据集 A 为 $${list(a)}$，数据集 B 为 $${list(b)}$。A 的${mZh}比 B 的${mZh}大多少？`,
              ],
              diff,
              [
                useMedian
                  ? [
                      ["Find each median", "分别求中位数"],
                      [
                        `Sorted, A is $${list(sorted(a))}$ and B is $${list(sorted(b))}$; the middle gives medians $${dec(ca)}$ and $${dec(cb)}$.`,
                        `排序后，A 为 $${list(sorted(a))}$，B 为 $${list(sorted(b))}$；取中间得中位数 $${dec(ca)}$ 和 $${dec(cb)}$。`,
                      ],
                    ]
                  : [
                      ["Find each mean", "分别求平均数"],
                      ["Add the values and divide by their number:", "把数值相加，再除以个数："],
                      [`\\frac{${sum(a)}}{${n}} = ${dec(ca)}`, `\\frac{${sum(b)}}{${n}} = ${dec(cb)}`],
                    ],
                [
                  ["Subtract", "相减"],
                  [`The ${m} of A minus the ${m} of B:`, `A 的${mZh}减 B 的${mZh}：`],
                  [`${dec(ca)} - ${dec(cb)} = ${dec(diff)}`],
                ],
              ],
              useMedian
                ? [
                    `Add the difference to B’s median: $${dec(cb)} + ${dec(diff)} = ${dec(ca)}$, and in A’s sorted list ${n % 2 === 1 ? `the middle value is $${dec(ca)}$` : `the two middle values $${sorted(a)[h - 1]}$ and $${sorted(a)[h]}$ average $${dec(ca)}$`}.`,
                    `把差加到 B 的中位数上：$${dec(cb)} + ${dec(diff)} = ${dec(ca)}$，而 A 排序后${n % 2 === 1 ? `中间的数正是 $${dec(ca)}$` : `中间两个数 $${sorted(a)[h - 1]}$ 和 $${sorted(a)[h]}$ 的平均数正是 $${dec(ca)}$`}。`,
                  ]
                : [
                    `Both sets have $${n}$ values, so compare the totals: $${sum(a)} - ${sum(b)} = ${sum(a) - sum(b)}$, and $\\frac{${sum(a) - sum(b)}}{${n}} = ${dec(diff)}$.`,
                    `两组都有 $${n}$ 个数，所以可以比较总和：$${sum(a)} - ${sum(b)} = ${sum(a) - sum(b)}$，$\\frac{${sum(a) - sum(b)}}{${n}} = ${dec(diff)}$。`,
                  ],
              offs,
              { form: "decimal", figure: valueBars(a, b) },
            );
          }
        },
        valueBars([12, 15, 9, 14], [8, 10, 7, 11]),
      ),
      lesson(
        "comparing-spreads",
        ["Comparing spreads", "比较离散程度"],
        [
          [
            "The range, the interquartile range and the mean absolute deviation describe how spread out a data set is; a larger value means the data vary more. For A: $2, 4, 5, 7, 9, 12, 15$ the quartiles are $4$ and $12$, so $\\text{IQR} = 8$. For B: $6, 7, 8, 9, 10, 11, 12$ they are $7$ and $11$, so $\\text{IQR} = 4$, and A is more spread out.",
            "极差、四分位距和平均绝对偏差描述一组数据的分散程度；数值越大，数据变化越大。A：$2, 4, 5, 7, 9, 12, 15$ 的四分位数是 $4$ 和 $12$，$\\text{IQR} = 8$。B：$6, 7, 8, 9, 10, 11, 12$ 的四分位数是 $7$ 和 $11$，$\\text{IQR} = 4$，所以 A 更分散。",
          ],
          [
            "In box plots, the IQR is the length of the box: A’s box from $4$ to $12$ is twice as long as B’s from $7$ to $11$.",
            "在箱线图中，四分位距就是箱子的长度：A 的箱子从 $4$ 到 $12$，是 B 从 $7$ 到 $11$ 的两倍长。",
          ],
          [
            "Sort the data before finding quartiles; the values in the order listed do not give them.",
            "找四分位数之前要先排序；按原来的顺序是找不出来的。",
          ],
        ],
        (rng) => {
          for (;;) {
            const n = rng.pick([7, 8, 9]);
            const a = data(rng, n, 1, 40);
            const b = data(rng, n, 1, 40);
            const [a1, a3] = quartiles(a);
            const [b1, b3] = quartiles(b);
            const [ia, ib] = [a3.sub(a1), b3.sub(b1)];
            const c = ia.cmp(ib);
            if (c === 0) continue;
            const options: [Pair, Pair, Pair] = [
              ["Data set A", "数据集 A"],
              ["Data set B", "数据集 B"],
              ["They have the same interquartile range", "两组的四分位距相同"],
            ];
            const [big, small] = c > 0 ? ["A", "B"] : ["B", "A"];
            const [ib1, ib2] = c > 0 ? [ia, ib] : [ib, ia];
            return chosen(
              rng,
              [
                `Data set A is $${list(a)}$ and data set B is $${list(b)}$. Which data set has the greater interquartile range?`,
                `数据集 A 为 $${list(a)}$，数据集 B 为 $${list(b)}$。哪组数据的四分位距更大？`,
              ],
              c > 0 ? options[0] : options[1],
              [
                [
                  c > 0 ? options[1] : options[0],
                  `Its interquartile range is $${dec(ib2)}$, smaller than ${big}’s $${dec(ib1)}$.`,
                  `它的四分位距是 $${dec(ib2)}$，比 ${big} 的 $${dec(ib1)}$ 小。`,
                ],
                [
                  options[2],
                  `The interquartile ranges are $${dec(ia)}$ and $${dec(ib)}$, not equal.`,
                  `两组的四分位距分别是 $${dec(ia)}$ 和 $${dec(ib)}$，并不相等。`,
                ],
              ],
              [
                [
                  ["A’s interquartile range", "A 的四分位距"],
                  [
                    `Sorted, A is $${list(sorted(a))}$, with quartiles $${dec(a1)}$ and $${dec(a3)}$:`,
                    `排序后，A 为 $${list(sorted(a))}$，四分位数是 $${dec(a1)}$ 和 $${dec(a3)}$：`,
                  ],
                  [`${dec(a3)} - ${dec(a1)} = ${dec(ia)}`],
                ],
                [
                  ["B’s interquartile range", "B 的四分位距"],
                  [
                    `Sorted, B is $${list(sorted(b))}$, with quartiles $${dec(b1)}$ and $${dec(b3)}$:`,
                    `排序后，B 为 $${list(sorted(b))}$，四分位数是 $${dec(b1)}$ 和 $${dec(b3)}$：`,
                  ],
                  [`${dec(b3)} - ${dec(b1)} = ${dec(ib)}`],
                ],
              ],
              [
                `In box plots, ${big}’s box would run $${dec(ib1)}$ units and ${small}’s only $${dec(ib2)}$, so the middle half of ${big} is more spread out.`,
                `在箱线图中，${big} 的箱子长 $${dec(ib1)}$，${small} 的只有 $${dec(ib2)}$，所以 ${big} 中间一半的数据更分散。`,
              ],
              sortedBars(a, b),
            );
          }
        },
        sortedBars([2, 4, 5, 7, 9, 12, 15], [6, 7, 8, 9, 10, 11, 12]),
      ),
    ],
  },
  [
    "Two seedling trays grow side by side. Tray A’s seedlings are $12, 15, 9, 14$ cm tall and tray B’s are $8, 10, 7, 11$ cm. Tray A’s mean, $12.5$ cm, is $3.5$ cm more than tray B’s $9$ cm.",
    "两盘幼苗并排生长。A 盘幼苗高 $12, 15, 9, 14$ 厘米，B 盘高 $8, 10, 7, 11$ 厘米。A 盘的平均数 $12.5$ 厘米比 B 盘的 $9$ 厘米多 $3.5$ 厘米。",
  ],
  [
    "The medians tell the same story: $\\frac{12 + 14}{2} = 13$ against $\\frac{8 + 10}{2} = 9$.",
    "中位数也说明同样的情况：$\\frac{12 + 14}{2} = 13$ 对 $\\frac{8 + 10}{2} = 9$。",
  ],
  [
    "compare two data sets by the same measure of center, and by their interquartile ranges.",
    "用同一种集中趋势量比较两组数据，并比较它们的四分位距。",
  ],
);

export const outliers: TopicDef = withIntro(
  {
    id: "outliers",
    title: t("Outliers", "离群值"),
    summary: t(
      "Identify outliers with the 1.5 × IQR rule, and see how they affect the mean and the median.",
      "用 1.5 倍四分位距法则识别离群值，并了解它们对平均数和中位数的影响。",
    ),
    prerequisites: ["range-and-interquartile-range", "mean-of-a-data-set"],
    encompasses: [
      { topic: "range-and-interquartile-range", weight: 0.5 },
      { topic: "mean-of-a-data-set", weight: 0.3 },
    ],
    xp: 12,
    standards: ["CCSS.HSS.ID.A.3"],
    knowledgePoints: [
      lesson(
        "identifying-outliers",
        ["The 1.5 × IQR rule", "1.5 倍四分位距法则"],
        [
          [
            "An **outlier** is a value far from the rest of the data. A common rule: a value is an outlier if it is more than $1.5 \\times \\text{IQR}$ below $Q_1$ or above $Q_3$, that is, outside the **fences** $Q_1 - 1.5 \\times \\text{IQR}$ and $Q_3 + 1.5 \\times \\text{IQR}$. For $2, 3, 4, 5, 6, 7, 20$: $Q_1 = 3$, $Q_3 = 7$, $\\text{IQR} = 4$, so the fences are $3 - 6 = -3$ and $7 + 6 = 13$, and $20$ is an outlier.",
            "**离群值**是远离其余数据的值。常用法则：比 $Q_1$ 小 $1.5 \\times \\text{IQR}$ 以上，或比 $Q_3$ 大 $1.5 \\times \\text{IQR}$ 以上的值是离群值，也就是落在**界限** $Q_1 - 1.5 \\times \\text{IQR}$ 和 $Q_3 + 1.5 \\times \\text{IQR}$ 之外。对 $2, 3, 4, 5, 6, 7, 20$：$Q_1 = 3$，$Q_3 = 7$，$\\text{IQR} = 4$，界限是 $3 - 6 = -3$ 和 $7 + 6 = 13$，所以 $20$ 是离群值。",
          ],
          [
            "$20$ is $20 - 7 = 13$ above $Q_3$, more than $1.5 \\times 4 = 6$.",
            "$20$ 比 $Q_3$ 大 $20 - 7 = 13$，超过了 $1.5 \\times 4 = 6$。",
          ],
          [
            "The largest or smallest value is not always an outlier. Here $2$ is the smallest, but it is inside the fences.",
            "最大值或最小值不一定是离群值。这里 $2$ 是最小值，但它在界限之内。",
          ],
        ],
        (rng) => {
          for (;;) {
            const base = data(rng, rng.int(7, 10), 20, 40);
            const high = rng.bool();
            const [q1, q3] = quartiles(base);
            if (q3.sub(q1).isZero()) continue;
            const extreme = high ? Math.max(...base) + rng.int(15, 40) : Math.min(...base) - rng.int(12, 19);
            const xs = rng.shuffle([...base, extreme]);
            const [r1, r3] = quartiles(xs);
            const ri = r3.sub(r1);
            const reach = ri.mul(Q.of(3, 2));
            const lowFence = r1.sub(reach);
            const highFence = r3.add(reach);
            const out = xs.filter((x) => isOutlier(xs, x));
            if (out.length !== 1 || out[0] !== extreme) continue;
            const s = sorted(xs);
            const inner = s.filter((x) => x !== extreme);
            const [lo, hi] = [inner[0] as number, inner[inner.length - 1] as number];
            const middle = [...new Set(inner.filter((x) => x !== lo && x !== hi))];
            if (lo === hi || middle.length === 0) continue;
            const mid = rng.pick(middle);
            const fences = `$${dec(lowFence)}$ and $${dec(highFence)}$`;
            const fencesZh = `$${dec(lowFence)}$ 和 $${dec(highFence)}$`;
            const gap = high ? Q.of(extreme).sub(r3) : r1.sub(Q.of(extreme));
            return chosen(
              rng,
              [
                `Which value of the data set $${list(xs)}$ is an outlier by the $1.5 \\times \\text{IQR}$ rule?`,
                `按 $1.5 \\times \\text{IQR}$ 法则，数据 $${list(xs)}$ 中哪个值是离群值？`,
              ],
              [`$${extreme}$`, `$${extreme}$`],
              [
                [
                  [`$${lo}$`, `$${lo}$`],
                  `It is the smallest of the other values, but it lies inside the fences ${fences}.`,
                  `它是其余数据中最小的，但它在界限 ${fencesZh} 之内。`,
                ],
                [
                  [`$${hi}$`, `$${hi}$`],
                  `It is the largest of the other values, but it lies inside the fences ${fences}.`,
                  `它是其余数据中最大的，但它在界限 ${fencesZh} 之内。`,
                ],
                [
                  [`$${mid}$`, `$${mid}$`],
                  `It lies between $Q_1$ and $Q_3$, well inside the fences.`,
                  `它在 $Q_1$ 和 $Q_3$ 之间，远在界限之内。`,
                ],
              ],
              [
                [
                  ["Find the quartiles", "求四分位数"],
                  [`Sorted: $${list(s)}$, so`, `排序后：$${list(s)}$，所以`],
                  [`Q_1 = ${dec(r1)}, \\ Q_3 = ${dec(r3)}, \\ \\text{IQR} = ${dec(ri)}`],
                ],
                [
                  ["Find the fences", "求界限"],
                  [
                    `$1.5 \\times ${dec(ri)} = ${dec(reach)}$ below $Q_1$ and above $Q_3$:`,
                    `在 $Q_1$ 以下和 $Q_3$ 以上各 $1.5 \\times ${dec(ri)} = ${dec(reach)}$：`,
                  ],
                  [`${dec(r1)} - ${dec(reach)} = ${dec(lowFence)}, \\ ${dec(r3)} + ${dec(reach)} = ${dec(highFence)}`],
                ],
                [
                  ["Compare", "比较"],
                  [`Only $${extreme}$ lies outside ${fences}.`, `只有 $${extreme}$ 落在 ${fencesZh} 之外。`],
                ],
              ],
              [
                `$${extreme}$ is $${dec(gap)}$ ${high ? "above $Q_3$" : "below $Q_1$"}, more than $1.5 \\times \\text{IQR} = ${dec(reach)}$.`,
                `$${extreme}$ ${high ? "比 $Q_3$ 大" : "比 $Q_1$ 小"} $${dec(gap)}$，超过了 $1.5 \\times \\text{IQR} = ${dec(reach)}$。`,
              ],
            );
          }
        },
        dotPlotFigure([2, 3, 4, 5, 6, 7, 20], { min: 0, max: 22, step: 1, labelEvery: 2 }),
      ),
      lesson(
        "effect-of-an-outlier",
        ["The effect of an outlier", "离群值的影响"],
        [
          [
            "An outlier pulls the mean toward it, while the median hardly moves. For $3, 4, 5, 5, 5, 6, 7, 45$ the mean is $80 \\div 8 = 10$, larger than seven of the eight values, but the median is $5$. Without the outlier the mean is $35 \\div 7 = 5$. When a data set has outliers, the median usually describes its center better.",
            "离群值会把平均数拉向它，而中位数几乎不变。对 $3, 4, 5, 5, 5, 6, 7, 45$，平均数是 $80 \\div 8 = 10$，比八个数中的七个都大，而中位数是 $5$。去掉离群值后平均数是 $35 \\div 7 = 5$。数据中有离群值时，中位数通常更能代表中心。",
          ],
          [
            "The outlier is $45 - 5 = 40$ above the other mean, and $40 \\div 8 = 5$ is how far it moved the mean.",
            "离群值比其余数据的平均数大 $45 - 5 = 40$，$40 \\div 8 = 5$ 正是平均数被拉动的距离。",
          ],
          [
            "Removing a value changes the count too. Divide the new sum by $7$, not by $8$.",
            "去掉一个数后个数也变了。新的和要除以 $7$，不是 $8$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const base = data(rng, 7, 10, 30);
            if (sum(base) % 7 !== 0) continue;
            const extreme = Math.max(...base) + rng.int(25, 60);
            const xs = rng.shuffle([...base, extreme]);
            if (sum(xs) % 2 !== 0 || !isOutlier(xs, extreme)) continue;
            const [m8, m7] = [mean(xs), mean(base)];
            const change = m8.sub(m7);
            const lift = extreme - sum(base) / 7;
            return valued(
              [
                `In the data set $${list(xs)}$, the value $${extreme}$ is an outlier. By how much does the mean decrease when it is removed?`,
                `在数据 $${list(xs)}$ 中，$${extreme}$ 是离群值。去掉它后平均数减少多少？`,
              ],
              change,
              [
                [["Mean with it", "含离群值的平均数"], ["All $8$ values:", "全部 $8$ 个数："], [`${sum(xs)} \\div 8 = ${dec(m8)}`]],
                [
                  ["Mean without it", "去掉后的平均数"],
                  [`The other $7$ add to $${sum(base)}$:`, `其余 $7$ 个数之和是 $${sum(base)}$：`],
                  [`${sum(base)} \\div 7 = ${dec(m7)}`],
                ],
                [["Subtract", "相减"], ["The decrease:", "减少的量："], [`${dec(m8)} - ${dec(m7)} = ${dec(change)}`]],
              ],
              [
                `The outlier is $${extreme} - ${dec(m7)} = ${lift}$ above the other mean, and $${lift} \\div 8 = ${dec(change)}$.`,
                `离群值比其余数据的平均数大 $${extreme} - ${dec(m7)} = ${lift}$，而 $${lift} \\div 8 = ${dec(change)}$。`,
              ],
              [
                [m8, "That is the mean with the outlier, not the change.", "这是含离群值的平均数，不是变化量。"],
                [m7, "That is the mean without the outlier, not the change.", "这是去掉离群值后的平均数，不是变化量。"],
                [
                  Q.of(extreme, 8),
                  "That is the outlier divided by $8$, not the change in the mean.",
                  "这是离群值除以 $8$，不是平均数的变化量。",
                ],
                [
                  Q.of(sum(xs) - extreme, 8)
                    .sub(m8)
                    .abs(),
                  "That divides the new sum by $8$; only $7$ values are left.",
                  "这是把新的和除以 $8$，可是只剩 $7$ 个数了。",
                ],
              ],
              { form: "decimal" },
            );
          }
        },
        dotPlotFigure([3, 4, 5, 5, 5, 6, 7, 45], { min: 0, max: 50, step: 1, labelEvery: 5 }),
      ),
    ],
  },
  [
    "Eight friends get $3, 4, 5, 5, 5, 6, 7$ and $45$ dollars of pocket money a week. One of them says the average is $10$ dollars.",
    "八个朋友每周的零花钱分别是 $3, 4, 5, 5, 5, 6, 7$ 和 $45$ 美元。其中一人说平均是 $10$ 美元。",
  ],
  [
    "$80 \\div 8 = 10$, yet seven of the eight get $7$ dollars or less; the $45$ pulls the mean up.",
    "$80 \\div 8 = 10$，可是八人中有七人不超过 $7$ 美元；是 $45$ 把平均数拉高了。",
  ],
  [
    "find outliers with the $1.5 \\times \\text{IQR}$ rule and see how far one moves the mean.",
    "用 $1.5 \\times \\text{IQR}$ 法则找出离群值，并看看它把平均数拉动了多少。",
  ],
);

/** dotContexts are what a dot plot counts: [English, Chinese, smallest value]. */
const dotContexts: readonly (readonly [string, string, number])[] = [
  ["the number of books each student in a class read last month", "某班每个学生上个月读的书的本数", 0],
  ["the number of goals a team scored in each game of a season", "一支球队一个赛季每场比赛的进球数", 0],
  ["the hours of sleep each camper got on the first night", "每个营员第一晚的睡眠小时数", 4],
  ["the shoe sizes of the players on a team", "一支球队队员的鞋码", 35],
];

/** dotData draws 9 to 15 values over 7 to 9 consecutive integers from lo. */
function dotData(rng: Rng, lo: number): { xs: number[]; axis: Axis } {
  const span = rng.int(6, 8);
  const xs = data(rng, rng.int(9, 15), lo, lo + span);
  return { xs, axis: { min: lo, max: lo + span, step: 1 } };
}

export const dotPlots: TopicDef = withIntro(
  {
    id: "dot-plots",
    title: t("Dot Plots", "点图"),
    summary: t("Read a data set from a dot plot, and find its median.", "从点图中读出数据，并求中位数。"),
    prerequisites: ["median-and-mode"],
    encompasses: [],
    xp: 10,
    standards: ["CCSS.6.SP.B.4"],
    knowledgePoints: [
      lesson(
        "reading-a-dot-plot",
        ["Reading a dot plot", "读点图"],
        [
          [
            "A **dot plot** shows a data set on a number line: each value is a dot, and equal values stack. The number of dots above a value is how often it occurs, and the number of all the dots is the number of values. In the dot plot shown, $3$ occurs four times, and $1 + 2 = 3$ values are at least $6$.",
            "**点图**在数轴上表示一组数据：每个数据是一个点，相同的值叠在一起。某个值上方的点数就是它出现的次数，所有点的个数就是数据的个数。在图中的点图里，$3$ 出现了四次，不小于 $6$ 的数据有 $2 + 1 = 3$ 个。",
          ],
          ["There are $13$ dots, and $10$ of them are below $6$: $13 - 10 = 3$.", "一共 $13$ 个点，其中 $10$ 个小于 $6$：$13 - 10 = 3$。"],
          [
            "“At least $6$” includes $6$ itself. Count the dots at $6$ as well as those to its right.",
            "“不小于 $6$”包括 $6$ 本身。$6$ 上的点和它右边的点都要数。",
          ],
        ],
        (rng) => {
          const [en, zh, lo] = rng.pick(dotContexts);
          for (;;) {
            const { xs, axis } = dotData(rng, lo);
            const k = rng.int(axis.min + 2, axis.max - 1);
            const atLeast = xs.filter((x) => x >= k).length;
            const exactly = xs.filter((x) => x === k).length;
            if (atLeast === 0 || exactly === 0 || atLeast === exactly) continue;
            const stacks = Array.from({ length: axis.max - k + 1 }, (_, i) => xs.filter((x) => x === k + i).length);
            const below = xs.length - atLeast;
            return valued(
              [`The dot plot shows ${en}. How many of the values are at least $${k}$?`, `点图表示${zh}。有多少个数据不小于 $${k}$？`],
              atLeast,
              [
                [
                  ["Pick the stacks", "找出这些点"],
                  [
                    `“At least $${k}$” means $${k}$ and every value to its right. The stacks there hold:`,
                    `“不小于 $${k}$”指 $${k}$ 和它右边的所有值。这些位置上的点数是：`,
                  ],
                  [list(stacks)],
                ],
                [["Add", "相加"], ["Add the stacks:", "把点数相加："], [`${stacks.join(" + ")} = ${atLeast}`]],
              ],
              [
                `There are $${xs.length}$ dots and $${below}$ of them are below $${k}$: $${xs.length} - ${below} = ${atLeast}$.`,
                `一共 $${xs.length}$ 个点，其中 $${below}$ 个小于 $${k}$：$${xs.length} - ${below} = ${atLeast}$。`,
              ],
              [
                [exactly, `That counts only the dots at $${k}$.`, `这只数了 $${k}$ 上的点。`],
                [
                  atLeast - exactly,
                  `That leaves out the dots at $${k}$; “at least” includes $${k}$.`,
                  `这漏掉了 $${k}$ 上的点；“不小于”包括 $${k}$。`,
                ],
                [below, `That counts the dots below $${k}$.`, `这数的是小于 $${k}$ 的点。`],
                [xs.length, "That counts every dot.", "这数了所有的点。"],
              ],
              { figure: dotPlotFigure(xs, axis) },
            );
          }
        },
        dotPlotFigure([1, 2, 2, 3, 3, 3, 3, 4, 4, 5, 6, 6, 7], { min: 0, max: 8, step: 1 }),
      ),
      {
        ...lesson(
          "the-median-from-a-dot-plot",
          ["The median from a dot plot", "从点图求中位数"],
          [
            [
              "A dot plot already shows the data sorted, from left to right. To find the median, count the dots, then count from the left to the middle one, or to the middle two. The dot plot $1, 2, 2, 3, 3, 3, 3, 4, 4, 5, 6, 6, 7$ has $13$ dots, so the median is the $7$th from the left: $3$.",
              "点图中的数据已经从左到右排好了序。求中位数时，先数出点数，再从左数到中间的一个点或中间两个点。点图 $1, 2, 2, 3, 3, 3, 3, 4, 4, 5, 6, 6, 7$ 有 $13$ 个点，所以中位数是从左数第 $7$ 个点：$3$。",
            ],
            ["Counting $7$ dots from the right also stops at $3$.", "从右往左数第 $7$ 个点，也停在 $3$ 上。"],
            [
              "Find the middle dot, not the middle of the number line. The line from $0$ to $8$ has middle $4$, but the median is $3$.",
              "要找中间的点，不是数轴的中间。从 $0$ 到 $8$ 的数轴中间是 $4$，可中位数是 $3$。",
            ],
          ],
          (rng) => {
            const [en, zh, lo] = rng.pick(dotContexts);
            const { xs, axis } = dotData(rng, lo);
            const s = sorted(xs);
            const n = xs.length;
            const h = Math.floor(n / 2);
            const m = median(xs);
            const odd = n % 2 === 1;
            const offs: Off[] = [
              [Q.of(axis.min + axis.max, 2), "That is the middle of the number line, not of the dots.", "这是数轴的中间，不是点的中间。"],
            ];
            offs.push([n, "That is the number of dots, not the value of the middle one.", "这是点的个数，不是中间那个点的值。"]);
            if (isTerminating(mean(xs))) offs.push([mean(xs), "That is the mean, not the middle value.", "这是平均数，不是中间的值。"]);
            if (odd) {
              offs.push([s[h - 1] as number, "That is one dot short of the middle.", "这比中间少数了一个点。"]);
              offs.push([s[h + 1] as number, "That is one dot past the middle.", "这比中间多数了一个点。"]);
            } else {
              offs.push([
                s[h - 1] as number,
                "That is only the first of the two middle dots; take their mean.",
                "这只是中间两个点中的前一个，要取它们的平均数。",
              ]);
              offs.push([
                s[h] as number,
                "That is only the second of the two middle dots; take their mean.",
                "这只是中间两个点中的后一个，要取它们的平均数。",
              ]);
            }
            return valued(
              [`The dot plot shows ${en}. What is the median?`, `点图表示${zh}。中位数是多少？`],
              m,
              [
                [
                  ["Count the dots", "数点"],
                  odd
                    ? [
                        `There are $${n}$ dots, so the median is dot $${h + 1}$ from the left.`,
                        `共有 $${n}$ 个点，所以中位数是从左数第 $${h + 1}$ 个点。`,
                      ]
                    : [
                        `There are $${n}$ dots, so the median is the mean of dots $${h}$ and $${h + 1}$.`,
                        `共有 $${n}$ 个点，所以中位数是第 $${h}$ 个和第 $${h + 1}$ 个点的平均数。`,
                      ],
                ],
                [
                  ["Count from the left", "从左数"],
                  ["Reading the dots in order:", "按顺序读出各点："],
                  [list(s), odd ? `\\text{median} = ${dec(m)}` : `\\frac{${s[h - 1]} + ${s[h]}}{2} = ${dec(m)}`],
                ],
              ],
              odd
                ? [
                    `Counting $${h + 1}$ dots from the right also stops at $${s[n - 1 - h]}$.`,
                    `从右往左数第 $${h + 1}$ 个点，也停在 $${s[n - 1 - h]}$ 上。`,
                  ]
                : [
                    `Counting from the right, dots $${h}$ and $${h + 1}$ are the same two, $${s[h]}$ and $${s[h - 1]}$.`,
                    `从右往左数，第 $${h}$ 个和第 $${h + 1}$ 个点是同样两个点：$${s[h]}$ 和 $${s[h - 1]}$。`,
                  ],
              offs,
              { form: "decimal", figure: dotPlotFigure(xs, axis) },
            );
          },
          drawn(gradeDrawings4["dot-plots#the-median-from-a-dot-plot"]),
        ),
        keyPrerequisites: ["median-and-mode"],
      },
    ],
  },
  [
    "A class asks everyone how many pets they have and puts a dot above the number line for each answer. Where many give the same answer, the dots pile up.",
    "全班同学说出自己养了几只宠物，每个回答在数轴上方画一个点。回答相同的人多，点就叠得高。",
  ],
  ["Every student is one dot, so a class of $25$ makes $25$ dots.", "每个同学是一个点，所以 $25$ 人的班级有 $25$ 个点。"],
  ["count values in a dot plot and read its median.", "在点图中数数据，并读出中位数。"],
);

/** boxContexts are what a box plot summarizes: [English, Chinese, axis]. */
const boxContexts: readonly (readonly [string, string, Axis])[] = [
  ["the scores of a class on a 20-point quiz", "某班一次 20 分小测验的成绩", { min: 0, max: 20, step: 1, labelEvery: 2 }],
  ["the number of push-ups each student did in a minute", "每个学生一分钟内做的俯卧撑个数", { min: 0, max: 40, step: 2, labelEvery: 5 }],
  ["the minutes each student spent on homework last night", "每个学生昨晚做作业的分钟数", { min: 0, max: 100, step: 5, labelEvery: 2 }],
];

/** summaryOn draws five increasing values on the axis's ticks. */
function summaryOn(rng: Rng, axis: Axis): FiveNumberSummary {
  const ticks = Array.from({ length: Math.round((axis.max - axis.min) / axis.step) + 1 }, (_, i) => axis.min + i * axis.step);
  return sorted(rng.sample(ticks, 5)) as unknown as FiveNumberSummary;
}

/** fiveNames name the five marks of a box plot. */
const fiveNames = [
  ["the minimum", "最小值"],
  ["the first quartile", "第一四分位数"],
  ["the median", "中位数"],
  ["the third quartile", "第三四分位数"],
  ["the maximum", "最大值"],
] as const;

export const boxPlots: TopicDef = withIntro(
  {
    id: "box-plots",
    title: t("Box Plots", "箱线图"),
    summary: t(
      "Read the five-number summary, the range and the interquartile range from a box plot, and the share of the data between its marks.",
      "从箱线图中读出五数概括、极差和四分位距，以及各标记之间的数据所占比例。",
    ),
    prerequisites: ["range-and-interquartile-range"],
    encompasses: [],
    xp: 10,
    standards: ["CCSS.6.SP.B.4", "CCSS.6.SP.B.5.C"],
    knowledgePoints: [
      lesson(
        "reading-a-box-plot",
        ["Reading a box plot", "读箱线图"],
        [
          [
            "A **box plot** draws a data set's **five-number summary**: the whiskers end at the minimum and the maximum, the box runs from the first quartile $Q_1$ to the third quartile $Q_3$, and the line inside the box is the median. The length of the box is the interquartile range, and the distance between the whisker ends is the range. In the box plot shown the minimum is $2$, $Q_1 = 6$, the median is $9$, $Q_3 = 12$ and the maximum is $18$, so $\\text{IQR} = 12 - 6 = 6$ and the range is $18 - 2 = 16$.",
            "**箱线图**画出一组数据的**五数概括**：两条须的端点是最小值和最大值，箱子从第一四分位数 $Q_1$ 延伸到第三四分位数 $Q_3$，箱内的竖线是中位数。箱子的长度是四分位距，两须端点之间的距离是极差。图中的箱线图里，最小值是 $2$，$Q_1 = 6$，中位数是 $9$，$Q_3 = 12$，最大值是 $18$，所以 $\\text{IQR} = 12 - 6 = 6$，极差是 $18 - 2 = 16$。",
          ],
          ["$6 + 6 = 12$ and $2 + 16 = 18$.", "$6 + 6 = 12$，$2 + 16 = 18$。"],
          [
            "The median is the line inside the box, not the middle of the box or of the whiskers.",
            "中位数是箱内的那条竖线，不是箱子的中点，也不是两须的中点。",
          ],
        ],
        (rng) => {
          const [en, zh, axis] = rng.pick(boxContexts);
          const s = summaryOn(rng, axis);
          const [lo, q1, med, q3, hi] = s;
          const asked = rng.pick(["median", "iqr", "range"] as const);
          const read: Walk = [
            ["Read the marks", "读出五个标记"],
            ["From left to right:", "从左到右："],
            [`${lo}, \\ Q_1 = ${q1}, \\ ${med}, \\ Q_3 = ${q3}, \\ ${hi}`],
          ];
          const measures: Record<"median" | "iqr" | "range", { name: Pair; value: number; work: Walk; check: Pair }> = {
            median: {
              name: ["the median", "中位数"],
              value: med,
              work: [
                ["Pick the line", "找出竖线"],
                ["The median is the line inside the box:", "中位数是箱内的竖线："],
                [`\\text{median} = ${med}`],
              ],
              check: [
                `$${q1} < ${med} < ${q3}$: the line sits inside the box, between the quartiles.`,
                `$${q1} < ${med} < ${q3}$：竖线在箱子里，位于两个四分位数之间。`,
              ],
            },
            iqr: {
              name: ["the interquartile range", "四分位距"],
              value: q3 - q1,
              work: [
                ["Subtract", "相减"],
                ["The box runs from $Q_1$ to $Q_3$:", "箱子从 $Q_1$ 到 $Q_3$："],
                [`\\text{IQR} = ${q3} - ${q1} = ${q3 - q1}`],
              ],
              check: [`$${q1} + ${q3 - q1} = ${q3}$.`, `$${q1} + ${q3 - q1} = ${q3}$。`],
            },
            range: {
              name: ["the range", "极差"],
              value: hi - lo,
              work: [
                ["Subtract", "相减"],
                ["The whiskers end at the minimum and the maximum:", "两须端点是最小值和最大值："],
                [`${hi} - ${lo} = ${hi - lo}`],
              ],
              check: [`$${lo} + ${hi - lo} = ${hi}$.`, `$${lo} + ${hi - lo} = ${hi}$。`],
            },
          };
          const measure = measures[asked];
          return valued(
            [`The box plot summarizes ${en}. What is ${measure.name[0]}?`, `箱线图概括了${zh}。${measure.name[1]}是多少？`],
            measure.value,
            [read, measure.work],
            measure.check,
            [
              [med, "That is the median, the line inside the box.", "这是中位数，即箱内的竖线。"],
              [q3 - q1, "That is the interquartile range, the length of the box.", "这是四分位距，即箱子的长度。"],
              [hi - lo, "That is the range, from whisker end to whisker end.", "这是极差，即两须端点之间的距离。"],
              [q3, "That is the third quartile alone.", "这只是第三四分位数。"],
              [q1, "That is the first quartile alone.", "这只是第一四分位数。"],
              [Q.of(lo + hi, 2), "That is halfway between the whisker ends, not the median line.", "这是两须端点的中点，不是中位数竖线。"],
            ],
            { figure: boxPlotFigure(s, axis) },
          );
        },
        boxPlotFigure([2, 6, 9, 12, 18], { min: 0, max: 20, step: 1, labelEvery: 2 }),
      ),
      lesson(
        "quarters-of-the-data",
        ["Quarters of the data", "四分之一的数据"],
        [
          [
            "The five marks of a box plot split the data into four parts with about the same number of values in each: about $25\\%$ of the data lie between the minimum and $Q_1$, $25\\%$ between $Q_1$ and the median, and so on. In the box plot with marks $2, 6, 9, 12, 18$, about $50\\%$ of the values lie between $6$ and $12$, and about $75\\%$ are at least $6$.",
            "箱线图的五个标记把数据分成四部分，每部分的数据个数大致相同：最小值到 $Q_1$ 之间约有 $25\\%$ 的数据，$Q_1$ 到中位数之间约有 $25\\%$，依此类推。在标记为 $2, 6, 9, 12, 18$ 的箱线图中，约 $50\\%$ 的数据在 $6$ 和 $12$ 之间，约 $75\\%$ 的数据不小于 $6$。",
          ],
          [
            "Below $6$ lies one quarter, $25\\%$, and $25\\% + 75\\% = 100\\%$.",
            "小于 $6$ 的是一个四分之一，即 $25\\%$，而 $25\\% + 75\\% = 100\\%$。",
          ],
          [
            "A long part means its quarter of the data is spread out, not that it holds more values.",
            "某一部分较长，说明这四分之一的数据较分散，而不是它包含的数据更多。",
          ],
        ],
        (rng) => {
          const [en, zh, axis] = rng.pick(boxContexts);
          const s = summaryOn(rng, axis);
          const [i, j] = sorted(rng.sample([0, 1, 2, 3, 4], 2)) as [number, number];
          const parts = j - i;
          const pct = 25 * parts;
          const [a, b] = [s[i] as number, s[j] as number];
          const quarterOffs: Off[] = [1, 2, 3, 4].map((k) => [
            25 * k,
            `That counts ${k === 1 ? "one quarter" : `${k} quarters`}; between the two marks lie ${parts === 1 ? "one" : parts}.`,
            `这数了 ${k} 个四分之一，可两个标记之间有 ${parts} 个。`,
          ]);
          return valued(
            [
              `The box plot summarizes ${en}. About what percent of the values lie between $${a}$ and $${b}$?`,
              `箱线图概括了${zh}。约百分之几的数据在 $${a}$ 和 $${b}$ 之间？`,
            ],
            pct,
            [
              [
                ["Name the marks", "认出标记"],
                [
                  `$${a}$ is ${fiveNames[i]?.[0]} and $${b}$ is ${fiveNames[j]?.[0]}.`,
                  `$${a}$ 是${fiveNames[i]?.[1]}，$${b}$ 是${fiveNames[j]?.[1]}。`,
                ],
              ],
              [
                ["Count the quarters", "数四分之一"],
                [`Between them ${parts === 1 ? "lies one" : `lie ${parts}`} of the four quarters:`, `它们之间有 ${parts} 个四分之一：`],
                [`${parts} \\times 25\\% = ${pct}\\%`],
              ],
            ],
            [
              `The other ${4 - parts} ${4 - parts === 1 ? "quarter holds" : "quarters hold"} about $${100 - pct}\\%$, and $${pct}\\% + ${100 - pct}\\% = 100\\%$.`,
              `其余 ${4 - parts} 个四分之一约占 $${100 - pct}\\%$，而 $${pct}\\% + ${100 - pct}\\% = 100\\%$。`,
            ],
            [
              ...quarterOffs,
              [
                Math.round((100 * (b - a)) / (s[4] - s[0])),
                "That compares lengths on the plot; each quarter holds the same number of values, whatever its length.",
                "这是在比较图上的长度；每个四分之一的数据个数相同，与长短无关。",
              ],
            ],
            { percent: true, figure: boxPlotFigure(s, axis) },
          );
        },
        drawn(gradeDrawings4["box-plots#quarters-of-the-data"]),
      ),
    ],
  },
  [
    "A coach has the push-up counts of $40$ students. Instead of listing them all, she marks five numbers: the lowest, the highest, the middle, and the middles of each half.",
    "教练有 $40$ 名学生的俯卧撑个数。她没有一一列出，而是标出五个数：最低、最高、中间的数，以及两半各自中间的数。",
  ],
  ["The five marks cut the $40$ students into four groups of about $10$ each.", "这五个标记把 $40$ 名学生分成四组，每组大约 $10$ 人。"],
  [
    "read the five-number summary from a box plot and the share of the data between its marks.",
    "从箱线图读出五数概括，以及各标记之间的数据所占比例。",
  ],
);

/** statisticsTopics are the topics on summarizing data. */
export const statisticsTopics: readonly TopicDef[] = [
  meanOfADataSet,
  medianAndMode,
  rangeAndInterquartileRange,
  meanAbsoluteDeviation,
  comparingDataSets,
  outliers,
  dotPlots,
  boxPlots,
];
