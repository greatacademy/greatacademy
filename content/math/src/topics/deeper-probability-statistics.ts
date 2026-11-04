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

// ---------------------------------------------------------------------------
// Second pass
// ---------------------------------------------------------------------------

/** coefficientOf writes a positive number before a symbol, leaving out 1. */
const coefficientOf = (n: number) => (n === 1 ? "" : `${n}`);
/** gcdOf finds the greatest common divisor of two positive integers. */
const gcdOf = (a: number, b: number): number => (b === 0 ? a : gcdOf(b, a % b));
/** sampleOf draws a list of whole numbers from lo to hi. */
const sampleOf = (rng: Rng, size: number, lo: number, hi: number) => [...Array(size).keys()].map(() => rng.int(lo, hi));

const priorFromTotal: KnowledgePointDef = {
  id: "the-prior-from-a-total-probability",
  title: t("The prior from a total probability", "由全概率求先验概率"),
  explanation: t(
    "The law of total probability says $P(B) = pr + (1 - p)q$, where $p = P(A)$, $r = P(B \\mid A)$ and $q = P(B \\mid A')$. This is linear in $p$, so it can also be run backwards. If the overall rate of $B$ is known, the formula gives the size of the hidden group, $p = \\frac{P(B) - q}{r - q}$.",
    "全概率公式说 $P(B) = pr + (1 - p)q$，其中 $p = P(A)$，$r = P(B \\mid A)$，$q = P(B \\mid A')$。它关于 $p$ 是线性的，所以也可以反过来用。如果知道 $B$ 的总体比率，公式就给出隐藏群体的大小：$p = \\frac{P(B) - q}{r - q}$。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const r = rng.int(1, 9);
    const q = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== r));
    const total = Q.of(a * r + (10 - a) * q, 100);
    const answer = Q.of(a, 10);
    const rate = Q.of(r, 10);
    const other = Q.of(q, 10);
    return numberProblem({
      prompt: t(
        `Given $P(B \\mid A) = ${rate.toLatex()}$, $P(B \\mid A') = ${other.toLatex()}$ and $P(B) = ${total.toLatex()}$, find $P(A)$.`,
        `已知 $P(B \\mid A) = ${rate.toLatex()}$，$P(B \\mid A') = ${other.toLatex()}$，$P(B) = ${total.toLatex()}$。求 $P(A)$。`,
      ),
      answer,
      wrong: [Q.of(10 - a, 10), total, total.div(rate)],
      solution: t(
        `Solving $p \\cdot ${rate.toLatex()} + (1 - p) \\cdot ${other.toLatex()} = ${total.toLatex()}$ gives $p = \\frac{${total.toLatex()} - ${other.toLatex()}}{${rate.toLatex()} - ${other.toLatex()}} = ${answer.toLatex()}$.`,
        `解 $p \\cdot ${rate.toLatex()} + (1 - p) \\cdot ${other.toLatex()} = ${total.toLatex()}$，得 $p = \\frac{${total.toLatex()} - ${other.toLatex()}}{${rate.toLatex()} - ${other.toLatex()}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const evenOddsPrior: KnowledgePointDef = {
  id: "the-prior-that-gives-even-posterior-odds",
  title: t("The prior that gives even posterior odds", "使后验概率为一半的先验"),
  explanation: t(
    "Bayes' theorem says the posterior is the true-positive weight divided by all the positive weight. The posterior is one half exactly when true positives and false positives are equally common, that is when $pr = (1 - p)q$. Solving gives $p = \\frac{q}{r + q}$. A rarer condition than this means a positive result is more likely a false alarm.",
    "贝叶斯定理说，后验概率是真阳性的权重除以全部阳性的权重。当真阳性和假阳性同样常见，即 $pr = (1 - p)q$ 时，后验概率恰好是一半。解得 $p = \\frac{q}{r + q}$。如果情况比这更罕见，阳性结果就更可能是误报。",
  ),
  generate(rng) {
    const q = rng.int(1, 8);
    const r = rng.int(q + 1, 9);
    const answer = Q.of(q, r + q);
    const hit = Q.of(r, 10);
    const miss = Q.of(q, 10);
    return numberProblem({
      prompt: t(
        `A test has $P(+ \\mid D) = ${hit.toLatex()}$ and $P(+ \\mid D') = ${miss.toLatex()}$. For which prior $P(D)$ does a positive result give $P(D \\mid +) = \\frac{1}{2}$?`,
        `一项检测的 $P(+ \\mid D) = ${hit.toLatex()}$，$P(+ \\mid D') = ${miss.toLatex()}$。先验概率 $P(D)$ 为多少时，阳性结果给出 $P(D \\mid +) = \\frac{1}{2}$？`,
      ),
      answer,
      wrong: [Q.of(r, r + q), Q.of(q, r), Q.of(1, 2)],
      solution: t(
        `Setting $p \\cdot ${hit.toLatex()} = (1 - p) \\cdot ${miss.toLatex()}$ gives $p = \\frac{${q}}{${r} + ${q}} = ${answer.toLatex()}$.`,
        `令 $p \\cdot ${hit.toLatex()} = (1 - p) \\cdot ${miss.toLatex()}$，得 $p = \\frac{${q}}{${r} + ${q}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const atLeastOneSymbol: KnowledgePointDef = {
  id: "sequences-containing-a-given-symbol",
  title: t("Sequences containing a given symbol", "含有给定符号的序列"),
  explanation: t(
    "Counting the sequences that contain a symbol at least once directly would split into many cases, by how many times it appears and where. The complement is far simpler: count all the sequences, then remove those that avoid the symbol. With $n$ symbols and length $k$, that leaves $n^k - (n - 1)^k$ sequences.",
    "直接计算至少含一次某符号的序列，要按出现次数和位置分很多种情况。补集要简单得多：先数所有序列，再去掉不含这个符号的序列。有 $n$ 个符号、长度为 $k$ 时，剩下 $n^k - (n - 1)^k$ 个序列。",
  ),
  generate(rng) {
    const n = rng.int(3, 12);
    const k = rng.int(2, 5);
    const answer = n ** k - (n - 1) ** k;
    return numberProblem({
      prompt: t(
        `Sequences of length ${k} are formed from ${n} different symbols, with repetition allowed. How many of them contain the symbol A, which is one of the ${n}, at least once?`,
        `用 ${n} 个不同的符号组成长度为 ${k} 的序列，允许重复。其中至少含一次符号 A（它是这 ${n} 个符号之一）的序列有多少个？`,
      ),
      answer,
      form: "integer",
      wrong: [n ** k, k * n ** (k - 1), (n - 1) ** k],
      solution: t(
        `There are $${n}^${k}$ sequences, and $${n - 1}^${k}$ of them avoid A. The difference is $${answer}$.`,
        `一共有 $${n}^${k}$ 个序列，其中 $${n - 1}^${k}$ 个不含 A。差是 $${answer}$。`,
      ),
    });
  },
};

const standardizing: KnowledgePointDef = {
  id: "the-constants-that-standardize-a-variable",
  title: t("The constants that standardize a variable", "使变量标准化的常数"),
  explanation: t(
    "Since $\\text{Var}(aX + b) = a^2\\text{Var}(X)$, the shift $b$ has no effect on spread, and the scale $a$ must be one over the standard deviation to give a variance of 1. Then $E(aX + b) = a\\mu + b$ must be 0, so $b = -\\frac{\\mu}{\\sigma}$. The order matters: fix the scale first and the shift afterwards.",
    "由于 $\\text{Var}(aX + b) = a^2\\text{Var}(X)$，平移 $b$ 不影响离散程度，要使方差为 1，比例 $a$ 必须是标准差的倒数。这时 $E(aX + b) = a\\mu + b$ 必须为 0，所以 $b = -\\frac{\\mu}{\\sigma}$。顺序很重要：先定比例，再定平移。",
  ),
  generate(rng) {
    const mu = nonzero(rng, 20);
    const sigma = rng.int(2, 9);
    const answer = Q.of(-mu, sigma);
    return numberProblem({
      prompt: t(
        `$X$ has mean $${mu}$ and variance $${sigma * sigma}$. The variable $Z = aX + b$, with $a > 0$, has mean 0 and variance 1. Find $b$.`,
        `$X$ 的均值是 $${mu}$，方差是 $${sigma * sigma}$。变量 $Z = aX + b$（$a > 0$）的均值是 0，方差是 1。求 $b$。`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(-mu), Q.of(-mu, sigma * sigma)],
      solution: t(
        `A variance of 1 needs $a = \\frac{1}{${sigma}}$. A mean of 0 then needs $b = -\\frac{${inParens(mu)}}{${sigma}} = ${answer.toLatex()}$.`,
        `方差为 1 要求 $a = \\frac{1}{${sigma}}$。均值为 0 则要求 $b = -\\frac{${inParens(mu)}}{${sigma}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const secondMomentFromMgf: KnowledgePointDef = {
  id: "the-second-moment-from-a-moment-generating-function",
  title: t("The second moment from a moment generating function", "由矩母函数求二阶矩"),
  explanation: t(
    "The derivatives of a moment generating function at zero are the moments: $M'(0) = E(X)$ and $M''(0) = E(X^2)$. For a power such as $(1 - at)^{-k}$, differentiating twice brings down the factors $ka$ and then $(k + 1)a$. There is no need to know which distribution this is, or to integrate its density.",
    "矩母函数在零处的各阶导数就是各阶矩：$M'(0) = E(X)$，$M''(0) = E(X^2)$。对 $(1 - at)^{-k}$ 这样的幂函数，求两次导，依次带出因子 $ka$ 和 $(k + 1)a$。不需要知道这是什么分布，也不需要对它的密度积分。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const k = rng.int(2, 6);
    const answer = k * (k + 1) * a * a;
    return numberProblem({
      prompt: t(
        `A random variable has moment generating function $M(t) = (1 - ${coefficientOf(a)}t)^{-${k}}$. Find $E(X^2)$.`,
        `随机变量的矩母函数是 $M(t) = (1 - ${coefficientOf(a)}t)^{-${k}}$。求 $E(X^2)$。`,
      ),
      answer,
      form: "integer",
      wrong: [(k * a) ** 2, k * a, k * (k - 1) * a * a],
      solution: t(
        `Differentiating twice gives $M''(t) = ${k} \\cdot ${k + 1} \\cdot ${a}^2(1 - ${coefficientOf(a)}t)^{-${k + 2}}$. At $t = 0$ this is $${answer}$.`,
        `求两次导得 $M''(t) = ${k} \\cdot ${k + 1} \\cdot ${a}^2(1 - ${coefficientOf(a)}t)^{-${k + 2}}$。在 $t = 0$ 处它是 $${answer}$。`,
      ),
    });
  },
};

const sizeFromVariance: KnowledgePointDef = {
  id: "the-number-of-values-from-a-uniform-variance",
  title: t("The number of values from a uniform variance", "由均匀分布的方差求取值个数"),
  explanation: t(
    "The variance of a discrete uniform variable on $n$ consecutive integers is $\\frac{n^2 - 1}{12}$, and it depends on $n$ alone, not on where the values begin. So the variance can be inverted: multiply by 12, add 1, and take a square root. The mean plays no part, which also means it cannot be recovered this way.",
    "$n$ 个连续整数上的离散均匀变量，方差是 $\\frac{n^2 - 1}{12}$，只取决于 $n$，与取值从哪里开始无关。所以可以反解方差：乘以 12，加 1，再开平方。均值不起作用，这也意味着用这种方法求不出均值。",
  ),
  generate(rng) {
    const n = rng.int(2, 60);
    const start = rng.int(-9, 9);
    const variance = Q.of(n * n - 1, 12);
    return numberProblem({
      prompt: t(
        `$X$ is uniform on the $n$ consecutive integers starting at $${start}$, and $\\text{Var}(X) = ${variance.toLatex()}$. Find $n$.`,
        `$X$ 在从 $${start}$ 开始的 $n$ 个连续整数上均匀分布，且 $\\text{Var}(X) = ${variance.toLatex()}$。求 $n$。`,
      ),
      answer: n,
      form: "integer",
      wrong: [n + 1, n - 1, 2 * n],
      solution: t(
        `From $\\frac{n^2 - 1}{12} = ${variance.toLatex()}$ we get $n^2 = ${n * n}$, so $n = ${n}$.`,
        `由 $\\frac{n^2 - 1}{12} = ${variance.toLatex()}$ 得 $n^2 = ${n * n}$，所以 $n = ${n}$。`,
      ),
    });
  },
};

const lambdaFromRatio: KnowledgePointDef = {
  id: "the-poisson-mean-from-consecutive-probabilities",
  title: t("The Poisson mean from consecutive probabilities", "由相邻概率求泊松均值"),
  explanation: t(
    "Consecutive Poisson probabilities have the simple ratio $\\frac{P(X = k + 1)}{P(X = k)} = \\frac{\\lambda}{k + 1}$, because the exponential factors cancel and the factorials differ by a single factor. So any one such ratio determines $\\lambda$. The same ratio shows that the probabilities rise while $k + 1$ is below $\\lambda$ and fall after that.",
    "相邻泊松概率的比很简单：$\\frac{P(X = k + 1)}{P(X = k)} = \\frac{\\lambda}{k + 1}$，因为指数因子相消，阶乘只差一个因子。所以任何一个这样的比都能确定 $\\lambda$。同样的比还说明，$k + 1$ 小于 $\\lambda$ 时概率上升，之后下降。",
  ),
  generate(rng) {
    const lambda = rng.int(1, 12);
    const k = rng.int(1, 6);
    const ratio = Q.of(lambda, k + 1);
    return numberProblem({
      prompt: t(
        `$X$ is Poisson with mean $\\lambda$, and $\\frac{P(X = ${k + 1})}{P(X = ${k})} = ${ratio.toLatex()}$. Find $\\lambda$.`,
        `$X$ 服从均值为 $\\lambda$ 的泊松分布，且 $\\frac{P(X = ${k + 1})}{P(X = ${k})} = ${ratio.toLatex()}$。求 $\\lambda$。`,
      ),
      answer: lambda,
      form: "integer",
      wrong: [lambda + 1, lambda * (k + 1), lambda + k + 1],
      solution: t(
        `The ratio equals $\\frac{\\lambda}{${k + 1}}$, so $\\lambda = ${k + 1} \\cdot ${ratio.toLatex()} = ${lambda}$.`,
        `这个比等于 $\\frac{\\lambda}{${k + 1}}$，所以 $\\lambda = ${k + 1} \\cdot ${ratio.toLatex()} = ${lambda}$。`,
      ),
    });
  },
};

const chiSquareSum: KnowledgePointDef = {
  id: "the-variance-of-a-sum-of-chi-square-variables",
  title: t("The variance of a sum of chi-square variables", "卡方变量之和的方差"),
  explanation: t(
    "A chi-square variable with $\\nu$ degrees of freedom is a sum of $\\nu$ independent squared standard normals, so independent chi-square variables add to another one, with their degrees of freedom added. Its variance is twice the degrees of freedom. This also agrees with adding the two separate variances, as independence allows.",
    "自由度为 $\\nu$ 的卡方变量，是 $\\nu$ 个独立标准正态变量的平方和，所以独立的卡方变量相加还是卡方变量，自由度相加。它的方差是自由度的两倍。这也与独立时把两个方差直接相加的结果一致。",
  ),
  generate(rng) {
    const a = rng.int(1, 30);
    const b = rng.int(1, 30);
    const answer = 2 * (a + b);
    return numberProblem({
      prompt: t(
        `Independent $X$ and $Y$ follow chi-square distributions with ${a} and ${b} degrees of freedom. Find $\\text{Var}(X + Y)$.`,
        `独立的 $X$、$Y$ 分别服从自由度为 ${a} 和 ${b} 的卡方分布。求 $\\text{Var}(X + Y)$。`,
      ),
      answer,
      form: "integer",
      wrong: [a + b, 4 * (a + b), 2 * a * b],
      solution: t(
        `The sum is chi-square with ${a + b} degrees of freedom, and the variance is twice that, which is $${answer}$.`,
        `和服从自由度为 ${a + b} 的卡方分布，方差是它的两倍，即 $${answer}$。`,
      ),
    });
  },
};

const gammaRatio: KnowledgePointDef = {
  id: "a-ratio-of-gamma-values-two-apart",
  title: t("A ratio of gamma values two apart", "相差二的伽马函数值之比"),
  explanation: t(
    "The recurrence $\\Gamma(x + 1) = x\\Gamma(x)$ holds for every positive real $x$, not only for whole numbers. Applying it twice gives $\\Gamma(x + 2) = (x + 1)x\\Gamma(x)$. So a ratio of gamma values whose arguments differ by a whole number is a plain product, even when no individual value can be written in closed form.",
    "递推式 $\\Gamma(x + 1) = x\\Gamma(x)$ 对每个正实数 $x$ 都成立，不只是整数。用两次得到 $\\Gamma(x + 2) = (x + 1)x\\Gamma(x)$。所以自变量相差整数的伽马函数值之比就是一个普通的乘积，即使单个值无法写成闭形式。",
  ),
  generate(rng) {
    const q = rng.int(3, 8);
    const p = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((v) => gcdOf(v, q) === 1));
    const x = Q.of(p, q);
    const next = x.add(Q.of(1));
    const answer = x.mul(next);
    return numberProblem({
      prompt: t(
        `Find $\\frac{\\Gamma\\left(${x.toLatex()} + 2\\right)}{\\Gamma\\left(${x.toLatex()}\\right)}$.`,
        `求 $\\frac{\\Gamma\\left(${x.toLatex()} + 2\\right)}{\\Gamma\\left(${x.toLatex()}\\right)}$。`,
      ),
      answer,
      wrong: [next, x, x.mul(x.add(Q.of(2)))],
      solution: t(
        `The recurrence used twice gives the product $${next.toLatex()} \\cdot ${x.toLatex()} = ${answer.toLatex()}$.`,
        `用两次递推式，得乘积 $${next.toLatex()} \\cdot ${x.toLatex()} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const gammaMode: KnowledgePointDef = {
  id: "the-mode-of-a-gamma-distribution",
  title: t("The mode of a gamma distribution", "伽马分布的众数"),
  explanation: t(
    "A gamma density is proportional to $x^{\\alpha - 1}e^{-\\beta x}$. To find its peak, it is easier to differentiate its logarithm, $(\\alpha - 1)\\ln x - \\beta x$, and this gives $x = \\frac{\\alpha - 1}{\\beta}$ when $\\alpha > 1$. The mode lies below the mean $\\frac{\\alpha}{\\beta}$, because the long right tail pulls the mean upward.",
    "伽马密度正比于 $x^{\\alpha - 1}e^{-\\beta x}$。求峰值时，对它的对数 $(\\alpha - 1)\\ln x - \\beta x$ 求导更容易，当 $\\alpha > 1$ 时得 $x = \\frac{\\alpha - 1}{\\beta}$。众数低于均值 $\\frac{\\alpha}{\\beta}$，因为右侧的长尾把均值向上拉。",
  ),
  generate(rng) {
    const alpha = rng.int(2, 9);
    const beta = rng.int(1, 9);
    const answer = Q.of(alpha - 1, beta);
    const factor = alpha === 2 ? "x" : `x^{${alpha - 1}}`;
    return numberProblem({
      prompt: t(
        `A density on the positive reals is proportional to $${factor}e^{-${coefficientOf(beta)}x}$. Find its mode.`,
        `正实数上的一个密度正比于 $${factor}e^{-${coefficientOf(beta)}x}$。求它的众数。`,
      ),
      answer,
      wrong: [Q.of(alpha, beta), Q.of(alpha - 1, beta * beta), Q.of(beta, alpha - 1)],
      solution: t(
        `The derivative of the logarithm is $\\frac{${alpha - 1}}{x} - ${beta}$. It is zero at $x = ${answer.toLatex()}$.`,
        `对数的导数是 $\\frac{${alpha - 1}}{x} - ${beta}$。它在 $x = ${answer.toLatex()}$ 处为零。`,
      ),
    });
  },
};

const tDegreesForVariance: KnowledgePointDef = {
  id: "the-degrees-of-freedom-for-a-target-t-variance",
  title: t("The degrees of freedom for a target $t$ variance", "达到目标方差所需的 $t$ 分布自由度"),
  explanation: t(
    "A $t$ distribution with $\\nu > 2$ degrees of freedom has variance $\\frac{\\nu}{\\nu - 2} = 1 + \\frac{2}{\\nu - 2}$, which falls toward 1 as $\\nu$ grows. This is why the distribution approaches the standard normal. Writing the variance in this second form makes it simple to solve an inequality for the degrees of freedom needed.",
    "自由度 $\\nu > 2$ 的 $t$ 分布，方差是 $\\frac{\\nu}{\\nu - 2} = 1 + \\frac{2}{\\nu - 2}$，随 $\\nu$ 增大而降向 1。这就是它趋于标准正态分布的原因。把方差写成第二种形式，就很容易解出所需自由度的不等式。",
  ),
  generate(rng) {
    const m = rng.int(2, 40);
    const bound = Q.of(m + 1, m);
    const answer = 2 * m + 2;
    return numberProblem({
      prompt: t(
        `What is the smallest number of degrees of freedom for which a $t$ distribution has variance at most $${bound.toLatex()}$?`,
        `$t$ 分布的方差不超过 $${bound.toLatex()}$ 时，最小的自由度是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [2 * m, 2 * m + 3, m + 2],
      solution: t(
        `The variance is $1 + \\frac{2}{\\nu - 2}$. We need $\\frac{2}{\\nu - 2} \\le \\frac{1}{${m}}$, so $\\nu - 2 \\ge ${2 * m}$ and $\\nu = ${answer}$.`,
        `方差是 $1 + \\frac{2}{\\nu - 2}$。需要 $\\frac{2}{\\nu - 2} \\le \\frac{1}{${m}}$，所以 $\\nu - 2 \\ge ${2 * m}$，$\\nu = ${answer}$。`,
      ),
    });
  },
};

/** upperFPercentiles lists numerator and denominator degrees of freedom with the 95th percentile of $F$, in hundredths. */
const upperFPercentiles: [number, number, number][] = [
  [5, 10, 333],
  [10, 5, 474],
  [4, 6, 453],
  [6, 4, 616],
  [3, 8, 407],
  [8, 3, 885],
  [2, 5, 579],
  [5, 2, 1930],
  [3, 5, 541],
  [5, 3, 901],
  [4, 8, 384],
  [8, 4, 604],
  [6, 10, 322],
  [10, 6, 406],
  [2, 10, 410],
  [10, 2, 1940],
  [4, 10, 348],
  [10, 4, 596],
  [5, 8, 369],
  [8, 5, 482],
  [3, 10, 371],
  [10, 3, 879],
  [6, 8, 358],
  [8, 6, 415],
  [2, 6, 514],
  [6, 2, 1933],
  [3, 6, 476],
  [6, 3, 894],
  [4, 5, 519],
  [5, 4, 626],
];

const lowerFQuantile: KnowledgePointDef = {
  id: "a-lower-f-quantile-from-an-upper-one",
  title: t("A lower $F$ quantile from an upper one", "由上侧 $F$ 分位数求下侧分位数"),
  explanation: t(
    "If $X$ follows $F(a, b)$, then $\\frac{1}{X}$ follows $F(b, a)$, because the ratio that defines $F$ is simply turned upside down. An event $X < c$ is the same as $\\frac{1}{X} > \\frac{1}{c}$. So tables that list only upper quantiles still give lower ones: swap the degrees of freedom and take the reciprocal.",
    "如果 $X$ 服从 $F(a, b)$，那么 $\\frac{1}{X}$ 服从 $F(b, a)$，因为定义 $F$ 的那个比只是上下颠倒了。事件 $X < c$ 等同于 $\\frac{1}{X} > \\frac{1}{c}$。所以只列上侧分位数的表也能给出下侧分位数：交换自由度，再取倒数。",
  ),
  generate(rng) {
    const [b, a, hundredths] = rng.pick(upperFPercentiles);
    const c = Q.of(hundredths, 100);
    const shown = (hundredths / 100).toFixed(2);
    const answer = Q.of(100, hundredths);
    return numberProblem({
      prompt: t(
        `The 95th percentile of the $F(${b}, ${a})$ distribution is $${shown}$. Using this value, find the 5th percentile of the $F(${a}, ${b})$ distribution as an exact fraction.`,
        `$F(${b}, ${a})$ 分布的第 95 百分位数是 $${shown}$。用这个值，以精确分数的形式求 $F(${a}, ${b})$ 分布的第 5 百分位数。`,
      ),
      answer,
      wrong: [c, Q.of(1).sub(answer), Q.of(100, hundredths + 100)],
      solution: t(
        `Reciprocals of $F(${a}, ${b})$ follow $F(${b}, ${a})$, and the lower 5% tail corresponds to the upper 5% tail. So the value is $\\frac{1}{${shown}} = ${answer.toLatex()}$.`,
        `$F(${a}, ${b})$ 的倒数服从 $F(${b}, ${a})$，下侧 5% 对应上侧 5%。所以值是 $\\frac{1}{${shown}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const trinomialConditional: KnowledgePointDef = {
  id: "a-conditional-mean-in-a-trinomial-model",
  title: t("A conditional mean in a trinomial model", "三项分布中的条件均值"),
  explanation: t(
    "Knowing the count of the third outcome leaves the other trials to be split between the first two outcomes. Within those trials, the probabilities must be renormalized: outcome one has chance $\\frac{p_1}{p_1 + p_2}$. So the conditional distribution of $X$ is binomial, and its mean is the number of remaining trials times that new probability.",
    "知道第三种结果的次数后，其余的试验要在前两种结果之间分配。在这些试验中，概率必须重新归一化：结果一的概率是 $\\frac{p_1}{p_1 + p_2}$。所以 $X$ 的条件分布是二项分布，均值是剩余试验次数乘以这个新概率。",
  ),
  generate(rng) {
    const n = rng.int(10, 30);
    const z = rng.int(1, 9);
    const [p1, p2, p3] = rng.pick([
      [1, 2, 7],
      [2, 3, 5],
      [1, 4, 5],
      [3, 4, 3],
      [2, 5, 3],
      [5, 3, 2],
      [4, 1, 5],
      [6, 3, 1],
    ]) as [number, number, number];
    const answer = Q.of((n - z) * p1, p1 + p2);
    return numberProblem({
      prompt: t(
        `Each of ${n} independent trials gives outcome 1, 2 or 3 with probabilities $${tenths(p1)}$, $${tenths(p2)}$ and $${tenths(p3)}$. Let $X$ and $Z$ count outcomes 1 and 3. Find $E(X \\mid Z = ${z})$.`,
        `${n} 次独立试验，每次得到结果 1、2、3 的概率分别是 $${tenths(p1)}$、$${tenths(p2)}$、$${tenths(p3)}$。设 $X$、$Z$ 分别是结果 1 和结果 3 的次数。求 $E(X \\mid Z = ${z})$。`,
      ),
      answer,
      wrong: [Q.of(n * p1, 10), Q.of((n - z) * p1, 10), Q.of(n * p1, p1 + p2)],
      solution: t(
        `The other ${n - z} trials give outcome 1 with probability $\\frac{${tenths(p1)}}{${tenths(p1)} + ${tenths(p2)}} = ${Q.of(p1, p1 + p2).toLatex()}$. The mean is $${answer.toLatex()}$.`,
        `其余 ${n - z} 次试验得到结果 1 的概率是 $\\frac{${tenths(p1)}}{${tenths(p1)} + ${tenths(p2)}} = ${Q.of(p1, p1 + p2).toLatex()}$。均值是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const mergedMultinomial: KnowledgePointDef = {
  id: "the-variance-of-two-merged-multinomial-counts",
  title: t("The variance of two merged multinomial counts", "合并两个多项计数的方差"),
  explanation: t(
    "Merging two categories of a multinomial model gives a single category whose probability is the sum of the two. Its count is then binomial, with variance $n(p_i + p_j)(1 - p_i - p_j)$. Adding the two separate variances would be wrong, because multinomial counts compete for the same trials and so have a negative covariance.",
    "合并多项模型的两个类别，就得到一个类别，它的概率是两者之和。它的计数服从二项分布，方差是 $n(p_i + p_j)(1 - p_i - p_j)$。直接把两个方差相加是错的，因为多项计数在争夺同样的试验，所以协方差为负。",
  ),
  generate(rng) {
    const n = rng.int(10, 60);
    const [p1, p2, p3, p4] = rng.pick([
      [1, 2, 3, 4],
      [2, 3, 1, 4],
      [1, 3, 2, 4],
      [4, 1, 3, 2],
      [3, 2, 1, 4],
    ]) as [number, number, number, number];
    const s = p1 + p2;
    const answer = Q.of(n * s * (10 - s), 100);
    const separate = Q.of(n * (p1 * (10 - p1) + p2 * (10 - p2)), 100);
    return numberProblem({
      prompt: t(
        `Each of ${n} independent trials falls in one of four categories with probabilities $${tenths(p1)}$, $${tenths(p2)}$, $${tenths(p3)}$ and $${tenths(p4)}$. Let $X_1$ and $X_2$ count the first two categories. Find $\\text{Var}(X_1 + X_2)$.`,
        `${n} 次独立试验，每次落入四个类别之一，概率分别是 $${tenths(p1)}$、$${tenths(p2)}$、$${tenths(p3)}$、$${tenths(p4)}$。设 $X_1$、$X_2$ 是前两个类别的次数。求 $\\text{Var}(X_1 + X_2)$。`,
      ),
      answer,
      wrong: [separate, Q.of(n * s, 10), Q.of(n * s * s, 100), Q.of(n * p1 * (10 - p1), 100)],
      solution: t(
        `The merged count is binomial with $p = ${tenths(s)}$. Its variance is $${n} \\cdot ${tenths(s)} \\cdot ${tenths(10 - s)} = ${answer.toLatex()}$.`,
        `合并后的计数服从 $p = ${tenths(s)}$ 的二项分布。方差是 $${n} \\cdot ${tenths(s)} \\cdot ${tenths(10 - s)} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const marginalFromCdf: KnowledgePointDef = {
  id: "a-marginal-cdf-from-a-joint-cdf",
  title: t("A marginal CDF from a joint CDF", "由联合分布函数求边缘分布函数"),
  explanation: t(
    "The event $X \\le x$ puts no restriction on $Y$, so the marginal distribution function comes from letting $y$ reach the top of its range: $F_X(x) = F(x, \\infty)$. On a bounded region, this means substituting the largest possible $y$. No differentiation or integration is needed, since the joint function already holds the answer.",
    "事件 $X \\le x$ 对 $Y$ 没有限制，所以边缘分布函数是让 $y$ 达到其范围的上端得到的：$F_X(x) = F(x, \\infty)$。在有界区域上，就是代入 $y$ 的最大值。既不用求导，也不用积分，因为联合分布函数中已经含有答案。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const x = rng.int(1, a - 1);
    const answer = Q.of(x * x, a * a);
    return numberProblem({
      prompt: t(
        `On $0 \\le x \\le ${a}$, $0 \\le y \\le ${b}$, the joint CDF of $(X, Y)$ is $F(x, y) = \\frac{x^2y}{${a * a * b}}$. Find $P(X \\le ${x})$.`,
        `在 $0 \\le x \\le ${a}$，$0 \\le y \\le ${b}$ 上，$(X, Y)$ 的联合分布函数是 $F(x, y) = \\frac{x^2y}{${a * a * b}}$。求 $P(X \\le ${x})$。`,
      ),
      answer,
      wrong: [Q.of(x, a), Q.of(x * x, a * a * b), Q.of(x * x, a)],
      solution: t(
        `Substituting the top value $y = ${b}$ gives $F_X(${x}) = \\frac{${x * x} \\cdot ${b}}{${a * a * b}} = ${answer.toLatex()}$.`,
        `代入上端值 $y = ${b}$，得 $F_X(${x}) = \\frac{${x * x} \\cdot ${b}}{${a * a * b}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const conditionalNormalVariance: KnowledgePointDef = {
  id: "the-conditional-variance-of-a-bivariate-normal",
  title: t("The conditional variance of a bivariate normal", "二元正态分布的条件方差"),
  explanation: t(
    "In a bivariate normal, the conditional variance of $Y$ given $X = x$ is $\\sigma_Y^2(1 - \\rho^2)$. Unlike the conditional mean, it does not depend on the value of $x$. The factor $\\rho^2$ is the share of the variance of $Y$ that $X$ explains, so the sign of the correlation makes no difference here.",
    "在二元正态分布中，给定 $X = x$ 时 $Y$ 的条件方差是 $\\sigma_Y^2(1 - \\rho^2)$。与条件均值不同，它不取决于 $x$ 的值。因子 $\\rho^2$ 是 $Y$ 的方差中由 $X$ 解释的比例，所以这里相关系数的符号没有影响。",
  ),
  generate(rng) {
    const v = rng.int(1, 40);
    const r = nonzero(rng, 9);
    const x = rng.int(-5, 5);
    const size = Math.abs(r);
    const answer = Q.of(v * (100 - r * r), 100);
    return numberProblem({
      prompt: t(
        `$(X, Y)$ is bivariate normal with $\\text{Var}(Y) = ${v}$ and correlation $${r < 0 ? "-" : ""}${tenths(size)}$. Find $\\text{Var}(Y \\mid X = ${x})$.`,
        `$(X, Y)$ 服从二元正态分布，$\\text{Var}(Y) = ${v}$，相关系数是 $${r < 0 ? "-" : ""}${tenths(size)}$。求 $\\text{Var}(Y \\mid X = ${x})$。`,
      ),
      answer,
      wrong: [Q.of(v * (10 - size), 10), Q.of(v * r * r, 100), Q.of(v)],
      solution: t(
        `The conditional variance is $${v}\\left(1 - ${tenths(size)}^2\\right) = ${answer.toLatex()}$, whatever the value of $x$.`,
        `条件方差是 $${v}\\left(1 - ${tenths(size)}^2\\right) = ${answer.toLatex()}$，与 $x$ 的值无关。`,
      ),
    });
  },
};

const noSuccessInBoth: KnowledgePointDef = {
  id: "the-probability-that-two-binomial-counts-are-both-zero",
  title: t("The probability that two binomial counts are both zero", "两个二项计数都为零的概率"),
  explanation: t(
    "Independent binomial variables with the same success probability add to another binomial, with the trial counts added. The sum is zero exactly when every one of those trials fails. So the probability comes from a single power of $1 - p$, and the two separate counts need not be handled one at a time.",
    "成功概率相同的独立二项变量相加还是二项变量，试验次数相加。和为零，当且仅当所有这些试验都失败。所以概率来自 $1 - p$ 的一个幂，不必逐个处理两个计数。",
  ),
  generate(rng) {
    const q = rng.int(2, 5);
    const m = rng.int(1, 3);
    const n = rng.int(1, 3);
    const p = Q.of(1, q);
    const fail = Q.of(q - 1, q);
    const answer = power(fail, m + n);
    return numberProblem({
      prompt: t(
        `$X$ is binomial with ${m} ${m === 1 ? "trial" : "trials"} and $Y$ is binomial with ${n} ${n === 1 ? "trial" : "trials"}, independent, each trial succeeding with probability $${p.toLatex()}$. Find $P(X + Y = 0)$.`,
        `$X$ 服从 ${m} 次试验的二项分布，$Y$ 服从 ${n} 次试验的二项分布，二者独立，每次试验成功的概率是 $${p.toLatex()}$。求 $P(X + Y = 0)$。`,
      ),
      answer,
      wrong: [power(p, m + n), Q.of(1).sub(answer), power(fail, m * n + 1), power(fail, m + n + 1)],
      solution: t(
        `All ${m + n} trials must fail, so the probability is $\\left(${fail.toLatex()}\\right)^{${m + n}} = ${answer.toLatex()}$.`,
        `${m + n} 次试验必须全部失败，所以概率是 $\\left(${fail.toLatex()}\\right)^{${m + n}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const poissonSplit: KnowledgePointDef = {
  id: "a-poisson-count-given-the-total",
  title: t("A Poisson count given the total", "已知总数时的泊松计数"),
  explanation: t(
    "If $X$ and $Y$ are independent Poisson with means $\\lambda$ and $\\mu$, then knowing $X + Y = n$ turns $X$ into a binomial variable. Each of the $n$ events comes from the first source with probability $\\frac{\\lambda}{\\lambda + \\mu}$. So the conditional mean is that share of $n$, and the exponential factors disappear from the calculation.",
    "如果 $X$、$Y$ 是均值为 $\\lambda$、$\\mu$ 的独立泊松变量，那么知道 $X + Y = n$ 后，$X$ 就变成二项变量。$n$ 个事件中的每一个来自第一个来源的概率是 $\\frac{\\lambda}{\\lambda + \\mu}$。所以条件均值就是 $n$ 的这个比例，指数因子从计算中消失了。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = rng.int(1, 9);
    const n = rng.int(2, 20);
    const answer = Q.of(n * a, a + b);
    return numberProblem({
      prompt: t(
        `Independent $X$ and $Y$ are Poisson with means ${a} and ${b}. Find $E(X \\mid X + Y = ${n})$.`,
        `独立的 $X$、$Y$ 服从均值为 ${a} 和 ${b} 的泊松分布。求 $E(X \\mid X + Y = ${n})$。`,
      ),
      answer,
      wrong: [Q.of(a), Q.of(n * b, a + b), Q.of(a, a + b)],
      solution: t(
        `Given the total, $X$ is binomial with ${n} trials and $p = ${Q.of(a, a + b).toLatex()}$. Its mean is $${answer.toLatex()}$.`,
        `已知总数时，$X$ 服从 ${n} 次试验、$p = ${Q.of(a, a + b).toLatex()}$ 的二项分布。它的均值是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const equalCovariance: KnowledgePointDef = {
  id: "the-variance-of-a-sum-with-equal-covariances",
  title: t("The variance of a sum with equal covariances", "协方差相等时和的方差"),
  explanation: t(
    "The variance of a sum is the sum of all the entries of the covariance matrix. With $n$ variables, there are $n$ variances on the diagonal and $n(n - 1)$ covariances off it, since each pair is counted twice. Forgetting that double count is the usual slip. A shared positive covariance can dominate the total as $n$ grows.",
    "和的方差是协方差矩阵所有元素之和。有 $n$ 个变量时，对角线上有 $n$ 个方差，对角线外有 $n(n - 1)$ 个协方差，因为每一对算了两次。常见的错误就是忘了这个两次。共同的正协方差在 $n$ 增大时可能成为总和的主要部分。",
  ),
  generate(rng) {
    const n = rng.int(3, 7);
    const v = rng.int(1, 12);
    const c = rng.int(1, v);
    const answer = n * v + n * (n - 1) * c;
    return numberProblem({
      prompt: t(
        `Each of $X_1, \\ldots, X_{${n}}$ has variance ${v}, and each pair has covariance ${c}. Find $\\text{Var}(X_1 + \\cdots + X_{${n}})$.`,
        `$X_1, \\ldots, X_{${n}}$ 的方差都是 ${v}，每一对的协方差都是 ${c}。求 $\\text{Var}(X_1 + \\cdots + X_{${n}})$。`,
      ),
      answer,
      form: "integer",
      wrong: [n * v, n * v + (n * (n - 1) * c) / 2, n * n * v],
      solution: t(
        `There are ${n} variances and $${n} \\cdot ${n - 1} = ${n * (n - 1)}$ ordered pairs. The total is $${n * v} + ${n * (n - 1) * c} = ${answer}$.`,
        `有 ${n} 个方差和 $${n} \\cdot ${n - 1} = ${n * (n - 1)}$ 个有序对。总和是 $${n * v} + ${n * (n - 1) * c} = ${answer}$。`,
      ),
    });
  },
};

const correlationFromMatrix: KnowledgePointDef = {
  id: "a-correlation-from-a-covariance-matrix",
  title: t("A correlation from a covariance matrix", "由协方差矩阵求相关系数"),
  explanation: t(
    "A covariance matrix has variances on the diagonal and covariances off it. To get a correlation, divide the covariance by the square roots of the two relevant diagonal entries, not by the entries themselves. The result has no units and lies between $-1$ and $1$, which is a useful check on the arithmetic.",
    "协方差矩阵的对角线上是方差，对角线外是协方差。求相关系数时，要用协方差除以两个相应对角元素的平方根，而不是除以元素本身。结果没有单位，并且在 $-1$ 和 $1$ 之间，这可以用来检查计算。",
  ),
  generate(rng) {
    const p = rng.int(2, 9);
    const q = rng.int(2, 9);
    const size = rng.int(1, p * q - 1);
    const c = rng.pick([size, -size]);
    const answer = Q.of(c, p * q);
    return numberProblem({
      prompt: t(
        `The covariance matrix of $(X, Y)$ is $\\begin{pmatrix} ${p * p} & ${c} \\\\ ${c} & ${q * q} \\end{pmatrix}$. Find the correlation of $X$ and $Y$.`,
        `$(X, Y)$ 的协方差矩阵是 $\\begin{pmatrix} ${p * p} & ${c} \\\\ ${c} & ${q * q} \\end{pmatrix}$。求 $X$ 和 $Y$ 的相关系数。`,
      ),
      answer,
      wrong: [Q.of(c, p * p * q * q), Q.of(c, p + q), answer.neg()],
      solution: t(
        `The standard deviations are ${p} and ${q}, so the correlation is $\\frac{${c}}{${p} \\cdot ${q}} = ${answer.toLatex()}$.`,
        `标准差是 ${p} 和 ${q}，所以相关系数是 $\\frac{${c}}{${p} \\cdot ${q}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const twoInARow: KnowledgePointDef = {
  id: "the-expected-wait-for-two-successes-in-a-row",
  title: t("The expected wait for two successes in a row", "连续两次成功的期望等待"),
  explanation: t(
    "Condition on what happens after the first success. Reaching one success takes $\\frac{1}{p}$ trials on average. One more trial follows: with probability $p$ it finishes the run, and otherwise the whole wait starts again. The law of total expectation gives an equation for the mean, and it solves to $\\frac{1 + p}{p^2}$.",
    "以第一次成功之后发生的事为条件。达到一次成功平均需要 $\\frac{1}{p}$ 次试验。接着再做一次试验：以概率 $p$ 完成连续，否则整个等待重新开始。全期望公式给出关于均值的方程，解得 $\\frac{1 + p}{p^2}$。",
  ),
  generate(rng) {
    const v = rng.int(2, 12);
    const u = rng.pick([...Array(v - 1).keys()].map((i) => i + 1).filter((i) => gcdOf(i, v) === 1));
    const p = Q.of(u, v);
    const answer = Q.of(v * (v + u), u * u);
    return numberProblem({
      prompt: t(
        `Independent trials each succeed with probability $${p.toLatex()}$. Find the expected number of trials until two successes occur in a row.`,
        `独立试验每次成功的概率是 $${p.toLatex()}$。求直到连续两次成功所需试验次数的期望。`,
      ),
      answer,
      wrong: [Q.of(v * v, u * u), Q.of(2 * v, u), Q.of(v * (v + u), u)],
      solution: t(
        `Let $E$ be the mean. Reaching a success takes $\\frac{1}{p}$ trials and one more trial follows, and with probability $1 - p$ everything restarts: $E = \\frac{1}{p} + 1 + (1 - p)E$. So $E = \\frac{1 + p}{p^2} = ${answer.toLatex()}$.`,
        `设 $E$ 为均值。达到一次成功需要 $\\frac{1}{p}$ 次试验，接着再做一次试验，并以概率 $1 - p$ 全部重来：$E = \\frac{1}{p} + 1 + (1 - p)E$。所以 $E = \\frac{1 + p}{p^2} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const dieAboveValue: KnowledgePointDef = {
  id: "the-mean-of-a-die-given-that-it-beats-a-value",
  title: t("The mean of a die given that it beats a value", "已知骰子超过某值时的均值"),
  explanation: t(
    "Conditioning on an event restricts the distribution to that event and rescales it. For a fair die told to exceed $k$, the remaining faces $k + 1, \\ldots, n$ stay equally likely. So the conditional mean is the middle of the remaining faces, the average of the smallest and largest. Only then is any weighted sum needed.",
    "以事件为条件，就是把分布限制在这个事件上并重新缩放。对一个已知超过 $k$ 的公平骰子，剩下的面 $k + 1, \\ldots, n$ 仍然等可能。所以条件均值是剩余面的中点，即最小值和最大值的平均。这里根本不需要加权求和。",
  ),
  generate(rng) {
    const n = rng.int(4, 20);
    const k = rng.int(1, n - 2);
    const answer = Q.of(k + 1 + n, 2);
    return numberProblem({
      prompt: t(
        `A fair die has faces $1, \\ldots, ${n}$, and $X$ is its result. Find $E(X \\mid X > ${k})$.`,
        `一个公平骰子的面是 $1, \\ldots, ${n}$，$X$ 是它的结果。求 $E(X \\mid X > ${k})$。`,
      ),
      answer,
      wrong: [Q.of(n + 1, 2), Q.of(k + n, 2), Q.of(n)],
      solution: t(
        `The faces from ${k + 1} to ${n} remain equally likely, and their average is $\\frac{${k + 1} + ${n}}{2} = ${answer.toLatex()}$.`,
        `从 ${k + 1} 到 ${n} 的面仍然等可能，它们的平均是 $\\frac{${k + 1} + ${n}}{2} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const addingTheMean: KnowledgePointDef = {
  id: "the-sample-variance-after-adding-the-mean",
  title: t("The sample variance after adding the mean", "加入均值后的样本方差"),
  explanation: t(
    "A new observation equal to the sample mean leaves the mean unchanged and adds nothing to the sum of squared deviations. The divisor still grows from $n - 1$ to $n$, so the sample variance shrinks by the factor $\\frac{n - 1}{n}$. This also shows why filling in missing data with the mean makes a sample look less variable than it is.",
    "新观测值等于样本均值时，均值不变，离差平方和也没有增加。但除数从 $n - 1$ 增加到 $n$，所以样本方差缩小为原来的 $\\frac{n - 1}{n}$。这也说明，为什么用均值填补缺失数据，会使样本看起来比实际更集中。",
  ),
  generate(rng) {
    const n = rng.int(3, 30);
    const v = rng.int(1, 20);
    const answer = Q.of(v * (n - 1), n);
    return numberProblem({
      prompt: t(
        `A sample of ${n} values has sample variance ${v}. One more value, equal to the sample mean, is added. Find the new sample variance.`,
        `${n} 个值的样本方差是 ${v}。再加入一个等于样本均值的值。求新的样本方差。`,
      ),
      answer,
      wrong: [Q.of(v), Q.of(v * n, n + 1), Q.of(v * (n - 1), n + 1)],
      solution: t(
        `The sum of squared deviations stays $${v} \\cdot ${n - 1} = ${v * (n - 1)}$, and the divisor becomes ${n}. So the new variance is $${answer.toLatex()}$.`,
        `离差平方和仍是 $${v} \\cdot ${n - 1} = ${v * (n - 1)}$，除数变成 ${n}。所以新方差是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const correctedMean: KnowledgePointDef = {
  id: "correcting-a-sample-mean-after-a-recording-error",
  title: t("Correcting a sample mean after a recording error", "纠正记录错误后的样本均值"),
  explanation: t(
    "A sample mean is the total divided by the sample size, so a mean and a size together recover the total. When a value was recorded wrongly, the total changes by the difference between the correct and wrong values, and the size is unchanged. So the mean changes by that difference divided by the sample size, and the full data set is not needed.",
    "样本均值是总和除以样本量，所以均值和样本量一起就能恢复总和。某个值记录错误时，总和的变化就是正确值与错误值之差，样本量不变。所以均值的变化是这个差除以样本量，不需要完整的数据。",
  ),
  generate(rng) {
    const n = rng.int(4, 12);
    const mean = rng.int(10, 60);
    const wrongValue = rng.int(5, 40);
    const right = rng.pick([...Array(40).keys()].map((i) => i + 5).filter((v) => v !== wrongValue));
    const answer = Q.of(mean).add(Q.of(right - wrongValue, n));
    return numberProblem({
      prompt: t(
        `A sample of ${n} values has mean ${mean}, but one value was recorded as ${wrongValue} instead of ${right}. Find the correct mean.`,
        `${n} 个值的均值是 ${mean}，但其中一个值被记成了 ${wrongValue}，实际是 ${right}。求正确的均值。`,
      ),
      answer,
      wrong: [Q.of(mean + right - wrongValue), Q.of(n * mean + right, n + 1), Q.of(mean)],
      solution: t(
        `The total changes by $${right} - ${wrongValue} = ${right - wrongValue}$. Dividing by ${n} and adding to ${mean} gives $${answer.toLatex()}$.`,
        `总和变化 $${right} - ${wrongValue} = ${right - wrongValue}$。除以 ${n}，再加到 ${mean} 上，得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const uniformEndpoint: KnowledgePointDef = {
  id: "an-endpoint-of-a-uniform-by-the-method-of-moments",
  title: t("An endpoint of a uniform by the method of moments", "用矩法估计均匀分布的端点"),
  explanation: t(
    "A uniform distribution on $[a, b]$ has mean $\\frac{a + b}{2}$ and variance $\\frac{(b - a)^2}{12}$. Matching these to the sample gives two equations. The variance gives the width $b - a$, after a square root, and the mean gives the midpoint. Each endpoint then lies half a width from the midpoint, and so the two estimates follow together.",
    "$[a, b]$ 上的均匀分布，均值是 $\\frac{a + b}{2}$，方差是 $\\frac{(b - a)^2}{12}$。让它们与样本相等，就得到两个方程。方差开平方后给出宽度 $b - a$，均值给出中点。每个端点都与中点相距半个宽度，所以两个估计值一起得到。",
  ),
  generate(rng) {
    const mean = rng.int(-10, 20);
    const width = rng.int(2, 12);
    const variance = Q.of(width * width, 12);
    const half = Q.of(width, 2);
    const answer = Q.of(mean).add(half);
    return numberProblem({
      prompt: t(
        `A sample from a uniform distribution on $[a, b]$ has mean $${mean}$ and variance $${variance.toLatex()}$, using the divisor $n$. Find the method of moments estimate of $b$.`,
        `来自 $[a, b]$ 上均匀分布的样本，均值是 $${mean}$，方差是 $${variance.toLatex()}$（除数为 $n$）。求 $b$ 的矩估计。`,
      ),
      answer,
      wrong: [Q.of(mean + width), Q.of(mean).sub(half), Q.of(mean).add(variance)],
      solution: t(
        `The width satisfies $\\frac{w^2}{12} = ${variance.toLatex()}$, so $w = ${width}$. Then $b = ${mean} + ${half.toLatex()} = ${answer.toLatex()}$.`,
        `宽度满足 $\\frac{w^2}{12} = ${variance.toLatex()}$，所以 $w = ${width}$。于是 $b = ${mean} + ${half.toLatex()} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const sizeBehindEstimate: KnowledgePointDef = {
  id: "the-sample-size-behind-an-estimated-proportion",
  title: t("The sample size behind an estimated proportion", "估计比例背后的样本量"),
  explanation: t(
    "The estimated variance of a sample proportion is $\\frac{\\hat{p}(1 - \\hat{p})}{n}$. Published results often give only the estimate and its variance or margin, and the formula then shows how large the sample must have been. Multiply $\\hat{p}$ by $1 - \\hat{p}$, and divide by the stated variance. This makes it possible to check a claim about precision.",
    "样本比例的估计方差是 $\\frac{\\hat{p}(1 - \\hat{p})}{n}$。发表的结果常常只给估计值及其方差或误差范围，这个公式就能说明样本必须有多大。用 $\\hat{p}$ 乘以 $1 - \\hat{p}$，再除以给出的方差。这样就能核对关于精度的说法。",
  ),
  generate(rng) {
    const [u, v] = rng.pick([
      [1, 2],
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [1, 10],
      [3, 10],
    ]) as [number, number];
    const n = rng.int(2, 60) * 10;
    const p = Q.of(u, v);
    const product = Q.of(u * (v - u), v * v);
    const variance = product.div(Q.of(n));
    return numberProblem({
      prompt: t(
        `A sample proportion is $\\hat{p} = ${p.toLatex()}$, with estimated variance $${variance.toLatex()}$. Find the sample size.`,
        `样本比例是 $\\hat{p} = ${p.toLatex()}$，估计方差是 $${variance.toLatex()}$。求样本量。`,
      ),
      answer: n,
      form: "integer",
      wrong: [n / 2, 2 * n, 4 * n],
      solution: t(
        `Here $\\hat{p}(1 - \\hat{p}) = ${product.toLatex()}$. Dividing by the variance gives $n = ${n}$.`,
        `这里 $\\hat{p}(1 - \\hat{p}) = ${product.toLatex()}$。除以方差，得 $n = ${n}$。`,
      ),
    });
  },
};

const telescopingProduct: KnowledgePointDef = {
  id: "a-telescoping-product",
  title: t("A telescoping product", "裂项乘积"),
  explanation: t(
    "In a product of fractions such as $\\frac{i + 1}{i}$, each numerator cancels the denominator of the next factor. Only the last numerator and the first denominator survive, so the whole product collapses to a single fraction. Write out the first few factors and the last few, and the pattern of cancellation becomes clear.",
    "在 $\\frac{i + 1}{i}$ 这样的分式乘积中，每个分子都与下一个因子的分母相消。只有最后的分子和最初的分母留下来，所以整个乘积化成一个分式。写出前几个因子和后几个因子，相消的规律就清楚了。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = rng.int(a + 1, a + 20);
    const answer = Q.of(b + 1, a);
    return numberProblem({
      prompt: t(`Find $\\prod_{i=${a}}^{${b}} \\frac{i + 1}{i}$.`, `求 $\\prod_{i=${a}}^{${b}} \\frac{i + 1}{i}$。`),
      answer,
      wrong: [Q.of(b, a), Q.of(b + 1, a + 1), Q.of(b - a + 1)],
      solution: t(
        `The factors cancel in a chain, leaving the last numerator ${b + 1} over the first denominator ${a}, which is $${answer.toLatex()}$.`,
        `各因子依次相消，留下最后的分子 ${b + 1} 和最初的分母 ${a}，即 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const logDerivativeAtZero: KnowledgePointDef = {
  id: "the-relative-rate-of-a-product-of-powers",
  title: t("The relative rate of a product of powers", "幂的乘积的相对变化率"),
  explanation: t(
    "Taking logarithms turns a product of powers into a sum, with each exponent as a multiplier and any denominator as a subtraction. Differentiating then gives $\\frac{f'}{f}$ as a sum of simple fractions. So this relative rate of change can be found without the full product rule, and without computing $f$ itself, which could be very large.",
    "取对数把幂的乘积变成和，每个指数成为乘数，分母成为减项。然后求导，就得到 $\\frac{f'}{f}$，它是几个简单分式之和。所以这个相对变化率不用完整的乘积法则就能求出，也不用计算可能很大的 $f$ 本身。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const c = rng.int(1, 6);
    const p = rng.int(2, 4);
    const q = rng.int(2, 4);
    const r = rng.int(2, 4);
    const left = Q.of(p, a).add(Q.of(q, b));
    const right = Q.of(r, c);
    const answer = left.sub(right);
    return numberProblem({
      prompt: t(
        `Let $f(x) = \\frac{(x + ${a})^{${p}}(x + ${b})^{${q}}}{(x + ${c})^{${r}}}$. Find $\\frac{f'(0)}{f(0)}$.`,
        `设 $f(x) = \\frac{(x + ${a})^{${p}}(x + ${b})^{${q}}}{(x + ${c})^{${r}}}$。求 $\\frac{f'(0)}{f(0)}$。`,
      ),
      answer,
      wrong: [left.add(right), left, answer.neg()],
      solution: t(
        `Differentiating $\\ln f$ gives $\\frac{${p}}{x + ${a}} + \\frac{${q}}{x + ${b}} - \\frac{${r}}{x + ${c}}$. At $x = 0$ this is $${answer.toLatex()}$.`,
        `对 $\\ln f$ 求导得 $\\frac{${p}}{x + ${a}} + \\frac{${q}}{x + ${b}} - \\frac{${r}}{x + ${c}}$。在 $x = 0$ 处它是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const poissonMle: KnowledgePointDef = {
  id: "maximizing-a-poisson-log-likelihood",
  title: t("Maximizing a Poisson log-likelihood", "使泊松对数似然最大"),
  explanation: t(
    "For a Poisson sample, the log-likelihood is $\\ell(\\lambda) = -n\\lambda + (\\sum x_i)\\ln\\lambda$ plus terms free of $\\lambda$. Its derivative is $-n + \\frac{\\sum x_i}{\\lambda}$. Setting this to zero gives the sample mean. The second derivative is negative, so this is a true maximum. The factorials in the likelihood do not affect the result.",
    "对泊松样本，对数似然是 $\\ell(\\lambda) = -n\\lambda + (\\sum x_i)\\ln\\lambda$ 加上不含 $\\lambda$ 的项。它的导数是 $-n + \\frac{\\sum x_i}{\\lambda}$。令它为零，得到样本均值。二阶导数为负，所以这确实是最大值。似然中的阶乘不影响结果。",
  ),
  generate(rng) {
    const n = rng.int(4, 6);
    const data = [rng.int(1, 9), ...sampleOf(rng, n - 1, 0, 9)];
    const sum = data.reduce((total, x) => total + x, 0);
    const answer = Q.of(sum, n);
    return numberProblem({
      prompt: t(
        `A Poisson sample is $${data.join(", ")}$. Find the value of $\\lambda$ that maximizes the log-likelihood.`,
        `泊松样本是 $${data.join(", ")}$。求使对数似然最大的 $\\lambda$。`,
      ),
      answer,
      wrong: [Q.of(n, sum), Q.of(sum), Q.of(sum, n + 1)],
      solution: t(
        `The derivative $-${n} + \\frac{${sum}}{\\lambda}$ is zero at $\\lambda = ${answer.toLatex()}$, the sample mean.`,
        `导数 $-${n} + \\frac{${sum}}{\\lambda}$ 在 $\\lambda = ${answer.toLatex()}$ 处为零，这就是样本均值。`,
      ),
    });
  },
};

const exponentialMle: KnowledgePointDef = {
  id: "maximizing-an-exponential-log-likelihood",
  title: t("Maximizing an exponential log-likelihood", "使指数对数似然最大"),
  explanation: t(
    "For an exponential sample, the log-likelihood is $\\ell(\\lambda) = n\\ln\\lambda - \\lambda\\sum x_i$, and its derivative is $\\frac{n}{\\lambda} - \\sum x_i$. Setting this to zero gives $\\hat{\\lambda} = \\frac{n}{\\sum x_i}$, the reciprocal of the sample mean. That makes sense, because the mean of the distribution is the reciprocal of its rate.",
    "对指数样本，对数似然是 $\\ell(\\lambda) = n\\ln\\lambda - \\lambda\\sum x_i$，导数是 $\\frac{n}{\\lambda} - \\sum x_i$。令它为零，得 $\\hat{\\lambda} = \\frac{n}{\\sum x_i}$，即样本均值的倒数。这是合理的，因为这个分布的均值正是速率的倒数。",
  ),
  generate(rng) {
    const n = rng.int(3, 40);
    const sum = rng.int(5, 200);
    const answer = Q.of(n, sum);
    return numberProblem({
      prompt: t(
        `A sample of ${n} values from an exponential distribution with rate $\\lambda$ has $\\sum x_i = ${sum}$. Find the value of $\\lambda$ that maximizes the log-likelihood.`,
        `来自速率为 $\\lambda$ 的指数分布的 ${n} 个值满足 $\\sum x_i = ${sum}$。求使对数似然最大的 $\\lambda$。`,
      ),
      answer,
      wrong: [Q.of(sum, n), Q.of(1, sum), Q.of(n + 1, sum)],
      solution: t(
        `The derivative $\\frac{${n}}{\\lambda} - ${sum}$ is zero at $\\lambda = ${answer.toLatex()}$.`,
        `导数 $\\frac{${n}}{\\lambda} - ${sum}$ 在 $\\lambda = ${answer.toLatex()}$ 处为零。`,
      ),
    });
  },
};

const geometricMle: KnowledgePointDef = {
  id: "the-best-p-for-a-geometric-sample",
  title: t("The best $p$ for a geometric sample", "几何样本的最优 $p$"),
  explanation: t(
    "If $X$ counts the trials up to and including the first success, the likelihood of a sample is $p^n(1 - p)^{\\sum x_i - n}$. The exponents count the successes and the failures. Maximizing it gives $\\hat{p} = \\frac{n}{\\sum x_i}$, the share of all trials that were successes, which is the estimate common sense suggests.",
    "如果 $X$ 是到第一次成功为止（含这一次）的试验次数，样本的似然是 $p^n(1 - p)^{\\sum x_i - n}$。指数分别是成功和失败的次数。使它最大，得 $\\hat{p} = \\frac{n}{\\sum x_i}$，即所有试验中成功的比例，这正是常识所提示的估计。",
  ),
  generate(rng) {
    const n = rng.int(4, 6);
    const data = sampleOf(rng, n, 1, 9);
    const sum = data.reduce((total, x) => total + x, 0);
    const failures = sum - n;
    const answer = Q.of(n, sum);
    return numberProblem({
      prompt: t(
        `The numbers of trials up to and including the first success, in repeated runs, are $${data.join(", ")}$. Find the value of $p$ that maximizes the likelihood.`,
        `多轮重复中，到第一次成功为止（含这一次）的试验次数分别是 $${data.join(", ")}$。求使似然最大的 $p$。`,
      ),
      answer,
      wrong: [Q.of(sum, n), Q.of(n, sum + n), Q.of(1, sum)],
      solution: t(
        `There are ${n} successes and ${failures} ${failures === 1 ? "failure" : "failures"} in ${sum} trials, so the likelihood peaks at $p = ${answer.toLatex()}$.`,
        `${sum} 次试验中有 ${n} 次成功、${failures} 次失败，所以似然在 $p = ${answer.toLatex()}$ 处最大。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Third pass
// ---------------------------------------------------------------------------

/** otherThan picks an integer from lo to hi other than the one given. */
const otherThan = (rng: Rng, lo: number, hi: number, other: number) =>
  rng.pick([...Array(hi - lo + 1).keys()].map((i) => i + lo).filter((i) => i !== other));
/** powerOf writes a power of a variable, leaving out an exponent of one. */
const powerOf = (name: string, n: number) => (n === 1 ? name : `${name}^{${n}}`);
/** timesVariable writes a positive multiple of a variable, leaving out a coefficient of one. */
const timesVariable = (c: number, name: string) => (c === 1 ? name : `${c}${name}`);

const modeOfPowerDensity: KnowledgePointDef = {
  id: "the-mode-of-a-density-with-two-power-factors",
  title: t("The mode of a density with two power factors", "含两个幂因子的密度的众数"),
  explanation: t(
    "To find the mode, maximize the density, and the normalizing constant makes no difference to where the maximum lies. With a product of powers, it is easier to take the logarithm first, because a logarithm turns the product into a sum, and the derivative becomes $\\frac{a}{x} - \\frac{b}{c - x}$. Setting this to zero gives a point that divides the interval in the ratio $a : b$. This is not the mean, which lies closer to the middle of the interval.",
    "求众数就是使密度最大，归一化常数不影响最大值的位置。对幂的乘积，先取对数更容易，因为对数把乘积变成和，导数变成 $\\frac{a}{x} - \\frac{b}{c - x}$。令它为零，得到把区间按 $a : b$ 分开的点。它不是均值，均值更靠近区间的中间。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = otherThan(rng, 1, 6, a);
    const c = rng.int(1, 12);
    const answer = Q.of(a * c, a + b);
    return numberProblem({
      prompt: t(
        `A random variable has density proportional to $${powerOf("x", a)}(${c} - x)${b === 1 ? "" : `^{${b}}`}$ on $[0, ${c}]$. Find its mode.`,
        `一个随机变量在 $[0, ${c}]$ 上的密度与 $${powerOf("x", a)}(${c} - x)${b === 1 ? "" : `^{${b}}`}$ 成正比。求它的众数。`,
      ),
      answer,
      wrong: [Q.of(c, 2), Q.of(b * c, a + b), Q.of(a, a + b), Q.of((a + 1) * c, a + b + 2)],
      solution: t(
        `Setting $\\frac{${a}}{x} = \\frac{${b}}{${c} - x}$ gives $x = \\frac{${a} \\cdot ${c}}{${a + b}} = ${answer.toLatex()}$.`,
        `令 $\\frac{${a}}{x} = \\frac{${b}}{${c} - x}$，得 $x = \\frac{${a} \\cdot ${c}}{${a + b}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const powerOfUniform: KnowledgePointDef = {
  id: "a-probability-for-a-power-of-a-uniform-variable",
  title: t("A probability for a power of a uniform variable", "均匀变量的幂的概率"),
  explanation: t(
    "The distribution function method rewrites an event about $Y$ as an event about $X$. For $Y = X^n$ with $X$ uniform on $[0, 1]$, the event $Y \\le y$ is the same as $X \\le y^{1/n}$, because the power function is increasing there. So $F_Y(y) = y^{1/n}$. This is larger than $y$ itself, as it should be, since raising a number below 1 to a power pushes it towards zero.",
    "分布函数法把关于 $Y$ 的事件改写成关于 $X$ 的事件。对 $Y = X^n$，$X$ 在 $[0, 1]$ 上均匀，事件 $Y \\le y$ 等同于 $X \\le y^{1/n}$，因为幂函数在那里是增函数。所以 $F_Y(y) = y^{1/n}$。它比 $y$ 本身大，这是应该的，因为小于 1 的数取幂后会被推向零。",
  ),
  generate(rng) {
    const n = rng.int(2, 3);
    const b = rng.int(2, 7);
    const a = rng.int(1, b - 1);
    const answer = Q.of(a, b);
    const y = power(answer, n);
    return numberProblem({
      prompt: t(
        `Let $X$ be uniform on $[0, 1]$ and $Y = X^${n}$. Find $P\\left(Y \\le ${y.toLatex()}\\right)$.`,
        `设 $X$ 在 $[0, 1]$ 上均匀，$Y = X^${n}$。求 $P\\left(Y \\le ${y.toLatex()}\\right)$。`,
      ),
      answer,
      wrong: [y, Q.of(1).sub(answer), answer.div(Q.of(n)), Q.of(1).sub(y)],
      solution: t(
        `The event is the same as $X \\le ${answer.toLatex()}$, whose probability is $${answer.toLatex()}$.`,
        `这个事件等同于 $X \\le ${answer.toLatex()}$，其概率是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const squareOnUnevenInterval: KnowledgePointDef = {
  id: "the-square-of-a-uniform-variable-on-an-uneven-interval",
  title: t("The square of a uniform variable on an uneven interval", "不对称区间上均匀变量的平方"),
  explanation: t(
    "The map $x \\mapsto x^2$ is many-to-one, so the event $X^2 \\le c^2$ is the interval $-c \\le X \\le c$. When the support of $X$ reaches further on the right than on the left, part of this interval may fall outside the support, and that part contributes no probability. So there are two cases: while $c$ is at most the left reach, the length is $2c$; after that, the left end stops at the edge of the support.",
    "映射 $x \\mapsto x^2$ 是多对一的，所以事件 $X^2 \\le c^2$ 就是区间 $-c \\le X \\le c$。当 $X$ 的支撑在右边比左边伸得更远时，这个区间的一部分可能落在支撑之外，那部分不贡献概率。所以有两种情况：当 $c$ 不超过左边的范围时，长度是 $2c$；超过之后，左端点停在支撑的边缘。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = a + rng.int(1, 6);
    const c = rng.int(1, b - 1);
    const inside = c <= a;
    const length = inside ? 2 * c : c + a;
    const answer = Q.of(length, a + b);
    return numberProblem({
      prompt: t(
        `Let $X$ be uniform on $[-${a}, ${b}]$. Find $P(X^2 \\le ${c * c})$.`,
        `设 $X$ 在 $[-${a}, ${b}]$ 上均匀。求 $P(X^2 \\le ${c * c})$。`,
      ),
      answer,
      wrong: [Q.of(inside ? c + a : 2 * c, a + b), Q.of(c, a + b), Q.of(c * c, a + b + c * c), Q.of(c, b)],
      solution: t(
        `The event is $${-c} \\le X \\le ${c}$. Inside $[-${a}, ${b}]$, this has length $${length}$, out of a total of $${a + b}$. So the probability is $${answer.toLatex()}$.`,
        `事件是 $${-c} \\le X \\le ${c}$。在 $[-${a}, ${b}]$ 内，它的长度是 $${length}$，总长度是 $${a + b}$。所以概率是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const expectedEmptyBoxes: KnowledgePointDef = {
  id: "the-expected-number-of-empty-boxes",
  title: t("The expected number of empty boxes", "空盒子的期望个数"),
  explanation: t(
    "Counting the empty boxes directly leads to a complicated distribution, but its mean is simple. Give each box an indicator, equal to 1 if the box is empty, so that the count is the sum of the indicators. Linearity of expectation does not require independence, and the indicators here are certainly dependent. It only requires the mean of each indicator, which is the probability that every ball misses that particular box.",
    "直接数空盒子会得到复杂的分布，但它的均值很简单。给每个盒子一个示性变量，盒子为空时等于 1，于是个数就是示性变量之和。期望的线性性不要求独立，这里的示性变量显然不独立。只需要每个示性变量的均值，也就是所有球都没落入那个盒子的概率。",
  ),
  generate(rng) {
    const m = rng.int(2, 8);
    const n = rng.int(2, 5);
    const miss = power(Q.of(m - 1, m), n);
    const answer = miss.mul(Q.of(m));
    return numberProblem({
      prompt: t(
        `Each of ${n} balls is placed independently into one of ${m} equally likely boxes. Find the expected number of empty boxes.`,
        `${n} 个球分别独立地等可能放入 ${m} 个盒子之一。求空盒子的期望个数。`,
      ),
      answer,
      wrong: [miss, power(Q.of(m - 1, m), n - 1).mul(Q.of(m)), power(Q.of(1, m), n).mul(Q.of(m)), answer.add(Q.of(1))],
      solution: t(
        `A given box is empty with probability $\\left(${Q.of(m - 1, m).toLatex()}\\right)^${n}$. Adding this over the ${m} boxes gives $${answer.toLatex()}$.`,
        `一个给定的盒子为空的概率是 $\\left(${Q.of(m - 1, m).toLatex()}\\right)^${n}$。对 ${m} 个盒子求和，得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const momentOfPowerDensity: KnowledgePointDef = {
  id: "a-moment-of-a-power-density",
  title: t("A moment of a power density", "幂密度的矩"),
  explanation: t(
    "The density $f(x) = (k + 1)x^k$ on $[0, 1]$ is a family with a simple moment formula. Multiplying by $x^n$ just raises the exponent, so $E(X^n) = (k + 1)\\int_0^1 x^{k + n}\\,dx = \\frac{k + 1}{k + n + 1}$. The moments fall as $n$ grows, because a number below 1 shrinks when it is raised to a higher power. Larger values of $k$ bring them closer to 1, because the mass then lies nearer to 1.",
    "$[0, 1]$ 上的密度 $f(x) = (k + 1)x^k$ 是一族矩公式很简单的分布。乘以 $x^n$ 只是提高指数，所以 $E(X^n) = (k + 1)\\int_0^1 x^{k + n}\\,dx = \\frac{k + 1}{k + n + 1}$。矩随 $n$ 增大而减小，因为小于 1 的数取更高次幂时会变小。$k$ 越大，矩越接近 1，因为这时质量更靠近 1。",
  ),
  generate(rng) {
    const k = rng.int(1, 9);
    const n = rng.int(2, 7);
    const answer = Q.of(k + 1, k + n + 1);
    return numberProblem({
      prompt: t(
        `A random variable has density $f(x) = ${k + 1}${powerOf("x", k)}$ on $[0, 1]$. Find $E(X^${n})$.`,
        `一个随机变量在 $[0, 1]$ 上的密度是 $f(x) = ${k + 1}${powerOf("x", k)}$。求 $E(X^${n})$。`,
      ),
      answer,
      wrong: [Q.of(k + 1, k + n), Q.of(1, n + 1), Q.of(k, k + n), Q.of(k + 1, n + 1)],
      solution: t(
        `The integral is $${k + 1}\\int_0^1 x^{${k + n}}\\,dx = ${answer.toLatex()}$.`,
        `积分是 $${k + 1}\\int_0^1 x^{${k + n}}\\,dx = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const varianceOfTriangularDensity: KnowledgePointDef = {
  id: "the-variance-of-a-right-triangular-density",
  title: t("The variance of a right triangular density", "直角三角形密度的方差"),
  explanation: t(
    "A density that rises in a straight line from zero has the shape of a right triangle. Its first two moments come from single integrals, with mean $\\frac{2c}{3}$ and second moment $\\frac{c^2}{2}$. Subtracting the square of the mean gives the variance $\\frac{c^2}{18}$. This is smaller than the uniform value $\\frac{c^2}{12}$ on the same interval, because the mass is concentrated towards one end instead of being spread evenly.",
    "从零开始沿直线上升的密度形如直角三角形。它的前两阶矩由单积分得到，均值是 $\\frac{2c}{3}$，二阶矩是 $\\frac{c^2}{2}$。减去均值的平方，得方差 $\\frac{c^2}{18}$。它小于同一区间上均匀分布的值 $\\frac{c^2}{12}$，因为质量集中在一端而不是均匀分布。",
  ),
  generate(rng) {
    const c = rng.int(2, 30);
    const answer = Q.of(c * c, 18);
    return numberProblem({
      prompt: t(
        `A random variable has density $f(x) = \\frac{2x}{${c * c}}$ on $[0, ${c}]$. Find its variance.`,
        `一个随机变量在 $[0, ${c}]$ 上的密度是 $f(x) = \\frac{2x}{${c * c}}$。求它的方差。`,
      ),
      answer,
      wrong: [Q.of(c * c, 2), Q.of(4 * c * c, 9), Q.of(c * c, 12), Q.of(c * c, 9)],
      solution: t(
        `The mean is $${Q.of(2 * c, 3).toLatex()}$ and the second moment is $${Q.of(c * c, 2).toLatex()}$. Subtracting the square of the mean gives $${answer.toLatex()}$.`,
        `均值是 $${Q.of(2 * c, 3).toLatex()}$，二阶矩是 $${Q.of(c * c, 2).toLatex()}$。减去均值的平方，得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const varianceFromFiniteMgf: KnowledgePointDef = {
  id: "the-variance-read-from-a-finite-mgf",
  title: t("The variance read from a finite MGF", "由有限项矩母函数读出方差"),
  explanation: t(
    "The moment generating function of a discrete variable is $\\sum p_i e^{x_i t}$. So a function written as a sum of exponentials can be read as a table: each exponent is a value of the variable, and its coefficient is the probability. Then the moments can be calculated from this table directly, without differentiating anything. A constant term in the function is the probability of the value 0, since $e^{0t} = 1$.",
    "离散变量的矩母函数是 $\\sum p_i e^{x_i t}$。所以写成指数函数之和的函数可以读成一张表：每个指数是变量的一个取值，它的系数是相应的概率。于是可以直接从表计算矩，不必求导。函数中的常数项是取值 0 的概率，因为 $e^{0t} = 1$。",
  ),
  generate(rng) {
    const first = rng.int(1, 8);
    const second = rng.int(1, 9 - first);
    const third = 10 - first - second;
    const d = rng.int(1, 3);
    const e = d + rng.int(1, 3);
    const p = Q.of(second, 10);
    const q = Q.of(third, 10);
    const mean = p.mul(Q.of(d)).add(q.mul(Q.of(e)));
    const moment = p.mul(Q.of(d * d)).add(q.mul(Q.of(e * e)));
    const answer = moment.sub(mean.mul(mean));
    return numberProblem({
      prompt: t(
        `A random variable has moment generating function $M(t) = ${Q.of(first, 10).toLatex()} + ${p.toLatex()}e^{${timesVariable(d, "t")}} + ${q.toLatex()}e^{${timesVariable(e, "t")}}$. Find its variance.`,
        `一个随机变量的矩母函数是 $M(t) = ${Q.of(first, 10).toLatex()} + ${p.toLatex()}e^{${timesVariable(d, "t")}} + ${q.toLatex()}e^{${timesVariable(e, "t")}}$。求它的方差。`,
      ),
      answer,
      wrong: [moment, mean, mean.mul(mean), moment.add(mean.mul(mean))],
      solution: t(
        `The variable takes the values $0$, $${d}$ and $${e}$. Its mean is $${mean.toLatex()}$ and its second moment is $${moment.toLatex()}$, so the variance is $${answer.toLatex()}$.`,
        `变量取值 $0$、$${d}$、$${e}$。均值是 $${mean.toLatex()}$，二阶矩是 $${moment.toLatex()}$，所以方差是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const divisibleByEither: KnowledgePointDef = {
  id: "a-uniform-value-divisible-by-one-of-two-numbers",
  title: t("A uniform value divisible by one of two numbers", "均匀取值能被两数之一整除"),
  explanation: t(
    "Divisible values are easy to count, since $\\lfloor \\frac{N}{a} \\rfloor$ of the numbers from 1 to $N$ are multiples of $a$. But adding the counts for two divisors counts the common multiples twice. Inclusion and exclusion removes them once. For two numbers without a common factor, the common multiples are the multiples of the product. Dividing the final count by $N$ gives the probability, since all values are equally likely.",
    "能整除的值很容易数，从 1 到 $N$ 中有 $\\lfloor \\frac{N}{a} \\rfloor$ 个 $a$ 的倍数。但把两个除数的个数相加时，公倍数被数了两次。容斥原理把它们去掉一次。对没有公因数的两个数，公倍数就是乘积的倍数。最后的个数除以 $N$ 就是概率，因为所有值等可能。",
  ),
  generate(rng) {
    const [a, b] = rng.pick([
      [2, 3],
      [2, 5],
      [3, 4],
      [3, 5],
      [3, 7],
      [4, 5],
      [5, 7],
      [2, 7],
    ] as const);
    const n = rng.int(30, 200);
    const countA = Math.floor(n / a);
    const countB = Math.floor(n / b);
    const both = Math.floor(n / (a * b));
    const answer = Q.of(countA + countB - both, n);
    return numberProblem({
      prompt: t(
        `An integer $X$ is uniform on $\\{1, 2, \\dots, ${n}\\}$. Find the probability that $X$ is divisible by ${a} or by ${b}.`,
        `整数 $X$ 在 $\\{1, 2, \\dots, ${n}\\}$ 上均匀。求 $X$ 能被 ${a} 或 ${b} 整除的概率。`,
      ),
      answer,
      wrong: [Q.of(countA + countB, n), Q.of(both, n), Q.of(countA, n), Q.of(countB, n)],
      solution: t(
        `There are $${countA}$ multiples of ${a}, $${countB}$ of ${b} and $${both}$ of ${a * b}. This gives $${countA} + ${countB} - ${both} = ${countA + countB - both}$ values, out of ${n}, so the probability is $${answer.toLatex()}$.`,
        `${a} 的倍数有 $${countA}$ 个，${b} 的倍数有 $${countB}$ 个，${a * b} 的倍数有 $${both}$ 个。所以共有 $${countA} + ${countB} - ${both} = ${countA + countB - both}$ 个值，总数是 ${n}，概率是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const expectedMaximumOfTwo: KnowledgePointDef = {
  id: "the-expected-maximum-of-two-uniform-draws",
  title: t("The expected maximum of two uniform draws", "两次均匀抽取的期望最大值"),
  explanation: t(
    "The maximum of two independent draws is at most $k$ exactly when both draws are, which has probability $\\frac{k^2}{n^2}$. Subtracting the value for $k - 1$ gives $P(\\max = k) = \\frac{2k - 1}{n^2}$. So large values are more likely than small ones, and the mean lies above the middle of the range. The sum $\\sum k(2k - 1)$ then simplifies by the standard formulas for sums of powers of integers.",
    "两次独立抽取的最大值不超过 $k$，当且仅当两次都不超过 $k$，概率是 $\\frac{k^2}{n^2}$。减去 $k - 1$ 对应的值，得 $P(\\max = k) = \\frac{2k - 1}{n^2}$。所以大的值比小的值更可能，均值在范围中点之上。然后用整数幂之和的标准公式化简 $\\sum k(2k - 1)$。",
  ),
  generate(rng) {
    const n = rng.int(2, 30);
    const answer = Q.of((n + 1) * (4 * n - 1), 6 * n);
    return numberProblem({
      prompt: t(
        `Two independent draws are made from the numbers $1, 2, \\dots, ${n}$, each equally likely. Find the expected value of the larger draw.`,
        `从 $1, 2, \\dots, ${n}$ 中独立抽取两次，每个数等可能。求较大的一次的期望值。`,
      ),
      answer,
      wrong: [Q.of(n + 1, 2), Q.of(2 * (n + 1), 3), Q.of(2 * n, 3), answer.add(Q.of(1))],
      solution: t(
        `Here $P(\\max = k) = \\frac{2k - 1}{${n * n}}$. Summing $k$ times this from $1$ to $${n}$ gives $\\frac{(n + 1)(4n - 1)}{6n} = ${answer.toLatex()}$.`,
        `这里 $P(\\max = k) = \\frac{2k - 1}{${n * n}}$。把 $k$ 乘以它从 $1$ 到 $${n}$ 求和，得 $\\frac{(n + 1)(4n - 1)}{6n} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const twoBernoulliDiffer: KnowledgePointDef = {
  id: "the-probability-that-two-bernoulli-variables-differ",
  title: t("The probability that two Bernoulli variables differ", "两个伯努利变量不相等的概率"),
  explanation: t(
    "Two independent Bernoulli variables differ in two separate ways: the first is 1 and the second is 0, or the other way round. These cases cannot happen together, so their probabilities add, and each one is a product by independence. Notice that if one of the two parameters is $\\frac{1}{2}$, then the answer is $\\frac{1}{2}$, whatever the other parameter may be. This fact is the basis of some simple randomized schemes.",
    "两个独立的伯努利变量有两种不相等的方式：第一个是 1 而第二个是 0，或者反过来。这两种情况不能同时发生，所以概率相加，每个概率由独立性是乘积。注意，如果其中一个参数是 $\\frac{1}{2}$，答案就是 $\\frac{1}{2}$，无论另一个参数是多少。这个事实是一些简单随机化方案的基础。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = rng.int(1, 9);
    const p = Q.of(a, 10);
    const q = Q.of(b, 10);
    const one = Q.of(1);
    const answer = p.mul(one.sub(q)).add(q.mul(one.sub(p)));
    return numberProblem({
      prompt: t(
        `Independent Bernoulli variables $X$ and $Y$ have parameters $${tenths(a)}$ and $${tenths(b)}$. Find $P(X \\ne Y)$.`,
        `独立的伯努利变量 $X$ 和 $Y$ 的参数是 $${tenths(a)}$ 和 $${tenths(b)}$。求 $P(X \\ne Y)$。`,
      ),
      answer,
      wrong: [p.mul(q), p.add(q), p.mul(q).add(one.sub(p).mul(one.sub(q))), Q.of(Math.abs(a - b), 10)],
      solution: t(
        `The two ways give $${tenths(a)} \\cdot ${tenths(10 - b)} + ${tenths(b)} \\cdot ${tenths(10 - a)} = ${answer.toLatex()}$.`,
        `两种方式给出 $${tenths(a)} \\cdot ${tenths(10 - b)} + ${tenths(b)} \\cdot ${tenths(10 - a)} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const binomialFactorialMoment: KnowledgePointDef = {
  id: "the-factorial-moment-of-a-binomial-variable",
  title: t("The factorial moment of a binomial variable", "二项变量的阶乘矩"),
  explanation: t(
    "For a binomial count, $X(X - 1)$ counts the ordered pairs of different trials that both succeed. There are $n(n - 1)$ such pairs, and each succeeds with probability $p^2$, so linearity gives $E[X(X - 1)] = n(n - 1)p^2$. No sum over the distribution is needed. This value is also a quick route to the variance, since $E(X^2)$ equals this factorial moment plus the mean.",
    "对二项计数，$X(X - 1)$ 数的是两次都成功的不同试验的有序对。这样的对有 $n(n - 1)$ 个，每对成功的概率是 $p^2$，所以由线性性 $E[X(X - 1)] = n(n - 1)p^2$。不需要对分布求和。这个值也是求方差的捷径，因为 $E(X^2)$ 等于这个阶乘矩加上均值。",
  ),
  generate(rng) {
    const n = rng.int(2, 30);
    const p = rng.pick([Q.of(1, 2), Q.of(1, 3), Q.of(1, 4), Q.of(1, 5), Q.of(2, 5), Q.of(3, 10), Q.of(3, 5), Q.of(3, 4)]);
    const size = Q.of(n);
    const answer = size
      .mul(Q.of(n - 1))
      .mul(p)
      .mul(p);
    return numberProblem({
      prompt: t(
        `Let $X$ be binomial with $n = ${n}$ and $p = ${p.toLatex()}$. Find $E[X(X - 1)]$.`,
        `设 $X$ 服从二项分布，$n = ${n}$，$p = ${p.toLatex()}$。求 $E[X(X - 1)]$。`,
      ),
      answer,
      wrong: [size.mul(size).mul(p).mul(p), size.mul(Q.of(n - 1)).mul(p), size.mul(p).mul(Q.of(1).sub(p)), answer.add(size.mul(p))],
      solution: t(
        `There are $${n} \\cdot ${n - 1}$ ordered pairs of trials, each succeeding together with probability $\\left(${p.toLatex()}\\right)^2$. So the value is $${answer.toLatex()}$.`,
        `试验的有序对有 $${n} \\cdot ${n - 1}$ 个，每对同时成功的概率是 $\\left(${p.toLatex()}\\right)^2$。所以值是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const thinningPoisson: KnowledgePointDef = {
  id: "the-variance-of-a-thinned-poisson-count",
  title: t("The variance of a thinned Poisson count", "稀疏化泊松计数的方差"),
  explanation: t(
    "If each event of a Poisson process is kept independently with probability $p$, the events that are kept also form a Poisson process, with rate multiplied by $p$. A Poisson count has variance equal to its mean, so the variance is simply the new mean. The formula for a binomial variance, with its factor $1 - p$, does not apply here, because the total number of events is itself random.",
    "如果泊松过程的每个事件以概率 $p$ 独立地保留，那么保留下来的事件也构成泊松过程，速率乘以 $p$。泊松计数的方差等于均值，所以方差就是新的均值。带因子 $1 - p$ 的二项方差公式在这里不适用，因为事件总数本身是随机的。",
  ),
  generate(rng) {
    const rate = rng.int(2, 20);
    const part = rng.int(1, 9);
    const hours = rng.int(1, 8);
    const total = rate * hours;
    const answer = Q.of(total * part, 10);
    return numberProblem({
      prompt: t(
        `Calls arrive as a Poisson process at ${rate} per hour, and each is urgent with probability $${tenths(part)}$, independently. Find the variance of the number of urgent calls in ${hours === 1 ? "one hour" : `${hours} hours`}.`,
        `电话按每小时 ${rate} 个的泊松过程到达，每个电话独立地以概率 $${tenths(part)}$ 为紧急电话。求 ${hours} 小时内紧急电话数的方差。`,
      ),
      answer,
      wrong: [Q.of(total), Q.of(total * part * (10 - part), 100), Q.of(rate * part, 10), answer.add(Q.of(1))],
      solution: t(
        `The urgent calls form a Poisson process with mean $${total} \\cdot ${tenths(part)} = ${answer.toLatex()}$ over this time, and a Poisson count has variance equal to its mean.`,
        `紧急电话构成泊松过程，这段时间内的均值是 $${total} \\cdot ${tenths(part)} = ${answer.toLatex()}$，而泊松计数的方差等于均值。`,
      ),
    });
  },
};

const poissonIntervalMultiple: KnowledgePointDef = {
  id: "a-poisson-interval-as-a-multiple-of-an-exponential",
  title: t("A Poisson interval as a multiple of an exponential", "泊松区间概率写成指数的倍数"),
  explanation: t(
    "Every Poisson probability carries the same factor $e^{-\\lambda}$, so a sum of consecutive probabilities can be written as this factor times a sum of terms $\\frac{\\lambda^k}{k!}$. Writing it in this way keeps the exact value, with no rounding. Take care with which terms belong: both ends of the interval count if the inequalities are not strict, and the term for $k = 0$ equals 1 when it is included.",
    "每个泊松概率都带有相同的因子 $e^{-\\lambda}$，所以连续几个概率之和可以写成这个因子乘以若干项 $\\frac{\\lambda^k}{k!}$ 之和。这样写保留了精确值，没有舍入。要注意哪些项属于这个和：不等式不严格时，区间两端都算，$k = 0$ 的项如果包含在内就等于 1。",
  ),
  generate(rng) {
    const lambda = rng.int(1, 9);
    const lo = rng.int(0, 2);
    const hi = lo + rng.int(1, 3);
    const total = (from: number, to: number) => {
      let sum = Q.of(0);
      for (let k = from; k <= to; k++) sum = sum.add(Q.of(lambda ** k, factorial(k)));
      return sum;
    };
    const answer = total(lo, hi);
    return numberProblem({
      prompt: t(
        `For a Poisson variable with mean ${lambda}, $P(${lo} \\le X \\le ${hi}) = ce^{-${lambda}}$. Find $c$.`,
        `对均值为 ${lambda} 的泊松变量，$P(${lo} \\le X \\le ${hi}) = ce^{-${lambda}}$。求 $c$。`,
      ),
      answer,
      wrong: [total(lo + 1, hi), total(lo, hi - 1), total(lo, hi + 1), answer.add(Q.of(1))],
      solution: t(
        `The value of $c$ is the sum of $\\frac{${lambda}^k}{k!}$ for $k$ from ${lo} to ${hi}, which is $${answer.toLatex()}$.`,
        `$c$ 的值是 $k$ 从 ${lo} 到 ${hi} 时 $\\frac{${lambda}^k}{k!}$ 的和，等于 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const expectedFailures: KnowledgePointDef = {
  id: "the-expected-failures-before-the-last-success",
  title: t("The expected failures before the last success", "最后一次成功前的期望失败次数"),
  explanation: t(
    "The negative binomial variable can count either all the attempts up to the $r$-th success or only the failures, and it pays to check which is meant. Attempts have mean $\\frac{r}{p}$. Every attempt is either a failure or one of the $r$ successes, so the failures have mean $\\frac{r}{p} - r = \\frac{r(1 - p)}{p}$. Both versions of the variable have the same variance, because they differ only by the constant $r$.",
    "负二项变量可以数到第 $r$ 次成功为止的全部尝试，也可以只数失败，值得确认指的是哪一个。尝试次数的均值是 $\\frac{r}{p}$。每次尝试要么是失败，要么是 $r$ 次成功之一，所以失败次数的均值是 $\\frac{r}{p} - r = \\frac{r(1 - p)}{p}$。两种变量的方差相同，因为它们只差常数 $r$。",
  ),
  generate(rng) {
    const r = rng.int(2, 9);
    const b = rng.int(2, 10);
    const a = rng.int(1, b - 1);
    const p = Q.of(a, b);
    const q = Q.of(1).sub(p);
    const count = Q.of(r);
    const attempts = count.div(p);
    const answer = attempts.sub(count);
    return numberProblem({
      prompt: t(
        `A player scores each shot with probability $${p.toLatex()}$, independently, and shoots until reaching ${r} scores. Find the expected number of misses.`,
        `一名选手每次投篮独立地以概率 $${p.toLatex()}$ 命中，一直投到命中 ${r} 次为止。求未命中次数的期望。`,
      ),
      answer,
      wrong: [attempts, count.mul(q), count.mul(p).div(q), answer.add(Q.of(1))],
      solution: t(
        `The expected number of shots is $${attempts.toLatex()}$, and ${r} of them are scores. So the expected number of misses is $${answer.toLatex()}$.`,
        `投篮次数的期望是 $${attempts.toLatex()}$，其中 ${r} 次命中。所以未命中次数的期望是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const remainingUniformWait: KnowledgePointDef = {
  id: "the-expected-remaining-wait-for-a-uniform-time",
  title: t("The expected remaining wait for a uniform time", "均匀时间的期望剩余等待"),
  explanation: t(
    "Given that a uniform waiting time on $[0, T]$ has already passed $a$, its conditional distribution is uniform on the rest of the interval, $[a, T]$. So the mean remaining wait is half of what is left, $\\frac{T - a}{2}$, and it shrinks as time passes. This is the opposite of the exponential distribution, which forgets the past: there, the expected remaining wait stays the same however long one has waited.",
    "在 $[0, T]$ 上均匀的等待时间已经超过 $a$ 的条件下，它的条件分布在区间其余部分 $[a, T]$ 上均匀。所以平均剩余等待是剩下部分的一半，$\\frac{T - a}{2}$，它随时间流逝而缩短。这与指数分布相反，指数分布会遗忘过去：无论已经等了多久，期望的剩余等待都不变。",
  ),
  generate(rng) {
    const total = rng.int(10, 60);
    const a = rng.int(1, total - 1);
    const answer = Q.of(total - a, 2);
    return numberProblem({
      prompt: t(
        `The waiting time for a bus is uniform on $[0, ${total}]$ minutes. Someone has already waited ${a === 1 ? "one minute" : `${a} minutes`} without a bus. Find the expected additional wait, in minutes.`,
        `等公交车的时间在 $[0, ${total}]$ 分钟上均匀。有人已经等了 ${a} 分钟，车还没来。求期望的额外等待时间（分钟）。`,
      ),
      answer,
      wrong: [Q.of(total, 2), Q.of(total + a, 2), Q.of(total - a), Q.of(a, 2)],
      solution: t(
        `Given the wait so far, the time is uniform on $[${a}, ${total}]$, so the remaining time is uniform on $[0, ${total - a}]$. Its mean is $${answer.toLatex()}$.`,
        `已知已等待的时间，总时间在 $[${a}, ${total}]$ 上均匀，所以剩余时间在 $[0, ${total - a}]$ 上均匀。它的均值是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const exponentialGivenExceeds: KnowledgePointDef = {
  id: "the-mean-of-an-exponential-given-that-it-exceeds-a-value",
  title: t("The mean of an exponential given that it exceeds a value", "指数变量超过某值时的均值"),
  explanation: t(
    "The exponential distribution is memoryless, so given $X > a$, the excess $X - a$ has the same distribution as $X$ itself. The excess therefore has mean $\\frac{1}{\\lambda}$, and adding $a$ back gives $E(X \\mid X > a) = a + \\frac{1}{\\lambda}$. This avoids an integration by parts. Note that this conditional mean is the total time, and not just the extra part, so the value $a$ must be included.",
    "指数分布无记忆，所以在 $X > a$ 的条件下，超出量 $X - a$ 与 $X$ 本身同分布。因此超出量的均值是 $\\frac{1}{\\lambda}$，再加回 $a$，得 $E(X \\mid X > a) = a + \\frac{1}{\\lambda}$。这样就不必分部积分。注意这个条件均值是总时间，不只是多出来的部分，所以必须包含 $a$。",
  ),
  generate(rng) {
    const rate = rng.pick([Q.of(1, 2), Q.of(1, 3), Q.of(1, 4), Q.of(2), Q.of(3), Q.of(2, 3), Q.of(3, 2), Q.of(1, 5), Q.of(4)]);
    const a = rng.int(1, 9);
    const mean = Q.of(1).div(rate);
    const start = Q.of(a);
    const answer = start.add(mean);
    return numberProblem({
      prompt: t(
        `Let $X$ be exponential with rate $\\lambda = ${rate.toLatex()}$. Find $E(X \\mid X > ${a})$.`,
        `设 $X$ 服从速率 $\\lambda = ${rate.toLatex()}$ 的指数分布。求 $E(X \\mid X > ${a})$。`,
      ),
      answer,
      wrong: [mean, start, start.add(rate), start.mul(mean)],
      solution: t(
        `By memorylessness, the excess over ${a} has mean $${mean.toLatex()}$. So the conditional mean is $${a} + ${mean.toLatex()} = ${answer.toLatex()}$.`,
        `由无记忆性，超过 ${a} 的部分均值是 $${mean.toLatex()}$。所以条件均值是 $${a} + ${mean.toLatex()} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const conditionalMeanFromJoint: KnowledgePointDef = {
  id: "a-conditional-mean-from-joint-probabilities",
  title: t("A conditional mean from joint probabilities", "由联合概率求条件均值"),
  explanation: t(
    "Fixing $X = x$ picks out one row of the joint table. The entries of that row do not add to 1, so they must be divided by the marginal probability of the row before they can be used as a distribution. Only then can they be weighted by the values of $Y$. In effect, the conditional mean is the weighted sum of the row divided by the sum of the row, and the rest of the table plays no part.",
    "固定 $X = x$ 就选出了联合表的一行。这一行的元素之和不是 1，所以必须除以这一行的边缘概率，才能作为分布使用。然后才能用 $Y$ 的值加权。实际上，条件均值是这一行的加权和除以这一行的和，表的其余部分不起作用。",
  ),
  generate(rng) {
    const a = rng.int(1, 9) * 2;
    const b = rng.int(1, 9) * 2;
    const c = rng.int(1, 9) * 2;
    const x = rng.int(1, 5);
    const sum = a + b + c;
    const weighted = b + 2 * c;
    const answer = Q.of(weighted, sum);
    const shown = (n: number) => (n / 100).toFixed(2);
    const list = `P(X = ${x}, Y = 0) = ${shown(a)}$, $P(X = ${x}, Y = 1) = ${shown(b)}$`;
    return numberProblem({
      prompt: t(
        `A joint distribution has $${list} and $P(X = ${x}, Y = 2) = ${shown(c)}$. Find $E(Y \\mid X = ${x})$.`,
        `一个联合分布满足 $${list}，$P(X = ${x}, Y = 2) = ${shown(c)}$。求 $E(Y \\mid X = ${x})$。`,
      ),
      answer,
      wrong: [Q.of(weighted, 100), Q.of(1), Q.of(sum, 100), Q.of(b + c, sum)],
      solution: t(
        `The row adds to $${shown(sum)}$, and its weighted sum is $${shown(weighted)}$. Dividing gives $${answer.toLatex()}$.`,
        `这一行的和是 $${shown(sum)}$，加权和是 $${shown(weighted)}$。相除得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const conditionalVarianceOnTriangle: KnowledgePointDef = {
  id: "a-conditional-variance-on-a-uniform-triangle",
  title: t("A conditional variance on a uniform triangle", "均匀三角形上的条件方差"),
  explanation: t(
    "When a point is uniform on a region, fixing one coordinate leaves the other uniform along the corresponding slice of the region. On the triangle $0 < y < x < c$, the slice at $X = x$ is the interval from $0$ to $x$. So the conditional distribution depends on $x$ but not on the size $c$ of the triangle. The formula for the variance of a uniform variable then applies at once, with no integration needed.",
    "当点在区域上均匀时，固定一个坐标后，另一个坐标沿区域的相应切片均匀。在三角形 $0 < y < x < c$ 上，$X = x$ 处的切片是从 $0$ 到 $x$ 的区间。所以条件分布取决于 $x$，但与三角形的大小 $c$ 无关。于是均匀变量的方差公式可以立即应用，不必积分。",
  ),
  generate(rng) {
    const c = rng.int(2, 12);
    const x = rng.int(1, c - 1);
    const answer = Q.of(x * x, 12);
    return numberProblem({
      prompt: t(
        `A point $(X, Y)$ is uniform on the triangle $0 < y < x < ${c}$. Find $\\operatorname{Var}(Y \\mid X = ${x})$.`,
        `点 $(X, Y)$ 在三角形 $0 < y < x < ${c}$ 上均匀。求 $\\operatorname{Var}(Y \\mid X = ${x})$。`,
      ),
      answer,
      wrong: [Q.of(x, 2), Q.of(x * x, 4), Q.of(x * x, 3), Q.of(c * c, 12)],
      solution: t(
        `Given $X = ${x}$, the variable $Y$ is uniform on $[0, ${x}]$. Its variance is $\\frac{${x}^2}{12} = ${answer.toLatex()}$.`,
        `已知 $X = ${x}$，变量 $Y$ 在 $[0, ${x}]$ 上均匀。它的方差是 $\\frac{${x}^2}{12} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const rectangleFromJointCdf: KnowledgePointDef = {
  id: "a-rectangle-probability-from-a-joint-cdf",
  title: t("A rectangle probability from a joint CDF", "由联合分布函数求矩形的概率"),
  explanation: t(
    "A joint CDF gives the probability of a quarter-plane, and a rectangle can be built from four of these. The probability that $a < X \\le b$ and $c < Y \\le d$ is $F(b, d) - F(a, d) - F(b, c) + F(a, c)$. The last term is added back because the corner below and to the left of the rectangle was subtracted twice. Leaving out either of the middle terms would count regions that lie outside the rectangle.",
    "联合分布函数给出四分之一平面的概率，矩形可以由四个这样的区域组成。$a < X \\le b$ 且 $c < Y \\le d$ 的概率是 $F(b, d) - F(a, d) - F(b, c) + F(a, c)$。最后一项要加回来，因为矩形左下方的角被减了两次。漏掉中间任何一项，都会把矩形外的区域算进去。",
  ),
  generate(rng) {
    const big = rng.int(2, 6);
    const tall = rng.int(2, 6);
    const b = rng.int(2, big);
    const a = rng.int(1, b - 1);
    const d = rng.int(2, tall);
    const c = rng.int(1, d - 1);
    const scale = big * big * tall * tall;
    const answer = Q.of((b * b - a * a) * (d * d - c * c), scale);
    return numberProblem({
      prompt: t(
        `On $[0, ${big}] \\times [0, ${tall}]$, a joint CDF is $F(x, y) = \\frac{x^2y^2}{${scale}}$. Find $P(${a} < X \\le ${b},\\ ${c} < Y \\le ${d})$.`,
        `在 $[0, ${big}] \\times [0, ${tall}]$ 上，联合分布函数是 $F(x, y) = \\frac{x^2y^2}{${scale}}$。求 $P(${a} < X \\le ${b},\\ ${c} < Y \\le ${d})$。`,
      ),
      answer,
      wrong: [
        Q.of(b * b * d * d, scale),
        Q.of(b * b * d * d - a * a * c * c, scale),
        Q.of((b - a) * (d - c), big * tall),
        Q.of(b * b * (d * d - c * c), scale),
      ],
      solution: t(
        `The four terms factor as $\\frac{(${b * b} - ${a * a})(${d * d} - ${c * c})}{${scale}}$, which equals $${answer.toLatex()}$.`,
        `这四项可分解为 $\\frac{(${b * b} - ${a * a})(${d * d} - ${c * c})}{${scale}}$，它等于 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const expectedSquareOfSum: KnowledgePointDef = {
  id: "the-expected-square-of-a-sum",
  title: t("The expected square of a sum", "和的平方的期望"),
  explanation: t(
    "Expanding gives $E[(X + Y)^2] = E(X^2) + 2E(XY) + E(Y^2)$, and independence turns the middle term into $2E(X)E(Y)$. A tidier way is to use $E(W^2) = \\operatorname{Var}(W) + E(W)^2$ with $W = X + Y$. For independent variables the variances add, so the result is the sum of the variances plus the square of the sum of the means. Both routes give the same value.",
    "展开得 $E[(X + Y)^2] = E(X^2) + 2E(XY) + E(Y^2)$，独立性把中间项变成 $2E(X)E(Y)$。更简洁的方法是对 $W = X + Y$ 用 $E(W^2) = \\operatorname{Var}(W) + E(W)^2$。对独立变量，方差相加，所以结果是方差之和加上均值之和的平方。两条路得到相同的值。",
  ),
  generate(rng) {
    const mx = nonzero(rng, 6);
    const my = nonzero(rng, 6);
    const vx = rng.int(1, 12);
    const vy = rng.int(1, 12);
    const answer = vx + vy + (mx + my) ** 2;
    return numberProblem({
      prompt: t(
        `Independent variables have $E(X) = ${mx}$, $\\operatorname{Var}(X) = ${vx}$, $E(Y) = ${my}$ and $\\operatorname{Var}(Y) = ${vy}$. Find $E[(X + Y)^2]$.`,
        `独立变量满足 $E(X) = ${mx}$，$\\operatorname{Var}(X) = ${vx}$，$E(Y) = ${my}$，$\\operatorname{Var}(Y) = ${vy}$。求 $E[(X + Y)^2]$。`,
      ),
      answer,
      form: "integer",
      wrong: [vx + vy, (mx + my) ** 2, vx + vy + mx * mx + my * my, answer + 1],
      solution: t(
        `The sum has variance $${vx + vy}$ and mean $${mx + my}$, so the value is $${vx + vy} + ${inParens(mx + my)}^2 = ${answer}$.`,
        `和的方差是 $${vx + vy}$，均值是 $${mx + my}$，所以值是 $${vx + vy} + ${inParens(mx + my)}^2 = ${answer}$。`,
      ),
    });
  },
};

const varianceOfProduct: KnowledgePointDef = {
  id: "the-variance-of-a-product-of-independent-variables",
  title: t("The variance of a product of independent variables", "独立变量之积的方差"),
  explanation: t(
    "Variances add for a sum of independent variables, but they do not multiply for a product. Independence does give $E(XY) = E(X)E(Y)$ and $E(X^2Y^2) = E(X^2)E(Y^2)$, since $X^2$ and $Y^2$ are also independent. So $\\operatorname{Var}(XY) = E(X^2)E(Y^2) - (E(X)E(Y))^2$. Each second moment is the variance plus the square of the mean, which shows why the means must be known too, and not only the variances.",
    "独立变量之和的方差相加，但乘积的方差并不相乘。独立性确实给出 $E(XY) = E(X)E(Y)$ 和 $E(X^2Y^2) = E(X^2)E(Y^2)$，因为 $X^2$ 和 $Y^2$ 也独立。所以 $\\operatorname{Var}(XY) = E(X^2)E(Y^2) - (E(X)E(Y))^2$。每个二阶矩是方差加均值的平方，这说明除了方差，还必须知道均值。",
  ),
  generate(rng) {
    const mx = nonzero(rng, 5);
    const my = nonzero(rng, 5);
    const vx = rng.int(1, 9);
    const vy = rng.int(1, 9);
    const sx = vx + mx * mx;
    const sy = vy + my * my;
    const answer = sx * sy - (mx * my) ** 2;
    return numberProblem({
      prompt: t(
        `Independent variables have $E(X) = ${mx}$, $\\operatorname{Var}(X) = ${vx}$, $E(Y) = ${my}$ and $\\operatorname{Var}(Y) = ${vy}$. Find $\\operatorname{Var}(XY)$.`,
        `独立变量满足 $E(X) = ${mx}$，$\\operatorname{Var}(X) = ${vx}$，$E(Y) = ${my}$，$\\operatorname{Var}(Y) = ${vy}$。求 $\\operatorname{Var}(XY)$。`,
      ),
      answer,
      form: "integer",
      wrong: [vx * vy, sx * sy, vx * my * my + vy * mx * mx, answer + 1],
      solution: t(
        `The second moments are $${sx}$ and $${sy}$, and $E(XY) = ${mx * my}$. So the variance is $${sx} \\cdot ${sy} - ${inParens(mx * my)}^2 = ${answer}$.`,
        `二阶矩是 $${sx}$ 和 $${sy}$，$E(XY) = ${mx * my}$。所以方差是 $${sx} \\cdot ${sy} - ${inParens(mx * my)}^2 = ${answer}$。`,
      ),
    });
  },
};

const momentsForPowerDensity: KnowledgePointDef = {
  id: "the-method-of-moments-for-a-power-density",
  title: t("The method of moments for a power density", "幂密度的矩估计"),
  explanation: t(
    "The method of moments sets the mean of the model equal to the sample mean, and solves for the parameter. For the density $(\\theta + 1)x^\\theta$ on $[0, 1]$, the mean is $\\frac{\\theta + 1}{\\theta + 2}$. Setting this equal to $m$ and clearing the fraction gives a linear equation, with solution $\\hat{\\theta} = \\frac{2m - 1}{1 - m}$. A larger sample mean gives a larger estimate, because mass near 1 needs a large exponent.",
    "矩估计令模型的均值等于样本均值，再解出参数。对 $[0, 1]$ 上的密度 $(\\theta + 1)x^\\theta$，均值是 $\\frac{\\theta + 1}{\\theta + 2}$。令它等于 $m$ 并去分母，得到线性方程，解是 $\\hat{\\theta} = \\frac{2m - 1}{1 - m}$。样本均值越大，估计也越大，因为质量靠近 1 需要大的指数。",
  ),
  generate(rng) {
    const q = rng.int(3, 15);
    const p = rng.int(Math.floor(q / 2) + 1, q - 1);
    const m = Q.of(p, q);
    const one = Q.of(1);
    const rest = one.sub(m);
    const answer = m.mul(Q.of(2)).sub(one).div(rest);
    return numberProblem({
      prompt: t(
        `A sample from the density $f(x) = (\\theta + 1)x^\\theta$ on $[0, 1]$ has mean $${m.toLatex()}$. Find the method of moments estimate of $\\theta$.`,
        `来自 $[0, 1]$ 上密度 $f(x) = (\\theta + 1)x^\\theta$ 的样本均值是 $${m.toLatex()}$。求 $\\theta$ 的矩估计。`,
      ),
      answer,
      wrong: [m.div(rest), one.div(rest), answer.add(one), answer.neg()],
      solution: t(
        `Solving $\\frac{\\theta + 1}{\\theta + 2} = ${m.toLatex()}$ gives $\\theta = \\frac{2m - 1}{1 - m} = ${answer.toLatex()}$.`,
        `解 $\\frac{\\theta + 1}{\\theta + 2} = ${m.toLatex()}$，得 $\\theta = \\frac{2m - 1}{1 - m} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const narrowingTheMargin: KnowledgePointDef = {
  id: "the-sample-size-after-narrowing-the-margin",
  title: t("The sample size after narrowing the margin", "缩小误差范围后的样本量"),
  explanation: t(
    "The margin of error of a mean is $z\\frac{\\sigma}{\\sqrt{n}}$, so it shrinks only with the square root of the sample size. To divide the margin by $k$ with the same confidence and spread, the sample must be multiplied by $k^2$. This means that precision gets expensive quickly: halving the margin needs four times as much data. The actual values of $z$ and $\\sigma$ cancel in the comparison and do not need to be known.",
    "均值的误差范围是 $z\\frac{\\sigma}{\\sqrt{n}}$，所以它只随样本量的平方根缩小。要在相同置信度和离散程度下把误差范围除以 $k$，样本量必须乘以 $k^2$。这意味着精度很快变得昂贵：误差范围减半需要四倍的数据。在比较中 $z$ 和 $\\sigma$ 的实际值相消，不需要知道。",
  ),
  generate(rng) {
    const n = rng.int(4, 40) * 5;
    const k = rng.int(2, 6);
    const answer = n * k * k;
    return numberProblem({
      prompt: t(
        `A sample of ${n} gives a confidence interval for a mean. How large a sample gives a margin of error $\\frac{1}{${k}}$ as large, at the same confidence level and with the same $\\sigma$?`,
        `容量为 ${n} 的样本给出均值的置信区间。要使误差范围变为原来的 $\\frac{1}{${k}}$，且置信水平和 $\\sigma$ 不变，样本量应为多少？`,
      ),
      answer,
      form: "integer",
      wrong: [n * k, n + k, n * k * k * k, 2 * n * k],
      solution: t(
        `The margin varies as $\\frac{1}{\\sqrt{n}}$, so $n$ must be multiplied by $${k}^2$. This gives $${answer}$.`,
        `误差范围与 $\\frac{1}{\\sqrt{n}}$ 成比例，所以 $n$ 必须乘以 $${k}^2$。这样得 $${answer}$。`,
      ),
    });
  },
};

const testOnUniform: KnowledgePointDef = {
  id: "the-size-and-power-of-a-test-on-a-uniform-variable",
  title: t("The size and power of a test on a uniform variable", "均匀变量检验的水平和功效"),
  explanation: t(
    "The size of a test is the probability of rejecting when the null hypothesis is true, and its power is the probability of rejecting when the alternative is true. Both are the probability of the same event, the critical region, computed under different distributions. For one observation of a uniform variable on $[0, \\theta]$, rejecting for values above $c$ has probability $\\frac{\\theta - c}{\\theta}$, so a larger $\\theta$ gives greater power.",
    "检验的水平是原假设为真时拒绝的概率，功效是备择假设为真时拒绝的概率。两者是同一事件（拒绝域）在不同分布下的概率。对 $[0, \\theta]$ 上均匀变量的一个观测，当值超过 $c$ 时拒绝的概率是 $\\frac{\\theta - c}{\\theta}$，所以 $\\theta$ 越大，功效越大。",
  ),
  generate(rng) {
    const a = rng.int(2, 12);
    const b = a + rng.int(1, 10);
    const c = rng.int(1, a - 1);
    const asksPower = rng.pick([true, false]);
    const size = Q.of(a - c, a);
    const strength = Q.of(b - c, b);
    const answer = asksPower ? strength : size;
    return numberProblem({
      prompt: t(
        `One observation $X$ of a uniform variable on $[0, \\theta]$ tests $H_0: \\theta = ${a}$ against $H_1: \\theta = ${b}$, rejecting $H_0$ when $X > ${c}$. Find the ${asksPower ? "power" : "size"} of the test.`,
        `用 $[0, \\theta]$ 上均匀变量的一个观测 $X$ 检验 $H_0: \\theta = ${a}$ 对 $H_1: \\theta = ${b}$，当 $X > ${c}$ 时拒绝 $H_0$。求检验的${asksPower ? "功效" : "水平"}。`,
      ),
      answer,
      wrong: [asksPower ? size : strength, Q.of(c, asksPower ? b : a), Q.of(c, asksPower ? a : b), Q.of(b - a, b)],
      solution: t(
        `Under $\\theta = ${asksPower ? b : a}$, the probability of $X > ${c}$ is $1 - \\frac{${c}}{${asksPower ? b : a}} = ${answer.toLatex()}$.`,
        `当 $\\theta = ${asksPower ? b : a}$ 时，$X > ${c}$ 的概率是 $1 - \\frac{${c}}{${asksPower ? b : a}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const anovaFFromTotals: KnowledgePointDef = {
  id: "the-f-statistic-from-the-total-and-within-sums-of-squares",
  title: t("The F statistic from the total and within sums of squares", "由总平方和与组内平方和求 F 统计量"),
  explanation: t(
    "The identity $SST = SSB + SSW$ means that the between-groups sum of squares can be found by subtraction. Each sum of squares must then be divided by its degrees of freedom before they are compared, $k - 1$ between $k$ groups and $N - k$ within them. The statistic $F$ is the ratio of these two mean squares. Comparing raw sums of squares would be misleading, because there are usually far more degrees of freedom within groups.",
    "恒等式 $SST = SSB + SSW$ 说明组间平方和可以用减法求得。比较之前，每个平方和必须除以它的自由度：$k$ 组之间是 $k - 1$，组内是 $N - k$。统计量 $F$ 是这两个均方之比。直接比较平方和会产生误导，因为组内的自由度通常多得多。",
  ),
  generate(rng) {
    const k = rng.int(3, 7);
    const n = k * rng.int(3, 8);
    const between = rng.int(2, 30);
    const within = rng.int(2, 15);
    const ssb = (k - 1) * between;
    const ssw = (n - k) * within;
    const sst = ssb + ssw;
    const answer = Q.of(between, within);
    return numberProblem({
      prompt: t(
        `A one-way analysis of variance of ${k} groups and ${n} observations in all has $SST = ${sst}$ and $SSW = ${ssw}$. Find the $F$ statistic.`,
        `对 ${k} 组、共 ${n} 个观测做单因素方差分析，$SST = ${sst}$，$SSW = ${ssw}$。求 $F$ 统计量。`,
      ),
      answer,
      wrong: [Q.of(ssb, ssw), Q.of(sst, ssw), Q.of(within, between), Q.of(between * (n - 1), sst)],
      solution: t(
        `Here $SSB = ${sst} - ${ssw} = ${ssb}$. The mean squares are $\\frac{${ssb}}{${k - 1}} = ${between}$ and $\\frac{${ssw}}{${n - k}} = ${within}$, so $F = ${answer.toLatex()}$.`,
        `这里 $SSB = ${sst} - ${ssw} = ${ssb}$。均方是 $\\frac{${ssb}}{${k - 1}} = ${between}$ 和 $\\frac{${ssw}}{${n - k}} = ${within}$，所以 $F = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const reversedRanks: KnowledgePointDef = {
  id: "the-squared-rank-differences-of-reversed-rankings",
  title: t("The squared rank differences of reversed rankings", "完全相反排名的秩差平方和"),
  explanation: t(
    "When one ranking is exactly the reverse of another, the rank differences are as large as they can be, and Spearman's coefficient reaches its lowest value of $-1$. Setting $r_s = 1 - \\frac{6\\sum d^2}{n(n^2 - 1)} = -1$ and solving shows that $\\sum d^2 = \\frac{n(n^2 - 1)}{3}$. So this formula gives the largest possible sum of squared differences for $n$ items, which is a useful check on hand calculations.",
    "当一个排名恰好是另一个的逆序时，秩差达到最大，斯皮尔曼系数达到最小值 $-1$。令 $r_s = 1 - \\frac{6\\sum d^2}{n(n^2 - 1)} = -1$ 并求解，得 $\\sum d^2 = \\frac{n(n^2 - 1)}{3}$。所以这个公式给出 $n$ 个项目的秩差平方和的最大可能值，这是手算时有用的检查。",
  ),
  generate(rng) {
    const n = rng.int(3, 30);
    const answer = (n * (n * n - 1)) / 3;
    return numberProblem({
      prompt: t(
        `Two judges rank ${n} items in exactly opposite orders, with no ties. Find $\\sum d^2$, the sum of the squared rank differences.`,
        `两位评委把 ${n} 个项目排成完全相反的顺序，没有并列。求秩差平方和 $\\sum d^2$。`,
      ),
      answer,
      form: "integer",
      wrong: [(n * (n * n - 1)) / 6, n * n, n * (n - 1), answer + 1],
      solution: t(
        `Reversed rankings have $r_s = -1$, so $\\frac{6\\sum d^2}{${n * (n * n - 1)}} = 2$. This gives $\\sum d^2 = ${answer}$.`,
        `相反的排名有 $r_s = -1$，所以 $\\frac{6\\sum d^2}{${n * (n * n - 1)}} = 2$。于是 $\\sum d^2 = ${answer}$。`,
      ),
    });
  },
};

const expectedRange: KnowledgePointDef = {
  id: "the-expected-range-of-a-uniform-sample",
  title: t("The expected range of a uniform sample", "均匀样本的期望极差"),
  explanation: t(
    "On average, $n$ uniform points divide $[0, \\theta]$ into $n + 1$ gaps of equal expected length $\\frac{\\theta}{n + 1}$. The largest point then has mean $\\frac{n\\theta}{n + 1}$, and the smallest has mean $\\frac{\\theta}{n + 1}$. The range is their difference, and expectation is linear, even though the two order statistics are dependent. So the expected range covers $n - 1$ of the gaps, and it never quite reaches the full length $\\theta$.",
    "平均而言，$n$ 个均匀点把 $[0, \\theta]$ 分成 $n + 1$ 段，每段的期望长度都是 $\\frac{\\theta}{n + 1}$。于是最大点的均值是 $\\frac{n\\theta}{n + 1}$，最小点的均值是 $\\frac{\\theta}{n + 1}$。极差是它们的差，而且期望是线性的，尽管这两个顺序统计量并不独立。所以期望极差覆盖 $n - 1$ 段，永远达不到全长 $\\theta$。",
  ),
  generate(rng) {
    const n = rng.int(2, 12);
    const theta = rng.int(1, 20);
    const answer = Q.of(theta * (n - 1), n + 1);
    return numberProblem({
      prompt: t(
        `A sample of ${n} independent values is taken from the uniform distribution on $[0, ${theta}]$. Find the expected value of the largest minus the smallest.`,
        `从 $[0, ${theta}]$ 上的均匀分布中独立抽取 ${n} 个值。求最大值减最小值的期望。`,
      ),
      answer,
      wrong: [Q.of(theta * n, n + 1), Q.of(theta, n + 1), Q.of(theta * (n - 1), n), Q.of(theta)],
      solution: t(
        `The largest has mean $${Q.of(theta * n, n + 1).toLatex()}$, and the smallest has mean $${Q.of(theta, n + 1).toLatex()}$. Their difference is $${answer.toLatex()}$.`,
        `最大值的均值是 $${Q.of(theta * n, n + 1).toLatex()}$，最小值的均值是 $${Q.of(theta, n + 1).toLatex()}$。它们的差是 $${answer.toLatex()}$。`,
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
  "the-law-of-total-probability": [priorFromTotal],
  "bayes-theorem": [evenOddsPrior],
  "k-permutations-of-n-with-repetition": [atLeastOneSymbol],
  "properties-of-variance-for-discrete-random-variables": [standardizing],
  "moment-generating-functions": [secondMomentFromMgf],
  "mean-and-variance-of-the-discrete-uniform-distribution": [sizeFromVariance],
  "the-poisson-distribution": [lambdaFromRatio],
  "the-chi-square-distribution": [chiSquareSum],
  "the-gamma-function": [gammaRatio],
  "the-gamma-distribution": [gammaMode],
  "the-students-t-distribution": [tDegreesForVariance],
  "the-f-distribution": [lowerFQuantile],
  "the-trinomial-distribution": [trinomialConditional],
  "the-multinomial-distribution": [mergedMultinomial],
  "properties-of-the-joint-cdf-of-two-continuous-random-variables": [marginalFromCdf],
  "the-bivariate-normal-distribution": [conditionalNormalVariance],
  "linear-combinations-of-binomial-random-variables": [noSuccessInBoth],
  "linear-combinations-of-poisson-random-variables": [poissonSplit],
  "variance-of-sums-of-random-variables": [equalCovariance],
  "the-covariance-matrix": [correlationFromMatrix],
  "the-law-of-total-expectation-for-discrete-random-variables": [twoInARow],
  "conditional-expectation-for-discrete-random-variables": [dieAboveValue],
  "the-sample-variance": [addingTheMean],
  "the-sample-mean": [correctedMean],
  "the-method-of-moments-two-parameter-distributions": [uniformEndpoint],
  "point-estimates-of-population-proportions": [sizeBehindEstimate],
  "product-notation": [telescopingProduct],
  "logarithmic-differentiation": [logDerivativeAtZero],
  "log-likelihood-functions-for-discrete-probability-distributions": [poissonMle],
  "log-likelihood-functions-for-continuous-probability-distributions": [exponentialMle],
  "likelihood-functions-for-discrete-probability-distributions": [geometricMle],
  "finding-the-mode-of-a-continuous-random-variable": [modeOfPowerDensity],
  "the-distribution-function-method": [powerOfUniform],
  "the-distribution-function-method-with-many-to-one-transformations": [squareOnUnevenInterval],
  "properties-of-expectation-for-discrete-random-variables": [expectedEmptyBoxes],
  "moments-of-continuous-random-variables": [momentOfPowerDensity],
  "variance-of-continuous-random-variables": [varianceOfTriangularDensity],
  "constructing-moment-generating-functions-for-discrete-probability-distributions": [varianceFromFiniteMgf],
  "the-discrete-uniform-distribution": [divisibleByEither],
  "modeling-with-discrete-uniform-distributions": [expectedMaximumOfTwo],
  "the-bernoulli-distribution": [twoBernoulliDiffer],
  "mean-and-variance-of-the-binomial-distribution": [binomialFactorialMoment],
  "modeling-with-the-poisson-distribution": [thinningPoisson],
  "the-cdf-of-the-poisson-distribution": [poissonIntervalMultiple],
  "modeling-with-the-negative-binomial-distribution": [expectedFailures],
  "modeling-with-continuous-uniform-distributions": [remainingUniformWait],
  "mean-and-variance-of-the-exponential-distribution": [exponentialGivenExceeds],
  "conditional-distributions-for-discrete-random-variables": [conditionalMeanFromJoint],
  "conditional-distributions-for-continuous-random-variables": [conditionalVarianceOnTriangle],
  "the-joint-cdf-of-two-continuous-random-variables": [rectangleFromJointCdf],
  "expected-values-of-sums-and-products-of-random-variables": [expectedSquareOfSum],
  "variance-of-sums-of-independent-random-variables": [varianceOfProduct],
  "the-method-of-moments": [momentsForPowerDensity],
  "sample-size-determination-for-estimating-means": [narrowingTheMargin],
  "type-i-and-type-ii-errors": [testOnUniform],
  "the-relationship-between-ssw-ssb-sst": [anovaFFromTotals],
  "spearmans-rank-correlation-coefficient": [reversedRanks],
  "introduction-to-order-statistics": [expectedRange],
};
