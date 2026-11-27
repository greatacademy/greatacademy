// Third knowledge points for thin topics of Probability and Statistics, on hypothesis tests,
// regression inference and goodness of fit: a reverse question, a harder case or a common trap.
// See `deeperProbabilityAndStatisticsThird3Points`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, dec, Q } from "@ga/subject-math";

import { explainedChoice, numberProblem, why } from "../problems.ts";
import { point } from "../university-kit.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { given, givenAmong, nz, oneMinus, phi, zText } from "./deeper-probability-and-statistics-third.ts";

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
    "A test can go wrong in two different ways. Rejecting a true null hypothesis is a Type I error, and failing to reject a false one is a Type II error. The other two combinations of truth and decision are correct decisions. If $H_{0}: \\mu = 150$ and in fact $\\mu = 150$, a test that rejects $H_{0}$ has made a Type I error; if in fact $\\mu = 162$, the same rejection is a correct decision.\n\n> **Watch out.** Decide first whether $H_{0}$ is true, then look at what the test did. A Type II error is keeping a false $H_{0}$, not rejecting a true one.",
    "检验可能以两种不同方式出错。拒绝真的原假设是第一类错误，未能拒绝假的原假设是第二类错误。真实情况与决定的另外两种组合都是正确的决定。若 $H_{0}: \\mu = 150$ 而实际上 $\\mu = 150$，拒绝 $H_{0}$ 的检验就犯了第一类错误；若实际上 $\\mu = 162$，同样的拒绝就是正确的决定。\n\n> **注意。** 先判断 $H_{0}$ 是否为真，再看检验做了什么。第二类错误是保留了假的 $H_{0}$，而不是拒绝了真的 $H_{0}$。",
  ],
  (rng) => {
    const m0 = rng.int(20, 99);
    const nullTrue = rng.bool();
    const rejects = rng.bool();
    const actual = nullTrue ? m0 : m0 + nz(rng, 9);
    const typeOne = t("A Type I error", "第一类错误");
    const typeTwo = t("A Type II error", "第二类错误");
    const fine = t("A correct decision", "正确的决定");
    const option = nullTrue ? (rejects ? typeOne : fine) : rejects ? fine : typeTwo;
    const reasons = new Map([
      [
        typeOne,
        nullTrue
          ? t("A Type I error needs a rejection, and this test kept $H_{0}$.", "第一类错误需要拒绝 $H_{0}$，而这个检验保留了它。")
          : t("A Type I error rejects a true $H_{0}$, and here $H_{0}$ is false.", "第一类错误是拒绝真的 $H_{0}$，而这里 $H_{0}$ 为假。"),
      ],
      [
        typeTwo,
        nullTrue
          ? t("A Type II error keeps a false $H_{0}$, and here $H_{0}$ is true.", "第二类错误是保留假的 $H_{0}$，而这里 $H_{0}$ 为真。")
          : t("A Type II error needs $H_{0}$ kept, and this test rejected it.", "第二类错误需要保留 $H_{0}$，而这个检验拒绝了它。"),
      ],
      [
        fine,
        nullTrue
          ? t("Rejecting a true $H_{0}$ is an error, not a correct decision.", "拒绝真的 $H_{0}$ 是错误，不是正确的决定。")
          : t("Keeping a false $H_{0}$ is an error, not a correct decision.", "保留假的 $H_{0}$ 是错误，不是正确的决定。"),
      ],
    ]);
    return explainedChoice(rng, {
      prompt: t(
        `A test has $H_{0}: \\mu = ${m0}$. In fact $\\mu = ${actual}$, and the test ${rejects ? "rejects" : "does not reject"} $H_{0}$. What has happened?`,
        `检验的原假设是 $H_{0}: \\mu = ${m0}$。实际上 $\\mu = ${actual}$，而检验${rejects ? "拒绝了" : "没有拒绝"} $H_{0}$。发生了什么？`,
      ),
      correct: option,
      wrong: [typeOne, typeTwo, fine].filter((o) => o !== option).map((o) => ({ option: o, why: reasons.get(o) ?? o })),
      solution: walked(
        [
          [
            ["Decide whether $H_{0}$ is true", "判断 $H_{0}$ 是否为真"],
            t(
              `In fact $\\mu = ${actual}$, so $H_{0}: \\mu = ${m0}$ is ${nullTrue ? "true" : "false"}.`,
              `实际上 $\\mu = ${actual}$，所以 $H_{0}: \\mu = ${m0}$ ${nullTrue ? "为真" : "为假"}。`,
            ),
          ],
          [
            ["Look at the decision", "看检验的决定"],
            t(
              `The test ${rejects ? "rejects" : "keeps"} it, so the outcome is ${nullTrue ? (rejects ? "a Type I error" : "a correct decision") : rejects ? "a correct decision" : "a Type II error"}.`,
              `检验${rejects ? "拒绝了" : "保留了"}它，所以结果是${option["zh-CN"]}。`,
            ),
          ],
        ],
        t(
          `An error pairs a true $H_{0}$ with rejection or a false $H_{0}$ with keeping it; here a ${nullTrue ? "true" : "false"} $H_{0}$ is ${rejects ? "rejected" : "kept"}, which ${nullTrue === rejects ? "is" : "is not"} such a pair.`,
          `错误是真的 $H_{0}$ 被拒绝，或假的 $H_{0}$ 被保留；这里${nullTrue ? "真" : "假"}的 $H_{0}$ 被${rejects ? "拒绝" : "保留"}，${nullTrue === rejects ? "正是" : "不是"}这样的情形。`,
        ),
      ),
    });
  },
);

const poissonCutoff = point(
  "the-smallest-count-that-rejects-a-poisson-rate",
  ["The smallest count that rejects a Poisson rate", "拒绝泊松率的最小计数"],
  [
    "For a large mean, a total count $T$ with mean $n\\lambda_{0}$ under the null hypothesis has standard deviation $\\sqrt{n\\lambda_{0}}$, not the mean itself. Solving the rejection condition for $T$ and rounding up gives the smallest count that rejects. Over $100$ periods with $\\lambda_{0} = 4$, the total has mean $400$ and standard deviation $20$, so with $z = 1.96$ rejection needs $T \\ge 400 + 1.96(20) = 439.2$, and the smallest count is $440$.\n\n> **Watch out.** The standard deviation is $\\sqrt{n\\lambda_{0}}$, not $n\\lambda_{0}$, and the boundary is rounded up: $439$ falls short of $439.2$.",
    "均值较大时，在原假设下均值为 $n\\lambda_{0}$ 的总计数 $T$，标准差是 $\\sqrt{n\\lambda_{0}}$，而不是均值本身。由拒绝条件解出 $T$ 并向上取整，就得到能拒绝的最小计数。在 $100$ 个时段上若 $\\lambda_{0} = 4$，总计数的均值是 $400$，标准差是 $20$，所以取 $z = 1.96$ 时拒绝需要 $T \\ge 400 + 1.96(20) = 439.2$，最小计数是 $440$。\n\n> **注意。** 标准差是 $\\sqrt{n\\lambda_{0}}$ 而不是 $n\\lambda_{0}$，并且分界点要向上取整：$439$ 还不到 $439.2$。",
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
    return numberProblem({
      prompt: t(
        `Counts over $${n}$ periods test $H_{0}: \\lambda = ${lambda}$ per period against $\\lambda > ${lambda}$. Using a normal approximation and $z = ${z}$, find the smallest total count that rejects $H_{0}$.`,
        `用 $${n}$ 个时段的计数检验 $H_{0}: \\lambda = ${lambda}$（每时段）对 $\\lambda > ${lambda}$。用正态近似并取 $z = ${z}$，求能拒绝 $H_{0}$ 的最小总计数。`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          answer - 1,
          `That rounds down; $${answer - 1}$ is below the boundary $${dec(bound)}$, so it does not reject.`,
          `那是向下取整；$${answer - 1}$ 低于分界点 $${dec(bound)}$，不能拒绝。`,
        ),
        why(
          Math.ceil(mean + (crit * mean) / 1000),
          `That uses the mean $${mean}$ as the standard deviation; the standard deviation is $\\sqrt{${mean}} = ${k}$.`,
          `那把均值 $${mean}$ 当成了标准差；标准差应是 $\\sqrt{${mean}} = ${k}$。`,
        ),
        why(
          mean + k,
          `That adds one standard deviation; the boundary is $${z}$ standard deviations above the mean.`,
          `那只加了一个标准差；分界点在均值上方 $${z}$ 个标准差处。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the null distribution", "求原假设下的分布"],
            t(
              `Under $H_{0}$ the total has mean $${n}(${lambda}) = ${mean}$ and standard deviation $\\sqrt{${mean}} = ${k}$.`,
              `在 $H_{0}$ 下，总计数的均值是 $${n}(${lambda}) = ${mean}$，标准差是 $\\sqrt{${mean}} = ${k}$。`,
            ),
          ],
          [
            ["Find the boundary", "求分界点"],
            t(`Rejection needs $T \\ge ${mean} + ${z}(${k}) = ${dec(bound)}$.`, `拒绝需要 $T \\ge ${mean} + ${z}(${k}) = ${dec(bound)}$。`),
          ],
          [["Round up", "向上取整"], t(`The smallest whole count is $${answer}$.`, `最小的整数计数是 $${answer}$。`)],
        ],
        t(
          `$${answer - 1} < ${dec(bound)} \\le ${answer}$, so $${answer}$ is the first count that reaches the boundary.`,
          `$${answer - 1} < ${dec(bound)} \\le ${answer}$，所以 $${answer}$ 是第一个达到分界点的计数。`,
        ),
      ),
    });
  },
);

const leftPower = point(
  "the-power-of-a-left-tailed-test",
  ["The power of a left-tailed test", "左尾检验的功效"],
  [
    "Power is the chance of landing in the critical region when the alternative is true. So the region stays fixed, set under the null hypothesis, but the probability is computed with the alternative mean. Using the null mean would give the significance level instead. A test of $H_{0}: \\mu = 500$ against $\\mu < 500$ that rejects when $\\bar{X} < 490$, with $n = 100$ and $\\sigma = 40$, has standard error $4$; when $\\mu = 485$, $z = \\frac{490 - 485}{4} = 1.25$ and the power is $\\Phi(1.25) = 0.8944$.\n\n> **Watch out.** Standardize the cutoff with the alternative mean, and take the area on the rejecting side, below the cutoff; the area above it is the probability of a Type II error.",
    "功效是备择假设为真时落入临界区域的概率。所以区域固定不变，由原假设确定，但概率要用备择均值计算。用原假设的均值算出的则是显著性水平。检验 $H_{0}: \\mu = 500$ 对 $\\mu < 500$，当 $\\bar{X} < 490$ 时拒绝，$n = 100$，$\\sigma = 40$，标准误为 $4$；当 $\\mu = 485$ 时，$z = \\frac{490 - 485}{4} = 1.25$，功效为 $\\Phi(1.25) = 0.8944$。\n\n> **注意。** 要用备择均值把分界点标准化，并取拒绝一侧，即分界点下方的面积；分界点上方的面积是犯第二类错误的概率。",
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
    const zc = `${above ? "" : "-"}${zText(z)}`;
    const other = z === 100 ? 150 : 100;
    return numberProblem({
      prompt: t(
        `A test of $H_{0}: \\mu = ${mu0}$ against $\\mu < ${mu0}$ rejects when $\\bar{X} < ${c}$, with $n = ${k * k}$ and $\\sigma = ${k * se}$. Find the power when $\\mu = ${mu1}$. Use $${givenAmong(z)}$.`,
        `检验 $H_{0}: \\mu = ${mu0}$ 对 $\\mu < ${mu0}$，当 $\\bar{X} < ${c}$ 时拒绝，$n = ${k * k}$，$\\sigma = ${k * se}$。求 $\\mu = ${mu1}$ 时的功效。利用 $${givenAmong(z)}$。`,
      ),
      answer,
      form: "decimal",
      mistakes: unlike(answer, [
        why(
          oneMinus(answer),
          "That is the area above the cutoff, the probability of a Type II error; the power is the area below it, where the test rejects.",
          "那是分界点上方的面积，即犯第二类错误的概率；功效是分界点下方、检验拒绝一侧的面积。",
        ),
        why(
          phi(other),
          `That reads the table at $${zText(other)}$; the standardized cutoff is $${zc}$.`,
          `那是在 $${zText(other)}$ 处查的表；标准化后的分界点是 $${zc}$。`,
        ),
        why(
          oneMinus(phi(other)),
          `That reads the table at $${zText(other)}$; the standardized cutoff is $${zc}$.`,
          `那是在 $${zText(other)}$ 处查的表；标准化后的分界点是 $${zc}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the standard error", "求标准误"],
            t(`$\\frac{${k * se}}{\\sqrt{${k * k}}} = ${se}$.`, `$\\frac{${k * se}}{\\sqrt{${k * k}}} = ${se}$。`),
          ],
          [
            ["Standardize the cutoff under the alternative", "在备择均值下把分界点标准化"],
            t(
              `With $\\mu = ${mu1}$, $z = \\frac{${c} - ${mu1}}{${se}} = ${zc}$.`,
              `当 $\\mu = ${mu1}$ 时，$z = \\frac{${c} - ${mu1}}{${se}} = ${zc}$。`,
            ),
          ],
          [
            ["Take the area where the test rejects", "取检验拒绝一侧的面积"],
            t(`The power is $P(Z < ${zc}) = ${dec(answer)}$.`, `功效是 $P(Z < ${zc}) = ${dec(answer)}$。`),
          ],
        ],
        t(
          `$\\mu = ${mu1}$ lies ${above ? "below" : "above"} the cutoff $${c}$, so the power is ${above ? "more" : "less"} than one half, as $${dec(answer)}$ is.`,
          `$\\mu = ${mu1}$ 在分界点 $${c}$ 的${above ? "下方" : "上方"}，所以功效${above ? "大于" : "小于"}一半，$${dec(answer)}$ 正是如此。`,
        ),
      ),
    });
  },
);

const rightBeta = point(
  "the-type-ii-error-of-a-right-tailed-test",
  ["The Type II error of a right-tailed test", "右尾检验的第二类错误"],
  [
    "A Type II error happens when the alternative is true but the sample mean stays below the cutoff. So its probability is the area to the left of the cutoff under the alternative distribution, and it depends on which alternative mean is considered. A test of $H_{0}: \\mu = 200$ against $\\mu > 200$ that rejects when $\\bar{X} > 210$, with $n = 64$ and $\\sigma = 32$, has standard error $4$; when $\\mu = 215$, $z = \\frac{210 - 215}{4} = -1.25$ and the probability of a Type II error is $\\Phi(-1.25) = 0.1056$.\n\n> **Watch out.** Standardize with the alternative mean, not $\\mu_{0}$, and take the area below the cutoff; the area above it is the power.",
    "第二类错误发生在备择假设为真而样本均值仍低于分界点时。所以它的概率是备择分布下分界点左侧的面积，并且取决于所考虑的备择均值。检验 $H_{0}: \\mu = 200$ 对 $\\mu > 200$，当 $\\bar{X} > 210$ 时拒绝，$n = 64$，$\\sigma = 32$，标准误为 $4$；当 $\\mu = 215$ 时，$z = \\frac{210 - 215}{4} = -1.25$，犯第二类错误的概率为 $\\Phi(-1.25) = 0.1056$。\n\n> **注意。** 要用备择均值而不是 $\\mu_{0}$ 标准化，并取分界点下方的面积；分界点上方的面积是功效。",
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
    const zc = `${beyond ? "-" : ""}${zText(z)}`;
    const other = z === 100 ? 150 : 100;
    return numberProblem({
      prompt: t(
        `A test of $H_{0}: \\mu = ${mu0}$ against $\\mu > ${mu0}$ rejects when $\\bar{X} > ${c}$, with $n = ${k * k}$ and $\\sigma = ${k * se}$. Find the probability of a Type II error when $\\mu = ${mu1}$. Use $${givenAmong(z)}$.`,
        `检验 $H_{0}: \\mu = ${mu0}$ 对 $\\mu > ${mu0}$，当 $\\bar{X} > ${c}$ 时拒绝，$n = ${k * k}$，$\\sigma = ${k * se}$。求 $\\mu = ${mu1}$ 时犯第二类错误的概率。利用 $${givenAmong(z)}$。`,
      ),
      answer,
      form: "decimal",
      mistakes: unlike(answer, [
        why(
          oneMinus(answer),
          "That is the area above the cutoff, the power; a Type II error keeps $H_{0}$, so it is the area below the cutoff.",
          "那是分界点上方的面积，即功效；第二类错误是保留 $H_{0}$，所以是分界点下方的面积。",
        ),
        why(
          phi(other),
          `That reads the table at $${zText(other)}$; the standardized cutoff is $${zc}$.`,
          `那是在 $${zText(other)}$ 处查的表；标准化后的分界点是 $${zc}$。`,
        ),
        why(
          oneMinus(phi(other)),
          `That reads the table at $${zText(other)}$; the standardized cutoff is $${zc}$.`,
          `那是在 $${zText(other)}$ 处查的表；标准化后的分界点是 $${zc}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the standard error", "求标准误"],
            t(`$\\frac{${k * se}}{\\sqrt{${k * k}}} = ${se}$.`, `$\\frac{${k * se}}{\\sqrt{${k * k}}} = ${se}$。`),
          ],
          [
            ["Standardize the cutoff under the alternative", "在备择均值下把分界点标准化"],
            t(
              `The test fails to reject when $\\bar{X} \\le ${c}$. With $\\mu = ${mu1}$, $z = \\frac{${c} - ${mu1}}{${se}} = ${zc}$.`,
              `当 $\\bar{X} \\le ${c}$ 时检验不拒绝。当 $\\mu = ${mu1}$ 时，$z = \\frac{${c} - ${mu1}}{${se}} = ${zc}$。`,
            ),
          ],
          [
            ["Take the area where the test keeps $H_{0}$", "取检验保留 $H_{0}$ 一侧的面积"],
            t(
              `The probability of a Type II error is $P(Z \\le ${zc}) = ${dec(answer)}$.`,
              `犯第二类错误的概率是 $P(Z \\le ${zc}) = ${dec(answer)}$。`,
            ),
          ],
        ],
        t(
          `$\\mu = ${mu1}$ lies ${beyond ? "above" : "below"} the cutoff $${c}$, so the probability is ${beyond ? "less" : "more"} than one half, as $${dec(answer)}$ is.`,
          `$\\mu = ${mu1}$ 在分界点 $${c}$ 的${beyond ? "上方" : "下方"}，所以这个概率${beyond ? "小于" : "大于"}一半，$${dec(answer)}$ 正是如此。`,
        ),
      ),
    });
  },
);

const duality = point(
  "a-two-tailed-test-from-a-confidence-interval",
  ["A two-tailed test from a confidence interval", "由置信区间做双尾检验"],
  [
    "A two-tailed test at level $\\alpha$ and a confidence interval at level $1 - \\alpha$ say the same thing. A hypothesized value is rejected exactly when it lies outside the interval, so the decision needs no further calculation once the interval is known. With the $95\\%$ interval $(102.4, 118.6)$, the $5\\%$ test rejects $H_{0}: \\mu = 100$, since $100 < 102.4$, but keeps $H_{0}: \\mu = 110$.\n\n> **Watch out.** The values inside the interval are the plausible ones, so they are kept; only a value outside the interval is rejected.",
    "水平 $\\alpha$ 的双尾检验与水平 $1 - \\alpha$ 的置信区间说的是同一件事。假设值恰好在它落在区间外时才被拒绝，所以知道区间后，作出决定无需再计算。若 $95\\%$ 区间是 $(102.4, 118.6)$，$5\\%$ 检验拒绝 $H_{0}: \\mu = 100$，因为 $100 < 102.4$，但保留 $H_{0}: \\mu = 110$。\n\n> **注意。** 区间内的值是合理的值，所以被保留；只有区间外的值才被拒绝。",
  ],
  (rng) => {
    const L = rng.int(20, 80);
    const U = L + rng.int(4, 20);
    const inside = rng.bool();
    const m0 = inside ? rng.int(L + 1, U - 1) : rng.bool() ? L - rng.int(1, 9) : U + rng.int(1, 9);
    const reject = t("Reject $H_{0}$, because the value lies outside the interval", "拒绝 $H_{0}$，因为该值在区间之外");
    const keep = t("Do not reject $H_{0}$, because the value lies inside the interval", "不拒绝 $H_{0}$，因为该值在区间之内");
    const option = inside ? keep : reject;
    const where = inside ? `${L} < ${m0} < ${U}` : m0 < L ? `${m0} < ${L}` : `${m0} > ${U}`;
    return explainedChoice(rng, {
      prompt: t(
        `A $95\\%$ confidence interval for $\\mu$ is $(${L}, ${U})$. What is the decision on $H_{0}: \\mu = ${m0}$ against $\\mu \\ne ${m0}$ at the $5\\%$ level?`,
        `$\\mu$ 的 $95\\%$ 置信区间是 $(${L}, ${U})$。在 $5\\%$ 水平下，对 $H_{0}: \\mu = ${m0}$ 与 $\\mu \\ne ${m0}$ 作何决定？`,
      ),
      correct: option,
      wrong: [
        {
          option: inside ? reject : keep,
          why: t(
            `$${where}$, so $${m0}$ lies ${inside ? "inside" : "outside"} the interval, not ${inside ? "outside" : "inside"} it.`,
            `$${where}$，所以 $${m0}$ 在区间${inside ? "之内" : "之外"}，而不是${inside ? "之外" : "之内"}。`,
          ),
        },
        {
          option: t("Reject $H_{0}$, because the value lies inside the interval", "拒绝 $H_{0}$，因为该值在区间之内"),
          why: t(
            "The values inside the interval are the plausible ones; the test rejects only the values outside it.",
            "区间内的值是合理的值；检验只拒绝区间外的值。",
          ),
        },
        {
          option: t("Do not reject $H_{0}$, because the value lies outside the interval", "不拒绝 $H_{0}$，因为该值在区间之外"),
          why: t(
            "A value outside the $95\\%$ interval is exactly one that the $5\\%$ test rejects.",
            "$95\\%$ 区间之外的值正是 $5\\%$ 检验所拒绝的值。",
          ),
        },
      ],
      solution: walked(
        [
          [
            ["Locate the hypothesized value", "确定假设值的位置"],
            t(
              `$${where}$, so $${m0}$ lies ${inside ? "inside" : "outside"} $(${L}, ${U})$.`,
              `$${where}$，所以 $${m0}$ 在 $(${L}, ${U})$ ${inside ? "之内" : "之外"}。`,
            ),
          ],
          [
            ["Read off the decision", "得出决定"],
            t(
              `A two-tailed $5\\%$ test rejects exactly the values outside the $95\\%$ interval, so $H_{0}$ is ${inside ? "not rejected" : "rejected"}.`,
              `双尾 $5\\%$ 检验恰好拒绝 $95\\%$ 区间之外的值，所以${inside ? "不拒绝" : "拒绝"} $H_{0}$。`,
            ),
          ],
        ],
        t(
          `The interval holds the values the test keeps, and $${m0}$ ${inside ? "is" : "is not"} one of them, so the test ${inside ? "keeps" : "rejects"} $H_{0}$.`,
          `区间包含检验保留的值，而 $${m0}$ ${inside ? "是" : "不是"}其中之一，所以检验${inside ? "保留" : "拒绝"} $H_{0}$。`,
        ),
      ),
    });
  },
);

const nForSignificance = point(
  "the-sample-size-that-makes-a-difference-significant",
  ["The sample size that makes a difference significant", "使差异显著的样本量"],
  [
    "With a fixed gap between $\\bar{x}$ and $\\mu_{0}$, the statistic $z$ grows with $\\sqrt{n}$, so a large enough sample makes even a small gap significant. Solving $|z| \\ge 1.96$ for $n$ shows how large, and this is why significance alone does not show importance. With $\\sigma = 50$ and a gap of $2$, $n \\ge \\left(\\frac{1.96(50)}{2}\\right)^{2} = 49^{2} = 2401$.\n\n> **Watch out.** Square the ratio $\\frac{1.96\\sigma}{\\text{gap}}$, use $1.96$ rather than the one-tailed $1.645$, and round up, since a smaller $n$ leaves $|z|$ below $1.96$.",
    "当 $\\bar{x}$ 与 $\\mu_{0}$ 的差距固定时，统计量 $z$ 随 $\\sqrt{n}$ 增大，所以样本足够大时，即使很小的差距也会显著。由 $|z| \\ge 1.96$ 解出 $n$ 可知要多大，这也是显著性本身不能说明重要性的原因。若 $\\sigma = 50$，差距为 $2$，则 $n \\ge \\left(\\frac{1.96(50)}{2}\\right)^{2} = 49^{2} = 2401$。\n\n> **注意。** 要把比值 $\\frac{1.96\\sigma}{\\text{差距}}$ 平方，用 $1.96$ 而不是单尾的 $1.645$，并且向上取整，因为更小的 $n$ 会使 $|z|$ 低于 $1.96$。",
  ],
  (rng) => {
    const sigma = rng.int(5, 30);
    const gap = rng.int(1, 6);
    const top = (196 * sigma) ** 2;
    const bottom = (100 * gap) ** 2;
    const answer = Math.ceil(top / bottom);
    const lean = Math.ceil(((1.645 * sigma) / gap) ** 2);
    const bound = (top / bottom).toFixed(2);
    const root = (m: string) => (gap === 1 ? `\\sqrt{${m}}` : `${gap}\\sqrt{${m}}`);
    return numberProblem({
      prompt: t(
        `A population has $\\sigma = ${sigma}$, and the sample mean is $${gap}$ away from $\\mu_{0}$. What is the smallest $n$ for which a two-tailed $z$ test with critical value $1.96$ rejects $H_{0}$?`,
        `总体的 $\\sigma = ${sigma}$，样本均值与 $\\mu_{0}$ 相差 $${gap}$。双尾 $z$ 检验的临界值是 $1.96$，要拒绝 $H_{0}$，最小的 $n$ 是多少？`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          answer - 1,
          `That rounds down; with $n = ${answer - 1}$, $|z|$ is still below $1.96$.`,
          `那是向下取整；$n = ${answer - 1}$ 时 $|z|$ 仍低于 $1.96$。`,
        ),
        why(lean, "That uses $1.645$, the one-tailed value; the test is two-tailed.", "那用的是单尾的 $1.645$；这个检验是双尾的。"),
        why(
          Math.ceil((1.96 * sigma) / gap),
          "That forgets to square; $\\sqrt{n}$ equals the ratio, so $n$ is its square.",
          "那忘了平方；等于这个比值的是 $\\sqrt{n}$，所以 $n$ 是它的平方。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Write the condition", "写出条件"],
            t(
              `Rejection needs $z = \\frac{${root("n")}}{${sigma}} \\ge 1.96$.`,
              `拒绝需要 $z = \\frac{${root("n")}}{${sigma}} \\ge 1.96$。`,
            ),
          ],
          [
            ["Solve for $n$", "解出 $n$"],
            t(
              `$n \\ge \\left(\\frac{1.96(${sigma})}{${gap}}\\right)^{2} \\approx ${bound}$.`,
              `$n \\ge \\left(\\frac{1.96(${sigma})}{${gap}}\\right)^{2} \\approx ${bound}$。`,
            ),
          ],
          [["Round up", "向上取整"], t(`The smallest whole number meeting this is $${answer}$.`, `满足条件的最小整数是 $${answer}$。`)],
        ],
        t(
          `With $n = ${answer}$, $z = \\frac{${root(String(answer))}}{${sigma}} \\approx ${((gap * Math.sqrt(answer)) / sigma).toFixed(3)}$, which reaches $1.96$.`,
          `当 $n = ${answer}$ 时，$z = \\frac{${root(String(answer))}}{${sigma}} \\approx ${((gap * Math.sqrt(answer)) / sigma).toFixed(3)}$，达到了 $1.96$。`,
        ),
      ),
    });
  },
);

const pValueBracket = point(
  "bracketing-a-p-value-from-a-t-table",
  ["Bracketing a p-value from a t table", "由 t 表确定 p 值的范围"],
  [
    "A $t$ table lists only a few critical values, so it cannot give an exact $p$-value. It can give a range: the observed statistic falls between two listed values, and the tail probability falls between the two corresponding areas, with a larger statistic meaning a smaller $p$-value. With $15$ degrees of freedom the table gives upper tail areas $0.05, 0.025, 0.01$ at $1.753, 2.131, 2.602$, so $t = 2.3$, which lies between $2.131$ and $2.602$, has $0.01 < p < 0.025$.\n\n> **Watch out.** The order reverses: the larger of the two bracketing table values goes with the smaller tail area, so it gives the lower bound on $p$.",
    "$t$ 表只列出少数几个临界值，所以不能给出精确的 $p$ 值，但可以给出范围：观察到的统计量落在两个列出的值之间，尾部概率也就落在两个对应的面积之间，统计量越大，$p$ 值越小。自由度为 $15$ 时，表中上尾面积 $0.05, 0.025, 0.01$ 分别对应 $1.753, 2.131, 2.602$，所以 $t = 2.3$ 落在 $2.131$ 与 $2.602$ 之间，$0.01 < p < 0.025$。\n\n> **注意。** 顺序是反过来的：两个夹住统计量的表值中，较大的那个对应较小的尾部面积，所以它给出 $p$ 的下界。",
  ],
  (rng) => {
    const j = rng.int(1, 6);
    const t10 = rng.int(11, 40);
    const value = t10 / 10;
    const mu0 = rng.int(20, 80);
    const xbar = Q.of(mu0, 1).add(Q.of(t10 * j, 10));
    const options = [
      t("$p > 0.05$", "$p > 0.05$"),
      t("$0.025 < p < 0.05$", "$0.025 < p < 0.05$"),
      t("$0.01 < p < 0.025$", "$0.01 < p < 0.025$"),
      t("$p < 0.01$", "$p < 0.01$"),
    ];
    const cuts = [1.86, 2.306, 2.896];
    const cutText = ["1.860", "2.306", "2.896"];
    const areas = ["0.05", "0.025", "0.01"];
    const pos = cuts.filter((c) => value > c).length;
    const option = options[pos] as (typeof options)[number];
    const tv = dec(Q.of(t10, 10));
    const placed =
      pos === 0 ? `${tv} < ${cutText[0]}` : pos === 3 ? `${tv} > ${cutText[2]}` : `${cutText[pos - 1]} < ${tv} < ${cutText[pos]}`;
    return explainedChoice(rng, {
      prompt: t(
        `A sample of $n = 9$ has $\\bar{x} = ${dec(xbar)}$ and $s = ${3 * j}$. For $H_{0}: \\mu = ${mu0}$ against $\\mu > ${mu0}$, the $t$ table with $8$ degrees of freedom gives upper tail areas $0.05, 0.025, 0.01$ at $1.860, 2.306, 2.896$. What can be said about the $p$-value?`,
        `容量为 $n = 9$ 的样本满足 $\\bar{x} = ${dec(xbar)}$，$s = ${3 * j}$。对 $H_{0}: \\mu = ${mu0}$ 与 $\\mu > ${mu0}$，自由度为 $8$ 的 $t$ 表给出：上尾面积 $0.05, 0.025, 0.01$ 分别对应 $1.860, 2.306, 2.896$。关于 $p$ 值能得出什么结论？`,
      ),
      correct: option,
      wrong: options.flatMap((o, i) =>
        i === pos
          ? []
          : [
              {
                option: o,
                why:
                  i < pos
                    ? t(
                        `$t = ${tv} > ${cutText[i]}$, so the tail area beyond it is less than $${areas[i]}$.`,
                        `$t = ${tv} > ${cutText[i]}$，所以它之外的尾部面积小于 $${areas[i]}$。`,
                      )
                    : t(
                        `$t = ${tv} < ${cutText[i - 1]}$, so the tail area beyond it is more than $${areas[i - 1]}$.`,
                        `$t = ${tv} < ${cutText[i - 1]}$，所以它之外的尾部面积大于 $${areas[i - 1]}$。`,
                      ),
              },
            ],
      ),
      solution: walked(
        [
          [
            ["Find the standard error", "求标准误"],
            t(`$\\frac{s}{\\sqrt{n}} = \\frac{${3 * j}}{3} = ${j}$.`, `$\\frac{s}{\\sqrt{n}} = \\frac{${3 * j}}{3} = ${j}$。`),
          ],
          [
            ["Compute the statistic", "计算统计量"],
            t(`$t = \\frac{${dec(xbar)} - ${mu0}}{${j}} = ${tv}$.`, `$t = \\frac{${dec(xbar)} - ${mu0}}{${j}} = ${tv}$。`),
          ],
          [["Place it in the table", "在表中定位"], t(`$${placed}$, so ${option.en}.`, `$${placed}$，所以 ${option["zh-CN"]}。`)],
        ],
        t(
          `A larger statistic leaves a smaller tail, and $t = ${tv}$ ${pos === 0 ? "has not reached $1.860$, so $p$ is above $0.05$" : `has passed $${cutText[pos - 1]}$, so $p$ is below $${areas[pos - 1]}$`}.`,
          `统计量越大，尾部越小；$t = ${tv}$ ${pos === 0 ? "还没有达到 $1.860$，所以 $p$ 大于 $0.05$" : `已超过 $${cutText[pos - 1]}$，所以 $p$ 小于 $${areas[pos - 1]}$`}。`,
        ),
      ),
    });
  },
);

const varianceCutoff = point(
  "the-smallest-sample-variance-that-rejects",
  ["The smallest sample variance that rejects", "能拒绝的最小样本方差"],
  [
    "The chi-square statistic $\\frac{(n - 1)s^{2}}{\\sigma_{0}^{2}}$ can be solved for $s^{2}$. So a critical value can be turned into a cutoff on the sample variance itself, which is often the form needed when a limit is set in advance for quality control. With $n = 31$, $\\sigma_{0}^{2} = 60$ and critical value $43.773$, rejection needs $s^{2} \\ge \\frac{43.773(60)}{30} = 87.546$.\n\n> **Watch out.** Divide by $n - 1$, not $n$, after multiplying the critical value by $\\sigma_{0}^{2}$; the cutoff lies above $\\sigma_{0}^{2}$, not at it.",
    "卡方统计量 $\\frac{(n - 1)s^{2}}{\\sigma_{0}^{2}}$ 可以解出 $s^{2}$。所以临界值可以转换为样本方差本身的分界点，这常常是质量控制中预先设定界限时所需的形式。若 $n = 31$，$\\sigma_{0}^{2} = 60$，临界值为 $43.773$，则拒绝需要 $s^{2} \\ge \\frac{43.773(60)}{30} = 87.546$。\n\n> **注意。** 临界值乘以 $\\sigma_{0}^{2}$ 之后要除以 $n - 1$ 而不是 $n$；分界点在 $\\sigma_{0}^{2}$ 上方，而不是等于它。",
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
    return numberProblem({
      prompt: t(
        `A sample of $n = ${df + 1}$ tests $H_{0}: \\sigma^{2} = ${v0}$ against $\\sigma^{2} > ${v0}$, with critical value $${dec(chi)}$. Find the smallest $s^{2}$ that rejects $H_{0}$.`,
        `容量为 $n = ${df + 1}$ 的样本检验 $H_{0}: \\sigma^{2} = ${v0}$ 对 $\\sigma^{2} > ${v0}$，临界值是 $${dec(chi)}$。求能拒绝 $H_{0}$ 的最小 $s^{2}$。`,
      ),
      answer,
      form: "decimal",
      mistakes: unlike(answer, [
        why(chi.mul(Q.of(v0, 1)), `That forgets to divide by $n - 1 = ${df}$.`, `那忘了除以 $n - 1 = ${df}$。`),
        why(
          Q.of(v0, 1),
          `That is $\\sigma_{0}^{2}$ itself; a sample variance equal to it gives $\\chi^{2} = ${df}$, well below the critical value.`,
          `那就是 $\\sigma_{0}^{2}$ 本身；样本方差等于它时 $\\chi^{2} = ${df}$，远低于临界值。`,
        ),
        why(
          chi.mul(Q.of(v0, df + 1)),
          `That divides by $n = ${df + 1}$; the statistic uses $n - 1 = ${df}$.`,
          `那除以的是 $n = ${df + 1}$；统计量用的是 $n - 1 = ${df}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Write the rejection condition", "写出拒绝条件"],
            t(`Rejection needs $\\frac{${df}s^{2}}{${v0}} \\ge ${dec(chi)}$.`, `拒绝需要 $\\frac{${df}s^{2}}{${v0}} \\ge ${dec(chi)}$。`),
          ],
          [
            ["Solve for $s^{2}$", "解出 $s^{2}$"],
            t(
              `$s^{2} \\ge \\frac{${dec(chi)}(${v0})}{${df}} = ${dec(answer)}$.`,
              `$s^{2} \\ge \\frac{${dec(chi)}(${v0})}{${df}} = ${dec(answer)}$。`,
            ),
          ],
        ],
        t(
          `$\\frac{${df}(${dec(answer)})}{${v0}} = ${dec(chi)}$, exactly the critical value.`,
          `$\\frac{${df}(${dec(answer)})}{${v0}} = ${dec(chi)}$，恰好等于临界值。`,
        ),
      ),
    });
  },
);

const nonzeroDifference = point(
  "testing-a-nonzero-difference-of-means",
  ["Testing a nonzero difference of means", "检验均值之差不为零的情形"],
  [
    "A null hypothesis can claim a specific gap, such as $\\mu_{1} - \\mu_{2} = \\delta$, and not only equality. The hypothesized gap is then subtracted in the numerator of the statistic, while the standard error stays the same as for a test of equal means. For $H_{0}: \\mu_{1} - \\mu_{2} = 20$ with an observed gap of $26$ and $\\frac{\\sigma_{1}^{2}}{n_{1}} + \\frac{\\sigma_{2}^{2}}{n_{2}} = 10 + 6 = 16$, $z = \\frac{26 - 20}{\\sqrt{16}} = 1.5$.\n\n> **Watch out.** Subtract $\\delta$ from the observed gap, and add the two variances under one square root; adding the two standard errors overstates the spread.",
    "原假设可以断言一个具体的差距，如 $\\mu_{1} - \\mu_{2} = \\delta$，而不只是相等。这时要在统计量的分子中减去假设的差距，而标准误与检验均值相等时相同。对 $H_{0}: \\mu_{1} - \\mu_{2} = 20$，若观察到的差距为 $26$，且 $\\frac{\\sigma_{1}^{2}}{n_{1}} + \\frac{\\sigma_{2}^{2}}{n_{2}} = 10 + 6 = 16$，则 $z = \\frac{26 - 20}{\\sqrt{16}} = 1.5$。\n\n> **注意。** 要从观察到的差距中减去 $\\delta$，并把两个方差放在同一个根号下相加；把两个标准误直接相加会高估离散程度。",
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
    return numberProblem({
      prompt: t(
        `Samples give $\\bar{x}_{1} = ${mu2 + gap}$, $n_{1} = ${n1}$ with $\\sigma_{1}^{2} = ${v1}$, and $\\bar{x}_{2} = ${mu2}$, $n_{2} = ${n2}$ with $\\sigma_{2}^{2} = ${v2}$. Find the $z$ statistic for $H_{0}: \\mu_{1} - \\mu_{2} = ${delta}$.`,
        `样本给出 $\\bar{x}_{1} = ${mu2 + gap}$，$n_{1} = ${n1}$，$\\sigma_{1}^{2} = ${v1}$；以及 $\\bar{x}_{2} = ${mu2}$，$n_{2} = ${n2}$，$\\sigma_{2}^{2} = ${v2}$。求 $H_{0}: \\mu_{1} - \\mu_{2} = ${delta}$ 的 $z$ 统计量。`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          Q.of(gap, se),
          `That leaves out the hypothesized gap; subtract $${delta}$ from the observed gap.`,
          `那漏掉了假设的差距；要从观察到的差距中减去 $${delta}$。`,
        ),
        why(
          Q.of(gap - delta, 7 * k),
          `That adds the standard errors $${3 * k} + ${4 * k} = ${7 * k}$; add the variances under one root instead.`,
          `那是把标准误相加 $${3 * k} + ${4 * k} = ${7 * k}$；应当把方差放在同一个根号下相加。`,
        ),
        why(
          Q.of(gap + delta, se),
          `That adds $${delta}$; the hypothesized gap is subtracted.`,
          `那是加上了 $${delta}$；假设的差距应当减去。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the standard error", "求标准误"],
            t(
              `$\\sqrt{\\frac{${v1}}{${n1}} + \\frac{${v2}}{${n2}}} = \\sqrt{${9 * k * k} + ${16 * k * k}} = ${se}$.`,
              `$\\sqrt{\\frac{${v1}}{${n1}} + \\frac{${v2}}{${n2}}} = \\sqrt{${9 * k * k} + ${16 * k * k}} = ${se}$。`,
            ),
          ],
          [["Find the observed gap", "求观察到的差距"], t(`$${mu2 + gap} - ${mu2} = ${gap}$.`, `$${mu2 + gap} - ${mu2} = ${gap}$。`)],
          [
            ["Subtract the hypothesized gap and divide", "减去假设的差距再相除"],
            t(
              `$z = \\frac{${gap} - ${delta}}{${se}} = ${answer.toLatex()}$.`,
              `$z = \\frac{${gap} - ${delta}}{${se}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$${se}\\left(${answer.toLatex()}\\right) + ${delta} = ${gap}$ gives back the observed gap.`,
          `$${se}\\left(${answer.toLatex()}\\right) + ${delta} = ${gap}$ 还原出观察到的差距。`,
        ),
      ),
    });
  },
);

const pooledDecision = point(
  "the-right-degrees-of-freedom-for-a-pooled-test",
  ["The right degrees of freedom for a pooled test", "合并检验的正确自由度"],
  [
    "A pooled two-sample $t$ test has $n_{1} + n_{2} - 2$ degrees of freedom, since each sample mean uses one up. Choosing the smaller sample's degrees of freedom gives a larger critical value, which can change the decision when the statistic falls between the two. With $n_{1} = 20$ and $n_{2} = 12$ there are $30$ degrees of freedom and $t_{30} = 2.042$, so $t = 2.1$ rejects at the $5\\%$ level, although it would not with the smaller sample's $11$ degrees of freedom and $t_{11} = 2.201$.\n\n> **Watch out.** The pooled test uses $n_{1} + n_{2} - 2$; the smaller sample's $\\min(n_{1}, n_{2}) - 1$ is the conservative choice for unequal variances, not for a pooled test.",
    "合并的双样本 $t$ 检验有 $n_{1} + n_{2} - 2$ 个自由度，因为每个样本均值用掉一个。若选用较小样本的自由度，临界值会更大，当统计量落在两者之间时，这可能改变决定。若 $n_{1} = 20$，$n_{2} = 12$，自由度为 $30$，$t_{30} = 2.042$，所以 $t = 2.1$ 在 $5\\%$ 水平下拒绝，尽管用较小样本的 $11$ 个自由度和 $t_{11} = 2.201$ 时不会拒绝。\n\n> **注意。** 合并检验用 $n_{1} + n_{2} - 2$；较小样本的 $\\min(n_{1}, n_{2}) - 1$ 是方差不等时的保守选择，不用于合并检验。",
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
    const yes = t(`Reject $H_{0}$, using $${df}$ degrees of freedom`, `拒绝 $H_{0}$，自由度用 $${df}$`);
    const no = t(`Do not reject $H_{0}$, using $${df}$ degrees of freedom`, `不拒绝 $H_{0}$，自由度用 $${df}$`);
    const trapYes = t(`Reject $H_{0}$, using $${small}$ degrees of freedom`, `拒绝 $H_{0}$，自由度用 $${small}$`);
    const trapNo = t(`Do not reject $H_{0}$, using $${small}$ degrees of freedom`, `不拒绝 $H_{0}$，自由度用 $${small}$`);
    const option = rejects ? yes : no;
    return explainedChoice(rng, {
      prompt: t(
        `A pooled two-tailed $t$ test at the $5\\%$ level, with $n_{1} = ${n1}$ and $n_{2} = ${n2}$, gives $t = ${stat}$. The two-tailed critical values are $${shown.join(", ")}$. What is the decision?`,
        `$5\\%$ 水平的合并双尾 $t$ 检验，$n_{1} = ${n1}$，$n_{2} = ${n2}$，得 $t = ${stat}$。双尾临界值是 $${shown.join(", ")}$。应作何决定？`,
      ),
      correct: option,
      wrong: [
        {
          option: rejects ? no : yes,
          why: t(
            `$${stat}$ is ${rejects ? "above" : "below"} $t_{${df}} = ${tCrit(df)}$, so the test ${rejects ? "rejects" : "does not reject"}.`,
            `$${stat}$ ${rejects ? "大于" : "小于"} $t_{${df}} = ${tCrit(df)}$，所以检验${rejects ? "拒绝" : "不拒绝"}。`,
          ),
        },
        {
          option: trapYes,
          why: t(
            `The pooled test uses $${df}$ degrees of freedom, not $${small}$; and with $${small}$ the critical value $${tCrit(small)}$ is above $${stat}$, so it would not reject.`,
            `合并检验的自由度是 $${df}$ 而不是 $${small}$；而且用 $${small}$ 时临界值 $${tCrit(small)}$ 大于 $${stat}$，也不会拒绝。`,
          ),
        },
        {
          option: trapNo,
          why: t(
            `$${small}$ degrees of freedom belong to the smaller sample alone; the pooled test uses both samples, with $${df}$.`,
            `$${small}$ 个自由度只属于较小的样本；合并检验用两个样本，自由度是 $${df}$。`,
          ),
        },
      ],
      solution: walked(
        [
          [
            ["Count the degrees of freedom", "数自由度"],
            t(`The pooled test has $${n1} + ${n2} - 2 = ${df}$ degrees of freedom.`, `合并检验的自由度是 $${n1} + ${n2} - 2 = ${df}$。`),
          ],
          [
            ["Pick the critical value", "选出临界值"],
            t(`The critical value is $t_{${df}} = ${tCrit(df)}$.`, `临界值是 $t_{${df}} = ${tCrit(df)}$。`),
          ],
          [
            ["Compare", "比较"],
            t(
              `$${stat}$ is ${rejects ? "above" : "below"} $${tCrit(df)}$, so $H_{0}$ is ${rejects ? "rejected" : "not rejected"}.`,
              `$${stat}$ ${rejects ? "大于" : "小于"} $${tCrit(df)}$，所以${rejects ? "拒绝" : "不拒绝"} $H_{0}$。`,
            ),
          ],
        ],
        t(
          `More degrees of freedom give a smaller critical value, and indeed $${tCrit(df)} < ${tCrit(small)}$.`,
          `自由度越多，临界值越小，确实 $${tCrit(df)} < ${tCrit(small)}$。`,
        ),
      ),
    });
  },
);

const conservativeDf = point(
  "the-conservative-degrees-of-freedom",
  ["The conservative degrees of freedom", "保守的自由度"],
  [
    "When the variances are not assumed equal, the Welch formula for the degrees of freedom is long. A simple conservative choice is the smaller of $n_{1} - 1$ and $n_{2} - 1$, which gives a larger critical value and makes a false rejection less likely. For samples of $50$ and $64$ it is $\\min(49, 63) = 49$.\n\n> **Watch out.** Take the smaller sample, subtract one, and ignore the variances; $n_{1} + n_{2} - 2$ belongs to the pooled test.",
    "不假设方差相等时，韦尔奇自由度公式很长。一个简单的保守选择是取 $n_{1} - 1$ 与 $n_{2} - 1$ 中较小者，它给出更大的临界值，使错误拒绝的可能性更小。容量为 $50$ 和 $64$ 的样本，它是 $\\min(49, 63) = 49$。\n\n> **注意。** 取较小的样本，减去一，不管方差；$n_{1} + n_{2} - 2$ 属于合并检验。",
  ],
  (rng) => {
    const n1 = rng.int(5, 40);
    let n2 = rng.int(5, 40);
    if (n2 === n1) n2 = n1 + 3;
    const answer = Math.min(n1, n2) - 1;
    const v1 = rng.int(5, 40);
    const v2 = rng.int(41, 90);
    return numberProblem({
      prompt: t(
        `Two samples of sizes $${n1}$ and $${n2}$ have sample variances $${v1}$ and $${v2}$, not assumed to come from equal population variances. How many degrees of freedom does the conservative rule use?`,
        `容量为 $${n1}$ 和 $${n2}$ 的两个样本，样本方差为 $${v1}$ 和 $${v2}$，不假设总体方差相等。保守规则使用多少个自由度？`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          n1 + n2 - 2,
          "That is the pooled count $n_{1} + n_{2} - 2$, which assumes equal variances.",
          "那是合并检验的 $n_{1} + n_{2} - 2$，它假设方差相等。",
        ),
        why(
          Math.max(n1, n2) - 1,
          "That uses the larger sample; the conservative rule takes the smaller one.",
          "那用的是较大的样本；保守规则取较小的样本。",
        ),
        why(Math.min(n1, n2), "That forgets to subtract one.", "那忘了减去一。"),
      ]),
      solution: walked(
        [
          [
            ["Find each sample's degrees of freedom", "求每个样本的自由度"],
            t(`$${n1} - 1 = ${n1 - 1}$ and $${n2} - 1 = ${n2 - 1}$.`, `$${n1} - 1 = ${n1 - 1}$，$${n2} - 1 = ${n2 - 1}$。`),
          ],
          [
            ["Take the smaller", "取较小者"],
            t(
              `$\\min(${n1 - 1}, ${n2 - 1}) = ${answer}$. The variances play no part in it.`,
              `$\\min(${n1 - 1}, ${n2 - 1}) = ${answer}$。方差不参与这一规则。`,
            ),
          ],
        ],
        t(
          `$${answer} + 1 = ${Math.min(n1, n2)}$ is the size of the smaller sample.`,
          `$${answer} + 1 = ${Math.min(n1, n2)}$ 正是较小样本的容量。`,
        ),
      ),
    });
  },
);

const whenToPool = point(
  "when-to-pool-two-sample-proportions",
  ["When to pool two sample proportions", "何时合并两个样本比例"],
  [
    "The standard error of a test statistic is computed as if the null hypothesis were true. If it says $p_{1} = p_{2}$, there is one common proportion to estimate, so the samples are pooled. If it claims a nonzero gap, there is no common value and the two are used separately. For $30$ successes of $200$ and $50$ of $300$, a test of $p_{1} = p_{2}$ pools them into $\\frac{80}{500} = 0.16$, while a test of $p_{1} - p_{2} = 0.25$ uses $\\hat{p}_{1} = 0.15$ and $\\hat{p}_{2} \\approx 0.167$ separately.\n\n> **Watch out.** Pool only when $H_{0}$ says the proportions are equal; a hypothesized gap leaves no single value to pool into.",
    "检验统计量的标准误要按原假设为真来计算。如果它说 $p_{1} = p_{2}$，就只有一个公共比例要估计，所以合并样本。如果它断言差距不为零，就没有公共值，两者要分开使用。若 $200$ 次中成功 $30$ 次，$300$ 次中成功 $50$ 次，检验 $p_{1} = p_{2}$ 时合并为 $\\frac{80}{500} = 0.16$，而检验 $p_{1} - p_{2} = 0.25$ 时分别使用 $\\hat{p}_{1} = 0.15$ 和 $\\hat{p}_{2} \\approx 0.167$。\n\n> **注意。** 只有 $H_{0}$ 说两个比例相等时才合并；假设了差距时，就没有单一的值可以合并。",
  ],
  (rng) => {
    const n1 = 10 * rng.int(5, 30);
    const n2 = 10 * rng.int(5, 30);
    const x1 = rng.int(10, n1 - 10);
    const x2 = rng.int(10, n2 - 10);
    const equal = rng.bool();
    const delta = dec(Q.of(rng.pick([2, 5, 10, 15, 20]), 100));
    const h0 = equal ? "p_{1} = p_{2}" : `p_{1} - p_{2} = ${delta}`;
    const pooled = t("Pool the samples into one estimate of the proportion", "把样本合并为比例的一个估计");
    const apart = t("Use $\\hat{p}_{1}$ and $\\hat{p}_{2}$ separately", "分别使用 $\\hat{p}_{1}$ 和 $\\hat{p}_{2}$");
    const half = t("Use the value $\\frac{1}{2}$ for both proportions", "两个比例都用 $\\frac{1}{2}$");
    const first = t("Use only the larger sample's proportion", "只用较大样本的比例");
    const option = equal ? pooled : apart;
    const p1 = (x1 / n1).toFixed(3);
    const p2 = (x2 / n2).toFixed(3);
    const pp = ((x1 + x2) / (n1 + n2)).toFixed(3);
    return explainedChoice(rng, {
      prompt: t(
        `Samples give $${x1}$ successes of $${n1}$ and $${x2}$ successes of $${n2}$. For a test of $H_{0}: ${h0}$, how should the standard error be estimated?`,
        `样本给出 $${n1}$ 次中成功 $${x1}$ 次，以及 $${n2}$ 次中成功 $${x2}$ 次。检验 $H_{0}: ${h0}$ 时，应如何估计标准误？`,
      ),
      correct: option,
      wrong: [
        {
          option: equal ? apart : pooled,
          why: equal
            ? t(
                "Under $H_{0}$ the proportions share one value, and separate estimates do not use that.",
                "在 $H_{0}$ 下两个比例共用一个值，分开估计没有用到这一点。",
              )
            : t(
                `Under $H_{0}$ the proportions differ by $${delta}$, so there is no common value to pool into.`,
                `在 $H_{0}$ 下两个比例相差 $${delta}$，所以没有公共值可以合并。`,
              ),
        },
        {
          option: half,
          why: t(
            "Neither $H_{0}$ nor the data gives the value $\\frac{1}{2}$; the proportions are estimated from the samples.",
            "$H_{0}$ 和数据都没有给出 $\\frac{1}{2}$ 这个值；比例要由样本来估计。",
          ),
        },
        {
          option: first,
          why: t(
            "One sample's proportion throws away the other sample, and the standard error needs both.",
            "只用一个样本的比例丢掉了另一个样本，而标准误需要两个样本。",
          ),
        },
      ],
      solution: walked(
        [
          [
            ["Read the null hypothesis", "看原假设"],
            equal
              ? t("$H_{0}$ says the two proportions are equal, so they share one value.", "$H_{0}$ 说两个比例相等，所以它们共用一个值。")
              : t(
                  `$H_{0}$ says the proportions differ by $${delta}$, so they have no common value.`,
                  `$H_{0}$ 说两个比例相差 $${delta}$，所以它们没有公共值。`,
                ),
          ],
          [
            ["Estimate accordingly", "相应地估计"],
            equal
              ? t(
                  `Pool the samples: $\\hat{p} = \\frac{${x1} + ${x2}}{${n1} + ${n2}} \\approx ${pp}$.`,
                  `合并样本：$\\hat{p} = \\frac{${x1} + ${x2}}{${n1} + ${n2}} \\approx ${pp}$。`,
                )
              : t(
                  `Use $\\hat{p}_{1} = \\frac{${x1}}{${n1}} \\approx ${p1}$ and $\\hat{p}_{2} = \\frac{${x2}}{${n2}} \\approx ${p2}$ separately.`,
                  `分别使用 $\\hat{p}_{1} = \\frac{${x1}}{${n1}} \\approx ${p1}$ 和 $\\hat{p}_{2} = \\frac{${x2}}{${n2}} \\approx ${p2}$。`,
                ),
          ],
        ],
        equal
          ? t(
              `The pooled value $${pp}$ lies between $${p1}$ and $${p2}$, as a weighted average of the two must.`,
              `合并值 $${pp}$ 介于 $${p1}$ 与 $${p2}$ 之间，两者的加权平均理应如此。`,
            )
          : t(
              `A pooled value would claim $p_{1} = p_{2}$, which contradicts $H_{0}: ${h0}$.`,
              `合并值相当于断言 $p_{1} = p_{2}$，与 $H_{0}: ${h0}$ 矛盾。`,
            ),
      ),
    });
  },
);

const leastPairedMean = point(
  "the-least-mean-difference-that-is-significant",
  ["The least mean difference that is significant", "显著的最小平均差"],
  [
    "Solving the paired $z$ statistic for $\\bar{d}$ gives the smallest mean difference a study can detect. It equals the critical value times $\\frac{\\sigma_{d}}{\\sqrt{n}}$, so researchers can see before collecting data whether the effect they expect would reach significance. With $n = 400$ pairs, $\\sigma_{d} = 30$ and critical value $1.96$, the standard error is $\\frac{30}{20} = 1.5$, so $\\bar{d}$ must reach $1.96(1.5) = 2.94$.\n\n> **Watch out.** Divide $\\sigma_{d}$ by $\\sqrt{n}$, not by $n$, before multiplying by the critical value.",
    "由配对 $z$ 统计量解出 $\\bar{d}$，就得到研究能检测到的最小平均差。它等于临界值乘以 $\\frac{\\sigma_{d}}{\\sqrt{n}}$，所以研究者在收集数据之前就能看出预期效应能否达到显著。若有 $n = 400$ 对，$\\sigma_{d} = 30$，临界值为 $1.96$，则标准误为 $\\frac{30}{20} = 1.5$，所以 $\\bar{d}$ 必须达到 $1.96(1.5) = 2.94$。\n\n> **注意。** 要先用 $\\sigma_{d}$ 除以 $\\sqrt{n}$（而不是 $n$），再乘以临界值。",
  ],
  (rng) => {
    const k = rng.int(2, 10);
    const j = rng.int(1, 6);
    const crit = rng.pick([1282, 1645, 2326]);
    const c = Q.of(crit, 1000);
    const answer = c.mul(Q.of(j, 1));
    return numberProblem({
      prompt: t(
        `A paired study has $n = ${k * k}$ pairs and known $\\sigma_{d} = ${k * j}$. For a right-tailed test with critical value $${dec(c)}$, find the smallest $\\bar{d}$ that rejects $H_{0}: \\mu_{d} = 0$.`,
        `配对研究有 $n = ${k * k}$ 对，已知 $\\sigma_{d} = ${k * j}$。对临界值为 $${dec(c)}$ 的右尾检验，求能拒绝 $H_{0}: \\mu_{d} = 0$ 的最小 $\\bar{d}$。`,
      ),
      answer,
      form: "decimal",
      mistakes: unlike(answer, [
        why(
          c.mul(Q.of(k * j, 1)),
          `That multiplies $\\sigma_{d}$ itself; divide it by $\\sqrt{${k * k}} = ${k}$ first.`,
          `那是直接乘以 $\\sigma_{d}$；要先除以 $\\sqrt{${k * k}} = ${k}$。`,
        ),
        why(
          c.mul(Q.of(j, k)),
          `That divides $\\sigma_{d}$ by $n = ${k * k}$; the standard error divides by $\\sqrt{n}$.`,
          `那是用 $\\sigma_{d}$ 除以 $n = ${k * k}$；标准误是除以 $\\sqrt{n}$。`,
        ),
        why(Q.of(j, 1), "That is the standard error alone; multiply it by the critical value.", "那只是标准误；还要乘以临界值。"),
      ]),
      solution: walked(
        [
          [
            ["Find the standard error", "求标准误"],
            t(
              `$\\frac{\\sigma_{d}}{\\sqrt{n}} = \\frac{${k * j}}{${k}} = ${j}$.`,
              `$\\frac{\\sigma_{d}}{\\sqrt{n}} = \\frac{${k * j}}{${k}} = ${j}$。`,
            ),
          ],
          [
            ["Solve for the mean difference", "解出平均差"],
            j === 1
              ? t(
                  `With a standard error of $1$, rejection needs $\\bar{d} \\ge ${dec(answer)}$.`,
                  `标准误为 $1$，所以拒绝需要 $\\bar{d} \\ge ${dec(answer)}$。`,
                )
              : t(
                  `Rejection needs $\\frac{\\bar{d}}{${j}} \\ge ${dec(c)}$, so $\\bar{d} \\ge ${dec(c)}(${j}) = ${dec(answer)}$.`,
                  `拒绝需要 $\\frac{\\bar{d}}{${j}} \\ge ${dec(c)}$，所以 $\\bar{d} \\ge ${dec(c)}(${j}) = ${dec(answer)}$。`,
                ),
          ],
        ],
        t(
          `$${dec(answer)} \\div ${j} = ${dec(c)}$, exactly the critical value.`,
          `$${dec(answer)} \\div ${j} = ${dec(c)}$，恰好等于临界值。`,
        ),
      ),
    });
  },
);

const pairedDecision = point(
  "the-degrees-of-freedom-of-a-paired-test",
  ["The degrees of freedom of a paired test", "配对检验的自由度"],
  [
    "A paired test has one sample of differences, so its degrees of freedom are the number of pairs minus one. Counting the two columns as independent samples would nearly double this, and the smaller critical value could produce a rejection the data do not support. With $20$ pairs there are $19$ degrees of freedom and $t_{19} = 2.093$, so $t = 2.05$ is not significant at the $5\\%$ level, although it would pass $t_{38} = 2.024$ if the columns were wrongly treated as two samples.\n\n> **Watch out.** Count the pairs, not the measurements: $n$ pairs give $n - 1$ degrees of freedom, not $2n - 2$.",
    "配对检验只有一个差值样本，所以自由度是对数减一。如果把两列当作独立样本，自由度几乎翻倍，较小的临界值可能产生数据不支持的拒绝。有 $20$ 对数据时自由度为 $19$，$t_{19} = 2.093$，所以 $t = 2.05$ 在 $5\\%$ 水平下不显著，尽管若错把两列当作两个样本，它会超过 $t_{38} = 2.024$。\n\n> **注意。** 要数对数而不是测量值的个数：$n$ 对数据的自由度是 $n - 1$，而不是 $2n - 2$。",
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
    const yes = t(`Reject $H_{0}$, using $${df}$ degrees of freedom`, `拒绝 $H_{0}$，自由度用 $${df}$`);
    const no = t(`Do not reject $H_{0}$, using $${df}$ degrees of freedom`, `不拒绝 $H_{0}$，自由度用 $${df}$`);
    const trap = t(`Reject $H_{0}$, using $${wide}$ degrees of freedom`, `拒绝 $H_{0}$，自由度用 $${wide}$`);
    const trapNo = t(`Do not reject $H_{0}$, using $${wide}$ degrees of freedom`, `不拒绝 $H_{0}$，自由度用 $${wide}$`);
    const option = rejects ? yes : no;
    const twoSamples = t(
      `$${wide}$ treats the two columns as independent samples; the $${n}$ differences form one sample, with $${df}$ degrees of freedom.`,
      `$${wide}$ 把两列当作独立样本；$${n}$ 个差值构成一个样本，自由度是 $${df}$。`,
    );
    return explainedChoice(rng, {
      prompt: t(
        `A two-tailed paired $t$ test at the $5\\%$ level on $${n}$ pairs gives $t = ${stat}$. The two-tailed critical values are $${shown.join(", ")}$. What is the decision?`,
        `对 $${n}$ 对数据做 $5\\%$ 水平的配对双尾 $t$ 检验，得 $t = ${stat}$。双尾临界值是 $${shown.join(", ")}$。应作何决定？`,
      ),
      correct: option,
      wrong: [
        {
          option: rejects ? no : yes,
          why: t(
            `$${stat}$ is ${rejects ? "above" : "below"} $t_{${df}} = ${tCrit(df)}$, so the test ${rejects ? "rejects" : "does not reject"}.`,
            `$${stat}$ ${rejects ? "大于" : "小于"} $t_{${df}} = ${tCrit(df)}$，所以检验${rejects ? "拒绝" : "不拒绝"}。`,
          ),
        },
        { option: trap, why: twoSamples },
        { option: trapNo, why: twoSamples },
      ],
      solution: walked(
        [
          [
            ["Count the degrees of freedom", "数自由度"],
            t(
              `The test uses the $${n}$ differences as one sample, so there are $${n} - 1 = ${df}$ degrees of freedom.`,
              `检验把 $${n}$ 个差值当作一个样本，所以自由度是 $${n} - 1 = ${df}$。`,
            ),
          ],
          [
            ["Pick the critical value", "选出临界值"],
            t(`The critical value is $t_{${df}} = ${tCrit(df)}$.`, `临界值是 $t_{${df}} = ${tCrit(df)}$。`),
          ],
          [
            ["Compare", "比较"],
            t(
              `$${stat}$ is ${rejects ? "above" : "below"} $${tCrit(df)}$, so $H_{0}$ is ${rejects ? "rejected" : "not rejected"}.`,
              `$${stat}$ ${rejects ? "大于" : "小于"} $${tCrit(df)}$，所以${rejects ? "拒绝" : "不拒绝"} $H_{0}$。`,
            ),
          ],
        ],
        t(
          `Fewer degrees of freedom give a larger critical value, and indeed $${tCrit(df)} > ${tCrit(wide)}$.`,
          `自由度越少，临界值越大，确实 $${tCrit(df)} > ${tCrit(wide)}$。`,
        ),
      ),
    });
  },
);

const fDegrees = point(
  "the-degrees-of-freedom-of-an-f-ratio",
  ["The degrees of freedom of an F ratio", "F 比值的自由度"],
  [
    "When the larger sample variance goes on top, $F$ is at least one and an upper tail value applies. The degrees of freedom then follow the variances, not the labels: the numerator's come from the sample with the larger variance, whichever sample that is. With $n_{1} = 41$, $s_{1}^{2} = 12$ and $n_{2} = 61$, $s_{2}^{2} = 30$, the ratio is $\\frac{30}{12}$, with $60$ numerator and $40$ denominator degrees of freedom.\n\n> **Watch out.** Each variance keeps its own sample's $n - 1$; when sample $2$ has the larger variance, its degrees of freedom go on top.",
    "把较大的样本方差放在分子时，$F$ 至少为一，适用上尾值。这时自由度跟随方差而不是标号：分子的自由度来自方差较大的样本，不论它是哪一个。若 $n_{1} = 41$，$s_{1}^{2} = 12$，$n_{2} = 61$，$s_{2}^{2} = 30$，比值为 $\\frac{30}{12}$，分子自由度为 $60$，分母自由度为 $40$。\n\n> **注意。** 每个方差都带着自己样本的 $n - 1$；样本 $2$ 的方差较大时，它的自由度在分子。",
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
    return numberProblem({
      prompt: t(
        `Samples have $n_{1} = ${n1}$, $s_{1}^{2} = ${v1}$ and $n_{2} = ${n2}$, $s_{2}^{2} = ${v2}$. An $F$ ratio is formed with the larger variance on top. Find the ${askTop ? "numerator" : "denominator"} degrees of freedom.`,
        `样本满足 $n_{1} = ${n1}$，$s_{1}^{2} = ${v1}$；$n_{2} = ${n2}$，$s_{2}^{2} = ${v2}$。构造 $F$ 比值时把较大的方差放在分子。求${askTop ? "分子" : "分母"}的自由度。`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          other,
          `That belongs to the ${askTop ? "denominator" : "numerator"}; the ${askTop ? "numerator" : "denominator"} goes with the ${askTop ? "larger" : "smaller"} variance, $${askTop ? b : a}$.`,
          `那是${askTop ? "分母" : "分子"}的自由度；${askTop ? "分子" : "分母"}对应${askTop ? "较大" : "较小"}的方差 $${askTop ? b : a}$。`,
        ),
        why(answer + 1, "That is the sample size; subtract one.", "那是样本容量；还要减去一。"),
        why(
          n1 + n2 - 2,
          "That is the pooled count $n_{1} + n_{2} - 2$; each part of an $F$ ratio has its own sample's degrees of freedom.",
          "那是合并的 $n_{1} + n_{2} - 2$；$F$ 比值的每一部分都用自己样本的自由度。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Put the larger variance on top", "把较大的方差放在分子"],
            t(
              `The larger variance is $${b}$, from the sample of $${nTop}$, so $F = \\frac{${b}}{${a}}$.`,
              `较大的方差是 $${b}$，来自容量为 $${nTop}$ 的样本，所以 $F = \\frac{${b}}{${a}}$。`,
            ),
          ],
          [
            ["Attach the degrees of freedom", "确定自由度"],
            t(
              `The numerator has $${nTop} - 1 = ${nTop - 1}$ and the denominator $${nBottom} - 1 = ${nBottom - 1}$, so the requested value is $${answer}$.`,
              `分子的自由度是 $${nTop} - 1 = ${nTop - 1}$，分母的是 $${nBottom} - 1 = ${nBottom - 1}$，所以所求的值是 $${answer}$。`,
            ),
          ],
        ],
        t(
          `$\\frac{${b}}{${a}} > 1$, as a ratio with the larger variance on top must be.`,
          `$\\frac{${b}}{${a}} > 1$，把较大方差放在分子的比值理应如此。`,
        ),
      ),
    });
  },
);

const anovaF = point(
  "the-f-statistic-from-the-sums-of-squares",
  ["The F statistic from the sums of squares", "由平方和求 F 统计量"],
  [
    "The two sums of squares are not compared directly, because they are built from different numbers of independent pieces. Each is first divided by its degrees of freedom to give a mean square, and the statistic $F$ is the ratio of the two mean squares. With $2$ groups, $20$ observations, $SS_{\\text{between}} = 36$ and $SS_{\\text{within}} = 162$, the mean squares are $\\frac{36}{1} = 36$ and $\\frac{162}{18} = 9$, so $F = 4$.\n\n> **Watch out.** Divide by the degrees of freedom $k - 1$ and $N - k$, not by $k$ and $N$, and put the between-groups mean square on top.",
    "两个平方和不能直接比较，因为它们由不同数目的独立部分构成。要先分别除以各自的自由度得到均方，统计量 $F$ 是两个均方之比。若有 $2$ 组、$20$ 个观测，$SS_{\\text{between}} = 36$，$SS_{\\text{within}} = 162$，则均方为 $\\frac{36}{1} = 36$ 和 $\\frac{162}{18} = 9$，所以 $F = 4$。\n\n> **注意。** 要除以自由度 $k - 1$ 和 $N - k$，而不是 $k$ 和 $N$，并把组间均方放在分子。",
  ],
  (rng) => {
    const k = rng.int(3, 6);
    const m = rng.int(4, 12);
    const N = k * m;
    const ssb = rng.int(10, 200);
    const ssw = rng.int(50, 400);
    const answer = Q.of(ssb, k - 1).div(Q.of(ssw, N - k));
    const msb = Q.of(ssb, k - 1);
    const msw = Q.of(ssw, N - k);
    return numberProblem({
      prompt: t(
        `A one-factor study has $${k}$ groups and $${N}$ observations in all, with $SS_{\\text{between}} = ${ssb}$ and $SS_{\\text{within}} = ${ssw}$. Find the $F$ statistic.`,
        `单因素研究有 $${k}$ 组，共 $${N}$ 个观测，$SS_{\\text{between}} = ${ssb}$，$SS_{\\text{within}} = ${ssw}$。求 $F$ 统计量。`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          Q.of(ssb, ssw),
          "That compares the sums of squares directly; divide each by its degrees of freedom first.",
          "那是直接比较平方和；要先分别除以各自的自由度。",
        ),
        why(
          Q.of(ssb, k).div(Q.of(ssw, N)),
          `That divides by $k = ${k}$ and $N = ${N}$; the degrees of freedom are $k - 1 = ${k - 1}$ and $N - k = ${N - k}$.`,
          `那是除以 $k = ${k}$ 和 $N = ${N}$；自由度应是 $k - 1 = ${k - 1}$ 和 $N - k = ${N - k}$。`,
        ),
        why(
          Q.of(ssw, N - k).div(Q.of(ssb, k - 1)),
          "That is upside down; the between-groups mean square goes on top.",
          "那是颠倒了；组间均方应在分子。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the between-groups mean square", "求组间均方"],
            t(`$\\frac{${ssb}}{${k - 1}} = ${msb.toLatex()}$.`, `$\\frac{${ssb}}{${k - 1}} = ${msb.toLatex()}$。`),
          ],
          [
            ["Find the within-groups mean square", "求组内均方"],
            t(`$\\frac{${ssw}}{${N - k}} = ${msw.toLatex()}$.`, `$\\frac{${ssw}}{${N - k}} = ${msw.toLatex()}$。`),
          ],
          [["Divide", "相除"], t(`$F = ${answer.toLatex()}$.`, `$F = ${answer.toLatex()}$。`)],
        ],
        t(
          `The degrees of freedom $${k - 1}$ and $${N - k}$ add to $N - 1 = ${N - 1}$.`,
          `自由度 $${k - 1}$ 与 $${N - k}$ 之和为 $N - 1 = ${N - 1}$。`,
        ),
      ),
    });
  },
);

const slopeT = point(
  "the-slope-statistic-behind-the-interval",
  ["The slope statistic behind the interval", "区间背后的斜率统计量"],
  [
    "A slope interval is $b_{1} \\pm t \\cdot s_{b_{1}}$, so it excludes zero exactly when $\\left|\\frac{b_{1}}{s_{b_{1}}}\\right|$ exceeds the critical value. This ratio is the statistic for testing that the slope is zero, and it uses $n - 2$ degrees of freedom. With $n = 60$, $b_{1} = -45$ and $s_{b_{1}} = 15$, $t = \\frac{-45}{15} = -3$ on $58$ degrees of freedom.\n\n> **Watch out.** Divide the slope by its standard error as given; that standard error already allows for the sample size, so do not divide by $n$ again.",
    "斜率区间是 $b_{1} \\pm t \\cdot s_{b_{1}}$，所以它不含零恰好相当于 $\\left|\\frac{b_{1}}{s_{b_{1}}}\\right|$ 超过临界值。这个比值就是检验斜率为零的统计量，自由度是 $n - 2$。若 $n = 60$，$b_{1} = -45$，$s_{b_{1}} = 15$，则 $t = \\frac{-45}{15} = -3$，自由度为 $58$。\n\n> **注意。** 直接用斜率除以给出的标准误；这个标准误已经考虑了样本量，不要再除以 $n$。",
  ],
  (rng) => {
    const b = nz(rng, 30);
    const se = rng.int(2, 12);
    const n = rng.int(10, 40);
    const answer = Q.of(b, se);
    const sqrtDivided = Q.of(b * se, 1);
    return numberProblem({
      prompt: t(
        `A regression on $n = ${n}$ points has slope $b_{1} = ${b}$ with standard error $${se}$. Find the $t$ statistic for $H_{0}: \\beta_{1} = 0$.`,
        `对 $n = ${n}$ 个点的回归，斜率 $b_{1} = ${b}$，标准误是 $${se}$。求 $H_{0}: \\beta_{1} = 0$ 的 $t$ 统计量。`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(Q.of(se, b), "That is upside down; the slope goes on top.", "那是颠倒了；斜率应在分子。"),
        why(sqrtDivided, "That multiplies by the standard error; divide by it.", "那是乘以标准误；应当除以它。"),
        why(
          Q.of(b, se * n),
          "That divides by $n$ as well; the standard error already allows for the sample size.",
          "那又除以了 $n$；标准误已经考虑了样本量。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Divide the slope by its standard error", "用斜率除以它的标准误"],
            t(`$t = \\frac{${b}}{${se}} = ${answer.toLatex()}$.`, `$t = \\frac{${b}}{${se}} = ${answer.toLatex()}$。`),
          ],
          [["Count the degrees of freedom", "数自由度"], t(`$n - 2 = ${n - 2}$.`, `$n - 2 = ${n - 2}$。`)],
        ],
        t(
          `$${se}\\left(${answer.toLatex()}\\right) = ${b}$ gives back the slope.`,
          `$${se}\\left(${answer.toLatex()}\\right) = ${b}$ 还原出斜率。`,
        ),
      ),
    });
  },
);

const interceptCenter = point(
  "the-center-of-the-intercept-interval",
  ["The center of the intercept interval", "截距区间的中心"],
  [
    "The least squares line always passes through $(\\bar{x}, \\bar{y})$, so the intercept estimate is $b_{0} = \\bar{y} - b_{1}\\bar{x}$. This value is the center of the confidence interval for the intercept, and it can be found without the original data. With $\\bar{x} = 20$, $\\bar{y} = 100$ and $b_{1} = -2.5$, $b_{0} = 100 + 2.5(20) = 150$.\n\n> **Watch out.** Subtract $b_{1}\\bar{x}$ from $\\bar{y}$; with a negative slope this adds, and $\\bar{y}$ alone is the height of the line at $\\bar{x}$, not at $0$.",
    "最小二乘直线总是经过 $(\\bar{x}, \\bar{y})$，所以截距估计是 $b_{0} = \\bar{y} - b_{1}\\bar{x}$。这个值是截距置信区间的中心，无需原始数据就能求出。若 $\\bar{x} = 20$，$\\bar{y} = 100$，$b_{1} = -2.5$，则 $b_{0} = 100 + 2.5(20) = 150$。\n\n> **注意。** 要从 $\\bar{y}$ 中减去 $b_{1}\\bar{x}$；斜率为负时这相当于加上，而 $\\bar{y}$ 本身是直线在 $\\bar{x}$ 处而不是在 $0$ 处的高度。",
  ],
  (rng) => {
    const xbar = rng.int(2, 15);
    const ybar = rng.int(10, 60);
    const b = nz(rng, 6);
    const answer = ybar - b * xbar;
    const sign = b > 0 ? "-" : "+";
    const back = b > 0 ? "+" : "-";
    const term = Math.abs(b) === 1 ? `${xbar}` : `${Math.abs(b)}(${xbar})`;
    return numberProblem({
      prompt: t(
        `A regression has $\\bar{x} = ${xbar}$, $\\bar{y} = ${ybar}$ and slope $b_{1} = ${b}$. Find the center of the confidence interval for the intercept $\\beta_{0}$.`,
        `回归满足 $\\bar{x} = ${xbar}$，$\\bar{y} = ${ybar}$，斜率 $b_{1} = ${b}$。求截距 $\\beta_{0}$ 的置信区间的中心。`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          ybar + b * xbar,
          "That adds $b_{1}\\bar{x}$; it is subtracted from $\\bar{y}$.",
          "那是加上了 $b_{1}\\bar{x}$；应当从 $\\bar{y}$ 中减去它。",
        ),
        why(
          ybar,
          "That is $\\bar{y}$, the height of the line at $\\bar{x}$; the intercept is its height at $0$.",
          "那是 $\\bar{y}$，即直线在 $\\bar{x}$ 处的高度；截距是它在 $0$ 处的高度。",
        ),
        why(xbar - b * ybar, "That swaps the roles of $\\bar{x}$ and $\\bar{y}$.", "那把 $\\bar{x}$ 与 $\\bar{y}$ 的角色互换了。"),
      ]),
      solution: walked(
        [
          [
            ["Use the center of the interval", "确定区间的中心"],
            t(
              "The interval is centered at the estimate $b_{0}$, and the fitted line passes through $(\\bar{x}, \\bar{y})$.",
              "区间以估计值 $b_{0}$ 为中心，而拟合直线经过 $(\\bar{x}, \\bar{y})$。",
            ),
          ],
          [
            ["Compute the intercept", "计算截距"],
            t(
              `$b_{0} = \\bar{y} - b_{1}\\bar{x} = ${ybar} ${sign} ${term} = ${answer}$.`,
              `$b_{0} = \\bar{y} - b_{1}\\bar{x} = ${ybar} ${sign} ${term} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `At $x = ${xbar}$ the line gives $${answer} ${back} ${term} = ${ybar}$, which is $\\bar{y}$.`,
          `在 $x = ${xbar}$ 处，直线给出 $${answer} ${back} ${term} = ${ybar}$，正是 $\\bar{y}$。`,
        ),
      ),
    });
  },
);

/** unlike keeps the explained mistakes that differ from the answer and from each other. */
const unlike = <T extends { readonly value: Coefficient }>(answer: Coefficient, list: readonly T[]): T[] => {
  const asQ = (v: Coefficient) => (typeof v === "number" ? Q.of(v) : v);
  return list.filter((m, i) => !asQ(m.value).eq(asQ(answer)) && list.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i);
};

const threeCategories = point(
  "a-goodness-of-fit-decision-for-three-categories",
  ["A goodness of fit decision for three categories", "三类别拟合优度的决定"],
  [
    "A goodness of fit test compares the statistic with an upper critical value, since only large values count against the model. Differences from the expected counts are not enough by themselves, because some difference is expected by chance in any sample.\n\nThree equally likely categories receive $28$, $16$ and $16$ of $60$ observations. Each expects $20$, so $\\chi^{2} = \\frac{64 + 16 + 16}{20} = 4.8$. On $3 - 1 = 2$ degrees of freedom the $5\\%$ critical value is $5.991$, and $4.8 < 5.991$, so the model is not rejected, although no count equals its expected value.\n\nCheck: the gaps $8, -4, -4$ add to zero, as they must when both sets of counts total $60$.\n\n> **Watch out.** Reject only when the statistic is above the critical value. Counts that differ from the expected ones are no evidence by themselves, and a statistic above $5.991$ lies in the rejection region, so it never supports keeping the model.",
    "拟合优度检验把统计量与上侧临界值比较，因为只有大的值才不利于模型。与期望计数有差异本身还不够，因为任何样本都会有随机差异。\n\n三个等可能类别在 $60$ 个观测中分别得到 $28$、$16$、$16$ 个。每类期望 $20$，所以 $\\chi^{2} = \\frac{64 + 16 + 16}{20} = 4.8$。自由度为 $3 - 1 = 2$ 时 $5\\%$ 临界值是 $5.991$，而 $4.8 < 5.991$，所以不拒绝该模型，尽管没有一个计数等于它的期望值。\n\n检验：差 $8, -4, -4$ 之和为零，两组计数的总和都是 $60$ 时必然如此。\n\n> **注意。** 只有统计量高于临界值时才拒绝。计数与期望不同本身不是证据，而高于 $5.991$ 的统计量落在拒绝域中，绝不支持保留模型。",
  ],
  (rng) => {
    const E = rng.int(10, 30);
    const r = Math.floor(E / 2) - 1;
    let a = rng.int(-r, r);
    const b = rng.int(-r, r);
    if (a === 0 && b === 0) a = 1;
    const c = -a - b;
    const counts = [E + a, E + b, E + c];
    const sum = a * a + b * b + c * c;
    const stat = Q.of(sum, E);
    const exact = sum % E === 0;
    const approx = exact ? stat.toLatex() : (sum / E).toFixed(2);
    const statText = exact ? stat.toLatex() : `${stat.toLatex()} \\approx ${approx}`;
    const rejects = sum / E > 5.991;
    const yes = t("Reject the model, because the statistic exceeds $5.991$", "拒绝该模型，因为统计量超过 $5.991$");
    const no = t("Do not reject the model, because the statistic is below $5.991$", "不拒绝该模型，因为统计量低于 $5.991$");
    const trap = t("Reject the model, because the observed counts differ from the expected ones", "拒绝该模型，因为观察计数与期望计数不同");
    const trapTwo = t("Do not reject the model, because the statistic is above $5.991$", "不拒绝该模型，因为统计量高于 $5.991$");
    return explainedChoice(rng, {
      prompt: t(
        `Three equally likely categories have observed counts $${counts.join(", ")}$. Using $\\chi^{2}_{0.05, 2} = 5.991$, what is the decision at the $5\\%$ level?`,
        `三个等可能类别的观察计数是 $${counts.join(", ")}$。利用 $\\chi^{2}_{0.05, 2} = 5.991$，在 $5\\%$ 水平下应作何决定？`,
      ),
      correct: rejects ? yes : no,
      wrong: [
        {
          option: rejects ? no : yes,
          why: t(
            `The statistic is $${statText}$, which is ${rejects ? "above" : "below"} $5.991$, not ${rejects ? "below" : "above"} it.`,
            `统计量是 $${statText}$，它${rejects ? "高于" : "低于"} $5.991$，而不是${rejects ? "低于" : "高于"}它。`,
          ),
        },
        {
          option: trap,
          why: t(
            "Some difference from the expected counts happens by chance in every sample; only a statistic above the critical value counts against the model.",
            "每个样本都会因随机性与期望计数有些差异；只有统计量高于临界值才不利于模型。",
          ),
        },
        {
          option: trapTwo,
          why: t(
            "A statistic above the critical value lies in the rejection region, so it would lead to rejecting the model, not keeping it.",
            "高于临界值的统计量落在拒绝域中，所以会导致拒绝模型，而不是保留它。",
          ),
        },
      ],
      solution: walked(
        [
          [
            ["Find the expected counts", "求期望计数"],
            t(
              `The $${3 * E}$ observations are shared equally, so each category expects $${E}$, and the gaps are $${a}$, $${b}$ and $${c}$.`,
              `$${3 * E}$ 个观测平均分配，所以每类期望 $${E}$，差为 $${a}$、$${b}$ 和 $${c}$。`,
            ),
          ],
          [
            ["Compute the statistic", "计算统计量"],
            t(
              `$\\chi^{2} = \\frac{${a * a} + ${b * b} + ${c * c}}{${E}} = ${statText}$.`,
              `$\\chi^{2} = \\frac{${a * a} + ${b * b} + ${c * c}}{${E}} = ${statText}$。`,
            ),
          ],
          [
            ["Compare with the critical value", "与临界值比较"],
            t(
              `$${approx}$ is ${rejects ? "above" : "below"} $5.991$, so ${rejects ? "reject" : "do not reject"} the model.`,
              `$${approx}$ ${rejects ? "高于" : "低于"} $5.991$，所以${rejects ? "拒绝" : "不拒绝"}该模型。`,
            ),
          ],
        ],
        t(
          `The gaps $${a}$, $${b}$ and $${c}$ add to $0$, since both sets of counts total $${3 * E}$.`,
          `差 $${a}$、$${b}$ 与 $${c}$ 之和为 $0$，因为两组计数的总和都是 $${3 * E}$。`,
        ),
      ),
    });
  },
);

const binomialDf = point(
  "degrees-of-freedom-after-merging-and-estimating",
  ["Degrees of freedom after merging and estimating", "合并与估计后的自由度"],
  [
    'The degrees of freedom of a fit test are the number of classes actually used, minus one, minus one more for each parameter estimated from the data. So merging sparse classes lowers them, and estimating the binomial $p$ lowers them again.\n\nA binomial model with $n = 8$ has the values $0$ to $8$, but the counts above $5$ are sparse, so the classes $0, 1, \\ldots, 5$ and "$6$ or more" are used: $7$ classes. With $p$ estimated from the data, $\\nu = 7 - 1 - 1 = 5$.\n\nCheck: the $5$ free counts and the $2$ restrictions, the total and the estimate, make up the $7$ classes.\n\n> **Watch out.** Count the classes after merging, not the $n + 1 = 9$ values of the model: $9 - 1 - 1 = 7$ treats the merged values as separate classes.',
    "拟合检验的自由度是实际使用的类别数减一，每从数据估计一个参数再减一。所以合并稀疏类别会使它减小，估计二项分布的 $p$ 又使它减小。\n\n$n = 8$ 的二项模型取值 $0$ 到 $8$，但大于 $5$ 的计数稀疏，所以使用类别 $0, 1, \\ldots, 5$ 和“$6$ 或更多”：共 $7$ 个类别。若 $p$ 由数据估计，则 $\\nu = 7 - 1 - 1 = 5$。\n\n检验：$5$ 个自由计数与 $2$ 个限制（总数与估计值）合起来正是 $7$ 个类别。\n\n> **注意。** 要数合并后的类别，而不是模型的 $n + 1 = 9$ 个取值：$9 - 1 - 1 = 7$ 把合并的取值当成了不同的类别。",
  ],
  (rng) => {
    const n = rng.int(6, 14);
    const r = rng.int(1, 3);
    const top = n - r;
    const estimated = rng.bool();
    const m = estimated ? 1 : 0;
    const classes = top + 1;
    const answer = classes - 1 - m;
    return numberProblem({
      prompt: t(
        `A binomial model with $n = ${n}$ is tested using the classes $0, 1, \\ldots, ${top - 1}$ and "$${top}$ or more". The value of $p$ was ${estimated ? "estimated from the data" : "specified in advance"}. How many degrees of freedom does the test have?`,
        `检验 $n = ${n}$ 的二项模型，类别为 $0, 1, \\ldots, ${top - 1}$ 和“$${top}$ 或更多”。$p$ 的值是${estimated ? "由数据估计的" : "事先指定的"}。检验有多少个自由度？`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          classes - 1 - (1 - m),
          estimated
            ? "This forgets the degree of freedom lost by estimating $p$ from the data."
            : "This subtracts one for an estimated $p$, but $p$ was specified in advance.",
          estimated ? "这忘了由数据估计 $p$ 所损失的自由度。" : "这为估计 $p$ 减去了一，但 $p$ 是事先指定的。",
        ),
        why(
          n - m,
          `This uses all $${n + 1}$ values of the model instead of the $${classes}$ classes left after merging.`,
          `这用了模型的全部 $${n + 1}$ 个取值，而不是合并后剩下的 $${classes}$ 个类别。`,
        ),
        why(
          classes - m,
          "This forgets the degree of freedom lost because the counts must add to the total.",
          "这忘了计数之和必须等于总数而损失的自由度。",
        ),
        why(
          classes - 1 - 2 * m,
          "This subtracts two parameters, as for a normal model; a binomial model with $n$ known has only $p$.",
          "这像正态模型那样减去了两个参数；$n$ 已知的二项模型只有 $p$ 一个参数。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Count the classes", "数类别"],
            t(
              `The classes $0$ to $${top - 1}$ and "$${top}$ or more" make $${top} + 1 = ${classes}$ classes.`,
              `类别 $0$ 到 $${top - 1}$ 和“$${top}$ 或更多”共 $${top} + 1 = ${classes}$ 个类别。`,
            ),
          ],
          [
            ["Subtract the restrictions", "减去限制条件"],
            t(
              `Subtract one for the total${estimated ? " and one for the estimated $p$" : ", and nothing for $p$, which was given"}: $\\nu = ${classes} - 1${estimated ? " - 1" : ""} = ${answer}$.`,
              `为总数减去一${estimated ? "，再为估计的 $p$ 减去一" : "，$p$ 是给定的，不再减"}：$\\nu = ${classes} - 1${estimated ? " - 1" : ""} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$${answer} + 1${estimated ? " + 1" : ""} = ${classes}$ gives back the number of classes.`,
          `$${answer} + 1${estimated ? " + 1" : ""} = ${classes}$ 还原了类别数。`,
        ),
      ),
    });
  },
);

const poissonExpected = point(
  "an-expected-count-under-a-poisson-model",
  ["An expected count under a Poisson model", "泊松模型下的期望计数"],
  [
    "The expected count of a class is the number of observations times the model's probability for it. Under a Poisson model that probability is $\\frac{e^{-\\lambda}\\lambda^{x}}{x!}$, and forgetting the factorial is a common way to overstate the counts for larger values of $x$.\n\nFor $\\lambda = 2$, $N = 200$ and $e^{-2} = 0.1353$, the class $x = 2$ expects $200 \\cdot \\frac{0.1353 \\cdot 2^{2}}{2!} = 200 \\cdot 0.2706 = 54.12$.\n\nCheck: consecutive Poisson probabilities have ratio $\\frac{P(X = x)}{P(X = x - 1)} = \\frac{\\lambda}{x}$, and the class $x = 1$ expects $200 \\cdot 0.1353 \\cdot 2 = 54.12$, which times $\\frac{2}{2} = 1$ gives the same $54.12$.\n\n> **Watch out.** Divide by $x!$: $200 \\cdot 0.1353 \\cdot 4 = 108.24$ leaves it out and doubles the count.",
    "某一类别的期望计数是观测数乘以模型给它的概率。在泊松模型下，这个概率是 $\\frac{e^{-\\lambda}\\lambda^{x}}{x!}$，忘记阶乘是高估较大 $x$ 值计数的常见错误。\n\n对 $\\lambda = 2$，$N = 200$，$e^{-2} = 0.1353$，类别 $x = 2$ 的期望计数为 $200 \\cdot \\frac{0.1353 \\cdot 2^{2}}{2!} = 200 \\cdot 0.2706 = 54.12$。\n\n检验：相邻泊松概率之比为 $\\frac{P(X = x)}{P(X = x - 1)} = \\frac{\\lambda}{x}$，类别 $x = 1$ 的期望计数为 $200 \\cdot 0.1353 \\cdot 2 = 54.12$，乘以 $\\frac{2}{2} = 1$ 得到同样的 $54.12$。\n\n> **注意。** 要除以 $x!$：$200 \\cdot 0.1353 \\cdot 4 = 108.24$ 漏掉了它，使计数翻了一倍。",
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
    const before = eq.mul(Q.of(N * lambda ** (x - 1), fact / x));
    return numberProblem({
      prompt: t(
        `A Poisson model with $\\lambda = ${lambda}$ is tested on $${N}$ observations. Using $e^{-${lambda}} = ${dec(eq)}$, find the expected count for $x = ${x}$.`,
        `用 $${N}$ 个观测检验 $\\lambda = ${lambda}$ 的泊松模型。利用 $e^{-${lambda}} = ${dec(eq)}$，求 $x = ${x}$ 的期望计数。`,
      ),
      answer,
      form: "decimal",
      mistakes: unlike(answer, [
        why(
          eq.mul(Q.of(N * lambda ** x)),
          `This leaves out the factor $${x}! = ${fact}$ in the denominator.`,
          `这漏掉了分母中的因子 $${x}! = ${fact}$。`,
        ),
        why(
          eq.mul(Q.of(N)),
          `This is $N e^{-${lambda}}$, the expected count for $x = 0$.`,
          `这是 $N e^{-${lambda}}$，即 $x = 0$ 的期望计数。`,
        ),
        why(
          eq.mul(Q.of(N * lambda * x, fact)),
          `This multiplies by $\\lambda x = ${lambda * x}$ instead of raising $\\lambda$ to the power $x$, $${lambda}^{${x}} = ${lambda ** x}$.`,
          `这乘的是 $\\lambda x = ${lambda * x}$，而不是 $\\lambda$ 的 $x$ 次幂 $${lambda}^{${x}} = ${lambda ** x}$。`,
        ),
        why(
          Q.of(N * lambda ** x, fact),
          `This leaves out the factor $e^{-${lambda}} = ${dec(eq)}$ of the Poisson probability.`,
          `这漏掉了泊松概率中的因子 $e^{-${lambda}} = ${dec(eq)}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the probability", "求概率"],
            t(
              `$P(X = ${x}) = \\frac{e^{-${lambda}} \\cdot ${lambda}^{${x}}}{${x}!} = \\frac{${dec(eq)} \\cdot ${lambda ** x}}{${fact}}$.`,
              `$P(X = ${x}) = \\frac{e^{-${lambda}} \\cdot ${lambda}^{${x}}}{${x}!} = \\frac{${dec(eq)} \\cdot ${lambda ** x}}{${fact}}$。`,
            ),
          ],
          [
            ["Multiply by the number of observations", "乘以观测数"],
            t(
              `$${N} \\cdot \\frac{${dec(eq)} \\cdot ${lambda ** x}}{${fact}} = ${dec(answer)}$.`,
              `$${N} \\cdot \\frac{${dec(eq)} \\cdot ${lambda ** x}}{${fact}} = ${dec(answer)}$。`,
            ),
          ],
        ],
        t(
          `The class $x = ${x - 1}$ expects $${dec(before)}$, and $${dec(before)} \\cdot \\frac{${lambda}}{${x}} = ${dec(answer)}$, since $\\frac{P(X = x)}{P(X = x - 1)} = \\frac{\\lambda}{x}$.`,
          `类别 $x = ${x - 1}$ 的期望计数为 $${dec(before)}$，而 $${dec(before)} \\cdot \\frac{${lambda}}{${x}} = ${dec(answer)}$，因为 $\\frac{P(X = x)}{P(X = x - 1)} = \\frac{\\lambda}{x}$。`,
        ),
      ),
    });
  },
);

const uniformBins = point(
  "how-many-equal-bins-a-sample-allows",
  ["How many equal bins a sample allows", "样本允许多少个等宽组"],
  [
    "Under a uniform model, equal-width bins have equal expected counts, namely the sample size divided by the number of bins. Keeping each expected count at least five limits the number of bins, and more bins than this would make the chi-square approximation unreliable.\n\nFor $73$ observations, $k$ bins give $\\frac{73}{k}$ each, and $\\frac{73}{k} \\ge 5$ means $k \\le \\frac{73}{5} = 14.6$, so at most $14$ bins.\n\nCheck: $14$ bins give $\\frac{73}{14} \\approx 5.21 \\ge 5$, while $15$ bins give $\\frac{73}{15} \\approx 4.87 < 5$.\n\n> **Watch out.** Round $14.6$ down, not to the nearest whole number: $15$ bins would push every expected count below $5$.",
    "在均匀模型下，等宽组的期望计数相等，都等于样本量除以组数。让每个期望计数至少为五，就限制了组数，组数再多会使卡方近似不可靠。\n\n对 $73$ 个观测，分成 $k$ 组时每组期望 $\\frac{73}{k}$，而 $\\frac{73}{k} \\ge 5$ 意味着 $k \\le \\frac{73}{5} = 14.6$，所以最多 $14$ 组。\n\n检验：$14$ 组时每组 $\\frac{73}{14} \\approx 5.21 \\ge 5$，而 $15$ 组时 $\\frac{73}{15} \\approx 4.87 < 5$。\n\n> **注意。** 要把 $14.6$ 向下取整，而不是四舍五入：$15$ 组会使每个期望计数都低于 $5$。",
  ],
  (rng) => {
    const N = rng.int(23, 180);
    const L = rng.pick([1, 10, 60, 100]);
    const answer = Math.floor(N / 5);
    const bound = Q.of(N, 5);
    return numberProblem({
      prompt: t(
        `A uniform model on $[0, ${L}]$ is tested on $${N}$ observations with equal-width bins. What is the largest number of bins that keeps every expected count at least $5$?`,
        `用 $${N}$ 个观测检验 $[0, ${L}]$ 上的均匀模型，分成等宽组。要使每个期望计数至少为 $5$，组数最多是多少？`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          answer + 1,
          `With $${answer + 1}$ bins each expected count is $\\frac{${N}}{${answer + 1}} < 5$.`,
          `分成 $${answer + 1}$ 组时，每个期望计数为 $\\frac{${N}}{${answer + 1}} < 5$。`,
        ),
        why(
          answer - 1,
          `This is one less than the largest number of bins; $${answer}$ bins still give $\\frac{${N}}{${answer}} \\ge 5$.`,
          `这比最大组数少一；$${answer}$ 组仍有 $\\frac{${N}}{${answer}} \\ge 5$。`,
        ),
        why(
          N - 5,
          "This subtracts $5$ from the sample size; the condition divides the sample size by the number of bins.",
          "这从样本量中减去了 $5$；条件是样本量除以组数。",
        ),
        why(
          5 * N,
          "This multiplies by $5$; the expected count per bin is the sample size divided by the number of bins.",
          "这乘了 $5$；每组的期望计数是样本量除以组数。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Write the condition", "写出条件"],
            t(
              `With $k$ bins each expected count is $\\frac{${N}}{k}$, and we need $\\frac{${N}}{k} \\ge 5$.`,
              `分成 $k$ 组时，每个期望计数都是 $\\frac{${N}}{k}$，需要 $\\frac{${N}}{k} \\ge 5$。`,
            ),
          ],
          [
            ["Solve for k", "解出 k"],
            t(
              `$k \\le \\frac{${N}}{5} = ${dec(bound)}$, and the largest whole number is $${answer}$.`,
              `$k \\le \\frac{${N}}{5} = ${dec(bound)}$，最大的整数是 $${answer}$。`,
            ),
          ],
        ],
        t(
          `$\\frac{${N}}{${answer}} \\approx ${(N / answer).toFixed(2)} \\ge 5$, while $\\frac{${N}}{${answer + 1}} \\approx ${(N / (answer + 1)).toFixed(2)} < 5$.`,
          `$\\frac{${N}}{${answer}} \\approx ${(N / answer).toFixed(2)} \\ge 5$，而 $\\frac{${N}}{${answer + 1}} \\approx ${(N / (answer + 1)).toFixed(2)} < 5$。`,
        ),
      ),
    });
  },
);

const normalTail = point(
  "the-expected-count-of-a-tail-class",
  ["The expected count of a tail class", "尾部类别的期望计数"],
  [
    "When a normal model is tested, the classes at the ends are open, so their expected counts come from tail areas. Standardize the boundary, find the area beyond it, and multiply by the number of observations. The table gives the area below a positive $z$, so a tail needs one minus that value.\n\nFor $N(50, 100)$, so $\\sigma = 10$, and $200$ observations, the class $x > 65$ starts at $z = \\frac{65 - 50}{10} = 1.5$. Its probability is $1 - 0.9332 = 0.0668$, and its expected count is $200 \\cdot 0.0668 = 13.36$. By symmetry the class $x < 35$ has the same count.\n\nCheck: the rest of the observations, below $65$, expect $200 \\cdot 0.9332 = 186.64$, and $13.36 + 186.64 = 200$.\n\n> **Watch out.** The table value $0.9332$ is the area below $z = 1.5$; using it directly gives $186.64$, the count of everything outside the tail class.",
    "检验正态模型时，两端的类别是开放的，所以期望计数来自尾部面积。把边界标准化，求出它外侧的面积，再乘以观测数。分布表给出正 $z$ 以下的面积，所以尾部要用一减去该值。\n\n对 $N(50, 100)$，即 $\\sigma = 10$，以及 $200$ 个观测，类别 $x > 65$ 从 $z = \\frac{65 - 50}{10} = 1.5$ 开始。它的概率是 $1 - 0.9332 = 0.0668$，期望计数是 $200 \\cdot 0.0668 = 13.36$。由对称性，类别 $x < 35$ 的计数相同。\n\n检验：其余低于 $65$ 的观测期望为 $200 \\cdot 0.9332 = 186.64$，而 $13.36 + 186.64 = 200$。\n\n> **注意。** 表值 $0.9332$ 是 $z = 1.5$ 以下的面积；直接用它会得到 $186.64$，即尾部类别以外全部观测的计数。",
  ],
  (rng) => {
    const z = rng.pick([50, 100, 150, 200]);
    const sigma = 2 * rng.int(1, 10);
    const mu = rng.int(50, 150);
    const N = 100 * rng.int(1, 9);
    const upper = rng.bool();
    const shift = (z * sigma) / 100;
    const boundary = upper ? mu + shift : mu - shift;
    const tail = oneMinus(phi(z));
    const answer = tail.mul(Q.of(N));
    const rest = phi(z).mul(Q.of(N));
    const event = upper ? `x > ${boundary}` : `x < ${boundary}`;
    const zb = `${upper ? "" : "-"}${zText(z)}`;
    return numberProblem({
      prompt: t(
        `A model $N(${mu}, ${sigma * sigma})$ is tested on $${N}$ observations. Find the expected count of the class $${event}$. Use $${given(z)}$.`,
        `用 $${N}$ 个观测检验模型 $N(${mu}, ${sigma * sigma})$。求类别 $${event}$ 的期望计数。利用 $${given(z)}$。`,
      ),
      answer,
      form: "decimal",
      mistakes: unlike(answer, [
        why(
          rest,
          `This multiplies by the table value $${dec(phi(z))}$ itself, which is the area on the other side of the boundary.`,
          `这直接乘以表值 $${dec(phi(z))}$，它是边界另一侧的面积。`,
        ),
        why(tail, `This is the probability of the class, not yet multiplied by $${N}$.`, `这是该类别的概率，还没有乘以 $${N}$。`),
        why(answer.mul(Q.of(2)), "This counts both tails; the class is only one of them.", "这计入了两侧尾部；该类别只是其中一侧。"),
      ]),
      solution: walked(
        [
          [
            ["Standardize the boundary", "把边界标准化"],
            t(
              `$\\sigma = ${sigma}$, so $z = \\frac{${boundary} - ${mu}}{${sigma}} = ${zb}$.`,
              `$\\sigma = ${sigma}$，所以 $z = \\frac{${boundary} - ${mu}}{${sigma}} = ${zb}$。`,
            ),
          ],
          [
            ["Find the tail area", "求尾部面积"],
            t(
              `${upper ? "The area above" : "By symmetry, the area below"} $z = ${zb}$ is $1 - ${dec(phi(z))} = ${dec(tail)}$.`,
              `${upper ? "" : "由对称性，"}$z = ${zb}$ ${upper ? "以上" : "以下"}的面积为 $1 - ${dec(phi(z))} = ${dec(tail)}$。`,
            ),
          ],
          [
            ["Multiply by the number of observations", "乘以观测数"],
            t(`$${N} \\cdot ${dec(tail)} = ${dec(answer)}$.`, `$${N} \\cdot ${dec(tail)} = ${dec(answer)}$。`),
          ],
        ],
        t(
          `The rest of the observations expect $${N} \\cdot ${dec(phi(z))} = ${dec(rest)}$, and $${dec(answer)} + ${dec(rest)} = ${N}$.`,
          `其余观测的期望为 $${N} \\cdot ${dec(phi(z))} = ${dec(rest)}$，而 $${dec(answer)} + ${dec(rest)} = ${N}$。`,
        ),
      ),
    });
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
