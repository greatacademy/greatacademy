import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Coefficient, linear, num, paren, poly, Q } from "@ga/subject-math";

import { choiceProblem, type ExpressionProblem, expressionProblem, numberProblem, steps, yesNo } from "../problems.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** plus writes a constant added to a term: " + 3", " - 3", or "" for 0. */
function plus(c: Coefficient): string {
  const v = toQ(c);
  if (v.isZero()) return "";
  return v.sign() < 0 ? ` - ${v.neg().toLatex()}` : ` + ${v.toLatex()}`;
}

/** ordinal writes an English ordinal: "1st", "22nd", "13th". */
function ordinal(k: number): string {
  const teen = k % 100 >= 11 && k % 100 <= 13;
  const suffix = teen ? "th" : (({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[k % 10] ?? "th");
  return `${k}${suffix}`;
}

/** maxIndex is the largest k with |r|^(k-1) at most limit. */
function maxIndex(r: number, limit: number): number {
  let k = 1;
  while (Math.abs(r) ** k <= limit) k++;
  return k;
}

/** list writes the first terms of a sequence: "3, 7, 11, \ldots". */
const list = (terms: readonly Coefficient[]) => `${terms.map(num).join(", ")}, \\ldots`;

/** arithmetic is the first count terms of the arithmetic sequence with first term a1 and common difference d. */
const arithmetic = (a1: number, d: number, count: number) => Array.from({ length: count }, (_, i) => a1 + i * d);

/** geometric is the first count terms of the geometric sequence with first term a1 and common ratio r. */
const geometric = (a1: Q, r: Q, count: number) => Array.from({ length: count }, (_, i) => a1.mul(r.pow(i)));

/** base writes a ratio as the base of a power, in parentheses when it is negative or a fraction. */
const base = (r: Q) => (r.sign() < 0 || !r.isInteger() ? `\\left(${r.toLatex()}\\right)` : r.toLatex());

/** exponent writes n - 1, n or n + 1. */
const exponent = (shift: number) => `n${plus(shift)}`;

/** times writes c times a power: "3 \cdot 2^{n-1}", "2^{n}", "-\left(\frac{1}{2}\right)^{n}". */
function times(c: Q, power: string): string {
  if (c.eq(Q.one)) return power;
  if (c.eq(Q.one.neg())) return `-${power}`;
  return `${c.toLatex()} \\cdot ${power}`;
}

/** Formula is a formula for a sequence, with its first terms, so that formulas defining the same sequence can be told apart. */
interface Formula {
  readonly latex: string;
  readonly terms: readonly Q[];
}

const formulaLength = 6;

/** explicitFormula is "a_n = …" for the sequence f(1), f(2), …. */
function explicitFormula(expr: string, f: (n: number) => Q): Formula {
  return { latex: `a_n = ${expr}`, terms: Array.from({ length: formulaLength }, (_, i) => f(i + 1)) };
}

/** recursiveFormula is "a_1 = …, a_n = …" for the sequence starting at a1 whose terms follow step. */
function recursiveFormula(a1: Q, rule: string, step: (prev: Q) => Q): Formula {
  const terms = [a1];
  for (let i = 1; i < formulaLength; i++) terms.push(step(terms[i - 1]!));
  return { latex: `a_1 = ${a1.toLatex()},\\; a_n = ${rule}`, terms };
}

/** arithmeticExplicit is a_n = dn + (a1 - d). */
const arithmeticExplicit = (a1: Q, d: Q) => explicitFormula(poly([d, "n"], [a1.sub(d), ""]), (n) => a1.add(d.mul(Q.of(n - 1))));

/** arithmeticRecursive is a_1 = a1, a_n = a_{n-1} + d. */
const arithmeticRecursive = (a1: Q, d: Q) => recursiveFormula(a1, poly([1, "a_{n-1}"], [d, ""]), (p) => p.add(d));

/** geometricExplicit is a_n = c · r^{n + shift}. */
const geometricExplicit = (c: Q, r: Q, shift: number) =>
  explicitFormula(times(c, `${base(r)}^{${exponent(shift)}}`), (n) => c.mul(r.pow(n + shift)));

/** geometricRecursive is a_1 = a1, a_n = r a_{n-1}. */
const geometricRecursive = (a1: Q, r: Q) => recursiveFormula(a1, poly([r, "a_{n-1}"]), (p) => p.mul(r));

const sameTerms = (a: Formula, b: Formula) => a.terms.every((x, i) => x.eq(b.terms[i]!));

/** formulaChoice asks to pick the correct formula among at most three distractors that define other sequences. */
function formulaChoice(rng: Rng, prompt: Text, correct: Formula, distractors: readonly Formula[], solution: Text): Problem {
  const kept: Formula[] = [correct];
  for (const f of rng.shuffle(distractors)) {
    if (kept.length < 4 && !kept.some((k) => sameTerms(k, f))) kept.push(f);
  }
  const options = rng.shuffle(kept);
  return choiceProblem({ prompt, options: options.map((f) => same(`$${f.latex}$`)), correct: options.indexOf(correct), solution });
}

/** formulaProblem is an expressionProblem whose answer field is preceded by "a_n =". */
function formulaProblem(p: ExpressionProblem): Problem {
  const problem = expressionProblem(p);
  return { ...problem, answer: { ...problem.answer, input: { kind: "math", prefix: "a_n =" } } };
}

/** ratios are common ratios with their denominators, for geometric sequences of integers. */
const ratios: readonly Q[] = [2, 3, -2, -3, 4, -1].map((r) => Q.of(r)).concat([Q.of(1, 2), Q.of(-1, 2), Q.of(1, 3), Q.of(3, 2)]);

/** geometricStart draws a first term that keeps the first count terms of the sequence with ratio r integers. */
function geometricStart(rng: Rng, r: Q, count: number, max = 5): Q {
  return Q.of(rng.sign() * rng.int(1, max) * Number(r.d) ** (count - 1));
}

export const introductionToSequences: TopicDef = {
  id: "introduction-to-sequences",
  title: t("Introduction to Sequences", "数列入门"),
  summary: t(
    "Read the terms of a sequence in index notation and compute terms from an explicit formula.",
    "用下标记号读出数列的项，并由通项公式计算各项。",
  ),
  prerequisites: ["evaluating-expressions"],
  encompasses: [{ topic: "evaluating-expressions", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSF.IF.A.3"],
  knowledgePoints: [
    {
      id: "terms-and-index-notation",
      title: t("Terms and index notation", "项与下标记号"),
      explanation: t(
        "A **sequence** is an ordered list of numbers, called its **terms**. We write $a_1$ for the first term, $a_2$ for the second, and in general $a_n$ for the $n$th term; the number $n$ is the **index** of the term. In the sequence\n\n$$5, 8, 13, 20, 29, \\ldots$$\n\n$a_1 = 5$, $a_2 = 8$ and $a_4 = 20$. The three dots mean that the sequence continues. Count from $1$: the index tells the position of a term, not its value.",
        "**数列**是按顺序排列的一列数，其中每个数叫做**项**。第一项记作 $a_1$，第二项记作 $a_2$，一般地，第 $n$ 项记作 $a_n$，其中 $n$ 叫做这一项的**下标**（序号）。在数列\n\n$$5, 8, 13, 20, 29, \\ldots$$\n\n中，$a_1 = 5$，$a_2 = 8$，$a_4 = 20$。省略号表示数列还在继续。从 $1$ 开始数：下标表示项的位置，而不是项的值。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const p = rng.nonZero(-9, 9);
        const c = rng.int(-10, 10);
        const terms =
          kind === 0
            ? Array.from({ length: 7 }, (_, i) => p * (i + 1) + c)
            : kind === 1
              ? Array.from({ length: 7 }, (_, i) => (i + 1) ** 2 + c)
              : rng.sample(
                  Array.from({ length: 61 }, (_, i) => i - 30),
                  7,
                );
        const k = rng.int(2, 6);
        const value = terms[k - 1]!;
        return numberProblem({
          prompt: t(
            `A sequence begins $${list(terms.slice(0, 6))}$. What is $a_{${k}}$?`,
            `一个数列的前几项是 $${list(terms.slice(0, 6))}$。求 $a_{${k}}$。`,
          ),
          answer: value,
          wrong: [terms[k]!, terms[k - 2]!],
          solution: t(
            `$a_{${k}}$ is term number $${k}$, counting from $a_1 = ${num(terms[0]!)}$: $a_{${k}} = ${num(value)}$.`,
            `$a_{${k}}$ 是从 $a_1 = ${num(terms[0]!)}$ 开始数的第 $${k}$ 项：$a_{${k}} = ${num(value)}$。`,
          ),
        });
      },
    },
    {
      id: "explicit-formulas",
      title: t("Explicit formulas", "通项公式"),
      explanation: t(
        "An **explicit formula** gives each term directly from its index. To find a term, substitute its index for $n$. For $a_n = 2n^{2} - 3$:\n\n$$a_5 = 2 \\cdot 5^{2} - 3 = 2 \\cdot 25 - 3 = 47.$$\n\nFollow the order of operations: square first, then multiply.",
        "**通项公式**直接由下标给出每一项。求某一项时，把它的下标代入 $n$。对于 $a_n = 2n^{2} - 3$：\n\n$$a_5 = 2 \\cdot 5^{2} - 3 = 2 \\cdot 25 - 3 = 47.$$\n\n按运算顺序计算：先平方，再相乘。",
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const kind = rng.int(0, 2);
        const p = rng.nonZero(-9, 9);
        const c = rng.nonZero(-12, 12);
        const k = rng.int(2, 12);
        const [expr, f, sub, alt] =
          kind === 0
            ? [poly([p, "n"], [c, ""]), (n: number) => p * n + c, `${num(p)} \\cdot ${k}${plus(c)}`, p + k + c]
            : kind === 1
              ? [poly([p, "n^{2}"], [c, ""]), (n: number) => p * n * n + c, `${num(p)} \\cdot ${k}^{2}${plus(c)}`, (p * k) ** 2 + c]
              : [poly([1, "n^{2}"], [p, "n"]), (n: number) => n * n + p * n, `${k}^{2}${plus(p)} \\cdot ${k}`, 2 * k + p * k];
        const value = f(k);
        return numberProblem({
          prompt: t(`Given $a_n = ${expr}$, find $a_{${k}}$.`, `已知 $a_n = ${expr}$，求 $a_{${k}}$。`),
          answer: value,
          wrong: [f(k - 1), f(k + 1), alt],
          solution: t(
            `Substitute $n = ${k}$: ${steps(`a_{${k}} = ${sub} = ${num(value)}`)}`,
            `代入 $n = ${k}$：${steps(`a_{${k}} = ${sub} = ${num(value)}`)}`,
          ),
        });
      },
    },
    {
      id: "powers-and-fractions-in-formulas",
      title: t("Formulas with powers and fractions", "含乘方与分数的公式"),
      explanation: t(
        "The index can appear in an exponent or in a fraction. Substitute in the same way:\n\n$$a_n = 3^{n} - 4: \\quad a_4 = 3^{4} - 4 = 77, \\qquad a_n = \\frac{n}{n + 2}: \\quad a_3 = \\frac{3}{5}.$$\n\nA factor $(-1)^{n}$ makes the terms alternate in sign: it is $-1$ when $n$ is odd and $1$ when $n$ is even.",
        "下标也可以出现在指数或分数中，同样代入即可：\n\n$$a_n = 3^{n} - 4: \\quad a_4 = 3^{4} - 4 = 77, \\qquad a_n = \\frac{n}{n + 2}: \\quad a_3 = \\frac{3}{5}.$$\n\n因子 $(-1)^{n}$ 使各项正负交替：$n$ 为奇数时它等于 $-1$，$n$ 为偶数时等于 $1$。",
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const b = rng.pick([2, 3]);
          const c = rng.nonZero(-20, 20);
          const k = rng.int(2, b === 2 ? 9 : 6);
          const value = b ** k + c;
          return numberProblem({
            prompt: t(`Given $a_n = ${b}^{n}${plus(c)}$, find $a_{${k}}$.`, `已知 $a_n = ${b}^{n}${plus(c)}$，求 $a_{${k}}$。`),
            answer: value,
            wrong: [b * k + c, b ** (k - 1) + c],
            solution: t(
              `Substitute $n = ${k}$: ${steps(`a_{${k}} = ${b}^{${k}}${plus(c)} = ${b ** k}${plus(c)} = ${value}`)}`,
              `代入 $n = ${k}$：${steps(`a_{${k}} = ${b}^{${k}}${plus(c)} = ${b ** k}${plus(c)} = ${value}`)}`,
            ),
          });
        }
        if (kind === 1) {
          const m = rng.int(1, 6);
          const c = rng.nonZero(-6, 6);
          const k = rng.int(1, 12);
          const inner = m * k + c;
          const sign = k % 2 === 0 ? 1 : -1;
          const value = sign * inner;
          const expr = `(-1)^{n}(${linear(m, c, "n")})`;
          return numberProblem({
            prompt: t(`Given $a_n = ${expr}$, find $a_{${k}}$.`, `已知 $a_n = ${expr}$，求 $a_{${k}}$。`),
            answer: value,
            wrong: [-value, sign * m * k + c],
            solution: t(
              `Substitute $n = ${k}$. Since $${k}$ is ${k % 2 === 0 ? "even" : "odd"}, $(-1)^{${k}} = ${sign}$: ${steps(`a_{${k}} = ${paren(sign)} \\cdot ${paren(inner)} = ${value}`)}`,
              `代入 $n = ${k}$。因为 $${k}$ 是${k % 2 === 0 ? "偶数" : "奇数"}，$(-1)^{${k}} = ${sign}$：${steps(`a_{${k}} = ${paren(sign)} \\cdot ${paren(inner)} = ${value}`)}`,
            ),
          });
        }
        const c = rng.int(1, 5);
        const m = rng.pick([1, 2, 3]);
        const k = rng.int(1, 12);
        const value = Q.of(m * k, k + c);
        const expr = `\\frac{${m === 1 ? "" : m}n}{n + ${c}}`;
        return numberProblem({
          prompt: t(`Given $a_n = ${expr}$, find $a_{${k}}$.`, `已知 $a_n = ${expr}$，求 $a_{${k}}$。`),
          answer: value,
          wrong: [Q.of(m * (k + 1), k + 1 + c), Q.of(m * k, k * c)],
          solution: t(
            `Substitute $n = ${k}$ and simplify: ${steps(`a_{${k}} = \\frac{${m === 1 ? "" : `${m} \\cdot `}${k}}{${k} + ${c}} = ${value.toLatex()}`)}`,
            `代入 $n = ${k}$ 并化简：${steps(`a_{${k}} = \\frac{${m === 1 ? "" : `${m} \\cdot `}${k}}{${k} + ${c}} = ${value.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
};

/** iterate is the first count terms of the sequence starting at a1 with a_n = rule(a_{n-1}, n). */
function iterate(a1: number, count: number, rule: (prev: number, n: number) => number): number[] {
  const terms = [a1];
  for (let n = 2; n <= count; n++) terms.push(rule(terms[n - 2]!, n));
  return terms;
}

/** chain writes the computed terms a_2 = …, a_3 = …, up to a_k. */
const chain = (terms: readonly number[], k: number, sub: (n: number) => string) =>
  steps(...Array.from({ length: k - 1 }, (_, i) => `a_{${i + 2}} = ${sub(i + 2)} = ${num(terms[i + 1]!)}`));

export const recursiveSequences: TopicDef = {
  id: "recursive-sequences",
  title: t("Recursive Sequences", "递推数列"),
  summary: t("Compute terms of a sequence defined by a recursive formula, forward and backward.", "由递推公式向前、向后计算数列的项。"),
  prerequisites: ["introduction-to-sequences", "one-step-equations-multiplication"],
  encompasses: [
    { topic: "introduction-to-sequences", weight: 0.3 },
    { topic: "one-step-equations-multiplication", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.IF.A.3"],
  knowledgePoints: [
    {
      id: "applying-a-recursive-rule",
      title: t("Applying a recursive rule", "应用递推公式"),
      explanation: t(
        "A **recursive formula** gives the first term and a rule that computes each term from the one before it. In\n\n$$a_1 = 4, \\qquad a_n = 2a_{n-1} - 3,$$\n\n$a_{n-1}$ is the term just before $a_n$. Apply the rule one term at a time:\n\n$$a_2 = 2 \\cdot 4 - 3 = 5, \\quad a_3 = 2 \\cdot 5 - 3 = 7, \\quad a_4 = 2 \\cdot 7 - 3 = 11.$$",
        "**递推公式**给出第一项，以及由前一项计算每一项的规则。在\n\n$$a_1 = 4, \\qquad a_n = 2a_{n-1} - 3$$\n\n中，$a_{n-1}$ 是紧接在 $a_n$ 之前的一项。逐项应用规则：\n\n$$a_2 = 2 \\cdot 4 - 3 = 5, \\quad a_3 = 2 \\cdot 5 - 3 = 7, \\quad a_4 = 2 \\cdot 7 - 3 = 11.$$",
      ),
      generate(rng) {
        const p = rng.pick([1, 1, 2, 3, -1, -2]);
        const q = rng.nonZero(-9, 9);
        const a1 = rng.int(-9, 9);
        const k = rng.int(3, 5);
        const terms = iterate(a1, k + 1, (x) => p * x + q);
        const swapped = iterate(a1, k, (x) => p * (x + q));
        const rule = poly([p, "a_{n-1}"], [q, ""]);
        return numberProblem({
          prompt: t(
            `A sequence is defined by $a_1 = ${a1}$ and $a_n = ${rule}$. Find $a_{${k}}$.`,
            `数列由 $a_1 = ${a1}$ 和 $a_n = ${rule}$ 定义。求 $a_{${k}}$。`,
          ),
          answer: terms[k - 1]!,
          wrong: [terms[k - 2]!, terms[k]!, swapped[k - 1]!],
          solution: t(
            `Apply the rule to each term in turn: ${chain(terms, k, (n) => `${p === 1 ? "" : p === -1 ? "-" : `${p} \\cdot `}${paren(terms[n - 2]!)}${plus(q)}`)}`,
            `依次对每一项应用规则：${chain(terms, k, (n) => `${p === 1 ? "" : p === -1 ? "-" : `${p} \\cdot `}${paren(terms[n - 2]!)}${plus(q)}`)}`,
          ),
        });
      },
    },
    {
      id: "rules-involving-the-index",
      title: t("Rules that involve the index", "含下标的递推规则"),
      explanation: t(
        "A recursive rule may also use the index $n$ of the term being computed. For $a_1 = 2$ and $a_n = a_{n-1} + 3n$, computing $a_2$ uses $n = 2$, computing $a_3$ uses $n = 3$:\n\n$$a_2 = 2 + 3 \\cdot 2 = 8, \\quad a_3 = 8 + 3 \\cdot 3 = 17.$$\n\nA common mistake is to use the index of the previous term instead.",
        "递推规则也可能用到正在计算的那一项的下标 $n$。对于 $a_1 = 2$ 和 $a_n = a_{n-1} + 3n$，计算 $a_2$ 时 $n = 2$，计算 $a_3$ 时 $n = 3$：\n\n$$a_2 = 2 + 3 \\cdot 2 = 8, \\quad a_3 = 8 + 3 \\cdot 3 = 17.$$\n\n常见错误是用了前一项的下标。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const c = rng.nonZero(-4, 4);
        const a1 = rng.int(-6, 6);
        const k = rng.int(3, 5);
        const [rule, f, sub] =
          kind === 0
            ? [
                poly([1, "a_{n-1}"], [c, "n"]),
                (x: number, n: number) => x + c * n,
                (x: number, n: number) => `${num(x)} ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? n : `${Math.abs(c)} \\cdot ${n}`}`,
              ]
            : kind === 1
              ? [
                  poly([c, "n"], [-1, "a_{n-1}"]),
                  (x: number, n: number) => c * n - x,
                  (x: number, n: number) => `${num(c)} \\cdot ${n} - ${paren(x)}`,
                ]
              : [`n \\cdot a_{n-1}`, (x: number, n: number) => n * x, (x: number, n: number) => `${n} \\cdot ${paren(x)}`];
        const start = kind === 2 ? rng.nonZero(-3, 3) : a1;
        const terms = iterate(start, k, f);
        const shifted = iterate(start, k, (x, n) => f(x, n - 1));
        return numberProblem({
          prompt: t(
            `A sequence is defined by $a_1 = ${start}$ and $a_n = ${rule}$. Find $a_{${k}}$.`,
            `数列由 $a_1 = ${start}$ 和 $a_n = ${rule}$ 定义。求 $a_{${k}}$。`,
          ),
          answer: terms[k - 1]!,
          wrong: [shifted[k - 1]!, terms[k - 2]!],
          solution: t(
            `Use the index of the term being computed: ${chain(terms, k, (n) => sub(terms[n - 2]!, n))}`,
            `使用正在计算的那一项的下标：${chain(terms, k, (n) => sub(terms[n - 2]!, n))}`,
          ),
        });
      },
    },
    {
      id: "finding-earlier-terms",
      title: t("Finding earlier terms", "求前面的项"),
      explanation: t(
        "To go backward, undo the rule. If $a_n = a_{n-1} + 5$ and $a_3 = 12$, then each term is $5$ less than the next:\n\n$$a_2 = 12 - 5 = 7, \\quad a_1 = 7 - 5 = 2.$$\n\nIf $a_n = -3a_{n-1}$ and $a_3 = 36$, solve $-3a_2 = 36$ to get $a_2 = -12$, then $-3a_1 = -12$ to get $a_1 = 4$.",
        "要向后推，就把规则反过来。若 $a_n = a_{n-1} + 5$ 且 $a_3 = 12$，则每一项比后一项小 $5$：\n\n$$a_2 = 12 - 5 = 7, \\quad a_1 = 7 - 5 = 2.$$\n\n若 $a_n = -3a_{n-1}$ 且 $a_3 = 36$，解 $-3a_2 = 36$ 得 $a_2 = -12$，再解 $-3a_1 = -12$ 得 $a_1 = 4$。",
      ),
      keyPrerequisites: ["one-step-equations-multiplication"],
      generate(rng) {
        const m = rng.int(3, 4);
        const a1 = rng.nonZero(-9, 9);
        if (rng.bool()) {
          const q = rng.nonZero(-12, 12);
          const terms = iterate(a1, m, (x) => x + q);
          const am = terms[m - 1]!;
          const back = Array.from(
            { length: m - 1 },
            (_, i) => `a_{${m - 1 - i}} = ${num(terms[m - 1 - i]!)} ${q > 0 ? `- ${q}` : `+ ${-q}`} = ${num(terms[m - 2 - i]!)}`,
          );
          return numberProblem({
            prompt: t(
              `A sequence satisfies $a_n = ${poly([1, "a_{n-1}"], [q, ""])}$ and $a_{${m}} = ${am}$. Find $a_1$.`,
              `数列满足 $a_n = ${poly([1, "a_{n-1}"], [q, ""])}$，且 $a_{${m}} = ${am}$。求 $a_1$。`,
            ),
            answer: a1,
            wrong: [am + (m - 1) * q, am - m * q, am - q],
            solution: t(
              `Each term is the next one ${q > 0 ? `minus $${q}$` : `plus $${-q}$`}: ${steps(...back)}`,
              `每一项等于后一项${q > 0 ? `减去 $${q}$` : `加上 $${-q}$`}：${steps(...back)}`,
            ),
          });
        }
        const p = rng.pick([2, 3, -2, -3]);
        const terms = iterate(a1, m, (x) => p * x);
        const am = terms[m - 1]!;
        const back = Array.from(
          { length: m - 1 },
          (_, i) => `a_{${m - 1 - i}} = \\frac{${num(terms[m - 1 - i]!)}}{${num(p)}} = ${num(terms[m - 2 - i]!)}`,
        );
        return numberProblem({
          prompt: t(
            `A sequence satisfies $a_n = ${p}a_{n-1}$ and $a_{${m}} = ${am}$. Find $a_1$.`,
            `数列满足 $a_n = ${p}a_{n-1}$，且 $a_{${m}} = ${am}$。求 $a_1$。`,
          ),
          answer: a1,
          wrong: [am * p ** (m - 1), Q.of(am, p), Q.of(am, p ** m)],
          solution: t(
            `Each term is the next one divided by $${num(p)}$: ${steps(...back)}`,
            `每一项等于后一项除以 $${num(p)}$：${steps(...back)}`,
          ),
        });
      },
    },
  ],
};

export const fibonacciSequences: TopicDef = {
  id: "fibonacci-sequences",
  title: t("Fibonacci Sequences", "斐波那契型数列"),
  summary: t("Compute terms of sequences in which each term depends on the two before it.", "计算每一项由前两项决定的数列。"),
  prerequisites: ["recursive-sequences"],
  encompasses: [{ topic: "recursive-sequences", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSF.IF.A.3"],
  knowledgePoints: [
    {
      id: "the-fibonacci-rule",
      title: t("The Fibonacci rule", "斐波那契规则"),
      explanation: t(
        "In the **Fibonacci sequence** each term is the sum of the two terms before it:\n\n$$a_1 = 1, \\quad a_2 = 1, \\quad a_n = a_{n-1} + a_{n-2}: \\qquad 1, 1, 2, 3, 5, 8, 13, \\ldots$$\n\nBecause the rule needs two earlier terms, the formula must give two starting terms. The same rule works from any two starting terms, negative ones included: from $a_1 = 4$, $a_2 = -1$ we get $3, 2, 5, 7, \\ldots$",
        "在**斐波那契数列**中，每一项等于它前面两项之和：\n\n$$a_1 = 1, \\quad a_2 = 1, \\quad a_n = a_{n-1} + a_{n-2}: \\qquad 1, 1, 2, 3, 5, 8, 13, \\ldots$$\n\n由于规则需要前面两项，公式必须给出两个初始项。同样的规则可以从任意两个初始项开始，包括负数：由 $a_1 = 4$，$a_2 = -1$ 得到 $3, 2, 5, 7, \\ldots$",
      ),
      generate(rng) {
        const a1 = rng.int(-9, 9);
        const a2 = rng.nonZero(-9, 9);
        const k = rng.int(5, 8);
        const terms = [a1, a2];
        for (let n = 3; n <= k + 1; n++) terms.push(terms[n - 2]! + terms[n - 3]!);
        const lines = Array.from(
          { length: k - 2 },
          (_, i) => `a_{${i + 3}} = ${num(terms[i + 1]!)}${plus(terms[i]!)} = ${num(terms[i + 2]!)}`,
        );
        return numberProblem({
          prompt: t(
            `A sequence is defined by $a_1 = ${a1}$, $a_2 = ${a2}$ and $a_n = a_{n-1} + a_{n-2}$. Find $a_{${k}}$.`,
            `数列由 $a_1 = ${a1}$，$a_2 = ${a2}$ 和 $a_n = a_{n-1} + a_{n-2}$ 定义。求 $a_{${k}}$。`,
          ),
          answer: terms[k - 1]!,
          wrong: [terms[k - 2]!, terms[k]!],
          solution: t(`Add the two previous terms each time: ${steps(...lines)}`, `每次把前两项相加：${steps(...lines)}`),
        });
      },
    },
    {
      id: "other-two-term-rules",
      title: t("Other rules on two terms", "其他两项递推规则"),
      explanation: t(
        "Other rules also combine the two previous terms. For $a_1 = 1$, $a_2 = 3$ and $a_n = 2a_{n-1} - a_{n-2}$:\n\n$$a_3 = 2 \\cdot 3 - 1 = 5, \\quad a_4 = 2 \\cdot 5 - 3 = 7.$$\n\nKeep track of which term is $a_{n-1}$ (the one just before) and which is $a_{n-2}$ (two before).",
        "其他规则也会组合前两项。对于 $a_1 = 1$，$a_2 = 3$ 和 $a_n = 2a_{n-1} - a_{n-2}$：\n\n$$a_3 = 2 \\cdot 3 - 1 = 5, \\quad a_4 = 2 \\cdot 5 - 3 = 7.$$\n\n分清哪一项是 $a_{n-1}$（紧挨着的前一项），哪一项是 $a_{n-2}$（前面第二项）。",
      ),
      generate(rng) {
        const [p, q] = rng.pick<[number, number]>([
          [1, -1],
          [2, 1],
          [1, 2],
          [2, -1],
          [-1, 1],
          [3, -1],
          [1, 3],
        ]);
        const a1 = rng.int(-5, 5);
        const a2 = rng.nonZero(-5, 5);
        const k = rng.int(4, 6);
        const run = (x: number, y: number) => {
          const s = [a1, a2];
          for (let n = 3; n <= k; n++) s.push(x * s[n - 2]! + y * s[n - 3]!);
          return s;
        };
        const terms = run(p, q);
        const rule = poly([p, "a_{n-1}"], [q, "a_{n-2}"]);
        const term = (c: number, v: number) => (c === 1 ? paren(v) : c === -1 ? `-${paren(v)}` : `${c} \\cdot ${paren(v)}`);
        const lines = Array.from(
          { length: k - 2 },
          (_, i) => `a_{${i + 3}} = ${term(p, terms[i + 1]!)} ${q < 0 ? "-" : "+"} ${term(Math.abs(q), terms[i]!)} = ${num(terms[i + 2]!)}`,
        );
        return numberProblem({
          prompt: t(
            `A sequence is defined by $a_1 = ${a1}$, $a_2 = ${a2}$ and $a_n = ${rule}$. Find $a_{${k}}$.`,
            `数列由 $a_1 = ${a1}$，$a_2 = ${a2}$ 和 $a_n = ${rule}$ 定义。求 $a_{${k}}$。`,
          ),
          answer: terms[k - 1]!,
          wrong: [run(q, p)[k - 1]!, terms[k - 2]!],
          solution: t(`Apply the rule term by term: ${steps(...lines)}`, `逐项应用规则：${steps(...lines)}`),
        });
      },
    },
    {
      id: "working-backward",
      title: t("Working backward", "向前倒推"),
      explanation: t(
        "If $a_n = a_{n-1} + a_{n-2}$, then $a_{n-2} = a_n - a_{n-1}$: an earlier term is a later term minus the one between them. Given $a_5 = 7$ and $a_6 = 11$:\n\n$$a_4 = a_6 - a_5 = 11 - 7 = 4, \\quad a_3 = a_5 - a_4 = 7 - 4 = 3.$$\n\nSubtract in the right order, the later term minus the earlier one.",
        "若 $a_n = a_{n-1} + a_{n-2}$，则 $a_{n-2} = a_n - a_{n-1}$：较前的一项等于较后的一项减去它们中间的那一项。已知 $a_5 = 7$，$a_6 = 11$：\n\n$$a_4 = a_6 - a_5 = 11 - 7 = 4, \\quad a_3 = a_5 - a_4 = 7 - 4 = 3.$$\n\n注意相减的顺序：较后的项减去较前的项。",
      ),
      generate(rng) {
        const m = rng.int(4, 5);
        const terms = [rng.int(-9, 9), rng.nonZero(-9, 9)];
        for (let n = 3; n <= m + 1; n++) terms.push(terms[n - 2]! + terms[n - 3]!);
        const j = rng.int(1, m - 1);
        const x = terms[m - 1]!;
        const y = terms[m]!;
        const flipped = [x, y];
        for (let i = 0; i < m - 1; i++) flipped.unshift(flipped[0]! - flipped[1]!);
        const lines = Array.from({ length: m - j }, (_, i) => {
          const n = m - 1 - i;
          return `a_{${n}} = a_{${n + 2}} - a_{${n + 1}} = ${num(terms[n + 1]!)} - ${paren(terms[n]!)} = ${num(terms[n - 1]!)}`;
        });
        return numberProblem({
          prompt: t(
            `A sequence satisfies $a_n = a_{n-1} + a_{n-2}$, with $a_{${m}} = ${x}$ and $a_{${m + 1}} = ${y}$. Find $a_{${j}}$.`,
            `数列满足 $a_n = a_{n-1} + a_{n-2}$，且 $a_{${m}} = ${x}$，$a_{${m + 1}} = ${y}$。求 $a_{${j}}$。`,
          ),
          answer: terms[j - 1]!,
          wrong: [terms[j]!, flipped[j - 1]!],
          solution: t(
            `Each earlier term is a later term minus the one between them: ${steps(...lines)}`,
            `每个较前的项等于较后的项减去它们中间的项：${steps(...lines)}`,
          ),
        });
      },
    },
  ],
};

/** differences writes the differences between consecutive terms. */
const differences = (terms: readonly number[]) => terms.slice(1).map((x, i) => `${num(x)} - ${paren(terms[i]!)} = ${num(x - terms[i]!)}`);

export const arithmeticSequences: TopicDef = {
  id: "arithmetic-sequences",
  title: t("Arithmetic Sequences", "等差数列"),
  summary: t(
    "Recognize arithmetic sequences, find the common difference and fill in missing terms.",
    "识别等差数列，求公差并补全缺失的项。",
  ),
  prerequisites: ["introduction-to-sequences"],
  encompasses: [
    { topic: "introduction-to-sequences", weight: 0.3 },
    { topic: "subtracting-integers", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.IF.A.3", "CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "identifying-arithmetic-sequences",
      title: t("Identifying arithmetic sequences", "识别等差数列"),
      explanation: t(
        "A sequence is **arithmetic** when the same number is added to get from each term to the next. That number is the **common difference** $d$, found by subtracting any term from the term after it. To check a sequence, compute all the differences between consecutive terms:\n\n$$2, 7, 12, 17: \\quad 5, 5, 5 \\quad \\text{arithmetic}; \\qquad 1, 4, 9, 16: \\quad 3, 5, 7 \\quad \\text{not arithmetic}.$$",
        "如果从每一项到下一项都加上同一个数，这个数列就是**等差数列**。这个数叫做**公差** $d$，用任意一项的后一项减去这一项即可得到。检验一个数列时，计算所有相邻两项的差：\n\n$$2, 7, 12, 17: \\quad 5, 5, 5 \\quad \\text{等差}; \\qquad 1, 4, 9, 16: \\quad 3, 5, 7 \\quad \\text{不是等差}.$$",
      ),
      generate(rng) {
        const a1 = rng.int(-20, 30);
        const d = rng.nonZero(-12, 12);
        let terms = arithmetic(a1, d, 5);
        if (rng.bool()) {
          const kind = rng.int(0, 2);
          if (kind === 0) {
            const i = rng.int(2, 4);
            terms = terms.map((x, j) => (j === i ? x + rng.nonZero(-3, 3) : x));
          } else if (kind === 1) {
            const r = rng.pick([2, 3, -2]);
            const s = rng.nonZero(-5, 5);
            terms = Array.from({ length: 5 }, (_, i) => s * r ** i);
          } else {
            const c = rng.int(-10, 10);
            terms = Array.from({ length: 5 }, (_, i) => (i + 1) ** 2 + c);
          }
        }
        const diffs = terms.slice(1).map((x, i) => x - terms[i]!);
        const isArithmetic = diffs.every((x) => x === diffs[0]);
        return choiceProblem({
          prompt: t(`Is the sequence $${list(terms)}$ arithmetic?`, `数列 $${list(terms)}$ 是等差数列吗？`),
          options: yesNo,
          correct: isArithmetic ? 0 : 1,
          solution: t(
            `The differences between consecutive terms are ${steps(...differences(terms))}${isArithmetic ? `They are all equal, so the sequence is arithmetic with $d = ${num(diffs[0]!)}$.` : "They are not all equal, so the sequence is not arithmetic."}`,
            `相邻两项的差为 ${steps(...differences(terms))}${isArithmetic ? `它们全都相等，所以这是公差 $d = ${num(diffs[0]!)}$ 的等差数列。` : "它们不全相等，所以这不是等差数列。"}`,
          ),
        });
      },
    },
    {
      id: "finding-the-common-difference",
      title: t("Finding the common difference", "求公差"),
      explanation: t(
        "The common difference is a term **minus the term before it**, never the other way round. For $20, 14, 8, 2, \\ldots$:\n\n$$d = 14 - 20 = -6.$$\n\nA decreasing arithmetic sequence has a negative common difference.",
        "公差等于某一项**减去它的前一项**，不能反过来。对于 $20, 14, 8, 2, \\ldots$：\n\n$$d = 14 - 20 = -6.$$\n\n递减的等差数列的公差是负数。",
      ),
      keyPrerequisites: ["subtracting-integers"],
      generate(rng) {
        const a1 = rng.int(-30, 30);
        const d = rng.nonZero(-15, 15);
        const terms = arithmetic(a1, d, 5);
        return numberProblem({
          prompt: t(`Find the common difference of the arithmetic sequence $${list(terms)}$`, `求等差数列 $${list(terms)}$ 的公差。`),
          answer: d,
          wrong: [-d, 2 * d],
          solution: t(
            `Subtract the first term from the second: ${steps(`d = ${num(terms[1]!)} - ${paren(a1)} = ${num(d)}`)}`,
            `用第二项减去第一项：${steps(`d = ${num(terms[1]!)} - ${paren(a1)} = ${num(d)}`)}`,
          ),
        });
      },
    },
    {
      id: "filling-in-missing-terms",
      title: t("Filling in missing terms", "补全缺失的项"),
      explanation: t(
        "When terms are missing between two known terms, count the **steps** between them, not the blanks. In $5, \\square, \\square, 23$ there are $3$ steps from $5$ to $23$, so\n\n$$3d = 23 - 5 = 18, \\quad d = 6,$$\n\nand the missing terms are $11$ and $17$.",
        "当两个已知项之间缺少若干项时，数它们之间的**步数**，而不是空格数。在 $5, \\square, \\square, 23$ 中，从 $5$ 到 $23$ 共有 $3$ 步，所以\n\n$$3d = 23 - 5 = 18, \\quad d = 6,$$\n\n缺失的两项是 $11$ 和 $17$。",
      ),
      generate(rng) {
        const blanks = rng.int(2, 3);
        const a1 = rng.int(-20, 30);
        const d = rng.nonZero(-9, 9);
        const terms = arithmetic(a1, d, blanks + 2);
        const last = terms[blanks + 1]!;
        const j = rng.int(1, blanks);
        const shown = [num(a1), ...Array(blanks).fill("\\square"), num(last)].join(", ");
        const ord = (i: number) => (i === 1 ? ["first", "第一"] : i === 2 ? ["second", "第二"] : ["third", "第三"]);
        const [en, zh] = ord(j);
        return numberProblem({
          prompt: t(
            `The numbers $${shown}$ form an arithmetic sequence. What number goes in the ${en} box?`,
            `$${shown}$ 构成等差数列。${zh}个方框中应填什么数？`,
          ),
          answer: terms[j]!,
          wrong: [Q.of(a1).add(Q.of((last - a1) * j, blanks)), d, terms[j + 1]!],
          solution: t(
            `There are $${blanks + 1}$ steps from $${num(a1)}$ to $${num(last)}$: ${steps(`${blanks + 1}d = ${num(last)} - ${paren(a1)} = ${num(last - a1)}`, `d = ${num(d)}`)}The ${en} missing term is $${num(a1)}${j === 1 ? "" : ` + ${j}`}${j === 1 ? plus(d) : ` \\cdot ${paren(d)}`} = ${num(terms[j]!)}$.`,
            `从 $${num(a1)}$ 到 $${num(last)}$ 共 $${blanks + 1}$ 步：${steps(`${blanks + 1}d = ${num(last)} - ${paren(a1)} = ${num(last - a1)}`, `d = ${num(d)}`)}${zh}个缺失的项是 $${num(a1)}${j === 1 ? "" : ` + ${j}`}${j === 1 ? plus(d) : ` \\cdot ${paren(d)}`} = ${num(terms[j]!)}$。`,
          ),
        });
      },
    },
  ],
};

export const recursiveFormulasForArithmeticSequences: TopicDef = {
  id: "recursive-formulas-for-arithmetic-sequences",
  title: t("Recursive Formulas for Arithmetic Sequences", "等差数列的递推公式"),
  summary: t(
    "Write $a_1 = \\ldots$, $a_n = a_{n-1} + d$ for an arithmetic sequence, and use it.",
    "为等差数列写出 $a_1 = \\ldots$，$a_n = a_{n-1} + d$，并加以运用。",
  ),
  prerequisites: ["arithmetic-sequences", "recursive-sequences"],
  encompasses: [
    { topic: "arithmetic-sequences", weight: 0.4 },
    { topic: "recursive-sequences", weight: 0.4 },
  ],
  xp: 10,
  standards: ["CCSS.HSF.BF.A.2"],
  knowledgePoints: [
    {
      id: "writing-the-recursive-formula",
      title: t("Writing the recursive formula", "写出递推公式"),
      explanation: t(
        "Every arithmetic sequence has a recursive formula of the same shape: the first term, and the rule *add the common difference*.\n\n$$a_1 = \\text{first term}, \\qquad a_n = a_{n-1} + d.$$\n\nFor $9, 5, 1, -3, \\ldots$ the common difference is $-4$, so $a_1 = 9$ and $a_n = a_{n-1} - 4$.",
        "每个等差数列的递推公式都有相同的形式：第一项，以及规则*加上公差*。\n\n$$a_1 = \\text{首项}, \\qquad a_n = a_{n-1} + d.$$\n\n对于 $9, 5, 1, -3, \\ldots$，公差是 $-4$，所以 $a_1 = 9$，$a_n = a_{n-1} - 4$。",
      ),
      generate(rng) {
        const a1 = Q.of(rng.int(-15, 20));
        const d = Q.of(rng.sign() * rng.int(2, 9));
        const terms = arithmeticRecursive(a1, d).terms.slice(0, 4);
        const correct = arithmeticRecursive(a1, d);
        return formulaChoice(
          rng,
          t(`Which recursive formula defines the sequence $${list(terms)}$?`, `哪个递推公式定义了数列 $${list(terms)}$？`),
          correct,
          [arithmeticRecursive(a1, d.neg()), arithmeticRecursive(a1.add(d), d), geometricRecursive(a1, d), arithmeticRecursive(d, a1)],
          t(
            `The first term is $${a1.toLatex()}$ and the common difference is $${num(terms[1]!)} - ${paren(a1)} = ${d.toLatex()}$, so $${correct.latex}$.`,
            `首项是 $${a1.toLatex()}$，公差是 $${num(terms[1]!)} - ${paren(a1)} = ${d.toLatex()}$，所以 $${correct.latex}$。`,
          ),
        );
      },
    },
    {
      id: "terms-from-the-recursive-formula",
      title: t("Terms from the recursive formula", "由递推公式求项"),
      explanation: t(
        "From $a_1$ to $a_k$ there are $k - 1$ steps, and each step adds $d$. So with $a_1 = 3$ and $a_n = a_{n-1} + 4$,\n\n$$a_6 = 3 + 5 \\cdot 4 = 23.$$\n\nGoing backward, each step subtracts $d$: if $a_5 = 30$ and $a_n = a_{n-1} - 2$, then $a_1 = 30 + 4 \\cdot 2 = 38$.",
        "从 $a_1$ 到 $a_k$ 共有 $k - 1$ 步，每一步加上 $d$。所以当 $a_1 = 3$，$a_n = a_{n-1} + 4$ 时，\n\n$$a_6 = 3 + 5 \\cdot 4 = 23.$$\n\n向前倒推时，每一步减去 $d$：若 $a_5 = 30$ 且 $a_n = a_{n-1} - 2$，则 $a_1 = 30 + 4 \\cdot 2 = 38$。",
      ),
      generate(rng) {
        const a1 = rng.int(-20, 20);
        const d = rng.nonZero(-9, 9);
        const k = rng.int(4, 9);
        const ak = a1 + (k - 1) * d;
        const rule = poly([1, "a_{n-1}"], [d, ""]);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `A sequence is defined by $a_1 = ${a1}$ and $a_n = ${rule}$. Find $a_{${k}}$.`,
              `数列由 $a_1 = ${a1}$ 和 $a_n = ${rule}$ 定义。求 $a_{${k}}$。`,
            ),
            answer: ak,
            wrong: [a1 + k * d, a1 + (k - 2) * d],
            solution: t(
              `From $a_1$ to $a_{${k}}$ there are $${k - 1}$ steps of $${num(d)}$: ${steps(`a_{${k}} = ${a1} + ${k - 1} \\cdot ${paren(d)} = ${ak}`)}`,
              `从 $a_1$ 到 $a_{${k}}$ 共 $${k - 1}$ 步，每步加 $${num(d)}$：${steps(`a_{${k}} = ${a1} + ${k - 1} \\cdot ${paren(d)} = ${ak}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `A sequence satisfies $a_n = ${rule}$ and $a_{${k}} = ${ak}$. Find $a_1$.`,
            `数列满足 $a_n = ${rule}$，且 $a_{${k}} = ${ak}$。求 $a_1$。`,
          ),
          answer: a1,
          wrong: [ak + (k - 1) * d, ak - k * d, ak - (k - 2) * d],
          solution: t(
            `Going back from $a_{${k}}$ to $a_1$ takes $${k - 1}$ steps, each subtracting $${num(d)}$: ${steps(`a_1 = ${ak} - ${k - 1} \\cdot ${paren(d)} = ${a1}`)}`,
            `从 $a_{${k}}$ 倒推到 $a_1$ 共 $${k - 1}$ 步，每步减去 $${num(d)}$：${steps(`a_1 = ${ak} - ${k - 1} \\cdot ${paren(d)} = ${a1}`)}`,
          ),
        });
      },
    },
  ],
};

/** explicitSteps writes the simplification a_1 + (n - 1)d = dn + c. */
const explicitSteps = (a1: number, d: number) =>
  steps(
    `a_n = ${num(a1)} + (n - 1) \\cdot ${paren(d)}`,
    `a_n = ${num(a1)} ${d < 0 ? "-" : "+"} ${poly([Math.abs(d), "n"])} ${d < 0 ? "+" : "-"} ${Math.abs(d)}`,
    `a_n = ${poly([d, "n"], [a1 - d, ""])}`,
  );

export const nthTermOfAnArithmeticSequence: TopicDef = {
  id: "nth-term-of-an-arithmetic-sequence",
  title: t("The Nth Term of an Arithmetic Sequence", "等差数列的通项"),
  summary: t("Use and write the explicit formula $a_n = a_1 + (n - 1)d$.", "使用并写出通项公式 $a_n = a_1 + (n - 1)d$。"),
  prerequisites: ["arithmetic-sequences", "simplifying-expressions"],
  encompasses: [
    { topic: "arithmetic-sequences", weight: 0.5 },
    { topic: "simplifying-expressions", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.A.2", "CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "finding-a-distant-term",
      title: t("Finding a distant term", "求较远的项"),
      explanation: t(
        "To reach $a_n$ from $a_1$, add the common difference $n - 1$ times, once for each step:\n\n$$a_n = a_1 + (n - 1)d.$$\n\nFor $7, 10, 13, \\ldots$: $a_{40} = 7 + 39 \\cdot 3 = 124$. Using $n$ instead of $n - 1$ is the most common mistake: $a_1$ itself takes no steps.",
        "从 $a_1$ 到 $a_n$，每走一步加一次公差，共加 $n - 1$ 次：\n\n$$a_n = a_1 + (n - 1)d.$$\n\n对于 $7, 10, 13, \\ldots$：$a_{40} = 7 + 39 \\cdot 3 = 124$。最常见的错误是用 $n$ 代替 $n - 1$：$a_1$ 本身不需要走任何一步。",
      ),
      generate(rng) {
        const a1 = rng.int(-20, 30);
        const d = rng.nonZero(-12, 12);
        const k = rng.int(15, 100);
        const terms = arithmetic(a1, d, 4);
        const ak = a1 + (k - 1) * d;
        return numberProblem({
          prompt: t(
            `Find the ${ordinal(k)} term of the arithmetic sequence $${list(terms)}$`,
            `求等差数列 $${list(terms)}$ 的第 $${k}$ 项。`,
          ),
          answer: ak,
          wrong: [a1 + k * d, (k - 1) * d, a1 - (k - 1) * d],
          solution: t(
            `Here $a_1 = ${a1}$ and $d = ${d}$: ${steps(`a_{${k}} = ${a1} + (${k} - 1) \\cdot ${paren(d)} = ${ak}`)}`,
            `这里 $a_1 = ${a1}$，$d = ${d}$：${steps(`a_{${k}} = ${a1} + (${k} - 1) \\cdot ${paren(d)} = ${ak}`)}`,
          ),
        });
      },
    },
    {
      id: "writing-the-explicit-formula",
      title: t("Writing the explicit formula", "写出通项公式"),
      explanation: t(
        "Substitute $a_1$ and $d$ into $a_n = a_1 + (n - 1)d$ and simplify. For $5, 8, 11, \\ldots$:\n\n$$a_n = 5 + (n - 1) \\cdot 3 = 5 + 3n - 3 = 3n + 2.$$\n\nCheck with $n = 1$: $3 \\cdot 1 + 2 = 5$. ✓ The coefficient of $n$ is the common difference, but the constant is **not** the first term.",
        "把 $a_1$ 和 $d$ 代入 $a_n = a_1 + (n - 1)d$ 并化简。对于 $5, 8, 11, \\ldots$：\n\n$$a_n = 5 + (n - 1) \\cdot 3 = 5 + 3n - 3 = 3n + 2.$$\n\n用 $n = 1$ 检验：$3 \\cdot 1 + 2 = 5$。✓ $n$ 的系数是公差，但常数项**不是**首项。",
      ),
      keyPrerequisites: ["simplifying-expressions"],
      generate(rng) {
        const a1 = rng.int(-20, 30);
        const d = rng.nonZero(-12, 12);
        const terms = arithmetic(a1, d, 4);
        return formulaProblem({
          prompt: t(`Write an explicit formula for the arithmetic sequence $${list(terms)}$`, `写出等差数列 $${list(terms)}$ 的通项公式。`),
          answer: poly([d, "n"], [a1 - d, ""]),
          wrong: [poly([d, "n"], [a1, ""]), poly([a1, "n"], [d, ""]), poly([-d, "n"], [a1 + d, ""])],
          solution: t(
            `Here $a_1 = ${a1}$ and $d = ${d}$: ${explicitSteps(a1, d)}`,
            `这里 $a_1 = ${a1}$，$d = ${d}$：${explicitSteps(a1, d)}`,
          ),
        });
      },
    },
    {
      id: "reading-an-explicit-formula",
      title: t("Reading an explicit formula", "读懂通项公式"),
      explanation: t(
        "In $a_n = dn + c$, the common difference is the coefficient $d$ of $n$, because each time $n$ grows by $1$ the term grows by $d$. The first term is $a_1 = d + c$, found by substituting $n = 1$, not the constant $c$. For $a_n = 4n - 9$: $d = 4$ and $a_1 = -5$.\n\nIn $a_n = 7 - 2(n - 1)$, the formula is already written as $a_1 + (n - 1)d$: $a_1 = 7$ and $d = -2$.",
        "在 $a_n = dn + c$ 中，公差是 $n$ 的系数 $d$，因为 $n$ 每增加 $1$，项就增加 $d$。首项是代入 $n = 1$ 得到的 $a_1 = d + c$，而不是常数 $c$。对于 $a_n = 4n - 9$：$d = 4$，$a_1 = -5$。\n\n$a_n = 7 - 2(n - 1)$ 已经写成 $a_1 + (n - 1)d$ 的形式：$a_1 = 7$，$d = -2$。",
      ),
      generate(rng) {
        const d = rng.nonZero(-9, 9);
        const askFirst = rng.bool();
        const [what, whatZh] = askFirst ? ["first term", "首项"] : ["common difference", "公差"];
        if (rng.bool()) {
          const c = rng.nonZero(-20, 20);
          const expr = poly([d, "n"], [c, ""]);
          return numberProblem({
            prompt: t(
              `An arithmetic sequence has $a_n = ${expr}$. What is its ${what}?`,
              `等差数列的通项为 $a_n = ${expr}$。它的${whatZh}是多少？`,
            ),
            answer: askFirst ? d + c : d,
            wrong: askFirst ? [c, d] : [c, -d, d + c],
            solution: askFirst
              ? t(
                  `Substitute $n = 1$: ${steps(`a_1 = ${num(d)} \\cdot 1${plus(c)} = ${d + c}`)}`,
                  `代入 $n = 1$：${steps(`a_1 = ${num(d)} \\cdot 1${plus(c)} = ${d + c}`)}`,
                )
              : t(`The common difference is the coefficient of $n$: $d = ${d}$.`, `公差是 $n$ 的系数：$d = ${d}$。`),
          });
        }
        const a1 = rng.nonZero(-20, 30);
        const expr = `${a1}${d < 0 ? " -" : " +"} ${Math.abs(d) === 1 ? "" : Math.abs(d)}(n - 1)`;
        return numberProblem({
          prompt: t(
            `An arithmetic sequence has $a_n = ${expr}$. What is its ${what}?`,
            `等差数列的通项为 $a_n = ${expr}$。它的${whatZh}是多少？`,
          ),
          answer: askFirst ? a1 : d,
          wrong: askFirst ? [a1 - d, a1 + d] : [a1, -d],
          solution: t(
            `The formula has the form $a_1 + (n - 1)d$ with $a_1 = ${a1}$ and $d = ${d}$.`,
            `公式形如 $a_1 + (n - 1)d$，其中 $a_1 = ${a1}$，$d = ${d}$。`,
          ),
        });
      },
    },
  ],
};

export const explicitAndRecursiveArithmeticFormulas: TopicDef = {
  id: "explicit-and-recursive-arithmetic-formulas",
  title: t("Explicit and Recursive Formulas for Arithmetic Sequences", "等差数列的通项公式与递推公式"),
  summary: t(
    "Translate between the explicit and the recursive formula of an arithmetic sequence.",
    "在等差数列的通项公式与递推公式之间互相转换。",
  ),
  prerequisites: ["recursive-formulas-for-arithmetic-sequences", "nth-term-of-an-arithmetic-sequence"],
  encompasses: [
    { topic: "recursive-formulas-for-arithmetic-sequences", weight: 0.5 },
    { topic: "nth-term-of-an-arithmetic-sequence", weight: 0.5 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.BF.A.2"],
  knowledgePoints: [
    {
      id: "recursive-to-explicit",
      title: t("From recursive to explicit", "由递推公式到通项公式"),
      explanation: t(
        "A recursive formula $a_1 = a$, $a_n = a_{n-1} + d$ gives the first term and the common difference directly. Substitute them into $a_n = a_1 + (n - 1)d$:\n\n$$a_1 = -2, \\; a_n = a_{n-1} + 5 \\quad\\Longrightarrow\\quad a_n = -2 + (n - 1) \\cdot 5 = 5n - 7.$$",
        "递推公式 $a_1 = a$，$a_n = a_{n-1} + d$ 直接给出了首项和公差。把它们代入 $a_n = a_1 + (n - 1)d$：\n\n$$a_1 = -2, \\; a_n = a_{n-1} + 5 \\quad\\Longrightarrow\\quad a_n = -2 + (n - 1) \\cdot 5 = 5n - 7.$$",
      ),
      generate(rng) {
        const a1 = rng.int(-20, 25);
        const d = rng.nonZero(-12, 12);
        const rule = poly([1, "a_{n-1}"], [d, ""]);
        return formulaProblem({
          prompt: t(
            `A sequence is defined by $a_1 = ${a1}$ and $a_n = ${rule}$. Write an explicit formula for $a_n$.`,
            `数列由 $a_1 = ${a1}$ 和 $a_n = ${rule}$ 定义。写出 $a_n$ 的通项公式。`,
          ),
          answer: poly([d, "n"], [a1 - d, ""]),
          wrong: [poly([d, "n"], [a1, ""]), poly([a1, "n"], [d, ""]), poly([1, "n"], [d, ""])],
          solution: t(
            `The first term is $${a1}$ and the common difference is $${d}$: ${explicitSteps(a1, d)}`,
            `首项是 $${a1}$，公差是 $${d}$：${explicitSteps(a1, d)}`,
          ),
        });
      },
    },
    {
      id: "explicit-to-recursive",
      title: t("From explicit to recursive", "由通项公式到递推公式"),
      explanation: t(
        "From an explicit formula $a_n = dn + c$, read the common difference $d$, the coefficient of $n$, and compute the first term by substituting $n = 1$:\n\n$$a_n = 6n - 10: \\quad a_1 = 6 - 10 = -4, \\quad d = 6 \\quad\\Longrightarrow\\quad a_1 = -4, \\; a_n = a_{n-1} + 6.$$",
        "由通项公式 $a_n = dn + c$，读出公差 $d$（$n$ 的系数），再代入 $n = 1$ 求首项：\n\n$$a_n = 6n - 10: \\quad a_1 = 6 - 10 = -4, \\quad d = 6 \\quad\\Longrightarrow\\quad a_1 = -4, \\; a_n = a_{n-1} + 6.$$",
      ),
      generate(rng) {
        const p = Q.of(rng.sign() * rng.int(2, 12));
        const c = Q.of(rng.nonZero(-20, 20));
        const a1 = p.add(c);
        const correct = arithmeticRecursive(a1, p);
        return formulaChoice(
          rng,
          t(
            `Which recursive formula defines the sequence $a_n = ${poly([p, "n"], [c, ""])}$?`,
            `哪个递推公式定义了数列 $a_n = ${poly([p, "n"], [c, ""])}$？`,
          ),
          correct,
          [arithmeticRecursive(c, p), arithmeticRecursive(a1, c), arithmeticRecursive(a1.add(p), p), geometricRecursive(a1, p)],
          t(
            `The common difference is the coefficient of $n$, $${p.toLatex()}$, and $a_1 = ${p.toLatex()}${plus(c)} = ${a1.toLatex()}$, so $${correct.latex}$.`,
            `公差是 $n$ 的系数 $${p.toLatex()}$，且 $a_1 = ${p.toLatex()}${plus(c)} = ${a1.toLatex()}$，所以 $${correct.latex}$。`,
          ),
        );
      },
    },
  ],
};

/** twoTerms draws an arithmetic sequence and two of its terms a_p and a_q with p < q. */
function twoTerms(rng: Rng) {
  const a1 = rng.int(-30, 30);
  const d = rng.nonZero(-9, 9);
  const p = rng.int(2, 8);
  const q = p + rng.int(2, 9);
  return { a1, d, p, q, x: a1 + (p - 1) * d, y: a1 + (q - 1) * d };
}

/** givenTwo writes "a_p = x and a_q = y". */
const givenTwo = (p: number, x: number, q: number, y: number) => `$a_{${p}} = ${x}$ and $a_{${q}} = ${y}$`;
const givenTwoZh = (p: number, x: number, q: number, y: number) => `$a_{${p}} = ${x}$，$a_{${q}} = ${y}$`;

/** differenceSteps writes how d follows from a_p and a_q. */
const differenceSteps = (p: number, x: number, q: number, y: number) =>
  steps(`${q - p}d = ${num(y)} - ${paren(x)} = ${y - x}`, `d = ${num((y - x) / (q - p))}`);

export const arithmeticSequencesFromTwoTerms: TopicDef = {
  id: "arithmetic-sequences-from-two-terms",
  title: t("Arithmetic Sequences from Two Terms", "由两项确定等差数列"),
  summary: t(
    "Find the common difference, the first term, the explicit formula and any term from two terms of an arithmetic sequence.",
    "由等差数列的两项求公差、首项、通项公式和任意一项。",
  ),
  prerequisites: ["nth-term-of-an-arithmetic-sequence"],
  encompasses: [{ topic: "nth-term-of-an-arithmetic-sequence", weight: 0.7 }],
  xp: 15,
  standards: ["CCSS.HSF.BF.A.2", "CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "common-difference-from-two-terms",
      title: t("The common difference from two terms", "由两项求公差"),
      explanation: t(
        "From $a_p$ to $a_q$ there are $q - p$ steps, each adding $d$, so\n\n$$(q - p)d = a_q - a_p.$$\n\nIf $a_3 = 11$ and $a_8 = 31$: $5d = 20$, so $d = 4$. Divide by the number of steps, not by the number of terms.",
        "从 $a_p$ 到 $a_q$ 共 $q - p$ 步，每步加 $d$，所以\n\n$$(q - p)d = a_q - a_p.$$\n\n若 $a_3 = 11$，$a_8 = 31$：$5d = 20$，所以 $d = 4$。要除以步数，而不是项数。",
      ),
      generate(rng) {
        const { d, p, q, x, y } = twoTerms(rng);
        return numberProblem({
          prompt: t(
            `An arithmetic sequence has ${givenTwo(p, x, q, y)}. Find the common difference.`,
            `等差数列中 ${givenTwoZh(p, x, q, y)}。求公差。`,
          ),
          answer: d,
          wrong: [Q.of(y - x, q - p + 1), y - x, -d],
          solution: t(
            `There are $${q} - ${p} = ${q - p}$ steps from $a_{${p}}$ to $a_{${q}}$: ${differenceSteps(p, x, q, y)}`,
            `从 $a_{${p}}$ 到 $a_{${q}}$ 共 $${q} - ${p} = ${q - p}$ 步：${differenceSteps(p, x, q, y)}`,
          ),
        });
      },
    },
    {
      id: "first-term-from-two-terms",
      title: t("The first term from two terms", "由两项求首项"),
      explanation: t(
        "Once $d$ is known, step back from $a_p$ to $a_1$: that is $p - 1$ steps, so\n\n$$a_1 = a_p - (p - 1)d.$$\n\nWith $a_3 = 11$ and $d = 4$: $a_1 = 11 - 2 \\cdot 4 = 3$.",
        "求出 $d$ 后，从 $a_p$ 倒推到 $a_1$：共 $p - 1$ 步，所以\n\n$$a_1 = a_p - (p - 1)d.$$\n\n当 $a_3 = 11$，$d = 4$ 时：$a_1 = 11 - 2 \\cdot 4 = 3$。",
      ),
      generate(rng) {
        const { a1, d, p, q, x, y } = twoTerms(rng);
        return numberProblem({
          prompt: t(`An arithmetic sequence has ${givenTwo(p, x, q, y)}. Find $a_1$.`, `等差数列中 ${givenTwoZh(p, x, q, y)}。求 $a_1$。`),
          answer: a1,
          wrong: [x - p * d, x + (p - 1) * d, d],
          solution: t(
            `First find $d$: ${differenceSteps(p, x, q, y)}Then step back $${p - 1}$ times from $a_{${p}}$: ${steps(`a_1 = ${x} - ${p - 1} \\cdot ${paren(d)} = ${a1}`)}`,
            `先求 $d$：${differenceSteps(p, x, q, y)}再从 $a_{${p}}$ 倒推 $${p - 1}$ 步：${steps(`a_1 = ${x} - ${p - 1} \\cdot ${paren(d)} = ${a1}`)}`,
          ),
        });
      },
    },
    {
      id: "explicit-formula-from-two-terms",
      title: t("The explicit formula from two terms", "由两项求通项公式"),
      explanation: t(
        "Find $d$, then $a_1$, then substitute into $a_n = a_1 + (n - 1)d$. With $a_3 = 11$ and $a_8 = 31$: $d = 4$, $a_1 = 3$, and\n\n$$a_n = 3 + (n - 1) \\cdot 4 = 4n - 1.$$\n\nCheck: $4 \\cdot 8 - 1 = 31$. ✓",
        "先求 $d$，再求 $a_1$，然后代入 $a_n = a_1 + (n - 1)d$。当 $a_3 = 11$，$a_8 = 31$ 时：$d = 4$，$a_1 = 3$，\n\n$$a_n = 3 + (n - 1) \\cdot 4 = 4n - 1.$$\n\n检验：$4 \\cdot 8 - 1 = 31$。✓",
      ),
      generate(rng) {
        const { a1, d, p, q, x, y } = twoTerms(rng);
        return formulaProblem({
          prompt: t(
            `An arithmetic sequence has ${givenTwo(p, x, q, y)}. Write an explicit formula for $a_n$.`,
            `等差数列中 ${givenTwoZh(p, x, q, y)}。写出 $a_n$ 的通项公式。`,
          ),
          answer: poly([d, "n"], [a1 - d, ""]),
          wrong: [poly([d, "n"], [x - d, ""]), poly([d, "n"], [a1, ""]), poly([d, "n"], [x, ""])],
          solution: t(
            `First find $d$: ${differenceSteps(p, x, q, y)}Then $a_1 = ${x} - ${p - 1} \\cdot ${paren(d)} = ${a1}$, and ${explicitSteps(a1, d)}`,
            `先求 $d$：${differenceSteps(p, x, q, y)}于是 $a_1 = ${x} - ${p - 1} \\cdot ${paren(d)} = ${a1}$，${explicitSteps(a1, d)}`,
          ),
        });
      },
    },
    {
      id: "a-term-from-two-terms",
      title: t("A term from two terms", "由两项求某一项"),
      explanation: t(
        "To find another term, you need not find $a_1$: from $a_p$ to $a_k$ there are $k - p$ steps, so $a_k = a_p + (k - p)d$. With $a_3 = 11$ and $d = 4$:\n\n$$a_{20} = 11 + 17 \\cdot 4 = 79.$$",
        "求另一项时不必先求 $a_1$：从 $a_p$ 到 $a_k$ 共 $k - p$ 步，所以 $a_k = a_p + (k - p)d$。当 $a_3 = 11$，$d = 4$ 时：\n\n$$a_{20} = 11 + 17 \\cdot 4 = 79.$$",
      ),
      generate(rng) {
        const { a1, d, p, q, x, y } = twoTerms(rng);
        const k = q + rng.int(5, 40);
        const ak = a1 + (k - 1) * d;
        return numberProblem({
          prompt: t(
            `An arithmetic sequence has ${givenTwo(p, x, q, y)}. Find $a_{${k}}$.`,
            `等差数列中 ${givenTwoZh(p, x, q, y)}。求 $a_{${k}}$。`,
          ),
          answer: ak,
          wrong: [x + (k - 1) * d, a1 + k * d, y + (k - q + 1) * d],
          solution: t(
            `First find $d$: ${differenceSteps(p, x, q, y)}From $a_{${q}}$ to $a_{${k}}$ there are $${k - q}$ steps: ${steps(`a_{${k}} = ${y} + ${k - q} \\cdot ${paren(d)} = ${ak}`)}`,
            `先求 $d$：${differenceSteps(p, x, q, y)}从 $a_{${q}}$ 到 $a_{${k}}$ 共 $${k - q}$ 步：${steps(`a_{${k}} = ${y} + ${k - q} \\cdot ${paren(d)} = ${ak}`)}`,
          ),
        });
      },
    },
  ],
};

export const indexOfATermInAnArithmeticSequence: TopicDef = {
  id: "index-of-a-term-in-an-arithmetic-sequence",
  title: t("Indexes of Terms in Arithmetic Sequences", "等差数列中项的序号"),
  summary: t(
    "Find which term of an arithmetic sequence has a given value, and count the terms of a finite one.",
    "求等差数列中取给定值的是第几项，并数出有限等差数列的项数。",
  ),
  prerequisites: ["nth-term-of-an-arithmetic-sequence", "two-step-equations"],
  encompasses: [
    { topic: "nth-term-of-an-arithmetic-sequence", weight: 0.5 },
    { topic: "two-step-equations", weight: 0.5 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "index-from-the-explicit-formula",
      title: t("The index from an explicit formula", "由通项公式求序号"),
      explanation: t(
        "To find which term equals a value, set the formula equal to it and solve for $n$. For $a_n = 3n + 4$ and the value $154$:\n\n$$3n + 4 = 154 \\;\\Rightarrow\\; 3n = 150 \\;\\Rightarrow\\; n = 50,$$\n\nso $154$ is the $50$th term. If $n$ is not a positive whole number, the value is not a term of the sequence.",
        "要求哪一项等于某个值，就令公式等于这个值，解出 $n$。对于 $a_n = 3n + 4$ 和值 $154$：\n\n$$3n + 4 = 154 \\;\\Rightarrow\\; 3n = 150 \\;\\Rightarrow\\; n = 50,$$\n\n所以 $154$ 是第 $50$ 项。如果 $n$ 不是正整数，这个值就不是数列中的项。",
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const p = rng.sign() * rng.int(2, 9);
        const q = rng.nonZero(-30, 30);
        const k = rng.int(5, 60);
        const v = p * k + q;
        const expr = poly([p, "n"], [q, ""]);
        return numberProblem({
          prompt: t(`In the sequence $a_n = ${expr}$, which term equals $${v}$?`, `在数列 $a_n = ${expr}$ 中，第几项等于 $${v}$？`),
          answer: k,
          solveFor: "n",
          wrong: [Q.of(v + q, p), Q.of(v, p), k + 1],
          solution: t(
            `Solve $${expr} = ${v}$: ${steps(`${poly([p, "n"])} = ${v - q}`, `n = ${k}`)}`,
            `解方程 $${expr} = ${v}$：${steps(`${poly([p, "n"])} = ${v - q}`, `n = ${k}`)}`,
          ),
        });
      },
    },
    {
      id: "index-from-listed-terms",
      title: t("The index from listed terms", "由列出的项求序号"),
      explanation: t(
        "When the terms are listed, write the $n$th term first, $a_n = a_1 + (n - 1)d$, and set it equal to the value. In $7, 11, 15, \\ldots$, the value $203$:\n\n$$7 + (n - 1) \\cdot 4 = 203 \\;\\Rightarrow\\; (n - 1) \\cdot 4 = 196 \\;\\Rightarrow\\; n - 1 = 49 \\;\\Rightarrow\\; n = 50.$$\n\nDon't stop at $n - 1$: the answer is $n$.",
        "当数列的项被列出时，先写出第 $n$ 项 $a_n = a_1 + (n - 1)d$，再令它等于给定值。在 $7, 11, 15, \\ldots$ 中，值 $203$：\n\n$$7 + (n - 1) \\cdot 4 = 203 \\;\\Rightarrow\\; (n - 1) \\cdot 4 = 196 \\;\\Rightarrow\\; n - 1 = 49 \\;\\Rightarrow\\; n = 50.$$\n\n不要停在 $n - 1$：答案是 $n$。",
      ),
      generate(rng) {
        const a1 = rng.int(-20, 30);
        const d = rng.nonZero(-12, 12);
        const k = rng.int(8, 80);
        const v = a1 + (k - 1) * d;
        const terms = arithmetic(a1, d, 4);
        return numberProblem({
          prompt: t(`Which term of the arithmetic sequence $${list(terms)}$ is $${v}$?`, `$${v}$ 是等差数列 $${list(terms)}$ 的第几项？`),
          answer: k,
          solveFor: "n",
          wrong: [k - 1, k + 1, Q.of(v, d)],
          solution: t(
            `Here $a_1 = ${a1}$ and $d = ${d}$: ${steps(`${a1} + (n - 1) \\cdot ${paren(d)} = ${v}`, `(n - 1) \\cdot ${paren(d)} = ${v - a1}`, `n - 1 = ${k - 1}`, `n = ${k}`)}`,
            `这里 $a_1 = ${a1}$，$d = ${d}$：${steps(`${a1} + (n - 1) \\cdot ${paren(d)} = ${v}`, `(n - 1) \\cdot ${paren(d)} = ${v - a1}`, `n - 1 = ${k - 1}`, `n = ${k}`)}`,
          ),
        });
      },
    },
    {
      id: "counting-terms",
      title: t("Counting the terms of a finite sequence", "数出有限数列的项数"),
      explanation: t(
        "A finite arithmetic sequence such as $5, 8, 11, \\ldots, 101$ stops at its last term. Its number of terms is the index of the last term:\n\n$$5 + (n - 1) \\cdot 3 = 101 \\;\\Rightarrow\\; n - 1 = 32 \\;\\Rightarrow\\; n = 33.$$\n\nThe $32$ steps join $33$ terms.",
        "像 $5, 8, 11, \\ldots, 101$ 这样的有限等差数列在最后一项处结束。它的项数就是最后一项的序号：\n\n$$5 + (n - 1) \\cdot 3 = 101 \\;\\Rightarrow\\; n - 1 = 32 \\;\\Rightarrow\\; n = 33.$$\n\n$32$ 步连接着 $33$ 项。",
      ),
      generate(rng) {
        const a1 = rng.int(-20, 30);
        const d = rng.nonZero(-9, 9);
        const k = rng.int(10, 60);
        const last = a1 + (k - 1) * d;
        const shown = `${arithmetic(a1, d, 3).map(num).join(", ")}, \\ldots, ${num(last)}`;
        return numberProblem({
          prompt: t(`How many terms does the finite arithmetic sequence $${shown}$ have?`, `有限等差数列 $${shown}$ 有多少项？`),
          answer: k,
          wrong: [k - 1, k + 1],
          solution: t(
            `The last term is $a_n = ${num(last)}$ with $a_1 = ${a1}$ and $d = ${d}$: ${steps(`(n - 1) \\cdot ${paren(d)} = ${num(last)} - ${paren(a1)} = ${last - a1}`, `n - 1 = ${k - 1}`, `n = ${k}`)}`,
            `最后一项 $a_n = ${num(last)}$，其中 $a_1 = ${a1}$，$d = ${d}$：${steps(`(n - 1) \\cdot ${paren(d)} = ${num(last)} - ${paren(a1)} = ${last - a1}`, `n - 1 = ${k - 1}`, `n = ${k}`)}`,
          ),
        });
      },
    },
  ],
};

/** threeTerms draws three consecutive terms of an arithmetic sequence written as linear expressions in x. */
function threeTerms(rng: Rng) {
  let a: number;
  let b: number;
  let c: number;
  let e: number;
  let f: number;
  let g: number;
  let x: number;
  do {
    a = rng.nonZero(-3, 6);
    c = rng.nonZero(-3, 6);
    f = rng.nonZero(-3, 6);
    b = rng.int(-9, 9);
    e = rng.int(-9, 9);
    x = rng.nonZero(-8, 8);
    g = 2 * (c * x + e) - (a * x + b) - f * x;
  } while (2 * c - a - f === 0 || Math.abs(g) > 30 || (c - a) * x + e - b === 0 || a === c || c === f);
  const first = linear(a, b);
  const middle = linear(c, e);
  const third = linear(f, g);
  const values = [a * x + b, c * x + e, f * x + g];
  const work = steps(
    `(${middle}) - (${first}) = (${third}) - (${middle})`,
    `${linear(c - a, e - b)} = ${linear(f - c, g - e)}`,
    `x = ${x}`,
  );
  return { a, b, c, e, f, g, x, first, middle, third, values, work, d: values[1]! - values[0]! };
}

export const solvingForVariablesInArithmeticSequences: TopicDef = {
  id: "solving-for-variables-in-arithmetic-sequences",
  title: t("Solving for Variables in Arithmetic Sequences", "等差数列中求未知数"),
  summary: t(
    "Find the unknown when consecutive terms of an arithmetic sequence are given as expressions.",
    "当等差数列的相邻项用式子表示时，求未知数。",
  ),
  prerequisites: ["arithmetic-sequences", "equations-with-parentheses"],
  encompasses: [
    { topic: "equations-with-parentheses", weight: 0.4 },
    { topic: "arithmetic-sequences", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.LE.A.2", "CCSS.HSA.REI.B.3"],
  knowledgePoints: [
    {
      id: "equal-differences",
      title: t("Setting the differences equal", "令两个差相等"),
      explanation: t(
        "Three consecutive terms of an arithmetic sequence have equal differences: second minus first equals third minus second. If $x + 1$, $2x + 3$ and $4x - 1$ are consecutive terms:\n\n$$(2x + 3) - (x + 1) = (4x - 1) - (2x + 3) \\;\\Rightarrow\\; x + 2 = 2x - 4 \\;\\Rightarrow\\; x = 6.$$\n\nKeep the parentheses: the minus sign applies to every term of the expression subtracted.",
        "等差数列中相邻三项的差相等：第二项减第一项等于第三项减第二项。若 $x + 1$，$2x + 3$，$4x - 1$ 是相邻的三项：\n\n$$(2x + 3) - (x + 1) = (4x - 1) - (2x + 3) \\;\\Rightarrow\\; x + 2 = 2x - 4 \\;\\Rightarrow\\; x = 6.$$\n\n保留括号：减号作用于被减式子的每一项。",
      ),
      keyPrerequisites: ["equations-with-parentheses"],
      generate(rng) {
        const s = threeTerms(rng);
        return numberProblem({
          prompt: t(
            `The expressions $${s.first}$, $${s.middle}$ and $${s.third}$ are consecutive terms of an arithmetic sequence. Find $x$.`,
            `式子 $${s.first}$，$${s.middle}$，$${s.third}$ 是一个等差数列中相邻的三项。求 $x$。`,
          ),
          answer: s.x,
          solveFor: "x",
          wrong: [Q.of(s.g - s.b, 2 * s.c - s.a - s.f), -s.x],
          solution: t(`The differences between consecutive terms are equal: ${s.work}`, `相邻两项的差相等：${s.work}`),
        });
      },
    },
    {
      id: "terms-after-solving",
      title: t("Finding terms after solving", "求出未知数后求项"),
      explanation: t(
        "Once $x$ is known, substitute it to get the actual terms. With $x = 6$, the terms $x + 1$, $2x + 3$, $4x - 1$ are $7, 15, 23$: the common difference is $8$ and the next term is $31$.",
        "求出 $x$ 后，把它代入得到各项的实际值。当 $x = 6$ 时，$x + 1$，$2x + 3$，$4x - 1$ 分别是 $7, 15, 23$：公差是 $8$，下一项是 $31$。",
      ),
      generate(rng) {
        const s = threeTerms(rng);
        const [v1, v2, v3] = s.values as [number, number, number];
        const askNext = rng.bool();
        const values = `${v1}, ${v2}, ${v3}`;
        return numberProblem({
          prompt: askNext
            ? t(
                `The expressions $${s.first}$, $${s.middle}$ and $${s.third}$ are consecutive terms of an arithmetic sequence. Find the term that comes after them.`,
                `式子 $${s.first}$，$${s.middle}$，$${s.third}$ 是一个等差数列中相邻的三项。求它们之后的那一项。`,
              )
            : t(
                `The expressions $${s.first}$, $${s.middle}$ and $${s.third}$ are consecutive terms of an arithmetic sequence. Find the common difference.`,
                `式子 $${s.first}$，$${s.middle}$，$${s.third}$ 是一个等差数列中相邻的三项。求公差。`,
              ),
          answer: askNext ? v3 + s.d : s.d,
          wrong: askNext ? [v3, s.x, v3 - s.d] : [s.x, -s.d, v2],
          solution: t(
            `First find $x$: ${s.work}The terms are $${values}$, so $d = ${s.d}$${askNext ? ` and the next term is $${v3}${plus(s.d)} = ${v3 + s.d}$` : ""}.`,
            `先求 $x$：${s.work}各项为 $${values}$，所以 $d = ${s.d}$${askNext ? `，下一项是 $${v3}${plus(s.d)} = ${v3 + s.d}$` : ""}。`,
          ),
        });
      },
    },
  ],
};

/** Story is a situation described by an arithmetic sequence. */
interface Story {
  /** draw picks the first term, the common difference and the largest index asked about. */
  draw(rng: Rng): { a1: number; d: number; kMax: number };
  intro(a1: number, d: number): Text;
  data(p: number, x: number, q: number, y: number): Text;
  ask(k: number): Text;
  which(v: number): Text;
}

const stories: readonly Story[] = [
  {
    draw: (rng) => ({ a1: rng.int(10, 30), d: rng.int(2, 5), kMax: 35 }),
    intro: (a1, d) =>
      t(
        `The first row of a theater has ${a1} seats, and each row has ${d} more seats than the row in front of it.`,
        `某剧院第一排有 ${a1} 个座位，每一排比前一排多 ${d} 个座位。`,
      ),
    data: (p, x, q, y) =>
      t(
        `The rows of a theater have seat counts that form an arithmetic sequence. Row ${p} has ${x} seats and row ${q} has ${y} seats.`,
        `某剧院各排的座位数构成等差数列。第 ${p} 排有 ${x} 个座位，第 ${q} 排有 ${y} 个座位。`,
      ),
    ask: (k) => t(`How many seats are in row ${k}?`, `第 ${k} 排有多少个座位？`),
    which: (v) => t(`Which row has ${v} seats?`, `哪一排有 ${v} 个座位？`),
  },
  {
    draw: (rng) => ({ a1: rng.int(5, 20), d: rng.int(2, 10), kMax: 52 }),
    intro: (a1, d) =>
      t(
        `In week 1, Mia puts ${a1} dollars into her savings box, and each week after that she puts in ${d} dollars more than the week before.`,
        `第 1 周，小米往存钱罐里放了 ${a1} 元，此后每周都比前一周多放 ${d} 元。`,
      ),
    data: (p, x, q, y) =>
      t(
        `Each week Mia puts the same amount more into her savings box than the week before. In week ${p} she puts in ${x} dollars, and in week ${q} she puts in ${y} dollars.`,
        `小米每周往存钱罐里放的钱都比前一周多同样的数目。第 ${p} 周她放了 ${x} 元，第 ${q} 周放了 ${y} 元。`,
      ),
    ask: (k) => t(`How many dollars does she put in during week ${k}?`, `第 ${k} 周她放了多少元？`),
    which: (v) => t(`In which week does she put in ${v} dollars?`, `她在第几周放了 ${v} 元？`),
  },
  {
    draw: (rng) => ({ a1: rng.int(70, 100), d: rng.int(3, 9), kMax: 30 }),
    intro: (a1, d) =>
      t(
        `One chair is ${a1} cm tall, and each chair added to a stack raises its height by ${d} cm.`,
        `一把椅子高 ${a1} 厘米，每往一摞椅子上叠一把，高度增加 ${d} 厘米。`,
      ),
    data: (p, x, q, y) =>
      t(
        `Each chair added to a stack raises its height by the same amount. A stack of ${p} chairs is ${x} cm tall, and a stack of ${q} chairs is ${y} cm tall.`,
        `每往一摞椅子上叠一把，高度都增加同样的数值。${p} 把椅子叠起来高 ${x} 厘米，${q} 把椅子叠起来高 ${y} 厘米。`,
      ),
    ask: (k) => t(`How tall, in centimeters, is a stack of ${k} chairs?`, `${k} 把椅子叠起来高多少厘米？`),
    which: (v) => t(`How many chairs are in a stack ${v} cm tall?`, `高 ${v} 厘米的一摞椅子有几把？`),
  },
  {
    draw: (rng) => {
      const d = rng.int(4, 15);
      return { a1: d * 40 + rng.int(0, 200), d: -d, kMax: 40 };
    },
    intro: (a1, d) =>
      t(
        `At the end of day 1 of a sale, a store has ${a1} tickets left. It sells ${-d} tickets every day after that.`,
        `促销第 1 天结束时，商店还剩 ${a1} 张票。此后每天卖出 ${-d} 张。`,
      ),
    data: (p, x, q, y) =>
      t(
        `A store sells the same number of tickets every day. At the end of day ${p} it has ${x} tickets left, and at the end of day ${q} it has ${y} left.`,
        `某商店每天卖出同样数量的票。第 ${p} 天结束时还剩 ${x} 张，第 ${q} 天结束时还剩 ${y} 张。`,
      ),
    ask: (k) => t(`How many tickets are left at the end of day ${k}?`, `第 ${k} 天结束时还剩多少张票？`),
    which: (v) => t(`At the end of which day are ${v} tickets left?`, `第几天结束时还剩 ${v} 张票？`),
  },
];

/** sentences joins texts with a space in English and nothing in Chinese. */
const sentences = (a: Text, b: Text): Text => t(`${a.en} ${b.en}`, `${a["zh-CN"]}${b["zh-CN"]}`);

export const modelingWithArithmeticSequences: TopicDef = {
  id: "modeling-with-arithmetic-sequences",
  title: t("Modeling with Arithmetic Sequences", "用等差数列建模"),
  summary: t("Solve problems about quantities that change by the same amount at each step.", "解决每一步都变化相同数量的实际问题。"),
  prerequisites: ["index-of-a-term-in-an-arithmetic-sequence", "arithmetic-sequences-from-two-terms"],
  encompasses: [
    { topic: "index-of-a-term-in-an-arithmetic-sequence", weight: 0.4 },
    { topic: "arithmetic-sequences-from-two-terms", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.BF.A.2", "CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "a-term-in-context",
      title: t("Finding a term in context", "在情境中求某一项"),
      explanation: t(
        "When a quantity changes by the same amount at each step, its values form an arithmetic sequence. Decide what $a_1$ is, then use $a_n = a_1 + (n - 1)d$. If row $1$ of a hall has $20$ seats and each row has $3$ more, row $15$ has\n\n$$20 + 14 \\cdot 3 = 62 \\text{ seats}.$$\n\nRow $15$ is $14$ rows after row $1$.",
        "当一个量每一步都变化相同的数量时，它的取值构成等差数列。先确定 $a_1$ 是什么，再用 $a_n = a_1 + (n - 1)d$。若礼堂第 $1$ 排有 $20$ 个座位，每排多 $3$ 个，则第 $15$ 排有\n\n$$20 + 14 \\cdot 3 = 62 \\text{ 个座位}.$$\n\n第 $15$ 排在第 $1$ 排之后 $14$ 排。",
      ),
      generate(rng) {
        const story = rng.pick(stories);
        const { a1, d, kMax } = story.draw(rng);
        const k = rng.int(8, kMax);
        const ak = a1 + (k - 1) * d;
        return numberProblem({
          prompt: sentences(story.intro(a1, d), story.ask(k)),
          answer: ak,
          wrong: [a1 + k * d, (k - 1) * d, a1 - (k - 1) * d],
          solution: t(
            `The values form an arithmetic sequence with $a_1 = ${a1}$ and $d = ${d}$: ${steps(`a_{${k}} = ${a1} + ${k - 1} \\cdot ${paren(d)} = ${ak}`)}`,
            `这些值构成等差数列，$a_1 = ${a1}$，$d = ${d}$：${steps(`a_{${k}} = ${a1} + ${k - 1} \\cdot ${paren(d)} = ${ak}`)}`,
          ),
        });
      },
    },
    {
      id: "when-a-value-is-reached",
      title: t("When a value is reached", "何时达到某个值"),
      explanation: t(
        "To find when a quantity reaches a value, solve $a_1 + (n - 1)d = \\text{value}$ for $n$. With $20$ seats in row $1$ and $3$ more in each row, the row with $77$ seats is\n\n$$20 + (n - 1) \\cdot 3 = 77 \\;\\Rightarrow\\; n - 1 = 19 \\;\\Rightarrow\\; n = 20.$$",
        "要求一个量何时达到某个值，解方程 $a_1 + (n - 1)d = \\text{该值}$，求出 $n$。第 $1$ 排有 $20$ 个座位、每排多 $3$ 个时，有 $77$ 个座位的是\n\n$$20 + (n - 1) \\cdot 3 = 77 \\;\\Rightarrow\\; n - 1 = 19 \\;\\Rightarrow\\; n = 20.$$",
      ),
      generate(rng) {
        const story = rng.pick(stories);
        const { a1, d, kMax } = story.draw(rng);
        const k = rng.int(8, kMax);
        const v = a1 + (k - 1) * d;
        return numberProblem({
          prompt: sentences(story.intro(a1, d), story.which(v)),
          answer: k,
          wrong: [k - 1, k + 1],
          solution: t(
            `The values form an arithmetic sequence with $a_1 = ${a1}$ and $d = ${d}$: ${steps(`${a1} + (n - 1) \\cdot ${paren(d)} = ${v}`, `n - 1 = ${k - 1}`, `n = ${k}`)}`,
            `这些值构成等差数列，$a_1 = ${a1}$，$d = ${d}$：${steps(`${a1} + (n - 1) \\cdot ${paren(d)} = ${v}`, `n - 1 = ${k - 1}`, `n = ${k}`)}`,
          ),
        });
      },
    },
    {
      id: "models-from-two-data-points",
      title: t("Models from two data points", "由两个数据建模"),
      explanation: t(
        "Sometimes only two values are known. Their difference, divided by the number of steps between them, is $d$. If row $4$ has $30$ seats and row $10$ has $48$, then $6d = 18$, $d = 3$, and row $25$ has\n\n$$48 + 15 \\cdot 3 = 93 \\text{ seats}.$$",
        "有时只知道两个值。它们的差除以两者之间的步数就是 $d$。若第 $4$ 排有 $30$ 个座位，第 $10$ 排有 $48$ 个，则 $6d = 18$，$d = 3$，第 $25$ 排有\n\n$$48 + 15 \\cdot 3 = 93 \\text{ 个座位}.$$",
      ),
      generate(rng) {
        const story = rng.pick(stories);
        const { a1, d, kMax } = story.draw(rng);
        const p = rng.int(2, 6);
        const q = p + rng.int(2, 8);
        const k = rng.int(q + 3, Math.max(q + 3, kMax));
        const x = a1 + (p - 1) * d;
        const y = a1 + (q - 1) * d;
        const ak = a1 + (k - 1) * d;
        return numberProblem({
          prompt: sentences(story.data(p, x, q, y), story.ask(k)),
          answer: ak,
          wrong: [y + (k - 1) * d, x + (k - 1) * d, a1 + k * d],
          solution: t(
            `The values form an arithmetic sequence: ${differenceSteps(p, x, q, y)}From $a_{${q}}$ to $a_{${k}}$ there are $${k - q}$ steps: ${steps(`a_{${k}} = ${y} + ${k - q} \\cdot ${paren(d)} = ${ak}`)}`,
            `这些值构成等差数列：${differenceSteps(p, x, q, y)}从 $a_{${q}}$ 到 $a_{${k}}$ 共 $${k - q}$ 步：${steps(`a_{${k}} = ${y} + ${k - q} \\cdot ${paren(d)} = ${ak}`)}`,
          ),
        });
      },
    },
  ],
};

/** classes are the options of a classification of a sequence. */
const classes: readonly Text[] = [t("Arithmetic", "等差数列"), t("Geometric", "等比数列"), t("Neither", "都不是")];

/** classify tells whether terms are arithmetic (0), geometric (1) or neither (2). */
function classify(terms: readonly Q[]): number {
  const diffs = terms.slice(1).map((x, i) => x.sub(terms[i]!));
  if (diffs.every((x) => x.eq(diffs[0]!))) return 0;
  if (terms.some((x) => x.isZero())) return 2;
  const quotients = terms.slice(1).map((x, i) => x.div(terms[i]!));
  return quotients.every((x) => x.eq(quotients[0]!)) ? 1 : 2;
}

/** ratioSteps writes how the ratio follows from two consecutive terms. */
const ratioSteps = (a1: Q, a2: Q) => steps(`r = \\frac{${a2.toLatex()}}{${a1.toLatex()}} = ${a2.div(a1).toLatex()}`);

export const geometricSequences: TopicDef = {
  id: "geometric-sequences",
  title: t("Geometric Sequences", "等比数列"),
  summary: t("Recognize geometric sequences, find the common ratio and continue the sequence.", "识别等比数列，求公比并写出后续的项。"),
  prerequisites: ["arithmetic-sequences", "operations-with-rational-numbers"],
  encompasses: [
    { topic: "arithmetic-sequences", weight: 0.2 },
    { topic: "operations-with-rational-numbers", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.IF.A.3", "CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "identifying-geometric-sequences",
      title: t("Arithmetic, geometric or neither", "等差、等比还是都不是"),
      explanation: t(
        "A sequence is **geometric** when each term is the previous one **multiplied** by the same number, the **common ratio** $r$. Test it by dividing each term by the one before:\n\n$$3, 6, 12, 24: \\quad \\frac{6}{3} = \\frac{12}{6} = \\frac{24}{12} = 2 \\quad \\text{geometric}.$$\n\nAn arithmetic sequence adds the same number; a geometric one multiplies by the same number. Many sequences are neither: $1, 4, 9, 16$ has differences $3, 5, 7$ and ratios $4, \\frac{9}{4}, \\frac{16}{9}$.",
        "如果每一项都是前一项**乘以**同一个数，这个数列就是**等比数列**，这个数叫做**公比** $r$。检验时用每一项除以它的前一项：\n\n$$3, 6, 12, 24: \\quad \\frac{6}{3} = \\frac{12}{6} = \\frac{24}{12} = 2 \\quad \\text{等比}.$$\n\n等差数列每次加同一个数，等比数列每次乘同一个数。很多数列两者都不是：$1, 4, 9, 16$ 的差是 $3, 5, 7$，比是 $4, \\frac{9}{4}, \\frac{16}{9}$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        let terms: Q[];
        if (kind === 0) {
          terms = arithmetic(rng.int(-20, 30), rng.nonZero(-12, 12), 5).map((x) => Q.of(x));
        } else if (kind === 1) {
          const r = rng.pick(ratios);
          terms = geometric(geometricStart(rng, r, 5, 3), r, 5);
        } else if (rng.bool()) {
          const c = rng.int(-10, 10);
          terms = Array.from({ length: 5 }, (_, i) => Q.of((i + 1) ** 2 + c));
        } else {
          const r = rng.pick([2, 3, -2]);
          const s = rng.nonZero(-5, 5);
          const i = rng.int(2, 4);
          terms = Array.from({ length: 5 }, (_, j) => Q.of(s * r ** j + (j === i ? rng.nonZero(-3, 3) : 0)));
        }
        const correct = classify(terms);
        const why =
          correct === 0
            ? [
                `each term is the previous one plus $${terms[1]!.sub(terms[0]!).toLatex()}$`,
                `每一项都是前一项加上 $${terms[1]!.sub(terms[0]!).toLatex()}$`,
              ]
            : correct === 1
              ? [
                  `each term is the previous one times $${terms[1]!.div(terms[0]!).toLatex()}$`,
                  `每一项都是前一项乘以 $${terms[1]!.div(terms[0]!).toLatex()}$`,
                ]
              : [
                  "the differences between consecutive terms are not all equal, and neither are the ratios",
                  "相邻两项的差不全相等，比也不全相等",
                ];
        return choiceProblem({
          prompt: t(
            `Is the sequence $${list(terms)}$ arithmetic, geometric, or neither?`,
            `数列 $${list(terms)}$ 是等差数列、等比数列，还是都不是？`,
          ),
          options: classes,
          correct,
          solution: t(
            `It is ${["arithmetic", "geometric", "neither"][correct]}: ${why[0]}.`,
            `${["是等差数列", "是等比数列", "都不是"][correct]}：${why[1]}。`,
          ),
        });
      },
    },
    {
      id: "finding-the-common-ratio",
      title: t("Finding the common ratio", "求公比"),
      explanation: t(
        "The common ratio is a term **divided by the term before it**. For $48, -24, 12, -6, \\ldots$:\n\n$$r = \\frac{-24}{48} = -\\frac{1}{2}.$$\n\nA negative ratio makes the signs alternate; a ratio between $-1$ and $1$ makes the terms shrink toward $0$.",
        "公比等于某一项**除以它的前一项**。对于 $48, -24, 12, -6, \\ldots$：\n\n$$r = \\frac{-24}{48} = -\\frac{1}{2}.$$\n\n公比为负时各项正负交替；公比在 $-1$ 与 $1$ 之间时各项逐渐趋近于 $0$。",
      ),
      keyPrerequisites: ["operations-with-rational-numbers"],
      generate(rng) {
        const r = rng.pick(ratios);
        const terms = geometric(geometricStart(rng, r, 4, 9), r, 4);
        return numberProblem({
          prompt: t(`Find the common ratio of the geometric sequence $${list(terms)}$`, `求等比数列 $${list(terms)}$ 的公比。`),
          answer: r,
          wrong: [terms[1]!.sub(terms[0]!), terms[0]!.div(terms[1]!), r.neg()],
          solution: t(
            `Divide the second term by the first: ${ratioSteps(terms[0]!, terms[1]!)}`,
            `用第二项除以第一项：${ratioSteps(terms[0]!, terms[1]!)}`,
          ),
        });
      },
    },
    {
      id: "continuing-a-geometric-sequence",
      title: t("Continuing a geometric sequence", "写出等比数列的后续项"),
      explanation: t(
        "To continue a geometric sequence, multiply the last term by the common ratio. For $162, 54, 18, \\ldots$, $r = \\frac{1}{3}$, so the next terms are $6$ and $2$. Don't continue it by adding the last difference: $18 - 36 = -18$ would be wrong.",
        "要写出等比数列的后续项，就用最后一项乘以公比。对于 $162, 54, 18, \\ldots$，$r = \\frac{1}{3}$，所以后面两项是 $6$ 和 $2$。不要用加上最后一个差的方法：$18 - 36 = -18$ 是错的。",
      ),
      generate(rng) {
        const r = rng.pick(ratios);
        const terms = geometric(geometricStart(rng, r, 5, 9), r, 5);
        const [, , t3, t4, t5] = terms as [Q, Q, Q, Q, Q];
        return numberProblem({
          prompt: t(
            `Find the next term of the geometric sequence $${list(terms.slice(0, 4))}$`,
            `求等比数列 $${list(terms.slice(0, 4))}$ 的下一项。`,
          ),
          answer: t5,
          wrong: [t4.add(t4.sub(t3)), t4.div(r), t5.neg()],
          solution: t(
            `First find the ratio: ${ratioSteps(terms[0]!, terms[1]!)}Multiply the last term by the ratio: $${t4.toLatex()} \\cdot ${base(r)} = ${t5.toLatex()}$.`,
            `先求公比：${ratioSteps(terms[0]!, terms[1]!)}用最后一项乘以公比：$${t4.toLatex()} \\cdot ${base(r)} = ${t5.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** termRatio draws a common ratio and a first term whose term of index k stays moderate. */
function termRatio(rng: Rng): { a1: Q; r: Q; k: number } {
  if (rng.bool(0.65)) {
    const r = rng.pick([2, -2, 3, -3, 4, 5]);
    return { a1: Q.of(rng.nonZero(-6, 6)), r: Q.of(r), k: rng.int(5, Math.max(5, maxIndex(r, 500))) };
  }
  const r = rng.pick([Q.of(1, 2), Q.of(-1, 2), Q.of(1, 3)]);
  const k = rng.int(5, 7);
  return { a1: Q.of(rng.sign() * rng.int(1, 5) * Number(r.d) ** rng.int(2, k - 1)), r, k };
}

export const nthTermOfAGeometricSequence: TopicDef = {
  id: "nth-term-of-a-geometric-sequence",
  title: t("The Nth Term of a Geometric Sequence", "等比数列的通项"),
  summary: t("Use and write the explicit formula $a_n = a_1 r^{n-1}$.", "使用并写出通项公式 $a_n = a_1 r^{n-1}$。"),
  prerequisites: ["geometric-sequences", "powers-of-rational-numbers"],
  encompasses: [
    { topic: "geometric-sequences", weight: 0.5 },
    { topic: "powers-of-rational-numbers", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.A.2", "CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "the-explicit-formula",
      title: t("The explicit formula", "通项公式"),
      explanation: t(
        "To reach $a_n$ from $a_1$, multiply by the common ratio $n - 1$ times:\n\n$$a_n = a_1 \\cdot r^{n-1}.$$\n\nFor $5, 15, 45, \\ldots$: $a_n = 5 \\cdot 3^{n-1}$. The exponent is $n - 1$, not $n$, because $a_1$ itself is not multiplied at all. A negative or fractional ratio goes in parentheses: $a_n = 4 \\cdot \\left(-\\frac{1}{2}\\right)^{n-1}$.",
        "从 $a_1$ 到 $a_n$，要乘以公比 $n - 1$ 次：\n\n$$a_n = a_1 \\cdot r^{n-1}.$$\n\n对于 $5, 15, 45, \\ldots$：$a_n = 5 \\cdot 3^{n-1}$。指数是 $n - 1$ 而不是 $n$，因为 $a_1$ 本身没有乘公比。负数或分数公比要加括号：$a_n = 4 \\cdot \\left(-\\frac{1}{2}\\right)^{n-1}$。",
      ),
      generate(rng) {
        const r = rng.pick(ratios.filter((x) => !x.eq(Q.one.neg())));
        const a1 = geometricStart(rng, r, 4, 9);
        const correct = geometricExplicit(a1, r, -1);
        return formulaChoice(
          rng,
          t(
            `Which formula gives the $n$th term of the geometric sequence $${list(correct.terms.slice(0, 4))}$?`,
            `哪个公式给出等比数列 $${list(correct.terms.slice(0, 4))}$ 的第 $n$ 项？`,
          ),
          correct,
          [geometricExplicit(a1, r, 0), geometricExplicit(r, a1, -1), arithmeticExplicit(a1, r), geometricExplicit(a1.mul(r), r, -1)],
          t(
            `Here $a_1 = ${a1.toLatex()}$ and $r = ${r.toLatex()}$, so $${correct.latex}$.`,
            `这里 $a_1 = ${a1.toLatex()}$，$r = ${r.toLatex()}$，所以 $${correct.latex}$。`,
          ),
        );
      },
    },
    {
      id: "finding-a-term",
      title: t("Finding a term", "求某一项"),
      explanation: t(
        "Substitute into $a_n = a_1 r^{n-1}$ and evaluate the power first. For $a_1 = -3$ and $r = 2$:\n\n$$a_6 = -3 \\cdot 2^{5} = -3 \\cdot 32 = -96.$$\n\nWith a negative ratio, an even exponent gives a positive power and an odd one a negative power.",
        "代入 $a_n = a_1 r^{n-1}$，先计算乘方。当 $a_1 = -3$，$r = 2$ 时：\n\n$$a_6 = -3 \\cdot 2^{5} = -3 \\cdot 32 = -96.$$\n\n公比为负时，偶数次幂为正，奇数次幂为负。",
      ),
      keyPrerequisites: ["powers-of-rational-numbers"],
      generate(rng) {
        const { a1, r, k } = termRatio(rng);
        const ak = a1.mul(r.pow(k - 1));
        const terms = geometric(a1, r, 3);
        const given = rng.bool()
          ? [`the geometric sequence $${list(terms)}$`, `等比数列 $${list(terms)}$`]
          : [
              `the geometric sequence with first term $${a1.toLatex()}$ and common ratio $${r.toLatex()}$`,
              `首项为 $${a1.toLatex()}$、公比为 $${r.toLatex()}$ 的等比数列`,
            ];
        return numberProblem({
          prompt: t(`Find the ${ordinal(k)} term of ${given[0]}.`, `求${given[1]}的第 ${k} 项。`),
          answer: ak,
          wrong: [a1.mul(r.pow(k)), a1.mul(r).pow(k - 1), ak.neg()],
          solution: t(
            `${steps(`a_{${k}} = ${paren(a1)} \\cdot ${base(r)}^{${k - 1}} = ${paren(a1)} \\cdot ${paren(r.pow(k - 1))} = ${ak.toLatex()}`)}`,
            `${steps(`a_{${k}} = ${paren(a1)} \\cdot ${base(r)}^{${k - 1}} = ${paren(a1)} \\cdot ${paren(r.pow(k - 1))} = ${ak.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "evaluating-explicit-formulas",
      title: t("Evaluating explicit formulas", "由通项公式求项"),
      explanation: t(
        "An explicit formula may use $r^{n}$ or $r^{n+1}$ instead of $r^{n-1}$. Substitute the index exactly as written. For $a_n = 3 \\cdot 2^{n}$:\n\n$$a_4 = 3 \\cdot 2^{4} = 48.$$\n\nMultiply only after evaluating the power: $3 \\cdot 2^{4}$ is not $6^{4}$.",
        "通项公式中也可能是 $r^{n}$ 或 $r^{n+1}$ 而不是 $r^{n-1}$。按公式原样代入下标。对于 $a_n = 3 \\cdot 2^{n}$：\n\n$$a_4 = 3 \\cdot 2^{4} = 48.$$\n\n先算乘方再相乘：$3 \\cdot 2^{4}$ 不是 $6^{4}$。",
      ),
      keyPrerequisites: ["powers-of-rational-numbers"],
      generate(rng) {
        const { a1: c, r, k } = termRatio(rng);
        const shift = rng.pick([-1, 0, 1]);
        const kk = k - 1 - shift;
        const value = c.mul(r.pow(kk + shift));
        const expr = times(c, `${base(r)}^{${exponent(shift)}}`);
        return numberProblem({
          prompt: t(`Given $a_n = ${expr}$, find $a_{${kk}}$.`, `已知 $a_n = ${expr}$，求 $a_{${kk}}$。`),
          answer: value,
          wrong: [c.mul(r.pow(kk - 1)), c.mul(r.pow(kk)), c.mul(r.pow(kk + 1)), c.mul(r).pow(kk + shift)],
          solution: t(
            `Substitute $n = ${kk}$: ${steps(`a_{${kk}} = ${times(c, `${base(r)}^{${kk + shift}}`)} = ${value.toLatex()}`)}`,
            `代入 $n = ${kk}$：${steps(`a_{${kk}} = ${times(c, `${base(r)}^{${kk + shift}}`)} = ${value.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
};

export const recursiveFormulasForGeometricSequences: TopicDef = {
  id: "recursive-formulas-for-geometric-sequences",
  title: t("Recursive Formulas for Geometric Sequences", "等比数列的递推公式"),
  summary: t(
    "Write and use $a_1 = \\ldots$, $a_n = r a_{n-1}$, and translate between explicit and recursive formulas.",
    "写出并运用 $a_1 = \\ldots$，$a_n = r a_{n-1}$，并在通项公式与递推公式之间转换。",
  ),
  prerequisites: ["nth-term-of-a-geometric-sequence", "recursive-formulas-for-arithmetic-sequences"],
  encompasses: [
    { topic: "nth-term-of-a-geometric-sequence", weight: 0.4 },
    { topic: "recursive-sequences", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.A.2"],
  knowledgePoints: [
    {
      id: "writing-the-recursive-formula",
      title: t("Writing the recursive formula", "写出递推公式"),
      explanation: t(
        "Every geometric sequence has a recursive formula of the same shape: the first term, and the rule *multiply by the common ratio*.\n\n$$a_1 = \\text{first term}, \\qquad a_n = r \\cdot a_{n-1}.$$\n\nFor $2, -6, 18, \\ldots$: $a_1 = 2$ and $a_n = -3a_{n-1}$.",
        "每个等比数列的递推公式都有相同的形式：第一项，以及规则*乘以公比*。\n\n$$a_1 = \\text{首项}, \\qquad a_n = r \\cdot a_{n-1}.$$\n\n对于 $2, -6, 18, \\ldots$：$a_1 = 2$，$a_n = -3a_{n-1}$。",
      ),
      generate(rng) {
        const r = rng.pick(ratios.filter((x) => !x.eq(Q.one.neg())));
        const a1 = geometricStart(rng, r, 4, 9);
        const correct = geometricRecursive(a1, r);
        return formulaChoice(
          rng,
          t(
            `Which recursive formula defines the sequence $${list(correct.terms.slice(0, 4))}$?`,
            `哪个递推公式定义了数列 $${list(correct.terms.slice(0, 4))}$？`,
          ),
          correct,
          [
            arithmeticRecursive(a1, r),
            geometricRecursive(a1, Q.one.div(r)),
            geometricRecursive(a1.mul(r), r),
            geometricRecursive(a1, r.neg()),
          ],
          t(
            `The first term is $${a1.toLatex()}$ and each term is the previous one times $${r.toLatex()}$, so $${correct.latex}$.`,
            `首项是 $${a1.toLatex()}$，每一项都是前一项乘以 $${r.toLatex()}$，所以 $${correct.latex}$。`,
          ),
        );
      },
    },
    {
      id: "terms-from-the-recursive-formula",
      title: t("Terms from the recursive formula", "由递推公式求项"),
      explanation: t(
        "From $a_1$ to $a_k$ the rule multiplies by $r$ a total of $k - 1$ times, so $a_k = a_1 r^{k-1}$. Going backward, divide by $r$ instead: if $a_n = 2a_{n-1}$ and $a_4 = 40$, then $a_1 = \\frac{40}{2^{3}} = 5$.",
        "从 $a_1$ 到 $a_k$，规则共乘以 $r$ $k - 1$ 次，所以 $a_k = a_1 r^{k-1}$。向前倒推时改为除以 $r$：若 $a_n = 2a_{n-1}$ 且 $a_4 = 40$，则 $a_1 = \\frac{40}{2^{3}} = 5$。",
      ),
      generate(rng) {
        const { a1, r, k } = termRatio(rng);
        const ak = a1.mul(r.pow(k - 1));
        const rule = poly([r, "a_{n-1}"]);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `A sequence is defined by $a_1 = ${a1.toLatex()}$ and $a_n = ${rule}$. Find $a_{${k}}$.`,
              `数列由 $a_1 = ${a1.toLatex()}$ 和 $a_n = ${rule}$ 定义。求 $a_{${k}}$。`,
            ),
            answer: ak,
            wrong: [a1.mul(r.pow(k)), a1.mul(r.pow(k - 2)), a1.add(r.mul(Q.of(k - 1)))],
            solution: t(
              `The rule multiplies by $${r.toLatex()}$ a total of $${k - 1}$ times: ${steps(`a_{${k}} = ${paren(a1)} \\cdot ${base(r)}^{${k - 1}} = ${ak.toLatex()}`)}`,
              `规则共乘以 $${r.toLatex()}$ $${k - 1}$ 次：${steps(`a_{${k}} = ${paren(a1)} \\cdot ${base(r)}^{${k - 1}} = ${ak.toLatex()}`)}`,
            ),
          });
        }
        const m = Math.min(k, 5);
        const am = a1.mul(r.pow(m - 1));
        return numberProblem({
          prompt: t(
            `A sequence satisfies $a_n = ${rule}$ and $a_{${m}} = ${am.toLatex()}$. Find $a_1$.`,
            `数列满足 $a_n = ${rule}$，且 $a_{${m}} = ${am.toLatex()}$。求 $a_1$。`,
          ),
          answer: a1,
          wrong: [am.mul(r.pow(m - 1)), am.div(r.pow(m)), am.div(r)],
          solution: t(
            `Going back from $a_{${m}}$ to $a_1$ divides by $${r.toLatex()}$ a total of $${m - 1}$ times: ${steps(`a_1 = \\frac{${am.toLatex()}}{${base(r)}^{${m - 1}}} = ${a1.toLatex()}`)}`,
            `从 $a_{${m}}$ 倒推到 $a_1$ 共除以 $${r.toLatex()}$ $${m - 1}$ 次：${steps(`a_1 = \\frac{${am.toLatex()}}{${base(r)}^{${m - 1}}} = ${a1.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "recursive-to-explicit",
      title: t("From recursive to explicit", "由递推公式到通项公式"),
      explanation: t(
        "A recursive formula $a_1 = a$, $a_n = r a_{n-1}$ gives the first term and the ratio directly; substitute them into $a_n = a_1 r^{n-1}$:\n\n$$a_1 = 7, \\; a_n = -2a_{n-1} \\quad\\Longrightarrow\\quad a_n = 7 \\cdot (-2)^{n-1}.$$",
        "递推公式 $a_1 = a$，$a_n = r a_{n-1}$ 直接给出首项和公比，把它们代入 $a_n = a_1 r^{n-1}$：\n\n$$a_1 = 7, \\; a_n = -2a_{n-1} \\quad\\Longrightarrow\\quad a_n = 7 \\cdot (-2)^{n-1}.$$",
      ),
      generate(rng) {
        const r = rng.pick(ratios.filter((x) => !x.eq(Q.one.neg())));
        const a1 = Q.of(rng.nonZero(-9, 9));
        const correct = geometricExplicit(a1, r, -1);
        const rule = poly([r, "a_{n-1}"]);
        return formulaChoice(
          rng,
          t(
            `A sequence is defined by $a_1 = ${a1.toLatex()}$ and $a_n = ${rule}$. Which is an explicit formula for it?`,
            `数列由 $a_1 = ${a1.toLatex()}$ 和 $a_n = ${rule}$ 定义。下列哪个是它的通项公式？`,
          ),
          correct,
          [geometricExplicit(a1, r, 0), geometricExplicit(r, a1, -1), arithmeticExplicit(a1, r), geometricExplicit(a1, r.neg(), -1)],
          t(
            `The first term is $${a1.toLatex()}$ and the ratio is $${r.toLatex()}$, so $${correct.latex}$.`,
            `首项是 $${a1.toLatex()}$，公比是 $${r.toLatex()}$，所以 $${correct.latex}$。`,
          ),
        );
      },
    },
    {
      id: "explicit-to-recursive",
      title: t("From explicit to recursive", "由通项公式到递推公式"),
      explanation: t(
        "From an explicit formula, the ratio is the base of the power, and the first term comes from substituting $n = 1$. Careful when the exponent is not $n - 1$:\n\n$$a_n = 5 \\cdot 3^{n}: \\quad a_1 = 5 \\cdot 3^{1} = 15 \\quad\\Longrightarrow\\quad a_1 = 15, \\; a_n = 3a_{n-1}.$$",
        "由通项公式，公比是幂的底数，首项由代入 $n = 1$ 得到。指数不是 $n - 1$ 时要小心：\n\n$$a_n = 5 \\cdot 3^{n}: \\quad a_1 = 5 \\cdot 3^{1} = 15 \\quad\\Longrightarrow\\quad a_1 = 15, \\; a_n = 3a_{n-1}.$$",
      ),
      generate(rng) {
        const r = rng.pick(ratios.filter((x) => !x.eq(Q.one.neg())));
        const shift = rng.pick([-1, 0, 0, 1]);
        const c = Q.of(rng.nonZero(-9, 9)).mul(Q.of(r.d).pow(shift + 1));
        const a1 = c.mul(r.pow(shift + 1));
        const correct = geometricRecursive(a1, r);
        const expr = times(c, `${base(r)}^{${exponent(shift)}}`);
        return formulaChoice(
          rng,
          t(`Which recursive formula defines the sequence $a_n = ${expr}$?`, `哪个递推公式定义了数列 $a_n = ${expr}$？`),
          correct,
          [geometricRecursive(c, r), geometricRecursive(a1, c), arithmeticRecursive(a1, r), geometricRecursive(r, c)],
          t(
            `The ratio is the base, $${r.toLatex()}$, and $a_1 = ${times(c, `${base(r)}^{${1 + shift}}`)} = ${a1.toLatex()}$, so $${correct.latex}$.`,
            `公比是底数 $${r.toLatex()}$，且 $a_1 = ${times(c, `${base(r)}^{${1 + shift}}`)} = ${a1.toLatex()}$，所以 $${correct.latex}$。`,
          ),
        );
      },
    },
  ],
};

/** twoGeometricTerms draws a geometric sequence and two of its terms a_p and a_q, q - p being 2 or 3. */
function twoGeometricTerms(rng: Rng, pMin: number) {
  const r = rng.pick([2, 3, -2, -3].map((x) => Q.of(x)).concat([Q.of(1, 2), Q.of(-1, 2), Q.of(1, 3)]));
  const gap = rng.int(2, 3);
  const p = rng.int(pMin, 4);
  const q = p + gap;
  const a1 = Q.of(rng.sign() * rng.int(1, 6) * Number(r.d) ** (q - 1));
  const x = a1.mul(r.pow(p - 1));
  const y = a1.mul(r.pow(q - 1));
  const sign: Text =
    gap % 2 === 0
      ? r.sign() > 0
        ? t(" The common ratio is positive.", "公比为正数。")
        : t(" The common ratio is negative.", "公比为负数。")
      : t("", "");
  return { r, gap, p, q, a1, x, y, sign };
}

/** rootSteps writes how r follows from r^gap = y / x. */
function rootSteps(gap: number, x: Q, y: Q, r: Q): string {
  return steps(`r^{${gap}} = \\frac{${y.toLatex()}}{${x.toLatex()}} = ${y.div(x).toLatex()}`, `r = ${r.toLatex()}`);
}

/** givenGeometric writes the prompt's data: two terms and, for an even gap, the sign of the ratio. */
const givenGeometric = (s: ReturnType<typeof twoGeometricTerms>, en: string, zh: string): Text =>
  t(
    `A geometric sequence has $a_{${s.p}} = ${s.x.toLatex()}$ and $a_{${s.q}} = ${s.y.toLatex()}$.${s.sign.en} ${en}`,
    `等比数列中 $a_{${s.p}} = ${s.x.toLatex()}$，$a_{${s.q}} = ${s.y.toLatex()}$。${s.sign["zh-CN"]}${zh}`,
  );

export const geometricSequencesFromTwoTerms: TopicDef = {
  id: "geometric-sequences-from-two-terms",
  title: t("Geometric Sequences from Two Terms", "由两项确定等比数列"),
  summary: t(
    "Find the common ratio, the first term and other terms from two terms of a geometric sequence.",
    "由等比数列的两项求公比、首项和其他项。",
  ),
  prerequisites: ["nth-term-of-a-geometric-sequence", "square-roots-and-cube-roots"],
  encompasses: [
    { topic: "nth-term-of-a-geometric-sequence", weight: 0.5 },
    { topic: "square-roots-and-cube-roots", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "common-ratio-from-two-terms",
      title: t("The common ratio from two terms", "由两项求公比"),
      explanation: t(
        "From $a_p$ to $a_q$ the sequence is multiplied by $r$ a total of $q - p$ times, so\n\n$$r^{q-p} = \\frac{a_q}{a_p}.$$\n\nIf $a_2 = 6$ and $a_5 = 162$: $r^{3} = 27$, so $r = 3$. With an even power there are two roots: $r^{2} = 16$ gives $r = 4$ or $r = -4$, so the problem must say which sign the ratio has.",
        "从 $a_p$ 到 $a_q$，数列共乘以 $r$ $q - p$ 次，所以\n\n$$r^{q-p} = \\frac{a_q}{a_p}.$$\n\n若 $a_2 = 6$，$a_5 = 162$：$r^{3} = 27$，所以 $r = 3$。偶数次幂有两个根：$r^{2} = 16$ 得 $r = 4$ 或 $r = -4$，所以题目必须说明公比的正负。",
      ),
      keyPrerequisites: ["square-roots-and-cube-roots"],
      generate(rng) {
        const s = twoGeometricTerms(rng, 1);
        return numberProblem({
          prompt: givenGeometric(s, "Find the common ratio.", "求公比。"),
          answer: s.r,
          wrong: [s.y.div(s.x), s.y.sub(s.x).div(Q.of(s.gap)), s.r.neg()],
          solution: t(
            `There are $${s.gap}$ steps from $a_{${s.p}}$ to $a_{${s.q}}$: ${rootSteps(s.gap, s.x, s.y, s.r)}`,
            `从 $a_{${s.p}}$ 到 $a_{${s.q}}$ 共 $${s.gap}$ 步：${rootSteps(s.gap, s.x, s.y, s.r)}`,
          ),
        });
      },
    },
    {
      id: "first-term-from-two-terms",
      title: t("The first term from two terms", "由两项求首项"),
      explanation: t(
        "Once $r$ is known, divide $a_p$ by $r$ a total of $p - 1$ times:\n\n$$a_1 = \\frac{a_p}{r^{p-1}}.$$\n\nWith $a_2 = 6$ and $r = 3$: $a_1 = \\frac{6}{3} = 2$.",
        "求出 $r$ 后，用 $a_p$ 除以 $r$ 共 $p - 1$ 次：\n\n$$a_1 = \\frac{a_p}{r^{p-1}}.$$\n\n当 $a_2 = 6$，$r = 3$ 时：$a_1 = \\frac{6}{3} = 2$。",
      ),
      generate(rng) {
        const s = twoGeometricTerms(rng, 2);
        return numberProblem({
          prompt: givenGeometric(s, "Find $a_1$.", "求 $a_1$。"),
          answer: s.a1,
          wrong: [s.x.div(s.r.pow(s.p)), s.x.mul(s.r.pow(s.p - 1)), s.a1.neg()],
          solution: t(
            `First find $r$: ${rootSteps(s.gap, s.x, s.y, s.r)}Then ${steps(`a_1 = \\frac{${s.x.toLatex()}}{${base(s.r)}^{${s.p - 1}}} = ${s.a1.toLatex()}`)}`,
            `先求 $r$：${rootSteps(s.gap, s.x, s.y, s.r)}于是 ${steps(`a_1 = \\frac{${s.x.toLatex()}}{${base(s.r)}^{${s.p - 1}}} = ${s.a1.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "a-term-from-two-terms",
      title: t("A term from two terms", "由两项求某一项"),
      explanation: t(
        "To find a later term, multiply the last known term by $r$ once for each step: $a_k = a_q \\cdot r^{k-q}$. With $a_5 = 162$ and $r = 3$:\n\n$$a_7 = 162 \\cdot 3^{2} = 1458.$$",
        "求后面的某一项时，每走一步就用最后一个已知项乘一次 $r$：$a_k = a_q \\cdot r^{k-q}$。当 $a_5 = 162$，$r = 3$ 时：\n\n$$a_7 = 162 \\cdot 3^{2} = 1458.$$",
      ),
      generate(rng) {
        const s = twoGeometricTerms(rng, 1);
        const k = s.q + rng.int(1, 3);
        const ak = s.a1.mul(s.r.pow(k - 1));
        return numberProblem({
          prompt: givenGeometric(s, `Find $a_{${k}}$.`, `求 $a_{${k}}$。`),
          answer: ak,
          wrong: [s.y.mul(s.r.pow(k - s.q + 1)), s.y.mul(s.y.div(s.x).pow(k - s.q)), ak.neg()],
          solution: t(
            `First find $r$: ${rootSteps(s.gap, s.x, s.y, s.r)}Then ${steps(`a_{${k}} = ${paren(s.y)} \\cdot ${base(s.r)}^{${k - s.q}} = ${ak.toLatex()}`)}`,
            `先求 $r$：${rootSteps(s.gap, s.x, s.y, s.r)}于是 ${steps(`a_{${k}} = ${paren(s.y)} \\cdot ${base(s.r)}^{${k - s.q}} = ${ak.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
};

/** indexSteps writes how n follows from a_1 r^{n-1} = v. */
const indexSteps = (a1: Q, r: Q, v: Q, k: number) =>
  steps(
    `${times(a1, `${base(r)}^{n-1}`)} = ${v.toLatex()}`,
    `${base(r)}^{n-1} = ${v.div(a1).toLatex()} = ${base(r)}^{${k - 1}}`,
    `n - 1 = ${k - 1}`,
    `n = ${k}`,
  );

export const indexOfATermInAGeometricSequence: TopicDef = {
  id: "index-of-a-term-in-a-geometric-sequence",
  title: t("Indexes of Terms in Geometric Sequences", "等比数列中项的序号"),
  summary: t("Find which term of a geometric sequence has a given value.", "求等比数列中取给定值的是第几项。"),
  prerequisites: ["nth-term-of-a-geometric-sequence"],
  encompasses: [{ topic: "nth-term-of-a-geometric-sequence", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "index-from-listed-terms",
      title: t("The index from listed terms", "由列出的项求序号"),
      explanation: t(
        "Set $a_1 r^{n-1}$ equal to the value, divide by $a_1$, and find which power of $r$ remains. In $3, 6, 12, \\ldots$, the value $384$:\n\n$$3 \\cdot 2^{n-1} = 384 \\;\\Rightarrow\\; 2^{n-1} = 128 = 2^{7} \\;\\Rightarrow\\; n - 1 = 7 \\;\\Rightarrow\\; n = 8.$$",
        "令 $a_1 r^{n-1}$ 等于给定值，两边除以 $a_1$，再看剩下的是 $r$ 的几次幂。在 $3, 6, 12, \\ldots$ 中，值 $384$：\n\n$$3 \\cdot 2^{n-1} = 384 \\;\\Rightarrow\\; 2^{n-1} = 128 = 2^{7} \\;\\Rightarrow\\; n - 1 = 7 \\;\\Rightarrow\\; n = 8.$$",
      ),
      generate(rng) {
        const r = Q.of(rng.pick([2, -2, 3, -3, 4, 5]));
        const a1 = Q.of(rng.nonZero(-9, 9));
        const k = rng.int(5, Math.max(6, maxIndex(Number(r.n), 3000)));
        const v = a1.mul(r.pow(k - 1));
        const terms = geometric(a1, r, 3);
        return numberProblem({
          prompt: t(
            `Which term of the geometric sequence $${list(terms)}$ is $${v.toLatex()}$?`,
            `$${v.toLatex()}$ 是等比数列 $${list(terms)}$ 的第几项？`,
          ),
          answer: k,
          solveFor: "n",
          wrong: [k - 1, k + 1],
          solution: t(
            `Here $a_1 = ${a1.toLatex()}$ and $r = ${r.toLatex()}$: ${indexSteps(a1, r, v, k)}`,
            `这里 $a_1 = ${a1.toLatex()}$，$r = ${r.toLatex()}$：${indexSteps(a1, r, v, k)}`,
          ),
        });
      },
    },
    {
      id: "index-with-fractional-ratios",
      title: t("Fractional ratios", "分数公比"),
      explanation: t(
        "The same method works when the terms shrink. In $640, 320, 160, \\ldots$, the value $5$:\n\n$$640 \\cdot \\left(\\frac{1}{2}\\right)^{n-1} = 5 \\;\\Rightarrow\\; \\left(\\frac{1}{2}\\right)^{n-1} = \\frac{1}{128} = \\left(\\frac{1}{2}\\right)^{7} \\;\\Rightarrow\\; n = 8.$$",
        "当各项逐渐变小时，方法相同。在 $640, 320, 160, \\ldots$ 中，值 $5$：\n\n$$640 \\cdot \\left(\\frac{1}{2}\\right)^{n-1} = 5 \\;\\Rightarrow\\; \\left(\\frac{1}{2}\\right)^{n-1} = \\frac{1}{128} = \\left(\\frac{1}{2}\\right)^{7} \\;\\Rightarrow\\; n = 8.$$",
      ),
      generate(rng) {
        const r = rng.pick([Q.of(1, 2), Q.of(-1, 2), Q.of(1, 3), Q.of(1, 4), Q.of(2, 3)]);
        const k = rng.int(5, r.d === 2n ? 9 : 6);
        const a1 = Q.of(rng.sign() * rng.int(1, 5) * Number(r.d) ** rng.int(Math.max(2, k - 3), k - 1));
        const v = a1.mul(r.pow(k - 1));
        const terms = geometric(a1, r, 3);
        return numberProblem({
          prompt: t(
            `Which term of the geometric sequence $${list(terms)}$ is $${v.toLatex()}$?`,
            `$${v.toLatex()}$ 是等比数列 $${list(terms)}$ 的第几项？`,
          ),
          answer: k,
          solveFor: "n",
          wrong: [k - 1, k + 1],
          solution: t(
            `Here $a_1 = ${a1.toLatex()}$ and $r = ${r.toLatex()}$: ${indexSteps(a1, r, v, k)}`,
            `这里 $a_1 = ${a1.toLatex()}$，$r = ${r.toLatex()}$：${indexSteps(a1, r, v, k)}`,
          ),
        });
      },
    },
    {
      id: "index-from-the-explicit-formula",
      title: t("The index from an explicit formula", "由通项公式求序号"),
      explanation: t(
        "With an explicit formula, match the exponent as written. For $a_n = 2 \\cdot 3^{n}$ and the value $486$:\n\n$$2 \\cdot 3^{n} = 486 \\;\\Rightarrow\\; 3^{n} = 243 = 3^{5} \\;\\Rightarrow\\; n = 5.$$\n\nHere the exponent is $n$ itself, so there is no $1$ to add.",
        "给出通项公式时，按公式中的指数对应。对于 $a_n = 2 \\cdot 3^{n}$ 和值 $486$：\n\n$$2 \\cdot 3^{n} = 486 \\;\\Rightarrow\\; 3^{n} = 243 = 3^{5} \\;\\Rightarrow\\; n = 5.$$\n\n这里指数就是 $n$ 本身，所以不需要再加 $1$。",
      ),
      generate(rng) {
        const r = Q.of(rng.pick([2, 3, -2, 4, 5]));
        const c = Q.of(rng.nonZero(-9, 9));
        const shift = rng.pick([-1, 0, 1]);
        const e = rng.int(3, Math.max(5, maxIndex(Number(r.n), 1500) - 1));
        const k = e - shift;
        const v = c.mul(r.pow(e));
        const expr = times(c, `${base(r)}^{${exponent(shift)}}`);
        return numberProblem({
          prompt: t(
            `In the sequence $a_n = ${expr}$, which term equals $${v.toLatex()}$?`,
            `在数列 $a_n = ${expr}$ 中，第几项等于 $${v.toLatex()}$？`,
          ),
          answer: k,
          solveFor: "n",
          wrong: [e, k + 1, k - 1],
          solution: t(
            `${steps(`${expr} = ${v.toLatex()}`, `${base(r)}^{${exponent(shift)}} = ${v.div(c).toLatex()} = ${base(r)}^{${e}}`, `${exponent(shift)} = ${e}`, `n = ${k}`)}`,
            `${steps(`${expr} = ${v.toLatex()}`, `${base(r)}^{${exponent(shift)}} = ${v.div(c).toLatex()} = ${base(r)}^{${e}}`, `${exponent(shift)} = ${e}`, `n = ${k}`)}`,
          ),
        });
      },
    },
  ],
};

/** sequenceTopics are the topics of sequences, in teaching order. */
export const sequenceTopics: readonly TopicDef[] = [
  introductionToSequences,
  recursiveSequences,
  fibonacciSequences,
  arithmeticSequences,
  recursiveFormulasForArithmeticSequences,
  nthTermOfAnArithmeticSequence,
  explicitAndRecursiveArithmeticFormulas,
  arithmeticSequencesFromTwoTerms,
  indexOfATermInAnArithmeticSequence,
  solvingForVariablesInArithmeticSequences,
  modelingWithArithmeticSequences,
  geometricSequences,
  nthTermOfAGeometricSequence,
  recursiveFormulasForGeometricSequences,
  geometricSequencesFromTwoTerms,
  indexOfATermInAGeometricSequence,
];
