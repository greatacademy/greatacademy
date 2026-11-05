import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { choiceProblem, lowestTerms, numberProblem } from "../problems.ts";

/** SIMPLE_PROPORTIONS lists sample proportions that keep the arithmetic exact. */
const SIMPLE_PROPORTIONS = [Q.of(1, 2), Q.of(1, 4), Q.of(3, 4), Q.of(1, 5), Q.of(2, 5), Q.of(3, 5), Q.of(4, 5)];

/** pickLevel picks a common confidence level and its two-sided $z$ critical value. */
const pickLevel = (rng: Rng): [number, Q] =>
  rng.pick([
    [90, Q.parse("1.645")],
    [95, Q.parse("1.96")],
    [99, Q.parse("2.576")],
  ] as [number, Q][]);

/** pickFpc picks a population size, a sample size and the exact finite population correction, the square root of (N - n) / (N - 1). */
const pickFpc = (rng: Rng): [number, number, Q] =>
  rng.pick([
    [101, 37, Q.of(4, 5)],
    [101, 20, Q.of(9, 10)],
    [101, 65, Q.of(3, 5)],
    [101, 52, Q.of(7, 10)],
    [401, 77, Q.of(9, 10)],
    [401, 257, Q.of(3, 5)],
    [401, 176, Q.of(3, 4)],
    [626, 226, Q.of(4, 5)],
    [626, 401, Q.of(3, 5)],
  ] as [number, number, Q][]);

/** round2 rounds a measured value to two decimal places. */
const round2 = (x: number): Q => Q.of(Math.round(x * 100), 100);

/** par writes a value in parentheses when it is negative. */
const par = (v: Q): string => (v.sign() < 0 ? `(${dec(v)})` : dec(v));

/** Topics for Unit 7: Confidence Intervals (new topics). */
export const probabilityAndStatisticsConfidenceIntervalTopics: TopicDef[] = [
  // 7.25.1 Confidence Intervals for One Mean: Known Population Variance
  {
    id: "confidence-intervals-for-one-mean-known-population-variance",
    title: t("Confidence Intervals for One Mean: Known Population Variance", "单总体均值的置信区间：已知总体方差"),
    summary: t(
      "When the population variance $\\sigma^2$ is known, a $100(1 - \\alpha)\\%$ confidence interval for the population mean $\\mu$ is $\\bar{x} \\pm z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$.",
      "当总体方差 $\\sigma^2$ 已知时，总体均值 $\\mu$ 的 $100(1 - \\alpha)\\%$ 置信区间为 $\\bar{x} \\pm z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$。",
    ),
    prerequisites: ["the-central-limit-theorem", "percentage-points-of-the-standard-normal-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "margin-of-error-known-variance",
        title: t("Calculating the margin of error with known variance", "计算已知总体方差下的误差范围"),
        explanation: t(
          "The margin of error is a critical value times the standard error, so it shrinks with larger samples and grows with higher confidence. The margin of error is $E = z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$.",
          "误差范围等于临界值乘以标准误，所以样本越大它越小，置信水平越高它越大。误差范围为 $E = z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$。",
        ),
        generate: (rng: Rng): Problem => {
          // Choose clean values: n = k^2, z = 2 (approx 95%) or z = 3 (approx 99.7%)
          const k = rng.int(2, 10);
          const n = k * k;
          const z = rng.pick([2, 3]);
          const sigma = k * rng.int(2, 12);
          const margin = z * (sigma / k);

          return numberProblem({
            prompt: t(
              `A random sample of size $n = ${n}$ is drawn from a normal population with standard deviation $\\sigma = ${sigma}$. For a critical value $z_{\\alpha/2} = ${z}$, calculate the margin of error $E$.`,
              `从标准差为 $\\sigma = ${sigma}$ 的正态总体中抽取容量为 $n = ${n}$ 的随机样本。取临界值 $z_{\\alpha/2} = ${z}$，计算误差范围 $E$。`,
            ),
            answer: margin,
            wrong: [Q.of(z * sigma, n), z * sigma, Q.of(sigma, k)],
            solution: t(
              `$E = z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}} = ${z} \\times \\frac{${sigma}}{\\sqrt{${n}}} = ${z} \\times \\frac{${sigma}}{${k}} = ${margin}$.`,
              `$E = z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}} = ${z} \\times \\frac{${sigma}}{\\sqrt{${n}}} = ${z} \\times \\frac{${sigma}}{${k}} = ${margin}$。`,
            ),
          });
        },
      },
      {
        id: "endpoints-of-a-z-interval",
        title: t("Endpoints of a $z$-interval", "$z$ 区间的端点"),
        explanation: t(
          "The interval is centered at the sample mean and reaches one margin of error to each side:\n\n$$\\bar{x} - z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}} \\quad\\text{to}\\quad \\bar{x} + z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}.$$\n\nThe usual critical values are $z_{0.05} = 1.645$ for $90\\%$, $z_{0.025} = 1.96$ for $95\\%$ and $z_{0.005} = 2.576$ for $99\\%$. With $\\bar{x} = 50$, $\\sigma = 8$, $n = 16$ at $95\\%$: the standard error is $2$, the margin is $3.92$, and the interval is $(46.08, 53.92)$.",
          "置信区间以样本均值为中心，向两侧各延伸一个误差界：\n\n$$\\bar{x} - z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}} \\quad\\text{到}\\quad \\bar{x} + z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}.$$\n\n常用临界值：$90\\%$ 为 $z_{0.05} = 1.645$，$95\\%$ 为 $z_{0.025} = 1.96$，$99\\%$ 为 $z_{0.005} = 2.576$。若 $\\bar{x} = 50$，$\\sigma = 8$，$n = 16$，置信水平 $95\\%$：标准误为 $2$，误差界为 $3.92$，区间为 $(46.08, 53.92)$。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const k = rng.int(3, 12);
          const se = Q.of(rng.int(1, 6));
          const sigma = se.mul(Q.of(k));
          const xbar = Q.of(rng.int(200, 1200), 10);
          const margin = z.mul(se);
          const upper = rng.bool();
          const ans = upper ? xbar.add(margin) : xbar.sub(margin);
          return numberProblem({
            prompt: t(
              `A sample of $n = ${k * k}$ from a normal population with $\\sigma = ${dec(sigma)}$ has mean $\\bar{x} = ${dec(xbar)}$. Find the ${upper ? "upper" : "lower"} endpoint of the $${pct}\\%$ confidence interval for $\\mu$ (use $z = ${dec(z)}$).`,
              `从 $\\sigma = ${dec(sigma)}$ 的正态总体中抽取容量 $n = ${k * k}$ 的样本，均值 $\\bar{x} = ${dec(xbar)}$。求 $\\mu$ 的 $${pct}\\%$ 置信区间的${upper ? "上" : "下"}端点（取 $z = ${dec(z)}$）。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [
              upper ? xbar.sub(margin) : xbar.add(margin),
              upper ? xbar.add(z.mul(sigma)) : xbar.sub(z.mul(sigma)),
              upper ? xbar.add(z.mul(sigma).div(Q.of(k * k))) : xbar.sub(z.mul(sigma).div(Q.of(k * k))),
            ],
            solution: t(
              `The standard error is $\\frac{${dec(sigma)}}{\\sqrt{${k * k}}} = ${dec(se)}$ and the margin is $${dec(z)} \\cdot ${dec(se)} = ${dec(margin)}$, so the ${upper ? "upper" : "lower"} endpoint is $${dec(xbar)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$.`,
              `标准误为 $\\frac{${dec(sigma)}}{\\sqrt{${k * k}}} = ${dec(se)}$，误差界为 $${dec(z)} \\cdot ${dec(se)} = ${dec(margin)}$，所以${upper ? "上" : "下"}端点为 $${dec(xbar)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.25.2 Confidence Intervals for One Mean: Unknown Population Variance
  {
    id: "confidence-intervals-for-one-mean-unknown-population-variance",
    title: t("Confidence Intervals for One Mean: Unknown Population Variance", "单总体均值的置信区间：未知总体方差"),
    summary: t(
      "When $\\sigma$ is unknown and the population is normal, Student's $t$-distribution with $\\nu = n - 1$ degrees of freedom is used: $\\bar{x} \\pm t_{\\alpha/2, n-1} \\frac{s}{\\sqrt{n}}$.",
      "当总体标准差 $\\sigma$ 未知且总体服从正态分布时，采用自由度为 $\\nu = n - 1$ 的学生 $t$ 分布：$\\bar{x} \\pm t_{\\alpha/2, n-1} \\frac{s}{\\sqrt{n}}$。",
    ),
    prerequisites: ["confidence-intervals-for-one-mean-known-population-variance", "the-students-t-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "t-confidence-interval-degrees-of-freedom",
        title: t("Identifying degrees of freedom for one-sample t confidence interval", "确定单样本 t 置信区间的自由度"),
        explanation: t(
          "For a single sample of size $n$ with unknown variance, the $t$ critical value uses degrees of freedom $\\nu = n - 1$, because estimating the mean from the sample uses up one degree of freedom.",
          "对于未知方差的容量为 $n$ 的单样本，$t$ 临界值采用自由度 $\\nu = n - 1$，因为用样本估计均值用掉了一个自由度。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(5, 60);

          return numberProblem({
            prompt: t(
              `A researcher constructs a $95\\%$ confidence interval for the mean of a normal population with unknown variance based on a sample of size $n = ${n}$. What are the degrees of freedom $\\nu$ of the Student's $t$ distribution used?`,
              `研究人员根据容量为 $n = ${n}$ 的样本，为方差未知的正态总体均值构建 $95\\%$ 置信区间。所使用的学生 $t$ 分布的自由度 $\\nu$ 是多少？`,
            ),
            answer: n - 1,
            wrong: [n, n - 2, n + 1],
            solution: t(
              `The degrees of freedom for a one-sample $t$-interval is $\\nu = n - 1 = ${n} - 1 = ${n - 1}$.`,
              `单样本 $t$ 置信区间的自由度为 $\\nu = n - 1 = ${n} - 1 = ${n - 1}$。`,
            ),
          });
        },
      },
      {
        id: "endpoints-of-a-t-interval",
        title: t("Endpoints of a $t$-interval", "$t$ 区间的端点"),
        explanation: t(
          "With $\\sigma$ unknown, the sample standard deviation $s$ takes its place and the critical value comes from the $t$-distribution with $n - 1$ degrees of freedom:\n\n$$\\bar{x} \\pm t_{\\alpha/2, n-1}\\frac{s}{\\sqrt{n}}.$$\n\nThe $t$ critical value is larger than the matching $z$ value, which widens the interval to allow for the extra uncertainty in $s$; the difference fades as $n$ grows. For $n = 16$, $s = 8$, $\\bar{x} = 30$ and $t_{0.025, 15} = 2.131$: the margin is $2.131 \\cdot 2 = 4.262$.",
          "当 $\\sigma$ 未知时，用样本标准差 $s$ 代替，临界值取自自由度为 $n - 1$ 的 $t$ 分布：\n\n$$\\bar{x} \\pm t_{\\alpha/2, n-1}\\frac{s}{\\sqrt{n}}.$$\n\n$t$ 临界值比相应的 $z$ 值大，使区间变宽，以反映 $s$ 带来的额外不确定性；$n$ 增大时差别逐渐消失。若 $n = 16$，$s = 8$，$\\bar{x} = 30$，$t_{0.025, 15} = 2.131$：误差界为 $2.131 \\cdot 2 = 4.262$。",
        ),
        generate: (rng: Rng): Problem => {
          const [k, t025, t05] = rng.pick([
            [3, "2.306", "1.860"],
            [4, "2.131", "1.753"],
            [5, "2.064", "1.711"],
            [6, "2.030", "1.690"],
          ] as const);
          const ninety = rng.bool(0.4);
          const tc = Q.parse(ninety ? t05 : t025);
          const n = k * k;
          const se = Q.of(rng.int(1, 5));
          const s = se.mul(Q.of(k));
          const xbar = Q.of(rng.int(100, 900), 10);
          const margin = tc.mul(se);
          const upper = rng.bool();
          const ans = upper ? xbar.add(margin) : xbar.sub(margin);
          const tName = `t_{${ninety ? "0.05" : "0.025"}, ${n - 1}}`;
          return numberProblem({
            prompt: t(
              `A sample of $n = ${n}$ from a normal population has $\\bar{x} = ${dec(xbar)}$ and $s = ${dec(s)}$. Using $${tName} = ${dec(tc)}$, find the ${upper ? "upper" : "lower"} endpoint of the $${ninety ? 90 : 95}\\%$ confidence interval for $\\mu$.`,
              `从正态总体中抽取容量 $n = ${n}$ 的样本，$\\bar{x} = ${dec(xbar)}$，$s = ${dec(s)}$。取 $${tName} = ${dec(tc)}$，求 $\\mu$ 的 $${ninety ? 90 : 95}\\%$ 置信区间的${upper ? "上" : "下"}端点。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [
              upper ? xbar.sub(margin) : xbar.add(margin),
              upper ? xbar.add(tc.mul(s)) : xbar.sub(tc.mul(s)),
              upper ? xbar.add(Q.parse("1.96").mul(se)) : xbar.sub(Q.parse("1.96").mul(se)),
            ],
            solution: t(
              `The standard error is $\\frac{s}{\\sqrt{n}} = \\frac{${dec(s)}}{${k}} = ${dec(se)}$, and the margin is $${dec(tc)} \\cdot ${dec(se)} = ${dec(margin)}$. The ${upper ? "upper" : "lower"} endpoint is $${dec(xbar)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$.`,
              `标准误为 $\\frac{s}{\\sqrt{n}} = \\frac{${dec(s)}}{${k}} = ${dec(se)}$，误差界为 $${dec(tc)} \\cdot ${dec(se)} = ${dec(margin)}$。${upper ? "上" : "下"}端点为 $${dec(xbar)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.25.3 Confidence Intervals for One Means: Finite Population Correction
  {
    id: "confidence-intervals-for-one-mean-finite-population-correction",
    title: t("Confidence Intervals for One Mean: Finite Population Correction", "单总体均值的置信区间：有限总体校正"),
    summary: t(
      "When sampling without replacement from a finite population of size $N$, the confidence interval is adjusted by the FPC factor: $\\bar{x} \\pm z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}} \\sqrt{\\frac{N - n}{N - 1}}$.",
      "当不放回地从容量为 $N$ 的有限总体中抽样时，置信区间通过 FPC 因子进行修正：$\\bar{x} \\pm z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}} \\sqrt{\\frac{N - n}{N - 1}}$。",
    ),
    prerequisites: ["confidence-intervals-for-one-mean-known-population-variance", "finite-population-corrections-for-sample-means"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "fpc-confidence-interval-margin-reduction",
        title: t("Understanding the narrowing effect of FPC on confidence intervals", "理解 FPC 对置信区间的收窄效应"),
        explanation: t(
          "Because the correction factor is less than one, sampling a large fraction of the population gives a narrower interval than the usual formula. Because $\\sqrt{\\dfrac{N - n}{N - 1}} < 1$, the FPC narrows the margin of error and yields a more precise interval.",
          "由于修正因子小于 1，抽取总体中很大一部分时，得到的区间比通常公式给出的更窄。因为 $\\sqrt{\\dfrac{N - n}{N - 1}} < 1$，有限总体校正使误差范围变窄，从而得到更精确的置信区间。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(200, 1000);
          const n = rng.int(20, 100);

          const opts = [
            t(
              "It becomes narrower (smaller margin of error) because the FPC factor is strictly less than 1.",
              "置信区间变得更窄（误差范围更小），因为 FPC 因子严格小于 1。",
            ),
            t(
              "It becomes wider (larger margin of error) because finite populations introduce extra variance.",
              "置信区间变得更宽（误差范围更大），因为有限总体引入了额外方差。",
            ),
            t("The width remains unchanged because the sample size $n$ is unchanged.", "区间宽度保持不变，因为样本容量 $n$ 未发生变化。"),
            t("It shifts the center of the interval away from the sample mean.", "它会使置信区间的中心偏离样本均值。"),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `When constructing a confidence interval for the mean from a sample of size $n = ${n}$ drawn without replacement from a finite population of size $N = ${N}$, how does including the Finite Population Correction (FPC) affect the width of the confidence interval compared to assuming an infinite population?`,
              `当根据从容量为 $N = ${N}$ 的有限总体中不放回抽取的 $n = ${n}$ 个样本构建均值置信区间时，与假定无限总体相比，引入有限总体校正（FPC）对置信区间宽度有何影响？`,
            ),
            options,
            correct,
            solution: t(
              `The FPC factor $\\sqrt{\\frac{N - n}{N - 1}} < 1$ scales down the standard error, thereby reducing the margin of error and narrowing the confidence interval.`,
              `FPC 因子 $\\sqrt{\\frac{N - n}{N - 1}} < 1$ 缩小了标准误差，从而减小了误差范围并收窄了置信区间。`,
            ),
          });
        },
      },
      {
        id: "the-corrected-margin-of-error",
        title: t("The corrected margin of error", "修正后的误差界"),
        explanation: t(
          "Sampling a large share of a finite population leaves less uncertainty, and the margin of error is multiplied by the **finite population correction**:\n\n$$E = z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}\\sqrt{\\frac{N - n}{N - 1}}.$$\n\nThe factor is below $1$ and matters once $n$ is more than about $5\\%$ of $N$. For $N = 101$ and $n = 37$, $\\sqrt{\\frac{64}{100}} = 0.8$, so the margin shrinks by a fifth.",
          "从有限总体中抽取较大比例的样本时，不确定性减小，误差界要乘以**有限总体校正因子**：\n\n$$E = z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}\\sqrt{\\frac{N - n}{N - 1}}.$$\n\n该因子小于 $1$，当 $n$ 超过 $N$ 的约 $5\\%$ 时就不可忽略。例如 $N = 101$，$n = 37$，$\\sqrt{\\frac{64}{100}} = 0.8$，误差界缩小五分之一。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const [N, n, r] = pickFpc(rng);
          const se = Q.of(rng.int(2, 40), 10);
          const ans = z.mul(se).mul(r);
          return numberProblem({
            prompt: t(
              `A sample of $n = ${n}$ is drawn without replacement from a population of $N = ${N}$, and $\\frac{\\sigma}{\\sqrt{n}} = ${dec(se)}$. Find the margin of error of the $${pct}\\%$ confidence interval for $\\mu$ with the finite population correction (use $z = ${dec(z)}$).`,
              `从容量 $N = ${N}$ 的总体中不放回地抽取 $n = ${n}$ 个个体，$\\frac{\\sigma}{\\sqrt{n}} = ${dec(se)}$。求带有限总体校正的 $\\mu$ 的 $${pct}\\%$ 置信区间的误差界（取 $z = ${dec(z)}$）。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [z.mul(se), z.mul(se).mul(r).mul(r), se.mul(r), z.mul(se).mul(Q.one.sub(r))],
            solution: t(
              `The correction is $\\sqrt{\\frac{${N} - ${n}}{${N} - 1}} = \\sqrt{\\frac{${N - n}}{${N - 1}}} = ${dec(r)}$, so $E = ${dec(z)} \\cdot ${dec(se)} \\cdot ${dec(r)} = ${dec(ans)}$.`,
              `校正因子为 $\\sqrt{\\frac{${N} - ${n}}{${N} - 1}} = \\sqrt{\\frac{${N - n}}{${N - 1}}} = ${dec(r)}$，所以 $E = ${dec(z)} \\cdot ${dec(se)} \\cdot ${dec(r)} = ${dec(ans)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.25.4 Confidence Intervals for One Proportion
  {
    id: "confidence-intervals-for-one-proportion",
    title: t("Confidence Intervals for One Proportion", "单总体比例的置信区间"),
    summary: t(
      "The large-sample Wald confidence interval for a population proportion $p$ is $\\hat{p} \\pm z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}$, valid when $n\\hat{p} \\ge 10$ and $n(1 - \\hat{p}) \\ge 10$.",
      "单总体比例 $p$ 的大样本瓦尔德（Wald）置信区间为 $\\hat{p} \\pm z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}$，在 $n\\hat{p} \\ge 10$ 且 $n(1 - \\hat{p}) \\ge 10$ 时适用。",
    ),
    prerequisites: ["point-estimates-of-population-proportions", "confidence-intervals-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "wald-proportion-variance-evaluation",
        title: t("Evaluating the estimated variance of the sample proportion", "计算样本比例的估计方差"),
        explanation: t(
          "The true variance of a sample proportion depends on the unknown proportion, so the estimate substitutes the sample proportion for it. The estimated variance of $\\hat{p}$ is $\\dfrac{\\hat{p}(1 - \\hat{p})}{n}$.",
          "样本比例的真实方差依赖于未知的比例，所以估计时用样本比例代替它。样本比例 $\\hat{p}$ 的估计方差为 $\\dfrac{\\hat{p}(1 - \\hat{p})}{n}$。",
        ),
        generate: (rng: Rng): Problem => {
          const numP = rng.int(1, 9);
          const denP = 10;
          const n = rng.int(20, 100);
          // var = p(1-p)/n = (numP * (10 - numP)) / (100 * n)
          const num = numP * (denP - numP);
          const den = 100 * n;

          return numberProblem({
            prompt: t(
              `In a sample of size $n = ${n}$, the sample proportion is $\\hat{p} = \\frac{${numP}}{${denP}}$. Find the estimated variance of the sample proportion.`,
              `在容量为 $n = ${n}$ 的样本中，样本比例为 $\\hat{p} = \\frac{${numP}}{${denP}}$。求样本比例的估计方差。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(num, 100), Q.of(numP, denP * n), Q.of(num * n, 100)],
            solution: t(
              `$\\widehat{\\text{Var}}(\\hat{p}) = \\frac{\\frac{${numP}}{${denP}} \\left(1 - \\frac{${numP}}{${denP}}\\right)}{${n}} = \\frac{${numP} \\times ${denP - numP}}{100 \\times ${n}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$\\widehat{\\text{Var}}(\\hat{p}) = \\frac{\\frac{${numP}}{${denP}} \\left(1 - \\frac{${numP}}{${denP}}\\right)}{${n}} = \\frac{${numP} \\times ${denP - numP}}{100 \\times ${n}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
      {
        id: "endpoints-of-a-proportion-interval",
        title: t("Endpoints of a proportion interval", "比例区间的端点"),
        explanation: t(
          "The Wald interval puts the sample proportion in the middle and estimates the standard error from it:\n\n$$\\hat{p} \\pm z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}.$$\n\nIf $80$ of $400$ voters support a measure, $\\hat{p} = 0.2$, the standard error is $\\sqrt{\\frac{0.16}{400}} = 0.02$, and the $95\\%$ interval is $0.2 \\pm 0.0392$, from $0.1608$ to $0.2392$. Check first that there are at least $10$ successes and $10$ failures.",
          "沃尔德区间以样本比例为中心，并由它估计标准误：\n\n$$\\hat{p} \\pm z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}.$$\n\n若 $400$ 名选民中有 $80$ 人支持某项提案，$\\hat{p} = 0.2$，标准误为 $\\sqrt{\\frac{0.16}{400}} = 0.02$，$95\\%$ 区间为 $0.2 \\pm 0.0392$，即从 $0.1608$ 到 $0.2392$。先检查成功和失败次数都至少为 $10$。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const [p, sd] = rng.pick([
            [Q.of(1, 2), Q.of(1, 2)],
            [Q.of(1, 5), Q.of(2, 5)],
            [Q.of(4, 5), Q.of(2, 5)],
            [Q.of(1, 10), Q.of(3, 10)],
            [Q.of(9, 10), Q.of(3, 10)],
          ] as const);
          const root = rng.pick([10, 20, 25, 40, 50]);
          const n = root * root;
          const x = p.mul(Q.of(n));
          const se = sd.div(Q.of(root));
          const margin = z.mul(se);
          const upper = rng.bool();
          const ans = upper ? p.add(margin) : p.sub(margin);
          return numberProblem({
            prompt: t(
              `In a random sample of $${n}$ people, $${x.toString()}$ answer yes. Find the ${upper ? "upper" : "lower"} endpoint of the $${pct}\\%$ Wald confidence interval for the population proportion (use $z = ${dec(z)}$).`,
              `在 $${n}$ 人的随机样本中，有 $${x.toString()}$ 人回答“是”。求总体比例的 $${pct}\\%$ 沃尔德置信区间的${upper ? "上" : "下"}端点（取 $z = ${dec(z)}$）。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [
              upper ? p.sub(margin) : p.add(margin),
              upper ? p.add(z.mul(sd.pow(2)).div(Q.of(n))) : p.sub(z.mul(sd.pow(2)).div(Q.of(n))),
              upper ? p.add(se) : p.sub(se),
            ],
            solution: t(
              `$\\hat{p} = \\frac{${x.toString()}}{${n}} = ${dec(p)}$ and $\\sqrt{\\frac{${dec(p)} \\cdot ${dec(Q.one.sub(p))}}{${n}}} = \\frac{${dec(sd)}}{${root}} = ${dec(se)}$. The margin is $${dec(z)} \\cdot ${dec(se)} = ${dec(margin)}$, so the endpoint is $${dec(p)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$.`,
              `$\\hat{p} = \\frac{${x.toString()}}{${n}} = ${dec(p)}$，$\\sqrt{\\frac{${dec(p)} \\cdot ${dec(Q.one.sub(p))}}{${n}}} = \\frac{${dec(sd)}}{${root}} = ${dec(se)}$。误差界为 $${dec(z)} \\cdot ${dec(se)} = ${dec(margin)}$，所以端点为 $${dec(p)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.25.5 Confidence Intervals for One Proportion: Finite Population Corrections
  {
    id: "confidence-intervals-for-one-proportion-finite-population-corrections",
    title: t("Confidence Intervals for One Proportion: Finite Population Corrections", "单总体比例的置信区间：有限总体校正"),
    summary: t(
      "For finite populations sampled without replacement, the margin of error for proportions includes the FPC: $E = z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}} \\sqrt{\\frac{N - n}{N - 1}}$.",
      "对于不放回抽样的有限总体，比例的误差范围包含 FPC 校正因子：$E = z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}} \\sqrt{\\frac{N - n}{N - 1}}$。",
    ),
    prerequisites: ["confidence-intervals-for-one-proportion", "finite-population-corrections-for-sample-proportions"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "fpc-proportion-standard-error-formula",
        title: t("Formulating the standard error with FPC for proportions", "构建含 FPC 的样本比例标准误差表达式"),
        explanation: t(
          "The standard error of a proportion is corrected in the same way as for a mean, by multiplying the variance by the finite population factor. $SE(\\hat{p}) = \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n} \\cdot \\frac{N - n}{N - 1}}$.",
          "比例的标准误与均值的修正方法相同，都是把方差乘以有限总体修正因子。$SE(\\hat{p}) = \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n} \\cdot \\frac{N - n}{N - 1}}$。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(300, 1500);
          const n = rng.int(30, 150);

          const correctStr = `\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{${n}} \\left(\\frac{${N} - ${n}}{${N} - 1}\\right)}`;
          const alt1 = `\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{${n}} \\left(\\frac{${N} - 1}{${N} - ${n}}\\right)}`;
          const alt2 = `\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{${n}}}`;
          const alt3 = `\\frac{\\hat{p}(1 - \\hat{p})}{${n}} \\left(\\frac{${N} - ${n}}{${N}}\\right)`;

          const opts = [
            t(`$${correctStr}$`, `$${correctStr}$`),
            t(`$${alt1}$`, `$${alt1}$`),
            t(`$${alt2}$`, `$${alt2}$`),
            t(`$${alt3}$`, `$${alt3}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `When drawing a sample of size $n = ${n}$ without replacement from a population of size $N = ${N}$, what is the formula for the finite-population-corrected standard error of the sample proportion $\\hat{p}$?`,
              `当从容量为 $N = ${N}$ 的总体中不放回抽取容量为 $n = ${n}$ 的样本时，样本比例 $\\hat{p}$ 经有限总体校正后的标准误差公式是什么？`,
            ),
            options,
            correct,
            solution: t(
              `The finite-population-corrected standard error multiplies the uncorrected standard error by the FPC factor $\\sqrt{\\frac{N - n}{N - 1}}$, giving $\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{${n}} \\left(\\frac{${N} - ${n}}{${N} - 1}\\right)}$.`,
              `经有限总体校正的标准误差将未校正的标准误差乘以 FPC 因子 $\\sqrt{\\frac{N - n}{N - 1}}$，得到 $\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{${n}} \\left(\\frac{${N} - ${n}}{${N} - 1}\\right)}$。`,
            ),
          });
        },
      },
      {
        id: "the-corrected-margin-for-a-proportion",
        title: t("The corrected margin for a proportion", "比例的修正误差界"),
        explanation: t(
          "For a proportion estimated from a sample drawn without replacement, the standard error is multiplied by the same correction as for a mean:\n\n$$E = z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}\\sqrt{\\frac{N - n}{N - 1}}.$$\n\nCompute the uncorrected standard error, the correction factor and the critical value separately, then multiply. Surveying $100$ of the $226$ members of a club, the factor is $\\sqrt{\\frac{126}{225}} \\approx 0.75$, so the margin is about a quarter smaller than the textbook formula gives.",
          "对于不放回抽样估计的比例，标准误要乘以与均值相同的校正因子：\n\n$$E = z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}\\sqrt{\\frac{N - n}{N - 1}}.$$\n\n分别算出未校正的标准误、校正因子和临界值，再相乘。例如调查某俱乐部 $226$ 名成员中的 $100$ 人，校正因子为 $\\sqrt{\\frac{126}{225}} \\approx 0.75$，误差界比教科书公式给出的约小四分之一。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const [N, n, r] = pickFpc(rng);
          const x = rng.int(Math.ceil(n * 0.2), Math.floor(n * 0.8));
          const p = x / n;
          const se = Math.sqrt((p * (1 - p)) / n);
          const zn = z.toNumber();
          const rn = r.toNumber();
          const r4 = (v: number): Q => Q.of(Math.round(v * 10000), 10000);
          const ans = r4(zn * se * rn);
          const wrong = [r4(zn * se), r4(zn * se * rn * rn), r4(zn * ((p * (1 - p)) / n) * rn)].filter((w) => !w.eq(ans));
          return numberProblem({
            prompt: t(
              `A club has $N = ${N}$ members. A sample of $n = ${n}$ members is chosen without replacement, and $${x}$ of them favor a proposal. Find the finite-population-corrected margin of error for the proportion at $${pct}\\%$ confidence (use $z = ${dec(z)}$). Round to four decimal places.`,
              `某俱乐部有 $N = ${N}$ 名成员。不放回地抽取 $n = ${n}$ 名成员，其中 $${x}$ 人赞成一项提案。求置信水平 $${pct}\\%$ 下比例的经有限总体校正的误差界（取 $z = ${dec(z)}$），精确到四位小数。`,
            ),
            answer: ans,
            form: "decimal",
            wrong,
            solution: t(
              `$\\hat{p} = \\frac{${x}}{${n}} \\approx ${p.toFixed(4)}$, so $\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}} \\approx ${se.toFixed(5)}$. The correction is $\\sqrt{\\frac{${N - n}}{${N - 1}}} = ${dec(r)}$, so $E \\approx ${dec(z)} \\cdot ${se.toFixed(5)} \\cdot ${dec(r)} \\approx ${dec(ans)}$.`,
              `$\\hat{p} = \\frac{${x}}{${n}} \\approx ${p.toFixed(4)}$，所以 $\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}} \\approx ${se.toFixed(5)}$。校正因子为 $\\sqrt{\\frac{${N - n}}{${N - 1}}} = ${dec(r)}$，所以 $E \\approx ${dec(z)} \\cdot ${se.toFixed(5)} \\cdot ${dec(r)} \\approx ${dec(ans)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.25.6 Confidence Intervals for One Variance
  {
    id: "confidence-intervals-for-one-variance",
    title: t("Confidence Intervals for One Variance", "单总体方差的置信区间"),
    summary: t(
      "A $100(1 - \\alpha)\\%$ confidence interval for the variance $\\sigma^2$ of a normal population is $\\left(\\frac{(n - 1)s^2}{\\chi^2_{\\alpha/2, n-1}}, \\frac{(n - 1)s^2}{\\chi^2_{1 - \\alpha/2, n-1}}\\right)$.",
      "正态总体方差 $\\sigma^2$ 的 $100(1 - \\alpha)\\%$ 置信区间为 $\\left(\\frac{(n - 1)s^2}{\\chi^2_{\\alpha/2, n-1}}, \\frac{(n - 1)s^2}{\\chi^2_{1 - \\alpha/2, n-1}}\\right)$。",
    ),
    prerequisites: ["the-sample-variance", "the-chi-square-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "chi-square-variance-confidence-bounds",
        title: t("Identifying endpoints for variance confidence intervals", "确定方差置信区间的上下限构造"),
        explanation: t(
          "Dividing by the larger chi square value gives the lower bound and by the smaller value gives the upper bound, because the statistic is inverted. The interval is $\\left[\\frac{(n-1)s^2}{\\chi^2_{\\text{upper}}}, \\frac{(n-1)s^2}{\\chi^2_{\\text{lower}}}\\right]$. Note that the larger critical value produces the lower bound.",
          "除以较大的卡方值得到下限，除以较小的卡方值得到上限，因为统计量被倒了过来。区间为 $\\left[\\frac{(n-1)s^2}{\\chi^2_{\\text{upper}}}, \\frac{(n-1)s^2}{\\chi^2_{\\text{lower}}}\\right]$。注意较大的卡方临界值对应置信下限。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(6, 40);
          const sSq = rng.int(5, 30);
          const ss = (n - 1) * sSq;

          const opts = [
            t(
              `$\\left[ \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}}, \\; \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}} \\right]$`,
              `$\\left[ \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}}, \\; \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}} \\right]$`,
            ),
            t(
              `$\\left[ \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}}, \\; \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}} \\right]$`,
              `$\\left[ \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}}, \\; \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}} \\right]$`,
            ),
            t(
              `$\\left[ \\frac{${sSq}}{\\chi^2_{\\alpha/2, ${n}}}, \\; \\frac{${sSq}}{\\chi^2_{1 - \\alpha/2, ${n}}} \\right]$`,
              `$\\left[ \\frac{${sSq}}{\\chi^2_{\\alpha/2, ${n}}}, \\; \\frac{${sSq}}{\\chi^2_{1 - \\alpha/2, ${n}}} \\right]$`,
            ),
            t(`$${sSq} \\pm z_{\\alpha/2} \\frac{${sSq}}{\\sqrt{${n}}}$`, `$${sSq} \\pm z_{\\alpha/2} \\frac{${sSq}}{\\sqrt{${n}}}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `A random sample of size $n = ${n}$ from a normal distribution yields sample variance $s^2 = ${sSq}$. Write $\\chi^2_{p, \\nu}$ for the value that cuts off upper-tail area $p$. What is the correct formula for the $100(1 - \\alpha)\\%$ confidence interval for the population variance $\\sigma^2$?`,
              `从正态分布中抽取容量为 $n = ${n}$ 的随机样本，测得样本方差为 $s^2 = ${sSq}$。记 $\\chi^2_{p, \\nu}$ 为右侧尾部面积为 $p$ 的临界值。求总体方差 $\\sigma^2$ 的 $100(1 - \\alpha)\\%$ 置信区间的正确公式。`,
            ),
            options,
            correct,
            solution: t(
              `Using the pivotal quantity $\\frac{(n - 1)s^2}{\\sigma^2} \\sim \\chi^2(${n - 1})$, inverting yields the bounds $\\left[ \\frac{(n - 1)s^2}{\\chi^2_{\\alpha/2, n-1}}, \\frac{(n - 1)s^2}{\\chi^2_{1 - \\alpha/2, n-1}} \\right] = \\left[ \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}}, \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}} \\right]$.`,
              `利用枢轴量 $\\frac{(n - 1)s^2}{\\sigma^2} \\sim \\chi^2(${n - 1})$ 反解不等式，得到置信区间为 $\\left[ \\frac{(n - 1)s^2}{\\chi^2_{\\alpha/2, n-1}}, \\frac{(n - 1)s^2}{\\chi^2_{1 - \\alpha/2, n-1}} \\right] = \\left[ \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}}, \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}} \\right]$。`,
            ),
          });
        },
      },
      {
        id: "endpoints-of-a-variance-interval",
        title: t("Endpoints of a variance interval", "方差区间的端点"),
        explanation: t(
          "Since $\\frac{(n - 1)s^{2}}{\\sigma^{2}}$ has a $\\chi^{2}_{n-1}$ distribution, the interval for $\\sigma^{2}$ divides $(n - 1)s^{2}$ by the two chi-square critical values. The **larger** critical value gives the **lower** endpoint:\n\n$$\\frac{(n - 1)s^{2}}{\\chi^{2}_{\\alpha/2}} \\le \\sigma^{2} \\le \\frac{(n - 1)s^{2}}{\\chi^{2}_{1 - \\alpha/2}},$$\n\nwhere $\\chi^{2}_{\\alpha/2}$ cuts off the upper tail. The interval is not symmetric about $s^{2}$, because the chi-square distribution is skewed.",
          "因为 $\\frac{(n - 1)s^{2}}{\\sigma^{2}}$ 服从 $\\chi^{2}_{n-1}$ 分布，$\\sigma^{2}$ 的区间是用两个卡方临界值去除 $(n - 1)s^{2}$。**较大**的临界值给出**下**端点：\n\n$$\\frac{(n - 1)s^{2}}{\\chi^{2}_{\\alpha/2}} \\le \\sigma^{2} \\le \\frac{(n - 1)s^{2}}{\\chi^{2}_{1 - \\alpha/2}},$$\n\n其中 $\\chi^{2}_{\\alpha/2}$ 截去上尾。由于卡方分布是偏斜的，区间不以 $s^{2}$ 为中心对称。",
        ),
        generate: (rng: Rng): Problem => {
          const [n, hi, lo] = rng.pick([
            [10, 19.023, 2.7],
            [15, 26.119, 5.629],
            [20, 32.852, 8.907],
            [25, 39.364, 12.401],
          ] as const);
          const s2 = rng.int(4, 120);
          const upper = rng.bool();
          const ans = round2(((n - 1) * s2) / (upper ? lo : hi));
          return numberProblem({
            prompt: t(
              `A sample of $n = ${n}$ from a normal population has variance $s^{2} = ${s2}$. With $\\chi^{2}_{0.025, ${n - 1}} = ${hi}$ and $\\chi^{2}_{0.975, ${n - 1}} = ${lo}$, find the ${upper ? "upper" : "lower"} endpoint of the $95\\%$ confidence interval for $\\sigma^{2}$. Round to two decimal places.`,
              `从正态总体中抽取容量 $n = ${n}$ 的样本，方差 $s^{2} = ${s2}$。已知 $\\chi^{2}_{0.025, ${n - 1}} = ${hi}$，$\\chi^{2}_{0.975, ${n - 1}} = ${lo}$，求 $\\sigma^{2}$ 的 $95\\%$ 置信区间的${upper ? "上" : "下"}端点，精确到两位小数。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [round2(((n - 1) * s2) / (upper ? hi : lo)), round2((n * s2) / (upper ? lo : hi)), round2(s2 / (upper ? lo : hi))],
            solution: t(
              `$(n - 1)s^{2} = ${n - 1} \\cdot ${s2} = ${(n - 1) * s2}$. The ${upper ? "upper endpoint uses the smaller" : "lower endpoint uses the larger"} critical value: $\\frac{${(n - 1) * s2}}{${upper ? lo : hi}} \\approx ${dec(ans)}$.`,
              `$(n - 1)s^{2} = ${n - 1} \\cdot ${s2} = ${(n - 1) * s2}$。${upper ? "上端点用较小的" : "下端点用较大的"}临界值：$\\frac{${(n - 1) * s2}}{${upper ? lo : hi}} \\approx ${dec(ans)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.26.1 Confidence Intervals for Two Means: Known and Unequal Population Variances
  {
    id: "confidence-intervals-for-differences-between-two-means-known-population-variances",
    title: t("Confidence Intervals for Two Means: Known and Unequal Population Variances", "两个均值之差的置信区间：已知且不等的总体方差"),
    summary: t(
      "When independent samples are drawn from populations with known variances $\\sigma_1^2$ and $\\sigma_2^2$, the confidence interval for $\\mu_1 - \\mu_2$ is $(\\bar{x}_1 - \\bar{x}_2) \\pm z_{\\alpha/2} \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$.",
      "当从已知方差分别为 $\\sigma_1^2$ 与 $\\sigma_2^2$ 的两个总体中抽取独立样本时，$\\mu_1 - \\mu_2$ 的置信区间为 $(\\bar{x}_1 - \\bar{x}_2) \\pm z_{\\alpha/2} \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$。",
    ),
    prerequisites: ["confidence-intervals-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "two-mean-known-variance-se",
        title: t("Evaluating the standard error of difference between two independent means", "计算两个独立均值之差的标准误差"),
        explanation: t(
          "The variances of independent sample means add, even for a difference, so the standard error is the square root of their sum. The standard error is $SE = \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$.",
          "独立样本均值的方差即使相减也要相加，所以标准误是它们之和的平方根。标准误差为 $SE = \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$。",
        ),
        generate: (rng: Rng): Problem => {
          const v1 = rng.int(10, 80);
          const n1 = rng.int(5, 40);
          const v2 = rng.int(10, 80);
          const n2 = rng.int(5, 40);
          // SE^2 = v1/n1 + v2/n2 = (v1*n2 + v2*n1) / (n1*n2)
          const num = v1 * n2 + v2 * n1;
          const den = n1 * n2;

          return numberProblem({
            prompt: t(
              `Independent samples from two populations have sizes $n_1 = ${n1}$, $n_2 = ${n2}$ and known population variances $\\sigma_1^2 = ${v1}$, $\\sigma_2^2 = ${v2}$. Find the squared standard error of the difference between sample means.`,
              `来自两个总体的独立样本容量分别为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$，已知总体方差分别为 $\\sigma_1^2 = ${v1}$ 与 $\\sigma_2^2 = ${v2}$。求样本均值之差的标准误差平方。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(v1 + v2, n1 + n2), Q.of(v1 - v2, n1 - n2 === 0 ? 1 : n1 - n2), Q.of(v1 * v2, n1 * n2)],
            solution: t(
              `$\\text{SE}^2 = \\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2} = \\frac{${v1}}{${n1}} + \\frac{${v2}}{${n2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$\\text{SE}^2 = \\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2} = \\frac{${v1}}{${n1}} + \\frac{${v2}}{${n2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
      {
        id: "endpoints-of-an-interval-for-a-difference-of-means",
        title: t("Endpoints of an interval for $\\mu_1 - \\mu_2$", "$\\mu_1 - \\mu_2$ 区间的端点"),
        explanation: t(
          "The interval for $\\mu_1 - \\mu_2$ is centered at the observed difference $\\bar{x}_1 - \\bar{x}_2$ and reaches $z_{\\alpha/2}$ standard errors to each side. If the interval contains $0$, the data are consistent with equal means; if both endpoints have the same sign, they point to a real difference in that direction.\n\nWith $\\bar{x}_1 = 72$, $\\bar{x}_2 = 68$, $\\frac{\\sigma_1^{2}}{n_1} = 1.44$ and $\\frac{\\sigma_2^{2}}{n_2} = 1.06$, the standard error is $\\sqrt{2.5} \\approx 1.58$; using a squared standard error that is a perfect square keeps the arithmetic exact.",
          "$\\mu_1 - \\mu_2$ 的区间以观测差 $\\bar{x}_1 - \\bar{x}_2$ 为中心，向两侧各延伸 $z_{\\alpha/2}$ 个标准误。若区间包含 $0$，数据与均值相等相容；若两端点同号，则表明在该方向上存在真实差异。\n\n例如 $\\bar{x}_1 = 72$，$\\bar{x}_2 = 68$，$\\frac{\\sigma_1^{2}}{n_1} = 1.44$，$\\frac{\\sigma_2^{2}}{n_2} = 1.06$，标准误为 $\\sqrt{2.5} \\approx 1.58$；若方差和恰为完全平方数，计算就是精确的。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const [a, b, c] = rng.pick([
            [3, 4, 5],
            [6, 8, 10],
            [5, 12, 13],
            [8, 6, 10],
            [12, 5, 13],
          ] as const);
          const scale = rng.pick([1, 2]);
          const sd1 = a * scale;
          const sd2 = b * scale;
          const n = rng.pick([4, 9, 16, 25]);
          const root = Math.sqrt(n);
          const s1 = sd1 * root;
          const s2 = sd2 * root;
          const se = Q.of(c * scale);
          const x1 = rng.int(40, 90);
          const x2 = rng.int(40, 90);
          const diff = Q.of(x1 - x2);
          const margin = z.mul(se);
          const upper = rng.bool();
          const ans = upper ? diff.add(margin) : diff.sub(margin);
          const wrongSe = Q.of(sd1 + sd2);
          return numberProblem({
            prompt: t(
              `Independent samples of size $n_1 = n_2 = ${n}$ come from normal populations with $\\sigma_1 = ${s1}$ and $\\sigma_2 = ${s2}$. The sample means are $\\bar{x}_1 = ${x1}$ and $\\bar{x}_2 = ${x2}$. Find the ${upper ? "upper" : "lower"} endpoint of the $${pct}\\%$ confidence interval for $\\mu_1 - \\mu_2$ (use $z = ${dec(z)}$).`,
              `从 $\\sigma_1 = ${s1}$ 和 $\\sigma_2 = ${s2}$ 的两个正态总体中各抽取容量 $n_1 = n_2 = ${n}$ 的独立样本，样本均值为 $\\bar{x}_1 = ${x1}$，$\\bar{x}_2 = ${x2}$。求 $\\mu_1 - \\mu_2$ 的 $${pct}\\%$ 置信区间的${upper ? "上" : "下"}端点（取 $z = ${dec(z)}$）。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [
              upper ? diff.sub(margin) : diff.add(margin),
              upper ? diff.add(z.mul(wrongSe)) : diff.sub(z.mul(wrongSe)),
              upper ? diff.add(se) : diff.sub(se),
            ],
            solution: t(
              `$\\frac{\\sigma_1^{2}}{n_1} + \\frac{\\sigma_2^{2}}{n_2} = \\frac{${s1 * s1}}{${n}} + \\frac{${s2 * s2}}{${n}} = ${sd1 * sd1} + ${sd2 * sd2} = ${(c * scale) ** 2}$, so the standard error is $${c * scale}$ and the margin is $${dec(z)} \\cdot ${c * scale} = ${dec(margin)}$. The endpoint is $${par(diff)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$.`,
              `$\\frac{\\sigma_1^{2}}{n_1} + \\frac{\\sigma_2^{2}}{n_2} = \\frac{${s1 * s1}}{${n}} + \\frac{${s2 * s2}}{${n}} = ${sd1 * sd1} + ${sd2 * sd2} = ${(c * scale) ** 2}$，所以标准误为 $${c * scale}$，误差界为 $${dec(z)} \\cdot ${c * scale} = ${dec(margin)}$。端点为 $${par(diff)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.26.2 Confidence Intervals for Two Means: Equal and Unknown Population Variance
  {
    id: "confidence-intervals-for-differences-between-two-means-unknown-equal-population-variances",
    title: t("Confidence Intervals for Two Means: Equal and Unknown Population Variance", "两个均值之差的置信区间：未知但相等的总体方差"),
    summary: t(
      "Assuming equal unknown variances $\\sigma_1^2 = \\sigma_2^2$, the confidence interval is $(\\bar{x}_1 - \\bar{x}_2) \\pm t_{\\alpha/2, n_1+n_2-2}\\, s_p \\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}$.",
      "在假定总体方差未知但相等（$\\sigma_1^2 = \\sigma_2^2$）的条件下，置信区间为 $(\\bar{x}_1 - \\bar{x}_2) \\pm t_{\\alpha/2, n_1+n_2-2}\\, s_p \\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}$。",
    ),
    prerequisites: ["pooled-variance", "confidence-intervals-for-differences-between-two-means-known-population-variances"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "pooled-t-degrees-of-freedom",
        title: t("Degrees of freedom for pooled two-sample t interval", "合并双样本 t 置信区间的自由度"),
        explanation: t(
          "Each sample loses one degree of freedom for its own mean, so the pooled degrees of freedom are the total sample size minus two. The degrees of freedom for the pooled two-sample $t$ is $\\nu = n_1 + n_2 - 2$.",
          "每个样本因估计自己的均值而失去一个自由度，所以合并后的自由度是总样本量减 2。合并双样本 $t$ 检验或置信区间的自由度为 $\\nu = n_1 + n_2 - 2$。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(8, 35);
          const n2 = rng.int(8, 35);

          return numberProblem({
            prompt: t(
              `Two independent samples of sizes $n_1 = ${n1}$ and $n_2 = ${n2}$ are drawn from normal populations with unknown but equal variances. How many degrees of freedom are associated with the pooled $t$ statistic?`,
              `从方差未知但假定相等的正态总体中分别抽取容量为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$ 的独立样本。合并 $t$ 统计量的自由度 是多少？`,
            ),
            answer: n1 + n2 - 2,
            wrong: [n1 + n2 - 1, n1 + n2, Math.min(n1, n2) - 1],
            solution: t(
              `$\\nu = n_1 + n_2 - 2 = ${n1} + ${n2} - 2 = ${n1 + n2 - 2}$.`,
              `$\\nu = n_1 + n_2 - 2 = ${n1} + ${n2} - 2 = ${n1 + n2 - 2}$。`,
            ),
          });
        },
      },
      {
        id: "the-pooled-variance",
        title: t("The pooled variance", "合并方差"),
        explanation: t(
          "When the two populations share a variance, both samples estimate it, and the **pooled variance** combines them, weighting each sample variance by its degrees of freedom:\n\n$$s_p^{2} = \\frac{(n_1 - 1)s_1^{2} + (n_2 - 1)s_2^{2}}{n_1 + n_2 - 2}.$$\n\nIt always lies between $s_1^{2}$ and $s_2^{2}$, closer to the one from the larger sample. The interval then uses $s_p\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}$ as its standard error.",
          "当两个总体方差相同时，两个样本都在估计它，**合并方差**把两者结合起来，以自由度为权重：\n\n$$s_p^{2} = \\frac{(n_1 - 1)s_1^{2} + (n_2 - 1)s_2^{2}}{n_1 + n_2 - 2}.$$\n\n它总在 $s_1^{2}$ 与 $s_2^{2}$ 之间，并更靠近样本较大的那一个。区间的标准误为 $s_p\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(5, 20);
          let n2 = rng.int(5, 20);
          if (n2 === n1) n2 += 3;
          const v1 = rng.int(4, 60);
          let v2 = rng.int(4, 60);
          if (v2 === v1) v2 += 7;
          const num = (n1 - 1) * v1 + (n2 - 1) * v2;
          const df = n1 + n2 - 2;
          const ans = Q.of(num, df);
          return numberProblem({
            prompt: t(
              `Two independent samples from populations with a common variance have $n_1 = ${n1}$, $s_1^{2} = ${v1}$ and $n_2 = ${n2}$, $s_2^{2} = ${v2}$. Find the pooled variance $s_p^{2}$.`,
              `来自方差相同的两个总体的独立样本满足 $n_1 = ${n1}$，$s_1^{2} = ${v1}$；$n_2 = ${n2}$，$s_2^{2} = ${v2}$。求合并方差 $s_p^{2}$。`,
            ),
            answer: ans,
            wrong: [Q.of(v1 + v2, 2), Q.of(n1 * v1 + n2 * v2, n1 + n2), Q.of(num, n1 + n2), Q.of(v1, n1).add(Q.of(v2, n2))],
            solution: t(
              `$s_p^{2} = \\frac{${n1 - 1} \\cdot ${v1} + ${n2 - 1} \\cdot ${v2}}{${n1} + ${n2} - 2} = \\frac{${num}}{${df}}${lowestTerms(num, df)}$.`,
              `$s_p^{2} = \\frac{${n1 - 1} \\cdot ${v1} + ${n2 - 1} \\cdot ${v2}}{${n1} + ${n2} - 2} = \\frac{${num}}{${df}}${lowestTerms(num, df)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.26.3 Confidence Intervals for Two Means: Unequal and Unknown Population Variance
  {
    id: "confidence-intervals-for-differences-between-two-means-unknown-unequal-population-variances",
    title: t("Confidence Intervals for Two Means: Unequal and Unknown Population Variance", "两个均值之差的置信区间：未知且不等的总体方差"),
    summary: t(
      "When population variances are unequal and unknown, Welch's $t$-interval uses $\\text{SE} = \\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}$ with degrees of freedom computed via the Welch–Satterthwaite approximation.",
      "当总体方差未知且不相等时，韦尔奇（Welch）$t$ 区间采用标准误差 $\\text{SE} = \\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}$，并通过韦尔奇–萨特思韦特公式计算自由度。",
    ),
    prerequisites: [
      "confidence-intervals-for-differences-between-two-means-known-population-variances",
      "confidence-intervals-for-one-mean-unknown-population-variance",
    ],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "welch-standard-error-formula",
        title: t("Formulating the standard error for Welch's t interval", "构建韦尔奇 t 区间的标准误差公式"),
        explanation: t(
          "When the variances may differ, the standard error of the difference simply adds the two estimated variances of the sample means. Welch's standard error is $SE = \\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}$.",
          "当方差可能不同时，差的标准误只需把两个样本均值的估计方差相加。韦尔奇标准误差为 $SE = \\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}$。",
        ),
        generate: (rng: Rng): Problem => {
          const s1Sq = rng.int(10, 50);
          const n1 = rng.int(5, 30);
          const s2Sq = rng.int(10, 50);
          const n2 = rng.int(5, 30);
          const num = s1Sq * n2 + s2Sq * n1;
          const den = n1 * n2;

          return numberProblem({
            prompt: t(
              `Two independent samples have sizes $n_1 = ${n1}$, $n_2 = ${n2}$ and sample variances $s_1^2 = ${s1Sq}$, $s_2^2 = ${s2Sq}$. For Welch's $t$ procedure with unequal variances, calculate the squared standard error.`,
              `两个独立样本的容量分别为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$，样本方差分别为 $s_1^2 = ${s1Sq}$ 与 $s_2^2 = ${s2Sq}$。在不等方差的韦尔奇 $t$ 程序下，计算标准误差的平方。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(s1Sq + s2Sq, n1 + n2), Q.of(s1Sq * n1 + s2Sq * n2, den), Q.of(s1Sq + s2Sq, den)],
            solution: t(
              `$\\text{SE}^2 = \\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2} = \\frac{${s1Sq}}{${n1}} + \\frac{${s2Sq}}{${n2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$\\text{SE}^2 = \\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2} = \\frac{${s1Sq}}{${n1}} + \\frac{${s2Sq}}{${n2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
      {
        id: "the-welch-degrees-of-freedom",
        title: t("The Welch degrees of freedom", "韦尔奇自由度"),
        explanation: t(
          "Without equal variances the statistic is only approximately $t$-distributed, with the **Welch–Satterthwaite** degrees of freedom. Writing $a = \\frac{s_1^{2}}{n_1}$ and $b = \\frac{s_2^{2}}{n_2}$,\n\n$$\\nu = \\frac{(a + b)^{2}}{\\frac{a^{2}}{n_1 - 1} + \\frac{b^{2}}{n_2 - 1}}.$$\n\nThe result is usually not a whole number; tables are entered with $\\nu$ rounded **down**, which errs on the side of a wider interval. It always lies between $\\min(n_1, n_2) - 1$ and $n_1 + n_2 - 2$.",
          "方差不相等时，统计量只近似服从 $t$ 分布，自由度由 **韦尔奇–萨特思韦特** 公式给出。记 $a = \\frac{s_1^{2}}{n_1}$，$b = \\frac{s_2^{2}}{n_2}$，\n\n$$\\nu = \\frac{(a + b)^{2}}{\\frac{a^{2}}{n_1 - 1} + \\frac{b^{2}}{n_2 - 1}}.$$\n\n结果通常不是整数；查表时把 $\\nu$ **向下**取整，使区间偏宽、更稳妥。它总介于 $\\min(n_1, n_2) - 1$ 与 $n_1 + n_2 - 2$ 之间。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(6, 16);
          let n2 = rng.int(6, 16);
          if (n2 === n1) n2 += 4;
          const a = Q.of(rng.int(1, 9));
          let b = Q.of(rng.int(1, 9));
          if (b.eq(a)) b = b.add(Q.of(3));
          const nu = a
            .add(b)
            .pow(2)
            .div(
              a
                .pow(2)
                .div(Q.of(n1 - 1))
                .add(b.pow(2).div(Q.of(n2 - 1))),
            );
          const fl = Math.floor(nu.toNumber());
          const wrong = [n1 + n2 - 2, Math.min(n1, n2) - 1, fl + 1].filter((w) => w !== fl);
          return numberProblem({
            prompt: t(
              `For two independent samples, $n_1 = ${n1}$ with $\\frac{s_1^{2}}{n_1} = ${a.toString()}$, and $n_2 = ${n2}$ with $\\frac{s_2^{2}}{n_2} = ${b.toString()}$. Compute the Welch–Satterthwaite degrees of freedom and round down to a whole number.`,
              `两个独立样本满足 $n_1 = ${n1}$，$\\frac{s_1^{2}}{n_1} = ${a.toString()}$；$n_2 = ${n2}$，$\\frac{s_2^{2}}{n_2} = ${b.toString()}$。计算韦尔奇–萨特思韦特自由度，并向下取整。`,
            ),
            answer: fl,
            wrong,
            solution: t(
              `$\\nu = \\frac{(${a.toString()} + ${b.toString()})^{2}}{\\frac{${a.toString()}^{2}}{${n1 - 1}} + \\frac{${b.toString()}^{2}}{${n2 - 1}}} = ${nu.toLatex()} \\approx ${nu.toNumber().toFixed(2)}$, which rounds down to $${fl}$.`,
              `$\\nu = \\frac{(${a.toString()} + ${b.toString()})^{2}}{\\frac{${a.toString()}^{2}}{${n1 - 1}} + \\frac{${b.toString()}^{2}}{${n2 - 1}}} = ${nu.toLatex()} \\approx ${nu.toNumber().toFixed(2)}$，向下取整得 $${fl}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.26.5 Confidence Intervals for Paired Samples: Known Variances
  {
    id: "confidence-intervals-for-paired-samples-known-variances",
    title: t("Confidence Intervals for Paired Samples: Known Variances", "配对样本的置信区间：已知方差"),
    summary: t(
      "When the population variance of differences $\\sigma_d^2$ is known, a $100(1 - \\alpha)\\%$ confidence interval for the mean difference $\\mu_d$ is $\\bar{d} \\pm z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}}$.",
      "当差值总体方差 $\\sigma_d^2$ 已知时，平均差值 $\\mu_d$ 的 $100(1 - \\alpha)\\%$ 置信区间为 $\\bar{d} \\pm z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}}$。",
    ),
    prerequisites: ["confidence-intervals-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "paired-known-variance-margin-of-error",
        title: t("Computing the margin of error for paired samples with known variance", "计算已知方差下配对样本的误差范围"),
        explanation: t(
          "Pairing turns the two samples into a single sample of differences, so the margin of error uses the standard deviation of those differences. The margin of error is $E = z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}}$.",
          "配对把两个样本变成一个差值样本，所以误差范围使用这些差值的标准差。误差范围为 $E = z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}}$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 8);
          const n = k * k;
          const z = rng.pick([2, 3]);
          const sigmaD = k * rng.int(2, 10);
          const margin = z * (sigmaD / k);

          return numberProblem({
            prompt: t(
              `A paired sample of size $n = ${n}$ is drawn where the difference population has known standard deviation $\\sigma_d = ${sigmaD}$. For critical value $z_{\\alpha/2} = ${z}$, calculate the margin of error $E$.`,
              `抽取容量为 $n = ${n}$ 的配对样本，已知差值总体的标准差为 $\\sigma_d = ${sigmaD}$。取临界值 $z_{\\alpha/2} = ${z}$，计算误差范围 $E$。`,
            ),
            answer: margin,
            wrong: [Q.of(z * sigmaD, n), z * sigmaD, Q.of(sigmaD, k)],
            solution: t(
              `$E = z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}} = ${z} \\times \\frac{${sigmaD}}{\\sqrt{${n}}} = ${z} \\times \\frac{${sigmaD}}{${k}} = ${margin}$.`,
              `$E = z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}} = ${z} \\times \\frac{${sigmaD}}{\\sqrt{${n}}} = ${z} \\times \\frac{${sigmaD}}{${k}} = ${margin}$。`,
            ),
          });
        },
      },
      {
        id: "endpoints-of-a-paired-interval",
        title: t("Endpoints of a paired interval", "配对区间的端点"),
        explanation: t(
          "Pairing turns two samples into one sample of differences $d_i = x_i - y_i$. With the standard deviation $\\sigma_d$ of the differences known, the interval for the mean difference is\n\n$$\\bar{d} \\pm z_{\\alpha/2}\\frac{\\sigma_d}{\\sqrt{n}},$$\n\nwhere $n$ is the number of **pairs**. Pairing helps because $\\sigma_d$ removes the variation between subjects and is often far smaller than either population's standard deviation.",
          "配对把两个样本变成一个差值样本 $d_i = x_i - y_i$。若差值的标准差 $\\sigma_d$ 已知，均值差的区间为\n\n$$\\bar{d} \\pm z_{\\alpha/2}\\frac{\\sigma_d}{\\sqrt{n}},$$\n\n其中 $n$ 是**配对数**。配对之所以有效，是因为 $\\sigma_d$ 去掉了个体之间的差异，往往远小于任一总体的标准差。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const k = rng.int(3, 9);
          const se = Q.of(rng.int(1, 8), 2);
          const sd = se.mul(Q.of(k));
          const dbar = Q.of(rng.int(-30, 90), 10);
          const margin = z.mul(se);
          const upper = rng.bool();
          const ans = upper ? dbar.add(margin) : dbar.sub(margin);
          return numberProblem({
            prompt: t(
              `For $${k * k}$ subjects measured before and after a treatment, the mean of the differences (before minus after) is $\\bar{d} = ${dec(dbar)}$, and the differences have known standard deviation $\\sigma_d = ${dec(sd)}$. Find the ${upper ? "upper" : "lower"} endpoint of the $${pct}\\%$ confidence interval for the mean difference (use $z = ${dec(z)}$).`,
              `对 $${k * k}$ 名受试者在处理前后各测一次，差值（处理前减处理后）的均值为 $\\bar{d} = ${dec(dbar)}$，差值的标准差已知为 $\\sigma_d = ${dec(sd)}$。求均值差的 $${pct}\\%$ 置信区间的${upper ? "上" : "下"}端点（取 $z = ${dec(z)}$）。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [
              upper ? dbar.sub(margin) : dbar.add(margin),
              upper ? dbar.add(z.mul(sd)) : dbar.sub(z.mul(sd)),
              upper ? dbar.add(z.mul(sd).div(Q.of(k * k))) : dbar.sub(z.mul(sd).div(Q.of(k * k))),
            ],
            solution: t(
              `The standard error is $\\frac{${dec(sd)}}{\\sqrt{${k * k}}} = ${dec(se)}$ and the margin is $${dec(z)} \\cdot ${dec(se)} = ${dec(margin)}$, so the endpoint is $${par(dbar)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$.`,
              `标准误为 $\\frac{${dec(sd)}}{\\sqrt{${k * k}}} = ${dec(se)}$，误差界为 $${dec(z)} \\cdot ${dec(se)} = ${dec(margin)}$，所以端点为 $${par(dbar)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.26.6 Confidence Intervals for Paired Samples: Unknown Variances
  {
    id: "confidence-intervals-for-paired-samples-unknown-variances",
    title: t("Confidence Intervals for Paired Samples: Unknown Variances", "配对样本的置信区间：未知方差"),
    summary: t(
      "For paired observations $(x_{1i}, x_{2i})$ with unknown variance, analyzing the differences $d_i = x_{1i} - x_{2i}$ gives the confidence interval $\\bar{d} \\pm t_{\\alpha/2, n-1} \\frac{s_d}{\\sqrt{n}}$.",
      "对于方差未知的配对观测值 $(x_{1i}, x_{2i})$，分析差值 $d_i = x_{1i} - x_{2i}$ 给出置信区间 $\\bar{d} \\pm t_{\\alpha/2, n-1} \\frac{s_d}{\\sqrt{n}}$。",
    ),
    prerequisites: [
      "confidence-intervals-for-paired-samples-known-variances",
      "confidence-intervals-for-one-mean-unknown-population-variance",
    ],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "paired-differences-mean-calculation",
        title: t("Computing the mean difference $\\bar{d}$ from paired observations", "根据配对观测值计算平均差值 $\\bar{d}$"),
        explanation: t(
          "Subtract within each pair first, then average the differences; this removes the variation between subjects. The mean difference is $\\bar{d} = \\frac{1}{n} \\sum_i (x_{1i} - x_{2i})$.",
          "先在每一对内部相减，再对差值求平均；这样就消除了个体之间的差异。差值的均值为 $\\bar{d} = \\frac{1}{n} \\sum_i (x_{1i} - x_{2i})$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(4, 8);
          const diffs: number[] = [];
          let sumD = 0;
          for (let i = 0; i < n; i++) {
            const d = rng.int(-5, 15);
            diffs.push(d);
            sumD += d;
          }
          const diffStr = diffs.join(", ");

          return numberProblem({
            prompt: t(
              `In a paired-sample study with $n = ${n}$ subject pairs, the individual differences $d_i = x_{1i} - x_{2i}$ are: $${diffStr}$. Calculate the sample mean difference $\\bar{d}$.`,
              `在包含 $n = ${n}$ 对受试对象的配对样本研究中，各对差值 $d_i = x_{1i} - x_{2i}$ 分别为：$${diffStr}$。计算样本平均差值 $\\bar{d}$。`,
            ),
            answer: Q.of(sumD, n),
            wrong: [Q.of(sumD, n - 1), sumD, Q.of(sumD, n + 1)],
            solution: t(
              `The sum of paired differences is $\\sum d_i = ${sumD}$. Thus $\\bar{d} = \\frac{${sumD}}{${n}}${lowestTerms(sumD, n)}$.`,
              `配对差值之和为 $\\sum d_i = ${sumD}$。因此 $\\bar{d} = \\frac{${sumD}}{${n}}${lowestTerms(sumD, n)}$。`,
            ),
          });
        },
      },
      {
        id: "the-variance-of-the-differences",
        title: t("The variance of the differences", "差值的方差"),
        explanation: t(
          "With $\\sigma_d$ unknown, estimate it from the differences themselves. Subtract within each pair, find the mean $\\bar{d}$, then\n\n$$s_d^{2} = \\frac{\\sum (d_i - \\bar{d})^{2}}{n - 1}.$$\n\nWork with the differences, not with the two columns separately: $s_d^{2}$ is not $s_x^{2} + s_y^{2}$, because the paired values are correlated. The interval is then $\\bar{d} \\pm t_{\\alpha/2, n-1}\\frac{s_d}{\\sqrt{n}}$.",
          "当 $\\sigma_d$ 未知时，用差值本身来估计。先在每对内相减，求出均值 $\\bar{d}$，再算\n\n$$s_d^{2} = \\frac{\\sum (d_i - \\bar{d})^{2}}{n - 1}.$$\n\n要用差值计算，而不是分别处理两列：由于配对数据相关，$s_d^{2}$ 并不等于 $s_x^{2} + s_y^{2}$。区间为 $\\bar{d} \\pm t_{\\alpha/2, n-1}\\frac{s_d}{\\sqrt{n}}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.pick([4, 5]);
          const dbar = rng.int(-3, 6);
          const devs = rng.pick(
            n === 4
              ? [
                  [-2, -1, 1, 2],
                  [-3, 0, 1, 2],
                  [-4, 1, 1, 2],
                  [-3, -1, 1, 3],
                ]
              : [
                  [-2, -1, 0, 1, 2],
                  [-3, -1, 0, 2, 2],
                  [-4, 0, 1, 1, 2],
                  [-2, -2, 0, 1, 3],
                ],
          );
          const order = rng.shuffle([...devs]);
          const ds = order.map((e) => dbar + e);
          const after = ds.map(() => rng.int(20, 60));
          const before = after.map((y, i) => y + (ds[i] ?? 0));
          const ss = devs.reduce((s, e) => s + e * e, 0);
          const ans = Q.of(ss, n - 1);
          return numberProblem({
            prompt: t(
              `Paired measurements (before, after) are ${before.map((x, i) => `$(${x}, ${after[i]})$`).join(", ")}. Using the differences before minus after, find the sample variance $s_d^{2}$ of the differences.`,
              `配对测量值（处理前，处理后）为 ${before.map((x, i) => `$(${x}, ${after[i]})$`).join("，")}。用差值“处理前减处理后”，求差值的样本方差 $s_d^{2}$。`,
            ),
            answer: ans,
            wrong: [Q.of(ss, n), Q.of(ss), Q.of(ss, n - 1).add(Q.of(dbar * dbar))],
            solution: t(
              `The differences are $${ds.join(", ")}$ with mean $\\bar{d} = ${dbar}$. Their deviations $${order.join(", ")}$ have squares summing to $${ss}$, so $s_d^{2} = \\frac{${ss}}{${n - 1}}${lowestTerms(ss, n - 1)}$.`,
              `差值为 $${ds.join(", ")}$，均值 $\\bar{d} = ${dbar}$。离差 $${order.join(", ")}$ 的平方和为 $${ss}$，所以 $s_d^{2} = \\frac{${ss}}{${n - 1}}${lowestTerms(ss, n - 1)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.26.4 Confidence Intervals for Two Proportions
  {
    id: "confidence-intervals-for-differences-between-two-proportions",
    title: t("Confidence Intervals for Two Proportions", "两个比例之差的置信区间"),
    summary: t(
      "A large-sample confidence interval for $p_1 - p_2$ is $(\\hat{p}_1 - \\hat{p}_2) \\pm z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}}$.",
      "两个总体比例之差 $p_1 - p_2$ 的大样本置信区间为 $(\\hat{p}_1 - \\hat{p}_2) \\pm z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}}$。",
    ),
    prerequisites: ["confidence-intervals-for-one-proportion"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "two-proportion-variance-evaluation",
        title: t("Evaluating the estimated variance of difference between two proportions", "计算两个比例之差的估计方差"),
        explanation: t(
          "The two sample proportions are independent, so the variance of their difference is the sum of their estimated variances. $\\operatorname{Var}(\\hat{p}_1 - \\hat{p}_2) = \\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}$.",
          "两个样本比例相互独立，所以它们之差的方差是各自估计方差之和。$\\operatorname{Var}(\\hat{p}_1 - \\hat{p}_2) = \\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = 10 * rng.int(5, 20);
          const n2 = 10 * rng.int(5, 20);
          const [p1, p2] = [rng.pick(SIMPLE_PROPORTIONS), rng.pick(SIMPLE_PROPORTIONS)];
          const v1 = p1.mul(Q.of(1).sub(p1));
          const v2 = p2.mul(Q.of(1).sub(p2));
          const answer = v1.div(Q.of(n1)).add(v2.div(Q.of(n2)));

          return numberProblem({
            prompt: t(
              `Two independent samples of sizes $n_1 = ${n1}$ and $n_2 = ${n2}$ have sample proportions $\\hat{p}_1 = ${p1.toLatex()}$ and $\\hat{p}_2 = ${p2.toLatex()}$. Find the estimated variance of their difference.`,
              `容量分别为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$ 的两个独立样本，样本比例分别为 $\\hat{p}_1 = ${p1.toLatex()}$ 与 $\\hat{p}_2 = ${p2.toLatex()}$。求两者之差的估计方差。`,
            ),
            answer,
            wrong: [v1.div(Q.of(n1)).sub(v2.div(Q.of(n2))), v1.add(v2), v1.div(Q.of(n1))],
            solution: t(
              `Each proportion contributes its own term, and the variances add even for a difference: $\\frac{${v1.toLatex()}}{${n1}} + \\frac{${v2.toLatex()}}{${n2}} = ${answer.toLatex()}$.`,
              `每个比例贡献各自的一项，即使是差，方差也相加：$\\frac{${v1.toLatex()}}{${n1}} + \\frac{${v2.toLatex()}}{${n2}} = ${answer.toLatex()}$。`,
            ),
          });
        },
      },
      {
        id: "endpoints-of-an-interval-for-a-difference-of-proportions",
        title: t("Endpoints of an interval for $p_1 - p_2$", "$p_1 - p_2$ 区间的端点"),
        explanation: t(
          "Each sample proportion estimates its own variance, and the variances add:\n\n$$(\\hat{p}_1 - \\hat{p}_2) \\pm z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}}.$$\n\nCompute the two proportions, the two variance terms, the standard error, and then the margin; keep several decimal places until the final step. An interval that excludes $0$ suggests the two proportions differ.",
          "每个样本比例各自估计自己的方差，方差相加：\n\n$$(\\hat{p}_1 - \\hat{p}_2) \\pm z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}}.$$\n\n依次算出两个比例、两项方差、标准误和误差界；最后一步之前保留足够的小数位。若区间不含 $0$，说明两个比例可能不同。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const n1 = rng.pick([100, 200, 250, 400, 500]);
          const n2 = rng.pick([100, 200, 250, 400, 500]);
          const x1 = rng.int(Math.floor(n1 * 0.2), Math.floor(n1 * 0.8));
          const x2 = rng.int(Math.floor(n2 * 0.2), Math.floor(n2 * 0.8));
          const p1 = x1 / n1;
          const p2 = x2 / n2;
          const v = (p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2;
          const se = Math.sqrt(v);
          const zn = z.toNumber();
          const upper = rng.bool();
          const r3 = (x: number): Q => Q.of(Math.round(x * 1000), 1000);
          const ans = r3(p1 - p2 + (upper ? 1 : -1) * zn * se);
          const wrong = [
            r3(p1 - p2 + (upper ? -1 : 1) * zn * se),
            r3(p1 - p2 + (upper ? 1 : -1) * zn * v),
            r3(p1 - p2 + (upper ? 1 : -1) * zn * (Math.sqrt((p1 * (1 - p1)) / n1) + Math.sqrt((p2 * (1 - p2)) / n2))),
          ].filter((w) => !w.eq(ans));
          return numberProblem({
            prompt: t(
              `In one group, $${x1}$ of $${n1}$ people respond; in an independent group, $${x2}$ of $${n2}$ respond. Find the ${upper ? "upper" : "lower"} endpoint of the $${pct}\\%$ confidence interval for $p_1 - p_2$ (use $z = ${dec(z)}$). Round to three decimal places.`,
              `第一组 $${n1}$ 人中有 $${x1}$ 人响应；另一独立组 $${n2}$ 人中有 $${x2}$ 人响应。求 $p_1 - p_2$ 的 $${pct}\\%$ 置信区间的${upper ? "上" : "下"}端点（取 $z = ${dec(z)}$），精确到三位小数。`,
            ),
            answer: ans,
            form: "decimal",
            wrong,
            solution: t(
              `$\\hat{p}_1 = ${dec(Q.of(x1, n1))}$ and $\\hat{p}_2 = ${dec(Q.of(x2, n2))}$. The variance terms sum to $${v.toFixed(6)}$, so the standard error is $${se.toFixed(4)}$ and the margin is $${dec(z)} \\cdot ${se.toFixed(4)} \\approx ${(zn * se).toFixed(4)}$. The endpoint is $${(p1 - p2).toFixed(4)} ${upper ? "+" : "-"} ${(zn * se).toFixed(4)} \\approx ${dec(ans)}$.`,
              `$\\hat{p}_1 = ${dec(Q.of(x1, n1))}$，$\\hat{p}_2 = ${dec(Q.of(x2, n2))}$。两项方差之和为 $${v.toFixed(6)}$，标准误为 $${se.toFixed(4)}$，误差界为 $${dec(z)} \\cdot ${se.toFixed(4)} \\approx ${(zn * se).toFixed(4)}$。端点为 $${(p1 - p2).toFixed(4)} ${upper ? "+" : "-"} ${(zn * se).toFixed(4)} \\approx ${dec(ans)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.27.1 Estimating Sample Sizes for Means
  {
    id: "sample-size-determination-for-estimating-means",
    title: t("Estimating Sample Sizes for Means", "估计均值所需的样本容量"),
    summary: t(
      "To estimate a population mean $\\mu$ within a margin of error $E$ at $100(1 - \\alpha)\\%$ confidence, the minimum sample size is $n = \\left\\lceil \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^2 \\right\\rceil$.",
      "为了在 $100(1 - \\alpha)\\%$ 置信水平下将总体均值 $\\mu$ 的估计误差控制在 $E$ 之内，所需的最小样本容量为 $n = \\left\\lceil \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^2 \\right\\rceil$。",
    ),
    prerequisites: ["confidence-intervals-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-required-sample-size-mean",
        title: t("Calculating required sample size for mean estimation", "计算均值估计所需的样本容量"),
        explanation: t(
          "Solving the margin of error formula for the sample size shows how many observations are needed, and you round up so the target is met. $n = \\left(\\frac{z \\sigma}{E}\\right)^2$. Always round up to the next integer if the result is not exact.",
          "从误差范围公式中解出样本量，就知道需要多少个观测值；要向上取整，以保证达到目标。$n = \\left(\\frac{z \\sigma}{E}\\right)^2$。若计算结果不是整数，总是向上取整。",
        ),
        generate: (rng: Rng): Problem => {
          const z = rng.pick([2, 3]);
          const E = rng.int(1, 5);
          const mult = rng.int(2, 8);
          const sigma = mult * E; // so z * sigma / E is an integer
          const base = (z * sigma) / E;
          const requiredN = base * base;

          return numberProblem({
            prompt: t(
              `To estimate a population mean with standard deviation $\\sigma = ${sigma}$ within a desired margin of error $E = ${E}$ using critical value $z_{\\alpha/2} = ${z}$, calculate the required sample size.`,
              `已知总体标准差 $\\sigma = ${sigma}$，取临界值 $z_{\\alpha/2} = ${z}$，若期望将总体均值的误差范围控制在 $E = ${E}$ 之内，计算所需的样本容量。`,
            ),
            answer: requiredN,
            wrong: [base, z * base, base * base + 1],
            solution: t(
              `$n = \\left(\\frac{${z} \\times ${sigma}}{${E}}\\right)^2 = (${base})^2 = ${requiredN}$.`,
              `$n = \\left(\\frac{${z} \\times ${sigma}}{${E}}\\right)^2 = (${base})^2 = ${requiredN}$。`,
            ),
          });
        },
      },
      {
        id: "rounding-a-sample-size-up",
        title: t("Rounding a sample size up", "样本容量向上取整"),
        explanation: t(
          "With real critical values the formula $n = \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^{2}$ rarely gives a whole number. Always round **up**, even when the decimal part is tiny: rounding down would give a margin slightly larger than $E$.\n\nFor $95\\%$ confidence, $\\sigma = 12$ and $E = 2$: $\\left(\\frac{1.96 \\cdot 12}{2}\\right)^{2} = 11.76^{2} = 138.2976$, so $n = 139$.",
          "使用真实临界值时，公式 $n = \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^{2}$ 很少得到整数。总是**向上**取整，即使小数部分很小：向下取整会使误差界略大于 $E$。\n\n例如 $95\\%$ 置信，$\\sigma = 12$，$E = 2$：$\\left(\\frac{1.96 \\cdot 12}{2}\\right)^{2} = 11.76^{2} = 138.2976$，所以 $n = 139$。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const sigma = rng.int(3, 30);
          const E = Q.of(rng.pick([5, 10, 15, 20, 25, 30, 40, 50]), 10);
          const base = z.mul(Q.of(sigma)).div(E);
          const n0 = base.pow(2);
          const ceil = Math.ceil(n0.toNumber());
          const fl = Math.floor(n0.toNumber());
          return numberProblem({
            prompt: t(
              `How large a sample is needed to estimate a mean to within $E = ${dec(E)}$ with $${pct}\\%$ confidence, if $\\sigma = ${sigma}$? Use $z = ${dec(z)}$.`,
              `已知 $\\sigma = ${sigma}$，要在 $${pct}\\%$ 置信水平下把均值的估计误差控制在 $E = ${dec(E)}$ 以内，需要多大的样本？取 $z = ${dec(z)}$。`,
            ),
            answer: ceil,
            wrong: [
              fl,
              Math.ceil(base.toNumber()),
              Math.ceil(
                z
                  .mul(Q.of(sigma * sigma))
                  .div(E)
                  .toNumber(),
              ),
            ].filter((w) => w !== ceil),
            solution: t(
              `$\\left(\\frac{${dec(z)} \\cdot ${sigma}}{${dec(E)}}\\right)^{2} \\approx ${n0.toNumber().toFixed(4)}$. Rounding up gives $n = ${ceil}$.`,
              `$\\left(\\frac{${dec(z)} \\cdot ${sigma}}{${dec(E)}}\\right)^{2} \\approx ${n0.toNumber().toFixed(4)}$。向上取整得 $n = ${ceil}$。`,
            ),
          });
        },
      },
    ],
  },

  // Estimating Sample Sizes for Means: Finite Population Correction
  {
    id: "sample-size-determination-for-estimating-means-finite-populations",
    title: t("Estimating Sample Sizes for Means: Finite Population Correction", "估计均值所需的样本容量：有限总体校正"),
    summary: t(
      "For a finite population of size $N$, the required sample size adjusted for FPC is $n = \\frac{N n_0}{n_0 + N - 1}$, where $n_0 = \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^2$.",
      "对于容量为 $N$ 的有限总体，经 FPC 校正后的必要样本容量为 $n = \\frac{N n_0}{n_0 + N - 1}$，其中 $n_0 = \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^2$。",
    ),
    prerequisites: ["sample-size-determination-for-estimating-means", "finite-population-corrections-for-sample-means"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-finite-sample-size-means",
        title: t("Computing adjusted sample size for finite populations", "计算有限总体的校正样本容量"),
        explanation: t(
          "Start from the sample size for an infinite population, then reduce it, since a small population needs fewer observations for the same precision. With the finite population correction, $n = \\frac{N n_0}{n_0 + N - 1}$.",
          "先从无限总体所需的样本量出发，再把它缩小，因为小总体达到同样精度所需的观测更少。经有限总体校正，$n = \\frac{N n_0}{n_0 + N - 1}$。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(200, 1000);
          const n0 = rng.int(50, 200);
          const num = N * n0;
          const den = n0 + N - 1;

          return numberProblem({
            prompt: t(
              `A researcher finds that an infinite-population sample size calculation gives $n_0 = ${n0}$. The actual finite population has size $N = ${N}$. Calculate the exact rational value of the adjusted sample size $n$.`,
              `研究人员计算得到假定无限总体下的样本容量为 $n_0 = ${n0}$。实际有限总体容量为 $N = ${N}$。计算经校正后的必要样本容量 $n$ 的精确有理数值。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(num, n0 + N), Q.of(n0 * (N - 1), N), n0],
            solution: t(
              `$n = \\frac{N n_0}{n_0 + N - 1} = \\frac{(${N})(${n0})}{${n0} + ${N} - 1} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$n = \\frac{N n_0}{n_0 + N - 1} = \\frac{(${N})(${n0})}{${n0} + ${N} - 1} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
      {
        id: "a-finite-population-sample-size-from-the-start",
        title: t("A finite-population sample size from the start", "从头计算有限总体的样本容量"),
        explanation: t(
          "The full calculation has two stages. First find the infinite-population size $n_0 = \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^{2}$, without rounding. Then correct it and round up:\n\n$$n = \\left\\lceil \\frac{N n_0}{n_0 + N - 1} \\right\\rceil.$$\n\nThe correction matters most when $n_0$ is a sizable fraction of $N$; when $N$ is huge it changes almost nothing.",
          "完整计算分两步。先求无限总体下的样本量 $n_0 = \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^{2}$，不取整。再作校正并向上取整：\n\n$$n = \\left\\lceil \\frac{N n_0}{n_0 + N - 1} \\right\\rceil.$$\n\n当 $n_0$ 占 $N$ 的比例较大时，校正最为重要；$N$ 很大时它几乎不改变结果。",
        ),
        generate: (rng: Rng): Problem => {
          const E = rng.int(1, 4);
          const sigma = E * rng.int(4, 12);
          const base = (2 * sigma) / E;
          const n0 = base * base;
          const N = rng.int(Math.max(150, n0), 3000);
          const exact = Q.of(N * n0, n0 + N - 1);
          const ans = Math.ceil(exact.toNumber());
          return numberProblem({
            prompt: t(
              `A population has $N = ${N}$ members and standard deviation $\\sigma = ${sigma}$. Using $z = 2$, find the smallest sample, drawn without replacement, that estimates the mean to within $E = ${E}$.`,
              `某总体有 $N = ${N}$ 个成员，标准差 $\\sigma = ${sigma}$。取 $z = 2$，求不放回抽样时，使均值估计误差不超过 $E = ${E}$ 的最小样本容量。`,
            ),
            answer: ans,
            wrong: [n0, Math.floor(exact.toNumber()), Math.ceil((N * n0) / (n0 + N))].filter((w) => w !== ans),
            solution: t(
              `$n_0 = \\left(\\frac{2 \\cdot ${sigma}}{${E}}\\right)^{2} = ${n0}$, and $\\frac{${N} \\cdot ${n0}}{${n0} + ${N} - 1} = \\frac{${N * n0}}{${n0 + N - 1}} \\approx ${exact.toNumber().toFixed(3)}$, which rounds up to $${ans}$.`,
              `$n_0 = \\left(\\frac{2 \\cdot ${sigma}}{${E}}\\right)^{2} = ${n0}$，$\\frac{${N} \\cdot ${n0}}{${n0} + ${N} - 1} = \\frac{${N * n0}}{${n0 + N - 1}} \\approx ${exact.toNumber().toFixed(3)}$，向上取整得 $${ans}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.27.2 Estimating Sample Sizes for Proportions
  {
    id: "sample-size-determination-for-estimating-proportions",
    title: t("Estimating Sample Sizes for Proportions", "估计比例所需的样本容量"),
    summary: t(
      "The sample size required to estimate a population proportion $p$ within margin $E$ is $n = \\frac{z_{\\alpha/2}^2\\, p(1 - p)}{E^2}$. Using $p = 0.5$ gives the most conservative (largest) sample size.",
      "为了在允许误差 $E$ 内估计总体比例 $p$，所需样本容量为 $n = \\frac{z_{\\alpha/2}^2\\, p(1 - p)}{E^2}$。取 $p = 0.5$ 可获得最保守（最大）的样本容量。",
    ),
    prerequisites: ["confidence-intervals-for-one-proportion", "sample-size-determination-for-estimating-means"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "conservative-sample-size-proportion",
        title: t("Conservative sample size calculation with p = 0.5", "采用 p = 0.5 的保守样本容量计算"),
        explanation: t(
          "Without a prior estimate of the proportion, using one half gives the largest possible variance, so the sample size is large enough whatever the true proportion. $p(1 - p)$ is maximized at $p = 0.5$, where $p(1 - p) = 0.25 = \\frac{1}{4}$, giving $n = \\frac{z^2}{4E^2}$.",
          "在没有比例的先验估计时，取二分之一会给出最大的方差，所以无论真实比例是多少，样本量都足够。$p(1 - p)$ 在 $p = 0.5$ 处取得最大值 $0.25 = \\frac{1}{4}$，因此最保守的样本容量为 $n = \\frac{z^2}{4E^2}$。",
        ),
        generate: (rng: Rng): Problem => {
          // E = 1/k where k in [10, 50]
          const k = rng.int(10, 50);
          // z = 2
          // n = (z^2 * 0.25) / E^2 = (4 * 0.25) * k^2 = k^2
          const n = k * k;

          return numberProblem({
            prompt: t(
              `Using $z_{\\alpha/2} = 2$ and the conservative planning value $p = 0.5$, calculate the required sample size to estimate a population proportion within a margin of error $E = \\frac{1}{${k}}${lowestTerms(1, k)}$.`,
              `取临界值 $z_{\\alpha/2} = 2$ 并采用最保守的规划值 $p = 0.5$，若要将总体比例的误差范围控制在 $E = \\frac{1}{${k}}$ 之内，计算所需的样本容量。`,
            ),
            answer: n,
            wrong: [4 * n, 2 * n, k],
            solution: t(
              `With $p = 0.5$, $p(1 - p) = \\frac{1}{4}$. Thus $n = \\frac{2^2 \\left(\\frac{1}{4}\\right)}{(1/${k})^2} = \\frac{1}{1/${k * k}} = ${n}$.`,
              `取 $p = 0.5$ 时，$p(1 - p) = \\frac{1}{4}$。因此 $n = \\frac{2^2 \\left(\\frac{1}{4}\\right)}{(1/${k})^2} = \\frac{1}{1/${k * k}} = ${n}$。`,
            ),
          });
        },
      },
      {
        id: "sample-size-with-a-planning-value",
        title: t("Sample size with a planning value", "使用规划值的样本容量"),
        explanation: t(
          "When a pilot study or earlier survey gives a planning value $\\tilde{p}$, use it instead of $0.5$:\n\n$$n = \\left\\lceil \\frac{z_{\\alpha/2}^{2}\\,\\tilde{p}(1 - \\tilde{p})}{E^{2}} \\right\\rceil.$$\n\nThe further $\\tilde{p}$ is from $0.5$, the smaller $\\tilde{p}(1 - \\tilde{p})$ and the smaller the sample. For $\\tilde{p} = 0.2$, $E = 0.04$ and $z = 1.96$: $\\frac{3.8416 \\cdot 0.16}{0.0016} = 384.16$, so $n = 385$, against $601$ with $0.5$.",
          "当预调查或以往调查给出规划值 $\\tilde{p}$ 时，用它代替 $0.5$：\n\n$$n = \\left\\lceil \\frac{z_{\\alpha/2}^{2}\\,\\tilde{p}(1 - \\tilde{p})}{E^{2}} \\right\\rceil.$$\n\n$\\tilde{p}$ 离 $0.5$ 越远，$\\tilde{p}(1 - \\tilde{p})$ 越小，所需样本也越小。例如 $\\tilde{p} = 0.2$，$E = 0.04$，$z = 1.96$：$\\frac{3.8416 \\cdot 0.16}{0.0016} = 384.16$，所以 $n = 385$，而用 $0.5$ 则需 $601$。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const p = Q.of(rng.pick([1, 2, 3, 4, 6, 7, 8, 9]), 10);
          const E = Q.of(rng.pick([2, 3, 4, 5, 6]), 100);
          const n0 = z.pow(2).mul(p).mul(Q.one.sub(p)).div(E.pow(2));
          const ans = Math.ceil(n0.toNumber());
          const half = Math.ceil(z.pow(2).div(Q.of(4)).div(E.pow(2)).toNumber());
          return numberProblem({
            prompt: t(
              `A pilot survey suggests a proportion near $${dec(p)}$. How large a sample is needed to estimate the proportion to within $E = ${dec(E)}$ with $${pct}\\%$ confidence? Use $z = ${dec(z)}$.`,
              `预调查显示比例约为 $${dec(p)}$。要在 $${pct}\\%$ 置信水平下把比例的估计误差控制在 $E = ${dec(E)}$ 以内，需要多大的样本？取 $z = ${dec(z)}$。`,
            ),
            answer: ans,
            wrong: [half, Math.floor(n0.toNumber()), Math.ceil(z.mul(p).mul(Q.one.sub(p)).div(E.pow(2)).toNumber())].filter(
              (w) => w !== ans,
            ),
            solution: t(
              `$n = \\frac{${dec(z)}^{2} \\cdot ${dec(p)} \\cdot ${dec(Q.one.sub(p))}}{${dec(E)}^{2}} \\approx ${n0.toNumber().toFixed(3)}$, which rounds up to $${ans}$.`,
              `$n = \\frac{${dec(z)}^{2} \\cdot ${dec(p)} \\cdot ${dec(Q.one.sub(p))}}{${dec(E)}^{2}} \\approx ${n0.toNumber().toFixed(3)}$，向上取整得 $${ans}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.27.3 Estimating Sample Sizes for Proportions: Finite Population Correction
  {
    id: "sample-size-determination-for-estimating-proportions-finite-populations",
    title: t("Estimating Sample Sizes for Proportions: Finite Population Correction", "估计比例所需的样本容量：有限总体校正"),
    summary: t(
      "For a finite population of size $N$, the FPC-adjusted sample size for estimating proportions is $n = \\frac{N n_0}{n_0 + N - 1}$, where $n_0$ is the uncorrected sample size.",
      "对于容量为 $N$ 的有限总体，估计比例时经 FPC 校正的必要样本容量为 $n = \\frac{N n_0}{n_0 + N - 1}$，其中 $n_0$ 为未校正的样本容量。",
    ),
    prerequisites: [
      "sample-size-determination-for-estimating-proportions",
      "sample-size-determination-for-estimating-means-finite-populations",
    ],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-finite-sample-size-proportions",
        title: t("Computing FPC-adjusted sample size for proportions", "计算比例估计的有限总体校正样本容量"),
        explanation: t(
          "The same adjustment applies to proportions: compute the usual sample size first and then correct it for the population size. With the finite population correction, $n = \\frac{N n_0}{n_0 + N - 1}$.",
          "同样的调整也适用于比例：先算出通常的样本量，再根据总体大小修正它。经有限总体校正，$n = \\frac{N n_0}{n_0 + N - 1}$。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(300, 2000);
          const n0 = rng.int(100, 400);
          const num = N * n0;
          const den = n0 + N - 1;

          return numberProblem({
            prompt: t(
              `An initial proportion sample size calculation yields $n_0 = ${n0}$. The finite population contains $N = ${N}$ items. Find the exact rational value of the adjusted sample size $n$.`,
              `初始比例样本容量计算结果为 $n_0 = ${n0}$。实际有限总体包含 $N = ${N}$ 个个体。求经有限校正后的样本容量 $n$ 的精确有理数值。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(num, n0 + N), Q.of(n0 * (N - 1), N), n0],
            solution: t(
              `$n = \\frac{N n_0}{n_0 + N - 1} = \\frac{(${N})(${n0})}{${n0} + ${N} - 1} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$n = \\frac{N n_0}{n_0 + N - 1} = \\frac{(${N})(${n0})}{${n0} + ${N} - 1} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
      {
        id: "a-finite-population-sample-size-for-a-proportion",
        title: t("A finite-population sample size for a proportion", "有限总体下比例的样本容量"),
        explanation: t(
          "Combine the two steps: compute $n_0 = \\frac{z_{\\alpha/2}^{2}\\,p(1 - p)}{E^{2}}$ with $p = 0.5$ unless a planning value is available, then apply the correction and round up:\n\n$$n = \\left\\lceil \\frac{N n_0}{n_0 + N - 1} \\right\\rceil.$$\n\nFor a school of $N = 800$ students, $z = 2$ and $E = 0.05$: $n_0 = 400$ and $n = \\left\\lceil \\frac{320000}{1199} \\right\\rceil = 267$, a third fewer than without the correction.",
          "把两步合起来：除非有规划值，否则取 $p = 0.5$ 计算 $n_0 = \\frac{z_{\\alpha/2}^{2}\\,p(1 - p)}{E^{2}}$，再作校正并向上取整：\n\n$$n = \\left\\lceil \\frac{N n_0}{n_0 + N - 1} \\right\\rceil.$$\n\n例如一所有 $N = 800$ 名学生的学校，$z = 2$，$E = 0.05$：$n_0 = 400$，$n = \\left\\lceil \\frac{320000}{1199} \\right\\rceil = 267$，比不校正少三分之一。",
        ),
        generate: (rng: Rng): Problem => {
          const E = Q.of(rng.pick([2, 3, 4, 5, 6, 8, 10]), 100);
          const n0q = Q.of(4).mul(Q.of(1, 4)).div(E.pow(2));
          const n0 = Math.ceil(n0q.toNumber());
          const N = rng.int(200, 5000);
          const exact = n0q.mul(Q.of(N)).div(n0q.add(Q.of(N - 1)));
          const ans = Math.ceil(exact.toNumber());
          return numberProblem({
            prompt: t(
              `An organization has $N = ${N}$ members. With no prior estimate of the proportion and $z = 2$, how many members must be surveyed, without replacement, to estimate a proportion to within $E = ${dec(E)}$?`,
              `某组织有 $N = ${N}$ 名成员。没有比例的先验估计，取 $z = 2$，不放回地调查多少名成员才能把比例的估计误差控制在 $E = ${dec(E)}$ 以内？`,
            ),
            answer: ans,
            wrong: [
              n0,
              Math.floor(exact.toNumber()),
              Math.ceil(
                n0q
                  .mul(Q.of(N))
                  .div(n0q.add(Q.of(N)))
                  .toNumber(),
              ),
            ].filter((w) => w !== ans && w !== 0),
            solution: t(
              `With $p = 0.5$, $n_0 = \\frac{2^{2} \\cdot 0.25}{${dec(E)}^{2}} = ${n0q.toLatex()}$. Then $\\frac{${N} \\cdot ${n0q.toLatex()}}{${n0q.toLatex()} + ${N - 1}} \\approx ${exact.toNumber().toFixed(3)}$, which rounds up to $${ans}$.`,
              `取 $p = 0.5$，$n_0 = \\frac{2^{2} \\cdot 0.25}{${dec(E)}^{2}} = ${n0q.toLatex()}$。于是 $\\frac{${N} \\cdot ${n0q.toLatex()}}{${n0q.toLatex()} + ${N - 1}} \\approx ${exact.toNumber().toFixed(3)}$，向上取整得 $${ans}$。`,
            ),
          });
        },
      },
    ],
  },
];
