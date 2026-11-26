import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { probabilityDrawings1 } from "../explanation-drawings-probability-and-statistics-1.ts";

import { article, numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";
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

/** Mistake is a wrong value with what went wrong. */
type Mistake = ReturnType<typeof why>;

/** asQ reads a whole number or a rational as a rational. */
const asQ = (c: number | Q) => (c instanceof Q ? c : Q.of(c));

/** apart drops the mistakes equal to the answer or to an earlier mistake. */
const apart = (answer: number | Q, ms: readonly Mistake[]): Mistake[] =>
  ms.filter((m, i) => !asQ(m.value).eq(asQ(answer)) && ms.findIndex((o) => asQ(o.value).eq(asQ(m.value))) === i);

/** plus writes a constant term after another term: " + 3", " - 2", or nothing for zero. */
const plus = (c: number) => (c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`);

/** coef writes k·v with the coefficient 1 left out, as a first term or after another term. */
const coef = (k: number, v: string, first: boolean) => {
  const body = Math.abs(k) === 1 ? v : `${Math.abs(k)}${v}`;
  return first ? (k < 0 ? `-${body}` : body) : k < 0 ? ` - ${body}` : ` + ${body}`;
};

/** pw writes base^k, leaving out the exponent 1. */
const pw = (base: string | number, k: number) => (k === 1 ? `${base}` : `${base}^{${k}}`);

/** bp writes a power of a parenthesized base, leaving out the exponent 1. */
const bp = (base: string, k: number) => (k === 1 ? `\\left(${base}\\right)` : `\\left(${base}\\right)^{${k}}`);

/** listTex writes integers as a list, shortened with dots when there are many. */
const listTex = (lo: number, hi: number) => (hi - lo >= 4 ? `${lo}, ${lo + 1}, \\dots, ${hi}` : range(lo, hi).join(", "));

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

/** pOf is the probability of one value. */
const pOf = (d: Dist, x: number) => probOf(d, (u) => u === x);

/** addTex writes the probabilities of some values as a sum equal to their total, or just the total for one value. */
const addTex = (d: Dist, xs: readonly number[]) => {
  const total = qt(probOf(d, (x) => xs.includes(x)));
  return xs.length === 1 ? total : `${xs.map((x) => qt(pOf(d, x))).join(" + ")} = ${total}`;
};

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
  intro: t(
    "Let $X$ take the values $-1, 0, 2$ with probabilities $0.2, 0.5, 0.3$, and let $Y = 3X - 1$. Each value of $X$ gives exactly one value of $Y$: $-1 \\mapsto -4$, $0 \\mapsto -1$ and $2 \\mapsto 5$, so $Y$ takes the values $-4, -1, 5$ with the same probabilities $0.2, 0.5, 0.3$. In particular $P(Y = 5) = P(X = 2) = 0.3$, and $Y > 0$ means $3X - 1 > 0$, that is $X > \\frac{1}{3}$, so $P(Y > 0) = P(X = 2) = 0.3$.\n\nCheck: the probabilities of $Y$ still add to $0.2 + 0.5 + 0.3 = 1$, and solving $3x - 1 = 5$ gives $x = 2$ and nothing else, so no probability was counted twice or lost.\n\nIn this lesson we find the probabilities of a linear function $Y = aX + b$ by solving for $x$ and reading the table of $X$, and we turn events about $Y$ into inequalities about $X$, reversing the inequality when $a$ is negative.",
    "设 $X$ 取 $-1, 0, 2$，概率分别为 $0.2, 0.5, 0.3$，令 $Y = 3X - 1$。$X$ 的每个值恰好给出 $Y$ 的一个值：$-1 \\mapsto -4$，$0 \\mapsto -1$，$2 \\mapsto 5$，所以 $Y$ 取 $-4, -1, 5$，概率仍为 $0.2, 0.5, 0.3$。特别地，$P(Y = 5) = P(X = 2) = 0.3$；而 $Y > 0$ 即 $3X - 1 > 0$，也就是 $X > \\frac{1}{3}$，所以 $P(Y > 0) = P(X = 2) = 0.3$。\n\n检验：$Y$ 的概率之和仍为 $0.2 + 0.5 + 0.3 = 1$；解 $3x - 1 = 5$ 只得到 $x = 2$，所以没有概率被重复计算或遗漏。\n\n本课我们通过解出 $x$ 并查 $X$ 的分布表来求线性函数 $Y = aX + b$ 的概率，并把关于 $Y$ 的事件转化为关于 $X$ 的不等式，$a$ 为负数时不等号要反向。",
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
        "A linear transformation matches each value of the new variable with exactly one value of the old one, so their probabilities are equal. If $Y = 2X + 1$, then $Y = 7$ exactly when $X = 3$, so $P(Y = 7) = P(X = 3)$. Solve $y = g(x)$ for $x$ and read the table.\n\n> **Watch out.** Look up the solved value $x$ in the table, not $y$ itself. With $Y = 2X + 1$, $P(Y = 3)$ is $P(X = 1)$, not $P(X = 3)$.",
        "线性变换使新变量的每个值恰好对应旧变量的一个值，所以它们的概率相等。若 $Y = 2X + 1$，则 $Y = 7$ 当且仅当 $X = 3$，所以 $P(Y = 7) = P(X = 3)$。由 $y = g(x)$ 解出 $x$ 再查表。\n\n> **注意。** 在表中查的是解出的 $x$，而不是 $y$ 本身。取 $Y = 2X + 1$，$P(Y = 3)$ 等于 $P(X = 1)$，而不是 $P(X = 3)$。",
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
        const near = d.xs[i + 1] ?? d.xs[i - 1]!;
        const backwards = (y + b) / a;
        return numberProblem({
          prompt: t(`${intro.en}Let $Y = ${linTex(a, b)}$. Find $P(Y = ${y})$.`, `${intro.zh}设 $Y = ${linTex(a, b)}$。求 $P(Y = ${y})$。`),
          answer: value,
          mistakes: apart(value, [
            why(
              pOf(d, y),
              `That is $P(X = ${y})$: it looks up $${y}$ in the table of $X$. First solve $${linTex(a, b, "x")} = ${y}$ for $x$.`,
              `这是 $P(X = ${y})$：它在 $X$ 的表中查了 $${y}$。应先由 $${linTex(a, b, "x")} = ${y}$ 解出 $x$。`,
            ),
            why(
              pOf(d, near),
              `That is $P(X = ${near})$, but $X = ${near}$ gives $Y = ${a * near + b}$; only $X = ${x}$ gives $Y = ${y}$.`,
              `这是 $P(X = ${near})$，但 $X = ${near}$ 给出 $Y = ${a * near + b}$；只有 $X = ${x}$ 给出 $Y = ${y}$。`,
            ),
            ...(Number.isInteger(backwards) && d.xs.includes(backwards) && b !== 0
              ? [
                  why(
                    pOf(d, backwards),
                    `That adds $${b}$ instead of subtracting it when solving for $x$, which gives $x = ${backwards}$.`,
                    `这是在解 $x$ 时把 $${b}$ 加上而不是减去，得到 $x = ${backwards}$。`,
                  ),
                ]
              : []),
            why(
              Q.of(1).sub(value),
              `That is $P(Y \\ne ${y})$, the probability that $Y$ takes any other value.`,
              `这是 $P(Y \\ne ${y})$，即 $Y$ 取其他值的概率。`,
            ),
            why(
              probOf(d, (u) => a * u + b <= y),
              `That is $P(Y \\le ${y})$, which adds the smaller values of $Y$ as well.`,
              `这是 $P(Y \\le ${y})$，把 $Y$ 更小的值也加进去了。`,
            ),
            why(
              probOf(d, (u) => a * u + b >= y),
              `That is $P(Y \\ge ${y})$, which adds the larger values of $Y$ as well.`,
              `这是 $P(Y \\ge ${y})$，把 $Y$ 更大的值也加进去了。`,
            ),
            why(
              Q.of(1, d.xs.length),
              "That treats every value as equally likely; read the probability from the table.",
              "这把每个值都当作同样可能；应从表中读出概率。",
            ),
            why(
              value.mul(Q.of(Math.abs(a))),
              `That multiplies the probability by $${Math.abs(a)}$; transforming the values of $X$ does not change their probabilities.`,
              `这把概率乘以了 $${Math.abs(a)}$；变换 $X$ 的取值不会改变它们的概率。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Solve for $x$", "解出 $x$"],
                t(`Set the formula for $Y$ equal to $${y}$:`, `令 $Y$ 的表达式等于 $${y}$：`),
                [`${linTex(a, b, "x")} = ${y}`, `x = ${x}`],
              ],
              [
                ["Read the table", "查表"],
                t("The two events are the same, so they have the same probability:", "两个事件相同，所以概率相同："),
                [`P(Y = ${y}) = P(X = ${x}) = ${qt(value)}`],
              ],
            ],
            t(
              `Substituting back, $${a} \\cdot ${par(x)}${plus(b)} = ${y}$, and since the coefficient $${a}$ is not zero, no other value of $x$ gives $${y}$.`,
              `代回得 $${a} \\cdot ${par(x)}${plus(b)} = ${y}$；由于系数 $${a}$ 不为零，没有别的 $x$ 能给出 $${y}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "events-of-a-linear-transformation",
      title: t("Events for Y = aX + b", "Y = aX + b 的事件"),
      explanation: t(
        "Rewrite the event about the new variable as an inequality about the old one, remembering to reverse the inequality when dividing by a negative number. With $Y = -2X + 3$: $Y > 0$ means $-2X + 3 > 0$, that is, $X < 1.5$. Dividing by a negative number reverses the inequality.\n\n> **Watch out.** Keeping the direction after dividing by a negative number picks the wrong values. With $Y = -2X + 3$, $Y > 0$ holds for $X = 0$ and $X = 1$; the values $X = 2$ and $X = 3$ give $Y = -1$ and $Y = -3$.",
        "把关于新变量的事件改写成关于旧变量的不等式，除以负数时记得改变不等号的方向。取 $Y = -2X + 3$：$Y > 0$ 即 $-2X + 3 > 0$，也就是 $X < 1.5$。除以负数时不等号要反向。\n\n> **注意。** 除以负数后若不改变方向，就会选错取值。取 $Y = -2X + 3$，$Y > 0$ 对 $X = 0$ 和 $X = 1$ 成立；而 $X = 2$ 和 $X = 3$ 给出 $Y = -1$ 和 $Y = -3$。",
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
        const rest = d.xs.filter((x) => a * x + b <= cut);
        const bound = Q.of(cut - b, a);
        const intro = distIntro(d);
        return numberProblem({
          prompt: t(
            `${intro.en}Let $Y = ${linTex(a, b)}$. Find $P(Y > ${cut})$.`,
            `${intro.zh}设 $Y = ${linTex(a, b)}$。求 $P(Y > ${cut})$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              Q.of(1).sub(value),
              `That is $P(Y \\le ${cut})$, the complement of the event asked for.`,
              `这是 $P(Y \\le ${cut})$，是所求事件的补事件。`,
            ),
            why(
              probOf(d, (x) => x > cut),
              `That is $P(X > ${cut})$: the inequality was applied to $X$ itself. Rewrite $Y > ${cut}$ in terms of $X$ first.`,
              `这是 $P(X > ${cut})$：把不等式直接用在了 $X$ 上。应先把 $Y > ${cut}$ 改写成关于 $X$ 的不等式。`,
            ),
            why(
              probOf(d, (x) => bound.cmp(Q.of(x)) < 0),
              `That divides by $${a}$ without reversing the inequality; dividing by a negative number turns $>$ into $<$.`,
              `这是除以 $${a}$ 时没有改变不等号方向；除以负数时 $>$ 要变成 $<$。`,
            ),
            why(
              probOf(d, (x) => a * x + b >= cut),
              `That also counts the values with $Y = ${cut}$; the inequality is strict.`,
              `这把 $Y = ${cut}$ 的值也算进去了；不等号是严格的。`,
            ),
            why(
              Q.of(xs.length, d.xs.length),
              "That counts the values that qualify as if all values were equally likely; add their probabilities from the table.",
              "这把符合条件的值的个数当作各值等可能来算；应把它们在表中的概率相加。",
            ),
            ...(xs.length > 1
              ? [
                  why(
                    pOf(d, xs[0]!),
                    `That keeps only $X = ${xs[0]}$; every value in $${xs.join(", ")}$ satisfies the event.`,
                    `这只保留了 $X = ${xs[0]}$；$${xs.join(", ")}$ 中的每个值都满足该事件。`,
                  ),
                ]
              : []),
          ]),
          solution: walked(
            [
              [
                ["Rewrite the event", "改写事件"],
                a < 0
                  ? t(`Solve for $X$; dividing by $${a}$ reverses the inequality:`, `解出 $X$；除以 $${a}$ 时不等号反向：`)
                  : t("Solve for $X$:", "解出 $X$："),
                [`${linTex(a, b)} > ${cut}`, `X ${a > 0 ? ">" : "<"} ${bound.toLatex()}`],
              ],
              [
                ["Add the probabilities", "把概率相加"],
                t(
                  `The values of $X$ in the table that satisfy this are $${xs.join(", ")}$:`,
                  `表中满足该条件的 $X$ 的值是 $${xs.join(", ")}$：`,
                ),
                [`P(Y > ${cut}) = ${addTex(d, xs)}`],
              ],
            ],
            t(
              `The other values, $x \\in \\{${rest.join(", ")}\\}$, give $Y < ${cut}$, with total probability $${qt(Q.of(1).sub(value))}$, and $${qt(value)} + ${qt(Q.of(1).sub(value))} = 1$.`,
              `其余的值 $x \\in \\{${rest.join(", ")}\\}$ 给出 $Y < ${cut}$，总概率为 $${qt(Q.of(1).sub(value))}$，而 $${qt(value)} + ${qt(Q.of(1).sub(value))} = 1$。`,
            ),
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
  intro: t(
    "Let $X$ take the values $-2, -1, 1, 2$ with probabilities $0.1, 0.3, 0.4, 0.2$, and let $Y = X^2$. Two values of $X$ go to each value of $Y$: $Y = 1$ when $X = -1$ or $X = 1$, and $Y = 4$ when $X = -2$ or $X = 2$. So $P(Y = 1) = 0.3 + 0.4 = 0.7$ and $P(Y = 4) = 0.1 + 0.2 = 0.3$. For an event, $Y \\le 1$ means $-1 \\le X \\le 1$, so $P(Y \\le 1) = 0.7$.\n\nCheck: $Y$ takes only the values $1$ and $4$, and $0.7 + 0.3 = 1$, so every value of $X$ was counted exactly once.\n\nIn this lesson we find probabilities of many-to-one transformations such as $X^2$ and $|X|$ by collecting every value of $X$ with the same image and adding their probabilities, both for single values and for events such as $Y \\le c$.",
    "设 $X$ 取 $-2, -1, 1, 2$，概率分别为 $0.1, 0.3, 0.4, 0.2$，令 $Y = X^2$。$X$ 的两个值对应 $Y$ 的同一个值：$X = -1$ 或 $X = 1$ 时 $Y = 1$，$X = -2$ 或 $X = 2$ 时 $Y = 4$。所以 $P(Y = 1) = 0.3 + 0.4 = 0.7$，$P(Y = 4) = 0.1 + 0.2 = 0.3$。对于事件，$Y \\le 1$ 即 $-1 \\le X \\le 1$，所以 $P(Y \\le 1) = 0.7$。\n\n检验：$Y$ 只取 $1$ 和 $4$ 两个值，且 $0.7 + 0.3 = 1$，所以 $X$ 的每个值恰好算了一次。\n\n本课我们求 $X^2$、$|X|$ 这类多对一变换的概率：把像相同的 $X$ 的值都找出来，把它们的概率相加，既用于单个取值，也用于 $Y \\le c$ 这样的事件。",
  ),
  prerequisites: ["one-to-one-transformations-of-discrete-random-variables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "probabilities-of-squares-and-absolute-values",
      title: t("Probabilities of $X^2$ and $|X|$", "$X^2$ 与 $|X|$ 的概率"),
      explanation: t(
        "Squaring or taking absolute values sends two opposite values to the same result, so add the probabilities of both values that produce it. If $Y = X^2$, then $Y = 4$ when $X = 2$ or $X = -2$: $P(Y = 4) = P(X = -2) + P(X = 2)$.\n\n> **Watch out.** The two values with the same image are not always opposites. With $Y = (X - 1)^2$, $Y = 4$ comes from $X = 3$ and $X = -1$, not from $X = 2$ and $X = -2$.",
        "平方或取绝对值会把两个相反的值映射到同一个结果，所以要把产生它的两个值的概率加起来。若 $Y = X^2$，则 $X = 2$ 或 $X = -2$ 时 $Y = 4$：$P(Y = 4) = P(X = -2) + P(X = 2)$。\n\n> **注意。** 像相同的两个值不一定互为相反数。取 $Y = (X - 1)^2$，$Y = 4$ 来自 $X = 3$ 和 $X = -1$，而不是 $X = 2$ 和 $X = -2$。",
      ),
      generate(rng) {
        let d: Dist;
        let y: number;
        const kind = rng.int(0, 2);
        const g = [(x: number) => x * x, (x: number) => Math.abs(x), (x: number) => (x - 1) ** 2][kind]!;
        const gTex = ["X^2", "|X|", "(X - 1)^2"][kind]!;
        const show = [(x: number) => `${par(x)}^2`, (x: number) => `|${x}|`, (x: number) => `(${x} - 1)^2`][kind]!;
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
        const others = [...new Set(d.xs.filter((x) => g(x) !== y).map(g))].sort((p, q) => p - q);
        const value = probOf(d, (x) => g(x) === y);
        const intro = distIntro(d);
        return numberProblem({
          prompt: t(`${intro.en}Let $Y = ${gTex}$. Find $P(Y = ${y})$.`, `${intro.zh}设 $Y = ${gTex}$。求 $P(Y = ${y})$。`),
          answer: value,
          mistakes: apart(value, [
            ...xs.map((x) =>
              why(
                pOf(d, x),
                `That counts only $X = ${x}$; ${xs
                  .filter((u) => u !== x)
                  .map((u) => `$X = ${u}$`)
                  .join(" and ")} also give${xs.length > 2 ? "" : "s"} $Y = ${y}$.`,
                `这只算了 $X = ${x}$；${xs
                  .filter((u) => u !== x)
                  .map((u) => `$X = ${u}$`)
                  .join("和")}也给出 $Y = ${y}$。`,
              ),
            ),
            why(
              pOf(d, y),
              `That is $P(X = ${y})$, a value of $X$; the question is about the value $${y}$ of $Y$.`,
              `这是 $P(X = ${y})$，是 $X$ 的取值；题目问的是 $Y$ 取 $${y}$。`,
            ),
            why(Q.of(1).sub(value), `That is $P(Y \\ne ${y})$, the complement.`, `这是 $P(Y \\ne ${y})$，是补事件的概率。`),
            why(
              probOf(d, (x) => g(x) <= y),
              `That is $P(Y \\le ${y})$, which adds the smaller values of $Y$ as well.`,
              `这是 $P(Y \\le ${y})$，把 $Y$ 更小的值也加进去了。`,
            ),
            why(
              Q.of(xs.length, d.xs.length),
              `That counts the $${xs.length}$ values as if all were equally likely; add their probabilities from the table.`,
              `这按各值等可能来数这 $${xs.length}$ 个值；应把它们在表中的概率相加。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find every $x$ with this image", "找出所有像为该值的 $x$"],
                t(
                  `Apply $Y = ${gTex}$ to each value in the table; these give $${y}$:`,
                  `对表中每个值计算 $Y = ${gTex}$；下面这些得到 $${y}$：`,
                ),
                [xs.map((x) => `${show(x)} = ${y}`).join(", \\quad ")],
              ],
              [
                ["Add their probabilities", "把它们的概率相加"],
                t("The event $Y = y$ is the union of these values of $X$:", "事件 $Y = y$ 是 $X$ 的这些取值的并："),
                [`P(Y = ${y}) = ${addTex(d, xs)}`],
              ],
            ],
            t(
              `The other values in the table give $Y \\in \\{${others.join(", ")}\\}$, none of them $${y}$, so no value was left out.`,
              `表中其余的值给出 $Y \\in \\{${others.join(", ")}\\}$，都不是 $${y}$，所以没有遗漏。`,
            ),
          ),
        });
      },
    },
    {
      id: "cumulative-probabilities-of-many-to-one-transformations",
      figure:
        probabilityDrawings1[
          "many-to-one-transformations-of-discrete-random-variables#cumulative-probabilities-of-many-to-one-transformations"
        ],
      title: t("Events for many-to-one transformations", "多对一变换的事件"),
      explanation: t(
        "Translate the event into the set of original values that satisfy it, which for a square is an interval centered at zero, and add their probabilities. With $Y = X^2$: $Y \\le 4$ means $-2 \\le X \\le 2$, so add the probabilities of all $x$ in that range.\n\n> **Watch out.** $Y \\le c$ is not the same event as $X \\le c$: large negative values of $X$ are left out. With $Y = X^2$, $Y \\le 4$ excludes $X = -3$, although $-3 \\le 4$.",
        "把事件转化为满足它的原始取值的集合，对平方来说这是一个以零为中心的区间，再把这些值的概率加起来。取 $Y = X^2$：$Y \\le 4$ 即 $-2 \\le X \\le 2$，所以把该范围内所有 $x$ 的概率相加。\n\n> **注意。** $Y \\le c$ 与 $X \\le c$ 不是同一个事件：绝对值较大的负值要排除。取 $Y = X^2$，$Y \\le 4$ 不包括 $X = -3$，尽管 $-3 \\le 4$。",
      ),
      generate(rng) {
        const d = randomDist(rng, -3, 4, rng.int(4, 6));
        const square = rng.bool();
        const g = (x: number) => (square ? x * x : Math.abs(x));
        const images = [...new Set(d.xs.map(g))].sort((a, b) => a - b);
        const c = rng.pick(images.slice(0, -1));
        const r = square ? Math.round(Math.sqrt(c)) : c;
        const xs = d.xs.filter((x) => g(x) <= c);
        const rest = d.xs.filter((x) => g(x) > c);
        const value = probOf(d, (x) => g(x) <= c);
        const intro = distIntro(d);
        const gTex = square ? "X^2" : "|X|";
        return numberProblem({
          prompt: t(`${intro.en}Let $Y = ${gTex}$. Find $P(Y \\le ${c})$.`, `${intro.zh}设 $Y = ${gTex}$。求 $P(Y \\le ${c})$。`),
          answer: value,
          mistakes: apart(value, [
            why(
              probOf(d, (x) => x <= c),
              `That is $P(X \\le ${c})$: it applies the inequality to $X$ and keeps negative values whose ${square ? "square" : "absolute value"} is larger than $${c}$.`,
              `这是 $P(X \\le ${c})$：把不等式用在了 $X$ 上，保留了${square ? "平方" : "绝对值"}大于 $${c}$ 的负值。`,
            ),
            why(
              probOf(d, (x) => g(x) < c),
              `That leaves out the values with $Y = ${c}$ exactly; the event $Y \\le ${c}$ includes them.`,
              `这漏掉了 $Y = ${c}$ 的值；事件 $Y \\le ${c}$ 包括它们。`,
            ),
            why(
              probOf(d, (x) => x >= 0 && g(x) <= c),
              `That keeps only the non-negative values of $X$; the negative values from $-${r}$ up also satisfy $Y \\le ${c}$.`,
              `这只保留了 $X$ 的非负值；从 $-${r}$ 起的负值也满足 $Y \\le ${c}$。`,
            ),
            why(Q.of(1).sub(value), `That is $P(Y > ${c})$, the complement.`, `这是 $P(Y > ${c})$，是补事件的概率。`),
          ]),
          solution: walked(
            [
              [
                ["Rewrite the event", "改写事件"],
                t("Find the values of $X$ that satisfy it:", "找出满足它的 $X$ 的范围："),
                [`${gTex} \\le ${c}`, r === 0 ? "X = 0" : `-${r} \\le X \\le ${r}`],
              ],
              [
                ["Add the probabilities", "把概率相加"],
                t(
                  `The values of $X$ in the table in this range are $${xs.join(", ")}$:`,
                  `表中在此范围内的 $X$ 的值是 $${xs.join(", ")}$：`,
                ),
                [`P(Y \\le ${c}) = ${addTex(d, xs)}`],
              ],
            ],
            t(
              `The remaining values, $x \\in \\{${rest.join(", ")}\\}$, give $Y > ${c}$ with total probability $${qt(Q.of(1).sub(value))}$, and the two totals add to $1$.`,
              `其余的值 $x \\in \\{${rest.join(", ")}\\}$ 给出 $Y > ${c}$，总概率为 $${qt(Q.of(1).sub(value))}$，两个总和相加为 $1$。`,
            ),
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
  intro: t(
    "Suppose $E(X) = 4$ and $E(Y) = -1$. By linearity, $E(2X - 3Y + 5) = 2 \\cdot 4 - 3 \\cdot (-1) + 5 = 16$, whatever the joint behaviour of $X$ and $Y$. A function that is not linear needs the whole distribution: if $X$ takes $0, 1, 3$ with probabilities $0.5, 0.3, 0.2$, then $E(X^2) = 0 \\cdot 0.5 + 1 \\cdot 0.3 + 9 \\cdot 0.2 = 2.1$, while $E(X) = 0.9$ and $E(X)^2 = 0.81$.\n\nCheck: if $X$ and $Y$ were the constants $4$ and $-1$, the expression would equal $8 + 3 + 5 = 16$ exactly; and $2.1$ lies between the smallest and the largest values $0$ and $9$ of $X^2$, as a weighted average must.\n\nIn this lesson we use linearity to find the expectation of combinations such as $aX + bY + c$, and we find $E(g(X))$ for other functions by weighting each value $g(x)$ by $P(X = x)$.",
    "设 $E(X) = 4$，$E(Y) = -1$。由线性性，$E(2X - 3Y + 5) = 2 \\cdot 4 - 3 \\cdot (-1) + 5 = 16$，与 $X$、$Y$ 的联合情况无关。非线性的函数则需要整个分布：若 $X$ 取 $0, 1, 3$，概率为 $0.5, 0.3, 0.2$，则 $E(X^2) = 0 \\cdot 0.5 + 1 \\cdot 0.3 + 9 \\cdot 0.2 = 2.1$，而 $E(X) = 0.9$，$E(X)^2 = 0.81$。\n\n检验：若 $X$ 与 $Y$ 分别是常数 $4$ 和 $-1$，表达式恰好等于 $8 + 3 + 5 = 16$；$2.1$ 介于 $X^2$ 的最小值 $0$ 与最大值 $9$ 之间，加权平均理应如此。\n\n本课我们用线性性求 $aX + bY + c$ 这类组合的期望，对其他函数则用 $P(X = x)$ 对每个 $g(x)$ 加权求出 $E(g(X))$。",
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
        "Expectation passes through sums and constant multiples, so the mean of a combination is the same combination of the means. If $E(X) = 4$ and $E(Y) = -1$, then $E(3X - 2Y + 5) = 3 \\cdot 4 - 2 \\cdot (-1) + 5 = 19$. No independence is needed.\n\n> **Watch out.** A minus sign stays with its coefficient, and the constant is added once. With $E(X) = 2$ and $E(Y) = 3$: $E(X - 4Y + 1) = 2 - 12 + 1 = -9$, not $2 + 12 + 1 = 15$.",
        "期望可以穿过和与常数倍，所以组合的均值等于各均值的同样组合。若 $E(X) = 4$，$E(Y) = -1$，则 $E(3X - 2Y + 5) = 3 \\cdot 4 - 2 \\cdot (-1) + 5 = 19$。这不需要独立性。\n\n> **注意。** 负号要跟着它的系数，常数只加一次。取 $E(X) = 2$，$E(Y) = 3$：$E(X - 4Y + 1) = 2 - 12 + 1 = -9$，而不是 $2 + 12 + 1 = 15$。",
      ),
      generate(rng) {
        const ex = rng.int(-6, 9);
        const ey = rng.int(-6, 9);
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const c = rng.int(-9, 9);
        const value = a * ex + b * ey + c;
        const expr = `${coef(a, "X", true)}${coef(b, "Y", false)}${plus(c)}`;
        return numberProblem({
          prompt: t(`$E(X) = ${ex}$ and $E(Y) = ${ey}$. Find $E(${expr})$.`, `$E(X) = ${ex}$，$E(Y) = ${ey}$。求 $E(${expr})$。`),
          answer: value,
          mistakes: apart(value, [
            why(
              a * ex + b * ey,
              `That leaves out the constant $${c}$; it is added to the mean unchanged.`,
              `这漏掉了常数 $${c}$；它原样加到均值上。`,
            ),
            why(
              a * ex - b * ey + c,
              `That changes the sign of the coefficient $${b}$ of $Y$; it multiplies $E(Y) = ${ey}$ with its own sign.`,
              `这改变了 $Y$ 的系数 $${b}$ 的符号；应带着它自己的符号去乘 $E(Y) = ${ey}$。`,
            ),
            why(
              ex + ey + c,
              "That ignores the coefficients of $X$ and $Y$; each mean is multiplied by its coefficient.",
              "这忽略了 $X$ 与 $Y$ 的系数；每个均值都要乘以它的系数。",
            ),
            why(
              a * a * ex + b * b * ey + c,
              "That squares the coefficients, as for a variance; an expectation uses them as they are.",
              "这把系数平方了，那是方差的做法；期望直接使用系数本身。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Apply linearity", "用线性性"],
                t("The expectation of the combination is the same combination of the expectations:", "组合的期望等于各期望的同样组合："),
                [`E(${expr}) = ${coef(a, "E(X)", true)}${coef(b, "E(Y)", false)}${plus(c)}`],
              ],
              [
                ["Substitute the means", "代入均值"],
                t(`Put in $E(X) = ${ex}$ and $E(Y) = ${ey}$:`, `代入 $E(X) = ${ex}$ 和 $E(Y) = ${ey}$：`),
                [`= ${a} \\cdot ${par(ex)}${b < 0 ? " - " : " + "}${Math.abs(b)} \\cdot ${par(ey)}${plus(c)}`, `= ${value}`],
              ],
            ],
            t(
              `If $X$ and $Y$ were the constants $${ex}$ and $${ey}$, the expression would equal $${a * ex}${plus(b * ey)}${plus(c)} = ${value}$ exactly, and the expectation of a constant is that constant.`,
              `若 $X$ 与 $Y$ 分别是常数 $${ex}$ 和 $${ey}$，表达式恰好等于 $${a * ex}${plus(b * ey)}${plus(c)} = ${value}$，而常数的期望就是它本身。`,
            ),
          ),
        });
      },
    },
    {
      id: "expected-value-of-a-function",
      title: t("Expected value of g(X)", "g(X) 的期望"),
      explanation: t(
        "To find the mean of a function of a variable, apply the function to each value and weight the results by the original probabilities. Weight each value of $g(x)$ by $P(X = x)$: if $X$ is $-1, 0, 2$ with probabilities $0.2, 0.5, 0.3$, then $E(X^2) = 1 \\cdot 0.2 + 0 \\cdot 0.5 + 4 \\cdot 0.3 = 1.4$. In general $E(X^2) \\ne E(X)^2$.\n\n> **Watch out.** Apply $g$ to each value before averaging, not to the mean. If $X$ is $-1$ or $1$ with probability $\\frac{1}{2}$ each, then $E(X^2) = 1$, but $E(X)^2 = 0^2 = 0$.",
        "要求变量的函数的均值，就把函数作用在每个取值上，再用原来的概率对结果加权。用 $P(X = x)$ 对每个 $g(x)$ 加权：若 $X$ 取 $-1, 0, 2$ 的概率为 $0.2, 0.5, 0.3$，则 $E(X^2) = 1 \\cdot 0.2 + 0 \\cdot 0.5 + 4 \\cdot 0.3 = 1.4$。一般 $E(X^2) \\ne E(X)^2$。\n\n> **注意。** 要先对每个取值作用 $g$ 再求平均，而不是对均值作用 $g$。若 $X$ 以各 $\\frac{1}{2}$ 的概率取 $-1$ 或 $1$，则 $E(X^2) = 1$，但 $E(X)^2 = 0^2 = 0$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const d = randomDist(rng, kind === 2 ? 0 : -3, 5);
        const g = [(x: number) => x * x, (x: number) => Math.abs(x - 1), (x: number) => 2 ** x][kind]!;
        const gTex = ["X^2", "|X - 1|", "2^X"][kind]!;
        const gx = ["x^2", "|x - 1|", "2^x"][kind]!;
        const show = [(x: number) => `${par(x)}^2`, (x: number) => `|${x} - 1|`, (x: number) => `2^${x}`][kind]!;
        const value = expect(d, g);
        const intro = distIntro(d);
        const gs = d.xs.map(g);
        const m = expect(d);
        return numberProblem({
          prompt: t(`${intro.en}Find $E(${gTex})$.`, `${intro.zh}求 $E(${gTex})$。`),
          answer: value,
          mistakes: apart(value, [
            ...(kind === 0
              ? [
                  why(
                    m.pow(2),
                    `That is $E(X)^2 = (${qt(m)})^2$: it squares the mean instead of averaging the squares.`,
                    `这是 $E(X)^2 = (${qt(m)})^2$：把均值平方了，而不是对平方求平均。`,
                  ),
                ]
              : kind === 1
                ? [
                    why(
                      m.sub(Q.of(1)).abs(),
                      `That is $|E(X) - 1|$: it applies the function to the mean instead of to each value.`,
                      `这是 $|E(X) - 1|$：把函数作用在均值上，而不是每个取值上。`,
                    ),
                  ]
                : []),
            why(
              m,
              `That is $E(X) = ${qt(m)}$; apply $${gx}$ to each value before weighting.`,
              `这是 $E(X) = ${qt(m)}$；加权之前要先对每个值计算 $${gx}$。`,
            ),
            why(
              Q.of(
                gs.reduce((s, v) => s + v, 0),
                gs.length,
              ),
              "That averages the values of $g(x)$ without their probabilities; the values are not equally likely.",
              "这是不带概率地对 $g(x)$ 求平均；这些取值并不是等可能的。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Apply $g$ to each value", "对每个值作用 $g$"],
                t(`Compute $${gx}$ for each value in the table:`, `对表中每个值计算 $${gx}$：`),
                [d.xs.map((x) => `${show(x)} = ${g(x)}`).join(", \\quad ")],
              ],
              [
                ["Weight by the probabilities", "按概率加权"],
                t("Multiply each result by the probability of its $x$ and add:", "把每个结果乘以对应 $x$ 的概率再相加："),
                [`E(${gTex}) = \\sum ${gx} \\, P(X = x) = ${sumTex(d, (x) => `${g(x)}`)} = ${qt(value)}`],
              ],
            ],
            t(
              `$${qt(value)}$ lies between the smallest and the largest values of $${gx}$, $${Math.min(...gs)}$ and $${Math.max(...gs)}$, as a weighted average must.`,
              `$${qt(value)}$ 介于 $${gx}$ 的最小值 $${Math.min(...gs)}$ 与最大值 $${Math.max(...gs)}$ 之间，加权平均理应如此。`,
            ),
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
  intro: t(
    "Let $X$ take the values $0, 2, 4$ with probabilities $0.25, 0.5, 0.25$. Its mean is $E(X) = 0 + 1 + 1 = 2$, and the mean of its square is $E(X^2) = 0 \\cdot 0.25 + 4 \\cdot 0.5 + 16 \\cdot 0.25 = 6$. So $\\operatorname{Var}(X) = E(X^2) - E(X)^2 = 6 - 2^2 = 2$, and the standard deviation is $\\sqrt{2}$.\n\nCheck: the squared distances from the mean $2$ are $4, 0, 4$, and their weighted average is $4 \\cdot 0.25 + 0 \\cdot 0.5 + 4 \\cdot 0.25 = 2$, the same variance by the definition.\n\nIn this lesson we compute the variance of a distribution with the shortcut $E(X^2) - E(X)^2$, and we turn the formula around to find $E(X^2)$ from the mean and the variance or the standard deviation.",
    "设 $X$ 取 $0, 2, 4$，概率为 $0.25, 0.5, 0.25$。它的均值为 $E(X) = 0 + 1 + 1 = 2$，平方的均值为 $E(X^2) = 0 \\cdot 0.25 + 4 \\cdot 0.5 + 16 \\cdot 0.25 = 6$。所以 $\\operatorname{Var}(X) = E(X^2) - E(X)^2 = 6 - 2^2 = 2$，标准差为 $\\sqrt{2}$。\n\n检验：到均值 $2$ 的平方距离为 $4, 0, 4$，加权平均为 $4 \\cdot 0.25 + 0 \\cdot 0.5 + 4 \\cdot 0.25 = 2$，按定义得到同样的方差。\n\n本课我们用简便公式 $E(X^2) - E(X)^2$ 计算分布的方差，并把公式反过来，由均值和方差（或标准差）求 $E(X^2)$。",
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
        "The variance measures spread around the mean, and the shortcut computes it as the mean of the squares minus the square of the mean. For $X = 0, 1, 2$ with probabilities $0.3, 0.4, 0.3$: $E(X) = 1$ and $E(X^2) = 0.4 + 1.2 = 1.6$, so $\\operatorname{Var}(X) = 1.6 - 1^2 = 0.6$.\n\n> **Watch out.** Subtract the square of the mean, not the mean itself. If $E(X) = 2$ and $E(X^2) = 5$, then $\\operatorname{Var}(X) = 5 - 2^2 = 1$, not $5 - 2 = 3$.",
        "方差衡量围绕均值的分散程度，简便方法是用平方的均值减去均值的平方。对取 $0, 1, 2$、概率为 $0.3, 0.4, 0.3$ 的 $X$：$E(X) = 1$，$E(X^2) = 0.4 + 1.2 = 1.6$，所以 $\\operatorname{Var}(X) = 1.6 - 1^2 = 0.6$。\n\n> **注意。** 减去的是均值的平方，而不是均值本身。若 $E(X) = 2$，$E(X^2) = 5$，则 $\\operatorname{Var}(X) = 5 - 2^2 = 1$，而不是 $5 - 2 = 3$。",
      ),
      generate(rng) {
        const d = randomDist(rng, -2, 5, rng.int(3, 4));
        const m = expect(d);
        const m2 = expect(d, (x) => x * x);
        const value = variance(d);
        const intro = distIntro(d);
        const absDev = d.xs.reduce((s, x, i) => s.add(Q.of(x).sub(m).abs().mul(d.ps[i]!)), Q.of(0));
        return numberProblem({
          prompt: t(`${intro.en}Find $\\operatorname{Var}(X)$.`, `${intro.zh}求 $\\operatorname{Var}(X)$。`),
          answer: value,
          mistakes: apart(value, [
            why(
              m2,
              `That is $E(X^2)$; subtract the square of the mean, $(${qt(m)})^2$.`,
              `这是 $E(X^2)$；还要减去均值的平方 $(${qt(m)})^2$。`,
            ),
            why(m2.sub(m), "That subtracts the mean itself instead of its square.", "这减去的是均值本身，而不是均值的平方。"),
            why(m2.add(m.pow(2)), "That adds the square of the mean instead of subtracting it.", "这把均值的平方加上了，应该减去。"),
            why(
              absDev,
              "That averages the distances from the mean without squaring them; the variance uses squared distances.",
              "这是不平方地对到均值的距离求平均；方差用的是平方距离。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the mean", "求均值"],
                t("Weight each value by its probability:", "用概率对每个值加权："),
                [`E(X) = ${sumTex(d)} = ${qt(m)}`],
              ],
              [
                ["Find the mean of the square", "求平方的均值"],
                t("Weight each squared value by its probability:", "用概率对每个值的平方加权："),
                [`E(X^2) = ${sumTex(d, (x) => `${par(x)}^2`)} = ${qt(m2)}`],
              ],
              [
                ["Subtract the square of the mean", "减去均值的平方"],
                t("Use the shortcut formula:", "用简便公式："),
                [`\\operatorname{Var}(X) = E(X^2) - E(X)^2 = ${qt(m2)} - (${qt(m)})^2 = ${qt(value)}`],
              ],
            ],
            t(
              `Averaging the squared distances from $\\mu = ${qt(m)}$ directly, $\\sum (x - \\mu)^2 P(X = x)$, gives the same $${qt(value)}$, which is positive, as the variance of a variable with several values must be.`,
              `直接对到 $\\mu = ${qt(m)}$ 的平方距离求加权平均 $\\sum (x - \\mu)^2 P(X = x)$，得到同样的 $${qt(value)}$；它是正数，取多个值的变量的方差理应如此。`,
            ),
          ),
        });
      },
    },
    {
      id: "second-moment-from-mean-and-variance",
      title: t("$E(X^2)$ from the mean and variance", "由均值与方差求 $E(X^2)$"),
      explanation: t(
        "The mean of the square is always at least the square of the mean, and the variance is exactly the difference between them. Rearranging $\\operatorname{Var}(X) = E(X^2) - E(X)^2$ gives $E(X^2) = \\operatorname{Var}(X) + E(X)^2$. If $E(X) = 3$ and $\\operatorname{Var}(X) = 2$, then $E(X^2) = 11$.\n\n> **Watch out.** Square the mean before adding, and when a standard deviation is given, square it to get the variance. With $E(X) = -2$ and standard deviation $\\sqrt{5}$: $E(X^2) = 5 + (-2)^2 = 9$, not $5 - 2 = 3$.",
        "平方的均值总是不小于均值的平方，方差正好是两者之差。把 $\\operatorname{Var}(X) = E(X^2) - E(X)^2$ 变形得 $E(X^2) = \\operatorname{Var}(X) + E(X)^2$。若 $E(X) = 3$，$\\operatorname{Var}(X) = 2$，则 $E(X^2) = 11$。\n\n> **注意。** 相加之前要先把均值平方；给出标准差时，要先平方得到方差。取 $E(X) = -2$，标准差为 $\\sqrt{5}$：$E(X^2) = 5 + (-2)^2 = 9$，而不是 $5 - 2 = 3$。",
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
          mistakes: apart(value, [
            why(
              v - m * m,
              "That subtracts the square of the mean; $E(X^2)$ is the variance plus it.",
              "这减去了均值的平方；$E(X^2)$ 是方差加上它。",
            ),
            why(v + m, `That adds the mean $${m}$ without squaring it.`, `这把均值 $${m}$ 直接加上了，没有平方。`),
            why(
              v * v + m * m,
              sd
                ? "That squares the variance; the square of the standard deviation is already the variance."
                : "That squares the variance; it enters the formula as it is.",
              sd ? "这把方差又平方了；标准差的平方已经就是方差。" : "这把方差平方了；公式中直接用方差本身。",
            ),
            why(m * m, "That is only $E(X)^2$; the variance has to be added.", "这只是 $E(X)^2$；还要加上方差。"),
          ]),
          solution: walked(
            [
              [
                ["Rearrange the variance formula", "变形方差公式"],
                sd
                  ? t(
                      `The variance is the square of the standard deviation, $(\\sqrt{${v}})^2 = ${v}$, and`,
                      `方差是标准差的平方，$(\\sqrt{${v}})^2 = ${v}$，而`,
                    )
                  : t("From $\\operatorname{Var}(X) = E(X^2) - E(X)^2$,", "由 $\\operatorname{Var}(X) = E(X^2) - E(X)^2$，"),
                ["E(X^2) = \\operatorname{Var}(X) + E(X)^2"],
              ],
              [["Substitute", "代入"], t("Put in the numbers:", "代入数值："), [`E(X^2) = ${v} + ${par(m)}^2 = ${value}`]],
            ],
            t(
              `Going back, $${value} - ${par(m)}^2 = ${v}$ is the variance given, and $E(X^2) = ${value}$ is at least $E(X)^2 = ${m * m}$, as it must be.`,
              `反过来，$${value} - ${par(m)}^2 = ${v}$ 正是所给的方差；且 $E(X^2) = ${value}$ 不小于 $E(X)^2 = ${m * m}$，理应如此。`,
            ),
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
  intro: t(
    "Let $X$ take the values $-1, 0, 2$ with probabilities $0.3, 0.5, 0.2$. Its third moment is $E(X^3) = (-1)^3 \\cdot 0.3 + 0^3 \\cdot 0.5 + 2^3 \\cdot 0.2 = -0.3 + 1.6 = 1.3$. Its mean is $E(X) = -0.3 + 0.4 = 0.1$ and $E(X^2) = 0.3 + 0.8 = 1.1$, so $\\operatorname{Var}(X) = 1.1 - 0.01 = 1.09$, and the second moment about $1$ is $E((X - 1)^2) = \\operatorname{Var}(X) + (0.1 - 1)^2 = 1.09 + 0.81 = 1.9$.\n\nCheck: directly, $(X - 1)^2$ takes the values $4, 1, 1$ with probabilities $0.3, 0.5, 0.2$, so $E((X - 1)^2) = 1.2 + 0.5 + 0.2 = 1.9$.\n\nIn this lesson we compute higher moments $E(X^k)$ from a distribution, keeping the signs of odd powers, and we find second moments about any point from the mean and the variance.",
    "设 $X$ 取 $-1, 0, 2$，概率为 $0.3, 0.5, 0.2$。它的三阶矩为 $E(X^3) = (-1)^3 \\cdot 0.3 + 0^3 \\cdot 0.5 + 2^3 \\cdot 0.2 = -0.3 + 1.6 = 1.3$。它的均值为 $E(X) = -0.3 + 0.4 = 0.1$，$E(X^2) = 0.3 + 0.8 = 1.1$，所以 $\\operatorname{Var}(X) = 1.1 - 0.01 = 1.09$；关于 $1$ 的二阶矩为 $E((X - 1)^2) = \\operatorname{Var}(X) + (0.1 - 1)^2 = 1.09 + 0.81 = 1.9$。\n\n检验：直接计算，$(X - 1)^2$ 取 $4, 1, 1$，概率为 $0.3, 0.5, 0.2$，所以 $E((X - 1)^2) = 1.2 + 0.5 + 0.2 = 1.9$。\n\n本课我们由分布计算高阶矩 $E(X^k)$，注意奇次幂保留符号；并由均值和方差求关于任意一点的二阶矩。",
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
        "Higher moments weight each value raised to a power by its probability, and they describe features of the shape such as skewness. For $X = -1, 1, 2$ with probabilities $0.5, 0.3, 0.2$: $E(X^3) = -1 \\cdot 0.5 + 1 \\cdot 0.3 + 8 \\cdot 0.2 = 1.4$.\n\n> **Watch out.** An odd power of a negative value stays negative. If $X = -2$ has probability $0.5$, its term in $E(X^3)$ is $-8 \\cdot 0.5 = -4$, not $8 \\cdot 0.5 = 4$.",
        "高阶矩用概率对每个取值的幂加权，它们描述分布形状的特征，例如偏度。对取 $-1, 1, 2$、概率为 $0.5, 0.3, 0.2$ 的 $X$：$E(X^3) = -1 \\cdot 0.5 + 1 \\cdot 0.3 + 8 \\cdot 0.2 = 1.4$。\n\n> **注意。** 负数的奇次幂仍是负数。若 $X = -2$ 的概率为 $0.5$，它在 $E(X^3)$ 中的项是 $-8 \\cdot 0.5 = -4$，而不是 $8 \\cdot 0.5 = 4$。",
      ),
      generate(rng) {
        const d = randomDist(rng, -2, 3, 3);
        const k = rng.int(3, 4);
        const value = expect(d, (x) => x ** k);
        const intro = distIntro(d);
        const powers = d.xs.map((x) => x ** k);
        return numberProblem({
          prompt: t(`${intro.en}Find the moment $E(X^{${k}})$.`, `${intro.zh}求矩 $E(X^{${k}})$。`),
          answer: value,
          mistakes: apart(value, [
            why(
              expect(d).pow(k),
              `That is $E(X)^{${k}}$: it raises the mean to the power instead of averaging the powers.`,
              `这是 $E(X)^{${k}}$：把均值取了幂，而不是对幂求平均。`,
            ),
            why(
              expect(d, (x) => x ** (k - 1)),
              `That uses the power $${k - 1}$ instead of $${k}$.`,
              `这用了 $${k - 1}$ 次幂，而不是 $${k}$ 次幂。`,
            ),
            why(
              expect(d, (x) => Math.abs(x) ** k),
              "That drops the signs of the negative values; an odd power of a negative number is negative.",
              "这丢掉了负值的符号；负数的奇次幂是负数。",
            ),
            why(
              Q.of(
                powers.reduce((s, v) => s + v, 0),
                powers.length,
              ),
              "That averages the powers without their probabilities; the values are not equally likely.",
              "这是不带概率地对幂求平均；这些取值并不是等可能的。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Raise each value to the power", "对每个值取幂"],
                t(`Compute $x^{${k}}$ for each value, keeping signs:`, `计算每个值的 $${k}$ 次幂，保留符号：`),
                [d.xs.map((x) => `${par(x)}^${k} = ${x ** k}`).join(", \\quad ")],
              ],
              [
                ["Weight and add", "加权求和"],
                t("Multiply by the probabilities and add:", "乘以概率再相加："),
                [`E(X^{${k}}) = ${sumTex(d, (x) => par(x ** k))} = ${qt(value)}`],
              ],
            ],
            t(
              `$${qt(value)}$ lies between the smallest and the largest powers, $${Math.min(...powers)}$ and $${Math.max(...powers)}$, as a weighted average of them must.`,
              `$${qt(value)}$ 介于最小的幂 $${Math.min(...powers)}$ 与最大的幂 $${Math.max(...powers)}$ 之间，它们的加权平均理应如此。`,
            ),
          ),
        });
      },
    },
    {
      id: "second-moments-about-a-point",
      title: t("Second moments about a point", "关于某点的二阶矩"),
      explanation: t(
        "The average squared distance from a point is the variance plus the squared distance from the point to the mean, so it is smallest at the mean. Expanding, $E((X - c)^2) = \\operatorname{Var}(X) + (\\mu - c)^2$: the second moment about $c$ is smallest when $c = \\mu$. If $\\mu = 5$, $\\operatorname{Var}(X) = 3$, then $E((X - 2)^2) = 3 + 9 = 12$.\n\n> **Watch out.** The added term is the squared distance from $c$ to the mean, not $c^2$. With $\\mu = 5$ and $\\operatorname{Var}(X) = 3$: $E((X - 2)^2) = 3 + 3^2 = 12$, not $3 + 2^2 = 7$.",
        "到一点的平均平方距离等于方差加上该点到均值距离的平方，所以在均值处最小。展开得 $E((X - c)^2) = \\operatorname{Var}(X) + (\\mu - c)^2$：关于 $c$ 的二阶矩在 $c = \\mu$ 时最小。若 $\\mu = 5$，$\\operatorname{Var}(X) = 3$，则 $E((X - 2)^2) = 3 + 9 = 12$。\n\n> **注意。** 加上的是 $c$ 到均值距离的平方，而不是 $c^2$。取 $\\mu = 5$，$\\operatorname{Var}(X) = 3$：$E((X - 2)^2) = 3 + 3^2 = 12$，而不是 $3 + 2^2 = 7$。",
      ),
      generate(rng) {
        const m = rng.int(-5, 9);
        const v = rng.int(1, 20);
        let c: number;
        do c = rng.int(-6, 10);
        while (c === m || c === 0);
        const value = v + (m - c) ** 2;
        const shift = `X ${c > 0 ? "-" : "+"} ${Math.abs(c)}`;
        return numberProblem({
          prompt: t(
            `$E(X) = ${m}$ and $\\operatorname{Var}(X) = ${v}$. Find $E((${shift})^2)$.`,
            `$E(X) = ${m}$，$\\operatorname{Var}(X) = ${v}$。求 $E((${shift})^2)$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              v,
              `That is only the variance; the squared distance from $${c}$ to the mean, $${(m - c) ** 2}$, has to be added.`,
              `这只是方差；还要加上 $${c}$ 到均值距离的平方 $${(m - c) ** 2}$。`,
            ),
            why(
              v + c * c,
              `That adds $${par(c)}^2$; the term is the squared distance from $${c}$ to the mean $${m}$.`,
              `这加的是 $${par(c)}^2$；应加 $${c}$ 到均值 $${m}$ 距离的平方。`,
            ),
            why(
              (m - c) ** 2,
              "That leaves out the variance; the spread of $X$ about its own mean counts too.",
              "这漏掉了方差；$X$ 围绕自身均值的离散也要计入。",
            ),
            why(
              v - (m - c) ** 2,
              "That subtracts the squared distance; moving away from the mean makes the second moment larger.",
              "这减去了平方距离；离均值越远，二阶矩越大。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Split off the mean", "拆出均值"],
                t(
                  "Write $X - c = (X - \\mu) + (\\mu - c)$ and expand; the cross term has mean zero:",
                  "把 $X - c$ 写成 $(X - \\mu) + (\\mu - c)$ 再展开；交叉项的均值为零：",
                ),
                ["E((X - c)^2) = \\operatorname{Var}(X) + (\\mu - c)^2"],
              ],
              [
                ["Substitute", "代入"],
                t(`Here $\\mu = ${m}$ and $c = ${c}$:`, `这里 $\\mu = ${m}$，$c = ${c}$：`),
                [`E((${shift})^2) = ${v} + (${m} ${c > 0 ? "-" : "+"} ${Math.abs(c)})^2 = ${v} + ${(m - c) ** 2} = ${value}`],
              ],
            ],
            t(
              `Expanding instead, $E(X^2) = ${v} + ${par(m)}^2 = ${v + m * m}$ and $E((X - c)^2) = E(X^2) - 2cE(X) + c^2 = ${v + m * m} - 2 \\cdot ${par(c)} \\cdot ${par(m)} + ${par(c)}^2 = ${value}$.`,
              `改用展开：$E(X^2) = ${v} + ${par(m)}^2 = ${v + m * m}$，$E((X - c)^2) = E(X^2) - 2cE(X) + c^2 = ${v + m * m} - 2 \\cdot ${par(c)} \\cdot ${par(m)} + ${par(c)}^2 = ${value}$。`,
            ),
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
  intro: t(
    "Let $X$ and $Y$ be independent with $\\operatorname{Var}(X) = 4$ and $\\operatorname{Var}(Y) = 9$. Shifting by $-2$ changes nothing and the factor $3$ is squared, so $\\operatorname{Var}(3X - 2) = 3^2 \\cdot 4 = 36$. For a combination of the two, $\\operatorname{Var}(2X - Y) = 2^2 \\cdot 4 + (-1)^2 \\cdot 9 = 16 + 9 = 25$: the variances add although $Y$ is subtracted.\n\nCheck: the standard deviation of $X$ is $2$, so that of $3X - 2$ is $3 \\cdot 2 = 6$ and $6^2 = 36$; and $25$ is larger than both parts $16$ and $9$, as a sum of two positive variances must be.\n\nIn this lesson we find the variance of a linear function $aX + b$, where the constant drops out and the multiplier is squared, and the variance of a combination $aX + bY$ of independent variables, where the squared coefficients make every term add.",
    "设 $X$ 与 $Y$ 相互独立，$\\operatorname{Var}(X) = 4$，$\\operatorname{Var}(Y) = 9$。平移 $-2$ 不改变方差，因子 $3$ 要平方，所以 $\\operatorname{Var}(3X - 2) = 3^2 \\cdot 4 = 36$。对两者的组合，$\\operatorname{Var}(2X - Y) = 2^2 \\cdot 4 + (-1)^2 \\cdot 9 = 16 + 9 = 25$：尽管减去了 $Y$，方差仍相加。\n\n检验：$X$ 的标准差为 $2$，所以 $3X - 2$ 的标准差为 $3 \\cdot 2 = 6$，而 $6^2 = 36$；$25$ 大于两部分 $16$ 和 $9$，两个正方差之和理应如此。\n\n本课我们求线性函数 $aX + b$ 的方差，其中常数消失、乘数要平方；并求相互独立变量的组合 $aX + bY$ 的方差，系数平方后每一项都相加。",
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
        "Adding a constant shifts every value equally and does not change the spread, while multiplying by a constant scales the variance by its square. If $\\operatorname{Var}(X) = 4$, then $\\operatorname{Var}(-3X + 7) = (-3)^2 \\cdot 4 = 36$, and the standard deviation of $-3X + 7$ is $|-3| \\cdot 2 = 6$.\n\n> **Watch out.** Square the multiplier, sign included, and drop the constant. With $\\operatorname{Var}(X) = 3$: $\\operatorname{Var}(-2X + 5) = 4 \\cdot 3 = 12$, not $-2 \\cdot 3 = -6$ and not $12 + 5 = 17$.",
        "加上一个常数使每个值平移相同的量，不改变分散程度；而乘以常数会使方差乘以该常数的平方。若 $\\operatorname{Var}(X) = 4$，则 $\\operatorname{Var}(-3X + 7) = (-3)^2 \\cdot 4 = 36$，$-3X + 7$ 的标准差为 $|-3| \\cdot 2 = 6$。\n\n> **注意。** 乘数要连同符号一起平方，常数要去掉。取 $\\operatorname{Var}(X) = 3$：$\\operatorname{Var}(-2X + 5) = 4 \\cdot 3 = 12$，既不是 $-2 \\cdot 3 = -6$，也不是 $12 + 5 = 17$。",
      ),
      generate(rng) {
        const v = rng.int(1, 12);
        const a = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const b = rng.nonZero(-9, 9);
        const value = a * a * v;
        const sd = Number.isInteger(Math.sqrt(v)) ? `${Math.sqrt(v)}` : `\\sqrt{${v}}`;
        return numberProblem({
          prompt: t(
            `$\\operatorname{Var}(X) = ${v}$. Find $\\operatorname{Var}(${linTex(a, b)})$.`,
            `$\\operatorname{Var}(X) = ${v}$。求 $\\operatorname{Var}(${linTex(a, b)})$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              a * v,
              `That multiplies by $${a}$ without squaring it; the variance scales by $${par(a)}^2 = ${a * a}$.`,
              `这乘的是 $${a}$ 而没有平方；方差要乘以 $${par(a)}^2 = ${a * a}$。`,
            ),
            why(
              value + b,
              `That adds the constant $${b}$; a shift moves every value equally and leaves the variance alone.`,
              `这加上了常数 $${b}$；平移使每个值移动相同的量，不改变方差。`,
            ),
            why(
              Math.abs(a) * v,
              `That multiplies by $|${a}|$, which is how the standard deviation scales; the variance scales by its square.`,
              `这乘的是 $|${a}|$，那是标准差的变化方式；方差要乘以它的平方。`,
            ),
            why(a * v + b, "That neither squares the multiplier nor drops the constant.", "这既没有把乘数平方，也没有去掉常数。"),
          ]),
          solution: walked(
            [
              [
                ["Drop the constant", "去掉常数"],
                t(`Adding $${b}$ shifts every value by the same amount:`, `加上 $${b}$ 使每个值移动相同的量：`),
                [`\\operatorname{Var}(${linTex(a, b)}) = \\operatorname{Var}(${linTex(a, 0)})`],
              ],
              [
                ["Square the multiplier", "把乘数平方"],
                t(
                  "Every deviation from the mean is multiplied by $a$, so every squared deviation by $a^2$:",
                  "每个离差都乘以 $a$，所以每个平方离差都乘以 $a^2$：",
                ),
                [`= ${par(a)}^2 \\cdot ${v} = ${a * a} \\cdot ${v} = ${value}`],
              ],
            ],
            t(
              `The standard deviation of $X$ is $${sd}$, so that of $${linTex(a, b)}$ is $${Math.abs(a)} \\cdot ${sd}$, and $(${Math.abs(a)} \\cdot ${sd})^2 = ${value}$.`,
              `$X$ 的标准差为 $${sd}$，所以 $${linTex(a, b)}$ 的标准差为 $${Math.abs(a)} \\cdot ${sd}$，而 $(${Math.abs(a)} \\cdot ${sd})^2 = ${value}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "variance-of-sums-of-independent-variables",
      title: t("Variance of sums", "和的方差"),
      explanation: t(
        "For independent variables, variances add even when the variables are subtracted, because the coefficients are squared and squares are never negative. For independent $X, Y$ with variances $2$ and $5$: $\\operatorname{Var}(3X - Y) = 9 \\cdot 2 + 1 \\cdot 5 = 23$.\n\n> **Watch out.** A minus sign between the variables does not make the variances subtract. For independent $X, Y$ with variances $4$ and $1$: $\\operatorname{Var}(X - Y) = 4 + 1 = 5$, not $4 - 1 = 3$.",
        "对于独立变量，即使变量相减，方差也相加，因为系数要平方，而平方永远不会是负的。对相互独立、方差分别为 $2$ 和 $5$ 的 $X, Y$：$\\operatorname{Var}(3X - Y) = 9 \\cdot 2 + 1 \\cdot 5 = 23$。\n\n> **注意。** 变量之间的减号不会使方差相减。对相互独立、方差分别为 $4$ 和 $1$ 的 $X, Y$：$\\operatorname{Var}(X - Y) = 4 + 1 = 5$，而不是 $4 - 1 = 3$。",
      ),
      generate(rng) {
        const vx = rng.int(1, 10);
        const vy = rng.int(1, 10);
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const value = a * a * vx + b * b * vy;
        const expr = `${coef(a, "X", true)}${coef(b, "Y", false)}`;
        return numberProblem({
          prompt: t(
            `$X$ and $Y$ are independent with $\\operatorname{Var}(X) = ${vx}$ and $\\operatorname{Var}(Y) = ${vy}$. Find $\\operatorname{Var}(${expr})$.`,
            `$X$ 与 $Y$ 相互独立，$\\operatorname{Var}(X) = ${vx}$，$\\operatorname{Var}(Y) = ${vy}$。求 $\\operatorname{Var}(${expr})$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              a * a * vx - b * b * vy,
              "That subtracts the second variance; squared coefficients are positive, so the variances add.",
              "这减去了第二个方差；系数平方后为正，所以方差相加。",
            ),
            why(
              a * vx + b * vy,
              "That uses the coefficients without squaring them, as for a mean.",
              "这直接用了系数而没有平方，那是均值的做法。",
            ),
            why(
              vx + vy,
              "That leaves out the coefficients; each variance is multiplied by the square of its coefficient.",
              "这漏掉了系数；每个方差都要乘以它的系数的平方。",
            ),
            why(
              Math.abs(a * vx) + Math.abs(b * vy),
              "That multiplies by the sizes of the coefficients instead of their squares.",
              "这乘的是系数的绝对值，而不是它们的平方。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Use independence", "用独立性"],
                t(
                  "For independent variables each term contributes its own variance, with its coefficient squared:",
                  "对独立变量，每一项贡献自己的方差，系数要平方：",
                ),
                [`\\operatorname{Var}(${expr}) = ${par(a)}^2 \\operatorname{Var}(X) + ${par(b)}^2 \\operatorname{Var}(Y)`],
              ],
              [
                ["Substitute", "代入"],
                t("Put in the variances:", "代入方差："),
                [`= ${a * a} \\cdot ${vx} + ${b * b} \\cdot ${vy} = ${value}`],
              ],
            ],
            t(
              `The two parts are $\\operatorname{Var}(${coef(a, "X", true)}) = ${a * a * vx}$ and $\\operatorname{Var}(${coef(b, "Y", true)}) = ${b * b * vy}$, both positive, and $${value}$ is larger than each, as a sum of variances must be.`,
              `两部分分别是 $\\operatorname{Var}(${coef(a, "X", true)}) = ${a * a * vx}$ 和 $\\operatorname{Var}(${coef(b, "Y", true)}) = ${b * b * vy}$，都是正数；$${value}$ 比每一部分都大，方差之和理应如此。`,
            ),
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
  intro: t(
    "A ticket is drawn at random from tickets numbered $1$ to $30$, so $X$ is uniform on $\\{1, \\dots, 30\\}$ and each number has probability $\\frac{1}{30}$. The event $10 < X < 15$ holds for $11, 12, 13, 14$, four values, so its probability is $\\frac{4}{30} = \\frac{2}{15}$. The multiples of $4$ are $4, 8, \\dots, 28$, that is $\\lfloor 30/4 \\rfloor = 7$ values, so $P(4 \\mid X) = \\frac{7}{30}$.\n\nCheck: $7 \\cdot 4 = 28 \\le 30$ while $8 \\cdot 4 = 32 > 30$, so there are exactly $7$ multiples; and the strict inequalities leave out both $10$ and $15$, which is why $15 - 10 + 1 = 6$ is reduced by $2$ to $4$.\n\nIn this lesson we find probabilities for a discrete uniform variable by counting the values in an event, taking care at the endpoints of an interval, and by counting multiples with the floor of a quotient.",
    "从编号 $1$ 到 $30$ 的彩票中随机抽一张，所以 $X$ 在 $\\{1, \\dots, 30\\}$ 上服从均匀分布，每个号码的概率为 $\\frac{1}{30}$。事件 $10 < X < 15$ 对 $11, 12, 13, 14$ 这四个值成立，所以概率为 $\\frac{4}{30} = \\frac{2}{15}$。$4$ 的倍数是 $4, 8, \\dots, 28$，即 $\\lfloor 30/4 \\rfloor = 7$ 个值，所以 $P(4 \\mid X) = \\frac{7}{30}$。\n\n检验：$7 \\cdot 4 = 28 \\le 30$，而 $8 \\cdot 4 = 32 > 30$，所以恰有 $7$ 个倍数；严格不等号把 $10$ 和 $15$ 都排除了，所以 $15 - 10 + 1 = 6$ 要减去 $2$，得 $4$。\n\n本课我们通过数出事件中的取值个数来求离散均匀变量的概率，注意区间端点的计数，并用商的向下取整来数倍数。",
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
        "Every value of a discrete uniform variable is equally likely, so a probability is the number of favorable values divided by the total number of values. If $X$ is uniform on $\\{1, \\dots, 20\\}$, then $P(5 \\le X < 9) = \\frac{4}{20} = \\frac{1}{5}$: the values $5, 6, 7, 8$. Count carefully at the endpoints.\n\n> **Watch out.** Count the whole numbers in the interval, not its length. For $X$ uniform on $\\{1, \\dots, 20\\}$, $5 \\le X \\le 9$ holds for $9 - 5 + 1 = 5$ values, so its probability is $\\frac{5}{20}$, not $\\frac{4}{20}$.",
        "离散均匀变量的每个值都同样可能，所以概率等于有利取值的个数除以取值的总数。若 $X$ 在 $\\{1, \\dots, 20\\}$ 上服从均匀分布，则 $P(5 \\le X < 9) = \\frac{4}{20} = \\frac{1}{5}$：取值 $5, 6, 7, 8$。注意端点的计数。\n\n> **注意。** 要数区间内的整数个数，而不是区间的长度。若 $X$ 在 $\\{1, \\dots, 20\\}$ 上服从均匀分布，$5 \\le X \\le 9$ 对 $9 - 5 + 1 = 5$ 个值成立，所以概率为 $\\frac{5}{20}$，而不是 $\\frac{4}{20}$。",
      ),
      generate(rng) {
        const a = rng.int(0, 5);
        const b = a + rng.int(7, 30);
        const n = b - a + 1;
        const lo = rng.int(a + 1, b - 3);
        const hi = rng.int(lo + 2, b - 1);
        const [l, r] = [rng.bool(), rng.bool()];
        const first = l ? lo : lo + 1;
        const last = r ? hi : hi - 1;
        const count = last - first + 1;
        const value = Q.of(count, n);
        const frac = `\\frac{${count}}{${n}}${value.toLatex() === `\\frac{${count}}{${n}}` ? "" : ` = ${value.toLatex()}`}`;
        return numberProblem({
          prompt: t(
            `$X$ is uniformly distributed on $\\{${a}, ${a + 1}, \\dots, ${b}\\}$. Find $P(${lo} ${l ? "\\le" : "<"} X ${r ? "\\le" : "<"} ${hi})$.`,
            `$X$ 在 $\\{${a}, ${a + 1}, \\dots, ${b}\\}$ 上服从均匀分布。求 $P(${lo} ${l ? "\\le" : "<"} X ${r ? "\\le" : "<"} ${hi})$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              Q.of(hi - lo, n),
              `That counts $${hi} - ${lo} = ${hi - lo}$, the length of the interval; count the whole numbers in it instead.`,
              `这数的是区间长度 $${hi} - ${lo} = ${hi - lo}$；应数区间内的整数个数。`,
            ),
            why(
              Q.of(hi - lo + 1, n),
              "That counts both endpoints, but a strict inequality leaves its endpoint out.",
              "这把两个端点都算进去了，但严格不等号不包括它的端点。",
            ),
            why(
              Q.of(count, b - a),
              `That divides by $${b} - ${a} = ${b - a}$; there are $${n}$ values from $${a}$ to $${b}$.`,
              `这除以了 $${b} - ${a} = ${b - a}$；从 $${a}$ 到 $${b}$ 共有 $${n}$ 个值。`,
            ),
            why(
              Q.of(count + 1, n),
              `That counts one value too many; the values in the event are $${listTex(first, last)}$.`,
              `这多数了一个值；事件中的值是 $${listTex(first, last)}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Count the values in the event", "数出事件中的值"],
                t(`The values are $${listTex(first, last)}$, and their number is`, `这些值是 $${listTex(first, last)}$，个数为`),
                [`${last} - ${first} + 1 = ${count}`],
              ],
              [
                ["Divide by the number of values", "除以取值总数"],
                t(`$X$ has $${b} - ${a} + 1 = ${n}$ equally likely values, so`, `$X$ 共有 $${b} - ${a} + 1 = ${n}$ 个等可能的值，所以`),
                [`P(${lo} ${l ? "\\le" : "<"} X ${r ? "\\le" : "<"} ${hi}) = ${frac}`],
              ],
            ],
            t(
              `The other $${n - count}$ values have total probability $\\frac{${n - count}}{${n}}$, and $\\frac{${count}}{${n}} + \\frac{${n - count}}{${n}} = 1$.`,
              `其余 $${n - count}$ 个值的总概率为 $\\frac{${n - count}}{${n}}$，而 $\\frac{${count}}{${n}} + \\frac{${n - count}}{${n}} = 1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "uniform-probabilities-of-divisibility",
      title: t("Probabilities of divisibility", "整除的概率"),
      explanation: t(
        "Count the multiples in the range by dividing its end by the divisor and rounding down, then divide by the number of values. If $X$ is uniform on $\\{1, \\dots, 50\\}$, the multiples of $3$ are $3, 6, \\dots, 48$, that is, $\\lfloor 50/3 \\rfloor = 16$ values: $P(3 \\mid X) = \\frac{16}{50} = \\frac{8}{25}$.\n\n> **Watch out.** The probability is close to $\\frac{1}{m}$ but usually not equal to it, because the range rarely ends on a multiple. On $\\{1, \\dots, 50\\}$, $P(3 \\mid X) = \\frac{16}{50}$, not $\\frac{1}{3}$.",
        "用区间的终点除以除数并向下取整来数出范围内的倍数，再除以取值的总数。若 $X$ 在 $\\{1, \\dots, 50\\}$ 上服从均匀分布，$3$ 的倍数是 $3, 6, \\dots, 48$，即 $\\lfloor 50/3 \\rfloor = 16$ 个值：$P(3 \\mid X) = \\frac{16}{50} = \\frac{8}{25}$。\n\n> **注意。** 概率接近 $\\frac{1}{m}$，但通常不等于它，因为范围很少恰好结束在倍数上。在 $\\{1, \\dots, 50\\}$ 上，$P(3 \\mid X) = \\frac{16}{50}$，而不是 $\\frac{1}{3}$。",
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
          mistakes: apart(value, [
            why(
              Q.of(1, m),
              `That assumes exactly one value in $${m}$ is a multiple; $${b}$ is not a multiple of $${m}$, so count them.`,
              `这假设恰好每 $${m}$ 个值中有一个倍数；$${b}$ 不是 $${m}$ 的倍数，所以要实际去数。`,
            ),
            why(
              Q.of(count + 1, b),
              `That rounds $\\frac{${b}}{${m}}$ up or counts $0$; the multiples from $${m}$ to $${b}$ number $${count}$.`,
              `这把 $\\frac{${b}}{${m}}$ 向上取整了或者算上了 $0$；从 $${m}$ 到 $${b}$ 的倍数有 $${count}$ 个。`,
            ),
            why(
              Q.of(count, b - 1),
              `That divides by $${b - 1}$; there are $${b}$ values from $1$ to $${b}$.`,
              `这除以了 $${b - 1}$；从 $1$ 到 $${b}$ 共有 $${b}$ 个值。`,
            ),
            why(Q.of(count, m), "That divides by the divisor instead of the number of values.", "这除以的是除数，而不是取值的个数。"),
          ]),
          solution: walked(
            [
              [
                ["Count the multiples", "数出倍数"],
                t(
                  `The multiples are $${m}, ${2 * m}, \\dots, ${count * m}$, and their number is`,
                  `这些倍数是 $${m}, ${2 * m}, \\dots, ${count * m}$，个数为`,
                ),
                [`\\left\\lfloor \\frac{${b}}{${m}} \\right\\rfloor = ${count}`],
              ],
              [
                ["Divide by the number of values", "除以取值总数"],
                t(`All $${b}$ values are equally likely:`, `$${b}$ 个值都等可能：`),
                [`P(${m} \\mid X) = \\frac{${count}}{${b}}${value.toLatex() === `\\frac{${count}}{${b}}` ? "" : ` = ${value.toLatex()}`}`],
              ],
            ],
            t(
              `$${count} \\cdot ${m} = ${count * m} \\le ${b}$ while $${count + 1} \\cdot ${m} = ${(count + 1) * m} > ${b}$, so no multiple was missed or counted beyond the range.`,
              `$${count} \\cdot ${m} = ${count * m} \\le ${b}$，而 $${count + 1} \\cdot ${m} = ${(count + 1) * m} > ${b}$，所以没有遗漏，也没有超出范围。`,
            ),
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
  intro: t(
    "Let $X$ be uniform on $\\{4, 5, \\dots, 10\\}$. There are $n = 10 - 4 + 1 = 7$ values, the mean is the midpoint $E(X) = \\frac{4 + 10}{2} = 7$, and the variance is $\\operatorname{Var}(X) = \\frac{7^2 - 1}{12} = \\frac{48}{12} = 4$.\n\nCheck: the squared distances from $7$ are $9, 4, 1, 0, 1, 4, 9$, which add to $28$, and their average is $\\frac{28}{7} = 4$, the same variance by the definition.\n\nIn this lesson we find the mean of a discrete uniform distribution as the midpoint of its range and its variance from the number of values $n$ alone, wherever the values start.",
    "设 $X$ 在 $\\{4, 5, \\dots, 10\\}$ 上服从均匀分布。共有 $n = 10 - 4 + 1 = 7$ 个值，均值是中点 $E(X) = \\frac{4 + 10}{2} = 7$，方差为 $\\operatorname{Var}(X) = \\frac{7^2 - 1}{12} = \\frac{48}{12} = 4$。\n\n检验：到 $7$ 的平方距离为 $9, 4, 1, 0, 1, 4, 9$，和为 $28$，平均为 $\\frac{28}{7} = 4$，按定义得到同样的方差。\n\n本课我们把离散均匀分布的均值求作取值范围的中点，并只用取值个数 $n$ 求出它的方差，与取值从哪里开始无关。",
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
        "The values are evenly spaced and equally likely, so they balance at the midpoint between the smallest and the largest. By symmetry the mean is the midpoint: uniform on $\\{4, \\dots, 17\\}$ has $E(X) = \\frac{4 + 17}{2} = 10.5$.\n\n> **Watch out.** Add the endpoints; their difference gives the spread, not the centre. Uniform on $\\{3, \\dots, 9\\}$ has $E(X) = \\frac{3 + 9}{2} = 6$, not $\\frac{9 - 3}{2} = 3$.",
        "这些取值等间隔且同样可能，所以它们在最小值和最大值的中点处平衡。由对称性，均值就是中点：在 $\\{4, \\dots, 17\\}$ 上均匀分布时 $E(X) = \\frac{4 + 17}{2} = 10.5$。\n\n> **注意。** 要把两个端点相加；它们的差给出的是范围，而不是中心。在 $\\{3, \\dots, 9\\}$ 上均匀分布时 $E(X) = \\frac{3 + 9}{2} = 6$，而不是 $\\frac{9 - 3}{2} = 3$。",
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
          mistakes: apart(value, [
            why(
              Q.of(b - a, 2),
              "That halves the difference of the endpoints, which measures the spread, not the centre.",
              "这是两端点之差的一半，度量的是范围而不是中心。",
            ),
            why(
              Q.of(b - a + 1, 2),
              "That halves the number of values; the mean is the midpoint of the values themselves.",
              "这是取值个数的一半；均值是取值本身的中点。",
            ),
            why(
              Q.of(a + b + 1, 2),
              "That adds one before halving; the midpoint of $a$ and $b$ is exactly $\\frac{a + b}{2}$.",
              "这在除以二之前多加了一；$a$ 与 $b$ 的中点恰好是 $\\frac{a + b}{2}$。",
            ),
            why(Q.of(a + b), "That adds the endpoints without halving the sum.", "这把两个端点相加后没有除以二。"),
          ]),
          solution: walked(
            [
              [
                ["Take the midpoint", "取中点"],
                t(
                  "The values are evenly spaced and equally likely, so the mean is halfway between the ends:",
                  "取值等间隔且等可能，所以均值在两端的正中间：",
                ),
                [`E(X) = \\frac{${a} + ${par(b)}}{2} = ${qt(value)}`],
              ],
            ],
            t(
              `The values pair up from the ends with the same sum, $${a} + ${par(b)} = ${a + 1} + ${par(b - 1)} = ${a + b}$, so they balance at half of it, $${qt(value)}$.`,
              `从两端起取值两两配对，和都相同：$${a} + ${par(b)} = ${a + 1} + ${par(b - 1)} = ${a + b}$，所以它们在其一半 $${qt(value)}$ 处平衡。`,
            ),
          ),
        });
      },
    },
    {
      id: "variance-of-a-discrete-uniform-distribution",
      title: t("The variance", "方差"),
      explanation: t(
        "A fair die is uniform on $\\{1, \\dots, 6\\}$, so $\\operatorname{Var}(X) = \\frac{6^2 - 1}{12} = \\frac{35}{12}$. The variance depends only on $n$, not on where the values start.\n\n> **Watch out.** Use the number of values $n = b - a + 1$, not $b$ or $b - a$. Uniform on $\\{5, \\dots, 10\\}$ has $n = 6$, so $\\operatorname{Var}(X) = \\frac{35}{12}$, not $\\frac{10^2 - 1}{12} = \\frac{33}{4}$.",
        "均匀的骰子在 $\\{1, \\dots, 6\\}$ 上均匀分布，所以 $\\operatorname{Var}(X) = \\frac{6^2 - 1}{12} = \\frac{35}{12}$。方差只取决于 $n$，与取值从哪里开始无关。\n\n> **注意。** 要用取值个数 $n = b - a + 1$，而不是 $b$ 或 $b - a$。在 $\\{5, \\dots, 10\\}$ 上均匀分布时 $n = 6$，所以 $\\operatorname{Var}(X) = \\frac{35}{12}$，而不是 $\\frac{10^2 - 1}{12} = \\frac{33}{4}$。",
      ),
      generate(rng) {
        const a = rng.int(-10, 20);
        const n = rng.int(3, 30);
        const b = a + n - 1;
        const value = uniformVar(n);
        const e1 = Q.of(n + 1, 2);
        const e2 = Q.of((n + 1) * (2 * n + 1), 6);
        return numberProblem({
          prompt: t(
            `$X$ is uniformly distributed on $\\{${a}, ${a + 1}, \\dots, ${b}\\}$. Find $\\operatorname{Var}(X)$.`,
            `$X$ 在 $\\{${a}, ${a + 1}, \\dots, ${b}\\}$ 上服从均匀分布。求 $\\operatorname{Var}(X)$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(Q.of(n * n, 12), "That leaves out the $-1$ in $\\frac{n^2 - 1}{12}$.", "这漏掉了 $\\frac{n^2 - 1}{12}$ 中的 $-1$。"),
            why(Q.of(n * n - 1, 6), "That divides by $6$; the formula divides by $12$.", "这除以了 $6$；公式中除以的是 $12$。"),
            why(
              Q.of((n - 1) ** 2 - 1, 12),
              `That uses $b - a = ${n - 1}$; the number of values is $b - a + 1 = ${n}$.`,
              `这用了 $b - a = ${n - 1}$；取值个数是 $b - a + 1 = ${n}$。`,
            ),
            why(
              Q.of(b * b - 1, 12),
              `That uses the largest value $${b}$ in place of the number of values $${n}$.`,
              `这用最大值 $${b}$ 代替了取值个数 $${n}$。`,
            ),
          ]),
          solution: walked(
            [
              [["Count the values", "数出取值个数"], t("The number of values is", "取值个数为"), [`n = ${b} - ${par(a)} + 1 = ${n}`]],
              [
                ["Use the formula", "用公式"],
                t("The variance depends only on $n$:", "方差只取决于 $n$："),
                [`\\operatorname{Var}(X) = \\frac{${n}^2 - 1}{12} = \\frac{${n * n - 1}}{12} = ${qt(value)}`],
              ],
            ],
            t(
              `Shifting to $\\{1, \\dots, ${n}\\}$ does not change the variance, and there $E(X) = ${qt(e1)}$ and $E(X^2) = \\frac{(n + 1)(2n + 1)}{6} = ${qt(e2)}$, so $\\operatorname{Var}(X) = ${qt(e2)} - (${qt(e1)})^2 = ${qt(value)}$.`,
              `平移到 $\\{1, \\dots, ${n}\\}$ 不改变方差，此时 $E(X) = ${qt(e1)}$，$E(X^2) = \\frac{(n + 1)(2n + 1)}{6} = ${qt(e2)}$，所以 $\\operatorname{Var}(X) = ${qt(e2)} - (${qt(e1)})^2 = ${qt(value)}$。`,
            ),
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
  intro: t(
    "A fair die numbered $1$ to $8$ is rolled and the result $X$ pays $3X - 4$ dollars. $X$ is uniform with $E(X) = \\frac{1 + 8}{2} = 4.5$ and $\\operatorname{Var}(X) = \\frac{8^2 - 1}{12} = \\frac{21}{4}$. So the expected payout is $3 \\cdot 4.5 - 4 = 9.5$ dollars, and the variance of the payout is $3^2 \\cdot \\frac{21}{4} = \\frac{189}{4}$.\n\nCheck: the payouts run evenly from $3 \\cdot 1 - 4 = -1$ to $3 \\cdot 8 - 4 = 20$, and their midpoint is $\\frac{-1 + 20}{2} = 9.5$, the expected payout.\n\nIn this lesson we model dice, tickets and random numbers with uniform distributions and find the mean and the variance of a payout that is a linear function of the outcome.",
    "掷一枚标有 $1$ 到 $8$ 的均匀骰子，结果 $X$ 带来 $3X - 4$ 元的收益。$X$ 服从均匀分布，$E(X) = \\frac{1 + 8}{2} = 4.5$，$\\operatorname{Var}(X) = \\frac{8^2 - 1}{12} = \\frac{21}{4}$。所以期望收益为 $3 \\cdot 4.5 - 4 = 9.5$ 元，收益的方差为 $3^2 \\cdot \\frac{21}{4} = \\frac{189}{4}$。\n\n检验：收益从 $3 \\cdot 1 - 4 = -1$ 均匀地变到 $3 \\cdot 8 - 4 = 20$，中点为 $\\frac{-1 + 20}{2} = 9.5$，正是期望收益。\n\n本课我们用均匀分布为骰子、彩票和随机数建模，并求作为结果的一次函数的收益的均值与方差。",
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
        "The payout is a linear function of the outcome, so its mean is the same linear function applied to the mean outcome. A die numbered $1$ to $6$ pays $3X - 5$ dollars. $E(X) = 3.5$, so the expected payout is $3 \\cdot 3.5 - 5 = 5.5$ dollars.\n\n> **Watch out.** The mean outcome is $\\frac{n + 1}{2}$, not $\\frac{n}{2}$. For a die numbered $1$ to $10$ paying $2X - 3$, the expected payout is $2 \\cdot 5.5 - 3 = 8$, not $2 \\cdot 5 - 3 = 7$.",
        "收益是结果的一次函数，所以它的均值就是把同样的一次函数作用于结果的均值。掷一枚 $1$ 到 $6$ 的骰子，收益为 $3X - 5$ 元。$E(X) = 3.5$，所以期望收益为 $3 \\cdot 3.5 - 5 = 5.5$ 元。\n\n> **注意。** 结果的均值是 $\\frac{n + 1}{2}$，而不是 $\\frac{n}{2}$。对标有 $1$ 到 $10$、收益为 $2X - 3$ 的骰子，期望收益为 $2 \\cdot 5.5 - 3 = 8$，而不是 $2 \\cdot 5 - 3 = 7$。",
      ),
      generate(rng) {
        const s = uniformStory(rng);
        const a = rng.int(2, 5);
        const b = rng.int(1, 3 * s.n);
        const value = Q.of(a * (s.n + 1) - 2 * b, 2);
        const mean = Q.of(s.n + 1, 2);
        return numberProblem({
          prompt: t(
            `${s.en}, and the result $X$ pays $${a}X - ${b}$ dollars. Find the expected payout.`,
            `${s.zh}，结果 $X$ 带来 $${a}X - ${b}$ 元的收益。求期望收益。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              Q.of(a * s.n - 2 * b, 2),
              `That uses $\\frac{${s.n}}{2}$ as the mean outcome; the values $1$ to $${s.n}$ have mean $\\frac{1 + ${s.n}}{2}$.`,
              `这把 $\\frac{${s.n}}{2}$ 当作结果的均值；$1$ 到 $${s.n}$ 的均值是 $\\frac{1 + ${s.n}}{2}$。`,
            ),
            why(
              Q.of(a * (s.n + 1), 2),
              `That leaves out the $${b}$ dollars subtracted from every payout.`,
              `这漏掉了每次收益都要减去的 $${b}$ 元。`,
            ),
            why(
              Q.of(a * s.n - b),
              `That uses the largest outcome $${s.n}$ in place of the mean outcome.`,
              `这用最大结果 $${s.n}$ 代替了结果的均值。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the mean outcome", "求结果的均值"],
                t("$X$ is uniform on $1$ to $n$:", "$X$ 在 $1$ 到 $n$ 上均匀分布："),
                [`E(X) = \\frac{1 + ${s.n}}{2} = ${qt(mean)}`],
              ],
              [
                ["Apply the payout", "代入收益"],
                t("Expectation passes through the linear payout:", "期望可以穿过线性收益："),
                [`E(${a}X - ${b}) = ${a} \\cdot ${qt(mean)} - ${b} = ${qt(value)}`],
              ],
            ],
            t(
              `The payouts run evenly from $${a} - ${b} = ${a - b}$ to $${a} \\cdot ${s.n} - ${b} = ${a * s.n - b}$, and their midpoint is $\\frac{${a - b} + ${par(a * s.n - b)}}{2} = ${qt(value)}$.`,
              `收益从 $${a} - ${b} = ${a - b}$ 均匀地变到 $${a} \\cdot ${s.n} - ${b} = ${a * s.n - b}$，中点为 $\\frac{${a - b} + ${par(a * s.n - b)}}{2} = ${qt(value)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "variance-of-a-uniform-payout",
      title: t("Variance of payouts", "收益的方差"),
      explanation: t(
        "Adding a constant does not change the spread of the payout, while the multiplier scales the variance by its square. A die numbered $1$ to $6$ pays $2X + 1$: $\\operatorname{Var}(2X + 1) = 4 \\cdot \\frac{35}{12} = \\frac{35}{3}$.\n\n> **Watch out.** Square the multiplier. For a die numbered $1$ to $6$ paying $3X + 10$, the variance is $9 \\cdot \\frac{35}{12} = \\frac{105}{4}$, not $3 \\cdot \\frac{35}{12} = \\frac{35}{4}$.",
        "加上一个常数不会改变收益的分散程度，而乘数会使方差乘以它的平方。掷一枚 $1$ 到 $6$ 的骰子，收益为 $2X + 1$：$\\operatorname{Var}(2X + 1) = 4 \\cdot \\frac{35}{12} = \\frac{35}{3}$。\n\n> **注意。** 乘数要平方。对标有 $1$ 到 $6$、收益为 $3X + 10$ 的骰子，方差为 $9 \\cdot \\frac{35}{12} = \\frac{105}{4}$，而不是 $3 \\cdot \\frac{35}{12} = \\frac{35}{4}$。",
      ),
      generate(rng) {
        const s = uniformStory(rng);
        const a = rng.int(2, 6);
        const b = rng.int(1, 20);
        const vx = uniformVar(s.n);
        const value = vx.mul(Q.of(a * a));
        return numberProblem({
          prompt: t(
            `${s.en}, and the result $X$ pays $${a}X + ${b}$ dollars. Find the variance of the payout.`,
            `${s.zh}，结果 $X$ 带来 $${a}X + ${b}$ 元的收益。求收益的方差。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(vx.mul(Q.of(a)), `That multiplies by $${a}$ without squaring it.`, `这乘的是 $${a}$，没有平方。`),
            why(
              value.add(Q.of(b)),
              `That adds $${b}$; a fixed amount added to every payout does not change the spread.`,
              `这加上了 $${b}$；每次收益都加上固定金额不改变离散程度。`,
            ),
            why(
              vx,
              "That is the variance of the outcome itself; the payout multiplies it by the square of the multiplier.",
              "这是结果本身的方差；收益还要乘以乘数的平方。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the variance of the outcome", "求结果的方差"],
                t(`$X$ is uniform on $${s.n}$ values:`, `$X$ 在 $${s.n}$ 个值上均匀分布：`),
                [`\\operatorname{Var}(X) = \\frac{${s.n}^2 - 1}{12} = ${qt(vx)}`],
              ],
              [
                ["Apply the payout", "代入收益"],
                t("The constant drops out and the multiplier is squared:", "常数消失，乘数要平方："),
                [`\\operatorname{Var}(${a}X + ${b}) = ${a}^2 \\cdot ${qt(vx)} = ${qt(value)}`],
              ],
            ],
            t(
              `Adding $${b}$ moves the mean payout but leaves every distance from the mean unchanged, while multiplying by $${a}$ multiplies each squared distance by $${a * a}$, so the variance is $${a * a}$ times $${qt(vx)}$.`,
              `加上 $${b}$ 移动了收益的均值，但到均值的每个距离不变；乘以 $${a}$ 使每个平方距离乘以 $${a * a}$，所以方差是 $${qt(vx)}$ 的 $${a * a}$ 倍。`,
            ),
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
  intro: t(
    "A card is drawn from a standard deck, and $X = 1$ if it is a heart and $X = 0$ otherwise. Then $X \\sim \\operatorname{Bernoulli}(\\frac{1}{4})$: $P(X = 1) = \\frac{13}{52} = \\frac{1}{4}$ and $P(X = 0) = \\frac{3}{4}$. The parameter can also come from a comparison: if a success is $4$ times as likely as a failure, then $p = 4(1 - p)$, so $5p = 4$ and $p = \\frac{4}{5}$.\n\nCheck: $\\frac{1}{4} + \\frac{3}{4} = 1$, and with $p = \\frac{4}{5}$ the failure probability is $\\frac{1}{5}$ and $4 \\cdot \\frac{1}{5} = \\frac{4}{5}$, as required.\n\nIn this lesson we turn an event into a Bernoulli indicator, read off $P(X = 1)$ and $P(X = 0)$, and find the parameter $p$ from a stated ratio between success and failure.",
    "从一副标准扑克牌中抽一张，若是红桃则 $X = 1$，否则 $X = 0$。于是 $X \\sim \\operatorname{Bernoulli}(\\frac{1}{4})$：$P(X = 1) = \\frac{13}{52} = \\frac{1}{4}$，$P(X = 0) = \\frac{3}{4}$。参数也可以由比较给出：若成功的可能性是失败的 $4$ 倍，则 $p = 4(1 - p)$，所以 $5p = 4$，$p = \\frac{4}{5}$。\n\n检验：$\\frac{1}{4} + \\frac{3}{4} = 1$；取 $p = \\frac{4}{5}$，失败概率为 $\\frac{1}{5}$，而 $4 \\cdot \\frac{1}{5} = \\frac{4}{5}$，符合要求。\n\n本课我们把事件变成伯努利示性变量，读出 $P(X = 1)$ 和 $P(X = 0)$，并由成功与失败之间给定的比求出参数 $p$。",
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
        "Any event gives a Bernoulli variable that equals one when the event happens, and its parameter is the probability of the event. Let $X = 1$ if a fair die shows at most $2$ and $X = 0$ otherwise. Then $X \\sim \\operatorname{Bernoulli}(\\frac{1}{3})$ and $P(X = 0) = \\frac{2}{3}$.\n\n> **Watch out.** $X = 0$ is the event failing, not the event itself, and the two values are rarely equally likely. If $X = 1$ when a die shows at most $2$, then $P(X = 0) = \\frac{4}{6} = \\frac{2}{3}$, not $\\frac{1}{3}$ and not $\\frac{1}{2}$.",
        "任何事件都给出一个伯努利变量，事件发生时取 1，它的参数就是事件发生的概率。若均匀骰子点数不超过 $2$ 则令 $X = 1$，否则 $X = 0$。于是 $X \\sim \\operatorname{Bernoulli}(\\frac{1}{3})$，$P(X = 0) = \\frac{2}{3}$。\n\n> **注意。** $X = 0$ 表示事件不发生，而不是事件本身，两个值也很少同样可能。若骰子点数不超过 $2$ 时 $X = 1$，则 $P(X = 0) = \\frac{4}{6} = \\frac{2}{3}$，既不是 $\\frac{1}{3}$，也不是 $\\frac{1}{2}$。",
      ),
      generate(rng) {
        let s: BernoulliStory;
        do s = bernoulliStory(rng);
        while (s.p.eq(Q.of(1, 2)));
        const x = rng.int(0, 1);
        const q = Q.of(1).sub(s.p);
        const value = x === 1 ? s.p : q;
        return numberProblem({
          prompt: t(
            `Let $X = 1$ if ${s.en}, and $X = 0$ otherwise. Find $P(X = ${x})$.`,
            `若${s.zh}，则令 $X = 1$，否则 $X = 0$。求 $P(X = ${x})$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              Q.of(1).sub(value),
              x === 1
                ? "That is $P(X = 0)$, the probability that the event fails."
                : "That is $P(X = 1)$, the probability of the event itself; $X = 0$ is the event failing.",
              x === 1 ? "这是 $P(X = 0)$，即事件不发生的概率。" : "这是 $P(X = 1)$，即事件本身的概率；$X = 0$ 表示事件不发生。",
            ),
            why(
              Q.of(1, 2),
              "That treats the two values as equally likely; they have probabilities $p$ and $1 - p$.",
              "这把两个值看作同样可能；它们的概率分别是 $p$ 和 $1 - p$。",
            ),
            why(
              s.p.div(q),
              "That is the ratio of success to failure, the odds, not a probability.",
              "这是成功与失败之比，即赔率，而不是概率。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the parameter", "求参数"],
                t(
                  `$X = 1$ exactly when ${s.en}, which has probability $${s.p.toLatex()}$:`,
                  `$X = 1$ 当且仅当${s.zh}，其概率为 $${s.p.toLatex()}$：`,
                ),
                [`X \\sim \\operatorname{Bernoulli}\\left(${s.p.toLatex()}\\right)`],
              ],
              [
                ["Read off the probability", "读出概率"],
                t(
                  x === 1 ? "The value $1$ has probability $p$:" : "The value $0$ has probability $1 - p$:",
                  x === 1 ? "取值 $1$ 的概率为 $p$：" : "取值 $0$ 的概率为 $1 - p$：",
                ),
                [x === 1 ? `P(X = 1) = ${value.toLatex()}` : `P(X = 0) = 1 - ${s.p.toLatex()} = ${value.toLatex()}`],
              ],
            ],
            t(
              `The two probabilities add to one: $${q.toLatex()} + ${s.p.toLatex()} = 1$.`,
              `两个概率之和为一：$${q.toLatex()} + ${s.p.toLatex()} = 1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "bernoulli-parameter-from-odds",
      title: t("Finding the parameter", "求参数"),
      explanation: t(
        "The probabilities of success and failure must add to one, so a stated ratio between them gives a single equation for the parameter. If success is $3$ times as likely as failure, then $p = 3(1 - p)$, so $p = \\frac{3}{4}$.\n\n> **Watch out.** The ratio compares success with failure, so $p$ is not $\\frac{1}{k + 1}$. If success is twice as likely as failure, then $p = \\frac{2}{3}$; $\\frac{1}{3}$ is the probability of failure.",
        "成功和失败的概率之和必须为 1，所以给定它们之间的比就得到关于参数的一个方程。若成功的可能性是失败的 $3$ 倍，则 $p = 3(1 - p)$，所以 $p = \\frac{3}{4}$。\n\n> **注意。** 这个比是成功与失败之比，所以 $p$ 不是 $\\frac{1}{k + 1}$。若成功的可能性是失败的两倍，则 $p = \\frac{2}{3}$；$\\frac{1}{3}$ 是失败的概率。",
      ),
      generate(rng) {
        const k = Q.of(rng.int(1, 9), rng.int(1, 5));
        const value = k.div(k.add(Q.of(1)));
        const kc = k.eq(Q.of(1)) ? "" : k.toLatex();
        return numberProblem({
          prompt: t(
            `$X \\sim \\operatorname{Bernoulli}(p)$ and $P(X = 1) = ${k.eq(Q.of(1)) ? "" : `${k.toLatex()} \\, `}P(X = 0)$. Find $p$.`,
            `$X \\sim \\operatorname{Bernoulli}(p)$，且 $P(X = 1) = ${k.eq(Q.of(1)) ? "" : `${k.toLatex()} \\, `}P(X = 0)$。求 $p$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(Q.of(1).div(k.add(Q.of(1))), "That is $1 - p$, the probability of failure.", "这是 $1 - p$，即失败的概率。"),
            why(
              k.div(k.add(Q.of(2))),
              "That adds $2$ in the denominator; the two probabilities $p$ and $1 - p$ give $1 + k$ there.",
              "这在分母上加了 $2$；$p$ 与 $1 - p$ 两个概率在那里给出 $1 + k$。",
            ),
            why(
              k,
              "That takes the ratio itself as the probability; the ratio compares $p$ with $1 - p$.",
              "这把比值本身当作概率；这个比是 $p$ 与 $1 - p$ 的比较。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write an equation", "列方程"],
                t("$P(X = 1) = p$ and $P(X = 0) = 1 - p$, so", "$P(X = 1) = p$，$P(X = 0) = 1 - p$，所以"),
                [`p = ${kc}(1 - p)`],
              ],
              [
                ["Solve", "求解"],
                t("Collect the terms in $p$:", "把含 $p$ 的项合并："),
                [`(1 + ${k.toLatex()})p = ${k.toLatex()}`, `p = ${value.toLatex()}`],
              ],
            ],
            t(
              `Then $1 - p = ${Q.of(1).sub(value).toLatex()}$, and $${k.toLatex()} \\cdot ${Q.of(1).sub(value).toLatex()} = ${value.toLatex()}$, so success is indeed $${k.toLatex()}$ times as likely as failure.`,
              `此时 $1 - p = ${Q.of(1).sub(value).toLatex()}$，而 $${k.toLatex()} \\cdot ${Q.of(1).sub(value).toLatex()} = ${value.toLatex()}$，所以成功的可能性确实是失败的 $${k.toLatex()}$ 倍。`,
            ),
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
  intro: t(
    "Let $X = 1$ if a fair die shows a six and $X = 0$ otherwise, so $p = \\frac{1}{6}$. Then $E(X) = \\frac{1}{6}$ and $\\operatorname{Var}(X) = p(1 - p) = \\frac{1}{6} \\cdot \\frac{5}{6} = \\frac{5}{36}$. Going the other way, if $\\operatorname{Var}(X) = \\frac{2}{9}$ and $p < \\frac{1}{2}$, then $p(1 - p) = \\frac{2}{9}$ has the roots $\\frac{1}{3}$ and $\\frac{2}{3}$, so $p = \\frac{1}{3}$.\n\nCheck: since $X^2 = X$, $E(X^2) = \\frac{1}{6}$ and $\\frac{1}{6} - \\left(\\frac{1}{6}\\right)^2 = \\frac{5}{36}$; and $\\frac{1}{3} \\cdot \\frac{2}{3} = \\frac{2}{9}$.\n\nIn this lesson we find the variance $p(1 - p)$ of a Bernoulli variable and recover $p$ from the variance, choosing between the two symmetric roots with the extra information given.",
    "若均匀骰子掷出六点则令 $X = 1$，否则 $X = 0$，所以 $p = \\frac{1}{6}$。于是 $E(X) = \\frac{1}{6}$，$\\operatorname{Var}(X) = p(1 - p) = \\frac{1}{6} \\cdot \\frac{5}{6} = \\frac{5}{36}$。反过来，若 $\\operatorname{Var}(X) = \\frac{2}{9}$ 且 $p < \\frac{1}{2}$，则 $p(1 - p) = \\frac{2}{9}$ 的根为 $\\frac{1}{3}$ 和 $\\frac{2}{3}$，所以 $p = \\frac{1}{3}$。\n\n检验：因为 $X^2 = X$，$E(X^2) = \\frac{1}{6}$，而 $\\frac{1}{6} - \\left(\\frac{1}{6}\\right)^2 = \\frac{5}{36}$；且 $\\frac{1}{3} \\cdot \\frac{2}{3} = \\frac{2}{9}$。\n\n本课我们求伯努利变量的方差 $p(1 - p)$，并由方差反求 $p$，用给出的额外信息在两个对称的根中作出选择。",
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
        "A Bernoulli variable takes only the values zero and one, so its square equals itself, and the variance is the success probability times the failure probability. For $X \\sim \\operatorname{Bernoulli}(0.3)$: $E(X) = 0.3$ and $\\operatorname{Var}(X) = 0.3 \\cdot 0.7 = 0.21$.\n\n> **Watch out.** The variance is $p(1 - p)$, not $p$, which is the mean, and not $p^2$, which is the square of the mean. For $p = 0.2$: $\\operatorname{Var}(X) = 0.2 \\cdot 0.8 = 0.16$, while $p^2 = 0.04$.",
        "伯努利变量只取 0 和 1，所以它的平方等于它自己，方差就是成功概率乘以失败概率。对 $X \\sim \\operatorname{Bernoulli}(0.3)$：$E(X) = 0.3$，$\\operatorname{Var}(X) = 0.3 \\cdot 0.7 = 0.21$。\n\n> **注意。** 方差是 $p(1 - p)$，不是均值 $p$，也不是均值的平方 $p^2$。取 $p = 0.2$：$\\operatorname{Var}(X) = 0.2 \\cdot 0.8 = 0.16$，而 $p^2 = 0.04$。",
      ),
      generate(rng) {
        const s = bernoulliStory(rng);
        const q = Q.of(1).sub(s.p);
        const value = s.p.mul(q);
        return numberProblem({
          prompt: t(
            `Let $X = 1$ if ${s.en}, and $X = 0$ otherwise. Find $\\operatorname{Var}(X)$.`,
            `若${s.zh}，则令 $X = 1$，否则 $X = 0$。求 $\\operatorname{Var}(X)$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(s.p, "That is $p = E(X)$, the mean, not the variance.", "这是 $p = E(X)$，是均值而不是方差。"),
            why(
              s.p.pow(2),
              "That is $p^2 = E(X)^2$; the variance is $E(X^2) - E(X)^2 = p - p^2$.",
              "这是 $p^2 = E(X)^2$；方差是 $E(X^2) - E(X)^2 = p - p^2$。",
            ),
            why(q, "That is $1 - p$, the probability of failure; multiply it by $p$.", "这是 $1 - p$，即失败的概率；还要乘以 $p$。"),
            why(
              Q.of(1).sub(s.p.pow(2)),
              "That takes $E(X^2) = 1$; since $X^2 = X$, $E(X^2) = p$.",
              "这取了 $E(X^2) = 1$；由于 $X^2 = X$，$E(X^2) = p$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the parameter", "求参数"],
                t(`$X = 1$ exactly when ${s.en}:`, `$X = 1$ 当且仅当${s.zh}：`),
                [`p = ${s.p.toLatex()}, \\quad 1 - p = ${q.toLatex()}`],
              ],
              [
                ["Multiply", "相乘"],
                t("The variance of a Bernoulli variable is $p(1 - p)$:", "伯努利变量的方差为 $p(1 - p)$："),
                [`\\operatorname{Var}(X) = ${s.p.toLatex()} \\cdot ${q.toLatex()} = ${value.toLatex()}`],
              ],
            ],
            t(
              `Since $X^2 = X$, $E(X^2) = E(X) = ${s.p.toLatex()}$, and $${s.p.toLatex()} - \\left(${s.p.toLatex()}\\right)^2 = ${value.toLatex()}$ again.`,
              `由于 $X^2 = X$，$E(X^2) = E(X) = ${s.p.toLatex()}$，而 $${s.p.toLatex()} - \\left(${s.p.toLatex()}\\right)^2 = ${value.toLatex()}$，结果相同。`,
            ),
          ),
        });
      },
    },
    {
      id: "bernoulli-parameter-from-the-variance",
      title: t("The parameter from the variance", "由方差求参数"),
      explanation: t(
        "The variance equation is a quadratic in the parameter with two symmetric solutions, so extra information is needed to choose between them. If $\\operatorname{Var}(X) = \\frac{6}{25}$ and $p < \\frac{1}{2}$, solve $p(1 - p) = \\frac{6}{25}$: $p = \\frac{2}{5}$ or $\\frac{3}{5}$, so $p = \\frac{2}{5}$.\n\n> **Watch out.** Both roots solve the equation; keep the one on the stated side of $\\frac{1}{2}$. With $\\operatorname{Var}(X) = \\frac{3}{16}$ and $p > \\frac{1}{2}$, the roots are $\\frac{1}{4}$ and $\\frac{3}{4}$, so $p = \\frac{3}{4}$.",
        "方差方程是关于参数的二次方程，有两个对称的解，所以需要额外的信息来在两者之间选择。若 $\\operatorname{Var}(X) = \\frac{6}{25}$ 且 $p < \\frac{1}{2}$，解 $p(1 - p) = \\frac{6}{25}$：$p = \\frac{2}{5}$ 或 $\\frac{3}{5}$，所以 $p = \\frac{2}{5}$。\n\n> **注意。** 两个根都满足方程；要保留位于 $\\frac{1}{2}$ 指定一侧的那个。若 $\\operatorname{Var}(X) = \\frac{3}{16}$ 且 $p > \\frac{1}{2}$，根为 $\\frac{1}{4}$ 和 $\\frac{3}{4}$，所以 $p = \\frac{3}{4}$。",
      ),
      generate(rng) {
        const d = rng.int(3, 12);
        const n = rng.int(1, Math.ceil(d / 2) - 1);
        const p = Q.of(n, d);
        const v = p.mul(Q.of(1).sub(p));
        const small = rng.bool();
        const value = small ? p : Q.of(1).sub(p);
        const disc = Q.of(1).sub(v.mul(Q.of(4)));
        return numberProblem({
          prompt: t(
            `$X \\sim \\operatorname{Bernoulli}(p)$ with $\\operatorname{Var}(X) = ${v.toLatex()}$ and $p ${small ? "<" : ">"} \\frac{1}{2}$. Find $p$.`,
            `$X \\sim \\operatorname{Bernoulli}(p)$，$\\operatorname{Var}(X) = ${v.toLatex()}$，且 $p ${small ? "<" : ">"} \\frac{1}{2}$。求 $p$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              Q.of(1).sub(value),
              `That is the other root, which lies on the wrong side of $\\frac{1}{2}$.`,
              `这是另一个根，它在 $\\frac{1}{2}$ 的另一侧。`,
            ),
            why(v, "That takes the variance itself as $p$; the variance is $p(1 - p)$.", "这把方差本身当作 $p$；方差是 $p(1 - p)$。"),
            why(
              Q.of(1).sub(v),
              "That solves $1 - p = \\operatorname{Var}(X)$; the variance is the product $p(1 - p)$.",
              "这是解 $1 - p = \\operatorname{Var}(X)$；方差是乘积 $p(1 - p)$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the quadratic", "列出二次方程"],
                t("Set $p(1 - p)$ equal to the variance:", "令 $p(1 - p)$ 等于方差："),
                [`p(1 - p) = ${v.toLatex()}`, `p^2 - p + ${v.toLatex()} = 0`],
              ],
              [
                ["Solve", "求解"],
                t(
                  `The discriminant is $1 - 4 \\cdot ${v.toLatex()} = ${disc.toLatex()}$, a perfect square, so`,
                  `判别式为 $1 - 4 \\cdot ${v.toLatex()} = ${disc.toLatex()}$，是完全平方，所以`,
                ),
                [`p = ${p.toLatex()} \\quad \\text{or} \\quad p = ${Q.of(1).sub(p).toLatex()}`],
              ],
              [
                ["Choose the root", "选取根"],
                t(
                  `The root ${small ? "below" : "above"} $\\frac{1}{2}$ is $p = ${value.toLatex()}$.`,
                  `${small ? "小于" : "大于"} $\\frac{1}{2}$ 的根是 $p = ${value.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `$${value.toLatex()} \\cdot ${Q.of(1).sub(value).toLatex()} = ${v.toLatex()}$, the variance given, and $${value.toLatex()} ${small ? "<" : ">"} \\frac{1}{2}$.`,
              `$${value.toLatex()} \\cdot ${Q.of(1).sub(value).toLatex()} = ${v.toLatex()}$，正是所给的方差，且 $${value.toLatex()} ${small ? "<" : ">"} \\frac{1}{2}$。`,
            ),
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
  intro: t(
    "Let $X \\sim B(20, 0.3)$. Then $E(X) = 20 \\cdot 0.3 = 6$, $\\operatorname{Var}(X) = 6 \\cdot 0.7 = 4.2$, and $E(X^2) = \\operatorname{Var}(X) + E(X)^2 = 4.2 + 36 = 40.2$. Going the other way, if only $E(X) = 6$ and $\\operatorname{Var}(X) = 4.2$ are known, then $1 - p = \\frac{4.2}{6} = 0.7$, so $p = 0.3$ and $n = \\frac{6}{0.3} = 20$.\n\nCheck: $X$ is a sum of $20$ independent indicators, each with mean $0.3$ and variance $0.3 \\cdot 0.7 = 0.21$, so the mean is $20 \\cdot 0.3 = 6$ and the variance is $20 \\cdot 0.21 = 4.2$.\n\nIn this lesson we recover $n$ and $p$ of a binomial variable from its mean and variance, and we find its second moment $E(X^2)$ from the mean and the variance.",
    "设 $X \\sim B(20, 0.3)$。则 $E(X) = 20 \\cdot 0.3 = 6$，$\\operatorname{Var}(X) = 6 \\cdot 0.7 = 4.2$，$E(X^2) = \\operatorname{Var}(X) + E(X)^2 = 4.2 + 36 = 40.2$。反过来，若只知道 $E(X) = 6$，$\\operatorname{Var}(X) = 4.2$，则 $1 - p = \\frac{4.2}{6} = 0.7$，所以 $p = 0.3$，$n = \\frac{6}{0.3} = 20$。\n\n检验：$X$ 是 $20$ 个相互独立的示性变量之和，每个均值为 $0.3$、方差为 $0.3 \\cdot 0.7 = 0.21$，所以均值为 $20 \\cdot 0.3 = 6$，方差为 $20 \\cdot 0.21 = 4.2$。\n\n本课我们由二项变量的均值和方差求出 $n$ 和 $p$，并由均值和方差求它的二阶矩 $E(X^2)$。",
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
        "The variance divided by the mean gives the failure probability, and then the mean divided by the success probability gives the number of trials. If $E(X) = 12$ and $\\operatorname{Var}(X) = 8.4$, then $1 - p = \\frac{8.4}{12} = 0.7$, so $p = 0.3$ and $n = \\frac{12}{0.3} = 40$.\n\n> **Watch out.** $\\frac{\\operatorname{Var}(X)}{E(X)}$ is $1 - p$, not $p$. With $E(X) = 6$ and $\\operatorname{Var}(X) = 4.2$, the ratio $0.7$ is the failure probability, so $p = 0.3$ and $n = 20$.",
        "方差除以均值得到失败的概率，再用均值除以成功概率得到试验次数。若 $E(X) = 12$，$\\operatorname{Var}(X) = 8.4$，则 $1 - p = \\frac{8.4}{12} = 0.7$，所以 $p = 0.3$，$n = \\frac{12}{0.3} = 40$。\n\n> **注意。** $\\frac{\\operatorname{Var}(X)}{E(X)}$ 是 $1 - p$，而不是 $p$。若 $E(X) = 6$，$\\operatorname{Var}(X) = 4.2$，比值 $0.7$ 是失败概率，所以 $p = 0.3$，$n = 20$。",
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
        const q = Q.of(1).sub(p);
        const askN = rng.bool();
        const value = askN ? Q.of(n) : p;
        return numberProblem({
          prompt: t(
            `$X \\sim B(n, p)$ with $E(X) = ${qt(mean)}$ and $\\operatorname{Var}(X) = ${qt(v)}$. Find $${askN ? "n" : "p"}$.`,
            `$X \\sim B(n, p)$，$E(X) = ${qt(mean)}$，$\\operatorname{Var}(X) = ${qt(v)}$。求 $${askN ? "n" : "p"}$。`,
          ),
          answer: value,
          mistakes: apart(
            value,
            askN
              ? [
                  why(
                    mean.mul(Q.of(2)),
                    "That assumes $p = \\frac{1}{2}$; find $p$ from the ratio of the variance to the mean first.",
                    "这假设了 $p = \\frac{1}{2}$；应先由方差与均值之比求出 $p$。",
                  ),
                  why(
                    v.div(p),
                    "That divides the variance by $p$, which gives $n(1 - p)$; divide the mean by $p$.",
                    "这用方差除以 $p$，得到的是 $n(1 - p)$；应该用均值除以 $p$。",
                  ),
                  why(
                    mean.add(v),
                    "That adds the mean and the variance, which has no meaning here.",
                    "这把均值与方差相加，在这里没有意义。",
                  ),
                ]
              : [
                  why(
                    v.div(mean),
                    "That is $\\frac{\\operatorname{Var}(X)}{E(X)} = 1 - p$, the failure probability.",
                    "这是 $\\frac{\\operatorname{Var}(X)}{E(X)} = 1 - p$，即失败的概率。",
                  ),
                  why(
                    mean.div(v),
                    "That divides the mean by the variance; the ratio the other way round is $1 - p$.",
                    "这用均值除以方差；反过来的比值才是 $1 - p$。",
                  ),
                  why(
                    Q.of(1).sub(v),
                    "That subtracts the variance from one without dividing it by the mean first.",
                    "这直接用一减去方差，没有先除以均值。",
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Divide the variance by the mean", "用方差除以均值"],
                t(
                  "Since $\\operatorname{Var}(X) = np(1 - p)$ and $E(X) = np$,",
                  "由于 $\\operatorname{Var}(X) = np(1 - p)$，$E(X) = np$，",
                ),
                [mean.eq(Q.of(1)) ? `1 - p = ${qt(q)}` : `1 - p = \\frac{${qt(v)}}{${qt(mean)}} = ${qt(q)}`, `p = ${qt(p)}`],
              ],
              [
                ["Find the number of trials", "求试验次数"],
                t("Divide the mean by $p$:", "用均值除以 $p$："),
                [`n = \\frac{${qt(mean)}}{${qt(p)}} = ${n}`],
              ],
            ],
            t(
              `With $n = ${n}$ and $p = ${qt(p)}$: $np = ${qt(mean)}$ and $np(1 - p) = ${qt(mean)} \\cdot ${qt(q)} = ${qt(v)}$, the mean and variance given.`,
              `取 $n = ${n}$，$p = ${qt(p)}$：$np = ${qt(mean)}$，$np(1 - p) = ${qt(mean)} \\cdot ${qt(q)} = ${qt(v)}$，正是所给的均值和方差。`,
            ),
          ),
        });
      },
    },
    {
      id: "second-moment-of-a-binomial-variable",
      title: t("$E(X^2)$ of a binomial variable", "二项变量的 $E(X^2)$"),
      explanation: t(
        "The second moment is the variance plus the square of the mean, and both are known for a binomial variable. For $X \\sim B(10, 0.4)$: $E(X) = 4$ and $\\operatorname{Var}(X) = 2.4$, so $E(X^2) = 2.4 + 4^2 = 18.4$.\n\n> **Watch out.** $E(X^2)$ is not $E(X)^2$; the variance has to be added. For $X \\sim B(5, 0.2)$: $E(X) = 1$ and $E(X^2) = 0.8 + 1 = 1.8$, not $1^2 = 1$.",
        "二阶矩等于方差加上均值的平方，而二项变量的这两个量都是已知的。对 $X \\sim B(10, 0.4)$：$E(X) = 4$，$\\operatorname{Var}(X) = 2.4$，所以 $E(X^2) = 2.4 + 4^2 = 18.4$。\n\n> **注意。** $E(X^2)$ 不是 $E(X)^2$；还要加上方差。对 $X \\sim B(5, 0.2)$：$E(X) = 1$，$E(X^2) = 0.8 + 1 = 1.8$，而不是 $1^2 = 1$。",
      ),
      generate(rng) {
        const p = rng.pick(PS);
        const n = rng.int(3, 40);
        const mean = p.mul(Q.of(n));
        const q = Q.of(1).sub(p);
        const v = mean.mul(q);
        const value = v.add(mean.pow(2));
        return numberProblem({
          prompt: t(`$X \\sim B(${n}, ${qt(p)})$. Find $E(X^2)$.`, `$X \\sim B(${n}, ${qt(p)})$。求 $E(X^2)$。`),
          answer: value,
          mistakes: apart(value, [
            why(mean.pow(2), "That is $E(X)^2$; add the variance to get $E(X^2)$.", "这是 $E(X)^2$；还要加上方差才得到 $E(X^2)$。"),
            why(v, "That is the variance alone; add the square of the mean.", "这只是方差；还要加上均值的平方。"),
            why(mean.add(v), "That adds the mean instead of its square.", "这加上的是均值，而不是均值的平方。"),
            why(
              Q.of(n).mul(p.pow(2)),
              "That is $np^2$, which treats $X^2$ as a binomial count with success probability $p^2$.",
              "这是 $np^2$，把 $X^2$ 当作成功概率为 $p^2$ 的二项计数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the mean and the variance", "求均值与方差"],
                t("For a binomial variable,", "对二项变量，"),
                [
                  `E(X) = np = ${n} \\cdot ${qt(p)} = ${qt(mean)}`,
                  `\\operatorname{Var}(X) = np(1 - p) = ${qt(mean)} \\cdot ${qt(q)} = ${qt(v)}`,
                ],
              ],
              [
                ["Add the square of the mean", "加上均值的平方"],
                t("Rearrange $\\operatorname{Var}(X) = E(X^2) - E(X)^2$:", "把 $\\operatorname{Var}(X) = E(X^2) - E(X)^2$ 变形："),
                [`E(X^2) = ${qt(v)} + (${qt(mean)})^2 = ${qt(value)}`],
              ],
            ],
            t(
              `Counting pairs of trials instead, $E(X^2) = np + n(n - 1)p^2 = ${qt(mean)} + ${n} \\cdot ${n - 1} \\cdot (${qt(p)})^2 = ${qt(value)}$.`,
              `改为按试验对计数：$E(X^2) = np + n(n - 1)p^2 = ${qt(mean)} + ${n} \\cdot ${n - 1} \\cdot (${qt(p)})^2 = ${qt(value)}$。`,
            ),
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

/** poissonTex writes P(X = k) of Po(λ) without powers or factorials that are one. */
const poissonTex = (lambda: number, k: number) =>
  k === 0 ? `e^{-${lambda}}` : k === 1 ? `${lambda} e^{-${lambda}}` : `e^{-${lambda}} \\frac{${pw(lambda, k)}}{${k}!}`;

/** termTex writes λʲ/j! of Po(λ) as simply as possible. */
const termTex = (lambda: number, j: number) => (j === 0 ? "1" : j === 1 ? `${lambda}` : `\\frac{${pw(lambda, j)}}{${j}!}`);

/** poissonCheck checks P(X = k) of Po(λ) by the step from P(X = k − 1), or by e^λ when k = 0. */
const poissonCheck = (lambda: number, k: number, value: Q): Text => {
  const e = lambda === 1 ? "e" : `e^{${lambda}}`;
  const step = k === 1 ? `${lambda}` : `\\frac{${lambda}}{${k}}`;
  return k === 0
    ? t(
        `$${e} \\approx ${Math.exp(lambda).toFixed(4)}$, and $\\frac{1}{${Math.exp(lambda).toFixed(4)}} \\approx ${dec(value)}$.`,
        `$${e} \\approx ${Math.exp(lambda).toFixed(4)}$，而 $\\frac{1}{${Math.exp(lambda).toFixed(4)}} \\approx ${dec(value)}$。`,
      )
    : t(
        `Each Poisson probability is the one before times $\\frac{\\lambda}{k}$: $P(X = ${k - 1}) \\approx ${poissonP(lambda, k - 1).toFixed(4)}$, and $${poissonP(lambda, k - 1).toFixed(4)} \\cdot ${step} \\approx ${dec(value)}$.`,
        `每个泊松概率都等于前一个乘以 $\\frac{\\lambda}{k}$：$P(X = ${k - 1}) \\approx ${poissonP(lambda, k - 1).toFixed(4)}$，而 $${poissonP(lambda, k - 1).toFixed(4)} \\cdot ${step} \\approx ${dec(value)}$。`,
      );
};

/** thePoissonDistribution counts events that occur at a constant average rate. */
export const thePoissonDistribution: TopicDef = {
  id: "the-poisson-distribution",
  title: t("The Poisson Distribution", "泊松分布"),
  summary: t(
    "$X \\sim \\text{Po}(\\lambda)$ counts events that occur independently at a constant average rate $\\lambda$ per interval: $P(X = k) = \\frac{e^{-\\lambda}\\lambda^k}{k!}$ for $k = 0, 1, 2, \\dots$.",
    "$X \\sim \\text{Po}(\\lambda)$ 统计以恒定平均速率 $\\lambda$（每个区间）独立发生的事件数：$P(X = k) = \\frac{e^{-\\lambda}\\lambda^k}{k!}$，$k = 0, 1, 2, \\dots$。",
  ),
  intro: t(
    "Let $X \\sim \\operatorname{Po}(2)$. Then $P(X = 0) = e^{-2} \\approx 0.1353$, $P(X = 1) = 2e^{-2} \\approx 0.2707$ and $P(X = 2) = e^{-2} \\frac{2^2}{2!} = 2e^{-2} \\approx 0.2707$. So $P(X \\le 2) \\approx 0.1353 + 0.2707 + 0.2707 = 0.6767$, and $P(X \\ge 3) = 1 - P(X \\le 2) \\approx 0.3233$.\n\nCheck: each probability is the one before times $\\frac{\\lambda}{k}$, and $\\frac{2}{2} = 1$, which is why $P(X = 1)$ and $P(X = 2)$ are equal; and $0.6767 + 0.3233 = 1$.\n\nIn this lesson we find single Poisson probabilities from the formula $e^{-\\lambda}\\frac{\\lambda^k}{k!}$ and cumulative ones by adding a few terms, using the complement for an event of the form $X \\ge k$.",
    "设 $X \\sim \\operatorname{Po}(2)$。则 $P(X = 0) = e^{-2} \\approx 0.1353$，$P(X = 1) = 2e^{-2} \\approx 0.2707$，$P(X = 2) = e^{-2} \\frac{2^2}{2!} = 2e^{-2} \\approx 0.2707$。所以 $P(X \\le 2) \\approx 0.1353 + 0.2707 + 0.2707 = 0.6767$，$P(X \\ge 3) = 1 - P(X \\le 2) \\approx 0.3233$。\n\n检验：每个概率都等于前一个乘以 $\\frac{\\lambda}{k}$，而 $\\frac{2}{2} = 1$，这就是 $P(X = 1)$ 与 $P(X = 2)$ 相等的原因；且 $0.6767 + 0.3233 = 1$。\n\n本课我们用公式 $e^{-\\lambda}\\frac{\\lambda^k}{k!}$ 求泊松分布的单点概率，并把几项相加求累积概率，对形如 $X \\ge k$ 的事件用补事件。",
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
        "The Poisson distribution counts events that occur independently at a constant average rate, and each probability uses that rate in the formula. For $X \\sim \\operatorname{Po}(2)$: $P(X = 3) = e^{-2} \\frac{2^3}{3!} = \\frac{8}{6} e^{-2} \\approx 0.1804$.\n\n> **Watch out.** Both the factor $e^{-\\lambda}$ and the factorial belong in the formula. For $X \\sim \\operatorname{Po}(3)$: $P(X = 2) = e^{-3} \\frac{3^2}{2!} \\approx 0.2240$, not $\\frac{3^2}{2!} = 4.5$, which is not even a probability.",
        "泊松分布计算以固定平均速率独立发生的事件个数，每个概率都在公式中用到这个速率。对 $X \\sim \\operatorname{Po}(2)$：$P(X = 3) = e^{-2} \\frac{2^3}{3!} = \\frac{8}{6} e^{-2} \\approx 0.1804$。\n\n> **注意。** 因子 $e^{-\\lambda}$ 和阶乘都不能少。对 $X \\sim \\operatorname{Po}(3)$：$P(X = 2) = e^{-3} \\frac{3^2}{2!} \\approx 0.2240$，而不是 $\\frac{3^2}{2!} = 4.5$，后者甚至不是概率。",
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
          mistakes: apart(value, [
            why(r4(lambda ** k / fact(k)), "That leaves out the factor $e^{-\\lambda}$.", "这漏掉了因子 $e^{-\\lambda}$。"),
            why(
              r4(poissonCdf(lambda, k)),
              `That adds the probabilities of $0$ to $${k}$, which is $P(X \\le ${k})$.`,
              `这把 $0$ 到 $${k}$ 的概率加了起来，得到的是 $P(X \\le ${k})$。`,
            ),
            why(r4(Math.exp(-lambda) * lambda ** k), `That leaves out the division by $${k}!$.`, `这漏掉了除以 $${k}!$。`),
            why(r4(poissonP(lambda, k + 1)), `That is $P(X = ${k + 1})$, one count too many.`, `这是 $P(X = ${k + 1})$，多了一次。`),
            why(Q.of(1).sub(value), `That is $P(X \\ne ${k})$, the complement.`, `这是补事件的概率 $P(X \\ne ${k})$。`),
          ]),
          solution: walked(
            [
              [
                ["Write the formula", "写出公式"],
                t(
                  `Put $\\lambda = ${lambda}$ and $k = ${k}$ into $e^{-\\lambda}\\frac{\\lambda^k}{k!}$:`,
                  `把 $\\lambda = ${lambda}$，$k = ${k}$ 代入 $e^{-\\lambda}\\frac{\\lambda^k}{k!}$：`,
                ),
                [`P(X = ${k}) = ${poissonTex(lambda, k)}`],
              ],
              [["Evaluate", "计算"], t("Round to four decimal places:", "保留四位小数："), [`P(X = ${k}) \\approx ${dec(value)}`]],
            ],
            poissonCheck(lambda, k, value),
          ),
        });
      },
    },
    {
      id: "poisson-cumulative-probabilities",
      title: t("Cumulative probabilities", "累积概率"),
      explanation: t(
        "For at least some number of events, subtract the probabilities of the few smaller counts from one, rather than summing an infinite tail. For $X \\sim \\operatorname{Po}(1.5)$: $P(X \\ge 2) = 1 - P(X = 0) - P(X = 1) = 1 - e^{-1.5}(1 + 1.5) \\approx 0.4422$.\n\n> **Watch out.** The complement of $X \\ge k$ stops at $k - 1$. For $X \\sim \\operatorname{Po}(2)$: $P(X \\ge 1) = 1 - P(X = 0) \\approx 0.8647$, while $1 - P(X \\le 1) \\approx 0.5940$ is $P(X \\ge 2)$.",
        "求至少发生若干次的概率时，用 1 减去较小几个次数的概率，而不是去求无穷多项的和。对 $X \\sim \\operatorname{Po}(1.5)$：$P(X \\ge 2) = 1 - P(X = 0) - P(X = 1) = 1 - e^{-1.5}(1 + 1.5) \\approx 0.4422$。\n\n> **注意。** $X \\ge k$ 的补事件到 $k - 1$ 为止。对 $X \\sim \\operatorname{Po}(2)$：$P(X \\ge 1) = 1 - P(X = 0) \\approx 0.8647$，而 $1 - P(X \\le 1) \\approx 0.5940$ 是 $P(X \\ge 2)$。",
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
        const last = up ? k - 1 : k;
        const terms = range(0, last)
          .map((j) => termTex(lambda, j))
          .join(" + ");
        const below = r4(poissonCdf(lambda, last));
        const parts = range(0, last)
          .map((j) => poissonP(lambda, j).toFixed(4))
          .join(" + ");
        return numberProblem({
          prompt: t(
            `$X \\sim \\operatorname{Po}(${lambda})$. Find $P(X ${up ? "\\ge" : "\\le"} ${k})$.${FOUR.en}`,
            `$X \\sim \\operatorname{Po}(${lambda})$。求 $P(X ${up ? "\\ge" : "\\le"} ${k})$。${FOUR["zh-CN"]}`,
          ),
          answer: value,
          form: "decimal",
          mistakes: apart(
            value,
            up
              ? [
                  why(
                    r4(1 - poissonCdf(lambda, k)),
                    `That subtracts $P(X \\le ${k})$; the complement of $X \\ge ${k}$ is $X \\le ${k - 1}$.`,
                    `这减去的是 $P(X \\le ${k})$；$X \\ge ${k}$ 的补事件是 $X \\le ${k - 1}$。`,
                  ),
                  why(
                    r4(poissonCdf(lambda, k - 1)),
                    `That is $P(X \\le ${k - 1})$ itself; subtract it from one.`,
                    `这是 $P(X \\le ${k - 1})$ 本身；还要用一减去它。`,
                  ),
                  why(
                    r4(poissonP(lambda, k)),
                    `That is only $P(X = ${k})$; larger counts also count.`,
                    `这只是 $P(X = ${k})$；更大的次数也算在内。`,
                  ),
                ]
              : [
                  why(
                    r4(poissonCdf(lambda, k - 1)),
                    `That stops at $${k - 1}$; $X \\le ${k}$ includes $X = ${k}$.`,
                    `这只加到 $${k - 1}$；$X \\le ${k}$ 包括 $X = ${k}$。`,
                  ),
                  why(r4(1 - poissonCdf(lambda, k)), `That is $P(X > ${k})$, the complement.`, `这是补事件的概率 $P(X > ${k})$。`),
                  why(
                    r4(poissonP(lambda, k)),
                    `That is only $P(X = ${k})$; the smaller counts also count.`,
                    `这只是 $P(X = ${k})$；更小的次数也算在内。`,
                  ),
                ],
          ),
          solution: walked(
            up
              ? [
                  [
                    ["Use the complement", "用补事件"],
                    t("Only finitely many counts lie below:", "下方只有有限个次数："),
                    [`P(X \\ge ${k}) = 1 - P(X \\le ${k - 1})`],
                  ],
                  [
                    ["Add the smaller counts", "把较小的次数相加"],
                    t("Factor out $e^{-\\lambda}$:", "提出 $e^{-\\lambda}$："),
                    [
                      k === 1
                        ? `P(X \\le 0) = P(X = 0) = e^{-${lambda}} \\approx ${dec(below)}`
                        : `P(X \\le ${k - 1}) = e^{-${lambda}}\\left(${terms}\\right) \\approx ${dec(below)}`,
                    ],
                  ],
                  [
                    ["Subtract", "相减"],
                    t("Subtract from one:", "用一减去："),
                    [`P(X \\ge ${k}) \\approx 1 - ${dec(below)} = ${dec(value)}`],
                  ],
                ]
              : [
                  [
                    ["List the counts", "列出次数"],
                    t(
                      `The event is $X = ${listTex(0, k)}$; factor out $e^{-\\lambda}$:`,
                      `事件为 $X = ${listTex(0, k)}$；提出 $e^{-\\lambda}$：`,
                    ),
                    [`P(X \\le ${k}) = e^{-${lambda}}\\left(${terms}\\right)`],
                  ],
                  [["Evaluate", "计算"], t("Round to four decimal places:", "保留四位小数："), [`P(X \\le ${k}) \\approx ${dec(value)}`]],
                ],
            last === 0
              ? t(
                  `$${lambda === 1 ? "e" : `e^{${lambda}}`} \\approx ${Math.exp(lambda).toFixed(4)}$, so $P(X = 0) \\approx \\frac{1}{${Math.exp(lambda).toFixed(4)}} \\approx ${dec(below)}$, and $${dec(below)} + ${dec(value)} = 1$.`,
                  `$${lambda === 1 ? "e" : `e^{${lambda}}`} \\approx ${Math.exp(lambda).toFixed(4)}$，所以 $P(X = 0) \\approx \\frac{1}{${Math.exp(lambda).toFixed(4)}} \\approx ${dec(below)}$，而 $${dec(below)} + ${dec(value)} = 1$。`,
                )
              : t(
                  `Term by term, $P(X \\le ${last}) \\approx ${parts}$, which adds to about $${dec(below)}$${up ? `, and $${dec(below)} + ${dec(value)} = 1$` : ""}.`,
                  `逐项计算，$P(X \\le ${last}) \\approx ${parts}$，和约为 $${dec(below)}$${up ? `，而 $${dec(below)} + ${dec(value)} = 1$` : ""}。`,
                ),
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
  readonly scale: string;
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
      scale: `\\frac{${over}}{60}`,
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
      scale: `${over}`,
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
      scale: `\\frac{${over}}{7}`,
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
    scale: `${over}`,
    span: t(`${article(over)} $${over}$-metre length`, `$${over}$ 米长的一段中`),
    what: t("Flaws appear in a cable", "电缆上出现瑕疵"),
  };
}

/** scaleStep scales the rate of a story to the interval asked about. */
const scaleStep = (s: PoissonStory, lambda: number): [[string, string], Text, string[]] => [
  ["Scale the rate", "换算速率"],
  t(
    "The mean count is the rate times the length of the interval, in the rate's units:",
    "平均次数等于速率乘以区间长度（以速率的单位计）：",
  ),
  [`\\lambda = ${s.rate} \\cdot ${s.scale} = ${lambda}`],
];

/** modelingWithThePoissonDistribution scales rates to the interval asked about. */
export const modelingWithThePoissonDistribution: TopicDef = {
  id: "modeling-with-the-poisson-distribution",
  title: t("Modeling With the Poisson Distribution", "用泊松分布建模"),
  summary: t(
    "Events happening independently at a constant rate follow a Poisson distribution; for an interval t times as long, the mean is t times the rate.",
    "以恒定速率独立发生的事件服从泊松分布；若区间长度是原来的 t 倍，均值也是速率的 t 倍。",
  ),
  intro: t(
    "Emails reach an inbox independently at an average of $14$ per week. One day is $\\frac{1}{7}$ of a week, so the count in a day is $\\operatorname{Po}(2)$ with $\\lambda = 14 \\cdot \\frac{1}{7} = 2$. The probability of exactly $3$ emails in a day is $e^{-2}\\frac{2^3}{3!} \\approx 0.1804$, and the probability of at least one is $1 - e^{-2} \\approx 0.8647$.\n\nCheck: at $2$ per day, a week of $7$ days has $2 \\cdot 7 = 14$ emails on average, the rate given; and $e^{-2} \\approx 0.1353$ with $0.1353 + 0.8647 = 1$.\n\nIn this lesson we scale a rate to the interval in question to get the Poisson mean, then find the probability of an exact count and of at least one event through the complement.",
    "邮件以平均每周 $14$ 封的速率独立到达邮箱。一天是一周的 $\\frac{1}{7}$，所以一天内的邮件数服从 $\\operatorname{Po}(2)$，$\\lambda = 14 \\cdot \\frac{1}{7} = 2$。一天内恰好收到 $3$ 封的概率为 $e^{-2}\\frac{2^3}{3!} \\approx 0.1804$，至少收到一封的概率为 $1 - e^{-2} \\approx 0.8647$。\n\n检验：每天 $2$ 封，$7$ 天的一周平均 $2 \\cdot 7 = 14$ 封，正是所给的速率；且 $e^{-2} \\approx 0.1353$，$0.1353 + 0.8647 = 1$。\n\n本课我们把速率换算到所问的区间上得到泊松均值，再求恰好发生若干次的概率，并通过补事件求至少发生一次的概率。",
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
        "Scale the rate to the length of the interval in question first, because the Poisson parameter is the expected count over that interval. Calls arrive at $4$ per hour. In $30$ minutes the count is $\\operatorname{Po}(2)$, so $P(\\text{exactly } 1) = 2e^{-2} \\approx 0.2707$.\n\n> **Watch out.** Use the mean for the interval asked about, not the rate per unit. At $4$ calls per hour, $15$ minutes gives $\\lambda = 1$ and $P(\\text{no calls}) = e^{-1} \\approx 0.3679$, not $e^{-4} \\approx 0.0183$.",
        "先把速率按所问区间的长度进行换算，因为泊松参数是该区间内的期望次数。电话以每小时 $4$ 个的速率到来。$30$ 分钟内的来电数服从 $\\operatorname{Po}(2)$，所以恰有 $1$ 个的概率为 $2e^{-2} \\approx 0.2707$。\n\n> **注意。** 要用所问区间上的均值，而不是单位时间的速率。每小时 $4$ 个来电，$15$ 分钟内 $\\lambda = 1$，没有来电的概率为 $e^{-1} \\approx 0.3679$，而不是 $e^{-4} \\approx 0.0183$。",
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
        } while (!value || !Number.isInteger(lambda * 10) || lambda > 6);
        return numberProblem({
          prompt: t(
            `${s.what.en} independently at a constant average rate of $${s.rate}$ ${s.per.en}. Find the probability of exactly $${k}$ in ${s.span.en}.${FOUR.en}`,
            `${s.what["zh-CN"]}的平均速率为${s.per["zh-CN"]} $${s.rate}$ 次，相互独立且速率恒定。求${s.span["zh-CN"]}恰好发生 $${k}$ 次的概率。${FOUR["zh-CN"]}`,
          ),
          answer: value,
          form: "decimal",
          mistakes: apart(value, [
            why(
              r4(poissonP(s.rate, k)),
              `That uses the rate $${s.rate}$ ${s.per.en}; the mean for this interval is $${lambda}$.`,
              `这用了${s.per["zh-CN"]} $${s.rate}$ 的速率；这个区间上的均值是 $${lambda}$。`,
            ),
            why(
              r4(poissonCdf(lambda, k)),
              `That is $P(X \\le ${k})$; the question asks for exactly $${k}$.`,
              `这是 $P(X \\le ${k})$；题目问的是恰好 $${k}$ 次。`,
            ),
            why(r4(poissonP(lambda, k + 1)), `That is $P(X = ${k + 1})$, one count too many.`, `这是 $P(X = ${k + 1})$，多了一次。`),
            why(Q.of(1).sub(value), `That is $P(X \\ne ${k})$, the complement.`, `这是补事件的概率 $P(X \\ne ${k})$。`),
          ]),
          solution: walked(
            [
              scaleStep(s, lambda),
              [
                ["Use the Poisson formula", "用泊松公式"],
                t(`The count is $\\operatorname{Po}(${lambda})$:`, `次数服从 $\\operatorname{Po}(${lambda})$：`),
                [`P(X = ${k}) = ${poissonTex(lambda, k)} \\approx ${dec(value)}`],
              ],
            ],
            poissonCheck(lambda, k, value),
          ),
        });
      },
    },
    {
      id: "at-least-one-event",
      title: t("At least one event", "至少发生一次"),
      explanation: t(
        "The complement of at least one event is no events at all, whose Poisson probability is simply the exponential of minus the rate. If flaws appear at $0.4$ per metre, a $5$-metre length has $\\lambda = 2$ and $P(X \\ge 1) = 1 - e^{-2} \\approx 0.8647$.\n\n> **Watch out.** $e^{-\\lambda}$ is the probability of no events; subtract it from one. With $\\lambda = 0.5$: $P(X \\ge 1) = 1 - e^{-0.5} \\approx 0.3935$, not $e^{-0.5} \\approx 0.6065$.",
        "“至少一次”的补是“一次也没有”，它的泊松概率就是 e 的负速率次幂。若瑕疵以每米 $0.4$ 个出现，$5$ 米长的一段 $\\lambda = 2$，$P(X \\ge 1) = 1 - e^{-2} \\approx 0.8647$。\n\n> **注意。** $e^{-\\lambda}$ 是一次也不发生的概率；还要用一减去它。取 $\\lambda = 0.5$：$P(X \\ge 1) = 1 - e^{-0.5} \\approx 0.3935$，而不是 $e^{-0.5} \\approx 0.6065$。",
      ),
      generate(rng) {
        let s: PoissonStory;
        let lambda: number;
        let value: Q | undefined;
        do {
          s = poissonStory(rng);
          lambda = Math.round(s.rate * s.over * 1000) / 1000;
          value = round4(1 - Math.exp(-lambda));
        } while (!value || !Number.isInteger(lambda * 10) || lambda > 4);
        const none0 = r4(Math.exp(-lambda));
        return numberProblem({
          prompt: t(
            `${s.what.en} independently at a constant average rate of $${s.rate}$ ${s.per.en}. Find the probability of at least one in ${s.span.en}.${FOUR.en}`,
            `${s.what["zh-CN"]}的平均速率为${s.per["zh-CN"]} $${s.rate}$ 次，相互独立且速率恒定。求${s.span["zh-CN"]}至少发生一次的概率。${FOUR["zh-CN"]}`,
          ),
          answer: value,
          form: "decimal",
          mistakes: apart(value, [
            why(
              none0,
              "That is $P(X = 0)$, the probability of none; subtract it from one.",
              "这是 $P(X = 0)$，即一次也没有的概率；还要用一减去它。",
            ),
            why(
              r4(1 - Math.exp(-s.rate)),
              `That uses the rate $${s.rate}$ ${s.per.en}; the mean for this interval is $${lambda}$.`,
              `这用了${s.per["zh-CN"]} $${s.rate}$ 的速率；这个区间上的均值是 $${lambda}$。`,
            ),
            why(
              r4(poissonP(lambda, 1)),
              "That is the probability of exactly one; at least one also includes two or more.",
              "这是恰好一次的概率；至少一次还包括两次及以上。",
            ),
          ]),
          solution: walked(
            [
              scaleStep(s, lambda),
              [
                ["Use the complement", "用补事件"],
                t("At least one fails only when there are none:", "只有一次也没有时“至少一次”才不成立："),
                [`P(X \\ge 1) = 1 - P(X = 0) = 1 - e^{-${lambda}} \\approx ${dec(value)}`],
              ],
            ],
            t(
              `$P(X = 0) = e^{-${lambda}} \\approx ${dec(none0)}$, and $${dec(none0)} + ${dec(value)} = 1$.`,
              `$P(X = 0) = e^{-${lambda}} \\approx ${dec(none0)}$，而 $${dec(none0)} + ${dec(value)} = 1$。`,
            ),
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
  intro: t(
    "Let $X \\sim \\operatorname{Po}(2.5)$, so $E(X) = \\operatorname{Var}(X) = 2.5$. Then $E(X^2) = \\operatorname{Var}(X) + E(X)^2 = 2.5 + 6.25 = 8.75$ and $\\operatorname{Var}(2X + 3) = 2^2 \\cdot 2.5 = 10$. If instead $\\lambda$ is unknown but $P(X = 4) = P(X = 3)$, the ratio of the two is $\\frac{\\lambda}{4} = 1$, so $\\lambda = 4$ and the variance is $4$.\n\nCheck: the factorial moment of a Poisson variable is $E(X(X - 1)) = \\lambda^2 = 6.25$, so $E(X^2) = 6.25 + 2.5 = 8.75$ again; and with $\\lambda = 4$, $e^{-4}\\frac{4^4}{4!} = e^{-4}\\frac{4^3}{3!}$ because $\\frac{4}{4} = 1$.\n\nIn this lesson we use $E(X) = \\operatorname{Var}(X) = \\lambda$ to find other moments of a Poisson variable, and we recover $\\lambda$ from a ratio of two consecutive probabilities.",
    "设 $X \\sim \\operatorname{Po}(2.5)$，所以 $E(X) = \\operatorname{Var}(X) = 2.5$。于是 $E(X^2) = \\operatorname{Var}(X) + E(X)^2 = 2.5 + 6.25 = 8.75$，$\\operatorname{Var}(2X + 3) = 2^2 \\cdot 2.5 = 10$。若 $\\lambda$ 未知但 $P(X = 4) = P(X = 3)$，两者之比为 $\\frac{\\lambda}{4} = 1$，所以 $\\lambda = 4$，方差为 $4$。\n\n检验：泊松变量的阶乘矩为 $E(X(X - 1)) = \\lambda^2 = 6.25$，所以 $E(X^2) = 6.25 + 2.5 = 8.75$，结果相同；取 $\\lambda = 4$，由于 $\\frac{4}{4} = 1$，$e^{-4}\\frac{4^4}{4!} = e^{-4}\\frac{4^3}{3!}$。\n\n本课我们用 $E(X) = \\operatorname{Var}(X) = \\lambda$ 求泊松变量的其他矩，并由两个相邻概率之比求出 $\\lambda$。",
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
        "The mean and the variance of a Poisson variable are both equal to the rate, which makes its other moments easy to compute. For $X \\sim \\operatorname{Po}(3)$: $E(X) = \\operatorname{Var}(X) = 3$, so $E(X^2) = 3 + 9 = 12$ and $\\operatorname{Var}(2X + 1) = 4 \\cdot 3 = 12$.\n\n> **Watch out.** $E(X^2)$ is not $\\lambda^2$; the variance $\\lambda$ has to be added. For $X \\sim \\operatorname{Po}(4)$: $E(X^2) = 4 + 16 = 20$, not $16$.",
        "泊松变量的均值和方差都等于速率，这使它的其他矩都很容易计算。对 $X \\sim \\operatorname{Po}(3)$：$E(X) = \\operatorname{Var}(X) = 3$，所以 $E(X^2) = 3 + 9 = 12$，$\\operatorname{Var}(2X + 1) = 4 \\cdot 3 = 12$。\n\n> **注意。** $E(X^2)$ 不是 $\\lambda^2$；还要加上方差 $\\lambda$。对 $X \\sim \\operatorname{Po}(4)$：$E(X^2) = 4 + 16 = 20$，而不是 $16$。",
      ),
      generate(rng) {
        const lambda = Q.of(rng.int(1, 40), rng.pick([1, 2, 10]));
        const a = rng.int(2, 5);
        const b = rng.int(1, 9);
        const second = rng.bool();
        const value = second ? lambda.add(lambda.pow(2)) : lambda.mul(Q.of(a * a));
        const l = qt(lambda);
        const sq = Q.of(a * a)
          .mul(lambda.add(lambda.pow(2)))
          .add(Q.of(2 * a * b).mul(lambda))
          .add(Q.of(b * b));
        const mean = Q.of(a).mul(lambda).add(Q.of(b));
        return numberProblem({
          prompt: second
            ? t(`$X \\sim \\operatorname{Po}(${l})$. Find $E(X^2)$.`, `$X \\sim \\operatorname{Po}(${l})$。求 $E(X^2)$。`)
            : t(
                `$X \\sim \\operatorname{Po}(${l})$. Find $\\operatorname{Var}(${a}X + ${b})$.`,
                `$X \\sim \\operatorname{Po}(${l})$。求 $\\operatorname{Var}(${a}X + ${b})$。`,
              ),
          answer: value,
          mistakes: apart(
            value,
            second
              ? [
                  why(
                    lambda.pow(2),
                    "That is $E(X)^2$; add the variance $\\lambda$ to get $E(X^2)$.",
                    "这是 $E(X)^2$；还要加上方差 $\\lambda$ 才得到 $E(X^2)$。",
                  ),
                  why(lambda, "That is $E(X)$, the first moment, not the second.", "这是一阶矩 $E(X)$，而不是二阶矩。"),
                  why(
                    lambda.mul(Q.of(2)),
                    "That adds the mean and the variance; add the variance to the square of the mean.",
                    "这把均值与方差相加；应该把方差加到均值的平方上。",
                  ),
                  why(
                    lambda.pow(2).sub(lambda),
                    "That is $E(X(X - 1)) = \\lambda^2$ minus $\\lambda$; add $\\lambda$ to the factorial moment instead.",
                    "这是 $\\lambda^2$ 减去 $\\lambda$；应该把 $\\lambda$ 加到阶乘矩 $E(X(X - 1)) = \\lambda^2$ 上。",
                  ),
                ]
              : [
                  why(lambda.mul(Q.of(a)), `That multiplies by $${a}$ without squaring it.`, `这乘的是 $${a}$，没有平方。`),
                  why(value.add(Q.of(b)), `That adds $${b}$; a shift does not change the variance.`, `这加上了 $${b}$；平移不改变方差。`),
                  why(
                    lambda.mul(Q.of(a)).add(Q.of(b)),
                    `That is $E(${a}X + ${b})$, the mean, not the variance.`,
                    `这是均值 $E(${a}X + ${b})$，而不是方差。`,
                  ),
                ],
          ),
          solution: second
            ? walked(
                [
                  [
                    ["Use the mean and the variance", "用均值与方差"],
                    t("For a Poisson variable both equal $\\lambda$:", "泊松变量的两者都等于 $\\lambda$："),
                    [`E(X) = \\operatorname{Var}(X) = ${l}`],
                  ],
                  [
                    ["Add the square of the mean", "加上均值的平方"],
                    t("Rearrange $\\operatorname{Var}(X) = E(X^2) - E(X)^2$:", "把 $\\operatorname{Var}(X) = E(X^2) - E(X)^2$ 变形："),
                    [`E(X^2) = ${l} + (${l})^2 = ${qt(value)}`],
                  ],
                ],
                t(
                  `The factorial moment of a Poisson variable is $E(X(X - 1)) = \\lambda^2 = ${qt(lambda.pow(2))}$, and $E(X^2) = E(X(X - 1)) + E(X) = ${qt(lambda.pow(2))} + ${l} = ${qt(value)}$.`,
                  `泊松变量的阶乘矩为 $E(X(X - 1)) = \\lambda^2 = ${qt(lambda.pow(2))}$，而 $E(X^2) = E(X(X - 1)) + E(X) = ${qt(lambda.pow(2))} + ${l} = ${qt(value)}$。`,
                ),
              )
            : walked(
                [
                  [
                    ["Use the variance", "用方差"],
                    t("For a Poisson variable the variance is $\\lambda$:", "泊松变量的方差为 $\\lambda$："),
                    [`\\operatorname{Var}(X) = ${l}`],
                  ],
                  [
                    ["Drop the constant and square the multiplier", "去掉常数并把乘数平方"],
                    t("A shift leaves the spread alone:", "平移不改变离散程度："),
                    [`\\operatorname{Var}(${a}X + ${b}) = ${a}^2 \\cdot ${l} = ${qt(value)}`],
                  ],
                ],
                t(
                  `From $E(X^2) = ${qt(lambda.add(lambda.pow(2)))}$: $E((${a}X + ${b})^2) = ${a * a} \\cdot ${qt(lambda.add(lambda.pow(2)))} + ${2 * a * b} \\cdot ${l} + ${b * b} = ${qt(sq)}$ and $E(${a}X + ${b}) = ${qt(mean)}$, so the variance is $${qt(sq)} - (${qt(mean)})^2 = ${qt(value)}$.`,
                  `由 $E(X^2) = ${qt(lambda.add(lambda.pow(2)))}$：$E((${a}X + ${b})^2) = ${a * a} \\cdot ${qt(lambda.add(lambda.pow(2)))} + ${2 * a * b} \\cdot ${l} + ${b * b} = ${qt(sq)}$，$E(${a}X + ${b}) = ${qt(mean)}$，所以方差为 $${qt(sq)} - (${qt(mean)})^2 = ${qt(value)}$。`,
                ),
              ),
        });
      },
    },
    {
      id: "poisson-mean-from-a-ratio",
      title: t("The mean from a ratio of probabilities", "由概率之比求均值"),
      explanation: t(
        "Writing out both probabilities and dividing cancels the exponential factor, leaving a simple equation for the rate. If $P(X = 2) = P(X = 3)$ for $X \\sim \\operatorname{Po}(\\lambda)$, then $e^{-\\lambda}\\frac{\\lambda^2}{2} = e^{-\\lambda}\\frac{\\lambda^3}{6}$, so $\\lambda = 3$, which is also the variance.\n\n> **Watch out.** The ratio $\\frac{P(X = k + 1)}{P(X = k)}$ is $\\frac{\\lambda}{k + 1}$, not $\\frac{\\lambda}{k}$. If $P(X = 3) = 2P(X = 2)$, then $\\frac{\\lambda}{3} = 2$ and $\\lambda = 6$, not $4$.",
        "把两个概率都写出来再相除，指数因子被约去，只剩下一个关于速率的简单方程。若 $X \\sim \\operatorname{Po}(\\lambda)$ 满足 $P(X = 2) = P(X = 3)$，则 $e^{-\\lambda}\\frac{\\lambda^2}{2} = e^{-\\lambda}\\frac{\\lambda^3}{6}$，所以 $\\lambda = 3$，这也是方差。\n\n> **注意。** 比值 $\\frac{P(X = k + 1)}{P(X = k)}$ 是 $\\frac{\\lambda}{k + 1}$，而不是 $\\frac{\\lambda}{k}$。若 $P(X = 3) = 2P(X = 2)$，则 $\\frac{\\lambda}{3} = 2$，$\\lambda = 6$，而不是 $4$。",
      ),
      generate(rng) {
        const k = rng.int(0, 4);
        let c: Q;
        do c = Q.of(rng.int(1, 6), rng.pick([1, 2, 3]));
        while (k === 0 && c.eq(Q.of(1)));
        const value = c.mul(Q.of(k + 1));
        const cText = c.eq(Q.of(1)) ? "" : `${c.toLatex()} \\, `;
        const ratioTex = k === 0 ? "\\lambda" : `\\frac{\\lambda}{${k + 1}}`;
        return numberProblem({
          prompt: t(
            `$X \\sim \\operatorname{Po}(\\lambda)$ and $P(X = ${k + 1}) = ${cText}P(X = ${k})$. Find $\\operatorname{Var}(X)$.`,
            `$X \\sim \\operatorname{Po}(\\lambda)$，且 $P(X = ${k + 1}) = ${cText}P(X = ${k})$。求 $\\operatorname{Var}(X)$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              c,
              `That takes the ratio itself as $\\lambda$; the ratio is $${ratioTex}$.`,
              `这把比值本身当作 $\\lambda$；比值是 $${ratioTex}$。`,
            ),
            why(
              c.mul(Q.of(k + 2)),
              `That multiplies by $${k + 2}$; the ratio of these two probabilities is $${ratioTex}$.`,
              `这乘的是 $${k + 2}$；这两个概率之比是 $${ratioTex}$。`,
            ),
            why(
              value.pow(2),
              "That squares $\\lambda$; the variance of a Poisson variable equals $\\lambda$.",
              "这把 $\\lambda$ 平方了；泊松变量的方差等于 $\\lambda$。",
            ),
            why(
              c.mul(Q.of(Math.max(k, 1))),
              `That divides by $k$ instead of $k + 1$ in the ratio.`,
              `这在比值中除以了 $k$，而不是 $k + 1$。`,
            ),
            why(
              Q.of(k + 1).div(c),
              `That turns the ratio upside down; $P(X = ${k + 1})$ is on top, so $${ratioTex} = ${c.toLatex()}$.`,
              `这把比值颠倒了；$P(X = ${k + 1})$ 在分子上，所以 $${ratioTex} = ${c.toLatex()}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Divide the probabilities", "把两个概率相除"],
                t(
                  "The factor $e^{-\\lambda}$ cancels, and so do all but one factor of $\\lambda$ and of the factorial:",
                  "因子 $e^{-\\lambda}$ 约去，$\\lambda$ 的幂和阶乘也只剩一个因子：",
                ),
                [`\\frac{P(X = ${k + 1})}{P(X = ${k})} = ${ratioTex} = ${c.toLatex()}`],
              ],
              [
                ["Solve for the mean", "解出均值"],
                t("The variance of a Poisson variable equals $\\lambda$:", "泊松变量的方差等于 $\\lambda$："),
                [
                  k === 0 ? `\\operatorname{Var}(X) = \\lambda = ${qt(value)}` : `\\lambda = ${k + 1} \\cdot ${c.toLatex()} = ${qt(value)}`,
                  ...(k === 0 ? [] : [`\\operatorname{Var}(X) = \\lambda = ${qt(value)}`]),
                ],
              ],
            ],
            k === 0
              ? t(
                  `With $\\lambda = ${qt(value)}$, $P(X = 1) = \\lambda e^{-\\lambda}$ is $\\lambda$ times $P(X = 0) = e^{-\\lambda}$, which is the ratio given.`,
                  `取 $\\lambda = ${qt(value)}$，$P(X = 1) = \\lambda e^{-\\lambda}$ 是 $P(X = 0) = e^{-\\lambda}$ 的 $\\lambda$ 倍，正是所给的比值。`,
                )
              : t(
                  `With $\\lambda = ${qt(value)}$, $\\frac{\\lambda}{${k + 1}} = \\frac{${qt(value)}}{${k + 1}} = ${c.toLatex()}$, the ratio given.`,
                  `取 $\\lambda = ${qt(value)}$，$\\frac{\\lambda}{${k + 1}} = \\frac{${qt(value)}}{${k + 1}} = ${c.toLatex()}$，正是所给的比值。`,
                ),
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
  intro: t(
    "Each of $1000$ items is defective with probability $0.003$, independently, so the number of defective items is $X \\sim B(1000, 0.003)$. With many trials and a small $p$, use $\\operatorname{Po}(\\lambda)$ with $\\lambda = np = 1000 \\cdot 0.003 = 3$. Then $P(X = 2) \\approx e^{-3}\\frac{3^2}{2!} = 4.5e^{-3} \\approx 0.2240$.\n\nCheck: the exact binomial value $\\binom{1000}{2}(0.003)^2(0.997)^{998} \\approx 0.2242$ differs from the approximation only in the fourth decimal place, and the binomial variance $np(1 - p) = 2.991$ is close to the Poisson variance $3$.\n\nIn this lesson we choose the Poisson mean $\\lambda = np$ that approximates a binomial distribution with many trials and a small success probability, and we use it to approximate binomial probabilities.",
    "$1000$ 件产品中每件独立地以 $0.003$ 的概率为次品，所以次品数 $X \\sim B(1000, 0.003)$。试验次数多而 $p$ 很小，用 $\\operatorname{Po}(\\lambda)$ 近似，$\\lambda = np = 1000 \\cdot 0.003 = 3$。于是 $P(X = 2) \\approx e^{-3}\\frac{3^2}{2!} = 4.5e^{-3} \\approx 0.2240$。\n\n检验：精确的二项概率 $\\binom{1000}{2}(0.003)^2(0.997)^{998} \\approx 0.2242$，与近似值只在第四位小数上不同；二项方差 $np(1 - p) = 2.991$ 也接近泊松方差 $3$。\n\n本课我们为试验次数多、成功概率小的二项分布选取近似的泊松均值 $\\lambda = np$，并用它近似计算二项概率。",
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
        "When there are many trials with a small success probability, a Poisson distribution with the same mean approximates the binomial well. For $X \\sim B(500, 0.004)$, use $\\operatorname{Po}(500 \\cdot 0.004) = \\operatorname{Po}(2)$.\n\n> **Watch out.** Match the mean $np$, not the variance $np(1 - p)$. For $X \\sim B(400, 0.005)$: $\\lambda = 400 \\cdot 0.005 = 2$, not $2 \\cdot 0.995 = 1.99$.",
        "当试验次数很多而成功概率很小时，均值相同的泊松分布可以很好地近似二项分布。对 $X \\sim B(500, 0.004)$，用 $\\operatorname{Po}(500 \\cdot 0.004) = \\operatorname{Po}(2)$ 近似。\n\n> **注意。** 要匹配均值 $np$，而不是方差 $np(1 - p)$。对 $X \\sim B(400, 0.005)$：$\\lambda = 400 \\cdot 0.005 = 2$，而不是 $2 \\cdot 0.995 = 1.99$。",
      ),
      generate(rng) {
        const n = rng.pick([200, 250, 400, 500, 800, 1000, 2000]);
        const lambda = rng.pick([0.5, 1, 1.5, 2, 2.4, 3, 4, 5]);
        const p = Q.of(Math.round(lambda * 10), n * 10);
        const value = Q.of(Math.round(lambda * 10), 10);
        const v = value.mul(Q.of(1).sub(p));
        return numberProblem({
          prompt: t(
            `$X \\sim B(${n}, ${dec(p)})$ is approximated by $\\operatorname{Po}(\\lambda)$. Find $\\lambda$.`,
            `用 $\\operatorname{Po}(\\lambda)$ 近似 $X \\sim B(${n}, ${dec(p)})$。求 $\\lambda$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              v,
              "That is the binomial variance $np(1 - p)$; the Poisson mean matches the binomial mean $np$.",
              "这是二项方差 $np(1 - p)$；泊松均值要与二项均值 $np$ 相等。",
            ),
            why(Q.of(n), "That is the number of trials; multiply it by the success probability.", "这是试验次数；还要乘以成功概率。"),
            why(value.mul(Q.of(10)), "That misplaces the decimal point in the success probability.", "这把成功概率的小数点位置弄错了。"),
          ]),
          solution: walked(
            [
              [
                ["Match the means", "使均值相等"],
                t("The approximating Poisson distribution has the binomial mean:", "近似的泊松分布与二项分布均值相同："),
                [`\\lambda = np = ${n} \\cdot ${dec(p)} = ${qt(value)}`],
              ],
            ],
            t(
              `The binomial variance is $np(1 - p) = ${qt(value)} \\cdot ${dec(Q.of(1).sub(p))} = ${dec(v)}$, close to $${qt(value)}$, as it must be for a Poisson approximation, whose mean and variance are equal.`,
              `二项方差为 $np(1 - p) = ${qt(value)} \\cdot ${dec(Q.of(1).sub(p))} = ${dec(v)}$，接近 $${qt(value)}$；泊松近似的均值与方差相等，理应如此。`,
            ),
          ),
        });
      },
    },
    {
      id: "approximating-binomial-probabilities",
      title: t("Approximating probabilities", "近似计算概率"),
      explanation: t(
        "With many trials and a small success probability, the count of successes is close to a Poisson variable with $\\lambda = np$, whose formula is far easier to evaluate than the binomial one. A batch of $1000$ items each has defect probability $0.002$. With $\\lambda = 2$, $P(X = 1) \\approx 2e^{-2} \\approx 0.2707$; the exact binomial value $0.2709$ is very close.\n\n> **Watch out.** The Poisson formula still divides by $k!$. With $\\lambda = 3$: $P(X = 2) \\approx e^{-3}\\frac{3^2}{2!} \\approx 0.2240$, not $9e^{-3} \\approx 0.4481$.",
        "试验次数多而成功概率小时，成功次数接近 $\\lambda = np$ 的泊松变量，而泊松公式比二项公式容易计算得多。一批 $1000$ 件产品，每件次品概率为 $0.002$。取 $\\lambda = 2$，$P(X = 1) \\approx 2e^{-2} \\approx 0.2707$；精确的二项概率 $0.2709$ 与之非常接近。\n\n> **注意。** 泊松公式仍要除以 $k!$。取 $\\lambda = 3$：$P(X = 2) \\approx e^{-3}\\frac{3^2}{2!} \\approx 0.2240$，而不是 $9e^{-3} \\approx 0.4481$。",
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
        const exact = `${k === 0 ? "" : `\\binom{${n}}{${k}}${pw(`(${dec(p)})`, k)}`}(${dec(Q.of(1).sub(p))})^{${n - k}}`;
        return numberProblem({
          prompt: t(
            `Each of $${n}$ items is defective with probability $${dec(p)}$, independently. Use a Poisson approximation to find the probability that exactly $${k}$ are defective.${FOUR.en}`,
            `$${n}$ 件产品中每件独立地以 $${dec(p)}$ 的概率为次品。用泊松近似求恰有 $${k}$ 件次品的概率。${FOUR["zh-CN"]}`,
          ),
          answer: value,
          form: "decimal",
          mistakes: apart(value, [
            why(
              r4(poissonCdf(lambda, k)),
              `That is $P(X \\le ${k})$; the question asks for exactly $${k}$.`,
              `这是 $P(X \\le ${k})$；题目问的是恰好 $${k}$ 件。`,
            ),
            why(r4(poissonP(lambda, k + 1)), `That is $P(X = ${k + 1})$, one count too many.`, `这是 $P(X = ${k + 1})$，多了一件。`),
            why(Q.of(1).sub(value), `That is $P(X \\ne ${k})$, the complement.`, `这是补事件的概率 $P(X \\ne ${k})$。`),
            why(r4(lambda ** k / fact(k)), "That leaves out the factor $e^{-\\lambda}$.", "这漏掉了因子 $e^{-\\lambda}$。"),
            why(r4(Math.exp(-lambda) * lambda ** k), `That leaves out the division by $${k}!$.`, `这漏掉了除以 $${k}!$。`),
          ]),
          solution: walked(
            [
              [
                ["Find the mean", "求均值"],
                t("Match the binomial mean:", "与二项均值相等："),
                [`\\lambda = np = ${n} \\cdot ${dec(p)} = ${lambda}`],
              ],
              [
                ["Use the Poisson formula", "用泊松公式"],
                t(`Approximate by $\\operatorname{Po}(${lambda})$:`, `用 $\\operatorname{Po}(${lambda})$ 近似：`),
                [`P(X = ${k}) \\approx ${poissonTex(lambda, k)} \\approx ${dec(value)}`],
              ],
            ],
            t(
              `The exact binomial value is $${exact} \\approx ${binomP(n, k, lambda / n).toFixed(4)}$, very close to the approximation.`,
              `精确的二项概率为 $${exact} \\approx ${binomP(n, k, lambda / n).toFixed(4)}$，与近似值非常接近。`,
            ),
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
  intro: t(
    "Let $X \\sim \\operatorname{Geo}(\\frac{1}{5})$ count the trials up to and including the first success. Then $E(X) = \\frac{1}{p} = 5$ and $\\operatorname{Var}(X) = \\frac{1 - p}{p^2} = \\frac{4/5}{1/25} = 20$. Since $p = \\frac{1}{\\mu}$, the variance can also be written in terms of the mean alone: $\\operatorname{Var}(X) = \\mu^2 - \\mu = 25 - 5 = 20$.\n\nCheck: $\\frac{1 - p}{p^2} = \\frac{1}{p^2} - \\frac{1}{p} = \\mu^2 - \\mu$, so the two routes must agree, and they do.\n\nIn this lesson we find the variance $\\frac{1 - p}{p^2}$ of a geometric variable from its success probability, and from its mean through $p = \\frac{1}{\\mu}$.",
    "设 $X \\sim \\operatorname{Geo}(\\frac{1}{5})$ 表示直到第一次成功（含）的试验次数。则 $E(X) = \\frac{1}{p} = 5$，$\\operatorname{Var}(X) = \\frac{1 - p}{p^2} = \\frac{4/5}{1/25} = 20$。由于 $p = \\frac{1}{\\mu}$，方差也可以只用均值表示：$\\operatorname{Var}(X) = \\mu^2 - \\mu = 25 - 5 = 20$。\n\n检验：$\\frac{1 - p}{p^2} = \\frac{1}{p^2} - \\frac{1}{p} = \\mu^2 - \\mu$，所以两种算法必然一致，结果也确实一致。\n\n本课我们由成功概率求几何变量的方差 $\\frac{1 - p}{p^2}$，也通过 $p = \\frac{1}{\\mu}$ 由均值求方差。",
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
        "The waiting time for the first success varies more when success is rare, so the variance grows quickly as the success probability shrinks. For $X \\sim \\operatorname{Geo}(\\frac{1}{4})$: $\\operatorname{Var}(X) = \\frac{3/4}{1/16} = 12$.\n\n> **Watch out.** Divide by $p^2$, not by $p$. For $X \\sim \\operatorname{Geo}(\\frac{1}{4})$: $\\operatorname{Var}(X) = \\frac{3/4}{1/16} = 12$, not $\\frac{3/4}{1/4} = 3$.",
        "成功越罕见，首次成功的等待时间波动越大，所以随着成功概率减小，方差增长得很快。对 $X \\sim \\operatorname{Geo}(\\frac{1}{4})$：$\\operatorname{Var}(X) = \\frac{3/4}{1/16} = 12$。\n\n> **注意。** 要除以 $p^2$，而不是 $p$。对 $X \\sim \\operatorname{Geo}(\\frac{1}{4})$：$\\operatorname{Var}(X) = \\frac{3/4}{1/16} = 12$，而不是 $\\frac{3/4}{1/4} = 3$。",
      ),
      generate(rng) {
        const p = Q.of(rng.int(1, 4), rng.int(5, 12));
        const q = Q.of(1).sub(p);
        const value = q.div(p.pow(2));
        const mu = Q.of(1).div(p);
        return numberProblem({
          prompt: t(
            `$X \\sim \\operatorname{Geo}(${qt(p)})$. Find $\\operatorname{Var}(X)$.`,
            `$X \\sim \\operatorname{Geo}(${qt(p)})$。求 $\\operatorname{Var}(X)$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(mu, "That is $\\frac{1}{p} = E(X)$, the mean, not the variance.", "这是均值 $\\frac{1}{p} = E(X)$，而不是方差。"),
            why(q.div(p), "That divides by $p$; the variance divides $1 - p$ by $p^2$.", "这除以的是 $p$；方差是 $1 - p$ 除以 $p^2$。"),
            why(
              Q.of(1).div(p.pow(2)),
              "That is $\\frac{1}{p^2} = E(X)^2$; subtract the mean $\\frac{1}{p}$.",
              "这是 $\\frac{1}{p^2} = E(X)^2$；还要减去均值 $\\frac{1}{p}$。",
            ),
          ]),
          solution: walked(
            [
              [["Find the failure probability", "求失败概率"], t("The probability of failure is", "失败的概率为"), [`1 - p = ${qt(q)}`]],
              [
                ["Use the formula", "用公式"],
                t("Divide by the square of $p$:", "除以 $p$ 的平方："),
                [`\\operatorname{Var}(X) = \\frac{1 - p}{p^2} = \\frac{${qt(q)}}{(${qt(p)})^2} = ${qt(value)}`],
              ],
            ],
            t(
              `The mean is $\\mu = \\frac{1}{p} = ${qt(mu)}$, and $\\mu^2 - \\mu = ${qt(mu.pow(2))} - ${qt(mu)} = ${qt(value)}$.`,
              `均值为 $\\mu = \\frac{1}{p} = ${qt(mu)}$，而 $\\mu^2 - \\mu = ${qt(mu.pow(2))} - ${qt(mu)} = ${qt(value)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "geometric-variance-from-the-mean",
      title: t("The variance from the mean", "由均值求方差"),
      explanation: t(
        "The mean of a geometric variable is the reciprocal of the success probability, so the mean determines the parameter and hence the variance. If $E(X) = 5$, then $p = \\frac{1}{5}$ and $\\operatorname{Var}(X) = \\frac{4/5}{1/25} = 20$. In general $\\operatorname{Var}(X) = \\mu^2 - \\mu$.\n\n> **Watch out.** The variance is $\\mu^2 - \\mu$, not $\\mu^2$ and not $\\mu$. If $E(X) = 4$, then $\\operatorname{Var}(X) = 16 - 4 = 12$, not $16$.",
        "几何变量的均值是成功概率的倒数，所以均值确定了参数，从而也确定了方差。若 $E(X) = 5$，则 $p = \\frac{1}{5}$，$\\operatorname{Var}(X) = \\frac{4/5}{1/25} = 20$。一般地，$\\operatorname{Var}(X) = \\mu^2 - \\mu$。\n\n> **注意。** 方差是 $\\mu^2 - \\mu$，既不是 $\\mu^2$，也不是 $\\mu$。若 $E(X) = 4$，则 $\\operatorname{Var}(X) = 16 - 4 = 12$，而不是 $16$。",
      ),
      generate(rng) {
        const mu = Q.of(rng.int(3, 30), rng.pick([1, 1, 2]));
        const value = mu.pow(2).sub(mu);
        const p = Q.of(1).div(mu);
        const q = Q.of(1).sub(p);
        return numberProblem({
          prompt: t(
            `$X$ has a geometric distribution with $E(X) = ${qt(mu)}$. Find $\\operatorname{Var}(X)$.`,
            `$X$ 服从几何分布，$E(X) = ${qt(mu)}$。求 $\\operatorname{Var}(X)$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              mu.pow(2),
              "That is $\\mu^2 = \\frac{1}{p^2}$; subtract the mean $\\mu$.",
              "这是 $\\mu^2 = \\frac{1}{p^2}$；还要减去均值 $\\mu$。",
            ),
            why(
              mu,
              "That takes the variance equal to the mean, which holds for a Poisson variable, not a geometric one.",
              "这把方差当作等于均值，那是泊松变量的性质，不是几何变量的。",
            ),
            why(
              mu.pow(2).add(mu),
              "That adds the mean; $\\frac{1 - p}{p^2} = \\frac{1}{p^2} - \\frac{1}{p}$ subtracts it.",
              "这加上了均值；$\\frac{1 - p}{p^2} = \\frac{1}{p^2} - \\frac{1}{p}$ 是减去它。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the parameter", "求参数"],
                t("The mean of a geometric variable is $\\frac{1}{p}$:", "几何变量的均值为 $\\frac{1}{p}$："),
                [`p = \\frac{1}{${qt(mu)}} = ${qt(p)}`],
              ],
              [
                ["Write the variance through the mean", "用均值表示方差"],
                t("Split the fraction:", "把分式拆开："),
                [
                  `\\operatorname{Var}(X) = \\frac{1 - p}{p^2} = \\frac{1}{p^2} - \\frac{1}{p} = \\mu^2 - \\mu`,
                  `= ${qt(mu.pow(2))} - ${qt(mu)} = ${qt(value)}`,
                ],
              ],
            ],
            t(
              `Directly from $p$: $\\frac{1 - p}{p^2} = \\frac{${qt(q)}}{(${qt(p)})^2} = ${qt(value)}$.`,
              `直接用 $p$ 计算：$\\frac{1 - p}{p^2} = \\frac{${qt(q)}}{(${qt(p)})^2} = ${qt(value)}$。`,
            ),
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
  intro: t(
    "Independent trials each succeed with probability $\\frac{1}{3}$, and $X$ is the number of trials needed for the $2$nd success. The $2$nd success falls on trial $4$ when trial $4$ succeeds and the first $3$ trials hold exactly $1$ success, so $P(X = 4) = \\binom{3}{1}\\left(\\frac{1}{3}\\right)^2\\left(\\frac{2}{3}\\right)^2 = 3 \\cdot \\frac{4}{81} = \\frac{4}{27}$. On average $E(X) = \\frac{2}{1/3} = 6$ trials are needed, with $\\operatorname{Var}(X) = \\frac{2 \\cdot 2/3}{1/9} = 12$.\n\nCheck: the possible sequences are $SFFS$, $FSFS$ and $FFSS$, each with probability $\\left(\\frac{1}{3}\\right)^2\\left(\\frac{2}{3}\\right)^2 = \\frac{4}{81}$, and $3 \\cdot \\frac{4}{81} = \\frac{4}{27}$; and two geometric waits of mean $3$ and variance $6$ give mean $6$ and variance $12$.\n\nIn this lesson we find the probability that the $r$th success falls on a given trial, and the mean and variance of the number of trials, as $r$ geometric waits in a row.",
    "独立试验每次成功的概率为 $\\frac{1}{3}$，$X$ 表示得到第 $2$ 次成功所需的试验次数。第 $2$ 次成功恰在第 $4$ 次试验，当且仅当第 $4$ 次成功且前 $3$ 次恰有 $1$ 次成功，所以 $P(X = 4) = \\binom{3}{1}\\left(\\frac{1}{3}\\right)^2\\left(\\frac{2}{3}\\right)^2 = 3 \\cdot \\frac{4}{81} = \\frac{4}{27}$。平均需要 $E(X) = \\frac{2}{1/3} = 6$ 次试验，$\\operatorname{Var}(X) = \\frac{2 \\cdot 2/3}{1/9} = 12$。\n\n检验：可能的序列为 $SFFS$、$FSFS$ 和 $FFSS$，每个的概率都是 $\\left(\\frac{1}{3}\\right)^2\\left(\\frac{2}{3}\\right)^2 = \\frac{4}{81}$，而 $3 \\cdot \\frac{4}{81} = \\frac{4}{27}$；两次均值为 $3$、方差为 $6$ 的几何等待给出均值 $6$、方差 $12$。\n\n本课我们求第 $r$ 次成功恰好落在某次试验上的概率，并把试验次数看作连续 $r$ 次几何等待，求它的均值与方差。",
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
        "The $r$th success falls on trial $k$ exactly when trial $k$ succeeds and the first $k - 1$ trials hold $r - 1$ successes in some order. The $3$rd success on trial $5$ with $p = \\frac{1}{2}$: trial $5$ succeeds and the first $4$ hold exactly $2$ successes, so $P(X = 5) = \\binom{4}{2} \\left(\\frac{1}{2}\\right)^3 \\left(\\frac{1}{2}\\right)^2 = \\frac{6}{32} = \\frac{3}{16}$.\n\n> **Watch out.** Only the first $k - 1$ trials are free to arrange; the last one must be a success. With $p = \\frac{1}{2}$, the $2$nd success on trial $4$ has probability $\\binom{3}{1}\\frac{1}{16} = \\frac{3}{16}$, not $\\binom{4}{2}\\frac{1}{16} = \\frac{6}{16}$.",
        "第 $r$ 次成功恰在第 $k$ 次试验，当且仅当第 $k$ 次成功且前 $k - 1$ 次以某种顺序含有 $r - 1$ 次成功。$p = \\frac{1}{2}$ 时第 $3$ 次成功恰在第 $5$ 次试验：第 $5$ 次成功且前 $4$ 次恰有 $2$ 次成功，所以 $P(X = 5) = \\binom{4}{2} \\left(\\frac{1}{2}\\right)^3 \\left(\\frac{1}{2}\\right)^2 = \\frac{6}{32} = \\frac{3}{16}$。\n\n> **注意。** 只有前 $k - 1$ 次可以自由排列；最后一次必须成功。$p = \\frac{1}{2}$ 时，第 $2$ 次成功恰在第 $4$ 次的概率为 $\\binom{3}{1}\\frac{1}{16} = \\frac{3}{16}$，而不是 $\\binom{4}{2}\\frac{1}{16} = \\frac{6}{16}$。",
      ),
      generate(rng) {
        const p = rng.pick(PS.slice(0, 9));
        const r = rng.int(2, 4);
        const k = r + rng.int(1, 4);
        const value = negBinP(r, k, p);
        const q = Q.of(1).sub(p);
        const each = p.pow(r).mul(q.pow(k - r));
        const before = Q.of(choose(k - 1, r - 1))
          .mul(p.pow(r - 1))
          .mul(q.pow(k - r));
        return numberProblem({
          prompt: t(
            `Independent trials each succeed with probability $${p.toLatex()}$. $X$ is the number of trials needed for the ${ordinal(r)} success. Find $P(X = ${k})$.`,
            `独立试验每次成功的概率为 $${p.toLatex()}$。$X$ 表示得到第 $${r}$ 次成功所需的试验次数。求 $P(X = ${k})$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              Q.of(choose(k, r)).mul(each),
              `That arranges the successes among all $${k}$ trials; the last trial must be the ${ordinal(r)} success, so only the first $${k - 1}$ are free.`,
              `这在全部 $${k}$ 次试验中排列成功；最后一次必须是第 $${r}$ 次成功，所以只有前 $${k - 1}$ 次可以自由排列。`,
            ),
            why(
              each,
              "That is the probability of one sequence; count the orders of the earlier successes too.",
              "这是一个序列的概率；还要数出前面几次成功的排列方式。",
            ),
            why(
              Q.of(choose(k - 1, r)).mul(each),
              `That places $${r}$ successes among the first $${k - 1}$ trials; only $${r - 1}$ come before the last one.`,
              `这在前 $${k - 1}$ 次中放了 $${r}$ 次成功；最后一次之前只有 $${r - 1}$ 次。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Count the orders", "数出排列方式"],
                t(
                  `Trial $${k}$ is a success and the other ${r === 2 ? "success is" : `$${r - 1}$ successes are`} among the first $${k - 1}$ trials:`,
                  `第 $${k}$ 次成功，其余 $${r - 1}$ 次成功位于前 $${k - 1}$ 次中：`,
                ),
                [`\\binom{${k - 1}}{${r - 1}} = ${choose(k - 1, r - 1)}`],
              ],
              [
                ["Multiply by one sequence", "乘以一个序列的概率"],
                t(`Each order has $${r}$ successes and $${k - r}$ failures:`, `每种顺序都有 $${r}$ 次成功和 $${k - r}$ 次失败：`),
                [`P(X = ${k}) = ${choose(k - 1, r - 1)} ${bp(p.toLatex(), r)} ${bp(q.toLatex(), k - r)} = ${value.toLatex()}`],
              ],
            ],
            t(
              `The probability of exactly $${r - 1}$ successes in the first $${k - 1}$ trials is $${before.toLatex()}$, and multiplying by $${p.toLatex()}$ for the success on trial $${k}$ gives $${value.toLatex()}$.`,
              `前 $${k - 1}$ 次中恰有 $${r - 1}$ 次成功的概率为 $${before.toLatex()}$，再乘以第 $${k}$ 次成功的概率 $${p.toLatex()}$，得 $${value.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "mean-and-variance-of-the-negative-binomial-distribution",
      title: t("Mean and variance", "均值与方差"),
      explanation: t(
        "Waiting for several successes is a sum of independent geometric waits, so both the mean and the variance are that many times those of one wait. Waiting for $r$ successes is $r$ geometric waits in a row, so $E(X) = \\frac{r}{p}$ and $\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2}$. For $r = 3$, $p = \\frac{1}{4}$: $E(X) = 12$ and $\\operatorname{Var}(X) = 36$.\n\n> **Watch out.** The variance divides by $p^2$. For $r = 2$, $p = \\frac{1}{2}$: $\\operatorname{Var}(X) = \\frac{2 \\cdot 1/2}{1/4} = 4$, not $\\frac{2 \\cdot 1/2}{1/2} = 2$.",
        "等待若干次成功是若干次独立几何等待之和，所以均值和方差都是一次等待的相应倍数。等待 $r$ 次成功相当于连续 $r$ 次几何等待，所以 $E(X) = \\frac{r}{p}$，$\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2}$。$r = 3$，$p = \\frac{1}{4}$ 时：$E(X) = 12$，$\\operatorname{Var}(X) = 36$。\n\n> **注意。** 方差要除以 $p^2$。$r = 2$，$p = \\frac{1}{2}$ 时：$\\operatorname{Var}(X) = \\frac{2 \\cdot 1/2}{1/4} = 4$，而不是 $\\frac{2 \\cdot 1/2}{1/2} = 2$。",
      ),
      generate(rng) {
        const p = rng.pick(PS);
        const r = rng.int(2, 8);
        const askVar = rng.bool();
        const q = Q.of(1).sub(p);
        const mean = Q.of(r).div(p);
        const v = Q.of(r).mul(q).div(p.pow(2));
        const value = askVar ? v : mean;
        return numberProblem({
          prompt: t(
            `Independent trials each succeed with probability $${qt(p)}$. $X$ is the number of trials needed for $${r}$ successes. Find $${askVar ? "\\operatorname{Var}(X)" : "E(X)"}$.`,
            `独立试验每次成功的概率为 $${qt(p)}$。$X$ 表示得到 $${r}$ 次成功所需的试验次数。求 $${askVar ? "\\operatorname{Var}(X)" : "E(X)"}$。`,
          ),
          answer: value,
          mistakes: apart(
            value,
            askVar
              ? [
                  why(
                    Q.of(r).mul(q).div(p),
                    "That divides by $p$; the variance divides $r(1 - p)$ by $p^2$.",
                    "这除以的是 $p$；方差是 $r(1 - p)$ 除以 $p^2$。",
                  ),
                  why(mean, "That is the mean $\\frac{r}{p}$, not the variance.", "这是均值 $\\frac{r}{p}$，而不是方差。"),
                  why(
                    v.div(Q.of(r)),
                    `That is the variance of one geometric wait; there are $${r}$ independent waits.`,
                    `这是一次几何等待的方差；共有 $${r}$ 次独立的等待。`,
                  ),
                ]
              : [
                  why(
                    Q.of(r).mul(p),
                    "That multiplies by $p$; each success takes $\\frac{1}{p}$ trials on average.",
                    "这乘的是 $p$；每次成功平均需要 $\\frac{1}{p}$ 次试验。",
                  ),
                  why(
                    Q.of(1).div(p),
                    `That is the mean wait for one success; there are $${r}$.`,
                    `这是一次成功的平均等待；共有 $${r}$ 次。`,
                  ),
                  why(
                    Q.of(r).div(q),
                    "That divides by the failure probability instead of the success probability.",
                    "这除以的是失败概率，而不是成功概率。",
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Split into geometric waits", "拆成几何等待"],
                t(
                  `The trials needed for $${r}$ successes are $${r}$ independent waits, each $\\operatorname{Geo}(${qt(p)})$:`,
                  `得到 $${r}$ 次成功所需的试验是 $${r}$ 次独立的等待，每次服从 $\\operatorname{Geo}(${qt(p)})$：`,
                ),
                [askVar ? `\\operatorname{Var}(X) = ${r} \\cdot \\frac{1 - p}{p^2}` : `E(X) = ${r} \\cdot \\frac{1}{p}`],
              ],
              [
                ["Substitute", "代入"],
                t(`Put in $p = ${qt(p)}$:`, `代入 $p = ${qt(p)}$：`),
                [askVar ? `= \\frac{${r} \\cdot ${qt(q)}}{(${qt(p)})^2} = ${qt(v)}` : `= \\frac{${r}}{${qt(p)}} = ${qt(mean)}`],
              ],
            ],
            askVar
              ? t(
                  `The ratio of the variance to the mean should be $\\frac{1 - p}{p}$: $\\frac{${qt(v)}}{${qt(mean)}} = ${qt(v.div(mean))} = \\frac{${qt(q)}}{${qt(p)}}$.`,
                  `方差与均值之比应为 $\\frac{1 - p}{p}$：$\\frac{${qt(v)}}{${qt(mean)}} = ${qt(v.div(mean))} = \\frac{${qt(q)}}{${qt(p)}}$。`,
                )
              : t(
                  `Over $${qt(mean)}$ trials the expected number of successes is $${qt(mean)} \\cdot ${qt(p)} = ${r}$, as required.`,
                  `在 $${qt(mean)}$ 次试验中，期望成功次数为 $${qt(mean)} \\cdot ${qt(p)} = ${r}$，符合要求。`,
                ),
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

/** r2 rounds a rational to two decimal places. */
const r2 = (q: Q) => Q.of(Math.round(q.toNumber() * 100), 100);

/** modelingWithTheNegativeBinomialDistribution applies the negative binomial distribution in context. */
export const modelingWithTheNegativeBinomialDistribution: TopicDef = {
  id: "modeling-with-the-negative-binomial-distribution",
  title: t("Modeling With the Negative Binomial Distribution", "用负二项分布建模"),
  summary: t(
    "Repeating independent attempts until a fixed number of successes gives a negative binomial count of attempts.",
    "重复独立尝试直到成功固定次数，所需的尝试次数服从负二项分布。",
  ),
  intro: t(
    "A basketball player makes each free throw with probability $0.8$, independently, and shoots until she has made $3$. The $3$rd basket comes on the $4$th shot when that shot goes in and the first $3$ shots hold exactly $2$ baskets: $\\binom{3}{2}(0.8)^3(0.2) = 3 \\cdot 0.1024 = 0.3072$. On average she needs $\\frac{3}{0.8} = 3.75$ shots, with variance $\\frac{3 \\cdot 0.2}{0.8^2} = 0.9375$.\n\nCheck: the one miss can be the $1$st, $2$nd or $3$rd shot, never the $4$th, and each such sequence has probability $0.8^3 \\cdot 0.2 = 0.1024$; three of them give $0.3072$.\n\nIn this lesson we recognize attempts repeated until a fixed number of successes as a negative binomial count, and find the probability of a given number of attempts and the mean and variance of the number of attempts.",
    "一名篮球运动员每次罚球命中的概率为 $0.8$，相互独立，她一直投到命中 $3$ 次为止。第 $3$ 次命中恰在第 $4$ 投，当且仅当这一投命中且前 $3$ 投恰好命中 $2$ 次：$\\binom{3}{2}(0.8)^3(0.2) = 3 \\cdot 0.1024 = 0.3072$。她平均需要 $\\frac{3}{0.8} = 3.75$ 投，方差为 $\\frac{3 \\cdot 0.2}{0.8^2} = 0.9375$。\n\n检验：唯一一次不中可以是第 $1$、$2$ 或 $3$ 投，但不能是第 $4$ 投，每个这样的序列概率为 $0.8^3 \\cdot 0.2 = 0.1024$；三个序列合计 $0.3072$。\n\n本课我们把重复尝试直到成功固定次数识别为负二项计数，求恰好需要若干次尝试的概率，以及尝试次数的均值与方差。",
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
        "Free throws succeed with probability $0.7$. The $2$nd success comes on the $4$th shot with probability $\\binom{3}{1}(0.7)^2(0.3)^2 = 0.1323$.\n\n> **Watch out.** The last attempt must be a success, so this is not the binomial probability of $r$ successes in $k$ attempts. Closing $2$ sales on the $3$rd call at $p = 0.5$ has probability $\\binom{2}{1}(0.5)^2(0.5) = 0.25$, not $\\binom{3}{2}(0.5)^2(0.5) = 0.375$.",
        "罚球命中概率为 $0.7$。第 $2$ 次命中恰在第 $4$ 投的概率为 $\\binom{3}{1}(0.7)^2(0.3)^2 = 0.1323$。\n\n> **注意。** 最后一次尝试必须成功，所以这不是 $k$ 次尝试中成功 $r$ 次的二项概率。$p = 0.5$ 时第 $3$ 次通话完成第 $2$ 笔成交的概率为 $\\binom{2}{1}(0.5)^2(0.5) = 0.25$，而不是 $\\binom{3}{2}(0.5)^2(0.5) = 0.375$。",
      ),
      generate(rng) {
        const s = negBinStory(rng);
        const r = rng.int(2, 4);
        const k = r + rng.int(1, 3);
        const p = Q.of(Math.round(s.p * 100), 100);
        const q = Q.of(1).sub(p);
        const exact = negBinP(r, k, p);
        const value = r4(exact.toNumber());
        const story = (x: string) => x.replace("PROB", dec(p));
        const before = binomP(k - 1, r - 1, s.p);
        return numberProblem({
          prompt: t(
            `${story(s.en(r))}. Find the probability that exactly $${k}$ attempts are needed.${FOUR.en}`,
            `${story(s.zh(r))}。求恰好需要 $${k}$ 次尝试的概率。${FOUR["zh-CN"]}`,
          ),
          answer: value,
          form: "decimal",
          mistakes: apart(value, [
            why(
              r4(binomP(k, r, s.p)),
              `That is the binomial probability of $${r}$ successes in $${k}$ attempts, which allows the last attempt to fail.`,
              `这是 $${k}$ 次尝试中成功 $${r}$ 次的二项概率，它允许最后一次失败。`,
            ),
            why(
              r4(s.p ** r * (1 - s.p) ** (k - r)),
              "That is the probability of one sequence; count the orders of the earlier successes too.",
              "这是一个序列的概率；还要数出前面几次成功的排列方式。",
            ),
            why(
              r4(choose(k - 1, r) * s.p ** r * (1 - s.p) ** (k - r)),
              `That places $${r}$ successes among the first $${k - 1}$ attempts; only $${r - 1}$ come before the last one.`,
              `这在前 $${k - 1}$ 次中放了 $${r}$ 次成功；最后一次之前只有 $${r - 1}$ 次。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Identify the distribution", "识别分布"],
                t(
                  `The ${ordinal(k)} attempt is the ${ordinal(r)} success, so the first $${k - 1}$ attempts hold $${r - 1}$ successes:`,
                  `第 $${k}$ 次尝试是第 $${r}$ 次成功，所以前 $${k - 1}$ 次尝试中有 $${r - 1}$ 次成功：`,
                ),
                [`P(X = ${k}) = \\binom{${k - 1}}{${r - 1}} ${bp(dec(p), r)} ${bp(dec(q), k - r)}`],
              ],
              [["Evaluate", "计算"], t("Round to four decimal places:", "保留四位小数："), [`P(X = ${k}) \\approx ${dec(value)}`]],
            ],
            t(
              `The probability of exactly $${r - 1}$ successes in the first $${k - 1}$ attempts is about $${before.toFixed(4)}$, and $${before.toFixed(4)} \\cdot ${dec(p)} \\approx ${dec(value)}$.`,
              `前 $${k - 1}$ 次中恰有 $${r - 1}$ 次成功的概率约为 $${before.toFixed(4)}$，而 $${before.toFixed(4)} \\cdot ${dec(p)} \\approx ${dec(value)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "expected-attempts-in-context",
      title: t("Expected attempts", "期望尝试次数"),
      explanation: t(
        "Each success takes on average the reciprocal of the success rate in attempts, so several successes take that many times as long. A salesperson closing $30\\%$ of calls needs on average $\\frac{5}{0.3} \\approx 16.67$ calls for $5$ sales.\n\n> **Watch out.** Divide by the success probability; do not multiply. For $4$ rare cards at $p = 0.25$, the expected number of packs is $\\frac{4}{0.25} = 16$, not $4 \\cdot 0.25 = 1$.",
        "每次成功平均需要成功率倒数那么多次尝试，所以若干次成功需要相应倍数的次数。成交率为 $30\\%$ 的销售员，平均需要 $\\frac{5}{0.3} \\approx 16.67$ 次通话才能成交 $5$ 笔。\n\n> **注意。** 要除以成功概率，而不是乘以它。以 $p = 0.25$ 找 $4$ 张稀有卡，期望拆包数为 $\\frac{4}{0.25} = 16$，而不是 $4 \\cdot 0.25 = 1$。",
      ),
      generate(rng) {
        const s = negBinStory(rng);
        const r = rng.int(2, 12);
        const p = Q.of(Math.round(s.p * 100), 100);
        const q = Q.of(1).sub(p);
        const story = (x: string) => x.replace("PROB", dec(p));
        const askVar = rng.bool();
        const mean = Q.of(r).div(p);
        const exact = askVar ? Q.of(r).mul(q).div(p.pow(2)) : mean;
        const value = r2(exact);
        const approx = (e: Q) => (e.eq(r2(e)) ? "=" : "\\approx");
        const twoPlaces = t(" Round to two decimal places if necessary.", "如有需要，结果保留两位小数。");
        return numberProblem({
          prompt: t(
            `${story(s.en(r))}. Find the ${askVar ? "variance of the" : "expected"} number of attempts.${twoPlaces.en}`,
            `${story(s.zh(r))}。求尝试次数的${askVar ? "方差" : "期望"}。${twoPlaces["zh-CN"]}`,
          ),
          answer: value,
          form: "decimal",
          mistakes: apart(
            value,
            askVar
              ? [
                  why(
                    r2(Q.of(r).mul(q).div(p)),
                    "That divides by $p$; the variance divides $r(1 - p)$ by $p^2$.",
                    "这除以的是 $p$；方差是 $r(1 - p)$ 除以 $p^2$。",
                  ),
                  why(r2(mean), "That is the expected number of attempts, not the variance.", "这是期望尝试次数，而不是方差。"),
                  why(r2(Q.of(r).div(p.pow(2))), "That leaves out the factor $1 - p$.", "这漏掉了因子 $1 - p$。"),
                ]
              : [
                  why(
                    r2(Q.of(r).mul(p)),
                    "That multiplies by the success probability; each success takes $\\frac{1}{p}$ attempts on average.",
                    "这乘的是成功概率；每次成功平均需要 $\\frac{1}{p}$ 次尝试。",
                  ),
                  why(
                    r2(Q.of(r).div(q)),
                    "That divides by the failure probability instead of the success probability.",
                    "这除以的是失败概率，而不是成功概率。",
                  ),
                  why(
                    r2(Q.of(1).div(p)),
                    `That is the expected wait for one success; $${r}$ are needed.`,
                    `这是一次成功的期望等待；需要 $${r}$ 次。`,
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Identify the distribution", "识别分布"],
                t(
                  `The attempts needed for $${r}$ successes with $p = ${dec(p)}$ form a negative binomial count:`,
                  `成功概率 $p = ${dec(p)}$ 时得到 $${r}$ 次成功所需的尝试次数服从负二项分布：`,
                ),
                [askVar ? "\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2}" : "E(X) = \\frac{r}{p}"],
              ],
              [
                ["Substitute", "代入"],
                t("Put in the numbers:", "代入数值："),
                [
                  askVar
                    ? `= \\frac{${r} \\cdot ${dec(q)}}{${dec(p)}^2} ${approx(exact)} ${dec(value)}`
                    : `= \\frac{${r}}{${dec(p)}} ${approx(exact)} ${dec(value)}`,
                ],
              ],
            ],
            askVar
              ? t(
                  `The variance is the mean $\\frac{${r}}{${dec(p)}} ${approx(mean)} ${dec(r2(mean))}$ times $\\frac{1 - p}{p} = \\frac{${dec(q)}}{${dec(p)}}$, which again gives about $${dec(value)}$.`,
                  `方差等于均值 $\\frac{${r}}{${dec(p)}} ${approx(mean)} ${dec(r2(mean))}$ 乘以 $\\frac{1 - p}{p} = \\frac{${dec(q)}}{${dec(p)}}$，同样约为 $${dec(value)}$。`,
                )
              : t(
                  `One success takes $\\frac{1}{${dec(p)}} ${approx(Q.of(1).div(p))} ${dec(r2(Q.of(1).div(p)))}$ attempts on average, and $${r}$ successes take $${r}$ times as many.`,
                  `一次成功平均需要 $\\frac{1}{${dec(p)}} ${approx(Q.of(1).div(p))} ${dec(r2(Q.of(1).div(p)))}$ 次尝试，$${r}$ 次成功需要 $${r}$ 倍。`,
                ),
          ),
        });
      },
    },
  ],
};

/** hyperP is P(X = k) for k special items among n drawn from N items of which K are special. */
const hyperP = (N: number, K: number, n: number, k: number) => Q.of(choose(K, k) * choose(N - K, n - k), choose(N, n));

/** hyperWays is the number of samples with exactly k special items. */
const hyperWays = (N: number, K: number, n: number, k: number) => choose(K, k) * choose(N - K, n - k);

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

/** inOrder is the probability that k special items are drawn first and then n − k others. */
const inOrder = (N: number, K: number, n: number, k: number) =>
  range(0, n - 1).reduce((acc, i) => (i < k ? acc.mul(Q.of(K - i, N - i)) : acc.mul(Q.of(N - K - (i - k), N - i))), Q.of(1));

/** theHypergeometricDistribution counts special items in a sample drawn without replacement. */
export const theHypergeometricDistribution: TopicDef = {
  id: "the-hypergeometric-distribution",
  title: t("The Hypergeometric Distribution", "超几何分布"),
  summary: t(
    "Drawing n items without replacement from N items of which K are special, the number X of special items drawn is hypergeometric, with mean E(X) = nK/N.",
    "从 N 件物品（其中 K 件特殊）中不放回地抽取 n 件，抽到的特殊物品数 X 服从超几何分布，均值 E(X) = nK/N。",
  ),
  intro: t(
    "A bag holds $4$ red and $6$ white marbles, and $3$ are drawn without replacement; $X$ is the number of red ones. Exactly one red means one of the $4$ red and two of the $6$ white: $P(X = 1) = \\frac{\\binom{4}{1}\\binom{6}{2}}{\\binom{10}{3}} = \\frac{4 \\cdot 15}{120} = \\frac{1}{2}$. Each draw is red with probability $\\frac{4}{10}$, so $E(X) = 3 \\cdot \\frac{4}{10} = 1.2$.\n\nCheck: drawing red, white, white in that order has probability $\\frac{4}{10} \\cdot \\frac{6}{9} \\cdot \\frac{5}{8} = \\frac{1}{6}$, and the red one can come in any of $3$ places, so $3 \\cdot \\frac{1}{6} = \\frac{1}{2}$.\n\nIn this lesson we find hypergeometric probabilities by counting the samples with the right number from each group, and the mean $\\frac{nK}{N}$ by adding the chance of a special item over the draws.",
    "袋中有 $4$ 个红球和 $6$ 个白球，不放回地摸出 $3$ 个；$X$ 表示红球的个数。恰有一个红球即从 $4$ 个红球中取一个、从 $6$ 个白球中取两个：$P(X = 1) = \\frac{\\binom{4}{1}\\binom{6}{2}}{\\binom{10}{3}} = \\frac{4 \\cdot 15}{120} = \\frac{1}{2}$。每次摸到红球的概率都是 $\\frac{4}{10}$，所以 $E(X) = 3 \\cdot \\frac{4}{10} = 1.2$。\n\n检验：按红、白、白的顺序摸出的概率为 $\\frac{4}{10} \\cdot \\frac{6}{9} \\cdot \\frac{5}{8} = \\frac{1}{6}$，红球可以出现在 $3$ 个位置中的任何一个，所以 $3 \\cdot \\frac{1}{6} = \\frac{1}{2}$。\n\n本课我们通过数出每组取出所需个数的样本来求超几何概率，并把每次抽到特殊物品的概率相加，得到均值 $\\frac{nK}{N}$。",
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
        "When sampling without replacement, count the ways to choose the right number from each group and divide by all the ways to choose the sample. From $10$ bulbs with $3$ faulty, choose $4$. Exactly $1$ faulty: $\\frac{\\binom{3}{1}\\binom{7}{3}}{\\binom{10}{4}} = \\frac{3 \\cdot 35}{210} = \\frac{1}{2}$.\n\n> **Watch out.** Choose from both groups. From the same $10$ bulbs, exactly $2$ faulty among $4$ has probability $\\frac{\\binom{3}{2}\\binom{7}{2}}{\\binom{10}{4}} = \\frac{63}{210} = \\frac{3}{10}$, not $\\frac{\\binom{3}{2}}{\\binom{10}{4}} = \\frac{3}{210}$.",
        "不放回抽样时，数出从每组中选出所需个数的方法数，再除以选出整个样本的所有方法数。从 $10$ 个灯泡（$3$ 个坏的）中取 $4$ 个。恰有 $1$ 个坏的：$\\frac{\\binom{3}{1}\\binom{7}{3}}{\\binom{10}{4}} = \\frac{3 \\cdot 35}{210} = \\frac{1}{2}$。\n\n> **注意。** 两组都要选。仍是这 $10$ 个灯泡，取 $4$ 个中恰有 $2$ 个坏的概率为 $\\frac{\\binom{3}{2}\\binom{7}{2}}{\\binom{10}{4}} = \\frac{63}{210} = \\frac{3}{10}$，而不是 $\\frac{\\binom{3}{2}}{\\binom{10}{4}} = \\frac{3}{210}$。",
      ),
      generate(rng) {
        const s = hyperStory(rng);
        let k: number;
        do k = rng.int(Math.max(0, s.n - (s.N - s.K)), Math.min(s.n, s.K));
        while (k === s.n && k === s.K);
        const value = hyperP(s.N, s.K, s.n, k);
        const pK = Q.of(s.K, s.N);
        const ways = hyperWays(s.N, s.K, s.n, k);
        const order = inOrder(s.N, s.K, s.n, k);
        return numberProblem({
          prompt: t(
            `${s.en}. $X$ is the number of ${s.item.en}. Find $P(X = ${k})$.`,
            `${s.zh}。$X$ 表示${s.item["zh-CN"]}的个数。求 $P(X = ${k})$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              Q.of(choose(s.n, k))
                .mul(pK.pow(k))
                .mul(
                  Q.of(1)
                    .sub(pK)
                    .pow(s.n - k),
                ),
              "That is the binomial probability, which treats the draws as independent; without replacement each draw changes what is left.",
              "这是二项概率，把各次抽取看作独立的；不放回时每次抽取都会改变剩下的物品。",
            ),
            why(
              Q.of(choose(s.K, k), choose(s.N, s.n)),
              "That chooses only from the special items; the rest of the sample must come from the others.",
              "这只从特殊物品中选；样本的其余部分必须从其他物品中选。",
            ),
            why(
              Q.of(ways, choose(s.N, s.K)),
              `That divides by $\\binom{${s.N}}{${s.K}}$; the samples are the ways to choose $${s.n}$ of $${s.N}$.`,
              `这除以了 $\\binom{${s.N}}{${s.K}}$；样本是从 $${s.N}$ 个中选 $${s.n}$ 个的方法。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Count the favorable samples", "数出有利样本"],
                t(
                  `Choose $${k}$ of the $${s.K}$ ${s.item.en} and $${s.n - k}$ of the other $${s.N - s.K}$:`,
                  `从 $${s.K}$ 个${s.item["zh-CN"]}中选 $${k}$ 个，从其余 $${s.N - s.K}$ 个中选 $${s.n - k}$ 个：`,
                ),
                [`\\binom{${s.K}}{${k}}\\binom{${s.N - s.K}}{${s.n - k}} = ${ways}`],
              ],
              [
                ["Divide by all samples", "除以样本总数"],
                t(
                  `There are $\\binom{${s.N}}{${s.n}} = ${choose(s.N, s.n)}$ equally likely samples:`,
                  `共有 $\\binom{${s.N}}{${s.n}} = ${choose(s.N, s.n)}$ 个等可能的样本：`,
                ),
                [`P(X = ${k}) = \\frac{${ways}}{${choose(s.N, s.n)}} = ${value.toLatex()}`],
              ],
            ],
            t(
              `Drawing one at a time, the $${k}$ ${s.item.en} first and then the $${s.n - k}$ others has probability $${order.toLatex()}$, and there are $\\binom{${s.n}}{${k}} = ${choose(s.n, k)}$ orders, so $${choose(s.n, k)} \\cdot ${order.toLatex()} = ${value.toLatex()}$.`,
              `逐个抽取，先抽出 $${k}$ 个${s.item["zh-CN"]}、再抽出 $${s.n - k}$ 个其他物品的概率为 $${order.toLatex()}$，共有 $\\binom{${s.n}}{${k}} = ${choose(s.n, k)}$ 种顺序，所以 $${choose(s.n, k)} \\cdot ${order.toLatex()} = ${value.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "mean-of-a-hypergeometric-variable",
      title: t("The mean", "均值"),
      explanation: t(
        "Each of the $n$ draws is special with probability $\\frac{K}{N}$, so by linearity $E(X) = \\frac{nK}{N}$, even though the draws are dependent. With $N = 10$, $K = 3$, $n = 4$: $E(X) = 1.2$.\n\n> **Watch out.** $\\frac{K}{N}$ is the chance for one draw; multiply it by the number of draws. With $N = 20$, $K = 5$, $n = 4$: $E(X) = 4 \\cdot \\frac{5}{20} = 1$, not $\\frac{5}{20} = \\frac{1}{4}$.",
        "$n$ 次抽取中每次抽到特殊物品的概率都是 $\\frac{K}{N}$，所以由线性性 $E(X) = \\frac{nK}{N}$，尽管各次抽取并不独立。$N = 10$，$K = 3$，$n = 4$ 时：$E(X) = 1.2$。\n\n> **注意。** $\\frac{K}{N}$ 是一次抽取的概率；还要乘以抽取次数。$N = 20$，$K = 5$，$n = 4$ 时：$E(X) = 4 \\cdot \\frac{5}{20} = 1$，而不是 $\\frac{5}{20} = \\frac{1}{4}$。",
      ),
      generate(rng) {
        const s = hyperStory(rng);
        const value = Q.of(s.n * s.K, s.N);
        const rest = Q.of(s.n * (s.N - s.K), s.N);
        return numberProblem({
          prompt: t(`${s.en}. Find the expected number of ${s.item.en}.`, `${s.zh}。求${s.item["zh-CN"]}个数的期望。`),
          answer: value,
          mistakes: apart(value, [
            why(
              Q.of(s.K, s.N),
              "That is the chance that one draw is special; add it over all the draws.",
              "这是一次抽取抽到特殊物品的概率；还要对所有抽取求和。",
            ),
            why(
              rest,
              `That counts the expected number of the other items, not the ${s.item.en}.`,
              `这是其他物品个数的期望，而不是${s.item["zh-CN"]}的。`,
            ),
            why(
              Q.of(s.n * s.K, s.N - s.n),
              `That divides by $${s.N} - ${s.n}$; every draw is special with probability $\\frac{${s.K}}{${s.N}}$.`,
              `这除以了 $${s.N} - ${s.n}$；每次抽取抽到特殊物品的概率都是 $\\frac{${s.K}}{${s.N}}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Use one draw", "看一次抽取"],
                t("By symmetry, each draw is equally likely to be any of the items:", "由对称性，每次抽取抽到每件物品的可能性相同："),
                [`P(\\text{draw } i \\text{ is special}) = \\frac{${s.K}}{${s.N}}`],
              ],
              [
                ["Add over the draws", "对各次抽取求和"],
                t("Expectation adds even for dependent draws:", "即使各次抽取不独立，期望也可以相加："),
                [`E(X) = ${s.n} \\cdot \\frac{${s.K}}{${s.N}} = ${value.toLatex()}`],
              ],
            ],
            t(
              `The expected number of the other items is $${s.n} \\cdot \\frac{${s.N - s.K}}{${s.N}} = ${rest.toLatex()}$, and $${value.toLatex()} + ${rest.toLatex()} = ${s.n}$, the sample size.`,
              `其他物品个数的期望为 $${s.n} \\cdot \\frac{${s.N - s.K}}{${s.N}} = ${rest.toLatex()}$，而 $${value.toLatex()} + ${rest.toLatex()} = ${s.n}$，正是样本容量。`,
            ),
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
  intro: t(
    "From $12$ items of which $5$ are special, $4$ are drawn without replacement. Out of $\\binom{12}{4} = 495$ samples, $\\binom{7}{4} = 35$ have no special item and $5\\binom{7}{3} = 175$ have exactly one, so $P(X \\le 1) = \\frac{35 + 175}{495} = \\frac{14}{33}$. The variance is $4 \\cdot \\frac{5}{12} \\cdot \\frac{7}{12} \\cdot \\frac{8}{11} = \\frac{70}{99}$, smaller than the binomial $4 \\cdot \\frac{5}{12} \\cdot \\frac{7}{12} = \\frac{35}{36}$.\n\nCheck: the samples with $2$, $3$ and $4$ special items number $\\binom{5}{2}\\binom{7}{2} = 210$, $\\binom{5}{3}\\binom{7}{1} = 70$ and $\\binom{5}{4} = 5$, and $35 + 175 + 210 + 70 + 5 = 495$, every sample once.\n\nIn this lesson we add hypergeometric point probabilities for cumulative events, using the complement for at least one, and find the variance with the factor $\\frac{N - n}{N - 1}$ for drawing without replacement.",
    "从 $12$ 件物品（其中 $5$ 件特殊）中不放回地抽取 $4$ 件。在 $\\binom{12}{4} = 495$ 个样本中，$\\binom{7}{4} = 35$ 个不含特殊物品，$5\\binom{7}{3} = 175$ 个恰含一件，所以 $P(X \\le 1) = \\frac{35 + 175}{495} = \\frac{14}{33}$。方差为 $4 \\cdot \\frac{5}{12} \\cdot \\frac{7}{12} \\cdot \\frac{8}{11} = \\frac{70}{99}$，比二项分布的 $4 \\cdot \\frac{5}{12} \\cdot \\frac{7}{12} = \\frac{35}{36}$ 小。\n\n检验：含 $2$、$3$、$4$ 件特殊物品的样本分别有 $\\binom{5}{2}\\binom{7}{2} = 210$、$\\binom{5}{3}\\binom{7}{1} = 70$ 和 $\\binom{5}{4} = 5$ 个，而 $35 + 175 + 210 + 70 + 5 = 495$，每个样本恰好数了一次。\n\n本课我们把超几何分布的点概率相加求累积事件的概率，对“至少一个”用补事件，并用不放回抽样的修正因子 $\\frac{N - n}{N - 1}$ 求方差。",
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
        "A cumulative probability adds point probabilities, and for at least one it is quicker to subtract the probability of none from one. From $10$ bulbs with $3$ faulty, choose $4$. At least one faulty: $1 - P(X = 0) = 1 - \\frac{\\binom{7}{4}}{\\binom{10}{4}} = 1 - \\frac{35}{210} = \\frac{5}{6}$.\n\n> **Watch out.** At least one is everything except none, not exactly one. From the same bulbs, $P(X \\ge 1) = \\frac{5}{6}$, while $P(X = 1) = \\frac{3 \\cdot 35}{210} = \\frac{1}{2}$ leaves out the samples with two or three faulty bulbs.",
        "累积概率是若干点概率之和，对于至少一个的情形，用 1 减去一个都没有的概率更快。从 $10$ 个灯泡（$3$ 个坏的）中取 $4$ 个。至少一个坏的：$1 - P(X = 0) = 1 - \\frac{\\binom{7}{4}}{\\binom{10}{4}} = 1 - \\frac{35}{210} = \\frac{5}{6}$。\n\n> **注意。** 至少一个是除了一个都没有以外的全部情形，而不是恰好一个。仍是这些灯泡，$P(X \\ge 1) = \\frac{5}{6}$，而 $P(X = 1) = \\frac{3 \\cdot 35}{210} = \\frac{1}{2}$ 漏掉了含两个或三个坏灯泡的样本。",
      ),
      generate(rng) {
        const atLeast = rng.bool();
        let s: HyperStory;
        do s = hyperStory(rng);
        while (s.n + s.K > s.N);
        const total = choose(s.N, s.n);
        const w0 = hyperWays(s.N, s.K, s.n, 0);
        const w1 = hyperWays(s.N, s.K, s.n, 1);
        const p0 = hyperP(s.N, s.K, s.n, 0);
        const p1 = hyperP(s.N, s.K, s.n, 1);
        const value = atLeast ? Q.of(1).sub(p0) : p0.add(p1);
        const top = Math.min(s.n, s.K);
        const from = atLeast ? 1 : 2;
        const others = range(from, top).map((k) => hyperWays(s.N, s.K, s.n, k));
        const otherSum = others.reduce((a, b) => a + b, 0);
        const reduced = Q.of(otherSum, total).toLatex() === `\\frac{${otherSum}}{${total}}` ? "" : ` = ${Q.of(otherSum, total).toLatex()}`;
        return numberProblem({
          prompt: atLeast
            ? t(
                `${s.en}. Find the probability that at least one of the ${s.item.en} is chosen.`,
                `${s.zh}。求至少有一个${s.item["zh-CN"]}的概率。`,
              )
            : t(
                `${s.en}. Find the probability that at most one of the ${s.item.en} is chosen.`,
                `${s.zh}。求至多有一个${s.item["zh-CN"]}的概率。`,
              ),
          answer: value,
          mistakes: apart(
            value,
            atLeast
              ? [
                  why(p1, "That is exactly one; at least one also includes two or more.", "这是恰好一个；至少一个还包括两个及以上。"),
                  why(p0, "That is the probability of none; subtract it from one.", "这是一个都没有的概率；还要用一减去它。"),
                  why(p0.add(p1), "That is $P(X \\le 1)$, at most one.", "这是 $P(X \\le 1)$，即至多一个。"),
                ]
              : [
                  why(p1, "That is exactly one; at most one also includes none.", "这是恰好一个；至多一个还包括一个都没有。"),
                  why(
                    Q.of(1).sub(p1),
                    "That subtracts exactly one from one, which is not the complement of at most one.",
                    "这是用一减去恰好一个的概率，那不是“至多一个”的补事件。",
                  ),
                  why(p0, "That is none alone; at most one also includes exactly one.", "这只是一个都没有；至多一个还包括恰好一个。"),
                ],
          ),
          solution: atLeast
            ? walked(
                [
                  [
                    ["Count the samples with none", "数出一个都没有的样本"],
                    t(`All $${s.n}$ come from the $${s.N - s.K}$ others:`, `$${s.n}$ 个全部来自其余 $${s.N - s.K}$ 个：`),
                    [`P(X = 0) = \\frac{\\binom{${s.N - s.K}}{${s.n}}}{\\binom{${s.N}}{${s.n}}} = \\frac{${w0}}{${total}}`],
                  ],
                  [
                    ["Use the complement", "用补事件"],
                    t("Subtract from one:", "用一减去："),
                    [`P(X \\ge 1) = 1 - \\frac{${w0}}{${total}} = ${value.toLatex()}`],
                  ],
                ],
                t(
                  `Counting the samples with $1$ to $${top}$ ${s.item.en} directly gives $${others.join(" + ")} = ${otherSum}$, and $\\frac{${otherSum}}{${total}}${reduced}$ is that probability again.`,
                  `直接数出含 $1$ 到 $${top}$ 个${s.item["zh-CN"]}的样本：$${others.join(" + ")} = ${otherSum}$，而 $\\frac{${otherSum}}{${total}}${reduced}$ 正是同一个概率。`,
                ),
              )
            : walked(
                [
                  [
                    ["Count the samples with none or one", "数出零个或一个的样本"],
                    t("None, and exactly one:", "零个，以及恰好一个："),
                    [`\\binom{${s.N - s.K}}{${s.n}} = ${w0}, \\quad ${s.K}\\binom{${s.N - s.K}}{${s.n - 1}} = ${w1}`],
                  ],
                  [
                    ["Divide by all samples", "除以样本总数"],
                    t(`There are $\\binom{${s.N}}{${s.n}} = ${total}$ samples:`, `共有 $\\binom{${s.N}}{${s.n}} = ${total}$ 个样本：`),
                    [`P(X \\le 1) = \\frac{${w0} + ${w1}}{${total}} = ${value.toLatex()}`],
                  ],
                ],
                t(
                  `The samples with $2$ or more ${s.item.en} number $${others.length > 1 ? `${others.join(" + ")} = ` : ""}${otherSum}$, and $${w0} + ${w1} + ${otherSum} = ${total}$, every sample once.`,
                  `含 $2$ 个及以上${s.item["zh-CN"]}的样本有 $${others.length > 1 ? `${others.join(" + ")} = ` : ""}${otherSum}$ 个，而 $${w0} + ${w1} + ${otherSum} = ${total}$，每个样本恰好数了一次。`,
                ),
              ),
        });
      },
    },
    {
      id: "variance-of-a-hypergeometric-variable",
      title: t("The variance", "方差"),
      explanation: t(
        "The variance matches the binomial one times a correction factor, which is smaller than one because drawing without replacement reduces the spread. With $N = 10$, $K = 3$, $n = 4$: $\\operatorname{Var}(X) = 4 \\cdot \\frac{3}{10} \\cdot \\frac{7}{10} \\cdot \\frac{6}{9} = 0.56$, smaller than the binomial $0.84$ because sampling without replacement reduces spread.\n\n> **Watch out.** The correction factor is $\\frac{N - n}{N - 1}$, not $\\frac{N - n}{N}$. With $N = 10$, $K = 3$, $n = 4$: $0.84 \\cdot \\frac{6}{9} = 0.56$, not $0.84 \\cdot \\frac{6}{10} = 0.504$.",
        "方差等于二项分布的方差乘以一个修正因子，这个因子小于 1，因为不放回抽取会减小波动。$N = 10$，$K = 3$，$n = 4$ 时：$\\operatorname{Var}(X) = 4 \\cdot \\frac{3}{10} \\cdot \\frac{7}{10} \\cdot \\frac{6}{9} = 0.56$，比二项分布的 $0.84$ 小，因为不放回抽样减小了离散程度。\n\n> **注意。** 修正因子是 $\\frac{N - n}{N - 1}$，而不是 $\\frac{N - n}{N}$。$N = 10$，$K = 3$，$n = 4$ 时：$0.84 \\cdot \\frac{6}{9} = 0.56$，而不是 $0.84 \\cdot \\frac{6}{10} = 0.504$。",
      ),
      generate(rng) {
        const s = hyperStory(rng);
        const pK = Q.of(s.K, s.N);
        const binom = Q.of(s.n).mul(pK).mul(Q.of(1).sub(pK));
        const value = binom.mul(Q.of(s.N - s.n, s.N - 1));
        const mean = Q.of(s.n * s.K, s.N);
        const f = Q.of(s.n * (s.n - 1) * s.K * (s.K - 1), s.N * (s.N - 1));
        return numberProblem({
          prompt: t(
            `${s.en}. $X$ is the number of ${s.item.en}. Find $\\operatorname{Var}(X)$.`,
            `${s.zh}。$X$ 表示${s.item["zh-CN"]}的个数。求 $\\operatorname{Var}(X)$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              binom,
              "That is the binomial variance; drawing without replacement multiplies it by $\\frac{N - n}{N - 1}$.",
              "这是二项方差；不放回抽取还要乘以 $\\frac{N - n}{N - 1}$。",
            ),
            why(mean, "That is the mean $\\frac{nK}{N}$, not the variance.", "这是均值 $\\frac{nK}{N}$，而不是方差。"),
            why(
              binom.mul(Q.of(s.N - s.n, s.N)),
              "That uses the factor $\\frac{N - n}{N}$; the correction divides by $N - 1$.",
              "这用了因子 $\\frac{N - n}{N}$；修正因子的分母是 $N - 1$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Start from the binomial variance", "从二项方差出发"],
                t(`Each draw is special with probability $\\frac{${s.K}}{${s.N}}$:`, `每次抽到特殊物品的概率为 $\\frac{${s.K}}{${s.N}}$：`),
                [
                  `n \\frac{K}{N}\\left(1 - \\frac{K}{N}\\right) = ${s.n} \\cdot ${pK.toLatex()} \\cdot ${Q.of(1).sub(pK).toLatex()} = ${binom.toLatex()}`,
                ],
              ],
              [
                ["Apply the correction", "乘以修正因子"],
                t("Drawing without replacement multiplies by $\\frac{N - n}{N - 1}$:", "不放回抽取要乘以 $\\frac{N - n}{N - 1}$："),
                [`\\operatorname{Var}(X) = ${binom.toLatex()} \\cdot \\frac{${s.N - s.n}}{${s.N - 1}} = ${value.toLatex()}`],
              ],
            ],
            t(
              `Counting ordered pairs of special draws, $E(X(X - 1)) = \\frac{n(n - 1)K(K - 1)}{N(N - 1)} = ${f.toLatex()}$, so $\\operatorname{Var}(X) = E(X(X - 1)) + E(X) - E(X)^2 = ${f.toLatex()} + ${mean.toLatex()} - \\left(${mean.toLatex()}\\right)^2 = ${value.toLatex()}$.`,
              `按特殊物品的有序抽取对计数，$E(X(X - 1)) = \\frac{n(n - 1)K(K - 1)}{N(N - 1)} = ${f.toLatex()}$，所以 $\\operatorname{Var}(X) = E(X(X - 1)) + E(X) - E(X)^2 = ${f.toLatex()} + ${mean.toLatex()} - \\left(${mean.toLatex()}\\right)^2 = ${value.toLatex()}$。`,
            ),
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
