import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";

import { choiceProblem, isTerminating, numberProblem, steps } from "../problems.ts";

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

/** setOptions are the two data sets of a comparison. */
const setOptions: readonly Text[] = [t("Data set A", "数据集 A"), t("Data set B", "数据集 B")];

export const meanOfADataSet: TopicDef = {
  id: "mean-of-a-data-set",
  title: t("The Mean of a Data Set", "数据的平均数"),
  summary: t("Compute the mean of a data set, and find a missing value from the mean.", "计算一组数据的平均数，并由平均数求缺失的数据。"),
  prerequisites: ["decimal-arithmetic"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.6.SP.B.5.C"],
  knowledgePoints: [
    {
      id: "computing-the-mean",
      title: t("Computing the mean", "计算平均数"),
      explanation: t(
        "The **mean** (average) of a data set is the sum of the values divided by how many values there are:\n\n$$\\text{mean} = \\frac{\\text{sum of the values}}{\\text{number of values}}$$\n\nFor $4, 9, 5, 6$: the sum is $24$, there are $4$ values, so the mean is $24 \\div 4 = 6$. The mean need not be one of the values, nor a whole number.",
        "一组数据的**平均数**等于所有数据之和除以数据的个数：\n\n$$\\text{平均数} = \\frac{\\text{数据之和}}{\\text{数据个数}}$$\n\n对于 $4, 9, 5, 6$：和是 $24$，共 $4$ 个数，所以平均数是 $24 \\div 4 = 6$。平均数不一定是其中某个数，也不一定是整数。",
      ),
      generate(rng) {
        const n = rng.int(4, 8);
        const xs = terminatingMean(rng, n, 1, 40);
        const m = mean(xs);
        return numberProblem({
          prompt: t(`Find the mean of the data set $${list(xs)}$.`, `求数据 $${list(xs)}$ 的平均数。`),
          answer: m,
          form: "decimal",
          wrong: [sum(xs), Q.of(sum(xs), n - 1), ...(isTerminating(median(xs)) ? [median(xs)] : [])],
          solution: t(
            `Add the ${n} values and divide by ${n}:${steps(`\\frac{${xs.join(" + ")}}{${n}} = \\frac{${sum(xs)}}{${n}} = ${dec(m)}`)}`,
            `把 ${n} 个数相加，再除以 ${n}：${steps(`\\frac{${xs.join(" + ")}}{${n}} = \\frac{${sum(xs)}}{${n}} = ${dec(m)}`)}`,
          ),
        });
      },
    },
    {
      id: "finding-a-missing-value",
      title: t("Finding a missing value", "求缺失的数据"),
      explanation: t(
        "If the mean of $n$ values is $m$, their sum is $n \\times m$. A missing value is that total minus the sum of the known values.\n\nFive scores have mean $8$, and four of them are $7, 9, 6, 10$. The total is $5 \\times 8 = 40$, the known scores add to $32$, so the fifth is $40 - 32 = 8$.",
        "如果 $n$ 个数的平均数是 $m$，它们的和就是 $n \\times m$。缺失的数等于这个总和减去已知数据之和。\n\n五个分数的平均数是 $8$，其中四个是 $7, 9, 6, 10$。总和是 $5 \\times 8 = 40$，已知分数之和是 $32$，所以第五个是 $40 - 32 = 8$。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(4, 7);
          const m = rng.int(5, 30);
          const known = data(rng, n - 1, Math.max(1, m - 10), m + 10);
          const x = n * m - sum(known);
          if (x < 1 || x > 60) continue;
          return numberProblem({
            prompt: t(
              `The mean of ${n} numbers is $${m}$, and ${n - 1} of them are $${list(known)}$. What is the missing number?`,
              `${n} 个数的平均数是 $${m}$，其中 ${n - 1} 个是 $${list(known)}$。缺失的数是多少？`,
            ),
            answer: x,
            form: "integer",
            wrong: [(n - 1) * m - sum(known), m, n * m],
            solution: t(
              `The ${n} numbers add to $${n} \\times ${m} = ${n * m}$, and the known ones add to $${sum(known)}$:${steps(`${n * m} - ${sum(known)} = ${x}`)}`,
              `这 ${n} 个数之和是 $${n} \\times ${m} = ${n * m}$，已知的数之和是 $${sum(known)}$：${steps(`${n * m} - ${sum(known)} = ${x}`)}`,
            ),
          });
        }
      },
    },
  ],
};

export const medianAndMode: TopicDef = {
  id: "median-and-mode",
  title: t("The Median and the Mode", "中位数与众数"),
  summary: t("Find the middle value and the most frequent value of a data set.", "求一组数据的中间值和出现次数最多的值。"),
  prerequisites: ["decimal-arithmetic"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.6.SP.B.5.C"],
  knowledgePoints: [
    {
      id: "finding-the-median",
      title: t("The median", "中位数"),
      explanation: t(
        "The **median** is the middle value once the data are **sorted**. With an odd number of values it is the one in the middle; with an even number it is the mean of the two middle values.\n\n$9, 2, 7, 4, 5$ sorted is $2, 4, 5, 7, 9$: the median is $5$. For $2, 4, 5, 7, 9, 10$ the middle values are $5$ and $7$, so the median is $\\frac{5 + 7}{2} = 6$.",
        "**中位数**是把数据**排序**后位于中间的值。数据个数为奇数时，取正中间的数；为偶数时，取中间两个数的平均数。\n\n$9, 2, 7, 4, 5$ 排序后是 $2, 4, 5, 7, 9$，中位数是 $5$。对 $2, 4, 5, 7, 9, 10$，中间两个数是 $5$ 和 $7$，中位数是 $\\frac{5 + 7}{2} = 6$。",
      ),
      generate(rng) {
        const n = rng.int(5, 10);
        const xs = data(rng, n, 1, 60);
        const s = sorted(xs);
        const m = median(xs);
        const h = Math.floor(n / 2);
        const middle = (stop: string) => (n % 2 === 1 ? ` $${s[h]}$${stop}` : steps(`\\frac{${s[h - 1]} + ${s[h]}}{2} = ${dec(m)}`));
        return numberProblem({
          prompt: t(`Find the median of the data set $${list(xs)}$.`, `求数据 $${list(xs)}$ 的中位数。`),
          answer: m,
          form: "decimal",
          wrong: [xs[h]!, ...(n % 2 === 0 ? [s[h]!, s[h - 1]!] : []), ...(isTerminating(mean(xs)) ? [mean(xs)] : [])],
          solution: t(
            `Sort the values: $${list(s)}$. There are ${n} values, so the median is ${n % 2 === 1 ? `the value in position ${h + 1}` : `the mean of the values in positions ${h} and ${h + 1}`}:${middle(".")}`,
            `先排序：$${list(s)}$。共 ${n} 个数，所以中位数是${n % 2 === 1 ? `第 ${h + 1} 个数` : `第 ${h} 个与第 ${h + 1} 个数的平均数`}：${middle("。")}`,
          ),
        });
      },
    },
    {
      id: "finding-the-mode",
      title: t("The mode", "众数"),
      explanation: t(
        "The **mode** is the value that occurs most often. In $3, 7, 7, 2, 9, 7, 3$ the value $7$ occurs three times, more than any other, so the mode is $7$. Sorting the data or counting each value with a tally makes the mode easy to see.",
        "**众数**是出现次数最多的值。在 $3, 7, 7, 2, 9, 7, 3$ 中，$7$ 出现了三次，比其他值都多，所以众数是 $7$。把数据排序或逐个计数，众数就一目了然。",
      ),
      generate(rng) {
        const [mode, twice, ...singles] = rng.sample(
          Array.from({ length: 30 }, (_, i) => i + 1),
          rng.int(4, 6),
        ) as [number, number, ...number[]];
        const xs = rng.shuffle([mode, mode, mode, twice, twice, ...singles]);
        return numberProblem({
          prompt: t(`Find the mode of the data set $${list(xs)}$.`, `求数据 $${list(xs)}$ 的众数。`),
          answer: mode,
          form: "integer",
          wrong: [twice, Math.max(...xs), 3],
          solution: t(
            `Sorted: $${list(sorted(xs))}$. The value $${mode}$ occurs 3 times, more than any other value, so the mode is $${mode}$.`,
            `排序后：$${list(sorted(xs))}$。$${mode}$ 出现 3 次，比其他值都多，所以众数是 $${mode}$。`,
          ),
        });
      },
    },
  ],
};

export const rangeAndInterquartileRange: TopicDef = {
  id: "range-and-interquartile-range",
  title: t("Range, Quartiles and Interquartile Range", "极差、四分位数与四分位距"),
  summary: t("Measure the spread of a data set with its range and its interquartile range.", "用极差和四分位距衡量数据的离散程度。"),
  prerequisites: ["median-and-mode"],
  encompasses: [{ topic: "median-and-mode", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.6.SP.B.5.C"],
  knowledgePoints: [
    {
      id: "range",
      title: t("The range", "极差"),
      explanation: t(
        "The **range** is the largest value minus the smallest: it measures how spread out the data are. For $12, 5, 20, 9$ the range is $20 - 5 = 15$.",
        "**极差**是最大值减最小值，用来衡量数据的分散程度。对 $12, 5, 20, 9$，极差是 $20 - 5 = 15$。",
      ),
      generate(rng) {
        const xs = data(rng, rng.int(5, 9), 1, 99);
        const [lo, hi] = [Math.min(...xs), Math.max(...xs)];
        return numberProblem({
          prompt: t(`Find the range of the data set $${list(xs)}$.`, `求数据 $${list(xs)}$ 的极差。`),
          answer: hi - lo,
          form: "integer",
          wrong: [hi, Math.abs(xs[xs.length - 1]! - xs[0]!), hi + lo],
          solution: t(
            `The largest value is $${hi}$ and the smallest is $${lo}$:${steps(`${hi} - ${lo} = ${hi - lo}`)}`,
            `最大值是 $${hi}$，最小值是 $${lo}$：${steps(`${hi} - ${lo} = ${hi - lo}`)}`,
          ),
        });
      },
    },
    {
      id: "quartiles-and-iqr",
      title: t("Quartiles and the interquartile range", "四分位数与四分位距"),
      explanation: t(
        "The median splits the sorted data into a lower half and an upper half; with an odd number of values, the median itself belongs to neither. The **first quartile** $Q_1$ is the median of the lower half, the **third quartile** $Q_3$ the median of the upper half. The **interquartile range** is $\\text{IQR} = Q_3 - Q_1$: the spread of the middle half of the data, which extreme values do not affect.\n\nFor $1, 3, 4, 6, 8, 9, 12$: the median is $6$, the lower half $1, 3, 4$ gives $Q_1 = 3$, the upper half $8, 9, 12$ gives $Q_3 = 9$, and $\\text{IQR} = 9 - 3 = 6$.",
        "中位数把排好序的数据分成下半部分和上半部分；数据个数为奇数时，中位数本身不属于任何一半。**第一四分位数** $Q_1$ 是下半部分的中位数，**第三四分位数** $Q_3$ 是上半部分的中位数。**四分位距** $\\text{IQR} = Q_3 - Q_1$，表示中间一半数据的分散程度，不受极端值影响。\n\n对 $1, 3, 4, 6, 8, 9, 12$：中位数是 $6$，下半部分 $1, 3, 4$ 得 $Q_1 = 3$，上半部分 $8, 9, 12$ 得 $Q_3 = 9$，$\\text{IQR} = 9 - 3 = 6$。",
      ),
      generate(rng) {
        const n = rng.int(7, 12);
        const xs = data(rng, n, 1, 60);
        const s = sorted(xs);
        const [q1, q3] = quartiles(xs);
        const iqr = q3.sub(q1);
        const h = Math.floor(n / 2);
        const [lower, upper] = [s.slice(0, h), s.slice(n - h)];
        return numberProblem({
          prompt: t(`Find the interquartile range of the data set $${list(xs)}$.`, `求数据 $${list(xs)}$ 的四分位距。`),
          answer: iqr,
          form: "decimal",
          wrong: [s[n - 1]! - s[0]!, q3, median(s.slice(Math.ceil(n / 2))).sub(median(s.slice(0, Math.ceil(n / 2))))],
          solution: t(
            `Sorted: $${list(s)}$. The lower half is $${list(lower)}$, so $Q_1 = ${dec(q1)}$; the upper half is $${list(upper)}$, so $Q_3 = ${dec(q3)}$.${steps(`\\text{IQR} = ${dec(q3)} - ${dec(q1)} = ${dec(iqr)}`)}`,
            `排序后：$${list(s)}$。下半部分是 $${list(lower)}$，所以 $Q_1 = ${dec(q1)}$；上半部分是 $${list(upper)}$，所以 $Q_3 = ${dec(q3)}$。${steps(`\\text{IQR} = ${dec(q3)} - ${dec(q1)} = ${dec(iqr)}`)}`,
          ),
        });
      },
    },
  ],
};

export const meanAbsoluteDeviation: TopicDef = {
  id: "mean-absolute-deviation",
  title: t("Mean Absolute Deviation", "平均绝对偏差"),
  summary: t("Measure spread as the average distance of the values from the mean.", "用各数据到平均数的平均距离来衡量离散程度。"),
  prerequisites: ["mean-of-a-data-set", "absolute-value"],
  encompasses: [{ topic: "mean-of-a-data-set", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.6.SP.B.5.C"],
  knowledgePoints: [
    {
      id: "computing-the-mad",
      title: t("Computing the mean absolute deviation", "计算平均绝对偏差"),
      explanation: t(
        "The **mean absolute deviation** (MAD) is the mean distance of the values from the mean:\n\n1. find the mean;\n2. find the distance of each value from it, $|x - \\text{mean}|$;\n3. take the mean of those distances.\n\nFor $2, 4, 6, 8$: the mean is $5$, the distances are $3, 1, 1, 3$, and the MAD is $\\frac{8}{4} = 2$. Distances are never negative; without absolute values the deviations would always add up to $0$.",
        "**平均绝对偏差**（MAD）是各数据到平均数距离的平均值：\n\n1. 求平均数；\n2. 求每个数到平均数的距离 $|x - \\text{平均数}|$；\n3. 求这些距离的平均数。\n\n对 $2, 4, 6, 8$：平均数是 $5$，距离分别是 $3, 1, 1, 3$，MAD 是 $\\frac{8}{4} = 2$。距离不会是负数；如果不取绝对值，各偏差之和总是 $0$。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.pick([4, 5, 8]);
          const m = rng.int(5, 30);
          const xs = data(rng, n, Math.max(0, m - 9), m + 9);
          if (sum(xs) !== n * m) continue;
          const d = xs.map((x) => Math.abs(x - m));
          if (sum(d) === 0) continue;
          const mad = Q.of(sum(d), n);
          return numberProblem({
            prompt: t(`Find the mean absolute deviation of the data set $${list(xs)}$.`, `求数据 $${list(xs)}$ 的平均绝对偏差。`),
            answer: mad,
            form: "decimal",
            wrong: [sum(d), m, Q.of(Math.max(...xs) - Math.min(...xs), 2)],
            solution: t(
              `The mean is $\\frac{${sum(xs)}}{${n}} = ${m}$. The distances from it are $${list(d)}$:${steps(`\\text{MAD} = \\frac{${d.join(" + ")}}{${n}} = \\frac{${sum(d)}}{${n}} = ${dec(mad)}`)}`,
              `平均数是 $\\frac{${sum(xs)}}{${n}} = ${m}$。各数到它的距离是 $${list(d)}$：${steps(`\\text{MAD} = \\frac{${d.join(" + ")}}{${n}} = \\frac{${sum(d)}}{${n}} = ${dec(mad)}`)}`,
            ),
          });
        }
      },
    },
  ],
};

export const comparingDataSets: TopicDef = {
  id: "comparing-data-sets",
  title: t("Comparing Data Sets", "比较数据集"),
  summary: t("Compare two data sets by their centers and by their spreads.", "通过集中趋势和离散程度比较两组数据。"),
  prerequisites: ["mean-absolute-deviation", "range-and-interquartile-range"],
  encompasses: [
    { topic: "range-and-interquartile-range", weight: 0.5 },
    { topic: "mean-of-a-data-set", weight: 0.3 },
    { topic: "median-and-mode", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.7.SP.B.3", "CCSS.7.SP.B.4"],
  knowledgePoints: [
    {
      id: "comparing-centers",
      title: t("Comparing centers", "比较集中趋势"),
      explanation: t(
        "The mean and the median describe where a data set is centered. To compare two data sets, compute the same measure for both and subtract.\n\nThe heights (cm) of two seedling trays are A: $12, 15, 9, 14$ and B: $8, 10, 7, 11$. Their means are $12.5$ and $9$, so tray A is $3.5$ cm taller on average.",
        "平均数和中位数描述一组数据的中心位置。比较两组数据时，对两组计算同一个量再相减。\n\n两盘幼苗的高度（厘米）为 A：$12, 15, 9, 14$，B：$8, 10, 7, 11$。平均数分别是 $12.5$ 和 $9$，所以 A 盘平均高 $3.5$ 厘米。",
      ),
      generate(rng) {
        const n = rng.pick([4, 5]);
        const useMedian = rng.bool(0.4);
        for (;;) {
          const a = data(rng, n, 10, 50);
          const b = data(rng, n, 5, 45);
          const [ca, cb] = useMedian ? [median(a), median(b)] : [mean(a), mean(b)];
          const diff = ca.sub(cb);
          if (diff.sign() <= 0) continue;
          const measure = useMedian ? t("median", "中位数") : t("mean", "平均数");
          return numberProblem({
            prompt: t(
              `Data set A is $${list(a)}$ and data set B is $${list(b)}$. How much greater is the ${measure.en} of A than the ${measure.en} of B?`,
              `数据集 A 为 $${list(a)}$，数据集 B 为 $${list(b)}$。A 的${measure["zh-CN"]}比 B 的${measure["zh-CN"]}大多少？`,
            ),
            answer: diff,
            form: "decimal",
            wrong: useMedian ? [Q.of(a[Math.floor(n / 2)]! - b[Math.floor(n / 2)]!), ca] : [Q.of(sum(a) - sum(b)), ca],
            solution: t(
              `The ${measure.en} of A is $${dec(ca)}$ and the ${measure.en} of B is $${dec(cb)}$:${steps(`${dec(ca)} - ${dec(cb)} = ${dec(diff)}`)}`,
              `A 的${measure["zh-CN"]}是 $${dec(ca)}$，B 的${measure["zh-CN"]}是 $${dec(cb)}$：${steps(`${dec(ca)} - ${dec(cb)} = ${dec(diff)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "comparing-spreads",
      title: t("Comparing spreads", "比较离散程度"),
      explanation: t(
        "The range, the interquartile range and the mean absolute deviation describe how spread out a data set is. A larger value means the data vary more; two data sets can have the same center and very different spreads. Compare the same measure for both sets.",
        "极差、四分位距和平均绝对偏差描述一组数据的分散程度。数值越大，数据变化越大；两组数据可能中心相同而分散程度差别很大。比较时对两组用同一个量。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.pick([7, 8, 9]);
          const a = data(rng, n, 1, 40);
          const b = data(rng, n, 1, 40);
          const iqr = (xs: number[]) => {
            const [q1, q3] = quartiles(xs);
            return q3.sub(q1);
          };
          const [ia, ib] = [iqr(a), iqr(b)];
          const c = ia.cmp(ib);
          if (c === 0) continue;
          return choiceProblem({
            prompt: t(
              `Data set A is $${list(a)}$ and data set B is $${list(b)}$. Which data set has the greater interquartile range?`,
              `数据集 A 为 $${list(a)}$，数据集 B 为 $${list(b)}$。哪组数据的四分位距更大？`,
            ),
            options: setOptions,
            correct: c > 0 ? 0 : 1,
            solution: t(
              `Sorted, A is $${list(sorted(a))}$ with $\\text{IQR} = ${dec(ia)}$, and B is $${list(sorted(b))}$ with $\\text{IQR} = ${dec(ib)}$. So data set ${c > 0 ? "A" : "B"} has the greater interquartile range.`,
              `排序后，A 为 $${list(sorted(a))}$，$\\text{IQR} = ${dec(ia)}$；B 为 $${list(sorted(b))}$，$\\text{IQR} = ${dec(ib)}$。所以数据集 ${c > 0 ? "A" : "B"} 的四分位距更大。`,
            ),
          });
        }
      },
    },
  ],
};

export const outliers: TopicDef = {
  id: "outliers",
  title: t("Outliers", "离群值"),
  summary: t(
    "Identify outliers with the 1.5 × IQR rule, and see how they affect the mean and the median.",
    "用 1.5 倍四分位距法则识别离群值，并了解它们对平均数和中位数的影响。",
  ),
  prerequisites: ["range-and-interquartile-range", "mean-of-a-data-set"],
  encompasses: [
    { topic: "range-and-interquartile-range", weight: 0.5 },
    { topic: "mean-of-a-data-set", weight: 0.5 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.ID.A.3"],
  knowledgePoints: [
    {
      id: "identifying-outliers",
      title: t("The 1.5 × IQR rule", "1.5 倍四分位距法则"),
      explanation: t(
        "An **outlier** is a value far from the rest of the data. A common rule: a value is an outlier if it is more than $1.5 \\times \\text{IQR}$ below $Q_1$ or above $Q_3$, that is, outside the fences\n\n$$Q_1 - 1.5 \\times \\text{IQR} \\quad \\text{and} \\quad Q_3 + 1.5 \\times \\text{IQR}$$",
        "**离群值**是远离其余数据的值。常用法则：比 $Q_1$ 小 $1.5 \\times \\text{IQR}$ 以上，或比 $Q_3$ 大 $1.5 \\times \\text{IQR}$ 以上的值是离群值，也就是落在下面两个界限之外：\n\n$$Q_1 - 1.5 \\times \\text{IQR} \\quad \\text{和} \\quad Q_3 + 1.5 \\times \\text{IQR}$$",
      ),
      generate(rng) {
        for (;;) {
          const base = data(rng, rng.int(7, 10), 20, 40);
          const high = rng.bool();
          const [q1, q3] = quartiles(base);
          const iqr = q3.sub(q1);
          if (iqr.isZero()) continue;
          const extreme = high ? Math.max(...base) + rng.int(15, 40) : Math.min(...base) - rng.int(12, 19);
          const xs = rng.shuffle([...base, extreme]);
          const [r1, r3] = quartiles(xs);
          const ri = r3.sub(r1);
          const lowFence = r1.sub(ri.mul(Q.of(3, 2)));
          const highFence = r3.add(ri.mul(Q.of(3, 2)));
          const out = xs.filter((x) => isOutlier(xs, x));
          if (out.length !== 1 || out[0] !== extreme) continue;
          const s = sorted(xs);
          const candidates = [...new Set(s.filter((x) => x !== extreme))].filter(
            (x) => x === s[1] || x === s[s.length - 2] || rng.bool(0.3),
          );
          if (candidates.length < 3) continue;
          const decoys = rng.sample(candidates, 3);
          const options = rng.shuffle([extreme, ...decoys]);
          return choiceProblem({
            prompt: t(
              `Which value of the data set $${list(xs)}$ is an outlier by the $1.5 \\times \\text{IQR}$ rule?`,
              `按 $1.5 \\times \\text{IQR}$ 法则，数据 $${list(xs)}$ 中哪个值是离群值？`,
            ),
            options: options.map((x) => t(`$${x}$`, `$${x}$`)),
            correct: options.indexOf(extreme),
            solution: t(
              `Sorted: $${list(s)}$, with $Q_1 = ${dec(r1)}$, $Q_3 = ${dec(r3)}$ and $\\text{IQR} = ${dec(ri)}$. The fences are${steps(`${dec(r1)} - 1.5 \\times ${dec(ri)} = ${dec(lowFence)} \\qquad ${dec(r3)} + 1.5 \\times ${dec(ri)} = ${dec(highFence)}`)}Only $${extreme}$ lies outside them.`,
              `排序后：$${list(s)}$，$Q_1 = ${dec(r1)}$，$Q_3 = ${dec(r3)}$，$\\text{IQR} = ${dec(ri)}$。两个界限是${steps(`${dec(r1)} - 1.5 \\times ${dec(ri)} = ${dec(lowFence)} \\qquad ${dec(r3)} + 1.5 \\times ${dec(ri)} = ${dec(highFence)}`)}只有 $${extreme}$ 落在界限之外。`,
            ),
          });
        }
      },
    },
    {
      id: "effect-of-an-outlier",
      title: t("The effect of an outlier", "离群值的影响"),
      explanation: t(
        "An outlier pulls the mean toward it, while the median hardly moves. For $3, 4, 5, 5, 5, 6, 7, 45$ the mean is $10$, larger than seven of the eight values, but the median is $5$. Without the outlier the mean is $5$. When a data set has outliers, the median usually describes its center better.",
        "离群值会把平均数拉向它，而中位数几乎不变。对 $3, 4, 5, 5, 5, 6, 7, 45$，平均数是 $10$，比八个数中的七个都大，而中位数是 $5$。去掉离群值后平均数是 $5$。数据中有离群值时，中位数通常更能代表中心。",
      ),
      generate(rng) {
        for (;;) {
          const base = data(rng, 7, 10, 30);
          if (sum(base) % 7 !== 0) continue;
          const extreme = Math.max(...base) + rng.int(25, 60);
          const xs = rng.shuffle([...base, extreme]);
          if (sum(xs) % 2 !== 0 || !isOutlier(xs, extreme)) continue;
          const [m8, m7] = [mean(xs), mean(base)];
          const change = m8.sub(m7);
          return numberProblem({
            prompt: t(
              `In the data set $${list(xs)}$, the value $${extreme}$ is an outlier. By how much does the mean decrease when it is removed?`,
              `在数据 $${list(xs)}$ 中，$${extreme}$ 是离群值。去掉它后平均数减少多少？`,
            ),
            answer: change,
            form: "decimal",
            wrong: [m8, m7, Q.of(extreme, 8)],
            solution: t(
              `With the outlier, the mean is $\\frac{${sum(xs)}}{8} = ${dec(m8)}$; without it, $\\frac{${sum(base)}}{7} = ${dec(m7)}$:${steps(`${dec(m8)} - ${dec(m7)} = ${dec(change)}`)}`,
              `含离群值时，平均数是 $\\frac{${sum(xs)}}{8} = ${dec(m8)}$；去掉后是 $\\frac{${sum(base)}}{7} = ${dec(m7)}$：${steps(`${dec(m8)} - ${dec(m7)} = ${dec(change)}`)}`,
            ),
          });
        }
      },
    },
  ],
};

/** statisticsTopics are the topics on summarizing data. */
export const statisticsTopics: readonly TopicDef[] = [
  meanOfADataSet,
  medianAndMode,
  rangeAndInterquartileRange,
  meanAbsoluteDeviation,
  comparingDataSets,
  outliers,
];
