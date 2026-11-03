import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { expressionProblem, numberProblem, steps } from "../problems.ts";

// ACT Math Fundamentals, data and modeling: amounts reduced by fractions in stages, the extreme data values a mean and
// median allow, counting by subtracting the cases that fail, and expressions for earnings from two sources or rates.

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

/** factorial is n!. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

/** choose is the binomial coefficient C(n, k). */
const choose = (n: number, k: number): number => (k < 0 || k > n ? 0 : factorial(n) / (factorial(k) * factorial(n - k)));

// ---------------------------------------------------------------------------
// Multi-stage fractions

/** stageFractions are the fractions taken at each stage. */
const stageFractions: readonly Q[] = [Q.of(1, 2), Q.of(1, 3), Q.of(2, 3), Q.of(1, 4), Q.of(3, 4), Q.of(1, 5), Q.of(2, 5), Q.of(3, 8)];

/** Stages is a context of the multi-stage problems, written for amounts a (the start), f1 and f2. */
interface Stages {
  readonly en: (a: string, f1: string, f2: string) => string;
  readonly zh: (a: string, f1: string, f2: string) => string;
  readonly ask: Text;
  readonly start: Text;
}

const stageContexts: readonly Stages[] = [
  {
    en: (a, f1, f2) => `Maya had ${a}. She spent $${f1}$ of it on a jacket and then $${f2}$ of what remained on shoes.`,
    zh: (a, f1, f2) => `玛雅有 ${a}。她把其中的 $${f1}$ 花在一件夹克上，又把剩下的钱的 $${f2}$ 花在鞋子上。`,
    ask: t("How many dollars did she have left?", "她还剩多少美元？"),
    start: t("How many dollars did she have at first?", "她起初有多少美元？"),
  },
  {
    en: (a, f1, f2) =>
      `A tank held ${a}. On Monday $${f1}$ of the water was used, and on Tuesday $${f2}$ of the water left in the tank was used.`,
    zh: (a, f1, f2) => `一个水箱装有 ${a}。周一用掉了其中的 $${f1}$，周二又用掉了箱中剩余水量的 $${f2}$。`,
    ask: t("How many liters were left in the tank?", "水箱中还剩多少升水？"),
    start: t("How many liters did the tank hold at first?", "水箱起初装有多少升水？"),
  },
  {
    en: (a, f1, f2) =>
      `A class had ${a}. On the first day $${f1}$ of the pencils were handed out, and on the second day $${f2}$ of the remaining pencils were handed out.`,
    zh: (a, f1, f2) => `一个班级有 ${a}。第一天发出了其中的 $${f1}$，第二天又发出了剩余铅笔的 $${f2}$。`,
    ask: t("How many pencils were left?", "还剩多少支铅笔？"),
    start: t("How many pencils did the class have at first?", "这个班级起初有多少支铅笔？"),
  },
];

/** amountText writes the starting amount of a context: "$120", "120 liters of water", "120 pencils". */
function amountText(i: number, a: string): Text {
  if (i === 0) return t(`$\\$${a}$`, `$${a}$ 美元`);
  if (i === 1) return t(`$${a}$ liters of water`, `$${a}$ 升水`);
  return t(`$${a}$ pencils`, `$${a}$ 支铅笔`);
}

/** reasoningWithMultiStageFractionalAmounts follows an amount through two fractional reductions, forward and backward. */
export const reasoningWithMultiStageFractionalAmounts = topic(
  "reasoning-with-multi-stage-fractional-amounts",
  t("Reasoning With Multi-Stage Fractional Amounts", "多阶段分数量的推理"),
  t(
    "Follow an amount through two stages, each removing a fraction of what is left, and work backward from what remains to the starting amount.",
    "跟踪一个量经过两个阶段的变化（每个阶段去掉剩余部分的一个分数），并由剩下的量倒推出起始量。",
  ),
  ["fractions-of-fractions"],
  ["7.NS.A.3"],
  [
    kp(
      "what-is-left-after-two-stages",
      t("What is left after two stages", "两个阶段后剩下多少"),
      t(
        "When the second fraction is taken of what remains, multiply by what is kept at each stage. If $\\frac{1}{3}$ of $\\$120$ is spent, $\\frac{2}{3}$ is kept: $\\$80$. If $\\frac{1}{4}$ of that is then spent, $\\frac{3}{4}$ of $\\$80$ is kept: $\\$60$. In one step, $120 \\cdot \\frac{2}{3} \\cdot \\frac{3}{4} = 60$. Subtracting $\\frac{1}{3} + \\frac{1}{4}$ of the original would treat both fractions as parts of $\\$120$.",
        "第二个分数取的是剩余部分时，把每个阶段保留的比例相乘。$\\$120$ 花掉 $\\frac{1}{3}$，保留 $\\frac{2}{3}$：$\\$80$。再花掉其中的 $\\frac{1}{4}$，保留 $\\$80$ 的 $\\frac{3}{4}$：$\\$60$。合成一步就是 $120 \\cdot \\frac{2}{3} \\cdot \\frac{3}{4} = 60$。如果从原来的量中减去 $\\frac{1}{3} + \\frac{1}{4}$，就把两个分数都当成了 $\\$120$ 的一部分。",
      ),
      (rng) => {
        const i = rng.int(0, stageContexts.length - 1);
        const ctx = stageContexts[i]!;
        const [f1, f2] = [rng.pick(stageFractions), rng.pick(stageFractions)];
        const unit = Number(f1.d * f2.d);
        const start = unit * rng.int(2, i === 0 ? 12 : 8) * (unit < 20 ? 2 : 1);
        const kept1 = Q.of(start).mul(Q.one.sub(f1));
        const left = kept1.mul(Q.one.sub(f2));
        const a = amountText(i, `${start}`);
        return numberProblem({
          prompt: t(
            `${ctx.en(a.en, f1.toLatex(), f2.toLatex())} ${ctx.ask.en}`,
            `${ctx.zh(a["zh-CN"], f1.toLatex(), f2.toLatex())}${ctx.ask["zh-CN"]}`,
          ),
          answer: left,
          wrong: [Q.of(start).mul(Q.one.sub(f1).sub(f2)), kept1.mul(f2), kept1, Q.of(start).mul(f1).mul(f2)].filter((w) => w.sign() >= 0),
          solution: t(
            `After the first stage $1 - ${f1.toLatex()} = ${Q.one.sub(f1).toLatex()}$ is kept, and after the second $1 - ${f2.toLatex()} = ${Q.one.sub(f2).toLatex()}$ of that:${steps(`${start} \\cdot ${Q.one.sub(f1).toLatex()} = ${kept1.toLatex()}`, `${kept1.toLatex()} \\cdot ${Q.one.sub(f2).toLatex()} = ${left.toLatex()}`)}`,
            `第一阶段后保留 $1 - ${f1.toLatex()} = ${Q.one.sub(f1).toLatex()}$，第二阶段后再保留其中的 $1 - ${f2.toLatex()} = ${Q.one.sub(f2).toLatex()}$：${steps(`${start} \\cdot ${Q.one.sub(f1).toLatex()} = ${kept1.toLatex()}`, `${kept1.toLatex()} \\cdot ${Q.one.sub(f2).toLatex()} = ${left.toLatex()}`)}`,
          ),
        });
      },
    ),
    kp(
      "the-starting-amount-from-what-is-left",
      t("The starting amount from what is left", "由剩余量求起始量"),
      t(
        "Work backward by dividing by the fraction kept at each stage. If $\\$60$ is left after spending $\\frac{1}{3}$ and then $\\frac{1}{4}$ of the rest, then $\\frac{2}{3} \\cdot \\frac{3}{4} = \\frac{1}{2}$ of the start is left, so the start was $60 \\div \\frac{1}{2} = \\$120$. Check by going forward: $120 \\to 80 \\to 60$.",
        "倒推时，依次除以每个阶段保留的比例。花掉 $\\frac{1}{3}$、再花掉剩余部分的 $\\frac{1}{4}$ 后剩 $\\$60$，则剩下的是起始量的 $\\frac{2}{3} \\cdot \\frac{3}{4} = \\frac{1}{2}$，所以起始量为 $60 \\div \\frac{1}{2} = \\$120$。正向检验：$120 \\to 80 \\to 60$。",
      ),
      (rng) => {
        const i = rng.int(0, stageContexts.length - 1);
        const ctx = stageContexts[i]!;
        const [f1, f2] = [rng.pick(stageFractions), rng.pick(stageFractions)];
        const unit = Number(f1.d * f2.d);
        const start = unit * rng.int(2, i === 0 ? 12 : 8) * (unit < 20 ? 2 : 1);
        const keep = Q.one.sub(f1).mul(Q.one.sub(f2));
        const left = Q.of(start).mul(keep);
        const leftText =
          i === 0 ? t(`$\\$${left.toLatex()}$`, `$${left.toLatex()}$ 美元`) : t(`$${left.toLatex()}$`, `$${left.toLatex()}$`);
        const prompt =
          i === 0
            ? t(
                `Maya spent $${f1.toLatex()}$ of her money on a jacket and then $${f2.toLatex()}$ of what remained on shoes. She had ${leftText.en} left. ${ctx.start.en}`,
                `玛雅把她的钱的 $${f1.toLatex()}$ 花在一件夹克上，又把剩下的钱的 $${f2.toLatex()}$ 花在鞋子上，最后剩下 ${leftText["zh-CN"]}。${ctx.start["zh-CN"]}`,
              )
            : i === 1
              ? t(
                  `On Monday $${f1.toLatex()}$ of the water in a tank was used, and on Tuesday $${f2.toLatex()}$ of the water left was used. Then $${left.toLatex()}$ liters remained. ${ctx.start.en}`,
                  `周一用掉了水箱中水的 $${f1.toLatex()}$，周二又用掉了剩余水量的 $${f2.toLatex()}$，之后还剩 $${left.toLatex()}$ 升。${ctx.start["zh-CN"]}`,
                )
              : t(
                  `On the first day $${f1.toLatex()}$ of a class's pencils were handed out, and on the second day $${f2.toLatex()}$ of the remaining pencils were handed out. Then $${left.toLatex()}$ pencils were left. ${ctx.start.en}`,
                  `第一天发出了班级铅笔的 $${f1.toLatex()}$，第二天又发出了剩余铅笔的 $${f2.toLatex()}$，之后还剩 $${left.toLatex()}$ 支。${ctx.start["zh-CN"]}`,
                );
        return numberProblem({
          prompt,
          answer: start,
          wrong: [
            left.mul(Q.one.add(f1).add(f2)),
            ...(Q.one.sub(f1).sub(f2).sign() > 0 ? [left.div(Q.one.sub(f1).sub(f2))] : []),
            left.div(Q.one.sub(f1)),
            left.div(Q.one.sub(f2)),
          ],
          solution: t(
            `The part left is $${Q.one.sub(f1).toLatex()} \\cdot ${Q.one.sub(f2).toLatex()} = ${keep.toLatex()}$ of the start, so${steps(`${keep.toLatex()} \\cdot \\text{start} = ${left.toLatex()}`, `\\text{start} = ${left.toLatex()} \\div ${keep.toLatex()} = ${start}`)}`,
            `剩下的部分是起始量的 $${Q.one.sub(f1).toLatex()} \\cdot ${Q.one.sub(f2).toLatex()} = ${keep.toLatex()}$，所以${steps(`${keep.toLatex()} \\cdot \\text{起始量} = ${left.toLatex()}`, `\\text{起始量} = ${left.toLatex()} \\div ${keep.toLatex()} = ${start}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Statistics a constraint forces

/** comparingStatisticsAConstraintForces finds the extreme value a data set can have under a given mean and median. */
export const comparingStatisticsAConstraintForces = topic(
  "comparing-statistics-a-constraint-forces",
  t("Comparing Statistics a Constraint Forces", "约束条件所决定的统计量"),
  t(
    "Find the greatest possible value in a data set of positive integers with a given mean, and with a given median as well, by making every other value as small as the conditions allow.",
    "在给定平均数（以及中位数）的正整数数据中，让其他值都取条件允许的最小值，从而求出最大值的最大可能值。",
  ),
  ["mean-of-a-data-set", "the-median-of-a-data-set"],
  ["6.SP.B.5c"],
  [
    kp(
      "the-largest-value-with-a-mean-and-median",
      t("The largest value with a mean and median", "给定平均数和中位数时的最大值"),
      t(
        "The mean fixes the total: $5$ values with mean $10$ add to $50$. To make the largest value as big as possible, make the others as small as allowed. With median $8$, the middle value is $8$, the two below it can be as small as $1$, and the one above the median but below the largest is at least $8$. So the largest is at most $50 - 1 - 1 - 8 - 8 = 32$.",
        "平均数决定了总和：$5$ 个平均数为 $10$ 的值之和为 $50$。要使最大值尽量大，就让其他值尽量小。中位数为 $8$ 时，中间的值为 $8$，它下面的两个值最小可以是 $1$，中位数以上、最大值以下的那个值至少为 $8$。所以最大值至多为 $50 - 1 - 1 - 8 - 8 = 32$。",
      ),
      (rng) => {
        const n = rng.pick([5, 7]);
        const k = (n - 1) / 2;
        const median = rng.int(4, 12);
        const mean = median + rng.int(1, 6);
        const total = n * mean;
        const answer = total - k - k * median;
        const smallest = Array<number>(k).fill(1);
        const values = [...smallest, ...Array<number>(k).fill(median), answer];
        return numberProblem({
          prompt: t(
            `A list of $${n}$ positive integers has a mean of $${mean}$ and a median of $${median}$. What is the greatest possible value of the largest integer in the list?`,
            `一组 $${n}$ 个正整数的平均数为 $${mean}$，中位数为 $${median}$。这组数中最大数的最大可能值是多少？`,
          ),
          answer,
          wrong: [total - k * median, total - median, total - k - (k + 1) * median, total - (n - 1)],
          solution: t(
            `The ${n} integers add to $${n} \\cdot ${mean} = ${total}$. The $${k}$ below the median can be $1$, the median is $${median}$, and the $${k - 1}$ ${k - 1 === 1 ? "value" : "values"} between the median and the largest must be at least $${median}$:${steps(`${total} - ${k}(1) - ${k}(${median}) = ${answer}`)}The list ${values.join(", ")} has this mean and median.`,
            `这 ${n} 个整数之和为 $${n} \\cdot ${mean} = ${total}$。中位数下面的 $${k}$ 个数可以是 $1$，中位数为 $${median}$，中位数与最大数之间的 $${k - 1}$ 个数至少为 $${median}$：${steps(`${total} - ${k}(1) - ${k}(${median}) = ${answer}`)}数据 ${values.join("，")} 满足这个平均数和中位数。`,
          ),
        });
      },
    ),
    kp(
      "the-largest-of-different-integers",
      t("The largest of different integers", "互不相同的整数中的最大值"),
      t(
        "If the integers must all be different, the smallest the others can be is $1, 2, 3, \\ldots$. Four different positive integers with mean $9$ add to $36$, so the largest is at most $36 - (1 + 2 + 3) = 30$. Without the word *different*, the others could all be $1$, and the largest could be $36 - 3 = 33$.",
        "如果这些整数必须互不相同，其他数最小只能是 $1, 2, 3, \\ldots$。四个互不相同的正整数平均数为 $9$，和为 $36$，所以最大数至多为 $36 - (1 + 2 + 3) = 30$。如果没有“互不相同”的条件，其他数都可以是 $1$，最大数可以是 $36 - 3 = 33$。",
      ),
      (rng) => {
        const n = rng.int(4, 7);
        const mean = rng.int(n + 2, 20);
        const total = n * mean;
        const others = ((n - 1) * n) / 2;
        const answer = total - others;
        return numberProblem({
          prompt: t(
            `$${n}$ different positive integers have a mean of $${mean}$. What is the greatest possible value of the largest of them?`,
            `$${n}$ 个互不相同的正整数的平均数为 $${mean}$。其中最大数的最大可能值是多少？`,
          ),
          answer,
          wrong: [total - (n - 1), total - (n * (n + 1)) / 2, total, mean + n - 1],
          solution: t(
            `The integers add to $${n} \\cdot ${mean} = ${total}$. The other $${n - 1}$ are different, so they are at least $${[...Array(n - 1).keys()].map((v) => v + 1).join(" + ")} = ${others}$:${steps(`${total} - ${others} = ${answer}`)}`,
            `这些整数之和为 $${n} \\cdot ${mean} = ${total}$。其余 $${n - 1}$ 个数互不相同，它们的和至少为 $${[...Array(n - 1).keys()].map((v) => v + 1).join(" + ")} = ${others}$：${steps(`${total} - ${others} = ${answer}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Indirect counting

/** digitWords are the English words for the digits. */
const digitWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

/** countingDiscreteCasesIndirectly counts the cases that satisfy a condition by subtracting those that do not. */
export const countingDiscreteCasesIndirectly = topic(
  "counting-discrete-cases-indirectly",
  t("Counting Discrete Cases Indirectly", "间接计数"),
  t(
    "Count the cases with at least one of something, or the arrangements that avoid a pattern, by counting all cases and subtracting those that fail.",
    "通过计算全部情形再减去不满足条件的情形，来计数“至少有一个”的情形或避开某种排列的情形。",
  ),
  ["combinations"],
  ["HSS.CP.B.9"],
  [
    kp(
      "numbers-with-at-least-one-digit",
      t("Numbers with at least one digit", "至少含一个某数字的数"),
      t(
        "To count three-digit numbers with at least one $7$, count those with no $7$ and subtract. There are $900$ three-digit numbers. With no $7$: the first digit has $8$ choices (not $0$ or $7$) and each other digit $9$, so $8 \\cdot 9 \\cdot 9 = 648$. So $900 - 648 = 252$ have at least one $7$. If the digit is $0$, the first digit has $9$ choices instead.",
        "要数至少含一个 $7$ 的三位数，先数不含 $7$ 的再相减。三位数共 $900$ 个。不含 $7$ 的：首位有 $8$ 种选择（不能是 $0$ 或 $7$），其他每位有 $9$ 种，共 $8 \\cdot 9 \\cdot 9 = 648$ 个。所以 $900 - 648 = 252$ 个至少含一个 $7$。如果这个数字是 $0$，首位就有 $9$ 种选择。",
      ),
      (rng) => {
        const digits = rng.pick([2, 3, 4]);
        const d = rng.int(0, 9);
        const total = 9 * 10 ** (digits - 1);
        const first = d === 0 ? 9 : 8;
        const without = first * 9 ** (digits - 1);
        const answer = total - without;
        const size = t(["", "", "two", "three", "four"][digits]!, ["", "", "两", "三", "四"][digits]!);
        return numberProblem({
          prompt: t(
            `How many ${size.en}-digit whole numbers have at least one digit equal to $${d}$?`,
            `有多少个${size["zh-CN"]}位整数至少有一位数字是 $${d}$？`,
          ),
          answer,
          wrong: [without, 10 ** digits - 9 ** digits, total - 9 ** digits, digits * 10 ** (digits - 1)],
          solution: t(
            `There are $${total}$ ${size.en}-digit numbers. Those with no ${digitWords[d]}: the first digit has $${first}$ choices${d === 0 ? " (any of 1 to 9)" : ` (not $0$ or $${d}$)`} and each other digit has $9$:${steps(
              `${first} \\cdot ${Array(digits - 1)
                .fill(9)
                .join(" \\cdot ")} = ${without}`,
              `${total} - ${without} = ${answer}`,
            )}`,
            `${size["zh-CN"]}位数共有 $${total}$ 个。不含 $${d}$ 的：首位有 $${first}$ 种选择${d === 0 ? "（1 到 9 中任一个）" : `（不能是 $0$ 或 $${d}$）`}，其他每位有 $9$ 种：${steps(
              `${first} \\cdot ${Array(digits - 1)
                .fill(9)
                .join(" \\cdot ")} = ${without}`,
              `${total} - ${without} = ${answer}`,
            )}`,
          ),
        });
      },
    ),
    kp(
      "selections-with-at-least-one",
      t("Selections with at least one", "至少含一个的选法"),
      t(
        "A committee of $3$ is chosen from $5$ teachers and $4$ students. To count committees with at least one student, subtract those with no students from all committees: $\\binom{9}{3} - \\binom{5}{3} = 84 - 10 = 74$. Counting directly would mean adding the cases with $1$, $2$ and $3$ students.",
        "从 $5$ 名教师和 $4$ 名学生中选出 $3$ 人组成委员会。要数至少含一名学生的委员会，从全部选法中减去不含学生的选法：$\\binom{9}{3} - \\binom{5}{3} = 84 - 10 = 74$。直接计数则要把含 $1$、$2$、$3$ 名学生的情形相加。",
      ),
      (rng) => {
        const a = rng.int(4, 8);
        const b = rng.int(2, 6);
        const r = rng.int(2, Math.min(4, a));
        const all = choose(a + b, r);
        const none = choose(a, r);
        const answer = all - none;
        return numberProblem({
          prompt: t(
            `A committee of $${r}$ people is chosen from $${a}$ teachers and $${b}$ students. How many different committees include at least one student?`,
            `从 $${a}$ 名教师和 $${b}$ 名学生中选出 $${r}$ 人组成委员会。至少含一名学生的不同委员会有多少个？`,
          ),
          answer,
          wrong: [all, none, b * choose(a + b - 1, r - 1), b * choose(a, r - 1)],
          solution: t(
            `Subtract the committees with no students (all teachers) from all committees:${steps(`\\binom{${a + b}}{${r}} - \\binom{${a}}{${r}} = ${all} - ${none} = ${answer}`)}`,
            `从全部委员会中减去不含学生（全是教师）的委员会：${steps(`\\binom{${a + b}}{${r}} - \\binom{${a}}{${r}} = ${all} - ${none} = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "arrangements-that-keep-two-apart",
      t("Arrangements that keep two apart", "使两人不相邻的排法"),
      t(
        "To count ways to seat $5$ people in a row with Ann and Ben not side by side, subtract the arrangements where they are together. Glue Ann and Ben into one block: $4$ units can be arranged in $4!$ ways and the block in $2$ ways, so $2 \\cdot 4! = 48$ have them together. All arrangements number $5! = 120$, so $120 - 48 = 72$ keep them apart.",
        "要数 $5$ 人坐成一排且安和本不相邻的坐法，就从全部坐法中减去他们相邻的坐法。把安和本捆成一个整体：$4$ 个单位有 $4!$ 种排法，整体内部有 $2$ 种，所以相邻的有 $2 \\cdot 4! = 48$ 种。全部坐法有 $5! = 120$ 种，所以不相邻的有 $120 - 48 = 72$ 种。",
      ),
      (rng) => {
        const n = rng.int(4, 8);
        const all = factorial(n);
        const together = 2 * factorial(n - 1);
        const answer = all - together;
        const [pEn, qEn, pZh, qZh] = rng.pick([
          ["Ann", "Ben", "安", "本"],
          ["Lena", "Omar", "莉娜", "奥马尔"],
          ["Ken", "Rosa", "肯", "罗莎"],
          ["Mia", "Sam", "米娅", "萨姆"],
          ["Ivy", "Raj", "艾薇", "拉杰"],
        ] as const);
        const context = rng.pick([t("in a row of chairs", "在一排椅子上"), t("in a row for a photo", "排成一排拍照")]);
        return numberProblem({
          prompt: t(
            `In how many ways can $${n}$ people, including ${pEn} and ${qEn}, be seated ${context.en} so that ${pEn} and ${qEn} are not next to each other?`,
            `包括${pZh}和${qZh}在内的 $${n}$ 个人${context["zh-CN"]}，要使${pZh}和${qZh}不相邻，有多少种排法？`,
          ),
          answer,
          wrong: [together, all - factorial(n - 1), all, factorial(n - 2) * (n - 1) * (n - 2)],
          solution: t(
            `Count the arrangements with the two together and subtract. Treat them as one block: $${n - 1}$ units in $${n - 1}!$ orders, times $2$ orders inside the block:${steps(`${n}! - 2 \\cdot ${n - 1}! = ${all} - ${together} = ${answer}`)}`,
            `先数两人相邻的排法再相减。把两人看作一个整体：$${n - 1}$ 个单位有 $${n - 1}!$ 种顺序，整体内部有 $2$ 种：${steps(`${n}! - 2 \\cdot ${n - 1}! = ${all} - ${together} = ${answer}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Combined earnings

/** writingCombinedEarningsExpressions writes expressions for pay from two sources or from two rates. */
export const writingCombinedEarningsExpressions = topic(
  "writing-combined-earnings-expressions",
  t("Writing Combined Earnings Expressions", "写出合并收入的表达式"),
  t(
    "Write an expression for total earnings from an hourly wage and a payment per item, or from a regular rate up to a number of hours and a higher rate after that.",
    "写出由时薪与按件报酬组成的总收入的表达式，或由一定工时内的常规时薪与超出部分的较高时薪组成的总收入的表达式。",
  ),
  ["constructing-algebraic-expressions"],
  ["HSA.SSE.A.1"],
  [
    kp(
      "wages-plus-a-payment-per-item",
      t("Wages plus a payment per item", "工资加按件报酬"),
      t(
        "Each source of pay is a rate times its own quantity, and the total is their sum. Earning $\\$12$ per hour for $h$ hours and $\\$3$ for each of $n$ deliveries gives $12h + 3n$ dollars. Do not add the rates first: $15(h + n)$ would pay $\\$15$ for each hour and each delivery.",
        "每一项收入都是一个单价乘以它自己的数量，总收入是它们的和。每小时 $\\$12$、工作 $h$ 小时，再加每次送货 $\\$3$、送 $n$ 次，共得 $12h + 3n$ 美元。不要先把两个单价相加：$15(h + n)$ 表示每小时和每次送货都付 $\\$15$。",
      ),
      (rng) => {
        const r = rng.int(9, 25);
        const c = rng.int(2, 9);
        const [one, job] = rng.pick([
          ["delivery", t("deliveries", "送货")],
          ["sale", t("sales", "销售")],
          ["repair", t("repairs", "维修")],
        ] as const);
        const fixed = rng.bool() ? rng.pick([50, 75, 100, 120]) : 0;
        const answer = `${r}h + ${c}n${fixed ? ` + ${fixed}` : ""}`;
        return expressionProblem({
          prompt: t(
            `A worker earns $\\$${r}$ per hour plus $\\$${c}$ for each ${one}${fixed ? `, and a weekly bonus of $\\$${fixed}$` : ""}. Write an expression for the worker's earnings, in dollars, in a week with $h$ hours of work and $n$ ${job.en}.`,
            `一名工人每小时挣 $\\$${r}$，每完成一次${job["zh-CN"]}另得 $\\$${c}$${fixed ? `，每周还有 $\\$${fixed}$ 的奖金` : ""}。写出这名工人在工作 $h$ 小时、完成 $n$ 次${job["zh-CN"]}的一周内收入（美元）的表达式。`,
          ),
          answer,
          wrong: [
            `${r + c}(h + n)${fixed ? ` + ${fixed}` : ""}`,
            `${r}n + ${c}h${fixed ? ` + ${fixed}` : ""}`,
            `${r * c}hn${fixed ? ` + ${fixed}` : ""}`,
            `${r}h + ${c}${fixed ? ` + ${fixed}` : ""}`,
          ],
          solution: t(
            `Hours pay $${r}h$ and ${job.en} pay $${c}n$${fixed ? `, and the bonus adds $${fixed}$` : ""}, so the earnings are $${answer}$ dollars.`,
            `工时带来 $${r}h$，${job["zh-CN"]}带来 $${c}n$${fixed ? `，奖金再加 $${fixed}$` : ""}，所以收入为 $${answer}$ 美元。`,
          ),
        });
      },
    ),
    kp(
      "a-higher-rate-after-a-number-of-hours",
      t("A higher rate after a number of hours", "超过一定工时后的较高费率"),
      t(
        "Suppose the pay is 20 dollars per hour for the first $40$ hours of a week and $1.5$ times that rate after. A week of $h > 40$ hours then pays $40(20) = 800$ dollars for the first $40$ hours and $30$ dollars for each of the $h - 40$ extra hours, so the pay is $800 + 30(h - 40)$. Only the hours beyond $40$ earn the higher rate, so $30h$ is too much.",
        "设一周前 $40$ 小时每小时 20 美元，之后按 $1.5$ 倍计酬，则一周工作 $h > 40$ 小时，前 $40$ 小时得 $40(20) = 800$ 美元，超出的 $h - 40$ 小时每小时得 $30$：$800 + 30(h - 40)$。只有超过 $40$ 小时的部分按较高费率计酬，所以 $30h$ 太多了。",
      ),
      (rng) => {
        const r = 2 * rng.int(6, 15);
        const cap = rng.pick([35, 38, 40]);
        const times = rng.pick([1.5, 2]);
        const high = r * times;
        const base = r * cap;
        const answer = `${base} + ${high}(h - ${cap})`;
        const timesText = times === 2 ? t("twice", "2 倍") : t("$1.5$ times", "$1.5$ 倍");
        return expressionProblem({
          prompt: t(
            `An employee is paid $\\$${r}$ per hour for the first $${cap}$ hours worked in a week and ${timesText.en} that rate for each hour after $${cap}$. Write an expression for the employee's pay, in dollars, for a week of $h$ hours, where $h > ${cap}$.`,
            `一名员工每周前 $${cap}$ 小时每小时得 $\\$${r}$，超过 $${cap}$ 小时的每小时按该费率的${timesText["zh-CN"]}计酬。写出该员工一周工作 $h$ 小时（$h > ${cap}$）的工资（美元）的表达式。`,
          ),
          answer,
          wrong: [`${high}h`, `${r}h + ${high}(h - ${cap})`, `${base} + ${high}h`, `${base} + ${r}(h - ${cap})`],
          solution: t(
            `The first $${cap}$ hours pay $${cap}(${r}) = ${base}$. Each of the other $h - ${cap}$ hours pays $${times} \\cdot ${r} = ${high}$. So the pay is $${answer}$ dollars, which simplifies to $${high}h - ${high * cap - base}$.`,
            `前 $${cap}$ 小时得 $${cap}(${r}) = ${base}$。其余 $h - ${cap}$ 小时每小时得 $${times} \\cdot ${r} = ${high}$。所以工资为 $${answer}$ 美元，化简为 $${high}h - ${high * cap - base}$。`,
          ),
        });
      },
    ),
  ],
);

/** actFundamentalsModelingTopics are the ACT Math Fundamentals data and modeling topics. */
export const actFundamentalsModelingTopics: TopicDef[] = [
  reasoningWithMultiStageFractionalAmounts,
  comparingStatisticsAConstraintForces,
  countingDiscreteCasesIndirectly,
  writingCombinedEarningsExpressions,
];
