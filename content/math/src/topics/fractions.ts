import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, lcm, num, Q, q } from "@ga/subject-math";

import { mixedLatex, numberProblem, steps } from "../problems.ts";

/** properFraction draws a fraction in lowest terms between 0 and 1 with a denominator in [2, maxDen]. */
function properFraction(rng: Rng, maxDen = 12): Q {
  for (;;) {
    const d = rng.int(2, maxDen);
    const n = rng.int(1, d - 1);
    if (gcd(n, d) === 1) return q(n, d);
  }
}

/** fracOf writes n/d unreduced: "\frac{6}{8}". */
const fracOf = (n: number | bigint, d: number | bigint) => `\\frac{${n}}{${d}}`;

/** signedFrac writes n/d unreduced with the sign in front: "-\frac{3}{6}". */
const signedFrac = (n: bigint, d: number) => (n < 0n ? `-${fracOf(-n, d)}` : fracOf(n, d));

/** parenFrac writes a number, in tall parentheses when negative, for use after an operator. */
const parenFrac = (v: Q) => (v.sign() < 0 ? `\\left(${num(v)}\\right)` : num(v));

/** improper writes a mixed number's value as an improper fraction: "\frac{7}{3}". */
const improper = (v: Q) => fracOf(v.n, v.d);

export const equivalentFractions: TopicDef = {
  id: "equivalent-fractions",
  title: t("Equivalent Fractions", "等值分数"),
  summary: t(
    "Simplify fractions to lowest terms and find missing terms of equivalent fractions.",
    "把分数化成最简分数，求等值分数中缺少的项。",
  ),
  prerequisites: ["greatest-common-factor"],
  encompasses: [{ topic: "greatest-common-factor", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.4.NF.A.1"],
  knowledgePoints: [
    {
      id: "missing-terms",
      title: t("Finding equivalent fractions", "求等值分数"),
      explanation: t(
        "Multiplying the numerator and the denominator of a fraction by the same nonzero number gives an **equivalent fraction**: one with the same value.\n\n$$\\frac{3}{4} = \\frac{3 \\cdot 5}{4 \\cdot 5} = \\frac{15}{20}$$\n\nTo find a missing term, ask what the known denominator (or numerator) was multiplied by, then multiply the other term by the same number.",
        "分数的分子和分母同时乘同一个不为零的数，得到**等值分数**：值相同的分数。\n\n$$\\frac{3}{4} = \\frac{3 \\cdot 5}{4 \\cdot 5} = \\frac{15}{20}$$\n\n求缺少的项时，先看已知的分母（或分子）乘了几，再把另一项乘同一个数。",
      ),
      generate(rng) {
        const f = properFraction(rng);
        const k = rng.int(2, 9);
        const n = Number(f.n);
        const d = Number(f.d);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `Find the missing numerator: $$${num(f)} = \\frac{?}{${d * k}}$$`,
              `求缺少的分子：$$${num(f)} = \\frac{?}{${d * k}}$$`,
            ),
            answer: n * k,
            form: "integer",
            wrong: [n + (d * k - d), n * d],
            solution: t(
              `$${d} \\cdot ${k} = ${d * k}$, so multiply the numerator by $${k}$ too: $${n} \\cdot ${k} = ${n * k}$.`,
              `$${d} \\cdot ${k} = ${d * k}$，所以分子也乘 $${k}$：$${n} \\cdot ${k} = ${n * k}$。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `Find the missing denominator: $$${num(f)} = \\frac{${n * k}}{?}$$`,
            `求缺少的分母：$$${num(f)} = \\frac{${n * k}}{?}$$`,
          ),
          answer: d * k,
          form: "integer",
          wrong: [d + (n * k - n), d * n],
          solution: t(
            `$${n} \\cdot ${k} = ${n * k}$, so multiply the denominator by $${k}$ too: $${d} \\cdot ${k} = ${d * k}$.`,
            `$${n} \\cdot ${k} = ${n * k}$，所以分母也乘 $${k}$：$${d} \\cdot ${k} = ${d * k}$。`,
          ),
        });
      },
    },
    {
      id: "simplifying-fractions",
      title: t("Simplifying fractions", "约分"),
      explanation: t(
        "A fraction is in **lowest terms** when its numerator and denominator have no common factor other than $1$. To simplify a fraction, divide both by their greatest common factor:\n\n$$\\frac{18}{24} = \\frac{18 \\div 6}{24 \\div 6} = \\frac{3}{4}$$\n\nDividing by a smaller common factor also works, but then you must repeat until no common factor is left.",
        "分子和分母除 $1$ 以外没有公因数的分数是**最简分数**。约分时，把分子和分母同时除以它们的最大公因数：\n\n$$\\frac{18}{24} = \\frac{18 \\div 6}{24 \\div 6} = \\frac{3}{4}$$\n\n也可以先除以较小的公因数，但要重复进行，直到没有公因数为止。",
      ),
      generate(rng) {
        const f = properFraction(rng);
        const k = rng.pick([2, 3, 4, 5, 6, 8, 9, 10, 12]);
        const n = Number(f.n) * k;
        const d = Number(f.d) * k;
        const halfway = k % 2 === 0 && k > 2 ? fracOf(n / 2, d / 2) : undefined;
        return numberProblem({
          prompt: t(`Simplify $${fracOf(n, d)}$ to lowest terms.`, `把 $${fracOf(n, d)}$ 化成最简分数。`),
          answer: f,
          form: "fraction",
          wrong: [q(n - 1, d - 1)],
          solution: t(
            `The greatest common factor of $${n}$ and $${d}$ is $${k}$:${steps(`${fracOf(n, d)} = \\frac{${n} \\div ${k}}{${d} \\div ${k}} = ${num(f)}`)}${halfway ? `Dividing by $2$ first gives $${halfway}$, which still has a common factor.` : ""}`,
            `$${n}$ 和 $${d}$ 的最大公因数是 $${k}$：${steps(`${fracOf(n, d)} = \\frac{${n} \\div ${k}}{${d} \\div ${k}} = ${num(f)}`)}${halfway ? `如果只除以 $2$，得到的 $${halfway}$ 还有公因数。` : ""}`,
          ),
        });
      },
    },
  ],
};

export const addingAndSubtractingFractions: TopicDef = {
  id: "adding-and-subtracting-fractions",
  title: t("Adding and Subtracting Fractions", "分数加减法"),
  summary: t("Add and subtract fractions with like and unlike denominators.", "同分母与异分母分数的加减。"),
  prerequisites: ["equivalent-fractions", "least-common-multiple"],
  encompasses: [
    { topic: "equivalent-fractions", weight: 0.5 },
    { topic: "least-common-multiple", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.5.NF.A.1"],
  knowledgePoints: [
    {
      id: "like-denominators",
      title: t("Like denominators", "同分母"),
      explanation: t(
        "Fractions with the same denominator count pieces of the same size, so add or subtract the numerators and keep the denominator:\n\n$$\\frac{5}{9} + \\frac{1}{9} = \\frac{6}{9} = \\frac{2}{3}$$\n\nAlways simplify the result. Never add the denominators: $\\frac{5}{9} + \\frac{1}{9}$ is not $\\frac{6}{18}$.",
        "同分母的分数表示同样大小的份数，所以分子相加减，分母不变：\n\n$$\\frac{5}{9} + \\frac{1}{9} = \\frac{6}{9} = \\frac{2}{3}$$\n\n结果要约分。分母不能相加：$\\frac{5}{9} + \\frac{1}{9}$ 不等于 $\\frac{6}{18}$。",
      ),
      generate(rng) {
        const d = rng.int(3, 15);
        const a = rng.int(1, d - 1);
        const add = rng.bool();
        const b = add ? rng.int(1, d - 1) : rng.int(1, a);
        if (!add && a === b) return this.generate(rng);
        const result = add ? q(a + b, d) : q(a - b, d);
        const raw = add ? a + b : a - b;
        const op = add ? "+" : "-";
        return numberProblem({
          prompt: t(`Evaluate $${fracOf(a, d)} ${op} ${fracOf(b, d)}$.`, `计算 $${fracOf(a, d)} ${op} ${fracOf(b, d)}$。`),
          answer: result,
          form: "fraction",
          wrong: [q(raw, 2 * d)],
          solution: t(
            `The denominators are equal, so ${add ? "add" : "subtract"} the numerators:${steps(`${fracOf(a, d)} ${op} ${fracOf(b, d)} = ${fracOf(raw, d)}${result.d === BigInt(d) ? "" : ` = ${num(result)}`}`)}`,
            `分母相同，分子相${add ? "加" : "减"}：${steps(`${fracOf(a, d)} ${op} ${fracOf(b, d)} = ${fracOf(raw, d)}${result.d === BigInt(d) ? "" : ` = ${num(result)}`}`)}`,
          ),
        });
      },
    },
    {
      id: "unlike-denominators",
      title: t("Unlike denominators", "异分母"),
      explanation: t(
        "To add or subtract fractions with different denominators, first rewrite them as equivalent fractions with a **common denominator**. The least common multiple of the denominators keeps the numbers smallest.\n\nFor $\\frac{3}{4} - \\frac{1}{6}$: the LCM of $4$ and $6$ is $12$, so\n\n$$\\frac{3}{4} - \\frac{1}{6} = \\frac{9}{12} - \\frac{2}{12} = \\frac{7}{12}$$",
        "异分母分数相加减，先把它们通分成**公分母**相同的等值分数。用分母的最小公倍数作公分母，数最小。\n\n例如 $\\frac{3}{4} - \\frac{1}{6}$：$4$ 和 $6$ 的最小公倍数是 $12$，所以\n\n$$\\frac{3}{4} - \\frac{1}{6} = \\frac{9}{12} - \\frac{2}{12} = \\frac{7}{12}$$",
      ),
      generate(rng) {
        let x = properFraction(rng, 10);
        let y = properFraction(rng, 10);
        while (x.d === y.d) y = properFraction(rng, 10);
        const add = rng.bool();
        if (!add && x.cmp(y) < 0) [x, y] = [y, x];
        const op = add ? "+" : "-";
        const L = lcm(Number(x.d), Number(y.d));
        const xn = (Number(x.n) * L) / Number(x.d);
        const yn = (Number(y.n) * L) / Number(y.d);
        const raw = add ? xn + yn : xn - yn;
        const result = add ? x.add(y) : x.sub(y);
        return numberProblem({
          prompt: t(`Evaluate $${num(x)} ${op} ${num(y)}$.`, `计算 $${num(x)} ${op} ${num(y)}$。`),
          answer: result,
          form: "fraction",
          wrong: [q(add ? Number(x.n) + Number(y.n) : Number(x.n) - Number(y.n), Number(x.d) + Number(y.d))],
          solution: t(
            `The least common multiple of $${x.d}$ and $${y.d}$ is $${L}$:${steps(`${num(x)} ${op} ${num(y)} = ${fracOf(xn, L)} ${op} ${fracOf(yn, L)} = ${fracOf(raw, L)}${result.d === BigInt(L) ? "" : ` = ${num(result)}`}`)}`,
            `$${x.d}$ 和 $${y.d}$ 的最小公倍数是 $${L}$：${steps(`${num(x)} ${op} ${num(y)} = ${fracOf(xn, L)} ${op} ${fracOf(yn, L)} = ${fracOf(raw, L)}${result.d === BigInt(L) ? "" : ` = ${num(result)}`}`)}`,
          ),
        });
      },
    },
  ],
};

export const mixedNumbers: TopicDef = {
  id: "mixed-numbers",
  title: t("Mixed Numbers", "带分数"),
  summary: t(
    "Convert between mixed numbers and improper fractions, and add and subtract mixed numbers.",
    "带分数与假分数互化，带分数的加减。",
  ),
  prerequisites: ["adding-and-subtracting-fractions"],
  encompasses: [{ topic: "adding-and-subtracting-fractions", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.4.NF.B.3.C", "CCSS.5.NF.A.1"],
  knowledgePoints: [
    {
      id: "improper-to-mixed",
      title: t("Improper fractions as mixed numbers", "假分数化带分数"),
      explanation: t(
        "A fraction whose numerator is at least its denominator is **improper**. It can be written as a **mixed number**: a whole number and a proper fraction. Divide the numerator by the denominator; the quotient is the whole number and the remainder is the new numerator.\n\n$$\\frac{17}{5}: \\quad 17 \\div 5 = 3 \\text{ remainder } 2, \\quad \\text{so } \\frac{17}{5} = 3\\frac{2}{5}$$\n\nIn the other direction, $3\\frac{2}{5} = \\frac{3 \\cdot 5 + 2}{5} = \\frac{17}{5}$.",
        "分子大于或等于分母的分数是**假分数**，可以写成**带分数**：一个整数加一个真分数。用分子除以分母，商是整数部分，余数是新的分子。\n\n$$\\frac{17}{5}: \\quad 17 \\div 5 = 3 \\text{ 余 } 2, \\quad \\text{所以 } \\frac{17}{5} = 3\\frac{2}{5}$$\n\n反过来，$3\\frac{2}{5} = \\frac{3 \\cdot 5 + 2}{5} = \\frac{17}{5}$。",
      ),
      generate(rng) {
        const f = properFraction(rng);
        const w = rng.int(1, 9);
        const v = f.add(Q.of(w));
        const d = Number(f.d);
        const r = Number(f.n);
        return numberProblem({
          prompt: t(`Write $${improper(v)}$ as a mixed number.`, `把 $${improper(v)}$ 写成带分数。`),
          answer: v,
          form: "mixed",
          // Swapping the quotient and the remainder.
          wrong: r < d && w < d ? [Q.of(r).add(q(w, d))] : [],
          solution: t(
            `$${v.n} \\div ${d} = ${w}$ remainder $${r}$, so $${improper(v)} = ${mixedLatex(v)}$.`,
            `$${v.n} \\div ${d} = ${w}$ 余 $${r}$，所以 $${improper(v)} = ${mixedLatex(v)}$。`,
          ),
        });
      },
    },
    {
      id: "adding-and-subtracting-mixed-numbers",
      title: t("Adding and subtracting mixed numbers", "带分数的加减"),
      explanation: t(
        "One reliable method: write each mixed number as an improper fraction, add or subtract, then write the result as a mixed number.\n\n$$2\\frac{1}{3} + 1\\frac{3}{4} = \\frac{7}{3} + \\frac{7}{4} = \\frac{28}{12} + \\frac{21}{12} = \\frac{49}{12} = 4\\frac{1}{12}$$",
        "一种可靠的方法：把带分数都化成假分数，计算加减，再把结果写成带分数。\n\n$$2\\frac{1}{3} + 1\\frac{3}{4} = \\frac{7}{3} + \\frac{7}{4} = \\frac{28}{12} + \\frac{21}{12} = \\frac{49}{12} = 4\\frac{1}{12}$$",
      ),
      generate(rng) {
        let x = properFraction(rng, 8).add(Q.of(rng.int(1, 6)));
        let y = properFraction(rng, 8).add(Q.of(rng.int(1, 6)));
        const add = rng.bool();
        if (!add && x.cmp(y) <= 0) [x, y] = [y, x];
        if (x.eq(y)) return this.generate(rng);
        const op = add ? "+" : "-";
        const result = add ? x.add(y) : x.sub(y);
        // A common mistake: combining the whole numbers and the fractions separately without regrouping.
        const wholes = (v: Q) => Q.of(v.n / v.d);
        const naive = add ? wholes(x).add(wholes(y)) : wholes(x).sub(wholes(y));
        return numberProblem({
          prompt: t(`Evaluate $${mixedLatex(x)} ${op} ${mixedLatex(y)}$.`, `计算 $${mixedLatex(x)} ${op} ${mixedLatex(y)}$。`),
          answer: result,
          form: "fraction",
          wrong: [naive],
          solution: t(
            `Write both as improper fractions:${steps(`${mixedLatex(x)} ${op} ${mixedLatex(y)} = ${improper(x)} ${op} ${improper(y)} = ${num(result)}${result.isInteger() || result.cmp(Q.one) < 0 ? "" : ` = ${mixedLatex(result)}`}`)}`,
            `先化成假分数：${steps(`${mixedLatex(x)} ${op} ${mixedLatex(y)} = ${improper(x)} ${op} ${improper(y)} = ${num(result)}${result.isInteger() || result.cmp(Q.one) < 0 ? "" : ` = ${mixedLatex(result)}`}`)}`,
          ),
        });
      },
    },
  ],
};

export const multiplyingFractions: TopicDef = {
  id: "multiplying-fractions",
  title: t("Multiplying Fractions", "分数乘法"),
  summary: t("Multiply fractions and find a fraction of a whole number.", "分数相乘，求一个整数的几分之几。"),
  prerequisites: ["equivalent-fractions"],
  encompasses: [{ topic: "equivalent-fractions", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.5.NF.B.4", "CCSS.5.NF.B.6"],
  knowledgePoints: [
    {
      id: "fraction-times-fraction",
      title: t("Fraction times fraction", "分数乘分数"),
      explanation: t(
        "To multiply fractions, multiply the numerators and multiply the denominators:\n\n$$\\frac{2}{3} \\cdot \\frac{9}{10} = \\frac{2 \\cdot 9}{3 \\cdot 10} = \\frac{18}{30} = \\frac{3}{5}$$\n\nYou can simplify before multiplying by cancelling a factor shared by any numerator and any denominator: $\\frac{2}{3} \\cdot \\frac{9}{10} = \\frac{1}{1} \\cdot \\frac{3}{5}$ after cancelling $2$ and $3$.",
        "分数相乘，分子乘分子，分母乘分母：\n\n$$\\frac{2}{3} \\cdot \\frac{9}{10} = \\frac{2 \\cdot 9}{3 \\cdot 10} = \\frac{18}{30} = \\frac{3}{5}$$\n\n也可以先约分再乘：任一分子与任一分母的公因数都可以约去。$\\frac{2}{3} \\cdot \\frac{9}{10}$ 约去 $2$ 和 $3$ 后得 $\\frac{1}{1} \\cdot \\frac{3}{5}$。",
      ),
      generate(rng) {
        const x = properFraction(rng);
        const y = properFraction(rng);
        const p = x.mul(y);
        const rawN = x.n * y.n;
        const rawD = x.d * y.d;
        return numberProblem({
          prompt: t(`Evaluate $${num(x)} \\cdot ${num(y)}$.`, `计算 $${num(x)} \\cdot ${num(y)}$。`),
          answer: p,
          form: "fraction",
          wrong: [x.add(y), Q.of(x.n * y.d, x.d * y.n)],
          solution: t(
            `Multiply the numerators and the denominators:${steps(`${num(x)} \\cdot ${num(y)} = ${fracOf(rawN, rawD)}${p.d === rawD ? "" : ` = ${num(p)}`}`)}`,
            `分子乘分子，分母乘分母：${steps(`${num(x)} \\cdot ${num(y)} = ${fracOf(rawN, rawD)}${p.d === rawD ? "" : ` = ${num(p)}`}`)}`,
          ),
        });
      },
    },
    {
      id: "fraction-of-a-whole-number",
      title: t("A fraction of a whole number", "求整数的几分之几"),
      explanation: t(
        '"$\\frac{3}{4}$ of $20$" means $\\frac{3}{4} \\cdot 20$. Divide by the denominator to find one part, then multiply by the numerator:\n\n$$\\frac{3}{4} \\cdot 20 = \\frac{3 \\cdot 20}{4} = 3 \\cdot 5 = 15$$',
        "“$20$ 的 $\\frac{3}{4}$”就是 $\\frac{3}{4} \\cdot 20$。先除以分母求出一份，再乘分子：\n\n$$\\frac{3}{4} \\cdot 20 = \\frac{3 \\cdot 20}{4} = 3 \\cdot 5 = 15$$",
      ),
      generate(rng) {
        const f = properFraction(rng);
        const w = Number(f.d) * rng.int(2, 15);
        const part = w / Number(f.d);
        const answer = part * Number(f.n);
        return numberProblem({
          prompt: t(`What is $${num(f)}$ of $${w}$?`, `$${w}$ 的 $${num(f)}$ 是多少？`),
          answer,
          wrong: [part, w * Number(f.n)],
          solution: t(
            `${steps(`${num(f)} \\cdot ${w} = ${f.n} \\cdot (${w} \\div ${f.d}) = ${f.n} \\cdot ${part} = ${answer}`)}`,
            `${steps(`${num(f)} \\cdot ${w} = ${f.n} \\cdot (${w} \\div ${f.d}) = ${f.n} \\cdot ${part} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

export const dividingFractions: TopicDef = {
  id: "dividing-fractions",
  title: t("Dividing Fractions", "分数除法"),
  summary: t("Find reciprocals and divide by a fraction by multiplying by its reciprocal.", "求倒数，除以一个分数等于乘它的倒数。"),
  prerequisites: ["multiplying-fractions"],
  encompasses: [{ topic: "multiplying-fractions", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.6.NS.A.1"],
  knowledgePoints: [
    {
      id: "reciprocals",
      title: t("Reciprocals", "倒数"),
      explanation: t(
        "Two numbers are **reciprocals** when their product is $1$. The reciprocal of $\\frac{a}{b}$ is $\\frac{b}{a}$: flip the fraction. The reciprocal of a whole number $n$ is $\\frac{1}{n}$, and the reciprocal of $\\frac{1}{n}$ is $n$. The number $0$ has no reciprocal.",
        "乘积为 $1$ 的两个数互为**倒数**。$\\frac{a}{b}$ 的倒数是 $\\frac{b}{a}$：把分数倒过来。整数 $n$ 的倒数是 $\\frac{1}{n}$，$\\frac{1}{n}$ 的倒数是 $n$。$0$ 没有倒数。",
      ),
      generate(rng) {
        const v = rng.bool(0.3)
          ? Q.of(rng.int(2, 20))
          : rng.bool(0.5)
            ? properFraction(rng, 15)
            : properFraction(rng, 9).add(Q.of(rng.int(1, 4)));
        const r = Q.one.div(v);
        const shown = v.isInteger() ? num(v) : v.cmp(Q.one) > 0 && rng.bool() ? mixedLatex(v) : improper(v);
        return numberProblem({
          prompt: t(`Find the reciprocal of $${shown}$.`, `求 $${shown}$ 的倒数。`),
          answer: r,
          form: "fraction",
          wrong: [v.neg()],
          solution: t(
            `${shown === improper(v) ? "" : `Write it as a fraction: $${shown} = ${improper(v)}$. `}Flip it: the reciprocal is $${num(r)}$, because $${improper(v)} \\cdot ${num(r)} = 1$.`,
            `${shown === improper(v) ? "" : `先写成分数：$${shown} = ${improper(v)}$。`}把它倒过来，倒数是 $${num(r)}$，因为 $${improper(v)} \\cdot ${num(r)} = 1$。`,
          ),
        });
      },
    },
    {
      id: "dividing-by-a-fraction",
      title: t("Dividing by a fraction", "除以分数"),
      explanation: t(
        "Dividing by a number is the same as multiplying by its reciprocal:\n\n$$\\frac{3}{4} \\div \\frac{2}{5} = \\frac{3}{4} \\cdot \\frac{5}{2} = \\frac{15}{8}$$\n\nThis works because $\\frac{15}{8} \\cdot \\frac{2}{5} = \\frac{3}{4}$: the quotient times the divisor gives back the dividend. Only the divisor (the second number) is flipped.",
        "除以一个数等于乘它的倒数：\n\n$$\\frac{3}{4} \\div \\frac{2}{5} = \\frac{3}{4} \\cdot \\frac{5}{2} = \\frac{15}{8}$$\n\n这是因为 $\\frac{15}{8} \\cdot \\frac{2}{5} = \\frac{3}{4}$：商乘除数等于被除数。只把除数（第二个数）倒过来。",
      ),
      generate(rng) {
        const x = rng.bool(0.2) ? Q.of(rng.int(2, 9)) : properFraction(rng, 10);
        const y = properFraction(rng, 10);
        if (x.eq(y)) return this.generate(rng);
        const result = x.div(y);
        return numberProblem({
          prompt: t(`Evaluate $${num(x)} \\div ${num(y)}$.`, `计算 $${num(x)} \\div ${num(y)}$。`),
          answer: result,
          form: "fraction",
          wrong: [x.mul(y), y.div(x)],
          solution: t(
            `Multiply by the reciprocal of $${num(y)}$:${steps(`${num(x)} \\div ${num(y)} = ${num(x)} \\cdot ${improper(Q.one.div(y))} = ${num(result)}`)}`,
            `乘 $${num(y)}$ 的倒数：${steps(`${num(x)} \\div ${num(y)} = ${num(x)} \\cdot ${improper(Q.one.div(y))} = ${num(result)}`)}`,
          ),
        });
      },
    },
  ],
};

export const operationsWithRationalNumbers: TopicDef = {
  id: "operations-with-rational-numbers",
  title: t("Operations With Negative Fractions", "负分数的运算"),
  summary: t("Add, subtract, multiply and divide fractions with signs.", "带符号分数的加、减、乘、除。"),
  prerequisites: ["adding-and-subtracting-fractions", "dividing-fractions", "subtracting-integers", "dividing-integers"],
  encompasses: [
    { topic: "adding-and-subtracting-fractions", weight: 0.5 },
    { topic: "dividing-fractions", weight: 0.4 },
    { topic: "subtracting-integers", weight: 0.3 },
    { topic: "dividing-integers", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.7.NS.A.1", "CCSS.7.NS.A.2"],
  knowledgePoints: [
    {
      id: "adding-and-subtracting-signed-fractions",
      title: t("Adding and subtracting", "加法与减法"),
      explanation: t(
        "The sign rules for integers hold for all fractions. Subtracting a number is adding its opposite, and with a common denominator the numerators follow the integer rules:\n\n$$-\\frac{1}{2} - \\frac{1}{3} = -\\frac{3}{6} + \\left(-\\frac{2}{6}\\right) = -\\frac{5}{6}$$\n\nA negative fraction can carry its sign in front, in the numerator or in the denominator: $-\\frac{5}{6} = \\frac{-5}{6} = \\frac{5}{-6}$.",
        "整数的符号法则对所有分数都成立。减去一个数等于加上它的相反数；通分后，分子按整数的法则计算：\n\n$$-\\frac{1}{2} - \\frac{1}{3} = -\\frac{3}{6} + \\left(-\\frac{2}{6}\\right) = -\\frac{5}{6}$$\n\n负分数的负号可以写在前面、分子上或分母上：$-\\frac{5}{6} = \\frac{-5}{6} = \\frac{5}{-6}$。",
      ),
      keyPrerequisites: ["adding-and-subtracting-fractions", "subtracting-integers"],
      generate(rng) {
        const x = properFraction(rng, 9).mul(Q.of(rng.sign()));
        const y = properFraction(rng, 9).mul(Q.of(rng.sign()));
        const add = rng.bool();
        const op = add ? "+" : "-";
        const result = add ? x.add(y) : x.sub(y);
        if (result.isZero()) return this.generate(rng);
        const L = lcm(Number(x.d), Number(y.d));
        const xs = Q.of(x.n * BigInt(L / Number(x.d)));
        const ys = Q.of(y.n * BigInt(L / Number(y.d)));
        const raw = add ? xs.add(ys) : xs.sub(ys);
        const yl = signedFrac(ys.n, L);
        const rawLatex = signedFrac(raw.n, L);
        const line = `${num(x)} ${op} ${parenFrac(y)} = ${signedFrac(xs.n, L)} ${op} ${ys.n < 0n ? `\\left(${yl}\\right)` : yl} = ${rawLatex}${rawLatex === num(result) ? "" : ` = ${num(result)}`}`;
        return numberProblem({
          prompt: t(`Evaluate $${num(x)} ${op} ${parenFrac(y)}$.`, `计算 $${num(x)} ${op} ${parenFrac(y)}$。`),
          answer: result,
          form: "fraction",
          wrong: [result.neg(), add ? x.sub(y) : x.add(y)],
          solution: t(`Use the common denominator $${L}$:${steps(line)}`, `通分，公分母为 $${L}$：${steps(line)}`),
        });
      },
    },
    {
      id: "multiplying-and-dividing-signed-fractions",
      title: t("Multiplying and dividing", "乘法与除法"),
      explanation: t(
        "Multiply or divide the absolute values as usual, then choose the sign as for integers: the result is positive when the signs are the same and negative when they differ.\n\n$$-\\frac{2}{3} \\div \\left(-\\frac{4}{9}\\right) = \\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{3}{2}$$",
        "先按通常的方法计算绝对值的积或商，再像整数那样确定符号：同号得正，异号得负。\n\n$$-\\frac{2}{3} \\div \\left(-\\frac{4}{9}\\right) = \\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{3}{2}$$",
      ),
      keyPrerequisites: ["dividing-fractions", "dividing-integers"],
      generate(rng) {
        const sx = rng.sign();
        const sy = sx > 0 ? -1 : rng.sign();
        const x = properFraction(rng, 10).mul(Q.of(sx));
        const y = properFraction(rng, 10).mul(Q.of(sy));
        const mul = rng.bool();
        const result = mul ? x.mul(y) : x.div(y);
        const op = mul ? "\\cdot" : "\\div";
        const same = sx === sy;
        return numberProblem({
          prompt: t(`Evaluate $${num(x)} ${op} ${parenFrac(y)}$.`, `计算 $${num(x)} ${op} ${parenFrac(y)}$。`),
          answer: result,
          form: "fraction",
          wrong: [result.neg(), mul ? x.div(y) : x.mul(y)],
          solution: t(
            `The signs are ${same ? "the same, so the result is positive" : "different, so the result is negative"}.${steps(`${num(x.abs())} ${op} ${num(y.abs())} = ${num(result.abs())}`)}So $${num(x)} ${op} ${parenFrac(y)} = ${num(result)}$.`,
            `两数${same ? "同号，结果为正" : "异号，结果为负"}。${steps(`${num(x.abs())} ${op} ${num(y.abs())} = ${num(result.abs())}`)}所以 $${num(x)} ${op} ${parenFrac(y)} = ${num(result)}$。`,
          ),
        });
      },
    },
  ],
};

/** fractionTopics are the topics on fractions and mixed numbers, including negative fractions. */
export const fractionTopics: readonly TopicDef[] = [
  equivalentFractions,
  addingAndSubtractingFractions,
  mixedNumbers,
  multiplyingFractions,
  dividingFractions,
  operationsWithRationalNumbers,
];
