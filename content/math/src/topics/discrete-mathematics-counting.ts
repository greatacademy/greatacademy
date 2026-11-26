import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";

import { numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";
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

/** asQ turns a number into a rational. */
const asQ = (v: number | Q): Q => (typeof v === "number" ? Q.of(v) : v);

/** distinct drops the mistakes whose value is the answer, is negative, or repeats an earlier one. */
function distinct<M extends { readonly value: number | Q }>(answer: number | Q, mistakes: readonly M[]): M[] {
  return mistakes.filter(
    (m, i, all) =>
      !asQ(m.value).eq(asQ(answer)) && !asQ(m.value).toLatex().startsWith("-") && all.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i,
  );
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
  intro: t(
    "$P(A) = 0.25$, $P(B \\mid A) = 0.8$ and $P(B \\mid A') = 0.4$. By total probability $P(B) = 0.8 \\cdot 0.25 + 0.4 \\cdot 0.75 = 0.2 + 0.3 = 0.5$, so $P(A \\mid B) = \\frac{0.2}{0.5} = 0.4$.\n\nCheck: $P(A \\mid B)P(B) = 0.4 \\cdot 0.5 = 0.2$, which is $P(B \\mid A)P(A)$, the probability of $A$ and $B$ together.\n\nIn this lesson we use Bayes' theorem to turn the probability of the evidence given a cause into the probability of the cause given the evidence.",
    "$P(A) = 0.25$，$P(B \\mid A) = 0.8$，$P(B \\mid A') = 0.4$。由全概率公式 $P(B) = 0.8 \\cdot 0.25 + 0.4 \\cdot 0.75 = 0.2 + 0.3 = 0.5$，所以 $P(A \\mid B) = \\frac{0.2}{0.5} = 0.4$。\n\n检验：$P(A \\mid B)P(B) = 0.4 \\cdot 0.5 = 0.2$，正是 $P(B \\mid A)P(A)$，即 $A$ 与 $B$ 同时发生的概率。\n\n本课我们用贝叶斯定理，把“原因下出现证据的概率”转化为“有证据时原因成立的概率”。",
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
        "Bayes' theorem reverses a conditional probability: it finds the chance of the cause given the evidence from the chance of the evidence given the cause. If $P(A) = 0.4$, $P(B \\mid A) = 0.5$ and $P(B) = 0.25$, then $P(A \\mid B) = \\frac{0.5 \\cdot 0.4}{0.25} = 0.8$.\n\n> **Watch out.** $P(A \\mid B)$ and $P(B \\mid A)$ are different numbers; the formula multiplies $P(B \\mid A)$ by $P(A)$ and divides by $P(B)$, not the other way round.",
        "贝叶斯定理把条件概率倒过来：由“原因下出现证据的概率”求出“有证据时原因成立的概率”。若 $P(A) = 0.4$，$P(B \\mid A) = 0.5$，$P(B) = 0.25$，则 $P(A \\mid B) = \\frac{0.5 \\cdot 0.4}{0.25} = 0.8$。\n\n> **注意。** $P(A \\mid B)$ 与 $P(B \\mid A)$ 是不同的数；公式是用 $P(B \\mid A)$ 乘以 $P(A)$ 再除以 $P(B)$，不能颠倒。",
      ),
      generate(rng) {
        const a = Q.of(rng.int(1, 9), 10);
        const ba = Q.of(rng.int(1, 9), 10);
        const bn = Q.of(rng.int(1, 9), 10);
        const b = ba.mul(a).add(bn.mul(Q.of(1).sub(a)));
        const joint = ba.mul(a);
        const value = joint.div(b);
        return numberProblem({
          prompt: t(
            `$P(A) = ${dec(a)}$, $P(B \\mid A) = ${dec(ba)}$ and $P(B) = ${dec(b)}$. Find $P(A \\mid B)$ as a fraction.`,
            `$P(A) = ${dec(a)}$，$P(B \\mid A) = ${dec(ba)}$，$P(B) = ${dec(b)}$。用分数表示 $P(A \\mid B)$。`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(joint, "That is $P(A \\text{ and } B)$; divide it by $P(B)$.", "那是 $P(A \\text{ 且 } B)$；还要除以 $P(B)$。"),
            why(
              ba,
              "That is $P(B \\mid A)$, the conditional probability the other way round.",
              "那是 $P(B \\mid A)$，是反方向的条件概率。",
            ),
            why(ba.mul(b).div(a), "That swaps $P(A)$ and $P(B)$ in the formula.", "那是把公式中的 $P(A)$ 与 $P(B)$ 对调了。"),
            why(
              a.mul(b).div(ba),
              "That turns the formula upside down; $P(B \\mid A)$ belongs in the numerator.",
              "那是把公式颠倒了；$P(B \\mid A)$ 应在分子上。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Multiply", "相乘"],
                t(
                  `$P(B \\mid A)P(A) = ${dec(ba)} \\cdot ${dec(a)} = ${dec(joint)}$.`,
                  `$P(B \\mid A)P(A) = ${dec(ba)} \\cdot ${dec(a)} = ${dec(joint)}$。`,
                ),
              ],
              [
                ["Divide by $P(B)$", "除以 $P(B)$"],
                t(
                  `$P(A \\mid B) = \\frac{${dec(joint)}}{${dec(b)}} = ${value.toLatex()}$.`,
                  `$P(A \\mid B) = \\frac{${dec(joint)}}{${dec(b)}} = ${value.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `$P(A \\mid B)P(B) = ${value.toLatex()} \\cdot ${dec(b)} = ${dec(joint)}$, which is $P(B \\mid A)P(A)$.`,
              `$P(A \\mid B)P(B) = ${value.toLatex()} \\cdot ${dec(b)} = ${dec(joint)}$，正是 $P(B \\mid A)P(A)$。`,
            ),
          ),
        });
      },
    },
    {
      id: "bayes-theorem-in-context",
      title: t("Bayes' theorem in context", "情境中的贝叶斯定理"),
      explanation: t(
        "If $1\\%$ have a disease and a test is positive for $90\\%$ of those who have it and $4\\%$ of those who do not, then $P(\\text{disease} \\mid +) = \\frac{0.9 \\cdot 0.01}{0.9 \\cdot 0.01 + 0.04 \\cdot 0.99} = \\frac{5}{27}$. A positive result is still more likely to be a false alarm.\n\n> **Watch out.** The false positives come from the large group without the disease, so weight their rate by $0.99$, not leave it alone; and the rate $0.9$ is $P(+ \\mid \\text{disease})$, not the answer.",
        "若 $1\\%$ 的人患病，检测对患者阳性率为 $90\\%$，对非患者为 $4\\%$，则 $P(\\text{患病} \\mid +) = \\frac{0.9 \\cdot 0.01}{0.9 \\cdot 0.01 + 0.04 \\cdot 0.99} = \\frac{5}{27}$。阳性结果仍更可能是误报。\n\n> **注意。** 误报来自人数众多的未患病者，所以其比例要乘以 $0.99$，不能直接使用；而 $0.9$ 是 $P(+ \\mid \\text{患病})$，不是答案。",
      ),
      generate(rng) {
        const p = rng.pick([1, 2, 4, 5, 10, 20, 25, 30, 40]);
        const x = rng.pick([60, 70, 75, 80, 90, 95, 99]);
        const y = rng.pick([1, 2, 5, 10, 15, 20]);
        const s = bayesStory(rng, p, x, y);
        const num = pct(x).mul(pct(p));
        const fal = pct(y).mul(pct(100 - p));
        const den = num.add(fal);
        const value = num.div(den);
        return numberProblem({
          prompt: t(`${s.en} ${s.askEn} Give the answer as a fraction.`, `${s.zh}${s.askZh}答案写成分数。`),
          answer: value,
          mistakes: distinct(value, [
            why(
              pct(x),
              "That is the rate of the evidence given the cause; Bayes' theorem reverses it.",
              "那是原因成立时出现证据的比例；贝叶斯定理要把它反过来。",
            ),
            why(
              num,
              "That is the probability of the true-positive path alone; divide by the total probability of the evidence.",
              "那只是真阳性路径的概率；还要除以证据的总概率。",
            ),
            why(
              num.div(num.add(pct(y))),
              `That leaves the false rate $${dec(pct(y))}$ unweighted; multiply it by $${dec(pct(100 - p))}$.`,
              `那是没有给误报比例 $${dec(pct(y))}$ 加权；要乘以 $${dec(pct(100 - p))}$。`,
            ),
            why(Q.of(1).sub(value), "That is the probability of the other case given the evidence.", "那是有证据时另一种情形的概率。"),
          ]),
          solution: walked(
            [
              [
                ["Find the two paths", "求两条路径"],
                t(
                  `True: $${dec(pct(x))} \\cdot ${dec(pct(p))} = ${dec(num)}$. False: $${dec(pct(y))} \\cdot ${dec(pct(100 - p))} = ${dec(fal)}$.`,
                  `真阳性：$${dec(pct(x))} \\cdot ${dec(pct(p))} = ${dec(num)}$。误报：$${dec(pct(y))} \\cdot ${dec(pct(100 - p))} = ${dec(fal)}$。`,
                ),
              ],
              [
                ["Add them", "相加"],
                t(`$P(B) = ${dec(num)} + ${dec(fal)} = ${dec(den)}$.`, `$P(B) = ${dec(num)} + ${dec(fal)} = ${dec(den)}$。`),
              ],
              [
                ["Divide", "相除"],
                t(
                  `The probability is $\\frac{${dec(num)}}{${dec(den)}} = ${value.toLatex()}$.`,
                  `所求概率为 $\\frac{${dec(num)}}{${dec(den)}} = ${value.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The other case has probability $\\frac{${dec(fal)}}{${dec(den)}} = ${Q.of(1).sub(value).toLatex()}$, and the two add to $1$.`,
              `另一种情形的概率为 $\\frac{${dec(fal)}}{${dec(den)}} = ${Q.of(1).sub(value).toLatex()}$，两者之和为 $1$。`,
            ),
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
  intro: t(
    "Four suppliers send $40\\%$, $30\\%$, $20\\%$ and $10\\%$ of a shop's stock, and $1\\%$, $2\\%$, $3\\%$ and $10\\%$ of their items are faulty. Writing $F$ for a faulty item, $P(F) = 0.4 \\cdot 0.01 + 0.3 \\cdot 0.02 + 0.2 \\cdot 0.03 + 0.1 \\cdot 0.1 = 0.004 + 0.006 + 0.006 + 0.01 = 0.026$.\n\nCheck: $0.026$ lies between the smallest rate $0.01$ and the largest $0.1$, as a weighted average of the rates must.\n\nIn this lesson we find the probability of an event by splitting the outcomes into several cases and adding the contribution of each.",
    "四家供应商分别提供某商店 $40\\%$、$30\\%$、$20\\%$、$10\\%$ 的货物，其次品率为 $1\\%$、$2\\%$、$3\\%$、$10\\%$。记 $F$ 为次品，$P(F) = 0.4 \\cdot 0.01 + 0.3 \\cdot 0.02 + 0.2 \\cdot 0.03 + 0.1 \\cdot 0.1 = 0.004 + 0.006 + 0.006 + 0.01 = 0.026$。\n\n检验：$0.026$ 介于最小比例 $0.01$ 与最大比例 $0.1$ 之间，正如各比例的加权平均应有的那样。\n\n本课我们把结果分成若干情形，把每种情形的贡献相加，求出事件的概率。",
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
        "When the outcomes split into separate cases that cover everything, the probability of an event is the sum over the cases of the case probability times the chance of the event in that case. Machines A, B, C make $50\\%$, $30\\%$, $20\\%$ of the parts, with $2\\%$, $3\\%$, $10\\%$ defective. Writing $F$ for a defective part: $P(F) = 0.5 \\cdot 0.02 + 0.3 \\cdot 0.03 + 0.2 \\cdot 0.1 = 0.039$.\n\n> **Watch out.** Weight each rate by its machine's share; the plain average or the plain sum of the rates ignores how much each machine makes.",
        "当结果被分成互不重叠且覆盖全部的情形时，事件的概率等于各情形的概率乘以该情形下事件发生的概率，再全部相加。机器 A、B、C 分别生产 $50\\%$、$30\\%$、$20\\%$ 的零件，次品率为 $2\\%$、$3\\%$、$10\\%$。记 $F$ 为次品：$P(F) = 0.5 \\cdot 0.02 + 0.3 \\cdot 0.03 + 0.2 \\cdot 0.1 = 0.039$。\n\n> **注意。** 每个次品率都要乘以该机器的份额；直接平均或直接相加次品率，都忽略了各机器的产量。",
      ),
      generate(rng) {
        const m = randomMachines(rng);
        const value = totalDefect(m);
        const intro = machinesIntro(m);
        const terms = m.shares.map((s, i) => `${dec(pct(s))} \\cdot ${dec(pct(m.rates[i]!))}`).join(" + ");
        const parts = m.shares.map((s, i) => dec(pct(s).mul(pct(m.rates[i]!)))).join(" + ");
        const sumRates = m.rates.reduce((a, b) => a + b, 0);
        return numberProblem({
          prompt: t(
            `${intro.en} Find the probability that a part chosen at random is defective, as a decimal.`,
            `${intro.zh}求随机抽取的零件是次品的概率，用小数表示。`,
          ),
          answer: value,
          form: "decimal",
          mistakes: distinct(value, [
            why(
              Q.of(sumRates, 100 * m.rates.length),
              "That is the plain average of the rates; weight each by its machine's share.",
              "那是次品率的简单平均；每个比例要乘以该机器的份额。",
            ),
            why(pct(sumRates), "That adds the rates without weighting them by the shares.", "那是直接把次品率相加，没有乘以份额。"),
            why(
              value.mul(Q.of(10)),
              "That misplaces the decimal point; a product of two percents is in ten-thousandths.",
              "那是小数点位置错了；两个百分数之积以万分之一为单位。",
            ),
          ]),
          solution: walked(
            [
              [["Weight each rate", "给每个比例加权"], t(`$P(F) = ${terms}$.`, `$P(F) = ${terms}$。`)],
              [["Add", "相加"], t(`$P(F) = ${parts} = ${dec(value)}$.`, `$P(F) = ${parts} = ${dec(value)}$。`)],
            ],
            t(
              `$${dec(value)}$ lies between the smallest rate $${dec(pct(Math.min(...m.rates)))}$ and the largest $${dec(pct(Math.max(...m.rates)))}$, as a weighted average must.`,
              `$${dec(value)}$ 介于最小次品率 $${dec(pct(Math.min(...m.rates)))}$ 与最大次品率 $${dec(pct(Math.max(...m.rates)))}$ 之间，加权平均理应如此。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-missing-conditional-probability",
      title: t("A missing conditional probability", "求缺失的条件概率"),
      explanation: t(
        "If the total probability is known, subtract the contributions of the known cases to find the contribution of the missing one, then divide by its case probability. Write $F$ for a defective part. If $P(F) = 0.039$ and machines A and B contribute $0.5 \\cdot 0.02 + 0.3 \\cdot 0.03 = 0.019$, then C contributes $0.02 = 0.2 \\cdot P(F \\mid C)$, so $P(F \\mid C) = 0.1$.\n\n> **Watch out.** What is left after subtracting is the contribution $P(C)P(F \\mid C)$, not $P(F \\mid C)$ itself; divide by the share of C.",
        "如果已知总概率，就减去已知情形的贡献，得到缺少的那个情形的贡献，再除以该情形的概率。记 $F$ 为次品。若 $P(F) = 0.039$，机器 A、B 贡献 $0.5 \\cdot 0.02 + 0.3 \\cdot 0.03 = 0.019$，则 C 贡献 $0.02 = 0.2 \\cdot P(F \\mid C)$，所以 $P(F \\mid C) = 0.1$。\n\n> **注意。** 相减后剩下的是贡献 $P(C)P(F \\mid C)$，不是 $P(F \\mid C)$ 本身；还要除以 C 的份额。",
      ),
      generate(rng) {
        const m = randomMachines(rng);
        const total = totalDefect(m);
        const k = m.shares.length - 1;
        const last = LETTERS[k]!;
        const rest = total.sub(pct(m.shares[k]!).mul(pct(m.rates[k]!)));
        const value = pct(m.rates[k]!);
        const left = total.sub(rest);
        const share = pct(m.shares[k]!);
        const intro = machinesIntro(m, true);
        return numberProblem({
          prompt: t(
            `${intro.en} Overall, a proportion $${dec(total)}$ of all parts are defective. Find the probability that a part from machine ${last} is defective, as a decimal.`,
            `${intro.zh}总体上所有零件中次品的比例为 $${dec(total)}$。求机器 ${last} 生产的零件是次品的概率，用小数表示。`,
          ),
          answer: value,
          form: "decimal",
          mistakes: distinct(value, [
            why(
              left,
              `That is the contribution of machine ${last}; divide it by the share $${dec(share)}$.`,
              `那是机器 ${last} 的贡献；还要除以份额 $${dec(share)}$。`,
            ),
            why(
              total.div(share),
              "That divides the whole total by the share without first subtracting the other machines.",
              "那是没有先减去其他机器的贡献，就把总数除以份额。",
            ),
            why(total, "That is the overall rate, not the rate for one machine.", "那是总体次品率，不是某一台机器的次品率。"),
          ]),
          solution: walked(
            [
              [
                ["Add the known cases", "求已知情形之和"],
                t(`The other machines contribute $${dec(rest)}$.`, `其他机器贡献 $${dec(rest)}$。`),
              ],
              [
                ["Subtract", "相减"],
                t(
                  `$${dec(share)} \\cdot P(F \\mid ${last}) = ${dec(total)} - ${dec(rest)} = ${dec(left)}$.`,
                  `$${dec(share)} \\cdot P(F \\mid ${last}) = ${dec(total)} - ${dec(rest)} = ${dec(left)}$。`,
                ),
              ],
              [["Divide by the share", "除以份额"], t(`$P(F \\mid ${last}) = ${dec(value)}$.`, `$P(F \\mid ${last}) = ${dec(value)}$。`)],
            ],
            t(
              `Putting it back: $${dec(rest)} + ${dec(share)} \\cdot ${dec(value)} = ${dec(total)}$, the given total.`,
              `代回：$${dec(rest)} + ${dec(share)} \\cdot ${dec(value)} = ${dec(total)}$，正是给定的总数。`,
            ),
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
  intro: t(
    "Four suppliers send $40\\%$, $30\\%$, $20\\%$ and $10\\%$ of a shop's stock, with $1\\%$, $2\\%$, $3\\%$ and $10\\%$ faulty, so $P(F) = 0.026$. A faulty item came from the fourth supplier with probability $\\frac{0.1 \\cdot 0.1}{0.026} = \\frac{0.01}{0.026} = \\frac{5}{13}$.\n\nCheck: the four posteriors are $\\frac{4}{26}$, $\\frac{6}{26}$, $\\frac{6}{26}$ and $\\frac{10}{26}$, and they add to $1$.\n\nIn this lesson we use Bayes' theorem over several cases: the probability of one case given the evidence is its path divided by the total of all the paths.",
    "四家供应商分别提供某商店 $40\\%$、$30\\%$、$20\\%$、$10\\%$ 的货物，次品率为 $1\\%$、$2\\%$、$3\\%$、$10\\%$，所以 $P(F) = 0.026$。一件次品来自第四家供应商的概率为 $\\frac{0.1 \\cdot 0.1}{0.026} = \\frac{0.01}{0.026} = \\frac{5}{13}$。\n\n检验：四个后验概率为 $\\frac{4}{26}$、$\\frac{6}{26}$、$\\frac{6}{26}$、$\\frac{10}{26}$，之和为 $1$。\n\n本课我们在多个情形下使用贝叶斯定理：有证据时某情形的概率，等于它的路径概率除以所有路径之和。",
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
        "The denominator is the total probability of the evidence over all cases, and the numerator is the one path through the case you are asking about. With shares $50\\%$, $30\\%$, $20\\%$ and defect rates $2\\%$, $3\\%$, $10\\%$, writing $F$ for a defective part: $P(F) = 0.039$, so $P(C \\mid F) = \\frac{0.2 \\cdot 0.1}{0.039} = \\frac{20}{39}$.\n\n> **Watch out.** The numerator is a share times a rate, and it must be divided by $P(F)$; the share alone is the probability before the evidence, and comparing rates alone ignores the shares.",
        "分母是证据在所有情形下的总概率，分子是经过所问情形的那一条路径的概率。份额为 $50\\%$、$30\\%$、$20\\%$，次品率为 $2\\%$、$3\\%$、$10\\%$，记 $F$ 为次品：$P(F) = 0.039$，所以 $P(C \\mid F) = \\frac{0.2 \\cdot 0.1}{0.039} = \\frac{20}{39}$。\n\n> **注意。** 分子是份额乘以次品率，并且要除以 $P(F)$；单独的份额是得到证据之前的概率，只比较次品率则忽略了份额。",
      ),
      generate(rng) {
        const m = randomMachines(rng);
        const total = totalDefect(m);
        const i = rng.int(0, m.shares.length - 1);
        const name = LETTERS[i]!;
        const num = pct(m.shares[i]!).mul(pct(m.rates[i]!));
        const value = num.div(total);
        const intro = machinesIntro(m);
        const terms = m.shares.map((s, j) => `${dec(pct(s))} \\cdot ${dec(pct(m.rates[j]!))}`).join(" + ");
        return numberProblem({
          prompt: t(
            `${intro.en} A part chosen at random is defective. Find the probability that it was made by machine ${name}, as a fraction.`,
            `${intro.zh}随机抽取的一个零件是次品，求它由机器 ${name} 生产的概率，用分数表示。`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              num,
              `That is the path through machine ${name}; divide it by $P(F)$.`,
              `那是经过机器 ${name} 的路径概率；还要除以 $P(F)$。`,
            ),
            why(
              pct(m.shares[i]!),
              "That is the share before the evidence; a defective part changes it.",
              "那是得到证据之前的份额；出现次品会改变它。",
            ),
            why(
              Q.of(
                m.rates[i]!,
                m.rates.reduce((a, b) => a + b, 0),
              ),
              "That compares the rates alone, as if every machine made the same number of parts.",
              "那是只比较次品率，好像每台机器产量相同。",
            ),
          ]),
          solution: walked(
            [
              [["Find the total", "求总概率"], t(`$P(F) = ${terms} = ${dec(total)}$.`, `$P(F) = ${terms} = ${dec(total)}$。`)],
              [
                ["Divide the path", "路径相除"],
                t(
                  `$P(${name} \\mid F) = \\frac{${dec(pct(m.shares[i]!))} \\cdot ${dec(pct(m.rates[i]!))}}{${dec(total)}} = \\frac{${dec(num)}}{${dec(total)}} = ${value.toLatex()}$.`,
                  `$P(${name} \\mid F) = \\frac{${dec(pct(m.shares[i]!))} \\cdot ${dec(pct(m.rates[i]!))}}{${dec(total)}} = \\frac{${dec(num)}}{${dec(total)}} = ${value.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The paths of all the machines add to $${dec(total)}$, so the posteriors of all the machines add to $1$; this one is $${value.toLatex()}$ of it.`,
              `所有机器的路径之和为 $${dec(total)}$，所以所有机器的后验概率之和为 $1$；这一台占其中的 $${value.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "bayes-theorem-with-urns",
      title: t("Which urn?", "来自哪个盒子"),
      explanation: t(
        "Three boxes are equally likely to be chosen and hold red fractions $\\frac{1}{2}$, $\\frac{1}{4}$, $1$. A red ball is drawn: $P(\\text{box } 3 \\mid R) = \\frac{1}{1/2 + 1/4 + 1} = \\frac{4}{7}$; the common factor $\\frac{1}{3}$ cancels.\n\n> **Watch out.** The fraction of red balls in a box is $P(R \\mid \\text{box})$, not $P(\\text{box} \\mid R)$; and when the boxes are not equally likely, each fraction must be weighted by the chance of its box.",
        "三个盒子被选中的可能性相同，红球比例分别为 $\\frac{1}{2}$、$\\frac{1}{4}$、$1$。摸出红球：$P(\\text{盒 } 3 \\mid R) = \\frac{1}{1/2 + 1/4 + 1} = \\frac{4}{7}$；公因子 $\\frac{1}{3}$ 被约去。\n\n> **注意。** 盒中红球的比例是 $P(R \\mid \\text{盒})$，不是 $P(\\text{盒} \\mid R)$；当各盒被选中的可能性不同时，每个比例都要乘以该盒被选中的概率。",
      ),
      generate(rng) {
        const boxes = range(1, 3).map(() => [rng.int(1, 6), rng.int(1, 6)] as const);
        const die = rng.bool();
        const prior = die ? [Q.of(1, 2), Q.of(1, 3), Q.of(1, 6)] : [Q.of(1, 3), Q.of(1, 3), Q.of(1, 3)];
        const red = boxes.map(([r, b]) => Q.of(r, r + b));
        const total = red.reduce((s, q, i) => s.add(q.mul(prior[i]!)), Q.of(0));
        const i = rng.int(0, 2);
        const path = red[i]!.mul(prior[i]!);
        const value = path.div(total);
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
          mistakes: distinct(value, [
            why(path, `That is the path through box ${i + 1}; divide it by $P(R)$.`, `那是经过盒 ${i + 1} 的路径概率；还要除以 $P(R)$。`),
            why(
              red[i]!,
              `That is $P(R \\mid \\text{box } ${i + 1})$, the conditional probability the other way round.`,
              `那是 $P(R \\mid \\text{盒 } ${i + 1})$，是反方向的条件概率。`,
            ),
            why(
              prior[i]!,
              "That is the chance of the box before the ball is seen; the red ball changes it.",
              "那是看到球之前选中该盒的概率；红球会改变它。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the total", "求总概率"],
                t(
                  `$P(R) = ${red.map((q, j) => `${prior[j]!.toLatex()} \\cdot ${q.toLatex()}`).join(" + ")} = ${total.toLatex()}$.`,
                  `$P(R) = ${red.map((q, j) => `${prior[j]!.toLatex()} \\cdot ${q.toLatex()}`).join(" + ")} = ${total.toLatex()}$。`,
                ),
              ],
              [
                ["Divide the path", "路径相除"],
                t(
                  `$P(\\text{box } ${i + 1} \\mid R) = \\frac{${prior[i]!.toLatex()} \\cdot ${red[i]!.toLatex()}}{${total.toLatex()}} = ${value.toLatex()}$.`,
                  `$P(\\text{盒 } ${i + 1} \\mid R) = \\frac{${prior[i]!.toLatex()} \\cdot ${red[i]!.toLatex()}}{${total.toLatex()}} = ${value.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The three posteriors are $${red.map((q, j) => q.mul(prior[j]!).div(total).toLatex()).join("$, $")}$, and they add to $1$.`,
              `三个后验概率为 $${red.map((q, j) => q.mul(prior[j]!).div(total).toLatex()).join("$、$")}$，之和为 $1$。`,
            ),
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
  intro: t(
    "LEVEL has $5$ letters: two L's, two E's and one V. Arranging $5$ letters gives $5! = 120$ orders, but swapping the two L's or the two E's changes nothing, so there are $\\frac{120}{2! \\cdot 2!} = 30$ arrangements.\n\nCheck: choose $2$ of the $5$ places for the L's in $\\binom{5}{2} = 10$ ways, then $2$ of the other $3$ for the E's in $3$ ways, and the V takes the last place: $10 \\cdot 3 = 30$.\n\nIn this lesson we count arrangements of objects that are not all different by dividing out the orders of the identical ones.",
    "LEVEL 有 $5$ 个字母：两个 L、两个 E 和一个 V。$5$ 个字母有 $5! = 120$ 种顺序，但交换两个 L 或两个 E 不会改变什么，所以共有 $\\frac{120}{2! \\cdot 2!} = 30$ 种排列。\n\n检验：从 $5$ 个位置中选 $2$ 个放 L，有 $\\binom{5}{2} = 10$ 种；再从其余 $3$ 个中选 $2$ 个放 E，有 $3$ 种；V 放在最后一个位置：$10 \\cdot 3 = 30$。\n\n本课我们通过除去相同物体之间的排列数，来计数并非全都不同的物体的排列。",
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
        "ELEVEN has $6$ letters: $3$ E's and one each of L, V and N. Swapping equal letters gives the same word, so there are $\\frac{6!}{3!} = 120$ arrangements. To count those that begin with a given letter, fix one copy in front and arrange the rest the same way.\n\n> **Watch out.** Divide by the factorial of every repeated letter, not only the most frequent one; and after fixing a letter in front, its copies are identical, so do not multiply by their number.",
        "ELEVEN 有 $6$ 个字母：$3$ 个 E 以及 L、V、N 各一个。交换相同的字母得到同一个词，所以共有 $\\frac{6!}{3!} = 120$ 种排列。要数以某个字母开头的排列，就把它的一个拷贝固定在开头，再用同样方法排列其余字母。\n\n> **注意。** 每个重复字母的阶乘都要除，不能只除出现最多的那个；把一个字母固定在开头后，它的各个拷贝是相同的，不要再乘以拷贝的个数。",
      ),
      generate(rng) {
        const word = rng.pick(WORDS);
        const counts = letterCounts(word);
        const first = rng.bool() ? rng.pick([...counts.keys()]) : undefined;
        const cs = [...counts.entries()].map(([c, k]) => (c === first ? k - 1 : k));
        const n = cs.reduce((a, b) => a + b, 0);
        const value = multinomialCount(cs);
        const full = multinomialCount([...counts.values()]);
        const arrange = denomTex(cs) === "1" ? `${n}!` : `\\frac{${n}!}{${denomTex(cs)}}`;
        let left = n;
        const picks = cs
          .filter((c) => c > 0)
          .map((c) => {
            const b = choose(left, c);
            left -= c;
            return b;
          })
          .slice(0, -1);
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
          mistakes: distinct(value, [
            why(
              fact(n),
              "That treats every letter as different; divide by the orders of the repeated letters.",
              "那是把每个字母都当成不同的；要除以重复字母之间的排列数。",
            ),
            why(
              fact(n) / Math.max(...cs.map(fact)),
              "That divides only for the most repeated letter; every repeated letter needs its own factorial.",
              "那是只除了重复最多的字母；每个重复字母都要除以它自己的阶乘。",
            ),
            ...(first
              ? [
                  why(
                    value * (counts.get(first) ?? 1),
                    `That multiplies by the copies of ${first}; they are identical, so the front can be filled in one way.`,
                    `那是乘以了 ${first} 的拷贝数；它们相同，所以开头只有一种填法。`,
                  ),
                  why(
                    full,
                    `That counts all arrangements and ignores the condition that ${first} comes first.`,
                    `那是数了全部排列，忽略了 ${first} 在开头的条件。`,
                  ),
                ]
              : []),
          ]),
          solution: walked(
            [
              ...(first
                ? [
                    [
                      ["Fix the first letter", "固定首字母"],
                      t(`Put one ${first} in front; $${n}$ letters remain.`, `把一个 ${first} 放在开头；剩下 $${n}$ 个字母。`),
                    ] as const,
                  ]
                : []),
              [["Divide out the repeats", "除去重复"], t(`$${arrange} = ${value}$.`, `$${arrange} = ${value}$。`)],
            ],
            first
              ? t(
                  `${word} has $${full}$ arrangements, and a fraction $\\frac{${counts.get(first)}}{${word.length}}$ of them begin with ${first}: $${full} \\cdot \\frac{${counts.get(first)}}{${word.length}} = ${value}$.`,
                  `${word} 共有 $${full}$ 种排列，其中以 ${first} 开头的占 $\\frac{${counts.get(first)}}{${word.length}}$：$${full} \\cdot \\frac{${counts.get(first)}}{${word.length}} = ${value}$。`,
                )
              : t(
                  `Choosing the places of each letter in turn gives $${picks.join(" \\cdot ")} = ${value}$.`,
                  `依次为每个字母选择位置，得 $${picks.join(" \\cdot ")} = ${value}$。`,
                ),
          ),
        });
      },
    },
    {
      id: "arrangements-of-identical-objects",
      title: t("Arranging identical objects", "相同物体的排列"),
      explanation: t(
        "$6$ red and $2$ blue flags fly in a row; flags of one color look alike. There are $\\frac{8!}{6! \\, 2!} = 28$ signals, which is also $\\binom{8}{2}$, the number of ways to choose the places of the blue flags.\n\n> **Watch out.** Divide by the factorial of each color's count, all of them, not just the largest; and the answer is not the product of the counts.",
        "$6$ 面红旗和 $2$ 面蓝旗排成一行，同色旗子看起来相同。共有 $\\frac{8!}{6! \\, 2!} = 28$ 种信号，也就是 $\\binom{8}{2}$，即选出蓝旗位置的方法数。\n\n> **注意。** 每种颜色个数的阶乘都要除，不能只除最大的；答案也不是各个数之积。",
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
        const c1 = choose(n, cs[0]!);
        const c2 = k === 3 ? choose(n - cs[0]!, cs[1]!) : 1;
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
          mistakes: distinct(value, [
            why(
              fact(n),
              "That treats every object as different; objects of one color are identical.",
              "那是把每个物体都当成不同的；同色物体是相同的。",
            ),
            why(
              fact(n) / fact(Math.max(...cs)),
              "That divides only for the largest color; divide by the factorial of every count.",
              "那是只除了最多的颜色；每种颜色个数的阶乘都要除。",
            ),
            why(
              cs.reduce((a, b) => a * b, 1),
              "That multiplies the counts, which does not count orders at all.",
              "那是把各个数相乘，根本没有计数顺序。",
            ),
            why(
              n ** k,
              "That gives each place a free choice of color, ignoring how many of each color there are.",
              "那是让每个位置自由选颜色，忽略了每种颜色的个数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Count the objects", "数物体"],
                t(`There are $${cs.join(" + ")} = ${n}$ objects in all.`, `共有 $${cs.join(" + ")} = ${n}$ 个物体。`),
              ],
              [
                ["Divide out the repeats", "除去重复"],
                t(
                  `$\\frac{${n}!}{${cs.map((c) => `${c}!`).join(" \\, ")}} = ${value}$.`,
                  `$\\frac{${n}!}{${cs.map((c) => `${c}!`).join(" \\, ")}} = ${value}$。`,
                ),
              ],
            ],
            k === 3
              ? t(
                  `Choose the places of the ${colors[0][0]} ones, then of the ${colors[1][0]} ones: $\\binom{${n}}{${cs[0]}}\\binom{${n - cs[0]!}}{${cs[1]}} = ${c1} \\cdot ${c2} = ${value}$.`,
                  `先选${colors[0][1]}色的位置，再选${colors[1][1]}色的位置：$\\binom{${n}}{${cs[0]}}\\binom{${n - cs[0]!}}{${cs[1]}} = ${c1} \\cdot ${c2} = ${value}$。`,
                )
              : t(
                  `Choosing the places of the ${colors[0][0]} ones gives $\\binom{${n}}{${cs[0]}} = ${c1}$, the same count.`,
                  `选出${colors[0][1]}色的位置得 $\\binom{${n}}{${cs[0]}} = ${c1}$，结果相同。`,
                ),
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
  intro: t(
    "A two-letter code uses the $26$ letters A to Z, and a letter may be used twice. The first letter has $26$ choices and so does the second, so there are $26 \\cdot 26 = 26^2 = 676$ codes.\n\nCheck: the codes starting with A are AA to AZ, which is $26$ of them, and there are $26$ possible first letters: $26 \\cdot 26 = 676$.\n\nIn this lesson we count sequences in which symbols may repeat, and use the complement to count those with a repeat.",
    "一个两字母代码使用 A 到 Z 共 $26$ 个字母，字母可以用两次。第一个字母有 $26$ 种选择，第二个也是，所以共有 $26 \\cdot 26 = 26^2 = 676$ 个代码。\n\n检验：以 A 开头的代码从 AA 到 AZ，共 $26$ 个，而首字母有 $26$ 种可能：$26 \\cdot 26 = 676$。\n\n本课我们计数符号可以重复的序列，并用补集计数含有重复的序列。",
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
        "When repeats are allowed, every position has the same number of choices, so the multiplication principle gives that number raised to the length of the sequence. A $4$-digit PIN uses digits $0$–$9$ with repeats allowed: $10^4 = 10000$ PINs. Each position is chosen independently.\n\n> **Watch out.** The number of symbols is the base and the length is the exponent, so $n^k$, not $k^n$; and multiplying $n$ by $k$ adds the choices instead of combining them.",
        "允许重复时，每个位置的选择数都相同，所以由乘法原理，总数是这个选择数的序列长度次幂。$4$ 位 PIN 码使用数字 $0$–$9$，允许重复：共 $10^4 = 10000$ 个。每个位置都独立选择。\n\n> **注意。** 符号个数是底数，长度是指数，所以是 $n^k$ 而不是 $k^n$；把 $n$ 乘以 $k$ 是把选择相加，而不是组合。",
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
          mistakes: distinct(value, [
            why(
              k ** n,
              "That swaps the base and the exponent; the number of choices is raised to the length.",
              "那是把底数与指数对调了；应是选择数的长度次幂。",
            ),
            why(
              n * k,
              "That multiplies the choices by the length; each position multiplies the count by the number of choices.",
              "那是把选择数乘以长度；每个位置都要把总数乘以选择数。",
            ),
            ...(k <= n
              ? [
                  why(
                    fact(n) / fact(n - k),
                    "That forbids repeats; here a symbol may be used again.",
                    "那是不允许重复；这里符号可以再次使用。",
                  ),
                ]
              : []),
            why(
              choose(n + k - 1, k),
              "That ignores the order of the positions; a sequence is ordered.",
              "那是忽略了位置的顺序；序列是有序的。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Count each position", "逐位计数"],
                t(`Each of the $${k}$ positions has $${n}$ options.`, `$${k}$ 个位置中每个都有 $${n}$ 种选择。`),
              ],
              [["Multiply", "相乘"], t(`$${n}^{${k}} = ${value}$.`, `$${n}^{${k}} = ${value}$。`)],
            ],
            t(
              `Sequences one position shorter number $${n}^{${k - 1}} = ${n ** (k - 1)}$, and the last position multiplies them by $${n}$: $${n ** (k - 1)} \\cdot ${n} = ${value}$.`,
              `短一位的序列有 $${n}^{${k - 1}} = ${n ** (k - 1)}$ 个，最后一位再乘以 $${n}$：$${n ** (k - 1)} \\cdot ${n} = ${value}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "sequences-with-a-repeated-symbol",
      title: t("Sequences with a repeat", "含重复符号的序列"),
      explanation: t(
        "Counting sequences with at least one repeat directly is messy, so count those with no repeats and subtract from the total. Of the $26^3 = 17576$ three-letter strings, $26 \\cdot 25 \\cdot 24 = 15600$ have all letters different, so $17576 - 15600 = 1976$ have a repeated letter.\n\n> **Watch out.** The total and the no-repeat count are not the answer on their own; subtract one from the other. Sequences without repeats are ordered, so use $26 \\cdot 25 \\cdot 24$, not a binomial coefficient.",
        "直接数至少有一个重复的序列很麻烦，所以先数没有重复的序列，再从总数中减去。在 $26^3 = 17576$ 个三字母串中，各字母互不相同的有 $26 \\cdot 25 \\cdot 24 = 15600$ 个，所以有重复字母的有 $17576 - 15600 = 1976$ 个。\n\n> **注意。** 总数和无重复的个数本身都不是答案；要相减。无重复的序列是有序的，所以用 $26 \\cdot 25 \\cdot 24$，而不是组合数。",
      ),
      generate(rng) {
        const n = rng.int(4, 10);
        const k = rng.int(2, Math.min(n, 5));
        const all = n ** k;
        const distinctCount = fact(n) / fact(n - k);
        const value = all - distinctCount;
        return numberProblem({
          prompt: t(
            `Sequences of length $${k}$ are formed from $${n}$ symbols, with repeats allowed. How many contain at least one repeated symbol?`,
            `用 $${n}$ 个符号组成长度为 $${k}$ 的序列，允许重复。至少含有一个重复符号的序列有多少个？`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(all, "That is every sequence; subtract those with no repeat.", "那是全部序列；还要减去没有重复的。"),
            why(
              distinctCount,
              "That counts the sequences with no repeat, the complement of the event.",
              "那是没有重复的序列个数，是事件的补集。",
            ),
            why(
              all - choose(n, k),
              "That subtracts a binomial coefficient; sequences without repeats are ordered.",
              "那是减去了组合数；无重复的序列是有序的。",
            ),
          ]),
          solution: walked(
            [
              [["Count all sequences", "数全部序列"], t(`$${n}^{${k}} = ${all}$.`, `$${n}^{${k}} = ${all}$。`)],
              [
                ["Count those with no repeat", "数无重复的"],
                t(
                  `$${range(n - k + 1, n)
                    .reverse()
                    .join(" \\cdot ")} = ${distinctCount}$.`,
                  `$${range(n - k + 1, n)
                    .reverse()
                    .join(" \\cdot ")} = ${distinctCount}$。`,
                ),
              ],
              [["Subtract", "相减"], t(`$${all} - ${distinctCount} = ${value}$.`, `$${all} - ${distinctCount} = ${value}$。`)],
            ],
            t(
              `The two kinds of sequence make up the whole: $${distinctCount} + ${value} = ${all}$.`,
              `两类序列合起来就是全部：$${distinctCount} + ${value} = ${all}$。`,
            ),
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
  intro: t(
    "Choose $2$ pieces of fruit from $4$ kinds, with repeats allowed and order not mattering. Two stars and three bars fill $5$ places, so there are $\\binom{5}{2} = 10$ choices.\n\nCheck: there are $4$ choices of two of the same kind and $\\binom{4}{2} = 6$ of two different kinds, and $4 + 6 = 10$.\n\nIn this lesson we count selections in which items may repeat and order does not matter, using stars for the items and bars between the kinds.",
    "从 $4$ 种水果中选 $2$ 个，允许重复且不计顺序。两颗星和三根隔板占 $5$ 个位置，所以共有 $\\binom{5}{2} = 10$ 种选法。\n\n检验：两个同种的有 $4$ 种，两个不同种的有 $\\binom{4}{2} = 6$ 种，而 $4 + 6 = 10$。\n\n本课我们用星号代表物品、隔板分隔种类，计数可以重复且不计顺序的选取。",
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
        "Choosing items with repetition when order does not matter is the same as arranging stars for items and bars for the dividers between types. Choosing $14$ donuts from $3$ flavors is placing $14$ stars and $2$ bars in a row, like $\\star\\star|\\star\\cdots|\\star$: $\\binom{16}{2} = 120$ ways.\n\n> **Watch out.** $n$ kinds need only $n - 1$ bars, so there are $n + k - 1$ places, not $n + k$; and $n^k$ counts ordered choices, which is too many.",
        "在不计顺序、允许重复的情况下选取物品，等同于用星号代表物品、用竖线代表类别之间的分隔来排列。从 $3$ 种口味中选 $14$ 个甜甜圈，相当于把 $14$ 颗星和 $2$ 根隔板排成一行，如 $\\star\\star|\\star\\cdots|\\star$：共 $\\binom{16}{2} = 120$ 种。\n\n> **注意。** $n$ 种类型只需要 $n - 1$ 根隔板，所以共有 $n + k - 1$ 个位置，不是 $n + k$；$n^k$ 计数的是有序选择，太多了。",
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
          mistakes: distinct(value, [
            ...(k <= n
              ? [why(choose(n, k), "That forbids repeats; a kind may be chosen more than once.", "那是不允许重复；同一种可以选多次。")]
              : []),
            why(n ** k, "That counts ordered choices; the order of the items does not matter.", "那是计数有序选择；物品的顺序无关紧要。"),
            why(
              choose(n + k, k),
              "That uses one bar too many; $n$ kinds need $n - 1$ bars.",
              "那是多用了一根隔板；$n$ 种类型只需 $n - 1$ 根隔板。",
            ),
            why(
              choose(n + k - 1, k - 1),
              "That chooses places for $k - 1$ stars; there are $k$ items.",
              "那是为 $k - 1$ 颗星选位置；共有 $k$ 个物品。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Set up stars and bars", "设星与隔板"],
                t(
                  `$${k}$ stars and $${n - 1}$ bars fill $${n + k - 1}$ places.`,
                  `$${k}$ 颗星和 $${n - 1}$ 根隔板占 $${n + k - 1}$ 个位置。`,
                ),
              ],
              [
                ["Choose the star places", "选星的位置"],
                t(`$\\binom{${n + k - 1}}{${k}} = ${value}$.`, `$\\binom{${n + k - 1}}{${k}} = ${value}$。`),
              ],
            ],
            t(
              `Choosing the places of the bars instead gives $\\binom{${n + k - 1}}{${n - 1}} = ${choose(n + k - 1, n - 1)}$, the same number.`,
              `改为选隔板的位置得 $\\binom{${n + k - 1}}{${n - 1}} = ${choose(n + k - 1, n - 1)}$，结果相同。`,
            ),
          ),
        });
      },
    },
    {
      id: "combinations-with-at-least-one-of-each",
      title: t("At least one of each type", "每种至少一个"),
      explanation: t(
        "To buy $13$ muffins from $4$ kinds with at least one of each, first take one of each, then choose the other $9$ freely: $\\binom{9 + 3}{3} = \\binom{12}{3} = 220$.\n\n> **Watch out.** Take one of each kind before counting, so only $k - n$ items are free; counting all $k$ freely allows a kind to be missing.",
        "从 $4$ 种松饼中买 $13$ 个且每种至少一个：先每种取一个，再自由选其余 $9$ 个：$\\binom{9 + 3}{3} = \\binom{12}{3} = 220$。\n\n> **注意。** 计数前先每种取一个，所以只有 $k - n$ 个是自由的；让全部 $k$ 个自由选取会允许某种类型缺失。",
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
          mistakes: distinct(value, [
            why(
              choose(n + k - 1, k),
              "That lets all the muffins be chosen freely, so a kind could be missing.",
              "那是让所有松饼自由选取，于是某种可能缺失。",
            ),
            why(
              choose(k, n),
              "That chooses $n$ of the $k$ muffins; the muffins of one kind are identical.",
              "那是从 $k$ 个松饼中选 $n$ 个；同种松饼是相同的。",
            ),
            why(
              choose(k - n, n - 1),
              "That counts the free muffins but forgets the places of the bars among them.",
              "那是只数了自由的松饼，忘了隔板也占位置。",
            ),
            why(choose(k - 1, n), "That uses $n$ bars; $n$ kinds need $n - 1$ bars.", "那是用了 $n$ 根隔板；$n$ 种类型只需 $n - 1$ 根。"),
          ]),
          solution: walked(
            [
              [
                ["Take one of each", "每种先取一个"],
                t(`That uses $${n}$ muffins and leaves $${k - n}$ free.`, `这用掉 $${n}$ 个，剩下 $${k - n}$ 个自由选取。`),
              ],
              [
                ["Use stars and bars", "用隔板法"],
                t(
                  `$\\binom{${k - n} + ${n - 1}}{${n - 1}} = \\binom{${k - 1}}{${n - 1}} = ${value}$.`,
                  `$\\binom{${k - n} + ${n - 1}}{${n - 1}} = \\binom{${k - 1}}{${n - 1}} = ${value}$。`,
                ),
              ],
            ],
            t(
              `Equivalently, place $${n - 1}$ bars in the $${k - 1}$ gaps between $${k}$ muffins in a row, no two in one gap: $\\binom{${k - 1}}{${n - 1}} = ${value}$.`,
              `等价地，在排成一行的 $${k}$ 个松饼之间的 $${k - 1}$ 个空隙中放 $${n - 1}$ 根隔板，每个空隙至多一根：$\\binom{${k - 1}}{${n - 1}} = ${value}$。`,
            ),
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
  intro: t(
    "In a class, $18$ students like maths, $15$ like art and $7$ like both. Adding $18 + 15$ counts the $7$ twice, so $18 + 15 - 7 = 26$ like at least one.\n\nCheck: $18 - 7 = 11$ like only maths and $15 - 7 = 8$ only art, and $11 + 8 + 7 = 26$.\n\nIn this lesson we count unions of two or three sets by adding the sets, subtracting the overlaps and adding back what was removed too often.",
    "某班有 $18$ 名学生喜欢数学，$15$ 名喜欢美术，$7$ 名两者都喜欢。$18 + 15$ 把这 $7$ 人数了两次，所以至少喜欢一门的有 $18 + 15 - 7 = 26$ 人。\n\n检验：只喜欢数学的有 $18 - 7 = 11$ 人，只喜欢美术的有 $15 - 7 = 8$ 人，而 $11 + 8 + 7 = 26$。\n\n本课我们计数两个或三个集合的并集：把各集合相加，减去重叠部分，再加回被多减的部分。",
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
        "In a club, $20$ play football, $18$ basketball and $15$ tennis; $10$ play football and basketball, $9$ football and tennis, $8$ basketball and tennis, and $7$ all three. Then $20 + 18 + 15 - 10 - 9 - 8 + 7 = 33$ play at least one: the pairs remove the triple overlap three times after the singles added it three times, so it is added back once.\n\n> **Watch out.** After subtracting the pairs, add the triple intersection back, do not subtract it; and when the question asks for none of the three, subtract the union from the total.",
        "某俱乐部 $20$ 人踢足球，$18$ 人打篮球，$15$ 人打网球；$10$ 人足球和篮球，$9$ 人足球和网球，$8$ 人篮球和网球，$7$ 人三项都参加。则至少参加一项的有 $20 + 18 + 15 - 10 - 9 - 8 + 7 = 33$ 人：单个集合把三项都参加的人加了三次，两两交集又减了三次，所以要再加回一次。\n\n> **注意。** 减去两两交集后，要把三个集合的交集加回来，不是减去；问三项都不参加的人数时，要用总数减去并集。",
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
        const regions = [a, b, c, ab, ac, bc, abc];
        return numberProblem({
          prompt: none
            ? t(`${pre.en} How many chose none of the three?`, `${pre["zh-CN"]}三项都没选的有多少人？`)
            : t(`${pre.en} How many chose at least one of the three?`, `${pre["zh-CN"]}至少选了一项的有多少人？`),
          answer: value,
          mistakes: distinct(
            value,
            none
              ? [
                  why(
                    total - (A + B + C),
                    "That subtracts the three sets without removing their overlaps, so shared people are taken away more than once.",
                    "那是直接减去三个集合，没有处理重叠，共同的人被减了不止一次。",
                  ),
                  why(
                    total - (union - abc),
                    "That forgets to add back the people who chose all three before taking the complement.",
                    "那是求补集前忘了加回三项都选的人。",
                  ),
                  why(
                    union,
                    "That counts those who chose at least one; the question asks for the rest.",
                    "那是至少选一项的人数；题目问的是其余的人。",
                  ),
                ]
              : [
                  why(
                    A + B + C,
                    "That adds the three sets and never removes the people counted twice.",
                    "那是把三个集合相加，没有去掉被重复计数的人。",
                  ),
                  why(
                    union - abc,
                    "That subtracts the pairs but forgets to add back those who chose all three.",
                    "那是减去了两两交集，却忘了加回三项都选的人。",
                  ),
                  why(
                    union - 2 * abc,
                    "That subtracts the triple intersection at the end; it must be added back.",
                    "那是最后减去了三个集合的交集；它应该加回来。",
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Add the sets, subtract the pairs, add the triple", "加集合、减两两交集、加三重交集"],
                t(
                  `$${A} + ${B} + ${C} - ${AB} - ${AC} - ${BC} + ${abc} = ${union}$.`,
                  `$${A} + ${B} + ${C} - ${AB} - ${AC} - ${BC} + ${abc} = ${union}$。`,
                ),
              ],
              ...(none
                ? [
                    [
                      ["Take the complement", "取补集"],
                      t(`$${total} - ${union} = ${value}$ chose none.`, `三项都没选的有 $${total} - ${union} = ${value}$ 人。`),
                    ] as const,
                  ]
                : []),
            ],
            t(
              `Filling the Venn diagram from the centre out, the seven regions hold $${regions.join(", ")}$ people, and $${regions.join(" + ")} = ${union}$.`,
              `从中心向外填写韦恩图，七个区域分别有 $${regions.join(", ")}$ 人，而 $${regions.join(" + ")} = ${union}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "counting-multiples-by-inclusion-exclusion",
      title: t("Counting multiples", "计数倍数"),
      explanation: t(
        "To count the numbers divisible by at least one of several divisors, add the counts for each divisor and subtract the overlaps that were counted twice. Of $1, \\dots, 1000$, the multiples of $3$ or $5$ number $333 + 200 - 66 = 467$: the multiples of $15$ were counted twice. There are $\\lfloor 1000/3 \\rfloor = 333$ multiples of $3$, rounding down.\n\n> **Watch out.** Subtract each overlap once, not twice; with three divisors, add back the multiples of all three after subtracting the pairs.",
        "要数出至少能被几个除数中的一个整除的数，先把各除数的个数相加，再减去被数了两次的重叠部分。在 $1, \\dots, 1000$ 中，$3$ 或 $5$ 的倍数有 $333 + 200 - 66 = 467$ 个：$15$ 的倍数被数了两次。$3$ 的倍数有 $\\lfloor 1000/3 \\rfloor = 333$ 个，向下取整。\n\n> **注意。** 每个重叠部分只减一次，不要减两次；有三个除数时，减去两两重叠后还要加回三者公倍数。",
      ),
      generate(rng) {
        const ds = rng.sample([2, 3, 5, 7], rng.int(2, 3)).sort((a, b) => a - b);
        const N = 10 * rng.int(5, 60);
        const masks = range(1, 2 ** ds.length - 1);
        const subsets = masks.map((mask) => ds.filter((_, i) => (mask >> i) & 1));
        const term = (s: readonly number[]) => Math.floor(N / s.reduce((a, b) => a * b, 1));
        const union = subsets.reduce((sum, s) => sum + (s.length % 2 === 1 ? 1 : -1) * term(s), 0);
        const none = rng.bool();
        const value = none ? N - union : union;
        const list = ds.join(", ");
        const singles = ds.map((d) => term([d])).reduce((a, b) => a + b, 0);
        const all = term(ds);
        const steps = subsets
          .map((s) => `${s.length % 2 === 1 ? "+" : "-"} ${term(s)}`)
          .join(" ")
          .replace(/^\+ /, "");
        const exact = masks.map((m) =>
          masks
            .filter((m2) => (m2 & m) === m)
            .reduce((s, m2) => {
              const sub = ds.filter((_, i) => (m2 >> i) & 1);
              const extra = sub.length - ds.filter((_, i) => (m >> i) & 1).length;
              return s + (extra % 2 === 0 ? 1 : -1) * term(sub);
            }, 0),
        );
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
          mistakes: distinct(
            value,
            none
              ? [
                  why(
                    N - singles,
                    "That subtracts the multiples of each divisor without adding back the overlaps, so some numbers are removed twice.",
                    "那是减去了每个除数的倍数，却没有加回重叠部分，有些数被减了两次。",
                  ),
                  why(
                    union,
                    "That counts the numbers divisible by at least one; the question asks for the rest.",
                    "那是至少被一个整除的个数；题目问的是其余的数。",
                  ),
                  ...(ds.length === 3
                    ? [
                        why(
                          N - (union - all),
                          "That forgets to add back the multiples of all three before taking the complement.",
                          "那是求补集前忘了加回三者的公倍数。",
                        ),
                      ]
                    : []),
                ]
              : [
                  why(
                    singles,
                    "That adds the counts for each divisor and never removes the numbers counted twice.",
                    "那是把各除数的个数相加，没有去掉被重复计数的数。",
                  ),
                  ...(ds.length === 3
                    ? [
                        why(
                          union - all,
                          "That subtracts the pairs but forgets to add back the multiples of all three.",
                          "那是减去了两两重叠，却忘了加回三者的公倍数。",
                        ),
                        why(
                          union - 2 * all,
                          "That subtracts the multiples of all three at the end; they must be added back.",
                          "那是最后减去了三者的公倍数；它们应该加回来。",
                        ),
                      ]
                    : [
                        why(
                          singles - 2 * all,
                          "That subtracts the overlap twice; it was counted twice, so remove it once.",
                          "那是把重叠部分减了两次；它被数了两次，只需减一次。",
                        ),
                      ]),
                ],
          ),
          solution: walked(
            [
              [
                ["Count the multiples", "数倍数"],
                t(
                  `Each count is $\\lfloor ${N} / d \\rfloor$ for the product $d$ of the divisors involved, and inclusion-exclusion gives $${steps} = ${union}$.`,
                  `每个计数是 $\\lfloor ${N} / d \\rfloor$，其中 $d$ 为所涉及除数之积，由容斥原理得 $${steps} = ${union}$。`,
                ),
              ],
              ...(none
                ? [[["Take the complement", "取补集"], t(`$${N} - ${union} = ${value}$.`, `$${N} - ${union} = ${value}$。`)] as const]
                : []),
            ],
            t(
              `Sorting the numbers by exactly which of the divisors divide them gives $${exact.join(" + ")} = ${union}$ divisible by at least one${none ? `, and $${union} + ${value} = ${N}$` : ""}.`,
              `按恰好被哪些除数整除来分类，得至少被一个整除的有 $${exact.join(" + ")} = ${union}$ 个${none ? `，而 $${union} + ${value} = ${N}$` : ""}。`,
            ),
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
  intro: t(
    "The equation $a + b + c = 13$ in nonnegative integers is $13$ stars split by $2$ bars, so it has $\\binom{15}{2} = 105$ solutions.\n\nCheck: for $a = 0, 1, \\dots, 13$ the pair $b, c$ has $14, 13, \\dots, 1$ choices, and $1 + 2 + \\cdots + 14 = 105$.\n\nIn this lesson we count solutions of such equations when the variables have lower or upper bounds.",
    "方程 $a + b + c = 13$ 的非负整数解相当于用 $2$ 根隔板分开 $13$ 颗星，所以共有 $\\binom{15}{2} = 105$ 组解。\n\n检验：$a = 0, 1, \\dots, 13$ 时，$b, c$ 分别有 $14, 13, \\dots, 1$ 种选择，而 $1 + 2 + \\cdots + 14 = 105$。\n\n本课我们计数变量有下界或上界时这类方程的解。",
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
        "When some variables must be at least a given number, subtract that number from them first, which turns the problem into one where every variable is simply nonnegative. For $x + y + z = 20$ with $x \\ge 5$, $y \\ge 4$, $z \\ge 0$, put $x' = x - 5$, $y' = y - 4$: then $x' + y' + z = 11$ with all variables $\\ge 0$, which has $\\binom{13}{2} = 78$ solutions.\n\n> **Watch out.** $k$ variables need $k - 1$ bars, so the lower number is $k - 1$, not $k$; and a bound of $\\ge 0$ removes nothing, while $\\ge 1$ removes one.",
        "当某些变量至少为某个数时，先从这些变量中减去这个数，问题就变成每个变量只需非负的情形。对 $x + y + z = 20$，$x \\ge 5$，$y \\ge 4$，$z \\ge 0$，令 $x' = x - 5$，$y' = y - 4$：则 $x' + y' + z = 11$，各变量 $\\ge 0$，共有 $\\binom{13}{2} = 78$ 组解。\n\n> **注意。** $k$ 个变量需要 $k - 1$ 根隔板，所以组合数下面是 $k - 1$，不是 $k$；下界 $\\ge 0$ 不用减，而 $\\ge 1$ 要减去一。",
      ),
      generate(rng) {
        const k = rng.int(3, 5);
        const lows = range(1, k).map(() => rng.int(0, 3));
        const n = lows.reduce((a, b) => a + b, 0) + rng.int(2, 12);
        const used = lows.reduce((a, b) => a + b, 0);
        const m = n - used;
        const value = choose(m + k - 1, k - 1);
        const vars = range(1, k).map((i) => `x_{${i}}`);
        const conds = vars.map((v, i) => `${v} \\ge ${lows[i]}`).join(", ");
        const nz = lows.filter((l) => l > 0);
        const usedTex = nz.length > 1 ? `${nz.join(" + ")} = ${used}` : `${used}`;
        return numberProblem({
          prompt: t(
            `How many integer solutions does $${vars.join(" + ")} = ${n}$ have with $${conds}$?`,
            `方程 $${vars.join(" + ")} = ${n}$ 在 $${conds}$ 下有多少组整数解？`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              choose(n + k - 1, k - 1),
              "That ignores the lower bounds and counts every nonnegative solution.",
              "那是忽略了下界，数了全部非负解。",
            ),
            why(
              choose(m + k - 1, k),
              "That puts $k$ at the bottom; $k$ variables need only $k - 1$ bars.",
              "那是组合数下面用了 $k$；$k$ 个变量只需 $k - 1$ 根隔板。",
            ),
            why(
              choose(m - 1, k - 1),
              "That counts positive solutions, as if every variable also had to be at least one more.",
              "那是数了正整数解，好像每个变量还要再多至少一。",
            ),
            why(
              choose(m + k, k - 1),
              "That uses one place too many; $m$ stars and $k - 1$ bars fill $m + k - 1$ places.",
              "那是多用了一个位置；$m$ 颗星和 $k - 1$ 根隔板占 $m + k - 1$ 个位置。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Hand out the lower bounds", "分出下界"],
                used === 0
                  ? t(`Every bound is $0$, so the whole $${n}$ is shared freely.`, `每个下界都是 $0$，所以全部 $${n}$ 自由分配。`)
                  : t(
                      `The bounds use $${usedTex}$, leaving $${n} - ${used} = ${m}$.`,
                      `下界用去 $${usedTex}$，剩下 $${n} - ${used} = ${m}$。`,
                    ),
              ],
              [
                ["Use stars and bars", "用隔板法"],
                t(
                  `$${m}$ stars and $${k - 1}$ bars: $\\binom{${m + k - 1}}{${k - 1}} = ${value}$.`,
                  `$${m}$ 颗星和 $${k - 1}$ 根隔板：$\\binom{${m + k - 1}}{${k - 1}} = ${value}$。`,
                ),
              ],
            ],
            t(
              `Choosing the places of the $${m}$ stars instead gives $\\binom{${m + k - 1}}{${m}} = ${choose(m + k - 1, m)}$, the same number.`,
              `改为选 $${m}$ 颗星的位置得 $\\binom{${m + k - 1}}{${m}} = ${choose(m + k - 1, m)}$，结果相同。`,
            ),
          ),
        });
      },
    },
    {
      id: "solutions-with-an-upper-bound",
      title: t("An upper bound", "上界"),
      explanation: t(
        "An upper bound is handled by counting all solutions and then subtracting the solutions that break the bound, which have a lower bound instead. For $x + y + z = 20$ in nonnegative integers with $x \\le 5$: all solutions number $\\binom{22}{2} = 231$; those with $x \\ge 6$ number $\\binom{16}{2} = 120$. So $231 - 120 = 111$.\n\n> **Watch out.** The solutions that break $x \\le 5$ have $x \\ge 6$, not $x \\ge 5$, since $x = 5$ is allowed; and the count of those bad solutions is subtracted, not given as the answer.",
        "处理上界时，先数出所有解，再减去超出上界的解，而这些解满足的是一个下界条件。对非负整数 $x + y + z = 20$ 且 $x \\le 5$：全部解有 $\\binom{22}{2} = 231$ 组；$x \\ge 6$ 的有 $\\binom{16}{2} = 120$ 组。所以 $231 - 120 = 111$。\n\n> **注意。** 违反 $x \\le 5$ 的解满足 $x \\ge 6$，而不是 $x \\ge 5$，因为 $x = 5$ 是允许的；这些坏解的个数要减去，而不是作为答案。",
      ),
      generate(rng) {
        const k = rng.int(3, 4);
        const n = rng.int(6, 15);
        const u = rng.int(1, n - 2);
        const all = choose(n + k - 1, k - 1);
        const bad = choose(n - u - 1 + k - 1, k - 1);
        const value = all - bad;
        const vars = range(1, k).map((i) => `x_{${i}}`);
        const terms = range(0, u).map((x) => choose(n - x + k - 2, k - 2));
        return numberProblem({
          prompt: t(
            `How many solutions in nonnegative integers does $${vars.join(" + ")} = ${n}$ have with $x_1 \\le ${u}$?`,
            `方程 $${vars.join(" + ")} = ${n}$ 在 $x_1 \\le ${u}$ 下有多少组非负整数解？`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(all, "That ignores the upper bound; subtract the solutions that break it.", "那是忽略了上界；还要减去违反它的解。"),
            why(
              bad,
              "That is the number of solutions that break the bound, not those that keep it.",
              "那是违反上界的解的个数，不是满足它的。",
            ),
            why(
              all - choose(n - u + k - 1, k - 1),
              `That removes the solutions with $x_1 \\ge ${u}$, but $x_1 = ${u}$ is allowed.`,
              `那是去掉了 $x_1 \\ge ${u}$ 的解，但 $x_1 = ${u}$ 是允许的。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Count all solutions", "数全部解"],
                t(`$\\binom{${n + k - 1}}{${k - 1}} = ${all}$.`, `$\\binom{${n + k - 1}}{${k - 1}} = ${all}$。`),
              ],
              [
                ["Count the bad ones", "数坏解"],
                t(
                  `Those with $x_1 \\ge ${u + 1}$: put $x_1' = x_1 - ${u + 1}$, so the sum is $${n - u - 1}$ and there are $\\binom{${n - u - 1 + k - 1}}{${k - 1}} = ${bad}$.`,
                  `$x_1 \\ge ${u + 1}$ 的解：令 $x_1' = x_1 - ${u + 1}$，和变为 $${n - u - 1}$，共 $\\binom{${n - u - 1 + k - 1}}{${k - 1}} = ${bad}$ 组。`,
                ),
              ],
              [["Subtract", "相减"], t(`$${all} - ${bad} = ${value}$.`, `$${all} - ${bad} = ${value}$。`)],
            ],
            t(
              `Summing over $x_1 = 0, \\dots, ${u}$, the other variables share the rest in $${terms.join(" + ")} = ${value}$ ways.`,
              `对 $x_1 = 0, \\dots, ${u}$ 求和，其余变量分配剩下的部分，共 $${terms.join(" + ")} = ${value}$ 种。`,
            ),
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
  intro: t(
    "The partitions of $3$ are $3$, $2 + 1$ and $1 + 1 + 1$, so $p(3) = 3$. The sum $1 + 2$ is the same partition as $2 + 1$, because order is ignored.\n\nCheck: the ordered sums of $3$ are $3$, $2 + 1$, $1 + 2$ and $1 + 1 + 1$, four of them, and merging $2 + 1$ with $1 + 2$ leaves $3$.\n\nIn this lesson we list and count partitions, with or without conditions on the parts, and count partitions into a given number of parts.",
    "$3$ 的分拆有 $3$、$2 + 1$ 和 $1 + 1 + 1$，所以 $p(3) = 3$。$1 + 2$ 与 $2 + 1$ 是同一个分拆，因为不计顺序。\n\n检验：$3$ 的有序和是 $3$、$2 + 1$、$1 + 2$ 和 $1 + 1 + 1$，共四个，把 $2 + 1$ 与 $1 + 2$ 合并后剩下 $3$ 个。\n\n本课我们列出并计数分拆，包括对各部分有条件的分拆，并计数分成给定个数部分的分拆。",
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
        "List the parts of each partition in decreasing order and group the partitions by their largest part, so that nothing is counted twice or missed. The partitions of $7$ whose largest part is $3$ are $3 + 3 + 1$, $3 + 2 + 2$, $3 + 2 + 1 + 1$ and $3 + 1 + 1 + 1 + 1$: four of them. A condition such as distinct parts or odd parts just strikes out the partitions that fail it.\n\n> **Watch out.** $4 + 1$ and $1 + 4$ are one partition, so $2^{n-1}$, which counts ordered sums, is far too many; and the one-part partition $n$ itself counts too.",
        "把每个分拆的各部分按从大到小排列，并按最大部分分组，就不会重复或遗漏。$7$ 的分拆中最大部分为 $3$ 的有 $3 + 3 + 1$、$3 + 2 + 2$、$3 + 2 + 1 + 1$ 和 $3 + 1 + 1 + 1 + 1$：共四个。像各部分互不相同或都是奇数这样的条件，只是划掉不满足它的分拆。\n\n> **注意。** $4 + 1$ 和 $1 + 4$ 是同一个分拆，所以计数有序和的 $2^{n-1}$ 太多了；只有一个部分的分拆 $n$ 本身也要算。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const n = kind === 0 ? rng.int(4, 12) : rng.int(5, 14);
        const all = partitionsOf(n);
        const sel =
          kind === 0 ? all : kind === 1 ? all.filter((p) => new Set(p).size === p.length) : all.filter((p) => p.every((x) => x % 2 === 1));
        const value = sel.length;
        const list = sel.length <= 12 ? sel.map((p) => p.join(" + ")).join(",\\ ") : undefined;
        const byLargest = range(1, n)
          .reverse()
          .map((j) => sel.filter((p) => p[0] === j).length)
          .filter((c) => c > 0);
        const what = [
          t("partitions", "分拆"),
          t("partitions into distinct parts", "各部分互不相同的分拆"),
          t("partitions into odd parts", "各部分都是奇数的分拆"),
        ][kind]!;
        const distinctCount = all.filter((p) => new Set(p).size === p.length).length;
        const oddCount = all.filter((p) => p.every((x) => x % 2 === 1)).length;
        const byParts = range(1, n)
          .map((k) => all.filter((p) => p.length === k).length)
          .filter((c) => c > 0);
        return numberProblem({
          prompt: t(`How many ${what.en} does $${n}$ have?`, `$${n}$ 有多少个${what["zh-CN"]}？`),
          answer: value,
          mistakes: distinct(value, [
            ...(kind === 0
              ? []
              : [
                  why(
                    all.length,
                    "That counts every partition and ignores the condition on the parts.",
                    "那是数了全部分拆，忽略了对各部分的条件。",
                  ),
                ]),
            why(
              2 ** (n - 1),
              "That counts ordered sums; a partition ignores the order of its parts.",
              "那是数了有序和；分拆不计各部分的顺序。",
            ),
            ...(kind !== 2 || n % 2 === 1
              ? [why(value - 1, `That leaves out the one-part partition $${n}$ itself.`, `那是漏掉了只有一个部分的分拆 $${n}$ 本身。`)]
              : []),
          ]),
          solution: walked(
            [
              list
                ? [["List them", "列出它们"], t(`By largest part, in decreasing order: $${list}$.`, `按最大部分从大到小：$${list}$。`)]
                : [
                    ["Group by largest part", "按最大部分分组"],
                    t(
                      `From the largest part down, the groups hold $${byLargest.join(", ")}$.`,
                      `从最大部分往下，各组分别有 $${byLargest.join(", ")}$ 个。`,
                    ),
                  ],
              [
                ["Count", "计数"],
                list
                  ? t(`There are $${value}$ in all.`, `共有 $${value}$ 个。`)
                  : t(`$${byLargest.join(" + ")} = ${value}$.`, `$${byLargest.join(" + ")} = ${value}$。`),
              ],
            ],
            kind === 0
              ? t(
                  `Grouping instead by the number of parts gives $${byParts.join(" + ")} = ${value}$.`,
                  `改为按部分的个数分组，得 $${byParts.join(" + ")} = ${value}$。`,
                )
              : t(
                  `By Euler's theorem the partitions of $${n}$ into distinct parts and into odd parts are equally many: $${distinctCount}$ and $${oddCount}$.`,
                  `由欧拉定理，$${n}$ 分成互不相同部分与分成奇数部分的分拆个数相等：$${distinctCount}$ 与 $${oddCount}$。`,
                ),
          ),
        });
      },
    },
    {
      id: "partitions-into-k-parts",
      title: t("Partitions into k parts", "分成 k 部分"),
      explanation: t(
        "Partitions with exactly $k$ parts either contain a part equal to one or, after subtracting one from every part, become partitions of a smaller number. Partitions of $9$ into exactly $5$ parts: $5 + 1 + 1 + 1 + 1$, $4 + 2 + 1 + 1 + 1$, $3 + 3 + 1 + 1 + 1$, $3 + 2 + 2 + 1 + 1$, $2 + 2 + 2 + 2 + 1$, so $p(9, 5) = 5$. By the recurrence, $p(8, 4) + p(4, 5) = 5 + 0 = 5$.\n\n> **Watch out.** $\\binom{n-1}{k-1}$ counts ordered sums, not partitions; and exactly $k$ parts excludes partitions with fewer parts.",
        "恰有 $k$ 个部分的划分，要么含有等于 1 的部分，要么在每个部分都减去 1 之后变成一个更小的数的划分。把 $9$ 分成恰好 $5$ 部分：$5 + 1 + 1 + 1 + 1$、$4 + 2 + 1 + 1 + 1$、$3 + 3 + 1 + 1 + 1$、$3 + 2 + 2 + 1 + 1$、$2 + 2 + 2 + 2 + 1$，所以 $p(9, 5) = 5$。由递推式，$p(8, 4) + p(4, 5) = 5 + 0 = 5$。\n\n> **注意。** $\\binom{n-1}{k-1}$ 计数的是有序和，不是分拆；恰好 $k$ 部分不包括部分更少的分拆。",
      ),
      generate(rng) {
        const k = rng.int(2, 4);
        const n = rng.int(k + 2, 13);
        const sel = partitionsOf(n).filter((p) => p.length === k);
        const value = sel.length;
        const list = sel.length <= 10 ? sel.map((p) => p.join(" + ")).join(",\\ ") : undefined;
        const withOne = partitionsOf(n - 1).filter((p) => p.length === k - 1).length;
        const noOne = partitionsOf(n - k).filter((p) => p.length === k).length;
        const byLargest = range(1, n)
          .reverse()
          .map((j) => sel.filter((p) => p[0] === j).length)
          .filter((c) => c > 0);
        return numberProblem({
          prompt: t(
            `In how many ways can $${n}$ be written as a sum of exactly $${k}$ positive integers, if order does not matter?`,
            `若不计顺序，把 $${n}$ 写成恰好 $${k}$ 个正整数之和有多少种方法？`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              choose(n - 1, k - 1),
              "That counts ordered sums; the order of the parts does not matter.",
              "那是数了有序和；各部分的顺序无关紧要。",
            ),
            why(
              partitionsOf(n).filter((p) => p.length <= k).length,
              `That counts partitions with at most $${k}$ parts; exactly $${k}$ are needed.`,
              `那是数了至多 $${k}$ 部分的分拆；要求恰好 $${k}$ 部分。`,
            ),
            why(
              withOne,
              "That keeps only the partitions with a part equal to one; those with every part at least two count too.",
              "那是只保留了含有部分为一的分拆；每部分至少为二的也要算。",
            ),
          ]),
          solution: walked(
            [
              list
                ? [["List them", "列出它们"], t(`In decreasing order: $${list}$.`, `按从大到小：$${list}$。`)]
                : [
                    ["Group by largest part", "按最大部分分组"],
                    t(
                      `From the largest part down, the groups hold $${byLargest.join(", ")}$.`,
                      `从最大部分往下，各组分别有 $${byLargest.join(", ")}$ 个。`,
                    ),
                  ],
              [
                ["Count", "计数"],
                list
                  ? t(`That is $${value}$ partitions.`, `共 $${value}$ 个分拆。`)
                  : t(`$${byLargest.join(" + ")} = ${value}$.`, `$${byLargest.join(" + ")} = ${value}$。`),
              ],
            ],
            t(
              `By $p(n, k) = p(n - 1, k - 1) + p(n - k, k)$: $p(${n}, ${k}) = ${withOne} + ${noOne} = ${value}$.`,
              `由 $p(n, k) = p(n - 1, k - 1) + p(n - k, k)$：$p(${n}, ${k}) = ${withOne} + ${noOne} = ${value}$。`,
            ),
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
  intro: t(
    "A year has at most $366$ possible birthdays, so among $367$ people two must share a birthday: if all were different there would be $367$ different days.\n\nCheck: $366$ people are not enough, since each could have a different day of the year.\n\nIn this lesson we find how many objects guarantee a crowded box, and the most that some box must hold.",
    "一年至多有 $366$ 个可能的生日，所以 $367$ 个人中必有两人生日相同：如果全都不同，就需要 $367$ 个不同的日子。\n\n检验：$366$ 个人不够，因为每人可以是一年中不同的一天。\n\n本课我们求多少个物体能保证某个盒子拥挤，以及某个盒子至少必须装多少。",
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
        "With $4$ suits, $4 \\cdot 9 = 36$ cards can hold only $9$ of each suit, but a $37$th card makes $10$ of some suit. So $37$ cards guarantee $10$ of one suit.\n\n> **Watch out.** $m(k - 1)$ is the most that can still avoid $k$ alike, so one more is needed; and $mk$ is more than needed, because only one box has to reach $k$.",
        "共有 $4$ 种花色，$4 \\cdot 9 = 36$ 张牌可能每种花色只有 $9$ 张，但第 $37$ 张牌会使某花色有 $10$ 张。所以 $37$ 张牌能保证某花色有 $10$ 张。\n\n> **注意。** $m(k - 1)$ 是仍能避免 $k$ 个同类的最大数，所以还要再多一个；$mk$ 比需要的多，因为只要一个盒子达到 $k$ 即可。",
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
          mistakes: distinct(value, [
            why(
              m * (k - 1),
              `That many can still have only $${k - 1}$ in each category; one more is needed.`,
              `这么多仍可能每类只有 $${k - 1}$ 个；还需要再多一个。`,
            ),
            why(
              m * k,
              `That fills every category with $${k}$; only one category has to reach $${k}$.`,
              `那是让每一类都有 $${k}$ 个；只要一类达到 $${k}$ 即可。`,
            ),
            why(m * k + 1, `That guarantees $${k + 1}$ alike, more than asked.`, `那能保证 $${k + 1}$ 个同类，超过了要求。`),
            why(
              m + k,
              "That adds the number of categories to the target; the worst case has $k - 1$ in every category.",
              "那是把类别数与目标相加；最坏情况是每一类都有 $k - 1$ 个。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Take the worst case", "考虑最坏情况"],
                k === 2
                  ? t(`With $${m}$ categories, $${m}$ can have only one of each.`, `共有 $${m}$ 类，$${m}$ 个可能每类只有一个。`)
                  : t(
                      `With $${m}$ categories, $${m} \\cdot ${k - 1} = ${m * (k - 1)}$ can have only $${k - 1}$ of each.`,
                      `共有 $${m}$ 类，$${m} \\cdot ${k - 1} = ${m * (k - 1)}$ 个可能每类只有 $${k - 1}$ 个。`,
                    ),
              ],
              [
                ["Add one", "再加一个"],
                t(
                  `The next one forces $${k}$ alike: $${m * (k - 1)} + 1 = ${value}$.`,
                  `下一个必然使某类有 $${k}$ 个：$${m * (k - 1)} + 1 = ${value}$。`,
                ),
              ],
            ],
            t(
              `By the generalized principle, $${value}$ objects in $${m}$ categories put at least $\\lceil ${value}/${m} \\rceil = ${k}$ in one.`,
              `由推广的鸽巢原理，$${value}$ 个物体放入 $${m}$ 类，某一类至少有 $\\lceil ${value}/${m} \\rceil = ${k}$ 个。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-generalized-pigeonhole-principle",
      title: t("The guaranteed minimum", "保证的最小值"),
      explanation: t(
        "If $250$ letters go into $20$ mailboxes, some mailbox gets at least $\\lceil 250/20 \\rceil = 13$ letters: with at most $12$ each, the boxes hold at most $240$. Ten boxes with $13$ and ten with $12$ show that $13$ is the most that can be guaranteed.\n\n> **Watch out.** Round $N/m$ up, not down, when it is not a whole number; and $N - m + 1$ is the most one box could hold, not the least that some box must hold.",
        "把 $250$ 封信放进 $20$ 个信箱，某个信箱至少有 $\\lceil 250/20 \\rceil = 13$ 封：若每个最多 $12$ 封，信箱最多装 $240$ 封。十个信箱各 $13$ 封、十个各 $12$ 封，说明能保证的最多就是 $13$。\n\n> **注意。** $N/m$ 不是整数时要向上取整，不是向下；$N - m + 1$ 是一个信箱最多可能装的数量，不是某个信箱至少必须装的数量。",
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
        const full = N - m * (value - 1);
        return numberProblem({
          prompt: t(
            `${ctx.en} What is the largest number that must be in some single one of them, however they are placed?`,
            `${ctx["zh-CN"]}无论怎样放置，某一个中必定至少有多少个？求这个保证成立的最大数。`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              Math.floor(N / m),
              "That rounds down; when the split is not even, some box must take one more.",
              "那是向下取整；不能均分时，某个盒子必须多装一个。",
            ),
            why(
              value + 1,
              "That is not guaranteed: spreading them as evenly as possible keeps every one at or below the rounded-up share.",
              "那不能保证：尽量均匀地分配，每一个都不超过向上取整后的份额。",
            ),
            why(
              N - m + 1,
              "That is the most one could hold if all the others held one each, not the least that is guaranteed.",
              "那是其余每个只放一个时某一个最多能装的数量，不是保证的最小值。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Suppose each holds fewer", "假设每个都更少"],
                value === 2
                  ? t(`With at most one in each, the total is at most $${m} < ${N}$.`, `若每个最多一个，总数至多为 $${m} < ${N}$。`)
                  : t(
                      `With at most $${value - 1}$ in each, the total is at most $${m} \\cdot ${value - 1} = ${m * (value - 1)} < ${N}$.`,
                      `若每个最多 $${value - 1}$，总数至多为 $${m} \\cdot ${value - 1} = ${m * (value - 1)} < ${N}$。`,
                    ),
              ],
              [
                ["Round up", "向上取整"],
                t(
                  `So some one holds at least $\\lceil ${N}/${m} \\rceil = ${value}$.`,
                  `所以某一个至少有 $\\lceil ${N}/${m} \\rceil = ${value}$。`,
                ),
              ],
            ],
            full === m
              ? t(
                  `Putting $${value}$ in each of the $${m}$ uses all $${m} \\cdot ${value} = ${N}$, so no more is guaranteed.`,
                  `每个各放 $${value}$，正好用完 $${m} \\cdot ${value} = ${N}$，所以不能保证更多。`,
                )
              : t(
                  `Putting $${value}$ in $${full}$ of them and $${value - 1}$ in the other $${m - full}$ uses all $${N}$, so no more is guaranteed.`,
                  `在其中 $${full}$ 个各放 $${value}$，其余 $${m - full}$ 个各放 $${value - 1}$，正好用完 $${N}$，所以不能保证更多。`,
                ),
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
