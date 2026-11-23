import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, poly, Q } from "@ga/subject-math";

import { choiceProblem, numberProblem, steps, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";

// Precalculus unit 11: Probability and Statistics, modules 11.38 (Discrete
// Random Variables) and 11.39 (The Normal Distribution).

/** h writes a number of hundredths as a decimal: h(35) is "0.35". */
const h = (x: number) => dec(Q.of(x, 100));

/** tt writes a number of ten-thousandths as a decimal: tt(8413) is "0.8413". */
const tt = (x: number) => dec(Q.of(x, 10000));

/** simplest asks for an exact answer in simplest form. */
const simplest = t(" Give the answer as an integer or a fraction in simplest form.", "答案写成整数或最简分数。");

/** asDecimal asks for a decimal. */
const asDecimal = t(" Give the answer as a decimal.", "答案写成小数。");

/** range lists k consecutive integers from start. */
const range = (start: number, k: number) => Array.from({ length: k }, (_, i) => start + i);

/** sum adds numbers. */
const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);

/** choose is the binomial coefficient n choose k. */
function choose(n: number, k: number): number {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

/** oneOf builds a multiple-choice problem from a right option and up to three distinct wrong ones. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const seen = new Set([right.en]);
  const rest: Text[] = [];
  for (const w of wrong) {
    if (!seen.has(w.en)) {
      seen.add(w.en);
      rest.push(w);
    }
  }
  const options = [right, ...rest.slice(0, 3)];
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

/** parts splits 1 into k positive multiples of 0.05, in hundredths. */
function parts(rng: Rng, k: number): number[] {
  const cuts = rng.sample(range(1, 19), k - 1).sort((a, b) => a - b);
  const out: number[] = [];
  let prev = 0;
  for (const c of [...cuts, 20]) {
    out.push((c - prev) * 5);
    prev = c;
  }
  return out;
}

/** cumulative are the running totals of a list. */
function cumulative(ps: readonly number[]): number[] {
  const out: number[] = [];
  let acc = 0;
  for (const p of ps) {
    acc += p;
    out.push(acc);
  }
  return out;
}

/** table writes a two-row table of values x and a row labelled label. */
function table(xs: readonly (number | string)[], label: string, vals: readonly string[], head = "x"): string {
  return (
    `| $${head}$ | ${xs.map((x) => `$${x}$`).join(" | ")} |\n` +
    `| :---: |${xs.map(() => " :---: |").join("")}\n` +
    `| $${label}$ | ${vals.map((v) => `$${v}$`).join(" | ")} |`
  );
}

/** pmfIntro introduces a probability distribution table. */
const pmfIntro = t("The random variable $X$ has the probability distribution below.", "随机变量 $X$ 的概率分布如下表。");

/** cdfIntro introduces a cumulative distribution table. */
const cdfIntro = t(
  "The discrete random variable $X$ takes only the values in the table, and its cumulative distribution function $F(x) = P(X \\le x)$ is given below.",
  "离散随机变量 $X$ 只取表中的值，其累积分布函数 $F(x) = P(X \\le x)$ 如下表。",
);

/** pw writes a power of a fraction: (2/3)^4, or the fraction itself for exponent 1. */
function pw(q: Q, e: number): string {
  const base = q.isInteger() ? q.toLatex() : `\\left(${q.toLatex()}\\right)`;
  return e === 1 ? q.toLatex() : `${base}^{${e}}`;
}

/** binomTerm writes C(n, k) p^k q^(n-k), dropping factors with exponent 0. */
function binomTerm(n: number, k: number, p: Q, q: Q, pl: (v: Q, e: number) => string = pw): string {
  const fs = [`\\binom{${n}}{${k}}`];
  if (k > 0) fs.push(pl(p, k));
  if (n - k > 0) fs.push(pl(q, n - k));
  return fs.join(" ");
}

/** binomP is the binomial probability P(X = k) for X ~ B(n, p). */
const binomP = (n: number, k: number, p: Q) =>
  Q.of(choose(n, k))
    .mul(p.pow(k))
    .mul(Q.one.sub(p).pow(n - k));

/** FRACTIONS are success probabilities for exact problems. */
const FRACTIONS: readonly Q[] = [
  Q.of(1, 2),
  Q.of(1, 3),
  Q.of(2, 3),
  Q.of(1, 4),
  Q.of(3, 4),
  Q.of(1, 5),
  Q.of(2, 5),
  Q.of(3, 5),
  Q.of(4, 5),
  Q.of(1, 6),
  Q.of(5, 6),
];

/** pd writes a probability: as a decimal when decimal is set, otherwise as a fraction. */
const pd = (q: Q, decimal: boolean) => (decimal ? dec(q) : q.toLatex());

/** pwd writes a power of a decimal probability: 0.3^{4}. */
function pwd(q: Q, e: number): string {
  return e === 1 ? dec(q) : `${dec(q)}^{${e}}`;
}

/** Mistake is a value a typical mistake produces, with what to say about it. */
type Mistake = ReturnType<typeof why>;

/** distinct keeps the first mistake for each value, so no response gets two kinds of feedback. */
function distinct(ms: readonly Mistake[]): Mistake[] {
  const key = (m: Mistake) => (typeof m.value === "number" ? Q.of(m.value) : m.value).toLatex();
  return ms.filter((m, i) => ms.findIndex((o) => key(o) === key(m)) === i);
}

/** listed writes a sum of probabilities given in hundredths. */
const listed = (ps: readonly number[]) => (ps.length === 0 ? "0" : ps.map(h).join(" + "));

// ─── Module 11.38: Discrete Random Variables ────────────────────────────────

/** probabilityMassFunctions introduces discrete random variables and their probability mass functions. */
const probabilityMassFunctions: TopicDef = {
  id: "probability-mass-functions-of-discrete-random-variables",
  title: t("Probability Mass Functions of Discrete Random Variables", "离散随机变量的概率质量函数"),
  summary: t(
    "Describe a discrete random variable by its probability mass function, find a missing probability using the fact that the probabilities add up to 1, and compute the probability of an event from the table or from a formula.",
    "用概率质量函数描述离散随机变量，利用概率之和为 1 求缺失的概率，并由表格或公式计算事件的概率。",
  ),
  prerequisites: ["mutually-exclusive-events"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSS.MD.A.1"],
  intro: t(
    `Toss two fair coins and let $X$ be the number of heads. The four equally likely outcomes HH, HT, TH and TT give $X = 2, 1, 1, 0$, so $X$ takes the value $0$ with probability $\\frac{1}{4}$, the value $1$ with probability $\\frac{2}{4} = \\frac{1}{2}$ and the value $2$ with probability $\\frac{1}{4}$.

Check: $\\frac{1}{4} + \\frac{1}{2} + \\frac{1}{4} = 1$, since exactly one of the values occurs on every toss.

In this lesson we describe such a variable by a table of its probabilities, find a missing probability from the total $1$, add probabilities to get the probability of an event, and work with probabilities given by a formula.`,
    `抛两枚均匀硬币，设 $X$ 为正面朝上的个数。四个等可能的结果 HH、HT、TH、TT 分别给出 $X = 2, 1, 1, 0$，所以 $X$ 取 $0$ 的概率是 $\\frac{1}{4}$，取 $1$ 的概率是 $\\frac{2}{4} = \\frac{1}{2}$，取 $2$ 的概率是 $\\frac{1}{4}$。

检验：$\\frac{1}{4} + \\frac{1}{2} + \\frac{1}{4} = 1$，因为每次抛掷恰好出现其中一个值。

这节课我们用概率表来描述这样的变量，由总和 $1$ 求缺失的概率，把概率相加求事件的概率，并处理由公式给出的概率。`,
  ),
  knowledgePoints: [
    {
      id: "missing-probability-in-a-distribution",
      title: t("Finding a missing probability", "求缺失的概率"),
      explanation: t(
        "A **discrete random variable** $X$ is a quantity whose value is determined by a random experiment and that takes separate values, such as the number of heads in three coin tosses. Its **probability mass function** (or probability distribution) gives $P(X = x)$ for each value $x$.\n\nEvery probability is between $0$ and $1$, and since exactly one value occurs, the probabilities add up to $1$:\n\n$$\\sum_x P(X = x) = 1.$$\n\nIf $X$ takes the values $1, 2, 3$ with probabilities $0.2$, $0.5$ and $p$, then $0.2 + 0.5 + p = 1$, so $p = 0.3$. Check: $0.2 + 0.5 + 0.3 = 1$, and $0.3$ lies between $0$ and $1$.\n\n> **Watch out.** The sum of the known probabilities, here $0.7$, is not $p$: it is the probability that $X$ takes one of the other values. Subtract it from $1$.",
        "**离散随机变量** $X$ 是由随机试验决定、取值彼此分离的量，例如抛三次硬币时正面朝上的次数。它的**概率质量函数**（或概率分布）给出每个值 $x$ 的概率 $P(X = x)$。\n\n每个概率都在 $0$ 与 $1$ 之间；又因为恰好有一个值出现，所有概率之和为 $1$：\n\n$$\\sum_x P(X = x) = 1.$$\n\n若 $X$ 取 $1, 2, 3$ 的概率分别为 $0.2$、$0.5$ 和 $p$，则 $0.2 + 0.5 + p = 1$，所以 $p = 0.3$。检验：$0.2 + 0.5 + 0.3 = 1$，且 $0.3$ 在 $0$ 与 $1$ 之间。\n\n> **注意。** 已知概率之和（这里是 $0.7$）不是 $p$，而是 $X$ 取其他值的概率。要用 $1$ 减去它。",
      ),
      generate(rng) {
        const k = rng.int(4, 5);
        const xs = range(rng.int(-1, 2), k);
        const ps = parts(rng, k);
        const m = rng.int(0, k - 1);
        const known = ps.filter((_, i) => i !== m);
        const sumKnown = sum(known);
        const vals = ps.map((p, i) => (i === m ? "p" : h(p)));
        const tab = table(xs, "P(X = x)", vals);
        return numberProblem({
          prompt: t(`${pmfIntro.en}\n\n${tab}\n\nFind the value of $p$.`, `${pmfIntro["zh-CN"]}\n\n${tab}\n\n求 $p$ 的值。`),
          answer: Q.of(ps[m]!, 100),
          form: "decimal",
          mistakes: distinct([
            why(
              Q.of(sumKnown, 100),
              `This is the sum of the known probabilities, the chance that $X$ is not $${xs[m]}$; $p$ is what is left of $1$.`,
              `这是已知概率之和，即 $X$ 不等于 $${xs[m]}$ 的概率；$p$ 是 $1$ 减去它后剩下的部分。`,
            ),
            why(
              Q.of(ps[m]! + known[0]!, 100),
              `This leaves $${h(known[0]!)}$ out of the sum of the known probabilities: all of them must be subtracted from $1$.`,
              `已知概率之和漏掉了 $${h(known[0]!)}$：要从 $1$ 中减去所有已知概率。`,
            ),
          ]),
          solution: t(
            `**Step 1: Add the known probabilities.**${steps(`${known.map(h).join(" + ")} = ${h(sumKnown)}`)}**Step 2: Use the total $1$.** The probabilities add up to $1$:${steps(`${h(sumKnown)} + p = 1`, `p = 1 - ${h(sumKnown)} = ${h(ps[m]!)}`)}**Check.** With $p = ${h(ps[m]!)}$ the whole table adds up to $1$:${steps(`${ps.map(h).join(" + ")} = 1`)}`,
            `**第一步：把已知概率相加。**${steps(`${known.map(h).join(" + ")} = ${h(sumKnown)}`)}**第二步：利用总和 $1$。**所有概率之和为 $1$：${steps(`${h(sumKnown)} + p = 1`, `p = 1 - ${h(sumKnown)} = ${h(ps[m]!)}`)}**检验。**取 $p = ${h(ps[m]!)}$，整张表的概率之和为 $1$：${steps(`${ps.map(h).join(" + ")} = 1`)}`,
          ),
        });
      },
    },
    {
      id: "probabilities-of-events-from-a-distribution",
      title: t("Probabilities of events", "事件的概率"),
      explanation: t(
        "The values of $X$ are mutually exclusive, so the probability that $X$ lies in a set of values is the sum of their probabilities. Watch whether an endpoint is included: $X \\le 2$ includes $2$, while $X < 2$ does not.\n\nIf $P(X = 0) = 0.1$, $P(X = 1) = 0.3$, $P(X = 2) = 0.4$ and $P(X = 3) = 0.2$, then\n\n$$P(X \\ge 2) = 0.4 + 0.2 = 0.6, \\qquad P(X < 2) = 0.1 + 0.3 = 0.4.$$\n\nCheck: the two events are complements, and $0.6 + 0.4 = 1$.\n\n> **Watch out.** $X > 2$ and $X \\ge 2$ differ by $P(X = 2)$, here $0.4$. Read the sign before choosing which values to add.",
        "$X$ 的各个取值互斥，所以 $X$ 落在一组值中的概率等于这些值的概率之和。注意端点是否包含在内：$X \\le 2$ 包含 $2$，而 $X < 2$ 不包含。\n\n若 $P(X = 0) = 0.1$，$P(X = 1) = 0.3$，$P(X = 2) = 0.4$，$P(X = 3) = 0.2$，则\n\n$$P(X \\ge 2) = 0.4 + 0.2 = 0.6, \\qquad P(X < 2) = 0.1 + 0.3 = 0.4.$$\n\n检验：这两个事件互为对立事件，而 $0.6 + 0.4 = 1$。\n\n> **注意。** $X > 2$ 与 $X \\ge 2$ 相差 $P(X = 2)$，这里是 $0.4$。先看清不等号，再决定把哪些值的概率相加。",
      ),
      generate(rng) {
        const xs = range(rng.int(-1, 2), 5);
        const ps = parts(rng, 5);
        const j = rng.int(1, 3);
        const type = rng.int(0, 3);
        const ops = ["\\le", "<", "\\ge", ">"];
        const inc = (ty: number, i: number) => [i <= j, i < j, i >= j, i > j][ty]!;
        const total = (ty: number) => sum(ps.filter((_, i) => inc(ty, i)));
        const sel = ps.map((_, i) => i).filter((i) => inc(type, i));
        const ans = total(type);
        const other = type ^ 1;
        const ev = `X ${ops[type]} ${xs[j]}`;
        const tab = table(xs, "P(X = x)", ps.map(h));
        const line = `P(${ev}) = ${sel.map((i) => h(ps[i]!)).join(" + ")} = ${h(ans)}`;
        return numberProblem({
          prompt: t(`${pmfIntro.en}\n\n${tab}\n\nFind $P(${ev})$.`, `${pmfIntro["zh-CN"]}\n\n${tab}\n\n求 $P(${ev})$。`),
          answer: Q.of(ans, 100),
          form: "decimal",
          mistakes: distinct([
            why(
              Q.of(total(other), 100),
              `This is $P(X ${ops[other]} ${xs[j]})$: the value $${xs[j]}$ is ${inc(type, j) ? "in the event, since the sign includes it" : "not in the event, since the sign is strict"}.`,
              `这是 $P(X ${ops[other]} ${xs[j]})$：${inc(type, j) ? `不等号包含等号，所以 $${xs[j]}$ 在事件中` : `不等号是严格的，所以 $${xs[j]}$ 不在事件中`}。`,
            ),
            why(
              Q.of(100 - ans, 100),
              "This is the probability of the complement, the values that are not in the event.",
              "这是对立事件的概率，即不在事件中的那些值。",
            ),
          ]),
          solution: t(
            `**Step 1: List the values in the event.** The values $x$ with $${ev.replace("X", "x")}$ are $${sel.map((i) => xs[i]).join(", ")}$.\n\n**Step 2: Add their probabilities.**${steps(line)}**Check.** The other values have total probability $${listed(ps.filter((_, i) => !inc(type, i)))} = ${h(100 - ans)}$, and $${h(ans)} + ${h(100 - ans)} = 1$.`,
            `**第一步：列出事件包含的值。**满足 $${ev.replace("X", "x")}$ 的值 $x$ 是 $${sel.map((i) => xs[i]).join(", ")}$。\n\n**第二步：把它们的概率相加。**${steps(line)}**检验。**其余各值的概率之和为 $${listed(ps.filter((_, i) => !inc(type, i)))} = ${h(100 - ans)}$，而 $${h(ans)} + ${h(100 - ans)} = 1$。`,
          ),
        });
      },
    },
    {
      id: "distributions-given-by-a-formula",
      title: t("Distributions given by a formula", "由公式给出的分布"),
      explanation: t(
        "A probability mass function can be given by a formula with an unknown constant $k$. Write out every probability, set their sum equal to $1$ and solve for $k$.\n\nIf $P(X = x) = kx$ for $x = 1, 2, 3, 4$, then\n\n$$k + 2k + 3k + 4k = 1 \\quad\\Rightarrow\\quad 10k = 1 \\quad\\Rightarrow\\quad k = \\frac{1}{10},$$\n\nand, for example, $P(X = 3) = \\frac{3}{10}$. Check: $\\frac{1}{10} + \\frac{2}{10} + \\frac{3}{10} + \\frac{4}{10} = 1$.\n\n> **Watch out.** The values are not equally likely, so $k$ is not $\\frac{1}{4}$: add the four probabilities $k, 2k, 3k, 4k$. And when a probability is asked for, multiply $k$ by the formula's factor instead of stopping at $k$.",
        "概率质量函数也可以由含未知常数 $k$ 的公式给出。写出每个概率，令它们的和等于 $1$，解出 $k$。\n\n若 $P(X = x) = kx$，$x = 1, 2, 3, 4$，则\n\n$$k + 2k + 3k + 4k = 1 \\quad\\Rightarrow\\quad 10k = 1 \\quad\\Rightarrow\\quad k = \\frac{1}{10},$$\n\n例如 $P(X = 3) = \\frac{3}{10}$。检验：$\\frac{1}{10} + \\frac{2}{10} + \\frac{3}{10} + \\frac{4}{10} = 1$。\n\n> **注意。** 各个值不是等可能的，所以 $k$ 不是 $\\frac{1}{4}$：要把 $k, 2k, 3k, 4k$ 四个概率相加。求某个概率时，要用 $k$ 乘以公式中的因子，不能停在 $k$。",
      ),
      generate(rng) {
        const form = rng.int(0, 2);
        const n = form === 2 ? rng.int(3, 5) : rng.int(3, 6);
        const c = form === 1 ? rng.int(1, 4) : 0;
        const term = (x: number) => (form === 0 ? x : form === 1 ? x + c : x * x);
        const xs = range(1, n);
        const total = sum(xs.map(term));
        const expr = form === 0 ? "kx" : form === 1 ? `k(x + ${c})` : "kx^2";
        const kq = Q.of(1, total);
        const ask = rng.int(0, 2);
        const j = rng.int(1, n);
        const setup = t(
          `The random variable $X$ takes the values $${xs.join(", ")}$, with $P(X = x) = ${expr}$ for each of them, where $k$ is a constant.`,
          `随机变量 $X$ 取值 $${xs.join(", ")}$，且对每个值都有 $P(X = x) = ${expr}$，其中 $k$ 为常数。`,
        );
        const sumLine = `${xs.map((x) => `${poly([term(x), "k"])}`).join(" + ")} = 1`;
        const fracs = xs.map((x) => `\\frac{${term(x)}}{${total}}`).join(" + ");
        const kCheck = t(
          `**Check.** With $k = ${kq.toLatex()}$ the probabilities are ${xs.map((x) => `$\\frac{${term(x)}}{${total}}$`).join(", ")}, each between $0$ and $1$, and${steps(`${fracs} = \\frac{${total}}{${total}} = 1`)}`,
          `**检验。**取 $k = ${kq.toLatex()}$，各个概率为 ${xs.map((x) => `$\\frac{${term(x)}}{${total}}$`).join("、")}，都在 $0$ 与 $1$ 之间，并且${steps(`${fracs} = \\frac{${total}}{${total}} = 1`)}`,
        );
        const kSteps = t(
          `**Step 1: Write out every probability.** Put $x = ${xs.join(", ")}$ into $${expr}$ and set the sum equal to $1$:${steps(sumLine)}**Step 2: Solve for $k$.**${steps(`${total}k = 1`, `k = ${kq.toLatex()}`)}`,
          `**第一步：写出每个概率。**把 $x = ${xs.join(", ")}$ 代入 $${expr}$，令它们的和等于 $1$：${steps(sumLine)}**第二步：解出 $k$。**${steps(`${total}k = 1`, `k = ${kq.toLatex()}`)}`,
        );
        const equal = why(
          Q.of(1, n),
          `This gives every value the same probability, but $P(X = x) = ${expr}$ changes with $x$.`,
          `这让每个值的概率都相同，但 $P(X = x) = ${expr}$ 随 $x$ 变化。`,
        );
        if (ask === 0) {
          return numberProblem({
            prompt: t(`${setup.en} Find $k$.${simplest.en}`, `${setup["zh-CN"]}求 $k$。${simplest["zh-CN"]}`),
            answer: kq,
            wrong: [Q.of(1, n * n)],
            mistakes: [
              why(
                Q.of(total),
                `This is the coefficient of $k$ in the sum; $${total}k = 1$ gives $k = ${kq.toLatex()}$.`,
                `这是和式中 $k$ 的系数；由 $${total}k = 1$ 得 $k = ${kq.toLatex()}$。`,
              ),
              equal,
            ],
            solution: t(`${kSteps.en}${kCheck.en}`, `${kSteps["zh-CN"]}${kCheck["zh-CN"]}`),
          });
        }
        const ev = ask === 1 ? `X = ${j}` : `X \\ge ${n - 1}`;
        const ans = ask === 1 ? Q.of(term(j), total) : Q.of(term(n - 1) + term(n), total);
        const last =
          ask === 1
            ? `P(X = ${j}) = ${poly([term(j), "k"])} = ${ans.toLatex()}`
            : `P(${ev}) = ${poly([term(n - 1), "k"])} + ${poly([term(n), "k"])} = ${ans.toLatex()}`;
        return numberProblem({
          prompt: t(`${setup.en} Find $P(${ev})$.${simplest.en}`, `${setup["zh-CN"]}求 $P(${ev})$。${simplest["zh-CN"]}`),
          answer: ans,
          mistakes: distinct([
            why(
              kq,
              "This is $k$ itself; the probability is $k$ times the formula's factor.",
              "这是 $k$ 本身；所求概率是 $k$ 乘以公式中的因子。",
            ),
            ask === 1
              ? equal
              : why(
                  Q.of(2, n),
                  `This gives every value the same probability, but $P(X = x) = ${expr}$ changes with $x$.`,
                  `这让每个值的概率都相同，但 $P(X = x) = ${expr}$ 随 $x$ 变化。`,
                ),
            why(
              Q.of(ask === 1 ? term(j) : term(n - 1) + term(n), n),
              `This divides by the number of values, $${n}$, instead of by the total $${total}$ that the sum of the probabilities gives.`,
              `这里除以了取值的个数 $${n}$，而应除以概率之和给出的总数 $${total}$。`,
            ),
            why(Q.one.sub(ans), "This is the probability of the complement.", "这是对立事件的概率。"),
          ]),
          solution: t(
            `${kSteps.en}**Step 3: Find the probability.**${steps(last)}**Check.** The other values have probability $\\frac{${total - ans.mul(Q.of(total)).toNumber()}}{${total}}$ together, and $${ans.toLatex()} + \\frac{${total - ans.mul(Q.of(total)).toNumber()}}{${total}} = 1$.`,
            `${kSteps["zh-CN"]}**第三步：求概率。**${steps(last)}**检验。**其余各值的概率之和为 $\\frac{${total - ans.mul(Q.of(total)).toNumber()}}{${total}}$，而 $${ans.toLatex()} + \\frac{${total - ans.mul(Q.of(total)).toNumber()}}{${total}} = 1$。`,
          ),
        });
      },
    },
  ],
};

/** cumulativeDistributionFunctions covers the cumulative distribution function of a discrete random variable. */
const cumulativeDistributionFunctions: TopicDef = {
  id: "cumulative-distribution-functions-for-discrete-random-variables",
  title: t("Cumulative Distribution Functions for Discrete Random Variables", "离散随机变量的累积分布函数"),
  summary: t(
    "Compute values of the cumulative distribution function F(x) = P(X ≤ x) of a discrete random variable, recover individual probabilities from it, and find the probability of an interval as a difference of two values of F.",
    "计算离散随机变量的累积分布函数 F(x) = P(X ≤ x) 的值，由它求出单个取值的概率，并把区间的概率写成 F 的两个值之差。",
  ),
  prerequisites: ["probability-mass-functions-of-discrete-random-variables"],
  encompasses: [{ topic: "probability-mass-functions-of-discrete-random-variables", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSS.MD.A.1"],
  intro: t(
    `$X$ takes the values $1, 2, 3$ with probabilities $0.2, 0.5, 0.3$. Keeping a running total gives the chance that $X$ is at most each value: $0.2$ up to $1$, then $0.2 + 0.5 = 0.7$ up to $2$, then $0.7 + 0.3 = 1$ up to $3$.

Check: the last running total is $1$, since $X$ is always at most its largest value.

In this lesson we build this running total, the cumulative distribution function, read single probabilities back from it as differences, and find the probability of an interval from two of its values.`,
    `$X$ 取 $1, 2, 3$ 的概率分别为 $0.2, 0.5, 0.3$。逐个累加，就得到 $X$ 不超过每个值的概率：到 $1$ 为止是 $0.2$，到 $2$ 为止是 $0.2 + 0.5 = 0.7$，到 $3$ 为止是 $0.7 + 0.3 = 1$。

检验：最后的累计和是 $1$，因为 $X$ 总不超过它的最大值。

这节课我们建立这个累计和，即累积分布函数，再用差把单个概率求回来，并由它的两个值求区间的概率。`,
  ),
  knowledgePoints: [
    {
      id: "values-of-the-cdf",
      title: t("Values of the cumulative distribution function", "累积分布函数的值"),
      explanation: t(
        "The **cumulative distribution function** of $X$ is\n\n$$F(x) = P(X \\le x),$$\n\nthe running total of the probabilities up to and including $x$. It is defined for every real $x$: between two values of $X$ it stays constant. If $X$ takes the values $1, 2, 3$ with probabilities $0.2, 0.5, 0.3$, then $F(2) = 0.2 + 0.5 = 0.7$, and also $F(2.5) = 0.7$, because $X$ takes no value between $2$ and $2.5$. Check: $F(2) = 1 - P(X = 3) = 1 - 0.3 = 0.7$.\n\n> **Watch out.** $F(x)$ includes $x$ itself, since the sign is $\\le$. And at a point between two values, such as $2.5$, count only the values below it, not the next one.",
        "$X$ 的**累积分布函数**是\n\n$$F(x) = P(X \\le x),$$\n\n即到 $x$ 为止（包括 $x$）的概率的累计和。它对每个实数 $x$ 都有定义：在 $X$ 的两个相邻取值之间保持不变。若 $X$ 取 $1, 2, 3$ 的概率分别为 $0.2, 0.5, 0.3$，则 $F(2) = 0.2 + 0.5 = 0.7$，并且 $F(2.5) = 0.7$，因为 $X$ 在 $2$ 与 $2.5$ 之间不取值。检验：$F(2) = 1 - P(X = 3) = 1 - 0.3 = 0.7$。\n\n> **注意。** 不等号是 $\\le$，所以 $F(x)$ 包含 $x$ 本身。在两个取值之间的点（如 $2.5$），只计入它下面的值，不计入下一个值。",
      ),
      generate(rng) {
        const k = rng.int(4, 5);
        const xs = range(rng.int(-1, 2), k);
        const ps = parts(rng, k);
        const cum = cumulative(ps);
        const j = rng.int(0, k - 2);
        const half = rng.bool(0.3);
        const a = half ? dec(Q.of(2 * xs[j]! + 1, 2)) : `${xs[j]}`;
        const ans = cum[j]!;
        const tab = table(xs, "P(X = x)", ps.map(h));
        const terms = ps
          .slice(0, j + 1)
          .map(h)
          .join(" + ");
        const line = `F(${a}) = P(X \\le ${a}) = ${terms}${j > 0 ? ` = ${h(ans)}` : ""}`;
        return numberProblem({
          prompt: t(`${pmfIntro.en}\n\n${tab}\n\nFind $F(${a})$.`, `${pmfIntro["zh-CN"]}\n\n${tab}\n\n求 $F(${a})$。`),
          answer: Q.of(ans, 100),
          form: "decimal",
          mistakes: distinct([
            why(
              Q.of(ps[j]!, 100),
              `This is $P(X = ${xs[j]})$ alone; $F$ adds the probabilities of every value up to $${a}$.`,
              `这只是 $P(X = ${xs[j]})$；$F$ 要把不超过 $${a}$ 的每个值的概率都加起来。`,
            ),
            why(
              Q.of(cum[j + 1]!, 100),
              `This also counts $${xs[j + 1]}$, which is greater than $${a}$.`,
              `这把 $${xs[j + 1]}$ 也算进去了，而它大于 $${a}$。`,
            ),
            ...(j > 0
              ? [
                  why(
                    Q.of(cum[j - 1]!, 100),
                    `This leaves out $${xs[j]}$, which is at most $${a}$ and so belongs to $X \\le ${a}$.`,
                    `这漏掉了 $${xs[j]}$，它不超过 $${a}$，属于 $X \\le ${a}$。`,
                  ),
                ]
              : []),
            why(Q.of(100 - ans, 100), `This is $P(X > ${a})$, the complement.`, `这是 $P(X > ${a})$，即对立事件的概率。`),
          ]),
          solution: t(
            `**Step 1: Find the values that count.** $F(${a}) = P(X \\le ${a})$ counts the values $${xs.slice(0, j + 1).join(", ")}$${half ? `; the largest of them is $${xs[j]}$, since $X$ takes no value between $${xs[j]}$ and $${a}$` : ""}.\n\n**Step 2: Add their probabilities.**${steps(line)}**Check.** From the other end, the values above $${a}$ have probability $${listed(ps.slice(j + 1))} = ${h(100 - ans)}$, and $1 - ${h(100 - ans)} = ${h(ans)}$.`,
            `**第一步：找出要计入的值。**$F(${a}) = P(X \\le ${a})$ 计入取值 $${xs.slice(0, j + 1).join(", ")}$${half ? `；其中最大的是 $${xs[j]}$，因为 $X$ 在 $${xs[j]}$ 与 $${a}$ 之间不取值` : ""}。\n\n**第二步：把它们的概率相加。**${steps(line)}**检验。**从另一端算：大于 $${a}$ 的值的概率为 $${listed(ps.slice(j + 1))} = ${h(100 - ans)}$，而 $1 - ${h(100 - ans)} = ${h(ans)}$。`,
          ),
        });
      },
    },
    {
      id: "probabilities-from-the-cdf",
      title: t("Probabilities from the cumulative distribution function", "由累积分布函数求概率"),
      explanation: t(
        "The cumulative distribution function determines every probability. For consecutive values $a - 1$ and $a$ of $X$:\n\n$$P(X = a) = F(a) - F(a - 1), \\qquad P(X > a) = 1 - F(a), \\qquad P(X \\ge a) = 1 - F(a - 1).$$\n\nIf $F(2) = 0.45$ and $F(3) = 0.8$, then $P(X = 3) = 0.8 - 0.45 = 0.35$ and $P(X > 3) = 1 - 0.8 = 0.2$. Check: $P(X \\le 2) + P(X = 3) + P(X > 3) = 0.45 + 0.35 + 0.2 = 1$.\n\n> **Watch out.** $P(X \\ge a) = 1 - F(a - 1)$, not $1 - F(a)$: subtracting $F(a)$ also removes $a$ itself. And $F(a)$ alone is $P(X \\le a)$, not $P(X = a)$.",
        "累积分布函数决定所有概率。设 $a - 1$ 与 $a$ 是 $X$ 的相邻取值：\n\n$$P(X = a) = F(a) - F(a - 1), \\qquad P(X > a) = 1 - F(a), \\qquad P(X \\ge a) = 1 - F(a - 1).$$\n\n若 $F(2) = 0.45$，$F(3) = 0.8$，则 $P(X = 3) = 0.8 - 0.45 = 0.35$，$P(X > 3) = 1 - 0.8 = 0.2$。检验：$P(X \\le 2) + P(X = 3) + P(X > 3) = 0.45 + 0.35 + 0.2 = 1$。\n\n> **注意。** $P(X \\ge a) = 1 - F(a - 1)$，不是 $1 - F(a)$：减去 $F(a)$ 会把 $a$ 本身也去掉。而 $F(a)$ 本身是 $P(X \\le a)$，不是 $P(X = a)$。",
      ),
      generate(rng) {
        const xs = range(rng.int(-1, 2), 5);
        const cum = cumulative(parts(rng, 5));
        const tab = table(xs, "F(x)", cum.map(h));
        const type = rng.int(0, 2);
        let ev: string;
        let ans: number;
        let mistakes: Mistake[];
        let line: string;
        let rule: Text;
        let check: Text;
        const w = (v: number, en: string, zh: string) => why(Q.of(v, 100), en, zh);
        if (type === 0) {
          const j = rng.int(1, 4);
          ev = `X = ${xs[j]}`;
          ans = cum[j]! - cum[j - 1]!;
          mistakes = [
            w(
              cum[j]!,
              `This is $F(${xs[j]}) = P(X \\le ${xs[j]})$, which also counts the smaller values; subtract $F(${xs[j - 1]})$.`,
              `这是 $F(${xs[j]}) = P(X \\le ${xs[j]})$，其中还含有更小的值；要减去 $F(${xs[j - 1]})$。`,
            ),
            w(
              100 - cum[j]!,
              `This is $1 - F(${xs[j]}) = P(X > ${xs[j]})$, the values above $${xs[j]}$.`,
              `这是 $1 - F(${xs[j]}) = P(X > ${xs[j]})$，即大于 $${xs[j]}$ 的值。`,
            ),
          ];
          line = `P(X = ${xs[j]}) = F(${xs[j]}) - F(${xs[j - 1]}) = ${h(cum[j]!)} - ${h(cum[j - 1]!)} = ${h(ans)}`;
          rule = t(
            `$F(${xs[j]})$ counts every value up to $${xs[j]}$ and $F(${xs[j - 1]})$ every value up to $${xs[j - 1]}$, so their difference is the value $${xs[j]}$ alone.`,
            `$F(${xs[j]})$ 计入不超过 $${xs[j]}$ 的所有值，$F(${xs[j - 1]})$ 计入不超过 $${xs[j - 1]}$ 的所有值，二者之差就只剩取值 $${xs[j]}$。`,
          );
          check = t(
            `Adding back: $F(${xs[j - 1]}) + P(X = ${xs[j]}) = ${h(cum[j - 1]!)} + ${h(ans)} = ${h(cum[j]!)} = F(${xs[j]})$.`,
            `加回去：$F(${xs[j - 1]}) + P(X = ${xs[j]}) = ${h(cum[j - 1]!)} + ${h(ans)} = ${h(cum[j]!)} = F(${xs[j]})$。`,
          );
        } else if (type === 1) {
          const j = rng.int(0, 3);
          ev = `X > ${xs[j]}`;
          ans = 100 - cum[j]!;
          mistakes = [
            w(
              cum[j]!,
              `This is $F(${xs[j]}) = P(X \\le ${xs[j]})$, the complement of the event.`,
              `这是 $F(${xs[j]}) = P(X \\le ${xs[j]})$，即对立事件的概率。`,
            ),
            ...(j > 0
              ? [
                  w(
                    100 - cum[j - 1]!,
                    `This is $P(X \\ge ${xs[j]})$: it includes $${xs[j]}$, which the strict sign leaves out.`,
                    `这是 $P(X \\ge ${xs[j]})$：它包含 $${xs[j]}$，而严格不等号不包含它。`,
                  ),
                ]
              : []),
          ];
          line = `P(X > ${xs[j]}) = 1 - F(${xs[j]}) = 1 - ${h(cum[j]!)} = ${h(ans)}`;
          rule = t(
            `The event $X > ${xs[j]}$ is the complement of $X \\le ${xs[j]}$, whose probability is $F(${xs[j]})$.`,
            `事件 $X > ${xs[j]}$ 是 $X \\le ${xs[j]}$ 的对立事件，后者的概率是 $F(${xs[j]})$。`,
          );
          check = t(
            `The two events cover everything once: $P(X \\le ${xs[j]}) + P(X > ${xs[j]}) = ${h(cum[j]!)} + ${h(ans)} = 1$.`,
            `两个事件恰好覆盖全部情况一次：$P(X \\le ${xs[j]}) + P(X > ${xs[j]}) = ${h(cum[j]!)} + ${h(ans)} = 1$。`,
          );
        } else {
          const j = rng.int(1, 4);
          ev = `X \\ge ${xs[j]}`;
          ans = 100 - cum[j - 1]!;
          mistakes = [
            w(
              100 - cum[j]!,
              `This is $1 - F(${xs[j]}) = P(X > ${xs[j]})$, which leaves out $${xs[j]}$ itself.`,
              `这是 $1 - F(${xs[j]}) = P(X > ${xs[j]})$，漏掉了 $${xs[j]}$ 本身。`,
            ),
            w(
              cum[j - 1]!,
              `This is $F(${xs[j - 1]}) = P(X < ${xs[j]})$, the complement of the event.`,
              `这是 $F(${xs[j - 1]}) = P(X < ${xs[j]})$，即对立事件的概率。`,
            ),
          ];
          line = `P(X \\ge ${xs[j]}) = 1 - F(${xs[j - 1]}) = 1 - ${h(cum[j - 1]!)} = ${h(ans)}`;
          rule = t(
            `The event $X \\ge ${xs[j]}$ is the complement of $X \\le ${xs[j - 1]}$, since $${xs[j - 1]}$ is the value just below $${xs[j]}$.`,
            `事件 $X \\ge ${xs[j]}$ 是 $X \\le ${xs[j - 1]}$ 的对立事件，因为 $${xs[j - 1]}$ 是紧挨在 $${xs[j]}$ 下面的值。`,
          );
          check = t(
            `The two events cover everything once: $P(X \\le ${xs[j - 1]}) + P(X \\ge ${xs[j]}) = ${h(cum[j - 1]!)} + ${h(ans)} = 1$.`,
            `两个事件恰好覆盖全部情况一次：$P(X \\le ${xs[j - 1]}) + P(X \\ge ${xs[j]}) = ${h(cum[j - 1]!)} + ${h(ans)} = 1$。`,
          );
        }
        return numberProblem({
          prompt: t(`${cdfIntro.en}\n\n${tab}\n\nFind $P(${ev})$.`, `${cdfIntro["zh-CN"]}\n\n${tab}\n\n求 $P(${ev})$。`),
          answer: Q.of(ans, 100),
          form: "decimal",
          mistakes: distinct(mistakes),
          solution: t(
            `**Step 1: Write the event with values of $F$.** ${rule.en}\n\n**Step 2: Read off and subtract.**${steps(line)}**Check.** ${check.en}`,
            `**第一步：用 $F$ 的值表示事件。**${rule["zh-CN"]}\n\n**第二步：读表并相减。**${steps(line)}**检验。**${check["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "probabilities-of-intervals-from-the-cdf",
      title: t("Probabilities of intervals", "区间的概率"),
      explanation: t(
        "For values $a < b$,\n\n$$P(a < X \\le b) = F(b) - F(a),$$\n\nsince $F(b)$ counts every value up to $b$ and subtracting $F(a)$ removes those up to $a$. For other endpoints, adjust which values are counted: when $X$ takes only integer values, $P(a \\le X \\le b) = F(b) - F(a - 1)$ and $P(a < X < b) = F(b - 1) - F(a)$.\n\nFor $F(0) = 0.1$, $F(1) = 0.3$, $F(2) = 0.55$ and $F(3) = 0.9$: $P(1 < X \\le 3) = 0.9 - 0.3 = 0.6$ and $P(1 \\le X \\le 3) = 0.9 - 0.1 = 0.8$. Check: $P(X = 2) + P(X = 3) = 0.25 + 0.35 = 0.6$.\n\n> **Watch out.** When the left end is included, subtract $F$ at the value just below it: $F(b) - F(a)$ removes $a$ itself. List the values the event contains before choosing which two values of $F$ to use.",
        "对 $a < b$，\n\n$$P(a < X \\le b) = F(b) - F(a),$$\n\n因为 $F(b)$ 计入了不超过 $b$ 的所有取值，减去 $F(a)$ 就去掉了不超过 $a$ 的那些。端点不同时，要调整计入哪些取值：当 $X$ 只取整数时，$P(a \\le X \\le b) = F(b) - F(a - 1)$，$P(a < X < b) = F(b - 1) - F(a)$。\n\n若 $F(0) = 0.1$，$F(1) = 0.3$，$F(2) = 0.55$，$F(3) = 0.9$，则 $P(1 < X \\le 3) = 0.9 - 0.3 = 0.6$，$P(1 \\le X \\le 3) = 0.9 - 0.1 = 0.8$。检验：$P(X = 2) + P(X = 3) = 0.25 + 0.35 = 0.6$。\n\n> **注意。** 左端点包含在内时，要减去它下面那个值处的 $F$：$F(b) - F(a)$ 会把 $a$ 本身去掉。先列出事件包含的值，再决定用 $F$ 的哪两个值。",
      ),
      generate(rng) {
        const xs = range(rng.int(-1, 2), 5);
        const cum = cumulative(parts(rng, 5));
        const tab = table(xs, "F(x)", cum.map(h));
        const F = (i: number) => (i < 0 ? 0 : cum[i]!);
        const Fl = (i: number) => (i < 0 ? "0" : `F(${xs[i]})`);
        const type = rng.int(0, 2);
        let a: number;
        let b: number;
        if (type === 0) {
          a = rng.int(0, 3);
          b = rng.int(a + 1, 4);
        } else if (type === 1) {
          a = rng.int(1, 3);
          b = rng.int(a + 1, 4);
        } else {
          a = rng.int(0, 2);
          b = rng.int(a + 2, 4);
        }
        const [lo, hi] = type === 0 ? [a + 1, b] : type === 1 ? [a, b] : [a + 1, b - 1];
        const ops = [
          ["<", "\\le"],
          ["\\le", "\\le"],
          ["<", "<"],
        ][type]!;
        const ev = `${xs[a]} ${ops[0]} X ${ops[1]} ${xs[b]}`;
        const ans = F(hi) - F(lo - 1);
        const line = `P(${ev}) = ${Fl(hi)} - ${Fl(lo - 1)} = ${h(F(hi))} - ${h(F(lo - 1))} = ${h(ans)}`;
        return numberProblem({
          prompt: t(`${cdfIntro.en}\n\n${tab}\n\nFind $P(${ev})$.`, `${cdfIntro["zh-CN"]}\n\n${tab}\n\n求 $P(${ev})$。`),
          answer: Q.of(ans, 100),
          form: "decimal",
          mistakes: distinct([
            ...(
              [
                [F(b) - F(a), `${xs[a]} < X \\le ${xs[b]}`],
                [F(b) - F(a - 1), `${xs[a]} \\le X \\le ${xs[b]}`],
                [F(b - 1) - F(a), `${xs[a]} < X < ${xs[b]}`],
              ] as const
            ).map(([v, other]) =>
              why(
                Q.of(v, 100),
                `This is $P(${other})$, which treats the endpoints differently from $P(${ev})$.`,
                `这是 $P(${other})$，它对端点的处理与 $P(${ev})$ 不同。`,
              ),
            ),
            why(
              Q.of(F(hi) + F(lo - 1), 100),
              `This adds $${Fl(lo - 1)}$, but the values up to $${lo === 0 ? xs[0]! - 1 : xs[lo - 1]}$ have to be taken away.`,
              `这里加上了 $${Fl(lo - 1)}$，而不超过 $${lo === 0 ? xs[0]! - 1 : xs[lo - 1]}$ 的值应该减去。`,
            ),
          ]),
          solution: t(
            `**Step 1: List the values in the event.** It contains ${lo === hi ? `only the value $${xs[lo]}$` : `the values from $${xs[lo]}$ to $${xs[hi]}$`}, so take everything up to $${xs[hi]}$ and remove everything ${lo === 0 ? `below $${xs[0]}$, which is nothing` : `up to $${xs[lo - 1]}$`}.\n\n**Step 2: Subtract values of $F$.**${steps(line)}**Check.** Add the single probabilities instead, each a difference of neighboring values of $F$:${steps(
              `${range(lo, hi - lo + 1)
                .map((i) => `P(X = ${xs[i]})`)
                .join(" + ")} = ${range(lo, hi - lo + 1)
                .map((i) => h(F(i) - F(i - 1)))
                .join(" + ")} = ${h(ans)}`,
            )}`,
            `**第一步：列出事件包含的值。**它${lo === hi ? `只包含取值 $${xs[lo]}$` : `包含从 $${xs[lo]}$ 到 $${xs[hi]}$ 的取值`}，所以取不超过 $${xs[hi]}$ 的全部，再去掉${lo === 0 ? `小于 $${xs[0]}$ 的部分（没有）` : `不超过 $${xs[lo - 1]}$ 的部分`}。\n\n**第二步：用 $F$ 的值相减。**${steps(line)}**检验。**改为把单个概率相加，每个都是 $F$ 的相邻两值之差：${steps(
              `${range(lo, hi - lo + 1)
                .map((i) => `P(X = ${xs[i]})`)
                .join(" + ")} = ${range(lo, hi - lo + 1)
                .map((i) => h(F(i) - F(i - 1)))
                .join(" + ")} = ${h(ans)}`,
            )}`,
          ),
        });
      },
    },
  ],
};

/** expectedValues covers the expected value of a discrete random variable. */
const expectedValues: TopicDef = {
  id: "expected-values-of-discrete-random-variables",
  title: t("Expected Values of Discrete Random Variables", "离散随机变量的期望"),
  summary: t(
    "Compute the expected value E(X) = Σ x·P(X = x) of a discrete random variable, use a given expected value to find an unknown outcome, and find the expected gain of a game of chance.",
    "计算离散随机变量的期望 E(X) = Σ x·P(X = x)，利用已知期望求未知的取值，并求机会游戏的期望收益。",
  ),
  prerequisites: ["probability-mass-functions-of-discrete-random-variables", "mean-of-a-data-set"],
  encompasses: [
    { topic: "probability-mass-functions-of-discrete-random-variables", weight: 0.2 },
    { topic: "mean-of-a-data-set", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSS.MD.A.2", "CCSS.HSS.MD.B.5"],
  intro: t(
    `A spinner lands on $0$ half the time, on $1$ three tenths of the time and on $4$ the rest of the time, two tenths. Over $100$ spins we expect about $50$ zeros, $30$ ones and $20$ fours, whose total is $0 + 30 + 80 = 110$, an average of $1.1$ per spin.

Check: weighting each value by its probability gives the same number directly, $0(0.5) + 1(0.3) + 4(0.2) = 1.1$.

In this lesson we compute this long-run average, the expected value, use a known expected value to find an unknown value, and decide whether a game of chance is fair.`,
    `一个转盘有一半的时间停在 $0$，十分之三的时间停在 $1$，其余十分之二的时间停在 $4$。转 $100$ 次，期望约有 $50$ 个 $0$、$30$ 个 $1$、$20$ 个 $4$，总和为 $0 + 30 + 80 = 110$，平均每次 $1.1$。

检验：按概率给每个值加权，直接得到同一个数：$0(0.5) + 1(0.3) + 4(0.2) = 1.1$。

这节课我们计算这个长期平均值，即期望，利用已知的期望求未知的取值，并判断一个机会游戏是否公平。`,
  ),
  knowledgePoints: [
    {
      id: "expected-value-from-a-distribution",
      title: t("Computing an expected value", "计算期望"),
      explanation: t(
        "The **expected value** (or mean) of a discrete random variable is the probability-weighted average of its values:\n\n$$E(X) = \\sum_x x \\cdot P(X = x).$$\n\nIt is the long-run average of $X$ over many repetitions, and it need not be a value $X$ can take. If $X$ takes the values $0, 1, 4$ with probabilities $0.5, 0.3, 0.2$, then\n\n$$E(X) = 0(0.5) + 1(0.3) + 4(0.2) = 1.1.$$\n\nCheck: over $10$ repetitions we expect $5$ zeros, $3$ ones and $2$ fours, with total $11$, an average of $1.1$.\n\n> **Watch out.** Do not average the values themselves: $\\frac{0 + 1 + 4}{3} \\approx 1.67$ treats them as equally likely. Each value must be weighted by its probability.",
        "离散随机变量的**期望**（或均值）是其取值按概率加权的平均：\n\n$$E(X) = \\sum_x x \\cdot P(X = x).$$\n\n它是多次重复试验中 $X$ 的长期平均，不一定是 $X$ 能取到的值。若 $X$ 取 $0, 1, 4$ 的概率分别为 $0.5, 0.3, 0.2$，则\n\n$$E(X) = 0(0.5) + 1(0.3) + 4(0.2) = 1.1.$$\n\n检验：重复 $10$ 次，期望有 $5$ 个 $0$、$3$ 个 $1$、$2$ 个 $4$，总和为 $11$，平均为 $1.1$。\n\n> **注意。** 不要直接对取值求平均：$\\frac{0 + 1 + 4}{3} \\approx 1.67$ 把它们当成了等可能的。每个值都要按它的概率加权。",
      ),
      generate(rng) {
        const k = rng.int(3, 5);
        const xs = rng.sample(range(-4, 17), k).sort((a, b) => a - b);
        const ps = parts(rng, k);
        const total = sum(xs.map((x, i) => x * ps[i]!));
        const ans = Q.of(total, 100);
        const tab = table(xs, "P(X = x)", ps.map(h));
        const terms = xs.map((x, i) => `${x < 0 ? `(${x})` : x}(${h(ps[i]!)})`).join(" + ");
        return numberProblem({
          prompt: t(`${pmfIntro.en}\n\n${tab}\n\nFind $E(X)$.`, `${pmfIntro["zh-CN"]}\n\n${tab}\n\n求 $E(X)$。`),
          answer: ans,
          form: "decimal",
          mistakes: distinct([
            why(
              Q.of(sum(xs), k),
              "This is the plain average of the values, as if they were equally likely; weight each value by its probability.",
              "这是各取值的简单平均，相当于把它们当成等可能的；要按概率给每个值加权。",
            ),
            why(
              Q.of(total - xs[k - 1]! * ps[k - 1]!, 100),
              `This leaves out the last term, $${xs[k - 1]}(${h(ps[k - 1]!)})$.`,
              `这漏掉了最后一项 $${xs[k - 1]}(${h(ps[k - 1]!)})$。`,
            ),
          ]),
          solution: t(
            `**Step 1: Multiply each value by its probability.**${steps(xs.map((x, i) => `${x < 0 ? `(${x})` : x}(${h(ps[i]!)}) = ${dec(Q.of(x * ps[i]!, 100))}`).join(", \\quad "))}**Step 2: Add the products.**${steps(`E(X) = ${terms} = ${dec(ans)}`)}**Check.** Over $100$ repetitions we expect ${xs.map((x, i) => `$${ps[i]}$ of the value $${x}$`).join(", ")}, with total $${total}$; dividing by $100$ gives $${dec(ans)}$.`,
            `**第一步：把每个取值乘以它的概率。**${steps(xs.map((x, i) => `${x < 0 ? `(${x})` : x}(${h(ps[i]!)}) = ${dec(Q.of(x * ps[i]!, 100))}`).join(", \\quad "))}**第二步：把乘积相加。**${steps(`E(X) = ${terms} = ${dec(ans)}`)}**检验。**重复 $100$ 次，期望有 ${xs.map((x, i) => `$${ps[i]}$ 次取 $${x}$`).join("、")}，总和为 $${total}$；除以 $100$ 得 $${dec(ans)}$。`,
          ),
        });
      },
    },
    {
      id: "unknown-value-from-the-expected-value",
      title: t("Using the expected value to find an unknown", "由期望求未知量"),
      explanation: t(
        "When the expected value is known, the formula $E(X) = \\sum x \\cdot P(X = x)$ is an equation for any one unknown in the table.\n\nIf $X$ takes the values $1, 2, a$ with probabilities $0.5, 0.3, 0.2$ and $E(X) = 2.7$, then\n\n$$0.5 + 0.6 + 0.2a = 2.7 \\quad\\Rightarrow\\quad 0.2a = 1.6 \\quad\\Rightarrow\\quad a = 8.$$\n\nCheck: $1(0.5) + 2(0.3) + 8(0.2) = 0.5 + 0.6 + 1.6 = 2.7$.\n\n> **Watch out.** Subtract the known terms before dividing: $\\frac{2.7}{0.2} = 13.5$ forgets that the values $1$ and $2$ also contribute to $E(X)$.",
        "已知期望时，公式 $E(X) = \\sum x \\cdot P(X = x)$ 就成为关于表中某个未知量的方程。\n\n若 $X$ 取 $1, 2, a$ 的概率分别为 $0.5, 0.3, 0.2$，且 $E(X) = 2.7$，则\n\n$$0.5 + 0.6 + 0.2a = 2.7 \\quad\\Rightarrow\\quad 0.2a = 1.6 \\quad\\Rightarrow\\quad a = 8.$$\n\n检验：$1(0.5) + 2(0.3) + 8(0.2) = 0.5 + 0.6 + 1.6 = 2.7$。\n\n> **注意。** 先减去已知的项再相除：$\\frac{2.7}{0.2} = 13.5$ 忘了取值 $1$ 和 $2$ 也对 $E(X)$ 有贡献。",
      ),
      generate(rng) {
        const xs = rng.sample(range(-3, 16), 4).sort((a, b) => a - b);
        const ps = parts(rng, 4);
        const total = sum(xs.map((x, i) => x * ps[i]!));
        const rest = total - xs[3]! * ps[3]!;
        const e = Q.of(total, 100);
        const shown: (number | string)[] = [...xs.slice(0, 3), "a"];
        const tab = table(shown, "P(X = x)", ps.map(h));
        const terms = xs
          .slice(0, 3)
          .map((x, i) => `${x < 0 ? `(${x})` : x}(${h(ps[i]!)})`)
          .join(" + ");
        return numberProblem({
          prompt: t(
            `${pmfIntro.en}\n\n${tab}\n\nGiven that $E(X) = ${dec(e)}$, find $a$.`,
            `${pmfIntro["zh-CN"]}\n\n${tab}\n\n已知 $E(X) = ${dec(e)}$，求 $a$。`,
          ),
          answer: xs[3]!,
          mistakes: distinct([
            why(
              Q.of(xs[3]! * ps[3]!, 100),
              `This is the term $${h(ps[3]!)}a$, not $a$: divide by $${h(ps[3]!)}$ at the end.`,
              `这是 $${h(ps[3]!)}a$ 这一项，不是 $a$：最后还要除以 $${h(ps[3]!)}$。`,
            ),
            why(
              Q.of(total, ps[3]!),
              `This divides $E(X)$ by $${h(ps[3]!)}$ without first subtracting the known terms, $${dec(Q.of(rest, 100))}$.`,
              `这直接用 $E(X)$ 除以 $${h(ps[3]!)}$，没有先减去已知的项 $${dec(Q.of(rest, 100))}$。`,
            ),
            why(
              Q.of(total + rest, ps[3]!),
              `This adds the known terms, $${dec(Q.of(rest, 100))}$, to $E(X)$ instead of subtracting them.`,
              `这把已知的项 $${dec(Q.of(rest, 100))}$ 加到了 $E(X)$ 上，而应该减去。`,
            ),
          ]),
          solution: t(
            `**Step 1: Set up the expected value.**${steps(`${terms} + ${h(ps[3]!)}a = ${dec(e)}`, `${dec(Q.of(rest, 100))} + ${h(ps[3]!)}a = ${dec(e)}`)}**Step 2: Solve for $a$.**${steps(`${h(ps[3]!)}a = ${dec(e)} - ${rest < 0 ? `(${dec(Q.of(rest, 100))})` : dec(Q.of(rest, 100))} = ${dec(Q.of(total - rest, 100))}`, `a = \\frac{${dec(Q.of(total - rest, 100))}}{${h(ps[3]!)}} = ${xs[3]}`)}**Check.** With $a = ${xs[3]}$:${steps(`${terms} + ${xs[3]! < 0 ? `(${xs[3]})` : xs[3]}(${h(ps[3]!)}) = ${dec(e)}`)}`,
            `**第一步：列出期望的方程。**${steps(`${terms} + ${h(ps[3]!)}a = ${dec(e)}`, `${dec(Q.of(rest, 100))} + ${h(ps[3]!)}a = ${dec(e)}`)}**第二步：解出 $a$。**${steps(`${h(ps[3]!)}a = ${dec(e)} - ${rest < 0 ? `(${dec(Q.of(rest, 100))})` : dec(Q.of(rest, 100))} = ${dec(Q.of(total - rest, 100))}`, `a = \\frac{${dec(Q.of(total - rest, 100))}}{${h(ps[3]!)}} = ${xs[3]}`)}**检验。**取 $a = ${xs[3]}$：${steps(`${terms} + ${xs[3]! < 0 ? `(${xs[3]})` : xs[3]}(${h(ps[3]!)}) = ${dec(e)}`)}`,
          ),
        });
      },
    },
    {
      id: "expected-gain-of-a-game",
      title: t("Expected gain of a game", "游戏的期望收益"),
      explanation: t(
        "In a game of chance, let $X$ be the net gain: the prize won minus the cost of playing. The expected gain $E(X)$ is the average gain per game in the long run. A game is **fair** when $E(X) = 0$; when $E(X) < 0$ the player loses money on average.\n\nA game costs $2$ dollars. A fair die is rolled and a six wins $9$ dollars. The net gain is $7$ with probability $\\frac{1}{6}$ and $-2$ with probability $\\frac{5}{6}$, so\n\n$$E(X) = 7 \\cdot \\frac{1}{6} - 2 \\cdot \\frac{5}{6} = -\\frac{1}{2}.$$\n\nEquivalently, the expected prize $\\frac{9}{6} = \\frac{3}{2}$ minus the cost $2$ is $-\\frac{1}{2}$.\n\nCheck: over $6$ games one six is expected, so the player pays $12$ dollars and wins $9$, a loss of $3$, which is $-\\frac{1}{2}$ per game.\n\n> **Watch out.** The cost is paid in every game, including the winning ones. Subtracting it only when the player loses, or not at all, overstates the gain.",
        "在机会游戏中，设 $X$ 为净收益：赢得的奖金减去参加游戏的费用。期望收益 $E(X)$ 是长期来看每局的平均收益。$E(X) = 0$ 的游戏是**公平的**；$E(X) < 0$ 时，玩家平均会亏钱。\n\n玩一局需要 $2$ 元。掷一颗均匀骰子，掷出六点赢得 $9$ 元。净收益以概率 $\\frac{1}{6}$ 为 $7$，以概率 $\\frac{5}{6}$ 为 $-2$，所以\n\n$$E(X) = 7 \\cdot \\frac{1}{6} - 2 \\cdot \\frac{5}{6} = -\\frac{1}{2}.$$\n\n也可以用期望奖金 $\\frac{9}{6} = \\frac{3}{2}$ 减去费用 $2$，得 $-\\frac{1}{2}$。\n\n检验：玩 $6$ 局期望掷出一次六点，玩家付出 $12$ 元、赢得 $9$ 元，共亏 $3$ 元，即每局 $-\\frac{1}{2}$。\n\n> **注意。** 每局都要付费，赢的那局也一样。只在输的时候减去费用，或者根本不减，都会高估收益。",
      ),
      generate(rng) {
        const s1 = rng.int(1, 2);
        const s2 = rng.int(1, 3);
        const w1 = rng.int(6, 20);
        const w2 = rng.int(1, 5);
        const c = rng.int(1, 6);
        const big = range(7 - s1, s1);
        const small = range(7 - s1 - s2, s2);
        const listEn = (fs: number[]) =>
          fs.length === 1
            ? `a ${fs[0]}`
            : `${fs
                .slice(0, -1)
                .map((f) => `a ${f}`)
                .join(", ")} or a ${fs[fs.length - 1]}`;
        const listZh = (fs: number[]) => (fs.length === 1 ? `${fs[0]}` : `${fs.slice(0, -1).join("、")} 或 ${fs[fs.length - 1]}`);
        const prize = Q.of(s1 * w1 + s2 * w2, 6);
        const ans = prize.sub(Q.of(c));
        const line1 = `\\text{expected prize} = ${w1} \\cdot \\frac{${s1}}{6} + ${w2} \\cdot \\frac{${s2}}{6} = ${prize.toLatex()}`;
        const line2 = `E(X) = ${prize.toLatex()} - ${c} = ${ans.toLatex()}`;
        const line1Zh = `\\text{期望奖金} = ${w1} \\cdot \\frac{${s1}}{6} + ${w2} \\cdot \\frac{${s2}}{6} = ${prize.toLatex()}`;
        return numberProblem({
          prompt: t(
            `A game costs $${c}$ dollars to play. A fair six-sided die is rolled once. If it shows ${listEn(big)}, the player wins $${w1}$ dollars; if it shows ${listEn(small)}, the player wins $${w2}$ dollars; otherwise the player wins nothing. Let $X$ be the player's net gain in dollars (prize minus cost). Find $E(X)$.${simplest.en}`,
            `玩一局游戏需要 $${c}$ 元。掷一次均匀的六面骰子：掷出 ${listZh(big)} 点赢得 $${w1}$ 元；掷出 ${listZh(small)} 点赢得 $${w2}$ 元；否则什么也赢不到。设 $X$ 为玩家的净收益（奖金减去费用，单位：元）。求 $E(X)$。${simplest["zh-CN"]}`,
          ),
          answer: ans,
          mistakes: distinct([
            why(
              prize,
              `This is the expected prize; the cost of $${c}$ dollars is not subtracted.`,
              `这是期望奖金，没有减去费用 $${c}$ 元。`,
            ),
            why(
              Q.of(w1 + w2, 6).sub(Q.of(c)),
              `This gives each prize probability $\\frac{1}{6}$, but the first prize comes from $${s1}$ faces and the second from $${s2}$.`,
              `这把每种奖金的概率都当成 $\\frac{1}{6}$，但第一种奖金对应 $${s1}$ 个面，第二种对应 $${s2}$ 个面。`,
            ),
            why(
              Q.of(w1 + w2, 2).sub(Q.of(c)),
              `This averages the two prizes as if each came half the time, ignoring the faces that win nothing.`,
              `这把两种奖金当成各占一半来平均，忽略了什么也赢不到的那些面。`,
            ),
            why(
              Q.of(s1 * (w1 - c) + s2 * (w2 - c), 6),
              `This subtracts the cost only on winning rolls; the player also pays $${c}$ dollars on the $${6 - s1 - s2}$ losing faces.`,
              `这只在赢的时候减去费用；掷出其余 $${6 - s1 - s2}$ 个面时玩家同样要付 $${c}$ 元。`,
            ),
          ]),
          solution: t(
            `**Step 1: Find the expected prize.** Rolling ${listEn(big)} has probability $\\frac{${s1}}{6}$ and rolling ${listEn(small)} has probability $\\frac{${s2}}{6}$:${steps(line1)}**Step 2: Subtract the cost, paid in every game.**${steps(line2)}**Check.** Over $6$ games the player expects $${s1}$ rolls that win $${w1}$ dollars and $${s2}$ that win $${w2}$ dollars, a total of $${s1 * w1 + s2 * w2}$ dollars, and pays $${6 * c}$ dollars:${steps(`\\frac{${s1 * w1 + s2 * w2} - ${6 * c}}{6} = ${ans.toLatex()}`)}`,
            `**第一步：求期望奖金。**掷出 ${listZh(big)} 点的概率为 $\\frac{${s1}}{6}$，掷出 ${listZh(small)} 点的概率为 $\\frac{${s2}}{6}$：${steps(line1Zh)}**第二步：减去每局都要付的费用。**${steps(line2)}**检验。**玩 $6$ 局，期望有 $${s1}$ 次赢 $${w1}$ 元、$${s2}$ 次赢 $${w2}$ 元，共 $${s1 * w1 + s2 * w2}$ 元，付出 $${6 * c}$ 元：${steps(`\\frac{${s1 * w1 + s2 * w2} - ${6 * c}}{6} = ${ans.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
};

/** theBinomialDistribution covers binomial probabilities, cumulative probabilities, and the mean and variance. */
const theBinomialDistribution: TopicDef = {
  id: "the-binomial-distribution",
  title: t("The Binomial Distribution", "二项分布"),
  summary: t(
    "Compute probabilities for a binomial random variable $X \\sim B(n, p)$ with the formula $\\binom{n}{k}p^k(1 - p)^{n-k}$, combine them for events such as $X \\le 1$ or $X \\ge 1$, and find its mean $np$ and variance $np(1 - p)$.",
    "用公式 $\\binom{n}{k}p^k(1 - p)^{n-k}$ 计算二项随机变量 $X \\sim B(n, p)$ 的概率，把它们组合起来求 $X \\le 1$、$X \\ge 1$ 等事件的概率，并求其均值 $np$ 与方差 $np(1 - p)$。",
  ),
  prerequisites: [
    "combinations",
    "tree-diagrams-for-independent-events",
    "expected-values-of-discrete-random-variables",
    "cumulative-distribution-functions-for-discrete-random-variables",
  ],
  encompasses: [
    { topic: "combinations", weight: 0.3 },
    { topic: "tree-diagrams-for-independent-events", weight: 0.2 },
  ],
  xp: 20,
  standards: ["CCSS.HSS.MD.A.3", "CCSS.HSS.MD.A.4"],
  intro: t(
    `A fair coin is tossed $3$ times. Exactly two heads happen in three orders, HHT, HTH and THH, and each order has probability $\\frac{1}{2} \\cdot \\frac{1}{2} \\cdot \\frac{1}{2} = \\frac{1}{8}$, so $P(\\text{two heads}) = \\frac{3}{8}$.

Check: the $8$ equally likely outcomes HHH, HHT, HTH, HTT, THH, THT, TTH, TTT contain exactly two heads in $3$ of them.

In this lesson we count the orders with $\\binom{n}{k}$ to get the binomial formula, combine its values for events such as "at least one", and find the mean and variance of the number of successes.`,
    `把一枚均匀硬币抛 $3$ 次。恰好两次正面有三种顺序：正正反、正反正、反正正，每种顺序的概率都是 $\\frac{1}{2} \\cdot \\frac{1}{2} \\cdot \\frac{1}{2} = \\frac{1}{8}$，所以 $P(\\text{两次正面}) = \\frac{3}{8}$。

检验：$8$ 个等可能的结果正正正、正正反、正反正、正反反、反正正、反正反、反反正、反反反中，恰有 $3$ 个含两次正面。

本课用 $\\binom{n}{k}$ 数出顺序的种数，得到二项分布的公式，把它的值组合起来求“至少一次”等事件的概率，并求成功次数的均值与方差。`,
  ),
  knowledgePoints: [
    {
      id: "binomial-probabilities",
      keyPrerequisites: ["combinations"],
      title: t("Binomial probabilities", "二项分布的概率"),
      explanation: t(
        "Suppose an experiment is repeated $n$ times, the trials are independent, and each trial is a success with the same probability $p$. The number of successes $X$ has the **binomial distribution**, written $X \\sim B(n, p)$, and\n\n$$P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k}, \\qquad k = 0, 1, \\ldots, n.$$\n\nEach particular order of $k$ successes and $n - k$ failures has probability $p^k(1 - p)^{n - k}$, and there are $\\binom{n}{k}$ such orders. For $X \\sim B\\left(4, \\frac{1}{3}\\right)$:\n\n$$P(X = 2) = \\binom{4}{2}\\left(\\frac{1}{3}\\right)^2\\left(\\frac{2}{3}\\right)^2 = 6 \\cdot \\frac{1}{9} \\cdot \\frac{4}{9} = \\frac{8}{27}.$$\n\nCheck: the other values have total probability $P(X = 0) + P(X = 1) + P(X = 3) + P(X = 4) = \\frac{16}{81} + \\frac{32}{81} + \\frac{8}{81} + \\frac{1}{81} = \\frac{57}{81}$, and $1 - \\frac{57}{81} = \\frac{24}{81} = \\frac{8}{27}$.\n\n> **Watch out.** $p^k(1 - p)^{n - k}$ alone is the probability of one particular order; multiply by $\\binom{n}{k}$, and keep the exponent of $1 - p$ equal to the number of failures, $n - k$.",
        "设一个试验重复 $n$ 次，各次试验相互独立，且每次成功的概率都是 $p$。成功的次数 $X$ 服从**二项分布**，记作 $X \\sim B(n, p)$，且\n\n$$P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k}, \\qquad k = 0, 1, \\ldots, n.$$\n\n$k$ 次成功、$n - k$ 次失败的每一种特定顺序的概率都是 $p^k(1 - p)^{n - k}$，而这样的顺序共有 $\\binom{n}{k}$ 种。对 $X \\sim B\\left(4, \\frac{1}{3}\\right)$：\n\n$$P(X = 2) = \\binom{4}{2}\\left(\\frac{1}{3}\\right)^2\\left(\\frac{2}{3}\\right)^2 = 6 \\cdot \\frac{1}{9} \\cdot \\frac{4}{9} = \\frac{8}{27}.$$\n\n检验：其余取值的概率之和为 $P(X = 0) + P(X = 1) + P(X = 3) + P(X = 4) = \\frac{16}{81} + \\frac{32}{81} + \\frac{8}{81} + \\frac{1}{81} = \\frac{57}{81}$，而 $1 - \\frac{57}{81} = \\frac{24}{81} = \\frac{8}{27}$，结果一致。\n\n> **注意。** 单独的 $p^k(1 - p)^{n - k}$ 只是某一种特定顺序的概率，要乘以 $\\binom{n}{k}$；$1 - p$ 的指数等于失败的次数 $n - k$。",
      ),
      generate(rng) {
        const p = rng.pick(FRACTIONS);
        const q = Q.one.sub(p);
        const n = rng.int(3, 6);
        const k = rng.int(1, n - 1);
        const ans = binomP(n, k, p);
        const c = choose(n, k);
        const line = `P(X = ${k}) = ${binomTerm(n, k, p, q)} = ${c} \\cdot ${p.pow(k).toLatex()} \\cdot ${q.pow(n - k).toLatex()} = ${ans.toLatex()}`;
        return numberProblem({
          prompt: t(
            `$X \\sim B\\left(${n}, ${p.toLatex()}\\right)$. Find $P(X = ${k})$.${simplest.en}`,
            `$X \\sim B\\left(${n}, ${p.toLatex()}\\right)$。求 $P(X = ${k})$。${simplest["zh-CN"]}`,
          ),
          answer: ans,
          mistakes: distinct([
            why(
              p.pow(k).mul(q.pow(n - k)),
              `This is the probability of one particular order; there are $\\binom{${n}}{${k}} = ${c}$ orders, so multiply by $${c}$.`,
              `这只是某一种特定顺序的概率；共有 $\\binom{${n}}{${k}} = ${c}$ 种顺序，要乘以 $${c}$。`,
            ),
            why(
              Q.of(c).mul(p.pow(k)),
              `This leaves out the factor $${pw(q, n - k)}$ for the $${n - k}$ failures.`,
              `这漏掉了 $${n - k}$ 次失败对应的因子 $${pw(q, n - k)}$。`,
            ),
            why(
              binomP(n, k, q),
              `This swaps $p$ and $1 - p$: it is the probability of $${k}$ failures, not $${k}$ successes.`,
              `这把 $p$ 与 $1 - p$ 弄反了：它是 $${k}$ 次失败的概率，而不是 $${k}$ 次成功的概率。`,
            ),
            why(
              Q.of(c).mul(p.pow(k)).mul(q),
              `The exponent of $${q.toLatex()}$ is the number of failures, $${n} - ${k} = ${n - k}$, not $1$.`,
              `$${q.toLatex()}$ 的指数是失败的次数 $${n} - ${k} = ${n - k}$，而不是 $1$。`,
            ),
          ]),
          solution: t(
            `**Step 1: Read off the parameters.** Here $n = ${n}$, $k = ${k}$, $p = ${p.toLatex()}$ and $1 - p = ${q.toLatex()}$, with $\\binom{${n}}{${k}} = ${c}$ orders of $${k}$ successes.\n\n**Step 2: Apply the binomial formula.**${steps(line)}**Check.** Work with whole numbers over the common denominator $${p.d}$, writing $p = \\frac{${p.n}}{${p.d}}$ and $1 - p = \\frac{${q.n}}{${q.d}}$:${steps(`\\frac{${c} \\cdot ${p.n}^{${k}} \\cdot ${q.n}^{${n - k}}}{${p.d}^{${n}}} = \\frac{${BigInt(c) * p.n ** BigInt(k) * q.n ** BigInt(n - k)}}{${p.d ** BigInt(n)}} = ${ans.toLatex()}`)}`,
            `**第一步：读出参数。**这里 $n = ${n}$，$k = ${k}$，$p = ${p.toLatex()}$，$1 - p = ${q.toLatex()}$，$${k}$ 次成功的顺序共有 $\\binom{${n}}{${k}} = ${c}$ 种。\n\n**第二步：代入二项分布公式。**${steps(line)}**检验。**用公分母 $${p.d}$ 下的整数来算，$p = \\frac{${p.n}}{${p.d}}$，$1 - p = \\frac{${q.n}}{${q.d}}$：${steps(`\\frac{${c} \\cdot ${p.n}^{${k}} \\cdot ${q.n}^{${n - k}}}{${p.d}^{${n}}} = \\frac{${BigInt(c) * p.n ** BigInt(k) * q.n ** BigInt(n - k)}}{${p.d ** BigInt(n)}} = ${ans.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "cumulative-binomial-probabilities",
      title: t("Cumulative binomial probabilities", "二项分布的累积概率"),
      explanation: t(
        "For an event such as $X \\le 1$, add the probabilities of the values it contains. When the event contains most values, use the complement: $P(X \\ge 1) = 1 - P(X = 0) = 1 - (1 - p)^n$.\n\nFor $X \\sim B\\left(3, \\frac{1}{4}\\right)$:\n\n$$P(X \\le 1) = \\left(\\frac{3}{4}\\right)^3 + 3 \\cdot \\frac{1}{4}\\left(\\frac{3}{4}\\right)^2 = \\frac{27}{64} + \\frac{27}{64} = \\frac{27}{32},$$\n\n$$P(X \\ge 1) = 1 - \\left(\\frac{3}{4}\\right)^3 = \\frac{37}{64}.$$\n\nCheck: with $P(X = 2) = \\frac{9}{64}$ and $P(X = 3) = \\frac{1}{64}$, the other way round gives $1 - \\frac{9}{64} - \\frac{1}{64} = \\frac{27}{32}$ and $\\frac{27}{64} + \\frac{9}{64} + \\frac{1}{64} = \\frac{37}{64}$.\n\n> **Watch out.** Decide first which values the event contains: $X \\ge 1$ leaves out only $X = 0$, so it is $1 - P(X = 0)$, not $P(X = 0)$ and not $1 - P(X = n)$.",
        "对于 $X \\le 1$ 这样的事件，把它包含的各个取值的概率相加。当事件包含大多数取值时，用对立事件：$P(X \\ge 1) = 1 - P(X = 0) = 1 - (1 - p)^n$。\n\n对 $X \\sim B\\left(3, \\frac{1}{4}\\right)$：\n\n$$P(X \\le 1) = \\left(\\frac{3}{4}\\right)^3 + 3 \\cdot \\frac{1}{4}\\left(\\frac{3}{4}\\right)^2 = \\frac{27}{64} + \\frac{27}{64} = \\frac{27}{32},$$\n\n$$P(X \\ge 1) = 1 - \\left(\\frac{3}{4}\\right)^3 = \\frac{37}{64}.$$\n\n检验：$P(X = 2) = \\frac{9}{64}$，$P(X = 3) = \\frac{1}{64}$，换一种算法得 $1 - \\frac{9}{64} - \\frac{1}{64} = \\frac{27}{32}$，以及 $\\frac{27}{64} + \\frac{9}{64} + \\frac{1}{64} = \\frac{37}{64}$。\n\n> **注意。** 先弄清事件包含哪些取值：$X \\ge 1$ 只不包含 $X = 0$，所以它等于 $1 - P(X = 0)$，既不是 $P(X = 0)$，也不是 $1 - P(X = n)$。",
      ),
      generate(rng) {
        const p = rng.pick(FRACTIONS);
        const q = Q.one.sub(p);
        const n = rng.int(3, 5);
        const type = rng.int(0, 3);
        const p0 = q.pow(n);
        const p1 = binomP(n, 1, p);
        const pn = p.pow(n);
        const pn1 = binomP(n, n - 1, p);
        const P = (k: number) => binomP(n, k, p);
        const all = range(0, n + 1);
        const included = [[0, 1], range(1, n), [n - 1, n], range(0, n)][type]!;
        const rest = all.filter((k) => !included.includes(k));
        const sumOf = (ks: readonly number[]) => ks.reduce((a, k) => a.add(P(k)), Q.zero);
        const listOf = (ks: readonly number[]) => ks.map((k) => P(k).toLatex()).join(" + ");
        const values = (ks: readonly number[]) => ks.map((k) => `$${k}$`).join(", ");
        let ev: string;
        let ans: Q;
        let ms: Mistake[];
        let lines: string[];
        let added: boolean;
        if (type === 0) {
          ev = "X \\le 1";
          ans = p0.add(p1);
          added = true;
          ms = [
            why(p0, "This is $P(X = 0)$ only; $X \\le 1$ also includes $X = 1$.", "这只是 $P(X = 0)$；$X \\le 1$ 还包括 $X = 1$。"),
            why(p1, "This is $P(X = 1)$ only; $X \\le 1$ also includes $X = 0$.", "这只是 $P(X = 1)$；$X \\le 1$ 还包括 $X = 0$。"),
            why(
              Q.one.sub(ans),
              "This is the probability of the complement, $X \\ge 2$, not of $X \\le 1$.",
              "这是对立事件 $X \\ge 2$ 的概率，不是 $X \\le 1$ 的概率。",
            ),
          ];
          lines = [
            `P(X \\le 1) = P(X = 0) + P(X = 1) = ${pw(q, n)} + ${n} \\cdot ${p.toLatex()} \\cdot ${pw(q, n - 1)}`,
            `= ${p0.toLatex()} + ${p1.toLatex()} = ${ans.toLatex()}`,
          ];
        } else if (type === 1) {
          ev = "X \\ge 1";
          ans = Q.one.sub(p0);
          added = false;
          ms = [
            why(p0, "This is $P(X = 0)$, the complement; subtract it from $1$.", "这是对立事件的概率 $P(X = 0)$，要用 $1$ 减去它。"),
            why(
              Q.one.sub(pn),
              `This subtracts $P(X = ${n})$, but the value left out of $X \\ge 1$ is $X = 0$.`,
              `这减去的是 $P(X = ${n})$，但 $X \\ge 1$ 不包含的取值是 $X = 0$。`,
            ),
            why(
              p1,
              "This is $P(X = 1)$, exactly one success; at least one also allows more.",
              "这是恰好一次成功的概率 $P(X = 1)$；“至少一次”还包括更多次。",
            ),
          ];
          lines = [`P(X \\ge 1) = 1 - P(X = 0) = 1 - ${pw(q, n)} = 1 - ${p0.toLatex()} = ${ans.toLatex()}`];
        } else if (type === 2) {
          ev = `X \\ge ${n - 1}`;
          ans = pn1.add(pn);
          added = true;
          ms = [
            why(
              pn,
              `This is $P(X = ${n})$ only; $X \\ge ${n - 1}$ also includes $X = ${n - 1}$.`,
              `这只是 $P(X = ${n})$；$X \\ge ${n - 1}$ 还包括 $X = ${n - 1}$。`,
            ),
            why(
              pn1,
              `This is $P(X = ${n - 1})$ only; $X \\ge ${n - 1}$ also includes $X = ${n}$.`,
              `这只是 $P(X = ${n - 1})$；$X \\ge ${n - 1}$ 还包括 $X = ${n}$。`,
            ),
            why(Q.one.sub(ans), `This is the probability of the complement, $X \\le ${n - 2}$.`, `这是对立事件 $X \\le ${n - 2}$ 的概率。`),
          ];
          lines = [
            `P(X \\ge ${n - 1}) = P(X = ${n - 1}) + P(X = ${n}) = ${n} \\cdot ${pw(p, n - 1)} \\cdot ${q.toLatex()} + ${pw(p, n)}`,
            `= ${pn1.toLatex()} + ${pn.toLatex()} = ${ans.toLatex()}`,
          ];
        } else {
          ev = `X \\le ${n - 1}`;
          ans = Q.one.sub(pn);
          added = false;
          ms = [
            why(pn, `This is $P(X = ${n})$, the complement; subtract it from $1$.`, `这是对立事件的概率 $P(X = ${n})$，要用 $1$ 减去它。`),
            why(
              Q.one.sub(p0),
              `This subtracts $P(X = 0)$, but the value left out of $X \\le ${n - 1}$ is $X = ${n}$.`,
              `这减去的是 $P(X = 0)$，但 $X \\le ${n - 1}$ 不包含的取值是 $X = ${n}$。`,
            ),
            why(
              Q.one.sub(pn1),
              `This subtracts $P(X = ${n - 1})$, which is part of $X \\le ${n - 1}$; the value left out is $X = ${n}$.`,
              `这减去了 $P(X = ${n - 1})$，而它属于 $X \\le ${n - 1}$；不包含的取值是 $X = ${n}$。`,
            ),
          ];
          lines = [`P(X \\le ${n - 1}) = 1 - P(X = ${n}) = 1 - ${pw(p, n)} = 1 - ${pn.toLatex()} = ${ans.toLatex()}`];
        }
        const plan = added
          ? t(
              `The event contains the values ${values(included)} only, so add their probabilities.`,
              `该事件包含取值 ${values(included)}，所以直接把这些概率相加。`,
            )
          : t(
              `The event contains ${included.length} of the ${n + 1} values and leaves out only ${values(rest)}, so subtract the complement from $1$.`,
              `该事件包含 ${n + 1} 个取值中的 ${included.length} 个，只不包含 ${values(rest)}，所以用 $1$ 减去对立事件的概率。`,
            );
        const check = added
          ? steps(`1 - \\left(${listOf(rest)}\\right) = 1 - ${sumOf(rest).toLatex()} = ${ans.toLatex()}`)
          : steps(`${listOf(included)} = ${ans.toLatex()}`);
        return numberProblem({
          prompt: t(
            `$X \\sim B\\left(${n}, ${p.toLatex()}\\right)$. Find $P(${ev})$.${simplest.en}`,
            `$X \\sim B\\left(${n}, ${p.toLatex()}\\right)$。求 $P(${ev})$。${simplest["zh-CN"]}`,
          ),
          answer: ans,
          mistakes: distinct(ms),
          solution: t(
            `**Step 1: Choose the shorter way.** ${plan.en}\n\n**Step 2: Compute.**${steps(...lines)}**Check.** ${added ? "Subtract the other values from $1$ instead:" : "Add the probabilities of the values in the event instead:"}${check}`,
            `**第一步：选择较简便的算法。**${plan["zh-CN"]}\n\n**第二步：计算。**${steps(...lines)}**检验。**${added ? "改用 $1$ 减去其余取值的概率：" : "改为把事件中各取值的概率相加："}${check}`,
          ),
        });
      },
    },
    {
      id: "mean-and-variance-of-a-binomial-distribution",
      title: t("Mean and variance", "均值与方差"),
      explanation: t(
        "If $X \\sim B(n, p)$, then\n\n$$E(X) = np, \\qquad \\operatorname{Var}(X) = np(1 - p).$$\n\nThe mean says that a fraction $p$ of the $n$ trials succeed on average; the variance measures the spread around it, and the standard deviation is $\\sqrt{np(1 - p)}$. For $X \\sim B(40, 0.3)$: $E(X) = 40 \\cdot 0.3 = 12$ and $\\operatorname{Var}(X) = 40 \\cdot 0.3 \\cdot 0.7 = 8.4$.\n\nCheck: the expected number of failures is $40 \\cdot 0.7 = 28$, and $12 + 28 = 40$; the variance is also the mean times $1 - p$, $12 \\cdot 0.7 = 8.4$.\n\n> **Watch out.** The variance multiplies by $1 - p$, not by $p$ again, and it is not the standard deviation: here $\\sigma = \\sqrt{8.4} \\approx 2.9$.",
        "若 $X \\sim B(n, p)$，则\n\n$$E(X) = np, \\qquad \\operatorname{Var}(X) = np(1 - p).$$\n\n均值表示平均有比例 $p$ 的试验成功；方差度量围绕均值的离散程度，标准差为 $\\sqrt{np(1 - p)}$。对 $X \\sim B(40, 0.3)$：$E(X) = 40 \\cdot 0.3 = 12$，$\\operatorname{Var}(X) = 40 \\cdot 0.3 \\cdot 0.7 = 8.4$。\n\n检验：失败次数的期望为 $40 \\cdot 0.7 = 28$，且 $12 + 28 = 40$；方差也等于均值乘以 $1 - p$，即 $12 \\cdot 0.7 = 8.4$。\n\n> **注意。** 方差乘的是 $1 - p$，而不是再乘一次 $p$；方差也不是标准差：这里 $\\sigma = \\sqrt{8.4} \\approx 2.9$。",
      ),
      generate(rng) {
        const r = rng.pick([10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90]);
        const p = Q.of(r, 100);
        const q = Q.one.sub(p);
        const n = rng.int(8, 60);
        const mean = p.mul(Q.of(n));
        const v = mean.mul(q);
        const fails = q.mul(Q.of(n));
        const ask = rng.int(0, 2);
        const dist = `X \\sim B(${n}, ${dec(p)})`;
        const read = t(
          `**Step 1: Read off the parameters.** Here $n = ${n}$ and $p = ${dec(p)}$, so $1 - p = ${dec(q)}$.\n\n`,
          `**第一步：读出参数。**这里 $n = ${n}$，$p = ${dec(p)}$，所以 $1 - p = ${dec(q)}$。\n\n`,
        );
        if (ask === 0) {
          const line = `E(X) = np = ${n} \\cdot ${dec(p)} = ${dec(mean)}`;
          const check = steps(`${n} - ${dec(fails)} = ${dec(mean)}`);
          return numberProblem({
            prompt: t(`$${dist}$. Find $E(X)$.`, `$${dist}$。求 $E(X)$。`),
            answer: mean,
            mistakes: distinct([
              why(v, "This is the variance $np(1 - p)$, not the mean $np$.", "这是方差 $np(1 - p)$，不是均值 $np$。"),
              why(
                fails,
                `This multiplies by $1 - p = ${dec(q)}$, which gives the expected number of failures.`,
                `这乘的是 $1 - p = ${dec(q)}$，得到的是失败次数的期望。`,
              ),
              why(Q.of(n, 2), "This takes half of the trials, as if $p$ were $0.5$.", "这取了试验次数的一半，好像 $p$ 等于 $0.5$。"),
            ]),
            solution: t(
              `${read.en}**Step 2: Multiply.**${steps(line)}**Check.** The expected number of failures is $${n} \\cdot ${dec(q)} = ${dec(fails)}$, and successes and failures make up all $${n}$ trials:${check}`,
              `${read["zh-CN"]}**第二步：相乘。**${steps(line)}**检验。**失败次数的期望为 $${n} \\cdot ${dec(q)} = ${dec(fails)}$，成功与失败合起来是全部 $${n}$ 次试验：${check}`,
            ),
          });
        }
        if (ask === 1) {
          const line = `\\operatorname{Var}(X) = np(1 - p) = ${n} \\cdot ${dec(p)} \\cdot ${dec(q)} = ${dec(v)}`;
          const check = steps(`np = ${dec(mean)}, \\qquad ${dec(mean)} \\cdot ${dec(q)} = ${dec(v)}`);
          return numberProblem({
            prompt: t(`$${dist}$. Find $\\operatorname{Var}(X)$.`, `$${dist}$。求 $\\operatorname{Var}(X)$。`),
            answer: v,
            mistakes: distinct([
              why(mean, "This is the mean $np$; the variance has the extra factor $1 - p$.", "这是均值 $np$；方差还要乘以 $1 - p$。"),
              why(
                mean.mul(p),
                `This multiplies by $p$ twice; the second factor is $1 - p = ${dec(q)}$.`,
                `这乘了两次 $p$；第二个因子应是 $1 - p = ${dec(q)}$。`,
              ),
              why(
                fails,
                "This is $n(1 - p)$, the expected number of failures; the factor $p$ is missing.",
                "这是 $n(1 - p)$，即失败次数的期望，漏掉了因子 $p$。",
              ),
            ]),
            solution: t(
              `${read.en}**Step 2: Multiply $n$, $p$ and $1 - p$.**${steps(line)}**Check.** Find the mean first and multiply it by $1 - p$:${check}`,
              `${read["zh-CN"]}**第二步：把 $n$、$p$ 与 $1 - p$ 相乘。**${steps(line)}**检验。**先求均值，再乘以 $1 - p$：${check}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `$X \\sim B(n, ${dec(p)})$ and $E(X) = ${dec(mean)}$. Find $n$.`,
            `$X \\sim B(n, ${dec(p)})$，且 $E(X) = ${dec(mean)}$。求 $n$。`,
          ),
          answer: n,
          mistakes: distinct([
            why(
              mean.mul(p),
              `This multiplies $E(X)$ by $p$; since $E(X) = np$, divide by $p$ instead.`,
              `这用 $E(X)$ 乘以 $p$；因为 $E(X) = np$，应当除以 $p$。`,
            ),
            why(
              mean.div(q),
              `This divides by $1 - p = ${dec(q)}$; the mean is $np$, so divide by $p = ${dec(p)}$.`,
              `这除以的是 $1 - p = ${dec(q)}$；均值是 $np$，应当除以 $p = ${dec(p)}$。`,
            ),
            why(
              mean.add(p),
              "This adds $p$ to $E(X)$; $n$ and $p$ are multiplied in $E(X) = np$, so divide.",
              "这把 $p$ 加到了 $E(X)$ 上；在 $E(X) = np$ 中 $n$ 与 $p$ 是相乘的，应当相除。",
            ),
          ]),
          solution: t(
            `**Step 1: Write the mean in terms of $n$.**${steps(`E(X) = np = ${dec(p)}n = ${dec(mean)}`)}**Step 2: Divide by $p$.**${steps(`n = \\frac{${dec(mean)}}{${dec(p)}} = ${n}`)}**Check.** With $n = ${n}$:${steps(`np = ${n} \\cdot ${dec(p)} = ${dec(mean)}`)}`,
            `**第一步：用 $n$ 表示均值。**${steps(`E(X) = np = ${dec(p)}n = ${dec(mean)}`)}**第二步：除以 $p$。**${steps(`n = \\frac{${dec(mean)}}{${dec(p)}} = ${n}`)}**检验。**取 $n = ${n}$：${steps(`np = ${n} \\cdot ${dec(p)} = ${dec(mean)}`)}`,
          ),
        });
      },
    },
  ],
};

/** BinContext is a situation modeled by a binomial distribution. */
interface BinContext {
  readonly setup: Text;
  readonly n: number;
  readonly p: Q;
  readonly decimal: boolean;
  /** other is another number in the situation that a careless reader may take for n. */
  readonly other: number;
}

/** binContext picks a situation modeled by X ~ B(n, p) with n trials between minN and maxN. */
function binContext(rng: Rng, minN: number, maxN: number): BinContext {
  const n = rng.int(minN, maxN);
  const kind = rng.int(0, 3);
  if (kind === 0) {
    const [en, zh, p] = rng.pick([
      ["a six", "六点", Q.of(1, 6)],
      ["an even number", "偶数点", Q.of(1, 2)],
      ["a number greater than 4", "大于 4 的点数", Q.of(1, 3)],
      ["a number less than 5", "小于 5 的点数", Q.of(2, 3)],
    ] as const);
    return {
      setup: t(
        `A fair six-sided die is rolled $${n}$ times. Let $X$ be the number of rolls that show ${en}.`,
        `把一颗均匀的六面骰子掷 $${n}$ 次，设 $X$ 为掷出${zh}的次数。`,
      ),
      n,
      p,
      decimal: false,
      other: 6,
    };
  }
  if (kind === 1) {
    const m = rng.int(3, 5);
    const right = rng.bool();
    return {
      setup: t(
        `A quiz has $${n}$ multiple-choice questions, each with $${m}$ options of which exactly one is correct. A student guesses every answer at random. Let $X$ be the number of questions answered ${right ? "correctly" : "incorrectly"}.`,
        `一份测验有 $${n}$ 道选择题，每题有 $${m}$ 个选项，其中恰有一个正确。某学生每题都随机猜一个答案。设 $X$ 为${right ? "答对" : "答错"}的题数。`,
      ),
      n,
      p: right ? Q.of(1, m) : Q.of(m - 1, m),
      decimal: false,
      other: m,
    };
  }
  const r = rng.pick([60, 70, 75, 80, 90]);
  const made = rng.bool();
  if (kind === 2) {
    return {
      setup: t(
        `A basketball player makes each free throw with probability $${h(r)}$, independently of the other throws. She takes $${n}$ free throws. Let $X$ be the number of throws she ${made ? "makes" : "misses"}.`,
        `某篮球运动员每次罚球命中的概率为 $${h(r)}$，各次罚球相互独立。她罚球 $${n}$ 次。设 $X$ 为她${made ? "命中" : "未命中"}的次数。`,
      ),
      n,
      p: made ? Q.of(r, 100) : Q.of(100 - r, 100),
      decimal: true,
      other: r,
    };
  }
  return {
    setup: t(
      `Each seed in a packet germinates with probability $${h(r)}$, independently of the others. $${n}$ seeds are planted. Let $X$ be the number of seeds that ${made ? "germinate" : "do not germinate"}.`,
      `某包种子中每粒种子发芽的概率为 $${h(r)}$，彼此独立。种下 $${n}$ 粒种子，设 $X$ 为${made ? "发芽" : "不发芽"}的种子数。`,
    ),
    n,
    p: made ? Q.of(r, 100) : Q.of(100 - r, 100),
    decimal: true,
    other: r,
  };
}

/** modelingWithTheBinomialDistribution applies the binomial distribution to situations. */
const modelingWithTheBinomialDistribution: TopicDef = {
  id: "modeling-with-the-binomial-distribution",
  title: t("Modeling With the Binomial Distribution", "用二项分布建模"),
  summary: t(
    "Recognize situations that a binomial distribution models, identify n and p, and use the model to compute probabilities and expected counts.",
    "识别可以用二项分布建模的情境，确定 n 和 p，并用模型计算概率与期望个数。",
  ),
  prerequisites: ["the-binomial-distribution"],
  encompasses: [{ topic: "the-binomial-distribution", weight: 0.6 }],
  xp: 18,
  standards: ["CCSS.HSS.MD.A.3", "CCSS.HSS.MD.B.6"],
  intro: t(
    `A student guesses all $4$ answers of a quiz in which each question has $4$ options. Each guess is right with probability $\\frac{1}{4}$, independently, so the number right is $X \\sim B\\left(4, \\frac{1}{4}\\right)$, and the chance of getting every question wrong is $P(X = 0) = \\left(\\frac{3}{4}\\right)^4 = \\frac{81}{256}$.

Check: of the $4^4 = 256$ equally likely ways to answer, the all-wrong ones choose one of $3$ wrong options each time, $3^4 = 81$ ways.

In this lesson we recognize when a count is binomial, read $n$ and $p$ from the story, and use the model for probabilities and expected counts.`,
    `某学生在一份测验中把 $4$ 道题全部靠猜作答，每题有 $4$ 个选项。每次猜对的概率为 $\\frac{1}{4}$，且相互独立，所以答对的题数 $X \\sim B\\left(4, \\frac{1}{4}\\right)$，全部答错的概率为 $P(X = 0) = \\left(\\frac{3}{4}\\right)^4 = \\frac{81}{256}$。

检验：在 $4^4 = 256$ 种等可能的作答方式中，全错的方式每题从 $3$ 个错误选项中选一个，共 $3^4 = 81$ 种。

本课学习判断一个计数何时服从二项分布，从题意中读出 $n$ 和 $p$，并用这个模型求概率和期望个数。`,
  ),
  knowledgePoints: [
    {
      id: "identifying-a-binomial-model",
      title: t("Identifying the model", "确定模型"),
      explanation: t(
        'A count $X$ is binomial when:\n\n- there is a fixed number $n$ of trials;\n- each trial has two outcomes, success and failure;\n- the trials are independent;\n- every trial succeeds with the same probability $p$.\n\nThen $X \\sim B(n, p)$. Decide carefully what counts as a success: if a die is rolled $10$ times and $X$ counts the rolls that are **not** a six, a success is "not a six" and $X \\sim B\\left(10, \\frac{5}{6}\\right)$.\n\nCheck: the sixes number $10 - X$, which is $B\\left(10, \\frac{1}{6}\\right)$, and the two success probabilities add up to $\\frac{5}{6} + \\frac{1}{6} = 1$.\n\n> **Watch out.** The first parameter is the number of trials, not another number in the story such as the number of faces or options, and the second is the probability of what $X$ counts, not of its opposite.',
        "当满足以下条件时，计数 $X$ 服从二项分布：\n\n- 试验次数 $n$ 固定；\n- 每次试验只有成功与失败两种结果；\n- 各次试验相互独立；\n- 每次试验成功的概率都是同一个 $p$。\n\n这时 $X \\sim B(n, p)$。要仔细判断什么算“成功”：若掷骰子 $10$ 次，$X$ 统计**不是**六点的次数，那么“成功”就是“不是六点”，$X \\sim B\\left(10, \\frac{5}{6}\\right)$。\n\n检验：六点的次数是 $10 - X$，服从 $B\\left(10, \\frac{1}{6}\\right)$，两个成功概率之和为 $\\frac{5}{6} + \\frac{1}{6} = 1$。\n\n> **注意。** 第一个参数是试验次数，而不是题目中的其他数，例如骰子的面数或选项个数；第二个参数是 $X$ 所计数结果的概率，而不是相反结果的概率。",
      ),
      generate(rng) {
        const c = binContext(rng, 4, 20);
        const B = (n: number, p: Q) =>
          t(`$X \\sim B\\left(${n}, ${pd(p, c.decimal)}\\right)$`, `$X \\sim B\\left(${n}, ${pd(p, c.decimal)}\\right)$`);
        const half = Q.of(1, 2);
        return reasoned(
          oneOf(
            rng,
            t(`${c.setup.en} Which distribution models $X$?`, `${c.setup["zh-CN"]}哪个分布是 $X$ 的模型？`),
            B(c.n, c.p),
            [B(c.n, Q.one.sub(c.p)), B(c.other, c.p), B(c.n, c.p.eq(half) ? Q.of(1, 3) : half)],
            t(
              `**Step 1: Count the trials.** There are $n = ${c.n}$ independent trials, each with two outcomes: counted by $X$ or not.\n\n**Step 2: Find the probability of what $X$ counts.** A success is an outcome that $X$ counts, and it has probability $p = ${pd(c.p, c.decimal)}$ on every trial. So $X \\sim B\\left(${c.n}, ${pd(c.p, c.decimal)}\\right)$.\n\n**Check.** The outcome $X$ does not count has probability $1 - ${pd(c.p, c.decimal)} = ${pd(Q.one.sub(c.p), c.decimal)}$, and the number of those outcomes is $${c.n} - X$, which is $B\\left(${c.n}, ${pd(Q.one.sub(c.p), c.decimal)}\\right)$; the two counts together use all $${c.n}$ trials.`,
              `**第一步：数出试验次数。**共有 $n = ${c.n}$ 次独立试验，每次只有两种结果：被 $X$ 计入或不被计入。\n\n**第二步：求 $X$ 所计数结果的概率。**“成功”就是被 $X$ 计入的结果，它在每次试验中的概率都是 $p = ${pd(c.p, c.decimal)}$。所以 $X \\sim B\\left(${c.n}, ${pd(c.p, c.decimal)}\\right)$。\n\n**检验。**不被 $X$ 计入的结果的概率为 $1 - ${pd(c.p, c.decimal)} = ${pd(Q.one.sub(c.p), c.decimal)}$，这种结果的次数是 $${c.n} - X$，服从 $B\\left(${c.n}, ${pd(Q.one.sub(c.p), c.decimal)}\\right)$；两种次数合起来正好是全部 $${c.n}$ 次试验。`,
            ),
          ),
          [
            [
              B(c.n, Q.one.sub(c.p)).en,
              "This is the chance of the outcome $X$ does not count: the probability belongs to what $X$ counts.",
              "这是 $X$ 不计数的结果的概率：参数应是 $X$ 所计数结果的概率。",
            ],
            [
              B(c.other, c.p).en,
              "The first number must be how many trials there are, and this is a different number.",
              "第一个数必须是试验次数，而这是另一个数。",
            ],
            [
              B(c.n, c.p.eq(half) ? Q.of(1, 3) : half).en,
              "The probability has to come from the story, and this is not the one it gives.",
              "概率要从题目中得到，而这不是题目给出的概率。",
            ],
          ],
        );
      },
    },
    {
      id: "binomial-probabilities-in-context",
      title: t("Probabilities in context", "情境中的概率"),
      explanation: t(
        'Once the model $X \\sim B(n, p)$ is identified, translate the question into an event for $X$ and use the binomial formula. "At least one" is $X \\ge 1$, best found as $1 - P(X = 0)$; "at most one" is $X \\le 1$.\n\nA fair coin is tossed $5$ times; $X$, the number of heads, is $B\\left(5, \\frac{1}{2}\\right)$. The probability of at least one head is $1 - \\left(\\frac{1}{2}\\right)^5 = \\frac{31}{32}$.\n\nCheck: of the $2^5 = 32$ equally likely sequences of heads and tails, only TTTTT has no head, which leaves $31$.\n\n> **Watch out.** $P(X = 0)$ is the chance of no successes at all; "at least one" is what remains, $1 - P(X = 0)$, not $P(X = 0)$ itself and not $P(X = 1)$.',
        "确定模型 $X \\sim B(n, p)$ 后，把问题翻译成关于 $X$ 的事件，再用二项分布公式。“至少一次”是 $X \\ge 1$，最好用 $1 - P(X = 0)$ 求；“至多一次”是 $X \\le 1$。\n\n把一枚均匀硬币抛 $5$ 次，正面次数 $X \\sim B\\left(5, \\frac{1}{2}\\right)$。至少出现一次正面的概率为 $1 - \\left(\\frac{1}{2}\\right)^5 = \\frac{31}{32}$。\n\n检验：正反面的 $2^5 = 32$ 种等可能序列中，只有“反反反反反”没有正面，剩下 $31$ 种。\n\n> **注意。** $P(X = 0)$ 是一次成功也没有的概率；“至少一次”是剩下的部分 $1 - P(X = 0)$，既不是 $P(X = 0)$ 本身，也不是 $P(X = 1)$。",
      ),
      generate(rng) {
        const c = binContext(rng, 3, 5);
        const { n, p } = c;
        const q = Q.one.sub(p);
        const pl = c.decimal ? pwd : pw;
        const type = rng.int(0, 2);
        const k = rng.int(1, n - 1);
        const P = (j: number) => binomP(n, j, p);
        const show = (v: Q) => pd(v, c.decimal);
        const model = `X \\sim B\\left(${n}, ${show(p)}\\right)`;
        let ev: string;
        let ans: Q;
        let ms: Mistake[];
        let line: string;
        let check: string;
        let checkEn: string;
        let checkZh: string;
        if (type === 0) {
          ev = `X = ${k}`;
          ans = P(k);
          ms = [
            why(
              p.pow(k).mul(q.pow(n - k)),
              `This is the probability of one particular order; multiply by $\\binom{${n}}{${k}} = ${choose(n, k)}$.`,
              `这只是某一种特定顺序的概率，要乘以 $\\binom{${n}}{${k}} = ${choose(n, k)}$。`,
            ),
            why(
              binomP(n, k, q),
              `This uses $${show(q)}$, the probability of the outcome $X$ does not count, as $p$.`,
              `这把 $X$ 不计数的结果的概率 $${show(q)}$ 当成了 $p$。`,
            ),
          ];
          line = `P(X = ${k}) = ${binomTerm(n, k, p, q, pl)} = ${show(ans)}`;
          checkEn = `Count the other outcomes instead: $X = ${k}$ means exactly $${n - k}$ of the other kind, each with probability $${show(q)}$:`;
          checkZh = `改数另一种结果：$X = ${k}$ 就是另一种结果恰好出现 $${n - k}$ 次，每次概率为 $${show(q)}$：`;
          check = steps(`${binomTerm(n, n - k, q, p, pl)} = ${show(ans)}`);
        } else if (type === 1) {
          ev = "X \\ge 1";
          ans = Q.one.sub(q.pow(n));
          ms = [
            why(
              q.pow(n),
              "This is $P(X = 0)$, the complement of at least one; subtract it from $1$.",
              "这是“至少一次”的对立事件的概率 $P(X = 0)$，要用 $1$ 减去它。",
            ),
            why(
              Q.one.sub(p.pow(n)),
              `This subtracts $P(X = ${n})$, but the value left out of $X \\ge 1$ is $X = 0$.`,
              `这减去的是 $P(X = ${n})$，但 $X \\ge 1$ 不包含的取值是 $X = 0$。`,
            ),
            why(
              P(1),
              "This is $P(X = 1)$, exactly one; at least one also allows more.",
              "这是恰好一次的概率 $P(X = 1)$；“至少一次”还包括更多次。",
            ),
          ];
          line = `P(X \\ge 1) = 1 - P(X = 0) = 1 - ${pl(q, n)} = ${show(ans)}`;
          checkEn = "Add the probabilities of the values in the event instead:";
          checkZh = "改为把事件中各取值的概率相加：";
          check = steps(
            `${range(1, n)
              .map((j) => show(P(j)))
              .join(" + ")} = ${show(ans)}`,
          );
        } else {
          ev = "X \\le 1";
          ans = q.pow(n).add(P(1));
          ms = [
            why(q.pow(n), "This is $P(X = 0)$ only; at most one also includes $X = 1$.", "这只是 $P(X = 0)$；“至多一次”还包括 $X = 1$。"),
            why(P(1), "This is $P(X = 1)$ only; at most one also includes $X = 0$.", "这只是 $P(X = 1)$；“至多一次”还包括 $X = 0$。"),
            why(Q.one.sub(ans), "This is the probability of the complement, $X \\ge 2$.", "这是对立事件 $X \\ge 2$ 的概率。"),
          ];
          line = `P(X \\le 1) = ${pl(q, n)} + ${binomTerm(n, 1, p, q, pl)} = ${show(ans)}`;
          const rest = range(2, n - 1);
          checkEn = "Subtract the other values from $1$ instead:";
          checkZh = "改用 $1$ 减去其余取值的概率：";
          check = steps(
            `1 - \\left(${rest.map((j) => show(P(j))).join(" + ")}\\right) = 1 - ${show(rest.reduce((a, j) => a.add(P(j)), Q.zero))} = ${show(ans)}`,
          );
        }
        const ask = c.decimal ? asDecimal : simplest;
        return numberProblem({
          prompt: t(`${c.setup.en} Find $P(${ev})$.${ask.en}`, `${c.setup["zh-CN"]}求 $P(${ev})$。${ask["zh-CN"]}`),
          answer: ans,
          ...(c.decimal && { form: "decimal" as const }),
          mistakes: distinct(ms),
          solution: t(
            `**Step 1: Identify the model.** There are $${n}$ independent trials, and the outcome $X$ counts has probability $${show(p)}$ each time, so $${model}$.\n\n**Step 2: Compute $P(${ev})$.**${steps(line)}**Check.** ${checkEn}${check}`,
            `**第一步：确定模型。**共有 $${n}$ 次独立试验，$X$ 所计数的结果每次的概率都是 $${show(p)}$，所以 $${model}$。\n\n**第二步：求 $P(${ev})$。**${steps(line)}**检验。**${checkZh}${check}`,
          ),
        });
      },
    },
    {
      id: "expected-counts-in-context",
      title: t("Expected counts in context", "情境中的期望个数"),
      explanation: t(
        "For a binomial model, the expected number of successes is $np$ and the variance is $np(1 - p)$. If $3\\%$ of the items a machine makes are defective, a sample of $200$ items is expected to contain $200 \\cdot 0.03 = 6$ defective items, with variance $200 \\cdot 0.03 \\cdot 0.97 = 5.82$.\n\nTo expect $m$ successes, the number of trials must satisfy $np = m$, so $n = \\frac{m}{p}$. For example, to expect $6$ defective items, sample $\\frac{6}{0.03} = 200$ items.\n\nCheck: $3\\%$ means $3$ in every $100$, so $200$ items hold $2 \\cdot 3 = 6$ defective ones on average.\n\n> **Watch out.** Write the percentage as a decimal before multiplying: $3\\% = 0.03$, so $200 \\cdot 3 = 600$ is a hundred times too large.",
        "对二项模型，成功的期望次数为 $np$，方差为 $np(1 - p)$。若某机器生产的产品有 $3\\%$ 是次品，则 $200$ 件的样本中期望有 $200 \\cdot 0.03 = 6$ 件次品，方差为 $200 \\cdot 0.03 \\cdot 0.97 = 5.82$。\n\n要期望得到 $m$ 次成功，试验次数须满足 $np = m$，即 $n = \\frac{m}{p}$。例如要期望有 $6$ 件次品，需抽取 $\\frac{6}{0.03} = 200$ 件。\n\n检验：$3\\%$ 表示每 $100$ 件中有 $3$ 件，所以 $200$ 件中平均有 $2 \\cdot 3 = 6$ 件次品。\n\n> **注意。** 先把百分数化成小数再相乘：$3\\% = 0.03$，而 $200 \\cdot 3 = 600$ 大了一百倍。",
      ),
      generate(rng) {
        const ctx = rng.pick([
          {
            en: ["of the items a machine produces are defective", "items", "defective items"],
            zh: ["某机器生产的产品中", "件产品", "次品", "件产品"],
          },
          {
            en: ["of the flights at an airport are delayed", "flights", "delayed flights"],
            zh: ["某机场的航班中", "个航班", "延误航班", "个航班"],
          },
          {
            en: ["of the emails a company receives are spam", "emails", "spam emails"],
            zh: ["某公司收到的邮件中", "封邮件", "垃圾邮件", "封邮件"],
          },
        ]);
        const r = rng.pick([2, 4, 5, 8, 10, 12, 15, 20, 25]);
        const p = Q.of(r, 100);
        const q = Q.one.sub(p);
        const n = 25 * rng.int(2, 20);
        const mean = p.mul(Q.of(n));
        const v = mean.mul(q);
        const ask = rng.int(0, 2);
        const intro = t(
          `Assume that $${r}\\%$ ${ctx.en[0]}, independently of one another.`,
          `假设${ctx.zh[0]}有 $${r}\\%$ 是${ctx.zh[2]}，彼此独立。`,
        );
        const fails = q.mul(Q.of(n));
        const pct = why(
          ask === 2 ? mean.mul(Q.of(r)) : Q.of(n * r),
          ask === 2
            ? `This multiplies by $${r}$ instead of dividing by $${r}\\% = ${dec(p)}$.`
            : `This multiplies by $${r}$ instead of $${r}\\% = ${dec(p)}$: the answer is a hundred times too large.`,
          ask === 2
            ? `这乘以了 $${r}$，而应当除以 $${r}\\% = ${dec(p)}$。`
            : `这乘的是 $${r}$ 而不是 $${r}\\% = ${dec(p)}$：结果大了一百倍。`,
        );
        const model = t(
          `**Step 1: Identify the model.** Each of the $${n}$ ${ctx.en[1]} is one of the ${ctx.en[2]} with probability $${r}\\% = ${dec(p)}$, independently, so the number $X$ of ${ctx.en[2]} is $B(${n}, ${dec(p)})$.\n\n`,
          `**第一步：确定模型。**$${n}$ ${ctx.zh[1]}中的每一个都以 $${r}\\% = ${dec(p)}$ 的概率是${ctx.zh[2]}，彼此独立，所以${ctx.zh[2]}的个数 $X \\sim B(${n}, ${dec(p)})$。\n\n`,
        );
        if (ask === 0) {
          const line = `E(X) = np = ${n} \\cdot ${dec(p)} = ${dec(mean)}`;
          const check = steps(`\\frac{${n}}{100} \\cdot ${r} = ${dec(Q.of(n, 100))} \\cdot ${r} = ${dec(mean)}`);
          return numberProblem({
            prompt: t(
              `${intro.en} In a random sample of $${n}$ ${ctx.en[1]}, how many ${ctx.en[2]} are expected?`,
              `${intro["zh-CN"]}随机抽取 $${n}$ ${ctx.zh[1]}，期望有多少${ctx.zh[2]}？`,
            ),
            answer: mean,
            mistakes: distinct([
              pct,
              why(v, "This is the variance $np(1 - p)$, not the expected number $np$.", "这是方差 $np(1 - p)$，不是期望个数 $np$。"),
              why(
                fails,
                `This multiplies by $1 - p = ${dec(q)}$ and counts the ${ctx.en[1]} that are not ${ctx.en[2]}.`,
                `这乘的是 $1 - p = ${dec(q)}$，算的是不是${ctx.zh[2]}的个数。`,
              ),
            ]),
            solution: t(
              `${model.en}**Step 2: Multiply.**${steps(line)}**Check.** $${r}\\%$ means $${r}$ in every $100$, and $${n}$ is $${dec(Q.of(n, 100))}$ hundreds:${check}`,
              `${model["zh-CN"]}**第二步：相乘。**${steps(line)}**检验。**$${r}\\%$ 表示每 $100$ 个中有 $${r}$ 个，而 $${n}$ 是 $${dec(Q.of(n, 100))}$ 个 $100$：${check}`,
            ),
          });
        }
        if (ask === 1) {
          const line = `\\operatorname{Var}(X) = np(1 - p) = ${n} \\cdot ${dec(p)} \\cdot ${dec(q)} = ${dec(v)}`;
          const check = steps(`E(X) = ${n} \\cdot ${dec(p)} = ${dec(mean)}, \\qquad ${dec(mean)} \\cdot ${dec(q)} = ${dec(v)}`);
          return numberProblem({
            prompt: t(
              `${intro.en} Let $X$ be the number of ${ctx.en[2]} in a random sample of $${n}$ ${ctx.en[1]}. Find $\\operatorname{Var}(X)$.`,
              `${intro["zh-CN"]}设 $X$ 为随机抽取的 $${n}$ ${ctx.zh[1]}中${ctx.zh[2]}的个数。求 $\\operatorname{Var}(X)$。`,
            ),
            answer: v,
            mistakes: distinct([
              why(mean, "This is the mean $np$; the variance has the extra factor $1 - p$.", "这是均值 $np$；方差还要乘以 $1 - p$。"),
              why(
                mean.mul(p),
                `This multiplies by $p$ twice; the second factor is $1 - p = ${dec(q)}$.`,
                `这乘了两次 $p$；第二个因子应是 $1 - p = ${dec(q)}$。`,
              ),
              why(
                fails,
                "This is $n(1 - p)$, the expected number of the other kind; the factor $p$ is missing.",
                "这是 $n(1 - p)$，即另一种结果的期望个数，漏掉了因子 $p$。",
              ),
            ]),
            solution: t(
              `${model.en}**Step 2: Multiply $n$, $p$ and $1 - p$.**${steps(line)}**Check.** Find the mean first and multiply it by $1 - p$:${check}`,
              `${model["zh-CN"]}**第二步：把 $n$、$p$ 与 $1 - p$ 相乘。**${steps(line)}**检验。**先求均值，再乘以 $1 - p$：${check}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `${intro.en} How many ${ctx.en[1]} must be sampled for the expected number of ${ctx.en[2]} to be $${dec(mean)}$?`,
            `${intro["zh-CN"]}要使${ctx.zh[2]}的期望个数为 $${dec(mean)}$，需要抽取多少${ctx.zh[3]}？`,
          ),
          answer: n,
          mistakes: distinct([
            why(
              mean.mul(p),
              `This multiplies the expected number by $${dec(p)}$; since $np = ${dec(mean)}$, divide by $${dec(p)}$.`,
              `这用期望个数乘以 $${dec(p)}$；因为 $np = ${dec(mean)}$，应当除以 $${dec(p)}$。`,
            ),
            pct,
            why(
              mean.div(q),
              `This divides by $1 - p = ${dec(q)}$; the expected number of ${ctx.en[2]} is $np$, so divide by $p = ${dec(p)}$.`,
              `这除以的是 $1 - p = ${dec(q)}$；${ctx.zh[2]}的期望个数是 $np$，应当除以 $p = ${dec(p)}$。`,
            ),
          ]),
          solution: t(
            `**Step 1: Write the expected number in terms of $n$.** With $p = ${r}\\% = ${dec(p)}$, the expected number of ${ctx.en[2]} is $np$:${steps(`${dec(p)}n = ${dec(mean)}`)}**Step 2: Divide by $p$.**${steps(`n = \\frac{${dec(mean)}}{${dec(p)}} = ${n}`)}**Check.** In $${n}$ ${ctx.en[1]}:${steps(`${n} \\cdot ${dec(p)} = ${dec(mean)}`)}`,
            `**第一步：用 $n$ 表示期望个数。**$p = ${r}\\% = ${dec(p)}$，${ctx.zh[2]}的期望个数为 $np$：${steps(`${dec(p)}n = ${dec(mean)}`)}**第二步：除以 $p$。**${steps(`n = \\frac{${dec(mean)}}{${dec(p)}} = ${n}`)}**检验。**在 $${n}$ ${ctx.zh[1]}中：${steps(`${n} \\cdot ${dec(p)} = ${dec(mean)}`)}`,
          ),
        });
      },
    },
  ],
};

/** theGeometricDistribution covers geometric probabilities, tail probabilities, and the mean. */
const theGeometricDistribution: TopicDef = {
  id: "the-geometric-distribution",
  title: t("The Geometric Distribution", "几何分布"),
  summary: t(
    "Compute probabilities for a geometric random variable $X \\sim \\text{Geo}(p)$, the number of independent trials up to and including the first success, including tail probabilities $P(X > k) = (1 - p)^k$, and find its mean $\\frac{1}{p}$.",
    "计算几何随机变量 $X \\sim \\text{Geo}(p)$（独立重复试验中直到第一次成功为止的试验次数）的概率，包括尾部概率 $P(X > k) = (1 - p)^k$，并求其均值 $\\frac{1}{p}$。",
  ),
  prerequisites: ["the-binomial-distribution", "the-sum-of-the-first-n-terms-of-a-geometric-series"],
  encompasses: [{ topic: "tree-diagrams-for-independent-events", weight: 0.2 }],
  xp: 18,
  standards: ["CCSS.HSS.MD.A.3"],
  intro: t(
    `A die is rolled until the first six. The first six comes on the third roll when the first two rolls are not sixes and the third is: $\\frac{5}{6} \\cdot \\frac{5}{6} \\cdot \\frac{1}{6} = \\frac{25}{216}$.

Check: of the $6^3 = 216$ equally likely sequences of three rolls, those of the form "not six, not six, six" number $5 \\cdot 5 \\cdot 1 = 25$.

In this lesson we study the number of trials up to the first success: its probabilities, the chance that it takes more than $k$ trials, and its mean.`,
    `反复掷一颗骰子直到第一次掷出六点。第一个六点出现在第三次，当且仅当前两次都不是六点而第三次是：$\\frac{5}{6} \\cdot \\frac{5}{6} \\cdot \\frac{1}{6} = \\frac{25}{216}$。

检验：连掷三次共有 $6^3 = 216$ 种等可能的序列，其中“非六、非六、六”形式的有 $5 \\cdot 5 \\cdot 1 = 25$ 种。

本课研究直到第一次成功为止的试验次数：它的概率、需要超过 $k$ 次试验的概率，以及它的均值。`,
  ),
  knowledgePoints: [
    {
      id: "geometric-probabilities",
      title: t("Geometric probabilities", "几何分布的概率"),
      explanation: t(
        "Repeat independent trials, each a success with probability $p$, until the first success. The number of trials $X$, counting the successful one, has the **geometric distribution**, $X \\sim \\operatorname{Geo}(p)$. The first success comes on trial $k$ exactly when the first $k - 1$ trials fail and trial $k$ succeeds:\n\n$$P(X = k) = (1 - p)^{k - 1} p, \\qquad k = 1, 2, 3, \\ldots$$\n\nFor $X \\sim \\operatorname{Geo}\\left(\\frac{1}{4}\\right)$: $P(X = 3) = \\left(\\frac{3}{4}\\right)^2 \\cdot \\frac{1}{4} = \\frac{9}{64}$.\n\nCheck: $P(X = 3) = P(X > 2) - P(X > 3) = \\left(\\frac{3}{4}\\right)^2 - \\left(\\frac{3}{4}\\right)^3 = \\frac{36}{64} - \\frac{27}{64} = \\frac{9}{64}$.\n\n> **Watch out.** Only the trials before the success fail, so the exponent is $k - 1$, not $k$; and the failures have probability $1 - p$, not $p$.",
        "重复独立试验，每次成功的概率为 $p$，直到第一次成功为止。试验次数 $X$（包括成功的那一次）服从**几何分布**，$X \\sim \\operatorname{Geo}(p)$。第一次成功恰好出现在第 $k$ 次，当且仅当前 $k - 1$ 次都失败而第 $k$ 次成功：\n\n$$P(X = k) = (1 - p)^{k - 1} p, \\qquad k = 1, 2, 3, \\ldots$$\n\n对 $X \\sim \\operatorname{Geo}\\left(\\frac{1}{4}\\right)$：$P(X = 3) = \\left(\\frac{3}{4}\\right)^2 \\cdot \\frac{1}{4} = \\frac{9}{64}$。\n\n检验：$P(X = 3) = P(X > 2) - P(X > 3) = \\left(\\frac{3}{4}\\right)^2 - \\left(\\frac{3}{4}\\right)^3 = \\frac{36}{64} - \\frac{27}{64} = \\frac{9}{64}$。\n\n> **注意。** 只有成功之前的试验失败，所以指数是 $k - 1$ 而不是 $k$；失败的概率是 $1 - p$，而不是 $p$。",
      ),
      generate(rng) {
        const p = rng.pick(FRACTIONS);
        const q = Q.one.sub(p);
        const k = rng.int(2, 5);
        const ans = q.pow(k - 1).mul(p);
        const line = `P(X = ${k}) = ${pw(q, k - 1)} \\cdot ${p.toLatex()} = ${ans.toLatex()}`;
        const check = steps(
          `P(X > ${k - 1}) - P(X > ${k}) = ${pw(q, k - 1)} - ${pw(q, k)} = ${q.pow(k - 1).toLatex()} - ${q.pow(k).toLatex()} = ${ans.toLatex()}`,
        );
        return numberProblem({
          prompt: t(
            `$X \\sim \\operatorname{Geo}\\left(${p.toLatex()}\\right)$. Find $P(X = ${k})$.${simplest.en}`,
            `$X \\sim \\operatorname{Geo}\\left(${p.toLatex()}\\right)$。求 $P(X = ${k})$。${simplest["zh-CN"]}`,
          ),
          answer: ans,
          mistakes: distinct([
            why(
              q.pow(k).mul(p),
              `This has $${k}$ failures before the success; the first success on trial $${k}$ needs only $${k - 1}$.`,
              `这在成功之前有 $${k}$ 次失败；第一次成功在第 $${k}$ 次只需要前 $${k - 1}$ 次失败。`,
            ),
            why(
              p.pow(k - 1).mul(q),
              "This swaps $p$ and $1 - p$: it has the first trials succeed and the last one fail.",
              "这把 $p$ 与 $1 - p$ 弄反了：变成了前几次成功、最后一次失败。",
            ),
            why(
              q.pow(k - 1),
              `This is the probability that the first $${k - 1}$ trials fail; trial $${k}$ must also succeed, so multiply by $${p.toLatex()}$.`,
              `这是前 $${k - 1}$ 次都失败的概率；第 $${k}$ 次还必须成功，要再乘以 $${p.toLatex()}$。`,
            ),
          ]),
          solution: t(
            `**Step 1: Describe the event.** $X = ${k}$ means the first $${k - 1}$ trials fail, each with probability $1 - p = ${q.toLatex()}$, and trial $${k}$ succeeds, with probability $${p.toLatex()}$.\n\n**Step 2: Multiply, since the trials are independent.**${steps(line)}**Check.** $X = ${k}$ means more than $${k - 1}$ trials are needed but not more than $${k}$:${check}`,
            `**第一步：描述事件。**$X = ${k}$ 表示前 $${k - 1}$ 次都失败，每次概率为 $1 - p = ${q.toLatex()}$，而第 $${k}$ 次成功，概率为 $${p.toLatex()}$。\n\n**第二步：各次试验独立，所以相乘。**${steps(line)}**检验。**$X = ${k}$ 表示需要超过 $${k - 1}$ 次，但不超过 $${k}$ 次：${check}`,
          ),
        });
      },
    },
    {
      id: "geometric-tail-probabilities",
      keyPrerequisites: ["the-sum-of-the-first-n-terms-of-a-geometric-series"],
      title: t("Tail probabilities", "尾部概率"),
      explanation: t(
        "More than $k$ trials are needed exactly when the first $k$ trials all fail, so\n\n$$P(X > k) = (1 - p)^k, \\qquad P(X \\le k) = 1 - (1 - p)^k.$$\n\nThe second formula is also the sum of the geometric series $p + (1 - p)p + \\cdots + (1 - p)^{k - 1}p$. Mind the endpoints: $P(X \\ge k) = P(X > k - 1) = (1 - p)^{k - 1}$.\n\nFor $X \\sim \\operatorname{Geo}\\left(\\frac{1}{3}\\right)$: $P(X > 2) = \\left(\\frac{2}{3}\\right)^2 = \\frac{4}{9}$ and $P(X \\le 2) = \\frac{5}{9}$.\n\nCheck: $P(X \\le 2) = P(X = 1) + P(X = 2) = \\frac{1}{3} + \\frac{2}{3} \\cdot \\frac{1}{3} = \\frac{5}{9}$.\n\n> **Watch out.** $X \\ge k$ and $X < k$ do not include the same values as $X > k$ and $X \\le k$: rewrite them first, $X \\ge k$ as $X > k - 1$ and $X < k$ as $X \\le k - 1$.",
        "需要超过 $k$ 次试验，当且仅当前 $k$ 次全部失败，所以\n\n$$P(X > k) = (1 - p)^k, \\qquad P(X \\le k) = 1 - (1 - p)^k.$$\n\n第二个公式也是几何级数 $p + (1 - p)p + \\cdots + (1 - p)^{k - 1}p$ 的和。注意端点：$P(X \\ge k) = P(X > k - 1) = (1 - p)^{k - 1}$。\n\n对 $X \\sim \\operatorname{Geo}\\left(\\frac{1}{3}\\right)$：$P(X > 2) = \\left(\\frac{2}{3}\\right)^2 = \\frac{4}{9}$，$P(X \\le 2) = \\frac{5}{9}$。\n\n检验：$P(X \\le 2) = P(X = 1) + P(X = 2) = \\frac{1}{3} + \\frac{2}{3} \\cdot \\frac{1}{3} = \\frac{5}{9}$。\n\n> **注意。** $X \\ge k$、$X < k$ 与 $X > k$、$X \\le k$ 包含的取值不同：先改写，$X \\ge k$ 即 $X > k - 1$，$X < k$ 即 $X \\le k - 1$。",
      ),
      generate(rng) {
        const p = rng.pick(FRACTIONS);
        const q = Q.one.sub(p);
        const k = rng.int(2, 5);
        const type = rng.int(0, 3);
        const ops = [">", "\\le", "\\ge", "<"];
        const e = type < 2 ? k : k - 1;
        const tail = q.pow(e);
        const upper = type === 0 || type === 2;
        const ans = upper ? tail : Q.one.sub(tail);
        const offE = type < 2 ? k - 1 : k;
        const offTail = q.pow(offE);
        const ev = `X ${ops[type]} ${k}`;
        const rewritten = upper ? `X > ${e}` : `X \\le ${e}`;
        const line = upper ? `P(${ev}) = ${pw(q, e)} = ${ans.toLatex()}` : `P(${ev}) = 1 - ${pw(q, e)} = ${ans.toLatex()}`;
        const terms = range(1, e).map((j) => q.pow(j - 1).mul(p));
        const firstE = terms.reduce((a, v) => a.add(v), Q.zero);
        const checkLine = upper
          ? `1 - \\left(${terms.map((v) => v.toLatex()).join(" + ")}\\right) = 1 - ${firstE.toLatex()} = ${ans.toLatex()}`
          : `${terms.map((v) => v.toLatex()).join(" + ")} = ${ans.toLatex()}`;
        return numberProblem({
          prompt: t(
            `$X \\sim \\operatorname{Geo}\\left(${p.toLatex()}\\right)$. Find $P(${ev})$.${simplest.en}`,
            `$X \\sim \\operatorname{Geo}\\left(${p.toLatex()}\\right)$。求 $P(${ev})$。${simplest["zh-CN"]}`,
          ),
          answer: ans,
          mistakes: distinct([
            why(
              Q.one.sub(ans),
              `This is the probability of the complement, $${upper ? `X \\le ${e}` : `X > ${e}`}$.`,
              `这是对立事件 $${upper ? `X \\le ${e}` : `X > ${e}`}$ 的概率。`,
            ),
            why(
              upper ? offTail : Q.one.sub(offTail),
              `This uses the exponent $${offE}$; $${ev}$ is the same as $${rewritten}$, so the exponent is $${e}$.`,
              `这用了指数 $${offE}$；$${ev}$ 等价于 $${rewritten}$，所以指数是 $${e}$。`,
            ),
            why(
              p.pow(e),
              `This raises the probability of success, $${p.toLatex()}$, to the power; it is the failures that must repeat, with probability $${q.toLatex()}$.`,
              `这把成功的概率 $${p.toLatex()}$ 取了幂；需要连续出现的是失败，其概率为 $${q.toLatex()}$。`,
            ),
          ]),
          solution: t(
            `**Step 1: Rewrite the event.** $${ev}$ is $${rewritten}$, and $X > ${e}$ means the first $${e}$ trials all fail.\n\n**Step 2: Use the tail formula.**${steps(line)}**Check.** ${upper ? "Subtract from $1$ the" : "Add the"} single probabilities $P(X = j) = \\left(${q.toLatex()}\\right)^{j - 1} \\cdot ${p.toLatex()}$ for $j = 1, \\ldots, ${e}$:${steps(checkLine)}`,
            `**第一步：改写事件。**$${ev}$ 即 $${rewritten}$，而 $X > ${e}$ 表示前 $${e}$ 次试验全部失败。\n\n**第二步：用尾部概率公式。**${steps(line)}**检验。**${upper ? "用 $1$ 减去" : "把"} $j = 1, \\ldots, ${e}$ 时的单个概率 $P(X = j) = \\left(${q.toLatex()}\\right)^{j - 1} \\cdot ${p.toLatex()}$ ${upper ? "之和" : "相加"}：${steps(checkLine)}`,
          ),
        });
      },
    },
    {
      id: "mean-of-a-geometric-distribution",
      title: t("The mean", "均值"),
      explanation: t(
        "If $X \\sim \\operatorname{Geo}(p)$, then\n\n$$E(X) = \\frac{1}{p}, \\qquad \\operatorname{Var}(X) = \\frac{1 - p}{p^2}.$$\n\nWith probability $\\frac{1}{6}$ of success per trial, the first success takes $6$ trials on average. Conversely, if $E(X) = 4$, then $p = \\frac{1}{4}$.\n\nCheck: in $600$ trials with $p = \\frac{1}{6}$ about $100$ succeed, so the successes are about $\\frac{600}{100} = 6$ trials apart.\n\n> **Watch out.** The mean is $\\frac{1}{p}$, not $p$ and not $\\frac{1}{1 - p}$; it counts the successful trial too, so it is not $\\frac{1}{p} - 1$.",
        "若 $X \\sim \\operatorname{Geo}(p)$，则\n\n$$E(X) = \\frac{1}{p}, \\qquad \\operatorname{Var}(X) = \\frac{1 - p}{p^2}.$$\n\n若每次成功的概率为 $\\frac{1}{6}$，第一次成功平均需要 $6$ 次试验。反过来，若 $E(X) = 4$，则 $p = \\frac{1}{4}$。\n\n检验：$p = \\frac{1}{6}$ 时，$600$ 次试验中约有 $100$ 次成功，所以相邻两次成功平均相隔 $\\frac{600}{100} = 6$ 次试验。\n\n> **注意。** 均值是 $\\frac{1}{p}$，不是 $p$，也不是 $\\frac{1}{1 - p}$；它把成功的那一次也算在内，所以不是 $\\frac{1}{p} - 1$。",
      ),
      generate(rng) {
        const ask = rng.int(0, 2);
        if (ask === 1) {
          const m = rng.pick([2, 3, 4, 5, 6, 8, 10, 12, 20, 25, 50]);
          const k = rng.pick([1, 2, 3, 4]);
          const e = Q.of(m, k);
          const p = Q.of(k, m);
          if (p.cmp(Q.one) >= 0) return geoMean(rng, 0);
          return numberProblem({
            prompt: t(
              `$X \\sim \\operatorname{Geo}(p)$ and $E(X) = ${e.toLatex()}$. Find $p$.${simplest.en}`,
              `$X \\sim \\operatorname{Geo}(p)$，且 $E(X) = ${e.toLatex()}$。求 $p$。${simplest["zh-CN"]}`,
            ),
            answer: p,
            mistakes: distinct([
              why(e, "This is $E(X)$ itself; $p$ is its reciprocal.", "这是 $E(X)$ 本身；$p$ 是它的倒数。"),
              why(
                Q.one.sub(p),
                `This is $1 - p$, the probability of failure; $p$ itself is $\\frac{1}{E(X)}$.`,
                `这是失败的概率 $1 - p$；$p$ 本身等于 $\\frac{1}{E(X)}$。`,
              ),
            ]),
            solution: t(
              `**Step 1: Write the mean in terms of $p$.**${steps(`E(X) = \\frac{1}{p} = ${e.toLatex()}`)}**Step 2: Take reciprocals.**${steps(`p = \\frac{1}{${e.toLatex()}} = ${p.toLatex()}`)}**Check.** With $p = ${p.toLatex()}$:${steps(`\\frac{1}{p} = 1 \\div ${p.toLatex()} = ${e.toLatex()}`)}`,
              `**第一步：用 $p$ 表示均值。**${steps(`E(X) = \\frac{1}{p} = ${e.toLatex()}`)}**第二步：取倒数。**${steps(`p = \\frac{1}{${e.toLatex()}} = ${p.toLatex()}`)}**检验。**取 $p = ${p.toLatex()}$：${steps(`\\frac{1}{p} = 1 \\div ${p.toLatex()} = ${e.toLatex()}`)}`,
            ),
          });
        }
        return geoMean(rng, ask);
      },
    },
  ],
};

/** geoMean asks for the mean (ask 0) or the variance (ask 2) of a geometric distribution. */
function geoMean(rng: Rng, ask: number): Problem {
  const p = rng.pick([...FRACTIONS, Q.of(1, 8), Q.of(3, 8), Q.of(1, 10), Q.of(3, 10), Q.of(2, 7)]);
  const q = Q.one.sub(p);
  const mean = Q.one.div(p);
  const v = q.div(p.mul(p));
  const dist = `X \\sim \\operatorname{Geo}\\left(${p.toLatex()}\\right)`;
  const read = t(
    `**Step 1: Read off the parameter.** Here $p = ${p.toLatex()}$ and $1 - p = ${q.toLatex()}$.\n\n`,
    `**第一步：读出参数。**这里 $p = ${p.toLatex()}$，$1 - p = ${q.toLatex()}$。\n\n`,
  );
  if (ask === 0) {
    const line = `E(X) = \\frac{1}{p} = \\frac{1}{${p.toLatex()}} = ${mean.toLatex()}`;
    const check = steps(`${mean.toLatex()} \\cdot ${p.toLatex()} = 1`);
    return numberProblem({
      prompt: t(`$${dist}$. Find $E(X)$.${simplest.en}`, `$${dist}$。求 $E(X)$。${simplest["zh-CN"]}`),
      answer: mean,
      mistakes: distinct([
        why(p, "This is $p$ itself; the mean is its reciprocal $\\frac{1}{p}$.", "这是 $p$ 本身；均值是它的倒数 $\\frac{1}{p}$。"),
        why(
          Q.one.div(q),
          `This takes the reciprocal of $1 - p = ${q.toLatex()}$ instead of $p$.`,
          `这取的是 $1 - p = ${q.toLatex()}$ 的倒数，而不是 $p$ 的倒数。`,
        ),
        why(
          mean.sub(Q.one),
          "This counts only the failures before the success; $X$ also counts the successful trial.",
          "这只数了成功之前的失败次数；$X$ 还包括成功的那一次。",
        ),
      ]),
      solution: t(
        `${read.en}**Step 2: Take the reciprocal.**${steps(line)}**Check.** About one trial in every $E(X)$ succeeds, so $E(X) \\cdot p$ is $1$:${check}`,
        `${read["zh-CN"]}**第二步：取倒数。**${steps(line)}**检验。**平均每 $E(X)$ 次试验成功一次，所以 $E(X) \\cdot p = 1$：${check}`,
      ),
    });
  }
  const line = `\\operatorname{Var}(X) = \\frac{1 - p}{p^2} = \\frac{${q.toLatex()}}{${p.mul(p).toLatex()}} = ${v.toLatex()}`;
  const check = steps(`\\frac{1}{p^2} - \\frac{1}{p} = ${mean.mul(mean).toLatex()} - ${mean.toLatex()} = ${v.toLatex()}`);
  return numberProblem({
    prompt: t(`$${dist}$. Find $\\operatorname{Var}(X)$.${simplest.en}`, `$${dist}$。求 $\\operatorname{Var}(X)$。${simplest["zh-CN"]}`),
    answer: v,
    mistakes: distinct([
      why(q.div(p), "This divides by $p$ once; the formula divides by $p^2$.", "这只除以了一次 $p$；公式是除以 $p^2$。"),
      why(mean, "This is the mean $\\frac{1}{p}$, not the variance.", "这是均值 $\\frac{1}{p}$，不是方差。"),
      why(
        q.mul(p),
        "This multiplies $1 - p$ by $p$, as for one binomial trial; the geometric variance divides by $p^2$.",
        "这用 $1 - p$ 乘以 $p$，像单次二项试验那样；几何分布的方差是除以 $p^2$。",
      ),
    ]),
    solution: t(
      `${read.en}**Step 2: Use the variance formula.**${steps(line)}**Check.** Since $\\frac{1 - p}{p^2} = \\frac{1}{p^2} - \\frac{1}{p}$, use the mean $\\frac{1}{p} = ${mean.toLatex()}$:${check}`,
      `${read["zh-CN"]}**第二步：用方差公式。**${steps(line)}**检验。**因为 $\\frac{1 - p}{p^2} = \\frac{1}{p^2} - \\frac{1}{p}$，用均值 $\\frac{1}{p} = ${mean.toLatex()}$：${check}`,
    ),
  });
}

/** GeoContext is a situation modeled by a geometric distribution. */
interface GeoContext {
  readonly setup: Text;
  readonly p: Q;
  readonly decimal: boolean;
}

/** geoContext picks a situation in which X counts the trials up to the first success. */
function geoContext(rng: Rng): GeoContext {
  const kind = rng.int(0, 2);
  if (kind === 0) {
    const [en, zh, p] = rng.pick([
      ["a six", "六点", Q.of(1, 6)],
      ["an even number", "偶数点", Q.of(1, 2)],
      ["a number greater than 4", "大于 4 的点数", Q.of(1, 3)],
      ["a number less than 5", "小于 5 的点数", Q.of(2, 3)],
      ["a number greater than 1", "大于 1 的点数", Q.of(5, 6)],
    ] as const);
    return {
      setup: t(
        `A fair six-sided die is rolled repeatedly until it shows ${en}. Let $X$ be the number of rolls needed.`,
        `反复掷一颗均匀的六面骰子，直到掷出${zh}为止。设 $X$ 为所需的次数。`,
      ),
      p,
      decimal: false,
    };
  }
  if (kind === 1) {
    const [en, zh, p] = rng.pick([
      ["a heart", "红桃", Q.of(1, 4)],
      ["an ace", "A", Q.of(1, 13)],
      ["a face card (jack, queen or king)", "人头牌（J、Q 或 K）", Q.of(3, 13)],
      ["a red card", "红色的牌", Q.of(1, 2)],
    ] as const);
    return {
      setup: t(
        `A card is drawn at random from a standard $52$-card deck and then replaced, and this is repeated until ${en} is drawn. Let $X$ be the number of draws needed.`,
        `从一副标准的 $52$ 张扑克牌中随机抽一张后放回，重复进行，直到抽到${zh}为止。设 $X$ 为所需的抽取次数。`,
      ),
      p,
      decimal: false,
    };
  }
  const r = rng.pick([20, 30, 40, 60, 70, 80, 90]);
  const [en, zh] = rng.pick([
    ["A basketball player makes each free throw", "某篮球运动员每次罚球命中"],
    ["An archer hits the target with each arrow", "某弓箭手每箭射中靶子"],
  ] as const);
  return {
    setup: t(
      `${en} with probability $${h(r)}$, independently of the others, and keeps going until the first success. Let $X$ be the number of attempts needed.`,
      `${zh}的概率为 $${h(r)}$，各次相互独立，一直尝试直到第一次成功为止。设 $X$ 为所需的尝试次数。`,
    ),
    p: Q.of(r, 100),
    decimal: true,
  };
}

/** modelingWithTheGeometricDistribution applies the geometric distribution to situations. */
const modelingWithTheGeometricDistribution: TopicDef = {
  id: "modeling-with-the-geometric-distribution",
  title: t("Modeling With the Geometric Distribution", "用几何分布建模"),
  summary: t(
    "Model the number of attempts until a first success with a geometric distribution, compute probabilities of when the first success occurs, find the expected number of attempts, and find how many attempts give a required chance of success.",
    "用几何分布为直到第一次成功的尝试次数建模，计算第一次成功出现在何时的概率，求期望尝试次数，并求达到所需成功机会的尝试次数。",
  ),
  prerequisites: ["the-geometric-distribution"],
  encompasses: [{ topic: "the-geometric-distribution", weight: 0.6 }],
  xp: 18,
  standards: ["CCSS.HSS.MD.A.3"],
  intro: t(
    `An archer hits the target with each arrow with probability $0.4$ and shoots until the first hit. The chance that she needs more than $2$ arrows is the chance that the first two miss, $0.6 \\cdot 0.6 = 0.36$, so she hits within $2$ arrows with probability $0.64$.

Check: she hits with the first arrow with probability $0.4$, or misses and then hits with probability $0.6 \\cdot 0.4 = 0.24$, and $0.4 + 0.24 = 0.64$.

In this lesson we model attempts up to a first success with the geometric distribution, find when the first success is likely to come, and find how many attempts give a required chance of success.`,
    `某弓箭手每箭射中靶子的概率为 $0.4$，她一直射到第一次射中为止。她需要超过 $2$ 箭的概率就是前两箭都没射中的概率 $0.6 \\cdot 0.6 = 0.36$，所以她在 $2$ 箭之内射中的概率为 $0.64$。

检验：第一箭射中的概率为 $0.4$，第一箭未中、第二箭射中的概率为 $0.6 \\cdot 0.4 = 0.24$，而 $0.4 + 0.24 = 0.64$。

本课用几何分布为直到第一次成功的尝试建模，求第一次成功可能出现在何时，并求达到所需成功机会的尝试次数。`,
  ),
  knowledgePoints: [
    {
      id: "first-success-on-a-given-attempt",
      title: t("The first success on a given attempt", "第一次成功出现在某次"),
      explanation: t(
        'When independent attempts with the same probability $p$ of success continue until the first success, the number of attempts is $X \\sim \\operatorname{Geo}(p)$. "The first success is on attempt $k$" is the event $X = k$, with probability $(1 - p)^{k - 1}p$.\n\nRolling a die until a six appears, the probability that the first six is on the third roll is $\\left(\\frac{5}{6}\\right)^2 \\cdot \\frac{1}{6} = \\frac{25}{216}$.\n\nCheck: of the $216$ equally likely sequences of three rolls, $5 \\cdot 5 \\cdot 1 = 25$ have no six in the first two rolls and a six in the third.\n\n> **Watch out.** The first success on attempt $k$ needs $k - 1$ failures and then a success. Leaving out the factor $p$ gives only the chance that the first $k - 1$ attempts fail.',
        "当成功概率都为 $p$ 的独立尝试一直进行到第一次成功时，尝试次数 $X \\sim \\operatorname{Geo}(p)$。“第一次成功出现在第 $k$ 次”就是事件 $X = k$，其概率为 $(1 - p)^{k - 1}p$。\n\n反复掷骰子直到出现六点，第一个六点出现在第三次的概率为 $\\left(\\frac{5}{6}\\right)^2 \\cdot \\frac{1}{6} = \\frac{25}{216}$。\n\n检验：连掷三次的 $216$ 种等可能序列中，前两次不是六点而第三次是六点的有 $5 \\cdot 5 \\cdot 1 = 25$ 种。\n\n> **注意。** 第一次成功在第 $k$ 次，需要先失败 $k - 1$ 次再成功一次。漏掉因子 $p$，得到的只是前 $k - 1$ 次都失败的概率。",
      ),
      generate(rng) {
        const c = geoContext(rng);
        const p = c.p;
        const q = Q.one.sub(p);
        const k = rng.int(2, 5);
        const ans = q.pow(k - 1).mul(p);
        const pl = c.decimal ? pwd : pw;
        const ask = c.decimal ? asDecimal : simplest;
        const show = (v: Q) => pd(v, c.decimal);
        const line = `P(X = ${k}) = ${pl(q, k - 1)} \\cdot ${show(p)} = ${show(ans)}`;
        const check = steps(`${pl(q, k - 1)} - ${pl(q, k)} = ${show(q.pow(k - 1))} - ${show(q.pow(k))} = ${show(ans)}`);
        return numberProblem({
          prompt: t(`${c.setup.en} Find $P(X = ${k})$.${ask.en}`, `${c.setup["zh-CN"]}求 $P(X = ${k})$。${ask["zh-CN"]}`),
          answer: ans,
          ...(c.decimal && { form: "decimal" as const }),
          mistakes: distinct([
            why(
              q.pow(k).mul(p),
              `This has $${k}$ failures before the success; the first success on attempt $${k}$ follows only $${k - 1}$.`,
              `这在成功之前有 $${k}$ 次失败；第一次成功在第 $${k}$ 次，之前只有 $${k - 1}$ 次失败。`,
            ),
            why(p.pow(k - 1).mul(q), "This swaps the probabilities of success and failure.", "这把成功与失败的概率弄反了。"),
            why(
              q.pow(k - 1),
              `This is the chance that the first $${k - 1}$ attempts fail; attempt $${k}$ must also succeed, so multiply by $${show(p)}$.`,
              `这是前 $${k - 1}$ 次都失败的概率；第 $${k}$ 次还必须成功，要再乘以 $${show(p)}$。`,
            ),
          ]),
          solution: t(
            `**Step 1: Identify the model.** The attempts are independent, each a success with probability $${show(p)}$, so $X \\sim \\operatorname{Geo}\\left(${show(p)}\\right)$, and $X = ${k}$ means the first $${k - 1}$ attempts fail and attempt $${k}$ succeeds.\n\n**Step 2: Multiply.**${steps(line)}**Check.** $X = ${k}$ is "more than $${k - 1}$ attempts" minus "more than $${k}$ attempts":${check}`,
            `**第一步：确定模型。**各次尝试独立，每次成功的概率为 $${show(p)}$，所以 $X \\sim \\operatorname{Geo}\\left(${show(p)}\\right)$，而 $X = ${k}$ 表示前 $${k - 1}$ 次失败、第 $${k}$ 次成功。\n\n**第二步：相乘。**${steps(line)}**检验。**$X = ${k}$ 就是“需要超过 $${k - 1}$ 次”去掉“需要超过 $${k}$ 次”：${check}`,
          ),
        });
      },
    },
    {
      id: "success-within-a-number-of-attempts",
      title: t("Success within a number of attempts", "在若干次之内成功"),
      explanation: t(
        '"Success within $k$ attempts" is $X \\le k$ and "more than $k$ attempts are needed" is $X > k$:\n\n$$P(X > k) = (1 - p)^k, \\qquad P(X \\le k) = 1 - (1 - p)^k.$$\n\nAn archer who hits with probability $0.4$ needs more than $3$ arrows with probability $0.6^3 = 0.216$, and hits within $3$ arrows with probability $1 - 0.216 = 0.784$.\n\nCheck: the first hit comes on arrow $1$, $2$ or $3$ with probabilities $0.4$, $0.24$ and $0.144$, and $0.4 + 0.24 + 0.144 = 0.784$.\n\n> **Watch out.** Raise the probability of failure, $1 - p$, to the power $k$, not the probability of success: $0.4^3$ is the chance of three hits in a row, which is not what is asked.',
        "“在 $k$ 次之内成功”是 $X \\le k$，“需要超过 $k$ 次”是 $X > k$：\n\n$$P(X > k) = (1 - p)^k, \\qquad P(X \\le k) = 1 - (1 - p)^k.$$\n\n某弓箭手每箭射中的概率为 $0.4$，他需要超过 $3$ 箭的概率为 $0.6^3 = 0.216$，在 $3$ 箭之内射中的概率为 $1 - 0.216 = 0.784$。\n\n检验：第一次射中出现在第 $1$、$2$、$3$ 箭的概率分别为 $0.4$、$0.24$、$0.144$，而 $0.4 + 0.24 + 0.144 = 0.784$。\n\n> **注意。** 取 $k$ 次幂的是失败的概率 $1 - p$，而不是成功的概率：$0.4^3$ 是连中三箭的概率，不是所求的概率。",
      ),
      generate(rng) {
        const c = geoContext(rng);
        const q = Q.one.sub(c.p);
        const k = rng.int(2, 4);
        const within = rng.bool();
        const tail = q.pow(k);
        const ans = within ? Q.one.sub(tail) : tail;
        const pl = c.decimal ? pwd : pw;
        const ask = c.decimal ? asDecimal : simplest;
        const show = (v: Q) => pd(v, c.decimal);
        const ev = within ? `X \\le ${k}` : `X > ${k}`;
        const line = within ? `P(X \\le ${k}) = 1 - ${pl(q, k)} = ${show(ans)}` : `P(X > ${k}) = ${pl(q, k)} = ${show(ans)}`;
        const terms = range(1, k).map((j) => q.pow(j - 1).mul(c.p));
        const firstK = terms.reduce((a, v) => a.add(v), Q.zero);
        const checkLine = within
          ? `${terms.map(show).join(" + ")} = ${show(ans)}`
          : `1 - \\left(${terms.map(show).join(" + ")}\\right) = 1 - ${show(firstK)} = ${show(ans)}`;
        return numberProblem({
          prompt: t(
            `${c.setup.en} Find the probability that ${within ? `the first success comes within the first $${k}$ attempts` : `more than $${k}$ attempts are needed`}.${ask.en}`,
            `${c.setup["zh-CN"]}求${within ? `在前 $${k}$ 次之内第一次成功` : `需要超过 $${k}$ 次`}的概率。${ask["zh-CN"]}`,
          ),
          answer: ans,
          ...(c.decimal && { form: "decimal" as const }),
          mistakes: distinct([
            why(
              Q.one.sub(ans),
              `This is the probability of the complement, $${within ? `X > ${k}` : `X \\le ${k}`}$.`,
              `这是对立事件 $${within ? `X > ${k}` : `X \\le ${k}`}$ 的概率。`,
            ),
            why(
              within ? Q.one.sub(q.pow(k - 1)) : q.pow(k - 1),
              `This uses the exponent $${k - 1}$; ${within ? "success within" : "more than"} $${k}$ attempts is about the first $${k}$ attempts, so the exponent is $${k}$.`,
              `这用了指数 $${k - 1}$；${within ? "在" : "超过"} $${k}$ 次${within ? "之内成功" : ""}说的是前 $${k}$ 次，所以指数是 $${k}$。`,
            ),
            why(
              c.p.pow(k),
              `This is the chance of $${k}$ successes in a row; the power belongs to the probability of failure, $${show(q)}$.`,
              `这是连续成功 $${k}$ 次的概率；取幂的应是失败的概率 $${show(q)}$。`,
            ),
          ]),
          solution: t(
            `**Step 1: Write the event for $X$.** The event is $${ev}$, and $X > ${k}$ means the first $${k}$ attempts all fail, each with probability $${show(q)}$.\n\n**Step 2: Use the tail formula.**${steps(line)}**Check.** ${within ? "Add" : "Subtract from $1$"} the chances that the first success comes on attempt $1, \\ldots, ${k}$:${steps(checkLine)}`,
            `**第一步：写出关于 $X$ 的事件。**所求事件为 $${ev}$，而 $X > ${k}$ 表示前 $${k}$ 次全部失败，每次概率为 $${show(q)}$。\n\n**第二步：用尾部概率公式。**${steps(line)}**检验。**${within ? "把" : "用 $1$ 减去"}第一次成功出现在第 $1, \\ldots, ${k}$ 次的概率${within ? "相加" : "之和"}：${steps(checkLine)}`,
          ),
        });
      },
    },
    {
      id: "expected-attempts-and-required-attempts",
      title: t("Expected and required numbers of attempts", "期望次数与所需次数"),
      explanation: t(
        "The expected number of attempts until the first success is $E(X) = \\frac{1}{p}$.\n\nTo find the least number $n$ of attempts that gives a success with probability at least $c$, solve $1 - (1 - p)^n \\ge c$, that is $(1 - p)^n \\le 1 - c$, and take the smallest whole $n$. For $p = \\frac{1}{2}$ and $c = 0.9$: $\\left(\\frac{1}{2}\\right)^3 = 0.125 > 0.1$ but $\\left(\\frac{1}{2}\\right)^4 = 0.0625 \\le 0.1$, so $n = 4$. Logarithms give the same: $n \\ge \\frac{\\log 0.1}{\\log 0.5} \\approx 3.32$.\n\nCheck: with $4$ attempts the chance of at least one success is $1 - 0.0625 = 0.9375 \\ge 0.9$, and with $3$ it is only $0.875$.\n\n> **Watch out.** The expected number $\\frac{1}{p}$ is not the number of attempts that makes success likely: here $\\frac{1}{p} = 2$ attempts give success only with probability $0.75$. And dividing by the negative number $\\log 0.5$ reverses the inequality.",
        "直到第一次成功的期望尝试次数为 $E(X) = \\frac{1}{p}$。\n\n要求使成功概率至少为 $c$ 的最少尝试次数 $n$，解 $1 - (1 - p)^n \\ge c$，即 $(1 - p)^n \\le 1 - c$，取最小的整数 $n$。当 $p = \\frac{1}{2}$，$c = 0.9$ 时：$\\left(\\frac{1}{2}\\right)^3 = 0.125 > 0.1$，而 $\\left(\\frac{1}{2}\\right)^4 = 0.0625 \\le 0.1$，所以 $n = 4$。用对数也得到同样结果：$n \\ge \\frac{\\log 0.1}{\\log 0.5} \\approx 3.32$。\n\n检验：尝试 $4$ 次时至少成功一次的概率为 $1 - 0.0625 = 0.9375 \\ge 0.9$，而尝试 $3$ 次时只有 $0.875$。\n\n> **注意。** 期望次数 $\\frac{1}{p}$ 并不是使成功很可能发生的次数：这里 $\\frac{1}{p} = 2$ 次尝试成功的概率只有 $0.75$。另外，除以负数 $\\log 0.5$ 时不等号要反向。",
      ),
      generate(rng) {
        const c = geoContext(rng);
        const p = c.p;
        const q = Q.one.sub(p);
        if (rng.bool()) {
          for (const pct of rng.shuffle([50, 75, 90, 95, 99])) {
            const target = Q.of(100 - pct, 100);
            const exact = Math.log(target.toNumber()) / Math.log(q.toNumber());
            if (Math.abs(exact - Math.round(exact)) < 0.03) continue;
            let n = 1;
            while (q.pow(n).cmp(target) > 0) n++;
            const qs = pd(q, c.decimal);
            const lines = [
              ...(n > 1
                ? [
                    `${n - 1}: \\quad \\left(${qs}\\right)^{${n - 1}} \\approx ${q
                      .pow(n - 1)
                      .toNumber()
                      .toFixed(4)} > ${dec(target)}`,
                  ]
                : []),
              `${n}: \\quad \\left(${qs}\\right)^{${n}} \\approx ${q.pow(n).toNumber().toFixed(4)} \\le ${dec(target)}`,
            ];
            const logLine = `n \\ge \\frac{\\log ${dec(target)}}{\\log ${qs}} \\approx ${exact.toFixed(2)}`;
            const mean = Math.round(1 / p.toNumber());
            return numberProblem({
              prompt: t(
                `${c.setup.en} What is the least number $n$ of attempts for which the probability of at least one success in $n$ attempts is at least $${pct}\\%$?`,
                `${c.setup["zh-CN"]}要使 $n$ 次尝试中至少成功一次的概率不低于 $${pct}\\%$，$n$ 最少是多少？`,
              ),
              answer: n,
              mistakes: distinct([
                why(
                  n - 1,
                  `With $${n - 1}$ attempts, $\\left(${qs}\\right)^{${n - 1}}$ is still greater than $${dec(target)}$, so the chance of success is below $${pct}\\%$.`,
                  `尝试 $${n - 1}$ 次时，$\\left(${qs}\\right)^{${n - 1}}$ 仍大于 $${dec(target)}$，成功的概率低于 $${pct}\\%$。`,
                ),
                why(
                  n + 1,
                  `$${n + 1}$ attempts are enough, but $${n}$ already are, and the question asks for the least number.`,
                  `$${n + 1}$ 次固然够了，但 $${n}$ 次就已经够了，而题目问的是最少次数。`,
                ),
                why(
                  mean,
                  `This is about the expected number of attempts, $\\frac{1}{p}$, which does not give a $${pct}\\%$ chance of success.`,
                  `这大约是期望尝试次数 $\\frac{1}{p}$，它并不能保证 $${pct}\\%$ 的成功机会。`,
                ),
              ]),
              solution: t(
                `**Step 1: Set up the inequality.** At least one success in $n$ attempts has probability $1 - \\left(${qs}\\right)^n$, so we need $1 - \\left(${qs}\\right)^n \\ge ${dec(Q.of(pct, 100))}$, that is $\\left(${qs}\\right)^n \\le ${dec(target)}$.\n\n**Step 2: Check the powers.**${steps(...lines)}So $n = ${n}$.\n\n**Check.** Take logarithms; $\\log ${qs}$ is negative, so the inequality reverses:${steps(logLine)}The least whole number is $${n}$.`,
                `**第一步：列出不等式。**$n$ 次尝试中至少成功一次的概率为 $1 - \\left(${qs}\\right)^n$，所以需要 $1 - \\left(${qs}\\right)^n \\ge ${dec(Q.of(pct, 100))}$，即 $\\left(${qs}\\right)^n \\le ${dec(target)}$。\n\n**第二步：逐个检验幂。**${steps(...lines)}所以 $n = ${n}$。\n\n**检验。**取对数；$\\log ${qs}$ 是负数，所以不等号反向：${steps(logLine)}最小的整数是 $${n}$。`,
              ),
            });
          }
        }
        const mean = Q.one.div(p);
        return numberProblem({
          prompt: t(`${c.setup.en} Find $E(X)$.${simplest.en}`, `${c.setup["zh-CN"]}求 $E(X)$。${simplest["zh-CN"]}`),
          answer: mean,
          mistakes: distinct([
            why(p, "This is $p$ itself; the mean is its reciprocal $\\frac{1}{p}$.", "这是 $p$ 本身；均值是它的倒数 $\\frac{1}{p}$。"),
            why(
              Q.one.div(q),
              `This takes the reciprocal of the probability of failure, $${pd(q, c.decimal)}$.`,
              `这取的是失败概率 $${pd(q, c.decimal)}$ 的倒数。`,
            ),
            why(
              mean.sub(Q.one),
              "This counts only the failures before the success; $X$ also counts the successful attempt.",
              "这只数了成功之前的失败次数；$X$ 还包括成功的那一次。",
            ),
          ]),
          solution: t(
            `**Step 1: Identify the model.** The attempts are independent, each a success with probability $${pd(p, c.decimal)}$, so $X \\sim \\operatorname{Geo}\\left(${pd(p, c.decimal)}\\right)$.\n\n**Step 2: Take the reciprocal.**${steps(`E(X) = \\frac{1}{p} = \\frac{1}{${pd(p, c.decimal)}} = ${mean.toLatex()}`)}**Check.** About one attempt in every $E(X)$ succeeds, so $E(X) \\cdot p = 1$:${steps(`${mean.toLatex()} \\cdot ${pd(p, c.decimal)} = 1`)}`,
            `**第一步：确定模型。**各次尝试独立，每次成功的概率为 $${pd(p, c.decimal)}$，所以 $X \\sim \\operatorname{Geo}\\left(${pd(p, c.decimal)}\\right)$。\n\n**第二步：取倒数。**${steps(`E(X) = \\frac{1}{p} = \\frac{1}{${pd(p, c.decimal)}} = ${mean.toLatex()}`)}**检验。**平均每 $E(X)$ 次尝试成功一次，所以 $E(X) \\cdot p = 1$：${steps(`${mean.toLatex()} \\cdot ${pd(p, c.decimal)} = 1`)}`,
          ),
        });
      },
    },
  ],
};

// ─── Module 11.39: The Normal Distribution ──────────────────────────────────

/** PHI maps z, in hundredths, to Φ(z), in ten-thousandths, for the table values used in problems. */
const PHI: ReadonlyMap<number, number> = new Map([
  [10, 5398],
  [20, 5793],
  [25, 5987],
  [30, 6179],
  [40, 6554],
  [50, 6915],
  [60, 7257],
  [70, 7580],
  [75, 7734],
  [80, 7881],
  [90, 8159],
  [100, 8413],
  [110, 8643],
  [120, 8849],
  [125, 8944],
  [130, 9032],
  [140, 9192],
  [150, 9332],
  [160, 9452],
  [170, 9554],
  [175, 9599],
  [180, 9641],
  [190, 9713],
  [200, 9772],
  [220, 9861],
  [240, 9918],
  [250, 9938],
]);

/** ZS are the positive z values of PHI, in hundredths. */
const ZS: readonly number[] = [...PHI.keys()];

/** QUARTER_ZS are the z values of PHI that are multiples of 0.25, in hundredths. */
const QUARTER_ZS: readonly number[] = ZS.filter((z) => z % 25 === 0);

/** phi is Φ(z) in ten-thousandths for z in hundredths, using symmetry for negative z. */
function phi(z: number): number {
  if (z === 0) return 5000;
  if (z < 0) return 10000 - phi(-z);
  const v = PHI.get(z);
  if (v === undefined) throw new RangeError(`no table value for z = ${z / 100}`);
  return v;
}

/** zs writes z, in hundredths, as a decimal. */
const zs = (z: number) => dec(Q.of(z, 100));

/** given lists table values Φ(z) for the positive z, in hundredths. */
function given(zsList: readonly number[]): Text {
  const asked = [...new Set(zsList.map(Math.abs))];
  // A single value would be the answer itself, so its neighbors in the table are listed too.
  const keys = [...PHI.keys()];
  const at = keys.indexOf(asked[0] as number);
  const shown = asked.length === 1 && at >= 0 ? keys.slice(Math.max(0, at - 1), at + 2) : asked;
  const uniq = [...shown].sort((a, b) => a - b);
  const items = uniq.map((z) => `$\\Phi(${zs(z)}) = ${tt(phi(z))}$`);
  return t(` Use ${items.join(", ")}.`, `使用 ${items.join("、")}。`);
}

/** P4 is a probability in ten-thousandths as an exact rational. */
const P4 = (x: number) => Q.of(x, 10000);

/** zTable writes a table of Φ values for the given z, in hundredths. */
function zTable(zList: readonly number[]): string {
  const sorted = [...zList].sort((a, b) => a - b);
  return table(
    sorted.map(zs),
    "\\Phi(z)",
    sorted.map((z) => tt(phi(z))),
    "z",
  );
}

/** theStandardNormalDistribution introduces Z ~ N(0, 1) and its cumulative distribution function Φ. */
const theStandardNormalDistribution: TopicDef = {
  id: "the-standard-normal-distribution",
  title: t("The Standard Normal Distribution", "标准正态分布"),
  summary: t(
    "Describe the standard normal distribution Z ~ N(0, 1) by its bell-shaped density curve, and use values of its cumulative distribution function Φ(z) = P(Z < z) to find probabilities of the forms P(Z < a), P(Z > a) and P(a < Z < b).",
    "了解标准正态分布 Z ~ N(0, 1) 的钟形密度曲线，并利用其累积分布函数 Φ(z) = P(Z < z) 的值求 P(Z < a)、P(Z > a) 与 P(a < Z < b) 形式的概率。",
  ),
  prerequisites: ["cumulative-distribution-functions-for-discrete-random-variables"],
  encompasses: [{ topic: "the-complement-of-an-event", weight: 0.2 }],
  xp: 16,
  standards: ["CCSS.HSS.ID.A.4"],
  intro: t(
    `The heights of a large group are spread in a bell shape around their average. After rescaling to mean $0$ and standard deviation $1$, the curve is the standard normal curve, and probabilities are areas under it. A table gives $\\Phi(1) = 0.8413$: $84.13\\%$ of the area lies to the left of $1$, so $15.87\\%$ lies to the right.

Check: the curve is symmetric about $0$, so half the area, $0.5$, lies left of $0$, and the strip from $0$ to $1$ holds $0.8413 - 0.5 = 0.3413$; together with the right part, $0.5 + 0.3413 + 0.1587 = 1$.

In this lesson we read probabilities below a value, above a value and between two values from the cumulative distribution function $\\Phi$.`,
    `一大群人的身高围绕平均值呈钟形分布。把它重新标度为均值 $0$、标准差 $1$ 后，曲线就是标准正态曲线，概率就是曲线下的面积。表中给出 $\\Phi(1) = 0.8413$：$84.13\\%$ 的面积在 $1$ 的左侧，所以 $15.87\\%$ 在右侧。

检验：曲线关于 $0$ 对称，所以一半面积 $0.5$ 在 $0$ 的左侧，$0$ 到 $1$ 之间的一条有 $0.8413 - 0.5 = 0.3413$；加上右侧部分，$0.5 + 0.3413 + 0.1587 = 1$。

本课利用累积分布函数 $\\Phi$ 求某值以下、某值以上以及两值之间的概率。`,
  ),
  knowledgePoints: [
    {
      id: "probabilities-below-and-above-a-value",
      title: t("Probabilities below and above a value", "某值以下与以上的概率"),
      explanation: t(
        "A **continuous** random variable can take any value in an interval, and probabilities are areas under its density curve; the total area is $1$. The **standard normal** variable $Z \\sim N(0, 1)$ has a symmetric bell-shaped curve centered at $0$, with mean $0$ and standard deviation $1$.\n\nIts cumulative distribution function is written $\\Phi(z) = P(Z < z)$, the area to the left of $z$; its values come from a table or a calculator. For a continuous variable, $P(Z = a) = 0$, so $P(Z \\le a) = P(Z < a)$. The area to the right is the complement:\n\n$$P(Z > a) = 1 - \\Phi(a).$$\n\nWith $\\Phi(1) = 0.8413$: $P(Z > 1) = 1 - 0.8413 = 0.1587$.\n\nCheck: $1$ is right of the center, so less than half the area lies beyond it, and indeed $0.1587 < 0.5$; the two sides add up to $0.8413 + 0.1587 = 1$.\n\n> **Watch out.** $\\Phi$ always gives the area to the left. For $Z > a$ or $Z \\ge a$, subtract from $1$; and $\\Phi(a) - 0.5$ is only the strip between $0$ and $a$.",
        "**连续**随机变量可以取一个区间内的任何值，概率是其密度曲线下的面积，总面积为 $1$。**标准正态**变量 $Z \\sim N(0, 1)$ 的曲线是以 $0$ 为中心的对称钟形，均值为 $0$，标准差为 $1$。\n\n它的累积分布函数记作 $\\Phi(z) = P(Z < z)$，即 $z$ 左侧的面积，其值可查表或用计算器得到。对连续变量，$P(Z = a) = 0$，所以 $P(Z \\le a) = P(Z < a)$。右侧的面积是补集：\n\n$$P(Z > a) = 1 - \\Phi(a).$$\n\n由 $\\Phi(1) = 0.8413$ 得：$P(Z > 1) = 1 - 0.8413 = 0.1587$。\n\n检验：$1$ 在中心右侧，所以它右边的面积不到一半，确实 $0.1587 < 0.5$；两侧之和为 $0.8413 + 0.1587 = 1$。\n\n> **注意。** $\\Phi$ 给出的总是左侧的面积。求 $Z > a$ 或 $Z \\ge a$ 时要用 $1$ 去减；而 $\\Phi(a) - 0.5$ 只是 $0$ 与 $a$ 之间的一条。",
      ),
      generate(rng) {
        const z = rng.pick(ZS);
        const type = rng.int(0, 3);
        const ops = ["<", ">", "\\ge", "\\le"];
        const left = type === 0 || type === 3;
        const f = phi(z);
        const ans = left ? f : 10000 - f;
        const ev = `Z ${ops[type]} ${zs(z)}`;
        const g = given([z]);
        const line = left ? `P(${ev}) = \\Phi(${zs(z)}) = ${tt(f)}` : `P(${ev}) = 1 - \\Phi(${zs(z)}) = 1 - ${tt(f)} = ${tt(ans)}`;
        return numberProblem({
          prompt: t(`$Z \\sim N(0, 1)$. Find $P(${ev})$.${g.en}`, `$Z \\sim N(0, 1)$。求 $P(${ev})$。${g["zh-CN"]}`),
          answer: P4(ans),
          form: "decimal",
          mistakes: distinct([
            why(
              P4(10000 - ans),
              left
                ? `This is the area to the right of $${zs(z)}$; $\\Phi$ already gives the area to the left.`
                : `This is $\\Phi(${zs(z)})$, the area to the left; the event asks for the area to the right.`,
              left
                ? `这是 $${zs(z)}$ 右侧的面积；$\\Phi$ 给出的就是左侧的面积。`
                : `这是左侧的面积 $\\Phi(${zs(z)})$；所求事件是右侧的面积。`,
            ),
            why(
              P4(f - 5000),
              `This is only the strip between $0$ and $${zs(z)}$, $\\Phi(${zs(z)}) - 0.5$.`,
              `这只是 $0$ 与 $${zs(z)}$ 之间的一条，即 $\\Phi(${zs(z)}) - 0.5$。`,
            ),
          ]),
          solution: t(
            `**Step 1: Decide which side.** $${ev}$ is the area to the ${left ? "left" : "right"} of $${zs(z)}$${ops[type] === "<" || ops[type] === ">" ? "" : "; for a continuous variable the endpoint itself has probability $0$"}.\n\n**Step 2: ${left ? "Read it from $\\Phi$" : "Subtract $\\Phi$ from $1$"}.**${steps(line)}**Check.** $${zs(z)}$ is right of the center, so the left side holds more than half the area and the right side less; ${left ? `$${tt(ans)} > 0.5$` : `$${tt(ans)} < 0.5$`}, and the two sides add up to $1$:${steps(`${tt(f)} + ${tt(10000 - f)} = 1`)}`,
            `**第一步：判断是哪一侧。**$${ev}$ 是 $${zs(z)}$ ${left ? "左" : "右"}侧的面积${ops[type] === "<" || ops[type] === ">" ? "" : "；对连续变量，端点本身的概率为 $0$"}。\n\n**第二步：${left ? "由 $\\Phi$ 读出" : "用 $1$ 减去 $\\Phi$"}。**${steps(line)}**检验。**$${zs(z)}$ 在中心右侧，所以左侧面积超过一半、右侧不到一半；${left ? `$${tt(ans)} > 0.5$` : `$${tt(ans)} < 0.5$`}，且两侧之和为 $1$：${steps(`${tt(f)} + ${tt(10000 - f)} = 1`)}`,
          ),
        });
      },
    },
    {
      id: "probabilities-between-two-values",
      title: t("Probabilities between two values", "两值之间的概率"),
      explanation: t(
        "The area between $a$ and $b$ is the area to the left of $b$ minus the area to the left of $a$:\n\n$$P(a < Z < b) = \\Phi(b) - \\Phi(a).$$\n\nSince the curve is symmetric about $0$, $\\Phi(0) = 0.5$, so $P(0 < Z < b) = \\Phi(b) - 0.5$. With $\\Phi(1) = 0.8413$ and $\\Phi(2) = 0.9772$: $P(1 < Z < 2) = 0.9772 - 0.8413 = 0.1359$.\n\nCheck: with right tails instead, $P(Z > 1) - P(Z > 2) = 0.1587 - 0.0228 = 0.1359$.\n\n> **Watch out.** Subtract the smaller value of $\\Phi$ from the larger; adding them, or taking $\\Phi(b)$ alone, counts the area left of $a$ as well.",
        "$a$ 与 $b$ 之间的面积等于 $b$ 左侧的面积减去 $a$ 左侧的面积：\n\n$$P(a < Z < b) = \\Phi(b) - \\Phi(a).$$\n\n由于曲线关于 $0$ 对称，$\\Phi(0) = 0.5$，所以 $P(0 < Z < b) = \\Phi(b) - 0.5$。由 $\\Phi(1) = 0.8413$，$\\Phi(2) = 0.9772$ 得：$P(1 < Z < 2) = 0.9772 - 0.8413 = 0.1359$。\n\n检验：改用右侧尾部，$P(Z > 1) - P(Z > 2) = 0.1587 - 0.0228 = 0.1359$。\n\n> **注意。** 用较大的 $\\Phi$ 值减去较小的；把它们相加，或只取 $\\Phi(b)$，都把 $a$ 左侧的面积也算进去了。",
      ),
      generate(rng) {
        const fromZero = rng.bool(0.25);
        const [a, b] = fromZero ? [0, rng.pick(ZS)] : rng.sample(ZS, 2).sort((x, y) => x - y);
        const fa = phi(a!);
        const fb = phi(b!);
        const ans = fb - fa;
        const ev = `${zs(a!)} < Z < ${zs(b!)}`;
        const g = given(fromZero ? [b!] : [a!, b!]);
        const line = `P(${ev}) = \\Phi(${zs(b!)}) - \\Phi(${zs(a!)}) = ${tt(fb)} - ${tt(fa)} = ${tt(ans)}`;
        const check = steps(`P(Z > ${zs(a!)}) - P(Z > ${zs(b!)}) = ${tt(10000 - fa)} - ${tt(10000 - fb)} = ${tt(ans)}`);
        return numberProblem({
          prompt: t(`$Z \\sim N(0, 1)$. Find $P(${ev})$.${g.en}`, `$Z \\sim N(0, 1)$。求 $P(${ev})$。${g["zh-CN"]}`),
          answer: P4(ans),
          form: "decimal",
          mistakes: distinct([
            why(
              P4(fb + fa - 10000),
              `This replaces $\\Phi(${zs(a!)})$ by $1 - \\Phi(${zs(a!)})$, as if the lower endpoint were $-${zs(a!)}$.`,
              `这把 $\\Phi(${zs(a!)})$ 换成了 $1 - \\Phi(${zs(a!)})$，好像下端点是 $-${zs(a!)}$。`,
            ),
            why(P4(10000 - ans), "This is the area outside the interval.", "这是区间外的面积。"),
            why(
              P4(fb),
              `This is $\\Phi(${zs(b!)})$, all the area left of $${zs(b!)}$; subtract the area left of $${zs(a!)}$.`,
              `这是 $${zs(b!)}$ 左侧的全部面积 $\\Phi(${zs(b!)})$；还要减去 $${zs(a!)}$ 左侧的面积。`,
            ),
          ]),
          solution: t(
            `**Step 1: Write the area as a difference.** The area between $${zs(a!)}$ and $${zs(b!)}$ is the area left of $${zs(b!)}$ minus the area left of $${zs(a!)}$${fromZero ? ", and $\\Phi(0) = 0.5$ by symmetry" : ""}.\n\n**Step 2: Subtract.**${steps(line)}**Check.** Use the right tails instead:${check}`,
            `**第一步：把面积写成差。**$${zs(a!)}$ 与 $${zs(b!)}$ 之间的面积等于 $${zs(b!)}$ 左侧的面积减去 $${zs(a!)}$ 左侧的面积${fromZero ? "，由对称性 $\\Phi(0) = 0.5$" : ""}。\n\n**第二步：相减。**${steps(line)}**检验。**改用右侧尾部：${check}`,
          ),
        });
      },
    },
  ],
};

/** symmetryOfTheStandardNormal covers probabilities involving negative z by symmetry. */
const symmetryOfTheStandardNormal: TopicDef = {
  id: "symmetry-properties-of-the-standard-normal-distribution",
  title: t("Symmetry Properties of the Standard Normal Distribution", "标准正态分布的对称性"),
  summary: t(
    "Use the symmetry of the standard normal curve about 0, Φ(−a) = 1 − Φ(a), to find probabilities involving negative values, symmetric intervals P(−a < Z < a) = 2Φ(a) − 1, and intervals across 0.",
    "利用标准正态曲线关于 0 的对称性 Φ(−a) = 1 − Φ(a)，求涉及负值的概率、对称区间的概率 P(−a < Z < a) = 2Φ(a) − 1，以及跨过 0 的区间的概率。",
  ),
  prerequisites: ["the-standard-normal-distribution"],
  encompasses: [{ topic: "the-standard-normal-distribution", weight: 0.6 }],
  xp: 16,
  standards: ["CCSS.HSS.ID.A.4"],
  intro: t(
    `Fold the standard normal curve along the vertical line at $0$: the two halves match. So the area to the left of $-1$ equals the area to the right of $1$, and with $\\Phi(1) = 0.8413$, $P(Z < -1) = 1 - 0.8413 = 0.1587$.

Check: the areas left of $-1$, between $-1$ and $1$, and right of $1$ must add up to $1$, and $0.1587 + 0.6826 + 0.1587 = 1$, where $0.6826 = 0.8413 - 0.1587$.

In this lesson we use this symmetry to find probabilities for negative values of $z$, for intervals centered at $0$, and for intervals with negative endpoints.`,
    `把标准正态曲线沿 $0$ 处的竖直线对折，两半完全重合。所以 $-1$ 左侧的面积等于 $1$ 右侧的面积；由 $\\Phi(1) = 0.8413$ 得 $P(Z < -1) = 1 - 0.8413 = 0.1587$。

检验：$-1$ 左侧、$-1$ 与 $1$ 之间、$1$ 右侧三块面积之和必须为 $1$，而 $0.1587 + 0.6826 + 0.1587 = 1$，其中 $0.6826 = 0.8413 - 0.1587$。

本课利用这种对称性，求 $z$ 为负值时的概率、以 $0$ 为中心的区间的概率，以及端点为负的区间的概率。`,
  ),
  knowledgePoints: [
    {
      id: "negative-values-of-z",
      title: t("Negative values of z", "z 为负值"),
      explanation: t(
        "Tables give $\\Phi(a)$ only for $a \\ge 0$. The curve is symmetric about $0$, so the area to the left of $-a$ equals the area to the right of $a$:\n\n$$\\Phi(-a) = P(Z < -a) = P(Z > a) = 1 - \\Phi(a), \\qquad P(Z > -a) = \\Phi(a).$$\n\nWith $\\Phi(1.5) = 0.9332$: $P(Z < -1.5) = 0.0668$ and $P(Z > -1.5) = 0.9332$.\n\nCheck: the two answers are complementary, $0.0668 + 0.9332 = 1$, and the area left of $-1.5$ is small, as a point left of the center should give.\n\n> **Watch out.** A negative $z$ lies left of the center, so $P(Z < -a)$ is less than $0.5$ and $P(Z > -a)$ is more than $0.5$. If your answer is on the wrong side of $0.5$, you have taken the complement once too often.",
        "表中只给出 $a \\ge 0$ 时的 $\\Phi(a)$。曲线关于 $0$ 对称，所以 $-a$ 左侧的面积等于 $a$ 右侧的面积：\n\n$$\\Phi(-a) = P(Z < -a) = P(Z > a) = 1 - \\Phi(a), \\qquad P(Z > -a) = \\Phi(a).$$\n\n由 $\\Phi(1.5) = 0.9332$ 得：$P(Z < -1.5) = 0.0668$，$P(Z > -1.5) = 0.9332$。\n\n检验：两个结果互补，$0.0668 + 0.9332 = 1$；而且 $-1.5$ 在中心左侧，其左侧的面积应当很小。\n\n> **注意。** 负的 $z$ 位于中心左侧，所以 $P(Z < -a)$ 小于 $0.5$，$P(Z > -a)$ 大于 $0.5$。如果结果落在 $0.5$ 的另一侧，说明多取了一次补。",
      ),
      generate(rng) {
        const a = rng.pick(ZS);
        const below = rng.bool();
        const f = phi(a);
        const ans = below ? 10000 - f : f;
        const ev = `Z ${below ? "<" : ">"} -${zs(a)}`;
        const g = given([a]);
        const line = below ? `P(${ev}) = P(Z > ${zs(a)}) = 1 - ${tt(f)} = ${tt(ans)}` : `P(${ev}) = P(Z < ${zs(a)}) = ${tt(f)}`;
        const other = below ? `Z > -${zs(a)}` : `Z < -${zs(a)}`;
        return numberProblem({
          prompt: t(`$Z \\sim N(0, 1)$. Find $P(${ev})$.${g.en}`, `$Z \\sim N(0, 1)$。求 $P(${ev})$。${g["zh-CN"]}`),
          answer: P4(ans),
          form: "decimal",
          mistakes: distinct([
            why(
              P4(10000 - ans),
              `This is $P(${other})$, the other side of $-${zs(a)}$; ${below ? "the area left of a negative value is less than $0.5$" : "the area right of a negative value is more than $0.5$"}.`,
              `这是 $-${zs(a)}$ 另一侧的概率 $P(${other})$；${below ? "负值左侧的面积小于 $0.5$" : "负值右侧的面积大于 $0.5$"}。`,
            ),
            why(
              P4(f - 5000),
              `This is the area between $0$ and $${zs(a)}$, $\\Phi(${zs(a)}) - 0.5$, not the area beyond $-${zs(a)}$.`,
              `这是 $0$ 与 $${zs(a)}$ 之间的面积 $\\Phi(${zs(a)}) - 0.5$，不是所求的面积。`,
            ),
          ]),
          solution: t(
            `**Step 1: Reflect in $0$.** By symmetry, $P(${ev}) = P(Z ${below ? ">" : "<"} ${zs(a)})$.\n\n**Step 2: Use the table value $\\Phi(${zs(a)}) = ${tt(f)}$.**${steps(line)}**Check.** The areas on the two sides of $-${zs(a)}$ add up to $1$, and $P(${other}) = ${tt(10000 - ans)}$ by the same reflection:${steps(`${tt(ans)} + ${tt(10000 - ans)} = 1`)}The answer is ${below ? "below" : "above"} $0.5$, as it should be for the ${below ? "left" : "right"} side of a negative value.`,
            `**第一步：关于 $0$ 作对称。**由对称性，$P(${ev}) = P(Z ${below ? ">" : "<"} ${zs(a)})$。\n\n**第二步：用表中的值 $\\Phi(${zs(a)}) = ${tt(f)}$。**${steps(line)}**检验。**$-${zs(a)}$ 两侧的面积之和为 $1$，由同样的对称得 $P(${other}) = ${tt(10000 - ans)}$：${steps(`${tt(ans)} + ${tt(10000 - ans)} = 1`)}结果${below ? "小于" : "大于"} $0.5$，与负值${below ? "左" : "右"}侧的面积相符。`,
          ),
        });
      },
    },
    {
      id: "symmetric-intervals",
      title: t("Symmetric intervals", "对称区间"),
      explanation: t(
        "The standard normal curve is symmetric about zero, so an interval centered at zero leaves the same area in the left tail as in the right tail. The interval from $-a$ to $a$ leaves two equal tails, each $1 - \\Phi(a)$:\n\n$$P(-a < Z < a) = 1 - 2(1 - \\Phi(a)) = 2\\Phi(a) - 1, \\qquad P(|Z| > a) = 2(1 - \\Phi(a)).$$\n\nWith $\\Phi(2) = 0.9772$: $P(-2 < Z < 2) = 0.9544$ and $P(|Z| > 2) = 0.0456$.\n\nCheck: the interval is two equal halves, $0$ to $2$ and $-2$ to $0$, each $0.9772 - 0.5 = 0.4772$, and $2 \\cdot 0.4772 = 0.9544$.\n\n> **Watch out.** There are two tails, so double the tail $1 - \\Phi(a)$; $1 - \\Phi(a)$ alone, or $\\Phi(a) - 0.5$ alone, covers only one side.",
        "标准正态曲线关于零对称，所以以零为中心的区间在左尾和右尾留下的面积相同。从 $-a$ 到 $a$ 的区间两侧留下两个相等的尾部，各为 $1 - \\Phi(a)$：\n\n$$P(-a < Z < a) = 1 - 2(1 - \\Phi(a)) = 2\\Phi(a) - 1, \\qquad P(|Z| > a) = 2(1 - \\Phi(a)).$$\n\n由 $\\Phi(2) = 0.9772$ 得：$P(-2 < Z < 2) = 0.9544$，$P(|Z| > 2) = 0.0456$。\n\n检验：这个区间由 $0$ 到 $2$ 和 $-2$ 到 $0$ 两个相等的半区间组成，各为 $0.9772 - 0.5 = 0.4772$，而 $2 \\cdot 0.4772 = 0.9544$。\n\n> **注意。** 尾部有两个，所以要把尾部 $1 - \\Phi(a)$ 加倍；单独的 $1 - \\Phi(a)$ 或 $\\Phi(a) - 0.5$ 只覆盖了一侧。",
      ),
      generate(rng) {
        const a = rng.pick(ZS);
        const inside = rng.bool();
        const f = phi(a);
        const ans = inside ? 2 * f - 10000 : 2 * (10000 - f);
        const ev = inside ? `-${zs(a)} < Z < ${zs(a)}` : `|Z| > ${zs(a)}`;
        const g = given([a]);
        const line = inside
          ? `P(${ev}) = 2\\Phi(${zs(a)}) - 1 = 2(${tt(f)}) - 1 = ${tt(ans)}`
          : `P(${ev}) = 2(1 - \\Phi(${zs(a)})) = 2(${tt(10000 - f)}) = ${tt(ans)}`;
        const check = inside
          ? steps(`2(\\Phi(${zs(a)}) - 0.5) = 2(${tt(f - 5000)}) = ${tt(ans)}`)
          : steps(`1 - P(-${zs(a)} < Z < ${zs(a)}) = 1 - (2(${tt(f)}) - 1) = 1 - ${tt(2 * f - 10000)} = ${tt(ans)}`);
        return numberProblem({
          prompt: t(`$Z \\sim N(0, 1)$. Find $P(${ev})$.${g.en}`, `$Z \\sim N(0, 1)$。求 $P(${ev})$。${g["zh-CN"]}`),
          answer: P4(ans),
          form: "decimal",
          mistakes: distinct([
            why(
              P4(10000 - ans),
              inside
                ? "This is the area of the two tails, outside the interval."
                : "This is the area between the two values, not the two tails.",
              inside ? "这是区间外两个尾部的面积。" : "这是两值之间的面积，而不是两个尾部。",
            ),
            why(P4(f - 5000), `This is only the half from $0$ to $${zs(a)}$.`, `这只是从 $0$ 到 $${zs(a)}$ 的一半。`),
            why(
              P4(10000 - f),
              `This is one tail, $P(Z > ${zs(a)})$; ${inside ? "both tails must be removed" : `there is a second, equal tail below $-${zs(a)}$`}.`,
              `这只是一个尾部 $P(Z > ${zs(a)})$；${inside ? "两个尾部都要去掉" : `$-${zs(a)}$ 以下还有一个相等的尾部`}。`,
            ),
          ]),
          solution: t(
            `**Step 1: Find one tail.** By the table, $P(Z > ${zs(a)}) = 1 - ${tt(f)} = ${tt(10000 - f)}$, and by symmetry $P(Z < -${zs(a)})$ is the same.\n\n**Step 2: ${inside ? "Remove the two equal tails" : "Add the two equal tails"}.**${steps(line)}**Check.** ${inside ? "Add the two equal halves on either side of $0$ instead:" : "Subtract the middle area from $1$ instead:"}${check}`,
            `**第一步：求一个尾部。**由表，$P(Z > ${zs(a)}) = 1 - ${tt(f)} = ${tt(10000 - f)}$，由对称性 $P(Z < -${zs(a)})$ 与之相等。\n\n**第二步：${inside ? "去掉两个相等的尾部" : "把两个相等的尾部相加"}。**${steps(line)}**检验。**${inside ? "改为把 $0$ 两侧相等的两半相加：" : "改用 $1$ 减去中间的面积："}${check}`,
          ),
        });
      },
    },
    {
      id: "intervals-with-negative-endpoints",
      title: t("Intervals with negative endpoints", "端点为负的区间"),
      explanation: t(
        "Tables and calculators often give the area to the left of positive values only, so use symmetry to turn each negative endpoint into a positive one. Write every probability as a difference of values of $\\Phi$ and replace $\\Phi(-a)$ by $1 - \\Phi(a)$:\n\n$$P(-a < Z < b) = \\Phi(b) - (1 - \\Phi(a)) = \\Phi(a) + \\Phi(b) - 1,$$\n\n$$P(-b < Z < -a) = P(a < Z < b) = \\Phi(b) - \\Phi(a).$$\n\nWith $\\Phi(1) = 0.8413$ and $\\Phi(2) = 0.9772$: $P(-1 < Z < 2) = 0.8185$ and $P(-2 < Z < -1) = 0.1359$.\n\nCheck: split $-1 < Z < 2$ at $0$ into $(0.8413 - 0.5) + (0.9772 - 0.5) = 0.3413 + 0.4772 = 0.8185$.\n\n> **Watch out.** Replace $\\Phi(-a)$ by $1 - \\Phi(a)$, not by $\\Phi(a)$: $0.9772 - 0.8413 = 0.1359$ is the answer for $1 < Z < 2$, not for $-1 < Z < 2$.",
        "表格和计算器常常只给出正值左侧的面积，所以要利用对称性把每个负的端点化为正的端点。把每个概率写成 $\\Phi$ 的值之差，并把 $\\Phi(-a)$ 换成 $1 - \\Phi(a)$：\n\n$$P(-a < Z < b) = \\Phi(b) - (1 - \\Phi(a)) = \\Phi(a) + \\Phi(b) - 1,$$\n\n$$P(-b < Z < -a) = P(a < Z < b) = \\Phi(b) - \\Phi(a).$$\n\n由 $\\Phi(1) = 0.8413$，$\\Phi(2) = 0.9772$ 得：$P(-1 < Z < 2) = 0.8185$，$P(-2 < Z < -1) = 0.1359$。\n\n检验：把 $-1 < Z < 2$ 在 $0$ 处分开，$(0.8413 - 0.5) + (0.9772 - 0.5) = 0.3413 + 0.4772 = 0.8185$。\n\n> **注意。** 要把 $\\Phi(-a)$ 换成 $1 - \\Phi(a)$，而不是 $\\Phi(a)$：$0.9772 - 0.8413 = 0.1359$ 是 $1 < Z < 2$ 的答案，不是 $-1 < Z < 2$ 的答案。",
      ),
      generate(rng) {
        const across = rng.bool();
        const [a, b] = across ? [rng.pick(ZS), rng.pick(ZS)] : rng.sample(ZS, 2).sort((x, y) => x - y);
        const fa = phi(a!);
        const fb = phi(b!);
        const ans = across ? fa + fb - 10000 : fb - fa;
        const ev = across ? `-${zs(a!)} < Z < ${zs(b!)}` : `-${zs(b!)} < Z < -${zs(a!)}`;
        const g = given([a!, b!]);
        const line = across
          ? `P(${ev}) = \\Phi(${zs(b!)}) - (1 - \\Phi(${zs(a!)})) = ${tt(fb)} - ${tt(10000 - fa)} = ${tt(ans)}`
          : `P(${ev}) = P(${zs(a!)} < Z < ${zs(b!)}) = ${tt(fb)} - ${tt(fa)} = ${tt(ans)}`;
        const check = across
          ? steps(`(\\Phi(${zs(a!)}) - 0.5) + (\\Phi(${zs(b!)}) - 0.5) = ${tt(fa - 5000)} + ${tt(fb - 5000)} = ${tt(ans)}`)
          : steps(`\\Phi(-${zs(a!)}) - \\Phi(-${zs(b!)}) = ${tt(10000 - fa)} - ${tt(10000 - fb)} = ${tt(ans)}`);
        return numberProblem({
          prompt: t(`$Z \\sim N(0, 1)$. Find $P(${ev})$.${g.en}`, `$Z \\sim N(0, 1)$。求 $P(${ev})$。${g["zh-CN"]}`),
          answer: P4(ans),
          form: "decimal",
          mistakes: distinct([
            why(
              P4(Math.abs(fb - fa)),
              `This uses $\\Phi(${zs(a!)})$ for $\\Phi(-${zs(a!)})$, as if the left endpoint were positive.`,
              `这把 $\\Phi(-${zs(a!)})$ 当成了 $\\Phi(${zs(a!)})$，好像左端点是正的。`,
            ),
            why(
              P4(20000 - fa - fb),
              across
                ? "This is the area of the two tails, outside the interval."
                : `This adds the tails $1 - \\Phi(${zs(a!)})$ and $1 - \\Phi(${zs(b!)})$; the area between is their difference.`,
              across
                ? "这是区间外两个尾部的面积。"
                : `这把尾部 $1 - \\Phi(${zs(a!)})$ 与 $1 - \\Phi(${zs(b!)})$ 相加了；两值之间的面积是它们的差。`,
            ),
            why(
              P4(fa + fb - 10000),
              `This treats the interval as if it crossed $0$; both endpoints are negative, so it lies entirely left of $0$.`,
              `这把区间当成跨过 $0$ 的；两个端点都是负的，所以区间整个在 $0$ 的左侧。`,
            ),
            why(P4(10000 - ans), "This is the area outside the interval.", "这是区间外的面积。"),
          ]),
          solution: t(
            `**Step 1: Turn the negative endpoints into positive ones.** ${across ? `Replace $\\Phi(-${zs(a!)})$ by $1 - \\Phi(${zs(a!)}) = ${tt(10000 - fa)}$.` : `Reflecting in $0$, the interval $(-${zs(b!)}, -${zs(a!)})$ has the same area as $(${zs(a!)}, ${zs(b!)})$.`}\n\n**Step 2: Subtract the areas to the left.**${steps(line)}**Check.** ${across ? "Split the interval at $0$:" : "Use $\\Phi(-a) = 1 - \\Phi(a)$ directly on both endpoints:"}${check}`,
            `**第一步：把负的端点化为正的。**${across ? `把 $\\Phi(-${zs(a!)})$ 换成 $1 - \\Phi(${zs(a!)}) = ${tt(10000 - fa)}$。` : `关于 $0$ 对称，区间 $(-${zs(b!)}, -${zs(a!)})$ 与 $(${zs(a!)}, ${zs(b!)})$ 的面积相同。`}\n\n**第二步：用左侧面积相减。**${steps(line)}**检验。**${across ? "在 $0$ 处把区间分开：" : "直接对两个端点用 $\\Phi(-a) = 1 - \\Phi(a)$："}${check}`,
          ),
        });
      },
    },
  ],
};

/** normalNotation writes X ~ N(μ, σ²) with the variance evaluated. */
const normalNotation = (mu: number, sigma: number) => `X \\sim N(${mu}, ${sigma * sigma})`;

/** xAt writes μ + zσ for z in hundredths. */
const xAt = (mu: number, sigma: number, z: number) => Q.of(mu * 100 + z * sigma, 100);

/** theNormalDistribution covers standardizing and probabilities for X ~ N(μ, σ²). */
const theNormalDistribution: TopicDef = {
  id: "the-normal-distribution",
  title: t("The Normal Distribution", "正态分布"),
  summary: t(
    "Standardize a normal random variable X ~ N(μ, σ²) with z = (x − μ)/σ, and use values of Φ to find probabilities that X lies below, above or between given values.",
    "用 z = (x − μ)/σ 把正态随机变量 X ~ N(μ, σ²) 标准化，并利用 Φ 的值求 X 小于、大于或介于给定值之间的概率。",
  ),
  prerequisites: ["symmetry-properties-of-the-standard-normal-distribution"],
  encompasses: [],
  xp: 18,
  standards: ["CCSS.HSS.ID.A.4"],
  intro: t(
    `Test scores are normal with mean $70$ and standard deviation $10$. A score of $85$ is $\\frac{85 - 70}{10} = 1.5$ standard deviations above the mean, so the fraction of scores below $85$ is the area to the left of $1.5$ under the standard normal curve, $\\Phi(1.5) = 0.9332$.

Check: going back, $70 + 1.5 \\cdot 10 = 85$, so $z = 1.5$ does correspond to the score $85$.

In this lesson we standardize values of any normal variable and use the table of $\\Phi$ to find probabilities below, above and between values.`,
    `某次测验的成绩服从均值 $70$、标准差 $10$ 的正态分布。$85$ 分比均值高 $\\frac{85 - 70}{10} = 1.5$ 个标准差，所以低于 $85$ 分的比例就是标准正态曲线下 $1.5$ 左侧的面积 $\\Phi(1.5) = 0.9332$。

检验：反过来，$70 + 1.5 \\cdot 10 = 85$，所以 $z = 1.5$ 确实对应 $85$ 分。

本课学习把任意正态变量的值标准化，并用 $\\Phi$ 的表求某值以下、某值以上以及两值之间的概率。`,
  ),
  knowledgePoints: [
    {
      id: "standardizing-a-value",
      title: t("Standardizing a value", "标准化"),
      explanation: t(
        "A **normal** random variable $X \\sim N(\\mu, \\sigma^2)$ has a bell-shaped curve centered at its mean $\\mu$, with standard deviation $\\sigma$ (the second parameter is the **variance** $\\sigma^2$). Every normal distribution is a shifted and stretched copy of the standard one: the **z-score**\n\n$$z = \\frac{x - \\mu}{\\sigma}$$\n\ncounts how many standard deviations $x$ lies above the mean, and $Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)$. For $X \\sim N(50, 16)$, $\\sigma = 4$ and $x = 44$ has $z = \\frac{44 - 50}{4} = -1.5$.\n\nCheck: $50 + (-1.5)(4) = 44$, and the z-score is negative because $44$ is below the mean.\n\n> **Watch out.** Divide by the standard deviation $\\sigma = 4$, not by the variance $16$, and subtract the mean from $x$, not $x$ from the mean.",
        "**正态**随机变量 $X \\sim N(\\mu, \\sigma^2)$ 的曲线是以均值 $\\mu$ 为中心的钟形，标准差为 $\\sigma$（第二个参数是**方差** $\\sigma^2$）。每个正态分布都是标准正态分布平移并伸缩后的结果：**z 分数**\n\n$$z = \\frac{x - \\mu}{\\sigma}$$\n\n表示 $x$ 比均值高出多少个标准差，并且 $Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)$。对 $X \\sim N(50, 16)$，$\\sigma = 4$，$x = 44$ 的 z 分数为 $z = \\frac{44 - 50}{4} = -1.5$。\n\n检验：$50 + (-1.5)(4) = 44$；$44$ 低于均值，所以 z 分数为负。\n\n> **注意。** 要除以标准差 $\\sigma = 4$，而不是方差 $16$；并且用 $x$ 减去均值，而不是用均值减去 $x$。",
      ),
      generate(rng) {
        const mu = rng.int(20, 120);
        const sigma = rng.pick([4, 8, 12, 16, 20]);
        const k = rng.nonZero(-12, 12);
        const x = mu + (k * sigma) / 4;
        const z = Q.of(k, 4);
        return numberProblem({
          prompt: t(
            `$${normalNotation(mu, sigma)}$. Find the z-score of $x = ${x}$.`,
            `$${normalNotation(mu, sigma)}$。求 $x = ${x}$ 的 z 分数。`,
          ),
          answer: z,
          form: "decimal",
          mistakes: distinct([
            why(
              Q.of(k * sigma, 4 * sigma * sigma),
              `This divides by the variance $${sigma * sigma}$; divide by the standard deviation $${sigma}$.`,
              `这除以的是方差 $${sigma * sigma}$；应当除以标准差 $${sigma}$。`,
            ),
            why(
              z.neg(),
              `This has the wrong sign: $${x}$ is ${x > mu ? "above" : "below"} the mean, so $z$ is ${x > mu ? "positive" : "negative"}.`,
              `符号错了：$${x}$ ${x > mu ? "高于" : "低于"}均值，所以 $z$ 是${x > mu ? "正" : "负"}的。`,
            ),
            why(
              Q.of(x - mu),
              `This is $x - \\mu$, the distance from the mean; divide it by $\\sigma = ${sigma}$.`,
              `这是 $x - \\mu$，即与均值的差；还要除以 $\\sigma = ${sigma}$。`,
            ),
          ]),
          solution: t(
            `**Step 1: Find $\\sigma$.** The variance is $${sigma * sigma}$, so $\\sigma = \\sqrt{${sigma * sigma}} = ${sigma}$.\n\n**Step 2: Standardize.**${steps(`z = \\frac{${x} - ${mu}}{${sigma}} = \\frac{${x - mu}}{${sigma}} = ${dec(z)}`)}**Check.** Going $${dec(z)}$ standard deviations from the mean lands on $${x}$:${steps(`${mu} + (${dec(z)})(${sigma}) = ${x}`)}`,
            `**第一步：求 $\\sigma$。**方差为 $${sigma * sigma}$，所以 $\\sigma = \\sqrt{${sigma * sigma}} = ${sigma}$。\n\n**第二步：标准化。**${steps(`z = \\frac{${x} - ${mu}}{${sigma}} = \\frac{${x - mu}}{${sigma}} = ${dec(z)}`)}**检验。**从均值出发走 $${dec(z)}$ 个标准差，正好到 $${x}$：${steps(`${mu} + (${dec(z)})(${sigma}) = ${x}`)}`,
          ),
        });
      },
    },
    {
      id: "probabilities-for-a-normal-variable",
      title: t("Probabilities below or above a value", "某值以下或以上的概率"),
      explanation: t(
        "Every normal distribution becomes the standard normal distribution after subtracting the mean and dividing by the standard deviation, so one table serves them all. To find a probability for $X \\sim N(\\mu, \\sigma^2)$, standardize and use $\\Phi$:\n\n$$P(X < x) = \\Phi\\left(\\frac{x - \\mu}{\\sigma}\\right), \\qquad P(X > x) = 1 - \\Phi\\left(\\frac{x - \\mu}{\\sigma}\\right).$$\n\nFor $X \\sim N(50, 16)$: $P(X < 44) = \\Phi(-1.5) = 1 - \\Phi(1.5) = 1 - 0.9332 = 0.0668$.\n\nCheck: $44$ is below the mean $50$, so less than half of the distribution lies below it, and $0.0668 < 0.5$.\n\n> **Watch out.** Keep the sign of $z$. Dropping it here would give $\\Phi(1.5) = 0.9332$, the probability below $56$, not below $44$.",
        "任何正态分布在减去平均数并除以标准差后都变为标准正态分布，所以一张表就能用于所有正态分布。求 $X \\sim N(\\mu, \\sigma^2)$ 的概率时，先标准化再用 $\\Phi$：\n\n$$P(X < x) = \\Phi\\left(\\frac{x - \\mu}{\\sigma}\\right), \\qquad P(X > x) = 1 - \\Phi\\left(\\frac{x - \\mu}{\\sigma}\\right).$$\n\n对 $X \\sim N(50, 16)$：$P(X < 44) = \\Phi(-1.5) = 1 - \\Phi(1.5) = 1 - 0.9332 = 0.0668$。\n\n检验：$44$ 低于均值 $50$，所以分布中不到一半在它下方，而 $0.0668 < 0.5$。\n\n> **注意。** 要保留 $z$ 的符号。这里若丢掉符号，会得到 $\\Phi(1.5) = 0.9332$，那是低于 $56$ 的概率，而不是低于 $44$ 的概率。",
      ),
      generate(rng) {
        const mu = rng.int(10, 100);
        const sigma = rng.int(2, 12);
        const z = rng.pick(ZS) * rng.sign();
        const x = xAt(mu, sigma, z);
        const below = rng.bool();
        const f = phi(z);
        const ans = below ? f : 10000 - f;
        const ev = `X ${below ? "<" : ">"} ${dec(x)}`;
        const g = given([z]);
        const zLine = `z = \\frac{${dec(x)} - ${mu}}{${sigma}} = ${zs(z)}`;
        const pLine = below ? `P(${ev}) = \\Phi(${zs(z)}) = ${tt(ans)}` : `P(${ev}) = 1 - \\Phi(${zs(z)}) = 1 - ${tt(f)} = ${tt(ans)}`;
        const more = (below && z > 0) || (!below && z < 0);
        return numberProblem({
          prompt: t(
            `$${normalNotation(mu, sigma)}$. Find $P(${ev})$.${g.en}`,
            `$${normalNotation(mu, sigma)}$。求 $P(${ev})$。${g["zh-CN"]}`,
          ),
          answer: P4(ans),
          form: "decimal",
          mistakes: distinct([
            why(P4(10000 - ans), `This is the probability on the other side of $${dec(x)}$.`, `这是 $${dec(x)}$ 另一侧的概率。`),
            why(
              P4(phi(Math.abs(z))),
              `This drops the minus sign of $z = ${zs(z)}$ and uses $\\Phi(${zs(-z)})$.`,
              `这丢掉了 $z = ${zs(z)}$ 的负号，用了 $\\Phi(${zs(-z)})$。`,
            ),
            why(
              P4(10000 - phi(Math.abs(z))),
              `This drops the minus sign of $z = ${zs(z)}$ and uses $1 - \\Phi(${zs(-z)})$.`,
              `这丢掉了 $z = ${zs(z)}$ 的负号，用了 $1 - \\Phi(${zs(-z)})$。`,
            ),
          ]),
          solution: t(
            `**Step 1: Standardize with $\\sigma = \\sqrt{${sigma * sigma}} = ${sigma}$.**${steps(zLine)}**Step 2: Use $\\Phi$.**${z < 0 ? ` Here $\\Phi(${zs(z)}) = 1 - \\Phi(${zs(-z)}) = ${tt(f)}$.` : ""}${steps(pLine)}**Check.** $${dec(x)}$ is ${z > 0 ? "above" : "below"} the mean $${mu}$, so the probability ${below ? "below" : "above"} it is ${more ? "more" : "less"} than $0.5$, and $${tt(ans)}$ ${more ? ">" : "<"} $0.5$; the two sides add up to $1$:${steps(`${tt(ans)} + ${tt(10000 - ans)} = 1`)}`,
            `**第一步：用 $\\sigma = \\sqrt{${sigma * sigma}} = ${sigma}$ 标准化。**${steps(zLine)}**第二步：用 $\\Phi$。**${z < 0 ? `其中 $\\Phi(${zs(z)}) = 1 - \\Phi(${zs(-z)}) = ${tt(f)}$。` : ""}${steps(pLine)}**检验。**$${dec(x)}$ ${z > 0 ? "高于" : "低于"}均值 $${mu}$，所以它${below ? "以下" : "以上"}的概率${more ? "大于" : "小于"} $0.5$，确实 $${tt(ans)}$ ${more ? ">" : "<"} $0.5$；两侧之和为 $1$：${steps(`${tt(ans)} + ${tt(10000 - ans)} = 1`)}`,
          ),
        });
      },
    },
    {
      id: "probabilities-between-two-values-of-a-normal-variable",
      title: t("Probabilities between two values", "两值之间的概率"),
      explanation: t(
        "The probability of landing between two values is the area to the left of the larger one minus the area to the left of the smaller one. Standardize both endpoints and subtract:\n\n$$P(x_1 < X < x_2) = \\Phi(z_2) - \\Phi(z_1), \\qquad z_i = \\frac{x_i - \\mu}{\\sigma}.$$\n\nFor $X \\sim N(50, 16)$: $P(46 < X < 58) = \\Phi(2) - \\Phi(-1) = 0.9772 - (1 - 0.8413) = 0.8185$.\n\nCheck: split at the mean $50$: $(0.8413 - 0.5) + (0.9772 - 0.5) = 0.3413 + 0.4772 = 0.8185$.\n\n> **Watch out.** Standardize each endpoint with its own sign; using $\\Phi(1)$ for $\\Phi(-1)$ gives $0.9772 - 0.8413 = 0.1359$, the probability for $54 < X < 58$.",
        "落在两个值之间的概率，等于较大值左侧的面积减去较小值左侧的面积。把两个端点都标准化后相减：\n\n$$P(x_1 < X < x_2) = \\Phi(z_2) - \\Phi(z_1), \\qquad z_i = \\frac{x_i - \\mu}{\\sigma}.$$\n\n对 $X \\sim N(50, 16)$：$P(46 < X < 58) = \\Phi(2) - \\Phi(-1) = 0.9772 - (1 - 0.8413) = 0.8185$。\n\n检验：在均值 $50$ 处分开：$(0.8413 - 0.5) + (0.9772 - 0.5) = 0.3413 + 0.4772 = 0.8185$。\n\n> **注意。** 每个端点都要带着自己的符号标准化；把 $\\Phi(-1)$ 当成 $\\Phi(1)$，会得到 $0.9772 - 0.8413 = 0.1359$，那是 $54 < X < 58$ 的概率。",
      ),
      generate(rng) {
        const mu = rng.int(10, 100);
        const sigma = rng.int(2, 12);
        let z1 = rng.pick(ZS) * rng.sign();
        let z2 = rng.pick(ZS) * rng.sign();
        if (z1 === z2) z2 = -z2;
        if (z1 > z2) [z1, z2] = [z2, z1];
        const x1 = xAt(mu, sigma, z1);
        const x2 = xAt(mu, sigma, z2);
        const f1 = phi(z1);
        const f2 = phi(z2);
        const ans = f2 - f1;
        const ev = `${dec(x1)} < X < ${dec(x2)}`;
        const g = given([z1, z2]);
        const zLine = `z_1 = \\frac{${dec(x1)} - ${mu}}{${sigma}} = ${zs(z1)}, \\quad z_2 = \\frac{${dec(x2)} - ${mu}}{${sigma}} = ${zs(z2)}`;
        const pLine = `P(${ev}) = \\Phi(${zs(z2)}) - \\Phi(${zs(z1)}) = ${tt(f2)} - ${tt(f1)} = ${tt(ans)}`;
        const a1 = phi(Math.abs(z1));
        const a2 = phi(Math.abs(z2));
        const check = steps(`P(X > ${dec(x1)}) - P(X > ${dec(x2)}) = ${tt(10000 - f1)} - ${tt(10000 - f2)} = ${tt(ans)}`);
        const negs = [z1, z2].filter((z) => z < 0);
        return numberProblem({
          prompt: t(
            `$${normalNotation(mu, sigma)}$. Find $P(${ev})$.${g.en}`,
            `$${normalNotation(mu, sigma)}$。求 $P(${ev})$。${g["zh-CN"]}`,
          ),
          answer: P4(ans),
          form: "decimal",
          mistakes: distinct([
            why(
              P4(Math.abs(a2 - a1)),
              "This drops the minus sign of a negative z-score, using $\\Phi(|z|)$ in place of $\\Phi(z)$.",
              "这丢掉了负的 z 分数的符号，用 $\\Phi(|z|)$ 代替了 $\\Phi(z)$。",
            ),
            why(
              P4(a1 + a2 - 10000),
              "This treats the interval as if it contained the mean, with one endpoint on each side of it.",
              "这把区间当成包含均值、两个端点分在均值两侧的情形。",
            ),
            why(P4(10000 - ans), "This is the probability outside the interval.", "这是区间外的概率。"),
          ]),
          solution: t(
            `**Step 1: Standardize both endpoints with $\\sigma = ${sigma}$.**${steps(zLine)}${negs.length > 0 ? `For a negative z-score use $\\Phi(-a) = 1 - \\Phi(a)$: ${negs.map((z) => `$\\Phi(${zs(z)}) = ${tt(phi(z))}$`).join(", ")}.\n\n` : ""}**Step 2: Subtract the areas to the left.**${steps(pLine)}**Check.** Use the areas to the right instead:${check}`,
            `**第一步：用 $\\sigma = ${sigma}$ 把两个端点标准化。**${steps(zLine)}${negs.length > 0 ? `z 分数为负时用 $\\Phi(-a) = 1 - \\Phi(a)$：${negs.map((z) => `$\\Phi(${zs(z)}) = ${tt(phi(z))}$`).join("，")}。\n\n` : ""}**第二步：用左侧面积相减。**${steps(pLine)}**检验。**改用右侧面积：${check}`,
          ),
        });
      },
    },
  ],
};

/** meanAndVarianceOfTheNormal covers the parameters of a normal distribution and finding them from probabilities. */
const meanAndVarianceOfTheNormal: TopicDef = {
  id: "mean-and-variance-of-the-normal-distribution",
  title: t("Mean and Variance of the Normal Distribution", "正态分布的均值与方差"),
  summary: t(
    "Read the mean, variance and standard deviation from X ~ N(μ, σ²), and find an unknown mean or standard deviation from a given probability by standardizing.",
    "从 X ~ N(μ, σ²) 读出均值、方差与标准差，并通过标准化由已知概率求未知的均值或标准差。",
  ),
  prerequisites: ["the-normal-distribution"],
  encompasses: [],
  xp: 18,
  standards: ["CCSS.HSS.ID.A.4"],
  intro: t(
    `A machine fills bags whose masses are normal with mean $500$ g and standard deviation $5$ g, written $N(500, 25)$: the second number is the variance $5^2 = 25$. If $P(X < 510) = 0.9772 = \\Phi(2)$, then $510$ lies $2$ standard deviations above the mean, and indeed $500 + 2 \\cdot 5 = 510$.

Check: standardizing $510$ gives $\\frac{510 - 500}{5} = 2$, the same z-score.

In this lesson we read the mean, variance and standard deviation from the notation, and run this reasoning backwards: from a known probability to an unknown mean or standard deviation.`,
    `某机器装袋，袋子的质量服从均值 $500$ g、标准差 $5$ g 的正态分布，记作 $N(500, 25)$：第二个数是方差 $5^2 = 25$。若 $P(X < 510) = 0.9772 = \\Phi(2)$，则 $510$ 比均值高 $2$ 个标准差，确实 $500 + 2 \\cdot 5 = 510$。

检验：把 $510$ 标准化得 $\\frac{510 - 500}{5} = 2$，z 分数相同。

本课学习从记号中读出均值、方差与标准差，并把这种推理倒过来：由已知概率求未知的均值或标准差。`,
  ),
  knowledgePoints: [
    {
      id: "reading-the-parameters",
      title: t("Reading the parameters", "读出参数"),
      explanation: t(
        "In $X \\sim N(\\mu, \\sigma^2)$ the first parameter is the mean $E(X) = \\mu$ and the second is the variance $\\operatorname{Var}(X) = \\sigma^2$; the standard deviation is its square root $\\sigma$.\n\n$X \\sim N(30, 25)$ has mean $30$, variance $25$ and standard deviation $5$. A normal variable with mean $12$ and standard deviation $3$ is $N(12, 9)$.\n\nCheck: squaring the standard deviation gives back the variance, $5^2 = 25$ and $3^2 = 9$.\n\n> **Watch out.** The second parameter is the variance, not the standard deviation: $N(30, 25)$ has $\\sigma = 5$, not $25$, and a standard deviation of $3$ is written $N(12, 9)$, not $N(12, 3)$.",
        "在 $X \\sim N(\\mu, \\sigma^2)$ 中，第一个参数是均值 $E(X) = \\mu$，第二个参数是方差 $\\operatorname{Var}(X) = \\sigma^2$；标准差是它的平方根 $\\sigma$。\n\n$X \\sim N(30, 25)$ 的均值为 $30$，方差为 $25$，标准差为 $5$。均值为 $12$、标准差为 $3$ 的正态变量是 $N(12, 9)$。\n\n检验：把标准差平方就回到方差，$5^2 = 25$，$3^2 = 9$。\n\n> **注意。** 第二个参数是方差，不是标准差：$N(30, 25)$ 的 $\\sigma = 5$ 而不是 $25$；标准差为 $3$ 时写作 $N(12, 9)$，而不是 $N(12, 3)$。",
      ),
      generate(rng) {
        const mu = rng.int(5, 150);
        const sigma = rng.int(2, 15);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `$${normalNotation(mu, sigma)}$. Find the standard deviation of $X$.`,
              `$${normalNotation(mu, sigma)}$。求 $X$ 的标准差。`,
            ),
            answer: sigma,
            mistakes: distinct([
              why(
                sigma * sigma,
                "This is the second parameter itself, the variance; the standard deviation is its square root.",
                "这是第二个参数本身，即方差；标准差是它的平方根。",
              ),
              why(mu, "This is the first parameter, the mean.", "这是第一个参数，即均值。"),
              why(
                Q.of(sigma * sigma, 2),
                "This halves the variance; the standard deviation is its square root.",
                "这把方差除以了 $2$；标准差是方差的平方根。",
              ),
            ]),
            solution: t(
              `**Step 1: Identify the second parameter.** In $N(\\mu, \\sigma^2)$ it is the variance, so $\\sigma^2 = ${sigma * sigma}$.\n\n**Step 2: Take the square root.**${steps(`\\sigma = \\sqrt{${sigma * sigma}} = ${sigma}`)}**Check.** Squaring gives back the variance:${steps(`${sigma}^2 = ${sigma * sigma}`)}`,
              `**第一步：认出第二个参数。**在 $N(\\mu, \\sigma^2)$ 中它是方差，所以 $\\sigma^2 = ${sigma * sigma}$。\n\n**第二步：开平方。**${steps(`\\sigma = \\sqrt{${sigma * sigma}} = ${sigma}`)}**检验。**平方后回到方差：${steps(`${sigma}^2 = ${sigma * sigma}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `$X$ is normally distributed with mean $${mu}$ and standard deviation $${sigma}$, so $X \\sim N(${mu}, v)$. Find $v$.`,
            `$X$ 服从均值为 $${mu}$、标准差为 $${sigma}$ 的正态分布，即 $X \\sim N(${mu}, v)$。求 $v$。`,
          ),
          answer: sigma * sigma,
          mistakes: distinct([
            why(
              sigma,
              "This is the standard deviation; the second parameter is the variance, its square.",
              "这是标准差；第二个参数是方差，即标准差的平方。",
            ),
            why(2 * sigma, `This doubles $${sigma}$ instead of squaring it.`, `这把 $${sigma}$ 乘以了 $2$，而不是平方。`),
            why(mu, "This is the mean, the first parameter.", "这是均值，即第一个参数。"),
          ]),
          solution: t(
            `**Step 1: Identify the second parameter.** In $N(\\mu, \\sigma^2)$ it is the variance $\\sigma^2$, with $\\sigma = ${sigma}$.\n\n**Step 2: Square the standard deviation.**${steps(`v = \\sigma^2 = ${sigma}^2 = ${sigma * sigma}`)}**Check.** The standard deviation of $N(${mu}, ${sigma * sigma})$ is:${steps(`\\sqrt{${sigma * sigma}} = ${sigma}`)}`,
            `**第一步：认出第二个参数。**在 $N(\\mu, \\sigma^2)$ 中它是方差 $\\sigma^2$，而 $\\sigma = ${sigma}$。\n\n**第二步：把标准差平方。**${steps(`v = \\sigma^2 = ${sigma}^2 = ${sigma * sigma}`)}**检验。**$N(${mu}, ${sigma * sigma})$ 的标准差为：${steps(`\\sqrt{${sigma * sigma}} = ${sigma}`)}`,
          ),
        });
      },
    },
    {
      id: "finding-the-mean-from-a-probability",
      title: t("Finding the mean from a probability", "由概率求均值"),
      explanation: t(
        "If a probability for $X$ is known, the table gives the z-score of the value, and $x = \\mu + z\\sigma$ is an equation for the unknown parameter.\n\n$X \\sim N(\\mu, 16)$ and $P(X < 30) = 0.8413$. Since $\\Phi(1) = 0.8413$, the z-score of $30$ is $1$:\n\n$$\\frac{30 - \\mu}{4} = 1 \\quad\\Rightarrow\\quad \\mu = 26.$$\n\nA probability below $0.5$ gives a negative z-score: if $P(X < 30) = 0.1587 = 1 - 0.8413$, then $z = -1$ and $\\mu = 34$.\n\nCheck: with $\\mu = 26$, $P(X < 30) = \\Phi\\left(\\frac{30 - 26}{4}\\right) = \\Phi(1) = 0.8413$.\n\n> **Watch out.** Use the standard deviation $4$, not the variance $16$, and keep the sign of $z$: $30$ is above the mean when $P(X < 30) > 0.5$, so $\\mu$ must come out less than $30$.",
        "已知 $X$ 的某个概率时，查表可得该值的 z 分数，而 $x = \\mu + z\\sigma$ 就是关于未知参数的方程。\n\n$X \\sim N(\\mu, 16)$，且 $P(X < 30) = 0.8413$。由于 $\\Phi(1) = 0.8413$，$30$ 的 z 分数为 $1$：\n\n$$\\frac{30 - \\mu}{4} = 1 \\quad\\Rightarrow\\quad \\mu = 26.$$\n\n概率小于 $0.5$ 时 z 分数为负：若 $P(X < 30) = 0.1587 = 1 - 0.8413$，则 $z = -1$，$\\mu = 34$。\n\n检验：取 $\\mu = 26$，$P(X < 30) = \\Phi\\left(\\frac{30 - 26}{4}\\right) = \\Phi(1) = 0.8413$。\n\n> **注意。** 要用标准差 $4$，而不是方差 $16$，并保留 $z$ 的符号：$P(X < 30) > 0.5$ 时 $30$ 在均值之上，所以求出的 $\\mu$ 必须小于 $30$。",
      ),
      generate(rng) {
        const mu = rng.int(20, 150);
        const sigma = rng.pick([4, 8, 12, 16, 20]);
        const z = rng.pick(QUARTER_ZS) * rng.sign();
        const x = mu + (z * sigma) / 100;
        const below = rng.bool();
        const pr = below ? phi(z) : 10000 - phi(z);
        const g = given([z]);
        const ev = `X ${below ? "<" : ">"} ${x}`;
        const zLines = zFromProbability(x, z, below, pr);
        const back = steps(
          `\\frac{${x} - ${mu}}{${sigma}} = \\frac{${x - mu}}{${sigma}} = ${zs(z)}`,
          below ? `P(${ev}) = \\Phi(${zs(z)}) = ${tt(pr)}` : `P(${ev}) = 1 - \\Phi(${zs(z)}) = 1 - ${tt(phi(z))} = ${tt(pr)}`,
        );
        return numberProblem({
          prompt: t(
            `$X \\sim N(\\mu, ${sigma * sigma})$ and $P(${ev}) = ${tt(pr)}$. Find $\\mu$.${g.en}`,
            `$X \\sim N(\\mu, ${sigma * sigma})$，且 $P(${ev}) = ${tt(pr)}$。求 $\\mu$。${g["zh-CN"]}`,
          ),
          answer: mu,
          mistakes: distinct([
            why(
              Q.of(x * 100 + z * sigma, 100),
              `This adds $z\\sigma$ to $${x}$; from $x = \\mu + z\\sigma$, $\\mu = x - z\\sigma$.`,
              `这把 $z\\sigma$ 加到了 $${x}$ 上；由 $x = \\mu + z\\sigma$ 得 $\\mu = x - z\\sigma$。`,
            ),
            why(
              Q.of(x * 100 - z * sigma * sigma, 100),
              `This multiplies $z$ by the variance $${sigma * sigma}$; the standard deviation is $${sigma}$.`,
              `这用 $z$ 乘以了方差 $${sigma * sigma}$；标准差是 $${sigma}$。`,
            ),
            why(
              Q.of(x * 100 - z, 100),
              `This subtracts $z$ itself; $z$ counts standard deviations, so subtract $z\\sigma = (${zs(z)})(${sigma})$.`,
              `这直接减去了 $z$；$z$ 是标准差的个数，应当减去 $z\\sigma = (${zs(z)})(${sigma})$。`,
            ),
          ]),
          solution: t(
            `**Step 1: Find the z-score of $${x}$ from the probability.**${steps(...zLines)}So $z = ${zs(z)}$.\n\n**Step 2: Solve for $\\mu$, with $\\sigma = \\sqrt{${sigma * sigma}} = ${sigma}$.**${steps(`\\frac{${x} - \\mu}{${sigma}} = ${zs(z)}`, `\\mu = ${x} - (${zs(z)})(${sigma}) = ${mu}`)}**Check.** Standardize $${x}$ with $\\mu = ${mu}$ and recover the given probability:${back}`,
            `**第一步：由概率求 $${x}$ 的 z 分数。**${steps(...zLines)}所以 $z = ${zs(z)}$。\n\n**第二步：解出 $\\mu$，其中 $\\sigma = \\sqrt{${sigma * sigma}} = ${sigma}$。**${steps(`\\frac{${x} - \\mu}{${sigma}} = ${zs(z)}`, `\\mu = ${x} - (${zs(z)})(${sigma}) = ${mu}`)}**检验。**取 $\\mu = ${mu}$ 把 $${x}$ 标准化，得回已知的概率：${back}`,
          ),
        });
      },
    },
    {
      id: "finding-the-standard-deviation-from-a-probability",
      title: t("Finding the standard deviation from a probability", "由概率求标准差"),
      explanation: t(
        "When the mean is known and the standard deviation is not, the same equation $\\frac{x - \\mu}{\\sigma} = z$ gives $\\sigma = \\frac{x - \\mu}{z}$.\n\n$X \\sim N(60, \\sigma^2)$ and $P(X > 70) = 0.0228$. Then $P(X < 70) = 0.9772 = \\Phi(2)$, so\n\n$$\\frac{70 - 60}{\\sigma} = 2 \\quad\\Rightarrow\\quad \\sigma = 5.$$\n\nCheck: with $\\sigma = 5$, $70$ is $\\frac{10}{5} = 2$ standard deviations above $60$, and $P(X > 70) = 1 - \\Phi(2) = 0.0228$.\n\n> **Watch out.** Divide $x - \\mu$ by $z$; do not multiply. The answer is $\\sigma$, not $\\sigma^2$, and it is always positive: $x - \\mu$ and $z$ have the same sign.",
        "当均值已知而标准差未知时，同一个方程 $\\frac{x - \\mu}{\\sigma} = z$ 给出 $\\sigma = \\frac{x - \\mu}{z}$。\n\n$X \\sim N(60, \\sigma^2)$，且 $P(X > 70) = 0.0228$。于是 $P(X < 70) = 0.9772 = \\Phi(2)$，所以\n\n$$\\frac{70 - 60}{\\sigma} = 2 \\quad\\Rightarrow\\quad \\sigma = 5.$$\n\n检验：取 $\\sigma = 5$，$70$ 比 $60$ 高 $\\frac{10}{5} = 2$ 个标准差，$P(X > 70) = 1 - \\Phi(2) = 0.0228$。\n\n> **注意。** 用 $x - \\mu$ 除以 $z$，不要相乘。所求的是 $\\sigma$ 而不是 $\\sigma^2$，并且它总是正的：$x - \\mu$ 与 $z$ 同号。",
      ),
      generate(rng) {
        const mu = rng.int(20, 150);
        const sigma = rng.pick([4, 8, 12, 16, 20]);
        const z = rng.pick(QUARTER_ZS) * rng.sign();
        const d = (z * sigma) / 100;
        const x = mu + d;
        const below = rng.bool();
        const pr = below ? phi(z) : 10000 - phi(z);
        const g = given([z]);
        const ev = `X ${below ? "<" : ">"} ${x}`;
        const zLines = zFromProbability(x, z, below, pr);
        const back = steps(
          `\\frac{${x} - ${mu}}{${sigma}} = \\frac{${d}}{${sigma}} = ${zs(z)}`,
          below ? `P(${ev}) = \\Phi(${zs(z)}) = ${tt(pr)}` : `P(${ev}) = 1 - \\Phi(${zs(z)}) = 1 - ${tt(phi(z))} = ${tt(pr)}`,
        );
        return numberProblem({
          prompt: t(
            `$X \\sim N(${mu}, \\sigma^2)$ and $P(${ev}) = ${tt(pr)}$. Find $\\sigma$.${g.en}`,
            `$X \\sim N(${mu}, \\sigma^2)$，且 $P(${ev}) = ${tt(pr)}$。求 $\\sigma$。${g["zh-CN"]}`,
          ),
          answer: sigma,
          mistakes: distinct([
            why(
              Q.of(d * z, 100),
              `This multiplies $x - \\mu = ${d}$ by $z$; divide by $z = ${zs(z)}$ instead.`,
              `这用 $x - \\mu = ${d}$ 乘以了 $z$；应当除以 $z = ${zs(z)}$。`,
            ),
            why(
              sigma * sigma,
              "This is the variance $\\sigma^2$; the question asks for the standard deviation $\\sigma$.",
              "这是方差 $\\sigma^2$；题目求的是标准差 $\\sigma$。",
            ),
            why(
              Math.abs(d),
              `This is the distance $|x - \\mu| = ${Math.abs(d)}$ itself; divide it by $|z| = ${zs(Math.abs(z))}$.`,
              `这只是距离 $|x - \\mu| = ${Math.abs(d)}$；还要除以 $|z| = ${zs(Math.abs(z))}$。`,
            ),
          ]),
          solution: t(
            `**Step 1: Find the z-score of $${x}$ from the probability.**${steps(...zLines)}So $z = ${zs(z)}$.\n\n**Step 2: Solve for $\\sigma$.**${steps(`\\frac{${x} - ${mu}}{\\sigma} = ${zs(z)}`, `\\sigma = \\frac{${d}}{${zs(z)}} = ${sigma}`)}**Check.** Standardize $${x}$ with $\\sigma = ${sigma}$ and recover the given probability:${back}`,
            `**第一步：由概率求 $${x}$ 的 z 分数。**${steps(...zLines)}所以 $z = ${zs(z)}$。\n\n**第二步：解出 $\\sigma$。**${steps(`\\frac{${x} - ${mu}}{\\sigma} = ${zs(z)}`, `\\sigma = \\frac{${d}}{${zs(z)}} = ${sigma}`)}**检验。**取 $\\sigma = ${sigma}$ 把 $${x}$ 标准化，得回已知的概率：${back}`,
          ),
        });
      },
    },
  ],
};

/** zFromProbability writes the steps from P(X < x) or P(X > x) = pr to the z-score z of x, in hundredths. */
function zFromProbability(x: number, z: number, below: boolean, pr: number): string[] {
  const lines = below ? [] : [`P(X < ${x}) = 1 - ${tt(pr)} = ${tt(phi(z))}`];
  if (z > 0) lines.push(`\\Phi(z) = ${tt(phi(z))} = \\Phi(${zs(z)})`);
  else lines.push(`\\Phi(-z) = 1 - ${tt(phi(z))} = ${tt(phi(-z))} = \\Phi(${zs(-z)})`);
  return lines;
}

/** percentagePoints covers inverting Φ: finding z from a probability. */
const percentagePoints: TopicDef = {
  id: "percentage-points-of-the-standard-normal-distribution",
  title: t("Percentage Points of the Standard Normal Distribution", "标准正态分布的百分位点"),
  summary: t(
    "Use a table of Φ in reverse to find the value a with P(Z < a), P(Z > a) or P(−a < Z < a) equal to a given probability, using symmetry for probabilities below 0.5.",
    "反向使用 Φ 表，求使 P(Z < a)、P(Z > a) 或 P(−a < Z < a) 等于给定概率的值 a，对小于 0.5 的概率利用对称性。",
  ),
  prerequisites: ["symmetry-properties-of-the-standard-normal-distribution"],
  encompasses: [{ topic: "symmetry-properties-of-the-standard-normal-distribution", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSS.ID.A.4"],
  intro: t(
    `So far we have gone from a value to a probability: $\\Phi(1.2) = 0.8849$. Now we go the other way. Which value $a$ has $P(Z < a) = 0.8849$? Find $0.8849$ among the values of $\\Phi$ in the table and read off $a = 1.2$.

Check: going forward again, $P(Z < 1.2) = \\Phi(1.2) = 0.8849$.

In this lesson we use the table in reverse to find values with a given probability below them, above them, or inside a symmetric interval, using symmetry when the value is negative.`,
    `前面我们由值求概率：$\\Phi(1.2) = 0.8849$。现在反过来：哪个值 $a$ 满足 $P(Z < a) = 0.8849$？在表中 $\\Phi$ 的值里找到 $0.8849$，读出 $a = 1.2$。

检验：再正向算一次，$P(Z < 1.2) = \\Phi(1.2) = 0.8849$。

本课学习反向使用表格，求下方概率、上方概率或对称区间内概率已知的值，值为负时利用对称性。`,
  ),
  knowledgePoints: [
    {
      id: "value-with-a-given-probability-below",
      title: t("The value with a given probability below it", "下方概率已知的值"),
      explanation: t(
        "A **percentage point** is a value $a$ with a given probability to one side. If $P(Z < a) = p$, then $\\Phi(a) = p$: look for $p$ among the values of $\\Phi$ and read off $a$.\n\nIf $p < 0.5$, then $a$ is negative and is not in the table: find $1 - p = \\Phi(-a)$ instead. For $P(Z < a) = 0.0668$: $\\Phi(-a) = 0.9332 = \\Phi(1.5)$, so $a = -1.5$.\n\nCheck: $P(Z < -1.5) = 1 - \\Phi(1.5) = 1 - 0.9332 = 0.0668$.\n\n> **Watch out.** A probability below $0.5$ to the left means $a$ is left of $0$; reading $1.5$ from the table and forgetting the minus sign gives the value with $0.0668$ above it instead.",
        "**百分位点**是一侧概率已知的值 $a$。若 $P(Z < a) = p$，则 $\\Phi(a) = p$：在 $\\Phi$ 的值中找到 $p$，读出 $a$。\n\n若 $p < 0.5$，则 $a$ 为负，不在表中：改为查 $1 - p = \\Phi(-a)$。对 $P(Z < a) = 0.0668$：$\\Phi(-a) = 0.9332 = \\Phi(1.5)$，所以 $a = -1.5$。\n\n检验：$P(Z < -1.5) = 1 - \\Phi(1.5) = 1 - 0.9332 = 0.0668$。\n\n> **注意。** 左侧概率小于 $0.5$ 说明 $a$ 在 $0$ 的左边；从表中读出 $1.5$ 却忘了负号，得到的是上方概率为 $0.0668$ 的值。",
      ),
      generate(rng) {
        return pointProblem(rng, "below");
      },
    },
    {
      id: "value-with-a-given-probability-above",
      title: t("The value with a given probability above it", "上方概率已知的值"),
      explanation: t(
        "If $P(Z > a) = p$, then $\\Phi(a) = 1 - p$. A small upper-tail probability gives a positive $a$; a probability above $0.5$ gives a negative $a$.\n\nFor $P(Z > a) = 0.1151$: $\\Phi(a) = 0.8849 = \\Phi(1.2)$, so $a = 1.2$. For $P(Z > a) = 0.8849$: $\\Phi(-a) = 0.8849$, so $a = -1.2$.\n\nCheck: $P(Z > 1.2) = 1 - 0.8849 = 0.1151$, and by symmetry $P(Z > -1.2) = \\Phi(1.2) = 0.8849$.\n\n> **Watch out.** $\\Phi$ gives the area to the left, so subtract the upper-tail probability from $1$ before looking it up; looking up $0.1151$ itself would point to a negative value.",
        "若 $P(Z > a) = p$，则 $\\Phi(a) = 1 - p$。上尾概率较小时 $a$ 为正；概率大于 $0.5$ 时 $a$ 为负。\n\n对 $P(Z > a) = 0.1151$：$\\Phi(a) = 0.8849 = \\Phi(1.2)$，所以 $a = 1.2$。对 $P(Z > a) = 0.8849$：$\\Phi(-a) = 0.8849$，所以 $a = -1.2$。\n\n检验：$P(Z > 1.2) = 1 - 0.8849 = 0.1151$；由对称性，$P(Z > -1.2) = \\Phi(1.2) = 0.8849$。\n\n> **注意。** $\\Phi$ 给出的是左侧面积，所以查表前先用 $1$ 减去上尾概率；直接查 $0.1151$ 会指向一个负值。",
      ),
      generate(rng) {
        return pointProblem(rng, "above");
      },
    },
    {
      id: "symmetric-interval-with-a-given-probability",
      title: t("A symmetric interval with a given probability", "概率已知的对称区间"),
      explanation: t(
        "Because the standard normal curve is symmetric, the probability outside the interval splits equally into two tails, which tells you the cumulative probability at the endpoint. If $P(-a < Z < a) = p$ with $a > 0$, then $2\\Phi(a) - 1 = p$, so\n\n$$\\Phi(a) = \\frac{1 + p}{2}.$$\n\nFor $P(-a < Z < a) = 0.7698$: $\\Phi(a) = \\frac{1.7698}{2} = 0.8849$, so $a = 1.2$.\n\nCheck: each tail is $\\frac{1 - 0.7698}{2} = 0.1151$, and $1 - 0.1151 = 0.8849 = \\Phi(1.2)$.\n\n> **Watch out.** Do not look up $p$ itself: $\\Phi(a) = 0.7698$ would put all of the outside probability in one tail.",
        "由于标准正态曲线是对称的，区间外的概率平均分成两个尾部，由此可以知道端点处的累积概率。若 $P(-a < Z < a) = p$，$a > 0$，则 $2\\Phi(a) - 1 = p$，所以\n\n$$\\Phi(a) = \\frac{1 + p}{2}.$$\n\n对 $P(-a < Z < a) = 0.7698$：$\\Phi(a) = \\frac{1.7698}{2} = 0.8849$，所以 $a = 1.2$。\n\n检验：每个尾部为 $\\frac{1 - 0.7698}{2} = 0.1151$，而 $1 - 0.1151 = 0.8849 = \\Phi(1.2)$。\n\n> **注意。** 不要直接查 $p$：$\\Phi(a) = 0.7698$ 相当于把区间外的概率全放在一个尾部。",
      ),
      generate(rng) {
        return pointProblem(rng, "symmetric");
      },
    },
  ],
};

/** pointProblem asks for the value a with a given probability below it, above it, or within ±a. */
function pointProblem(rng: Rng, kind: "below" | "above" | "symmetric"): Problem {
  const zList = rng.sample(ZS, 4);
  const z = zList[0]!;
  const tab = zTable(zList);
  const f = phi(z);
  const neg = kind !== "symmetric" && rng.bool();
  const a = neg ? -z : z;
  let pr: number;
  let ev: string;
  let line: string;
  let plan: Text;
  let back: string;
  if (kind === "below") {
    pr = neg ? 10000 - f : f;
    ev = "Z < a";
    line = neg ? `\\Phi(-a) = 1 - ${tt(pr)} = ${tt(f)} = \\Phi(${zs(z)})` : `\\Phi(a) = ${tt(f)} = \\Phi(${zs(z)})`;
    plan = neg
      ? t(
          `The probability to the left is less than $0.5$, so $a$ is negative and $\\Phi(-a) = 1 - ${tt(pr)}$.`,
          `左侧概率小于 $0.5$，所以 $a$ 为负，且 $\\Phi(-a) = 1 - ${tt(pr)}$。`,
        )
      : t(`The probability to the left is $\\Phi(a) = ${tt(pr)}$.`, `左侧概率就是 $\\Phi(a) = ${tt(pr)}$。`);
    back = neg ? `P(Z < ${zs(a)}) = 1 - \\Phi(${zs(z)}) = 1 - ${tt(f)} = ${tt(pr)}` : `P(Z < ${zs(a)}) = \\Phi(${zs(z)}) = ${tt(pr)}`;
  } else if (kind === "above") {
    pr = neg ? f : 10000 - f;
    ev = "Z > a";
    line = neg ? `\\Phi(-a) = P(Z < -a) = P(Z > a) = ${tt(f)} = \\Phi(${zs(z)})` : `\\Phi(a) = 1 - ${tt(pr)} = ${tt(f)} = \\Phi(${zs(z)})`;
    plan = neg
      ? t(
          `The probability to the right is more than $0.5$, so $a$ is negative, and by symmetry $\\Phi(-a) = P(Z > a) = ${tt(pr)}$.`,
          `右侧概率大于 $0.5$，所以 $a$ 为负，由对称性 $\\Phi(-a) = P(Z > a) = ${tt(pr)}$。`,
        )
      : t(
          `The probability to the right is less than $0.5$, so $a$ is positive and $\\Phi(a) = 1 - ${tt(pr)}$.`,
          `右侧概率小于 $0.5$，所以 $a$ 为正，且 $\\Phi(a) = 1 - ${tt(pr)}$。`,
        );
    back = neg ? `P(Z > ${zs(a)}) = P(Z < ${zs(z)}) = ${tt(pr)}` : `P(Z > ${zs(a)}) = 1 - \\Phi(${zs(z)}) = 1 - ${tt(f)} = ${tt(pr)}`;
  } else {
    pr = 2 * f - 10000;
    ev = "-a < Z < a";
    line = `\\Phi(a) = \\frac{1 + ${tt(pr)}}{2} = ${tt(f)} = \\Phi(${zs(z)})`;
    plan = t(
      `The outside probability $1 - ${tt(pr)} = ${tt(10000 - pr)}$ splits into two equal tails of $${tt((10000 - pr) / 2)}$, so $\\Phi(a) = 1 - ${tt((10000 - pr) / 2)}$.`,
      `区间外的概率 $1 - ${tt(pr)} = ${tt(10000 - pr)}$ 平分为两个尾部，各为 $${tt((10000 - pr) / 2)}$，所以 $\\Phi(a) = 1 - ${tt((10000 - pr) / 2)}$。`,
    );
    back = `P(-${zs(z)} < Z < ${zs(z)}) = 2\\Phi(${zs(z)}) - 1 = 2(${tt(f)}) - 1 = ${tt(pr)}`;
  }
  const others = zList.slice(1);
  const intro = t("Values of the standard normal cumulative distribution function:", "标准正态累积分布函数的值：");
  return numberProblem({
    prompt: t(
      `$Z \\sim N(0, 1)$ and $P(${ev}) = ${tt(pr)}$${kind === "symmetric" ? ", where $a > 0$" : ""}. Find $a$.\n\n${intro.en}\n\n${tab}`,
      `$Z \\sim N(0, 1)$，且 $P(${ev}) = ${tt(pr)}$${kind === "symmetric" ? "，其中 $a > 0$" : ""}。求 $a$。\n\n${intro["zh-CN"]}\n\n${tab}`,
    ),
    answer: Q.of(a, 100),
    form: "decimal",
    mistakes: [
      why(
        Q.of(-a, 100),
        kind === "symmetric"
          ? "The question says $a > 0$."
          : `This has the wrong sign: $a$ is ${neg ? "negative" : "positive"}, since the probability ${kind === "below" ? "to the left" : "to the right"} is ${(kind === "below") === neg ? "less" : "more"} than $0.5$.`,
        kind === "symmetric"
          ? "题目说明 $a > 0$。"
          : `符号错了：${kind === "below" ? "左" : "右"}侧概率${(kind === "below") === neg ? "小于" : "大于"} $0.5$，所以 $a$ 是${neg ? "负" : "正"}的。`,
      ),
    ],
    wrong: others.map((o) => Q.of(o, 100)),
    solution: t(
      `**Step 1: Turn the probability into a value of $\\Phi$.** ${plan.en}\n\n**Step 2: Find it in the table.**${steps(line)}So $${neg ? "-a" : "a"} = ${zs(z)}$${neg ? ` and $a = ${zs(a)}$` : ""}.\n\n**Check.** Go forward from $a = ${zs(a)}$:${steps(back)}`,
      `**第一步：把概率化为 $\\Phi$ 的值。**${plan["zh-CN"]}\n\n**第二步：在表中查找。**${steps(line)}所以 $${neg ? "-a" : "a"} = ${zs(z)}$${neg ? `，$a = ${zs(a)}$` : ""}。\n\n**检验。**由 $a = ${zs(a)}$ 正向计算：${steps(back)}`,
    ),
  });
}

/** NormalContext is a quantity modeled by a normal distribution. */
interface NormalContext {
  readonly en: string;
  readonly zh: string;
  /** item is the individual: singular and plural in English, then Chinese. */
  readonly item: readonly [string, string, string];
  readonly measure: readonly [string, string];
  readonly unit: readonly [string, string];
  readonly mu: readonly [number, number];
  readonly sigma: readonly [number, number];
}

/** NORMAL_CONTEXTS are quantities modeled by normal distributions. */
const NORMAL_CONTEXTS: readonly NormalContext[] = [
  {
    en: "The heights of adult women in a town",
    zh: "某镇成年女性的身高",
    item: ["woman", "women", "女性"],
    measure: ["height", "身高"],
    unit: ["cm", "厘米"],
    mu: [158, 168],
    sigma: [5, 8],
  },
  {
    en: "The masses of apples from an orchard",
    zh: "某果园苹果的质量",
    item: ["apple", "apples", "苹果"],
    measure: ["mass", "质量"],
    unit: ["g", "克"],
    mu: [150, 200],
    sigma: [10, 25],
  },
  {
    en: "The scores on a national exam",
    zh: "某全国考试的成绩",
    item: ["student", "students", "考生"],
    measure: ["score", "成绩"],
    unit: ["points", "分"],
    mu: [60, 75],
    sigma: [8, 15],
  },
  {
    en: "The lifetimes of a type of light bulb",
    zh: "某种灯泡的寿命",
    item: ["bulb", "bulbs", "灯泡"],
    measure: ["lifetime", "寿命"],
    unit: ["hours", "小时"],
    mu: [800, 1200],
    sigma: [40, 100],
  },
  {
    en: "The commute times of workers in a city",
    zh: "某城市上班族的通勤时间",
    item: ["worker", "workers", "上班族"],
    measure: ["commute time", "通勤时间"],
    unit: ["minutes", "分钟"],
    mu: [25, 45],
    sigma: [4, 10],
  },
];

/** normalSetup picks a context with its mean and standard deviation. */
function normalSetup(rng: Rng): { c: NormalContext; mu: number; sigma: number; intro: Text } {
  const c = rng.pick(NORMAL_CONTEXTS);
  const mu = rng.int(c.mu[0], c.mu[1]);
  const sigma = rng.int(c.sigma[0], c.sigma[1]);
  const intro = t(
    `${c.en} are normally distributed with mean $${mu}$ ${c.unit[0]} and standard deviation $${sigma}$ ${c.unit[0]}.`,
    `${c.zh}服从均值为 $${mu}$ ${c.unit[1]}、标准差为 $${sigma}$ ${c.unit[1]}的正态分布。`,
  );
  return { c, mu, sigma, intro };
}

/** modelingWithTheNormalDistribution applies the normal distribution to situations. */
const modelingWithTheNormalDistribution: TopicDef = {
  id: "modeling-with-the-normal-distribution",
  title: t("Modeling With the Normal Distribution", "用正态分布建模"),
  summary: t(
    "Model measurements with a normal distribution to find the probability that a randomly chosen individual lies in a range, the expected number of individuals in a range, and the cutoff value for a given top or bottom percentage.",
    "用正态分布为测量值建模，求随机选取的个体落在某范围内的概率、某范围内个体的期望数量，以及给定的最高或最低百分比所对应的分界值。",
  ),
  prerequisites: ["mean-and-variance-of-the-normal-distribution", "percentage-points-of-the-standard-normal-distribution"],
  encompasses: [
    { topic: "the-normal-distribution", weight: 0.6 },
    { topic: "percentage-points-of-the-standard-normal-distribution", weight: 0.4 },
  ],
  xp: 20,
  standards: ["CCSS.HSS.ID.A.4"],
  intro: t(
    `Apples from an orchard have masses that are normal with mean $180$ g and standard deviation $20$ g. An apple heavier than $210$ g is $\\frac{210 - 180}{20} = 1.5$ standard deviations above the mean, so the chance that a random apple is that heavy is $1 - \\Phi(1.5) = 0.0668$, and in a crate of $500$ apples about $500 \\cdot 0.0668 = 33.4$ are expected to be.

Check: $0.0668$ is about $\\frac{1}{15}$, and $\\frac{500}{15} \\approx 33$.

In this lesson we turn questions about measured quantities into normal probabilities, expected numbers and cutoff values.`,
    `某果园苹果的质量服从均值 $180$ 克、标准差 $20$ 克的正态分布。重于 $210$ 克的苹果比均值高 $\\frac{210 - 180}{20} = 1.5$ 个标准差，所以随机一个苹果这么重的概率为 $1 - \\Phi(1.5) = 0.0668$；一箱 $500$ 个苹果中期望约有 $500 \\cdot 0.0668 = 33.4$ 个。

检验：$0.0668$ 约为 $\\frac{1}{15}$，而 $\\frac{500}{15} \\approx 33$。

本课把关于测量量的问题转化为正态分布的概率、期望数量和分界值。`,
  ),
  knowledgePoints: [
    {
      id: "probabilities-in-context",
      title: t("Probabilities in context", "情境中的概率"),
      explanation: t(
        'To answer a question about a normally distributed quantity, name the variable, write its distribution, standardize and use $\\Phi$.\n\nIf heights are $N(165, 6^2)$ in centimeters, the probability that a randomly chosen person is taller than $174$ cm is\n\n$$P(X > 174) = P\\left(Z > \\frac{174 - 165}{6}\\right) = 1 - \\Phi(1.5) = 1 - 0.9332 = 0.0668.$$\n\nCheck: $174$ is above the mean, so fewer than half are taller, and $0.0668 < 0.5$.\n\n> **Watch out.** "Taller than" and "more than" ask for the area to the right, so subtract $\\Phi$ from $1$; and keep the sign of $z$ for values below the mean.',
        "回答关于正态分布量的问题时，先设出变量、写出其分布，再标准化并使用 $\\Phi$。\n\n若身高（厘米）服从 $N(165, 6^2)$，随机选取一人身高超过 $174$ 厘米的概率为\n\n$$P(X > 174) = P\\left(Z > \\frac{174 - 165}{6}\\right) = 1 - \\Phi(1.5) = 1 - 0.9332 = 0.0668.$$\n\n检验：$174$ 高于均值，所以更高的人不到一半，而 $0.0668 < 0.5$。\n\n> **注意。** “高于”“大于”求的是右侧面积，要用 $1$ 减去 $\\Phi$；低于均值的值要保留 $z$ 的负号。",
      ),
      generate(rng) {
        const { c, mu, sigma, intro } = normalSetup(rng);
        const type = rng.int(0, 2);
        let z1 = rng.pick(ZS) * rng.sign();
        let z2 = type === 2 ? rng.pick(ZS) * rng.sign() : z1;
        if (type === 2 && z1 === z2) z2 = -z2;
        if (z1 > z2) [z1, z2] = [z2, z1];
        const x1 = dec(xAt(mu, sigma, z1));
        const x2 = dec(xAt(mu, sigma, z2));
        const ans = type === 0 ? phi(z1) : type === 1 ? 10000 - phi(z1) : phi(z2) - phi(z1);
        const g = given(type === 2 ? [z1, z2] : [z1]);
        const whatEn =
          type === 0
            ? `less than $${x1}$ ${c.unit[0]}`
            : type === 1
              ? `more than $${x1}$ ${c.unit[0]}`
              : `between $${x1}$ ${c.unit[0]} and $${x2}$ ${c.unit[0]}`;
        const whatZh =
          type === 0
            ? `小于 $${x1}$ ${c.unit[1]}`
            : type === 1
              ? `大于 $${x1}$ ${c.unit[1]}`
              : `介于 $${x1}$ ${c.unit[1]}与 $${x2}$ ${c.unit[1]}之间`;
        const zLines =
          type === 2
            ? [`z_1 = \\frac{${x1} - ${mu}}{${sigma}} = ${zs(z1)}, \\quad z_2 = \\frac{${x2} - ${mu}}{${sigma}} = ${zs(z2)}`]
            : [`z = \\frac{${x1} - ${mu}}{${sigma}} = ${zs(z1)}`];
        const pLine =
          type === 2
            ? `P(${x1} < X < ${x2}) = \\Phi(${zs(z2)}) - \\Phi(${zs(z1)}) = ${tt(phi(z2))} - ${tt(phi(z1))} = ${tt(ans)}`
            : type === 0
              ? `P(X < ${x1}) = \\Phi(${zs(z1)}) = ${tt(ans)}`
              : `P(X > ${x1}) = 1 - \\Phi(${zs(z1)}) = 1 - ${tt(phi(z1))} = ${tt(ans)}`;
        const check =
          type === 2
            ? steps(`P(X > ${x1}) - P(X > ${x2}) = ${tt(10000 - phi(z1))} - ${tt(10000 - phi(z2))} = ${tt(ans)}`)
            : steps(`${tt(ans)} + ${tt(10000 - ans)} = 1`);
        const more = type === 0 ? z1 > 0 : z1 < 0;
        const checkEn =
          type === 2
            ? "Use the areas to the right instead:"
            : `$${x1}$ is ${z1 > 0 ? "above" : "below"} the mean, so the probability is ${more ? "more" : "less"} than $0.5$, as $${tt(ans)}$ is; with the other side the total is $1$:`;
        const checkZh =
          type === 2
            ? "改用右侧面积："
            : `$${x1}$ ${z1 > 0 ? "高于" : "低于"}均值，所以概率${more ? "大于" : "小于"} $0.5$，$${tt(ans)}$ 正是如此；加上另一侧，总和为 $1$：`;
        const negs = [...new Set(type === 2 ? [z1, z2] : [z1])].filter((z) => z < 0);
        const symEn =
          negs.length > 0
            ? ` By symmetry, ${negs.map((z) => `$\\Phi(${zs(z)}) = 1 - \\Phi(${zs(-z)}) = ${tt(phi(z))}$`).join(" and ")}.`
            : "";
        const symZh =
          negs.length > 0 ? `由对称性，${negs.map((z) => `$\\Phi(${zs(z)}) = 1 - \\Phi(${zs(-z)}) = ${tt(phi(z))}$`).join("，")}。` : "";
        return numberProblem({
          prompt: t(
            `${intro.en} Find the probability that a randomly chosen ${c.item[0]} has a ${c.measure[0]} ${whatEn}.${g.en}`,
            `${intro["zh-CN"]}求随机选取的一个${c.item[2]}的${c.measure[1]}${whatZh}的概率。${g["zh-CN"]}`,
          ),
          answer: P4(ans),
          form: "decimal",
          mistakes: distinct([
            why(
              P4(10000 - ans),
              type === 2 ? "This is the probability outside the range." : "This is the probability on the other side of the value.",
              type === 2 ? "这是范围之外的概率。" : "这是该值另一侧的概率。",
            ),
            ...(type === 2
              ? [
                  why(
                    P4(Math.abs(phi(Math.abs(z2)) - phi(Math.abs(z1)))),
                    "This drops the minus sign of a negative z-score, using $\\Phi(|z|)$ in place of $\\Phi(z)$.",
                    "这丢掉了负的 z 分数的符号，用 $\\Phi(|z|)$ 代替了 $\\Phi(z)$。",
                  ),
                  why(
                    P4(phi(z2)),
                    `This is $\\Phi(${zs(z2)})$, everything below $${x2}$; subtract the part below $${x1}$.`,
                    `这是 $\\Phi(${zs(z2)})$，即低于 $${x2}$ 的全部；还要减去低于 $${x1}$ 的部分。`,
                  ),
                ]
              : [
                  why(
                    P4(phi(Math.abs(z1))),
                    `This drops the minus sign of $z = ${zs(z1)}$ and uses $\\Phi(${zs(Math.abs(z1))})$.`,
                    `这丢掉了 $z = ${zs(z1)}$ 的负号，用了 $\\Phi(${zs(Math.abs(z1))})$。`,
                  ),
                  why(
                    P4(10000 - phi(Math.abs(z1))),
                    `This drops the minus sign of $z = ${zs(z1)}$ and uses $1 - \\Phi(${zs(Math.abs(z1))})$.`,
                    `这丢掉了 $z = ${zs(z1)}$ 的负号，用了 $1 - \\Phi(${zs(Math.abs(z1))})$。`,
                  ),
                ]),
          ]),
          solution: t(
            `**Step 1: Name the variable and standardize.** Let $X$ be the ${c.measure[0]}, $X \\sim N(${mu}, ${sigma}^2)$:${steps(...zLines)}**Step 2: Use $\\Phi$.**${symEn}${steps(pLine)}**Check.** ${checkEn}${check}`,
            `**第一步：设出变量并标准化。**设 $X$ 为${c.measure[1]}，$X \\sim N(${mu}, ${sigma}^2)$：${steps(...zLines)}**第二步：用 $\\Phi$。**${symZh}${steps(pLine)}**检验。**${checkZh}${check}`,
          ),
        });
      },
    },
    {
      id: "expected-numbers-in-context",
      title: t("Expected numbers in context", "情境中的期望数量"),
      explanation: t(
        "If each of $N$ individuals independently lies in a range with probability $p$, the expected number in that range is $Np$.\n\nWith heights $N(165, 6^2)$ and $P(X > 174) = 0.0668$, among $10\\,000$ people about $10\\,000 \\cdot 0.0668 = 668$ are expected to be taller than $174$ cm.\n\nCheck: the others number $10\\,000 \\cdot 0.9332 = 9332$, and $668 + 9332 = 10\\,000$.\n\n> **Watch out.** The answer is a count, not a probability: multiply $p$ by the size of the group, and make sure $p$ is for the side the question asks about.",
        "若 $N$ 个个体中每个都以概率 $p$ 独立地落在某范围内，则落在该范围内的期望数量为 $Np$。\n\n若身高服从 $N(165, 6^2)$ 且 $P(X > 174) = 0.0668$，则 $10\\,000$ 人中期望约有 $10\\,000 \\cdot 0.0668 = 668$ 人身高超过 $174$ 厘米。\n\n检验：其余的人数为 $10\\,000 \\cdot 0.9332 = 9332$，而 $668 + 9332 = 10\\,000$。\n\n> **注意。** 答案是个数而不是概率：要用 $p$ 乘以总人数，并确认 $p$ 是题目所问那一侧的概率。",
      ),
      generate(rng) {
        const { c, mu, sigma, intro } = normalSetup(rng);
        const z = rng.pick(ZS) * rng.sign();
        const x = dec(xAt(mu, sigma, z));
        const above = rng.bool();
        const pr = above ? 10000 - phi(z) : phi(z);
        const m = rng.pick([1, 2, 3, 5]);
        const n = 10000 * m;
        const nL = `${m}0\\,000`;
        const ans = pr * m;
        const g = given([z]);
        const ev = `X ${above ? ">" : "<"} ${x}`;
        const pLine = above ? `P(${ev}) = 1 - \\Phi(${zs(z)}) = ${tt(pr)}` : `P(${ev}) = \\Phi(${zs(z)}) = ${tt(pr)}`;
        const rest = (10000 - pr) * m;
        return numberProblem({
          prompt: t(
            `${intro.en} In a group of $${nL}$ ${c.item[1]}, how many are expected to have a ${c.measure[0]} ${above ? "more" : "less"} than $${x}$ ${c.unit[0]}?${g.en}`,
            `${intro["zh-CN"]}在 $${nL}$ 个${c.item[2]}中，期望有多少个的${c.measure[1]}${above ? "大于" : "小于"} $${x}$ ${c.unit[1]}？${g["zh-CN"]}`,
          ),
          answer: ans,
          mistakes: distinct([
            why(
              rest,
              `This counts the ${c.item[1]} on the other side of $${x}$ ${c.unit[0]}.`,
              `这数的是 $${x}$ ${c.unit[1]}另一侧的${c.item[2]}。`,
            ),
            why(
              Q.of(pr, 10000),
              `This is the probability $${tt(pr)}$; multiply it by the $${nL}$ ${c.item[1]}.`,
              `这是概率 $${tt(pr)}$；还要乘以 $${nL}$。`,
            ),
            why(
              pr,
              `This is $${pr}$, the count for $10\\,000$ ${c.item[1]}; the group has $${nL}$.`,
              `这是 $10\\,000$ 个${c.item[2]}对应的个数 $${pr}$；这一组有 $${nL}$ 个。`,
            ),
            why(
              phi(Math.abs(z)) * m,
              `This drops the minus sign of $z = ${zs(z)}$ and uses $\\Phi(${zs(Math.abs(z))})$.`,
              `这丢掉了 $z = ${zs(z)}$ 的负号，用了 $\\Phi(${zs(Math.abs(z))})$。`,
            ),
          ]),
          solution: t(
            `**Step 1: Find the probability for one ${c.item[0]}.** With $z = \\frac{${x} - ${mu}}{${sigma}} = ${zs(z)}$${z < 0 ? ` and $\\Phi(${zs(z)}) = 1 - \\Phi(${zs(-z)}) = ${tt(phi(z))}$` : ""}:${steps(pLine)}**Step 2: Multiply by the size of the group.**${steps(`${n} \\cdot ${tt(pr)} = ${ans}`)}**Check.** The ${c.item[1]} on the other side number $${n} \\cdot ${tt(10000 - pr)} = ${rest}$, and together:${steps(`${ans} + ${rest} = ${n}`)}`,
            `**第一步：求一个${c.item[2]}的概率。**由 $z = \\frac{${x} - ${mu}}{${sigma}} = ${zs(z)}$${z < 0 ? `，$\\Phi(${zs(z)}) = 1 - \\Phi(${zs(-z)}) = ${tt(phi(z))}$` : ""}：${steps(pLine)}**第二步：乘以总个数。**${steps(`${n} \\cdot ${tt(pr)} = ${ans}`)}**检验。**另一侧的${c.item[2]}有 $${n} \\cdot ${tt(10000 - pr)} = ${rest}$ 个，合起来：${steps(`${ans} + ${rest} = ${n}`)}`,
          ),
        });
      },
    },
    {
      id: "cutoff-values-in-context",
      title: t("Cutoff values in context", "情境中的分界值"),
      explanation: t(
        "To find the value that cuts off a given top or bottom percentage, find the z-score from the table and convert back: $x = \\mu + z\\sigma$.\n\nExam scores are $N(70, 10^2)$, and the top $6.68\\%$ get an award. The cutoff $x$ has $P(X > x) = 0.0668$, so $\\Phi(z) = 0.9332$, $z = 1.5$ and $x = 70 + 1.5 \\cdot 10 = 85$. For a bottom percentage the z-score is negative.\n\nCheck: $P(X > 85) = 1 - \\Phi\\left(\\frac{85 - 70}{10}\\right) = 1 - 0.9332 = 0.0668$.\n\n> **Watch out.** A top percentage lies above the mean and a bottom one below it, so the z-score is positive or negative accordingly; and multiply $z$ by the standard deviation, not the variance.",
        "求截出给定最高或最低百分比的值时，先由表求 z 分数，再换算回去：$x = \\mu + z\\sigma$。\n\n考试成绩服从 $N(70, 10^2)$，成绩最高的 $6.68\\%$ 获奖。分界值 $x$ 满足 $P(X > x) = 0.0668$，所以 $\\Phi(z) = 0.9332$，$z = 1.5$，$x = 70 + 1.5 \\cdot 10 = 85$。对最低百分比，z 分数为负。\n\n检验：$P(X > 85) = 1 - \\Phi\\left(\\frac{85 - 70}{10}\\right) = 1 - 0.9332 = 0.0668$。\n\n> **注意。** 最高的百分比在均值之上，最低的在均值之下，所以 z 分数相应地为正或为负；并且 $z$ 要乘以标准差，而不是方差。",
      ),
      generate(rng) {
        const { c, mu, sigma, intro } = normalSetup(rng);
        const z = rng.pick(ZS);
        const top = rng.bool();
        const pct = dec(Q.of(10000 - phi(z), 100));
        const x = xAt(mu, sigma, top ? z : -z);
        const g = given([z]);
        const zSigned = top ? zs(z) : `-${zs(z)}`;
        const tail = tt(10000 - phi(z));
        const back = top
          ? `P(X > ${dec(x)}) = 1 - \\Phi\\left(\\frac{${dec(x)} - ${mu}}{${sigma}}\\right) = 1 - \\Phi(${zs(z)}) = 1 - ${tt(phi(z))} = ${tail}`
          : `P(X < ${dec(x)}) = \\Phi\\left(\\frac{${dec(x)} - ${mu}}{${sigma}}\\right) = \\Phi(-${zs(z)}) = 1 - ${tt(phi(z))} = ${tail}`;
        return numberProblem({
          prompt: t(
            `${intro.en} The ${top ? "top" : "bottom"} $${pct}\\%$ of ${c.item[1]} by ${c.measure[0]} are to be identified. Find the cutoff value, in ${c.unit[0]}.${g.en}`,
            `${intro["zh-CN"]}要找出${c.measure[1]}${top ? "最高" : "最低"}的 $${pct}\\%$ 的${c.item[2]}。求分界值（单位：${c.unit[1]}）。${g["zh-CN"]}`,
          ),
          answer: x,
          form: "decimal",
          mistakes: distinct([
            why(
              xAt(mu, sigma, top ? -z : z),
              `This is on the wrong side of the mean: the ${top ? "top" : "bottom"} $${pct}\\%$ lies ${top ? "above" : "below"} it, so $z = ${zSigned}$.`,
              `这在均值的另一侧：${top ? "最高" : "最低"}的 $${pct}\\%$ 在均值${top ? "之上" : "之下"}，所以 $z = ${zSigned}$。`,
            ),
            why(
              xAt(mu, sigma * sigma, top ? z : -z),
              `This multiplies $z$ by the variance $${sigma * sigma}$; the standard deviation is $${sigma}$.`,
              `这用 $z$ 乘以了方差 $${sigma * sigma}$；标准差是 $${sigma}$。`,
            ),
            why(
              Q.of(mu * 100 + (top ? 1 : -1) * (10000 - phi(z)), 100),
              `This ${top ? "adds" : "subtracts"} the probability $${tail}$ itself; turn it into a z-score with the table and multiply by $\\sigma = ${sigma}$.`,
              `这直接${top ? "加上" : "减去"}了概率 $${tail}$；应当先查表把它化为 z 分数，再乘以 $\\sigma = ${sigma}$。`,
            ),
          ]),
          solution: t(
            `**Step 1: Find the z-score.** The ${top ? "upper" : "lower"} tail has probability $${pct}\\% = ${tail}$, so $\\Phi(${zs(z)}) = 1 - ${tail} = ${tt(phi(z))}$ gives $z = ${zSigned}$${top ? "" : ", negative because the bottom tail is below the mean"}.\n\n**Step 2: Convert back.**${steps(`x = \\mu + z\\sigma = ${mu} + (${zSigned})(${sigma}) = ${dec(x)}`)}**Check.** The ${top ? "upper" : "lower"} tail beyond $${dec(x)}$ is the required one:${steps(back)}`,
            `**第一步：求 z 分数。**${top ? "上" : "下"}尾概率为 $${pct}\\% = ${tail}$，所以由 $\\Phi(${zs(z)}) = 1 - ${tail} = ${tt(phi(z))}$ 得 $z = ${zSigned}$${top ? "" : "，因为下尾在均值之下，所以为负"}。\n\n**第二步：换算回去。**${steps(`x = \\mu + z\\sigma = ${mu} + (${zSigned})(${sigma}) = ${dec(x)}`)}**检验。**$${dec(x)}$ 之外的${top ? "上" : "下"}尾正是所要求的：${steps(back)}`,
          ),
        });
      },
    },
  ],
};

/** BELOW_PCT is the percent of a normal distribution below μ + kσ for k = −3 … 3 by the empirical rule, in hundredths of a percent. */
const BELOW_PCT: readonly number[] = [15, 250, 1600, 5000, 8400, 9750, 9985];

/** belowPct is the percent below μ + kσ, in hundredths of a percent, with k = ±4 standing for ±∞. */
const belowPct = (k: number) => (k <= -4 ? 0 : k >= 4 ? 10000 : BELOW_PCT[k + 3]!);

/** theEmpiricalRule covers the 68–95–99.7 rule. */
const theEmpiricalRule: TopicDef = {
  id: "the-empirical-rule-for-the-normal-distribution",
  title: t("The Empirical Rule for the Normal Distribution", "正态分布的经验法则"),
  summary: t(
    "Use the empirical rule, that about 68%, 95% and 99.7% of a normal distribution lie within 1, 2 and 3 standard deviations of the mean, to estimate percentages, counts and values.",
    "利用经验法则（正态分布中约有 68%、95% 与 99.7% 的数据落在均值的 1、2、3 个标准差之内）估计百分比、数量与数值。",
  ),
  prerequisites: ["the-normal-distribution"],
  encompasses: [{ topic: "the-normal-distribution", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSS.ID.A.4"],
  intro: t(
    `IQ scores are normal with mean $100$ and standard deviation $15$. Without any table, about $68\\%$ of people score between $85$ and $115$, one standard deviation either side of the mean, and about $95\\%$ between $70$ and $130$.

Check: the table gives $P(-1 < Z < 1) = 2\\Phi(1) - 1 = 2(0.8413) - 1 = 0.6826$, which is about $68\\%$.

In this lesson we use these rounded percentages, the empirical rule, to estimate percentages, counts and values for any normal distribution.`,
    `智商分数服从均值 $100$、标准差 $15$ 的正态分布。不用查表也知道：约 $68\\%$ 的人分数在 $85$ 与 $115$ 之间，即均值两侧各一个标准差之内；约 $95\\%$ 在 $70$ 与 $130$ 之间。

检验：查表得 $P(-1 < Z < 1) = 2\\Phi(1) - 1 = 2(0.8413) - 1 = 0.6826$，约为 $68\\%$。

本课利用这些取整后的百分比，即经验法则，估计任意正态分布中的百分比、数量和数值。`,
  ),
  knowledgePoints: [
    {
      id: "percentages-from-the-empirical-rule",
      title: t("Percentages from the empirical rule", "由经验法则求百分比"),
      explanation: t(
        "For any normal distribution, approximately\n\n- $68\\%$ of values lie within $1$ standard deviation of the mean, between $\\mu - \\sigma$ and $\\mu + \\sigma$;\n- $95\\%$ lie within $2$ standard deviations;\n- $99.7\\%$ lie within $3$ standard deviations.\n\nBy symmetry this splits into pieces: $34\\%$ between $\\mu$ and $\\mu + \\sigma$, $13.5\\%$ between $\\mu + \\sigma$ and $\\mu + 2\\sigma$, $2.35\\%$ between $\\mu + 2\\sigma$ and $\\mu + 3\\sigma$, and $0.15\\%$ beyond $\\mu + 3\\sigma$, and the same on the left. For $N(100, 15^2)$, the percentage between $85$ and $130$ is $34 + 34 + 13.5 = 81.5\\%$.\n\nCheck: $97.5\\%$ lie below $130$ and $16\\%$ below $85$, and $97.5 - 16 = 81.5$.\n\n> **Watch out.** The pieces are not all $34\\%$: only the two next to the mean are. Farther out they shrink to $13.5\\%$, $2.35\\%$ and $0.15\\%$.",
        "对任何正态分布，大约有\n\n- $68\\%$ 的数据落在均值的 $1$ 个标准差之内，即 $\\mu - \\sigma$ 与 $\\mu + \\sigma$ 之间；\n- $95\\%$ 落在 $2$ 个标准差之内；\n- $99.7\\%$ 落在 $3$ 个标准差之内。\n\n由对称性可以分成若干块：$\\mu$ 与 $\\mu + \\sigma$ 之间占 $34\\%$，$\\mu + \\sigma$ 与 $\\mu + 2\\sigma$ 之间占 $13.5\\%$，$\\mu + 2\\sigma$ 与 $\\mu + 3\\sigma$ 之间占 $2.35\\%$，超过 $\\mu + 3\\sigma$ 的占 $0.15\\%$，左侧对称。对 $N(100, 15^2)$，$85$ 与 $130$ 之间的百分比为 $34 + 34 + 13.5 = 81.5\\%$。\n\n检验：低于 $130$ 的占 $97.5\\%$，低于 $85$ 的占 $16\\%$，而 $97.5 - 16 = 81.5$。\n\n> **注意。** 并非每一块都是 $34\\%$：只有紧挨均值的两块是。越往外越小，依次为 $13.5\\%$、$2.35\\%$ 和 $0.15\\%$。",
      ),
      generate(rng) {
        const mu = rng.int(4, 40) * 5;
        const sigma = rng.int(2, 12);
        const type = rng.int(0, 2);
        let a: number;
        let b: number;
        if (type === 0) {
          a = rng.int(-3, 2);
          b = rng.int(a + 1, 3);
        } else if (type === 1) {
          a = -4;
          b = rng.int(-3, 3);
        } else {
          a = rng.int(-3, 3);
          b = 4;
        }
        const val = (k: number) => mu + k * sigma;
        const ans = belowPct(b) - belowPct(a);
        const evEn = type === 0 ? `between $${val(a)}$ and $${val(b)}$` : type === 1 ? `below $${val(b)}$` : `above $${val(a)}$`;
        const evZh = type === 0 ? `介于 $${val(a)}$ 与 $${val(b)}$ 之间` : type === 1 ? `小于 $${val(b)}$` : `大于 $${val(a)}$`;
        const kL = (k: number) => (k === 0 ? "\\mu" : `\\mu ${k > 0 ? "+" : "-"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}\\sigma`);
        const pct = Q.of(ans, 100);
        const pc = (x: number) => dec(Q.of(x, 100));
        const pieces = range(a, b - a).map((k) => belowPct(k + 1) - belowPct(k));
        const added = pieces.length > 1 ? `${pieces.map((x) => pc(x)).join(" + ")} = ${pc(ans)}` : pc(ans);
        const ends =
          type === 0
            ? `$${val(a)} = ${kL(a)}$ and $${val(b)} = ${kL(b)}$`
            : type === 1
              ? `$${val(b)} = ${kL(b)}$`
              : `$${val(a)} = ${kL(a)}$`;
        const endsZh =
          type === 0 ? `$${val(a)} = ${kL(a)}$，$${val(b)} = ${kL(b)}$` : type === 1 ? `$${val(b)} = ${kL(b)}$` : `$${val(a)} = ${kL(a)}$`;
        const check = steps(`${pc(belowPct(b))} - ${pc(belowPct(a))} = ${pc(ans)}`);
        return numberProblem({
          prompt: t(
            `The values of $X$ are normally distributed with mean $${mu}$ and standard deviation $${sigma}$. Use the empirical rule to find the percentage of values ${evEn}.`,
            `$X$ 的值服从均值为 $${mu}$、标准差为 $${sigma}$ 的正态分布。用经验法则求${evZh}的数据所占的百分比。`,
          ),
          answer: pct,
          form: "decimal",
          percent: true,
          mistakes: distinct([
            why(Q.of(10000 - ans, 100), "This is the percentage outside the range.", "这是范围之外的百分比。"),
            why(
              Q.of(Math.min(b, 3) - Math.max(a, -3), 1).mul(Q.of(34)),
              "This counts $34\\%$ for every standard deviation; only the two pieces next to the mean are $34\\%$.",
              "这把每个标准差都算作 $34\\%$；只有紧挨均值的两块才是 $34\\%$。",
            ),
            why(Q.of(ans, 200), "This is half of the right percentage.", "这是正确百分比的一半。"),
          ]),
          solution: t(
            `**Step 1: Write the ${type === 0 ? "values" : "value"} in standard deviations from the mean.** ${ends}.\n\n**Step 2: ${pieces.length > 1 ? "Add the pieces" : "Read the piece"} of the empirical rule in that range.**${steps(added)}So the percentage is $${dec(pct)}\\%$.\n\n**Check.** Use the percentages below each end instead: ${b >= 4 ? "all $100\\%$ of the values lie below the top" : `$${pc(belowPct(b))}\\%$ lie below $${kL(b)}$`}, and ${a <= -4 ? "$0\\%$ lie below the bottom" : `$${pc(belowPct(a))}\\%$ below $${kL(a)}$`}:${check}`,
            `**第一步：用离均值几个标准差表示${type === 0 ? "这两个值" : "这个值"}。**${endsZh}。\n\n**第二步：${pieces.length > 1 ? "把经验法则中落在该范围内的各块相加" : "读出经验法则中落在该范围内的那一块"}。**${steps(added)}所以百分比为 $${dec(pct)}\\%$。\n\n**检验。**改用每一端以下的百分比：${b >= 4 ? "全部 $100\\%$ 的数据都在上端以下" : `$${kL(b)}$ 以下占 $${pc(belowPct(b))}\\%$`}，${a <= -4 ? "下端以下占 $0\\%$" : `$${kL(a)}$ 以下占 $${pc(belowPct(a))}\\%$`}：${check}`,
          ),
        });
      },
    },
    {
      id: "counts-from-the-empirical-rule",
      title: t("Counts from the empirical rule", "由经验法则求数量"),
      explanation: t(
        "Multiply the percentage from the empirical rule by the size of the group. If $2000$ bags of flour have masses $N(1000, 5^2)$ in grams, about $2.5\\%$ weigh less than $990$ g (two standard deviations below the mean): $2000 \\cdot 0.025 = 50$ bags.\n\nCheck: the other $97.5\\%$ are $2000 \\cdot 0.975 = 1950$ bags, and $50 + 1950 = 2000$.\n\n> **Watch out.** Turn the percentage into a decimal first: $2.5\\% = 0.025$. Multiplying by $2.5$ itself gives $5000$, more bags than there are.",
        "把经验法则得到的百分比乘以总数。若 $2000$ 袋面粉的质量（克）服从 $N(1000, 5^2)$，约有 $2.5\\%$ 轻于 $990$ 克（比均值低两个标准差）：$2000 \\cdot 0.025 = 50$ 袋。\n\n检验：其余 $97.5\\%$ 为 $2000 \\cdot 0.975 = 1950$ 袋，而 $50 + 1950 = 2000$。\n\n> **注意。** 先把百分数化成小数：$2.5\\% = 0.025$。直接乘以 $2.5$ 会得到 $5000$，比袋子的总数还多。",
      ),
      generate(rng) {
        const ctx = rng.pick([
          { en: ["bags of flour", "mass", "g", "masses"], zh: ["袋面粉", "质量", "克"], mu: 1000, s: [4, 5, 8, 10] },
          { en: ["students", "test score", "points", "test scores"], zh: ["名学生", "测验成绩", "分"], mu: 70, s: [5, 6, 8, 10] },
          { en: ["eggs", "mass", "g", "masses"], zh: ["个鸡蛋", "质量", "克"], mu: 60, s: [2, 3, 4] },
          { en: ["trees", "height", "m", "heights"], zh: ["棵树", "高度", "米"], mu: 20, s: [2, 3, 4] },
        ]);
        const sigma = rng.pick(ctx.s);
        const mu = ctx.mu + rng.int(-3, 3) * sigma;
        const n = rng.pick([2000, 4000, 6000, 8000, 10000, 20000]);
        const type = rng.int(0, 2);
        let a: number;
        let b: number;
        if (type === 0) {
          a = rng.int(-3, 2);
          b = rng.int(a + 1, 3);
        } else if (type === 1) {
          a = -4;
          b = rng.int(-3, 3);
        } else {
          a = rng.int(-3, 3);
          b = 4;
        }
        const val = (k: number) => mu + k * sigma;
        const pct = belowPct(b) - belowPct(a);
        const ans = (n * pct) / 10000;
        const evEn = type === 0 ? `between $${val(a)}$ and $${val(b)}$` : type === 1 ? `less than $${val(b)}$` : `more than $${val(a)}$`;
        const evZh =
          type === 0
            ? `介于 $${val(a)}$ 与 $${val(b)}$ ${ctx.zh[2]}之间`
            : type === 1
              ? `小于 $${val(b)}$ ${ctx.zh[2]}`
              : `大于 $${val(a)}$ ${ctx.zh[2]}`;
        const kL = (k: number) => (k === 0 ? "\\mu" : `\\mu ${k > 0 ? "+" : "-"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}\\sigma`);
        const pc = (x: number) => dec(Q.of(x, 100));
        const pieces = range(a, b - a).map((k) => belowPct(k + 1) - belowPct(k));
        const added = `${pieces.length > 1 ? `${pieces.map(pc).join(" + ")} = ` : ""}${pc(pct)}\\%`;
        const ends = [...(a > -4 ? [`$${val(a)} = ${kL(a)}$`] : []), ...(b < 4 ? [`$${val(b)} = ${kL(b)}$`] : [])];
        const rest = n - ans;
        return numberProblem({
          prompt: t(
            `The ${ctx.en[3]} of $${n}$ ${ctx.en[0]} are normally distributed with mean $${mu}$ ${ctx.en[2]} and standard deviation $${sigma}$ ${ctx.en[2]}. Use the empirical rule to estimate how many have a ${ctx.en[1]} ${evEn} ${ctx.en[2]}.`,
            `$${n}$ ${ctx.zh[0]}的${ctx.zh[1]}服从均值为 $${mu}$ ${ctx.zh[2]}、标准差为 $${sigma}$ ${ctx.zh[2]}的正态分布。用经验法则估计${ctx.zh[1]}${evZh}的有多少。`,
          ),
          answer: ans,
          mistakes: distinct([
            why(rest, "This counts the ones outside the range.", "这数的是范围之外的个数。"),
            why(
              Q.of(pct, 100),
              `This is the percentage, $${pc(pct)}\\%$, not the number of ${ctx.en[0]}; multiply it by $${n}$ as a decimal.`,
              `这是百分比 $${pc(pct)}\\%$，不是个数；要把它化成小数后乘以 $${n}$。`,
            ),
            why(
              Q.of(n * pct, 100),
              `This multiplies by $${pc(pct)}$ instead of $${pc(pct)}\\% = ${dec(Q.of(pct, 10000))}$: it is a hundred times too large.`,
              `这乘的是 $${pc(pct)}$ 而不是 $${pc(pct)}\\% = ${dec(Q.of(pct, 10000))}$：大了一百倍。`,
            ),
          ]),
          solution: t(
            `**Step 1: Find the percentage.** Here ${ends.join(" and ")}, so the empirical rule gives${steps(added)}**Step 2: Multiply by the size of the group.**${steps(`${n} \\cdot ${dec(Q.of(pct, 10000))} = ${ans}`)}**Check.** The rest, $${pc(10000 - pct)}\\%$, are $${n} \\cdot ${dec(Q.of(10000 - pct, 10000))} = ${rest}$, and together:${steps(`${ans} + ${rest} = ${n}`)}`,
            `**第一步：求百分比。**这里 ${ends.join("，")}，由经验法则得${steps(added)}**第二步：乘以总数。**${steps(`${n} \\cdot ${dec(Q.of(pct, 10000))} = ${ans}`)}**检验。**其余 $${pc(10000 - pct)}\\%$ 为 $${n} \\cdot ${dec(Q.of(10000 - pct, 10000))} = ${rest}$，合起来：${steps(`${ans} + ${rest} = ${n}`)}`,
          ),
        });
      },
    },
    {
      id: "values-from-the-empirical-rule",
      title: t("Values from the empirical rule", "由经验法则求数值"),
      explanation: t(
        "Read the empirical rule backwards: from a percentage below or above a value, find how many standard deviations the value is from the mean. The percentages below $\\mu + k\\sigma$ are\n\n| $k$ | $-3$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ |\n| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| below | $0.15\\%$ | $2.5\\%$ | $16\\%$ | $50\\%$ | $84\\%$ | $97.5\\%$ | $99.85\\%$ |\n\nFor $N(100, 15^2)$, about $2.5\\%$ of values lie above $\\mu + 2\\sigma = 130$.\n\nCheck: $97.5\\%$ lie below $\\mu + 2\\sigma$, so $100 - 97.5 = 2.5\\%$ lie above it.\n\n> **Watch out.** A small percentage above a value puts the value far above the mean, and a small percentage below it puts it far below: $2.5\\%$ above is $\\mu + 2\\sigma = 130$, but $2.5\\%$ below is $\\mu - 2\\sigma = 70$.",
        "反过来使用经验法则：由某值以下或以上的百分比，求这个值离均值有几个标准差。低于 $\\mu + k\\sigma$ 的百分比为\n\n| $k$ | $-3$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ |\n| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| 以下 | $0.15\\%$ | $2.5\\%$ | $16\\%$ | $50\\%$ | $84\\%$ | $97.5\\%$ | $99.85\\%$ |\n\n对 $N(100, 15^2)$，约有 $2.5\\%$ 的数据大于 $\\mu + 2\\sigma = 130$。\n\n检验：低于 $\\mu + 2\\sigma$ 的占 $97.5\\%$，所以高于它的占 $100 - 97.5 = 2.5\\%$。\n\n> **注意。** 某值以上的百分比很小，说明这个值远高于均值；某值以下的百分比很小，说明它远低于均值：$2.5\\%$ 在其上方的值是 $\\mu + 2\\sigma = 130$，而 $2.5\\%$ 在其下方的值是 $\\mu - 2\\sigma = 70$。",
      ),
      generate(rng) {
        const mu = rng.int(4, 40) * 5;
        const sigma = rng.int(2, 12);
        const k = rng.pick([-3, -2, -1, 1, 2, 3]);
        const above = rng.bool();
        const pct = above ? 10000 - belowPct(k) : belowPct(k);
        const pl = dec(Q.of(pct, 100));
        const x = mu + k * sigma;
        const kL = `\\mu ${k > 0 ? "+" : "-"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}\\sigma`;
        const near = k > 0 ? k - 1 : k + 1;
        const below = dec(Q.of(belowPct(k), 100));
        return numberProblem({
          prompt: t(
            `The values of $X$ are normally distributed with mean $${mu}$ and standard deviation $${sigma}$. Use the empirical rule to find the value that about $${pl}\\%$ of the values lie ${above ? "above" : "below"}.`,
            `$X$ 的值服从均值为 $${mu}$、标准差为 $${sigma}$ 的正态分布。用经验法则求一个值，使约有 $${pl}\\%$ 的数据${above ? "大于" : "小于"}它。`,
          ),
          answer: x,
          mistakes: distinct([
            why(
              mu - k * sigma,
              `This is on the wrong side of the mean: $${pl}\\%$ ${above ? "above" : "below"} the value puts it ${k > 0 ? "above" : "below"} the mean.`,
              `这在均值的另一侧：有 $${pl}\\%$ 的数据${above ? "大于" : "小于"}它，说明它${k > 0 ? "高于" : "低于"}均值。`,
            ),
            why(
              mu + near * sigma,
              `This is $${near === 0 ? "\\mu" : `\\mu ${near > 0 ? "+" : "-"} ${Math.abs(near) === 1 ? "" : Math.abs(near)}\\sigma`}$, one standard deviation too close to the mean; the percentage ${above ? "above" : "below"} it is not $${pl}\\%$.`,
              `这是 $${near === 0 ? "\\mu" : `\\mu ${near > 0 ? "+" : "-"} ${Math.abs(near) === 1 ? "" : Math.abs(near)}\\sigma`}$，离均值近了一个标准差；${above ? "大于" : "小于"}它的数据不是 $${pl}\\%$。`,
            ),
            why(
              mu + k,
              `This adds $${k}$ itself to the mean; the value is $${Math.abs(k)}$ standard deviations of $${sigma}$ away, so multiply by $${sigma}$.`,
              `这把 $${k}$ 直接加到了均值上；这个值离均值 $${Math.abs(k)}$ 个标准差，每个标准差为 $${sigma}$，要乘以 $${sigma}$。`,
            ),
          ]),
          solution: t(
            `**Step 1: Find $k$ in the table.** ${above ? `About $${pl}\\%$ above means about $100 - ${pl} = ${below}\\%$ below, which is` : `About $${pl}\\%$ below is`} the percentage below $${kL}$.\n\n**Step 2: Convert to a value.**${steps(`${mu} ${k > 0 ? "+" : "-"} ${Math.abs(k)} \\cdot ${sigma} = ${x}`)}**Check.** The z-score of $${x}$ is $\\frac{${x} - ${mu}}{${sigma}} = ${k}$, and by the empirical rule $${below}\\%$ of values lie below $${kL}$${above ? `, leaving $100 - ${below} = ${pl}\\%$ above` : ""}.`,
            `**第一步：在表中找出 $k$。**${above ? `约有 $${pl}\\%$ 大于它，即约有 $100 - ${pl} = ${below}\\%$ 小于它，` : `约有 $${pl}\\%$ 小于它，`}这正是低于 $${kL}$ 的百分比。\n\n**第二步：换算成数值。**${steps(`${mu} ${k > 0 ? "+" : "-"} ${Math.abs(k)} \\cdot ${sigma} = ${x}`)}**检验。**$${x}$ 的 z 分数为 $\\frac{${x} - ${mu}}{${sigma}} = ${k}$，由经验法则，低于 $${kL}$ 的数据占 $${below}\\%$${above ? `，所以高于它的占 $100 - ${below} = ${pl}\\%$` : ""}。`,
          ),
        });
      },
    },
  ],
};

/** precalculusRandomVariableTopics are the topics of Precalculus modules 11.38 (Discrete Random Variables) and 11.39 (The Normal Distribution). */
export const precalculusRandomVariableTopics: readonly TopicDef[] = [
  probabilityMassFunctions,
  cumulativeDistributionFunctions,
  expectedValues,
  theBinomialDistribution,
  modelingWithTheBinomialDistribution,
  theGeometricDistribution,
  modelingWithTheGeometricDistribution,
  theStandardNormalDistribution,
  symmetryOfTheStandardNormal,
  theNormalDistribution,
  meanAndVarianceOfTheNormal,
  percentagePoints,
  modelingWithTheNormalDistribution,
  theEmpiricalRule,
];
