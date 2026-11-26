import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { choiceProblem, lowestTerms, numberProblem, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** Mistake is a value a typical mistake produces, with what to say about it. */
type Mistake = ReturnType<typeof why>;

/** asQ reads a value as an exact number. */
const asQ = (v: Mistake["value"]) => (v instanceof Q ? v : Q.of(v));

/** distinct keeps the mistakes that differ from the answer, each value once. */
const distinct = (answer: Mistake["value"], ms: readonly Mistake[]): Mistake[] =>
  ms.filter((m, i) => !asQ(m.value).eq(asQ(answer)) && ms.findIndex((o) => asQ(o.value).eq(asQ(m.value))) === i);

/** Topics for Unit 2: Expectation (new topics). */
export const probabilityAndStatisticsExpectationTopics: TopicDef[] = [
  // 2.5.6 Moments of Continuous Random Variables
  {
    id: "moments-of-continuous-random-variables",
    title: t("Moments of Continuous Random Variables", "连续型随机变量的原点矩与中心矩"),
    summary: t(
      "The $n$-th raw moment of a continuous random variable $X$ is $E[X^n] = \\int_{-\\infty}^{\\infty} x^n f(x)\\,dx$. The $n$-th central moment is $E[(X - \\mu)^n]$.",
      "连续型随机变量 $X$ 的 $n$ 阶原点矩为 $E[X^n] = \\int_{-\\infty}^{\\infty} x^n f(x)\\,dx$。$n$ 阶中心矩为 $E[(X - \\mu)^n]$。",
    ),
    intro: t(
      "A random variable has density $f(x) = \\frac{2x}{3600}$ on $[0, 60]$. Its second moment averages $x^2$ against the density: $E[X^2] = \\int_0^{60} x^2 \\cdot \\frac{2x}{3600}\\,dx = \\frac{2}{3600} \\cdot \\frac{60^4}{4} = 1800$.\n\nCheck: $X$ is never above $60$, so $E[X^2]$ must be at most $60^2 = 3600$, and $1800$ is.\n\nIn this lesson we compute raw moments by integration, use symmetry for central moments, and find the moments of power densities.",
      "某随机变量在 $[0, 60]$ 上的密度为 $f(x) = \\frac{2x}{3600}$。它的二阶矩是 $x^2$ 关于密度的平均：$E[X^2] = \\int_0^{60} x^2 \\cdot \\frac{2x}{3600}\\,dx = \\frac{2}{3600} \\cdot \\frac{60^4}{4} = 1800$。\n\n检验：$X$ 从不超过 $60$，所以 $E[X^2]$ 至多为 $60^2 = 3600$，而 $1800$ 正是如此。\n\n本课我们用积分计算原点矩，用对称性求中心矩，并求幂型密度的矩。",
    ),
    prerequisites: ["probability-density-functions-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "raw-moments-of-continuous-random-variables",
        title: t("Calculating the n-th raw moment", "计算连续型随机变量的 n 阶原点矩"),
        explanation: t(
          "For a continuous variable, a moment is the integral of the power of the variable times the density over the support. For $f(x) = \\frac{(k+1)x^k}{b^{k+1}}$ on $[0, b]$, the $n$-th moment is $E[X^n] = \\int_0^b x^n \\frac{(k+1)x^k}{b^{k+1}} \\, dx = \\frac{(k+1)b^n}{k+n+1}$. For $f(x) = \\frac{2x}{3600}$ on $[0, 60]$, $E[X^2] = \\frac{2 \\cdot 3600}{4} = 1800$.\n\n> **Watch out.** The power of $x$ in the integrand is one more than $n$, because the density brings its own $x$: integrate $x^{n+1}$, which divides by $n + 2$. And keep the constant $2$ of the density.",
          "对于连续变量，矩是变量的幂乘以密度在支撑集上的积分。对于在 $[0, b]$ 上密度为 $f(x) = \\frac{(k+1)x^k}{b^{k+1}}$ 的分布，其 $n$ 阶原点矩为 $E[X^n] = \\int_0^b x^n \\frac{(k+1)x^k}{b^{k+1}} \\, dx = \\frac{(k+1)b^n}{k+n+1}$。对于 $[0, 60]$ 上的 $f(x) = \\frac{2x}{3600}$，$E[X^2] = \\frac{2 \\cdot 3600}{4} = 1800$。\n\n> **注意。** 被积函数中 $x$ 的次数比 $n$ 多一，因为密度本身带一个 $x$：要积分 $x^{n+1}$，结果除以 $n + 2$。还要保留密度中的常数 $2$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(2, 35);
          const n = rng.pick([1, 2, 3]);
          const power = (base: string) => (n === 1 ? base : `${base}^{${n}}`);
          // f(x) = 2x / b^2 on [0, b], so k = 1.
          // E[X^n] = 2 b^n / (n + 2)
          let bPow = 1;
          for (let i = 0; i < n; i++) bPow *= b;
          const num = 2 * bPow;
          const den = n + 2;
          const answer = Q.of(num, den);

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ has PDF $f(x) = \\frac{2x}{${b * b}}$ for $0 \\le x \\le ${b}$, and $0$ otherwise. Find the $n = ${n}$ raw moment $E[${power("X")}]$.`,
              `设连续型随机变量 $X$ 的概率密度函数为 $f(x) = \\frac{2x}{${b * b}}$（$0 \\le x \\le ${b}$），其他位置为 $0$。求 $n = ${n}$ 阶原点矩 $E[${power("X")}]$。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(Q.of(bPow, den), "That drops the constant $2$ of the density.", "那是丢掉了密度中的常数 $2$。"),
              why(
                Q.of(2 * bPow, n + 1),
                `That integrates $${power("x")}$ alone; the density brings another $x$, so the integrand is $x^{${n + 1}}$.`,
                `那是只积分了 $${power("x")}$；密度还带一个 $x$，所以被积函数是 $x^{${n + 1}}$。`,
              ),
              why(
                Q.of(bPow, n + 1),
                "That is the moment of a uniform variable on the same interval; this density rises.",
                "那是同一区间上均匀变量的矩；这个密度是上升的。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Set up the integral", "列出积分"],
                  t(
                    `$E[${power("X")}] = \\int_0^{${b}} ${power("x")} \\cdot \\frac{2x}{${b * b}}\\,dx = \\frac{2}{${b * b}} \\int_0^{${b}} x^{${n + 1}}\\,dx$.`,
                    `$E[${power("X")}] = \\int_0^{${b}} ${power("x")} \\cdot \\frac{2x}{${b * b}}\\,dx = \\frac{2}{${b * b}} \\int_0^{${b}} x^{${n + 1}}\\,dx$。`,
                  ),
                ],
                [
                  ["Integrate", "积分"],
                  t(
                    `$\\frac{2}{${b * b}} \\cdot \\frac{${b}^{${n + 2}}}{${n + 2}} = \\frac{2 \\cdot ${power(String(b))}}{${n + 2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
                    `$\\frac{2}{${b * b}} \\cdot \\frac{${b}^{${n + 2}}}{${n + 2}} = \\frac{2 \\cdot ${power(String(b))}}{${n + 2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
                  ),
                ],
              ],
              t(
                `$X$ is never above $${b}$, so $E[${power("X")}]$ is at most $${power(String(b))} = ${bPow}$, and $\\frac{${num}}{${den}}$ is.`,
                `$X$ 从不超过 $${b}$，所以 $E[${power("X")}]$ 至多为 $${power(String(b))} = ${bPow}$，而 $\\frac{${num}}{${den}}$ 正是如此。`,
              ),
            ),
          });
        },
      },
      {
        id: "central-moments-of-continuous-random-variables",
        title: t("Central moments of symmetric distributions", "对称分布的中心矩"),
        explanation: t(
          "For a continuous distribution symmetric about $\\mu$, every odd central moment is zero: $E[(X - \\mu)^{2k+1}] = 0$. The second central moment is the variance. For $X$ uniform on $[0, 60]$, $E[(X - 30)^3] = 0$ and $E[(X - 30)^2] = \\frac{3600}{12} = 300$.\n\n> **Watch out.** Central moments are taken about the mean, not about $0$: $E[X^2] = \\frac{b^2}{3}$ is the raw moment, and the variance subtracts $\\mu^2 = \\frac{b^2}{4}$ from it. An odd central moment of a symmetric distribution is $0$, not the mean.",
          "对于关于 $\\mu$ 对称的连续型分布，所有奇数阶中心矩均为零：$E[(X - \\mu)^{2k+1}] = 0$。二阶中心矩即为方差。若 $X$ 在 $[0, 60]$ 上均匀分布，则 $E[(X - 30)^3] = 0$，$E[(X - 30)^2] = \\frac{3600}{12} = 300$。\n\n> **注意。** 中心矩是关于均值的矩，不是关于 $0$ 的：$E[X^2] = \\frac{b^2}{3}$ 是原点矩，方差还要从中减去 $\\mu^2 = \\frac{b^2}{4}$。对称分布的奇数阶中心矩是 $0$，不是均值。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(2, 40);
          const isOdd = rng.bool();
          const power = isOdd ? rng.pick([3, 5, 7]) : 2;
          const mu = Q.of(b, 2).toLatex();

          if (isOdd) {
            return numberProblem({
              prompt: t(
                `A continuous random variable $X$ is uniformly distributed on $[0, ${b}]$, so its mean is $\\mu = ${b}/2$. Find the central moment $E[(X - \\mu)^{${power}}]$.`,
                `设连续型随机变量 $X$ 服从区间 $[0, ${b}]$ 上的均匀分布，其均值为 $\\mu = ${b}/2$。求其中心矩 $E[(X - \\mu)^{${power}}]$。`,
              ),
              answer: 0,
              mistakes: distinct(0, [
                why(Q.of(b, 2), "That is the mean itself, not a moment about the mean.", "那是均值本身，不是关于均值的矩。"),
                why(
                  1,
                  "That is the total probability; the deviations above and below the mean cancel.",
                  "那是总概率；均值上下两侧的偏差相互抵消。",
                ),
                why(
                  Q.of(b * b, 12),
                  "That is the variance, the second central moment; an odd power cancels by symmetry.",
                  "那是方差，即二阶中心矩；奇数次幂由于对称而抵消。",
                ),
              ]),
              solution: walked(
                [
                  [
                    ["Center the variable", "把变量中心化"],
                    t(
                      `$U = X - ${mu}$ is uniform on $\\left[-${mu}, ${mu}\\right]$, whose density is the same at $u$ and at $-u$.`,
                      `$U = X - ${mu}$ 在 $\\left[-${mu}, ${mu}\\right]$ 上均匀分布，它的密度在 $u$ 和 $-u$ 处相同。`,
                    ),
                  ],
                  [
                    ["Use symmetry", "利用对称性"],
                    t(
                      `$u^{${power}}$ is an odd function, so its values at $u$ and $-u$ cancel and $E[(X - \\mu)^{${power}}] = 0$.`,
                      `$u^{${power}}$ 是奇函数，它在 $u$ 和 $-u$ 处的值相互抵消，所以 $E[(X - \\mu)^{${power}}] = 0$。`,
                    ),
                  ],
                ],
                t(
                  `With $h = ${mu}$, $\\frac{1}{${b}} \\int_{-h}^{h} u^{${power}}\\,du = \\frac{1}{${b}} \\cdot \\frac{h^{${power + 1}} - (-h)^{${power + 1}}}{${power + 1}} = 0$, since $${power + 1}$ is even.`,
                  `取 $h = ${mu}$，$\\frac{1}{${b}} \\int_{-h}^{h} u^{${power}}\\,du = \\frac{1}{${b}} \\cdot \\frac{h^{${power + 1}} - (-h)^{${power + 1}}}{${power + 1}} = 0$，因为 $${power + 1}$ 是偶数。`,
                ),
              ),
            });
          }

          const answer = Q.of(b * b, 12);
          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ is uniformly distributed on $[0, ${b}]$. Find its second central moment $E[(X - \\mu)^2]$ (the variance).`,
              `设连续型随机变量 $X$ 服从区间 $[0, ${b}]$ 上的均匀分布。求其二阶中心矩 $E[(X - \\mu)^2]$（即方差）。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                Q.of(b * b, 3),
                "That is the raw moment $E[X^2]$, taken about $0$ instead of the mean.",
                "那是原点矩 $E[X^2]$，是关于 $0$ 而不是关于均值的。",
              ),
              why(Q.of(b * b, 4), "That is $\\mu^2$, the square of the mean.", "那是 $\\mu^2$，即均值的平方。"),
              why(Q.of(b, 12), "That forgets to square $b$.", "那是忘了把 $b$ 平方。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the first two moments", "求前两阶矩"],
                  t(
                    `$\\mu = ${mu}$ and $E[X^2] = \\frac{1}{${b}} \\int_0^{${b}} x^2\\,dx = \\frac{${b * b}}{3}${lowestTerms(b * b, 3)}$.`,
                    `$\\mu = ${mu}$，$E[X^2] = \\frac{1}{${b}} \\int_0^{${b}} x^2\\,dx = \\frac{${b * b}}{3}${lowestTerms(b * b, 3)}$。`,
                  ),
                ],
                [
                  ["Subtract the square of the mean", "减去均值的平方"],
                  t(
                    `$E[(X - \\mu)^2] = \\frac{${b * b}}{3} - \\frac{${b * b}}{4} = \\frac{${b * b}}{12}${lowestTerms(b * b, 12)}$.`,
                    `$E[(X - \\mu)^2] = \\frac{${b * b}}{3} - \\frac{${b * b}}{4} = \\frac{${b * b}}{12}${lowestTerms(b * b, 12)}$。`,
                  ),
                ],
              ],
              t(
                `Directly, with $h = ${mu}$: $\\frac{1}{${b}} \\int_{-h}^{h} u^2\\,du = \\frac{2h^3}{3 \\cdot ${b}} = \\frac{${b * b}}{12}$.`,
                `直接计算，取 $h = ${mu}$：$\\frac{1}{${b}} \\int_{-h}^{h} u^2\\,du = \\frac{2h^3}{3 \\cdot ${b}} = \\frac{${b * b}}{12}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 2.5.7 Expected Values of Continuous Random Variables
  {
    id: "expected-values-of-continuous-random-variables",
    title: t("Expected Values of Continuous Random Variables", "连续型随机变量的期望值"),
    summary: t(
      "The expected value (mean) of a continuous random variable $X$ with density $f(x)$ is the improper integral $E[X] = \\int_{-\\infty}^{\\infty} x f(x)\\,dx$.",
      "具有概率密度 $f(x)$ 的连续型随机变量 $X$ 的期望（均值）定义为反常积分 $E[X] = \\int_{-\\infty}^{\\infty} x f(x)\\,dx$。",
    ),
    intro: t(
      "A random variable has density $f(x) = \\frac{2x}{3600}$ on $[0, 60]$. Its mean weights each value by the density: $E[X] = \\int_0^{60} x \\cdot \\frac{2x}{3600}\\,dx = \\frac{2}{3600} \\cdot \\frac{60^3}{3} = 40$.\n\nCheck: the density rises, so more probability sits near $60$, and the mean $40$ lies to the right of the midpoint $30$.\n\nIn this lesson we find expected values of polynomial, triangular and exponential densities, and from the probability of the tail.",
      "某随机变量在 $[0, 60]$ 上的密度为 $f(x) = \\frac{2x}{3600}$。它的均值用密度给每个值加权：$E[X] = \\int_0^{60} x \\cdot \\frac{2x}{3600}\\,dx = \\frac{2}{3600} \\cdot \\frac{60^3}{3} = 40$。\n\n检验：密度是上升的，更多概率集中在 $60$ 附近，所以均值 $40$ 在中点 $30$ 的右边。\n\n本课我们求多项式、三角形和指数密度的期望值，以及由右尾概率求期望值。",
    ),
    prerequisites: ["moments-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "expected-value-of-polynomial-pdf",
        title: t("Evaluating the expectation of a polynomial density", "求解多项式型密度的期望值"),
        explanation: t(
          "The mean is the balance point of the density, found by integrating the variable times the density over the interval. For $f(x) = \\frac{(k+1)x^k}{b^{k+1}}$ on $[0, b]$, $E[X] = \\frac{(k+1)b}{k+2}$. For $f(x) = \\frac{2x}{b^2}$, $E[X] = \\frac{2b}{3}$; on $[0, 60]$ that is $40$.\n\n> **Watch out.** The mean is not the midpoint $\\frac{b}{2}$ unless the density is flat; a rising density moves it to the right. Integrate $x \\cdot f(x)$, not $f(x)$ alone.",
          "均值是密度的平衡点，通过把变量乘以密度在区间上积分得到。对于在 $[0, b]$ 上密度为 $f(x) = \\frac{(k+1)x^k}{b^{k+1}}$ 的随机变量，$E[X] = \\frac{(k+1)b}{k+2}$。对 $f(x) = \\frac{2x}{b^2}$，$E[X] = \\frac{2b}{3}$；在 $[0, 60]$ 上就是 $40$。\n\n> **注意。** 除非密度是平的，均值不是中点 $\\frac{b}{2}$；上升的密度使它右移。要积分 $x \\cdot f(x)$，而不是只积分 $f(x)$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(3, 45);
          const answer = Q.of(2 * b, 3);

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ has PDF $f(x) = \\frac{2x}{${b * b}}$ for $0 \\le x \\le ${b}$, and $0$ otherwise. Find the expected value $E[X]$.`,
              `设连续型随机变量 $X$ 的概率密度函数为 $f(x) = \\frac{2x}{${b * b}}$（$0 \\le x \\le ${b}$），其他位置为 $0$。求其期望值 $E[X]$。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                Q.of(b, 2),
                "That is the midpoint, the mean of a flat density; this density rises.",
                "那是中点，是平坦密度的均值；这个密度是上升的。",
              ),
              why(
                Q.of(b, 3),
                "That is the mean of the falling density $\\frac{2(b - x)}{b^2}$, the mirror image of this one.",
                "那是下降密度 $\\frac{2(b - x)}{b^2}$ 的均值，它是这个密度的镜像。",
              ),
              why(Q.of(b * b, 2), "That is $E[X^2]$, the second moment.", "那是二阶矩 $E[X^2]$。"),
            ]),
            solution: walked(
              [
                [
                  ["Set up the integral", "列出积分"],
                  t(
                    `$E[X] = \\int_0^{${b}} x \\cdot \\frac{2x}{${b * b}}\\,dx = \\frac{2}{${b * b}} \\int_0^{${b}} x^2\\,dx$.`,
                    `$E[X] = \\int_0^{${b}} x \\cdot \\frac{2x}{${b * b}}\\,dx = \\frac{2}{${b * b}} \\int_0^{${b}} x^2\\,dx$。`,
                  ),
                ],
                [
                  ["Integrate", "积分"],
                  t(
                    `$\\frac{2}{${b * b}} \\cdot \\frac{${b}^3}{3} = \\frac{2 \\cdot ${b}}{3} = \\frac{${2 * b}}{3}${lowestTerms(2 * b, 3)}$.`,
                    `$\\frac{2}{${b * b}} \\cdot \\frac{${b}^3}{3} = \\frac{2 \\cdot ${b}}{3} = \\frac{${2 * b}}{3}${lowestTerms(2 * b, 3)}$。`,
                  ),
                ],
              ],
              t(
                `The density rises, so the mean lies to the right of the midpoint $\\frac{${b}}{2}$: indeed $\\frac{${2 * b}}{3} > \\frac{${b}}{2}$, and it is below $${b}$.`,
                `密度是上升的，所以均值在中点 $\\frac{${b}}{2}$ 的右边：确实 $\\frac{${2 * b}}{3} > \\frac{${b}}{2}$，并且小于 $${b}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "expected-value-of-exponential-pdf",
        title: t("Expected value of an exponential distribution", "指数分布的期望值"),
        explanation: t(
          "For an exponential distribution, integration by parts shows that the mean waiting time is the reciprocal of the rate. For an exponential distribution with rate $\\lambda$ (density $f(x) = \\lambda e^{-\\lambda x}$ for $x \\ge 0$), the expected value is $E[X] = \\frac{1}{\\lambda}$. With $\\lambda = 50$ the mean is $\\frac{1}{50}$.\n\n> **Watch out.** The mean is the reciprocal of the rate, not the rate itself: a high rate means short waits. And $\\frac{1}{\\lambda^2}$ is the variance, not the mean.",
          "对于指数分布，用分部积分可以证明平均等待时间是速率的倒数。对于速率参数为 $\\lambda$ 的指数分布（在 $x \\ge 0$ 上密度为 $f(x) = \\lambda e^{-\\lambda x}$），期望值为 $E[X] = \\frac{1}{\\lambda}$。当 $\\lambda = 50$ 时，均值为 $\\frac{1}{50}$。\n\n> **注意。** 均值是速率的倒数，不是速率本身：速率高意味着等待时间短。而 $\\frac{1}{\\lambda^2}$ 是方差，不是均值。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(2, 40);
          const answer = Q.of(1, lambda);

          return numberProblem({
            prompt: t(
              `The lifetime of an electronic component is exponentially distributed with rate parameter $\\lambda = ${lambda}$ (PDF $f(x) = ${lambda} e^{-${lambda} x}$ for $x \\ge 0$). Find the expected lifetime $E[X]$.`,
              `某电子元件的寿命服从速率参数为 $\\lambda = ${lambda}$ 的指数分布（$x \\ge 0$ 时 $f(x) = ${lambda} e^{-${lambda} x}$）。求其期望寿命 $E[X]$。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(lambda, "That is the rate; the mean waiting time is its reciprocal.", "那是速率；平均等待时间是它的倒数。"),
              why(Q.of(1, lambda * lambda), "That is the variance $\\frac{1}{\\lambda^2}$.", "那是方差 $\\frac{1}{\\lambda^2}$。"),
              why(
                Q.of(2, lambda),
                "That is the mean of two such lifetimes in a row; one has mean $\\frac{1}{\\lambda}$.",
                "那是两个这样的寿命相接的均值；一个寿命的均值是 $\\frac{1}{\\lambda}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Integrate by parts", "分部积分"],
                  t(
                    `With $u = x$ and $dv = ${lambda} e^{-${lambda} x}\\,dx$: $E[X] = \\left[-x e^{-${lambda} x}\\right]_0^\\infty + \\int_0^\\infty e^{-${lambda} x}\\,dx$.`,
                    `取 $u = x$，$dv = ${lambda} e^{-${lambda} x}\\,dx$：$E[X] = \\left[-x e^{-${lambda} x}\\right]_0^\\infty + \\int_0^\\infty e^{-${lambda} x}\\,dx$。`,
                  ),
                ],
                [
                  ["Evaluate", "求值"],
                  t(
                    `The bracket is $0$ at both ends, and $\\int_0^\\infty e^{-${lambda} x}\\,dx = \\frac{1}{${lambda}}$, so $E[X] = \\frac{1}{${lambda}}$.`,
                    `方括号在两端都是 $0$，而 $\\int_0^\\infty e^{-${lambda} x}\\,dx = \\frac{1}{${lambda}}$，所以 $E[X] = \\frac{1}{${lambda}}$。`,
                  ),
                ],
              ],
              t(
                `At a rate of $${lambda}$ failures per unit of time, one failure takes $\\frac{1}{${lambda}}$ of a unit on average: $${lambda} \\cdot \\frac{1}{${lambda}} = 1$.`,
                `以每单位时间 $${lambda}$ 次故障的速率，一次故障平均需要 $\\frac{1}{${lambda}}$ 个单位时间：$${lambda} \\cdot \\frac{1}{${lambda}} = 1$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 2.5.8 Variance of Continuous Random Variables
  {
    id: "variance-of-continuous-random-variables",
    title: t("Variance of Continuous Random Variables", "连续型随机变量的方差"),
    summary: t(
      "The variance of a continuous random variable $X$ is $\\operatorname{Var}(X) = E[(X - \\mu)^2] = E[X^2] - (E[X])^2$; it measures the spread of $X$ about its mean.",
      "连续型随机变量 $X$ 的方差为 $\\operatorname{Var}(X) = E[(X - \\mu)^2] = E[X^2] - (E[X])^2$，度量 $X$ 围绕均值的离散程度。",
    ),
    intro: t(
      "A random variable has density $f(x) = \\frac{2x}{3600}$ on $[0, 60]$, with $E[X] = 40$ and $E[X^2] = 1800$. Its variance is $1800 - 40^2 = 1800 - 1600 = 200$.\n\nCheck: a uniform variable on $[0, 60]$ has variance $\\frac{3600}{12} = 300$; this density bunches its probability near $60$, so its spread is smaller, and $200 < 300$.\n\nIn this lesson we compute variances from the first two moments, for polynomial, triangular and exponential densities.",
      "某随机变量在 $[0, 60]$ 上的密度为 $f(x) = \\frac{2x}{3600}$，$E[X] = 40$，$E[X^2] = 1800$。它的方差为 $1800 - 40^2 = 1800 - 1600 = 200$。\n\n检验：$[0, 60]$ 上的均匀变量方差为 $\\frac{3600}{12} = 300$；这个密度把概率集中在 $60$ 附近，离散程度更小，而 $200 < 300$。\n\n本课我们由前两阶矩计算多项式、三角形和指数密度的方差。",
    ),
    prerequisites: ["expected-values-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "variance-calculation-via-moments",
        title: t("Computing variance using the shortcut formula", "利用矩的简化公式计算方差"),
        explanation: t(
          "Compute the first and second moments by integration, then subtract the square of the first from the second to get the variance. $\\operatorname{Var}(X) = E[X^2] - (E[X])^2$. For $f(x) = \\frac{2x}{b^2}$ on $[0, b]$, $E[X] = \\frac{2b}{3}$ and $E[X^2] = \\frac{b^2}{2}$, so $\\operatorname{Var}(X) = \\frac{b^2}{2} - \\frac{4b^2}{9} = \\frac{b^2}{18}$. On $[0, 60]$ that is $1800 - 1600 = 200$.\n\n> **Watch out.** $E[X^2]$ alone is not the variance: subtract the square of the mean. And this density is not uniform, so its variance is not $\\frac{b^2}{12}$.",
          "先用积分求出一阶矩和二阶矩，再用二阶矩减去一阶矩的平方得到方差。$\\operatorname{Var}(X) = E[X^2] - (E[X])^2$。对 $[0, b]$ 上的 $f(x) = \\frac{2x}{b^2}$，$E[X] = \\frac{2b}{3}$，$E[X^2] = \\frac{b^2}{2}$，故 $\\operatorname{Var}(X) = \\frac{b^2}{2} - \\frac{4b^2}{9} = \\frac{b^2}{18}$。在 $[0, 60]$ 上就是 $1800 - 1600 = 200$。\n\n> **注意。** 单是 $E[X^2]$ 并不是方差：还要减去均值的平方。而且这个密度不是均匀的，所以方差不是 $\\frac{b^2}{12}$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(3, 35);
          const varNum = b * b;
          const answer = Q.of(varNum, 18);

          return numberProblem({
            prompt: t(
              `Let $X$ have PDF $f(x) = \\frac{2x}{${b * b}}$ for $0 \\le x \\le ${b}$, and $0$ elsewhere. Calculate the variance $\\text{Var}(X)$.`,
              `设 $X$ 的概率密度函数为 $f(x) = \\frac{2x}{${b * b}}$（$0 \\le x \\le ${b}$），其他位置为 $0$。计算方差 $\\text{Var}(X)$。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(Q.of(b * b, 2), "That is $E[X^2]$; the square of the mean must be subtracted.", "那是 $E[X^2]$；还要减去均值的平方。"),
              why(
                Q.of(b * b, 12),
                "That is the variance of a uniform variable on the same interval; this density rises.",
                "那是同一区间上均匀变量的方差；这个密度是上升的。",
              ),
              why(
                Q.of(4 * b * b, 9),
                "That is $(E[X])^2$, which is subtracted from $E[X^2]$, not the variance itself.",
                "那是 $(E[X])^2$，它要从 $E[X^2]$ 中减去，而不是方差本身。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the two moments", "求两个矩"],
                  t(
                    `$E[X] = \\int_0^{${b}} \\frac{2x^2}{${b * b}}\\,dx = \\frac{${2 * b}}{3}$ and $E[X^2] = \\int_0^{${b}} \\frac{2x^3}{${b * b}}\\,dx = \\frac{${b * b}}{2}$.`,
                    `$E[X] = \\int_0^{${b}} \\frac{2x^2}{${b * b}}\\,dx = \\frac{${2 * b}}{3}$，$E[X^2] = \\int_0^{${b}} \\frac{2x^3}{${b * b}}\\,dx = \\frac{${b * b}}{2}$。`,
                  ),
                ],
                [
                  ["Subtract the square of the mean", "减去均值的平方"],
                  t(
                    `$\\text{Var}(X) = \\frac{${b * b}}{2} - \\frac{${4 * b * b}}{9} = \\frac{${9 * b * b} - ${8 * b * b}}{18} = \\frac{${varNum}}{18}${lowestTerms(varNum, 18)}$.`,
                    `$\\text{Var}(X) = \\frac{${b * b}}{2} - \\frac{${4 * b * b}}{9} = \\frac{${9 * b * b} - ${8 * b * b}}{18} = \\frac{${varNum}}{18}${lowestTerms(varNum, 18)}$。`,
                  ),
                ],
              ],
              t(
                `The probability bunches near $${b}$, so the spread is less than that of a uniform variable: $\\frac{${b * b}}{18} < \\frac{${b * b}}{12}$.`,
                `概率集中在 $${b}$ 附近，所以离散程度小于均匀变量：$\\frac{${b * b}}{18} < \\frac{${b * b}}{12}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "variance-of-exponential-random-variables",
        title: t("Variance of an exponential distribution", "指数分布的方差"),
        explanation: t(
          "Subtracting the square of the mean from the second moment shows that the variance of an exponential is the square of its mean. For an exponential distribution with rate $\\lambda$, $E[X] = \\frac{1}{\\lambda}$ and $E[X^2] = \\frac{2}{\\lambda^2}$. Hence $\\operatorname{Var}(X) = \\frac{2}{\\lambda^2} - \\left(\\frac{1}{\\lambda}\\right)^2 = \\frac{1}{\\lambda^2}$. With $\\lambda = 50$ the variance is $\\frac{1}{2500}$.\n\n> **Watch out.** $\\frac{2}{\\lambda^2}$ is the second moment; subtract $\\frac{1}{\\lambda^2}$ from it. And the variance is the square of the mean $\\frac{1}{\\lambda}$, not the mean itself.",
          "用二阶矩减去均值的平方，可以看出指数分布的方差等于其均值的平方。对于速率参数为 $\\lambda$ 的指数分布，$E[X] = \\frac{1}{\\lambda}$ 且 $E[X^2] = \\frac{2}{\\lambda^2}$。因此 $\\operatorname{Var}(X) = \\frac{2}{\\lambda^2} - \\left(\\frac{1}{\\lambda}\\right)^2 = \\frac{1}{\\lambda^2}$。当 $\\lambda = 50$ 时，方差为 $\\frac{1}{2500}$。\n\n> **注意。** $\\frac{2}{\\lambda^2}$ 是二阶矩；要从中减去 $\\frac{1}{\\lambda^2}$。而且方差是均值 $\\frac{1}{\\lambda}$ 的平方，不是均值本身。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(2, 30);
          const answer = Q.of(1, lambda * lambda);

          return numberProblem({
            prompt: t(
              `A random variable $X$ has exponential distribution with parameter $\\lambda = ${lambda}$ ($f(x) = ${lambda} e^{-${lambda} x}$ for $x \\ge 0$). Find $\\text{Var}(X)$.`,
              `随机变量 $X$ 服从参数为 $\\lambda = ${lambda}$ 的指数分布（$x \\ge 0$ 时 $f(x) = ${lambda} e^{-${lambda} x}$）。求 $\\text{Var}(X)$。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                Q.of(1, lambda),
                "That is the mean $\\frac{1}{\\lambda}$, not the variance.",
                "那是均值 $\\frac{1}{\\lambda}$，不是方差。",
              ),
              why(
                lambda * lambda,
                "That is upside down: the variance is $\\frac{1}{\\lambda^2}$.",
                "那是颠倒了：方差是 $\\frac{1}{\\lambda^2}$。",
              ),
              why(
                Q.of(2, lambda * lambda),
                "That is the second moment $E[X^2]$; the square of the mean must be subtracted.",
                "那是二阶矩 $E[X^2]$；还要减去均值的平方。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Recall the two moments", "写出两个矩"],
                  t(
                    `$E[X] = \\frac{1}{${lambda}}$ and $E[X^2] = \\frac{2}{${lambda}^2} = \\frac{2}{${lambda * lambda}}${lowestTerms(2, lambda * lambda)}$.`,
                    `$E[X] = \\frac{1}{${lambda}}$，$E[X^2] = \\frac{2}{${lambda}^2} = \\frac{2}{${lambda * lambda}}${lowestTerms(2, lambda * lambda)}$。`,
                  ),
                ],
                [
                  ["Subtract", "相减"],
                  t(
                    `$\\text{Var}(X) = \\frac{2}{${lambda * lambda}} - \\frac{1}{${lambda * lambda}} = \\frac{1}{${lambda * lambda}}$.`,
                    `$\\text{Var}(X) = \\frac{2}{${lambda * lambda}} - \\frac{1}{${lambda * lambda}} = \\frac{1}{${lambda * lambda}}$。`,
                  ),
                ],
              ],
              t(
                `The standard deviation is $\\sqrt{\\frac{1}{${lambda * lambda}}} = \\frac{1}{${lambda}}$, the same as the mean, as it is for every exponential variable.`,
                `标准差为 $\\sqrt{\\frac{1}{${lambda * lambda}}} = \\frac{1}{${lambda}}$，与均值相同，每个指数变量都是如此。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 2.5.9 The Rule of the Lazy Statistician
  {
    id: "the-rule-of-the-lazy-statistician",
    title: t("The Rule of the Lazy Statistician", "无意识统计学家法则 (LOTUS)"),
    summary: t(
      "The law of the unconscious statistician (LOTUS) computes $E[g(X)] = \\int_{-\\infty}^{\\infty} g(x) f(x)\\,dx$ directly, without first finding the distribution of $g(X)$.",
      "无意识统计学家法则（LOTUS）直接用 $E[g(X)] = \\int_{-\\infty}^{\\infty} g(x) f(x)\\,dx$ 计算期望，无需先求出 $g(X)$ 的分布。",
    ),
    intro: t(
      "Let $X$ be uniform on $[0, 30]$. The mean of $X^2$ comes straight from the density of $X$, without finding the distribution of $X^2$: $E[X^2] = \\int_0^{30} x^2 \\cdot \\frac{1}{30}\\,dx = \\frac{30^2}{3} = 300$.\n\nCheck: $E[X^2] = \\operatorname{Var}(X) + (E[X])^2 = \\frac{900}{12} + 15^2 = 75 + 225 = 300$.\n\nIn this lesson we compute the expected value of a function of a random variable by integrating the function against the original density.",
      "设 $X$ 在 $[0, 30]$ 上均匀分布。$X^2$ 的均值可以直接由 $X$ 的密度求出，不必求 $X^2$ 的分布：$E[X^2] = \\int_0^{30} x^2 \\cdot \\frac{1}{30}\\,dx = \\frac{30^2}{3} = 300$。\n\n检验：$E[X^2] = \\operatorname{Var}(X) + (E[X])^2 = \\frac{900}{12} + 15^2 = 75 + 225 = 300$。\n\n本课我们把函数与原来的密度一起积分，求随机变量的函数的期望值。",
    ),
    prerequisites: ["expected-values-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "lotus-for-polynomial-functions",
        title: t("Applying LOTUS to powers of uniform variables", "对均匀分布的幂函数应用 LOTUS 法则"),
        explanation: t(
          "The law of the unconscious statistician lets you find the mean of a function by integrating the function against the original density, without finding a new distribution. For $X \\sim \\text{Uniform}(0, b)$ with density $\\frac{1}{b}$, LOTUS gives $E[cX^2] = \\int_0^b c x^2 \\cdot \\frac{1}{b} \\, dx = \\frac{cb^2}{3}$. For $X$ uniform on $[0, 30]$, $E[15X^2] = \\frac{15 \\cdot 900}{3} = 4500$.\n\n> **Watch out.** Only $X$ is squared, not the constant $c$. And $E[X^2]$ is not $(E[X])^2$: integrating $x^2$ gives $\\frac{b^2}{3}$, not $\\frac{b^2}{4}$.",
          "无意识统计学家定律让你把函数与原来的密度一起积分来求函数的均值，而不必求出新的分布。对于在 $[0, b]$ 上密度为 $\\frac{1}{b}$ 的均匀分布 $X$，由 LOTUS 法则可得 $E[cX^2] = \\int_0^b c x^2 \\cdot \\frac{1}{b} \\, dx = \\frac{cb^2}{3}$。若 $X$ 在 $[0, 30]$ 上均匀分布，则 $E[15X^2] = \\frac{15 \\cdot 900}{3} = 4500$。\n\n> **注意。** 只有 $X$ 被平方，常数 $c$ 不平方。而且 $E[X^2]$ 不是 $(E[X])^2$：积分 $x^2$ 得到 $\\frac{b^2}{3}$，而不是 $\\frac{b^2}{4}$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(2, 25);
          const c = rng.int(2, 12);
          const num = c * b * b;
          const answer = Q.of(num, 3);

          return numberProblem({
            prompt: t(
              `Let $X$ be uniformly distributed on $[0, ${b}]$, so $f(x) = \\frac{1}{${b}}$ for $0 \\le x \\le ${b}$. Using LOTUS, evaluate $E[${c} X^2]$.`,
              `设 $X$ 服从区间 $[0, ${b}]$ 上的均匀分布，密度为 $f(x) = \\frac{1}{${b}}$（$0 \\le x \\le ${b}$）。应用 LOTUS 法则，求 $E[${c} X^2]$。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                Q.of(c * b * b, 4),
                `That is $${c}(E[X])^2$; the mean of the square is larger than the square of the mean.`,
                `那是 $${c}(E[X])^2$；平方的均值大于均值的平方。`,
              ),
              why(
                Q.of(c * c * b * b, 3),
                `That squares the constant $${c}$ as well; only $X$ is squared.`,
                `那是把常数 $${c}$ 也平方了；只有 $X$ 被平方。`,
              ),
              why(Q.of(c * b, 2), `That is $E[${c} X]$, without the square.`, `那是 $E[${c} X]$，没有平方。`),
            ]),
            solution: walked(
              [
                [
                  ["Apply LOTUS", "应用 LOTUS 法则"],
                  t(
                    `$E[${c} X^2] = \\int_0^{${b}} ${c} x^2 \\cdot \\frac{1}{${b}}\\,dx = \\frac{${c}}{${b}} \\int_0^{${b}} x^2\\,dx$.`,
                    `$E[${c} X^2] = \\int_0^{${b}} ${c} x^2 \\cdot \\frac{1}{${b}}\\,dx = \\frac{${c}}{${b}} \\int_0^{${b}} x^2\\,dx$。`,
                  ),
                ],
                [
                  ["Integrate", "积分"],
                  t(
                    `$\\frac{${c}}{${b}} \\cdot \\frac{${b}^3}{3} = \\frac{${c} \\cdot ${b * b}}{3} = \\frac{${num}}{3}${lowestTerms(num, 3)}$.`,
                    `$\\frac{${c}}{${b}} \\cdot \\frac{${b}^3}{3} = \\frac{${c} \\cdot ${b * b}}{3} = \\frac{${num}}{3}${lowestTerms(num, 3)}$。`,
                  ),
                ],
              ],
              t(
                `$E[X^2] = \\operatorname{Var}(X) + (E[X])^2 = \\frac{${b * b}}{12} + \\frac{${b * b}}{4} = \\frac{${b * b}}{3}$, and $${c}$ times that is $\\frac{${num}}{3}$.`,
                `$E[X^2] = \\operatorname{Var}(X) + (E[X])^2 = \\frac{${b * b}}{12} + \\frac{${b * b}}{4} = \\frac{${b * b}}{3}$，乘以 $${c}$ 得 $\\frac{${num}}{3}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "lotus-for-inverse-powers",
        title: t("Applying LOTUS on unbounded supports", "在无界支撑集上应用 LOTUS 法则"),
        explanation: t(
          "On an unbounded support the expectation is an improper integral, which exists only when the density decays fast enough to make it converge. For $f(x) = \\frac{2}{x^3}$ ($x \\ge 1$), $E[kX] = \\int_1^\\infty kx \\cdot \\frac{2}{x^3} \\, dx = \\int_1^\\infty \\frac{2k}{x^2} \\, dx = 2k$. For $k = 50$ that is $100$.\n\n> **Watch out.** The mean of $X$ is $2$, not the start $1$ of the support. The antiderivative of $\\frac{1}{x^2}$ is $-\\frac{1}{x}$, and at the upper limit it tends to $0$.",
          "在无界支撑集上，期望是一个反常积分，只有当密度衰减得足够快使它收敛时，期望才存在。对于 $f(x) = \\frac{2}{x^3}$（$x \\ge 1$），$E[kX] = \\int_1^\\infty kx \\cdot \\frac{2}{x^3} \\, dx = \\int_1^\\infty \\frac{2k}{x^2} \\, dx = 2k$。当 $k = 50$ 时它是 $100$。\n\n> **注意。** $X$ 的均值是 $2$，不是支撑集的起点 $1$。$\\frac{1}{x^2}$ 的原函数是 $-\\frac{1}{x}$，在上限处趋于 $0$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 35);
          const answer = 2 * k;

          return numberProblem({
            prompt: t(
              `A random variable $X$ has PDF $f(x) = \\frac{2}{x^3}$ for $x \\ge 1$, and $0$ otherwise. Using LOTUS, compute the expected value $E[${k} X]$.`,
              `随机变量 $X$ 的概率密度函数为 $f(x) = \\frac{2}{x^3}$（$x \\ge 1$），其他位置为 $0$。应用 LOTUS 法则，计算期望值 $E[${k} X]$。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                k,
                "That takes $E[X] = 1$, the start of the support; the mean of $X$ is $2$.",
                "那是取 $E[X] = 1$，即支撑集的起点；$X$ 的均值是 $2$。",
              ),
              why(
                4 * k,
                `That doubles once too often: $\\int_1^\\infty \\frac{${2 * k}}{x^2}\\,dx = ${2 * k}$.`,
                `那是多乘了一次 $2$：$\\int_1^\\infty \\frac{${2 * k}}{x^2}\\,dx = ${2 * k}$。`,
              ),
              why(
                Q.of(2 * k, 3),
                "That uses the wrong antiderivative; the antiderivative of $\\frac{1}{x^2}$ is $-\\frac{1}{x}$.",
                "那是用错了原函数；$\\frac{1}{x^2}$ 的原函数是 $-\\frac{1}{x}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Simplify the integrand", "化简被积函数"],
                  t(
                    `$E[${k} X] = \\int_1^\\infty ${k} x \\cdot \\frac{2}{x^3}\\,dx = \\int_1^\\infty \\frac{${2 * k}}{x^2}\\,dx$.`,
                    `$E[${k} X] = \\int_1^\\infty ${k} x \\cdot \\frac{2}{x^3}\\,dx = \\int_1^\\infty \\frac{${2 * k}}{x^2}\\,dx$。`,
                  ),
                ],
                [
                  ["Integrate", "积分"],
                  t(
                    `$\\left[-\\frac{${2 * k}}{x}\\right]_1^\\infty = 0 + \\frac{${2 * k}}{1} = ${2 * k}$.`,
                    `$\\left[-\\frac{${2 * k}}{x}\\right]_1^\\infty = 0 + \\frac{${2 * k}}{1} = ${2 * k}$。`,
                  ),
                ],
              ],
              t(
                `$E[X] = \\int_1^\\infty \\frac{2}{x^2}\\,dx = 2$, and by linearity $E[${k} X] = ${k} \\cdot 2 = ${2 * k}$.`,
                `$E[X] = \\int_1^\\infty \\frac{2}{x^2}\\,dx = 2$，由线性性 $E[${k} X] = ${k} \\cdot 2 = ${2 * k}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 2.6.1 Moment-Generating Functions
  {
    id: "moment-generating-functions",
    title: t("Moment-Generating Functions", "矩母函数"),
    summary: t(
      "The moment-generating function (MGF) of a random variable $X$ is $M_X(t) = E[e^{tX}]$, provided the expectation exists for $t$ in a neighborhood of $0$.",
      "随机变量 $X$ 的矩母函数（MGF）定义为 $M_X(t) = E[e^{tX}]$，前提是该期望在 $0$ 的某个邻域内存在。",
    ),
    intro: t(
      "A random variable takes the values $0$ and $40$, each with probability $\\frac{1}{2}$. Its moment generating function averages $e^{tX}$ over the two values: $M_X(t) = \\frac{1}{2}e^{0} + \\frac{1}{2}e^{40t} = \\frac{1}{2} + \\frac{1}{2}e^{40t}$.\n\nCheck: at $t = 0$ it gives $\\frac{1}{2} + \\frac{1}{2} = 1$, as every moment generating function must.\n\nIn this lesson we write moment generating functions from their definition, evaluate them at zero, and read moments from them.",
      "某随机变量取值 $0$ 和 $40$，概率各为 $\\frac{1}{2}$。它的矩母函数是 $e^{tX}$ 在两个取值上的平均：$M_X(t) = \\frac{1}{2}e^{0} + \\frac{1}{2}e^{40t} = \\frac{1}{2} + \\frac{1}{2}e^{40t}$。\n\n检验：在 $t = 0$ 处它给出 $\\frac{1}{2} + \\frac{1}{2} = 1$，每个矩母函数都必须如此。\n\n本课我们按定义写出矩母函数，求它在零处的值，并从中读出矩。",
    ),
    prerequisites: ["expected-values-of-continuous-random-variables", "variance-of-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-mgf-at-zero",
        title: t("Evaluating the MGF at t = 0", "计算矩母函数在 t = 0 处的值"),
        explanation: t(
          "At zero the exponential inside the expectation is always one, so every moment generating function equals one there, which is a quick check on any formula. For any random variable $X$ whose MGF exists, $M_X(0) = E[e^0] = E[1] = 1$. For example, $\\left(\\frac{30}{30 - t}\\right)^{25}$ at $t = 0$ is $1^{25} = 1$.\n\n> **Watch out.** $e^0$ is $1$, not $0$. Putting $t = 0$ into a fraction such as $\\frac{a}{a - t}$ gives $\\frac{a}{a} = 1$, whatever the power.",
          "在零处期望中的指数总是 1，所以每个矩母函数在那里都等于 1，这可以快速检验任何公式。对任意矩母函数存在的随机变量 $X$，均有 $M_X(0) = E[e^0] = E[1] = 1$。例如 $\\left(\\frac{30}{30 - t}\\right)^{25}$ 在 $t = 0$ 处为 $1^{25} = 1$。\n\n> **注意。** $e^0$ 是 $1$，不是 $0$。把 $t = 0$ 代入 $\\frac{a}{a - t}$ 这样的分式得到 $\\frac{a}{a} = 1$，无论幂是多少。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(2, 20);
          const b = rng.int(2, 20);

          return numberProblem({
            prompt: t(
              `A random variable $X$ has moment-generating function $M_X(t) = \\left( \\frac{${a}}{${a} - t} \\right)^{${b}}$ for $t < ${a}$. What is the value of $M_X(0)$?`,
              `随机变量 $X$ 的矩母函数为 $M_X(t) = \\left( \\frac{${a}}{${a} - t} \\right)^{${b}}$（$t < ${a}$）。求 $M_X(0)$ 的值。`,
            ),
            answer: 1,
            mistakes: distinct(1, [
              why(0, "That treats $e^0$ as $0$; it is $1$.", "那是把 $e^0$ 当成了 $0$；它是 $1$。"),
              why(
                a,
                `That is the numerator $${a}$; at $t = 0$ the fraction is $\\frac{${a}}{${a}} = 1$.`,
                `那是分子 $${a}$；在 $t = 0$ 处分式为 $\\frac{${a}}{${a}} = 1$。`,
              ),
              why(Q.of(a, b), "That divides by the exponent; a power of $1$ is still $1$.", "那是除以了指数；$1$ 的任何次幂仍是 $1$。"),
            ]),
            solution: walked(
              [
                [
                  ["Substitute t = 0", "代入 $t = 0$"],
                  t(
                    `$M_X(0) = \\left( \\frac{${a}}{${a} - 0} \\right)^{${b}} = \\left( \\frac{${a}}{${a}} \\right)^{${b}}$.`,
                    `$M_X(0) = \\left( \\frac{${a}}{${a} - 0} \\right)^{${b}} = \\left( \\frac{${a}}{${a}} \\right)^{${b}}$。`,
                  ),
                ],
                [["Simplify", "化简"], t(`$1^{${b}} = 1$.`, `$1^{${b}} = 1$。`)],
              ],
              t(
                "For every random variable, $M_X(0) = E[e^{0 \\cdot X}] = E[1] = 1$.",
                "对每个随机变量都有 $M_X(0) = E[e^{0 \\cdot X}] = E[1] = 1$。",
              ),
            ),
          });
        },
      },
      {
        id: "mgf-of-finite-discrete-variable",
        title: t("MGF of a two-point discrete distribution", "两点离散分布的矩母函数"),
        explanation: t(
          "For a variable with finitely many values, the moment generating function is a weighted sum of exponentials, one for each value. For $X$ taking the values $0$ and $k$ with $P(X = 0) = 1 - p$ and $P(X = k) = p$, $M_X(t) = E[e^{tX}] = (1 - p) + pe^{kt}$. For the values $0$ and $40$ with probability $0.5$ each, $M_X(t) = 0.5 + 0.5e^{40t}$.\n\n> **Watch out.** Each probability stays with its own value: $e^{kt}$ is weighted by $P(X = k)$. The value $0$ gives $e^{0} = 1$, not a negative exponent.",
          "对于只取有限个值的变量，矩母函数是指数函数的加权和，每个取值对应一项。若 $X$ 取值 $0$ 与 $k$，概率分别为 $1 - p$ 与 $p$，则 $M_X(t) = E[e^{tX}] = (1 - p) + pe^{kt}$。若取值 $0$ 和 $40$ 的概率各为 $0.5$，则 $M_X(t) = 0.5 + 0.5e^{40t}$。\n\n> **注意。** 每个概率跟着它自己的取值：$e^{kt}$ 的权重是 $P(X = k)$。取值 $0$ 给出 $e^{0} = 1$，而不是负的指数。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 30);
          const pNum = rng.pick([1, 2, 3, 4, 6, 7, 8, 9]);
          const qNum = 10 - pNum;
          const pFrac = `0.${pNum}`;
          const qFrac = `0.${qNum}`;

          const opts = [
            t(`$${qFrac} + ${pFrac} e^{${k}t}$`, `$${qFrac} + ${pFrac} e^{${k}t}$`),
            t(`$${pFrac} + ${qFrac} e^{${k}t}$`, `$${pFrac} + ${qFrac} e^{${k}t}$`),
            t(`$(${qFrac} + ${pFrac} e^t)^{${k}}$`, `$(${qFrac} + ${pFrac} e^t)^{${k}}$`),
            t(`$${qFrac} e^{-${k}t} + ${pFrac}$`, `$${qFrac} e^{-${k}t} + ${pFrac}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return reasoned(
            choiceProblem({
              prompt: t(
                `A discrete random variable $X$ takes value $0$ with probability $${qFrac}$ and value $${k}$ with probability $${pFrac}$. What is the moment-generating function $M_X(t)$?`,
                `离散型随机变量 $X$ 取值 $0$ 的概率为 $${qFrac}$，取值 $${k}$ 的概率为 $${pFrac}$。其矩母函数 $M_X(t)$ 是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Write the definition", "写出定义"],
                    t(
                      `$M_X(t) = E[e^{tX}] = P(X = 0) e^{0 \\cdot t} + P(X = ${k}) e^{${k}t}$.`,
                      `$M_X(t) = E[e^{tX}] = P(X = 0) e^{0 \\cdot t} + P(X = ${k}) e^{${k}t}$。`,
                    ),
                  ],
                  [
                    ["Substitute the probabilities", "代入概率"],
                    t(
                      `$e^{0} = 1$, so $M_X(t) = ${qFrac} + ${pFrac} e^{${k}t}$.`,
                      `$e^{0} = 1$，所以 $M_X(t) = ${qFrac} + ${pFrac} e^{${k}t}$。`,
                    ),
                  ],
                ],
                t(
                  `At $t = 0$: $${qFrac} + ${pFrac} = 1$; and $M_X'(0) = ${k} \\cdot ${pFrac}$ is the mean $E[X]$.`,
                  `在 $t = 0$ 处：$${qFrac} + ${pFrac} = 1$；而 $M_X'(0) = ${k} \\cdot ${pFrac}$ 正是均值 $E[X]$。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                `The probabilities are exchanged: $e^{${k}t}$ goes with $P(X = ${k}) = ${pFrac}$.`,
                `两个概率弄反了：$e^{${k}t}$ 对应 $P(X = ${k}) = ${pFrac}$。`,
              ],
              [
                opts[2]!.en,
                `This is the generating function of a binomial variable with $${k}$ trials, not of a variable with two values.`,
                `这是试验 $${k}$ 次的二项变量的矩母函数，不是只取两个值的变量的。`,
              ],
              [
                opts[3]!.en,
                "The exponentials are misplaced: the value $0$ gives $e^0 = 1$, and the other value gives a positive exponent.",
                "指数放错了位置：取值 $0$ 给出 $e^0 = 1$，另一个取值给出正的指数。",
              ],
            ],
          );
        },
      },
    ],
  },

  // 2.6.2 Calculating Moments Using Moment-Generating Functions
  {
    id: "calculating-moments-using-moment-generating-functions",
    title: t("Calculating Moments Using Moment-Generating Functions", "利用矩母函数计算矩"),
    summary: t(
      "The $n$-th moment of $X$ equals the $n$-th derivative of its MGF at zero: $E[X^n] = M_X^{(n)}(0)$.",
      "$X$ 的 $n$ 阶原点矩等于其矩母函数的 $n$ 阶导数在零点处的值：$E[X^n] = M_X^{(n)}(0)$。",
    ),
    intro: t(
      "A random variable has $M_X(t) = (1 - 20t)^{-12}$. Its mean is the first derivative at zero: $M_X'(t) = 12 \\cdot 20 (1 - 20t)^{-13}$, so $E[X] = M_X'(0) = 240$.\n\nCheck: this is a gamma variable with shape $12$ and scale $20$, whose mean is $12 \\cdot 20 = 240$.\n\nIn this lesson we find moments by differentiating moment generating functions at zero, and by reading coefficients of their series.",
      "某随机变量的 $M_X(t) = (1 - 20t)^{-12}$。它的均值是零处的一阶导数：$M_X'(t) = 12 \\cdot 20 (1 - 20t)^{-13}$，所以 $E[X] = M_X'(0) = 240$。\n\n检验：这是形状参数为 $12$、尺度参数为 $20$ 的伽马变量，其均值为 $12 \\cdot 20 = 240$。\n\n本课我们在零处对矩母函数求导来求矩，也从它的级数系数中读出矩。",
    ),
    prerequisites: ["moment-generating-functions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "first-moment-via-mgf-derivative",
        title: t("Finding E[X] via the first derivative of the MGF", "利用矩母函数一阶导数求期望 E[X]"),
        explanation: t(
          "Differentiating the exponential brings down a factor of the variable, so the first derivative at zero is the mean. Differentiating $M_X(t)$ once and evaluating at $t = 0$ yields the first moment: $E[X] = M_X'(0)$. For $M_X(t) = (1 - 20t)^{-12}$, $M_X'(0) = 12 \\cdot 20 = 240$.\n\n> **Watch out.** The chain rule brings down two factors: the power $k$ and the $\\theta$ from the inside. The two minus signs, from the power and from $-\\theta$, cancel.",
          "对指数函数求导会带下一个变量因子，所以在零处的一阶导数就是均值。对矩母函数 $M_X(t)$ 求一阶导数并在 $t = 0$ 处取值，即得一阶原点矩：$E[X] = M_X'(0)$。对于 $M_X(t) = (1 - 20t)^{-12}$，$M_X'(0) = 12 \\cdot 20 = 240$。\n\n> **注意。** 链式法则带下两个因子：幂 $k$ 和内层的 $\\theta$。来自幂和来自 $-\\theta$ 的两个负号相互抵消。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 10);
          const theta = rng.int(2, 10);
          // M(t) = (1 - theta t)^(-k) => M'(t) = k theta (1 - theta t)^(-k-1) => M'(0) = k theta
          const mean = k * theta;

          return numberProblem({
            prompt: t(
              `The moment-generating function of a continuous random variable $X$ is $M_X(t) = (1 - ${theta} t)^{-${k}}$ for $t < \\frac{1}{${theta}}$. Find $E[X]$.`,
              `连续型随机变量 $X$ 的矩母函数为 $M_X(t) = (1 - ${theta} t)^{-${k}}$（$t < \\frac{1}{${theta}}$）。求 $E[X]$。`,
            ),
            answer: mean,
            mistakes: distinct(mean, [
              why(
                k,
                `That leaves out the factor $${theta}$ from the inside of the chain rule.`,
                `那是漏掉了链式法则中内层的因子 $${theta}$。`,
              ),
              why(theta, `That leaves out the power $${k}$ that differentiation brings down.`, `那是漏掉了求导时带下的幂 $${k}$。`),
              why(
                Q.of(k, theta),
                `That divides by $${theta}$; the chain rule multiplies by it.`,
                `那是除以了 $${theta}$；链式法则是乘以它。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate", "求导"],
                  t(
                    `$M_X'(t) = -${k} (1 - ${theta} t)^{-${k + 1}} \\cdot (-${theta}) = ${k * theta} (1 - ${theta} t)^{-${k + 1}}$.`,
                    `$M_X'(t) = -${k} (1 - ${theta} t)^{-${k + 1}} \\cdot (-${theta}) = ${k * theta} (1 - ${theta} t)^{-${k + 1}}$。`,
                  ),
                ],
                [
                  ["Evaluate at zero", "在零处求值"],
                  t(
                    `$E[X] = M_X'(0) = ${mean}$, since $(1 - 0)^{-${k + 1}} = 1$.`,
                    `$E[X] = M_X'(0) = ${mean}$，因为 $(1 - 0)^{-${k + 1}} = 1$。`,
                  ),
                ],
              ],
              t(
                `This is a gamma variable with shape $${k}$ and scale $${theta}$, whose mean is $${k} \\cdot ${theta} = ${mean}$.`,
                `这是形状参数为 $${k}$、尺度参数为 $${theta}$ 的伽马变量，其均值为 $${k} \\cdot ${theta} = ${mean}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "second-moment-via-mgf-derivative",
        title: t("Finding E[X^2] via the second derivative of the MGF", "利用矩母函数二阶导数求二阶矩 E[X^2]"),
        explanation: t(
          "Each derivative brings down another factor of the variable, so the second derivative at zero is the mean of the square. Differentiating $M_X(t)$ twice and evaluating at $t = 0$ yields the second moment: $E[X^2] = M_X''(0)$. For $M_X(t) = (1 - 10t)^{-12}$, $M_X''(0) = 12 \\cdot 13 \\cdot 100 = 15600$.\n\n> **Watch out.** The second derivative brings down $k$ and then $k + 1$, and $\\theta$ twice. $E[X^2]$ is not $(E[X])^2 = k^2\\theta^2$; the difference is the variance.",
          "每求一次导数就多带下一个变量因子，所以在零处的二阶导数是平方的均值。对矩母函数 $M_X(t)$ 求二阶导数并在 $t = 0$ 处取值，即得二阶原点矩：$E[X^2] = M_X''(0)$。对于 $M_X(t) = (1 - 10t)^{-12}$，$M_X''(0) = 12 \\cdot 13 \\cdot 100 = 15600$。\n\n> **注意。** 二阶导数先带下 $k$，再带下 $k + 1$，$\\theta$ 也带下两次。$E[X^2]$ 不是 $(E[X])^2 = k^2\\theta^2$；两者之差是方差。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 8);
          const theta = rng.int(2, 6);
          // M''(t) = k(k+1) theta^2 (1 - theta t)^(-k-2) => M''(0) = k(k+1) theta^2
          const secondMoment = k * (k + 1) * theta * theta;

          return numberProblem({
            prompt: t(
              `The moment-generating function of $X$ is $M_X(t) = (1 - ${theta} t)^{-${k}}$ for $t < \\frac{1}{${theta}}$. Find the second moment $E[X^2]$.`,
              `随机变量 $X$ 的矩母函数为 $M_X(t) = (1 - ${theta} t)^{-${k}}$（$t < \\frac{1}{${theta}}$）。求二阶原点矩 $E[X^2]$。`,
            ),
            answer: secondMoment,
            mistakes: distinct(secondMoment, [
              why(
                k * k * theta * theta,
                "That is $(E[X])^2$; the second derivative brings down $k + 1$, not $k$ again.",
                "那是 $(E[X])^2$；二阶导数带下的是 $k + 1$，而不是再一个 $k$。",
              ),
              why(
                k * (k + 1) * theta,
                `That keeps only one factor $${theta}$; each derivative brings down another.`,
                `那只保留了一个因子 $${theta}$；每求一次导数都要再带下一个。`,
              ),
              why(k * theta * theta, "That is the variance $k\\theta^2$, not the second moment.", "那是方差 $k\\theta^2$，不是二阶矩。"),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate once", "求一阶导数"],
                  t(`$M_X'(t) = ${k * theta}(1 - ${theta} t)^{-${k + 1}}$.`, `$M_X'(t) = ${k * theta}(1 - ${theta} t)^{-${k + 1}}$。`),
                ],
                [
                  ["Differentiate again and evaluate", "再求导并求值"],
                  t(
                    `$M_X''(t) = ${k * theta} \\cdot ${k + 1} \\cdot ${theta} (1 - ${theta} t)^{-${k + 2}} = ${secondMoment}(1 - ${theta} t)^{-${k + 2}}$, so $E[X^2] = M_X''(0) = ${secondMoment}$.`,
                    `$M_X''(t) = ${k * theta} \\cdot ${k + 1} \\cdot ${theta} (1 - ${theta} t)^{-${k + 2}} = ${secondMoment}(1 - ${theta} t)^{-${k + 2}}$，所以 $E[X^2] = M_X''(0) = ${secondMoment}$。`,
                  ),
                ],
              ],
              t(
                `$E[X^2] - (E[X])^2 = ${secondMoment} - ${k * theta}^2 = ${secondMoment} - ${k * k * theta * theta} = ${k * theta * theta}$, which is positive, as a variance must be.`,
                `$E[X^2] - (E[X])^2 = ${secondMoment} - ${k * theta}^2 = ${secondMoment} - ${k * k * theta * theta} = ${k * theta * theta}$，是正数，方差必须如此。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 2.6.3 Calculating Variance and Standard Deviation Using Moment-Generating Functions
  {
    id: "calculating-variance-and-standard-deviation-using-moment-generating-functions",
    title: t("Calculating Variance and Standard Deviation Using Moment-Generating Functions", "利用矩母函数计算方差与标准差"),
    summary: t(
      "The variance and standard deviation of $X$ follow from the derivatives of its MGF: $\\operatorname{Var}(X) = M_X''(0) - (M_X'(0))^2$ and $\\sigma = \\sqrt{\\operatorname{Var}(X)}$.",
      "$X$ 的方差和标准差可由矩母函数的导数求得：$\\operatorname{Var}(X) = M_X''(0) - (M_X'(0))^2$，$\\sigma = \\sqrt{\\operatorname{Var}(X)}$。",
    ),
    intro: t(
      "A Poisson variable has $M_X(t) = e^{2500(e^t - 1)}$. Its derivatives at zero give $E[X] = 2500$ and $E[X^2] = 2500^2 + 2500$, so $\\operatorname{Var}(X) = 2500$ and the standard deviation is $\\sqrt{2500} = 50$.\n\nCheck: $50^2 = 2500$, the rate, as for every Poisson variable.\n\nIn this lesson we compute variances and standard deviations from the first two derivatives of a moment generating function.",
      "某泊松变量的 $M_X(t) = e^{2500(e^t - 1)}$。它在零处的导数给出 $E[X] = 2500$，$E[X^2] = 2500^2 + 2500$，所以 $\\operatorname{Var}(X) = 2500$，标准差为 $\\sqrt{2500} = 50$。\n\n检验：$50^2 = 2500$，正是速率，每个泊松变量都是如此。\n\n本课我们由矩母函数的前两阶导数计算方差和标准差。",
    ),
    prerequisites: ["calculating-moments-using-moment-generating-functions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "variance-from-mgf-derivatives",
        title: t("Evaluating variance from MGF derivatives", "由矩母函数导数计算方差"),
        explanation: t(
          "Find the first two moments from the derivatives at zero, then subtract the square of the first from the second. For $M_X(t) = (1 - \\theta t)^{-k}$, $E[X] = k\\theta$ and $E[X^2] = k(k+1)\\theta^2$. Hence $\\operatorname{Var}(X) = k(k+1)\\theta^2 - (k\\theta)^2 = k\\theta^2$. For $(1 - 10t)^{-12}$ that is $12 \\cdot 100 = 1200$.\n\n> **Watch out.** $M_X''(0)$ is the second moment, not the variance: subtract $(M_X'(0))^2$. And the variance is $k\\theta^2$, not the mean $k\\theta$.",
          "由在零处的导数求出前两阶矩，再用二阶矩减去一阶矩的平方。对于 $M_X(t) = (1 - \\theta t)^{-k}$，$E[X] = k\\theta$，$E[X^2] = k(k+1)\\theta^2$。因此 $\\operatorname{Var}(X) = k(k+1)\\theta^2 - (k\\theta)^2 = k\\theta^2$。对于 $(1 - 10t)^{-12}$，它是 $12 \\cdot 100 = 1200$。\n\n> **注意。** $M_X''(0)$ 是二阶矩，不是方差：还要减去 $(M_X'(0))^2$。而且方差是 $k\\theta^2$，不是均值 $k\\theta$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 10);
          const theta = rng.int(2, 8);
          const variance = k * theta * theta;

          return numberProblem({
            prompt: t(
              `The moment-generating function of $X$ is $M_X(t) = (1 - ${theta} t)^{-${k}}$. Find $\\text{Var}(X)$.`,
              `设 $X$ 的矩母函数为 $M_X(t) = (1 - ${theta} t)^{-${k}}$。计算方差 $\\text{Var}(X)$。`,
            ),
            answer: variance,
            mistakes: distinct(variance, [
              why(k * theta, "That is the mean $M_X'(0)$, not the variance.", "那是均值 $M_X'(0)$，不是方差。"),
              why(k * k * theta * theta, "That is $(E[X])^2$, the square of the mean.", "那是 $(E[X])^2$，即均值的平方。"),
              why(
                k * (k + 1) * theta * theta,
                "That is the second moment $M_X''(0)$; the square of the mean must be subtracted.",
                "那是二阶矩 $M_X''(0)$；还要减去均值的平方。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the moments", "求矩"],
                  t(
                    `$E[X] = M_X'(0) = ${k} \\cdot ${theta} = ${k * theta}$ and $E[X^2] = M_X''(0) = ${k} \\cdot ${k + 1} \\cdot ${theta}^2 = ${k * (k + 1) * theta * theta}$.`,
                    `$E[X] = M_X'(0) = ${k} \\cdot ${theta} = ${k * theta}$，$E[X^2] = M_X''(0) = ${k} \\cdot ${k + 1} \\cdot ${theta}^2 = ${k * (k + 1) * theta * theta}$。`,
                  ),
                ],
                [
                  ["Subtract", "相减"],
                  t(
                    `$\\text{Var}(X) = ${k * (k + 1) * theta * theta} - ${k * theta}^2 = ${k * (k + 1) * theta * theta} - ${k * k * theta * theta} = ${variance}$.`,
                    `$\\text{Var}(X) = ${k * (k + 1) * theta * theta} - ${k * theta}^2 = ${k * (k + 1) * theta * theta} - ${k * k * theta * theta} = ${variance}$。`,
                  ),
                ],
              ],
              t(
                `The formula $k\\theta^2$ gives $${k} \\cdot ${theta * theta} = ${variance}$, which is the mean $${k * theta}$ times $\\theta = ${theta}$.`,
                `公式 $k\\theta^2$ 给出 $${k} \\cdot ${theta * theta} = ${variance}$，即均值 $${k * theta}$ 乘以 $\\theta = ${theta}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "standard-deviation-from-poisson-mgf",
        title: t("Standard deviation from an exponential-type or Poisson MGF", "由泊松型矩母函数计算标准差"),
        explanation: t(
          "The derivatives of the Poisson generating function show that its mean and variance are both the rate, so the standard deviation is the square root of the rate. For a Poisson random variable with MGF $M_X(t) = e^{\\lambda(e^t - 1)}$, $\\operatorname{Var}(X) = \\lambda$, so the standard deviation is $\\sigma = \\sqrt{\\lambda}$. For $e^{2500(e^t - 1)}$, $\\sigma = 50$.\n\n> **Watch out.** The rate is the variance, not the standard deviation: take its square root. And $M_X''(0) = \\lambda^2 + \\lambda$ is the second moment, not the variance.",
          "泊松矩母函数的导数表明它的均值和方差都等于速率，所以标准差是速率的平方根。对于矩母函数为 $M_X(t) = e^{\\lambda(e^t - 1)}$ 的泊松随机变量，$\\operatorname{Var}(X) = \\lambda$，标准差为 $\\sigma = \\sqrt{\\lambda}$。对于 $e^{2500(e^t - 1)}$，$\\sigma = 50$。\n\n> **注意。** 速率是方差，不是标准差：要开平方。而 $M_X''(0) = \\lambda^2 + \\lambda$ 是二阶矩，不是方差。",
        ),
        generate: (rng: Rng): Problem => {
          const sigma = rng.int(2, 45);
          const lambda = sigma * sigma;

          return numberProblem({
            prompt: t(
              `A random variable $X$ has moment-generating function $M_X(t) = e^{${lambda}(e^t - 1)}$. Find the standard deviation $\\sigma = \\sqrt{\\text{Var}(X)}$.`,
              `随机变量 $X$ 的矩母函数为 $M_X(t) = e^{${lambda}(e^t - 1)}$。求其标准差 $\\sigma = \\sqrt{\\text{Var}(X)}$。`,
            ),
            answer: sigma,
            mistakes: distinct(sigma, [
              why(lambda, "That is the variance; the standard deviation is its square root.", "那是方差；标准差是它的平方根。"),
              why(
                lambda * lambda + lambda,
                "That is the second moment $M_X''(0)$, not the standard deviation.",
                "那是二阶矩 $M_X''(0)$，不是标准差。",
              ),
              why(
                2 * sigma,
                `That is $\\sqrt{4 \\cdot ${lambda}}$; the variance is $${lambda}$, not four times it.`,
                `那是 $\\sqrt{4 \\cdot ${lambda}}$；方差是 $${lambda}$，不是它的四倍。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate", "求导"],
                  t(
                    `$M_X'(t) = ${lambda} e^t M_X(t)$ and $M_X''(t) = \\left(${lambda} e^t + ${lambda}^2 e^{2t}\\right) M_X(t)$, so $E[X] = ${lambda}$ and $E[X^2] = ${lambda} + ${lambda}^2$.`,
                    `$M_X'(t) = ${lambda} e^t M_X(t)$，$M_X''(t) = \\left(${lambda} e^t + ${lambda}^2 e^{2t}\\right) M_X(t)$，所以 $E[X] = ${lambda}$，$E[X^2] = ${lambda} + ${lambda}^2$。`,
                  ),
                ],
                [
                  ["Take the variance and its root", "求方差并开方"],
                  t(
                    `$\\text{Var}(X) = ${lambda} + ${lambda}^2 - ${lambda}^2 = ${lambda}$, so $\\sigma = \\sqrt{${lambda}} = ${sigma}$.`,
                    `$\\text{Var}(X) = ${lambda} + ${lambda}^2 - ${lambda}^2 = ${lambda}$，所以 $\\sigma = \\sqrt{${lambda}} = ${sigma}$。`,
                  ),
                ],
              ],
              t(`$${sigma}^2 = ${lambda}$, the rate of the Poisson variable.`, `$${sigma}^2 = ${lambda}$，正是泊松变量的速率。`),
            ),
          });
        },
      },
    ],
  },

  // 2.6.4 Constructing Moment-Generating Functions for Discrete Probability Distributions
  {
    id: "constructing-moment-generating-functions-for-discrete-probability-distributions",
    title: t("Constructing Moment-Generating Functions for Discrete Probability Distributions", "构造离散型概率分布的矩母函数"),
    summary: t(
      "MGFs of classic discrete distributions: binomial $M(t) = (1 - p + pe^t)^n$, Poisson $M(t) = e^{\\lambda(e^t - 1)}$, and geometric $M(t) = \\frac{pe^t}{1 - (1 - p)e^t}$.",
      "经典离散分布的矩母函数：二项分布 $M(t) = (1 - p + pe^t)^n$，泊松分布 $M(t) = e^{\\lambda(e^t - 1)}$，几何分布 $M(t) = \\frac{pe^t}{1 - (1 - p)e^t}$。",
    ),
    intro: t(
      "A Poisson variable with rate $60$ has $M_X(t) = \\sum_{k \\ge 0} e^{tk} \\frac{e^{-60} 60^k}{k!} = e^{-60} e^{60e^t} = e^{60(e^t - 1)}$, because the sum is the exponential series in $60e^t$.\n\nCheck: $M_X(0) = e^{0} = 1$, and $M_X'(0) = 60$, the mean.\n\nIn this lesson we build the moment generating functions of binomial, Poisson and finite distributions, and read variances from them.",
      "速率为 $60$ 的泊松变量有 $M_X(t) = \\sum_{k \\ge 0} e^{tk} \\frac{e^{-60} 60^k}{k!} = e^{-60} e^{60e^t} = e^{60(e^t - 1)}$，因为这个和是关于 $60e^t$ 的指数级数。\n\n检验：$M_X(0) = e^{0} = 1$，而 $M_X'(0) = 60$，正是均值。\n\n本课我们构造二项分布、泊松分布和有限分布的矩母函数，并从中读出方差。",
    ),
    prerequisites: ["moment-generating-functions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "mgf-of-binomial-distribution",
        title: t("Identifying the MGF of a Binomial distribution", "识别二项分布的矩母函数"),
        explanation: t(
          "A binomial variable is a sum of independent trials, and the generating function of a sum of independent variables is the product of theirs. For $X \\sim \\text{Binomial}(n, p)$, each trial has MGF $1 - p + pe^t$. By the independence of the trials, $M_X(t) = (1 - p + pe^t)^n$. For $40$ trials with $p = 0.5$, $M_X(t) = (0.5 + 0.5e^t)^{40}$.\n\n> **Watch out.** $e^t$ goes with the success probability $p$, not with $1 - p$. And the power $n$ goes outside the bracket: $n$ independent trials multiply their generating functions.",
          "二项变量是独立试验之和，而独立变量之和的矩母函数等于它们矩母函数的乘积。对于 $X \\sim \\text{Binomial}(n, p)$，每次试验的矩母函数为 $1 - p + pe^t$，由试验的独立性得 $M_X(t) = (1 - p + pe^t)^n$。对于 $p = 0.5$ 的 $40$ 次试验，$M_X(t) = (0.5 + 0.5e^t)^{40}$。\n\n> **注意。** $e^t$ 跟着成功概率 $p$，而不是 $1 - p$。幂 $n$ 在括号外面：$n$ 次独立试验的矩母函数相乘。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(5, 30);
          const pPercent = rng.pick([10, 20, 25, 30, 40, 60, 70, 75, 80]);
          const p = pPercent / 100;
          const q = Number((1 - p).toFixed(2));

          const opts = [
            t(`$(${q} + ${p} e^t)^{${n}}$`, `$(${q} + ${p} e^t)^{${n}}$`),
            t(`$(${p} + ${q} e^t)^{${n}}$`, `$(${p} + ${q} e^t)^{${n}}$`),
            t(`$${q} + ${p} e^{${n}t}$`, `$${q} + ${p} e^{${n}t}$`),
            t(`$e^{${n} \\cdot ${p} (e^t - 1)}$`, `$e^{${n} \\cdot ${p} (e^t - 1)}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);
          return reasoned(
            choiceProblem({
              prompt: t(
                `A random variable $X$ has binomial distribution with $n = ${n}$ trials and success probability $p = ${p}$. Which formula gives its moment-generating function $M_X(t)$?`,
                `随机变量 $X$ 服从试验次数为 $n = ${n}$、成功概率为 $p = ${p}$ 的二项分布。下列哪个公式是其矩母函数 $M_X(t)$？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["One trial", "一次试验"],
                    t(
                      `A single trial is $1$ with probability $${p}$ and $0$ with probability $${q}$, so its generating function is $${q} + ${p} e^t$.`,
                      `一次试验以概率 $${p}$ 取 $1$，以概率 $${q}$ 取 $0$，所以它的矩母函数为 $${q} + ${p} e^t$。`,
                    ),
                  ],
                  [
                    ["Multiply over the trials", "对各次试验相乘"],
                    t(
                      `$X$ is the sum of $${n}$ independent trials, so $M_X(t) = (${q} + ${p} e^t)^{${n}}$.`,
                      `$X$ 是 $${n}$ 次独立试验之和，所以 $M_X(t) = (${q} + ${p} e^t)^{${n}}$。`,
                    ),
                  ],
                ],
                t(
                  `At $t = 0$ it gives $(${q} + ${p})^{${n}} = 1$, and its derivative there is $${n} \\cdot ${p}$, the mean $np$.`,
                  `在 $t = 0$ 处它给出 $(${q} + ${p})^{${n}} = 1$，那里的导数为 $${n} \\cdot ${p}$，正是均值 $np$。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "$p$ and $q$ are exchanged: $e^t$ goes with a success, whose probability is $p$.",
                "$p$ 和 $q$ 弄反了：$e^t$ 对应成功，其概率是 $p$。",
              ],
              [
                opts[2]!.en,
                `This multiplies one trial by $${n}$ instead of adding $${n}$ independent trials, whose generating functions multiply.`,
                `这是把一次试验乘以 $${n}$，而不是把 $${n}$ 次独立试验相加；相加时矩母函数相乘。`,
              ],
              [
                opts[3]!.en,
                "This is the generating function of a Poisson variable with the same mean.",
                "这是均值相同的泊松变量的矩母函数。",
              ],
            ],
          );
        },
      },
      {
        id: "mgf-of-poisson-distribution",
        title: t("Deriving the MGF of a Poisson distribution", "推导泊松分布的矩母函数"),
        explanation: t(
          "Combining the exponential factor with the power in each term turns the sum into the exponential series, which has a closed form. For $X \\sim \\text{Poisson}(\\lambda)$, $M_X(t) = \\sum_{k=0}^\\infty e^{tk} \\frac{e^{-\\lambda} \\lambda^k}{k!} = e^{-\\lambda} \\sum_{k=0}^\\infty \\frac{(\\lambda e^t)^k}{k!} = e^{-\\lambda} e^{\\lambda e^t} = e^{\\lambda(e^t - 1)}$. For $\\lambda = 60$, $M_X(t) = e^{60(e^t - 1)}$.\n\n> **Watch out.** The exponent is $\\lambda(e^t - 1)$, not $\\lambda(1 - e^t)$: the factor $e^{-\\lambda}$ supplies the $-1$. And $\\frac{\\lambda}{\\lambda - t}$ belongs to an exponential variable, not a Poisson one.",
          "把每一项中的指数因子与幂合并，就把这个和变成了指数级数，它有封闭形式。对于 $X \\sim \\text{Poisson}(\\lambda)$，$M_X(t) = \\sum_{k=0}^\\infty e^{tk} \\frac{e^{-\\lambda} \\lambda^k}{k!} = e^{-\\lambda} \\sum_{k=0}^\\infty \\frac{(\\lambda e^t)^k}{k!} = e^{-\\lambda} e^{\\lambda e^t} = e^{\\lambda(e^t - 1)}$。当 $\\lambda = 60$ 时，$M_X(t) = e^{60(e^t - 1)}$。\n\n> **注意。** 指数是 $\\lambda(e^t - 1)$，不是 $\\lambda(1 - e^t)$：因子 $e^{-\\lambda}$ 提供了 $-1$。而 $\\frac{\\lambda}{\\lambda - t}$ 属于指数变量，不属于泊松变量。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(2, 50);
          const opts = [
            t(`$e^{${lambda}(e^t - 1)}$`, `$e^{${lambda}(e^t - 1)}$`),
            t(`$e^{${lambda}(1 - e^t)}$`, `$e^{${lambda}(1 - e^t)}$`),
            t(`$(1 - ${lambda} t)^{-1}$`, `$(1 - ${lambda} t)^{-1}$`),
            t(`$\\frac{${lambda}}{${lambda} - t}$`, `$\\frac{${lambda}}{${lambda} - t}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return reasoned(
            choiceProblem({
              prompt: t(
                `Let $X$ have Poisson distribution with parameter $\\lambda = ${lambda}$. Which expression is the moment-generating function $M_X(t)$?`,
                `设 $X$ 服从参数为 $\\lambda = ${lambda}$ 的泊松分布。下列哪个表达式是其矩母函数 $M_X(t)$？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Write the sum", "写出求和式"],
                    t(
                      `$M_X(t) = \\sum_{k=0}^\\infty e^{tk} \\frac{e^{-${lambda}} ${lambda}^k}{k!} = e^{-${lambda}} \\sum_{k=0}^\\infty \\frac{(${lambda} e^t)^k}{k!}$.`,
                      `$M_X(t) = \\sum_{k=0}^\\infty e^{tk} \\frac{e^{-${lambda}} ${lambda}^k}{k!} = e^{-${lambda}} \\sum_{k=0}^\\infty \\frac{(${lambda} e^t)^k}{k!}$。`,
                    ),
                  ],
                  [
                    ["Sum the exponential series", "对指数级数求和"],
                    t(
                      `The series is $e^{${lambda} e^t}$, so $M_X(t) = e^{-${lambda}} e^{${lambda} e^t} = e^{${lambda}(e^t - 1)}$.`,
                      `这个级数等于 $e^{${lambda} e^t}$，所以 $M_X(t) = e^{-${lambda}} e^{${lambda} e^t} = e^{${lambda}(e^t - 1)}$。`,
                    ),
                  ],
                ],
                t(
                  `$M_X(0) = e^{0} = 1$, and $M_X'(0) = ${lambda} e^{0} = ${lambda}$, the mean of the Poisson variable.`,
                  `$M_X(0) = e^{0} = 1$，而 $M_X'(0) = ${lambda} e^{0} = ${lambda}$，正是泊松变量的均值。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "The sign in the exponent is reversed: this would give a negative mean.",
                "指数中的符号反了：这会得到负的均值。",
              ],
              [
                opts[2]!.en,
                "This is the generating function of an exponential variable with mean $\\lambda$, a continuous variable.",
                "这是均值为 $\\lambda$ 的指数变量的矩母函数，那是连续变量。",
              ],
              [
                opts[3]!.en,
                "This is the generating function of an exponential variable with rate $\\lambda$, not of a Poisson variable.",
                "这是速率为 $\\lambda$ 的指数变量的矩母函数，不是泊松变量的。",
              ],
            ],
          );
        },
      },
    ],
  },

  // 2.6.5 Constructing Moment-Generating Functions for Continuous Probability Distributions
  {
    id: "constructing-moment-generating-functions-for-continuous-probability-distributions",
    title: t("Constructing Moment-Generating Functions for Continuous Probability Distributions", "构造连续型概率分布的矩母函数"),
    summary: t(
      "MGFs of classic continuous distributions: exponential $M(t) = \\frac{\\lambda}{\\lambda - t}$, uniform $M(t) = \\frac{e^{bt} - e^{at}}{t(b - a)}$, and normal $M(t) = e^{\\mu t + \\sigma^2 t^2 / 2}$.",
      "经典连续分布的矩母函数：指数分布 $M(t) = \\frac{\\lambda}{\\lambda - t}$，均匀分布 $M(t) = \\frac{e^{bt} - e^{at}}{t(b - a)}$，正态分布 $M(t) = e^{\\mu t + \\sigma^2 t^2 / 2}$。",
    ),
    intro: t(
      "An exponential variable with rate $60$ has $M_X(t) = \\int_0^\\infty e^{tx} \\cdot 60e^{-60x}\\,dx = 60 \\int_0^\\infty e^{-(60 - t)x}\\,dx = \\frac{60}{60 - t}$ for $t < 60$.\n\nCheck: $M_X(0) = \\frac{60}{60} = 1$, and $M_X'(0) = \\frac{60}{60^2} = \\frac{1}{60}$, the mean waiting time.\n\nIn this lesson we build the moment generating functions of exponential, uniform and shifted densities by integration.",
      "速率为 $60$ 的指数变量在 $t < 60$ 时有 $M_X(t) = \\int_0^\\infty e^{tx} \\cdot 60e^{-60x}\\,dx = 60 \\int_0^\\infty e^{-(60 - t)x}\\,dx = \\frac{60}{60 - t}$。\n\n检验：$M_X(0) = \\frac{60}{60} = 1$，而 $M_X'(0) = \\frac{60}{60^2} = \\frac{1}{60}$，正是平均等待时间。\n\n本课我们用积分构造指数密度、均匀密度和平移后密度的矩母函数。",
    ),
    prerequisites: ["moment-generating-functions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "mgf-of-exponential-distribution",
        title: t("Deriving the MGF of an exponential distribution", "推导指数分布的矩母函数"),
        explanation: t(
          "The integral combines two exponentials into one, and it converges only when the parameter is less than the rate, so the formula holds only there. For $X \\sim \\text{Exp}(\\lambda)$ and $t < \\lambda$, $M_X(t) = \\int_0^\\infty e^{tx} \\lambda e^{-\\lambda x} \\, dx = \\lambda \\int_0^\\infty e^{-(\\lambda - t)x} \\, dx = \\frac{\\lambda}{\\lambda - t}$. For $\\lambda = 60$, $M_X(t) = \\frac{60}{60 - t}$.\n\n> **Watch out.** The denominator is $\\lambda - t$, not $\\lambda + t$: the exponents combine to $-(\\lambda - t)x$. And the formula holds only for $t < \\lambda$, where the integral converges.",
          "这个积分把两个指数函数合成一个，只有当参数小于速率时才收敛，所以公式只在那里成立。对于 $X \\sim \\text{Exp}(\\lambda)$，在 $t < \\lambda$ 时，$M_X(t) = \\int_0^\\infty e^{tx} \\lambda e^{-\\lambda x} \\, dx = \\lambda \\int_0^\\infty e^{-(\\lambda - t)x} \\, dx = \\frac{\\lambda}{\\lambda - t}$。当 $\\lambda = 60$ 时，$M_X(t) = \\frac{60}{60 - t}$。\n\n> **注意。** 分母是 $\\lambda - t$，不是 $\\lambda + t$：指数合并后是 $-(\\lambda - t)x$。而且公式只在积分收敛的 $t < \\lambda$ 上成立。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(2, 50);
          const opts = [
            t(`$\\frac{${lambda}}{${lambda} - t}$`, `$\\frac{${lambda}}{${lambda} - t}$`),
            t(`$\\frac{${lambda}}{${lambda} + t}$`, `$\\frac{${lambda}}{${lambda} + t}$`),
            t(`$\\frac{1}{1 - ${lambda} t^2}$`, `$\\frac{1}{1 - ${lambda} t^2}$`),
            t(`$e^{${lambda} t}$`, `$e^{${lambda} t}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);
          return reasoned(
            choiceProblem({
              prompt: t(
                `Let $X$ be an exponentially distributed random variable with rate $\\lambda = ${lambda}$ ($f(x) = ${lambda} e^{-${lambda} x}$ for $x > 0$). What is its moment-generating function $M_X(t)$ for $t < ${lambda}$?`,
                `设 $X$ 服从速率参数为 $\\lambda = ${lambda}$ 的指数分布（$x > 0$ 时 $f(x) = ${lambda} e^{-${lambda} x}$）。在 $t < ${lambda}$ 时其矩母函数 $M_X(t)$ 是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Combine the exponentials", "合并指数"],
                    t(
                      `$M_X(t) = \\int_0^\\infty e^{tx} \\cdot ${lambda} e^{-${lambda} x}\\,dx = ${lambda} \\int_0^\\infty e^{-(${lambda} - t)x}\\,dx$.`,
                      `$M_X(t) = \\int_0^\\infty e^{tx} \\cdot ${lambda} e^{-${lambda} x}\\,dx = ${lambda} \\int_0^\\infty e^{-(${lambda} - t)x}\\,dx$。`,
                    ),
                  ],
                  [
                    ["Integrate", "积分"],
                    t(
                      `For $t < ${lambda}$ the integral is $\\frac{1}{${lambda} - t}$, so $M_X(t) = \\frac{${lambda}}{${lambda} - t}$.`,
                      `当 $t < ${lambda}$ 时积分为 $\\frac{1}{${lambda} - t}$，所以 $M_X(t) = \\frac{${lambda}}{${lambda} - t}$。`,
                    ),
                  ],
                ],
                t(
                  `$M_X(0) = \\frac{${lambda}}{${lambda}} = 1$, and $M_X'(0) = \\frac{${lambda}}{${lambda}^2} = \\frac{1}{${lambda}}$, the mean of the exponential variable.`,
                  `$M_X(0) = \\frac{${lambda}}{${lambda}} = 1$，而 $M_X'(0) = \\frac{${lambda}}{${lambda}^2} = \\frac{1}{${lambda}}$，正是指数变量的均值。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "The sign in the denominator is wrong: combining the exponents gives $-(\\lambda - t)x$.",
                "分母的符号错了：指数合并后是 $-(\\lambda - t)x$。",
              ],
              [
                opts[2]!.en,
                "No $t^2$ appears: the integral gives a fraction with $t$ to the first power.",
                "这里不会出现 $t^2$：积分得到的分式中 $t$ 是一次的。",
              ],
              [
                opts[3]!.en,
                `This is the generating function of the constant $${lambda}$, not of a random variable with this density.`,
                `这是常数 $${lambda}$ 的矩母函数，不是具有这个密度的随机变量的。`,
              ],
            ],
          );
        },
      },
      {
        id: "mgf-of-continuous-uniform-distribution",
        title: t("Deriving the MGF of a uniform distribution", "推导均匀分布的矩母函数"),
        explanation: t(
          "Integrating the exponential against the constant density gives a difference of exponentials divided by the parameter and the length of the interval. For $X \\sim \\text{Uniform}(0, b)$, $M_X(t) = \\int_0^b e^{tx} \\cdot \\frac{1}{b} \\, dx = \\frac{e^{bt} - 1}{bt}$. On $[0, 60]$ it is $\\frac{e^{60t} - 1}{60t}$.\n\n> **Watch out.** The lower limit contributes $e^{0} = 1$, which is subtracted, not added. And keep the density $\\frac{1}{b}$, which puts $b$ in the denominator.",
          "把指数函数与常数密度一起积分，得到指数之差除以参数与区间长度之积。对于 $X \\sim \\text{Uniform}(0, b)$，$M_X(t) = \\int_0^b e^{tx} \\cdot \\frac{1}{b} \\, dx = \\frac{e^{bt} - 1}{bt}$。在 $[0, 60]$ 上它是 $\\frac{e^{60t} - 1}{60t}$。\n\n> **注意。** 下限贡献 $e^{0} = 1$，要减去而不是加上。还要保留密度 $\\frac{1}{b}$，它使分母中出现 $b$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(2, 50);
          const opts = [
            t(`$\\frac{e^{${b}t} - 1}{${b}t}$`, `$\\frac{e^{${b}t} - 1}{${b}t}$`),
            t(`$\\frac{e^{${b}t} + 1}{${b}t}$`, `$\\frac{e^{${b}t} + 1}{${b}t}$`),
            t(`$\\frac{e^{${b}t} - 1}{t}$`, `$\\frac{e^{${b}t} - 1}{t}$`),
            t(`$e^{\\frac{${b}t}{2}}$`, `$e^{\\frac{${b}t}{2}}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return reasoned(
            choiceProblem({
              prompt: t(
                `Let $X$ be uniformly distributed on $[0, ${b}]$. What is its moment-generating function $M_X(t)$ (for $t \\ne 0$)?`,
                `设 $X$ 服从区间 $[0, ${b}]$ 上的均匀分布。当 $t \\ne 0$ 时，其矩母函数 $M_X(t)$ 是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Set up the integral", "列出积分"],
                    t(
                      `$M_X(t) = \\int_0^{${b}} e^{tx} \\cdot \\frac{1}{${b}}\\,dx = \\frac{1}{${b}} \\left[ \\frac{e^{tx}}{t} \\right]_0^{${b}}$.`,
                      `$M_X(t) = \\int_0^{${b}} e^{tx} \\cdot \\frac{1}{${b}}\\,dx = \\frac{1}{${b}} \\left[ \\frac{e^{tx}}{t} \\right]_0^{${b}}$。`,
                    ),
                  ],
                  [
                    ["Evaluate at the limits", "代入上下限"],
                    t(
                      `$\\frac{1}{${b}} \\cdot \\frac{e^{${b}t} - e^{0}}{t} = \\frac{e^{${b}t} - 1}{${b}t}$.`,
                      `$\\frac{1}{${b}} \\cdot \\frac{e^{${b}t} - e^{0}}{t} = \\frac{e^{${b}t} - 1}{${b}t}$。`,
                    ),
                  ],
                ],
                t(
                  `As $t \\to 0$, $e^{${b}t} - 1 \\approx ${b}t$, so $M_X(t) \\to 1$, as a moment generating function must.`,
                  `当 $t \\to 0$ 时 $e^{${b}t} - 1 \\approx ${b}t$，所以 $M_X(t) \\to 1$，矩母函数必须如此。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "The lower limit gives $e^0 = 1$, which is subtracted, not added; this would not tend to $1$ as $t \\to 0$.",
                "下限给出 $e^0 = 1$，要减去而不是加上；这样在 $t \\to 0$ 时不会趋于 $1$。",
              ],
              [
                opts[2]!.en,
                "This leaves out the density $\\frac{1}{b}$, so it tends to $b$ rather than $1$ as $t \\to 0$.",
                "这漏掉了密度 $\\frac{1}{b}$，所以在 $t \\to 0$ 时趋于 $b$ 而不是 $1$。",
              ],
              [
                opts[3]!.en,
                "This is the generating function of the constant $\\frac{b}{2}$, the mean, not of a uniform variable.",
                "这是常数 $\\frac{b}{2}$（即均值）的矩母函数，不是均匀变量的。",
              ],
            ],
          );
        },
      },
    ],
  },

  // 2.6.6 Properties of Moment-Generating Functions
  {
    id: "properties-of-moment-generating-functions",
    title: t("Properties of Moment-Generating Functions", "矩母函数的性质"),
    summary: t(
      "Under a linear transformation, $M_{aX + b}(t) = e^{bt} M_X(at)$. The MGF of a sum of independent random variables is the product of their MGFs.",
      "线性变换满足 $M_{aX + b}(t) = e^{bt} M_X(at)$。相互独立随机变量之和的矩母函数等于各自矩母函数的乘积。",
    ),
    intro: t(
      "Let $Y = 20X + 30$. Then $e^{tY} = e^{30t} e^{(20t)X}$, so $M_Y(t) = e^{30t} M_X(20t)$: the shift gives a factor in front, and the scale goes inside.\n\nCheck: at $t = 0$, $M_Y(0) = e^{0} M_X(0) = 1$.\n\nIn this lesson we find the moment generating functions of linear transformations and of sums of independent variables, and read means and variances from their derivatives.",
      "设 $Y = 20X + 30$。则 $e^{tY} = e^{30t} e^{(20t)X}$，所以 $M_Y(t) = e^{30t} M_X(20t)$：平移在前面给出一个因子，缩放放进自变量里。\n\n检验：在 $t = 0$ 处，$M_Y(0) = e^{0} M_X(0) = 1$。\n\n本课我们求线性变换和独立变量之和的矩母函数，并从它们的导数中读出均值和方差。",
    ),
    prerequisites: [
      "constructing-moment-generating-functions-for-discrete-probability-distributions",
      "constructing-moment-generating-functions-for-continuous-probability-distributions",
    ],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "mgf-of-linear-transformation",
        title: t("MGF of a linear transformation Y = aX + b", "线性变换 Y = aX + b 的矩母函数"),
        explanation: t(
          "A shift contributes an exponential factor in front, while a scale replaces the parameter by the scaled parameter inside the original function. For $Y = aX + b$, $M_Y(t) = E[e^{t(aX + b)}] = E[e^{bt} e^{(at)X}] = e^{bt} M_X(at)$. For $Y = 20X + 30$, $M_Y(t) = e^{30t} M_X(20t)$.\n\n> **Watch out.** The shift goes into the factor $e^{bt}$ and the multiplier goes inside $M_X$; do not exchange them, and do not put the shift inside $M_X$.",
          "平移在前面贡献一个指数因子，而缩放则在原函数中把参数换成缩放后的参数。对于 $Y = aX + b$，有 $M_Y(t) = E[e^{t(aX + b)}] = E[e^{bt} e^{(at)X}] = e^{bt} M_X(at)$。对于 $Y = 20X + 30$，$M_Y(t) = e^{30t} M_X(20t)$。\n\n> **注意。** 平移量进入因子 $e^{bt}$，乘数放在 $M_X$ 里面；不要把两者对调，也不要把平移量放进 $M_X$。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(2, 12);
          let b = rng.int(2, 15);
          if (b === a) b++;
          const opts = [
            t(`$e^{${b}t} M_X(${a}t)$`, `$e^{${b}t} M_X(${a}t)$`),
            t(`$e^{${a}t} M_X(${b}t)$`, `$e^{${a}t} M_X(${b}t)$`),
            t(`$${b} e^{${a}t} M_X(t)$`, `$${b} e^{${a}t} M_X(t)$`),
            t(`$M_X(${a}t + ${b})$`, `$M_X(${a}t + ${b})$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);
          return reasoned(
            choiceProblem({
              prompt: t(
                `Let $X$ have moment-generating function $M_X(t)$. Define $Y = ${a} X + ${b}$. What is the moment-generating function $M_Y(t)$ in terms of $M_X$?`,
                `设 $X$ 的矩母函数为 $M_X(t)$。定义 $Y = ${a} X + ${b}$。用 $M_X$ 表示的矩母函数 $M_Y(t)$ 是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Split the exponential", "拆开指数"],
                    t(
                      `$e^{t(${a} X + ${b})} = e^{${b}t} e^{(${a}t)X}$, and $e^{${b}t}$ is a constant.`,
                      `$e^{t(${a} X + ${b})} = e^{${b}t} e^{(${a}t)X}$，而 $e^{${b}t}$ 是常数。`,
                    ),
                  ],
                  [
                    ["Take the expectation", "取期望"],
                    t(
                      `$M_Y(t) = e^{${b}t} E[e^{(${a}t)X}] = e^{${b}t} M_X(${a}t)$.`,
                      `$M_Y(t) = e^{${b}t} E[e^{(${a}t)X}] = e^{${b}t} M_X(${a}t)$。`,
                    ),
                  ],
                ],
                t(
                  `At $t = 0$ it gives $e^{0} M_X(0) = 1$, and its derivative there is $${b} + ${a} E[X]$, the mean of $Y$.`,
                  `在 $t = 0$ 处它给出 $e^{0} M_X(0) = 1$，那里的导数为 $${b} + ${a} E[X]$，正是 $Y$ 的均值。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "The two constants are exchanged: the shift goes in the exponential and the multiplier goes inside $M_X$.",
                "两个常数弄反了：平移量放在指数上，乘数放在 $M_X$ 里面。",
              ],
              [
                opts[2]!.en,
                "The shift is not a factor in front, and the multiplier scales the argument of $M_X$.",
                "平移量不是前面的因子，乘数缩放的是 $M_X$ 的自变量。",
              ],
              [
                opts[3]!.en,
                "The shift does not go inside $M_X$: it comes out as a factor $e^{bt}$ for the constant $b$.",
                "平移量不放进 $M_X$：对常数 $b$，它变成因子 $e^{bt}$ 提到外面。",
              ],
            ],
          );
        },
      },
      {
        id: "mgf-of-sum-of-independent-variables",
        title: t("MGF of a sum of independent random variables", "独立随机变量和的矩母函数"),
        explanation: t(
          "Independence lets the expectation of a product split into a product of expectations, so the generating functions of independent variables multiply. If $X_1$ and $X_2$ are independent, $M_{X_1 + X_2}(t) = E[e^{t(X_1 + X_2)}] = E[e^{tX_1}] \\, E[e^{tX_2}] = M_{X_1}(t) \\, M_{X_2}(t)$. For Poisson variables with rates $20$ and $30$, the product is $e^{50(e^t - 1)}$.\n\n> **Watch out.** Multiplying two exponentials adds their exponents, so the rates add; they do not multiply, and the larger one does not win.",
          "独立性使乘积的期望可以拆成期望的乘积，所以独立变量的矩母函数相乘。若 $X_1$ 与 $X_2$ 相互独立，则 $M_{X_1 + X_2}(t) = E[e^{t(X_1 + X_2)}] = E[e^{tX_1}] \\, E[e^{tX_2}] = M_{X_1}(t) \\, M_{X_2}(t)$。对于速率为 $20$ 和 $30$ 的泊松变量，乘积为 $e^{50(e^t - 1)}$。\n\n> **注意。** 两个指数相乘时指数相加，所以速率相加；它们不相乘，也不是取较大的那个。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda1 = rng.int(2, 15);
          const lambda2 = rng.int(2, 15);
          const sumLambda = lambda1 + lambda2;

          return numberProblem({
            prompt: t(
              `Let $X_1$ and $X_2$ be independent Poisson random variables with MGFs $M_{X_1}(t) = e^{${lambda1}(e^t - 1)}$ and $M_{X_2}(t) = e^{${lambda2}(e^t - 1)}$. The MGF of their sum $S = X_1 + X_2$ is $M_S(t) = e^{\\lambda_S(e^t - 1)}$. Find $\\lambda_S$.`,
              `设 $X_1$ 与 $X_2$ 为相互独立的泊松随机变量，其矩母函数分别为 $M_{X_1}(t) = e^{${lambda1}(e^t - 1)}$ 与 $M_{X_2}(t) = e^{${lambda2}(e^t - 1)}$。两者的和 $S = X_1 + X_2$ 的矩母函数为 $M_S(t) = e^{\\lambda_S(e^t - 1)}$。求 $\\lambda_S$。`,
            ),
            answer: sumLambda,
            mistakes: distinct(sumLambda, [
              why(
                lambda1 * lambda2,
                "That multiplies the rates; multiplying the exponentials adds their exponents.",
                "那是把速率相乘了；指数函数相乘时指数相加。",
              ),
              why(Math.max(lambda1, lambda2), "That keeps only the larger rate; both rates add.", "那只保留了较大的速率；两个速率要相加。"),
              why(
                Q.of(sumLambda, 2),
                "That averages the rates; the counts add, so the rates add.",
                "那是取了速率的平均；计数相加，所以速率相加。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Multiply the generating functions", "把矩母函数相乘"],
                  t(
                    `By independence, $M_S(t) = M_{X_1}(t) M_{X_2}(t) = e^{${lambda1}(e^t - 1)} e^{${lambda2}(e^t - 1)}$.`,
                    `由独立性，$M_S(t) = M_{X_1}(t) M_{X_2}(t) = e^{${lambda1}(e^t - 1)} e^{${lambda2}(e^t - 1)}$。`,
                  ),
                ],
                [
                  ["Add the exponents", "指数相加"],
                  t(
                    `$M_S(t) = e^{(${lambda1} + ${lambda2})(e^t - 1)} = e^{${sumLambda}(e^t - 1)}$, so $\\lambda_S = ${sumLambda}$.`,
                    `$M_S(t) = e^{(${lambda1} + ${lambda2})(e^t - 1)} = e^{${sumLambda}(e^t - 1)}$，所以 $\\lambda_S = ${sumLambda}$。`,
                  ),
                ],
              ],
              t(
                `Means add: $E[S] = E[X_1] + E[X_2] = ${lambda1} + ${lambda2} = ${sumLambda}$, the rate of a Poisson variable.`,
                `均值相加：$E[S] = E[X_1] + E[X_2] = ${lambda1} + ${lambda2} = ${sumLambda}$，正是泊松变量的速率。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 2.6.7 The Uniqueness Property of MGFs
  {
    id: "the-uniqueness-property-of-mgfs",
    title: t("The Uniqueness Property of MGFs", "矩母函数的唯一性定理"),
    summary: t(
      "The uniqueness theorem guarantees that if two random variables have matching MGFs on an open interval around 0, they have the identical probability distribution.",
      "唯一性定理保证：若两个随机变量的矩母函数在包含 0 的开区间内处处相等，则它们具有完全相同的概率分布。",
    ),
    intro: t(
      "A random variable has $M_X(t) = (0.8 + 0.2e^t)^{50}$. This is the form $(q + pe^t)^n$, so by uniqueness $X$ is binomial with $n = 50$ and $p = 0.2$, and its mean is $50 \\cdot 0.2 = 10$.\n\nCheck: $M_X'(0) = 50 \\cdot 0.2 \\cdot (0.8 + 0.2)^{49} = 10$.\n\nIn this lesson we identify distributions from their moment generating functions, find the distribution of a sum, and identify an unknown summand.",
      "某随机变量的 $M_X(t) = (0.8 + 0.2e^t)^{50}$。它的形式是 $(q + pe^t)^n$，所以由唯一性，$X$ 服从 $n = 50$、$p = 0.2$ 的二项分布，均值为 $50 \\cdot 0.2 = 10$。\n\n检验：$M_X'(0) = 50 \\cdot 0.2 \\cdot (0.8 + 0.2)^{49} = 10$。\n\n本课我们由矩母函数识别分布，求和的分布，并识别未知的加项。",
    ),
    prerequisites: ["properties-of-moment-generating-functions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "recognizing-distribution-from-mgf",
        title: t("Identifying a distribution from its MGF", "根据矩母函数识别概率分布"),
        explanation: t(
          "A moment generating function determines the distribution uniquely, so matching its form to a known one identifies the distribution and its parameters. By the uniqueness property, an MGF of the form $(q + pe^t)^n$ identifies the $\\text{Binomial}(n, p)$ distribution, and $e^{\\lambda(e^t - 1)}$ identifies $\\text{Poisson}(\\lambda)$. For $(0.8 + 0.2e^t)^{50}$, $X$ is $\\text{Binomial}(50, 0.2)$ with mean $10$.\n\n> **Watch out.** The success probability $p$ is the coefficient of $e^t$, not the constant term. And the mean is $np$, not $n$ and not the variance $npq$.",
          "矩母函数唯一确定分布，所以把它的形式与已知形式相对照，就能确定分布及其参数。由唯一性定理，形如 $(q + pe^t)^n$ 的矩母函数唯一确定 $\\text{Binomial}(n, p)$ 分布，而 $e^{\\lambda(e^t - 1)}$ 唯一确定 $\\text{Poisson}(\\lambda)$ 分布。对于 $(0.8 + 0.2e^t)^{50}$，$X$ 服从 $\\text{Binomial}(50, 0.2)$，均值为 $10$。\n\n> **注意。** 成功概率 $p$ 是 $e^t$ 的系数，不是常数项。而均值是 $np$，不是 $n$，也不是方差 $npq$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(4, 30);
          const p = rng.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6]);
          const q = Number((1 - p).toFixed(2));
          const mean = Number((n * p).toFixed(2));
          const meanQ = Q.parse(String(mean));
          const meanText = Number.isInteger(mean) ? `${mean}` : `${mean} = ${meanQ.toLatex()}`;

          return numberProblem({
            prompt: t(
              `A random variable $X$ has moment-generating function $M_X(t) = (${q} + ${p} e^t)^{${n}}$. By the uniqueness theorem, find the mean $E[X]$.`,
              `随机变量 $X$ 的矩母函数为 $M_X(t) = (${q} + ${p} e^t)^{${n}}$。由唯一性定理识别该分布并计算其均值 $E[X]$。`,
            ),
            answer: meanQ,
            mistakes: distinct(meanQ, [
              why(
                Q.parse(String(Number((n * q).toFixed(2)))),
                "That uses the constant term as the success probability; $p$ is the coefficient of $e^t$.",
                "那是把常数项当成了成功概率；$p$ 是 $e^t$ 的系数。",
              ),
              why(n, "That is the number of trials $n$, not the mean $np$.", "那是试验次数 $n$，不是均值 $np$。"),
              why(
                Q.parse(String(Number((n * p * q).toFixed(2)))),
                "That is the variance $npq$, not the mean.",
                "那是方差 $npq$，不是均值。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Match the form", "对照形式"],
                  t(
                    `$(${q} + ${p} e^t)^{${n}}$ has the form $(q + pe^t)^n$ with $n = ${n}$ and $p = ${p}$, so by uniqueness $X \\sim \\text{Binomial}(${n}, ${p})$.`,
                    `$(${q} + ${p} e^t)^{${n}}$具有 $(q + pe^t)^n$ 的形式，其中 $n = ${n}$，$p = ${p}$，所以由唯一性 $X \\sim \\text{Binomial}(${n}, ${p})$。`,
                  ),
                ],
                [
                  ["Compute the mean", "计算均值"],
                  t(`$E[X] = np = ${n} \\cdot ${p} = ${meanText}$.`, `$E[X] = np = ${n} \\cdot ${p} = ${meanText}$。`),
                ],
              ],
              t(
                `$M_X'(0) = ${n} \\cdot ${p} \\cdot (${q} + ${p})^{${n - 1}} = ${n} \\cdot ${p} = ${mean}$.`,
                `$M_X'(0) = ${n} \\cdot ${p} \\cdot (${q} + ${p})^{${n - 1}} = ${n} \\cdot ${p} = ${mean}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "sum-of-independent-distributions-via-mgf",
        title: t("Deriving distribution of sums via MGF uniqueness", "应用矩母函数唯一性确定和的分布"),
        explanation: t(
          "Multiply the generating functions of the independent pieces, then recognize the product as the generating function of a known distribution. If the $X_i \\sim \\text{Exp}(\\lambda)$ are independent, the sum $S_n = \\sum_{i=1}^n X_i$ has MGF $\\left(\\frac{\\lambda}{\\lambda - t}\\right)^n$, which identifies the $\\text{Gamma}(n, \\lambda)$ distribution. For $12$ waits with rate $20$, $E[S] = \\frac{12}{20} = \\frac{3}{5}$.\n\n> **Watch out.** The mean of a $\\text{Gamma}(n, \\lambda)$ variable is $\\frac{n}{\\lambda}$, not $n\\lambda$: each exponential piece has mean $\\frac{1}{\\lambda}$. And $\\frac{n}{\\lambda^2}$ is the variance.",
          "把各个独立部分的矩母函数相乘，再认出这个乘积是某个已知分布的矩母函数。若独立随机变量 $X_i \\sim \\text{Exp}(\\lambda)$，则和 $S_n = \\sum_{i=1}^n X_i$ 的矩母函数为 $\\left(\\frac{\\lambda}{\\lambda - t}\\right)^n$，唯一对应 $\\text{Gamma}(n, \\lambda)$ 分布。对于速率为 $20$ 的 $12$ 段等待，$E[S] = \\frac{12}{20} = \\frac{3}{5}$。\n\n> **注意。** $\\text{Gamma}(n, \\lambda)$ 变量的均值是 $\\frac{n}{\\lambda}$，不是 $n\\lambda$：每个指数部分的均值是 $\\frac{1}{\\lambda}$。而 $\\frac{n}{\\lambda^2}$ 是方差。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(2, 10);
          const lambda = rng.int(2, 15);
          // E[S] = n / lambda
          const num = n;
          const den = lambda;
          const answer = Q.of(num, den);

          return numberProblem({
            prompt: t(
              `Let $X_1, \\dots, X_{${n}}$ be independent, identically distributed exponential random variables each with MGF $M(t) = \\frac{${lambda}}{${lambda} - t}$. By the uniqueness property of MGFs, their sum $S = \\sum_{i=1}^{${n}} X_i$ has MGF $M_S(t) = \\left( \\frac{${lambda}}{${lambda} - t} \\right)^{${n}}$. Find the mean $E[S]$.`,
              `设 $X_1, \\dots, X_{${n}}$ 为独立同分布的指数随机变量，各自的矩母函数为 $M(t) = \\frac{${lambda}}{${lambda} - t}$。由矩母函数唯一性定理，和 $S = \\sum_{i=1}^{${n}} X_i$ 的矩母函数为 $M_S(t) = \\left( \\frac{${lambda}}{${lambda} - t} \\right)^{${n}}$。求和的均值 $E[S]$。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(Q.of(1, lambda), `That is the mean of one piece; there are $${n}$ of them.`, `那是一个部分的均值；共有 $${n}$ 个部分。`),
              why(
                Q.of(n, lambda * lambda),
                "That is the variance $\\frac{n}{\\lambda^2}$, not the mean.",
                "那是方差 $\\frac{n}{\\lambda^2}$，不是均值。",
              ),
              why(
                n * lambda,
                "That multiplies by the rate; each piece has mean $\\frac{1}{\\lambda}$.",
                "那是乘以了速率；每个部分的均值是 $\\frac{1}{\\lambda}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Identify the distribution", "识别分布"],
                  t(
                    `$\\left( \\frac{${lambda}}{${lambda} - t} \\right)^{${n}}$ is the generating function of $\\text{Gamma}(${n}, ${lambda})$, so by uniqueness $S$ has that distribution.`,
                    `$\\left( \\frac{${lambda}}{${lambda} - t} \\right)^{${n}}$ 是 $\\text{Gamma}(${n}, ${lambda})$ 的矩母函数，所以由唯一性 $S$ 服从该分布。`,
                  ),
                ],
                [
                  ["Find the mean", "求均值"],
                  t(
                    `$E[S] = \\frac{n}{\\lambda} = \\frac{${n}}{${lambda}}${lowestTerms(n, lambda)}$.`,
                    `$E[S] = \\frac{n}{\\lambda} = \\frac{${n}}{${lambda}}${lowestTerms(n, lambda)}$。`,
                  ),
                ],
              ],
              t(
                `By linearity, $E[S] = ${n} \\cdot E[X_1] = ${n} \\cdot \\frac{1}{${lambda}} = \\frac{${n}}{${lambda}}$.`,
                `由线性性，$E[S] = ${n} \\cdot E[X_1] = ${n} \\cdot \\frac{1}{${lambda}} = \\frac{${n}}{${lambda}}$。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
