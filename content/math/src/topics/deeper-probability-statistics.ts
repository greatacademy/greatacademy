// Further knowledge points for topics of Probability & Statistics, each a skill
// the topic's own points leave out. See `deeperProbabilityStatisticsPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";

/** nonzero picks a nonzero integer from -r to r. */
const nonzero = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** tenths writes a number of tenths as a decimal. */
const tenths = (n: number) => (n % 10 === 0 ? `${n / 10}` : `0.${n}`);
/** inParens puts a negative number in parentheses, for use inside a sum. */
const inParens = (n: number) => (n < 0 ? `(${n})` : `${n}`);
/** factorial multiplies the integers from 1 to n. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
/** choose2 counts the ways to choose two things from n. */
const choose2 = (n: number) => (n * (n - 1)) / 2;
/** power raises a rational number to a whole power. */
const power = (q: Q, n: number): Q => (n === 0 ? Q.of(1) : q.mul(power(q, n - 1)));

const bayesTwice: KnowledgePointDef = {
  id: "bayes-theorem-after-two-positive-tests",
  title: t("Bayes' theorem after two positive tests", "两次阳性后的贝叶斯定理"),
  explanation: t(
    "When two tests are independent given the true state, their likelihoods multiply. So for two positive results, each branch of the tree gets the square of its single-test probability, and the posterior is the part of the total coming from the true branch.",
    "如果两次检测在真实状态给定时独立，它们的似然相乘。所以两次都阳性时，树的每个分支都乘以单次概率的平方，后验概率就是真实分支在总和中所占的比例。",
  ),
  generate(rng) {
    const p = rng.int(1, 4);
    const s = rng.int(6, 9);
    const f = rng.int(1, 3);
    const prior = Q.of(p, 10);
    const rest = Q.of(10 - p, 10);
    const yes = prior.mul(power(Q.of(s, 10), 2));
    const no = rest.mul(power(Q.of(f, 10), 2));
    const answer = yes.div(yes.add(no));
    const once = prior.mul(Q.of(s, 10));
    const onceNo = rest.mul(Q.of(f, 10));
    return numberProblem({
      prompt: t(
        `A condition affects ${p * 10}% of a population. A test is positive with probability ${tenths(s)} if the condition is present and ${tenths(f)} if it is absent, and repeated tests are independent given the true state. A person tests positive twice. What is the probability that they have the condition?`,
        `某种情况在人群中占 ${p * 10}%。如果情况存在，检测呈阳性的概率是 ${tenths(s)}；如果不存在，概率是 ${tenths(f)}。在真实状态给定时，重复检测相互独立。一个人两次检测都呈阳性，此人确实有这种情况的概率是多少？`,
      ),
      answer,
      wrong: [once.div(once.add(onceNo)), yes, Q.of(s, 10)],
      solution: t(
        `The true branch has probability ${tenths(p)} times ${tenths(s)} squared, which is $${yes.toLatex()}$. The false branch has ${tenths(10 - p)} times ${tenths(f)} squared, which is $${no.toLatex()}$. The posterior is the share of the true branch, $${answer.toLatex()}$.`,
        `真实分支的概率是 ${tenths(p)} 乘 ${tenths(s)} 的平方，即 $${yes.toLatex()}$。错误分支的概率是 ${tenths(10 - p)} 乘 ${tenths(f)} 的平方，即 $${no.toLatex()}$。后验概率是真实分支所占的比例，$${answer.toLatex()}$。`,
      ),
    });
  },
};

const starsWithLowerBounds: KnowledgePointDef = {
  id: "stars-and-bars-with-lower-bounds",
  title: t("Stars and bars with lower bounds", "带下界的隔板法"),
  explanation: t(
    "To count solutions in which some variables have minimum values, first hand out those minimums. What remains is a count of nonnegative solutions with a smaller total, which stars and bars handles: $n$ items among $3$ variables can be split in $\\binom{n+2}{2}$ ways.",
    "要数某些变量有最小值的解，先把这些最小值分出去。剩下的就是总数更小的非负解计数，可以用隔板法：$n$ 个物品分给 $3$ 个变量有 $\\binom{n+2}{2}$ 种分法。",
  ),
  generate(rng) {
    const n = rng.int(8, 20);
    const a = rng.int(1, 4);
    const b = rng.int(1, 4);
    const left = n - a - b;
    const answer = choose2(left + 2);
    return numberProblem({
      prompt: t(
        `How many integer solutions does $x + y + z = ${n}$ have with $x \\ge ${a}$, $y \\ge ${b}$ and $z \\ge 0$?`,
        `$x + y + z = ${n}$ 有多少组整数解满足 $x \\ge ${a}$，$y \\ge ${b}$，$z \\ge 0$？`,
      ),
      answer,
      form: "integer",
      wrong: [choose2(n + 2), choose2(left + 1), choose2(left + 3)],
      solution: t(
        `Give $x$ and $y$ their minimums, using $${a + b}$ and leaving $${left}$ to share freely among three variables. That can be done in $\\binom{${left + 2}}{2} = ${answer}$ ways.`,
        `先把最小值分给 $x$ 和 $y$，用去 $${a + b}$，剩下 $${left}$ 由三个变量自由分配。分法有 $\\binom{${left + 2}}{2} = ${answer}$ 种。`,
      ),
    });
  },
};

const repeatsKeptTogether: KnowledgePointDef = {
  id: "arrangements-with-identical-letters-kept-together",
  title: t("Arrangements with identical letters kept together", "相同字母相邻的排列"),
  explanation: t(
    "If all copies of one letter must stand together, treat them as a single block. The block is one object in the arrangement, and its copies are identical, so there is no need to arrange inside it. Other repeated letters still divide the count.",
    "如果某个字母的所有副本必须相邻，就把它们看成一个整体。这个整体在排列中算一个对象，里面的字母相同，不必再排。其他重复的字母仍然要除掉重复计数。",
  ),
  generate(rng) {
    const a = rng.int(2, 5);
    const b = rng.int(2, 4);
    const c = rng.int(1, 3);
    const others = ["C", "D", "E"].slice(0, c);
    const letters = [...Array(a).fill("A"), ...Array(b).fill("B"), ...others].join(", ");
    const objects = 1 + b + c;
    const answer = factorial(objects) / factorial(b);
    return numberProblem({
      prompt: t(
        `The letters ${letters} are arranged in a row with all the A's next to each other. How many different rows are possible?`,
        `字母 ${letters} 排成一行，所有 A 相邻。一共有多少种不同的排法？`,
      ),
      answer,
      form: "integer",
      wrong: [factorial(a + b + c) / (factorial(a) * factorial(b)), factorial(objects), factorial(objects) * factorial(a)],
      solution: t(
        `Treat the A's as one block. That leaves $${objects}$ objects, among them $${b}$ identical B's, so the count is $\\frac{${objects}!}{${b}!} = ${answer}$.`,
        `把所有 A 看成一个整体。这样共有 $${objects}$ 个对象，其中 $${b}$ 个相同的 B，所以排法有 $\\frac{${objects}!}{${b}!} = ${answer}$ 种。`,
      ),
    });
  },
};

const expectationFromTail: KnowledgePointDef = {
  id: "the-expected-value-from-the-tail-probability",
  title: t("The expected value from the tail probability", "由尾部概率求期望"),
  explanation: t(
    "For a nonnegative random variable, integrating by parts shows that $E[X] = \\int_0^\\infty P(X > t)\\,dt$. This is useful when the tail probability is simpler than the density, because no derivative is needed.",
    "对非负随机变量，分部积分可得 $E[X] = \\int_0^\\infty P(X > t)\\,dt$。当尾部概率比密度函数简单时，这个公式很有用，因为不必求导。",
  ),
  generate(rng) {
    const n = rng.int(2, 7);
    const s = rng.int(1, 6);
    const answer = Q.of(s, n - 1);
    const inner = s === 1 ? "1 + t" : `1 + \\frac{t}{${s}}`;
    return numberProblem({
      prompt: t(
        `A nonnegative random variable $X$ has $P(X > t) = \\left(${inner}\\right)^{-${n}}$ for $t \\ge 0$. Find $E[X]$.`,
        `非负随机变量 $X$ 满足：当 $t \\ge 0$ 时，$P(X > t) = \\left(${inner}\\right)^{-${n}}$。求 $E[X]$。`,
      ),
      answer,
      wrong: [Q.of(s, n), Q.of(s, n + 1), Q.of(n - 1, s)],
      solution: t(
        `Integrate the tail: $\\int_0^\\infty \\left(${inner}\\right)^{-${n}}\\,dt = ${s} \\cdot \\frac{1}{${n - 1}}$, using the substitution $u = ${inner}$. So $E[X] = ${answer.toLatex()}$.`,
        `对尾部概率积分：令 $u = ${inner}$，得 $\\int_0^\\infty \\left(${inner}\\right)^{-${n}}\\,dt = ${s} \\cdot \\frac{1}{${n - 1}}$。所以 $E[X] = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const varianceFromExponentialMgf: KnowledgePointDef = {
  id: "the-variance-from-an-exponential-of-a-quadratic-mgf",
  title: t("The variance from an MGF of the form $e^{at+bt^2}$", "由 $e^{at+bt^2}$ 形式的矩母函数求方差"),
  explanation: t(
    "Differentiate $M(t)$ twice and set $t = 0$ to get $E[X]$ and $E[X^2]$, and then the variance is $E[X^2] - E[X]^2$. For $M(t) = e^{at+bt^2}$ the variance comes to $2b$, whatever the value of $a$: shifting a distribution does not change its spread.",
    "对 $M(t)$ 求两次导并令 $t = 0$，得 $E[X]$ 和 $E[X^2]$，方差就是 $E[X^2] - E[X]^2$。对 $M(t) = e^{at+bt^2}$，方差是 $2b$，与 $a$ 无关：平移分布不改变它的分散程度。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = rng.int(1, 6);
    const answer = 2 * b;
    return numberProblem({
      prompt: t(
        `A random variable has moment-generating function $M(t) = e^{${poly([a, "t"], [b, "t^2"])}}$. Find its variance.`,
        `随机变量的矩母函数是 $M(t) = e^{${poly([a, "t"], [b, "t^2"])}}$。求它的方差。`,
      ),
      answer,
      form: "integer",
      wrong: [b, a * a, a * a + 2 * b],
      solution: t(
        `$M'(0) = ${a}$, and $M''(0) = (${a})^2 + ${2 * b} = ${a * a + 2 * b}$. So the variance is $${a * a + 2 * b} - (${a})^2 = ${answer}$.`,
        `$M'(0) = ${a}$，$M''(0) = (${a})^2 + ${2 * b} = ${a * a + 2 * b}$。所以方差是 $${a * a + 2 * b} - (${a})^2 = ${answer}$。`,
      ),
    });
  },
};

const momentFromSeries: KnowledgePointDef = {
  id: "a-moment-from-the-series-of-an-mgf",
  title: t("A moment from the series of an MGF", "由矩母函数的级数求矩"),
  explanation: t(
    "The series $M(t) = \\sum_k E[X^k]\\frac{t^k}{k!}$ means that the coefficient of $t^k$ is $\\frac{E[X^k]}{k!}$. So a moment can be read off without differentiating, as long as the coefficient is multiplied by $k!$.",
    "级数 $M(t) = \\sum_k E[X^k]\\frac{t^k}{k!}$ 说明 $t^k$ 的系数是 $\\frac{E[X^k]}{k!}$。所以不必求导就能读出矩，只要把系数乘以 $k!$。",
  ),
  generate(rng) {
    const c1 = rng.int(1, 3);
    const c2 = Math.ceil((c1 * c1) / 2) + rng.int(1, 3);
    const c3 = rng.int(1, 6);
    const k = rng.int(2, 3);
    const c = k === 2 ? c2 : c3;
    const answer = factorial(k) * c;
    return numberProblem({
      prompt: t(
        `The series of a moment-generating function begins $M(t) = 1 + ${poly([c1, "t"], [c2, "t^2"], [c3, "t^3"])} + \\cdots$. Find $E[X^{${k}}]$.`,
        `某矩母函数的级数开头是 $M(t) = 1 + ${poly([c1, "t"], [c2, "t^2"], [c3, "t^3"])} + \\cdots$。求 $E[X^{${k}}]$。`,
      ),
      answer,
      form: "integer",
      wrong: [c, k * c, answer + c1],
      solution: t(
        `The coefficient of $t^{${k}}$ is $\\frac{E[X^{${k}}]}{${k}!}$. So $E[X^{${k}}] = ${k}! \\cdot ${c} = ${answer}$.`,
        `$t^{${k}}$ 的系数是 $\\frac{E[X^{${k}}]}{${k}!}$。所以 $E[X^{${k}}] = ${k}! \\cdot ${c} = ${answer}$。`,
      ),
    });
  },
};

const binomialMode: KnowledgePointDef = {
  id: "the-most-likely-value-of-a-binomial-variable",
  title: t("The most likely value of a binomial variable", "二项变量最可能的取值"),
  explanation: t(
    "Comparing consecutive probabilities gives $\\frac{P(X=k)}{P(X=k-1)} = \\frac{(n-k+1)p}{k(1-p)}$, which is above one exactly when $k < (n+1)p$. So the probabilities rise and then fall, and the most likely value is the greatest integer below $(n+1)p$. It need not be the mean.",
    "比较相邻概率得 $\\frac{P(X=k)}{P(X=k-1)} = \\frac{(n-k+1)p}{k(1-p)}$，当且仅当 $k < (n+1)p$ 时它大于一。所以概率先升后降，最可能的取值是小于 $(n+1)p$ 的最大整数，不一定等于均值。",
  ),
  generate(rng) {
    let n: number;
    let p: number;
    do {
      n = rng.int(5, 30);
      p = rng.int(1, 9);
    } while (((n + 1) * p) % 10 === 0);
    const answer = Math.floor(((n + 1) * p) / 10);
    const mean = Q.of(n * p, 10);
    return numberProblem({
      prompt: t(
        `$X$ has a binomial distribution with $n = ${n}$ and $p = ${tenths(p)}$. For which value $k$ is $P(X = k)$ largest?`,
        `$X$ 服从二项分布，$n = ${n}$，$p = ${tenths(p)}$。$k$ 取何值时 $P(X = k)$ 最大？`,
      ),
      answer,
      solveFor: "k",
      wrong: [answer + 1, answer - 1, Math.ceil((n * p) / 10) + 1],
      solution: t(
        `Here $(n+1)p = ${Q.of((n + 1) * p, 10).toLatex()}$, which is not an integer, and the greatest integer below it is $${answer}$. The mean is $${mean.toLatex()}$, which is close but need not point to the same integer.`,
        `这里 $(n+1)p = ${Q.of((n + 1) * p, 10).toLatex()}$，不是整数，小于它的最大整数是 $${answer}$。均值是 $${mean.toLatex()}$，二者接近，但不一定对应同一个整数。`,
      ),
    });
  },
};

const poissonRatio: KnowledgePointDef = {
  id: "the-poisson-mean-from-a-ratio-of-probabilities",
  title: t("The Poisson mean from a ratio of probabilities", "由概率之比求泊松均值"),
  explanation: t(
    "In the formula for a Poisson probability most of the factors cancel between neighbours, leaving $\\frac{P(X=k+1)}{P(X=k)} = \\frac{\\lambda}{k+1}$. The exponential disappears, so a ratio of two probabilities gives $\\lambda$ with no logarithm or table.",
    "在泊松概率公式中，相邻两项的大多数因子都约掉，只剩 $\\frac{P(X=k+1)}{P(X=k)} = \\frac{\\lambda}{k+1}$。指数项消失了，所以由两个概率之比就能求 $\\lambda$，不用对数也不用查表。",
  ),
  generate(rng) {
    const lambda = rng.int(1, 12);
    const k = rng.int(0, 6);
    const ratio = Q.of(lambda, k + 1);
    return numberProblem({
      prompt: t(
        `$X$ has a Poisson distribution with $\\frac{P(X = ${k + 1})}{P(X = ${k})} = ${ratio.toLatex()}$. Find the mean $\\lambda$.`,
        `$X$ 服从泊松分布，$\\frac{P(X = ${k + 1})}{P(X = ${k})} = ${ratio.toLatex()}$。求均值 $\\lambda$。`,
      ),
      answer: lambda,
      wrong: [ratio, ratio.mul(Q.of(k === 0 ? 2 : k)), lambda + k + 1],
      solution: t(
        `The ratio is $\\frac{\\lambda}{${k + 1}}$, so $\\lambda = ${k + 1} \\cdot ${ratio.toLatex()} = ${lambda}$.`,
        `这个比是 $\\frac{\\lambda}{${k + 1}}$，所以 $\\lambda = ${k + 1} \\cdot ${ratio.toLatex()} = ${lambda}$。`,
      ),
    });
  },
};

const geometricMemoryless: KnowledgePointDef = {
  id: "the-memoryless-property-of-the-geometric-distribution",
  title: t("The memoryless property of the geometric distribution", "几何分布的无记忆性"),
  explanation: t(
    "If $X$ counts the trials up to the first success, then $P(X > n) = (1-p)^n$, since the first $n$ trials all fail. Dividing gives $P(X > s + t \\mid X > s) = (1-p)^t$. Failures so far have no effect on the trials still to come.",
    "如果 $X$ 是到第一次成功为止的试验次数，则 $P(X > n) = (1-p)^n$，因为前 $n$ 次全部失败。相除得 $P(X > s + t \\mid X > s) = (1-p)^t$。已有的失败不影响之后的试验。",
  ),
  generate(rng) {
    const p = rng.int(1, 9);
    const s = rng.int(2, 9);
    const u = rng.int(1, 3);
    const q = Q.of(10 - p, 10);
    const answer = power(q, u);
    return numberProblem({
      prompt: t(
        `$X$ is the number of trials up to and including the first success, with success probability ${tenths(p)} on each trial. Find $P(X > ${s + u} \\mid X > ${s})$.`,
        `$X$ 是到第一次成功（含这一次）为止的试验次数，每次成功的概率是 ${tenths(p)}。求 $P(X > ${s + u} \\mid X > ${s})$。`,
      ),
      answer,
      wrong: [power(q, s + u), power(q, s), Q.of(p, 10).mul(power(q, u))],
      solution: t(
        `The condition says the first $${s}$ trials failed. To pass $${s + u}$, the next $${u}$ must also fail, and they are independent of the past. This has probability $(${tenths(10 - p)})^{${u}} = ${answer.toLatex()}$.`,
        `条件说明前 $${s}$ 次都失败了。要超过 $${s + u}$，接下来的 $${u}$ 次也必须失败，而它们与之前的试验独立。概率是 $(${tenths(10 - p)})^{${u}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const uniformEndpoints: KnowledgePointDef = {
  id: "the-endpoints-of-a-uniform-distribution-from-its-moments",
  title: t("The endpoints of a uniform distribution from its moments", "由矩求均匀分布的端点"),
  explanation: t(
    "A uniform distribution on $[a, b]$ has mean $\\frac{a+b}{2}$ and variance $\\frac{(b-a)^2}{12}$. The variance therefore gives the width of the interval, and the mean gives its center. The endpoints lie half a width to each side of the center.",
    "$[a, b]$ 上的均匀分布，均值是 $\\frac{a+b}{2}$，方差是 $\\frac{(b-a)^2}{12}$。所以方差给出区间的宽度，均值给出中心，端点在中心两侧各半个宽度处。",
  ),
  generate(rng) {
    const w = 6 * rng.int(1, 4);
    const m = rng.int(-9, 9);
    const variance = (w * w) / 12;
    const upper = rng.int(0, 1) === 0;
    const answer = upper ? m + w / 2 : m - w / 2;
    return numberProblem({
      prompt: t(
        `A uniform random variable on $[a, b]$ has mean $${m}$ and variance $${variance}$. Find $${upper ? "b" : "a"}$.`,
        `$[a, b]$ 上的均匀随机变量，均值为 $${m}$，方差为 $${variance}$。求 $${upper ? "b" : "a"}$。`,
      ),
      answer,
      form: "integer",
      wrong: [upper ? m + w : m - w, upper ? m + variance : m - variance, upper ? m - w / 2 : m + w / 2],
      solution: t(
        `From $\\frac{(b-a)^2}{12} = ${variance}$, the width is $b - a = ${w}$. The endpoint is half of that from the mean: $${m} ${upper ? "+" : "-"} ${w / 2} = ${answer}$.`,
        `由 $\\frac{(b-a)^2}{12} = ${variance}$ 得宽度 $b - a = ${w}$。端点离均值半个宽度：$${m} ${upper ? "+" : "-"} ${w / 2} = ${answer}$。`,
      ),
    });
  },
};

const minimumOfExponentials: KnowledgePointDef = {
  id: "the-first-of-two-exponential-waiting-times",
  title: t("The first of two exponential waiting times", "两个指数等待时间中较早的一个"),
  explanation: t(
    "The minimum of two independent exponential times exceeds $t$ only if both do, so $P(T > t) = e^{-\\lambda_1 t}e^{-\\lambda_2 t}$. So the minimum is exponential too, with the sum of the two rates. Add rates, not means, and the expected first failure is the reciprocal of that sum.",
    "两个独立指数时间的最小值超过 $t$，当且仅当两者都超过 $t$，所以 $P(T > t) = e^{-\\lambda_1 t}e^{-\\lambda_2 t}$。因此最小值也服从指数分布，速率是两个速率之和。要加的是速率而不是均值，首次失效的期望时间是这个和的倒数。",
  ),
  generate(rng) {
    const a = rng.int(2, 12);
    let b = rng.int(2, 12);
    if (b === a) b += 1;
    const answer = Q.of(a * b, a + b);
    return numberProblem({
      prompt: t(
        `Two machines run independently, and their lifetimes are exponential with means ${a} and ${b} years. What is the expected time until the first of them fails, in years?`,
        `两台机器独立运行，寿命服从指数分布，均值分别为 ${a} 年和 ${b} 年。直到其中一台首次失效，期望时间是多少年？`,
      ),
      answer,
      wrong: [Q.of(a + b, 2), Math.min(a, b), Q.of(a + b, a * b)],
      solution: t(
        `The rates are $\\frac{1}{${a}}$ and $\\frac{1}{${b}}$, with sum $\\frac{${a + b}}{${a * b}}$. The first failure is exponential with this rate, so its mean is $${answer.toLatex()}$.`,
        `速率是 $\\frac{1}{${a}}$ 和 $\\frac{1}{${b}}$，和为 $\\frac{${a + b}}{${a * b}}$。首次失效服从这个速率的指数分布，所以均值是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const probabilityFromIndependentUnion: KnowledgePointDef = {
  id: "a-probability-from-the-union-of-independent-events",
  title: t("A probability from the union of independent events", "由独立事件的并求概率"),
  explanation: t(
    "For independent events, $P(A \\cup B) = P(A) + P(B) - P(A)P(B)$. Working with complements is cleaner: $1 - P(A \\cup B) = (1 - P(A))(1 - P(B))$. This form solves directly for one probability when the other and the union are known.",
    "对独立事件，$P(A \\cup B) = P(A) + P(B) - P(A)P(B)$。用补事件更简洁：$1 - P(A \\cup B) = (1 - P(A))(1 - P(B))$。已知其中一个概率和并的概率时，这个形式可以直接解出另一个。",
  ),
  generate(rng) {
    const p = rng.int(1, 9);
    const q = rng.int(1, 9);
    const union = Q.of(100 - (10 - p) * (10 - q), 100);
    const answer = Q.of(q, 10);
    return numberProblem({
      prompt: t(
        `$X$ and $Y$ are independent and take the values $0$ and $1$. $P(X = 1) = ${tenths(p)}$, and the probability that at least one of them equals $1$ is $${union.toLatex()}$. Find $P(Y = 1)$.`,
        `$X$ 和 $Y$ 独立，取值为 $0$ 和 $1$。$P(X = 1) = ${tenths(p)}$，至少有一个等于 $1$ 的概率是 $${union.toLatex()}$。求 $P(Y = 1)$。`,
      ),
      answer,
      wrong: [union.sub(Q.of(p, 10)), union.div(Q.of(p, 10)), Q.of(10 - q, 10)],
      solution: t(
        `Neither equals $1$ with probability $1 - ${union.toLatex()} = ${Q.of((10 - p) * (10 - q), 100).toLatex()}$, and by independence this is ${tenths(10 - p)} times $P(Y = 0)$. So $P(Y = 0) = ${Q.of(10 - q, 10).toLatex()}$ and $P(Y = 1) = ${answer.toLatex()}$.`,
        `都不等于 $1$ 的概率是 $1 - ${union.toLatex()} = ${Q.of((10 - p) * (10 - q), 100).toLatex()}$，由独立性它等于 ${tenths(10 - p)} 乘 $P(Y = 0)$。所以 $P(Y = 0) = ${Q.of(10 - q, 10).toLatex()}$，$P(Y = 1) = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const covarianceOfCombinations: KnowledgePointDef = {
  id: "the-covariance-of-linear-combinations",
  title: t("The covariance of linear combinations", "线性组合的协方差"),
  explanation: t(
    "Covariance is linear in each argument, and adding a constant has no effect on it. So $\\operatorname{Cov}(aX + b, cY + d) = ac\\operatorname{Cov}(X, Y)$, and $\\operatorname{Cov}(aX + bY, X) = a\\operatorname{Var}(X) + b\\operatorname{Cov}(X, Y)$, since the covariance of a variable with itself is its variance.",
    "协方差对每个变量都是线性的，加常数不影响它。所以 $\\operatorname{Cov}(aX + b, cY + d) = ac\\operatorname{Cov}(X, Y)$，$\\operatorname{Cov}(aX + bY, X) = a\\operatorname{Var}(X) + b\\operatorname{Cov}(X, Y)$，因为变量与自身的协方差就是方差。",
  ),
  generate(rng) {
    const a = nonzero(rng, 4);
    const b = nonzero(rng, 5);
    const cov = nonzero(rng, 6);
    const variance = rng.int(1, 9);
    if (rng.int(0, 1) === 0) {
      const c = nonzero(rng, 4);
      const d = nonzero(rng, 5);
      const answer = a * c * cov;
      const left = poly([a, "X"], [b, ""]);
      const right = poly([c, "Y"], [d, ""]);
      return numberProblem({
        prompt: t(
          `$\\operatorname{Cov}(X, Y) = ${cov}$. Find $\\operatorname{Cov}(${left}, ${right})$.`,
          `$\\operatorname{Cov}(X, Y) = ${cov}$。求 $\\operatorname{Cov}(${left}, ${right})$。`,
        ),
        answer,
        form: "integer",
        wrong: [answer + b * d, cov, (a + b) * (c + d) * cov],
        solution: t(
          `The constants have no effect, and the coefficients come out: $${inParens(a)} \\cdot ${inParens(c)} \\cdot ${inParens(cov)} = ${answer}$.`,
          `常数不起作用，系数可以提出来：$${inParens(a)} \\cdot ${inParens(c)} \\cdot ${inParens(cov)} = ${answer}$。`,
        ),
      });
    }
    const combination = poly([a, "X"], [b, "Y"]);
    const answer = a * variance + b * cov;
    return numberProblem({
      prompt: t(
        `$\\operatorname{Var}(X) = ${variance}$ and $\\operatorname{Cov}(X, Y) = ${cov}$. Find $\\operatorname{Cov}(${combination}, X)$.`,
        `$\\operatorname{Var}(X) = ${variance}$，$\\operatorname{Cov}(X, Y) = ${cov}$。求 $\\operatorname{Cov}(${combination}, X)$。`,
      ),
      answer,
      form: "integer",
      wrong: [b * cov, (a + b) * cov, a * a * variance + b * cov],
      solution: t(
        `Split the first argument: $${inParens(a)}\\operatorname{Cov}(X, X) + ${inParens(b)}\\operatorname{Cov}(Y, X) = ${inParens(a)}(${variance}) + ${inParens(b)}(${cov}) = ${answer}$.`,
        `拆开第一个变量：$${inParens(a)}\\operatorname{Cov}(X, X) + ${inParens(b)}\\operatorname{Cov}(Y, X) = ${inParens(a)}(${variance}) + ${inParens(b)}(${cov}) = ${answer}$。`,
      ),
    });
  },
};

const largestVarianceOfASum: KnowledgePointDef = {
  id: "the-largest-possible-variance-of-a-sum",
  title: t("The largest possible variance of a sum", "和的方差的最大可能值"),
  explanation: t(
    "A correlation lies between $-1$ and $1$, so $|\\operatorname{Cov}(X, Y)| \\le \\sigma_X\\sigma_Y$. In $\\operatorname{Var}(X + Y) = \\sigma_X^2 + \\sigma_Y^2 + 2\\operatorname{Cov}(X, Y)$, the largest value comes at correlation $1$ and is $(\\sigma_X + \\sigma_Y)^2$. The smallest comes at $-1$ and is $(\\sigma_X - \\sigma_Y)^2$.",
    "相关系数在 $-1$ 和 $1$ 之间，所以 $|\\operatorname{Cov}(X, Y)| \\le \\sigma_X\\sigma_Y$。在 $\\operatorname{Var}(X + Y) = \\sigma_X^2 + \\sigma_Y^2 + 2\\operatorname{Cov}(X, Y)$ 中，相关系数为 $1$ 时取最大值 $(\\sigma_X + \\sigma_Y)^2$，为 $-1$ 时取最小值 $(\\sigma_X - \\sigma_Y)^2$。",
  ),
  generate(rng) {
    const s = rng.int(1, 9);
    let u = rng.int(1, 9);
    if (u === s) u += 1;
    const largest = rng.int(0, 1) === 0;
    const answer = largest ? (s + u) ** 2 : (s - u) ** 2;
    return numberProblem({
      prompt: t(
        `$\\operatorname{Var}(X) = ${s * s}$ and $\\operatorname{Var}(Y) = ${u * u}$. What is the ${largest ? "largest" : "smallest"} possible value of $\\operatorname{Var}(X + Y)$?`,
        `$\\operatorname{Var}(X) = ${s * s}$，$\\operatorname{Var}(Y) = ${u * u}$。$\\operatorname{Var}(X + Y)$ 的${largest ? "最大" : "最小"}可能值是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [s * s + u * u, largest ? (s - u) ** 2 : (s + u) ** 2, s * s + u * u + s * u],
      solution: t(
        `The standard deviations are $${s}$ and $${u}$. The ${largest ? "largest" : "smallest"} value comes at correlation $${largest ? 1 : -1}$, where the variance is $${s * s} + ${u * u} ${largest ? "+" : "-"} 2(${s})(${u}) = ${answer}$.`,
        `标准差是 $${s}$ 和 $${u}$。${largest ? "最大" : "最小"}值在相关系数为 $${largest ? 1 : -1}$ 时取得，此时方差是 $${s * s} + ${u * u} ${largest ? "+" : "-"} 2(${s})(${u}) = ${answer}$。`,
      ),
    });
  },
};

const lawOfTotalVariance: KnowledgePointDef = {
  id: "the-law-of-total-variance",
  title: t("The law of total variance", "全方差公式"),
  explanation: t(
    "The spread of $Y$ has two sources: the spread inside each group and the differences between group means. The law of total variance adds them: $\\operatorname{Var}(Y) = E[\\operatorname{Var}(Y \\mid X)] + \\operatorname{Var}(E[Y \\mid X])$. Averaging the group variances alone leaves out the second part.",
    "$Y$ 的分散有两个来源：各组内部的分散和各组均值之间的差异。全方差公式把它们相加：$\\operatorname{Var}(Y) = E[\\operatorname{Var}(Y \\mid X)] + \\operatorname{Var}(E[Y \\mid X])$。只对组内方差取平均，就漏掉了第二部分。",
  ),
  generate(rng) {
    const p = rng.int(1, 9);
    const m0 = rng.int(0, 6);
    const m1 = m0 + rng.int(1, 6);
    const v0 = rng.int(1, 9);
    const v1 = rng.int(1, 9);
    const w = Q.of(p, 10);
    const rest = Q.of(10 - p, 10);
    const within = w.mul(Q.of(v1)).add(rest.mul(Q.of(v0)));
    const between = w.mul(rest).mul(Q.of((m1 - m0) ** 2));
    const answer = within.add(between);
    return numberProblem({
      prompt: t(
        `$P(X = 1) = ${tenths(p)}$ and $P(X = 0) = ${tenths(10 - p)}$. Given $X = 0$, $Y$ has mean $${m0}$ and variance $${v0}$. Given $X = 1$, $Y$ has mean $${m1}$ and variance $${v1}$. Find $\\operatorname{Var}(Y)$.`,
        `$P(X = 1) = ${tenths(p)}$，$P(X = 0) = ${tenths(10 - p)}$。当 $X = 0$ 时，$Y$ 的均值为 $${m0}$，方差为 $${v0}$；当 $X = 1$ 时，$Y$ 的均值为 $${m1}$，方差为 $${v1}$。求 $\\operatorname{Var}(Y)$。`,
      ),
      answer,
      wrong: [within, between, Q.of(v0 + v1, 2)],
      solution: t(
        `The average of the conditional variances is $${within.toLatex()}$. The conditional means differ by $${m1 - m0}$, so their variance is $${tenths(p)} \\cdot ${tenths(10 - p)} \\cdot ${(m1 - m0) ** 2} = ${between.toLatex()}$. The total is $${answer.toLatex()}$.`,
        `条件方差的平均是 $${within.toLatex()}$。条件均值相差 $${m1 - m0}$，所以它们的方差是 $${tenths(p)} \\cdot ${tenths(10 - p)} \\cdot ${(m1 - m0) ** 2} = ${between.toLatex()}$。总和是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const mleOfNormalVariance: KnowledgePointDef = {
  id: "the-mle-of-a-normal-variance",
  title: t("The MLE of a normal variance", "正态方差的最大似然估计"),
  explanation: t(
    "Maximizing the normal likelihood gives $\\hat{\\mu} = \\bar{x}$ and $\\hat{\\sigma}^2 = \\frac{1}{n}\\sum(x_i - \\bar{x})^2$. The divisor is $n$, not the $n - 1$ of the sample variance, so the maximum likelihood estimate is slightly biased low.",
    "使正态似然最大，得 $\\hat{\\mu} = \\bar{x}$，$\\hat{\\sigma}^2 = \\frac{1}{n}\\sum(x_i - \\bar{x})^2$。除数是 $n$，而不是样本方差的 $n - 1$，所以最大似然估计略微偏低。",
  ),
  generate(rng) {
    const n = rng.int(4, 5);
    const data = Array.from({ length: n }, () => rng.int(1, 12));
    const remainder = data.reduce((s, x) => s + x, 0) % n;
    data[0]! += remainder === 0 ? 0 : n - remainder;
    if (data.every((x) => x === data[0])) data[0]! += n;
    const total = data.reduce((s, x) => s + x, 0);
    const mean = total / n;
    const squares = data.reduce((s, x) => s + (x - mean) ** 2, 0);
    const answer = Q.of(squares, n);
    return numberProblem({
      prompt: t(
        `A sample from a normal distribution with unknown mean and variance is $${data.join(", ")}$. Find the maximum likelihood estimate of $\\sigma^2$.`,
        `来自均值和方差都未知的正态分布的样本是 $${data.join(", ")}$。求 $\\sigma^2$ 的最大似然估计。`,
      ),
      answer,
      wrong: [Q.of(squares, n - 1), squares, mean],
      solution: t(
        `The estimate of the mean is $\\bar{x} = ${mean}$, and the squared deviations from it add up to $${squares}$. Dividing by $n = ${n}$ gives $${answer.toLatex()}$.`,
        `均值的估计是 $\\bar{x} = ${mean}$，与它的离差平方和是 $${squares}$。除以 $n = ${n}$ 得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const marginAndSampleSize: KnowledgePointDef = {
  id: "how-the-margin-of-error-depends-on-the-sample-size",
  title: t("How the margin of error depends on the sample size", "误差范围如何随样本量变化"),
  explanation: t(
    "The margin of error is proportional to $\\frac{1}{\\sqrt{n}}$. To divide the margin by $k$, the sample size must be multiplied by $k^2$. So halving a margin of error takes four times the data, and precision becomes expensive quickly.",
    "误差范围与 $\\frac{1}{\\sqrt{n}}$ 成正比。要把误差范围除以 $k$，样本量必须乘以 $k^2$。所以把误差范围减半需要四倍的数据，精度的代价上升得很快。",
  ),
  generate(rng) {
    const n = rng.pick([25, 30, 40, 50, 64, 80, 100, 120]);
    const k = rng.int(2, 4);
    const E = k * rng.int(1, 6);
    const answer = n * k * k;
    return numberProblem({
      prompt: t(
        `A sample of size ${n} gives a 95% confidence interval for a mean, with known population variance and margin of error $${E}$. What sample size gives margin of error $${E / k}$ at the same confidence level?`,
        `样本量为 ${n} 时，总体方差已知，均值的 95% 置信区间误差范围是 $${E}$。在相同的置信水平下，要使误差范围为 $${E / k}$，样本量应为多少？`,
      ),
      answer,
      form: "integer",
      wrong: [n * k, n + k * k, Math.round(n * Math.sqrt(k))],
      solution: t(
        `The margin is to shrink by a factor of $${k}$, and it varies as $\\frac{1}{\\sqrt{n}}$, so $n$ grows by a factor of $${k}^2 = ${k * k}$. That gives $${n} \\cdot ${k * k} = ${answer}$.`,
        `误差范围要缩小到 $\\frac{1}{${k}}$，而它与 $\\frac{1}{\\sqrt{n}}$ 成正比，所以 $n$ 要乘以 $${k}^2 = ${k * k}$，得 $${n} \\cdot ${k * k} = ${answer}$。`,
      ),
    });
  },
};

const anovaDegreesOfFreedom: KnowledgePointDef = {
  id: "the-degrees-of-freedom-of-an-anova-f-statistic",
  title: t("The degrees of freedom of an ANOVA $F$ statistic", "方差分析 $F$ 统计量的自由度"),
  explanation: t(
    "With $k$ groups and $N$ observations in all, the numerator of $F$ has $k - 1$ degrees of freedom because the group means are compared to one overall mean. The denominator has $N - k$, because each group loses one degree of freedom to its own mean.",
    "有 $k$ 组、共 $N$ 个观测时，$F$ 的分子有 $k - 1$ 个自由度，因为各组均值要与一个总均值比较；分母有 $N - k$ 个自由度，因为每组都因自身的均值失去一个自由度。",
  ),
  generate(rng) {
    const k = rng.int(3, 5);
    const sizes = Array.from({ length: k }, () => rng.int(4, 12));
    const total = sizes.reduce((s, x) => s + x, 0);
    const answer = total - k;
    return numberProblem({
      prompt: t(
        `A one-factor analysis of variance compares ${k} groups of sizes ${sizes.join(", ")}. How many degrees of freedom does the denominator of the $F$ statistic have?`,
        `单因素方差分析比较 ${k} 组，每组的大小是 ${sizes.join(", ")}。$F$ 统计量的分母有多少个自由度？`,
      ),
      answer,
      form: "integer",
      wrong: [total - 1, k - 1, total],
      solution: t(
        `There are $${total}$ observations in all, and each of the ${k} groups loses one degree of freedom to its own mean: $${total} - ${k} = ${answer}$.`,
        `一共有 $${total}$ 个观测，${k} 组各因自身的均值失去一个自由度：$${total} - ${k} = ${answer}$。`,
      ),
    });
  },
};

const slopeFromCorrelation: KnowledgePointDef = {
  id: "the-regression-slope-from-the-correlation",
  title: t("The regression slope from the correlation", "由相关系数求回归斜率"),
  explanation: t(
    "The slope of the regression line of $y$ on $x$ is $b = r\\frac{s_y}{s_x}$. It has the sign of the correlation, and the ratio converts one standard deviation of $x$ into units of $y$. Regressing $x$ on $y$ uses the inverse ratio and gives a different line.",
    "$y$ 对 $x$ 的回归直线斜率是 $b = r\\frac{s_y}{s_x}$。它与相关系数同号，比值把 $x$ 的一个标准差换算成 $y$ 的单位。$x$ 对 $y$ 的回归用的是相反的比值，得到另一条直线。",
  ),
  generate(rng) {
    const r = nonzero(rng, 9);
    const sx = rng.int(2, 9);
    let sy = rng.int(2, 9);
    if (sy === sx) sy += 1;
    const answer = Q.of(r * sy, 10 * sx);
    const rText = r < 0 ? `-${tenths(-r)}` : tenths(r);
    return numberProblem({
      prompt: t(
        `For a data set, the correlation is $r = ${rText}$, the standard deviation of $x$ is $${sx}$, and the standard deviation of $y$ is $${sy}$. Find the slope of the regression line of $y$ on $x$.`,
        `某数据集的相关系数 $r = ${rText}$，$x$ 的标准差是 $${sx}$，$y$ 的标准差是 $${sy}$。求 $y$ 对 $x$ 的回归直线的斜率。`,
      ),
      answer,
      wrong: [Q.of(r * sx, 10 * sy), Q.of(r, 10), Q.of(sy, sx)],
      solution: t(
        `$b = r\\frac{s_y}{s_x} = ${rText} \\cdot \\frac{${sy}}{${sx}} = ${answer.toLatex()}$.`,
        `$b = r\\frac{s_y}{s_x} = ${rText} \\cdot \\frac{${sy}}{${sx}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const residualSumFromCorrelation: KnowledgePointDef = {
  id: "the-sum-of-squared-residuals-from-the-correlation",
  title: t("The sum of squared residuals from the correlation", "由相关系数求残差平方和"),
  explanation: t(
    "The share of the total variation in $y$ that a regression line explains is $r^2$. The rest is left in the residuals, so $\\sum(y_i - \\hat{y}_i)^2 = (1 - r^2)\\sum(y_i - \\bar{y})^2$. The sign of $r$ makes no difference to the size of the residuals.",
    "回归直线解释了 $y$ 总变异中 $r^2$ 的比例，其余部分留在残差中，所以 $\\sum(y_i - \\hat{y}_i)^2 = (1 - r^2)\\sum(y_i - \\bar{y})^2$。$r$ 的符号不影响残差的大小。",
  ),
  generate(rng) {
    const r = nonzero(rng, 9);
    const total = 10 * rng.int(1, 30);
    const answer = Q.of(total * (100 - r * r), 100);
    const rText = r < 0 ? `-${tenths(-r)}` : tenths(r);
    return numberProblem({
      prompt: t(
        `A regression has correlation $r = ${rText}$ and $\\sum(y_i - \\bar{y})^2 = ${total}$. Find the sum of the squared residuals.`,
        `某回归的相关系数 $r = ${rText}$，$\\sum(y_i - \\bar{y})^2 = ${total}$。求残差平方和。`,
      ),
      answer,
      wrong: [Q.of(total * r * r, 100), Q.of(total * (10 - Math.abs(r)), 10), Q.of(total * Math.abs(r), 10)],
      solution: t(
        `Here $r^2 = ${Q.of(r * r, 100).toLatex()}$ of the variation is explained. The rest is $${Q.of(100 - r * r, 100).toLatex()} \\cdot ${total} = ${answer.toLatex()}$.`,
        `这里 $r^2 = ${Q.of(r * r, 100).toLatex()}$ 的变异被解释了。其余部分是 $${Q.of(100 - r * r, 100).toLatex()} \\cdot ${total} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const chiSquareDegrees: KnowledgePointDef = {
  id: "the-degrees-of-freedom-of-a-test-of-independence",
  title: t("The degrees of freedom of a test of independence", "独立性检验的自由度"),
  explanation: t(
    "In a table with $r$ rows and $c$ columns, the totals of the rows and columns are fixed. Once $(r - 1)(c - 1)$ cells are filled in, those totals determine all the others, so a chi-square test of independence has this many degrees of freedom.",
    "在 $r$ 行 $c$ 列的表中，各行各列的合计是固定的。填好 $(r - 1)(c - 1)$ 个格子后，其余格子都由合计决定，所以独立性的卡方检验有这么多自由度。",
  ),
  generate(rng) {
    const rows = rng.int(2, 8);
    const columns = rng.int(2, 8);
    const answer = (rows - 1) * (columns - 1);
    return numberProblem({
      prompt: t(
        `A chi-square test of independence uses a table with ${rows} rows and ${columns} columns. How many degrees of freedom does the statistic have?`,
        `独立性的卡方检验使用一张 ${rows} 行 ${columns} 列的表。统计量有多少个自由度？`,
      ),
      answer,
      form: "integer",
      wrong: [rows * columns - 1, rows + columns - 2, rows * columns],
      solution: t(
        `The row and column totals fix all but $(${rows} - 1)(${columns} - 1) = ${answer}$ of the cells.`,
        `行和列的合计决定了其余的格子，只有 $(${rows} - 1)(${columns} - 1) = ${answer}$ 个格子可以自由填写。`,
      ),
    });
  },
};

/** deeperProbabilityStatisticsPoints gives, by topic id, the knowledge points added after a Probability & Statistics topic's own. */
export const deeperProbabilityStatisticsPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "extending-bayes-theorem": [bayesTwice],
  "combinations-with-repetition": [starsWithLowerBounds],
  "permutations-with-repetition": [repeatsKeptTogether],
  "expected-values-of-continuous-random-variables": [expectationFromTail],
  "calculating-variance-and-standard-deviation-using-moment-generating-functions": [varianceFromExponentialMgf],
  "calculating-moments-using-moment-generating-functions": [momentFromSeries],
  "the-cdf-of-the-binomial-distribution": [binomialMode],
  "mean-and-variance-of-the-poisson-distribution": [poissonRatio],
  "mean-and-variance-of-the-geometric-distribution": [geometricMemoryless],
  "mean-and-variance-of-the-continuous-uniform-distribution": [uniformEndpoints],
  "modeling-with-the-exponential-distribution": [minimumOfExponentials],
  "independence-of-discrete-random-variables": [probabilityFromIndependentUnion],
  "the-covariance-of-two-random-variables": [covarianceOfCombinations],
  "the-correlation-coefficient-for-two-random-variables": [largestVarianceOfASum],
  "conditional-variance-for-discrete-random-variables": [lawOfTotalVariance],
  "maximum-likelihood-estimation": [mleOfNormalVariance],
  "confidence-intervals-for-one-mean-known-population-variance": [marginAndSampleSize],
  "one-factor-analysis-of-variance": [anovaDegreesOfFreedom],
  "linear-regression": [slopeFromCorrelation],
  "residuals-and-residual-plots": [residualSumFromCorrelation],
  "chi-square-tests-of-independence-and-homogeneity": [chiSquareDegrees],
};
