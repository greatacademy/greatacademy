// Further knowledge points for topics of Probability & Statistics, each a skill
// the topic's own points leave out. See `deeperProbabilityStatisticsPoints`.

import type { KnowledgePointDef, Rng, Text } from "@ga/content";
import { joinText, t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { probabilityDrawings1 } from "../explanation-drawings-probability-and-statistics-1.ts";

import { lowestTerms, numberProblem, steps, why } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** apart drops explained mistakes that equal the answer, are negative, or repeat an earlier one. */
const apart = (answer: number | Q, mistakes: readonly { readonly value: number | Q; readonly why: Text }[]) => {
  const key = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v).toLatex();
  return mistakes.filter(
    (m, i, all) =>
      key(m.value) !== key(answer) && !key(m.value).startsWith("-") && all.findIndex((x) => key(x.value) === key(m.value)) === i,
  );
};

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
    "When two tests are independent given the true state, their likelihoods multiply. So for two positive results, each branch of the tree gets the square of its single-test probability, and the posterior is the part of the total coming from the true branch. With a prior of $0.5$, $P(+ \\mid D) = 0.8$ and $P(+ \\mid D') = 0.2$, the branches are $0.5 \\cdot 0.8^2 = 0.32$ and $0.5 \\cdot 0.2^2 = 0.02$, so the posterior is $\\frac{0.32}{0.34} = \\frac{16}{17}$.\n\n> **Watch out.** Square the probability on both branches, not only on the true one; and stopping after one test gives the smaller posterior of a single positive.",
    "如果两次检测在真实状态给定时独立，它们的似然相乘。所以两次都阳性时，树的每个分支都乘以单次概率的平方，后验概率就是真实分支在总和中所占的比例。若先验为 $0.5$，$P(+ \\mid D) = 0.8$，$P(+ \\mid D') = 0.2$，两个分支为 $0.5 \\cdot 0.8^2 = 0.32$ 与 $0.5 \\cdot 0.2^2 = 0.02$，所以后验概率为 $\\frac{0.32}{0.34} = \\frac{16}{17}$。\n\n> **注意。** 两个分支都要平方，不能只平方真实分支；只算一次检测得到的是单次阳性时较小的后验概率。",
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
      mistakes: apart(answer, [
        why(
          once.div(once.add(onceNo)),
          "That is the posterior after one positive test; the second test multiplies each branch again.",
          "那是一次阳性后的后验概率；第二次检测要让每个分支再乘一次。",
        ),
        why(yes, "That is the true branch alone; divide it by the total of both branches.", "那只是真实分支；还要除以两个分支之和。"),
        why(
          Q.of(s, 10),
          "That is $P(+ \\mid D)$ for one test, not the probability of the condition.",
          "那是单次检测的 $P(+ \\mid D)$，不是有这种情况的概率。",
        ),
        why(
          yes.div(yes.add(onceNo)),
          "That squares only the true branch; the false branch also needs two positives.",
          "那是只平方了真实分支；错误分支也要两次阳性。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Weight the true branch", "真实分支"],
            t(`$${tenths(p)} \\cdot ${tenths(s)}^2 = ${yes.toLatex()}$.`, `$${tenths(p)} \\cdot ${tenths(s)}^2 = ${yes.toLatex()}$。`),
          ],
          [
            ["Weight the false branch", "错误分支"],
            t(
              `$${tenths(10 - p)} \\cdot ${tenths(f)}^2 = ${no.toLatex()}$.`,
              `$${tenths(10 - p)} \\cdot ${tenths(f)}^2 = ${no.toLatex()}$。`,
            ),
          ],
          [
            ["Take the share", "求所占比例"],
            t(
              `$\\frac{${yes.toLatex()}}{${yes.toLatex()} + ${no.toLatex()}} = ${answer.toLatex()}$.`,
              `$\\frac{${yes.toLatex()}}{${yes.toLatex()} + ${no.toLatex()}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `One positive gives $${once.div(once.add(onceNo)).toLatex()}$, and the second positive raises it to $${answer.toLatex()}$, as more evidence should.`,
          `一次阳性给出 $${once.div(once.add(onceNo)).toLatex()}$，第二次阳性把它提高到 $${answer.toLatex()}$，更多证据理应如此。`,
        ),
      ),
    });
  },
};

const starsWithLowerBounds: KnowledgePointDef = {
  id: "stars-and-bars-with-lower-bounds",
  title: t("Stars and bars with lower bounds", "带下界的隔板法"),
  explanation: t(
    "To count solutions in which some variables have minimum values, first hand out those minimums. What remains is a count of nonnegative solutions with a smaller total, which stars and bars handles: $n$ items among $3$ variables can be split in $\\binom{n+2}{2}$ ways. For $x + y + z = 25$ with $x \\ge 5$ and $y \\ge 2$, hand out $7$, leaving $18$ to share: $\\binom{20}{2} = 190$.\n\n> **Watch out.** Subtract every minimum before counting, not only one of them; and $18$ stars with $2$ bars fill $20$ places, not $19$ or $21$.",
    "要数某些变量有最小值的解，先把这些最小值分出去。剩下的就是总数更小的非负解计数，可以用隔板法：$n$ 个物品分给 $3$ 个变量有 $\\binom{n+2}{2}$ 种分法。对 $x + y + z = 25$，$x \\ge 5$，$y \\ge 2$，先分出 $7$，剩下 $18$ 自由分配：$\\binom{20}{2} = 190$。\n\n> **注意。** 计数前要减去每一个最小值，不能只减一个；$18$ 颗星和 $2$ 根隔板占 $20$ 个位置，不是 $19$ 或 $21$ 个。",
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
      mistakes: apart(answer, [
        why(choose2(n + 2), "That ignores the minimums and counts every nonnegative solution.", "那是忽略了最小值，数了全部非负解。"),
        why(choose2(n - a + 2), "That hands out only the minimum of $x$; $y$ has one too.", "那是只分出了 $x$ 的最小值；$y$ 也有最小值。"),
        why(
          choose2(left + 1),
          "That uses one place too few, which also forces $z \\ge 1$.",
          "那是少用了一个位置，相当于还要求 $z \\ge 1$。",
        ),
        why(
          choose2(left + 3),
          "That uses one place too many; the stars and the two bars fill only the places they need.",
          "那是多用了一个位置；星和两根隔板只占它们所需的位置。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Hand out the minimums", "分出最小值"],
            t(
              `$x$ and $y$ take $${a} + ${b} = ${a + b}$, leaving $${n} - ${a + b} = ${left}$.`,
              `$x$ 与 $y$ 先取 $${a} + ${b} = ${a + b}$，剩下 $${n} - ${a + b} = ${left}$。`,
            ),
          ],
          [
            ["Use stars and bars", "用隔板法"],
            t(
              `$${left}$ stars and $2$ bars: $\\binom{${left + 2}}{2} = ${answer}$.`,
              `$${left}$ 颗星和 $2$ 根隔板：$\\binom{${left + 2}}{2} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Once the extra amount of $x$ is fixed at $j$, the other two share $${left} - j$ in $${left} - j + 1$ ways, so the count is $1 + 2 + \\cdots + ${left + 1} = \\frac{${left + 1} \\cdot ${left + 2}}{2} = ${answer}$.`,
          `固定 $x$ 多出的部分为 $j$ 后，另两个变量分 $${left} - j$，有 $${left} - j + 1$ 种，所以总数为 $1 + 2 + \\cdots + ${left + 1} = \\frac{${left + 1} \\cdot ${left + 2}}{2} = ${answer}$。`,
        ),
      ),
    });
  },
};

const repeatsKeptTogether: KnowledgePointDef = {
  id: "arrangements-with-identical-letters-kept-together",
  title: t("Arrangements with identical letters kept together", "相同字母相邻的排列"),
  explanation: t(
    "If all copies of one letter must stand together, treat them as a single block. The block is one object in the arrangement, and its copies are identical, so there is no need to arrange inside it. Other repeated letters still divide the count. For six A's, two B's and one C with the A's together, the objects are the block, B, B and C: $\\frac{4!}{2!} = 12$ rows.\n\n> **Watch out.** Do not multiply by $6!$ for orders inside the block, since the A's are identical; and still divide by $2!$ for the two B's.",
    "如果某个字母的所有副本必须相邻，就把它们看成一个整体。这个整体在排列中算一个对象，里面的字母相同，不必再排。其他重复的字母仍然要除掉重复计数。六个 A、两个 B 和一个 C 排成一行且 A 相邻时，对象是整体、B、B 和 C：共 $\\frac{4!}{2!} = 12$ 种。\n\n> **注意。** 不要为整体内部的顺序乘以 $6!$，因为 A 都相同；两个 B 仍然要除以 $2!$。",
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
      mistakes: apart(answer, [
        why(
          factorial(a + b + c) / (factorial(a) * factorial(b)),
          "That counts every row and drops the condition that the A's stand together.",
          "那是数了所有排法，丢掉了 A 相邻的条件。",
        ),
        why(
          factorial(objects),
          "That treats the B's as different; divide by the orders of the identical B's.",
          "那是把 B 当成不同的；要除以相同 B 之间的排列数。",
        ),
        why(
          factorial(objects) * factorial(a),
          "That arranges the A's inside the block, but identical letters have one order.",
          "那是在整体内部排列 A，但相同字母只有一种顺序。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Glue the A's", "把 A 粘在一起"],
            t(
              `The block and the other $${b + c}$ letters make $${objects}$ objects.`,
              `整体与其余 $${b + c}$ 个字母共 $${objects}$ 个对象。`,
            ),
          ],
          [
            ["Divide out the B's", "除去 B 的重复"],
            t(`$\\frac{${objects}!}{${b}!} = ${answer}$.`, `$\\frac{${objects}!}{${b}!} = ${answer}$。`),
          ],
        ],
        t(
          `Arrange the other letters first in $\\frac{${b + c}!}{${b}!} = ${factorial(b + c) / factorial(b)}$ ways, then put the block in one of the $${b + c + 1}$ gaps: $${factorial(b + c) / factorial(b)} \\cdot ${b + c + 1} = ${answer}$.`,
          `先排其余字母，有 $\\frac{${b + c}!}{${b}!} = ${factorial(b + c) / factorial(b)}$ 种，再把整体放进 $${b + c + 1}$ 个空隙之一：$${factorial(b + c) / factorial(b)} \\cdot ${b + c + 1} = ${answer}$。`,
        ),
      ),
    });
  },
};

const expectationFromTail: KnowledgePointDef = {
  id: "the-expected-value-from-the-tail-probability",
  title: t("The expected value from the tail probability", "由尾部概率求期望"),
  explanation: t(
    "For a nonnegative random variable, integrating by parts shows that $E[X] = \\int_0^\\infty P(X > t)\\,dt$. This is useful when the tail probability is simpler than the density, because no derivative is needed. For $P(X > t) = \\left(1 + \\frac{t}{10}\\right)^{-11}$, the substitution $u = 1 + \\frac{t}{10}$ gives $E[X] = 10 \\int_1^\\infty u^{-11}\\,du = \\frac{10}{10} = 1$.\n\n> **Watch out.** Integrate the tail $P(X > t)$ itself, not a density. The antiderivative of $u^{-n}$ is $\\frac{u^{-(n-1)}}{-(n-1)}$, so the integral divides by $n - 1$, not by $n$.",
    "对非负随机变量，分部积分可得 $E[X] = \\int_0^\\infty P(X > t)\\,dt$。当尾部概率比密度函数简单时，这个公式很有用，因为不必求导。对于 $P(X > t) = \\left(1 + \\frac{t}{10}\\right)^{-11}$，代换 $u = 1 + \\frac{t}{10}$ 得 $E[X] = 10 \\int_1^\\infty u^{-11}\\,du = \\frac{10}{10} = 1$。\n\n> **注意。** 要积分尾部概率 $P(X > t)$ 本身，而不是密度。$u^{-n}$ 的原函数是 $\\frac{u^{-(n-1)}}{-(n-1)}$，所以积分要除以 $n - 1$，而不是 $n$。",
  ),
  generate(rng) {
    const n = rng.int(2, 7);
    const s = rng.int(1, 6);
    const answer = Q.of(s, n - 1);
    const inner = s === 1 ? "1 + t" : `1 + \\frac{t}{${s}}`;
    const scaled = s === 1 ? "" : `${s} `;
    return numberProblem({
      prompt: t(
        `A nonnegative random variable $X$ has $P(X > t) = \\left(${inner}\\right)^{-${n}}$ for $t \\ge 0$. Find $E[X]$.`,
        `非负随机变量 $X$ 满足：当 $t \\ge 0$ 时，$P(X > t) = \\left(${inner}\\right)^{-${n}}$。求 $E[X]$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(s, n),
          `That divides by the power $${n}$; the antiderivative of $u^{-${n}}$ divides by $${n - 1}$.`,
          `那是除以了幂 $${n}$；$u^{-${n}}$ 的原函数要除以 $${n - 1}$。`,
        ),
        why(
          Q.of(s, n + 1),
          `That integrates as if the power were $${n + 1}$, as for a density; here the tail itself is integrated.`,
          `那是按幂为 $${n + 1}$ 积分，就像对密度那样；这里积分的是尾部概率本身。`,
        ),
        why(Q.of(n - 1, s), "That is the reciprocal of the mean.", "那是均值的倒数。"),
      ]),
      solution: walked(
        [
          [
            ["Substitute", "换元"],
            t(
              `With $u = ${inner}$, $dt = ${s === 1 ? "du" : `${s}\\,du`}$ and $u$ runs from $1$ to $\\infty$, so $E[X] = ${scaled}\\int_1^\\infty u^{-${n}}\\,du$.`,
              `令 $u = ${inner}$，则 $dt = ${s === 1 ? "du" : `${s}\\,du`}$，$u$ 从 $1$ 到 $\\infty$，所以 $E[X] = ${scaled}\\int_1^\\infty u^{-${n}}\\,du$。`,
            ),
          ],
          [
            ["Integrate", "积分"],
            t(
              `$\\int_1^\\infty u^{-${n}}\\,du = \\frac{1}{${n - 1}}$, so $E[X] = ${s === 1 ? "" : `\\frac{${s}}{${n - 1}} = `}${answer.toLatex()}$.`,
              `$\\int_1^\\infty u^{-${n}}\\,du = \\frac{1}{${n - 1}}$，所以 $E[X] = ${s === 1 ? "" : `\\frac{${s}}{${n - 1}} = `}${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          s === 1
            ? `At $t = 0$ the tail is $1$, as it must be, and $\\left[-\\frac{(1 + t)^{-${n - 1}}}{${n - 1}}\\right]_0^\\infty = \\frac{1}{${n - 1}}$.`
            : `$\\frac{X}{${s}}$ has tail $(1 + t)^{-${n}}$ and mean $\\frac{1}{${n - 1}}$; stretching by $${s}$ multiplies the mean by $${s}$.`,
          s === 1
            ? `在 $t = 0$ 处尾部概率为 $1$，理应如此；而 $\\left[-\\frac{(1 + t)^{-${n - 1}}}{${n - 1}}\\right]_0^\\infty = \\frac{1}{${n - 1}}$。`
            : `$\\frac{X}{${s}}$ 的尾部概率是 $(1 + t)^{-${n}}$，均值为 $\\frac{1}{${n - 1}}$；拉伸 $${s}$ 倍使均值乘以 $${s}$。`,
        ),
      ),
    });
  },
};

const varianceFromExponentialMgf: KnowledgePointDef = {
  id: "the-variance-from-an-exponential-of-a-quadratic-mgf",
  title: t("The variance from an MGF of the form $e^{at+bt^2}$", "由 $e^{at+bt^2}$ 形式的矩母函数求方差"),
  explanation: t(
    "Differentiate $M(t)$ twice and set $t = 0$ to get $E[X]$ and $E[X^2]$, and then the variance is $E[X^2] - E[X]^2$. For $M(t) = e^{at+bt^2}$ the variance comes to $2b$, whatever the value of $a$: shifting a distribution does not change its spread. For $M(t) = e^{50t + 200t^2}$, $E[X] = 50$, $E[X^2] = 2500 + 400$, and the variance is $400$.\n\n> **Watch out.** $M''(0)$ is the second moment, not the variance: subtract the square of $M'(0)$. The variance is twice the coefficient of $t^2$, not the coefficient itself.",
    "对 $M(t)$ 求两次导并令 $t = 0$，得 $E[X]$ 和 $E[X^2]$，方差就是 $E[X^2] - E[X]^2$。对 $M(t) = e^{at+bt^2}$，方差是 $2b$，与 $a$ 无关：平移分布不改变它的分散程度。对于 $M(t) = e^{50t + 200t^2}$，$E[X] = 50$，$E[X^2] = 2500 + 400$，方差为 $400$。\n\n> **注意。** $M''(0)$ 是二阶矩，不是方差：还要减去 $M'(0)$ 的平方。方差是 $t^2$ 系数的两倍，而不是系数本身。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = rng.int(1, 6);
    const answer = 2 * b;
    const second = a * a + 2 * b;
    const slope = `${a} + ${2 * b}t`;
    return numberProblem({
      prompt: t(
        `A random variable has moment-generating function $M(t) = e^{${poly([a, "t"], [b, "t^2"])}}$. Find its variance.`,
        `随机变量的矩母函数是 $M(t) = e^{${poly([a, "t"], [b, "t^2"])}}$。求它的方差。`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          b,
          "That is the coefficient of $t^2$; differentiating $t^2$ twice brings a factor $2$.",
          "那是 $t^2$ 的系数；对 $t^2$ 求两次导会带出因子 $2$。",
        ),
        why(a * a, "That is the square of the mean, which is subtracted, not the variance.", "那是均值的平方，它是要减去的，不是方差。"),
        why(
          second,
          "That is the second moment $M''(0)$; the square of the mean must be subtracted.",
          "那是二阶矩 $M''(0)$；还要减去均值的平方。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Differentiate once", "求一阶导数"],
            t(`$M'(t) = (${slope})M(t)$, so $M'(0) = ${a}$.`, `$M'(t) = (${slope})M(t)$，所以 $M'(0) = ${a}$。`),
          ],
          [
            ["Differentiate again", "再求导"],
            t(
              `$M''(t) = \\left(${2 * b} + (${slope})^2\\right)M(t)$, so $M''(0) = ${2 * b} + ${inParens(a)}^2 = ${second}$.`,
              `$M''(t) = \\left(${2 * b} + (${slope})^2\\right)M(t)$，所以 $M''(0) = ${2 * b} + ${inParens(a)}^2 = ${second}$。`,
            ),
          ],
          [
            ["Subtract the square of the mean", "减去均值的平方"],
            t(`The variance is $${second} - ${inParens(a)}^2 = ${answer}$.`, `方差为 $${second} - ${inParens(a)}^2 = ${answer}$。`),
          ],
        ],
        t(
          `$e^{\\mu t + \\sigma^2 t^2 / 2}$ is the generating function of a normal variable, and matching $\\frac{\\sigma^2}{2} = ${b}$ gives $\\sigma^2 = ${answer}$.`,
          `$e^{\\mu t + \\sigma^2 t^2 / 2}$ 是正态变量的矩母函数，对照 $\\frac{\\sigma^2}{2} = ${b}$ 得 $\\sigma^2 = ${answer}$。`,
        ),
      ),
    });
  },
};

const momentFromSeries: KnowledgePointDef = {
  id: "a-moment-from-the-series-of-an-mgf",
  title: t("A moment from the series of an MGF", "由矩母函数的级数求矩"),
  explanation: t(
    "The series $M(t) = \\sum_k E[X^k]\\frac{t^k}{k!}$ means that the coefficient of $t^k$ is $\\frac{E[X^k]}{k!}$. So a moment can be read off without differentiating, as long as the coefficient is multiplied by $k!$. For $M(t) = 1 + 5t + 40t^2 + \\cdots$, $E[X^2] = 2! \\cdot 40 = 80$.\n\n> **Watch out.** The coefficient is not the moment itself: multiply it by $k!$, not divide by it. For $t^3$ that is $3! = 6$, not $3$.",
    "级数 $M(t) = \\sum_k E[X^k]\\frac{t^k}{k!}$ 说明 $t^k$ 的系数是 $\\frac{E[X^k]}{k!}$。所以不必求导就能读出矩，只要把系数乘以 $k!$。对于 $M(t) = 1 + 5t + 40t^2 + \\cdots$，$E[X^2] = 2! \\cdot 40 = 80$。\n\n> **注意。** 系数本身不是矩：要乘以 $k!$，而不是除以它。对 $t^3$ 要乘 $3! = 6$，不是 $3$。",
  ),
  generate(rng) {
    const c1 = rng.int(1, 3);
    const c2 = Math.ceil((c1 * c1) / 2) + rng.int(1, 3);
    const c3 = rng.int(1, 6);
    const k = rng.int(2, 3);
    const c = k === 2 ? c2 : c3;
    const answer = factorial(k) * c;
    const times = c === 1 ? `${k}!` : `${k}! \\cdot ${c}`;
    return numberProblem({
      prompt: t(
        `The series of a moment-generating function begins $M(t) = 1 + ${poly([c1, "t"], [c2, "t^2"], [c3, "t^3"])} + \\cdots$. Find $E[X^{${k}}]$.`,
        `某矩母函数的级数开头是 $M(t) = 1 + ${poly([c1, "t"], [c2, "t^2"], [c3, "t^3"])} + \\cdots$。求 $E[X^{${k}}]$。`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          c,
          `That is the coefficient of $t^{${k}}$ itself; the moment is $${k}!$ times it.`,
          `那是 $t^{${k}}$ 的系数本身；矩是它的 $${k}!$ 倍。`,
        ),
        why(
          k * c,
          `That multiplies by $${k}$ instead of $${k}! = ${factorial(k)}$.`,
          `那是乘以 $${k}$，而不是 $${k}! = ${factorial(k)}$。`,
        ),
        why(Q.of(c, factorial(k)), `That divides by $${k}!$ instead of multiplying.`, `那是除以 $${k}!$，而不是乘以它。`),
      ]),
      solution: walked(
        [
          [
            ["Match the coefficient", "对照系数"],
            t(
              `In the series the coefficient of $t^{${k}}$ is $\\frac{E[X^{${k}}]}{${k}!}$, and here it is $${c}$.`,
              `级数中 $t^{${k}}$ 的系数是 $\\frac{E[X^{${k}}]}{${k}!}$，这里它等于 $${c}$。`,
            ),
          ],
          [["Multiply by the factorial", "乘以阶乘"], t(`$E[X^{${k}}] = ${times} = ${answer}$.`, `$E[X^{${k}}] = ${times} = ${answer}$。`)],
        ],
        t(
          `Dividing back, $\\frac{${answer}}{${k}!} = \\frac{${answer}}{${factorial(k)}} = ${c}$, the coefficient in the series.`,
          `反过来，$\\frac{${answer}}{${k}!} = \\frac{${answer}}{${factorial(k)}} = ${c}$，正是级数中的系数。`,
        ),
      ),
    });
  },
};

const binomialMode: KnowledgePointDef = {
  id: "the-most-likely-value-of-a-binomial-variable",
  title: t("The most likely value of a binomial variable", "二项变量最可能的取值"),
  explanation: t(
    "Comparing consecutive probabilities gives $\\frac{P(X=k)}{P(X=k-1)} = \\frac{(n-k+1)p}{k(1-p)}$, which is above one exactly when $k < (n+1)p$. So the probabilities rise and then fall, and the most likely value is the greatest integer below $(n+1)p$. It need not be the mean. For $n = 50$ and $p = 0.35$, $(n+1)p = 17.85$, so the most likely value is $17$, while the mean is $17.5$.\n\n> **Watch out.** Use $(n+1)p$, not $np$, and round down, not to the nearest integer: the first $k$ above $(n+1)p$ is already past the peak.",
    "比较相邻概率得 $\\frac{P(X=k)}{P(X=k-1)} = \\frac{(n-k+1)p}{k(1-p)}$，当且仅当 $k < (n+1)p$ 时它大于一。所以概率先升后降，最可能的取值是小于 $(n+1)p$ 的最大整数，不一定等于均值。对于 $n = 50$，$p = 0.35$，$(n+1)p = 17.85$，所以最可能的取值是 $17$，而均值是 $17.5$。\n\n> **注意。** 要用 $(n+1)p$，不是 $np$；并且向下取整，不是四舍五入：大于 $(n+1)p$ 的第一个 $k$ 已经越过了峰值。",
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
      mistakes: apart(answer, [
        why(
          answer + 1,
          "That rounds $(n+1)p$ up; the first value above it is already past the peak.",
          "那是把 $(n+1)p$ 向上取整了；大于它的第一个值已经越过了峰值。",
        ),
        why(
          Math.floor((n * p) / 10),
          "That rounds down $np$; the comparison of consecutive probabilities gives $(n+1)p$.",
          "那是对 $np$ 向下取整；比较相邻概率得到的是 $(n+1)p$。",
        ),
        why(n - answer, "That counts the most likely number of failures, not of successes.", "那是最可能的失败次数，不是成功次数。"),
      ]),
      solution: walked(
        [
          [
            ["Compute (n+1)p", "计算 $(n+1)p$"],
            t(
              `$(n+1)p = ${n + 1} \\cdot ${tenths(p)} = ${Q.of((n + 1) * p, 10).toLatex()}$, which is not an integer.`,
              `$(n+1)p = ${n + 1} \\cdot ${tenths(p)} = ${Q.of((n + 1) * p, 10).toLatex()}$，不是整数。`,
            ),
          ],
          [
            ["Round down", "向下取整"],
            t(
              `The probabilities rise while $k < ${Q.of((n + 1) * p, 10).toLatex()}$ and fall after, so the largest is at $k = ${answer}$. The mean $${mean.toLatex()}$ is close but need not point to the same integer.`,
              `当 $k < ${Q.of((n + 1) * p, 10).toLatex()}$ 时概率上升，之后下降，所以最大值在 $k = ${answer}$。均值 $${mean.toLatex()}$ 与之接近，但不一定对应同一个整数。`,
            ),
          ],
        ],
        t(
          answer === n
            ? `At $k = ${n}$ the ratio $\\frac{(n-k+1)p}{k(1-p)}$ is $${Q.of(p, n * (10 - p)).toLatex()}$, above $1$, so the probabilities rise all the way to $${n}$.`
            : `At $k = ${answer}$ the ratio $\\frac{P(X = k + 1)}{P(X = k)} = \\frac{(n-k)p}{(k+1)(1-p)}$ is $${Q.of((n - answer) * p, (answer + 1) * (10 - p)).toLatex()}$, below $1$, so the probabilities fall after $${answer}$.`,
          answer === n
            ? `在 $k = ${n}$ 处比值 $\\frac{(n-k+1)p}{k(1-p)}$ 为 $${Q.of(p, n * (10 - p)).toLatex()}$，大于 $1$，所以概率一直上升到 $${n}$。`
            : `在 $k = ${answer}$ 处比值 $\\frac{P(X = k + 1)}{P(X = k)} = \\frac{(n-k)p}{(k+1)(1-p)}$ 为 $${Q.of((n - answer) * p, (answer + 1) * (10 - p)).toLatex()}$，小于 $1$，所以概率在 $${answer}$ 之后下降。`,
        ),
      ),
    });
  },
};

/** distinctMistakes drops explained mistakes that equal the answer or repeat an earlier one, keeping negative values. */
const distinctMistakes = (answer: number | Q, mistakes: readonly { readonly value: number | Q; readonly why: Text }[]) => {
  const key = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v).toLatex();
  return mistakes.filter((m, i, all) => key(m.value) !== key(answer) && all.findIndex((x) => key(x.value) === key(m.value)) === i);
};

const poissonRatio: KnowledgePointDef = {
  id: "the-poisson-mean-from-a-ratio-of-probabilities",
  title: t("The Poisson mean from a ratio of probabilities", "由概率之比求泊松均值"),
  explanation: t(
    "In the formula for a Poisson probability most of the factors cancel between neighbours, leaving $\\frac{P(X=k+1)}{P(X=k)} = \\frac{\\lambda}{k+1}$. The exponential disappears, so a ratio of two probabilities gives $\\lambda$ with no logarithm or table.\n\n> **Watch out.** The denominator is the larger of the two values, $k + 1$, not $k$. If $\\frac{P(X = 3)}{P(X = 2)} = 2$, then $\\frac{\\lambda}{3} = 2$ and $\\lambda = 6$, not $4$.",
    "在泊松概率公式中，相邻两项的大多数因子都约掉，只剩 $\\frac{P(X=k+1)}{P(X=k)} = \\frac{\\lambda}{k+1}$。指数项消失了，所以由两个概率之比就能求 $\\lambda$，不用对数也不用查表。\n\n> **注意。** 分母是两个值中较大的 $k + 1$，而不是 $k$。若 $\\frac{P(X = 3)}{P(X = 2)} = 2$，则 $\\frac{\\lambda}{3} = 2$，$\\lambda = 6$，而不是 $4$。",
  ),
  generate(rng) {
    const lambda = rng.int(1, 12);
    const k = rng.int(1, 6);
    const ratio = Q.of(lambda, k + 1);
    return numberProblem({
      prompt: t(
        `$X$ has a Poisson distribution with $\\frac{P(X = ${k + 1})}{P(X = ${k})} = ${ratio.toLatex()}$. Find the mean $\\lambda$.`,
        `$X$ 服从泊松分布，$\\frac{P(X = ${k + 1})}{P(X = ${k})} = ${ratio.toLatex()}$。求均值 $\\lambda$。`,
      ),
      answer: lambda,
      mistakes: apart(lambda, [
        why(
          ratio,
          `That takes the ratio itself as $\\lambda$; the ratio is $\\frac{\\lambda}{${k + 1}}$.`,
          `那是把比值本身当作 $\\lambda$；这个比是 $\\frac{\\lambda}{${k + 1}}$。`,
        ),
        why(
          ratio.mul(Q.of(k)),
          `That divides by $${k}$; the factorials leave $${k + 1}$, the larger value, in the denominator.`,
          `那是除以了 $${k}$；阶乘约分后分母留下的是较大的值 $${k + 1}$。`,
        ),
        why(
          Q.of(k + 1).div(ratio),
          `That turns the ratio upside down, as if it were $\\frac{${k + 1}}{\\lambda}$.`,
          `那是把比值倒过来了，好像它是 $\\frac{${k + 1}}{\\lambda}$。`,
        ),
        why(
          ratio.add(Q.of(k + 1)),
          `That adds $${k + 1}$ to the ratio; undoing a division by $${k + 1}$ means multiplying by it.`,
          `那是给比值加上了 $${k + 1}$；还原除以 $${k + 1}$ 要乘以它。`,
        ),
      ]),
      wrong: [lambda + k + 1],
      solution: walked(
        [
          [
            ["Cancel the common factors", "约去公共因子"],
            t(
              "The exponential and all but one power of $\\lambda$ cancel, and so do all but one factor of the factorials.",
              "指数项约掉了，$\\lambda$ 的幂只剩一次，阶乘也只剩一个因子。",
            ),
            [
              "\\frac{P(X = k + 1)}{P(X = k)} = \\frac{e^{-\\lambda}\\lambda^{k+1}/(k+1)!}{e^{-\\lambda}\\lambda^{k}/k!} = \\frac{\\lambda}{k + 1}",
            ],
          ],
          [
            ["Solve for the mean", "解出均值"],
            t(
              `With $k = ${k}$, $\\frac{\\lambda}{${k + 1}} = ${ratio.toLatex()}$, so $\\lambda = ${k + 1} \\cdot ${ratio.toLatex()} = ${lambda}$.`,
              `$k = ${k}$ 时，$\\frac{\\lambda}{${k + 1}} = ${ratio.toLatex()}$，所以 $\\lambda = ${k + 1} \\cdot ${ratio.toLatex()} = ${lambda}$。`,
            ),
          ],
        ],
        t(
          `With $\\lambda = ${lambda}$, $P(X = ${k + 1})$ has one more factor $\\frac{${lambda}}{${k + 1}}$ than $P(X = ${k})$, which is the given ratio $${ratio.toLatex()}$.`,
          `当 $\\lambda = ${lambda}$ 时，$P(X = ${k + 1})$ 比 $P(X = ${k})$ 多一个因子 $\\frac{${lambda}}{${k + 1}}$，正是已知的比值 $${ratio.toLatex()}$。`,
        ),
      ),
    });
  },
};

const geometricMemoryless: KnowledgePointDef = {
  id: "the-memoryless-property-of-the-geometric-distribution",
  title: t("The memoryless property of the geometric distribution", "几何分布的无记忆性"),
  explanation: t(
    "If $X$ counts the trials up to the first success, then $P(X > n) = (1-p)^n$, since the first $n$ trials all fail. Dividing gives $P(X > s + t \\mid X > s) = (1-p)^t$. Failures so far have no effect on the trials still to come.\n\n> **Watch out.** The condition takes the past failures out; it does not leave them in. With $p = 0.2$, $P(X > 7 \\mid X > 5) = 0.8^{2} = 0.64$, not $P(X > 7) = 0.8^{7}$.",
    "如果 $X$ 是到第一次成功为止的试验次数，则 $P(X > n) = (1-p)^n$，因为前 $n$ 次全部失败。相除得 $P(X > s + t \\mid X > s) = (1-p)^t$。已有的失败不影响之后的试验。\n\n> **注意。** 条件把已有的失败去掉了，而不是保留它们。$p = 0.2$ 时，$P(X > 7 \\mid X > 5) = 0.8^{2} = 0.64$，而不是 $P(X > 7) = 0.8^{7}$。",
  ),
  generate(rng) {
    const p = rng.int(1, 9);
    const s = rng.int(2, 9);
    const u = rng.int(1, 3);
    const q = Q.of(10 - p, 10);
    const answer = power(q, u);
    const qTex = tenths(10 - p);
    const qPow = (e: number) => (e === 1 ? qTex : `${qTex}^{${e}}`);
    return numberProblem({
      prompt: t(
        `$X$ is the number of trials up to and including the first success, with success probability ${tenths(p)} on each trial. Find $P(X > ${s + u} \\mid X > ${s})$.`,
        `$X$ 是到第一次成功（含这一次）为止的试验次数，每次成功的概率是 ${tenths(p)}。求 $P(X > ${s + u} \\mid X > ${s})$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          power(q, s + u),
          `That is $P(X > ${s + u})$ without the condition; the first $${s}$ failures are already known.`,
          `那是不带条件的 $P(X > ${s + u})$；前 $${s}$ 次失败已经是已知的了。`,
        ),
        why(power(q, s), `That is $P(X > ${s})$, the probability of the condition itself.`, `那是 $P(X > ${s})$，即条件本身的概率。`),
        why(
          Q.of(1).sub(answer),
          `That is the chance of a success within the next $${u}$ trials, the complement.`,
          `那是接下来 $${u}$ 次内出现成功的概率，即对立事件的概率。`,
        ),
      ]),
      wrong: [Q.of(p, 10).mul(power(q, u))],
      solution: walked(
        [
          [
            ["Write the tails", "写出尾概率"],
            t(
              `$P(X > n) = ${qTex}^{n}$, since the first $n$ trials must all fail.`,
              `$P(X > n) = ${qTex}^{n}$，因为前 $n$ 次必须全部失败。`,
            ),
          ],
          [
            ["Divide", "相除"],
            t(
              `$P(X > ${s + u} \\mid X > ${s}) = \\frac{${qTex}^{${s + u}}}{${qTex}^{${s}}} = ${qPow(u)} = ${answer.toLatex()}$.`,
              `$P(X > ${s + u} \\mid X > ${s}) = \\frac{${qTex}^{${s + u}}}{${qTex}^{${s}}} = ${qPow(u)} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `Directly: given that the first $${s}$ trials failed, $X > ${s + u}$ needs the next $${u}$ to fail as well, and they are independent of the past, so the chance is $${qPow(u)} = ${answer.toLatex()}$ again.`,
          `直接看：已知前 $${s}$ 次失败，$X > ${s + u}$ 要求接下来的 $${u}$ 次也失败，而它们与之前独立，所以概率同样是 $${qPow(u)} = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
};

const uniformEndpoints: KnowledgePointDef = {
  id: "the-endpoints-of-a-uniform-distribution-from-its-moments",
  title: t("The endpoints of a uniform distribution from its moments", "由矩求均匀分布的端点"),
  explanation: t(
    "A uniform distribution on $[a, b]$ has mean $\\frac{a+b}{2}$ and variance $\\frac{(b-a)^2}{12}$. The variance therefore gives the width of the interval, and the mean gives its center. The endpoints lie half a width to each side of the center. With mean $100$ and variance $75$, $(b - a)^2 = 12 \\cdot 75 = 900$, so the width is $30$ and the interval is $[85, 115]$.\n\n> **Watch out.** The endpoint lies half a width from the mean, not a whole width. And the variance is not the width: take $\\sqrt{12\\sigma^2}$ first.",
    "$[a, b]$ 上的均匀分布，均值是 $\\frac{a+b}{2}$，方差是 $\\frac{(b-a)^2}{12}$。所以方差给出区间的宽度，均值给出中心，端点在中心两侧各半个宽度处。若均值为 $100$，方差为 $75$，则 $(b - a)^2 = 12 \\cdot 75 = 900$，宽度为 $30$，区间为 $[85, 115]$。\n\n> **注意。** 端点离均值半个宽度，而不是一整个宽度。方差也不是宽度：要先求 $\\sqrt{12\\sigma^2}$。",
  ),
  generate(rng) {
    const w = 6 * rng.int(1, 4);
    const m = rng.int(-9, 9);
    const variance = (w * w) / 12;
    const upper = rng.int(0, 1) === 0;
    const answer = upper ? m + w / 2 : m - w / 2;
    const [low, high] = [m - w / 2, m + w / 2];
    return numberProblem({
      prompt: t(
        `A uniform random variable on $[a, b]$ has mean $${m}$ and variance $${variance}$. Find $${upper ? "b" : "a"}$.`,
        `$[a, b]$ 上的均匀随机变量，均值为 $${m}$，方差为 $${variance}$。求 $${upper ? "b" : "a"}$。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          upper ? m + w : m - w,
          "That moves a whole width from the mean; the endpoint is half a width away.",
          "那是从均值移动了一整个宽度；端点只离均值半个宽度。",
        ),
        why(
          upper ? m + variance : m - variance,
          "That uses the variance as the distance; the variance gives the width through $(b - a)^2 = 12\\sigma^2$.",
          "那是把方差当作距离；方差要通过 $(b - a)^2 = 12\\sigma^2$ 才得到宽度。",
        ),
        why(upper ? low : high, `That is the other endpoint, $${upper ? "a" : "b"}$.`, `那是另一个端点 $${upper ? "a" : "b"}$。`),
      ].filter((x, i, all) => all.findIndex((y) => y.value === x.value) === i),
      solution: walked(
        [
          [
            ["Find the width", "求宽度"],
            t(
              `$(b - a)^2 = 12 \\cdot ${variance} = ${w * w}$, so $b - a = ${w}$.`,
              `$(b - a)^2 = 12 \\cdot ${variance} = ${w * w}$，所以 $b - a = ${w}$。`,
            ),
          ],
          [
            ["Step half a width from the mean", "从均值移动半个宽度"],
            t(
              `$${upper ? "b" : "a"} = ${m} ${upper ? "+" : "-"} ${w / 2} = ${answer}$.`,
              `$${upper ? "b" : "a"} = ${m} ${upper ? "+" : "-"} ${w / 2} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `On $[${low}, ${high}]$ the mean is $\\frac{${low} + ${inParens(high)}}{2} = ${m}$ and the variance is $\\frac{${w}^2}{12} = ${variance}$.`,
          `在 $[${low}, ${high}]$ 上，均值为 $\\frac{${low} + ${inParens(high)}}{2} = ${m}$，方差为 $\\frac{${w}^2}{12} = ${variance}$。`,
        ),
      ),
    });
  },
};

const minimumOfExponentials: KnowledgePointDef = {
  id: "the-first-of-two-exponential-waiting-times",
  title: t("The first of two exponential waiting times", "两个指数等待时间中较早的一个"),
  explanation: t(
    "The minimum of two independent exponential times exceeds $t$ only if both do, so $P(T > t) = e^{-\\lambda_1 t}e^{-\\lambda_2 t}$. So the minimum is exponential too, with the sum of the two rates. Add rates, not means, and the expected first failure is the reciprocal of that sum. With means $30$ and $60$ years, the rates add to $\\frac{1}{30} + \\frac{1}{60} = \\frac{1}{20}$, so the first failure is expected after $20$ years.\n\n> **Watch out.** Averaging or adding the means gives a time longer than one of the machines alone; the first of two failures comes sooner than either mean.",
    "两个独立指数时间的最小值超过 $t$，当且仅当两者都超过 $t$，所以 $P(T > t) = e^{-\\lambda_1 t}e^{-\\lambda_2 t}$。因此最小值也服从指数分布，速率是两个速率之和。要加的是速率而不是均值，首次失效的期望时间是这个和的倒数。若均值为 $30$ 年和 $60$ 年，速率之和为 $\\frac{1}{30} + \\frac{1}{60} = \\frac{1}{20}$，所以首次失效的期望时间是 $20$ 年。\n\n> **注意。** 把均值平均或相加，得到的时间比其中一台机器单独的均值还长；两者中较早的失效比任何一个均值都来得早。",
  ),
  generate(rng) {
    const a = rng.int(2, 12);
    let b = rng.int(2, 12);
    if (b === a) b += 1;
    const answer = Q.of(a * b, a + b);
    const rate = Q.of(a + b, a * b);
    return numberProblem({
      prompt: t(
        `Two machines run independently, and their lifetimes are exponential with means ${a} and ${b} years. What is the expected time until the first of them fails, in years?`,
        `两台机器独立运行，寿命服从指数分布，均值分别为 ${a} 年和 ${b} 年。直到其中一台首次失效，期望时间是多少年？`,
      ),
      answer,
      mistakes: apart(answer, [
        why(Q.of(a + b, 2), "That averages the two means; add the rates instead.", "那是把两个均值平均了；应该把速率相加。"),
        why(
          Math.min(a, b),
          "That is the shorter mean; the first of two failures comes sooner still.",
          "那是较短的均值；两者中较早的失效来得更早。",
        ),
        why(rate, "That is the combined rate; the expected time is its reciprocal.", "那是合并后的速率；期望时间是它的倒数。"),
        why(a + b, "That adds the means; it is the rates that add.", "那是把均值相加了；应相加的是速率。"),
      ]),
      solution: walked(
        [
          [
            ["Add the rates", "速率相加"],
            t(
              `The rates are $\\frac{1}{${a}}$ and $\\frac{1}{${b}}$, so the first failure has rate $\\frac{1}{${a}} + \\frac{1}{${b}} = ${rate.toLatex()}$.`,
              `速率是 $\\frac{1}{${a}}$ 和 $\\frac{1}{${b}}$，所以首次失效的速率为 $\\frac{1}{${a}} + \\frac{1}{${b}} = ${rate.toLatex()}$。`,
            ),
          ],
          [
            ["Take the reciprocal", "取倒数"],
            t(
              `The first failure is exponential with this rate, so its mean is $${answer.toLatex()}$ years.`,
              `首次失效服从这个速率的指数分布，所以均值是 $${answer.toLatex()}$ 年。`,
            ),
          ],
        ],
        t(
          `$${answer.toLatex()}$ is less than the shorter mean $${Math.min(a, b)}$, as the first of two failures must be.`,
          `$${answer.toLatex()}$ 小于较短的均值 $${Math.min(a, b)}$，两者中较早的失效理应如此。`,
        ),
      ),
    });
  },
};

const probabilityFromIndependentUnion: KnowledgePointDef = {
  id: "a-probability-from-the-union-of-independent-events",
  title: t("A probability from the union of independent events", "由独立事件的并求概率"),
  explanation: t(
    "For independent events, $P(A \\cup B) = P(A) + P(B) - P(A)P(B)$. Working with complements is cleaner: $1 - P(A \\cup B) = (1 - P(A))(1 - P(B))$. This form solves directly for one probability when the other and the union are known. If $P(A) = 0.95$ and $P(A \\cup B) = 0.995$, then $1 - 0.995 = 0.005 = 0.05 \\cdot P(B')$, so $P(B') = 0.1$ and $P(B) = 0.9$.\n\n> **Watch out.** $P(A \\cup B) - P(A)$ is not $P(B)$: it leaves out the overlap $P(A)P(B)$. Divide the complement by $1 - P(A)$, not by $P(A)$.",
    "对独立事件，$P(A \\cup B) = P(A) + P(B) - P(A)P(B)$。用补事件更简洁：$1 - P(A \\cup B) = (1 - P(A))(1 - P(B))$。已知其中一个概率和并的概率时，这个形式可以直接解出另一个。若 $P(A) = 0.95$，$P(A \\cup B) = 0.995$，则 $1 - 0.995 = 0.005 = 0.05 \\cdot P(B')$，所以 $P(B') = 0.1$，$P(B) = 0.9$。\n\n> **注意。** $P(A \\cup B) - P(A)$ 不是 $P(B)$：它漏掉了重叠部分 $P(A)P(B)$。补事件的概率要除以 $1 - P(A)$，而不是 $P(A)$。",
  ),
  generate(rng) {
    const p = rng.int(1, 9);
    const q = rng.int(1, 9);
    const union = Q.of(100 - (10 - p) * (10 - q), 100);
    const answer = Q.of(q, 10);
    const neither = Q.of((10 - p) * (10 - q), 100);
    return numberProblem({
      prompt: t(
        `$X$ and $Y$ are independent and take the values $0$ and $1$. $P(X = 1) = ${tenths(p)}$, and the probability that at least one of them equals $1$ is $${union.toLatex()}$. Find $P(Y = 1)$.`,
        `$X$ 和 $Y$ 独立，取值为 $0$ 和 $1$。$P(X = 1) = ${tenths(p)}$，至少有一个等于 $1$ 的概率是 $${union.toLatex()}$。求 $P(Y = 1)$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          union.sub(Q.of(p, 10)),
          "That subtracts $P(X = 1)$ from the union and leaves out the overlap.",
          "那是用并的概率减去 $P(X = 1)$，漏掉了重叠部分。",
        ),
        why(
          union.div(Q.of(p, 10)),
          "That divides the union by $P(X = 1)$, as if the union were a product.",
          "那是用并的概率除以 $P(X = 1)$，好像并是乘积一样。",
        ),
        why(Q.of(10 - q, 10), "That is $P(Y = 0)$; subtract it from $1$.", "那是 $P(Y = 0)$；要用 $1$ 减去它。"),
      ]),
      solution: walked(
        [
          [
            ["Take the complement", "取补事件"],
            t(
              `Neither equals $1$ with probability $1 - ${union.toLatex()} = ${neither.toLatex()}$.`,
              `都不等于 $1$ 的概率是 $1 - ${union.toLatex()} = ${neither.toLatex()}$。`,
            ),
          ],
          [
            ["Use independence", "利用独立性"],
            t(
              `By independence this is $P(X = 0)P(Y = 0) = ${tenths(10 - p)} \\cdot P(Y = 0)$, so $P(Y = 0) = ${Q.of(10 - q, 10).toLatex()}$.`,
              `由独立性它等于 $P(X = 0)P(Y = 0) = ${tenths(10 - p)} \\cdot P(Y = 0)$，所以 $P(Y = 0) = ${Q.of(10 - q, 10).toLatex()}$。`,
            ),
          ],
          [
            ["Take the complement again", "再取补"],
            t(
              `$P(Y = 1) = 1 - ${Q.of(10 - q, 10).toLatex()} = ${tenths(q)} = ${answer.toLatex()}$.`,
              `$P(Y = 1) = 1 - ${Q.of(10 - q, 10).toLatex()} = ${tenths(q)} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$P(X = 1) + P(Y = 1) - P(X = 1)P(Y = 1) = \\frac{${p}}{10} + \\frac{${q}}{10} - \\frac{${p * q}}{100} = ${union.toLatex()}$, the given union.`,
          `$P(X = 1) + P(Y = 1) - P(X = 1)P(Y = 1) = \\frac{${p}}{10} + \\frac{${q}}{10} - \\frac{${p * q}}{100} = ${union.toLatex()}$，正是给定的并的概率。`,
        ),
      ),
    });
  },
};

const covarianceOfCombinations: KnowledgePointDef = {
  id: "the-covariance-of-linear-combinations",
  title: t("The covariance of linear combinations", "线性组合的协方差"),
  explanation: t(
    "Covariance is linear in each argument, and adding a constant has no effect on it. So $\\operatorname{Cov}(aX + b, cY + d) = ac\\operatorname{Cov}(X, Y)$, and $\\operatorname{Cov}(aX + bY, X) = a\\operatorname{Var}(X) + b\\operatorname{Cov}(X, Y)$, since the covariance of a variable with itself is its variance. With $\\operatorname{Cov}(X, Y) = 10$, $\\operatorname{Cov}(5X + 100, -7Y + 3) = 5 \\cdot (-7) \\cdot 10 = -350$. With $\\operatorname{Var}(X) = 20$ as well, $\\operatorname{Cov}(3X - 6Y, X) = 3 \\cdot 20 - 6 \\cdot 10 = 0$.\n\n> **Watch out.** The constants $b$ and $d$ drop out entirely; they are not coefficients. And $\\operatorname{Cov}(aX, X) = a\\operatorname{Var}(X)$, with $a$ not squared: only $\\operatorname{Var}(aX)$ squares it.",
    "协方差对每个变量都是线性的，加常数不影响它。所以 $\\operatorname{Cov}(aX + b, cY + d) = ac\\operatorname{Cov}(X, Y)$，$\\operatorname{Cov}(aX + bY, X) = a\\operatorname{Var}(X) + b\\operatorname{Cov}(X, Y)$，因为变量与自身的协方差就是方差。若 $\\operatorname{Cov}(X, Y) = 10$，则 $\\operatorname{Cov}(5X + 100, -7Y + 3) = 5 \\cdot (-7) \\cdot 10 = -350$。再设 $\\operatorname{Var}(X) = 20$，则 $\\operatorname{Cov}(3X - 6Y, X) = 3 \\cdot 20 - 6 \\cdot 10 = 0$。\n\n> **注意。** 常数 $b$ 和 $d$ 完全消失；它们不是系数。$\\operatorname{Cov}(aX, X) = a\\operatorname{Var}(X)$，$a$ 不平方：只有 $\\operatorname{Var}(aX)$ 才会平方。",
  ),
  generate(rng) {
    const a = nonzero(rng, 4);
    const b = nonzero(rng, 5);
    const cov = nonzero(rng, 6);
    const variance = rng.int(1, 9);
    const once = <T extends { readonly value: number | Q }>(list: readonly T[]) =>
      list.filter((x, i, all) => all.findIndex((y) => y.value === x.value) === i);
    if (rng.int(0, 1) === 0) {
      const c = nonzero(rng, 4);
      const d = nonzero(rng, 5);
      const answer = a * c * cov;
      const left = poly([a, "X"], [b, ""]);
      const right = poly([c, "Y"], [d, ""]);
      const factors = [a, c, cov].filter((f) => f !== 1).map(inParens);
      const product = factors.length === 0 ? "1" : factors.join(" \\cdot ");
      const coefficients = [a, c].filter((f) => f !== 1).map(inParens);
      const shown = factors.length > 1 ? `${product} = ${answer}` : `${answer}`;
      return numberProblem({
        prompt: t(
          `$\\operatorname{Cov}(X, Y) = ${cov}$. Find $\\operatorname{Cov}(${left}, ${right})$.`,
          `$\\operatorname{Cov}(X, Y) = ${cov}$。求 $\\operatorname{Cov}(${left}, ${right})$。`,
        ),
        answer,
        form: "integer",
        mistakes: once([
          why(
            answer + b * d,
            "That adds the product of the constants; constants do not change a covariance.",
            "那是加上了常数之积；常数不改变协方差。",
          ),
          why(cov, "That leaves out the coefficients of $X$ and $Y$.", "那漏掉了 $X$ 和 $Y$ 的系数。"),
          why((a + b) * (c + d) * cov, "That treats the constants as part of the coefficients.", "那是把常数当成了系数的一部分。"),
        ]),
        solution: walked(
          [
            [
              ["Drop the constants", "去掉常数"],
              t(
                `Adding a constant does not change a covariance, so $\\operatorname{Cov}(${left}, ${right}) = \\operatorname{Cov}(${poly([a, "X"])}, ${poly([c, "Y"])})$.`,
                `加常数不改变协方差，所以 $\\operatorname{Cov}(${left}, ${right}) = \\operatorname{Cov}(${poly([a, "X"])}, ${poly([c, "Y"])})$。`,
              ),
            ],
            [
              ["Bring out the coefficients", "提出系数"],
              t(
                `$\\operatorname{Cov}(${poly([a, "X"])}, ${poly([c, "Y"])}) = ${shown}$.`,
                `$\\operatorname{Cov}(${poly([a, "X"])}, ${poly([c, "Y"])}) = ${shown}$。`,
              ),
            ],
          ],
          t(
            coefficients.length === 0
              ? `Both coefficients are $1$, so the covariance is $\\operatorname{Cov}(X, Y) = ${cov}$ itself.`
              : `Dividing by the product of the coefficients, $${answer} \\div ${inParens(a * c)} = ${cov}$, gives back $\\operatorname{Cov}(X, Y)$.`,
            coefficients.length === 0
              ? `两个系数都是 $1$，所以协方差就是 $\\operatorname{Cov}(X, Y) = ${cov}$。`
              : `除以系数之积 $${answer} \\div ${inParens(a * c)} = ${cov}$，还原出 $\\operatorname{Cov}(X, Y)$。`,
          ),
        ),
      });
    }
    const combination = poly([a, "X"], [b, "Y"]);
    const answer = a * variance + b * cov;
    const first = a * variance;
    const second = b * cov;
    const split = `${poly([a, "\\operatorname{Cov}(X, X)"])} ${b < 0 ? "-" : "+"} ${poly([Math.abs(b), "\\operatorname{Cov}(Y, X)"])}`;
    const numbers = `${first} ${second < 0 ? "-" : "+"} ${Math.abs(second)}`;
    return numberProblem({
      prompt: t(
        `$\\operatorname{Var}(X) = ${variance}$ and $\\operatorname{Cov}(X, Y) = ${cov}$. Find $\\operatorname{Cov}(${combination}, X)$.`,
        `$\\operatorname{Var}(X) = ${variance}$，$\\operatorname{Cov}(X, Y) = ${cov}$。求 $\\operatorname{Cov}(${combination}, X)$。`,
      ),
      answer,
      form: "integer",
      mistakes: once([
        why(
          b * cov,
          "That leaves out $\\operatorname{Cov}(X, X) = \\operatorname{Var}(X)$.",
          "那漏掉了 $\\operatorname{Cov}(X, X) = \\operatorname{Var}(X)$。",
        ),
        why(
          (a + b) * cov,
          "That uses $\\operatorname{Cov}(X, Y)$ for $\\operatorname{Cov}(X, X)$; the covariance of $X$ with itself is its variance.",
          "那是把 $\\operatorname{Cov}(X, Y)$ 当成了 $\\operatorname{Cov}(X, X)$；$X$ 与自身的协方差是它的方差。",
        ),
        why(
          a * a * variance + b * cov,
          "That squares the coefficient of $X$; covariance is linear, and only a variance squares a coefficient.",
          "那是把 $X$ 的系数平方了；协方差是线性的，只有方差才把系数平方。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Split the first argument", "拆开第一个变量"],
            t(`$\\operatorname{Cov}(${combination}, X) = ${split}$.`, `$\\operatorname{Cov}(${combination}, X) = ${split}$。`),
          ],
          [
            ["Substitute", "代入"],
            t(
              `$\\operatorname{Cov}(X, X) = \\operatorname{Var}(X) = ${variance}$, so the covariance is $${numbers} = ${answer}$.`,
              `$\\operatorname{Cov}(X, X) = \\operatorname{Var}(X) = ${variance}$，所以协方差为 $${numbers} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Splitting the second argument of $\\operatorname{Cov}(X, ${combination})$ instead gives the same $${numbers} = ${answer}$, since covariance is symmetric.`,
          `改为拆开 $\\operatorname{Cov}(X, ${combination})$ 的第二个变量，得到同样的 $${numbers} = ${answer}$，因为协方差是对称的。`,
        ),
      ),
    });
  },
};

const largestVarianceOfASum: KnowledgePointDef = {
  id: "the-largest-possible-variance-of-a-sum",
  title: t("The largest possible variance of a sum", "和的方差的最大可能值"),
  explanation: t(
    "A correlation lies between $-1$ and $1$, so $|\\operatorname{Cov}(X, Y)| \\le \\sigma_X\\sigma_Y$. In $\\operatorname{Var}(X + Y) = \\sigma_X^2 + \\sigma_Y^2 + 2\\operatorname{Cov}(X, Y)$, the largest value comes at correlation $1$ and is $(\\sigma_X + \\sigma_Y)^2$. The smallest comes at $-1$ and is $(\\sigma_X - \\sigma_Y)^2$. With $\\operatorname{Var}(X) = 100$ and $\\operatorname{Var}(Y) = 400$, the standard deviations are $10$ and $20$, so $\\operatorname{Var}(X + Y)$ lies between $(20 - 10)^2 = 100$ and $(10 + 20)^2 = 900$.\n\n> **Watch out.** The extremes come at correlation $\\pm 1$, not at $0$, which gives only $\\sigma_X^2 + \\sigma_Y^2$. And the covariance term carries a factor $2$.",
    "相关系数在 $-1$ 和 $1$ 之间，所以 $|\\operatorname{Cov}(X, Y)| \\le \\sigma_X\\sigma_Y$。在 $\\operatorname{Var}(X + Y) = \\sigma_X^2 + \\sigma_Y^2 + 2\\operatorname{Cov}(X, Y)$ 中，相关系数为 $1$ 时取最大值 $(\\sigma_X + \\sigma_Y)^2$，为 $-1$ 时取最小值 $(\\sigma_X - \\sigma_Y)^2$。若 $\\operatorname{Var}(X) = 100$，$\\operatorname{Var}(Y) = 400$，标准差为 $10$ 和 $20$，所以 $\\operatorname{Var}(X + Y)$ 介于 $(20 - 10)^2 = 100$ 与 $(10 + 20)^2 = 900$ 之间。\n\n> **注意。** 极值在相关系数为 $\\pm 1$ 时取得，而不是 $0$；相关系数为 $0$ 只得到 $\\sigma_X^2 + \\sigma_Y^2$。协方差项还带有因子 $2$。",
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
      mistakes: apart(answer, [
        why(
          s * s + u * u,
          "That takes correlation $0$; the extreme comes at correlation $\\pm 1$.",
          "那是取相关系数为 $0$；极值在相关系数为 $\\pm 1$ 时取得。",
        ),
        largest
          ? why((s - u) ** 2, "That is the smallest possible value, at correlation $-1$.", "那是最小可能值，在相关系数为 $-1$ 时取得。")
          : why((s + u) ** 2, "That is the largest possible value, at correlation $1$.", "那是最大可能值，在相关系数为 $1$ 时取得。"),
        largest
          ? why(
              s * s + u * u + s * u,
              "That counts the covariance $\\sigma_X\\sigma_Y$ once; it enters $\\operatorname{Var}(X + Y)$ twice.",
              "那只计了一次协方差 $\\sigma_X\\sigma_Y$；它在 $\\operatorname{Var}(X + Y)$ 中出现两次。",
            )
          : why(
              s * s + u * u - s * u,
              "That counts the covariance $-\\sigma_X\\sigma_Y$ once; it enters $\\operatorname{Var}(X + Y)$ twice.",
              "那只计了一次协方差 $-\\sigma_X\\sigma_Y$；它在 $\\operatorname{Var}(X + Y)$ 中出现两次。",
            ),
      ]),
      solution: walked(
        [
          [
            ["Bound the covariance", "确定协方差的界"],
            t(
              `The standard deviations are $${s}$ and $${u}$, so $\\operatorname{Cov}(X, Y)$ lies between $-${s * u}$ and $${s * u}$; the ${largest ? "largest" : "smallest"} value comes at correlation $${largest ? 1 : -1}$.`,
              `标准差为 $${s}$ 和 $${u}$，所以 $\\operatorname{Cov}(X, Y)$ 介于 $-${s * u}$ 与 $${s * u}$ 之间；${largest ? "最大" : "最小"}值在相关系数为 $${largest ? 1 : -1}$ 时取得。`,
            ),
          ],
          [
            ["Substitute", "代入"],
            t(
              `$\\operatorname{Var}(X + Y) = ${s * s} + ${u * u} ${largest ? "+" : "-"} 2(${s})(${u}) = ${answer}$.`,
              `$\\operatorname{Var}(X + Y) = ${s * s} + ${u * u} ${largest ? "+" : "-"} 2(${s})(${u}) = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$(${s} ${largest ? "+" : "-"} ${u})^2 = ${answer}$, the square of the ${largest ? "sum" : "difference"} of the standard deviations.`,
          `$(${s} ${largest ? "+" : "-"} ${u})^2 = ${answer}$，正是两个标准差之${largest ? "和" : "差"}的平方。`,
        ),
      ),
    });
  },
};

const lawOfTotalVariance: KnowledgePointDef = {
  id: "the-law-of-total-variance",
  title: t("The law of total variance", "全方差公式"),
  explanation: t(
    "The spread of $Y$ has two sources: the spread inside each group and the differences between group means. The law of total variance adds them: $\\operatorname{Var}(Y) = E[\\operatorname{Var}(Y \\mid X)] + \\operatorname{Var}(E[Y \\mid X])$. Averaging the group variances alone leaves out the second part. If half the time $Y$ has mean $10$ and variance $4$, and otherwise mean $30$ and variance $16$, then $E[\\operatorname{Var}(Y \\mid X)] = 10$ and the means vary by $0.5 \\cdot 0.5 \\cdot 20^2 = 100$, so $\\operatorname{Var}(Y) = 110$.\n\n> **Watch out.** Weight the group variances by the group probabilities, and do not forget the spread of the group means; for two groups it is $p(1 - p)$ times the squared gap.",
    "$Y$ 的分散有两个来源：各组内部的分散和各组均值之间的差异。全方差公式把它们相加：$\\operatorname{Var}(Y) = E[\\operatorname{Var}(Y \\mid X)] + \\operatorname{Var}(E[Y \\mid X])$。只对组内方差取平均，就漏掉了第二部分。若一半时间 $Y$ 的均值为 $10$、方差为 $4$，其余时间均值为 $30$、方差为 $16$，则 $E[\\operatorname{Var}(Y \\mid X)] = 10$，均值的方差为 $0.5 \\cdot 0.5 \\cdot 20^2 = 100$，所以 $\\operatorname{Var}(Y) = 110$。\n\n> **注意。** 组内方差要按各组的概率加权，并且不要忘记组均值的分散；两组时它等于 $p(1 - p)$ 乘以均值差的平方。",
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
    const squares = w.mul(Q.of(v1 + m1 * m1)).add(rest.mul(Q.of(v0 + m0 * m0)));
    const mean = w.mul(Q.of(m1)).add(rest.mul(Q.of(m0)));
    return numberProblem({
      prompt: t(
        `$P(X = 1) = ${tenths(p)}$ and $P(X = 0) = ${tenths(10 - p)}$. Given $X = 0$, $Y$ has mean $${m0}$ and variance $${v0}$. Given $X = 1$, $Y$ has mean $${m1}$ and variance $${v1}$. Find $\\operatorname{Var}(Y)$.`,
        `$P(X = 1) = ${tenths(p)}$，$P(X = 0) = ${tenths(10 - p)}$。当 $X = 0$ 时，$Y$ 的均值为 $${m0}$，方差为 $${v0}$；当 $X = 1$ 时，$Y$ 的均值为 $${m1}$，方差为 $${v1}$。求 $\\operatorname{Var}(Y)$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          within,
          "That is only the average of the conditional variances; the spread of the means is missing.",
          "那只是条件方差的平均；漏掉了均值的分散。",
        ),
        why(
          between,
          "That is only the variance of the conditional means; the spread inside each group is missing.",
          "那只是条件均值的方差；漏掉了各组内部的分散。",
        ),
        why(
          Q.of(v0 + v1, 2),
          "That averages the two variances equally, ignoring the probabilities and the means.",
          "那是把两个方差平均，忽略了概率和均值。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Average the variances", "平均条件方差"],
            t(
              `$E[\\operatorname{Var}(Y \\mid X)] = ${v1 === 1 ? tenths(p) : `${tenths(p)} \\cdot ${v1}`} + ${v0 === 1 ? tenths(10 - p) : `${tenths(10 - p)} \\cdot ${v0}`} = ${within.toLatex()}$.`,
              `$E[\\operatorname{Var}(Y \\mid X)] = ${v1 === 1 ? tenths(p) : `${tenths(p)} \\cdot ${v1}`} + ${v0 === 1 ? tenths(10 - p) : `${tenths(10 - p)} \\cdot ${v0}`} = ${within.toLatex()}$。`,
            ),
          ],
          [
            ["Find the variance of the means", "求均值的方差"],
            t(
              `The conditional means differ by $${m1 - m0}$, so $\\operatorname{Var}(E[Y \\mid X]) = ${tenths(p)} \\cdot ${tenths(10 - p)}${m1 - m0 === 1 ? "" : ` \\cdot ${(m1 - m0) ** 2}`} = ${between.toLatex()}$.`,
              `条件均值相差 $${m1 - m0}$，所以 $\\operatorname{Var}(E[Y \\mid X]) = ${tenths(p)} \\cdot ${tenths(10 - p)}${m1 - m0 === 1 ? "" : ` \\cdot ${(m1 - m0) ** 2}`} = ${between.toLatex()}$。`,
            ),
          ],
          [
            ["Add", "相加"],
            t(
              `$\\operatorname{Var}(Y) = ${within.toLatex()} + ${between.toLatex()} = ${answer.toLatex()}$.`,
              `$\\operatorname{Var}(Y) = ${within.toLatex()} + ${between.toLatex()} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `Directly, $E[Y^2] = ${tenths(p)}(${v1} + ${m1 * m1}) + ${tenths(10 - p)}(${v0} + ${m0 * m0}) = ${squares.toLatex()}$ and $E[Y] = ${mean.toLatex()}$, so $E[Y^2] - E[Y]^2 = ${answer.toLatex()}$.`,
          `直接计算，$E[Y^2] = ${tenths(p)}(${v1} + ${m1 * m1}) + ${tenths(10 - p)}(${v0} + ${m0 * m0}) = ${squares.toLatex()}$，$E[Y] = ${mean.toLatex()}$，所以 $E[Y^2] - E[Y]^2 = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
};

const mleOfNormalVariance: KnowledgePointDef = {
  id: "the-mle-of-a-normal-variance",
  title: t("The MLE of a normal variance", "正态方差的最大似然估计"),
  explanation: t(
    "Maximizing the normal likelihood gives $\\hat{\\mu} = \\bar{x}$ and $\\hat{\\sigma}^2 = \\frac{1}{n}\\sum(x_i - \\bar{x})^2$. The divisor is $n$, not the $n - 1$ of the sample variance, so the maximum likelihood estimate is slightly biased low.\n\nFor the sample $2, 4, 6, 8$: $\\bar{x} = 5$, the deviations are $-3, -1, 1, 3$, their squares add up to $20$, and $\\hat{\\sigma}^2 = \\frac{20}{4} = 5$.\n\nCheck: the sample variance is $\\frac{20}{3}$, and the estimate is $\\frac{n - 1}{n} = \\frac{3}{4}$ of it, $\\frac{3}{4} \\cdot \\frac{20}{3} = 5$.\n\n> **Watch out.** $\\frac{20}{3}$ is the unbiased sample variance, not the maximum likelihood estimate: the likelihood is maximized by dividing by $n = 4$.",
    "使正态似然最大，得 $\\hat{\\mu} = \\bar{x}$，$\\hat{\\sigma}^2 = \\frac{1}{n}\\sum(x_i - \\bar{x})^2$。除数是 $n$，而不是样本方差的 $n - 1$，所以最大似然估计略微偏低。\n\n例如样本 $2, 4, 6, 8$：$\\bar{x} = 5$，离均差为 $-3, -1, 1, 3$，平方和为 $20$，$\\hat{\\sigma}^2 = \\frac{20}{4} = 5$。\n\n检验：样本方差为 $\\frac{20}{3}$，估计值是它的 $\\frac{n - 1}{n} = \\frac{3}{4}$，$\\frac{3}{4} \\cdot \\frac{20}{3} = 5$。\n\n> **注意。** $\\frac{20}{3}$ 是无偏样本方差，不是最大似然估计：似然在除以 $n = 4$ 时最大。",
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
      mistakes: distinctMistakes(answer, [
        why(
          Q.of(squares, n - 1),
          `This divides by $n - 1 = ${n - 1}$, giving the unbiased sample variance; the likelihood is maximized by dividing by $n = ${n}$.`,
          `这除以了 $n - 1 = ${n - 1}$，得到的是无偏样本方差；似然在除以 $n = ${n}$ 时最大。`,
        ),
        why(squares, "This is the sum of squared deviations, not yet divided by $n$.", "这是离差平方和，还没有除以 $n$。"),
        why(mean, "This is the estimate of the mean $\\mu$, not of the variance.", "这是均值 $\\mu$ 的估计，不是方差的估计。"),
      ]),
      solution: walked(
        [
          [
            ["Estimate the mean", "估计均值"],
            t(
              `$\\hat{\\mu} = \\bar{x} = \\frac{${total}}{${n}} = ${mean}$.`,
              `$\\hat{\\mu} = \\bar{x} = \\frac{${total}}{${n}} = ${mean}$。`,
            ),
          ],
          [
            ["Sum the squared deviations", "求离差平方和"],
            t(
              `The deviations ${data.map((x) => `$${x - mean}$`).join(", ")} have squares adding up to $${squares}$.`,
              `离均差 ${data.map((x) => `$${x - mean}$`).join("，")} 的平方和为 $${squares}$。`,
            ),
          ],
          [
            ["Divide by n", "除以 n"],
            t(
              `$\\hat{\\sigma}^2 = \\frac{${squares}}{${n}}${lowestTerms(squares, n)}$.`,
              `$\\hat{\\sigma}^2 = \\frac{${squares}}{${n}}${lowestTerms(squares, n)}$。`,
            ),
          ],
        ],
        t(
          `The sample variance is $\\frac{${squares}}{${n - 1}}${lowestTerms(squares, n - 1)}$, and $\\frac{${n - 1}}{${n}}$ of it is $${answer.toLatex()}$, slightly less, as the maximum likelihood estimate should be.`,
          `样本方差为 $\\frac{${squares}}{${n - 1}}${lowestTerms(squares, n - 1)}$，它的 $\\frac{${n - 1}}{${n}}$ 是 $${answer.toLatex()}$，略小一些，正如最大似然估计应有的那样。`,
        ),
      ),
    });
  },
};

const marginAndSampleSize: KnowledgePointDef = {
  id: "how-the-margin-of-error-depends-on-the-sample-size",
  title: t("How the margin of error depends on the sample size", "误差范围如何随样本量变化"),
  explanation: t(
    "The margin of error is proportional to $\\frac{1}{\\sqrt{n}}$. To divide the margin by $k$, the sample size must be multiplied by $k^2$. So halving a margin of error takes four times the data, and precision becomes expensive quickly.\n\nA sample of $25$ gives a margin of $6$. A margin of $2$ is a third as large, so the sample must grow by $3^{2} = 9$, to $225$.\n\nCheck: $6 \\cdot \\sqrt{\\frac{25}{225}} = 6 \\cdot \\frac{1}{3} = 2$, the target margin.\n\n> **Watch out.** Tripling the sample to $75$ is not enough: the margin becomes $\\frac{6}{\\sqrt{3}} \\approx 3.46$, because it shrinks with $\\sqrt{n}$, not with $n$.",
    "误差范围与 $\\frac{1}{\\sqrt{n}}$ 成正比。要把误差范围除以 $k$，样本量必须乘以 $k^2$。所以把误差范围减半需要四倍的数据，精度的代价上升得很快。\n\n容量为 $25$ 的样本误差范围为 $6$。误差范围 $2$ 是它的三分之一，所以样本量要乘以 $3^{2} = 9$，即 $225$。\n\n检验：$6 \\cdot \\sqrt{\\frac{25}{225}} = 6 \\cdot \\frac{1}{3} = 2$，正是目标误差范围。\n\n> **注意。** 把样本量扩大三倍到 $75$ 不够：误差范围变为 $\\frac{6}{\\sqrt{3}} \\approx 3.46$，因为它随 $\\sqrt{n}$ 而不是 $n$ 缩小。",
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
      mistakes: distinctMistakes(answer, [
        why(
          n * k,
          `This multiplies the sample by $${k}$, which only divides the margin by $\\sqrt{${k}}$.`,
          `这把样本量乘以 $${k}$，误差范围只除以 $\\sqrt{${k}}$。`,
        ),
        why(
          n + k * k,
          `This adds $${k}^{2}$ to the sample; the factor $${k}^{2}$ multiplies $n$.`,
          `这把 $${k}^{2}$ 加到样本量上；因子 $${k}^{2}$ 应乘以 $n$。`,
        ),
        why(
          Math.round(n * Math.sqrt(k)),
          `This multiplies by $\\sqrt{${k}}$; it is the margin that scales with $\\frac{1}{\\sqrt{n}}$, so $n$ scales with $${k}^{2}$.`,
          `这乘以了 $\\sqrt{${k}}$；是误差范围与 $\\frac{1}{\\sqrt{n}}$ 成正比，所以 $n$ 要乘以 $${k}^{2}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the factor", "求缩小倍数"],
            t(
              `The margin goes from $${E}$ to $${E / k}$, a factor of $${k}$ smaller.`,
              `误差范围从 $${E}$ 变为 $${E / k}$，缩小为 $\\frac{1}{${k}}$。`,
            ),
          ],
          [
            ["Square it", "平方"],
            t(
              `Since the margin varies as $\\frac{1}{\\sqrt{n}}$, the sample grows by $${k}^{2} = ${k * k}$, to $${n} \\cdot ${k * k} = ${answer}$.`,
              `由于误差范围与 $\\frac{1}{\\sqrt{n}}$ 成正比，样本量要乘以 $${k}^{2} = ${k * k}$，得 $${n} \\cdot ${k * k} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$${E} \\cdot \\sqrt{\\frac{${n}}{${answer}}} = ${E} \\cdot \\frac{1}{${k}} = ${E / k}$, the target margin.`,
          `$${E} \\cdot \\sqrt{\\frac{${n}}{${answer}}} = ${E} \\cdot \\frac{1}{${k}} = ${E / k}$，正是目标误差范围。`,
        ),
      ),
    });
  },
};

const anovaDegreesOfFreedom: KnowledgePointDef = {
  id: "the-degrees-of-freedom-of-an-anova-f-statistic",
  title: t("The degrees of freedom of an ANOVA $F$ statistic", "方差分析 $F$ 统计量的自由度"),
  explanation: t(
    "With $k$ groups and $N$ observations in all, the numerator of $F$ has $k - 1$ degrees of freedom because the group means are compared to one overall mean. The denominator has $N - k$, because each group loses one degree of freedom to its own mean. Two groups of $25$ and $30$ give $N = 55$, so the numerator has $1$ degree of freedom and the denominator $55 - 2 = 53$.\n\n> **Watch out.** The denominator subtracts the number of groups, $N - k$, not one: $N - 1$ is the total degrees of freedom.",
    "有 $k$ 组、共 $N$ 个观测时，$F$ 的分子有 $k - 1$ 个自由度，因为各组均值要与一个总均值比较；分母有 $N - k$ 个自由度，因为每组都因自身的均值失去一个自由度。$25$ 与 $30$ 的两组给出 $N = 55$，所以分子有 $1$ 个自由度，分母有 $55 - 2 = 53$ 个。\n\n> **注意。** 分母减去的是组数，即 $N - k$，而不是一：$N - 1$ 是总自由度。",
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
      mistakes: apart(answer, [
        why(
          total - 1,
          "That is $N - 1$, the total degrees of freedom; subtract the number of groups.",
          "那是总自由度 $N - 1$；应减去组数。",
        ),
        why(k - 1, "That is $k - 1$, the numerator's degrees of freedom.", "那是分子的自由度 $k - 1$。"),
        why(
          total,
          "That is $N$ itself; each group loses one degree of freedom to its mean.",
          "那是 $N$ 本身；每组都因自身的均值失去一个自由度。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Count the observations", "数观测个数"],
            t(`$N = ${sizes.join(" + ")} = ${total}$.`, `$N = ${sizes.join(" + ")} = ${total}$。`),
          ],
          [
            ["Subtract one for each group", "每组减去一"],
            t(`$N - k = ${total} - ${k} = ${answer}$.`, `$N - k = ${total} - ${k} = ${answer}$。`),
          ],
        ],
        t(
          `With the numerator's $${k - 1}$, the total is $${k - 1} + ${answer} = ${total - 1} = N - 1$.`,
          `加上分子的 $${k - 1}$，合计 $${k - 1} + ${answer} = ${total - 1} = N - 1$。`,
        ),
      ),
    });
  },
};

const slopeFromCorrelation: KnowledgePointDef = {
  id: "the-regression-slope-from-the-correlation",
  title: t("The regression slope from the correlation", "由相关系数求回归斜率"),
  explanation: t(
    "The slope of the regression line of $y$ on $x$ is $b = r\\frac{s_y}{s_x}$. It has the sign of the correlation, and the ratio converts one standard deviation of $x$ into units of $y$. Regressing $x$ on $y$ uses the inverse ratio and gives a different line.\n\nIf $r = 0.6$, $s_x = 4$ and $s_y = 10$, then $b = 0.6 \\cdot \\frac{10}{4} = 1.5$.\n\nCheck: a change of one standard deviation in $x$, $4$, predicts a change of $1.5 \\cdot 4 = 6$ in $y$, which is $r = 0.6$ of one standard deviation of $y$, $10$.\n\n> **Watch out.** The standard deviation of $y$ goes on top: $r\\frac{s_x}{s_y} = 0.24$ is the wrong ratio, and $r$ alone is the slope only when the two standard deviations are equal.",
    "$y$ 对 $x$ 的回归直线斜率是 $b = r\\frac{s_y}{s_x}$。它与相关系数同号，比值把 $x$ 的一个标准差换算成 $y$ 的单位。$x$ 对 $y$ 的回归用的是相反的比值，得到另一条直线。\n\n若 $r = 0.6$，$s_x = 4$，$s_y = 10$，则 $b = 0.6 \\cdot \\frac{10}{4} = 1.5$。\n\n检验：$x$ 变化一个标准差 $4$，预测 $y$ 变化 $1.5 \\cdot 4 = 6$，正是 $y$ 的一个标准差 $10$ 的 $r = 0.6$ 倍。\n\n> **注意。** $y$ 的标准差在分子上：$r\\frac{s_x}{s_y} = 0.24$ 是错误的比值；只有两个标准差相等时，斜率才等于 $r$。",
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
      mistakes: [
        why(
          Q.of(r * sx, 10 * sy),
          "This uses the inverse ratio $\\frac{s_x}{s_y}$, which belongs to the regression of $x$ on $y$.",
          "这用了相反的比值 $\\frac{s_x}{s_y}$，那是 $x$ 对 $y$ 的回归。",
        ),
        why(
          Q.of(r, 10),
          "This is the correlation alone; multiply it by $\\frac{s_y}{s_x}$.",
          "这只是相关系数；还要乘以 $\\frac{s_y}{s_x}$。",
        ),
        why(
          Q.of(sy, sx),
          "This is the ratio $\\frac{s_y}{s_x}$ alone; multiply it by $r$.",
          "这只是比值 $\\frac{s_y}{s_x}$；还要乘以 $r$。",
        ),
      ],
      solution: t(
        `**Step 1: Form the ratio of the standard deviations, $y$ over $x$.** $\\frac{s_y}{s_x} = \\frac{${sy}}{${sx}}$.\n\n**Step 2: Multiply by the correlation.**${steps(`b = r\\frac{s_y}{s_x} = ${rText} \\cdot \\frac{${sy}}{${sx}} = ${answer.toLatex()}`)}**Check.** Solving back for the correlation:${steps(`b\\frac{s_x}{s_y} = ${answer.toLatex()} \\cdot \\frac{${sx}}{${sy}} = ${Q.of(r, 10).toLatex()} = ${rText}`)}The slope has the sign of $r$, as it should.`,
        `**第一步：求标准差之比，$y$ 比 $x$。**$\\frac{s_y}{s_x} = \\frac{${sy}}{${sx}}$。\n\n**第二步：乘以相关系数。**${steps(`b = r\\frac{s_y}{s_x} = ${rText} \\cdot \\frac{${sy}}{${sx}} = ${answer.toLatex()}`)}**检验。**反过来求相关系数：${steps(`b\\frac{s_x}{s_y} = ${answer.toLatex()} \\cdot \\frac{${sx}}{${sy}} = ${Q.of(r, 10).toLatex()} = ${rText}`)}斜率与 $r$ 同号，符合要求。`,
      ),
    });
  },
};

const residualSumFromCorrelation: KnowledgePointDef = {
  id: "the-sum-of-squared-residuals-from-the-correlation",
  title: t("The sum of squared residuals from the correlation", "由相关系数求残差平方和"),
  explanation: t(
    "The share of the total variation in $y$ that a regression line explains is $r^2$. The rest is left in the residuals, so $\\sum(y_i - \\hat{y}_i)^2 = (1 - r^2)\\sum(y_i - \\bar{y})^2$. The sign of $r$ makes no difference to the size of the residuals.\n\nIf $r = -0.8$ and $\\sum(y_i - \\bar{y})^2 = 50$, then $r^2 = 0.64$ and the squared residuals add up to $0.36 \\cdot 50 = 18$.\n\nCheck: the explained part is $0.64 \\cdot 50 = 32$, and $32 + 18 = 50$.\n\n> **Watch out.** Square $r$ first: $1 - 0.8 = 0.2$ is not the unexplained share. And $r^2$ is the share explained, not the share left in the residuals.",
    "回归直线解释了 $y$ 总变异中 $r^2$ 的比例，其余部分留在残差中，所以 $\\sum(y_i - \\hat{y}_i)^2 = (1 - r^2)\\sum(y_i - \\bar{y})^2$。$r$ 的符号不影响残差的大小。\n\n若 $r = -0.8$，$\\sum(y_i - \\bar{y})^2 = 50$，则 $r^2 = 0.64$，残差平方和为 $0.36 \\cdot 50 = 18$。\n\n检验：被解释的部分为 $0.64 \\cdot 50 = 32$，而 $32 + 18 = 50$。\n\n> **注意。** 要先把 $r$ 平方：$1 - 0.8 = 0.2$ 不是未被解释的比例。另外 $r^2$ 是被解释的比例，不是留在残差中的比例。",
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
      mistakes: [
        why(
          Q.of(total * r * r, 100),
          "This is the explained part, $r^2$ of the total; the residuals hold the rest, $1 - r^2$.",
          "这是被解释的部分，即总量的 $r^2$；残差中留下的是其余的 $1 - r^2$。",
        ),
        why(
          Q.of(total * (10 - Math.abs(r)), 10),
          "This uses $1 - |r|$; the explained share is $r^2$, so the rest is $1 - r^2$.",
          "这用了 $1 - |r|$；被解释的比例是 $r^2$，所以其余是 $1 - r^2$。",
        ),
        why(
          Q.of(total * Math.abs(r), 10),
          "This multiplies the total by $|r|$; the residual share is $1 - r^2$.",
          "这用总量乘以 $|r|$；残差所占的比例是 $1 - r^2$。",
        ),
      ],
      solution: t(
        `**Step 1: Square the correlation.** $r^2 = ${Q.of(r * r, 100).toLatex()}$ of the variation is explained, so $1 - r^2 = ${Q.of(100 - r * r, 100).toLatex()}$ is left in the residuals.\n\n**Step 2: Take that share of the total.**${steps(`\\sum(y_i - \\hat{y}_i)^2 = ${Q.of(100 - r * r, 100).toLatex()} \\cdot ${total} = ${answer.toLatex()}`)}**Check.** The explained part is $${Q.of(r * r, 100).toLatex()} \\cdot ${total} = ${Q.of(total * r * r, 100).toLatex()}$, and the two parts add up to the total: $${Q.of(total * r * r, 100).toLatex()} + ${answer.toLatex()} = ${total}$.`,
        `**第一步：把相关系数平方。**$r^2 = ${Q.of(r * r, 100).toLatex()}$ 的变异被解释了，所以 $1 - r^2 = ${Q.of(100 - r * r, 100).toLatex()}$ 留在残差中。\n\n**第二步：取总量的这一比例。**${steps(`\\sum(y_i - \\hat{y}_i)^2 = ${Q.of(100 - r * r, 100).toLatex()} \\cdot ${total} = ${answer.toLatex()}`)}**检验。**被解释的部分为 $${Q.of(r * r, 100).toLatex()} \\cdot ${total} = ${Q.of(total * r * r, 100).toLatex()}$，两部分相加等于总量：$${Q.of(total * r * r, 100).toLatex()} + ${answer.toLatex()} = ${total}$。`,
      ),
    });
  },
};

const chiSquareDegrees: KnowledgePointDef = {
  id: "the-degrees-of-freedom-of-a-test-of-independence",
  title: t("The degrees of freedom of a test of independence", "独立性检验的自由度"),
  explanation: t(
    "In a table with $r$ rows and $c$ columns, the totals of the rows and columns are fixed. Once $(r - 1)(c - 1)$ cells are filled in, those totals determine all the others, so a chi-square test of independence has this many degrees of freedom.\n\nA table with $3$ rows and $4$ columns has $12$ cells. Fill in the first $2$ rows of the first $3$ columns, $6$ cells; the row totals then give the last column and the column totals give the last row, so $\\nu = (3 - 1)(4 - 1) = 6$.\n\nCheck: the cells fixed by the totals are the last row and the last column, $4 + 3 - 1 = 6$ of them, and $6 + 6 = 12$ accounts for every cell.\n\n> **Watch out.** A table is not a list of $rc$ categories: $12 - 1 = 11$ is the count for a goodness of fit test with $12$ classes, and it ignores that every row total and every column total is fixed.",
    "在 $r$ 行 $c$ 列的表中，各行各列的合计是固定的。填好 $(r - 1)(c - 1)$ 个格子后，其余格子都由合计决定，所以独立性的卡方检验有这么多自由度。\n\n$3$ 行 $4$ 列的表有 $12$ 个格子。填好前 $3$ 列的前 $2$ 行，共 $6$ 个格子；行合计确定最后一列，列合计确定最后一行，所以 $\\nu = (3 - 1)(4 - 1) = 6$。\n\n检验：由合计确定的格子是最后一行和最后一列，共 $4 + 3 - 1 = 6$ 个，而 $6 + 6 = 12$ 正好是全部格子。\n\n> **注意。** 列联表不是 $rc$ 个类别的列表：$12 - 1 = 11$ 是 $12$ 个类别的拟合优度检验的自由度，它忽略了每个行合计和列合计都是固定的。",
  ),
  generate(rng) {
    const rows = rng.int(2, 8);
    const columns = rng.int(2, 8);
    const answer = (rows - 1) * (columns - 1);
    const fixed = rows + columns - 1;
    return numberProblem({
      prompt: t(
        `A chi-square test of independence uses a table with ${rows} rows and ${columns} columns. How many degrees of freedom does the statistic have?`,
        `独立性的卡方检验使用一张 ${rows} 行 ${columns} 列的表。统计量有多少个自由度？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          rows * columns - 1,
          `This treats the $${rows * columns}$ cells as the classes of a goodness of fit test; here every row and column total is fixed.`,
          `这把 $${rows * columns}$ 个格子当成拟合优度检验的类别；这里每个行合计和列合计都是固定的。`,
        ),
        why(
          rows + columns - 2,
          "This adds $r - 1$ and $c - 1$; the free cells form an $(r - 1)$ by $(c - 1)$ block, so the two multiply.",
          "这把 $r - 1$ 与 $c - 1$ 相加了；自由格子组成 $(r - 1)$ 行 $(c - 1)$ 列的一块，所以两者相乘。",
        ),
        why(rows * columns, "This is the number of cells, with no restriction subtracted.", "这是格子总数，没有减去任何限制。"),
      ]),
      solution: walked(
        [
          [
            ["Find the free block", "找出自由的格子"],
            t(
              `Leave out the last row and the last column: $${rows - 1}$ rows and $${columns - 1}$ columns remain.`,
              `去掉最后一行和最后一列：剩下 $${rows - 1}$ 行 $${columns - 1}$ 列。`,
            ),
          ],
          [
            ["Multiply", "相乘"],
            t(`$\\nu = (${rows} - 1)(${columns} - 1) = ${answer}$.`, `$\\nu = (${rows} - 1)(${columns} - 1) = ${answer}$。`),
          ],
        ],
        t(
          `The totals fix the last row and column, $${columns} + ${rows} - 1 = ${fixed}$ cells, and $${answer} + ${fixed} = ${rows * columns}$ is every cell.`,
          `合计确定了最后一行和最后一列，共 $${columns} + ${rows} - 1 = ${fixed}$ 个格子，而 $${answer} + ${fixed} = ${rows * columns}$ 正是全部格子。`,
        ),
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

/** priorSolution solves p · r + (1 − p) · q = total for p, the probability of the first event, and substitutes it back. */
function priorSolution(rate: Q, other: Q, total: Q, answer: Q): Text {
  const [r, q, b, p] = [rate.toLatex(), other.toLatex(), total.toLatex(), answer.toLatex()];
  const [num, den] = [total.sub(other), rate.sub(other)];
  const [pr, pq] = [answer.mul(rate), Q.one.sub(answer).mul(other)];
  const first = stepLabel(1, "set up the equation", "列方程");
  const second = stepLabel(2, "solve for p", "解出 p");
  const equation = `p \\cdot ${r} + (1 - p) \\cdot ${q} = ${b}`;
  const solve = steps(
    `p \\cdot ${r} + ${q} - p \\cdot ${q} = ${b}`,
    `p \\left(${r} - ${q}\\right) = ${b} - ${q}`,
    `${den.toLatex()} \\, p = ${num.toLatex()}`,
    `p = ${num.toLatex()} \\div ${den.n < 0n ? `\\left(${den.toLatex()}\\right)` : den.toLatex()} = ${p}`,
  );
  return joinText([
    t(
      `${first.en} Let $p = P(A)$, so $P(A') = 1 - p$. The law of total probability adds the path through $A$ and the path through $A'$:${steps(equation)}`,
      `${first["zh-CN"]}设 $p = P(A)$，则 $P(A') = 1 - p$。全概率公式把经过 $A$ 和经过 $A'$ 的两条路径相加：${steps(equation)}`,
    ),
    t(
      `${second.en} The equation is linear in $p$. Expand, collect the terms with $p$ on the left, and divide by their coefficient:${solve}`,
      `${second["zh-CN"]}这是关于 $p$ 的一次方程。展开，把含 $p$ 的项留在左边，再除以它的系数：${solve}`,
    ),
    t(
      `**Check.** Substitute $p = ${p}$: $${p} \\cdot ${r} + ${Q.one.sub(answer).toLatex()} \\cdot ${q} = ${pr.toLatex()} + ${pq.toLatex()} = ${pr.add(pq).toLatex()}$, which is $P(B)$.`,
      `**检验。** 代入 $p = ${p}$：$${p} \\cdot ${r} + ${Q.one.sub(answer).toLatex()} \\cdot ${q} = ${pr.toLatex()} + ${pq.toLatex()} = ${pr.add(pq).toLatex()}$，正是 $P(B)$。`,
    ),
  ]);
}

const priorFromTotal: KnowledgePointDef = {
  id: "the-prior-from-a-total-probability",
  title: t("The prior from a total probability", "由全概率求先验概率"),
  explanation: t(
    "The law of total probability says $P(B) = pr + (1 - p)q$, where $p = P(A)$, $r = P(B \\mid A)$ and $q = P(B \\mid A')$. This is linear in $p$, so it can also be run backwards. If the overall rate of $B$ is known, the formula gives the size of the hidden group: expanding, $pr + q - pq = P(B)$, so $p(r - q) = P(B) - q$ and\n\n$$p = \\frac{P(B) - q}{r - q}.$$\n\nFor instance, with $r = 0.8$, $q = 0.3$ and $P(B) = 0.5$, $p = \\frac{0.5 - 0.3}{0.8 - 0.3} = \\frac{0.2}{0.5} = \\frac{2}{5}$, and indeed $\\frac{2}{5} \\cdot 0.8 + \\frac{3}{5} \\cdot 0.3 = 0.32 + 0.18 = 0.5$.\n\n> **Watch out.** The unknown $p$ appears twice, in $p$ and in $1 - p$; dividing $P(B)$ by $r$ ignores the path through $A'$. And the question asks for $P(A)$, so do not stop at $1 - p$.",
    "全概率公式说 $P(B) = pr + (1 - p)q$，其中 $p = P(A)$，$r = P(B \\mid A)$，$q = P(B \\mid A')$。它关于 $p$ 是线性的，所以也可以反过来用。如果知道 $B$ 的总体比率，公式就给出隐藏群体的大小：展开得 $pr + q - pq = P(B)$，所以 $p(r - q) = P(B) - q$，\n\n$$p = \\frac{P(B) - q}{r - q}.$$\n\n例如 $r = 0.8$，$q = 0.3$，$P(B) = 0.5$ 时，$p = \\frac{0.5 - 0.3}{0.8 - 0.3} = \\frac{0.2}{0.5} = \\frac{2}{5}$；验证：$\\frac{2}{5} \\cdot 0.8 + \\frac{3}{5} \\cdot 0.3 = 0.32 + 0.18 = 0.5$。\n\n> **注意。** 未知数 $p$ 出现了两次，在 $p$ 和 $1 - p$ 中；直接用 $P(B)$ 除以 $r$ 就漏掉了经过 $A'$ 的路径。题目求的是 $P(A)$，不要停在 $1 - p$。",
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
      solution: priorSolution(rate, other, total, answer),
    });
  },
};

const evenOddsPrior: KnowledgePointDef = {
  id: "the-prior-that-gives-even-posterior-odds",
  title: t("The prior that gives even posterior odds", "使后验概率为一半的先验"),
  explanation: t(
    "Bayes' theorem says the posterior is the true-positive weight divided by all the positive weight. The posterior is one half exactly when true positives and false positives are equally common, that is when $pr = (1 - p)q$. Solving gives $p = \\frac{q}{r + q}$. A rarer condition than this means a positive result is more likely a false alarm. For $r = 0.6$ and $q = 0.15$, $p = \\frac{0.15}{0.75} = \\frac{1}{5}$.\n\n> **Watch out.** The false-positive rate goes in the numerator: $p = \\frac{q}{r + q}$, not $\\frac{r}{r + q}$; and the denominator is the sum of the two rates, not $r$ alone.",
    "贝叶斯定理说，后验概率是真阳性的权重除以全部阳性的权重。当真阳性和假阳性同样常见，即 $pr = (1 - p)q$ 时，后验概率恰好是一半。解得 $p = \\frac{q}{r + q}$。如果情况比这更罕见，阳性结果就更可能是误报。对 $r = 0.6$，$q = 0.15$，$p = \\frac{0.15}{0.75} = \\frac{1}{5}$。\n\n> **注意。** 分子是假阳性率：$p = \\frac{q}{r + q}$，不是 $\\frac{r}{r + q}$；分母是两个比率之和，不是单独的 $r$。",
  ),
  generate(rng) {
    const q = rng.int(1, 8);
    const r = rng.int(q + 1, 9);
    const answer = Q.of(q, r + q);
    const hit = Q.of(r, 10);
    const miss = Q.of(q, 10);
    const weight = answer.mul(hit);
    return numberProblem({
      prompt: t(
        `A test has $P(+ \\mid D) = ${hit.toLatex()}$ and $P(+ \\mid D') = ${miss.toLatex()}$. For which prior $P(D)$ does a positive result give $P(D \\mid +) = \\frac{1}{2}$?`,
        `一项检测的 $P(+ \\mid D) = ${hit.toLatex()}$，$P(+ \\mid D') = ${miss.toLatex()}$。先验概率 $P(D)$ 为多少时，阳性结果给出 $P(D \\mid +) = \\frac{1}{2}$？`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(r, r + q),
          "That puts the true-positive rate in the numerator; solving $pr = (1 - p)q$ puts $q$ there.",
          "那是把真阳性率放在分子；解 $pr = (1 - p)q$ 时分子是 $q$。",
        ),
        why(
          Q.of(q, r),
          "That divides by $r$ alone; collecting the $p$ terms gives $p(r + q) = q$.",
          "那是只除以 $r$；合并 $p$ 的项得 $p(r + q) = q$。",
        ),
        why(
          Q.of(1, 2),
          "A prior of one half gives an even posterior only when the two rates are equal.",
          "只有两个比率相等时，先验为一半才给出一半的后验。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Balance the two kinds of positive", "令两类阳性相等"],
            t(
              `$P(D \\mid +) = \\frac{1}{2}$ means $p \\cdot ${hit.toLatex()} = (1 - p) \\cdot ${miss.toLatex()}$.`,
              `$P(D \\mid +) = \\frac{1}{2}$ 意味着 $p \\cdot ${hit.toLatex()} = (1 - p) \\cdot ${miss.toLatex()}$。`,
            ),
          ],
          [
            ["Solve", "求解"],
            t(
              `Multiplying by $10$ and collecting the $p$ terms, $p(${r} + ${q}) = ${q}$, so $p = \\frac{${q}}{${r + q}} = ${answer.toLatex()}$.`,
              `乘以 $10$ 并合并 $p$ 的项，$p(${r} + ${q}) = ${q}$，所以 $p = \\frac{${q}}{${r + q}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `True positives: $${answer.toLatex()} \\cdot ${hit.toLatex()} = ${weight.toLatex()}$. False positives: $${Q.of(1).sub(answer).toLatex()} \\cdot ${miss.toLatex()} = ${Q.of(1).sub(answer).mul(miss).toLatex()}$. They are equal.`,
          `真阳性：$${answer.toLatex()} \\cdot ${hit.toLatex()} = ${weight.toLatex()}$。假阳性：$${Q.of(1).sub(answer).toLatex()} \\cdot ${miss.toLatex()} = ${Q.of(1).sub(answer).mul(miss).toLatex()}$。二者相等。`,
        ),
      ),
    });
  },
};

const atLeastOneSymbol: KnowledgePointDef = {
  id: "sequences-containing-a-given-symbol",
  title: t("Sequences containing a given symbol", "含有给定符号的序列"),
  explanation: t(
    "Counting the sequences that contain a symbol at least once directly would split into many cases, by how many times it appears and where. The complement is far simpler: count all the sequences, then remove those that avoid the symbol. With $n$ symbols and length $k$, that leaves $n^k - (n - 1)^k$ sequences. Of the $20^3 = 8000$ three-letter strings from $20$ letters, $19^3 = 6859$ avoid A, so $8000 - 6859 = 1141$ contain it.\n\n> **Watch out.** Fixing A in one of the $k$ places and filling the rest freely, $k \\cdot n^{k-1}$, counts a sequence with two A's twice; and $(n - 1)^k$ alone is the complement, not the answer.",
    "直接计算至少含一次某符号的序列，要按出现次数和位置分很多种情况。补集要简单得多：先数所有序列，再去掉不含这个符号的序列。有 $n$ 个符号、长度为 $k$ 时，剩下 $n^k - (n - 1)^k$ 个序列。用 $20$ 个字母组成的 $20^3 = 8000$ 个三字母串中，$19^3 = 6859$ 个不含 A，所以含 A 的有 $8000 - 6859 = 1141$ 个。\n\n> **注意。** 把 A 固定在 $k$ 个位置之一、其余自由填写得 $k \\cdot n^{k-1}$，含两个 A 的序列会被重复计数；单独的 $(n - 1)^k$ 是补集，不是答案。",
  ),
  generate(rng) {
    const n = rng.int(3, 12);
    const k = rng.int(2, 5);
    const answer = n ** k - (n - 1) ** k;
    const firstA = [...Array(k).keys()].map((i) => (n - 1) ** i * n ** (k - 1 - i));
    return numberProblem({
      prompt: t(
        `Sequences of length ${k} are formed from ${n} different symbols, with repetition allowed. How many of them contain the symbol A, which is one of the ${n}, at least once?`,
        `用 ${n} 个不同的符号组成长度为 ${k} 的序列，允许重复。其中至少含一次符号 A（它是这 ${n} 个符号之一）的序列有多少个？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(n ** k, "That is every sequence; remove those that avoid A.", "那是全部序列；还要去掉不含 A 的。"),
        why(
          k * n ** (k - 1),
          "That fixes A in one place and fills the rest freely, so sequences with several A's are counted more than once.",
          "那是把 A 固定在一个位置、其余自由填写，含多个 A 的序列被重复计数。",
        ),
        why((n - 1) ** k, "That counts the sequences that avoid A, the complement.", "那是不含 A 的序列个数，是补集。"),
      ]),
      solution: walked(
        [
          [["Count all sequences", "数全部序列"], t(`$${n}^{${k}} = ${n ** k}$.`, `$${n}^{${k}} = ${n ** k}$。`)],
          [["Count those without A", "数不含 A 的"], t(`$${n - 1}^{${k}} = ${(n - 1) ** k}$.`, `$${n - 1}^{${k}} = ${(n - 1) ** k}$。`)],
          [["Subtract", "相减"], t(`$${n ** k} - ${(n - 1) ** k} = ${answer}$.`, `$${n ** k} - ${(n - 1) ** k} = ${answer}$。`)],
        ],
        t(
          `Sorting by the place where A first appears gives $${firstA.join(" + ")} = ${answer}$.`,
          `按 A 第一次出现的位置分类，得 $${firstA.join(" + ")} = ${answer}$。`,
        ),
      ),
    });
  },
};

const standardizing: KnowledgePointDef = {
  id: "the-constants-that-standardize-a-variable",
  title: t("The constants that standardize a variable", "使变量标准化的常数"),
  explanation: t(
    "Since $\\text{Var}(aX + b) = a^2\\text{Var}(X)$, the shift $b$ has no effect on spread, and the scale $a$ must be one over the standard deviation to give a variance of 1. Then $E(aX + b) = a\\mu + b$ must be 0, so $b = -\\frac{\\mu}{\\sigma}$. The order matters: fix the scale first and the shift afterwards.\n\n> **Watch out.** The shift is applied after the scaling, so it is $-\\frac{\\mu}{\\sigma}$, not $-\\mu$; and $\\sigma$ is the square root of the variance. With mean $6$ and variance $9$, $a = \\frac{1}{3}$ and $b = -2$, not $-6$ or $-\\frac{2}{3}$.",
    "由于 $\\text{Var}(aX + b) = a^2\\text{Var}(X)$，平移 $b$ 不影响离散程度，要使方差为 1，比例 $a$ 必须是标准差的倒数。这时 $E(aX + b) = a\\mu + b$ 必须为 0，所以 $b = -\\frac{\\mu}{\\sigma}$。顺序很重要：先定比例，再定平移。\n\n> **注意。** 平移是在缩放之后进行的，所以是 $-\\frac{\\mu}{\\sigma}$，而不是 $-\\mu$；而且 $\\sigma$ 是方差的平方根。均值为 $6$、方差为 $9$ 时，$a = \\frac{1}{3}$，$b = -2$，而不是 $-6$ 或 $-\\frac{2}{3}$。",
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
      mistakes: distinctMistakes(answer, [
        why(
          answer.neg(),
          `That has the wrong sign; $b$ must cancel $a\\mu = ${Q.of(mu, sigma).toLatex()}$.`,
          `那是符号错了；$b$ 要抵消 $a\\mu = ${Q.of(mu, sigma).toLatex()}$。`,
        ),
        why(
          Q.of(-mu),
          "That shifts before scaling; after multiplying by $a$ the mean is $a\\mu$, so the shift must be $-a\\mu$.",
          "那是先平移再缩放；乘以 $a$ 之后均值是 $a\\mu$，所以平移量应是 $-a\\mu$。",
        ),
        why(
          Q.of(-mu, sigma * sigma),
          `That divides by the variance $${sigma * sigma}$; the scale uses the standard deviation $${sigma}$.`,
          `那是除以了方差 $${sigma * sigma}$；缩放用的是标准差 $${sigma}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Fix the scale", "先定比例"],
            t(
              `$\\text{Var}(Z) = a^2 \\cdot ${sigma * sigma} = 1$ with $a > 0$ gives $a = \\frac{1}{${sigma}}$.`,
              `由 $\\text{Var}(Z) = a^2 \\cdot ${sigma * sigma} = 1$ 且 $a > 0$，得 $a = \\frac{1}{${sigma}}$。`,
            ),
          ],
          [
            ["Fix the shift", "再定平移"],
            t(
              `$E(Z) = \\frac{${inParens(mu)}}{${sigma}} + b = 0$, so $b = ${answer.toLatex()}$.`,
              `$E(Z) = \\frac{${inParens(mu)}}{${sigma}} + b = 0$，所以 $b = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `So $Z = \\frac{X - ${inParens(mu)}}{${sigma}}$: subtracting the mean leaves mean $0$, and dividing by $${sigma}$ divides the variance $${sigma * sigma}$ by $${sigma * sigma}$.`,
          `所以 $Z = \\frac{X - ${inParens(mu)}}{${sigma}}$：减去均值后均值为 $0$，除以 $${sigma}$ 使方差 $${sigma * sigma}$ 除以 $${sigma * sigma}$。`,
        ),
      ),
    });
  },
};

const secondMomentFromMgf: KnowledgePointDef = {
  id: "the-second-moment-from-a-moment-generating-function",
  title: t("The second moment from a moment generating function", "由矩母函数求二阶矩"),
  explanation: t(
    "The derivatives of a moment generating function at zero are the moments: $M'(0) = E(X)$ and $M''(0) = E(X^2)$. For a power such as $(1 - at)^{-k}$, differentiating twice brings down the factors $ka$ and then $(k + 1)a$. There is no need to know which distribution this is, or to integrate its density. For $M(t) = (1 - 20t)^{-3}$, $E(X^2) = 3 \\cdot 4 \\cdot 20^2 = 4800$.\n\n> **Watch out.** The second factor is $k + 1$, not $k$ or $k - 1$: the power moves from $-k$ to $-(k + 1)$. And $E(X^2)$ is not the square of the mean $(ka)^2$.",
    "矩母函数在零处的各阶导数就是各阶矩：$M'(0) = E(X)$，$M''(0) = E(X^2)$。对 $(1 - at)^{-k}$ 这样的幂函数，求两次导，依次带出因子 $ka$ 和 $(k + 1)a$。不需要知道这是什么分布，也不需要对它的密度积分。对于 $M(t) = (1 - 20t)^{-3}$，$E(X^2) = 3 \\cdot 4 \\cdot 20^2 = 4800$。\n\n> **注意。** 第二个因子是 $k + 1$，不是 $k$ 或 $k - 1$：幂从 $-k$ 变为 $-(k + 1)$。而且 $E(X^2)$ 不是均值的平方 $(ka)^2$。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const k = rng.int(2, 6);
    const answer = k * (k + 1) * a * a;
    const inside = `1 - ${coefficientOf(a)}t`;
    const scale = a === 1 ? "" : ` \\cdot ${a}`;
    return numberProblem({
      prompt: t(
        `A random variable has moment generating function $M(t) = (1 - ${coefficientOf(a)}t)^{-${k}}$. Find $E(X^2)$.`,
        `随机变量的矩母函数是 $M(t) = (1 - ${coefficientOf(a)}t)^{-${k}}$。求 $E(X^2)$。`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          (k * a) ** 2,
          "That is the square of the mean, $(M'(0))^2$, not the second moment.",
          "那是均值的平方 $(M'(0))^2$，不是二阶矩。",
        ),
        why(k * a, "That is the mean $M'(0)$; differentiate once more.", "那是均值 $M'(0)$；还要再求一次导。"),
        why(
          k * (k - 1) * a * a,
          `That uses $${k - 1}$ as the second factor; the power moves from $-${k}$ to $-${k + 1}$, so the factor is $${k + 1}$.`,
          `那是把第二个因子取成了 $${k - 1}$；幂从 $-${k}$ 变为 $-${k + 1}$，所以因子是 $${k + 1}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Differentiate once", "求一阶导数"],
            t(
              `$M'(t) = ${k}${scale}(${inside})^{-${k + 1}} = ${k * a}(${inside})^{-${k + 1}}$.`,
              `$M'(t) = ${k}${scale}(${inside})^{-${k + 1}} = ${k * a}(${inside})^{-${k + 1}}$。`,
            ),
          ],
          [
            ["Differentiate again and set t = 0", "再求导并令 $t = 0$"],
            t(
              `$M''(t) = ${k * a} \\cdot ${k + 1}${scale}(${inside})^{-${k + 2}}$, so $E(X^2) = M''(0) = ${answer}$.`,
              `$M''(t) = ${k * a} \\cdot ${k + 1}${scale}(${inside})^{-${k + 2}}$，所以 $E(X^2) = M''(0) = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The variance $${answer} - ${k * a}^2 = ${k * a * a}$ is positive, as it must be.`,
          `方差 $${answer} - ${k * a}^2 = ${k * a * a}$ 是正数，理应如此。`,
        ),
      ),
    });
  },
};

const sizeFromVariance: KnowledgePointDef = {
  id: "the-number-of-values-from-a-uniform-variance",
  title: t("The number of values from a uniform variance", "由均匀分布的方差求取值个数"),
  explanation: t(
    "The variance of a discrete uniform variable on $n$ consecutive integers is $\\frac{n^2 - 1}{12}$, and it depends on $n$ alone, not on where the values begin. So the variance can be inverted: multiply by 12, add 1, and take a square root. The mean plays no part, which also means it cannot be recovered this way.\n\n> **Watch out.** Undo the steps in reverse order and finish with the square root. A variance of $4$ gives $n^2 = 12 \\cdot 4 + 1 = 49$, so $n = 7$, not $49$; and $n$ counts the values, one more than the gap $6$ between the largest and the smallest.",
    "$n$ 个连续整数上的离散均匀变量，方差是 $\\frac{n^2 - 1}{12}$，只取决于 $n$，与取值从哪里开始无关。所以可以反解方差：乘以 12，加 1，再开平方。均值不起作用，这也意味着用这种方法求不出均值。\n\n> **注意。** 按相反的顺序还原，最后别忘了开平方。方差为 $4$ 时 $n^2 = 12 \\cdot 4 + 1 = 49$，所以 $n = 7$，而不是 $49$；而且 $n$ 是取值的个数，比最大值与最小值之差 $6$ 多一。",
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
      mistakes: apart(n, [
        why(n * n, "That is $n^2$; take the square root at the end.", "那是 $n^2$；最后还要开平方。"),
        why(
          n - 1,
          "That is the gap between the largest and the smallest value; $n$ counts the values, one more than the gap.",
          "那是最大值与最小值之差；$n$ 是取值的个数，比这个差多一。",
        ),
        why(
          start + n - 1,
          `That is the largest value, $${start} + n - 1$, not the number of values.`,
          `那是最大的取值 $${start} + n - 1$，而不是取值的个数。`,
        ),
      ]),
      wrong: [n + 1, 2 * n],
      solution: walked(
        [
          [
            ["Undo the division and the subtraction", "还原除法和减法"],
            t(
              `$\\frac{n^2 - 1}{12} = ${variance.toLatex()}$ gives $n^2 = 12 \\cdot ${variance.toLatex()} + 1 = ${n * n}$.`,
              `由 $\\frac{n^2 - 1}{12} = ${variance.toLatex()}$ 得 $n^2 = 12 \\cdot ${variance.toLatex()} + 1 = ${n * n}$。`,
            ),
          ],
          [["Take the square root", "开平方"], t(`$n = \\sqrt{${n * n}} = ${n}$.`, `$n = \\sqrt{${n * n}} = ${n}$。`)],
        ],
        t(
          `The values run from $${start}$ to $${start + n - 1}$, and $\\frac{${n}^2 - 1}{12} = \\frac{${n * n - 1}}{12} = ${variance.toLatex()}$, the given variance; the starting point $${start}$ never entered.`,
          `取值从 $${start}$ 到 $${start + n - 1}$，而 $\\frac{${n}^2 - 1}{12} = \\frac{${n * n - 1}}{12} = ${variance.toLatex()}$，正是已知的方差；起点 $${start}$ 始终没有用到。`,
        ),
      ),
    });
  },
};

const lambdaFromRatio: KnowledgePointDef = {
  id: "the-poisson-mean-from-consecutive-probabilities",
  title: t("The Poisson mean from consecutive probabilities", "由相邻概率求泊松均值"),
  explanation: t(
    "Consecutive Poisson probabilities have the simple ratio $\\frac{P(X = k + 1)}{P(X = k)} = \\frac{\\lambda}{k + 1}$, because the exponential factors cancel and the factorials differ by a single factor. So any one such ratio determines $\\lambda$. The same ratio shows that the probabilities rise while $k + 1$ is below $\\lambda$ and fall after that.\n\n> **Watch out.** Multiply the ratio by $k + 1$, the larger of the two values. If $\\frac{P(X = 5)}{P(X = 4)} = \\frac{3}{5}$, then $\\lambda = 5 \\cdot \\frac{3}{5} = 3$, not $4 \\cdot \\frac{3}{5}$.",
    "相邻泊松概率的比很简单：$\\frac{P(X = k + 1)}{P(X = k)} = \\frac{\\lambda}{k + 1}$，因为指数因子相消，阶乘只差一个因子。所以任何一个这样的比都能确定 $\\lambda$。同样的比还说明，$k + 1$ 小于 $\\lambda$ 时概率上升，之后下降。\n\n> **注意。** 比值要乘以两个值中较大的 $k + 1$。若 $\\frac{P(X = 5)}{P(X = 4)} = \\frac{3}{5}$，则 $\\lambda = 5 \\cdot \\frac{3}{5} = 3$，而不是 $4 \\cdot \\frac{3}{5}$。",
  ),
  generate(rng) {
    const lambda = rng.int(1, 12);
    const k = rng.int(1, 6);
    const ratio = Q.of(lambda, k + 1);
    const trend =
      lambda > k + 1
        ? t(`$P(X = ${k + 1}) > P(X = ${k})$`, `$P(X = ${k + 1}) > P(X = ${k})$`)
        : lambda < k + 1
          ? t(`$P(X = ${k + 1}) < P(X = ${k})$`, `$P(X = ${k + 1}) < P(X = ${k})$`)
          : t(`$P(X = ${k + 1}) = P(X = ${k})$`, `$P(X = ${k + 1}) = P(X = ${k})$`);
    const relation = lambda > k + 1 ? ">" : lambda < k + 1 ? "<" : "=";
    return numberProblem({
      prompt: t(
        `$X$ is Poisson with mean $\\lambda$, and $\\frac{P(X = ${k + 1})}{P(X = ${k})} = ${ratio.toLatex()}$. Find $\\lambda$.`,
        `$X$ 服从均值为 $\\lambda$ 的泊松分布，且 $\\frac{P(X = ${k + 1})}{P(X = ${k})} = ${ratio.toLatex()}$。求 $\\lambda$。`,
      ),
      answer: lambda,
      form: "integer",
      mistakes: apart(lambda, [
        why(
          ratio.mul(Q.of(k)),
          `That multiplies by $${k}$; the ratio is $\\frac{\\lambda}{${k + 1}}$, so multiply by $${k + 1}$.`,
          `那是乘以了 $${k}$；这个比是 $\\frac{\\lambda}{${k + 1}}$，所以要乘以 $${k + 1}$。`,
        ),
        why(lambda * (k + 1), `That multiplies by $${k + 1}$ twice, once too often.`, `那是乘了两次 $${k + 1}$，多乘了一次。`),
        why(ratio, "That takes the ratio itself as the mean.", "那是把比值本身当作均值。"),
      ]),
      wrong: [lambda + 1, lambda + k + 1],
      solution: walked(
        [
          [
            ["Write the ratio", "写出比值"],
            t(
              `The exponential factors cancel and the factorials differ by the factor $${k + 1}$, so $\\frac{P(X = ${k + 1})}{P(X = ${k})} = \\frac{\\lambda}{${k + 1}}$.`,
              `指数因子相消，阶乘只差因子 $${k + 1}$，所以 $\\frac{P(X = ${k + 1})}{P(X = ${k})} = \\frac{\\lambda}{${k + 1}}$。`,
            ),
          ],
          [
            ["Solve", "求解"],
            t(
              `$\\lambda = ${k + 1} \\cdot ${ratio.toLatex()} = ${lambda}$.`,
              `$\\lambda = ${k + 1} \\cdot ${ratio.toLatex()} = ${lambda}$。`,
            ),
          ],
        ],
        t(
          `The ratio $${ratio.toLatex()}$ says that ${trend.en}, which agrees with $\\lambda = ${lambda} ${relation} ${k + 1}$.`,
          `比值 $${ratio.toLatex()}$ 说明 ${trend["zh-CN"]}，这与 $\\lambda = ${lambda} ${relation} ${k + 1}$ 一致。`,
        ),
      ),
    });
  },
};

const chiSquareSum: KnowledgePointDef = {
  id: "the-variance-of-a-sum-of-chi-square-variables",
  title: t("The variance of a sum of chi-square variables", "卡方变量之和的方差"),
  explanation: t(
    "A chi-square variable with $\\nu$ degrees of freedom is a sum of $\\nu$ independent squared standard normals, so independent chi-square variables add to another one, with their degrees of freedom added. Its variance is twice the degrees of freedom. This also agrees with adding the two separate variances, as independence allows. With $50$ and $70$ degrees of freedom, the sum is chi-square with $120$ degrees of freedom and variance $240$.\n\n> **Watch out.** The degrees of freedom give the mean, $\\nu$; the variance is $2\\nu$. Add the degrees of freedom; do not multiply them.",
    "自由度为 $\\nu$ 的卡方变量，是 $\\nu$ 个独立标准正态变量的平方和，所以独立的卡方变量相加还是卡方变量，自由度相加。它的方差是自由度的两倍。这也与独立时把两个方差直接相加的结果一致。自由度为 $50$ 和 $70$ 时，和服从自由度为 $120$ 的卡方分布，方差为 $240$。\n\n> **注意。** 自由度给出的是均值 $\\nu$；方差是 $2\\nu$。自由度要相加，不要相乘。",
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
      mistakes: apart(answer, [
        why(
          a + b,
          "That is the degrees of freedom, which is the mean; the variance is twice it.",
          "那是自由度，也就是均值；方差是它的两倍。",
        ),
        why(
          4 * (a + b),
          "That doubles twice; the variance of a chi-square variable is $2\\nu$.",
          "那是乘了两次 $2$；卡方变量的方差是 $2\\nu$。",
        ),
        why(
          2 * a * b,
          "That multiplies the degrees of freedom; independent chi-square variables add theirs.",
          "那是把自由度相乘了；独立卡方变量的自由度相加。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Add the degrees of freedom", "自由度相加"],
            t(
              `$X + Y$ is chi-square with $${a} + ${b} = ${a + b}$ degrees of freedom.`,
              `$X + Y$ 服从自由度为 $${a} + ${b} = ${a + b}$ 的卡方分布。`,
            ),
          ],
          [["Double", "乘以二"], t(`Its variance is $2 \\cdot ${a + b} = ${answer}$.`, `它的方差是 $2 \\cdot ${a + b} = ${answer}$。`)],
        ],
        t(
          `By independence, $\\operatorname{Var}(X) + \\operatorname{Var}(Y) = ${2 * a} + ${2 * b} = ${answer}$ as well.`,
          `由独立性，$\\operatorname{Var}(X) + \\operatorname{Var}(Y) = ${2 * a} + ${2 * b} = ${answer}$，结果相同。`,
        ),
      ),
    });
  },
};

const gammaRatio: KnowledgePointDef = {
  id: "a-ratio-of-gamma-values-two-apart",
  title: t("A ratio of gamma values two apart", "相差二的伽马函数值之比"),
  explanation: t(
    "The recurrence $\\Gamma(x + 1) = x\\Gamma(x)$ holds for every positive real $x$, not only for whole numbers. Applying it twice gives $\\Gamma(x + 2) = (x + 1)x\\Gamma(x)$. So a ratio of gamma values whose arguments differ by a whole number is a plain product, even when no individual value can be written in closed form. For $x = 2.5$, $\\frac{\\Gamma(4.5)}{\\Gamma(2.5)} = 3.5 \\cdot 2.5 = 8.75 = \\frac{35}{4}$.\n\n> **Watch out.** The two factors are $x$ and $x + 1$, not $x + 1$ and $x + 2$: each step down lowers the argument by one and brings out the new, smaller argument.",
    "递推式 $\\Gamma(x + 1) = x\\Gamma(x)$ 对每个正实数 $x$ 都成立，不只是整数。用两次得到 $\\Gamma(x + 2) = (x + 1)x\\Gamma(x)$。所以自变量相差整数的伽马函数值之比就是一个普通的乘积，即使单个值无法写成闭形式。当 $x = 2.5$ 时，$\\frac{\\Gamma(4.5)}{\\Gamma(2.5)} = 3.5 \\cdot 2.5 = 8.75 = \\frac{35}{4}$。\n\n> **注意。** 两个因子是 $x$ 和 $x + 1$，而不是 $x + 1$ 和 $x + 2$：每往下一步，自变量减一，并提出新的较小的自变量。",
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
      mistakes: apart(answer, [
        why(next, "That applies the recurrence only once; the arguments are two apart.", "那只用了一次递推式；两个自变量相差二。"),
        why(x, "That keeps only the factor $x$ and drops $x + 1$.", "那只保留了因子 $x$，漏掉了 $x + 1$。"),
        why(
          x.mul(x.add(Q.of(2))),
          "That uses $x + 2$ as a factor; the factors are $x$ and $x + 1$.",
          "那是把 $x + 2$ 当作因子；因子应是 $x$ 和 $x + 1$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Step down once", "递推一次"],
            t(
              `$\\Gamma\\left(${x.toLatex()} + 2\\right) = ${next.toLatex()}\\,\\Gamma\\left(${next.toLatex()}\\right)$.`,
              `$\\Gamma\\left(${x.toLatex()} + 2\\right) = ${next.toLatex()}\\,\\Gamma\\left(${next.toLatex()}\\right)$。`,
            ),
          ],
          [
            ["Step down again", "再递推一次"],
            t(
              `$\\Gamma\\left(${next.toLatex()}\\right) = ${x.toLatex()}\\,\\Gamma\\left(${x.toLatex()}\\right)$, so the ratio is $${next.toLatex()} \\cdot ${x.toLatex()} = ${answer.toLatex()}$.`,
              `$\\Gamma\\left(${next.toLatex()}\\right) = ${x.toLatex()}\\,\\Gamma\\left(${x.toLatex()}\\right)$，所以比值为 $${next.toLatex()} \\cdot ${x.toLatex()} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$${answer.toLatex()} \\div ${x.toLatex()} = ${next.toLatex()}$, which is $${x.toLatex()} + 1$, the second factor.`,
          `$${answer.toLatex()} \\div ${x.toLatex()} = ${next.toLatex()}$，正是 $${x.toLatex()} + 1$，即第二个因子。`,
        ),
      ),
    });
  },
};

const gammaMode: KnowledgePointDef = {
  id: "the-mode-of-a-gamma-distribution",
  title: t("The mode of a gamma distribution", "伽马分布的众数"),
  explanation: t(
    "A gamma density is proportional to $x^{\\alpha - 1}e^{-\\beta x}$. To find its peak, it is easier to differentiate its logarithm, $(\\alpha - 1)\\ln x - \\beta x$, and this gives $x = \\frac{\\alpha - 1}{\\beta}$ when $\\alpha > 1$. The mode lies below the mean $\\frac{\\alpha}{\\beta}$, because the long right tail pulls the mean upward. For $x^{20}e^{-10x}$, $\\alpha = 21$ and $\\beta = 10$, so the mode is $\\frac{20}{10} = 2$ and the mean is $2.1$.\n\n> **Watch out.** The exponent of $x$ is already $\\alpha - 1$, so the mode is that exponent divided by $\\beta$; using $\\alpha$ itself gives the mean.",
    "伽马密度正比于 $x^{\\alpha - 1}e^{-\\beta x}$。求峰值时，对它的对数 $(\\alpha - 1)\\ln x - \\beta x$ 求导更容易，当 $\\alpha > 1$ 时得 $x = \\frac{\\alpha - 1}{\\beta}$。众数低于均值 $\\frac{\\alpha}{\\beta}$，因为右侧的长尾把均值向上拉。对 $x^{20}e^{-10x}$，$\\alpha = 21$，$\\beta = 10$，所以众数为 $\\frac{20}{10} = 2$，均值为 $2.1$。\n\n> **注意。** $x$ 的指数已经是 $\\alpha - 1$，所以众数是这个指数除以 $\\beta$；用 $\\alpha$ 本身得到的是均值。",
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
      mistakes: apart(answer, [
        why(
          Q.of(alpha, beta),
          "That is the mean $\\frac{\\alpha}{\\beta}$, not the peak.",
          "那是均值 $\\frac{\\alpha}{\\beta}$，不是峰值。",
        ),
        why(Q.of(alpha - 1, beta * beta), "That divides by the rate twice.", "那是除了两次速率。"),
        why(Q.of(beta, alpha - 1), "That turns the ratio upside down.", "那是把比值倒过来了。"),
      ]),
      solution: walked(
        [
          [
            ["Take the logarithm", "取对数"],
            t(
              `The logarithm of the density is $${alpha - 1 === 1 ? "" : alpha - 1}\\ln x - ${coefficientOf(beta)}x$ plus a constant.`,
              `密度的对数为 $${alpha - 1 === 1 ? "" : alpha - 1}\\ln x - ${coefficientOf(beta)}x$ 加一个常数。`,
            ),
          ],
          [
            ["Set the derivative to zero", "令导数为零"],
            t(
              `The derivative is $\\frac{${alpha - 1}}{x} - ${beta}$, which is zero at $x = ${answer.toLatex()}$.`,
              `导数为 $\\frac{${alpha - 1}}{x} - ${beta}$，它在 $x = ${answer.toLatex()}$ 处为零。`,
            ),
          ],
        ],
        t(
          `The derivative is positive below $${answer.toLatex()}$ and negative above it, so this is a peak, and it lies below the mean $${Q.of(alpha, beta).toLatex()}$.`,
          `导数在 $${answer.toLatex()}$ 以下为正、以上为负，所以这是峰值，并且它低于均值 $${Q.of(alpha, beta).toLatex()}$。`,
        ),
      ),
    });
  },
};

const tDegreesForVariance: KnowledgePointDef = {
  id: "the-degrees-of-freedom-for-a-target-t-variance",
  title: t("The degrees of freedom for a target $t$ variance", "达到目标方差所需的 $t$ 分布自由度"),
  explanation: t(
    'A $t$ distribution with $\\nu > 2$ degrees of freedom has variance $\\frac{\\nu}{\\nu - 2} = 1 + \\frac{2}{\\nu - 2}$, which falls toward 1 as $\\nu$ grows. This is why the distribution approaches the standard normal. Writing the variance in this second form makes it simple to solve an inequality for the degrees of freedom needed. For a variance of at most $1.01$, $\\frac{2}{\\nu - 2} \\le 0.01$ needs $\\nu - 2 \\ge 200$, so $\\nu = 202$.\n\n> **Watch out.** Solve for $\\nu - 2$ and then add $2$ back. "At most" allows equality, so the boundary value itself counts.',
    "自由度 $\\nu > 2$ 的 $t$ 分布，方差是 $\\frac{\\nu}{\\nu - 2} = 1 + \\frac{2}{\\nu - 2}$，随 $\\nu$ 增大而降向 1。这就是它趋于标准正态分布的原因。把方差写成第二种形式，就很容易解出所需自由度的不等式。要使方差不超过 $1.01$，$\\frac{2}{\\nu - 2} \\le 0.01$ 要求 $\\nu - 2 \\ge 200$，所以 $\\nu = 202$。\n\n> **注意。** 先解出 $\\nu - 2$，再加回 $2$。“不超过”允许相等，所以边界值本身也算。",
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
      mistakes: apart(answer, [
        why(2 * m, "That is $\\nu - 2$; add $2$ back to get $\\nu$.", "那是 $\\nu - 2$；要加回 $2$ 才是 $\\nu$。"),
        why(
          2 * m + 3,
          "That is one too many; at the answer the variance equals the bound, which is allowed.",
          "那多了一个；在答案处方差恰好等于界限，这是允许的。",
        ),
        why(m + 2, "That drops the $2$ in $\\frac{2}{\\nu - 2}$.", "那漏掉了 $\\frac{2}{\\nu - 2}$ 中的 $2$。"),
      ]),
      solution: walked(
        [
          [
            ["Rewrite the variance", "改写方差"],
            t(
              `$\\frac{\\nu}{\\nu - 2} = 1 + \\frac{2}{\\nu - 2}$ and $${bound.toLatex()} = 1 + \\frac{1}{${m}}$, so we need $\\frac{2}{\\nu - 2} \\le \\frac{1}{${m}}$.`,
              `$\\frac{\\nu}{\\nu - 2} = 1 + \\frac{2}{\\nu - 2}$，而 $${bound.toLatex()} = 1 + \\frac{1}{${m}}$，所以需要 $\\frac{2}{\\nu - 2} \\le \\frac{1}{${m}}$。`,
            ),
          ],
          [
            ["Solve", "求解"],
            t(
              `So $\\nu - 2 \\ge ${2 * m}$, and the smallest choice is $\\nu = ${answer}$.`,
              `所以 $\\nu - 2 \\ge ${2 * m}$，最小取 $\\nu = ${answer}$。`,
            ),
          ],
        ],
        t(
          `At $\\nu = ${answer}$ the variance is $\\frac{${answer}}{${2 * m}} = ${bound.toLatex()}$, exactly the bound, while $\\nu = ${answer - 1}$ gives $\\frac{${answer - 1}}{${2 * m - 1}}$, which is larger.`,
          `当 $\\nu = ${answer}$ 时方差为 $\\frac{${answer}}{${2 * m}} = ${bound.toLatex()}$，恰好等于界限；而 $\\nu = ${answer - 1}$ 给出 $\\frac{${answer - 1}}{${2 * m - 1}}$，更大。`,
        ),
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
    "If $X$ follows $F(a, b)$, then $\\frac{1}{X}$ follows $F(b, a)$, because the ratio that defines $F$ is simply turned upside down. An event $X < c$ is the same as $\\frac{1}{X} > \\frac{1}{c}$. So tables that list only upper quantiles still give lower ones: swap the degrees of freedom and take the reciprocal. The 95th percentile of $F(20, 30)$ is about $1.93$, so the 5th percentile of $F(30, 20)$ is $\\frac{1}{1.93} = \\frac{100}{193}$.\n\n> **Watch out.** The reciprocal belongs to the distribution with the degrees of freedom swapped. The 5th percentile is not one minus the 95th: percentiles of $F$ are values, not probabilities.",
    "如果 $X$ 服从 $F(a, b)$，那么 $\\frac{1}{X}$ 服从 $F(b, a)$，因为定义 $F$ 的那个比只是上下颠倒了。事件 $X < c$ 等同于 $\\frac{1}{X} > \\frac{1}{c}$。所以只列上侧分位数的表也能给出下侧分位数：交换自由度，再取倒数。$F(20, 30)$ 的第 95 百分位数约为 $1.93$，所以 $F(30, 20)$ 的第 5 百分位数是 $\\frac{1}{1.93} = \\frac{100}{193}$。\n\n> **注意。** 倒数对应的是交换了自由度的分布。第 5 百分位数不是一减去第 95 百分位数：$F$ 的百分位数是取值，不是概率。",
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
      mistakes: apart(answer, [
        why(
          c,
          `That is the 95th percentile of $F(${b}, ${a})$ itself; take its reciprocal.`,
          `那就是 $F(${b}, ${a})$ 的第 95 百分位数本身；要取倒数。`,
        ),
        why(
          Q.of(1).sub(answer),
          "That subtracts from $1$; a percentile is a value, not a probability.",
          "那是用 $1$ 去减；百分位数是取值，不是概率。",
        ),
        why(
          Q.of(100, hundredths + 100),
          `That is $\\frac{1}{1 + ${shown}}$, not $\\frac{1}{${shown}}$.`,
          `那是 $\\frac{1}{1 + ${shown}}$，而不是 $\\frac{1}{${shown}}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Turn the ratio over", "把比值倒过来"],
            t(
              `If $X$ follows $F(${a}, ${b})$, then $\\frac{1}{X}$ follows $F(${b}, ${a})$, and $P(X < c) = P\\left(\\frac{1}{X} > \\frac{1}{c}\\right)$. For this to be $0.05$, $\\frac{1}{c}$ must be the 95th percentile of $F(${b}, ${a})$, which is $${shown}$.`,
              `若 $X$ 服从 $F(${a}, ${b})$，则 $\\frac{1}{X}$ 服从 $F(${b}, ${a})$，且 $P(X < c) = P\\left(\\frac{1}{X} > \\frac{1}{c}\\right)$。要使它等于 $0.05$，$\\frac{1}{c}$ 必须是 $F(${b}, ${a})$ 的第 95 百分位数，即 $${shown}$。`,
            ),
          ],
          [
            ["Take the reciprocal", "取倒数"],
            t(`$c = \\frac{1}{${shown}} = ${answer.toLatex()}$.`, `$c = \\frac{1}{${shown}} = ${answer.toLatex()}$。`),
          ],
        ],
        t(
          `$${answer.toLatex()} \\cdot ${shown} = 1$, and the 5th percentile $${answer.toLatex()}$ is below $1$, as a lower percentile of $F$ should be.`,
          `$${answer.toLatex()} \\cdot ${shown} = 1$，且第 5 百分位数 $${answer.toLatex()}$ 小于 $1$，下侧百分位数理应如此。`,
        ),
      ),
    });
  },
};

const trinomialConditional: KnowledgePointDef = {
  id: "a-conditional-mean-in-a-trinomial-model",
  title: t("A conditional mean in a trinomial model", "三项分布中的条件均值"),
  explanation: t(
    "Knowing the count of the third outcome leaves the other trials to be split between the first two outcomes. Within those trials, the probabilities must be renormalized: outcome one has chance $\\frac{p_1}{p_1 + p_2}$. So the conditional distribution of $X$ is binomial, and its mean is the number of remaining trials times that new probability. With $100$ trials and probabilities $0.2$, $0.3$ and $0.5$, knowing $Z = 40$ leaves $60$ trials, each giving outcome 1 with probability $\\frac{0.2}{0.2 + 0.3} = 0.4$, so $E(X \\mid Z = 40) = 24$.\n\n> **Watch out.** Do both adjustments: use only the trials that remain, and divide $p_1$ by $p_1 + p_2$.",
    "知道第三种结果的次数后，其余的试验要在前两种结果之间分配。在这些试验中，概率必须重新归一化：结果一的概率是 $\\frac{p_1}{p_1 + p_2}$。所以 $X$ 的条件分布是二项分布，均值是剩余试验次数乘以这个新概率。若共 $100$ 次试验，概率为 $0.2$、$0.3$、$0.5$，已知 $Z = 40$ 后剩下 $60$ 次试验，每次得到结果 1 的概率为 $\\frac{0.2}{0.2 + 0.3} = 0.4$，所以 $E(X \\mid Z = 40) = 24$。\n\n> **注意。** 两处都要调整：只用剩下的试验，并把 $p_1$ 除以 $p_1 + p_2$。",
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
      mistakes: apart(answer, [
        why(
          Q.of(n * p1, 10),
          "That is the unconditional mean $np_1$; knowing $Z$ changes it.",
          "那是无条件均值 $np_1$；知道 $Z$ 后它会改变。",
        ),
        why(
          Q.of((n - z) * p1, 10),
          "That uses the remaining trials but keeps the old probability $p_1$.",
          "那用了剩下的试验，却保留了原来的概率 $p_1$。",
        ),
        why(
          Q.of(n * p1, p1 + p2),
          `That renormalizes the probability but uses all $${n}$ trials, including the $${z}$ that gave outcome 3.`,
          `那重新归一化了概率，却用了全部 $${n}$ 次试验，包括得到结果 3 的 $${z}$ 次。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Count the remaining trials", "数剩下的试验"],
            t(`$${n} - ${z} = ${n - z}$ trials gave outcome 1 or 2.`, `有 $${n} - ${z} = ${n - z}$ 次试验得到结果 1 或 2。`),
          ],
          [
            ["Renormalize", "重新归一化"],
            t(
              `In those trials outcome 1 has probability $\\frac{${tenths(p1)}}{${tenths(p1)} + ${tenths(p2)}} = ${Q.of(p1, p1 + p2).toLatex()}$.`,
              `在这些试验中，结果 1 的概率是 $\\frac{${tenths(p1)}}{${tenths(p1)} + ${tenths(p2)}} = ${Q.of(p1, p1 + p2).toLatex()}$。`,
            ),
          ],
          [
            ["Take the binomial mean", "求二项均值"],
            t(
              `$E(X \\mid Z = ${z}) = ${n - z === 1 ? "" : `${n - z} \\cdot `}${Q.of(p1, p1 + p2).toLatex()}${n - z === 1 ? "" : ` = ${answer.toLatex()}`}$.`,
              `$E(X \\mid Z = ${z}) = ${n - z === 1 ? "" : `${n - z} \\cdot `}${Q.of(p1, p1 + p2).toLatex()}${n - z === 1 ? "" : ` = ${answer.toLatex()}`}$。`,
            ),
          ],
        ],
        t(
          `Likewise $E(Y \\mid Z = ${z}) = ${Q.of((n - z) * p2, p1 + p2).toLatex()}$, and $${answer.toLatex()} + ${Q.of((n - z) * p2, p1 + p2).toLatex()} = ${n - z}$, the remaining trials.`,
          `同理 $E(Y \\mid Z = ${z}) = ${Q.of((n - z) * p2, p1 + p2).toLatex()}$，而 $${answer.toLatex()} + ${Q.of((n - z) * p2, p1 + p2).toLatex()} = ${n - z}$，正是剩下的试验次数。`,
        ),
      ),
    });
  },
};

const mergedMultinomial: KnowledgePointDef = {
  id: "the-variance-of-two-merged-multinomial-counts",
  title: t("The variance of two merged multinomial counts", "合并两个多项计数的方差"),
  explanation: t(
    "Merging two categories of a multinomial model gives a single category whose probability is the sum of the two. Its count is then binomial, with variance $n(p_i + p_j)(1 - p_i - p_j)$. Adding the two separate variances would be wrong, because multinomial counts compete for the same trials and so have a negative covariance. With $200$ trials and categories of probability $0.15$ and $0.25$, the merged category has probability $0.4$ and variance $200 \\cdot 0.4 \\cdot 0.6 = 48$.\n\n> **Watch out.** The separate variances add to more than this, $200(0.15 \\cdot 0.85 + 0.25 \\cdot 0.75) = 63$; the covariance $-np_ip_j$, counted twice, brings it down to $48$.",
    "合并多项模型的两个类别，就得到一个类别，它的概率是两者之和。它的计数服从二项分布，方差是 $n(p_i + p_j)(1 - p_i - p_j)$。直接把两个方差相加是错的，因为多项计数在争夺同样的试验，所以协方差为负。若共 $200$ 次试验，两个类别的概率为 $0.15$ 和 $0.25$，合并后的类别概率为 $0.4$，方差为 $200 \\cdot 0.4 \\cdot 0.6 = 48$。\n\n> **注意。** 两个方差分别相加会更大：$200(0.15 \\cdot 0.85 + 0.25 \\cdot 0.75) = 63$；协方差 $-np_ip_j$ 计两次后，才降到 $48$。",
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
      mistakes: apart(answer, [
        why(
          separate,
          "That adds the two separate variances and leaves out their negative covariance.",
          "那是把两个方差分别相加，漏掉了它们的负协方差。",
        ),
        why(Q.of(n * s, 10), "That is the mean $np$ of the merged count, not its variance.", "那是合并计数的均值 $np$，不是方差。"),
        why(Q.of(n * s * s, 100), "That uses $p^2$ instead of $p(1 - p)$.", "那是用了 $p^2$，而不是 $p(1 - p)$。"),
        why(Q.of(n * p1 * (10 - p1), 100), "That is the variance of $X_1$ alone.", "那只是 $X_1$ 的方差。"),
      ]),
      solution: walked(
        [
          [
            ["Merge the categories", "合并类别"],
            t(
              `$X_1 + X_2$ counts trials in either category, so it is binomial with $n = ${n}$ and $p = ${tenths(p1)} + ${tenths(p2)} = ${tenths(s)}$.`,
              `$X_1 + X_2$ 计的是落入这两个类别之一的试验，所以服从 $n = ${n}$、$p = ${tenths(p1)} + ${tenths(p2)} = ${tenths(s)}$ 的二项分布。`,
            ),
          ],
          [
            ["Take the binomial variance", "求二项方差"],
            t(
              `$np(1 - p) = ${n} \\cdot ${tenths(s)} \\cdot ${tenths(10 - s)} = ${answer.toLatex()}$.`,
              `$np(1 - p) = ${n} \\cdot ${tenths(s)} \\cdot ${tenths(10 - s)} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `The separate variances add to $${separate.toLatex()}$, and $2\\operatorname{Cov}(X_1, X_2) = -2np_1p_2 = -${Q.of(2 * n * p1 * p2, 100).toLatex()}$ brings this to $${answer.toLatex()}$.`,
          `两个方差之和为 $${separate.toLatex()}$，而 $2\\operatorname{Cov}(X_1, X_2) = -2np_1p_2 = -${Q.of(2 * n * p1 * p2, 100).toLatex()}$，相加后正是 $${answer.toLatex()}$。`,
        ),
      ),
    });
  },
};

const marginalFromCdf: KnowledgePointDef = {
  id: "a-marginal-cdf-from-a-joint-cdf",
  title: t("A marginal CDF from a joint CDF", "由联合分布函数求边缘分布函数"),
  explanation: t(
    "The event $X \\le x$ puts no restriction on $Y$, so the marginal distribution function comes from letting $y$ reach the top of its range: $F_X(x) = F(x, \\infty)$. On a bounded region, this means substituting the largest possible $y$. No differentiation or integration is needed, since the joint function already holds the answer. On $0 \\le x \\le 10$, $0 \\le y \\le 5$ with $F(x, y) = \\frac{x^2y}{500}$, $P(X \\le 4) = F(4, 5) = \\frac{16 \\cdot 5}{500} = \\frac{4}{25}$.\n\n> **Watch out.** Substitute the top of the range of $y$, not $y = 1$, unless $1$ is the top. And do not differentiate: a CDF is already a probability.",
    "事件 $X \\le x$ 对 $Y$ 没有限制，所以边缘分布函数是让 $y$ 达到其范围的上端得到的：$F_X(x) = F(x, \\infty)$。在有界区域上，就是代入 $y$ 的最大值。既不用求导，也不用积分，因为联合分布函数中已经含有答案。在 $0 \\le x \\le 10$，$0 \\le y \\le 5$ 上，若 $F(x, y) = \\frac{x^2y}{500}$，则 $P(X \\le 4) = F(4, 5) = \\frac{16 \\cdot 5}{500} = \\frac{4}{25}$。\n\n> **注意。** 要代入 $y$ 范围的上端，而不是 $y = 1$，除非上端恰好是 $1$。也不要求导：分布函数本身就是概率。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const x = rng.int(1, a - 1);
    const answer = Q.of(x * x, a * a);
    const top = x * x === 1 ? `${b}` : `${x * x} \\cdot ${b}`;
    return numberProblem({
      prompt: t(
        `On $0 \\le x \\le ${a}$, $0 \\le y \\le ${b}$, the joint CDF of $(X, Y)$ is $F(x, y) = \\frac{x^2y}{${a * a * b}}$. Find $P(X \\le ${x})$.`,
        `在 $0 \\le x \\le ${a}$，$0 \\le y \\le ${b}$ 上，$(X, Y)$ 的联合分布函数是 $F(x, y) = \\frac{x^2y}{${a * a * b}}$。求 $P(X \\le ${x})$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(Q.of(x, a), "That drops the square on $x$.", "那漏掉了 $x$ 上的平方。"),
        why(
          Q.of(x * x, a * a * b),
          `That substitutes $y = 1$; the top of the range of $y$ is $${b}$.`,
          `那是代入了 $y = 1$；$y$ 范围的上端是 $${b}$。`,
        ),
        why(Q.of(x * x, a), "That divides by the right end once instead of by its square.", "那只除以了右端点一次，而不是它的平方。"),
      ]),
      solution: walked(
        [
          [
            ["Let y reach the top", "让第二个变量取到上端"],
            t(
              `$X \\le ${x}$ puts no limit on $Y$, so $P(X \\le ${x}) = F(${x}, ${b})$.`,
              `$X \\le ${x}$ 对 $Y$ 没有限制，所以 $P(X \\le ${x}) = F(${x}, ${b})$。`,
            ),
          ],
          [
            ["Substitute", "代入"],
            t(
              `$F(${x}, ${b}) = \\frac{${top}}{${a * a * b}} = ${answer.toLatex()}$.`,
              `$F(${x}, ${b}) = \\frac{${top}}{${a * a * b}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `In general $F_X(x) = \\frac{x^2}{${a * a}}$, which reaches $1$ at the right end $x = ${a}$, as a distribution function must.`,
          `一般地 $F_X(x) = \\frac{x^2}{${a * a}}$，它在右端点 $x = ${a}$ 处达到 $1$，分布函数理应如此。`,
        ),
      ),
    });
  },
};

const conditionalNormalVariance: KnowledgePointDef = {
  id: "the-conditional-variance-of-a-bivariate-normal",
  title: t("The conditional variance of a bivariate normal", "二元正态分布的条件方差"),
  explanation: t(
    "In a bivariate normal, the conditional variance of $Y$ given $X = x$ is $\\sigma_Y^2(1 - \\rho^2)$. Unlike the conditional mean, it does not depend on the value of $x$. The factor $\\rho^2$ is the share of the variance of $Y$ that $X$ explains, so the sign of the correlation makes no difference here. With $\\operatorname{Var}(Y) = 400$ and $\\rho = -0.95$, the conditional variance is $400(1 - 0.9025) = 39$ for every $x$.\n\n> **Watch out.** Square the correlation: $1 - \\rho$ is not $1 - \\rho^2$. The given value of $x$ plays no part.",
    "在二元正态分布中，给定 $X = x$ 时 $Y$ 的条件方差是 $\\sigma_Y^2(1 - \\rho^2)$。与条件均值不同，它不取决于 $x$ 的值。因子 $\\rho^2$ 是 $Y$ 的方差中由 $X$ 解释的比例，所以这里相关系数的符号没有影响。若 $\\operatorname{Var}(Y) = 400$，$\\rho = -0.95$，则对每个 $x$，条件方差都是 $400(1 - 0.9025) = 39$。\n\n> **注意。** 相关系数要平方：$1 - \\rho$ 不是 $1 - \\rho^2$。给定的 $x$ 值不起作用。",
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
      mistakes: apart(answer, [
        why(Q.of(v * (10 - size), 10), "That uses $1 - \\rho$; the correlation must be squared.", "那是用了 $1 - \\rho$；相关系数要平方。"),
        why(
          Q.of(v * r * r, 100),
          "That is $\\sigma_Y^2\\rho^2$, the part of the variance that $X$ explains.",
          "那是 $\\sigma_Y^2\\rho^2$，即由 $X$ 解释的那部分方差。",
        ),
        why(
          Q.of(v),
          "That is $\\operatorname{Var}(Y)$ itself; knowing $X$ removes part of it.",
          "那是 $\\operatorname{Var}(Y)$ 本身；知道 $X$ 后会去掉其中一部分。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Square the correlation", "把相关系数平方"],
            t(
              `$\\rho^2 = ${tenths(size)}^2 = 0.${String(size * size).padStart(2, "0")}$, so $1 - \\rho^2 = 0.${100 - size * size}$.`,
              `$\\rho^2 = ${tenths(size)}^2 = 0.${String(size * size).padStart(2, "0")}$，所以 $1 - \\rho^2 = 0.${100 - size * size}$。`,
            ),
          ],
          [
            ["Scale the variance", "缩放方差"],
            t(
              `$\\operatorname{Var}(Y \\mid X = ${x}) = ${v === 1 ? "" : `${v} \\cdot `}0.${100 - size * size} = ${answer.toLatex()}$, whatever the value of $x$.`,
              `$\\operatorname{Var}(Y \\mid X = ${x}) = ${v === 1 ? "" : `${v} \\cdot `}0.${100 - size * size} = ${answer.toLatex()}$，与 $x$ 的值无关。`,
            ),
          ],
        ],
        t(
          `The explained part $\\sigma_Y^2\\rho^2 = ${Q.of(v * r * r, 100).toLatex()}$ and the conditional variance add to $${Q.of(v * r * r, 100).toLatex()} + ${answer.toLatex()} = ${v}$, the whole variance of $Y$.`,
          `被解释的部分 $\\sigma_Y^2\\rho^2 = ${Q.of(v * r * r, 100).toLatex()}$ 与条件方差之和为 $${Q.of(v * r * r, 100).toLatex()} + ${answer.toLatex()} = ${v}$，正是 $Y$ 的全部方差。`,
        ),
      ),
    });
  },
};

const noSuccessInBoth: KnowledgePointDef = {
  id: "the-probability-that-two-binomial-counts-are-both-zero",
  title: t("The probability that two binomial counts are both zero", "两个二项计数都为零的概率"),
  explanation: t(
    "Independent binomial variables with the same success probability add to another binomial, with the trial counts added. The sum is zero exactly when every one of those trials fails. So the probability comes from a single power of $1 - p$, and the two separate counts need not be handled one at a time. With $10$ and $20$ trials and $p = 0.1$, $P(X + Y = 0) = 0.9^{30}$, about $0.042$.\n\n> **Watch out.** $1 - (1 - p)^{m + n}$ is the probability of at least one success, the opposite event. And $p^{m + n}$ is the chance that every trial succeeds.",
    "成功概率相同的独立二项变量相加还是二项变量，试验次数相加。和为零，当且仅当所有这些试验都失败。所以概率来自 $1 - p$ 的一个幂，不必逐个处理两个计数。若试验次数为 $10$ 和 $20$，$p = 0.1$，则 $P(X + Y = 0) = 0.9^{30}$，约为 $0.042$。\n\n> **注意。** $1 - (1 - p)^{m + n}$ 是至少一次成功的概率，即对立事件。而 $p^{m + n}$ 是每次试验都成功的概率。",
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
      mistakes: apart(answer, [
        why(power(p, m + n), "That is the probability that every trial succeeds.", "那是每次试验都成功的概率。"),
        why(
          Q.of(1).sub(answer),
          "That is the probability of at least one success, the opposite event.",
          "那是至少一次成功的概率，即对立事件。",
        ),
        why(
          power(fail, m + n + 1),
          `That counts one trial too many; there are $${m} + ${n} = ${m + n}$ trials.`,
          `那多算了一次试验；共有 $${m} + ${n} = ${m + n}$ 次试验。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Combine the counts", "合并计数"],
            t(
              `$X + Y$ is binomial with $${m} + ${n} = ${m + n}$ trials and the same $p = ${p.toLatex()}$.`,
              `$X + Y$ 服从 $${m} + ${n} = ${m + n}$ 次试验、同样 $p = ${p.toLatex()}$ 的二项分布。`,
            ),
          ],
          [
            ["Make every trial fail", "让每次试验都失败"],
            t(
              `$X + Y = 0$ means all ${m + n} trials fail, each with probability $${fail.toLatex()}$: $\\left(${fail.toLatex()}\\right)^{${m + n}} = ${answer.toLatex()}$.`,
              `$X + Y = 0$ 表示 ${m + n} 次试验全部失败，每次失败的概率是 $${fail.toLatex()}$：$\\left(${fail.toLatex()}\\right)^{${m + n}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `Separately, $P(X = 0) = ${power(fail, m).toLatex()}$ and $P(Y = 0) = ${power(fail, n).toLatex()}$, and their product is $${answer.toLatex()}$, as independence requires.`,
          `分别地，$P(X = 0) = ${power(fail, m).toLatex()}$，$P(Y = 0) = ${power(fail, n).toLatex()}$，二者之积为 $${answer.toLatex()}$，与独立性一致。`,
        ),
      ),
    });
  },
};

const poissonSplit: KnowledgePointDef = {
  id: "a-poisson-count-given-the-total",
  title: t("A Poisson count given the total", "已知总数时的泊松计数"),
  explanation: t(
    "If $X$ and $Y$ are independent Poisson with means $\\lambda$ and $\\mu$, then knowing $X + Y = n$ turns $X$ into a binomial variable. Each of the $n$ events comes from the first source with probability $\\frac{\\lambda}{\\lambda + \\mu}$. So the conditional mean is that share of $n$, and the exponential factors disappear from the calculation. With means $30$ and $70$ and a total of $50$, each event is from the first source with probability $0.3$, so $E(X \\mid X + Y = 50) = 15$.\n\n> **Watch out.** Once the total is known, the mean $\\lambda$ alone is no longer the answer: the share $\\frac{\\lambda}{\\lambda + \\mu}$ multiplies the given total $n$.",
    "如果 $X$、$Y$ 是均值为 $\\lambda$、$\\mu$ 的独立泊松变量，那么知道 $X + Y = n$ 后，$X$ 就变成二项变量。$n$ 个事件中的每一个来自第一个来源的概率是 $\\frac{\\lambda}{\\lambda + \\mu}$。所以条件均值就是 $n$ 的这个比例，指数因子从计算中消失了。若均值为 $30$ 和 $70$，总数为 $50$，每个事件来自第一个来源的概率是 $0.3$，所以 $E(X \\mid X + Y = 50) = 15$。\n\n> **注意。** 知道总数后，答案不再是均值 $\\lambda$ 本身：要用比例 $\\frac{\\lambda}{\\lambda + \\mu}$ 乘以给定的总数 $n$。",
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
      mistakes: apart(answer, [
        why(Q.of(a), "That is the unconditional mean of $X$; the known total changes it.", "那是 $X$ 的无条件均值；已知总数会改变它。"),
        why(Q.of(n * b, a + b), "That is the conditional mean of $Y$, the other count.", "那是另一个计数 $Y$ 的条件均值。"),
        why(
          Q.of(a, a + b),
          `That is the share for one event; multiply it by the $${n}$ events.`,
          `那是单个事件的比例；还要乘以 $${n}$ 个事件。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the share", "求比例"],
            t(
              `Each of the ${n} events comes from $X$ with probability $\\frac{${a}}{${a} + ${b}} = ${Q.of(a, a + b).toLatex()}$, so $X$ given the total is binomial.`,
              `${n} 个事件中的每一个来自 $X$ 的概率是 $\\frac{${a}}{${a} + ${b}} = ${Q.of(a, a + b).toLatex()}$，所以已知总数时 $X$ 服从二项分布。`,
            ),
          ],
          [
            ["Take the binomial mean", "求二项均值"],
            t(
              `$E(X \\mid X + Y = ${n}) = ${n} \\cdot ${Q.of(a, a + b).toLatex()} = ${answer.toLatex()}$.`,
              `$E(X \\mid X + Y = ${n}) = ${n} \\cdot ${Q.of(a, a + b).toLatex()} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `Likewise $E(Y \\mid X + Y = ${n}) = ${Q.of(n * b, a + b).toLatex()}$, and the two conditional means add to $${n}$, the known total.`,
          `同理 $E(Y \\mid X + Y = ${n}) = ${Q.of(n * b, a + b).toLatex()}$，两个条件均值之和为 $${n}$，正是已知的总数。`,
        ),
      ),
    });
  },
};

const equalCovariance: KnowledgePointDef = {
  id: "the-variance-of-a-sum-with-equal-covariances",
  title: t("The variance of a sum with equal covariances", "协方差相等时和的方差"),
  explanation: t(
    "The variance of a sum is the sum of all the entries of the covariance matrix. With $n$ variables, there are $n$ variances on the diagonal and $n(n - 1)$ covariances off it, since each pair is counted twice. Forgetting that double count is the usual slip. A shared positive covariance can dominate the total as $n$ grows. With $20$ variables of variance $5$ and covariance $2$, the total is $20 \\cdot 5 + 20 \\cdot 19 \\cdot 2 = 100 + 760 = 860$, and the covariances make up most of it.\n\n> **Watch out.** Count ordered pairs, $n(n - 1)$, not unordered ones, $\\frac{n(n - 1)}{2}$: $\\operatorname{Var}(X + Y)$ already contains $2\\operatorname{Cov}(X, Y)$.",
    "和的方差是协方差矩阵所有元素之和。有 $n$ 个变量时，对角线上有 $n$ 个方差，对角线外有 $n(n - 1)$ 个协方差，因为每一对算了两次。常见的错误就是忘了这个两次。共同的正协方差在 $n$ 增大时可能成为总和的主要部分。若有 $20$ 个变量，方差为 $5$，协方差为 $2$，总和为 $20 \\cdot 5 + 20 \\cdot 19 \\cdot 2 = 100 + 760 = 860$，其中大部分来自协方差。\n\n> **注意。** 要数有序对 $n(n - 1)$，而不是无序对 $\\frac{n(n - 1)}{2}$：$\\operatorname{Var}(X + Y)$ 中本来就含有 $2\\operatorname{Cov}(X, Y)$。",
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
      mistakes: apart(answer, [
        why(n * v, "That adds only the variances and leaves out every covariance.", "那只加了方差，漏掉了所有协方差。"),
        why(
          n * v + (n * (n - 1) * c) / 2,
          `That counts each pair once; there are $${n} \\cdot ${n - 1} = ${n * (n - 1)}$ ordered pairs, so each covariance appears twice.`,
          `那把每一对只算了一次；共有 $${n} \\cdot ${n - 1} = ${n * (n - 1)}$ 个有序对，每个协方差出现两次。`,
        ),
        why(n * n * v, "That treats every entry of the matrix as a variance.", "那把矩阵的每个元素都当成了方差。"),
      ]),
      solution: walked(
        [
          [
            ["Add the diagonal", "加对角线"],
            t(
              `The ${n} variances give ${v === 1 ? `$${n}$` : `$${n} \\cdot ${v} = ${n * v}$`}.`,
              `${n} 个方差之和为 ${v === 1 ? `$${n}$` : `$${n} \\cdot ${v} = ${n * v}$`}。`,
            ),
          ],
          [
            ["Add the covariances", "加协方差"],
            t(
              `There are $${n} \\cdot ${n - 1} = ${n * (n - 1)}$ ordered pairs, giving ${c === 1 ? `$${n * (n - 1)}$` : `$${n * (n - 1)} \\cdot ${c} = ${n * (n - 1) * c}$`}.`,
              `共有 $${n} \\cdot ${n - 1} = ${n * (n - 1)}$ 个有序对，给出 ${c === 1 ? `$${n * (n - 1)}$` : `$${n * (n - 1)} \\cdot ${c} = ${n * (n - 1) * c}$`}。`,
            ),
          ],
          [
            ["Add the two parts", "两部分相加"],
            t(`$${n * v} + ${n * (n - 1) * c} = ${answer}$.`, `$${n * v} + ${n * (n - 1) * c} = ${answer}$。`),
          ],
        ],
        t(
          `Each row of the matrix adds to $${v} + ${c === 1 ? `${n - 1}` : `${n - 1} \\cdot ${c}`} = ${v + (n - 1) * c}$, and the ${n} rows give $${n} \\cdot ${v + (n - 1) * c} = ${answer}$.`,
          `矩阵每一行之和为 $${v} + ${c === 1 ? `${n - 1}` : `${n - 1} \\cdot ${c}`} = ${v + (n - 1) * c}$，${n} 行合计 $${n} \\cdot ${v + (n - 1) * c} = ${answer}$。`,
        ),
      ),
    });
  },
};

const correlationFromMatrix: KnowledgePointDef = {
  id: "a-correlation-from-a-covariance-matrix",
  title: t("A correlation from a covariance matrix", "由协方差矩阵求相关系数"),
  explanation: t(
    "A covariance matrix has variances on the diagonal and covariances off it. To get a correlation, divide the covariance by the square roots of the two relevant diagonal entries, not by the entries themselves. The result has no units and lies between $-1$ and $1$, which is a useful check on the arithmetic. For $\\begin{pmatrix} 400 & -150 \\\\ -150 & 900 \\end{pmatrix}$ the standard deviations are $20$ and $30$, so the correlation is $\\frac{-150}{20 \\cdot 30} = -\\frac{1}{4}$.\n\n> **Watch out.** Take square roots first: $\\frac{-150}{400 \\cdot 900}$ divides by the variances. And keep the sign of the covariance.",
    "协方差矩阵的对角线上是方差，对角线外是协方差。求相关系数时，要用协方差除以两个相应对角元素的平方根，而不是除以元素本身。结果没有单位，并且在 $-1$ 和 $1$ 之间，这可以用来检查计算。对 $\\begin{pmatrix} 400 & -150 \\\\ -150 & 900 \\end{pmatrix}$，标准差为 $20$ 和 $30$，所以相关系数为 $\\frac{-150}{20 \\cdot 30} = -\\frac{1}{4}$。\n\n> **注意。** 先开平方：$\\frac{-150}{400 \\cdot 900}$ 是除以了方差。还要保留协方差的符号。",
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
      mistakes: [
        why(Q.of(c, p * p * q * q), "That divides by the variances instead of the standard deviations.", "那是除以了方差，而不是标准差。"),
        why(
          Q.of(c, p + q),
          "That divides by the sum of the standard deviations instead of their product.",
          "那是除以了标准差之和，而不是它们的积。",
        ),
        why(answer.neg(), "That flips the sign; the correlation has the sign of the covariance.", "那弄反了符号；相关系数与协方差同号。"),
      ].filter((m, i, all) => all.findIndex((x) => String(x.value) === String(m.value)) === i),
      solution: walked(
        [
          [
            ["Take square roots of the diagonal", "对角元素开平方"],
            t(
              `$\\sigma_X = \\sqrt{${p * p}} = ${p}$ and $\\sigma_Y = \\sqrt{${q * q}} = ${q}$.`,
              `$\\sigma_X = \\sqrt{${p * p}} = ${p}$，$\\sigma_Y = \\sqrt{${q * q}} = ${q}$。`,
            ),
          ],
          [
            ["Divide the covariance", "用协方差相除"],
            t(
              `$\\rho = \\frac{${c}}{${p} \\cdot ${q}} = ${answer.toLatex()}$.`,
              `$\\rho = \\frac{${c}}{${p} \\cdot ${q}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$|${c}| < ${p * q}$, so the correlation lies strictly between $-1$ and $1$, and it has the sign of the covariance.`,
          `$|${c}| < ${p * q}$，所以相关系数严格介于 $-1$ 和 $1$ 之间，且与协方差同号。`,
        ),
      ),
    });
  },
};

const twoInARow: KnowledgePointDef = {
  id: "the-expected-wait-for-two-successes-in-a-row",
  title: t("The expected wait for two successes in a row", "连续两次成功的期望等待"),
  explanation: t(
    "Condition on what happens after the first success. Reaching one success takes $\\frac{1}{p}$ trials on average. One more trial follows: with probability $p$ it finishes the run, and otherwise the whole wait starts again. The law of total expectation gives an equation for the mean, and it solves to $\\frac{1 + p}{p^2}$. With $p = 0.1$ the mean wait is $\\frac{1.1}{0.01} = 110$ trials.\n\n> **Watch out.** The answer is not $\\frac{1}{p^2}$, here $100$: a failure right after a success throws that success away, which adds the extra $\\frac{1}{p}$.",
    "以第一次成功之后发生的事为条件。达到一次成功平均需要 $\\frac{1}{p}$ 次试验。接着再做一次试验：以概率 $p$ 完成连续，否则整个等待重新开始。全期望公式给出关于均值的方程，解得 $\\frac{1 + p}{p^2}$。若 $p = 0.1$，平均等待 $\\frac{1.1}{0.01} = 110$ 次试验。\n\n> **注意。** 答案不是 $\\frac{1}{p^2}$，这里即 $100$：成功之后紧接着失败，会浪费那次成功，这就多出了 $\\frac{1}{p}$。",
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
      mistakes: apart(answer, [
        why(
          Q.of(v * v, u * u),
          "That is $\\frac{1}{p^2}$; a failure after a success wastes it, which adds $\\frac{1}{p}$.",
          "那是 $\\frac{1}{p^2}$；成功后的失败会浪费这次成功，要再加 $\\frac{1}{p}$。",
        ),
        why(Q.of(2 * v, u), "That is the wait for two successes, not two in a row.", "那是等到两次成功的时间，不是连续两次。"),
        why(
          Q.of(v * (v + u), u),
          "That divides by $p$ once; solving the equation divides by $p$ twice.",
          "那只除以了一次 $p$；解方程要除以两次 $p$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Condition on the next trial", "以下一次试验为条件"],
            t(
              "Let $E$ be the mean. Reaching a success takes $\\frac{1}{p}$ trials, one more trial follows, and with probability $1 - p$ everything restarts: $E = \\frac{1}{p} + 1 + (1 - p)E$.",
              "设 $E$ 为均值。达到一次成功需要 $\\frac{1}{p}$ 次试验，接着再做一次试验，并以概率 $1 - p$ 全部重来：$E = \\frac{1}{p} + 1 + (1 - p)E$。",
            ),
          ],
          [
            ["Solve for the mean", "解出均值"],
            t(
              `$pE = \\frac{1}{p} + 1$, so $E = \\frac{1 + p}{p^2}$. With $p = ${p.toLatex()}$ this is $${answer.toLatex()}$.`,
              `$pE = \\frac{1}{p} + 1$，所以 $E = \\frac{1 + p}{p^2}$。代入 $p = ${p.toLatex()}$，得 $${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$p \\cdot E = ${p.toLatex()} \\cdot ${answer.toLatex()} = ${Q.of(v + u, u).toLatex()}$, and $\\frac{1}{p} + 1 = ${Q.of(v, u).toLatex()} + 1 = ${Q.of(v + u, u).toLatex()}$ too.`,
          `$p \\cdot E = ${p.toLatex()} \\cdot ${answer.toLatex()} = ${Q.of(v + u, u).toLatex()}$，而 $\\frac{1}{p} + 1 = ${Q.of(v, u).toLatex()} + 1 = ${Q.of(v + u, u).toLatex()}$，二者相等。`,
        ),
      ),
    });
  },
};

const dieAboveValue: KnowledgePointDef = {
  id: "the-mean-of-a-die-given-that-it-beats-a-value",
  title: t("The mean of a die given that it beats a value", "已知骰子超过某值时的均值"),
  explanation: t(
    'Conditioning on an event restricts the distribution to that event and rescales it. For a fair die told to exceed $k$, the remaining faces $k + 1, \\ldots, n$ stay equally likely. So the conditional mean is the middle of the remaining faces, the average of the smallest and largest. Only then is any weighted sum needed. For faces $1, \\ldots, 100$ and $X > 60$, the faces $61$ to $100$ remain, and $E(X \\mid X > 60) = \\frac{61 + 100}{2} = \\frac{161}{2}$.\n\n> **Watch out.** "Beats $k$" leaves out $k$ itself: start at $k + 1$, not $k$.',
    "以事件为条件，就是把分布限制在这个事件上并重新缩放。对一个已知超过 $k$ 的公平骰子，剩下的面 $k + 1, \\ldots, n$ 仍然等可能。所以条件均值是剩余面的中点，即最小值和最大值的平均。这里根本不需要加权求和。对面为 $1, \\ldots, 100$ 的骰子，已知 $X > 60$，剩下 $61$ 到 $100$，$E(X \\mid X > 60) = \\frac{61 + 100}{2} = \\frac{161}{2}$。\n\n> **注意。** 超过 $k$ 不包括 $k$ 本身：要从 $k + 1$ 开始，而不是 $k$。",
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
      mistakes: apart(answer, [
        why(
          Q.of(n + 1, 2),
          "That is the mean of the whole die; the condition removes the low faces.",
          "那是整个骰子的均值；条件去掉了较小的面。",
        ),
        why(
          Q.of(k + n, 2),
          `That starts at $${k}$, but $X > ${k}$ leaves out $${k}$ itself.`,
          `那是从 $${k}$ 开始，但 $X > ${k}$ 不包括 $${k}$ 本身。`,
        ),
        why(Q.of(n), "That is the largest face, not the average of the remaining ones.", "那是最大的面，不是剩余面的平均。"),
      ]),
      solution: walked(
        [
          [
            ["Restrict the faces", "限制面"],
            t(
              `Given $X > ${k}$, the faces $${k + 1}, \\ldots, ${n}$ remain, each equally likely.`,
              `已知 $X > ${k}$，剩下的面是 $${k + 1}, \\ldots, ${n}$，每个都等可能。`,
            ),
          ],
          [
            ["Take the middle", "取中点"],
            t(
              `$E(X \\mid X > ${k}) = \\frac{${k + 1} + ${n}}{2} = ${answer.toLatex()}$.`,
              `$E(X \\mid X > ${k}) = \\frac{${k + 1} + ${n}}{2} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `The smallest remaining face ${k + 1} and the largest ${n} are equally far from $${answer.toLatex()}$, at distance $${Q.of(n - k - 1, 2).toLatex()}$.`,
          `剩余的最小面 ${k + 1} 和最大面 ${n} 到 $${answer.toLatex()}$ 的距离相等，都是 $${Q.of(n - k - 1, 2).toLatex()}$。`,
        ),
      ),
    });
  },
};

const addingTheMean: KnowledgePointDef = {
  id: "the-sample-variance-after-adding-the-mean",
  title: t("The sample variance after adding the mean", "加入均值后的样本方差"),
  explanation: t(
    "A new observation equal to the sample mean leaves the mean unchanged and adds nothing to the sum of squared deviations. The divisor still grows from $n - 1$ to $n$, so the sample variance shrinks by the factor $\\frac{n - 1}{n}$. This also shows why filling in missing data with the mean makes a sample look less variable than it is.\n\nA sample of $5$ values with variance $8$ has squared deviations adding up to $4 \\cdot 8 = 32$. Adding the mean gives $6$ values with the same sum $32$, so the new variance is $\\frac{32}{5}$.\n\nCheck: the new value sits exactly at the mean, so its deviation is $0$ and its square adds $0$ to the $32$.\n\n> **Watch out.** The new sample has $n + 1 = 6$ values, so the divisor is $6 - 1 = 5$, not $6$: $\\frac{32}{6} = \\frac{16}{3}$ divides by the count instead of the degrees of freedom. And the variance does change, even though the mean does not.",
    "新观测值等于样本均值时，均值不变，离差平方和也没有增加。但除数从 $n - 1$ 增加到 $n$，所以样本方差缩小为原来的 $\\frac{n - 1}{n}$。这也说明，为什么用均值填补缺失数据，会使样本看起来比实际更集中。\n\n$5$ 个值的样本方差为 $8$，离差平方和为 $4 \\cdot 8 = 32$。加入均值后有 $6$ 个值，平方和仍为 $32$，所以新方差为 $\\frac{32}{5}$。\n\n检验：新值恰好在均值处，离均差为 $0$，平方后给 $32$ 加上 $0$。\n\n> **注意。** 新样本有 $n + 1 = 6$ 个值，除数是 $6 - 1 = 5$，不是 $6$：$\\frac{32}{6} = \\frac{16}{3}$ 除以的是个数而不是自由度。而且均值虽然不变，方差却变了。",
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
      mistakes: distinctMistakes(answer, [
        why(
          v,
          "This keeps the old variance; the sum of squares stays the same, but the divisor grows by one.",
          "这保留了原方差；平方和不变，但除数增加了一。",
        ),
        why(
          Q.of(v * (n - 1), n + 1),
          `This divides by the new count $${n + 1}$; the divisor is one less, $${n}$.`,
          `这除以了新的个数 $${n + 1}$；除数应少一，为 $${n}$。`,
        ),
        why(
          Q.of(v * n, n + 1),
          `This uses the factor $\\frac{${n}}{${n + 1}}$; the old divisor was $${n - 1}$ and the new one is $${n}$, so the factor is $\\frac{${n - 1}}{${n}}$.`,
          `这用了因子 $\\frac{${n}}{${n + 1}}$；原除数为 $${n - 1}$，新除数为 $${n}$，因子应为 $\\frac{${n - 1}}{${n}}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Recover the sum of squares", "还原平方和"],
            t(
              `The squared deviations add up to $(n - 1)s^{2} = ${n - 1} \\cdot ${v} = ${v * (n - 1)}$.`,
              `离差平方和为 $(n - 1)s^{2} = ${n - 1} \\cdot ${v} = ${v * (n - 1)}$。`,
            ),
          ],
          [
            ["Add the mean", "加入均值"],
            t(
              `The new value has deviation $0$, so the sum stays $${v * (n - 1)}$, and there are now $${n + 1}$ values.`,
              `新值的离均差为 $0$，平方和仍为 $${v * (n - 1)}$，现在共有 $${n + 1}$ 个值。`,
            ),
          ],
          [
            ["Divide by the new degrees of freedom", "除以新的自由度"],
            t(
              `The new variance is $\\frac{${v * (n - 1)}}{${n}} = ${answer.toLatex()}$.`,
              `新方差为 $\\frac{${v * (n - 1)}}{${n}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `The ratio of the new variance to the old is $\\frac{${n - 1}}{${n}}$, a little less than $1$: adding a value at the centre makes the sample look slightly less spread out.`,
          `新方差与原方差之比为 $\\frac{${n - 1}}{${n}}$，略小于 $1$：在中心加入一个值，样本看起来稍微更集中。`,
        ),
      ),
    });
  },
};

const correctedMean: KnowledgePointDef = {
  id: "correcting-a-sample-mean-after-a-recording-error",
  title: t("Correcting a sample mean after a recording error", "纠正记录错误后的样本均值"),
  explanation: t(
    "A sample mean is the total divided by the sample size, so a mean and a size together recover the total. When a value was recorded wrongly, the total changes by the difference between the correct and wrong values, and the size is unchanged. So the mean changes by that difference divided by the sample size, and the full data set is not needed.\n\nIf $5$ values have mean $20$ and a $12$ was recorded instead of $22$, the total $100$ becomes $100 + 10 = 110$, and the correct mean is $\\frac{110}{5} = 22$.\n\nCheck: the mean rose by $\\frac{10}{5} = 2$, the difference shared among the $5$ values.\n\n> **Watch out.** The difference is shared among all $n$ values, not added to the mean whole: adding $10$ to the mean $20$ would give $30$. And the size stays $5$, because a value was corrected, not added.",
    "样本均值是总和除以样本量，所以均值和样本量一起就能恢复总和。某个值记录错误时，总和的变化就是正确值与错误值之差，样本量不变。所以均值的变化是这个差除以样本量，不需要完整的数据。\n\n若 $5$ 个值的均值为 $20$，其中 $22$ 被记成了 $12$，则总和 $100$ 变为 $100 + 10 = 110$，正确均值为 $\\frac{110}{5} = 22$。\n\n检验：均值增加了 $\\frac{10}{5} = 2$，即这个差由 $5$ 个值分摊。\n\n> **注意。** 差要由全部 $n$ 个值分摊，而不是整个加到均值上：把 $10$ 加到均值 $20$ 上会得到 $30$。另外样本量仍是 $5$，因为只是改正了一个值，没有增加值。",
  ),
  generate(rng) {
    const n = rng.int(4, 12);
    const mean = rng.int(10, 60);
    const wrongValue = rng.int(5, 40);
    const right = rng.pick([...Array(40).keys()].map((i) => i + 5).filter((v) => v !== wrongValue));
    const answer = Q.of(mean).add(Q.of(right - wrongValue, n));
    const total = n * mean;
    const fixed = total + right - wrongValue;
    const gap = right - wrongValue;
    return numberProblem({
      prompt: t(
        `A sample of ${n} values has mean ${mean}, but one value was recorded as ${wrongValue} instead of ${right}. Find the correct mean.`,
        `${n} 个值的均值是 ${mean}，但其中一个值被记成了 ${wrongValue}，实际是 ${right}。求正确的均值。`,
      ),
      answer,
      wrong: [Q.of(mean)],
      mistakes: distinctMistakes(answer, [
        why(
          Q.of(mean + gap),
          `This adds the whole difference $${gap}$ to the mean; it is shared among the $${n}$ values.`,
          `这把整个差 $${gap}$ 加到了均值上；它应由 $${n}$ 个值分摊。`,
        ),
        why(
          Q.of(total + right, n + 1),
          `This adds $${right}$ as a new value, making $${n + 1}$ values, but the wrong value must be replaced, not kept.`,
          `这把 $${right}$ 当作新值加入，变成 $${n + 1}$ 个值，但错误的值应被替换，而不是保留。`,
        ),
        why(
          Q.of(mean).sub(Q.of(gap, n)),
          `This shifts the mean the wrong way: the total changes by $${right} - ${wrongValue}$, not $${wrongValue} - ${right}$.`,
          `这使均值向反方向移动：总和的变化是 $${right} - ${wrongValue}$，而不是 $${wrongValue} - ${right}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Recover the total", "恢复总和"],
            t(`The recorded total is $${n} \\cdot ${mean} = ${total}$.`, `记录的总和为 $${n} \\cdot ${mean} = ${total}$。`),
          ],
          [
            ["Correct the total", "修正总和"],
            t(
              `Replacing $${wrongValue}$ by $${right}$ gives $${total} - ${wrongValue} + ${right} = ${fixed}$.`,
              `把 $${wrongValue}$ 换成 $${right}$，得 $${total} - ${wrongValue} + ${right} = ${fixed}$。`,
            ),
          ],
          [
            ["Divide by the same size", "除以原样本量"],
            t(`$\\frac{${fixed}}{${n}} = ${answer.toLatex()}$.`, `$\\frac{${fixed}}{${n}} = ${answer.toLatex()}$。`),
          ],
        ],
        t(
          `The mean ${gap > 0 ? "rose" : "fell"} by $\\frac{${Math.abs(gap)}}{${n}}$, the difference shared among the $${n}$ values: $${mean} ${gap > 0 ? "+" : "-"} \\frac{${Math.abs(gap)}}{${n}} = ${answer.toLatex()}$.`,
          `均值${gap > 0 ? "增加" : "减少"}了 $\\frac{${Math.abs(gap)}}{${n}}$，即差由 $${n}$ 个值分摊：$${mean} ${gap > 0 ? "+" : "-"} \\frac{${Math.abs(gap)}}{${n}} = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
};

const uniformEndpoint: KnowledgePointDef = {
  id: "an-endpoint-of-a-uniform-by-the-method-of-moments",
  title: t("An endpoint of a uniform by the method of moments", "用矩法估计均匀分布的端点"),
  explanation: t(
    "A uniform distribution on $[a, b]$ has mean $\\frac{a + b}{2}$ and variance $\\frac{(b - a)^2}{12}$. Matching these to the sample gives two equations. The variance gives the width $b - a$, after a square root, and the mean gives the midpoint. Each endpoint then lies half a width from the midpoint, and so the two estimates follow together.\n\nA sample with mean $5$ and variance $3$ gives $\\frac{w^{2}}{12} = 3$, so $w^{2} = 36$ and $w = 6$. The endpoints are $5 - 3 = 2$ and $5 + 3 = 8$.\n\nCheck: the uniform distribution on $[2, 8]$ has mean $\\frac{2 + 8}{2} = 5$ and variance $\\frac{6^{2}}{12} = 3$, matching the sample.\n\n> **Watch out.** The mean is the midpoint, so $b$ is half a width above it: $5 + 6 = 11$ adds a full width and overshoots by half a width. And take the square root of $12 \\cdot 3$, not of $3$ alone.",
    "$[a, b]$ 上的均匀分布，均值是 $\\frac{a + b}{2}$，方差是 $\\frac{(b - a)^2}{12}$。让它们与样本相等，就得到两个方程。方差开平方后给出宽度 $b - a$，均值给出中点。每个端点都与中点相距半个宽度，所以两个估计值一起得到。\n\n样本均值为 $5$、方差为 $3$ 时，$\\frac{w^{2}}{12} = 3$，所以 $w^{2} = 36$，$w = 6$。端点为 $5 - 3 = 2$ 和 $5 + 3 = 8$。\n\n检验：$[2, 8]$ 上的均匀分布均值为 $\\frac{2 + 8}{2} = 5$，方差为 $\\frac{6^{2}}{12} = 3$，与样本一致。\n\n> **注意。** 均值是中点，所以 $b$ 在它上方半个宽度：$5 + 6 = 11$ 多走了半个宽度。并且要对 $12 \\cdot 3$ 开平方，而不是只对 $3$ 开平方。",
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
      mistakes: distinctMistakes(answer, [
        why(
          mean + width,
          "This adds the whole width to the mean; the mean is the midpoint, so $b$ is only half a width above it.",
          "这把整个宽度加到均值上；均值是中点，$b$ 只比它高半个宽度。",
        ),
        why(Q.of(mean).sub(half), "This is the lower endpoint $a$, half a width below the mean.", "这是下端点 $a$，比均值低半个宽度。"),
        why(
          Q.of(mean).add(variance),
          "This adds the variance to the mean; the variance first gives the width through $w^{2} = 12\\sigma^{2}$.",
          "这把方差加到均值上；方差要先通过 $w^{2} = 12\\sigma^{2}$ 给出宽度。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the width", "求宽度"],
            t(
              `From $\\frac{w^{2}}{12} = ${variance.toLatex()}$, $w^{2} = ${width * width}$ and $w = ${width}$.`,
              `由 $\\frac{w^{2}}{12} = ${variance.toLatex()}$ 得 $w^{2} = ${width * width}$，$w = ${width}$。`,
            ),
          ],
          [
            ["Step up from the midpoint", "从中点向上"],
            t(`$b = ${mean} + \\frac{${width}}{2} = ${answer.toLatex()}$.`, `$b = ${mean} + \\frac{${width}}{2} = ${answer.toLatex()}$。`),
          ],
        ],
        t(
          `With $a = ${Q.of(mean).sub(half).toLatex()}$ and $b = ${answer.toLatex()}$, the midpoint is $${mean}$ and $\\frac{(b - a)^{2}}{12} = \\frac{${width * width}}{12} = ${variance.toLatex()}$, matching the sample.`,
          `取 $a = ${Q.of(mean).sub(half).toLatex()}$，$b = ${answer.toLatex()}$，中点为 $${mean}$，$\\frac{(b - a)^{2}}{12} = \\frac{${width * width}}{12} = ${variance.toLatex()}$，与样本一致。`,
        ),
      ),
    });
  },
};

const sizeBehindEstimate: KnowledgePointDef = {
  id: "the-sample-size-behind-an-estimated-proportion",
  title: t("The sample size behind an estimated proportion", "估计比例背后的样本量"),
  explanation: t(
    "The estimated variance of a sample proportion is $\\frac{\\hat{p}(1 - \\hat{p})}{n}$. Published results often give only the estimate and its variance or margin, and the formula then shows how large the sample must have been. Multiply $\\hat{p}$ by $1 - \\hat{p}$, and divide by the stated variance. This makes it possible to check a claim about precision.\n\nWith $\\hat{p} = \\frac{1}{5}$ and estimated variance $\\frac{1}{1250}$: $\\hat{p}(1 - \\hat{p}) = \\frac{1}{5} \\cdot \\frac{4}{5} = \\frac{4}{25}$, and $n = \\frac{4}{25} \\div \\frac{1}{1250} = 200$.\n\nCheck: $\\frac{4}{25} \\div 200 = \\frac{4}{5000} = \\frac{1}{1250}$, the stated variance.\n\n> **Watch out.** The numerator is $\\hat{p}(1 - \\hat{p})$, not $\\hat{p}$: $\\frac{1}{5} \\div \\frac{1}{1250} = 250$ is too large. And divide by the variance, not by its square root, which would be the standard error.",
    "样本比例的估计方差是 $\\frac{\\hat{p}(1 - \\hat{p})}{n}$。发表的结果常常只给估计值及其方差或误差范围，这个公式就能说明样本必须有多大。用 $\\hat{p}$ 乘以 $1 - \\hat{p}$，再除以给出的方差。这样就能核对关于精度的说法。\n\n若 $\\hat{p} = \\frac{1}{5}$，估计方差为 $\\frac{1}{1250}$：$\\hat{p}(1 - \\hat{p}) = \\frac{1}{5} \\cdot \\frac{4}{5} = \\frac{4}{25}$，$n = \\frac{4}{25} \\div \\frac{1}{1250} = 200$。\n\n检验：$\\frac{4}{25} \\div 200 = \\frac{4}{5000} = \\frac{1}{1250}$，正是给出的方差。\n\n> **注意。** 分子是 $\\hat{p}(1 - \\hat{p})$，不是 $\\hat{p}$：$\\frac{1}{5} \\div \\frac{1}{1250} = 250$ 偏大。并且要除以方差，而不是它的平方根（那是标准误）。",
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
      mistakes: distinctMistakes(n, [
        why(
          p.div(variance),
          "This divides $\\hat{p}$ alone by the variance; the numerator is $\\hat{p}(1 - \\hat{p})$.",
          "这只用 $\\hat{p}$ 除以方差；分子应为 $\\hat{p}(1 - \\hat{p})$。",
        ),
        why(
          Q.one.sub(p).div(variance),
          "This divides $1 - \\hat{p}$ alone by the variance; the numerator is the product $\\hat{p}(1 - \\hat{p})$.",
          "这只用 $1 - \\hat{p}$ 除以方差；分子应为乘积 $\\hat{p}(1 - \\hat{p})$。",
        ),
        why(
          Q.one.div(variance),
          "This takes the reciprocal of the variance and forgets the factor $\\hat{p}(1 - \\hat{p})$.",
          "这取了方差的倒数，漏掉了因子 $\\hat{p}(1 - \\hat{p})$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Multiply the proportions", "两个比例相乘"],
            t(
              `$\\hat{p}(1 - \\hat{p}) = ${p.toLatex()} \\cdot ${Q.one.sub(p).toLatex()} = ${product.toLatex()}$.`,
              `$\\hat{p}(1 - \\hat{p}) = ${p.toLatex()} \\cdot ${Q.one.sub(p).toLatex()} = ${product.toLatex()}$。`,
            ),
          ],
          [
            ["Divide by the variance", "除以方差"],
            t(
              `$n = ${product.toLatex()} \\div ${variance.toLatex()} = ${n}$.`,
              `$n = ${product.toLatex()} \\div ${variance.toLatex()} = ${n}$。`,
            ),
          ],
        ],
        t(
          `Putting $n = ${n}$ back: $\\frac{${product.toLatex()}}{${n}} = ${variance.toLatex()}$, the stated variance.`,
          `代回 $n = ${n}$：$\\frac{${product.toLatex()}}{${n}} = ${variance.toLatex()}$，正是给出的方差。`,
        ),
      ),
    });
  },
};

const telescopingProduct: KnowledgePointDef = {
  id: "a-telescoping-product",
  title: t("A telescoping product", "裂项乘积"),
  explanation: t(
    "In a product of fractions such as $\\frac{i + 1}{i}$, each numerator cancels the denominator of the next factor. Only the last numerator and the first denominator survive, so the whole product collapses to a single fraction. Write out the first few factors and the last few, and the pattern of cancellation becomes clear.\n\nFor $\\prod_{i=2}^{5} \\frac{i + 1}{i} = \\frac{3}{2} \\cdot \\frac{4}{3} \\cdot \\frac{5}{4} \\cdot \\frac{6}{5}$, the $3$, $4$ and $5$ cancel, leaving $\\frac{6}{2} = 3$.\n\nCheck: multiplying step by step, $\\frac{3}{2} \\cdot \\frac{4}{3} = 2$, then $2 \\cdot \\frac{5}{4} = \\frac{5}{2}$, then $\\frac{5}{2} \\cdot \\frac{6}{5} = 3$.\n\n> **Watch out.** The last factor is $\\frac{5 + 1}{5}$, so the surviving numerator is $6$, not $5$: $\\frac{5}{2}$ stops one factor early. And the first denominator is the starting index $2$, not $1$.",
    "在 $\\frac{i + 1}{i}$ 这样的分式乘积中，每个分子都与下一个因子的分母相消。只有最后的分子和最初的分母留下来，所以整个乘积化成一个分式。写出前几个因子和后几个因子，相消的规律就清楚了。\n\n例如 $\\prod_{i=2}^{5} \\frac{i + 1}{i} = \\frac{3}{2} \\cdot \\frac{4}{3} \\cdot \\frac{5}{4} \\cdot \\frac{6}{5}$，$3$、$4$、$5$ 相消，剩下 $\\frac{6}{2} = 3$。\n\n检验：逐步相乘，$\\frac{3}{2} \\cdot \\frac{4}{3} = 2$，$2 \\cdot \\frac{5}{4} = \\frac{5}{2}$，$\\frac{5}{2} \\cdot \\frac{6}{5} = 3$。\n\n> **注意。** 最后一个因子是 $\\frac{5 + 1}{5}$，所以留下的分子是 $6$ 而不是 $5$：$\\frac{5}{2}$ 少乘了一个因子。最初的分母是起始下标 $2$，不是 $1$。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = rng.int(a + 1, a + 20);
    const answer = Q.of(b + 1, a);
    const fr = (top: number | string, bottom: number) => (bottom === 1 ? `${top}` : `\\frac{${top}}{${bottom}}`);
    return numberProblem({
      prompt: t(`Find $\\prod_{i=${a}}^{${b}} \\frac{i + 1}{i}$.`, `求 $\\prod_{i=${a}}^{${b}} \\frac{i + 1}{i}$。`),
      answer,
      wrong: [Q.of(b, a), Q.of(b + 1, a + 1), Q.of(b - a + 1)],
      mistakes: distinctMistakes(answer, [
        why(
          Q.of(b, a),
          `This stops one factor early; the last factor is $\\frac{${b + 1}}{${b}}$, so the surviving numerator is $${b + 1}$.`,
          `这少乘了最后一个因子；最后的因子是 $\\frac{${b + 1}}{${b}}$，留下的分子是 $${b + 1}$。`,
        ),
        why(
          Q.of(b + 1, a + 1),
          `This uses $${a + 1}$ as the first denominator; the first factor is $${fr(a + 1, a)}$, so the denominator $${a}$ survives.`,
          `这把 $${a + 1}$ 当作最初的分母；第一个因子是 $${fr(a + 1, a)}$，留下的分母是 $${a}$。`,
        ),
        why(b - a + 1, "This is the number of factors, not their product.", "这是因子的个数，不是它们的乘积。"),
      ]),
      solution: walked(
        [
          [
            ["Write out the factors", "写出各因子"],
            t(
              `$\\prod_{i=${a}}^{${b}} \\frac{i + 1}{i} = ${fr(a + 1, a)} \\cdot \\frac{${a + 2}}{${a + 1}} \\cdots \\frac{${b + 1}}{${b}}$.`,
              `$\\prod_{i=${a}}^{${b}} \\frac{i + 1}{i} = ${fr(a + 1, a)} \\cdot \\frac{${a + 2}}{${a + 1}} \\cdots \\frac{${b + 1}}{${b}}$。`,
            ),
          ],
          [
            ["Cancel in a chain", "依次相消"],
            t(
              `Each numerator cancels the next denominator, leaving the last numerator $${b + 1}$ over the first denominator $${a}$, which is $${answer.toLatex()}$.`,
              `每个分子与下一个分母相消，留下最后的分子 $${b + 1}$ 和最初的分母 $${a}$，即 $${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `The first $k$ factors multiply to $${fr(`${a} + k`, a)}$; there are $${b} - ${a} + 1 = ${b - a + 1}$ factors, and $${fr(`${a} + ${b - a + 1}`, a)} = ${answer.toLatex()}$ agrees.`,
          `前 $k$ 个因子之积为 $${fr(`${a} + k`, a)}$；共有 $${b} - ${a} + 1 = ${b - a + 1}$ 个因子，$${fr(`${a} + ${b - a + 1}`, a)} = ${answer.toLatex()}$，结果一致。`,
        ),
      ),
    });
  },
};

const logDerivativeAtZero: KnowledgePointDef = {
  id: "the-relative-rate-of-a-product-of-powers",
  title: t("The relative rate of a product of powers", "幂的乘积的相对变化率"),
  explanation: t(
    "Taking logarithms turns a product of powers into a sum, with each exponent as a multiplier and any denominator as a subtraction. Differentiating then gives the relative rate $\\frac{f'}{f}$ as a sum of simple fractions, without the full product rule and without computing $f$ itself, which could be very large.\n\nFor example, $f(x) = \\frac{(x + 1)^{2}(x + 2)^{3}}{x + 4}$ has $\\ln f = 2\\ln(x + 1) + 3\\ln(x + 2) - \\ln(x + 4)$, so at $x = 0$\n\n$$\\frac{f'(0)}{f(0)} = \\frac{2}{1} + \\frac{3}{2} - \\frac{1}{4} = \\frac{13}{4}.$$\n\nCheck: $f(0) = 2$, and the difference quotient of $f$ over $x = \\pm 0.01$ is about $6.500$. Dividing by $2$ gives about $3.250$, which is $\\frac{13}{4}$.\n\n> **Watch out.** The factor in the denominator is subtracted, not added. And the result is $\\frac{f'}{f}$, not $f'$: to get $f'(0)$ itself, multiply by $f(0)$.",
    "取对数把幂的乘积变成和，每个指数成为乘数，分母成为减项。然后求导，就得到相对变化率 $\\frac{f'}{f}$，它是几个简单分式之和，不用完整的乘积法则，也不用计算可能很大的 $f$ 本身。\n\n例如 $f(x) = \\frac{(x + 1)^{2}(x + 2)^{3}}{x + 4}$ 有 $\\ln f = 2\\ln(x + 1) + 3\\ln(x + 2) - \\ln(x + 4)$，所以在 $x = 0$ 处\n\n$$\\frac{f'(0)}{f(0)} = \\frac{2}{1} + \\frac{3}{2} - \\frac{1}{4} = \\frac{13}{4}.$$\n\n检验：$f(0) = 2$，$f$ 在 $x = \\pm 0.01$ 之间的差商约为 $6.500$。除以 $2$ 约为 $3.250$，正是 $\\frac{13}{4}$。\n\n> **注意。** 分母中的因子是减去，不是加上。并且结果是 $\\frac{f'}{f}$，不是 $f'$：要得到 $f'(0)$ 本身，还要乘以 $f(0)$。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const c = rng.pick([1, 2, 3, 4, 5, 6, 7, 8].filter((v) => v !== a && v !== b));
    const p = rng.int(2, 4);
    const q = rng.int(2, 4);
    const r = rng.int(2, 4);
    const left = Q.of(p, a).add(Q.of(q, b));
    const right = Q.of(r, c);
    const answer = left.sub(right);
    const f = (x: number) => ((x + a) ** p * (x + b) ** q) / (x + c) ** r;
    const ratio = (f(0.001) - f(-0.001)) / 0.002 / f(0);
    const lnF = `${p}\\ln(x + ${a}) + ${q}\\ln(x + ${b}) - ${r}\\ln(x + ${c})`;
    const first = stepLabel(1, "take logarithms", "取对数");
    const second = stepLabel(2, "differentiate and evaluate", "求导并取值");
    const sum = steps(
      `\\frac{f'(x)}{f(x)} = \\frac{${p}}{x + ${a}} + \\frac{${q}}{x + ${b}} - \\frac{${r}}{x + ${c}}`,
      `\\frac{f'(0)}{f(0)} = \\frac{${p}}{${a}} + \\frac{${q}}{${b}} - \\frac{${r}}{${c}} = ${answer.toLatex()}`,
    );
    const approx = answer.isInteger() ? "" : ` \\approx ${(Math.round(answer.toNumber() * 1000) / 1000).toString()}`;
    return numberProblem({
      prompt: t(
        `Let $f(x) = \\frac{(x + ${a})^{${p}}(x + ${b})^{${q}}}{(x + ${c})^{${r}}}$. Find $\\frac{f'(0)}{f(0)}$.`,
        `设 $f(x) = \\frac{(x + ${a})^{${p}}(x + ${b})^{${q}}}{(x + ${c})^{${r}}}$。求 $\\frac{f'(0)}{f(0)}$。`,
      ),
      answer,
      wrong: [left.add(right), left, answer.neg()],
      solution: joinText([
        t(
          `${first.en} Each exponent becomes a multiplier, and the factor in the denominator is subtracted:${steps(`\\ln f(x) = ${lnF}`)}`,
          `${first["zh-CN"]}每个指数变成乘数，分母中的因子变成减项：${steps(`\\ln f(x) = ${lnF}`)}`,
        ),
        t(
          `${second.en} The derivative of $\\ln f$ is $\\frac{f'}{f}$, and each logarithm gives one over its argument. Then put in $x = 0$:${sum}`,
          `${second["zh-CN"]}$\\ln f$ 的导数是 $\\frac{f'}{f}$，每个对数求导后是它的真数分之一。再代入 $x = 0$：${sum}`,
        ),
        t(
          `**Check.** Without logarithms: the difference quotient of $f$ over $x = \\pm 0.001$, divided by $f(0)$, is about $${(Math.round(ratio * 1000) / 1000).toString()}$, which agrees with $${answer.toLatex()}${approx}$.`,
          `**检验。** 不用对数：$f$ 在 $x = \\pm 0.001$ 之间的差商除以 $f(0)$，约为 $${(Math.round(ratio * 1000) / 1000).toString()}$，与 $${answer.toLatex()}${approx}$ 相符。`,
        ),
      ]),
    });
  },
};

const poissonMle: KnowledgePointDef = {
  id: "maximizing-a-poisson-log-likelihood",
  title: t("Maximizing a Poisson log-likelihood", "使泊松对数似然最大"),
  explanation: t(
    "For a Poisson sample, the log-likelihood is $\\ell(\\lambda) = -n\\lambda + (\\sum x_i)\\ln\\lambda$ plus terms free of $\\lambda$. Its derivative is $-n + \\frac{\\sum x_i}{\\lambda}$. Setting this to zero gives the sample mean. The second derivative is negative, so this is a true maximum. The factorials in the likelihood do not affect the result.\n\nFor the sample $2, 4, 3$: $n = 3$ and $\\sum x_i = 9$, so $\\ell'(\\lambda) = -3 + \\frac{9}{\\lambda}$, which is zero at $\\hat{\\lambda} = 3$.\n\nCheck: $\\ell''(\\lambda) = -\\frac{9}{\\lambda^{2}} < 0$, so $\\lambda = 3$ is a maximum, and it is the sample mean $\\frac{9}{3}$.\n\n> **Watch out.** Solving $-n + \\frac{\\sum x_i}{\\lambda} = 0$ gives $\\lambda = \\frac{\\sum x_i}{n}$, not $\\frac{n}{\\sum x_i} = \\frac{1}{3}$; the Poisson mean is $\\lambda$ itself, so its estimate is the sample mean, not its reciprocal.",
    "对泊松样本，对数似然是 $\\ell(\\lambda) = -n\\lambda + (\\sum x_i)\\ln\\lambda$ 加上不含 $\\lambda$ 的项。它的导数是 $-n + \\frac{\\sum x_i}{\\lambda}$。令它为零，得到样本均值。二阶导数为负，所以这确实是最大值。似然中的阶乘不影响结果。\n\n例如样本 $2, 4, 3$：$n = 3$，$\\sum x_i = 9$，所以 $\\ell'(\\lambda) = -3 + \\frac{9}{\\lambda}$，在 $\\hat{\\lambda} = 3$ 处为零。\n\n检验：$\\ell''(\\lambda) = -\\frac{9}{\\lambda^{2}} < 0$，所以 $\\lambda = 3$ 是最大值，它正是样本均值 $\\frac{9}{3}$。\n\n> **注意。** 解 $-n + \\frac{\\sum x_i}{\\lambda} = 0$ 得 $\\lambda = \\frac{\\sum x_i}{n}$，不是 $\\frac{n}{\\sum x_i} = \\frac{1}{3}$；泊松分布的均值就是 $\\lambda$，所以它的估计是样本均值，而不是其倒数。",
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
      mistakes: distinctMistakes(answer, [
        why(
          Q.of(n, sum),
          "This inverts the solution; $-n + \\frac{\\sum x_i}{\\lambda} = 0$ gives $\\lambda = \\frac{\\sum x_i}{n}$.",
          "这把解颠倒了；$-n + \\frac{\\sum x_i}{\\lambda} = 0$ 给出 $\\lambda = \\frac{\\sum x_i}{n}$。",
        ),
        why(
          sum,
          "This is the total count; the derivative also has the term $-n$, so the total is divided by $n$.",
          "这是总计数；导数中还有 $-n$ 项，所以总数要除以 $n$。",
        ),
        why(
          Q.of(sum, n + 1),
          `This divides by $${n + 1}$; the sample has $n = ${n}$ values.`,
          `这除以了 $${n + 1}$；样本只有 $n = ${n}$ 个值。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Write the log-likelihood", "写出对数似然"],
            t(
              `With $n = ${n}$ and $\\sum x_i = ${data.join(" + ")} = ${sum}$, $\\ell(\\lambda) = -${n}\\lambda + ${sum}\\ln\\lambda$ plus terms free of $\\lambda$.`,
              `由 $n = ${n}$，$\\sum x_i = ${data.join(" + ")} = ${sum}$，$\\ell(\\lambda) = -${n}\\lambda + ${sum}\\ln\\lambda$ 加上不含 $\\lambda$ 的项。`,
            ),
          ],
          [
            ["Set the derivative to zero", "令导数为零"],
            t(
              `$\\ell'(\\lambda) = -${n} + \\frac{${sum}}{\\lambda} = 0$ gives $\\lambda = \\frac{${sum}}{${n}}${lowestTerms(sum, n)}$, the sample mean.`,
              `$\\ell'(\\lambda) = -${n} + \\frac{${sum}}{\\lambda} = 0$ 给出 $\\lambda = \\frac{${sum}}{${n}}${lowestTerms(sum, n)}$，即样本均值。`,
            ),
          ],
        ],
        t(
          `The second derivative $-\\frac{${sum}}{\\lambda^{2}}$ is negative, so $${answer.toLatex()}$ is a maximum, not a minimum.`,
          `二阶导数 $-\\frac{${sum}}{\\lambda^{2}}$ 为负，所以 $${answer.toLatex()}$ 是最大值而不是最小值。`,
        ),
      ),
    });
  },
};

const exponentialMle: KnowledgePointDef = {
  id: "maximizing-an-exponential-log-likelihood",
  title: t("Maximizing an exponential log-likelihood", "使指数对数似然最大"),
  explanation: t(
    "For an exponential sample, the log-likelihood is $\\ell(\\lambda) = n\\ln\\lambda - \\lambda\\sum x_i$, and its derivative is $\\frac{n}{\\lambda} - \\sum x_i$. Setting this to zero gives $\\hat{\\lambda} = \\frac{n}{\\sum x_i}$, the reciprocal of the sample mean. That makes sense, because the mean of the distribution is the reciprocal of its rate.\n\nFor $4$ values with $\\sum x_i = 10$: $\\ell'(\\lambda) = \\frac{4}{\\lambda} - 10 = 0$ gives $\\hat{\\lambda} = \\frac{4}{10} = \\frac{2}{5}$.\n\nCheck: the sample mean is $\\frac{10}{4} = \\frac{5}{2}$, and an exponential with rate $\\frac{2}{5}$ has mean $\\frac{1}{2/5} = \\frac{5}{2}$, which matches.\n\n> **Watch out.** $\\frac{\\sum x_i}{n} = \\frac{5}{2}$ estimates the mean $\\frac{1}{\\lambda}$, not the rate $\\lambda$; the rate is its reciprocal.",
    "对指数样本，对数似然是 $\\ell(\\lambda) = n\\ln\\lambda - \\lambda\\sum x_i$，导数是 $\\frac{n}{\\lambda} - \\sum x_i$。令它为零，得 $\\hat{\\lambda} = \\frac{n}{\\sum x_i}$，即样本均值的倒数。这是合理的，因为这个分布的均值正是速率的倒数。\n\n若 $4$ 个值满足 $\\sum x_i = 10$：$\\ell'(\\lambda) = \\frac{4}{\\lambda} - 10 = 0$ 得 $\\hat{\\lambda} = \\frac{4}{10} = \\frac{2}{5}$。\n\n检验：样本均值为 $\\frac{10}{4} = \\frac{5}{2}$，速率为 $\\frac{2}{5}$ 的指数分布均值为 $\\frac{1}{2/5} = \\frac{5}{2}$，两者一致。\n\n> **注意。** $\\frac{\\sum x_i}{n} = \\frac{5}{2}$ 估计的是均值 $\\frac{1}{\\lambda}$，不是速率 $\\lambda$；速率是它的倒数。",
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
      mistakes: distinctMistakes(answer, [
        why(
          Q.of(sum, n),
          "This is the sample mean, which estimates the mean $\\frac{1}{\\lambda}$; the rate is its reciprocal.",
          "这是样本均值，它估计的是均值 $\\frac{1}{\\lambda}$；速率是它的倒数。",
        ),
        why(
          Q.of(1, sum),
          "This drops the factor $n$; the term $n\\ln\\lambda$ differentiates to $\\frac{n}{\\lambda}$.",
          "这漏掉了因子 $n$；$n\\ln\\lambda$ 的导数是 $\\frac{n}{\\lambda}$。",
        ),
        why(Q.of(n + 1, sum), `This uses $${n + 1}$ in place of $n = ${n}$.`, `这用 $${n + 1}$ 代替了 $n = ${n}$。`),
      ]),
      solution: walked(
        [
          [
            ["Write the log-likelihood", "写出对数似然"],
            t(`$\\ell(\\lambda) = ${n}\\ln\\lambda - ${sum}\\lambda$.`, `$\\ell(\\lambda) = ${n}\\ln\\lambda - ${sum}\\lambda$。`),
          ],
          [
            ["Set the derivative to zero", "令导数为零"],
            t(
              `$\\ell'(\\lambda) = \\frac{${n}}{\\lambda} - ${sum} = 0$ gives $\\lambda = \\frac{${n}}{${sum}}${lowestTerms(n, sum)}$.`,
              `$\\ell'(\\lambda) = \\frac{${n}}{\\lambda} - ${sum} = 0$ 给出 $\\lambda = \\frac{${n}}{${sum}}${lowestTerms(n, sum)}$。`,
            ),
          ],
        ],
        t(
          `The second derivative $-\\frac{${n}}{\\lambda^{2}}$ is negative, so this is a maximum; and the fitted mean $\\frac{1}{\\lambda} = ${Q.of(sum, n).toLatex()}$ equals the sample mean $\\frac{${sum}}{${n}}$.`,
          `二阶导数 $-\\frac{${n}}{\\lambda^{2}}$ 为负，所以这是最大值；拟合的均值 $\\frac{1}{\\lambda} = ${Q.of(sum, n).toLatex()}$ 等于样本均值 $\\frac{${sum}}{${n}}$。`,
        ),
      ),
    });
  },
};

const geometricMle: KnowledgePointDef = {
  id: "the-best-p-for-a-geometric-sample",
  title: t("The best $p$ for a geometric sample", "几何样本的最优 $p$"),
  explanation: t(
    "If $X$ counts the trials up to and including the first success, the likelihood of a sample is $p^n(1 - p)^{\\sum x_i - n}$. The exponents count the successes and the failures. Maximizing it gives $\\hat{p} = \\frac{n}{\\sum x_i}$, the share of all trials that were successes, which is the estimate common sense suggests.\n\nFor the runs $2, 3, 5$: there are $3$ successes in $10$ trials, so the likelihood is $p^{3}(1 - p)^{7}$ and $\\hat{p} = \\frac{3}{10}$.\n\nCheck: the log-likelihood $3\\ln p + 7\\ln(1 - p)$ has derivative $\\frac{3}{p} - \\frac{7}{1 - p}$, which is zero when $3(1 - p) = 7p$, that is at $p = \\frac{3}{10}$.\n\n> **Watch out.** The estimate is successes over trials, $\\frac{n}{\\sum x_i}$, not $\\frac{\\sum x_i}{n} = \\frac{10}{3}$, which is the mean run length and is not even a probability.",
    "如果 $X$ 是到第一次成功为止（含这一次）的试验次数，样本的似然是 $p^n(1 - p)^{\\sum x_i - n}$。指数分别是成功和失败的次数。使它最大，得 $\\hat{p} = \\frac{n}{\\sum x_i}$，即所有试验中成功的比例，这正是常识所提示的估计。\n\n例如各轮次数为 $2, 3, 5$：$10$ 次试验中有 $3$ 次成功，似然为 $p^{3}(1 - p)^{7}$，$\\hat{p} = \\frac{3}{10}$。\n\n检验：对数似然 $3\\ln p + 7\\ln(1 - p)$ 的导数为 $\\frac{3}{p} - \\frac{7}{1 - p}$，当 $3(1 - p) = 7p$，即 $p = \\frac{3}{10}$ 时为零。\n\n> **注意。** 估计是成功次数除以试验次数 $\\frac{n}{\\sum x_i}$，不是 $\\frac{\\sum x_i}{n} = \\frac{10}{3}$：那是平均每轮的次数，甚至不是一个概率。",
  ),
  generate(rng) {
    const n = rng.int(4, 6);
    const drawn = sampleOf(rng, n, 1, 9);
    // At least one failure, so that the likelihood peaks inside (0, 1).
    const data = drawn.every((x) => x === 1) ? [2, ...drawn.slice(1)] : drawn;
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
      mistakes: distinctMistakes(answer, [
        why(
          Q.of(sum, n),
          "This is the mean number of trials per run, the reciprocal of the estimate; a probability cannot exceed $1$.",
          "这是每轮的平均试验次数，是估计值的倒数；概率不能超过 $1$。",
        ),
        why(
          Q.of(n, sum + n),
          "This adds the successes to the trial count again; each count already includes its own success.",
          "这把成功次数又加到了试验次数上；每个计数已经包含了它自己的那次成功。",
        ),
        why(
          Q.of(1, sum),
          `This counts only one success; there are $${n}$ runs, each ending in a success.`,
          `这只计了一次成功；共有 $${n}$ 轮，每轮都以一次成功结束。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Count successes and failures", "数成功与失败"],
            t(
              `The ${n} runs use $${data.join(" + ")} = ${sum}$ trials: $${n}$ successes and $${failures}$ ${failures === 1 ? "failure" : "failures"}.`,
              `${n} 轮共用了 $${data.join(" + ")} = ${sum}$ 次试验：$${n}$ 次成功、$${failures}$ 次失败。`,
            ),
          ],
          [
            ["Maximize the likelihood", "使似然最大"],
            t(
              `The likelihood is $p^{${n}}(1 - p)^{${failures}}$, and $\\frac{${n}}{p} - \\frac{${failures}}{1 - p} = 0$ gives $p = \\frac{${n}}{${sum}}${lowestTerms(n, sum)}$.`,
              `似然为 $p^{${n}}(1 - p)^{${failures}}$，由 $\\frac{${n}}{p} - \\frac{${failures}}{1 - p} = 0$ 得 $p = \\frac{${n}}{${sum}}${lowestTerms(n, sum)}$。`,
            ),
          ],
        ],
        t(
          `At $p = ${answer.toLatex()}$: $\\frac{${n}}{p} = ${Q.of(n).div(answer).toLatex()}$ and $\\frac{${failures}}{1 - p} = ${Q.of(failures).div(Q.one.sub(answer)).toLatex()}$, so the derivative is zero.`,
          `在 $p = ${answer.toLatex()}$ 处：$\\frac{${n}}{p} = ${Q.of(n).div(answer).toLatex()}$，$\\frac{${failures}}{1 - p} = ${Q.of(failures).div(Q.one.sub(answer)).toLatex()}$，所以导数为零。`,
        ),
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
/** termOf writes a value times its probability, leaving out a factor of one. */
const termOf = (p: Q, v: number) => (v === 1 ? p.toLatex() : `${v} \\cdot ${p.toLatex()}`);

const modeOfPowerDensity: KnowledgePointDef = {
  id: "the-mode-of-a-density-with-two-power-factors",
  title: t("The mode of a density with two power factors", "含两个幂因子的密度的众数"),
  explanation: t(
    "To find the mode, maximize the density, and the normalizing constant makes no difference to where the maximum lies. With a product of powers, it is easier to take the logarithm first, because a logarithm turns the product into a sum, and the derivative becomes $\\frac{a}{x} - \\frac{b}{c - x}$. Setting this to zero gives a point that divides the interval in the ratio $a : b$. This is not the mean, which lies closer to the middle of the interval. For a density proportional to $x^{10}(40 - x)^{30}$ on $[0, 40]$, the mode is $\\frac{10 \\cdot 40}{40} = 10$.\n\n> **Watch out.** The ratio $a : b$ is measured from $0$, so a larger power of $x$ moves the mode to the right; do not swap the two powers. The mode is neither the midpoint nor the mean.",
    "求众数就是使密度最大，归一化常数不影响最大值的位置。对幂的乘积，先取对数更容易，因为对数把乘积变成和，导数变成 $\\frac{a}{x} - \\frac{b}{c - x}$。令它为零，得到把区间按 $a : b$ 分开的点。它不是均值，均值更靠近区间的中间。对于在 $[0, 40]$ 上与 $x^{10}(40 - x)^{30}$ 成正比的密度，众数为 $\\frac{10 \\cdot 40}{40} = 10$。\n\n> **注意。** 比 $a : b$ 是从 $0$ 量起的，所以 $x$ 的幂越大，众数越靠右；不要把两个幂弄反。众数既不是中点，也不是均值。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = otherThan(rng, 1, 6, a);
    const c = rng.int(1, 12);
    const answer = Q.of(a * c, a + b);
    const shown = answer.toLatex() === `\\frac{${a * c}}{${a + b}}` ? "" : ` = ${answer.toLatex()}`;
    return numberProblem({
      prompt: t(
        `A random variable has density proportional to $${powerOf("x", a)}(${c} - x)${b === 1 ? "" : `^{${b}}`}$ on $[0, ${c}]$. Find its mode.`,
        `一个随机变量在 $[0, ${c}]$ 上的密度与 $${powerOf("x", a)}(${c} - x)${b === 1 ? "" : `^{${b}}`}$ 成正比。求它的众数。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(c, 2),
          "That is the midpoint; the two powers are different, so the peak is off centre.",
          "那是中点；两个幂不同，所以峰值不在中间。",
        ),
        why(
          Q.of(b * c, a + b),
          "That swaps the two powers: the point divides the interval in the ratio $a : b$ measured from $0$.",
          "那是把两个幂弄反了：这个点从 $0$ 量起按 $a : b$ 分开区间。",
        ),
        why(Q.of(a, a + b), `That forgets to multiply by the length $${c}$ of the interval.`, `那是忘了乘以区间长度 $${c}$。`),
        why(
          Q.of((a + 1) * c, a + b + 2),
          "That is the mean, which lies closer to the middle than the mode.",
          "那是均值，它比众数更靠近中间。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Take the logarithm and differentiate", "取对数并求导"],
            t(
              `With a constant $C$, $\\ln f(x) = C + ${a === 1 ? "" : `${a} `}\\ln x + ${b === 1 ? "" : `${b} `}\\ln(${c} - x)$, whose derivative is $\\frac{${a}}{x} - \\frac{${b}}{${c} - x}$.`,
              `设 $C$ 为常数，$\\ln f(x) = C + ${a === 1 ? "" : `${a} `}\\ln x + ${b === 1 ? "" : `${b} `}\\ln(${c} - x)$，其导数为 $\\frac{${a}}{x} - \\frac{${b}}{${c} - x}$。`,
            ),
          ],
          [
            ["Set it to zero", "令它为零"],
            t(
              `$${a === 1 ? "" : a}(${c} - x) = ${timesVariable(b, "x")}$ gives $x = \\frac{${a * c}}{${a + b}}${shown}$.`,
              `由 $${a === 1 ? "" : a}(${c} - x) = ${timesVariable(b, "x")}$ 得 $x = \\frac{${a * c}}{${a + b}}${shown}$。`,
            ),
          ],
        ],
        t(
          `The point splits $[0, ${c}]$ into $${answer.toLatex()}$ and $${Q.of(b * c, a + b).toLatex()}$, in the ratio $${a} : ${b}$; and the second derivative $-\\frac{${a}}{x^2} - \\frac{${b}}{(${c} - x)^2}$ is negative, so it is a maximum.`,
          `这个点把 $[0, ${c}]$ 分成 $${answer.toLatex()}$ 和 $${Q.of(b * c, a + b).toLatex()}$，比为 $${a} : ${b}$；二阶导数 $-\\frac{${a}}{x^2} - \\frac{${b}}{(${c} - x)^2}$ 为负，所以是最大值。`,
        ),
      ),
    });
  },
};

const powerOfUniform: KnowledgePointDef = {
  id: "a-probability-for-a-power-of-a-uniform-variable",
  title: t("A probability for a power of a uniform variable", "均匀变量的幂的概率"),
  explanation: t(
    "The distribution function method rewrites an event about $Y$ as an event about $X$. For $Y = X^n$ with $X$ uniform on $[0, 1]$, the event $Y \\le y$ is the same as $X \\le y^{1/n}$, because the power function is increasing there. So $F_Y(y) = y^{1/n}$. This is larger than $y$ itself, as it should be, since raising a number below 1 to a power pushes it towards zero. For $Y = X^4$, $P\\left(Y \\le \\frac{1}{16}\\right) = P\\left(X \\le \\frac{1}{2}\\right) = \\frac{1}{2}$.\n\n> **Watch out.** Take the $n$-th root of $y$; the probability is not $y$ itself. And the event $Y \\le y$ is $X \\le y^{1/n}$, not $X > y^{1/n}$.",
    "分布函数法把关于 $Y$ 的事件改写成关于 $X$ 的事件。对 $Y = X^n$，$X$ 在 $[0, 1]$ 上均匀，事件 $Y \\le y$ 等同于 $X \\le y^{1/n}$，因为幂函数在那里是增函数。所以 $F_Y(y) = y^{1/n}$。它比 $y$ 本身大，这是应该的，因为小于 1 的数取幂后会被推向零。对 $Y = X^4$，$P\\left(Y \\le \\frac{1}{16}\\right) = P\\left(X \\le \\frac{1}{2}\\right) = \\frac{1}{2}$。\n\n> **注意。** 要对 $y$ 开 $n$ 次方；概率不是 $y$ 本身。事件 $Y \\le y$ 是 $X \\le y^{1/n}$，不是 $X > y^{1/n}$。",
  ),
  generate(rng) {
    const n = rng.int(2, 3);
    const b = rng.int(2, 7);
    const a = rng.int(1, b - 1);
    const answer = Q.of(a, b);
    const y = power(answer, n);
    return numberProblem({
      prompt: t(
        `Let $X$ be uniform on $[0, 1]$ and $Y = X^{${n}}$. Find $P\\left(Y \\le ${y.toLatex()}\\right)$.`,
        `设 $X$ 在 $[0, 1]$ 上均匀，$Y = X^{${n}}$。求 $P\\left(Y \\le ${y.toLatex()}\\right)$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          y,
          `That is $P(X \\le ${y.toLatex()})$; the event about $Y$ must be turned into one about $X$.`,
          `那是 $P(X \\le ${y.toLatex()})$；要把关于 $Y$ 的事件化为关于 $X$ 的事件。`,
        ),
        why(
          Q.of(1).sub(answer),
          `That is $P(X > ${answer.toLatex()})$, the opposite event.`,
          `那是 $P(X > ${answer.toLatex()})$，即对立事件。`,
        ),
        why(answer.div(Q.of(n)), `That divides by $${n}$ instead of taking the root.`, `那是除以 $${n}$，而不是开方。`),
        why(
          Q.of(1).sub(y),
          `That is $1 - ${y.toLatex()}$, the complement of the wrong event.`,
          `那是 $1 - ${y.toLatex()}$，即错误事件的补。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Rewrite the event", "改写事件"],
            t(
              `$X^{${n}}$ is increasing on $[0, 1]$, so $Y \\le ${y.toLatex()}$ is the event $X \\le \\left(${y.toLatex()}\\right)^{1/${n}} = ${answer.toLatex()}$.`,
              `$X^{${n}}$ 在 $[0, 1]$ 上递增，所以 $Y \\le ${y.toLatex()}$ 就是事件 $X \\le \\left(${y.toLatex()}\\right)^{1/${n}} = ${answer.toLatex()}$。`,
            ),
          ],
          [
            ["Use the uniform distribution", "利用均匀分布"],
            t(
              `For $X$ uniform on $[0, 1]$, $P\\left(X \\le ${answer.toLatex()}\\right) = ${answer.toLatex()}$.`,
              `$X$ 在 $[0, 1]$ 上均匀，所以 $P\\left(X \\le ${answer.toLatex()}\\right) = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$\\left(${answer.toLatex()}\\right)^{${n}} = ${y.toLatex()}$, and the probability $${answer.toLatex()}$ is larger than $${y.toLatex()}$, as $F_Y(y) = y^{1/${n}}$ should be.`,
          `$\\left(${answer.toLatex()}\\right)^{${n}} = ${y.toLatex()}$，而概率 $${answer.toLatex()}$ 大于 $${y.toLatex()}$，$F_Y(y) = y^{1/${n}}$ 理应如此。`,
        ),
      ),
    });
  },
};

const squareOnUnevenInterval: KnowledgePointDef = {
  id: "the-square-of-a-uniform-variable-on-an-uneven-interval",
  title: t("The square of a uniform variable on an uneven interval", "不对称区间上均匀变量的平方"),
  explanation: t(
    "The map $x \\mapsto x^2$ is many-to-one, so the event $X^2 \\le c^2$ is the interval $-c \\le X \\le c$. When the support of $X$ reaches further on the right than on the left, part of this interval may fall outside the support, and that part contributes no probability. So there are two cases: while $c$ is at most the left reach, the length is $2c$; after that, the left end stops at the edge of the support. For $X$ uniform on $[-10, 30]$, $P(X^2 \\le 400)$ keeps $[-10, 20]$ of the interval $[-20, 20]$, a length of $30$ out of $40$, so it is $\\frac{3}{4}$.\n\n> **Watch out.** Both signs count: $X^2 \\le c^2$ includes $-c \\le X < 0$, not only $0 \\le X \\le c$. But the part of $[-c, c]$ outside the support adds nothing.",
    "映射 $x \\mapsto x^2$ 是多对一的，所以事件 $X^2 \\le c^2$ 就是区间 $-c \\le X \\le c$。当 $X$ 的支撑在右边比左边伸得更远时，这个区间的一部分可能落在支撑之外，那部分不贡献概率。所以有两种情况：当 $c$ 不超过左边的范围时，长度是 $2c$；超过之后，左端点停在支撑的边缘。若 $X$ 在 $[-10, 30]$ 上均匀，$P(X^2 \\le 400)$ 保留区间 $[-20, 20]$ 中的 $[-10, 20]$，长度为 $40$ 中的 $30$，所以概率是 $\\frac{3}{4}$。\n\n> **注意。** 正负两边都要算：$X^2 \\le c^2$ 包括 $-c \\le X < 0$，而不只是 $0 \\le X \\le c$。但 $[-c, c]$ 落在支撑之外的部分不贡献概率。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = a + rng.int(1, 6);
    const c = rng.int(1, b - 1);
    const inside = c <= a;
    const length = inside ? 2 * c : c + a;
    const answer = Q.of(length, a + b);
    const lower = inside ? -c : -a;
    return numberProblem({
      prompt: t(
        `Let $X$ be uniform on $[-${a}, ${b}]$. Find $P(X^2 \\le ${c * c})$.`,
        `设 $X$ 在 $[-${a}, ${b}]$ 上均匀。求 $P(X^2 \\le ${c * c})$。`,
      ),
      answer,
      mistakes: apart(answer, [
        inside
          ? why(
              Q.of(c + a, a + b),
              `That cuts the interval at $-${a}$, although $-${c}$ is still inside the support.`,
              `那是在 $-${a}$ 处截断区间，但 $-${c}$ 仍在支撑之内。`,
            )
          : why(
              Q.of(2 * c, a + b),
              `That counts the part of $[-${c}, ${c}]$ below $-${a}$, which lies outside the support.`,
              `那是把 $[-${c}, ${c}]$ 中 $-${a}$ 以下的部分也算进去了，它在支撑之外。`,
            ),
        why(
          Q.of(c, a + b),
          "That keeps only the positive values of $X$; negative values have positive squares too.",
          "那只保留了 $X$ 的正值；负值的平方也是正的。",
        ),
        why(
          Q.of(c, b),
          `That treats $X$ as uniform on $[0, ${b}]$, ignoring its negative values.`,
          `那是把 $X$ 当成 $[0, ${b}]$ 上的均匀变量，忽略了负值。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Solve for X", "解出 $X$"],
            t(`$X^2 \\le ${c * c}$ is the event $${-c} \\le X \\le ${c}$.`, `$X^2 \\le ${c * c}$ 就是事件 $${-c} \\le X \\le ${c}$。`),
          ],
          [
            ["Keep the part inside the support", "保留支撑内的部分"],
            t(
              inside
                ? `$-${c}$ is not below $-${a}$, so the whole interval $[${-c}, ${c}]$ lies in $[-${a}, ${b}]$, with length $${length}$.`
                : `$-${c}$ is below $-${a}$, so only $[-${a}, ${c}]$ lies in the support, with length $${length}$.`,
              inside
                ? `$-${c}$ 不小于 $-${a}$，所以整个区间 $[${-c}, ${c}]$ 都在 $[-${a}, ${b}]$ 内，长度为 $${length}$。`
                : `$-${c}$ 小于 $-${a}$，所以只有 $[-${a}, ${c}]$ 在支撑内，长度为 $${length}$。`,
            ),
          ],
          [
            ["Divide by the total length", "除以总长度"],
            t(
              `$P(X^2 \\le ${c * c}) = \\frac{${length}}{${a + b}}${answer.toLatex() === `\\frac{${length}}{${a + b}}` ? "" : ` = ${answer.toLatex()}`}$.`,
              `$P(X^2 \\le ${c * c}) = \\frac{${length}}{${a + b}}${answer.toLatex() === `\\frac{${length}}{${a + b}}` ? "" : ` = ${answer.toLatex()}`}$。`,
            ),
          ],
        ],
        t(
          `The kept interval runs from $${lower}$ to $${c}$, a length of $${c} + ${-lower} = ${length}$, shorter than the whole support of length $${a + b}$.`,
          `保留的区间从 $${lower}$ 到 $${c}$，长度为 $${c} + ${-lower} = ${length}$，比长度为 $${a + b}$ 的整个支撑短。`,
        ),
      ),
    });
  },
};

const expectedEmptyBoxes: KnowledgePointDef = {
  id: "the-expected-number-of-empty-boxes",
  title: t("The expected number of empty boxes", "空盒子的期望个数"),
  explanation: t(
    "Counting the empty boxes directly leads to a complicated distribution, but its mean is simple. Give each box an indicator, equal to 1 if the box is empty, so that the count is the sum of the indicators. Linearity of expectation does not require independence, and the indicators here are certainly dependent. It only requires the mean of each indicator, which is the probability that every ball misses that particular box.\n\n> **Watch out.** A box is empty when every ball misses it, which has probability $\\left(1 - \\frac{1}{m}\\right)^{n}$, not $\\left(\\frac{1}{m}\\right)^{n}$. With $3$ balls and $2$ boxes each box is empty with probability $\\left(\\frac{1}{2}\\right)^{3} = \\frac{1}{8}$, so the expected number of empty boxes is $2 \\cdot \\frac{1}{8} = \\frac{1}{4}$.",
    "直接数空盒子会得到复杂的分布，但它的均值很简单。给每个盒子一个示性变量，盒子为空时等于 1，于是个数就是示性变量之和。期望的线性性不要求独立，这里的示性变量显然不独立。只需要每个示性变量的均值，也就是所有球都没落入那个盒子的概率。\n\n> **注意。** 盒子为空意味着每个球都没落入它，概率是 $\\left(1 - \\frac{1}{m}\\right)^{n}$，而不是 $\\left(\\frac{1}{m}\\right)^{n}$。$3$ 个球放入 $2$ 个盒子时，每个盒子为空的概率是 $\\left(\\frac{1}{2}\\right)^{3} = \\frac{1}{8}$，所以空盒子的期望个数是 $2 \\cdot \\frac{1}{8} = \\frac{1}{4}$。",
  ),
  generate(rng) {
    const m = rng.int(2, 8);
    const n = rng.int(2, 5);
    const miss = power(Q.of(m - 1, m), n);
    const answer = miss.mul(Q.of(m));
    const missTex = `\\left(${Q.of(m - 1, m).toLatex()}\\right)^{${n}}`;
    return numberProblem({
      prompt: t(
        `Each of ${n} balls is placed independently into one of ${m} equally likely boxes. Find the expected number of empty boxes.`,
        `${n} 个球分别独立地等可能放入 ${m} 个盒子之一。求空盒子的期望个数。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          miss,
          `That is the chance that one box is empty; add it over all ${m} boxes.`,
          `那是一个盒子为空的概率；还要对 ${m} 个盒子求和。`,
        ),
        why(
          power(Q.of(1, m), n).mul(Q.of(m)),
          "That uses the chance that every ball lands in the box; an empty box needs every ball to miss it.",
          "那用的是所有球都落入这个盒子的概率；盒子为空需要每个球都没落入它。",
        ),
        why(
          power(Q.of(m - 1, m), n - 1).mul(Q.of(m)),
          `That raises to the power $${n - 1}$; all ${n} balls must miss the box.`,
          `那是取了 $${n - 1}$ 次幂；${n} 个球都要没落入这个盒子。`,
        ),
      ]),
      wrong: [answer.add(Q.of(1))],
      solution: walked(
        [
          [
            ["Use indicators", "用示性变量"],
            t(
              `Let $I_j = 1$ when box $j$ is empty. The number of empty boxes is $I_1 + \\cdots + I_{${m}}$.`,
              `当第 $j$ 个盒子为空时令 $I_j = 1$。空盒子的个数是 $I_1 + \\cdots + I_{${m}}$。`,
            ),
          ],
          [
            ["Find each mean", "求每个均值"],
            t(
              `Each ball misses box $j$ with probability $${Q.of(m - 1, m).toLatex()}$, independently, so $E(I_j) = ${missTex} = ${miss.toLatex()}$.`,
              `每个球没落入第 $j$ 个盒子的概率是 $${Q.of(m - 1, m).toLatex()}$，且相互独立，所以 $E(I_j) = ${missTex} = ${miss.toLatex()}$。`,
            ),
          ],
          [
            ["Add", "相加"],
            t(`$${m} \\cdot ${miss.toLatex()} = ${answer.toLatex()}$.`, `$${m} \\cdot ${miss.toLatex()} = ${answer.toLatex()}$。`),
          ],
        ],
        t(
          `The expected number of occupied boxes is then $${m} - ${answer.toLatex()} = ${Q.of(m).sub(answer).toLatex()}$, which lies between $1$ and $${Math.min(m, n)}$, as it must: at least one box is used, and at most $\\min(${m}, ${n})$.`,
          `于是被占用盒子的期望个数是 $${m} - ${answer.toLatex()} = ${Q.of(m).sub(answer).toLatex()}$，介于 $1$ 与 $${Math.min(m, n)}$ 之间，理应如此：至少用到一个盒子，至多 $\\min(${m}, ${n})$ 个。`,
        ),
      ),
    });
  },
};

const momentOfPowerDensity: KnowledgePointDef = {
  id: "a-moment-of-a-power-density",
  title: t("A moment of a power density", "幂密度的矩"),
  explanation: t(
    "The density $f(x) = (k + 1)x^k$ on $[0, 1]$ is a family with a simple moment formula. Multiplying by $x^n$ just raises the exponent, so $E(X^n) = (k + 1)\\int_0^1 x^{k + n}\\,dx = \\frac{k + 1}{k + n + 1}$. The moments fall as $n$ grows, because a number below 1 shrinks when it is raised to a higher power. Larger values of $k$ bring them closer to 1, because the mass then lies nearer to 1. For $f(x) = 21x^{20}$, $E(X^{10}) = \\frac{21}{31}$.\n\n> **Watch out.** Add the exponents $k + n$ before integrating, and then the integral divides by $k + n + 1$, one more than the exponent. Keep the constant $k + 1$ of the density.",
    "$[0, 1]$ 上的密度 $f(x) = (k + 1)x^k$ 是一族矩公式很简单的分布。乘以 $x^n$ 只是提高指数，所以 $E(X^n) = (k + 1)\\int_0^1 x^{k + n}\\,dx = \\frac{k + 1}{k + n + 1}$。矩随 $n$ 增大而减小，因为小于 1 的数取更高次幂时会变小。$k$ 越大，矩越接近 1，因为这时质量更靠近 1。对于 $f(x) = 21x^{20}$，$E(X^{10}) = \\frac{21}{31}$。\n\n> **注意。** 先把指数相加得 $k + n$ 再积分，积分要除以比指数大一的 $k + n + 1$。还要保留密度中的常数 $k + 1$。",
  ),
  generate(rng) {
    const k = rng.int(1, 9);
    const n = rng.int(2, 7);
    const answer = Q.of(k + 1, k + n + 1);
    const shown = answer.toLatex() === `\\frac{${k + 1}}{${k + n + 1}}` ? "" : ` = ${answer.toLatex()}`;
    return numberProblem({
      prompt: t(
        `A random variable has density $f(x) = ${k + 1}${powerOf("x", k)}$ on $[0, 1]$. Find $E(X^{${n}})$.`,
        `一个随机变量在 $[0, 1]$ 上的密度是 $f(x) = ${k + 1}${powerOf("x", k)}$。求 $E(X^{${n}})$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(k + 1, k + n),
          `That divides by the exponent $${k + n}$; integrating $x^{${k + n}}$ divides by $${k + n + 1}$.`,
          `那是除以了指数 $${k + n}$；积分 $x^{${k + n}}$ 要除以 $${k + n + 1}$。`,
        ),
        why(
          Q.of(1, n + 1),
          "That is the moment of a uniform variable; this density leans towards $1$.",
          "那是均匀变量的矩；这个密度偏向 $1$。",
        ),
        why(Q.of(k, k + n), "That drops one from both the constant and the denominator.", "那是常数和分母都少了一。"),
        why(
          Q.of(k + 1, n + 1),
          `That leaves out the factor $${powerOf("x", k)}$ of the density when integrating.`,
          `那是积分时漏掉了密度中的因子 $${powerOf("x", k)}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Set up the integral", "列出积分"],
            t(
              `$E(X^{${n}}) = \\int_0^1 x^{${n}} \\cdot ${k + 1}${powerOf("x", k)}\\,dx = ${k + 1}\\int_0^1 x^{${k + n}}\\,dx$.`,
              `$E(X^{${n}}) = \\int_0^1 x^{${n}} \\cdot ${k + 1}${powerOf("x", k)}\\,dx = ${k + 1}\\int_0^1 x^{${k + n}}\\,dx$。`,
            ),
          ],
          [
            ["Integrate", "积分"],
            t(
              `$${k + 1} \\cdot \\frac{1}{${k + n + 1}} = \\frac{${k + 1}}{${k + n + 1}}${shown}$.`,
              `$${k + 1} \\cdot \\frac{1}{${k + n + 1}} = \\frac{${k + 1}}{${k + n + 1}}${shown}$。`,
            ),
          ],
        ],
        t(
          `$${answer.toLatex()}$ lies between $${Q.of(1, n + 1).toLatex()}$, the moment of a uniform variable, and $1$, as it should for a density that leans towards $1$.`,
          `$${answer.toLatex()}$ 介于均匀变量的矩 $${Q.of(1, n + 1).toLatex()}$ 和 $1$ 之间，偏向 $1$ 的密度理应如此。`,
        ),
      ),
    });
  },
};

const varianceOfTriangularDensity: KnowledgePointDef = {
  id: "the-variance-of-a-right-triangular-density",
  figure: probabilityDrawings1["variance-of-continuous-random-variables#the-variance-of-a-right-triangular-density"],
  title: t("The variance of a right triangular density", "直角三角形密度的方差"),
  explanation: t(
    "A density that rises in a straight line from zero has the shape of a right triangle. Its first two moments come from single integrals, with mean $\\frac{2c}{3}$ and second moment $\\frac{c^2}{2}$. Subtracting the square of the mean gives the variance $\\frac{c^2}{18}$. This is smaller than the uniform value $\\frac{c^2}{12}$ on the same interval, because the mass is concentrated towards one end instead of being spread evenly. In the drawing $c = 3$: the density rises to $\\frac{2}{3}$, the mean is $2$, and the variance is $\\frac{9}{18} = \\frac{1}{2}$, below the value $\\frac{9}{12} = \\frac{3}{4}$ of the dashed uniform density. With $c = 60$ the variance is $\\frac{3600}{18} = 200$.\n\n> **Watch out.** The second moment $\\frac{c^2}{2}$ is not the variance: subtract the square of the mean, $\\frac{4c^2}{9}$. And the uniform value $\\frac{c^2}{12}$ does not apply to this sloping density.",
    "从零开始沿直线上升的密度形如直角三角形。它的前两阶矩由单积分得到，均值是 $\\frac{2c}{3}$，二阶矩是 $\\frac{c^2}{2}$。减去均值的平方，得方差 $\\frac{c^2}{18}$。它小于同一区间上均匀分布的值 $\\frac{c^2}{12}$，因为质量集中在一端而不是均匀分布。图中 $c = 3$：密度升到 $\\frac{2}{3}$，均值是 $2$，方差是 $\\frac{9}{18} = \\frac{1}{2}$，小于虚线所示均匀密度的 $\\frac{9}{12} = \\frac{3}{4}$。当 $c = 60$ 时，方差为 $\\frac{3600}{18} = 200$。\n\n> **注意。** 二阶矩 $\\frac{c^2}{2}$ 不是方差：还要减去均值的平方 $\\frac{4c^2}{9}$。而均匀分布的 $\\frac{c^2}{12}$ 不适用于这个倾斜的密度。",
  ),
  generate(rng) {
    const c = rng.int(2, 30);
    const answer = Q.of(c * c, 18);
    const [mean, second, square] = [Q.of(2 * c, 3).toLatex(), Q.of(c * c, 2).toLatex(), Q.of(4 * c * c, 9).toLatex()];
    return numberProblem({
      prompt: t(
        `A random variable has density $f(x) = \\frac{2x}{${c * c}}$ on $[0, ${c}]$. Find its variance.`,
        `一个随机变量在 $[0, ${c}]$ 上的密度是 $f(x) = \\frac{2x}{${c * c}}$。求它的方差。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(Q.of(c * c, 2), "That is the second moment; the square of the mean must be subtracted.", "那是二阶矩；还要减去均值的平方。"),
        why(
          Q.of(4 * c * c, 9),
          "That is the square of the mean, which is subtracted, not the variance.",
          "那是均值的平方，它是要减去的，不是方差。",
        ),
        why(
          Q.of(c * c, 12),
          "That is the variance of a uniform density on the same interval; this density slopes.",
          "那是同一区间上均匀密度的方差；这个密度是倾斜的。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the two moments", "求两个矩"],
            t(
              `$E(X) = \\int_0^{${c}} \\frac{2x^2}{${c * c}}\\,dx = ${mean}$ and $E(X^2) = \\int_0^{${c}} \\frac{2x^3}{${c * c}}\\,dx = ${second}$.`,
              `$E(X) = \\int_0^{${c}} \\frac{2x^2}{${c * c}}\\,dx = ${mean}$，$E(X^2) = \\int_0^{${c}} \\frac{2x^3}{${c * c}}\\,dx = ${second}$。`,
            ),
          ],
          [
            ["Subtract the square of the mean", "减去均值的平方"],
            t(
              `$\\operatorname{Var}(X) = ${second} - ${square} = ${answer.toLatex()}$.`,
              `$\\operatorname{Var}(X) = ${second} - ${square} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$${answer.toLatex()}$ is smaller than the uniform value $${Q.of(c * c, 12).toLatex()}$, as it should be for mass bunched towards $${c}$.`,
          `$${answer.toLatex()}$ 小于均匀分布的值 $${Q.of(c * c, 12).toLatex()}$，质量集中在 $${c}$ 附近时理应如此。`,
        ),
      ),
    });
  },
};

const varianceFromFiniteMgf: KnowledgePointDef = {
  id: "the-variance-read-from-a-finite-mgf",
  title: t("The variance read from a finite MGF", "由有限项矩母函数读出方差"),
  explanation: t(
    "The moment generating function of a discrete variable is $\\sum p_i e^{x_i t}$. So a function written as a sum of exponentials can be read as a table: each exponent is a value of the variable, and its coefficient is the probability. Then the moments can be calculated from this table directly, without differentiating anything. A constant term in the function is the probability of the value 0, since $e^{0t} = 1$. For $M(t) = \\frac{1}{2} + \\frac{1}{2}e^{20t}$, the values $0$ and $20$ give mean $10$, second moment $200$ and variance $200 - 100 = 100$.\n\n> **Watch out.** The exponents are the values and the coefficients are the probabilities, not the other way round. The second moment still needs the square of the mean subtracted.",
    "离散变量的矩母函数是 $\\sum p_i e^{x_i t}$。所以写成指数函数之和的函数可以读成一张表：每个指数是变量的一个取值，它的系数是相应的概率。于是可以直接从表计算矩，不必求导。函数中的常数项是取值 0 的概率，因为 $e^{0t} = 1$。对于 $M(t) = \\frac{1}{2} + \\frac{1}{2}e^{20t}$，取值 $0$ 和 $20$ 给出均值 $10$、二阶矩 $200$，方差为 $200 - 100 = 100$。\n\n> **注意。** 指数是取值，系数是概率，不要弄反。二阶矩还要减去均值的平方。",
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
      mistakes: apart(answer, [
        why(moment, "That is the second moment; the square of the mean must be subtracted.", "那是二阶矩；还要减去均值的平方。"),
        why(mean, "That is the mean, not the variance.", "那是均值，不是方差。"),
        why(
          mean.mul(mean),
          "That is the square of the mean, which is subtracted, not the variance.",
          "那是均值的平方，它是要减去的，不是方差。",
        ),
        why(
          moment.add(mean.mul(mean)),
          "That adds the square of the mean instead of subtracting it.",
          "那是加上了均值的平方，而不是减去。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Read the table", "读出分布表"],
            t(
              `The variable takes the values $0$, $${d}$ and $${e}$ with probabilities $${Q.of(first, 10).toLatex()}$, $${p.toLatex()}$ and $${q.toLatex()}$.`,
              `变量取值 $0$、$${d}$、$${e}$，概率分别为 $${Q.of(first, 10).toLatex()}$、$${p.toLatex()}$、$${q.toLatex()}$。`,
            ),
          ],
          [
            ["Find the two moments", "求两个矩"],
            t(
              `$E(X) = ${termOf(p, d)} + ${termOf(q, e)} = ${mean.toLatex()}$ and $E(X^2) = ${termOf(p, d * d)} + ${termOf(q, e * e)} = ${moment.toLatex()}$.`,
              `$E(X) = ${termOf(p, d)} + ${termOf(q, e)} = ${mean.toLatex()}$，$E(X^2) = ${termOf(p, d * d)} + ${termOf(q, e * e)} = ${moment.toLatex()}$。`,
            ),
          ],
          [
            ["Subtract the square of the mean", "减去均值的平方"],
            t(
              `$\\operatorname{Var}(X) = ${moment.toLatex()} - \\left(${mean.toLatex()}\\right)^2 = ${answer.toLatex()}$.`,
              `$\\operatorname{Var}(X) = ${moment.toLatex()} - \\left(${mean.toLatex()}\\right)^2 = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `The probabilities $${Q.of(first, 10).toLatex()} + ${p.toLatex()} + ${q.toLatex()}$ add to $1$, as $M(0) = 1$ requires, and the variance is positive and below the second moment.`,
          `概率 $${Q.of(first, 10).toLatex()} + ${p.toLatex()} + ${q.toLatex()}$ 之和为 $1$，符合 $M(0) = 1$，而方差为正且小于二阶矩。`,
        ),
      ),
    });
  },
};

const divisibleByEither: KnowledgePointDef = {
  id: "a-uniform-value-divisible-by-one-of-two-numbers",
  title: t("A uniform value divisible by one of two numbers", "均匀取值能被两数之一整除"),
  explanation: t(
    "Divisible values are easy to count, since $\\lfloor \\frac{N}{a} \\rfloor$ of the numbers from 1 to $N$ are multiples of $a$. But adding the counts for two divisors counts the common multiples twice. Inclusion and exclusion removes them once. For two numbers without a common factor, the common multiples are the multiples of the product. Dividing the final count by $N$ gives the probability, since all values are equally likely.\n\n> **Watch out.** Subtract the common multiples once. From $1$ to $30$ there are $15$ multiples of $2$ and $10$ of $3$, but the $5$ multiples of $6$ are in both lists, so $15 + 10 - 5 = 20$ values qualify, not $25$.",
    "能整除的值很容易数，从 1 到 $N$ 中有 $\\lfloor \\frac{N}{a} \\rfloor$ 个 $a$ 的倍数。但把两个除数的个数相加时，公倍数被数了两次。容斥原理把它们去掉一次。对没有公因数的两个数，公倍数就是乘积的倍数。最后的个数除以 $N$ 就是概率，因为所有值等可能。\n\n> **注意。** 公倍数要减去一次。从 $1$ 到 $30$ 中，$2$ 的倍数有 $15$ 个，$3$ 的倍数有 $10$ 个，但 $6$ 的 $5$ 个倍数在两份名单里都有，所以符合条件的值有 $15 + 10 - 5 = 20$ 个，而不是 $25$ 个。",
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
      mistakes: apart(answer, [
        why(
          Q.of(countA + countB, n),
          `That counts the multiples of ${a * b} twice; subtract them once.`,
          `那是把 ${a * b} 的倍数算了两次；要减去一次。`,
        ),
        why(Q.of(both, n), `That is the chance of being divisible by both ${a} and ${b}.`, `那是同时能被 ${a} 和 ${b} 整除的概率。`),
        why(Q.of(countA, n), `That counts only the multiples of ${a}.`, `那只算了 ${a} 的倍数。`),
        why(Q.of(countB, n), `That counts only the multiples of ${b}.`, `那只算了 ${b} 的倍数。`),
      ]),
      solution: walked(
        [
          [
            ["Count the multiples", "数倍数"],
            t(
              `$\\left\\lfloor \\frac{${n}}{${a}} \\right\\rfloor = ${countA}$, $\\left\\lfloor \\frac{${n}}{${b}} \\right\\rfloor = ${countB}$, and the common multiples are the multiples of ${a * b}: $\\left\\lfloor \\frac{${n}}{${a * b}} \\right\\rfloor = ${both}$.`,
              `$\\left\\lfloor \\frac{${n}}{${a}} \\right\\rfloor = ${countA}$，$\\left\\lfloor \\frac{${n}}{${b}} \\right\\rfloor = ${countB}$，公倍数就是 ${a * b} 的倍数：$\\left\\lfloor \\frac{${n}}{${a * b}} \\right\\rfloor = ${both}$。`,
            ),
          ],
          [
            ["Include and exclude", "容斥"],
            t(
              `$${countA} + ${countB} - ${both} = ${countA + countB - both}$ values qualify, out of ${n}, so the probability is $${answer.toLatex()}$.`,
              `符合条件的值有 $${countA} + ${countB} - ${both} = ${countA + countB - both}$ 个，总数是 ${n}，所以概率是 $${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `Split the qualifying values into three groups that do not overlap: $${countA - both}$ multiples of ${a} only, $${countB - both}$ of ${b} only, and $${both}$ of both. They total $${countA - both} + ${countB - both} + ${both} = ${countA + countB - both}$.`,
          `把符合条件的值分成互不重叠的三组：只是 ${a} 的倍数的 $${countA - both}$ 个，只是 ${b} 的倍数的 $${countB - both}$ 个，两者都是的 $${both}$ 个。合计 $${countA - both} + ${countB - both} + ${both} = ${countA + countB - both}$。`,
        ),
      ),
    });
  },
};

const expectedMaximumOfTwo: KnowledgePointDef = {
  id: "the-expected-maximum-of-two-uniform-draws",
  title: t("The expected maximum of two uniform draws", "两次均匀抽取的期望最大值"),
  explanation: t(
    "The maximum of two independent draws is at most $k$ exactly when both draws are, which has probability $\\frac{k^2}{n^2}$. Subtracting the value for $k - 1$ gives $P(\\max = k) = \\frac{2k - 1}{n^2}$. So large values are more likely than small ones, and the mean lies above the middle of the range. The sum $\\sum k(2k - 1)$ then simplifies by the standard formulas for sums of powers of integers.\n\n> **Watch out.** The larger draw is not uniform, so its mean is not the middle of the range. With $n = 2$ it is $1$ with probability $\\frac{1}{4}$ and $2$ with probability $\\frac{3}{4}$, so its mean is $\\frac{7}{4}$, not $\\frac{3}{2}$.",
    "两次独立抽取的最大值不超过 $k$，当且仅当两次都不超过 $k$，概率是 $\\frac{k^2}{n^2}$。减去 $k - 1$ 对应的值，得 $P(\\max = k) = \\frac{2k - 1}{n^2}$。所以大的值比小的值更可能，均值在范围中点之上。然后用整数幂之和的标准公式化简 $\\sum k(2k - 1)$。\n\n> **注意。** 较大值不是均匀分布，所以它的均值不是范围的中点。$n = 2$ 时，它以概率 $\\frac{1}{4}$ 取 $1$，以概率 $\\frac{3}{4}$ 取 $2$，均值是 $\\frac{7}{4}$，而不是 $\\frac{3}{2}$。",
  ),
  generate(rng) {
    const n = rng.int(2, 30);
    const answer = Q.of((n + 1) * (4 * n - 1), 6 * n);
    const squares = (n * (n + 1) * (2 * n + 1)) / 6;
    const plain = (n * (n + 1)) / 2;
    return numberProblem({
      prompt: t(
        `Two independent draws are made from the numbers $1, 2, \\dots, ${n}$, each equally likely. Find the expected value of the larger draw.`,
        `从 $1, 2, \\dots, ${n}$ 中独立抽取两次，每个数等可能。求较大的一次的期望值。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(n + 1, 2),
          "That is the mean of a single draw; the larger of two draws tends to be bigger.",
          "那是单次抽取的均值；两次中较大的那个往往更大。",
        ),
        why(n, `That is the largest possible value, $${n}$, not the mean.`, `那是最大可能的取值 $${n}$，而不是均值。`),
        why(
          Q.of(2 * n, 3),
          `That is the answer for a continuous uniform variable on $[0, ${n}]$; here the values are the integers $1$ to $${n}$.`,
          `那是 $[0, ${n}]$ 上连续均匀变量的答案；这里的取值是整数 $1$ 到 $${n}$。`,
        ),
      ]),
      wrong: [Q.of(2 * (n + 1), 3), answer.add(Q.of(1))],
      solution: walked(
        [
          [
            ["Find the distribution", "求分布"],
            t(
              `$P(\\max \\le k) = \\frac{k^2}{${n * n}}$, so $P(\\max = k) = \\frac{k^2 - (k - 1)^2}{${n * n}} = \\frac{2k - 1}{${n * n}}$.`,
              `$P(\\max \\le k) = \\frac{k^2}{${n * n}}$，所以 $P(\\max = k) = \\frac{k^2 - (k - 1)^2}{${n * n}} = \\frac{2k - 1}{${n * n}}$。`,
            ),
          ],
          [
            ["Sum", "求和"],
            t(
              `$\\sum_{k=1}^{${n}} k^2 = ${squares}$ and $\\sum_{k=1}^{${n}} k = ${plain}$, so $E(\\max) = \\frac{2 \\cdot ${squares} - ${plain}}{${n * n}} = \\frac{${2 * squares - plain}}{${n * n}} = ${answer.toLatex()}$.`,
              `$\\sum_{k=1}^{${n}} k^2 = ${squares}$，$\\sum_{k=1}^{${n}} k = ${plain}$，所以 $E(\\max) = \\frac{2 \\cdot ${squares} - ${plain}}{${n * n}} = \\frac{${2 * squares - plain}}{${n * n}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `The general formula $\\frac{(n + 1)(4n - 1)}{6n}$ gives $\\frac{${n + 1} \\cdot ${4 * n - 1}}{${6 * n}} = ${answer.toLatex()}$ as well, and this lies between the single-draw mean $${Q.of(n + 1, 2).toLatex()}$ and the largest value $${n}$.`,
          `一般公式 $\\frac{(n + 1)(4n - 1)}{6n}$ 也给出 $\\frac{${n + 1} \\cdot ${4 * n - 1}}{${6 * n}} = ${answer.toLatex()}$，它介于单次抽取的均值 $${Q.of(n + 1, 2).toLatex()}$ 与最大值 $${n}$ 之间。`,
        ),
      ),
    });
  },
};

const twoBernoulliDiffer: KnowledgePointDef = {
  id: "the-probability-that-two-bernoulli-variables-differ",
  title: t("The probability that two Bernoulli variables differ", "两个伯努利变量不相等的概率"),
  explanation: t(
    "Two independent Bernoulli variables differ in two separate ways: the first is 1 and the second is 0, or the other way round. These cases cannot happen together, so their probabilities add, and each one is a product by independence. Notice that if one of the two parameters is $\\frac{1}{2}$, then the answer is $\\frac{1}{2}$, whatever the other parameter may be. This fact is the basis of some simple randomized schemes.\n\n> **Watch out.** Count both orders, and do not multiply the parameters themselves. With parameters $0.3$ and $0.6$, $P(X \\ne Y) = 0.3 \\cdot 0.4 + 0.6 \\cdot 0.7 = 0.54$, while $0.3 \\cdot 0.6 = 0.18$ is the chance that both are 1.",
    "两个独立的伯努利变量有两种不相等的方式：第一个是 1 而第二个是 0，或者反过来。这两种情况不能同时发生，所以概率相加，每个概率由独立性是乘积。注意，如果其中一个参数是 $\\frac{1}{2}$，答案就是 $\\frac{1}{2}$，无论另一个参数是多少。这个事实是一些简单随机化方案的基础。\n\n> **注意。** 两种顺序都要算，而且不要直接把两个参数相乘。参数为 $0.3$ 和 $0.6$ 时，$P(X \\ne Y) = 0.3 \\cdot 0.4 + 0.6 \\cdot 0.7 = 0.54$，而 $0.3 \\cdot 0.6 = 0.18$ 是两者都为 1 的概率。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = rng.int(1, 9);
    const p = Q.of(a, 10);
    const q = Q.of(b, 10);
    const one = Q.of(1);
    const answer = p.mul(one.sub(q)).add(q.mul(one.sub(p)));
    const same = p.mul(q).add(one.sub(p).mul(one.sub(q)));
    const hundredths = (x: number) => `${x / 100}`;
    return numberProblem({
      prompt: t(
        `Independent Bernoulli variables $X$ and $Y$ have parameters $${tenths(a)}$ and $${tenths(b)}$. Find $P(X \\ne Y)$.`,
        `独立的伯努利变量 $X$ 和 $Y$ 的参数是 $${tenths(a)}$ 和 $${tenths(b)}$。求 $P(X \\ne Y)$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(p.mul(q), "That is the chance that both equal 1, one of the ways they agree.", "那是两者都等于 1 的概率，是相等的情形之一。"),
        why(
          p.add(q),
          "That adds the parameters; each way of differing is a product of two probabilities.",
          "那是把参数相加；每种不相等的方式都是两个概率之积。",
        ),
        why(same, "That is the chance that they are equal, $P(X = Y)$.", "那是两者相等的概率 $P(X = Y)$。"),
        why(
          p.mul(one.sub(q)),
          "That counts only $X = 1, Y = 0$; the order $X = 0, Y = 1$ also counts.",
          "那只算了 $X = 1, Y = 0$；$X = 0, Y = 1$ 的情形也要算。",
        ),
      ]),
      wrong: [Q.of(Math.abs(a - b), 10)],
      solution: walked(
        [
          [
            ["List the two ways", "列出两种方式"],
            t(
              `$P(X = 1, Y = 0) = ${tenths(a)} \\cdot ${tenths(10 - b)} = ${hundredths(a * (10 - b))}$ and $P(X = 0, Y = 1) = ${tenths(10 - a)} \\cdot ${tenths(b)} = ${hundredths(b * (10 - a))}$, by independence.`,
              `由独立性，$P(X = 1, Y = 0) = ${tenths(a)} \\cdot ${tenths(10 - b)} = ${hundredths(a * (10 - b))}$，$P(X = 0, Y = 1) = ${tenths(10 - a)} \\cdot ${tenths(b)} = ${hundredths(b * (10 - a))}$。`,
            ),
          ],
          [
            ["Add", "相加"],
            t(
              `$${hundredths(a * (10 - b))} + ${hundredths(b * (10 - a))} = ${hundredths(a * (10 - b) + b * (10 - a))} = ${answer.toLatex()}$.`,
              `$${hundredths(a * (10 - b))} + ${hundredths(b * (10 - a))} = ${hundredths(a * (10 - b) + b * (10 - a))} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `They are equal with probability $${tenths(a)} \\cdot ${tenths(b)} + ${tenths(10 - a)} \\cdot ${tenths(10 - b)} = ${hundredths(a * b + (10 - a) * (10 - b))}$, and $1 - ${hundredths(a * b + (10 - a) * (10 - b))} = ${hundredths(a * (10 - b) + b * (10 - a))}$ again.`,
          `两者相等的概率是 $${tenths(a)} \\cdot ${tenths(b)} + ${tenths(10 - a)} \\cdot ${tenths(10 - b)} = ${hundredths(a * b + (10 - a) * (10 - b))}$，而 $1 - ${hundredths(a * b + (10 - a) * (10 - b))} = ${hundredths(a * (10 - b) + b * (10 - a))}$，结果相同。`,
        ),
      ),
    });
  },
};

const binomialFactorialMoment: KnowledgePointDef = {
  id: "the-factorial-moment-of-a-binomial-variable",
  title: t("The factorial moment of a binomial variable", "二项变量的阶乘矩"),
  explanation: t(
    "For a binomial count, $X(X - 1)$ counts the ordered pairs of different trials that both succeed. There are $n(n - 1)$ such pairs, and each succeeds with probability $p^2$, so linearity gives $E[X(X - 1)] = n(n - 1)p^2$. No sum over the distribution is needed. This value is also a quick route to the variance, since $E(X^2)$ equals this factorial moment plus the mean.\n\n> **Watch out.** The two trials of a pair must be different, so there are $n(n - 1)$ pairs, not $n^2$. With $n = 10$ and $p = \\frac{1}{2}$, $E[X(X - 1)] = 90 \\cdot \\frac{1}{4} = \\frac{45}{2}$, not $100 \\cdot \\frac{1}{4} = 25$.",
    "对二项计数，$X(X - 1)$ 数的是两次都成功的不同试验的有序对。这样的对有 $n(n - 1)$ 个，每对成功的概率是 $p^2$，所以由线性性 $E[X(X - 1)] = n(n - 1)p^2$。不需要对分布求和。这个值也是求方差的捷径，因为 $E(X^2)$ 等于这个阶乘矩加上均值。\n\n> **注意。** 一对中的两次试验必须不同，所以有 $n(n - 1)$ 对，而不是 $n^2$ 对。$n = 10$、$p = \\frac{1}{2}$ 时，$E[X(X - 1)] = 90 \\cdot \\frac{1}{4} = \\frac{45}{2}$，而不是 $100 \\cdot \\frac{1}{4} = 25$。",
  ),
  generate(rng) {
    const n = rng.int(2, 30);
    const p = rng.pick([Q.of(1, 2), Q.of(1, 3), Q.of(1, 4), Q.of(1, 5), Q.of(2, 5), Q.of(3, 10), Q.of(3, 5), Q.of(3, 4)]);
    const size = Q.of(n);
    const answer = size
      .mul(Q.of(n - 1))
      .mul(p)
      .mul(p);
    const bracket = (x: Q) => (x.isInteger() ? x.toLatex() : `\\left(${x.toLatex()}\\right)`);
    return numberProblem({
      prompt: t(
        `Let $X$ be binomial with $n = ${n}$ and $p = ${p.toLatex()}$. Find $E[X(X - 1)]$.`,
        `设 $X$ 服从二项分布，$n = ${n}$，$p = ${p.toLatex()}$。求 $E[X(X - 1)]$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          size.mul(size).mul(p).mul(p),
          `That uses $${n}^2$ pairs, including a trial paired with itself; that is $(E X)^2$.`,
          `那用了 $${n}^2$ 对，包括了一次试验与自己配对；那是 $(E X)^2$。`,
        ),
        why(
          size.mul(Q.of(n - 1)).mul(p),
          "That uses $p$ for a pair; both trials of the pair must succeed, which has probability $p^2$.",
          "那是对一对用了 $p$；一对中两次试验都要成功，概率是 $p^2$。",
        ),
        why(answer.add(size.mul(p)), "That is $E(X^2)$, the factorial moment plus the mean.", "那是 $E(X^2)$，即阶乘矩加上均值。"),
        why(size.mul(p).mul(Q.of(1).sub(p)), "That is the variance $np(1 - p)$.", "那是方差 $np(1 - p)$。"),
      ]),
      solution: walked(
        [
          [
            ["Count the pairs", "数有序对"],
            t(
              `$X(X - 1)$ counts the ordered pairs of different trials that both succeed, and there are $${n} \\cdot ${n - 1} = ${n * (n - 1)}$ ordered pairs of different trials.`,
              `$X(X - 1)$ 数的是两次都成功的不同试验的有序对，不同试验的有序对共有 $${n} \\cdot ${n - 1} = ${n * (n - 1)}$ 个。`,
            ),
          ],
          [
            ["Use linearity", "用线性性"],
            t(
              `Each pair succeeds together with probability $\\left(${p.toLatex()}\\right)^2 = ${p.mul(p).toLatex()}$, so $E[X(X - 1)] = ${n * (n - 1)} \\cdot ${p.mul(p).toLatex()} = ${answer.toLatex()}$.`,
              `每对同时成功的概率是 $\\left(${p.toLatex()}\\right)^2 = ${p.mul(p).toLatex()}$，所以 $E[X(X - 1)] = ${n * (n - 1)} \\cdot ${p.mul(p).toLatex()} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `It gives the right variance: $E[X(X - 1)] + E(X) - (E X)^2 = ${answer.toLatex()} + ${size.mul(p).toLatex()} - ${bracket(size.mul(p))}^2 = ${size.mul(p).mul(Q.of(1).sub(p)).toLatex()}$, which is $np(1 - p)$.`,
          `它给出正确的方差：$E[X(X - 1)] + E(X) - (E X)^2 = ${answer.toLatex()} + ${size.mul(p).toLatex()} - ${bracket(size.mul(p))}^2 = ${size.mul(p).mul(Q.of(1).sub(p)).toLatex()}$，正是 $np(1 - p)$。`,
        ),
      ),
    });
  },
};

const thinningPoisson: KnowledgePointDef = {
  id: "the-variance-of-a-thinned-poisson-count",
  title: t("The variance of a thinned Poisson count", "稀疏化泊松计数的方差"),
  explanation: t(
    "If each event of a Poisson process is kept independently with probability $p$, the events that are kept also form a Poisson process, with rate multiplied by $p$. A Poisson count has variance equal to its mean, so the variance is simply the new mean. The formula for a binomial variance, with its factor $1 - p$, does not apply here, because the total number of events is itself random.\n\n> **Watch out.** Do not use the binomial variance. With $10$ calls an hour on average and each urgent with probability $0.3$, the urgent calls in an hour have variance $3$, not $10 \\cdot 0.3 \\cdot 0.7 = 2.1$.",
    "如果泊松过程的每个事件以概率 $p$ 独立地保留，那么保留下来的事件也构成泊松过程，速率乘以 $p$。泊松计数的方差等于均值，所以方差就是新的均值。带因子 $1 - p$ 的二项方差公式在这里不适用，因为事件总数本身是随机的。\n\n> **注意。** 不要用二项方差。平均每小时 $10$ 个电话、每个以概率 $0.3$ 为紧急电话时，一小时内紧急电话数的方差是 $3$，而不是 $10 \\cdot 0.3 \\cdot 0.7 = 2.1$。",
  ),
  generate(rng) {
    const rate = rng.int(2, 20);
    const part = rng.int(1, 9);
    const hours = rng.int(1, 8);
    const total = rate * hours;
    const answer = Q.of(total * part, 10);
    const binomial = Q.of(total * part * (10 - part), 100);
    const meanSquare = Q.of(total * part * part, 100);
    return numberProblem({
      prompt: t(
        `Calls arrive as a Poisson process at ${rate} per hour, and each is urgent with probability $${tenths(part)}$, independently. Find the variance of the number of urgent calls in ${hours === 1 ? "one hour" : `${hours} hours`}.`,
        `电话按每小时 ${rate} 个的泊松过程到达，每个电话独立地以概率 $${tenths(part)}$ 为紧急电话。求 ${hours} 小时内紧急电话数的方差。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(total),
          "That is the variance of all the calls; only the urgent ones are counted.",
          "那是全部电话数的方差；只数紧急电话。",
        ),
        why(
          binomial,
          "That is the binomial variance $np(1 - p)$, but the number of calls is itself random.",
          "那是二项方差 $np(1 - p)$，但电话总数本身是随机的。",
        ),
        why(
          Q.of(rate * part, 10),
          `That is the variance for one hour; the question covers ${hours} hours.`,
          `那是一小时的方差；题目问的是 ${hours} 小时。`,
        ),
      ]),
      wrong: [answer.add(Q.of(1))],
      solution: walked(
        [
          [
            ["Find the mean of all calls", "求全部电话的均值"],
            t(
              `Over ${hours === 1 ? "one hour" : `${hours} hours`} the calls are Poisson with mean $${rate} \\cdot ${hours} = ${total}$.`,
              `在 ${hours} 小时内，电话数服从均值为 $${rate} \\cdot ${hours} = ${total}$ 的泊松分布。`,
            ),
          ],
          [
            ["Thin the process", "稀疏化"],
            t(
              `The urgent calls are Poisson with mean $${total} \\cdot ${tenths(part)} = ${answer.toLatex()}$, and a Poisson count has variance equal to its mean, so the variance is $${answer.toLatex()}$.`,
              `紧急电话数服从均值为 $${total} \\cdot ${tenths(part)} = ${answer.toLatex()}$ 的泊松分布，而泊松计数的方差等于均值，所以方差是 $${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `By the law of total variance, with $N$ the number of calls and $U$ the number of urgent ones: $E[\\operatorname{Var}(U \\mid N)] + \\operatorname{Var}(E[U \\mid N]) = ${total} \\cdot ${tenths(part)} \\cdot ${tenths(10 - part)} + ${tenths(part)}^2 \\cdot ${total} = ${binomial.toLatex()} + ${meanSquare.toLatex()} = ${answer.toLatex()}$.`,
          `由全方差公式，记 $N$ 为电话总数，$U$ 为紧急电话数：$E[\\operatorname{Var}(U \\mid N)] + \\operatorname{Var}(E[U \\mid N]) = ${total} \\cdot ${tenths(part)} \\cdot ${tenths(10 - part)} + ${tenths(part)}^2 \\cdot ${total} = ${binomial.toLatex()} + ${meanSquare.toLatex()} = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
};

const poissonIntervalMultiple: KnowledgePointDef = {
  id: "a-poisson-interval-as-a-multiple-of-an-exponential",
  title: t("A Poisson interval as a multiple of an exponential", "泊松区间概率写成指数的倍数"),
  explanation: t(
    "Every Poisson probability carries the same factor $e^{-\\lambda}$, so a sum of consecutive probabilities can be written as this factor times a sum of terms $\\frac{\\lambda^k}{k!}$. Writing it in this way keeps the exact value, with no rounding. Take care with which terms belong: both ends of the interval count if the inequalities are not strict, and the term for $k = 0$ equals 1 when it is included. With mean $20$, $P(1 \\le X \\le 2) = \\left(20 + \\frac{400}{2}\\right)e^{-20} = 220e^{-20}$.\n\n> **Watch out.** With $\\le$ on both sides, both end terms belong to the sum; do not drop either one, and do not add the term $1$ for $k = 0$ unless $0$ is in the interval.",
    "每个泊松概率都带有相同的因子 $e^{-\\lambda}$，所以连续几个概率之和可以写成这个因子乘以若干项 $\\frac{\\lambda^k}{k!}$ 之和。这样写保留了精确值，没有舍入。要注意哪些项属于这个和：不等式不严格时，区间两端都算，$k = 0$ 的项如果包含在内就等于 1。均值为 $20$ 时，$P(1 \\le X \\le 2) = \\left(20 + \\frac{400}{2}\\right)e^{-20} = 220e^{-20}$。\n\n> **注意。** 两边都是 $\\le$ 时，两端的项都属于这个和；不要漏掉任何一项，也不要在 $0$ 不在区间内时加上 $k = 0$ 的项 $1$。",
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
    const terms = Array.from({ length: hi - lo + 1 }, (_, i) => Q.of(lambda ** (lo + i), factorial(lo + i)).toLatex());
    return numberProblem({
      prompt: t(
        `For a Poisson variable with mean ${lambda}, $P(${lo} \\le X \\le ${hi}) = ce^{-${lambda}}$. Find $c$.`,
        `对均值为 ${lambda} 的泊松变量，$P(${lo} \\le X \\le ${hi}) = ce^{-${lambda}}$。求 $c$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          total(lo + 1, hi),
          `That leaves out the term for $k = ${lo}$; the inequality $${lo} \\le X$ includes it.`,
          `那是漏掉了 $k = ${lo}$ 的项；不等式 $${lo} \\le X$ 包含它。`,
        ),
        why(
          total(lo, hi - 1),
          `That leaves out the term for $k = ${hi}$; the inequality $X \\le ${hi}$ includes it.`,
          `那是漏掉了 $k = ${hi}$ 的项；不等式 $X \\le ${hi}$ 包含它。`,
        ),
        why(
          total(lo, hi + 1),
          `That adds the term for $k = ${hi + 1}$, which lies outside the interval.`,
          `那是多加了 $k = ${hi + 1}$ 的项，它在区间之外。`,
        ),
        why(
          answer.add(Q.of(1)),
          lo === 0 ? "That counts the term $1$ for $k = 0$ twice." : "That adds the term $1$ for $k = 0$, which is not in the interval.",
          lo === 0 ? "那是把 $k = 0$ 的项 $1$ 算了两次。" : "那是加上了 $k = 0$ 的项 $1$，它不在区间内。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Factor out the exponential", "提出指数因子"],
            t(
              `Each probability is $e^{-${lambda}}\\frac{${lambda}^k}{k!}$, so $c = \\sum_{${lo} \\le k \\le ${hi}} \\frac{${lambda}^k}{k!}$.`,
              `每个概率都是 $e^{-${lambda}}\\frac{${lambda}^k}{k!}$，所以 $c = \\sum_{${lo} \\le k \\le ${hi}} \\frac{${lambda}^k}{k!}$。`,
            ),
          ],
          [
            ["Add the terms", "把各项相加"],
            t(`$c = ${terms.join(" + ")} = ${answer.toLatex()}$.`, `$c = ${terms.join(" + ")} = ${answer.toLatex()}$。`),
          ],
        ],
        t(
          `$c$ is part of the full sum $\\sum_{k \\ge 0} \\frac{${lambda}^k}{k!} = ${lambda === 1 ? "e" : `e^{${lambda}}`}$, so $ce^{-${lambda}}$ is a probability below $1$.`,
          `$c$ 是完整和 $\\sum_{k \\ge 0} \\frac{${lambda}^k}{k!} = ${lambda === 1 ? "e" : `e^{${lambda}}`}$ 的一部分，所以 $ce^{-${lambda}}$ 是小于 $1$ 的概率。`,
        ),
      ),
    });
  },
};

const expectedFailures: KnowledgePointDef = {
  id: "the-expected-failures-before-the-last-success",
  title: t("The expected failures before the last success", "最后一次成功前的期望失败次数"),
  explanation: t(
    "The negative binomial variable can count either all the attempts up to the $r$-th success or only the failures, and it pays to check which is meant. Attempts have mean $\\frac{r}{p}$. Every attempt is either a failure or one of the $r$ successes, so the failures have mean $\\frac{r}{p} - r = \\frac{r(1 - p)}{p}$. Both versions of the variable have the same variance, because they differ only by the constant $r$.\n\n> **Watch out.** The attempts include the $r$ successes, so take them away. With $r = 3$ and $p = \\frac{1}{4}$ the attempts have mean $12$, and the failures have mean $12 - 3 = 9$, not $12$.",
    "负二项变量可以数到第 $r$ 次成功为止的全部尝试，也可以只数失败，值得确认指的是哪一个。尝试次数的均值是 $\\frac{r}{p}$。每次尝试要么是失败，要么是 $r$ 次成功之一，所以失败次数的均值是 $\\frac{r}{p} - r = \\frac{r(1 - p)}{p}$。两种变量的方差相同，因为它们只差常数 $r$。\n\n> **注意。** 尝试次数包括 $r$ 次成功，所以要把它们减掉。$r = 3$、$p = \\frac{1}{4}$ 时，尝试次数的均值是 $12$，失败次数的均值是 $12 - 3 = 9$，而不是 $12$。",
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
      mistakes: apart(answer, [
        why(
          attempts,
          `That is the expected number of shots, which includes the ${r} scores.`,
          `那是投篮次数的期望，其中包括 ${r} 次命中。`,
        ),
        why(
          count.mul(q),
          `That is $${r}(1 - p)$ without dividing by $p$; each score takes on average $\\frac{1 - p}{p}$ misses.`,
          `那是 $${r}(1 - p)$，没有除以 $p$；每次命中之前平均有 $\\frac{1 - p}{p}$ 次未命中。`,
        ),
        why(count.mul(p).div(q), "That turns $\\frac{1 - p}{p}$ upside down.", "那是把 $\\frac{1 - p}{p}$ 倒过来了。"),
      ]),
      wrong: [answer.add(Q.of(1))],
      solution: walked(
        [
          [
            ["Find the expected shots", "求投篮次数的期望"],
            t(
              `The shots needed for ${r} scores have mean $\\frac{r}{p} = ${r} \\div ${p.toLatex()} = ${attempts.toLatex()}$.`,
              `到第 ${r} 次命中为止的投篮次数均值是 $\\frac{r}{p} = ${r} \\div ${p.toLatex()} = ${attempts.toLatex()}$。`,
            ),
          ],
          [
            ["Take away the scores", "减去命中次数"],
            t(
              `${r} of those shots are scores, so the misses have mean $${attempts.toLatex()} - ${r} = ${answer.toLatex()}$.`,
              `其中 ${r} 次是命中，所以未命中次数的均值是 $${attempts.toLatex()} - ${r} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `Each score is preceded on average by $\\frac{1 - p}{p} = ${q.div(p).toLatex()}$ misses, and $${r} \\cdot ${q.div(p).toLatex()} = ${answer.toLatex()}$ agrees.`,
          `每次命中之前平均有 $\\frac{1 - p}{p} = ${q.div(p).toLatex()}$ 次未命中，而 $${r} \\cdot ${q.div(p).toLatex()} = ${answer.toLatex()}$，结果一致。`,
        ),
      ),
    });
  },
};

const remainingUniformWait: KnowledgePointDef = {
  id: "the-expected-remaining-wait-for-a-uniform-time",
  title: t("The expected remaining wait for a uniform time", "均匀时间的期望剩余等待"),
  explanation: t(
    "Given that a uniform waiting time on $[0, T]$ has already passed $a$, its conditional distribution is uniform on the rest of the interval, $[a, T]$. So the mean remaining wait is half of what is left, $\\frac{T - a}{2}$, and it shrinks as time passes. This is the opposite of the exponential distribution, which forgets the past: there, the expected remaining wait stays the same however long one has waited. If the wait is uniform on $[0, 120]$ and $100$ minutes have passed, the rest is uniform on $[0, 20]$, so the expected additional wait is $10$ minutes.\n\n> **Watch out.** $\\frac{T + a}{2}$, here $110$, is the expected total time; subtract the $a$ already waited.",
    "在 $[0, T]$ 上均匀的等待时间已经超过 $a$ 的条件下，它的条件分布在区间其余部分 $[a, T]$ 上均匀。所以平均剩余等待是剩下部分的一半，$\\frac{T - a}{2}$，它随时间流逝而缩短。这与指数分布相反，指数分布会遗忘过去：无论已经等了多久，期望的剩余等待都不变。若等待时间在 $[0, 120]$ 上均匀，已过去 $100$ 分钟，剩余时间在 $[0, 20]$ 上均匀，所以期望的额外等待是 $10$ 分钟。\n\n> **注意。** $\\frac{T + a}{2}$，这里即 $110$，是期望的总时间；要减去已经等过的 $a$。",
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
      mistakes: apart(answer, [
        why(
          Q.of(total, 2),
          "That is the mean wait before any time has passed; the uniform distribution remembers.",
          "那是还没开始等时的平均等待；均匀分布会记住已过去的时间。",
        ),
        why(
          Q.of(total + a, 2),
          `That is the expected total time; subtract the $${a}$ already waited.`,
          `那是期望的总时间；要减去已经等过的 $${a}$。`,
        ),
        why(Q.of(total - a), "That is the longest possible remaining wait, not its mean.", "那是最长可能的剩余等待，不是均值。"),
        why(
          Q.of(a, 2),
          "That is half the time already waited, not half the time that remains.",
          "那是已等时间的一半，不是剩余时间的一半。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Restrict the interval", "限制区间"],
            t(
              `Given the wait so far, the time is uniform on $[${a}, ${total}]$, so the remaining time is uniform on $[0, ${total - a}]$.`,
              `已知已等待的时间，总时间在 $[${a}, ${total}]$ 上均匀，所以剩余时间在 $[0, ${total - a}]$ 上均匀。`,
            ),
          ],
          [
            ["Take the midpoint", "取中点"],
            t(
              `Its mean is $\\frac{${total - a}}{2} = ${answer.toLatex()}$ minutes.`,
              `它的均值是 $\\frac{${total - a}}{2} = ${answer.toLatex()}$ 分钟。`,
            ),
          ],
        ],
        t(
          `The expected total time is $\\frac{${a} + ${total}}{2} = ${Q.of(total + a, 2).toLatex()}$, and $${Q.of(total + a, 2).toLatex()} - ${a} = ${answer.toLatex()}$.`,
          `期望的总时间是 $\\frac{${a} + ${total}}{2} = ${Q.of(total + a, 2).toLatex()}$，而 $${Q.of(total + a, 2).toLatex()} - ${a} = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
};

const exponentialGivenExceeds: KnowledgePointDef = {
  id: "the-mean-of-an-exponential-given-that-it-exceeds-a-value",
  title: t("The mean of an exponential given that it exceeds a value", "指数变量超过某值时的均值"),
  explanation: t(
    "The exponential distribution is memoryless, so given $X > a$, the excess $X - a$ has the same distribution as $X$ itself. The excess therefore has mean $\\frac{1}{\\lambda}$, and adding $a$ back gives $E(X \\mid X > a) = a + \\frac{1}{\\lambda}$. This avoids an integration by parts. Note that this conditional mean is the total time, and not just the extra part, so the value $a$ must be included. With $\\lambda = \\frac{1}{20}$ and $a = 100$, $E(X \\mid X > 100) = 100 + 20 = 120$.\n\n> **Watch out.** The mean of the excess is $\\frac{1}{\\lambda}$, not $\\lambda$: with $\\lambda = \\frac{1}{20}$ it is $20$, not $\\frac{1}{20}$.",
    "指数分布无记忆，所以在 $X > a$ 的条件下，超出量 $X - a$ 与 $X$ 本身同分布。因此超出量的均值是 $\\frac{1}{\\lambda}$，再加回 $a$，得 $E(X \\mid X > a) = a + \\frac{1}{\\lambda}$。这样就不必分部积分。注意这个条件均值是总时间，不只是多出来的部分，所以必须包含 $a$。若 $\\lambda = \\frac{1}{20}$，$a = 100$，则 $E(X \\mid X > 100) = 100 + 20 = 120$。\n\n> **注意。** 超出量的均值是 $\\frac{1}{\\lambda}$，不是 $\\lambda$：$\\lambda = \\frac{1}{20}$ 时它是 $20$，不是 $\\frac{1}{20}$。",
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
      mistakes: apart(answer, [
        why(
          mean,
          `That is only the mean excess; the total includes the $${a}$ already passed.`,
          `那只是超出量的均值；总时间还包括已经过去的 $${a}$。`,
        ),
        why(start, "That is where the excess starts; the excess itself has a positive mean.", "那是超出量的起点；超出量本身的均值为正。"),
        why(
          start.add(rate),
          "That adds the rate $\\lambda$; the mean excess is $\\frac{1}{\\lambda}$.",
          "那加的是速率 $\\lambda$；超出量的均值是 $\\frac{1}{\\lambda}$。",
        ),
        why(start.mul(mean), "That multiplies the two parts; they add.", "那是把两部分相乘；应当相加。"),
      ]),
      solution: walked(
        [
          [
            ["Use memorylessness", "利用无记忆性"],
            t(
              `Given $X > ${a}$, the excess $X - ${a}$ is again exponential with rate $${rate.toLatex()}$, so its mean is $\\frac{1}{\\lambda} = ${mean.toLatex()}$.`,
              `已知 $X > ${a}$，超出量 $X - ${a}$ 仍服从速率为 $${rate.toLatex()}$ 的指数分布，所以均值为 $\\frac{1}{\\lambda} = ${mean.toLatex()}$。`,
            ),
          ],
          [
            ["Add back the start", "加回起点"],
            t(
              `$E(X \\mid X > ${a}) = ${a} + ${mean.toLatex()} = ${answer.toLatex()}$.`,
              `$E(X \\mid X > ${a}) = ${a} + ${mean.toLatex()} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$${answer.toLatex()} - ${a} = ${mean.toLatex()}$, the unconditional mean $E(X)$, as memorylessness says.`,
          `$${answer.toLatex()} - ${a} = ${mean.toLatex()}$，正是无条件均值 $E(X)$，与无记忆性一致。`,
        ),
      ),
    });
  },
};

const conditionalMeanFromJoint: KnowledgePointDef = {
  id: "a-conditional-mean-from-joint-probabilities",
  title: t("A conditional mean from joint probabilities", "由联合概率求条件均值"),
  explanation: t(
    "Fixing $X = x$ picks out one row of the joint table. The entries of that row do not add to 1, so they must be divided by the marginal probability of the row before they can be used as a distribution. Only then can they be weighted by the values of $Y$. In effect, the conditional mean is the weighted sum of the row divided by the sum of the row, and the rest of the table plays no part. If the row for $X = 7$ holds $0.40$, $0.25$ and $0.05$ for $Y = 0, 1, 2$, it adds to $0.70$, its weighted sum is $0.25 + 2 \\cdot 0.05 = 0.35$, and $E(Y \\mid X = 7) = \\frac{0.35}{0.70} = \\frac{1}{2}$.\n\n> **Watch out.** Stopping at the weighted sum, here $0.35$, forgets to divide by the row total.",
    "固定 $X = x$ 就选出了联合表的一行。这一行的元素之和不是 1，所以必须除以这一行的边缘概率，才能作为分布使用。然后才能用 $Y$ 的值加权。实际上，条件均值是这一行的加权和除以这一行的和，表的其余部分不起作用。若 $X = 7$ 这一行在 $Y = 0, 1, 2$ 处为 $0.40$、$0.25$、$0.05$，行和为 $0.70$，加权和为 $0.25 + 2 \\cdot 0.05 = 0.35$，所以 $E(Y \\mid X = 7) = \\frac{0.35}{0.70} = \\frac{1}{2}$。\n\n> **注意。** 停在加权和，这里即 $0.35$，就忘了除以行和。",
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
      mistakes: apart(answer, [
        why(
          Q.of(weighted, 100),
          "That is the weighted sum of the row, not yet divided by the row total.",
          "那是这一行的加权和，还没有除以行和。",
        ),
        why(
          Q.of(1),
          "That is the middle value of $Y$; the three entries are not weighted equally.",
          "那是 $Y$ 的中间值；三个元素的权重并不相同。",
        ),
        why(Q.of(sum, 100), `That is $P(X = ${x})$, the row total.`, `那是行和 $P(X = ${x})$。`),
        why(
          Q.of(b + c, sum),
          `That is $P(Y \\ge 1 \\mid X = ${x})$; the value $Y = 2$ counts twice.`,
          `那是 $P(Y \\ge 1 \\mid X = ${x})$；$Y = 2$ 要算两次。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Add the row", "求行和"],
            t(
              `$P(X = ${x}) = ${shown(a)} + ${shown(b)} + ${shown(c)} = ${shown(sum)}$.`,
              `$P(X = ${x}) = ${shown(a)} + ${shown(b)} + ${shown(c)} = ${shown(sum)}$。`,
            ),
          ],
          [
            ["Weight by the values of Y", "按取值加权"],
            t(
              `The weighted sum is $${shown(b)} + 2 \\cdot ${shown(c)} = ${shown(weighted)}$, since $Y = 0$ adds nothing.`,
              `加权和为 $${shown(b)} + 2 \\cdot ${shown(c)} = ${shown(weighted)}$，因为 $Y = 0$ 不贡献。`,
            ),
          ],
          [
            ["Divide by the row total", "除以行和"],
            t(
              `$E(Y \\mid X = ${x}) = \\frac{${shown(weighted)}}{${shown(sum)}} = ${answer.toLatex()}$.`,
              `$E(Y \\mid X = ${x}) = \\frac{${shown(weighted)}}{${shown(sum)}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `The conditional probabilities $\\frac{${a}}{${sum}}$, $\\frac{${b}}{${sum}}$ and $\\frac{${c}}{${sum}}$ add to $1$, and the mean $${answer.toLatex()}$ lies between $0$ and $2$.`,
          `条件概率 $\\frac{${a}}{${sum}}$、$\\frac{${b}}{${sum}}$、$\\frac{${c}}{${sum}}$ 之和为 $1$，均值 $${answer.toLatex()}$ 介于 $0$ 和 $2$ 之间。`,
        ),
      ),
    });
  },
};

const conditionalVarianceOnTriangle: KnowledgePointDef = {
  id: "a-conditional-variance-on-a-uniform-triangle",
  figure: probabilityDrawings1["conditional-distributions-for-continuous-random-variables#a-conditional-variance-on-a-uniform-triangle"],
  title: t("A conditional variance on a uniform triangle", "均匀三角形上的条件方差"),
  explanation: t(
    "When a point is uniform on a region, fixing one coordinate leaves the other uniform along the corresponding slice of the region. On the triangle $0 < y < x < c$, the slice at $X = x$ is the interval from $0$ to $x$. So the conditional distribution depends on $x$ but not on the size $c$ of the triangle. The formula for the variance of a uniform variable then applies at once, with no integration needed. The figure takes $c = 4$ and $x = 3$: the slice runs from $0$ to $3$, so $\\operatorname{Var}(Y \\mid X = 3) = \\frac{3^2}{12} = \\frac{3}{4}$. On a much larger triangle, $c = 100$ with $x = 30$, the slice is $[0, 30]$ and the conditional variance is $\\frac{900}{12} = 75$.\n\n> **Watch out.** Use the length of the slice, $x$, not the size $c$ of the triangle. And $\\frac{x^2}{3}$ is $E(Y^2 \\mid X = x)$; the square of the mean $\\frac{x}{2}$ still has to be subtracted.",
    "当点在区域上均匀时，固定一个坐标后，另一个坐标沿区域的相应切片均匀。在三角形 $0 < y < x < c$ 上，$X = x$ 处的切片是从 $0$ 到 $x$ 的区间。所以条件分布取决于 $x$，但与三角形的大小 $c$ 无关。于是均匀变量的方差公式可以立即应用，不必积分。图中取 $c = 4$，$x = 3$：切片从 $0$ 到 $3$，所以 $\\operatorname{Var}(Y \\mid X = 3) = \\frac{3^2}{12} = \\frac{3}{4}$。在大得多的三角形上，$c = 100$，$x = 30$，切片为 $[0, 30]$，条件方差为 $\\frac{900}{12} = 75$。\n\n> **注意。** 要用切片的长度 $x$，而不是三角形的大小 $c$。$\\frac{x^2}{3}$ 是 $E(Y^2 \\mid X = x)$；还要减去均值 $\\frac{x}{2}$ 的平方。",
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
      mistakes: apart(answer, [
        why(Q.of(x, 2), "That is the conditional mean, not the variance.", "那是条件均值，不是方差。"),
        why(Q.of(x * x, 4), "That is the square of the conditional mean.", "那是条件均值的平方。"),
        why(
          Q.of(x * x, 3),
          "That is $E(Y^2 \\mid X = x)$; the square of the mean still has to be subtracted.",
          "那是 $E(Y^2 \\mid X = x)$；还要减去均值的平方。",
        ),
        why(
          Q.of(c * c, 12),
          `That uses the size $${c}$ of the triangle instead of the slice length $${x}$.`,
          `那用了三角形的大小 $${c}$，而不是切片长度 $${x}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the slice", "找出切片"],
            t(
              `Given $X = ${x}$, the point lies on the slice $0 < y < ${x}$, so $Y$ is uniform on $[0, ${x}]$.`,
              `已知 $X = ${x}$，点落在切片 $0 < y < ${x}$ 上，所以 $Y$ 在 $[0, ${x}]$ 上均匀。`,
            ),
          ],
          [
            ["Use the uniform variance", "用均匀分布的方差"],
            t(
              `$\\operatorname{Var}(Y \\mid X = ${x}) = \\frac{${x}^2}{12} = ${answer.toLatex()}$.`,
              `$\\operatorname{Var}(Y \\mid X = ${x}) = \\frac{${x}^2}{12} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$E(Y^2 \\mid X = ${x}) - E(Y \\mid X = ${x})^2 = ${Q.of(x * x, 3).toLatex()} - ${Q.of(x * x, 4).toLatex()} = ${answer.toLatex()}$.`,
          `$E(Y^2 \\mid X = ${x}) - E(Y \\mid X = ${x})^2 = ${Q.of(x * x, 3).toLatex()} - ${Q.of(x * x, 4).toLatex()} = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
};

const rectangleFromJointCdf: KnowledgePointDef = {
  id: "a-rectangle-probability-from-a-joint-cdf",
  figure: probabilityDrawings1["the-joint-cdf-of-two-continuous-random-variables#a-rectangle-probability-from-a-joint-cdf"],
  title: t("A rectangle probability from a joint CDF", "由联合分布函数求矩形的概率"),
  explanation: t(
    "A joint CDF gives the probability of a quarter-plane, and a rectangle can be built from four of these. The probability that $a < X \\le b$ and $c < Y \\le d$ is $F(b, d) - F(a, d) - F(b, c) + F(a, c)$. The last term is added back because the corner below and to the left of the rectangle was subtracted twice. Leaving out either of the middle terms would count regions that lie outside the rectangle. The figure marks the value of $F$ at each corner of the shaded rectangle. On $[0, 10] \\times [0, 10]$ with $F(x, y) = \\frac{x^2y^2}{10000}$, $P(5 < X \\le 10,\\ 5 < Y \\le 10) = \\frac{10000 - 2500 - 2500 + 625}{10000} = \\frac{9}{16}$.\n\n> **Watch out.** $F(b, d) - F(a, c)$ is not enough: it keeps the two strips beside the rectangle. Subtract both middle terms and add the corner back.",
    "联合分布函数给出四分之一平面的概率，矩形可以由四个这样的区域组成。$a < X \\le b$ 且 $c < Y \\le d$ 的概率是 $F(b, d) - F(a, d) - F(b, c) + F(a, c)$。最后一项要加回来，因为矩形左下方的角被减了两次。漏掉中间任何一项，都会把矩形外的区域算进去。图中在阴影矩形的每个角标出 $F$ 的值。在 $[0, 10] \\times [0, 10]$ 上，若 $F(x, y) = \\frac{x^2y^2}{10000}$，则 $P(5 < X \\le 10,\\ 5 < Y \\le 10) = \\frac{10000 - 2500 - 2500 + 625}{10000} = \\frac{9}{16}$。\n\n> **注意。** 只算 $F(b, d) - F(a, c)$ 不够：它保留了矩形旁边的两条带。要减去中间两项，再把角加回来。",
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
      mistakes: apart(answer, [
        why(
          Q.of(b * b * d * d, scale),
          `That is $F(${b}, ${d})$ alone, the whole quarter-plane below the top corner.`,
          `那只是 $F(${b}, ${d})$，即右上角左下方的整个四分之一平面。`,
        ),
        why(
          Q.of(b * b * d * d - a * a * c * c, scale),
          "That subtracts only the corner $F(a, c)$ and keeps the two strips beside the rectangle.",
          "那只减去了角 $F(a, c)$，保留了矩形旁边的两条带。",
        ),
        why(
          Q.of((b - a) * (d - c), big * tall),
          "That treats the distribution as uniform and takes a fraction of the area.",
          "那把分布当成均匀分布，取了面积的比例。",
        ),
        why(
          Q.of(b * b * (d * d - c * c), scale),
          `That leaves out the strip to the left of $x = ${a}$.`,
          `那漏掉了 $x = ${a}$ 左边的那条带。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Evaluate F at the corners", "求四个角的分布函数值"],
            t(
              `$F(${b}, ${d}) = \\frac{${b * b * d * d}}{${scale}}$, $F(${a}, ${d}) = \\frac{${a * a * d * d}}{${scale}}$, $F(${b}, ${c}) = \\frac{${b * b * c * c}}{${scale}}$, $F(${a}, ${c}) = \\frac{${a * a * c * c}}{${scale}}$.`,
              `$F(${b}, ${d}) = \\frac{${b * b * d * d}}{${scale}}$，$F(${a}, ${d}) = \\frac{${a * a * d * d}}{${scale}}$，$F(${b}, ${c}) = \\frac{${b * b * c * c}}{${scale}}$，$F(${a}, ${c}) = \\frac{${a * a * c * c}}{${scale}}$。`,
            ),
          ],
          [
            ["Combine the four terms", "组合四项"],
            t(
              `$F(${b}, ${d}) - F(${a}, ${d}) - F(${b}, ${c}) + F(${a}, ${c}) = \\frac{${b * b * d * d} - ${a * a * d * d} - ${b * b * c * c} + ${a * a * c * c}}{${scale}} = ${answer.toLatex()}$.`,
              `$F(${b}, ${d}) - F(${a}, ${d}) - F(${b}, ${c}) + F(${a}, ${c}) = \\frac{${b * b * d * d} - ${a * a * d * d} - ${b * b * c * c} + ${a * a * c * c}}{${scale}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `The numerator factors as $(${b * b} - ${a * a})(${d * d} - ${c * c}) = ${(b * b - a * a) * (d * d - c * c)}$, the product of the separate $x$ and $y$ ranges, which gives $${answer.toLatex()}$ again.`,
          `分子可分解为 $(${b * b} - ${a * a})(${d * d} - ${c * c}) = ${(b * b - a * a) * (d * d - c * c)}$，即 $x$ 与 $y$ 两个范围之积，同样得 $${answer.toLatex()}$。`,
        ),
      ),
    });
  },
};

const expectedSquareOfSum: KnowledgePointDef = {
  id: "the-expected-square-of-a-sum",
  title: t("The expected square of a sum", "和的平方的期望"),
  explanation: t(
    "Expanding gives $E[(X + Y)^2] = E(X^2) + 2E(XY) + E(Y^2)$, and independence turns the middle term into $2E(X)E(Y)$. A tidier way is to use $E(W^2) = \\operatorname{Var}(W) + E(W)^2$ with $W = X + Y$. For independent variables the variances add, so the result is the sum of the variances plus the square of the sum of the means. Both routes give the same value. With $E(X) = 10$, $\\operatorname{Var}(X) = 4$, $E(Y) = -30$ and $\\operatorname{Var}(Y) = 5$, $E[(X + Y)^2] = 9 + (-20)^2 = 409$.\n\n> **Watch out.** Square the sum of the means, not each mean: $9 + 10^2 + 30^2 = 1009$ drops the cross term $2E(X)E(Y) = -600$.",
    "展开得 $E[(X + Y)^2] = E(X^2) + 2E(XY) + E(Y^2)$，独立性把中间项变成 $2E(X)E(Y)$。更简洁的方法是对 $W = X + Y$ 用 $E(W^2) = \\operatorname{Var}(W) + E(W)^2$。对独立变量，方差相加，所以结果是方差之和加上均值之和的平方。两条路得到相同的值。若 $E(X) = 10$，$\\operatorname{Var}(X) = 4$，$E(Y) = -30$，$\\operatorname{Var}(Y) = 5$，则 $E[(X + Y)^2] = 9 + (-20)^2 = 409$。\n\n> **注意。** 要把均值之和平方，而不是分别平方：$9 + 10^2 + 30^2 = 1009$ 漏掉了交叉项 $2E(X)E(Y) = -600$。",
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
      mistakes: apart(answer, [
        why(vx + vy, "That is the variance of the sum; the square of its mean must be added.", "那是和的方差；还要加上均值的平方。"),
        why((mx + my) ** 2, "That is the square of the mean; the variance must be added.", "那是均值的平方；还要加上方差。"),
        why(
          vx + vy + mx * mx + my * my,
          "That squares each mean separately and drops the cross term $2E(X)E(Y)$.",
          "那是把两个均值分别平方，漏掉了交叉项 $2E(X)E(Y)$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Describe the sum", "描述和"],
            t(
              `$W = X + Y$ has mean $${mx} + ${inParens(my)} = ${mx + my}$ and, by independence, variance $${vx} + ${vy} = ${vx + vy}$.`,
              `$W = X + Y$ 的均值为 $${mx} + ${inParens(my)} = ${mx + my}$，由独立性，方差为 $${vx} + ${vy} = ${vx + vy}$。`,
            ),
          ],
          [
            ["Add the squared mean", "加上均值的平方"],
            t(
              `$E(W^2) = \\operatorname{Var}(W) + E(W)^2 = ${vx + vy} + ${inParens(mx + my)}^2 = ${answer}$.`,
              `$E(W^2) = \\operatorname{Var}(W) + E(W)^2 = ${vx + vy} + ${inParens(mx + my)}^2 = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Expanding instead: $E(X^2) + 2E(X)E(Y) + E(Y^2) = ${vx + mx * mx} ${mx * my < 0 ? "-" : "+"} ${Math.abs(2 * mx * my)} + ${vy + my * my} = ${answer}$.`,
          `改用展开：$E(X^2) + 2E(X)E(Y) + E(Y^2) = ${vx + mx * mx} ${mx * my < 0 ? "-" : "+"} ${Math.abs(2 * mx * my)} + ${vy + my * my} = ${answer}$。`,
        ),
      ),
    });
  },
};

const varianceOfProduct: KnowledgePointDef = {
  id: "the-variance-of-a-product-of-independent-variables",
  title: t("The variance of a product of independent variables", "独立变量之积的方差"),
  explanation: t(
    "Variances add for a sum of independent variables, but they do not multiply for a product. Independence does give $E(XY) = E(X)E(Y)$ and $E(X^2Y^2) = E(X^2)E(Y^2)$, since $X^2$ and $Y^2$ are also independent. So $\\operatorname{Var}(XY) = E(X^2)E(Y^2) - (E(X)E(Y))^2$. Each second moment is the variance plus the square of the mean, which shows why the means must be known too, and not only the variances. With $E(X) = 10$, $\\operatorname{Var}(X) = 1$, $E(Y) = 20$ and $\\operatorname{Var}(Y) = 4$, the second moments are $101$ and $404$, so $\\operatorname{Var}(XY) = 101 \\cdot 404 - 200^2 = 804$.\n\n> **Watch out.** The product of the variances, here $4$, is far too small: large means make the product spread much more.",
    "独立变量之和的方差相加，但乘积的方差并不相乘。独立性确实给出 $E(XY) = E(X)E(Y)$ 和 $E(X^2Y^2) = E(X^2)E(Y^2)$，因为 $X^2$ 和 $Y^2$ 也独立。所以 $\\operatorname{Var}(XY) = E(X^2)E(Y^2) - (E(X)E(Y))^2$。每个二阶矩是方差加均值的平方，这说明除了方差，还必须知道均值。若 $E(X) = 10$，$\\operatorname{Var}(X) = 1$，$E(Y) = 20$，$\\operatorname{Var}(Y) = 4$，二阶矩为 $101$ 和 $404$，所以 $\\operatorname{Var}(XY) = 101 \\cdot 404 - 200^2 = 804$。\n\n> **注意。** 方差之积，这里即 $4$，远远太小：均值大时，乘积的波动大得多。",
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
      mistakes: apart(answer, [
        why(vx * vy, "That multiplies the variances; the means matter too.", "那是把方差相乘；均值也有影响。"),
        why(sx * sy, "That is $E(X^2Y^2)$; the square of $E(XY)$ must be subtracted.", "那是 $E(X^2Y^2)$；还要减去 $E(XY)$ 的平方。"),
        why(
          vx * my * my + vy * mx * mx,
          "That leaves out the term $\\operatorname{Var}(X)\\operatorname{Var}(Y)$.",
          "那漏掉了 $\\operatorname{Var}(X)\\operatorname{Var}(Y)$ 这一项。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the second moments", "求二阶矩"],
            t(
              `$E(X^2) = ${vx} + ${inParens(mx)}^2 = ${sx}$ and $E(Y^2) = ${vy} + ${inParens(my)}^2 = ${sy}$.`,
              `$E(X^2) = ${vx} + ${inParens(mx)}^2 = ${sx}$，$E(Y^2) = ${vy} + ${inParens(my)}^2 = ${sy}$。`,
            ),
          ],
          [
            ["Use independence", "利用独立性"],
            t(
              `$E(X^2Y^2) = ${sx} \\cdot ${sy} = ${sx * sy}$ and $E(XY) = ${mx * my}$.`,
              `$E(X^2Y^2) = ${sx} \\cdot ${sy} = ${sx * sy}$，$E(XY) = ${mx * my}$。`,
            ),
          ],
          [
            ["Subtract the squared mean", "减去均值的平方"],
            t(
              `$\\operatorname{Var}(XY) = ${sx * sy} - ${inParens(mx * my)}^2 = ${answer}$.`,
              `$\\operatorname{Var}(XY) = ${sx * sy} - ${inParens(mx * my)}^2 = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The same value comes from $\\operatorname{Var}(X)\\operatorname{Var}(Y) + \\operatorname{Var}(X)E(Y)^2 + \\operatorname{Var}(Y)E(X)^2 = ${vx * vy} + ${vx * my * my} + ${vy * mx * mx} = ${answer}$.`,
          `由 $\\operatorname{Var}(X)\\operatorname{Var}(Y) + \\operatorname{Var}(X)E(Y)^2 + \\operatorname{Var}(Y)E(X)^2 = ${vx * vy} + ${vx * my * my} + ${vy * mx * mx} = ${answer}$ 也得到同样的值。`,
        ),
      ),
    });
  },
};

const momentsForPowerDensity: KnowledgePointDef = {
  id: "the-method-of-moments-for-a-power-density",
  title: t("The method of moments for a power density", "幂密度的矩估计"),
  explanation: t(
    "The method of moments sets the mean of the model equal to the sample mean, and solves for the parameter. For the density $(\\theta + 1)x^\\theta$ on $[0, 1]$, the mean is $\\frac{\\theta + 1}{\\theta + 2}$. Setting this equal to $m$ and clearing the fraction gives a linear equation, with solution $\\hat{\\theta} = \\frac{2m - 1}{1 - m}$. A larger sample mean gives a larger estimate, because mass near 1 needs a large exponent.\n\nFor a sample mean of $\\frac{3}{4}$: $\\frac{\\theta + 1}{\\theta + 2} = \\frac{3}{4}$ gives $4\\theta + 4 = 3\\theta + 6$, so $\\hat{\\theta} = 2$.\n\nCheck: with $\\theta = 2$ the density is $3x^{2}$, and $\\int_0^1 x \\cdot 3x^{2}\\,dx = \\frac{3}{4}$, the sample mean.\n\n> **Watch out.** The mean is $\\frac{\\theta + 1}{\\theta + 2}$, not $\\frac{\\theta}{\\theta + 1}$: the extra factor $x$ raises the power to $\\theta + 1$ and the integral divides by $\\theta + 2$. Using the wrong mean gives $\\frac{m}{1 - m} = 3$ here.",
    "矩估计令模型的均值等于样本均值，再解出参数。对 $[0, 1]$ 上的密度 $(\\theta + 1)x^\\theta$，均值是 $\\frac{\\theta + 1}{\\theta + 2}$。令它等于 $m$ 并去分母，得到线性方程，解是 $\\hat{\\theta} = \\frac{2m - 1}{1 - m}$。样本均值越大，估计也越大，因为质量靠近 1 需要大的指数。\n\n若样本均值为 $\\frac{3}{4}$：由 $\\frac{\\theta + 1}{\\theta + 2} = \\frac{3}{4}$ 得 $4\\theta + 4 = 3\\theta + 6$，所以 $\\hat{\\theta} = 2$。\n\n检验：$\\theta = 2$ 时密度为 $3x^{2}$，$\\int_0^1 x \\cdot 3x^{2}\\,dx = \\frac{3}{4}$，正是样本均值。\n\n> **注意。** 均值是 $\\frac{\\theta + 1}{\\theta + 2}$，不是 $\\frac{\\theta}{\\theta + 1}$：多乘的 $x$ 使幂次变为 $\\theta + 1$，积分后除以 $\\theta + 2$。用错的均值在这里会得到 $\\frac{m}{1 - m} = 3$。",
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
      mistakes: distinctMistakes(answer, [
        why(
          m.div(rest),
          "This solves $\\frac{\\theta}{\\theta + 1} = m$; the mean of this density is $\\frac{\\theta + 1}{\\theta + 2}$.",
          "这解的是 $\\frac{\\theta}{\\theta + 1} = m$；该密度的均值是 $\\frac{\\theta + 1}{\\theta + 2}$。",
        ),
        why(
          one.div(rest),
          "This is $\\theta + 2$, the denominator of the mean; subtract $2$ to get $\\theta$.",
          "这是均值的分母 $\\theta + 2$；还要减去 $2$ 才是 $\\theta$。",
        ),
        why(
          answer.add(one),
          "This is $\\theta + 1$, the numerator of the mean, not $\\theta$ itself.",
          "这是均值的分子 $\\theta + 1$，不是 $\\theta$ 本身。",
        ),
        why(
          answer.neg(),
          "This has the wrong sign; a mean above $\\frac{1}{2}$ needs a positive exponent.",
          "符号错了；均值大于 $\\frac{1}{2}$ 需要正的指数。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Match the means", "令均值相等"],
            t(`Set $\\frac{\\theta + 1}{\\theta + 2} = ${m.toLatex()}$.`, `令 $\\frac{\\theta + 1}{\\theta + 2} = ${m.toLatex()}$。`),
          ],
          [
            ["Clear the fraction", "去分母"],
            t(
              `$${q}(\\theta + 1) = ${p}(\\theta + 2)$, so $${q - p === 1 ? "" : q - p}\\theta = ${2 * p - q}$ and $\\theta = ${q - p === 1 ? answer.toLatex() : `\\frac{${2 * p - q}}{${q - p}}${lowestTerms(2 * p - q, q - p)}`}$.`,
              `$${q}(\\theta + 1) = ${p}(\\theta + 2)$，所以 $${q - p === 1 ? "" : q - p}\\theta = ${2 * p - q}$，$\\theta = ${q - p === 1 ? answer.toLatex() : `\\frac{${2 * p - q}}{${q - p}}${lowestTerms(2 * p - q, q - p)}`}$。`,
            ),
          ],
        ],
        t(
          `Putting $\\theta = ${answer.toLatex()}$ back: $\\theta + 1 = ${answer.add(one).toLatex()}$ and $\\theta + 2 = ${answer.add(Q.of(2)).toLatex()}$, whose ratio is $${m.toLatex()}$, the sample mean.`,
          `代回 $\\theta = ${answer.toLatex()}$：$\\theta + 1 = ${answer.add(one).toLatex()}$，$\\theta + 2 = ${answer.add(Q.of(2)).toLatex()}$，两者之比为 $${m.toLatex()}$，正是样本均值。`,
        ),
      ),
    });
  },
};

const narrowingTheMargin: KnowledgePointDef = {
  id: "the-sample-size-after-narrowing-the-margin",
  title: t("The sample size after narrowing the margin", "缩小误差范围后的样本量"),
  explanation: t(
    "The margin of error of a mean is $z\\frac{\\sigma}{\\sqrt{n}}$, so it shrinks only with the square root of the sample size. To divide the margin by $k$ with the same confidence and spread, the sample must be multiplied by $k^2$. This means that precision gets expensive quickly: halving the margin needs four times as much data. The actual values of $z$ and $\\sigma$ cancel in the comparison and do not need to be known.\n\nA sample of $50$ gives some margin. To cut that margin to a third, the sample must grow by $3^{2} = 9$, to $450$.\n\nCheck: the margin scales by $\\sqrt{\\frac{50}{450}} = \\sqrt{\\frac{1}{9}} = \\frac{1}{3}$, as required.\n\n> **Watch out.** Multiplying the sample by $3$, to $150$, only divides the margin by $\\sqrt{3} \\approx 1.73$, because the margin depends on $\\sqrt{n}$, not on $n$.",
    "均值的误差范围是 $z\\frac{\\sigma}{\\sqrt{n}}$，所以它只随样本量的平方根缩小。要在相同置信度和离散程度下把误差范围除以 $k$，样本量必须乘以 $k^2$。这意味着精度很快变得昂贵：误差范围减半需要四倍的数据。在比较中 $z$ 和 $\\sigma$ 的实际值相消，不需要知道。\n\n容量为 $50$ 的样本给出某个误差范围。要把它缩小到三分之一，样本量要乘以 $3^{2} = 9$，即 $450$。\n\n检验：误差范围按 $\\sqrt{\\frac{50}{450}} = \\sqrt{\\frac{1}{9}} = \\frac{1}{3}$ 缩放，符合要求。\n\n> **注意。** 把样本量乘以 $3$ 变为 $150$，误差范围只除以 $\\sqrt{3} \\approx 1.73$，因为误差范围取决于 $\\sqrt{n}$ 而不是 $n$。",
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
      mistakes: distinctMistakes(answer, [
        why(
          n * k,
          `This multiplies the sample by $${k}$, which only divides the margin by $\\sqrt{${k}}$.`,
          `这把样本量乘以 $${k}$，误差范围只除以 $\\sqrt{${k}}$。`,
        ),
        why(
          n * k * k * k,
          `This multiplies by $${k}^{3}$; the margin depends on $\\sqrt{n}$, so the factor is $${k}^{2}$.`,
          `这乘以了 $${k}^{3}$；误差范围取决于 $\\sqrt{n}$，因子应为 $${k}^{2}$。`,
        ),
        why(
          2 * n * k,
          `This doubles $${k}n$; the factor is $${k}^{2} = ${k * k}$, not $2 \\cdot ${k}$.`,
          `这把 $${k}n$ 加倍；因子应为 $${k}^{2} = ${k * k}$，不是 $2 \\cdot ${k}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Compare the margins", "比较误差范围"],
            t(
              `With $z$ and $\\sigma$ fixed, the margins are in the ratio $\\sqrt{\\frac{${n}}{n'}}$, which must equal $\\frac{1}{${k}}$.`,
              `$z$ 和 $\\sigma$ 不变时，误差范围之比为 $\\sqrt{\\frac{${n}}{n'}}$，它必须等于 $\\frac{1}{${k}}$。`,
            ),
          ],
          [
            ["Solve for the new size", "解出新样本量"],
            t(`Squaring, $n' = ${k}^{2} \\cdot ${n} = ${answer}$.`, `两边平方，$n' = ${k}^{2} \\cdot ${n} = ${answer}$。`),
          ],
        ],
        t(
          `$\\sqrt{\\frac{${answer}}{${n}}} = \\sqrt{${k * k}} = ${k}$, so the new margin is $\\frac{1}{${k}}$ of the old one.`,
          `$\\sqrt{\\frac{${answer}}{${n}}} = \\sqrt{${k * k}} = ${k}$，所以新的误差范围是原来的 $\\frac{1}{${k}}$。`,
        ),
      ),
    });
  },
};

const testOnUniform: KnowledgePointDef = {
  id: "the-size-and-power-of-a-test-on-a-uniform-variable",
  title: t("The size and power of a test on a uniform variable", "均匀变量检验的水平和功效"),
  explanation: t(
    "The size of a test is the probability of rejecting when the null hypothesis is true, and its power is the probability of rejecting when the alternative is true. Both are the probability of the same event, the critical region, computed under different distributions. For one observation of a uniform variable on $[0, \\theta]$, rejecting for values above $c$ has probability $\\frac{\\theta - c}{\\theta}$, so a larger $\\theta$ gives greater power. Testing $\\theta = 20$ against $\\theta = 40$ and rejecting when $X > 15$, the size is $\\frac{20 - 15}{20} = \\frac{1}{4}$ and the power is $\\frac{40 - 15}{40} = \\frac{5}{8}$.\n\n> **Watch out.** Use $H_0$'s $\\theta$ for the size and $H_1$'s for the power, and take the probability above $c$, $1 - \\frac{c}{\\theta}$, not $\\frac{c}{\\theta}$.",
    "检验的水平是原假设为真时拒绝的概率，功效是备择假设为真时拒绝的概率。两者是同一事件（拒绝域）在不同分布下的概率。对 $[0, \\theta]$ 上均匀变量的一个观测，当值超过 $c$ 时拒绝的概率是 $\\frac{\\theta - c}{\\theta}$，所以 $\\theta$ 越大，功效越大。检验 $\\theta = 20$ 对 $\\theta = 40$，当 $X > 15$ 时拒绝，则水平为 $\\frac{20 - 15}{20} = \\frac{1}{4}$，功效为 $\\frac{40 - 15}{40} = \\frac{5}{8}$。\n\n> **注意。** 水平用 $H_0$ 的 $\\theta$，功效用 $H_1$ 的 $\\theta$，并且取 $c$ 上方的概率 $1 - \\frac{c}{\\theta}$，而不是 $\\frac{c}{\\theta}$。",
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
      mistakes: apart(answer, [
        why(
          asksPower ? size : strength,
          `That is the ${asksPower ? "size" : "power"}, computed with $\\theta = ${asksPower ? a : b}$; the ${asksPower ? "power" : "size"} uses $\\theta = ${asksPower ? b : a}$.`,
          `那是${asksPower ? "水平" : "功效"}，用的是 $\\theta = ${asksPower ? a : b}$；${asksPower ? "功效" : "水平"}要用 $\\theta = ${asksPower ? b : a}$。`,
        ),
        why(
          Q.of(c, asksPower ? b : a),
          `That is $P(X \\le ${c})$, the probability of keeping $H_0$; the test rejects above $${c}$.`,
          `那是 $P(X \\le ${c})$，即保留 $H_0$ 的概率；检验在 $${c}$ 上方拒绝。`,
        ),
        why(
          Q.of(c, asksPower ? a : b),
          `That is the probability of keeping $H_0$, and under the wrong $\\theta$ as well.`,
          `那是保留 $H_0$ 的概率，而且用错了 $\\theta$。`,
        ),
        why(
          Q.of(b - a, b),
          "That measures the gap between the two values of $\\theta$, not the probability of the critical region.",
          "那衡量的是两个 $\\theta$ 值之间的差距，而不是拒绝域的概率。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Choose the distribution", "选定分布"],
            t(
              `The ${asksPower ? "power" : "size"} is computed under $${asksPower ? "H_1" : "H_0"}$, so $\\theta = ${asksPower ? b : a}$.`,
              `${asksPower ? "功效" : "水平"}在 $${asksPower ? "H_1" : "H_0"}$ 下计算，所以 $\\theta = ${asksPower ? b : a}$。`,
            ),
          ],
          [
            ["Find the probability of rejecting", "求拒绝的概率"],
            t(
              `$P(X > ${c}) = 1 - \\frac{${c}}{${asksPower ? b : a}} = ${answer.toLatex()}$.`,
              `$P(X > ${c}) = 1 - \\frac{${c}}{${asksPower ? b : a}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `The power $${strength.toLatex()}$ is greater than the size $${size.toLatex()}$, as it should be, since a larger $\\theta$ puts more probability above $${c}$.`,
          `功效 $${strength.toLatex()}$ 大于水平 $${size.toLatex()}$，理应如此，因为 $\\theta$ 越大，$${c}$ 上方的概率越大。`,
        ),
      ),
    });
  },
};

const anovaFFromTotals: KnowledgePointDef = {
  id: "the-f-statistic-from-the-total-and-within-sums-of-squares",
  title: t("The F statistic from the total and within sums of squares", "由总平方和与组内平方和求 F 统计量"),
  explanation: t(
    "The identity $SST = SSB + SSW$ means that the between-groups sum of squares can be found by subtraction. Each sum of squares must then be divided by its degrees of freedom before they are compared, $k - 1$ between $k$ groups and $N - k$ within them. The statistic $F$ is the ratio of these two mean squares. Comparing raw sums of squares would be misleading, because there are usually far more degrees of freedom within groups. With $2$ groups, $12$ observations, $SST = 100$ and $SSW = 60$: $SSB = 40$ on $1$ degree of freedom, the within mean square is $\\frac{60}{10} = 6$, and $F = \\frac{40}{6} = \\frac{20}{3}$.\n\n> **Watch out.** Subtract $SSW$ from $SST$ before dividing; $SST$ itself is not the between-groups sum of squares.",
    "恒等式 $SST = SSB + SSW$ 说明组间平方和可以用减法求得。比较之前，每个平方和必须除以它的自由度：$k$ 组之间是 $k - 1$，组内是 $N - k$。统计量 $F$ 是这两个均方之比。直接比较平方和会产生误导，因为组内的自由度通常多得多。若有 $2$ 组、$12$ 个观测，$SST = 100$，$SSW = 60$：则 $SSB = 40$，自由度为 $1$，组内均方为 $\\frac{60}{10} = 6$，$F = \\frac{40}{6} = \\frac{20}{3}$。\n\n> **注意。** 要先用 $SST$ 减去 $SSW$ 再相除；$SST$ 本身不是组间平方和。",
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
      mistakes: apart(answer, [
        why(
          Q.of(ssb, ssw),
          "That compares the raw sums of squares; divide each by its degrees of freedom first.",
          "那是直接比较平方和；要先分别除以各自的自由度。",
        ),
        why(
          Q.of(sst, ssw),
          "That divides $SST$ by $SSW$; subtract $SSW$ to get $SSB$, then divide each by its degrees of freedom.",
          "那是用 $SST$ 除以 $SSW$；要先减去 $SSW$ 得到 $SSB$，再分别除以各自的自由度。",
        ),
        why(Q.of(within, between), "That is upside down; the between-groups mean square goes on top.", "那是颠倒了；组间均方应在分子。"),
        why(
          Q.of(between * (n - 1), sst),
          `That divides by the total mean square $\\frac{SST}{N - 1}$; the denominator is the within-groups mean square.`,
          "那是除以总均方 $\\frac{SST}{N - 1}$；分母应是组内均方。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the between-groups sum of squares", "求组间平方和"],
            t(`$SSB = ${sst} - ${ssw} = ${ssb}$.`, `$SSB = ${sst} - ${ssw} = ${ssb}$。`),
          ],
          [
            ["Find the mean squares", "求均方"],
            t(
              `$\\frac{${ssb}}{${k - 1}} = ${between}$ and $\\frac{${ssw}}{${n - k}} = ${within}$.`,
              `$\\frac{${ssb}}{${k - 1}} = ${between}$，$\\frac{${ssw}}{${n - k}} = ${within}$。`,
            ),
          ],
          [
            ["Divide", "相除"],
            t(
              `$F = \\frac{${between}}{${within}}${answer.toLatex() === `\\frac{${between}}{${within}}` ? "" : ` = ${answer.toLatex()}`}$.`,
              `$F = \\frac{${between}}{${within}}${answer.toLatex() === `\\frac{${between}}{${within}}` ? "" : ` = ${answer.toLatex()}`}$。`,
            ),
          ],
        ],
        t(
          `The degrees of freedom $${k - 1}$ and $${n - k}$ add to $N - 1 = ${n - 1}$.`,
          `自由度 $${k - 1}$ 与 $${n - k}$ 之和为 $N - 1 = ${n - 1}$。`,
        ),
      ),
    });
  },
};

const reversedRanks: KnowledgePointDef = {
  id: "the-squared-rank-differences-of-reversed-rankings",
  title: t("The squared rank differences of reversed rankings", "完全相反排名的秩差平方和"),
  explanation: t(
    "When one ranking is exactly the reverse of another, the rank differences are as large as they can be, and Spearman's coefficient reaches its lowest value of $-1$. Setting $r_s = 1 - \\frac{6\\sum d^2}{n(n^2 - 1)} = -1$ and solving shows that $\\sum d^2 = \\frac{n(n^2 - 1)}{3}$. So this formula gives the largest possible sum of squared differences for $n$ items, which is a useful check on hand calculations. For $40$ items it is $\\frac{40 \\cdot 1599}{3} = 21320$.\n\n> **Watch out.** $r_s = -1$ makes the fraction $\\frac{6\\sum d^2}{n(n^2 - 1)}$ equal to $2$, not $1$; setting it to $1$ gives the halved value, which belongs to $r_s = 0$.",
    "当一个排名恰好是另一个的逆序时，秩差达到最大，斯皮尔曼系数达到最小值 $-1$。令 $r_s = 1 - \\frac{6\\sum d^2}{n(n^2 - 1)} = -1$ 并求解，得 $\\sum d^2 = \\frac{n(n^2 - 1)}{3}$。所以这个公式给出 $n$ 个项目的秩差平方和的最大可能值，这是手算时有用的检查。对 $40$ 个项目，它是 $\\frac{40 \\cdot 1599}{3} = 21320$。\n\n> **注意。** $r_s = -1$ 使分数 $\\frac{6\\sum d^2}{n(n^2 - 1)}$ 等于 $2$，而不是 $1$；令它等于 $1$ 得到的是一半，那对应 $r_s = 0$。",
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
      mistakes: apart(Q.of(answer), [
        why(
          Q.of(n * (n * n - 1), 6),
          "That sets the fraction to $1$, which gives $r_s = 0$; reversed rankings need $r_s = -1$, so the fraction is $2$.",
          "那是令分数等于 $1$，得到 $r_s = 0$；相反的排名要求 $r_s = -1$，所以分数是 $2$。",
        ),
        why(
          Q.of(n * (n * n - 1)),
          "That forgets to divide by $3$: $6\\sum d^2 = 2n(n^2 - 1)$.",
          "那忘了除以 $3$：$6\\sum d^2 = 2n(n^2 - 1)$。",
        ),
        why(
          Q.of(2 * n * (n * n - 1)),
          "That leaves out the $6$ in front of $\\sum d^2$; divide by it as well.",
          "那漏掉了 $\\sum d^2$ 前面的 $6$；还要除以它。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Use the value of the coefficient", "用系数的值"],
            t(
              `Reversed rankings have $r_s = -1$, so $1 - \\frac{6\\sum d^2}{${n * (n * n - 1)}} = -1$ and $\\frac{6\\sum d^2}{${n * (n * n - 1)}} = 2$.`,
              `相反的排名有 $r_s = -1$，所以 $1 - \\frac{6\\sum d^2}{${n * (n * n - 1)}} = -1$，$\\frac{6\\sum d^2}{${n * (n * n - 1)}} = 2$。`,
            ),
          ],
          [
            ["Solve", "求解"],
            t(
              `$\\sum d^2 = \\frac{2 \\cdot ${n * (n * n - 1)}}{6} = ${answer}$.`,
              `$\\sum d^2 = \\frac{2 \\cdot ${n * (n * n - 1)}}{6} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$1 - \\frac{6 \\cdot ${answer}}{${n * (n * n - 1)}} = 1 - 2 = -1$.`,
          `$1 - \\frac{6 \\cdot ${answer}}{${n * (n * n - 1)}} = 1 - 2 = -1$。`,
        ),
      ),
    });
  },
};

const expectedRange: KnowledgePointDef = {
  id: "the-expected-range-of-a-uniform-sample",
  title: t("The expected range of a uniform sample", "均匀样本的期望极差"),
  explanation: t(
    "On average, $n$ uniform points divide $[0, \\theta]$ into $n + 1$ gaps of equal expected length $\\frac{\\theta}{n + 1}$. The largest point then has mean $\\frac{n\\theta}{n + 1}$, and the smallest has mean $\\frac{\\theta}{n + 1}$. The range is their difference, and expectation is linear, even though the two order statistics are dependent. So the expected range covers $n - 1$ of the gaps, and it never quite reaches the full length $\\theta$.\n\nFor $4$ values on $[0, 10]$ there are $5$ gaps of expected length $2$. The largest has mean $8$ and the smallest has mean $2$, so the expected range is $8 - 2 = 6 = \\frac{10 \\cdot 3}{5}$.\n\nCheck: the range leaves out the gap below the smallest and the gap above the largest, $2 + 2 = 4$, and $6 + 4 = 10$ is the full length.\n\n> **Watch out.** The denominator is $n + 1$, the number of gaps, not $n$: $\\frac{10 \\cdot 3}{4} = 7.5$ uses gaps that are too long.",
    "平均而言，$n$ 个均匀点把 $[0, \\theta]$ 分成 $n + 1$ 段，每段的期望长度都是 $\\frac{\\theta}{n + 1}$。于是最大点的均值是 $\\frac{n\\theta}{n + 1}$，最小点的均值是 $\\frac{\\theta}{n + 1}$。极差是它们的差，而且期望是线性的，尽管这两个顺序统计量并不独立。所以期望极差覆盖 $n - 1$ 段，永远达不到全长 $\\theta$。\n\n对 $[0, 10]$ 上的 $4$ 个值，共有 $5$ 段，每段期望长度为 $2$。最大值的均值是 $8$，最小值的均值是 $2$，所以期望极差是 $8 - 2 = 6 = \\frac{10 \\cdot 3}{5}$。\n\n检验：极差不包括最小值下方的一段和最大值上方的一段，$2 + 2 = 4$，而 $6 + 4 = 10$ 正是全长。\n\n> **注意。** 分母是段数 $n + 1$，而不是 $n$：$\\frac{10 \\cdot 3}{4} = 7.5$ 用的段太长了。",
  ),
  generate(rng) {
    const n = rng.int(2, 12);
    const theta = rng.int(1, 20);
    const answer = Q.of(theta * (n - 1), n + 1);
    const gap = Q.of(theta, n + 1);
    const top = Q.of(theta * n, n + 1);
    return numberProblem({
      prompt: t(
        `A sample of ${n} independent values is taken from the uniform distribution on $[0, ${theta}]$. Find the expected value of the largest minus the smallest.`,
        `从 $[0, ${theta}]$ 上的均匀分布中独立抽取 ${n} 个值。求最大值减最小值的期望。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          top,
          "This is the mean of the largest value alone; the mean of the smallest must be subtracted.",
          "这只是最大值的均值；还要减去最小值的均值。",
        ),
        why(gap, "This is the mean of the smallest value, the length of a single gap.", "这是最小值的均值，即一段的长度。"),
        why(
          Q.of(theta * (n - 1), n),
          `This divides by $n = ${n}$; the ${n} points make $n + 1 = ${n + 1}$ gaps.`,
          `这除以了 $n = ${n}$；${n} 个点形成 $n + 1 = ${n + 1}$ 段。`,
        ),
        why(
          Q.of(theta),
          "This is the full length of the interval; the sample almost never reaches both ends.",
          "这是整个区间的长度；样本几乎不可能同时到达两端。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the gap length", "求每段长度"],
            t(
              `${n} points make ${n + 1} gaps of expected length $\\frac{${theta}}{${n + 1}}$.`,
              `${n} 个点形成 ${n + 1} 段，每段期望长度为 $\\frac{${theta}}{${n + 1}}$。`,
            ),
          ],
          [
            ["Find the two means", "求两个均值"],
            t(
              `The largest has mean $${top.toLatex()}$, and the smallest has mean $${gap.toLatex()}$.`,
              `最大值的均值是 $${top.toLatex()}$，最小值的均值是 $${gap.toLatex()}$。`,
            ),
          ],
          [
            ["Subtract", "相减"],
            t(
              `By linearity of expectation, $${top.toLatex()} - ${gap.toLatex()} = ${answer.toLatex()}$.`,
              `由期望的线性性，$${top.toLatex()} - ${gap.toLatex()} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `The two end gaps add $2 \\cdot ${gap.toLatex()} = ${gap.mul(Q.of(2)).toLatex()}$, and $${answer.toLatex()} + ${gap.mul(Q.of(2)).toLatex()} = ${theta}$ is the full length.`,
          `两端的两段共 $2 \\cdot ${gap.toLatex()} = ${gap.mul(Q.of(2)).toLatex()}$，而 $${answer.toLatex()} + ${gap.mul(Q.of(2)).toLatex()} = ${theta}$ 正是全长。`,
        ),
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
