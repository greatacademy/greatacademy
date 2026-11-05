import type { Text } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { ExamSpec } from "../exam.ts";
import { ask, curveFigure, cx, dotsFigure, sg, sketchFigure, table, words } from "../exam.ts";
import { rectFigure } from "../exam-figures.ts";

// ACT Math Prep, questions of its own for the topics it shares with SAT Math Prep: statistics, probability, ratios, percents and units.

const lin = (a: number, b: number): string => `${cx(a)} ${sg(b)}`.trim();
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const list = (xs: readonly number[]): string => xs.join(", ");
const asc = (xs: readonly number[]): number[] => [...xs].sort((a, b) => a - b);

/** Writes a table with a heading row and a label on each following row as display math. */
function grid(corner: string, heads: readonly string[], rows: readonly (readonly [string, ...(readonly (number | string)[])])[]): string {
  const cell = (c: number | string): string => (typeof c === "number" ? String(c) : `\\text{${c}}`);
  const body = rows.map((r) => r.map(cell).join(" & ")).join(" \\\\ ");
  return `$$\\begin{array}{c|${"c".repeat(heads.length)}} ${[corner, ...heads].map(cell).join(" & ")} \\\\ \\hline ${body} \\end{array}$$`;
}

/** Draws a box plot over a number line running from lo to hi, with a tick every step. */
function boxPlot(v: readonly [number, number, number, number, number], lo: number, hi: number, step: number) {
  const px = (x: number): number => 30 + ((x - lo) * 260) / (hi - lo);
  const [min, q1, med, q3, max] = v;
  const ticks: (readonly [number, number, number, number])[] = [];
  const labels: (readonly [number, number, string])[] = [];
  for (let x = lo; x <= hi; x += step) {
    ticks.push([px(x), 170, px(x), 178]);
    labels.push([px(x), 196, String(x)]);
  }
  return sketchFigure(
    {
      segs: [
        [30, 170, 290, 170],
        ...ticks,
        [px(min), 110, px(q1), 110],
        [px(q3), 110, px(max), 110],
        [px(min), 98, px(min), 122],
        [px(max), 98, px(max), 122],
        [px(q1), 80, px(q3), 80],
        [px(q1), 140, px(q3), 140],
        [px(q1), 80, px(q1), 140],
        [px(q3), 80, px(q3), 140],
        [px(med), 80, px(med), 140],
      ],
      labels,
    },
    t("A box plot on a number line.", "数轴上的箱线图。"),
  );
}

/** Returns the median of an ascending list as an exact number. */
function medianOf(xs: readonly number[]): Q {
  const n = xs.length;
  const mid = Math.floor(n / 2);
  return n % 2 === 1 ? Q.of(xs[mid] ?? 0) : Q.of((xs[mid - 1] ?? 0) + (xs[mid] ?? 0), 2);
}

/** Expands a frequency table into an ascending list of values. */
const expand = (values: readonly number[], freq: readonly number[]): number[] =>
  values.flatMap((v, i) => Array<number>(freq[i] ?? 0).fill(v));

/** actOwnData are the question generators of ACT topics on statistics, probability, ratios, percents and units, by title. */
export const actOwnData: Record<string, ExamSpec["make"]> = {
  "Comparing Measures of Center": (rng, hard) => {
    const [m, k] = [rng.int(20, 80), rng.int(1, 6)];
    if (!hard) {
      const xs = [m - 4, m - 2, m, m + 2, m + 4 + 5 * k];
      return ask(
        rng,
        `Five quiz scores are $${list(xs)}$. By how many points does the mean exceed the median?`,
        `五次测验分数为 $${list(xs)}$。平均数比中位数高多少分？`,
        k,
        [5 * k, 2 * k, k + 2],
        `The median is the middle score, $${m}$. The scores add to $${5 * (m + k)}$, so the mean is $${m + k}$, which is $${k}$ more.`,
        `中位数是中间的分数 $${m}$。分数和为 $${5 * (m + k)}$，所以平均数为 $${m + k}$，高 $${k}$。`,
      );
    }
    const high = rng.int(0, 1) === 1;
    const far = 20 + 5 * k + rng.int(0, 30);
    const xs = [m, m + 1, m + 2, m + 3, high ? m + 3 + far : m - far];
    const [above, below] = [
      t(`The mean is greater than the median.`, `平均数大于中位数。`),
      t(`The mean is less than the median.`, `平均数小于中位数。`),
    ];
    return words(
      rng,
      t(`Which statement is true about the data set $${list(asc(xs))}$?`, `关于数据集 $${list(asc(xs))}$，哪个说法正确？`),
      high ? above : below,
      [
        high ? below : above,
        t(`The mean equals the median.`, `平均数等于中位数。`),
        t(`The mean and the median cannot be compared.`, `平均数和中位数无法比较。`),
      ],
      t(
        `The value far from the rest pulls the mean toward it but barely moves the median, so the mean lies on that value's side of the median.`,
        `远离其他数的那个值把平均数拉向自己，却几乎不影响中位数，所以平均数在中位数靠近它的一侧。`,
      ),
    );
  },
  "Determining Effects of Changing Data": (rng, hard) => {
    const a = rng.int(10, 40);
    const xs = [a, a + rng.int(1, 4), a + rng.int(5, 8), a + rng.int(9, 12), a + rng.int(13, 16)];
    const c = rng.int(2, 15);
    const [mean, median, range, top] = [
      t(`The mean`, `平均数`),
      t(`The median`, `中位数`),
      t(`The range`, `极差`),
      t(`The largest value`, `最大值`),
    ];
    if (!hard)
      return words(
        rng,
        t(
          `In the data set $${list(xs)}$, the largest value is increased by $${c}$. Which of the following does not change?`,
          `数据集 $${list(xs)}$ 中，最大值增加 $${c}$。下列哪一项不变？`,
        ),
        median,
        [mean, range, top],
        t(
          `The middle value is still $${xs[2]}$, so the median stays. The sum and the largest value grow, which raises the mean and the range.`,
          `中间的值仍是 $${xs[2]}$，所以中位数不变。和与最大值都变大，平均数和极差随之变大。`,
        ),
      );
    return words(
      rng,
      t(
        `The number $${c}$ is added to every value in the data set $${list(xs)}$. Which of the following does not change?`,
        `数据集 $${list(xs)}$ 中每个值都加上 $${c}$。下列哪一项不变？`,
      ),
      range,
      [mean, median, top],
      t(
        `Every value shifts by $${c}$, so the mean, median and largest value all rise by $${c}$. The gap between the largest and smallest values stays the same.`,
        `每个值都平移 $${c}$，所以平均数、中位数和最大值都增加 $${c}$。最大值与最小值之差不变。`,
      ),
    );
  },
  "Finding How a Data Change Affects a Mean": (rng, hard) => {
    const [n, m, k] = [rng.int(4, 12), rng.int(50, 90), rng.int(1, 4)];
    if (!hard) {
      const a = rng.int(40, 60);
      return ask(
        rng,
        `The mean of $${n}$ test scores is $${m}$. One score was recorded as $${a}$ but should be $${a + n * k}$. What is the correct mean?`,
        `$${n}$ 个测试分数的平均数为 $${m}$。其中一个分数记成了 $${a}$，实际应为 $${a + n * k}$。正确的平均数是多少？`,
        m + k,
        [m + n * k, m, m - k],
        `The total rises by $${n * k}$, which is shared among $${n}$ scores: the mean rises by $${k}$, to $${m + k}$.`,
        `总和增加 $${n * k}$，分摊到 $${n}$ 个分数上：平均数增加 $${k}$，变为 $${m + k}$。`,
      );
    }
    const v = m + (n + 1) * k;
    return ask(
      rng,
      `The mean of $${n}$ numbers is $${m}$. When the number $${v}$ is added to the list, what is the mean of the $${n + 1}$ numbers?`,
      `$${n}$ 个数的平均数为 $${m}$。把 $${v}$ 加入后，这 $${n + 1}$ 个数的平均数是多少？`,
      m + k,
      [Q.of(m + v, 2), m, v],
      `The total becomes $${n}(${m}) + ${v} = ${n * m + v}$, and $${n * m + v} \\div ${n + 1} = ${m + k}$.`,
      `总和变为 $${n}(${m}) + ${v} = ${n * m + v}$，而 $${n * m + v} \\div ${n + 1} = ${m + k}$。`,
    );
  },
  "Using Means and Sums": (rng, hard) => {
    const [n, m] = [rng.int(3, 9), rng.int(12, 95)];
    if (!hard)
      return ask(
        rng,
        `A runner's mean time over $${n}$ races is $${m}$ minutes. What is the total time for all $${n}$ races, in minutes?`,
        `一名跑者 $${n}$ 场比赛的平均用时为 $${m}$ 分钟。这 $${n}$ 场比赛总共用时多少分钟？`,
        n * m,
        [n + m, (n - 1) * m, (n + 1) * m],
        `A mean times the number of values gives the total: $${n}(${m}) = ${n * m}$.`,
        `平均数乘以个数得到总和：$${n}(${m}) = ${n * m}$。`,
      );
    const [p, d] = [rng.int(2, 6), rng.int(1, 2)];
    const o = rng.int(60, 75);
    const [a, b] = [o + n * d, o - p * d];
    return ask(
      rng,
      `A class of $${p}$ students has a mean score of $${a}$, and a class of $${n}$ students has a mean score of $${b}$. What is the mean score of all $${p + n}$ students?`,
      `一个 $${p}$ 人的班平均分为 $${a}$，一个 $${n}$ 人的班平均分为 $${b}$。这 $${p + n}$ 名学生的平均分是多少？`,
      o,
      [Q.of(a + b, 2), a, b],
      `Weight each mean by its class size: $\\frac{${p}(${a}) + ${n}(${b})}{${p + n}} = \\frac{${p * a + n * b}}{${p + n}} = ${o}$.`,
      `按人数加权：$\\frac{${p}(${a}) + ${n}(${b})}{${p + n}} = \\frac{${p * a + n * b}}{${p + n}} = ${o}$。`,
    );
  },
  "Finding Unknown Values From Center Measures": (rng, hard) => {
    const m = rng.int(60, 90);
    if (!hard) {
      const [d1, d2, d3] = [rng.int(1, 8), rng.int(1, 6), rng.int(1, 5)];
      const scores = [m + d1, m - d2, m + d3];
      const need = m - d1 + d2 - d3;
      return ask(
        rng,
        `A student scored $${list(scores)}$ on three tests. What score on a fourth test makes the mean exactly $${m}$?`,
        `一名学生三次测试得分为 $${list(scores)}$。第四次得多少分，平均分恰好为 $${m}$？`,
        need,
        [m, need + 4, m + d1],
        `The four scores must total $4(${m}) = ${4 * m}$. The first three total $${3 * m + d1 - d2 + d3}$, so the fourth is $${need}$.`,
        `四次总分应为 $4(${m}) = ${4 * m}$。前三次总分为 $${3 * m + d1 - d2 + d3}$，所以第四次为 $${need}$。`,
      );
    }
    const [d, e] = [rng.int(1, 6), rng.int(1, 5)];
    const xs = [m - d - e - 4, m - d - e, m - d];
    const [above, last] = [m + d + 3, m + d + 3 + e];
    return ask(
      rng,
      `The six numbers $${list(xs)}$, $x$, $${above}$, $${last}$ are in increasing order, and their median is $${m}$. What is the value of $x$?`,
      `六个数 $${list(xs)}$、$x$、$${above}$、$${last}$ 按从小到大排列，中位数为 $${m}$。$x$ 的值是多少？`,
      m + d,
      [m, m - d, 2 * m],
      `With six numbers, the median is the mean of the third and fourth: $\\frac{${m - d} + x}{2} = ${m}$. So $x = ${2 * m} - ${m - d} = ${m + d}$.`,
      `六个数的中位数是第三、四个数的平均数：$\\frac{${m - d} + x}{2} = ${m}$。所以 $x = ${2 * m} - ${m - d} = ${m + d}$。`,
    );
  },
  "Comparing Measures of Spread": (rng, hard) => {
    const [a, w, v] = [rng.int(5, 40), rng.int(8, 20), rng.int(22, 40)];
    if (!hard) {
      const A = [a, a + 2, a + 5, a + w];
      const B = [a + 1, a + 3, a + 7, a + v];
      return ask(
        rng,
        `Data set A is $${list(A)}$ and data set B is $${list(B)}$. How much greater is the range of B than the range of A?`,
        `数据集 A 为 $${list(A)}$，数据集 B 为 $${list(B)}$。B 的极差比 A 的极差大多少？`,
        v - 1 - w,
        [v - w, v - 1, w],
        `The range of A is $${w}$, and the range of B is $${a + v} - ${a + 1} = ${v - 1}$. The difference is $${v - 1 - w}$.`,
        `A 的极差为 $${w}$，B 的极差为 $${a + v} - ${a + 1} = ${v - 1}$。差为 $${v - 1 - w}$。`,
      );
    }
    const c = rng.int(30, 90);
    const d = rng.int(1, 3);
    const e = d + rng.int(8, 20);
    const tight = [c - d, c, c + d];
    const wide = [c - e, c, c + e];
    const firstTight = rng.int(0, 1) === 1;
    const [one, two] = firstTight ? [tight, wide] : [wide, tight];
    return words(
      rng,
      t(
        `Set X is $${list(one)}$ and set Y is $${list(two)}$. Which statement is true about their standard deviations?`,
        `集合 X 为 $${list(one)}$，集合 Y 为 $${list(two)}$。关于它们的标准差，哪个说法正确？`,
      ),
      firstTight
        ? t(`Y has the greater standard deviation.`, `Y 的标准差更大。`)
        : t(`X has the greater standard deviation.`, `X 的标准差更大。`),
      [
        firstTight
          ? t(`X has the greater standard deviation.`, `X 的标准差更大。`)
          : t(`Y has the greater standard deviation.`, `Y 的标准差更大。`),
        t(`They are equal because the means are equal.`, `相等，因为平均数相等。`),
        t(`They are equal because the medians are equal.`, `相等，因为中位数相等。`),
      ],
      t(
        `Both sets are centered at $${c}$, but standard deviation measures distance from the center, and one set's values lie farther from $${c}$.`,
        `两个集合都以 $${c}$ 为中心，但标准差度量离中心的距离，其中一个集合的值离 $${c}$ 更远。`,
      ),
    );
  },
  "Finding a Median From Frequencies": (rng, hard) => {
    const start = rng.int(1, 12);
    const values = [start, start + 1, start + 2, start + 3, start + 4];
    const freq = values.map(() => rng.int(1, 7));
    const total = freq.reduce((a, b) => a + b, 0);
    const wantOdd = !hard;
    if ((total % 2 === 1) !== wantOdd) freq[0] = (freq[0] ?? 0) + 1;
    const n = freq.reduce((a, b) => a + b, 0);
    const med = medianOf(expand(values, freq));
    const mode = values[freq.indexOf(Math.max(...freq))] ?? start;
    const tb = table("\\text{Goals}", "\\text{Games}", values, freq);
    const tbZh = table("\\text{进球}", "\\text{场数}", values, freq);
    return ask(
      rng,
      `A player's goals per game are summarized below. What is the median number of goals per game? ${tb}`,
      `下表汇总了一名球员每场的进球数。每场进球数的中位数是多少？${tbZh}`,
      med,
      [mode, start + 2, n],
      `There are $${n}$ games, so the median is at the middle of the list. Counting through the frequencies from the lowest value gives $${med.toLatex()}$.`,
      `共 $${n}$ 场，中位数在列表正中。从最小值起按频数累计，得 $${med.toLatex()}$。`,
    );
  },
  "Reading Frequency Distributions": (rng, hard) => {
    const start = rng.int(0, 4);
    const values = [start, start + 1, start + 2, start + 3];
    const freq = values.map(() => rng.int(2, 15));
    const n = freq.reduce((a, b) => a + b, 0);
    const [f2, f3] = [freq[2] ?? 0, freq[3] ?? 0];
    const tb = table("\\text{Books}", "\\text{Students}", values, freq);
    const tbZh = table("\\text{本数}", "\\text{学生数}", values, freq);
    if (!hard)
      return ask(
        rng,
        `The table shows how many books some students read. How many students read at least $${start + 2}$ books? ${tb}`,
        `下表给出一些学生读书的本数。读了至少 $${start + 2}$ 本的学生有多少人？${tbZh}`,
        f2 + f3,
        [f3, n, n - f3],
        `"At least" includes $${start + 2}$ and $${start + 3}$ books: $${f2} + ${f3} = ${f2 + f3}$.`,
        `"至少" 包括 $${start + 2}$ 本和 $${start + 3}$ 本：$${f2} + ${f3} = ${f2 + f3}$。`,
      );
    return ask(
      rng,
      `The table shows how many books some students read. What fraction of the students read fewer than $${start + 3}$ books? ${tb}`,
      `下表给出一些学生读书的本数。读书少于 $${start + 3}$ 本的学生占几分之几？${tbZh}`,
      Q.of(n - f3, n),
      [Q.of(f3, n), Q.of(n - f3 - f2, n), Q.of(n - f3, n + 1)],
      `All but the $${f3}$ students who read $${start + 3}$ books count, so the fraction is $\\frac{${n - f3}}{${n}}$.`,
      `除了读 $${start + 3}$ 本的 $${f3}$ 人都算，所以比例为 $\\frac{${n - f3}}{${n}}$。`,
    );
  },
  "Reading Category Tables": (rng, hard) => {
    const [a, b, c, d, e, f] = [rng.int(12, 60), rng.int(5, 40), rng.int(12, 60), rng.int(5, 40), rng.int(12, 60), rng.int(5, 40)];
    const en = grid(
      "",
      ["Adult", "Child"],
      [
        ["Friday", a, b],
        ["Saturday", c, d],
        ["Sunday", e, f],
      ],
    );
    const zh = grid(
      "",
      ["成人", "儿童"],
      [
        ["周五", a, b],
        ["周六", c, d],
        ["周日", e, f],
      ],
    );
    if (!hard)
      return ask(
        rng,
        `The table shows a museum's ticket sales. How many tickets of both kinds were sold on Friday and Sunday together? ${en}`,
        `下表是一家博物馆的门票销量。周五和周日两种票一共卖出多少张？${zh}`,
        a + b + e + f,
        [a + e, b + f, a + b + c + d + e + f],
        `Add the four entries in those two rows: $${a} + ${b} + ${e} + ${f} = ${a + b + e + f}$.`,
        `把这两行的四个数相加：$${a} + ${b} + ${e} + ${f} = ${a + b + e + f}$。`,
      );
    return ask(
      rng,
      `The table shows a museum's ticket sales. What fraction of all child tickets were sold on Saturday? ${en}`,
      `下表是一家博物馆的门票销量。所有儿童票中，周六卖出的占几分之几？${zh}`,
      Q.of(d, b + d + f),
      [Q.of(d, c + d), Q.of(d, a + b + c + d + e + f), Q.of(c, a + c + e)],
      `Saturday has $${d}$ child tickets out of $${b} + ${d} + ${f} = ${b + d + f}$ in all, so the fraction is $\\frac{${d}}{${b + d + f}}$.`,
      `周六有 $${d}$ 张儿童票，儿童票共 $${b} + ${d} + ${f} = ${b + d + f}$ 张，所以比例为 $\\frac{${d}}{${b + d + f}}$。`,
    );
  },
  "Reading Trend Graphs": (rng, hard) => {
    const ys = [0, 1, 2, 3, 4, 5, 6].map(() => 10 * rng.int(1, 9));
    const y = (x: number): number => {
      const i = Math.min(5, Math.floor(x));
      const [p, q] = [ys[i] ?? 0, ys[i + 1] ?? 0];
      return p + (q - p) * (x - i);
    };
    const figure = curveFigure(
      y,
      { x: [0, 6], y: [0, 100], dx: 1, dy: 10 },
      t(
        `A line graph of membership, with x from 0 to 6 years and y from 0 to 100 members.`,
        `会员人数折线图，x 从 0 到 6 年，y 从 0 到 100 人。`,
      ),
    );
    const i = rng.int(0, 2);
    const j = i + rng.int(2, 4);
    const [p, q] = [ys[i] ?? 0, ys[j] ?? 0];
    if (!hard)
      return ask(
        rng,
        `The graph shows a club's membership $x$ years after it opened. What is the change in membership, later minus earlier, from year $${i}$ to year $${j}$?`,
        `图中是一个俱乐部开业 $x$ 年后的会员人数。从第 $${i}$ 年到第 $${j}$ 年，人数变化（后减前）是多少？`,
        q - p,
        [p - q, p + q, q],
        `Read the graph: $${p}$ members at year $${i}$ and $${q}$ at year $${j}$. The change is $${q} - ${p} = ${q - p}$.`,
        `从图上读出：第 $${i}$ 年 $${p}$ 人，第 $${j}$ 年 $${q}$ 人。变化为 $${q} - ${p} = ${q - p}$。`,
        figure,
      );
    return ask(
      rng,
      `The graph shows a club's membership $x$ years after it opened. What is the average rate of change in members per year from year $${i}$ to year $${j}$?`,
      `图中是一个俱乐部开业 $x$ 年后的会员人数。从第 $${i}$ 年到第 $${j}$ 年，平均每年人数变化率是多少？`,
      Q.of(q - p, j - i),
      [Q.of(p - q, j - i), q - p, Q.of(q + p, j - i)],
      `Divide the change in members by the change in years: $\\frac{${q} - ${p}}{${j} - ${i}} = ${Q.of(q - p, j - i).toLatex()}$.`,
      `用人数变化除以年数变化：$\\frac{${q} - ${p}}{${j} - ${i}} = ${Q.of(q - p, j - i).toLatex()}$。`,
      figure,
    );
  },
  "Reasoning About Data Displays": (rng, hard) => {
    const [min, a, b, c, d] = [rng.int(1, 5), rng.int(1, 4), rng.int(1, 4), rng.int(1, 4), rng.int(1, 4)];
    const v = [2 * min, 2 * (min + a), 2 * (min + a + b), 2 * (min + a + b + c), 2 * (min + a + b + c + d)] as const;
    const figure = boxPlot(v, 0, 45, 5);
    const n = 4 * rng.int(5, 30);
    if (!hard)
      return ask(
        rng,
        `The box plot summarizes a set of daily high temperatures. What is the interquartile range?`,
        `箱线图汇总了一组每日最高气温。四分位距是多少？`,
        v[3] - v[1],
        [v[4] - v[0], v[3] - v[2], v[2]],
        `The interquartile range is the width of the box, from the first quartile to the third: $${v[3]} - ${v[1]} = ${v[3] - v[1]}$.`,
        `四分位距是箱子的宽度，从第一四分位数到第三四分位数：$${v[3]} - ${v[1]} = ${v[3] - v[1]}$。`,
        figure,
      );
    return ask(
      rng,
      `The box plot summarizes $${n}$ daily high temperatures. About how many of the temperatures are at or above $${v[1]}$?`,
      `箱线图汇总了 $${n}$ 个每日最高气温。约有多少个气温不低于 $${v[1]}$？`,
      (3 * n) / 4,
      [n / 4, n / 2, n],
      `About one quarter of the data lies below the first quartile, $${v[1]}$, so about three quarters are at or above it: $\\frac{3}{4}(${n}) = ${(3 * n) / 4}$.`,
      `约四分之一的数据低于第一四分位数 $${v[1]}$，所以约四分之三不低于它：$\\frac{3}{4}(${n}) = ${(3 * n) / 4}$。`,
      figure,
    );
  },
  "Finding a Simple Probability": (rng, hard) => {
    if (!hard) {
      const [r, b, g] = [rng.int(2, 15), rng.int(2, 15), rng.int(2, 15)];
      const n = r + b + g;
      return ask(
        rng,
        `A jar holds $${r}$ red, $${b}$ blue and $${g}$ green marbles. One is drawn at random. What is the probability that it is not blue?`,
        `一个罐子里有 $${r}$ 颗红球、$${b}$ 颗蓝球、$${g}$ 颗绿球。随机取一颗。它不是蓝球的概率是多少？`,
        Q.of(r + g, n),
        [Q.of(b, n), Q.of(r + g, b + 1), Q.of(r, n)],
        `There are $${n}$ marbles, and $${r} + ${g} = ${r + g}$ of them are not blue, so the probability is $${Q.of(r + g, n).toLatex()}$.`,
        `共 $${n}$ 颗球，其中 $${r} + ${g} = ${r + g}$ 颗不是蓝球，概率为 $${Q.of(r + g, n).toLatex()}$。`,
      );
    }
    const [n, k] = [rng.int(20, 60), rng.int(3, 7)];
    const m = Math.floor(n / k);
    return ask(
      rng,
      `An integer from $1$ to $${n}$ is chosen at random. What is the probability that it is a multiple of $${k}$?`,
      `从 $1$ 到 $${n}$ 随机选一个整数。它是 $${k}$ 的倍数的概率是多少？`,
      Q.of(m, n),
      [Q.of(k, n), Q.of(n - m, n), Q.of(m + 1, n)],
      `The multiples run $${k}$, $${2 * k}$, up to $${m * k}$, which is $${m}$ numbers out of $${n}$.`,
      `倍数为 $${k}$、$${2 * k}$，直到 $${m * k}$，共 $${n}$ 个数中的 $${m}$ 个。`,
    );
  },
  "Finding a Probability From a Two-Way Table": (rng, hard) => {
    const [a, b, c, d] = [rng.int(6, 40), rng.int(6, 40), rng.int(6, 40), rng.int(6, 40)];
    const T = a + b + c + d;
    const en = grid(
      "",
      ["Bus", "Car"],
      [
        ["Staff", a, b],
        ["Students", c, d],
      ],
    );
    const zh = grid(
      "",
      ["公交", "汽车"],
      [
        ["教职工", a, b],
        ["学生", c, d],
      ],
    );
    if (!hard)
      return ask(
        rng,
        `The table shows how people travel to a campus. One person is chosen at random. What is the probability that the person is a student who comes by car? ${en}`,
        `下表是人们到校园的交通方式。随机选一人。这个人是坐汽车来的学生的概率是多少？${zh}`,
        Q.of(d, T),
        [Q.of(d, c + d), Q.of(d, b + d), Q.of(c + d, T)],
        `Of all $${T}$ people, $${d}$ are in that cell, so the probability is $${Q.of(d, T).toLatex()}$.`,
        `全部 $${T}$ 人中，这一格有 $${d}$ 人，所以概率为 $${Q.of(d, T).toLatex()}$。`,
      );
    return ask(
      rng,
      `The table shows how people travel to a campus. One person is chosen at random. What is the probability that the person is a student or comes by car? ${en}`,
      `下表是人们到校园的交通方式。随机选一人。这个人是学生或坐汽车来的概率是多少？${zh}`,
      Q.of(b + c + d, T),
      [Q.of(b + c + 2 * d, T), Q.of(d, T), Q.of(c + d, T)],
      `Count everyone except the staff who come by bus: $${T} - ${a} = ${b + c + d}$. Counting both totals and adding would count the $${d}$ students by car twice.`,
      `除了坐公交的教职工都算：$${T} - ${a} = ${b + c + d}$。把两个合计直接相加，会把 $${d}$ 名坐汽车的学生算两次。`,
    );
  },
  "Finding a Conditional Probability From a Table": (rng, hard) => {
    const [a, b, c, d] = [rng.int(6, 40), rng.int(6, 40), rng.int(6, 40), rng.int(6, 40)];
    const T = a + b + c + d;
    const en = grid(
      "",
      ["Passed", "Failed"],
      [
        ["Morning", a, b],
        ["Evening", c, d],
      ],
    );
    const zh = grid(
      "",
      ["通过", "未通过"],
      [
        ["上午", a, b],
        ["晚上", c, d],
      ],
    );
    if (!hard)
      return ask(
        rng,
        `The table shows the results of a road test. If a driver who took it in the morning is chosen at random, what is the probability that the driver passed? ${en}`,
        `下表是路考结果。随机选一名上午参加的司机，这名司机通过的概率是多少？${zh}`,
        Q.of(a, a + b),
        [Q.of(a, T), Q.of(a, a + c), Q.of(a + b, T)],
        `Only the morning row counts: $${a}$ of its $${a + b}$ drivers passed, which is $${Q.of(a, a + b).toLatex()}$.`,
        `只看上午一行：$${a + b}$ 人中有 $${a}$ 人通过，即 $${Q.of(a, a + b).toLatex()}$。`,
      );
    return ask(
      rng,
      `The table shows the results of a road test. If a driver who failed is chosen at random, what is the probability that the driver took it in the evening? ${en}`,
      `下表是路考结果。随机选一名未通过的司机，这名司机是晚上参加的概率是多少？${zh}`,
      Q.of(d, b + d),
      [Q.of(d, c + d), Q.of(d, T), Q.of(c + d, T)],
      `Only the failed column counts: $${d}$ of its $${b + d}$ drivers took it in the evening, which is $${Q.of(d, b + d).toLatex()}$.`,
      `只看未通过一列：$${b + d}$ 人中有 $${d}$ 人是晚上参加的，即 $${Q.of(d, b + d).toLatex()}$。`,
    );
  },
  "Finding a Conditional Probability": (rng, hard) => {
    if (!hard) {
      const [n, x] = [rng.int(20, 45), rng.int(5, 18)];
      const total = n + rng.int(15, 50);
      return ask(
        rng,
        `Of the $${total}$ members of a club, $${n}$ play chess, and $${x}$ of the chess players also play go. If a chess player is chosen at random, what is the probability that this person also plays go?`,
        `一个俱乐部 $${total}$ 名成员中，$${n}$ 人下国际象棋，其中 $${x}$ 人也下围棋。随机选一名下国际象棋的人，这个人也下围棋的概率是多少？`,
        Q.of(x, n),
        [Q.of(x, total), Q.of(n, total), Q.of(n - x, n)],
        `The condition limits the group to the $${n}$ chess players, so the probability is $${Q.of(x, n).toLatex()}$.`,
        `条件把范围限制在 $${n}$ 名下国际象棋的人，所以概率为 $${Q.of(x, n).toLatex()}$。`,
      );
    }
    const [r, b] = [rng.int(3, 12), rng.int(3, 12)];
    return ask(
      rng,
      `A box has $${r}$ red pens and $${b}$ black pens. Two pens are taken one at a time, without replacement. If the first is red, what is the probability that the second is also red?`,
      `盒子里有 $${r}$ 支红笔和 $${b}$ 支黑笔。不放回地依次取两支。若第一支是红笔，第二支也是红笔的概率是多少？`,
      Q.of(r - 1, r + b - 1),
      [Q.of(r, r + b), Q.of(r - 1, r + b), Q.of(b, r + b - 1)],
      `After one red pen is gone, $${r - 1}$ red pens remain among $${r + b - 1}$ pens.`,
      `取走一支红笔后，还剩 $${r + b - 1}$ 支笔，其中 $${r - 1}$ 支红笔。`,
    );
  },
  "Estimating a Population From a Sample Proportion": (rng, hard) => {
    const [n, k] = [10 * rng.int(4, 20), rng.int(5, 40)];
    const c = 10 * rng.int(2, 30);
    if (!hard)
      return ask(
        rng,
        `In a random sample of $${n}$ light bulbs from a factory's output, $${k}$ are faulty. Based on the sample, about how many of $${n * c}$ bulbs are faulty?`,
        `从工厂产品中随机抽取 $${n}$ 个灯泡，$${k}$ 个有问题。据此估计，$${n * c}$ 个灯泡中约有多少个有问题？`,
        k * c,
        [k, (n - k) * c, k + n * c],
        `The whole batch is $${c}$ times the sample, so the estimate is $${c}(${k}) = ${k * c}$.`,
        `整批是样本的 $${c}$ 倍，所以估计为 $${c}(${k}) = ${k * c}$。`,
      );
    const [m, f] = [rng.int(3, 15), rng.int(3, 12)];
    const tagged = m * f * 5;
    const caught = m * rng.int(4, 12);
    return ask(
      rng,
      `Biologists tag $${tagged}$ fish in a lake and release them. Later they catch $${caught}$ fish and find $${m}$ tagged. About how many fish are in the lake?`,
      `生物学家给湖中 $${tagged}$ 条鱼做标记后放回。之后捕到 $${caught}$ 条，其中 $${m}$ 条有标记。湖中约有多少条鱼？`,
      (tagged * caught) / m,
      [tagged + caught, tagged * m, tagged + caught - m],
      `The tagged share of the catch estimates the tagged share of the lake: $\\frac{${m}}{${caught}} = \\frac{${tagged}}{N}$, so $N = ${(tagged * caught) / m}$.`,
      `捕获中有标记的比例可估计湖中的比例：$\\frac{${m}}{${caught}} = \\frac{${tagged}}{N}$，所以 $N = ${(tagged * caught) / m}$。`,
    );
  },
  "Judging Evidence From a Sample": (rng, hard) => {
    const n = 10 * rng.int(6, 40);
    const p = 5 * rng.int(4, 17);
    if (!hard)
      return words(
        rng,
        t(
          `A school chooses $${n}$ of its students at random, and $${p}\\%$ of them say they favor a later start time. Which conclusion is best supported?`,
          `一所学校随机选取 $${n}$ 名学生，其中 $${p}\\%$ 表示赞成晚些上课。哪个结论最有依据？`,
        ),
        t(`About $${p}\\%$ of the school's students favor a later start.`, `该校约 $${p}\\%$ 的学生赞成晚些上课。`),
        [
          t(`Exactly $${p}\\%$ of the school's students favor a later start.`, `该校恰好 $${p}\\%$ 的学生赞成晚些上课。`),
          t(`About $${p}\\%$ of students in the country favor a later start.`, `全国约 $${p}\\%$ 的学生赞成晚些上课。`),
          t(`A later start would improve the students' grades.`, `晚些上课会提高学生的成绩。`),
        ],
        t(
          `A random sample supports an estimate about the group it was drawn from, with some uncertainty. It says nothing exact, nothing about other groups, and nothing about cause.`,
          `随机样本支持对其来源总体的估计，并带有不确定性。它不能给出精确值，不能推广到其他总体，也不能说明因果。`,
        ),
      );
    const place = rng.pick([
      [`at a public library`, `在公共图书馆`, `how often people read`, `人们多久读一次书`],
      [`at a gym`, `在健身房`, `how often people exercise`, `人们多久锻炼一次`],
      [`at a train station`, `在火车站`, `how often people take trains`, `人们多久坐一次火车`],
      [`at a coffee shop`, `在咖啡店`, `how much coffee people drink`, `人们喝多少咖啡`],
    ] as const);
    const [where, whereZh, what, whatZh] = place;
    return words(
      rng,
      t(
        `A reporter asks $${n}$ people ${where} about ${what}, to describe the whole town. Why might the results be unreliable?`,
        `一名记者${whereZh}询问 $${n}$ 人关于${whatZh}的情况，以描述全镇。结果为什么可能不可靠？`,
      ),
      t(`People at that place are not representative of the town.`, `那里的人不能代表全镇。`),
      [
        t(`The sample is too large to be useful.`, `样本太大，没有用处。`),
        t(`The question is about a habit, which cannot be measured.`, `问题涉及习惯，而习惯无法测量。`),
        t(`Every survey of a town gives unreliable results.`, `对城镇的任何调查结果都不可靠。`),
      ],
      t(
        `People found at that place are likely to differ on this very habit, so the sample is biased no matter how large it is.`,
        `在那里遇到的人很可能恰恰在这一习惯上与众不同，所以无论样本多大都有偏差。`,
      ),
    );
  },
  "Identifying a Model Type": (rng, hard) => {
    const [linear, exponential, quadratic, none]: readonly Text[] = [
      t(`Linear`, `线性`),
      t(`Exponential`, `指数`),
      t(`Quadratic`, `二次`),
      t(`Constant`, `常数`),
    ];
    const others = (x: Text): Text[] => [linear, exponential, quadratic, none].filter((o): o is Text => o !== x && o !== undefined);
    if (!hard) {
      const [a, b] = [rng.int(1, 9), rng.int(2, 5)];
      const kind = rng.int(0, 2);
      const xs = [0, 1, 2, 3, 4];
      const ys = xs.map((v) => (kind === 0 ? a + (b + 1) * v : kind === 1 ? a * b ** v : a + b * v * v));
      const correct = (kind === 0 ? linear : kind === 1 ? exponential : quadratic) as Text;
      const why =
        kind === 0
          ? t(
              `The $y$-values rise by the same amount, $${b + 1}$, each step, so the model is linear.`,
              `$y$ 值每步增加相同的量 $${b + 1}$，所以是线性模型。`,
            )
          : kind === 1
            ? t(
                `Each $y$-value is $${b}$ times the one before, so the model is exponential.`,
                `每个 $y$ 值是前一个的 $${b}$ 倍，所以是指数模型。`,
              )
            : t(
                `The differences of the $y$-values rise by the same amount, $${2 * b}$, so the model is quadratic.`,
                `$y$ 值之差每步增加相同的量 $${2 * b}$，所以是二次模型。`,
              );
      return words(
        rng,
        t(`Which type of function best fits the table? ${table("x", "y", xs, ys)}`, `哪种函数最符合下表？${table("x", "y", xs, ys)}`),
        correct,
        others(correct),
        why,
      );
    }
    const [v, r, d] = [100 * rng.int(2, 50), 5 * rng.int(1, 8), 10 * rng.int(1, 9)];
    const decay = rng.int(0, 1) === 1;
    const correct = (decay ? exponential : linear) as Text;
    return words(
      rng,
      decay
        ? t(
            `A car worth $\\$${v * 10}$ loses $${r}\\%$ of its value each year. Which type of function best models its value over time?`,
            `一辆价值 $\\$${v * 10}$ 的汽车每年贬值 $${r}\\%$。哪种函数最适合描述它的价值随时间的变化？`,
          )
        : t(
            `A savings jar holds $\\$${v}$, and $\\$${d}$ is added each month. Which type of function best models the amount over time?`,
            `一个储蓄罐里有 $\\$${v}$，每月存入 $\\$${d}$。哪种函数最适合描述金额随时间的变化？`,
          ),
      correct,
      others(correct),
      decay
        ? t(
            `Losing the same percent each year multiplies the value by the same factor, $${(100 - r) / 100}$, so the model is exponential.`,
            `每年减少相同的百分比，就是乘以相同的因子 $${(100 - r) / 100}$，所以是指数模型。`,
          )
        : t(
            `Adding the same amount each month gives a constant rate of change, so the model is linear.`,
            `每月增加相同的量，变化率恒定，所以是线性模型。`,
          ),
    );
  },
  "Fitting a Linear Model to Data": (rng, hard) => {
    const [m, b] = [rng.int(2, 6), 10 * rng.int(1, 2)];
    const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const points = xs.map((x): [number, number] => [x, m * x + b + rng.int(-3, 3)]);
    const figure = dotsFigure(
      points,
      { x: [0, 10], y: [0, 80], dx: 1, dy: 10 },
      t(
        `A scatterplot of data on a grid, with a line of best fit that rises to the right.`,
        `网格上的散点图，有一条向右上升的最佳拟合线。`,
      ),
      [
        [0, b],
        [10, b + 10 * m],
      ],
    );
    if (!hard)
      return ask(
        rng,
        `Which equation best describes the line of best fit shown?`,
        `哪个等式最能描述图中的最佳拟合线？`,
        `y = ${lin(m, b)}`,
        [`y = ${lin(-m, b + 10 * m)}`, `y = ${lin(10 + m, m)}`, `y = ${lin(m + 7, 0)}`],
        `The line crosses the $y$-axis at $${b}$ and rises to $${b + 10 * m}$ at $x = 10$, so its slope is $\\frac{${10 * m}}{10} = ${m}$.`,
        `直线与 $y$ 轴交于 $${b}$，在 $x = 10$ 时升到 $${b + 10 * m}$，所以斜率为 $\\frac{${10 * m}}{10} = ${m}$。`,
        figure,
      );
    const x = rng.int(11, 30);
    return ask(
      rng,
      `Based on the line of best fit shown, which is the best prediction of $y$ when $x = ${x}$?`,
      `根据图中的最佳拟合线，$x = ${x}$ 时 $y$ 的最佳预测是多少？`,
      m * x + b,
      [m * x, (m + 1) * x + b, x + b],
      `The line has slope $${m}$ and $y$-intercept $${b}$, so $y = ${m}(${x}) + ${b} = ${m * x + b}$.`,
      `直线斜率为 $${m}$，$y$ 轴截距为 $${b}$，所以 $y = ${m}(${x}) + ${b} = ${m * x + b}$。`,
      figure,
    );
  },
  "Using a Linear Model": (rng, hard) => {
    const [m, b, x] = [rng.int(3, 25), rng.int(10, 90), rng.int(2, 20)];
    if (!hard)
      return ask(
        rng,
        `A plumber charges $C = ${m}h + ${b}$ dollars for $h$ hours of work. What is the charge, in dollars, for $${x}$ hours?`,
        `一名水管工工作 $h$ 小时收费 $C = ${m}h + ${b}$ 美元。工作 $${x}$ 小时收费多少美元？`,
        m * x + b,
        [m * x, (m + b) * x, m + b + x],
        `Substitute: $${m}(${x}) + ${b} = ${m * x + b}$.`,
        `代入：$${m}(${x}) + ${b} = ${m * x + b}$。`,
      );
    return ask(
      rng,
      `A plumber charges $C = ${m}h + ${b}$ dollars for $h$ hours of work. A bill comes to $\\$${m * x + b}$. How many hours did the plumber work?`,
      `一名水管工工作 $h$ 小时收费 $C = ${m}h + ${b}$ 美元。账单是 $\\$${m * x + b}$。水管工工作了多少小时？`,
      x,
      [x + 2, m * x, x + b],
      `Solve $${m}h + ${b} = ${m * x + b}$: first $${m}h = ${m * x}$, then $h = ${x}$.`,
      `解 $${m}h + ${b} = ${m * x + b}$：先得 $${m}h = ${m * x}$，再得 $h = ${x}$。`,
    );
  },
  "Partitioning a Total in a Given Ratio": (rng, hard) => {
    const [a, b, c, k] = [rng.int(1, 6), rng.pick([7, 11, 13]), rng.int(2, 6), rng.int(3, 25)];
    if (!hard)
      return ask(
        rng,
        `Two partners split a profit of $\\$${(a + b) * k * 10}$ in the ratio $${a}:${b}$. How many dollars is the larger share?`,
        `两位合伙人按 $${a}:${b}$ 分配 $\\$${(a + b) * k * 10}$ 的利润。较大的一份是多少美元？`,
        b * k * 10,
        [a * k * 10, (a + b) * k * 5, b * k],
        `There are $${a + b}$ equal parts of $\\$${k * 10}$ each, and the larger share has $${b}$ of them: $${b * k * 10}$.`,
        `共 $${a + b}$ 等份，每份 $\\$${k * 10}$，较大的一份占 $${b}$ 份：$${b * k * 10}$。`,
      );
    const T = (a + b + c) * k;
    return ask(
      rng,
      `A wire $${T}$ inches long is cut into three pieces in the ratio $${a}:${b}:${c}$. How many inches longer is the longest piece than the shortest?`,
      `一根 $${T}$ 英寸的金属丝按 $${a}:${b}:${c}$ 剪成三段。最长的一段比最短的一段长多少英寸？`,
      (b - Math.min(a, c)) * k,
      [b * k, Math.min(a, c) * k, (b - Math.min(a, c)) * (k + 1)],
      `Each part is $${T} \\div ${a + b + c} = ${k}$ inches. The longest piece has $${b}$ parts and the shortest $${Math.min(a, c)}$, so the difference is $${(b - Math.min(a, c)) * k}$.`,
      `每份为 $${T} \\div ${a + b + c} = ${k}$ 英寸。最长的一段 $${b}$ 份，最短的一段 $${Math.min(a, c)}$ 份，差为 $${(b - Math.min(a, c)) * k}$。`,
    );
  },
  "Composing Chained Ratios": (rng, hard) => {
    const [p, s, q] = [rng.pick([2, 3, 4, 5, 7]), rng.pick([3, 5, 7, 9, 11, 13]), rng.int(2, 15)];
    if (!hard) {
      const [e, f] = p === s ? [p, s + 2] : [p, s];
      return ask(
        rng,
        `The ratio of $a$ to $b$ is $${e}:${q}$, and the ratio of $b$ to $c$ is $${q}:${f}$. What is the ratio of $a$ to $c$?`,
        `$a$ 与 $b$ 之比为 $${e}:${q}$，$b$ 与 $c$ 之比为 $${q}:${f}$。$a$ 与 $c$ 之比是多少？`,
        `${e}:${f}`,
        [`${f}:${e}`, `${e + q}:${f + q}`, `${e * q}:${f + q + 1}`],
        `Both ratios use the same amount for $b$, so $a$ to $c$ can be read directly: $${e}:${f}$.`,
        `两个比中 $b$ 取相同的份数，所以 $a$ 与 $c$ 之比可直接读出：$${e}:${f}$。`,
      );
    }
    const [r, k] = [rng.int(2, 5), rng.int(2, 6)];
    const [u, v] = [p * r, q * s];
    const c = v * k;
    return ask(
      rng,
      `In a garden, the ratio of roses to tulips is $${p}:${q}$, and the ratio of tulips to lilies is $${r}:${s}$. If there are $${c}$ lilies, how many roses are there?`,
      `一个花园里，玫瑰与郁金香之比为 $${p}:${q}$，郁金香与百合之比为 $${r}:${s}$。若有 $${c}$ 株百合，玫瑰有多少株？`,
      u * k,
      [p * k, u * k + c, c - u],
      `Multiply the ratios: roses to lilies is $${p}(${r}):${q}(${s}) = ${u}:${v}$. Since $${c} = ${k}(${v})$, there are $${k}(${u}) = ${u * k}$ roses.`,
      `两比相乘：玫瑰与百合之比为 $${p}(${r}):${q}(${s}) = ${u}:${v}$。因为 $${c} = ${k}(${v})$，所以玫瑰有 $${k}(${u}) = ${u * k}$ 株。`,
    );
  },
  "Applying Proportions": (rng, hard) => {
    const [a, u, b] = [rng.int(2, 9), rng.int(2, 15), rng.int(10, 30)];
    if (!hard)
      return ask(
        rng,
        `If $${a}$ notebooks cost $\\$${a * u}$, how many dollars do $${b}$ notebooks cost at the same price each?`,
        `如果 $${a}$ 本笔记本要 $\\$${a * u}$，单价相同时 $${b}$ 本要多少美元？`,
        b * u,
        [a * u + b - a, b * a, (b - a) * u],
        `One notebook costs $${a * u} \\div ${a} = ${u}$ dollars, so $${b}$ of them cost $${b * u}$.`,
        `一本 $${a * u} \\div ${a} = ${u}$ 美元，所以 $${b}$ 本要 $${b * u}$。`,
      );
    const [w, m, d] = [a * 2, a * rng.int(3, 6), u * rng.int(2, 4)];
    return ask(
      rng,
      `It takes $${w}$ painters $${d}$ days to paint a building. If all painters work at the same rate, how many days would $${m}$ painters take?`,
      `$${w}$ 名油漆工用 $${d}$ 天刷完一栋楼。若工作效率相同，$${m}$ 名油漆工要多少天？`,
      Q.of(w * d, m),
      [Q.of(m * d, w), d, Q.of(d + w, m)],
      `The job is $${w}(${d}) = ${w * d}$ painter-days. More painters take fewer days: $${w * d} \\div ${m} = ${Q.of(w * d, m).toLatex()}$.`,
      `工作量为 $${w}(${d}) = ${w * d}$ 人天。人越多天数越少：$${w * d} \\div ${m} = ${Q.of(w * d, m).toLatex()}$。`,
    );
  },
  "Finding a Unit Rate": (rng, hard) => {
    const [n, r, m] = [rng.int(3, 24), rng.int(2, 30), rng.int(3, 24)];
    if (!hard)
      return ask(
        rng,
        `A printer prints $${n * r}$ pages in $${n}$ minutes. How many pages per minute is that?`,
        `一台打印机 $${n}$ 分钟打印 $${n * r}$ 页。每分钟打印多少页？`,
        r,
        [n * r - n, n, r + n],
        `Divide pages by minutes: $${n * r} \\div ${n} = ${r}$.`,
        `页数除以分钟数：$${n * r} \\div ${n} = ${r}$。`,
      );
    const s = r + rng.int(1, 9);
    return ask(
      rng,
      `Printer A prints $${n * r}$ pages in $${n}$ minutes, and Printer B prints $${m * s}$ pages in $${m}$ minutes. How many more pages per minute does Printer B print?`,
      `打印机 A $${n}$ 分钟打印 $${n * r}$ 页，打印机 B $${m}$ 分钟打印 $${m * s}$ 页。打印机 B 每分钟多打印多少页？`,
      s - r,
      [m * s - n * r, s, r],
      `The rates are $${r}$ and $${s}$ pages per minute, which differ by $${s - r}$.`,
      `速率分别为每分钟 $${r}$ 页和 $${s}$ 页，相差 $${s - r}$。`,
    );
  },
  "Finding Distance at Constant Speed": (rng, hard) => {
    if (!hard) {
      const [s, h] = [2 * rng.int(10, 40), rng.int(1, 6)];
      return ask(
        rng,
        `A train travels at a constant $${s}$ miles per hour for $${h}$ hours and $30$ minutes. How many miles does it travel?`,
        `一列火车以 $${s}$ 英里/小时的恒定速度行驶 $${h}$ 小时 $30$ 分钟。它行驶了多少英里？`,
        s * h + s / 2,
        [s * h, s * (h + 1), s * h + 30],
        `Thirty minutes is half an hour, so the time is $${h}.5$ hours, and the distance is $${s}(${h}.5) = ${s * h + s / 2}$.`,
        `$30$ 分钟是半小时，所以时间为 $${h}.5$ 小时，距离为 $${s}(${h}.5) = ${s * h + s / 2}$。`,
      );
    }
    const [s1, s2, avg] = rng.pick([
      [30, 60, 40],
      [40, 60, 48],
      [20, 30, 24],
      [30, 45, 36],
      [45, 90, 60],
      [60, 90, 72],
      [36, 45, 40],
      [40, 120, 60],
    ] as const);
    const lcm = (s1 * s2) / gcd(s1, s2);
    const d = lcm * rng.int(1, 5);
    return ask(
      rng,
      `A driver goes $${d}$ miles at $${s1}$ miles per hour and returns the same way at $${s2}$ miles per hour. What is the average speed for the whole trip, in miles per hour?`,
      `一名司机以 $${s1}$ 英里/小时行驶 $${d}$ 英里，再沿原路以 $${s2}$ 英里/小时返回。全程平均速度是多少英里/小时？`,
      avg,
      [Q.of(s1 + s2, 2), s1, s2],
      `The trip takes $${d / s1} + ${d / s2} = ${d / s1 + d / s2}$ hours for $${2 * d}$ miles, and $${2 * d} \\div ${d / s1 + d / s2} = ${avg}$. It is not the mean of the two speeds, since more time is spent at the slower speed.`,
      `全程 $${2 * d}$ 英里，用时 $${d / s1} + ${d / s2} = ${d / s1 + d / s2}$ 小时，$${2 * d} \\div ${d / s1 + d / s2} = ${avg}$。这不是两个速度的平均数，因为低速行驶的时间更长。`,
    );
  },
  "Finding a Percent of a Number": (rng, hard) => {
    const [p, k] = [5 * rng.int(1, 19), rng.int(2, 40)];
    if (!hard)
      return ask(
        rng,
        `What is $${p}\\%$ of $${20 * k}$?`,
        `$${20 * k}$ 的 $${p}\\%$ 是多少？`,
        (p * k) / 5,
        [20 * k - (p * k) / 5, p + 20 * k, p * k],
        `Convert the percent to a fraction of $100$: $\\frac{${p}}{100}(${20 * k}) = ${(p * k) / 5}$.`,
        `把百分数化成分母为 $100$ 的分数：$\\frac{${p}}{100}(${20 * k}) = ${(p * k) / 5}$。`,
      );
    const q = 5 * rng.int(1, 19);
    const x = 20 * k;
    return ask(
      rng,
      `If $${p}\\%$ of a number is $${(p * k) / 5}$, what is $${q}\\%$ of the number?`,
      `若一个数的 $${p}\\%$ 是 $${(p * k) / 5}$，这个数的 $${q}\\%$ 是多少？`,
      (q * k) / 5,
      [x, (p * k) / 5 + q - p, (p * k) / 5 + q],
      `The number is $${(p * k) / 5} \\div ${Q.of(p, 100).toLatex()} = ${x}$, and $${q}\\%$ of it is $${(q * k) / 5}$.`,
      `这个数为 $${(p * k) / 5} \\div ${Q.of(p, 100).toLatex()} = ${x}$，它的 $${q}\\%$ 是 $${(q * k) / 5}$。`,
    );
  },
  "Expressing a Ratio as a Percent": (rng, hard) => {
    if (!hard) {
      const [whole, part] = [100 * rng.pick([1, 2, 4, 5]), rng.int(1, 19)];
      const made = (whole * 5 * part) / 100;
      return ask(
        rng,
        `A player made $${made}$ of $${whole}$ free throws. What percent of the free throws did the player make?`,
        `一名球员 $${whole}$ 次罚球投中 $${made}$ 次。投中率是百分之多少？`,
        5 * part,
        [100 - 5 * part, made, Q.of(whole, made)],
        `Divide the part by the whole and multiply by $100$: $\\frac{${made}}{${whole}} \\cdot 100 = ${5 * part}$.`,
        `用部分除以整体再乘以 $100$：$\\frac{${made}}{${whole}} \\cdot 100 = ${5 * part}$。`,
      );
    }
    const k = 4 * rng.int(1, 12);
    const extra = 5 * rng.int(1, 11);
    const big = (k * (100 + extra)) / 5;
    const small = 20 * k;
    return ask(
      rng,
      `Store A sold $${big}$ phones and Store B sold $${small}$ phones. Store A's sales are what percent of Store B's sales?`,
      `商店 A 卖出 $${big}$ 部手机，商店 B 卖出 $${small}$ 部。A 的销量是 B 的百分之多少？`,
      100 + extra,
      [extra, Q.of(small * 100, big), 100 - extra],
      `Compare A with B, so B is the whole: $\\frac{${big}}{${small}} \\cdot 100 = ${100 + extra}$. That is more than $100$ because A sold more.`,
      `以 B 为整体：$\\frac{${big}}{${small}} \\cdot 100 = ${100 + extra}$。因为 A 卖得更多，所以超过 $100$。`,
    );
  },
  "Finding a Total From a Percent": (rng, hard) => {
    const [p, k] = [5 * rng.int(1, 19), rng.int(2, 40)];
    const total = 20 * k;
    const part = (p * k) / 5;
    if (!hard)
      return ask(
        rng,
        `$${part}$ students, which is $${p}\\%$ of a school's seniors, went on a trip. How many seniors are there?`,
        `$${part}$ 名学生去旅行，占一所学校毕业生的 $${p}\\%$。毕业生有多少人？`,
        total,
        [part + p, total - part, part + total],
        `Solve $\\frac{${p}}{100}T = ${part}$: dividing gives $T = ${total}$.`,
        `解 $\\frac{${p}}{100}T = ${part}$：相除得 $T = ${total}$。`,
      );
    const paid = total - part;
    return ask(
      rng,
      `After a $${p}\\%$ discount, a coat costs $\\$${paid}$. What was the original price, in dollars?`,
      `打折 $${p}\\%$ 后，一件外套售价 $\\$${paid}$。原价是多少美元？`,
      total,
      [paid + p, paid + part + 1, 2 * paid],
      `The sale price is $${100 - p}\\%$ of the original, so the original is $${paid} \\div ${Q.of(100 - p, 100).toLatex()} = ${total}$. Adding $${p}\\%$ of $${paid}$ would use the wrong whole.`,
      `售价是原价的 $${100 - p}\\%$，所以原价为 $${paid} \\div ${Q.of(100 - p, 100).toLatex()} = ${total}$。在 $${paid}$ 上加 $${p}\\%$ 用错了整体。`,
    );
  },
  "Applying a Percent Change": (rng, hard) => {
    const [p, k] = [5 * rng.int(1, 12), 20 * rng.int(1, 40)];
    if (!hard)
      return ask(
        rng,
        `A bill of $\\$${k}$ has a $${p}\\%$ tip added. What is the total, in dollars?`,
        `一张 $\\$${k}$ 的账单加 $${p}\\%$ 小费。总额是多少美元？`,
        k + (k * p) / 100,
        [k + p, (k * p) / 100, k - (k * p) / 100],
        `The tip is $\\frac{${p}}{100}(${k}) = ${(k * p) / 100}$, so the total is $${k + (k * p) / 100}$.`,
        `小费为 $\\frac{${p}}{100}(${k}) = ${(k * p) / 100}$，所以总额为 $${k + (k * p) / 100}$。`,
      );
    const drop = rng.int(0, 1) === 1;
    const after = drop ? k - (k * p) / 100 : k + (k * p) / 100;
    const change = (k * p) / 100;
    const word = drop ? "decrease" : "increase";
    const wordZh = drop ? "减少" : "增加";
    return ask(
      rng,
      `A town's population changes from $${k * 10}$ to $${after * 10}$. What is the percent ${word}?`,
      `一个镇的人口从 $${k * 10}$ 变为 $${after * 10}$。${wordZh}的百分比是多少？`,
      p,
      [Q.of(change * 100, after), change, 100 - p],
      `Compare the change with the starting value: $\\frac{${change * 10}}{${k * 10}} \\cdot 100 = ${p}$.`,
      `用变化量比较起始值：$\\frac{${change * 10}}{${k * 10}} \\cdot 100 = ${p}$。`,
    );
  },
  "Taking Successive Percents": (rng, hard) => {
    const [p, q, n] = [10 * rng.int(1, 9), 10 * rng.int(1, 9), 100 * rng.int(1, 30)];
    if (!hard)
      return ask(
        rng,
        `What is $${p}\\%$ of $${q}\\%$ of $${n}$?`,
        `$${n}$ 的 $${q}\\%$ 的 $${p}\\%$ 是多少？`,
        (p * q * n) / 10000,
        [((p + q) * n) / 100, (p * n) / 100, (q * n) / 100],
        `Multiply in turn: $${q}\\%$ of $${n}$ is $${(q * n) / 100}$, and $${p}\\%$ of that is $${(p * q * n) / 10000}$.`,
        `依次相乘：$${n}$ 的 $${q}\\%$ 是 $${(q * n) / 100}$，其 $${p}\\%$ 是 $${(p * q * n) / 10000}$。`,
      );
    return ask(
      rng,
      `In a town of $${n}$ adults, $${q}\\%$ own a car, and $${p}\\%$ of the car owners drive to work. How many adults own a car but do not drive to work?`,
      `一个镇有 $${n}$ 名成年人，其中 $${q}\\%$ 有车，有车者中 $${p}\\%$ 开车上班。有车但不开车上班的成年人有多少？`,
      ((100 - p) * q * n) / 10000,
      [(p * q * n) / 10000, ((100 - p) * n) / 100, ((100 - q) * n) / 100],
      `There are $${(q * n) / 100}$ car owners, and $${100 - p}\\%$ of them do not drive to work: $${((100 - p) * q * n) / 10000}$.`,
      `有车者 $${(q * n) / 100}$ 人，其中 $${100 - p}\\%$ 不开车上班：$${((100 - p) * q * n) / 10000}$。`,
    );
  },
  "Applying Successive Percent Changes": (rng, hard) => {
    const [p, q, n] = [10 * rng.int(1, 9), 10 * rng.int(1, 9), 100 * rng.int(1, 20)];
    const after = ((100 + p) * (100 - q) * n) / 10000;
    if (!hard)
      return ask(
        rng,
        `A stock worth $\\$${n}$ rises $${p}\\%$ one month and falls $${q}\\%$ the next. What is its value then, in dollars?`,
        `一只价值 $\\$${n}$ 的股票一个月涨 $${p}\\%$，下个月跌 $${q}\\%$。此时价值多少美元？`,
        after,
        [((100 + p - q) * n) / 100, ((100 + p) * n) / 100, ((100 - q) * n) / 100],
        `Apply one factor per month: $${n}(${(100 + p) / 100})(${(100 - q) / 100}) = ${after}$. The second percent applies to the new value.`,
        `每月乘一个因子：$${n}(${(100 + p) / 100})(${(100 - q) / 100}) = ${after}$。第二个百分比作用于新值。`,
      );
    return ask(
      rng,
      `A price is raised $${p}\\%$ and the new price is then cut $${q}\\%$. The final price is what percent of the original price?`,
      `一个价格先涨 $${p}\\%$，新价格再降 $${q}\\%$。最终价格是原价的百分之多少？`,
      ((100 + p) * (100 - q)) / 100,
      [100 + p - q, 100 - q, 100 + p],
      `The factors multiply: $(${(100 + p) / 100})(${(100 - q) / 100}) = ${((100 + p) * (100 - q)) / 10000}$, which is $${((100 + p) * (100 - q)) / 100}\\%$.`,
      `因子相乘：$(${(100 + p) / 100})(${(100 - q) / 100}) = ${((100 + p) * (100 - q)) / 10000}$，即 $${((100 + p) * (100 - q)) / 100}\\%$。`,
    );
  },
  "Computing With Mixed Units": (rng, hard) => {
    const [a, b, c, d] = [rng.int(2, 9), rng.int(1, 11), rng.int(2, 9), rng.int(1, 11)];
    if (!hard)
      return ask(
        rng,
        `Two boards are $${a}$ feet $${b}$ inches and $${c}$ feet $${d}$ inches long. What is their total length, in inches? ($1$ foot $= 12$ inches)`,
        `两块木板长 $${a}$ 英尺 $${b}$ 英寸和 $${c}$ 英尺 $${d}$ 英寸。总长多少英寸？（$1$ 英尺 $= 12$ 英寸）`,
        12 * (a + c) + b + d,
        [12 * (a + c), 10 * (a + c) + b + d, a + b + c + d],
        `Convert the feet: $12(${a}) + ${b} = ${12 * a + b}$ and $12(${c}) + ${d} = ${12 * c + d}$. Their sum is $${12 * (a + c) + b + d}$.`,
        `换算英尺：$12(${a}) + ${b} = ${12 * a + b}$，$12(${c}) + ${d} = ${12 * c + d}$。和为 $${12 * (a + c) + b + d}$。`,
      );
    const [h, m, n] = [rng.int(1, 5), rng.pick([10, 15, 20, 25, 35, 40, 45, 50]), rng.int(2, 9)];
    return ask(
      rng,
      `A worker's shift lasts $${h}$ hours $${m}$ minutes. What is the total time for $${n}$ shifts, in minutes?`,
      `一名工人每班工作 $${h}$ 小时 $${m}$ 分钟。$${n}$ 班共多少分钟？`,
      n * (60 * h + m),
      [n * (60 * h) + m, n * (100 * h + m), n * (h + m)],
      `One shift is $60(${h}) + ${m} = ${60 * h + m}$ minutes, and $${n}$ shifts are $${n * (60 * h + m)}$.`,
      `一班为 $60(${h}) + ${m} = ${60 * h + m}$ 分钟，$${n}$ 班为 $${n * (60 * h + m)}$。`,
    );
  },
  "Converting a Measurement": (rng, hard) => {
    const [big, one, small, bigZh, smallZh, f] = rng.pick([
      ["feet", "foot", "inches", "英尺", "英寸", 12],
      ["yards", "yard", "feet", "码", "英尺", 3],
      ["minutes", "minute", "seconds", "分钟", "秒", 60],
      ["kilograms", "kilogram", "grams", "千克", "克", 1000],
      ["meters", "meter", "centimeters", "米", "厘米", 100],
      ["gallons", "gallon", "quarts", "加仑", "夸脱", 4],
    ] as const);
    const n = rng.int(3, 90);
    if (!hard)
      return ask(
        rng,
        `There are $${f}$ ${small} in $1$ ${one}. How many ${small} are in $${n}$ ${big}?`,
        `已知 $1$ ${bigZh}为 $${f}$ ${smallZh}，$${n}$ ${bigZh}是多少${smallZh}？`,
        n * f,
        [n + f, n, n * f * f],
        `A larger unit holds more of the smaller one, so multiply: $${n}(${f}) = ${n * f}$.`,
        `大单位包含多个小单位，所以相乘：$${n}(${f}) = ${n * f}$。`,
      );
    return ask(
      rng,
      `There are $${f}$ ${small} in $1$ ${one}. How many ${big} are in $${n * f}$ ${small}?`,
      `已知 $1$ ${bigZh}为 $${f}$ ${smallZh}，$${n * f}$ ${smallZh}是多少${bigZh}？`,
      n,
      [n * f * f, n * f + f, n * f - f],
      `A smaller unit is a part of the larger one, so divide: $${n * f} \\div ${f} = ${n}$.`,
      `小单位是大单位的一部分，所以相除：$${n * f} \\div ${f} = ${n}$。`,
    );
  },
  "Applying Conversion Factors": (rng, hard) => {
    if (!hard) {
      const [e, d, s] = [rng.int(3, 25), rng.int(4, 90), rng.int(2, 9)];
      const m = e * d * s;
      return ask(
        rng,
        `A traveler changes money at $${e}$ pesos per dollar. A meal costs $${m}$ pesos, and $${s}$ friends share it equally. How many dollars does each friend pay?`,
        `旅行者按每美元 $${e}$ 比索兑换。一顿饭 $${m}$ 比索，$${s}$ 位朋友平摊。每人付多少美元？`,
        d,
        [e * d, m, d * s],
        `In dollars the meal is $${m} \\div ${e} = ${d * s}$, and each of the $${s}$ friends pays $${d}$.`,
        `换成美元，这顿饭为 $${m} \\div ${e} = ${d * s}$，$${s}$ 人每人付 $${d}$。`,
      );
    }
    const k = rng.int(1, 30);
    return ask(
      rng,
      `Given that $1$ mile is $5{,}280$ feet, what is a speed of $${15 * k}$ miles per hour in feet per second?`,
      `已知 $1$ 英里是 $5{,}280$ 英尺，$${15 * k}$ 英里/小时等于多少英尺/秒？`,
      22 * k,
      [15 * k * 88, 15 * k * 5280, 22 * k + 60],
      `Multiply by feet per mile and divide by seconds per hour: $\\frac{${15 * k}(5280)}{3600} = ${22 * k}$.`,
      `乘以每英里的英尺数，再除以每小时的秒数：$\\frac{${15 * k}(5280)}{3600} = ${22 * k}$。`,
    );
  },
  "Finding a Mean": (rng, hard) => {
    if (!hard) {
      const [m, d, e] = [rng.int(8, 90), rng.int(1, 7), rng.int(1, 7)];
      const xs = [m - d, m + e, m, m + d, m - e];
      return ask(
        rng,
        `What is the mean of $${list(xs)}$?`,
        `$${list(xs)}$ 的平均数是多少？`,
        m,
        [m - d, m + d + e, 5 * m],
        `The numbers add to $${5 * m}$, and $${5 * m} \\div 5 = ${m}$.`,
        `这些数的和为 $${5 * m}$，$${5 * m} \\div 5 = ${m}$。`,
      );
    }
    const [a, b, c] = [rng.int(1, 5), rng.int(1, 9), rng.int(2, 9)];
    const s = b + c;
    return ask(
      rng,
      `What is the mean of $${lin(a, b)}$, $${lin(2 * a, c)}$ and $${lin(3 * a, 2 * s)}$ in terms of $x$?`,
      `用 $x$ 表示 $${lin(a, b)}$、$${lin(2 * a, c)}$、$${lin(3 * a, 2 * s)}$ 的平均数。`,
      lin(2 * a, s),
      [lin(6 * a, 3 * s), lin(2 * a, 3 * s), lin(3 * a, s)],
      `The sum is $${lin(6 * a, 3 * s)}$, and dividing by $3$ gives $${lin(2 * a, s)}$.`,
      `和为 $${lin(6 * a, 3 * s)}$，除以 $3$ 得 $${lin(2 * a, s)}$。`,
    );
  },
  "Finding a Median": (rng, hard) => {
    const start = rng.int(1, 40);
    const steps = [0, 1, 2, 3, 4, 5, 6].map(() => rng.int(1, 6));
    const sorted = steps.map((_, i) => start + steps.slice(0, i + 1).reduce((p, q) => p + q, 0));
    const shuffle = rng.pick([
      [3, 0, 6, 2, 5, 1, 4],
      [5, 2, 0, 6, 1, 4, 3],
      [1, 6, 3, 0, 4, 2, 5],
      [6, 1, 4, 2, 0, 5, 3],
    ] as const);
    const seven = shuffle.map((i) => sorted[i] ?? 0);
    if (!hard)
      return ask(
        rng,
        `What is the median of $${list(seven)}$?`,
        `$${list(seven)}$ 的中位数是多少？`,
        sorted[3] ?? 0,
        [seven[3] === sorted[3] ? (sorted[2] ?? 0) : (seven[3] ?? 0), sorted[6] ?? 0, sorted[0] ?? 0],
        `Put them in order: $${list(sorted)}$. The fourth of the seven is $${sorted[3]}$.`,
        `按顺序排列：$${list(sorted)}$。七个数中第四个是 $${sorted[3]}$。`,
      );
    const six = sorted.slice(0, 6);
    const shown = seven.filter((v) => six.includes(v));
    const [p, q] = [six[2] ?? 0, six[3] ?? 0];
    return ask(
      rng,
      `What is the median of $${list(shown)}$?`,
      `$${list(shown)}$ 的中位数是多少？`,
      Q.of(p + q, 2),
      [p, q, Q.of((shown[2] ?? 0) + (shown[3] ?? 0), 2)],
      `In order they are $${list(six)}$. With six numbers, the median is the mean of the middle two: $\\frac{${p} + ${q}}{2} = ${Q.of(p + q, 2).toLatex()}$.`,
      `按顺序为 $${list(six)}$。六个数的中位数是中间两个的平均数：$\\frac{${p} + ${q}}{2} = ${Q.of(p + q, 2).toLatex()}$。`,
    );
  },
  "Finding the Area of a Rectangle": (rng, hard) => {
    const [l, w] = [rng.int(6, 30), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `The figure shows a rectangular patio with its sides in feet. What is its area, in square feet?`,
        `图中长方形露台的单位为英尺，它的面积是多少平方英尺？`,
        l * w,
        [2 * (l + w), l + w, l * l],
        `Multiply length by width: $${l}(${w}) = ${l * w}$. Adding sides would give part of the perimeter instead.`,
        `长乘以宽：$${l}(${w}) = ${l * w}$。边长相加得到的是周长的一部分。`,
        rectFigure(l, w, `${l}`, `${w}`),
      );
    const p = 2 * (l + w);
    return ask(
      rng,
      `A rectangle has perimeter $${p}$ and width $${w}$. What is its area?`,
      `一个长方形周长为 $${p}$，宽为 $${w}$。它的面积是多少？`,
      l * w,
      [p * w, (p - w) * w, p],
      `Half the perimeter is $${l + w}$, so the length is $${l + w} - ${w} = ${l}$, and the area is $${l}(${w}) = ${l * w}$.`,
      `周长的一半是 $${l + w}$，所以长为 $${l + w} - ${w} = ${l}$，面积为 $${l}(${w}) = ${l * w}$。`,
    );
  },
  "Finding the Volume of a Rectangular Prism": (rng, hard) => {
    const [a, b, c, s] = [rng.int(2, 12), rng.int(2, 12), rng.int(2, 12), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `An aquarium is $${a}$ feet long, $${b}$ feet wide and $${c}$ feet deep. What is its volume, in cubic feet?`,
        `一个鱼缸长 $${a}$ 英尺、宽 $${b}$ 英尺、深 $${c}$ 英尺。它的体积是多少立方英尺？`,
        a * b * c,
        [a + b + c, 2 * (a * b + b * c + a * c), a * b],
        `Multiply the three dimensions: $${a}(${b})(${c}) = ${a * b * c}$.`,
        `三个尺寸相乘：$${a}(${b})(${c}) = ${a * b * c}$。`,
      );
    return ask(
      rng,
      `A box is $${s * a}$ by $${s * b}$ by $${s * c}$ inches. How many cubes with $${s}$-inch edges exactly fill the box?`,
      `一个盒子尺寸为 $${s * a}$ 乘 $${s * b}$ 乘 $${s * c}$ 英寸。恰好填满盒子需要多少个棱长 $${s}$ 英寸的立方体？`,
      a * b * c,
      [s * s * s * a * b * c, s * a * b * c, a + b + c],
      `Each edge holds $${a}$, $${b}$ and $${c}$ cubes, so there are $${a}(${b})(${c}) = ${a * b * c}$. Equivalently, divide the volumes.`,
      `每条边分别放 $${a}$、$${b}$、$${c}$ 个，共 $${a}(${b})(${c}) = ${a * b * c}$ 个。也可以用体积相除。`,
    );
  },
};
