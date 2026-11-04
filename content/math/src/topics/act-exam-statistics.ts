import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import type { ExamSpec } from "../exam.ts";
import { ask, mod, sketchFigure } from "../exam.ts";
import { pieFigure } from "../exam-figures.ts";

// ACT Math Prep, Statistics and Probability: means, tables and graphs, probability, expected value, counting and estimation.

const meanTips = mod(
  t(
    "A weighted mean multiplies each value by how often it occurs or by its weight, adds the products, and divides by the total of the weights rather than by the number of values.",
    "加权平均数把每个值乘它的次数或权重，把积相加，再除以权重之和，而不是除以数值的个数。",
  ),
  t(
    "Work with totals when groups are combined: the total of a group is its mean times its size, and the combined mean is the sum of the totals divided by the sum of the sizes.",
    "合并各组时要用总和：一组的总和等于平均数乘人数，合并后的平均数等于总和之和除以人数之和。",
  ),
);
const graphTips = mod(
  t(
    "Read the labels and the row and column first. In a two-way table, each row and column has a total, and the question tells you which total is the denominator of a fraction.",
    "先读标签以及行和列。在双向表中，每行每列都有总数，题目会告诉你哪个总数是分母。",
  ),
  t(
    "A circle graph shows parts of a whole, so multiply the total by the percent to get a count. For a bar graph, read each height from the scale, then compare or combine them.",
    "扇形图表示部分与整体，用总数乘百分比得到数量。条形图要按刻度读出每个高度，再比较或合并。",
  ),
);
const probTips = mod(
  t(
    "A probability is the number of favorable outcomes divided by the number of equally likely outcomes. List or count both before dividing, and check that the total is correct.",
    "概率等于有利结果数除以等可能结果总数。相除之前先列出或数清两者，并检查总数是否正确。",
  ),
  t(
    "For events in sequence, multiply the probabilities, and change the counts if the items are not replaced. For a union, add the two probabilities and subtract the overlap.",
    "依次发生的事件要把概率相乘，不放回时要改变数量。求并集时把两个概率相加，再减去重叠部分。",
  ),
);
const expectTips = mod(
  t(
    "The expected value is the sum of each outcome times its probability. It is a long-run average, so it does not have to be one of the possible outcomes.",
    "期望值是每个结果乘其概率之和。它是长期平均，所以不一定是可能出现的结果之一。",
  ),
  t(
    "Include every outcome, even those with a loss or a value of zero, and check that the probabilities add to $1$. Then compare the expected gain with any cost to play.",
    "要包括每个结果，包括亏损或为零的结果，并检查概率之和为 $1$。再把期望收益与参与成本比较。",
  ),
);
const countTips = mod(
  t(
    "When choices are independent, multiply the number of options at each step. When order matters and items cannot repeat, the count of options falls by one at each step.",
    "各步选择互相独立时，把每一步的选项数相乘。顺序重要且不能重复时，选项数每步减一。",
  ),
  t(
    "When order does not matter, divide the ordered count by the number of ways to arrange the chosen items. For overlapping sets, add the sizes and subtract the overlap.",
    "顺序不重要时，用有序计数除以所选对象的排列数。对重叠的集合，把大小相加再减去重叠。",
  ),
);
const sampleTips = mod(
  t(
    "A random sample's rate or mean estimates the whole population's, so scale it up by the size of the population. Larger random samples give smaller margins of error.",
    "随机样本的比率或平均数可以估计总体，所以按总体大小放大。随机样本越大，误差范围越小。",
  ),
  t(
    "In a normal distribution, about $68\\%$ of values lie within one standard deviation of the mean, $95\\%$ within two and $99.7\\%$ within three, and the curve is symmetric.",
    "在正态分布中，约 $68\\%$ 的值在平均数一个标准差以内，$95\\%$ 在两个以内，$99.7\\%$ 在三个以内，且曲线对称。",
  ),
);

function barFigure(labels: readonly string[], values: readonly number[], top: number, alt: ReturnType<typeof t>) {
  const x0 = 50;
  const y0 = 200;
  const unit = 160 / top;
  const w = 220 / labels.length;
  const ticks = [0, top / 2, top];
  return sketchFigure(
    {
      segs: [
        [x0, y0, 300, y0],
        [x0, y0, x0, 30],
        ...ticks.map((v) => [x0 - 4, y0 - v * unit, x0 + 4, y0 - v * unit] as const),
        ...values.flatMap((v, i) => {
          const a = x0 + 10 + i * w;
          const b = a + w - 16;
          const y = y0 - v * unit;
          return [
            [a, y0, a, y],
            [a, y, b, y],
            [b, y, b, y0],
          ] as const;
        }),
      ],
      labels: [
        ...ticks.map((v) => [x0 - 22, y0 - v * unit + 5, `${v}`] as const),
        ...labels.map((l, i) => [x0 + 10 + i * w + (w - 16) / 2, y0 + 18, l] as const),
        ...values.map((v, i) => [x0 + 10 + i * w + (w - 16) / 2, y0 - v * unit - 6, `${v}`] as const),
      ],
    },
    alt,
  );
}

function tableText(rowA: string, rowB: string, colA: string, colB: string, total: string, a: number, b: number, c: number, d: number) {
  return `\\begin{array}{c|c|c|c} & \\text{${colA}} & \\text{${colB}} & \\text{${total}} \\\\ \\hline \\text{${rowA}} & ${a} & ${b} & ${a + b} \\\\ \\hline \\text{${rowB}} & ${c} & ${d} & ${c + d} \\\\ \\hline \\text{${total}} & ${a + c} & ${b + d} & ${a + b + c + d} \\end{array}`;
}

/** actExamStatistics are the exam-style questions of the ACT Statistics and Probability unit that have no SAT counterpart. */
export const actExamStatistics: ExamSpec[] = [
  meanTips("Finding a Weighted Mean", "求加权平均数", ["calculating-means-from-frequency-tables"], (rng, hard) => {
    const [a, b, n, m] = [rng.int(60, 80), rng.int(81, 99), rng.int(2, 8), rng.int(2, 8)];
    const [w1, w2] = [rng.int(1, 4) * 10, rng.int(1, 4) * 10];
    if (!hard)
      return ask(
        rng,
        `A student scores $${a}$ on each of $${n}$ quizzes and $${b}$ on each of $${m}$ quizzes. What is the mean of all the quiz scores?`,
        `一名学生有 $${n}$ 次测验每次得 $${a}$ 分，$${m}$ 次测验每次得 $${b}$ 分。所有测验的平均分是多少？`,
        Q.of(n * a + m * b, n + m),
        [
          Q.of(a + b, 2).eq(Q.of(n * a + m * b, n + m)) ? Q.of(a + b + 1, 2) : Q.of(a + b, 2),
          Q.of(n * a + m * b, 2),
          n * a + m * b,
          Q.of(m * a + n * b + 1, n + m),
        ],
        `Divide the total $${n * a + m * b}$ by the $${n + m}$ quizzes.`,
        `总分 $${n * a + m * b}$ 除以 $${n + m}$ 次测验。`,
      );
    return ask(
      rng,
      `In a course, tests count for $${w1}$ parts and the final exam for $${w2}$ parts. A student has a test mean of $${a}$ and a final exam score of $${b}$. What is the student's weighted course score?`,
      `某课程测验占 $${w1}$ 份，期末考试占 $${w2}$ 份。一名学生测验平均 $${a}$ 分，期末考试 $${b}$ 分。课程加权成绩是多少？`,
      Q.of(w1 * a + w2 * b, w1 + w2),
      [Q.of(w2 * a + w1 * b + 1, w1 + w2), Q.of(a + b + 1, 2), Q.of(w1 * a + w2 * b, 100), a + b],
      `$\\frac{${w1}(${a}) + ${w2}(${b})}{${w1 + w2}}$.`,
      `$\\frac{${w1}(${a}) + ${w2}(${b})}{${w1 + w2}}$。`,
    );
  }),
  graphTips("Reading Two-Way Tables", "读双向表", ["two-way-frequency-tables", "joint-frequency-tables"], (rng, hard) => {
    const [a, b, c, d] = [rng.int(8, 40), rng.int(8, 40), rng.int(8, 40), rng.int(8, 40)];
    const table = `$$${tableText("Grade 9", "Grade 10", "Band", "Choir", "Total", a, b, c, d)}$$`;
    const tableZh = `$$${tableText("9 年级", "10 年级", "乐队", "合唱", "合计", a, b, c, d)}$$`;
    if (!hard)
      return ask(
        rng,
        `The table shows students by grade and activity. ${table} How many students in Grade 10 are in Band?`,
        `下表按年级和活动统计学生。${tableZh} 10 年级中有多少学生在乐队？`,
        c,
        [a === c ? a + d : a, c + d, a + c, d === c ? d + 1 : d],
        `Read the Grade 10 row under Band.`,
        `读 10 年级这一行的乐队列。`,
      );
    return ask(
      rng,
      `The table shows students by grade and activity. ${table} What fraction of the students in Choir are in Grade 9?`,
      `下表按年级和活动统计学生。${tableZh} 合唱的学生中，9 年级占多少比例？`,
      Q.of(b, b + d),
      [Q.of(b, a + b), Q.of(b, a + b + c + d), Q.of(d, b + d + 1), Q.of(a, a + c)],
      `The denominator is the Choir total, $${b + d}$.`,
      `分母是合唱的总数 $${b + d}$。`,
    );
  }),
  graphTips("Reading Bar Graphs", "读条形图", ["bar-graphs"], (rng, hard) => {
    const v = [rng.int(2, 18) * 5, rng.int(2, 18) * 5, rng.int(2, 18) * 5, rng.int(2, 18) * 5] as const;
    const [a, b, c, d] = v;
    const fig = barFigure(
      ["A", "B", "C", "D"],
      v,
      100,
      t(`A bar graph with values A ${a}, B ${b}, C ${c} and D ${d}.`, `条形图，A 为 ${a}，B 为 ${b}，C 为 ${c}，D 为 ${d}。`),
    );
    if (!hard)
      return ask(
        rng,
        `The bar graph shows the books sold by four stores. How many books did stores A and C sell in all?`,
        `条形图显示四家书店售出的书。A 和 C 两家共售出多少本？`,
        a + c,
        [Math.abs(a - c) + 5, a + b, a + b + c + d, a + c + 5],
        `Add the heights of the bars for A and C.`,
        `把 A 和 C 的条形高度相加。`,
        fig,
      );
    return ask(
      rng,
      `The bar graph shows the books sold by four stores. What is the mean number of books sold per store?`,
      `条形图显示四家书店售出的书。平均每家售出多少本？`,
      Q.of(a + b + c + d, 4),
      [
        a + b + c + d,
        Q.of(a + b + c + d, 3),
        Q.of(Math.max(a, b, c, d) + Math.min(a, b, c, d), 2).add(Q.of(1)),
        Q.of(a + d, 2).add(Q.of(2)),
      ],
      `The total is $${a + b + c + d}$, shared among $4$ stores.`,
      `总数是 $${a + b + c + d}$，分给 $4$ 家。`,
      fig,
    );
  }),
  graphTips("Working With Circle Graphs", "扇形图", ["circle-graphs"], (rng, hard) => {
    const [p, q, n] = [rng.int(2, 8) * 5, rng.int(2, 8) * 5, rng.int(2, 20) * 20];
    if (!hard)
      return ask(
        rng,
        `In a circle graph of a budget of $\\$${n}$, the food sector is labeled $${p}\\%$. How many dollars are budgeted for food?`,
        `$${n}$ 美元预算的扇形图中，食品部分标为 $${p}\\%$。食品预算是多少美元？`,
        (n * p) / 100,
        [p, n - (n * p) / 100, (n * p) / 10, (n * p) / 100 + p],
        `$${p}\\%$ of $${n}$.`,
        `$${n}$ 的 $${p}\\%$。`,
        pieFigure(p),
      );
    return ask(
      rng,
      `A circle graph shows $${n}$ survey responses, and one sector represents $${p + q}\\%$ of them. What is the measure of its central angle?`,
      `扇形图显示 $${n}$ 份调查回答，其中一个扇形表示 $${p + q}\\%$。它的圆心角是多少度？`,
      (18 * (p + q)) / 5,
      [p + q, 180 - p - q, (9 * (p + q)) / 5, (18 * (p + q)) / 5 + 10],
      `$${p + q}\\%$ of $360^\\circ$.`,
      `$360^\\circ$ 的 $${p + q}\\%$。`,
      pieFigure(p + q),
    );
  }),
  probTips("Solving for a Count Given a Probability", "由概率求数量", ["adjusting-outcomes-to-a-target-probability"], (rng, hard) => {
    const [r, k, b] = [rng.int(2, 15), rng.int(2, 6), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `A bag holds marbles, and the probability of drawing a red one is $\\frac{1}{${k}}$. If there are $${r}$ red marbles, how many marbles are in the bag?`,
        `袋中有弹珠，摸到红色的概率是 $\\frac{1}{${k}}$。若有 $${r}$ 颗红弹珠，袋中共有多少颗？`,
        r * k,
        [r + k, r * (k - 1), r * k + r, r * k - 1],
        `$\\frac{${r}}{n} = \\frac{1}{${k}}$.`,
        `$\\frac{${r}}{n} = \\frac{1}{${k}}$。`,
      );
    return ask(
      rng,
      `A bag holds $${r}$ red marbles and $${r * (k - 1) + b}$ blue marbles. How many blue marbles must be removed so that the probability of drawing red is $\\frac{1}{${k}}$?`,
      `袋中有 $${r}$ 颗红弹珠和 $${r * (k - 1) + b}$ 颗蓝弹珠。必须取出多少颗蓝弹珠，才能使摸到红色的概率为 $\\frac{1}{${k}}$？`,
      b,
      [b + 1, r * (k - 1), r, b + r],
      `There must be $${r * (k - 1)}$ blue marbles left.`,
      `应剩 $${r * (k - 1)}$ 颗蓝弹珠。`,
    );
  }),
  probTips("Working With Event Relationships", "事件之间的关系", ["venn-diagrams-in-probability"], (rng, hard) => {
    const [p, q] = [rng.int(5, 45), rng.int(5, 45)];
    if (!hard)
      return ask(
        rng,
        `The probability that it rains on a given day is $${p}\\%$. What is the probability that it does not rain that day?`,
        `某天下雨的概率是 $${p}\\%$。那天不下雨的概率是多少？`,
        `${100 - p}\\%`,
        [`${p}\\%`, `${95 - p}\\%`, `${100 + p}\\%`, `${90 - p}\\%`],
        `Complementary events add to $100\\%$.`,
        `互补事件的概率和为 $100\\%$。`,
      );
    return ask(
      rng,
      `Events $A$ and $B$ cannot both occur. If $P(A) = ${p}\\%$ and $P(B) = ${q}\\%$, what is the probability that neither occurs?`,
      `事件 $A$ 和 $B$ 不能同时发生。若 $P(A) = ${p}\\%$，$P(B) = ${q}\\%$，两者都不发生的概率是多少？`,
      `${100 - p - q}\\%`,
      [`${p + q}\\%`, `${100 - p}\\%`, `${100 - q}\\%`, `${100 - p - q + 5}\\%`],
      `$A$ or $B$ occurs with probability $${p + q}\\%$, and the rest is neither.`,
      `$A$ 或 $B$ 发生的概率是 $${p + q}\\%$，其余就是都不发生。`,
    );
  }),
  probTips("Finding a Union With Overlap", "求有重叠的并集", ["the-inclusion-exclusion-principle"], (rng, hard) => {
    const [a, b, o, n] = [rng.int(10, 30), rng.int(10, 30), rng.int(2, 9), rng.int(70, 100)];
    if (!hard)
      return ask(
        rng,
        `In a class, $${a}$ students play a sport, $${b}$ play an instrument and $${o}$ do both. How many students do at least one of these?`,
        `班里 $${a}$ 人做运动，$${b}$ 人演奏乐器，$${o}$ 人两者都做。至少做一项的有多少人？`,
        a + b - o,
        [a + b, a + b + o, a + b - 2 * o, a * b],
        `Subtract the overlap, which was counted twice.`,
        `减去被数了两次的重叠部分。`,
      );
    return ask(
      rng,
      `Of $${n}$ people surveyed, $${a}$ own a dog, $${b}$ own a cat and $${o}$ own both. What is the probability that a randomly chosen person owns neither?`,
      `在调查的 $${n}$ 人中，$${a}$ 人养狗，$${b}$ 人养猫，$${o}$ 人两者都养。随机选一人，两者都不养的概率是多少？`,
      Q.of(n - a - b + o, n),
      [Q.of(n - a - b, n), Q.of(a + b - o, n), Q.of(o, n), Q.of(n - a - b + 2 * o, n)],
      `$${a + b - o}$ own at least one, which leaves $${n - a - b + o}$.`,
      `$${a + b - o}$ 人至少养一种，剩下 $${n - a - b + o}$ 人。`,
    );
  }),
  probTips("Applying a Conditional Probability", "应用条件概率", ["the-multiplication-law-for-conditional-probability"], (rng, hard) => {
    const [a, b, c, n] = [rng.int(2, 9), rng.int(10, 30), rng.int(2, 9), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `Of $${b + a}$ seniors, $${a}$ drive to school. If a randomly chosen student is a senior, what is the probability that the student drives to school?`,
        `$${b + a}$ 名高年级学生中有 $${a}$ 人开车上学。若随机选的学生是高年级学生，他开车上学的概率是多少？`,
        Q.of(a, a + b),
        [Q.of(a, b), Q.of(b, a + b), Q.of(1, a + b), Q.of(a + 1, a + b)],
        `Restrict to the seniors: the denominator is $${a + b}$.`,
        `只看高年级学生：分母是 $${a + b}$。`,
      );
    return ask(
      rng,
      `$P(A) = \\frac{${c}}{${c + n}}$ and $P(B \\mid A) = \\frac{${a}}{${a + b}}$. What is $P(A \\text{ and } B)$?`,
      `$P(A) = \\frac{${c}}{${c + n}}$，$P(B \\mid A) = \\frac{${a}}{${a + b}}$。$P(A \\text{ 且 } B)$ 是多少？`,
      Q.of(c * a, (c + n) * (a + b)),
      [Q.of(c, c + n).add(Q.of(a, a + b)), Q.of(a, a + b), Q.of(c, c + n), Q.of(c * a + 1, (c + n) * (a + b))],
      `$P(A \\text{ and } B) = P(A)P(B \\mid A)$.`,
      `$P(A \\text{ 且 } B) = P(A)P(B \\mid A)$。`,
    );
  }),
  probTips("Multiplying Independent Probabilities", "独立事件的概率相乘", ["independent-events"], (rng, hard) => {
    const [a, b, k] = [rng.int(1, 8), rng.int(1, 8), rng.int(2, 5)];
    const p = Q.of(a, 9);
    const q = Q.of(b, 9);
    if (!hard)
      return ask(
        rng,
        `Two independent events have probabilities $\\frac{${a}}{9}$ and $\\frac{${b}}{9}$. What is the probability that both occur?`,
        `两个独立事件的概率是 $\\frac{${a}}{9}$ 和 $\\frac{${b}}{9}$。两者都发生的概率是多少？`,
        Q.of(a * b, 81),
        [p.add(q).sub(Q.of(a * b + 1, 81)), Q.of(a + b, 81), Q.of(a * b, 9), Q.of(a * b + 1, 81)],
        `Multiply the probabilities.`,
        `把概率相乘。`,
      );
    return ask(
      rng,
      `A fair coin is flipped $${k + 2}$ times and an event with probability $\\frac{${a}}{9}$ also occurs independently. What is the probability of all heads together with the event?`,
      `一枚均匀硬币抛 $${k + 2}$ 次，另有一个概率为 $\\frac{${a}}{9}$ 的独立事件。全为正面且该事件发生的概率是多少？`,
      Q.of(a, 9 * 2 ** (k + 2)),
      [Q.of(a, 9 * 2 * (k + 2)), Q.of(a, 9 * 2 ** (k + 1)), Q.of(1, 2 ** (k + 2)), Q.of(a + 1, 9 * 2 ** (k + 2))],
      `$\\left(\\frac{1}{2}\\right)^{${k + 2}} \\cdot \\frac{${a}}{9}$.`,
      `$\\left(\\frac{1}{2}\\right)^{${k + 2}} \\cdot \\frac{${a}}{9}$。`,
    );
  }),
  probTips("Finding a Without-Replacement Probability", "求不放回的概率", ["tree-diagrams-for-dependent-events"], (rng, hard) => {
    const [r, b] = [rng.int(3, 12), rng.int(3, 12)];
    const n = r + b;
    if (!hard)
      return ask(
        rng,
        `A box holds $${r}$ red and $${b}$ blue cards. Two cards are drawn without replacement. What is the probability that both are red?`,
        `盒中有 $${r}$ 张红卡和 $${b}$ 张蓝卡。不放回地抽两张。两张都是红色的概率是多少？`,
        Q.of(r * (r - 1), n * (n - 1)),
        [Q.of(r * r, n * n), Q.of(2 * r, n), Q.of(r * (r - 1), n * n), Q.of(r * b, n * (n - 1))],
        `$\\frac{${r}}{${n}} \\cdot \\frac{${r - 1}}{${n - 1}}$.`,
        `$\\frac{${r}}{${n}} \\cdot \\frac{${r - 1}}{${n - 1}}$。`,
      );
    return ask(
      rng,
      `A box holds $${r}$ red and $${b}$ blue cards. Two cards are drawn without replacement. What is the probability that the first is red and the second is blue?`,
      `盒中有 $${r}$ 张红卡和 $${b}$ 张蓝卡。不放回地抽两张。第一张红、第二张蓝的概率是多少？`,
      Q.of(r * b, n * (n - 1)),
      [Q.of(r * b, n * n), Q.of(2 * r * b, n * (n - 1)), Q.of(r * (b - 1), n * (n - 1)), Q.of(r + b, n * (n - 1))],
      `$\\frac{${r}}{${n}} \\cdot \\frac{${b}}{${n - 1}}$.`,
      `$\\frac{${r}}{${n}} \\cdot \\frac{${b}}{${n - 1}}$。`,
    );
  }),
  probTips(
    "Problem-Solving With Dependent Selections",
    "解决相关选择问题",
    ["tree-diagrams-for-dependent-events-applications"],
    (rng, hard) => {
      const [g, b] = [rng.int(3, 12), rng.int(3, 12)];
      const n = g + b;
      if (!hard)
        return ask(
          rng,
          `A committee picks $2$ members in turn from $${g}$ girls and $${b}$ boys, with no one picked twice. If the first pick is a girl, what is the probability that the second is also a girl?`,
          `委员会从 $${g}$ 名女生和 $${b}$ 名男生中依次选 $2$ 人，不重复。若第一人是女生，第二人也是女生的概率是多少？`,
          Q.of(g - 1, n - 1),
          [Q.of(g, n), Q.of(g - 1, n), Q.of(g, n - 1), Q.of(b, n - 1)],
          `After one girl is chosen, $${g - 1}$ girls remain among $${n - 1}$ people.`,
          `选出一名女生后，$${n - 1}$ 人中还有 $${g - 1}$ 名女生。`,
        );
      return ask(
        rng,
        `A committee picks $2$ members in turn from $${g}$ girls and $${b}$ boys, with no one picked twice. What is the probability that the two are of different genders?`,
        `委员会从 $${g}$ 名女生和 $${b}$ 名男生中依次选 $2$ 人，不重复。两人性别不同的概率是多少？`,
        Q.of(2 * g * b, n * (n - 1)),
        [Q.of(g * b, n * (n - 1)), Q.of(2 * g * b, n * n), Q.of(g * (g - 1) + b * (b - 1), n * (n - 1)), Q.of(2 * g * b + 1, n * (n - 1))],
        `Add girl then boy and boy then girl.`,
        `把先女后男和先男后女相加。`,
      );
    },
  ),
  probTips("Finding a Probability of an Arrangement", "求排列的概率", ["computing-probabilities-using-combinatorics"], (rng, hard) => {
    const n = rng.int(3, 12);
    const place = rng.int(1, n);
    const [en, zh] = rng.pick([
      ["photos", "张照片"],
      ["trophies", "座奖杯"],
      ["books", "本书"],
    ] as const);
    const together = rng.bool();
    if (!hard)
      return ask(
        rng,
        `$${n}$ students, including Ana, line up in a random order. What is the probability that Ana is in position $${place}$?`,
        `包括 Ana 在内的 $${n}$ 名学生随机排队。Ana 在第 $${place}$ 位的概率是多少？`,
        Q.of(1, n),
        [Q.of(place, n === place ? n + 1 : n), Q.of(1, n * (n - 1)), Q.of(1, n + 1), Q.of(2, n + 1)],
        `Each of the $${n}$ positions is equally likely for Ana.`,
        `Ana 排在 $${n}$ 个位置的可能性相同。`,
      );
    if (together)
      return ask(
        rng,
        `$${n}$ different ${en}, including items $X$ and $Y$, are placed in a row at random. What is the probability that $X$ and $Y$ are next to each other?`,
        `$${n}$ ${zh}（包括 $X$ 和 $Y$）随机排成一行。$X$ 和 $Y$ 相邻的概率是多少？`,
        Q.of(2, n),
        [Q.of(1, n), Q.of(1, n - 1 === 2 ? n + 1 : n - 1), Q.of(1, 2 * n), Q.of(2, n + 1)],
        `Treat the pair as one block in $2$ orders: $2 \\cdot ${n - 1}!$ of the $${n}!$ arrangements work.`,
        `把两者看成一块，有 $2$ 种内部顺序：$${n}!$ 种排法中有 $2 \\cdot ${n - 1}!$ 种符合。`,
      );
    return ask(
      rng,
      `$${n}$ different ${en}, including items $X$ and $Y$, are placed in a row at random. What is the probability that $X$ is immediately to the left of $Y$?`,
      `$${n}$ ${zh}（包括 $X$ 和 $Y$）随机排成一行。$X$ 紧靠在 $Y$ 左边的概率是多少？`,
      Q.of(1, n),
      [Q.of(2, n), Q.of(1, n * (n - 1)), Q.of(1, n - 1 === 1 ? n + 1 : n - 1), Q.of(1, 2 * n)],
      `Treat the pair as one block: $${n - 1}!$ of the $${n}!$ arrangements work.`,
      `把两者看成一块：$${n}!$ 种排法中有 $${n - 1}!$ 种符合。`,
    );
  }),
  probTips(
    "Finding a Probability From a Sample Space",
    "由样本空间求概率",
    ["sample-spaces-and-events-in-probability", "tree-diagrams-for-independent-events"],
    (rng, hard) => {
      const [s, a, b] = [rng.int(5, 9), rng.int(4, 8), rng.int(6, 10)];
      const [sum, big] = [a + b - rng.int(0, 3), a * b];
      let count = 0;
      for (let i = 1; i <= a; i++) for (let j = 1; j <= b; j++) if (i + j === sum) count++;
      if (!hard)
        return ask(
          rng,
          `A spinner has sections numbered $1$ to $${a + s}$. What is the probability of spinning a number greater than $${s}$?`,
          `转盘分区编号为 $1$ 到 $${a + s}$。转到大于 $${s}$ 的数的概率是多少？`,
          Q.of(a, a + s),
          [Q.of(s, a + s), Q.of(a + 1, a + s), Q.of(a, s), Q.of(1, a + s)],
          `The numbers from $${s + 1}$ to $${a + s}$ are favorable, and there are $${a}$ of them.`,
          `从 $${s + 1}$ 到 $${a + s}$ 的数是有利结果，共 $${a}$ 个。`,
        );
      return ask(
        rng,
        `One die has faces $1$ to $${a}$ and another has faces $1$ to $${b}$. What is the probability that the two rolls add to $${sum}$?`,
        `一个骰子的面是 $1$ 到 $${a}$，另一个是 $1$ 到 $${b}$。两次点数之和为 $${sum}$ 的概率是多少？`,
        Q.of(count, big),
        [Q.of(count + 1, big), Q.of(1, big), Q.of(count, a + b), Q.of(sum, big)],
        `There are $${big}$ equally likely pairs, and $${count}$ of them add to $${sum}$.`,
        `共 $${big}$ 个等可能数对，其中 $${count}$ 个和为 $${sum}$。`,
      );
    },
  ),
  probTips("Finding a Geometric Probability", "求几何概率", ["geometric-probability"], (rng, hard) => {
    const [s, r, l, w] = [rng.int(2, 15), rng.int(1, 5), rng.int(4, 20), rng.int(1, 3)];
    if (!hard)
      return ask(
        rng,
        `A point is chosen at random in a square with side $${2 * (r + s)}$. What is the probability that it lies in a smaller square with side $${s}$ inside it?`,
        `在边长 $${2 * (r + s)}$ 的正方形内随机取一点。它落在其内边长 $${s}$ 的小正方形内的概率是多少？`,
        Q.of(s * s, 4 * (r + s) ** 2),
        [Q.of(s, 2 * (r + s)), Q.of(2 * s, 4 * (r + s) ** 2), Q.of(s * s + 1, 4 * (r + s) ** 2), Q.of(s, 4 * (r + s) ** 2)],
        `Divide the areas, not the sides.`,
        `面积相除，而不是边长相除。`,
      );
    return ask(
      rng,
      `A point is chosen at random on a segment of length $${4 * l}$. What is the probability that it lies within $${w}$ units of the midpoint?`,
      `在长为 $${4 * l}$ 的线段上随机取一点。它距中点不超过 $${w}$ 个单位的概率是多少？`,
      Q.of(2 * w, 4 * l),
      [Q.of(w, 4 * l), Q.of(4 * w, 4 * l), Q.of(2 * w, 2 * l + 1), Q.of(2 * w + 1, 4 * l)],
      `The favorable part has length $${2 * w}$.`,
      `有利部分的长度是 $${2 * w}$。`,
    );
  }),
  expectTips("Computing an Expected Value", "计算期望值", ["expected-values-of-discrete-random-variables"], (rng, hard) => {
    const [a, b, c] = [rng.int(1, 20), rng.int(1, 20), rng.int(21, 40)];
    const [p, q] = [rng.int(1, 4) * 10, rng.int(1, 3) * 10];
    const r = 100 - p - q;
    if (!hard)
      return ask(
        rng,
        `A game pays $\\$${a}$ with probability $${p}\\%$ and $\\$${b}$ otherwise. What is the expected payout, in dollars?`,
        `一个游戏以 $${p}\\%$ 的概率付 $${a}$ 美元，否则付 $${b}$ 美元。期望支付是多少美元？`,
        Q.of(p * a + (100 - p) * b, 100),
        [Q.of(a + b, 2).add(Q.of(1, 4)), Q.of((100 - p) * a + p * b + 1, 100), a + b, Q.of(p * a, 100)],
        `$${p / 100}(${a}) + ${(100 - p) / 100}(${b})$.`,
        `$${p / 100}(${a}) + ${(100 - p) / 100}(${b})$。`,
      );
    return ask(
      rng,
      `A variable takes the values $${a}$, $${b}$ and $${c}$ with probabilities $${p}\\%$, $${q}\\%$ and $${r}\\%$. What is its expected value?`,
      `一个变量取值 $${a}$、$${b}$、$${c}$，概率分别是 $${p}\\%$、$${q}\\%$、$${r}\\%$。期望值是多少？`,
      Q.of(p * a + q * b + r * c, 100),
      [Q.of(a + b + c, 3).add(Q.of(1, 7)), Q.of(p * a + q * b, 100), c, Q.of(p * a + q * b + r * c + 100, 100)],
      `Multiply each value by its probability and add.`,
      `每个值乘它的概率再相加。`,
    );
  }),
  expectTips("Problem-Solving With Expected Value", "解决期望值问题", ["expected-values-of-discrete-random-variables"], (rng, hard) => {
    const [n, prize, cost, w] = [rng.int(2, 10) * 10, rng.int(5, 40) * 5, rng.int(2, 9), rng.int(1, 5)];
    if (!hard)
      return ask(
        rng,
        `A raffle sells $${n}$ tickets with one prize of $\\$${prize}$. What is the expected winnings of one ticket, in dollars, before its cost?`,
        `抽奖卖出 $${n}$ 张票，有一个 $${prize}$ 美元的奖。一张票的期望奖金（不计成本）是多少美元？`,
        Q.of(prize, n),
        [prize, Q.of(prize, n).add(Q.of(1)), Q.of(1, n), n],
        `The chance of winning is $\\frac{1}{${n}}$.`,
        `中奖概率是 $\\frac{1}{${n}}$。`,
      );
    return ask(
      rng,
      `A game costs $\\$${cost}$ to play and pays $\\$${prize}$ with probability $\\frac{${w}}{${n}}$. What is the expected net gain per play, in dollars?`,
      `玩一次游戏要 $${cost}$ 美元，以 $\\frac{${w}}{${n}}$ 的概率付 $${prize}$ 美元。每玩一次的期望净收益是多少美元？`,
      Q.of(prize * w - cost * n, n),
      [Q.of(prize * w, n), Q.of(prize * w + cost * n, n), Q.of(prize - cost, n), Q.of(prize * w - cost * n + n, n)],
      `Subtract the cost from the expected payout $\\frac{${prize * w}}{${n}}$.`,
      `从期望支付 $\\frac{${prize * w}}{${n}}$ 中减去成本。`,
    );
  }),
  countTips("Counting Independent Choices", "计算独立选择数", ["counting-trees"], (rng, hard) => {
    const [a, b, c, d] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9), rng.int(2, 5)];
    const out = Math.min(d, a - 1);
    if (!hard)
      return ask(
        rng,
        `A menu has $${a}$ soups, $${b}$ mains and $${c}$ desserts. How many meals with one of each are possible?`,
        `菜单有 $${a}$ 种汤、$${b}$ 种主菜、$${c}$ 种甜点。各选一种的搭配有多少种？`,
        a * b * c,
        [a + b + c, a * b + c, a * b, a * b * c + 1],
        `Multiply the numbers of options.`,
        `把选项数相乘。`,
      );
    return ask(
      rng,
      `A menu has $${a}$ soups, $${b}$ mains and $${c}$ desserts, and $${out}$ of the soups are not available today. How many meals with one of each are possible?`,
      `菜单有 $${a}$ 种汤、$${b}$ 种主菜、$${c}$ 种甜点，其中 $${out}$ 种汤今天没有。各选一种的搭配有多少种？`,
      (a - out) * b * c,
      [a * b * c, (a - out) * b, a - out + b + c, a * b * c - out],
      `Only $${a - out}$ soups remain.`,
      `只剩 $${a - out}$ 种汤。`,
    );
  }),
  countTips("Counting Character Codes", "计算字符编码数", ["permutations-with-repetition"], (rng, hard) => {
    const [l, d, a, b] = [rng.int(1, 3), rng.int(1, 4), rng.int(3, 9), rng.int(3, 9)];
    if (!hard)
      return ask(
        rng,
        `A code has $${l}$ letters chosen from $${a}$ letters, followed by $${d}$ digits chosen from $${b}$ digits. Characters may repeat. How many codes are possible?`,
        `编码由 $${a}$ 个字母中选的 $${l}$ 个字母和 $${b}$ 个数字中选的 $${d}$ 个数字组成，可以重复。共有多少种编码？`,
        a ** l * b ** d,
        [a * l * b * d, a ** l + b ** d, (a * b) ** (l + d), a ** d * b ** l === a ** l * b ** d ? a ** l * b ** d + 1 : a ** d * b ** l],
        `There are $${a}$ options for each letter and $${b}$ for each digit.`,
        `每个字母有 $${a}$ 种选择，每个数字有 $${b}$ 种选择。`,
      );
    return ask(
      rng,
      `A code has $${l + 1}$ letters chosen from $${a}$ letters, followed by $2$ different digits chosen from $${b}$ digits. Letters may repeat. How many codes are possible?`,
      `编码由 $${a}$ 个字母中选的 $${l + 1}$ 个字母（可重复）和 $${b}$ 个数字中选的 $2$ 个不同数字组成。共有多少种编码？`,
      a ** (l + 1) * b * (b - 1),
      [a ** (l + 1) * b * b, a ** (l + 1) + b * (b - 1), a * (l + 1) * b * (b - 1), a ** (l + 1) * b * (b - 1) + 1],
      `The second digit has one fewer option.`,
      `第二个数字少一个选择。`,
    );
  }),
  countTips("Counting Permutations", "计算排列数", ["permutations"], (rng, hard) => {
    const [n, k, m] = [rng.int(5, 20), rng.int(2, 3), rng.int(3, 6)];
    const nPk = k === 2 ? n * (n - 1) : n * (n - 1) * (n - 2);
    if (!hard)
      return ask(
        rng,
        `In how many ways can $${n}$ runners take the top $${k}$ places?`,
        `$${n}$ 名选手争前 $${k}$ 名，有多少种结果？`,
        nPk,
        [n ** k, Q.of(nPk, k === 2 ? 2 : 6), n * k, nPk + 1],
        `$${n}$ choices for first place, then one fewer for each next place.`,
        `第一名有 $${n}$ 种选择，之后每名少一种。`,
      );
    const f = [1, 1, 2, 6, 24, 120, 720][m] ?? 1;
    const [enA, enB, zhA, zhB] = rng.pick([
      ["books", "magazines", "本不同的书", "本不同的杂志"],
      ["photos", "maps", "张不同的照片", "张不同的地图"],
      ["cups", "plates", "个不同的杯子", "个不同的盘子"],
      ["novels", "atlases", "本不同的小说", "本不同的地图册"],
    ] as const);
    return ask(
      rng,
      `In how many ways can $${m}$ different ${enA} and $${k}$ different ${enB} be arranged in a row if all the ${enA} must come first?`,
      `$${m}$ ${zhA}和 $${k}$ ${zhB}排成一行，前者都要排在前面，有多少种排法？`,
      f * (k === 2 ? 2 : 6),
      [f + (k === 2 ? 2 : 6), f, (m + k) * f, f * (k === 2 ? 2 : 6) + 1],
      `Arrange each kind in its own part of the row: $${m}! \\cdot ${k}!$.`,
      `两类物品各自在自己的区域内排列：$${m}! \\cdot ${k}!$。`,
    );
  }),
  countTips("Counting Combinations", "计算组合数", ["combinations"], (rng, hard) => {
    const [n, m, all] = [rng.int(5, 14), rng.int(4, 10), rng.int(6, 35)];
    const c2 = (x: number) => (x * (x - 1)) / 2;
    if (!hard)
      return ask(
        rng,
        `How many different groups of $2$ can be chosen from $${all}$ people?`,
        `从 $${all}$ 人中选 $2$ 人，有多少种不同的组合？`,
        c2(all),
        [all * (all - 1), 2 * all, all, c2(all) + 1],
        `$\\frac{${all}(${all - 1})}{2}$.`,
        `$\\frac{${all}(${all - 1})}{2}$。`,
      );
    return ask(
      rng,
      `A team is formed with $2$ of $${n}$ juniors and $2$ of $${m}$ seniors. How many different teams are possible?`,
      `从 $${n}$ 名三年级学生中选 $2$ 人，从 $${m}$ 名四年级学生中选 $2$ 人组队。有多少种不同的队伍？`,
      c2(n) * c2(m),
      [c2(n) + c2(m), c2(n + m), n * (n - 1) * m * (m - 1), c2(n) * c2(m) + 1],
      `$\\binom{${n}}{2}\\binom{${m}}{2} = ${c2(n)} \\cdot ${c2(m)}$.`,
      `$\\binom{${n}}{2}\\binom{${m}}{2} = ${c2(n)} \\cdot ${c2(m)}$。`,
    );
  }),
  countTips("Counting Overlapping Sets", "计算重叠的集合", ["the-union-of-sets", "the-inclusion-exclusion-principle"], (rng, hard) => {
    const [a, b, o, n] = [rng.int(12, 30), rng.int(12, 30), rng.int(2, 10), rng.int(5, 20)];
    if (!hard)
      return ask(
        rng,
        `Set $A$ has $${a}$ elements, set $B$ has $${b}$ elements and they share $${o}$. How many elements are in $A$ only?`,
        `集合 $A$ 有 $${a}$ 个元素，集合 $B$ 有 $${b}$ 个元素，公共元素 $${o}$ 个。只在 $A$ 中的元素有多少个？`,
        a - o,
        [a, a + b - o, b - o === a - o ? a - o + 1 : b - o, a + o],
        `Remove the shared elements.`,
        `去掉公共元素。`,
      );
    const total = a + b - o + n;
    return ask(
      rng,
      `Of $${total}$ students, $${a}$ take art, $${b}$ take music and $${n}$ take neither. How many take both?`,
      `$${total}$ 名学生中，$${a}$ 人上美术，$${b}$ 人上音乐，$${n}$ 人都不上。两门都上的有多少人？`,
      o,
      [o + n, a + b - total, total - a, o + 1],
      `$${a} + ${b} - x + ${n} = ${total}$.`,
      `$${a} + ${b} - x + ${n} = ${total}$。`,
    );
  }),
  countTips("Identifying Possible Set Sizes", "判断可能的集合大小", ["the-union-of-sets"], (rng, hard) => {
    const [a, b] = [rng.int(5, 15), rng.int(16, 30)];
    if (!hard)
      return ask(
        rng,
        `Set $A$ has $${a}$ elements and set $B$ has $${b}$ elements. What is the greatest possible number of elements in both sets?`,
        `集合 $A$ 有 $${a}$ 个元素，集合 $B$ 有 $${b}$ 个元素。同时在两个集合中的元素最多有多少个？`,
        a,
        [b, a + b, b - a, a - 1],
        `All of the smaller set could lie in the larger.`,
        `较小集合可能全部在较大集合中。`,
      );
    return ask(
      rng,
      `Set $A$ has $${a}$ elements and set $B$ has $${b}$ elements. What is the least possible number of elements in the union of $A$ and $B$?`,
      `集合 $A$ 有 $${a}$ 个元素，集合 $B$ 有 $${b}$ 个元素。$A$ 与 $B$ 的并集最少有多少个元素？`,
      b,
      [a, a + b, b - a, b + 1],
      `The union is smallest when $A$ lies inside $B$.`,
      `当 $A$ 在 $B$ 内时并集最小。`,
    );
  }),
  sampleTips("Estimating a Population Mean", "估计总体平均数", ["estimation-from-samples"], (rng, hard) => {
    const [n, k, m, e] = [rng.int(2, 10) * 50, rng.int(1, 9), rng.int(2, 12), rng.int(1, 5)];
    if (!hard)
      return ask(
        rng,
        `In a random sample of $${n}$ households, the mean number of pets is $${k}.5$. Which is the best estimate of the total number of pets in a town of $${n * 20}$ households?`,
        `随机抽取 $${n}$ 户，平均每户养宠物 $${k}.5$ 只。在有 $${n * 20}$ 户的城镇中，宠物总数的最佳估计是多少？`,
        (2 * k + 1) * n * 10,
        [k * n * 20, (2 * k + 1) * n, (2 * k + 1) * n * 20, (2 * k + 1) * n * 10 + n],
        `$${k}.5 \\times ${n * 20}$.`,
        `$${k}.5 \\times ${n * 20}$。`,
      );
    return ask(
      rng,
      `A random sample gives a mean of $${m * 10}$ with a margin of error of $${e}$. Which interval is the plausible range of the population mean?`,
      `随机样本的平均数是 $${m * 10}$，误差范围是 $${e}$。总体平均数的合理范围是哪个区间？`,
      `${m * 10 - e} \\text{ to } ${m * 10 + e}`,
      [
        `${m * 10} \\text{ to } ${m * 10 + e}`,
        `${m * 10 - e} \\text{ to } ${m * 10}`,
        `${m * 10 - 2 * e} \\text{ to } ${m * 10 + 2 * e}`,
        `${m * 10 - e - 1} \\text{ to } ${m * 10 + e + 1}`,
      ],
      `Go one margin of error on each side of the mean.`,
      `在平均数两侧各加减一个误差范围。`,
    );
  }),
  sampleTips("Applying the Empirical Rule", "应用经验法则", ["the-empirical-rule-for-the-normal-distribution"], (rng, hard) => {
    const [mu, s, n] = [rng.int(5, 20) * 5, rng.int(2, 10), rng.int(1, 10) * 400];
    if (!hard)
      return ask(
        rng,
        `A normal distribution has a mean of $${mu}$ and a standard deviation of $${s}$. About what percent of values lie between $${mu - s}$ and $${mu + s}$?`,
        `正态分布的平均数是 $${mu}$，标准差是 $${s}$。约百分之几的值在 $${mu - s}$ 和 $${mu + s}$ 之间？`,
        `68\\%`,
        [`34\\%`, `95\\%`, `99.7\\%`, `50\\%`],
        `This is within one standard deviation of the mean.`,
        `这是平均数一个标准差以内。`,
      );
    return ask(
      rng,
      `Scores on a test of $${n}$ students are normally distributed with a mean of $${mu}$ and a standard deviation of $${s}$. About how many students score above $${mu + 2 * s}$?`,
      `$${n}$ 名学生的成绩服从正态分布，平均数 $${mu}$，标准差 $${s}$。约多少名学生的成绩高于 $${mu + 2 * s}$？`,
      (n * 25) / 1000,
      [(n * 5) / 100, (n * 16) / 100, (n * 95) / 100, (n * 25) / 1000 + 5],
      `$95\\%$ lie within two deviations, so $2.5\\%$ lie above.`,
      `$95\\%$ 在两个标准差内，所以 $2.5\\%$ 在上方。`,
    );
  }),
];
