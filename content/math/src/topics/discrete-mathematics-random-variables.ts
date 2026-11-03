import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";

import { article, numberProblem } from "../problems.ts";
import { range } from "./methods-of-proof-common.ts";

// Discrete Mathematics unit 3, part 1: discrete random variables and their distributions.

/** choose is the binomial coefficient n choose k. */
function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

/** fact is n factorial. */
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));

/** qt writes a rational as LaTeX, as a decimal when it terminates within three places. */
const qt = (q: Q) => {
  try {
    const s = dec(q);
    return s.replace(/^-?\d+\.?/, "").length <= 3 ? s : q.toLatex();
  } catch {
    return q.toLatex();
  }
};

/** par puts negative numbers in parentheses. */
const par = (v: number) => (v < 0 ? `(${v})` : `${v}`);

/** Dist is a finite distribution: values with probabilities. */
interface Dist {
  readonly xs: readonly number[];
  readonly ps: readonly Q[];
}

/** randomDist builds a distribution on 3–5 distinct integers with probabilities in tenths, twentieths or twelfths. */
function randomDist(rng: Rng, lo = -2, hi = 6, k = rng.int(3, 5)): Dist {
  const xs = rng.sample(range(lo, hi), k).sort((a, b) => a - b);
  const D = rng.pick([10, 20, 12]);
  const cuts = rng.sample(range(1, D - 1), k - 1).sort((a, b) => a - b);
  const ws = [...cuts, D].map((c, i) => c - (i === 0 ? 0 : cuts[i - 1]!));
  return { xs, ps: ws.map((w) => Q.of(w, D)) };
}

/** distTable writes a distribution as a two-row table. */
const distTable = (d: Dist, v = "x", p = "P(X = x)") =>
  `| $${v}$ | ${d.xs.map((x) => `$${x}$`).join(" | ")} |\n| :---: |${d.xs.map(() => " :---: |").join("")}\n| $${p}$ | ${d.ps.map((q) => `$${qt(q)}$`).join(" | ")} |`;

/** distIntro introduces a distribution table. */
const distIntro = (d: Dist) => ({
  en: `The random variable $X$ has the distribution below.\n\n${distTable(d)}\n\n`,
  zh: `随机变量 $X$ 的分布如下表。\n\n${distTable(d)}\n\n`,
});

/** expect computes E(g(X)). */
const expect = (d: Dist, g: (x: number) => number = (x) => x) => d.xs.reduce((s, x, i) => s.add(Q.of(g(x)).mul(d.ps[i]!)), Q.of(0));

/** variance computes Var(X). */
const variance = (d: Dist) => expect(d, (x) => x * x).sub(expect(d).pow(2));

/** sumTex writes Σ g(x)·p as a sum of products. */
const sumTex = (d: Dist, g: (x: number) => string = (x) => par(x)) => d.xs.map((x, i) => `${g(x)} \\cdot ${qt(d.ps[i]!)}`).join(" + ");

/** probOf adds the probabilities of the values satisfying a condition. */
const probOf = (d: Dist, holds: (x: number) => boolean) => d.xs.reduce((s, x, i) => (holds(x) ? s.add(d.ps[i]!) : s), Q.of(0));

/** linTex writes aX + b. */
const linTex = (a: number, b: number, v = "X") =>
  `${a === 1 ? "" : a === -1 ? "-" : a}${v}${b === 0 ? "" : b > 0 ? ` + ${b}` : ` - ${-b}`}`;

/** oneToOneTransformationsOfDiscreteRandomVariables finds distributions of Y = aX + b. */
export const oneToOneTransformationsOfDiscreteRandomVariables: TopicDef = {
  id: "one-to-one-transformations-of-discrete-random-variables",
  title: t("One-to-One Transformations of Discrete Random Variables", "离散随机变量的一一变换"),
  summary: t(
    "If Y = g(X) for a one-to-one g, then each value y = g(x) carries exactly the probability of x: P(Y = g(x)) = P(X = x).",
    "若 Y = g(X) 且 g 是一一映射，则每个值 y = g(x) 恰好带有 x 的概率：P(Y = g(x)) = P(X = x)。",
  ),
  prerequisites: ["probability-mass-functions-of-discrete-random-variables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "probabilities-of-a-linear-transformation",
      title: t("Probabilities of Y = aX + b", "Y = aX + b 的概率"),
      explanation: t(
        "A linear transformation matches each value of the new variable with exactly one value of the old one, so their probabilities are equal. If $Y = 2X + 1$, then $Y = 7$ exactly when $X = 3$, so $P(Y = 7) = P(X = 3)$. Solve $y = g(x)$ for $x$ and read the table.",
        "线性变换使新变量的每个值恰好对应旧变量的一个值，所以它们的概率相等。若 $Y = 2X + 1$，则 $Y = 7$ 当且仅当 $X = 3$，所以 $P(Y = 7) = P(X = 3)$。由 $y = g(x)$ 解出 $x$ 再查表。",
      ),
      generate(rng) {
        const d = randomDist(rng);
        const a = rng.pick([-3, -2, 2, 3, 4]);
        const b = rng.int(-5, 5);
        const i = rng.int(0, d.xs.length - 1);
        const x = d.xs[i]!;
        const y = a * x + b;
        const intro = distIntro(d);
        const value = d.ps[i]!;
        const wrongX = d.xs.indexOf(y);
        return numberProblem({
          prompt: t(`${intro.en}Let $Y = ${linTex(a, b)}$. Find $P(Y = ${y})$.`, `${intro.zh}设 $Y = ${linTex(a, b)}$。求 $P(Y = ${y})$。`),
          answer: value,
          wrong: [wrongX >= 0 ? d.ps[wrongX]! : Q.of(0), ...d.ps.filter((_, j) => j !== i)],
          solution: t(
            `$${linTex(a, b, "x")} = ${y}$ gives $x = ${x}$, so $P(Y = ${y}) = P(X = ${x}) = ${qt(value)}$.`,
            `$${linTex(a, b, "x")} = ${y}$ 得 $x = ${x}$，所以 $P(Y = ${y}) = P(X = ${x}) = ${qt(value)}$。`,
          ),
        });
      },
    },
    {
      id: "events-of-a-linear-transformation",
      title: t("Events for Y = aX + b", "Y = aX + b 的事件"),
      explanation: t(
        "Rewrite the event about the new variable as an inequality about the old one, remembering to reverse the inequality when dividing by a negative number. With $Y = -2X + 3$: $Y > 0$ means $-2X + 3 > 0$, that is, $X < 1.5$. Dividing by a negative number reverses the inequality.",
        "把关于新变量的事件改写成关于旧变量的不等式，除以负数时记得改变不等号的方向。取 $Y = -2X + 3$：$Y > 0$ 即 $-2X + 3 > 0$，也就是 $X < 1.5$。除以负数时不等号要反向。",
      ),
      generate(rng) {
        const d = randomDist(rng);
        const a = rng.pick([-3, -2, 2, 3]);
        const b = rng.int(-6, 6);
        const ys = d.xs.map((x) => a * x + b);
        const c = rng.pick(ys.slice(0, -1).map((y, i) => (y + ys[i + 1]!) / 2));
        const cut = Math.round(c);
        const value = probOf(d, (x) => a * x + b > cut);
        const xs = d.xs.filter((x) => a * x + b > cut);
        const intro = distIntro(d);
        return numberProblem({
          prompt: t(
            `${intro.en}Let $Y = ${linTex(a, b)}$. Find $P(Y > ${cut})$.`,
            `${intro.zh}设 $Y = ${linTex(a, b)}$。求 $P(Y > ${cut})$。`,
          ),
          answer: value,
          wrong: [Q.of(1).sub(value), probOf(d, (x) => x > cut), probOf(d, (x) => a * x + b >= cut)],
          solution: t(
            `$Y > ${cut}$ holds for $x \\in \\{${xs.join(", ")}\\}$, so the probability is $${qt(value)}$.`,
            `$Y > ${cut}$ 对 $x \\in \\{${xs.join(", ")}\\}$ 成立，所以概率为 $${qt(value)}$。`,
          ),
        });
      },
    },
  ],
};

/** manyToOneTransformationsOfDiscreteRandomVariables adds probabilities of values with the same image. */
export const manyToOneTransformationsOfDiscreteRandomVariables: TopicDef = {
  id: "many-to-one-transformations-of-discrete-random-variables",
  title: t("Many-to-One Transformations of Discrete Random Variables", "离散随机变量的多对一变换"),
  summary: t(
    "If several values of X map to the same y, then P(Y = y) is the sum of their probabilities: P(Y = y) = Σ P(X = x) over all x with g(x) = y.",
    "若 X 的几个值映射到同一个 y，则 P(Y = y) 是它们的概率之和：P(Y = y) = Σ P(X = x)，对所有满足 g(x) = y 的 x 求和。",
  ),
  prerequisites: ["one-to-one-transformations-of-discrete-random-variables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "probabilities-of-squares-and-absolute-values",
      title: t("Probabilities of X² and |X|", "X² 与 |X| 的概率"),
      explanation: t(
        "Squaring or taking absolute values sends two opposite values to the same result, so add the probabilities of both values that produce it. If $Y = X^2$, then $Y = 4$ when $X = 2$ or $X = -2$: $P(Y = 4) = P(X = -2) + P(X = 2)$.",
        "平方或取绝对值会把两个相反的值映射到同一个结果，所以要把产生它的两个值的概率加起来。若 $Y = X^2$，则 $X = 2$ 或 $X = -2$ 时 $Y = 4$：$P(Y = 4) = P(X = -2) + P(X = 2)$。",
      ),
      generate(rng) {
        let d: Dist;
        let y: number;
        const kind = rng.int(0, 2);
        const g = [(x: number) => x * x, (x: number) => Math.abs(x), (x: number) => (x - 1) ** 2][kind]!;
        const gTex = ["X^2", "|X|", "(X - 1)^2"][kind]!;
        for (;;) {
          d = randomDist(rng, -3, 4, rng.int(4, 6));
          const images = d.xs.map(g);
          const repeated = images.filter((v, i) => images.indexOf(v) !== i);
          if (repeated.length > 0) {
            y = rng.pick(repeated);
            break;
          }
        }
        const xs = d.xs.filter((x) => g(x) === y);
        const value = probOf(d, (x) => g(x) === y);
        const intro = distIntro(d);
        return numberProblem({
          prompt: t(`${intro.en}Let $Y = ${gTex}$. Find $P(Y = ${y})$.`, `${intro.zh}设 $Y = ${gTex}$。求 $P(Y = ${y})$。`),
          answer: value,
          wrong: xs.map((x) => probOf(d, (u) => u === x)),
          solution: t(
            `$Y = ${y}$ when $X \\in \\{${xs.join(", ")}\\}$, so $P(Y = ${y}) = ${xs.map((x) => qt(probOf(d, (u) => u === x))).join(" + ")} = ${qt(value)}$.`,
            `当 $X \\in \\{${xs.join(", ")}\\}$ 时 $Y = ${y}$，所以 $P(Y = ${y}) = ${xs.map((x) => qt(probOf(d, (u) => u === x))).join(" + ")} = ${qt(value)}$。`,
          ),
        });
      },
    },
    {
      id: "cumulative-probabilities-of-many-to-one-transformations",
      title: t("Events for many-to-one transformations", "多对一变换的事件"),
      explanation: t(
        "Translate the event into the set of original values that satisfy it, which for a square is an interval centered at zero, and add their probabilities. With $Y = X^2$: $Y \\le 4$ means $-2 \\le X \\le 2$, so add the probabilities of all $x$ in that range.",
        "把事件转化为满足它的原始取值的集合，对平方来说这是一个以零为中心的区间，再把这些值的概率加起来。取 $Y = X^2$：$Y \\le 4$ 即 $-2 \\le X \\le 2$，所以把该范围内所有 $x$ 的概率相加。",
      ),
      generate(rng) {
        const d = randomDist(rng, -3, 4, rng.int(4, 6));
        const square = rng.bool();
        const g = (x: number) => (square ? x * x : Math.abs(x));
        const images = [...new Set(d.xs.map(g))].sort((a, b) => a - b);
        const c = rng.pick(images.slice(0, -1));
        const xs = d.xs.filter((x) => g(x) <= c);
        const value = probOf(d, (x) => g(x) <= c);
        const intro = distIntro(d);
        const gTex = square ? "X^2" : "|X|";
        return numberProblem({
          prompt: t(`${intro.en}Let $Y = ${gTex}$. Find $P(Y \\le ${c})$.`, `${intro.zh}设 $Y = ${gTex}$。求 $P(Y \\le ${c})$。`),
          answer: value,
          wrong: [probOf(d, (x) => x <= c), probOf(d, (x) => g(x) < c), Q.of(1).sub(value)],
          solution: t(
            `$Y \\le ${c}$ when $X \\in \\{${xs.join(", ")}\\}$, so $P(Y \\le ${c}) = ${qt(value)}$.`,
            `当 $X \\in \\{${xs.join(", ")}\\}$ 时 $Y \\le ${c}$，所以 $P(Y \\le ${c}) = ${qt(value)}$。`,
          ),
        });
      },
    },
  ],
};

/** propertiesOfExpectationForDiscreteRandomVariables uses linearity of expectation and E(g(X)). */
export const propertiesOfExpectationForDiscreteRandomVariables: TopicDef = {
  id: "properties-of-expectation-for-discrete-random-variables",
  title: t("Properties of Expectation for Discrete Random Variables", "离散随机变量期望的性质"),
  summary: t(
    "E(aX + b) = aE(X) + b and E(X + Y) = E(X) + E(Y); for any function g, E(g(X)) = Σ g(x)P(X = x).",
    "E(aX + b) = aE(X) + b，E(X + Y) = E(X) + E(Y)；对任意函数 g，E(g(X)) = Σ g(x)P(X = x)。",
  ),
  prerequisites: ["expected-values-of-discrete-random-variables", "one-to-one-transformations-of-discrete-random-variables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "linearity-of-expectation",
      title: t("Linearity of expectation", "期望的线性性"),
      explanation: t(
        "Expectation passes through sums and constant multiples, so the mean of a combination is the same combination of the means. If $E(X) = 4$ and $E(Y) = -1$, then $E(3X - 2Y + 5) = 3 \\cdot 4 - 2 \\cdot (-1) + 5 = 19$. No independence is needed.",
        "期望可以穿过和与常数倍，所以组合的均值等于各均值的同样组合。若 $E(X) = 4$，$E(Y) = -1$，则 $E(3X - 2Y + 5) = 3 \\cdot 4 - 2 \\cdot (-1) + 5 = 19$。这不需要独立性。",
      ),
      generate(rng) {
        const ex = rng.int(-6, 9);
        const ey = rng.int(-6, 9);
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const c = rng.int(-9, 9);
        const value = a * ex + b * ey + c;
        const expr = `${a === 1 ? "" : a === -1 ? "-" : a}X ${b > 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}Y${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
        return numberProblem({
          prompt: t(`$E(X) = ${ex}$ and $E(Y) = ${ey}$. Find $E(${expr})$.`, `$E(X) = ${ex}$，$E(Y) = ${ey}$。求 $E(${expr})$。`),
          answer: value,
          wrong: [a * ex + b * ey, value - 2 * c, ex + ey + c, a * a * ex + b * b * ey + c],
          solution: t(
            `$E(${expr}) = ${a} \\cdot ${par(ex)} + ${par(b)} \\cdot ${par(ey)} + ${par(c)} = ${value}$.`,
            `$E(${expr}) = ${a} \\cdot ${par(ex)} + ${par(b)} \\cdot ${par(ey)} + ${par(c)} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "expected-value-of-a-function",
      title: t("Expected value of g(X)", "g(X) 的期望"),
      explanation: t(
        "To find the mean of a function of a variable, apply the function to each value and weight the results by the original probabilities. Weight each value of $g(x)$ by $P(X = x)$: if $X$ is $-1, 0, 2$ with probabilities $0.2, 0.5, 0.3$, then $E(X^2) = 1 \\cdot 0.2 + 0 \\cdot 0.5 + 4 \\cdot 0.3 = 1.4$. In general $E(X^2) \\ne E(X)^2$.",
        "要求变量的函数的均值，就把函数作用在每个取值上，再用原来的概率对结果加权。用 $P(X = x)$ 对每个 $g(x)$ 加权：若 $X$ 取 $-1, 0, 2$ 的概率为 $0.2, 0.5, 0.3$，则 $E(X^2) = 1 \\cdot 0.2 + 0 \\cdot 0.5 + 4 \\cdot 0.3 = 1.4$。一般 $E(X^2) \\ne E(X)^2$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const d = randomDist(rng, kind === 2 ? 0 : -3, 5);
        const g = [(x: number) => x * x, (x: number) => Math.abs(x - 1), (x: number) => 2 ** x][kind]!;
        const gTex = ["X^2", "|X - 1|", "2^X"][kind]!;
        const gx = ["x^2", "|x - 1|", "2^x"][kind]!;
        const value = expect(d, g);
        const intro = distIntro(d);
        const show = (x: number) => (kind === 2 ? `2^{${x}}` : `${g(x)}`);
        return numberProblem({
          prompt: t(`${intro.en}Find $E(${gTex})$.`, `${intro.zh}求 $E(${gTex})$。`),
          answer: value,
          wrong: [
            kind === 0 ? expect(d).pow(2) : expect(d),
            Q.of(
              d.xs.map(g).reduce((a, b) => a + b, 0),
              d.xs.length,
            ),
            expect(d, (x) => g(x) + 1),
          ],
          solution: t(
            `$E(${gTex}) = \\sum ${gx} \\, P(X = x) = ${sumTex(d, show)} = ${qt(value)}$.`,
            `$E(${gTex}) = \\sum ${gx} \\, P(X = x) = ${sumTex(d, show)} = ${qt(value)}$。`,
          ),
        });
      },
    },
  ],
};

/** varianceOfDiscreteRandomVariables computes Var(X) = E(X²) − E(X)². */
export const varianceOfDiscreteRandomVariables: TopicDef = {
  id: "variance-of-discrete-random-variables",
  title: t("Variance of Discrete Random Variables", "离散随机变量的方差"),
  summary: t(
    "The variance Var(X) = E((X − μ)²) = E(X²) − E(X)² measures spread about the mean μ = E(X); the standard deviation is √Var(X).",
    "方差 Var(X) = E((X − μ)²) = E(X²) − E(X)² 度量围绕均值 μ = E(X) 的离散程度；标准差为 √Var(X)。",
  ),
  prerequisites: ["properties-of-expectation-for-discrete-random-variables", "variance-and-standard-deviation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "variance-from-a-distribution",
      title: t("Variance from a table", "由分布表求方差"),
      explanation: t(
        "The variance measures spread around the mean, and the shortcut computes it as the mean of the squares minus the square of the mean. For $X = 0, 1, 2$ with probabilities $0.3, 0.4, 0.3$: $E(X) = 1$ and $E(X^2) = 0.4 + 1.2 = 1.6$, so $\\operatorname{Var}(X) = 1.6 - 1^2 = 0.6$.",
        "方差衡量围绕均值的分散程度，简便方法是用平方的均值减去均值的平方。对取 $0, 1, 2$、概率为 $0.3, 0.4, 0.3$ 的 $X$：$E(X) = 1$，$E(X^2) = 0.4 + 1.2 = 1.6$，所以 $\\operatorname{Var}(X) = 1.6 - 1^2 = 0.6$。",
      ),
      generate(rng) {
        const d = randomDist(rng, -2, 5, rng.int(3, 4));
        const m = expect(d);
        const m2 = expect(d, (x) => x * x);
        const value = variance(d);
        const intro = distIntro(d);
        return numberProblem({
          prompt: t(`${intro.en}Find $\\operatorname{Var}(X)$.`, `${intro.zh}求 $\\operatorname{Var}(X)$。`),
          answer: value,
          wrong: [m2, m2.sub(m), m2.add(m.pow(2))],
          solution: t(
            `$E(X) = ${qt(m)}$ and $E(X^2) = ${qt(m2)}$, so $\\operatorname{Var}(X) = ${qt(m2)} - (${qt(m)})^2 = ${qt(value)}$.`,
            `$E(X) = ${qt(m)}$，$E(X^2) = ${qt(m2)}$，所以 $\\operatorname{Var}(X) = ${qt(m2)} - (${qt(m)})^2 = ${qt(value)}$。`,
          ),
        });
      },
    },
    {
      id: "second-moment-from-mean-and-variance",
      title: t("E(X²) from the mean and variance", "由均值与方差求 E(X²)"),
      explanation: t(
        "The mean of the square is always at least the square of the mean, and the variance is exactly the difference between them. Rearranging $\\operatorname{Var}(X) = E(X^2) - E(X)^2$ gives $E(X^2) = \\operatorname{Var}(X) + E(X)^2$. If $E(X) = 3$ and $\\operatorname{Var}(X) = 2$, then $E(X^2) = 11$.",
        "平方的均值总是不小于均值的平方，方差正好是两者之差。把 $\\operatorname{Var}(X) = E(X^2) - E(X)^2$ 变形得 $E(X^2) = \\operatorname{Var}(X) + E(X)^2$。若 $E(X) = 3$，$\\operatorname{Var}(X) = 2$，则 $E(X^2) = 11$。",
      ),
      generate(rng) {
        const m = rng.nonZero(-8, 12);
        const v = rng.int(1, 30);
        const sd = rng.bool(0.3);
        const value = v + m * m;
        return numberProblem({
          prompt: sd
            ? t(
                `$X$ has mean $${m}$ and standard deviation $\\sqrt{${v}}$. Find $E(X^2)$.`,
                `$X$ 的均值为 $${m}$，标准差为 $\\sqrt{${v}}$。求 $E(X^2)$。`,
              )
            : t(
                `$E(X) = ${m}$ and $\\operatorname{Var}(X) = ${v}$. Find $E(X^2)$.`,
                `$E(X) = ${m}$，$\\operatorname{Var}(X) = ${v}$。求 $E(X^2)$。`,
              ),
          answer: value,
          wrong: [v - m * m, v + m, v * v + m * m, m * m],
          solution: t(
            `$E(X^2) = \\operatorname{Var}(X) + E(X)^2 = ${v} + ${par(m)}^2 = ${value}$.`,
            `$E(X^2) = \\operatorname{Var}(X) + E(X)^2 = ${v} + ${par(m)}^2 = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** momentsOfDiscreteRandomVariables computes moments E(Xᵏ) and moments about a point. */
export const momentsOfDiscreteRandomVariables: TopicDef = {
  id: "moments-of-discrete-random-variables",
  title: t("Moments of Discrete Random Variables", "离散随机变量的矩"),
  summary: t(
    "The k-th moment of X is E(Xᵏ), and the k-th moment about c is E((X − c)ᵏ); the variance is the second moment about the mean.",
    "X 的 k 阶矩是 E(Xᵏ)，关于 c 的 k 阶矩是 E((X − c)ᵏ)；方差是关于均值的二阶矩。",
  ),
  prerequisites: ["variance-of-discrete-random-variables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "higher-moments-from-a-distribution",
      title: t("Higher moments", "高阶矩"),
      explanation: t(
        "Higher moments weight each value raised to a power by its probability, and they describe features of the shape such as skewness. For $X = -1, 1, 2$ with probabilities $0.5, 0.3, 0.2$: $E(X^3) = -1 \\cdot 0.5 + 1 \\cdot 0.3 + 8 \\cdot 0.2 = 1.4$.",
        "高阶矩用概率对每个取值的幂加权，它们描述分布形状的特征，例如偏度。对取 $-1, 1, 2$、概率为 $0.5, 0.3, 0.2$ 的 $X$：$E(X^3) = -1 \\cdot 0.5 + 1 \\cdot 0.3 + 8 \\cdot 0.2 = 1.4$。",
      ),
      generate(rng) {
        const d = randomDist(rng, -2, 3, 3);
        const k = rng.int(3, 4);
        const value = expect(d, (x) => x ** k);
        const intro = distIntro(d);
        return numberProblem({
          prompt: t(`${intro.en}Find the moment $E(X^{${k}})$.`, `${intro.zh}求矩 $E(X^{${k}})$。`),
          answer: value,
          wrong: [expect(d).pow(k), expect(d, (x) => x ** (k - 1)), expect(d, (x) => Math.abs(x) ** k)],
          solution: t(
            `$E(X^{${k}}) = ${sumTex(d, (x) => `${par(x)}^{${k}}`)} = ${qt(value)}$.`,
            `$E(X^{${k}}) = ${sumTex(d, (x) => `${par(x)}^{${k}}`)} = ${qt(value)}$。`,
          ),
        });
      },
    },
    {
      id: "second-moments-about-a-point",
      title: t("Second moments about a point", "关于某点的二阶矩"),
      explanation: t(
        "The average squared distance from a point is the variance plus the squared distance from the point to the mean, so it is smallest at the mean. Expanding, $E((X - c)^2) = \\operatorname{Var}(X) + (\\mu - c)^2$: the second moment about $c$ is smallest when $c = \\mu$. If $\\mu = 5$, $\\operatorname{Var}(X) = 3$, then $E((X - 2)^2) = 3 + 9 = 12$.",
        "到一点的平均平方距离等于方差加上该点到均值距离的平方，所以在均值处最小。展开得 $E((X - c)^2) = \\operatorname{Var}(X) + (\\mu - c)^2$：关于 $c$ 的二阶矩在 $c = \\mu$ 时最小。若 $\\mu = 5$，$\\operatorname{Var}(X) = 3$，则 $E((X - 2)^2) = 3 + 9 = 12$。",
      ),
      generate(rng) {
        const m = rng.int(-5, 9);
        const v = rng.int(1, 20);
        let c: number;
        do c = rng.int(-6, 10);
        while (c === m || c === 0);
        const value = v + (m - c) ** 2;
        return numberProblem({
          prompt: t(
            `$E(X) = ${m}$ and $\\operatorname{Var}(X) = ${v}$. Find $E((X ${c > 0 ? "-" : "+"} ${Math.abs(c)})^2)$.`,
            `$E(X) = ${m}$，$\\operatorname{Var}(X) = ${v}$。求 $E((X ${c > 0 ? "-" : "+"} ${Math.abs(c)})^2)$。`,
          ),
          answer: value,
          wrong: [v, v + c * c, (m - c) ** 2, v - (m - c) ** 2],
          solution: t(
            `$E((X - c)^2) = \\operatorname{Var}(X) + (\\mu - c)^2 = ${v} + (${m} - ${par(c)})^2 = ${value}$.`,
            `$E((X - c)^2) = \\operatorname{Var}(X) + (\\mu - c)^2 = ${v} + (${m} - ${par(c)})^2 = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** propertiesOfVarianceForDiscreteRandomVariables uses Var(aX + b) = a²Var(X) and additivity for independent variables. */
export const propertiesOfVarianceForDiscreteRandomVariables: TopicDef = {
  id: "properties-of-variance-for-discrete-random-variables",
  title: t("Properties of Variance for Discrete Random Variables", "离散随机变量方差的性质"),
  summary: t(
    "Var(aX + b) = a²Var(X): shifting does not change spread and scaling multiplies it by a². For independent X and Y, Var(aX + bY) = a²Var(X) + b²Var(Y).",
    "Var(aX + b) = a²Var(X)：平移不改变离散程度，伸缩使其乘以 a²。对相互独立的 X 与 Y，Var(aX + bY) = a²Var(X) + b²Var(Y)。",
  ),
  prerequisites: ["variance-of-discrete-random-variables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "variance-of-a-linear-transformation",
      title: t("Variance of aX + b", "aX + b 的方差"),
      explanation: t(
        "Adding a constant shifts every value equally and does not change the spread, while multiplying by a constant scales the variance by its square. If $\\operatorname{Var}(X) = 4$, then $\\operatorname{Var}(-3X + 7) = (-3)^2 \\cdot 4 = 36$, and the standard deviation of $-3X + 7$ is $|-3| \\cdot 2 = 6$.",
        "加上一个常数使每个值平移相同的量，不改变分散程度；而乘以常数会使方差乘以该常数的平方。若 $\\operatorname{Var}(X) = 4$，则 $\\operatorname{Var}(-3X + 7) = (-3)^2 \\cdot 4 = 36$，$-3X + 7$ 的标准差为 $|-3| \\cdot 2 = 6$。",
      ),
      generate(rng) {
        const v = rng.int(1, 12);
        const a = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const b = rng.nonZero(-9, 9);
        const value = a * a * v;
        return numberProblem({
          prompt: t(
            `$\\operatorname{Var}(X) = ${v}$. Find $\\operatorname{Var}(${linTex(a, b)})$.`,
            `$\\operatorname{Var}(X) = ${v}$。求 $\\operatorname{Var}(${linTex(a, b)})$。`,
          ),
          answer: value,
          wrong: [a * v, a * v + b, value + b, Math.abs(a) * v],
          solution: t(
            `$\\operatorname{Var}(${linTex(a, b)}) = ${par(a)}^2 \\cdot ${v} = ${value}$; adding $${b}$ does not change the variance.`,
            `$\\operatorname{Var}(${linTex(a, b)}) = ${par(a)}^2 \\cdot ${v} = ${value}$；加上 $${b}$ 不改变方差。`,
          ),
        });
      },
    },
    {
      id: "variance-of-sums-of-independent-variables",
      title: t("Variance of sums", "和的方差"),
      explanation: t(
        "For independent variables, variances add even when the variables are subtracted, because the coefficients are squared and squares are never negative. For independent $X, Y$ with variances $2$ and $5$: $\\operatorname{Var}(3X - Y) = 9 \\cdot 2 + 1 \\cdot 5 = 23$. Variances add even when the variables are subtracted.",
        "对于独立变量，即使变量相减，方差也相加，因为系数要平方，而平方永远不会是负的。对相互独立、方差分别为 $2$ 和 $5$ 的 $X, Y$：$\\operatorname{Var}(3X - Y) = 9 \\cdot 2 + 1 \\cdot 5 = 23$。即使变量相减，方差也相加。",
      ),
      generate(rng) {
        const vx = rng.int(1, 10);
        const vy = rng.int(1, 10);
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const value = a * a * vx + b * b * vy;
        const expr = `${a === 1 ? "" : a === -1 ? "-" : a}X ${b > 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}Y`;
        return numberProblem({
          prompt: t(
            `$X$ and $Y$ are independent with $\\operatorname{Var}(X) = ${vx}$ and $\\operatorname{Var}(Y) = ${vy}$. Find $\\operatorname{Var}(${expr})$.`,
            `$X$ 与 $Y$ 相互独立，$\\operatorname{Var}(X) = ${vx}$，$\\operatorname{Var}(Y) = ${vy}$。求 $\\operatorname{Var}(${expr})$。`,
          ),
          answer: value,
          wrong: [a * a * vx - b * b * vy, a * vx + b * vy, vx + vy, Math.abs(a * vx) + Math.abs(b * vy)],
          solution: t(
            `By independence, $\\operatorname{Var}(${expr}) = ${par(a)}^2 \\cdot ${vx} + ${par(b)}^2 \\cdot ${vy} = ${value}$.`,
            `由独立性，$\\operatorname{Var}(${expr}) = ${par(a)}^2 \\cdot ${vx} + ${par(b)}^2 \\cdot ${vy} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** theDiscreteUniformDistribution gives each of n consecutive integers probability 1/n. */
export const theDiscreteUniformDistribution: TopicDef = {
  id: "the-discrete-uniform-distribution",
  title: t("The Discrete Uniform Distribution", "离散均匀分布"),
  summary: t(
    "X is uniform on {a, a + 1, …, b} when each of the n = b − a + 1 values has probability 1/n; the probability of an event is the number of its values over n.",
    "若 {a, a + 1, …, b} 中 n = b − a + 1 个值的概率都是 1/n，则 X 在其上服从均匀分布；事件的概率等于它包含的值的个数除以 n。",
  ),
  prerequisites: ["probability-mass-functions-of-discrete-random-variables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "uniform-probabilities-of-intervals",
      title: t("Probabilities of intervals", "区间的概率"),
      explanation: t(
        "Every value of a discrete uniform variable is equally likely, so a probability is the number of favorable values divided by the total number of values. If $X$ is uniform on $\\{1, \\dots, 20\\}$, then $P(5 \\le X < 9) = \\frac{4}{20} = \\frac{1}{5}$: the values $5, 6, 7, 8$. Count carefully at the endpoints.",
        "离散均匀变量的每个值都同样可能，所以概率等于有利取值的个数除以取值的总数。若 $X$ 在 $\\{1, \\dots, 20\\}$ 上服从均匀分布，则 $P(5 \\le X < 9) = \\frac{4}{20} = \\frac{1}{5}$：取值 $5, 6, 7, 8$。注意端点的计数。",
      ),
      generate(rng) {
        const a = rng.int(0, 5);
        const b = a + rng.int(7, 30);
        const n = b - a + 1;
        const lo = rng.int(a + 1, b - 3);
        const hi = rng.int(lo + 1, b - 1);
        const [l, r] = [rng.bool(), rng.bool()];
        const count = hi - lo + 1 - (l ? 0 : 1) - (r ? 0 : 1);
        const value = Q.of(count, n);
        return numberProblem({
          prompt: t(
            `$X$ is uniformly distributed on $\\{${a}, ${a + 1}, \\dots, ${b}\\}$. Find $P(${lo} ${l ? "\\le" : "<"} X ${r ? "\\le" : "<"} ${hi})$.`,
            `$X$ 在 $\\{${a}, ${a + 1}, \\dots, ${b}\\}$ 上服从均匀分布。求 $P(${lo} ${l ? "\\le" : "<"} X ${r ? "\\le" : "<"} ${hi})$。`,
          ),
          answer: value,
          wrong: [Q.of(hi - lo, n), Q.of(hi - lo + 1, n), Q.of(count, b - a), Q.of(count + 1, n)],
          solution: t(
            `There are $${n}$ equally likely values, and $${count}$ of them satisfy the inequality: $\\frac{${count}}{${n}}${value.toLatex() === `\\frac{${count}}{${n}}` ? "" : ` = ${value.toLatex()}`}$.`,
            `共有 $${n}$ 个等可能的值，其中 $${count}$ 个满足不等式：$\\frac{${count}}{${n}}${value.toLatex() === `\\frac{${count}}{${n}}` ? "" : ` = ${value.toLatex()}`}$。`,
          ),
        });
      },
    },
    {
      id: "uniform-probabilities-of-divisibility",
      title: t("Probabilities of divisibility", "整除的概率"),
      explanation: t(
        "Count the multiples in the range by dividing its end by the divisor and rounding down, then divide by the number of values. If $X$ is uniform on $\\{1, \\dots, 50\\}$, the multiples of $3$ are $3, 6, \\dots, 48$, that is, $\\lfloor 50/3 \\rfloor = 16$ values: $P(3 \\mid X) = \\frac{16}{50} = \\frac{8}{25}$.",
        "用区间的终点除以除数并向下取整来数出范围内的倍数，再除以取值的总数。若 $X$ 在 $\\{1, \\dots, 50\\}$ 上服从均匀分布，$3$ 的倍数是 $3, 6, \\dots, 48$，即 $\\lfloor 50/3 \\rfloor = 16$ 个值：$P(3 \\mid X) = \\frac{16}{50} = \\frac{8}{25}$。",
      ),
      generate(rng) {
        const b = rng.int(20, 100);
        const m = rng.int(3, 9);
        const count = Math.floor(b / m);
        const value = Q.of(count, b);
        return numberProblem({
          prompt: t(
            `$X$ is uniformly distributed on $\\{1, 2, \\dots, ${b}\\}$. Find the probability that $X$ is a multiple of $${m}$.`,
            `$X$ 在 $\\{1, 2, \\dots, ${b}\\}$ 上服从均匀分布。求 $X$ 是 $${m}$ 的倍数的概率。`,
          ),
          answer: value,
          wrong: [Q.of(1, m), Q.of(count + 1, b), Q.of(count, b - 1)],
          solution: t(
            `The multiples of $${m}$ up to $${b}$ number $\\lfloor ${b} / ${m} \\rfloor = ${count}$, so the probability is $\\frac{${count}}{${b}}${value.toLatex() === `\\frac{${count}}{${b}}` ? "" : ` = ${value.toLatex()}`}$.`,
            `不超过 $${b}$ 的 $${m}$ 的倍数有 $\\lfloor ${b} / ${m} \\rfloor = ${count}$ 个，所以概率为 $\\frac{${count}}{${b}}${value.toLatex() === `\\frac{${count}}{${b}}` ? "" : ` = ${value.toLatex()}`}$。`,
          ),
        });
      },
    },
  ],
};

/** uniformVar is the variance of the uniform distribution on n consecutive integers. */
const uniformVar = (n: number) => Q.of(n * n - 1, 12);

/** meanAndVarianceOfTheDiscreteUniformDistribution uses E(X) = (a + b)/2 and Var(X) = (n² − 1)/12. */
export const meanAndVarianceOfTheDiscreteUniformDistribution: TopicDef = {
  id: "mean-and-variance-of-the-discrete-uniform-distribution",
  title: t("Mean and Variance of the Discrete Uniform Distribution", "离散均匀分布的均值与方差"),
  summary: t(
    "If X is uniform on {a, …, b} with n = b − a + 1 values, then E(X) = (a + b)/2 and Var(X) = (n² − 1)/12.",
    "若 X 在 {a, …, b} 上服从均匀分布，共 n = b − a + 1 个值，则 E(X) = (a + b)/2，Var(X) = (n² − 1)/12。",
  ),
  prerequisites: ["the-discrete-uniform-distribution", "variance-of-discrete-random-variables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "mean-of-a-discrete-uniform-distribution",
      title: t("The mean", "均值"),
      explanation: t(
        "The values are evenly spaced and equally likely, so they balance at the midpoint between the smallest and the largest. By symmetry the mean is the midpoint: uniform on $\\{4, \\dots, 17\\}$ has $E(X) = \\frac{4 + 17}{2} = 10.5$.",
        "这些取值等间隔且同样可能，所以它们在最小值和最大值的中点处平衡。由对称性，均值就是中点：在 $\\{4, \\dots, 17\\}$ 上均匀分布时 $E(X) = \\frac{4 + 17}{2} = 10.5$。",
      ),
      generate(rng) {
        const a = rng.int(-10, 20);
        const b = a + rng.int(4, 40);
        const value = Q.of(a + b, 2);
        return numberProblem({
          prompt: t(
            `$X$ is uniformly distributed on $\\{${a}, ${a + 1}, \\dots, ${b}\\}$. Find $E(X)$.`,
            `$X$ 在 $\\{${a}, ${a + 1}, \\dots, ${b}\\}$ 上服从均匀分布。求 $E(X)$。`,
          ),
          answer: value,
          wrong: [Q.of(b - a, 2), Q.of(b - a + 1, 2), Q.of(a + b + 1, 2)],
          solution: t(`$E(X) = \\frac{${a} + ${par(b)}}{2} = ${qt(value)}$.`, `$E(X) = \\frac{${a} + ${par(b)}}{2} = ${qt(value)}$。`),
        });
      },
    },
    {
      id: "variance-of-a-discrete-uniform-distribution",
      title: t("The variance", "方差"),
      explanation: t(
        "A fair die is uniform on $\\{1, \\dots, 6\\}$, so $\\operatorname{Var}(X) = \\frac{6^2 - 1}{12} = \\frac{35}{12}$. The variance depends only on $n$, not on where the values start.",
        "均匀的骰子在 $\\{1, \\dots, 6\\}$ 上均匀分布，所以 $\\operatorname{Var}(X) = \\frac{6^2 - 1}{12} = \\frac{35}{12}$。方差只取决于 $n$，与取值从哪里开始无关。",
      ),
      generate(rng) {
        const a = rng.int(-10, 20);
        const n = rng.int(3, 30);
        const b = a + n - 1;
        const value = uniformVar(n);
        return numberProblem({
          prompt: t(
            `$X$ is uniformly distributed on $\\{${a}, ${a + 1}, \\dots, ${b}\\}$. Find $\\operatorname{Var}(X)$.`,
            `$X$ 在 $\\{${a}, ${a + 1}, \\dots, ${b}\\}$ 上服从均匀分布。求 $\\operatorname{Var}(X)$。`,
          ),
          answer: value,
          wrong: [Q.of(n * n, 12), Q.of(n * n - 1, 6), Q.of((n - 1) ** 2 - 1, 12), Q.of(b * b - 1, 12)],
          solution: t(
            `There are $n = ${n}$ values, so $\\operatorname{Var}(X) = \\frac{${n}^2 - 1}{12} = ${qt(value)}$.`,
            `共有 $n = ${n}$ 个值，所以 $\\operatorname{Var}(X) = \\frac{${n}^2 - 1}{12} = ${qt(value)}$。`,
          ),
        });
      },
    },
  ],
};

/** UniformStory is a context with a uniform random number. */
interface UniformStory {
  readonly n: number;
  readonly en: string;
  readonly zh: string;
}

/** uniformStory picks a context for a uniform variable on {1, …, n}. */
const uniformStory = (rng: Rng): UniformStory => {
  const n = rng.pick([6, 8, 10, 12, 20, 25, 30, 50, 100]);
  return rng.pick([
    { n, en: `A fair ${n}-sided die, numbered $1$ to $${n}$, is rolled`, zh: `掷一枚标有 $1$ 到 $${n}$ 的均匀 ${n} 面骰子` },
    { n, en: `A ticket is drawn at random from tickets numbered $1$ to $${n}$`, zh: `从编号 $1$ 到 $${n}$ 的彩票中随机抽一张` },
    { n, en: `A computer picks a whole number from $1$ to $${n}$, each equally likely`, zh: `计算机从 $1$ 到 $${n}$ 中等可能地选一个整数` },
  ]);
};

/** modelingWithDiscreteUniformDistributions applies uniform distributions in context. */
export const modelingWithDiscreteUniformDistributions: TopicDef = {
  id: "modeling-with-discrete-uniform-distributions",
  title: t("Modeling With Discrete Uniform Distributions", "用离散均匀分布建模"),
  summary: t(
    "Dice, lottery tickets and random number generators give uniform distributions; combine their probabilities, means and variances with linear payouts.",
    "骰子、彩票、随机数生成器等都给出均匀分布；结合线性收益计算它们的概率、均值与方差。",
  ),
  prerequisites: ["mean-and-variance-of-the-discrete-uniform-distribution", "properties-of-variance-for-discrete-random-variables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "expected-payout-of-a-uniform-game",
      title: t("Expected payouts", "期望收益"),
      explanation: t(
        "The payout is a linear function of the outcome, so its mean is the same linear function applied to the mean outcome. A die numbered $1$ to $6$ pays $3X - 5$ dollars. $E(X) = 3.5$, so the expected payout is $3 \\cdot 3.5 - 5 = 5.5$ dollars.",
        "收益是结果的一次函数，所以它的均值就是把同样的一次函数作用于结果的均值。掷一枚 $1$ 到 $6$ 的骰子，收益为 $3X - 5$ 元。$E(X) = 3.5$，所以期望收益为 $3 \\cdot 3.5 - 5 = 5.5$ 元。",
      ),
      generate(rng) {
        const s = uniformStory(rng);
        const a = rng.int(2, 5);
        const b = rng.int(1, 3 * s.n);
        const value = Q.of(a * (s.n + 1) - 2 * b, 2);
        return numberProblem({
          prompt: t(
            `${s.en}, and the result $X$ pays $${a}X - ${b}$ dollars. Find the expected payout.`,
            `${s.zh}，结果 $X$ 带来 $${a}X - ${b}$ 元的收益。求期望收益。`,
          ),
          answer: value,
          wrong: [Q.of(a * s.n - 2 * b, 2), Q.of(a * (s.n + 1), 2), Q.of(a * s.n - b)],
          solution: t(
            `$E(X) = \\frac{1 + ${s.n}}{2} = ${qt(Q.of(s.n + 1, 2))}$, so the expected payout is $${a} \\cdot ${qt(Q.of(s.n + 1, 2))} - ${b} = ${qt(value)}$ dollars.`,
            `$E(X) = \\frac{1 + ${s.n}}{2} = ${qt(Q.of(s.n + 1, 2))}$，所以期望收益为 $${a} \\cdot ${qt(Q.of(s.n + 1, 2))} - ${b} = ${qt(value)}$ 元。`,
          ),
        });
      },
    },
    {
      id: "variance-of-a-uniform-payout",
      title: t("Variance of payouts", "收益的方差"),
      explanation: t(
        "Adding a constant does not change the spread of the payout, while the multiplier scales the variance by its square. A die numbered $1$ to $6$ pays $2X + 1$: $\\operatorname{Var}(2X + 1) = 4 \\cdot \\frac{35}{12} = \\frac{35}{3}$.",
        "加上一个常数不会改变收益的分散程度，而乘数会使方差乘以它的平方。掷一枚 $1$ 到 $6$ 的骰子，收益为 $2X + 1$：$\\operatorname{Var}(2X + 1) = 4 \\cdot \\frac{35}{12} = \\frac{35}{3}$。",
      ),
      generate(rng) {
        const s = uniformStory(rng);
        const a = rng.int(2, 6);
        const b = rng.int(1, 20);
        const value = uniformVar(s.n).mul(Q.of(a * a));
        return numberProblem({
          prompt: t(
            `${s.en}, and the result $X$ pays $${a}X + ${b}$ dollars. Find the variance of the payout.`,
            `${s.zh}，结果 $X$ 带来 $${a}X + ${b}$ 元的收益。求收益的方差。`,
          ),
          answer: value,
          wrong: [
            uniformVar(s.n).mul(Q.of(a)),
            uniformVar(s.n)
              .mul(Q.of(a * a))
              .add(Q.of(b)),
            uniformVar(s.n),
          ],
          solution: t(
            `$\\operatorname{Var}(X) = \\frac{${s.n}^2 - 1}{12}$, so $\\operatorname{Var}(${a}X + ${b}) = ${a}^2 \\cdot \\frac{${s.n * s.n - 1}}{12} = ${qt(value)}$.`,
            `$\\operatorname{Var}(X) = \\frac{${s.n}^2 - 1}{12}$，所以 $\\operatorname{Var}(${a}X + ${b}) = ${a}^2 \\cdot \\frac{${s.n * s.n - 1}}{12} = ${qt(value)}$。`,
          ),
        });
      },
    },
  ],
};

/** PS are success probabilities for Bernoulli-type problems. */
const PS: readonly Q[] = [
  Q.of(1, 2),
  Q.of(1, 3),
  Q.of(2, 3),
  Q.of(1, 4),
  Q.of(3, 4),
  Q.of(1, 5),
  Q.of(2, 5),
  Q.of(3, 5),
  Q.of(1, 6),
  Q.of(5, 6),
  Q.of(3, 10),
  Q.of(7, 10),
  Q.of(1, 10),
];

/** BernoulliStory is an event giving a Bernoulli variable. */
interface BernoulliStory {
  readonly p: Q;
  readonly en: string;
  readonly zh: string;
}

/** bernoulliStory picks an experiment whose success probability is clear. */
function bernoulliStory(rng: Rng): BernoulliStory {
  const kind = rng.int(0, 2);
  if (kind === 0) {
    const k = rng.int(1, 5);
    return { p: Q.of(k, 6), en: `a fair die shows at most $${k}$`, zh: `均匀骰子的点数不超过 $${k}$` };
  }
  if (kind === 1) {
    const r = rng.int(1, 9);
    const b = rng.int(1, 9);
    return {
      p: Q.of(r, r + b),
      en: `a ball drawn from a bag of $${r}$ red and $${b}$ blue balls is red`,
      zh: `从装有 $${r}$ 个红球和 $${b}$ 个蓝球的袋中摸出的球是红球`,
    };
  }
  const n = rng.pick([10, 20, 52]);
  const k = n === 52 ? rng.pick([4, 13, 12, 26]) : rng.int(1, n - 1);
  return n === 52
    ? {
        p: Q.of(k, 52),
        en: `a card drawn from a standard deck is ${{ 4: "an ace", 13: "a heart", 12: "a face card", 26: "red" }[k]}`,
        zh: `从一副标准扑克牌中抽出的牌是${{ 4: "A", 13: "红桃", 12: "人头牌", 26: "红色" }[k]}`,
      }
    : {
        p: Q.of(k, n),
        en: `a whole number chosen uniformly from $1$ to $${n}$ is at most $${k}$`,
        zh: `从 $1$ 到 $${n}$ 中均匀选出的整数不超过 $${k}$`,
      };
}

/** theBernoulliDistribution models one trial with success probability p. */
export const theBernoulliDistribution: TopicDef = {
  id: "the-bernoulli-distribution",
  title: t("The Bernoulli Distribution", "伯努利分布"),
  summary: t(
    "X ~ Bernoulli(p) takes the value 1 (success) with probability p and 0 (failure) with probability 1 − p: P(X = x) = pˣ(1 − p)¹⁻ˣ for x ∈ {0, 1}.",
    "X ~ Bernoulli(p) 以概率 p 取值 1（成功），以概率 1 − p 取值 0（失败）：P(X = x) = pˣ(1 − p)¹⁻ˣ，x ∈ {0, 1}。",
  ),
  prerequisites: ["probability-mass-functions-of-discrete-random-variables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "bernoulli-indicators-of-events",
      title: t("Indicators of events", "事件的示性变量"),
      explanation: t(
        "Any event gives a Bernoulli variable that equals one when the event happens, and its parameter is the probability of the event. Let $X = 1$ if a fair die shows at most $2$ and $X = 0$ otherwise. Then $X \\sim \\operatorname{Bernoulli}(\\frac{1}{3})$ and $P(X = 0) = \\frac{2}{3}$.",
        "任何事件都给出一个伯努利变量，事件发生时取 1，它的参数就是事件发生的概率。若均匀骰子点数不超过 $2$ 则令 $X = 1$，否则 $X = 0$。于是 $X \\sim \\operatorname{Bernoulli}(\\frac{1}{3})$，$P(X = 0) = \\frac{2}{3}$。",
      ),
      generate(rng) {
        const s = bernoulliStory(rng);
        const x = rng.int(0, 1);
        const value = x === 1 ? s.p : Q.of(1).sub(s.p);
        return numberProblem({
          prompt: t(
            `Let $X = 1$ if ${s.en}, and $X = 0$ otherwise. Find $P(X = ${x})$.`,
            `若${s.zh}，则令 $X = 1$，否则 $X = 0$。求 $P(X = ${x})$。`,
          ),
          answer: value,
          wrong: [Q.of(1).sub(value), Q.of(1, 2)],
          solution: t(
            `$X \\sim \\operatorname{Bernoulli}(${s.p.toLatex()})$, so $P(X = ${x}) = ${value.toLatex()}$.`,
            `$X \\sim \\operatorname{Bernoulli}(${s.p.toLatex()})$，所以 $P(X = ${x}) = ${value.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "bernoulli-parameter-from-odds",
      title: t("Finding the parameter", "求参数"),
      explanation: t(
        "The probabilities of success and failure must add to one, so a stated ratio between them gives a single equation for the parameter. If success is $3$ times as likely as failure, then $p = 3(1 - p)$, so $p = \\frac{3}{4}$.",
        "成功和失败的概率之和必须为 1，所以给定它们之间的比就得到关于参数的一个方程。若成功的可能性是失败的 $3$ 倍，则 $p = 3(1 - p)$，所以 $p = \\frac{3}{4}$。",
      ),
      generate(rng) {
        const k = Q.of(rng.int(1, 9), rng.int(1, 5));
        const value = k.div(k.add(Q.of(1)));
        return numberProblem({
          prompt: t(
            `$X \\sim \\operatorname{Bernoulli}(p)$ and $P(X = 1) = ${k.eq(Q.of(1)) ? "" : `${k.toLatex()} \\, `}P(X = 0)$. Find $p$.`,
            `$X \\sim \\operatorname{Bernoulli}(p)$，且 $P(X = 1) = ${k.eq(Q.of(1)) ? "" : `${k.toLatex()} \\, `}P(X = 0)$。求 $p$。`,
          ),
          answer: value,
          wrong: [Q.of(1).div(k.add(Q.of(1))), k.div(k.add(Q.of(2))), k.isInteger() ? Q.of(1).div(k) : k],
          solution: t(
            `$p = ${k.toLatex()}(1 - p)$, so $p = \\frac{${k.toLatex()}}{1 + ${k.toLatex()}} = ${value.toLatex()}$.`,
            `$p = ${k.toLatex()}(1 - p)$，所以 $p = \\frac{${k.toLatex()}}{1 + ${k.toLatex()}} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** meanAndVarianceOfTheBernoulliDistribution uses E(X) = p and Var(X) = p(1 − p). */
export const meanAndVarianceOfTheBernoulliDistribution: TopicDef = {
  id: "mean-and-variance-of-the-bernoulli-distribution",
  title: t("Mean and Variance of the Bernoulli Distribution", "伯努利分布的均值与方差"),
  summary: t(
    "If X ~ Bernoulli(p), then X² = X, so E(X) = E(X²) = p and Var(X) = p − p² = p(1 − p), largest at p = 1/2.",
    "若 X ~ Bernoulli(p)，则 X² = X，所以 E(X) = E(X²) = p，Var(X) = p − p² = p(1 − p)，在 p = 1/2 时最大。",
  ),
  prerequisites: ["the-bernoulli-distribution", "variance-of-discrete-random-variables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "variance-of-a-bernoulli-variable",
      title: t("The variance", "方差"),
      explanation: t(
        "A Bernoulli variable takes only the values zero and one, so its square equals itself, and the variance is the success probability times the failure probability. For $X \\sim \\operatorname{Bernoulli}(0.3)$: $E(X) = 0.3$ and $\\operatorname{Var}(X) = 0.3 \\cdot 0.7 = 0.21$.",
        "伯努利变量只取 0 和 1，所以它的平方等于它自己，方差就是成功概率乘以失败概率。对 $X \\sim \\operatorname{Bernoulli}(0.3)$：$E(X) = 0.3$，$\\operatorname{Var}(X) = 0.3 \\cdot 0.7 = 0.21$。",
      ),
      generate(rng) {
        const s = bernoulliStory(rng);
        const value = s.p.mul(Q.of(1).sub(s.p));
        return numberProblem({
          prompt: t(
            `Let $X = 1$ if ${s.en}, and $X = 0$ otherwise. Find $\\operatorname{Var}(X)$.`,
            `若${s.zh}，则令 $X = 1$，否则 $X = 0$。求 $\\operatorname{Var}(X)$。`,
          ),
          answer: value,
          wrong: [s.p, s.p.pow(2), Q.of(1).sub(s.p)],
          solution: t(
            `$p = ${s.p.toLatex()}$, so $\\operatorname{Var}(X) = p(1 - p) = ${s.p.toLatex()} \\cdot ${Q.of(1).sub(s.p).toLatex()} = ${value.toLatex()}$.`,
            `$p = ${s.p.toLatex()}$，所以 $\\operatorname{Var}(X) = p(1 - p) = ${s.p.toLatex()} \\cdot ${Q.of(1).sub(s.p).toLatex()} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "bernoulli-parameter-from-the-variance",
      title: t("The parameter from the variance", "由方差求参数"),
      explanation: t(
        "The variance equation is a quadratic in the parameter with two symmetric solutions, so extra information is needed to choose between them. If $\\operatorname{Var}(X) = \\frac{6}{25}$ and $p < \\frac{1}{2}$, solve $p(1 - p) = \\frac{6}{25}$: $p = \\frac{2}{5}$ or $\\frac{3}{5}$, so $p = \\frac{2}{5}$.",
        "方差方程是关于参数的二次方程，有两个对称的解，所以需要额外的信息来在两者之间选择。若 $\\operatorname{Var}(X) = \\frac{6}{25}$ 且 $p < \\frac{1}{2}$，解 $p(1 - p) = \\frac{6}{25}$：$p = \\frac{2}{5}$ 或 $\\frac{3}{5}$，所以 $p = \\frac{2}{5}$。",
      ),
      generate(rng) {
        const d = rng.int(3, 12);
        const n = rng.int(1, Math.ceil(d / 2) - 1);
        const p = Q.of(n, d);
        const v = p.mul(Q.of(1).sub(p));
        const small = rng.bool();
        const value = small ? p : Q.of(1).sub(p);
        return numberProblem({
          prompt: t(
            `$X \\sim \\operatorname{Bernoulli}(p)$ with $\\operatorname{Var}(X) = ${v.toLatex()}$ and $p ${small ? "<" : ">"} \\frac{1}{2}$. Find $p$.`,
            `$X \\sim \\operatorname{Bernoulli}(p)$，$\\operatorname{Var}(X) = ${v.toLatex()}$，且 $p ${small ? "<" : ">"} \\frac{1}{2}$。求 $p$。`,
          ),
          answer: value,
          wrong: [Q.of(1).sub(value), v, Q.of(1).sub(v)],
          solution: t(
            `$p(1 - p) = ${v.toLatex()}$ has roots $${p.toLatex()}$ and $${Q.of(1).sub(p).toLatex()}$; the one ${small ? "below" : "above"} $\\frac{1}{2}$ is $${value.toLatex()}$.`,
            `$p(1 - p) = ${v.toLatex()}$ 的根为 $${p.toLatex()}$ 和 $${Q.of(1).sub(p).toLatex()}$；${small ? "小于" : "大于"} $\\frac{1}{2}$ 的是 $${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** meanAndVarianceOfTheBinomialDistribution sums n Bernoulli variables. */
export const meanAndVarianceOfTheBinomialDistribution: TopicDef = {
  id: "mean-and-variance-of-the-binomial-distribution",
  title: t("Mean and Variance of the Binomial Distribution", "二项分布的均值与方差"),
  summary: t(
    "A binomial variable X ~ B(n, p) is a sum of n independent Bernoulli(p) variables, so E(X) = np and Var(X) = np(1 − p); conversely n and p can be recovered from the mean and variance.",
    "二项随机变量 X ~ B(n, p) 是 n 个相互独立的 Bernoulli(p) 变量之和，所以 E(X) = np，Var(X) = np(1 − p)；反过来也可由均值与方差求出 n 和 p。",
  ),
  prerequisites: ["the-binomial-distribution", "mean-and-variance-of-the-bernoulli-distribution"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "binomial-parameters-from-mean-and-variance",
      title: t("Parameters from mean and variance", "由均值与方差求参数"),
      explanation: t(
        "The variance divided by the mean gives the failure probability, and then the mean divided by the success probability gives the number of trials. If $E(X) = 12$ and $\\operatorname{Var}(X) = 8.4$, then $1 - p = \\frac{8.4}{12} = 0.7$, so $p = 0.3$ and $n = \\frac{12}{0.3} = 40$.",
        "方差除以均值得到失败的概率，再用均值除以成功概率得到试验次数。若 $E(X) = 12$，$\\operatorname{Var}(X) = 8.4$，则 $1 - p = \\frac{8.4}{12} = 0.7$，所以 $p = 0.3$，$n = \\frac{12}{0.3} = 40$。",
      ),
      generate(rng) {
        let p: Q;
        let n: number;
        do {
          p = rng.pick(PS);
          n = rng.int(4, 60);
        } while (!p.mul(Q.of(n)).isInteger());
        const mean = p.mul(Q.of(n));
        const v = mean.mul(Q.of(1).sub(p));
        const askN = rng.bool();
        return numberProblem({
          prompt: t(
            `$X \\sim B(n, p)$ with $E(X) = ${qt(mean)}$ and $\\operatorname{Var}(X) = ${qt(v)}$. Find $${askN ? "n" : "p"}$.`,
            `$X \\sim B(n, p)$，$E(X) = ${qt(mean)}$，$\\operatorname{Var}(X) = ${qt(v)}$。求 $${askN ? "n" : "p"}$。`,
          ),
          answer: askN ? Q.of(n) : p,
          wrong: askN
            ? [mean.mul(Q.of(2)), v.div(p), mean.add(v)]
            : [v.div(mean), Q.of(1).sub(v.div(mean)).div(Q.of(2)), mean.div(Q.of(100))],
          solution: t(
            `$1 - p = \\frac{${qt(v)}}{${qt(mean)}} = ${qt(Q.of(1).sub(p))}$, so $p = ${qt(p)}$ and $n = \\frac{${qt(mean)}}{${qt(p)}} = ${n}$.`,
            `$1 - p = \\frac{${qt(v)}}{${qt(mean)}} = ${qt(Q.of(1).sub(p))}$，所以 $p = ${qt(p)}$，$n = \\frac{${qt(mean)}}{${qt(p)}} = ${n}$。`,
          ),
        });
      },
    },
    {
      id: "second-moment-of-a-binomial-variable",
      title: t("E(X²) of a binomial variable", "二项变量的 E(X²)"),
      explanation: t(
        "The second moment is the variance plus the square of the mean, and both are known for a binomial variable. For $X \\sim B(10, 0.4)$: $E(X) = 4$ and $\\operatorname{Var}(X) = 2.4$, so $E(X^2) = 2.4 + 4^2 = 18.4$.",
        "二阶矩等于方差加上均值的平方，而二项变量的这两个量都是已知的。对 $X \\sim B(10, 0.4)$：$E(X) = 4$，$\\operatorname{Var}(X) = 2.4$，所以 $E(X^2) = 2.4 + 4^2 = 18.4$。",
      ),
      generate(rng) {
        const p = rng.pick(PS);
        const n = rng.int(3, 40);
        const mean = p.mul(Q.of(n));
        const v = mean.mul(Q.of(1).sub(p));
        const value = v.add(mean.pow(2));
        return numberProblem({
          prompt: t(`$X \\sim B(${n}, ${qt(p)})$. Find $E(X^2)$.`, `$X \\sim B(${n}, ${qt(p)})$。求 $E(X^2)$。`),
          answer: value,
          wrong: [mean.pow(2), v, mean.add(v), Q.of(n).mul(p.pow(2))],
          solution: t(
            `$E(X) = ${qt(mean)}$ and $\\operatorname{Var}(X) = ${qt(v)}$, so $E(X^2) = ${qt(v)} + (${qt(mean)})^2 = ${qt(value)}$.`,
            `$E(X) = ${qt(mean)}$，$\\operatorname{Var}(X) = ${qt(v)}$，所以 $E(X^2) = ${qt(v)} + (${qt(mean)})^2 = ${qt(value)}$。`,
          ),
        });
      },
    },
  ],
};

/** poissonP is P(X = k) for X ~ Po(λ). */
const poissonP = (lambda: number, k: number) => (Math.exp(-lambda) * lambda ** k) / fact(k);

/** poissonCdf is P(X ≤ k) for X ~ Po(λ). */
const poissonCdf = (lambda: number, k: number) => range(0, k).reduce((s, j) => s + poissonP(lambda, j), 0);

/** round4 rounds to four decimal places, or is undefined near a rounding boundary. */
const round4 = (x: number): Q | undefined => {
  const s = x * 1e4;
  return Math.abs(s - Math.floor(s) - 0.5) < 0.05 ? undefined : Q.of(Math.round(s), 10000);
};

/** r4 rounds to four places, ignoring the boundary check, for wrong answers. */
const r4 = (x: number) => Q.of(Math.round(x * 1e4), 10000);

/** FOUR asks for four decimal places. */
const FOUR = t(" Round to four decimal places.", "结果保留四位小数。");

/** LAMBDAS are Poisson means. */
const LAMBDAS = [0.5, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6] as const;

/** thePoissonDistribution counts events that occur at a constant average rate. */
export const thePoissonDistribution: TopicDef = {
  id: "the-poisson-distribution",
  title: t("The Poisson Distribution", "泊松分布"),
  summary: t(
    "$X \\sim \\text{Po}(\\lambda)$ counts events that occur independently at a constant average rate $\\lambda$ per interval: $P(X = k) = \\frac{e^{-\\lambda}\\lambda^k}{k!}$ for $k = 0, 1, 2, \\dots$.",
    "$X \\sim \\text{Po}(\\lambda)$ 统计以恒定平均速率 $\\lambda$（每个区间）独立发生的事件数：$P(X = k) = \\frac{e^{-\\lambda}\\lambda^k}{k!}$，$k = 0, 1, 2, \\dots$。",
  ),
  prerequisites: ["probability-mass-functions-of-discrete-random-variables", "exponential-functions", "factorials"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "poisson-point-probabilities",
      title: t("Point probabilities", "单点概率"),
      explanation: t(
        "The Poisson distribution counts events that occur independently at a constant average rate, and each probability uses that rate in the formula. For $X \\sim \\operatorname{Po}(2)$: $P(X = 3) = e^{-2} \\frac{2^3}{3!} = \\frac{8}{6} e^{-2} \\approx 0.1804$.",
        "泊松分布计算以固定平均速率独立发生的事件个数，每个概率都在公式中用到这个速率。对 $X \\sim \\operatorname{Po}(2)$：$P(X = 3) = e^{-2} \\frac{2^3}{3!} = \\frac{8}{6} e^{-2} \\approx 0.1804$。",
      ),
      generate(rng) {
        let lambda: number;
        let k: number;
        let value: Q | undefined;
        do {
          lambda = rng.pick(LAMBDAS);
          k = rng.int(0, 6);
          value = round4(poissonP(lambda, k));
        } while (!value || value.isZero());
        return numberProblem({
          prompt: t(
            `$X \\sim \\operatorname{Po}(${lambda})$. Find $P(X = ${k})$.${FOUR.en}`,
            `$X \\sim \\operatorname{Po}(${lambda})$。求 $P(X = ${k})$。${FOUR["zh-CN"]}`,
          ),
          answer: value,
          form: "decimal",
          wrong: [r4(lambda ** k / fact(k)), r4(poissonCdf(lambda, k)), r4(Math.exp(-lambda) * lambda ** k), r4(poissonP(lambda, k + 1))],
          solution: t(
            `$P(X = ${k}) = e^{-${lambda}} \\frac{${lambda}^{${k}}}{${k}!} \\approx ${dec(value)}$.`,
            `$P(X = ${k}) = e^{-${lambda}} \\frac{${lambda}^{${k}}}{${k}!} \\approx ${dec(value)}$。`,
          ),
        });
      },
    },
    {
      id: "poisson-cumulative-probabilities",
      title: t("Cumulative probabilities", "累积概率"),
      explanation: t(
        "For at least some number of events, subtract the probabilities of the few smaller counts from one, rather than summing an infinite tail. For $X \\sim \\operatorname{Po}(1.5)$: $P(X \\ge 2) = 1 - P(X = 0) - P(X = 1) = 1 - e^{-1.5}(1 + 1.5) \\approx 0.4422$.",
        "求至少发生若干次的概率时，用 1 减去较小几个次数的概率，而不是去求无穷多项的和。对 $X \\sim \\operatorname{Po}(1.5)$：$P(X \\ge 2) = 1 - P(X = 0) - P(X = 1) = 1 - e^{-1.5}(1 + 1.5) \\approx 0.4422$。",
      ),
      generate(rng) {
        let lambda: number;
        let k: number;
        let up: boolean;
        let value: Q | undefined;
        do {
          lambda = rng.pick(LAMBDAS);
          k = rng.int(1, 4);
          up = rng.bool();
          value = round4(up ? 1 - poissonCdf(lambda, k - 1) : poissonCdf(lambda, k));
        } while (!value);
        const terms = range(0, up ? k - 1 : k)
          .map((j) => `\\frac{${lambda}^{${j}}}{${j}!}`)
          .join(" + ");
        return numberProblem({
          prompt: t(
            `$X \\sim \\operatorname{Po}(${lambda})$. Find $P(X ${up ? "\\ge" : "\\le"} ${k})$.${FOUR.en}`,
            `$X \\sim \\operatorname{Po}(${lambda})$。求 $P(X ${up ? "\\ge" : "\\le"} ${k})$。${FOUR["zh-CN"]}`,
          ),
          answer: value,
          form: "decimal",
          wrong: up
            ? [r4(1 - poissonCdf(lambda, k)), r4(poissonCdf(lambda, k - 1)), r4(poissonP(lambda, k))]
            : [r4(poissonCdf(lambda, k - 1)), r4(1 - poissonCdf(lambda, k)), r4(poissonP(lambda, k))],
          solution: up
            ? t(
                `$P(X \\ge ${k}) = 1 - P(X \\le ${k - 1}) = 1 - e^{-${lambda}}\\left(${terms}\\right) \\approx ${dec(value)}$.`,
                `$P(X \\ge ${k}) = 1 - P(X \\le ${k - 1}) = 1 - e^{-${lambda}}\\left(${terms}\\right) \\approx ${dec(value)}$。`,
              )
            : t(
                `$P(X \\le ${k}) = e^{-${lambda}}\\left(${terms}\\right) \\approx ${dec(value)}$.`,
                `$P(X \\le ${k}) = e^{-${lambda}}\\left(${terms}\\right) \\approx ${dec(value)}$。`,
              ),
        });
      },
    },
  ],
};

/** PoissonStory is a context with events at a constant rate. */
interface PoissonStory {
  readonly rate: number;
  readonly per: Text;
  readonly over: number;
  readonly span: Text;
  readonly what: Text;
}

/** poissonStory picks a rate, a base interval and a question interval. */
function poissonStory(rng: Rng): PoissonStory {
  const kind = rng.int(0, 3);
  if (kind === 0) {
    const rate = rng.pick([2, 3, 4, 6]);
    const over = rng.pick([15, 20, 30, 45]);
    return {
      rate,
      per: t("per hour", "每小时"),
      over: over / 60,
      span: t(`${article(over)} $${over}$-minute period`, `$${over}$ 分钟内`),
      what: t("Calls arrive at a help desk", "求助热线来电"),
    };
  }
  if (kind === 1) {
    const rate = rng.pick([0.5, 1.5, 2, 2.5]);
    const over = rng.int(2, 3);
    return {
      rate,
      per: t("per page", "每页"),
      over,
      span: t(`$${over}$ pages`, `$${over}$ 页中`),
      what: t("Typing errors occur in a report", "报告中出现打字错误"),
    };
  }
  if (kind === 2) {
    const rate = rng.pick([7, 14, 21, 28]);
    const over = rng.pick([1, 2, 3]);
    return {
      rate,
      per: t("per week", "每周"),
      over: over / 7,
      span: t(`${over === 1 ? "one day" : `$${over}$ days`}`, `$${over}$ 天内`),
      what: t("Emails reach an inbox", "邮件到达邮箱"),
    };
  }
  const rate = rng.pick([0.2, 0.4, 0.6, 0.8]);
  const over = rng.pick([5, 10]);
  return {
    rate,
    per: t("per metre", "每米"),
    over,
    span: t(`${article(over)} $${over}$-metre length`, `$${over}$ 米长的一段中`),
    what: t("Flaws appear in a cable", "电缆上出现瑕疵"),
  };
}

/** modelingWithThePoissonDistribution scales rates to the interval asked about. */
export const modelingWithThePoissonDistribution: TopicDef = {
  id: "modeling-with-the-poisson-distribution",
  title: t("Modeling With the Poisson Distribution", "用泊松分布建模"),
  summary: t(
    "Events happening independently at a constant rate follow a Poisson distribution; for an interval t times as long, the mean is t times the rate.",
    "以恒定速率独立发生的事件服从泊松分布；若区间长度是原来的 t 倍，均值也是速率的 t 倍。",
  ),
  prerequisites: ["the-poisson-distribution"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "poisson-probabilities-in-context",
      title: t("Probabilities in context", "情境中的概率"),
      explanation: t(
        "Scale the rate to the length of the interval in question first, because the Poisson parameter is the expected count over that interval. Calls arrive at $4$ per hour. In $30$ minutes the count is $\\operatorname{Po}(2)$, so $P(\\text{exactly } 1) = 2e^{-2} \\approx 0.2707$.",
        "先把速率按所问区间的长度进行换算，因为泊松参数是该区间内的期望次数。电话以每小时 $4$ 个的速率到来。$30$ 分钟内的来电数服从 $\\operatorname{Po}(2)$，所以恰有 $1$ 个的概率为 $2e^{-2} \\approx 0.2707$。",
      ),
      generate(rng) {
        let s: PoissonStory;
        let lambda: number;
        let k: number;
        let value: Q | undefined;
        do {
          s = poissonStory(rng);
          lambda = Math.round(s.rate * s.over * 1000) / 1000;
          k = rng.int(0, 4);
          value = round4(poissonP(lambda, k));
        } while (!value || !Number.isInteger(lambda * 10));
        return numberProblem({
          prompt: t(
            `${s.what.en} independently at a constant average rate of $${s.rate}$ ${s.per.en}. Find the probability of exactly $${k}$ in ${s.span.en}.${FOUR.en}`,
            `${s.what["zh-CN"]}的平均速率为${s.per["zh-CN"]} $${s.rate}$ 次，相互独立且速率恒定。求${s.span["zh-CN"]}恰好发生 $${k}$ 次的概率。${FOUR["zh-CN"]}`,
          ),
          answer: value,
          form: "decimal",
          wrong: [r4(poissonP(s.rate, k)), r4(poissonCdf(lambda, k)), r4(poissonP(lambda, k + 1))],
          solution: t(
            `The mean for this interval is $\\lambda = ${lambda}$, so $P(X = ${k}) = e^{-${lambda}} \\frac{${lambda}^{${k}}}{${k}!} \\approx ${dec(value)}$.`,
            `该区间的均值为 $\\lambda = ${lambda}$，所以 $P(X = ${k}) = e^{-${lambda}} \\frac{${lambda}^{${k}}}{${k}!} \\approx ${dec(value)}$。`,
          ),
        });
      },
    },
    {
      id: "at-least-one-event",
      title: t("At least one event", "至少发生一次"),
      explanation: t(
        "The complement of at least one event is no events at all, whose Poisson probability is simply the exponential of minus the rate. If flaws appear at $0.4$ per metre, a $5$-metre length has $\\lambda = 2$ and $P(X \\ge 1) = 1 - e^{-2} \\approx 0.8647$.",
        "“至少一次”的补是“一次也没有”，它的泊松概率就是 e 的负速率次幂。若瑕疵以每米 $0.4$ 个出现，$5$ 米长的一段 $\\lambda = 2$，$P(X \\ge 1) = 1 - e^{-2} \\approx 0.8647$。",
      ),
      generate(rng) {
        let s: PoissonStory;
        let lambda: number;
        let value: Q | undefined;
        do {
          s = poissonStory(rng);
          lambda = Math.round(s.rate * s.over * 1000) / 1000;
          value = round4(1 - Math.exp(-lambda));
        } while (!value || !Number.isInteger(lambda * 10));
        return numberProblem({
          prompt: t(
            `${s.what.en} independently at a constant average rate of $${s.rate}$ ${s.per.en}. Find the probability of at least one in ${s.span.en}.${FOUR.en}`,
            `${s.what["zh-CN"]}的平均速率为${s.per["zh-CN"]} $${s.rate}$ 次，相互独立且速率恒定。求${s.span["zh-CN"]}至少发生一次的概率。${FOUR["zh-CN"]}`,
          ),
          answer: value,
          form: "decimal",
          wrong: [r4(Math.exp(-lambda)), r4(1 - Math.exp(-s.rate)), r4(poissonP(lambda, 1))],
          solution: t(
            `$\\lambda = ${lambda}$, and $P(X \\ge 1) = 1 - P(X = 0) = 1 - e^{-${lambda}} \\approx ${dec(value)}$.`,
            `$\\lambda = ${lambda}$，$P(X \\ge 1) = 1 - P(X = 0) = 1 - e^{-${lambda}} \\approx ${dec(value)}$。`,
          ),
        });
      },
    },
  ],
};

/** meanAndVarianceOfThePoissonDistribution uses E(X) = Var(X) = λ. */
export const meanAndVarianceOfThePoissonDistribution: TopicDef = {
  id: "mean-and-variance-of-the-poisson-distribution",
  title: t("Mean and Variance of the Poisson Distribution", "泊松分布的均值与方差"),
  summary: t(
    "If X ~ Po(λ), then E(X) = Var(X) = λ. The ratio P(X = k + 1)/P(X = k) = λ/(k + 1) also pins down λ.",
    "若 X ~ Po(λ)，则 E(X) = Var(X) = λ。比值 P(X = k + 1)/P(X = k) = λ/(k + 1) 也能确定 λ。",
  ),
  prerequisites: ["the-poisson-distribution", "variance-of-discrete-random-variables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "moments-of-a-poisson-variable",
      title: t("Moments", "矩"),
      explanation: t(
        "The mean and the variance of a Poisson variable are both equal to the rate, which makes its other moments easy to compute. For $X \\sim \\operatorname{Po}(3)$: $E(X) = \\operatorname{Var}(X) = 3$, so $E(X^2) = 3 + 9 = 12$ and $\\operatorname{Var}(2X + 1) = 4 \\cdot 3 = 12$.",
        "泊松变量的均值和方差都等于速率，这使它的其他矩都很容易计算。对 $X \\sim \\operatorname{Po}(3)$：$E(X) = \\operatorname{Var}(X) = 3$，所以 $E(X^2) = 3 + 9 = 12$，$\\operatorname{Var}(2X + 1) = 4 \\cdot 3 = 12$。",
      ),
      generate(rng) {
        const lambda = Q.of(rng.int(1, 40), rng.pick([1, 2, 10]));
        const a = rng.int(2, 5);
        const b = rng.int(1, 9);
        const second = rng.bool();
        const value = second ? lambda.add(lambda.pow(2)) : lambda.mul(Q.of(a * a));
        return numberProblem({
          prompt: second
            ? t(`$X \\sim \\operatorname{Po}(${qt(lambda)})$. Find $E(X^2)$.`, `$X \\sim \\operatorname{Po}(${qt(lambda)})$。求 $E(X^2)$。`)
            : t(
                `$X \\sim \\operatorname{Po}(${qt(lambda)})$. Find $\\operatorname{Var}(${a}X + ${b})$.`,
                `$X \\sim \\operatorname{Po}(${qt(lambda)})$。求 $\\operatorname{Var}(${a}X + ${b})$。`,
              ),
          answer: value,
          wrong: second
            ? [lambda.pow(2), lambda, lambda.mul(Q.of(2))]
            : [lambda.mul(Q.of(a)), lambda.mul(Q.of(a * a)).add(Q.of(b)), lambda.mul(Q.of(a)).add(Q.of(b))],
          solution: second
            ? t(
                `$E(X^2) = \\operatorname{Var}(X) + E(X)^2 = ${qt(lambda)} + (${qt(lambda)})^2 = ${qt(value)}$.`,
                `$E(X^2) = \\operatorname{Var}(X) + E(X)^2 = ${qt(lambda)} + (${qt(lambda)})^2 = ${qt(value)}$。`,
              )
            : t(
                `$\\operatorname{Var}(X) = ${qt(lambda)}$, so $\\operatorname{Var}(${a}X + ${b}) = ${a}^2 \\cdot ${qt(lambda)} = ${qt(value)}$.`,
                `$\\operatorname{Var}(X) = ${qt(lambda)}$，所以 $\\operatorname{Var}(${a}X + ${b}) = ${a}^2 \\cdot ${qt(lambda)} = ${qt(value)}$。`,
              ),
        });
      },
    },
    {
      id: "poisson-mean-from-a-ratio",
      title: t("The mean from a ratio of probabilities", "由概率之比求均值"),
      explanation: t(
        "Writing out both probabilities and dividing cancels the exponential factor, leaving a simple equation for the rate. If $P(X = 2) = P(X = 3)$ for $X \\sim \\operatorname{Po}(\\lambda)$, then $e^{-\\lambda}\\frac{\\lambda^2}{2} = e^{-\\lambda}\\frac{\\lambda^3}{6}$, so $\\lambda = 3$, which is also the variance.",
        "把两个概率都写出来再相除，指数因子被约去，只剩下一个关于速率的简单方程。若 $X \\sim \\operatorname{Po}(\\lambda)$ 满足 $P(X = 2) = P(X = 3)$，则 $e^{-\\lambda}\\frac{\\lambda^2}{2} = e^{-\\lambda}\\frac{\\lambda^3}{6}$，所以 $\\lambda = 3$，这也是方差。",
      ),
      generate(rng) {
        const k = rng.int(0, 4);
        const c = Q.of(rng.int(1, 6), rng.pick([1, 2, 3]));
        const value = c.mul(Q.of(k + 1));
        const cText = c.eq(Q.of(1)) ? "" : `${c.toLatex()} \\, `;
        return numberProblem({
          prompt: t(
            `$X \\sim \\operatorname{Po}(\\lambda)$ and $P(X = ${k + 1}) = ${cText}P(X = ${k})$. Find $\\operatorname{Var}(X)$.`,
            `$X \\sim \\operatorname{Po}(\\lambda)$，且 $P(X = ${k + 1}) = ${cText}P(X = ${k})$。求 $\\operatorname{Var}(X)$。`,
          ),
          answer: value,
          wrong: [c, c.mul(Q.of(k + 2)), value.pow(2), c.mul(Q.of(Math.max(k, 1)))],
          solution: t(
            `$\\frac{P(X = ${k + 1})}{P(X = ${k})} = \\frac{\\lambda}{${k + 1}} = ${c.toLatex()}$, so $\\lambda = ${qt(value)}$, and $\\operatorname{Var}(X) = \\lambda = ${qt(value)}$.`,
            `$\\frac{P(X = ${k + 1})}{P(X = ${k})} = \\frac{\\lambda}{${k + 1}} = ${c.toLatex()}$，所以 $\\lambda = ${qt(value)}$，$\\operatorname{Var}(X) = \\lambda = ${qt(value)}$。`,
          ),
        });
      },
    },
  ],
};

/** binomP is P(X = k) for X ~ B(n, p) with p a number. */
const binomP = (n: number, k: number, p: number) => choose(n, k) * p ** k * (1 - p) ** (n - k);

/** thePoissonApproximationOfTheBinomialDistribution approximates B(n, p) by Po(np) for large n and small p. */
export const thePoissonApproximationOfTheBinomialDistribution: TopicDef = {
  id: "the-poisson-approximation-of-the-binomial-distribution",
  title: t("The Poisson Approximation of the Binomial Distribution", "二项分布的泊松近似"),
  summary: t(
    "When n is large and p is small, B(n, p) is close to Po(λ) with λ = np, which is much easier to compute.",
    "当 n 很大而 p 很小时，B(n, p) 接近 Po(λ)，其中 λ = np，计算起来简单得多。",
  ),
  prerequisites: ["the-poisson-distribution", "the-binomial-distribution"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "choosing-the-approximating-mean",
      title: t("The approximating mean", "近似分布的均值"),
      explanation: t(
        "When there are many trials with a small success probability, a Poisson distribution with the same mean approximates the binomial well. For $X \\sim B(500, 0.004)$, use $\\operatorname{Po}(500 \\cdot 0.004) = \\operatorname{Po}(2)$.",
        "当试验次数很多而成功概率很小时，均值相同的泊松分布可以很好地近似二项分布。对 $X \\sim B(500, 0.004)$，用 $\\operatorname{Po}(500 \\cdot 0.004) = \\operatorname{Po}(2)$ 近似。",
      ),
      generate(rng) {
        const n = rng.pick([200, 250, 400, 500, 800, 1000, 2000]);
        const lambda = rng.pick([0.5, 1, 1.5, 2, 2.4, 3, 4, 5]);
        const p = Q.of(Math.round(lambda * 10), n * 10);
        const value = Q.of(Math.round(lambda * 10), 10);
        return numberProblem({
          prompt: t(
            `$X \\sim B(${n}, ${dec(p)})$ is approximated by $\\operatorname{Po}(\\lambda)$. Find $\\lambda$.`,
            `用 $\\operatorname{Po}(\\lambda)$ 近似 $X \\sim B(${n}, ${dec(p)})$。求 $\\lambda$。`,
          ),
          answer: value,
          wrong: [value.mul(Q.of(1).sub(p)), Q.of(n), value.mul(Q.of(10))],
          solution: t(
            `$\\lambda = np = ${n} \\cdot ${dec(p)} = ${qt(value)}$.`,
            `$\\lambda = np = ${n} \\cdot ${dec(p)} = ${qt(value)}$。`,
          ),
        });
      },
    },
    {
      id: "approximating-binomial-probabilities",
      title: t("Approximating probabilities", "近似计算概率"),
      explanation: t(
        "A batch of $1000$ items each has defect probability $0.002$. With $\\lambda = 2$, $P(X = 1) \\approx 2e^{-2} \\approx 0.2707$; the exact binomial value $0.2709$ is very close.",
        "一批 $1000$ 件产品，每件次品概率为 $0.002$。取 $\\lambda = 2$，$P(X = 1) \\approx 2e^{-2} \\approx 0.2707$；精确的二项概率 $0.2709$ 与之非常接近。",
      ),
      generate(rng) {
        let n: number;
        let lambda: number;
        let k: number;
        let value: Q | undefined;
        do {
          n = rng.pick([500, 1000, 2000]);
          lambda = rng.pick([1, 1.5, 2, 3, 4]);
          k = rng.int(0, 4);
          value = round4(poissonP(lambda, k));
        } while (!value);
        const p = Q.of(Math.round(lambda * 10), n * 10);
        return numberProblem({
          prompt: t(
            `Each of $${n}$ items is defective with probability $${dec(p)}$, independently. Use a Poisson approximation to find the probability that exactly $${k}$ are defective.${FOUR.en}`,
            `$${n}$ 件产品中每件独立地以 $${dec(p)}$ 的概率为次品。用泊松近似求恰有 $${k}$ 件次品的概率。${FOUR["zh-CN"]}`,
          ),
          answer: value,
          form: "decimal",
          wrong: [r4(poissonCdf(lambda, k)), r4(poissonP(lambda, k + 1)), r4(lambda ** k / fact(k))],
          solution: t(
            `$\\lambda = ${n} \\cdot ${dec(p)} = ${lambda}$, so $P(X = ${k}) \\approx e^{-${lambda}} \\frac{${lambda}^{${k}}}{${k}!} \\approx ${dec(value)}$ (the exact binomial value is $${binomP(n, k, lambda / n).toFixed(4)}$).`,
            `$\\lambda = ${n} \\cdot ${dec(p)} = ${lambda}$，所以 $P(X = ${k}) \\approx e^{-${lambda}} \\frac{${lambda}^{${k}}}{${k}!} \\approx ${dec(value)}$（精确的二项概率为 $${binomP(n, k, lambda / n).toFixed(4)}$）。`,
          ),
        });
      },
    },
  ],
};

/** meanAndVarianceOfTheGeometricDistribution uses E(X) = 1/p and Var(X) = (1 − p)/p². */
export const meanAndVarianceOfTheGeometricDistribution: TopicDef = {
  id: "mean-and-variance-of-the-geometric-distribution",
  title: t("Mean and Variance of the Geometric Distribution", "几何分布的均值与方差"),
  summary: t(
    "If X ~ Geo(p) counts the trials up to and including the first success, then E(X) = 1/p and Var(X) = (1 − p)/p².",
    "若 X ~ Geo(p) 表示直到第一次成功（含）所需的试验次数，则 E(X) = 1/p，Var(X) = (1 − p)/p²。",
  ),
  prerequisites: ["the-geometric-distribution", "variance-of-discrete-random-variables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "variance-of-a-geometric-variable",
      title: t("The variance", "方差"),
      explanation: t(
        "The waiting time for the first success varies more when success is rare, so the variance grows quickly as the success probability shrinks. For $X \\sim \\operatorname{Geo}(\\frac{1}{4})$: $\\operatorname{Var}(X) = \\frac{3/4}{1/16} = 12$.",
        "成功越罕见，首次成功的等待时间波动越大，所以随着成功概率减小，方差增长得很快。对 $X \\sim \\operatorname{Geo}(\\frac{1}{4})$：$\\operatorname{Var}(X) = \\frac{3/4}{1/16} = 12$。",
      ),
      generate(rng) {
        const p = Q.of(rng.int(1, 4), rng.int(5, 12));
        const value = Q.of(1).sub(p).div(p.pow(2));
        return numberProblem({
          prompt: t(
            `$X \\sim \\operatorname{Geo}(${qt(p)})$. Find $\\operatorname{Var}(X)$.`,
            `$X \\sim \\operatorname{Geo}(${qt(p)})$。求 $\\operatorname{Var}(X)$。`,
          ),
          answer: value,
          wrong: [Q.of(1).div(p), Q.of(1).sub(p).div(p), Q.of(1).div(p.pow(2))],
          solution: t(
            `$\\operatorname{Var}(X) = \\frac{1 - p}{p^2} = \\frac{${qt(Q.of(1).sub(p))}}{(${qt(p)})^2} = ${qt(value)}$.`,
            `$\\operatorname{Var}(X) = \\frac{1 - p}{p^2} = \\frac{${qt(Q.of(1).sub(p))}}{(${qt(p)})^2} = ${qt(value)}$。`,
          ),
        });
      },
    },
    {
      id: "geometric-variance-from-the-mean",
      title: t("The variance from the mean", "由均值求方差"),
      explanation: t(
        "The mean of a geometric variable is the reciprocal of the success probability, so the mean determines the parameter and hence the variance. If $E(X) = 5$, then $p = \\frac{1}{5}$ and $\\operatorname{Var}(X) = \\frac{4/5}{1/25} = 20$. In general $\\operatorname{Var}(X) = \\mu^2 - \\mu$.",
        "几何变量的均值是成功概率的倒数，所以均值确定了参数，从而也确定了方差。若 $E(X) = 5$，则 $p = \\frac{1}{5}$，$\\operatorname{Var}(X) = \\frac{4/5}{1/25} = 20$。一般地，$\\operatorname{Var}(X) = \\mu^2 - \\mu$。",
      ),
      generate(rng) {
        const mu = Q.of(rng.int(3, 30), rng.pick([1, 1, 2]));
        const value = mu.pow(2).sub(mu);
        return numberProblem({
          prompt: t(
            `$X$ has a geometric distribution with $E(X) = ${qt(mu)}$. Find $\\operatorname{Var}(X)$.`,
            `$X$ 服从几何分布，$E(X) = ${qt(mu)}$。求 $\\operatorname{Var}(X)$。`,
          ),
          answer: value,
          wrong: [mu.pow(2), mu, mu.pow(2).add(mu)],
          solution: t(
            `$p = \\frac{1}{${qt(mu)}}$, so $\\operatorname{Var}(X) = \\frac{1 - p}{p^2} = \\mu^2 - \\mu = ${qt(value)}$.`,
            `$p = \\frac{1}{${qt(mu)}}$，所以 $\\operatorname{Var}(X) = \\frac{1 - p}{p^2} = \\mu^2 - \\mu = ${qt(value)}$。`,
          ),
        });
      },
    },
  ],
};

/** ordinal writes 1st, 2nd, 3rd, 4th, …. */
const ordinal = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th")}`;

/** negBinP is P(X = k) when X is the trial of the r-th success. */
const negBinP = (r: number, k: number, p: Q) =>
  Q.of(choose(k - 1, r - 1))
    .mul(p.pow(r))
    .mul(
      Q.of(1)
        .sub(p)
        .pow(k - r),
    );

/** theNegativeBinomialDistribution counts trials up to the r-th success. */
export const theNegativeBinomialDistribution: TopicDef = {
  id: "the-negative-binomial-distribution",
  title: t("The Negative Binomial Distribution", "负二项分布"),
  summary: t(
    "If X is the number of independent trials needed for the r-th success, then P(X = k) = C(k − 1, r − 1) pʳ (1 − p)ᵏ⁻ʳ for k ≥ r, with E(X) = r/p and Var(X) = r(1 − p)/p².",
    "若 X 表示得到第 r 次成功所需的独立试验次数，则对 k ≥ r，P(X = k) = C(k − 1, r − 1) pʳ (1 − p)ᵏ⁻ʳ，且 E(X) = r/p，Var(X) = r(1 − p)/p²。",
  ),
  prerequisites: ["mean-and-variance-of-the-geometric-distribution"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "negative-binomial-probabilities",
      title: t("Probabilities", "概率"),
      explanation: t(
        "The $3$rd success on trial $5$ with $p = \\frac{1}{2}$: trial $5$ succeeds and the first $4$ hold exactly $2$ successes, so $P(X = 5) = \\binom{4}{2} \\left(\\frac{1}{2}\\right)^3 \\left(\\frac{1}{2}\\right)^2 = \\frac{6}{32} = \\frac{3}{16}$.",
        "$p = \\frac{1}{2}$ 时第 $3$ 次成功恰在第 $5$ 次试验：第 $5$ 次成功且前 $4$ 次恰有 $2$ 次成功，所以 $P(X = 5) = \\binom{4}{2} \\left(\\frac{1}{2}\\right)^3 \\left(\\frac{1}{2}\\right)^2 = \\frac{6}{32} = \\frac{3}{16}$。",
      ),
      generate(rng) {
        const p = rng.pick(PS.slice(0, 9));
        const r = rng.int(2, 4);
        const k = r + rng.int(1, 4);
        const value = negBinP(r, k, p);
        const q = Q.of(1).sub(p);
        return numberProblem({
          prompt: t(
            `Independent trials each succeed with probability $${p.toLatex()}$. $X$ is the number of trials needed for the ${ordinal(r)} success. Find $P(X = ${k})$.`,
            `独立试验每次成功的概率为 $${p.toLatex()}$。$X$ 表示得到第 $${r}$ 次成功所需的试验次数。求 $P(X = ${k})$。`,
          ),
          answer: value,
          wrong: [
            Q.of(choose(k, r))
              .mul(p.pow(r))
              .mul(q.pow(k - r)),
            p.pow(r).mul(q.pow(k - r)),
            Q.of(choose(k - 1, r))
              .mul(p.pow(r))
              .mul(q.pow(k - r)),
          ],
          solution: t(
            `$P(X = ${k}) = \\binom{${k - 1}}{${r - 1}} \\left(${p.toLatex()}\\right)^{${r}} \\left(${q.toLatex()}\\right)^{${k - r}} = ${value.toLatex()}$.`,
            `$P(X = ${k}) = \\binom{${k - 1}}{${r - 1}} \\left(${p.toLatex()}\\right)^{${r}} \\left(${q.toLatex()}\\right)^{${k - r}} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "mean-and-variance-of-the-negative-binomial-distribution",
      title: t("Mean and variance", "均值与方差"),
      explanation: t(
        "Waiting for several successes is a sum of independent geometric waits, so both the mean and the variance are that many times those of one wait. Waiting for $r$ successes is $r$ geometric waits in a row, so $E(X) = \\frac{r}{p}$ and $\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2}$. For $r = 3$, $p = \\frac{1}{4}$: $E(X) = 12$ and $\\operatorname{Var}(X) = 36$.",
        "等待若干次成功是若干次独立几何等待之和，所以均值和方差都是一次等待的相应倍数。等待 $r$ 次成功相当于连续 $r$ 次几何等待，所以 $E(X) = \\frac{r}{p}$，$\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2}$。$r = 3$，$p = \\frac{1}{4}$ 时：$E(X) = 12$，$\\operatorname{Var}(X) = 36$。",
      ),
      generate(rng) {
        const p = rng.pick(PS);
        const r = rng.int(2, 8);
        const askVar = rng.bool();
        const mean = Q.of(r).div(p);
        const v = Q.of(r).mul(Q.of(1).sub(p)).div(p.pow(2));
        return numberProblem({
          prompt: t(
            `Independent trials each succeed with probability $${qt(p)}$. $X$ is the number of trials needed for $${r}$ successes. Find $${askVar ? "\\operatorname{Var}(X)" : "E(X)"}$.`,
            `独立试验每次成功的概率为 $${qt(p)}$。$X$ 表示得到 $${r}$ 次成功所需的试验次数。求 $${askVar ? "\\operatorname{Var}(X)" : "E(X)"}$。`,
          ),
          answer: askVar ? v : mean,
          wrong: askVar
            ? [Q.of(r).mul(Q.of(1).sub(p)).div(p), mean, v.div(Q.of(r))]
            : [Q.of(r).mul(p), Q.of(1).div(p), Q.of(r).div(Q.of(1).sub(p))],
          solution: askVar
            ? t(
                `$\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2} = \\frac{${r} \\cdot ${qt(Q.of(1).sub(p))}}{(${qt(p)})^2} = ${qt(v)}$.`,
                `$\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2} = \\frac{${r} \\cdot ${qt(Q.of(1).sub(p))}}{(${qt(p)})^2} = ${qt(v)}$。`,
              )
            : t(
                `$E(X) = \\frac{r}{p} = \\frac{${r}}{${qt(p)}} = ${qt(mean)}$.`,
                `$E(X) = \\frac{r}{p} = \\frac{${r}}{${qt(p)}} = ${qt(mean)}$。`,
              ),
        });
      },
    },
  ],
};

/** NegBinStory is a context of repeated attempts until several successes. */
interface NegBinStory {
  readonly p: number;
  readonly en: (r: number) => string;
  readonly zh: (r: number) => string;
}

/** negBinStory picks a context with a decimal success probability. */
const negBinStory = (rng: Rng): NegBinStory =>
  rng.pick([
    {
      p: rng.pick([0.6, 0.7, 0.8]),
      en: (r: number) =>
        `A basketball player makes each free throw with probability $PROB$, independently. She shoots until she has made $${r}$`,
      zh: (r: number) => `一名篮球运动员每次罚球命中的概率为 $PROB$，相互独立。她一直投到命中 $${r}$ 次为止`,
    },
    {
      p: rng.pick([0.2, 0.3, 0.4]),
      en: (r: number) =>
        `A salesperson closes each call with probability $PROB$, independently, and keeps calling until $${r}$ sales are made`,
      zh: (r: number) => `一名销售员每次通话成交的概率为 $PROB$，相互独立，一直打电话直到成交 $${r}$ 笔`,
    },
    {
      p: rng.pick([0.1, 0.25, 0.5]),
      en: (r: number) =>
        `Each pack of cards contains a rare card with probability $PROB$, independently. A collector opens packs until finding $${r}$ rare cards`,
      zh: (r: number) => `每包卡牌独立地以 $PROB$ 的概率含有一张稀有卡。一位收藏者一直拆包直到找到 $${r}$ 张稀有卡`,
    },
  ]);

/** modelingWithTheNegativeBinomialDistribution applies the negative binomial distribution in context. */
export const modelingWithTheNegativeBinomialDistribution: TopicDef = {
  id: "modeling-with-the-negative-binomial-distribution",
  title: t("Modeling With the Negative Binomial Distribution", "用负二项分布建模"),
  summary: t(
    "Repeating independent attempts until a fixed number of successes gives a negative binomial count of attempts.",
    "重复独立尝试直到成功固定次数，所需的尝试次数服从负二项分布。",
  ),
  prerequisites: ["the-negative-binomial-distribution"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "negative-binomial-probabilities-in-context",
      title: t("Probabilities in context", "情境中的概率"),
      explanation: t(
        "Free throws succeed with probability $0.7$. The $2$nd success comes on the $4$th shot with probability $\\binom{3}{1}(0.7)^2(0.3)^2 = 0.1323$.",
        "罚球命中概率为 $0.7$。第 $2$ 次命中恰在第 $4$ 投的概率为 $\\binom{3}{1}(0.7)^2(0.3)^2 = 0.1323$。",
      ),
      generate(rng) {
        const s = negBinStory(rng);
        const r = rng.int(2, 4);
        const k = r + rng.int(1, 3);
        const p = Q.of(Math.round(s.p * 100), 100);
        const exact = negBinP(r, k, p);
        const value = r4(exact.toNumber());
        const story = (x: string) => x.replace("PROB", dec(p));
        return numberProblem({
          prompt: t(
            `${story(s.en(r))}. Find the probability that exactly $${k}$ attempts are needed.${FOUR.en}`,
            `${story(s.zh(r))}。求恰好需要 $${k}$ 次尝试的概率。${FOUR["zh-CN"]}`,
          ),
          answer: value,
          form: "decimal",
          wrong: [r4(binomP(k, r, s.p)), r4(s.p ** r * (1 - s.p) ** (k - r)), r4(choose(k - 1, r) * s.p ** r * (1 - s.p) ** (k - r))],
          solution: t(
            `The ${ordinal(k)} attempt is the ${ordinal(r)} success: $\\binom{${k - 1}}{${r - 1}} (${dec(p)})^{${r}} (${dec(Q.of(1).sub(p))})^{${k - r}} \\approx ${dec(value)}$.`,
            `第 $${k}$ 次尝试是第 $${r}$ 次成功：$\\binom{${k - 1}}{${r - 1}} (${dec(p)})^{${r}} (${dec(Q.of(1).sub(p))})^{${k - r}} \\approx ${dec(value)}$。`,
          ),
        });
      },
    },
    {
      id: "expected-attempts-in-context",
      title: t("Expected attempts", "期望尝试次数"),
      explanation: t(
        "Each success takes on average the reciprocal of the success rate in attempts, so several successes take that many times as long. A salesperson closing $30\\%$ of calls needs on average $\\frac{5}{0.3} \\approx 16.67$ calls for $5$ sales.",
        "每次成功平均需要成功率倒数那么多次尝试，所以若干次成功需要相应倍数的次数。成交率为 $30\\%$ 的销售员，平均需要 $\\frac{5}{0.3} \\approx 16.67$ 次通话才能成交 $5$ 笔。",
      ),
      generate(rng) {
        const s = negBinStory(rng);
        const r = rng.int(2, 12);
        const p = Q.of(Math.round(s.p * 100), 100);
        const story = (x: string) => x.replace("PROB", dec(p));
        const askVar = rng.bool();
        const exact = askVar ? Q.of(r).mul(Q.of(1).sub(p)).div(p.pow(2)) : Q.of(r).div(p);
        const value = Q.of(Math.round(exact.toNumber() * 100), 100);
        const twoPlaces = t(" Round to two decimal places if necessary.", "如有需要，结果保留两位小数。");
        return numberProblem({
          prompt: t(
            `${story(s.en(r))}. Find the ${askVar ? "variance of the" : "expected"} number of attempts.${twoPlaces.en}`,
            `${story(s.zh(r))}。求尝试次数的${askVar ? "方差" : "期望"}。${twoPlaces["zh-CN"]}`,
          ),
          answer: value,
          form: "decimal",
          wrong: askVar
            ? [Q.of(Math.round((r * (1 - s.p) * 100) / s.p), 100), Q.of(Math.round((r * 100) / s.p), 100)]
            : [Q.of(Math.round(r * s.p * 100), 100), Q.of(Math.round((r * 100) / (1 - s.p)), 100)],
          solution: askVar
            ? t(
                `$\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2} = \\frac{${r} \\cdot ${dec(Q.of(1).sub(p))}}{${dec(p)}^2} ${exact.eq(value) ? "=" : "\\approx"} ${dec(value)}$.`,
                `$\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2} = \\frac{${r} \\cdot ${dec(Q.of(1).sub(p))}}{${dec(p)}^2} ${exact.eq(value) ? "=" : "\\approx"} ${dec(value)}$。`,
              )
            : t(
                `$E(X) = \\frac{r}{p} = \\frac{${r}}{${dec(p)}} ${exact.eq(value) ? "=" : "\\approx"} ${dec(value)}$.`,
                `$E(X) = \\frac{r}{p} = \\frac{${r}}{${dec(p)}} ${exact.eq(value) ? "=" : "\\approx"} ${dec(value)}$。`,
              ),
        });
      },
    },
  ],
};

/** hyperP is P(X = k) for k special items among n drawn from N items of which K are special. */
const hyperP = (N: number, K: number, n: number, k: number) => Q.of(choose(K, k) * choose(N - K, n - k), choose(N, n));

/** HyperStory is a context of drawing without replacement. */
interface HyperStory {
  readonly N: number;
  readonly K: number;
  readonly n: number;
  readonly en: string;
  readonly zh: string;
  readonly item: Text;
}

/** hyperStory picks a population, the special items and the sample size. */
function hyperStory(rng: Rng): HyperStory {
  const N = rng.int(8, 20);
  const K = rng.int(2, Math.min(8, N - 3));
  const n = rng.int(2, Math.min(6, N - 2));
  return rng.pick([
    {
      N,
      K,
      n,
      en: `A box holds $${N}$ bulbs, of which $${K}$ are faulty. $${n}$ bulbs are chosen at random without replacement`,
      zh: `一个盒子里有 $${N}$ 个灯泡，其中 $${K}$ 个是坏的。不放回地随机取出 $${n}$ 个`,
      item: t("faulty bulbs", "坏灯泡"),
    },
    {
      N,
      K,
      n,
      en: `A class has $${N}$ students, $${K}$ of whom are left-handed. A committee of $${n}$ is chosen at random`,
      zh: `一个班有 $${N}$ 名学生，其中 $${K}$ 名是左撇子。随机选出 $${n}$ 人组成委员会`,
      item: t("left-handed members", "左撇子成员"),
    },
    {
      N,
      K,
      n,
      en: `A bag holds $${K}$ red and $${N - K}$ white marbles. $${n}$ marbles are drawn at random without replacement`,
      zh: `袋中有 $${K}$ 个红球和 $${N - K}$ 个白球。不放回地随机摸出 $${n}$ 个`,
      item: t("red marbles", "红球"),
    },
  ]);
}

/** theHypergeometricDistribution counts special items in a sample drawn without replacement. */
export const theHypergeometricDistribution: TopicDef = {
  id: "the-hypergeometric-distribution",
  title: t("The Hypergeometric Distribution", "超几何分布"),
  summary: t(
    "Drawing n items without replacement from N items of which K are special, the number X of special items drawn is hypergeometric, with mean E(X) = nK/N.",
    "从 N 件物品（其中 K 件特殊）中不放回地抽取 n 件，抽到的特殊物品数 X 服从超几何分布，均值 E(X) = nK/N。",
  ),
  prerequisites: ["combinations", "probability-mass-functions-of-discrete-random-variables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "hypergeometric-point-probabilities",
      title: t("Point probabilities", "单点概率"),
      explanation: t(
        "When sampling without replacement, count the ways to choose the right number from each group and divide by all the ways to choose the sample. From $10$ bulbs with $3$ faulty, choose $4$. Exactly $1$ faulty: $\\frac{\\binom{3}{1}\\binom{7}{3}}{\\binom{10}{4}} = \\frac{3 \\cdot 35}{210} = \\frac{1}{2}$.",
        "不放回抽样时，数出从每组中选出所需个数的方法数，再除以选出整个样本的所有方法数。从 $10$ 个灯泡（$3$ 个坏的）中取 $4$ 个。恰有 $1$ 个坏的：$\\frac{\\binom{3}{1}\\binom{7}{3}}{\\binom{10}{4}} = \\frac{3 \\cdot 35}{210} = \\frac{1}{2}$。",
      ),
      generate(rng) {
        const s = hyperStory(rng);
        const k = rng.int(Math.max(0, s.n - (s.N - s.K)), Math.min(s.n, s.K));
        const value = hyperP(s.N, s.K, s.n, k);
        const pK = Q.of(s.K, s.N);
        return numberProblem({
          prompt: t(
            `${s.en}. $X$ is the number of ${s.item.en}. Find $P(X = ${k})$.`,
            `${s.zh}。$X$ 表示${s.item["zh-CN"]}的个数。求 $P(X = ${k})$。`,
          ),
          answer: value,
          wrong: [
            Q.of(choose(s.n, k))
              .mul(pK.pow(k))
              .mul(
                Q.of(1)
                  .sub(pK)
                  .pow(s.n - k),
              ),
            Q.of(choose(s.K, k), choose(s.N, s.n)),
            Q.of(choose(s.K, k) * choose(s.N - s.K, s.n - k), choose(s.N, s.K)),
          ],
          solution: t(
            `$\\frac{\\binom{${s.K}}{${k}}\\binom{${s.N - s.K}}{${s.n - k}}}{\\binom{${s.N}}{${s.n}}} = \\frac{${choose(s.K, k) * choose(s.N - s.K, s.n - k)}}{${choose(s.N, s.n)}} = ${value.toLatex()}$.`,
            `$\\frac{\\binom{${s.K}}{${k}}\\binom{${s.N - s.K}}{${s.n - k}}}{\\binom{${s.N}}{${s.n}}} = \\frac{${choose(s.K, k) * choose(s.N - s.K, s.n - k)}}{${choose(s.N, s.n)}} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "mean-of-a-hypergeometric-variable",
      title: t("The mean", "均值"),
      explanation: t(
        "Each of the $n$ draws is special with probability $\\frac{K}{N}$, so by linearity $E(X) = \\frac{nK}{N}$, even though the draws are dependent. With $N = 10$, $K = 3$, $n = 4$: $E(X) = 1.2$.",
        "$n$ 次抽取中每次抽到特殊物品的概率都是 $\\frac{K}{N}$，所以由线性性 $E(X) = \\frac{nK}{N}$，尽管各次抽取并不独立。$N = 10$，$K = 3$，$n = 4$ 时：$E(X) = 1.2$。",
      ),
      generate(rng) {
        const s = hyperStory(rng);
        const value = Q.of(s.n * s.K, s.N);
        return numberProblem({
          prompt: t(`${s.en}. Find the expected number of ${s.item.en}.`, `${s.zh}。求${s.item["zh-CN"]}个数的期望。`),
          answer: value,
          wrong: [Q.of(s.K, s.N), Q.of(s.n * (s.N - s.K), s.N), Q.of(s.n * s.K, s.N - s.n)],
          solution: t(
            `$E(X) = \\frac{nK}{N} = \\frac{${s.n} \\cdot ${s.K}}{${s.N}} = ${value.toLatex()}$.`,
            `$E(X) = \\frac{nK}{N} = \\frac{${s.n} \\cdot ${s.K}}{${s.N}} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** thePmfOfTheHypergeometricDistribution works with the whole pmf and the variance. */
export const thePmfOfTheHypergeometricDistribution: TopicDef = {
  id: "the-pmf-of-the-hypergeometric-distribution",
  title: t("The PMF of the Hypergeometric Distribution", "超几何分布的概率质量函数"),
  summary: t(
    "P(X = k) = C(K, k) C(N − K, n − k) / C(N, n) for max(0, n − N + K) ≤ k ≤ min(n, K); the variance is n(K/N)(1 − K/N)(N − n)/(N − 1).",
    "P(X = k) = C(K, k) C(N − K, n − k) / C(N, n)，其中 max(0, n − N + K) ≤ k ≤ min(n, K)；方差为 n(K/N)(1 − K/N)(N − n)/(N − 1)。",
  ),
  prerequisites: ["the-hypergeometric-distribution", "variance-of-discrete-random-variables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "hypergeometric-cumulative-probabilities",
      title: t("Cumulative probabilities", "累积概率"),
      explanation: t(
        "A cumulative probability adds point probabilities, and for at least one it is quicker to subtract the probability of none from one. From $10$ bulbs with $3$ faulty, choose $4$. At least one faulty: $1 - P(X = 0) = 1 - \\frac{\\binom{7}{4}}{\\binom{10}{4}} = 1 - \\frac{35}{210} = \\frac{5}{6}$.",
        "累积概率是若干点概率之和，对于至少一个的情形，用 1 减去一个都没有的概率更快。从 $10$ 个灯泡（$3$ 个坏的）中取 $4$ 个。至少一个坏的：$1 - P(X = 0) = 1 - \\frac{\\binom{7}{4}}{\\binom{10}{4}} = 1 - \\frac{35}{210} = \\frac{5}{6}$。",
      ),
      generate(rng) {
        const s = hyperStory(rng);
        const atLeast = rng.bool();
        const value = atLeast ? Q.of(1).sub(hyperP(s.N, s.K, s.n, 0)) : hyperP(s.N, s.K, s.n, 0).add(hyperP(s.N, s.K, s.n, 1));
        return numberProblem({
          prompt: atLeast
            ? t(`${s.en}. Find the probability of at least one of the ${s.item.en}.`, `${s.zh}。求至少有一个${s.item["zh-CN"]}的概率。`)
            : t(`${s.en}. Find the probability of at most one of the ${s.item.en}.`, `${s.zh}。求至多有一个${s.item["zh-CN"]}的概率。`),
          answer: value,
          wrong: atLeast
            ? [hyperP(s.N, s.K, s.n, 1), hyperP(s.N, s.K, s.n, 0)]
            : [hyperP(s.N, s.K, s.n, 1), Q.of(1).sub(hyperP(s.N, s.K, s.n, 1))],
          solution: atLeast
            ? t(
                `$1 - P(X = 0) = 1 - \\frac{\\binom{${s.N - s.K}}{${s.n}}}{\\binom{${s.N}}{${s.n}}} = ${value.toLatex()}$.`,
                `$1 - P(X = 0) = 1 - \\frac{\\binom{${s.N - s.K}}{${s.n}}}{\\binom{${s.N}}{${s.n}}} = ${value.toLatex()}$。`,
              )
            : t(
                `$P(X = 0) + P(X = 1) = \\frac{\\binom{${s.N - s.K}}{${s.n}} + ${s.K}\\binom{${s.N - s.K}}{${s.n - 1}}}{\\binom{${s.N}}{${s.n}}} = ${value.toLatex()}$.`,
                `$P(X = 0) + P(X = 1) = \\frac{\\binom{${s.N - s.K}}{${s.n}} + ${s.K}\\binom{${s.N - s.K}}{${s.n - 1}}}{\\binom{${s.N}}{${s.n}}} = ${value.toLatex()}$。`,
              ),
        });
      },
    },
    {
      id: "variance-of-a-hypergeometric-variable",
      title: t("The variance", "方差"),
      explanation: t(
        "The variance matches the binomial one times a correction factor, which is smaller than one because drawing without replacement reduces the spread. With $N = 10$, $K = 3$, $n = 4$: $\\operatorname{Var}(X) = 4 \\cdot \\frac{3}{10} \\cdot \\frac{7}{10} \\cdot \\frac{6}{9} = 0.56$, smaller than the binomial $0.84$ because sampling without replacement reduces spread.",
        "方差等于二项分布的方差乘以一个修正因子，这个因子小于 1，因为不放回抽取会减小波动。$N = 10$，$K = 3$，$n = 4$ 时：$\\operatorname{Var}(X) = 4 \\cdot \\frac{3}{10} \\cdot \\frac{7}{10} \\cdot \\frac{6}{9} = 0.56$，比二项分布的 $0.84$ 小，因为不放回抽样减小了离散程度。",
      ),
      generate(rng) {
        const s = hyperStory(rng);
        const pK = Q.of(s.K, s.N);
        const binom = Q.of(s.n).mul(pK).mul(Q.of(1).sub(pK));
        const value = binom.mul(Q.of(s.N - s.n, s.N - 1));
        return numberProblem({
          prompt: t(
            `${s.en}. $X$ is the number of ${s.item.en}. Find $\\operatorname{Var}(X)$.`,
            `${s.zh}。$X$ 表示${s.item["zh-CN"]}的个数。求 $\\operatorname{Var}(X)$。`,
          ),
          answer: value,
          wrong: [binom, Q.of(s.n * s.K, s.N), binom.mul(Q.of(s.N - s.n, s.N))],
          solution: t(
            `$\\operatorname{Var}(X) = n \\frac{K}{N}\\left(1 - \\frac{K}{N}\\right)\\frac{N - n}{N - 1} = ${s.n} \\cdot ${pK.toLatex()} \\cdot ${Q.of(1).sub(pK).toLatex()} \\cdot \\frac{${s.N - s.n}}{${s.N - 1}} = ${value.toLatex()}$.`,
            `$\\operatorname{Var}(X) = n \\frac{K}{N}\\left(1 - \\frac{K}{N}\\right)\\frac{N - n}{N - 1} = ${s.n} \\cdot ${pK.toLatex()} \\cdot ${Q.of(1).sub(pK).toLatex()} \\cdot \\frac{${s.N - s.n}}{${s.N - 1}} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** discreteMathematicsRandomVariableTopics are the new topics of Discrete Mathematics unit 3 on random variables. */
export const discreteMathematicsRandomVariableTopics: readonly TopicDef[] = [
  oneToOneTransformationsOfDiscreteRandomVariables,
  manyToOneTransformationsOfDiscreteRandomVariables,
  propertiesOfExpectationForDiscreteRandomVariables,
  varianceOfDiscreteRandomVariables,
  momentsOfDiscreteRandomVariables,
  propertiesOfVarianceForDiscreteRandomVariables,
  theDiscreteUniformDistribution,
  meanAndVarianceOfTheDiscreteUniformDistribution,
  modelingWithDiscreteUniformDistributions,
  theBernoulliDistribution,
  meanAndVarianceOfTheBernoulliDistribution,
  meanAndVarianceOfTheBinomialDistribution,
  thePoissonDistribution,
  modelingWithThePoissonDistribution,
  meanAndVarianceOfThePoissonDistribution,
  thePoissonApproximationOfTheBinomialDistribution,
  meanAndVarianceOfTheGeometricDistribution,
  theNegativeBinomialDistribution,
  modelingWithTheNegativeBinomialDistribution,
  theHypergeometricDistribution,
  thePmfOfTheHypergeometricDistribution,
];
