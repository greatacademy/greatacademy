import type { Rng } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { ExamSpec } from "../exam.ts";
import { curveFigure, dotsFigure, mc, sketchFigure, spec, spr, table, words } from "../exam.ts";

// SAT Math Prep, Problem-Solving and Data Analysis: sampling, statistics, data displays, probability, regression and data models.

const pickData = (rng: Rng, n: number, lo: number, hi: number): number[] => Array.from({ length: n }, () => rng.int(lo, hi));
const sorted = (xs: readonly number[]): number[] => [...xs].sort((a, b) => a - b);
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const medianOf = (xs: readonly number[]): Q => {
  const s = sorted(xs);
  const m = s.length >> 1;
  return s.length % 2 ? Q.of(s[m]!) : Q.of(s[m - 1]! + s[m]!, 2);
};
const list = (xs: readonly number[]): string => xs.join(", ");

const contexts = [
  [
    "students at a high school",
    "the members of the chess club",
    "高中的学生",
    "国际象棋俱乐部的成员",
    "favor a longer lunch",
    "赞成延长午餐时间",
  ],
  [
    "residents of a city",
    "the people at a downtown coffee shop",
    "某市的居民",
    "市中心咖啡馆里的人",
    "support a new bus line",
    "支持开通新公交线路",
  ],
  [
    "customers of a store",
    "the customers who filled out an online review",
    "某商店的顾客",
    "在网上写评论的顾客",
    "are satisfied with the store",
    "对商店满意",
  ],
  [
    "employees of a company",
    "the employees in one department",
    "某公司的员工",
    "某一部门的员工",
    "prefer working from home",
    "更喜欢在家办公",
  ],
] as const;

const boxFig = (min: number, q1: number, med: number, q3: number, max: number, lo: number, hi: number) => {
  const px = (v: number) => Math.round(30 + ((v - lo) / (hi - lo)) * 260);
  const ticks = Array.from({ length: 5 }, (_, i) => lo + ((hi - lo) * i) / 4);
  return sketchFigure(
    {
      segs: [
        [30, 190, 290, 190],
        ...ticks.map((v) => [px(v), 186, px(v), 194] as const),
        [px(min), 100, px(q1), 100],
        [px(q3), 100, px(max), 100],
        [px(min), 85, px(min), 115],
        [px(max), 85, px(max), 115],
        [px(q1), 70, px(q3), 70],
        [px(q1), 130, px(q3), 130],
        [px(q1), 70, px(q1), 130],
        [px(q3), 70, px(q3), 130],
        [px(med), 70, px(med), 130],
      ],
      labels: ticks.map((v) => [px(v), 212, String(v)] as const),
    },
    t(
      `A box plot on a number line: minimum ${min}, first quartile ${q1}, median ${med}, third quartile ${q3}, maximum ${max}.`,
      `数轴上的箱线图：最小值 ${min}，下四分位数 ${q1}，中位数 ${med}，上四分位数 ${q3}，最大值 ${max}。`,
    ),
  );
};

/** satExamData1 are the exam-style questions on sampling, statistics, data displays, probability, regression and data models. */
export const satExamData1: ExamSpec[] = [
  spec("Sampling Bias and Validity", "抽样偏差和有效性", ["biased-and-unbiased-samples"], (rng, hard) => {
    const [pop, bias, popZh, biasZh, opinion, opinionZh] = rng.pick(contexts);
    const n = rng.int(4, 40) * 5;
    if (!hard)
      return words(
        rng,
        t(
          `A researcher wants to estimate how many ${pop} ${opinion}. Which method gives the most valid estimate, using $${n}$ people?`,
          `研究者想估计${popZh}中有多少人${opinionZh}。用 $${n}$ 人时，哪种方法给出的估计最有效？`,
        ),
        t(`Surveying $${n}$ people chosen at random from all ${pop}`, `从全部${popZh}中随机抽取 $${n}$ 人调查`),
        [
          t(`Surveying $${n}$ of ${bias}`, `调查${biasZh}中的 $${n}$ 人`),
          t(`Surveying the first $${n}$ people who volunteer`, `调查最先自愿参加的 $${n}$ 人`),
          t(`Surveying $${n}$ friends of the researcher`, `调查研究者的 $${n}$ 位朋友`),
        ],
        t(`Only a random sample from the whole population avoids bias.`, `只有从整个总体中随机抽样才能避免偏差。`),
      );
    return words(
      rng,
      t(
        `To estimate how many ${pop} ${opinion}, a researcher surveyed $${n}$ of ${bias}. Which statement is true?`,
        `为估计${popZh}中有多少人${opinionZh}，研究者调查了${biasZh}中的 $${n}$ 人。哪个说法正确？`,
      ),
      t(
        `The results may be biased because the sample was not chosen at random from all ${pop}.`,
        `结果可能有偏差，因为样本不是从全部${popZh}中随机抽取的。`,
      ),
      [
        t(`The results are valid because $${n}$ people is a large sample.`, `结果有效，因为 $${n}$ 人是大样本。`),
        t(
          `The results apply to all ${pop} because everyone surveyed belongs to that group.`,
          `结果适用于全部${popZh}，因为被调查者都属于这个群体。`,
        ),
        t(`The results would be valid with any larger group of ${bias}.`, `只要${biasZh}的人数更多，结果就有效。`),
      ],
      t(`A larger sample does not repair a sample that was not random.`, `样本更大也无法弥补非随机抽样。`),
    );
  }),
  spec("Estimation From Proportions and Samples", "由比例和样本估计", ["estimation-from-samples"], (rng, hard) => {
    const [n, y, N] = [rng.pick([40, 50, 80, 100, 200]), rng.int(1, 9), rng.pick([500, 1000, 1500, 2000, 4000, 6000])];
    const part = (n * y * 10) / 100;
    if (!hard)
      return mc(
        rng,
        t(
          `In a random sample of $${n}$ voters from a town of $${N}$ voters, $${part}$ support a proposal. Based on this sample, about how many voters in the town support it?`,
          `从有 $${N}$ 名选民的镇上随机抽取 $${n}$ 名选民，其中 $${part}$ 人支持一项提案。据此估计，镇上约有多少选民支持？`,
        ),
        (N * y) / 10,
        [part, (N * y) / 20, N - (N * y) / 10 + 1],
        t(
          `The sample proportion is $\\frac{${part}}{${n}}$, and $${N}$ times it is $${(N * y) / 10}$.`,
          `样本比例为 $\\frac{${part}}{${n}}$，乘以 $${N}$ 得 $${(N * y) / 10}$。`,
        ),
      );
    return spr(
      t(
        `A factory tests a random sample of $${n}$ items and finds $${part}$ defective. If the factory makes $${N}$ items a day, how many of them are not defective, by this estimate?`,
        `工厂随机抽检 $${n}$ 件产品，发现 $${part}$ 件次品。若工厂每天生产 $${N}$ 件，据此估计其中有多少件不是次品？`,
      ),
      N - (N * y) / 10,
      [(N * y) / 10, n - part, N - part],
      t(
        `The defective share is $\\frac{${part}}{${n}}$, which is $${(N * y) / 10}$ items, leaving $${N - (N * y) / 10}$.`,
        `次品比例为 $\\frac{${part}}{${n}}$，即 $${(N * y) / 10}$ 件，剩下 $${N - (N * y) / 10}$ 件。`,
      ),
    );
  }),
  spec("Interpreting Survey Data", "解释调查数据", ["interpreting-survey-results"], (rng, hard) => {
    const [pop, , popZh, , opinion, opinionZh] = rng.pick(contexts);
    const [n, p] = [rng.int(2, 12) * 100, rng.int(2, 18) * 5];
    if (!hard)
      return words(
        rng,
        t(
          `In a random sample of $${n}$ ${pop}, $${p}\\%$ said they ${opinion}. Which conclusion is best supported?`,
          `随机抽取 $${n}$ 名${popZh}，$${p}\\%$ 的人表示${opinionZh}。哪个结论最有依据？`,
        ),
        t(`About $${p}\\%$ of all ${pop} ${opinion}.`, `全部${popZh}中约有 $${p}\\%$ 的人${opinionZh}。`),
        [
          t(`Exactly $${p}\\%$ of all ${pop} ${opinion}.`, `全部${popZh}中恰好 $${p}\\%$ 的人${opinionZh}。`),
          t(`About $${p}\\%$ of all adults in the country ${opinion}.`, `全国成年人中约有 $${p}\\%$ 的人${opinionZh}。`),
          t(`Most ${pop} would change their minds if asked again.`, `如果再问一次，大多数${popZh}会改变看法。`),
        ],
        t(
          `A random sample supports an approximate claim about the population it was drawn from, and no wider group.`,
          `随机样本只支持对其所抽取总体的近似结论，不能推广到更大的群体。`,
        ),
      );
    return spr(
      t(
        `In a random sample of $${n}$ ${pop}, $${p}\\%$ said they ${opinion}. How many people in the sample said so?`,
        `随机抽取 $${n}$ 名${popZh}，$${p}\\%$ 的人表示${opinionZh}。样本中有多少人这样说？`,
      ),
      (n * p) / 100,
      [n - (n * p) / 100, n, p],
      t(`$${p}\\%$ of $${n}$ is $${(n * p) / 100}$.`, `$${n}$ 的 $${p}\\%$ 是 $${(n * p) / 100}$。`),
    );
  }),
  spec("Margin of Error", "误差范围", ["sampling"], (rng, hard) => {
    const [p, m, N] = [rng.int(25, 75), rng.int(2, 6), rng.pick([2000, 4000, 5000, 10000, 20000])];
    if (!hard)
      return mc(
        rng,
        t(
          `A poll estimates that $${p}\\%$ of voters support a candidate, with a margin of error of $${m}\\%$. Which interval contains the plausible values for the percent of all voters who support the candidate?`,
          `一项民调估计 $${p}\\%$ 的选民支持某候选人，误差范围为 $${m}\\%$。哪个区间包含全部选民支持率的可能取值？`,
        ),
        `${p - m}\\% \\text{ to } ${p + m}\\%`,
        [
          `${p}\\% \\text{ to } ${p + m}\\%`,
          `${p - m}\\% \\text{ to } ${p}\\%`,
          `${p - 2 * m}\\% \\text{ to } ${p - m}\\%`,
          `${p + m}\\% \\text{ to } ${p + 2 * m}\\%`,
        ],
        t(`Take the estimate plus or minus the margin: $${p} \\pm ${m}$.`, `估计值加减误差范围：$${p} \\pm ${m}$。`),
      );
    return spr(
      t(
        `A poll of a town of $${N}$ voters estimates that $${p}\\%$ support a measure, with a margin of error of $${m}\\%$. What is the greatest plausible number of voters in the town who support it?`,
        `对有 $${N}$ 名选民的镇进行民调，估计 $${p}\\%$ 的人支持一项措施，误差范围为 $${m}\\%$。镇上支持者人数的最大可能值是多少？`,
      ),
      (N * (p + m)) / 100,
      [(N * p) / 100, (N * (p - m)) / 100, (N * (p + 2 * m)) / 100],
      t(
        `The greatest plausible percent is $${p + m}\\%$, and $${p + m}\\%$ of $${N}$ is $${(N * (p + m)) / 100}$.`,
        `最大可能百分比是 $${p + m}\\%$，$${N}$ 的 $${p + m}\\%$ 是 $${(N * (p + m)) / 100}$。`,
      ),
    );
  }),
  spec("The Mean of a Dataset", "数据集的平均数", ["mean-of-a-data-set"], (rng, hard) => {
    const xs = pickData(rng, 4, 3, 30);
    const m = rng.int(6, 25);
    xs.push(5 * m - sum(xs));
    if (!hard)
      return mc(
        rng,
        t(`What is the mean of the data set $${list(xs)}$?`, `数据集 $${list(xs)}$ 的平均数是多少？`),
        m,
        [sum(xs), medianOf(xs).add(Q.of(1)), m + 2],
        t(`The sum is $${sum(xs)}$, and $\\frac{${sum(xs)}}{5} = ${m}$.`, `总和为 $${sum(xs)}$，$\\frac{${sum(xs)}}{5} = ${m}$。`),
      );
    const add = rng.int(2, 9);
    return spr(
      t(
        `The mean of $5$ numbers is $${m}$. Each number is increased by $${add}$. What is the mean of the new numbers?`,
        `$5$ 个数的平均数是 $${m}$。每个数都增加 $${add}$。新数的平均数是多少？`,
      ),
      m + add,
      [m, 5 * m + add, m + 5 * add],
      t(`Adding the same amount to every value adds that amount to the mean.`, `每个值加上相同的数，平均数也加上这个数。`),
    );
  }),
  spec("The Median of a Dataset", "数据集的中位数", ["median-and-mode"], (rng, hard) => {
    const odd = pickData(rng, 7, 1, 40);
    const even = pickData(rng, 6, 1, 40);
    if (!hard)
      return mc(
        rng,
        t(`What is the median of the data set $${list(odd)}$?`, `数据集 $${list(odd)}$ 的中位数是多少？`),
        medianOf(odd),
        [
          odd[3]! === medianOf(odd).toNumber() ? odd[3]! + 1 : odd[3]!,
          Q.of(sum(odd), 7),
          sorted(odd)[2]! === medianOf(odd).toNumber() ? sorted(odd)[6]! + 1 : sorted(odd)[2]!,
        ],
        t(
          `Sorted, the data is $${list(sorted(odd))}$, and the fourth value is the middle.`,
          `排序后为 $${list(sorted(odd))}$，第四个值在中间。`,
        ),
      );
    return spr(
      t(`What is the median of the data set $${list(even)}$?`, `数据集 $${list(even)}$ 的中位数是多少？`),
      medianOf(even),
      [Q.of(sum(even), 6), sorted(even)[2]!, even[2]!],
      t(
        `Sorted, the data is $${list(sorted(even))}$. The median is the mean of the third and fourth values.`,
        `排序后为 $${list(sorted(even))}$。中位数是第三、第四个值的平均数。`,
      ),
    );
  }),
  spec("Comparing Measures of Center", "比较中心度量", ["mean-of-a-data-set", "median-and-mode"], (rng, hard) => {
    const a = rng.int(10, 30);
    const big = a * rng.int(5, 12);
    const xs = [a - 2, a - 1, a, a + 1, big];
    const mean = sum(xs) / 5;
    if (!hard)
      return words(
        rng,
        t(`For the data set $${list(xs)}$, how does the mean compare with the median?`, `对数据集 $${list(xs)}$，平均数与中位数相比如何？`),
        t("The mean is greater than the median.", "平均数大于中位数。"),
        [
          t("The mean is less than the median.", "平均数小于中位数。"),
          t("The mean equals the median.", "平均数等于中位数。"),
          t("The comparison cannot be made from the data.", "无法根据数据比较。"),
        ],
        t(
          `The median is $${a}$, while the large value $${big}$ pulls the mean up to $${mean}$.`,
          `中位数是 $${a}$，而大数 $${big}$ 把平均数拉到 $${mean}$。`,
        ),
      );
    return words(
      rng,
      t(
        `The value $${big}$ is removed from the data set $${list(xs)}$. Which statement describes the effect?`,
        `从数据集 $${list(xs)}$ 中去掉 $${big}$。哪个说法描述了其影响？`,
      ),
      t("The mean decreases more than the median.", "平均数比中位数下降得更多。"),
      [
        t("The median decreases more than the mean.", "中位数比平均数下降得更多。"),
        t("The mean and median decrease by the same amount.", "平均数和中位数下降相同的量。"),
        t("The mean increases and the median stays the same.", "平均数上升，中位数不变。"),
      ],
      t(
        `The mean falls from $${mean}$ to $${Q.of(sum(xs) - big, 4).toLatex()}$, while the median only moves from $${a}$ to $${Q.of(2 * a - 1, 2).toLatex()}$.`,
        `平均数从 $${mean}$ 降到 $${Q.of(sum(xs) - big, 4).toLatex()}$，而中位数只从 $${a}$ 变到 $${Q.of(2 * a - 1, 2).toLatex()}$。`,
      ),
    );
  }),
  spec("The Relationship Between Means and Sums", "平均数与总和的关系", ["combining-means"], (rng, hard) => {
    const [n, m, k, q] = [rng.int(5, 30), rng.int(60, 95), rng.int(5, 30), rng.int(60, 95)];
    if (!hard)
      return mc(
        rng,
        t(
          `The mean score of $${n}$ students on a test is $${m}$. What is the sum of their scores?`,
          `$${n}$ 名学生考试的平均分是 $${m}$。他们的总分是多少？`,
        ),
        n * m,
        [n + m, m, n * m + n],
        t(`Sum equals mean times count: $${n}(${m}) = ${n * m}$.`, `总和等于平均数乘个数：$${n}(${m}) = ${n * m}$。`),
      );
    return spr(
      t(
        `A class of $${n}$ students has a mean score of $${m}$, and a class of $${k}$ students has a mean score of $${q}$. What is the mean score of all $${n + k}$ students?`,
        `一个 $${n}$ 人的班平均分为 $${m}$，一个 $${k}$ 人的班平均分为 $${q}$。这 $${n + k}$ 名学生的平均分是多少？`,
      ),
      Q.of(n * m + k * q, n + k),
      [Q.of(m + q, 2), Q.of(n * m + k * q, 2), Q.of(m + q, n + k)],
      t(
        `The total is $${n * m} + ${k * q} = ${n * m + k * q}$, divided by $${n + k}$.`,
        `总分是 $${n * m} + ${k * q} = ${n * m + k * q}$，除以 $${n + k}$。`,
      ),
    );
  }),
  spec("Finding Unknown Observations From Centrality Measures", "由中心度量求未知观测值", ["combining-means"], (rng, hard) => {
    const xs = pickData(rng, 4, 60, 95);
    const miss = rng.int(60, 100);
    xs[0] = xs[0]! + ((5 - ((sum(xs) + miss) % 5)) % 5);
    const m = (sum(xs) + miss) / 5;
    if (!hard)
      return spr(
        t(
          `A student's scores on four tests are $${list(xs)}$. What score on the fifth test gives a mean of $${m}$?`,
          `一名学生四次考试的分数为 $${list(xs)}$。第五次考多少分才能使平均分为 $${m}$？`,
        ),
        miss,
        [m, 5 * m, sum(xs)],
        t(
          `The total must be $5(${m}) = ${5 * m}$, so the fifth value is $${5 * m} - ${sum(xs)} = ${miss}$.`,
          `总分必须是 $5(${m}) = ${5 * m}$，所以第五个值是 $${5 * m} - ${sum(xs)} = ${miss}$。`,
        ),
      );
    const v1 = rng.int(10, 30);
    const v2 = v1 + rng.int(1, 4);
    const xv = v2 + rng.int(1, 4);
    const v4 = xv + 2 * rng.int(1, 4);
    const v5 = v4 + rng.int(1, 5);
    const v6 = v5 + rng.int(1, 5);
    const midpoint = (xv + v4) / 2;
    return spr(
      t(
        `The data set $${v1}, ${v2}, x, ${v4}, ${v5}, ${v6}$ is written in increasing order, and its median is $${midpoint}$. What is the value of $x$?`,
        `数据集 $${v1}, ${v2}, x, ${v4}, ${v5}, ${v6}$ 按递增顺序排列，中位数为 $${midpoint}$。$x$ 的值是多少？`,
      ),
      xv,
      [midpoint, v4, 2 * midpoint + v4],
      t(
        `With six values, the median is the mean of the third and fourth: $\\frac{x + ${v4}}{2} = ${midpoint}$, so $x = 2(${midpoint}) - ${v4} = ${xv}$.`,
        `六个值时，中位数是第三和第四个值的平均数：$\\frac{x + ${v4}}{2} = ${midpoint}$，所以 $x = 2(${midpoint}) - ${v4} = ${xv}$。`,
      ),
    );
  }),
  spec("Tabular Datasets", "表格数据", ["frequency-tables"], (rng, hard) => {
    const ys = pickData(rng, 4, 10, 90);
    const labels = ["2021", "2022", "2023", "2024"];
    const tb = table("\\text{Year}", "\\text{Sales}", labels, ys);
    if (!hard)
      return mc(
        rng,
        t(
          `The table shows a store's sales in thousands of units. What were the total sales for all four years, in thousands of units?\n\n${tb}`,
          `表格给出某店的销量（千件）。四年总销量是多少千件？\n\n${tb}`,
        ),
        sum(ys),
        [Math.max(...ys), sum(ys) - ys[0]!, ys[0]! + ys[3]!],
        t(`Add all four values: $${sum(ys)}$.`, `四个值相加：$${sum(ys)}$。`),
      );
    return spr(
      t(
        `The table shows a store's sales in thousands of units. By how many thousand units did sales change from 2021 to 2024? Give the 2024 value minus the 2021 value.\n\n${tb}`,
        `表格给出某店的销量（千件）。从 2021 年到 2024 年销量变化了多少千件？（用 2024 年的值减 2021 年的值。）\n\n${tb}`,
      ),
      ys[3]! - ys[0]!,
      [ys[0]! - ys[3]!, ys[3]!, ys[2]! - ys[1]!],
      t(`$${ys[3]!} - ${ys[0]!} = ${ys[3]! - ys[0]!}$.`, `$${ys[3]!} - ${ys[0]!} = ${ys[3]! - ys[0]!}$。`),
    );
  }),
  spec("Frequency Tables", "频数表", ["frequency-tables"], (rng, hard) => {
    const vals = [1, 2, 3, 4, 5];
    const fr = pickData(rng, 5, 1, 12);
    const tb = table("\\text{Value}", "\\text{Frequency}", vals, fr);
    const total = sum(fr);
    if (!hard)
      return mc(
        rng,
        t(
          `The frequency table summarizes a data set. How many values are in the data set?\n\n${tb}`,
          `频数表总结了一个数据集。数据集有多少个值？\n\n${tb}`,
        ),
        total,
        [5, 15, total + 5],
        t(`Add the frequencies: $${total}$.`, `频数相加：$${total}$。`),
      );
    return spr(
      t(
        `The frequency table summarizes a data set. How many values in the data set are greater than $3$?\n\n${tb}`,
        `频数表总结了一个数据集。数据集中有多少个值大于 $3$？\n\n${tb}`,
      ),
      fr[3]! + fr[4]!,
      [fr[3]!, fr[2]! + fr[3]! + fr[4]!, total],
      t(
        `Add the frequencies of $4$ and $5$: $${fr[3]!} + ${fr[4]!} = ${fr[3]! + fr[4]!}$.`,
        `$4$ 和 $5$ 的频数相加：$${fr[3]!} + ${fr[4]!} = ${fr[3]! + fr[4]!}$。`,
      ),
    );
  }),
  spec("Box Plots", "箱线图", ["box-plots"], (rng, hard) => {
    const step = 5;
    const min = rng.int(1, 6) * step;
    const q1 = min + rng.int(1, 3) * step;
    const med = q1 + rng.int(1, 3) * step;
    const q3 = med + rng.int(1, 3) * step;
    const max = q3 + rng.int(1, 3) * step;
    const fig = boxFig(min, q1, med, q3, max, 0, 100);
    if (!hard)
      return mc(
        rng,
        t(`The box plot summarizes a data set. What is the median?`, `箱线图总结了一个数据集。中位数是多少？`),
        med,
        [q1, q3, max],
        t(`The line inside the box marks the median, $${med}$.`, `箱内的线表示中位数，为 $${med}$。`),
        fig,
      );
    return spr(
      t(`The box plot summarizes a data set. What is the interquartile range?`, `箱线图总结了一个数据集。四分位距是多少？`),
      q3 - q1,
      [max - min, med, q3],
      t(
        `The interquartile range is the width of the box: $${q3} - ${q1} = ${q3 - q1}$.`,
        `四分位距是箱子的宽度：$${q3} - ${q1} = ${q3 - q1}$。`,
      ),
      fig,
    );
  }),
  spec(
    "Measuring Centrality From Frequency Tables",
    "由频数表求中心度量",
    ["calculating-means-from-frequency-tables", "calculating-medians-from-frequency-tables"],
    (rng, hard) => {
      const vals = [2, 4, 6, 8];
      const fr = pickData(rng, 4, 1, 9);
      const n = sum(fr);
      const tot = sum(fr.map((f, i) => f * vals[i]!));
      const tb = table("\\text{Value}", "\\text{Frequency}", vals, fr);
      const all = vals.flatMap((v, i) => Array.from({ length: fr[i]! }, () => v));
      if (!hard)
        return spr(
          t(
            `The frequency table summarizes a data set. What is the mean of the data?\n\n${tb}`,
            `频数表总结了一个数据集。数据的平均数是多少？\n\n${tb}`,
          ),
          Q.of(tot, n),
          [5, Q.of(tot, 4), Q.of(n, 4)],
          t(`The sum of the values is $${tot}$ and there are $${n}$ values.`, `值的总和是 $${tot}$，共 $${n}$ 个值。`),
        );
      return spr(
        t(
          `The frequency table summarizes a data set. What is the median of the data?\n\n${tb}`,
          `频数表总结了一个数据集。数据的中位数是多少？\n\n${tb}`,
        ),
        medianOf(all),
        [Q.of(tot, n), Q.of(n, 2), Q.of(5).add(Q.of(1, 2))],
        t(`There are $${n}$ values. Count through the table to the middle position.`, `共有 $${n}$ 个值。沿表格数到中间的位置。`),
      );
    },
  ),
  spec("Bounding Statistical Metrics", "估计统计量的范围", ["bounding-statistics-for-grouped-data"], (rng, hard) => {
    const fr = pickData(rng, 3, 2, 12);
    const w = rng.pick([5, 10, 20, 25]);
    const lo = rng.int(1, 4) * 10;
    const tops = [0, 1, 2].map((i) => lo + (i + 1) * w - 1);
    const groups = [0, 1, 2].map((i) => `${lo + i * w}\\text{-}${tops[i]!}`);
    const tb = table("\\text{Range}", "\\text{Frequency}", groups, fr);
    const most = sum(fr.map((f, i) => f * tops[i]!));
    const least = sum(fr.map((f, i) => f * (lo + i * w)));
    if (!hard)
      return spr(
        t(
          `The table groups a data set of integers. What is the greatest possible value of the sum of the data?\n\n${tb}`,
          `表格给出一个整数数据集的分组。数据总和的最大可能值是多少？\n\n${tb}`,
        ),
        most,
        [least, tops[2]! * sum(fr), tops[2]! * fr[2]!],
        t(
          `Take each value at the top of its group: $${tops[0]!}$, $${tops[1]!}$ and $${tops[2]!}$.`,
          `每个值取其组的上限：$${tops[0]!}$、$${tops[1]!}$ 和 $${tops[2]!}$。`,
        ),
      );
    return spr(
      t(
        `The table groups a data set of integers. What is the greatest possible range of the data?\n\n${tb}`,
        `表格给出一个整数数据集的分组。数据的极差最大可能是多少？\n\n${tb}`,
      ),
      tops[2]! - lo,
      [2 * w, tops[2]!, tops[1]! - lo],
      t(
        `The greatest range uses the smallest possible minimum, $${lo}$, and the largest possible maximum, $${tops[2]!}$.`,
        `最大极差取最小值的下限 $${lo}$ 和最大值的上限 $${tops[2]!}$。`,
      ),
    );
  }),
  spec("Comparing Data Sets", "比较数据集", ["comparing-effects-of-data-change-on-measures-of-centrality"], (rng, hard) => {
    const a = rng.int(10, 40);
    const d = rng.int(1, 3);
    const e = d + rng.int(3, 8);
    const A = [a - 2 * d, a - d, a, a + d, a + 2 * d];
    const B = [a - 2 * e, a - e, a, a + e, a + 2 * e];
    if (!hard)
      return words(
        rng,
        t(
          `Data set A is $${list(A)}$ and data set B is $${list(B)}$. Which statement is true?`,
          `数据集 A 是 $${list(A)}$，数据集 B 是 $${list(B)}$。哪个说法正确？`,
        ),
        t("The sets have equal means, and set B has the greater standard deviation.", "两组平均数相等，B 组标准差更大。"),
        [
          t("The sets have equal means, and set A has the greater standard deviation.", "两组平均数相等，A 组标准差更大。"),
          t("Set B has the greater mean and the same standard deviation.", "B 组平均数更大，标准差相同。"),
          t("Set A has the greater mean and the greater standard deviation.", "A 组平均数更大，标准差也更大。"),
        ],
        t(
          `Both sets are symmetric about $${a}$, and the values in B lie farther from the center.`,
          `两组都关于 $${a}$ 对称，B 组的值离中心更远。`,
        ),
      );
    return spr(
      t(
        `Data set A is $${list(A)}$ and data set B is $${list(B)}$. What is the range of B minus the range of A?`,
        `数据集 A 是 $${list(A)}$，数据集 B 是 $${list(B)}$。B 的极差减 A 的极差是多少？`,
      ),
      4 * (e - d),
      [e - d, 2 * (e - d), 4 * e],
      t(
        `The ranges are $${4 * e}$ and $${4 * d}$, whose difference is $${4 * (e - d)}$.`,
        `极差为 $${4 * e}$ 和 $${4 * d}$，相差 $${4 * (e - d)}$。`,
      ),
    );
  }),
  spec(
    "Comparing Data Sets Presented Visually",
    "比较以图形呈现的数据集",
    ["comparing-effects-of-data-change-on-measures-of-centrality", "box-plots"],
    (rng, hard) => {
      const q = rng.int(2, 6) * 5;
      const d = rng.int(1, 3) * 5;
      const e = rng.int(1, 3) * 5;
      const figA = boxFig(q - 5, q, q + d, q + 2 * d, q + 2 * d + 5, 0, 100);
      if (!hard)
        return spr(
          t(
            `The box plot shows data set A. Data set B has every value of A increased by $${e}$. What is the median of data set B?`,
            `箱线图显示数据集 A。数据集 B 的每个值都比 A 大 $${e}$。数据集 B 的中位数是多少？`,
          ),
          q + d + e,
          [q + d, q + e, q + 2 * d],
          t(`The median of A is $${q + d}$, and the shift adds $${e}$.`, `A 的中位数是 $${q + d}$，平移增加 $${e}$。`),
          figA,
        );
      return spr(
        t(
          `The box plot shows data set A. Data set B has every value of A increased by $${e}$. What is the interquartile range of data set B?`,
          `箱线图显示数据集 A。数据集 B 的每个值都比 A 大 $${e}$。数据集 B 的四分位距是多少？`,
        ),
        2 * d,
        [2 * d + e, e, q],
        t(
          `A shift does not change spread, so the interquartile range stays $${2 * d}$.`,
          `平移不改变离散程度，所以四分位距仍为 $${2 * d}$。`,
        ),
        figA,
      );
    },
  ),
  spec(
    "Comparing Centrality Measures From Frequency Tables",
    "由频数表比较中心度量",
    ["calculating-means-from-frequency-tables"],
    (rng, hard) => {
      const low = rng.int(4, 12);
      const high = rng.int(1, 3);
      const tb = table("\\text{Value}", "\\text{Frequency}", [1, 2, 3, 20], [low, low, low, high]);
      const n = 3 * low + high;
      const tot = 6 * low + 20 * high;
      if (!hard)
        return words(
          rng,
          t(`For the data in the frequency table, which statement is true?\n\n${tb}`, `对频数表中的数据，哪个说法正确？\n\n${tb}`),
          t("The mean is greater than the median.", "平均数大于中位数。"),
          [
            t("The mean is less than the median.", "平均数小于中位数。"),
            t("The mean equals the median.", "平均数等于中位数。"),
            t("The median is greater than $3$.", "中位数大于 $3$。"),
          ],
          t(
            `The median is $2$, and the largest value, $20$, pulls the mean up to $\\frac{${tot}}{${n}}$.`,
            `中位数是 $2$，最大的数 $20$ 把平均数抬高到 $\\frac{${tot}}{${n}}$。`,
          ),
        );
      return spr(
        t(
          `For the data in the frequency table, what is the mean minus the median?\n\n${tb}`,
          `对频数表中的数据，平均数减中位数是多少？\n\n${tb}`,
        ),
        Q.of(tot, n).sub(Q.of(2)),
        [Q.of(tot, n), Q.of(tot, 4).sub(Q.of(2)), 2],
        t(
          `The mean is $\\frac{${tot}}{${n}}$ and the median is $2$, so the difference is $${Q.of(tot, n).sub(Q.of(2)).toLatex()}$.`,
          `平均数是 $\\frac{${tot}}{${n}}$，中位数是 $2$，所以差是 $${Q.of(tot, n).sub(Q.of(2)).toLatex()}$。`,
        ),
      );
    },
  ),
  spec(
    "Comparing Centrality Measures With Symmetric Datasets",
    "比较对称数据集的中心度量",
    ["mean-of-a-data-set", "median-and-mode"],
    (rng, hard) => {
      const a = rng.int(10, 40);
      const [p, q] = [rng.int(1, 4), rng.int(5, 9)];
      const xs = [a - q, a - p, a, a + p, a + q];
      if (!hard)
        return words(
          rng,
          t(`For the data set $${list(xs)}$, which statement is true?`, `对数据集 $${list(xs)}$，哪个说法正确？`),
          t("The mean equals the median.", "平均数等于中位数。"),
          [
            t("The mean is greater than the median.", "平均数大于中位数。"),
            t("The mean is less than the median.", "平均数小于中位数。"),
            t("The mean and median cannot be compared.", "平均数与中位数无法比较。"),
          ],
          t(`The data is symmetric about $${a}$, so both equal $${a}$.`, `数据关于 $${a}$ 对称，所以两者都等于 $${a}$。`),
        );
      return spr(
        t(
          `The values of a symmetric data set are $${list(xs.slice(0, 2))}, ${a}, ${a + p}$ and one more value. What is the missing value?`,
          `一个对称数据集的值为 $${list(xs.slice(0, 2))}, ${a}, ${a + p}$ 和另一个值。缺失的值是多少？`,
        ),
        a + q,
        [a + p + 1, a, a - q],
        t(
          `The value $${a - q}$ needs a partner the same distance above $${a}$, which is $${a + q}$.`,
          `$${a - q}$ 需要在 $${a}$ 上方等距的对应值，即 $${a + q}$。`,
        ),
      );
    },
  ),
  spec(
    "Comparing Statistical Effects of Data Change",
    "比较数据变化的统计效果",
    ["statistical-effects-of-data-transformations"],
    (rng, hard) => {
      const xs = sorted(pickData(rng, 5, 10, 30));
      const k = rng.int(2, 5);
      if (!hard)
        return words(
          rng,
          t(
            `Each value in the data set $${list(xs)}$ is increased by $${k}$. Which statement is true of the new data set?`,
            `数据集 $${list(xs)}$ 的每个值都增加 $${k}$。关于新数据集，哪个说法正确？`,
          ),
          t("The mean increases, and the standard deviation stays the same.", "平均数增加，标准差不变。"),
          [
            t("The mean stays the same, and the standard deviation increases.", "平均数不变，标准差增加。"),
            t("Both the mean and the standard deviation increase.", "平均数和标准差都增加。"),
            t("Neither the mean nor the standard deviation changes.", "平均数和标准差都不变。"),
          ],
          t(
            `A shift moves the center by $${k}$ and leaves the distances between values unchanged.`,
            `平移使中心移动 $${k}$，值之间的距离不变。`,
          ),
        );
      return spr(
        t(
          `Each value in the data set $${list(xs)}$ is multiplied by $${k}$. What is the range of the new data set?`,
          `数据集 $${list(xs)}$ 的每个值都乘以 $${k}$。新数据集的极差是多少？`,
        ),
        k * (xs[4]! - xs[0]!),
        [xs[4]! - xs[0]!, k * xs[4]!, xs[4]! - xs[0]! + k],
        t(
          `Multiplying scales the range: $${k}(${xs[4]!} - ${xs[0]!}) = ${k * (xs[4]! - xs[0]!)}$.`,
          `相乘使极差按比例变化：$${k}(${xs[4]!} - ${xs[0]!}) = ${k * (xs[4]! - xs[0]!)}$。`,
        ),
      );
    },
  ),
  spec(
    "Effects of Additional Data on Centrality Measures",
    "新增数据对中心度量的影响",
    ["comparing-effects-of-data-change-on-measures-of-centrality"],
    (rng, hard) => {
      const [n, m, extra] = [rng.int(4, 20), rng.int(10, 60), rng.int(2, 9)];
      if (!hard)
        return words(
          rng,
          t(
            `A data set of $${n}$ values has a mean of $${m}$. A new value of $${m + extra}$ is added. What happens to the mean?`,
            `一个有 $${n}$ 个值的数据集平均数为 $${m}$。新增一个值 $${m + extra}$。平均数如何变化？`,
          ),
          t("It increases.", "增加。"),
          [t("It decreases.", "减少。"), t("It stays the same.", "不变。"), t("It cannot be determined.", "无法确定。")],
          t(`The new value is above the mean, so it pulls the mean up.`, `新值高于平均数，所以把平均数拉高。`),
        );
      return spr(
        t(
          `A data set of $${n}$ values has a mean of $${m}$. A new value of $${m + extra * (n + 1)}$ is added. What is the new mean?`,
          `一个有 $${n}$ 个值的数据集平均数为 $${m}$。新增一个值 $${m + extra * (n + 1)}$。新的平均数是多少？`,
        ),
        m + extra,
        [m, m + extra * (n + 1), Q.of(2 * m + extra * (n + 1), 2)],
        t(
          `The new sum is $${n * m} + ${m + extra * (n + 1)}$, and dividing by $${n + 1}$ gives $${m + extra}$.`,
          `新总和是 $${n * m} + ${m + extra * (n + 1)}$，除以 $${n + 1}$ 得 $${m + extra}$。`,
        ),
      );
    },
  ),
  spec("Simple Probabilities in Real-World Contexts", "现实情境中的简单概率", ["single-events-in-probability"], (rng, hard) => {
    const [r, b, g] = [rng.int(2, 9), rng.int(5, 15), rng.int(5, 15)];
    const n = r + b + g;
    if (!hard)
      return mc(
        rng,
        t(
          `A bag has $${r}$ red, $${b}$ blue and $${g}$ green marbles. If one marble is chosen at random, what is the probability that it is red?`,
          `袋中有 $${r}$ 颗红、$${b}$ 颗蓝、$${g}$ 颗绿弹珠。随机取一颗，取到红色的概率是多少？`,
        ),
        Q.of(r, n),
        [Q.of(r, b + g), Q.of(b + g, n), Q.of(1, 3)],
        t(`$${r}$ of the $${n}$ marbles are red.`, `$${n}$ 颗弹珠中有 $${r}$ 颗是红色。`),
      );
    return spr(
      t(
        `A bag has $${r}$ red, $${b}$ blue and $${g}$ green marbles. How many red marbles must be added so that the probability of choosing red is $\\frac{1}{2}$?`,
        `袋中有 $${r}$ 颗红、$${b}$ 颗蓝、$${g}$ 颗绿弹珠。需要加入多少颗红弹珠才能使取到红色的概率为 $\\frac{1}{2}$？`,
      ),
      b + g - r,
      [b + g, r, n],
      t(
        `Red must equal the rest: $${r} + x = ${b + g}$, so $x = ${b + g - r}$.`,
        `红色数量要等于其余数量：$${r} + x = ${b + g}$，所以 $x = ${b + g - r}$。`,
      ),
    );
  }),
  spec("Calculating Probabilities From Datasets", "由数据集计算概率", ["experimental-probability"], (rng, hard) => {
    const xs = pickData(rng, 10, 1, 20);
    const cut = rng.int(6, 15);
    const above = xs.filter((v) => v > cut).length;
    const even = xs.filter((v) => v % 2 === 0).length;
    if (!hard)
      return spr(
        t(
          `One number is chosen at random from the list $${list(xs)}$. What is the probability that it is greater than $${cut}$?`,
          `从列表 $${list(xs)}$ 中随机选一个数。它大于 $${cut}$ 的概率是多少？`,
        ),
        Q.of(above, 10),
        [Q.of(10 - above, 10), Q.of(cut, 20), Q.of(above + 1, 10)],
        t(`$${above}$ of the $10$ numbers exceed $${cut}$.`, `$10$ 个数中有 $${above}$ 个大于 $${cut}$。`),
      );
    return spr(
      t(
        `One number is chosen at random from the list $${list(xs)}$. What is the probability that it is even?`,
        `从列表 $${list(xs)}$ 中随机选一个数。它是偶数的概率是多少？`,
      ),
      Q.of(even, 10),
      [Q.of(10 - even, 10), Q.of(1, 2).add(Q.of(1, 5)), Q.of(even + 1, 10)],
      t(`$${even}$ of the $10$ numbers are even.`, `$10$ 个数中有 $${even}$ 个是偶数。`),
    );
  }),
  spec(
    "Simple Probabilities From Two-Way Frequency Tables",
    "由双向频数表求简单概率",
    ["calculating-relative-frequencies-from-two-way-tables"],
    (rng, hard) => {
      const [a, b, c, d] = pickData(rng, 4, 5, 40) as [number, number, number, number];
      const n = a + b + c + d;
      const tb = `$$\\begin{array}{c|cc|c} & \\text{Yes} & \\text{No} & \\text{Total} \\\\ \\hline \\text{Juniors} & ${a} & ${b} & ${a + b} \\\\ \\text{Seniors} & ${c} & ${d} & ${c + d} \\\\ \\hline \\text{Total} & ${a + c} & ${b + d} & ${n} \\end{array}$$`;
      if (!hard)
        return mc(
          rng,
          t(
            `The table shows survey responses. If one person is chosen at random, what is the probability of choosing a junior who answered yes?\n\n${tb}`,
            `表格显示调查结果。随机选一人，选到回答“是”的三年级学生（Juniors）的概率是多少？\n\n${tb}`,
          ),
          Q.of(a, n),
          [Q.of(a, a + b), Q.of(a, a + c), Q.of(a + c, n)],
          t(`The cell gives $${a}$, and the grand total is $${n}$.`, `单元格给出 $${a}$，总计是 $${n}$。`),
        );
      return spr(
        t(
          `The table shows survey responses. If one person is chosen at random, what is the probability that the person is a senior?\n\n${tb}`,
          `表格显示调查结果。随机选一人，此人是四年级学生（Seniors）的概率是多少？\n\n${tb}`,
        ),
        Q.of(c + d, n),
        [Q.of(c, n), Q.of(a + b, n), Q.of(d, n)],
        t(`The seniors' row total is $${c + d}$, out of $${n}$.`, `Seniors 行的合计是 $${c + d}$，总数是 $${n}$。`),
      );
    },
  ),
  spec(
    "Conditional Probabilities From Two-Way Frequency Tables",
    "由双向频数表求条件概率",
    ["conditional-probabilities-from-tables"],
    (rng, hard) => {
      const [a, b, c, d] = pickData(rng, 4, 5, 40) as [number, number, number, number];
      const n = a + b + c + d;
      const tb = `$$\\begin{array}{c|cc|c} & \\text{Yes} & \\text{No} & \\text{Total} \\\\ \\hline \\text{Juniors} & ${a} & ${b} & ${a + b} \\\\ \\text{Seniors} & ${c} & ${d} & ${c + d} \\\\ \\hline \\text{Total} & ${a + c} & ${b + d} & ${n} \\end{array}$$`;
      if (!hard)
        return mc(
          rng,
          t(
            `The table shows survey responses. Given that a person chosen at random is a junior, what is the probability that the person answered yes?\n\n${tb}`,
            `表格显示调查结果。已知随机选到的人是 Juniors，此人回答“是”的概率是多少？\n\n${tb}`,
          ),
          Q.of(a, a + b),
          [Q.of(a, n), Q.of(a, a + c), Q.of(b, a + b)],
          t(`Only the $${a + b}$ juniors count, and $${a}$ of them said yes.`, `只算 $${a + b}$ 名 Juniors，其中 $${a}$ 人回答“是”。`),
        );
      return spr(
        t(
          `The table shows survey responses. Given that a person chosen at random answered no, what is the probability that the person is a senior?\n\n${tb}`,
          `表格显示调查结果。已知随机选到的人回答“否”，此人是 Seniors 的概率是多少？\n\n${tb}`,
        ),
        Q.of(d, b + d),
        [Q.of(d, c + d), Q.of(d, n), Q.of(b, b + d)],
        t(
          `Only the $${b + d}$ who said no count, and $${d}$ of them are seniors.`,
          `只算回答“否”的 $${b + d}$ 人，其中 $${d}$ 人是 Seniors。`,
        ),
      );
    },
  ),
  spec("Calculating Conditional Probabilities", "计算条件概率", ["the-multiplication-law-for-conditional-probability"], (rng, hard) => {
    const [n, p, q] = [rng.int(1, 8) * 100, rng.int(2, 8) * 10, rng.int(1, 9) * 10];
    const A = (n * p) / 100;
    const both = (A * q) / 100;
    if (!hard)
      return spr(
        t(
          `Of $${n}$ members of a gym, $${p}\\%$ take classes. Of those who take classes, $${q}\\%$ also swim. What is the probability that a member chosen at random from those who take classes also swims?`,
          `健身房 $${n}$ 名会员中，$${p}\\%$ 上课。上课的人中有 $${q}\\%$ 也游泳。从上课者中随机选一人，此人也游泳的概率是多少？`,
        ),
        Q.of(q, 100),
        [Q.of(p, 100), Q.of(p * q, 10000), Q.of(100 - q, 100)],
        t(
          `The condition is already "those who take classes," so the probability is $${q}\\%$.`,
          `条件已是“上课的人”，所以概率是 $${q}\\%$。`,
        ),
      );
    return spr(
      t(
        `Of $${n}$ members of a gym, $${p}\\%$ take classes. Of those who take classes, $${q}\\%$ also swim. How many members both take classes and swim?`,
        `健身房 $${n}$ 名会员中，$${p}\\%$ 上课。上课的人中有 $${q}\\%$ 也游泳。有多少会员既上课又游泳？`,
      ),
      Q.of(Math.round(both * 100), 100),
      [A, Q.of((n * q) / 100), n],
      t(
        `$${p}\\%$ of $${n}$ is $${A}$, and $${q}\\%$ of $${A}$ is the answer.`,
        `$${n}$ 的 $${p}\\%$ 是 $${A}$，$${A}$ 的 $${q}\\%$ 就是答案。`,
      ),
    );
  }),
  spec("Making Predictions Using Best-Fit Lines", "用最佳拟合线预测", ["scatter-plots"], (rng, hard) => {
    const [m, b, x] = [rng.int(2, 9), rng.int(1, 30), rng.int(2, 20)];
    if (!hard)
      return mc(
        rng,
        t(
          `A line of best fit for a data set is $y = ${m}x + ${b}$. What $y$-value does the line predict when $x = ${x}$?`,
          `一个数据集的最佳拟合线为 $y = ${m}x + ${b}$。当 $x = ${x}$ 时，直线预测的 $y$ 值是多少？`,
        ),
        m * x + b,
        [m * x, m + x + b, m * (x + b)],
        t(`Substitute: $${m}(${x}) + ${b} = ${m * x + b}$.`, `代入：$${m}(${x}) + ${b} = ${m * x + b}$。`),
      );
    return spr(
      t(
        `A line of best fit for a data set is $y = ${m}x + ${b}$. For what value of $x$ does the line predict $y = ${m * x + b}$?`,
        `一个数据集的最佳拟合线为 $y = ${m}x + ${b}$。$x$ 为何值时，直线预测 $y = ${m * x + b}$？`,
      ),
      x,
      [m * x, x + b, x + 1],
      t(`$${m}x + ${b} = ${m * x + b}$, so $x = ${x}$.`, `$${m}x + ${b} = ${m * x + b}$，所以 $x = ${x}$。`),
    );
  }),
  spec("The Slope of a Best-Fit Line", "最佳拟合线的斜率", ["comparing-data-points-to-lines-of-best-fit"], (rng, hard) => {
    const [m, b] = [rng.int(2, 9), rng.int(5, 40)];
    if (!hard)
      return words(
        rng,
        t(
          `A line of best fit $y = ${m}x + ${b}$ models a plant's height $y$, in centimeters, after $x$ weeks. What does $${m}$ represent?`,
          `最佳拟合线 $y = ${m}x + ${b}$ 描述植物 $x$ 周后的高度 $y$（厘米）。$${m}$ 表示什么？`,
        ),
        t("The predicted increase in height per week, in centimeters", "预测的每周高度增加量（厘米）"),
        [
          t("The predicted height at the start, in centimeters", "预测的起始高度（厘米）"),
          t("The number of weeks the plant grew", "植物生长的周数"),
          t("The predicted height after one week, in centimeters", "预测的一周后高度（厘米）"),
        ],
        t(`The slope is the predicted change in $y$ per unit of $x$.`, `斜率是 $x$ 每增加一个单位时 $y$ 的预测变化量。`),
      );
    const [x1, x2] = [rng.int(1, 4), rng.int(5, 9)];
    return spr(
      t(
        `A line of best fit passes through $(${x1}, ${m * x1 + b})$ and $(${x2}, ${m * x2 + b})$. What is its slope?`,
        `最佳拟合线经过 $(${x1}, ${m * x1 + b})$ 和 $(${x2}, ${m * x2 + b})$。它的斜率是多少？`,
      ),
      m,
      [b, m * (x2 - x1), m + 1],
      t(
        `$\\frac{${m * x2 + b} - ${m * x1 + b}}{${x2} - ${x1}} = ${m}$.`,
        `$\\frac{${m * x2 + b} - ${m * x1 + b}}{${x2} - ${x1}} = ${m}$。`,
      ),
    );
  }),
  spec("Identifying Best-Fit Lines", "识别最佳拟合线", ["scatter-plots"], (rng, hard) => {
    const m = rng.pick([1, 2, 3]);
    const b = rng.int(1, 6);
    const xs = [1, 2, 3, 4, 5, 6, 7, 8];
    const pts = xs.map((x) => [x, Math.min(30, m * x + b + rng.pick([-1, 0, 1]))] as const);
    const fig = dotsFigure(pts, { x: [0, 9], y: [0, 32], dx: 1, dy: 4 }, t("A scatterplot of eight points.", "八个点的散点图。"));
    const lead = m === 1 ? "" : `${m}`;
    if (!hard)
      return mc(
        rng,
        t(`Which equation best fits the data in the scatterplot?`, `哪个方程最符合散点图中的数据？`),
        `y = ${lead}x + ${b}`,
        [`y = -${lead}x + ${b}`, `y = ${m + 3}x + ${b + 10}`, `y = ${lead}x + ${b + 14}`, `y = \\frac{1}{${m + 3}}x + ${b}`],
        t(`The points rise by about $${m}$ per unit and start near $${b}$.`, `这些点每个单位上升约 $${m}$，起点接近 $${b}$。`),
        fig,
      );
    return words(
      rng,
      t(`Which statement describes the association in the scatterplot?`, `哪个说法描述了散点图中的关系？`),
      t("A positive linear association", "正线性关系"),
      [
        t("A negative linear association", "负线性关系"),
        t("A curved association that decreases and then increases", "先降后升的曲线关系"),
        t("No association", "没有关系"),
      ],
      t(`The points rise roughly along a line, so the association is positive and linear.`, `这些点大致沿直线上升，所以是正线性关系。`),
      fig,
    );
  }),
  spec("Analyzing Residuals of Best-Fit Lines", "分析最佳拟合线的残差", ["comparing-data-points-to-lines-of-best-fit"], (rng, hard) => {
    const [m, b, x, r] = [rng.int(2, 9), rng.int(1, 20), rng.int(2, 15), rng.nonZero(-6, 6)];
    const pred = m * x + b;
    if (!hard)
      return spr(
        t(
          `A line of best fit is $y = ${m}x + ${b}$. A data point is $(${x}, ${pred + r})$. What is the residual of this point, the actual value minus the predicted value?`,
          `最佳拟合线为 $y = ${m}x + ${b}$。一个数据点为 $(${x}, ${pred + r})$。这个点的残差（实际值减预测值）是多少？`,
        ),
        r,
        [-r, pred, pred + r],
        t(`The prediction is $${pred}$, and $${pred + r} - ${pred} = ${r}$.`, `预测值是 $${pred}$，$${pred + r} - ${pred} = ${r}$。`),
      );
    return words(
      rng,
      t(
        `A line of best fit is $y = ${m}x + ${b}$. Relative to the line, where does the data point $(${x}, ${pred + r})$ lie?`,
        `最佳拟合线为 $y = ${m}x + ${b}$。数据点 $(${x}, ${pred + r})$ 相对于直线在什么位置？`,
      ),
      r > 0
        ? t(`Above the line, by $${r}$ units`, `在直线上方 $${r}$ 个单位`)
        : t(`Below the line, by $${-r}$ units`, `在直线下方 $${-r}$ 个单位`),
      r > 0
        ? [
            t(`Below the line, by $${r}$ units`, `在直线下方 $${r}$ 个单位`),
            t("On the line", "在直线上"),
            t(`Above the line, by $${r + 1}$ units`, `在直线上方 $${r + 1}$ 个单位`),
          ]
        : [
            t(`Above the line, by $${-r}$ units`, `在直线上方 $${-r}$ 个单位`),
            t("On the line", "在直线上"),
            t(`Below the line, by $${1 - r}$ units`, `在直线下方 $${1 - r}$ 个单位`),
          ],
      t(
        `The predicted value at $x = ${x}$ is $${pred}$, and the point's value is $${pred + r}$.`,
        `$x = ${x}$ 时预测值为 $${pred}$，而点的值为 $${pred + r}$。`,
      ),
    );
  }),
  spec("Interpreting Data Plots", "解释数据图", ["scatter-plots"], (rng, hard) => {
    const ys = pickData(rng, 7, 2, 20);
    const pts = ys.map((y, i) => [i + 1, y] as const);
    const fig = dotsFigure(pts, { x: [0, 8], y: [0, 22], dx: 1, dy: 2 }, t("A plot of seven points.", "七个点的图。"));
    const top = Math.max(...ys);
    if (!hard)
      return spr(
        t(`What is the greatest $y$-value in the plot shown?`, `图中最大的 $y$ 值是多少？`),
        top,
        [Math.min(...ys), ys[0]!, top + 2],
        t(`The highest point has a $y$-value of $${top}$.`, `最高点的 $y$ 值为 $${top}$。`),
        fig,
      );
    const m = ys.filter((y) => y > 10).length;
    return spr(
      t(`For how many of the plotted points is $y$ greater than $10$?`, `图中有多少个点的 $y$ 大于 $10$？`),
      m,
      [7 - m, m + 1, 10],
      t(`Count the points above the line $y = 10$: $${m}$.`, `数出在 $y = 10$ 以上的点：$${m}$ 个。`),
      fig,
    );
  }),
  spec("Interpreting Time-Series Graphs", "解释时间序列图", ["the-average-rate-of-change-of-a-function"], (rng, hard) => {
    const peak = rng.int(3, 7);
    const top = rng.int(3, 8) * 4;
    const a = top / (peak * peak);
    const fig = curveFigure(
      (x) => top - a * (x - peak) * (x - peak),
      { x: [0, 2 * peak], y: [0, top + 4], dx: 1, dy: 4 },
      t("A curve of temperature against time.", "温度随时间变化的曲线。"),
    );
    if (!hard)
      return spr(
        t(
          `The graph shows a temperature, in degrees Celsius, $x$ hours after sunrise. How many hours after sunrise is the temperature greatest?`,
          `图中是日出后 $x$ 小时的温度（摄氏度）。日出后多少小时温度最高？`,
        ),
        peak,
        [top, 2 * peak, peak + 1],
        t(`The curve reaches its peak at $x = ${peak}$.`, `曲线在 $x = ${peak}$ 处达到峰值。`),
        fig,
      );
    return spr(
      t(
        `The graph shows a temperature, in degrees Celsius, $x$ hours after sunrise. What is the greatest temperature shown, in degrees Celsius?`,
        `图中是日出后 $x$ 小时的温度（摄氏度）。图中最高温度是多少摄氏度？`,
      ),
      top,
      [peak, top + 4, top - 4],
      t(`The peak of the curve is at a height of $${top}$.`, `曲线峰值的高度是 $${top}$。`),
      fig,
    );
  }),
  spec("Average Rate of Change From Data Plots", "由数据图求平均变化率", ["the-average-rate-of-change-of-a-function"], (rng, hard) => {
    const [a, d, m] = [rng.int(1, 3), rng.int(2, 5), rng.int(2, 5)];
    const y1 = rng.int(1, 8);
    const pts = [
      [a, y1],
      [a + d, y1 + m * d],
    ] as const;
    const fig = dotsFigure(
      [...pts, [a + 1, y1 + m - 1], [a + d + 1, y1 + m * d + 1]],
      { x: [0, 10], y: [0, 40], dx: 1, dy: 5 },
      t(
        `A plot with marked points at $(${a}, ${y1})$ and $(${a + d}, ${y1 + m * d})$, among others.`,
        `标出了点 $(${a}, ${y1})$ 和 $(${a + d}, ${y1 + m * d})$ 等的图。`,
      ),
    );
    if (!hard)
      return spr(
        t(
          `The plot includes the points $(${a}, ${y1})$ and $(${a + d}, ${y1 + m * d})$. What is the average rate of change between them?`,
          `图中包含点 $(${a}, ${y1})$ 和 $(${a + d}, ${y1 + m * d})$。它们之间的平均变化率是多少？`,
        ),
        m,
        [m * d, d, y1],
        t(`$\\frac{${m * d}}{${d}} = ${m}$.`, `$\\frac{${m * d}}{${d}} = ${m}$。`),
        fig,
      );
    return spr(
      t(
        `A function has $f(${a}) = ${y1}$ and an average rate of change of $${m}$ from $x = ${a}$ to $x = ${a + d}$. What is $f(${a + d})$?`,
        `函数满足 $f(${a}) = ${y1}$，且从 $x = ${a}$ 到 $x = ${a + d}$ 的平均变化率为 $${m}$。$f(${a + d})$ 是多少？`,
      ),
      y1 + m * d,
      [y1 + m, m * d, y1 * m],
      t(
        `The change is $${m}(${d}) = ${m * d}$, so the value is $${y1 + m * d}$.`,
        `变化量是 $${m}(${d}) = ${m * d}$，所以值为 $${y1 + m * d}$。`,
      ),
    );
  }),
  spec("Linear vs. Exponential Models", "线性模型与指数模型", ["linear-vs-exponential-models"], (rng, hard) => {
    const [a, d, r] = [rng.int(2, 30), rng.int(2, 15), rng.int(2, 4)];
    const lin = [0, 1, 2, 3].map((x) => a + d * x);
    const exp = [0, 1, 2, 3].map((x) => a * r ** x);
    const useLin = rng.int(0, 1) === 0;
    const ys = useLin ? lin : exp;
    const tb = table("x", "y", [0, 1, 2, 3], ys);
    if (!hard)
      return words(
        rng,
        t(`Which type of model best fits the table?\n\n${tb}`, `哪种模型最符合这个表格？\n\n${tb}`),
        useLin
          ? t("Linear, because $y$ increases by a constant difference", "线性，因为 $y$ 的增加量恒定")
          : t("Exponential, because $y$ increases by a constant factor", "指数，因为 $y$ 按恒定倍数增加"),
        [
          useLin
            ? t("Exponential, because $y$ increases by a constant factor", "指数，因为 $y$ 按恒定倍数增加")
            : t("Linear, because $y$ increases by a constant difference", "线性，因为 $y$ 的增加量恒定"),
          t("Quadratic, because $y$ first falls and then rises", "二次，因为 $y$ 先降后升"),
          t("Neither, because $y$ always increases", "都不是，因为 $y$ 一直增加"),
        ],
        t(`Compare successive differences and ratios of the $y$-values.`, `比较相邻 $y$ 值的差和比。`),
      );
    return spr(
      t(
        `A quantity is modeled by exponential growth. It is $${a}$ when $x = 0$ and $${a * r}$ when $x = 1$. What is its value when $x = 3$?`,
        `某量按指数增长。$x = 0$ 时为 $${a}$，$x = 1$ 时为 $${a * r}$。$x = 3$ 时它的值是多少？`,
      ),
      a * r ** 3,
      [a + 3 * a * (r - 1), a * r * 3, a * r * r],
      t(`Multiply by $${r}$ for each step: $${a}(${r})^3 = ${a * r ** 3}$.`, `每一步乘以 $${r}$：$${a}(${r})^3 = ${a * r ** 3}$。`),
    );
  }),
];
