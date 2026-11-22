import type { Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { gcd, lcm, linear, num, paren, poly, Q } from "@ga/subject-math";

import { choiceProblem, expressionProblem, numberProblem, solutionsProblem, steps } from "../problems.ts";

/** frac writes a fraction of two LaTeX expressions. */
const frac = (top: string, bottom: string) => `\\frac{${top}}{${bottom}}`;

/** pw writes a power of a variable: "", "x" or "x^{3}". */
const pw = (v: string, e: number) => (e <= 0 ? "" : e === 1 ? v : `${v}^{${e}}`);

/** grp puts a sum in parentheses, for use as a factor: "(x + 3)"; monomials and groups are left alone. */
const grp = (s: string) => (s.includes(" ") && !s.startsWith("(") ? `(${s})` : s);

/** product writes an integer times factors: "3(x + 1)", "-x^{2}(x - 2)", "x + 1"; empty factors are skipped. */
function product(c: number, factors: readonly string[]): string {
  const fs = factors.filter((f) => f !== "");
  if (fs.length === 0) return String(c);
  if (c === 1 && fs.length === 1) return fs[0]!;
  return `${c === 1 ? "" : c === -1 ? "-" : c}${fs.map(grp).join("")}`;
}

/** ratio writes (nc · nf) / (dc · df) in lowest terms, with the numbers reduced and the sign in front: "-\frac{2}{3(x + 1)}". */
function ratio(nc: number, nf: readonly string[], dc: number, df: readonly string[]): string {
  const g = gcd(nc, dc);
  let a = nc / g;
  let b = dc / g;
  if (b < 0) {
    a = -a;
    b = -b;
  }
  const bottom = df.filter((f) => f !== "");
  if (b === 1 && bottom.length === 0) return product(a, nf);
  return `${a < 0 ? "-" : ""}${frac(product(Math.abs(a), nf), product(b, bottom))}`;
}

/** bin writes the binomial x + b, or x when b is 0. */
const bin = (b: number) => linear(1, b);

/** cdot writes a product of two factors, with a negative second factor in parentheses. */
const cdot = (a: string, b: string) => `${a} \\cdot ${b.startsWith("-") ? `(${b})` : b}`;

/** listSolutions tells the learner how to enter a solution set. */
const listSolutions = t(
  "Enter all solutions separated by commas, or type none if there is none.",
  "请用逗号分隔写出所有解；如果无解，请输入 none。",
);

/** solve asks to solve an equation and to enter its solution set. */
const solve = (eq: string): Text => t(`Solve $${eq}$. ${listSolutions.en}`, `解方程 $${eq}$。${listSolutions["zh-CN"]}`);

/** simplifyPrompt asks to simplify an expression, stating the values of x it assumes excluded. */
function simplifyPrompt(expr: string, excluded: readonly string[]): Text {
  if (excluded.length === 0) return t(`Simplify $${expr}$.`, `化简 $${expr}$。`);
  const conds = excluded.map((v) => `$x \\neq ${v}$`);
  return t(`Simplify $${expr}$, where ${conds.join(" and ")}.`, `化简 $${expr}$（${conds.join("，")}）。`);
}

/** keptNote says that a candidate solution is not excluded. */
const keptNote = (root: string): Text =>
  t(`$x = ${root}$ does not make a denominator zero, so it is the solution.`, `$x = ${root}$ 不使分母为零，所以它就是方程的解。`);

/** excludedNote says that the only candidate solution is excluded. */
const excludedNote = (root: string): Text =>
  t(
    `But $x = ${root}$ makes a denominator zero, so it is not a solution: the equation has no solution, $\\varnothing$.`,
    `但 $x = ${root}$ 使分母为零，不是方程的解，所以方程无解：$\\varnothing$。`,
  );

/** solvingLinear writes the last steps of a linear equation kx = c: "kx = c", "x = c/k". */
function solvingLinear(k: number, c: Q): string[] {
  const x = c.div(Q.of(k));
  return k === 1 ? [`x = ${num(c)}`] : [`${linear(k, 0)} = ${num(c)}`, `x = ${num(x)}`];
}

/** opTerm writes "op value" with a negative value in parentheses: "+ \frac{1}{2}", "- (-3)". */
const opTerm = (op: string, v: string) => `${op} ${v.startsWith("-") ? `(${v})` : v}`;

export const equivalentExpressionsWithFractions: TopicDef = {
  id: "equivalent-expressions-with-fractions",
  title: t("Equivalent Expressions With Fractions", "含分数的等价代数式"),
  summary: t(
    "Rewrite algebraic expressions with fractions: fractional coefficients, splitting a fraction into terms, signs in fractions, and combining fractions into one.",
    "改写含分数的代数式：分数系数、把一个分式拆成几项、分式中的符号，以及把几个分式合并成一个。",
  ),
  prerequisites: ["distributive-law-for-polynomials", "operations-with-rational-numbers"],
  encompasses: [
    { topic: "operations-with-rational-numbers", weight: 0.3 },
    { topic: "adding-and-subtracting-fractions", weight: 0.3 },
    { topic: "distributive-law-for-polynomials", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.SSE.A.2"],
  intro: t(
    `We know how to compute with fractions of numbers and how the distributive law multiplies out a sum. Algebra mixes the two: an expression such as $\\frac{x + 1}{2}$ is a fraction whose numerator contains a variable. Equations and formulas are full of them, and they become easier to work with once we can rewrite them in other, equivalent forms.

The key fact is that dividing by $2$ is the same as multiplying by $\\frac{1}{2}$. So the distributive law applies:

$$\\frac{x + 1}{2} = \\frac{1}{2}(x + 1) = \\frac{1}{2}x + \\frac{1}{2}.$$

Both forms give the same value for every $x$; at $x = 3$, for instance, $\\frac{3 + 1}{2} = 2$ and $\\frac{3}{2} + \\frac{1}{2} = 2$.

In this lesson we read fractional coefficients, split a fraction into one term per part of its numerator, move minus signs around a fraction correctly, and combine several fractions into one, the way we add fractions of numbers.`,
    `我们已经会做数的分数运算，也会用分配律把和乘开。代数把两者结合起来：像 $\\frac{x + 1}{2}$ 这样的代数式，是分子含有变量的分式。方程和公式里到处都是这样的式子；只要会把它们改写成其他等价的形式，处理起来就容易多了。

关键的事实是：除以 $2$ 等于乘以 $\\frac{1}{2}$。所以可以用分配律：

$$\\frac{x + 1}{2} = \\frac{1}{2}(x + 1) = \\frac{1}{2}x + \\frac{1}{2}.$$

对每个 $x$，两种形式的值都相同；例如 $x = 3$ 时，$\\frac{3 + 1}{2} = 2$，$\\frac{3}{2} + \\frac{1}{2} = 2$。

这节课我们学习读出分数系数，把分式按分子的各项拆开，正确地处理分式周围的负号，以及像数的分数相加那样把几个分式合并成一个。`,
  ),
  knowledgePoints: [
    {
      id: "fractional-coefficients",
      title: t("Fractional coefficients", "分数系数"),
      explanation: t(
        `Dividing by a number is multiplying by its reciprocal: $\\frac{3x}{5}$ means $3x \\div 5$, which is $3x \\cdot \\frac{1}{5}$. Multiplication can be done in any order, so the number parts combine into one fraction that multiplies the variable:

$$\\frac{3x}{5} = 3 \\cdot \\frac{1}{5} \\cdot x = \\frac{3}{5}x.$$

The coefficient of $x$ is $\\frac{3}{5}$. A lone variable has numerator $1$, so $\\frac{x}{4} = \\frac{1}{4}x$, and the coefficient is always written in lowest terms: $-\\frac{6y}{8} = -\\frac{3}{4}y$.

> **Watch out.** The coefficient is the numerator **over** the denominator. It is not just the numerator ($3$), not the fraction turned upside down ($\\frac{5}{3}$), and not the product $3 \\cdot 5$. Keep the sign in front of the fraction, and do not drop the numerator: $\\frac{3x}{5}$ is not $\\frac{1}{5}x$.`,
        `除以一个数等于乘以它的倒数：$\\frac{3x}{5}$ 表示 $3x \\div 5$，也就是 $3x \\cdot \\frac{1}{5}$。乘法可以交换次序，所以数的部分合成一个分数，乘以变量：

$$\\frac{3x}{5} = 3 \\cdot \\frac{1}{5} \\cdot x = \\frac{3}{5}x.$$

$x$ 的系数是 $\\frac{3}{5}$。单独一个变量的分子是 $1$，所以 $\\frac{x}{4} = \\frac{1}{4}x$；系数总要写成最简分数：$-\\frac{6y}{8} = -\\frac{3}{4}y$。

> **注意。** 系数是分子**除以**分母。它不只是分子（$3$），不是倒过来的分数（$\\frac{5}{3}$），也不是乘积 $3 \\cdot 5$。分式前面的符号要保留，分子也不能丢：$\\frac{3x}{5}$ 不是 $\\frac{1}{5}x$。`,
      ),
      keyPrerequisites: ["multiplying-fractions"],
      generate(rng) {
        const v = rng.pick(["x", "y", "n", "t"]);
        let a = rng.int(1, 12);
        let b = rng.int(2, 12);
        while (a === b) {
          a = rng.int(1, 12);
          b = rng.int(2, 12);
        }
        const s = rng.bool(0.3) ? -1 : 1;
        const expr = `${s < 0 ? "-" : ""}${frac(a === 1 ? v : `${a}${v}`, String(b))}`;
        const k = Q.of(s * a, b);
        const reduced = gcd(a, b) !== 1;
        const work = steps(`${expr} = ${s < 0 ? "-" : ""}\\frac{${a}}{${b}} \\cdot ${v} = ${poly([k, v])}`);
        return numberProblem({
          prompt: t(`The expression $${expr}$ can be written as $k${v}$. Find $k$.`, `代数式 $${expr}$ 可以写成 $k${v}$ 的形式。求 $k$。`),
          answer: k,
          solveFor: "k",
          wrong: [s * a, Q.of(s * b, a), Q.of(s, b), s * a * b, -s * a],
          solution: t(
            `Dividing by $${b}$ is multiplying by $\\frac{1}{${b}}$, so the number parts form the fraction $${s < 0 ? "-" : ""}\\frac{${a}}{${b}}$${reduced ? `, which reduces to $${num(k)}$` : ""}:${work}So $k = ${num(k)}$.

**Check.** Multiplying the coefficient back by $${b}$ must give the coefficient of the numerator: $${cdot(String(b), num(k))} = ${s * a}$.`,
            `除以 $${b}$ 等于乘以 $\\frac{1}{${b}}$，所以数的部分组成分数 $${s < 0 ? "-" : ""}\\frac{${a}}{${b}}$${reduced ? `，约分后是 $${num(k)}$` : ""}：${work}所以 $k = ${num(k)}$。

**检验。** 把系数再乘以 $${b}$，应当得到分子的系数：$${cdot(String(b), num(k))} = ${s * a}$。`,
          ),
        });
      },
    },
    {
      id: "splitting-a-fraction",
      title: t("Splitting a fraction into terms", "把分式拆成几项"),
      explanation: t(
        `Dividing by $8$ is multiplying by $\\frac{1}{8}$, and by the distributive law a product with a sum multiplies **every** term of the sum. So a fraction whose numerator is a sum splits into one fraction per term:

$$\\frac{6x - 4}{8} = \\frac{1}{8}(6x - 4) = \\frac{6x}{8} - \\frac{4}{8} = \\frac{3}{4}x - \\frac{1}{2}.$$

Each piece is then reduced on its own. The sign between the terms stays where it was: the $-4$ becomes $-\\frac{1}{2}$.

> **Watch out.** Divide **both** terms by the denominator. Dividing only the $x$ term gives $\\frac{3}{4}x - 4$, and dividing only the number gives $6x - \\frac{1}{2}$. Dividing is not multiplying, so $48x - 32$ is wrong too, and the fractions must not be turned upside down.`,
        `除以 $8$ 等于乘以 $\\frac{1}{8}$，而由分配律，一个数乘以和时要乘以和的**每一项**。所以分子是和的分式，可以拆成每一项各自一个分式：

$$\\frac{6x - 4}{8} = \\frac{1}{8}(6x - 4) = \\frac{6x}{8} - \\frac{4}{8} = \\frac{3}{4}x - \\frac{1}{2}.$$

然后每一项分别约分。两项之间的符号不变：$-4$ 变成 $-\\frac{1}{2}$。

> **注意。** **两项**都要除以分母。只除 $x$ 项会得到 $\\frac{3}{4}x - 4$，只除常数项会得到 $6x - \\frac{1}{2}$。除法不是乘法，所以 $48x - 32$ 也不对；分数也不能倒过来。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.nonZero(-15, 15);
        const c = rng.int(2, 9);
        const top = rng.bool(0.3) ? poly([b, ""], [a, "x"]) : linear(a, b);
        const expr = frac(top, String(c));
        const p = Q.of(a, c);
        const q = Q.of(b, c);
        const answer = poly([p, "x"], [q, ""]);
        const split = `${frac(poly([a, "x"]), String(c))} ${b < 0 ? "-" : "+"} ${frac(String(Math.abs(b)), String(c))}`;
        return expressionProblem({
          prompt: t(
            `Write $${expr}$ in the form $px + q$, with each coefficient in lowest terms.`,
            `把 $${expr}$ 写成 $px + q$ 的形式，每个系数都化成最简。`,
          ),
          answer,
          simplified: true,
          wrong: [
            poly([p, "x"], [b, ""]),
            poly([a, "x"], [q, ""]),
            poly([a * c, "x"], [b * c, ""]),
            poly([Q.of(c, a), "x"], [Q.of(c, b), ""]),
          ],
          solution: t(
            `Dividing by $${c}$ divides every term of the numerator, so split the fraction into one fraction per term, then reduce each:${steps(`${expr} = ${split} = ${answer}`)}**Check.** Multiplying the answer by $${c}$ must give back the numerator: $${c}\\left(${answer}\\right) = ${linear(a, b)}$.`,
            `除以 $${c}$ 要除分子的每一项，所以把分式按项拆开，再分别约分：${steps(`${expr} = ${split} = ${answer}`)}**检验。** 把答案乘以 $${c}$，应当得回分子：$${c}\\left(${answer}\\right) = ${linear(a, b)}$。`,
          ),
        });
      },
    },
    {
      id: "signs-in-fractions",
      title: t("Signs in fractions", "分式中的符号"),
      explanation: t(
        `A fraction has three signs: of the numerator, of the denominator, and in front of the fraction. Each one, changed, multiplies the value by $-1$. Changing **two** of them multiplies by $(-1)(-1) = 1$ and leaves the value unchanged; changing only **one** gives the opposite:

$$-\\frac{a}{b} = \\frac{-a}{b} = \\frac{a}{-b} \\qquad \\frac{-a}{-b} = \\frac{a}{b}$$

When the numerator is a difference, changing its sign means taking the opposite of the **whole** numerator, which swaps its terms: $-(x - 3) = -x + 3 = 3 - x$. So

$$-\\frac{x - 3}{5} = \\frac{3 - x}{5}.$$

> **Watch out.** The opposite of $x - 3$ is $3 - x$, not $-x - 3$: the minus sign applies to **both** terms. And changing just one of the three signs, as in $\\frac{x - 3}{-5}$ for $\\frac{x - 3}{5}$, gives the opposite value, not the same one.`,
        `分式有三个符号：分子的符号、分母的符号和分式前面的符号。改变其中一个，值就乘以 $-1$。同时改变**两个**，值乘以 $(-1)(-1) = 1$，不变；只改变**一个**，得到相反数：

$$-\\frac{a}{b} = \\frac{-a}{b} = \\frac{a}{-b} \\qquad \\frac{-a}{-b} = \\frac{a}{b}$$

当分子是差时，改变分子的符号就是取**整个**分子的相反数，结果是两项交换：$-(x - 3) = -x + 3 = 3 - x$。所以

$$-\\frac{x - 3}{5} = \\frac{3 - x}{5}.$$

> **注意。** $x - 3$ 的相反数是 $3 - x$，不是 $-x - 3$：负号要作用在**两项**上。只改变三个符号中的一个，例如把 $\\frac{x - 3}{5}$ 写成 $\\frac{x - 3}{-5}$，得到的是相反数，而不是原来的值。`,
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3]);
        const k = rng.int(1, 9);
        const d = rng.int(2, 9);
        const pos = linear(a, -k);
        const opp = poly([k, ""], [-a, "x"]);
        const bad = poly([-a, "x"], [-k, ""]);
        const plus = linear(a, k);
        const forms: readonly (readonly [string, number])[] = [
          [frac(pos, String(d)), 1],
          [frac(opp, String(d)), -1],
          [frac(pos, String(-d)), -1],
          [frac(opp, String(-d)), 1],
          [`-${frac(pos, String(d))}`, -1],
          [`-${frac(opp, String(d))}`, 1],
          [frac(bad, String(d)), 0],
          [frac(plus, String(-d)), 0],
          [frac(plus, String(d)), 0],
        ];
        const signed = forms.filter(([, s]) => s !== 0);
        const given = rng.pick(signed);
        const right = rng.pick(signed.filter((f) => f[1] === given[1] && f !== given));
        const others = rng.sample(
          forms.filter((f) => f[1] !== given[1]),
          3,
        );
        const options = rng.shuffle([right, ...others]);
        const at0 = num(Q.of(given[1] * -k, d));
        return choiceProblem({
          prompt: t(`Which expression is equivalent to $${given[0]}$?`, `哪个代数式与 $${given[0]}$ 等价？`),
          options: options.map(([f]) => same(`$${f}$`)),
          correct: options.indexOf(right),
          solution: t(
            `Changing two of the three signs of a fraction (of the numerator, of the denominator, in front) keeps its value, while changing only one gives the opposite. Changing the sign of the numerator means taking the opposite of the whole numerator, and $-(${pos}) = ${opp}$.

Comparing the options this way, the one with the same value is $${right[0]}$. So $${given[0]} = ${right[0]}$.

**Check.** At $x = 0$ both expressions equal $${at0}$.`,
            `同时改变分式三个符号（分子的、分母的、分式前面的）中的两个，值不变；只改变一个，得到相反数。改变分子的符号就是取整个分子的相反数，而 $-(${pos}) = ${opp}$。

这样逐个比较选项，值相同的是 $${right[0]}$。所以 $${given[0]} = ${right[0]}$。

**检验。** $x = 0$ 时两个代数式都等于 $${at0}$。`,
          ),
        });
      },
    },
    {
      id: "combining-fractions",
      title: t("Combining fractions into one", "合并成一个分式"),
      explanation: t(
        `Algebraic fractions with number denominators add and subtract like fractions of numbers: rewrite them over a common denominator, then combine the numerators. Multiplying a fraction's top and bottom by the same number keeps its value, but the **whole** numerator must be multiplied, so it goes in parentheses:

$$\\frac{x + 1}{2} - \\frac{x - 3}{6} = \\frac{3(x + 1)}{6} - \\frac{x - 3}{6} = \\frac{3x + 3 - (x - 3)}{6}.$$

The minus sign in front of the second fraction applies to its whole numerator: $-(x - 3) = -x + 3$. So the numerator is $3x + 3 - x + 3 = 2x + 6$, and

$$\\frac{2x + 6}{6} = \\frac{2(x + 3)}{6} = \\frac{x + 3}{3}.$$

Finish by cancelling any factor common to the **whole** numerator and the denominator.

> **Watch out.** Never add the denominators: $\\frac{x}{2} + \\frac{x}{3}$ is not $\\frac{2x}{5}$. Scale each numerator to the common denominator before adding, and when subtracting, change the sign of **every** term of the second numerator. Last, reduce: $\\frac{2x + 6}{6}$ is not yet in lowest terms.`,
        `分母是数的代数分式与数的分数一样加减：先化成同分母，再合并分子。分子分母同乘一个数，分式的值不变，但必须乘**整个**分子，所以要加括号：

$$\\frac{x + 1}{2} - \\frac{x - 3}{6} = \\frac{3(x + 1)}{6} - \\frac{x - 3}{6} = \\frac{3x + 3 - (x - 3)}{6}.$$

第二个分式前面的减号作用在它的整个分子上：$-(x - 3) = -x + 3$。所以分子是 $3x + 3 - x + 3 = 2x + 6$，于是

$$\\frac{2x + 6}{6} = \\frac{2(x + 3)}{6} = \\frac{x + 3}{3}.$$

最后约去**整个**分子与分母的公因数。

> **注意。** 分母不能相加：$\\frac{x}{2} + \\frac{x}{3}$ 不是 $\\frac{2x}{5}$。相加之前要把每个分子都乘到公分母；做减法时，第二个分子的**每一项**都要变号。最后要约分：$\\frac{2x + 6}{6}$ 还不是最简分式。`,
      ),
      keyPrerequisites: ["adding-and-subtracting-fractions"],
      generate(rng) {
        for (;;) {
          const [a, b] = rng.sample([2, 3, 4, 5, 6, 8, 10], 2) as [number, number];
          const p = rng.nonZero(-5, 5);
          const q = rng.int(1, 5);
          const r = rng.bool(0.4) ? 0 : rng.nonZero(-9, 9);
          const s = rng.bool(0.4) ? 0 : rng.nonZero(-9, 9);
          const minus = rng.bool();
          const sg = minus ? -1 : 1;
          const op = minus ? "-" : "+";
          const l = lcm(a, b);
          const cx = p * (l / a) + sg * q * (l / b);
          const c0 = r * (l / a) + sg * s * (l / b);
          if (cx === 0) continue;
          const over = (x: number, c: number, d: number) => {
            const g = gcd(gcd(x, c), d);
            if (d / g === 1) return linear(x / g, c / g);
            return c === 0 && x < 0 ? `-${frac(linear(-x / g, 0), String(d / g))}` : frac(linear(x / g, c / g), String(d / g));
          };
          const left = frac(linear(p, r), String(a));
          const right = frac(linear(q, s), String(b));
          const expr = `${left} ${op} ${right}`;
          const answer = over(cx, c0, l);
          const raw = frac(linear(cx, c0), String(l));
          const [la, lb] = [l / a, l / b];
          const n1 = linear(p * la, r * la);
          const n2 = linear(q * lb, s * lb);
          const scale = (c: number, f: string) => (c === 1 ? f : f.includes(" ") ? `${c}(${f})` : cdot(String(c), f));
          const scaled = `${frac(scale(la, linear(p, r)), String(l))} ${op} ${frac(scale(lb, linear(q, s)), String(l))}`;
          const g = gcd(gcd(cx, c0), l);
          const step1 = steps(`${expr} = ${scaled}`);
          const step2 = steps(
            `${frac(minus && n2.includes(" ") ? `${n1} - (${n2})` : minus ? `${n1} - ${n2}` : `${n1} + ${n2}`, String(l))} = ${raw}`,
          );
          const step3 =
            raw === answer
              ? null
              : g === 1
                ? t(
                    `**Step 3: tidy up.** Put the minus sign in front of the fraction:${steps(`${raw} = ${answer}`)}`,
                    `**第三步：整理。** 把负号写到分式前面：${steps(`${raw} = ${answer}`)}`,
                  )
                : t(
                    `**Step 3: lowest terms.** The numerator and the denominator have the common factor $${g}$; cancel it:${steps(`${raw} = ${answer}`)}`,
                    `**第三步：约分。** 分子和分母有公因数 $${g}$，把它约去：${steps(`${raw} = ${answer}`)}`,
                  );
          const x0 = cx + c0 === 0 ? 2 : 1;
          const v1 = Q.of(p * x0 + r, a);
          const v2 = Q.of(q * x0 + s, b);
          const at1 = num(Q.of(cx * x0 + c0, l));
          const check1 = `${num(v1)} ${opTerm(op, num(v2))} = ${at1}`;
          return expressionProblem({
            prompt: t(`Write $${expr}$ as a single fraction in lowest terms.`, `把 $${expr}$ 写成一个最简分式。`),
            answer,
            lowest: true,
            wrong: [over(p + sg * q, r + sg * s, a + b), over(p + sg * q, r + sg * s, l), over(cx, r * (l / a) + s * (l / b), l), raw],
            solution: t(
              `**Step 1: a common denominator.** The least common multiple of $${a}$ and $${b}$ is $${l}$. Multiply the top and bottom of each fraction so that its denominator becomes $${l}$:${step1}**Step 2: combine the numerators.** ${minus ? "The minus sign applies to the whole second numerator:" : "Add the numerators over the common denominator:"}${step2}${step3 ? step3.en : ""}**Check.** At $x = ${x0}$ the answer is $${at1}$, and the original expression gives the same value: $${check1}$.`,
              `**第一步：通分。** $${a}$ 和 $${b}$ 的最小公倍数是 $${l}$。把每个分式的分子分母同乘一个数，使分母变成 $${l}$：${step1}**第二步：合并分子。** ${minus ? "减号作用在整个第二个分子上：" : "在公分母上把分子相加："}${step2}${step3 ? step3["zh-CN"] : ""}**检验。** $x = ${x0}$ 时答案等于 $${at1}$，原式也得到同一个值：$${check1}$。`,
            ),
          });
        }
      },
    },
  ],
};

/** at writes a linear expression mx + n with a value put in for x: "2(-3) + 6", "(5) - 5". */
function at(m: number, n: number, v: string): string {
  const front = m === 1 ? "" : m === -1 ? "-" : String(m);
  return n === 0 ? `${front}(${v})` : `${front}(${v}) ${n < 0 ? "-" : "+"} ${Math.abs(n)}`;
}

/** times writes a product of integers, with negative factors after the first in parentheses and factors of 1 left out. */
function times(...ns: readonly number[]): string {
  const kept = ns.filter((n) => n !== 1);
  if (kept.length === 0) return "1";
  return kept.map((n, i) => (i > 0 && n < 0 ? `(${n})` : String(n))).join(" \\cdot ");
}

/** powerWords says what cancelling does to the powers of one variable, or nothing when the variable is absent. */
function powerWords(v: string, top: number, bottom: number): Text | null {
  if (top === 0 && bottom === 0) return null;
  if (top === bottom) return t(`$${pw(v, top)}$ cancels completely.`, `$${pw(v, top)}$ 完全约去。`);
  if (top === 0 || bottom === 0) {
    const e = Math.max(top, bottom);
    return top > 0
      ? t(`$${v}$ appears only in the numerator, so $${pw(v, e)}$ stays there.`, `$${v}$ 只出现在分子中，所以 $${pw(v, e)}$ 留在分子。`)
      : t(`$${v}$ appears only in the denominator, so $${pw(v, e)}$ stays there.`, `$${v}$ 只出现在分母中，所以 $${pw(v, e)}$ 留在分母。`);
  }
  const k = Math.min(top, bottom);
  const left = pw(v, Math.abs(top - bottom));
  return top > bottom
    ? t(
        `The smaller power $${pw(v, k)}$ cancels, leaving $${left}$ in the numerator.`,
        `约去较小的幂 $${pw(v, k)}$，分子中剩下 $${left}$。`,
      )
    : t(
        `The smaller power $${pw(v, k)}$ cancels, leaving $${left}$ in the denominator.`,
        `约去较小的幂 $${pw(v, k)}$，分母中剩下 $${left}$。`,
      );
}

export const simplifyingRationalExpressions: TopicDef = {
  id: "simplifying-rational-expressions",
  title: t("Simplifying Rational Expressions", "化简分式"),
  summary: t(
    "Find the values excluded from a rational expression, and simplify rational expressions by cancelling common monomial and binomial factors.",
    "求分式中要排除的值，并通过约去公共的单项式因式和二项式因式化简分式。",
  ),
  prerequisites: ["equivalent-expressions-with-fractions", "greatest-common-factor-of-monomials", "zero-product-rule"],
  encompasses: [{ topic: "equivalent-fractions", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSA.APR.D.6"],
  intro: t(
    `A fraction of numbers is simplified by cancelling a factor that its numerator and denominator share: $\\frac{6}{8} = \\frac{2 \\cdot 3}{2 \\cdot 4} = \\frac{3}{4}$. Dividing top and bottom by the same nonzero number does not change the value. A **rational expression** is a fraction whose numerator and denominator are polynomials, and it is simplified the same way, with the greatest common factor of monomials playing the part of the common factor:

$$\\frac{6x^{3}}{8x} = \\frac{2x \\cdot 3x^{2}}{2x \\cdot 4} = \\frac{3x^{2}}{4}.$$

There is one new thing to watch. A fraction is meaningless when its denominator is $0$, and with a variable that can happen: $\\frac{6x^{3}}{8x}$ has no value at $x = 0$, although $\\frac{3x^{2}}{4}$ does. So the two expressions are equal only for $x \\neq 0$, and we always keep track of the values a rational expression excludes. The zero product rule finds them.

In this lesson we find excluded values, then simplify monomials over monomials in one and two variables, and finally cancel a common binomial factor.`,
    `数的分数化简，是约去分子和分母共有的因数：$\\frac{6}{8} = \\frac{2 \\cdot 3}{2 \\cdot 4} = \\frac{3}{4}$。分子分母同除以一个不为零的数，值不变。**分式**是分子和分母都是多项式的分数，化简的方法相同，只是公因数换成了单项式的最大公因式：

$$\\frac{6x^{3}}{8x} = \\frac{2x \\cdot 3x^{2}}{2x \\cdot 4} = \\frac{3x^{2}}{4}.$$

有一件新的事情要注意。分母为 $0$ 时分数没有意义，而有了变量，这种情况就可能出现：$\\frac{6x^{3}}{8x}$ 在 $x = 0$ 时没有值，而 $\\frac{3x^{2}}{4}$ 却有。所以这两个式子只在 $x \\neq 0$ 时相等，我们要始终记住分式排除了哪些值。零乘积法则可以求出它们。

这节课我们先求要排除的值，再化简一个变量和两个变量的单项式之比，最后约去公共的二项式因式。`,
  ),
  knowledgePoints: [
    {
      id: "excluded-values",
      title: t("Excluded values", "要排除的值"),
      explanation: t(
        `A **rational expression** is a fraction of polynomials, such as $\\frac{x + 2}{x - 5}$. Division by zero is not defined, so the values of the variable that make the **denominator** zero are excluded. Here $x - 5 = 0$ when $x = 5$, so $x \\neq 5$. The numerator does not matter: at $x = -2$ the expression is just $\\frac{0}{-7} = 0$.

To find the excluded values, set the denominator equal to zero and solve. A product is zero when one of its factors is, so each factor gives its own value:

$$\\frac{3}{x(x + 4)}: \\quad x = 0 \\text{ or } x + 4 = 0, \\text{ so } x \\neq 0 \\text{ and } x \\neq -4$$

Since $x^{2} \\ge 0$, a denominator such as $x^{2} + 9$ is at least $9$ and never zero, and no value is excluded.

> **Watch out.** Solve the denominator, not the numerator: a zero numerator is allowed. Solve it fully: $x + 4 = 0$ gives $x = -4$, not $4$, and $2x - 6 = 0$ gives $x = 3$, not $6$. A factor $x$ on its own excludes $0$; do not forget it.`,
        `**分式**是两个多项式之比，例如 $\\frac{x + 2}{x - 5}$。除以零没有意义，所以使**分母**为零的变量值要排除。这里 $x = 5$ 时 $x - 5 = 0$，所以 $x \\neq 5$。分子不影响这一点：$x = -2$ 时分式的值就是 $\\frac{0}{-7} = 0$。

求要排除的值，就令分母等于零并解方程。积为零当且仅当某个因式为零，所以每个因式各给出一个值：

$$\\frac{3}{x(x + 4)}: \\quad x = 0 \\text{ 或 } x + 4 = 0, \\text{ 所以 } x \\neq 0 \\text{ 且 } x \\neq -4$$

因为 $x^{2} \\ge 0$，像 $x^{2} + 9$ 这样的分母至少是 $9$，永远不为零，没有要排除的值。

> **注意。** 要解的是分母，不是分子：分子为零是允许的。方程要解完整：由 $x + 4 = 0$ 得 $x = -4$，不是 $4$；由 $2x - 6 = 0$ 得 $x = 3$，不是 $6$。单独的因式 $x$ 排除 $0$，不要漏掉。`,
      ),
      keyPrerequisites: ["zero-product-rule"],
      generate(rng) {
        const kind = rng.pick(["one", "two", "two", "linear", "linear", "monomial", "none"] as const);
        const a = rng.nonZero(-9, 9);
        const top = rng.bool(0.3) ? String(rng.nonZero(-9, 9)) : bin(a);
        const topRoot = top.includes("x") ? [[num(-a)]] : [];
        const prompt = (e: string) =>
          t(
            `Find all values of $x$ for which $${e}$ is not defined. Enter them separated by commas, or type none if there is none.`,
            `求使 $${e}$ 没有意义的所有 $x$ 值。请用逗号分隔；如果没有，请输入 none。`,
          );
        const zero = (d: string, work: readonly string[], vs: readonly string[], check: Text) =>
          t(
            `The expression is not defined where its denominator is zero, so set the denominator equal to $0$ and solve:${steps(`${d} = 0`, ...work)}${vs.length === 1 ? `So $x = ${vs[0]}$ is excluded.` : `So $x = ${vs.join("$ and $x = ")}$ are excluded.`}

**Check.** ${check.en}`,
            `分母为零时分式没有意义，所以令分母等于 $0$ 并解方程：${steps(`${d} = 0`, ...work)}所以要排除 $x = ${vs.join("$ 和 $x = ")}$。

**检验。** ${check["zh-CN"]}`,
          );
        const putting = (v: string, work: string) =>
          t(`Putting $x = ${v}$ into the denominator gives zero: $${work}$.`, `把 $x = ${v}$ 代入分母，结果为零：$${work}$。`);
        if (kind === "one") {
          const b = rng.nonZero(-12, 12);
          const d = bin(-b);
          return solutionsProblem({
            prompt: prompt(frac(top, d)),
            values: [num(b)],
            wrong: [[num(-b)], ...topRoot],
            solution: zero(d, [`x = ${b}`], [num(b)], putting(num(b), `${at(1, -b, num(b))} = 0`)),
          });
        }
        if (kind === "two") {
          let b = rng.nonZero(-9, 9);
          let c = rng.nonZero(-9, 9);
          while (b === c) {
            b = rng.nonZero(-9, 9);
            c = rng.nonZero(-9, 9);
          }
          const d = `(${bin(-b)})(${bin(-c)})`;
          return solutionsProblem({
            prompt: prompt(frac(top, d)),
            values: [num(b), num(c)],
            wrong: [[num(-b), num(-c)], [num(b)], ...topRoot, ...topRoot.map((w) => [num(b), num(c), ...w])],
            solution: zero(
              d,
              [`${bin(-b)} = 0 \\text{ or } ${bin(-c)} = 0`, `x = ${b} \\text{ or } x = ${c}`],
              [num(b), num(c)],
              t(
                `$${at(1, -b, num(b))} = 0$ and $${at(1, -c, num(c))} = 0$, so each value makes one factor of the denominator zero.`,
                `$${at(1, -b, num(b))} = 0$，$${at(1, -c, num(c))} = 0$，每个值都使分母的一个因式为零。`,
              ),
            ),
          });
        }
        if (kind === "linear") {
          const m = rng.int(2, 6);
          const n = rng.nonZero(-12, 12);
          const d = linear(m, n);
          const v = Q.of(-n, m);
          return solutionsProblem({
            prompt: prompt(frac(top, d)),
            values: [num(v)],
            wrong: [[num(v.neg())], [num(-n)], [num(Q.of(m, -n))], ...topRoot],
            solution: zero(
              d,
              [`${linear(m, 0)} = ${-n}`, `x = ${num(v)}`],
              [num(v)],
              putting(num(v), `${at(m, n, num(v))} = ${-n} ${n < 0 ? "-" : "+"} ${Math.abs(n)} = 0`),
            ),
          });
        }
        if (kind === "monomial") {
          const m = rng.int(1, 6);
          const b = rng.nonZero(-9, 9);
          const d = `${m === 1 ? "" : m}x(${bin(-b)})`;
          return solutionsProblem({
            prompt: prompt(frac(top, d)),
            values: ["0", num(b)],
            wrong: [[num(b)], ["0", num(-b)], ...(m > 1 ? [[num(m), num(b)]] : [])],
            solution: zero(
              d,
              [`${m === 1 ? "" : `${m}`}x = 0 \\text{ or } ${bin(-b)} = 0`, `x = 0 \\text{ or } x = ${b}`],
              ["0", num(b)],
              t(
                `At $x = 0$ the factor $${m === 1 ? "" : m}x$ is $0$, and at $x = ${b}$ the factor $${bin(-b)}$ is $${at(1, -b, num(b))} = 0$.`,
                `$x = 0$ 时因式 $${m === 1 ? "" : m}x$ 为 $0$；$x = ${b}$ 时因式 $${bin(-b)}$ 为 $${at(1, -b, num(b))} = 0$。`,
              ),
            ),
          });
        }
        const c = rng.int(1, 25);
        const d = `x^{2} + ${c}`;
        return solutionsProblem({
          prompt: prompt(frac(top, d)),
          values: [],
          wrong: [[num(-c)], ["0"], ...topRoot],
          solution: t(
            `A square is never negative, so $x^{2} \\ge 0$ and the denominator is at least $${c}$:${steps(`${d} \\ge 0 + ${c} = ${c}`)}It is never zero, so no value is excluded: $\\varnothing$.

**Check.** The smallest value of $${d}$ is at $x = 0$, where it is $${c}$, not $0$. Setting it to $0$ would need $x^{2} = ${-c}$, which no real number satisfies.`,
            `平方永远不是负数，所以 $x^{2} \\ge 0$，分母至少是 $${c}$：${steps(`${d} \\ge 0 + ${c} = ${c}`)}它永远不为零，所以没有要排除的值：$\\varnothing$。

**检验。** $${d}$ 的最小值在 $x = 0$ 处取得，是 $${c}$，不是 $0$。要使它为 $0$，需要 $x^{2} = ${-c}$，没有实数满足。`,
          ),
        });
      },
    },
    {
      id: "monomials-in-one-variable",
      title: t("Monomial over monomial", "单项式除以单项式"),
      explanation: t(
        `A rational expression is in **lowest terms** when its numerator and denominator have no common factor. To simplify, write both as the greatest common factor times what is left, then cancel the common factor, as with fractions of numbers. For $\\frac{12x^{5}}{8x^{2}}$ the coefficients share $4$, and the powers share the smaller power $x^{2}$:

$$\\frac{12x^{5}}{8x^{2}} = \\frac{4x^{2} \\cdot 3x^{3}}{4x^{2} \\cdot 2} = \\frac{3x^{3}}{2}.$$

What is left of the higher power is $x^{5 - 2} = x^{3}$, and it stays on its own side of the fraction bar. When the higher power is in the denominator, the leftover power goes in the denominator:

$$\\frac{6x^{2}}{9x^{5}} = \\frac{3x^{2} \\cdot 2}{3x^{2} \\cdot 3x^{3}} = \\frac{2}{3x^{3}}.$$

The simplified expression equals the original only where the original is defined, here for $x \\neq 0$.

> **Watch out.** Subtract the exponents, do not add them, and keep the leftover power on the side that had the **higher** power: $\\frac{6x^{2}}{9x^{5}}$ is $\\frac{2}{3x^{3}}$, not $\\frac{2x^{3}}{3}$. Do not turn the fraction upside down, and reduce the coefficients too: $\\frac{6}{9}$ becomes $\\frac{2}{3}$.`,
        `当分子和分母没有公因式时，分式是**最简分式**。化简时，把分子和分母都写成最大公因式乘以剩下的部分，再约去公因式，与数的分数一样。对 $\\frac{12x^{5}}{8x^{2}}$，系数的公因数是 $4$，幂的公因式是较小的幂 $x^{2}$：

$$\\frac{12x^{5}}{8x^{2}} = \\frac{4x^{2} \\cdot 3x^{3}}{4x^{2} \\cdot 2} = \\frac{3x^{3}}{2}.$$

较高次幂剩下 $x^{5 - 2} = x^{3}$，留在它原来的那一边。较高次幂在分母中时，剩下的幂就留在分母：

$$\\frac{6x^{2}}{9x^{5}} = \\frac{3x^{2} \\cdot 2}{3x^{2} \\cdot 3x^{3}} = \\frac{2}{3x^{3}}.$$

化简后的式子只在原式有意义的地方与原式相等，这里是 $x \\neq 0$。

> **注意。** 指数要相减，不是相加；剩下的幂留在原来次数**较高**的那一边：$\\frac{6x^{2}}{9x^{5}}$ 是 $\\frac{2}{3x^{3}}$，不是 $\\frac{2x^{3}}{3}$。不要把分式倒过来，系数也要约分：$\\frac{6}{9}$ 化为 $\\frac{2}{3}$。`,
      ),
      keyPrerequisites: ["product-and-quotient-rules", "greatest-common-factor-of-monomials"],
      generate(rng) {
        let p = rng.int(1, 9);
        let r = rng.int(1, 9);
        while (gcd(p, r) !== 1 || p === r) {
          p = rng.int(1, 9);
          r = rng.int(1, 9);
        }
        const g = rng.int(2, 6);
        const m = rng.int(1, 8);
        const n = rng.int(1, 8);
        const neg = rng.bool(0.3);
        const negTop = rng.bool();
        const A = g * p * (neg && negTop ? -1 : 1);
        const B = g * r * (neg && !negTop ? -1 : 1);
        const expr = frac(poly([A, pw("x", m)]), poly([B, pw("x", n)]));
        const answer = ratio(A, [pw("x", m - n)], B, [pw("x", n - m)]);
        const k = Math.min(m, n);
        const common = poly([g, pw("x", k)]);
        const restTop = poly([A / g, pw("x", m - k)]);
        const restBottom = poly([B / g, pw("x", n - k)]);
        const two = (e: number) => (e === 1 ? "2" : `2^{${e}}`);
        const value = num(Q.of(A * 2 ** m, B * 2 ** n));
        const powers = powerWords("x", m, n)!;
        return expressionProblem({
          prompt: simplifyPrompt(expr, ["0"]),
          answer,
          lowest: true,
          wrong: [
            ratio(A, [pw("x", n - m)], B, [pw("x", m - n)]),
            ratio(A, [pw("x", m + n)], B, []),
            ratio(B, [pw("x", n - m)], A, [pw("x", m - n)]),
            `${A < 0 ? "-" : ""}${frac(poly([Math.abs(A), pw("x", m - n)]), poly([Math.abs(B), pw("x", n - m)]))}`,
          ],
          solution: t(
            `The coefficients $${A}$ and $${B}$ have the greatest common factor $${g}$. ${powers.en} So the greatest common factor of the numerator and the denominator is $${common}$. Write both as $${common}$ times what is left, and cancel it:${steps(`${expr} = ${frac(cdot(common, restTop), cdot(common, restBottom))} = ${answer}`)}**Check.** Put $x = 2$ into both. The answer gives $${value}$, and so does the original: $${frac(`${A} \\cdot ${two(m)}`, `${B} \\cdot ${two(n)}`)} = ${value}$.`,
            `系数 $${A}$ 和 $${B}$ 的最大公因数是 $${g}$。${powers["zh-CN"]}所以分子和分母的最大公因式是 $${common}$。把两者都写成 $${common}$ 乘以剩下的部分，再约去它：${steps(`${expr} = ${frac(cdot(common, restTop), cdot(common, restBottom))} = ${answer}`)}**检验。** 把 $x = 2$ 代入两边。答案得 $${value}$，原式也得同一个值：$${frac(`${A} \\cdot ${two(m)}`, `${B} \\cdot ${two(n)}`)} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "monomials-in-two-variables",
      title: t("Monomials in two variables", "含两个变量的单项式"),
      explanation: t(
        `With several variables, the greatest common factor takes the smaller power of **each** variable, so each variable is cancelled on its own. Its smaller power cancels, and the difference of the exponents stays on the side that had the higher power. The coefficients reduce like a fraction of numbers, and the sign follows the rules of division. For $\\frac{-10x^{2}y^{5}}{15x^{4}y^{2}}$:

- the coefficients give $\\frac{-10}{15} = -\\frac{2}{3}$;
- $x^{2}$ cancels from $x^{4}$, leaving $x^{2}$ in the denominator;
- $y^{2}$ cancels from $y^{5}$, leaving $y^{3}$ in the numerator.

$$\\frac{-10x^{2}y^{5}}{15x^{4}y^{2}} = \\frac{5x^{2}y^{2} \\cdot (-2y^{3})}{5x^{2}y^{2} \\cdot 3x^{2}} = -\\frac{2y^{3}}{3x^{2}}$$

> **Watch out.** Treat each variable separately: here $x$ ends up in the denominator but $y$ in the numerator, so do not put both on the same side. Subtract exponents rather than adding them, keep the minus sign, and do not turn the fraction upside down.`,
        `多个变量时，最大公因式取**每个**变量的较小次幂，所以每个变量分别约分：约去较小的幂，两个指数的差留在原来次数较高的那一边。系数像数的分数一样约分，符号按除法法则确定。对 $\\frac{-10x^{2}y^{5}}{15x^{4}y^{2}}$：

- 系数给出 $\\frac{-10}{15} = -\\frac{2}{3}$；
- 从 $x^{4}$ 中约去 $x^{2}$，分母剩下 $x^{2}$；
- 从 $y^{5}$ 中约去 $y^{2}$，分子剩下 $y^{3}$。

$$\\frac{-10x^{2}y^{5}}{15x^{4}y^{2}} = \\frac{5x^{2}y^{2} \\cdot (-2y^{3})}{5x^{2}y^{2} \\cdot 3x^{2}} = -\\frac{2y^{3}}{3x^{2}}$$

> **注意。** 每个变量分别处理：这里 $x$ 最后在分母中，$y$ 却在分子中，不要把它们放到同一边。指数要相减而不是相加，负号要保留，也不要把分式倒过来。`,
      ),
      generate(rng) {
        for (;;) {
          const p = rng.int(1, 9);
          const r = rng.int(1, 9);
          const g = rng.int(1, 6);
          const [i, k] = [rng.int(0, 6), rng.int(0, 6)];
          const [j, l] = [rng.int(0, 5), rng.int(0, 5)];
          if (gcd(p, r) !== 1 || i + j === 0 || k + l === 0 || (Math.min(i, k) === 0 && Math.min(j, l) === 0)) continue;
          if (i === k && j === l) continue;
          const neg = rng.bool(0.35);
          const negTop = rng.bool();
          const A = g * p * (neg && negTop ? -1 : 1);
          const B = g * r * (neg && !negTop ? -1 : 1);
          const vars = (ex: number, ey: number) => `${pw("x", ex)}${pw("y", ey)}`;
          const expr = frac(poly([A, vars(i, j)]), poly([B, vars(k, l)]));
          const answer = ratio(A, [vars(i - k, j - l)], B, [vars(k - i, l - j)]);
          const common = poly([g, vars(Math.min(i, k), Math.min(j, l))]);
          const restTop = poly([A / g, vars(i - Math.min(i, k), j - Math.min(j, l))]);
          const restBottom = poly([B / g, vars(k - Math.min(i, k), l - Math.min(j, l))]);
          const coef = Q.of(A, B);
          const coefWords =
            g === 1
              ? t(
                  `The coefficients $${A}$ and $${B}$ have no common factor, so they stay as they are.`,
                  `系数 $${A}$ 和 $${B}$ 没有公因数，保持不变。`,
                )
              : t(
                  `The coefficients reduce: $${frac(String(A), String(B))} = ${num(coef)}$.`,
                  `系数约分：$${frac(String(A), String(B))} = ${num(coef)}$。`,
                );
          const words = [coefWords, powerWords("x", i, k), powerWords("y", j, l)].filter((w): w is Text => w !== null);
          return expressionProblem({
            prompt: t(`Simplify $${expr}$, where $x \\neq 0$ and $y \\neq 0$.`, `化简 $${expr}$（$x \\neq 0$，$y \\neq 0$）。`),
            answer,
            lowest: true,
            wrong: [
              ratio(A, [vars(i - k, l - j)], B, [vars(k - i, j - l)]),
              ratio(A, [vars(i + k, j + l)], B, []),
              ratio(B, [vars(k - i, l - j)], A, [vars(i - k, j - l)]),
              ratio(-A, [vars(i - k, j - l)], B, [vars(k - i, l - j)]),
              `${A * B < 0 ? "-" : ""}${frac(poly([Math.abs(A), vars(i - k, j - l)]), poly([Math.abs(B), vars(k - i, l - j)]))}`,
            ],
            solution: t(
              `Cancel the coefficients and each variable on its own. ${words.map((w) => w.en).join(" ")} Together:${steps(`${expr} = ${answer}`)}**Check.** The common factor $${common}$ times what is left must give back the numerator and the denominator: $${cdot(common, restTop)} = ${poly([A, vars(i, j)])}$ and $${cdot(common, restBottom)} = ${poly([B, vars(k, l)])}$.`,
              `系数和每个变量分别约分。${words.map((w) => w["zh-CN"]).join("")}合起来：${steps(`${expr} = ${answer}`)}**检验。** 公因式 $${common}$ 乘以剩下的部分，应当得回分子和分母：$${cdot(common, restTop)} = ${poly([A, vars(i, j)])}$，$${cdot(common, restBottom)} = ${poly([B, vars(k, l)])}$。`,
            ),
          });
        }
      },
    },
    {
      id: "common-binomial-factors",
      title: t("Common binomial factors", "公共的二项式因式"),
      explanation: t(
        `A binomial such as $x + 3$ is a factor like any other: for every allowed $x$ it is a number, and when that number divides both the numerator and the denominator it cancels as a whole. The numbers in front reduce as usual:

$$\\frac{4(x + 3)}{6(x + 3)(x - 1)} = \\frac{2 \\cdot 2(x + 3)}{2 \\cdot 3(x + 3)(x - 1)} = \\frac{2}{3(x - 1)}.$$

Only **factors** cancel, never terms: in $\\frac{x + 3}{x}$ nothing cancels, because $x$ is a term of the numerator, not a factor of it. And a squared binomial is two factors, $(x + 3)^{2} = (x + 3)(x + 3)$, so only one of them cancels against a single $x + 3$.

The cancelled factor still excludes its value: the simplified expression equals the original only for $x \\neq -3$ (and $x \\neq 1$).

> **Watch out.** Cancel exactly the binomial both parts share, and copy the other one unchanged: $x - 1$ must not turn into $x + 1$. Do not turn the fraction upside down, reduce the numbers in front, and cancel only one copy of a squared factor.`,
        `像 $x + 3$ 这样的二项式和其他因式一样：对每个允许的 $x$，它都是一个数；当这个数同时整除分子和分母时，可以整体约去。前面的数照常约分：

$$\\frac{4(x + 3)}{6(x + 3)(x - 1)} = \\frac{2 \\cdot 2(x + 3)}{2 \\cdot 3(x + 3)(x - 1)} = \\frac{2}{3(x - 1)}.$$

只有**因式**能约去，项不能约：在 $\\frac{x + 3}{x}$ 中什么也不能约，因为 $x$ 是分子的一项，而不是它的因式。平方的二项式是两个因式，$(x + 3)^{2} = (x + 3)(x + 3)$，所以和一个 $x + 3$ 相约时只能约去其中一个。

被约去的因式仍然排除它对应的值：化简后的式子只在 $x \\neq -3$（以及 $x \\neq 1$）时与原式相等。

> **注意。** 只约去分子分母共有的那个二项式，另一个原样照抄：$x - 1$ 不能变成 $x + 1$。不要把分式倒过来，前面的数要约分，平方的因式只能约去一个。`,
      ),
      generate(rng) {
        for (;;) {
          const p = rng.nonZero(-9, 9);
          const q = rng.nonZero(-9, 9);
          const g = rng.int(1, 5);
          const a = rng.int(1, 7);
          const b = rng.int(1, 7);
          if (p === q || gcd(a, b) !== 1 || (g === 1 && a === 1 && b === 1)) continue;
          const A = g * a * (rng.bool(0.25) ? -1 : 1);
          const B = g * b;
          const [P, Pq, Qq] = [bin(p), bin(q), bin(-q)];
          const variant = rng.int(0, 2);
          const excluded = [num(-p), num(-q)];
          const [expr, answer, wrong] =
            variant === 0
              ? [
                  frac(product(A, [P]), product(B, [P, Pq])),
                  ratio(A, [], B, [Pq]),
                  [ratio(A, [], B, [Qq]), ratio(B, [Pq], A, []), `${A < 0 ? "-" : ""}${frac(String(Math.abs(A)), product(B, [Pq]))}`],
                ]
              : variant === 1
                ? [
                    frac(product(A, [P, Pq]), product(B, [P])),
                    ratio(A, [Pq], B, []),
                    [ratio(A, [Qq], B, []), ratio(B, [], A, [Pq]), `${A < 0 ? "-" : ""}${frac(product(Math.abs(A), [Pq]), String(B))}`],
                  ]
                : [
                    frac(product(A, [`(${P})^{2}`]), product(B, [P, Pq])),
                    ratio(A, [P], B, [Pq]),
                    [ratio(A, [], B, [Pq]), ratio(A, [`(${P})^{2}`], B, [Pq]), ratio(B, [Pq], A, [P])],
                  ];
          const [top0, bottom0, value] =
            variant === 0
              ? [times(A, p), times(B, p, q), Q.of(A, B * q)]
              : variant === 1
                ? [times(A, p, q), times(B, p), Q.of(A * q, B)]
                : [times(A, p, p), times(B, p, q), Q.of(A * p, B * q)];
          const binomial =
            variant === 2
              ? t(
                  `$(${P})^{2}$ is $(${P})(${P})$, so one factor $${P}$ cancels against the $${P}$ in the denominator and one stays in the numerator.`,
                  `$(${P})^{2}$ 就是 $(${P})(${P})$，所以一个因式 $${P}$ 与分母中的 $${P}$ 相约，另一个留在分子中。`,
                )
              : t(
                  `The factor $${P}$ appears in both the numerator and the denominator, so it cancels.`,
                  `因式 $${P}$ 同时出现在分子和分母中，所以可以约去。`,
                );
          const numbers =
            g === 1
              ? t(`The numbers $${A}$ and $${B}$ have no common factor.`, `数 $${A}$ 和 $${B}$ 没有公因数。`)
              : t(
                  `The numbers $${A}$ and $${B}$ have the greatest common factor $${g}$, so they reduce to $${num(Q.of(A, B))}$.`,
                  `数 $${A}$ 和 $${B}$ 的最大公因数是 $${g}$，约分后是 $${num(Q.of(A, B))}$。`,
                );
          return expressionProblem({
            prompt: simplifyPrompt(expr, variant === 1 ? [excluded[0]!] : excluded),
            answer,
            lowest: true,
            wrong,
            solution: t(
              `**Step 1: the binomial.** ${binomial.en}

**Step 2: the numbers.** ${numbers.en} Together:${steps(`${expr} = ${answer}`)}**Check.** Put $x = 0$ into both. The answer gives $${num(value)}$, and so does the original: $${frac(top0, bottom0)} = ${num(value)}$.`,
              `**第一步：二项式。** ${binomial["zh-CN"]}

**第二步：数。** ${numbers["zh-CN"]}合起来：${steps(`${expr} = ${answer}`)}**检验。** 把 $x = 0$ 代入两边。答案得 $${num(value)}$，原式也得同一个值：$${frac(top0, bottom0)} = ${num(value)}$。`,
            ),
          });
        }
      },
    },
  ],
};

/** checkAt checks a simplification at a small x where neither the numerator nor the denominator is zero. */
function checkAt(top: (x: number) => number, bottom: (x: number) => number): Text {
  const x0 = [0, 1, 2, -1, 3, -2, 4, -3, 5, -4, 6].find((x) => top(x) !== 0 && bottom(x) !== 0) ?? 10;
  const [n, d] = [top(x0), bottom(x0)];
  const v = num(Q.of(n, d));
  return t(
    `**Check.** Put $x = ${x0}$ into both. The answer gives $${v}$, and so does the original: $${frac(String(n), String(d))} = ${v}$.`,
    `**检验。** 把 $x = ${x0}$ 代入两边。答案得 $${v}$，原式也得同一个值：$${frac(String(n), String(d))} = ${v}$。`,
  );
}

/** factorCancel writes a solution in two steps, factoring and then cancelling, followed by its check. */
function factorCancel(factor: Text, lines: readonly string[], cancel: Text, chain: string, check: Text): Text {
  return t(
    `**Step 1: factor.** ${factor.en}${steps(...lines)}**Step 2: cancel.** ${cancel.en}${steps(chain)}${check.en}`,
    `**第一步：分解因式。** ${factor["zh-CN"]}${steps(...lines)}**第二步：约分。** ${cancel["zh-CN"]}${steps(chain)}${check["zh-CN"]}`,
  );
}

export const simplifyingRationalExpressionsByFactoring: TopicDef = {
  id: "simplifying-rational-expressions-by-factoring",
  title: t("Simplifying Rational Expressions by Factoring", "用因式分解化简分式"),
  summary: t(
    "Factor numerators and denominators by taking out common factors, the difference of squares, perfect squares and trinomials, then cancel common factors, opposite binomials included.",
    "用提取公因式、平方差、完全平方和三项式分解分子和分母，再约去公因式，包括互为相反数的二项式。",
  ),
  prerequisites: ["simplifying-rational-expressions", "factoring-differences-of-squares", "factoring-trinomials"],
  encompasses: [
    { topic: "simplifying-rational-expressions", weight: 0.6 },
    { topic: "factoring-trinomials", weight: 0.3 },
    { topic: "factoring-polynomials-using-gcfs", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.APR.D.6", "CCSS.HSA.SSE.A.2"],
  intro: t(
    `We can simplify a rational expression by cancelling a factor that its numerator and denominator share, such as a monomial or a binomial written as a factor. But often the shared factor is hidden inside a sum. In

$$\\frac{2x + 6}{x^{2} + 3x}$$

nothing can be cancelled as it stands, because $2x + 6$ and $x^{2} + 3x$ are sums, and only **factors** cancel, never terms. Factoring brings the hidden factor out: $2x + 6 = 2(x + 3)$ and $x^{2} + 3x = x(x + 3)$. Now $x + 3$ is a factor of both, and it cancels:

$$\\frac{2x + 6}{x^{2} + 3x} = \\frac{2(x + 3)}{x(x + 3)} = \\frac{2}{x}, \\quad x \\neq -3.$$

So simplifying becomes a factoring exercise: factor the numerator and the denominator completely, then cancel. The cancelled factor still excludes its value, here $x = -3$.

In this lesson we use each kind of factoring we know: common factors, the difference of squares, perfect squares and trinomials, and we learn to cancel binomials that are opposites, such as $3 - x$ and $x - 3$.`,
    `我们会通过约去分子和分母共有的因式来化简分式，例如单项式或写成因式的二项式。但公因式常常藏在和里面。在

$$\\frac{2x + 6}{x^{2} + 3x}$$

中，照原样什么也约不了，因为 $2x + 6$ 和 $x^{2} + 3x$ 都是和，而只有**因式**能约去，项不能约。因式分解能把藏着的因式提出来：$2x + 6 = 2(x + 3)$，$x^{2} + 3x = x(x + 3)$。现在 $x + 3$ 是两者的因式，可以约去：

$$\\frac{2x + 6}{x^{2} + 3x} = \\frac{2(x + 3)}{x(x + 3)} = \\frac{2}{x}, \\quad x \\neq -3.$$

所以化简变成了因式分解的练习：把分子和分母完全分解，再约分。被约去的因式仍然排除它对应的值，这里是 $x = -3$。

这节课我们用上学过的每一种因式分解：提取公因式、平方差、完全平方和三项式，还要学会约去互为相反数的二项式，例如 $3 - x$ 和 $x - 3$。`,
  ),
  knowledgePoints: [
    {
      id: "common-factors",
      title: t("Taking out common factors", "提取公因式"),
      explanation: t(
        `When the numerator or the denominator is a sum, factor it first: take out the greatest common factor of its terms, using the distributive law backwards. For $\\frac{4x + 12}{6x^{2} + 18x}$, the terms $4x$ and $12$ share $4$, and the terms $6x^{2}$ and $18x$ share $6x$:

$$4x + 12 = 4(x + 3) \\qquad 6x^{2} + 18x = 6x(x + 3)$$

Now both parts are products, with the common factors $2$ and $x + 3$:

$$\\frac{4x + 12}{6x^{2} + 18x} = \\frac{4(x + 3)}{6x(x + 3)} = \\frac{2}{3x}, \\quad x \\neq -3.$$

> **Watch out.** Never cancel terms of a sum: $\\frac{4x + 12}{6x^{2} + 18x}$ is not $\\frac{4x}{6x^{2}} + \\frac{12}{18x}$. Factor first and cancel whole factors only. Keep the numerator on top, keep the leftover power of $x$, and reduce the numbers to lowest terms.`,
        `当分子或分母是和时，先分解因式：用分配律的逆运算提取各项的最大公因式。对 $\\frac{4x + 12}{6x^{2} + 18x}$，$4x$ 和 $12$ 的公因数是 $4$，$6x^{2}$ 和 $18x$ 的公因式是 $6x$：

$$4x + 12 = 4(x + 3) \\qquad 6x^{2} + 18x = 6x(x + 3)$$

现在分子分母都是乘积，公因式是 $2$ 和 $x + 3$：

$$\\frac{4x + 12}{6x^{2} + 18x} = \\frac{4(x + 3)}{6x(x + 3)} = \\frac{2}{3x}, \\quad x \\neq -3.$$

> **注意。** 不能约去和中的某一项：$\\frac{4x + 12}{6x^{2} + 18x}$ 不等于 $\\frac{4x}{6x^{2}} + \\frac{12}{18x}$。先分解因式，只约去完整的因式。分子要留在上面，剩下的 $x$ 的幂不能丢，数要约成最简。`,
      ),
      keyPrerequisites: ["factoring-polynomials-using-gcfs"],
      generate(rng) {
        for (;;) {
          const u = rng.pick([1, 1, 1, 2, 3]);
          const p = rng.nonZero(-9, 9);
          const g = rng.int(1, 5);
          const a = rng.int(1, 6);
          const b = rng.int(1, 6);
          const i = rng.int(0, 1);
          const j = rng.int(0, 1);
          if (gcd(u, p) !== 1 || gcd(a, b) !== 1) continue;
          if ((g * a === 1 && i === 0) || (g * b === 1 && j === 0)) continue;
          if (a === b && i === j) continue;
          const A = g * a;
          const B = g * b * (rng.bool(0.25) ? -1 : 1);
          const L = linear(u, p);
          const top = poly([A * u, pw("x", i + 1)], [A * p, pw("x", i)]);
          const bottom = poly([B * u, pw("x", j + 1)], [B * p, pw("x", j)]);
          const expr = frac(top, bottom);
          const answer = ratio(A, [pw("x", i - j)], B, [pw("x", j - i)]);
          const topF = product(A, [pw("x", i), L]);
          const bottomF = product(B, [pw("x", j), L]);
          const factored = frac(topF, bottomF);
          const excluded = [num(Q.of(-p, u)), ...(i > 0 && j > 0 ? ["0"] : [])];
          const lin = (x: number) => u * x + p;
          return expressionProblem({
            prompt: simplifyPrompt(expr, excluded),
            answer,
            lowest: true,
            wrong: [
              ratio(B, [pw("x", j - i)], A, [pw("x", i - j)]),
              `${B < 0 ? "-" : ""}${frac(product(A, [pw("x", i - j)]), product(Math.abs(B), [pw("x", j - i)]))}`,
              ratio(A, [], B, []),
            ],
            solution: factorCancel(
              t(
                "Take out the greatest common factor of the terms of the numerator, and of the denominator:",
                "分别提取分子各项和分母各项的最大公因式：",
              ),
              [`${top} = ${topF}`, `${bottom} = ${bottomF}`],
              t(
                `Both parts now have the factor $${L}$. Cancel it, together with any common factor of the numbers and the powers of $x$:`,
                `现在分子分母都有因式 $${L}$。把它约去，同时约去数和 $x$ 的幂的公因式：`,
              ),
              `${expr} = ${factored} = ${answer}`,
              checkAt(
                (x) => A * x ** i * lin(x),
                (x) => B * x ** j * lin(x),
              ),
            ),
          });
        }
      },
    },
    {
      id: "difference-of-squares",
      title: t("The difference of squares", "平方差"),
      explanation: t(
        `Multiplying a sum by a difference gives $(a + b)(a - b) = a^{2} - b^{2}$, so a difference of two squares factors into a sum times a difference. In $x^{2} - 25$, $x^{2}$ is the square of $x$ and $25$ is the square of $5$:

$$x^{2} - 25 = (x + 5)(x - 5).$$

Factor every part completely, the other part included: $3x - 15 = 3(x - 5)$. Then the common binomial cancels:

$$\\frac{x^{2} - 25}{3x - 15} = \\frac{(x + 5)(x - 5)}{3(x - 5)} = \\frac{x + 5}{3}, \\quad x \\neq 5.$$

> **Watch out.** Cancel the binomial that appears in **both** parts and keep the other one: here $x - 5$ cancels and $x + 5$ stays, so $\\frac{x - 5}{3}$ is wrong. Do not divide term by term, as in $\\frac{x^{2}}{x}$ and $\\frac{25}{5}$, and do not lose the number $3$ that was taken out.`,
        `和乘以差得 $(a + b)(a - b) = a^{2} - b^{2}$，所以两个平方的差可以分解为和乘以差。在 $x^{2} - 25$ 中，$x^{2}$ 是 $x$ 的平方，$25$ 是 $5$ 的平方：

$$x^{2} - 25 = (x + 5)(x - 5).$$

每一部分都要完全分解，另一部分也是：$3x - 15 = 3(x - 5)$。然后约去公共的二项式：

$$\\frac{x^{2} - 25}{3x - 15} = \\frac{(x + 5)(x - 5)}{3(x - 5)} = \\frac{x + 5}{3}, \\quad x \\neq 5.$$

> **注意。** 约去的是**两部分**都有的那个二项式，另一个要保留：这里约去 $x - 5$，留下 $x + 5$，所以 $\\frac{x - 5}{3}$ 是错的。不能逐项相除（如 $\\frac{x^{2}}{x}$ 和 $\\frac{25}{5}$），提取出来的数 $3$ 也不能丢。`,
      ),
      keyPrerequisites: ["factoring-differences-of-squares"],
      generate(rng) {
        let u = rng.pick([1, 1, 1, 2, 3]);
        let b = rng.int(1, 9);
        while (gcd(u, b) !== 1) {
          u = rng.pick([1, 1, 1, 2, 3]);
          b = rng.int(1, 9);
        }
        const k = rng.int(1, 5);
        const tc = rng.sign();
        const S = poly([u * u, "x^{2}"], [-b * b, ""]);
        const cancel = linear(u, tc * b);
        const keep = linear(u, -tc * b);
        const scaled = linear(k * u, k * tc * b);
        const factoredS = `(${linear(u, b)})(${linear(u, -b)})`;
        const root = num(Q.of(-tc * b, u));
        const flip = rng.bool();
        const expr = flip ? frac(scaled, S) : frac(S, scaled);
        const answer = flip ? ratio(k, [], 1, [keep]) : ratio(1, [keep], k, []);
        const factored = flip ? frac(product(k, [cancel]), factoredS) : frac(factoredS, product(k, [cancel]));
        const sq = (x: number) => u * u * x * x - b * b;
        const lin = (x: number) => k * (u * x + tc * b);
        const ux = u === 1 ? "x" : `${u}x`;
        return expressionProblem({
          prompt: simplifyPrompt(expr, [root]),
          answer,
          lowest: true,
          wrong: flip ? [ratio(k, [], 1, [cancel]), ratio(1, [], 1, [keep])] : [ratio(1, [cancel], k, []), keep],
          solution: factorCancel(
            t(
              `$${S}$ is the difference of the squares of $${ux}$ and $${b}$, so it is their sum times their difference.${k === 1 ? "" : ` In $${scaled}$ the terms share $${k}$.`}`,
              `$${S}$ 是 $${ux}$ 与 $${b}$ 的平方差，所以等于它们的和乘以它们的差。${k === 1 ? "" : `$${scaled}$ 的各项有公因数 $${k}$。`}`,
            ),
            [`${S} = ${factoredS}`, ...(k === 1 ? [] : [`${scaled} = ${product(k, [cancel])}`])],
            t(
              `The binomial $${cancel}$ is a factor of both parts; cancel it and keep $${keep}$:`,
              `二项式 $${cancel}$ 是两部分共有的因式；约去它，保留 $${keep}$：`,
            ),
            `${expr} = ${factored} = ${answer}`,
            flip ? checkAt(lin, sq) : checkAt(sq, lin),
          ),
        });
      },
    },
    {
      id: "opposite-factors",
      title: t("Opposite binomials", "互为相反数的二项式"),
      explanation: t(
        `The binomials $3 - x$ and $x - 3$ are opposites: $3 - x = -(x - 3)$, so for every $x$ one is the negative of the other. They do not look alike, so take out $-1$ (or a negative number) to make them match. Then they cancel, leaving the $-1$ behind:

$$\\frac{3 - x}{x - 3} = \\frac{-(x - 3)}{x - 3} = -1.$$

In a longer example, factor the other parts as usual:

$$\\frac{8 - 2x}{x^{2} - 16} = \\frac{-2(x - 4)}{(x + 4)(x - 4)} = -\\frac{2}{x + 4}.$$

At $x = 0$ both sides give $-\\frac{1}{2}$, which confirms the sign.

> **Watch out.** Opposite binomials cancel to $-1$, not to $1$: dropping the minus sign is the most common mistake. Keep the binomial that does not cancel exactly as it is ($x + 4$ must not become $x - 4$), and keep the number taken out.`,
        `二项式 $3 - x$ 和 $x - 3$ 互为相反数：$3 - x = -(x - 3)$，对每个 $x$，一个都是另一个的相反数。它们看起来不一样，所以要提取 $-1$（或一个负数）使它们相同。然后约去，留下 $-1$：

$$\\frac{3 - x}{x - 3} = \\frac{-(x - 3)}{x - 3} = -1.$$

在较长的例子中，其余部分照常分解：

$$\\frac{8 - 2x}{x^{2} - 16} = \\frac{-2(x - 4)}{(x + 4)(x - 4)} = -\\frac{2}{x + 4}.$$

$x = 0$ 时两边都得 $-\\frac{1}{2}$，说明符号是对的。

> **注意。** 互为相反数的二项式约分后得 $-1$，不是 $1$：漏掉负号是最常见的错误。不能约去的那个二项式要原样保留（$x + 4$ 不能变成 $x - 4$），提取出来的数也要保留。`,
      ),
      keyPrerequisites: ["factoring-differences-of-squares"],
      generate(rng) {
        const b = rng.int(1, 9);
        const k = rng.int(1, 6);
        const variant = rng.pick([0, 0, 1, 1, 2]);
        const S = `x^{2} - ${b * b}`;
        const Sf = `(${bin(b)})(${bin(-b)})`;
        const opp = poly([k * b, ""], [-k, "x"]);
        const oppF = product(-k, [bin(-b)]);
        if (variant === 2) {
          let m = rng.int(1, 9);
          let n = rng.int(1, 9);
          while (m === n) {
            m = rng.int(1, 9);
            n = rng.int(1, 9);
          }
          const expr = frac(linear(m, -m * b), poly([n * b, ""], [-n, "x"]));
          const answer = ratio(-m, [], n, []);
          const topF = product(m, [bin(-b)]);
          const bottomF = product(-n, [bin(-b)]);
          return expressionProblem({
            prompt: simplifyPrompt(expr, [String(b)]),
            answer,
            lowest: true,
            wrong: [ratio(m, [], n, []), ratio(-n, [], m, []), "-1"],
            solution: factorCancel(
              t(
                `Take out $${m}$ from the numerator and $${-n}$ from the denominator, so that the same binomial $${bin(-b)}$ appears in both:`,
                `分子提取 $${m}$，分母提取 $${-n}$，使分子分母出现同一个二项式 $${bin(-b)}$：`,
              ),
              [`${linear(m, -m * b)} = ${topF}`, `${poly([n * b, ""], [-n, "x"])} = ${bottomF}`],
              t(`Cancel $${bin(-b)}$; the numbers that are left keep their signs:`, `约去 $${bin(-b)}$；剩下的数保留各自的符号：`),
              `${expr} = ${frac(topF, bottomF)} = ${answer}`,
              checkAt(
                (x) => m * (x - b),
                (x) => n * (b - x),
              ),
            ),
          });
        }
        const flip = variant === 1;
        const expr = flip ? frac(S, opp) : frac(opp, S);
        const factored = flip ? frac(Sf, oppF) : frac(oppF, Sf);
        const answer = flip ? (k === 1 ? poly([-1, "x"], [-b, ""]) : ratio(-1, [bin(b)], k, [])) : ratio(-k, [], 1, [bin(b)]);
        const sq = (x: number) => x * x - b * b;
        const op = (x: number) => k * (b - x);
        return expressionProblem({
          prompt: simplifyPrompt(expr, [String(b)]),
          answer,
          lowest: true,
          wrong: flip
            ? [ratio(1, [bin(b)], k, []), ratio(-1, [bin(-b)], k, []), ratio(-1, [bin(b)], 1, [])]
            : [ratio(k, [], 1, [bin(b)]), ratio(-k, [], 1, [bin(-b)]), ratio(-1, [], 1, [bin(b)])],
          solution: factorCancel(
            t(
              `$${S}$ is a difference of squares. The other part, $${opp}$, contains the opposite of $${bin(-b)}$, so take out $${-k}$ to make the binomials match:`,
              `$${S}$ 是平方差。另一部分 $${opp}$ 含有 $${bin(-b)}$ 的相反数，所以提取 $${-k}$，使两个二项式相同：`,
            ),
            [`${S} = ${Sf}`, `${opp} = ${oppF}`],
            t(`Cancel $${bin(-b)}$. The minus sign stays:`, `约去 $${bin(-b)}$。负号保留：`),
            `${expr} = ${factored} = ${answer}`,
            flip ? checkAt(sq, op) : checkAt(op, sq),
          ),
        });
      },
    },
    {
      id: "perfect-squares",
      title: t("Perfect squares", "完全平方"),
      explanation: t(
        `Squaring a binomial gives $(a + b)^{2} = a^{2} + 2ab + b^{2}$ and $(a - b)^{2} = a^{2} - 2ab + b^{2}$. Read backwards, a trinomial is a perfect square when its first and last terms are squares and its middle term is twice the product of their roots. In $x^{2} - 6x + 9$, the squares are $x^{2}$ and $9 = 3^{2}$, and $2 \\cdot x \\cdot 3 = 6x$ is the middle term, so

$$x^{2} - 6x + 9 = (x - 3)^{2} = (x - 3)(x - 3).$$

A square is two equal factors, so it cancels one factor at a time:

$$\\frac{x^{2} - 6x + 9}{x^{2} - 9} = \\frac{(x - 3)^{2}}{(x + 3)(x - 3)} = \\frac{x - 3}{x + 3}, \\quad x \\neq 3.$$

> **Watch out.** Against a single $x - 3$, only **one** of the two factors of $(x - 3)^{2}$ cancels; the other stays. Keep each remaining binomial with its own sign, and do not swap $x - 3$ and $x + 3$ between the top and the bottom.`,
        `二项式平方得 $(a + b)^{2} = a^{2} + 2ab + b^{2}$，$(a - b)^{2} = a^{2} - 2ab + b^{2}$。反过来看，当三项式的首项和末项都是平方，并且中间项是它们平方根之积的两倍时，它是完全平方式。在 $x^{2} - 6x + 9$ 中，平方是 $x^{2}$ 和 $9 = 3^{2}$，而 $2 \\cdot x \\cdot 3 = 6x$ 正是中间项，所以

$$x^{2} - 6x + 9 = (x - 3)^{2} = (x - 3)(x - 3).$$

平方是两个相同的因式，所以一次约去一个：

$$\\frac{x^{2} - 6x + 9}{x^{2} - 9} = \\frac{(x - 3)^{2}}{(x + 3)(x - 3)} = \\frac{x - 3}{x + 3}, \\quad x \\neq 3.$$

> **注意。** 和单个 $x - 3$ 相约时，$(x - 3)^{2}$ 的两个因式中只能约去**一个**，另一个要保留。剩下的二项式各自保留原来的符号，不要把 $x - 3$ 和 $x + 3$ 上下调换。`,
      ),
      keyPrerequisites: ["squaring-binomials"],
      generate(rng) {
        const p = rng.int(1, 9);
        const s = rng.sign();
        const k = rng.int(2, 6);
        const P = bin(s * p);
        const M = bin(-s * p);
        const sq = poly([1, "x^{2}"], [2 * s * p, "x"], [p * p, ""]);
        const sqF = `(${P})^{2}`;
        const D = `x^{2} - ${p * p}`;
        const Df = `(${P})(${M})`;
        const lin = linear(k, k * s * p);
        const linF = product(k, [P]);
        const variant = rng.int(0, 3);
        const cases = [
          [frac(sq, D), frac(sqF, Df), ratio(1, [P], 1, [M]), [ratio(1, [M], 1, [P]), ratio(1, [P], 1, [P]), "-1"]],
          [frac(D, sq), frac(Df, sqF), ratio(1, [M], 1, [P]), [ratio(1, [P], 1, [M]), ratio(1, [M], 1, [M]), "-1"]],
          [frac(lin, sq), frac(linF, sqF), ratio(k, [], 1, [P]), [ratio(k, [], 1, [M]), ratio(1, [], 1, [P]), ratio(k, [], 1, [sqF])]],
          [frac(sq, lin), frac(sqF, linF), ratio(1, [P], k, []), [ratio(1, [M], k, []), P, ratio(1, [sqF], k, [])]],
        ] as const;
        const [expr, factored, answer, wrong] = cases[variant]!;
        const fSq = (x: number) => (x + s * p) ** 2;
        const fD = (x: number) => x * x - p * p;
        const fLin = (x: number) => k * (x + s * p);
        const parts = [
          [fSq, fD],
          [fD, fSq],
          [fLin, fSq],
          [fSq, fLin],
        ] as const;
        const [fTop, fBottom] = parts[variant]!;
        const other = variant < 2 ? `${D} = ${Df}` : `${lin} = ${linF}`;
        return expressionProblem({
          prompt: simplifyPrompt(expr, [num(-s * p)]),
          answer,
          lowest: true,
          wrong,
          solution: factorCancel(
            t(
              `The first and last terms of $${sq}$ are the squares of $x$ and $${p}$, and the middle term is $${2 * s * p < 0 ? "-" : ""}2 \\cdot x \\cdot ${p}$, so it is a perfect square. Factor the other part too:`,
              `$${sq}$ 的首项和末项分别是 $x$ 和 $${p}$ 的平方，中间项是 $${2 * s * p < 0 ? "-" : ""}2 \\cdot x \\cdot ${p}$，所以它是完全平方式。另一部分也要分解：`,
            ),
            [`${sq} = ${sqF}`, other],
            t(
              `$${sqF}$ is $(${P})(${P})$; one factor $${P}$ cancels against the $${P}$ in the other part:`,
              `$${sqF}$ 就是 $(${P})(${P})$；其中一个因式 $${P}$ 与另一部分的 $${P}$ 相约：`,
            ),
            `${expr} = ${factored} = ${answer}`,
            checkAt(fTop, fBottom),
          ),
        });
      },
    },
    {
      id: "trinomials",
      title: t("Factoring trinomials", "分解三项式"),
      explanation: t(
        `Multiplying out $(x + m)(x + n)$ gives $x^{2} + (m + n)x + mn$. So a trinomial $x^{2} + bx + c$ factors as $(x + m)(x + n)$ when $m + n = b$ and $mn = c$. For $x^{2} - x - 6$ we need two numbers with product $-6$ and sum $-1$: they are $-3$ and $2$, so $x^{2} - x - 6 = (x - 3)(x + 2)$.

Factor every numerator and denominator completely, then cancel the common factors:

$$\\frac{x^{2} - x - 6}{x^{2} - 9} = \\frac{(x - 3)(x + 2)}{(x - 3)(x + 3)} = \\frac{x + 2}{x + 3}, \\quad x \\neq 3.$$

> **Watch out.** The terms $x^{2}$ do not cancel: only whole factors do. Check the signs of the factors, since $(x - 2)$ in place of $(x + 2)$ gives the wrong product. Cancel the binomial the two parts share, not a different one, and keep the numerator on top.`,
        `把 $(x + m)(x + n)$ 乘开得 $x^{2} + (m + n)x + mn$。所以当 $m + n = b$ 且 $mn = c$ 时，三项式 $x^{2} + bx + c$ 可以分解为 $(x + m)(x + n)$。对 $x^{2} - x - 6$，需要积为 $-6$、和为 $-1$ 的两个数：它们是 $-3$ 和 $2$，所以 $x^{2} - x - 6 = (x - 3)(x + 2)$。

把每个分子和分母都完全分解，再约去公因式：

$$\\frac{x^{2} - x - 6}{x^{2} - 9} = \\frac{(x - 3)(x + 2)}{(x - 3)(x + 3)} = \\frac{x + 2}{x + 3}, \\quad x \\neq 3.$$

> **注意。** $x^{2}$ 项不能约去：只有完整的因式才能约去。要检查因式的符号，把 $(x + 2)$ 写成 $(x - 2)$ 乘积就不对了。约去的是两部分共有的那个二项式，不是别的；分子要留在上面。`,
      ),
      keyPrerequisites: ["factoring-trinomials"],
      generate(rng) {
        for (;;) {
          const p = rng.nonZero(-9, 9);
          const q = rng.nonZero(-9, 9);
          const r = rng.nonZero(-9, 9);
          const k = rng.int(2, 5);
          const variant = rng.pick([0, 1, 2, 2, 3, 3]);
          if (p === q || p + q === 0 || Math.abs(p * q) > 40) continue;
          if (variant === 2 && (r === p || r === q || p + r === 0 || Math.abs(p * r) > 40)) continue;
          const tri = (u: number, v: number) => poly([1, "x^{2}"], [u + v, "x"], [u * v, ""]);
          const [P, Qb] = [bin(p), bin(q)];
          const triF = `(${P})(${Qb})`;
          const [other, otherF, keep] =
            variant === 0
              ? [P, P, ""]
              : variant === 1
                ? [linear(k, k * p), product(k, [P]), ""]
                : variant === 2
                  ? [tri(p, r), `(${P})(${bin(r)})`, bin(r)]
                  : [`x^{2} - ${p * p}`, `(${P})(${bin(-p)})`, bin(-p)];
          const kk = variant === 1 ? k : 1;
          const flip = rng.bool(0.35);
          const expr = flip ? frac(other, tri(p, q)) : frac(tri(p, q), other);
          const factored = flip ? frac(otherF, triF) : frac(triF, otherF);
          const answer = flip ? ratio(kk, [keep], 1, [Qb]) : ratio(1, [Qb], kk, [keep]);
          const wrongQ = bin(-q);
          const fTri = (x: number) => (x + p) * (x + q);
          const fOther = (x: number) =>
            variant === 0 ? x + p : variant === 1 ? k * (x + p) : variant === 2 ? (x + p) * (x + r) : (x + p) * (x - p);
          const why = t(
            `Look for two numbers with sum $${p + q}$ and product $${p * q}$: they are $${p}$ and $${q}$, since $${p} + ${paren(q)} = ${p + q}$ and $${p} \\cdot ${paren(q)} = ${p * q}$.`,
            `要找和为 $${p + q}$、积为 $${p * q}$ 的两个数：它们是 $${p}$ 和 $${q}$，因为 $${p} + ${paren(q)} = ${p + q}$，$${p} \\cdot ${paren(q)} = ${p * q}$。`,
          );
          const otherWords =
            variant === 0
              ? t(` The other part is already the binomial $${P}$.`, `另一部分本来就是二项式 $${P}$。`)
              : t(" Factor the other part too:", "另一部分也要分解：");
          return expressionProblem({
            prompt: simplifyPrompt(expr, [num(-p)]),
            answer,
            lowest: true,
            wrong: flip
              ? [ratio(kk, [keep], 1, [wrongQ]), ratio(1, [Qb], kk, [keep]), ratio(kk, [keep], 1, [bin(p)])]
              : [ratio(1, [wrongQ], kk, [keep]), ratio(kk, [keep], 1, [Qb]), ratio(1, [bin(p)], kk, [keep])],
            solution: factorCancel(
              t(`${why.en}${otherWords.en}`, `${why["zh-CN"]}${otherWords["zh-CN"]}`),
              variant === 0 ? [`${tri(p, q)} = ${triF}`] : [`${tri(p, q)} = ${triF}`, `${other} = ${otherF}`],
              t(`The common factor is $${P}$; cancel it:`, `公因式是 $${P}$，把它约去：`),
              `${expr} = ${factored} = ${answer}`,
              flip ? checkAt(fOther, fTri) : checkAt(fTri, fOther),
            ),
          });
        }
      },
    },
  ],
};

/** plug writes mx + n with a value put in for x, together with its value: ["2(-3) + 5", -1]. */
function plug(m: number, n: number, x: Q): [string, Q] {
  const front = m === 1 ? "" : m === -1 ? "-" : String(m);
  const shown = m === 1 && n === 0 ? num(x) : `${front}(${num(x)})`;
  return [n === 0 ? shown : `${shown} ${n < 0 ? "-" : "+"} ${Math.abs(n)}`, x.mul(Q.of(m)).add(Q.of(n))];
}

/** constant writes a number as a part of a fraction to put values into, together with its value. */
const constant = (a: number): [string, Q] => [String(a), Q.of(a)];

/** fracAt writes a fraction with a value put in for x and works it out: "\frac{12}{(5) - 2} = \frac{12}{3} = 4". */
function fracAt(top: readonly [string, Q], bottom: readonly [string, Q]): string {
  const v = top[1].div(bottom[1]);
  const plain = top[0] === num(top[1]) && bottom[0] === num(bottom[1]);
  const mid = !plain && top[1].isInteger() && bottom[1].isInteger() ? ` = ${frac(num(top[1]), num(bottom[1]))}` : "";
  return `${frac(top[0], bottom[0])}${mid} = ${num(v)}`;
}

/** exclusion names the values that make a denominator zero, which no solution can take. */
function exclusion(pairs: readonly (readonly [string, string])[]): Text {
  const seen = pairs.filter((p, i) => pairs.findIndex((o) => o[1] === p[1]) === i);
  if (seen.length === 1) {
    const [D, v] = seen[0]!;
    return t(
      `The denominator $${D}$ is zero at $x = ${v}$, so $x \\neq ${v}$: that value can never be a solution.`,
      `分母 $${D}$ 在 $x = ${v}$ 时为零，所以 $x \\neq ${v}$：这个值不可能是方程的解。`,
    );
  }
  const vs = seen.map(([, v]) => v);
  return t(
    `The denominators are zero at $x = ${vs.join("$ and $x = ")}$, so $x \\neq ${vs.join("$ and $x \\neq ")}$: those values can never be solutions.`,
    `分母分别在 $x = ${vs.join("$ 和 $x = ")}$ 时为零，所以 $x \\neq ${vs.join("$ 且 $x \\neq ")}$：这些值不可能是方程的解。`,
  );
}

/** rootCheck puts a solution back into the equation, side by side. */
const rootCheck = (x: string, left: string, right: string): Text =>
  left === right
    ? t(
        `**Check.** $x = ${x}$ is not excluded. Putting it into the equation turns both sides into the same number: $${left}$.`,
        `**检验。** $x = ${x}$ 不是要排除的值。代入方程后，两边变成同一个数：$${left}$。`,
      )
    : right.includes("=")
      ? t(
          `**Check.** $x = ${x}$ is not excluded. Put it into both sides of the equation; they give the same value:${steps(left, right)}`,
          `**检验。** $x = ${x}$ 不是要排除的值。把它代入方程的两边，得到同一个值：${steps(left, right)}`,
        )
      : t(
          `**Check.** $x = ${x}$ is not excluded. The right side is $${right}$, and putting $x = ${x}$ into the left side gives the same value: $${left}$.`,
          `**检验。** $x = ${x}$ 不是要排除的值。右边是 $${right}$；把 $x = ${x}$ 代入左边，得到同一个值：$${left}$。`,
        );

/** extraneousCheck shows that the only candidate makes a denominator zero. */
const extraneousCheck = (v: string, work: string): Text =>
  t(
    `**Check.** Putting $x = ${v}$ into the denominator gives $${work} = 0$, so the equation is not even defined there.`,
    `**检验。** 把 $x = ${v}$ 代入分母，得 $${work} = 0$，方程在这里根本没有意义。`,
  );

/** equationSolution writes a rational equation's solution: the excluded values, the solving steps, the verdict and the check. */
function equationSolution(excluded: Text, how: Text, work: readonly string[], verdict: Text, check: Text | null): Text {
  return t(
    `**Step 1: excluded values.** ${excluded.en}

**Step 2: solve.** ${how.en}${steps(...work.filter((l, i) => l !== work[i - 1]))}${verdict.en}${check ? `\n\n${check.en}` : ""}`,
    `**第一步：要排除的值。** ${excluded["zh-CN"]}

**第二步：解方程。** ${how["zh-CN"]}${steps(...work.filter((l, i) => l !== work[i - 1]))}${verdict["zh-CN"]}${check ? `\n\n${check["zh-CN"]}` : ""}`,
  );
}

export const rationalEquationsWithOneFractionalTerm: TopicDef = {
  id: "rational-equations-with-one-fractional-term",
  title: t("Solving Rational Equations Containing One Fractional Term", "解只含一个分式的分式方程"),
  summary: t(
    "Solve equations with one fraction that has the variable in its denominator, by multiplying by the denominator and checking for excluded values.",
    "解只含一个分母中有未知数的分式的方程：两边乘以分母，并检验是否为要排除的值。",
  ),
  prerequisites: ["simplifying-rational-expressions", "equations-with-parentheses"],
  encompasses: [
    { topic: "equations-with-parentheses", weight: 0.4 },
    { topic: "two-step-equations", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.A.2"],
  intro: t(
    `We can solve linear equations, parentheses included, and we know that a rational expression is not defined where its denominator is zero. A **rational equation** has the variable in a denominator, as in

$$\\frac{12}{x - 2} = 4.$$

Such equations come up whenever a quantity is divided by an unknown, for example a fixed amount shared among an unknown number of people. The fraction is what makes them new, so we remove it. Multiplying both sides of an equation by the same quantity keeps it balanced, and multiplying $\\frac{12}{x - 2}$ by $x - 2$ leaves just $12$:

$$12 = 4(x - 2) = 4x - 8, \\qquad 4x = 20, \\qquad x = 5.$$

There is a catch. Multiplying by $x - 2$ is only allowed when $x - 2$ is not zero, so $x = 2$ is excluded from the start. If the steps ever lead to an excluded value, it is not a solution. Putting $x = 5$ back in confirms the answer: $\\frac{12}{5 - 2} = 4$.

In this lesson we solve equations with one fraction: a number over a binomial, a binomial over a binomial, and fractions that must first be isolated.`,
    `我们会解一次方程（包括带括号的），也知道分式在分母为零时没有意义。**分式方程**的分母中含有未知数，例如

$$\\frac{12}{x - 2} = 4.$$

只要一个量除以未知数，就会出现这样的方程，例如把一笔固定的钱平分给人数未知的一群人。新的地方在于分式，所以我们要把它去掉。方程两边同乘一个量，等式仍然成立；而 $\\frac{12}{x - 2}$ 乘以 $x - 2$ 就只剩下 $12$：

$$12 = 4(x - 2) = 4x - 8, \\qquad 4x = 20, \\qquad x = 5.$$

但要注意：只有 $x - 2$ 不为零时才能乘以它，所以一开始就要排除 $x = 2$。如果解题过程得到了要排除的值，它就不是方程的解。把 $x = 5$ 代回去可以确认答案：$\\frac{12}{5 - 2} = 4$。

这节课我们解只含一个分式的方程：数除以二项式、二项式除以二项式，以及需要先分离出分式的方程。`,
  ),
  knowledgePoints: [
    {
      id: "variable-in-the-denominator",
      title: t("A number over a binomial", "数除以二项式"),
      explanation: t(
        `When the variable is in a denominator, first note the value that makes the denominator zero; it is excluded. Then multiply both sides by the denominator. On the left it cancels, since $\\frac{12}{x - 2} \\cdot (x - 2) = 12$; on the right it multiplies the **whole** binomial:

$$\\frac{12}{x - 2} = 4 \\;\\Rightarrow\\; 12 = 4(x - 2) \\;\\Rightarrow\\; 12 = 4x - 8 \\;\\Rightarrow\\; 4x = 20 \\;\\Rightarrow\\; x = 5$$

Here $x = 2$ is excluded, and $x = 5$ is not, so it is the solution. Putting it back: $\\frac{12}{5 - 2} = \\frac{12}{3} = 4$.

> **Watch out.** Multiply the number on the right by the whole denominator, $4(x - 2) = 4x - 8$, and then divide by the coefficient: $12 = 4(x - 2)$ means $x - 2 = \\frac{12}{4}$, not $\\frac{4}{12}$ or $12 \\cdot 4$. Move the constant with the right sign, and never give the excluded value as the answer.`,
        `当未知数在分母中时，先找出使分母为零的值，它要排除。然后两边同乘这个分母。左边分母约去，因为 $\\frac{12}{x - 2} \\cdot (x - 2) = 12$；右边要乘以**整个**二项式：

$$\\frac{12}{x - 2} = 4 \\;\\Rightarrow\\; 12 = 4(x - 2) \\;\\Rightarrow\\; 12 = 4x - 8 \\;\\Rightarrow\\; 4x = 20 \\;\\Rightarrow\\; x = 5$$

这里要排除 $x = 2$，而 $x = 5$ 不是要排除的值，所以它就是方程的解。代回去：$\\frac{12}{5 - 2} = \\frac{12}{3} = 4$。

> **注意。** 右边的数要乘以整个分母，$4(x - 2) = 4x - 8$，然后再除以系数：由 $12 = 4(x - 2)$ 得 $x - 2 = \\frac{12}{4}$，不是 $\\frac{4}{12}$，也不是 $12 \\cdot 4$。常数移项时注意符号，也绝不能把要排除的值当作答案。`,
      ),
      keyPrerequisites: ["equations-with-parentheses"],
      generate(rng) {
        const c = rng.nonZero(-6, 6);
        const a = rng.bool(0.6) ? c * rng.nonZero(-8, 8) : rng.nonZero(-24, 24);
        const m = rng.pick([1, 1, 1, 2, 3]);
        const p = rng.bool(0.2) ? 0 : rng.nonZero(-9, 9);
        const L = linear(m, p);
        const x = Q.of(a, c).sub(Q.of(p)).div(Q.of(m));
        const eq = `${frac(String(a), L)} = ${c}`;
        const work = [
          `${a} = ${product(c, [L])}`,
          ...(p === 0 ? [] : [`${a} = ${linear(c * m, c * p)}`]),
          ...solvingLinear(c * m, Q.of(a - c * p)),
        ];
        return solutionsProblem({
          prompt: solve(eq),
          values: [num(x)],
          wrong: [
            [num(Q.of(a * c - p, m))],
            [num(Q.of(c, a).sub(Q.of(p)).div(Q.of(m)))],
            [num(Q.of(-p, m))],
            [num(Q.of(a, c).add(Q.of(p)).div(Q.of(m)))],
          ],
          solution: equationSolution(
            exclusion([[L, num(Q.of(-p, m))]]),
            t(
              `Multiply both sides by $${L}$. On the left it cancels; on the right it multiplies $${c}$:`,
              `两边同乘 $${L}$。左边分母约去；右边是 $${c}$ 乘以它：`,
            ),
            work,
            keptNote(num(x)),
            rootCheck(num(x), fracAt(constant(a), plug(m, p, x)), String(c)),
          ),
        });
      },
    },
    {
      id: "binomial-over-binomial",
      title: t("A binomial over a binomial", "二项式除以二项式"),
      explanation: t(
        `The numerator may contain the variable too. Multiplying both sides by the denominator still clears the fraction, and the right side becomes the number times the **whole** denominator. Then gather the $x$ terms on one side:

$$\\frac{2x + 1}{x - 4} = 3 \\;\\Rightarrow\\; 2x + 1 = 3(x - 4) = 3x - 12 \\;\\Rightarrow\\; 2x - 3x = -12 - 1 \\;\\Rightarrow\\; -x = -13 \\;\\Rightarrow\\; x = 13$$

Always compare the result with the excluded value. In $\\frac{2x - 8}{x - 4} = 3$, the same steps give $x = 4$, which makes the denominator zero. It is the only candidate and it is rejected, so the equation has **no solution**. (Indeed $\\frac{2x - 8}{x - 4} = 2$ for every allowed $x$, never $3$.)

> **Watch out.** A value that makes the denominator zero is never a solution, even when the algebra produces it: give no solution instead, and do not list it next to a real solution. Multiply out the right side fully, and move the constant to the other side with its sign changed.`,
        `分子中也可以有未知数。两边同乘分母仍然能去掉分式，右边变成这个数乘以**整个**分母。然后把含 $x$ 的项移到一边：

$$\\frac{2x + 1}{x - 4} = 3 \\;\\Rightarrow\\; 2x + 1 = 3(x - 4) = 3x - 12 \\;\\Rightarrow\\; 2x - 3x = -12 - 1 \\;\\Rightarrow\\; -x = -13 \\;\\Rightarrow\\; x = 13$$

一定要把结果与要排除的值比较。在 $\\frac{2x - 8}{x - 4} = 3$ 中，同样的步骤得到 $x = 4$，它使分母为零。它是唯一的候选值，又被舍去了，所以方程**无解**。（事实上，对每个允许的 $x$，$\\frac{2x - 8}{x - 4} = 2$，永远不等于 $3$。）

> **注意。** 使分母为零的值永远不是方程的解，即使计算得到了它：这时应答无解，也不要把它和真正的解写在一起。右边要完全乘开，常数移到另一边时要变号。`,
      ),
      generate(rng) {
        for (;;) {
          const p = rng.nonZero(-5, 5);
          const q = rng.nonZero(-9, 9);
          const d = rng.nonZero(-9, 9);
          if (d === p) continue;
          const excluded = rng.bool(0.3);
          let r: number;
          if (excluded) r = p * q;
          else if (rng.bool(0.6)) {
            const x0 = rng.int(-10, 10);
            r = d * (x0 + q) - p * x0;
          } else r = rng.int(-20, 20);
          if (!excluded && r === p * q) continue;
          const N = linear(p, r);
          const D = bin(q);
          const x = Q.of(d * q - r, p - d);
          const eq = `${frac(N, D)} = ${d}`;
          const gather = `${minus(linear(p, 0), d, "x")} = ${minus(String(d * q), r)}`;
          const work = [`${N} = ${product(d, [D])}`, `${N} = ${linear(d, d * q)}`, gather, ...solvingLinear(p - d, Q.of(d * q - r))];
          const note = excluded ? excludedNote(num(-q)) : keptNote(num(x));
          return solutionsProblem({
            prompt: solve(eq),
            values: excluded ? [] : [num(x)],
            wrong: excluded
              ? [[num(-q)], [num(-q), num(Q.of(q - r, p - d))]]
              : [[num(-q)], [num(x), num(-q)], [num(Q.of(q - r, p - d))], [num(x.neg())]],
            solution: equationSolution(
              exclusion([[D, num(-q)]]),
              t(
                `Multiply both sides by $${D}$, multiply out the right side, and gather the $x$ terms on the left:`,
                `两边同乘 $${D}$，把右边乘开，再把含 $x$ 的项移到左边：`,
              ),
              work,
              note,
              excluded
                ? extraneousCheck(num(-q), plug(1, q, Q.of(-q))[0])
                : rootCheck(num(x), fracAt(plug(p, r, x), plug(1, q, x)), String(d)),
            ),
          });
        }
      },
    },
    {
      id: "isolating-the-fraction",
      title: t("Isolating the fraction first", "先分离分式"),
      explanation: t(
        `If the equation has another term besides the fraction, isolate the fraction first, as you would isolate $x$ in a two-step equation. Then the equation has the familiar form "fraction = number", and multiplying by the denominator clears it:

$$\\frac{6}{x + 1} - 5 = -3 \\;\\Rightarrow\\; \\frac{6}{x + 1} = 2 \\;\\Rightarrow\\; 6 = 2(x + 1) \\;\\Rightarrow\\; 6 = 2x + 2 \\;\\Rightarrow\\; x = 2$$

Here $x \\neq -1$, so $x = 2$ is the solution: $\\frac{6}{3} - 5 = -3$.

A fraction is zero only when its numerator is zero. So if the isolated fraction has a nonzero number as numerator and must equal $0$, there is no solution.

> **Watch out.** Isolate the fraction before clearing the denominator: multiplying only the fraction by $x + 1$ and not the other terms breaks the equation, and forgetting to move the $-5$ gives a wrong answer. Move the term with its sign changed, and keep the excluded value out of the answer.`,
        `如果方程中除了分式还有其他项，先像解两步方程时分离 $x$ 那样分离出分式。这样方程就变成熟悉的“分式 = 数”的形式，两边同乘分母就能去分母：

$$\\frac{6}{x + 1} - 5 = -3 \\;\\Rightarrow\\; \\frac{6}{x + 1} = 2 \\;\\Rightarrow\\; 6 = 2(x + 1) \\;\\Rightarrow\\; 6 = 2x + 2 \\;\\Rightarrow\\; x = 2$$

这里 $x \\neq -1$，所以 $x = 2$ 是方程的解：$\\frac{6}{3} - 5 = -3$。

分式只有在分子为零时才等于零。所以如果分离出的分式分子是不为零的数，却要等于 $0$，方程就无解。

> **注意。** 去分母之前要先分离出分式：只把分式乘以 $x + 1$ 而不乘其他项，等式就不成立了；忘了移走 $-5$ 也会得到错误的答案。移项要变号，要排除的值不能出现在答案里。`,
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        for (;;) {
          const a = rng.nonZero(-20, 20);
          const q = rng.nonZero(-9, 9);
          const b = rng.nonZero(-9, 9);
          const none = rng.bool(0.2);
          const e = none ? b : rng.int(-12, 12);
          if (!none && e === b) continue;
          const k = e - b;
          const D = bin(q);
          const F = frac(String(a), D);
          const fractionFirst = rng.bool(0.7);
          const eq = fractionFirst ? `${F} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${e}` : `${b} + ${F} = ${e}`;
          const isolated = `${F} = ${k}`;
          const move = t(
            `First isolate the fraction: ${b < 0 ? `add $${-b}$ to` : `subtract $${b}$ from`} both sides.`,
            `先分离出分式：两边同时${b < 0 ? `加上 $${-b}$` : `减去 $${b}$`}。`,
          );
          if (none) {
            return solutionsProblem({
              prompt: solve(eq),
              values: [],
              wrong: [[num(-q)], ["0"]],
              solution: equationSolution(
                exclusion([[D, num(-q)]]),
                move,
                [isolated],
                t(
                  `A fraction is $0$ only when its numerator is $0$, and the numerator here is $${a}$. So the equation has no solution, $\\varnothing$.`,
                  `分式只有在分子为 $0$ 时才等于 $0$，而这里分子是 $${a}$。所以方程无解：$\\varnothing$。`,
                ),
                null,
              ),
            });
          }
          const x = Q.of(a, k).sub(Q.of(q));
          const work = [isolated, `${a} = ${product(k, [D])}`, `${a} = ${linear(k, k * q)}`, ...solvingLinear(k, Q.of(a - k * q))];
          const [shown] = plug(1, q, x);
          const kk = k < 0 ? `(${k})` : String(k);
          const left = fractionFirst
            ? `${frac(String(a), shown)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${k} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${e}`
            : `${b} + ${frac(String(a), shown)} = ${b} + ${kk} = ${e}`;
          return solutionsProblem({
            prompt: solve(eq),
            values: [num(x)],
            wrong: [
              [num(-q)],
              ...(e !== 0 ? [[num(Q.of(a, e).sub(Q.of(q)))]] : []),
              ...(e + b !== 0 ? [[num(Q.of(a, e + b).sub(Q.of(q)))]] : []),
              [num(Q.of(a, k).add(Q.of(q)))],
            ],
            solution: equationSolution(
              exclusion([[D, num(-q)]]),
              t(`${move.en} Then multiply both sides by $${D}$:`, `${move["zh-CN"]}然后两边同乘 $${D}$：`),
              work,
              keptNote(num(x)),
              rootCheck(num(x), left, String(e)),
            ),
          });
        }
      },
    },
  ],
};

/** minus writes a − b·v, folding the sign of b into the operator and leaving out a zero b: "3x - 2x", "5 + 4", "7". */
function minus(a: string, b: number, v = ""): string {
  return b === 0 ? a : `${a} ${b < 0 ? "+" : "-"} ${poly([Math.abs(b), v])}`;
}

export const rationalEquationsUsingCrossMultiplication: TopicDef = {
  id: "rational-equations-using-cross-multiplication",
  title: t("Solving Rational Equations Using Cross-Multiplication", "用交叉相乘解分式方程"),
  summary: t(
    "Solve equations of the form $\\frac{a}{b} = \\frac{c}{d}$ with the variable in a denominator by cross-multiplying, and reject excluded values.",
    "用交叉相乘解形如 $\\frac{a}{b} = \\frac{c}{d}$、分母中含未知数的方程，并舍去要排除的值。",
  ),
  prerequisites: ["rational-equations-with-one-fractional-term", "proportions"],
  encompasses: [{ topic: "proportions", weight: 0.5 }],
  xp: 15,
  standards: ["CCSS.HSA.REI.A.2"],
  intro: t(
    `We can solve an equation with one fraction by multiplying both sides by its denominator, and we know from proportions that $\\frac{a}{b} = \\frac{c}{d}$ exactly when $ad = bc$. Now both sides of the equation are fractions, and the variable is in a denominator:

$$\\frac{5}{x + 2} = \\frac{3}{4}.$$

Clearing the denominators one at a time would work, but there is a shortcut. Multiplying both sides of $\\frac{a}{b} = \\frac{c}{d}$ by $bd$ cancels $b$ on the left and $d$ on the right:

$$\\frac{a}{b} \\cdot bd = \\frac{c}{d} \\cdot bd \\quad\\Rightarrow\\quad ad = cb.$$

Each numerator ends up multiplied by the other side's denominator: this is **cross-multiplying**. Here it gives $5 \\cdot 4 = 3(x + 2)$, so $20 = 3x + 6$ and $x = \\frac{14}{3}$.

Multiplying by $bd$ is only allowed when neither denominator is zero, so as before we note the excluded values first, here $x \\neq -2$, and reject any of them that the algebra produces. In this lesson we cross-multiply with a number on one side, with binomials in both denominators, and with equal denominators, where an excluded value can appear.`,
    `我们会把只含一个分式的方程两边同乘分母来解；从比例中也知道，$\\frac{a}{b} = \\frac{c}{d}$ 当且仅当 $ad = bc$。现在方程两边都是分式，而且未知数在分母中：

$$\\frac{5}{x + 2} = \\frac{3}{4}.$$

一个一个地去分母也可以，但有一个捷径。把 $\\frac{a}{b} = \\frac{c}{d}$ 两边同乘 $bd$，左边约去 $b$，右边约去 $d$：

$$\\frac{a}{b} \\cdot bd = \\frac{c}{d} \\cdot bd \\quad\\Rightarrow\\quad ad = cb.$$

每个分子最后都乘上了另一边的分母：这就是**交叉相乘**。这里得到 $5 \\cdot 4 = 3(x + 2)$，所以 $20 = 3x + 6$，$x = \\frac{14}{3}$。

只有两个分母都不为零时才能乘以 $bd$，所以和以前一样，先写出要排除的值（这里是 $x \\neq -2$），并舍去计算中得到的这些值。这节课我们在一边是数、两边分母都是二项式、以及两边分母相同（可能得到要排除的值）的情况下练习交叉相乘。`,
  ),
  knowledgePoints: [
    {
      id: "a-number-on-one-side",
      title: t("A number fraction on one side", "一边是数的分数"),
      explanation: t(
        `When an equation is a single fraction equal to another single fraction, cross-multiplying clears both denominators at once: $\\frac{a}{b} = \\frac{c}{d}$ means $ad = bc$, for nonzero $b$ and $d$. Each numerator multiplies the **other** side's denominator. Keep each binomial in parentheses so that the whole binomial is multiplied:

$$\\frac{5}{x + 2} = \\frac{3}{4} \\;\\Rightarrow\\; 3(x + 2) = 5 \\cdot 4 \\;\\Rightarrow\\; 3x + 6 = 20 \\;\\Rightarrow\\; 3x = 14 \\;\\Rightarrow\\; x = \\frac{14}{3}$$

The excluded value is $x = -2$, and $\\frac{14}{3}$ is not it, so it is the solution. When the variable is only in a numerator, as in $\\frac{x + 2}{4} = \\frac{3}{5}$, no value is excluded, and cross-multiplying works the same way.

> **Watch out.** Multiply across, not straight across the top: $3(x + 2) = 5 \\cdot 4$, not $5(x + 2) = 3 \\cdot 4$. Multiply the whole binomial, $3(x + 2) = 3x + 6$ rather than $3x + 2$, and do not solve the denominator alone: $x + 2 = 0$ gives the excluded value, not the solution.`,
        `当方程是一个分式等于另一个分式时，交叉相乘可以一次去掉两个分母：$\\frac{a}{b} = \\frac{c}{d}$ 意味着 $ad = bc$（$b$、$d$ 不为零）。每个分子都乘以**另一边**的分母。二项式要放在括号里，保证乘的是整个二项式：

$$\\frac{5}{x + 2} = \\frac{3}{4} \\;\\Rightarrow\\; 3(x + 2) = 5 \\cdot 4 \\;\\Rightarrow\\; 3x + 6 = 20 \\;\\Rightarrow\\; 3x = 14 \\;\\Rightarrow\\; x = \\frac{14}{3}$$

要排除的值是 $x = -2$，而 $\\frac{14}{3}$ 不是它，所以它就是方程的解。当未知数只在分子中时，例如 $\\frac{x + 2}{4} = \\frac{3}{5}$，没有要排除的值，交叉相乘的方法相同。

> **注意。** 要交叉着乘，不是上下直接对应着乘：$3(x + 2) = 5 \\cdot 4$，而不是 $5(x + 2) = 3 \\cdot 4$。要乘整个二项式，$3(x + 2) = 3x + 6$，不是 $3x + 2$；也不要只解分母：由 $x + 2 = 0$ 得到的是要排除的值，不是方程的解。`,
      ),
      keyPrerequisites: ["proportions"],
      generate(rng) {
        for (;;) {
          const a = rng.nonZero(-12, 12);
          const b = rng.nonZero(-9, 9);
          const c = rng.int(2, 9);
          const m = rng.pick([1, 1, 2, 3]);
          const p = rng.nonZero(-9, 9);
          if (gcd(b, c) !== 1) continue;
          const L = linear(m, p);
          const R = num(Q.of(b, c));
          const inDenominator = rng.bool(0.7);
          const how = t(
            "Cross-multiply: each numerator times the other side's denominator. Then solve the linear equation:",
            "交叉相乘：每个分子乘以另一边的分母。再解得到的一次方程：",
          );
          if (inDenominator) {
            // a / L = b / c  ⇒  b·L = a·c
            const x = Q.of(a * c - b * p, b * m);
            const work = [
              `${product(b, [L])} = ${cdot(String(a), String(c))}`,
              `${linear(b * m, b * p)} = ${a * c}`,
              ...solvingLinear(b * m, Q.of(a * c - b * p)),
            ];
            return solutionsProblem({
              prompt: solve(`${frac(String(a), L)} = ${R}`),
              values: [num(x)],
              wrong: [[num(Q.of(a * c - p, b * m))], [num(Q.of(a * b - c * p, c * m))], [num(Q.of(-p, m))]],
              solution: equationSolution(
                exclusion([[L, num(Q.of(-p, m))]]),
                how,
                work,
                keptNote(num(x)),
                rootCheck(num(x), fracAt(constant(a), plug(m, p, x)), R),
              ),
            });
          }
          // L / e = b / c  ⇒  c·L = e·b
          const e = rng.int(2, 12);
          const x = Q.of(e * b - c * p, c * m);
          const work = [
            `${product(c, [L])} = ${cdot(String(e), String(b))}`,
            `${linear(c * m, c * p)} = ${e * b}`,
            ...solvingLinear(c * m, Q.of(e * b - c * p)),
          ];
          return solutionsProblem({
            prompt: solve(`${frac(L, String(e))} = ${R}`),
            values: [num(x)],
            wrong: [[num(Q.of(e * b - p, c * m))], [num(Q.of(e * c - b * p, b * m))]],
            solution: t(
              `**Step 1: excluded values.** Both denominators are numbers, so no value of $x$ is excluded.

**Step 2: solve.** ${how.en}${steps(...work)}So $x = ${num(x)}$.

**Check.** The right side is $${R}$, and putting $x = ${num(x)}$ into the left side gives the same value: $${fracAt(plug(m, p, x), constant(e))}$.`,
              `**第一步：要排除的值。** 两个分母都是数，所以没有要排除的 $x$ 值。

**第二步：解方程。** ${how["zh-CN"]}${steps(...work)}所以 $x = ${num(x)}$。

**检验。** 右边是 $${R}$；把 $x = ${num(x)}$ 代入左边，得到同一个值：$${fracAt(plug(m, p, x), constant(e))}$。`,
            ),
          });
        }
      },
    },
    {
      id: "variables-on-both-sides",
      title: t("Binomials in both denominators", "两边分母都是二项式"),
      explanation: t(
        `When both denominators contain the variable, each one excludes a value. Cross-multiply the same way; the result has $x$ on both sides, so gather the $x$ terms on one side and the numbers on the other:

$$\\frac{4}{x + 1} = \\frac{3}{x - 2} \\;\\Rightarrow\\; 4(x - 2) = 3(x + 1) \\;\\Rightarrow\\; 4x - 8 = 3x + 3 \\;\\Rightarrow\\; 4x - 3x = 3 + 8 \\;\\Rightarrow\\; x = 11$$

The excluded values are $x = -1$ and $x = 2$, so $x = 11$ is the solution. Check: $\\frac{4}{12} = \\frac{1}{3}$ and $\\frac{3}{9} = \\frac{1}{3}$.

> **Watch out.** Each numerator multiplies the **other** side's denominator: $4(x - 2)$, not $4(x + 1)$. Multiply the number into both terms of the binomial, and when moving a term across, change its sign. The values that make a denominator zero are excluded, not solutions.`,
        `当两边的分母都含有未知数时，每个分母各排除一个值。同样交叉相乘；结果两边都有 $x$，所以把含 $x$ 的项移到一边，数移到另一边：

$$\\frac{4}{x + 1} = \\frac{3}{x - 2} \\;\\Rightarrow\\; 4(x - 2) = 3(x + 1) \\;\\Rightarrow\\; 4x - 8 = 3x + 3 \\;\\Rightarrow\\; 4x - 3x = 3 + 8 \\;\\Rightarrow\\; x = 11$$

要排除的值是 $x = -1$ 和 $x = 2$，所以 $x = 11$ 是方程的解。检验：$\\frac{4}{12} = \\frac{1}{3}$，$\\frac{3}{9} = \\frac{1}{3}$。

> **注意。** 每个分子都乘以**另一边**的分母：是 $4(x - 2)$，不是 $4(x + 1)$。数要乘到二项式的两项上；移项时要变号。使分母为零的值要排除，它们不是方程的解。`,
      ),
      generate(rng) {
        for (;;) {
          const a = rng.nonZero(-9, 9);
          const b = rng.nonZero(-9, 9);
          const p = rng.int(-9, 9);
          const q = rng.int(-9, 9);
          if (a === b || p === q) continue;
          const [P, Qb] = [bin(p), bin(q)];
          const x = Q.of(b * p - a * q, a - b);
          const work = [
            `${product(a, [Qb])} = ${product(b, [P])}`,
            `${linear(a, a * q)} = ${linear(b, b * p)}`,
            `${minus(linear(a, 0), b, "x")} = ${minus(String(b * p), a * q)}`,
            ...solvingLinear(a - b, Q.of(b * p - a * q)),
          ];
          return solutionsProblem({
            prompt: solve(`${frac(String(a), P)} = ${frac(String(b), Qb)}`),
            values: [num(x)],
            wrong: [[num(Q.of(p - q, a - b))], [num(Q.of(b * q - a * p, a - b))], [num(-p), num(-q)]],
            solution: equationSolution(
              exclusion([
                [P, num(-p)],
                [Qb, num(-q)],
              ]),
              t(
                "Cross-multiply, multiply out both sides, and gather the $x$ terms on the left:",
                "交叉相乘，把两边乘开，再把含 $x$ 的项移到左边：",
              ),
              work,
              keptNote(num(x)),
              rootCheck(num(x), fracAt(constant(a), plug(1, p, x)), fracAt(constant(b), plug(1, q, x))),
            ),
          });
        }
      },
    },
    {
      id: "rejecting-excluded-values",
      title: t("Rejecting excluded values", "舍去要排除的值"),
      explanation: t(
        `When both sides have the same denominator, multiplying both sides by it leaves the numerators equal. That is a simple linear equation, but its solution may be exactly the value that makes the denominator zero. Such a value is **extraneous**: it solves the cleared equation but not the original one, where it would mean dividing by zero, so it must be rejected.

$$\\frac{x + 1}{x - 3} = \\frac{4}{x - 3} \\;\\Rightarrow\\; x + 1 = 4 \\;\\Rightarrow\\; x = 3$$

But $x = 3$ is excluded, so this equation has no solution. With a different numerator, say $\\frac{x + 1}{x - 3} = \\frac{6}{x - 3}$, the result $x = 5$ is allowed and is the solution.

> **Watch out.** Compare the result with the excluded value before giving it. If they are the same, the answer is no solution: do not report the excluded value, alone or together with another number. And solve the equation of the numerators, not of the denominator.`,
        `当两边分母相同时，两边同乘这个分母，得到分子相等。这是一个简单的一次方程，但它的解可能正好是使分母为零的值。这样的值是**增根**：它满足去分母后的方程，却不满足原方程（在原方程中它意味着除以零），所以必须舍去。

$$\\frac{x + 1}{x - 3} = \\frac{4}{x - 3} \\;\\Rightarrow\\; x + 1 = 4 \\;\\Rightarrow\\; x = 3$$

但 $x = 3$ 是要排除的值，所以这个方程无解。换一个分子，例如 $\\frac{x + 1}{x - 3} = \\frac{6}{x - 3}$，得到的 $x = 5$ 是允许的值，它就是方程的解。

> **注意。** 给出结果之前，要把它和要排除的值比较。如果两者相同，答案是无解：不要写出这个要排除的值，无论是单独写还是和别的数写在一起。要解的是分子相等的方程，不是分母等于零的方程。`,
      ),
      generate(rng) {
        for (;;) {
          const p = rng.pick([1, 1, 2, 3, -1, -2]);
          const q = rng.nonZero(-9, 9);
          const r = rng.int(-12, 12);
          const excluded = rng.bool(0.45);
          const s = excluded ? r - p * q : rng.int(-15, 15);
          if (s === 0 || (!excluded && s === r - p * q)) continue;
          const N = linear(p, r);
          const D = bin(q);
          const left = rng.bool(0.75);
          const eq = left ? `${frac(N, D)} = ${frac(String(s), D)}` : `${frac(String(s), D)} = ${frac(N, D)}`;
          const x = Q.of(s - r, p);
          const work = [`${N} = ${s}`, ...solvingLinear(p, Q.of(s - r))];
          const note = excluded ? excludedNote(num(-q)) : keptNote(num(x));
          const sides: readonly [string, string] = excluded
            ? ["", ""]
            : [fracAt(plug(p, r, x), plug(1, q, x)), fracAt(constant(s), plug(1, q, x))];
          return solutionsProblem({
            prompt: solve(eq),
            values: excluded ? [] : [num(x)],
            wrong: excluded ? [[num(-q)], [num(-q), num(Q.of(s + r, p))]] : [[num(-q)], [num(x), num(-q)], [num(Q.of(s + r, p))]],
            solution: equationSolution(
              exclusion([[D, num(-q)]]),
              t(
                `Both sides have the denominator $${D}$. Multiply both sides by it, which leaves the numerators equal:`,
                `两边的分母都是 $${D}$。两边同乘这个分母，得到分子相等：`,
              ),
              work,
              note,
              excluded
                ? extraneousCheck(num(-q), plug(1, q, Q.of(-q))[0])
                : rootCheck(num(x), left ? sides[0] : sides[1], left ? sides[1] : sides[0]),
            ),
          });
        }
      },
    },
  ],
};

/** gathered writes the step that moves the x terms of (kl)x + cl = (kr)x + cr to the left and the numbers to the right. */
const gathered = (kl: number, cl: number, kr: number, cr: number) => `${poly([kl, "x"], [-kr, "x"])} = ${poly([cr, ""], [-cl, ""])}`;

export const rationalEquationsContainingBinomials: TopicDef = {
  id: "rational-equations-containing-binomials",
  title: t("Solving Rational Equations Containing Binomials Using Cross-Multiplication", "用交叉相乘解含二项式的分式方程"),
  summary: t(
    "Cross-multiply when numerators and denominators are binomials, multiply out the products, and solve the resulting linear or square-root equation.",
    "分子分母都是二项式时交叉相乘，展开乘积，再解得到的一次方程或用开平方解方程。",
  ),
  prerequisites: ["rational-equations-using-cross-multiplication", "multiplying-binomials", "solving-equations-with-square-roots"],
  encompasses: [
    { topic: "rational-equations-using-cross-multiplication", weight: 0.6 },
    { topic: "multiplying-binomials", weight: 0.4 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.3 },
    { topic: "solving-equations-with-square-roots", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.REI.A.2"],
  intro: t(
    `Cross-multiplying turns $\\frac{a}{b} = \\frac{c}{d}$ into $ad = bc$, and we can multiply two binomials. When the numerators are binomials too, cross-multiplying gives a product of binomials on each side:

$$\\frac{x + 1}{x - 2} = \\frac{x + 4}{x + 3} \\quad\\Rightarrow\\quad (x + 1)(x + 3) = (x + 4)(x - 2).$$

That looks like a quadratic equation, but multiply out first: $x^{2} + 4x + 3 = x^{2} + 2x - 8$. Both sides have the same $x^{2}$ term, and subtracting $x^{2}$ from both sides removes it, leaving the linear equation $4x + 3 = 2x - 8$, so $2x = -11$ and $x = -\\frac{11}{2}$. As always, the denominators exclude $x = 2$ and $x = -3$, and the answer is neither.

The squares do not always cancel. When $x$ sits in a numerator on one side and in a denominator on the other, as in $\\frac{x + 1}{4} = \\frac{9}{x + 1}$, cross-multiplying gives $(x + 1)^{2} = 36$, which is solved with square roots and can have two solutions, or none.

In this lesson we solve binomials over binomials, then the same with leading coefficients, and finally the equations whose squares do not cancel.`,
    `交叉相乘把 $\\frac{a}{b} = \\frac{c}{d}$ 变成 $ad = bc$，而我们会做两个二项式的乘法。当分子也是二项式时，交叉相乘后每一边都是二项式的乘积：

$$\\frac{x + 1}{x - 2} = \\frac{x + 4}{x + 3} \\quad\\Rightarrow\\quad (x + 1)(x + 3) = (x + 4)(x - 2).$$

这看起来像二次方程，但先把它乘开：$x^{2} + 4x + 3 = x^{2} + 2x - 8$。两边的 $x^{2}$ 项相同，两边同减 $x^{2}$ 就把它消去了，剩下一次方程 $4x + 3 = 2x - 8$，所以 $2x = -11$，$x = -\\frac{11}{2}$。和以前一样，分母排除 $x = 2$ 和 $x = -3$，而答案不是其中任何一个。

平方项并不总能抵消。当 $x$ 在一边的分子中、又在另一边的分母中时，例如 $\\frac{x + 1}{4} = \\frac{9}{x + 1}$，交叉相乘得 $(x + 1)^{2} = 36$，要用开平方来解，可能有两个解，也可能无解。

这节课我们先解二项式除以二项式的方程，再解首项系数不为 1 的情形，最后解平方项不抵消的方程。`,
  ),
  knowledgePoints: [
    {
      id: "binomial-numerators",
      title: t("Binomials over binomials", "二项式除以二项式"),
      explanation: t(
        `Cross-multiplying binomials gives a product of two binomials on each side. Multiply each product out completely, every term of one binomial times every term of the other. When both $x$ coefficients are $1$, both products start with $x^{2}$, so subtracting $x^{2}$ from both sides cancels the squares and leaves a linear equation:

$$\\frac{x + 1}{x - 2} = \\frac{x + 4}{x + 3} \\;\\Rightarrow\\; (x + 1)(x + 3) = (x + 4)(x - 2)$$

$$x^{2} + 4x + 3 = x^{2} + 2x - 8 \\;\\Rightarrow\\; 4x + 3 = 2x - 8 \\;\\Rightarrow\\; 2x = -11 \\;\\Rightarrow\\; x = -\\frac{11}{2}$$

The excluded values are $x = 2$ and $x = -3$, so $x = -\\frac{11}{2}$ is the solution.

> **Watch out.** Pair each numerator with the **other** side's denominator: $(x + 1)(x + 3)$, not $(x + 1)(x + 4)$. Expand both products fully, middle terms included, and keep the sign when dividing at the end. The values that make a denominator zero are excluded, never solutions.`,
        `二项式交叉相乘后，每一边都是两个二项式的乘积。把每个乘积完全展开：一个二项式的每一项都要乘另一个二项式的每一项。当两个 $x$ 的系数都是 $1$ 时，两个乘积都以 $x^{2}$ 开头，两边同减 $x^{2}$ 就消去平方项，剩下一个一次方程：

$$\\frac{x + 1}{x - 2} = \\frac{x + 4}{x + 3} \\;\\Rightarrow\\; (x + 1)(x + 3) = (x + 4)(x - 2)$$

$$x^{2} + 4x + 3 = x^{2} + 2x - 8 \\;\\Rightarrow\\; 4x + 3 = 2x - 8 \\;\\Rightarrow\\; 2x = -11 \\;\\Rightarrow\\; x = -\\frac{11}{2}$$

要排除的值是 $x = 2$ 和 $x = -3$，所以 $x = -\\frac{11}{2}$ 是方程的解。

> **注意。** 每个分子要和**另一边**的分母配对：是 $(x + 1)(x + 3)$，不是 $(x + 1)(x + 4)$。两个乘积都要完全展开，中间项也不能漏；最后相除时符号要保留。使分母为零的值要排除，它们永远不是方程的解。`,
      ),
      keyPrerequisites: ["multiplying-binomials"],
      generate(rng) {
        for (;;) {
          const [a, b, c, d] = [rng.int(-9, 9), rng.nonZero(-9, 9), rng.int(-9, 9), rng.nonZero(-9, 9)];
          const k = a + d - b - c;
          if (a === b || c === d || b === d || k === 0) continue;
          const x = Q.of(b * c - a * d, k);
          const quad = (u: number, v: number) => poly([1, "x^{2}"], [u + v, "x"], [u * v, ""]);
          const work = [
            `${grp(bin(a))}${grp(bin(d))} = ${grp(bin(c))}${grp(bin(b))}`,
            `${quad(a, d)} = ${quad(c, b)}`,
            `${linear(a + d, a * d)} = ${linear(b + c, b * c)}`,
            gathered(a + d, a * d, b + c, b * c),
            ...solvingLinear(k, Q.of(b * c - a * d)),
          ];
          const k2 = a + c - b - d;
          return solutionsProblem({
            prompt: solve(`${frac(bin(a), bin(b))} = ${frac(bin(c), bin(d))}`),
            values: [num(x)],
            wrong: [
              [num(x.neg())],
              ...(k2 !== 0 ? [[num(Q.of(b * d - a * c, k2))]] : []),
              ...(a - b - c !== 0 ? [[num(Q.of(b * c - a * d, a - b - c))]] : []),
              [num(-b), num(-d)],
            ],
            solution: equationSolution(
              exclusion([
                [bin(b), num(-b)],
                [bin(d), num(-d)],
              ]),
              t(
                "Cross-multiply and multiply out both products. Both start with $x^{2}$, so subtracting $x^{2}$ from both sides cancels it; then gather the $x$ terms on the left:",
                "交叉相乘，把两个乘积展开。两边都以 $x^{2}$ 开头，两边同减 $x^{2}$ 就把它消去；再把含 $x$ 的项移到左边：",
              ),
              work,
              keptNote(num(x)),
              rootCheck(num(x), fracAt(plug(1, a, x), plug(1, b, x)), fracAt(plug(1, c, x), plug(1, d, x))),
            ),
          });
        }
      },
    },
    {
      id: "leading-coefficients",
      title: t("Leading coefficients", "首项系数不为 1"),
      explanation: t(
        `With coefficients on $x$, cross-multiply the same way and multiply every pair of terms carefully: the $x^{2}$ term is the product of the two $x$ coefficients, and the middle term collects two products. When the two $x^{2}$ terms are equal, they still cancel:

$$\\frac{2x - 1}{x + 3} = \\frac{2x + 5}{x - 1} \\;\\Rightarrow\\; (2x - 1)(x - 1) = (2x + 5)(x + 3)$$

$$2x^{2} - 3x + 1 = 2x^{2} + 11x + 15 \\;\\Rightarrow\\; -3x - 11x = 15 - 1 \\;\\Rightarrow\\; -14x = 14 \\;\\Rightarrow\\; x = -1$$

The excluded values are $x = -3$ and $x = 1$, so $x = -1$ is the solution. Check: $\\frac{-3}{2} = \\frac{3}{-2}$.

> **Watch out.** The middle term has two parts: in $(2x - 1)(x - 1)$ it is $-2x - x = -3x$, so do not keep just one of them. Pair each numerator with the other side's denominator, and keep the minus sign when dividing by a negative coefficient. The excluded values are never solutions.`,
        `$x$ 有系数时，同样交叉相乘，并仔细地把每一对项都相乘：$x^{2}$ 项是两个 $x$ 系数之积，中间项由两个乘积合成。两边 $x^{2}$ 项相同时仍然抵消：

$$\\frac{2x - 1}{x + 3} = \\frac{2x + 5}{x - 1} \\;\\Rightarrow\\; (2x - 1)(x - 1) = (2x + 5)(x + 3)$$

$$2x^{2} - 3x + 1 = 2x^{2} + 11x + 15 \\;\\Rightarrow\\; -3x - 11x = 15 - 1 \\;\\Rightarrow\\; -14x = 14 \\;\\Rightarrow\\; x = -1$$

要排除的值是 $x = -3$ 和 $x = 1$，所以 $x = -1$ 是方程的解。检验：$\\frac{-3}{2} = \\frac{3}{-2}$。

> **注意。** 中间项由两部分组成：在 $(2x - 1)(x - 1)$ 中是 $-2x - x = -3x$，不能只留一部分。每个分子要和另一边的分母配对；除以负的系数时负号要保留。要排除的值永远不是方程的解。`,
      ),
      generate(rng) {
        for (;;) {
          const m = rng.pick([2, 3, 4, -2, -1, 1]);
          const n = rng.pick([1, 1, 2, 3]);
          const k = rng.pick([1, 1, 2]);
          if (Math.abs(m) === 1 && n === 1 && k === 1) continue;
          const [a, b, c, d] = [rng.int(-9, 9), rng.nonZero(-9, 9), rng.int(-9, 9), rng.nonZero(-9, 9)];
          if (gcd(n, b) !== 1 || gcd(k * n, d) !== 1 || a * n === m * b || c * n === m * d) continue;
          const den = m * d + a * k * n - k * m * b - c * n;
          if (den === 0) continue;
          const x = Q.of(c * b - a * d, den);
          if (x.eq(Q.of(-b, n)) || x.eq(Q.of(-d, k * n))) continue;
          const [L1, D1, L2, D2] = [linear(m, a), linear(n, b), linear(k * m, c), linear(k * n, d)];
          const work = [
            `(${L1})(${D2}) = (${L2})(${D1})`,
            `${poly([k * m * n, "x^{2}"], [m * d + a * k * n, "x"], [a * d, ""])} = ${poly([k * m * n, "x^{2}"], [k * m * b + c * n, "x"], [c * b, ""])}`,
            `${linear(m * d + a * k * n, a * d)} = ${linear(k * m * b + c * n, c * b)}`,
            gathered(m * d + a * k * n, a * d, k * m * b + c * n, c * b),
            ...solvingLinear(den, Q.of(c * b - a * d)),
          ];
          const den2 = m * d - k * m * b;
          return solutionsProblem({
            prompt: solve(`${frac(L1, D1)} = ${frac(L2, D2)}`),
            values: [num(x)],
            wrong: [[num(x.neg())], ...(den2 !== 0 ? [[num(Q.of(c * b - a * d, den2))]] : []), [num(Q.of(-b, n)), num(Q.of(-d, k * n))]],
            solution: equationSolution(
              exclusion([
                [D1, num(Q.of(-b, n))],
                [D2, num(Q.of(-d, k * n))],
              ]),
              t(
                `Cross-multiply and multiply out every pair of terms. Both products have the term $${poly([k * m * n, "x^{2}"])}$, which cancels; then gather the $x$ terms on the left:`,
                `交叉相乘，把每一对项都相乘。两个乘积都有 $${poly([k * m * n, "x^{2}"])}$ 这一项，它被消去；再把含 $x$ 的项移到左边：`,
              ),
              work,
              keptNote(num(x)),
              rootCheck(num(x), fracAt(plug(m, a, x), plug(n, b, x)), fracAt(plug(k * m, c, x), plug(k * n, d, x))),
            ),
          });
        }
      },
    },
    {
      id: "squares-that-do-not-cancel",
      title: t("When the squares do not cancel", "平方项不抵消时"),
      explanation: t(
        `If the variable appears in a numerator on one side and in the denominator on the other, cross-multiplying puts the same binomial on both sides of one product, which is a square. Nothing cancels it, so solve with square roots: a square equal to a positive number $r^{2}$ means the binomial is $r$ or $-r$.

$$\\frac{x + 1}{4} = \\frac{9}{x + 1} \\;\\Rightarrow\\; (x + 1)^{2} = 36 \\;\\Rightarrow\\; x + 1 = \\pm 6 \\;\\Rightarrow\\; x = 5 \\text{ or } x = -7$$

Neither value is the excluded $x = -1$, so both are solutions. If the square must equal a negative number, there is no solution, since no real square is negative.

Excluded values matter here too. In $\\frac{x^{2}}{x - 2} = \\frac{4}{x - 2}$, $x^{2} = 4$ gives $x = \\pm 2$, but $x = 2$ is excluded, so the only solution is $x = -2$.

> **Watch out.** A square root gives **two** values, $\\pm 6$, so do not stop at the positive one. Undo the shift with the right sign: $x + 1 = 6$ gives $x = 5$, not $7$. Take the square root of the product rather than stopping at $36$, and reject any value that makes a denominator zero while keeping the other.`,
        `如果未知数在一边的分子中、又在另一边的分母中，交叉相乘后同一个二项式出现在同一个乘积里，也就是一个平方。没有东西能把它消去，所以用开平方来解：平方等于正数 $r^{2}$，意味着这个二项式等于 $r$ 或 $-r$。

$$\\frac{x + 1}{4} = \\frac{9}{x + 1} \\;\\Rightarrow\\; (x + 1)^{2} = 36 \\;\\Rightarrow\\; x + 1 = \\pm 6 \\;\\Rightarrow\\; x = 5 \\text{ 或 } x = -7$$

两个值都不是要排除的 $x = -1$，所以都是方程的解。如果平方要等于负数，方程无解，因为实数的平方不会是负数。

这里也要注意要排除的值。在 $\\frac{x^{2}}{x - 2} = \\frac{4}{x - 2}$ 中，由 $x^{2} = 4$ 得 $x = \\pm 2$，但 $x = 2$ 要排除，所以唯一的解是 $x = -2$。

> **注意。** 开平方得到**两个**值 $\\pm 6$，不要只取正的那个。去掉平移时符号要对：由 $x + 1 = 6$ 得 $x = 5$，不是 $7$。要对乘积开平方，不能停在 $36$；使分母为零的值要舍去，另一个要保留。`,
      ),
      keyPrerequisites: ["solving-equations-with-square-roots"],
      generate(rng) {
        const kind = rng.pick(["basic", "shifted", "shifted", "none", "excluded"] as const);
        if (kind === "excluded") {
          const c = rng.nonZero(-9, 9);
          const D = bin(-c);
          const squareFirst = rng.bool();
          const eq = squareFirst ? `${frac("x^{2}", D)} = ${frac(String(c * c), D)}` : `${frac(String(c * c), D)} = ${frac("x^{2}", D)}`;
          const root = Q.of(-c);
          const sides = [fracAt([`(${-c})^{2}`, Q.of(c * c)], plug(1, -c, root)), fracAt(constant(c * c), plug(1, -c, root))] as const;
          return solutionsProblem({
            prompt: solve(eq),
            values: [num(-c)],
            wrong: [[num(c), num(-c)], [num(c)], []],
            solution: equationSolution(
              exclusion([[D, String(c)]]),
              t(
                `Both sides have the denominator $${D}$. Multiply both sides by it, then take square roots:`,
                `两边的分母都是 $${D}$。两边同乘这个分母，再开平方：`,
              ),
              [`x^{2} = ${c * c}`, `x = \\pm ${Math.abs(c)}`],
              t(
                `But $x = ${c}$ makes the denominator zero, so it is rejected, and the only solution is $x = ${-c}$.`,
                `但 $x = ${c}$ 使分母为零，要舍去，所以唯一的解是 $x = ${-c}$。`,
              ),
              rootCheck(num(root), squareFirst ? sides[0] : sides[1], squareFirst ? sides[1] : sides[0]),
            ),
          });
        }
        const r = rng.int(1, 9);
        const divisors = Array.from({ length: r * r }, (_, i) => i + 1).filter((v) => (r * r) % v === 0 && v <= 30 && (r * r) / v <= 30);
        const b0 = rng.pick(divisors);
        const sg = rng.bool(0.25) ? -1 : 1;
        const b = sg * b0;
        const c = kind === "none" ? (-sg * r * r) / b0 : (sg * r * r) / b0;
        const a = kind === "basic" ? 0 : rng.nonZero(-9, 9);
        const u = bin(a);
        const eq = `${frac(u, String(b))} = ${frac(String(c), u)}`;
        const sq = a === 0 ? "x^{2}" : `(${u})^{2}`;
        const excluded = exclusion([[u, num(-a)]]);
        if (kind === "none") {
          return solutionsProblem({
            prompt: solve(eq),
            values: [],
            wrong: [[num(-a + r), num(-a - r)], [num(-a)]],
            solution: equationSolution(
              excluded,
              t("Cross-multiply:", "交叉相乘："),
              [`${sq} = ${b * c}`],
              t(
                `No real number has a negative square, so there is no solution, $\\varnothing$.`,
                `任何实数的平方都不是负数，所以方程无解：$\\varnothing$。`,
              ),
              null,
            ),
          });
        }
        const values = [num(-a + r), num(-a - r)];
        const work = [`${sq} = ${b * c}`, `${u} = \\pm ${r}`, ...(a === 0 ? [] : [`x = ${-a} \\pm ${r}`])];
        const at = (v: number) => [fracAt(plug(1, a, Q.of(v)), constant(b)), fracAt(constant(c), plug(1, a, Q.of(v)))] as const;
        const [l1, r1] = at(-a + r);
        const [l2, r2] = at(-a - r);
        return solutionsProblem({
          prompt: solve(eq),
          values,
          wrong: [[num(-a + r)], [num(a + r), num(a - r)], [num(b * c - a)]],
          solution: t(
            `${equationSolution(excluded, t("Cross-multiply, then take square roots:", "交叉相乘，再开平方："), work, t(`Neither value is $${num(-a)}$, so $x = ${values[0]}$ or $x = ${values[1]}$.`, `两个值都不是 $${num(-a)}$，所以 $x = ${values[0]}$ 或 $x = ${values[1]}$。`), null).en}

**Check.** Put each value into both sides. At $x = ${values[0]}$:${steps(l1, r1)}At $x = ${values[1]}$:${steps(l2, r2)}`,
            `${equationSolution(excluded, t("Cross-multiply, then take square roots:", "交叉相乘，再开平方："), work, t(`Neither value is $${num(-a)}$, so $x = ${values[0]}$ or $x = ${values[1]}$.`, `两个值都不是 $${num(-a)}$，所以 $x = ${values[0]}$ 或 $x = ${values[1]}$。`), null)["zh-CN"]}

**检验。** 把每个值分别代入两边。$x = ${values[0]}$ 时：${steps(l1, r1)}$x = ${values[1]}$ 时：${steps(l2, r2)}`,
          ),
        });
      },
    },
  ],
};

export const rationalEquationsUsingTheFlipMethod: TopicDef = {
  id: "rational-equations-using-the-flip-method",
  title: t("Solving Rational Equations Using the Flip Method", "用取倒数法解分式方程"),
  summary: t(
    "Solve equations whose variable is only in a denominator by taking reciprocals of both sides.",
    "对两边取倒数，解未知数只在分母中的方程。",
  ),
  prerequisites: ["rational-equations-using-cross-multiplication"],
  encompasses: [{ topic: "rational-equations-with-one-fractional-term", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSA.REI.A.2"],
  intro: t(
    `We can solve $\\frac{a}{b} = \\frac{c}{d}$ by cross-multiplying. When the variable is only in a denominator, there is a quicker way. If two numbers are equal and not zero, their reciprocals are equal too: from $u = v$ we get $\\frac{1}{u} = \\frac{1}{v}$. The reciprocal of a fraction is the fraction turned upside down, so **flipping** both sides of the equation is allowed, and it brings the variable up into a numerator:

$$\\frac{4}{2x + 1} = \\frac{2}{3} \\quad\\Rightarrow\\quad \\frac{2x + 1}{4} = \\frac{3}{2}.$$

Now multiplying by $4$ gives $2x + 1 = 6$, so $x = \\frac{5}{2}$. The denominator $2x + 1$ excludes $x = -\\frac{1}{2}$, which is not the answer, and putting $x = \\frac{5}{2}$ back confirms it: $\\frac{4}{6} = \\frac{2}{3}$.

Flipping needs both sides to be nonzero. A fraction with a nonzero numerator is never $0$, so an equation such as $\\frac{6}{x - 1} = 0$ has no solution at all. In this lesson we flip fractions, whole numbers, which are fractions over $1$, and fractions with the variable in both parts, which we split after flipping.`,
    `我们会用交叉相乘解 $\\frac{a}{b} = \\frac{c}{d}$。当未知数只在分母中时，还有更快的方法。如果两个数相等且不为零，它们的倒数也相等：由 $u = v$ 得 $\\frac{1}{u} = \\frac{1}{v}$。分数的倒数就是把它上下颠倒，所以可以把方程两边都**取倒数**，这样未知数就到了分子上：

$$\\frac{4}{2x + 1} = \\frac{2}{3} \\quad\\Rightarrow\\quad \\frac{2x + 1}{4} = \\frac{3}{2}.$$

再乘以 $4$ 得 $2x + 1 = 6$，所以 $x = \\frac{5}{2}$。分母 $2x + 1$ 排除 $x = -\\frac{1}{2}$，它不是答案；把 $x = \\frac{5}{2}$ 代回去可以确认：$\\frac{4}{6} = \\frac{2}{3}$。

取倒数要求两边都不为零。分子不为零的分式永远不等于 $0$，所以像 $\\frac{6}{x - 1} = 0$ 这样的方程根本无解。这节课我们对分数取倒数，对整数（分母为 $1$ 的分数）取倒数，还要处理分子分母都含未知数的分式：取倒数后再拆开。`,
  ),
  knowledgePoints: [
    {
      id: "flipping-both-sides",
      title: t("Flipping both sides", "两边取倒数"),
      explanation: t(
        `If two nonzero numbers are equal, so are their reciprocals: $\\frac{a}{b} = \\frac{c}{d}$ gives $\\frac{b}{a} = \\frac{d}{c}$. When the variable is only in a denominator, flipping both sides brings it to a numerator. Then multiply by the new denominator and solve:

$$\\frac{4}{2x + 1} = \\frac{2}{3} \\;\\Rightarrow\\; \\frac{2x + 1}{4} = \\frac{3}{2} \\;\\Rightarrow\\; 2x + 1 = 4 \\cdot \\frac{3}{2} = 6 \\;\\Rightarrow\\; 2x = 5 \\;\\Rightarrow\\; x = \\frac{5}{2}$$

The excluded value is $x = -\\frac{1}{2}$, and $\\frac{5}{2}$ is not it.

> **Watch out.** Flip **both** sides, never just one: $\\frac{2x + 1}{4} = \\frac{2}{3}$ is a different equation. After flipping, multiply by $4$ rather than dividing, and finish the linear equation: $2x + 1 = 6$ still needs the $1$ moved and the $2$ divided out.`,
        `如果两个不为零的数相等，它们的倒数也相等：由 $\\frac{a}{b} = \\frac{c}{d}$ 得 $\\frac{b}{a} = \\frac{d}{c}$。当未知数只在分母中时，两边取倒数就把它移到了分子上。然后乘以新的分母，再解方程：

$$\\frac{4}{2x + 1} = \\frac{2}{3} \\;\\Rightarrow\\; \\frac{2x + 1}{4} = \\frac{3}{2} \\;\\Rightarrow\\; 2x + 1 = 4 \\cdot \\frac{3}{2} = 6 \\;\\Rightarrow\\; 2x = 5 \\;\\Rightarrow\\; x = \\frac{5}{2}$$

要排除的值是 $x = -\\frac{1}{2}$，而 $\\frac{5}{2}$ 不是它。

> **注意。** **两边**都要取倒数，不能只取一边：$\\frac{2x + 1}{4} = \\frac{2}{3}$ 是另一个方程。取倒数后要乘以 $4$，而不是除以 $4$；一次方程也要解完：$2x + 1 = 6$ 还要移走 $1$、再除以 $2$。`,
      ),
      keyPrerequisites: ["dividing-fractions"],
      generate(rng) {
        for (;;) {
          const a = rng.nonZero(-12, 12);
          const b = rng.nonZero(-9, 9);
          const c = rng.int(2, 9);
          const m = rng.int(2, 5);
          const p = rng.nonZero(-9, 9);
          if (gcd(b, c) !== 1) continue;
          const L = linear(m, p);
          const v = Q.of(a * c, b);
          const x = v.sub(Q.of(p)).div(Q.of(m));
          const work = [
            ...(a === 1
              ? [`${L} = ${num(v)}`]
              : [`${frac(L, String(a))} = ${num(Q.of(c, b))}`, `${L} = ${cdot(String(a), num(Q.of(c, b)))} = ${num(v)}`]),
            ...solvingLinear(m, v.sub(Q.of(p))),
          ];
          return solutionsProblem({
            prompt: solve(`${frac(String(a), L)} = ${num(Q.of(b, c))}`),
            values: [num(x)],
            wrong: [
              [
                num(
                  Q.of(a * b, c)
                    .sub(Q.of(p))
                    .div(Q.of(m)),
                ),
              ],
              [num(v.sub(Q.of(p)))],
              [
                num(
                  Q.of(c, a * b)
                    .sub(Q.of(p))
                    .div(Q.of(m)),
                ),
              ],
            ],
            solution: equationSolution(
              exclusion([[L, num(Q.of(-p, m))]]),
              t(
                `Neither side is zero, so flip both sides${a === 1 ? "" : `, then multiply both sides by $${a}$`}:`,
                `两边都不为零，所以两边取倒数${a === 1 ? "" : `，再两边同乘 $${a}$`}：`,
              ),
              work,
              keptNote(num(x)),
              rootCheck(num(x), fracAt(constant(a), plug(m, p, x)), num(Q.of(b, c))),
            ),
          });
        }
      },
    },
    {
      id: "a-whole-number-side",
      title: t("A whole number on one side", "一边是整数"),
      explanation: t(
        `A whole number $c$ is the fraction $\\frac{c}{1}$, so its reciprocal is $\\frac{1}{c}$. Flip both sides, then multiply by the new denominator:

$$\\frac{6}{x - 1} = 4 \\;\\Rightarrow\\; \\frac{x - 1}{6} = \\frac{1}{4} \\;\\Rightarrow\\; x - 1 = \\frac{6}{4} = \\frac{3}{2} \\;\\Rightarrow\\; x = \\frac{5}{2}$$

The excluded value is $x = 1$, and $\\frac{5}{2}$ is not it: $\\frac{6}{3/2} = 4$.

$0$ has no reciprocal, so flipping fails when one side is $0$. But then the answer is clear: a fraction with a nonzero number as numerator is never $0$, so an equation such as $\\frac{6}{x - 1} = 0$ has no solution.

> **Watch out.** The reciprocal of $4$ is $\\frac{1}{4}$, not $4$: writing $x - 1 = 6 \\cdot 4$ forgets to flip the whole number. Do not flip the fraction the wrong way round ($x - 1 = \\frac{4}{6}$) either. And when the right side is $0$, there is no solution; neither $0$ nor the excluded value is one.`,
        `整数 $c$ 就是分数 $\\frac{c}{1}$，所以它的倒数是 $\\frac{1}{c}$。两边取倒数，再乘以新的分母：

$$\\frac{6}{x - 1} = 4 \\;\\Rightarrow\\; \\frac{x - 1}{6} = \\frac{1}{4} \\;\\Rightarrow\\; x - 1 = \\frac{6}{4} = \\frac{3}{2} \\;\\Rightarrow\\; x = \\frac{5}{2}$$

要排除的值是 $x = 1$，而 $\\frac{5}{2}$ 不是它：$\\frac{6}{3/2} = 4$。

$0$ 没有倒数，所以一边是 $0$ 时不能取倒数。但这时答案很清楚：分子是不为零的数的分式永远不等于 $0$，所以像 $\\frac{6}{x - 1} = 0$ 这样的方程无解。

> **注意。** $4$ 的倒数是 $\\frac{1}{4}$，不是 $4$：写成 $x - 1 = 6 \\cdot 4$ 是忘了给整数取倒数。也不要把分数倒错（写成 $x - 1 = \\frac{4}{6}$）。右边是 $0$ 时方程无解；$0$ 和要排除的值都不是解。`,
      ),
      generate(rng) {
        const zero = rng.bool(0.2);
        const a = rng.nonZero(-24, 24);
        const c = zero ? 0 : rng.nonZero(-8, 8);
        const m = rng.pick([1, 1, 2, 3, 4]);
        const p = rng.nonZero(-9, 9);
        const L = linear(m, p);
        const eq = `${frac(String(a), L)} = ${c}`;
        const excluded = exclusion([[L, num(Q.of(-p, m))]]);
        if (zero) {
          return solutionsProblem({
            prompt: solve(eq),
            values: [],
            wrong: [[num(Q.of(-p, m))], ["0"]],
            solution: equationSolution(
              excluded,
              t(
                "The right side is $0$, which has no reciprocal, so flipping is not possible. Look at the numerator instead.",
                "右边是 $0$，它没有倒数，所以不能取倒数。改为看分子。",
              ),
              [],
              t(
                `A fraction is $0$ only when its numerator is $0$, and the numerator here is $${a}$. So the equation has no solution, $\\varnothing$.`,
                `分式只有在分子为 $0$ 时才等于 $0$，而这里分子是 $${a}$。所以方程无解：$\\varnothing$。`,
              ),
              null,
            ),
          });
        }
        const v = Q.of(a, c);
        const x = v.sub(Q.of(p)).div(Q.of(m));
        const work = [
          ...(a === 1 ? [] : [`${frac(L, String(a))} = ${num(Q.of(1, c))}`]),
          `${L} = ${num(v)}`,
          ...solvingLinear(m, v.sub(Q.of(p))),
        ];
        return solutionsProblem({
          prompt: solve(eq),
          values: [num(x)],
          wrong: [[num(Q.of(a * c - p, m))], [num(Q.of(c, a).sub(Q.of(p)).div(Q.of(m)))], [num(Q.of(-p, m))]],
          solution: equationSolution(
            excluded,
            t(
              `Write $${c}$ as $${frac(String(c), "1")}$ and flip both sides${a === 1 ? "" : `, then multiply both sides by $${a}$`}:`,
              `把 $${c}$ 写成 $${frac(String(c), "1")}$，两边取倒数${a === 1 ? "" : `，再两边同乘 $${a}$`}：`,
            ),
            work,
            keptNote(num(x)),
            rootCheck(num(x), fracAt(constant(a), plug(m, p, x)), String(c)),
          ),
        });
      },
    },
    {
      id: "flipping-and-splitting",
      title: t("Flipping, then splitting", "取倒数后再拆分"),
      explanation: t(
        `When the variable is in both the numerator and the denominator, flipping alone does not isolate it. Flip both sides, then split the fraction, since a sum over $x$ is one fraction per term and $\\frac{x}{x} = 1$. Now the variable appears only once:

$$\\frac{x}{x + 3} = \\frac{2}{5} \\;\\Rightarrow\\; \\frac{x + 3}{x} = \\frac{5}{2} \\;\\Rightarrow\\; 1 + \\frac{3}{x} = \\frac{5}{2} \\;\\Rightarrow\\; \\frac{3}{x} = \\frac{3}{2} \\;\\Rightarrow\\; x = 2$$

The last step flips again: $\\frac{x}{3} = \\frac{2}{3}$. The excluded value is $x = -3$, and $2$ is not it: $\\frac{2}{5} = \\frac{2}{5}$.

If the fraction left alone must equal $0$, as happens for $\\frac{x}{x + 3} = 1$, there is no solution.

> **Watch out.** After splitting, subtract the $1$ before flipping again: $\\frac{3}{x} = \\frac{3}{2}$, not $\\frac{3}{x} = \\frac{5}{2}$. Keep the sign of the answer, and do not stop at the excluded value $-3$ or at $\\frac{2}{5} \\cdot 3$, which forgets the splitting.`,
        `当未知数同时在分子和分母中时，只取倒数还不能把它分离出来。两边取倒数，再把分式拆开：和除以 $x$ 等于每一项各除以 $x$，而 $\\frac{x}{x} = 1$。这样未知数就只出现一次了：

$$\\frac{x}{x + 3} = \\frac{2}{5} \\;\\Rightarrow\\; \\frac{x + 3}{x} = \\frac{5}{2} \\;\\Rightarrow\\; 1 + \\frac{3}{x} = \\frac{5}{2} \\;\\Rightarrow\\; \\frac{3}{x} = \\frac{3}{2} \\;\\Rightarrow\\; x = 2$$

最后一步再次取倒数：$\\frac{x}{3} = \\frac{2}{3}$。要排除的值是 $x = -3$，而 $2$ 不是它：$\\frac{2}{5} = \\frac{2}{5}$。

如果最后剩下的分式要等于 $0$（例如 $\\frac{x}{x + 3} = 1$ 时），方程无解。

> **注意。** 拆开以后，要先减去 $1$ 再取倒数：是 $\\frac{3}{x} = \\frac{3}{2}$，不是 $\\frac{3}{x} = \\frac{5}{2}$。答案的符号要保留，也不要停在要排除的值 $-3$，或者忘了拆分而得到 $\\frac{2}{5} \\cdot 3$。`,
      ),
      keyPrerequisites: ["equivalent-expressions-with-fractions"],
      generate(rng) {
        for (;;) {
          const p = rng.nonZero(-9, 9);
          const none = rng.bool(0.15);
          const b = none ? 1 : rng.nonZero(-9, 9);
          const c = none ? 1 : rng.int(1, 9);
          if (gcd(b, c) !== 1 || (!none && b === c)) continue;
          const r = Q.of(b, c);
          const inv = Q.of(c, b);
          const rest = inv.sub(Q.one);
          const D = bin(p);
          const split = `1 ${p < 0 ? "-" : "+"} ${frac(String(Math.abs(p)), "x")} = ${num(inv)}`;
          const eq = `${frac("x", D)} = ${num(r)}`;
          const excluded = exclusion([[D, num(-p)]]);
          const how = t(
            "Flip both sides, split the fraction into $1$ plus a fraction, and subtract $1$",
            "两边取倒数，把分式拆成 $1$ 加一个分式，再减去 $1$",
          );
          if (none) {
            return solutionsProblem({
              prompt: solve(eq),
              values: [],
              wrong: [[num(-p)], ["0"]],
              solution: equationSolution(
                excluded,
                t(`${how.en}:`, `${how["zh-CN"]}：`),
                [`${frac(D, "x")} = 1`, split, `${frac(String(p), "x")} = 0`],
                t(
                  `A fraction with numerator $${p}$ is never $0$, so the equation has no solution, $\\varnothing$.`,
                  `分子为 $${p}$ 的分式永远不等于 $0$，所以方程无解：$\\varnothing$。`,
                ),
                null,
              ),
            });
          }
          const x = Q.of(p * b, c - b);
          const work = [
            `${frac(D, "x")} = ${num(inv)}`,
            split,
            `${frac(String(p), "x")} = ${num(rest)}`,
            `${frac("x", String(p))} = ${num(Q.one.div(rest))}`,
            `x = ${num(x)}`,
          ];
          return solutionsProblem({
            prompt: solve(eq),
            values: [num(x)],
            wrong: [[num(x.neg())], [num(-p)], [num(r.mul(Q.of(p)))], [num(Q.of(p * b, c))]],
            solution: equationSolution(
              excluded,
              t(`${how.en}, then flip again and multiply by $${p}$:`, `${how["zh-CN"]}，然后再取一次倒数，乘以 $${p}$：`),
              work,
              keptNote(num(x)),
              rootCheck(num(x), fracAt(plug(1, 0, x), plug(1, p, x)), num(r)),
            ),
          });
        }
      },
    },
  ],
};

/** rationalExpressionTopics are the topics of the rational expressions and equations unit, in teaching order. */
export const rationalExpressionTopics: readonly TopicDef[] = [
  equivalentExpressionsWithFractions,
  simplifyingRationalExpressions,
  simplifyingRationalExpressionsByFactoring,
  rationalEquationsWithOneFractionalTerm,
  rationalEquationsUsingCrossMultiplication,
  rationalEquationsContainingBinomials,
  rationalEquationsUsingTheFlipMethod,
];
