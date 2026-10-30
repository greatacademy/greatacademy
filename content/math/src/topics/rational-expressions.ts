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
  "Enter all solutions separated by commas, or $\\varnothing$ if there is none.",
  "请用逗号分隔写出所有解；如果无解，请输入 $\\varnothing$。",
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
  knowledgePoints: [
    {
      id: "fractional-coefficients",
      title: t("Fractional coefficients", "分数系数"),
      explanation: t(
        "Dividing by a number is multiplying by its reciprocal, so a variable over a number is a fraction times the variable:\n\n$$\\frac{3x}{5} = \\frac{3}{5} \\cdot x = \\frac{3}{5}x \\qquad \\frac{x}{4} = \\frac{1}{4}x \\qquad -\\frac{6y}{8} = -\\frac{3}{4}y$$\n\nThe coefficient is the fraction, written in lowest terms.",
        "除以一个数等于乘以它的倒数，所以变量除以一个数就是一个分数乘以这个变量：\n\n$$\\frac{3x}{5} = \\frac{3}{5} \\cdot x = \\frac{3}{5}x \\qquad \\frac{x}{4} = \\frac{1}{4}x \\qquad -\\frac{6y}{8} = -\\frac{3}{4}y$$\n\n系数就是这个分数，要写成最简分数。",
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
        return numberProblem({
          prompt: t(`The expression $${expr}$ can be written as $k${v}$. Find $k$.`, `代数式 $${expr}$ 可以写成 $k${v}$ 的形式。求 $k$。`),
          answer: k,
          solveFor: "k",
          wrong: [s * a, Q.of(s * b, a), Q.of(s, b), s * a * b, -s * a],
          solution: t(
            `Dividing by $${b}$ is multiplying by $\\frac{1}{${b}}$:${steps(`${expr} = ${s < 0 ? "-" : ""}\\frac{${a}}{${b}} \\cdot ${v} = ${poly([k, v])}`)}So $k = ${num(k)}$.`,
            `除以 $${b}$ 等于乘以 $\\frac{1}{${b}}$：${steps(`${expr} = ${s < 0 ? "-" : ""}\\frac{${a}}{${b}} \\cdot ${v} = ${poly([k, v])}`)}所以 $k = ${num(k)}$。`,
          ),
        });
      },
    },
    {
      id: "splitting-a-fraction",
      title: t("Splitting a fraction into terms", "把分式拆成几项"),
      explanation: t(
        "A fraction whose numerator is a sum can be split into one fraction per term, because dividing a sum divides **every** term:\n\n$$\\frac{6x - 4}{8} = \\frac{6x}{8} - \\frac{4}{8} = \\frac{3}{4}x - \\frac{1}{2}$$\n\nA common mistake is to divide only one of the terms: $\\frac{6x - 4}{2}$ is $3x - 2$, not $3x - 4$.",
        "分子是和的分式可以拆成每一项各自除以分母，因为一个和除以一个数时，**每一项**都要除：\n\n$$\\frac{6x - 4}{8} = \\frac{6x}{8} - \\frac{4}{8} = \\frac{3}{4}x - \\frac{1}{2}$$\n\n常见错误是只把其中一项除以分母：$\\frac{6x - 4}{2}$ 等于 $3x - 2$，而不是 $3x - 4$。",
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
            `Divide each term of the numerator by $${c}$:${steps(`${expr} = ${split} = ${answer}`)}`,
            `把分子的每一项都除以 $${c}$：${steps(`${expr} = ${split} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "signs-in-fractions",
      title: t("Signs in fractions", "分式中的符号"),
      explanation: t(
        "A fraction has three signs: of the numerator, of the denominator, and in front of the fraction. Changing **two** of them leaves the value unchanged; changing only **one** gives the opposite:\n\n$$-\\frac{a}{b} = \\frac{-a}{b} = \\frac{a}{-b} \\qquad \\frac{-a}{-b} = \\frac{a}{b}$$\n\nThe opposite of a difference swaps its terms: $-(x - 3) = 3 - x$. So $-\\frac{x - 3}{5} = \\frac{3 - x}{5}$, but $\\frac{-x - 3}{5}$ is a different expression: there the minus sign was applied to only one term.",
        "分式有三个符号：分子的符号、分母的符号和分式前面的符号。同时改变其中**两个**，值不变；只改变**一个**，得到相反数：\n\n$$-\\frac{a}{b} = \\frac{-a}{b} = \\frac{a}{-b} \\qquad \\frac{-a}{-b} = \\frac{a}{b}$$\n\n差的相反数是把两项交换：$-(x - 3) = 3 - x$。所以 $-\\frac{x - 3}{5} = \\frac{3 - x}{5}$，而 $\\frac{-x - 3}{5}$ 是另一个代数式：那里负号只作用在了一项上。",
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
        return choiceProblem({
          prompt: t(`Which expression is equivalent to $${given[0]}$?`, `哪个代数式与 $${given[0]}$ 等价？`),
          options: options.map(([f]) => same(`$${f}$`)),
          correct: options.indexOf(right),
          solution: t(
            `Changing two of the three signs of a fraction (of the numerator, of the denominator, in front) keeps its value, and $-(${pos}) = ${opp}$. So $${given[0]} = ${right[0]}$.`,
            `同时改变分式三个符号（分子的、分母的、分式前面的）中的两个，值不变；并且 $-(${pos}) = ${opp}$。所以 $${given[0]} = ${right[0]}$。`,
          ),
        });
      },
    },
    {
      id: "combining-fractions",
      title: t("Combining fractions into one", "合并成一个分式"),
      explanation: t(
        "Algebraic fractions with number denominators add and subtract like numerical fractions: rewrite them over a common denominator, multiplying each **whole** numerator, then combine the numerators.\n\n$$\\frac{x + 1}{2} - \\frac{x - 3}{6} = \\frac{3(x + 1)}{6} - \\frac{x - 3}{6} = \\frac{3x + 3 - x + 3}{6} = \\frac{2x + 6}{6} = \\frac{x + 3}{3}$$\n\nWhen subtracting, the minus sign applies to every term of the second numerator. Finish by cancelling any common factor of the numerator and the denominator.",
        "分母是数的代数分式与数的分数一样加减：先化成同分母，把**整个**分子都乘上相应的数，再合并分子。\n\n$$\\frac{x + 1}{2} - \\frac{x - 3}{6} = \\frac{3(x + 1)}{6} - \\frac{x - 3}{6} = \\frac{3x + 3 - x + 3}{6} = \\frac{2x + 6}{6} = \\frac{x + 3}{3}$$\n\n做减法时，减号要作用在第二个分子的每一项上。最后约去分子和分母的公因数。",
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
          const work = steps(
            `${expr} = ${frac(product(l / a, [linear(p, r)]), String(l))} ${op} ${frac(product(l / b, [linear(q, s)]), String(l))}`,
            `= ${raw}${raw === answer ? "" : ` = ${answer}`}`,
          );
          return expressionProblem({
            prompt: t(`Write $${expr}$ as a single fraction in lowest terms.`, `把 $${expr}$ 写成一个最简分式。`),
            answer,
            lowest: true,
            wrong: [over(p + sg * q, r + sg * s, a + b), over(p + sg * q, r + sg * s, l), over(cx, r * (l / a) + s * (l / b), l), raw],
            solution: t(`Use the common denominator $${l}$:${work}`, `通分，公分母是 $${l}$：${work}`),
          });
        }
      },
    },
  ],
};

export const simplifyingRationalExpressions: TopicDef = {
  id: "simplifying-rational-expressions",
  title: t("Simplifying Rational Expressions", "化简分式"),
  summary: t(
    "Find the values excluded from a rational expression, and simplify rational expressions by cancelling common monomial and binomial factors.",
    "求分式中要排除的值，并通过约去公共的单项式因式和二项式因式化简分式。",
  ),
  prerequisites: ["equivalent-expressions-with-fractions", "greatest-common-factor-of-monomials"],
  encompasses: [
    { topic: "greatest-common-factor-of-monomials", weight: 0.4 },
    { topic: "product-and-quotient-rules", weight: 0.4 },
    { topic: "equivalent-fractions", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.APR.D.6"],
  knowledgePoints: [
    {
      id: "excluded-values",
      title: t("Excluded values", "要排除的值"),
      explanation: t(
        "A **rational expression** is a fraction of polynomials, such as $\\frac{x + 2}{x - 5}$. Division by zero is not defined, so the values of the variable that make the **denominator** zero are excluded: here $x \\neq 5$. The numerator does not matter: at $x = -2$ the expression is just $0$.\n\nTo find the excluded values, set the denominator equal to zero and solve. A product is zero when one of its factors is:\n\n$$\\frac{3}{x(x + 4)}: \\quad x = 0 \\text{ or } x + 4 = 0, \\text{ so } x \\neq 0 \\text{ and } x \\neq -4$$\n\nSince $x^{2} \\ge 0$, a denominator such as $x^{2} + 9$ is never zero, and no value is excluded.",
        "**分式**是两个多项式之比，例如 $\\frac{x + 2}{x - 5}$。除以零没有意义，所以使**分母**为零的变量值要排除：这里 $x \\neq 5$。分子不影响这一点：$x = -2$ 时分式的值就是 $0$。\n\n求要排除的值，就令分母等于零并解方程。积为零当且仅当某个因式为零：\n\n$$\\frac{3}{x(x + 4)}: \\quad x = 0 \\text{ 或 } x + 4 = 0, \\text{ 所以 } x \\neq 0 \\text{ 且 } x \\neq -4$$\n\n因为 $x^{2} \\ge 0$，像 $x^{2} + 9$ 这样的分母永远不为零，没有要排除的值。",
      ),
      generate(rng) {
        const kind = rng.pick(["one", "two", "two", "linear", "linear", "monomial", "none"] as const);
        const a = rng.nonZero(-9, 9);
        const top = rng.bool(0.3) ? String(rng.nonZero(-9, 9)) : bin(a);
        const topRoot = top.includes("x") ? [[num(-a)]] : [];
        const prompt = (e: string) =>
          t(
            `Find all values of $x$ for which $${e}$ is not defined. Enter them separated by commas, or $\\varnothing$ if there is none.`,
            `求使 $${e}$ 没有意义的所有 $x$ 值。请用逗号分隔；如果没有，请输入 $\\varnothing$。`,
          );
        const zero = (d: string, work: string, vs: readonly string[]) =>
          t(
            `The expression is not defined where its denominator is zero:${steps(`${d} = 0`, work)}${vs.length === 1 ? `So $x = ${vs[0]}$ is excluded.` : `So $x = ${vs.join("$ and $x = ")}$ are excluded.`}`,
            `分母为零时分式没有意义：${steps(`${d} = 0`, work)}所以要排除 $x = ${vs.join("$ 和 $x = ")}$。`,
          );
        if (kind === "one") {
          const b = rng.nonZero(-12, 12);
          const d = bin(-b);
          return solutionsProblem({
            prompt: prompt(frac(top, d)),
            values: [num(b)],
            wrong: [[num(-b)], ...topRoot],
            solution: zero(d, `x = ${b}`, [num(b)]),
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
            solution: zero(d, `${bin(-b)} = 0 \\text{ or } ${bin(-c)} = 0`, [num(b), num(c)]),
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
            solution: zero(d, `${linear(m, 0)} = ${-n}, \\quad x = ${num(v)}`, [num(v)]),
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
            solution: zero(d, `${m === 1 ? "" : `${m}`}x = 0 \\text{ or } ${bin(-b)} = 0`, ["0", num(b)]),
          });
        }
        const c = rng.int(1, 25);
        const d = `x^{2} + ${c}`;
        return solutionsProblem({
          prompt: prompt(frac(top, d)),
          values: [],
          wrong: [[num(-c)], ["0"], ...topRoot],
          solution: t(
            `Since $x^{2} \\ge 0$, the denominator $${d}$ is at least $${c}$ and is never zero, so no value is excluded: $\\varnothing$.`,
            `因为 $x^{2} \\ge 0$，分母 $${d}$ 至少是 $${c}$，永远不为零，所以没有要排除的值：$\\varnothing$。`,
          ),
        });
      },
    },
    {
      id: "monomials-in-one-variable",
      title: t("Monomial over monomial", "单项式除以单项式"),
      explanation: t(
        "A rational expression is in **lowest terms** when its numerator and denominator have no common factor. To simplify, cancel the greatest common factor of the numerator and the denominator, as with numerical fractions:\n\n$$\\frac{12x^{5}}{8x^{2}} = \\frac{4x^{2} \\cdot 3x^{3}}{4x^{2} \\cdot 2} = \\frac{3x^{3}}{2} \\qquad \\frac{6x^{2}}{9x^{5}} = \\frac{3x^{2} \\cdot 2}{3x^{2} \\cdot 3x^{3}} = \\frac{2}{3x^{3}}$$\n\nThe higher power of $x$ keeps the difference of the exponents, on its own side of the fraction bar. The simplified expression equals the original only where the original is defined, here for $x \\neq 0$.",
        "当分子和分母没有公因式时，分式是**最简分式**。化简时，与数的分数一样，约去分子和分母的最大公因式：\n\n$$\\frac{12x^{5}}{8x^{2}} = \\frac{4x^{2} \\cdot 3x^{3}}{4x^{2} \\cdot 2} = \\frac{3x^{3}}{2} \\qquad \\frac{6x^{2}}{9x^{5}} = \\frac{3x^{2} \\cdot 2}{3x^{2} \\cdot 3x^{3}} = \\frac{2}{3x^{3}}$$\n\n$x$ 的较高次幂留在它原来的那一边，指数是两个指数的差。化简后的式子只在原式有意义的地方与原式相等，这里是 $x \\neq 0$。",
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
            `The greatest common factor of the numerator and the denominator is $${common}$. Cancel it:${steps(`${expr} = ${frac(cdot(common, restTop), cdot(common, restBottom))} = ${answer}`)}`,
            `分子和分母的最大公因式是 $${common}$。约去它：${steps(`${expr} = ${frac(cdot(common, restTop), cdot(common, restBottom))} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "monomials-in-two-variables",
      title: t("Monomials in two variables", "含两个变量的单项式"),
      explanation: t(
        "With several variables, cancel each variable separately: its smaller power cancels, and the difference of the exponents stays on the side that had the higher power. Signs follow the rules of division.\n\n$$\\frac{-10x^{2}y^{5}}{15x^{4}y^{2}} = -\\frac{2y^{3}}{3x^{2}}$$",
        "多个变量时，每个变量分别约分：约去较小的幂，两个指数的差留在原来次数较高的那一边。符号按除法法则确定。\n\n$$\\frac{-10x^{2}y^{5}}{15x^{4}y^{2}} = -\\frac{2y^{3}}{3x^{2}}$$",
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
              `Cancel the greatest common factor $${g}$ of the coefficients, $${pw("x", Math.min(i, k)) || "1"}$ from the powers of $x$ and $${pw("y", Math.min(j, l)) || "1"}$ from the powers of $y$:${steps(`${expr} = ${answer}`)}`,
              `约去系数的最大公因数 $${g}$，$x$ 的幂中约去 $${pw("x", Math.min(i, k)) || "1"}$，$y$ 的幂中约去 $${pw("y", Math.min(j, l)) || "1"}$：${steps(`${expr} = ${answer}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "common-binomial-factors",
      title: t("Common binomial factors", "公共的二项式因式"),
      explanation: t(
        "A binomial such as $x + 3$ is a factor like any other: when it appears in both the numerator and the denominator, it cancels as a whole.\n\n$$\\frac{4(x + 3)}{6(x + 3)(x - 1)} = \\frac{2}{3(x - 1)}, \\quad x \\neq -3$$\n\nOnly **factors** cancel, never terms: in $\\frac{x + 3}{x}$ nothing cancels, because $x$ is a term of the numerator, not a factor. The cancelled factor still excludes its value: the simplified expression equals the original only for $x \\neq -3$ (and $x \\neq 1$).",
        "像 $x + 3$ 这样的二项式和其他因式一样：当它同时出现在分子和分母中时，可以整体约去。\n\n$$\\frac{4(x + 3)}{6(x + 3)(x - 1)} = \\frac{2}{3(x - 1)}, \\quad x \\neq -3$$\n\n只有**因式**能约去，项不能约：在 $\\frac{x + 3}{x}$ 中什么也不能约，因为 $x$ 是分子的一项，而不是因式。被约去的因式仍然排除它对应的值：化简后的式子只在 $x \\neq -3$（以及 $x \\neq 1$）时与原式相等。",
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
          return expressionProblem({
            prompt: simplifyPrompt(expr, variant === 1 ? [excluded[0]!] : excluded),
            answer,
            lowest: true,
            wrong,
            solution: t(
              `Cancel the common factor $${P}$ and the greatest common factor $${g}$ of the numbers:${steps(`${expr} = ${answer}`)}`,
              `约去公因式 $${P}$ 以及数的最大公因数 $${g}$：${steps(`${expr} = ${answer}`)}`,
            ),
          });
        }
      },
    },
  ],
};

export const simplifyingRationalExpressionsByFactoring: TopicDef = {
  id: "simplifying-rational-expressions-by-factoring",
  title: t("Simplifying Rational Expressions by Factoring", "用因式分解化简分式"),
  summary: t(
    "Factor numerators and denominators by taking out common factors, the difference of squares, perfect squares and trinomials, then cancel common factors, opposite binomials included.",
    "用提取公因式、平方差、完全平方和三项式分解分子和分母，再约去公因式，包括互为相反数的二项式。",
  ),
  prerequisites: ["simplifying-rational-expressions", "difference-of-squares-formula", "factoring-trinomials"],
  encompasses: [
    { topic: "simplifying-rational-expressions", weight: 0.6 },
    { topic: "difference-of-squares-formula", weight: 0.3 },
    { topic: "factoring-trinomials", weight: 0.3 },
    { topic: "squaring-binomials", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.APR.D.6", "CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "common-factors",
      title: t("Taking out common factors", "提取公因式"),
      explanation: t(
        "When the numerator or the denominator is a sum, factor it first: take out the greatest common factor of its terms, using the distributive law backwards. Then cancel the common factors.\n\n$$\\frac{4x + 12}{6x^{2} + 18x} = \\frac{4(x + 3)}{6x(x + 3)} = \\frac{2}{3x}, \\quad x \\neq -3$$\n\nNever cancel terms of a sum: $\\frac{4x + 12}{6x^{2} + 18x}$ is not $\\frac{4x}{6x^{2}} + \\frac{12}{18x}$.",
        "当分子或分母是和时，先分解因式：用分配律的逆运算提取各项的最大公因式，再约去公因式。\n\n$$\\frac{4x + 12}{6x^{2} + 18x} = \\frac{4(x + 3)}{6x(x + 3)} = \\frac{2}{3x}, \\quad x \\neq -3$$\n\n不能约去和中的某一项：$\\frac{4x + 12}{6x^{2} + 18x}$ 不等于 $\\frac{4x}{6x^{2}} + \\frac{12}{18x}$。",
      ),
      keyPrerequisites: ["greatest-common-factor-of-monomials", "distributive-law-for-polynomials"],
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
          const factored = frac(product(A, [pw("x", i), L]), product(B, [pw("x", j), L]));
          const excluded = [num(Q.of(-p, u)), ...(i > 0 && j > 0 ? ["0"] : [])];
          return expressionProblem({
            prompt: simplifyPrompt(expr, excluded),
            answer,
            lowest: true,
            wrong: [
              ratio(B, [pw("x", j - i)], A, [pw("x", i - j)]),
              `${B < 0 ? "-" : ""}${frac(product(A, [pw("x", i - j)]), product(Math.abs(B), [pw("x", j - i)]))}`,
              ratio(A, [], B, []),
            ],
            solution: t(
              `Factor the numerator and the denominator, then cancel the common factors:${steps(`${expr} = ${factored} = ${answer}`)}`,
              `分解分子和分母，再约去公因式：${steps(`${expr} = ${factored} = ${answer}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "difference-of-squares",
      title: t("The difference of squares", "平方差"),
      explanation: t(
        "Read the difference of squares formula backwards to factor: $a^{2} - b^{2} = (a + b)(a - b)$.\n\n$$\\frac{x^{2} - 25}{3x - 15} = \\frac{(x + 5)(x - 5)}{3(x - 5)} = \\frac{x + 5}{3}, \\quad x \\neq 5$$\n\nDividing term by term, $\\frac{x^{2}}{x}$ and $\\frac{25}{5}$, is not allowed: only whole factors cancel.",
        "把平方差公式反过来用来分解因式：$a^{2} - b^{2} = (a + b)(a - b)$。\n\n$$\\frac{x^{2} - 25}{3x - 15} = \\frac{(x + 5)(x - 5)}{3(x - 5)} = \\frac{x + 5}{3}, \\quad x \\neq 5$$\n\n不能逐项相除（如 $\\frac{x^{2}}{x}$ 和 $\\frac{25}{5}$）：只有完整的因式才能约去。",
      ),
      keyPrerequisites: ["difference-of-squares-formula"],
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
        return expressionProblem({
          prompt: simplifyPrompt(expr, [root]),
          answer,
          lowest: true,
          wrong: flip ? [ratio(k, [], 1, [cancel]), ratio(1, [], 1, [keep])] : [ratio(1, [cancel], k, []), keep],
          solution: t(
            `Factor the difference of squares, and take out the common factor $${k}$ if there is one:${steps(`${expr} = ${factored} = ${answer}`)}`,
            `用平方差公式分解，如有公因数 $${k}$ 也提取出来：${steps(`${expr} = ${factored} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "opposite-factors",
      title: t("Opposite binomials", "互为相反数的二项式"),
      explanation: t(
        "The binomials $b - x$ and $x - b$ are opposites: $b - x = -(x - b)$. So they cancel to $-1$:\n\n$$\\frac{3 - x}{x - 3} = \\frac{-(x - 3)}{x - 3} = -1 \\qquad \\frac{8 - 2x}{x^{2} - 16} = \\frac{-2(x - 4)}{(x + 4)(x - 4)} = -\\frac{2}{x + 4}$$\n\nTake out a negative factor so that the binomials match, and keep track of the sign.",
        "二项式 $b - x$ 和 $x - b$ 互为相反数：$b - x = -(x - b)$。所以它们约分后得 $-1$：\n\n$$\\frac{3 - x}{x - 3} = \\frac{-(x - 3)}{x - 3} = -1 \\qquad \\frac{8 - 2x}{x^{2} - 16} = \\frac{-2(x - 4)}{(x + 4)(x - 4)} = -\\frac{2}{x + 4}$$\n\n提取一个负的公因数，使两个二项式相同，并注意符号。",
      ),
      keyPrerequisites: ["difference-of-squares-formula"],
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
          return expressionProblem({
            prompt: simplifyPrompt(expr, [String(b)]),
            answer,
            lowest: true,
            wrong: [ratio(m, [], n, []), ratio(-n, [], m, []), "-1"],
            solution: t(
              `Take out $${m}$ from the numerator and $${-n}$ from the denominator:${steps(`${expr} = ${frac(product(m, [bin(-b)]), product(-n, [bin(-b)]))} = ${answer}`)}`,
              `分子提取 $${m}$，分母提取 $${-n}$：${steps(`${expr} = ${frac(product(m, [bin(-b)]), product(-n, [bin(-b)]))} = ${answer}`)}`,
            ),
          });
        }
        const flip = variant === 1;
        const expr = flip ? frac(S, opp) : frac(opp, S);
        const factored = flip ? frac(Sf, oppF) : frac(oppF, Sf);
        const answer = flip ? (k === 1 ? poly([-1, "x"], [-b, ""]) : ratio(-1, [bin(b)], k, [])) : ratio(-k, [], 1, [bin(b)]);
        return expressionProblem({
          prompt: simplifyPrompt(expr, [String(b)]),
          answer,
          lowest: true,
          wrong: flip
            ? [ratio(1, [bin(b)], k, []), ratio(-1, [bin(-b)], k, []), ratio(-1, [bin(b)], 1, [])]
            : [ratio(k, [], 1, [bin(b)]), ratio(-k, [], 1, [bin(-b)]), ratio(-1, [], 1, [bin(b)])],
          solution: t(
            `Take out $${-k}$ so that $${bin(-b)}$ appears in both, then cancel it:${steps(`${expr} = ${factored} = ${answer}`)}`,
            `提取 $${-k}$，使分子和分母都出现 $${bin(-b)}$，再约去：${steps(`${expr} = ${factored} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "perfect-squares",
      title: t("Perfect squares", "完全平方"),
      explanation: t(
        "Read the square of a binomial backwards: $a^{2} + 2ab + b^{2} = (a + b)^{2}$ and $a^{2} - 2ab + b^{2} = (a - b)^{2}$. A trinomial is a perfect square when its first and last terms are squares and its middle term is twice the product of their roots.\n\n$$\\frac{x^{2} - 6x + 9}{x^{2} - 9} = \\frac{(x - 3)^{2}}{(x + 3)(x - 3)} = \\frac{x - 3}{x + 3}, \\quad x \\neq 3$$",
        "把二项式的平方公式反过来用：$a^{2} + 2ab + b^{2} = (a + b)^{2}$，$a^{2} - 2ab + b^{2} = (a - b)^{2}$。当三项式的首项和末项都是平方，并且中间项是它们平方根之积的两倍时，它是完全平方式。\n\n$$\\frac{x^{2} - 6x + 9}{x^{2} - 9} = \\frac{(x - 3)^{2}}{(x + 3)(x - 3)} = \\frac{x - 3}{x + 3}, \\quad x \\neq 3$$",
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
        return expressionProblem({
          prompt: simplifyPrompt(expr, [num(-s * p)]),
          answer,
          lowest: true,
          wrong,
          solution: t(
            `$${sq} = ${sqF}$ is a perfect square. Factor, then cancel the common factor $${P}$:${steps(`${expr} = ${factored} = ${answer}`)}`,
            `$${sq} = ${sqF}$ 是完全平方式。分解因式，再约去公因式 $${P}$：${steps(`${expr} = ${factored} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "trinomials",
      title: t("Factoring trinomials", "分解三项式"),
      explanation: t(
        "A trinomial $x^{2} + bx + c$ factors as $(x + m)(x + n)$ when $m + n = b$ and $mn = c$. Factor every numerator and denominator completely, then cancel the common factors:\n\n$$\\frac{x^{2} - x - 6}{x^{2} - 9} = \\frac{(x - 3)(x + 2)}{(x - 3)(x + 3)} = \\frac{x + 2}{x + 3}, \\quad x \\neq 3$$\n\nThe terms $x^{2}$ do not cancel: only whole factors do.",
        "当 $m + n = b$ 且 $mn = c$ 时，三项式 $x^{2} + bx + c$ 可以分解为 $(x + m)(x + n)$。把每个分子和分母都完全分解，再约去公因式：\n\n$$\\frac{x^{2} - x - 6}{x^{2} - 9} = \\frac{(x - 3)(x + 2)}{(x - 3)(x + 3)} = \\frac{x + 2}{x + 3}, \\quad x \\neq 3$$\n\n$x^{2}$ 项不能约去：只有完整的因式才能约去。",
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
          return expressionProblem({
            prompt: simplifyPrompt(expr, [num(-p)]),
            answer,
            lowest: true,
            wrong: flip
              ? [ratio(kk, [keep], 1, [wrongQ]), ratio(1, [Qb], kk, [keep]), ratio(kk, [keep], 1, [bin(p)])]
              : [ratio(1, [wrongQ], kk, [keep]), ratio(kk, [keep], 1, [Qb]), ratio(1, [bin(p)], kk, [keep])],
            solution: t(
              `$${tri(p, q)} = ${triF}$, since $${p} + ${paren(q)} = ${p + q}$ and $${p} \\cdot ${paren(q)} = ${p * q}$. Factor, then cancel the common factor $${P}$:${steps(`${expr} = ${factored} = ${answer}`)}`,
              `因为 $${p} + ${paren(q)} = ${p + q}$，$${p} \\cdot ${paren(q)} = ${p * q}$，所以 $${tri(p, q)} = ${triF}$。分解因式，再约去公因式 $${P}$：${steps(`${expr} = ${factored} = ${answer}`)}`,
            ),
          });
        }
      },
    },
  ],
};

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
  knowledgePoints: [
    {
      id: "variable-in-the-denominator",
      title: t("A number over a binomial", "数除以二项式"),
      explanation: t(
        "When the variable is in a denominator, multiply both sides by that denominator to clear the fraction, then solve the linear equation:\n\n$$\\frac{12}{x - 2} = 4 \\;\\Rightarrow\\; 12 = 4(x - 2) \\;\\Rightarrow\\; 12 = 4x - 8 \\;\\Rightarrow\\; 4x = 20 \\;\\Rightarrow\\; x = 5$$\n\nThe value that makes the denominator zero, here $x = 2$, is excluded and can never be a solution.",
        "当未知数在分母中时，两边同乘这个分母去掉分式，再解一次方程：\n\n$$\\frac{12}{x - 2} = 4 \\;\\Rightarrow\\; 12 = 4(x - 2) \\;\\Rightarrow\\; 12 = 4x - 8 \\;\\Rightarrow\\; 4x = 20 \\;\\Rightarrow\\; x = 5$$\n\n使分母为零的值（这里是 $x = 2$）要排除，它永远不可能是方程的解。",
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
          solution: t(
            `Multiply both sides by $${L}$:${steps(...work)}${keptNote(num(x)).en}`,
            `两边同乘 $${L}$：${steps(...work)}${keptNote(num(x))["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "binomial-over-binomial",
      title: t("A binomial over a binomial", "二项式除以二项式"),
      explanation: t(
        "The numerator may contain the variable too. Multiply both sides by the denominator, distributing over **every** term, then solve.\n\n$$\\frac{2x + 1}{x - 4} = 3 \\;\\Rightarrow\\; 2x + 1 = 3x - 12 \\;\\Rightarrow\\; x = 13$$\n\nAlways check the answer against the excluded values. In $\\frac{2x - 8}{x - 4} = 3$, the same steps give $x = 4$, which makes the denominator zero; since it is the only candidate, the equation has **no solution**.",
        "分子中也可以有未知数。两边同乘分母，乘到**每一项**，再解方程。\n\n$$\\frac{2x + 1}{x - 4} = 3 \\;\\Rightarrow\\; 2x + 1 = 3x - 12 \\;\\Rightarrow\\; x = 13$$\n\n一定要检验所得的值是不是要排除的值。在 $\\frac{2x - 8}{x - 4} = 3$ 中，同样的步骤得到 $x = 4$，它使分母为零；这是唯一的候选值，所以方程**无解**。",
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
          const work = [`${N} = ${product(d, [D])}`, `${N} = ${linear(d, d * q)}`, ...solvingLinear(p - d, Q.of(d * q - r))];
          const note = excluded ? excludedNote(num(-q)) : keptNote(num(x));
          return solutionsProblem({
            prompt: solve(eq),
            values: excluded ? [] : [num(x)],
            wrong: excluded
              ? [[num(-q)], [num(-q), num(Q.of(q - r, p - d))]]
              : [[num(-q)], [num(x), num(-q)], [num(Q.of(q - r, p - d))], [num(x.neg())]],
            solution: t(`Multiply both sides by $${D}$:${steps(...work)}${note.en}`, `两边同乘 $${D}$：${steps(...work)}${note["zh-CN"]}`),
          });
        }
      },
    },
    {
      id: "isolating-the-fraction",
      title: t("Isolating the fraction first", "先分离分式"),
      explanation: t(
        "If the equation has another term, first isolate the fraction, then clear the denominator:\n\n$$\\frac{6}{x + 1} - 5 = -3 \\;\\Rightarrow\\; \\frac{6}{x + 1} = 2 \\;\\Rightarrow\\; 6 = 2(x + 1) \\;\\Rightarrow\\; x = 2$$\n\nA fraction is zero only when its numerator is zero. So if the isolated fraction has a nonzero number as numerator and must equal $0$, there is no solution.",
        "如果方程中还有其他项，先分离出分式，再去分母：\n\n$$\\frac{6}{x + 1} - 5 = -3 \\;\\Rightarrow\\; \\frac{6}{x + 1} = 2 \\;\\Rightarrow\\; 6 = 2(x + 1) \\;\\Rightarrow\\; x = 2$$\n\n分式只有在分子为零时才等于零。所以如果分离出的分式分子是不为零的数，却要等于 $0$，方程就无解。",
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
          const eq = rng.bool(0.7) ? `${F} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${e}` : `${b} + ${F} = ${e}`;
          const isolated = `${F} = ${k}`;
          if (none) {
            return solutionsProblem({
              prompt: solve(eq),
              values: [],
              wrong: [[num(-q)], ["0"]],
              solution: t(
                `Isolate the fraction:${steps(isolated)}A fraction with numerator $${a}$ is never $0$, so the equation has no solution, $\\varnothing$.`,
                `分离出分式：${steps(isolated)}分子为 $${a}$ 的分式永远不等于 $0$，所以方程无解：$\\varnothing$。`,
              ),
            });
          }
          const x = Q.of(a, k).sub(Q.of(q));
          const work = [isolated, `${a} = ${product(k, [D])}`, `${a} = ${linear(k, k * q)}`, ...solvingLinear(k, Q.of(a - k * q))];
          return solutionsProblem({
            prompt: solve(eq),
            values: [num(x)],
            wrong: [
              [num(-q)],
              ...(e !== 0 ? [[num(Q.of(a, e).sub(Q.of(q)))]] : []),
              ...(e + b !== 0 ? [[num(Q.of(a, e + b).sub(Q.of(q)))]] : []),
              [num(Q.of(a, k).add(Q.of(q)))],
            ],
            solution: t(
              `Isolate the fraction, then multiply both sides by $${D}$:${steps(...work)}${keptNote(num(x)).en}`,
              `先分离出分式，再两边同乘 $${D}$：${steps(...work)}${keptNote(num(x))["zh-CN"]}`,
            ),
          });
        }
      },
    },
  ],
};

export const rationalEquationsUsingCrossMultiplication: TopicDef = {
  id: "rational-equations-using-cross-multiplication",
  title: t("Solving Rational Equations Using Cross-Multiplication", "用交叉相乘解分式方程"),
  summary: t(
    "Solve equations of the form $\\frac{a}{b} = \\frac{c}{d}$ with the variable in a denominator by cross-multiplying, and reject excluded values.",
    "用交叉相乘解形如 $\\frac{a}{b} = \\frac{c}{d}$、分母中含未知数的方程，并舍去要排除的值。",
  ),
  prerequisites: ["rational-equations-with-one-fractional-term", "proportions"],
  encompasses: [
    { topic: "rational-equations-with-one-fractional-term", weight: 0.4 },
    { topic: "proportions", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.A.2"],
  knowledgePoints: [
    {
      id: "a-number-on-one-side",
      title: t("A number fraction on one side", "一边是数的分数"),
      explanation: t(
        "As with proportions, $\\frac{a}{b} = \\frac{c}{d}$ means $ad = bc$ (for nonzero $b$ and $d$). Cross-multiply, keeping each binomial in parentheses:\n\n$$\\frac{5}{x + 2} = \\frac{3}{4} \\;\\Rightarrow\\; 3(x + 2) = 5 \\cdot 4 \\;\\Rightarrow\\; 3x + 6 = 20 \\;\\Rightarrow\\; x = \\frac{14}{3}$$",
        "与比例一样，$\\frac{a}{b} = \\frac{c}{d}$ 意味着 $ad = bc$（$b$、$d$ 不为零）。交叉相乘，二项式要放在括号里：\n\n$$\\frac{5}{x + 2} = \\frac{3}{4} \\;\\Rightarrow\\; 3(x + 2) = 5 \\cdot 4 \\;\\Rightarrow\\; 3x + 6 = 20 \\;\\Rightarrow\\; x = \\frac{14}{3}$$",
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
              solution: t(
                `Cross-multiply:${steps(...work)}${keptNote(num(x)).en}`,
                `交叉相乘：${steps(...work)}${keptNote(num(x))["zh-CN"]}`,
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
            solution: t(`Cross-multiply:${steps(...work)}`, `交叉相乘：${steps(...work)}`),
          });
        }
      },
    },
    {
      id: "variables-on-both-sides",
      title: t("Binomials in both denominators", "两边分母都是二项式"),
      explanation: t(
        "When both denominators contain the variable, cross-multiply the same way and solve the linear equation that results:\n\n$$\\frac{4}{x + 1} = \\frac{3}{x - 2} \\;\\Rightarrow\\; 4(x - 2) = 3(x + 1) \\;\\Rightarrow\\; 4x - 8 = 3x + 3 \\;\\Rightarrow\\; x = 11$$\n\nEach numerator multiplies the **other** side's denominator.",
        "当两边的分母都含有未知数时，同样交叉相乘，再解得到的一次方程：\n\n$$\\frac{4}{x + 1} = \\frac{3}{x - 2} \\;\\Rightarrow\\; 4(x - 2) = 3(x + 1) \\;\\Rightarrow\\; 4x - 8 = 3x + 3 \\;\\Rightarrow\\; x = 11$$\n\n每个分子都乘以**另一边**的分母。",
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
            ...solvingLinear(a - b, Q.of(b * p - a * q)),
          ];
          return solutionsProblem({
            prompt: solve(`${frac(String(a), P)} = ${frac(String(b), Qb)}`),
            values: [num(x)],
            wrong: [[num(Q.of(p - q, a - b))], [num(Q.of(b * q - a * p, a - b))], [num(-p), num(-q)]],
            solution: t(
              `Cross-multiply:${steps(...work)}${keptNote(num(x)).en}`,
              `交叉相乘：${steps(...work)}${keptNote(num(x))["zh-CN"]}`,
            ),
          });
        }
      },
    },
    {
      id: "rejecting-excluded-values",
      title: t("Rejecting excluded values", "舍去要排除的值"),
      explanation: t(
        "When both sides have the same denominator, multiply both sides by it: the numerators must be equal. But the solution of that equation may be a value that makes the denominator zero; such a value is **extraneous** and must be rejected.\n\n$$\\frac{x + 1}{x - 3} = \\frac{4}{x - 3} \\;\\Rightarrow\\; x + 1 = 4 \\;\\Rightarrow\\; x = 3$$\n\nBut $x = 3$ is excluded, so this equation has no solution.",
        "当两边分母相同时，两边同乘这个分母，得到分子相等。但这个方程的解可能使分母为零；这样的值是**增根**，必须舍去。\n\n$$\\frac{x + 1}{x - 3} = \\frac{4}{x - 3} \\;\\Rightarrow\\; x + 1 = 4 \\;\\Rightarrow\\; x = 3$$\n\n但 $x = 3$ 是要排除的值，所以这个方程无解。",
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
          return solutionsProblem({
            prompt: solve(eq),
            values: excluded ? [] : [num(x)],
            wrong: excluded ? [[num(-q)], [num(-q), num(Q.of(s + r, p))]] : [[num(-q)], [num(x), num(-q)], [num(Q.of(s + r, p))]],
            solution: t(
              `Multiply both sides by $${D}$ (for $x \\neq ${num(-q)}$):${steps(...work)}${note.en}`,
              `两边同乘 $${D}$（$x \\neq ${num(-q)}$）：${steps(...work)}${note["zh-CN"]}`,
            ),
          });
        }
      },
    },
  ],
};

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
    { topic: "solving-equations-with-square-roots", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.REI.A.2"],
  knowledgePoints: [
    {
      id: "binomial-numerators",
      title: t("Binomials over binomials", "二项式除以二项式"),
      explanation: t(
        "Cross-multiplying binomials gives products of binomials. Multiply them out; the $x^{2}$ terms are often the same on both sides and cancel, leaving a linear equation:\n\n$$\\frac{x + 1}{x - 2} = \\frac{x + 4}{x + 3} \\;\\Rightarrow\\; (x + 1)(x + 3) = (x + 4)(x - 2)$$\n\n$$x^{2} + 4x + 3 = x^{2} + 2x - 8 \\;\\Rightarrow\\; 2x = -11 \\;\\Rightarrow\\; x = -\\frac{11}{2}$$",
        "二项式交叉相乘得到二项式的乘积。把它们展开；两边的 $x^{2}$ 项常常相同而抵消，剩下一个一次方程：\n\n$$\\frac{x + 1}{x - 2} = \\frac{x + 4}{x + 3} \\;\\Rightarrow\\; (x + 1)(x + 3) = (x + 4)(x - 2)$$\n\n$$x^{2} + 4x + 3 = x^{2} + 2x - 8 \\;\\Rightarrow\\; 2x = -11 \\;\\Rightarrow\\; x = -\\frac{11}{2}$$",
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
            solution: t(
              `Cross-multiply and multiply out; the $x^{2}$ terms cancel:${steps(...work)}${keptNote(num(x)).en}`,
              `交叉相乘并展开，$x^{2}$ 项抵消：${steps(...work)}${keptNote(num(x))["zh-CN"]}`,
            ),
          });
        }
      },
    },
    {
      id: "leading-coefficients",
      title: t("Leading coefficients", "首项系数不为 1"),
      explanation: t(
        "With coefficients on $x$, multiply every pair of terms carefully. The $x^{2}$ terms still cancel when they are equal:\n\n$$\\frac{2x - 1}{x + 3} = \\frac{2x + 5}{x - 1} \\;\\Rightarrow\\; (2x - 1)(x - 1) = (2x + 5)(x + 3)$$\n\n$$2x^{2} - 3x + 1 = 2x^{2} + 11x + 15 \\;\\Rightarrow\\; -14x = 14 \\;\\Rightarrow\\; x = -1$$",
        "$x$ 有系数时，要仔细地把每一对项都相乘。两边 $x^{2}$ 项相同时仍然抵消：\n\n$$\\frac{2x - 1}{x + 3} = \\frac{2x + 5}{x - 1} \\;\\Rightarrow\\; (2x - 1)(x - 1) = (2x + 5)(x + 3)$$\n\n$$2x^{2} - 3x + 1 = 2x^{2} + 11x + 15 \\;\\Rightarrow\\; -14x = 14 \\;\\Rightarrow\\; x = -1$$",
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
            ...solvingLinear(den, Q.of(c * b - a * d)),
          ];
          const den2 = m * d - k * m * b;
          return solutionsProblem({
            prompt: solve(`${frac(L1, D1)} = ${frac(L2, D2)}`),
            values: [num(x)],
            wrong: [[num(x.neg())], ...(den2 !== 0 ? [[num(Q.of(c * b - a * d, den2))]] : []), [num(Q.of(-b, n)), num(Q.of(-d, k * n))]],
            solution: t(
              `Cross-multiply and multiply out; the $x^{2}$ terms cancel:${steps(...work)}${keptNote(num(x)).en}`,
              `交叉相乘并展开，$x^{2}$ 项抵消：${steps(...work)}${keptNote(num(x))["zh-CN"]}`,
            ),
          });
        }
      },
    },
    {
      id: "squares-that-do-not-cancel",
      title: t("When the squares do not cancel", "平方项不抵消时"),
      explanation: t(
        "If the variable appears in a numerator on one side and in the denominator on the other, cross-multiplying gives a square. Solve it with square roots, then reject excluded values:\n\n$$\\frac{x + 1}{4} = \\frac{9}{x + 1} \\;\\Rightarrow\\; (x + 1)^{2} = 36 \\;\\Rightarrow\\; x + 1 = \\pm 6 \\;\\Rightarrow\\; x = 5 \\text{ or } x = -7$$\n\nIn $\\frac{x^{2}}{x - 2} = \\frac{4}{x - 2}$, $x^{2} = 4$ gives $x = \\pm 2$, but $x = 2$ is excluded, so the only solution is $x = -2$.",
        "如果未知数在一边的分子中、又在另一边的分母中，交叉相乘会得到平方。用开平方解，再舍去要排除的值：\n\n$$\\frac{x + 1}{4} = \\frac{9}{x + 1} \\;\\Rightarrow\\; (x + 1)^{2} = 36 \\;\\Rightarrow\\; x + 1 = \\pm 6 \\;\\Rightarrow\\; x = 5 \\text{ 或 } x = -7$$\n\n在 $\\frac{x^{2}}{x - 2} = \\frac{4}{x - 2}$ 中，由 $x^{2} = 4$ 得 $x = \\pm 2$，但 $x = 2$ 要排除，所以唯一的解是 $x = -2$。",
      ),
      keyPrerequisites: ["solving-equations-with-square-roots"],
      generate(rng) {
        const kind = rng.pick(["basic", "shifted", "shifted", "none", "excluded"] as const);
        if (kind === "excluded") {
          const c = rng.nonZero(-9, 9);
          const D = bin(-c);
          const eq = rng.bool() ? `${frac("x^{2}", D)} = ${frac(String(c * c), D)}` : `${frac(String(c * c), D)} = ${frac("x^{2}", D)}`;
          return solutionsProblem({
            prompt: solve(eq),
            values: [num(-c)],
            wrong: [[num(c), num(-c)], [num(c)], []],
            solution: t(
              `Multiply both sides by $${D}$ (for $x \\neq ${c}$):${steps(`x^{2} = ${c * c}`, `x = \\pm ${Math.abs(c)}`)}But $x = ${c}$ makes the denominator zero, so the only solution is $x = ${-c}$.`,
              `两边同乘 $${D}$（$x \\neq ${c}$）：${steps(`x^{2} = ${c * c}`, `x = \\pm ${Math.abs(c)}`)}但 $x = ${c}$ 使分母为零，所以唯一的解是 $x = ${-c}$。`,
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
        if (kind === "none") {
          return solutionsProblem({
            prompt: solve(eq),
            values: [],
            wrong: [[num(-a + r), num(-a - r)], [num(-a)]],
            solution: t(
              `Cross-multiply:${steps(`${sq} = ${b * c}`)}No real number has a negative square, so there is no solution, $\\varnothing$.`,
              `交叉相乘：${steps(`${sq} = ${b * c}`)}任何实数的平方都不是负数，所以方程无解：$\\varnothing$。`,
            ),
          });
        }
        const values = [num(-a + r), num(-a - r)];
        const work = [`${sq} = ${b * c}`, `${u} = \\pm ${r}`, ...(a === 0 ? [] : [`x = ${-a} \\pm ${r}`])];
        return solutionsProblem({
          prompt: solve(eq),
          values,
          wrong: [[num(-a + r)], [num(a + r), num(a - r)], [num(b * c - a)]],
          solution: t(
            `Cross-multiply, then take square roots:${steps(...work)}Neither value makes a denominator zero, so $x = ${values[0]}$ or $x = ${values[1]}$.`,
            `交叉相乘，再开平方：${steps(...work)}两个值都不使分母为零，所以 $x = ${values[0]}$ 或 $x = ${values[1]}$。`,
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
  encompasses: [
    { topic: "rational-equations-using-cross-multiplication", weight: 0.5 },
    { topic: "rational-equations-with-one-fractional-term", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.REI.A.2"],
  knowledgePoints: [
    {
      id: "flipping-both-sides",
      title: t("Flipping both sides", "两边取倒数"),
      explanation: t(
        "If two nonzero numbers are equal, so are their reciprocals: $\\frac{a}{b} = \\frac{c}{d}$ gives $\\frac{b}{a} = \\frac{d}{c}$. When the variable is only in a denominator, flipping both sides brings it to a numerator:\n\n$$\\frac{4}{2x + 1} = \\frac{2}{3} \\;\\Rightarrow\\; \\frac{2x + 1}{4} = \\frac{3}{2} \\;\\Rightarrow\\; 2x + 1 = 6 \\;\\Rightarrow\\; x = \\frac{5}{2}$$\n\nFlip **both** sides, never just one.",
        "如果两个不为零的数相等，它们的倒数也相等：由 $\\frac{a}{b} = \\frac{c}{d}$ 得 $\\frac{b}{a} = \\frac{d}{c}$。当未知数只在分母中时，两边取倒数就把它移到了分子上：\n\n$$\\frac{4}{2x + 1} = \\frac{2}{3} \\;\\Rightarrow\\; \\frac{2x + 1}{4} = \\frac{3}{2} \\;\\Rightarrow\\; 2x + 1 = 6 \\;\\Rightarrow\\; x = \\frac{5}{2}$$\n\n**两边**都要取倒数，不能只取一边。",
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
            `${frac(L, String(a))} = ${num(Q.of(c, b))}`,
            `${L} = ${cdot(String(a), num(Q.of(c, b)))} = ${num(v)}`,
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
            solution: t(
              `Flip both sides, then multiply by $${a}$:${steps(...work)}${keptNote(num(x)).en}`,
              `两边取倒数，再乘以 $${a}$：${steps(...work)}${keptNote(num(x))["zh-CN"]}`,
            ),
          });
        }
      },
    },
    {
      id: "a-whole-number-side",
      title: t("A whole number on one side", "一边是整数"),
      explanation: t(
        "A whole number $c$ is $\\frac{c}{1}$, so its reciprocal is $\\frac{1}{c}$:\n\n$$\\frac{6}{x - 1} = 4 \\;\\Rightarrow\\; \\frac{x - 1}{6} = \\frac{1}{4} \\;\\Rightarrow\\; x - 1 = \\frac{3}{2} \\;\\Rightarrow\\; x = \\frac{5}{2}$$\n\n$0$ has no reciprocal. A fraction with a nonzero number as numerator is never $0$, so an equation such as $\\frac{6}{x - 1} = 0$ has no solution.",
        "整数 $c$ 就是 $\\frac{c}{1}$，所以它的倒数是 $\\frac{1}{c}$：\n\n$$\\frac{6}{x - 1} = 4 \\;\\Rightarrow\\; \\frac{x - 1}{6} = \\frac{1}{4} \\;\\Rightarrow\\; x - 1 = \\frac{3}{2} \\;\\Rightarrow\\; x = \\frac{5}{2}$$\n\n$0$没有倒数。分子是不为零的数的分式永远不等于 $0$，所以像 $\\frac{6}{x - 1} = 0$ 这样的方程无解。",
      ),
      generate(rng) {
        const zero = rng.bool(0.2);
        const a = rng.nonZero(-24, 24);
        const c = zero ? 0 : rng.nonZero(-8, 8);
        const m = rng.pick([1, 1, 2, 3, 4]);
        const p = rng.nonZero(-9, 9);
        const L = linear(m, p);
        const eq = `${frac(String(a), L)} = ${c}`;
        if (zero) {
          return solutionsProblem({
            prompt: solve(eq),
            values: [],
            wrong: [[num(Q.of(-p, m))], ["0"]],
            solution: t(
              `A fraction is $0$ only when its numerator is $0$, and the numerator here is $${a}$. So the equation has no solution, $\\varnothing$.`,
              `分式只有在分子为 $0$ 时才等于 $0$，而这里分子是 $${a}$。所以方程无解：$\\varnothing$。`,
            ),
          });
        }
        const v = Q.of(a, c);
        const x = v.sub(Q.of(p)).div(Q.of(m));
        const work = [`${frac(L, String(a))} = ${num(Q.of(1, c))}`, `${L} = ${num(v)}`, ...solvingLinear(m, v.sub(Q.of(p)))];
        return solutionsProblem({
          prompt: solve(eq),
          values: [num(x)],
          wrong: [[num(Q.of(a * c - p, m))], [num(Q.of(c, a).sub(Q.of(p)).div(Q.of(m)))], [num(Q.of(-p, m))]],
          solution: t(
            `Flip both sides, then multiply by $${a}$:${steps(...work)}${keptNote(num(x)).en}`,
            `两边取倒数，再乘以 $${a}$：${steps(...work)}${keptNote(num(x))["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "flipping-and-splitting",
      title: t("Flipping, then splitting", "取倒数后再拆分"),
      explanation: t(
        "When the variable is in both the numerator and the denominator, flip both sides and split the fraction so that the variable appears only once:\n\n$$\\frac{x}{x + 3} = \\frac{2}{5} \\;\\Rightarrow\\; \\frac{x + 3}{x} = \\frac{5}{2} \\;\\Rightarrow\\; 1 + \\frac{3}{x} = \\frac{5}{2} \\;\\Rightarrow\\; \\frac{3}{x} = \\frac{3}{2} \\;\\Rightarrow\\; x = 2$$\n\nThe last step flips again: $\\frac{x}{3} = \\frac{2}{3}$. If the fraction left alone must equal $0$, there is no solution.",
        "当未知数同时在分子和分母中时，两边取倒数，再把分式拆开，使未知数只出现一次：\n\n$$\\frac{x}{x + 3} = \\frac{2}{5} \\;\\Rightarrow\\; \\frac{x + 3}{x} = \\frac{5}{2} \\;\\Rightarrow\\; 1 + \\frac{3}{x} = \\frac{5}{2} \\;\\Rightarrow\\; \\frac{3}{x} = \\frac{3}{2} \\;\\Rightarrow\\; x = 2$$\n\n最后一步再次取倒数：$\\frac{x}{3} = \\frac{2}{3}$。如果最后剩下的分式要等于 $0$，方程无解。",
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
          if (none) {
            return solutionsProblem({
              prompt: solve(eq),
              values: [],
              wrong: [[num(-p)], ["0"]],
              solution: t(
                `Flip both sides and split:${steps(`${frac(D, "x")} = 1`, split, `${frac(String(p), "x")} = 0`)}A fraction with numerator $${p}$ is never $0$, so the equation has no solution, $\\varnothing$.`,
                `两边取倒数并拆分：${steps(`${frac(D, "x")} = 1`, split, `${frac(String(p), "x")} = 0`)}分子为 $${p}$ 的分式永远不等于 $0$，所以方程无解：$\\varnothing$。`,
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
            solution: t(
              `Flip both sides, split the fraction, then flip again:${steps(...work)}${keptNote(num(x)).en}`,
              `两边取倒数，拆开分式，再取一次倒数：${steps(...work)}${keptNote(num(x))["zh-CN"]}`,
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
