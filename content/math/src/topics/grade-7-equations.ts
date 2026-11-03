import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type Interval, linear, num, paren, plane, poly, Q, relSymbol, union } from "@ga/subject-math";

import {
  choiceProblem,
  expressionProblem,
  type InequalityOp,
  inequalityLatex,
  inequalityProblem,
  intervalProblem,
  numberProblem,
  steps,
  yesNo,
} from "../problems.ts";
import { numberLineFigure, ray } from "./compound-inequalities.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// 7th Grade Math: linear equations by trial and error and with fractions, decimals and rational expressions,
// two-variable linear equations and their graphs, and linear inequalities.

/** ccss is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
}

/** frac is the exact quotient a / b, for the values that mistakes produce. */
const frac = (a: number, b: number) => Q.of(a, b);

/** side writes a coefficient times x: side(-1) is "-x". */
const side = (a: number) => poly([a, "x"]);

/** gcd is the greatest common divisor of two integers. */
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** lcm is the least common multiple of two positive integers. */
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

/** moveConstant says how to remove the constant b from the side of the variable. */
const moveConstant = (b: number | Q): Text => {
  const v = b instanceof Q ? b : Q.of(b);
  const shown = (q: Q) => (q.isInteger() ? num(q) : dec(q));
  return v.sign() > 0
    ? t(`Subtract $${shown(v)}$ from both sides`, `两边同时减去 $${shown(v)}$`)
    : t(`Add $${shown(v.neg())}$ to both sides`, `两边同时加上 $${shown(v.neg())}$`);
};

/** isolated writes the last steps of solving k·v = rhs: the equation, then the value, which is left out when k = 1. */
const isolated = (k: number, rhs: string, value: string, v = "x") => [`${poly([k, v])} = ${rhs}`, ...(k === 1 ? [] : [`${v} = ${value}`])];

/** times writes a coefficient times a substituted value: times(3, -2) is "3(-2)", times(-1, 4) is "-4", times(1, -4) is "(-4)". */
const times = (a: number, v: number) => {
  const shown = v < 0 ? `(${num(v)})` : num(v);
  return a === 1 ? shown : a === -1 ? `-${shown}` : `${num(a)}(${num(v)})`;
};

/** plusTimes continues a sum with k times a substituted value: plusTimes(-4, 5) is "- 4(5)". */
const plusTimes = (k: number, v: number) => `${k < 0 ? "-" : "+"} ${times(Math.abs(k), v)}`;

/** solveText is the prompt "Solve …". */
const solveText = (eq: string): Text => t(`Solve $${eq}$.`, `解方程 $${eq}$。`);

const ops: readonly InequalityOp[] = ["<", "<=", ">", ">="];
const flip: Record<InequalityOp, InequalityOp> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
const strictness: Record<InequalityOp, InequalityOp> = { "<": "<=", "<=": "<", ">": ">=", ">=": ">" };
const holds = (l: Q, op: InequalityOp, r: Q) => {
  const c = l.cmp(r);
  return { "<": c < 0, "<=": c <= 0, ">": c > 0, ">=": c >= 0 }[op];
};

/** solveInequality is the prompt "Solve …" for an inequality. */
const solveInequality = (ineq: string): Text => t(`Solve $${ineq}$.`, `解不等式 $${ineq}$。`);

/** people are names in word problems with their possessive pronouns. */
const people = [
  ["Mia", "Her"],
  ["Leo", "His"],
  ["Ava", "Her"],
  ["Noah", "His"],
  ["Zoe", "Her"],
  ["Sam", "His"],
] as const;

// ---------------------------------------------------------------------------
// Trial and error

export const solvingLinearEquationsByTrialAndError = topic(
  "solving-linear-equations-by-trial-and-error",
  t("Solving Linear Equations by Trial and Error", "用试值法解一次方程"),
  t(
    "To solve an equation by trial and error, guess a value, substitute it, and compare the two sides. If they are not equal, use the result to make a better guess. For $4x + 3 = 31$, trying $x = 5$ gives $23$, which is too small; since $4x + 3$ grows as $x$ grows, try a larger value: $x = 7$ gives $31$, so $x = 7$.",
    "用试值法解方程时，先猜一个值，代入后比较两边。如果不相等，就根据结果做出更好的猜测。对于 $4x + 3 = 31$，试 $x = 5$ 得 $23$，太小了；因为 $x$ 变大时 $4x + 3$ 也变大，所以试一个更大的值：$x = 7$ 得 $31$，所以 $x = 7$。",
  ),
  ["identifying-solutions-to-linear-equations", "evaluating-expressions"],
  ["6.EE.B.5", "7.EE.B.4.A"],
  [
    {
      id: "improving-a-guess",
      title: t("Improving a guess", "改进猜测"),
      explanation: t(
        "After a guess, ask two questions: is the left side too small or too large, and does it grow or shrink when $x$ grows? In $-3x + 20 = 2$, the guess $x = 4$ gives $8$, which is too large. Because of the $-3$, the left side **shrinks** as $x$ grows, so the next guess should be **greater** than $4$. (Indeed, $x = 6$ works.)",
        "猜测之后要问两个问题：左边是太小还是太大？$x$ 变大时，左边变大还是变小？在 $-3x + 20 = 2$ 中，猜 $x = 4$ 得 $8$，太大了。由于系数是 $-3$，$x$ 变大时左边**变小**，所以下一个猜测应该**大于** $4$。（事实上 $x = 6$ 成立。）",
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const [name, pronoun] = rng.pick(people);
        const a = rng.sign() * rng.int(2, 9);
        const b = rng.nonZero(-20, 20);
        const s = rng.int(-6, 12);
        const c = a * s + b;
        const g = rng.bool(0.2) ? s : s + rng.nonZero(-4, 4);
        const value = a * g + b;
        const eq = `${linear(a, b)} = ${num(c)}`;
        const options = [
          t(`Greater than $${g}$`, `大于 $${g}$`),
          t(`Less than $${g}$`, `小于 $${g}$`),
          t(`$x = ${g}$ is the solution`, `$x = ${g}$ 就是解`),
        ];
        const correct = g === s ? 2 : g < s ? 0 : 1;
        const sub = `${substitutedLinear(a, g, b)} = ${num(value)}`;
        const size = value < c ? t("too small", "太小") : t("too large", "太大");
        const trend = a > 0 ? t("grows", "变大") : t("shrinks", "变小");
        return choiceProblem({
          prompt: t(
            `${name} solves $${eq}$ by trial and error. ${pronoun} first guess is $x = ${g}$. What should the next guess be?`,
            `${name} 用试值法解 $${eq}$，第一次猜 $x = ${g}$。下一次应该怎样猜？`,
          ),
          options,
          correct,
          solution:
            g === s
              ? t(
                  `Substitute: $${sub}$, which equals the right side, so $x = ${g}$ is the solution.`,
                  `代入：$${sub}$，等于右边，所以 $x = ${g}$ 就是解。`,
                )
              : t(
                  `Substitute: $${sub}$, which is ${size.en} compared with $${num(c)}$. As $x$ grows, $${linear(a, b)}$ ${trend.en}, so the next guess should be ${g < s ? "greater" : "less"} than $${g}$. (The solution is $x = ${s}$.)`,
                  `代入：$${sub}$，与 $${num(c)}$ 相比${size["zh-CN"]}。$x$ 变大时，$${linear(a, b)}$ ${trend["zh-CN"]}，所以下一个猜测应该${g < s ? "大于" : "小于"} $${g}$。（方程的解是 $x = ${s}$。）`,
                ),
        });
      },
    },
    {
      id: "finding-a-whole-number-solution",
      title: t("Finding a whole-number solution", "找出整数解"),
      explanation: t(
        "Try whole numbers and keep a table of both sides. For $5x - 4 = 2x + 11$:\n\n| $x$ | $5x - 4$ | $2x + 11$ |\n| :---: | :---: | :---: |\n| $3$ | $11$ | $17$ |\n| $4$ | $16$ | $19$ |\n| $5$ | $21$ | $21$ |\n\nThe gap between the sides shrinks by $3$ with each step, and at $x = 5$ the sides are equal.",
        "依次试整数，并把两边的值列成表。对于 $5x - 4 = 2x + 11$：\n\n| $x$ | $5x - 4$ | $2x + 11$ |\n| :---: | :---: | :---: |\n| $3$ | $11$ | $17$ |\n| $4$ | $16$ | $19$ |\n| $5$ | $21$ | $21$ |\n\n每试一步，两边的差减少 $3$，在 $x = 5$ 时两边相等。",
      ),
      generate(rng) {
        const s = rng.int(1, 12);
        if (rng.bool(0.5)) {
          const a = rng.int(2, 9);
          let c = rng.int(1, 8);
          while (c === a) c = rng.int(1, 8);
          const b = rng.nonZero(-15, 15);
          const d = (a - c) * s + b;
          const left = (x: number) => a * x + b;
          const right = (x: number) => c * x + d;
          const eq = `${linear(a, b)} = ${linear(c, d)}`;
          const rows = [s - 1, s, s + 1].filter((x) => x >= 0);
          const row = (x: number) => `${num(left(x))} ${x === s ? "=" : "\\ne"} ${num(right(x))}`;
          const table = t(
            rows.map((x) => `for $x = ${x}$, $${row(x)}$`).join("; "),
            rows.map((x) => `$x = ${x}$ 时，$${row(x)}$`).join("；"),
          );
          return numberProblem({
            prompt: t(`Use trial and error to find the whole number $x$ that solves $${eq}$.`, `用试值法求满足 $${eq}$ 的整数 $x$。`),
            answer: s,
            solveFor: "x",
            wrong: [frac(d - b, a + c), frac(d + b, a - c), -s],
            solution: t(
              `Substitute whole numbers into both sides: ${table.en}. The sides are equal at $x = ${s}$.`,
              `把整数代入两边：${table["zh-CN"]}。两边在 $x = ${s}$ 时相等。`,
            ),
          });
        }
        const a = rng.int(2, 6);
        const b = rng.nonZero(-6, 6);
        const k = rng.nonZero(-12, 12);
        const d = a * (s + b) + k;
        const left = (x: number) => a * (x + b) + k;
        const eq = `${a}(${linear(1, b)}) ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${num(d)}`;
        const rows = [s - 1, s, s + 1].filter((x) => x >= 0);
        const table = t(
          rows.map((x) => `for $x = ${x}$, it is $${num(left(x))}$`).join("; "),
          rows.map((x) => `$x = ${x}$ 时为 $${num(left(x))}$`).join("；"),
        );
        return numberProblem({
          prompt: t(`Use trial and error to find the whole number $x$ that solves $${eq}$.`, `用试值法求满足 $${eq}$ 的整数 $x$。`),
          answer: s,
          solveFor: "x",
          wrong: [frac(d - k - b, a), frac(d - k, a).add(Q.of(b)), frac(d + k, a).sub(Q.of(b))],
          solution: t(
            `Substitute whole numbers into the left side: ${table.en}. It equals $${num(d)}$ at $x = ${s}$.`,
            `把整数代入左边：${table["zh-CN"]}。在 $x = ${s}$ 时它等于 $${num(d)}$。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Fractional and decimal coefficients

/** fractionTerm writes (p/q)x with its sign: "\frac{2}{3}x", "-\frac{2}{3}x". */
const fractionTerm = (f: Q, v = "x") => `${f.sign() < 0 ? "-" : ""}${f.abs().toLatex()}${v}`;

export const solvingLinearEquationsWithFractionalCoefficients = topic(
  "solving-linear-equations-with-fractional-coefficients",
  t("Solving Linear Equations With Fractional Coefficients", "解分数系数的一次方程"),
  t(
    "When the coefficient of $x$ is a fraction, undo it by multiplying both sides by its reciprocal: $\\frac{2}{3}x - 4 = 6$ gives $\\frac{2}{3}x = 10$, so $x = \\frac{3}{2} \\cdot 10 = 15$. When several terms have fractions, multiply both sides by the least common denominator to clear them: $\\frac{x}{2} + \\frac{x}{3} = 10$ becomes $3x + 2x = 60$, so $x = 12$.",
    "当 $x$ 的系数是分数时，两边同时乘以它的倒数来消去它：由 $\\frac{2}{3}x - 4 = 6$ 得 $\\frac{2}{3}x = 10$，所以 $x = \\frac{3}{2} \\cdot 10 = 15$。当几项都含分数时，两边同时乘以最小公分母去掉分母：$\\frac{x}{2} + \\frac{x}{3} = 10$ 变为 $3x + 2x = 60$，所以 $x = 12$。",
  ),
  ["two-step-equations", "one-step-multiplication-equations-containing-fractions", "least-common-multiple"],
  ["7.EE.B.4.A"],
  [
    {
      id: "multiplying-by-the-reciprocal",
      title: t("Multiplying by the reciprocal", "乘以倒数"),
      explanation: t(
        "First undo the addition or subtraction, then multiply both sides by the reciprocal of the coefficient:\n\n$$-\\frac{3}{4}x + 5 = 11 \\;\\Rightarrow\\; -\\frac{3}{4}x = 6 \\;\\Rightarrow\\; x = -\\frac{4}{3} \\cdot 6 = -8.$$\n\nThe reciprocal of a negative fraction is negative.",
        "先抵消加减，再两边同时乘以系数的倒数：\n\n$$-\\frac{3}{4}x + 5 = 11 \\;\\Rightarrow\\; -\\frac{3}{4}x = 6 \\;\\Rightarrow\\; x = -\\frac{4}{3} \\cdot 6 = -8.$$\n\n负分数的倒数也是负数。",
      ),
      keyPrerequisites: ["one-step-multiplication-equations-containing-fractions", "two-step-equations"],
      generate(rng) {
        const q = rng.int(2, 6);
        let p = rng.int(1, 7);
        while (p % q === 0 || gcd(p, q) !== 1) p = rng.int(1, 7);
        const f = Q.of(rng.bool(0.3) ? -p : p, q);
        const m = rng.nonZero(-6, 6);
        const x = q * m;
        const b = rng.nonZero(-15, 15);
        const c = Number(f.mul(Q.of(x)).n) + b;
        const eq = `${fractionTerm(f)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(c)}`;
        const r = Q.one.div(f);
        return numberProblem({
          prompt: solveText(eq),
          answer: x,
          solveFor: "x",
          wrong: [Q.of(c - b).mul(f), r.mul(Q.of(c)).sub(Q.of(b)), r.mul(Q.of(c + b))],
          solution: t(
            `${moveConstant(b).en}, then multiply both sides by the reciprocal $${num(r)}$: ${steps(`${fractionTerm(f)} = ${num(c - b)}`, `x = ${num(r)} \\cdot ${paren(c - b)} = ${num(x)}`)}`,
            `${moveConstant(b)["zh-CN"]}，再同时乘以倒数 $${num(r)}$：${steps(`${fractionTerm(f)} = ${num(c - b)}`, `x = ${num(r)} \\cdot ${paren(c - b)} = ${num(x)}`)}`,
          ),
        });
      },
    },
    {
      id: "clearing-denominators",
      title: t("Clearing the denominators", "去分母"),
      explanation: t(
        "If $x$ appears in two terms with different denominators, multiply **every** term on both sides by the least common denominator:\n\n$$\\frac{x}{4} - \\frac{x}{6} = 2 \\;\\xrightarrow{\\times 12}\\; 3x - 2x = 24 \\;\\Rightarrow\\; x = 24.$$\n\nAdding the denominators, as in $\\frac{x}{4 + 6}$, is a mistake.",
        "如果 $x$ 出现在分母不同的两项中，把两边的**每一项**都乘以最小公分母：\n\n$$\\frac{x}{4} - \\frac{x}{6} = 2 \\;\\xrightarrow{\\times 12}\\; 3x - 2x = 24 \\;\\Rightarrow\\; x = 24.$$\n\n把分母相加（例如写成 $\\frac{x}{4 + 6}$）是错误的。",
      ),
      keyPrerequisites: ["least-common-multiple"],
      generate(rng) {
        let a = rng.int(2, 6);
        let b = rng.int(2, 8);
        while (a === b || lcm(a, b) > 24) [a, b] = [rng.int(2, 6), rng.int(2, 8)];
        const minus = rng.bool(0.4);
        if (minus && a > b) [a, b] = [b, a];
        const L = lcm(a, b);
        const k = L / a + (minus ? -L / b : L / b);
        const x = L * rng.nonZero(-4, 4);
        const c = Q.of(x, a).add(Q.of(minus ? -x : x, b));
        const eq = `\\frac{x}{${a}} ${minus ? "-" : "+"} \\frac{x}{${b}} = ${num(c)}`;
        const Lc = c.mul(Q.of(L));
        return numberProblem({
          prompt: solveText(eq),
          answer: x,
          solveFor: "x",
          // x/(a + b) = c, forgetting to multiply the right side by L, and adding numerators and denominators (2x/(a + b) = c).
          wrong: [
            c.mul(Q.of(minus ? b - a : a + b)),
            c.div(Q.of(k)),
            ...(minus ? [c.mul(Q.of(L)).div(Q.of(L / a + L / b))] : [c.mul(Q.of(a + b, 2))]),
          ],
          solution: t(
            `Multiply every term by the least common denominator $${L}$, then solve: ${steps(`${poly([L / a, "x"], [minus ? -L / b : L / b, "x"])} = ${num(Lc)}`, ...isolated(k, num(Lc), num(x)))}`,
            `每一项都乘以最小公分母 $${L}$，再求解：${steps(`${poly([L / a, "x"], [minus ? -L / b : L / b, "x"])} = ${num(Lc)}`, ...isolated(k, num(Lc), num(x)))}`,
          ),
        });
      },
    },
  ],
);

/** decTerm writes a decimal coefficient times a variable, with its sign: "0.4x", "-1.25x". */
const decTerm = (a: Q, v = "x") => `${a.eq(Q.one) ? "" : a.eq(Q.one.neg()) ? "-" : dec(a)}${v}`;

/** decLinear writes a·x + b with decimal numbers. */
const decLinear = (a: Q, b: Q) => (b.isZero() ? decTerm(a) : `${decTerm(a)} ${b.sign() < 0 ? "-" : "+"} ${dec(b.abs())}`);

/** tenths draws a number of tenths between lo and hi that is not a whole number. */
function tenths(rng: Rng, lo: number, hi: number): Q {
  let n = rng.int(lo * 10, hi * 10);
  while (n % 10 === 0) n = rng.int(lo * 10, hi * 10);
  return Q.of(n, 10);
}

/** niceDecimals are coefficients with one or two decimal places. */
const niceDecimals = [0.05, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.75, 0.8, 1.2, 1.25, 1.5, 1.75, 2.5].map((d) =>
  Q.of(Math.round(d * 100), 100),
);

export const solvingLinearEquationsWithDecimalCoefficients = topic(
  "solving-linear-equations-with-decimal-coefficients",
  t("Solving Linear Equations With Decimal Coefficients", "解小数系数的一次方程"),
  t(
    "Equations with decimals are solved with the same steps as other linear equations: $0.4x + 1.2 = 3.6$ gives $0.4x = 2.4$, so $x = 2.4 \\div 0.4 = 6$. To avoid decimal arithmetic, multiply every term by $10$ or $100$ first: $4x + 12 = 36$ has the same solution.",
    "含小数的方程与其他一次方程的解法相同：由 $0.4x + 1.2 = 3.6$ 得 $0.4x = 2.4$，所以 $x = 2.4 \\div 0.4 = 6$。为了避免小数运算，可以先把每一项都乘以 $10$ 或 $100$：$4x + 12 = 36$ 的解相同。",
  ),
  ["two-step-equations", "decimal-arithmetic"],
  ["7.EE.B.4.A"],
  [
    {
      id: "tenths",
      title: t("Coefficients in tenths", "一位小数的系数"),
      explanation: t(
        "Undo the addition or subtraction, then divide by the coefficient. Or multiply **every** term by $10$ first:\n\n$$1.5x - 0.7 = 3.8 \\;\\xrightarrow{\\times 10}\\; 15x - 7 = 38 \\;\\Rightarrow\\; 15x = 45 \\;\\Rightarrow\\; x = 3.$$",
        "先抵消加减，再除以系数。也可以先把**每一项**都乘以 $10$：\n\n$$1.5x - 0.7 = 3.8 \\;\\xrightarrow{\\times 10}\\; 15x - 7 = 38 \\;\\Rightarrow\\; 15x = 45 \\;\\Rightarrow\\; x = 3.$$",
      ),
      keyPrerequisites: ["decimal-arithmetic", "two-step-equations"],
      generate(rng) {
        const a = tenths(rng, 0, 3).mul(Q.of(rng.bool(0.3) ? -1 : 1));
        const x = Q.of(rng.bool(0.25) ? rng.nonZero(-9, 9) * 2 + 1 : rng.nonZero(-10, 10) * 2, 2);
        const b = Q.of(rng.nonZero(-60, 60), 10);
        const c = a.mul(x).add(b);
        const divisor = a.sign() < 0 ? `(${dec(a)})` : dec(a);
        const eq = `${decLinear(a, b)} = ${dec(c)}`;
        const ten = Q.of(10);
        return numberProblem({
          prompt: solveText(eq),
          answer: x,
          solveFor: "x",
          wrong: [c.add(b).div(a), c.div(a).sub(b), c.mul(ten).sub(b).div(a.mul(ten))],
          solution: t(
            `${moveConstant(b).en}, then divide by $${dec(a)}$: ${steps(`${decTerm(a)} = ${dec(c.sub(b))}`, `x = ${dec(c.sub(b))} \\div ${divisor} = ${dec(x)}`)}`,
            `${moveConstant(b)["zh-CN"]}，再除以 $${dec(a)}$：${steps(`${decTerm(a)} = ${dec(c.sub(b))}`, `x = ${dec(c.sub(b))} \\div ${divisor} = ${dec(x)}`)}`,
          ),
        });
      },
    },
    {
      id: "hundredths-on-both-sides",
      title: t("Hundredths and variables on both sides", "两位小数且两边都有变量"),
      explanation: t(
        "Multiplying both sides of an equation by the same number keeps it balanced, so decimals can be cleared first. Choose the power of ten that matches the most decimal places in any term.\n\nWith hundredths, multiply every term on both sides by $100$, then solve as usual:\n\n$$0.25x + 1.5 = 0.1x + 3 \\;\\xrightarrow{\\times 100}\\; 25x + 150 = 10x + 300 \\;\\Rightarrow\\; 15x = 150 \\;\\Rightarrow\\; x = 10.$$",
        "方程两边同时乘同一个数，方程仍然成立，所以可以先去掉小数。所乘的 $10$ 的幂要与各项中最多的小数位数相对应。\n\n含两位小数时，把两边的每一项都乘以 $100$，再照常求解：\n\n$$0.25x + 1.5 = 0.1x + 3 \\;\\xrightarrow{\\times 100}\\; 25x + 150 = 10x + 300 \\;\\Rightarrow\\; 15x = 150 \\;\\Rightarrow\\; x = 10.$$",
      ),
      generate(rng) {
        const [a, c] = rng.sample(niceDecimals, 2) as [Q, Q];
        const x = rng.nonZero(-12, 12);
        const b = Q.of(rng.nonZero(-50, 50), 10);
        const d = a.sub(c).mul(Q.of(x)).add(b);
        const hundred = Q.of(100);
        const eq = `${decLinear(a, b)} = ${decLinear(c, d)}`;
        const [A, B, C, D] = [a, b, c, d].map((v) => v.mul(hundred)) as [Q, Q, Q, Q];
        return numberProblem({
          prompt: solveText(eq),
          answer: x,
          solveFor: "x",
          wrong: [-x, d.sub(b).div(a.add(c)), d.add(b).div(a.sub(c))],
          solution: t(
            `Multiply every term by $100$, collect $x$ on the left, then solve: ${steps(`${linear(A, B)} = ${linear(C, D)}`, `${poly([A.sub(C), "x"])} = ${num(D.sub(B))}`, `x = ${x}`)}`,
            `每一项都乘以 $100$，把 $x$ 移到左边，再求解：${steps(`${linear(A, B)} = ${linear(C, D)}`, `${poly([A.sub(C), "x"])} = ${num(D.sub(B))}`, `x = ${x}`)}`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Rational expressions and cross-multiplication

export const solvingLinearEquationsByClearingARationalExpression = topic(
  "solving-linear-equations-by-clearing-a-rational-expression",
  t("Solving Linear Equations by Clearing a Rational Expression", "去分母解一次方程"),
  t(
    "When one side is a fraction such as $\\frac{2x + 1}{3}$, multiply both sides by the denominator to clear it. The fraction bar groups the whole numerator, so $\\frac{2x + 1}{3} = 5$ becomes $2x + 1 = 15$, and $x = 7$. If the other side is an expression, multiply all of it: $\\frac{x + 9}{2} = x + 3$ becomes $x + 9 = 2(x + 3) = 2x + 6$, so $x = 3$.",
    "当一边是 $\\frac{2x + 1}{3}$ 这样的分数时，两边同时乘以分母把它去掉。分数线把整个分子看作一个整体，所以 $\\frac{2x + 1}{3} = 5$ 变为 $2x + 1 = 15$，$x = 7$。如果另一边是一个式子，要乘以整个式子：$\\frac{x + 9}{2} = x + 3$ 变为 $x + 9 = 2(x + 3) = 2x + 6$，所以 $x = 3$。",
  ),
  ["equations-with-parentheses"],
  ["7.EE.B.4.A", "8.EE.C.7.B"],
  [
    {
      id: "a-fraction-equal-to-a-number",
      title: t("A fraction equal to a number", "分数等于一个数"),
      explanation: t(
        "Multiply both sides by the denominator first, then solve the two-step equation that remains:\n\n$$\\frac{3x - 4}{5} = -2 \\;\\Rightarrow\\; 3x - 4 = -10 \\;\\Rightarrow\\; 3x = -6 \\;\\Rightarrow\\; x = -2.$$\n\nSubtracting the $4$ before clearing the denominator is a mistake: the $4$ is divided by $5$ too.",
        "先两边同时乘以分母，再解剩下的两步方程：\n\n$$\\frac{3x - 4}{5} = -2 \\;\\Rightarrow\\; 3x - 4 = -10 \\;\\Rightarrow\\; 3x = -6 \\;\\Rightarrow\\; x = -2.$$\n\n在去分母之前就减去 $4$ 是错误的：$4$ 也被 $5$ 除了。",
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        for (;;) {
          const a = rng.sign() * rng.int(1, 6);
          const c = rng.int(2, 9);
          const x = rng.nonZero(-10, 10);
          const d = rng.nonZero(-9, 9);
          const b = c * d - a * x;
          if (b === 0 || Math.abs(b) > 40) continue;
          const left = `\\frac{${linear(a, b)}}{${c}}`;
          const eq = rng.bool(0.75) ? `${left} = ${num(d)}` : `${num(d)} = ${left}`;
          return numberProblem({
            prompt: solveText(eq),
            answer: x,
            solveFor: "x",
            wrong: [frac((d - b) * c, a), Q.of(d, c).sub(Q.of(b)).div(Q.of(a)), frac(c * d + b, a)],
            solution: t(
              `Multiply both sides by $${c}$, then solve: ${steps(`${linear(a, b)} = ${num(c * d)}`, ...isolated(a, num(c * d - b), num(x)))}`,
              `两边同时乘以 $${c}$，再求解：${steps(`${linear(a, b)} = ${num(c * d)}`, ...isolated(a, num(c * d - b), num(x)))}`,
            ),
          });
        }
      },
    },
    {
      id: "a-fraction-equal-to-an-expression",
      title: t("A fraction equal to an expression", "分数等于一个式子"),
      explanation: t(
        "When the other side has several terms, multiply **all** of it by the denominator, using parentheses:\n\n$$\\frac{5x + 2}{3} = x - 2 \\;\\Rightarrow\\; 5x + 2 = 3(x - 2) \\;\\Rightarrow\\; 5x + 2 = 3x - 6 \\;\\Rightarrow\\; x = -4.$$\n\nWriting $5x + 2 = 3x - 2$ multiplies only the first term.",
        "当另一边有几项时，要用括号把它**整个**乘以分母：\n\n$$\\frac{5x + 2}{3} = x - 2 \\;\\Rightarrow\\; 5x + 2 = 3(x - 2) \\;\\Rightarrow\\; 5x + 2 = 3x - 6 \\;\\Rightarrow\\; x = -4.$$\n\n写成 $5x + 2 = 3x - 2$ 就只乘了第一项。",
      ),
      keyPrerequisites: ["equations-with-parentheses"],
      generate(rng) {
        for (;;) {
          const c = rng.int(2, 6);
          const e = rng.nonZero(-3, 3);
          const a = rng.nonZero(-9, 9);
          if (a === c * e || a === e) continue;
          const f = rng.nonZero(-9, 9);
          const x = rng.nonZero(-8, 8);
          const b = c * (e * x + f) - a * x;
          if (b === 0 || Math.abs(b) > 40) continue;
          const eq = `\\frac{${linear(a, b)}}{${c}} = ${linear(e, f)}`;
          return numberProblem({
            prompt: solveText(eq),
            answer: x,
            solveFor: "x",
            wrong: [frac(f - b, a - c * e), frac(f - b, a - e), frac(c * f + b, c * e - a)],
            solution: t(
              `Multiply both sides by $${c}$, distributing over the right side, then solve: ${steps(`${linear(a, b)} = ${c}(${linear(e, f)})`, `${linear(a, b)} = ${linear(c * e, c * f)}`, ...isolated(a - c * e, num(c * f - b), num(x)))}`,
              `两边同时乘以 $${c}$（右边每一项都要乘），再求解：${steps(`${linear(a, b)} = ${c}(${linear(e, f)})`, `${linear(a, b)} = ${linear(c * e, c * f)}`, ...isolated(a - c * e, num(c * f - b), num(x)))}`,
            ),
          });
        }
      },
    },
  ],
);

export const solvingLinearEquationsUsingCrossMultiplication = topic(
  "solving-linear-equations-using-cross-multiplication",
  t("Solving Linear Equations Using Cross-Multiplication", "用交叉相乘解一次方程"),
  t(
    "An equation of two fractions, $\\frac{a}{b} = \\frac{c}{d}$, is true exactly when $ad = bc$. Cross-multiplying clears both denominators at once: $\\frac{x + 1}{4} = \\frac{x - 2}{3}$ becomes $3(x + 1) = 4(x - 2)$, so $3x + 3 = 4x - 8$ and $x = 11$. Each numerator is multiplied by the other fraction's denominator, as a whole.",
    "两个分数相等的方程 $\\frac{a}{b} = \\frac{c}{d}$ 成立，当且仅当 $ad = bc$。交叉相乘可以一次去掉两个分母：$\\frac{x + 1}{4} = \\frac{x - 2}{3}$ 变为 $3(x + 1) = 4(x - 2)$，于是 $3x + 3 = 4x - 8$，$x = 11$。每个分子要整体乘以另一个分数的分母。",
  ),
  ["solving-linear-equations-by-clearing-a-rational-expression", "proportions"],
  ["7.EE.B.4.A", "8.EE.C.7.B"],
  [
    {
      id: "a-binomial-over-a-number",
      title: t("A binomial over a number", "二项式除以一个数"),
      explanation: t(
        "Multiply each numerator by the denominator on the other side:\n\n$$\\frac{x - 3}{6} = \\frac{5}{2} \\;\\Rightarrow\\; 2(x - 3) = 6 \\cdot 5 \\;\\Rightarrow\\; 2x - 6 = 30 \\;\\Rightarrow\\; x = 18.$$\n\nThe $2$ multiplies the whole numerator $x - 3$.",
        "把每个分子都乘以另一边的分母：\n\n$$\\frac{x - 3}{6} = \\frac{5}{2} \\;\\Rightarrow\\; 2(x - 3) = 6 \\cdot 5 \\;\\Rightarrow\\; 2x - 6 = 30 \\;\\Rightarrow\\; x = 18.$$\n\n$2$ 要乘以整个分子 $x - 3$。",
      ),
      keyPrerequisites: ["proportions"],
      generate(rng) {
        for (;;) {
          const e = rng.int(2, 5);
          const m = rng.int(2, 3);
          const c = e * m;
          const d = rng.nonZero(-9, 9);
          if (gcd(Math.abs(d), e) !== 1) continue;
          const b = rng.nonZero(-9, 9);
          const x = m * d - b;
          if (x === 0) continue;
          const left = `\\frac{${linear(1, b)}}{${c}}`;
          const right = `${d < 0 ? "-" : ""}\\frac{${Math.abs(d)}}{${e}}`;
          const eq = rng.bool(0.75) ? `${left} = ${right}` : `${right} = ${left}`;
          return numberProblem({
            prompt: solveText(eq),
            answer: x,
            solveFor: "x",
            wrong: [frac(e * d, c).sub(Q.of(b)), frac(c * d - b, e), c * d - b],
            solution: t(
              `Cross-multiply, then solve: ${steps(`${e}(${linear(1, b)}) = ${c} \\cdot ${paren(d)}`, `${linear(e, e * b)} = ${num(c * d)}`, ...isolated(e, num(c * d - e * b), num(x)))}`,
              `交叉相乘，再求解：${steps(`${e}(${linear(1, b)}) = ${c} \\cdot ${paren(d)}`, `${linear(e, e * b)} = ${num(c * d)}`, ...isolated(e, num(c * d - e * b), num(x)))}`,
            ),
          });
        }
      },
    },
    {
      id: "binomials-on-both-sides",
      title: t("Binomials on both sides", "两边都是二项式"),
      explanation: t(
        "Cross-multiply with parentheses, expand both sides, then collect $x$ on one side:\n\n$$\\frac{x + 4}{3} = \\frac{x - 1}{2} \\;\\Rightarrow\\; 2(x + 4) = 3(x - 1) \\;\\Rightarrow\\; 2x + 8 = 3x - 3 \\;\\Rightarrow\\; x = 11.$$\n\nMultiplying each numerator by its **own** denominator, as in $3(x + 4) = 2(x - 1)$, is a mistake.",
        "带括号交叉相乘，展开两边，再把 $x$ 移到一边：\n\n$$\\frac{x + 4}{3} = \\frac{x - 1}{2} \\;\\Rightarrow\\; 2(x + 4) = 3(x - 1) \\;\\Rightarrow\\; 2x + 8 = 3x - 3 \\;\\Rightarrow\\; x = 11.$$\n\n把每个分子乘以**自己的**分母（例如写成 $3(x + 4) = 2(x - 1)$）是错误的。",
      ),
      generate(rng) {
        for (;;) {
          const [c, e] = rng.sample([2, 3, 4, 5, 6, 7], 2) as [number, number];
          const k = rng.nonZero(-4, 4);
          const x = rng.nonZero(-12, 12);
          const b = c * k - x;
          const d = e * k - x;
          if (b === 0 || d === 0 || Math.abs(b) > 20 || Math.abs(d) > 20) continue;
          const eq = `\\frac{${linear(1, b)}}{${c}} = \\frac{${linear(1, d)}}{${e}}`;
          return numberProblem({
            prompt: solveText(eq),
            answer: x,
            solveFor: "x",
            wrong: [frac(d - b, e - c), frac(e * d - c * b, c - e), -x],
            solution: t(
              `Cross-multiply, expand, and collect $x$ on the left: ${steps(`${e}(${linear(1, b)}) = ${c}(${linear(1, d)})`, `${linear(e, e * b)} = ${linear(c, c * d)}`, ...isolated(e - c, num(c * d - e * b), num(x)))}`,
              `交叉相乘、展开，再把 $x$ 移到左边：${steps(`${e}(${linear(1, b)}) = ${c}(${linear(1, d)})`, `${linear(e, e * b)} = ${linear(c, c * d)}`, ...isolated(e - c, num(c * d - e * b), num(x)))}`,
            ),
          });
        }
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Two-variable linear equations

/** std writes a·x + b·y = c. */
const std = (a: number, b: number, c: number) => `${poly([a, "x"], [b, "y"])} = ${num(c)}`;

/** pair writes an ordered pair. */
const pair = (x: number, y: number) => `(${num(x)}, ${num(y)})`;

/** check writes the substitution of (x, y) into a·x + b·y. */
const check = (a: number, b: number, x: number, y: number) => `${times(a, x)} ${plusTimes(b, y)} = ${num(a * x + b * y)}`;

/** substitutedLinear writes a·v + b with the value v substituted: "3(-2) + 5". */
const substitutedLinear = (a: number, v: number, b: number) => `${times(a, v)}${b === 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b)}`}`;

/** TwoVariableEquation is a·x + b·y = c, written in standard form or solved for y. */
interface TwoVariableEquation {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly latex: string;
}

/** twoVariableEquation draws an equation through the integer point (x, y). */
function twoVariableEquation(rng: Rng, x: number, y: number): TwoVariableEquation {
  if (rng.bool(0.35)) {
    const m = rng.nonZero(-5, 5);
    const k = y - m * x;
    // y = m·x + k is −m·x + y = k.
    return { a: -m, b: 1, c: k, latex: `y = ${linear(m, k)}` };
  }
  const a = rng.nonZero(-6, 6);
  const b = rng.nonZero(-6, 6);
  return { a, b, c: a * x + b * y, latex: std(a, b, a * x + b * y) };
}

export const twoVariableLinearEquationsAndTheirSolutions = topic(
  "two-variable-linear-equations-and-their-solutions",
  t("Two-Variable Linear Equations and Their Solutions", "二元一次方程及其解"),
  t(
    "A linear equation in two variables, such as $2x + 3y = 12$, has ordered pairs $(x, y)$ as solutions: a pair is a solution when substituting $x$ and $y$ makes the equation true. $(3, 2)$ is a solution because $2(3) + 3(2) = 12$, but $(2, 3)$ is not, because $2(2) + 3(3) = 13$. Such an equation has infinitely many solutions.",
    "二元一次方程（例如 $2x + 3y = 12$）的解是有序数对 $(x, y)$：代入 $x$ 和 $y$ 后方程成立的数对就是解。$(3, 2)$ 是解，因为 $2(3) + 3(2) = 12$；但 $(2, 3)$ 不是，因为 $2(2) + 3(3) = 13$。这样的方程有无穷多个解。",
  ),
  ["introduction-to-two-variable-equations", "evaluating-expressions"],
  ["6.EE.C.9", "8.EE.C.8.A"],
  [
    {
      id: "checking-an-ordered-pair",
      title: t("Checking an ordered pair", "检验有序数对"),
      explanation: t(
        "In an ordered pair $(x, y)$, the first number is $x$ and the second is $y$. Substitute both and check whether the two sides are equal. For $y = 3x - 5$ and $(2, 1)$: $3(2) - 5 = 1$, so $(2, 1)$ is a solution; $(1, 2)$ is not, because $3(1) - 5 = -2$.",
        "有序数对 $(x, y)$ 中，第一个数是 $x$，第二个数是 $y$。把两个数都代入，看两边是否相等。对于 $y = 3x - 5$ 和 $(2, 1)$：$3(2) - 5 = 1$，所以 $(2, 1)$ 是解；$(1, 2)$ 不是，因为 $3(1) - 5 = -2$。",
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const x0 = rng.int(-6, 6);
        const y0 = rng.int(-6, 6);
        const e = twoVariableEquation(rng, x0, y0);
        const kind = rng.int(0, 2);
        let [x, y] = [x0, y0];
        if (kind === 1 && x0 !== y0) [x, y] = [y0, x0];
        else if (kind > 0) y = y0 + rng.nonZero(-3, 3);
        const value = e.a * x + e.b * y;
        const yes = value === e.c;
        const solved = e.latex.startsWith("y =");
        const work = solved ? `${substitutedLinear(-e.a, x, e.c)} = ${num(-e.a * x + e.c)}` : check(e.a, e.b, x, y);
        return choiceProblem({
          prompt: t(`Is $${pair(x, y)}$ a solution of $${e.latex}$?`, `$${pair(x, y)}$ 是 $${e.latex}$ 的解吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: solved
            ? t(
                `Substitute $x = ${num(x)}$ into the right side: $${work}$. ${yes ? `This equals $y = ${num(y)}$, so the pair is a solution.` : `This is not $y = ${num(y)}$, so the pair is not a solution.`}`,
                `把 $x = ${num(x)}$ 代入右边：$${work}$。${yes ? `它等于 $y = ${num(y)}$，所以这个数对是解。` : `它不等于 $y = ${num(y)}$，所以这个数对不是解。`}`,
              )
            : t(
                `Substitute $x = ${num(x)}$ and $y = ${num(y)}$: $${work}$. ${yes ? `This equals $${num(e.c)}$, so the pair is a solution.` : `This is not $${num(e.c)}$, so the pair is not a solution.`}`,
                `代入 $x = ${num(x)}$，$y = ${num(y)}$：$${work}$。${yes ? `它等于 $${num(e.c)}$，所以这个数对是解。` : `它不等于 $${num(e.c)}$，所以这个数对不是解。`}`,
              ),
        });
      },
    },
    {
      id: "choosing-a-solution",
      title: t("Choosing a solution", "选出方程的解"),
      explanation: t(
        "To find which of several pairs is a solution, substitute each one. Watch the order: $(4, -1)$ means $x = 4$ and $y = -1$. For $x - 2y = 6$: $(4, -1)$ gives $4 - 2(-1) = 6$ ✓, while $(-1, 4)$ gives $-1 - 8 = -9$.",
        "要判断几个数对中哪个是解，就逐个代入。注意顺序：$(4, -1)$ 表示 $x = 4$，$y = -1$。对于 $x - 2y = 6$：$(4, -1)$ 得 $4 - 2(-1) = 6$ ✓，而 $(-1, 4)$ 得 $-1 - 8 = -9$。",
      ),
      generate(rng) {
        for (;;) {
          const x = rng.int(-6, 6);
          const y = rng.int(-6, 6);
          if (x === y) continue;
          const a = rng.nonZero(-6, 6);
          const b = rng.nonZero(-6, 6);
          const c = a * x + b * y;
          const candidates: [number, number][] = [
            [y, x],
            [x, -y],
            [-x, y],
            [x, y + rng.nonZero(-2, 2)],
            [x + 1, y],
          ];
          const wrong = candidates.filter(([p, q]) => a * p + b * q !== c).map(([p, q]) => mathText(pair(p, q)));
          if (new Set(wrong.map((w) => w.en)).size < 3) continue;
          const eq = std(a, b, c);
          return pickChoice(
            rng,
            t(`Which ordered pair is a solution of $${eq}$?`, `哪个有序数对是 $${eq}$ 的解？`),
            mathText(pair(x, y)),
            wrong,
            t(
              `Substitute $x = ${num(x)}$ and $y = ${num(y)}$: $${check(a, b, x, y)}$, so $${pair(x, y)}$ is a solution. None of the other pairs gives $${num(c)}$.`,
              `代入 $x = ${num(x)}$，$y = ${num(y)}$：$${check(a, b, x, y)}$，所以 $${pair(x, y)}$ 是解。其他数对代入后的值都不等于 $${num(c)}$。`,
            ),
          );
        }
      },
    },
  ],
);

export const solvingTwoVariableEquations = topic(
  "solving-two-variable-equations",
  t("Solving Two-Variable Equations", "解二元方程"),
  t(
    "If one variable of a two-variable equation is known, substitute it and solve the one-variable equation that is left: in $3x + 2y = 16$ with $x = 4$, $12 + 2y = 16$, so $y = 2$. You can also solve for $y$ in terms of $x$: $3x + y = 7$ gives $y = -3x + 7$, which gives $y$ directly for any $x$.",
    "如果二元方程中一个变量的值已知，就把它代入，解剩下的一元方程：在 $3x + 2y = 16$ 中，若 $x = 4$，则 $12 + 2y = 16$，所以 $y = 2$。也可以用 $x$ 表示 $y$：由 $3x + y = 7$ 得 $y = -3x + 7$，对任意 $x$ 都能直接算出 $y$。",
  ),
  ["two-variable-linear-equations-and-their-solutions", "two-step-equations"],
  ["6.EE.C.9", "7.EE.B.4.A"],
  [
    {
      id: "finding-the-missing-coordinate",
      title: t("Finding the missing coordinate", "求缺少的坐标"),
      explanation: t(
        "An ordered pair is a solution of an equation in two variables when its coordinates make the equation true. If one coordinate is known, substitute it, and the equation becomes one with a single variable.\n\n$(-2, y)$ is a solution of $4x - 3y = 10$. Substitute $x = -2$ and solve for $y$:\n\n$$4(-2) - 3y = 10 \\;\\Rightarrow\\; -8 - 3y = 10 \\;\\Rightarrow\\; -3y = 18 \\;\\Rightarrow\\; y = -6.$$",
        "如果一个有序数对的坐标能使二元方程成立，它就是方程的解。已知一个坐标时，把它代入，方程就变成只含一个未知数的方程。\n\n$(-2, y)$ 是 $4x - 3y = 10$ 的解。代入 $x = -2$，再解出 $y$：\n\n$$4(-2) - 3y = 10 \\;\\Rightarrow\\; -8 - 3y = 10 \\;\\Rightarrow\\; -3y = 18 \\;\\Rightarrow\\; y = -6.$$",
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const x = rng.int(-6, 6);
        const y = rng.int(-6, 6);
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-6, 6);
        const c = a * x + b * y;
        const eq = std(a, b, c);
        const findY = rng.bool();
        const [known, unknown, kc, uc, kv, uv] = findY ? ["x", "y", a, b, x, y] : ["y", "x", b, a, y, x];
        const shown = findY ? `(${num(x)}, y)` : `(x, ${num(y)})`;
        const left = findY
          ? `${times(a, x)} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}y`
          : `${poly([a, "x"])} ${plusTimes(b, y)}`;
        return numberProblem({
          prompt: t(
            `The ordered pair $${shown}$ is a solution of $${eq}$. Find $${unknown}$.`,
            `有序数对 $${shown}$ 是 $${eq}$ 的解。求 $${unknown}$。`,
          ),
          answer: uv,
          solveFor: unknown,
          wrong: [frac(c + kc * kv, uc), frac(c - uc * kv, kc), c - kc * kv],
          solution: t(
            `Substitute $${known} = ${num(kv)}$ and solve: ${steps(`${left} = ${num(c)}`, ...isolated(uc, num(c - kc * kv), num(uv), unknown))}`,
            `代入 $${known} = ${num(kv)}$，再求解：${steps(`${left} = ${num(c)}`, ...isolated(uc, num(c - kc * kv), num(uv), unknown))}`,
          ),
        });
      },
    },
    {
      id: "solving-for-y",
      title: t("Solving for y", "用 x 表示 y"),
      explanation: t(
        "To solve for $y$, get $y$ alone: move the $x$-term to the other side by doing the opposite operation, then divide **every** term by the coefficient of $y$:\n\n$$6x + 2y = 10 \\;\\Rightarrow\\; 2y = -6x + 10 \\;\\Rightarrow\\; y = -3x + 5.$$",
        "用 $x$ 表示 $y$，就是让 $y$ 单独在一边：用相反的运算把含 $x$ 的项移到另一边，再把**每一项**都除以 $y$ 的系数：\n\n$$6x + 2y = 10 \\;\\Rightarrow\\; 2y = -6x + 10 \\;\\Rightarrow\\; y = -3x + 5.$$",
      ),
      generate(rng) {
        const b = rng.pick([1, -1, 2, -2, 3, -3, 4, 5]);
        const m = rng.nonZero(-6, 6);
        const k = rng.nonZero(-8, 8);
        // a·x + b·y = c with y = m·x + k: a = −b·m, c = b·k.
        const a = -b * m;
        const c = b * k;
        const xFirst = rng.bool(0.7);
        const lhs = xFirst ? poly([a, "x"], [b, "y"]) : poly([b, "y"], [a, "x"]);
        const eq = `${lhs} = ${num(c)}`;
        const answer = linear(m, k);
        return expressionProblem({
          prompt: t(`Solve $${eq}$ for $y$.`, `把方程 $${eq}$ 写成用 $x$ 表示 $y$ 的形式。`),
          answer,
          prefix: "y =",
          wrong: [linear(-m, k), linear(-a, k), linear(m, c), linear(-m, -k)],
          solution: t(
            `${a > 0 ? `Subtract $${side(a)}$ from` : `Add $${side(-a)}$ to`} both sides${b === 1 ? "" : `, then divide every term by $${num(b)}$`}: ${steps(`${poly([b, "y"])} = ${linear(-a, c)}`, ...(b === 1 ? [] : [`y = ${answer}`]))}`,
            `两边同时${a > 0 ? `减去 $${side(a)}$` : `加上 $${side(-a)}$`}${b === 1 ? "" : `，再把每一项都除以 $${num(b)}$`}：${steps(`${poly([b, "y"])} = ${linear(-a, c)}`, ...(b === 1 ? [] : [`y = ${answer}`]))}`,
          ),
        });
      },
    },
  ],
);

/** LatticeLine is the line y = m·x + b with the integer points on it inside the view from −8 to 8. */
interface LatticeLine {
  readonly m: Q;
  readonly b: number;
  readonly points: readonly [number, number][];
}

/** latticeLine draws a line with a small slope and an integer y-intercept, with at least three integer points in view. */
function latticeLine(rng: Rng): LatticeLine {
  const slopes = [-3, -2, -1, 1, 2, 3].map((n) => Q.of(n)).concat([Q.of(1, 2), Q.of(-1, 2)]);
  const m = rng.pick(slopes);
  const b = rng.int(-4, 4);
  const points: [number, number][] = [];
  for (let x = -8; x <= 8; x++) {
    const y = m.mul(Q.of(x)).add(Q.of(b));
    if (y.isInteger() && Math.abs(y.toNumber()) <= 7 && Math.abs(x) <= 7) points.push([x, y.toNumber()]);
  }
  return { m, b, points };
}

/** lineFigure graphs the line on a grid from −8 to 8, describing it by two of its integer points. */
function lineFigure(line: LatticeLine, described: readonly [number, number][]): Figure {
  const [p, q] = described as [[number, number], [number, number]];
  return {
    svg: plane({ xMin: -8, xMax: 8, yMin: -8, yMax: 8, step: 1, labelEvery: 2 }, [
      { kind: "line", a: [0, line.b], b: [2, line.m.mul(Q.of(2)).toNumber() + line.b], accent: true },
    ]),
    alt: t(
      `A coordinate grid from −8 to 8 with a straight line through the points (${p[0]}, ${p[1]}) and (${q[0]}, ${q[1]}).`,
      `从 −8 到 8 的坐标网格，一条直线经过点 (${p[0]}, ${p[1]}) 和 (${q[0]}, ${q[1]})。`,
    ),
  };
}

export const graphingLinearEquations = topic(
  "graphing-linear-equations",
  t("Graphing Linear Equations", "画一次方程的图像"),
  t(
    "The graph of an equation in $x$ and $y$ shows all of its solutions: every point $(x, y)$ on the graph is a solution, and every solution is a point on the graph. The graph of a linear equation is a straight line. To graph $y = 2x - 1$, make a table of a few solutions, such as $(0, -1)$, $(1, 1)$ and $(2, 3)$, plot them and draw the line through them.",
    "关于 $x$ 和 $y$ 的方程的图像表示它的所有解：图像上的每个点 $(x, y)$ 都是解，每个解也都是图像上的点。一次方程的图像是一条直线。画 $y = 2x - 1$ 的图像时，先列表求出几个解，例如 $(0, -1)$、$(1, 1)$、$(2, 3)$，描出这些点，再过这些点画直线。",
  ),
  ["solving-two-variable-equations", "the-cartesian-coordinate-system"],
  ["8.F.A.3", "HSA.REI.D.10"],
  [
    {
      id: "reading-a-solution-from-the-graph",
      title: t("Reading a solution from the graph", "从图像读出解"),
      explanation: t(
        "Each point on the line is a solution of its equation. To find $y$ for a given $x$, go from $x$ on the $x$-axis straight up or down to the line, then across to the $y$-axis. On a line through $(0, 3)$ and $(2, -1)$, the point above or below $x = 4$ is $(4, -5)$, so $y = -5$ when $x = 4$.",
        "直线上的每个点都是它的方程的解。要求某个 $x$ 对应的 $y$，从 $x$ 轴上的 $x$ 处竖直向上或向下到直线，再水平找到 $y$ 轴上的值。在经过 $(0, 3)$ 和 $(2, -1)$ 的直线上，$x = 4$ 处的点是 $(4, -5)$，所以当 $x = 4$ 时，$y = -5$。",
      ),
      keyPrerequisites: ["the-cartesian-coordinate-system"],
      generate(rng) {
        for (;;) {
          const line = latticeLine(rng);
          if (line.points.length < 4) continue;
          const [asked, ...rest] = rng.shuffle(line.points) as [[number, number], ...[number, number][]];
          const described = rest.slice(0, 2);
          const [x, y] = asked;
          const inverse = line.m.isZero() ? undefined : Q.of(x - line.b).div(line.m);
          return {
            ...numberProblem({
              prompt: t(
                `The graph shows a linear equation in $x$ and $y$. What is $y$ when $x = ${num(x)}$?`,
                `图像表示一个关于 $x$ 和 $y$ 的一次方程。当 $x = ${num(x)}$ 时，$y$ 是多少？`,
              ),
              answer: y,
              solveFor: "y",
              wrong: [...(inverse ? [inverse] : []), -y, line.m.mul(Q.of(x))],
              solution: t(
                `The point of the line at $x = ${num(x)}$ is $${pair(x, y)}$, so $y = ${num(y)}$.`,
                `直线在 $x = ${num(x)}$ 处的点是 $${pair(x, y)}$，所以 $y = ${num(y)}$。`,
              ),
            }),
            figure: lineFigure(line, described),
          };
        }
      },
    },
    {
      id: "matching-an-equation-to-its-graph",
      title: t("Matching an equation to its graph", "根据图像选方程"),
      explanation: t(
        "To check whether an equation has a given line as its graph, read two points of the line and substitute them. The line through $(0, 1)$ and $(2, 5)$ is the graph of $y = 2x + 1$: $2(0) + 1 = 1$ and $2(2) + 1 = 5$. It is not the graph of $y = x + 2$, because $(0, 1)$ does not satisfy it.",
        "要判断一个方程的图像是不是某条直线，读出直线上的两个点代入检验。经过 $(0, 1)$ 和 $(2, 5)$ 的直线是 $y = 2x + 1$ 的图像：$2(0) + 1 = 1$，$2(2) + 1 = 5$。它不是 $y = x + 2$ 的图像，因为 $(0, 1)$ 不满足这个方程。",
      ),
      generate(rng) {
        for (;;) {
          const line = latticeLine(rng);
          if (line.points.length < 3) continue;
          const { m, b } = line;
          const onAxis = line.points.find(([x]) => x === 0)!;
          const other = rng.pick(line.points.filter(([x]) => x !== 0));
          const correct = `y = ${linear(m, b)}`;
          // Swapping the slope and the intercept, and sign errors in either, are the usual misreadings.
          const shifts = b === 0 ? [Q.one, Q.one.neg()] : [Q.of(-b), Q.of(-b)];
          const wrong = [
            ...(m.isInteger() && b !== 0 && !m.eq(Q.of(b)) ? [`y = ${linear(b, m)}`] : []),
            `y = ${linear(m.neg(), b)}`,
            `y = ${linear(m, shifts[0]!)}`,
            `y = ${linear(m.neg(), shifts[1]!)}`,
          ];
          const [x2, y2] = other;
          return pickChoice(
            rng,
            t("Which equation has the line shown as its graph?", "哪个方程的图像是图中的直线？"),
            mathText(correct),
            wrong.map(mathText),
            t(
              `The line passes through $${pair(0, onAxis[1])}$ and $${pair(x2, y2)}$. Both satisfy $${correct}$: $y = ${num(b)}$ at $x = 0$, and $${num(m)} \\cdot ${paren(x2)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(y2)}$. Each of the other equations fails for at least one of these points.`,
              `直线经过 $${pair(0, onAxis[1])}$ 和 $${pair(x2, y2)}$。两点都满足 $${correct}$：$x = 0$ 时 $y = ${num(b)}$，且 $${num(m)} \\cdot ${paren(x2)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${num(y2)}$。其他方程至少有一个点不满足。`,
            ),
            lineFigure(line, [onAxis, other]),
          );
        }
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Inequalities

/** span is the set of numbers from lo to hi, each end included when closed. */
const span = (lo: number, loClosed: boolean, hi: number, hiClosed: boolean): Interval => ({
  lo: Q.of(lo),
  hi: Q.of(hi),
  loClosed,
  hiClosed,
});

/** lessOp draws < or ≤. */
const lessOp = (rng: Rng): InequalityOp => (rng.bool() ? "<" : "<=");

/** greaterOp draws > or ≥. */
const greaterOp = (rng: Rng): InequalityOp => (rng.bool() ? ">" : ">=");

export const compoundInequalities = topic(
  "compound-inequalities",
  t("Compound Inequalities", "复合不等式"),
  t(
    "A compound inequality joins two inequalities with “and” or “or”. $-2 < x \\le 5$ means $x > -2$ **and** $x \\le 5$: the numbers between $-2$ and $5$, including $5$. $x < -1 \\text{ or } x \\ge 3$ means the numbers that satisfy **at least one** of the two. On a number line, “and” is one shaded segment, and “or” is usually two rays pointing away from each other.",
    "复合不等式用“并且”或“或”把两个不等式连起来。$-2 < x \\le 5$ 表示 $x > -2$ **并且** $x \\le 5$：$-2$ 与 $5$ 之间的数，包括 $5$。$x < -1 \\text{ 或 } x \\ge 3$ 表示**至少满足其中一个**不等式的数。在数轴上，“并且”通常是一条涂色的线段，“或”通常是两条方向相反的射线。",
  ),
  ["representing-inequalities-on-number-lines", "inequalities-and-solutions"],
  ["6.EE.B.8", "7.EE.B.4.B"],
  [
    {
      id: "checking-a-value",
      title: t("Checking a value", "检验一个值"),
      explanation: t(
        "For “and”, a value must satisfy **both** parts; for “or”, **one** part is enough. $x = 5$ satisfies $-2 < x \\le 5$, since $-2 < 5$ and $5 \\le 5$. $x = 0$ does not satisfy $x < -1 \\text{ or } x \\ge 3$, since both parts are false.",
        "对于“并且”，一个值必须**同时**满足两部分；对于“或”，满足**其中一部分**就够了。$x = 5$ 满足 $-2 < x \\le 5$，因为 $-2 < 5$ 且 $5 \\le 5$。$x = 0$ 不满足 $x < -1 \\text{ 或 } x \\ge 3$，因为两部分都不成立。",
      ),
      keyPrerequisites: ["inequalities-and-solutions"],
      generate(rng) {
        const lo = rng.int(-9, 5);
        const hi = lo + rng.int(2, 8);
        const opLo = lessOp(rng);
        const opHi = lessOp(rng);
        const and = rng.bool();
        const candidates = [lo - 1, lo, lo + 1, Math.floor((lo + hi) / 2), hi - 1, hi, hi + 1];
        const v = rng.pick(candidates);
        const V = Q.of(v);
        if (and) {
          const latex = `${lo} ${relSymbol(opLo)} x ${relSymbol(opHi)} ${hi}`;
          const first = holds(Q.of(lo), opLo, V);
          const second = holds(V, opHi, Q.of(hi));
          const yes = first && second;
          return choiceProblem({
            prompt: t(`Is $x = ${v}$ a solution of $${latex}$?`, `$x = ${v}$ 是 $${latex}$ 的解吗？`),
            options: yesNo,
            correct: yes ? 0 : 1,
            solution: t(
              `Both parts must be true: $${lo} ${relSymbol(opLo)} ${v}$ is ${first ? "true" : "false"} and $${v} ${relSymbol(opHi)} ${hi}$ is ${second ? "true" : "false"}, so $${v}$ is ${yes ? "" : "not "}a solution.`,
              `两部分都必须成立：$${lo} ${relSymbol(opLo)} ${v}$ ${first ? "成立" : "不成立"}，$${v} ${relSymbol(opHi)} ${hi}$ ${second ? "成立" : "不成立"}，所以 $${v}$ ${yes ? "是" : "不是"}解。`,
            ),
          });
        }
        const opGreater = greaterOp(rng);
        const latex = (or: string) => `x ${relSymbol(opLo)} ${lo} \\text{ ${or} } x ${relSymbol(opGreater)} ${hi}`;
        const first = holds(V, opLo, Q.of(lo));
        const second = holds(V, opGreater, Q.of(hi));
        const yes = first || second;
        return choiceProblem({
          prompt: t(`Is $x = ${v}$ a solution of $${latex("or")}$?`, `$x = ${v}$ 是 $${latex("或")}$ 的解吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: t(
            `One true part is enough: $${v} ${relSymbol(opLo)} ${lo}$ is ${first ? "true" : "false"} and $${v} ${relSymbol(opGreater)} ${hi}$ is ${second ? "true" : "false"}, so $${v}$ is ${yes ? "" : "not "}a solution.`,
            `只要有一部分成立就够了：$${v} ${relSymbol(opLo)} ${lo}$ ${first ? "成立" : "不成立"}，$${v} ${relSymbol(opGreater)} ${hi}$ ${second ? "成立" : "不成立"}，所以 $${v}$ ${yes ? "是" : "不是"}解。`,
          ),
        });
      },
    },
    {
      id: "writing-from-a-graph",
      title: t("Writing a compound inequality from a graph", "根据图像写复合不等式"),
      explanation: t(
        "A segment from an open circle at $-3$ to a closed dot at $4$ shows $-3 < x \\le 4$. Two rays, one to the left from a closed dot at $-1$ and one to the right from an open circle at $2$, show $x \\le -1 \\text{ or } x > 2$.",
        "从 $-3$ 处的空心圈到 $4$ 处的实心点的线段表示 $-3 < x \\le 4$。两条射线，一条从 $-1$ 处的实心点向左，另一条从 $2$ 处的空心圈向右，表示 $x \\le -1 \\text{ 或 } x > 2$。",
      ),
      keyPrerequisites: ["representing-inequalities-on-number-lines"],
      generate(rng) {
        const lo = rng.int(-8, 4);
        const hi = lo + rng.int(2, 7);
        const loClosed = rng.bool();
        const hiClosed = rng.bool();
        const min = lo - 2;
        const max = Math.max(hi + 2, min + 10);
        if (rng.bool(0.55)) {
          const set = union(span(lo, loClosed, hi, hiClosed));
          return {
            ...intervalProblem({
              prompt: t(
                "Write a compound inequality in $x$ for the numbers shown on the number line.",
                "写出表示数轴上所示数的关于 $x$ 的复合不等式。",
              ),
              set,
              form: "inequality",
              solution: t(
                `The shading runs from $${lo}$ (${loClosed ? "closed dot, included" : "open circle, not included"}) to $${hi}$ (${hiClosed ? "closed dot, included" : "open circle, not included"}): $${lo} ${loClosed ? "\\le" : "<"} x ${hiClosed ? "\\le" : "<"} ${hi}$.`,
                `涂色部分从 $${lo}$（${loClosed ? "实心点，包括" : "空心圈，不包括"}）到 $${hi}$（${hiClosed ? "实心点，包括" : "空心圈，不包括"}）：$${lo} ${loClosed ? "\\le" : "<"} x ${hiClosed ? "\\le" : "<"} ${hi}$。`,
              ),
              wrong: [union(span(lo, !loClosed, hi, !hiClosed)), union(ray(loClosed ? "<=" : "<", lo), ray(hiClosed ? ">=" : ">", hi))],
            }),
            figure: numberLineFigure(set, min, max),
          };
        }
        const left = ray(loClosed ? "<=" : "<", lo);
        const right = ray(hiClosed ? ">=" : ">", hi);
        const set = union(left, right);
        return {
          ...intervalProblem({
            prompt: t(
              "Write a compound inequality in $x$ for the numbers shown on the number line.",
              "写出表示数轴上所示数的关于 $x$ 的复合不等式。",
            ),
            set,
            form: "inequality",
            solution: t(
              `One ray goes left from $${lo}$ (${loClosed ? "included" : "not included"}) and the other goes right from $${hi}$ (${hiClosed ? "included" : "not included"}). A number is shown if it is on either ray: $x ${loClosed ? "\\le" : "<"} ${lo} \\text{ or } x ${hiClosed ? "\\ge" : ">"} ${hi}$.`,
              `一条射线从 $${lo}$（${loClosed ? "包括" : "不包括"}）向左，另一条从 $${hi}$（${hiClosed ? "包括" : "不包括"}）向右。在任意一条射线上的数都被表示：$x ${loClosed ? "\\le" : "<"} ${lo} \\text{ 或 } x ${hiClosed ? "\\ge" : ">"} ${hi}$。`,
            ),
            wrong: [union(span(lo, loClosed, hi, hiClosed)), union(ray(loClosed ? "<" : "<=", lo), ray(hiClosed ? ">" : ">=", hi))],
          }),
          figure: numberLineFigure(set, min, max),
        };
      },
    },
  ],
);

export const verifyingSolutionsOfLinearInequalities = topic(
  "verifying-solutions-of-linear-inequalities",
  t("Verifying Solutions of Linear Inequalities", "检验一次不等式的解"),
  t(
    "To verify that a value is a solution of an inequality, substitute it into both sides, evaluate each side, and check whether the inequality between the two results is true. For $x = 4$, $3(x - 2) \\ge x + 1$ becomes $6 \\ge 5$, which is true, so $4$ is a solution. When the two sides come out equal, the value is a solution of $\\le$ and $\\ge$ but not of $<$ and $>$.",
    "检验一个值是不是不等式的解，把它代入两边，分别计算，再看两个结果之间的不等关系是否成立。当 $x = 4$ 时，$3(x - 2) \\ge x + 1$ 变为 $6 \\ge 5$，成立，所以 $4$ 是解。如果两边相等，这个值是 $\\le$ 和 $\\ge$ 的解，但不是 $<$ 和 $>$ 的解。",
  ),
  ["inequalities-and-solutions", "identifying-solutions-to-linear-inequalities"],
  ["6.EE.B.5", "7.EE.B.4.B"],
  [
    {
      id: "substituting-into-both-sides",
      title: t("Substituting into both sides", "代入两边"),
      explanation: t(
        "Evaluate the left side and the right side separately, then compare:\n\n$$x = -2: \\quad 4(x + 3) < 2x + 5 \\;\\Rightarrow\\; 4(1) < 2(-2) + 5 \\;\\Rightarrow\\; 4 < 1,$$\n\nwhich is false, so $-2$ is not a solution.",
        "分别计算左边和右边，再比较：\n\n$$x = -2: \\quad 4(x + 3) < 2x + 5 \\;\\Rightarrow\\; 4(1) < 2(-2) + 5 \\;\\Rightarrow\\; 4 < 1,$$\n\n不成立，所以 $-2$ 不是解。",
      ),
      keyPrerequisites: ["inequalities-and-solutions"],
      generate(rng) {
        const k = rng.sign() * rng.int(2, 5);
        const p = rng.nonZero(-6, 6);
        const c = rng.nonZero(-6, 6);
        const v = rng.nonZero(-6, 6);
        const left = k * (v + p);
        const op = rng.pick(ops);
        const target = rng.bool(0.35) ? left : left + rng.nonZero(-4, 4);
        const d = target - c * v;
        const right = c * v + d;
        const latex = `${num(k)}(${linear(1, p)}) ${relSymbol(op)} ${linear(c, d)}`;
        const yes = holds(Q.of(left), op, Q.of(right));
        return choiceProblem({
          prompt: t(`Is $x = ${num(v)}$ a solution of $${latex}$?`, `$x = ${num(v)}$ 是 $${latex}$ 的解吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: t(
            `Left side: $${num(k)}(${num(v)} ${p < 0 ? "-" : "+"} ${Math.abs(p)}) = ${num(k)}(${num(v + p)}) = ${num(left)}$. Right side: $${substitutedLinear(c, v, d)} = ${num(right)}$. The statement $${num(left)} ${relSymbol(op)} ${num(right)}$ is ${yes ? "true, so it is a solution" : "false, so it is not a solution"}.`,
            `左边：$${num(k)}(${num(v)} ${p < 0 ? "-" : "+"} ${Math.abs(p)}) = ${num(k)}(${num(v + p)}) = ${num(left)}$。右边：$${substitutedLinear(c, v, d)} = ${num(right)}$。$${num(left)} ${relSymbol(op)} ${num(right)}$ ${yes ? "成立，所以它是解" : "不成立，所以它不是解"}。`,
          ),
        });
      },
    },
    {
      id: "choosing-a-solution-with-a-negative-coefficient",
      title: t("Choosing a solution when the coefficient is negative", "系数为负时选出解"),
      explanation: t(
        "With a negative coefficient, greater values of $x$ make the expression smaller. Test each value instead of guessing: for $10 - 3x > 4$, $x = 1$ gives $7 > 4$ (true), but $x = 3$ gives $1 > 4$ (false).",
        "系数为负时，$x$ 越大，式子的值越小。不要凭感觉判断，要逐个代入检验：对于 $10 - 3x > 4$，$x = 1$ 得 $7 > 4$（成立），而 $x = 3$ 得 $1 > 4$（不成立）。",
      ),
      generate(rng) {
        const a = rng.int(2, 7);
        const b = rng.int(-10, 20);
        const s = rng.int(-5, 8);
        const c = b - a * s;
        const op = rng.pick(ops);
        // b − a·x op c holds for x flip(op) s.
        const solved = flip[op];
        const candidates =
          solved === "<"
            ? [s - 1, s, s + 1, s + 2]
            : solved === "<="
              ? [s, s + 1, s + 2, s + 3]
              : solved === ">"
                ? [s - 2, s - 1, s, s + 1]
                : [s - 3, s - 2, s - 1, s];
        const value = (x: number) => b - a * x;
        const good = candidates.find((x) => holds(Q.of(value(x)), op, Q.of(c)))!;
        const latex = `${b === 0 ? `-${a}x` : `${b} - ${a}x`} ${relSymbol(op)} ${num(c)}`;
        const sub = (x: number) => `${b === 0 ? "" : `${b} `}-${b === 0 ? "" : " "}${a}(${num(x)}) = ${num(value(x))}`;
        return choiceProblem({
          prompt: t(`Which value of $x$ is a solution of $${latex}$?`, `$x$ 取哪个值时是 $${latex}$ 的解？`),
          options: candidates.map((x) => mathText(num(x))),
          correct: candidates.indexOf(good),
          solution: t(
            `Substitute each value: ${candidates.map((x) => `$${sub(x)}$`).join(", ")}. Only $${num(value(good))} ${relSymbol(op)} ${num(c)}$ is true, so $x = ${num(good)}$.`,
            `逐个代入：${candidates.map((x) => `$${sub(x)}$`).join("，")}。只有 $${num(value(good))} ${relSymbol(op)} ${num(c)}$ 成立，所以 $x = ${num(good)}$。`,
          ),
        });
      },
    },
  ],
);

export const furtherSolvingLinearInequalities = topic(
  "further-solving-linear-inequalities",
  t("Further Solving Linear Inequalities", "进一步解一次不等式"),
  t(
    "Inequalities with parentheses or fractions are solved like the matching equations: expand, clear fractions, collect $x$ on one side, and isolate it. Reverse the inequality symbol whenever you multiply or divide both sides by a negative number: $-2(x - 3) \\le 10$ gives $-2x + 6 \\le 10$, $-2x \\le 4$, so $x \\ge -2$.",
    "含括号或分数的不等式与对应的方程解法相同：展开、去分母、把 $x$ 移到一边，再求出 $x$。两边乘以或除以负数时，不等号要改变方向：由 $-2(x - 3) \\le 10$ 得 $-2x + 6 \\le 10$，$-2x \\le 4$，所以 $x \\ge -2$。",
  ),
  ["solving-multi-step-inequalities", "equations-with-parentheses", "solving-linear-equations-with-fractional-coefficients"],
  ["7.EE.B.4.B"],
  [
    {
      id: "inequalities-with-parentheses",
      title: t("Inequalities with parentheses", "含括号的不等式"),
      explanation: t(
        "Expand first, then solve. Decide the direction of the symbol only at the step where you divide:\n\n$$3(x + 4) > 5x - 2 \\;\\Rightarrow\\; 3x + 12 > 5x - 2 \\;\\Rightarrow\\; -2x > -14 \\;\\Rightarrow\\; x < 7.$$",
        "先展开，再求解。只在做除法的那一步判断不等号的方向：\n\n$$3(x + 4) > 5x - 2 \\;\\Rightarrow\\; 3x + 12 > 5x - 2 \\;\\Rightarrow\\; -2x > -14 \\;\\Rightarrow\\; x < 7.$$",
      ),
      keyPrerequisites: ["equations-with-parentheses", "solving-multi-step-inequalities"],
      generate(rng) {
        const k = rng.sign() * rng.int(2, 6);
        const p = rng.nonZero(-6, 6);
        const v = rng.int(-8, 8);
        const op = rng.pick(ops);
        if (rng.bool(0.45)) {
          const c = k * (v + p);
          const answerOp = k < 0 ? flip[op] : op;
          const latex = `${num(k)}(${linear(1, p)}) ${relSymbol(op)} ${num(c)}`;
          return inequalityProblem({
            prompt: solveInequality(latex),
            op: answerOp,
            value: v,
            wrong: [
              [flip[answerOp], v],
              [answerOp, frac(c - p, k)],
              [answerOp, frac(c, k).add(Q.of(p))],
            ],
            solution: t(
              `Expand, then isolate $x$${k < 0 ? `; dividing by $${k}$ reverses the symbol` : ""}: ${steps(`${linear(k, k * p)} ${relSymbol(op)} ${num(c)}`, `${side(k)} ${relSymbol(op)} ${num(c - k * p)}`, inequalityLatex("x", answerOp, v))}`,
              `先展开，再求出 $x$${k < 0 ? `；除以 $${k}$ 时不等号改变方向` : ""}：${steps(`${linear(k, k * p)} ${relSymbol(op)} ${num(c)}`, `${side(k)} ${relSymbol(op)} ${num(c - k * p)}`, inequalityLatex("x", answerOp, v))}`,
            ),
          });
        }
        let m = rng.nonZero(-6, 6);
        while (m === k) m = rng.nonZero(-6, 6);
        const coef = k - m;
        const n = coef * v + k * p;
        const answerOp = coef < 0 ? flip[op] : op;
        const latex = `${num(k)}(${linear(1, p)}) ${relSymbol(op)} ${linear(m, n)}`;
        return inequalityProblem({
          prompt: solveInequality(latex),
          op: answerOp,
          value: v,
          wrong: [
            [flip[answerOp], v],
            [answerOp, frac(n - p, coef)],
            [answerOp, frac(n + k * p, coef)],
          ],
          solution: t(
            `Expand, collect $x$ on the left, then divide by $${num(coef)}$${coef < 0 ? ", reversing the symbol" : ""}: ${steps(`${linear(k, k * p)} ${relSymbol(op)} ${linear(m, n)}`, `${side(coef)} ${relSymbol(op)} ${num(n - k * p)}`, inequalityLatex("x", answerOp, v))}`,
            `先展开，把 $x$ 移到左边，再除以 $${num(coef)}$${coef < 0 ? "，并改变不等号方向" : ""}：${steps(`${linear(k, k * p)} ${relSymbol(op)} ${linear(m, n)}`, `${side(coef)} ${relSymbol(op)} ${num(n - k * p)}`, inequalityLatex("x", answerOp, v))}`,
          ),
        });
      },
    },
    {
      id: "inequalities-with-fractions",
      title: t("Inequalities with fractional coefficients", "分数系数的不等式"),
      explanation: t(
        "Multiply both sides by the reciprocal of the coefficient. A negative fraction has a negative reciprocal, so the symbol reverses:\n\n$$-\\frac{2}{3}x + 1 \\le 7 \\;\\Rightarrow\\; -\\frac{2}{3}x \\le 6 \\;\\Rightarrow\\; x \\ge -\\frac{3}{2} \\cdot 6 = -9.$$",
        "两边同时乘以系数的倒数。负分数的倒数是负数，所以不等号要改变方向：\n\n$$-\\frac{2}{3}x + 1 \\le 7 \\;\\Rightarrow\\; -\\frac{2}{3}x \\le 6 \\;\\Rightarrow\\; x \\ge -\\frac{3}{2} \\cdot 6 = -9.$$",
      ),
      keyPrerequisites: ["solving-linear-equations-with-fractional-coefficients"],
      generate(rng) {
        const q = rng.int(2, 6);
        let p = rng.int(1, 5);
        while (p % q === 0 || gcd(p, q) !== 1) p = rng.int(1, 5);
        const f = Q.of(rng.bool(0.5) ? -p : p, q);
        const v = q * rng.nonZero(-4, 4);
        const b = rng.nonZero(-12, 12);
        const c = Number(f.mul(Q.of(v)).n) + b;
        const op = rng.pick(ops);
        const answerOp = f.sign() < 0 ? flip[op] : op;
        const r = Q.one.div(f);
        const latex = `${fractionTerm(f)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} ${relSymbol(op)} ${num(c)}`;
        return inequalityProblem({
          prompt: solveInequality(latex),
          op: answerOp,
          value: v,
          wrong: [
            [flip[answerOp], v],
            [answerOp, Q.of(c - b).mul(f)],
            [answerOp, r.mul(Q.of(c)).sub(Q.of(b))],
          ],
          solution: t(
            `${moveConstant(b).en}, then multiply by $${num(r)}$${f.sign() < 0 ? ", which is negative, so the symbol reverses" : ""}: ${steps(`${fractionTerm(f)} ${relSymbol(op)} ${num(c - b)}`, `x ${relSymbol(answerOp)} ${num(r)} \\cdot ${paren(c - b)} = ${num(v)}`)}`,
            `${moveConstant(b)["zh-CN"]}，再同时乘以 $${num(r)}$${f.sign() < 0 ? "；它是负数，所以不等号改变方向" : ""}：${steps(`${fractionTerm(f)} ${relSymbol(op)} ${num(c - b)}`, `x ${relSymbol(answerOp)} ${num(r)} \\cdot ${paren(c - b)} = ${num(v)}`)}`,
          ),
        });
      },
    },
  ],
);

/** TwoStep is a generated inequality a·x + b op c whose solution is x solvedOp s. */
interface TwoStep {
  readonly latex: (op: InequalityOp) => string;
  readonly op: InequalityOp;
  readonly solvedOp: InequalityOp;
  readonly s: number;
  readonly work: Text;
}

/** twoStep draws a one- or two-step inequality with an integer boundary s, often with a negative coefficient. */
function twoStep(rng: Rng, s: number): TwoStep {
  const a = rng.bool(0.55) ? -rng.int(2, 6) : rng.int(2, 6);
  const b = rng.bool(0.2) ? 0 : rng.nonZero(-12, 12);
  const c = a * s + b;
  const op = rng.pick(ops);
  const solvedOp = a < 0 ? flip[op] : op;
  const constantFirst = b !== 0 && a < 0 && rng.bool();
  const lhs = constantFirst ? poly([b, ""], [a, "x"]) : linear(a, b);
  return {
    latex: (o) => `${lhs} ${relSymbol(o)} ${num(c)}`,
    op,
    solvedOp,
    s,
    work: (() => {
      const lines = steps(...(b === 0 ? [] : [`${side(a)} ${relSymbol(op)} ${num(c - b)}`]), inequalityLatex("x", solvedOp, s));
      const reverse = a < 0 ? t(", reversing the symbol", "，并改变不等号方向") : t("", "");
      return b === 0
        ? t(`Divide both sides by $${a}$${reverse.en}:${lines}`, `两边同时除以 $${a}$${reverse["zh-CN"]}：${lines}`)
        : t(
            `${moveConstant(b).en}, then divide by $${a}$${reverse.en}:${lines}`,
            `${moveConstant(b)["zh-CN"]}，再同时除以 $${a}$${reverse["zh-CN"]}：${lines}`,
          );
    })(),
  };
}

/** describe says how the graph of x op c looks on a number line. */
const describe = (op: InequalityOp, c: number) => {
  const closed = op === ">=" || op === "<=";
  const right = op === ">" || op === ">=";
  return t(
    `${closed ? "A closed dot" : "An open circle"} at $${c}$, shaded to the ${right ? "right" : "left"}`,
    `$${c}$ 处画${closed ? "实心点" : "空心圈"}，向${right ? "右" : "左"}涂色`,
  );
};

export const representingSolutionsToInequalitiesOnNumberLines = topic(
  "representing-solutions-to-inequalities-on-number-lines",
  t("Representing Solutions to Inequalities on Number Lines", "在数轴上表示不等式的解"),
  t(
    "To graph the solutions of an inequality such as $5 - 2x < 11$, solve it first: $-2x < 6$, so $x > -3$. Then draw an open circle at $-3$, because $-3$ is not a solution, and shade to the right. A closed dot is used for $\\le$ and $\\ge$. Graphing before solving is risky: the symbol may reverse along the way.",
    "要画出 $5 - 2x < 11$ 这类不等式的解，先求解：$-2x < 6$，所以 $x > -3$。然后在 $-3$ 处画空心圈（因为 $-3$ 不是解），并向右涂色。$\\le$ 和 $\\ge$ 用实心点表示。不先求解就画图很容易出错：求解过程中不等号可能会改变方向。",
  ),
  ["solving-multi-step-inequalities", "representing-inequalities-on-number-lines"],
  ["7.EE.B.4.B"],
  [
    {
      id: "describing-the-graph-of-the-solutions",
      title: t("Describing the graph of the solutions", "描述解的图像"),
      explanation: t(
        "Solve, then read the result: $-4x + 1 \\ge 9$ gives $-4x \\ge 8$, so $x \\le -2$. Its graph is a closed dot at $-2$, shaded to the left.",
        "先求解，再看结果：由 $-4x + 1 \\ge 9$ 得 $-4x \\ge 8$，所以 $x \\le -2$。它的图像是在 $-2$ 处画实心点，向左涂色。",
      ),
      keyPrerequisites: ["solving-multi-step-inequalities"],
      generate(rng) {
        const s = rng.int(-8, 8);
        const q = twoStep(rng, s);
        const latex = q.latex(q.op);
        return choiceProblem({
          prompt: t(
            `Which describes the graph of the solutions of $${latex}$ on a number line?`,
            `$${latex}$ 的解在数轴上的图像是哪一种？`,
          ),
          options: ops.map((o) => describe(o, s)),
          correct: ops.indexOf(q.solvedOp),
          solution: t(`${q.work.en}${describe(q.solvedOp, s).en}.`, `${q.work["zh-CN"]}${describe(q.solvedOp, s)["zh-CN"]}。`),
        });
      },
    },
    {
      id: "choosing-the-inequality-for-a-graph",
      title: t("Choosing the inequality for a graph", "根据图像选不等式"),
      explanation: t(
        "To decide which inequality a graph shows, solve each candidate and compare it with the graph. A graph with an open circle at $3$ shaded to the left shows $x < 3$. It matches $-2x > -6$, because dividing by $-2$ gives $x < 3$, but not $-2x < -6$.",
        "要判断图像表示哪个不等式，把每个选项都解出来，再与图像比较。在 $3$ 处画空心圈、向左涂色的图像表示 $x < 3$。它与 $-2x > -6$ 对应，因为两边除以 $-2$ 得 $x < 3$；而与 $-2x < -6$ 不对应。",
      ),
      generate(rng) {
        const s = rng.int(-6, 6);
        const q = twoStep(rng, s);
        const correct = q.latex(q.op);
        const lo = Math.max(-10, s - 5);
        return pickChoice(
          rng,
          t("Which inequality has the solutions shown on the number line?", "哪个不等式的解是数轴上所表示的数？"),
          mathText(correct),
          [mathText(q.latex(flip[q.op])), mathText(q.latex(strictness[q.op])), mathText(q.latex(flip[strictness[q.op]]))],
          t(
            `The graph shows $${inequalityLatex("x", q.solvedOp, s)}$. For $${correct}$: ${q.work.en}The other inequalities have a different symbol, so their solutions differ at $${s}$ or point the other way.`,
            `图像表示 $${inequalityLatex("x", q.solvedOp, s)}$。对于 $${correct}$：${q.work["zh-CN"]}其他不等式的符号不同，所以它们的解在 $${s}$ 处不同，或者方向相反。`,
          ),
          numberLineFigure([ray(q.solvedOp, s)], lo, lo + 10),
        );
      },
    },
  ],
);

/** grade7EquationTopics lists the 7th grade topics on linear equations, two-variable equations and inequalities. */
export const grade7EquationTopics: readonly TopicDef[] = [
  solvingLinearEquationsByTrialAndError,
  solvingLinearEquationsWithFractionalCoefficients,
  solvingLinearEquationsWithDecimalCoefficients,
  solvingLinearEquationsByClearingARationalExpression,
  solvingLinearEquationsUsingCrossMultiplication,
  twoVariableLinearEquationsAndTheirSolutions,
  solvingTwoVariableEquations,
  graphingLinearEquations,
  compoundInequalities,
  verifyingSolutionsOfLinearInequalities,
  furtherSolvingLinearInequalities,
  representingSolutionsToInequalitiesOnNumberLines,
];
