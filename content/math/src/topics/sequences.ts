import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Coefficient, linear, num, paren, poly, Q } from "@ga/subject-math";

import { choiceProblem, type ExpressionProblem, expressionProblem, numberProblem, steps, yesNo } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";

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
  return expressionProblem({ ...p, prefix: "a_n =" });
}

/** ratios are common ratios with their denominators, for geometric sequences of integers. */
const ratios: readonly Q[] = [2, 3, -2, -3, 4, -1].map((r) => Q.of(r)).concat([Q.of(1, 2), Q.of(-1, 2), Q.of(1, 3), Q.of(3, 2)]);

/** geometricStart draws a first term that keeps the first count terms of the sequence with ratio r integers. */
function geometricStart(rng: Rng, r: Q, count: number, max = 5): Q {
  return Q.of(rng.sign() * rng.int(1, max) * Number(r.d) ** (count - 1));
}

/** chainEq joins the stages of a computation with "=", dropping a stage equal to the one before it. */
const chainEq = (...parts: readonly string[]) => parts.filter((p, i) => p !== parts[i - 1]).join(" = ");

/** scaled writes c times x, dropping a coefficient 1 or -1: "3 \cdot 5", "5", "-5". */
const scaled = (c: number, x: string) => (c === 1 ? x : c === -1 ? `-${x}` : `${c} \\cdot ${x}`);

/** added writes c times x as an added term: " + 3 \cdot 5", " - 5". */
const added = (c: number, x: string) => ` ${c < 0 ? "-" : "+"} ${scaled(Math.abs(c), x)}`;

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
  intro: t(
    `We can evaluate an expression such as $3n + 1$ for any value of $n$. Many quantities come as a list in order: the seats in the rows of a hall, front to back, or a savings balance week by week. In such a list the position of each number matters as much as its value.

A **sequence** is such an ordered list, and naming each number by its position lets us talk about any one of them without writing out the rest. We write $a_1$ for the first number, $a_2$ for the second, and $a_n$ for the number in position $n$. If the number in position $n$ is always $3n + 1$, then

$$a_1 = 3 \\cdot 1 + 1 = 4, \\quad a_2 = 3 \\cdot 2 + 1 = 7, \\quad a_3 = 10, \\quad \\ldots, \\quad a_{50} = 3 \\cdot 50 + 1 = 151,$$

and we reach the $50$th number without listing the $49$ before it.

In this lesson we read terms from a list by their position, then compute terms from formulas, including formulas with powers, fractions and alternating signs.`,
    `我们会对任意的 $n$ 计算 $3n + 1$ 这样的式子的值。很多量是按顺序排成一列给出的：礼堂从前到后各排的座位数，或者每周的存款余额。在这样的一列数里，每个数的位置和它的值同样重要。

**数列**就是这样按顺序排列的一列数。按位置给每个数命名，就能谈论其中任何一个，而不必写出其余的数。第一个数记作 $a_1$，第二个记作 $a_2$，位置 $n$ 上的数记作 $a_n$。如果位置 $n$ 上的数总是 $3n + 1$，那么

$$a_1 = 3 \\cdot 1 + 1 = 4, \\quad a_2 = 3 \\cdot 2 + 1 = 7, \\quad a_3 = 10, \\quad \\ldots, \\quad a_{50} = 3 \\cdot 50 + 1 = 151,$$

不必列出前面的 $49$ 个数，就得到了第 $50$ 个数。

这节课先按位置从列出的数中读出各项，再由公式计算各项，包括含乘方、分数和正负交替的公式。`,
  ),
  knowledgePoints: [
    {
      id: "terms-and-index-notation",
      title: t("Terms and index notation", "项与下标记号"),
      explanation: t(
        `A **sequence** is an ordered list of numbers, called its **terms**. We write $a_1$ for the first term, $a_2$ for the second, and in general $a_n$ for the $n$th term; the number $n$ is the **index** of the term. The index is a position, so counting starts at $1$, with the first term.

In the sequence

$$5, 8, 13, 20, 29, \\ldots$$

count along the list: $a_1 = 5$, $a_2 = 8$, $a_3 = 13$, $a_4 = 20$. The three dots mean that the sequence continues.

> **Watch out.** Start counting at $a_1$, the first term. Counting the first term as $a_0$ lands one place too far, on $29$ for $a_4$; stopping one place short gives $13$. The index is the position of a term, not its value.`,
        `**数列**是按顺序排列的一列数，其中每个数叫做**项**。第一项记作 $a_1$，第二项记作 $a_2$，一般地，第 $n$ 项记作 $a_n$，其中 $n$ 叫做这一项的**下标**（序号）。下标表示位置，所以从第一项开始，从 $1$ 数起。

在数列

$$5, 8, 13, 20, 29, \\ldots$$

中，沿着列表数：$a_1 = 5$，$a_2 = 8$，$a_3 = 13$，$a_4 = 20$。省略号表示数列还在继续。

> **注意。** 从第一项 $a_1$ 开始数。把第一项当成 $a_0$ 会多走一位，把 $a_4$ 数成 $29$；少数一位则得到 $13$。下标是项的位置，而不是项的值。`,
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
        const labels = terms
          .slice(0, k)
          .map((x, i) => `a_{${i + 1}} = ${num(x)}`)
          .join(",\\quad ");
        const before = terms
          .slice(0, k - 1)
          .map(num)
          .join(", ");
        return numberProblem({
          prompt: t(
            `A sequence begins $${list(terms.slice(0, 6))}$. What is $a_{${k}}$?`,
            `一个数列的前几项是 $${list(terms.slice(0, 6))}$。求 $a_{${k}}$。`,
          ),
          answer: value,
          wrong: [terms[k]!, terms[k - 2]!],
          solution: t(
            `The index $${k}$ is a position: $a_{${k}}$ is the ${ordinal(k)} term, counting $a_1 = ${num(terms[0]!)}$ as the first.\n\nNumber the terms in order until the index reaches $${k}$:${steps(labels)}So $a_{${k}} = ${num(value)}$.\n\n**Check.** ${k === 2 ? "Exactly one term comes" : `Exactly $${k - 1}$ terms come`} before it in the list, $${before}$, so it is in position $${k}$.`,
            `下标 $${k}$ 表示位置：$a_{${k}}$ 是第 $${k}$ 项，把 $a_1 = ${num(terms[0]!)}$ 算作第一项。\n\n按顺序给各项编号，直到下标为 $${k}$：${steps(labels)}所以 $a_{${k}} = ${num(value)}$。\n\n**检验。** 列表中它前面恰好有 $${k - 1}$ 项，即 $${before}$，所以它位于第 $${k}$ 个位置。`,
          ),
        });
      },
    },
    {
      id: "explicit-formulas",
      title: t("Explicit formulas", "通项公式"),
      explanation: t(
        `An **explicit formula** gives each term directly from its index, so any term can be found without computing the ones before it. To find a term, replace every $n$ in the formula by its index, then evaluate with the order of operations. For $a_n = 2n^{2} - 3$:

$$a_5 = 2 \\cdot 5^{2} - 3 = 2 \\cdot 25 - 3 = 50 - 3 = 47.$$

The square applies to the $5$ alone, so square first, then multiply, then subtract.

> **Watch out.** Multiplying first gives $(2 \\cdot 5)^{2} - 3 = 97$, which squares the coefficient too. And substitute exactly the index asked for: the terms $a_4$ and $a_6$ next to it are different numbers.`,
        `**通项公式**直接由下标给出每一项，所以求任何一项都不必先算出它前面的项。求某一项时，把公式中的每个 $n$ 都换成它的下标，再按运算顺序计算。对于 $a_n = 2n^{2} - 3$：

$$a_5 = 2 \\cdot 5^{2} - 3 = 2 \\cdot 25 - 3 = 50 - 3 = 47.$$

平方只作用于 $5$，所以先平方，再相乘，最后相减。

> **注意。** 先相乘会得到 $(2 \\cdot 5)^{2} - 3 = 97$，把系数也平方了。还要代入题目要求的那个下标：相邻的 $a_4$ 和 $a_6$ 是不同的数。`,
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const kind = rng.int(0, 2);
        const p = rng.nonZero(-9, 9);
        const c = rng.nonZero(-12, 12);
        const k = rng.int(2, 12);
        const [expr, f, sub, alt] =
          kind === 0
            ? [poly([p, "n"], [c, ""]), (n: number) => p * n + c, `${scaled(p, String(k))}${plus(c)}`, p + k + c]
            : kind === 1
              ? [poly([p, "n^{2}"], [c, ""]), (n: number) => p * n * n + c, `${scaled(p, `${k}^{2}`)}${plus(c)}`, (p * k) ** 2 + c]
              : [poly([1, "n^{2}"], [p, "n"]), (n: number) => n * n + p * n, `${k}^{2}${added(p, String(k))}`, 2 * k + p * k];
        const value = f(k);
        const work =
          kind === 0
            ? chainEq(sub, `${num(p * k)}${plus(c)}`, num(value))
            : kind === 1
              ? chainEq(sub, `${scaled(p, String(k * k))}${plus(c)}`, `${num(p * k * k)}${plus(c)}`, num(value))
              : chainEq(sub, `${k * k}${plus(p * k)}`, num(value));
        const order = [
          [
            "Multiplication comes before addition and subtraction",
            "The power comes first, then the multiplication, then the addition or subtraction",
            "Work out the power and the product before combining them",
          ][kind]!,
          ["先算乘法，再算加减", "先算乘方，再算乘法，最后算加减", "先算出乘方和乘积，再把它们合并"][kind]!,
        ];
        const check =
          kind === 0
            ? t(
                `Each time $n$ grows by $1$, the term changes by the coefficient of $n$, $${p}$. The term before is $a_{${k - 1}} = ${num(f(k - 1))}$, and $${num(f(k - 1))}${plus(p)} = ${num(value)}$.`,
                `$n$ 每增加 $1$，项就变化 $n$ 的系数 $${p}$。前一项是 $a_{${k - 1}} = ${num(f(k - 1))}$，而 $${num(f(k - 1))}${plus(p)} = ${num(value)}$。`,
              )
            : kind === 1
              ? (() => {
                  const back = `${num(value)}${plus(-c)} = ${num(p * k * k)}`;
                  const rest =
                    Math.abs(p) === 1 ? ` = ${scaled(p, `${k}^{2}`)}` : `$, and $${num(p * k * k)} \\div ${paren(p)} = ${k * k} = ${k}^{2}`;
                  return t(
                    `Undo the steps in reverse order: $${back}${rest}$.`,
                    `按相反的顺序撤销各步：$${back}${rest.replace("$, and $", "$，而 $")}$。`,
                  );
                })()
              : t(
                  `Factor out $n$: $${expr} = n(${poly([1, "n"], [p, ""])})$, and $${k}(${k}${plus(p)}) = ${k} \\cdot ${paren(k + p)} = ${num(value)}$.`,
                  `提取 $n$：$${expr} = n(${poly([1, "n"], [p, ""])})$，而 $${k}(${k}${plus(p)}) = ${k} \\cdot ${paren(k + p)} = ${num(value)}$。`,
                );
        return numberProblem({
          prompt: t(`Given $a_n = ${expr}$, find $a_{${k}}$.`, `已知 $a_n = ${expr}$，求 $a_{${k}}$。`),
          answer: value,
          wrong: [f(k - 1), f(k + 1), alt],
          solution: t(
            `**Step 1: substitute.** Replace every $n$ by $${k}$:${steps(`a_{${k}} = ${sub}`)}**Step 2: evaluate.** ${order[0]}:${steps(work)}**Check.** ${check.en}`,
            `**第一步：代入。** 把每个 $n$ 都换成 $${k}$：${steps(`a_{${k}} = ${sub}`)}**第二步：计算。** ${order[1]}：${steps(work)}**检验。** ${check["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "powers-and-fractions-in-formulas",
      title: t("Formulas with powers and fractions", "含乘方与分数的公式"),
      explanation: t(
        `The index can appear in an exponent, in a fraction or in a sign. Substitute it in the same way, then evaluate:

$$a_n = 3^{n} - 4: \\quad a_4 = 3^{4} - 4 = 81 - 4 = 77, \\qquad a_n = \\frac{n}{n + 2}: \\quad a_3 = \\frac{3}{3 + 2} = \\frac{3}{5}.$$

An exponent counts factors: $3^{4} = 3 \\cdot 3 \\cdot 3 \\cdot 3$. A fraction bar groups its top and its bottom, so each is worked out before dividing. A factor $(-1)^{n}$ makes the terms alternate in sign: it is $-1$ when $n$ is odd and $1$ when $n$ is even, and it multiplies everything after it.

> **Watch out.** $3^{4}$ is $81$, not $3 \\cdot 4 = 12$. In $(-1)^{n}(2n + 1)$ the sign applies to the whole bracket: at $n = 3$ the term is $-7$, not $-6 + 1$. And the bottom of $\\frac{n}{n + 2}$ is a sum, not $n \\cdot 2$.`,
        `下标也可以出现在指数、分数或符号中。同样代入，再计算：

$$a_n = 3^{n} - 4: \\quad a_4 = 3^{4} - 4 = 81 - 4 = 77, \\qquad a_n = \\frac{n}{n + 2}: \\quad a_3 = \\frac{3}{3 + 2} = \\frac{3}{5}.$$

指数表示因数的个数：$3^{4} = 3 \\cdot 3 \\cdot 3 \\cdot 3$。分数线把分子和分母各自括成一组，所以要先分别算出它们，再相除。因子 $(-1)^{n}$ 使各项正负交替：$n$ 为奇数时它等于 $-1$，$n$ 为偶数时等于 $1$，并且它乘以后面的全部。

> **注意。** $3^{4}$ 是 $81$，不是 $3 \\cdot 4 = 12$。在 $(-1)^{n}(2n + 1)$ 中，符号作用于整个括号：$n = 3$ 时这一项是 $-7$，不是 $-6 + 1$。$\\frac{n}{n + 2}$ 的分母是和，不是 $n \\cdot 2$。`,
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const b = rng.pick([2, 3]);
          const c = rng.nonZero(-20, 20);
          const k = rng.int(2, b === 2 ? 9 : 6);
          const value = b ** k + c;
          const factors = Array(k).fill(b).join(" \\cdot ");
          const previous =
            k === 2
              ? t(`$${b}$ times $${b}$`, `$${b}$ 乘 $${b}$`)
              : t(`$${b}$ times $${b}^{${k - 1}} = ${b ** (k - 1)}$`, `$${b}$ 乘 $${b}^{${k - 1}} = ${b ** (k - 1)}$`);
          return numberProblem({
            prompt: t(`Given $a_n = ${b}^{n}${plus(c)}$, find $a_{${k}}$.`, `已知 $a_n = ${b}^{n}${plus(c)}$，求 $a_{${k}}$。`),
            answer: value,
            wrong: [b * k + c, b ** (k - 1) + c],
            solution: t(
              `**Step 1: substitute.** Replace $n$ by $${k}$:${steps(`a_{${k}} = ${b}^{${k}}${plus(c)}`)}**Step 2: the power.** The exponent counts factors of $${b}$:${steps(`${b}^{${k}} = ${factors} = ${b ** k}`)}**Step 3: the constant.** ${c < 0 ? "Subtract" : "Add"} it last:${steps(`a_{${k}} = ${b ** k}${plus(c)} = ${num(value)}`)}**Check.** The power is ${previous.en}: $${b} \\cdot ${b ** (k - 1)} = ${b ** k}$, and $${b ** k}${plus(c)} = ${num(value)}$.`,
              `**第一步：代入。** 把 $n$ 换成 $${k}$：${steps(`a_{${k}} = ${b}^{${k}}${plus(c)}`)}**第二步：乘方。** 指数表示 $${b}$ 作为因数的个数：${steps(`${b}^{${k}} = ${factors} = ${b ** k}`)}**第三步：常数。** 最后${c < 0 ? "减去" : "加上"}常数：${steps(`a_{${k}} = ${b ** k}${plus(c)} = ${num(value)}`)}**检验。** 这个幂等于${previous["zh-CN"]}：$${b} \\cdot ${b ** (k - 1)} = ${b ** k}$，而 $${b ** k}${plus(c)} = ${num(value)}$。`,
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
          const product = sign === 1 ? `a_{${k}} = ${num(inner)}` : `a_{${k}} = -${paren(inner)} = ${num(value)}`;
          return numberProblem({
            prompt: t(`Given $a_n = ${expr}$, find $a_{${k}}$.`, `已知 $a_n = ${expr}$，求 $a_{${k}}$。`),
            answer: value,
            wrong: [-value, sign * m * k + c],
            solution: t(
              `**Step 1: the sign.** Since $${k}$ is ${k % 2 === 0 ? "even" : "odd"}, $(-1)^{n} = ${sign}$ at $n = ${k}$.\n\n**Step 2: the bracket.** Substitute $n = ${k}$ inside it:${steps(chainEq(`${scaled(m, String(k))}${plus(c)}`, num(inner)))}**Step 3: multiply.** The sign multiplies the whole bracket${sign === 1 ? ", and multiplying by $1$ changes nothing" : ""}:${steps(product)}**Check.** Multiplying each part of the bracket by $${sign}$ gives the same: $${num(sign * m * k)}${plus(sign * c)} = ${num(value)}$.`,
              `**第一步：符号。** 因为 $${k}$ 是${k % 2 === 0 ? "偶数" : "奇数"}，$n = ${k}$ 时 $(-1)^{n} = ${sign}$。\n\n**第二步：括号。** 在括号里代入 $n = ${k}$：${steps(chainEq(`${scaled(m, String(k))}${plus(c)}`, num(inner)))}**第三步：相乘。** 符号乘以整个括号${sign === 1 ? "，乘以 $1$ 不改变它" : ""}：${steps(product)}**检验。** 用 $${sign}$ 分别乘括号里的每一部分，结果相同：$${num(sign * m * k)}${plus(sign * c)} = ${num(value)}$。`,
            ),
          });
        }
        const c = rng.int(1, 5);
        const m = rng.pick([1, 2, 3]);
        const k = rng.int(1, 12);
        const value = Q.of(m * k, k + c);
        const expr = `\\frac{${m === 1 ? "" : m}n}{n + ${c}}`;
        const top = m === 1 ? `${k}` : `${m} \\cdot ${k}`;
        return numberProblem({
          prompt: t(`Given $a_n = ${expr}$, find $a_{${k}}$.`, `已知 $a_n = ${expr}$，求 $a_{${k}}$。`),
          answer: value,
          wrong: [Q.of(m * (k + 1), k + 1 + c), Q.of(m * k, k * c)],
          solution: t(
            `**Step 1: substitute.** Replace both $n$'s by $${k}$:${steps(`a_{${k}} = \\frac{${top}}{${k} + ${c}}`)}**Step 2: top and bottom.** The fraction bar groups each part, so work out the top and the bottom, then simplify:${steps(chainEq(`a_{${k}} = \\frac{${m * k}}{${k + c}}`, value.toLatex()))}**Check.** Multiplying back by the bottom gives the top: $${k + c} \\cdot ${value.toLatex()} = ${m * k}$.`,
            `**第一步：代入。** 把两个 $n$ 都换成 $${k}$：${steps(`a_{${k}} = \\frac{${top}}{${k} + ${c}}`)}**第二步：分子和分母。** 分数线把分子、分母各自括成一组，所以先分别算出分子和分母，再化简：${steps(chainEq(`a_{${k}} = \\frac{${m * k}}{${k + c}}`, value.toLatex()))}**检验。** 乘回分母得到分子：$${k + c} \\cdot ${value.toLatex()} = ${m * k}$。`,
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
  encompasses: [{ topic: "one-step-equations-multiplication", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSF.IF.A.3"],
  intro: t(
    `An explicit formula computes each term of a sequence from its index. Many sequences are more naturally described by how each term comes from the one before it: a stack that grows by $5$ cm with every box, or a number that is doubled and then reduced by $3$ at each stage.

A **recursive formula** says where to start and how to take one step. In

$$a_1 = 4, \\qquad a_n = 2a_{n-1} - 3,$$

the symbol $a_{n-1}$ is the term just before $a_n$, so the rule reads: to get a term, double the term before it and subtract $3$. Starting from $4$:

$$a_2 = 2 \\cdot 4 - 3 = 5, \\quad a_3 = 2 \\cdot 5 - 3 = 7, \\quad a_4 = 2 \\cdot 7 - 3 = 11.$$

Unlike an explicit formula, a recursive one cannot jump straight to $a_{50}$: we walk one term at a time, and to go back we undo the step.

In this lesson we apply recursive rules forward, use rules that involve the index $n$, and find earlier terms by undoing the rule.`,
    `通项公式由下标计算数列的每一项。很多数列更自然的描述方式，是说明每一项怎样由它的前一项得到：每放一个箱子，一摞箱子就高 $5$ 厘米；或者每一步都把一个数翻倍再减去 $3$。

**递推公式**说明从哪里开始，以及怎样走一步。在

$$a_1 = 4, \\qquad a_n = 2a_{n-1} - 3$$

中，$a_{n-1}$ 是紧接在 $a_n$ 之前的一项，所以这条规则的意思是：要得到一项，就把它的前一项乘以 $2$ 再减去 $3$。从 $4$ 开始：

$$a_2 = 2 \\cdot 4 - 3 = 5, \\quad a_3 = 2 \\cdot 5 - 3 = 7, \\quad a_4 = 2 \\cdot 7 - 3 = 11.$$

与通项公式不同，递推公式不能直接跳到 $a_{50}$：要一项一项地往前走，而要往回走，就把这一步撤销。

这节课先向前应用递推规则，再使用含下标 $n$ 的规则，最后通过撤销规则求前面的项。`,
  ),
  knowledgePoints: [
    {
      id: "applying-a-recursive-rule",
      title: t("Applying a recursive rule", "应用递推公式"),
      explanation: t(
        `A **recursive formula** gives the first term and a rule that computes each term from the one before it. The first term is given, and each use of the rule moves one place along the sequence, so reaching $a_k$ takes $k - 1$ uses of the rule. In

$$a_1 = 4, \\qquad a_n = 2a_{n-1} - 3,$$

$a_{n-1}$ is the term just before $a_n$. Apply the rule one term at a time, each time to the term just found:

$$a_2 = 2 \\cdot 4 - 3 = 5, \\quad a_3 = 2 \\cdot 5 - 3 = 7, \\quad a_4 = 2 \\cdot 7 - 3 = 11.$$

> **Watch out.** Count the uses of the rule: $a_4$ needs three, because $a_1$ is given, not computed. One use too many or too few lands on the neighbouring term. And follow the order of operations: $2a_{n-1} - 3$ doubles first, then subtracts, which is not $2(a_{n-1} - 3)$.`,
        `**递推公式**给出第一项，以及由前一项计算每一项的规则。第一项是给定的，每用一次规则就沿数列前进一个位置，所以得到 $a_k$ 要用 $k - 1$ 次规则。在

$$a_1 = 4, \\qquad a_n = 2a_{n-1} - 3$$

中，$a_{n-1}$ 是紧接在 $a_n$ 之前的一项。逐项应用规则，每次都用在刚求出的那一项上：

$$a_2 = 2 \\cdot 4 - 3 = 5, \\quad a_3 = 2 \\cdot 5 - 3 = 7, \\quad a_4 = 2 \\cdot 7 - 3 = 11.$$

> **注意。** 数清规则用了几次：$a_4$ 要用三次，因为 $a_1$ 是给定的，不用计算。多用或少用一次，都会落在相邻的项上。还要按运算顺序：$2a_{n-1} - 3$ 先乘 $2$ 再减，不是 $2(a_{n-1} - 3)$。`,
      ),
      generate(rng) {
        const p = rng.pick([1, 1, 2, 3, -1, -2]);
        const q = rng.nonZero(-9, 9);
        const a1 = rng.int(-9, 9);
        const k = rng.int(3, 5);
        const terms = iterate(a1, k + 1, (x) => p * x + q);
        const swapped = iterate(a1, k, (x) => p * (x + q));
        const rule = poly([p, "a_{n-1}"], [q, ""]);
        const ak = terms[k - 1]!;
        const prev = terms[k - 2]!;
        const undo =
          p === 1
            ? `${num(ak)}${plus(-q)} = ${num(prev)}`
            : `(${num(ak)}${plus(-q)}) \\div ${paren(p)} = ${num(ak - q)} \\div ${paren(p)} = ${num(prev)}`;
        const how = [
          p === 1 ? `subtract $${q}$` : `${q < 0 ? "add" : "subtract"} $${Math.abs(q)}$ and divide by $${p}$`,
          p === 1 ? `减去 $${q}$` : `${q < 0 ? "加上" : "减去"} $${Math.abs(q)}$，再除以 $${p}$`,
        ];
        return numberProblem({
          prompt: t(
            `A sequence is defined by $a_1 = ${a1}$ and $a_n = ${rule}$. Find $a_{${k}}$.`,
            `数列由 $a_1 = ${a1}$ 和 $a_n = ${rule}$ 定义。求 $a_{${k}}$。`,
          ),
          answer: ak,
          wrong: [terms[k - 2]!, terms[k]!, swapped[k - 1]!],
          solution: t(
            `The first term $a_1 = ${a1}$ is given, and each use of the rule gives the next term, so reaching $a_{${k}}$ takes $${k - 1}$ uses. Apply the rule to each term in turn${Math.abs(p) === 1 ? "" : ", multiplying before adding"}:${chain(terms, k, (n) => `${p === 1 ? "" : p === -1 ? "-" : `${p} \\cdot `}${paren(terms[n - 2]!)}${plus(q)}`)}So $a_{${k}} = ${num(ak)}$.\n\n**Check.** Undo the last step: to go back from $a_{${k}}$, ${how[0]}. This gives $${undo}$, which is $a_{${k - 1}}$.`,
            `第一项 $a_1 = ${a1}$ 是给定的，每用一次规则得到下一项，所以得到 $a_{${k}}$ 要用 $${k - 1}$ 次。依次对每一项应用规则${Math.abs(p) === 1 ? "" : "，先乘后加"}：${chain(terms, k, (n) => `${p === 1 ? "" : p === -1 ? "-" : `${p} \\cdot `}${paren(terms[n - 2]!)}${plus(q)}`)}所以 $a_{${k}} = ${num(ak)}$。\n\n**检验。** 撤销最后一步：从 $a_{${k}}$ 往回，要${how[1]}。得 $${undo}$，正是 $a_{${k - 1}}$。`,
          ),
        });
      },
    },
    {
      id: "rules-involving-the-index",
      title: t("Rules that involve the index", "含下标的递推规则"),
      explanation: t(
        `A recursive rule may also use the index $n$ of the term being computed, so the step changes from term to term. For $a_1 = 2$ and $a_n = a_{n-1} + 3n$, computing $a_2$ uses $n = 2$ and computing $a_3$ uses $n = 3$:

$$a_2 = 2 + 3 \\cdot 2 = 8, \\quad a_3 = 8 + 3 \\cdot 3 = 17.$$

The first step adds $6$ and the second adds $9$: the amount added grows with $n$.

> **Watch out.** In the line for $a_3$, $n$ is $3$, the index on the left, not $2$, the index of the term being used. Using the index of the previous term gives $a_3 = 8 + 3 \\cdot 2 = 14$.`,
        `递推规则也可能用到正在计算的那一项的下标 $n$，所以每一步的变化量各不相同。对于 $a_1 = 2$ 和 $a_n = a_{n-1} + 3n$，计算 $a_2$ 时 $n = 2$，计算 $a_3$ 时 $n = 3$：

$$a_2 = 2 + 3 \\cdot 2 = 8, \\quad a_3 = 8 + 3 \\cdot 3 = 17.$$

第一步加 $6$，第二步加 $9$：加上的量随 $n$ 增大。

> **注意。** 在求 $a_3$ 的那一行里，$n$ 是左边的下标 $3$，而不是所用的前一项的下标 $2$。用前一项的下标会得到 $a_3 = 8 + 3 \\cdot 2 = 14$。`,
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
                (x: number, n: number) => `${num(x)}${added(c, String(n))}`,
              ]
            : kind === 1
              ? [
                  poly([c, "n"], [-1, "a_{n-1}"]),
                  (x: number, n: number) => c * n - x,
                  (x: number, n: number) => `${scaled(c, String(n))} - ${paren(x)}`,
                ]
              : [`n \\cdot a_{n-1}`, (x: number, n: number) => n * x, (x: number, n: number) => `${n} \\cdot ${paren(x)}`];
        const start = kind === 2 ? rng.nonZero(-3, 3) : a1;
        const terms = iterate(start, k, f);
        const shifted = iterate(start, k, (x, n) => f(x, n - 1));
        const ak = terms[k - 1]!;
        const prev = terms[k - 2]!;
        const undo =
          kind === 0
            ? t(
                `subtract $${scaled(c, String(k))}$: $${num(ak)}${added(-c, String(k))} = ${num(prev)}$`,
                `减去 $${scaled(c, String(k))}$：$${num(ak)}${added(-c, String(k))} = ${num(prev)}$`,
              )
            : kind === 1
              ? t(
                  `the rule gives $a_{${k - 1}} = ${scaled(c, String(k))} - a_{${k}}$: $${scaled(c, String(k))} - ${paren(ak)} = ${num(prev)}$`,
                  `由规则得 $a_{${k - 1}} = ${scaled(c, String(k))} - a_{${k}}$：$${scaled(c, String(k))} - ${paren(ak)} = ${num(prev)}$`,
                )
              : t(`divide by $${k}$: $${num(ak)} \\div ${k} = ${num(prev)}$`, `除以 $${k}$：$${num(ak)} \\div ${k} = ${num(prev)}$`);
        return numberProblem({
          prompt: t(
            `A sequence is defined by $a_1 = ${start}$ and $a_n = ${rule}$. Find $a_{${k}}$.`,
            `数列由 $a_1 = ${start}$ 和 $a_n = ${rule}$ 定义。求 $a_{${k}}$。`,
          ),
          answer: ak,
          wrong: [shifted[k - 1]!, terms[k - 2]!],
          solution: t(
            `In the rule, $n$ is the index of the term being computed: the line for $a_2$ uses $n = 2$, the line for $a_3$ uses $n = 3$, and so on.\n\nApply the rule from $a_1 = ${start}$, one term at a time:${chain(terms, k, (n) => sub(terms[n - 2]!, n))}So $a_{${k}} = ${num(ak)}$.\n\n**Check.** Undo the last step, which used $n = ${k}$: ${undo.en}, the term before it.`,
            `规则中的 $n$ 是正在计算的那一项的下标：求 $a_2$ 的一行用 $n = 2$，求 $a_3$ 的一行用 $n = 3$，依此类推。\n\n从 $a_1 = ${start}$ 开始，逐项应用规则：${chain(terms, k, (n) => sub(terms[n - 2]!, n))}所以 $a_{${k}} = ${num(ak)}$。\n\n**检验。** 撤销用了 $n = ${k}$ 的最后一步：${undo["zh-CN"]}，正是它的前一项。`,
          ),
        });
      },
    },
    {
      id: "finding-earlier-terms",
      title: t("Finding earlier terms", "求前面的项"),
      explanation: t(
        `To go backward, undo the rule: the inverse operation takes each term back to the one before it. If $a_n = a_{n-1} + 5$, each term is $5$ more than the one before, so each term is $5$ less than the one after. With $a_3 = 12$:

$$a_2 = 12 - 5 = 7, \\quad a_1 = 7 - 5 = 2.$$

If $a_n = -3a_{n-1}$ and $a_3 = 36$, undo the multiplication by dividing: $a_2 = \\frac{36}{-3} = -12$, then $a_1 = \\frac{-12}{-3} = 4$. From $a_3$ back to $a_1$ is two steps.

> **Watch out.** Going backward uses the opposite operation: subtract what the rule adds, divide by what it multiplies. Applying the rule itself moves forward instead. And from $a_m$ back to $a_1$ there are $m - 1$ steps, not $m$.`,
        `要向后推，就把规则撤销：用逆运算把每一项带回它的前一项。若 $a_n = a_{n-1} + 5$，每一项比前一项大 $5$，所以每一项比后一项小 $5$。已知 $a_3 = 12$：

$$a_2 = 12 - 5 = 7, \\quad a_1 = 7 - 5 = 2.$$

若 $a_n = -3a_{n-1}$ 且 $a_3 = 36$，就用除法撤销乘法：$a_2 = \\frac{36}{-3} = -12$，再得 $a_1 = \\frac{-12}{-3} = 4$。从 $a_3$ 回到 $a_1$ 共两步。

> **注意。** 往回推用的是相反的运算：规则加什么就减什么，乘什么就除以什么。直接应用规则是往前走。从 $a_m$ 回到 $a_1$ 共 $m - 1$ 步，不是 $m$ 步。`,
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
              `**Step 1: undo the rule.** The rule ${q > 0 ? `adds $${q}$` : `subtracts $${-q}$`} to get each next term, so each term is the next one ${q > 0 ? `minus $${q}$` : `plus $${-q}$`}.\n\n**Step 2: step back.** From $a_{${m}}$ to $a_1$ there are $${m - 1}$ steps:${steps(...back)}**Check.** Run the rule forward from $a_1$: $${terms.map(num).join(" \\to ")}$, which ends at $a_{${m}} = ${am}$.`,
              `**第一步：撤销规则。** 规则每次${q > 0 ? `加上 $${q}$` : `减去 $${-q}$`}得到下一项，所以每一项等于后一项${q > 0 ? `减去 $${q}$` : `加上 $${-q}$`}。\n\n**第二步：往回推。** 从 $a_{${m}}$ 到 $a_1$ 共 $${m - 1}$ 步：${steps(...back)}**检验。** 从 $a_1$ 起向前应用规则：$${terms.map(num).join(" \\to ")}$，最后得到 $a_{${m}} = ${am}$。`,
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
            `**Step 1: undo the rule.** The rule multiplies each term by $${p}$ to get the next, so each term is the next one divided by $${p}$.\n\n**Step 2: step back.** From $a_{${m}}$ to $a_1$ there are $${m - 1}$ steps:${steps(...back)}**Check.** Run the rule forward from $a_1$: $${terms.map(num).join(" \\to ")}$, which ends at $a_{${m}} = ${am}$.`,
            `**第一步：撤销规则。** 规则把每一项乘以 $${p}$ 得到下一项，所以每一项等于后一项除以 $${p}$。\n\n**第二步：往回推。** 从 $a_{${m}}$ 到 $a_1$ 共 $${m - 1}$ 步：${steps(...back)}**检验。** 从 $a_1$ 起向前应用规则：$${terms.map(num).join(" \\to ")}$，最后得到 $a_{${m}} = ${am}$。`,
          ),
        });
      },
    },
  ],
};

/** twoTermLine writes the line a_n = p a_{n-1} + q a_{n-2} = … = value; a term equal to 0 is dropped after the line names it. */
function twoTermLine(n: number, p: number, q: number, x: number, y: number, value: number): string {
  const term = (c: number, v: number) => (c === 1 ? paren(v) : c === -1 ? `-${paren(v)}` : `${c} \\cdot ${paren(v)}`);
  const named = poly([p, `a_{${n - 1}}`], [q, `a_{${n - 2}}`]);
  if (x !== 0 && y !== 0) return `a_{${n}} = ${term(p, x)} ${q < 0 ? "-" : "+"} ${term(Math.abs(q), y)} = ${num(value)}`;
  const kept = x !== 0 ? term(p, x) : y !== 0 ? term(q, y) : "0";
  return `a_{${n}} = ${chainEq(named, kept, num(value))}`;
}

export const fibonacciSequences: TopicDef = {
  id: "fibonacci-sequences",
  title: t("Fibonacci Sequences", "斐波那契型数列"),
  summary: t("Compute terms of sequences in which each term depends on the two before it.", "计算每一项由前两项决定的数列。"),
  prerequisites: ["recursive-sequences"],
  encompasses: [{ topic: "recursive-sequences", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSF.IF.A.3"],
  intro: t(
    `The recursive rules so far computed each term from the one just before it. Some sequences look back further: in the **Fibonacci sequence** each term is the sum of the two terms before it,

$$1, 1, 2, 3, 5, 8, 13, \\ldots \\qquad a_n = a_{n-1} + a_{n-2}.$$

Here $a_{n-1}$ is the term just before $a_n$ and $a_{n-2}$ is the one before that. Because the rule needs two earlier terms, one starting term is not enough: the formula must give $a_1$ and $a_2$, and only then can $a_3$ be computed. From $a_1 = 4$ and $a_2 = -1$ the same rule gives $a_3 = -1 + 4 = 3$ and $a_4 = 3 + (-1) = 2$.

In this lesson we compute terms with the Fibonacci rule from any two starting terms, use other rules that combine the two previous terms, and work backward from two known terms.`,
    `前面的递推规则都是由紧挨着的前一项计算每一项。有些数列要往前看得更远：在**斐波那契数列**中，每一项等于它前面两项之和，

$$1, 1, 2, 3, 5, 8, 13, \\ldots \\qquad a_n = a_{n-1} + a_{n-2}.$$

其中 $a_{n-1}$ 是紧挨在 $a_n$ 前面的一项，$a_{n-2}$ 是再前面的一项。由于规则需要前面两项，一个初始项是不够的：公式必须给出 $a_1$ 和 $a_2$，然后才能算出 $a_3$。由 $a_1 = 4$ 和 $a_2 = -1$，同样的规则给出 $a_3 = -1 + 4 = 3$，$a_4 = 3 + (-1) = 2$。

这节课用斐波那契规则从任意两个初始项计算各项，使用组合前两项的其他规则，并由两个已知项往回推。`,
  ),
  knowledgePoints: [
    {
      id: "the-fibonacci-rule",
      title: t("The Fibonacci rule", "斐波那契规则"),
      explanation: t(
        `In the **Fibonacci sequence** each term is the sum of the two terms before it:

$$a_1 = 1, \\quad a_2 = 1, \\quad a_n = a_{n-1} + a_{n-2}: \\qquad 1, 1, 2, 3, 5, 8, 13, \\ldots$$

Because the rule needs two earlier terms, the formula must give two starting terms, and the first term it can compute is $a_3$. Each new term is then the sum of the last two found. The same rule works from any two starting terms, negative ones included: from $a_1 = 4$ and $a_2 = -1$,

$$a_3 = -1 + 4 = 3, \\quad a_4 = 3 + (-1) = 2, \\quad a_5 = 2 + 3 = 5.$$

> **Watch out.** Two terms are given, so reaching $a_k$ takes $k - 2$ additions, one per line from $a_3$ on. Label each line with its index, or the count slips by one and the answer is a neighbouring term.`,
        `在**斐波那契数列**中，每一项等于它前面两项之和：

$$a_1 = 1, \\quad a_2 = 1, \\quad a_n = a_{n-1} + a_{n-2}: \\qquad 1, 1, 2, 3, 5, 8, 13, \\ldots$$

由于规则需要前面两项，公式必须给出两个初始项，它能算出的第一项是 $a_3$。此后每一个新项都是最后求出的两项之和。同样的规则可以从任意两个初始项开始，包括负数：由 $a_1 = 4$ 和 $a_2 = -1$，

$$a_3 = -1 + 4 = 3, \\quad a_4 = 3 + (-1) = 2, \\quad a_5 = 2 + 3 = 5.$$

> **注意。** 已经给出了两项，所以得到 $a_k$ 要做 $k - 2$ 次加法，从 $a_3$ 起每行一次。每一行都标上下标，否则容易数错一位，得到相邻的项。`,
      ),
      generate(rng) {
        const a1 = rng.int(-9, 9);
        const a2 = rng.nonZero(-9, 9);
        const k = rng.int(5, 8);
        const terms = [a1, a2];
        for (let n = 3; n <= k + 1; n++) terms.push(terms[n - 2]! + terms[n - 3]!);
        const lines = Array.from({ length: k - 2 }, (_, i) => twoTermLine(i + 3, 1, 1, terms[i + 1]!, terms[i]!, terms[i + 2]!));
        const [ak, prev, prev2] = [terms[k - 1]!, terms[k - 2]!, terms[k - 3]!];
        return numberProblem({
          prompt: t(
            `A sequence is defined by $a_1 = ${a1}$, $a_2 = ${a2}$ and $a_n = a_{n-1} + a_{n-2}$. Find $a_{${k}}$.`,
            `数列由 $a_1 = ${a1}$，$a_2 = ${a2}$ 和 $a_n = a_{n-1} + a_{n-2}$ 定义。求 $a_{${k}}$。`,
          ),
          answer: ak,
          wrong: [terms[k - 2]!, terms[k]!],
          solution: t(
            `The first two terms are given. Each later term is the sum of the two just before it, so the lines run from $a_3$ to $a_{${k}}$, $${k - 2}$ of them:${steps(...lines)}So $a_{${k}} = ${num(ak)}$.\n\n**Check.** Take the last line back: $a_{${k - 2}} = a_{${k}} - a_{${k - 1}} = ${num(ak)} - ${paren(prev)} = ${num(prev2)}$, as found above.`,
            `前两项是给定的。之后每一项都是紧挨在它前面的两项之和，所以从 $a_3$ 写到 $a_{${k}}$，共 $${k - 2}$ 行：${steps(...lines)}所以 $a_{${k}} = ${num(ak)}$。\n\n**检验。** 把最后一行倒过来：$a_{${k - 2}} = a_{${k}} - a_{${k - 1}} = ${num(ak)} - ${paren(prev)} = ${num(prev2)}$，与上面求出的一致。`,
          ),
        });
      },
    },
    {
      id: "other-two-term-rules",
      title: t("Other rules on two terms", "其他两项递推规则"),
      explanation: t(
        `Other rules also combine the two previous terms, each with its own coefficient. In $a_n = 2a_{n-1} - a_{n-2}$, the term just before is doubled and the term two before is subtracted. For $a_1 = 1$ and $a_2 = 3$:

$$a_3 = 2 \\cdot 3 - 1 = 5, \\quad a_4 = 2 \\cdot 5 - 3 = 7.$$

In the line for $a_4$, $a_{n-1}$ is $a_3 = 5$ and $a_{n-2}$ is $a_2 = 3$: both move one place along with each new line.

> **Watch out.** Keep each coefficient with its own term: $a_{n-1}$ is the term just before, $a_{n-2}$ the one two before. Swapping them, $2 \\cdot 1 - 3 = -1$ for $a_3$, gives a different sequence.`,
        `其他规则也会组合前两项，各带自己的系数。在 $a_n = 2a_{n-1} - a_{n-2}$ 中，紧挨着的前一项乘以 $2$，前面第二项被减去。当 $a_1 = 1$，$a_2 = 3$ 时：

$$a_3 = 2 \\cdot 3 - 1 = 5, \\quad a_4 = 2 \\cdot 5 - 3 = 7.$$

在求 $a_4$ 的一行里，$a_{n-1}$ 是 $a_3 = 5$，$a_{n-2}$ 是 $a_2 = 3$：每写一行，两者都向后移一位。

> **注意。** 每个系数要跟着自己的那一项：$a_{n-1}$ 是紧挨着的前一项，$a_{n-2}$ 是前面第二项。把它们对调，求 $a_3$ 时算成 $2 \\cdot 1 - 3 = -1$，得到的就是另一个数列。`,
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
        let a2 = rng.nonZero(-5, 5);
        if (a2 === a1) a2 = a1 === 5 ? 4 : a1 + 1 === 0 ? 1 : a1 + 1;
        const k = rng.int(4, 6);
        const run = (x: number, y: number) => {
          const s = [a1, a2];
          for (let n = 3; n <= k; n++) s.push(x * s[n - 2]! + y * s[n - 3]!);
          return s;
        };
        const terms = run(p, q);
        const rule = poly([p, "a_{n-1}"], [q, "a_{n-2}"]);
        const term = (c: number, v: number) => (c === 1 ? paren(v) : c === -1 ? `-${paren(v)}` : `${c} \\cdot ${paren(v)}`);
        const lines = Array.from({ length: k - 2 }, (_, i) => twoTermLine(i + 3, p, q, terms[i + 1]!, terms[i]!, terms[i + 2]!));
        const [ak, prev, prev2] = [terms[k - 1]!, terms[k - 2]!, terms[k - 3]!];
        const left = prev === 0 ? num(ak) : `${num(ak)} ${p < 0 ? "+" : "-"} ${term(Math.abs(p), prev)}`;
        const back = chainEq(left, num(ak - p * prev), q === 1 ? num(prev2) : term(q, prev2));
        const coefficient = (c: number, en: boolean) =>
          c === 1 ? (en ? "itself" : "它本身") : c === -1 ? (en ? "subtracted" : "被减去") : en ? `times $${c}$` : `乘以 $${c}$`;
        return numberProblem({
          prompt: t(
            `A sequence is defined by $a_1 = ${a1}$, $a_2 = ${a2}$ and $a_n = ${rule}$. Find $a_{${k}}$.`,
            `数列由 $a_1 = ${a1}$，$a_2 = ${a2}$ 和 $a_n = ${rule}$ 定义。求 $a_{${k}}$。`,
          ),
          answer: ak,
          wrong: [run(q, p)[k - 1]!, terms[k - 2]!],
          solution: t(
            `In the rule, the term just before, $a_{n-1}$, is taken ${coefficient(p, true)}, and the term two before, $a_{n-2}$, is taken ${coefficient(q, true)}.\n\nApply the rule from $a_3$ on, moving both terms one place along with each line:${steps(...lines)}So $a_{${k}} = ${num(ak)}$.\n\n**Check.** Remove the part that comes from $a_{${k - 1}} = ${num(prev)}$; what is left must be the part from $a_{${k - 2}} = ${num(prev2)}$: $${back}$.`,
            `规则中，紧挨着的前一项 $a_{n-1}$ 取${coefficient(p, false)}，前面第二项 $a_{n-2}$ 取${coefficient(q, false)}。\n\n从 $a_3$ 开始应用规则，每写一行，两项都向后移一位：${steps(...lines)}所以 $a_{${k}} = ${num(ak)}$。\n\n**检验。** 去掉来自 $a_{${k - 1}} = ${num(prev)}$ 的部分，剩下的应是来自 $a_{${k - 2}} = ${num(prev2)}$ 的部分：$${back}$。`,
          ),
        });
      },
    },
    {
      id: "working-backward",
      title: t("Working backward", "向前倒推"),
      explanation: t(
        `If $a_n = a_{n-1} + a_{n-2}$, subtracting $a_{n-1}$ from both sides gives $a_{n-2} = a_n - a_{n-1}$: an earlier term is a later term minus the one between them. So two neighbouring terms are enough to walk back one place at a time. Given $a_5 = 7$ and $a_6 = 11$:

$$a_4 = a_6 - a_5 = 11 - 7 = 4, \\quad a_3 = a_5 - a_4 = 7 - 4 = 3.$$

Going forward again, $3 + 4 = 7$ and $4 + 7 = 11$, as given.

> **Watch out.** Subtract in the right order, the later term minus the earlier one: $a_4 = 11 - 7$, not $7 - 11 = -4$. A sign slip there spreads to every term further back.`,
        `若 $a_n = a_{n-1} + a_{n-2}$，两边同时减去 $a_{n-1}$，得 $a_{n-2} = a_n - a_{n-1}$：较前的一项等于较后的一项减去它们中间的那一项。所以有两个相邻的项，就能一次退一位地往回推。已知 $a_5 = 7$，$a_6 = 11$：

$$a_4 = a_6 - a_5 = 11 - 7 = 4, \\quad a_3 = a_5 - a_4 = 7 - 4 = 3.$$

再往前算，$3 + 4 = 7$，$4 + 7 = 11$，与已知一致。

> **注意。** 注意相减的顺序：较后的项减去较前的项。$a_4 = 11 - 7$，不是 $7 - 11 = -4$。这里一旦符号出错，再往前的每一项都会错。`,
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
        const forward = terms
          .slice(j - 1, m + 1)
          .map(num)
          .join(", ");
        return numberProblem({
          prompt: t(
            `A sequence satisfies $a_n = a_{n-1} + a_{n-2}$, with $a_{${m}} = ${x}$ and $a_{${m + 1}} = ${y}$. Find $a_{${j}}$.`,
            `数列满足 $a_n = a_{n-1} + a_{n-2}$，且 $a_{${m}} = ${x}$，$a_{${m + 1}} = ${y}$。求 $a_{${j}}$。`,
          ),
          answer: terms[j - 1]!,
          wrong: [terms[j]!, flipped[j - 1]!],
          solution: t(
            `Subtract $a_{n-1}$ from both sides of the rule: $a_{n-2} = a_n - a_{n-1}$. Each earlier term is a later term minus the one between them.\n\n${j === m - 1 ? `One step back gives $a_{${j}}$:` : `Walk back one place at a time, from $a_{${m - 1}}$ down to $a_{${j}}$:`}${steps(...lines)}So $a_{${j}} = ${num(terms[j - 1]!)}$.\n\n**Check.** Run the rule forward from $a_{${j}}$: in $${forward}$ each term from the third on is the sum of the two before it, and the list ends with the given $${num(x)}$ and $${num(y)}$.`,
            `把规则两边同时减去 $a_{n-1}$：$a_{n-2} = a_n - a_{n-1}$。每个较前的项等于较后的项减去它们中间的项。\n\n${j === m - 1 ? `退一步就得到 $a_{${j}}$：` : `一次退一位，从 $a_{${m - 1}}$ 推到 $a_{${j}}$：`}${steps(...lines)}所以 $a_{${j}} = ${num(terms[j - 1]!)}$。\n\n**检验。** 从 $a_{${j}}$ 起向前应用规则：在 $${forward}$ 中，从第三个数起每个数都是前两个数之和，最后两个数正是已知的 $${num(x)}$ 和 $${num(y)}$。`,
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
  encompasses: [{ topic: "subtracting-integers", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.IF.A.3", "CCSS.HSF.LE.A.2"],
  intro: t(
    `We can read the terms of a sequence and compute them from a formula. The simplest way for a sequence to grow is by the same amount every time: a row of seats with $5$ more in each row, or a savings box that gets $5$ dollars every week:

$$2, \\; 7, \\; 12, \\; 17, \\; 22, \\; \\ldots \\qquad (+5 \\text{ each time})$$

Such a sequence is called **arithmetic**, and the amount added is its **common difference** $d$. Knowing that a sequence is arithmetic is useful because then two pieces of information decide every term: a starting term and the step. To get from $2$ to $22$ above takes $4$ steps of $5$, and $2 + 4 \\cdot 5 = 22$.

In this lesson we test whether a sequence is arithmetic, find its common difference, and fill in missing terms by counting steps.`,
    `我们会读出数列的项，也会由公式计算它们。数列最简单的增长方式是每次增加同样的量：礼堂每排比前一排多 $5$ 个座位，或者存钱罐每周存入 $5$ 元：

$$2, \\; 7, \\; 12, \\; 17, \\; 22, \\; \\ldots \\qquad (\\text{每次} +5)$$

这样的数列叫做**等差数列**，每次加上的量叫做它的**公差** $d$。知道一个数列是等差数列很有用，因为这时只要两条信息就能确定每一项：一个起始项和每一步的量。上面从 $2$ 到 $22$ 要走 $4$ 步，每步加 $5$，$2 + 4 \\cdot 5 = 22$。

这节课先检验一个数列是不是等差数列，再求它的公差，最后通过数步数补全缺失的项。`,
  ),
  knowledgePoints: [
    {
      id: "identifying-arithmetic-sequences",
      title: t("Identifying arithmetic sequences", "识别等差数列"),
      explanation: t(
        `A sequence is **arithmetic** when the same number is added to get from each term to the next. That number is the **common difference** $d$, found by subtracting any term from the term after it. Since the same number must be added at every step, a sequence is arithmetic only if all the differences between consecutive terms are equal:

$$2, 7, 12, 17: \\quad 5, 5, 5 \\quad \\text{arithmetic}; \\qquad 1, 4, 9, 16: \\quad 3, 5, 7 \\quad \\text{not arithmetic}.$$

> **Watch out.** Compute every difference, not only the first one: in $3, 5, 7, 10, 12$ the first two differences are $2$, but the third is $3$, so it is not arithmetic. A sequence that grows faster and faster, such as $1, 4, 9, 16$, has growing differences and is not arithmetic either.`,
        `如果从每一项到下一项都加上同一个数，这个数列就是**等差数列**。这个数叫做**公差** $d$，用任意一项的后一项减去这一项即可得到。因为每一步都必须加上同一个数，所以只有相邻两项的差全都相等，数列才是等差数列：

$$2, 7, 12, 17: \\quad 5, 5, 5 \\quad \\text{等差}; \\qquad 1, 4, 9, 16: \\quad 3, 5, 7 \\quad \\text{不是等差}.$$

> **注意。** 每个差都要算，不能只算第一个：在 $3, 5, 7, 10, 12$ 中，前两个差是 $2$，第三个差却是 $3$，所以它不是等差数列。像 $1, 4, 9, 16$ 这样越增越快的数列，差越来越大，也不是等差数列。`,
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
        const first = terms[0]!;
        const d0 = diffs[0]!;
        const i = diffs.findIndex((x) => x !== d0) + 1;
        const check = isArithmetic
          ? t(
              `Starting at $${num(first)}$ and ${d0 < 0 ? `subtracting $${-d0}$` : `adding $${d0}$`} four times gives $${num(first)} + 4 \\cdot ${paren(d0)} = ${num(terms[4]!)}$, the last term listed.`,
              `从 $${num(first)}$ 开始${d0 < 0 ? "减" : "加"} $4$ 次 $${Math.abs(d0)}$，得 $${num(first)} + 4 \\cdot ${paren(d0)} = ${num(terms[4]!)}$，正是列出的最后一项。`,
            )
          : t(
              `If the step were always $${num(d0)}$, the term after $${num(terms[i - 1]!)}$ would be $${num(terms[i - 1]!)}${plus(d0)} = ${num(terms[i - 1]! + d0)}$, but it is $${num(terms[i]!)}$.`,
              `如果每一步都是 $${num(d0)}$，$${num(terms[i - 1]!)}$ 后面的一项应是 $${num(terms[i - 1]!)}${plus(d0)} = ${num(terms[i - 1]! + d0)}$，但实际是 $${num(terms[i]!)}$。`,
            );
        return choiceProblem({
          prompt: t(`Is the sequence $${list(terms)}$ arithmetic?`, `数列 $${list(terms)}$ 是等差数列吗？`),
          options: yesNo,
          correct: isArithmetic ? 0 : 1,
          solution: t(
            `**Step 1: the differences.** A sequence is arithmetic when the same number is added at every step, so subtract each term from the one after it:${steps(...differences(terms))}**Step 2: compare.** ${isArithmetic ? `They are all equal, so the sequence is arithmetic with $d = ${num(d0)}$.` : "They are not all equal, so the sequence is not arithmetic."}\n\n**Check.** ${check.en}`,
            `**第一步：求差。** 每一步都加上同一个数的数列才是等差数列，所以用每一项的后一项减去这一项：${steps(...differences(terms))}**第二步：比较。** ${isArithmetic ? `它们全都相等，所以这是公差 $d = ${num(d0)}$ 的等差数列。` : "它们不全相等，所以这不是等差数列。"}\n\n**检验。** ${check["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "finding-the-common-difference",
      title: t("Finding the common difference", "求公差"),
      explanation: t(
        `The common difference is what is added to each term to get the next, so it is a term **minus the term before it**. For $20, 14, 8, 2, \\ldots$, going from $20$ to $14$ adds $-6$:

$$d = 14 - 20 = -6.$$

A decreasing arithmetic sequence has a negative common difference, an increasing one a positive common difference.

> **Watch out.** Subtract in the order later minus earlier: $20 - 14 = 6$ has the wrong sign, since the terms go down. And use two consecutive terms: $8 - 20 = -12$ spans two steps, so it is $2d$, not $d$.`,
        `公差是每一项加上后得到下一项的那个数，所以它等于某一项**减去它的前一项**。对于 $20, 14, 8, 2, \\ldots$，从 $20$ 到 $14$ 是加上 $-6$：

$$d = 14 - 20 = -6.$$

递减的等差数列公差为负，递增的等差数列公差为正。

> **注意。** 相减的顺序是后一项减前一项：$20 - 14 = 6$ 的符号错了，因为各项在减小。还要用相邻的两项：$8 - 20 = -12$ 跨了两步，是 $2d$ 而不是 $d$。`,
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
            `The common difference is what is added to a term to get the next one, so subtract the first term from the second, later minus earlier:${steps(`d = ${num(terms[1]!)} - ${paren(a1)} = ${num(d)}`)}The terms ${d < 0 ? "decrease" : "increase"}, and $d$ is ${d < 0 ? "negative" : "positive"}, as it should be.\n\n**Check.** Adding $${num(d)}$ to the next terms continues the list: $${num(terms[1]!)}${plus(d)} = ${num(terms[2]!)}$ and $${num(terms[2]!)}${plus(d)} = ${num(terms[3]!)}$.`,
            `公差是一项加上后得到下一项的数，所以用第二项减去第一项，即后一项减前一项：${steps(`d = ${num(terms[1]!)} - ${paren(a1)} = ${num(d)}`)}各项${d < 0 ? "递减" : "递增"}，$d$ 为${d < 0 ? "负" : "正"}，正与此相符。\n\n**检验。** 对后面的项加上 $${num(d)}$，正好接上列表：$${num(terms[1]!)}${plus(d)} = ${num(terms[2]!)}$，$${num(terms[2]!)}${plus(d)} = ${num(terms[3]!)}$。`,
          ),
        });
      },
    },
    {
      id: "filling-in-missing-terms",
      title: t("Filling in missing terms", "补全缺失的项"),
      explanation: t(
        `When terms are missing between two known terms, count the **steps** between them, not the blanks: each step adds $d$, and the number of steps is one more than the number of blanks. In $5, \\square, \\square, 23$ there are $3$ steps from $5$ to $23$, so

$$3d = 23 - 5 = 18, \\quad d = 6,$$

and the missing terms are $5 + 6 = 11$ and $11 + 6 = 17$. Indeed $17 + 6 = 23$.

> **Watch out.** Two blanks make three steps. Dividing $18$ by the $2$ blanks gives $9$, and then $5 + 9 + 9 = 23$ leaves no room for the last step: the terms would be $14$ and $23$, not two new numbers.`,
        `当两个已知项之间缺少若干项时，数它们之间的**步数**，而不是空格数：每一步加上 $d$，步数比空格数多一。在 $5, \\square, \\square, 23$ 中，从 $5$ 到 $23$ 共有 $3$ 步，所以

$$3d = 23 - 5 = 18, \\quad d = 6,$$

缺失的两项是 $5 + 6 = 11$ 和 $11 + 6 = 17$。确实 $17 + 6 = 23$。

> **注意。** 两个空格对应三步。用 $18$ 除以 $2$ 个空格得 $9$，可是 $5 + 9 + 9 = 23$ 就没有留下最后一步：两个空格会填成 $14$ 和 $23$，而不是两个新的数。`,
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
        const term = `${num(a1)}${j === 1 ? "" : ` + ${j}`}${j === 1 ? plus(d) : ` \\cdot ${paren(d)}`} = ${num(terms[j]!)}`;
        const row = terms.map(num).join(", ");
        return numberProblem({
          prompt: t(
            `The numbers $${shown}$ form an arithmetic sequence. What number goes in the ${en} box?`,
            `$${shown}$ 构成等差数列。${zh}个方框中应填什么数？`,
          ),
          answer: terms[j]!,
          wrong: [Q.of(a1).add(Q.of((last - a1) * j, blanks)), d, terms[j + 1]!],
          solution: t(
            `**Step 1: count the steps.** The $${blanks}$ boxes sit between $${num(a1)}$ and $${num(last)}$, so there are $${blanks} + 1 = ${blanks + 1}$ steps from one to the other, each adding $d$.\n\n**Step 2: the common difference.** The whole change is $${blanks + 1}$ steps of $d$:${steps(`${blanks + 1}d = ${num(last)} - ${paren(a1)} = ${num(last - a1)}`, `d = ${num(d)}`)}**Step 3: the box.** The ${en} box is $${j}$ ${j === 1 ? "step" : "steps"} after $${num(a1)}$: $${term}$.\n\n**Check.** The full row $${row}$ changes by $${num(d)}$ at every step and ends at $${num(last)}$.`,
            `**第一步：数步数。** $${blanks}$ 个方框位于 $${num(a1)}$ 和 $${num(last)}$ 之间，所以从一个到另一个共 $${blanks} + 1 = ${blanks + 1}$ 步，每步加 $d$。\n\n**第二步：求公差。** 总的变化是 $${blanks + 1}$ 步的 $d$：${steps(`${blanks + 1}d = ${num(last)} - ${paren(a1)} = ${num(last - a1)}`, `d = ${num(d)}`)}**第三步：填方框。** ${zh}个方框在 $${num(a1)}$ 之后 $${j}$ 步：$${term}$。\n\n**检验。** 完整的一行 $${row}$ 每步都变化 $${num(d)}$，并且最后是 $${num(last)}$。`,
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
  encompasses: [{ topic: "arithmetic-sequences", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.HSF.BF.A.2"],
  intro: t(
    `An arithmetic sequence adds its common difference $d$ to get from each term to the next, and a recursive formula gives a first term and a rule for the next term. Put together, every arithmetic sequence has a recursive formula of the same shape:

$$a_1 = \\text{first term}, \\qquad a_n = a_{n-1} + d.$$

For $9, 5, 1, -3, \\ldots$ the first term is $9$ and each step adds $5 - 9 = -4$, so $a_1 = 9$ and $a_n = a_{n-1} - 4$.

The formula also tells us how far apart two terms are. From $a_1$ to $a_6$ the rule is used $5$ times, so $a_6 = 9 + 5 \\cdot (-4) = -11$, with no need to write the terms in between.

In this lesson we write the recursive formula of an arithmetic sequence, use it to find terms forward and backward, and find the common difference from two terms far apart.`,
    `等差数列每次加上公差 $d$ 得到下一项，而递推公式给出首项和求下一项的规则。两者合在一起，每个等差数列都有形式相同的递推公式：

$$a_1 = \\text{首项}, \\qquad a_n = a_{n-1} + d.$$

对于 $9, 5, 1, -3, \\ldots$，首项是 $9$，每一步加上 $5 - 9 = -4$，所以 $a_1 = 9$，$a_n = a_{n-1} - 4$。

这个公式还告诉我们两项相隔多远。从 $a_1$ 到 $a_6$ 要用 $5$ 次规则，所以 $a_6 = 9 + 5 \\cdot (-4) = -11$，不必写出中间的项。

这节课写出等差数列的递推公式，用它向前、向后求项，并由相隔较远的两项求公差。`,
  ),
  knowledgePoints: [
    {
      id: "writing-the-recursive-formula",
      title: t("Writing the recursive formula", "写出递推公式"),
      explanation: t(
        `Every arithmetic sequence has a recursive formula of the same shape: the first term, and the rule *add the common difference*.

$$a_1 = \\text{first term}, \\qquad a_n = a_{n-1} + d.$$

The first part says where the sequence starts, the second how it moves on. For $9, 5, 1, -3, \\ldots$ the first term is $9$ and the common difference is $5 - 9 = -4$, so $a_1 = 9$ and $a_n = a_{n-1} - 4$. Starting at $9$ and subtracting $4$ again and again gives back $5, 1, -3$.

> **Watch out.** The sign of $d$ comes from later minus earlier: these terms go down, so the rule subtracts $4$, and $a_{n-1} + 4$ would go up. The formula starts at the first listed term, $9$, not the second. And the rule adds $d$; it does not multiply by it.`,
        `每个等差数列的递推公式都有相同的形式：第一项，以及规则*加上公差*。

$$a_1 = \\text{首项}, \\qquad a_n = a_{n-1} + d.$$

第一部分说明数列从哪里开始，第二部分说明怎样往下走。对于 $9, 5, 1, -3, \\ldots$，首项是 $9$，公差是 $5 - 9 = -4$，所以 $a_1 = 9$，$a_n = a_{n-1} - 4$。从 $9$ 开始一次次减去 $4$，又得到 $5, 1, -3$。

> **注意。** $d$ 的符号由后一项减前一项决定：这些项在减小，所以规则是减去 $4$，而 $a_{n-1} + 4$ 会越来越大。公式从列出的第一项 $9$ 开始，而不是第二项。规则是加上 $d$，不是乘以 $d$。`,
      ),
      generate(rng) {
        const a1 = Q.of(rng.int(-15, 20));
        const d = Q.of(rng.sign() * rng.int(2, 9));
        const terms = arithmeticRecursive(a1, d).terms.slice(0, 4);
        const correct = arithmeticRecursive(a1, d);
        const shown = terms.map(num).join(", ");
        return reasoned(
          formulaChoice(
            rng,
            t(`Which recursive formula defines the sequence $${list(terms)}$?`, `哪个递推公式定义了数列 $${list(terms)}$？`),
            correct,
            [arithmeticRecursive(a1, d.neg()), arithmeticRecursive(a1.add(d), d), geometricRecursive(a1, d), arithmeticRecursive(d, a1)],
            t(
              `**Step 1: the first term.** The sequence starts at $a_1 = ${a1.toLatex()}$.\n\n**Step 2: the common difference.** Subtract the first term from the second, later minus earlier: $d = ${num(terms[1]!)} - ${paren(a1)} = ${d.toLatex()}$. Each term is the one before ${d.sign() < 0 ? `minus $${d.neg().toLatex()}$` : `plus $${d.toLatex()}$`}, so $${correct.latex}$.\n\n**Check.** Starting at $${a1.toLatex()}$ and ${d.sign() < 0 ? `subtracting $${d.neg().toLatex()}$` : `adding $${d.toLatex()}$`} each time gives $${shown}$, the given terms.`,
              `**第一步：首项。** 数列从 $a_1 = ${a1.toLatex()}$ 开始。\n\n**第二步：公差。** 用第二项减去第一项，即后一项减前一项：$d = ${num(terms[1]!)} - ${paren(a1)} = ${d.toLatex()}$。每一项等于前一项${d.sign() < 0 ? `减去 $${d.neg().toLatex()}$` : `加上 $${d.toLatex()}$`}，所以 $${correct.latex}$。\n\n**检验。** 从 $${a1.toLatex()}$ 开始每次${d.sign() < 0 ? `减去 $${d.neg().toLatex()}$` : `加上 $${d.toLatex()}$`}，得到 $${shown}$，正是所给的项。`,
            ),
          ),
          [
            [
              `$${arithmeticRecursive(a1, d.neg()).latex}$`,
              "The common difference has the wrong sign: subtract a later term minus an earlier one, in that order.",
              "公差的符号错了：应该用后一项减前一项。",
            ],
            [
              `$${arithmeticRecursive(a1.add(d), d).latex}$`,
              "This starts at the second term of the sequence instead of the first.",
              "这里从数列的第二项开始，而不是第一项。",
            ],
            [
              `$${geometricRecursive(a1, d).latex}$`,
              "This multiplies, but this sequence adds the same amount each time.",
              "这里用的是乘法，但这个数列每次加上同一个数。",
            ],
            [`$${arithmeticRecursive(d, a1).latex}$`, "The first term and the step are swapped.", "首项和每一步的量弄反了。"],
          ],
        );
      },
    },
    {
      id: "terms-from-the-recursive-formula",
      title: t("Terms from the recursive formula", "由递推公式求项"),
      explanation: t(
        `Each use of the rule $a_n = a_{n-1} + d$ moves one place and adds $d$. From $a_1$ to $a_k$ there are $k - 1$ steps, because $a_1$ itself takes none, so $d$ is added $k - 1$ times. With $a_1 = 3$ and $a_n = a_{n-1} + 4$,

$$a_6 = 3 + 5 \\cdot 4 = 23.$$

Going backward, each step subtracts $d$ instead: if $a_5 = 30$ and $a_n = a_{n-1} - 2$, then four steps back give $a_1 = 30 - 4 \\cdot (-2) = 38$.

> **Watch out.** Count steps, not terms: $a_6$ is $5$ steps from $a_1$, and $3 + 6 \\cdot 4 = 27$ is $a_7$. Going backward, subtract $d$: with $d = -2$ the earlier terms are larger, $38$, not $30 - 8 = 22$.`,
        `规则 $a_n = a_{n-1} + d$ 每用一次就前进一位并加上 $d$。从 $a_1$ 到 $a_k$ 共有 $k - 1$ 步，因为 $a_1$ 本身不用走，所以 $d$ 加了 $k - 1$ 次。当 $a_1 = 3$，$a_n = a_{n-1} + 4$ 时，

$$a_6 = 3 + 5 \\cdot 4 = 23.$$

向前倒推时，每一步改为减去 $d$：若 $a_5 = 30$ 且 $a_n = a_{n-1} - 2$，往回退四步得 $a_1 = 30 - 4 \\cdot (-2) = 38$。

> **注意。** 数的是步数，不是项数：$a_6$ 离 $a_1$ 有 $5$ 步，$3 + 6 \\cdot 4 = 27$ 是 $a_7$。往回推要减去 $d$：$d = -2$ 时前面的项更大，是 $38$，而不是 $30 - 8 = 22$。`,
      ),
      generate(rng) {
        const a1 = rng.int(-20, 20);
        const d = rng.nonZero(-9, 9);
        const k = rng.int(4, 9);
        const ak = a1 + (k - 1) * d;
        const rule = poly([1, "a_{n-1}"], [d, ""]);
        const forward = chainEq(`a_{${k}} = ${a1} + ${k - 1} \\cdot ${paren(d)}`, `${a1}${plus((k - 1) * d)}`, `${ak}`);
        const backward = chainEq(`a_1 = ${ak} - ${k - 1} \\cdot ${paren(d)}`, `${ak}${plus(-(k - 1) * d)}`, `${a1}`);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `A sequence is defined by $a_1 = ${a1}$ and $a_n = ${rule}$. Find $a_{${k}}$.`,
              `数列由 $a_1 = ${a1}$ 和 $a_n = ${rule}$ 定义。求 $a_{${k}}$。`,
            ),
            answer: ak,
            wrong: [a1 + k * d, a1 + (k - 2) * d],
            solution: t(
              `**Step 1: count the steps.** Each use of the rule moves one place and ${d < 0 ? `subtracts $${-d}$` : `adds $${d}$`}. From $a_1$ to $a_{${k}}$ there are $${k} - 1 = ${k - 1}$ steps.\n\n**Step 2: add them up.**${steps(forward)}**Check.** Walk back the $${k - 1}$ steps from $a_{${k}}$: $${ak} - ${k - 1} \\cdot ${paren(d)} = ${a1}$, the given first term.`,
              `**第一步：数步数。** 规则每用一次前进一位并${d < 0 ? `减去 $${-d}$` : `加上 $${d}$`}。从 $a_1$ 到 $a_{${k}}$ 共 $${k} - 1 = ${k - 1}$ 步。\n\n**第二步：累加。**${steps(forward)}**检验。** 从 $a_{${k}}$ 往回退 $${k - 1}$ 步：$${ak} - ${k - 1} \\cdot ${paren(d)} = ${a1}$，正是所给的首项。`,
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
            `**Step 1: count the steps.** Going back from $a_{${k}}$ to $a_1$ takes $${k} - 1 = ${k - 1}$ steps, and each step back undoes the rule, ${d < 0 ? `adding $${-d}$` : `subtracting $${d}$`}.\n\n**Step 2: step back.**${steps(backward)}**Check.** Run the rule forward from $a_1$: $${a1} + ${k - 1} \\cdot ${paren(d)} = ${ak}$, the given $a_{${k}}$.`,
            `**第一步：数步数。** 从 $a_{${k}}$ 倒推到 $a_1$ 共 $${k} - 1 = ${k - 1}$ 步，每退一步就撤销一次规则，即${d < 0 ? `加上 $${-d}$` : `减去 $${d}$`}。\n\n**第二步：往回推。**${steps(backward)}**检验。** 从 $a_1$ 起向前应用规则：$${a1} + ${k - 1} \\cdot ${paren(d)} = ${ak}$，正是所给的 $a_{${k}}$。`,
          ),
        });
      },
    },
  ],
};

/** explicitSteps writes the simplification a_1 + (n - 1)d = dn + c. */
const explicitSteps = (a1: number, d: number) =>
  steps(
    `a_n = ${a1 === 0 ? "" : `${num(a1)} + `}(n - 1) \\cdot ${paren(d)}`,
    ...(a1 === 0 ? [] : [`a_n = ${num(a1)} ${d < 0 ? "-" : "+"} ${poly([Math.abs(d), "n"])} ${d < 0 ? "+" : "-"} ${Math.abs(d)}`]),
    `a_n = ${poly([d, "n"], [a1 - d, ""])}`,
  );

/** atIndex writes dn + c evaluated at n = k: "3 \cdot 2 - 1", "2 - 1", "-2 + 4". */
const atIndex = (d: number, c: number, k: number) => `${scaled(d, String(k))}${plus(c)}`;

/** explicitCheck checks a_n = dn + (a1 - d) at n = 1 and n = 2 against a_1 and a_2 = a_1 + d. */
function explicitCheck(a1: number, d: number): Text {
  const c = a1 - d;
  const one = chainEq(atIndex(d, c, 1), num(a1));
  const two = chainEq(atIndex(d, c, 2), num(a1 + d));
  return t(
    `At $n = 1$ the formula gives $${one}$, the first term, and at $n = 2$ it gives $${two}$, one step of $${d}$ later.`,
    `$n = 1$ 时公式给出 $${one}$，正是首项；$n = 2$ 时给出 $${two}$，恰好又走了一步 $${d}$。`,
  );
}

/** moves writes what a step of d does: "adds $3$", "subtracts $3$". */
const moves = (d: number): Text => (d < 0 ? t(`subtracts $${-d}$`, `减去 $${-d}$`) : t(`adds $${d}$`, `加上 $${d}$`));

export const nthTermOfAnArithmeticSequence: TopicDef = {
  id: "nth-term-of-an-arithmetic-sequence",
  title: t("The Nth Term of an Arithmetic Sequence", "等差数列的通项"),
  summary: t("Use and write the explicit formula $a_n = a_1 + (n - 1)d$.", "使用并写出通项公式 $a_n = a_1 + (n - 1)d$。"),
  prerequisites: ["arithmetic-sequences", "simplifying-expressions"],
  encompasses: [{ topic: "arithmetic-sequences", weight: 0.5 }],
  xp: 14,
  standards: ["CCSS.HSF.BF.A.2", "CCSS.HSF.LE.A.2"],
  intro: t(
    `An arithmetic sequence adds its common difference $d$ at every step, so any term can be reached from the first by counting steps. For $7, 10, 13, \\ldots$, where $d = 3$:

$$a_1 = 7, \\quad a_2 = 7 + 1 \\cdot 3, \\quad a_3 = 7 + 2 \\cdot 3, \\quad a_4 = 7 + 3 \\cdot 3, \\quad \\ldots$$

The term in position $n$ is $n - 1$ steps after the first, because the first term itself takes no step. That gives the **explicit formula** of an arithmetic sequence:

$$a_n = a_1 + (n - 1)d.$$

With it, the $40$th term of $7, 10, 13, \\ldots$ is $7 + 39 \\cdot 3 = 124$, found without writing the $38$ terms in between.

In this lesson we use the formula to find far terms, write it for a given sequence and simplify it, and read the first term and the common difference from a formula.`,
    `等差数列每一步都加上公差 $d$，所以从首项出发数步数，就能到达任何一项。对于 $7, 10, 13, \\ldots$，$d = 3$：

$$a_1 = 7, \\quad a_2 = 7 + 1 \\cdot 3, \\quad a_3 = 7 + 2 \\cdot 3, \\quad a_4 = 7 + 3 \\cdot 3, \\quad \\ldots$$

位置 $n$ 上的项在首项之后 $n - 1$ 步，因为首项本身不用走。这就得到等差数列的**通项公式**：

$$a_n = a_1 + (n - 1)d.$$

用它求 $7, 10, 13, \\ldots$ 的第 $40$ 项，得 $7 + 39 \\cdot 3 = 124$，不必写出中间的 $38$ 项。

这节课用这个公式求很远的项，为给定的数列写出公式并化简，并从公式中读出首项和公差。`,
  ),
  knowledgePoints: [
    {
      id: "finding-a-distant-term",
      title: t("Finding a distant term", "求较远的项"),
      explanation: t(
        `To reach $a_n$ from $a_1$, add the common difference once for each step. There are $n - 1$ steps, since the first term takes none:

$$a_n = a_1 + (n - 1)d.$$

For $7, 10, 13, \\ldots$ we have $a_1 = 7$ and $d = 10 - 7 = 3$, so the $40$th term is $39$ steps after the first:

$$a_{40} = 7 + 39 \\cdot 3 = 7 + 117 = 124.$$

> **Watch out.** Multiply $d$ by $n - 1$, not by $n$: $7 + 40 \\cdot 3 = 127$ is the $41$st term. Keep the first term: $39 \\cdot 3 = 117$ is only the change from $a_1$. And with a negative $d$ the terms go down, so the product is subtracted.`,
        `从 $a_1$ 到 $a_n$，每走一步加一次公差。共有 $n - 1$ 步，因为首项不用走：

$$a_n = a_1 + (n - 1)d.$$

对于 $7, 10, 13, \\ldots$，$a_1 = 7$，$d = 10 - 7 = 3$，所以第 $40$ 项在首项之后 $39$ 步：

$$a_{40} = 7 + 39 \\cdot 3 = 7 + 117 = 124.$$

> **注意。** $d$ 要乘以 $n - 1$ 而不是 $n$：$7 + 40 \\cdot 3 = 127$ 是第 $41$ 项。不要丢掉首项：$39 \\cdot 3 = 117$ 只是相对 $a_1$ 的变化量。$d$ 为负时各项递减，乘积要减去。`,
      ),
      generate(rng) {
        const a1 = rng.int(-20, 30);
        const d = rng.nonZero(-12, 12);
        const k = rng.int(15, 100);
        const terms = arithmetic(a1, d, 4);
        const ak = a1 + (k - 1) * d;
        const work = chainEq(
          `a_{${k}} = ${a1} + (${k} - 1) \\cdot ${paren(d)}`,
          `${a1} + ${k - 1} \\cdot ${paren(d)}`,
          `${a1}${plus((k - 1) * d)}`,
          `${ak}`,
        );
        return numberProblem({
          prompt: t(
            `Find the ${ordinal(k)} term of the arithmetic sequence $${list(terms)}$`,
            `求等差数列 $${list(terms)}$ 的第 $${k}$ 项。`,
          ),
          answer: ak,
          wrong: [a1 + k * d, (k - 1) * d, a1 - (k - 1) * d],
          solution: t(
            `**Step 1: read the sequence.** The first term is $a_1 = ${a1}$ and the common difference is $d = ${num(terms[1]!)} - ${paren(a1)} = ${d}$.\n\n**Step 2: count the steps.** The ${ordinal(k)} term is $${k} - 1 = ${k - 1}$ steps after the first, so $d$ is added $${k - 1}$ times:${steps(work)}**Check.** The change from $a_1$ is $${ak} - ${paren(a1)} = ${ak - a1}$, and $${ak - a1} \\div ${paren(d)} = ${k - 1}$, one step for each term after the first.`,
            `**第一步：读出数列。** 首项 $a_1 = ${a1}$，公差 $d = ${num(terms[1]!)} - ${paren(a1)} = ${d}$。\n\n**第二步：数步数。** 第 $${k}$ 项在首项之后 $${k} - 1 = ${k - 1}$ 步，所以要加 $${k - 1}$ 次 $d$：${steps(work)}**检验。** 相对 $a_1$ 的变化量是 $${ak} - ${paren(a1)} = ${ak - a1}$，而 $${ak - a1} \\div ${paren(d)} = ${k - 1}$，首项之后的每一项各一步。`,
          ),
        });
      },
    },
    {
      id: "writing-the-explicit-formula",
      title: t("Writing the explicit formula", "写出通项公式"),
      explanation: t(
        `To write the explicit formula of a given arithmetic sequence, substitute its $a_1$ and $d$ into $a_n = a_1 + (n - 1)d$, then expand the bracket and collect the constants. For $5, 8, 11, \\ldots$, with $a_1 = 5$ and $d = 3$:

$$a_n = 5 + (n - 1) \\cdot 3 = 5 + 3n - 3 = 3n + 2.$$

Check with $n = 1$: $3 \\cdot 1 + 2 = 5$, the first term. The coefficient of $n$ is the common difference, and the constant is what is left after taking one $d$ away from $a_1$.

> **Watch out.** The constant is **not** the first term: $3n + 5$ gives $8$ at $n = 1$, which is the second term. The coefficient of $n$ is $d$, not $a_1$, and it keeps its sign when the terms go down.`,
        `要写出给定等差数列的通项公式，把它的 $a_1$ 和 $d$ 代入 $a_n = a_1 + (n - 1)d$，再展开括号、合并常数。对于 $5, 8, 11, \\ldots$，$a_1 = 5$，$d = 3$：

$$a_n = 5 + (n - 1) \\cdot 3 = 5 + 3n - 3 = 3n + 2.$$

用 $n = 1$ 检验：$3 \\cdot 1 + 2 = 5$，正是首项。$n$ 的系数是公差，常数项是 $a_1$ 减去一个 $d$ 后剩下的部分。

> **注意。** 常数项**不是**首项：$3n + 5$ 在 $n = 1$ 时等于 $8$，那是第二项。$n$ 的系数是 $d$ 而不是 $a_1$，各项递减时它保留负号。`,
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
            `**Step 1: read the sequence.** The first term is $a_1 = ${a1}$ and the common difference is $d = ${num(terms[1]!)} - ${paren(a1)} = ${d}$.\n\n**Step 2: substitute and simplify.** Put them into $a_n = a_1 + (n - 1)d$, expand the bracket and collect the constants:${explicitSteps(a1, d)}**Check.** ${explicitCheck(a1, d).en}`,
            `**第一步：读出数列。** 首项 $a_1 = ${a1}$，公差 $d = ${num(terms[1]!)} - ${paren(a1)} = ${d}$。\n\n**第二步：代入并化简。** 代入 $a_n = a_1 + (n - 1)d$，展开括号并合并常数：${explicitSteps(a1, d)}**检验。** ${explicitCheck(a1, d)["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "reading-an-explicit-formula",
      title: t("Reading an explicit formula", "读懂通项公式"),
      explanation: t(
        `In $a_n = dn + c$, the common difference is the coefficient $d$ of $n$, because each time $n$ grows by $1$ the term $dn$ grows by $d$ while $c$ stays the same. The first term is the value at $n = 1$, $a_1 = d + c$. For $a_n = 4n - 9$: $d = 4$ and $a_1 = 4 - 9 = -5$.

In $a_n = 7 - 2(n - 1)$, the formula is already written as $a_1 + (n - 1)d$: at $n = 1$ the bracket is $0$, so $a_1 = 7$, and $d = -2$, the sign in front included.

> **Watch out.** The constant $c$ in $dn + c$ is not the first term: substitute $n = 1$. In $7 - 2(n - 1)$ the common difference is $-2$, not $2$: the terms go down.`,
        `在 $a_n = dn + c$ 中，公差是 $n$ 的系数 $d$，因为 $n$ 每增加 $1$，$dn$ 就增加 $d$，而 $c$ 不变。首项是 $n = 1$ 时的值 $a_1 = d + c$。对于 $a_n = 4n - 9$：$d = 4$，$a_1 = 4 - 9 = -5$。

$a_n = 7 - 2(n - 1)$ 已经写成 $a_1 + (n - 1)d$ 的形式：$n = 1$ 时括号为 $0$，所以 $a_1 = 7$；$d = -2$，前面的符号也算在内。

> **注意。** $dn + c$ 中的常数 $c$ 不是首项：要代入 $n = 1$。在 $7 - 2(n - 1)$ 中，公差是 $-2$ 而不是 $2$：各项在减小。`,
      ),
      generate(rng) {
        const d = rng.nonZero(-9, 9);
        const askFirst = rng.bool();
        const [what, whatZh] = askFirst ? ["first term", "首项"] : ["common difference", "公差"];
        if (rng.bool()) {
          const c = rng.nonZero(-20, 20);
          const expr = poly([d, "n"], [c, ""]);
          const one = chainEq(`a_1 = ${atIndex(d, c, 1)}`, `${d + c}`);
          const two = chainEq(`a_2 = ${atIndex(d, c, 2)}`, `${2 * d + c}`);
          return numberProblem({
            prompt: t(
              `An arithmetic sequence has $a_n = ${expr}$. What is its ${what}?`,
              `等差数列的通项为 $a_n = ${expr}$。它的${whatZh}是多少？`,
            ),
            answer: askFirst ? d + c : d,
            wrong: askFirst ? [c, d] : [c, -d, d + c],
            solution: askFirst
              ? t(
                  `The first term is the value of the formula at $n = 1$, so substitute $n = 1$:${steps(one)}The constant $${c}$ alone is not the first term, because the term $${poly([d, "n"])}$ is not $0$ at $n = 1$.\n\n**Check.** The next term is $${two}$, and $${2 * d + c} - ${paren(d + c)} = ${d}$, the coefficient of $n$: the sequence starts at $${d + c}$ and moves by $${d}$.`,
                  `首项是公式在 $n = 1$ 时的值，所以代入 $n = 1$：${steps(one)}单独的常数 $${c}$ 不是首项，因为 $n = 1$ 时 $${poly([d, "n"])}$ 这一项不为 $0$。\n\n**检验。** 下一项是 $${two}$，而 $${2 * d + c} - ${paren(d + c)} = ${d}$，正是 $n$ 的系数：数列从 $${d + c}$ 开始，每步变化 $${d}$。`,
                )
              : t(
                  `Each time $n$ grows by $1$, the term $${poly([d, "n"])}$ changes by $${d}$ and the constant $${c}$ stays the same, so the common difference is the coefficient of $n$: $d = ${d}$.\n\n**Check.** Two consecutive terms: $${one}$ and $${two}$, and $${2 * d + c} - ${paren(d + c)} = ${d}$.`,
                  `$n$ 每增加 $1$，$${poly([d, "n"])}$ 这一项变化 $${d}$，常数 $${c}$ 不变，所以公差是 $n$ 的系数：$d = ${d}$。\n\n**检验。** 相邻两项：$${one}$，$${two}$，而 $${2 * d + c} - ${paren(d + c)} = ${d}$。`,
                ),
          });
        }
        const a1 = rng.nonZero(-20, 30);
        const expr = `${a1}${d < 0 ? " -" : " +"} ${Math.abs(d) === 1 ? "" : Math.abs(d)}(n - 1)`;
        const second = `a_2 = ${a1} ${d < 0 ? "-" : "+"} ${Math.abs(d) === 1 ? "" : Math.abs(d)}(2 - 1) = ${a1 + d}`;
        return numberProblem({
          prompt: t(
            `An arithmetic sequence has $a_n = ${expr}$. What is its ${what}?`,
            `等差数列的通项为 $a_n = ${expr}$。它的${whatZh}是多少？`,
          ),
          answer: askFirst ? a1 : d,
          wrong: askFirst ? [a1 - d, a1 + d] : [a1, -d],
          solution: t(
            `The formula has the form $a_1 + (n - 1)d$. At $n = 1$ the bracket $n - 1$ is $0$, so the first term is the number in front, $a_1 = ${a1}$. Each time $n$ grows by $1$ the bracket grows by $1$, so the term changes by the number multiplying it, sign included: $d = ${d}$.\n\nThe ${what} is $${askFirst ? a1 : d}$.\n\n**Check.** The second term is $${second}$, which is $${a1}${plus(d)}$: one step of $${d}$ after $a_1 = ${a1}$.`,
            `公式形如 $a_1 + (n - 1)d$。$n = 1$ 时括号 $n - 1$ 为 $0$，所以首项就是前面的数 $a_1 = ${a1}$。$n$ 每增加 $1$，括号就增加 $1$，所以项的变化量是括号前的乘数，连同符号：$d = ${d}$。\n\n${whatZh}是 $${askFirst ? a1 : d}$。\n\n**检验。** 第二项是 $${second}$，即 $${a1}${plus(d)}$：在 $a_1 = ${a1}$ 之后走了一步 $${d}$。`,
          ),
        });
      },
    },
  ],
};

export const explicitAndRecursiveArithmeticFormulas: TopicDef = {
  id: "explicit-and-recursive-arithmetic-formulas",
  title: t("Translating Between Explicit and Recursive Formulas for Arithmetic Sequences", "等差数列通项公式与递推公式的互化"),
  summary: t(
    "Translate between the explicit and the recursive formula of an arithmetic sequence.",
    "在等差数列的通项公式与递推公式之间互相转换。",
  ),
  prerequisites: ["recursive-formulas-for-arithmetic-sequences", "nth-term-of-an-arithmetic-sequence"],
  encompasses: [{ topic: "nth-term-of-an-arithmetic-sequence", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSF.BF.A.2"],
  intro: t(
    `An arithmetic sequence can be described in two ways: recursively, by $a_1$ and the rule $a_n = a_{n-1} + d$, or explicitly, by $a_n = a_1 + (n - 1)d$, which simplifies to $a_n = dn + c$. The recursive formula shows the step from one term to the next; the explicit one reaches any term at once.

Both are built from the same two numbers, the first term and the common difference, so translating means reading those two numbers from one formula and putting them into the other. From $a_1 = -2$ and $a_n = a_{n-1} + 5$:

$$a_n = -2 + (n - 1) \\cdot 5 = 5n - 7.$$

Going back, $5n - 7$ has $d = 5$, the coefficient of $n$, and $a_1 = 5 \\cdot 1 - 7 = -2$.

In this lesson we turn recursive formulas into explicit ones and back, and use the translation to find a term far along a recursive sequence.`,
    `等差数列有两种描述方式：递推地，用 $a_1$ 和规则 $a_n = a_{n-1} + d$；或者用通项公式 $a_n = a_1 + (n - 1)d$，它可以化简为 $a_n = dn + c$。递推公式展示从一项到下一项的那一步，通项公式则能一下子得到任何一项。

两者都由同样的两个数构成：首项和公差。所以互化就是从一个公式中读出这两个数，再把它们放进另一个公式。由 $a_1 = -2$ 和 $a_n = a_{n-1} + 5$：

$$a_n = -2 + (n - 1) \\cdot 5 = 5n - 7.$$

反过来，$5n - 7$ 的 $d = 5$ 是 $n$ 的系数，$a_1 = 5 \\cdot 1 - 7 = -2$。

这节课把递推公式化为通项公式并化回来，再用这种互化求递推数列中很远的一项。`,
  ),
  knowledgePoints: [
    {
      id: "recursive-to-explicit",
      title: t("From recursive to explicit", "由递推公式到通项公式"),
      explanation: t(
        `A recursive formula gives each term from the one before, while an explicit formula gives any term directly from its position.

A recursive formula $a_1 = a$, $a_n = a_{n-1} + d$ states the first term and the common difference outright: $a$ is where the sequence starts and $d$ is what each step adds. Substitute them into $a_n = a_1 + (n - 1)d$ and simplify:

$$a_1 = -2, \\; a_n = a_{n-1} + 5 \\quad\\Longrightarrow\\quad a_n = -2 + (n - 1) \\cdot 5 = -2 + 5n - 5 = 5n - 7.$$

At $n = 1$ this gives $5 - 7 = -2$, the given start.

> **Watch out.** The constant of the explicit formula is $a_1 - d$, not $a_1$: $5n - 2$ would start at $3$. And the coefficient of $n$ is the step $d$, not the first term.`,
        `递推公式由前一项得到每一项，而通项公式可以由项的位置直接求出任何一项。

递推公式 $a_1 = a$，$a_n = a_{n-1} + d$ 直接写明了首项和公差：$a$ 是数列的起点，$d$ 是每一步加上的数。把它们代入 $a_n = a_1 + (n - 1)d$ 并化简：

$$a_1 = -2, \\; a_n = a_{n-1} + 5 \\quad\\Longrightarrow\\quad a_n = -2 + (n - 1) \\cdot 5 = -2 + 5n - 5 = 5n - 7.$$

$n = 1$ 时得 $5 - 7 = -2$，正是给定的起点。

> **注意。** 通项公式的常数项是 $a_1 - d$，不是 $a_1$：$5n - 2$ 会从 $3$ 开始。$n$ 的系数是每一步的 $d$，不是首项。`,
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
            `**Step 1: read the recursive formula.** The sequence starts at $a_1 = ${a1}$, and each step ${moves(d).en}, so the common difference is $d = ${d}$.\n\n**Step 2: substitute and simplify.** Put them into $a_n = a_1 + (n - 1)d$:${explicitSteps(a1, d)}**Check.** ${explicitCheck(a1, d).en}`,
            `**第一步：读出递推公式。** 数列从 $a_1 = ${a1}$ 开始，每一步${moves(d)["zh-CN"]}，所以公差 $d = ${d}$。\n\n**第二步：代入并化简。** 代入 $a_n = a_1 + (n - 1)d$：${explicitSteps(a1, d)}**检验。** ${explicitCheck(a1, d)["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "explicit-to-recursive",
      title: t("From explicit to recursive", "由通项公式到递推公式"),
      explanation: t(
        `A recursive formula needs the first term and the step. From an explicit formula $a_n = dn + c$, the step is the coefficient $d$ of $n$, since each time $n$ grows by $1$ the term grows by $d$; the first term is the value at $n = 1$:

$$a_n = 6n - 10: \\quad a_1 = 6 \\cdot 1 - 10 = -4, \\quad d = 6 \\quad\\Longrightarrow\\quad a_1 = -4, \\; a_n = a_{n-1} + 6.$$

Both formulas give $a_2 = 2$: $6 \\cdot 2 - 10 = 2$ and $-4 + 6 = 2$.

> **Watch out.** Start at the value at $n = 1$, not at the constant: $a_1 = -10$ would leave out the $6n$. And the rule adds the coefficient of $n$, $6$, not the constant $-10$.`,
        `递推公式需要首项和每一步的量。由通项公式 $a_n = dn + c$，每一步的量是 $n$ 的系数 $d$，因为 $n$ 每增加 $1$，项就增加 $d$；首项是 $n = 1$ 时的值：

$$a_n = 6n - 10: \\quad a_1 = 6 \\cdot 1 - 10 = -4, \\quad d = 6 \\quad\\Longrightarrow\\quad a_1 = -4, \\; a_n = a_{n-1} + 6.$$

两个公式都给出 $a_2 = 2$：$6 \\cdot 2 - 10 = 2$，$-4 + 6 = 2$。

> **注意。** 起点是 $n = 1$ 时的值，不是常数项：$a_1 = -10$ 漏掉了 $6n$。规则加上的是 $n$ 的系数 $6$，不是常数 $-10$。`,
      ),
      generate(rng) {
        const p = Q.of(rng.sign() * rng.int(2, 12));
        const c = Q.of(rng.nonZero(-20, 20));
        const a1 = p.add(c);
        const correct = arithmeticRecursive(a1, p);
        const a2 = a1.add(p);
        return reasoned(
          formulaChoice(
            rng,
            t(
              `Which recursive formula defines the sequence $a_n = ${poly([p, "n"], [c, ""])}$?`,
              `哪个递推公式定义了数列 $a_n = ${poly([p, "n"], [c, ""])}$？`,
            ),
            correct,
            [arithmeticRecursive(c, p), arithmeticRecursive(a1, c), arithmeticRecursive(a1.add(p), p), geometricRecursive(a1, p)],
            t(
              `**Step 1: the step.** Each time $n$ grows by $1$, the term changes by the coefficient of $n$, so $d = ${p.toLatex()}$.\n\n**Step 2: the first term.** Substitute $n = 1$: $a_1 = ${p.toLatex()} \\cdot 1${plus(c)} = ${a1.toLatex()}$. So $${correct.latex}$.\n\n**Check.** Both formulas give the same second term: $${p.toLatex()} \\cdot 2${plus(c)} = ${a2.toLatex()}$ and $${a1.toLatex()}${plus(p)} = ${a2.toLatex()}$.`,
              `**第一步：每一步的量。** $n$ 每增加 $1$，项就变化 $n$ 的系数，所以 $d = ${p.toLatex()}$。\n\n**第二步：首项。** 代入 $n = 1$：$a_1 = ${p.toLatex()} \\cdot 1${plus(c)} = ${a1.toLatex()}$。所以 $${correct.latex}$。\n\n**检验。** 两个公式给出相同的第二项：$${p.toLatex()} \\cdot 2${plus(c)} = ${a2.toLatex()}$，$${a1.toLatex()}${plus(p)} = ${a2.toLatex()}$。`,
            ),
          ),
          [
            [
              `$${arithmeticRecursive(c, p).latex}$`,
              "This starts at the constant, but $a_1$ is the value at $n = 1$, which also counts the term with $n$.",
              "这里从常数开始，但 $a_1$ 是 $n = 1$ 时的值，还要算上含 $n$ 的项。",
            ],
            [
              `$${arithmeticRecursive(a1, c).latex}$`,
              "This adds the constant, but the common difference is the coefficient of $n$.",
              "这里加的是常数，但公差是 $n$ 的系数。",
            ],
            [
              `$${arithmeticRecursive(a1.add(p), p).latex}$`,
              "This starts at the second term of the sequence instead of the first.",
              "这里从数列的第二项开始，而不是第一项。",
            ],
            [
              `$${geometricRecursive(a1, p).latex}$`,
              "This multiplies, but this sequence adds the same amount each time.",
              "这里用的是乘法，但这个数列每次加上同一个数。",
            ],
          ],
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
  title: t("Finding the Nth Term of an Arithmetic Sequence Given Two Terms", "由两项求等差数列的第 n 项"),
  summary: t(
    "Find the common difference, the first term, the explicit formula and any term from two terms of an arithmetic sequence.",
    "由等差数列的两项求公差、首项、通项公式和任意一项。",
  ),
  prerequisites: ["nth-term-of-an-arithmetic-sequence"],
  encompasses: [{ topic: "nth-term-of-an-arithmetic-sequence", weight: 0.7 }],
  xp: 15,
  standards: ["CCSS.HSF.BF.A.2", "CCSS.HSF.LE.A.2"],
  intro: t(
    `The formula $a_n = a_1 + (n - 1)d$ needs the first term and the common difference. Often neither is given, only two terms somewhere along the sequence, such as $a_3 = 11$ and $a_8 = 31$. Two terms are enough, because the same counting of steps works between any two terms, not only from $a_1$.

From $a_3$ to $a_8$ there are $8 - 3 = 5$ steps, each adding $d$, so the whole change is $5d$:

$$5d = 31 - 11 = 20, \\qquad d = 4.$$

Then walk back $2$ steps from $a_3$ to the first term, $a_1 = 11 - 2 \\cdot 4 = 3$, and the sequence is $a_n = 3 + (n - 1) \\cdot 4 = 4n - 1$.

In this lesson we find, from two terms, the common difference, the first term, the explicit formula and any other term.`,
    `公式 $a_n = a_1 + (n - 1)d$ 需要首项和公差。很多时候两者都没有给出，只给出数列中某处的两项，比如 $a_3 = 11$ 和 $a_8 = 31$。两项就足够了，因为数步数的方法在任意两项之间都适用，不只是从 $a_1$ 开始。

从 $a_3$ 到 $a_8$ 共 $8 - 3 = 5$ 步，每步加 $d$，所以总的变化是 $5d$：

$$5d = 31 - 11 = 20, \\qquad d = 4.$$

再从 $a_3$ 往回走 $2$ 步到首项，$a_1 = 11 - 2 \\cdot 4 = 3$，于是数列为 $a_n = 3 + (n - 1) \\cdot 4 = 4n - 1$。

这节课由两项求公差、首项、通项公式以及任意其他项。`,
  ),
  knowledgePoints: [
    {
      id: "common-difference-from-two-terms",
      title: t("The common difference from two terms", "由两项求公差"),
      explanation: t(
        `From $a_p$ to $a_q$ there are $q - p$ steps, each adding $d$, so the change between the two terms is $q - p$ times $d$:

$$(q - p)d = a_q - a_p.$$

If $a_3 = 11$ and $a_8 = 31$, there are $5$ steps and the change is $20$: $5d = 20$, so $d = 4$.

> **Watch out.** Divide by the number of steps, $q - p = 5$, not by the number of terms from $a_3$ to $a_8$, which is $6$. Do not stop at the change $20$ either: that is all five steps together. And subtract the earlier term from the later one, so that a decrease gives a negative $d$.`,
        `从 $a_p$ 到 $a_q$ 共 $q - p$ 步，每步加 $d$，所以两项之间的变化是 $q - p$ 个 $d$：

$$(q - p)d = a_q - a_p.$$

若 $a_3 = 11$，$a_8 = 31$，共 $5$ 步，变化量是 $20$：$5d = 20$，所以 $d = 4$。

> **注意。** 要除以步数 $q - p = 5$，而不是从 $a_3$ 到 $a_8$ 的项数 $6$。也不要停在变化量 $20$：那是五步合起来的量。还要用较后的项减去较前的项，这样数值减少时 $d$ 为负。`,
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
            `**Step 1: count the steps.** From $a_{${p}}$ to $a_{${q}}$ there are $${q} - ${p} = ${q - p}$ steps, each adding $d$.\n\n**Step 2: divide the change.** The change from the earlier term to the later one is $${q - p}$ steps of $d$:${differenceSteps(p, x, q, y)}**Check.** Adding $${q - p}$ steps of $${d}$ to $a_{${p}}$: $${x} + ${q - p} \\cdot ${paren(d)} = ${y}$, the given $a_{${q}}$.`,
            `**第一步：数步数。** 从 $a_{${p}}$ 到 $a_{${q}}$ 共 $${q} - ${p} = ${q - p}$ 步，每步加 $d$。\n\n**第二步：变化量除以步数。** 从较前的项到较后的项，变化量是 $${q - p}$ 步的 $d$：${differenceSteps(p, x, q, y)}**检验。** 在 $a_{${p}}$ 上加 $${q - p}$ 步、每步 $${d}$：$${x} + ${q - p} \\cdot ${paren(d)} = ${y}$，正是所给的 $a_{${q}}$。`,
          ),
        });
      },
    },
    {
      id: "first-term-from-two-terms",
      title: t("The first term from two terms", "由两项求首项"),
      explanation: t(
        `In an arithmetic sequence each step adds the common difference, so walking back from a known term means subtracting it once for every step.

Once $d$ is known, step back from $a_p$ to $a_1$: that is $p - 1$ steps, so

$$a_1 = a_p - (p - 1)d.$$

With $a_3 = 11$ and $d = 4$: $a_1 = 11 - 2 \\cdot 4 = 3$. Going forward again, $3 + 4 + 4 = 11$.

> **Watch out.** From $a_3$ back to $a_1$ is $2$ steps, not $3$: $11 - 3 \\cdot 4 = -1$ is the term before $a_1$. And stepping back subtracts $d$; adding it, $11 + 8 = 19$, moves forward to $a_5$.`,
        `在等差数列中，每一步都加上公差，所以从已知的项往回推，每退一步就减去一次公差。

求出 $d$ 后，从 $a_p$ 倒推到 $a_1$：共 $p - 1$ 步，所以

$$a_1 = a_p - (p - 1)d.$$

当 $a_3 = 11$，$d = 4$ 时：$a_1 = 11 - 2 \\cdot 4 = 3$。再往前算，$3 + 4 + 4 = 11$。

> **注意。** 从 $a_3$ 回到 $a_1$ 是 $2$ 步而不是 $3$ 步：$11 - 3 \\cdot 4 = -1$ 是 $a_1$ 前面的一项。往回退要减去 $d$；加上它，$11 + 8 = 19$，就向前走到了 $a_5$。`,
      ),
      generate(rng) {
        const { a1, d, p, q, x, y } = twoTerms(rng);
        const back = chainEq(`a_1 = ${x} - ${scaled(p - 1, paren(d))}`, `${x}${plus(-(p - 1) * d)}`, `${a1}`);
        return numberProblem({
          prompt: t(`An arithmetic sequence has ${givenTwo(p, x, q, y)}. Find $a_1$.`, `等差数列中 ${givenTwoZh(p, x, q, y)}。求 $a_1$。`),
          answer: a1,
          wrong: [x - p * d, x + (p - 1) * d, d],
          solution: t(
            `**Step 1: the common difference.** There are $${q - p}$ steps from $a_{${p}}$ to $a_{${q}}$:${differenceSteps(p, x, q, y)}**Step 2: step back.** From $a_{${p}}$ to $a_1$ there ${p === 2 ? "is $2 - 1 = 1$ step" : `are $${p} - 1 = ${p - 1}$ steps`}, and each step back subtracts $d$:${steps(back)}**Check.** The first term must lead to the other given term too: $a_{${q}} = ${a1} + ${q - 1} \\cdot ${paren(d)} = ${y}$.`,
            `**第一步：求公差。** 从 $a_{${p}}$ 到 $a_{${q}}$ 共 $${q - p}$ 步：${differenceSteps(p, x, q, y)}**第二步：往回推。** 从 $a_{${p}}$ 到 $a_1$ 共 $${p} - 1 = ${p - 1}$ 步，每退一步减去 $d$：${steps(back)}**检验。** 由首项也应得到另一个已知项：$a_{${q}} = ${a1} + ${q - 1} \\cdot ${paren(d)} = ${y}$。`,
          ),
        });
      },
    },
    {
      id: "explicit-formula-from-two-terms",
      title: t("The explicit formula from two terms", "由两项求通项公式"),
      explanation: t(
        `Two terms are enough to determine an arithmetic sequence. Divide their difference by the number of steps between them to get $d$, then work back to the first term.

Find $d$, then $a_1$, then substitute into $a_n = a_1 + (n - 1)d$. With $a_3 = 11$ and $a_8 = 31$: $d = 4$, $a_1 = 3$, and

$$a_n = 3 + (n - 1) \\cdot 4 = 4n - 1.$$

Check both given terms: $4 \\cdot 3 - 1 = 11$ and $4 \\cdot 8 - 1 = 31$.

> **Watch out.** Do not put $a_3$ into the formula as if it were the first term: $11 + (n - 1) \\cdot 4$ gives $11$ at $n = 1$. And after expanding, the constant is $a_1 - d$, not $a_1$.`,
        `两项就能确定一个等差数列。用两项之差除以它们之间的步数得到 $d$，再往回推出首项。

先求 $d$，再求 $a_1$，然后代入 $a_n = a_1 + (n - 1)d$。当 $a_3 = 11$，$a_8 = 31$ 时：$d = 4$，$a_1 = 3$，

$$a_n = 3 + (n - 1) \\cdot 4 = 4n - 1.$$

检验两个已知项：$4 \\cdot 3 - 1 = 11$，$4 \\cdot 8 - 1 = 31$。

> **注意。** 不要把 $a_3$ 当作首项代入公式：$11 + (n - 1) \\cdot 4$ 在 $n = 1$ 时等于 $11$。展开后常数项是 $a_1 - d$，不是 $a_1$。`,
      ),
      generate(rng) {
        const { a1, d, p, q, x, y } = twoTerms(rng);
        const c = a1 - d;
        return formulaProblem({
          prompt: t(
            `An arithmetic sequence has ${givenTwo(p, x, q, y)}. Write an explicit formula for $a_n$.`,
            `等差数列中 ${givenTwoZh(p, x, q, y)}。写出 $a_n$ 的通项公式。`,
          ),
          answer: poly([d, "n"], [a1 - d, ""]),
          wrong: [poly([d, "n"], [x - d, ""]), poly([d, "n"], [a1, ""]), poly([d, "n"], [x, ""])],
          solution: t(
            `**Step 1: the common difference.** There are $${q - p}$ steps from $a_{${p}}$ to $a_{${q}}$:${differenceSteps(p, x, q, y)}**Step 2: the first term.** Step back ${p === 2 ? "once" : `$${p - 1}$ times`} from $a_{${p}}$: $a_1 = ${x} - ${scaled(p - 1, paren(d))} = ${a1}$.\n\n**Step 3: the formula.** Substitute into $a_n = a_1 + (n - 1)d$ and simplify:${explicitSteps(a1, d)}**Check.** Both given terms come out: $${atIndex(d, c, p)} = ${x}$ and $${atIndex(d, c, q)} = ${y}$.`,
            `**第一步：求公差。** 从 $a_{${p}}$ 到 $a_{${q}}$ 共 $${q - p}$ 步：${differenceSteps(p, x, q, y)}**第二步：求首项。** 从 $a_{${p}}$ 往回退 $${p - 1}$ 步：$a_1 = ${x} - ${scaled(p - 1, paren(d))} = ${a1}$。\n\n**第三步：写出公式。** 代入 $a_n = a_1 + (n - 1)d$ 并化简：${explicitSteps(a1, d)}**检验。** 两个已知项都符合：$${atIndex(d, c, p)} = ${x}$，$${atIndex(d, c, q)} = ${y}$。`,
          ),
        });
      },
    },
    {
      id: "a-term-from-two-terms",
      title: t("A term from two terms", "由两项求某一项"),
      explanation: t(
        `To find another term, you need not find $a_1$: the steps can be counted from any known term. From $a_p$ to $a_k$ there are $k - p$ steps, so $a_k = a_p + (k - p)d$. With $a_3 = 11$ and $d = 4$:

$$a_{20} = 11 + 17 \\cdot 4 = 79.$$

Through the first term it is the same: $a_1 = 3$ and $3 + 19 \\cdot 4 = 79$.

> **Watch out.** The steps are counted from the known term, $20 - 3 = 17$. Using $20 - 1 = 19$ steps from $a_3$, as if $a_3$ were the first term, overshoots by two steps.`,
        `求另一项时不必先求 $a_1$：步数可以从任何已知项数起。从 $a_p$ 到 $a_k$ 共 $k - p$ 步，所以 $a_k = a_p + (k - p)d$。当 $a_3 = 11$，$d = 4$ 时：

$$a_{20} = 11 + 17 \\cdot 4 = 79.$$

经过首项来算也一样：$a_1 = 3$，$3 + 19 \\cdot 4 = 79$。

> **注意。** 步数从已知项数起，是 $20 - 3 = 17$。如果把 $a_3$ 当作首项，从它走 $20 - 1 = 19$ 步，就多走了两步。`,
      ),
      generate(rng) {
        const { a1, d, p, q, x, y } = twoTerms(rng);
        const k = q + rng.int(5, 40);
        const ak = a1 + (k - 1) * d;
        const forward = chainEq(`a_{${k}} = ${y} + ${k - q} \\cdot ${paren(d)}`, `${y}${plus((k - q) * d)}`, `${ak}`);
        return numberProblem({
          prompt: t(
            `An arithmetic sequence has ${givenTwo(p, x, q, y)}. Find $a_{${k}}$.`,
            `等差数列中 ${givenTwoZh(p, x, q, y)}。求 $a_{${k}}$。`,
          ),
          answer: ak,
          wrong: [x + (k - 1) * d, a1 + k * d, y + (k - q + 1) * d],
          solution: t(
            `**Step 1: the common difference.** There are $${q - p}$ steps from $a_{${p}}$ to $a_{${q}}$:${differenceSteps(p, x, q, y)}**Step 2: count on from the nearer term.** From $a_{${q}}$ to $a_{${k}}$ there are $${k} - ${q} = ${k - q}$ steps:${steps(forward)}**Check.** Through the first term: $a_1 = ${x} - ${scaled(p - 1, paren(d))} = ${a1}$, and $a_{${k}} = ${a1} + ${k - 1} \\cdot ${paren(d)} = ${ak}$.`,
            `**第一步：求公差。** 从 $a_{${p}}$ 到 $a_{${q}}$ 共 $${q - p}$ 步：${differenceSteps(p, x, q, y)}**第二步：从较近的项往后数。** 从 $a_{${q}}$ 到 $a_{${k}}$ 共 $${k} - ${q} = ${k - q}$ 步：${steps(forward)}**检验。** 经过首项来算：$a_1 = ${x} - ${scaled(p - 1, paren(d))} = ${a1}$，$a_{${k}} = ${a1} + ${k - 1} \\cdot ${paren(d)} = ${ak}$。`,
          ),
        });
      },
    },
  ],
};

export const indexOfATermInAnArithmeticSequence: TopicDef = {
  id: "index-of-a-term-in-an-arithmetic-sequence",
  title: t("Determining Indexes of Terms in Arithmetic Sequences", "确定等差数列中项的序号"),
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
  intro: t(
    `The explicit formula of an arithmetic sequence turns a position $n$ into a term $a_n$. The reverse question is just as common: which position holds a given value? In $7, 11, 15, \\ldots$, is $203$ a term, and if so, which one?

The formula answers it as an equation. Every term is $7 + (n - 1) \\cdot 4$, so set this equal to $203$ and solve for $n$, a two-step equation:

$$7 + (n - 1) \\cdot 4 = 203 \\;\\Rightarrow\\; (n - 1) \\cdot 4 = 196 \\;\\Rightarrow\\; n - 1 = 49 \\;\\Rightarrow\\; n = 50.$$

So $203$ is the $50$th term. A position must be a positive whole number: if the solution were $n = 50.5$, the value would not be a term at all.

In this lesson we find the index of a value from an explicit formula and from listed terms, and count the terms of a finite arithmetic sequence.`,
    `等差数列的通项公式把位置 $n$ 变成项 $a_n$。反过来的问题同样常见：某个值在哪个位置？在 $7, 11, 15, \\ldots$ 中，$203$ 是不是其中的项？如果是，是第几项？

公式把它变成一个方程来回答。每一项都是 $7 + (n - 1) \\cdot 4$，令它等于 $203$，解这个两步方程求 $n$：

$$7 + (n - 1) \\cdot 4 = 203 \\;\\Rightarrow\\; (n - 1) \\cdot 4 = 196 \\;\\Rightarrow\\; n - 1 = 49 \\;\\Rightarrow\\; n = 50.$$

所以 $203$ 是第 $50$ 项。位置必须是正整数：如果解得 $n = 50.5$，这个值就根本不是数列中的项。

这节课由通项公式和列出的项求某个值的序号，并数出有限等差数列的项数。`,
  ),
  knowledgePoints: [
    {
      id: "index-from-the-explicit-formula",
      title: t("The index from an explicit formula", "由通项公式求序号"),
      explanation: t(
        `To find which term equals a value, set the formula equal to it and solve for $n$: undo the constant first, then the coefficient. For $a_n = 3n + 4$ and the value $154$:

$$3n + 4 = 154 \\;\\Rightarrow\\; 3n = 150 \\;\\Rightarrow\\; n = 50,$$

so $154$ is the $50$th term, and indeed $3 \\cdot 50 + 4 = 154$. If $n$ is not a positive whole number, the value is not a term of the sequence.

> **Watch out.** Moving the constant to the other side changes its sign: subtract $4$ to get $150$, not add it to get $158$. And do not skip that step: $154 \\div 3$ is not the index.`,
        `要求哪一项等于某个值，就令公式等于这个值，解出 $n$：先撤销常数，再撤销系数。对于 $a_n = 3n + 4$ 和值 $154$：

$$3n + 4 = 154 \\;\\Rightarrow\\; 3n = 150 \\;\\Rightarrow\\; n = 50,$$

所以 $154$ 是第 $50$ 项，确实 $3 \\cdot 50 + 4 = 154$。如果 $n$ 不是正整数，这个值就不是数列中的项。

> **注意。** 把常数移到另一边要变号：减去 $4$ 得 $150$，而不是加上 $4$ 得 $158$。也不要跳过这一步：$154 \\div 3$ 不是序号。`,
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
            `**Step 1: set up the equation.** The term in position $n$ is $${expr}$, so the position of $${v}$ solves $${expr} = ${v}$.\n\n**Step 2: undo the constant.** ${q < 0 ? `Add $${-q}$ to` : `Subtract $${q}$ from`} both sides:${steps(`${poly([p, "n"])} = ${v}${plus(-q)} = ${v - q}`)}**Step 3: undo the coefficient.** Divide both sides by $${p}$:${steps(`n = ${v - q} \\div ${paren(p)} = ${k}`)}**Check.** $${atIndex(p, q, k)} = ${v}$, so $a_{${k}} = ${v}$.`,
            `**第一步：列方程。** 位置 $n$ 上的项是 $${expr}$，所以 $${v}$ 的位置满足 $${expr} = ${v}$。\n\n**第二步：撤销常数。** 两边同时${q < 0 ? `加上 $${-q}$` : `减去 $${q}$`}：${steps(`${poly([p, "n"])} = ${v}${plus(-q)} = ${v - q}`)}**第三步：撤销系数。** 两边同时除以 $${p}$：${steps(`n = ${v - q} \\div ${paren(p)} = ${k}`)}**检验。** $${atIndex(p, q, k)} = ${v}$，所以 $a_{${k}} = ${v}$。`,
          ),
        });
      },
    },
    {
      id: "index-from-listed-terms",
      title: t("The index from listed terms", "由列出的项求序号"),
      explanation: t(
        `When the terms are listed, write the $n$th term first, $a_n = a_1 + (n - 1)d$, and set it equal to the value. Then undo the operations in reverse order: the first term, then the common difference, then the $-1$. In $7, 11, 15, \\ldots$, the value $203$:

$$7 + (n - 1) \\cdot 4 = 203 \\;\\Rightarrow\\; (n - 1) \\cdot 4 = 196 \\;\\Rightarrow\\; n - 1 = 49 \\;\\Rightarrow\\; n = 50.$$

The $49$ counts the steps from $a_1$; the position is one more.

> **Watch out.** Don't stop at $n - 1 = 49$: the answer is $n = 50$. And dividing the value by $d$, $203 \\div 4$, skips the first term and gives no index at all.`,
        `当数列的项被列出时，先写出第 $n$ 项 $a_n = a_1 + (n - 1)d$，再令它等于给定值。然后按相反的顺序撤销各步运算：先撤销首项，再撤销公差，最后撤销 $-1$。在 $7, 11, 15, \\ldots$ 中，值 $203$：

$$7 + (n - 1) \\cdot 4 = 203 \\;\\Rightarrow\\; (n - 1) \\cdot 4 = 196 \\;\\Rightarrow\\; n - 1 = 49 \\;\\Rightarrow\\; n = 50.$$

$49$ 是从 $a_1$ 起的步数，位置还要再多一。

> **注意。** 不要停在 $n - 1 = 49$：答案是 $n = 50$。用这个值除以 $d$，即 $203 \\div 4$，漏掉了首项，得不到序号。`,
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
            `**Step 1: the $n$th term.** Here $a_1 = ${a1}$ and $d = ${num(terms[1]!)} - ${paren(a1)} = ${d}$, so $a_n = ${a1} + (n - 1) \\cdot ${paren(d)}$.\n\n**Step 2: solve.** Set it equal to $${v}$ and undo the operations in reverse order, the first term, then the common difference, then the $-1$:${steps(`${a1} + (n - 1) \\cdot ${paren(d)} = ${v}`, `(n - 1) \\cdot ${paren(d)} = ${v - a1}`, `n - 1 = ${k - 1}`, `n = ${k}`)}**Check.** $${a1} + ${k - 1} \\cdot ${paren(d)} = ${v}$, so $${v}$ is the ${ordinal(k)} term.`,
            `**第一步：写出第 $n$ 项。** 这里 $a_1 = ${a1}$，$d = ${num(terms[1]!)} - ${paren(a1)} = ${d}$，所以 $a_n = ${a1} + (n - 1) \\cdot ${paren(d)}$。\n\n**第二步：解方程。** 令它等于 $${v}$，按相反的顺序撤销各步：先撤销首项，再撤销公差，最后撤销 $-1$：${steps(`${a1} + (n - 1) \\cdot ${paren(d)} = ${v}`, `(n - 1) \\cdot ${paren(d)} = ${v - a1}`, `n - 1 = ${k - 1}`, `n = ${k}`)}**检验。** $${a1} + ${k - 1} \\cdot ${paren(d)} = ${v}$，所以 $${v}$ 是第 $${k}$ 项。`,
          ),
        });
      },
    },
    {
      id: "counting-terms",
      title: t("Counting the terms of a finite sequence", "数出有限数列的项数"),
      explanation: t(
        `A finite arithmetic sequence such as $5, 8, 11, \\ldots, 101$ stops at its last term. Its terms are numbered $1, 2, 3, \\ldots$ up to the last, so the number of terms is the index of the last term:

$$5 + (n - 1) \\cdot 3 = 101 \\;\\Rightarrow\\; (n - 1) \\cdot 3 = 96 \\;\\Rightarrow\\; n - 1 = 32 \\;\\Rightarrow\\; n = 33.$$

> **Watch out.** The $32$ steps join $33$ terms, just as $2$ gaps sit between $3$ posts. The number of steps is one less than the number of terms; answering $32$, or adding one more to get $34$, is off by one.`,
        `像 $5, 8, 11, \\ldots, 101$ 这样的有限等差数列在最后一项处结束。它的项依次编号为 $1, 2, 3, \\ldots$，直到最后一项，所以项数就是最后一项的序号：

$$5 + (n - 1) \\cdot 3 = 101 \\;\\Rightarrow\\; (n - 1) \\cdot 3 = 96 \\;\\Rightarrow\\; n - 1 = 32 \\;\\Rightarrow\\; n = 33.$$

> **注意。** $32$ 步连接着 $33$ 项，就像 $3$ 根柱子之间有 $2$ 个间隔。步数比项数少一；答 $32$，或者再多加一得 $34$，都差了一。`,
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
            `**Step 1: the last term's index.** The terms are numbered from $1$, so their number is the index $n$ of the last term, $a_n = ${num(last)}$. Here $a_1 = ${a1}$ and $d = ${d}$.\n\n**Step 2: solve for $n$.**${steps(`(n - 1) \\cdot ${paren(d)} = ${num(last)} - ${paren(a1)} = ${last - a1}`, `n - 1 = ${k - 1}`, `n = ${k}`)}There are $${k - 1}$ steps, so the sequence has $${k}$ terms.\n\n**Check.** $${k}$ terms have $${k - 1}$ steps between them: $${a1} + ${k - 1} \\cdot ${paren(d)} = ${num(last)}$, the last term.`,
            `**第一步：最后一项的序号。** 各项从 $1$ 开始编号，所以项数就是最后一项 $a_n = ${num(last)}$ 的序号 $n$。这里 $a_1 = ${a1}$，$d = ${d}$。\n\n**第二步：解出 $n$。**${steps(`(n - 1) \\cdot ${paren(d)} = ${num(last)} - ${paren(a1)} = ${last - a1}`, `n - 1 = ${k - 1}`, `n = ${k}`)}共 $${k - 1}$ 步，所以数列有 $${k}$ 项。\n\n**检验。** $${k}$ 项之间有 $${k - 1}$ 步：$${a1} + ${k - 1} \\cdot ${paren(d)} = ${num(last)}$，正是最后一项。`,
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
  const k = 2 * c - a - f;
  const setUp = steps(`(${middle}) - (${first}) = (${third}) - (${middle})`, `${linear(c - a, e - b)} = ${linear(f - c, g - e)}`);
  const solve = steps(...[`${poly([k, "x"])} = ${k * x}`, `x = ${x}`].filter((line, i, all) => line !== all[i - 1]));
  const work = t(
    `${setUp}Collect the $x$ terms on the left and the numbers on the right, then divide by the coefficient of $x$:${solve}`,
    `${setUp}把含 $x$ 的项移到左边、数移到右边，再除以 $x$ 的系数：${solve}`,
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
    { topic: "equations-with-parentheses", weight: 0.6 },
    { topic: "arithmetic-sequences", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.LE.A.2", "CCSS.HSA.REI.B.3"],
  intro: t(
    `An arithmetic sequence is one where every step adds the same common difference, so consecutive terms always have equal differences. That fact can be used the other way round. If the terms contain an unknown, the equal differences give an equation for it.

Suppose $x + 1$, $2x + 3$ and $4x - 1$ are consecutive terms of an arithmetic sequence. The second minus the first must equal the third minus the second:

$$(2x + 3) - (x + 1) = (4x - 1) - (2x + 3) \\;\\Rightarrow\\; x + 2 = 2x - 4 \\;\\Rightarrow\\; x = 6.$$

With $x = 6$ the terms are $7, 15, 23$, and both differences are $8$.

In this lesson we solve for the unknown from equal differences, an equation with parentheses, and then use it to find the actual terms, the common difference and the next term.`,
    `等差数列每一步都加上同一个公差，所以相邻两项的差总是相等。这个事实可以反过来用：如果各项中含有未知数，相等的差就给出关于它的方程。

设 $x + 1$，$2x + 3$，$4x - 1$ 是一个等差数列中相邻的三项。第二项减第一项必须等于第三项减第二项：

$$(2x + 3) - (x + 1) = (4x - 1) - (2x + 3) \\;\\Rightarrow\\; x + 2 = 2x - 4 \\;\\Rightarrow\\; x = 6.$$

当 $x = 6$ 时，三项是 $7, 15, 23$，两个差都是 $8$。

这节课由相等的差解出未知数，这是一个含括号的方程，然后用它求出各项的实际值、公差和下一项。`,
  ),
  knowledgePoints: [
    {
      id: "equal-differences",
      title: t("Setting the differences equal", "令两个差相等"),
      explanation: t(
        `Three consecutive terms of an arithmetic sequence have equal differences, because each step adds the same $d$: second minus first equals third minus second. If $x + 1$, $2x + 3$ and $4x - 1$ are consecutive terms:

$$(2x + 3) - (x + 1) = (4x - 1) - (2x + 3) \\;\\Rightarrow\\; x + 2 = 2x - 4 \\;\\Rightarrow\\; x = 6.$$

Substituting back gives $7, 15, 23$, with both differences $8$.

> **Watch out.** Keep the parentheses: the minus sign applies to every term of the expression subtracted, so $-(2x + 3)$ is $-2x - 3$. Dropping it from the second term, or moving a term across the equals sign without changing its sign, gives a wrong $x$, often the right size with the wrong sign.`,
        `等差数列中相邻三项的差相等，因为每一步都加上同一个 $d$：第二项减第一项等于第三项减第二项。若 $x + 1$，$2x + 3$，$4x - 1$ 是相邻的三项：

$$(2x + 3) - (x + 1) = (4x - 1) - (2x + 3) \\;\\Rightarrow\\; x + 2 = 2x - 4 \\;\\Rightarrow\\; x = 6.$$

代回得 $7, 15, 23$，两个差都是 $8$。

> **注意。** 保留括号：减号作用于被减式子的每一项，所以 $-(2x + 3)$ 是 $-2x - 3$。漏掉第二项的变号，或者把一项移到等号另一边时不变号，都会得到错误的 $x$，常常是大小对而符号错。`,
      ),
      keyPrerequisites: ["equations-with-parentheses"],
      generate(rng) {
        const s = threeTerms(rng);
        const [v1, v2, v3] = s.values as [number, number, number];
        return numberProblem({
          prompt: t(
            `The expressions $${s.first}$, $${s.middle}$ and $${s.third}$ are consecutive terms of an arithmetic sequence. Find $x$.`,
            `式子 $${s.first}$，$${s.middle}$，$${s.third}$ 是一个等差数列中相邻的三项。求 $x$。`,
          ),
          answer: s.x,
          solveFor: "x",
          wrong: [Q.of(s.g - s.b, 2 * s.c - s.a - s.f), -s.x],
          solution: t(
            `**Step 1: set the differences equal.** In an arithmetic sequence the second term minus the first equals the third minus the second. Subtract inside parentheses and simplify each side:${s.work.en}**Check.** With $x = ${s.x}$ the terms are $${v1}, ${v2}, ${v3}$, and $${v2} - ${paren(v1)} = ${v2 - v1}$, $${v3} - ${paren(v2)} = ${v3 - v2}$: the differences are equal.`,
            `**第一步：令两个差相等。** 在等差数列中，第二项减第一项等于第三项减第二项。带着括号相减，再化简两边：${s.work["zh-CN"]}**检验。** 当 $x = ${s.x}$ 时，三项是 $${v1}, ${v2}, ${v3}$，且 $${v2} - ${paren(v1)} = ${v2 - v1}$，$${v3} - ${paren(v2)} = ${v3 - v2}$：两个差相等。`,
          ),
        });
      },
    },
    {
      id: "terms-after-solving",
      title: t("Finding terms after solving", "求出未知数后求项"),
      explanation: t(
        `The value of $x$ is only a step: the terms themselves come from substituting it. With $x = 6$, the terms $x + 1$, $2x + 3$, $4x - 1$ are $7, 15, 23$. The common difference is a later term minus the one before it, $15 - 7 = 8$, and the next term adds it to the last one: $23 + 8 = 31$.

> **Watch out.** Do not give $x = 6$ as the answer, and do not stop at the third term $23$. The common difference is later minus earlier, $15 - 7$, not $7 - 15$; and the next term comes after $23$, so add $d$ rather than subtract it.`,
        `$x$ 的值只是中间一步：各项要把它代入才能得到。当 $x = 6$ 时，$x + 1$，$2x + 3$，$4x - 1$ 分别是 $7, 15, 23$。公差是后一项减前一项，$15 - 7 = 8$，下一项是在最后一项上加公差：$23 + 8 = 31$。

> **注意。** 不要把 $x = 6$ 当作答案，也不要停在第三项 $23$。公差是后项减前项，$15 - 7$，而不是 $7 - 15$；下一项在 $23$ 之后，所以要加 $d$ 而不是减去它。`,
      ),
      generate(rng) {
        const s = threeTerms(rng);
        const [v1, v2, v3] = s.values as [number, number, number];
        const askNext = rng.bool();
        const values = `${v1}, ${v2}, ${v3}`;
        const next = v3 + s.d;
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
          answer: askNext ? next : s.d,
          wrong: askNext ? [v3, s.x, v3 - s.d] : [s.x, -s.d, v2],
          solution: t(
            `**Step 1: find $x$.** The differences between consecutive terms are equal:${s.work.en}**Step 2: the terms.** Substituting $x = ${s.x}$ gives $${values}$, so the common difference is $d = ${v2} - ${paren(v1)} = ${s.d}$.${askNext ? `\n\n**Step 3: the next term.** Add $d$ to the third term: $${v3}${plus(s.d)} = ${next}$.` : ""}\n\n**Check.** ${askNext ? `The four terms $${values}, ${next}$ change by $${s.d}$ at every step.` : `The other difference agrees: $${v3} - ${paren(v2)} = ${v3 - v2}$.`}`,
            `**第一步：求 $x$。** 相邻两项的差相等：${s.work["zh-CN"]}**第二步：求各项。** 代入 $x = ${s.x}$ 得 $${values}$，所以公差 $d = ${v2} - ${paren(v1)} = ${s.d}$。${askNext ? `\n\n**第三步：下一项。** 在第三项上加 $d$：$${v3}${plus(s.d)} = ${next}$。` : ""}\n\n**检验。** ${askNext ? `四项 $${values}, ${next}$ 每一步都变化 $${s.d}$。` : `另一个差也一致：$${v3} - ${paren(v2)} = ${v3 - v2}$。`}`,
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
        `The first row of a theater has $${a1}$ seats, and each row has $${d}$ more seats than the row in front of it.`,
        `某剧院第一排有 $${a1}$ 个座位，每一排比前一排多 $${d}$ 个座位。`,
      ),
    data: (p, x, q, y) =>
      t(
        `The rows of a theater have seat counts that form an arithmetic sequence. Row $${p}$ has $${x}$ seats and row $${q}$ has $${y}$ seats.`,
        `某剧院各排的座位数构成等差数列。第 $${p}$ 排有 $${x}$ 个座位，第 $${q}$ 排有 $${y}$ 个座位。`,
      ),
    ask: (k) => t(`How many seats are in row $${k}$?`, `第 $${k}$ 排有多少个座位？`),
    which: (v) => t(`Which row has $${v}$ seats?`, `哪一排有 $${v}$ 个座位？`),
  },
  {
    draw: (rng) => ({ a1: rng.int(5, 20), d: rng.int(2, 10), kMax: 52 }),
    intro: (a1, d) =>
      t(
        `In week $1$, Mia puts $${a1}$ dollars into a savings box, and each week after that puts in $${d}$ dollars more than the week before.`,
        `第 $1$ 周，小米往存钱罐里放了 $${a1}$ 元，此后每周都比前一周多放 $${d}$ 元。`,
      ),
    data: (p, x, q, y) =>
      t(
        `Each week Mia puts the same amount more into a savings box than the week before. In week $${p}$ Mia puts in $${x}$ dollars, and in week $${q}$ puts in $${y}$ dollars.`,
        `小米每周往存钱罐里放的钱都比前一周多同样的数目。第 $${p}$ 周放了 $${x}$ 元，第 $${q}$ 周放了 $${y}$ 元。`,
      ),
    ask: (k) => t(`How many dollars does Mia put in during week $${k}$?`, `第 $${k}$ 周小米放了多少元？`),
    which: (v) => t(`In which week does Mia put in $${v}$ dollars?`, `小米在第几周放了 $${v}$ 元？`),
  },
  {
    draw: (rng) => ({ a1: rng.int(70, 100), d: rng.int(3, 9), kMax: 30 }),
    intro: (a1, d) =>
      t(
        `One chair is $${a1}$ cm tall, and each chair added to a stack raises its height by $${d}$ cm.`,
        `一把椅子高 $${a1}$ 厘米，每往一摞椅子上叠一把，高度增加 $${d}$ 厘米。`,
      ),
    data: (p, x, q, y) =>
      t(
        `Each chair added to a stack raises its height by the same amount. A stack of $${p}$ chairs is $${x}$ cm tall, and a stack of $${q}$ chairs is $${y}$ cm tall.`,
        `每往一摞椅子上叠一把，高度都增加同样的数值。$${p}$ 把椅子叠起来高 $${x}$ 厘米，$${q}$ 把椅子叠起来高 $${y}$ 厘米。`,
      ),
    ask: (k) => t(`How tall, in centimeters, is a stack of $${k}$ chairs?`, `$${k}$ 把椅子叠起来高多少厘米？`),
    which: (v) => t(`How many chairs are in a stack $${v}$ cm tall?`, `高 $${v}$ 厘米的一摞椅子有几把？`),
  },
  {
    draw: (rng) => {
      const d = rng.int(4, 15);
      return { a1: d * 40 + rng.int(0, 200), d: -d, kMax: 40 };
    },
    intro: (a1, d) =>
      t(
        `At the end of day $1$ of a sale, a store has $${a1}$ tickets left. It sells $${-d}$ tickets every day after that.`,
        `促销第 $1$ 天结束时，商店还剩 $${a1}$ 张票。此后每天卖出 $${-d}$ 张。`,
      ),
    data: (p, x, q, y) =>
      t(
        `A store sells the same number of tickets every day. At the end of day $${p}$ it has $${x}$ tickets left, and at the end of day $${q}$ it has $${y}$ left.`,
        `某商店每天卖出同样数量的票。第 $${p}$ 天结束时还剩 $${x}$ 张，第 $${q}$ 天结束时还剩 $${y}$ 张。`,
      ),
    ask: (k) => t(`How many tickets are left at the end of day $${k}$?`, `第 $${k}$ 天结束时还剩多少张票？`),
    which: (v) => t(`At the end of which day are $${v}$ tickets left?`, `第几天结束时还剩 $${v}$ 张票？`),
  },
];

/** sentences joins texts with a space in English and nothing in Chinese. */
const sentences = (a: Text, b: Text): Text => t(`${a.en} ${b.en}`, `${a["zh-CN"]}${b["zh-CN"]}`);

export const modelingWithArithmeticSequences: TopicDef = {
  id: "modeling-with-arithmetic-sequences",
  title: t("Modeling with Arithmetic Sequences", "用等差数列建模"),
  summary: t("Solve problems about quantities that change by the same amount at each step.", "解决每一步都变化相同数量的实际问题。"),
  prerequisites: ["index-of-a-term-in-an-arithmetic-sequence", "arithmetic-sequences-from-two-terms"],
  encompasses: [{ topic: "arithmetic-sequences-from-two-terms", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.BF.A.2", "CCSS.HSF.LE.A.2"],
  intro: t(
    `We can now find any term of an arithmetic sequence, find which term has a given value, and rebuild a sequence from two of its terms. Many everyday quantities behave exactly like such a sequence: they change by the same amount at each step, such as each row, each week, each chair or each day.

Suppose row $1$ of a hall has $20$ seats and each row has $3$ more than the row in front. The seat counts $20, 23, 26, \\ldots$ are an arithmetic sequence with $a_1 = 20$ and $d = 3$, where $a_n$ is the number of seats in row $n$. So row $15$ has

$$a_{15} = 20 + 14 \\cdot 3 = 62 \\text{ seats}.$$

The work is in the setting up: deciding what $n$ counts, which value is $a_1$, and what the common difference is, with its sign.

In this lesson we model situations with arithmetic sequences to find a value at a given step, the step at which a value is reached, and a model from two data points.`,
    `我们现在能求等差数列的任意一项，能求取给定值的是第几项，还能由两项还原整个数列。许多日常的量正像这样的数列：每一步都变化相同的数量，比如每一排、每一周、每一把椅子或每一天。

设礼堂第 $1$ 排有 $20$ 个座位，每排比前一排多 $3$ 个。座位数 $20, 23, 26, \\ldots$ 构成等差数列，$a_1 = 20$，$d = 3$，其中 $a_n$ 是第 $n$ 排的座位数。所以第 $15$ 排有

$$a_{15} = 20 + 14 \\cdot 3 = 62 \\text{ 个座位}.$$

关键在于建立模型：确定 $n$ 数的是什么，哪个值是 $a_1$，公差是多少以及它的正负。

这节课用等差数列为实际情境建模，求某一步的值、何时达到某个值，以及由两个数据建立模型。`,
  ),
  knowledgePoints: [
    {
      id: "a-term-in-context",
      title: t("Finding a term in context", "在情境中求某一项"),
      explanation: t(
        `When a quantity changes by the same amount at each step, its values form an arithmetic sequence. Decide what $a_1$ is, the value at step $1$, and what $d$ is, the change per step, negative if the quantity falls. Then use $a_n = a_1 + (n - 1)d$, because step $n$ comes $n - 1$ steps after step $1$. If row $1$ of a hall has $20$ seats and each row has $3$ more, row $15$ has

$$20 + 14 \\cdot 3 = 62 \\text{ seats}.$$

> **Watch out.** Row $15$ is $14$ rows after row $1$, not $15$: $20 + 15 \\cdot 3 = 65$ is the count for row $16$. Do not drop the starting value either, since $14 \\cdot 3 = 42$ is only the change. And when the quantity falls, the change is subtracted, while when it grows it is added.`,
        `当一个量每一步都变化相同的数量时，它的取值构成等差数列。先确定 $a_1$ 是什么，即第 $1$ 步的值，再确定 $d$ 是什么，即每一步的变化量，数量减少时为负。然后用 $a_n = a_1 + (n - 1)d$，因为第 $n$ 步在第 $1$ 步之后 $n - 1$ 步。若礼堂第 $1$ 排有 $20$ 个座位，每排多 $3$ 个，则第 $15$ 排有

$$20 + 14 \\cdot 3 = 62 \\text{ 个座位}.$$

> **注意。** 第 $15$ 排在第 $1$ 排之后 $14$ 排，不是 $15$ 排：$20 + 15 \\cdot 3 = 65$ 是第 $16$ 排的座位数。也不要丢掉起始值，$14 \\cdot 3 = 42$ 只是变化量。数量减少时要减去变化量，增加时才加上。`,
      ),
      generate(rng) {
        const story = rng.pick(stories);
        const { a1, d, kMax } = story.draw(rng);
        const k = rng.int(8, kMax);
        const ak = a1 + (k - 1) * d;
        const work = chainEq(`a_{${k}} = ${a1} + ${k - 1} \\cdot ${paren(d)}`, `${a1}${plus((k - 1) * d)}`, `${ak}`);
        const each = moves(d);
        return numberProblem({
          prompt: sentences(story.intro(a1, d), story.ask(k)),
          answer: ak,
          wrong: [a1 + k * d, (k - 1) * d, a1 - (k - 1) * d],
          solution: t(
            `**Step 1: the sequence.** Let $a_n$ be the value at step $n$. The values form an arithmetic sequence: the first is $a_1 = ${a1}$, and each step ${each.en}, so $d = ${d}$.\n\n**Step 2: the term.** Step $${k}$ comes $${k - 1}$ steps after step $1$:${steps(work)}**Check.** Going back $${k - 1}$ steps from $${ak}$ returns to the first value: $${ak}${plus(-(k - 1) * d)} = ${a1}$.`,
            `**第一步：数列。** 设 $a_n$ 为第 $n$ 步的值。这些值构成等差数列：首项 $a_1 = ${a1}$，每一步${each["zh-CN"]}，所以 $d = ${d}$。\n\n**第二步：求这一项。** 第 $${k}$ 步在第 $1$ 步之后 $${k - 1}$ 步：${steps(work)}**检验。** 从 $${ak}$ 往回退 $${k - 1}$ 步回到首项：$${ak}${plus(-(k - 1) * d)} = ${a1}$。`,
          ),
        });
      },
    },
    {
      id: "when-a-value-is-reached",
      title: t("When a value is reached", "何时达到某个值"),
      explanation: t(
        `To find when a quantity reaches a value, ask which term of the sequence equals it: solve $a_1 + (n - 1)d = \\text{value}$ for $n$. With $20$ seats in row $1$ and $3$ more in each row, the row with $77$ seats is

$$20 + (n - 1) \\cdot 3 = 77 \\;\\Rightarrow\\; (n - 1) \\cdot 3 = 57 \\;\\Rightarrow\\; n - 1 = 19 \\;\\Rightarrow\\; n = 20.$$

Row $20$: indeed $20 + 19 \\cdot 3 = 77$.

> **Watch out.** $n - 1 = 19$ counts the steps after row $1$; the row itself is $n = 20$. Stopping at $19$, or adding one more to get $21$, is off by one, and putting the answer back into the formula catches it.`,
        `要求一个量何时达到某个值，就问数列中哪一项等于它：解方程 $a_1 + (n - 1)d = \\text{该值}$，求出 $n$。第 $1$ 排有 $20$ 个座位、每排多 $3$ 个时，有 $77$ 个座位的是

$$20 + (n - 1) \\cdot 3 = 77 \\;\\Rightarrow\\; (n - 1) \\cdot 3 = 57 \\;\\Rightarrow\\; n - 1 = 19 \\;\\Rightarrow\\; n = 20.$$

第 $20$ 排：确实 $20 + 19 \\cdot 3 = 77$。

> **注意。** $n - 1 = 19$ 数的是第 $1$ 排之后的步数；所求的排是 $n = 20$。停在 $19$，或者再多加一得 $21$，都差了一；把答案代回公式就能发现。`,
      ),
      generate(rng) {
        const story = rng.pick(stories);
        const { a1, d, kMax } = story.draw(rng);
        const k = rng.int(8, kMax);
        const v = a1 + (k - 1) * d;
        const each = moves(d);
        const work = steps(
          `${a1} + (n - 1) \\cdot ${paren(d)} = ${v}`,
          `(n - 1) \\cdot ${paren(d)} = ${v - a1}`,
          `n - 1 = ${k - 1}`,
          `n = ${k}`,
        );
        return numberProblem({
          prompt: sentences(story.intro(a1, d), story.which(v)),
          answer: k,
          wrong: [k - 1, k + 1],
          solution: t(
            `**Step 1: the sequence.** Let $a_n$ be the value at step $n$. The first is $a_1 = ${a1}$, and each step ${each.en}, so $d = ${d}$ and $a_n = ${a1} + (n - 1) \\cdot ${paren(d)}$.\n\n**Step 2: solve for $n$.** Set the formula equal to $${v}$:${work}**Check.** $a_{${k}} = ${a1} + ${k - 1} \\cdot ${paren(d)} = ${v}$, the given value.`,
            `**第一步：数列。** 设 $a_n$ 为第 $n$ 步的值。首项 $a_1 = ${a1}$，每一步${each["zh-CN"]}，所以 $d = ${d}$，$a_n = ${a1} + (n - 1) \\cdot ${paren(d)}$。\n\n**第二步：解出 $n$。** 令公式等于 $${v}$：${work}**检验。** $a_{${k}} = ${a1} + ${k - 1} \\cdot ${paren(d)} = ${v}$，正是所给的值。`,
          ),
        });
      },
    },
    {
      id: "models-from-two-data-points",
      title: t("Models from two data points", "由两个数据建模"),
      explanation: t(
        `Sometimes only two values are known. Between step $p$ and step $q$ there are $q - p$ equal changes, so the difference of the two values, divided by the number of steps between them, is $d$. If row $4$ has $30$ seats and row $10$ has $48$, then $6d = 18$ and $d = 3$. From row $10$, row $25$ is $15$ steps further:

$$48 + 15 \\cdot 3 = 93 \\text{ seats}.$$

Through row $1$ it agrees: $a_1 = 30 - 3 \\cdot 3 = 21$ and $21 + 24 \\cdot 3 = 93$.

> **Watch out.** Count the steps from the known value: from row $10$ to row $25$ is $15$ steps. Using $24$ steps from row $10$ or from row $4$, as if either were row $1$, overshoots.`,
        `有时只知道两个值。第 $p$ 步和第 $q$ 步之间有 $q - p$ 次相同的变化，所以两个值的差除以两者之间的步数就是 $d$。若第 $4$ 排有 $30$ 个座位，第 $10$ 排有 $48$ 个，则 $6d = 18$，$d = 3$。从第 $10$ 排起，第 $25$ 排还要再走 $15$ 步：

$$48 + 15 \\cdot 3 = 93 \\text{ 个座位}.$$

经过第 $1$ 排来算也一致：$a_1 = 30 - 3 \\cdot 3 = 21$，$21 + 24 \\cdot 3 = 93$。

> **注意。** 步数从已知的值数起：从第 $10$ 排到第 $25$ 排是 $15$ 步。从第 $10$ 排或第 $4$ 排走 $24$ 步，等于把它当作第 $1$ 排，就多走了。`,
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
        const work = chainEq(`a_{${k}} = ${y} + ${k - q} \\cdot ${paren(d)}`, `${y}${plus((k - q) * d)}`, `${ak}`);
        return numberProblem({
          prompt: sentences(story.data(p, x, q, y), story.ask(k)),
          answer: ak,
          wrong: [y + (k - 1) * d, x + (k - 1) * d, a1 + k * d],
          solution: t(
            `**Step 1: the common difference.** The values form an arithmetic sequence, with $a_{${p}} = ${x}$ and $a_{${q}} = ${y}$. There are $${q - p}$ steps between them:${differenceSteps(p, x, q, y)}**Step 2: count on.** From $a_{${q}}$ to $a_{${k}}$ there are $${k} - ${q} = ${k - q}$ steps:${steps(work)}**Check.** Through the first value: $a_1 = ${x} - ${scaled(p - 1, paren(d))} = ${a1}$, and $a_{${k}} = ${a1} + ${k - 1} \\cdot ${paren(d)} = ${ak}$.`,
            `**第一步：求公差。** 这些值构成等差数列，$a_{${p}} = ${x}$，$a_{${q}} = ${y}$，两者之间共 $${q - p}$ 步：${differenceSteps(p, x, q, y)}**第二步：往后数。** 从 $a_{${q}}$ 到 $a_{${k}}$ 共 $${k} - ${q} = ${k - q}$ 步：${steps(work)}**检验。** 经过首项来算：$a_1 = ${x} - ${scaled(p - 1, paren(d))} = ${a1}$，$a_{${k}} = ${a1} + ${k - 1} \\cdot ${paren(d)} = ${ak}$。`,
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
  title: t("Introduction to Geometric Sequences", "等比数列简介"),
  summary: t("Recognize geometric sequences, find the common ratio and continue the sequence.", "识别等比数列，求公比并写出后续的项。"),
  prerequisites: ["arithmetic-sequences", "operations-with-rational-numbers"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSF.IF.A.3", "CCSS.HSF.LE.A.2"],
  intro: t(
    `An arithmetic sequence grows by adding the same number at every step. Many quantities grow differently: they are multiplied by the same number at every step. A population of cells that doubles every hour goes

$$3, 6, 12, 24, 48, \\ldots$$

The differences $3, 6, 12, 24$ are not equal, so this is not arithmetic. But the ratios are: $\\frac{6}{3} = \\frac{12}{6} = \\frac{24}{12} = 2$, so each term is the one before times $2$. A sequence like this is called **geometric**, and the fixed multiplier is its **common ratio** $r$.

Multiplying by a ratio can also shrink a sequence, as with $r = \\frac{1}{2}$, or make its signs alternate, as with $r = -2$. In this lesson we tell geometric sequences apart from arithmetic ones, find the common ratio, and continue a geometric sequence.`,
    `等差数列每一步都加上同一个数。许多量的增长方式不同：它们每一步都乘以同一个数。每小时翻一倍的细胞数量依次是

$$3, 6, 12, 24, 48, \\ldots$$

差 $3, 6, 12, 24$ 不相等，所以它不是等差数列。但比相等：$\\frac{6}{3} = \\frac{12}{6} = \\frac{24}{12} = 2$，所以每一项都是前一项乘以 $2$。这样的数列叫做**等比数列**，这个固定的乘数叫做**公比** $r$。

乘以公比也可以使数列变小，比如 $r = \\frac{1}{2}$，或者使正负交替，比如 $r = -2$。这节课区分等比数列和等差数列，求公比，并写出等比数列的后续项。`,
  ),
  knowledgePoints: [
    {
      id: "identifying-geometric-sequences",
      title: t("Arithmetic, geometric or neither", "等差、等比还是都不是"),
      explanation: t(
        `A sequence is **geometric** when each term is the previous one **multiplied** by the same number, the **common ratio** $r$. So dividing each term by the one before must always give $r$, and that is the test:

$$3, 6, 12, 24: \\quad \\frac{6}{3} = \\frac{12}{6} = \\frac{24}{12} = 2 \\quad \\text{geometric}.$$

An arithmetic sequence adds the same number, so its differences are equal; a geometric one multiplies by the same number, so its ratios are equal. Many sequences are neither: $1, 4, 9, 16$ has differences $3, 5, 7$ and ratios $4, \\frac{9}{4}, \\frac{16}{9}$.

> **Watch out.** Test every pair of neighbors, not only the first two: $2, 4, 8, 14$ starts like doubling, but $\\frac{14}{8}$ is not $2$. And answer "neither" only after both tests fail, because equal differences already make a sequence arithmetic.`,
        `如果每一项都是前一项**乘以**同一个数，这个数列就是**等比数列**，这个数叫做**公比** $r$。所以每一项除以它的前一项必须总是得到 $r$，这就是检验方法：

$$3, 6, 12, 24: \\quad \\frac{6}{3} = \\frac{12}{6} = \\frac{24}{12} = 2 \\quad \\text{等比}.$$

等差数列每次加同一个数，所以差相等；等比数列每次乘同一个数，所以比相等。很多数列两者都不是：$1, 4, 9, 16$ 的差是 $3, 5, 7$，比是 $4, \\frac{9}{4}, \\frac{16}{9}$。

> **注意。** 要检验每一对相邻项，而不只是前两项：$2, 4, 8, 14$ 开头像是翻倍，但 $\\frac{14}{8}$ 不是 $2$。只有两种检验都不成立时才答“都不是”，因为差相等就已经说明是等差数列。`,
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
        const at = (i: number) => terms[i]!.toLatex();
        const diffs = terms.slice(1).map((x, i) => x.sub(terms[i]!));
        const d = diffs[0]!;
        const differences = t(
          `**Step 1: the differences.** Subtract each term from the next: the differences are $${diffs.map(num).join(", ")}$. ${
            correct === 0
              ? `They are all equal, so the sequence is arithmetic with $d = ${d.toLatex()}$.`
              : "They are not all equal, so the sequence is not arithmetic."
          }`,
          `**第一步：求差。** 用每一项减去它的前一项：差依次是 $${diffs.map(num).join(", ")}$。${
            correct === 0 ? `它们都相等，所以这是公差 $d = ${d.toLatex()}$ 的等差数列。` : "它们不全相等，所以不是等差数列。"
          }`,
        );
        const zero = terms.some((x) => x.isZero());
        const quotients = zero ? [] : terms.slice(1).map((x, i) => x.div(terms[i]!));
        const r = quotients[0];
        const ratioText =
          correct === 0
            ? null
            : zero
              ? t(
                  "**Step 2: the ratios.** One of the terms is $0$. In a geometric sequence a $0$ can appear only when the first term or the ratio is $0$, and then every term after the first is $0$. Here they are not, so the sequence is not geometric either.",
                  "**第二步：求比。** 其中有一项是 $0$。在等比数列中，只有首项或公比为 $0$ 时才会出现 $0$，而那时首项之后的每一项都是 $0$。这里并非如此，所以也不是等比数列。",
                )
              : t(
                  `**Step 2: the ratios.** Divide each term by the one before: the ratios are $${quotients.map(num).join(", ")}$. ${
                    correct === 1
                      ? `They are all equal, so the sequence is geometric with $r = ${r!.toLatex()}$.`
                      : "They are not all equal either, so the sequence is neither."
                  }`,
                  `**第二步：求比。** 用每一项除以它的前一项：比依次是 $${quotients.map(num).join(", ")}$。${
                    correct === 1 ? `它们都相等，所以这是公比 $r = ${r!.toLatex()}$ 的等比数列。` : "它们也不全相等，所以两者都不是。"
                  }`,
                );
        const j = diffs.findIndex((x) => !x.eq(d));
        const jr = quotients.findIndex((x) => !x.eq(r!));
        const check =
          correct === 0
            ? t(
                `**Check.** Adding $${d.toLatex()}$ four times to the first term reaches the last: $${at(0)} + 4 \\cdot ${paren(d)} = ${at(4)}$.`,
                `**检验。** 在首项上加四次 $${d.toLatex()}$ 得到最后一项：$${at(0)} + 4 \\cdot ${paren(d)} = ${at(4)}$。`,
              )
            : correct === 1
              ? t(
                  `**Check.** Multiplying the first term by $${r!.toLatex()}$ four times reaches the last: $${times(terms[0]!, `${base(r!)}^{4}`)} = ${at(4)}$.`,
                  `**检验。** 首项乘四次 $${r!.toLatex()}$ 得到最后一项：$${times(terms[0]!, `${base(r!)}^{4}`)} = ${at(4)}$。`,
                )
              : t(
                  `**Check.** Adding the first difference to $${at(j)}$ would give $${terms[j]!.add(d).toLatex()}$, but the next term is $${at(j + 1)}$${
                    zero
                      ? ""
                      : `; multiplying $${at(jr)}$ by the first ratio would give $${terms[jr]!.mul(r!).toLatex()}$, but the next term is $${at(jr + 1)}$`
                  }.`,
                  `**检验。** 在 $${at(j)}$ 上加第一个差会得到 $${terms[j]!.add(d).toLatex()}$，但下一项是 $${at(j + 1)}$${
                    zero ? "" : `；$${at(jr)}$ 乘以第一个比会得到 $${terms[jr]!.mul(r!).toLatex()}$，但下一项是 $${at(jr + 1)}$`
                  }。`,
                );
        const parts = [differences, ...(ratioText ? [ratioText] : []), check];
        return choiceProblem({
          prompt: t(
            `Is the sequence $${list(terms)}$ arithmetic, geometric, or neither?`,
            `数列 $${list(terms)}$ 是等差数列、等比数列，还是都不是？`,
          ),
          options: classes,
          correct,
          solution: t(parts.map((p) => p.en).join("\n\n"), parts.map((p) => p["zh-CN"]).join("\n\n")),
        });
      },
    },
    {
      id: "finding-the-common-ratio",
      title: t("Finding the common ratio", "求公比"),
      explanation: t(
        `Each term is the one before it times $r$, so the common ratio is a term **divided by the term before it**. For $48, -24, 12, -6, \\ldots$:

$$r = \\frac{-24}{48} = -\\frac{1}{2}.$$

Indeed $48 \\cdot \\left(-\\frac{1}{2}\\right) = -24$ and $-24 \\cdot \\left(-\\frac{1}{2}\\right) = 12$. A negative ratio makes the signs alternate; a ratio between $-1$ and $1$ makes the terms shrink toward $0$.

> **Watch out.** Divide; do not subtract: $-24 - 48 = -72$ is a difference, which belongs to arithmetic sequences. Put the later term on top, since $\\frac{48}{-24} = -2$ is upside down. And keep the sign: when the signs alternate, the ratio is negative.`,
        `每一项都是它的前一项乘以 $r$，所以公比等于某一项**除以它的前一项**。对于 $48, -24, 12, -6, \\ldots$：

$$r = \\frac{-24}{48} = -\\frac{1}{2}.$$

确实 $48 \\cdot \\left(-\\frac{1}{2}\\right) = -24$，$-24 \\cdot \\left(-\\frac{1}{2}\\right) = 12$。公比为负时各项正负交替；公比在 $-1$ 与 $1$ 之间时各项逐渐趋近于 $0$。

> **注意。** 要相除而不是相减：$-24 - 48 = -72$ 是差，那是等差数列用的。后项放在分子上，$\\frac{48}{-24} = -2$ 是倒过来的。还要保留符号：正负交替时公比为负。`,
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
            `**Step 1: divide neighbors.** Each term is the one before times $r$, so divide the second term by the first:${ratioSteps(terms[0]!, terms[1]!)}**Check.** The later pairs give the same ratio: $\\frac{${terms[2]!.toLatex()}}{${terms[1]!.toLatex()}} = ${r.toLatex()}$ and $\\frac{${terms[3]!.toLatex()}}{${terms[2]!.toLatex()}} = ${r.toLatex()}$.`,
            `**第一步：相邻项相除。** 每一项都是前一项乘以 $r$，所以用第二项除以第一项：${ratioSteps(terms[0]!, terms[1]!)}**检验。** 后面的相邻项给出同样的比：$\\frac{${terms[2]!.toLatex()}}{${terms[1]!.toLatex()}} = ${r.toLatex()}$，$\\frac{${terms[3]!.toLatex()}}{${terms[2]!.toLatex()}} = ${r.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "continuing-a-geometric-sequence",
      title: t("Continuing a geometric sequence", "写出等比数列的后续项"),
      explanation: t(
        `A geometric sequence moves from each term to the next by multiplying by the common ratio, so to continue it, multiply the last term by $r$. For $162, 54, 18, \\ldots$, $r = \\frac{54}{162} = \\frac{1}{3}$, so the next terms are $18 \\cdot \\frac{1}{3} = 6$ and $6 \\cdot \\frac{1}{3} = 2$.

> **Watch out.** Don't continue it by adding the last difference: $18 + (18 - 54) = -18$ treats the sequence as arithmetic. Multiply by $r$ rather than divide by it, since $18 \\div \\frac{1}{3} = 54$ goes backward. And keep the sign of $r$.`,
        `等比数列从每一项到下一项都是乘以公比，所以要写出后续项，就用最后一项乘以 $r$。对于 $162, 54, 18, \\ldots$，$r = \\frac{54}{162} = \\frac{1}{3}$，所以后面两项是 $18 \\cdot \\frac{1}{3} = 6$ 和 $6 \\cdot \\frac{1}{3} = 2$。

> **注意。** 不要用加上最后一个差的方法：$18 + (18 - 54) = -18$ 把它当成了等差数列。要乘以 $r$ 而不是除以它，$18 \\div \\frac{1}{3} = 54$ 是往回走。还要保留 $r$ 的符号。`,
      ),
      generate(rng) {
        const r = rng.pick(ratios);
        const terms = geometric(geometricStart(rng, r, 5, 9), r, 5);
        const [t1, , t3, t4, t5] = terms as [Q, Q, Q, Q, Q];
        const next = chainEq("a_{5} = a_{4} \\cdot r", times(t4, base(r)), t5.toLatex());
        const check = chainEq(times(t1, `${base(r)}^{4}`), times(t1, paren(r.pow(4))), t5.toLatex());
        return numberProblem({
          prompt: t(
            `Find the next term of the geometric sequence $${list(terms.slice(0, 4))}$`,
            `求等比数列 $${list(terms.slice(0, 4))}$ 的下一项。`,
          ),
          answer: t5,
          wrong: [t4.add(t4.sub(t3)), t4.div(r), t5.neg()],
          solution: t(
            `**Step 1: the ratio.** Divide the second term by the first:${ratioSteps(terms[0]!, terms[1]!)}**Step 2: one more step.** Multiply the last term by the ratio:${steps(next)}**Check.** The fifth term is the first multiplied by $r$ four times: $${check}$.`,
            `**第一步：求公比。** 用第二项除以第一项：${ratioSteps(terms[0]!, terms[1]!)}**第二步：再走一步。** 用最后一项乘以公比：${steps(next)}**检验。** 第五项是首项乘四次 $r$：$${check}$。`,
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
    { topic: "powers-of-rational-numbers", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.A.2", "CCSS.HSF.LE.A.2"],
  intro: t(
    `A geometric sequence moves from term to term by multiplying by the common ratio $r$. To reach a far term, such as the $10$th term of $5, 15, 45, \\ldots$, we could multiply by $3$ nine times. But repeated multiplication by the same number is exactly what a power writes in one go:

$$a_{10} = 5 \\cdot \\underbrace{3 \\cdot 3 \\cdots 3}_{9 \\text{ factors}} = 5 \\cdot 3^{9} = 98415.$$

The same reasoning works for every position, and it gives an explicit formula for a geometric sequence, $a_n = a_1 \\cdot r^{n-1}$, just as $a_n = a_1 + (n - 1)d$ did for an arithmetic one.

In this lesson we write this formula for a given sequence, use it to find terms, and evaluate explicit formulas whose exponent is written in other ways.`,
    `等比数列从一项到下一项都是乘以公比 $r$。要求很远的一项，比如 $5, 15, 45, \\ldots$ 的第 $10$ 项，可以连乘九次 $3$。而连续乘同一个数，正是乘方一下子写出来的：

$$a_{10} = 5 \\cdot \\underbrace{3 \\cdot 3 \\cdots 3}_{9 \\text{ 个因数}} = 5 \\cdot 3^{9} = 98415.$$

同样的推理对每个位置都成立，于是得到等比数列的通项公式 $a_n = a_1 \\cdot r^{n-1}$，正如 $a_n = a_1 + (n - 1)d$ 之于等差数列。

这节课为给定的数列写出这个公式，用它求项，并计算指数写法不同的通项公式。`,
  ),
  knowledgePoints: [
    {
      id: "the-explicit-formula",
      title: t("The explicit formula", "通项公式"),
      explanation: t(
        `To reach $a_n$ from $a_1$, multiply by the common ratio $n - 1$ times, once for each step:

$$a_n = a_1 \\cdot r^{n-1}.$$

For $5, 15, 45, \\ldots$: $a_1 = 5$ and $r = 3$, so $a_n = 5 \\cdot 3^{n-1}$. At $n = 1$ this gives $5 \\cdot 3^{0} = 5$, and at $n = 2$ it gives $5 \\cdot 3 = 15$. A negative or fractional ratio goes in parentheses: $a_n = 4 \\cdot \\left(-\\frac{1}{2}\\right)^{n-1}$.

> **Watch out.** The exponent is $n - 1$, not $n$, because $a_1$ itself is not multiplied at all: $5 \\cdot 3^{n}$ gives $15$ at $n = 1$. Keep the first term in front and the ratio in the base, and start from $a_1$, not from the second term.`,
        `从 $a_1$ 到 $a_n$，要乘以公比 $n - 1$ 次，每一步乘一次：

$$a_n = a_1 \\cdot r^{n-1}.$$

对于 $5, 15, 45, \\ldots$：$a_1 = 5$，$r = 3$，所以 $a_n = 5 \\cdot 3^{n-1}$。当 $n = 1$ 时得 $5 \\cdot 3^{0} = 5$，当 $n = 2$ 时得 $5 \\cdot 3 = 15$。负数或分数公比要加括号：$a_n = 4 \\cdot \\left(-\\frac{1}{2}\\right)^{n-1}$。

> **注意。** 指数是 $n - 1$ 而不是 $n$，因为 $a_1$ 本身没有乘公比：$5 \\cdot 3^{n}$ 在 $n = 1$ 时得 $15$。首项放在前面，公比作底数，并且要从 $a_1$ 而不是第二项开始。`,
      ),
      generate(rng) {
        const r = rng.pick(ratios.filter((x) => !x.eq(Q.one.neg())));
        const a1 = geometricStart(rng, r, 4, 9);
        const correct = geometricExplicit(a1, r, -1);
        const [first, second] = correct.terms as [Q, Q];
        return reasoned(
          formulaChoice(
            rng,
            t(
              `Which formula gives the $n$th term of the geometric sequence $${list(correct.terms.slice(0, 4))}$?`,
              `哪个公式给出等比数列 $${list(correct.terms.slice(0, 4))}$ 的第 $n$ 项？`,
            ),
            correct,
            [geometricExplicit(a1, r, 0), geometricExplicit(r, a1, -1), arithmeticExplicit(a1, r), geometricExplicit(a1.mul(r), r, -1)],
            t(
              `**Step 1: the first term and the ratio.** The first term is $a_1 = ${a1.toLatex()}$, and dividing the second term by the first gives the ratio:${ratioSteps(first, second)}**Step 2: the formula.** The $n$th term is $a_1$ multiplied by $r$ once for each of the $n - 1$ steps, so $${correct.latex}$.\n\n**Check.** At $n = 1$ the power is $${base(r)}^{0} = 1$, which leaves $${a1.toLatex()}$; at $n = 2$ the formula gives $${times(a1, base(r))} = ${second.toLatex()}$, the second term.`,
              `**第一步：首项和公比。** 首项 $a_1 = ${a1.toLatex()}$，用第二项除以第一项得到公比：${ratioSteps(first, second)}**第二步：写出公式。** 第 $n$ 项是 $a_1$ 在 $n - 1$ 步中每步乘一次 $r$，所以 $${correct.latex}$。\n\n**检验。** 当 $n = 1$ 时乘方为 $${base(r)}^{0} = 1$，剩下 $${a1.toLatex()}$；当 $n = 2$ 时公式给出 $${times(a1, base(r))} = ${second.toLatex()}$，正是第二项。`,
            ),
          ),
          [
            [
              `$${geometricExplicit(a1, r, 0).latex}$`,
              "The exponent should be $n - 1$: with $n$, the first term comes out already multiplied once.",
              "指数应是 $n - 1$：用 $n$ 的话，第一项已经被多乘了一次。",
            ],
            [`$${geometricExplicit(r, a1, -1).latex}$`, "The first term and the ratio are swapped.", "首项和公比弄反了。"],
            [
              `$${arithmeticExplicit(a1, r).latex}$`,
              "This adds, but the terms of this sequence are multiplied to get the next.",
              "这里用的是加法，但这个数列的项是相乘得到下一项的。",
            ],
            [
              `$${geometricExplicit(a1.mul(r), r, -1).latex}$`,
              "This starts at the second term of the sequence instead of the first.",
              "这里从数列的第二项开始，而不是第一项。",
            ],
          ],
        );
      },
    },
    {
      id: "finding-a-term",
      title: t("Finding a term", "求某一项"),
      explanation: t(
        `Substitute into $a_n = a_1 r^{n-1}$ and evaluate the power first, because the power stands for the repeated multiplication by $r$, which comes before multiplying by $a_1$. For $a_1 = -3$ and $r = 2$:

$$a_6 = -3 \\cdot 2^{5} = -3 \\cdot 32 = -96.$$

With a negative ratio, an even exponent gives a positive power and an odd one a negative power.

> **Watch out.** The $6$th term uses the exponent $5$; $-3 \\cdot 2^{6} = -192$ is the $7$th term. Do not multiply $a_1$ into the base: $(-3 \\cdot 2)^{5} = (-6)^{5}$ is a different number. And settle the sign of the power before multiplying.`,
        `代入 $a_n = a_1 r^{n-1}$，先计算乘方，因为乘方表示连乘 $r$，它要在乘以 $a_1$ 之前完成。当 $a_1 = -3$，$r = 2$ 时：

$$a_6 = -3 \\cdot 2^{5} = -3 \\cdot 32 = -96.$$

公比为负时，偶数次幂为正，奇数次幂为负。

> **注意。** 第 $6$ 项用的指数是 $5$；$-3 \\cdot 2^{6} = -192$ 是第 $7$ 项。不要把 $a_1$ 乘进底数：$(-3 \\cdot 2)^{5} = (-6)^{5}$ 是另一个数。还要在相乘之前先确定乘方的符号。`,
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
        const work = chainEq(`a_{${k}} = ${times(a1, `${base(r)}^{${k - 1}}`)}`, times(a1, paren(r.pow(k - 1))), ak.toLatex());
        const prev = a1.mul(r.pow(k - 2));
        return numberProblem({
          prompt: t(`Find the ${ordinal(k)} term of ${given[0]}.`, `求${given[1]}的第 ${k} 项。`),
          answer: ak,
          wrong: [a1.mul(r.pow(k)), a1.mul(r).pow(k - 1), ak.neg()],
          solution: t(
            `**Step 1: the formula.** Here $a_1 = ${a1.toLatex()}$ and $r = ${r.toLatex()}$, so $a_n = ${times(a1, `${base(r)}^{n-1}`)}$. The ${ordinal(k)} term uses the exponent $${k} - 1 = ${k - 1}$.\n\n**Step 2: evaluate.** Work out the power first, then multiply by the first term:${steps(work)}**Check.** The term before it is $a_{${k - 1}} = ${times(a1, `${base(r)}^{${k - 2}}`)} = ${prev.toLatex()}$, and one more factor of the ratio gives $${times(prev, base(r))} = ${ak.toLatex()}$.`,
            `**第一步：公式。** 这里 $a_1 = ${a1.toLatex()}$，$r = ${r.toLatex()}$，所以 $a_n = ${times(a1, `${base(r)}^{n-1}`)}$。第 $${k}$ 项用的指数是 $${k} - 1 = ${k - 1}$。\n\n**第二步：计算。** 先算乘方，再乘以首项：${steps(work)}**检验。** 它的前一项是 $a_{${k - 1}} = ${times(a1, `${base(r)}^{${k - 2}}`)} = ${prev.toLatex()}$，再乘一次公比得 $${times(prev, base(r))} = ${ak.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "evaluating-explicit-formulas",
      title: t("Evaluating explicit formulas", "由通项公式求项"),
      explanation: t(
        `An explicit formula may use $r^{n}$ or $r^{n+1}$ instead of $r^{n-1}$; it still describes a geometric sequence, only with a different constant in front. Substitute the index exactly as written. For $a_n = 3 \\cdot 2^{n}$:

$$a_4 = 3 \\cdot 2^{4} = 3 \\cdot 16 = 48.$$

> **Watch out.** Use the exponent the formula gives: here $a_4$ needs $2^{4}$, not $2^{3}$ out of habit from $r^{n-1}$. And multiply only after evaluating the power: $3 \\cdot 2^{4}$ is not $6^{4}$.`,
        `通项公式中也可能是 $r^{n}$ 或 $r^{n+1}$ 而不是 $r^{n-1}$；它仍然表示等比数列，只是前面的常数不同。按公式原样代入下标。对于 $a_n = 3 \\cdot 2^{n}$：

$$a_4 = 3 \\cdot 2^{4} = 3 \\cdot 16 = 48.$$

> **注意。** 要用公式给出的指数：这里 $a_4$ 需要 $2^{4}$，而不是习惯性地按 $r^{n-1}$ 用 $2^{3}$。先算乘方再相乘：$3 \\cdot 2^{4}$ 不是 $6^{4}$。`,
      ),
      keyPrerequisites: ["powers-of-rational-numbers"],
      generate(rng) {
        const { a1: c, r, k } = termRatio(rng);
        const shift = rng.pick([-1, 0, 1]);
        const kk = k - 1 - shift;
        const e = kk + shift;
        const value = c.mul(r.pow(e));
        const expr = times(c, `${base(r)}^{${exponent(shift)}}`);
        const work = chainEq(`a_{${kk}} = ${times(c, `${base(r)}^{${e}}`)}`, times(c, paren(r.pow(e))), value.toLatex());
        const prev = c.mul(r.pow(e - 1));
        const power = t(
          shift === 0
            ? `The exponent is $n$ itself, so it is $${kk}$.`
            : `The exponent is $${exponent(shift)}$, so at $n = ${kk}$ it is $${kk}${plus(shift)} = ${e}$.`,
          shift === 0
            ? `指数就是 $n$，所以是 $${kk}$。`
            : `指数是 $${exponent(shift)}$，所以当 $n = ${kk}$ 时为 $${kk}${plus(shift)} = ${e}$。`,
        );
        return numberProblem({
          prompt: t(`Given $a_n = ${expr}$, find $a_{${kk}}$.`, `已知 $a_n = ${expr}$，求 $a_{${kk}}$。`),
          answer: value,
          wrong: [c.mul(r.pow(kk - 1)), c.mul(r.pow(kk)), c.mul(r.pow(kk + 1)), c.mul(r).pow(kk + shift)],
          solution: t(
            `**Step 1: the exponent.** Substitute $n = ${kk}$ exactly as written. ${power.en}\n\n**Step 2: evaluate.** Work out the power first, then multiply:${steps(work)}**Check.** One step earlier, $a_{${kk - 1}} = ${times(c, `${base(r)}^{${e - 1}}`)} = ${prev.toLatex()}$, and one more factor of $${r.toLatex()}$ gives $${times(prev, base(r))} = ${value.toLatex()}$.`,
            `**第一步：指数。** 按公式原样代入 $n = ${kk}$。${power["zh-CN"]}\n\n**第二步：计算。** 先算乘方，再相乘：${steps(work)}**检验。** 前一项 $a_{${kk - 1}} = ${times(c, `${base(r)}^{${e - 1}}`)} = ${prev.toLatex()}$，再乘一次 $${r.toLatex()}$ 得 $${times(prev, base(r))} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

export const recursiveFormulasForGeometricSequences: TopicDef = {
  id: "recursive-formulas-for-geometric-sequences",
  title: t("The Recursive Formula for a Geometric Sequence", "等比数列的递推公式"),
  summary: t(
    "Write and use $a_1 = \\ldots$, $a_n = r a_{n-1}$, and translate between explicit and recursive formulas.",
    "写出并运用 $a_1 = \\ldots$，$a_n = r a_{n-1}$，并在通项公式与递推公式之间转换。",
  ),
  prerequisites: ["nth-term-of-a-geometric-sequence", "recursive-formulas-for-arithmetic-sequences"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSF.BF.A.2"],
  intro: t(
    `An arithmetic sequence has two descriptions: an explicit formula $a_n = a_1 + (n - 1)d$, and a recursive one, $a_1$ together with the rule $a_n = a_{n-1} + d$. A geometric sequence has the same two, and we already know its explicit formula $a_n = a_1 r^{n-1}$. Its recursive formula says just how the sequence is built: start from the first term and multiply by the common ratio each time.

For $2, -6, 18, -54, \\ldots$ the first term is $2$ and the ratio is $\\frac{-6}{2} = -3$, so

$$a_1 = 2, \\qquad a_n = -3a_{n-1}.$$

The rule rebuilds the list: $a_2 = -3 \\cdot 2 = -6$ and $a_3 = -3 \\cdot (-6) = 18$. The explicit formula $a_n = 2 \\cdot (-3)^{n-1}$ gives the same terms, but reaches any term at once.

In this lesson we write the recursive formula of a geometric sequence, use it forward and backward, and translate between the recursive and explicit formulas.`,
    `等差数列有两种描述：通项公式 $a_n = a_1 + (n - 1)d$，以及递推公式，即 $a_1$ 加上规则 $a_n = a_{n-1} + d$。等比数列也有这两种，我们已经知道它的通项公式 $a_n = a_1 r^{n-1}$。它的递推公式恰好说明数列是怎样构成的：从首项开始，每次乘以公比。

对于 $2, -6, 18, -54, \\ldots$，首项是 $2$，公比是 $\\frac{-6}{2} = -3$，所以

$$a_1 = 2, \\qquad a_n = -3a_{n-1}.$$

这个规则能还原数列：$a_2 = -3 \\cdot 2 = -6$，$a_3 = -3 \\cdot (-6) = 18$。通项公式 $a_n = 2 \\cdot (-3)^{n-1}$ 给出同样的项，但能一步求出任意一项。

这节课写出等比数列的递推公式，正向和反向使用它，并在递推公式与通项公式之间转换。`,
  ),
  knowledgePoints: [
    {
      id: "writing-the-recursive-formula",
      title: t("Writing the recursive formula", "写出递推公式"),
      explanation: t(
        `Every geometric sequence has a recursive formula of the same shape: the first term, and the rule *multiply by the common ratio*, since that is how each term comes from the one before.

$$a_1 = \\text{first term}, \\qquad a_n = r \\cdot a_{n-1}.$$

For $2, -6, 18, \\ldots$: the ratio is $\\frac{-6}{2} = -3$, so $a_1 = 2$ and $a_n = -3a_{n-1}$. The rule gives $-3 \\cdot (-6) = 18$, the third term.

> **Watch out.** The ratio is a term divided by the one before it; $\\frac{2}{-6}$ is upside down. Its sign matters: alternating signs mean a negative ratio. The first term is $a_1 = 2$, not the second term. And the rule multiplies; $a_n = a_{n-1} - 3$ would make the sequence arithmetic.`,
        `每个等比数列的递推公式都有相同的形式：第一项，以及规则*乘以公比*，因为每一项正是这样由前一项得到的。

$$a_1 = \\text{首项}, \\qquad a_n = r \\cdot a_{n-1}.$$

对于 $2, -6, 18, \\ldots$：公比是 $\\frac{-6}{2} = -3$，所以 $a_1 = 2$，$a_n = -3a_{n-1}$。规则给出 $-3 \\cdot (-6) = 18$，正是第三项。

> **注意。** 公比是某一项除以它的前一项；$\\frac{2}{-6}$ 是颠倒的。符号也要紧：正负交替说明公比为负。首项是 $a_1 = 2$，不是第二项。规则是相乘；$a_n = a_{n-1} - 3$ 会使数列成为等差数列。`,
      ),
      generate(rng) {
        const r = rng.pick(ratios.filter((x) => !x.eq(Q.one.neg())));
        const a1 = geometricStart(rng, r, 4, 9);
        const correct = geometricRecursive(a1, r);
        const [first, second, third] = correct.terms as [Q, Q, Q];
        return reasoned(
          formulaChoice(
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
              `**Step 1: the ratio.** Divide the second term by the first:${ratioSteps(first, second)}**Step 2: the formula.** The first term is $${a1.toLatex()}$ and each term is the previous one times $${r.toLatex()}$, so $${correct.latex}$.\n\n**Check.** The rule turns the second term into the third: $${times(r, paren(second))} = ${third.toLatex()}$.`,
              `**第一步：求公比。** 用第二项除以第一项：${ratioSteps(first, second)}**第二步：写出公式。** 首项是 $${a1.toLatex()}$，每一项都是前一项乘以 $${r.toLatex()}$，所以 $${correct.latex}$。\n\n**检验。** 规则把第二项变成第三项：$${times(r, paren(second))} = ${third.toLatex()}$。`,
            ),
          ),
          [
            [
              `$${arithmeticRecursive(a1, r).latex}$`,
              "This adds, but the terms of this sequence are multiplied to get the next.",
              "这里用的是加法，但这个数列的项是相乘得到下一项的。",
            ],
            [
              `$${geometricRecursive(a1, Q.one.div(r)).latex}$`,
              "The ratio is upside down: divide a term by the one before it, not the other way.",
              "公比颠倒了：应该用后一项除以前一项，而不是反过来。",
            ],
            [
              `$${geometricRecursive(a1.mul(r), r).latex}$`,
              "This starts at the second term of the sequence instead of the first.",
              "这里从数列的第二项开始，而不是第一项。",
            ],
            [
              `$${geometricRecursive(a1, r.neg()).latex}$`,
              "The ratio has the wrong sign: look at whether the signs of the terms alternate.",
              "公比的符号错了：看各项的符号是否交替。",
            ],
          ],
        );
      },
    },
    {
      id: "terms-from-the-recursive-formula",
      title: t("Terms from the recursive formula", "由递推公式求项"),
      explanation: t(
        `Each use of the rule multiplies by $r$, and from $a_1$ to $a_k$ the rule is used $k - 1$ times, so $a_k = a_1 r^{k-1}$: the power does all the multiplications at once. Going backward, each step undoes a multiplication, so divide by $r$ instead: if $a_n = 2a_{n-1}$ and $a_4 = 40$, then

$$a_1 = 40 \\div 2^{3} = 40 \\div 8 = 5.$$

Forward again, $5 \\cdot 2^{3} = 40$.

> **Watch out.** Count the uses of the rule: $k - 1$ of them, not $k$ and not $k - 2$. Going back, divide rather than multiply, and divide $3$ times to get from $a_4$ to $a_1$, not $4$ times or once. And the rule multiplies; adding $r$ at each step is a different sequence.`,
        `规则每用一次就乘以 $r$，从 $a_1$ 到 $a_k$ 共用 $k - 1$ 次，所以 $a_k = a_1 r^{k-1}$：乘方一次完成所有的乘法。倒推时每一步撤销一次乘法，所以改为除以 $r$：若 $a_n = 2a_{n-1}$ 且 $a_4 = 40$，则

$$a_1 = 40 \\div 2^{3} = 40 \\div 8 = 5.$$

再正向算一次，$5 \\cdot 2^{3} = 40$。

> **注意。** 数清规则用了几次：$k - 1$ 次，不是 $k$ 次，也不是 $k - 2$ 次。倒推时要除而不是乘，从 $a_4$ 到 $a_1$ 要除 $3$ 次，不是 $4$ 次或 $1$ 次。规则是相乘；每一步加上 $r$ 是另一个数列。`,
      ),
      generate(rng) {
        const { a1, r, k } = termRatio(rng);
        const ak = a1.mul(r.pow(k - 1));
        const rule = poly([r, "a_{n-1}"]);
        if (rng.bool()) {
          const work = chainEq(`a_{${k}} = ${times(a1, `${base(r)}^{${k - 1}}`)}`, times(a1, paren(r.pow(k - 1))), ak.toLatex());
          const prev = a1.mul(r.pow(k - 2));
          return numberProblem({
            prompt: t(
              `A sequence is defined by $a_1 = ${a1.toLatex()}$ and $a_n = ${rule}$. Find $a_{${k}}$.`,
              `数列由 $a_1 = ${a1.toLatex()}$ 和 $a_n = ${rule}$ 定义。求 $a_{${k}}$。`,
            ),
            answer: ak,
            wrong: [a1.mul(r.pow(k)), a1.mul(r.pow(k - 2)), a1.add(r.mul(Q.of(k - 1)))],
            solution: t(
              `**Step 1: count the uses of the rule.** Each use multiplies by $${r.toLatex()}$, and from $a_1$ to $a_{${k}}$ the rule is used $${k} - 1 = ${k - 1}$ times.\n\n**Step 2: multiply all at once.** The power does the $${k - 1}$ multiplications:${steps(work)}**Check.** The term before is $a_{${k - 1}} = ${prev.toLatex()}$, and the rule gives $a_{${k}} = ${times(r, paren(prev))} = ${ak.toLatex()}$.`,
              `**第一步：数规则用了几次。** 每用一次乘以 $${r.toLatex()}$，从 $a_1$ 到 $a_{${k}}$ 共用 $${k} - 1 = ${k - 1}$ 次。\n\n**第二步：一次乘完。** 乘方完成这 $${k - 1}$ 次乘法：${steps(work)}**检验。** 前一项 $a_{${k - 1}} = ${prev.toLatex()}$，规则给出 $a_{${k}} = ${times(r, paren(prev))} = ${ak.toLatex()}$。`,
            ),
          });
        }
        const m = Math.min(k, 5);
        const am = a1.mul(r.pow(m - 1));
        const back = chainEq(
          `a_1 = ${am.toLatex()} \\div ${base(r)}^{${m - 1}}`,
          `${am.toLatex()} \\div ${paren(r.pow(m - 1))}`,
          a1.toLatex(),
        );
        return numberProblem({
          prompt: t(
            `A sequence satisfies $a_n = ${rule}$ and $a_{${m}} = ${am.toLatex()}$. Find $a_1$.`,
            `数列满足 $a_n = ${rule}$，且 $a_{${m}} = ${am.toLatex()}$。求 $a_1$。`,
          ),
          answer: a1,
          wrong: [am.mul(r.pow(m - 1)), am.div(r.pow(m)), am.div(r)],
          solution: t(
            `**Step 1: count the steps back.** Each step forward multiplies by $${r.toLatex()}$, so each step back divides by it. From $a_{${m}}$ to $a_1$ there are $${m} - 1 = ${m - 1}$ steps.\n\n**Step 2: divide all at once.** Dividing by $${r.toLatex()}$ a total of $${m - 1}$ times is dividing by its power:${steps(back)}**Check.** Forward from $a_1$: $${times(a1, `${base(r)}^{${m - 1}}`)} = ${am.toLatex()}$, the given $a_{${m}}$.`,
            `**第一步：数倒推的步数。** 每向后一步乘以 $${r.toLatex()}$，所以每倒推一步就除以它。从 $a_{${m}}$ 到 $a_1$ 共 $${m} - 1 = ${m - 1}$ 步。\n\n**第二步：一次除完。** 除以 $${r.toLatex()}$ 共 $${m - 1}$ 次，就是除以它的乘方：${steps(back)}**检验。** 从 $a_1$ 正向计算：$${times(a1, `${base(r)}^{${m - 1}}`)} = ${am.toLatex()}$，正是所给的 $a_{${m}}$。`,
          ),
        });
      },
    },
    {
      id: "recursive-to-explicit",
      title: t("From recursive to explicit", "由递推公式到通项公式"),
      explanation: t(
        `In a geometric sequence each term is the one before multiplied by the common ratio, so the term in position $n$ has been multiplied by the ratio $n - 1$ times.

A recursive formula $a_1 = a$, $a_n = r a_{n-1}$ gives the first term and the ratio directly; substitute them into $a_n = a_1 r^{n-1}$:

$$a_1 = 7, \\; a_n = -2a_{n-1} \\quad\\Longrightarrow\\quad a_n = 7 \\cdot (-2)^{n-1}.$$

At $n = 2$ both give $-14$.

> **Watch out.** The exponent is $n - 1$: $7 \\cdot (-2)^{n}$ gives $-14$ already at $n = 1$. The number that multiplies $a_{n-1}$ is the ratio, sign included, and it goes in the base, while the first term goes in front.`,
        `在等比数列中，每一项等于前一项乘公比，所以第 $n$ 项是首项乘了 $n - 1$ 次公比。

递推公式 $a_1 = a$，$a_n = r a_{n-1}$ 直接给出首项和公比，把它们代入 $a_n = a_1 r^{n-1}$：

$$a_1 = 7, \\; a_n = -2a_{n-1} \\quad\\Longrightarrow\\quad a_n = 7 \\cdot (-2)^{n-1}.$$

当 $n = 2$ 时两者都给出 $-14$。

> **注意。** 指数是 $n - 1$：$7 \\cdot (-2)^{n}$ 在 $n = 1$ 时就得 $-14$。乘以 $a_{n-1}$ 的那个数连同符号就是公比，它作底数，首项放在前面。`,
      ),
      generate(rng) {
        const r = rng.pick(ratios.filter((x) => !x.eq(Q.one.neg())));
        const a1 = Q.of(rng.nonZero(-9, 9));
        const correct = geometricExplicit(a1, r, -1);
        const rule = poly([r, "a_{n-1}"]);
        const a2 = a1.mul(r);
        const a3 = a2.mul(r);
        return reasoned(
          formulaChoice(
            rng,
            t(
              `A sequence is defined by $a_1 = ${a1.toLatex()}$ and $a_n = ${rule}$. Which is an explicit formula for it?`,
              `数列由 $a_1 = ${a1.toLatex()}$ 和 $a_n = ${rule}$ 定义。下列哪个是它的通项公式？`,
            ),
            correct,
            [geometricExplicit(a1, r, 0), geometricExplicit(r, a1, -1), arithmeticExplicit(a1, r), geometricExplicit(a1, r.neg(), -1)],
            t(
              `**Step 1: read off the parts.** The first term is $${a1.toLatex()}$, and the number that multiplies $a_{n-1}$ is the ratio, $r = ${r.toLatex()}$.\n\n**Step 2: substitute.** Put them into $a_n = a_1 r^{n-1}$: $${correct.latex}$.\n\n**Check.** At $n = 3$ the explicit formula gives $${times(a1, `${base(r)}^{2}`)} = ${a3.toLatex()}$. The rule gives $a_2 = ${times(r, paren(a1))} = ${a2.toLatex()}$ and then $a_3 = ${times(r, paren(a2))} = ${a3.toLatex()}$, the same.`,
              `**第一步：读出各部分。** 首项是 $${a1.toLatex()}$，乘以 $a_{n-1}$ 的数就是公比 $r = ${r.toLatex()}$。\n\n**第二步：代入。** 代入 $a_n = a_1 r^{n-1}$：$${correct.latex}$。\n\n**检验。** 当 $n = 3$ 时，通项公式给出 $${times(a1, `${base(r)}^{2}`)} = ${a3.toLatex()}$。规则给出 $a_2 = ${times(r, paren(a1))} = ${a2.toLatex()}$，再得 $a_3 = ${times(r, paren(a2))} = ${a3.toLatex()}$，结果相同。`,
            ),
          ),
          [
            [
              `$${geometricExplicit(a1, r, 0).latex}$`,
              "The exponent should be $n - 1$: with $n$, the first term comes out already multiplied once.",
              "指数应是 $n - 1$：用 $n$ 的话，第一项已经被多乘了一次。",
            ],
            [`$${geometricExplicit(r, a1, -1).latex}$`, "The first term and the ratio are swapped.", "首项和公比弄反了。"],
            [
              `$${arithmeticExplicit(a1, r).latex}$`,
              "This adds, but the terms of this sequence are multiplied to get the next.",
              "这里用的是加法，但这个数列的项是相乘得到下一项的。",
            ],
            [
              `$${geometricExplicit(a1, r.neg(), -1).latex}$`,
              "The ratio has the wrong sign: it is the number that multiplies $a_{n-1}$, sign included.",
              "公比的符号错了：它是乘以 $a_{n-1}$ 的那个数，连同符号。",
            ],
          ],
        );
      },
    },
    {
      id: "explicit-to-recursive",
      title: t("From explicit to recursive", "由通项公式到递推公式"),
      explanation: t(
        `From an explicit formula, the ratio is the base of the power, because raising $n$ by $1$ adds one more factor of the base. The first term comes from substituting $n = 1$. Careful when the exponent is not $n - 1$:

$$a_n = 5 \\cdot 3^{n}: \\quad a_1 = 5 \\cdot 3 = 15 \\quad\\Longrightarrow\\quad a_1 = 15, \\; a_n = 3a_{n-1}.$$

Then $a_2 = 3 \\cdot 15 = 45$, and the explicit formula agrees: $5 \\cdot 3^{2} = 45$.

> **Watch out.** The coefficient in front is $a_1$ only when the exponent is $n - 1$; here $a_1$ is $15$, not $5$. The ratio is the base $3$, not the coefficient. And the rule multiplies; adding $3$ each time is a different sequence.`,
        `由通项公式，公比是幂的底数，因为 $n$ 增加 $1$ 就多一个底数因数。首项由代入 $n = 1$ 得到。指数不是 $n - 1$ 时要小心：

$$a_n = 5 \\cdot 3^{n}: \\quad a_1 = 5 \\cdot 3 = 15 \\quad\\Longrightarrow\\quad a_1 = 15, \\; a_n = 3a_{n-1}.$$

于是 $a_2 = 3 \\cdot 15 = 45$，通项公式也一致：$5 \\cdot 3^{2} = 45$。

> **注意。** 只有指数是 $n - 1$ 时，前面的系数才是 $a_1$；这里 $a_1$ 是 $15$ 而不是 $5$。公比是底数 $3$，不是系数。规则是相乘；每次加 $3$ 是另一个数列。`,
      ),
      generate(rng) {
        const r = rng.pick(ratios.filter((x) => !x.eq(Q.one.neg())));
        const shift = rng.pick([-1, 0, 0, 1]);
        const c = Q.of(rng.nonZero(-9, 9)).mul(Q.of(r.d).pow(shift + 1));
        const a1 = c.mul(r.pow(shift + 1));
        const correct = geometricRecursive(a1, r);
        const expr = times(c, `${base(r)}^{${exponent(shift)}}`);
        const at = (e: number) => (e === 1 ? times(c, base(r)) : times(c, `${base(r)}^{${e}}`));
        const a2 = a1.mul(r);
        const first = `a_1 = ${chainEq(at(1 + shift), a1.toLatex())}`;
        const power = t(
          shift === 0
            ? "at $n = 1$ the exponent $n$ is $1$"
            : `at $n = 1$ the exponent $${exponent(shift)}$ is $1${plus(shift)} = ${1 + shift}$`,
          shift === 0 ? "当 $n = 1$ 时指数 $n$ 为 $1$" : `当 $n = 1$ 时指数 $${exponent(shift)}$ 为 $1${plus(shift)} = ${1 + shift}$`,
        );
        return reasoned(
          formulaChoice(
            rng,
            t(`Which recursive formula defines the sequence $a_n = ${expr}$?`, `哪个递推公式定义了数列 $a_n = ${expr}$？`),
            correct,
            [geometricRecursive(c, r), geometricRecursive(a1, c), arithmeticRecursive(a1, r), geometricRecursive(r, c)],
            t(
              `**Step 1: the ratio.** Raising $n$ by $1$ adds one more factor of the base, so the ratio is the base, $${r.toLatex()}$.\n\n**Step 2: the first term.** Substitute $n = 1$: ${power.en}, so $${first}$. The recursive formula is $${correct.latex}$.\n\n**Check.** The rule gives $a_2 = ${times(r, paren(a1))} = ${a2.toLatex()}$, and the explicit formula agrees: $${at(2 + shift)} = ${a2.toLatex()}$.`,
              `**第一步：公比。** $n$ 增加 $1$ 就多一个底数因数，所以公比是底数 $${r.toLatex()}$。\n\n**第二步：首项。** 代入 $n = 1$：${power["zh-CN"]}，所以 $${first}$。递推公式是 $${correct.latex}$。\n\n**检验。** 规则给出 $a_2 = ${times(r, paren(a1))} = ${a2.toLatex()}$，通项公式也一致：$${at(2 + shift)} = ${a2.toLatex()}$。`,
            ),
          ),
          [
            [
              `$${geometricRecursive(c, r).latex}$`,
              "This starts at the coefficient, but $a_1$ is the value at $n = 1$, with the power worked out.",
              "这里从系数开始，但 $a_1$ 是 $n = 1$ 时的值，要把幂算出来。",
            ],
            [
              `$${geometricRecursive(a1, c).latex}$`,
              "This multiplies by the coefficient, but the ratio is the base of the power.",
              "这里乘的是系数，但公比是幂的底数。",
            ],
            [
              `$${arithmeticRecursive(a1, r).latex}$`,
              "This adds, but the terms of this sequence are multiplied to get the next.",
              "这里用的是加法，但这个数列的项是相乘得到下一项的。",
            ],
            [
              `$${geometricRecursive(r, c).latex}$`,
              "This uses the base as the first term and the coefficient as the ratio, the wrong way around.",
              "这里把底数当首项、系数当公比，正好弄反了。",
            ],
          ],
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

/** powerOf writes r to the power e, leaving out an exponent 1: "3^{2}", "\left(-2\right)". */
const powerOf = (r: Q, e: number) => (e === 1 ? base(r) : `${base(r)}^{${e}}`);

/** rootText says which root of r^gap is the ratio: the cube root, or the square root of the stated sign. */
const rootText = (gap: number, r: Q): Text =>
  gap % 2 === 1
    ? t(`An odd power has a single real root, so $r = ${r.toLatex()}$.`, `奇数次幂只有一个实数根，所以 $r = ${r.toLatex()}$。`)
    : t(
        `An even power has two roots, $${r.abs().toLatex()}$ and $${r.abs().neg().toLatex()}$; the ratio is ${r.sign() > 0 ? "positive" : "negative"}, so $r = ${r.toLatex()}$.`,
        `偶数次幂有两个根 $${r.abs().toLatex()}$ 和 $${r.abs().neg().toLatex()}$；公比为${r.sign() > 0 ? "正" : "负"}，所以 $r = ${r.toLatex()}$。`,
      );

export const geometricSequencesFromTwoTerms: TopicDef = {
  id: "geometric-sequences-from-two-terms",
  title: t("Finding the Common Ratio of a Geometric Sequence Given Two Terms", "由两项求等比数列的公比"),
  summary: t(
    "Find the common ratio, the first term and other terms from two terms of a geometric sequence.",
    "由等比数列的两项求公比、首项和其他项。",
  ),
  prerequisites: ["nth-term-of-a-geometric-sequence", "square-roots-and-cube-roots"],
  encompasses: [
    { topic: "nth-term-of-a-geometric-sequence", weight: 0.5 },
    { topic: "square-roots-and-cube-roots", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.2"],
  intro: t(
    `The formula $a_n = a_1 r^{n-1}$ needs the first term and the common ratio. When only two terms are known, say $a_2 = 6$ and $a_5 = 162$, the steps between them still tell the story. From $a_2$ to $a_5$ the sequence is multiplied by $r$ three times, so

$$6 \\cdot r^{3} = 162 \\;\\Rightarrow\\; r^{3} = 27 \\;\\Rightarrow\\; r = 3.$$

This is where roots come in: undoing a cube needs a cube root, and undoing a square needs a square root. Then dividing back once from $a_2$ gives $a_1 = 6 \\div 3 = 2$, and the sequence is $a_n = 2 \\cdot 3^{n-1}$.

An even number of steps leaves a choice: $r^{2} = 16$ allows $r = 4$ and $r = -4$, so the sign of the ratio must be given. In this lesson we find the common ratio, the first term and other terms from two terms.`,
    `公式 $a_n = a_1 r^{n-1}$ 需要首项和公比。当只知道两项时，比如 $a_2 = 6$ 和 $a_5 = 162$，它们之间的步数仍然说明了一切。从 $a_2$ 到 $a_5$，数列乘了三次 $r$，所以

$$6 \\cdot r^{3} = 162 \\;\\Rightarrow\\; r^{3} = 27 \\;\\Rightarrow\\; r = 3.$$

这里要用到开方：撤销立方要开立方，撤销平方要开平方。再从 $a_2$ 往回除一次，得 $a_1 = 6 \\div 3 = 2$，数列为 $a_n = 2 \\cdot 3^{n-1}$。

步数为偶数时会有两种可能：$r^{2} = 16$ 允许 $r = 4$ 和 $r = -4$，所以必须给出公比的正负。这节课由两项求公比、首项和其他项。`,
  ),
  knowledgePoints: [
    {
      id: "common-ratio-from-two-terms",
      title: t("The common ratio from two terms", "由两项求公比"),
      explanation: t(
        `From $a_p$ to $a_q$ the sequence is multiplied by $r$ a total of $q - p$ times, so $a_q = a_p \\cdot r^{q-p}$, and dividing,

$$r^{q-p} = \\frac{a_q}{a_p}.$$

If $a_2 = 6$ and $a_5 = 162$: $r^{3} = 27$, so $r = 3$, and indeed $6 \\cdot 3^{3} = 162$. With an even power there are two roots: $r^{2} = 16$ gives $r = 4$ or $r = -4$, so the problem must say which sign the ratio has.

> **Watch out.** The quotient $\\frac{162}{6} = 27$ is $r^{3}$, three steps together, not $r$: take the root. Do not subtract and divide by the steps, as for an arithmetic sequence. And with an even power, pick the root with the stated sign.`,
        `从 $a_p$ 到 $a_q$，数列共乘以 $r$ $q - p$ 次，所以 $a_q = a_p \\cdot r^{q-p}$，相除得

$$r^{q-p} = \\frac{a_q}{a_p}.$$

若 $a_2 = 6$，$a_5 = 162$：$r^{3} = 27$，所以 $r = 3$，确实 $6 \\cdot 3^{3} = 162$。偶数次幂有两个根：$r^{2} = 16$ 得 $r = 4$ 或 $r = -4$，所以题目必须说明公比的正负。

> **注意。** 商 $\\frac{162}{6} = 27$ 是 $r^{3}$，是三步合起来的，不是 $r$：要开方。不要像等差数列那样相减再除以步数。偶数次幂时，要取符号符合题意的那个根。`,
      ),
      keyPrerequisites: ["square-roots-and-cube-roots"],
      generate(rng) {
        const s = twoGeometricTerms(rng, 1);
        const root = rootText(s.gap, s.r);
        return numberProblem({
          prompt: givenGeometric(s, "Find the common ratio.", "求公比。"),
          answer: s.r,
          wrong: [s.y.div(s.x), s.y.sub(s.x).div(Q.of(s.gap)), s.r.neg()],
          solution: t(
            `**Step 1: count the steps.** From $a_{${s.p}}$ to $a_{${s.q}}$ there are $${s.q} - ${s.p} = ${s.gap}$ steps, each multiplying by $r$, so $a_{${s.q}} = a_{${s.p}} \\cdot r^{${s.gap}}$.\n\n**Step 2: divide, then take the root.**${rootSteps(s.gap, s.x, s.y, s.r)}${root.en}\n\n**Check.** $${times(s.x, powerOf(s.r, s.gap))} = ${s.y.toLatex()}$, the given $a_{${s.q}}$.`,
            `**第一步：数步数。** 从 $a_{${s.p}}$ 到 $a_{${s.q}}$ 共 $${s.q} - ${s.p} = ${s.gap}$ 步，每步乘以 $r$，所以 $a_{${s.q}} = a_{${s.p}} \\cdot r^{${s.gap}}$。\n\n**第二步：相除，再开方。**${rootSteps(s.gap, s.x, s.y, s.r)}${root["zh-CN"]}\n\n**检验。** $${times(s.x, powerOf(s.r, s.gap))} = ${s.y.toLatex()}$，正是所给的 $a_{${s.q}}$。`,
          ),
        });
      },
    },
    {
      id: "first-term-from-two-terms",
      title: t("The first term from two terms", "由两项求首项"),
      explanation: t(
        `Walking back in a geometric sequence undoes the multiplications, so each step back divides by the common ratio.

Once $r$ is known, divide $a_p$ by $r$ a total of $p - 1$ times:

$$a_1 = \\frac{a_p}{r^{p-1}}.$$

With $a_2 = 6$ and $r = 3$: $a_1 = \\frac{6}{3} = 2$. Forward again, $2 \\cdot 3^{4} = 162 = a_5$.

> **Watch out.** From $a_p$ back to $a_1$ is $p - 1$ steps, not $p$. Going back divides by $r$; multiplying moves forward instead. And keep the signs: with a negative ratio, each step back flips the sign.`,
        `在等比数列中往回推就是撤销乘法，所以每退一步都要除以公比。

求出 $r$ 后，用 $a_p$ 除以 $r$ 共 $p - 1$ 次：

$$a_1 = \\frac{a_p}{r^{p-1}}.$$

当 $a_2 = 6$，$r = 3$ 时：$a_1 = \\frac{6}{3} = 2$。再正向算，$2 \\cdot 3^{4} = 162 = a_5$。

> **注意。** 从 $a_p$ 回到 $a_1$ 是 $p - 1$ 步，不是 $p$ 步。往回推要除以 $r$；乘以 $r$ 是向前走。还要注意符号：公比为负时，每退一步符号都改变。`,
      ),
      generate(rng) {
        const s = twoGeometricTerms(rng, 2);
        const root = rootText(s.gap, s.r);
        const back = chainEq(
          `a_1 = ${s.x.toLatex()} \\div ${powerOf(s.r, s.p - 1)}`,
          `${s.x.toLatex()} \\div ${paren(s.r.pow(s.p - 1))}`,
          s.a1.toLatex(),
        );
        return numberProblem({
          prompt: givenGeometric(s, "Find $a_1$.", "求 $a_1$。"),
          answer: s.a1,
          wrong: [s.x.div(s.r.pow(s.p)), s.x.mul(s.r.pow(s.p - 1)), s.a1.neg()],
          solution: t(
            `**Step 1: the ratio.** There are $${s.gap}$ steps from $a_{${s.p}}$ to $a_{${s.q}}$:${rootSteps(s.gap, s.x, s.y, s.r)}${root.en}\n\n**Step 2: step back.** From $a_{${s.p}}$ to $a_1$ there ${s.p === 2 ? "is $1$ step" : `are $${s.p - 1}$ steps`}, each dividing by $r$:${steps(back)}**Check.** Forward from $a_1$ to $a_{${s.q}}$: $${times(s.a1, powerOf(s.r, s.q - 1))} = ${s.y.toLatex()}$.`,
            `**第一步：求公比。** 从 $a_{${s.p}}$ 到 $a_{${s.q}}$ 共 $${s.gap}$ 步：${rootSteps(s.gap, s.x, s.y, s.r)}${root["zh-CN"]}\n\n**第二步：往回推。** 从 $a_{${s.p}}$ 到 $a_1$ 共 $${s.p - 1}$ 步，每步除以 $r$：${steps(back)}**检验。** 从 $a_1$ 正向算到 $a_{${s.q}}$：$${times(s.a1, powerOf(s.r, s.q - 1))} = ${s.y.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "a-term-from-two-terms",
      title: t("A term from two terms", "由两项求某一项"),
      explanation: t(
        `To find a later term, start from the last known term and multiply by $r$ once for each step: $a_k = a_q \\cdot r^{k-q}$. With $a_5 = 162$ and $r = 3$:

$$a_7 = 162 \\cdot 3^{2} = 1458.$$

Through the first term it agrees: $a_1 = 2$ and $2 \\cdot 3^{6} = 1458$.

> **Watch out.** From $a_5$ to $a_7$ is $2$ steps, so the power is $3^{2}$, not $3^{3}$. Use the ratio $r$ itself, not the quotient $\\frac{a_q}{a_p}$, which is a power of $r$. And with a negative ratio, settle the sign of the power.`,
        `求后面的某一项时，从最后一个已知项出发，每走一步乘一次 $r$：$a_k = a_q \\cdot r^{k-q}$。当 $a_5 = 162$，$r = 3$ 时：

$$a_7 = 162 \\cdot 3^{2} = 1458.$$

经过首项来算也一致：$a_1 = 2$，$2 \\cdot 3^{6} = 1458$。

> **注意。** 从 $a_5$ 到 $a_7$ 是 $2$ 步，所以乘方是 $3^{2}$ 而不是 $3^{3}$。要用公比 $r$ 本身，而不是商 $\\frac{a_q}{a_p}$，那是 $r$ 的乘方。公比为负时，还要确定乘方的符号。`,
      ),
      generate(rng) {
        const s = twoGeometricTerms(rng, 1);
        const k = s.q + rng.int(1, 3);
        const ak = s.a1.mul(s.r.pow(k - 1));
        const root = rootText(s.gap, s.r);
        const on = chainEq(`a_{${k}} = ${times(s.y, powerOf(s.r, k - s.q))}`, times(s.y, paren(s.r.pow(k - s.q))), ak.toLatex());
        return numberProblem({
          prompt: givenGeometric(s, `Find $a_{${k}}$.`, `求 $a_{${k}}$。`),
          answer: ak,
          wrong: [s.y.mul(s.r.pow(k - s.q + 1)), s.y.mul(s.y.div(s.x).pow(k - s.q)), ak.neg()],
          solution: t(
            `**Step 1: the ratio.** There are $${s.gap}$ steps from $a_{${s.p}}$ to $a_{${s.q}}$:${rootSteps(s.gap, s.x, s.y, s.r)}${root.en}\n\n**Step 2: count on.** From $a_{${s.q}}$ to $a_{${k}}$ there ${k - s.q === 1 ? "is $1$ step" : `are $${k - s.q}$ steps`}:${steps(on)}**Check.** Through the first term, $a_1 = ${s.a1.toLatex()}$ and $a_{${k}} = ${times(s.a1, powerOf(s.r, k - 1))} = ${ak.toLatex()}$.`,
            `**第一步：求公比。** 从 $a_{${s.p}}$ 到 $a_{${s.q}}$ 共 $${s.gap}$ 步：${rootSteps(s.gap, s.x, s.y, s.r)}${root["zh-CN"]}\n\n**第二步：往后数。** 从 $a_{${s.q}}$ 到 $a_{${k}}$ 共 $${k - s.q}$ 步：${steps(on)}**检验。** 经过首项来算，$a_1 = ${s.a1.toLatex()}$，$a_{${k}} = ${times(s.a1, powerOf(s.r, k - 1))} = ${ak.toLatex()}$。`,
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

/** indexSolution writes the steps and the check for the index of v in the sequence a_1 r^{n-1}. */
const indexSolution = (a1: Q, r: Q, v: Q, k: number): Text =>
  t(
    `**Step 1: the equation.** Here $a_1 = ${a1.toLatex()}$ and $r = ${r.toLatex()}$, so the term in position $n$ is $${times(a1, `${base(r)}^{n-1}`)}$. Set it equal to $${v.toLatex()}$.\n\n**Step 2: match the powers.** Divide by the first term, write what remains as a power of $${r.toLatex()}$, and compare exponents:${indexSteps(a1, r, v, k)}**Check.** $a_{${k}} = ${times(a1, `${base(r)}^{${k - 1}}`)} = ${v.toLatex()}$.`,
    `**第一步：列方程。** 这里 $a_1 = ${a1.toLatex()}$，$r = ${r.toLatex()}$，所以位置 $n$ 上的项是 $${times(a1, `${base(r)}^{n-1}`)}$。令它等于 $${v.toLatex()}$。\n\n**第二步：对应乘方。** 两边除以首项，把剩下的写成 $${r.toLatex()}$ 的乘方，再比较指数：${indexSteps(a1, r, v, k)}**检验。** $a_{${k}} = ${times(a1, `${base(r)}^{${k - 1}}`)} = ${v.toLatex()}$。`,
  );

export const indexOfATermInAGeometricSequence: TopicDef = {
  id: "index-of-a-term-in-a-geometric-sequence",
  title: t("Determining Indexes of Terms in Geometric Sequences", "确定等比数列中项的序号"),
  summary: t("Find which term of a geometric sequence has a given value.", "求等比数列中取给定值的是第几项。"),
  prerequisites: ["nth-term-of-a-geometric-sequence"],
  encompasses: [{ topic: "nth-term-of-a-geometric-sequence", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSF.LE.A.2"],
  intro: t(
    `The explicit formula $a_n = a_1 r^{n-1}$ turns a position into a term. The reverse question asks which position holds a given value: in $3, 6, 12, \\ldots$, which term is $384$?

Set the formula equal to the value. This time $n$ sits in an exponent, so instead of undoing an addition we divide by the first term and recognize the power that remains:

$$3 \\cdot 2^{n-1} = 384 \\;\\Rightarrow\\; 2^{n-1} = 128 = 2^{7} \\;\\Rightarrow\\; n - 1 = 7 \\;\\Rightarrow\\; n = 8.$$

Two powers of the same base, other than $0$, $1$ or $-1$, are equal only when their exponents are equal, which is what lets us compare exponents. In this lesson we find the index of a value from listed terms, with whole and with fractional ratios, and from an explicit formula.`,
    `通项公式 $a_n = a_1 r^{n-1}$ 把位置变成项。反过来的问题是：某个值在哪个位置？在 $3, 6, 12, \\ldots$ 中，$384$ 是第几项？

令公式等于这个值。这一次 $n$ 在指数上，所以不是撤销加法，而是两边除以首项，再认出剩下的是哪个乘方：

$$3 \\cdot 2^{n-1} = 384 \\;\\Rightarrow\\; 2^{n-1} = 128 = 2^{7} \\;\\Rightarrow\\; n - 1 = 7 \\;\\Rightarrow\\; n = 8.$$

底数相同（且不是 $0$、$1$ 或 $-1$）的两个乘方，只有指数相等时才相等，所以可以比较指数。这节课由列出的项（公比为整数或分数）以及由通项公式求某个值的序号。`,
  ),
  knowledgePoints: [
    {
      id: "index-from-listed-terms",
      title: t("The index from listed terms", "由列出的项求序号"),
      explanation: t(
        `Set $a_1 r^{n-1}$ equal to the value, divide by $a_1$, and find which power of $r$ remains; equal powers of the same base have equal exponents. In $3, 6, 12, \\ldots$, the value $384$:

$$3 \\cdot 2^{n-1} = 384 \\;\\Rightarrow\\; 2^{n-1} = 128 = 2^{7} \\;\\Rightarrow\\; n - 1 = 7 \\;\\Rightarrow\\; n = 8.$$

Indeed $3 \\cdot 2^{7} = 384$.

> **Watch out.** The exponent $7$ is $n - 1$, the number of steps after the first term; the position is $n = 8$. Answering $7$, or $9$, is off by one.`,
        `令 $a_1 r^{n-1}$ 等于给定值，两边除以 $a_1$，再看剩下的是 $r$ 的几次幂；同底数的乘方相等，指数就相等。在 $3, 6, 12, \\ldots$ 中，值 $384$：

$$3 \\cdot 2^{n-1} = 384 \\;\\Rightarrow\\; 2^{n-1} = 128 = 2^{7} \\;\\Rightarrow\\; n - 1 = 7 \\;\\Rightarrow\\; n = 8.$$

确实 $3 \\cdot 2^{7} = 384$。

> **注意。** 指数 $7$ 是 $n - 1$，即首项之后的步数；所求位置是 $n = 8$。答 $7$ 或 $9$ 都差了一。`,
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
          solution: indexSolution(a1, r, v, k),
        });
      },
    },
    {
      id: "index-with-fractional-ratios",
      title: t("Fractional ratios", "分数公比"),
      explanation: t(
        `To find which term has a given value, set the explicit formula equal to that value and solve for $n$ by writing both sides as powers of the ratio.

The same method works when the terms shrink. In $640, 320, 160, \\ldots$, the value $5$:

$$640 \\cdot \\left(\\frac{1}{2}\\right)^{n-1} = 5 \\;\\Rightarrow\\; \\left(\\frac{1}{2}\\right)^{n-1} = \\frac{1}{128} = \\left(\\frac{1}{2}\\right)^{7} \\;\\Rightarrow\\; n = 8.$$

> **Watch out.** Write the quotient as a power of the ratio itself: $\\frac{1}{128}$ is $\\left(\\frac{1}{2}\\right)^{7}$, so $n - 1 = 7$ and $n = 8$, not $7$ or $9$.`,
        `要找出某个值是第几项，就令通项公式等于这个值，把两边写成公比的幂，再解出 $n$。

当各项逐渐变小时，方法相同。在 $640, 320, 160, \\ldots$ 中，值 $5$：

$$640 \\cdot \\left(\\frac{1}{2}\\right)^{n-1} = 5 \\;\\Rightarrow\\; \\left(\\frac{1}{2}\\right)^{n-1} = \\frac{1}{128} = \\left(\\frac{1}{2}\\right)^{7} \\;\\Rightarrow\\; n = 8.$$

> **注意。** 要把商写成公比本身的乘方：$\\frac{1}{128}$ 是 $\\left(\\frac{1}{2}\\right)^{7}$，所以 $n - 1 = 7$，$n = 8$，而不是 $7$ 或 $9$。`,
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
          solution: indexSolution(a1, r, v, k),
        });
      },
    },
    {
      id: "index-from-the-explicit-formula",
      title: t("The index from an explicit formula", "由通项公式求序号"),
      explanation: t(
        `With an explicit formula, match the exponent as written, because that is the expression in $n$ the power depends on. For $a_n = 2 \\cdot 3^{n}$ and the value $486$:

$$2 \\cdot 3^{n} = 486 \\;\\Rightarrow\\; 3^{n} = 243 = 3^{5} \\;\\Rightarrow\\; n = 5.$$

Here the exponent is $n$ itself, so there is no $1$ to add.

> **Watch out.** Solve the exponent as written: for $3^{n+1} = 3^{5}$, $n + 1 = 5$ gives $n = 4$, not $5$ or $6$. Adding $1$ out of habit from $r^{n-1}$ is off by one.`,
        `给出通项公式时，按公式中的指数对应，因为乘方依赖的正是这个关于 $n$ 的式子。对于 $a_n = 2 \\cdot 3^{n}$ 和值 $486$：

$$2 \\cdot 3^{n} = 486 \\;\\Rightarrow\\; 3^{n} = 243 = 3^{5} \\;\\Rightarrow\\; n = 5.$$

这里指数就是 $n$ 本身，所以不需要再加 $1$。

> **注意。** 按原样解指数：对于 $3^{n+1} = 3^{5}$，由 $n + 1 = 5$ 得 $n = 4$，不是 $5$ 或 $6$。按 $r^{n-1}$ 的习惯加上 $1$ 会差一。`,
      ),
      generate(rng) {
        const r = Q.of(rng.pick([2, 3, -2, 4, 5]));
        const c = Q.of(rng.nonZero(-9, 9));
        const shift = rng.pick([-1, 0, 1]);
        const e = rng.int(3, Math.max(5, maxIndex(Number(r.n), 1500) - 1));
        const k = e - shift;
        const v = c.mul(r.pow(e));
        const expr = times(c, `${base(r)}^{${exponent(shift)}}`);
        const work = steps(
          ...[`${expr} = ${v.toLatex()}`, `${base(r)}^{${exponent(shift)}} = ${v.div(c).toLatex()} = ${base(r)}^{${e}}`].filter(
            (line, i, all) => line !== all[i - 1],
          ),
          ...[`${exponent(shift)} = ${e}`, `n = ${k}`].filter((line, i, all) => line !== all[i - 1]),
        );
        const at = t(
          shift === 0 ? `At $n = ${k}$ the exponent is $${e}$` : `At $n = ${k}$ the exponent is $${k}${plus(shift)} = ${e}$`,
          shift === 0 ? `当 $n = ${k}$ 时指数为 $${e}$` : `当 $n = ${k}$ 时指数为 $${k}${plus(shift)} = ${e}$`,
        );
        return numberProblem({
          prompt: t(
            `In the sequence $a_n = ${expr}$, which term equals $${v.toLatex()}$?`,
            `在数列 $a_n = ${expr}$ 中，第几项等于 $${v.toLatex()}$？`,
          ),
          answer: k,
          solveFor: "n",
          wrong: [e, k + 1, k - 1],
          solution: t(
            `**Step 1: set up and match the powers.** Set the formula equal to $${v.toLatex()}$, divide by the coefficient, and write the result as a power of $${r.toLatex()}$; then solve the exponent exactly as written:${work}**Check.** ${at.en}, and $${times(c, `${base(r)}^{${e}}`)} = ${v.toLatex()}$.`,
            `**第一步：列方程并对应乘方。** 令公式等于 $${v.toLatex()}$，两边除以系数，把结果写成 $${r.toLatex()}$ 的乘方；再按原样解指数：${work}**检验。** ${at["zh-CN"]}，且 $${times(c, `${base(r)}^{${e}}`)} = ${v.toLatex()}$。`,
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
