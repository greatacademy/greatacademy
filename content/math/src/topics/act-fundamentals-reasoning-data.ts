import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";
import { pickChoice } from "./grade-4-fractions.ts";

// ACT Math Fundamentals, reasoning with data and quantities: completed two-way tables, tracked data changes, sample
// spaces, Venn counts, stated probability relationships, ratios and rates, chosen models, multi-leg travel, multi-stage
// percentages, and quantities measured after a unit conversion.

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return {
    id,
    title,
    summary,
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: standards.map((s) => `CCSS.${s}`),
    knowledgePoints,
  };
}

/** kp builds a KnowledgePointDef. */
function kp(id: string, title: Text, explanation: Text, generate: (rng: Rng) => Problem): KnowledgePointDef {
  return { id, title, explanation, generate };
}

/** fr writes a reduced fraction in LaTeX. */
const fr = (n: number, d: number) => Q.of(n, d).toLatex();

/** money writes an amount of cents as dollars with two decimals. */
const money = (cents: number) => `\\$${(cents / 100).toFixed(2)}`;

// ---------------------------------------------------------------------------
// Two-way tables

/** Survey names the two variables of a two-way table. */
interface Survey {
  readonly who: Text;
  readonly rows: readonly [Text, Text];
  readonly cols: readonly [Text, Text];
}

const surveys: readonly Survey[] = [
  {
    who: t("students", "学生"),
    rows: [t("Grade 10", "十年级"), t("Grade 11", "十一年级")],
    cols: [t("Bus", "乘校车"), t("Car", "乘汽车")],
  },
  {
    who: t("club members", "俱乐部成员"),
    rows: [t("Adults", "成人"), t("Teens", "青少年")],
    cols: [t("Swim", "游泳"), t("Tennis", "网球")],
  },
  { who: t("customers", "顾客"), rows: [t("Weekday", "工作日"), t("Weekend", "周末")], cols: [t("Tea", "茶"), t("Coffee", "咖啡")] },
  { who: t("voters", "选民"), rows: [t("Urban", "城市"), t("Rural", "乡村")], cols: [t("Yes", "赞成"), t("No", "反对")] },
];

/** twoWay writes a completed two-way table with totals, in one language. */
function twoWay(s: Survey, lang: "en" | "zh-CN", cells: readonly [number, number, number, number]): string {
  const [a, b, c, d] = cells;
  const total = lang === "en" ? "Total" : "合计";
  const label = (x: Text) => `\\text{${x[lang]}}`;
  return `$$\\begin{array}{c|cc|c} & ${label(s.cols[0])} & ${label(s.cols[1])} & \\text{${total}} \\\\ \\hline ${label(s.rows[0])} & ${a} & ${b} & ${a + b} \\\\ ${label(s.rows[1])} & ${c} & ${d} & ${c + d} \\\\ \\hline \\text{${total}} & ${a + c} & ${b + d} & ${a + b + c + d} \\end{array}$$`;
}

/** interpretingCompletedTwoWayTables turns the entries of a completed table into fractions and percents. */
export const interpretingCompletedTwoWayTables = topic(
  "interpreting-completed-two-way-tables",
  t("Interpreting Completed Two-Way Tables", "解读完整的双向表"),
  t(
    "Read a completed two-way table by choosing the right whole for a fraction: the grand total, a row total or a column total.",
    "解读完整的双向表：为分数选对整体，即总计、行合计或列合计。",
  ),
  ["two-way-frequency-tables"],
  ["8.SP.A.4", "HSS.ID.B.5"],
  [
    kp(
      "a-fraction-of-everyone",
      t("A fraction of everyone", "占全体的分数"),
      t(
        "A question about the fraction of all those surveyed uses the bottom-right grand total as the whole. The part may be a single cell, when both conditions hold at once, or a row or column total, when only one condition is named. Read the question for how many conditions it states before picking the entry.",
        "问占全部被调查者的几分之几时，整体是右下角的总计。部分可以是一个单元格（两个条件同时成立时），也可以是一个行合计或列合计（只提到一个条件时）。选数之前，先看题目给出了几个条件。",
      ),
      (rng) => {
        const s = rng.pick(surveys);
        const cells = [rng.int(8, 40), rng.int(8, 40), rng.int(8, 40), rng.int(8, 40)] as const;
        const [a, b, c, d] = cells;
        const total = a + b + c + d;
        const both = rng.bool();
        const r = rng.int(0, 1);
        const col = rng.int(0, 1);
        const cell = cells[r * 2 + col] as number;
        const rowTotal = r === 0 ? a + b : c + d;
        const colTotal = col === 0 ? a + c : b + d;
        const part = both ? cell : colTotal;
        return numberProblem({
          prompt: both
            ? t(
                `The table shows ${s.who.en} grouped two ways.${twoWay(s, "en", cells)}What fraction of all these ${s.who.en} are in both the group "${s.rows[r]?.en}" and the group "${s.cols[col]?.en}"?`,
                `表格按两种方式对${s.who["zh-CN"]}分组。${twoWay(s, "zh-CN", cells)}在所有这些${s.who["zh-CN"]}中，同时属于“${s.rows[r]?.["zh-CN"]}”和“${s.cols[col]?.["zh-CN"]}”的占几分之几？`,
              )
            : t(
                `The table shows ${s.who.en} grouped two ways.${twoWay(s, "en", cells)}What fraction of all these ${s.who.en} are in the group "${s.cols[col]?.en}"?`,
                `表格按两种方式对${s.who["zh-CN"]}分组。${twoWay(s, "zh-CN", cells)}在所有这些${s.who["zh-CN"]}中，属于“${s.cols[col]?.["zh-CN"]}”的占几分之几？`,
              ),
          answer: Q.of(part, total),
          wrong: [Q.of(cell, rowTotal), Q.of(cell, colTotal), Q.of(rowTotal, total), Q.of(part, total - part)],
          solution: t(
            `The question is about all of them, so the whole is the grand total, $${total}$. The part is the entry for ${both ? "both groups" : "that column"}, $${part}$, which gives $${fr(part, total)}$.`,
            `问的是全体，所以整体是总计 $${total}$。部分是${both ? "同时属于两组" : "这一列"}的数 $${part}$，所以结果是 $${fr(part, total)}$。`,
          ),
        });
      },
    ),
    kp(
      "a-fraction-within-a-group",
      t("A fraction within a group", "组内的分数"),
      t(
        'Words like "of those in Grade 10" narrow the whole to one row or column, so the denominator is that row or column total and not the grand total. The numerator is the cell inside that group that also meets the other condition. Swapping the two conditions gives a different question with a different denominator.',
        "“在十年级学生中”这样的词把整体缩小到一行或一列，所以分母是这一行或一列的合计，而不是总计。分子是该组中同时满足另一条件的单元格。交换两个条件就成了另一个问题，分母也不同。",
      ),
      (rng) => {
        const s = rng.pick(surveys);
        const cells = [rng.int(8, 40), rng.int(8, 40), rng.int(8, 40), rng.int(8, 40)] as const;
        const [a, b, c, d] = cells;
        const total = a + b + c + d;
        const r = rng.int(0, 1);
        const col = rng.int(0, 1);
        const cell = cells[r * 2 + col] as number;
        const rowTotal = r === 0 ? a + b : c + d;
        const colTotal = col === 0 ? a + c : b + d;
        const byRow = rng.bool();
        const whole = byRow ? rowTotal : colTotal;
        const inGroup = byRow ? s.rows[r] : s.cols[col];
        const other = byRow ? s.cols[col] : s.rows[r];
        return numberProblem({
          prompt: t(
            `The table shows ${s.who.en} grouped two ways.${twoWay(s, "en", cells)}Of the ${s.who.en} in the group "${inGroup?.en}", what fraction are in the group "${other?.en}"?`,
            `表格按两种方式对${s.who["zh-CN"]}分组。${twoWay(s, "zh-CN", cells)}在属于“${inGroup?.["zh-CN"]}”的${s.who["zh-CN"]}中，属于“${other?.["zh-CN"]}”的占几分之几？`,
          ),
          answer: Q.of(cell, whole),
          wrong: [Q.of(cell, total), Q.of(cell, byRow ? colTotal : rowTotal), Q.of(whole, total), Q.of(cell, whole - cell)],
          solution: t(
            `The words "of the ${s.who.en} in the group" make that group the whole, so the denominator is its total, $${whole}$. The cell in both groups is $${cell}$, which gives $${fr(cell, whole)}$.`,
            `“在属于……的${s.who["zh-CN"]}中”使这一组成为整体，所以分母是它的合计 $${whole}$。同时属于两组的单元格是 $${cell}$，所以结果是 $${fr(cell, whole)}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Data changes

/** trackingADataChange follows the mean through additions and corrections. */
export const trackingADataChange = topic(
  "tracking-a-data-change",
  t("Tracking a Data Change", "跟踪数据的变化"),
  t(
    "Track the sum of a data set through added, removed or corrected values to find a new mean, or the value that produced a given new mean.",
    "通过添加、删除或更正数值来跟踪数据的总和，求新的平均数，或求产生给定新平均数的数值。",
  ),
  ["effects-of-data-change-on-the-mean"],
  ["6.SP.B.5"],
  [
    kp(
      "the-new-mean-after-a-change",
      t("The new mean after a change", "变化后的新平均数"),
      t(
        "The sum of a data set is its mean times its count, and it is the sum that changes in a simple way. Adding a value adds to the sum and to the count. Correcting a value changes the sum by the difference and leaves the count alone. So find the old sum, apply the change, and divide by the new count.",
        "数据的总和等于平均数乘个数，而变化时总和的变化很简单。添加一个数，总和和个数都增加。更正一个数，总和变化两者之差，个数不变。所以先求原来的总和，进行变化，再除以新的个数。",
      ),
      (rng) => {
        const n = rng.int(4, 12);
        const mean = rng.int(50, 90);
        const sum = n * mean;
        if (rng.bool()) {
          const d = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
          const newMean = mean + d;
          const added = newMean * (n + 1) - sum;
          return numberProblem({
            prompt: t(
              `The mean of $${n}$ test scores is $${mean}$. One more score of $${added}$ is added. What is the new mean?`,
              `$${n}$ 个考试分数的平均数是 $${mean}$。再加入一个分数 $${added}$。新的平均数是多少？`,
            ),
            answer: newMean,
            wrong: [Q.of(mean + added, 2), Q.of(sum + added, n), mean, Q.of(sum, n + 1)],
            solution: t(
              `The mean alone does not combine with a new value, so use the sum: the old sum is $${n} \\cdot ${mean} = ${sum}$.${steps(`\\frac{${sum} + ${added}}{${n + 1}} = \\frac{${sum + added}}{${n + 1}} = ${newMean}`)}`,
              `平均数不能直接与新数合并，所以要用总和：原来的总和是 $${n} \\cdot ${mean} = ${sum}$。${steps(`\\frac{${sum} + ${added}}{${n + 1}} = \\frac{${sum + added}}{${n + 1}} = ${newMean}`)}`,
            ),
          });
        }
        const k = rng.pick([-2, -1, 1, 2, 3]);
        const change = k * n;
        const recorded = rng.int(55, 85);
        const correct = recorded + change;
        return numberProblem({
          prompt: t(
            `The mean of $${n}$ scores is $${mean}$. Then one score, recorded as $${recorded}$, is corrected to $${correct}$. What is the new mean?`,
            `$${n}$ 个分数的平均数是 $${mean}$。其中一个记录为 $${recorded}$ 的分数被更正为 $${correct}$。新的平均数是多少？`,
          ),
          answer: mean + k,
          wrong: [mean + change, mean, Q.of(sum + correct, n + 1), mean - k],
          solution: t(
            `The count stays the same and the sum changes by the difference, $${correct} - ${recorded} = ${change}$.${steps(`\\frac{${sum} ${change < 0 ? "-" : "+"} ${Math.abs(change)}}{${n}} = ${mean + k}`)}`,
            `个数不变，总和变化两数之差 $${correct} - ${recorded} = ${change}$。${steps(`\\frac{${sum} ${change < 0 ? "-" : "+"} ${Math.abs(change)}}{${n}} = ${mean + k}`)}`,
          ),
        });
      },
    ),
    kp(
      "the-value-behind-a-new-mean",
      t("The value behind a new mean", "新平均数背后的数值"),
      t(
        "To find the value that moved a mean, compare two sums. The new mean times the new count is the new sum, and the old mean times the old count is the old sum. Their difference is the value added or removed. Averaging the two means, or using the means alone, ignores how many values each one covers.",
        "要求使平均数变化的那个数，就比较两个总和。新平均数乘新个数是新总和，旧平均数乘旧个数是旧总和。两者之差就是加入或删除的数。把两个平均数再平均，或只用平均数，都忽略了各自涵盖多少个数值。",
      ),
      (rng) => {
        const n = rng.int(4, 12);
        const mean = rng.int(50, 80);
        // The score behind the new mean stays at or below 100.
        const d = rng.int(1, Math.min(4, Math.floor((100 - mean) / (n + 1))));
        const sum = n * mean;
        if (rng.bool()) {
          const newMean = mean + d;
          const x = newMean * (n + 1) - sum;
          return numberProblem({
            prompt: t(
              `A student has a mean of $${mean}$ on $${n}$ quizzes. What score on the next quiz raises the mean to exactly $${newMean}$?`,
              `一名学生 $${n}$ 次小测的平均分是 $${mean}$。下一次小测得多少分，才能使平均分恰好升到 $${newMean}$？`,
            ),
            answer: x,
            wrong: [newMean, newMean + d, 2 * newMean - mean, x + 1],
            solution: t(
              `Compare the two sums, because the new score is exactly what separates them.${steps(`${newMean} \\cdot ${n + 1} = ${newMean * (n + 1)}`, `${mean} \\cdot ${n} = ${sum}`, `${newMean * (n + 1)} - ${sum} = ${x}`)}`,
              `比较两个总和，因为新分数恰好是它们的差。${steps(`${newMean} \\cdot ${n + 1} = ${newMean * (n + 1)}`, `${mean} \\cdot ${n} = ${sum}`, `${newMean * (n + 1)} - ${sum} = ${x}`)}`,
            ),
          });
        }
        const newMean = mean - d;
        const m = n + 2;
        const big = m * mean;
        const x = big - (m - 1) * newMean;
        return numberProblem({
          prompt: t(
            `The mean of $${m}$ numbers is $${mean}$. When one number is removed, the mean of the rest is $${newMean}$. What number was removed?`,
            `$${m}$ 个数的平均数是 $${mean}$。去掉一个数后，其余数的平均数是 $${newMean}$。去掉的数是多少？`,
          ),
          answer: x,
          wrong: [mean + d, mean, big - m * newMean, x - 1],
          solution: t(
            `Compare the two sums, because the removed number is exactly what separates them.${steps(`${mean} \\cdot ${m} = ${big}`, `${newMean} \\cdot ${m - 1} = ${(m - 1) * newMean}`, `${big} - ${(m - 1) * newMean} = ${x}`)}`,
            `比较两个总和，因为去掉的数恰好是它们的差。${steps(`${mean} \\cdot ${m} = ${big}`, `${newMean} \\cdot ${m - 1} = ${(m - 1) * newMean}`, `${big} - ${(m - 1) * newMean} = ${x}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Sample spaces

/** range lists the whole numbers from 1 to n. */
const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

/** countingFavorableOutcomesInAConstructedSampleSpace lists the outcomes of two independent stages and counts those wanted. */
export const countingFavorableOutcomesInAConstructedSampleSpace = topic(
  "counting-favorable-outcomes-in-a-constructed-sample-space",
  t("Counting Favorable Outcomes in a Constructed Sample Space", "在构造的样本空间中数有利结果"),
  t(
    "Build the sample space of two stages as a grid, count the outcomes meeting a condition, and find a probability from the count.",
    "把两个阶段的样本空间写成网格，数出满足条件的结果，并由此求概率。",
  ),
  ["sample-spaces-and-events-in-probability"],
  ["7.SP.C.8b"],
  [
    kp(
      "counting-in-a-grid-of-two-stages",
      t("Counting in a grid of two stages", "在两阶段的网格中计数"),
      t(
        "When an experiment has two stages, its outcomes are ordered pairs: a die showing $a$ and a spinner showing $b$ give the pair $(a, b)$. Writing them as a grid gives every outcome exactly once, so $(2, 3)$ and $(3, 2)$ count separately. To count those meeting a condition, go through the rows one at a time.",
        "试验有两个阶段时，结果是有序数对：骰子显示 $a$、转盘显示 $b$，就得到 $(a, b)$。写成网格能使每个结果恰好出现一次，所以 $(2, 3)$ 和 $(3, 2)$ 要分开算。数满足条件的结果时，一行一行地数。",
      ),
      (rng) => {
        const m = rng.pick([4, 5, 6, 8]);
        const n = rng.pick([3, 4, 5, 6]);
        const form = rng.int(0, 3);
        const target =
          form === 0
            ? rng.int(4, m + n - 2)
            : form === 1
              ? rng.int(3, m + n - 3)
              : form === 2
                ? rng.pick([2, 3, 4, 5])
                : rng.pick([6, 8, 10, 12]);
        const test = (a: number, b: number) =>
          form === 0 ? a + b === target : form === 1 ? a + b > target : form === 2 ? (a * b) % target === 0 : a * b >= target;
        const cond: Text =
          form === 0
            ? t(`the sum of the two numbers is $${target}$`, `两数之和是 $${target}$`)
            : form === 1
              ? t(`the sum of the two numbers is greater than $${target}$`, `两数之和大于 $${target}$`)
              : form === 2
                ? t(`the product of the two numbers is a multiple of $${target}$`, `两数之积是 $${target}$ 的倍数`)
                : t(`the product of the two numbers is at least $${target}$`, `两数之积至少是 $${target}$`);
        const perRow = range(m).map((a) => range(n).filter((b) => test(a, b)).length);
        const answer = perRow.reduce((x, y) => x + y, 0);
        return numberProblem({
          prompt: t(
            `A spinner shows a whole number from $1$ to $${m}$, and a second spinner shows a whole number from $1$ to $${n}$. For how many of the possible pairs of results is it true that ${cond.en}?`,
            `一个转盘显示 $1$ 到 $${m}$ 的整数，另一个转盘显示 $1$ 到 $${n}$ 的整数。在所有可能的结果对中，有多少对满足${cond["zh-CN"]}？`,
          ),
          answer,
          wrong: [m * n, m + n, m * n - answer, answer + 1],
          solution: t(
            `There are $${m} \\cdot ${n} = ${m * n}$ pairs. Going through the first number from $1$ to $${m}$ and counting the second numbers that work gives ${perRow.map((v) => `$${v}$`).join(", ")}, for a total of $${answer}$.`,
            `共有 $${m} \\cdot ${n} = ${m * n}$ 对。第一个数从 $1$ 取到 $${m}$，逐个数出满足条件的第二个数，依次是 ${perRow.map((v) => `$${v}$`).join("、")}，总共 $${answer}$ 对。`,
          ),
        });
      },
    ),
    kp(
      "a-probability-from-the-grid",
      t("A probability from the grid", "由网格求概率"),
      t(
        "If all pairs are equally likely, the probability of an event is the count of favorable pairs over the count of all pairs. With two number cubes there are $36$ pairs, not $11$ sums, because the sums are not equally likely: a sum of $7$ comes from six pairs and a sum of $2$ from only one.",
        "如果所有数对的可能性相等，事件的概率就是有利数对的个数除以全部数对的个数。两个骰子有 $36$ 个数对，而不是 $11$ 种和，因为各种和的可能性并不相等：和为 $7$ 有六个数对，和为 $2$ 只有一个数对。",
      ),
      (rng) => {
        const form = rng.int(0, 2);
        const target = form === 0 ? rng.int(3, 11) : form === 1 ? rng.int(4, 9) : rng.pick([2, 3, 4, 5, 6]);
        const test = (a: number, b: number) =>
          form === 0 ? a + b === target : form === 1 ? a + b >= target : Math.abs(a - b) === target - 1;
        const cond: Text =
          form === 0
            ? t(`the sum is $${target}$`, `和是 $${target}$`)
            : form === 1
              ? t(`the sum is at least $${target}$`, `和至少是 $${target}$`)
              : t(`the two numbers differ by exactly $${target - 1}$`, `两数恰好相差 $${target - 1}$`);
        const count = range(6)
          .flatMap((a) => range(6).map((b) => test(a, b)))
          .filter(Boolean).length;
        const sidesShown = rng.pick([t("number cubes", "骰子"), t("six-sided dice", "六面骰子")]);
        return numberProblem({
          prompt: t(
            `Two fair ${sidesShown.en}, numbered $1$ to $6$, are rolled. What is the probability that ${cond.en}?`,
            `掷两枚均匀的${sidesShown["zh-CN"]}，点数为 $1$ 到 $6$。${cond["zh-CN"]}的概率是多少？`,
          ),
          answer: Q.of(count, 36),
          wrong: [
            ...(count < 11 ? [Q.of(count, 11)] : []),
            ...(count < 21 ? [Q.of(count, 21)] : []),
            Q.of(36 - count, 36),
            Q.of(count + 1, 36),
            Q.of(count - 1, 36),
          ],
          solution: t(
            `All $36$ ordered pairs are equally likely, and going through the grid row by row finds $${count}$ favorable pairs. The probability is $\\frac{${count}}{36} = ${fr(count, 36)}$.`,
            `全部 $36$ 个有序数对的可能性相等，一行一行地数，得到 $${count}$ 个有利数对。概率是 $\\frac{${count}}{36} = ${fr(count, 36)}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Venn data

/** Pair names two overlapping groups. */
interface Pair {
  readonly who: Text;
  readonly a: Text;
  readonly b: Text;
}

const pairs: readonly Pair[] = [
  { who: t("students", "学生"), a: t("take art", "选美术"), b: t("take music", "选音乐") },
  { who: t("employees", "员工"), a: t("drive to work", "开车上班"), b: t("work from home on Fridays", "周五在家办公") },
  { who: t("members", "会员"), a: t("use the pool", "使用泳池"), b: t("use the gym", "使用健身房") },
  { who: t("readers", "读者"), a: t("subscribe to the magazine", "订阅杂志"), b: t("subscribe to the newsletter", "订阅简报") },
  { who: t("campers", "露营者"), a: t("went hiking", "去徒步"), b: t("went canoeing", "去划独木舟") },
];

/** countingMembersFromVennData counts the regions of two overlapping groups. */
export const countingMembersFromVennData = topic(
  "counting-members-from-venn-data",
  t("Counting Members From Venn Data", "由韦恩图数据数成员"),
  t(
    "Count those in exactly one group, in both, or in neither from the totals of two overlapping groups.",
    "由两个重叠组的总数，数出恰好属于一组、属于两组或都不属于的成员。",
  ),
  ["venn-diagrams-in-probability"],
  ["HSS.CP.A.1"],
  [
    kp(
      "exactly-one-group",
      t("Exactly one group", "恰好属于一组"),
      t(
        'A group\'s total includes the overlap, so those in that group only are the total minus the overlap. If $30$ take art, $20$ take music and $8$ take both, then $30 - 8 = 22$ take art only. To count those in exactly one group, add both "only" regions and leave the overlap out.',
        "一组的总数包含重叠部分，所以只属于这一组的是总数减去重叠部分。若 $30$ 人选美术，$20$ 人选音乐，$8$ 人两者都选，则只选美术的有 $30 - 8 = 22$ 人。要数恰好属于一组的人，把两个“只属于”的区域相加，不算重叠部分。",
      ),
      (rng) => {
        const s = rng.pick(pairs);
        const both = rng.int(3, 20);
        const aOnly = rng.int(4, 30);
        const bOnly = rng.int(4, 30);
        const A = aOnly + both;
        const B = bOnly + both;
        const one = rng.bool();
        const answer = one ? aOnly + bOnly : aOnly;
        return numberProblem({
          prompt: t(
            `Among some ${s.who.en}, $${A}$ ${s.a.en}, $${B}$ ${s.b.en}, and $${both}$ do both. How many ${one ? "do exactly one of the two" : `${s.a.en} and not the other`}?`,
            `在一些${s.who["zh-CN"]}中，$${A}$ 人${s.a["zh-CN"]}，$${B}$ 人${s.b["zh-CN"]}，$${both}$ 人两者都做。${one ? "恰好只做其中一项的" : `${s.a["zh-CN"]}而不做另一项的`}有多少人？`,
          ),
          answer,
          wrong: [A + B, A + B - both, A, A + B - 3 * both, both],
          solution: t(
            one
              ? `Each total includes the $${both}$ who do both, so take them out of each: $${A} - ${both} = ${aOnly}$ and $${B} - ${both} = ${bOnly}$. Together that makes $${answer}$.`
              : `The total $${A}$ includes the $${both}$ who do both, so take them out: $${A} - ${both} = ${aOnly}$.`,
            one
              ? `每个总数都包含两者都做的 $${both}$ 人，所以各减去它们：$${A} - ${both} = ${aOnly}$，$${B} - ${both} = ${bOnly}$。合起来是 $${answer}$ 人。`
              : `总数 $${A}$ 包含两者都做的 $${both}$ 人，所以减去它们：$${A} - ${both} = ${aOnly}$。`,
          ),
        });
      },
    ),
    kp(
      "neither-or-both-from-the-totals",
      t("Neither or both from the totals", "由总数求都不属于或两者都属于"),
      t(
        "Adding two group totals counts the overlap twice, so the number in at least one group is $A + B - \\text{both}$. Those in neither group are the rest of the whole. The same relation can run backward: when the whole, the two totals and the number in neither are known, it gives the number in both.",
        "两个组的总数相加时，重叠部分被算了两次，所以至少属于一组的人数是 $A + B - \\text{both}$（两者都属于的人数）。都不属于的是整体中其余的人。这个关系也可以反过来用：已知整体、两组总数和都不属于的人数，可以求两者都属于的人数。",
      ),
      (rng) => {
        const s = rng.pick(pairs);
        const both = rng.int(3, 20);
        const aOnly = rng.int(4, 30);
        const bOnly = rng.int(4, 30);
        const neither = rng.int(2, 25);
        const A = aOnly + both;
        const B = bOnly + both;
        const whole = aOnly + bOnly + both + neither;
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `Of $${whole}$ ${s.who.en}, $${A}$ ${s.a.en}, $${B}$ ${s.b.en}, and $${both}$ do both. How many do neither?`,
              `在 $${whole}$ 名${s.who["zh-CN"]}中，$${A}$ 人${s.a["zh-CN"]}，$${B}$ 人${s.b["zh-CN"]}，$${both}$ 人两者都做。两者都不做的有多少人？`,
            ),
            answer: neither,
            wrong: [neither + both, Math.abs(neither - both) || neither + 1, A + B - both, whole - both],
            solution: t(
              `Adding the two totals counts the overlap twice, so subtract it once to count those in at least one group.${steps(`${A} + ${B} - ${both} = ${A + B - both}`, `${whole} - ${A + B - both} = ${neither}`)}`,
              `两个总数相加时重叠部分被算了两次，所以减去一次，得到至少属于一组的人数。${steps(`${A} + ${B} - ${both} = ${A + B - both}`, `${whole} - ${A + B - both} = ${neither}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `Of $${whole}$ ${s.who.en}, $${A}$ ${s.a.en}, $${B}$ ${s.b.en}, and $${neither}$ do neither. How many do both?`,
            `在 $${whole}$ 名${s.who["zh-CN"]}中，$${A}$ 人${s.a["zh-CN"]}，$${B}$ 人${s.b["zh-CN"]}，$${neither}$ 人两者都不做。两者都做的有多少人？`,
          ),
          answer: both,
          wrong: [aOnly, bOnly, A + B - neither, both + 1],
          solution: t(
            `The number in at least one group is $${whole} - ${neither} = ${whole - neither}$. The two totals add to more than that, and the excess is the overlap counted twice.${steps(`${A} + ${B} - ${whole - neither} = ${both}`)}`,
            `至少属于一组的人数是 $${whole} - ${neither} = ${whole - neither}$。两个总数之和比它大，多出的部分就是被算了两次的重叠部分。${steps(`${A} + ${B} - ${whole - neither} = ${both}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Probability relationships

const colors: readonly (readonly [Text, Text, Text])[] = [
  [t("red", "红色"), t("blue", "蓝色"), t("green", "绿色")],
  [t("yellow", "黄色"), t("white", "白色"), t("black", "黑色")],
  [t("purple", "紫色"), t("orange", "橙色"), t("gray", "灰色")],
];

/** reasoningFromStatedProbabilityRelationships uses relations between probabilities that add to one. */
export const reasoningFromStatedProbabilityRelationships = topic(
  "reasoning-from-stated-probability-relationships",
  t("Reasoning From Stated Probability Relationships", "由陈述的概率关系推理"),
  t(
    "Use the facts that the probabilities of all outcomes add to one and that a probability is a share of the total, together with a stated relation between outcomes.",
    "利用所有结果的概率之和为一、概率是占总数的份额，以及结果之间给定的关系进行推理。",
  ),
  ["the-complement-of-an-event"],
  ["7.SP.C.7"],
  [
    kp(
      "probabilities-related-to-each-other",
      t("Probabilities related to each other", "彼此相关的概率"),
      t(
        'If outcomes are the only ones possible, their probabilities add to $1$. A statement such as "red is three times as likely as blue" lets all be written with one letter: with $P(\\text{blue}) = p$ and $P(\\text{red}) = 3p$, adding gives an equation for $p$. Solve it and then substitute to find the probability wanted.',
        "如果这些结果是全部可能的结果，它们的概率之和就是 $1$。“红色的可能性是蓝色的三倍”这样的陈述，使所有概率都能用一个字母表示：设 $P(\\text{蓝}) = p$，$P(\\text{红}) = 3p$，相加就得到关于 $p$ 的方程。解出后代入，就得到所求的概率。",
      ),
      (rng) => {
        const [c1, c2, c3] = rng.pick(colors) as readonly [Text, Text, Text];
        const k = rng.int(2, 5);
        const third = rng.bool();
        const m = rng.int(1, 3);
        const parts = third ? k + 1 + m : k + 1;
        const askBig = rng.bool();
        const answer = Q.of(askBig ? k : 1, parts);
        return numberProblem({
          prompt: third
            ? t(
                `A marble drawn from a bag is ${c1.en}, ${c2.en} or ${c3.en}. Drawing ${c1.en} is $${k}$ times as likely as drawing ${c2.en}, and drawing ${c3.en} is $${m}$ time${m === 1 ? "" : "s"} as likely as drawing ${c2.en}. What is the probability of drawing ${askBig ? c1.en : c2.en}?`,
                `从袋中摸出的弹珠是${c1["zh-CN"]}、${c2["zh-CN"]}或${c3["zh-CN"]}。摸到${c1["zh-CN"]}的可能性是摸到${c2["zh-CN"]}的 $${k}$ 倍，摸到${c3["zh-CN"]}的可能性是摸到${c2["zh-CN"]}的 $${m}$ 倍。摸到${askBig ? c1["zh-CN"] : c2["zh-CN"]}的概率是多少？`,
              )
            : t(
                `A marble drawn from a bag is either ${c1.en} or ${c2.en}. Drawing ${c1.en} is $${k}$ times as likely as drawing ${c2.en}. What is the probability of drawing ${askBig ? c1.en : c2.en}?`,
                `从袋中摸出的弹珠是${c1["zh-CN"]}或${c2["zh-CN"]}。摸到${c1["zh-CN"]}的可能性是摸到${c2["zh-CN"]}的 $${k}$ 倍。摸到${askBig ? c1["zh-CN"] : c2["zh-CN"]}的概率是多少？`,
              ),
          answer,
          wrong: [Q.of(1, k), Q.of(askBig ? 1 : k, parts), Q.of(askBig ? k : 1, parts + 1), Q.of(k, k + 2 + m)],
          solution: t(
            `Let $p$ be the probability of ${c2.en}. All the probabilities add to $1$ because no other outcome is possible.${steps(third ? `${k}p + p + ${m}p = 1` : `${k}p + p = 1`, `p = ${fr(1, parts)}`)}So the probability of ${askBig ? c1.en : c2.en} is $${answer.toLatex()}$.`,
            `设摸到${c2["zh-CN"]}的概率为 $p$。因为没有其他结果，所有概率之和为 $1$。${steps(third ? `${k}p + p + ${m}p = 1` : `${k}p + p = 1`, `p = ${fr(1, parts)}`)}所以摸到${askBig ? c1["zh-CN"] : c2["zh-CN"]}的概率是 $${answer.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "from-a-probability-to-a-count",
      t("From a probability to a count", "由概率到个数"),
      t(
        "A probability is a share of the total, so the count of an outcome is its probability times the total. Adding more of one kind changes both the count and the total, so a new probability needs a new denominator. With $5$ red among $20$, adding $5$ red gives $\\frac{10}{25}$, not $\\frac{10}{20}$.",
        "概率是占总数的份额，所以某结果的个数等于概率乘总数。增加某一种时，它的个数和总数都会变，所以新概率的分母也要变。$20$ 个中有 $5$ 个红色，再加 $5$ 个红色，概率是 $\\frac{10}{25}$，而不是 $\\frac{10}{20}$。",
      ),
      (rng) => {
        const [c1, c2] = rng.pick(colors) as readonly [Text, Text, Text];
        const [p, q] = rng.pick([
          [1, 2],
          [1, 3],
          [2, 3],
          [1, 4],
          [3, 4],
          [2, 5],
          [3, 5],
          [1, 5],
        ] as const);
        const m = rng.int(2, 8);
        const total = q * m;
        const count = p * m;
        if (rng.bool()) {
          const other = total - count;
          return numberProblem({
            prompt: t(
              `A bag holds only ${c1.en} and ${c2.en} marbles. There are $${other}$ ${c2.en} marbles, and the probability of drawing a ${c1.en} marble is $${fr(p, q)}$. How many ${c1.en} marbles are there?`,
              `袋中只有${c1["zh-CN"]}和${c2["zh-CN"]}弹珠。${c2["zh-CN"]}弹珠有 $${other}$ 颗，摸到${c1["zh-CN"]}弹珠的概率是 $${fr(p, q)}$。${c1["zh-CN"]}弹珠有多少颗？`,
            ),
            answer: count,
            wrong: [Q.of(other * p, q), total, other, Q.of(other * q, p)],
            solution: t(
              `The ${c2.en} marbles make up the remaining share of the bag, $1 - ${fr(p, q)} = ${fr(q - p, q)}$, so the total is $${other} \\div ${fr(q - p, q)} = ${total}$. Then there are $${total} - ${other} = ${count}$ ${c1.en} marbles.`,
              `${c2["zh-CN"]}弹珠占袋中其余的份额 $1 - ${fr(p, q)} = ${fr(q - p, q)}$，所以总数是 $${other} \\div ${fr(q - p, q)} = ${total}$。于是${c1["zh-CN"]}弹珠有 $${total} - ${other} = ${count}$ 颗。`,
            ),
          });
        }
        const add = rng.int(1, 6);
        return numberProblem({
          prompt: t(
            `A bag holds $${total}$ marbles, and the probability of drawing a ${c1.en} one is $${fr(p, q)}$. If $${add}$ more ${c1.en} marbles are added, what is the new probability of drawing a ${c1.en} marble?`,
            `袋中有 $${total}$ 颗弹珠，摸到${c1["zh-CN"]}弹珠的概率是 $${fr(p, q)}$。如果再放入 $${add}$ 颗${c1["zh-CN"]}弹珠，摸到${c1["zh-CN"]}弹珠的新概率是多少？`,
          ),
          answer: Q.of(count + add, total + add),
          wrong: [Q.of(count + add, total), Q.of(count, total + add), Q.of(p + add, q + add), Q.of(add, total + add)],
          solution: t(
            `The ${c1.en} count is $${fr(p, q)} \\cdot ${total} = ${count}$. Adding marbles changes both the count and the total.${steps(`\\frac{${count} + ${add}}{${total} + ${add}} = ${fr(count + add, total + add)}`)}`,
            `${c1["zh-CN"]}弹珠的个数是 $${fr(p, q)} \\cdot ${total} = ${count}$。放入弹珠后，个数和总数都变了。${steps(`\\frac{${count} + ${add}}{${total} + ${add}} = ${fr(count + add, total + add)}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Ratios and rates

/** Shares names three people or items sharing a total. */
const shareContexts: readonly (readonly [Text, Text])[] = [
  [t("A prize", "一笔奖金"), t("dollars", "美元")],
  [t("A batch of flour", "一批面粉"), t("kilograms", "千克")],
  [t("A rope", "一根绳子"), t("feet", "英尺")],
  [t("A bonus fund", "一笔奖金基金"), t("dollars", "美元")],
  [t("A shipment", "一批货物"), t("boxes", "箱")],
];

/** partitioningTotalsUsingRatios splits a total in a ratio and recovers a total from a difference of shares. */
export const partitioningTotalsUsingRatios = topic(
  "partitioning-totals-using-ratios",
  t("Partitioning Totals Using Ratios", "按比例分配总量"),
  t(
    "Split a total according to a ratio by counting equal parts, and recover the total from one share or from the difference between two shares.",
    "数相等的份数，按比例分配总量；并由一份或两份之差还原总量。",
  ),
  ["equivalent-ratios"],
  ["6.RP.A.3", "7.RP.A.3"],
  [
    kp(
      "splitting-a-total-in-a-ratio",
      t("Splitting a total in a ratio", "按比例分配总量"),
      t(
        "A ratio $2 : 3 : 5$ splits a total into $2 + 3 + 5 = 10$ equal parts. Dividing the total by the number of parts gives the size of one part, and each share is its ratio number times that size. Dividing the total by a ratio number directly is the usual mistake.",
        "比 $2 : 3 : 5$ 把总量分成 $2 + 3 + 5 = 10$ 个相等的份。总量除以份数得到一份的大小，每个人的份额等于他的比数乘这个大小。直接用总量除以某个比数是常见错误。",
      ),
      (rng) => {
        const [ctx, unit] = rng.pick(shareContexts) as readonly [Text, Text];
        const three = rng.bool();
        const a = rng.int(1, 5);
        const b = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => v !== a));
        const c = three ? rng.pick([1, 2, 3, 4, 5, 6].filter((v) => v !== a && v !== b)) : 0;
        const parts = a + b + c;
        const size = rng.int(3, 40);
        const total = parts * size;
        const ratio = three ? `${a} : ${b} : ${c}` : `${a} : ${b}`;
        const ask = rng.pick(three ? [a, b, c] : [a, b]);
        const place = (three ? [a, b, c] : [a, b]).indexOf(ask);
        const names = [t("first", "第一"), t("second", "第二"), t("third", "第三")];
        return numberProblem({
          prompt: t(
            `${ctx.en} of $${total}$ ${unit.en} is split in the ratio $${ratio}$. How many ${unit.en} does the ${names[place]?.en} share contain?`,
            `${ctx["zh-CN"]}共 $${total}$ ${unit["zh-CN"]}，按 $${ratio}$ 分配。${names[place]?.["zh-CN"]}份有多少${unit["zh-CN"]}？`,
          ),
          answer: ask * size,
          wrong: [Q.of(total, ask), size, ask * size + size, total - ask * size],
          solution: t(
            `The ratio makes $${parts}$ equal parts, each of $\\frac{${total}}{${parts}} = ${size}$ ${unit.en}. That share has $${ask}$ parts: $${ask} \\cdot ${size} = ${ask * size}$.`,
            `这个比把总量分成 $${parts}$ 个相等的份，每份是 $\\frac{${total}}{${parts}} = ${size}$ ${unit["zh-CN"]}。这一份含 $${ask}$ 个部分：$${ask} \\cdot ${size} = ${ask * size}$。`,
          ),
        });
      },
    ),
    kp(
      "a-total-from-a-share-or-difference",
      t("A total from a share or difference", "由一份或差还原总量"),
      t(
        "Any known amount tied to the ratio gives the size of one part. If the ratio is $3 : 5$ and the larger share exceeds the smaller by $14$, then $5 - 3 = 2$ parts make $14$, so one part is $7$. The total is then the number of parts, $8$, times $7$, which is $56$.",
        "任何与比相联系的已知量都能给出一份的大小。如果比是 $3 : 5$，较大的份比较小的份多 $14$，那么 $5 - 3 = 2$ 个部分是 $14$，所以一份是 $7$。总量就是份数 $8$ 乘 $7$，等于 $56$。",
      ),
      (rng) => {
        const [ctx, unit] = rng.pick(shareContexts) as readonly [Text, Text];
        const a = rng.int(1, 6);
        const b = a + rng.int(1, 5);
        const size = rng.int(2, 30);
        const total = (a + b) * size;
        if (rng.bool()) {
          const diff = (b - a) * size;
          return numberProblem({
            prompt: t(
              `${ctx.en} is split in the ratio $${a} : ${b}$. The larger share is $${diff}$ ${unit.en} more than the smaller one. How many ${unit.en} are there in all?`,
              `${ctx["zh-CN"]}按 $${a} : ${b}$ 分配。较大的份比较小的份多 $${diff}$ ${unit["zh-CN"]}。总共有多少${unit["zh-CN"]}？`,
            ),
            answer: total,
            wrong: [diff * (a + b), diff, a * size, b * size],
            solution: t(
              `The difference of $${diff}$ is $${b} - ${a} = ${b - a}$ parts, so one part is $${size}$ ${unit.en}. There are $${a + b}$ parts in all: $${a + b} \\cdot ${size} = ${total}$.`,
              `差 $${diff}$ 相当于 $${b} - ${a} = ${b - a}$ 个部分，所以一份是 $${size}$ ${unit["zh-CN"]}。总共 $${a + b}$ 个部分：$${a + b} \\cdot ${size} = ${total}$。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `${ctx.en} is split in the ratio $${a} : ${b}$. The smaller share is $${a * size}$ ${unit.en}. How many ${unit.en} are there in all?`,
            `${ctx["zh-CN"]}按 $${a} : ${b}$ 分配。较小的份是 $${a * size}$ ${unit["zh-CN"]}。总共有多少${unit["zh-CN"]}？`,
          ),
          answer: total,
          wrong: [b * size, a * size * (a + b), a * size + b, Q.of(a * size * b, a + b)],
          solution: t(
            `The smaller share is $${a}$ part${a === 1 ? "" : "s"}, so one part is $${size}$ ${unit.en}. There are $${a + b}$ parts in all: $${a + b} \\cdot ${size} = ${total}$.`,
            `较小的份是 $${a}$ 个部分，所以一份是 $${size}$ ${unit["zh-CN"]}。总共 $${a + b}$ 个部分：$${a + b} \\cdot ${size} = ${total}$。`,
          ),
        });
      },
    ),
  ],
);

/** computingTotalsFromStatedRates multiplies rates by amounts, with a fixed part or a second rate. */
export const computingTotalsFromStatedRates = topic(
  "computing-totals-from-stated-rates",
  t("Computing Totals From Stated Rates", "由给定的比率计算总量"),
  t(
    "Compute a total from a stated rate, including totals with a second rate past some amount or several workers at the same rate.",
    "由给定的比率计算总量，包括超过某数量后用第二个比率，或多名工人以相同比率工作的情形。",
  ),
  ["unit-rates"],
  ["6.RP.A.3b", "7.RP.A.3"],
  [
    kp(
      "a-total-with-two-rates",
      t("A total with two rates", "两种比率下的总量"),
      t(
        "When a rate changes past some point, split the amount there and treat each part at its own rate. For pay of $\\$20$ an hour up to $40$ hours and $\\$30$ an hour beyond, $45$ hours earn $40 \\cdot 20 + 5 \\cdot 30$. Applying the higher rate to all the hours is the common slip.",
        "比率在某个点之后改变时，就在那里把数量分开，每部分用各自的比率。每小时 $\\$20$（$40$ 小时以内），超出部分每小时 $\\$30$，那么 $45$ 小时的收入是 $40 \\cdot 20 + 5 \\cdot 30$。把较高比率用于全部时间是常见错误。",
      ),
      (rng) => {
        const r1 = rng.pick([12, 14, 15, 16, 18, 20, 22, 24]);
        const r2 = r1 + rng.pick([4, 6, 8, 10]);
        const base = rng.pick([30, 35, 38, 40]);
        const extra = rng.int(2, 12);
        const n = base + extra;
        const answer = base * r1 + extra * r2;
        return numberProblem({
          prompt: t(
            `A worker earns $\\$${r1}$ per hour for the first $${base}$ hours in a week and $\\$${r2}$ per hour for any further hours. How many dollars does the worker earn in a week of $${n}$ hours?`,
            `一名工人每周前 $${base}$ 小时每小时挣 $\\$${r1}$，超出的部分每小时挣 $\\$${r2}$。一周工作 $${n}$ 小时，这名工人挣多少美元？`,
          ),
          answer,
          wrong: [n * r2, n * r1, extra * r2, base * r1 + extra * r1, base * r2 + extra * r1],
          solution: t(
            `Split the hours where the rate changes: $${base}$ at the first rate and $${extra}$ at the second.${steps(`${base} \\cdot ${r1} + ${extra} \\cdot ${r2} = ${base * r1} + ${extra * r2} = ${answer}`)}`,
            `在比率改变处把时间分开：$${base}$ 小时用第一个比率，$${extra}$ 小时用第二个比率。${steps(`${base} \\cdot ${r1} + ${extra} \\cdot ${r2} = ${base * r1} + ${extra * r2} = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "scaling-a-rate-by-workers-and-time",
      t("Scaling a rate by workers and time", "按工人数和时间缩放比率"),
      t(
        "A stated rate can be scaled in more than one direction. If $3$ machines fill $240$ bottles in $2$ hours, one machine fills $40$ bottles an hour, found by dividing by both the machines and the hours. Then multiply that unit rate by any new number of machines and hours to get the total.",
        "给定的比率可以从多个方向缩放。若 $3$ 台机器 $2$ 小时灌装 $240$ 瓶，把机器数和小时数都除掉，得一台机器每小时灌装 $40$ 瓶。再用这个单位比率乘新的机器数和小时数，就得到总量。",
      ),
      (rng) => {
        const unit = rng.pick([5, 8, 10, 12, 15, 20, 25, 30, 40]);
        const m = rng.int(2, 6);
        const h = rng.int(2, 5);
        const m2 = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== m));
        const h2 = rng.pick([1, 2, 3, 4, 6, 8].filter((v) => v !== h));
        const given = unit * m * h;
        const answer = unit * m2 * h2;
        const [thing, group] = rng.pick([
          [t("bottles", "个瓶子"), t("machines", "台机器")],
          [t("forms", "份表格"), t("clerks", "名职员")],
          [t("parts", "个零件"), t("workers", "名工人")],
          [t("pages", "页"), t("printers", "台打印机")],
        ] as const);
        return numberProblem({
          prompt: t(
            `$${m}$ ${group.en}, working at the same rate, handle $${given}$ ${thing.en} in $${h}$ hours. At that rate, how many ${thing.en} do $${m2}$ ${group.en} handle in $${h2}$ hours?`,
            `$${m}$ ${group["zh-CN"]}以相同的速度工作，$${h}$ 小时处理 $${given}$ ${thing["zh-CN"]}。按这个速度，$${m2}$ ${group["zh-CN"]} $${h2}$ 小时处理多少${thing["zh-CN"]}？`,
          ),
          answer,
          wrong: [Q.of(given * m2, m), Q.of(given * h2, h), given, unit * (m2 + h2)],
          solution: t(
            `Divide by both the number and the hours to find the rate for one in one hour, because that rate is the same for all of them.${steps(`\\frac{${given}}{${m} \\cdot ${h}} = ${unit}`, `${unit} \\cdot ${m2} \\cdot ${h2} = ${answer}`)}`,
            `除以人数（台数）和小时数，求出单个每小时的速度，因为这个速度对所有人都相同。${steps(`\\frac{${given}}{${m} \\cdot ${h}} = ${unit}`, `${unit} \\cdot ${m2} \\cdot ${h2} = ${answer}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Models

/** selectingFunctionModelsAndOutputs chooses a function for a description and uses it. */
export const selectingFunctionModelsAndOutputs = topic(
  "selecting-function-models-and-outputs",
  t("Selecting Function Models and Outputs", "选择函数模型并求输出"),
  t(
    "Choose the linear or exponential function that matches a description, and use it to compute an output at a given input.",
    "选择与描述相符的线性或指数函数，并用它求给定输入的输出。",
  ),
  ["modeling-with-linear-functions", "modeling-exponential-growth-with-functions"],
  ["HSF.LE.A.1", "HSF.LE.A.2"],
  [
    kp(
      "choosing-the-model-for-a-description",
      t("Choosing the model for a description", "选择符合描述的模型"),
      t(
        'A quantity changing by the same amount each step is linear, $f(t) = a + dt$. A quantity changing by the same factor each step is exponential, $f(t) = a \\cdot r^{t}$. So "grows by $20$ each year" has $20t$ added, while "grows by $20\\%$ each year" has the factor $1.2^{t}$. A percent loss uses a factor below $1$.',
        "每一步变化相同的量是线性的，$f(t) = a + dt$。每一步变化相同的倍数是指数的，$f(t) = a \\cdot r^{t}$。所以“每年增长 $20$”是加 $20t$，“每年增长 $20\\%$”是乘 $1.2^{t}$。按百分比减少时，倍数小于 $1$。",
      ),
      (rng) => {
        const a = rng.pick([100, 200, 300, 400, 500, 800, 1000, 1500, 2000]);
        const p = rng.pick([5, 10, 15, 20, 25, 30, 40, 50]);
        const up = rng.bool();
        const percent = rng.bool();
        const factor = (100 + (up ? p : -p)) / 100;
        const other = (100 + (up ? -p : p)) / 100;
        const m = (s: string) => same(`$f(t) = ${s}$`);
        const sign = up ? "+" : "-";
        const lin = `${a} ${sign} ${p}t`;
        const linBack = `${a} ${up ? "-" : "+"} ${p}t`;
        const expo = `${a}(${factor})^{t}`;
        const expoBack = `${a}(${other})^{t}`;
        const correct = percent ? m(expo) : m(lin);
        const wrong = percent ? [m(lin), m(expoBack), m(`${a}(${p})^{t}`)] : [m(expo), m(linBack), m(`${p}(${a})^{t}`)];
        const thing = rng.pick([
          t("A town's population", "一个城镇的人口"),
          t("A colony of bacteria", "一群细菌"),
          t("The value of an account", "一个账户的价值"),
          t("The number of members of a club", "一个俱乐部的成员数"),
        ]);
        return pickChoice(
          rng,
          percent
            ? t(
                `${thing.en} starts at $${a}$ and ${up ? "grows" : "shrinks"} by $${p}\\%$ each year. Which function gives its size after $t$ years?`,
                `${thing["zh-CN"]}起初是 $${a}$，每年${up ? "增长" : "减少"} $${p}\\%$。哪个函数给出 $t$ 年后的大小？`,
              )
            : t(
                `${thing.en} starts at $${a}$ and ${up ? "grows" : "shrinks"} by $${p}$ each year. Which function gives its size after $t$ years?`,
                `${thing["zh-CN"]}起初是 $${a}$，每年${up ? "增长" : "减少"} $${p}$。哪个函数给出 $t$ 年后的大小？`,
              ),
          correct,
          wrong,
          percent
            ? t(
                `A fixed percent change multiplies by the same factor each year, $1 ${sign} ${p / 100} = ${factor}$, so the function is exponential: $f(t) = ${expo}$.`,
                `固定的百分比变化意味着每年乘同一个倍数 $1 ${sign} ${p / 100} = ${factor}$，所以函数是指数的：$f(t) = ${expo}$。`,
              )
            : t(
                `A fixed amount of change each year means equal steps, so the function is linear: $f(t) = ${lin}$.`,
                `每年变化固定的量意味着步长相等，所以函数是线性的：$f(t) = ${lin}$。`,
              ),
        );
      },
    ),
    kp(
      "an-output-from-the-right-model",
      t("An output from the right model", "由正确的模型求输出"),
      t(
        "Decide the kind of change first, then compute. Equal additions need the linear form, so multiply the change by the number of steps. Equal factors need the exponential form, so raise the factor to the number of steps. Doubling $50$ three times gives $50 \\cdot 2^{3} = 400$, not $50 \\cdot 2 \\cdot 3 = 300$.",
        "先判断变化的类型，再计算。每次加相同的量用线性形式，把变化量乘步数。每次乘相同的倍数用指数形式，把倍数乘方。把 $50$ 翻倍三次得 $50 \\cdot 2^{3} = 400$，而不是 $50 \\cdot 2 \\cdot 3 = 300$。",
      ),
      (rng) => {
        const a = rng.pick([20, 25, 40, 50, 60, 80, 100, 150, 200]);
        const n = rng.int(2, 5);
        if (rng.bool()) {
          const f = rng.pick([2, 3]);
          const answer = a * f ** n;
          return numberProblem({
            prompt: t(
              `A culture has $${a}$ cells and ${f === 2 ? "doubles" : "triples"} every hour. How many cells does it have after $${n}$ hours?`,
              `一个培养物有 $${a}$ 个细胞，每小时变为原来的 $${f}$ 倍。$${n}$ 小时后有多少个细胞？`,
            ),
            answer,
            wrong: [a * f * n, a + f * n, a * n ** f, a * f ** (n - 1)],
            solution: t(
              `Each hour multiplies by the same factor, so the model is exponential, not linear.${steps(`f(n) = ${a} \\cdot ${f}^{n}`, `f(${n}) = ${a} \\cdot ${f ** n} = ${answer}`)}`,
              `每小时都乘同一个倍数，所以模型是指数的，不是线性的。${steps(`f(n) = ${a} \\cdot ${f}^{n}`, `f(${n}) = ${a} \\cdot ${f ** n} = ${answer}`)}`,
            ),
          });
        }
        const d = rng.pick([5, 8, 10, 12, 15, 20, 25, 30]);
        const answer = a + d * n;
        return numberProblem({
          prompt: t(
            `A tank holds $${a}$ gallons, and $${d}$ gallons are added every hour. How many gallons does it hold after $${n}$ hours?`,
            `水箱中有 $${a}$ 加仑水，每小时加入 $${d}$ 加仑。$${n}$ 小时后水箱中有多少加仑？`,
          ),
          answer,
          wrong: [a * d * n, a + d, d * n, (a + d) * n],
          solution: t(
            `The same amount is added each hour, so the model is linear, not exponential.${steps(`f(n) = ${a} + ${d}n`, `f(${n}) = ${a} + ${d * n} = ${answer}`)}`,
            `每小时加入相同的量，所以模型是线性的，不是指数的。${steps(`f(n) = ${a} + ${d}n`, `f(${n}) = ${a} + ${d * n} = ${answer}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Travel

/** reasoningAboutMultiLegTravel totals the legs of a trip and finds the speed a remaining leg needs. */
export const reasoningAboutMultiLegTravel = topic(
  "reasoning-about-multi-leg-travel",
  t("Reasoning About Multi-Leg Travel", "关于多段行程的推理"),
  t(
    "Find total time and average speed of a trip with legs at different speeds, and the speed a remaining leg needs.",
    "求各段速度不同的行程的总时间和平均速度，以及剩余路段所需的速度。",
  ),
  ["further-speed-distance-time"],
  ["6.RP.A.3b"],
  [
    kp(
      "average-speed-over-the-whole-trip",
      t("Average speed over the whole trip", "全程的平均速度"),
      t(
        "Each leg has its own distance, speed and time, related by $d = rt$. The average speed of the trip is the total distance over the total time, and not the average of the two speeds, because the slower leg lasts longer. So find each leg's missing quantity first, then add distances and add times.",
        "每一段都有自己的路程、速度和时间，满足 $d = rt$。全程的平均速度是总路程除以总时间，而不是两个速度的平均，因为较慢的一段用时更长。所以先求每段缺少的量，再把路程相加、时间相加。",
      ),
      (rng) => {
        const r1 = rng.pick([20, 30, 40, 45, 50, 60]);
        const r2 = rng.pick([20, 30, 40, 45, 50, 60, 70].filter((v) => v !== r1));
        const t1 = rng.int(1, 5);
        const t2 = rng.int(1, 5);
        const d1 = r1 * t1;
        const d2 = r2 * t2;
        const form = rng.int(0, 1);
        if (form === 0) {
          return numberProblem({
            prompt: t(
              `A driver goes $${d1}$ miles at $${r1}$ miles per hour and then $${d2}$ miles at $${r2}$ miles per hour. What is the average speed for the whole trip, in miles per hour?`,
              `一名司机以 $${r1}$ 英里/时行驶 $${d1}$ 英里，再以 $${r2}$ 英里/时行驶 $${d2}$ 英里。全程的平均速度是多少英里/时？`,
            ),
            answer: Q.of(d1 + d2, t1 + t2),
            wrong: [Q.of(r1 + r2, 2), d1 + d2, t1 + t2, Q.of(d1 + d2, 2)],
            solution: t(
              `The average speed is total distance over total time. The legs take $\\frac{${d1}}{${r1}} = ${t1}$ and $\\frac{${d2}}{${r2}} = ${t2}$ hours.${steps(`\\frac{${d1} + ${d2}}{${t1} + ${t2}} = ${fr(d1 + d2, t1 + t2)}`)}`,
              `平均速度是总路程除以总时间。两段分别用 $\\frac{${d1}}{${r1}} = ${t1}$ 和 $\\frac{${d2}}{${r2}} = ${t2}$ 小时。${steps(`\\frac{${d1} + ${d2}}{${t1} + ${t2}} = ${fr(d1 + d2, t1 + t2)}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `A cyclist's trip has two legs: $${t1}$ hours at $${r1}$ kilometers per hour, then $${d2}$ kilometers at $${r2}$ kilometers per hour. How many hours does the whole trip take?`,
            `一名骑手的行程分两段：以 $${r1}$ 千米/时骑 $${t1}$ 小时，再以 $${r2}$ 千米/时骑 $${d2}$ 千米。全程用多少小时？`,
          ),
          answer: t1 + t2,
          wrong: [t1 + d2, Q.of(d1 + d2, r1 + r2), t2, Q.of(d1 + d2, r1)],
          solution: t(
            `The first leg's time is given, and the second's comes from distance over speed: $\\frac{${d2}}{${r2}} = ${t2}$. Adding gives $${t1} + ${t2} = ${t1 + t2}$ hours.`,
            `第一段的时间已知，第二段的时间等于路程除以速度：$\\frac{${d2}}{${r2}} = ${t2}$。相加得 $${t1} + ${t2} = ${t1 + t2}$ 小时。`,
          ),
        });
      },
    ),
    kp(
      "the-speed-a-remaining-leg-needs",
      t("The speed a remaining leg needs", "剩余路段所需的速度"),
      t(
        "A goal for the whole trip fixes what is left for the rest. Subtract the distance already covered from the total distance, and the time already used from the time allowed. The speed needed is what remains of the distance over what remains of the time, which may be well above the planned average.",
        "全程的目标决定了剩余路段的要求。从总路程中减去已走的路程，从允许的时间中减去已用的时间。所需速度就是剩余路程除以剩余时间，它可能比计划的平均速度高得多。",
      ),
      (rng) => {
        const r1 = rng.pick([30, 40, 45, 50, 55, 60]);
        const t1 = rng.int(1, 3);
        const left = rng.int(1, 4);
        const r2 = rng.pick([30, 40, 50, 55, 60, 65, 70, 75]);
        const total = r1 * t1 + r2 * left;
        const hours = t1 + left;
        return numberProblem({
          prompt: t(
            `A trip of $${total}$ miles must take $${hours}$ hours. The first $${t1}$ hour${t1 === 1 ? "" : "s"} are driven at $${r1}$ miles per hour. What speed, in miles per hour, is needed for the rest of the trip?`,
            `一段 $${total}$ 英里的行程必须在 $${hours}$ 小时内完成。前 $${t1}$ 小时以 $${r1}$ 英里/时行驶。其余路程需要多少英里/时的速度？`,
          ),
          answer: r2,
          wrong: [Q.of(total, hours), Q.of(2 * total - r1 * hours, hours), r2 + r1, total - r1 * t1],
          solution: t(
            `Find what remains, because only the rest of the trip is at the unknown speed.${steps(`${total} - ${r1} \\cdot ${t1} = ${total - r1 * t1}`, `${hours} - ${t1} = ${left}`, `\\frac{${total - r1 * t1}}{${left}} = ${r2}`)}`,
            `求出剩余部分，因为只有剩余路程才用未知的速度。${steps(`${total} - ${r1} \\cdot ${t1} = ${total - r1 * t1}`, `${hours} - ${t1} = ${left}`, `\\frac{${total - r1 * t1}}{${left}} = ${r2}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Percentages

/** reasoningFromMultiStagePercentages applies percent changes in sequence and works back from a final amount. */
export const reasoningFromMultiStagePercentages = topic(
  "reasoning-from-multi-stage-percentages",
  t("Reasoning From Multi-Stage Percentages", "由多阶段百分比推理"),
  t(
    "Apply percent changes one after another, each to the amount left by the one before, and work back from a final amount to the original.",
    "依次进行百分比变化，每次都作用在上一步的结果上；并由最终金额反推原值。",
  ),
  ["applying-percentages-in-succession"],
  ["7.RP.A.3"],
  [
    kp(
      "changes-applied-in-order",
      t("Changes applied in order", "依次进行的变化"),
      t(
        "A second percent applies to the amount after the first, not to the original. So a $20\\%$ rise followed by a $20\\%$ fall does not return to the start: $100 \\to 120 \\to 96$. Each change is one multiplication, by $1 + p$ for a rise and $1 - p$ for a fall, so simply adding the percentages gives the wrong answer.",
        "第二个百分比作用在第一步之后的金额上，而不是原值。所以先涨 $20\\%$ 再跌 $20\\%$ 并不会回到起点：$100 \\to 120 \\to 96$。每次变化就是一次乘法，上涨乘 $1 + p$，下跌乘 $1 - p$，所以简单地把百分比相加会得到错误答案。",
      ),
      (rng) => {
        const a = rng.pick([10, 20, 25, 50]);
        const b = rng.pick([10, 20, 25, 50].filter((v) => v !== a));
        const base = 400 * rng.int(1, 5);
        const riseFirst = rng.bool();
        const first = base + (base * (riseFirst ? a : -a)) / 100;
        const final = first + (first * (riseFirst ? -b : b)) / 100;
        const context = rng.pick([
          t("A jacket", "一件夹克"),
          t("A bicycle", "一辆自行车"),
          t("A television", "一台电视机"),
          t("A sofa", "一张沙发"),
        ]);
        return numberProblem({
          prompt: t(
            `${context.en} priced at $\\$${base}$ is ${riseFirst ? `marked up $${a}\\%$` : `discounted $${a}\\%$`}, and the new price is then ${riseFirst ? `discounted $${b}\\%$` : `marked up $${b}\\%$`}. What is the final price, in dollars?`,
            `${context["zh-CN"]}原价 $\\$${base}$，先${riseFirst ? `涨价 $${a}\\%$` : `打折降价 $${a}\\%$`}，然后在新价格上再${riseFirst ? `降价 $${b}\\%$` : `涨价 $${b}\\%$`}。最终价格是多少美元？`,
          ),
          answer: Q.of(Math.round(final * 100), 100),
          wrong: [Q.of(base * (100 + (riseFirst ? a - b : b - a)), 100), base, first, Q.of(base * (riseFirst ? b : a), 100)],
          form: "decimal",
          solution: t(
            `Apply the changes in order, the second to the result of the first.${steps(`${base} \\cdot ${(100 + (riseFirst ? a : -a)) / 100} = ${first}`, `${first} \\cdot ${(100 + (riseFirst ? -b : b)) / 100} = ${final}`)}`,
            `按顺序进行变化，第二次作用在第一次的结果上。${steps(`${base} \\cdot ${(100 + (riseFirst ? a : -a)) / 100} = ${first}`, `${first} \\cdot ${(100 + (riseFirst ? -b : b)) / 100} = ${final}`)}`,
          ),
        });
      },
    ),
    kp(
      "back-from-a-final-amount",
      t("Back from a final amount", "由最终金额反推"),
      t(
        "To undo a percent change, divide by its factor instead of reversing the percent. If a price after a $25\\%$ discount is $\\$60$, the original was $\\frac{60}{0.75} = 80$, while adding back $25\\%$ of $60$ gives $75$. With several stages, divide by each factor in turn, in any order, since multiplying is commutative.",
        "要还原百分比变化，应除以它的倍数，而不是把百分比反过来用。打 $25\\%$ 折后价格是 $\\$60$，原价是 $\\frac{60}{0.75} = 80$，而把 $60$ 加上它的 $25\\%$ 得到的是 $75$。有多个阶段时，依次除以各个倍数，顺序不限，因为乘法可交换。",
      ),
      (rng) => {
        const a = rng.pick([10, 20, 25, 50]);
        const b = rng.pick([5, 8, 10, 20, 25]);
        const base = 100 * rng.int(1, 12);
        const after = (base * (100 - a)) / 100;
        const final = (after * (100 + b)) / 100;
        const tax = rng.bool();
        if (tax) {
          return numberProblem({
            prompt: t(
              `After a $${a}\\%$ discount and then a $${b}\\%$ sales tax on the discounted price, a customer pays $${money(Math.round(final * 100))}$. What was the original price, in dollars?`,
              `先打折 $${a}\\%$，再按折后价加收 $${b}\\%$ 的销售税，顾客支付 $${money(Math.round(final * 100))}$。原价是多少美元？`,
            ),
            answer: base,
            wrong: [
              Q.of(Math.round(final * (100 + a - b)), 100),
              Q.of(Math.round(final * 10000), 100 * (100 + a - b)),
              after,
              Math.round(final),
            ],
            form: "decimal",
            solution: t(
              `Undo each change by dividing by its factor, since each stage multiplied by a factor.${steps(`\\frac{${final}}{${(100 + b) / 100}} = ${after}`, `\\frac{${after}}{${(100 - a) / 100}} = ${base}`)}`,
              `每个阶段都乘了一个倍数，所以用除以倍数来还原。${steps(`\\frac{${final}}{${(100 + b) / 100}} = ${after}`, `\\frac{${after}}{${(100 - a) / 100}} = ${base}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `A price falls by $${a}\\%$, to $${money(Math.round(after * 100))}$. What was the price before the fall, in dollars?`,
            `价格下跌 $${a}\\%$，变为 $${money(Math.round(after * 100))}$。下跌前的价格是多少美元？`,
          ),
          answer: base,
          wrong: [Q.of(Math.round(after * (100 + a)), 100), Q.of(Math.round(after * (100 - a)), 100), after + a, after],
          form: "decimal",
          solution: t(
            `The new price is $${(100 - a) / 100}$ of the old, so divide by that factor; adding $${a}\\%$ of the new price would use the wrong base.${steps(`\\frac{${after}}{${(100 - a) / 100}} = ${base}`)}`,
            `新价格是旧价格的 $${(100 - a) / 100}$，所以除以这个倍数；加上新价格的 $${a}\\%$ 用错了基准。${steps(`\\frac{${after}}{${(100 - a) / 100}} = ${base}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Converted units

/** applyingConvertedLengths uses a converted length to count pieces or find a cost. */
export const applyingConvertedLengths = topic(
  "applying-converted-lengths",
  t("Applying Converted Lengths", "运用换算后的长度"),
  t(
    "Convert a length to the unit of the question, then count how many pieces it makes or how much it costs.",
    "把长度换算成题目所用的单位，再算能分成几段或要花多少钱。",
  ),
  ["unit-conversions-using-base-units-of-length"],
  ["5.MD.A.1", "6.RP.A.3d"],
  [
    kp(
      "pieces-cut-from-a-converted-length",
      t("Pieces cut from a converted length", "由换算后的长度裁成几段"),
      t(
        "A length and a piece given in different units cannot be divided directly. Convert one to match the other: $1$ foot is $12$ inches, $1$ yard is $3$ feet and $1$ meter is $100$ centimeters. Then divide, and if there is a remainder, keep only the whole pieces, because a leftover shorter than one piece is not a piece.",
        "单位不同的总长和每段长度不能直接相除。把其中一个换算成另一个的单位：$1$ 英尺是 $12$ 英寸，$1$ 码是 $3$ 英尺，$1$ 米是 $100$ 厘米。然后相除；如果有余数，只算完整的段，因为比一段短的余料不算一段。",
      ),
      (rng) => {
        const [big, small, factor] = rng.pick([
          [t("feet", "英尺"), t("inches", "英寸"), 12],
          [t("yards", "码"), t("feet", "英尺"), 3],
          [t("meters", "米"), t("centimeters", "厘米"), 100],
          [t("yards", "码"), t("inches", "英寸"), 36],
        ] as const);
        const piece = factor === 3 ? rng.int(2, 5) : factor === 100 ? rng.pick([15, 20, 30, 40, 60]) : rng.pick([4, 5, 7, 8, 9, 10]);
        const L = rng.int(3, 15);
        const total = L * factor;
        const answer = Math.floor(total / piece);
        const left = total - answer * piece;
        return numberProblem({
          prompt: t(
            `A cord is $${L}$ ${big.en} long. How many whole pieces, each $${piece}$ ${small.en} long, can be cut from it?`,
            `一根绳长 $${L}$ ${big["zh-CN"]}。可以从中裁出多少段长为 $${piece}$ ${small["zh-CN"]}的完整绳段？`,
          ),
          answer,
          wrong: [Math.floor(L / piece) || L, L * piece, answer + 1, total, Math.max(1, answer - 1)],
          solution: t(
            `Convert first, so that both lengths are in ${small.en}: $${L} \\cdot ${factor} = ${total}$. Then $${total} \\div ${piece}$ gives $${answer}$ whole pieces${left ? `, with $${left}$ ${small.en} left over` : ""}.`,
            `先换算，使两个长度都以${small["zh-CN"]}为单位：$${L} \\cdot ${factor} = ${total}$。然后 $${total} \\div ${piece}$ 得 $${answer}$ 段完整的绳段${left ? `，余下 $${left}$ ${small["zh-CN"]}` : ""}。`,
          ),
        });
      },
    ),
    kp(
      "a-cost-priced-in-another-unit",
      t("A cost priced in another unit", "用另一单位计价的费用"),
      t(
        "When a length is measured in one unit and priced in another, convert the length to the priced unit before multiplying. If fence sells by the yard, a run of $48$ feet is $\\frac{48}{3} = 16$ yards. At $\\$5$ a yard it costs $\\$80$. Multiplying $48$ by $5$ prices each foot as if it were a yard.",
        "长度用一种单位测量、却用另一种单位计价时，要先把长度换算成计价单位再相乘。如果栅栏按码出售，$48$ 英尺是 $\\frac{48}{3} = 16$ 码。每码 $\\$5$，共 $\\$80$。用 $48$ 乘 $5$ 就是把每英尺当成一码来计价了。",
      ),
      (rng) => {
        const [big, small, factor] = rng.pick([
          [t("yard", "码"), t("feet", "英尺"), 3],
          [t("foot", "英尺"), t("inches", "英寸"), 12],
          [t("meter", "米"), t("centimeters", "厘米"), 100],
        ] as const);
        const units = rng.int(4, 30);
        const price = rng.int(2, 15);
        const total = units * factor;
        const answer = units * price;
        const thing = rng.pick([t("Fencing", "栅栏"), t("Ribbon", "丝带"), t("Fabric trim", "布边"), t("Cable", "电缆")]);
        return numberProblem({
          prompt: t(
            `${thing.en} costs $\\$${price}$ per ${big.en}. What is the cost, in dollars, of $${total}$ ${small.en} of it?`,
            `${thing["zh-CN"]}每${big["zh-CN"]} $\\$${price}$。$${total}$ ${small["zh-CN"]}要多少美元？`,
          ),
          answer,
          wrong: [total * price, units, Q.of(price * 100, factor), total + price],
          solution: t(
            `The price is per ${big.en}, so convert the length to that unit first: $\\frac{${total}}{${factor}} = ${units}$. The cost is $${units} \\cdot ${price} = ${answer}$ dollars.`,
            `价格按每${big["zh-CN"]}计，所以先把长度换算成这个单位：$\\frac{${total}}{${factor}} = ${units}$。费用是 $${units} \\cdot ${price} = ${answer}$ 美元。`,
          ),
        });
      },
    ),
  ],
);

/** reasoningWithDerivedTravelRates derives a speed from a trip, converts it, and uses it for another trip. */
export const reasoningWithDerivedTravelRates = topic(
  "reasoning-with-derived-travel-rates",
  t("Reasoning With Derived Travel Rates", "运用推导出的行进速度推理"),
  t(
    "Derive a speed from one trip, convert its units where needed, and use it to find the distance or time of another trip.",
    "由一段行程推导出速度，必要时换算单位，再用它求另一段行程的路程或时间。",
  ),
  ["speed-distance-time"],
  ["6.RP.A.3b", "6.RP.A.3d"],
  [
    kp(
      "a-rate-from-one-trip-used-on-another",
      t("A rate from one trip used on another", "把一段行程的速度用于另一段"),
      t(
        "Often the rate is not given but follows from a first trip: speed is distance over time. Find that rate, keeping the time in a single unit, and then use it for the second trip. A walker covering $3$ miles in $45$ minutes goes $\\frac{3}{45} = \\frac{1}{15}$ of a mile per minute, so $5$ miles takes $75$ minutes.",
        "速度常常不直接给出，而要从第一段行程算出：速度等于路程除以时间。求出这个速度（时间用同一单位），再用于第二段行程。步行者 $45$ 分钟走 $3$ 英里，每分钟走 $\\frac{3}{45} = \\frac{1}{15}$ 英里，所以走 $5$ 英里要 $75$ 分钟。",
      ),
      (rng) => {
        const per = rng.pick([5, 6, 8, 10, 12, 15, 20]);
        const d1 = rng.int(2, 9);
        const t1 = d1 * per;
        const d2 = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12].filter((v) => v !== d1));
        const t2 = d2 * per;
        const thing = rng.pick([
          t("A walker", "一名步行者"),
          t("A runner", "一名跑步者"),
          t("A cyclist", "一名骑手"),
          t("A rowing crew", "一支赛艇队"),
        ]);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `${thing.en} covers $${d1}$ miles in $${t1}$ minutes. At the same rate, how many minutes does it take to cover $${d2}$ miles?`,
              `${thing["zh-CN"]} $${t1}$ 分钟行进 $${d1}$ 英里。按同样的速度，行进 $${d2}$ 英里要多少分钟？`,
            ),
            answer: t2,
            wrong: [Q.of(t1 * d1, d2), t1 + d2 - d1, per, t2 + per],
            solution: t(
              `The first trip gives the rate: $\\frac{${t1}}{${d1}} = ${per}$ minutes per mile. So $${d2}$ miles take $${d2} \\cdot ${per} = ${t2}$ minutes.`,
              `第一段行程给出速度：每英里 $\\frac{${t1}}{${d1}} = ${per}$ 分钟。所以 $${d2}$ 英里要 $${d2} \\cdot ${per} = ${t2}$ 分钟。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `${thing.en} covers $${d1}$ miles in $${t1}$ minutes. At the same rate, how many miles are covered in $${t2}$ minutes?`,
            `${thing["zh-CN"]} $${t1}$ 分钟行进 $${d1}$ 英里。按同样的速度，$${t2}$ 分钟行进多少英里？`,
          ),
          answer: d2,
          wrong: [Q.of(t2, d1), t2 - t1 + d1, per, d2 + 1],
          solution: t(
            `The first trip gives the rate: $\\frac{${t1}}{${d1}} = ${per}$ minutes per mile. So $${t2}$ minutes cover $\\frac{${t2}}{${per}} = ${d2}$ miles.`,
            `第一段行程给出速度：每英里 $\\frac{${t1}}{${d1}} = ${per}$ 分钟。所以 $${t2}$ 分钟行进 $\\frac{${t2}}{${per}} = ${d2}$ 英里。`,
          ),
        });
      },
    ),
    kp(
      "converting-a-derived-rate",
      t("Converting a derived rate", "换算推导出的速度"),
      t(
        "A rate per minute becomes a rate per hour by multiplying by $60$, since an hour holds $60$ minutes and so covers $60$ times as much. A rate per hour becomes a rate per minute by dividing by $60$. Check by asking whether the answer should be bigger or smaller: a longer time covers more distance.",
        "每分钟的速度乘 $60$ 就是每小时的速度，因为一小时有 $60$ 分钟，走的路程是 $60$ 倍。每小时的速度除以 $60$ 就是每分钟的速度。可以这样检验：答案应该更大还是更小？时间越长，路程越多。",
      ),
      (rng) => {
        const m = rng.pick([10, 12, 15, 20, 30]);
        const j = rng.int(Math.ceil(m / 2), Math.floor((m * 3) / 2));
        const d = j;
        const mph = (j * 60) / m;
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `A train goes $${d}$ miles in $${m}$ minutes at a steady speed. What is its speed in miles per hour?`,
              `一列火车匀速行驶，$${m}$ 分钟行驶 $${d}$ 英里。它的速度是多少英里/时？`,
            ),
            answer: mph,
            wrong: [Q.of(d, m), d * m, Q.of(d * m, 60), mph + d],
            solution: t(
              `An hour holds $\\frac{60}{${m}} = ${60 / m}$ intervals of $${m}$ minutes, so it covers that many times the distance: $${d} \\cdot ${60 / m} = ${mph}$.`,
              `一小时包含 $\\frac{60}{${m}} = ${60 / m}$ 个 $${m}$ 分钟，所以路程是这个倍数：$${d} \\cdot ${60 / m} = ${mph}$。`,
            ),
          });
        }
        const speed = mph;
        const minutes = m;
        const answer = (speed * minutes) / 60;
        return numberProblem({
          prompt: t(
            `A train travels at $${speed}$ miles per hour. How many miles does it go in $${minutes}$ minutes?`,
            `一列火车以 $${speed}$ 英里/时的速度行驶。$${minutes}$ 分钟行驶多少英里？`,
          ),
          answer,
          wrong: [speed * minutes, Q.of(speed, minutes), speed, answer + minutes],
          solution: t(
            `The rate is per hour and the time is in minutes, so convert the time: $${minutes}$ minutes is $${fr(minutes, 60)}$ of an hour. So the distance is $${speed} \\cdot ${fr(minutes, 60)} = ${answer}$ miles.`,
            `速度以小时计，时间以分钟计，所以要换算时间：$${minutes}$ 分钟是 $${fr(minutes, 60)}$ 小时。所以路程是 $${speed} \\cdot ${fr(minutes, 60)} = ${answer}$ 英里。`,
          ),
        });
      },
    ),
  ],
);

/** usingConvertedUnitsOfArea prices or covers an area measured in another unit. */
export const usingConvertedUnitsOfArea = topic(
  "using-converted-units-of-area",
  t("Using Converted Units of Area", "运用换算后的面积单位"),
  t(
    "Find the cost or the number of tiles for a region when its area is measured in one unit and sold or covered in another.",
    "面积用一种单位测量、却用另一种单位出售或铺设时，求费用或地砖的块数。",
  ),
  ["converting-units-of-area-to-larger-units"],
  ["5.MD.A.1", "6.G.A.1"],
  [
    kp(
      "pricing-an-area-in-another-unit",
      t("Pricing an area in another unit", "用另一单位为面积计价"),
      t(
        "Area units convert by the square of the length factor: $1$ yard is $3$ feet, so $1$ square yard is $3 \\cdot 3 = 9$ square feet. A floor of $18$ feet by $12$ feet has an area of $216$ square feet, which is $\\frac{216}{9} = 24$ square yards. Dividing by $3$ is the common mistake, since it uses the length factor.",
        "面积单位按长度换算系数的平方换算：$1$ 码是 $3$ 英尺，所以 $1$ 平方码是 $3 \\cdot 3 = 9$ 平方英尺。$18$ 英尺乘 $12$ 英尺的地面面积是 $216$ 平方英尺，即 $\\frac{216}{9} = 24$ 平方码。除以 $3$ 是常见错误，因为它用的是长度系数。",
      ),
      (rng) => {
        const yl = rng.int(2, 10);
        const yw = rng.int(2, 8);
        const price = rng.int(3, 25);
        const L = 3 * yl;
        const W = 3 * yw;
        const area = L * W;
        const yards = yl * yw;
        const answer = yards * price;
        const thing = rng.pick([t("Carpet", "地毯"), t("Sod", "草皮"), t("Flooring", "地板")]);
        return numberProblem({
          prompt: t(
            `A room measures $${L}$ feet by $${W}$ feet. ${thing.en} costs $\\$${price}$ per square yard. What is the cost, in dollars, of covering the whole room?`,
            `一个房间长 $${L}$ 英尺，宽 $${W}$ 英尺。${thing["zh-CN"]}每平方码 $\\$${price}$。铺满整个房间要多少美元？`,
          ),
          answer,
          wrong: [area * price, Q.of(area * price, 3), yards, 2 * (L + W) * price],
          solution: t(
            `The price is per square yard, and a square yard is $3 \\cdot 3 = 9$ square feet.${steps(`${L} \\cdot ${W} = ${area}`, `\\frac{${area}}{9} = ${yards}`, `${yards} \\cdot ${price} = ${answer}`)}`,
            `价格按每平方码计，而 $1$ 平方码是 $3 \\cdot 3 = 9$ 平方英尺。${steps(`${L} \\cdot ${W} = ${area}`, `\\frac{${area}}{9} = ${yards}`, `${yards} \\cdot ${price} = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "tiles-measured-in-a-smaller-unit",
      t("Tiles measured in a smaller unit", "以较小单位度量的地砖"),
      t(
        "To count the tiles covering a region, make the two measures use one unit. Either convert both lengths and divide the areas, or find how many tiles fit along each side and multiply. A floor $6$ feet by $4$ feet with $6$-inch tiles has $12$ tiles along one side and $8$ along the other, for $96$ tiles.",
        "要数铺满一个区域的地砖块数，先让两个量用同一单位。可以换算两个长度后把面积相除，也可以求每条边能放几块再相乘。$6$ 英尺乘 $4$ 英尺的地面，用边长 $6$ 英寸的地砖，一边放 $12$ 块，另一边放 $8$ 块，共 $96$ 块。",
      ),
      (rng) => {
        const side = rng.pick([3, 4, 6, 12]);
        const L = rng.int(2, 15);
        const W = rng.int(2, 12);
        const along = (12 / side) * L;
        const across = (12 / side) * W;
        const answer = along * across;
        return numberProblem({
          prompt: t(
            `A floor measures $${L}$ feet by $${W}$ feet. How many square tiles with sides of $${side}$ inches are needed to cover it exactly?`,
            `地面长 $${L}$ 英尺，宽 $${W}$ 英尺。恰好铺满它需要多少块边长为 $${side}$ 英寸的正方形地砖？`,
          ),
          answer,
          wrong: [Q.of(L * W, side), Q.of(L * W * 12, side), L * W * side, along + across],
          solution: t(
            `A foot holds $\\frac{12}{${side}} = ${12 / side}$ tiles, so count the tiles along each side and multiply.${steps(`${L} \\cdot ${12 / side} = ${along}`, `${W} \\cdot ${12 / side} = ${across}`, `${along} \\cdot ${across} = ${answer}`)}`,
            `$1$ 英尺能放 $\\frac{12}{${side}} = ${12 / side}$ 块，所以数出每条边的块数再相乘。${steps(`${L} \\cdot ${12 / side} = ${along}`, `${W} \\cdot ${12 / side} = ${across}`, `${along} \\cdot ${across} = ${answer}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Money with rounding

/** solvingOneAndTwoStepMoneyProblemsWithRoundedAmounts estimates with rounded prices and rounds a count of packages up. */
export const solvingOneAndTwoStepMoneyProblemsWithRoundedAmounts = topic(
  "solving-one-and-two-step-money-problems-with-rounded-amounts",
  t("Solving One- and Two-Step Money Problems With Rounded Amounts", "解含凑整金额的一两步货币问题"),
  t(
    "Estimate a bill by rounding each price as stated, and buy whole packages by rounding a quotient up.",
    "按要求把每个价格凑整来估算账单，并通过把商向上取整来购买整包商品。",
  ),
  ["rounding-up-decimals"],
  ["4.OA.A.3", "5.NBT.B.7"],
  [
    kp(
      "estimating-with-rounded-prices",
      t("Estimating with rounded prices", "用凑整的价格估算"),
      t(
        "To estimate a bill, round each price first, as the question says, and then compute with the easy numbers. If $\\$3.89$ and $\\$7.15$ are rounded to the nearest dollar, the estimate is $4 + 7 = 11$. Rounding the exact total at the end is a different process and can give a different answer.",
        "估算账单时，先按题目的要求把每个价格凑整，再用简单的数计算。如果把 $\\$3.89$ 和 $\\$7.15$ 凑整到最接近的美元，估算结果是 $4 + 7 = 11$。最后才对精确总额凑整是另一种做法，结果可能不同。",
      ),
      (rng) => {
        const a = rng.int(1, 9) * 100 + rng.pick([15, 25, 35, 45, 55, 65, 75, 85, 95]);
        const b = rng.int(3, 19) * 100 + rng.pick([12, 29, 39, 49, 59, 69, 79, 89, 99]);
        const qty = rng.int(2, 6);
        const round = (c: number) => Math.round(c / 100);
        const answer = qty * round(a) + round(b);
        const exact = qty * a + b;
        return numberProblem({
          prompt: t(
            `A shopper buys $${qty}$ notebooks at $${money(a)}$ each and a backpack at $${money(b)}$. Rounding each price to the nearest dollar before computing, what is the estimated total, in dollars?`,
            `一位顾客买 $${qty}$ 本单价 $${money(a)}$ 的笔记本和一个 $${money(b)}$ 的背包。先把每个价格凑整到最接近的美元再计算，估算的总额是多少美元？`,
          ),
          answer,
          wrong: [
            round(a) + round(b),
            qty * Math.floor(a / 100) + Math.floor(b / 100),
            qty * Math.ceil(a / 100) + Math.ceil(b / 100),
            Q.of(exact, 100),
          ],
          solution: t(
            `Round each price first, as the question asks: $${money(a)}$ becomes $\\$${round(a)}$ and $${money(b)}$ becomes $\\$${round(b)}$. Then ${"$"}${qty} \\cdot ${round(a)} + ${round(b)} = ${answer}${"$"}.`,
            `按题目要求先把每个价格凑整：$${money(a)}$ 变成 $\\$${round(a)}$，$${money(b)}$ 变成 $\\$${round(b)}$。然后 $${qty} \\cdot ${round(a)} + ${round(b)} = ${answer}$。`,
          ),
        });
      },
    ),
    kp(
      "buying-whole-packages",
      t("Buying whole packages", "购买整包"),
      t(
        "Things sold in whole packages force the quotient to be rounded, and the situation decides the direction. Enough for everyone means rounding up, so $26$ items in packs of $8$ need $4$ packs, since $3$ packs hold only $24$. How many can be afforded means rounding down, since a partial item cannot be bought.",
        "按整包出售的商品要求对商取整，方向由情境决定。要保证够用就向上取整，所以 $26$ 件、每包 $8$ 件，需要 $4$ 包，因为 $3$ 包只有 $24$ 件。问买得起多少时要向下取整，因为买不了零头。",
      ),
      (rng) => {
        if (rng.bool()) {
          const pack = rng.pick([6, 8, 10, 12, 15, 24]);
          const need = pack * rng.int(2, 9) + rng.int(1, pack - 1);
          const packs = Math.ceil(need / pack);
          const cents = rng.int(2, 12) * 100 + rng.pick([0, 25, 50, 75]);
          const cost = packs * cents;
          return numberProblem({
            prompt: t(
              `Markers come in packs of $${pack}$, at $${money(cents)}$ per pack. A teacher needs $${need}$ markers. What is the least possible cost, in dollars?`,
              `马克笔每包 $${pack}$ 支，每包 $${money(cents)}$。一位老师需要 $${need}$ 支。最少要花多少美元？`,
            ),
            answer: Q.of(cost, 100),
            wrong: [
              Q.of((packs - 1) * cents, 100),
              Q.of(need * cents, 100 * pack),
              Q.of(need * cents, 100),
              Q.of((packs + 1) * cents, 100),
            ],
            form: "decimal",
            solution: t(
              `Everyone must be supplied, so round the quotient up: $${need} \\div ${pack}$ needs $${packs}$ packs, since $${packs - 1}$ packs hold only $${(packs - 1) * pack}$. The cost is ${"$"}${packs} \\cdot ${money(cents)} = ${money(cost)}${"$"}.`,
              `必须够用，所以把商向上取整：$${need} \\div ${pack}$ 需要 $${packs}$ 包，因为 $${packs - 1}$ 包只有 $${(packs - 1) * pack}$ 支。费用是 $${packs} \\cdot ${money(cents)} = ${money(cost)}$。`,
            ),
          });
        }
        const price = rng.int(2, 9) * 100 + rng.pick([25, 50, 75]);
        const n = rng.int(3, 12);
        const budget = (n * price + rng.int(1, price - 1)) / 100;
        const budgetText = budget.toFixed(2);
        return numberProblem({
          prompt: t(
            `Tickets cost $${money(price)}$ each. How many tickets can be bought with $\\$${budgetText}$?`,
            `门票每张 $${money(price)}$。用 $\\$${budgetText}$ 能买多少张门票？`,
          ),
          answer: n,
          wrong: [n + 1, n - 1, Math.round(budget), Math.ceil(budget / 2)],
          form: "integer",
          solution: t(
            `Divide the money by the price, and round down because a part of a ticket cannot be bought: $${budgetText} \\div ${(price / 100).toFixed(2)}$ is a little above $${n}$, so $${n}$ tickets can be bought.`,
            `用钱数除以单价，并向下取整，因为买不了半张门票：$${budgetText} \\div ${(price / 100).toFixed(2)}$ 略大于 $${n}$，所以能买 $${n}$ 张。`,
          ),
        });
      },
    ),
  ],
);

/** actFundamentalsReasoningDataTopics lists the data and quantity reasoning topics of ACT Math Fundamentals. */
export const actFundamentalsReasoningDataTopics: readonly TopicDef[] = [
  interpretingCompletedTwoWayTables,
  trackingADataChange,
  countingFavorableOutcomesInAConstructedSampleSpace,
  countingMembersFromVennData,
  reasoningFromStatedProbabilityRelationships,
  partitioningTotalsUsingRatios,
  computingTotalsFromStatedRates,
  selectingFunctionModelsAndOutputs,
  reasoningAboutMultiLegTravel,
  reasoningFromMultiStagePercentages,
  applyingConvertedLengths,
  reasoningWithDerivedTravelRates,
  usingConvertedUnitsOfArea,
  solvingOneAndTwoStepMoneyProblemsWithRoundedAmounts,
];
