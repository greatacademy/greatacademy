import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";
import { range } from "./methods-of-proof-common.ts";

// Discrete Mathematics unit 3, part 2: Bayes' theorem and combinatorics.

/** fact is n factorial. */
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));

/** choose is the binomial coefficient n choose k. */
function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

/** pct turns a whole percent into a rational. */
const pct = (x: number) => Q.of(x, 100);

/** BayesStory is a two-hypothesis context with percents p, x and y. */
interface BayesStory {
  readonly en: string;
  readonly zh: string;
  readonly askEn: string;
  readonly askZh: string;
}

/** bayesStory writes a context: P(A) = p%, P(B | A) = x%, P(B | not A) = y%, asking for P(A | B). */
function bayesStory(rng: Rng, p: number, x: number, y: number): BayesStory {
  return rng.pick([
    {
      en: `$${p}\\%$ of the people in a city carry a virus. A screening test is positive for $${x}\\%$ of carriers and for $${y}\\%$ of non-carriers.`,
      zh: `某市 $${p}\\%$ 的人携带某种病毒。筛查检测对携带者呈阳性的比例为 $${x}\\%$，对非携带者为 $${y}\\%$。`,
      askEn: "A person chosen at random tests positive. Find the probability that the person carries the virus.",
      askZh: "随机选出的一人检测呈阳性，求此人携带病毒的概率。",
    },
    {
      en: `$${p}\\%$ of the emails reaching an inbox are spam. A filter flags $${x}\\%$ of spam emails and $${y}\\%$ of legitimate emails.`,
      zh: `到达某邮箱的邮件中 $${p}\\%$ 是垃圾邮件。过滤器会标记 $${x}\\%$ 的垃圾邮件和 $${y}\\%$ 的正常邮件。`,
      askEn: "An email is flagged. Find the probability that it is spam.",
      askZh: "一封邮件被标记了，求它是垃圾邮件的概率。",
    },
    {
      en: `$${p}\\%$ of a company's applicants are qualified. An interview recommends $${x}\\%$ of qualified applicants and $${y}\\%$ of unqualified ones.`,
      zh: `某公司 $${p}\\%$ 的应聘者是合格的。面试会推荐 $${x}\\%$ 的合格应聘者和 $${y}\\%$ 的不合格应聘者。`,
      askEn: "An applicant is recommended. Find the probability that the applicant is qualified.",
      askZh: "一位应聘者被推荐了，求其合格的概率。",
    },
  ]);
}

/** bayesTheorem computes P(A | B) = P(B | A) P(A) / P(B). */
export const bayesTheorem: TopicDef = {
  id: "bayes-theorem",
  title: t("Bayes' Theorem", "贝叶斯定理"),
  summary: t(
    "Bayes' theorem reverses a conditional probability: P(A | B) = P(B | A) P(A) / P(B), where P(B) = P(B | A)P(A) + P(B | A′)P(A′) by the law of total probability.",
    "贝叶斯定理把条件概率反过来：P(A | B) = P(B | A) P(A) / P(B)，其中由全概率公式 P(B) = P(B | A)P(A) + P(B | A′)P(A′)。",
  ),
  prerequisites: ["the-law-of-total-probability"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "bayes-theorem-from-probabilities",
      title: t("Applying the formula", "运用公式"),
      explanation: t(
        "Bayes' theorem reverses a conditional probability: it finds the chance of the cause given the evidence from the chance of the evidence given the cause. If $P(A) = 0.4$, $P(B \\mid A) = 0.5$ and $P(B) = 0.25$, then $P(A \\mid B) = \\frac{0.5 \\cdot 0.4}{0.25} = 0.8$.",
        "贝叶斯定理把条件概率倒过来：由“原因下出现证据的概率”求出“有证据时原因成立的概率”。若 $P(A) = 0.4$，$P(B \\mid A) = 0.5$，$P(B) = 0.25$，则 $P(A \\mid B) = \\frac{0.5 \\cdot 0.4}{0.25} = 0.8$。",
      ),
      generate(rng) {
        const a = Q.of(rng.int(1, 9), 10);
        const ba = Q.of(rng.int(1, 9), 10);
        const bn = Q.of(rng.int(1, 9), 10);
        const b = ba.mul(a).add(bn.mul(Q.of(1).sub(a)));
        const value = ba.mul(a).div(b);
        return numberProblem({
          prompt: t(
            `$P(A) = ${dec(a)}$, $P(B \\mid A) = ${dec(ba)}$ and $P(B) = ${dec(b)}$. Find $P(A \\mid B)$ as a fraction.`,
            `$P(A) = ${dec(a)}$，$P(B \\mid A) = ${dec(ba)}$，$P(B) = ${dec(b)}$。用分数表示 $P(A \\mid B)$。`,
          ),
          answer: value,
          wrong: [ba.mul(a), ba.mul(b).div(a), ba, a.mul(b).div(ba)],
          solution: t(
            `$P(A \\mid B) = \\frac{P(B \\mid A) P(A)}{P(B)} = \\frac{${dec(ba)} \\cdot ${dec(a)}}{${dec(b)}} = ${value.toLatex()}$.`,
            `$P(A \\mid B) = \\frac{P(B \\mid A) P(A)}{P(B)} = \\frac{${dec(ba)} \\cdot ${dec(a)}}{${dec(b)}} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "bayes-theorem-in-context",
      title: t("Bayes' theorem in context", "情境中的贝叶斯定理"),
      explanation: t(
        "If $1\\%$ have a disease and a test is positive for $90\\%$ of those who have it and $5\\%$ of those who do not, then $P(\\text{disease} \\mid +) = \\frac{0.9 \\cdot 0.01}{0.9 \\cdot 0.01 + 0.05 \\cdot 0.99} = \\frac{2}{13}$. A positive result is still more likely to be a false alarm.",
        "若 $1\\%$ 的人患病，检测对患者阳性率为 $90\\%$，对非患者为 $5\\%$，则 $P(\\text{患病} \\mid +) = \\frac{0.9 \\cdot 0.01}{0.9 \\cdot 0.01 + 0.05 \\cdot 0.99} = \\frac{2}{13}$。阳性结果仍更可能是误报。",
      ),
      generate(rng) {
        const p = rng.pick([1, 2, 4, 5, 10, 20, 25, 30, 40]);
        const x = rng.pick([60, 70, 75, 80, 90, 95, 99]);
        const y = rng.pick([1, 2, 5, 10, 15, 20]);
        const s = bayesStory(rng, p, x, y);
        const num = pct(x).mul(pct(p));
        const den = num.add(pct(y).mul(pct(100 - p)));
        const value = num.div(den);
        return numberProblem({
          prompt: t(`${s.en} ${s.askEn} Give the answer as a fraction.`, `${s.zh}${s.askZh}答案写成分数。`),
          answer: value,
          wrong: [
            pct(x),
            num,
            pct(x)
              .mul(pct(p))
              .div(pct(x).mul(pct(p)).add(pct(y))),
            Q.of(1).sub(value),
          ],
          solution: t(
            `$P(B) = ${dec(pct(x))} \\cdot ${dec(pct(p))} + ${dec(pct(y))} \\cdot ${dec(pct(100 - p))} = ${dec(den)}$, so the probability is $\\frac{${dec(num)}}{${dec(den)}} = ${value.toLatex()}$.`,
            `$P(B) = ${dec(pct(x))} \\cdot ${dec(pct(p))} + ${dec(pct(y))} \\cdot ${dec(pct(100 - p))} = ${dec(den)}$，所以概率为 $\\frac{${dec(num)}}{${dec(den)}} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** Machines is a partition into three or four sources with shares and defect rates in percent. */
interface Machines {
  readonly shares: readonly number[];
  readonly rates: readonly number[];
}

/** randomMachines draws shares (multiples of 5, summing to 100) and defect rates. */
function randomMachines(rng: Rng): Machines {
  const k = rng.int(3, 4);
  const cuts = rng.sample(range(1, 19), k - 1).sort((a, b) => a - b);
  const shares = [...cuts, 20].map((c, i) => 5 * (c - (i === 0 ? 0 : cuts[i - 1]!)));
  const rates = shares.map(() => rng.int(1, 9));
  return { shares, rates };
}

/** LETTERS name the machines. */
const LETTERS = ["A", "B", "C", "D"] as const;

/** machinesIntro describes the machines. */
const machinesIntro = (m: Machines, hideLast = false) => {
  const names = m.shares.map((_, i) => LETTERS[i]!);
  const shareEn = m.shares.map((s, i) => `$${s}\\%$ by machine ${names[i]}`).join(", ");
  const shareZh = m.shares.map((s, i) => `机器 ${names[i]} 生产 $${s}\\%$`).join("，");
  const rates = hideLast ? m.rates.slice(0, -1) : m.rates;
  const rateEn = rates.map((r, i) => `$${r}\\%$ of ${names[i]}'s`).join(", ");
  const rateZh = rates.map((r, i) => `${names[i]} 的 $${r}\\%$`).join("，");
  return {
    en: `A factory's parts are made ${shareEn}. Of these, ${rateEn} parts are defective.`,
    zh: `某工厂的零件中${shareZh}。其中${rateZh}的零件是次品。`,
  };
};

/** totalDefect is P(D) = Σ P(Mᵢ) P(D | Mᵢ). */
const totalDefect = (m: Machines) => m.shares.reduce((s, x, i) => s.add(pct(x).mul(pct(m.rates[i]!))), Q.of(0));

/** extendingTheLawOfTotalProbability applies the law of total probability to partitions into more than two events. */
export const extendingTheLawOfTotalProbability: TopicDef = {
  id: "extending-the-law-of-total-probability",
  title: t("Extending the Law of Total Probability", "推广全概率公式"),
  summary: t(
    "If A₁, …, Aₙ partition the sample space, then P(B) = P(B | A₁)P(A₁) + ⋯ + P(B | Aₙ)P(Aₙ).",
    "若 A₁, …, Aₙ 构成样本空间的一个划分，则 P(B) = P(B | A₁)P(A₁) + ⋯ + P(B | Aₙ)P(Aₙ)。",
  ),
  prerequisites: ["the-law-of-total-probability"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "total-probability-over-a-partition",
      title: t("Total probability over a partition", "对划分求全概率"),
      explanation: t(
        "When the outcomes split into separate cases that cover everything, the probability of an event is the sum over the cases of the case probability times the chance of the event in that case. Machines A, B, C make $50\\%$, $30\\%$, $20\\%$ of the parts, with $2\\%$, $3\\%$, $5\\%$ defective: $P(D) = 0.5 \\cdot 0.02 + 0.3 \\cdot 0.03 + 0.2 \\cdot 0.05 = 0.029$.",
        "当结果被分成互不重叠且覆盖全部的情形时，事件的概率等于各情形的概率乘以该情形下事件发生的概率，再全部相加。机器 A、B、C 分别生产 $50\\%$、$30\\%$、$20\\%$ 的零件，次品率为 $2\\%$、$3\\%$、$5\\%$：$P(D) = 0.5 \\cdot 0.02 + 0.3 \\cdot 0.03 + 0.2 \\cdot 0.05 = 0.029$。",
      ),
      generate(rng) {
        const m = randomMachines(rng);
        const value = totalDefect(m);
        const intro = machinesIntro(m);
        const terms = m.shares.map((s, i) => `${dec(pct(s))} \\cdot ${dec(pct(m.rates[i]!))}`).join(" + ");
        return numberProblem({
          prompt: t(
            `${intro.en} Find the probability that a part chosen at random is defective, as a decimal.`,
            `${intro.zh}求随机抽取的零件是次品的概率，用小数表示。`,
          ),
          answer: value,
          form: "decimal",
          wrong: [
            Q.of(
              m.rates.reduce((a, b) => a + b, 0),
              100 * m.rates.length,
            ),
            pct(m.rates.reduce((a, b) => a + b, 0)),
            value.mul(Q.of(10)),
          ],
          solution: t(`$P(D) = ${terms} = ${dec(value)}$.`, `$P(D) = ${terms} = ${dec(value)}$。`),
        });
      },
    },
    {
      id: "a-missing-conditional-probability",
      title: t("A missing conditional probability", "求缺失的条件概率"),
      explanation: t(
        "If the total probability is known, subtract the contributions of the known cases to find the contribution of the missing one, then divide by its case probability. If $P(D) = 0.029$ and machines A and B contribute $0.5 \\cdot 0.02 + 0.3 \\cdot 0.03 = 0.019$, then C contributes $0.01 = 0.2 \\cdot P(D \\mid C)$, so $P(D \\mid C) = 0.05$.",
        "如果已知总概率，就减去已知情形的贡献，得到缺少的那个情形的贡献，再除以该情形的概率。若 $P(D) = 0.029$，机器 A、B 贡献 $0.5 \\cdot 0.02 + 0.3 \\cdot 0.03 = 0.019$，则 C 贡献 $0.01 = 0.2 \\cdot P(D \\mid C)$，所以 $P(D \\mid C) = 0.05$。",
      ),
      generate(rng) {
        const m = randomMachines(rng);
        const total = totalDefect(m);
        const k = m.shares.length - 1;
        const last = LETTERS[k]!;
        const rest = total.sub(pct(m.shares[k]!).mul(pct(m.rates[k]!)));
        const value = pct(m.rates[k]!);
        const intro = machinesIntro(m, true);
        return numberProblem({
          prompt: t(
            `${intro.en} Overall, a proportion $${dec(total)}$ of all parts are defective. Find the probability that a part from machine ${last} is defective, as a decimal.`,
            `${intro.zh}总体上所有零件中次品的比例为 $${dec(total)}$。求机器 ${last} 生产的零件是次品的概率，用小数表示。`,
          ),
          answer: value,
          form: "decimal",
          wrong: [total.sub(rest), total.div(pct(m.shares[k]!)), total],
          solution: t(
            `The other machines contribute $${dec(rest)}$, so $${dec(pct(m.shares[k]!))} \\cdot P(D \\mid ${last}) = ${dec(total)} - ${dec(rest)} = ${dec(total.sub(rest))}$, and $P(D \\mid ${last}) = ${dec(value)}$.`,
            `其他机器贡献 $${dec(rest)}$，所以 $${dec(pct(m.shares[k]!))} \\cdot P(D \\mid ${last}) = ${dec(total)} - ${dec(rest)} = ${dec(total.sub(rest))}$，$P(D \\mid ${last}) = ${dec(value)}$。`,
          ),
        });
      },
    },
  ],
};

/** extendingBayesTheorem finds P(Aᵢ | B) over a partition A₁, …, Aₙ. */
export const extendingBayesTheorem: TopicDef = {
  id: "extending-bayes-theorem",
  title: t("Extending Bayes' Theorem", "推广贝叶斯定理"),
  summary: t(
    "If A₁, …, Aₙ partition the sample space, then P(Aᵢ | B) = P(B | Aᵢ)P(Aᵢ) / Σⱼ P(B | Aⱼ)P(Aⱼ).",
    "若 A₁, …, Aₙ 构成样本空间的一个划分，则 P(Aᵢ | B) = P(B | Aᵢ)P(Aᵢ) / Σⱼ P(B | Aⱼ)P(Aⱼ)。",
  ),
  prerequisites: ["bayes-theorem", "extending-the-law-of-total-probability"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "bayes-theorem-over-a-partition",
      title: t("Bayes' theorem over a partition", "对划分使用贝叶斯定理"),
      explanation: t(
        "The denominator is the total probability of the evidence over all cases, and the numerator is the one path through the case you are asking about. With shares $50\\%$, $30\\%$, $20\\%$ and defect rates $2\\%$, $3\\%$, $5\\%$: $P(D) = 0.029$, so $P(C \\mid D) = \\frac{0.2 \\cdot 0.05}{0.029} = \\frac{10}{29}$.",
        "分母是证据在所有情形下的总概率，分子是经过所问情形的那一条路径的概率。份额为 $50\\%$、$30\\%$、$20\\%$，次品率为 $2\\%$、$3\\%$、$5\\%$：$P(D) = 0.029$，所以 $P(C \\mid D) = \\frac{0.2 \\cdot 0.05}{0.029} = \\frac{10}{29}$。",
      ),
      generate(rng) {
        const m = randomMachines(rng);
        const total = totalDefect(m);
        const i = rng.int(0, m.shares.length - 1);
        const name = LETTERS[i]!;
        const num = pct(m.shares[i]!).mul(pct(m.rates[i]!));
        const value = num.div(total);
        const intro = machinesIntro(m);
        return numberProblem({
          prompt: t(
            `${intro.en} A part chosen at random is defective. Find the probability that it was made by machine ${name}, as a fraction.`,
            `${intro.zh}随机抽取的一个零件是次品，求它由机器 ${name} 生产的概率，用分数表示。`,
          ),
          answer: value,
          wrong: [
            num,
            pct(m.shares[i]!),
            Q.of(
              m.rates[i]!,
              m.rates.reduce((a, b) => a + b, 0),
            ),
          ],
          solution: t(
            `$P(D) = ${dec(total)}$, so $P(${name} \\mid D) = \\frac{${dec(pct(m.shares[i]!))} \\cdot ${dec(pct(m.rates[i]!))}}{${dec(total)}} = ${value.toLatex()}$.`,
            `$P(D) = ${dec(total)}$，所以 $P(${name} \\mid D) = \\frac{${dec(pct(m.shares[i]!))} \\cdot ${dec(pct(m.rates[i]!))}}{${dec(total)}} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "bayes-theorem-with-urns",
      title: t("Which urn?", "来自哪个盒子"),
      explanation: t(
        "Three boxes are equally likely to be chosen and hold red fractions $\\frac{1}{2}$, $\\frac{1}{4}$, $1$. A red ball is drawn: $P(\\text{box } 3 \\mid R) = \\frac{1}{1/2 + 1/4 + 1} = \\frac{4}{7}$; the common factor $\\frac{1}{3}$ cancels.",
        "三个盒子被选中的可能性相同，红球比例分别为 $\\frac{1}{2}$、$\\frac{1}{4}$、$1$。摸出红球：$P(\\text{盒 } 3 \\mid R) = \\frac{1}{1/2 + 1/4 + 1} = \\frac{4}{7}$；公因子 $\\frac{1}{3}$ 被约去。",
      ),
      generate(rng) {
        const boxes = range(1, 3).map(() => [rng.int(1, 6), rng.int(1, 6)] as const);
        const die = rng.bool();
        const prior = die ? [Q.of(1, 2), Q.of(1, 3), Q.of(1, 6)] : [Q.of(1, 3), Q.of(1, 3), Q.of(1, 3)];
        const red = boxes.map(([r, b]) => Q.of(r, r + b));
        const total = red.reduce((s, q, i) => s.add(q.mul(prior[i]!)), Q.of(0));
        const i = rng.int(0, 2);
        const value = red[i]!.mul(prior[i]!).div(total);
        const list = boxes.map(([r, b], j) => `box ${j + 1} holds $${r}$ red and $${b}$ blue`).join(", ");
        const listZh = boxes.map(([r, b], j) => `盒 ${j + 1} 装有 $${r}$ 个红球和 $${b}$ 个蓝球`).join("，");
        const how = die
          ? t(
              "A fair die is rolled: on $1$, $2$ or $3$ box 1 is used, on $4$ or $5$ box 2, and on $6$ box 3.",
              "掷一枚均匀骰子：掷出 $1$、$2$、$3$ 用盒 1，掷出 $4$、$5$ 用盒 2，掷出 $6$ 用盒 3。",
            )
          : t("A box is chosen at random.", "随机选一个盒子。");
        return numberProblem({
          prompt: t(
            `Of three boxes, ${list} balls. ${how.en} A ball drawn from it is red. Find the probability that it came from box ${i + 1}.`,
            `三个盒子中，${listZh}。${how["zh-CN"]}从中摸出的球是红球，求它来自盒 ${i + 1} 的概率。`,
          ),
          answer: value,
          wrong: [red[i]!.mul(prior[i]!), red[i]!, prior[i]!],
          solution: t(
            `$P(R) = ${red.map((q, j) => `${prior[j]!.toLatex()} \\cdot ${q.toLatex()}`).join(" + ")} = ${total.toLatex()}$, so $P(\\text{box } ${i + 1} \\mid R) = \\frac{${prior[i]!.toLatex()} \\cdot ${red[i]!.toLatex()}}{${total.toLatex()}} = ${value.toLatex()}$.`,
            `$P(R) = ${red.map((q, j) => `${prior[j]!.toLatex()} \\cdot ${q.toLatex()}`).join(" + ")} = ${total.toLatex()}$，所以 $P(\\text{盒 } ${i + 1} \\mid R) = \\frac{${prior[i]!.toLatex()} \\cdot ${red[i]!.toLatex()}}{${total.toLatex()}} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** WORDS are words with repeated letters. */
const WORDS = [
  "BANANA",
  "LETTER",
  "STATISTICS",
  "MISSISSIPPI",
  "COMMITTEE",
  "BOOKKEEPER",
  "PEPPER",
  "PARALLEL",
  "SUCCESS",
  "ASSESS",
  "BALLOON",
  "CALCULUS",
  "EFFECT",
  "COFFEE",
  "GOOGOL",
  "TATTOO",
  "REFERENCE",
  "ADDRESS",
  "TENNESSEE",
  "PROBABILITY",
] as const;

/** letterCounts counts each letter of a word. */
const letterCounts = (w: string) => {
  const m = new Map<string, number>();
  for (const c of w) m.set(c, (m.get(c) ?? 0) + 1);
  return m;
};

/** multinomialCount is n! / (n₁! ⋯ nₖ!). */
const multinomialCount = (counts: readonly number[]) => counts.reduce((s, c) => s / fact(c), fact(counts.reduce((a, b) => a + b, 0)));

/** denomTex writes n₁! ⋯ nₖ! for counts above 1. */
const denomTex = (counts: readonly number[]) =>
  counts
    .filter((c) => c > 1)
    .map((c) => `${c}!`)
    .join(" \\cdot ") || "1";

/** permutationsWithRepetition counts arrangements of a multiset. */
export const permutationsWithRepetition: TopicDef = {
  id: "permutations-with-repetition",
  title: t("Permutations With Repetition", "有重复元素的排列"),
  summary: t(
    "n objects of which n₁ are alike, n₂ are alike, …, nₖ are alike can be arranged in a row in n! / (n₁! n₂! ⋯ nₖ!) distinguishable ways.",
    "n 个物体中有 n₁ 个相同、n₂ 个相同、…、nₖ 个相同，排成一行的可区分排法有 n! / (n₁! n₂! ⋯ nₖ!) 种。",
  ),
  prerequisites: ["permutations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "arrangements-of-letters-with-repeats",
      title: t("Arranging letters", "字母的排列"),
      explanation: t(
        "BANANA has $6$ letters: $3$ A's, $2$ N's and $1$ B. Swapping equal letters gives the same word, so there are $\\frac{6!}{3! \\, 2!} = 60$ arrangements.",
        "BANANA 有 $6$ 个字母：$3$ 个 A、$2$ 个 N 和 $1$ 个 B。交换相同的字母得到同一个词，所以共有 $\\frac{6!}{3! \\, 2!} = 60$ 种排列。",
      ),
      generate(rng) {
        const word = rng.pick(WORDS);
        const counts = letterCounts(word);
        const first = rng.bool() ? rng.pick([...counts.keys()]) : undefined;
        const cs = [...counts.entries()].map(([c, k]) => (c === first ? k - 1 : k));
        const n = cs.reduce((a, b) => a + b, 0);
        const value = multinomialCount(cs);
        return numberProblem({
          prompt: first
            ? t(
                `How many distinguishable arrangements of the letters of ${word} begin with ${first}?`,
                `把 ${word} 的字母重新排列，以 ${first} 开头的可区分排列有多少种？`,
              )
            : t(
                `How many distinguishable arrangements of the letters of ${word} are there?`,
                `把 ${word} 的字母重新排列，可区分的排列有多少种？`,
              ),
          answer: value,
          wrong: [
            fact(n),
            value * (counts.get(first ?? "") ?? 2),
            fact(n) / Math.max(...cs.map(fact)),
            multinomialCount([...counts.values()]),
          ],
          solution: t(
            `${first ? `Fix ${first} in front. ` : ""}Arrange the $${n}$ ${first ? "remaining " : ""}letters and divide by the orderings of repeated letters: $\\frac{${n}!}{${denomTex(cs)}} = ${value}$.`,
            `${first ? `先把 ${first} 固定在开头。` : ""}排列${first ? "剩下的" : ""} $${n}$ 个字母，再除以相同字母的排列数：$\\frac{${n}!}{${denomTex(cs)}} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "arrangements-of-identical-objects",
      title: t("Arranging identical objects", "相同物体的排列"),
      explanation: t(
        "$3$ red, $2$ blue and $1$ green flag fly in a row; flags of one color look alike. There are $\\frac{6!}{3! \\, 2! \\, 1!} = 60$ signals.",
        "$3$ 面红旗、$2$ 面蓝旗和 $1$ 面绿旗排成一行，同色旗子看起来相同。共有 $\\frac{6!}{3! \\, 2! \\, 1!} = 60$ 种信号。",
      ),
      generate(rng) {
        const k = rng.int(2, 3);
        const cs = range(1, k).map(() => rng.int(1, 5));
        const n = cs.reduce((a, b) => a + b, 0);
        const value = multinomialCount(cs);
        const kind = rng.int(0, 1);
        const colors = [
          ["red", "红"],
          ["blue", "蓝"],
          ["green", "绿"],
        ] as const;
        const listEn = cs.map((c, i) => `$${c}$ ${colors[i]![0]}`).join(", ");
        const listZh = cs.map((c, i) => `$${c}$ 个${colors[i]![1]}`).join("、");
        return numberProblem({
          prompt:
            kind === 0
              ? t(
                  `${listEn} flags are hung in a row. Flags of the same color are identical. How many different signals are possible?`,
                  `${listZh}色旗子挂成一行，同色旗子完全相同。共有多少种不同的信号？`,
                )
              : t(
                  `${listEn} marbles are placed in a row. Marbles of the same color are identical. How many different color patterns are possible?`,
                  `把${listZh}色弹珠排成一行，同色弹珠完全相同。共有多少种不同的颜色图案？`,
                ),
          answer: value,
          wrong: [fact(n), fact(n) / fact(Math.max(...cs)), cs.reduce((a, b) => a * b, 1), n ** k],
          solution: t(
            `There are $${n}$ objects in all, so $\\frac{${n}!}{${cs.map((c) => `${c}!`).join(" \\, ")}} = ${value}$.`,
            `共有 $${n}$ 个，所以 $\\frac{${n}!}{${cs.map((c) => `${c}!`).join(" \\, ")}} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** kPermutationsOfNWithRepetition counts sequences of length k from n symbols. */
export const kPermutationsOfNWithRepetition: TopicDef = {
  id: "k-permutations-of-n-with-repetition",
  title: t("K-Permutations of N With Repetition", "可重复的 n 取 k 排列"),
  summary: t(
    "If each of k positions can hold any of n symbols, with repeats allowed, there are nᵏ sequences.",
    "若 k 个位置中每个位置都可放 n 个符号中的任意一个，允许重复，则共有 nᵏ 个序列。",
  ),
  prerequisites: ["the-rules-of-sum-and-product"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-sequences-with-repetition",
      title: t("Counting sequences", "计数序列"),
      explanation: t(
        "When repeats are allowed, every position has the same number of choices, so the multiplication principle gives that number raised to the length of the sequence. A $4$-digit PIN uses digits $0$–$9$ with repeats allowed: $10^4 = 10000$ PINs. Each position is chosen independently.",
        "允许重复时，每个位置的选择数都相同，所以由乘法原理，总数是这个选择数的序列长度次幂。$4$ 位 PIN 码使用数字 $0$–$9$，允许重复：共 $10^4 = 10000$ 个。每个位置都独立选择。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const n = [rng.int(2, 9), rng.int(3, 8), rng.pick([2, 3, 4])][kind]!;
        const k = rng.int(3, 7);
        const value = n ** k;
        const prompts = [
          t(
            `A lock code is a sequence of $${k}$ digits, each from $1$ to $${n}$, with repeats allowed. How many codes are there?`,
            `密码锁的密码由 $${k}$ 个数字组成，每个数字取 $1$ 到 $${n}$，可以重复。共有多少个密码？`,
          ),
          t(
            `A quiz has $${k}$ questions, each with $${n}$ choices. In how many ways can the quiz be answered?`,
            `一份测验有 $${k}$ 道题，每题有 $${n}$ 个选项。共有多少种作答方式？`,
          ),
          t(
            `How many strings of length $${k}$ can be formed from an alphabet of $${n}$ symbols?`,
            `用 $${n}$ 个符号的字母表能组成多少个长度为 $${k}$ 的字符串？`,
          ),
        ];
        return numberProblem({
          prompt: prompts[kind]!,
          answer: value,
          wrong: [k ** n, n * k, fact(n) / fact(Math.max(n - k, 0)), choose(n + k - 1, k)],
          solution: t(
            `Each of the $${k}$ positions has $${n}$ options: $${n}^{${k}} = ${value}$.`,
            `$${k}$ 个位置中每个都有 $${n}$ 种选择：$${n}^{${k}} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "sequences-with-a-repeated-symbol",
      title: t("Sequences with a repeat", "含重复符号的序列"),
      explanation: t(
        "Counting sequences with at least one repeat directly is messy, so count those with no repeats and subtract from the total. Of the $10^4$ four-digit PINs, $10 \\cdot 9 \\cdot 8 \\cdot 7 = 5040$ have all digits different, so $10000 - 5040 = 4960$ have a repeated digit.",
        "直接数至少有一个重复的序列很麻烦，所以先数没有重复的序列，再从总数中减去。在 $10^4$ 个四位 PIN 码中，各位互不相同的有 $10 \\cdot 9 \\cdot 8 \\cdot 7 = 5040$ 个，所以有重复数字的有 $10000 - 5040 = 4960$ 个。",
      ),
      generate(rng) {
        const n = rng.int(4, 10);
        const k = rng.int(2, Math.min(n, 5));
        const all = n ** k;
        const distinct = fact(n) / fact(n - k);
        const value = all - distinct;
        return numberProblem({
          prompt: t(
            `Sequences of length $${k}$ are formed from $${n}$ symbols, with repeats allowed. How many contain at least one repeated symbol?`,
            `用 $${n}$ 个符号组成长度为 $${k}$ 的序列，允许重复。至少含有一个重复符号的序列有多少个？`,
          ),
          answer: value,
          wrong: [all, distinct, all - choose(n, k), n * (k - 1)],
          solution: t(
            `All sequences: $${n}^{${k}} = ${all}$. With no repeats: $${range(n - k + 1, n)
              .reverse()
              .join(" \\cdot ")} = ${distinct}$. So $${all} - ${distinct} = ${value}$.`,
            `全部序列：$${n}^{${k}} = ${all}$。无重复：$${range(n - k + 1, n)
              .reverse()
              .join(" \\cdot ")} = ${distinct}$。所以 $${all} - ${distinct} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** combinationsWithRepetition counts multisets of size k from n types. */
export const combinationsWithRepetition: TopicDef = {
  id: "combinations-with-repetition",
  title: t("Combinations With Repetition", "可重复的组合"),
  summary: t(
    "Choosing k items from n types, with repeats allowed and order irrelevant, can be done in C(n + k − 1, k) ways: arrange k stars and n − 1 bars.",
    "从 n 种类型中选 k 个，允许重复且不计顺序，共有 C(n + k − 1, k) 种方法：排列 k 颗星和 n − 1 根隔板。",
  ),
  prerequisites: ["combinations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "stars-and-bars",
      title: t("Stars and bars", "隔板法"),
      explanation: t(
        "Choosing items with repetition when order does not matter is the same as arranging stars for items and bars for the dividers between types. Choosing $5$ donuts from $3$ flavors is placing $5$ stars and $2$ bars in a row, like $\\star\\star|\\star|\\star\\star$: $\\binom{7}{2} = 21$ ways.",
        "在不计顺序、允许重复的情况下选取物品，等同于用星号代表物品、用竖线代表类别之间的分隔来排列。从 $3$ 种口味中选 $5$ 个甜甜圈，相当于把 $5$ 颗星和 $2$ 根隔板排成一行，如 $\\star\\star|\\star|\\star\\star$：共 $\\binom{7}{2} = 21$ 种。",
      ),
      generate(rng) {
        const n = rng.int(3, 8);
        const k = rng.int(3, 12);
        const value = choose(n + k - 1, k);
        const ctx = rng.pick([
          t(
            `A bakery sells $${n}$ kinds of donuts. In how many ways can you buy $${k}$ donuts?`,
            `面包店卖 $${n}$ 种甜甜圈。买 $${k}$ 个甜甜圈有多少种方式？`,
          ),
          t(
            `In how many ways can $${k}$ identical coins be put into $${n}$ different boxes?`,
            `把 $${k}$ 枚相同的硬币放入 $${n}$ 个不同的盒子，有多少种放法？`,
          ),
          t(
            `A cup holds $${k}$ scoops chosen from $${n}$ flavors, repeats allowed and order irrelevant. How many cups are possible?`,
            `一杯冰淇淋装 $${k}$ 球，从 $${n}$ 种口味中选，可重复且不计顺序。共有多少种？`,
          ),
        ]);
        return numberProblem({
          prompt: ctx,
          answer: value,
          wrong: [choose(n, k) || n ** 2, n ** k, choose(n + k, k), choose(n + k - 1, k - 1)],
          solution: t(
            `Arrange $${k}$ stars and $${n - 1}$ bars: $\\binom{${n + k - 1}}{${k}} = ${value}$.`,
            `排列 $${k}$ 颗星和 $${n - 1}$ 根隔板：$\\binom{${n + k - 1}}{${k}} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "combinations-with-at-least-one-of-each",
      title: t("At least one of each type", "每种至少一个"),
      explanation: t(
        "To buy $8$ donuts from $3$ flavors with at least one of each, first take one of each, then choose the other $5$ freely: $\\binom{5 + 2}{5} = \\binom{7}{2} = 21$.",
        "从 $3$ 种口味中买 $8$ 个甜甜圈且每种至少一个：先每种取一个，再自由选其余 $5$ 个：$\\binom{5 + 2}{5} = \\binom{7}{2} = 21$。",
      ),
      generate(rng) {
        const n = rng.int(3, 6);
        const k = n + rng.int(1, 8);
        const value = choose(k - 1, n - 1);
        return numberProblem({
          prompt: t(
            `A shop sells $${n}$ kinds of muffins. In how many ways can you buy $${k}$ muffins with at least one of each kind?`,
            `商店卖 $${n}$ 种松饼。买 $${k}$ 个松饼且每种至少一个，有多少种方式？`,
          ),
          answer: value,
          wrong: [choose(n + k - 1, k), choose(k, n), choose(k - n, n - 1), choose(k - 1, n)],
          solution: t(
            `Take one of each kind; the remaining $${k - n}$ are free: $\\binom{${k - n} + ${n - 1}}{${n - 1}} = \\binom{${k - 1}}{${n - 1}} = ${value}$.`,
            `每种先取一个；剩下的 $${k - n}$ 个自由选：$\\binom{${k - n} + ${n - 1}}{${n - 1}} = \\binom{${k - 1}}{${n - 1}} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** theInclusionExclusionPrinciple counts unions by alternately adding and subtracting intersections. */
export const theInclusionExclusionPrinciple: TopicDef = {
  id: "the-inclusion-exclusion-principle",
  title: t("The Inclusion-Exclusion Principle", "容斥原理"),
  summary: t(
    "|A ∪ B ∪ C| = |A| + |B| + |C| − |A ∩ B| − |A ∩ C| − |B ∩ C| + |A ∩ B ∩ C|; in general, add single sets, subtract pairs, add triples, and so on.",
    "|A ∪ B ∪ C| = |A| + |B| + |C| − |A ∩ B| − |A ∩ C| − |B ∩ C| + |A ∩ B ∩ C|；一般地，加单个集合，减两两交集，加三个的交集，依此类推。",
  ),
  prerequisites: ["cardinality-of-finite-sets", "the-rules-of-sum-and-product"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "inclusion-exclusion-for-three-sets",
      title: t("Three sets", "三个集合"),
      explanation: t(
        "In a class, $12$ play football, $10$ basketball and $8$ tennis; $5$ play football and basketball, $4$ football and tennis, $3$ basketball and tennis, and $2$ all three. Then $12 + 10 + 8 - 5 - 4 - 3 + 2 = 20$ play at least one.",
        "某班 $12$ 人踢足球，$10$ 人打篮球，$8$ 人打网球；$5$ 人足球和篮球，$4$ 人足球和网球，$3$ 人篮球和网球，$2$ 人三项都参加。则至少参加一项的有 $12 + 10 + 8 - 5 - 4 - 3 + 2 = 20$ 人。",
      ),
      generate(rng) {
        const [abc, ab, ac, bc, a, b, c] = [
          rng.int(1, 6),
          rng.int(0, 8),
          rng.int(0, 8),
          rng.int(0, 8),
          rng.int(2, 20),
          rng.int(2, 20),
          rng.int(2, 20),
        ];
        const A = a + ab + ac + abc;
        const B = b + ab + bc + abc;
        const C = c + ac + bc + abc;
        const AB = ab + abc;
        const AC = ac + abc;
        const BC = bc + abc;
        const union = A + B + C - AB - AC - BC + abc;
        const none = rng.bool();
        const total = union + rng.int(3, 20);
        const value = none ? total - union : union;
        const [x, y, z] = rng.pick([
          [t("football", "足球"), t("basketball", "篮球"), t("tennis", "网球")],
          [t("French", "法语"), t("German", "德语"), t("Spanish", "西班牙语")],
          [t("a cat", "猫"), t("a dog", "狗"), t("a fish", "鱼")],
        ]);
        const pre = t(
          `In a survey of $${total}$ people, $${A}$ chose ${x.en}, $${B}$ chose ${y.en} and $${C}$ chose ${z.en}; $${AB}$ chose ${x.en} and ${y.en}, $${AC}$ chose ${x.en} and ${z.en}, $${BC}$ chose ${y.en} and ${z.en}, and $${abc}$ chose all three.`,
          `在一项对 $${total}$ 人的调查中，$${A}$ 人选了${x["zh-CN"]}，$${B}$ 人选了${y["zh-CN"]}，$${C}$ 人选了${z["zh-CN"]}；$${AB}$ 人选了${x["zh-CN"]}和${y["zh-CN"]}，$${AC}$ 人选了${x["zh-CN"]}和${z["zh-CN"]}，$${BC}$ 人选了${y["zh-CN"]}和${z["zh-CN"]}，$${abc}$ 人三项都选了。`,
        );
        return numberProblem({
          prompt: none
            ? t(`${pre.en} How many chose none of the three?`, `${pre["zh-CN"]}三项都没选的有多少人？`)
            : t(`${pre.en} How many chose at least one of the three?`, `${pre["zh-CN"]}至少选了一项的有多少人？`),
          answer: value,
          wrong: (none
            ? [total - (A + B + C), total - (union - abc), total - (A + B + C - AB - AC - BC), union]
            : [A + B + C, union - abc, A + B + C - AB - AC - BC]
          ).filter((w) => w >= 0),
          solution: t(
            `$|A \\cup B \\cup C| = ${A} + ${B} + ${C} - ${AB} - ${AC} - ${BC} + ${abc} = ${union}$${none ? `, so $${total} - ${union} = ${value}$ chose none` : ""}.`,
            `$|A \\cup B \\cup C| = ${A} + ${B} + ${C} - ${AB} - ${AC} - ${BC} + ${abc} = ${union}$${none ? `，所以三项都没选的有 $${total} - ${union} = ${value}$ 人` : ""}。`,
          ),
        });
      },
    },
    {
      id: "counting-multiples-by-inclusion-exclusion",
      title: t("Counting multiples", "计数倍数"),
      explanation: t(
        "To count the numbers divisible by at least one of several divisors, add the counts for each divisor and subtract the overlaps that were counted twice. Of $1, \\dots, 100$, the multiples of $2$ or $3$ number $50 + 33 - 16 = 67$: the multiples of $6$ were counted twice.",
        "要数出至少能被几个除数中的一个整除的数，先把各除数的个数相加，再减去被数了两次的重叠部分。在 $1, \\dots, 100$ 中，$2$ 或 $3$ 的倍数有 $50 + 33 - 16 = 67$ 个：$6$ 的倍数被数了两次。",
      ),
      generate(rng) {
        const ds = rng.sample([2, 3, 5, 7], rng.int(2, 3)).sort((a, b) => a - b);
        const N = 10 * rng.int(5, 60);
        const subsets = range(1, 2 ** ds.length - 1).map((mask) => ds.filter((_, i) => (mask >> i) & 1));
        const term = (s: readonly number[]) => Math.floor(N / s.reduce((a, b) => a * b, 1));
        const union = subsets.reduce((sum, s) => sum + (s.length % 2 === 1 ? 1 : -1) * term(s), 0);
        const none = rng.bool();
        const value = none ? N - union : union;
        const list = ds.join(", ");
        const singles = ds.map((d) => term([d])).reduce((a, b) => a + b, 0);
        const steps = subsets
          .map((s) => `${s.length % 2 === 1 ? "+" : "-"} ${term(s)}`)
          .join(" ")
          .replace(/^\+ /, "");
        return numberProblem({
          prompt: none
            ? t(
                `How many of the integers $1, 2, \\dots, ${N}$ are divisible by none of $${list}$?`,
                `整数 $1, 2, \\dots, ${N}$ 中有多少个不能被 $${list}$ 中任何一个整除？`,
              )
            : t(
                `How many of the integers $1, 2, \\dots, ${N}$ are divisible by at least one of $${list}$?`,
                `整数 $1, 2, \\dots, ${N}$ 中有多少个能被 $${list}$ 中至少一个整除？`,
              ),
          answer: value,
          wrong: none
            ? [N - singles, N - union + term(ds)]
            : [singles, union - (ds.length === 3 ? term(ds) : 0) + (ds.length === 2 ? term(ds) : 0), singles - term(ds)],
          solution: t(
            `By inclusion-exclusion, $${steps} = ${union}$ are divisible by at least one${none ? `, so $${N} - ${union} = ${value}$ are divisible by none` : ""}.`,
            `由容斥原理，至少被一个整除的有 $${steps} = ${union}$ 个${none ? `，所以都不能整除的有 $${N} - ${union} = ${value}$ 个` : ""}。`,
          ),
        });
      },
    },
  ],
};

/** countingIntegerSolutionsOfAConstrainedEquation counts solutions of x₁ + ⋯ + xₖ = n under bounds. */
export const countingIntegerSolutionsOfAConstrainedEquation: TopicDef = {
  id: "counting-integer-solutions-of-a-constrained-equation",
  title: t("Counting Integer Solutions of a Constrained Equation", "计数受约束方程的整数解"),
  summary: t(
    "x₁ + ⋯ + xₖ = n has C(n + k − 1, k − 1) solutions in nonnegative integers. Lower bounds are handled by substitution, upper bounds by subtracting the solutions that break them.",
    "x₁ + ⋯ + xₖ = n 有 C(n + k − 1, k − 1) 组非负整数解。下界用换元处理，上界则减去违反它的解。",
  ),
  prerequisites: ["combinations-with-repetition"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "solutions-with-lower-bounds",
      title: t("Lower bounds", "下界"),
      explanation: t(
        "When some variables must be at least a given number, subtract that number from them first, which turns the problem into one where every variable is simply nonnegative. For $x + y + z = 10$ with $x \\ge 2$, $y \\ge 1$, $z \\ge 0$, put $x' = x - 2$, $y' = y - 1$: then $x' + y' + z = 7$ with all variables $\\ge 0$, which has $\\binom{9}{2} = 36$ solutions.",
        "当某些变量至少为某个数时，先从这些变量中减去这个数，问题就变成每个变量只需非负的情形。对 $x + y + z = 10$，$x \\ge 2$，$y \\ge 1$，$z \\ge 0$，令 $x' = x - 2$，$y' = y - 1$：则 $x' + y' + z = 7$，各变量 $\\ge 0$，共有 $\\binom{9}{2} = 36$ 组解。",
      ),
      generate(rng) {
        const k = rng.int(3, 5);
        const lows = range(1, k).map(() => rng.int(0, 3));
        const n = lows.reduce((a, b) => a + b, 0) + rng.int(2, 12);
        const m = n - lows.reduce((a, b) => a + b, 0);
        const value = choose(m + k - 1, k - 1);
        const vars = range(1, k).map((i) => `x_{${i}}`);
        const conds = vars.map((v, i) => `${v} \\ge ${lows[i]}`).join(", ");
        return numberProblem({
          prompt: t(
            `How many integer solutions does $${vars.join(" + ")} = ${n}$ have with $${conds}$?`,
            `方程 $${vars.join(" + ")} = ${n}$ 在 $${conds}$ 下有多少组整数解？`,
          ),
          answer: value,
          wrong: [choose(n + k - 1, k - 1), choose(m + k - 1, k), choose(m - 1, k - 1), choose(m + k, k - 1)],
          solution: t(
            `Subtracting the lower bounds leaves a sum of $${m}$ in $${k}$ nonnegative variables: $\\binom{${m + k - 1}}{${k - 1}} = ${value}$.`,
            `减去下界后，剩下 $${k}$ 个非负变量之和为 $${m}$：$\\binom{${m + k - 1}}{${k - 1}} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "solutions-with-an-upper-bound",
      title: t("An upper bound", "上界"),
      explanation: t(
        "An upper bound is handled by counting all solutions and then subtracting the solutions that break the bound, which have a lower bound instead. For $x + y + z = 10$ in nonnegative integers with $x \\le 3$: all solutions number $\\binom{12}{2} = 66$; those with $x \\ge 4$ number $\\binom{8}{2} = 28$. So $66 - 28 = 38$.",
        "处理上界时，先数出所有解，再减去超出上界的解，而这些解满足的是一个下界条件。对非负整数 $x + y + z = 10$ 且 $x \\le 3$：全部解有 $\\binom{12}{2} = 66$ 组；$x \\ge 4$ 的有 $\\binom{8}{2} = 28$ 组。所以 $66 - 28 = 38$。",
      ),
      generate(rng) {
        const k = rng.int(3, 4);
        const n = rng.int(6, 15);
        const u = rng.int(1, n - 2);
        const all = choose(n + k - 1, k - 1);
        const bad = choose(n - u - 1 + k - 1, k - 1);
        const value = all - bad;
        const vars = range(1, k).map((i) => `x_{${i}}`);
        return numberProblem({
          prompt: t(
            `How many solutions in nonnegative integers does $${vars.join(" + ")} = ${n}$ have with $x_1 \\le ${u}$?`,
            `方程 $${vars.join(" + ")} = ${n}$ 在 $x_1 \\le ${u}$ 下有多少组非负整数解？`,
          ),
          answer: value,
          wrong: [all, bad, all - choose(n - u + k - 1, k - 1), choose(n - u + k - 1, k - 1)],
          solution: t(
            `All solutions: $\\binom{${n + k - 1}}{${k - 1}} = ${all}$. Those with $x_1 \\ge ${u + 1}$: substitute $x_1' = x_1 - ${u + 1}$, giving $\\binom{${n - u - 1 + k - 1}}{${k - 1}} = ${bad}$. So $${all} - ${bad} = ${value}$.`,
            `全部解：$\\binom{${n + k - 1}}{${k - 1}} = ${all}$。$x_1 \\ge ${u + 1}$ 的解：令 $x_1' = x_1 - ${u + 1}$，得 $\\binom{${n - u - 1 + k - 1}}{${k - 1}} = ${bad}$。所以 $${all} - ${bad} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** partitionsOf lists the partitions of n into parts at most max, in decreasing order. */
function partitionsOf(n: number, max = n): number[][] {
  if (n === 0) return [[]];
  const out: number[][] = [];
  for (let p = Math.min(n, max); p >= 1; p--) for (const rest of partitionsOf(n - p, p)) out.push([p, ...rest]);
  return out;
}

/** partitionsOfNaturalNumbers counts the ways to write n as an unordered sum of positive integers. */
export const partitionsOfNaturalNumbers: TopicDef = {
  id: "partitions-of-natural-numbers",
  title: t("Partitions of Natural Numbers", "自然数的分拆"),
  summary: t(
    "A partition of n writes n as a sum of positive integers, ignoring order. The number of partitions of n into exactly k parts satisfies p(n, k) = p(n − 1, k − 1) + p(n − k, k).",
    "n 的一个分拆把 n 写成若干正整数之和，不计顺序。把 n 分成恰好 k 部分的分拆数满足 p(n, k) = p(n − 1, k − 1) + p(n − k, k)。",
  ),
  prerequisites: ["the-rules-of-sum-and-product"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-partitions",
      title: t("Counting partitions", "计数分拆"),
      explanation: t(
        "The partitions of $5$ are $5$, $4 + 1$, $3 + 2$, $3 + 1 + 1$, $2 + 2 + 1$, $2 + 1 + 1 + 1$ and $1 + 1 + 1 + 1 + 1$: $p(5) = 7$. List parts in decreasing order so that nothing is counted twice.",
        "$5$ 的分拆有 $5$、$4 + 1$、$3 + 2$、$3 + 1 + 1$、$2 + 2 + 1$、$2 + 1 + 1 + 1$ 和 $1 + 1 + 1 + 1 + 1$：$p(5) = 7$。按从大到小列出各部分，就不会重复计数。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const n = kind === 0 ? rng.int(4, 12) : rng.int(5, 14);
        const all = partitionsOf(n);
        const sel =
          kind === 0 ? all : kind === 1 ? all.filter((p) => new Set(p).size === p.length) : all.filter((p) => p.every((x) => x % 2 === 1));
        const value = sel.length;
        const list = sel.length <= 12 ? sel.map((p) => p.join(" + ")).join(",\\ ") : undefined;
        const what = [
          t("partitions", "分拆"),
          t("partitions into distinct parts", "各部分互不相同的分拆"),
          t("partitions into odd parts", "各部分都是奇数的分拆"),
        ][kind]!;
        return numberProblem({
          prompt: t(`How many ${what.en} does $${n}$ have?`, `$${n}$ 有多少个${what["zh-CN"]}？`),
          answer: value,
          wrong: [all.length, 2 ** (n - 1), value + 1, value - 1, n],
          solution: list
            ? t(`They are $${list}$: $${value}$ in all.`, `它们是 $${list}$：共 $${value}$ 个。`)
            : t(`Listing them by largest part, in decreasing order, gives $${value}$.`, `按最大部分从大到小依次列出，共 $${value}$ 个。`),
        });
      },
    },
    {
      id: "partitions-into-k-parts",
      title: t("Partitions into k parts", "分成 k 部分"),
      explanation: t(
        "Partitions with exactly $k$ parts either contain a part equal to one or, after subtracting one from every part, become partitions of a smaller number. Partitions of $7$ into exactly $3$ parts: $5 + 1 + 1$, $4 + 2 + 1$, $3 + 3 + 1$, $3 + 2 + 2$, so $p(7, 3) = 4$. Check: $p(6, 2) + p(4, 3) = 3 + 1 = 4$.",
        "恰有 $k$ 个部分的划分，要么含有等于 1 的部分，要么在每个部分都减去 1 之后变成一个更小的数的划分。把 $7$ 分成恰好 $3$ 部分：$5 + 1 + 1$、$4 + 2 + 1$、$3 + 3 + 1$、$3 + 2 + 2$，所以 $p(7, 3) = 4$。验证：$p(6, 2) + p(4, 3) = 3 + 1 = 4$。",
      ),
      generate(rng) {
        const k = rng.int(2, 4);
        const n = rng.int(k + 2, 13);
        const sel = partitionsOf(n).filter((p) => p.length === k);
        const value = sel.length;
        const list = sel.length <= 10 ? sel.map((p) => p.join(" + ")).join(",\\ ") : undefined;
        return numberProblem({
          prompt: t(
            `In how many ways can $${n}$ be written as a sum of exactly $${k}$ positive integers, if order does not matter?`,
            `若不计顺序，把 $${n}$ 写成恰好 $${k}$ 个正整数之和有多少种方法？`,
          ),
          answer: value,
          wrong: [choose(n - 1, k - 1), partitionsOf(n).filter((p) => p.length <= k).length, value + 1],
          solution: list
            ? t(`They are $${list}$: $${value}$ partitions.`, `它们是 $${list}$：共 $${value}$ 个分拆。`)
            : t(
                `By $p(n, k) = p(n - 1, k - 1) + p(n - k, k)$: $p(${n}, ${k}) = ${partitionsOf(n - 1).filter((p) => p.length === k - 1).length} + ${partitionsOf(n - k).filter((p) => p.length === k).length} = ${value}$.`,
                `由 $p(n, k) = p(n - 1, k - 1) + p(n - k, k)$：$p(${n}, ${k}) = ${partitionsOf(n - 1).filter((p) => p.length === k - 1).length} + ${partitionsOf(n - k).filter((p) => p.length === k).length} = ${value}$。`,
              ),
        });
      },
    },
  ],
};

/** thePigeonholePrinciple guarantees a crowded box when objects outnumber boxes. */
export const thePigeonholePrinciple: TopicDef = {
  id: "the-pigeonhole-principle",
  title: t("The Pigeonhole Principle", "鸽巢原理"),
  summary: t(
    "If N objects are placed in m boxes, some box holds at least ⌈N/m⌉ objects. So m(k − 1) + 1 objects guarantee k in one box, and m(k − 1) do not.",
    "把 N 个物体放入 m 个盒子，某个盒子至少有 ⌈N/m⌉ 个。所以 m(k − 1) + 1 个物体能保证某盒有 k 个，而 m(k − 1) 个不能。",
  ),
  prerequisites: ["the-rules-of-sum-and-product"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "guaranteeing-a-crowded-box",
      title: t("How many to guarantee k alike", "保证有 k 个相同需要多少"),
      explanation: t(
        "With $4$ suits, $4 \\cdot 2 = 8$ cards can hold only $2$ of each suit, but a $9$th card makes $3$ of some suit. So $9$ cards guarantee $3$ of one suit.",
        "共有 $4$ 种花色，$4 \\cdot 2 = 8$ 张牌可能每种花色只有 $2$ 张，但第 $9$ 张牌会使某花色有 $3$ 张。所以 $9$ 张牌能保证某花色有 $3$ 张。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const k = rng.int(2, 9);
        const m = [4, 12, rng.int(3, 7)][kind]!;
        const value = m * (k - 1) + 1;
        const prompts = [
          t(
            `How many cards must be drawn from a standard deck to guarantee $${k}$ cards of the same suit?`,
            `至少要从一副标准扑克牌中抽多少张，才能保证有 $${k}$ 张同花色？`,
          ),
          t(
            `How many people are needed to guarantee that at least $${k}$ of them were born in the same month?`,
            `至少需要多少人，才能保证其中至少 $${k}$ 人在同一个月出生？`,
          ),
          t(
            `A drawer holds plenty of socks in $${m}$ colors. How many must be taken in the dark to guarantee $${k}$ of the same color?`,
            `抽屉里有大量 $${m}$ 种颜色的袜子。在黑暗中至少要拿多少只，才能保证有 $${k}$ 只同色？`,
          ),
        ];
        return numberProblem({
          prompt: prompts[kind]!,
          answer: value,
          wrong: [m * (k - 1), m * k, m * k + 1, m + k],
          solution: t(
            `With $${m}$ categories, $${m} \\cdot ${k - 1} = ${m * (k - 1)}$ can avoid $${k}$ alike, but one more forces it: $${value}$.`,
            `共有 $${m}$ 类，$${m} \\cdot ${k - 1} = ${m * (k - 1)}$ 个可以避免 $${k}$ 个同类，再多一个就必然出现：$${value}$。`,
          ),
        });
      },
    },
    {
      id: "the-generalized-pigeonhole-principle",
      title: t("The guaranteed minimum", "保证的最小值"),
      explanation: t(
        "If $50$ letters go into $7$ mailboxes, some mailbox gets at least $\\lceil 50/7 \\rceil = 8$ letters: with at most $7$ each, the boxes hold at most $49$.",
        "把 $50$ 封信放进 $7$ 个信箱，某个信箱至少有 $\\lceil 50/7 \\rceil = 8$ 封：若每个最多 $7$ 封，信箱最多装 $49$ 封。",
      ),
      generate(rng) {
        const m = rng.int(3, 15);
        const N = rng.int(m + 1, 12 * m);
        const value = Math.ceil(N / m);
        const ctx = rng.pick([
          t(`$${N}$ letters are put into $${m}$ mailboxes.`, `把 $${N}$ 封信放进 $${m}$ 个信箱。`),
          t(`$${N}$ students are split among $${m}$ classrooms.`, `把 $${N}$ 名学生分到 $${m}$ 间教室。`),
          t(`$${N}$ pigeons fly into $${m}$ holes.`, `$${N}$ 只鸽子飞进 $${m}$ 个巢。`),
        ]);
        return numberProblem({
          prompt: t(
            `${ctx.en} What is the largest number that must be in some single one of them, however they are placed?`,
            `${ctx["zh-CN"]}无论怎样放置，某一个中必定至少有多少个？求这个保证成立的最大数。`,
          ),
          answer: value,
          wrong: [Math.floor(N / m), value + 1, N - m + 1],
          solution: t(
            `If each held at most $${value - 1}$, the total would be at most $${m * (value - 1)} < ${N}$. So some one holds at least $\\lceil ${N}/${m} \\rceil = ${value}$, and an even split shows no more is guaranteed.`,
            `若每个最多 $${value - 1}$，总数至多为 $${m * (value - 1)} < ${N}$。所以某一个至少有 $\\lceil ${N}/${m} \\rceil = ${value}$，而均匀分配说明不能保证更多。`,
          ),
        });
      },
    },
  ],
};

/** discreteMathematicsCountingTopics are the new topics of Discrete Mathematics unit 3 on Bayes' theorem and counting. */
export const discreteMathematicsCountingTopics: readonly TopicDef[] = [
  bayesTheorem,
  extendingTheLawOfTotalProbability,
  extendingBayesTheorem,
  permutationsWithRepetition,
  kPermutationsOfNWithRepetition,
  combinationsWithRepetition,
  theInclusionExclusionPrinciple,
  countingIntegerSolutionsOfAConstrainedEquation,
  partitionsOfNaturalNumbers,
  thePigeonholePrinciple,
];
