import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import {
  type Coefficient,
  type Interval,
  intervalLatex,
  linear,
  num,
  type PlaneMark,
  type PlaneView,
  type Point,
  paren,
  plane,
  poly,
  Q,
  type RealSet,
  realLine,
  relSymbol,
  union,
} from "@ga/subject-math";

import {
  choiceProblem,
  expressionProblem,
  type InequalityOp,
  intervalProblem,
  numberProblem,
  pointProblem,
  solutionsProblem,
  steps,
  yesNo,
} from "../problems.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** range lists the integers from lo to hi. */
const range = (lo: number, hi: number) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b);

/** bars writes an absolute value: "|x - 3|". */
const bars = (inner: string) => `|${inner}|`;

/** plusNum writes a constant added to what comes before: " + 3", " - 3", or "" for 0. */
function plusNum(c: Coefficient): string {
  const v = toQ(c);
  if (v.isZero()) return "";
  return v.sign() < 0 ? ` - ${v.neg().toLatex()}` : ` + ${v.toLatex()}`;
}

/** times writes a coefficient times a number in parentheses: "3(-2)", "-(-2)", "(4)". */
const times = (a: number, v: number) => `${a === 1 ? "" : a === -1 ? "-" : a}(${v})`;

/** kTimes writes k · m for a number m ≥ 0: "3 \cdot 5", "-5", "5". */
const kTimes = (k: number, m: number) => (k === 1 ? `${m}` : k === -1 ? `-${m}` : `${k} \\cdot ${m}`);

/** absFn writes a|x - h| + k. */
const absFn = (a: Coefficient, h: number, k: Coefficient) => poly([a, bars(linear(1, -h))], [k, ""]);

/** absAt is a|x - h| + k at x. */
const absAt = (a: Q, h: number, k: Q, x: Q) => a.mul(x.sub(Q.of(h)).abs()).add(k);

const sortQ = (xs: readonly Q[]) => [...xs].sort((p, q) => p.cmp(q));
const dedupe = (xs: readonly Q[]) => xs.filter((x, i) => xs.findIndex((y) => y.eq(x)) === i);
/** sols writes a set of solutions in increasing order, each once. */
const sols = (xs: readonly Q[]) => sortQ(dedupe(xs)).map((x) => x.toLatex());

/** solveAbs solves |Ax + B| = C. */
function solveAbs(A: number, B: number, C: Coefficient): Q[] {
  const c = toQ(C);
  if (c.sign() < 0) return [];
  if (c.isZero()) return [Q.of(-B, A)];
  return [c.sub(Q.of(B)).div(Q.of(A)), c.neg().sub(Q.of(B)).div(Q.of(A))];
}

const listSolutions = t(
  "Enter all solutions separated by commas, or $\\varnothing$ if there are none.",
  "请用逗号分隔写出所有解；如果无解，请输入 $\\varnothing$。",
);
const asInterval = t("Write the answer in interval notation.", "用区间记号写出答案。");

/** ask builds a prompt from a question and an instruction about the form of the answer. */
const ask = (en: string, zh: string, form: Text): Text => t(`${en} ${form.en}`, `${zh}${form["zh-CN"]}`);

/** solveText asks to solve an equation or inequality. */
const solveText = (latex: string, form: Text) => ask(`Solve $${latex}$.`, `解 $${latex}$。`, form);

const orEn = " \\quad\\text{or}\\quad ";
const orZh = " \\quad\\text{或}\\quad ";

/** caseLines writes the two cases of |L| = R in each locale. */
function caseLines(L: string, R: string, negR: string): { en: string; zh: string } {
  return { en: steps(`${L} = ${R}${orEn}${L} = ${negR}`), zh: steps(`${L} = ${R}${orZh}${L} = ${negR}`) };
}

/** solsText lists solutions as "$x = 2$ and $x = -5$". */
function solsText(xs: readonly Q[]): { en: string; zh: string } {
  const parts = sortQ(dedupe(xs)).map((x) => `$x = ${x.toLatex()}$`);
  return { en: parts.join(" and "), zh: parts.join("、") };
}

// Intervals.

/** span is the set of numbers from lo to hi, with each end included when it is closed. */
function span(lo: Coefficient, loClosed: boolean, hi: Coefficient, hiClosed: boolean): Interval {
  return { lo: toQ(lo), hi: toQ(hi), loClosed, hiClosed };
}

/** ray is the set of x with x op v. */
function ray(op: InequalityOp, v: Coefficient): Interval {
  return op === "<" || op === "<="
    ? { hi: toQ(v), hiClosed: op === "<=", loClosed: false }
    : { lo: toQ(v), loClosed: op === ">=", hiClosed: false };
}

/** toggleEnds includes every finite endpoint that is excluded and excludes every one that is included. */
const toggleEnds = (s: RealSet): RealSet =>
  union(...s.map((i) => ({ ...i, loClosed: i.lo !== undefined && !i.loClosed, hiClosed: i.hi !== undefined && !i.hiClosed })));

const flip: Record<InequalityOp, InequalityOp> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
const isLess = (op: InequalityOp) => op === "<" || op === "<=";

/** inside is the set where |Ax + B| < c (or ≤ c when closed), for c > 0. */
function inside(A: number, B: number, c: number, closed: boolean): RealSet {
  const [lo, hi] = sortQ(solveAbs(A, B, c));
  return union(span(lo!, closed, hi!, closed));
}

/** outside is the set where |Ax + B| > c (or ≥ c when closed), for c > 0. */
function outside(A: number, B: number, c: number, closed: boolean): RealSet {
  const [lo, hi] = sortQ(solveAbs(A, B, c));
  return union(ray(closed ? "<=" : "<", lo!), ray(closed ? ">=" : ">", hi!));
}

/** absSet is the solution set of |Ax + B| op c for c > 0. */
const absSet = (A: number, B: number, op: InequalityOp, c: number) =>
  isLess(op) ? inside(A, B, c, op === "<=") : outside(A, B, c, op === ">=");

// Graphs.

const view: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

const pt = (x: Coefficient, y: Coefficient) => `(${num(x)}, ${num(y)})`;

/** vMarks draws the graph of y = a|x - h| + k for x from lo to hi as two segments meeting at the vertex. */
function vMarks(a: Q, h: number, k: Q, lo = -40, hi = 40): PlaneMark[] {
  const f = (x: number) => absAt(a, h, k, Q.of(x)).toNumber();
  const marks: PlaneMark[] = [];
  const kn = k.toNumber();
  if (lo < h) marks.push({ kind: "segment", a: [lo, f(lo)], b: [Math.min(h, hi), f(Math.min(h, hi))], accent: true });
  if (hi > h) marks.push({ kind: "segment", a: [Math.max(h, lo), f(Math.max(h, lo))], b: [hi, f(hi)], accent: true });
  if (lo === hi) marks.push({ kind: "point", at: [lo, kn], accent: true });
  return marks;
}

/** vFigure draws the whole graph of y = a|x - h| + k with dots at the given points. */
function vFigure(a: Q, h: number, k: Q, dots: readonly Point[]): Figure {
  const marks = [...vMarks(a, h, k), ...dots.map((at): PlaneMark => ({ kind: "point", at, accent: true }))];
  const up = a.sign() > 0;
  const through = dots.filter(([x, y]) => x !== h || y !== k.toNumber()).map(([x, y]) => pt(x, y));
  return {
    svg: plane(view, marks),
    alt: t(
      `A V-shaped graph that opens ${up ? "upward" : "downward"}, with its vertex at ${pt(h, k)}${through.length ? ` and passing through ${through.join(" and ")}` : ""}.`,
      `开口向${up ? "上" : "下"}的 V 形图象，顶点为 ${pt(h, k)}${through.length ? `，并经过 ${through.join("、")}` : ""}。`,
    ),
  };
}

/** steep and gentle factors for stretched graphs. */
const factors: readonly Q[] = [Q.of(2), Q.of(3), Q.of(1, 2), Q.of(1, 3), Q.of(3, 2), Q.of(4), Q.of(1, 4), Q.of(2, 3)];

// Unit 1: absolute value expressions, equations and inequalities.

const evalPrompt = (expr: string) => t(`Evaluate $${expr}$.`, `计算 $${expr}$。`);

/** absoluteValueExpressions evaluates expressions with absolute values and finds distances on the number line. */
export const absoluteValueExpressions: TopicDef = {
  id: "absolute-value-expressions",
  title: t("Absolute Value Expressions", "绝对值表达式"),
  summary: t(
    "Evaluate expressions with absolute values, including nested ones and ones with variables, and find distances on the number line.",
    "计算含绝对值的式子（包括嵌套的绝对值和含字母的式子），并求数轴上两点间的距离。",
  ),
  prerequisites: ["evaluating-expressions"],
  encompasses: [
    { topic: "absolute-value", weight: 0.5 },
    { topic: "evaluating-expressions", weight: 0.4 },
    { topic: "order-of-operations-with-integers", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.6.NS.C.7.C", "CCSS.7.NS.A.1.C"],
  knowledgePoints: [
    {
      id: "numerical-absolute-value-expressions",
      title: t("Numerical expressions", "数值表达式"),
      explanation: t(
        "Absolute value bars group like parentheses: simplify what is inside them first, then take the absolute value, then do the remaining operations. For nested bars, work from the inside out:\n\n$$|3 - 8| - |-4| = |-5| - 4 = 5 - 4 = 1 \\qquad |2 - |-7|| = |2 - 7| = |-5| = 5$$\n\nIn general $|a - b|$ is not $|a| - |b|$: $|3 - 8| = 5$, but $|3| - |8| = -5$.",
        "绝对值符号像括号一样起分组作用：先化简符号里面的式子，再取绝对值，最后完成其余运算。遇到嵌套的绝对值，从里往外算：\n\n$$|3 - 8| - |-4| = |-5| - 4 = 5 - 4 = 1 \\qquad |2 - |-7|| = |2 - 7| = |-5| = 5$$\n\n一般地，$|a - b|$ 不等于 $|a| - |b|$：$|3 - 8| = 5$，而 $|3| - |8| = -5$。",
      ),
      keyPrerequisites: ["absolute-value"],
      generate(rng) {
        const shape = rng.int(0, 3);
        if (shape === 0) {
          const a = rng.nonZero(-12, 12);
          const b = rng.nonZero(-12, 12);
          const c = rng.nonZero(-12, 12);
          const inner = a - b;
          const expr = `|${a} - ${paren(b)}| - |${c}|`;
          const value = Math.abs(inner) - Math.abs(c);
          const s = steps(expr, `|${inner}| - ${Math.abs(c)}`, `${Math.abs(inner)} - ${Math.abs(c)} = ${value}`);
          return numberProblem({
            prompt: evalPrompt(expr),
            answer: value,
            wrong: [inner - Math.abs(c), Math.abs(a) - Math.abs(b) - Math.abs(c), Math.abs(inner) - c],
            solution: t(`Simplify inside the bars first, then take absolute values:${s}`, `先化简绝对值符号里面的式子，再取绝对值：${s}`),
          });
        }
        if (shape === 1) {
          const k = rng.sign() * rng.int(2, 5);
          const a = rng.nonZero(-12, 12);
          const b = rng.nonZero(-12, 12);
          const expr = `${k}|${a} + ${paren(b)}|`;
          const value = k * Math.abs(a + b);
          const s = steps(expr, `${k}|${a + b}|`, `${k} \\cdot ${Math.abs(a + b)} = ${value}`);
          return numberProblem({
            prompt: evalPrompt(expr),
            answer: value,
            wrong: [k * (a + b), Math.abs(k * a + b), -value],
            solution: t(`Take the absolute value before multiplying:${s}`, `先取绝对值，再相乘：${s}`),
          });
        }
        if (shape === 2) {
          const a = rng.bool(0.7) ? -rng.int(1, 15) : rng.int(1, 15);
          const b = rng.bool(0.7) ? -rng.int(1, 15) : rng.int(1, 15);
          const c = rng.nonZero(-9, 9);
          const expr = `|${a}| - |${b}|${plusNum(c)}`;
          const value = Math.abs(a) - Math.abs(b) + c;
          const s = steps(expr, `${Math.abs(a)} - ${Math.abs(b)}${plusNum(c)} = ${value}`);
          return numberProblem({
            prompt: evalPrompt(expr),
            answer: value,
            wrong: [a - b + c, Math.abs(a - b) + c, Math.abs(a) + Math.abs(b) + c],
            solution: t(
              `Take each absolute value, then add and subtract from left to right:${s}`,
              `先求出每个绝对值，再从左到右加减：${s}`,
            ),
          });
        }
        const a = rng.int(-9, 9);
        const b = rng.nonZero(-15, 15);
        const expr = `|${a} - |${b}||`;
        const value = Math.abs(a - Math.abs(b));
        const s = steps(expr, `|${a} - ${Math.abs(b)}|`, `|${a - Math.abs(b)}| = ${value}`);
        return numberProblem({
          prompt: evalPrompt(expr),
          answer: value,
          wrong: [Math.abs(a - b), a - Math.abs(b), Math.abs(a) + Math.abs(b)],
          solution: t(`Work from the inside out:${s}`, `从里往外计算：${s}`),
        });
      },
    },
    {
      id: "absolute-value-expressions-with-variables",
      title: t("Expressions with variables", "含字母的式子"),
      explanation: t(
        "To evaluate an expression with absolute values at given values of the variables, substitute, simplify inside the bars, take the absolute value, and finish the calculation. For $x = -2$:\n\n$$3|2x + 1| - 4 = 3|2(-2) + 1| - 4 = 3|-3| - 4 = 3 \\cdot 3 - 4 = 5$$",
        "求含绝对值的式子在给定字母取值下的值：代入，化简绝对值符号里面的式子，取绝对值，再完成计算。当 $x = -2$ 时：\n\n$$3|2x + 1| - 4 = 3|2(-2) + 1| - 4 = 3|-3| - 4 = 3 \\cdot 3 - 4 = 5$$",
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        if (rng.bool(0.3)) {
          const x = rng.nonZero(-9, 9);
          const y = rng.nonZero(-9, 9);
          const shape = rng.int(0, 2);
          const exprs = ["|x - y|", "|x| - |y|", "|x + y|"];
          const values = [Math.abs(x - y), Math.abs(x) - Math.abs(y), Math.abs(x + y)];
          const subs = [`|${x} - ${paren(y)}|`, `|${x}| - |${y}|`, `|${x} + ${paren(y)}|`];
          const value = values[shape]!;
          const s = steps(`${exprs[shape]} = ${subs[shape]} = ${value}`);
          return numberProblem({
            prompt: t(
              `Evaluate $${exprs[shape]}$ when $x = ${x}$ and $y = ${y}$.`,
              `当 $x = ${x}$，$y = ${y}$ 时，求 $${exprs[shape]}$ 的值。`,
            ),
            answer: value,
            wrong: [...values.filter((_, i) => i !== shape), shape === 0 ? x - y : shape === 2 ? x + y : x - y],
            solution: t(`Substitute and evaluate:${s}`, `代入并计算：${s}`),
          });
        }
        const k = rng.pick([1, 1, 2, 3, -1, -2, -3]);
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-9, 9);
        const d = rng.int(-9, 9);
        let v = rng.int(-6, 6);
        for (let i = 0; i < 10 && a * v + b >= 0; i++) v = rng.int(-6, 6);
        const inner = a * v + b;
        const expr = poly([k, bars(linear(a, b))], [d, ""]);
        const value = k * Math.abs(inner) + d;
        const s = steps(
          poly([k, bars(`${times(a, v)}${plusNum(b)}`)], [d, ""]),
          poly([k, bars(String(inner))], [d, ""]),
          `${kTimes(k, Math.abs(inner))}${plusNum(d)} = ${value}`,
        );
        return numberProblem({
          prompt: t(`Evaluate $${expr}$ when $x = ${v}$.`, `当 $x = ${v}$ 时，求 $${expr}$ 的值。`),
          answer: value,
          wrong: [k * inner + d, Math.abs(k * inner + d), k * Math.abs(inner) - d],
          solution: t(`Substitute $x = ${v}$:${s}`, `代入 $x = ${v}$：${s}`),
        });
      },
    },
    {
      id: "distance-on-the-number-line",
      title: t("Distance on the number line", "数轴上的距离"),
      explanation: t(
        "The distance between two numbers $a$ and $b$ on the number line is $|a - b|$. The order does not matter, since $|a - b| = |b - a|$. For example, the distance between $-6$ and $4$ is $|-6 - 4| = |-10| = 10$.\n\nIn the same way, $|x - 3|$ is the distance between $x$ and $3$, and $|x + 3| = |x - (-3)|$ is the distance between $x$ and $-3$.",
        "数轴上两个数 $a$ 与 $b$ 之间的距离是 $|a - b|$。顺序无关紧要，因为 $|a - b| = |b - a|$。例如，$-6$ 与 $4$ 之间的距离是 $|-6 - 4| = |-10| = 10$。\n\n同样地，$|x - 3|$ 是 $x$ 与 $3$ 之间的距离，而 $|x + 3| = |x - (-3)|$ 是 $x$ 与 $-3$ 之间的距离。",
      ),
      generate(rng) {
        if (rng.bool(0.35)) {
          const c = rng.nonZero(-12, 12);
          const options = [bars(linear(1, -c)), bars(linear(1, c)), poly([1, "|x|"], [-c, ""]), linear(1, -c)];
          const order = rng.shuffle([0, 1, 2, 3]);
          return choiceProblem({
            prompt: t(
              `Which expression gives the distance between $x$ and $${c}$ on the number line?`,
              `哪个式子表示数轴上 $x$ 与 $${c}$ 之间的距离？`,
            ),
            options: order.map((i) => same(`$${options[i]}$`)),
            correct: order.indexOf(0),
            solution: t(
              `The distance between $x$ and $${c}$ is $|x - ${paren(c)}| = ${options[0]}$.`,
              `$x$ 与 $${c}$ 之间的距离是 $|x - ${paren(c)}| = ${options[0]}$。`,
            ),
          });
        }
        const a = rng.int(-20, 20);
        let b = rng.int(-20, 20);
        if (b === a) b = a === 20 ? -20 : a + 1;
        const [p, q] = rng.bool(0.7) && a * b >= 0 ? [a, -b === a ? b : -b] : [a, b];
        const value = Math.abs(p - q);
        return numberProblem({
          prompt: t(`Find the distance between $${p}$ and $${q}$ on the number line.`, `求数轴上 $${p}$ 与 $${q}$ 之间的距离。`),
          answer: value,
          wrong: [Math.abs(Math.abs(p) - Math.abs(q)), Math.abs(p + q), p - q],
          solution: t(
            `The distance is $|${p} - ${paren(q)}| = |${p - q}| = ${value}$.`,
            `距离是 $|${p} - ${paren(q)}| = |${p - q}| = ${value}$。`,
          ),
        });
      },
    },
  ],
};

const givenAB = (m: number, n: number, target: string) =>
  t(`Given that $|a| = ${m}$ and $|b| = ${n}$, find $${target}$.`, `已知 $|a| = ${m}$，$|b| = ${n}$，求 $${target}$。`);

/** rulesOfAbsoluteValue uses the product and quotient rules of absolute value. */
export const rulesOfAbsoluteValue: TopicDef = {
  id: "rules-of-absolute-value",
  title: t("Rules of Absolute Value", "绝对值的运算法则"),
  summary: t(
    "Use |ab| = |a||b| and |a/b| = |a|/|b| to find and rewrite absolute values of products and quotients.",
    "利用 |ab| = |a||b| 与 |a/b| = |a|/|b| 求积与商的绝对值并改写式子。",
  ),
  prerequisites: ["absolute-value-expressions", "operations-with-rational-numbers"],
  encompasses: [
    { topic: "absolute-value-expressions", weight: 0.3 },
    { topic: "operations-with-rational-numbers", weight: 0.2 },
  ],
  xp: 12,
  knowledgePoints: [
    {
      id: "absolute-value-of-a-product",
      title: t("Absolute value of a product", "积的绝对值"),
      explanation: t(
        "The absolute value of a product is the product of the absolute values:\n\n$$|ab| = |a| \\cdot |b|$$\n\nMultiplying only decides the sign, and the absolute value removes it. So if $|a| = 4$, then $|-3a| = |-3| \\cdot |a| = 3 \\cdot 4 = 12$, whether $a$ is $4$ or $-4$.",
        "积的绝对值等于各因数绝对值的积：\n\n$$|ab| = |a| \\cdot |b|$$\n\n相乘只决定符号，而绝对值把符号去掉。所以若 $|a| = 4$，则 $|-3a| = |-3| \\cdot |a| = 3 \\cdot 4 = 12$，无论 $a$ 是 $4$ 还是 $-4$。",
      ),
      generate(rng) {
        const m = rng.int(2, 9);
        const n = rng.int(2, 9);
        const k = rng.sign() * rng.int(2, 9);
        const shape = rng.int(0, 2);
        if (shape === 0) {
          return numberProblem({
            prompt: givenAB(m, n, "|ab|"),
            answer: m * n,
            wrong: [m + n, -(m * n)],
            solution: t(
              `$|ab| = |a| \\cdot |b| = ${m} \\cdot ${n} = ${m * n}$.`,
              `$|ab| = |a| \\cdot |b| = ${m} \\cdot ${n} = ${m * n}$。`,
            ),
          });
        }
        if (shape === 1) {
          const value = Math.abs(k) * m;
          const s = `|${k}a| = |${k}| \\cdot |a| = ${Math.abs(k)} \\cdot ${m} = ${value}`;
          return numberProblem({
            prompt: givenAB(m, n, `|${k}a|`),
            answer: value,
            wrong: [k * m, Math.abs(k) + m, Math.abs(k) * n],
            solution: t(`$${s}$.`, `$${s}$。`),
          });
        }
        const value = Math.abs(k) * m * n;
        const s = `|${k}ab| = |${k}| \\cdot |a| \\cdot |b| = ${Math.abs(k)} \\cdot ${m} \\cdot ${n} = ${value}`;
        return numberProblem({
          prompt: givenAB(m, n, `|${k}ab|`),
          answer: value,
          wrong: [k * m * n, Math.abs(k) * (m + n), m * n],
          solution: t(`$${s}$.`, `$${s}$。`),
        });
      },
    },
    {
      id: "absolute-value-of-a-quotient",
      title: t("Absolute value of a quotient", "商的绝对值"),
      explanation: t(
        "The absolute value of a quotient is the quotient of the absolute values, for $b \\ne 0$:\n\n$$\\left|\\frac{a}{b}\\right| = \\frac{|a|}{|b|}$$\n\nFor example, if $|a| = 6$ and $|b| = 4$, then $\\left|\\frac{a}{-2b}\\right| = \\frac{|a|}{|-2| \\cdot |b|} = \\frac{6}{8} = \\frac{3}{4}$.",
        "当 $b \\ne 0$ 时，商的绝对值等于绝对值的商：\n\n$$\\left|\\frac{a}{b}\\right| = \\frac{|a|}{|b|}$$\n\n例如，若 $|a| = 6$，$|b| = 4$，则 $\\left|\\frac{a}{-2b}\\right| = \\frac{|a|}{|-2| \\cdot |b|} = \\frac{6}{8} = \\frac{3}{4}$。",
      ),
      generate(rng) {
        const m = rng.int(2, 12);
        let n = rng.int(2, 12);
        if (n === m) n = m === 12 ? 5 : m + 1;
        const k = rng.sign() * rng.int(2, 6);
        const K = Math.abs(k);
        const shape = rng.int(0, 2);
        const target = ["\\left|\\frac{a}{b}\\right|", `\\left|\\frac{${k}a}{b}\\right|`, `\\left|\\frac{a}{${k}b}\\right|`][shape]!;
        const [top, bottom] = [
          [m, n],
          [K * m, n],
          [m, K * n],
        ][shape]!;
        const value = Q.of(top!, bottom!);
        const work = [
          `\\frac{|a|}{|b|} = \\frac{${m}}{${n}}`,
          `\\frac{|${k}| \\cdot |a|}{|b|} = \\frac{${K * m}}{${n}}`,
          `\\frac{|a|}{|${k}| \\cdot |b|} = \\frac{${m}}{${K * n}}`,
        ][shape]!;
        const s = steps(`${target} = ${work} = ${value.toLatex()}`);
        return numberProblem({
          prompt: givenAB(m, n, target),
          answer: value,
          wrong: [
            Q.of(bottom!, top!),
            value.neg(),
            Q.of(m * n),
            ...(shape === 0 ? [] : [Q.of(shape === 1 ? k * m : m, shape === 1 ? n : k * n)]),
          ],
          solution: t(`Divide the absolute values:${s}`, `用绝对值相除：${s}`),
        });
      },
    },
    {
      id: "rewriting-with-the-rules",
      title: t("Rewriting expressions", "改写式子"),
      explanation: t(
        "The rules let you move numbers out of absolute value bars. A number comes out as its absolute value, while a variable whose sign is not known stays inside:\n\n$$|-5x| = |-5| \\cdot |x| = 5|x| \\qquad \\left|\\frac{x}{-4}\\right| = \\frac{|x|}{4}$$\n\nA square is never negative, so $|x^{2}| = x^{2}$ and $|-3x^{2}| = 3x^{2}$. But $|-5x|$ is not $5x$: for $x = -1$ it is $5$, not $-5$.",
        "利用这些法则可以把数从绝对值符号中移出来。数移出来时变成它的绝对值，而符号未知的字母要留在里面：\n\n$$|-5x| = |-5| \\cdot |x| = 5|x| \\qquad \\left|\\frac{x}{-4}\\right| = \\frac{|x|}{4}$$\n\n平方不会是负数，所以 $|x^{2}| = x^{2}$，$|-3x^{2}| = 3x^{2}$。但 $|-5x|$ 不等于 $5x$：当 $x = -1$ 时它等于 $5$，而不是 $-5$。",
      ),
      generate(rng) {
        const k = rng.bool(0.7) ? -rng.int(2, 9) : rng.int(2, 9);
        const K = Math.abs(k);
        const shape = rng.int(0, 3);
        const [expr, options] = (
          [
            [`|${k}x|`, [`${K}|x|`, `-${K}|x|`, `${K}x`, `-${K}x`]],
            [`\\left|\\frac{x}{${k}}\\right|`, [`\\frac{|x|}{${K}}`, `-\\frac{|x|}{${K}}`, `\\frac{x}{${K}}`, `${K}|x|`]],
            [`|${k}x^{2}|`, [`${K}x^{2}`, `-${K}x^{2}`, `${K}|x|`, `${K}x`]],
            [`|${k}xy|`, [`${K}|x||y|`, `-${K}|x||y|`, `${K}xy`, `${K}|x|y`]],
          ] as const
        )[shape]!;
        const order = rng.shuffle([0, 1, 2, 3]);
        const vars = shape === 3 ? t("$x$ and $y$", "$x$ 和 $y$") : t("$x$", "$x$");
        return choiceProblem({
          prompt: t(
            `Which expression is equal to $${expr}$ for all values of ${vars.en}?`,
            `对 ${vars["zh-CN"]} 的所有取值，哪个式子与 $${expr}$ 相等？`,
          ),
          options: order.map((i) => same(`$${options[i]}$`)),
          correct: order.indexOf(0),
          solution:
            shape === 2
              ? t(
                  `$${expr} = |${k}| \\cdot |x^{2}| = ${K}x^{2}$, because $x^{2}$ is never negative.`,
                  `$${expr} = |${k}| \\cdot |x^{2}| = ${K}x^{2}$，因为 $x^{2}$ 不会是负数。`,
                )
              : t(
                  `Take the number out as its absolute value: $${expr} = ${options[0]}$. The variable stays inside the bars because its sign is not known.`,
                  `把数移出来并取绝对值：$${expr} = ${options[0]}$。字母的符号未知，所以留在绝对值符号里。`,
                ),
        });
      },
    },
  ],
};

/** furtherRulesOfAbsoluteValue reorders inside absolute values, bounds sums and removes bars when the sign is known. */
export const furtherRulesOfAbsoluteValue: TopicDef = {
  id: "further-rules-of-absolute-value",
  title: t("Further Rules of Absolute Value", "绝对值的进一步法则"),
  summary: t(
    "Use |a − b| = |b − a|, bound |a + b| by |a| + |b|, and remove absolute value bars when the sign of the inside is known.",
    "利用 |a − b| = |b − a|，用 |a| + |b| 估计 |a + b|，并在已知内部符号时去掉绝对值符号。",
  ),
  prerequisites: ["rules-of-absolute-value", "simplifying-expressions"],
  encompasses: [
    { topic: "rules-of-absolute-value", weight: 0.4 },
    { topic: "simplifying-expressions", weight: 0.3 },
  ],
  xp: 14,
  knowledgePoints: [
    {
      id: "reordering-inside-absolute-values",
      title: t("Reordering inside the bars", "绝对值内的变号"),
      explanation: t(
        "Changing the sign of everything inside the bars does not change the absolute value, because $|-a| = |a|$. So\n\n$$|3 - x| = |-(x - 3)| = |x - 3| \\qquad |-x - 4| = |-(x + 4)| = |x + 4|$$\n\nBut you cannot split the bars: $|x - 3|$ is not $|x| - 3$.",
        "把绝对值符号里面的每一项都变号，绝对值不变，因为 $|-a| = |a|$。所以\n\n$$|3 - x| = |-(x - 3)| = |x - 3| \\qquad |-x - 4| = |-(x + 4)| = |x + 4|$$\n\n但绝对值符号不能拆开：$|x - 3|$ 不等于 $|x| - 3$。",
      ),
      generate(rng) {
        const c = rng.int(1, 12);
        const a = rng.int(2, 5);
        const shape = rng.int(0, 2);
        const [expr, options] = (
          [
            [`|${c} - x|`, [`|x - ${c}|`, `|x + ${c}|`, `|x| - ${c}`, `-|x - ${c}|`]],
            [`|-x - ${c}|`, [`|x + ${c}|`, `|x - ${c}|`, `-|x + ${c}|`, `|x| + ${c}`]],
            [`|${c} - ${a}x|`, [`|${a}x - ${c}|`, `|${a}x + ${c}|`, `-|${a}x - ${c}|`, `${a}|x| - ${c}`]],
          ] as const
        )[shape]!;
        const order = rng.shuffle([0, 1, 2, 3]);
        return choiceProblem({
          prompt: t(`Which expression is equal to $${expr}$ for all values of $x$?`, `对 $x$ 的所有取值，哪个式子与 $${expr}$ 相等？`),
          options: order.map((i) => same(`$${options[i]}$`)),
          correct: order.indexOf(0),
          solution: t(
            `Changing the sign of everything inside does not change the absolute value: $${expr} = ${options[0]}$.`,
            `把绝对值符号里面的每一项都变号，绝对值不变：$${expr} = ${options[0]}$。`,
          ),
        });
      },
    },
    {
      id: "largest-and-smallest-values",
      title: t("Largest and smallest values", "最大值与最小值"),
      explanation: t(
        "If you know only $|a|$ and $|b|$, the value of $|a + b|$ depends on the signs. When $a$ and $b$ have the same sign their sizes add; when the signs are opposite they partly cancel. So\n\n$$\\big||a| - |b|\\big| \\le |a + b| \\le |a| + |b|$$\n\nFor $|a| = 7$ and $|b| = 3$: $|a + b|$ is at most $10$ (for $a = 7, b = 3$) and at least $4$ (for $a = 7, b = -3$). The same bounds hold for $|a - b|$, since $|-b| = |b|$.",
        "如果只知道 $|a|$ 和 $|b|$，那么 $|a + b|$ 的值取决于符号。$a$ 与 $b$ 同号时大小相加；异号时部分抵消。所以\n\n$$\\big||a| - |b|\\big| \\le |a + b| \\le |a| + |b|$$\n\n当 $|a| = 7$，$|b| = 3$ 时：$|a + b|$ 最大为 $10$（$a = 7, b = 3$），最小为 $4$（$a = 7, b = -3$）。由于 $|-b| = |b|$，$|a - b|$ 也有同样的范围。",
      ),
      generate(rng) {
        const m = rng.int(1, 15);
        let n = rng.int(1, 15);
        if (n === m) n = m === 15 ? 8 : m + 1;
        const op = rng.pick(["+", "-"]);
        const greatest = rng.bool();
        const target = `|a ${op} b|`;
        const answer = greatest ? m + n : Math.abs(m - n);
        return numberProblem({
          prompt: t(
            `Given that $|a| = ${m}$ and $|b| = ${n}$, find the ${greatest ? "greatest" : "least"} possible value of $${target}$.`,
            `已知 $|a| = ${m}$，$|b| = ${n}$，求 $${target}$ 可能取到的${greatest ? "最大" : "最小"}值。`,
          ),
          answer,
          wrong: greatest ? [Math.abs(m - n), m * n] : [m - n, n - m, m + n, 0],
          solution: greatest
            ? t(
                `$${target}$ is greatest when $a$ and $${op === "+" ? "" : "-"}b$ have the same sign, so the sizes add: $${m} + ${n} = ${answer}$.`,
                `当 $a$ 与 $${op === "+" ? "" : "-"}b$ 同号时 $${target}$ 最大，此时大小相加：$${m} + ${n} = ${answer}$。`,
              )
            : t(
                `$${target}$ is least when $a$ and $${op === "+" ? "" : "-"}b$ have opposite signs, so the sizes partly cancel: $|${m} - ${n}| = ${answer}$.`,
                `当 $a$ 与 $${op === "+" ? "" : "-"}b$ 异号时 $${target}$ 最小，此时大小部分抵消：$|${m} - ${n}| = ${answer}$。`,
              ),
        });
      },
    },
    {
      id: "removing-absolute-value-bars",
      title: t("Removing the bars", "去掉绝对值符号"),
      explanation: t(
        "When you know the sign of the expression inside, you can remove the bars: $|u| = u$ when $u \\ge 0$, and $|u| = -u$ when $u < 0$.\n\nIf $x < 3$, then $x - 3$ is negative, so $|x - 3| = -(x - 3) = 3 - x$, and\n\n$$|x - 3| + 2x = 3 - x + 2x = x + 3.$$",
        "如果知道绝对值符号里面式子的符号，就可以去掉绝对值符号：$u \\ge 0$ 时 $|u| = u$，$u < 0$ 时 $|u| = -u$。\n\n若 $x < 3$，则 $x - 3$ 是负数，所以 $|x - 3| = -(x - 3) = 3 - x$，于是\n\n$$|x - 3| + 2x = 3 - x + 2x = x + 3.$$",
      ),
      keyPrerequisites: ["simplifying-expressions"],
      generate(rng) {
        const m = rng.pick([1, 1, 2, 3, -1, -2]);
        const p = rng.int(-6, 6);
        const b = -m * p;
        const above = rng.bool();
        const s = (above ? 1 : -1) * Math.sign(m);
        let k = rng.nonZero(-5, 5);
        if (s * m + k === 0) k += k > 0 ? 1 : -1;
        const d = rng.int(-9, 9);
        const inner = linear(m, b);
        const expr = poly([1, bars(inner)], [k, "x"], [d, ""]);
        const answer = linear(s * m + k, s * b + d);
        const removed = s > 0 ? inner : linear(-m, -b);
        const cond = `x ${above ? ">" : "<"} ${p}`;
        const work = steps(`${expr} = ${poly([1, `(${removed})`], [k, "x"], [d, ""])} = ${answer}`);
        return expressionProblem({
          prompt: t(
            `Given that $${cond}$, write $${expr}$ without absolute value bars and simplify.`,
            `已知 $${cond}$，去掉 $${expr}$ 中的绝对值符号并化简。`,
          ),
          answer,
          simplified: true,
          wrong: [linear(-s * m + k, -s * b + d), linear(s * m + k, b + d), linear(s * m + k, -b + d)],
          solution: t(
            `When $${cond}$, $${inner}$ is ${s > 0 ? "positive" : "negative"}, so $${bars(inner)} = ${removed}$:${work}`,
            `当 $${cond}$ 时，$${inner}$ 是${s > 0 ? "正" : "负"}数，所以 $${bars(inner)} = ${removed}$：${work}`,
          ),
        });
      },
    },
  ],
};

/** absoluteValueEquations solves |ax + b| = c. */
export const absoluteValueEquations: TopicDef = {
  id: "absolute-value-equations",
  title: t("Absolute Value Equations", "绝对值方程"),
  summary: t(
    "Solve |ax + b| = c by splitting it into two linear equations, and recognize when there is one solution or none.",
    "把 |ax + b| = c 拆成两个一次方程求解，并识别只有一个解或无解的情形。",
  ),
  prerequisites: ["absolute-value-expressions", "two-step-equations"],
  encompasses: [
    { topic: "two-step-equations", weight: 0.5 },
    { topic: "absolute-value-expressions", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.CED.A.1"],
  knowledgePoints: [
    {
      id: "solving-simple-absolute-value-equations",
      title: t("Equations like |x + b| = c", "形如 |x + b| = c 的方程"),
      explanation: t(
        "$|u| = c$ with $c > 0$ means $u$ is $c$ units from $0$, so $u = c$ or $u = -c$. Solve both equations:\n\n$$|x + 2| = 5 \\;\\Rightarrow\\; x + 2 = 5 \\text{ or } x + 2 = -5 \\;\\Rightarrow\\; x = 3 \\text{ or } x = -7$$\n\nCheck: $|3 + 2| = 5$ and $|-7 + 2| = 5$.",
        "当 $c > 0$ 时，$|u| = c$ 表示 $u$ 到 $0$ 的距离是 $c$，所以 $u = c$ 或 $u = -c$。两个方程都要解：\n\n$$|x + 2| = 5 \\;\\Rightarrow\\; x + 2 = 5 \\text{ 或 } x + 2 = -5 \\;\\Rightarrow\\; x = 3 \\text{ 或 } x = -7$$\n\n检验：$|3 + 2| = 5$，$|-7 + 2| = 5$。",
      ),
      generate(rng) {
        const b = rng.int(-9, 9);
        const c = rng.int(1, 12);
        const L = linear(1, b);
        const x = solveAbs(1, b, c);
        const cs = caseLines(L, String(c), String(-c));
        const st = solsText(x);
        return solutionsProblem({
          prompt: solveText(`${bars(L)} = ${c}`, listSolutions),
          values: sols(x),
          wrong: [[String(b + c), String(b - c)], [String(c - b)], [String(c), String(-c)]],
          solution: t(`Split into two equations:${cs.en}So ${st.en}.`, `拆成两个方程：${cs.zh}所以 ${st.zh}。`),
        });
      },
    },
    {
      id: "solving-absolute-value-equations-with-coefficients",
      title: t("Equations like |ax + b| = c", "形如 |ax + b| = c 的方程"),
      explanation: t(
        "With a coefficient inside the bars, split the equation the same way and solve two two-step equations:\n\n$$|3x - 1| = 8 \\;\\Rightarrow\\; 3x - 1 = 8 \\text{ or } 3x - 1 = -8 \\;\\Rightarrow\\; x = 3 \\text{ or } x = -\\frac{7}{3}$$\n\nThe two solutions are not opposites of each other unless $b = 0$.",
        "绝对值符号里有系数时，同样拆成两个方程，分别解两个两步方程：\n\n$$|3x - 1| = 8 \\;\\Rightarrow\\; 3x - 1 = 8 \\text{ 或 } 3x - 1 = -8 \\;\\Rightarrow\\; x = 3 \\text{ 或 } x = -\\frac{7}{3}$$\n\n除非 $b = 0$，两个解并不互为相反数。",
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const a = rng.sign() * rng.int(2, 6);
        const b = rng.nonZero(-12, 12);
        const c = rng.int(1, 15);
        const L = linear(a, b);
        const x = solveAbs(a, b, c);
        const first = x[0]!;
        const cs = caseLines(L, String(c), String(-c));
        const st = solsText(x);
        return solutionsProblem({
          prompt: solveText(`${bars(L)} = ${c}`, listSolutions),
          values: sols(x),
          wrong: [[first.toLatex()], sols([first, first.neg()]), sols([Q.of(c + b, a), Q.of(-c + b, a)])],
          solution: t(`Split into two equations:${cs.en}So ${st.en}.`, `拆成两个方程：${cs.zh}所以 ${st.zh}。`),
        });
      },
    },
    {
      id: "zero-and-negative-right-sides",
      title: t("One solution or none", "只有一个解或无解"),
      explanation: t(
        "An absolute value is never negative, so $|u| = c$ has **no solution** when $c < 0$. When $c = 0$ the only possibility is $u = 0$, so there is **one solution**:\n\n$$|2x + 7| = -3 \\;\\Rightarrow\\; \\varnothing \\qquad |2x + 7| = 0 \\;\\Rightarrow\\; 2x + 7 = 0 \\;\\Rightarrow\\; x = -\\frac{7}{2}$$",
        "绝对值不会是负数，所以当 $c < 0$ 时 $|u| = c$ **无解**。当 $c = 0$ 时只能 $u = 0$，所以只有**一个解**：\n\n$$|2x + 7| = -3 \\;\\Rightarrow\\; \\varnothing \\qquad |2x + 7| = 0 \\;\\Rightarrow\\; 2x + 7 = 0 \\;\\Rightarrow\\; x = -\\frac{7}{2}$$",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-12, 12);
        const L = linear(a, b);
        if (rng.bool()) {
          const r = Q.of(-b, a);
          return solutionsProblem({
            prompt: solveText(`${bars(L)} = 0`, listSolutions),
            values: [r.toLatex()],
            wrong: [sols([r, r.neg()]), [], [r.neg().toLatex()]],
            solution: t(
              `Only $0$ has absolute value $0$, so ${steps(`${L} = 0`, `x = ${r.toLatex()}`)}There is one solution.`,
              `只有 $0$ 的绝对值是 $0$，所以${steps(`${L} = 0`, `x = ${r.toLatex()}`)}方程只有一个解。`,
            ),
          });
        }
        const c = -rng.int(1, 12);
        return solutionsProblem({
          prompt: solveText(`${bars(L)} = ${c}`, listSolutions),
          values: [],
          wrong: [sols(solveAbs(a, b, -c)), [Q.of(c - b, a).toLatex()]],
          solution: t(
            `An absolute value is never negative, so $${bars(L)}$ cannot equal $${c}$. There is no solution: $\\varnothing$.`,
            `绝对值不会是负数，所以 $${bars(L)}$ 不可能等于 $${c}$。方程无解：$\\varnothing$。`,
          ),
        });
      },
    },
  ],
};

/** isolated draws k|ax + b| + d = e with |ax + b| equal to c after isolating. */
function isolated(rng: Rng, c: number) {
  const a = rng.nonZero(-4, 4);
  const b = rng.nonZero(-9, 9);
  const k = rng.sign() * rng.int(2, 5);
  const d = rng.nonZero(-10, 10);
  const e = k * c + d;
  const L = linear(a, b);
  const lhs = poly([k, bars(L)], [d, ""]);
  return { a, b, k, d, e, L, eq: `${lhs} = ${e}`, iso: steps(`${lhs} = ${e}`, `${k}${bars(L)} = ${e - d}`, `${bars(L)} = ${c}`) };
}

/** furtherAbsoluteValueEquations isolates the absolute value first and solves |u| = |v|. */
export const furtherAbsoluteValueEquations: TopicDef = {
  id: "further-absolute-value-equations",
  title: t("Further Absolute Value Equations", "绝对值方程进阶"),
  summary: t(
    "Isolate the absolute value before splitting an equation, and solve equations with an absolute value on each side.",
    "先把绝对值单独放在一边再拆分方程，并解两边都有绝对值的方程。",
  ),
  prerequisites: ["absolute-value-equations", "equations-with-variables-on-both-sides"],
  encompasses: [
    { topic: "absolute-value-equations", weight: 0.7 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.1"],
  knowledgePoints: [
    {
      id: "isolating-the-absolute-value",
      title: t("Isolating the absolute value", "先把绝对值单独放在一边"),
      explanation: t(
        "Before splitting an equation into two cases, get the absolute value alone on one side, undoing addition and multiplication as in a two-step equation:\n\n$$2|x - 3| + 1 = 9 \\;\\Rightarrow\\; 2|x - 3| = 8 \\;\\Rightarrow\\; |x - 3| = 4$$\n\nThen $x - 3 = 4$ or $x - 3 = -4$, so $x = 7$ or $x = -1$.",
        "在拆成两种情况之前，先像解两步方程那样，把绝对值单独放在等号一边：\n\n$$2|x - 3| + 1 = 9 \\;\\Rightarrow\\; 2|x - 3| = 8 \\;\\Rightarrow\\; |x - 3| = 4$$\n\n于是 $x - 3 = 4$ 或 $x - 3 = -4$，得 $x = 7$ 或 $x = -1$。",
      ),
      generate(rng) {
        const c = rng.int(1, 10);
        const p = isolated(rng, c);
        const x = solveAbs(p.a, p.b, c);
        const cs = caseLines(p.L, String(c), String(-c));
        const st = solsText(x);
        return solutionsProblem({
          prompt: solveText(p.eq, listSolutions),
          values: sols(x),
          wrong: [sols(solveAbs(p.a, p.b, p.e)), sols(solveAbs(p.a, p.b, p.e - p.d)), [x[0]!.toLatex()]],
          solution: t(
            `Isolate the absolute value:${p.iso}Then split into two equations:${cs.en}So ${st.en}.`,
            `先把绝对值单独放在一边：${p.iso}再拆成两个方程：${cs.zh}所以 ${st.zh}。`,
          ),
        });
      },
    },
    {
      id: "isolated-values-that-are-not-positive",
      title: t("When the isolated value is not positive", "单独放置后右边不是正数"),
      explanation: t(
        "Only after isolating can you see whether the equation has solutions. In\n\n$$-3|x + 2| + 4 = 10 \\;\\Rightarrow\\; -3|x + 2| = 6 \\;\\Rightarrow\\; |x + 2| = -2$$\n\nan absolute value would have to be negative, so there is no solution. If the isolated value is $0$, there is exactly one solution.",
        "只有把绝对值单独放好后，才能判断方程是否有解。在\n\n$$-3|x + 2| + 4 = 10 \\;\\Rightarrow\\; -3|x + 2| = 6 \\;\\Rightarrow\\; |x + 2| = -2$$\n\n中，绝对值必须是负数，所以方程无解。如果单独放置后右边是 $0$，方程恰有一个解。",
      ),
      generate(rng) {
        const c = rng.bool(0.3) ? 0 : -rng.int(1, 8);
        const p = isolated(rng, c);
        const x = solveAbs(p.a, p.b, c);
        return solutionsProblem({
          prompt: solveText(p.eq, listSolutions),
          values: sols(x),
          wrong:
            c === 0
              ? [[], sols([x[0]!, x[0]!.neg()]), sols(solveAbs(p.a, p.b, Math.abs(p.e)))]
              : [sols(solveAbs(p.a, p.b, -c)), sols(solveAbs(p.a, p.b, Math.abs(p.e)))],
          solution:
            c === 0
              ? t(
                  `Isolate the absolute value:${p.iso}So $${p.L} = 0$, which gives $x = ${x[0]!.toLatex()}$, the only solution.`,
                  `先把绝对值单独放在一边：${p.iso}所以 $${p.L} = 0$，得 $x = ${x[0]!.toLatex()}$，这是唯一的解。`,
                )
              : t(
                  `Isolate the absolute value:${p.iso}An absolute value is never negative, so there is no solution: $\\varnothing$.`,
                  `先把绝对值单独放在一边：${p.iso}绝对值不会是负数，所以方程无解：$\\varnothing$。`,
                ),
        });
      },
    },
    {
      id: "absolute-values-on-both-sides",
      title: t("Absolute values on both sides", "两边都有绝对值"),
      explanation: t(
        "Two numbers have the same absolute value exactly when they are equal or opposite. So $|u| = |v|$ splits into $u = v$ or $u = -v$:\n\n$$|2x - 1| = |x + 4| \\;\\Rightarrow\\; 2x - 1 = x + 4 \\text{ or } 2x - 1 = -(x + 4)$$\n\nThe first gives $x = 5$; the second, $2x - 1 = -x - 4$, gives $x = -1$. Put the second right side in parentheses so that the minus sign reaches every term.",
        "两个数的绝对值相等，当且仅当它们相等或互为相反数。所以 $|u| = |v|$ 拆成 $u = v$ 或 $u = -v$：\n\n$$|2x - 1| = |x + 4| \\;\\Rightarrow\\; 2x - 1 = x + 4 \\text{ 或 } 2x - 1 = -(x + 4)$$\n\n第一个方程得 $x = 5$；第二个方程 $2x - 1 = -x - 4$，得 $x = -1$。第二个方程的右边要加括号，使负号作用到每一项。",
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        const a = rng.int(1, 5);
        let c = rng.sign() * rng.int(1, 5);
        if (Math.abs(c) === a) c = c > 0 ? c + 1 : c - 1;
        const b = rng.nonZero(-9, 9);
        const d = rng.nonZero(-9, 9);
        const L = linear(a, b);
        const R = linear(c, d);
        const x1 = Q.of(d - b, a - c);
        const x2 = Q.of(-d - b, a + c);
        const cs = caseLines(L, R, `-(${R})`);
        const st = solsText([x1, x2]);
        return solutionsProblem({
          prompt: solveText(`${bars(L)} = ${bars(R)}`, listSolutions),
          values: sols([x1, x2]),
          wrong: [[x1.toLatex()], sols([x1, x1.neg()]), sols([x1, Q.of(d - b, a + c)])],
          solution: t(`The two sides are equal or opposite:${cs.en}So ${st.en}.`, `两边相等或互为相反数：${cs.zh}所以 ${st.zh}。`),
        });
      },
    },
  ],
};

/** AbsLinear is an equation |Ax + B| = cx + d with its two candidate solutions. */
interface AbsLinear {
  readonly A: number;
  readonly B: number;
  readonly c: number;
  readonly d: number;
  readonly L: string;
  readonly R: string;
  /** cands are the solutions of Ax + B = cx + d and Ax + B = -(cx + d), in that order. */
  readonly cands: readonly [Q, Q];
  readonly valid: readonly [boolean, boolean];
}

/**
 * absLinear draws |Ax + B| = cx + d with two solutions, one, or none. With
 * |c| < |A| the line meets the V twice when it passes above the vertex and
 * never when below; with |c| > |A| it meets it exactly once.
 */
function absLinear(rng: Rng, kind: "two" | "one" | "none", dNonZero = false): AbsLinear {
  for (;;) {
    const a = kind === "one" ? rng.int(1, 3) : rng.int(2, 5);
    const c = kind === "one" ? rng.sign() * rng.int(a + 1, a + 3) : rng.sign() * rng.int(1, a - 1);
    const h = rng.sign() * rng.int(1, kind === "one" ? 4 : 6);
    const s = rng.sign();
    const l = lcm(Math.abs(a - c), a + c > 0 ? a + c : -(a + c));
    const nice = range(1, 16).filter((v) => v % l === 0);
    let v = nice.length > 0 && rng.bool(0.8) ? rng.pick(nice) : rng.int(1, 9);
    if (kind === "none" || (kind === "one" && rng.bool())) v = -v;
    const d = v - c * h;
    if (dNonZero && d === 0) continue;
    const A = s * a;
    const B = -s * a * h;
    const x1 = Q.of(d - B, A - c);
    const x2 = Q.of(-d - B, A + c);
    const ok = (x: Q) =>
      Q.of(A)
        .mul(x)
        .add(Q.of(B))
        .abs()
        .eq(Q.of(c).mul(x).add(Q.of(d)));
    return { A, B, c, d, L: linear(A, B), R: linear(c, d), cands: [x1, x2], valid: [ok(x1), ok(x2)] };
  }
}

/** casesWork writes the two cases of |L| = R solved. */
function casesWork(p: AbsLinear): { en: string; zh: string } {
  return caseLines(p.L, p.R, `-(${p.R})`);
}

/** checkLine writes the check of a candidate: |A·x + B| against c·x + d. */
function checkLine(p: AbsLinear, x: Q): string {
  const left = Q.of(p.A).mul(x).add(Q.of(p.B)).abs();
  const right = Q.of(p.c).mul(x).add(Q.of(p.d));
  return `x = ${x.toLatex()}: \\quad ${bars(Q.of(p.A).mul(x).add(Q.of(p.B)).toLatex())} = ${left.toLatex()}, \\quad ${linear(p.c, p.d).replace("x", `(${x.toLatex()})`)} = ${right.toLatex()}`;
}

/** equationsConnectingAbsoluteValueAndLinearFunctions solves |ax + b| = cx + d by cases. */
export const equationsConnectingAbsoluteValueAndLinearFunctions: TopicDef = {
  id: "equations-connecting-absolute-value-and-linear-functions",
  title: t("Equations Connecting Absolute Value and Linear Functions", "绝对值与一次函数相等的方程"),
  summary: t(
    "Solve equations |ax + b| = cx + d by writing the two cases and solving each as a linear equation.",
    "解形如 |ax + b| = cx + d 的方程：写出两种情况，分别按一次方程求解。",
  ),
  prerequisites: ["further-absolute-value-equations"],
  encompasses: [
    { topic: "further-absolute-value-equations", weight: 0.5 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.A.1"],
  knowledgePoints: [
    {
      id: "writing-the-two-cases",
      title: t("Writing the two cases", "写出两种情况"),
      explanation: t(
        "When the right side contains $x$, split $|u| = v$ in the same way: $u = v$ or $u = -v$. The whole right side changes sign in the second case, so put it in parentheses:\n\n$$|2x - 1| = x + 4 \\;\\Rightarrow\\; 2x - 1 = x + 4 \\text{ or } 2x - 1 = -(x + 4)$$\n\nWriting $2x - 1 = -x + 4$ changes the sign of only one term and gives a wrong equation.",
        "右边含有 $x$ 时，同样把 $|u| = v$ 拆成 $u = v$ 或 $u = -v$。第二种情况中整个右边都要变号，所以要加括号：\n\n$$|2x - 1| = x + 4 \\;\\Rightarrow\\; 2x - 1 = x + 4 \\text{ 或 } 2x - 1 = -(x + 4)$$\n\n写成 $2x - 1 = -x + 4$ 只改变了一项的符号，得到的方程是错的。",
      ),
      generate(rng) {
        const p = absLinear(rng, rng.pick(["two", "one"]), true);
        const Lw = linear(-p.A, p.B);
        const Rw = linear(-p.c, p.d);
        const options: Text[] = [
          t(`$${p.L} = ${p.R}$ or $${p.L} = -(${p.R})$`, `$${p.L} = ${p.R}$ 或 $${p.L} = -(${p.R})$`),
          t(`$${p.L} = ${p.R}$ or $${p.L} = ${Rw}$`, `$${p.L} = ${p.R}$ 或 $${p.L} = ${Rw}$`),
          t(`$${p.L} = ${p.R}$ or $${Lw} = ${p.R}$`, `$${p.L} = ${p.R}$ 或 $${Lw} = ${p.R}$`),
          t(`Only $${p.L} = ${p.R}$`, `只有 $${p.L} = ${p.R}$`),
        ];
        const order = rng.shuffle([0, 1, 2, 3]);
        return choiceProblem({
          prompt: t(
            `Which pair of equations should you solve to solve $${bars(p.L)} = ${p.R}$?`,
            `解方程 $${bars(p.L)} = ${p.R}$ 时，应该解哪一组方程？`,
          ),
          options: order.map((i) => options[i]!),
          correct: order.indexOf(0),
          solution: t(
            `The expression inside the bars equals the right side or its opposite, and the whole right side changes sign: $${p.L} = ${p.R}$ or $${p.L} = -(${p.R})$.`,
            `绝对值符号里的式子等于右边或右边的相反数，整个右边都要变号：$${p.L} = ${p.R}$ 或 $${p.L} = -(${p.R})$。`,
          ),
        });
      },
    },
    {
      id: "solving-by-cases",
      title: t("Solving by cases", "分情况求解"),
      explanation: t(
        "Solve each case as a linear equation with variables on both sides:\n\n$$2x - 1 = x + 4 \\;\\Rightarrow\\; x = 5 \\qquad 2x - 1 = -x - 4 \\;\\Rightarrow\\; 3x = -3 \\;\\Rightarrow\\; x = -1$$\n\nCheck each solution in the original equation: $|2(5) - 1| = 9 = 5 + 4$ and $|2(-1) - 1| = 3 = -1 + 4$.",
        "把每种情况当作两边都有未知数的一次方程来解：\n\n$$2x - 1 = x + 4 \\;\\Rightarrow\\; x = 5 \\qquad 2x - 1 = -x - 4 \\;\\Rightarrow\\; 3x = -3 \\;\\Rightarrow\\; x = -1$$\n\n把每个解代回原方程检验：$|2(5) - 1| = 9 = 5 + 4$，$|2(-1) - 1| = 3 = -1 + 4$。",
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        const p = absLinear(rng, "two");
        const [x1, x2] = p.cands;
        const cs = casesWork(p);
        const st = solsText([x1, x2]);
        const sloppy = p.A + p.c !== 0 ? [sols([x1, Q.of(p.d - p.B, p.A + p.c)])] : [];
        return solutionsProblem({
          prompt: solveText(`${bars(p.L)} = ${p.R}`, listSolutions),
          values: sols([x1, x2]),
          wrong: [[x1.toLatex()], [x2.toLatex()], ...sloppy],
          solution: t(
            `Solve both cases:${cs.en}This gives ${st.en}, and both check in the original equation.`,
            `两种情况都要解：${cs.zh}得 ${st.zh}，代回原方程检验都成立。`,
          ),
        });
      },
    },
    {
      id: "checking-solutions",
      title: t("Checking a solution", "检验一个解"),
      explanation: t(
        "To check whether a number is a solution, substitute it into both sides of the original equation and compare. For $|2x - 1| = x + 4$ and $x = 2$: the left side is $|2(2) - 1| = 3$ and the right side is $2 + 4 = 6$, so $x = 2$ is not a solution.",
        "要检验一个数是不是解，把它代入原方程的两边并比较。对于 $|2x - 1| = x + 4$ 和 $x = 2$：左边是 $|2(2) - 1| = 3$，右边是 $2 + 4 = 6$，所以 $x = 2$ 不是解。",
      ),
      generate(rng) {
        const p = absLinear(rng, rng.pick(["two", "two", "one"]));
        const x = rng.bool() ? rng.pick(p.cands.filter((_, i) => p.valid[i])) : Q.of(rng.int(-8, 8));
        const left = Q.of(p.A).mul(x).add(Q.of(p.B)).abs();
        const right = Q.of(p.c).mul(x).add(Q.of(p.d));
        const yes = left.eq(right);
        const line = steps(checkLine(p, x));
        return choiceProblem({
          prompt: t(
            `Is $x = ${x.toLatex()}$ a solution of $${bars(p.L)} = ${p.R}$?`,
            `$x = ${x.toLatex()}$ 是方程 $${bars(p.L)} = ${p.R}$ 的解吗？`,
          ),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: t(
            `Substitute into both sides:${line}${yes ? "The sides are equal, so it is a solution." : "The sides are not equal, so it is not a solution."}`,
            `代入两边：${line}${yes ? "两边相等，所以它是解。" : "两边不相等，所以它不是解。"}`,
          ),
        });
      },
    },
  ],
};

/** absoluteValueEquationsWithExtraneousSolutions rejects extraneous candidates of |ax + b| = cx + d. */
export const absoluteValueEquationsWithExtraneousSolutions: TopicDef = {
  id: "absolute-value-equations-with-extraneous-solutions",
  title: t("Absolute Value Equations With Extraneous Solutions", "有增根的绝对值方程"),
  summary: t(
    "Solve |ax + b| = cx + d by cases and reject the candidates that make the right side negative.",
    "分情况解 |ax + b| = cx + d，并舍去使右边为负数的增根。",
  ),
  prerequisites: ["equations-connecting-absolute-value-and-linear-functions"],
  encompasses: [{ topic: "equations-connecting-absolute-value-and-linear-functions", weight: 0.8 }],
  xp: 15,
  standards: ["CCSS.HSA.REI.A.2"],
  knowledgePoints: [
    {
      id: "rejecting-extraneous-solutions",
      title: t("Rejecting extraneous solutions", "舍去增根"),
      explanation: t(
        "Splitting $|u| = v$ into $u = v$ or $u = -v$ can produce numbers that do not solve the original equation: an absolute value cannot equal a negative number, so a candidate that makes $v$ negative is **extraneous**. Always check.\n\nFor $|x - 2| = 2x + 5$: the cases give $x = -7$ and $x = -1$. At $x = -7$ the right side is $2(-7) + 5 = -9 < 0$, so reject it. At $x = -1$: $|-1 - 2| = 3 = 2(-1) + 5$. The only solution is $x = -1$.",
        "把 $|u| = v$ 拆成 $u = v$ 或 $u = -v$ 时，可能得到不满足原方程的数：绝对值不能等于负数，所以使 $v$ 为负数的候选解是**增根**。一定要检验。\n\n对于 $|x - 2| = 2x + 5$：两种情况得 $x = -7$ 和 $x = -1$。当 $x = -7$ 时右边是 $2(-7) + 5 = -9 < 0$，舍去。当 $x = -1$ 时：$|-1 - 2| = 3 = 2(-1) + 5$。唯一的解是 $x = -1$。",
      ),
      generate(rng) {
        const p = absLinear(rng, "one");
        const good = p.cands.find((_, i) => p.valid[i])!;
        const bad = p.cands.find((_, i) => !p.valid[i])!;
        const cs = casesWork(p);
        const checks = steps(checkLine(p, p.cands[0]), checkLine(p, p.cands[1]));
        return solutionsProblem({
          prompt: solveText(`${bars(p.L)} = ${p.R}`, listSolutions),
          values: [good.toLatex()],
          wrong: [sols(p.cands), [bad.toLatex()], []],
          solution: t(
            `Solve both cases:${cs.en}Check each candidate:${checks}The right side is negative at $x = ${bad.toLatex()}$, so it is extraneous. The only solution is $x = ${good.toLatex()}$.`,
            `两种情况都要解：${cs.zh}逐一检验：${checks}当 $x = ${bad.toLatex()}$ 时右边为负数，它是增根。唯一的解是 $x = ${good.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "when-every-candidate-is-extraneous",
      title: t("When every candidate is extraneous", "所有候选解都是增根"),
      explanation: t(
        "Both candidates can be extraneous, and then the equation has no solution. For $|3x| = x - 4$ the cases give $x = -2$ and $x = 1$, but the right side is $-6$ and $-3$ there. Both are rejected, so the solution set is $\\varnothing$.",
        "两个候选解可能都是增根，这时方程无解。对于 $|3x| = x - 4$，两种情况得 $x = -2$ 和 $x = 1$，但此时右边分别是 $-6$ 和 $-3$。两个都要舍去，所以解集是 $\\varnothing$。",
      ),
      generate(rng) {
        const p = absLinear(rng, "none");
        const cs = casesWork(p);
        const checks = steps(checkLine(p, p.cands[0]), checkLine(p, p.cands[1]));
        return solutionsProblem({
          prompt: solveText(`${bars(p.L)} = ${p.R}`, listSolutions),
          values: [],
          wrong: [sols(p.cands), [p.cands[0].toLatex()], [p.cands[1].toLatex()]],
          solution: t(
            `Solve both cases:${cs.en}Check each candidate:${checks}The right side is negative at both, so both are extraneous and there is no solution: $\\varnothing$.`,
            `两种情况都要解：${cs.zh}逐一检验：${checks}两个候选解都使右边为负数，都是增根，所以方程无解：$\\varnothing$。`,
          ),
        });
      },
    },
    {
      id: "deciding-which-candidates-are-solutions",
      title: t("Which candidates are solutions?", "哪些候选解是解"),
      explanation: t(
        "A candidate from the cases is a solution exactly when the right side $cx + d$ is not negative there. Checking this sign is quicker than substituting into both sides: the case equations already make $|ax + b|$ equal to $cx + d$ whenever $cx + d \\ge 0$.",
        "由两种情况得到的候选解，当且仅当右边 $cx + d$ 在该处不是负数时才是解。检验这个符号比代入两边更快：只要 $cx + d \\ge 0$，情况方程已经保证 $|ax + b|$ 等于 $cx + d$。",
      ),
      generate(rng) {
        const p = absLinear(rng, rng.pick(["two", "one", "one", "none"]));
        const [x1, x2] = sortQ(p.cands);
        const v1 = p.valid[p.cands[0].eq(x1!) ? 0 : 1]!;
        const v2 = p.valid[p.cands[0].eq(x1!) ? 1 : 0]!;
        const correct = v1 && v2 ? 0 : v1 ? 1 : v2 ? 2 : 3;
        const rhs = (x: Q) => Q.of(p.c).mul(x).add(Q.of(p.d)).toLatex();
        const sub = (x: Q) => linear(p.c, p.d).replace("x", `(${x.toLatex()})`);
        const sign = steps(
          `x = ${x1!.toLatex()}: \\quad ${sub(x1!)} = ${rhs(x1!)}`,
          `x = ${x2!.toLatex()}: \\quad ${sub(x2!)} = ${rhs(x2!)}`,
        );
        return choiceProblem({
          prompt: t(
            `Solving $${bars(p.L)} = ${p.R}$ by cases gives $x = ${x1!.toLatex()}$ and $x = ${x2!.toLatex()}$. Which of them are solutions of the equation?`,
            `分情况解 $${bars(p.L)} = ${p.R}$ 得到 $x = ${x1!.toLatex()}$ 和 $x = ${x2!.toLatex()}$。其中哪些是方程的解？`,
          ),
          options: [
            t("Both", "两个都是"),
            t(`Only $x = ${x1!.toLatex()}$`, `只有 $x = ${x1!.toLatex()}$`),
            t(`Only $x = ${x2!.toLatex()}$`, `只有 $x = ${x2!.toLatex()}$`),
            t("Neither", "两个都不是"),
          ],
          correct,
          solution: t(
            `Find the right side $${p.R}$ at each candidate:${sign}A candidate is a solution only where the right side is not negative.`,
            `求每个候选解处右边 $${p.R}$ 的值：${sign}只有右边不是负数时，候选解才是解。`,
          ),
        });
      },
    },
  ],
};

/** absoluteValueInequalities solves absolute value inequalities as compound inequalities. */
export const absoluteValueInequalities: TopicDef = {
  id: "absolute-value-inequalities",
  title: t("Absolute Value Inequalities", "绝对值不等式"),
  summary: t(
    "Solve |ax + b| < c as an AND inequality and |ax + b| > c as an OR inequality, isolating the absolute value first.",
    "把 |ax + b| < c 化为“且”型不等式、把 |ax + b| > c 化为“或”型不等式求解，必要时先把绝对值单独放在一边。",
  ),
  prerequisites: ["absolute-value-equations", "compound-or-inequalities", "compound-and-inequalities"],
  encompasses: [
    { topic: "compound-and-inequalities", weight: 0.4 },
    { topic: "compound-or-inequalities", weight: 0.4 },
    { topic: "absolute-value-equations", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.1"],
  knowledgePoints: [
    {
      id: "less-than-inequalities",
      title: t("Less than: an AND inequality", "小于：“且”型不等式"),
      explanation: t(
        "$|u| < c$ (with $c > 0$) says $u$ is less than $c$ units from $0$, so $-c < u < c$. Solve the double inequality, reversing the symbols if you divide by a negative number:\n\n$$|2x - 3| \\le 7 \\;\\Rightarrow\\; -7 \\le 2x - 3 \\le 7 \\;\\Rightarrow\\; -4 \\le 2x \\le 10 \\;\\Rightarrow\\; [-2, 5]$$",
        "$|u| < c$（$c > 0$）表示 $u$ 到 $0$ 的距离小于 $c$，所以 $-c < u < c$。解这个连不等式，除以负数时要改变不等号方向：\n\n$$|2x - 3| \\le 7 \\;\\Rightarrow\\; -7 \\le 2x - 3 \\le 7 \\;\\Rightarrow\\; -4 \\le 2x \\le 10 \\;\\Rightarrow\\; [-2, 5]$$",
      ),
      keyPrerequisites: ["compound-and-inequalities"],
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b = rng.int(-10, 10);
        const c = rng.int(1, 12);
        const op: InequalityOp = rng.pick(["<", "<="]);
        const L = linear(a, b);
        const set = absSet(a, b, op, c);
        const s = steps(`${-c} ${relSymbol(op)} ${L} ${relSymbol(op)} ${c}`);
        return intervalProblem({
          prompt: solveText(`${bars(L)} ${relSymbol(op)} ${c}`, asInterval),
          set,
          form: "interval",
          wrong: [absSet(a, b, flip[op], c), toggleEnds(set), absSet(a, b, op === "<" ? ">=" : ">", c)],
          solution: t(
            `Write the AND inequality and solve it:${s}The solution set is $${intervalLatex(set)}$.`,
            `写成连不等式并求解：${s}解集是 $${intervalLatex(set)}$。`,
          ),
        });
      },
    },
    {
      id: "greater-than-inequalities",
      title: t("Greater than: an OR inequality", "大于：“或”型不等式"),
      explanation: t(
        "$|u| > c$ (with $c > 0$) says $u$ is more than $c$ units from $0$, so $u < -c$ or $u > c$. Solve both parts and take the union:\n\n$$|x + 1| \\ge 4 \\;\\Rightarrow\\; x + 1 \\le -4 \\text{ or } x + 1 \\ge 4 \\;\\Rightarrow\\; (-\\infty, -5] \\cup [3, \\infty)$$",
        "$|u| > c$（$c > 0$）表示 $u$ 到 $0$ 的距离大于 $c$，所以 $u < -c$ 或 $u > c$。分别解两部分，再取并集：\n\n$$|x + 1| \\ge 4 \\;\\Rightarrow\\; x + 1 \\le -4 \\text{ 或 } x + 1 \\ge 4 \\;\\Rightarrow\\; (-\\infty, -5] \\cup [3, \\infty)$$",
      ),
      keyPrerequisites: ["compound-or-inequalities"],
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b = rng.int(-10, 10);
        const c = rng.int(1, 12);
        const op: InequalityOp = rng.pick([">", ">="]);
        const L = linear(a, b);
        const set = absSet(a, b, op, c);
        const lo = op === ">" ? "<" : "\\le";
        const en = steps(`${L} ${lo} ${-c} \\quad\\text{or}\\quad ${L} ${relSymbol(op)} ${c}`);
        const zh = steps(`${L} ${lo} ${-c} \\quad\\text{或}\\quad ${L} ${relSymbol(op)} ${c}`);
        return intervalProblem({
          prompt: solveText(`${bars(L)} ${relSymbol(op)} ${c}`, asInterval),
          set,
          form: "interval",
          wrong: [absSet(a, b, flip[op], c), toggleEnds(set), []],
          solution: t(
            `Write the OR inequality and solve each part:${en}The solution set is $${intervalLatex(set)}$.`,
            `写成“或”型不等式并分别求解：${zh}解集是 $${intervalLatex(set)}$。`,
          ),
        });
      },
    },
    {
      id: "isolating-before-solving-inequalities",
      title: t("Isolating the absolute value", "先把绝对值单独放在一边"),
      explanation: t(
        "As with equations, isolate the absolute value first. Dividing both sides by a negative number reverses the inequality, and may turn a “less than” into a “greater than”:\n\n$$-2|x - 1| + 3 < -5 \\;\\Rightarrow\\; -2|x - 1| < -8 \\;\\Rightarrow\\; |x - 1| > 4 \\;\\Rightarrow\\; (-\\infty, -3) \\cup (5, \\infty)$$",
        "与方程一样，先把绝对值单独放在一边。两边除以负数时不等号方向改变，“小于”可能变成“大于”：\n\n$$-2|x - 1| + 3 < -5 \\;\\Rightarrow\\; -2|x - 1| < -8 \\;\\Rightarrow\\; |x - 1| > 4 \\;\\Rightarrow\\; (-\\infty, -3) \\cup (5, \\infty)$$",
      ),
      generate(rng) {
        const a = rng.nonZero(-3, 3);
        const b = rng.int(-8, 8);
        const c = rng.int(1, 8);
        const k = rng.sign() * rng.int(2, 4);
        const d = rng.nonZero(-9, 9);
        const e = k * c + d;
        const op: InequalityOp = rng.pick(["<", "<=", ">", ">="]);
        const iso = k < 0 ? flip[op] : op;
        const L = linear(a, b);
        const lhs = poly([k, bars(L)], [d, ""]);
        const set = absSet(a, b, iso, c);
        const s = steps(`${lhs} ${relSymbol(op)} ${e}`, `${k}${bars(L)} ${relSymbol(op)} ${e - d}`, `${bars(L)} ${relSymbol(iso)} ${c}`);
        return intervalProblem({
          prompt: solveText(`${lhs} ${relSymbol(op)} ${e}`, asInterval),
          set,
          form: "interval",
          wrong: [absSet(a, b, flip[iso], c), toggleEnds(set)],
          solution: t(
            `Isolate the absolute value${k < 0 ? ", reversing the symbol when dividing by a negative number" : ""}:${s}So the solution set is $${intervalLatex(set)}$.`,
            `先把绝对值单独放在一边${k < 0 ? "，除以负数时改变不等号方向" : ""}：${s}所以解集是 $${intervalLatex(set)}$。`,
          ),
        });
      },
    },
    {
      id: "special-cases-of-absolute-value-inequalities",
      title: t("Zero and negative right sides", "右边为零或负数"),
      explanation: t(
        "Since $|u| \\ge 0$ for every $u$:\n\n- $|u| < c$ with $c \\le 0$ has no solution, and so does $|u| \\le c$ with $c < 0$;\n- $|u| > c$ and $|u| \\ge c$ with $c < 0$ hold for every real number;\n- $|u| \\le 0$ holds only where $u = 0$, and $|u| > 0$ everywhere except there.\n\nFor example, $|x - 2| \\le 0$ has the single solution $\\{2\\}$, and $|x - 2| > 0$ gives $(-\\infty, 2) \\cup (2, \\infty)$.",
        "因为对任意 $u$ 都有 $|u| \\ge 0$：\n\n- 当 $c \\le 0$ 时 $|u| < c$ 无解；当 $c < 0$ 时 $|u| \\le c$ 也无解；\n- 当 $c < 0$ 时 $|u| > c$ 和 $|u| \\ge c$ 对所有实数都成立；\n- $|u| \\le 0$ 只在 $u = 0$ 处成立，$|u| > 0$ 在除该处以外的地方都成立。\n\n例如，$|x - 2| \\le 0$ 只有一个解 $\\{2\\}$，而 $|x - 2| > 0$ 的解集是 $(-\\infty, 2) \\cup (2, \\infty)$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b = rng.int(-10, 10);
        const L = linear(a, b);
        const op: InequalityOp = rng.pick(["<", "<=", ">", ">="]);
        const r = Q.of(-b, a);
        const point = union(span(r, true, r, true));
        const punctured = union(ray("<", r), ray(">", r));
        let c: number;
        let set: RealSet;
        let wrong: RealSet[];
        let en: string;
        let zh: string;
        if (rng.bool()) {
          c = -rng.int(1, 9);
          if (isLess(op)) {
            set = [];
            wrong = [absSet(a, b, op, -c), realLine];
            en = `An absolute value is never negative, so it is never ${op === "<" ? "less than" : "at most"} $${c}$: no solution.`;
            zh = `绝对值不会是负数，所以它不可能${op === "<" ? "小于" : "小于或等于"} $${c}$：无解。`;
          } else {
            set = realLine;
            wrong = [absSet(a, b, op, -c), []];
            en = `An absolute value is never negative, so it is always greater than $${c}$: every real number is a solution.`;
            zh = `绝对值不会是负数，所以它总是大于 $${c}$：所有实数都是解。`;
          }
        } else {
          c = 0;
          const where = `$${L} = 0$, that is, $x = ${r.toLatex()}$`;
          const whereZh = `$${L} = 0$，即 $x = ${r.toLatex()}$`;
          if (op === "<") {
            set = [];
            wrong = [point, realLine];
            en = "An absolute value is never negative, so it is never less than $0$: no solution.";
            zh = "绝对值不会是负数，所以它不可能小于 $0$：无解。";
          } else if (op === "<=") {
            set = point;
            wrong = [[], realLine];
            en = `An absolute value is never negative, so it is at most $0$ only where it equals $0$: where ${where}.`;
            zh = `绝对值不会是负数，所以它小于或等于 $0$ 只能是等于 $0$：即 ${whereZh}。`;
          } else if (op === ">=") {
            set = realLine;
            wrong = [point, punctured];
            en = "An absolute value is never negative, so it is at least $0$ for every real number.";
            zh = "绝对值不会是负数，所以对所有实数它都大于或等于 $0$。";
          } else {
            set = punctured;
            wrong = [realLine, point, []];
            en = `An absolute value is positive except where it equals $0$: where ${where}. So every number except $${r.toLatex()}$ is a solution.`;
            zh = `绝对值除了等于 $0$ 的地方以外都是正数，等于 $0$ 是在 ${whereZh} 处。所以除 $${r.toLatex()}$ 以外的所有数都是解。`;
          }
        }
        return intervalProblem({
          prompt: solveText(`${bars(L)} ${relSymbol(op)} ${c}`, asInterval),
          set,
          form: "interval",
          wrong,
          solution: t(`${en} The solution set is $${intervalLatex(set)}$.`, `${zh}解集是 $${intervalLatex(set)}$。`),
        });
      },
    },
  ],
};

// Unit 2: absolute value functions.

const graphPrompt = t(
  "The graph of an absolute value function is shown. Write its equation.",
  "如图是一个绝对值函数的图象。写出它的解析式。",
);

/** absoluteValueGraphs graphs translations of y = |x|. */
export const absoluteValueGraphs: TopicDef = {
  id: "absolute-value-graphs",
  title: t("Absolute Value Graphs", "绝对值函数的图象"),
  summary: t(
    "Graph y = |x − h| + k as the V of y = |x| translated so that its vertex is at (h, k).",
    "把 y = |x − h| + k 的图象看作 y = |x| 的 V 形图象平移到顶点 (h, k) 处。",
  ),
  prerequisites: ["absolute-value-expressions", "graphs-of-functions"],
  encompasses: [
    { topic: "graphs-of-functions", weight: 0.3 },
    { topic: "absolute-value-expressions", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.B", "CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "vertex-of-a-translated-graph",
      title: t("The vertex", "顶点"),
      explanation: t(
        "The graph of $y = |x|$ is a V with its corner, the **vertex**, at $(0, 0)$: it follows $y = -x$ to the left of $0$ and $y = x$ to the right.\n\nThe graph of $y = |x - h| + k$ is the same V moved so that its vertex is at $(h, k)$: $h$ units right and $k$ units up. Watch the sign of $h$: $y = |x + 2| - 1 = |x - (-2)| + (-1)$ has its vertex at $(-2, -1)$.",
        "$y = |x|$ 的图象是一个 V 形，它的拐角叫**顶点**，在 $(0, 0)$：$0$ 的左边沿着 $y = -x$，右边沿着 $y = x$。\n\n$y = |x - h| + k$ 的图象是把这个 V 形移动到顶点为 $(h, k)$ 的位置：向右 $h$ 个单位，向上 $k$ 个单位。注意 $h$ 的符号：$y = |x + 2| - 1 = |x - (-2)| + (-1)$ 的顶点是 $(-2, -1)$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-9, 9);
        const k = rng.int(-9, 9);
        return pointProblem({
          prompt: t(`Find the vertex of the graph of $y = ${absFn(1, h, k)}$.`, `求 $y = ${absFn(1, h, k)}$ 的图象的顶点。`),
          answer: [h, k],
          wrong: [
            [-h, k],
            [k, h],
            [h, -k],
            [-h, -k],
          ],
          solution: t(
            `In the form $y = |x - h| + k$, $h = ${h}$ and $k = ${k}$, so the vertex is $${pt(h, k)}$.`,
            `写成 $y = |x - h| + k$ 的形式，$h = ${h}$，$k = ${k}$，所以顶点是 $${pt(h, k)}$。`,
          ),
        });
      },
    },
    {
      id: "equations-from-graphs",
      title: t("Equations from graphs", "由图象写解析式"),
      explanation: t(
        "To find the equation of a translated V of the same shape as $y = |x|$, read off the vertex $(h, k)$ and write $y = |x - h| + k$. Check with another point: one unit right of the vertex, the graph is one unit higher.",
        "要写出与 $y = |x|$ 形状相同、经过平移的 V 形图象的解析式，读出顶点 $(h, k)$，写成 $y = |x - h| + k$。再用另一个点检验：在顶点右边一个单位处，图象高一个单位。",
      ),
      generate(rng) {
        const h = rng.int(-4, 4);
        const k = rng.int(-4, 3);
        const answer = absFn(1, h, k);
        return {
          ...expressionProblem({
            prompt: graphPrompt,
            answer,
            prefix: "y =",
            wrong: [absFn(1, -h, k), absFn(1, k, h), absFn(1, h, -k), absFn(1, -h, -k)],
            solution: t(
              `The vertex is $${pt(h, k)}$, so the equation is $y = ${answer}$.`,
              `顶点是 $${pt(h, k)}$，所以解析式是 $y = ${answer}$。`,
            ),
          }),
          figure: vFigure(Q.one, h, Q.of(k), [[h, k]]),
        };
      },
    },
    {
      id: "translating-the-graph",
      title: t("Translating the graph", "平移图象"),
      explanation: t(
        "Moving the graph of $y = |x|$ right by $h$ units replaces $x$ with $x - h$; moving it up by $k$ units adds $k$. So moving it $3$ units **left** and $2$ units **down** gives\n\n$$y = |x - (-3)| - 2 = |x + 3| - 2.$$",
        "把 $y = |x|$ 的图象向右平移 $h$ 个单位，就是把 $x$ 换成 $x - h$；向上平移 $k$ 个单位，就是加上 $k$。所以向**左**平移 $3$ 个单位、向**下**平移 $2$ 个单位得到\n\n$$y = |x - (-3)| - 2 = |x + 3| - 2.$$",
      ),
      generate(rng) {
        const h = rng.nonZero(-8, 8);
        const k = rng.nonZero(-8, 8);
        const answer = absFn(1, h, k);
        const hx = Math.abs(h);
        const kx = Math.abs(k);
        const en = `${hx} unit${hx === 1 ? "" : "s"} ${h > 0 ? "right" : "left"} and ${kx} unit${kx === 1 ? "" : "s"} ${k > 0 ? "up" : "down"}`;
        const zh = `向${h > 0 ? "右" : "左"}平移 ${hx} 个单位，再向${k > 0 ? "上" : "下"}平移 ${kx} 个单位`;
        return expressionProblem({
          prompt: t(
            `The graph of $y = |x|$ is moved ${en}. Write the equation of the new graph.`,
            `把 $y = |x|$ 的图象${zh}。写出所得图象的解析式。`,
          ),
          answer,
          prefix: "y =",
          wrong: [absFn(1, -h, k), absFn(1, k, h), absFn(1, h, -k), absFn(1, -h, -k)],
          solution: t(
            `The vertex moves to $${pt(h, k)}$, so $h = ${h}$, $k = ${k}$ and the new graph is $y = ${answer}$.`,
            `顶点移到 $${pt(h, k)}$，所以 $h = ${h}$，$k = ${k}$，新图象是 $y = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** verticalReflectionsOfAbsoluteValueGraphs reflects absolute value graphs in the x-axis. */
export const verticalReflectionsOfAbsoluteValueGraphs: TopicDef = {
  id: "vertical-reflections-of-absolute-value-graphs",
  title: t("Vertical Reflections of Absolute Value Graphs", "绝对值函数图象的上下翻折"),
  summary: t(
    "Recognize y = −|x − h| + k as a V that opens downward and reflect absolute value graphs in the x-axis.",
    "认识 y = −|x − h| + k 是开口向下的 V 形图象，并把绝对值函数的图象关于 x 轴翻折。",
  ),
  prerequisites: ["absolute-value-graphs"],
  encompasses: [{ topic: "absolute-value-graphs", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "opening-upward-or-downward",
      title: t("Opening upward or downward", "开口向上或向下"),
      explanation: t(
        "A minus sign in front of the absolute value turns every $y$-value into its opposite, so the graph of $y = -|x|$ is the graph of $y = |x|$ reflected in the $x$-axis: a V that opens **downward**.\n\nThe graph of $y = -|x - h| + k$ opens downward with its vertex at $(h, k)$, which is now the **highest** point.",
        "绝对值前面的负号把每个 $y$ 值变成它的相反数，所以 $y = -|x|$ 的图象是 $y = |x|$ 的图象关于 $x$ 轴翻折得到的：一个开口**向下**的 V 形。\n\n$y = -|x - h| + k$ 的图象开口向下，顶点在 $(h, k)$，它现在是图象的**最高**点。",
      ),
      generate(rng) {
        const a = rng.bool(0.6) ? -1 : 1;
        const h = rng.nonZero(-8, 8);
        const k = rng.int(-8, 8);
        const opt = (down: boolean, x: number) =>
          t(`It opens ${down ? "downward" : "upward"}, with vertex $${pt(x, k)}$.`, `开口向${down ? "下" : "上"}，顶点为 $${pt(x, k)}$。`);
        const options = [opt(a < 0, h), opt(a > 0, h), opt(a < 0, -h), opt(a > 0, -h)];
        const order = rng.shuffle([0, 1, 2, 3]);
        return choiceProblem({
          prompt: t(`Which describes the graph of $y = ${absFn(a, h, k)}$?`, `哪一项描述了 $y = ${absFn(a, h, k)}$ 的图象？`),
          options: order.map((i) => options[i]!),
          correct: order.indexOf(0),
          solution: t(
            `${a < 0 ? "The minus sign in front of the bars makes the V open downward" : "There is no minus sign in front of the bars, so the V opens upward"}, and the vertex is $${pt(h, k)}$.`,
            `${a < 0 ? "绝对值前面的负号使 V 形开口向下" : "绝对值前面没有负号，所以 V 形开口向上"}，顶点是 $${pt(h, k)}$。`,
          ),
        });
      },
    },
    {
      id: "equations-of-downward-graphs",
      title: t("Equations from graphs", "由图象写解析式"),
      explanation: t(
        "If a V of the same shape as $y = |x|$ opens downward with vertex $(h, k)$, its equation is $y = -|x - h| + k$. If it opens upward, it is $y = |x - h| + k$.",
        "如果一个与 $y = |x|$ 形状相同的 V 形图象开口向下、顶点为 $(h, k)$，它的解析式是 $y = -|x - h| + k$；如果开口向上，则是 $y = |x - h| + k$。",
      ),
      generate(rng) {
        const a = rng.bool(0.8) ? -1 : 1;
        const h = rng.int(-4, 4);
        const k = a < 0 ? rng.int(-3, 4) : rng.int(-4, 3);
        const answer = absFn(a, h, k);
        return {
          ...expressionProblem({
            prompt: graphPrompt,
            answer,
            prefix: "y =",
            wrong: [absFn(-a, h, k), absFn(a, -h, k), absFn(a, h, -k)],
            solution: t(
              `The graph opens ${a < 0 ? "downward" : "upward"} and its vertex is $${pt(h, k)}$, so $y = ${answer}$.`,
              `图象开口向${a < 0 ? "下" : "上"}，顶点是 $${pt(h, k)}$，所以 $y = ${answer}$。`,
            ),
          }),
          figure: vFigure(Q.of(a), h, Q.of(k), [[h, k]]),
        };
      },
    },
    {
      id: "reflecting-in-the-x-axis",
      title: t("Reflecting in the x-axis", "关于 x 轴翻折"),
      explanation: t(
        "Reflecting the graph of $y = f(x)$ in the $x$-axis gives $y = -f(x)$: **every** term changes sign, including the constant. The reflection of $y = |x - 1| + 3$ is\n\n$$y = -(|x - 1| + 3) = -|x - 1| - 3,$$\n\nwhose vertex is $(1, -3)$: the vertex is reflected too.",
        "把 $y = f(x)$ 的图象关于 $x$ 轴翻折，得到 $y = -f(x)$：**每一项**都变号，包括常数项。$y = |x - 1| + 3$ 翻折后是\n\n$$y = -(|x - 1| + 3) = -|x - 1| - 3,$$\n\n它的顶点是 $(1, -3)$：顶点也被翻折了。",
      ),
      generate(rng) {
        const a = rng.bool(0.7) ? 1 : -1;
        const h = rng.nonZero(-8, 8);
        const k = rng.nonZero(-8, 8);
        const answer = absFn(-a, h, -k);
        return expressionProblem({
          prompt: t(
            `The graph of $y = ${absFn(a, h, k)}$ is reflected in the $x$-axis. Write the equation of the new graph.`,
            `把 $y = ${absFn(a, h, k)}$ 的图象关于 $x$ 轴翻折。写出所得图象的解析式。`,
          ),
          answer,
          prefix: "y =",
          wrong: [absFn(-a, h, k), absFn(a, -h, k), absFn(-a, -h, -k)],
          solution: t(
            `Change the sign of every term: $y = -(${absFn(a, h, k)}) = ${answer}$.`,
            `每一项都变号：$y = -(${absFn(a, h, k)}) = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** stretchesOfAbsoluteValueGraphs stretches and compresses absolute value graphs vertically. */
export const stretchesOfAbsoluteValueGraphs: TopicDef = {
  id: "stretches-of-absolute-value-graphs",
  title: t("Stretches of Absolute Value Graphs", "绝对值函数图象的伸缩"),
  summary: t(
    "Relate the factor a in y = a|x| + k to the slopes of the arms and to how narrow or wide the V is.",
    "理解 y = a|x| + k 中系数 a 与两支斜率以及 V 形宽窄的关系。",
  ),
  prerequisites: ["absolute-value-graphs", "slope-of-a-line"],
  encompasses: [
    { topic: "absolute-value-graphs", weight: 0.6 },
    { topic: "slope-of-a-line", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "slopes-of-the-arms",
      title: t("Slopes of the arms", "两支的斜率"),
      explanation: t(
        "For $a > 0$, the graph of $y = a|x|$ multiplies every $y$-value of $y = |x|$ by $a$. Its right arm is the line $y = ax$, with slope $a$, and its left arm is $y = -ax$, with slope $-a$.\n\nAdding $k$ moves the graph up without changing the slopes: the arms of $y = 3|x| - 2$ have slopes $3$ and $-3$.",
        "当 $a > 0$ 时，$y = a|x|$ 的图象把 $y = |x|$ 的每个 $y$ 值都乘以 $a$。它的右支是直线 $y = ax$，斜率为 $a$；左支是 $y = -ax$，斜率为 $-a$。\n\n加上 $k$ 只是把图象上移，不改变斜率：$y = 3|x| - 2$ 两支的斜率是 $3$ 和 $-3$。",
      ),
      keyPrerequisites: ["slope-of-a-line"],
      generate(rng) {
        const a = rng.pick(factors);
        const k = rng.int(-9, 9);
        const right = rng.bool();
        const answer = right ? a : a.neg();
        return numberProblem({
          prompt: t(
            `What is the slope of the ${right ? "right" : "left"} arm of the graph of $y = ${absFn(a, 0, k)}$, where $x ${right ? ">" : "<"} 0$?`,
            `$y = ${absFn(a, 0, k)}$ 的图象在 $x ${right ? ">" : "<"} 0$ 的那一支（${right ? "右" : "左"}支）的斜率是多少？`,
          ),
          answer,
          wrong: [answer.neg(), Q.one.div(answer), Q.of(k), Q.one],
          solution: t(
            `For $x ${right ? ">" : "<"} 0$, $|x| = ${right ? "x" : "-x"}$, so the arm is $y = ${linear(answer, k)}$, with slope $${answer.toLatex()}$.`,
            `当 $x ${right ? ">" : "<"} 0$ 时 $|x| = ${right ? "x" : "-x"}$，所以这一支是 $y = ${linear(answer, k)}$，斜率为 $${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "narrower-and-wider-graphs",
      title: t("Narrower and wider", "变窄与变宽"),
      explanation: t(
        "In $y = a|x|$ with $a > 0$, a larger $a$ makes the arms steeper, so the V is **narrower**. For $a > 1$ the graph is a vertical stretch of $y = |x|$ (narrower); for $0 < a < 1$ it is a vertical compression (wider). For example, $y = 4|x|$ is narrower than $y = \\frac{1}{2}|x|$.",
        "在 $y = a|x|$（$a > 0$）中，$a$ 越大两支越陡，V 形就越**窄**。$a > 1$ 时图象是 $y = |x|$ 竖直方向的伸长（变窄）；$0 < a < 1$ 时是竖直方向的压缩（变宽）。例如，$y = 4|x|$ 比 $y = \\frac{1}{2}|x|$ 窄。",
      ),
      generate(rng) {
        const as = rng.sample([Q.one, ...factors], 4);
        const narrowest = rng.bool();
        const pick = as.reduce((best, a, i) => ((narrowest ? a.cmp(as[best]!) > 0 : a.cmp(as[best]!) < 0) ? i : best), 0);
        return choiceProblem({
          prompt: t(
            `Which of these graphs is the ${narrowest ? "narrowest" : "widest"}: ${as.map((a) => `$y = ${absFn(a, 0, 0)}$`).join(", ")}?`,
            `下列图象中哪个最${narrowest ? "窄" : "宽"}：${as.map((a) => `$y = ${absFn(a, 0, 0)}$`).join("、")}？`,
          ),
          options: as.map((a) => same(`$y = ${absFn(a, 0, 0)}$`)),
          correct: pick,
          solution: t(
            `The ${narrowest ? "largest" : "smallest"} factor gives the ${narrowest ? "steepest" : "flattest"} arms: $y = ${absFn(as[pick]!, 0, 0)}$.`,
            `系数最${narrowest ? "大" : "小"}的两支最${narrowest ? "陡" : "平缓"}：$y = ${absFn(as[pick]!, 0, 0)}$。`,
          ),
        });
      },
    },
    {
      id: "stretched-graphs-from-graphs",
      title: t("Equations from graphs", "由图象写解析式"),
      explanation: t(
        "To find $a$ and $k$ in $y = a|x| + k$ from a graph, read the vertex $(0, k)$, then move right from the vertex to a point on the graph: $a$ is the rise divided by the run. If the graph passes through $(0, -1)$ and $(2, 0)$, then $a = \\frac{1}{2}$ and $y = \\frac{1}{2}|x| - 1$.",
        "要从图象求 $y = a|x| + k$ 中的 $a$ 和 $k$：读出顶点 $(0, k)$，再从顶点向右找图象上的一个点，$a$ 等于竖直变化量除以水平变化量。如果图象经过 $(0, -1)$ 和 $(2, 0)$，则 $a = \\frac{1}{2}$，$y = \\frac{1}{2}|x| - 1$。",
      ),
      generate(rng) {
        const a = rng.pick(factors);
        const run = Number(a.d);
        const rise = Number(a.n);
        const k = rng.int(-5, Math.min(5, 6 - rise));
        const answer = absFn(a, 0, k);
        return {
          ...expressionProblem({
            prompt: graphPrompt,
            answer,
            prefix: "y =",
            wrong: [absFn(Q.one.div(a), 0, k), absFn(1, 0, k), absFn(a, 0, -k), absFn(a, k, 0)],
            solution: t(
              `The vertex is $${pt(0, k)}$. From there, the graph rises $${rise}$ over a run of $${run}$ to $${pt(run, k + rise)}$, so $a = ${a.toLatex()}$ and $y = ${answer}$.`,
              `顶点是 $${pt(0, k)}$。从顶点出发，水平向右 $${run}$ 个单位时图象上升 $${rise}$ 个单位到 $${pt(run, k + rise)}$，所以 $a = ${a.toLatex()}$，$y = ${answer}$。`,
            ),
          }),
          figure: vFigure(a, 0, Q.of(k), [
            [0, k],
            [run, k + rise],
          ]),
        };
      },
    },
  ],
};

/** transformText describes how y = a|x - h| + k is obtained from y = |x|. */
function transformText(a: Q, h: number, k: number): Text {
  const A = a.abs();
  const en: string[] = [];
  const zh: string[] = [];
  if (a.sign() < 0) {
    en.push("reflect in the $x$-axis");
    zh.push("关于 $x$ 轴翻折");
  }
  if (!A.eq(Q.one)) {
    const stretch = A.cmp(Q.one) > 0;
    en.push(`${stretch ? "stretch" : "compress"} vertically by a factor of $${A.toLatex()}$`);
    zh.push(`竖直方向${stretch ? "伸长" : "压缩"}为原来的 $${A.toLatex()}$ 倍`);
  }
  const hx = Math.abs(h);
  const kx = Math.abs(k);
  en.push(
    `shift ${hx} unit${hx === 1 ? "" : "s"} ${h > 0 ? "right" : "left"} and ${kx} unit${kx === 1 ? "" : "s"} ${k > 0 ? "up" : "down"}`,
  );
  zh.push(`向${h > 0 ? "右" : "左"}平移 ${hx} 个单位，再向${k > 0 ? "上" : "下"}平移 ${kx} 个单位`);
  const first = en.join(", then ");
  return t(`${first.charAt(0).toUpperCase()}${first.slice(1)}.`, `${zh.join("，然后")}。`);
}

const combinedFactors: readonly Q[] = [Q.of(2), Q.of(3), Q.of(1, 2), Q.of(1, 3), Q.of(-1), Q.of(-2), Q.of(-3), Q.of(-1, 2)];

/** combiningTransformationsOfAbsoluteValueGraphs combines reflections, stretches and translations of y = |x|. */
export const combiningTransformationsOfAbsoluteValueGraphs: TopicDef = {
  id: "combining-transformations-of-absolute-value-graphs",
  title: t("Combining Transformations of Absolute Value Graphs", "绝对值函数图象的组合变换"),
  summary: t(
    "Read the reflection, stretch and translation in y = a|x − h| + k, and write such equations from graphs.",
    "从 y = a|x − h| + k 读出翻折、伸缩与平移，并由图象写出这样的解析式。",
  ),
  prerequisites: ["vertical-reflections-of-absolute-value-graphs", "stretches-of-absolute-value-graphs"],
  encompasses: [
    { topic: "vertical-reflections-of-absolute-value-graphs", weight: 0.6 },
    { topic: "stretches-of-absolute-value-graphs", weight: 0.6 },
    { topic: "absolute-value-graphs", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7.B"],
  knowledgePoints: [
    {
      id: "describing-transformations",
      title: t("Describing the transformations", "描述变换"),
      explanation: t(
        "The graph of $y = a|x - h| + k$ comes from $y = |x|$ in steps:\n\n1. if $a < 0$, reflect in the $x$-axis;\n2. stretch vertically by the factor $|a|$ (a compression if $|a| < 1$);\n3. shift so that the vertex moves to $(h, k)$.\n\nFor $y = -2|x + 3| - 1$: reflect, stretch by $2$, then shift $3$ units left and $1$ unit down.",
        "$y = a|x - h| + k$ 的图象可由 $y = |x|$ 分步得到：\n\n1. 若 $a < 0$，关于 $x$ 轴翻折；\n2. 竖直方向伸缩为原来的 $|a|$ 倍（$|a| < 1$ 时是压缩）；\n3. 平移使顶点移到 $(h, k)$。\n\n对于 $y = -2|x + 3| - 1$：翻折，伸长为原来的 $2$ 倍，再向左平移 $3$ 个单位、向下平移 $1$ 个单位。",
      ),
      generate(rng) {
        const a = rng.pick(combinedFactors);
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const options = [transformText(a, h, k), transformText(a.neg(), h, k), transformText(a, -h, k), transformText(a, h, -k)];
        const order = rng.shuffle([0, 1, 2, 3]);
        return choiceProblem({
          prompt: t(
            `Which sequence of transformations takes the graph of $y = |x|$ to the graph of $y = ${absFn(a, h, k)}$?`,
            `哪一组变换把 $y = |x|$ 的图象变成 $y = ${absFn(a, h, k)}$ 的图象？`,
          ),
          options: order.map((i) => options[i]!),
          correct: order.indexOf(0),
          solution: t(
            `Here $a = ${a.toLatex()}$, $h = ${h}$ and $k = ${k}$. ${options[0]!.en}`,
            `这里 $a = ${a.toLatex()}$，$h = ${h}$，$k = ${k}$。${options[0]!["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "combined-equations-from-graphs",
      title: t("Equations from graphs", "由图象写解析式"),
      explanation: t(
        "To write $y = a|x - h| + k$ from a graph: read the vertex $(h, k)$; then go one or more units right of the vertex to a point on the graph and divide the change in $y$ by the change in $x$ to get $a$. The sign of $a$ is negative when the graph opens downward.\n\nIf the vertex is $(1, 2)$ and the graph passes through $(3, -2)$, then $a = \\frac{-2 - 2}{3 - 1} = -2$ and $y = -2|x - 1| + 2$.",
        "由图象写 $y = a|x - h| + k$：读出顶点 $(h, k)$；再在顶点右边找图象上的一个点，用 $y$ 的变化量除以 $x$ 的变化量得到 $a$。图象开口向下时 $a$ 为负。\n\n若顶点是 $(1, 2)$，图象经过 $(3, -2)$，则 $a = \\frac{-2 - 2}{3 - 1} = -2$，$y = -2|x - 1| + 2$。",
      ),
      generate(rng) {
        const a = rng.pick([Q.of(2), Q.of(3), Q.of(1, 2), Q.of(-1), Q.of(-2), Q.of(-3), Q.of(-1, 2), Q.of(1, 3)]);
        const run = Number(a.d);
        const rise = Number(a.n);
        const h = rng.int(-3, 6 - run);
        const k = rise > 0 ? rng.int(-5, 5 - rise) : rng.int(-5 - rise, 5);
        const answer = absFn(a, h, k);
        const wrong = [absFn(a.neg(), h, k), absFn(a, -h, k), absFn(a, h, -k)];
        if (!a.abs().eq(Q.one)) wrong.push(absFn(Q.one.div(a), h, k));
        return {
          ...expressionProblem({
            prompt: graphPrompt,
            answer,
            prefix: "y =",
            wrong,
            solution: t(
              `The vertex is $${pt(h, k)}$ and the graph passes through $${pt(h + run, k + rise)}$, so $a = \\frac{${rise}}{${run}} = ${a.toLatex()}$ and $y = ${answer}$.`,
              `顶点是 $${pt(h, k)}$，图象经过 $${pt(h + run, k + rise)}$，所以 $a = \\frac{${rise}}{${run}} = ${a.toLatex()}$，$y = ${answer}$。`,
            ),
          }),
          figure: vFigure(a, h, Q.of(k), [
            [h, k],
            [h + run, k + rise],
          ]),
        };
      },
    },
    {
      id: "values-and-intercepts",
      title: t("Values and the y-intercept", "函数值与 y 轴截距"),
      explanation: t(
        "To find a value of $f(x) = a|x - h| + k$, substitute and take the absolute value before multiplying by $a$. The $y$-intercept is $f(0) = a|-h| + k$. For $f(x) = -3|x + 2| + 5$:\n\n$$f(0) = -3|0 + 2| + 5 = -3 \\cdot 2 + 5 = -1$$",
        "求 $f(x) = a|x - h| + k$ 的函数值：代入，先取绝对值，再乘以 $a$。$y$ 轴截距是 $f(0) = a|-h| + k$。对于 $f(x) = -3|x + 2| + 5$：\n\n$$f(0) = -3|0 + 2| + 5 = -3 \\cdot 2 + 5 = -1$$",
      ),
      generate(rng) {
        const a = rng.pick([Q.of(2), Q.of(3), Q.of(-1), Q.of(-2), Q.of(-3), Q.of(4), Q.of(1, 2), Q.of(-1, 2)]);
        const h = rng.nonZero(-8, 8);
        const k = rng.int(-9, 9);
        let x = rng.bool(0.6) ? 0 : rng.int(-6, 6);
        if (x === h) x = 0;
        const answer = absAt(a, h, Q.of(k), Q.of(x));
        const inner = x - h;
        const question =
          x === 0
            ? t(`Find the $y$-intercept of the graph of $f(x) = ${absFn(a, h, k)}$.`, `求 $f(x) = ${absFn(a, h, k)}$ 的图象的 $y$ 轴截距。`)
            : t(`Find $f(${x})$ for $f(x) = ${absFn(a, h, k)}$.`, `已知 $f(x) = ${absFn(a, h, k)}$，求 $f(${x})$。`);
        const s = steps(
          `f(${x}) = ${poly([a, bars(String(inner))], [k, ""])} = ${a.toLatex()} \\cdot ${Math.abs(inner)}${plusNum(k)} = ${answer.toLatex()}`,
        );
        return numberProblem({
          prompt: question,
          answer,
          wrong: [
            a.mul(Q.of(inner)).add(Q.of(k)),
            a
              .abs()
              .mul(Q.of(Math.abs(inner)))
              .add(Q.of(k)),
            Q.of(k),
            a.mul(Q.of(Math.abs(inner) + k)),
          ],
          solution: t(`Substitute $x = ${x}$:${s}`, `代入 $x = ${x}$：${s}`),
        });
      },
    },
  ],
};

/** restricted draws f(x) = a|x - h| + k on [p, q] with integer values at p, q and h inside the view. */
function restricted(rng: Rng): { a: Q; h: number; k: number; p: number; q: number } {
  for (;;) {
    const a = rng.pick([Q.of(1), Q.of(2), Q.of(-1), Q.of(-2), Q.of(1, 2), Q.of(-1, 2)]);
    const h = rng.int(-3, 3);
    const k = a.sign() > 0 ? rng.int(-5, 1) : rng.int(-1, 5);
    const inside = rng.bool(0.75);
    let p: number;
    let q: number;
    if (inside) {
      p = h - rng.int(1, 5);
      q = h + rng.int(1, 5);
    } else if (rng.bool()) {
      p = h + rng.int(0, 2);
      q = p + rng.int(2, 5);
    } else {
      q = h - rng.int(0, 2);
      p = q - rng.int(2, 5);
    }
    const fits = (x: number) => {
      if (x < -6 || x > 6) return false;
      const y = absAt(a, h, Q.of(k), Q.of(x));
      return y.isInteger() && y.toNumber() >= -6 && y.toNumber() <= 6;
    };
    if (fits(p) && fits(q)) return { a, h, k, p, q };
  }
}

/** rangeOn is the range of a|x - h| + k on [p, q]. */
function rangeOn(a: Q, h: number, k: number, p: number, q: number): RealSet {
  const ys = [p, q, ...(p < h && h < q ? [h] : [])].map((x) => absAt(a, h, Q.of(k), Q.of(x)));
  const [lo, hi] = [sortQ(ys)[0]!, sortQ(ys)[ys.length - 1]!];
  return union(span(lo, true, hi, true));
}

/** domainAndRangeOfAbsoluteValueFunctions finds the domain and range of absolute value functions. */
export const domainAndRangeOfAbsoluteValueFunctions: TopicDef = {
  id: "domain-and-range-of-absolute-value-functions",
  title: t("Domain and Range of Absolute Value Functions", "绝对值函数的定义域与值域"),
  summary: t(
    "Find the domain and range of f(x) = a|x − h| + k, on all real numbers and on a closed interval.",
    "求 f(x) = a|x − h| + k 在全体实数上和在闭区间上的定义域与值域。",
  ),
  prerequisites: ["combining-transformations-of-absolute-value-graphs", "range-of-a-function"],
  encompasses: [
    { topic: "range-of-a-function", weight: 0.4 },
    { topic: "domain-of-a-function", weight: 0.2 },
    { topic: "combining-transformations-of-absolute-value-graphs", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.5"],
  knowledgePoints: [
    {
      id: "domain-and-range-from-an-equation",
      title: t("From an equation", "由解析式求"),
      explanation: t(
        "Every real number can be put into $f(x) = a|x - h| + k$, so the **domain** is $(-\\infty, \\infty)$.\n\nThe **range** is decided by the vertex: if $a > 0$ the V opens upward and its lowest value is $k$, so the range is $[k, \\infty)$; if $a < 0$ it opens downward and the range is $(-\\infty, k]$. For $f(x) = -2|x - 5| + 3$ the range is $(-\\infty, 3]$.",
        "任何实数都可以代入 $f(x) = a|x - h| + k$，所以**定义域**是 $(-\\infty, \\infty)$。\n\n**值域**由顶点决定：$a > 0$ 时 V 形开口向上，最小值是 $k$，值域为 $[k, \\infty)$；$a < 0$ 时开口向下，值域为 $(-\\infty, k]$。$f(x) = -2|x - 5| + 3$ 的值域是 $(-\\infty, 3]$。",
      ),
      generate(rng) {
        const a = rng.pick([...combinedFactors, Q.one]);
        const h = rng.nonZero(-9, 9);
        const k = rng.int(-9, 9);
        const up = a.sign() > 0;
        const rangeSet = union(up ? ray(">=", k) : ray("<=", k));
        const domain = rng.bool(0.25);
        const f = absFn(a, h, k);
        if (domain) {
          return intervalProblem({
            prompt: ask(`Find the domain of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的定义域。`, asInterval),
            set: realLine,
            form: "interval",
            wrong: [rangeSet, union(ray(">=", h))],
            solution: t(
              "Any real number can be substituted for $x$, so the domain is $(-\\infty, \\infty)$.",
              "任何实数都可以代入 $x$，所以定义域是 $(-\\infty, \\infty)$。",
            ),
          });
        }
        return intervalProblem({
          prompt: ask(`Find the range of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的值域。`, asInterval),
          set: rangeSet,
          form: "interval",
          wrong: [union(up ? ray("<=", k) : ray(">=", k)), union(up ? ray(">=", h) : ray("<=", h)), toggleEnds(rangeSet), realLine],
          solution: t(
            `Since $a = ${a.toLatex()}$ is ${up ? "positive" : "negative"}, the graph opens ${up ? "upward" : "downward"} from its vertex $${pt(h, k)}$, so the ${up ? "least" : "greatest"} value is $${k}$. The range is $${intervalLatex(rangeSet)}$.`,
            `因为 $a = ${a.toLatex()}$ 是${up ? "正" : "负"}数，图象从顶点 $${pt(h, k)}$ 开口向${up ? "上" : "下"}，最${up ? "小" : "大"}值是 $${k}$。值域是 $${intervalLatex(rangeSet)}$。`,
          ),
        });
      },
    },
    {
      id: "domain-and-range-from-a-graph",
      title: t("From a graph on an interval", "由区间上的图象求"),
      explanation: t(
        "When the graph is drawn only between two endpoints, the domain is the interval between their $x$-coordinates. For the range, find the lowest and highest $y$-values on the graph: they occur at the endpoints or at the vertex, if the vertex is between them.\n\nThe graph of $y = |x - 1|$ from $(-2, 3)$ to $(2, 1)$ has domain $[-2, 2]$ and range $[0, 3]$, because the vertex $(1, 0)$ is on it.",
        "当图象只画在两个端点之间时，定义域是端点 $x$ 坐标之间的区间。求值域时，找出图象上最低和最高的 $y$ 值：它们出现在端点处，或者（如果顶点在两端点之间）在顶点处。\n\n$y = |x - 1|$ 从 $(-2, 3)$ 到 $(2, 1)$ 的图象，定义域是 $[-2, 2]$，值域是 $[0, 3]$，因为顶点 $(1, 0)$ 在图象上。",
      ),
      generate(rng) {
        const { a, h, k, p, q } = restricted(rng);
        const kq = Q.of(k);
        const fp = absAt(a, h, kq, Q.of(p)).toNumber();
        const fq = absAt(a, h, kq, Q.of(q)).toNumber();
        const marks: PlaneMark[] = [
          ...vMarks(a, h, kq, p, q),
          { kind: "point", at: [p, fp], accent: true },
          { kind: "point", at: [q, fq], accent: true },
        ];
        const vertexOn = p < h && h < q;
        const figure: Figure = {
          svg: plane(view, marks),
          alt: t(
            `A graph made of line segments from ${pt(p, fp)}${vertexOn ? ` to the corner ${pt(h, k)}` : ""} to ${pt(q, fq)}, with filled dots at both ends.`,
            `由线段组成的图象，从 ${pt(p, fp)}${vertexOn ? ` 到拐点 ${pt(h, k)}` : ""} 到 ${pt(q, fq)}，两端都是实心点。`,
          ),
        };
        const domainSet = union(span(p, true, q, true));
        const rangeSet = rangeOn(a, h, k, p, q);
        const ends = union(span(Math.min(fp, fq), true, Math.max(fp, fq), true));
        if (rng.bool(0.3)) {
          return {
            ...intervalProblem({
              prompt: ask("The graph of $f$ is shown. Find the domain of $f$.", "如图是 $f$ 的图象。求 $f$ 的定义域。", asInterval),
              set: domainSet,
              form: "interval",
              wrong: [rangeSet, realLine, toggleEnds(domainSet)],
              solution: t(
                `The graph runs from $x = ${p}$ to $x = ${q}$, including both ends, so the domain is $${intervalLatex(domainSet)}$.`,
                `图象从 $x = ${p}$ 到 $x = ${q}$，包括两个端点，所以定义域是 $${intervalLatex(domainSet)}$。`,
              ),
            }),
            figure,
          };
        }
        return {
          ...intervalProblem({
            prompt: ask("The graph of $f$ is shown. Find the range of $f$.", "如图是 $f$ 的图象。求 $f$ 的值域。", asInterval),
            set: rangeSet,
            form: "interval",
            wrong: [ends, domainSet, union(a.sign() > 0 ? ray(">=", k) : ray("<=", k))],
            solution: t(
              `The lowest and highest points of the graph are at $y = ${num(rangeSet[0]!.lo!)}$ and $y = ${num(rangeSet[0]!.hi!)}$, so the range is $${intervalLatex(rangeSet)}$.`,
              `图象最低点和最高点分别在 $y = ${num(rangeSet[0]!.lo!)}$ 和 $y = ${num(rangeSet[0]!.hi!)}$，所以值域是 $${intervalLatex(rangeSet)}$。`,
            ),
          }),
          figure,
        };
      },
    },
    {
      id: "range-on-a-closed-interval",
      title: t("Range on a closed interval", "闭区间上的值域"),
      explanation: t(
        "To find the range of $f(x) = a|x - h| + k$ for $p \\le x \\le q$, evaluate $f$ at both ends, and also at the vertex $x = h$ if $p < h < q$. The range runs from the least of these values to the greatest.\n\nFor $f(x) = 2|x + 1| - 3$ on $-3 \\le x \\le 2$: $f(-3) = 1$, $f(2) = 3$ and $f(-1) = -3$, so the range is $[-3, 3]$, not $[1, 3]$.",
        "求 $f(x) = a|x - h| + k$ 在 $p \\le x \\le q$ 上的值域：计算两个端点处的函数值；若 $p < h < q$，还要计算顶点 $x = h$ 处的值。值域从这些值中最小的到最大的。\n\n$f(x) = 2|x + 1| - 3$ 在 $-3 \\le x \\le 2$ 上：$f(-3) = 1$，$f(2) = 3$，$f(-1) = -3$，所以值域是 $[-3, 3]$，而不是 $[1, 3]$。",
      ),
      generate(rng) {
        const a = rng.pick([Q.of(1), Q.of(2), Q.of(3), Q.of(-1), Q.of(-2), Q.of(-3)]);
        const h = rng.int(-6, 6);
        const k = rng.int(-9, 9);
        const inside = rng.bool(0.75);
        const right = rng.bool();
        const p = inside ? h - rng.int(1, 6) : right ? h + rng.int(0, 2) : h - rng.int(0, 2) - rng.int(1, 5);
        const q = inside ? h + rng.int(1, 6) : right ? p + rng.int(1, 5) : p + rng.int(1, 5);
        const kq = Q.of(k);
        const f = absFn(a, h, k);
        const set = rangeOn(a, h, k, p, q);
        const fp = absAt(a, h, kq, Q.of(p));
        const fq = absAt(a, h, kq, Q.of(q));
        const ends = union(span(sortQ([fp, fq])[0]!, true, sortQ([fp, fq])[1]!, true));
        const vertexIn = p < h && h < q;
        const s = steps(`f(${p}) = ${fp.toLatex()}`, `f(${q}) = ${fq.toLatex()}`, ...(vertexIn ? [`f(${h}) = ${k}`] : []));
        return intervalProblem({
          prompt: ask(
            `Find the range of $f(x) = ${f}$ for $${p} \\le x \\le ${q}$.`,
            `求 $f(x) = ${f}$ 在 $${p} \\le x \\le ${q}$ 上的值域。`,
            asInterval,
          ),
          set,
          form: "interval",
          wrong: [ends, union(span(p, true, q, true)), union(a.sign() > 0 ? ray(">=", k) : ray("<=", k))],
          solution: t(
            `Evaluate $f$ at the ends${vertexIn ? " and at the vertex, which lies between them" : `; the vertex $x = ${h}$ is not between them`}:${s}The range is $${intervalLatex(set)}$.`,
            `计算端点处${vertexIn ? "以及位于两端点之间的顶点处" : `（顶点 $x = ${h}$ 不在两端点之间）`}的函数值：${s}值域是 $${intervalLatex(set)}$。`,
          ),
        });
      },
    },
  ],
};

/** rootsOfAbsoluteValueFunctions finds the roots of absolute value functions. */
export const rootsOfAbsoluteValueFunctions: TopicDef = {
  id: "roots-of-absolute-value-functions",
  title: t("Roots of Absolute Value Functions", "绝对值函数的零点"),
  summary: t(
    "Decide how many roots f(x) = a|x − h| + k has and find them from the formula or the graph.",
    "判断 f(x) = a|x − h| + k 有几个零点，并由解析式或图象求出零点。",
  ),
  prerequisites: ["combining-transformations-of-absolute-value-graphs", "roots-of-a-function", "further-absolute-value-equations"],
  encompasses: [
    { topic: "further-absolute-value-equations", weight: 0.4 },
    { topic: "roots-of-a-function", weight: 0.4 },
    { topic: "combining-transformations-of-absolute-value-graphs", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7.B", "CCSS.HSA.REI.D.11"],
  knowledgePoints: [
    {
      id: "how-many-roots",
      title: t("How many roots", "零点的个数"),
      explanation: t(
        "The graph of $f(x) = a|x - h| + k$ is a V with vertex $(h, k)$, so its number of roots depends on where the vertex is and which way the V opens:\n\n- vertex below the $x$-axis and opening upward, or above and opening downward: **two** roots;\n- vertex on the $x$-axis ($k = 0$): **one** root, $x = h$;\n- vertex above and opening upward, or below and opening downward: **no** roots.\n\nIn short: two roots when $a$ and $k$ have opposite signs, none when they have the same sign.",
        "$f(x) = a|x - h| + k$ 的图象是顶点为 $(h, k)$ 的 V 形，零点个数取决于顶点的位置和开口方向：\n\n- 顶点在 $x$ 轴下方且开口向上，或在上方且开口向下：**两个**零点；\n- 顶点在 $x$ 轴上（$k = 0$）：**一个**零点 $x = h$；\n- 顶点在上方且开口向上，或在下方且开口向下：**没有**零点。\n\n简言之：$a$ 与 $k$ 异号时有两个零点，同号时没有零点。",
      ),
      generate(rng) {
        const a = rng.pick([...combinedFactors, Q.one]);
        const h = rng.int(-9, 9);
        const k = rng.bool(0.2) ? 0 : rng.nonZero(-9, 9);
        const count = k === 0 ? 1 : a.sign() * Math.sign(k) < 0 ? 2 : 0;
        const where = k === 0 ? t("on", "上") : k > 0 ? t("above", "上方") : t("below", "下方");
        return choiceProblem({
          prompt: t(`How many roots does $f(x) = ${absFn(a, h, k)}$ have?`, `$f(x) = ${absFn(a, h, k)}$ 有几个零点？`),
          options: [same("$0$"), same("$1$"), same("$2$")],
          correct: count,
          solution: t(
            `The vertex $${pt(h, k)}$ is ${where.en} the $x$-axis and the graph opens ${a.sign() > 0 ? "upward" : "downward"}, so there ${count === 1 ? "is $1$ root" : `are $${count}$ roots`}.`,
            `顶点 $${pt(h, k)}$ 在 $x$ 轴${where["zh-CN"]}，图象开口向${a.sign() > 0 ? "上" : "下"}，所以有 $${count}$ 个零点。`,
          ),
        });
      },
    },
    {
      id: "roots-from-the-formula",
      title: t("Roots from the formula", "由解析式求零点"),
      explanation: t(
        "To find the roots, set $f(x) = 0$, isolate the absolute value and solve:\n\n$$-2|x - 1| + 6 = 0 \\;\\Rightarrow\\; |x - 1| = 3 \\;\\Rightarrow\\; x = 4 \\text{ or } x = -2$$\n\nIf the isolated value is negative, there are no roots.",
        "求零点时，令 $f(x) = 0$，把绝对值单独放在一边再求解：\n\n$$-2|x - 1| + 6 = 0 \\;\\Rightarrow\\; |x - 1| = 3 \\;\\Rightarrow\\; x = 4 \\text{ 或 } x = -2$$\n\n如果单独放置后右边是负数，就没有零点。",
      ),
      keyPrerequisites: ["further-absolute-value-equations"],
      generate(rng) {
        const a = rng.sign() * rng.int(1, 4);
        const m = rng.pick([1, 1, 2, 3, -2]);
        const n = rng.int(-9, 9);
        const none = rng.bool(0.15);
        const dist = rng.int(1, 9) * (none ? -1 : 1);
        const k = -a * dist;
        const L = linear(m, n);
        const f = poly([a, bars(L)], [k, ""]);
        const x = solveAbs(m, n, dist);
        const s = steps(`${f} = 0`, `${bars(L)} = ${dist}`);
        return solutionsProblem({
          prompt: ask(`Find all roots of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的所有零点。`, listSolutions),
          values: sols(x),
          wrong: [
            sols(solveAbs(m, n, -k)),
            sols(solveAbs(m, -n, Math.abs(dist))),
            sols(solveAbs(m, n, Math.abs(dist))),
            sols(solveAbs(m, n, Math.abs(dist)).slice(0, 1)),
          ],
          solution:
            x.length === 0
              ? t(
                  `Set $f(x) = 0$ and isolate the absolute value:${s}An absolute value is never negative, so $f$ has no roots: $\\varnothing$.`,
                  `令 $f(x) = 0$，把绝对值单独放在一边：${s}绝对值不会是负数，所以 $f$ 没有零点：$\\varnothing$。`,
                )
              : t(
                  `Set $f(x) = 0$ and isolate the absolute value:${s}So $${L} = ${dist}$ or $${L} = ${-dist}$, giving ${solsText(x).en}.`,
                  `令 $f(x) = 0$，把绝对值单独放在一边：${s}所以 $${L} = ${dist}$ 或 $${L} = ${-dist}$，得 ${solsText(x).zh}。`,
                ),
        });
      },
    },
    {
      id: "roots-from-the-graph",
      title: t("Roots from the graph", "由图象求零点"),
      explanation: t(
        "The roots are the $x$-coordinates of the points where the V meets the $x$-axis. Because the V is symmetric about the vertical line through its vertex, two roots are always the same distance from $x = h$ on either side.",
        "零点是 V 形图象与 $x$ 轴交点的 $x$ 坐标。由于 V 形关于经过顶点的竖直线对称，两个零点总是在 $x = h$ 两侧且到它的距离相等。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.pick([Q.of(1), Q.of(2), Q.of(-1), Q.of(-2), Q.of(1, 2), Q.of(-1, 2)]);
          const h = rng.int(-4, 4);
          const kind = rng.pick([2, 2, 2, 2, 1, 0]);
          const dist = rng.int(1, 5);
          const k = kind === 1 ? Q.zero : a.mul(Q.of(kind === 2 ? -dist : dist));
          if (!k.isInteger() || Math.abs(k.toNumber()) > 5 || h - dist < -6 || h + dist > 6) continue;
          const roots = kind === 2 ? [Q.of(h - dist), Q.of(h + dist)] : kind === 1 ? [Q.of(h)] : [];
          const f0 = absAt(a, h, k, Q.zero);
          const dots: Point[] = roots.map((r): Point => [r.toNumber(), 0]);
          return {
            ...solutionsProblem({
              prompt: ask("The graph of $f$ is shown. Find all roots of $f$.", "如图是 $f$ 的图象。求 $f$ 的所有零点。", listSolutions),
              values: sols(roots),
              wrong: [[String(h)], [k.toLatex()], ...(f0.isZero() ? [] : [[f0.toLatex()]]), sols(roots.slice(0, 1))],
              solution:
                roots.length === 0
                  ? t(
                      `The graph never meets the $x$-axis, so $f$ has no roots: $\\varnothing$.`,
                      `图象与 $x$ 轴没有交点，所以 $f$ 没有零点：$\\varnothing$。`,
                    )
                  : t(
                      `The graph meets the $x$-axis at ${roots.map((r) => `$(${r.toLatex()}, 0)$`).join(" and ")}, so ${roots.length === 1 ? "the root is" : "the roots are"} ${solsText(roots).en}.`,
                      `图象与 $x$ 轴交于 ${roots.map((r) => `$(${r.toLatex()}, 0)$`).join("、")}，所以零点是 ${solsText(roots).zh}。`,
                    ),
            }),
            figure: vFigure(a, h, k, [[h, k.toNumber()], ...dots.filter(([x]) => x !== h)]),
          };
        }
      },
    },
  ],
};

/** absoluteValueTopics are the topics of absolute value expressions, equations, inequalities and functions, in teaching order. */
export const absoluteValueTopics: readonly TopicDef[] = [
  absoluteValueExpressions,
  rulesOfAbsoluteValue,
  furtherRulesOfAbsoluteValue,
  absoluteValueEquations,
  furtherAbsoluteValueEquations,
  equationsConnectingAbsoluteValueAndLinearFunctions,
  absoluteValueEquationsWithExtraneousSolutions,
  absoluteValueInequalities,
  absoluteValueGraphs,
  verticalReflectionsOfAbsoluteValueGraphs,
  stretchesOfAbsoluteValueGraphs,
  combiningTransformationsOfAbsoluteValueGraphs,
  domainAndRangeOfAbsoluteValueFunctions,
  rootsOfAbsoluteValueFunctions,
];
