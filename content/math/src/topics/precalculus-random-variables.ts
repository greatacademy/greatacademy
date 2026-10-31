import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, poly, Q } from "@ga/subject-math";

import { choiceProblem, numberProblem, steps } from "../problems.ts";

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
  encompasses: [
    { topic: "mutually-exclusive-events", weight: 0.3 },
    { topic: "the-complement-of-an-event", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSS.MD.A.1"],
  knowledgePoints: [
    {
      id: "missing-probability-in-a-distribution",
      title: t("Finding a missing probability", "求缺失的概率"),
      explanation: t(
        "A **discrete random variable** $X$ is a quantity whose value is determined by a random experiment and that takes separate values, such as the number of heads in three coin tosses. Its **probability mass function** (or probability distribution) gives $P(X = x)$ for each value $x$.\n\nEvery probability is between $0$ and $1$, and since exactly one value occurs, the probabilities add up to $1$:\n\n$$\\sum_x P(X = x) = 1.$$\n\nIf $X$ takes the values $1, 2, 3$ with probabilities $0.2$, $0.5$ and $p$, then $0.2 + 0.5 + p = 1$, so $p = 0.3$.",
        "**离散随机变量** $X$ 是由随机试验决定、取值彼此分离的量，例如抛三次硬币时正面朝上的次数。它的**概率质量函数**（或概率分布）给出每个值 $x$ 的概率 $P(X = x)$。\n\n每个概率都在 $0$ 与 $1$ 之间；又因为恰好有一个值出现，所有概率之和为 $1$：\n\n$$\\sum_x P(X = x) = 1.$$\n\n若 $X$ 取 $1, 2, 3$ 的概率分别为 $0.2$、$0.5$ 和 $p$，则 $0.2 + 0.5 + p = 1$，所以 $p = 0.3$。",
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
          wrong: [Q.of(sumKnown, 100), Q.of(ps[m]! + known[0]!, 100)],
          solution: t(
            `The probabilities add up to $1$:${steps(`${known.map(h).join(" + ")} + p = 1`, `${h(sumKnown)} + p = 1`, `p = ${h(ps[m]!)}`)}`,
            `所有概率之和为 $1$：${steps(`${known.map(h).join(" + ")} + p = 1`, `${h(sumKnown)} + p = 1`, `p = ${h(ps[m]!)}`)}`,
          ),
        });
      },
    },
    {
      id: "probabilities-of-events-from-a-distribution",
      title: t("Probabilities of events", "事件的概率"),
      explanation: t(
        "The values of $X$ are mutually exclusive, so the probability that $X$ lies in a set of values is the sum of their probabilities. Watch whether an endpoint is included: $X \\le 2$ includes $2$, while $X < 2$ does not.\n\nIf $P(X = 0) = 0.1$, $P(X = 1) = 0.3$, $P(X = 2) = 0.4$ and $P(X = 3) = 0.2$, then\n\n$$P(X \\ge 2) = 0.4 + 0.2 = 0.6, \\qquad P(X < 2) = 0.1 + 0.3 = 0.4.$$",
        "$X$ 的各个取值互斥，所以 $X$ 落在一组值中的概率等于这些值的概率之和。注意端点是否包含在内：$X \\le 2$ 包含 $2$，而 $X < 2$ 不包含。\n\n若 $P(X = 0) = 0.1$，$P(X = 1) = 0.3$，$P(X = 2) = 0.4$，$P(X = 3) = 0.2$，则\n\n$$P(X \\ge 2) = 0.4 + 0.2 = 0.6, \\qquad P(X < 2) = 0.1 + 0.3 = 0.4.$$",
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
          wrong: [Q.of(total(other), 100), Q.of(100 - ans, 100)],
          solution: t(
            `Add the probabilities of the values $x$ with $${ev.replace("X", "x")}$:${steps(line)}`,
            `把满足 $${ev.replace("X", "x")}$ 的各个值 $x$ 的概率相加：${steps(line)}`,
          ),
        });
      },
    },
    {
      id: "distributions-given-by-a-formula",
      title: t("Distributions given by a formula", "由公式给出的分布"),
      explanation: t(
        "A probability mass function can be given by a formula with an unknown constant $k$. Write out every probability, set their sum equal to $1$ and solve for $k$.\n\nIf $P(X = x) = kx$ for $x = 1, 2, 3, 4$, then\n\n$$k + 2k + 3k + 4k = 1 \\quad\\Rightarrow\\quad 10k = 1 \\quad\\Rightarrow\\quad k = \\frac{1}{10},$$\n\nand, for example, $P(X = 3) = \\frac{3}{10}$.",
        "概率质量函数也可以由含未知常数 $k$ 的公式给出。写出每个概率，令它们的和等于 $1$，解出 $k$。\n\n若 $P(X = x) = kx$，$x = 1, 2, 3, 4$，则\n\n$$k + 2k + 3k + 4k = 1 \\quad\\Rightarrow\\quad 10k = 1 \\quad\\Rightarrow\\quad k = \\frac{1}{10},$$\n\n例如 $P(X = 3) = \\frac{3}{10}$。",
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
        const kLines = [sumLine, `${total}k = 1`, `k = ${kq.toLatex()}`];
        if (ask === 0) {
          return numberProblem({
            prompt: t(`${setup.en} Find $k$.${simplest.en}`, `${setup["zh-CN"]}求 $k$。${simplest["zh-CN"]}`),
            answer: kq,
            wrong: [Q.of(total), Q.of(1, n), Q.of(1, n * n)],
            solution: t(`The probabilities add up to $1$:${steps(...kLines)}`, `所有概率之和为 $1$：${steps(...kLines)}`),
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
          wrong: [kq, ask === 1 ? Q.of(1, n) : Q.of(2, n), Q.of(ask === 1 ? term(j) : term(n - 1) + term(n), n), Q.one.sub(ans)],
          solution: t(
            `First find $k$ from the sum of the probabilities:${steps(...kLines)}Then${steps(last)}`,
            `先由概率之和求 $k$：${steps(...kLines)}于是${steps(last)}`,
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
  knowledgePoints: [
    {
      id: "values-of-the-cdf",
      title: t("Values of the cumulative distribution function", "累积分布函数的值"),
      explanation: t(
        "The **cumulative distribution function** of $X$ is\n\n$$F(x) = P(X \\le x),$$\n\nthe running total of the probabilities up to and including $x$. It is defined for every real $x$: between two values of $X$ it stays constant. If $X$ takes the values $1, 2, 3$ with probabilities $0.2, 0.5, 0.3$, then $F(2) = 0.2 + 0.5 = 0.7$, and also $F(2.5) = 0.7$, because $X$ takes no value between $2$ and $2.5$.",
        "$X$ 的**累积分布函数**是\n\n$$F(x) = P(X \\le x),$$\n\n即到 $x$ 为止（包括 $x$）的概率的累计和。它对每个实数 $x$ 都有定义：在 $X$ 的两个相邻取值之间保持不变。若 $X$ 取 $1, 2, 3$ 的概率分别为 $0.2, 0.5, 0.3$，则 $F(2) = 0.2 + 0.5 = 0.7$，并且 $F(2.5) = 0.7$，因为 $X$ 在 $2$ 与 $2.5$ 之间不取值。",
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
          wrong: [Q.of(ps[j]!, 100), Q.of(cum[j + 1]!, 100), ...(j > 0 ? [Q.of(cum[j - 1]!, 100)] : []), Q.of(100 - ans, 100)],
          solution: t(
            `Add the probabilities of all values of $X$ up to $${a}$${half ? `; the largest of them is $${xs[j]}$` : ""}:${steps(line)}`,
            `把 $X$ 不超过 $${a}$ 的各个取值的概率相加${half ? `，其中最大的是 $${xs[j]}$` : ""}：${steps(line)}`,
          ),
        });
      },
    },
    {
      id: "probabilities-from-the-cdf",
      title: t("Probabilities from the cumulative distribution function", "由累积分布函数求概率"),
      explanation: t(
        "The cumulative distribution function determines every probability. For consecutive values $a - 1$ and $a$ of $X$:\n\n$$P(X = a) = F(a) - F(a - 1), \\qquad P(X > a) = 1 - F(a), \\qquad P(X \\ge a) = 1 - F(a - 1).$$\n\nIf $F(2) = 0.45$ and $F(3) = 0.8$, then $P(X = 3) = 0.8 - 0.45 = 0.35$ and $P(X > 3) = 1 - 0.8 = 0.2$.",
        "累积分布函数决定所有概率。设 $a - 1$ 与 $a$ 是 $X$ 的相邻取值：\n\n$$P(X = a) = F(a) - F(a - 1), \\qquad P(X > a) = 1 - F(a), \\qquad P(X \\ge a) = 1 - F(a - 1).$$\n\n若 $F(2) = 0.45$，$F(3) = 0.8$，则 $P(X = 3) = 0.8 - 0.45 = 0.35$，$P(X > 3) = 1 - 0.8 = 0.2$。",
      ),
      generate(rng) {
        const xs = range(rng.int(-1, 2), 5);
        const cum = cumulative(parts(rng, 5));
        const tab = table(xs, "F(x)", cum.map(h));
        const type = rng.int(0, 2);
        let ev: string;
        let ans: number;
        let wrong: number[];
        let line: string;
        if (type === 0) {
          const j = rng.int(1, 4);
          ev = `X = ${xs[j]}`;
          ans = cum[j]! - cum[j - 1]!;
          wrong = [cum[j]!, 100 - cum[j]!];
          line = `P(X = ${xs[j]}) = F(${xs[j]}) - F(${xs[j - 1]}) = ${h(cum[j]!)} - ${h(cum[j - 1]!)} = ${h(ans)}`;
        } else if (type === 1) {
          const j = rng.int(0, 3);
          ev = `X > ${xs[j]}`;
          ans = 100 - cum[j]!;
          wrong = [cum[j]!, ...(j > 0 ? [100 - cum[j - 1]!] : [])];
          line = `P(X > ${xs[j]}) = 1 - F(${xs[j]}) = 1 - ${h(cum[j]!)} = ${h(ans)}`;
        } else {
          const j = rng.int(1, 4);
          ev = `X \\ge ${xs[j]}`;
          ans = 100 - cum[j - 1]!;
          wrong = [100 - cum[j]!, cum[j - 1]!];
          line = `P(X \\ge ${xs[j]}) = 1 - F(${xs[j - 1]}) = 1 - ${h(cum[j - 1]!)} = ${h(ans)}`;
        }
        return numberProblem({
          prompt: t(`${cdfIntro.en}\n\n${tab}\n\nFind $P(${ev})$.`, `${cdfIntro["zh-CN"]}\n\n${tab}\n\n求 $P(${ev})$。`),
          answer: Q.of(ans, 100),
          form: "decimal",
          wrong: wrong.map((w) => Q.of(w, 100)),
          solution: t(`Write the probability using values of $F$:${steps(line)}`, `用 $F$ 的值表示所求概率：${steps(line)}`),
        });
      },
    },
    {
      id: "probabilities-of-intervals-from-the-cdf",
      title: t("Probabilities of intervals", "区间的概率"),
      explanation: t(
        "For values $a < b$,\n\n$$P(a < X \\le b) = F(b) - F(a),$$\n\nsince $F(b)$ counts every value up to $b$ and subtracting $F(a)$ removes those up to $a$. For other endpoints, adjust which values are counted: when $X$ takes only integer values, $P(a \\le X \\le b) = F(b) - F(a - 1)$ and $P(a < X < b) = F(b - 1) - F(a)$.",
        "对 $a < b$，\n\n$$P(a < X \\le b) = F(b) - F(a),$$\n\n因为 $F(b)$ 计入了不超过 $b$ 的所有取值，减去 $F(a)$ 就去掉了不超过 $a$ 的那些。端点不同时，要调整计入哪些取值：当 $X$ 只取整数时，$P(a \\le X \\le b) = F(b) - F(a - 1)$，$P(a < X < b) = F(b - 1) - F(a)$。",
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
          wrong: [F(b) - F(a), F(b) - F(a - 1), F(b - 1) - F(a), F(hi) + F(lo - 1)].map((w) => Q.of(w, 100)),
          solution: t(
            `The event contains the values from $${xs[lo]}$ to $${xs[hi]}$:${steps(line)}`,
            `这个事件包含从 $${xs[lo]}$ 到 $${xs[hi]}$ 的取值：${steps(line)}`,
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
    { topic: "probability-mass-functions-of-discrete-random-variables", weight: 0.4 },
    { topic: "mean-of-a-data-set", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSS.MD.A.2", "CCSS.HSS.MD.B.5"],
  knowledgePoints: [
    {
      id: "expected-value-from-a-distribution",
      title: t("Computing an expected value", "计算期望"),
      explanation: t(
        "The **expected value** (or mean) of a discrete random variable is the probability-weighted average of its values:\n\n$$E(X) = \\sum_x x \\cdot P(X = x).$$\n\nIt is the long-run average of $X$ over many repetitions, and it need not be a value $X$ can take. If $X$ takes the values $0, 1, 4$ with probabilities $0.5, 0.3, 0.2$, then\n\n$$E(X) = 0(0.5) + 1(0.3) + 4(0.2) = 1.1.$$",
        "离散随机变量的**期望**（或均值）是其取值按概率加权的平均：\n\n$$E(X) = \\sum_x x \\cdot P(X = x).$$\n\n它是多次重复试验中 $X$ 的长期平均，不一定是 $X$ 能取到的值。若 $X$ 取 $0, 1, 4$ 的概率分别为 $0.5, 0.3, 0.2$，则\n\n$$E(X) = 0(0.5) + 1(0.3) + 4(0.2) = 1.1.$$",
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
          wrong: [Q.of(sum(xs), k), Q.of(total - xs[k - 1]! * ps[k - 1]!, 100)],
          solution: t(
            `Multiply each value by its probability and add:${steps(`E(X) = ${terms} = ${dec(ans)}`)}`,
            `把每个取值乘以它的概率再相加：${steps(`E(X) = ${terms} = ${dec(ans)}`)}`,
          ),
        });
      },
    },
    {
      id: "unknown-value-from-the-expected-value",
      title: t("Using the expected value to find an unknown", "由期望求未知量"),
      explanation: t(
        "When the expected value is known, the formula $E(X) = \\sum x \\cdot P(X = x)$ is an equation for any one unknown in the table.\n\nIf $X$ takes the values $1, 2, a$ with probabilities $0.5, 0.3, 0.2$ and $E(X) = 2.7$, then\n\n$$0.5 + 0.6 + 0.2a = 2.7 \\quad\\Rightarrow\\quad 0.2a = 1.6 \\quad\\Rightarrow\\quad a = 8.$$",
        "已知期望时，公式 $E(X) = \\sum x \\cdot P(X = x)$ 就成为关于表中某个未知量的方程。\n\n若 $X$ 取 $1, 2, a$ 的概率分别为 $0.5, 0.3, 0.2$，且 $E(X) = 2.7$，则\n\n$$0.5 + 0.6 + 0.2a = 2.7 \\quad\\Rightarrow\\quad 0.2a = 1.6 \\quad\\Rightarrow\\quad a = 8.$$",
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
          wrong: [Q.of(xs[3]! * ps[3]!, 100), Q.of(total, ps[3]!), Q.of(total + rest, ps[3]!)],
          solution: t(
            `Set up the expected value:${steps(`${terms} + ${h(ps[3]!)}a = ${dec(e)}`, `${dec(Q.of(rest, 100))} + ${h(ps[3]!)}a = ${dec(e)}`, `${h(ps[3]!)}a = ${dec(Q.of(total - rest, 100))}`, `a = ${xs[3]}`)}`,
            `列出期望的方程：${steps(`${terms} + ${h(ps[3]!)}a = ${dec(e)}`, `${dec(Q.of(rest, 100))} + ${h(ps[3]!)}a = ${dec(e)}`, `${h(ps[3]!)}a = ${dec(Q.of(total - rest, 100))}`, `a = ${xs[3]}`)}`,
          ),
        });
      },
    },
    {
      id: "expected-gain-of-a-game",
      title: t("Expected gain of a game", "游戏的期望收益"),
      explanation: t(
        "In a game of chance, let $X$ be the net gain: the prize won minus the cost of playing. The expected gain $E(X)$ is the average gain per game in the long run. A game is **fair** when $E(X) = 0$; when $E(X) < 0$ the player loses money on average.\n\nA game costs $2$ dollars. A fair die is rolled and a six wins $9$ dollars. The net gain is $7$ with probability $\\frac{1}{6}$ and $-2$ with probability $\\frac{5}{6}$, so\n\n$$E(X) = 7 \\cdot \\frac{1}{6} - 2 \\cdot \\frac{5}{6} = -\\frac{1}{2}.$$\n\nEquivalently, the expected prize $\\frac{9}{6} = \\frac{3}{2}$ minus the cost $2$ is $-\\frac{1}{2}$.",
        "在机会游戏中，设 $X$ 为净收益：赢得的奖金减去参加游戏的费用。期望收益 $E(X)$ 是长期来看每局的平均收益。$E(X) = 0$ 的游戏是**公平的**；$E(X) < 0$ 时，玩家平均会亏钱。\n\n玩一局需要 $2$ 元。掷一颗均匀骰子，掷出六点赢得 $9$ 元。净收益以概率 $\\frac{1}{6}$ 为 $7$，以概率 $\\frac{5}{6}$ 为 $-2$，所以\n\n$$E(X) = 7 \\cdot \\frac{1}{6} - 2 \\cdot \\frac{5}{6} = -\\frac{1}{2}.$$\n\n也可以用期望奖金 $\\frac{9}{6} = \\frac{3}{2}$ 减去费用 $2$，得 $-\\frac{1}{2}$。",
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
          wrong: [prize, Q.of(w1 + w2, 6).sub(Q.of(c)), Q.of(w1 + w2, 2).sub(Q.of(c)), Q.of(s1 * (w1 - c) + s2 * (w2 - c), 6)],
          solution: t(
            `The cost is paid in every game, so subtract it from the expected prize:${steps(line1, line2)}`,
            `每局都要支付费用，所以用期望奖金减去费用：${steps(line1Zh, line2)}`,
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
    "Compute probabilities for a binomial random variable X ~ B(n, p) with the formula C(n, k)p^k(1 − p)^(n − k), combine them for events such as X ≤ 1 or X ≥ 1, and find its mean np and variance np(1 − p).",
    "用公式 C(n, k)p^k(1 − p)^(n − k) 计算二项随机变量 X ~ B(n, p) 的概率，把它们组合起来求 X ≤ 1、X ≥ 1 等事件的概率，并求其均值 np 与方差 np(1 − p)。",
  ),
  prerequisites: [
    "combinations",
    "tree-diagrams-for-independent-events",
    "expected-values-of-discrete-random-variables",
    "cumulative-distribution-functions-for-discrete-random-variables",
  ],
  encompasses: [
    { topic: "combinations", weight: 0.3 },
    { topic: "tree-diagrams-for-independent-events", weight: 0.4 },
    { topic: "expected-values-of-discrete-random-variables", weight: 0.2 },
    { topic: "cumulative-distribution-functions-for-discrete-random-variables", weight: 0.2 },
  ],
  xp: 20,
  standards: ["CCSS.HSS.MD.A.3", "CCSS.HSS.MD.A.4"],
  knowledgePoints: [
    {
      id: "binomial-probabilities",
      keyPrerequisites: ["combinations"],
      title: t("Binomial probabilities", "二项分布的概率"),
      explanation: t(
        "Suppose an experiment is repeated $n$ times, the trials are independent, and each trial is a success with the same probability $p$. The number of successes $X$ has the **binomial distribution**, written $X \\sim B(n, p)$, and\n\n$$P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k}, \\qquad k = 0, 1, \\ldots, n.$$\n\nEach particular order of $k$ successes and $n - k$ failures has probability $p^k(1 - p)^{n - k}$, and there are $\\binom{n}{k}$ such orders. For $X \\sim B\\left(4, \\frac{1}{3}\\right)$:\n\n$$P(X = 2) = \\binom{4}{2}\\left(\\frac{1}{3}\\right)^2\\left(\\frac{2}{3}\\right)^2 = 6 \\cdot \\frac{1}{9} \\cdot \\frac{4}{9} = \\frac{8}{27}.$$",
        "设一个试验重复 $n$ 次，各次试验相互独立，且每次成功的概率都是 $p$。成功的次数 $X$ 服从**二项分布**，记作 $X \\sim B(n, p)$，且\n\n$$P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k}, \\qquad k = 0, 1, \\ldots, n.$$\n\n$k$ 次成功、$n - k$ 次失败的每一种特定顺序的概率都是 $p^k(1 - p)^{n - k}$，而这样的顺序共有 $\\binom{n}{k}$ 种。对 $X \\sim B\\left(4, \\frac{1}{3}\\right)$：\n\n$$P(X = 2) = \\binom{4}{2}\\left(\\frac{1}{3}\\right)^2\\left(\\frac{2}{3}\\right)^2 = 6 \\cdot \\frac{1}{9} \\cdot \\frac{4}{9} = \\frac{8}{27}.$$",
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
          wrong: [p.pow(k).mul(q.pow(n - k)), Q.of(c).mul(p.pow(k)), binomP(n, k, q), Q.of(c).mul(p.pow(k)).mul(q)],
          solution: t(
            `Use the binomial formula with $n = ${n}$, $k = ${k}$:${steps(line)}`,
            `用二项分布公式，$n = ${n}$，$k = ${k}$：${steps(line)}`,
          ),
        });
      },
    },
    {
      id: "cumulative-binomial-probabilities",
      title: t("Cumulative binomial probabilities", "二项分布的累积概率"),
      explanation: t(
        "For an event such as $X \\le 1$, add the probabilities of the values it contains. When the event contains most values, use the complement: $P(X \\ge 1) = 1 - P(X = 0) = 1 - (1 - p)^n$.\n\nFor $X \\sim B\\left(3, \\frac{1}{4}\\right)$:\n\n$$P(X \\le 1) = \\left(\\frac{3}{4}\\right)^3 + 3 \\cdot \\frac{1}{4}\\left(\\frac{3}{4}\\right)^2 = \\frac{27}{64} + \\frac{27}{64} = \\frac{27}{32},$$\n\n$$P(X \\ge 1) = 1 - \\left(\\frac{3}{4}\\right)^3 = \\frac{37}{64}.$$",
        "对于 $X \\le 1$ 这样的事件，把它包含的各个取值的概率相加。当事件包含大多数取值时，用对立事件：$P(X \\ge 1) = 1 - P(X = 0) = 1 - (1 - p)^n$。\n\n对 $X \\sim B\\left(3, \\frac{1}{4}\\right)$：\n\n$$P(X \\le 1) = \\left(\\frac{3}{4}\\right)^3 + 3 \\cdot \\frac{1}{4}\\left(\\frac{3}{4}\\right)^2 = \\frac{27}{64} + \\frac{27}{64} = \\frac{27}{32},$$\n\n$$P(X \\ge 1) = 1 - \\left(\\frac{3}{4}\\right)^3 = \\frac{37}{64}.$$",
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
        let ev: string;
        let ans: Q;
        let wrong: Q[];
        let lines: string[];
        if (type === 0) {
          ev = "X \\le 1";
          ans = p0.add(p1);
          wrong = [p0, p1, Q.one.sub(ans)];
          lines = [
            `P(X \\le 1) = P(X = 0) + P(X = 1) = ${pw(q, n)} + ${n} \\cdot ${p.toLatex()} \\cdot ${pw(q, n - 1)}`,
            `= ${p0.toLatex()} + ${p1.toLatex()} = ${ans.toLatex()}`,
          ];
        } else if (type === 1) {
          ev = "X \\ge 1";
          ans = Q.one.sub(p0);
          wrong = [p0, Q.one.sub(pn), p1];
          lines = [`P(X \\ge 1) = 1 - P(X = 0) = 1 - ${pw(q, n)} = 1 - ${p0.toLatex()} = ${ans.toLatex()}`];
        } else if (type === 2) {
          ev = `X \\ge ${n - 1}`;
          ans = pn1.add(pn);
          wrong = [pn, pn1, Q.one.sub(ans)];
          lines = [
            `P(X \\ge ${n - 1}) = P(X = ${n - 1}) + P(X = ${n}) = ${n} \\cdot ${pw(p, n - 1)} \\cdot ${q.toLatex()} + ${pw(p, n)}`,
            `= ${pn1.toLatex()} + ${pn.toLatex()} = ${ans.toLatex()}`,
          ];
        } else {
          ev = `X \\le ${n - 1}`;
          ans = Q.one.sub(pn);
          wrong = [pn, Q.one.sub(p0), Q.one.sub(pn1)];
          lines = [`P(X \\le ${n - 1}) = 1 - P(X = ${n}) = 1 - ${pw(p, n)} = 1 - ${pn.toLatex()} = ${ans.toLatex()}`];
        }
        return numberProblem({
          prompt: t(
            `$X \\sim B\\left(${n}, ${p.toLatex()}\\right)$. Find $P(${ev})$.${simplest.en}`,
            `$X \\sim B\\left(${n}, ${p.toLatex()}\\right)$。求 $P(${ev})$。${simplest["zh-CN"]}`,
          ),
          answer: ans,
          wrong,
          solution: t(
            `Add the probabilities, or subtract the complement from $1$:${steps(...lines)}`,
            `把概率相加，或用 $1$ 减去对立事件的概率：${steps(...lines)}`,
          ),
        });
      },
    },
    {
      id: "mean-and-variance-of-a-binomial-distribution",
      title: t("Mean and variance", "均值与方差"),
      explanation: t(
        "If $X \\sim B(n, p)$, then\n\n$$E(X) = np, \\qquad \\operatorname{Var}(X) = np(1 - p).$$\n\nThe mean says that a fraction $p$ of the $n$ trials succeed on average; the variance measures the spread around it, and the standard deviation is $\\sqrt{np(1 - p)}$. For $X \\sim B(40, 0.3)$: $E(X) = 40 \\cdot 0.3 = 12$ and $\\operatorname{Var}(X) = 40 \\cdot 0.3 \\cdot 0.7 = 8.4$.",
        "若 $X \\sim B(n, p)$，则\n\n$$E(X) = np, \\qquad \\operatorname{Var}(X) = np(1 - p).$$\n\n均值表示平均有比例 $p$ 的试验成功；方差度量围绕均值的离散程度，标准差为 $\\sqrt{np(1 - p)}$。对 $X \\sim B(40, 0.3)$：$E(X) = 40 \\cdot 0.3 = 12$，$\\operatorname{Var}(X) = 40 \\cdot 0.3 \\cdot 0.7 = 8.4$。",
      ),
      generate(rng) {
        const r = rng.pick([10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90]);
        const p = Q.of(r, 100);
        const q = Q.one.sub(p);
        const n = rng.int(8, 60);
        const mean = p.mul(Q.of(n));
        const v = mean.mul(q);
        const ask = rng.int(0, 2);
        const dist = `X \\sim B(${n}, ${dec(p)})`;
        if (ask === 0) {
          return numberProblem({
            prompt: t(`$${dist}$. Find $E(X)$.`, `$${dist}$。求 $E(X)$。`),
            answer: mean,
            wrong: [v, q.mul(Q.of(n)), Q.of(n, 2)],
            solution: t(
              `${steps(`E(X) = np = ${n} \\cdot ${dec(p)} = ${dec(mean)}`)}`,
              `${steps(`E(X) = np = ${n} \\cdot ${dec(p)} = ${dec(mean)}`)}`,
            ),
          });
        }
        if (ask === 1) {
          const line = `\\operatorname{Var}(X) = np(1 - p) = ${n} \\cdot ${dec(p)} \\cdot ${dec(q)} = ${dec(v)}`;
          return numberProblem({
            prompt: t(`$${dist}$. Find $\\operatorname{Var}(X)$.`, `$${dist}$。求 $\\operatorname{Var}(X)$。`),
            answer: v,
            wrong: [mean, mean.mul(p), q.mul(Q.of(n))],
            solution: t(`${steps(line)}`, `${steps(line)}`),
          });
        }
        return numberProblem({
          prompt: t(
            `$X \\sim B(n, ${dec(p)})$ and $E(X) = ${dec(mean)}$. Find $n$.`,
            `$X \\sim B(n, ${dec(p)})$，且 $E(X) = ${dec(mean)}$。求 $n$。`,
          ),
          answer: n,
          wrong: [mean.mul(p), mean.div(q), mean.add(p)],
          solution: t(
            `${steps(`np = ${dec(mean)}`, `n = \\frac{${dec(mean)}}{${dec(p)}} = ${n}`)}`,
            `${steps(`np = ${dec(mean)}`, `n = \\frac{${dec(mean)}}{${dec(p)}} = ${n}`)}`,
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
  knowledgePoints: [
    {
      id: "identifying-a-binomial-model",
      title: t("Identifying the model", "确定模型"),
      explanation: t(
        'A count $X$ is binomial when:\n\n- there is a fixed number $n$ of trials;\n- each trial has two outcomes, success and failure;\n- the trials are independent;\n- every trial succeeds with the same probability $p$.\n\nThen $X \\sim B(n, p)$. Decide carefully what counts as a success: if a die is rolled $10$ times and $X$ counts the rolls that are **not** a six, a success is "not a six" and $X \\sim B\\left(10, \\frac{5}{6}\\right)$.',
        "当满足以下条件时，计数 $X$ 服从二项分布：\n\n- 试验次数 $n$ 固定；\n- 每次试验只有成功与失败两种结果；\n- 各次试验相互独立；\n- 每次试验成功的概率都是同一个 $p$。\n\n这时 $X \\sim B(n, p)$。要仔细判断什么算“成功”：若掷骰子 $10$ 次，$X$ 统计**不是**六点的次数，那么“成功”就是“不是六点”，$X \\sim B\\left(10, \\frac{5}{6}\\right)$。",
      ),
      generate(rng) {
        const c = binContext(rng, 4, 20);
        const B = (n: number, p: Q) =>
          t(`$X \\sim B\\left(${n}, ${pd(p, c.decimal)}\\right)$`, `$X \\sim B\\left(${n}, ${pd(p, c.decimal)}\\right)$`);
        const half = Q.of(1, 2);
        return oneOf(
          rng,
          t(`${c.setup.en} Which distribution models $X$?`, `${c.setup["zh-CN"]}哪个分布是 $X$ 的模型？`),
          B(c.n, c.p),
          [B(c.n, Q.one.sub(c.p)), B(c.other, c.p), B(c.n, c.p.eq(half) ? Q.of(1, 3) : half)],
          t(
            `There are $n = ${c.n}$ independent trials, and each is a success (counted by $X$) with probability $p = ${pd(c.p, c.decimal)}$. So $X \\sim B\\left(${c.n}, ${pd(c.p, c.decimal)}\\right)$.`,
            `共有 $n = ${c.n}$ 次独立试验，每次“成功”（被 $X$ 计入）的概率为 $p = ${pd(c.p, c.decimal)}$。所以 $X \\sim B\\left(${c.n}, ${pd(c.p, c.decimal)}\\right)$。`,
          ),
        );
      },
    },
    {
      id: "binomial-probabilities-in-context",
      title: t("Probabilities in context", "情境中的概率"),
      explanation: t(
        'Once the model $X \\sim B(n, p)$ is identified, translate the question into an event for $X$ and use the binomial formula. "At least one" is $X \\ge 1$, best found as $1 - P(X = 0)$; "at most one" is $X \\le 1$.\n\nA fair coin is tossed $5$ times; $X$, the number of heads, is $B\\left(5, \\frac{1}{2}\\right)$. The probability of at least one head is $1 - \\left(\\frac{1}{2}\\right)^5 = \\frac{31}{32}$.',
        "确定模型 $X \\sim B(n, p)$ 后，把问题翻译成关于 $X$ 的事件，再用二项分布公式。“至少一次”是 $X \\ge 1$，最好用 $1 - P(X = 0)$ 求；“至多一次”是 $X \\le 1$。\n\n把一枚均匀硬币抛 $5$ 次，正面次数 $X \\sim B\\left(5, \\frac{1}{2}\\right)$。至少出现一次正面的概率为 $1 - \\left(\\frac{1}{2}\\right)^5 = \\frac{31}{32}$。",
      ),
      generate(rng) {
        const c = binContext(rng, 3, 5);
        const { n, p } = c;
        const q = Q.one.sub(p);
        const pl = c.decimal ? pwd : pw;
        const type = rng.int(0, 2);
        const k = rng.int(1, n - 1);
        let ev: string;
        let ans: Q;
        let wrong: Q[];
        let line: string;
        if (type === 0) {
          ev = `X = ${k}`;
          ans = binomP(n, k, p);
          wrong = [p.pow(k).mul(q.pow(n - k)), binomP(n, k, q)];
          line = `P(X = ${k}) = ${binomTerm(n, k, p, q, pl)} = ${pd(ans, c.decimal)}`;
        } else if (type === 1) {
          ev = "X \\ge 1";
          ans = Q.one.sub(q.pow(n));
          wrong = [q.pow(n), Q.one.sub(p.pow(n)), binomP(n, 1, p)];
          line = `P(X \\ge 1) = 1 - P(X = 0) = 1 - ${pl(q, n)} = ${pd(ans, c.decimal)}`;
        } else {
          ev = "X \\le 1";
          ans = q.pow(n).add(binomP(n, 1, p));
          wrong = [q.pow(n), binomP(n, 1, p), Q.one.sub(ans)];
          line = `P(X \\le 1) = ${pl(q, n)} + ${binomTerm(n, 1, p, q, pl)} = ${pd(ans, c.decimal)}`;
        }
        const ask = c.decimal ? asDecimal : simplest;
        return numberProblem({
          prompt: t(`${c.setup.en} Find $P(${ev})$.${ask.en}`, `${c.setup["zh-CN"]}求 $P(${ev})$。${ask["zh-CN"]}`),
          answer: ans,
          ...(c.decimal && { form: "decimal" as const }),
          wrong,
          solution: t(
            `Here $X \\sim B\\left(${n}, ${pd(p, c.decimal)}\\right)$:${steps(line)}`,
            `这里 $X \\sim B\\left(${n}, ${pd(p, c.decimal)}\\right)$：${steps(line)}`,
          ),
        });
      },
    },
    {
      id: "expected-counts-in-context",
      title: t("Expected counts in context", "情境中的期望个数"),
      explanation: t(
        "For a binomial model, the expected number of successes is $np$ and the variance is $np(1 - p)$. If $3\\%$ of the items a machine makes are defective, a sample of $200$ items is expected to contain $200 \\cdot 0.03 = 6$ defective items, with variance $200 \\cdot 0.03 \\cdot 0.97 = 5.82$.\n\nTo expect $m$ successes, the number of trials must satisfy $np = m$, so $n = \\frac{m}{p}$.",
        "对二项模型，成功的期望次数为 $np$，方差为 $np(1 - p)$。若某机器生产的产品有 $3\\%$ 是次品，则 $200$ 件的样本中期望有 $200 \\cdot 0.03 = 6$ 件次品，方差为 $200 \\cdot 0.03 \\cdot 0.97 = 5.82$。\n\n要期望得到 $m$ 次成功，试验次数须满足 $np = m$，即 $n = \\frac{m}{p}$。",
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
        if (ask === 0) {
          return numberProblem({
            prompt: t(
              `${intro.en} In a random sample of $${n}$ ${ctx.en[1]}, how many ${ctx.en[2]} are expected?`,
              `${intro["zh-CN"]}随机抽取 $${n}$ ${ctx.zh[1]}，期望有多少${ctx.zh[2]}？`,
            ),
            answer: mean,
            wrong: [Q.of(n * r), v, q.mul(Q.of(n))],
            solution: t(
              `The number $X$ of ${ctx.en[2]} is $B(${n}, ${dec(p)})$:${steps(`E(X) = np = ${n} \\cdot ${dec(p)} = ${dec(mean)}`)}`,
              `${ctx.zh[2]}的个数 $X \\sim B(${n}, ${dec(p)})$：${steps(`E(X) = np = ${n} \\cdot ${dec(p)} = ${dec(mean)}`)}`,
            ),
          });
        }
        if (ask === 1) {
          const line = `\\operatorname{Var}(X) = np(1 - p) = ${n} \\cdot ${dec(p)} \\cdot ${dec(q)} = ${dec(v)}`;
          return numberProblem({
            prompt: t(
              `${intro.en} Let $X$ be the number of ${ctx.en[2]} in a random sample of $${n}$ ${ctx.en[1]}. Find $\\operatorname{Var}(X)$.`,
              `${intro["zh-CN"]}设 $X$ 为随机抽取的 $${n}$ ${ctx.zh[1]}中${ctx.zh[2]}的个数。求 $\\operatorname{Var}(X)$。`,
            ),
            answer: v,
            wrong: [mean, mean.mul(p), q.mul(Q.of(n))],
            solution: t(`Here $X \\sim B(${n}, ${dec(p)})$:${steps(line)}`, `这里 $X \\sim B(${n}, ${dec(p)})$：${steps(line)}`),
          });
        }
        return numberProblem({
          prompt: t(
            `${intro.en} How many ${ctx.en[1]} must be sampled for the expected number of ${ctx.en[2]} to be $${dec(mean)}$?`,
            `${intro["zh-CN"]}要使${ctx.zh[2]}的期望个数为 $${dec(mean)}$，需要抽取多少${ctx.zh[3]}？`,
          ),
          answer: n,
          wrong: [mean.mul(p), mean.mul(Q.of(r)), mean.div(q)],
          solution: t(
            `The expected number is $np$:${steps(`${dec(p)}n = ${dec(mean)}`, `n = \\frac{${dec(mean)}}{${dec(p)}} = ${n}`)}`,
            `期望个数为 $np$：${steps(`${dec(p)}n = ${dec(mean)}`, `n = \\frac{${dec(mean)}}{${dec(p)}} = ${n}`)}`,
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
    "Compute probabilities for a geometric random variable X ~ Geo(p), the number of independent trials up to and including the first success, including tail probabilities P(X > k) = (1 − p)^k, and find its mean 1/p.",
    "计算几何随机变量 X ~ Geo(p)（独立重复试验中直到第一次成功为止的试验次数）的概率，包括尾部概率 P(X > k) = (1 − p)^k，并求其均值 1/p。",
  ),
  prerequisites: ["the-binomial-distribution", "the-sum-of-the-first-n-terms-of-a-geometric-series"],
  encompasses: [
    { topic: "tree-diagrams-for-independent-events", weight: 0.3 },
    { topic: "the-sum-of-the-first-n-terms-of-a-geometric-series", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSS.MD.A.3"],
  knowledgePoints: [
    {
      id: "geometric-probabilities",
      title: t("Geometric probabilities", "几何分布的概率"),
      explanation: t(
        "Repeat independent trials, each a success with probability $p$, until the first success. The number of trials $X$, counting the successful one, has the **geometric distribution**, $X \\sim \\operatorname{Geo}(p)$. The first success comes on trial $k$ exactly when the first $k - 1$ trials fail and trial $k$ succeeds:\n\n$$P(X = k) = (1 - p)^{k - 1} p, \\qquad k = 1, 2, 3, \\ldots$$\n\nFor $X \\sim \\operatorname{Geo}\\left(\\frac{1}{4}\\right)$: $P(X = 3) = \\left(\\frac{3}{4}\\right)^2 \\cdot \\frac{1}{4} = \\frac{9}{64}$.",
        "重复独立试验，每次成功的概率为 $p$，直到第一次成功为止。试验次数 $X$（包括成功的那一次）服从**几何分布**，$X \\sim \\operatorname{Geo}(p)$。第一次成功恰好出现在第 $k$ 次，当且仅当前 $k - 1$ 次都失败而第 $k$ 次成功：\n\n$$P(X = k) = (1 - p)^{k - 1} p, \\qquad k = 1, 2, 3, \\ldots$$\n\n对 $X \\sim \\operatorname{Geo}\\left(\\frac{1}{4}\\right)$：$P(X = 3) = \\left(\\frac{3}{4}\\right)^2 \\cdot \\frac{1}{4} = \\frac{9}{64}$。",
      ),
      generate(rng) {
        const p = rng.pick(FRACTIONS);
        const q = Q.one.sub(p);
        const k = rng.int(2, 5);
        const ans = q.pow(k - 1).mul(p);
        const line = `P(X = ${k}) = ${pw(q, k - 1)} \\cdot ${p.toLatex()} = ${ans.toLatex()}`;
        return numberProblem({
          prompt: t(
            `$X \\sim \\operatorname{Geo}\\left(${p.toLatex()}\\right)$. Find $P(X = ${k})$.${simplest.en}`,
            `$X \\sim \\operatorname{Geo}\\left(${p.toLatex()}\\right)$。求 $P(X = ${k})$。${simplest["zh-CN"]}`,
          ),
          answer: ans,
          wrong: [q.pow(k).mul(p), p.pow(k - 1).mul(q), q.pow(k - 1)],
          solution: t(
            `The first $${k - 1}$ trials fail and trial $${k}$ succeeds:${steps(line)}`,
            `前 $${k - 1}$ 次失败，第 $${k}$ 次成功：${steps(line)}`,
          ),
        });
      },
    },
    {
      id: "geometric-tail-probabilities",
      keyPrerequisites: ["the-sum-of-the-first-n-terms-of-a-geometric-series"],
      title: t("Tail probabilities", "尾部概率"),
      explanation: t(
        "More than $k$ trials are needed exactly when the first $k$ trials all fail, so\n\n$$P(X > k) = (1 - p)^k, \\qquad P(X \\le k) = 1 - (1 - p)^k.$$\n\nThe second formula is also the sum of the geometric series $p + (1 - p)p + \\cdots + (1 - p)^{k - 1}p$. Mind the endpoints: $P(X \\ge k) = P(X > k - 1) = (1 - p)^{k - 1}$.\n\nFor $X \\sim \\operatorname{Geo}\\left(\\frac{1}{3}\\right)$: $P(X > 2) = \\left(\\frac{2}{3}\\right)^2 = \\frac{4}{9}$ and $P(X \\le 2) = \\frac{5}{9}$.",
        "需要超过 $k$ 次试验，当且仅当前 $k$ 次全部失败，所以\n\n$$P(X > k) = (1 - p)^k, \\qquad P(X \\le k) = 1 - (1 - p)^k.$$\n\n第二个公式也是几何级数 $p + (1 - p)p + \\cdots + (1 - p)^{k - 1}p$ 的和。注意端点：$P(X \\ge k) = P(X > k - 1) = (1 - p)^{k - 1}$。\n\n对 $X \\sim \\operatorname{Geo}\\left(\\frac{1}{3}\\right)$：$P(X > 2) = \\left(\\frac{2}{3}\\right)^2 = \\frac{4}{9}$，$P(X \\le 2) = \\frac{5}{9}$。",
      ),
      generate(rng) {
        const p = rng.pick(FRACTIONS);
        const q = Q.one.sub(p);
        const k = rng.int(2, 5);
        const type = rng.int(0, 3);
        const ops = [">", "\\le", "\\ge", "<"];
        const e = type < 2 ? k : k - 1;
        const tail = q.pow(e);
        const ans = type === 0 || type === 2 ? tail : Q.one.sub(tail);
        const offE = type < 2 ? k - 1 : k;
        const offTail = q.pow(offE);
        const ev = `X ${ops[type]} ${k}`;
        const line =
          type === 0 || type === 2 ? `P(${ev}) = ${pw(q, e)} = ${ans.toLatex()}` : `P(${ev}) = 1 - ${pw(q, e)} = ${ans.toLatex()}`;
        return numberProblem({
          prompt: t(
            `$X \\sim \\operatorname{Geo}\\left(${p.toLatex()}\\right)$. Find $P(${ev})$.${simplest.en}`,
            `$X \\sim \\operatorname{Geo}\\left(${p.toLatex()}\\right)$。求 $P(${ev})$。${simplest["zh-CN"]}`,
          ),
          answer: ans,
          wrong: [Q.one.sub(ans), type === 0 || type === 2 ? offTail : Q.one.sub(offTail), p.pow(e)],
          solution: t(
            `${type === 0 || type === 2 ? `The event means the first $${e}$ trials all fail` : `The complement means the first $${e}$ trials all fail`}:${steps(line)}`,
            `${type === 0 || type === 2 ? `这个事件表示前 $${e}$ 次试验全部失败` : `其对立事件表示前 $${e}$ 次试验全部失败`}：${steps(line)}`,
          ),
        });
      },
    },
    {
      id: "mean-of-a-geometric-distribution",
      title: t("The mean", "均值"),
      explanation: t(
        "If $X \\sim \\operatorname{Geo}(p)$, then\n\n$$E(X) = \\frac{1}{p}, \\qquad \\operatorname{Var}(X) = \\frac{1 - p}{p^2}.$$\n\nWith probability $\\frac{1}{6}$ of success per trial, the first success takes $6$ trials on average. Conversely, if $E(X) = 4$, then $p = \\frac{1}{4}$.",
        "若 $X \\sim \\operatorname{Geo}(p)$，则\n\n$$E(X) = \\frac{1}{p}, \\qquad \\operatorname{Var}(X) = \\frac{1 - p}{p^2}.$$\n\n若每次成功的概率为 $\\frac{1}{6}$，第一次成功平均需要 $6$ 次试验。反过来，若 $E(X) = 4$，则 $p = \\frac{1}{4}$。",
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
            wrong: [e, Q.one.sub(p)],
            solution: t(
              `${steps(`\\frac{1}{p} = ${e.toLatex()}`, `p = ${p.toLatex()}`)}`,
              `${steps(`\\frac{1}{p} = ${e.toLatex()}`, `p = ${p.toLatex()}`)}`,
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
  if (ask === 0) {
    return numberProblem({
      prompt: t(`$${dist}$. Find $E(X)$.${simplest.en}`, `$${dist}$。求 $E(X)$。${simplest["zh-CN"]}`),
      answer: mean,
      wrong: [p, Q.one.div(q), mean.sub(Q.one)],
      solution: t(`${steps(`E(X) = \\frac{1}{p} = ${mean.toLatex()}`)}`, `${steps(`E(X) = \\frac{1}{p} = ${mean.toLatex()}`)}`),
    });
  }
  const line = `\\operatorname{Var}(X) = \\frac{1 - p}{p^2} = \\frac{${q.toLatex()}}{${p.mul(p).toLatex()}} = ${v.toLatex()}`;
  return numberProblem({
    prompt: t(`$${dist}$. Find $\\operatorname{Var}(X)$.${simplest.en}`, `$${dist}$。求 $\\operatorname{Var}(X)$。${simplest["zh-CN"]}`),
    answer: v,
    wrong: [q.div(p), mean, q.mul(p)],
    solution: t(`${steps(line)}`, `${steps(line)}`),
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
  knowledgePoints: [
    {
      id: "first-success-on-a-given-attempt",
      title: t("The first success on a given attempt", "第一次成功出现在某次"),
      explanation: t(
        'When independent attempts with the same probability $p$ of success continue until the first success, the number of attempts is $X \\sim \\operatorname{Geo}(p)$. "The first success is on attempt $k$" is the event $X = k$, with probability $(1 - p)^{k - 1}p$.\n\nRolling a die until a six appears, the probability that the first six is on the third roll is $\\left(\\frac{5}{6}\\right)^2 \\cdot \\frac{1}{6} = \\frac{25}{216}$.',
        "当成功概率都为 $p$ 的独立尝试一直进行到第一次成功时，尝试次数 $X \\sim \\operatorname{Geo}(p)$。“第一次成功出现在第 $k$ 次”就是事件 $X = k$，其概率为 $(1 - p)^{k - 1}p$。\n\n反复掷骰子直到出现六点，第一个六点出现在第三次的概率为 $\\left(\\frac{5}{6}\\right)^2 \\cdot \\frac{1}{6} = \\frac{25}{216}$。",
      ),
      generate(rng) {
        const c = geoContext(rng);
        const p = c.p;
        const q = Q.one.sub(p);
        const k = rng.int(2, 5);
        const ans = q.pow(k - 1).mul(p);
        const pl = c.decimal ? pwd : pw;
        const ask = c.decimal ? asDecimal : simplest;
        const line = `P(X = ${k}) = ${pl(q, k - 1)} \\cdot ${pd(p, c.decimal)} = ${pd(ans, c.decimal)}`;
        return numberProblem({
          prompt: t(`${c.setup.en} Find $P(X = ${k})$.${ask.en}`, `${c.setup["zh-CN"]}求 $P(X = ${k})$。${ask["zh-CN"]}`),
          answer: ans,
          ...(c.decimal && { form: "decimal" as const }),
          wrong: [q.pow(k).mul(p), p.pow(k - 1).mul(q), q.pow(k - 1)],
          solution: t(
            `$X \\sim \\operatorname{Geo}\\left(${pd(p, c.decimal)}\\right)$: the first $${k - 1}$ attempts fail and attempt $${k}$ succeeds.${steps(line)}`,
            `$X \\sim \\operatorname{Geo}\\left(${pd(p, c.decimal)}\\right)$：前 $${k - 1}$ 次失败，第 $${k}$ 次成功。${steps(line)}`,
          ),
        });
      },
    },
    {
      id: "success-within-a-number-of-attempts",
      title: t("Success within a number of attempts", "在若干次之内成功"),
      explanation: t(
        '"Success within $k$ attempts" is $X \\le k$ and "more than $k$ attempts are needed" is $X > k$:\n\n$$P(X > k) = (1 - p)^k, \\qquad P(X \\le k) = 1 - (1 - p)^k.$$\n\nAn archer who hits with probability $0.4$ needs more than $3$ arrows with probability $0.6^3 = 0.216$, and hits within $3$ arrows with probability $1 - 0.216 = 0.784$.',
        "“在 $k$ 次之内成功”是 $X \\le k$，“需要超过 $k$ 次”是 $X > k$：\n\n$$P(X > k) = (1 - p)^k, \\qquad P(X \\le k) = 1 - (1 - p)^k.$$\n\n某弓箭手每箭射中的概率为 $0.4$，他需要超过 $3$ 箭的概率为 $0.6^3 = 0.216$，在 $3$ 箭之内射中的概率为 $1 - 0.216 = 0.784$。",
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
        const ev = within ? `X \\le ${k}` : `X > ${k}`;
        const line = within
          ? `P(X \\le ${k}) = 1 - ${pl(q, k)} = ${pd(ans, c.decimal)}`
          : `P(X > ${k}) = ${pl(q, k)} = ${pd(ans, c.decimal)}`;
        return numberProblem({
          prompt: t(
            `${c.setup.en} Find the probability that ${within ? `the first success comes within the first $${k}$ attempts` : `more than $${k}$ attempts are needed`}.${ask.en}`,
            `${c.setup["zh-CN"]}求${within ? `在前 $${k}$ 次之内第一次成功` : `需要超过 $${k}$ 次`}的概率。${ask["zh-CN"]}`,
          ),
          answer: ans,
          ...(c.decimal && { form: "decimal" as const }),
          wrong: [Q.one.sub(ans), within ? Q.one.sub(q.pow(k - 1)) : q.pow(k - 1), c.p.pow(k)],
          solution: t(
            `The event is $${ev}$, and $X > ${k}$ means the first $${k}$ attempts all fail:${steps(line)}`,
            `所求事件为 $${ev}$，而 $X > ${k}$ 表示前 $${k}$ 次全部失败：${steps(line)}`,
          ),
        });
      },
    },
    {
      id: "expected-attempts-and-required-attempts",
      title: t("Expected and required numbers of attempts", "期望次数与所需次数"),
      explanation: t(
        "The expected number of attempts until the first success is $E(X) = \\frac{1}{p}$.\n\nTo find the least number $n$ of attempts that gives a success with probability at least $c$, solve $1 - (1 - p)^n \\ge c$, that is $(1 - p)^n \\le 1 - c$, and take the smallest whole $n$. For $p = \\frac{1}{2}$ and $c = 0.9$: $\\left(\\frac{1}{2}\\right)^3 = 0.125 > 0.1$ but $\\left(\\frac{1}{2}\\right)^4 = 0.0625 \\le 0.1$, so $n = 4$. Logarithms give the same: $n \\ge \\frac{\\log 0.1}{\\log 0.5} \\approx 3.32$.",
        "直到第一次成功的期望尝试次数为 $E(X) = \\frac{1}{p}$。\n\n要求使成功概率至少为 $c$ 的最少尝试次数 $n$，解 $1 - (1 - p)^n \\ge c$，即 $(1 - p)^n \\le 1 - c$，取最小的整数 $n$。当 $p = \\frac{1}{2}$，$c = 0.9$ 时：$\\left(\\frac{1}{2}\\right)^3 = 0.125 > 0.1$，而 $\\left(\\frac{1}{2}\\right)^4 = 0.0625 \\le 0.1$，所以 $n = 4$。用对数也得到同样结果：$n \\ge \\frac{\\log 0.1}{\\log 0.5} \\approx 3.32$。",
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
            return numberProblem({
              prompt: t(
                `${c.setup.en} What is the least number $n$ of attempts for which the probability of at least one success in $n$ attempts is at least $${pct}\\%$?`,
                `${c.setup["zh-CN"]}要使 $n$ 次尝试中至少成功一次的概率不低于 $${pct}\\%$，$n$ 最少是多少？`,
              ),
              answer: n,
              wrong: [n - 1, n + 1, Math.round(1 / p.toNumber())],
              solution: t(
                `We need $1 - \\left(${qs}\\right)^n \\ge ${dec(Q.of(pct, 100))}$, that is $\\left(${qs}\\right)^n \\le ${dec(target)}$. Check the powers:${steps(...lines)}So $n = ${n}$.`,
                `需要 $1 - \\left(${qs}\\right)^n \\ge ${dec(Q.of(pct, 100))}$，即 $\\left(${qs}\\right)^n \\le ${dec(target)}$。逐个检验幂：${steps(...lines)}所以 $n = ${n}$。`,
              ),
            });
          }
        }
        const mean = Q.one.div(p);
        return numberProblem({
          prompt: t(`${c.setup.en} Find $E(X)$.${simplest.en}`, `${c.setup["zh-CN"]}求 $E(X)$。${simplest["zh-CN"]}`),
          answer: mean,
          wrong: [p, Q.one.div(q), mean.sub(Q.one)],
          solution: t(
            `$X \\sim \\operatorname{Geo}\\left(${pd(p, c.decimal)}\\right)$:${steps(`E(X) = \\frac{1}{p} = \\frac{1}{${pd(p, c.decimal)}} = ${mean.toLatex()}`)}`,
            `$X \\sim \\operatorname{Geo}\\left(${pd(p, c.decimal)}\\right)$：${steps(`E(X) = \\frac{1}{p} = \\frac{1}{${pd(p, c.decimal)}} = ${mean.toLatex()}`)}`,
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
  const uniq = [...new Set(zsList.map(Math.abs))].sort((a, b) => a - b);
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
  knowledgePoints: [
    {
      id: "probabilities-below-and-above-a-value",
      title: t("Probabilities below and above a value", "某值以下与以上的概率"),
      explanation: t(
        "A **continuous** random variable can take any value in an interval, and probabilities are areas under its density curve; the total area is $1$. The **standard normal** variable $Z \\sim N(0, 1)$ has a symmetric bell-shaped curve centered at $0$, with mean $0$ and standard deviation $1$.\n\nIts cumulative distribution function is written $\\Phi(z) = P(Z < z)$, the area to the left of $z$; its values come from a table or a calculator. For a continuous variable, $P(Z = a) = 0$, so $P(Z \\le a) = P(Z < a)$. The area to the right is the complement:\n\n$$P(Z > a) = 1 - \\Phi(a).$$\n\nWith $\\Phi(1) = 0.8413$: $P(Z > 1) = 1 - 0.8413 = 0.1587$.",
        "**连续**随机变量可以取一个区间内的任何值，概率是其密度曲线下的面积，总面积为 $1$。**标准正态**变量 $Z \\sim N(0, 1)$ 的曲线是以 $0$ 为中心的对称钟形，均值为 $0$，标准差为 $1$。\n\n它的累积分布函数记作 $\\Phi(z) = P(Z < z)$，即 $z$ 左侧的面积，其值可查表或用计算器得到。对连续变量，$P(Z = a) = 0$，所以 $P(Z \\le a) = P(Z < a)$。右侧的面积是补集：\n\n$$P(Z > a) = 1 - \\Phi(a).$$\n\n由 $\\Phi(1) = 0.8413$ 得：$P(Z > 1) = 1 - 0.8413 = 0.1587$。",
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
          wrong: [P4(10000 - ans), P4(f - 5000)],
          solution: t(
            `${left ? "$\\Phi$ gives the area to the left" : "The area to the right is the complement of the area to the left"}:${steps(line)}`,
            `${left ? "$\\Phi$ 给出左侧的面积" : "右侧面积是左侧面积的补"}：${steps(line)}`,
          ),
        });
      },
    },
    {
      id: "probabilities-between-two-values",
      title: t("Probabilities between two values", "两值之间的概率"),
      explanation: t(
        "The area between $a$ and $b$ is the area to the left of $b$ minus the area to the left of $a$:\n\n$$P(a < Z < b) = \\Phi(b) - \\Phi(a).$$\n\nSince the curve is symmetric about $0$, $\\Phi(0) = 0.5$, so $P(0 < Z < b) = \\Phi(b) - 0.5$. With $\\Phi(1) = 0.8413$ and $\\Phi(2) = 0.9772$: $P(1 < Z < 2) = 0.9772 - 0.8413 = 0.1359$.",
        "$a$ 与 $b$ 之间的面积等于 $b$ 左侧的面积减去 $a$ 左侧的面积：\n\n$$P(a < Z < b) = \\Phi(b) - \\Phi(a).$$\n\n由于曲线关于 $0$ 对称，$\\Phi(0) = 0.5$，所以 $P(0 < Z < b) = \\Phi(b) - 0.5$。由 $\\Phi(1) = 0.8413$，$\\Phi(2) = 0.9772$ 得：$P(1 < Z < 2) = 0.9772 - 0.8413 = 0.1359$。",
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
        return numberProblem({
          prompt: t(`$Z \\sim N(0, 1)$. Find $P(${ev})$.${g.en}`, `$Z \\sim N(0, 1)$。求 $P(${ev})$。${g["zh-CN"]}`),
          answer: P4(ans),
          form: "decimal",
          wrong: [P4(fb + fa - 10000), P4(10000 - ans), P4(fb)],
          solution: t(`Subtract the areas to the left:${steps(line)}`, `用左侧面积相减：${steps(line)}`),
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
  knowledgePoints: [
    {
      id: "negative-values-of-z",
      title: t("Negative values of z", "z 为负值"),
      explanation: t(
        "Tables give $\\Phi(a)$ only for $a \\ge 0$. The curve is symmetric about $0$, so the area to the left of $-a$ equals the area to the right of $a$:\n\n$$\\Phi(-a) = P(Z < -a) = P(Z > a) = 1 - \\Phi(a), \\qquad P(Z > -a) = \\Phi(a).$$\n\nWith $\\Phi(1.5) = 0.9332$: $P(Z < -1.5) = 0.0668$ and $P(Z > -1.5) = 0.9332$.",
        "表中只给出 $a \\ge 0$ 时的 $\\Phi(a)$。曲线关于 $0$ 对称，所以 $-a$ 左侧的面积等于 $a$ 右侧的面积：\n\n$$\\Phi(-a) = P(Z < -a) = P(Z > a) = 1 - \\Phi(a), \\qquad P(Z > -a) = \\Phi(a).$$\n\n由 $\\Phi(1.5) = 0.9332$ 得：$P(Z < -1.5) = 0.0668$，$P(Z > -1.5) = 0.9332$。",
      ),
      generate(rng) {
        const a = rng.pick(ZS);
        const below = rng.bool();
        const f = phi(a);
        const ans = below ? 10000 - f : f;
        const ev = `Z ${below ? "<" : ">"} -${zs(a)}`;
        const g = given([a]);
        const line = below ? `P(${ev}) = P(Z > ${zs(a)}) = 1 - ${tt(f)} = ${tt(ans)}` : `P(${ev}) = P(Z < ${zs(a)}) = ${tt(f)}`;
        return numberProblem({
          prompt: t(`$Z \\sim N(0, 1)$. Find $P(${ev})$.${g.en}`, `$Z \\sim N(0, 1)$。求 $P(${ev})$。${g["zh-CN"]}`),
          answer: P4(ans),
          form: "decimal",
          wrong: [P4(10000 - ans), P4(f - 5000)],
          solution: t(`By symmetry about $0$:${steps(line)}`, `由关于 $0$ 的对称性：${steps(line)}`),
        });
      },
    },
    {
      id: "symmetric-intervals",
      title: t("Symmetric intervals", "对称区间"),
      explanation: t(
        "The interval from $-a$ to $a$ leaves two equal tails, each $1 - \\Phi(a)$:\n\n$$P(-a < Z < a) = 1 - 2(1 - \\Phi(a)) = 2\\Phi(a) - 1, \\qquad P(|Z| > a) = 2(1 - \\Phi(a)).$$\n\nWith $\\Phi(2) = 0.9772$: $P(-2 < Z < 2) = 0.9544$ and $P(|Z| > 2) = 0.0456$.",
        "从 $-a$ 到 $a$ 的区间两侧留下两个相等的尾部，各为 $1 - \\Phi(a)$：\n\n$$P(-a < Z < a) = 1 - 2(1 - \\Phi(a)) = 2\\Phi(a) - 1, \\qquad P(|Z| > a) = 2(1 - \\Phi(a)).$$\n\n由 $\\Phi(2) = 0.9772$ 得：$P(-2 < Z < 2) = 0.9544$，$P(|Z| > 2) = 0.0456$。",
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
        return numberProblem({
          prompt: t(`$Z \\sim N(0, 1)$. Find $P(${ev})$.${g.en}`, `$Z \\sim N(0, 1)$。求 $P(${ev})$。${g["zh-CN"]}`),
          answer: P4(ans),
          form: "decimal",
          wrong: [P4(10000 - ans), P4(f - 5000), P4(10000 - f)],
          solution: t(
            `${inside ? "Remove the two equal tails" : "Add the two equal tails"}:${steps(line)}`,
            `${inside ? "去掉两个相等的尾部" : "把两个相等的尾部相加"}：${steps(line)}`,
          ),
        });
      },
    },
    {
      id: "intervals-with-negative-endpoints",
      title: t("Intervals with negative endpoints", "端点为负的区间"),
      explanation: t(
        "Write every probability as a difference of values of $\\Phi$ and replace $\\Phi(-a)$ by $1 - \\Phi(a)$:\n\n$$P(-a < Z < b) = \\Phi(b) - (1 - \\Phi(a)) = \\Phi(a) + \\Phi(b) - 1,$$\n\n$$P(-b < Z < -a) = P(a < Z < b) = \\Phi(b) - \\Phi(a).$$\n\nWith $\\Phi(1) = 0.8413$ and $\\Phi(2) = 0.9772$: $P(-1 < Z < 2) = 0.8185$ and $P(-2 < Z < -1) = 0.1359$.",
        "把每个概率写成 $\\Phi$ 的值之差，并把 $\\Phi(-a)$ 换成 $1 - \\Phi(a)$：\n\n$$P(-a < Z < b) = \\Phi(b) - (1 - \\Phi(a)) = \\Phi(a) + \\Phi(b) - 1,$$\n\n$$P(-b < Z < -a) = P(a < Z < b) = \\Phi(b) - \\Phi(a).$$\n\n由 $\\Phi(1) = 0.8413$，$\\Phi(2) = 0.9772$ 得：$P(-1 < Z < 2) = 0.8185$，$P(-2 < Z < -1) = 0.1359$。",
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
        return numberProblem({
          prompt: t(`$Z \\sim N(0, 1)$. Find $P(${ev})$.${g.en}`, `$Z \\sim N(0, 1)$。求 $P(${ev})$。${g["zh-CN"]}`),
          answer: P4(ans),
          form: "decimal",
          wrong: [P4(Math.abs(fb - fa)), P4(20000 - fa - fb), P4(fa + fb - 10000), P4(10000 - ans)],
          solution: t(`Use $\\Phi(-a) = 1 - \\Phi(a)$:${steps(line)}`, `利用 $\\Phi(-a) = 1 - \\Phi(a)$：${steps(line)}`),
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
  encompasses: [{ topic: "symmetry-properties-of-the-standard-normal-distribution", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSS.ID.A.4"],
  knowledgePoints: [
    {
      id: "standardizing-a-value",
      title: t("Standardizing a value", "标准化"),
      explanation: t(
        "A **normal** random variable $X \\sim N(\\mu, \\sigma^2)$ has a bell-shaped curve centered at its mean $\\mu$, with standard deviation $\\sigma$ (the second parameter is the **variance** $\\sigma^2$). Every normal distribution is a shifted and stretched copy of the standard one: the **z-score**\n\n$$z = \\frac{x - \\mu}{\\sigma}$$\n\ncounts how many standard deviations $x$ lies above the mean, and $Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)$. For $X \\sim N(50, 16)$, $\\sigma = 4$ and $x = 44$ has $z = \\frac{44 - 50}{4} = -1.5$.",
        "**正态**随机变量 $X \\sim N(\\mu, \\sigma^2)$ 的曲线是以均值 $\\mu$ 为中心的钟形，标准差为 $\\sigma$（第二个参数是**方差** $\\sigma^2$）。每个正态分布都是标准正态分布平移并伸缩后的结果：**z 分数**\n\n$$z = \\frac{x - \\mu}{\\sigma}$$\n\n表示 $x$ 比均值高出多少个标准差，并且 $Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)$。对 $X \\sim N(50, 16)$，$\\sigma = 4$，$x = 44$ 的 z 分数为 $z = \\frac{44 - 50}{4} = -1.5$。",
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
          wrong: [Q.of(k * sigma, 4 * sigma * sigma), z.neg(), Q.of(x - mu)],
          solution: t(
            `The variance is $${sigma * sigma}$, so $\\sigma = ${sigma}$:${steps(`z = \\frac{${x} - ${mu}}{${sigma}} = \\frac{${x - mu}}{${sigma}} = ${dec(z)}`)}`,
            `方差为 $${sigma * sigma}$，所以 $\\sigma = ${sigma}$：${steps(`z = \\frac{${x} - ${mu}}{${sigma}} = \\frac{${x - mu}}{${sigma}} = ${dec(z)}`)}`,
          ),
        });
      },
    },
    {
      id: "probabilities-for-a-normal-variable",
      title: t("Probabilities below or above a value", "某值以下或以上的概率"),
      explanation: t(
        "To find a probability for $X \\sim N(\\mu, \\sigma^2)$, standardize and use $\\Phi$:\n\n$$P(X < x) = \\Phi\\left(\\frac{x - \\mu}{\\sigma}\\right), \\qquad P(X > x) = 1 - \\Phi\\left(\\frac{x - \\mu}{\\sigma}\\right).$$\n\nFor $X \\sim N(50, 16)$: $P(X < 44) = \\Phi(-1.5) = 1 - \\Phi(1.5) = 1 - 0.9332 = 0.0668$.",
        "求 $X \\sim N(\\mu, \\sigma^2)$ 的概率时，先标准化再用 $\\Phi$：\n\n$$P(X < x) = \\Phi\\left(\\frac{x - \\mu}{\\sigma}\\right), \\qquad P(X > x) = 1 - \\Phi\\left(\\frac{x - \\mu}{\\sigma}\\right).$$\n\n对 $X \\sim N(50, 16)$：$P(X < 44) = \\Phi(-1.5) = 1 - \\Phi(1.5) = 1 - 0.9332 = 0.0668$。",
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
        return numberProblem({
          prompt: t(
            `$${normalNotation(mu, sigma)}$. Find $P(${ev})$.${g.en}`,
            `$${normalNotation(mu, sigma)}$。求 $P(${ev})$。${g["zh-CN"]}`,
          ),
          answer: P4(ans),
          form: "decimal",
          wrong: [P4(10000 - ans), P4(phi(Math.abs(z))), P4(10000 - phi(Math.abs(z)))],
          solution: t(
            `Standardize with $\\sigma = ${sigma}$:${steps(zLine, pLine)}${z < 0 ? `Here $\\Phi(${zs(z)}) = 1 - \\Phi(${zs(-z)}) = ${tt(f)}$.` : ""}`,
            `用 $\\sigma = ${sigma}$ 标准化：${steps(zLine, pLine)}${z < 0 ? `其中 $\\Phi(${zs(z)}) = 1 - \\Phi(${zs(-z)}) = ${tt(f)}$。` : ""}`,
          ),
        });
      },
    },
    {
      id: "probabilities-between-two-values-of-a-normal-variable",
      title: t("Probabilities between two values", "两值之间的概率"),
      explanation: t(
        "Standardize both endpoints and subtract:\n\n$$P(x_1 < X < x_2) = \\Phi(z_2) - \\Phi(z_1), \\qquad z_i = \\frac{x_i - \\mu}{\\sigma}.$$\n\nFor $X \\sim N(50, 16)$: $P(46 < X < 58) = \\Phi(2) - \\Phi(-1) = 0.9772 - (1 - 0.8413) = 0.8185$.",
        "把两个端点都标准化后相减：\n\n$$P(x_1 < X < x_2) = \\Phi(z_2) - \\Phi(z_1), \\qquad z_i = \\frac{x_i - \\mu}{\\sigma}.$$\n\n对 $X \\sim N(50, 16)$：$P(46 < X < 58) = \\Phi(2) - \\Phi(-1) = 0.9772 - (1 - 0.8413) = 0.8185$。",
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
        return numberProblem({
          prompt: t(
            `$${normalNotation(mu, sigma)}$. Find $P(${ev})$.${g.en}`,
            `$${normalNotation(mu, sigma)}$。求 $P(${ev})$。${g["zh-CN"]}`,
          ),
          answer: P4(ans),
          form: "decimal",
          wrong: [P4(Math.abs(a2 - a1)), P4(a1 + a2 - 10000), P4(10000 - ans)],
          solution: t(
            `Standardize both endpoints with $\\sigma = ${sigma}$:${steps(zLine, pLine)}`,
            `用 $\\sigma = ${sigma}$ 把两个端点标准化：${steps(zLine, pLine)}`,
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
  encompasses: [{ topic: "the-normal-distribution", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSS.ID.A.4"],
  knowledgePoints: [
    {
      id: "reading-the-parameters",
      title: t("Reading the parameters", "读出参数"),
      explanation: t(
        "In $X \\sim N(\\mu, \\sigma^2)$ the first parameter is the mean $E(X) = \\mu$ and the second is the variance $\\operatorname{Var}(X) = \\sigma^2$; the standard deviation is its square root $\\sigma$.\n\n$X \\sim N(30, 25)$ has mean $30$, variance $25$ and standard deviation $5$. A normal variable with mean $12$ and standard deviation $3$ is $N(12, 9)$.",
        "在 $X \\sim N(\\mu, \\sigma^2)$ 中，第一个参数是均值 $E(X) = \\mu$，第二个参数是方差 $\\operatorname{Var}(X) = \\sigma^2$；标准差是它的平方根 $\\sigma$。\n\n$X \\sim N(30, 25)$ 的均值为 $30$，方差为 $25$，标准差为 $5$。均值为 $12$、标准差为 $3$ 的正态变量是 $N(12, 9)$。",
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
            wrong: [sigma * sigma, mu, Q.of(sigma * sigma, 2)],
            solution: t(
              `The second parameter is the variance $\\sigma^2 = ${sigma * sigma}$, so $\\sigma = \\sqrt{${sigma * sigma}} = ${sigma}$.`,
              `第二个参数是方差 $\\sigma^2 = ${sigma * sigma}$，所以 $\\sigma = \\sqrt{${sigma * sigma}} = ${sigma}$。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `$X$ is normally distributed with mean $${mu}$ and standard deviation $${sigma}$, so $X \\sim N(${mu}, v)$. Find $v$.`,
            `$X$ 服从均值为 $${mu}$、标准差为 $${sigma}$ 的正态分布，即 $X \\sim N(${mu}, v)$。求 $v$。`,
          ),
          answer: sigma * sigma,
          wrong: [sigma, 2 * sigma, mu],
          solution: t(
            `The second parameter is the variance: $v = \\sigma^2 = ${sigma}^2 = ${sigma * sigma}$.`,
            `第二个参数是方差：$v = \\sigma^2 = ${sigma}^2 = ${sigma * sigma}$。`,
          ),
        });
      },
    },
    {
      id: "finding-the-mean-from-a-probability",
      title: t("Finding the mean from a probability", "由概率求均值"),
      explanation: t(
        "If a probability for $X$ is known, the table gives the z-score of the value, and $x = \\mu + z\\sigma$ is an equation for the unknown parameter.\n\n$X \\sim N(\\mu, 16)$ and $P(X < 30) = 0.8413$. Since $\\Phi(1) = 0.8413$, the z-score of $30$ is $1$:\n\n$$\\frac{30 - \\mu}{4} = 1 \\quad\\Rightarrow\\quad \\mu = 26.$$\n\nA probability below $0.5$ gives a negative z-score: if $P(X < 30) = 0.1587 = 1 - 0.8413$, then $z = -1$ and $\\mu = 34$.",
        "已知 $X$ 的某个概率时，查表可得该值的 z 分数，而 $x = \\mu + z\\sigma$ 就是关于未知参数的方程。\n\n$X \\sim N(\\mu, 16)$，且 $P(X < 30) = 0.8413$。由于 $\\Phi(1) = 0.8413$，$30$ 的 z 分数为 $1$：\n\n$$\\frac{30 - \\mu}{4} = 1 \\quad\\Rightarrow\\quad \\mu = 26.$$\n\n概率小于 $0.5$ 时 z 分数为负：若 $P(X < 30) = 0.1587 = 1 - 0.8413$，则 $z = -1$，$\\mu = 34$。",
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
        return numberProblem({
          prompt: t(
            `$X \\sim N(\\mu, ${sigma * sigma})$ and $P(${ev}) = ${tt(pr)}$. Find $\\mu$.${g.en}`,
            `$X \\sim N(\\mu, ${sigma * sigma})$，且 $P(${ev}) = ${tt(pr)}$。求 $\\mu$。${g["zh-CN"]}`,
          ),
          answer: mu,
          wrong: [x + (z * sigma) / 100, x - (z * sigma * sigma) / 100, mu + 2 * ((z * sigma) / 100)],
          solution: t(
            `The z-score $z$ of $${x}$ satisfies${steps(...zLines)}so $z = ${zs(z)}$. With $\\sigma = ${sigma}$:${steps(`\\frac{${x} - \\mu}{${sigma}} = ${zs(z)}`, `\\mu = ${x} - (${zs(z)})(${sigma}) = ${mu}`)}`,
            `$${x}$ 的 z 分数 $z$ 满足${steps(...zLines)}所以 $z = ${zs(z)}$。由 $\\sigma = ${sigma}$：${steps(`\\frac{${x} - \\mu}{${sigma}} = ${zs(z)}`, `\\mu = ${x} - (${zs(z)})(${sigma}) = ${mu}`)}`,
          ),
        });
      },
    },
    {
      id: "finding-the-standard-deviation-from-a-probability",
      title: t("Finding the standard deviation from a probability", "由概率求标准差"),
      explanation: t(
        "When the mean is known and the standard deviation is not, the same equation $\\frac{x - \\mu}{\\sigma} = z$ gives $\\sigma = \\frac{x - \\mu}{z}$.\n\n$X \\sim N(60, \\sigma^2)$ and $P(X > 70) = 0.0228$. Then $P(X < 70) = 0.9772 = \\Phi(2)$, so\n\n$$\\frac{70 - 60}{\\sigma} = 2 \\quad\\Rightarrow\\quad \\sigma = 5.$$",
        "当均值已知而标准差未知时，同一个方程 $\\frac{x - \\mu}{\\sigma} = z$ 给出 $\\sigma = \\frac{x - \\mu}{z}$。\n\n$X \\sim N(60, \\sigma^2)$，且 $P(X > 70) = 0.0228$。于是 $P(X < 70) = 0.9772 = \\Phi(2)$，所以\n\n$$\\frac{70 - 60}{\\sigma} = 2 \\quad\\Rightarrow\\quad \\sigma = 5.$$",
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
        return numberProblem({
          prompt: t(
            `$X \\sim N(${mu}, \\sigma^2)$ and $P(${ev}) = ${tt(pr)}$. Find $\\sigma$.${g.en}`,
            `$X \\sim N(${mu}, \\sigma^2)$，且 $P(${ev}) = ${tt(pr)}$。求 $\\sigma$。${g["zh-CN"]}`,
          ),
          answer: sigma,
          wrong: [Q.of(d * z, 100), sigma * sigma, Math.abs(d)],
          solution: t(
            `The z-score $z$ of $${x}$ satisfies${steps(...zLines)}so $z = ${zs(z)}$:${steps(`\\frac{${x} - ${mu}}{\\sigma} = ${zs(z)}`, `\\sigma = \\frac{${d}}{${zs(z)}} = ${sigma}`)}`,
            `$${x}$ 的 z 分数 $z$ 满足${steps(...zLines)}所以 $z = ${zs(z)}$：${steps(`\\frac{${x} - ${mu}}{\\sigma} = ${zs(z)}`, `\\sigma = \\frac{${d}}{${zs(z)}} = ${sigma}`)}`,
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
  knowledgePoints: [
    {
      id: "value-with-a-given-probability-below",
      title: t("The value with a given probability below it", "下方概率已知的值"),
      explanation: t(
        "A **percentage point** is a value $a$ with a given probability to one side. If $P(Z < a) = p$, then $\\Phi(a) = p$: look for $p$ among the values of $\\Phi$ and read off $a$.\n\nIf $p < 0.5$, then $a$ is negative and is not in the table: find $1 - p = \\Phi(-a)$ instead. For $P(Z < a) = 0.0668$: $\\Phi(-a) = 0.9332 = \\Phi(1.5)$, so $a = -1.5$.",
        "**百分位点**是一侧概率已知的值 $a$。若 $P(Z < a) = p$，则 $\\Phi(a) = p$：在 $\\Phi$ 的值中找到 $p$，读出 $a$。\n\n若 $p < 0.5$，则 $a$ 为负，不在表中：改为查 $1 - p = \\Phi(-a)$。对 $P(Z < a) = 0.0668$：$\\Phi(-a) = 0.9332 = \\Phi(1.5)$，所以 $a = -1.5$。",
      ),
      generate(rng) {
        return pointProblem(rng, "below");
      },
    },
    {
      id: "value-with-a-given-probability-above",
      title: t("The value with a given probability above it", "上方概率已知的值"),
      explanation: t(
        "If $P(Z > a) = p$, then $\\Phi(a) = 1 - p$. A small upper-tail probability gives a positive $a$; a probability above $0.5$ gives a negative $a$.\n\nFor $P(Z > a) = 0.1151$: $\\Phi(a) = 0.8849 = \\Phi(1.2)$, so $a = 1.2$. For $P(Z > a) = 0.8849$: $\\Phi(-a) = 0.8849$, so $a = -1.2$.",
        "若 $P(Z > a) = p$，则 $\\Phi(a) = 1 - p$。上尾概率较小时 $a$ 为正；概率大于 $0.5$ 时 $a$ 为负。\n\n对 $P(Z > a) = 0.1151$：$\\Phi(a) = 0.8849 = \\Phi(1.2)$，所以 $a = 1.2$。对 $P(Z > a) = 0.8849$：$\\Phi(-a) = 0.8849$，所以 $a = -1.2$。",
      ),
      generate(rng) {
        return pointProblem(rng, "above");
      },
    },
    {
      id: "symmetric-interval-with-a-given-probability",
      title: t("A symmetric interval with a given probability", "概率已知的对称区间"),
      explanation: t(
        "If $P(-a < Z < a) = p$ with $a > 0$, then $2\\Phi(a) - 1 = p$, so\n\n$$\\Phi(a) = \\frac{1 + p}{2}.$$\n\nFor $P(-a < Z < a) = 0.7698$: $\\Phi(a) = \\frac{1.7698}{2} = 0.8849$, so $a = 1.2$.",
        "若 $P(-a < Z < a) = p$，$a > 0$，则 $2\\Phi(a) - 1 = p$，所以\n\n$$\\Phi(a) = \\frac{1 + p}{2}.$$\n\n对 $P(-a < Z < a) = 0.7698$：$\\Phi(a) = \\frac{1.7698}{2} = 0.8849$，所以 $a = 1.2$。",
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
  if (kind === "below") {
    pr = neg ? 10000 - f : f;
    ev = "Z < a";
    line = neg ? `\\Phi(-a) = 1 - ${tt(pr)} = ${tt(f)} = \\Phi(${zs(z)})` : `\\Phi(a) = ${tt(f)} = \\Phi(${zs(z)})`;
  } else if (kind === "above") {
    pr = neg ? f : 10000 - f;
    ev = "Z > a";
    line = neg ? `\\Phi(-a) = P(Z < -a) = P(Z > a) = ${tt(f)} = \\Phi(${zs(z)})` : `\\Phi(a) = 1 - ${tt(pr)} = ${tt(f)} = \\Phi(${zs(z)})`;
  } else {
    pr = 2 * f - 10000;
    ev = "-a < Z < a";
    line = `\\Phi(a) = \\frac{1 + ${tt(pr)}}{2} = ${tt(f)} = \\Phi(${zs(z)})`;
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
    wrong: [Q.of(-a, 100), ...others.map((o) => Q.of(o, 100))],
    solution: t(
      `${steps(line)}So $${neg ? "-a" : "a"} = ${zs(z)}$${neg ? ` and $a = ${zs(a)}$` : ""}.`,
      `${steps(line)}所以 $${neg ? "-a" : "a"} = ${zs(z)}$${neg ? `，$a = ${zs(a)}$` : ""}。`,
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
  knowledgePoints: [
    {
      id: "probabilities-in-context",
      title: t("Probabilities in context", "情境中的概率"),
      explanation: t(
        "To answer a question about a normally distributed quantity, name the variable, write its distribution, standardize and use $\\Phi$.\n\nIf heights are $N(165, 6^2)$ in centimeters, the probability that a randomly chosen person is taller than $174$ cm is\n\n$$P(X > 174) = P\\left(Z > \\frac{174 - 165}{6}\\right) = 1 - \\Phi(1.5) = 1 - 0.9332 = 0.0668.$$",
        "回答关于正态分布量的问题时，先设出变量、写出其分布，再标准化并使用 $\\Phi$。\n\n若身高（厘米）服从 $N(165, 6^2)$，随机选取一人身高超过 $174$ 厘米的概率为\n\n$$P(X > 174) = P\\left(Z > \\frac{174 - 165}{6}\\right) = 1 - \\Phi(1.5) = 1 - 0.9332 = 0.0668.$$",
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
        const lines =
          type === 2
            ? [`P(${x1} < X < ${x2}) = \\Phi(${zs(z2)}) - \\Phi(${zs(z1)}) = ${tt(phi(z2))} - ${tt(phi(z1))} = ${tt(ans)}`]
            : [
                `z = \\frac{${x1} - ${mu}}{${sigma}} = ${zs(z1)}`,
                type === 0
                  ? `P(X < ${x1}) = \\Phi(${zs(z1)}) = ${tt(ans)}`
                  : `P(X > ${x1}) = 1 - \\Phi(${zs(z1)}) = 1 - ${tt(phi(z1))} = ${tt(ans)}`,
              ];
        return numberProblem({
          prompt: t(
            `${intro.en} Find the probability that a randomly chosen ${c.item[0]} has a ${c.measure[0]} ${whatEn}.${g.en}`,
            `${intro["zh-CN"]}求随机选取的一个${c.item[2]}的${c.measure[1]}${whatZh}的概率。${g["zh-CN"]}`,
          ),
          answer: P4(ans),
          form: "decimal",
          wrong: [P4(10000 - ans), P4(phi(Math.abs(z1))), P4(10000 - phi(Math.abs(z1)))],
          solution: t(
            `Let $X$ be the ${c.measure[0]}, $X \\sim N(${mu}, ${sigma}^2)$. Standardize:${steps(...lines)}`,
            `设 $X$ 为${c.measure[1]}，$X \\sim N(${mu}, ${sigma}^2)$。标准化：${steps(...lines)}`,
          ),
        });
      },
    },
    {
      id: "expected-numbers-in-context",
      title: t("Expected numbers in context", "情境中的期望数量"),
      explanation: t(
        "If each of $N$ individuals independently lies in a range with probability $p$, the expected number in that range is $Np$.\n\nWith heights $N(165, 6^2)$ and $P(X > 174) = 0.0668$, among $10\\,000$ people about $10\\,000 \\cdot 0.0668 = 668$ are expected to be taller than $174$ cm.",
        "若 $N$ 个个体中每个都以概率 $p$ 独立地落在某范围内，则落在该范围内的期望数量为 $Np$。\n\n若身高服从 $N(165, 6^2)$ 且 $P(X > 174) = 0.0668$，则 $10\\,000$ 人中期望约有 $10\\,000 \\cdot 0.0668 = 668$ 人身高超过 $174$ 厘米。",
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
        return numberProblem({
          prompt: t(
            `${intro.en} In a group of $${nL}$ ${c.item[1]}, how many are expected to have a ${c.measure[0]} ${above ? "more" : "less"} than $${x}$ ${c.unit[0]}?${g.en}`,
            `${intro["zh-CN"]}在 $${nL}$ 个${c.item[2]}中，期望有多少个的${c.measure[1]}${above ? "大于" : "小于"} $${x}$ ${c.unit[1]}？${g["zh-CN"]}`,
          ),
          answer: ans,
          wrong: [(10000 - pr) * m, pr, phi(Math.abs(z)) * m],
          solution: t(
            `With $z = \\frac{${x} - ${mu}}{${sigma}} = ${zs(z)}$:${steps(pLine, `${n} \\cdot ${tt(pr)} = ${ans}`)}`,
            `由 $z = \\frac{${x} - ${mu}}{${sigma}} = ${zs(z)}$：${steps(pLine, `${n} \\cdot ${tt(pr)} = ${ans}`)}`,
          ),
        });
      },
    },
    {
      id: "cutoff-values-in-context",
      title: t("Cutoff values in context", "情境中的分界值"),
      explanation: t(
        "To find the value that cuts off a given top or bottom percentage, find the z-score from the table and convert back: $x = \\mu + z\\sigma$.\n\nExam scores are $N(70, 10^2)$, and the top $6.68\\%$ get an award. The cutoff $x$ has $P(X > x) = 0.0668$, so $\\Phi(z) = 0.9332$, $z = 1.5$ and $x = 70 + 1.5 \\cdot 10 = 85$. For a bottom percentage the z-score is negative.",
        "求截出给定最高或最低百分比的值时，先由表求 z 分数，再换算回去：$x = \\mu + z\\sigma$。\n\n考试成绩服从 $N(70, 10^2)$，成绩最高的 $6.68\\%$ 获奖。分界值 $x$ 满足 $P(X > x) = 0.0668$，所以 $\\Phi(z) = 0.9332$，$z = 1.5$，$x = 70 + 1.5 \\cdot 10 = 85$。对最低百分比，z 分数为负。",
      ),
      generate(rng) {
        const { c, mu, sigma, intro } = normalSetup(rng);
        const z = rng.pick(ZS);
        const top = rng.bool();
        const pct = dec(Q.of(10000 - phi(z), 100));
        const x = xAt(mu, sigma, top ? z : -z);
        const g = given([z]);
        const zSigned = top ? zs(z) : `-${zs(z)}`;
        return numberProblem({
          prompt: t(
            `${intro.en} The ${top ? "top" : "bottom"} $${pct}\\%$ of ${c.item[1]} by ${c.measure[0]} are to be identified. Find the cutoff value, in ${c.unit[0]}.${g.en}`,
            `${intro["zh-CN"]}要找出${c.measure[1]}${top ? "最高" : "最低"}的 $${pct}\\%$ 的${c.item[2]}。求分界值（单位：${c.unit[1]}）。${g["zh-CN"]}`,
          ),
          answer: x,
          form: "decimal",
          wrong: [
            xAt(mu, sigma, top ? -z : z),
            xAt(mu, sigma * sigma, top ? z : -z),
            Q.of(mu * 100 + (top ? 1 : -1) * (10000 - phi(z)), 100),
          ],
          solution: t(
            `The ${top ? "upper" : "lower"} tail has probability $${tt(10000 - phi(z))}$, so $\\Phi(${zs(z)}) = ${tt(phi(z))}$ gives $z = ${zSigned}$:${steps(`x = ${mu} + (${zSigned})(${sigma}) = ${dec(x)}`)}`,
            `${top ? "上" : "下"}尾概率为 $${tt(10000 - phi(z))}$，由 $\\Phi(${zs(z)}) = ${tt(phi(z))}$ 得 $z = ${zSigned}$：${steps(`x = ${mu} + (${zSigned})(${sigma}) = ${dec(x)}`)}`,
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
  knowledgePoints: [
    {
      id: "percentages-from-the-empirical-rule",
      title: t("Percentages from the empirical rule", "由经验法则求百分比"),
      explanation: t(
        "For any normal distribution, approximately\n\n- $68\\%$ of values lie within $1$ standard deviation of the mean, between $\\mu - \\sigma$ and $\\mu + \\sigma$;\n- $95\\%$ lie within $2$ standard deviations;\n- $99.7\\%$ lie within $3$ standard deviations.\n\nBy symmetry this splits into pieces: $34\\%$ between $\\mu$ and $\\mu + \\sigma$, $13.5\\%$ between $\\mu + \\sigma$ and $\\mu + 2\\sigma$, $2.35\\%$ between $\\mu + 2\\sigma$ and $\\mu + 3\\sigma$, and $0.15\\%$ beyond $\\mu + 3\\sigma$, and the same on the left. For $N(100, 15^2)$, the percentage between $85$ and $130$ is $34 + 34 + 13.5 = 81.5\\%$.",
        "对任何正态分布，大约有\n\n- $68\\%$ 的数据落在均值的 $1$ 个标准差之内，即 $\\mu - \\sigma$ 与 $\\mu + \\sigma$ 之间；\n- $95\\%$ 落在 $2$ 个标准差之内；\n- $99.7\\%$ 落在 $3$ 个标准差之内。\n\n由对称性可以分成若干块：$\\mu$ 与 $\\mu + \\sigma$ 之间占 $34\\%$，$\\mu + \\sigma$ 与 $\\mu + 2\\sigma$ 之间占 $13.5\\%$，$\\mu + 2\\sigma$ 与 $\\mu + 3\\sigma$ 之间占 $2.35\\%$，超过 $\\mu + 3\\sigma$ 的占 $0.15\\%$，左侧对称。对 $N(100, 15^2)$，$85$ 与 $130$ 之间的百分比为 $34 + 34 + 13.5 = 81.5\\%$。",
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
        return numberProblem({
          prompt: t(
            `The values of $X$ are normally distributed with mean $${mu}$ and standard deviation $${sigma}$. Use the empirical rule to find the percentage of values ${evEn}.`,
            `$X$ 的值服从均值为 $${mu}$、标准差为 $${sigma}$ 的正态分布。用经验法则求${evZh}的数据所占的百分比。`,
          ),
          answer: pct,
          form: "decimal",
          percent: true,
          wrong: [Q.of(10000 - ans, 100), Q.of(Math.min(b, 3) - Math.max(a, -3), 1).mul(Q.of(34)), Q.of(ans, 200)],
          solution: t(
            `${type === 0 ? `The values are $${kL(a)}$ and $${kL(b)}$` : type === 1 ? `The value is $${kL(b)}$` : `The value is $${kL(a)}$`}. Add up the pieces of the empirical rule in that range: the percentage is $${dec(pct)}\\%$.`,
            `${type === 0 ? `这两个值是 $${kL(a)}$ 与 $${kL(b)}$` : type === 1 ? `这个值是 $${kL(b)}$` : `这个值是 $${kL(a)}$`}。把经验法则中落在该范围内的各块相加：百分比为 $${dec(pct)}\\%$。`,
          ),
        });
      },
    },
    {
      id: "counts-from-the-empirical-rule",
      title: t("Counts from the empirical rule", "由经验法则求数量"),
      explanation: t(
        "Multiply the percentage from the empirical rule by the size of the group. If $2000$ bags of flour have masses $N(1000, 5^2)$ in grams, about $2.5\\%$ weigh less than $990$ g (two standard deviations below the mean): $2000 \\cdot 0.025 = 50$ bags.",
        "把经验法则得到的百分比乘以总数。若 $2000$ 袋面粉的质量（克）服从 $N(1000, 5^2)$，约有 $2.5\\%$ 轻于 $990$ 克（比均值低两个标准差）：$2000 \\cdot 0.025 = 50$ 袋。",
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
        return numberProblem({
          prompt: t(
            `The ${ctx.en[3]} of $${n}$ ${ctx.en[0]} are normally distributed with mean $${mu}$ ${ctx.en[2]} and standard deviation $${sigma}$ ${ctx.en[2]}. Use the empirical rule to estimate how many have a ${ctx.en[1]} ${evEn} ${ctx.en[2]}.`,
            `$${n}$ ${ctx.zh[0]}的${ctx.zh[1]}服从均值为 $${mu}$ ${ctx.zh[2]}、标准差为 $${sigma}$ ${ctx.zh[2]}的正态分布。用经验法则估计${ctx.zh[1]}${evZh}的有多少。`,
          ),
          answer: ans,
          wrong: [n - ans, Q.of(pct, 100), Q.of(n * pct, 100)],
          solution: t(
            `By the empirical rule, $${dec(Q.of(pct, 100))}\\%$ of the values lie in this range:${steps(`${n} \\cdot ${dec(Q.of(pct, 10000))} = ${ans}`)}`,
            `由经验法则，有 $${dec(Q.of(pct, 100))}\\%$ 的数据落在这个范围内：${steps(`${n} \\cdot ${dec(Q.of(pct, 10000))} = ${ans}`)}`,
          ),
        });
      },
    },
    {
      id: "values-from-the-empirical-rule",
      title: t("Values from the empirical rule", "由经验法则求数值"),
      explanation: t(
        "Read the empirical rule backwards: from a percentage below or above a value, find how many standard deviations the value is from the mean. The percentages below $\\mu + k\\sigma$ are\n\n| $k$ | $-3$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ |\n| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| below | $0.15\\%$ | $2.5\\%$ | $16\\%$ | $50\\%$ | $84\\%$ | $97.5\\%$ | $99.85\\%$ |\n\nFor $N(100, 15^2)$, about $2.5\\%$ of values lie above $\\mu + 2\\sigma = 130$.",
        "反过来使用经验法则：由某值以下或以上的百分比，求这个值离均值有几个标准差。低于 $\\mu + k\\sigma$ 的百分比为\n\n| $k$ | $-3$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ |\n| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| 以下 | $0.15\\%$ | $2.5\\%$ | $16\\%$ | $50\\%$ | $84\\%$ | $97.5\\%$ | $99.85\\%$ |\n\n对 $N(100, 15^2)$，约有 $2.5\\%$ 的数据大于 $\\mu + 2\\sigma = 130$。",
      ),
      generate(rng) {
        const mu = rng.int(4, 40) * 5;
        const sigma = rng.int(2, 12);
        const k = rng.pick([-3, -2, -1, 1, 2, 3]);
        const above = rng.bool();
        const pct = above ? 10000 - belowPct(k) : belowPct(k);
        const pl = dec(Q.of(pct, 100));
        const x = mu + k * sigma;
        return numberProblem({
          prompt: t(
            `The values of $X$ are normally distributed with mean $${mu}$ and standard deviation $${sigma}$. Use the empirical rule to find the value that about $${pl}\\%$ of the values lie ${above ? "above" : "below"}.`,
            `$X$ 的值服从均值为 $${mu}$、标准差为 $${sigma}$ 的正态分布。用经验法则求一个值，使约有 $${pl}\\%$ 的数据${above ? "大于" : "小于"}它。`,
          ),
          answer: x,
          wrong: [mu - k * sigma, mu + (k > 0 ? k - 1 : k + 1) * sigma, mu + k],
          solution: t(
            `About $${pl}\\%$ of the values lie ${above ? "above" : "below"} $\\mu ${k > 0 ? "+" : "-"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}\\sigma$:${steps(`${mu} ${k > 0 ? "+" : "-"} ${Math.abs(k)} \\cdot ${sigma} = ${x}`)}`,
            `约有 $${pl}\\%$ 的数据${above ? "大于" : "小于"} $\\mu ${k > 0 ? "+" : "-"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}\\sigma$：${steps(`${mu} ${k > 0 ? "+" : "-"} ${Math.abs(k)} \\cdot ${sigma} = ${x}`)}`,
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
