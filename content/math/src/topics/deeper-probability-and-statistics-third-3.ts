// Third knowledge points for thin topics of Probability and Statistics, on hypothesis tests,
// regression inference and goodness of fit: a reverse question, a harder case or a common trap.
// See `deeperProbabilityAndStatisticsThird3Points`.

import type { KnowledgePointDef } from "@ga/content";
import { dec, Q } from "@ga/subject-math";

import { ask, choose, type Pair, point } from "../university-kit.ts";
import { askDecimal, given, givenAmong, nz, oneMinus, phi, zText } from "./deeper-probability-and-statistics-third.ts";

/** TWO_SIDED_T lists two-sided five percent critical values of the t distribution, in thousandths, by degrees of freedom. */
const TWO_SIDED_T: Readonly<Record<number, number>> = {
  4: 2776,
  5: 2571,
  6: 2447,
  7: 2365,
  8: 2306,
  9: 2262,
  10: 2228,
  11: 2201,
  12: 2179,
  13: 2160,
  14: 2145,
  15: 2131,
  16: 2120,
  17: 2110,
  18: 2101,
  19: 2093,
  20: 2086,
  21: 2080,
  22: 2074,
  23: 2069,
  24: 2064,
  25: 2060,
  26: 2056,
};

/** tCrit writes the two-sided five percent t critical value for the given degrees of freedom. */
const tCrit = (df: number) => dec(Q.of(TWO_SIDED_T[df] as number, 1000));

const errorKind = point(
  "naming-the-outcome-of-a-test",
  ["Naming the outcome of a test", "判断检验的结果类型"],
  [
    "A test can go wrong in two different ways. Rejecting a true null hypothesis is a Type I error, and failing to reject a false one is a Type II error. The other two combinations of truth and decision are correct decisions.",
    "检验可能以两种不同方式出错。拒绝真的原假设是第一类错误，未能拒绝假的原假设是第二类错误。真实情况与决定的另外两种组合都是正确的决定。",
  ],
  (rng) => {
    const m0 = rng.int(20, 99);
    const nullTrue = rng.bool();
    const rejects = rng.bool();
    const actual = nullTrue ? m0 : m0 + nz(rng, 9);
    const typeOne: Pair = ["A Type I error", "第一类错误"];
    const typeTwo: Pair = ["A Type II error", "第二类错误"];
    const fine: Pair = ["A correct decision", "正确的决定"];
    const option = nullTrue ? (rejects ? typeOne : fine) : rejects ? fine : typeTwo;
    return choose(
      rng,
      [
        `A test has $H_{0}: \\mu = ${m0}$. In fact $\\mu = ${actual}$, and the test ${rejects ? "rejects" : "does not reject"} $H_{0}$. What has happened?`,
        `检验的原假设是 $H_{0}: \\mu = ${m0}$。实际上 $\\mu = ${actual}$，而检验${rejects ? "拒绝了" : "没有拒绝"} $H_{0}$。发生了什么？`,
      ],
      option,
      [typeOne, typeTwo, fine].filter((o) => o !== option),
      [
        `$H_{0}$ is ${nullTrue ? "true" : "false"} here and the test ${rejects ? "rejects" : "keeps"} it, so the outcome is ${nullTrue ? (rejects ? "a Type I error" : "a correct decision") : rejects ? "a correct decision" : "a Type II error"}.`,
        `这里 $H_{0}$ ${nullTrue ? "为真" : "为假"}，而检验${rejects ? "拒绝了" : "保留了"}它，所以结果是${option[1]}。`,
      ],
    );
  },
);

const poissonCutoff = point(
  "the-smallest-count-that-rejects-a-poisson-rate",
  ["The smallest count that rejects a Poisson rate", "拒绝泊松率的最小计数"],
  [
    "For a large mean, a total count $T$ with mean $n\\lambda_{0}$ under the null hypothesis has standard deviation $\\sqrt{n\\lambda_{0}}$, not the mean itself. Solving the rejection condition for $T$ and rounding up gives the smallest count that rejects.",
    "均值较大时，在原假设下均值为 $n\\lambda_{0}$ 的总计数 $T$，标准差是 $\\sqrt{n\\lambda_{0}}$，而不是均值本身。由拒绝条件解出 $T$ 并向上取整，就得到能拒绝的最小计数。",
  ],
  (rng) => {
    const a = rng.int(1, 3);
    const b = rng.int(2, 9);
    const k = a * b;
    const lambda = a * a;
    const n = b * b;
    const mean = k * k;
    const crit = rng.pick([1282, 1645, 2326]);
    const z = dec(Q.of(crit, 1000));
    const bound = Q.of(mean, 1).add(Q.of(crit * k, 1000));
    const answer = Math.ceil(mean + (crit * k) / 1000);
    return ask(
      [
        `Counts over $${n}$ periods test $H_{0}: \\lambda = ${lambda}$ per period against $\\lambda > ${lambda}$. Using a normal approximation and $z = ${z}$, find the smallest total count that rejects $H_{0}$.`,
        `用 $${n}$ 个时段的计数检验 $H_{0}: \\lambda = ${lambda}$（每时段）对 $\\lambda > ${lambda}$。用正态近似并取 $z = ${z}$，求能拒绝 $H_{0}$ 的最小总计数。`,
      ],
      answer,
      [answer - 1, Math.ceil(mean + (crit * mean) / 1000), mean + k],
      [
        `Under $H_{0}$ the total has mean $${mean}$ and standard deviation $${k}$. Rejection needs $T \\ge ${mean} + ${z} \\cdot ${k} = ${dec(bound)}$, so the smallest count is $${answer}$.`,
        `在 $H_{0}$ 下，总计数的均值是 $${mean}$，标准差是 $${k}$。拒绝需要 $T \\ge ${mean} + ${z} \\cdot ${k} = ${dec(bound)}$，所以最小计数是 $${answer}$。`,
      ],
    );
  },
);

const leftPower = point(
  "the-power-of-a-left-tailed-test",
  ["The power of a left-tailed test", "左尾检验的功效"],
  [
    "Power is the chance of landing in the critical region when the alternative is true. So the region stays fixed, set under the null hypothesis, but the probability is computed with the alternative mean. Using the null mean would give the significance level instead.",
    "功效是备择假设为真时落入临界区域的概率。所以区域固定不变，由原假设确定，但概率要用备择均值计算。用原假设的均值算出的则是显著性水平。",
  ],
  (rng) => {
    const k = rng.int(2, 8);
    const se = 2 * rng.int(1, 5);
    const z = rng.pick([50, 100, 150, 200]);
    const above = rng.bool();
    const c = rng.int(60, 140);
    const shift = (z * se) / 100;
    const mu1 = above ? c - shift : c + shift;
    const mu0 = Math.max(c, mu1) + rng.int(2, 10);
    const answer = above ? phi(z) : oneMinus(phi(z));
    return askDecimal(
      [
        `A test of $H_{0}: \\mu = ${mu0}$ against $\\mu < ${mu0}$ rejects when $\\bar{X} < ${c}$, with $n = ${k * k}$ and $\\sigma = ${k * se}$. Find the power when $\\mu = ${mu1}$. Use $${givenAmong(z)}$.`,
        `检验 $H_{0}: \\mu = ${mu0}$ 对 $\\mu < ${mu0}$，当 $\\bar{X} < ${c}$ 时拒绝，$n = ${k * k}$，$\\sigma = ${k * se}$。求 $\\mu = ${mu1}$ 时的功效。利用 $${givenAmong(z)}$。`,
      ],
      answer,
      [oneMinus(answer), phi(z === 100 ? 150 : 100), oneMinus(phi(z === 100 ? 150 : 100))],
      [
        `The standard error is $\\frac{${k * se}}{${k}} = ${se}$, so with $\\mu = ${mu1}$, $z = \\frac{${c} - ${mu1}}{${se}} = ${above ? "" : "-"}${zText(z)}$. The power is $P(Z < ${above ? "" : "-"}${zText(z)}) = ${dec(answer)}$.`,
        `标准误是 $\\frac{${k * se}}{${k}} = ${se}$，所以当 $\\mu = ${mu1}$ 时，$z = \\frac{${c} - ${mu1}}{${se}} = ${above ? "" : "-"}${zText(z)}$。功效是 $P(Z < ${above ? "" : "-"}${zText(z)}) = ${dec(answer)}$。`,
      ],
    );
  },
);

const rightBeta = point(
  "the-type-ii-error-of-a-right-tailed-test",
  ["The Type II error of a right-tailed test", "右尾检验的第二类错误"],
  [
    "A Type II error happens when the alternative is true but the sample mean stays below the cutoff. So its probability is the area to the left of the cutoff under the alternative distribution, and it depends on which alternative mean is considered.",
    "第二类错误发生在备择假设为真而样本均值仍低于分界点时。所以它的概率是备择分布下分界点左侧的面积，并且取决于所考虑的备择均值。",
  ],
  (rng) => {
    const k = rng.int(2, 8);
    const se = 2 * rng.int(1, 5);
    const z = rng.pick([50, 100, 150, 200]);
    const beyond = rng.bool();
    const c = rng.int(60, 140);
    const shift = (z * se) / 100;
    const mu1 = beyond ? c + shift : c - shift;
    const mu0 = Math.min(c, mu1) - rng.int(2, 10);
    const answer = beyond ? oneMinus(phi(z)) : phi(z);
    return askDecimal(
      [
        `A test of $H_{0}: \\mu = ${mu0}$ against $\\mu > ${mu0}$ rejects when $\\bar{X} > ${c}$, with $n = ${k * k}$ and $\\sigma = ${k * se}$. Find the probability of a Type II error when $\\mu = ${mu1}$. Use $${givenAmong(z)}$.`,
        `检验 $H_{0}: \\mu = ${mu0}$ 对 $\\mu > ${mu0}$，当 $\\bar{X} > ${c}$ 时拒绝，$n = ${k * k}$，$\\sigma = ${k * se}$。求 $\\mu = ${mu1}$ 时犯第二类错误的概率。利用 $${givenAmong(z)}$。`,
      ],
      answer,
      [oneMinus(answer), phi(z === 100 ? 150 : 100), oneMinus(phi(z === 100 ? 150 : 100))],
      [
        `The test fails to reject when $\\bar{X} \\le ${c}$. With standard error $${se}$ and $\\mu = ${mu1}$, $z = \\frac{${c} - ${mu1}}{${se}} = ${beyond ? "-" : ""}${zText(z)}$, so the probability is $${dec(answer)}$.`,
        `当 $\\bar{X} \\le ${c}$ 时检验不拒绝。标准误是 $${se}$，$\\mu = ${mu1}$，所以 $z = \\frac{${c} - ${mu1}}{${se}} = ${beyond ? "-" : ""}${zText(z)}$，概率是 $${dec(answer)}$。`,
      ],
    );
  },
);

const duality = point(
  "a-two-tailed-test-from-a-confidence-interval",
  ["A two-tailed test from a confidence interval", "由置信区间做双尾检验"],
  [
    "A two-tailed test at level $\\alpha$ and a confidence interval at level $1 - \\alpha$ say the same thing. A hypothesized value is rejected exactly when it lies outside the interval, so the decision needs no further calculation once the interval is known.",
    "水平 $\\alpha$ 的双尾检验与水平 $1 - \\alpha$ 的置信区间说的是同一件事。假设值恰好在落在区间外时才被拒绝，所以知道区间后，作出决定无需再计算。",
  ],
  (rng) => {
    const L = rng.int(20, 80);
    const U = L + rng.int(4, 20);
    const inside = rng.bool();
    const m0 = inside ? rng.int(L + 1, U - 1) : rng.bool() ? L - rng.int(1, 9) : U + rng.int(1, 9);
    const reject: Pair = ["Reject $H_{0}$, because the value lies outside the interval", "拒绝 $H_{0}$，因为该值在区间之外"];
    const keep: Pair = ["Do not reject $H_{0}$, because the value lies inside the interval", "不拒绝 $H_{0}$，因为该值在区间之内"];
    const option = inside ? keep : reject;
    return choose(
      rng,
      [
        `A $95\\%$ confidence interval for $\\mu$ is $(${L}, ${U})$. What is the decision on $H_{0}: \\mu = ${m0}$ against $\\mu \\ne ${m0}$ at the $5\\%$ level?`,
        `$\\mu$ 的 $95\\%$ 置信区间是 $(${L}, ${U})$。在 $5\\%$ 水平下，对 $H_{0}: \\mu = ${m0}$ 与 $\\mu \\ne ${m0}$ 作何决定？`,
      ],
      option,
      [
        inside ? reject : keep,
        ["Reject $H_{0}$, because the value lies inside the interval", "拒绝 $H_{0}$，因为该值在区间之内"],
        ["Do not reject $H_{0}$, because the value lies outside the interval", "不拒绝 $H_{0}$，因为该值在区间之外"],
      ],
      [
        `The value $${m0}$ is ${inside ? "inside" : "outside"} $(${L}, ${U})$. A two-tailed $5\\%$ test rejects exactly the values outside the $95\\%$ interval, so $H_{0}$ is ${inside ? "not rejected" : "rejected"}.`,
        `值 $${m0}$ 在 $(${L}, ${U})$ ${inside ? "之内" : "之外"}。双尾 $5\\%$ 检验恰好拒绝 $95\\%$ 区间之外的值，所以${inside ? "不拒绝" : "拒绝"} $H_{0}$。`,
      ],
    );
  },
);

const nForSignificance = point(
  "the-sample-size-that-makes-a-difference-significant",
  ["The sample size that makes a difference significant", "使差异显著的样本量"],
  [
    "With a fixed gap between $\\bar{x}$ and $\\mu_{0}$, the statistic $z$ grows with $\\sqrt{n}$, so a large enough sample makes even a small gap significant. Solving $|z| \\ge 1.96$ for $n$ shows how large, and this is why significance alone does not show importance.",
    "当 $\\bar{x}$ 与 $\\mu_{0}$ 的差距固定时，统计量 $z$ 随 $\\sqrt{n}$ 增大，所以样本足够大时，即使很小的差距也会显著。由 $|z| \\ge 1.96$ 解出 $n$ 可知要多大，这也是显著性本身不能说明重要性的原因。",
  ],
  (rng) => {
    const sigma = rng.int(5, 30);
    const gap = rng.int(1, 6);
    const top = (196 * sigma) ** 2;
    const bottom = (100 * gap) ** 2;
    const answer = Math.ceil(top / bottom);
    const lean = Math.ceil(((1.645 * sigma) / gap) ** 2);
    const bound = (top / bottom).toFixed(2);
    return ask(
      [
        `A population has $\\sigma = ${sigma}$, and the sample mean is $${gap}$ away from $\\mu_{0}$. What is the smallest $n$ for which a two-tailed $z$ test with critical value $1.96$ rejects $H_{0}$?`,
        `总体的 $\\sigma = ${sigma}$，样本均值与 $\\mu_{0}$ 相差 $${gap}$。双尾 $z$ 检验的临界值是 $1.96$，要拒绝 $H_{0}$，最小的 $n$ 是多少？`,
      ],
      answer,
      [answer - 1, lean, Math.ceil((1.96 * sigma) / gap)],
      [
        `We need $\\frac{${gap}\\sqrt{n}}{${sigma}} \\ge 1.96$, so $n \\ge \\left(\\frac{1.96 \\cdot ${sigma}}{${gap}}\\right)^{2} \\approx ${bound}$. The smallest whole number meeting this is $${answer}$.`,
        `需要 $\\frac{${gap}\\sqrt{n}}{${sigma}} \\ge 1.96$，所以 $n \\ge \\left(\\frac{1.96 \\cdot ${sigma}}{${gap}}\\right)^{2} \\approx ${bound}$。满足条件的最小整数是 $${answer}$。`,
      ],
    );
  },
);

const pValueBracket = point(
  "bracketing-a-p-value-from-a-t-table",
  ["Bracketing a p-value from a t table", "由 t 表确定 p 值的范围"],
  [
    "A $t$ table lists only a few critical values, so it cannot give an exact $p$-value. It can give a range: the observed statistic falls between two listed values, and the tail probability falls between the two corresponding areas, with a larger statistic meaning a smaller $p$-value.",
    "$t$ 表只列出少数几个临界值，所以不能给出精确的 $p$ 值，但可以给出范围：观察到的统计量落在两个列出的值之间，尾部概率也就落在两个对应的面积之间，统计量越大，$p$ 值越小。",
  ],
  (rng) => {
    const j = rng.int(1, 6);
    const t10 = rng.int(11, 40);
    const value = t10 / 10;
    const mu0 = rng.int(20, 80);
    const xbar = Q.of(mu0, 1).add(Q.of(t10 * j, 10));
    const a: Pair = ["$p > 0.05$", "$p > 0.05$"];
    const b: Pair = ["$0.025 < p < 0.05$", "$0.025 < p < 0.05$"];
    const c: Pair = ["$0.01 < p < 0.025$", "$0.01 < p < 0.025$"];
    const d: Pair = ["$p < 0.01$", "$p < 0.01$"];
    const option = value < 1.86 ? a : value < 2.306 ? b : value < 2.896 ? c : d;
    return choose(
      rng,
      [
        `A sample of $n = 9$ has $\\bar{x} = ${dec(xbar)}$ and $s = ${3 * j}$. For $H_{0}: \\mu = ${mu0}$ against $\\mu > ${mu0}$, the $t$ table with $8$ degrees of freedom gives upper tail areas $0.05, 0.025, 0.01$ at $1.860, 2.306, 2.896$. What can be said about the $p$-value?`,
        `容量为 $n = 9$ 的样本满足 $\\bar{x} = ${dec(xbar)}$，$s = ${3 * j}$。对 $H_{0}: \\mu = ${mu0}$ 与 $\\mu > ${mu0}$，自由度为 $8$ 的 $t$ 表给出：上尾面积 $0.05, 0.025, 0.01$ 分别对应 $1.860, 2.306, 2.896$。关于 $p$ 值能得出什么结论？`,
      ],
      option,
      [a, b, c, d].filter((o) => o !== option),
      [
        `The standard error is $\\frac{${3 * j}}{3} = ${j}$, so $t = ${dec(Q.of(t10, 10))}$. Placing this among the listed values gives ${option[0]}.`,
        `标准误是 $\\frac{${3 * j}}{3} = ${j}$，所以 $t = ${dec(Q.of(t10, 10))}$。把它放在列出的值之间，得 ${option[1]}。`,
      ],
    );
  },
);

const varianceCutoff = point(
  "the-smallest-sample-variance-that-rejects",
  ["The smallest sample variance that rejects", "能拒绝的最小样本方差"],
  [
    "The chi-square statistic $\\frac{(n - 1)s^{2}}{\\sigma_{0}^{2}}$ can be solved for $s^{2}$. So a critical value can be turned into a cutoff on the sample variance itself, which is often the form needed when a limit is set in advance for quality control.",
    "卡方统计量 $\\frac{(n - 1)s^{2}}{\\sigma_{0}^{2}}$ 可以解出 $s^{2}$。所以临界值可以转换为样本方差本身的分界点，这常常是质量控制中预先设定界限时所需的形式。",
  ],
  (rng) => {
    const [df, chiK] = rng.pick([
      [9, 16919],
      [14, 23685],
      [19, 30144],
      [24, 36415],
    ] as const);
    const m = rng.int(1, 12);
    const v0 = df * m;
    const chi = Q.of(chiK, 1000);
    const answer = chi.mul(Q.of(m, 1));
    return askDecimal(
      [
        `A sample of $n = ${df + 1}$ tests $H_{0}: \\sigma^{2} = ${v0}$ against $\\sigma^{2} > ${v0}$, with critical value $${dec(chi)}$. Find the smallest $s^{2}$ that rejects $H_{0}$.`,
        `容量为 $n = ${df + 1}$ 的样本检验 $H_{0}: \\sigma^{2} = ${v0}$ 对 $\\sigma^{2} > ${v0}$，临界值是 $${dec(chi)}$。求能拒绝 $H_{0}$ 的最小 $s^{2}$。`,
      ],
      answer,
      [chi.mul(Q.of(v0, 1)), Q.of(v0, 1), chi.mul(Q.of(v0, df + 1))],
      [
        `Rejection needs $\\frac{${df}s^{2}}{${v0}} \\ge ${dec(chi)}$. So $s^{2} \\ge \\frac{${dec(chi)} \\cdot ${v0}}{${df}} = ${dec(answer)}$.`,
        `拒绝需要 $\\frac{${df}s^{2}}{${v0}} \\ge ${dec(chi)}$。所以 $s^{2} \\ge \\frac{${dec(chi)} \\cdot ${v0}}{${df}} = ${dec(answer)}$。`,
      ],
    );
  },
);

const nonzeroDifference = point(
  "testing-a-nonzero-difference-of-means",
  ["Testing a nonzero difference of means", "检验均值之差不为零的情形"],
  [
    "A null hypothesis can claim a specific gap, such as $\\mu_{1} - \\mu_{2} = \\delta$, and not only equality. The hypothesized gap is then subtracted in the numerator of the statistic, while the standard error stays the same as for a test of equal means.",
    "原假设可以断言一个具体的差距，如 $\\mu_{1} - \\mu_{2} = \\delta$，而不只是相等。这时要在统计量的分子中减去假设的差距，而标准误与检验均值相等时相同。",
  ],
  (rng) => {
    const k = rng.int(1, 4);
    const n1 = rng.int(9, 30);
    const n2 = rng.int(9, 30);
    const v1 = 9 * k * k * n1;
    const v2 = 16 * k * k * n2;
    const se = 5 * k;
    const delta = rng.int(2, 15);
    let gap = delta + nz(rng, 20);
    if (gap === 0) gap = delta + 1;
    const mu2 = rng.int(50, 90);
    const answer = Q.of(gap - delta, se);
    return ask(
      [
        `Samples give $\\bar{x}_{1} = ${mu2 + gap}$, $n_{1} = ${n1}$ with $\\sigma_{1}^{2} = ${v1}$, and $\\bar{x}_{2} = ${mu2}$, $n_{2} = ${n2}$ with $\\sigma_{2}^{2} = ${v2}$. Find the $z$ statistic for $H_{0}: \\mu_{1} - \\mu_{2} = ${delta}$.`,
        `样本给出 $\\bar{x}_{1} = ${mu2 + gap}$，$n_{1} = ${n1}$，$\\sigma_{1}^{2} = ${v1}$；以及 $\\bar{x}_{2} = ${mu2}$，$n_{2} = ${n2}$，$\\sigma_{2}^{2} = ${v2}$。求 $H_{0}: \\mu_{1} - \\mu_{2} = ${delta}$ 的 $z$ 统计量。`,
      ],
      answer,
      [Q.of(gap, se), Q.of(gap - delta, 7 * k), Q.of(gap + delta, se)],
      [
        `The standard error is $\\sqrt{${9 * k * k} + ${16 * k * k}} = ${se}$. The observed gap is $${gap}$, so $z = \\frac{${gap} - ${delta}}{${se}} = ${answer.toLatex()}$.`,
        `标准误是 $\\sqrt{${9 * k * k} + ${16 * k * k}} = ${se}$。观察到的差距是 $${gap}$，所以 $z = \\frac{${gap} - ${delta}}{${se}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const pooledDecision = point(
  "the-right-degrees-of-freedom-for-a-pooled-test",
  ["The right degrees of freedom for a pooled test", "合并检验的正确自由度"],
  [
    "A pooled two-sample $t$ test has $n_{1} + n_{2} - 2$ degrees of freedom, since each sample mean uses one up. Choosing the smaller sample's degrees of freedom gives a larger critical value, which can change the decision when the statistic falls between the two.",
    "合并的双样本 $t$ 检验有 $n_{1} + n_{2} - 2$ 个自由度，因为每个样本均值用掉一个。若选用较小样本的自由度，临界值会更大，当统计量落在两者之间时，这可能改变决定。",
  ],
  (rng) => {
    const n1 = rng.int(5, 14);
    const n2 = rng.int(5, 14);
    const df = n1 + n2 - 2;
    const small = Math.min(n1, n2) - 1;
    const low = TWO_SIDED_T[df] as number;
    const high = TWO_SIDED_T[small] as number;
    const rejects = rng.bool();
    const stat = rejects ? ((low + high) / 2000).toFixed(2) : ((low - 100 * rng.int(1, 8)) / 1000).toFixed(2);
    const shown = rng.shuffle([`t_{${df}} = ${tCrit(df)}`, `t_{${small}} = ${tCrit(small)}`]);
    const yes: Pair = [`Reject $H_{0}$, using $${df}$ degrees of freedom`, `拒绝 $H_{0}$，自由度用 $${df}$`];
    const no: Pair = [`Do not reject $H_{0}$, using $${df}$ degrees of freedom`, `不拒绝 $H_{0}$，自由度用 $${df}$`];
    const trapYes: Pair = [`Reject $H_{0}$, using $${small}$ degrees of freedom`, `拒绝 $H_{0}$，自由度用 $${small}$`];
    const trapNo: Pair = [`Do not reject $H_{0}$, using $${small}$ degrees of freedom`, `不拒绝 $H_{0}$，自由度用 $${small}$`];
    const option = rejects ? yes : no;
    return choose(
      rng,
      [
        `A pooled two-tailed $t$ test at the $5\\%$ level, with $n_{1} = ${n1}$ and $n_{2} = ${n2}$, gives $t = ${stat}$. The two-tailed critical values are $${shown.join(", ")}$. What is the decision?`,
        `$5\\%$ 水平的合并双尾 $t$ 检验，$n_{1} = ${n1}$，$n_{2} = ${n2}$，得 $t = ${stat}$。双尾临界值是 $${shown.join("，")}$。应作何决定？`,
      ],
      option,
      [rejects ? no : yes, trapYes, trapNo],
      [
        `The pooled test has $${n1} + ${n2} - 2 = ${df}$ degrees of freedom, so the critical value is $${tCrit(df)}$. Since $${stat}$ is ${rejects ? "above" : "below"} it, $H_{0}$ is ${rejects ? "rejected" : "not rejected"}.`,
        `合并检验的自由度是 $${n1} + ${n2} - 2 = ${df}$，所以临界值是 $${tCrit(df)}$。由于 $${stat}$ ${rejects ? "大于" : "小于"}它，所以${rejects ? "拒绝" : "不拒绝"} $H_{0}$。`,
      ],
    );
  },
);

const conservativeDf = point(
  "the-conservative-degrees-of-freedom",
  ["The conservative degrees of freedom", "保守的自由度"],
  [
    "When the variances are not assumed equal, the Welch formula for the degrees of freedom is long. A simple conservative choice is the smaller of $n_{1} - 1$ and $n_{2} - 1$, which gives a larger critical value and makes a false rejection less likely.",
    "不假设方差相等时，韦尔奇自由度公式很长。一个简单的保守选择是取 $n_{1} - 1$ 与 $n_{2} - 1$ 中较小者，它给出更大的临界值，使错误拒绝的可能性更小。",
  ],
  (rng) => {
    const n1 = rng.int(5, 40);
    let n2 = rng.int(5, 40);
    if (n2 === n1) n2 = n1 + 3;
    const answer = Math.min(n1, n2) - 1;
    const v1 = rng.int(5, 40);
    const v2 = rng.int(41, 90);
    return ask(
      [
        `Two samples of sizes $${n1}$ and $${n2}$ have sample variances $${v1}$ and $${v2}$, not assumed to come from equal population variances. How many degrees of freedom does the conservative rule use?`,
        `容量为 $${n1}$ 和 $${n2}$ 的两个样本，样本方差为 $${v1}$ 和 $${v2}$，不假设总体方差相等。保守规则使用多少个自由度？`,
      ],
      answer,
      [n1 + n2 - 2, Math.max(n1, n2) - 1, Math.min(n1, n2)],
      [
        `The conservative rule takes the smaller of $${n1 - 1}$ and $${n2 - 1}$, which is $${answer}$. The variances play no part in it.`,
        `保守规则取 $${n1 - 1}$ 与 $${n2 - 1}$ 中较小者，即 $${answer}$。方差不参与这一规则。`,
      ],
    );
  },
);

const whenToPool = point(
  "when-to-pool-two-sample-proportions",
  ["When to pool two sample proportions", "何时合并两个样本比例"],
  [
    "The standard error of a test statistic is computed as if the null hypothesis were true. If it says $p_{1} = p_{2}$, there is one common proportion to estimate, so the samples are pooled. If it claims a nonzero gap, there is no common value and the two are used separately.",
    "检验统计量的标准误要按原假设为真来计算。如果它说 $p_{1} = p_{2}$，就只有一个公共比例要估计，所以合并样本。如果它断言差距不为零，就没有公共值，两者要分开使用。",
  ],
  (rng) => {
    const n1 = 10 * rng.int(5, 30);
    const n2 = 10 * rng.int(5, 30);
    const x1 = rng.int(10, n1 - 10);
    const x2 = rng.int(10, n2 - 10);
    const equal = rng.bool();
    const delta = dec(Q.of(rng.pick([2, 5, 10, 15, 20]), 100));
    const h0 = equal ? "p_{1} = p_{2}" : `p_{1} - p_{2} = ${delta}`;
    const pooled: Pair = ["Pool the samples into one estimate of the proportion", "把样本合并为比例的一个估计"];
    const apart: Pair = ["Use $\\hat{p}_{1}$ and $\\hat{p}_{2}$ separately", "分别使用 $\\hat{p}_{1}$ 和 $\\hat{p}_{2}$"];
    const half: Pair = ["Use the value $\\frac{1}{2}$ for both proportions", "两个比例都用 $\\frac{1}{2}$"];
    const first: Pair = ["Use only the larger sample's proportion", "只用较大样本的比例"];
    const option = equal ? pooled : apart;
    return choose(
      rng,
      [
        `Samples give $${x1}$ successes of $${n1}$ and $${x2}$ successes of $${n2}$. For a test of $H_{0}: ${h0}$, how should the standard error be estimated?`,
        `样本给出 $${n1}$ 次中成功 $${x1}$ 次，以及 $${n2}$ 次中成功 $${x2}$ 次。检验 $H_{0}: ${h0}$ 时，应如何估计标准误？`,
      ],
      option,
      [equal ? apart : pooled, half, first],
      equal
        ? [
            `Under $H_{0}$ the proportions share one value, so the best estimate is the pooled $\\frac{${x1} + ${x2}}{${n1} + ${n2}}$.`,
            `在 $H_{0}$ 下两个比例共用一个值，所以最好的估计是合并的 $\\frac{${x1} + ${x2}}{${n1} + ${n2}}$。`,
          ]
        : [
            `Under $H_{0}$ the proportions differ by $${delta}$, so they have no common value to estimate, and pooling would not match the hypothesis.`,
            `在 $H_{0}$ 下两个比例相差 $${delta}$，所以没有公共值可估计，合并与假设不符。`,
          ],
    );
  },
);

const leastPairedMean = point(
  "the-least-mean-difference-that-is-significant",
  ["The least mean difference that is significant", "显著的最小平均差"],
  [
    "Solving the paired $z$ statistic for $\\bar{d}$ gives the smallest mean difference a study can detect. It equals the critical value times $\\frac{\\sigma_{d}}{\\sqrt{n}}$, so researchers can see before collecting data whether the effect they expect would reach significance.",
    "由配对 $z$ 统计量解出 $\\bar{d}$，就得到研究能检测到的最小平均差。它等于临界值乘以 $\\frac{\\sigma_{d}}{\\sqrt{n}}$，所以研究者在收集数据之前就能看出预期效应能否达到显著。",
  ],
  (rng) => {
    const k = rng.int(2, 10);
    const j = rng.int(1, 6);
    const crit = rng.pick([1282, 1645, 2326]);
    const c = Q.of(crit, 1000);
    const answer = c.mul(Q.of(j, 1));
    return askDecimal(
      [
        `A paired study has $n = ${k * k}$ pairs and known $\\sigma_{d} = ${k * j}$. For a right-tailed test with critical value $${dec(c)}$, find the smallest $\\bar{d}$ that rejects $H_{0}: \\mu_{d} = 0$.`,
        `配对研究有 $n = ${k * k}$ 对，已知 $\\sigma_{d} = ${k * j}$。对临界值为 $${dec(c)}$ 的右尾检验，求能拒绝 $H_{0}: \\mu_{d} = 0$ 的最小 $\\bar{d}$。`,
      ],
      answer,
      [c.mul(Q.of(k * j, 1)), c.mul(Q.of(j, k)), c.mul(Q.of(j, 2)), Q.of(j, 1)],
      [
        `We need $\\frac{\\bar{d}}{${k * j} / ${k}} \\ge ${dec(c)}$. The standard error is $${j}$, so $\\bar{d} \\ge ${dec(c)} \\cdot ${j} = ${dec(answer)}$.`,
        `需要 $\\frac{\\bar{d}}{${k * j} / ${k}} \\ge ${dec(c)}$。标准误是 $${j}$，所以 $\\bar{d} \\ge ${dec(c)} \\cdot ${j} = ${dec(answer)}$。`,
      ],
    );
  },
);

const pairedDecision = point(
  "the-degrees-of-freedom-of-a-paired-test",
  ["The degrees of freedom of a paired test", "配对检验的自由度"],
  [
    "A paired test has one sample of differences, so its degrees of freedom are the number of pairs minus one. Counting the two columns as independent samples would nearly double this, and the smaller critical value could produce a rejection the data do not support.",
    "配对检验只有一个差值样本，所以自由度是对数减一。如果把两列当作独立样本，自由度几乎翻倍，较小的临界值可能产生数据不支持的拒绝。",
  ],
  (rng) => {
    const n = rng.int(5, 14);
    const df = n - 1;
    const wide = 2 * n - 2;
    const high = TWO_SIDED_T[df] as number;
    const low = TWO_SIDED_T[wide] as number;
    const rejects = rng.bool();
    const stat = rejects ? ((high + 100 * rng.int(1, 8)) / 1000).toFixed(2) : ((high + low) / 2000).toFixed(2);
    const shown = rng.shuffle([`t_{${df}} = ${tCrit(df)}`, `t_{${wide}} = ${tCrit(wide)}`]);
    const yes: Pair = [`Reject $H_{0}$, using $${df}$ degrees of freedom`, `拒绝 $H_{0}$，自由度用 $${df}$`];
    const no: Pair = [`Do not reject $H_{0}$, using $${df}$ degrees of freedom`, `不拒绝 $H_{0}$，自由度用 $${df}$`];
    const trap: Pair = [`Reject $H_{0}$, using $${wide}$ degrees of freedom`, `拒绝 $H_{0}$，自由度用 $${wide}$`];
    const trapNo: Pair = [`Do not reject $H_{0}$, using $${wide}$ degrees of freedom`, `不拒绝 $H_{0}$，自由度用 $${wide}$`];
    const option = rejects ? yes : no;
    return choose(
      rng,
      [
        `A two-tailed paired $t$ test at the $5\\%$ level on $${n}$ pairs gives $t = ${stat}$. The two-tailed critical values are $${shown.join(", ")}$. What is the decision?`,
        `对 $${n}$ 对数据做 $5\\%$ 水平的配对双尾 $t$ 检验，得 $t = ${stat}$。双尾临界值是 $${shown.join("，")}$。应作何决定？`,
      ],
      option,
      [rejects ? no : yes, trap, trapNo],
      [
        `The test uses the $${n}$ differences as one sample, so there are $${df}$ degrees of freedom and the critical value is $${tCrit(df)}$. Since $${stat}$ is ${rejects ? "above" : "below"} it, $H_{0}$ is ${rejects ? "rejected" : "not rejected"}.`,
        `检验把 $${n}$ 个差值当作一个样本，所以自由度是 $${df}$，临界值是 $${tCrit(df)}$。由于 $${stat}$ ${rejects ? "大于" : "小于"}它，所以${rejects ? "拒绝" : "不拒绝"} $H_{0}$。`,
      ],
    );
  },
);

const fDegrees = point(
  "the-degrees-of-freedom-of-an-f-ratio",
  ["The degrees of freedom of an F ratio", "F 比值的自由度"],
  [
    "When the larger sample variance goes on top, $F$ is at least one and an upper tail value applies. The degrees of freedom then follow the variances, not the labels: the numerator's come from the sample with the larger variance, whichever sample that is.",
    "把较大的样本方差放在分子时，$F$ 至少为一，适用上尾值。这时自由度跟随方差而不是标号：分子的自由度来自方差较大的样本，不论它是哪一个。",
  ],
  (rng) => {
    const n1 = rng.int(6, 30);
    let n2 = rng.int(6, 30);
    if (n2 === n1) n2 = n1 + 4;
    const a = rng.int(5, 40);
    const b = rng.int(41, 90);
    const firstLarger = rng.bool();
    const v1 = firstLarger ? b : a;
    const v2 = firstLarger ? a : b;
    const askTop = rng.bool();
    const nTop = firstLarger ? n1 : n2;
    const nBottom = firstLarger ? n2 : n1;
    const answer = askTop ? nTop - 1 : nBottom - 1;
    const other = askTop ? nBottom - 1 : nTop - 1;
    return ask(
      [
        `Samples have $n_{1} = ${n1}$, $s_{1}^{2} = ${v1}$ and $n_{2} = ${n2}$, $s_{2}^{2} = ${v2}$. An $F$ ratio is formed with the larger variance on top. Find the ${askTop ? "numerator" : "denominator"} degrees of freedom.`,
        `样本满足 $n_{1} = ${n1}$，$s_{1}^{2} = ${v1}$；$n_{2} = ${n2}$，$s_{2}^{2} = ${v2}$。构造 $F$ 比值时把较大的方差放在分子。求${askTop ? "分子" : "分母"}的自由度。`,
      ],
      answer,
      [other, answer + 1, n1 + n2 - 2],
      [
        `The larger variance is $${b}$, from the sample of $${nTop}$, so it is on top with $${nTop - 1}$ degrees of freedom. The denominator has $${nBottom - 1}$, so the requested value is $${answer}$.`,
        `较大的方差是 $${b}$，来自容量为 $${nTop}$ 的样本，所以它在分子，自由度是 $${nTop - 1}$。分母的自由度是 $${nBottom - 1}$，所以所求的值是 $${answer}$。`,
      ],
    );
  },
);

const anovaF = point(
  "the-f-statistic-from-the-sums-of-squares",
  ["The F statistic from the sums of squares", "由平方和求 F 统计量"],
  [
    "The two sums of squares are not compared directly, because they are built from different numbers of independent pieces. Each is first divided by its degrees of freedom to give a mean square, and the statistic $F$ is the ratio of the two mean squares.",
    "两个平方和不能直接比较，因为它们由不同数目的独立部分构成。要先分别除以各自的自由度得到均方，统计量 $F$ 是两个均方之比。",
  ],
  (rng) => {
    const k = rng.int(3, 6);
    const m = rng.int(4, 12);
    const N = k * m;
    const ssb = rng.int(10, 200);
    const ssw = rng.int(50, 400);
    const answer = Q.of(ssb, k - 1).div(Q.of(ssw, N - k));
    return ask(
      [
        `A one-factor study has $${k}$ groups and $${N}$ observations in all, with $SS_{\\text{between}} = ${ssb}$ and $SS_{\\text{within}} = ${ssw}$. Find the $F$ statistic.`,
        `单因素研究有 $${k}$ 组，共 $${N}$ 个观测，$SS_{\\text{between}} = ${ssb}$，$SS_{\\text{within}} = ${ssw}$。求 $F$ 统计量。`,
      ],
      answer,
      [Q.of(ssb, ssw), Q.of(ssb, k).div(Q.of(ssw, N)), Q.of(ssw, N - k).div(Q.of(ssb, k - 1))],
      [
        `The mean squares are $\\frac{${ssb}}{${k - 1}}$ and $\\frac{${ssw}}{${N - k}}$. Their ratio is $F = ${answer.toLatex()}$.`,
        `均方分别是 $\\frac{${ssb}}{${k - 1}}$ 和 $\\frac{${ssw}}{${N - k}}$。它们的比是 $F = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const slopeT = point(
  "the-slope-statistic-behind-the-interval",
  ["The slope statistic behind the interval", "区间背后的斜率统计量"],
  [
    "A slope interval is $b_{1} \\pm t \\cdot s_{b_{1}}$, so it excludes zero exactly when $\\left|\\frac{b_{1}}{s_{b_{1}}}\\right|$ exceeds the critical value. This ratio is the statistic for testing that the slope is zero, and it uses $n - 2$ degrees of freedom.",
    "斜率区间是 $b_{1} \\pm t \\cdot s_{b_{1}}$，所以它不含零恰好相当于 $\\left|\\frac{b_{1}}{s_{b_{1}}}\\right|$ 超过临界值。这个比值就是检验斜率为零的统计量，自由度是 $n - 2$。",
  ],
  (rng) => {
    const b = nz(rng, 30);
    const se = rng.int(2, 12);
    const n = rng.int(10, 40);
    const answer = Q.of(b, se);
    const sqrtDivided = Q.of(b * se, 1);
    return ask(
      [
        `A regression on $n = ${n}$ points has slope $b_{1} = ${b}$ with standard error $${se}$. Find the $t$ statistic for $H_{0}: \\beta_{1} = 0$.`,
        `对 $n = ${n}$ 个点的回归，斜率 $b_{1} = ${b}$，标准误是 $${se}$。求 $H_{0}: \\beta_{1} = 0$ 的 $t$ 统计量。`,
      ],
      answer,
      [Q.of(se, b), sqrtDivided, Q.of(b, se * n)],
      [
        `The standard error already accounts for the sample size, so $t = \\frac{${b}}{${se}} = ${answer.toLatex()}$, with $${n - 2}$ degrees of freedom.`,
        `标准误已经考虑了样本量，所以 $t = \\frac{${b}}{${se}} = ${answer.toLatex()}$，自由度是 $${n - 2}$。`,
      ],
    );
  },
);

const interceptCenter = point(
  "the-center-of-the-intercept-interval",
  ["The center of the intercept interval", "截距区间的中心"],
  [
    "The least squares line always passes through $(\\bar{x}, \\bar{y})$, so the intercept estimate is $b_{0} = \\bar{y} - b_{1}\\bar{x}$. This value is the center of the confidence interval for the intercept, and it can be found without the original data.",
    "最小二乘直线总是经过 $(\\bar{x}, \\bar{y})$，所以截距估计是 $b_{0} = \\bar{y} - b_{1}\\bar{x}$。这个值是截距置信区间的中心，无需原始数据就能求出。",
  ],
  (rng) => {
    const xbar = rng.int(2, 15);
    const ybar = rng.int(10, 60);
    const b = nz(rng, 6);
    const answer = ybar - b * xbar;
    const sign = b > 0 ? "-" : "+";
    return ask(
      [
        `A regression has $\\bar{x} = ${xbar}$, $\\bar{y} = ${ybar}$ and slope $b_{1} = ${b}$. Find the center of the confidence interval for the intercept $\\beta_{0}$.`,
        `回归满足 $\\bar{x} = ${xbar}$，$\\bar{y} = ${ybar}$，斜率 $b_{1} = ${b}$。求截距 $\\beta_{0}$ 的置信区间的中心。`,
      ],
      answer,
      [ybar + b * xbar, ybar, xbar - b * ybar],
      [
        `The interval is centered at the estimate $b_{0}$. The fitted line passes through the means, so $b_{0} = ${ybar} ${sign} ${Math.abs(b)} \\cdot ${xbar} = ${answer}$.`,
        `区间以估计值 $b_{0}$ 为中心。拟合直线经过均值点，所以 $b_{0} = ${ybar} ${sign} ${Math.abs(b)} \\cdot ${xbar} = ${answer}$。`,
      ],
    );
  },
);

const threeCategories = point(
  "a-goodness-of-fit-decision-for-three-categories",
  ["A goodness of fit decision for three categories", "三类别拟合优度的决定"],
  [
    "A goodness of fit test compares the statistic with an upper critical value, since only large values count against the model. Differences from the expected counts are not enough by themselves, because some difference is expected by chance in any sample.",
    "拟合优度检验把统计量与上侧临界值比较，因为只有大的值才不利于模型。与期望计数有差异本身还不够，因为任何样本都会有随机差异。",
  ],
  (rng) => {
    const E = rng.int(10, 30);
    const r = Math.floor(E / 2) - 1;
    let a = rng.int(-r, r);
    const b = rng.int(-r, r);
    if (a === 0 && b === 0) a = 1;
    const counts = [E + a, E + b, E - a - b];
    const sum = a * a + b * b + (a + b) * (a + b);
    const stat = Q.of(sum, E);
    const rejects = sum / E > 5.991;
    const yes: Pair = ["Reject the model, because the statistic exceeds $5.991$", "拒绝该模型，因为统计量超过 $5.991$"];
    const no: Pair = ["Do not reject the model, because the statistic is below $5.991$", "不拒绝该模型，因为统计量低于 $5.991$"];
    const trap: Pair = [
      "Reject the model, because the observed counts differ from the expected ones",
      "拒绝该模型，因为观察计数与期望计数不同",
    ];
    const trapTwo: Pair = ["Do not reject the model, because the statistic is above $5.991$", "不拒绝该模型，因为统计量高于 $5.991$"];
    return choose(
      rng,
      [
        `Three equally likely categories have observed counts $${counts.join(", ")}$. Using $\\chi^{2}_{0.05, 2} = 5.991$, what is the decision at the $5\\%$ level?`,
        `三个等可能类别的观察计数是 $${counts.join(", ")}$。利用 $\\chi^{2}_{0.05, 2} = 5.991$，在 $5\\%$ 水平下应作何决定？`,
      ],
      rejects ? yes : no,
      [rejects ? no : yes, trap, trapTwo],
      [
        `Each expected count is $${E}$, so the statistic is $\\frac{${a * a} + ${b * b} + ${(a + b) * (a + b)}}{${E}} = ${stat.toLatex()}$, which is ${rejects ? "above" : "below"} $5.991$.`,
        `每个期望计数都是 $${E}$，所以统计量是 $\\frac{${a * a} + ${b * b} + ${(a + b) * (a + b)}}{${E}} = ${stat.toLatex()}$，它${rejects ? "高于" : "低于"} $5.991$。`,
      ],
    );
  },
);

const binomialDf = point(
  "degrees-of-freedom-after-merging-and-estimating",
  ["Degrees of freedom after merging and estimating", "合并与估计后的自由度"],
  [
    "The degrees of freedom of a fit test are the number of classes actually used, minus one, minus one more for each parameter estimated from the data. So merging sparse classes lowers them, and estimating the binomial $p$ lowers them again.",
    "拟合检验的自由度是实际使用的类别数减一，每从数据估计一个参数再减一。所以合并稀疏类别会使它减小，估计二项分布的 $p$ 又使它减小。",
  ],
  (rng) => {
    const n = rng.int(6, 14);
    const r = rng.int(1, 3);
    const top = n - r;
    const estimated = rng.bool();
    const classes = top + 1;
    const answer = estimated ? classes - 2 : classes - 1;
    return ask(
      [
        `A binomial model with $n = ${n}$ is tested using the classes $0, 1, \\ldots, ${top - 1}$ and "$${top}$ or more". The value of $p$ was ${estimated ? "estimated from the data" : "specified in advance"}. How many degrees of freedom does the test have?`,
        `检验 $n = ${n}$ 的二项模型，类别为 $0, 1, \\ldots, ${top - 1}$ 和“$${top}$ 或更多”。$p$ 的值是${estimated ? "由数据估计的" : "事先指定的"}。检验有多少个自由度？`,
      ],
      answer,
      [estimated ? classes - 1 : classes - 2, n, n - 1],
      [
        `There are $${classes}$ classes after merging. Subtracting one${estimated ? " and one more for the estimated $p$" : ", with nothing estimated"} gives $${answer}$.`,
        `合并后有 $${classes}$ 个类别。减去一${estimated ? "，再为估计的 $p$ 减去一" : "，且没有估计参数"}，得 $${answer}$。`,
      ],
    );
  },
);

const poissonExpected = point(
  "an-expected-count-under-a-poisson-model",
  ["An expected count under a Poisson model", "泊松模型下的期望计数"],
  [
    "The expected count of a class is the number of observations times the model's probability for it. Under a Poisson model that probability is $\\frac{e^{-\\lambda}\\lambda^{x}}{x!}$, and forgetting the factorial is a common way to overstate the counts for larger values of $x$.",
    "某一类别的期望计数是观测数乘以模型给它的概率。在泊松模型下，这个概率是 $\\frac{e^{-\\lambda}\\lambda^{x}}{x!}$，忘记阶乘是高估较大 $x$ 值计数的常见错误。",
  ],
  (rng) => {
    const [lambda, e] = rng.pick([
      [1, 3679],
      [2, 1353],
      [3, 498],
      [4, 183],
    ] as const);
    const x = rng.int(2, 4);
    const N = 120 * rng.int(1, 5);
    const fact = x === 2 ? 2 : x === 3 ? 6 : 24;
    const eq = Q.of(e, 10000);
    const answer = eq.mul(Q.of(N * lambda ** x, fact));
    return askDecimal(
      [
        `A Poisson model with $\\lambda = ${lambda}$ is tested on $${N}$ observations. Using $e^{-${lambda}} = ${dec(eq)}$, find the expected count for $x = ${x}$.`,
        `用 $${N}$ 个观测检验 $\\lambda = ${lambda}$ 的泊松模型。利用 $e^{-${lambda}} = ${dec(eq)}$，求 $x = ${x}$ 的期望计数。`,
      ],
      answer,
      [eq.mul(Q.of(N * lambda ** x, 1)), eq.mul(Q.of(N, 1)), eq.mul(Q.of(N * lambda ** x, 2 * fact))],
      [
        `The probability is $\\frac{${dec(eq)} \\cdot ${lambda ** x}}{${fact}}$. Multiplying by $${N}$ gives $${dec(answer)}$.`,
        `概率是 $\\frac{${dec(eq)} \\cdot ${lambda ** x}}{${fact}}$。乘以 $${N}$，得 $${dec(answer)}$。`,
      ],
    );
  },
);

const uniformBins = point(
  "how-many-equal-bins-a-sample-allows",
  ["How many equal bins a sample allows", "样本允许多少个等宽组"],
  [
    "Under a uniform model, equal-width bins have equal expected counts, namely the sample size divided by the number of bins. Keeping each expected count at least five limits the number of bins, and more bins than this would make the chi-square approximation unreliable.",
    "在均匀模型下，等宽组的期望计数相等，都等于样本量除以组数。让每个期望计数至少为五，就限制了组数，组数再多会使卡方近似不可靠。",
  ],
  (rng) => {
    const N = rng.int(23, 180);
    const L = rng.pick([1, 10, 60, 100]);
    const answer = Math.floor(N / 5);
    return ask(
      [
        `A uniform model on $[0, ${L}]$ is tested on $${N}$ observations with equal-width bins. What is the largest number of bins that keeps every expected count at least $5$?`,
        `用 $${N}$ 个观测检验 $[0, ${L}]$ 上的均匀模型，分成等宽组。要使每个期望计数至少为 $5$，组数最多是多少？`,
      ],
      answer,
      [answer + 1, Math.floor(N / 10), N - 5],
      [
        `With $k$ bins each expected count is $\\frac{${N}}{k}$. We need $\\frac{${N}}{k} \\ge 5$, so $k \\le ${Q.of(N, 5).toLatex()}$ and the largest whole number is $${answer}$.`,
        `分成 $k$ 组时，每个期望计数都是 $\\frac{${N}}{k}$。需要 $\\frac{${N}}{k} \\ge 5$，所以 $k \\le ${Q.of(N, 5).toLatex()}$，最大的整数是 $${answer}$。`,
      ],
    );
  },
);

const normalTail = point(
  "the-expected-count-of-a-tail-class",
  ["The expected count of a tail class", "尾部类别的期望计数"],
  [
    "When a normal model is tested, the classes at the ends are open, so their expected counts come from tail areas. Standardize the boundary, find the area beyond it, and multiply by the number of observations. The table gives the area below a positive $z$, so a tail needs one minus that value.",
    "检验正态模型时，两端的类别是开放的，所以期望计数来自尾部面积。把边界标准化，求出它外侧的面积，再乘以观测数。分布表给出正 $z$ 以下的面积，所以尾部要用一减去该值。",
  ],
  (rng) => {
    const z = rng.pick([50, 100, 150, 200]);
    const sigma = 2 * rng.int(1, 10);
    const mu = rng.int(50, 150);
    const N = 100 * rng.int(1, 9);
    const upper = rng.bool();
    const shift = (z * sigma) / 100;
    const boundary = upper ? mu + shift : mu - shift;
    const answer = oneMinus(phi(z)).mul(Q.of(N, 1));
    const event = upper ? `x > ${boundary}` : `x < ${boundary}`;
    return askDecimal(
      [
        `A model $N(${mu}, ${sigma * sigma})$ is tested on $${N}$ observations. Find the expected count of the class $${event}$. Use $${given(z)}$.`,
        `用 $${N}$ 个观测检验模型 $N(${mu}, ${sigma * sigma})$。求类别 $${event}$ 的期望计数。利用 $${given(z)}$。`,
      ],
      answer,
      [phi(z).mul(Q.of(N, 1)), oneMinus(phi(z)), answer.mul(Q.of(2, 1))],
      [
        `The boundary is $${zText(z)}$ standard ${z === 100 ? "deviation" : "deviations"} from the mean, so the tail has probability $1 - ${dec(phi(z))} = ${dec(oneMinus(phi(z)))}$. Multiplying by $${N}$ gives $${dec(answer)}$.`,
        `边界与均值相距 $${zText(z)}$ 个标准差，所以尾部概率是 $1 - ${dec(phi(z))} = ${dec(oneMinus(phi(z)))}$。乘以 $${N}$，得 $${dec(answer)}$。`,
      ],
    );
  },
);

/** deeperProbabilityAndStatisticsThird3Points maps topics of Probability and Statistics, on hypothesis tests, regression inference and goodness of fit, to a third knowledge point. */
export const deeperProbabilityAndStatisticsThird3Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "introduction-to-hypothesis-testing": [errorKind],
  "hypothesis-tests-for-the-rate-of-a-poisson-distribution": [poissonCutoff],
  "critical-regions-for-left-tailed-hypothesis-tests": [leftPower],
  "critical-regions-for-right-tailed-hypothesis-tests": [rightBeta],
  "two-tailed-hypothesis-tests": [duality],
  "hypothesis-tests-for-one-mean-known-population-variance": [nForSignificance],
  "hypothesis-tests-for-one-mean-unknown-population-variance": [pValueBracket],
  "hypothesis-tests-for-one-variance": [varianceCutoff],
  "hypothesis-tests-for-two-means-known-population-variances": [nonzeroDifference],
  "hypothesis-tests-for-two-means-equal-but-unknown-population-variances": [pooledDecision],
  "hypothesis-tests-for-two-means-unequal-and-unknown-population-variances": [conservativeDf],
  "hypothesis-tests-for-two-proportions": [whenToPool],
  "hypothesis-tests-for-two-means-paired-sample-z-test": [leastPairedMean],
  "hypothesis-tests-for-two-means-paired-sample-t-test": [pairedDecision],
  "hypothesis-tests-for-two-variances": [fDegrees],
  "one-factor-within-groups-and-between-groups-variation": [anovaF],
  "confidence-intervals-for-linear-regression-slope-parameters": [slopeT],
  "confidence-intervals-for-linear-regression-intercept-parameters": [interceptCenter],
  "introduction-to-chi-square-goodness-of-fit": [threeCategories],
  "testing-binomial-models-using-chi-square-goodness-of-fit": [binomialDf],
  "testing-poisson-models-using-chi-square-goodness-of-fit": [poissonExpected],
  "testing-continuous-uniform-models-using-chi-square-goodness-of-fit": [uniformBins],
  "testing-normal-models-using-chi-square-goodness-of-fit": [normalTail],
};
