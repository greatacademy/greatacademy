import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import {
  type Coefficient,
  gcd,
  type Interval,
  intervalLatex,
  linear,
  num,
  type PlaneMark,
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
import { algebraDrawings } from "../explanation-drawings-algebra.ts";
import { hop, spot } from "../explanation-drawings-grades-2.ts";
import { realLine as lineMarks } from "../explanation-drawings-grades-3.ts";
import { drawing, note, seg } from "../explanation-drawings-kit.ts";
import { annotate, at, graphFigure, onAxis, plain, riseRun, setText, shift } from "../graph-figures.ts";
import { viewAround } from "../motion-figures.ts";
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
import { chain, flip, range, tail, toggleEnds, toQ, view } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { numberLineFigure } from "./compound-inequalities.ts";

const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b);

/** bars writes an absolute value: "|x - 3|". */
const bars = (inner: string) => `|${inner}|`;

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
  "Enter all solutions separated by commas, or type none if there are none.",
  "请用逗号分隔写出所有解；如果无解，请输入 none。",
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

/** subst writes A·x for a number x put into Ax: "-2", "3(-2)", "-(4)". */
function subst(A: number, x: Q): string {
  if (A === 1) return x.toLatex();
  if (A === -1 && x.sign() >= 0) return `-${x.toLatex()}`;
  const inner = x.isInteger() ? `(${x.toLatex()})` : `\\left(${x.toLatex()}\\right)`;
  return `${A === -1 ? "-" : A}${inner}`;
}

/** absCheck works out |Ax + B| at a number x: the substitution, the inside and the absolute value. */
function absCheck(A: number, B: number, x: Q): string {
  const v = Q.of(A).mul(x).add(Q.of(B));
  const Ax = Q.of(A).mul(x);
  return chain(
    bars(`${subst(A, x)}${tail(B)}`),
    ...(A === 1 || B === 0 ? [] : [bars(`${Ax.toLatex()}${tail(B)}`)]),
    bars(v.toLatex()),
    v.abs().toLatex(),
  );
}

/** lineAt works out cx + d at a number x. */
function lineAt(c: number, d: number, x: Q): string {
  const v = Q.of(c).mul(x).add(Q.of(d));
  return chain(`${subst(c, x)}${tail(d)}`, v.toLatex());
}

/** coef writes a factor in front of an absolute value: "" for 1, "-" for −1. */
const coef = (a: Q) => (a.eq(Q.one) ? "" : a.eq(Q.of(-1)) ? "-" : a.toLatex());

/** absEval works out a|x − h| + k at a number x: the substitution, the inside, the product and the value. */
function absEval(a: Q, h: number, k: Q, x: Q): string {
  const d = x.sub(Q.of(h));
  const D = d.abs().toLatex();
  const product = a.eq(Q.one) ? D : a.eq(Q.of(-1)) ? `-${D}` : `${a.toLatex()} \\cdot ${D}`;
  return chain(
    `${coef(a)}|${x.toLatex()}${tail(-h)}|${tail(k)}`,
    `${coef(a)}|${d.toLatex()}|${tail(k)}`,
    ...(d.isZero() ? [] : [`${product}${tail(k)}`]),
    absAt(a, h, k, x).toLatex(),
  );
}

/** either writes two statements joined by "or" on one line, in each locale. */
const either = (p: string, q: string) => ({ en: steps(`${p}${orEn}${q}`), zh: steps(`${p}${orZh}${q}`) });

/** undoing says how to undo + b and then the factor a on both sides of an equation in x. */
function undoing(a: number, b: number, parts = t("both sides", "两边")): Text {
  const en: string[] = [];
  const zh: string[] = [];
  const [P, Z] = [parts.en, parts["zh-CN"]];
  if (b > 0) {
    en.push(`subtract $${b}$ from ${P}`);
    zh.push(`${Z}同时减去 $${b}$`);
  }
  if (b < 0) {
    en.push(`add $${-b}$ to ${P}`);
    zh.push(`${Z}同时加上 $${-b}$`);
  }
  if (a !== 1) {
    en.push(`divide ${P} by $${a}$`);
    zh.push(`${Z}同时除以 $${a}$`);
  }
  return t(en.join(", then "), zh.join("，然后"));
}

/** caseSolutions solves ax + b = r1 or ax + b = r2 for x, a line for each operation undone; it is empty when there is nothing to undo. */
function caseSolutions(a: number, b: number, r1: Q, r2: Q): { en: string; zh: string } {
  const [m1, m2] = [r1.sub(Q.of(b)), r2.sub(Q.of(b))];
  const lines: [string, string][] = [];
  if (b !== 0) lines.push([`${poly([a, "x"])} = ${m1.toLatex()}`, `${poly([a, "x"])} = ${m2.toLatex()}`]);
  if (a !== 1) lines.push([`x = ${m1.div(Q.of(a)).toLatex()}`, `x = ${m2.div(Q.of(a)).toLatex()}`]);
  if (lines.length === 0) return { en: "", zh: "" };
  return {
    en: steps(...lines.map(([p, q]) => `${p}${orEn}${q}`)),
    zh: steps(...lines.map(([p, q]) => `${p}${orZh}${q}`)),
  };
}

/** splitAndSolve writes the two cases of |ax + b| = c for c > 0, solved, as the steps of a solution. */
function splitAndSolve(a: number, b: number, c: number, first = 1): Text {
  const L = linear(a, b);
  const cs = caseLines(L, String(c), String(-c));
  const solved = caseSolutions(a, b, Q.of(c), Q.of(-c));
  const how = undoing(a, b);
  const [n1, n2] = [first, first + 1];
  return t(
    `**Step ${n1}: split.** The inside, $${L}$, is $${c}$ away from $0$, so it is $${c}$ or $${-c}$:${cs.en}**Step ${n2}: solve each equation.** ${solved.en ? `In both, ${how.en}:${solved.en}` : "Both are already solved for $x$.\n\n"}`,
    `**第${zhOrdinal(n1)}步：拆开。** 里面的 $${L}$ 到 $0$ 的距离是 $${c}$，所以它等于 $${c}$ 或 $${-c}$：${cs.zh}**第${zhOrdinal(n2)}步：分别解两个方程。** ${solved.zh ? `对两个方程，${how["zh-CN"]}：${solved.zh}` : "两个方程已经解出了 $x$。\n\n"}`,
  );
}

/** zhOrdinal writes a small step number as a Chinese numeral. */
const zhOrdinal = (n: number) => ["零", "一", "二", "三", "四", "五", "六"][n] ?? String(n);

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

/** distanceFigure draws the distance between p and q on a number line as a jump labelled with its length; 0 is marked when it lies on the drawn stretch. */
function distanceFigure(p: number, q: number): Figure {
  let [lo, hi] = [Math.min(p, q) - 2, Math.max(p, q) + 2];
  if (lo <= 0 && 0 <= hi) [lo, hi] = [Math.min(lo, -1), Math.max(hi, 1)];
  const s = Math.min(1, 14 / (hi - lo));
  const x = (v: number) => (v - lo) * s;
  const every = hi - lo > 20 ? 5 : 1;
  const marks = [seg([-0.5, 0], [x(hi) + 0.5, 0])];
  for (let v = lo; v <= hi; v++) if (v % every === 0 || v === p || v === q) marks.push(seg([x(v), -0.1], [x(v), 0.1]));
  const minus = (v: number) => String(v).replace("-", "−");
  const labels = [p, q, ...(lo < 0 && 0 < hi && Math.abs(p) * s >= 1.5 && Math.abs(q) * s >= 1.5 ? [0] : [])];
  for (const v of labels) marks.push(note([x(v), -0.1], minus(v), "s"));
  const d = Math.abs(p - q);
  return drawing(
    [...marks, spot(x(p), "action"), spot(x(q), "action"), ...hop(x(p), x(q), String(d))],
    `A number line with ${minus(p)} and ${minus(q)} marked; the jump from one to the other is ${d} units long.`,
    `标出 ${minus(p)} 和 ${minus(q)} 的数轴；从一个点跳到另一个点的长度是 ${d} 个单位。`,
  );
}

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
    { topic: "order-of-operations-with-integers", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.6.NS.C.7.C", "CCSS.7.NS.A.1.C"],
  intro: t(
    `The absolute value of a number is its distance from $0$ on the number line: $|-5| = 5$ and $|5| = 5$, because both numbers are $5$ steps from $0$. A distance has a size but no direction, so an absolute value is never negative.

In this lesson the bars hold whole expressions, such as $|3 - 8|$, and that gives them a second use: measuring the distance between **any** two numbers. How far apart are $-2$ and $5$? Counting on the number line, $2$ steps take us from $-2$ to $0$ and $5$ more to $5$, so they are $7$ apart:

{{figure 0}}

Subtraction finds the same $7$: $5 - (-2) = 7$. Subtracting the other way gives $-2 - 5 = -7$, whose sign only says that $-2$ lies to the left. The absolute value drops that sign, so either order gives the distance:

$$|-2 - 5| = |-7| = 7 \\qquad |5 - (-2)| = |7| = 7.$$

We first evaluate expressions with bars, then put in values of variables, and finally use $|a - b|$ as the distance between $a$ and $b$.`,
    `一个数的绝对值是数轴上它到 $0$ 的距离：$|-5| = 5$，$|5| = 5$，因为这两个数到 $0$ 都是 $5$ 步。距离只有大小、没有方向，所以绝对值不会是负数。

这节课里，绝对值符号里装的是整个式子，例如 $|3 - 8|$，这让它有了第二个用处：量出**任意**两个数之间的距离。$-2$ 和 $5$ 相距多远？在数轴上数一数，从 $-2$ 到 $0$ 走 $2$ 步，再走 $5$ 步到 $5$，所以它们相距 $7$：

{{figure 0}}

用减法也能得到这个 $7$：$5 - (-2) = 7$。反过来减得 $-2 - 5 = -7$，这个符号只说明 $-2$ 在左边。绝对值去掉了符号，所以无论哪个顺序都得到距离：

$$|-2 - 5| = |-7| = 7 \\qquad |5 - (-2)| = |7| = 7.$$

我们先计算含绝对值符号的式子，再代入字母的值，最后用 $|a - b|$ 表示 $a$ 与 $b$ 之间的距离。`,
  ),
  introFigures: [distanceFigure(-2, 5)],
  knowledgePoints: [
    {
      id: "numerical-absolute-value-expressions",
      title: t("Numerical expressions", "数值表达式"),
      explanation: t(
        `Absolute value bars do two jobs at once. First they **group**, like parentheses: whatever is inside is worked out before anything else. Then they **measure the distance from $0$**, which turns a negative result into its opposite and leaves a positive one alone. Numbers outside the bars wait until the bars are gone.

For $|3 - 8| - |-4|$: inside the first bars, $3 - 8 = -5$. The absolute values are $|-5| = 5$ and $|-4| = 4$. Only now do we subtract: $5 - 4 = 1$.

When bars sit inside bars, work from the inside out, as with nested parentheses:

$$|2 - |-7|| = |2 - 7| = |-5| = 5.$$

> **Watch out.** Finish the inside before taking the absolute value, and do not split the bars: $|3 - 8| = |-5| = 5$, while $|3| - |8| = -5$. Do not drop the bars either: $3 - 8 = -5$ is not an absolute value. A number in front of the bars multiplies the absolute value, after it is found: $-2|-3| = -2 \\cdot 3 = -6$.`,
        `绝对值符号同时做两件事。首先它**分组**，和括号一样：里面的式子要最先算。然后它**量出到 $0$ 的距离**：负的结果变成它的相反数，正的结果不变。绝对值符号外面的数，要等绝对值算完再处理。

计算 $|3 - 8| - |-4|$：第一个绝对值里面，$3 - 8 = -5$。两个绝对值分别是 $|-5| = 5$ 和 $|-4| = 4$。到这时才做减法：$5 - 4 = 1$。

绝对值里面还有绝对值时，像嵌套的括号一样从里往外算：

$$|2 - |-7|| = |2 - 7| = |-5| = 5.$$

> **注意。** 先把里面算完再取绝对值，也不能把绝对值拆开：$|3 - 8| = |-5| = 5$，而 $|3| - |8| = -5$。也不能丢掉绝对值符号：$3 - 8 = -5$ 不是绝对值。绝对值前面的数要在求出绝对值以后再乘：$-2|-3| = -2 \\cdot 3 = -6$。`,
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
          return numberProblem({
            prompt: evalPrompt(expr),
            answer: value,
            wrong: [inner - Math.abs(c), Math.abs(a) - Math.abs(b) - Math.abs(c), Math.abs(inner) - c],
            solution: t(
              `**Step 1: inside the bars.** The bars group like parentheses, so the subtraction inside comes first:${steps(`${a} - ${paren(b)} = ${inner}`)}**Step 2: the absolute values.** Each is a distance from $0$, so neither is negative:${steps(`|${inner}| = ${Math.abs(inner)} \\qquad |${c}| = ${Math.abs(c)}`)}**Step 3: subtract.**${steps(`${Math.abs(inner)} - ${Math.abs(c)} = ${value}`)}**Check.** $|${a} - ${paren(b)}|$ is the distance between $${a}$ and $${b}$ on the number line, and counting from the smaller to the larger takes $${Math.abs(inner)}$ steps, as found.`,
              `**第一步：先算绝对值里面。** 绝对值符号像括号一样分组，所以先算里面的减法：${steps(`${a} - ${paren(b)} = ${inner}`)}**第二步：求绝对值。** 绝对值是到 $0$ 的距离，所以都不是负数：${steps(`|${inner}| = ${Math.abs(inner)} \\qquad |${c}| = ${Math.abs(c)}`)}**第三步：相减。**${steps(`${Math.abs(inner)} - ${Math.abs(c)} = ${value}`)}**检验。** $|${a} - ${paren(b)}|$ 是数轴上 $${a}$ 与 $${b}$ 之间的距离，从较小的数数到较大的数正好 $${Math.abs(inner)}$ 步，与上面一致。`,
            ),
          });
        }
        if (shape === 1) {
          const k = rng.sign() * rng.int(2, 5);
          const a = rng.nonZero(-12, 12);
          const b = rng.nonZero(-12, 12);
          const expr = `${k}|${a} + ${paren(b)}|`;
          const value = k * Math.abs(a + b);
          return numberProblem({
            prompt: evalPrompt(expr),
            answer: value,
            wrong: [k * (a + b), Math.abs(k * a + b), -value],
            solution: t(
              `**Step 1: inside the bars.** Add first, because the bars group:${steps(`${a} + ${paren(b)} = ${a + b}`)}**Step 2: the absolute value, then the factor.** The $${k}$ in front multiplies the absolute value, so it waits until the bars are gone:${steps(`${k}|${a + b}| = ${k} \\cdot ${Math.abs(a + b)} = ${value}`)}${a + b === 0 ? "" : `The sign of the answer comes from the factor $${k}$ alone, since $|${a + b}|$ is positive.`}`,
              `**第一步：先算绝对值里面。** 绝对值符号起分组作用，所以先相加：${steps(`${a} + ${paren(b)} = ${a + b}`)}**第二步：先求绝对值，再乘系数。** 前面的 $${k}$ 乘的是绝对值，所以要等绝对值算出来再乘：${steps(`${k}|${a + b}| = ${k} \\cdot ${Math.abs(a + b)} = ${value}`)}${a + b === 0 ? "" : `因为 $|${a + b}|$ 是正数，答案的符号只由系数 $${k}$ 决定。`}`,
            ),
          });
        }
        if (shape === 2) {
          const a = rng.bool(0.7) ? -rng.int(1, 15) : rng.int(1, 15);
          const b = rng.bool(0.7) ? -rng.int(1, 15) : rng.int(1, 15);
          const c = rng.nonZero(-9, 9);
          const expr = `|${a}| - |${b}|${tail(c)}`;
          const value = Math.abs(a) - Math.abs(b) + c;
          return numberProblem({
            prompt: evalPrompt(expr),
            answer: value,
            wrong: [a - b + c, Math.abs(a - b) + c, Math.abs(a) + Math.abs(b) + c],
            solution: t(
              `**Step 1: the absolute values.** Each pair of bars holds a single number, so replace it by that number's distance from $0$:${steps(`|${a}| = ${Math.abs(a)} \\qquad |${b}| = ${Math.abs(b)}`)}**Step 2: add and subtract from left to right.** The minus sign between the bars belongs to the expression, not to the numbers inside, so it stays:${steps(`${Math.abs(a)} - ${Math.abs(b)}${tail(c)} = ${value}`)}`,
              `**第一步：求绝对值。** 每对绝对值符号里只有一个数，把它换成这个数到 $0$ 的距离：${steps(`|${a}| = ${Math.abs(a)} \\qquad |${b}| = ${Math.abs(b)}`)}**第二步：从左到右加减。** 两个绝对值之间的减号属于整个式子，不属于符号里面的数，所以保留：${steps(`${Math.abs(a)} - ${Math.abs(b)}${tail(c)} = ${value}`)}`,
            ),
          });
        }
        const a = rng.int(-9, 9);
        const b = rng.nonZero(-15, 15);
        const expr = `|${a} - |${b}||`;
        const value = Math.abs(a - Math.abs(b));
        return numberProblem({
          prompt: evalPrompt(expr),
          answer: value,
          wrong: [Math.abs(a - b), a - Math.abs(b), Math.abs(a) + Math.abs(b)],
          solution: t(
            `**Step 1: the inner bars.** Work from the inside out, as with nested parentheses:${steps(`|${b}| = ${Math.abs(b)}`)}**Step 2: inside the outer bars.**${steps(`${a} - ${Math.abs(b)} = ${a - Math.abs(b)}`)}**Step 3: the outer absolute value.**${steps(`|${a - Math.abs(b)}| = ${value}`)}`,
            `**第一步：里层的绝对值。** 像嵌套的括号一样从里往外算：${steps(`|${b}| = ${Math.abs(b)}`)}**第二步：算外层绝对值里面。**${steps(`${a} - ${Math.abs(b)} = ${a - Math.abs(b)}`)}**第三步：外层的绝对值。**${steps(`|${a - Math.abs(b)}| = ${value}`)}`,
          ),
        });
      },
    },
    {
      id: "absolute-value-expressions-with-variables",
      title: t("Expressions with variables", "含字母的式子"),
      explanation: t(
        `To evaluate an expression with absolute values, first **substitute** the given values, writing each negative number in parentheses. Then follow the same order as before: work out the inside of the bars, take the absolute value, and only then do what stands outside the bars.

For $x = -2$:

$$3|2x + 1| - 4 = 3|2(-2) + 1| - 4 = 3|-3| - 4 = 3 \\cdot 3 - 4 = 5.$$

The inside, $-3$, is negative, and the bars turn it into $3$ before the $3$ in front multiplies it.

> **Watch out.** The absolute value comes before the multiplication and before the subtraction outside: $3|-3|$ is $3 \\cdot 3 = 9$, not $3 \\cdot (-3) = -9$. The bars apply only to what is inside them: the $-4$ outside stays $-4$, and the whole result is not put in bars.`,
        `计算含绝对值的式子，先**代入**给定的值，负数要加括号。然后按照同样的顺序：先算绝对值符号里面，再取绝对值，最后才算符号外面的部分。

当 $x = -2$ 时：

$$3|2x + 1| - 4 = 3|2(-2) + 1| - 4 = 3|-3| - 4 = 3 \\cdot 3 - 4 = 5.$$

里面的 $-3$ 是负数，绝对值先把它变成 $3$，前面的 $3$ 再去乘它。

> **注意。** 绝对值要在乘法之前、也在外面的减法之前算：$3|-3|$ 是 $3 \\cdot 3 = 9$，不是 $3 \\cdot (-3) = -9$。绝对值只作用于符号里面的部分：外面的 $-4$ 仍是 $-4$，也不能给整个结果加上绝对值。`,
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
          const after = [`|${x - y}|`, `${Math.abs(x)} - ${Math.abs(y)}`, `|${x + y}|`];
          const value = values[shape]!;
          return numberProblem({
            prompt: t(
              `Evaluate $${exprs[shape]}$ when $x = ${x}$ and $y = ${y}$.`,
              `当 $x = ${x}$，$y = ${y}$ 时，求 $${exprs[shape]}$ 的值。`,
            ),
            answer: value,
            wrong: [...values.filter((_, i) => i !== shape), shape === 0 ? x - y : shape === 2 ? x + y : x - y],
            solution: t(
              `**Step 1: substitute** $x = ${x}$ and $y = ${y}$${x < 0 || y < 0 ? ", with negative numbers in parentheses" : ""}:${steps(`${exprs[shape]} = ${subs[shape]}`)}**Step 2: evaluate.** ${shape === 1 ? "Each pair of bars holds one number: take the absolute values, then subtract." : "Work out the inside of the bars, then take the absolute value."}${steps(`${subs[shape]} = ${after[shape]} = ${value}`)}`,
              `**第一步：代入** $x = ${x}$，$y = ${y}$${x < 0 || y < 0 ? "，负数加括号" : ""}：${steps(`${exprs[shape]} = ${subs[shape]}`)}**第二步：计算。** ${shape === 1 ? "每对绝对值符号里只有一个数：先求绝对值，再相减。" : "先算绝对值符号里面，再取绝对值。"}${steps(`${subs[shape]} = ${after[shape]} = ${value}`)}`,
            ),
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
        const av = a === 1 ? paren(v) : times(a, v);
        const put = poly([k, bars(`${av}${tail(b)}`)], [d, ""]);
        const outside =
          k === 1
            ? d === 0
              ? ""
              : " Then add the number outside."
            : " Then multiply by the factor in front, and add the number outside last.";
        const outsideZh = k === 1 ? (d === 0 ? "" : "再加上外面的数。") : "再乘前面的系数，最后加上外面的数。";
        return numberProblem({
          prompt: t(`Evaluate $${expr}$ when $x = ${v}$.`, `当 $x = ${v}$ 时，求 $${expr}$ 的值。`),
          answer: value,
          wrong: [k * inner + d, Math.abs(k * inner + d), k * Math.abs(inner) - d],
          solution: t(
            `**Step 1: substitute** $x = ${v}$, in parentheses:${steps(`${expr} = ${put}`)}**Step 2: inside the bars.** $${av}${tail(b)} = ${inner}$:${steps(poly([k, bars(String(inner))], [d, ""]))}**Step 3: the absolute value, then the rest.** $|${inner}| = ${Math.abs(inner)}$.${outside}${steps(chain(`${kTimes(k, Math.abs(inner))}${tail(d)}`, String(value)))}`,
            `**第一步：代入** $x = ${v}$，加上括号：${steps(`${expr} = ${put}`)}**第二步：算绝对值里面。** $${av}${tail(b)} = ${inner}$：${steps(poly([k, bars(String(inner))], [d, ""]))}**第三步：先求绝对值，再算其余部分。** $|${inner}| = ${Math.abs(inner)}$。${outsideZh}${steps(chain(`${kTimes(k, Math.abs(inner))}${tail(d)}`, String(value)))}`,
          ),
        });
      },
    },
    {
      id: "distance-on-the-number-line",
      figure: algebraDrawings["absolute-value-expressions#distance-on-the-number-line"],
      title: t("Distance on the number line", "数轴上的距离"),
      explanation: t(
        `Subtracting two numbers tells how far apart they are, with a sign that says which one is further right. The absolute value drops that sign, so the distance between $a$ and $b$ on the number line is

$$|a - b|.$$

The order does not matter, because $|a - b| = |b - a|$. For $-6$ and $4$: $|-6 - 4| = |-10| = 10$. Counting confirms it: $6$ steps from $-6$ to $0$, then $4$ more to $4$.

Read the other way, an expression with bars names a distance: $|x - 3|$ is the distance between $x$ and $3$, and $|x + 3| = |x - (-3)|$ is the distance between $x$ and $-3$.

> **Watch out.** For numbers on opposite sides of $0$, the distance is the **sum** of their sizes: $-6$ and $4$ are $10$ apart, not $|6 - 4| = 2$ and not $|-6 + 4| = 2$. A distance is never negative, so $-6 - 4 = -10$ is not the answer either. And $|x + 3|$ measures from $-3$, not from $3$.`,
        `两个数相减，可以知道它们相距多远，结果的符号表示哪个数更靠右。绝对值去掉这个符号，所以数轴上 $a$ 与 $b$ 之间的距离是

$$|a - b|.$$

顺序无关紧要，因为 $|a - b| = |b - a|$。对于 $-6$ 和 $4$：$|-6 - 4| = |-10| = 10$。数一数也能验证：从 $-6$ 到 $0$ 是 $6$ 步，再走 $4$ 步到 $4$。

反过来读，带绝对值的式子表示一个距离：$|x - 3|$ 是 $x$ 与 $3$ 之间的距离，而 $|x + 3| = |x - (-3)|$ 是 $x$ 与 $-3$ 之间的距离。

> **注意。** 两个数在 $0$ 的两侧时，距离是它们大小的**和**：$-6$ 和 $4$ 相距 $10$，不是 $|6 - 4| = 2$，也不是 $|-6 + 4| = 2$。距离不会是负数，所以 $-6 - 4 = -10$ 也不是答案。另外，$|x + 3|$ 是从 $-3$ 量起，不是从 $3$ 量起。`,
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
              `The distance between two numbers is the absolute value of their difference, so the distance between $x$ and $${c}$ is $|x - ${paren(c)}|$.${c < 0 ? ` Subtracting $${c}$ is adding $${-c}$, so this is $${options[0]}$.` : ""}

**Check.** The number $x = ${c + 2}$ lies $2$ to the right of $${c}$, so its distance from $${c}$ is $2$, and indeed $|${c + 2}${tail(-c)}| = |2| = 2$.`,
              `两个数之间的距离是它们差的绝对值，所以 $x$ 与 $${c}$ 之间的距离是 $|x - ${paren(c)}|$。${c < 0 ? `减去 $${c}$ 就是加上 $${-c}$，所以它就是 $${options[0]}$。` : ""}

**检验。** $x = ${c + 2}$ 在 $${c}$ 右边 $2$ 处，所以它到 $${c}$ 的距离是 $2$；确实 $|${c + 2}${tail(-c)}| = |2| = 2$。`,
            ),
          });
        }
        const a = rng.int(-20, 20);
        let b = rng.int(-20, 20);
        if (b === a) b = a === 20 ? -20 : a + 1;
        const [p, q] = rng.bool(0.7) && a * b >= 0 ? [a, -b === a ? b : -b] : [a, b];
        const value = Math.abs(p - q);
        return {
          ...numberProblem({
            prompt: t(`Find the distance between $${p}$ and $${q}$ on the number line.`, `求数轴上 $${p}$ 与 $${q}$ 之间的距离。`),
            answer: value,
            wrong: [Math.abs(Math.abs(p) - Math.abs(q)), Math.abs(p + q), p - q],
            solution: t(
              `**Step 1: subtract.** The difference says how far apart the numbers are; its sign only says which one is further right:${steps(`${p} - ${paren(q)} = ${p - q}`)}**Step 2: take the absolute value**, because a distance is never negative:${steps(`|${p - q}| = ${value}`)}{{figure 0}}

**Check.** Subtracting in the other order must give the same distance: $|${q} - ${paren(p)}| = |${q - p}| = ${value}$.`,
              `**第一步：相减。** 差表示两个数相距多远；它的符号只说明哪个数更靠右：${steps(`${p} - ${paren(q)} = ${p - q}`)}**第二步：取绝对值**，因为距离不会是负数：${steps(`|${p - q}| = ${value}`)}{{figure 0}}

**检验。** 换个顺序相减，距离应该相同：$|${q} - ${paren(p)}| = |${q - p}| = ${value}$。`,
            ),
          }),
          solutionFigures: [distanceFigure(p, q)],
        };
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
  encompasses: [],
  xp: 12,
  intro: t(
    `We can already evaluate $|-3 \\cdot 4|$: the product is $-12$, and $|-12| = 12$. Notice that $|-3| \\cdot |4| = 3 \\cdot 4 = 12$ as well. This is no accident. When we multiply two numbers, the **size** of the product is the product of the sizes, and the **sign** is decided separately, by how many of the numbers are negative. The absolute value keeps the size and throws the sign away, so

$$|ab| = |a| \\cdot |b|.$$

Division works the same way: $\\left|\\frac{a}{b}\\right| = \\frac{|a|}{|b|}$ for $b \\ne 0$.

These rules are useful when we know only the size of a number. If $|a| = 4$, then $a$ could be $4$ or $-4$, yet $|-3a|$ is fixed: $-3 \\cdot 4 = -12$ and $-3 \\cdot (-4) = 12$ both have absolute value $12 = 3 \\cdot 4$. In this lesson we use the rules to find such values and to rewrite expressions with variables.`,
    `我们已经会算 $|-3 \\cdot 4|$：积是 $-12$，而 $|-12| = 12$。注意 $|-3| \\cdot |4| = 3 \\cdot 4 = 12$ 也成立。这不是巧合。两个数相乘时，积的**大小**等于两数大小的积，而**符号**另外决定，看有几个数是负的。绝对值保留大小、丢掉符号，所以

$$|ab| = |a| \\cdot |b|.$$

除法也一样：当 $b \\ne 0$ 时，$\\left|\\frac{a}{b}\\right| = \\frac{|a|}{|b|}$。

当只知道一个数的大小时，这些法则很有用。若 $|a| = 4$，$a$ 可能是 $4$ 也可能是 $-4$，但 $|-3a|$ 是确定的：$-3 \\cdot 4 = -12$ 和 $-3 \\cdot (-4) = 12$ 的绝对值都是 $12 = 3 \\cdot 4$。这节课我们用这些法则求这样的值，并改写含字母的式子。`,
  ),
  knowledgePoints: [
    {
      id: "absolute-value-of-a-product",
      title: t("Absolute value of a product", "积的绝对值"),
      explanation: t(
        `The absolute value of a product is the product of the absolute values:

$$|ab| = |a| \\cdot |b|.$$

Multiplying decides only the sign, and the absolute value removes the sign, so we may take absolute values first and multiply afterwards. The rule works for any number of factors.

Suppose $|a| = 4$ and $|b| = 5$. Then $|-3ab| = |-3| \\cdot |a| \\cdot |b| = 3 \\cdot 4 \\cdot 5 = 60$, whatever the signs of $a$ and $b$. Trying $a = -4$, $b = 5$ confirms it: $-3 \\cdot (-4) \\cdot 5 = 60$.

> **Watch out.** The rule is about products: $|ab|$ is $|a| \\cdot |b|$, not $|a| + |b|$. A factor such as $-3$ comes out as its absolute value $3$, so the result is never negative: $|-3a|$ is $12$ when $|a| = 4$, not $-12$. And use the size of the letter that actually appears: $|-3a|$ uses $|a|$, not $|b|$.`,
        `积的绝对值等于各因数绝对值的积：

$$|ab| = |a| \\cdot |b|.$$

相乘只决定符号，而绝对值去掉符号，所以可以先取绝对值再相乘。因数有几个都适用。

设 $|a| = 4$，$|b| = 5$。则 $|-3ab| = |-3| \\cdot |a| \\cdot |b| = 3 \\cdot 4 \\cdot 5 = 60$，无论 $a$、$b$ 的符号如何。取 $a = -4$，$b = 5$ 验证：$-3 \\cdot (-4) \\cdot 5 = 60$。

> **注意。** 这个法则说的是积：$|ab|$ 等于 $|a| \\cdot |b|$，不是 $|a| + |b|$。像 $-3$ 这样的因数要变成它的绝对值 $3$ 再乘，所以结果不会是负数：$|a| = 4$ 时 $|-3a|$ 是 $12$，不是 $-12$。还要用式子里实际出现的字母的大小：$|-3a|$ 用的是 $|a|$，不是 $|b|$。`,
      ),
      generate(rng) {
        const m = rng.int(2, 9);
        const n = rng.int(2, 9);
        const k = rng.sign() * rng.int(2, 9);
        const shape = rng.int(0, 2);
        const known = t(
          `Since $|a| = ${m}$, the number $a$ is $${m}$ or $${-m}$; ${shape === 1 ? "its sign is unknown" : `likewise $b$ is $${n}$ or $${-n}$`}. The product rule gives the value without knowing the signs.`,
          `因为 $|a| = ${m}$，$a$ 是 $${m}$ 或 $${-m}$；${shape === 1 ? "它的符号不知道" : `同样 $b$ 是 $${n}$ 或 $${-n}$`}。积的法则不需要知道符号就能求出值。`,
        );
        if (shape === 0) {
          return numberProblem({
            prompt: givenAB(m, n, "|ab|"),
            answer: m * n,
            wrong: [m + n, -(m * n)],
            solution: t(
              `${known.en}${steps(`|ab| = |a| \\cdot |b| = ${m} \\cdot ${n} = ${m * n}`)}**Check.** Take one choice of signs, $a = ${m}$ and $b = ${-n}$: $|${m} \\cdot (${-n})| = |${-m * n}| = ${m * n}$.`,
              `${known["zh-CN"]}${steps(`|ab| = |a| \\cdot |b| = ${m} \\cdot ${n} = ${m * n}`)}**检验。** 取一种符号，$a = ${m}$，$b = ${-n}$：$|${m} \\cdot (${-n})| = |${-m * n}| = ${m * n}$。`,
            ),
          });
        }
        if (shape === 1) {
          const value = Math.abs(k) * m;
          return numberProblem({
            prompt: givenAB(m, n, `|${k}a|`),
            answer: value,
            wrong: [k * m, Math.abs(k) + m, Math.abs(k) * n],
            solution: t(
              `${known.en} The factor $${k}$ comes out as $|${k}| = ${Math.abs(k)}$:${steps(`|${k}a| = |${k}| \\cdot |a| = ${Math.abs(k)} \\cdot ${m} = ${value}`)}**Check.** Take $a = ${-m}$: $|${k} \\cdot (${-m})| = |${-k * m}| = ${value}$.`,
              `${known["zh-CN"]}因数 $${k}$ 移出来变成 $|${k}| = ${Math.abs(k)}$：${steps(`|${k}a| = |${k}| \\cdot |a| = ${Math.abs(k)} \\cdot ${m} = ${value}`)}**检验。** 取 $a = ${-m}$：$|${k} \\cdot (${-m})| = |${-k * m}| = ${value}$。`,
            ),
          });
        }
        const value = Math.abs(k) * m * n;
        return numberProblem({
          prompt: givenAB(m, n, `|${k}ab|`),
          answer: value,
          wrong: [k * m * n, Math.abs(k) * (m + n), m * n],
          solution: t(
            `${known.en} Take the absolute value of each of the three factors:${steps(`|${k}ab| = |${k}| \\cdot |a| \\cdot |b| = ${Math.abs(k)} \\cdot ${m} \\cdot ${n} = ${value}`)}**Check.** Take $a = ${m}$ and $b = ${-n}$: $|${k} \\cdot ${m} \\cdot (${-n})| = |${-k * m * n}| = ${value}$.`,
            `${known["zh-CN"]}三个因数分别取绝对值：${steps(`|${k}ab| = |${k}| \\cdot |a| \\cdot |b| = ${Math.abs(k)} \\cdot ${m} \\cdot ${n} = ${value}`)}**检验。** 取 $a = ${m}$，$b = ${-n}$：$|${k} \\cdot ${m} \\cdot (${-n})| = |${-k * m * n}| = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "absolute-value-of-a-quotient",
      title: t("Absolute value of a quotient", "商的绝对值"),
      explanation: t(
        `Dividing, like multiplying, decides the size and the sign separately, so the absolute value of a quotient is the quotient of the absolute values, for $b \\ne 0$:

$$\\left|\\frac{a}{b}\\right| = \\frac{|a|}{|b|}.$$

A number multiplying $a$ or $b$ comes out of the bars as its absolute value and stays on the same side of the fraction bar. If $|a| = 6$ and $|b| = 4$:

$$\\left|\\frac{a}{-2b}\\right| = \\frac{|a|}{|-2| \\cdot |b|} = \\frac{6}{2 \\cdot 4} = \\frac{6}{8} = \\frac{3}{4}.$$

> **Watch out.** Keep the fraction the right way up: $|a|$ goes on top when $a$ is on top, so the answer here is $\\frac{3}{4}$, not $\\frac{4}{3}$. The result is never negative, even when the fraction holds a negative number such as $-2$. And a number next to $b$ multiplies $|b|$ in the denominator; it does not move to the top.`,
        `除法和乘法一样，大小和符号分开决定，所以当 $b \\ne 0$ 时，商的绝对值等于绝对值的商：

$$\\left|\\frac{a}{b}\\right| = \\frac{|a|}{|b|}.$$

乘在 $a$ 或 $b$ 上的数，移出绝对值时变成它的绝对值，并且留在分数线的同一侧。若 $|a| = 6$，$|b| = 4$：

$$\\left|\\frac{a}{-2b}\\right| = \\frac{|a|}{|-2| \\cdot |b|} = \\frac{6}{2 \\cdot 4} = \\frac{6}{8} = \\frac{3}{4}.$$

> **注意。** 分数不要上下颠倒：$a$ 在分子，$|a|$ 就在分子，所以这里答案是 $\\frac{3}{4}$，不是 $\\frac{4}{3}$。即使分数里有 $-2$ 这样的负数，结果也不会是负数。乘在 $b$ 旁边的数在分母里乘 $|b|$，不会跑到分子上去。`,
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
        const split = ["\\frac{|a|}{|b|}", `\\frac{|${k}| \\cdot |a|}{|b|}`, `\\frac{|a|}{|${k}| \\cdot |b|}`][shape]!;
        const filled = [`\\frac{${m}}{${n}}`, `\\frac{${K} \\cdot ${m}}{${n}}`, `\\frac{${m}}{${K} \\cdot ${n}}`][shape]!;
        const reduced = `\\frac{${top}}{${bottom}}`;
        const values = chain(filled, ...(shape === 0 ? [] : [reduced]), value.toLatex());
        const [ta, tb] = [m, -n];
        const sample = Q.of(shape === 1 ? k * ta : ta, shape === 2 ? k * tb : tb);
        const shown = [`\\frac{${ta}}{${tb}}`, `\\frac{${k} \\cdot ${ta}}{${tb}}`, `\\frac{${ta}}{${k} \\cdot (${tb})}`][shape]!;
        return numberProblem({
          prompt: givenAB(m, n, target),
          answer: value,
          wrong: [
            Q.of(bottom!, top!),
            value.neg(),
            Q.of(m * n),
            ...(shape === 0 ? [] : [Q.of(shape === 1 ? k * m : m, shape === 1 ? n : k * n)]),
          ],
          solution: t(
            `**Step 1: split the quotient.** The absolute value of a quotient is the quotient of the absolute values${shape === 0 ? "" : `, and the factor $${k}$ comes out as $|${k}| = ${K}$ on its own side of the fraction bar`}:${steps(`${target} = ${split}`)}**Step 2: put in the sizes and simplify.**${steps(`${split} = ${values}`)}**Check.** Take $a = ${ta}$ and $b = ${tb}$: the expression is $${shown} = ${sample.toLatex()}$, and its absolute value is $${value.toLatex()}$.`,
            `**第一步：拆开商。** 商的绝对值等于绝对值的商${shape === 0 ? "" : `，因数 $${k}$ 变成 $|${k}| = ${K}$，留在分数线的同一侧`}：${steps(`${target} = ${split}`)}**第二步：代入大小并化简。**${steps(`${split} = ${values}`)}**检验。** 取 $a = ${ta}$，$b = ${tb}$：式子等于 $${shown} = ${sample.toLatex()}$，它的绝对值是 $${value.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "rewriting-with-the-rules",
      title: t("Rewriting expressions", "改写式子"),
      explanation: t(
        `The rules let numbers leave the bars. Split the product, and a number comes out as its absolute value. A variable whose sign is unknown must stay inside, because its absolute value depends on that sign:

$$|-5x| = |-5| \\cdot |x| = 5|x| \\qquad \\left|\\frac{x}{-4}\\right| = \\frac{|x|}{|-4|} = \\frac{|x|}{4}.$$

A square is never negative, so it can leave the bars too: $|x^{2}| = x^{2}$ and $|-3x^{2}| = 3x^{2}$.

> **Watch out.** Only the number leaves the bars: $|-5x|$ is $5|x|$, not $5x$. Try $x = -1$: $|-5 \\cdot (-1)| = 5$ and $5|-1| = 5$, but $5x = -5$. The number also comes out positive, so $-5|x|$ is wrong as well: it is never positive.`,
        `利用这些法则可以把数移出绝对值符号。把积拆开，数移出来时变成它的绝对值。符号未知的字母必须留在里面，因为它的绝对值取决于它的符号：

$$|-5x| = |-5| \\cdot |x| = 5|x| \\qquad \\left|\\frac{x}{-4}\\right| = \\frac{|x|}{|-4|} = \\frac{|x|}{4}.$$

平方不会是负数，所以平方也可以移出来：$|x^{2}| = x^{2}$，$|-3x^{2}| = 3x^{2}$。

> **注意。** 只有数能移出来：$|-5x|$ 等于 $5|x|$，不是 $5x$。取 $x = -1$ 试试：$|-5 \\cdot (-1)| = 5$，$5|-1| = 5$，但 $5x = -5$。数移出来是正的，所以 $-5|x|$ 也不对：它从来不会是正数。`,
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
        const split = [`|${k}| \\cdot |x|`, `\\frac{|x|}{|${k}|}`, `|${k}| \\cdot |x^{2}|`, `|${k}| \\cdot |x| \\cdot |y|`][shape]!;
        const why = [
          t(
            "The number comes out as its absolute value; $x$ stays inside the bars, because its sign is unknown.",
            "数移出来变成它的绝对值；$x$ 的符号未知，所以留在绝对值符号里。",
          ),
          t(
            "The number comes out as its absolute value, below the fraction bar; $x$ stays inside the bars, because its sign is unknown.",
            "数移出来变成它的绝对值，仍在分母；$x$ 的符号未知，所以留在绝对值符号里。",
          ),
          t(
            "The number comes out as its absolute value, and $x^{2}$ is never negative, so $|x^{2}| = x^{2}$.",
            "数移出来变成它的绝对值；$x^{2}$ 不会是负数，所以 $|x^{2}| = x^{2}$。",
          ),
          t(
            "The number comes out as its absolute value; $x$ and $y$ stay inside bars of their own, because their signs are unknown.",
            "数移出来变成它的绝对值；$x$ 和 $y$ 的符号未知，各自留在绝对值符号里。",
          ),
        ][shape]!;
        const trial = [
          [`x = -1`, `|${k} \\cdot (-1)| = ${K}`, `${K}|-1| = ${K}`],
          [`x = ${-K}`, `\\left|\\frac{${-K}}{${k}}\\right| = 1`, `\\frac{|${-K}|}{${K}} = 1`],
          [`x = -1`, `|${k} \\cdot (-1)^{2}| = ${K}`, `${K}(-1)^{2} = ${K}`],
          [`x = 1, y = -1`, `|${k} \\cdot 1 \\cdot (-1)| = ${K}`, `${K}|1||-1| = ${K}`],
        ][shape]!;
        const trialZh = trial[0]!.replace(", ", "$，$");
        return choiceProblem({
          prompt: t(
            `Which expression is equal to $${expr}$ for all values of ${vars.en}?`,
            `对 ${vars["zh-CN"]} 的所有取值，哪个式子与 $${expr}$ 相等？`,
          ),
          options: order.map((i) => same(`$${options[i]}$`)),
          correct: order.indexOf(0),
          solution: t(
            `**Step 1: split.** ${shape === 1 ? "The quotient rule" : "The product rule"} separates the number from the variable${shape === 3 ? "s" : ""}:${steps(`${expr} = ${split}`)}**Step 2: simplify.** ${why.en}${steps(`${split} = ${options[0]}`)}**Check.** Try $${trial[0]}$: the original gives $${trial[1]}$, and $${options[0]}$ gives $${trial[2]}$.`,
            `**第一步：拆开。** 用${shape === 1 ? "商" : "积"}的法则把数和字母分开：${steps(`${expr} = ${split}`)}**第二步：化简。** ${why["zh-CN"]}${steps(`${split} = ${options[0]}`)}**检验。** 取 $${trialZh}$：原式得 $${trial[1]}$，$${options[0]}$ 得 $${trial[2]}$。`,
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
  intro: t(
    `The product rule $|ab| = |a| \\cdot |b|$ has a quiet consequence. Take $a = -1$: then $|-u| = |-1| \\cdot |u| = |u|$. A number and its opposite have the same absolute value, which makes sense, since they are the same distance from $0$.

So the sign of everything inside the bars can be changed without changing the absolute value. For example $3 - x = -(x - 3)$, so

$$|3 - x| = |x - 3|.$$

Try $x = 10$: $|3 - 10| = |-7| = 7$ and $|10 - 3| = |7| = 7$. Both are the distance between $x$ and $3$.

In this lesson we use this to reorder the inside of the bars, then find how large or small $|a + b|$ can be when only $|a|$ and $|b|$ are known, and finally remove the bars altogether when the sign of the inside is known.`,
    `积的法则 $|ab| = |a| \\cdot |b|$ 有一个不起眼的推论。取 $a = -1$：则 $|-u| = |-1| \\cdot |u| = |u|$。一个数和它的相反数绝对值相同，这很合理，因为它们到 $0$ 的距离一样。

所以把绝对值符号里面整体变号，绝对值不变。例如 $3 - x = -(x - 3)$，所以

$$|3 - x| = |x - 3|.$$

取 $x = 10$ 试试：$|3 - 10| = |-7| = 7$，$|10 - 3| = |7| = 7$。两者都是 $x$ 与 $3$ 之间的距离。

这节课我们先用这一点调整绝对值里面的顺序，再求只知道 $|a|$ 和 $|b|$ 时 $|a + b|$ 最大、最小能是多少，最后在知道里面的符号时把绝对值符号完全去掉。`,
  ),
  knowledgePoints: [
    {
      id: "reordering-inside-absolute-values",
      title: t("Reordering inside the bars", "绝对值内的变号"),
      explanation: t(
        `Changing the sign of **every** term inside the bars does not change the absolute value, because $|-u| = |u|$. To use it, factor $-1$ out of the inside:

$$|3 - x| = |-(x - 3)| = |x - 3| \\qquad |-x - 4| = |-(x + 4)| = |x + 4|.$$

Check the first by expanding: $-(x - 3) = -x + 3 = 3 - x$. Every term changed sign: the $x$ and the $3$.

> **Watch out.** Both terms change sign together: $|3 - x|$ becomes $|x - 3|$, not $|x + 3|$. No minus sign comes out in front: $-|x - 3|$ is never positive, so it is not equal to $|3 - x|$. And the bars cannot be split: $|x - 3|$ is not $|x| - 3$.`,
        `把绝对值符号里面的**每一项**都变号，绝对值不变，因为 $|-u| = |u|$。用法是从里面提出 $-1$：

$$|3 - x| = |-(x - 3)| = |x - 3| \\qquad |-x - 4| = |-(x + 4)| = |x + 4|.$$

把第一个展开检验：$-(x - 3) = -x + 3 = 3 - x$。每一项都变了号：$x$ 和 $3$ 都变了。

> **注意。** 两项要一起变号：$|3 - x|$ 变成 $|x - 3|$，不是 $|x + 3|$。前面不会多出负号：$-|x - 3|$ 不会是正数，所以它不等于 $|3 - x|$。绝对值符号也不能拆开：$|x - 3|$ 不等于 $|x| - 3$。`,
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
        const inside = [`x - ${c}`, `x + ${c}`, `${a}x - ${c}`][shape]!;
        const expand = [`-(x - ${c}) = -x + ${c} = ${c} - x`, `-(x + ${c}) = -x - ${c}`, `-(${a}x - ${c}) = -${a}x + ${c} = ${c} - ${a}x`][
          shape
        ]!;
        const x0 = [c + 2, 1, 1][shape]!;
        const left = [
          `|${c} - ${c + 2}| = |-2| = 2`,
          `|-1 - ${c}| = |${-1 - c}| = ${1 + c}`,
          chain(`|${c} - ${a}|`, `|${c - a}|`, `${Math.abs(c - a)}`),
        ][shape]!;
        const right = [`|${c + 2} - ${c}| = 2`, `|1 + ${c}| = ${1 + c}`, chain(`|${a} - ${c}|`, `|${a - c}|`, `${Math.abs(c - a)}`)][
          shape
        ]!;
        const order = rng.shuffle([0, 1, 2, 3]);
        return choiceProblem({
          prompt: t(`Which expression is equal to $${expr}$ for all values of $x$?`, `对 $x$ 的所有取值，哪个式子与 $${expr}$ 相等？`),
          options: order.map((i) => same(`$${options[i]}$`)),
          correct: order.indexOf(0),
          solution: t(
            `**Step 1: factor out $-1$.** Every term inside changes sign when we take out $-1$:${steps(expand)}**Step 2: drop the $-1$.** Since $|-u| = |u|$, the bars absorb the sign:${steps(`${expr} = |-(${inside})| = ${options[0]}`)}**Check.** At $x = ${x0}$: $${left}$, and $${right}$.`,
            `**第一步：提出 $-1$。** 提出 $-1$ 时，里面每一项都变号：${steps(expand)}**第二步：去掉 $-1$。** 因为 $|-u| = |u|$，符号被绝对值吸收了：${steps(`${expr} = |-(${inside})| = ${options[0]}`)}**检验。** 当 $x = ${x0}$ 时：$${left}$，而 $${right}$。`,
          ),
        });
      },
    },
    {
      id: "largest-and-smallest-values",
      title: t("Largest and smallest values", "最大值与最小值"),
      explanation: t(
        `If we know only $|a|$ and $|b|$, the value of $|a + b|$ depends on the signs. When $a$ and $b$ point the same way on the number line, their sizes add; when they point opposite ways, they partly cancel. For $|a| = 7$ and $|b| = 3$, take $a = 7$: adding $b = 3$ reaches $10$, and adding $b = -3$ reaches only $4$:

{{figure 0}}

No choice of signs gets further than $7 + 3$ or closer to $0$ than $7 - 3$, so

$$\\big||a| - |b|\\big| \\le |a + b| \\le |a| + |b|.$$

The same bounds hold for $|a - b|$, because subtracting $b$ is adding $-b$, and $|-b| = |b|$.

> **Watch out.** The least value is the **difference** of the sizes, made positive: $4$ here, not $-4$ and not $0$, since $a$ and $b$ have different sizes and cannot cancel completely. The greatest value is the **sum** of the sizes, not their product.`,
        `如果只知道 $|a|$ 和 $|b|$，$|a + b|$ 的值取决于符号。$a$ 与 $b$ 在数轴上朝同一方向时，大小相加；朝相反方向时，部分抵消。设 $|a| = 7$，$|b| = 3$，取 $a = 7$：加上 $b = 3$ 到达 $10$，加上 $b = -3$ 只到达 $4$：

{{figure 0}}

无论怎样选符号，都不会比 $7 + 3$ 更远，也不会比 $7 - 3$ 更接近 $0$，所以

$$\\big||a| - |b|\\big| \\le |a + b| \\le |a| + |b|.$$

$|a - b|$ 也有同样的范围，因为减去 $b$ 就是加上 $-b$，而 $|-b| = |b|$。

> **注意。** 最小值是两个大小的**差**，取正值：这里是 $4$，不是 $-4$，也不是 $0$，因为 $a$ 与 $b$ 大小不同，不能完全抵消。最大值是两个大小的**和**，不是积。`,
      ),
      figures: [
        drawing(
          [
            ...lineMarks(0, 10),
            spot(7, "action"),
            ...hop(0, 7, "7", 0, "accent"),
            ...hop(7, 10, "3", 0, "result"),
            ...hop(7, 4, "3", 0, "result"),
          ],
          "A number line from 0 to 10. A jump of 7 from 0 reaches 7; from there a jump of 3 to the right reaches 10 and a jump of 3 to the left reaches 4.",
          "从 0 到 10 的数轴。从 0 跳 7 到达 7；再向右跳 3 到达 10，向左跳 3 到达 4。",
        ),
      ],
      generate(rng) {
        const m = rng.int(1, 15);
        let n = rng.int(1, 15);
        if (n === m) n = m === 15 ? 8 : m + 1;
        const op = rng.pick(["+", "-"]);
        const greatest = rng.bool();
        const target = `|a ${op} b|`;
        const answer = greatest ? m + n : Math.abs(m - n);
        const [far, near] = op === "+" ? [n, -n] : [-n, n];
        const reach = (b: number) =>
          op === "+"
            ? chain(`|${m} + ${paren(b)}|`, `|${m + b}|`, `${Math.abs(m + b)}`)
            : chain(`|${m} - ${paren(b)}|`, `|${m - b}|`, `${Math.abs(m - b)}`);
        const signs = t(
          `Since $|a| = ${m}$, the number $a$ is $${m}$ or $${-m}$; since $|b| = ${n}$, the number $b$ is $${n}$ or $${-n}$. Changing both signs at once changes only the sign of $a ${op} b$, so we may take $a = ${m}$.`,
          `因为 $|a| = ${m}$，$a$ 是 $${m}$ 或 $${-m}$；因为 $|b| = ${n}$，$b$ 是 $${n}$ 或 $${-n}$。两个符号同时改变，只会改变 $a ${op} b$ 的符号，所以可以取 $a = ${m}$。`,
        );
        return numberProblem({
          prompt: t(
            `Given that $|a| = ${m}$ and $|b| = ${n}$, find the ${greatest ? "greatest" : "least"} possible value of $${target}$.`,
            `已知 $|a| = ${m}$，$|b| = ${n}$，求 $${target}$ 可能取到的${greatest ? "最大" : "最小"}值。`,
          ),
          answer,
          wrong: greatest ? [Math.abs(m - n), m * n] : [m - n, n - m, m + n, 0],
          solution: greatest
            ? t(
                `${signs.en}

**Step 1: make the sizes add.** $|a ${op} b|$ is greatest when $a$ and $${op === "+" ? "b" : "-b"}$ point the same way, so take $b = ${far}$:${steps(reach(far))}**Step 2: nothing is larger.** The two sizes $${m}$ and $${n}$ can at most add up, so the greatest value is $${m} + ${n} = ${answer}$.

**Check.** The other choice, $b = ${near}$, gives $${reach(near)}$, which is smaller.`,
                `${signs["zh-CN"]}

**第一步：让大小相加。** 当 $a$ 与 $${op === "+" ? "b" : "-b"}$ 方向相同时 $|a ${op} b|$ 最大，所以取 $b = ${far}$：${steps(reach(far))}**第二步：不可能更大。** 两个大小 $${m}$ 和 $${n}$ 最多只能相加，所以最大值是 $${m} + ${n} = ${answer}$。

**检验。** 另一种选择 $b = ${near}$ 得 $${reach(near)}$，比它小。`,
              )
            : t(
                `${signs.en}

**Step 1: make the sizes cancel.** $|a ${op} b|$ is least when $a$ and $${op === "+" ? "b" : "-b"}$ point opposite ways, so take $b = ${near}$:${steps(reach(near))}**Step 2: nothing is smaller.** The smaller size, $${Math.min(m, n)}$, can cancel at most that much of the larger, $${Math.max(m, n)}$, so the least value is $${Math.max(m, n)} - ${Math.min(m, n)} = ${answer}$.

**Check.** The other choice, $b = ${far}$, gives $${reach(far)}$, which is larger.`,
                `${signs["zh-CN"]}

**第一步：让大小抵消。** 当 $a$ 与 $${op === "+" ? "b" : "-b"}$ 方向相反时 $|a ${op} b|$ 最小，所以取 $b = ${near}$：${steps(reach(near))}**第二步：不可能更小。** 较小的大小 $${Math.min(m, n)}$ 最多只能抵消较大的 $${Math.max(m, n)}$ 中的这么多，所以最小值是 $${Math.max(m, n)} - ${Math.min(m, n)} = ${answer}$。

**检验。** 另一种选择 $b = ${far}$ 得 $${reach(far)}$，比它大。`,
              ),
        });
      },
    },
    {
      id: "removing-absolute-value-bars",
      title: t("Removing the bars", "去掉绝对值符号"),
      explanation: t(
        `The bars leave a number that is not negative alone and change the sign of a negative one:

$$|u| = u \\text{ when } u \\ge 0, \\qquad |u| = -u \\text{ when } u < 0.$$

So when we know the sign of the inside, the bars can be replaced by parentheses, with a minus sign in front if the inside is negative.

If $x < 3$, then $x - 3$ is negative (try $x = 2$: $2 - 3 = -1$). So $|x - 3| = -(x - 3) = 3 - x$, and

$$|x - 3| + 2x = 3 - x + 2x = x + 3.$$

Check with $x = 2$: $|2 - 3| + 4 = 5$, and $2 + 3 = 5$.

> **Watch out.** When the inside is negative, the minus sign changes **every** term inside: $-(x - 3)$ is $-x + 3$, not $-x - 3$. Decide the sign from the condition on $x$, not from the minus sign you can see: $x - 3$ looks like a subtraction, but it is positive when $x > 3$.`,
        `绝对值对不是负数的数不起作用，对负数则改变符号：

$$u \\ge 0 \\text{ 时 } |u| = u, \\qquad u < 0 \\text{ 时 } |u| = -u.$$

所以知道里面的符号时，可以把绝对值符号换成括号；如果里面是负数，括号前要加负号。

若 $x < 3$，则 $x - 3$ 是负数（取 $x = 2$ 试试：$2 - 3 = -1$）。所以 $|x - 3| = -(x - 3) = 3 - x$，于是

$$|x - 3| + 2x = 3 - x + 2x = x + 3.$$

用 $x = 2$ 检验：$|2 - 3| + 4 = 5$，而 $2 + 3 = 5$。

> **注意。** 里面是负数时，负号要改变里面的**每一项**：$-(x - 3)$ 是 $-x + 3$，不是 $-x - 3$。符号要根据 $x$ 的条件判断，而不是看见减号就以为是负的：$x - 3$ 看起来是减法，但 $x > 3$ 时它是正数。`,
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
        const test = above ? p + 1 : p - 1;
        const tq = Q.of(test);
        const innerAt = m * test + b;
        const original = absAt(Q.one, 0, Q.of(k * test + d), Q.of(innerAt)).toNumber();
        const rest = `${tail(k * test)}${tail(d)}`;
        const leftAt = chain(`${bars(`${subst(m, tq)}${tail(b)}`)}${rest}`, `${Math.abs(innerAt)}${rest}`);
        const work = steps(`${expr} = ${poly([1, `(${removed})`], [k, "x"], [d, ""])}`, `= ${answer}`);
        return expressionProblem({
          prompt: t(
            `Given that $${cond}$, write $${expr}$ without absolute value bars and simplify.`,
            `已知 $${cond}$，去掉 $${expr}$ 中的绝对值符号并化简。`,
          ),
          answer,
          simplified: true,
          wrong: [linear(-s * m + k, -s * b + d), linear(s * m + k, b + d), linear(s * m + k, -b + d)],
          solution: t(
            `**Step 1: the sign of the inside.** $${inner}$ is $0$ at $x = ${p}$, and for $${cond}$ it is ${s > 0 ? "positive" : "negative"}: at $x = ${test}$, for instance, it is $${lineAt(m, b, tq)}$.

**Step 2: remove the bars.** ${s > 0 ? `A positive number is its own absolute value, so $${bars(inner)} = ${removed}$.` : `The absolute value of a negative number is its opposite, so every term inside changes sign: $${bars(inner)} = -(${inner}) = ${removed}$.`}

**Step 3: simplify** by collecting the $x$-terms and the numbers:${work}**Check.** At $x = ${test}$ the original expression is $${leftAt} = ${original}$, and $${answer}$ gives $${lineAt(s * m + k, s * b + d, tq)}$.`,
            `**第一步：判断里面的符号。** $${inner}$ 在 $x = ${p}$ 时为 $0$，当 $${cond}$ 时它是${s > 0 ? "正" : "负"}数：例如 $x = ${test}$ 时，它等于 $${lineAt(m, b, tq)}$。

**第二步：去掉绝对值符号。** ${s > 0 ? `正数的绝对值是它本身，所以 $${bars(inner)} = ${removed}$。` : `负数的绝对值是它的相反数，所以里面每一项都变号：$${bars(inner)} = -(${inner}) = ${removed}$。`}

**第三步：化简**，合并含 $x$ 的项和常数：${work}**检验。** 当 $x = ${test}$ 时，原式等于 $${leftAt} = ${original}$，而 $${answer}$ 等于 $${lineAt(s * m + k, s * b + d, tq)}$。`,
          ),
        });
      },
    },
  ],
};

/** checkSolutions puts each solution of |Ax + B| = c back into the left side, as the check of a solution. */
function checkSolutions(A: number, B: number, xs: readonly Q[], c: Coefficient): Text {
  const each = sortQ(dedupe(xs));
  const work = steps(...each.map((x) => absCheck(A, B, x)));
  const one = each.length === 1;
  return t(
    `**Check.** Put ${one ? "the solution" : "each solution"} back into the left side:${work}${one ? "It gives" : "Each gives"} $${num(c)}$, the right side.`,
    `**检验。** 把${one ? "这个解" : "每个解"}代回左边：${work}${one ? "结果" : "结果都"}等于右边的 $${num(c)}$。`,
  );
}

/** solutionsAre states the solutions found. */
function solutionsAre(xs: readonly Q[]): Text {
  const st = solsText(xs);
  const one = dedupe(xs).length === 1;
  return t(`So ${one ? "the only solution is" : "the solutions are"} ${st.en}.`, `所以${one ? "方程只有一个解" : "方程的解是"} ${st.zh}。`);
}

/** onlyZero solves |ax + b| = 0, which holds only when ax + b = 0, as the steps of a solution. */
function onlyZero(a: number, b: number, n: number): Text {
  const L = linear(a, b);
  const r = Q.of(-b, a);
  const lines = [
    `${L} = 0`,
    ...(b !== 0 && a !== 1 ? [`${poly([a, "x"])} = ${-b}`] : []),
    ...(a === 1 && b === 0 ? [] : [`x = ${r.toLatex()}`]),
  ];
  return t(
    `**Step ${n}: only $0$ is $0$ away from $0$.** So the inside itself must be $0$, and there is just one equation; to solve it, ${undoing(a, b).en}:${steps(...lines)}`,
    `**第${zhOrdinal(n)}步：只有 $0$ 到 $0$ 的距离是 $0$。** 所以里面本身必须等于 $0$，只有一个方程；解它时，${undoing(a, b)["zh-CN"]}：${steps(...lines)}`,
  );
}

/** absoluteValueEquations solves |ax + b| = c. */
export const absoluteValueEquations: TopicDef = {
  id: "absolute-value-equations",
  title: t("Absolute Value Equations", "绝对值方程"),
  summary: t(
    "Solve |ax + b| = c by splitting it into two linear equations, and recognize when there is one solution or none.",
    "把 |ax + b| = c 拆成两个一次方程求解，并识别只有一个解或无解的情形。",
  ),
  prerequisites: ["absolute-value-expressions", "two-step-equations"],
  encompasses: [{ topic: "two-step-equations", weight: 0.5 }],
  xp: 14,
  standards: ["CCSS.HSA.CED.A.1"],
  intro: t(
    `The absolute value of a number is its distance from $0$. So the equation $|x| = 5$ asks: which numbers are $5$ units from $0$? There are two, one on each side:

{{figure 0}}

$x = 5$ and $x = -5$. This is new: the equations we have solved so far had one solution, but an absolute value equation usually has two.

The same idea works when something more is inside the bars. In $|x + 2| = 5$, the number $x + 2$ is $5$ units from $0$, so $x + 2 = 5$ or $x + 2 = -5$. Each of these is an ordinary equation we already know how to solve, and they give $x = 3$ and $x = -7$.

In this lesson we split absolute value equations into two equations like this, solve them, and check the answers. We also see what happens when the right side is $0$ or negative.`,
    `一个数的绝对值是它到 $0$ 的距离。所以方程 $|x| = 5$ 问的是：哪些数到 $0$ 的距离是 $5$？有两个，两边各一个：

{{figure 0}}

$x = 5$ 和 $x = -5$。这是新情况：以前解的方程只有一个解，而绝对值方程通常有两个解。

绝对值符号里有更多内容时，道理一样。在 $|x + 2| = 5$ 中，$x + 2$ 这个数到 $0$ 的距离是 $5$，所以 $x + 2 = 5$ 或 $x + 2 = -5$。这两个都是我们会解的普通方程，分别得到 $x = 3$ 和 $x = -7$。

这节课我们把绝对值方程这样拆成两个方程，分别求解并检验答案。我们还会看到右边是 $0$ 或负数时会发生什么。`,
  ),
  introFigures: [
    drawing(
      [...lineMarks(-6, 6), ...hop(6, 11, "5", 0, "accent"), ...hop(6, 1, "5", 0, "accent"), spot(1), spot(11)],
      "A number line from −6 to 6. Jumps of 5 from 0 reach −5 on the left and 5 on the right; both are marked.",
      "从 −6 到 6 的数轴。从 0 向左跳 5 到达 −5，向右跳 5 到达 5，两个点都标出。",
    ),
  ],
  knowledgePoints: [
    {
      id: "solving-simple-absolute-value-equations",
      title: t("Equations like |x + b| = c", "形如 |x + b| = c 的方程"),
      explanation: t(
        `When $c > 0$, the equation $|u| = c$ says that $u$ is $c$ units from $0$. Exactly two numbers are, $c$ and $-c$, so

$$|u| = c \\quad\\text{means}\\quad u = c \\;\\text{ or }\\; u = -c.$$

To solve $|x + 2| = 5$, split it and solve each equation by subtracting $2$:

$$x + 2 = 5 \\;\\text{ or }\\; x + 2 = -5$$

$$x = 3 \\;\\text{ or }\\; x = -7$$

Both work: $|3 + 2| = |5| = 5$ and $|-7 + 2| = |-5| = 5$.

> **Watch out.** The second equation is $x + 2 = -5$: only the right side changes sign, and the $+2$ is undone by subtracting $2$ in **both** equations. Writing $x = 5$ or $x = -5$ forgets the $2$ altogether, and stopping after $x = 3$ loses the second solution.`,
        `当 $c > 0$ 时，方程 $|u| = c$ 表示 $u$ 到 $0$ 的距离是 $c$。恰好有两个数满足，$c$ 和 $-c$，所以

$$|u| = c \\quad\\text{表示}\\quad u = c \\;\\text{ 或 }\\; u = -c.$$

解 $|x + 2| = 5$ 时，先拆开，再分别两边减去 $2$：

$$x + 2 = 5 \\;\\text{ 或 }\\; x + 2 = -5$$

$$x = 3 \\;\\text{ 或 }\\; x = -7$$

两个都成立：$|3 + 2| = |5| = 5$，$|-7 + 2| = |-5| = 5$。

> **注意。** 第二个方程是 $x + 2 = -5$：只有右边变号，$+2$ 在**两个**方程里都要通过减去 $2$ 来消去。写成 $x = 5$ 或 $x = -5$ 就把 $2$ 忘了；只写出 $x = 3$ 就漏掉了第二个解。`,
      ),
      generate(rng) {
        const b = rng.int(-9, 9);
        const c = rng.int(1, 12);
        const L = linear(1, b);
        const x = solveAbs(1, b, c);
        const work = splitAndSolve(1, b, c);
        const so = solutionsAre(x);
        const check = checkSolutions(1, b, x, c);
        return solutionsProblem({
          prompt: solveText(`${bars(L)} = ${c}`, listSolutions),
          values: sols(x),
          wrong: [[String(b + c), String(b - c)], [String(c - b)], [String(c), String(-c)]],
          solution: t(`${work.en}${so.en}\n\n${check.en}`, `${work["zh-CN"]}${so["zh-CN"]}\n\n${check["zh-CN"]}`),
        });
      },
    },
    {
      id: "solving-absolute-value-equations-with-coefficients",
      title: t("Equations like |ax + b| = c", "形如 |ax + b| = c 的方程"),
      explanation: t(
        `A coefficient inside the bars changes nothing about the split: the whole inside, $ax + b$, is $c$ or $-c$. Each case is then a two-step equation. For $|3x - 1| = 8$:

$$3x - 1 = 8 \\;\\text{ or }\\; 3x - 1 = -8$$

Add $1$ to both sides of each, then divide by $3$:

$$3x = 9 \\;\\text{ or }\\; 3x = -7$$

$$x = 3 \\;\\text{ or }\\; x = -\\frac{7}{3}$$

Check the second: $\\left|3\\left(-\\frac{7}{3}\\right) - 1\\right| = |-7 - 1| = 8$.

> **Watch out.** The two solutions are usually **not** opposites: here they are $3$ and $-\\frac{7}{3}$, not $3$ and $-3$. Solve the second equation on its own instead of guessing it from the first. Undo the $-1$ before dividing, and undo it by adding $1$; adding the wrong way gives $\\frac{8 - 1}{3}$ and $\\frac{-8 - 1}{3}$ instead.`,
        `绝对值符号里有系数，拆分方法不变：整个里面 $ax + b$ 等于 $c$ 或 $-c$。每种情况都是一个两步方程。对 $|3x - 1| = 8$：

$$3x - 1 = 8 \\;\\text{ 或 }\\; 3x - 1 = -8$$

两个方程都先两边加 $1$，再除以 $3$：

$$3x = 9 \\;\\text{ 或 }\\; 3x = -7$$

$$x = 3 \\;\\text{ 或 }\\; x = -\\frac{7}{3}$$

检验第二个：$\\left|3\\left(-\\frac{7}{3}\\right) - 1\\right| = |-7 - 1| = 8$。

> **注意。** 两个解通常**不**互为相反数：这里是 $3$ 和 $-\\frac{7}{3}$，不是 $3$ 和 $-3$。第二个方程要单独去解，不能由第一个猜出来。先消去 $-1$ 再除，而且要通过加 $1$ 来消去；方向弄反就会得到 $\\frac{8 - 1}{3}$ 和 $\\frac{-8 - 1}{3}$。`,
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const a = rng.sign() * rng.int(2, 6);
        const b = rng.nonZero(-12, 12);
        const c = rng.int(1, 15);
        const L = linear(a, b);
        const x = solveAbs(a, b, c);
        const first = x[0]!;
        const work = splitAndSolve(a, b, c);
        const so = solutionsAre(x);
        const check = checkSolutions(a, b, x, c);
        return solutionsProblem({
          prompt: solveText(`${bars(L)} = ${c}`, listSolutions),
          values: sols(x),
          wrong: [[first.toLatex()], sols([first, first.neg()]), sols([Q.of(c + b, a), Q.of(-c + b, a)])],
          solution: t(`${work.en}${so.en}\n\n${check.en}`, `${work["zh-CN"]}${so["zh-CN"]}\n\n${check["zh-CN"]}`),
        });
      },
    },
    {
      id: "zero-and-negative-right-sides",
      title: t("One solution or none", "只有一个解或无解"),
      explanation: t(
        `The split into two equations needs $c > 0$. The other cases are decided by what distance means.

A distance is never negative, so $|u| = c$ has **no solution** when $c < 0$. For example $|2x + 7| = -3$ has none: whatever $x$ is, the left side is $0$ or more.

Only $0$ is $0$ units from $0$, so $|u| = 0$ means $u = 0$, and there is **one solution**:

$$|2x + 7| = 0 \\;\\Rightarrow\\; 2x + 7 = 0 \\;\\Rightarrow\\; x = -\\frac{7}{2}$$

> **Watch out.** Do not drop the minus sign and solve $|2x + 7| = 3$ instead: a negative right side means no solution at all, written $\\varnothing$. And when the right side is $0$, the equations $u = 0$ and $u = -0$ are the same, so there is one solution, not two opposite ones.`,
        `拆成两个方程需要 $c > 0$。其他情况由距离的含义决定。

距离不会是负数，所以当 $c < 0$ 时 $|u| = c$ **无解**。例如 $|2x + 7| = -3$ 无解：无论 $x$ 是多少，左边都大于或等于 $0$。

只有 $0$ 到 $0$ 的距离是 $0$，所以 $|u| = 0$ 表示 $u = 0$，方程只有**一个解**：

$$|2x + 7| = 0 \\;\\Rightarrow\\; 2x + 7 = 0 \\;\\Rightarrow\\; x = -\\frac{7}{2}$$

> **注意。** 不要丢掉负号去解 $|2x + 7| = 3$：右边是负数就说明根本无解，记作 $\\varnothing$。右边是 $0$ 时，$u = 0$ 和 $u = -0$ 是同一个方程，所以只有一个解，不是两个互为相反数的解。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-12, 12);
        const L = linear(a, b);
        if (rng.bool()) {
          const r = Q.of(-b, a);
          const work = onlyZero(a, b, 1);
          const check = checkSolutions(a, b, [r], 0);
          return solutionsProblem({
            prompt: solveText(`${bars(L)} = 0`, listSolutions),
            values: [r.toLatex()],
            wrong: [sols([r, r.neg()]), [], [r.neg().toLatex()]],
            solution: t(
              `${work.en}There is one solution, $x = ${r.toLatex()}$.\n\n${check.en}`,
              `${work["zh-CN"]}方程只有一个解 $x = ${r.toLatex()}$。\n\n${check["zh-CN"]}`,
            ),
          });
        }
        const c = -rng.int(1, 12);
        return solutionsProblem({
          prompt: solveText(`${bars(L)} = ${c}`, listSolutions),
          values: [],
          wrong: [sols(solveAbs(a, b, -c)), [Q.of(c - b, a).toLatex()]],
          solution: t(
            `**Step 1: the left side is never negative.** $${bars(L)}$ is the distance of $${L}$ from $0$, so $${bars(L)} \\ge 0$ for every $x$.

**Step 2: compare with the right side.** The right side, $${c}$, is negative, so no value of $x$ makes the two sides equal. There is no solution: $\\varnothing$.

**Check.** Try a number, for example $x = 1$: $${absCheck(a, b, Q.one)}$, which is not $${c}$. Whatever we try, the absolute value comes out $0$ or more.`,
            `**第一步：左边不会是负数。** $${bars(L)}$ 是 $${L}$ 到 $0$ 的距离，所以对每个 $x$ 都有 $${bars(L)} \\ge 0$。

**第二步：和右边比较。** 右边 $${c}$ 是负数，所以没有哪个 $x$ 能让两边相等。方程无解：$\\varnothing$。

**检验。** 取一个数试试，例如 $x = 1$：$${absCheck(a, b, Q.one)}$，不是 $${c}$。无论取什么数，绝对值都大于或等于 $0$。`,
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
  return { a, b, k, d, e, L, lhs, eq: `${lhs} = ${e}`, iso: steps(`${lhs} = ${e}`, `${k}${bars(L)} = ${e - d}`, `${bars(L)} = ${c}`) };
}

/** isolateStep writes the first step of solving k|ax + b| + d = e: getting the absolute value alone. */
function isolateStep(p: ReturnType<typeof isolated>): Text {
  const how = undoing(p.k, p.d);
  return t(
    `**Step 1: get the absolute value alone.** Treat $${bars(p.L)}$ as one unknown block and undo what is done to it: ${how.en}.${p.iso}`,
    `**第一步：把绝对值单独放在一边。** 把 $${bars(p.L)}$ 看成一个整体，消去作用在它上面的运算：${how["zh-CN"]}。${p.iso}`,
  );
}

/** isoCheck works out k|ax + b| + d at a number x. */
function isoCheck(p: { readonly a: number; readonly b: number; readonly k: number; readonly d: number }, x: Q): string {
  const v = Q.of(p.a).mul(x).add(Q.of(p.b));
  const V = v.abs();
  return chain(
    `${p.k}${bars(`${subst(p.a, x)}${tail(p.b)}`)}${tail(p.d)}`,
    `${p.k}${bars(v.toLatex())}${tail(p.d)}`,
    ...(V.isZero() ? [] : [`${p.k} \\cdot ${V.toLatex()}${tail(p.d)}`]),
    Q.of(p.k).mul(V).add(Q.of(p.d)).toLatex(),
  );
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
  intro: t(
    `We can solve $|ax + b| = c$ by splitting it into $ax + b = c$ or $ax + b = -c$. The split works because the right side, $c$, is the value of the absolute value.

In $2|x - 3| + 1 = 9$ that is no longer true: $9$ is the value of the whole left side, not of $|x - 3|$. But we can treat $|x - 3|$ as a single unknown block. If we call it $u$, the equation is $2u + 1 = 9$, a two-step equation, and $u = 4$. So $|x - 3| = 4$, which we know how to split.

In this lesson we first get the absolute value alone in this way, and see that only then can we tell whether there are two solutions, one or none. Then we solve equations with an absolute value on each side, such as $|2x - 1| = |x + 4|$.`,
    `我们会把 $|ax + b| = c$ 拆成 $ax + b = c$ 或 $ax + b = -c$ 来解。能这样拆，是因为右边的 $c$ 正是绝对值的值。

在 $2|x - 3| + 1 = 9$ 中就不是这样了：$9$ 是整个左边的值，而不是 $|x - 3|$ 的值。不过可以把 $|x - 3|$ 看成一个未知的整体。把它记作 $u$，方程就是 $2u + 1 = 9$，一个两步方程，得 $u = 4$。所以 $|x - 3| = 4$，这个我们会拆。

这节课我们先这样把绝对值单独放在一边，并看到只有这样做之后，才能判断方程有两个解、一个解还是无解。然后解两边都有绝对值的方程，比如 $|2x - 1| = |x + 4|$。`,
  ),
  knowledgePoints: [
    {
      id: "isolating-the-absolute-value",
      title: t("Isolating the absolute value", "先把绝对值单独放在一边"),
      explanation: t(
        `Before splitting, get the absolute value alone on one side. Undo the operations around it in the reverse order, as in a two-step equation: first the number added, then the factor in front.

$$2|x - 3| + 1 = 9$$

Subtract $1$ from both sides, then divide both sides by $2$:

$$2|x - 3| = 8 \\qquad |x - 3| = 4$$

Now split: $x - 3 = 4$ or $x - 3 = -4$, so $x = 7$ or $x = -1$. Check $x = -1$ in the original: $2|-1 - 3| + 1 = 2 \\cdot 4 + 1 = 9$.

> **Watch out.** Do not split too early. $|x - 3| = 9$ ignores the $2$ and the $1$; $|x - 3| = 8$ undoes the $1$ but forgets to divide by $2$. Splitting $2|x - 3| + 1 = 9$ directly into $2(x - 3) + 1 = \\pm 9$ happens to work here, but it breaks down as soon as the factor in front is negative. And both cases still need solving.`,
        `拆开之前，先把绝对值单独放在等号一边。像解两步方程那样，按相反的顺序消去它周围的运算：先消去加上的数，再消去前面的系数。

$$2|x - 3| + 1 = 9$$

两边同时减去 $1$，再两边同时除以 $2$：

$$2|x - 3| = 8 \\qquad |x - 3| = 4$$

现在拆开：$x - 3 = 4$ 或 $x - 3 = -4$，所以 $x = 7$ 或 $x = -1$。把 $x = -1$ 代回原方程检验：$2|-1 - 3| + 1 = 2 \\cdot 4 + 1 = 9$。

> **注意。** 不要过早拆开。写成 $|x - 3| = 9$ 是忽略了 $2$ 和 $1$；写成 $|x - 3| = 8$ 是消去了 $1$ 却忘了除以 $2$。直接把 $2|x - 3| + 1 = 9$ 拆成 $2(x - 3) + 1 = \\pm 9$ 在这里碰巧可行，但前面的系数一旦是负数就不成立了。两种情况也都要解完。`,
      ),
      generate(rng) {
        const c = rng.int(1, 10);
        const p = isolated(rng, c);
        const x = solveAbs(p.a, p.b, c);
        const work = splitAndSolve(p.a, p.b, c, 2);
        const so = solutionsAre(x);
        const checks = steps(...sortQ(x).map(isoCheck.bind(null, p)));
        return solutionsProblem({
          prompt: solveText(p.eq, listSolutions),
          values: sols(x),
          wrong: [sols(solveAbs(p.a, p.b, p.e)), sols(solveAbs(p.a, p.b, p.e - p.d)), [x[0]!.toLatex()]],
          solution: t(
            `${isolateStep(p).en}${work.en}${so.en}\n\n**Check.** Put each solution into the original left side, $${p.lhs}$:${checks}Each gives $${p.e}$.`,
            `${isolateStep(p)["zh-CN"]}${work["zh-CN"]}${so["zh-CN"]}\n\n**检验。** 把每个解代入原方程的左边 $${p.lhs}$：${checks}结果都等于 $${p.e}$。`,
          ),
        });
      },
    },
    {
      id: "isolated-values-that-are-not-positive",
      title: t("When the isolated value is not positive", "单独放置后右边不是正数"),
      explanation: t(
        `Only after isolating can we see whether the equation has solutions, because only then is the right side the value of the absolute value. In

$$-3|x + 2| + 4 = 10$$

subtract $4$ and divide by $-3$:

$$-3|x + 2| = 6 \\qquad |x + 2| = -2$$

A distance cannot be $-2$, so there is no solution. The original shows why: $-3|x + 2|$ is never positive, so the left side is never more than $4$, and it cannot reach $10$. If the isolated value is $0$, the inside must be $0$, and there is exactly one solution.

> **Watch out.** The right side of the original equation says nothing yet: $10$ is positive, but there is still no solution. And when dividing by a negative factor, keep its sign; $|x + 2| = 2$ would give two false solutions. When the isolated value is $0$, write one solution, not two.`,
        `只有把绝对值单独放好后，才能判断方程是否有解，因为这时右边才是绝对值的值。在

$$-3|x + 2| + 4 = 10$$

中，两边减去 $4$，再除以 $-3$：

$$-3|x + 2| = 6 \\qquad |x + 2| = -2$$

距离不可能是 $-2$，所以方程无解。看原方程也能明白：$-3|x + 2|$ 从不是正数，所以左边从不超过 $4$，不可能等于 $10$。如果单独放置后右边是 $0$，里面必须等于 $0$，方程恰有一个解。

> **注意。** 原方程的右边还说明不了什么：$10$ 是正数，但方程仍然无解。除以负的系数时要保留它的符号；写成 $|x + 2| = 2$ 会得到两个假的解。单独放置后右边是 $0$ 时，只写一个解，不是两个。`,
      ),
      generate(rng) {
        const c = rng.bool(0.3) ? 0 : -rng.int(1, 8);
        const p = isolated(rng, c);
        const x = solveAbs(p.a, p.b, c);
        const iso = isolateStep(p);
        if (c === 0) {
          const r = x[0]!;
          const work = onlyZero(p.a, p.b, 2);
          return solutionsProblem({
            prompt: solveText(p.eq, listSolutions),
            values: sols(x),
            wrong: [[], sols([r, r.neg()]), sols(solveAbs(p.a, p.b, Math.abs(p.e)))],
            solution: t(
              `${iso.en}${work.en}There is one solution, $x = ${r.toLatex()}$.\n\n**Check.** In the original left side: $${isoCheck(p, r)}$, the right side.`,
              `${iso["zh-CN"]}${work["zh-CN"]}方程只有一个解 $x = ${r.toLatex()}$。\n\n**检验。** 代入原方程左边：$${isoCheck(p, r)}$，等于右边。`,
            ),
          });
        }
        const up = p.k > 0;
        return solutionsProblem({
          prompt: solveText(p.eq, listSolutions),
          values: sols(x),
          wrong: [sols(solveAbs(p.a, p.b, -c)), sols(solveAbs(p.a, p.b, Math.abs(p.e)))],
          solution: t(
            `${iso.en}**Step 2: compare.** An absolute value is a distance and is never negative, so it cannot equal $${c}$. There is no solution: $\\varnothing$.

**Check.** Look at the original equation. Since $${bars(p.L)} \\ge 0$ and $${p.k}$ is ${up ? "positive" : "negative"}, the term $${p.k}${bars(p.L)}$ is never ${up ? "negative" : "positive"}, so the left side is always ${up ? "at least" : "at most"} $${p.d}$. The right side, $${p.e}$, is ${up ? "less" : "greater"} than $${p.d}$, so the two sides can never be equal.`,
            `${iso["zh-CN"]}**第二步：比较。** 绝对值是距离，不会是负数，所以它不可能等于 $${c}$。方程无解：$\\varnothing$。

**检验。** 看原方程。因为 $${bars(p.L)} \\ge 0$，而 $${p.k}$ 是${up ? "正" : "负"}数，所以 $${p.k}${bars(p.L)}$ 从不是${up ? "负" : "正"}数，左边总是${up ? "大于或等于" : "小于或等于"} $${p.d}$。右边 $${p.e}$ 比 $${p.d}$ ${up ? "小" : "大"}，所以两边永远不会相等。`,
          ),
        });
      },
    },
    {
      id: "absolute-values-on-both-sides",
      title: t("Absolute values on both sides", "两边都有绝对值"),
      explanation: t(
        `Two numbers have the same absolute value exactly when they are the same distance from $0$: either they are equal, or they are opposites. So

$$|u| = |v| \\quad\\text{means}\\quad u = v \\;\\text{ or }\\; u = -v.$$

For $|2x - 1| = |x + 4|$:

$$2x - 1 = x + 4 \\;\\text{ or }\\; 2x - 1 = -(x + 4)$$

The first gives $x = 5$. In the second, the minus sign reaches both terms, $2x - 1 = -x - 4$, so $3x = -3$ and $x = -1$. Check: $|2(-1) - 1| = |-3| = 3$ and $|-1 + 4| = |3| = 3$.

> **Watch out.** Put the second right side in parentheses: $-(x + 4)$ is $-x - 4$, not $-x + 4$. The two solutions are not opposites of each other, so solve the second equation instead of writing $x = -5$. And do not stop after the first case.`,
        `两个数的绝对值相等，当且仅当它们到 $0$ 的距离相同：要么相等，要么互为相反数。所以

$$|u| = |v| \\quad\\text{表示}\\quad u = v \\;\\text{ 或 }\\; u = -v.$$

对 $|2x - 1| = |x + 4|$：

$$2x - 1 = x + 4 \\;\\text{ 或 }\\; 2x - 1 = -(x + 4)$$

第一个得 $x = 5$。第二个中，负号作用到两项上，$2x - 1 = -x - 4$，所以 $3x = -3$，$x = -1$。检验：$|2(-1) - 1| = |-3| = 3$，$|-1 + 4| = |3| = 3$。

> **注意。** 第二个方程的右边要加括号：$-(x + 4)$ 是 $-x - 4$，不是 $-x + 4$。两个解不互为相反数，所以要解第二个方程，而不是直接写 $x = -5$。也不要解完第一种情况就停下。`,
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        const a = rng.int(1, 5);
        let c = rng.sign() * rng.int(1, 5);
        if (Math.abs(c) === a) c = c > 0 ? c + 1 : c - 1;
        const b = rng.nonZero(-9, 9);
        let d = rng.nonZero(-9, 9);
        // When da = bc both insides vanish at the same x and the two cases give one solution, which is listed among the wrong answers.
        while (d === 0 || d * a === b * c) d = d >= 9 ? -9 : d + 1;
        const L = linear(a, b);
        const R = linear(c, d);
        const x1 = Q.of(d - b, a - c);
        const x2 = Q.of(-d - b, a + c);
        const cs = caseLines(L, R, `-(${R})`);
        const solveCase = (p: number, q: number, x: Q, rhs: string) =>
          steps(`${L} = ${rhs}`, `${poly([p, "x"])} = ${q}`, ...(p === 1 ? [] : [`x = ${x.toLatex()}`]));
        const first = solveCase(a - c, d - b, x1, R);
        const second = solveCase(a + c, -d - b, x2, linear(-c, -d));
        const so = solutionsAre([x1, x2]);
        const checkLines = (at: (x: string) => string) =>
          sortQ([x1, x2])
            .map((x) => `${at(x.toLatex())}${steps(absCheck(a, b, x), absCheck(c, d, x))}`)
            .join("");
        return solutionsProblem({
          prompt: solveText(`${bars(L)} = ${bars(R)}`, listSolutions),
          values: sols([x1, x2]),
          wrong: [[x1.toLatex()], sols([x1, x1.neg()]), sols([x1, Q.of(d - b, a + c)])],
          solution: t(
            `**Step 1: split.** The insides are equal or opposite:${cs.en}**Step 2: the first case.** Collect the $x$-terms on the left and the numbers on the right:${first}**Step 3: the second case.** Let the minus sign reach every term of $${R}$, then collect as before:${second}${so.en}

**Check.** Work out both sides at each solution.\n\n${checkLines((x) => `At $x = ${x}$:`)}At each solution the two sides agree.`,
            `**第一步：拆开。** 两边里面相等或互为相反数：${cs.zh}**第二步：第一种情况。** 把含 $x$ 的项移到左边，常数移到右边：${first}**第三步：第二种情况。** 让负号作用到 $${R}$ 的每一项，再同样移项：${second}${so["zh-CN"]}

**检验。** 在每个解处分别算两边。\n\n${checkLines((x) => `当 $x = ${x}$ 时：`)}每个解处两边都相等。`,
          ),
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

/** twoCases writes the split of |Ax + B| = cx + d and the solving of each case, as the first three steps of a solution. */
function twoCases(p: AbsLinear): Text {
  const { A, B, c, d } = p;
  const [x1, x2] = p.cands;
  const cs = casesWork(p);
  const solve = (k: number, r: number, x: Q, rhs: string) =>
    steps(`${p.L} = ${rhs}`, `${poly([k, "x"])} = ${r}`, ...(k === 1 ? [] : [`x = ${x.toLatex()}`]));
  const first = solve(A - c, d - B, x1, p.R);
  const second = solve(A + c, -d - B, x2, linear(-c, -d));
  return t(
    `**Step 1: split.** The inside of the bars equals the right side or its opposite, and the opposite needs parentheses:${cs.en}**Step 2: the first case.** Collect the $x$-terms on the left and the numbers on the right:${first}**Step 3: the second case.** The minus sign reaches every term of $${p.R}$; then collect as before:${second}`,
    `**第一步：拆开。** 绝对值里面等于右边或右边的相反数，相反数要加括号：${cs.zh}**第二步：第一种情况。** 把含 $x$ 的项移到左边，常数移到右边：${first}**第三步：第二种情况。** 负号作用到 $${p.R}$ 的每一项，再同样移项：${second}`,
  );
}

/** checkLine works out both sides of |Ax + B| = cx + d at a candidate. */
function checkLine(p: AbsLinear, x: Q): Text {
  const left = absCheck(p.A, p.B, x);
  const right = lineAt(p.c, p.d, x);
  return t(
    `At $x = ${x.toLatex()}$:${steps(`\\text{left: } ${left}`, `\\text{right: } ${right}`)}`,
    `当 $x = ${x.toLatex()}$ 时：${steps(`\\text{左边：} ${left}`, `\\text{右边：} ${right}`)}`,
  );
}

/** rightAt is cx + d at x. */
const rightAt = (p: AbsLinear, x: Q) => Q.of(p.c).mul(x).add(Q.of(p.d));

/** verdict says whether a candidate solves |Ax + B| = cx + d, and why not when it does not. */
function verdict(p: AbsLinear, x: Q): Text {
  const r = rightAt(p, x);
  const X = x.toLatex();
  if (r.sign() >= 0) return t(`The sides agree, so $x = ${X}$ is a solution.`, `两边相等，所以 $x = ${X}$ 是解。`);
  return t(
    `The right side is $${r.toLatex()}$, a negative number, which no absolute value can equal, so $x = ${X}$ is extraneous.`,
    `右边是负数 $${r.toLatex()}$，绝对值不可能等于负数，所以 $x = ${X}$ 是增根。`,
  );
}

const vOf = (A: number, B: number) => (x: number) => Math.abs(A * x + B);

/** equationsConnectingAbsoluteValueAndLinearFunctions solves |ax + b| = cx + d by cases. */
export const equationsConnectingAbsoluteValueAndLinearFunctions: TopicDef = {
  id: "equations-connecting-absolute-value-and-linear-functions",
  title: t("Equations Connecting Absolute Value and Linear Functions", "绝对值与一次函数相等的方程"),
  summary: t(
    "Solve equations |ax + b| = cx + d by writing the two cases and solving each as a linear equation.",
    "解形如 |ax + b| = cx + d 的方程：写出两种情况，分别按一次方程求解。",
  ),
  prerequisites: ["further-absolute-value-equations"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSA.REI.A.1"],
  intro: t(
    `So far the right side of an absolute value equation has been a number, as in $|2x - 1| = 9$, or another absolute value. Now it may contain $x$, as in

$$|2x - 1| = x + 4.$$

A picture shows what such an equation asks. The left side is the V-shaped graph of $y = |2x - 1|$ and the right side is the line $y = x + 4$. A solution is an $x$ where the two have the same height, that is, where they cross:

{{figure 0}}

They cross twice, at $x = -1$ and at $x = 5$. To find these without a drawing, we split the equation as before: $2x - 1$ equals the right side or its opposite. The difference is that the right side is now an expression, so each case is an equation with $x$ on both sides, which we already know how to solve.

In this lesson we write the two cases, solve them, and check a number by putting it into both sides.`,
    `到目前为止，绝对值方程的右边是一个数，比如 $|2x - 1| = 9$，或者是另一个绝对值。现在右边可以含有 $x$，比如

$$|2x - 1| = x + 4.$$

画图可以看出这样的方程在问什么。左边是 $y = |2x - 1|$ 的 V 形图象，右边是直线 $y = x + 4$。方程的解就是两者高度相同的 $x$，也就是它们的交点：

{{figure 0}}

它们相交两次，在 $x = -1$ 和 $x = 5$ 处。不画图也能求出：像以前一样拆开方程，$2x - 1$ 等于右边或右边的相反数。不同的是右边现在是一个式子，所以每种情况都是两边都有 $x$ 的方程，这我们已经会解。

这节课我们写出两种情况，分别求解，并把一个数代入两边来检验。`,
  ),
  introFigures: [
    graphFigure(
      viewAround([
        [-1, 3],
        [5, 9],
      ]),
      [
        { kind: "curve", f: vOf(2, -1), accent: true },
        { kind: "line", a: [0, 4], b: [1, 5], tone: "action" },
        { kind: "point", at: [-1, 3], label: "(−1, 3)", dir: "w", accent: true },
        { kind: "point", at: [5, 9], label: "(5, 9)", dir: "e", accent: true },
      ],
      "The V-shaped graph of y = |2x − 1| and the line y = x + 4, crossing at (−1, 3) and (5, 9).",
      "y = |2x − 1| 的 V 形图象与直线 y = x + 4，交于 (−1, 3) 和 (5, 9)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "writing-the-two-cases",
      title: t("Writing the two cases", "写出两种情况"),
      explanation: t(
        `When the right side contains $x$, split $|u| = v$ exactly as before: $u = v$ or $u = -v$. In the second case the **whole** right side changes sign, so write it in parentheses first:

$$|2x - 1| = x + 4 \\quad\\Rightarrow\\quad 2x - 1 = x + 4 \\;\\text{ or }\\; 2x - 1 = -(x + 4)$$

Expanding the parentheses, the second case is $2x - 1 = -x - 4$.

> **Watch out.** Writing $2x - 1 = -x + 4$ changes the sign of only one term of the right side. The left side stays as it is in both cases; it is the right side that changes sign, not $2x - 1$. And a single equation is not enough: there are always two cases to write.`,
        `右边含有 $x$ 时，仍然把 $|u| = v$ 拆成 $u = v$ 或 $u = -v$。第二种情况中**整个**右边都要变号，所以先给它加上括号：

$$|2x - 1| = x + 4 \\quad\\Rightarrow\\quad 2x - 1 = x + 4 \\;\\text{ 或 }\\; 2x - 1 = -(x + 4)$$

去掉括号，第二种情况是 $2x - 1 = -x - 4$。

> **注意。** 写成 $2x - 1 = -x + 4$ 只改变了右边一项的符号。两种情况中左边都不变；变号的是右边，不是 $2x - 1$。只写一个方程也不够：总要写出两种情况。`,
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
        const i = p.valid[1] ? 1 : 0;
        const x = p.cands[i];
        const caseEq = i === 0 ? `${p.L} = ${p.R}` : `${p.L} = -(${p.R})`;
        const r = rightAt(p, x);
        const caseAt =
          i === 0
            ? lineAt(p.c, p.d, x)
            : `${r.isInteger() ? `-(${r.toLatex()})` : `-\\left(${r.toLatex()}\\right)`} = ${r.neg().toLatex()}`;
        const inside = lineAt(p.A, p.B, x);
        return choiceProblem({
          prompt: t(
            `Which pair of equations should you solve to solve $${bars(p.L)} = ${p.R}$?`,
            `解方程 $${bars(p.L)} = ${p.R}$ 时，应该解哪一组方程？`,
          ),
          options: order.map((k) => options[k]!),
          correct: order.indexOf(0),
          solution: t(
            `**Step 1: two cases.** $${bars(p.L)} = ${p.R}$ says that $${p.L}$ is $${p.R}$ units from $0$, so $${p.L}$ is $${p.R}$ or its opposite.

**Step 2: the opposite of the whole right side.** The opposite of $${p.R}$ is $-(${p.R}) = ${linear(-p.c, -p.d)}$, with both terms changed. So the pair is $${p.L} = ${p.R}$ or $${p.L} = -(${p.R})$.

**Check.** One solution of the equation is $x = ${x.toLatex()}$: there $${bars(p.L)} = ${absCheck(p.A, p.B, x)}$ and $${p.R} = ${lineAt(p.c, p.d, x)}$. It solves the ${i === 0 ? "first" : "second"} equation of the pair, $${caseEq}$: the left side is $${inside}$ and the right side is $${caseAt}$.`,
            `**第一步：两种情况。** $${bars(p.L)} = ${p.R}$ 表示 $${p.L}$ 到 $0$ 的距离是 $${p.R}$，所以 $${p.L}$ 等于 $${p.R}$ 或它的相反数。

**第二步：整个右边的相反数。** $${p.R}$ 的相反数是 $-(${p.R}) = ${linear(-p.c, -p.d)}$，两项都变了号。所以这一组是 $${p.L} = ${p.R}$ 或 $${p.L} = -(${p.R})$。

**检验。** 方程的一个解是 $x = ${x.toLatex()}$：此时 $${bars(p.L)} = ${absCheck(p.A, p.B, x)}$，$${p.R} = ${lineAt(p.c, p.d, x)}$。它满足这一组中的${i === 0 ? "第一个" : "第二个"}方程 $${caseEq}$：左边是 $${inside}$，右边是 $${caseAt}$。`,
          ),
        });
      },
    },
    {
      id: "solving-by-cases",
      title: t("Solving by cases", "分情况求解"),
      explanation: t(
        `Each case is a linear equation with $x$ on both sides: collect the $x$-terms on one side and the numbers on the other. For $|2x - 1| = x + 4$:

$$2x - 1 = x + 4 \\quad\\Rightarrow\\quad x = 5$$

$$2x - 1 = -x - 4 \\quad\\Rightarrow\\quad 3x = -3 \\quad\\Rightarrow\\quad x = -1$$

Check each in the original equation: $|2(5) - 1| = 9$ and $5 + 4 = 9$; $|2(-1) - 1| = 3$ and $-1 + 4 = 3$. These are the two crossing points of the graphs.

> **Watch out.** Solve both cases; each gives one of the solutions. In the second case the minus sign must reach both terms of the right side: $-(x + 4)$ is $-x - 4$. If it reaches only the first term, the second case becomes $2x - 1 = -x + 4$ and gives a number that does not solve the equation.`,
        `每种情况都是两边都有 $x$ 的一次方程：把含 $x$ 的项移到一边，常数移到另一边。对 $|2x - 1| = x + 4$：

$$2x - 1 = x + 4 \\quad\\Rightarrow\\quad x = 5$$

$$2x - 1 = -x - 4 \\quad\\Rightarrow\\quad 3x = -3 \\quad\\Rightarrow\\quad x = -1$$

把每个解代回原方程检验：$|2(5) - 1| = 9$，$5 + 4 = 9$；$|2(-1) - 1| = 3$，$-1 + 4 = 3$。它们就是两个图象的交点。

> **注意。** 两种情况都要解，每种情况给出一个解。第二种情况中负号要作用到右边的两项：$-(x + 4)$ 是 $-x - 4$。如果只作用到第一项，第二种情况就成了 $2x - 1 = -x + 4$，得到的数不是方程的解。`,
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        const p = absLinear(rng, "two");
        const [x1, x2] = p.cands;
        const work = twoCases(p);
        const so = solutionsAre([x1, x2]);
        const checks = sortQ([x1, x2]).map((x) => checkLine(p, x));
        const sloppy = p.A + p.c !== 0 ? [sols([x1, Q.of(p.d - p.B, p.A + p.c)])] : [];
        return solutionsProblem({
          prompt: solveText(`${bars(p.L)} = ${p.R}`, listSolutions),
          values: sols([x1, x2]),
          wrong: [[x1.toLatex()], [x2.toLatex()], ...sloppy],
          solution: t(
            `${work.en}${so.en}\n\n**Check.** Work out both sides of the original equation at each solution.\n\n${checks.map((c) => c.en).join("")}At each solution the two sides agree.`,
            `${work["zh-CN"]}${so["zh-CN"]}\n\n**检验。** 在每个解处分别算原方程的两边。\n\n${checks.map((c) => c["zh-CN"]).join("")}每个解处两边都相等。`,
          ),
        });
      },
    },
    {
      id: "checking-solutions",
      title: t("Checking a solution", "检验一个解"),
      explanation: t(
        `To check whether a number is a solution, put it into **both** sides of the original equation and compare the two numbers you get.

For $|2x - 1| = x + 4$ and $x = 2$: the left side is $|2(2) - 1| = |3| = 3$ and the right side is $2 + 4 = 6$. They differ, so $x = 2$ is not a solution. For $x = 5$ both sides are $9$, so $x = 5$ is one.

> **Watch out.** Work out the absolute value on the left completely: first the inside, then its distance from $0$. And compare with the right side at the **same** number; finding that the left side is positive, or that the inside equals something, does not yet say the sides agree.`,
        `要检验一个数是不是解，把它代入原方程的**两边**，比较得到的两个数。

对于 $|2x - 1| = x + 4$ 和 $x = 2$：左边是 $|2(2) - 1| = |3| = 3$，右边是 $2 + 4 = 6$。两者不同，所以 $x = 2$ 不是解。当 $x = 5$ 时两边都是 $9$，所以 $x = 5$ 是解。

> **注意。** 左边的绝对值要算完：先算里面，再求它到 $0$ 的距离。还要和**同一个**数处的右边比较；只看出左边是正数，或者里面等于某个数，还不能说明两边相等。`,
      ),
      generate(rng) {
        const p = absLinear(rng, rng.pick(["two", "two", "one"]));
        const x = rng.bool() ? rng.pick(p.cands.filter((_, i) => p.valid[i])) : Q.of(rng.int(-8, 8));
        const left = Q.of(p.A).mul(x).add(Q.of(p.B)).abs();
        const right = rightAt(p, x);
        const yes = left.eq(right);
        const X = x.toLatex();
        return choiceProblem({
          prompt: t(`Is $x = ${X}$ a solution of $${bars(p.L)} = ${p.R}$?`, `$x = ${X}$ 是方程 $${bars(p.L)} = ${p.R}$ 的解吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: t(
            `**Step 1: the left side.** Put $x = ${X}$ into $${bars(p.L)}$, working out the inside first:${steps(absCheck(p.A, p.B, x))}**Step 2: the right side.** Put $x = ${X}$ into $${p.R}$:${steps(lineAt(p.c, p.d, x))}**Step 3: compare.** ${yes ? `Both sides are $${left.toLatex()}$, so $x = ${X}$ is a solution.` : `The left side is $${left.toLatex()}$ and the right side is $${right.toLatex()}$; they are not equal, so $x = ${X}$ is not a solution.`}`,
            `**第一步：算左边。** 把 $x = ${X}$ 代入 $${bars(p.L)}$，先算里面：${steps(absCheck(p.A, p.B, x))}**第二步：算右边。** 把 $x = ${X}$ 代入 $${p.R}$：${steps(lineAt(p.c, p.d, x))}**第三步：比较。** ${yes ? `两边都是 $${left.toLatex()}$，所以 $x = ${X}$ 是解。` : `左边是 $${left.toLatex()}$，右边是 $${right.toLatex()}$，两者不相等，所以 $x = ${X}$ 不是解。`}`,
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
  intro: t(
    `We solve $|ax + b| = cx + d$ by splitting it into two cases. Try it on $|x - 2| = 2x + 5$:

$$x - 2 = 2x + 5 \\;\\Rightarrow\\; x = -7 \\qquad x - 2 = -(2x + 5) \\;\\Rightarrow\\; x = -1$$

Put $x = -7$ back: the left side is $|-7 - 2| = 9$, but the right side is $2(-7) + 5 = -9$. So $x = -7$ is **not** a solution, even though we found it correctly.

The graphs show why. The first case solves $x - 2 = 2x + 5$, which is where the line $y = 2x + 5$ meets the line $y = x - 2$. But $|x - 2|$ follows that line only to the right of $x = 2$; to the left it turns up. The crossing at $x = -7$ is on the dashed part, below the $x$-axis, where the V does not go:

{{figure 0}}

A number the cases produce that does not solve the original equation is called **extraneous**. It appears exactly when the right side is negative there, since no absolute value is negative. In this lesson we check every candidate and reject the extraneous ones.`,
    `我们分两种情况解 $|ax + b| = cx + d$。试一试 $|x - 2| = 2x + 5$：

$$x - 2 = 2x + 5 \\;\\Rightarrow\\; x = -7 \\qquad x - 2 = -(2x + 5) \\;\\Rightarrow\\; x = -1$$

把 $x = -7$ 代回：左边是 $|-7 - 2| = 9$，但右边是 $2(-7) + 5 = -9$。所以 $x = -7$ **不是**解，尽管我们的计算没有错。

图象说明了原因。第一种情况解的是 $x - 2 = 2x + 5$，也就是直线 $y = 2x + 5$ 与直线 $y = x - 2$ 的交点。但 $|x - 2|$ 只在 $x = 2$ 右边沿着这条直线；在左边它向上折。$x = -7$ 处的交点在虚线部分，在 $x$ 轴下方，V 形图象根本不经过那里：

{{figure 0}}

由两种情况得到、却不满足原方程的数叫做**增根**。它恰好出现在右边为负数的地方，因为绝对值不会是负数。这节课我们检验每个候选解，舍去增根。`,
  ),
  introFigures: [
    graphFigure(
      viewAround([
        [-7, -9],
        [-1, 3],
      ]),
      [
        { kind: "curve", f: vOf(1, -2), accent: true },
        { kind: "curve", f: (x) => x - 2, to: 2, dashed: true },
        { kind: "line", a: [0, 5], b: [1, 7], tone: "action" },
        { kind: "point", at: [-1, 3], label: "(−1, 3)", dir: "e", accent: true },
        { kind: "point", at: [-7, -9], open: true, label: "(−7, −9)", dir: "e" },
      ],
      "The V-shaped graph of y = |x − 2| and the line y = 2x + 5, crossing at (−1, 3). The line y = x − 2, continued to the left of x = 2 as a dashed line below the x-axis, meets y = 2x + 5 at (−7, −9), which is not on the V.",
      "y = |x − 2| 的 V 形图象与直线 y = 2x + 5 交于 (−1, 3)。直线 y = x − 2 在 x = 2 左边延长成 x 轴下方的虚线，与 y = 2x + 5 交于 (−7, −9)，这一点不在 V 形图象上。",
    ),
  ],
  knowledgePoints: [
    {
      id: "rejecting-extraneous-solutions",
      title: t("Rejecting extraneous solutions", "舍去增根"),
      explanation: t(
        `Splitting $|u| = v$ into $u = v$ or $u = -v$ is safe only where $v \\ge 0$. Where $v$ is negative, one of the cases can still have a solution, but the original equation cannot, because an absolute value is never negative. So every candidate must be checked in the original equation.

For $|x - 2| = 2x + 5$ the cases give $x = -7$ and $x = -1$:

- at $x = -7$: the left side is $|-9| = 9$, the right side is $2(-7) + 5 = -9$; reject it;
- at $x = -1$: the left side is $|-3| = 3$, the right side is $2(-1) + 5 = 3$; keep it.

The only solution is $x = -1$.

> **Watch out.** Solving both cases correctly is not the end: listing both candidates gives an extraneous solution. Check each one in the **original** equation, not in the case equation it came from, which it always satisfies.`,
        `把 $|u| = v$ 拆成 $u = v$ 或 $u = -v$，只在 $v \\ge 0$ 的地方可靠。在 $v$ 为负数的地方，某种情况仍可能有解，但原方程不可能有解，因为绝对值不会是负数。所以每个候选解都必须代回原方程检验。

对 $|x - 2| = 2x + 5$，两种情况得 $x = -7$ 和 $x = -1$：

- 当 $x = -7$ 时：左边是 $|-9| = 9$，右边是 $2(-7) + 5 = -9$，舍去；
- 当 $x = -1$ 时：左边是 $|-3| = 3$，右边是 $2(-1) + 5 = 3$，保留。

唯一的解是 $x = -1$。

> **注意。** 两种情况都解对了还没有结束：把两个候选解都写上，就多了一个增根。每个候选解都要代回**原方程**检验，而不是代回它所来自的情况方程，因为它总是满足那个方程。`,
      ),
      generate(rng) {
        const p = absLinear(rng, "one");
        const good = p.cands.find((_, i) => p.valid[i])!;
        const bad = p.cands.find((_, i) => !p.valid[i])!;
        const work = twoCases(p);
        const checks = sortQ(p.cands).map((x) => [checkLine(p, x), verdict(p, x)] as const);
        return solutionsProblem({
          prompt: solveText(`${bars(p.L)} = ${p.R}`, listSolutions),
          values: [good.toLatex()],
          wrong: [sols(p.cands), [bad.toLatex()], []],
          solution: t(
            `${work.en}**Check.** Each candidate goes back into the original equation.\n\n${checks.map(([c, v]) => `${c.en}${v.en}\n\n`).join("")}So the only solution is $x = ${good.toLatex()}$.`,
            `${work["zh-CN"]}**检验。** 把每个候选解代回原方程。\n\n${checks.map(([c, v]) => `${c["zh-CN"]}${v["zh-CN"]}\n\n`).join("")}所以方程只有一个解 $x = ${good.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "when-every-candidate-is-extraneous",
      title: t("When every candidate is extraneous", "所有候选解都是增根"),
      explanation: t(
        `Both candidates can be extraneous, and then the equation has no solution. For $|3x| = x - 4$ the cases are $3x = x - 4$ and $3x = -(x - 4)$, which give $x = -2$ and $x = 1$. The right side there is $-2 - 4 = -6$ and $1 - 4 = -3$, both negative, so both are rejected and the solution set is $\\varnothing$.

On a graph, the line $y = x - 4$ passes below the corner of the V of $y = |3x|$ and never reaches it.

> **Watch out.** Two candidates do not mean two solutions, or even one: here neither survives the check. Do not keep the candidate that "looks better"; reject each one whose right side is negative.`,
        `两个候选解可能都是增根，这时方程无解。对于 $|3x| = x - 4$，两种情况是 $3x = x - 4$ 和 $3x = -(x - 4)$，得 $x = -2$ 和 $x = 1$。此时右边分别是 $-2 - 4 = -6$ 和 $1 - 4 = -3$，都是负数，所以两个都要舍去，解集是 $\\varnothing$。

从图象上看，直线 $y = x - 4$ 从 $y = |3x|$ 的 V 形尖角下方经过，始终碰不到它。

> **注意。** 有两个候选解，并不说明有两个解，甚至不一定有一个解：这里两个都通不过检验。不要保留“看起来更好”的那个；右边为负数的候选解都要舍去。`,
      ),
      generate(rng) {
        const p = absLinear(rng, "none");
        const work = twoCases(p);
        const checks = sortQ(p.cands).map((x) => [checkLine(p, x), verdict(p, x)] as const);
        return solutionsProblem({
          prompt: solveText(`${bars(p.L)} = ${p.R}`, listSolutions),
          values: [],
          wrong: [sols(p.cands), [p.cands[0].toLatex()], [p.cands[1].toLatex()]],
          solution: t(
            `${work.en}**Check.** Each candidate goes back into the original equation.\n\n${checks.map(([c, v]) => `${c.en}${v.en}\n\n`).join("")}Both candidates are extraneous, so there is no solution: $\\varnothing$.`,
            `${work["zh-CN"]}**检验。** 把每个候选解代回原方程。\n\n${checks.map(([c, v]) => `${c["zh-CN"]}${v["zh-CN"]}\n\n`).join("")}两个候选解都是增根，所以方程无解：$\\varnothing$。`,
          ),
        });
      },
    },
    {
      id: "deciding-which-candidates-are-solutions",
      title: t("Which candidates are solutions?", "哪些候选解是解"),
      explanation: t(
        `There is a quicker test than substituting into both sides. A candidate solves one of the case equations, so $ax + b$ is already $cx + d$ or $-(cx + d)$ there. Either way its absolute value equals $|cx + d|$, and that equals $cx + d$ exactly when $cx + d \\ge 0$. So:

**a candidate is a solution exactly when the right side $cx + d$ is not negative there.**

For $|x - 2| = 2x + 5$ with candidates $-7$ and $-1$: $2(-7) + 5 = -9$ is negative, $2(-1) + 5 = 3$ is not, so only $x = -1$ is a solution.

> **Watch out.** Test the sign of the **right side**, $cx + d$, not of the inside of the bars and not of the candidate itself: a negative candidate such as $x = -1$ can be a perfectly good solution. A right side of exactly $0$ is allowed.`,
        `还有比代入两边更快的检验方法。候选解满足某一个情况方程，所以在那里 $ax + b$ 已经等于 $cx + d$ 或 $-(cx + d)$。无论哪种，它的绝对值都等于 $|cx + d|$，而 $|cx + d|$ 等于 $cx + d$ 当且仅当 $cx + d \\ge 0$。所以：

**候选解是解，当且仅当右边 $cx + d$ 在该处不是负数。**

对 $|x - 2| = 2x + 5$，候选解是 $-7$ 和 $-1$：$2(-7) + 5 = -9$ 是负数，$2(-1) + 5 = 3$ 不是，所以只有 $x = -1$ 是解。

> **注意。** 要看的是**右边** $cx + d$ 的符号，不是绝对值里面的符号，也不是候选解本身的符号：像 $x = -1$ 这样的负数完全可以是解。右边恰好等于 $0$ 也是可以的。`,
      ),
      generate(rng) {
        const p = absLinear(rng, rng.pick(["two", "one", "one", "none"]));
        const [x1, x2] = sortQ(p.cands);
        const v1 = p.valid[p.cands[0].eq(x1!) ? 0 : 1]!;
        const v2 = p.valid[p.cands[0].eq(x1!) ? 1 : 0]!;
        const correct = v1 && v2 ? 0 : v1 ? 1 : v2 ? 2 : 3;
        const sign = (x: Q) => (rightAt(p, x).sign() < 0 ? t("negative", "是负数") : t("not negative", "不是负数"));
        const kept = [x1!, x2!].filter((x) => rightAt(p, x).sign() >= 0);
        const keptText =
          kept.length === 0
            ? t("Neither candidate is a solution.", "两个候选解都不是解。")
            : kept.length === 2
              ? t("Both candidates are solutions.", "两个候选解都是解。")
              : t(`Only $x = ${kept[0]!.toLatex()}$ is a solution.`, `只有 $x = ${kept[0]!.toLatex()}$ 是解。`);
        const probe = checkLine(p, x1!);
        const probeVerdict = verdict(p, x1!);
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
            `**Step 1: what to test.** Each candidate already solves one of the cases, so it is a solution exactly when the right side, $${p.R}$, is not negative there.

**Step 2: the right side at each candidate.**${steps(lineAt(p.c, p.d, x1!), lineAt(p.c, p.d, x2!))}At $x = ${x1!.toLatex()}$ it is ${sign(x1!).en}; at $x = ${x2!.toLatex()}$ it is ${sign(x2!).en}. ${keptText.en}

**Check.** Substituting into both sides of the original equation confirms the test for the first candidate. ${probe.en}${probeVerdict.en}`,
            `**第一步：检验什么。** 每个候选解已经满足某一种情况，所以它是解当且仅当右边 $${p.R}$ 在该处不是负数。

**第二步：求每个候选解处的右边。**${steps(lineAt(p.c, p.d, x1!), lineAt(p.c, p.d, x2!))}当 $x = ${x1!.toLatex()}$ 时它${sign(x1!)["zh-CN"]}；当 $x = ${x2!.toLatex()}$ 时它${sign(x2!)["zh-CN"]}。${keptText["zh-CN"]}

**检验。** 把第一个候选解代入原方程两边，也能验证这个判断。${probe["zh-CN"]}${probeVerdict["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

/** IneqWork is the worked solution of |ax + b| op c for c > 0: its steps, its check, and a number line when the endpoints are whole numbers. */
interface IneqWork {
  readonly steps: Text;
  readonly check: Text;
  readonly figures: readonly Figure[];
}

/** ineqWork solves |ax + b| op c for c > 0, numbering its steps from first. */
function ineqWork(a: number, b: number, c: number, op: InequalityOp, first = 1): IneqWork {
  const L = linear(a, b);
  const set = absSet(a, b, op, c);
  const s = relSymbol(op);
  const fs = relSymbol(flip[op]);
  const [lo, hi] = sortQ(solveAbs(a, b, c)) as [Q, Q];
  const p = Q.of(-c - b, a);
  const q = Q.of(c - b, a);
  const ax = poly([a, "x"]);
  const how = undoing(a, b);
  const how3 = undoing(a, b, t("all three parts", "三部分"));
  const neg = a < 0;
  const [n1, n2] = [first, first + 1];
  const less = isLess(op);
  const closed = op === "<=" || op === ">=";
  const interval = intervalLatex(set);
  const integral = lo.isInteger() && hi.isInteger();
  const figures = integral ? [numberLineFigure(set, lo.toNumber() - 3, hi.toNumber() + 3)] : [];
  const drawn = integral ? "\n\n{{figure 0}}\n\n" : "\n\n";
  const mid = Q.of(-b, a);
  const ends = t(
    `At the endpoint $x = ${hi.toLatex()}$: $${absCheck(a, b, hi)}$, ${closed ? "which the symbol allows, so the endpoint is included" : "which the strict symbol does not allow, so the endpoint is excluded"}.`,
    `在端点 $x = ${hi.toLatex()}$ 处：$${absCheck(a, b, hi)}$，${closed ? "不等号允许相等，所以端点包括在内" : "严格不等号不允许相等，所以端点不包括在内"}。`,
  );
  const divide = neg ? t(" Dividing by a negative number reverses the symbols.", "除以负数时，不等号要改变方向。") : t("", "");
  if (less) {
    const lines = [`${-c} ${s} ${L} ${s} ${c}`];
    if (b !== 0) lines.push(`${-c - b} ${s} ${ax} ${s} ${c - b}`);
    if (a !== 1) {
      if (neg) lines.push(`${p.toLatex()} ${fs} x ${fs} ${q.toLatex()}`, `${q.toLatex()} ${s} x ${s} ${p.toLatex()}`);
      else lines.push(`${p.toLatex()} ${s} x ${s} ${q.toLatex()}`);
    }
    const [first1, ...rest] = lines;
    return {
      steps: t(
        `**Step ${n1}: write an AND inequality.** $${bars(L)} ${s} ${c}$ says that $${L}$ is ${op === "<" ? "less than" : "at most"} $${c}$ units from $0$, so it lies between $${-c}$ and $${c}$:${steps(first1!)}**Step ${n2}: solve all three parts at once.** ${rest.length ? `To get $x$ alone in the middle, ${how3.en}.${divide.en}${steps(...rest)}` : "The middle is already $x$.\n\n"}The solution set is $${interval}$.${drawn}`,
        `**第${zhOrdinal(n1)}步：写成“且”型不等式。** $${bars(L)} ${s} ${c}$ 表示 $${L}$ 到 $0$ 的距离${op === "<" ? "小于" : "小于或等于"} $${c}$，所以它在 $${-c}$ 和 $${c}$ 之间：${steps(first1!)}**第${zhOrdinal(n2)}步：三部分同时求解。** ${rest.length ? `为了让中间只剩 $x$，${how3["zh-CN"]}。${divide["zh-CN"]}${steps(...rest)}` : "中间已经是 $x$。\n\n"}解集是 $${interval}$。${drawn}`,
      ),
      check: t(
        `**Check.** The middle of the interval, $x = ${mid.toLatex()}$, gives $${absCheck(a, b, mid)}$, which is less than $${c}$, as a number in the set should. ${ends.en}`,
        `**检验。** 区间的中点 $x = ${mid.toLatex()}$ 给出 $${absCheck(a, b, mid)}$，小于 $${c}$，解集中的数理应如此。${ends["zh-CN"]}`,
      ),
      figures,
    };
  }
  const pairs: [string, string][] = [[`${L} ${fs} ${-c}`, `${L} ${s} ${c}`]];
  if (b !== 0) pairs.push([`${ax} ${fs} ${-c - b}`, `${ax} ${s} ${c - b}`]);
  if (a !== 1) pairs.push(neg ? [`x ${s} ${p.toLatex()}`, `x ${fs} ${q.toLatex()}`] : [`x ${fs} ${p.toLatex()}`, `x ${s} ${q.toLatex()}`]);
  const [firstPair, ...restPairs] = pairs.map(([u, v]) => either(u, v));
  const out = Q.of(Math.floor(hi.toNumber()) + 1);
  return {
    steps: t(
      `**Step ${n1}: write an OR inequality.** $${bars(L)} ${s} ${c}$ says that $${L}$ is ${op === ">" ? "more than" : "at least"} $${c}$ units from $0$, so it lies beyond $${-c}$ on the left or beyond $${c}$ on the right:${firstPair!.en}**Step ${n2}: solve each part.** ${restPairs.length ? `In both, ${how.en}.${divide.en}${restPairs.map((r) => r.en).join("")}` : "Both parts are already solved for $x$.\n\n"}Together the two parts give $${interval}$.${drawn}`,
      `**第${zhOrdinal(n1)}步：写成“或”型不等式。** $${bars(L)} ${s} ${c}$ 表示 $${L}$ 到 $0$ 的距离${op === ">" ? "大于" : "大于或等于"} $${c}$，所以它在 $${-c}$ 的左边或 $${c}$ 的右边：${firstPair!.zh}**第${zhOrdinal(n2)}步：分别求解。** ${restPairs.length ? `对两部分，${how["zh-CN"]}。${divide["zh-CN"]}${restPairs.map((r) => r.zh).join("")}` : "两部分已经解出了 $x$。\n\n"}两部分合起来得到 $${interval}$。${drawn}`,
    ),
    check: t(
      `**Check.** A number in the set, $x = ${out.toLatex()}$, gives $${absCheck(a, b, out)}$, which is more than $${c}$. The number between the two parts, $x = ${mid.toLatex()}$, gives $${absCheck(a, b, mid)}$, which is not, and it is rightly left out. ${ends.en}`,
      `**检验。** 解集中的数 $x = ${out.toLatex()}$ 给出 $${absCheck(a, b, out)}$，大于 $${c}$。两部分之间的数 $x = ${mid.toLatex()}$ 给出 $${absCheck(a, b, mid)}$，不满足，它被排除在外是对的。${ends["zh-CN"]}`,
    ),
    figures,
  };
}

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
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.1"],
  intro: t(
    `The equation $|x| = 3$ picks out the two numbers $3$ units from $0$. An inequality asks for a whole range of distances instead.

$|x| < 3$ asks for the numbers **less than** $3$ units from $0$. They are the numbers between $-3$ and $3$, so $|x| < 3$ is the AND inequality $-3 < x < 3$:

{{figure 0}}

$|x| > 3$ asks for the numbers **more than** $3$ units from $0$. They lie outside, to the left of $-3$ or to the right of $3$, so $|x| > 3$ is the OR inequality $x < -3$ or $x > 3$:

{{figure 1}}

So "less than" gives one piece between two endpoints, and "greater than" gives two pieces pointing away from each other. In this lesson we turn absolute value inequalities into compound inequalities in this way and solve them, using what we know about AND and OR inequalities.`,
    `方程 $|x| = 3$ 找出的是到 $0$ 的距离为 $3$ 的两个数。不等式问的则是一整段距离。

$|x| < 3$ 问的是到 $0$ 的距离**小于** $3$ 的数。它们在 $-3$ 与 $3$ 之间，所以 $|x| < 3$ 就是“且”型不等式 $-3 < x < 3$：

{{figure 0}}

$|x| > 3$ 问的是到 $0$ 的距离**大于** $3$ 的数。它们在外侧，在 $-3$ 的左边或 $3$ 的右边，所以 $|x| > 3$ 就是“或”型不等式 $x < -3$ 或 $x > 3$：

{{figure 1}}

所以“小于”得到夹在两个端点之间的一段，“大于”得到方向相背的两段。这节课我们这样把绝对值不等式化成复合不等式，再用解“且”型和“或”型不等式的方法求解。`,
  ),
  introFigures: [numberLineFigure(absSet(1, 0, "<", 3), -6, 6), numberLineFigure(absSet(1, 0, ">", 3), -6, 6)],
  knowledgePoints: [
    {
      id: "less-than-inequalities",
      title: t("Less than: an AND inequality", "小于：“且”型不等式"),
      explanation: t(
        `$|u| < c$ with $c > 0$ says that $u$ is less than $c$ units from $0$, so

$$|u| < c \\quad\\text{means}\\quad -c < u < c.$$

Solve the double inequality by doing the same thing to all three parts. For $|2x - 3| \\le 7$:

$$-7 \\le 2x - 3 \\le 7$$

Add $3$ to all three parts, then divide all three by $2$:

$$-4 \\le 2x \\le 10 \\qquad -2 \\le x \\le 5$$

The solution set is $[-2, 5]$. The middle, $x = \\frac{3}{2}$, makes $|2x - 3| = 0$, and the endpoints make it exactly $7$.

> **Watch out.** "Less than" gives **one** piece between the endpoints, not two pieces outside them. Keep the endpoints as the symbol says: $\\le$ includes them, $<$ excludes them. Dividing by a negative number reverses **both** symbols; then rewrite the inequality with the smaller number on the left.`,
        `当 $c > 0$ 时，$|u| < c$ 表示 $u$ 到 $0$ 的距离小于 $c$，所以

$$|u| < c \\quad\\text{表示}\\quad -c < u < c.$$

解这个连不等式时，三部分做同样的运算。对 $|2x - 3| \\le 7$：

$$-7 \\le 2x - 3 \\le 7$$

三部分都加 $3$，再都除以 $2$：

$$-4 \\le 2x \\le 10 \\qquad -2 \\le x \\le 5$$

解集是 $[-2, 5]$。中点 $x = \\frac{3}{2}$ 使 $|2x - 3| = 0$，端点使它恰好等于 $7$。

> **注意。** “小于”得到端点之间的**一段**，不是端点外侧的两段。端点按不等号处理：$\\le$ 包括端点，$<$ 不包括。除以负数时**两个**不等号都要改变方向，然后把较小的数写到左边。`,
      ),
      keyPrerequisites: ["compound-and-inequalities"],
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b = rng.int(-10, 10);
        const c = rng.int(1, 12);
        const op: InequalityOp = rng.pick(["<", "<="]);
        const L = linear(a, b);
        const set = absSet(a, b, op, c);
        const w = ineqWork(a, b, c, op);
        return {
          ...intervalProblem({
            prompt: solveText(`${bars(L)} ${relSymbol(op)} ${c}`, asInterval),
            set,
            form: "interval",
            wrong: [absSet(a, b, flip[op], c), toggleEnds(set), absSet(a, b, op === "<" ? ">=" : ">", c)],
            solution: t(`${w.steps.en}${w.check.en}`, `${w.steps["zh-CN"]}${w.check["zh-CN"]}`),
          }),
          ...(w.figures.length ? { solutionFigures: w.figures } : {}),
        };
      },
    },
    {
      id: "greater-than-inequalities",
      title: t("Greater than: an OR inequality", "大于：“或”型不等式"),
      explanation: t(
        `$|u| > c$ with $c > 0$ says that $u$ is more than $c$ units from $0$: beyond $-c$ on the left or beyond $c$ on the right. So

$$|u| > c \\quad\\text{means}\\quad u < -c \\;\\text{ or }\\; u > c.$$

Solve the two parts separately and join them. For $|x + 1| \\ge 4$:

$$x + 1 \\le -4 \\;\\text{ or }\\; x + 1 \\ge 4$$

$$x \\le -5 \\;\\text{ or }\\; x \\ge 3$$

The solution set is $(-\\infty, -5] \\cup [3, \\infty)$. A number between the pieces, such as $x = 0$, gives $|0 + 1| = 1$, which is not at least $4$.

> **Watch out.** The two parts cannot be written as one chain: $-4 \\ge x + 1 \\ge 4$ would need a number that is at most $-4$ and at least $4$ at once, and there is none. Write "or", and take the union. The left part uses the reversed symbol: $u < -c$, not $u > -c$.`,
        `当 $c > 0$ 时，$|u| > c$ 表示 $u$ 到 $0$ 的距离大于 $c$：在 $-c$ 的左边或 $c$ 的右边。所以

$$|u| > c \\quad\\text{表示}\\quad u < -c \\;\\text{ 或 }\\; u > c.$$

两部分分别求解，再合起来。对 $|x + 1| \\ge 4$：

$$x + 1 \\le -4 \\;\\text{ 或 }\\; x + 1 \\ge 4$$

$$x \\le -5 \\;\\text{ 或 }\\; x \\ge 3$$

解集是 $(-\\infty, -5] \\cup [3, \\infty)$。两段之间的数，例如 $x = 0$，给出 $|0 + 1| = 1$，不满足大于或等于 $4$。

> **注意。** 两部分不能写成一个连不等式：$-4 \\ge x + 1 \\ge 4$ 要求一个数同时小于或等于 $-4$ 又大于或等于 $4$，这样的数不存在。要写“或”，取并集。左边那部分的不等号方向相反：是 $u < -c$，不是 $u > -c$。`,
      ),
      keyPrerequisites: ["compound-or-inequalities"],
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b = rng.int(-10, 10);
        const c = rng.int(1, 12);
        const op: InequalityOp = rng.pick([">", ">="]);
        const L = linear(a, b);
        const set = absSet(a, b, op, c);
        const w = ineqWork(a, b, c, op);
        return {
          ...intervalProblem({
            prompt: solveText(`${bars(L)} ${relSymbol(op)} ${c}`, asInterval),
            set,
            form: "interval",
            wrong: [absSet(a, b, flip[op], c), toggleEnds(set), []],
            solution: t(`${w.steps.en}${w.check.en}`, `${w.steps["zh-CN"]}${w.check["zh-CN"]}`),
          }),
          ...(w.figures.length ? { solutionFigures: w.figures } : {}),
        };
      },
    },
    {
      id: "isolating-before-solving-inequalities",
      title: t("Isolating the absolute value", "先把绝对值单独放在一边"),
      explanation: t(
        `As with equations, get the absolute value alone before deciding between AND and OR. Undo the operations around it as in a two-step inequality; dividing both sides by a negative number reverses the symbol, which can turn a "less than" into a "greater than":

$$-2|x - 1| + 3 < -5$$

Subtract $3$, then divide by $-2$ and reverse the symbol:

$$-2|x - 1| < -8 \\qquad |x - 1| > 4$$

Now it is an OR inequality: $x - 1 < -4$ or $x - 1 > 4$, so the solution set is $(-\\infty, -3) \\cup (5, \\infty)$.

> **Watch out.** Decide AND or OR only **after** isolating: the original has $<$, but the isolated inequality has $>$. Forgetting to reverse when dividing by $-2$ gives $|x - 1| < 4$ and exactly the wrong numbers.`,
        `和方程一样，在决定用“且”还是“或”之前，先把绝对值单独放在一边。像解两步不等式那样消去它周围的运算；两边除以负数时不等号改变方向，“小于”可能变成“大于”：

$$-2|x - 1| + 3 < -5$$

两边减去 $3$，再除以 $-2$ 并改变不等号方向：

$$-2|x - 1| < -8 \\qquad |x - 1| > 4$$

现在是“或”型不等式：$x - 1 < -4$ 或 $x - 1 > 4$，所以解集是 $(-\\infty, -3) \\cup (5, \\infty)$。

> **注意。** 要在单独放好**之后**才决定用“且”还是“或”：原式是 $<$，单独放好后却是 $>$。除以 $-2$ 时忘了改变方向，会得到 $|x - 1| < 4$，正好是错误的那些数。`,
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
        const how = undoing(k, d);
        const w = ineqWork(a, b, c, iso, 2);
        const [, hi] = sortQ(solveAbs(a, b, c)) as [Q, Q];
        const probe = isLess(iso) ? Q.of(-b, a) : Q.of(Math.floor(hi.toNumber()) + 1);
        const value = Q.of(k)
          .mul(Q.of(a).mul(probe).add(Q.of(b)).abs())
          .add(Q.of(d));
        return {
          ...intervalProblem({
            prompt: solveText(`${lhs} ${relSymbol(op)} ${e}`, asInterval),
            set,
            form: "interval",
            wrong: [absSet(a, b, flip[iso], c), toggleEnds(set)],
            solution: t(
              `**Step 1: get the absolute value alone.** ${how.en[0]!.toUpperCase()}${how.en.slice(1)}${k < 0 ? `, reversing the symbol because $${k}$ is negative` : ""}:${s}${w.steps.en}**Check.** Try a number in the set in the original inequality: at $x = ${probe.toLatex()}$, the left side is $${isoCheck({ a, b, k, d }, probe)}$, and $${value.toLatex()} ${relSymbol(op)} ${e}$ is true.`,
              `**第一步：把绝对值单独放在一边。** ${how["zh-CN"]}${k < 0 ? `，因为 $${k}$ 是负数，不等号要改变方向` : ""}：${s}${w.steps["zh-CN"]}**检验。** 在原不等式中试一个解集中的数：当 $x = ${probe.toLatex()}$ 时，左边是 $${isoCheck({ a, b, k, d }, probe)}$，而 $${value.toLatex()} ${relSymbol(op)} ${e}$ 成立。`,
            ),
          }),
          ...(w.figures.length ? { solutionFigures: w.figures } : {}),
        };
      },
    },
    {
      id: "special-cases-of-absolute-value-inequalities",
      title: t("Zero and negative right sides", "右边为零或负数"),
      explanation: t(
        `When the right side is $0$ or negative, there is nothing to split; the fact that $|u| \\ge 0$ for every $u$ settles it.

- $|u| < c$ with $c \\le 0$ has no solution, and neither does $|u| \\le c$ with $c < 0$.
- $|u| > c$ and $|u| \\ge c$ with $c < 0$ hold for every real number.
- $|u| \\le 0$ holds only where $u = 0$, and $|u| > 0$ holds everywhere except there.

For example, $|x - 2| \\le 0$ has the single solution $x = 2$, written $[2, 2]$, while $|x - 2| > 0$ gives $(-\\infty, 2) \\cup (2, \\infty)$.

> **Watch out.** Do not split $|u| < -3$ into $3 < u < -3$ and solve: there is simply no solution. A negative right side with $>$ is not "no solution" either: every number works. And $|u| > 0$ leaves out exactly one number, the one that makes $u = 0$.`,
        `右边是 $0$ 或负数时，不需要拆开；由对任意 $u$ 都有 $|u| \\ge 0$ 就能判断。

- 当 $c \\le 0$ 时 $|u| < c$ 无解；当 $c < 0$ 时 $|u| \\le c$ 也无解。
- 当 $c < 0$ 时 $|u| > c$ 和 $|u| \\ge c$ 对所有实数都成立。
- $|u| \\le 0$ 只在 $u = 0$ 处成立，$|u| > 0$ 在除该处以外的地方都成立。

例如，$|x - 2| \\le 0$ 只有一个解 $x = 2$，写作 $[2, 2]$；而 $|x - 2| > 0$ 的解集是 $(-\\infty, 2) \\cup (2, \\infty)$。

> **注意。** 不要把 $|u| < -3$ 拆成 $3 < u < -3$ 去解：它就是无解。右边是负数而不等号是 $>$ 时也不是“无解”：所有数都成立。$|u| > 0$ 恰好去掉一个数，就是使 $u = 0$ 的那个数。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b = rng.int(-10, 10);
        const L = linear(a, b);
        const op: InequalityOp = rng.pick(["<", "<=", ">", ">="]);
        const r = Q.of(-b, a);
        const point = union(span(r, true, r, true));
        const punctured = union(ray("<", r), ray(">", r));
        const sym = relSymbol(op);
        const atR = absCheck(a, b, r);
        const near = r.add(Q.one);
        const atNear = absCheck(a, b, near);
        let c: number;
        let set: RealSet;
        let wrong: RealSet[];
        let en: string;
        let zh: string;
        let checkEn: string;
        let checkZh: string;
        if (rng.bool()) {
          c = -rng.int(1, 9);
          if (isLess(op)) {
            set = [];
            wrong = [absSet(a, b, op, -c), realLine];
            en = `An absolute value is never negative, so it is never ${op === "<" ? "less than" : "at most"} $${c}$. There is no solution.`;
            zh = `绝对值不会是负数，所以它不可能${op === "<" ? "小于" : "小于或等于"} $${c}$。不等式无解。`;
            checkEn = `Even the smallest value of $${bars(L)}$, at $x = ${r.toLatex()}$, is $${atR}$, and $0 ${sym} ${c}$ is false.`;
            checkZh = `即使是 $${bars(L)}$ 的最小值，即 $x = ${r.toLatex()}$ 处的 $${atR}$，$0 ${sym} ${c}$ 也不成立。`;
          } else {
            set = realLine;
            wrong = [absSet(a, b, op, -c), []];
            en = `An absolute value is never negative, so it is always greater than $${c}$. Every real number is a solution.`;
            zh = `绝对值不会是负数，所以它总是大于 $${c}$。所有实数都是解。`;
            checkEn = `Even the smallest value of $${bars(L)}$, at $x = ${r.toLatex()}$, is $${atR}$, and $0 ${sym} ${c}$ is true.`;
            checkZh = `即使是 $${bars(L)}$ 的最小值，即 $x = ${r.toLatex()}$ 处的 $${atR}$，$0 ${sym} ${c}$ 也成立。`;
          }
        } else {
          c = 0;
          const where = `$${L} = 0$, that is, at $x = ${r.toLatex()}$`;
          const whereZh = `$${L} = 0$ 处，即 $x = ${r.toLatex()}$`;
          const both = (inR: boolean, inNear: boolean) => ({
            en: `At $x = ${r.toLatex()}$: $${atR}$, and $0 ${sym} 0$ is ${inR ? "true" : "false"}. At $x = ${near.toLatex()}$: $${atNear}$, which is ${inNear ? "" : "not "}${relWord(op)} $0$.`,
            zh: `当 $x = ${r.toLatex()}$ 时：$${atR}$，$0 ${sym} 0$ ${inR ? "成立" : "不成立"}。当 $x = ${near.toLatex()}$ 时：$${atNear}$，${inNear ? "" : "不"}${relWordZh(op)} $0$。`,
          });
          if (op === "<") {
            set = [];
            wrong = [point, realLine];
            en = "An absolute value is never negative, so it is never less than $0$. There is no solution.";
            zh = "绝对值不会是负数，所以它不可能小于 $0$。不等式无解。";
            ({ en: checkEn, zh: checkZh } = both(false, false));
          } else if (op === "<=") {
            set = point;
            wrong = [[], realLine];
            en = `An absolute value is never negative, so it is at most $0$ only where it equals $0$: where ${where}.`;
            zh = `绝对值不会是负数，所以它小于或等于 $0$ 只能是等于 $0$：在 ${whereZh}。`;
            ({ en: checkEn, zh: checkZh } = both(true, false));
          } else if (op === ">=") {
            set = realLine;
            wrong = [point, punctured];
            en = "An absolute value is never negative, so it is at least $0$ for every real number.";
            zh = "绝对值不会是负数，所以对所有实数它都大于或等于 $0$。";
            ({ en: checkEn, zh: checkZh } = both(true, true));
          } else {
            set = punctured;
            wrong = [realLine, point, []];
            en = `An absolute value is positive except where it equals $0$: where ${where}. So every number except $${r.toLatex()}$ is a solution.`;
            zh = `绝对值除了等于 $0$ 的地方以外都是正数，等于 $0$ 是在 ${whereZh}。所以除 $${r.toLatex()}$ 以外的所有数都是解。`;
            ({ en: checkEn, zh: checkZh } = both(false, true));
          }
        }
        return intervalProblem({
          prompt: solveText(`${bars(L)} ${sym} ${c}`, asInterval),
          set,
          form: "interval",
          wrong,
          solution: t(
            `**Step 1: the left side is never negative.** $${bars(L)} \\ge 0$ for every $x$, and it is $0$ only at $x = ${r.toLatex()}$, where $${L} = 0$.

**Step 2: compare with $${c}$.** ${en} The solution set is $${intervalLatex(set)}$.

**Check.** ${checkEn}`,
            `**第一步：左边不会是负数。** 对每个 $x$ 都有 $${bars(L)} \\ge 0$，只有在 $x = ${r.toLatex()}$ 处，即 $${L} = 0$ 时，它才等于 $0$。

**第二步：和 $${c}$ 比较。** ${zh}解集是 $${intervalLatex(set)}$。

**检验。** ${checkZh}`,
          ),
        });
      },
    },
  ],
};

/** relWord names a comparison: "less than", "at most", "greater than", "at least". */
const relWord = (op: InequalityOp) => ({ "<": "less than", "<=": "at most", ">": "greater than", ">=": "at least" })[op];

/** relWordZh names a comparison in Chinese. */
const relWordZh = (op: InequalityOp) => ({ "<": "小于", "<=": "小于或等于", ">": "大于", ">=": "大于或等于" })[op];

// Unit 2: absolute value functions.

const graphPrompt = t(
  "The graph of an absolute value function is shown. Write its equation.",
  "如图是一个绝对值函数的图象。写出它的解析式。",
);

/** inForm writes a|x − h| + k with h and k shown as they are, "|x - (-2)| + (-1)", or "" when that is how it is already written. */
function inForm(a: Q, h: number, k: Q): string {
  if (h >= 0 && k.sign() >= 0) return "";
  const tail = k.isZero() ? "" : ` + ${k.sign() < 0 ? `(${k.toLatex()})` : k.toLatex()}`;
  return `${coef(a)}|x - ${paren(h)}|${tail}`;
}

/** absoluteValueGraphs graphs translations of y = |x|. */
export const absoluteValueGraphs: TopicDef = {
  id: "absolute-value-graphs",
  title: t("Absolute Value Graphs", "绝对值函数的图象"),
  summary: t(
    "Graph y = |x − h| + k as the V of y = |x| translated so that its vertex is at (h, k).",
    "把 y = |x − h| + k 的图象看作 y = |x| 的 V 形图象平移到顶点 (h, k) 处。",
  ),
  prerequisites: ["absolute-value-expressions", "graphs-of-functions"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.B", "CCSS.HSF.BF.B.3"],
  intro: t(
    `We graph a function by plotting points $(x, y)$. For $y = |x|$, a few values are

$$x = -2, -1, 0, 1, 2 \\quad\\Rightarrow\\quad y = 2, 1, 0, 1, 2.$$

To the right of $0$ the points follow the line $y = x$; to the left, the absolute value turns the negative numbers positive, so they follow $y = -x$ instead. The graph is a V with its corner, called the **vertex**, at $(0, 0)$, the lowest point.

Now take $y = |x - 2| + 1$. The inside is $0$ at $x = 2$, so the corner is there, and the $+1$ lifts every point by $1$. The graph is the same V moved $2$ right and $1$ up:

{{figure 0}}

In this lesson we find the vertex of such a graph, write the equation of a moved V, and move a V by a given amount.`,
    `画函数的图象，就是描出点 $(x, y)$。对 $y = |x|$，取几个值：

$$x = -2, -1, 0, 1, 2 \\quad\\Rightarrow\\quad y = 2, 1, 0, 1, 2.$$

在 $0$ 的右边，这些点沿着直线 $y = x$；在左边，绝对值把负数变成正数，所以点沿着 $y = -x$。图象是一个 V 形，它的拐角叫**顶点**，在 $(0, 0)$，是最低点。

再看 $y = |x - 2| + 1$。里面在 $x = 2$ 时为 $0$，所以拐角在那里，而 $+1$ 把每个点抬高 $1$。图象是同一个 V 形向右移 $2$、向上移 $1$：

{{figure 0}}

这节课我们求这类图象的顶点，写出移动后的 V 形的解析式，并按给定的距离移动 V 形。`,
  ),
  introFigures: [
    graphFigure(
      view,
      [{ kind: "curve", f: Math.abs, dashed: true }, ...vMarks(Q.one, 2, Q.one), ...shift([0, 0], [2, 1])],
      "The V of y = |x| with its vertex at (0, 0), dashed, and the same V moved so that its vertex is at (2, 1), the graph of y = |x − 2| + 1. An arrow goes from (0, 0) to (2, 1).",
      "虚线是顶点在 (0, 0) 的 y = |x| 的 V 形；同样的 V 形移到顶点 (2, 1) 处，就是 y = |x − 2| + 1 的图象。箭头从 (0, 0) 指向 (2, 1)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "vertex-of-a-translated-graph",
      figure: algebraDrawings["absolute-value-graphs#vertex-of-a-translated-graph"],
      title: t("The vertex", "顶点"),
      explanation: t(
        `The graph of $y = |x - h| + k$ is the V of $y = |x|$ moved so that its vertex is at $(h, k)$. The reason is the same as for $y = |x - 2| + 1$: the absolute value is least, $0$, where the inside is $0$, at $x = h$, and there $y = 0 + k = k$.

To read $h$ and $k$, match the equation to the form exactly. $y = |x + 2| - 1$ is $y = |x - (-2)| + (-1)$, so $h = -2$, $k = -1$, and the vertex is $(-2, -1)$.

> **Watch out.** Inside the bars the sign is the opposite of $h$: $|x + 2|$ has $h = -2$, not $2$. Outside, $k$ keeps its sign: $-1$ means $k = -1$. And the vertex is $(h, k)$, with the number from inside the bars first.`,
        `$y = |x - h| + k$ 的图象是把 $y = |x|$ 的 V 形移到顶点为 $(h, k)$ 的位置。理由和 $y = |x - 2| + 1$ 一样：绝对值在里面为 $0$ 的地方，即 $x = h$ 处，取最小值 $0$，这时 $y = 0 + k = k$。

读 $h$ 和 $k$ 时，要把方程和这个形式完全对上。$y = |x + 2| - 1$ 就是 $y = |x - (-2)| + (-1)$，所以 $h = -2$，$k = -1$，顶点是 $(-2, -1)$。

> **注意。** 绝对值符号里面的符号与 $h$ 相反：$|x + 2|$ 中 $h = -2$，不是 $2$。外面的 $k$ 保持符号：$-1$ 表示 $k = -1$。顶点是 $(h, k)$，绝对值里面得出的数在前。`,
      ),
      generate(rng) {
        const h = rng.nonZero(-9, 9);
        const k = rng.int(-9, 9);
        const fn = absFn(1, h, k);
        const form = inForm(Q.one, h, Q.of(k));
        const [hq, kq] = [Q.of(h), Q.of(k)];
        return pointProblem({
          prompt: t(`Find the vertex of the graph of $y = ${fn}$.`, `求 $y = ${fn}$ 的图象的顶点。`),
          answer: [h, k],
          wrong: [
            [-h, k],
            [k, h],
            [h, -k],
            [-h, -k],
          ],
          solution: t(
            `**Step 1: match the form $y = |x - h| + k$.** ${form ? `Write the signs as the form has them:${steps(`y = ${fn} = ${form}`)}So` : "The equation is already in this form, so"} $h = ${h}$ and $k = ${k}$.

**Step 2: the vertex.** The inside is $0$ at $x = ${h}$, and there $y = ${k}$, so the vertex is $${pt(h, k)}$.

**Check.** At the vertex $y = ${absEval(Q.one, h, kq, hq)}$, and one unit to either side, $y = ${absEval(Q.one, h, kq, hq.add(Q.one))}$, which is higher, as it should be next to the lowest point.`,
            `**第一步：对照 $y = |x - h| + k$ 的形式。** ${form ? `按这个形式写出符号：${steps(`y = ${fn} = ${form}`)}所以` : "方程已经是这个形式，所以"} $h = ${h}$，$k = ${k}$。

**第二步：顶点。** 里面在 $x = ${h}$ 时为 $0$，此时 $y = ${k}$，所以顶点是 $${pt(h, k)}$。

**检验。** 在顶点处 $y = ${absEval(Q.one, h, kq, hq)}$；向任意一侧走一个单位，$y = ${absEval(Q.one, h, kq, hq.add(Q.one))}$，更高，最低点旁边理应如此。`,
          ),
        });
      },
    },
    {
      id: "equations-from-graphs",
      figure: algebraDrawings["absolute-value-graphs#equations-from-graphs"],
      title: t("Equations from graphs", "由图象写解析式"),
      explanation: t(
        `A V of the same shape as $y = |x|$ rises one unit for each unit it moves away from its vertex, on either side. If such a V has its vertex at $(h, k)$, it is the graph of $y = |x - h| + k$. So read off the vertex, write the equation, and check it with another point of the graph.

A V with vertex $(-1, 3)$ is $y = |x - (-1)| + 3 = |x + 1| + 3$. One unit to the right of the vertex, at $x = 0$, the equation gives $|0 + 1| + 3 = 4$, one unit higher than the vertex, as the graph shows.

> **Watch out.** Put $h$ in with the opposite sign: a vertex at $x = -1$ gives $|x + 1|$, not $|x - 1|$. The height of the vertex is $k$, added outside the bars, not put inside. And do not swap the coordinates: the $x$-coordinate goes inside.`,
        `与 $y = |x|$ 形状相同的 V 形，在顶点两侧每离开一个单位就升高一个单位。如果这样的 V 形顶点在 $(h, k)$，它就是 $y = |x - h| + k$ 的图象。所以读出顶点，写出解析式，再用图象上的另一个点检验。

顶点为 $(-1, 3)$ 的 V 形是 $y = |x - (-1)| + 3 = |x + 1| + 3$。在顶点右边一个单位处，即 $x = 0$，解析式给出 $|0 + 1| + 3 = 4$，比顶点高一个单位，和图象一致。

> **注意。** $h$ 放进去时符号相反：顶点在 $x = -1$ 处得到 $|x + 1|$，不是 $|x - 1|$。顶点的高度 $k$ 加在绝对值外面，不放进里面。也不要把坐标对调：$x$ 坐标放在里面。`,
      ),
      generate(rng) {
        const h = rng.int(-4, 4);
        const k = rng.int(-4, 3);
        const answer = absFn(1, h, k);
        const raw = inForm(Q.one, h, Q.of(k));
        const write = raw ? chain(raw, answer) : answer;
        const [hq, kq] = [Q.of(h), Q.of(k)];
        return annotate(
          {
            ...expressionProblem({
              prompt: graphPrompt,
              answer,
              prefix: "y =",
              wrong: [absFn(1, -h, k), absFn(1, k, h), absFn(1, h, -k), absFn(1, -h, -k)],
              solution: t(
                `**Step 1: read the vertex.** The lowest point of the V is $${pt(h, k)}$, and the V has the shape of $y = |x|$.

**Step 2: write the equation.** Put $h = ${h}$ and $k = ${k}$ into $y = |x - h| + k$:${steps(`y = ${write}`)}**Check.** One unit right of the vertex, the graph passes through $${pt(h + 1, k + 1)}$, and the equation gives $y = ${absEval(Q.one, h, kq, hq.add(Q.one))}$ at $x = ${h + 1}$.`,
                `**第一步：读出顶点。** V 形的最低点是 $${pt(h, k)}$，形状和 $y = |x|$ 一样。

**第二步：写出解析式。** 把 $h = ${h}$，$k = ${k}$ 代入 $y = |x - h| + k$：${steps(`y = ${write}`)}**检验。** 在顶点右边一个单位处，图象经过 $${pt(h + 1, k + 1)}$，而解析式在 $x = ${h + 1}$ 时给出 $y = ${absEval(Q.one, h, kq, hq.add(Q.one))}$。`,
              ),
            }),
            figure: vFigure(Q.one, h, Q.of(k), [[h, k]]),
          },
          view,
          shift([0, 0], [h, k]),
          `The vertex of y = |x| moves to ${at([h, k])}.`,
          `y = |x| 的顶点移到 ${at([h, k])}。`,
        );
      },
    },
    {
      id: "translating-the-graph",
      figure: algebraDrawings["absolute-value-graphs#translating-the-graph"],
      title: t("Translating the graph", "平移图象"),
      explanation: t(
        `Moving the graph of $y = |x|$ moves its vertex from $(0, 0)$, and the equation follows the vertex. Moving it $h$ units right puts the vertex at $x = h$, which needs $|x - h|$; moving it $k$ units up adds $k$. Left and down are negative moves.

So moving $y = |x|$ $3$ units **left** and $2$ units **down** puts the vertex at $(-3, -2)$ and gives

$$y = |x - (-3)| + (-2) = |x + 3| - 2.$$

> **Watch out.** A move to the left gives a **plus** sign inside the bars: $|x + 3|$, not $|x - 3|$. Up and down go outside the bars, with their own sign: down $2$ is $-2$. Keep the two moves apart; the sideways move goes inside, the vertical move outside.`,
        `移动 $y = |x|$ 的图象，就是把它的顶点从 $(0, 0)$ 移走，解析式跟着顶点变。向右移 $h$ 个单位，顶点到 $x = h$，需要 $|x - h|$；向上移 $k$ 个单位，就加上 $k$。向左、向下是负的移动。

所以把 $y = |x|$ 向**左**移 $3$ 个单位、向**下**移 $2$ 个单位，顶点到 $(-3, -2)$，得到

$$y = |x - (-3)| + (-2) = |x + 3| - 2.$$

> **注意。** 向左移在绝对值里面得到**加**号：$|x + 3|$，不是 $|x - 3|$。上下移动写在绝对值外面，带着自己的符号：向下 $2$ 就是 $-2$。两个移动要分开：左右移动在里面，上下移动在外面。`,
      ),
      generate(rng) {
        const h = rng.nonZero(-8, 8);
        const k = rng.nonZero(-8, 8);
        const answer = absFn(1, h, k);
        const hx = Math.abs(h);
        const kx = Math.abs(k);
        const en = `$${hx}$ unit${hx === 1 ? "" : "s"} ${h > 0 ? "right" : "left"} and $${kx}$ unit${kx === 1 ? "" : "s"} ${k > 0 ? "up" : "down"}`;
        const zh = `向${h > 0 ? "右" : "左"}平移 $${hx}$ 个单位，再向${k > 0 ? "上" : "下"}平移 $${kx}$ 个单位`;
        const raw = inForm(Q.one, h, Q.of(k));
        const write = raw ? chain(raw, answer) : answer;
        return expressionProblem({
          prompt: t(
            `The graph of $y = |x|$ is moved ${en}. Write the equation of the new graph.`,
            `把 $y = |x|$ 的图象${zh}。写出所得图象的解析式。`,
          ),
          answer,
          prefix: "y =",
          wrong: [absFn(1, -h, k), absFn(1, k, h), absFn(1, h, -k), absFn(1, -h, -k)],
          solution: t(
            `**Step 1: follow the vertex.** The vertex starts at $(0, 0)$. Moving ${h > 0 ? "right" : "left"} $${hx}$ makes its $x$-coordinate $${h}$, and moving ${k > 0 ? "up" : "down"} $${kx}$ makes its $y$-coordinate $${k}$. The new vertex is $${pt(h, k)}$.

**Step 2: write the equation** with $h = ${h}$ and $k = ${k}$:${steps(`y = ${write}`)}**Check.** At $x = ${h}$ the new equation gives $y = ${absEval(Q.one, h, Q.of(k), Q.of(h))}$, so the vertex is where the moves put it.`,
            `**第一步：跟着顶点走。** 顶点从 $(0, 0)$ 出发。向${h > 0 ? "右" : "左"}移 $${hx}$，它的横坐标变成 $${h}$；向${k > 0 ? "上" : "下"}移 $${kx}$，纵坐标变成 $${k}$。新的顶点是 $${pt(h, k)}$。

**第二步：写出解析式**，$h = ${h}$，$k = ${k}$：${steps(`y = ${write}`)}**检验。** 当 $x = ${h}$ 时新解析式给出 $y = ${absEval(Q.one, h, Q.of(k), Q.of(h))}$，所以顶点正在移动后的位置。`,
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
  intro: t(
    `The graph of $y = |x - h| + k$ is the V of $y = |x|$ moved so that its vertex is at $(h, k)$. It always opens upward, because an absolute value is never negative.

Now put a minus sign in front: $y = -|x|$. Every height becomes its opposite. At $x = 2$, $|x|$ is $2$, so $-|x|$ is $-2$; at $x = -3$ it is $-3$. Each point of the V flips to the other side of the $x$-axis, the same distance away:

{{figure 0}}

The result is the same V upside down: the graph of $y = |x|$ **reflected in the $x$-axis**. Its vertex is still $(0, 0)$, but now it is the highest point. In this lesson we read such graphs, write their equations, and reflect any absolute value graph in the $x$-axis.`,
    `$y = |x - h| + k$ 的图象是把 $y = |x|$ 的 V 形移到顶点为 $(h, k)$ 的位置。它总是开口向上，因为绝对值不会是负数。

现在在前面加一个负号：$y = -|x|$。每个高度都变成它的相反数。在 $x = 2$ 处，$|x|$ 是 $2$，所以 $-|x|$ 是 $-2$；在 $x = -3$ 处它是 $-3$。V 形上的每个点都翻到 $x$ 轴的另一侧，距离不变：

{{figure 0}}

结果是同一个 V 形倒过来：$y = |x|$ 的图象**关于 $x$ 轴翻折**。顶点仍是 $(0, 0)$，但现在它是最高点。这节课我们读这样的图象，写出它们的解析式，并把任意绝对值函数的图象关于 $x$ 轴翻折。`,
  ),
  introFigures: [
    graphFigure(
      view,
      [
        { kind: "curve", f: Math.abs, dashed: true },
        ...vMarks(Q.of(-1), 0, Q.zero),
        { kind: "arrow", from: [2, 2], to: [2, -2] },
        { kind: "arrow", from: [-3, 3], to: [-3, -3] },
      ],
      "The V of y = |x|, dashed, and its reflection in the x-axis, the upside-down V of y = −|x|. Arrows take (2, 2) to (2, −2) and (−3, 3) to (−3, −3).",
      "虚线是 y = |x| 的 V 形，实线是它关于 x 轴翻折得到的倒 V 形 y = −|x|。箭头把 (2, 2) 带到 (2, −2)，把 (−3, 3) 带到 (−3, −3)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "opening-upward-or-downward",
      figure: algebraDrawings["vertical-reflections-of-absolute-value-graphs#opening-upward-or-downward"],
      title: t("Opening upward or downward", "开口向上或向下"),
      explanation: t(
        `A minus sign in front of the absolute value turns every height into its opposite, so the V opens **downward**. The rest of the equation still places the vertex: $y = -|x - h| + k$ has its vertex at $(h, k)$, now the **highest** point, because $-|x - h|$ is $0$ there and negative everywhere else.

For $y = -|x + 4| + 1$: the minus sign makes it open downward, and the vertex is $(-4, 1)$. At $x = -3$ the height is $-|1| + 1 = 0$, lower than the vertex.

> **Watch out.** Only a minus sign **in front of the bars** turns the V over; a minus sign inside, as in $|x - 4|$, moves it sideways instead. The vertex is read as before: $|x + 4|$ puts it at $x = -4$, not $4$.`,
        `绝对值前面的负号把每个高度变成相反数，所以 V 形开口**向下**。方程的其余部分仍然决定顶点：$y = -|x - h| + k$ 的顶点在 $(h, k)$，现在是**最高**点，因为 $-|x - h|$ 在那里为 $0$，在其他地方都是负数。

对 $y = -|x + 4| + 1$：负号使它开口向下，顶点是 $(-4, 1)$。在 $x = -3$ 处高度是 $-|1| + 1 = 0$，比顶点低。

> **注意。** 只有**绝对值前面**的负号才会把 V 形翻过来；里面的负号，比如 $|x - 4|$ 中的，是让它左右移动。顶点和以前一样读：$|x + 4|$ 把顶点放在 $x = -4$，不是 $4$。`,
      ),
      generate(rng) {
        const a = rng.bool(0.6) ? -1 : 1;
        const h = rng.nonZero(-8, 8);
        const k = rng.int(-8, 8);
        const opt = (down: boolean, x: number) =>
          t(`It opens ${down ? "downward" : "upward"}, with vertex $${pt(x, k)}$.`, `开口向${down ? "下" : "上"}，顶点为 $${pt(x, k)}$。`);
        const options = [opt(a < 0, h), opt(a > 0, h), opt(a < 0, -h), opt(a > 0, -h)];
        const order = rng.shuffle([0, 1, 2, 3]);
        const [A, hq, kq] = [Q.of(a), Q.of(h), Q.of(k)];
        const down = a < 0;
        return choiceProblem({
          prompt: t(`Which describes the graph of $y = ${absFn(a, h, k)}$?`, `哪一项描述了 $y = ${absFn(a, h, k)}$ 的图象？`),
          options: order.map((i) => options[i]!),
          correct: order.indexOf(0),
          solution: t(
            `**Step 1: the opening.** ${down ? "There is a minus sign in front of the bars, so every height of the V is turned over and it opens downward." : "There is no minus sign in front of the bars, so the V opens upward."}

**Step 2: the vertex.** The inside, $${linear(1, -h)}$, is $0$ at $x = ${h}$, and there $y = ${k}$. The vertex is $${pt(h, k)}$.

**Check.** At the vertex the height is $${k}$. One unit to the right, at $x = ${h + 1}$, it should be ${down ? "lower" : "higher"} than $${k}$, and it is: $y = ${absEval(A, h, kq, hq.add(Q.one))}$`,
            `**第一步：开口方向。** ${down ? "绝对值前面有负号，V 形的每个高度都被翻过来，所以开口向下。" : "绝对值前面没有负号，所以 V 形开口向上。"}

**第二步：顶点。** 里面的 $${linear(1, -h)}$ 在 $x = ${h}$ 时为 $0$，此时 $y = ${k}$。顶点是 $${pt(h, k)}$。

**检验。** 顶点处的高度是 $${k}$。向右一个单位，在 $x = ${h + 1}$ 处，高度应该比 $${k}$ ${down ? "低" : "高"}，确实如此：$y = ${absEval(A, h, kq, hq.add(Q.one))}$`,
          ),
        });
      },
    },
    {
      id: "equations-of-downward-graphs",
      figure: algebraDrawings["vertical-reflections-of-absolute-value-graphs#equations-of-downward-graphs"],
      title: t("Equations from graphs", "由图象写解析式"),
      explanation: t(
        `To write the equation of a V of the same shape as $y = |x|$, read two things from the graph: which way it opens, and where its vertex $(h, k)$ is. Opening downward, it is $y = -|x - h| + k$; opening upward, $y = |x - h| + k$.

A V opening downward from $(2, 3)$ is $y = -|x - 2| + 3$. Check one unit to the right: $-|3 - 2| + 3 = 2$, one unit lower than the vertex, as on the graph.

> **Watch out.** Look at which way the V points before writing anything: a downward V needs the minus sign **in front of the bars**. Then the vertex goes in as for any V: its $x$-coordinate with the opposite sign inside, its $y$-coordinate with its own sign outside.`,
        `要写出与 $y = |x|$ 形状相同的 V 形图象的解析式，从图上读两件事：开口方向，以及顶点 $(h, k)$ 的位置。开口向下是 $y = -|x - h| + k$，开口向上是 $y = |x - h| + k$。

从 $(2, 3)$ 开口向下的 V 形是 $y = -|x - 2| + 3$。在右边一个单位处检验：$-|3 - 2| + 3 = 2$，比顶点低一个单位，和图上一致。

> **注意。** 动笔之前先看 V 形朝哪边：开口向下就需要在**绝对值前面**加负号。然后像其他 V 形一样代入顶点：横坐标以相反的符号放在里面，纵坐标带着自己的符号放在外面。`,
      ),
      generate(rng) {
        const a = rng.bool(0.8) ? -1 : 1;
        const h = rng.int(-4, 4);
        const k = a < 0 ? rng.int(-3, 4) : rng.int(-4, 3);
        const answer = absFn(a, h, k);
        const A = Q.of(a);
        const raw = inForm(A, h, Q.of(k));
        const write = raw ? chain(raw, answer) : answer;
        const down = a < 0;
        return annotate(
          {
            ...expressionProblem({
              prompt: graphPrompt,
              answer,
              prefix: "y =",
              wrong: [absFn(-a, h, k), absFn(a, -h, k), absFn(a, h, -k)],
              solution: t(
                `**Step 1: read the graph.** The V opens ${down ? "downward, so there is a minus sign in front of the bars" : "upward, so there is no minus sign in front of the bars"}. Its vertex, the ${down ? "highest" : "lowest"} point, is $${pt(h, k)}$.

**Step 2: write the equation** with $h = ${h}$ and $k = ${k}$:${steps(`y = ${write}`)}**Check.** One unit right of the vertex the graph passes through $${pt(h + 1, k + a)}$. The equation gives the same height at $x = ${h + 1}$: $y = ${absEval(A, h, Q.of(k), Q.of(h + 1))}$`,
                `**第一步：读图。** V 形开口${down ? "向下，所以绝对值前面有负号" : "向上，所以绝对值前面没有负号"}。它的顶点，即${down ? "最高" : "最低"}点，是 $${pt(h, k)}$。

**第二步：写出解析式**，$h = ${h}$，$k = ${k}$：${steps(`y = ${write}`)}**检验。** 在顶点右边一个单位处，图象经过 $${pt(h + 1, k + a)}$。解析式在 $x = ${h + 1}$ 时给出同样的高度：$y = ${absEval(A, h, Q.of(k), Q.of(h + 1))}$`,
              ),
            }),
            figure: vFigure(A, h, Q.of(k), [[h, k]]),
          },
          view,
          shift([0, 0], [h, k]),
          `The vertex of the graph is ${at([h, k])}, and it opens ${down ? "downward" : "upward"}.`,
          `图象的顶点是 ${at([h, k])}，开口向${down ? "下" : "上"}。`,
        );
      },
    },
    {
      id: "reflecting-in-the-x-axis",
      figure: algebraDrawings["vertical-reflections-of-absolute-value-graphs#reflecting-in-the-x-axis"],
      title: t("Reflecting in the x-axis", "关于 x 轴翻折"),
      explanation: t(
        `Reflecting a graph in the $x$-axis keeps each $x$ and turns each height $y$ into $-y$. So the reflection of $y = f(x)$ is $y = -f(x)$: the **whole** right side is multiplied by $-1$. The reflection of $y = |x - 1| + 3$ is

$$y = -(|x - 1| + 3) = -|x - 1| - 3.$$

The vertex $(1, 3)$ is reflected too, to $(1, -3)$: the $x$-coordinate stays, the $y$-coordinate changes sign.

> **Watch out.** The minus sign reaches **every** term, the constant included: $-|x - 1| + 3$ reflects only the bars and leaves the vertex at height $3$. Nothing changes inside the bars, since the reflection does not move points sideways: $|x - 1|$ does not become $|x + 1|$.`,
        `把图象关于 $x$ 轴翻折，每个 $x$ 不变，每个高度 $y$ 变成 $-y$。所以 $y = f(x)$ 翻折后是 $y = -f(x)$：**整个**右边乘以 $-1$。$y = |x - 1| + 3$ 翻折后是

$$y = -(|x - 1| + 3) = -|x - 1| - 3.$$

顶点 $(1, 3)$ 也被翻折到 $(1, -3)$：横坐标不变，纵坐标变号。

> **注意。** 负号要作用到**每一项**，包括常数：$-|x - 1| + 3$ 只翻折了绝对值，顶点仍在高度 $3$。绝对值里面不变，因为翻折不会左右移动点：$|x - 1|$ 不会变成 $|x + 1|$。`,
      ),
      generate(rng) {
        const a = rng.bool(0.7) ? 1 : -1;
        const h = rng.nonZero(-8, 8);
        const k = rng.nonZero(-8, 8);
        const answer = absFn(-a, h, -k);
        const old = absFn(a, h, k);
        const x1 = Q.of(h + 1);
        return expressionProblem({
          prompt: t(
            `The graph of $y = ${old}$ is reflected in the $x$-axis. Write the equation of the new graph.`,
            `把 $y = ${old}$ 的图象关于 $x$ 轴翻折。写出所得图象的解析式。`,
          ),
          answer,
          prefix: "y =",
          wrong: [absFn(-a, h, k), absFn(a, -h, k), absFn(-a, -h, -k)],
          solution: t(
            `**Step 1: multiply the whole right side by $-1$.** Reflecting in the $x$-axis turns each height into its opposite:${steps(`y = -(${old})`)}**Step 2: let the minus sign reach every term.** The inside of the bars does not change:${steps(`y = ${answer}`)}**Check.** The vertex $${pt(h, k)}$ should go to $${pt(h, -k)}$: at $x = ${h}$ the new equation gives $y = ${absEval(Q.of(-a), h, Q.of(-k), Q.of(h))}$. At $x = ${h + 1}$ the old graph has height $${absAt(Q.of(a), h, Q.of(k), x1).toLatex()}$, so the new one should have the opposite height, and it does: $y = ${absEval(Q.of(-a), h, Q.of(-k), x1)}$`,
            `**第一步：整个右边乘以 $-1$。** 关于 $x$ 轴翻折把每个高度变成相反数：${steps(`y = -(${old})`)}**第二步：让负号作用到每一项。** 绝对值里面不变：${steps(`y = ${answer}`)}**检验。** 顶点 $${pt(h, k)}$ 应该变到 $${pt(h, -k)}$：当 $x = ${h}$ 时新解析式给出 $y = ${absEval(Q.of(-a), h, Q.of(-k), Q.of(h))}$。在 $x = ${h + 1}$ 处原图象高度是 $${absAt(Q.of(a), h, Q.of(k), x1).toLatex()}$，新图象的高度应该是它的相反数，确实如此：$y = ${absEval(Q.of(-a), h, Q.of(-k), x1)}$`,
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
  intro: t(
    `The V of $y = |x|$ has two straight arms: to the right of $0$ it is the line $y = x$, with slope $1$, and to the left the line $y = -x$, with slope $-1$. Moving the V changes where it sits, but not how steep it is.

Multiplying by a number does change the steepness. Compare $y = |x|$ with $y = 2|x|$:

| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $\\vert x\\vert$ | $2$ | $1$ | $0$ | $1$ | $2$ |
| $2\\vert x\\vert$ | $4$ | $2$ | $0$ | $2$ | $4$ |

Every height is doubled. The vertex, at height $0$, stays where it is, and the arms now climb $2$ for each step sideways: their slopes are $2$ and $-2$. The V is **stretched vertically** and looks narrower:

{{figure 0}}

A factor between $0$ and $1$, such as $\\frac{1}{2}$, does the opposite: it squashes the V and makes it wider. In this lesson we read the slopes of the arms from the factor, compare how narrow graphs are, and find the factor from a graph.`,
    `$y = |x|$ 的 V 形有两条笔直的支：在 $0$ 的右边是直线 $y = x$，斜率为 $1$；在左边是直线 $y = -x$，斜率为 $-1$。平移 V 形会改变它的位置，但不改变它的陡峭程度。

乘以一个数却会改变陡峭程度。比较 $y = |x|$ 和 $y = 2|x|$：

| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $\\vert x\\vert$ | $2$ | $1$ | $0$ | $1$ | $2$ |
| $2\\vert x\\vert$ | $4$ | $2$ | $0$ | $2$ | $4$ |

每个高度都翻了一倍。顶点的高度是 $0$，位置不变；两支现在每向旁边走一步就上升 $2$，斜率是 $2$ 和 $-2$。V 形在**竖直方向被伸长**，看起来更窄：

{{figure 0}}

介于 $0$ 和 $1$ 之间的系数，比如 $\\frac{1}{2}$，作用正好相反：它把 V 形压扁，使它变宽。这节课我们由系数读出两支的斜率，比较图象的宽窄，并由图象求出系数。`,
  ),
  introFigures: [
    graphFigure(
      view,
      [
        { kind: "curve", f: Math.abs, dashed: true },
        ...vMarks(Q.of(2), 0, Q.zero),
        { kind: "arrow", from: [2, 2], to: [2, 4] },
        { kind: "arrow", from: [-2, 2], to: [-2, 4] },
      ],
      "The V of y = |x|, dashed, and the narrower V of y = 2|x|. Arrows take (2, 2) up to (2, 4) and (−2, 2) up to (−2, 4).",
      "虚线是 y = |x| 的 V 形，实线是更窄的 y = 2|x|。箭头把 (2, 2) 向上带到 (2, 4)，把 (−2, 2) 向上带到 (−2, 4)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "slopes-of-the-arms",
      figure: algebraDrawings["stretches-of-absolute-value-graphs#slopes-of-the-arms"],
      title: t("Slopes of the arms", "两支的斜率"),
      explanation: t(
        `For $a > 0$, the graph of $y = a|x|$ multiplies every height of $y = |x|$ by $a$. On each side of $0$ the bars can be dropped: for $x > 0$, $|x| = x$, so the right arm is the line $y = ax$, with slope $a$; for $x < 0$, $|x| = -x$, so the left arm is $y = -ax$, with slope $-a$.

Adding $k$ moves the graph up or down without changing the slopes. For $y = 3|x| - 2$, the right arm is $y = 3x - 2$ and the left arm is $y = -3x - 2$: slopes $3$ and $-3$.

> **Watch out.** The two arms have **opposite** slopes: the left arm falls as $x$ grows, so its slope is $-a$, not $a$. The slope is the factor $a$ itself, not $\\frac{1}{a}$, and the constant $k$ is the height of the vertex, not a slope.`,
        `当 $a > 0$ 时，$y = a|x|$ 的图象把 $y = |x|$ 的每个高度都乘以 $a$。在 $0$ 的两侧都可以去掉绝对值：$x > 0$ 时 $|x| = x$，所以右支是直线 $y = ax$，斜率为 $a$；$x < 0$ 时 $|x| = -x$，所以左支是 $y = -ax$，斜率为 $-a$。

加上 $k$ 只是把图象上下移动，不改变斜率。对 $y = 3|x| - 2$，右支是 $y = 3x - 2$，左支是 $y = -3x - 2$：斜率是 $3$ 和 $-3$。

> **注意。** 两支的斜率**互为相反数**：左支随 $x$ 增大而下降，所以斜率是 $-a$，不是 $a$。斜率就是系数 $a$ 本身，不是 $\\frac{1}{a}$；常数 $k$ 是顶点的高度，不是斜率。`,
      ),
      keyPrerequisites: ["slope-of-a-line"],
      generate(rng) {
        const a = rng.pick(factors);
        const k = rng.int(-9, 9);
        const right = rng.bool();
        const answer = right ? a : a.neg();
        const arm = right ? `y = ${linear(a, k)}` : chain(`y = ${a.toLatex()}\\left(-x\\right)${tail(k)}`, linear(answer, k));
        const [x1, x2] = right ? [1, 2] : [-2, -1];
        const [y1, y2] = [absAt(a, 0, Q.of(k), Q.of(x1)), absAt(a, 0, Q.of(k), Q.of(x2))];
        const change = y2.sub(y1).toLatex();
        return numberProblem({
          prompt: t(
            `What is the slope of the ${right ? "right" : "left"} arm of the graph of $y = ${absFn(a, 0, k)}$, where $x ${right ? ">" : "<"} 0$?`,
            `$y = ${absFn(a, 0, k)}$ 的图象在 $x ${right ? ">" : "<"} 0$ 的那一支（${right ? "右" : "左"}支）的斜率是多少？`,
          ),
          answer,
          wrong: [answer.neg(), Q.one.div(answer), Q.of(k), Q.one],
          solution: t(
            `**Step 1: drop the bars on this arm.** For $x ${right ? ">" : "<"} 0$, $|x| = ${right ? "x" : "-x"}$, so the arm is the line${steps(arm)}**Step 2: read the slope.** The coefficient of $x$ is the slope: $${answer.toLatex()}$.

**Check.** Two points on this arm are $${pt(x1, y1)}$ and $${pt(x2, y2)}$. From one to the other the run is $1$ and the height changes by $${change}$, so the slope is $${change}$.`,
            `**第一步：在这一支上去掉绝对值。** 当 $x ${right ? ">" : "<"} 0$ 时 $|x| = ${right ? "x" : "-x"}$，所以这一支是直线${steps(arm)}**第二步：读出斜率。** $x$ 的系数就是斜率：$${answer.toLatex()}$。

**检验。** 这一支上有两个点 $${pt(x1, y1)}$ 和 $${pt(x2, y2)}$。从前一个到后一个，水平变化量是 $1$，高度变化了 $${change}$，所以斜率是 $${change}$。`,
          ),
        });
      },
    },
    {
      id: "narrower-and-wider-graphs",
      figure: algebraDrawings["stretches-of-absolute-value-graphs#narrower-and-wider-graphs"],
      title: t("Narrower and wider", "变窄与变宽"),
      explanation: t(
        `In $y = a|x|$ with $a > 0$, the arms have slopes $a$ and $-a$. A larger $a$ makes the arms steeper, so the V is **narrower**; a smaller $a$ makes them flatter, so the V is **wider**. For $a > 1$ the graph is a vertical stretch of $y = |x|$ (narrower); for $0 < a < 1$ it is a vertical compression (wider).

To compare $y = 4|x|$, $y = |x|$ and $y = \\frac{1}{2}|x|$, order the factors: $\\frac{1}{2} < 1 < 4$. So $y = 4|x|$ is the narrowest and $y = \\frac{1}{2}|x|$ the widest. At $x = 1$ their heights are $4$, $1$ and $\\frac{1}{2}$: the narrowest V climbs highest.

> **Watch out.** A **larger** factor gives a **narrower** V, not a wider one. A fraction is smaller than $1$ and widens the V; compare fractions by their values, not by their denominators: $\\frac{1}{3} < \\frac{1}{2}$.`,
        `在 $y = a|x|$（$a > 0$）中，两支的斜率是 $a$ 和 $-a$。$a$ 越大两支越陡，V 形就越**窄**；$a$ 越小两支越平缓，V 形就越**宽**。$a > 1$ 时图象是 $y = |x|$ 竖直方向的伸长（变窄）；$0 < a < 1$ 时是竖直方向的压缩（变宽）。

比较 $y = 4|x|$、$y = |x|$ 和 $y = \\frac{1}{2}|x|$，先把系数排序：$\\frac{1}{2} < 1 < 4$。所以 $y = 4|x|$ 最窄，$y = \\frac{1}{2}|x|$ 最宽。在 $x = 1$ 处它们的高度分别是 $4$、$1$ 和 $\\frac{1}{2}$：最窄的 V 形升得最高。

> **注意。** 系数**越大**，V 形**越窄**，不是越宽。分数小于 $1$，会使 V 形变宽；比较分数要看它们的大小，不要只看分母：$\\frac{1}{3} < \\frac{1}{2}$。`,
      ),
      generate(rng) {
        const as = rng.sample([Q.one, ...factors], 4);
        const narrowest = rng.bool();
        const pick = as.reduce((best, a, i) => ((narrowest ? a.cmp(as[best]!) > 0 : a.cmp(as[best]!) < 0) ? i : best), 0);
        const chosen = as[pick]!;
        const order = [...as].sort((p, q) => p.cmp(q)).map((a) => a.toLatex());
        const heights = as.map((a) => `$${a.toLatex()}$`);
        return reasoned(
          choiceProblem({
            prompt: t(
              `Which of these graphs is the ${narrowest ? "narrowest" : "widest"}: ${as.map((a) => `$y = ${absFn(a, 0, 0)}$`).join(", ")}?`,
              `下列图象中哪个最${narrowest ? "窄" : "宽"}：${as.map((a) => `$y = ${absFn(a, 0, 0)}$`).join("、")}？`,
            ),
            options: as.map((a) => same(`$y = ${absFn(a, 0, 0)}$`)),
            correct: pick,
            solution: t(
              `**Step 1: order the factors.** Each graph is $y = a|x|$ with $a > 0$, and its arms have slopes $a$ and $-a$. From smallest to largest:${steps(order.join(" < "))}**Step 2: choose.** The ${narrowest ? "largest" : "smallest"} factor, $${chosen.toLatex()}$, gives the ${narrowest ? "steepest" : "flattest"} arms, so the ${narrowest ? "narrowest" : "widest"} graph is $y = ${absFn(chosen, 0, 0)}$.

**Check.** At $x = 1$ the graphs reach heights ${heights.join(", ")}, in the order listed. The ${narrowest ? "highest" : "lowest"} of these is $${chosen.toLatex()}$, so $y = ${absFn(chosen, 0, 0)}$ climbs ${narrowest ? "fastest" : "slowest"} away from the vertex.`,
              `**第一步：把系数排序。** 每个图象都是 $y = a|x|$（$a > 0$），两支的斜率是 $a$ 和 $-a$。从小到大：${steps(order.join(" < "))}**第二步：选择。** 最${narrowest ? "大" : "小"}的系数 $${chosen.toLatex()}$ 使两支最${narrowest ? "陡" : "平缓"}，所以最${narrowest ? "窄" : "宽"}的图象是 $y = ${absFn(chosen, 0, 0)}$。

**检验。** 在 $x = 1$ 处，各图象按所列顺序的高度是 ${heights.join("、")}。其中最${narrowest ? "高" : "低"}的是 $${chosen.toLatex()}$，所以 $y = ${absFn(chosen, 0, 0)}$ 离开顶点后升得最${narrowest ? "快" : "慢"}。`,
            ),
          }),
          [
            ...as.map(
              (a): Reason => [
                `$y = ${absFn(a, 0, 0)}$`,
                narrowest
                  ? `Its factor $${a.toLatex()}$ is smaller than $${chosen.toLatex()}$, so its arms are flatter and the graph is wider.`
                  : `Its factor $${a.toLatex()}$ is larger than $${chosen.toLatex()}$, so its arms are steeper and the graph is narrower.`,
                narrowest
                  ? `它的系数 $${a.toLatex()}$ 小于 $${chosen.toLatex()}$，所以两支更平缓，图象更宽。`
                  : `它的系数 $${a.toLatex()}$ 大于 $${chosen.toLatex()}$，所以两支更陡，图象更窄。`,
              ],
            ),
          ],
        );
      },
    },
    {
      id: "stretched-graphs-from-graphs",
      figure: algebraDrawings["stretches-of-absolute-value-graphs#stretched-graphs-from-graphs"],
      title: t("Equations from graphs", "由图象写解析式"),
      explanation: t(
        `To find $a$ and $k$ in $y = a|x| + k$ from a graph, first read the vertex $(0, k)$. Then move right from the vertex to another point on the graph where both coordinates are whole numbers: the right arm has slope $a$, so $a$ is the rise divided by the run.

If the graph has its vertex at $(0, -1)$ and passes through $(2, 0)$, the run is $2$ and the rise is $1$, so $a = \\frac{1}{2}$ and $y = \\frac{1}{2}|x| - 1$.

> **Watch out.** The factor is **rise over run**, not run over rise: a V that rises $1$ over a run of $2$ has $a = \\frac{1}{2}$, not $2$. The vertex is on the $y$-axis, so nothing is subtracted inside the bars; its height $k$ goes outside, with its own sign.`,
        `要从图象求 $y = a|x| + k$ 中的 $a$ 和 $k$，先读出顶点 $(0, k)$。再从顶点向右找图象上另一个横纵坐标都是整数的点：右支的斜率是 $a$，所以 $a$ 等于竖直变化量除以水平变化量。

如果图象的顶点在 $(0, -1)$，并经过 $(2, 0)$，水平变化量是 $2$，竖直变化量是 $1$，所以 $a = \\frac{1}{2}$，$y = \\frac{1}{2}|x| - 1$。

> **注意。** 系数是**竖直变化量除以水平变化量**，不要倒过来：水平走 $2$、竖直升 $1$ 的 V 形，$a = \\frac{1}{2}$，不是 $2$。顶点在 $y$ 轴上，所以绝对值里面不减任何数；它的高度 $k$ 带着自己的符号写在外面。`,
      ),
      generate(rng) {
        const a = rng.pick(factors);
        const run = Number(a.d);
        const rise = Number(a.n);
        const k = rng.int(-5, Math.min(5, 6 - rise));
        const answer = absFn(a, 0, k);
        return annotate(
          {
            ...expressionProblem({
              prompt: graphPrompt,
              answer,
              prefix: "y =",
              wrong: [absFn(Q.one.div(a), 0, k), absFn(1, 0, k), absFn(a, 0, -k), absFn(a, k, 0)],
              solution: t(
                `**Step 1: read the vertex.** The lowest point is $${pt(0, k)}$, so $k = ${k}$.

**Step 2: find $a$ from the right arm.** From the vertex, the graph rises $${rise}$ over a run of $${run}$ to $${pt(run, k + rise)}$:${steps(`a = \\frac{\\text{rise}}{\\text{run}} = ${a.toLatex()}`)}**Step 3: write the equation.**${steps(`y = ${answer}`)}**Check.** By symmetry the left arm passes through $${pt(-run, k + rise)}$, and the equation gives at $x = ${-run}$: $y = ${absEval(a, 0, Q.of(k), Q.of(-run))}$`,
                `**第一步：读出顶点。** 最低点是 $${pt(0, k)}$，所以 $k = ${k}$。

**第二步：由右支求 $a$。** 从顶点出发，水平向右 $${run}$ 个单位时图象上升 $${rise}$ 个单位，到达 $${pt(run, k + rise)}$：${steps(`a = \\frac{\\text{竖直变化量}}{\\text{水平变化量}} = ${a.toLatex()}`)}**第三步：写出解析式。**${steps(`y = ${answer}`)}**检验。** 由对称性，左支经过 $${pt(-run, k + rise)}$，而解析式在 $x = ${-run}$ 时给出 $y = ${absEval(a, 0, Q.of(k), Q.of(-run))}$`,
              ),
            }),
            figure: vFigure(a, 0, Q.of(k), [
              [0, k],
              [run, k + rise],
            ]),
          },
          view,
          riseRun([0, k], [run, k + rise]),
          `From the vertex, a run of ${run} goes with a rise of ${rise}.`,
          `从顶点出发，水平走 ${run}，竖直走 ${rise}。`,
        );
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
    `shift $${hx}$ unit${hx === 1 ? "" : "s"} ${h > 0 ? "right" : "left"} and $${kx}$ unit${kx === 1 ? "" : "s"} ${k > 0 ? "up" : "down"}`,
  );
  zh.push(`向${h > 0 ? "右" : "左"}平移 $${hx}$ 个单位，再向${k > 0 ? "上" : "下"}平移 $${kx}$ 个单位`);
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
    { topic: "stretches-of-absolute-value-graphs", weight: 0.3 },
    { topic: "absolute-value-graphs", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7.B"],
  intro: t(
    `We have met three moves on the graph of $y = |x|$ one at a time: a minus sign in front reflects it in the $x$-axis, a factor $a$ stretches it vertically, and $|x - h| + k$ moves its vertex to $(h, k)$. One equation can make all three moves at once.

Take $y = -2|x + 3| - 1$ and follow the point $(1, 1)$ of $y = |x|$:

- the factor $2$ doubles every height: $y = 2|x|$ passes through $(1, 2)$;
- the minus sign turns every height over: $y = -2|x|$ passes through $(1, -2)$;
- $|x + 3| - 1$ moves everything $3$ units left and $1$ unit down: $(1, -2)$ goes to $(-2, -3)$, and the vertex $(0, 0)$ goes to $(-3, -1)$.

{{figure 0}}

Substituting confirms it: at $x = -2$, $y = -2|1| - 1 = -3$. In this lesson we read the three moves from an equation, write the equation of a graph, and work out values.`,
    `我们已经分别学过 $y = |x|$ 图象的三种变换：前面加负号使它关于 $x$ 轴翻折，系数 $a$ 使它在竖直方向伸缩，$|x - h| + k$ 把顶点移到 $(h, k)$。一个解析式可以同时完成这三种变换。

以 $y = -2|x + 3| - 1$ 为例，跟踪 $y = |x|$ 上的点 $(1, 1)$：

- 系数 $2$ 把每个高度翻倍：$y = 2|x|$ 经过 $(1, 2)$；
- 负号把每个高度翻过来：$y = -2|x|$ 经过 $(1, -2)$；
- $|x + 3| - 1$ 把一切向左移 $3$ 个单位、向下移 $1$ 个单位：$(1, -2)$ 变到 $(-2, -3)$，顶点 $(0, 0)$ 变到 $(-3, -1)$。

{{figure 0}}

代入验证：当 $x = -2$ 时，$y = -2|1| - 1 = -3$。这节课我们从解析式读出这三种变换，写出图象的解析式，并计算函数值。`,
  ),
  introFigures: [
    graphFigure(
      view,
      [
        { kind: "curve", f: Math.abs, dashed: true },
        { kind: "curve", f: (x) => -2 * Math.abs(x), dashed: true, tone: "action" },
        ...vMarks(Q.of(-2), -3, Q.of(-1)),
        ...shift([1, -2], [-2, -3]),
        { kind: "point", at: [-3, -1], label: "(−3, −1)", dir: "n" },
      ],
      "Three graphs: y = |x| dashed, y = −2|x| dashed, the narrow upside-down V reflected and stretched from it, and y = −2|x + 3| − 1 solid, the same V moved 3 left and 1 down, with vertex (−3, −1). An arrow takes (1, −2) to (−2, −3).",
      "三个图象：虚线 y = |x|；虚线 y = −2|x|，由它翻折并伸长得到的窄的倒 V 形；实线 y = −2|x + 3| − 1，是同一个 V 形向左移 3、向下移 1，顶点为 (−3, −1)。箭头把 (1, −2) 带到 (−2, −3)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "describing-transformations",
      figure: algebraDrawings["combining-transformations-of-absolute-value-graphs#describing-transformations"],
      title: t("Describing the transformations", "描述变换"),
      explanation: t(
        `The graph of $y = a|x - h| + k$ comes from $y = |x|$ in steps:

1. if $a < 0$, reflect in the $x$-axis;
2. stretch vertically by the factor $|a|$ (a compression if $|a| < 1$);
3. shift so that the vertex moves to $(h, k)$.

The reflection and the stretch keep the vertex at $(0, 0)$, so the shift last carries it to $(h, k)$. For $y = -2|x + 3| - 1$, write it as $-2|x - (-3)| + (-1)$: $a = -2$, $h = -3$, $k = -1$. Reflect, stretch by $2$, then shift $3$ units left and $1$ unit down.

> **Watch out.** Inside the bars the sign is the **opposite** of the move: $|x + 3|$ shifts left, not right. Outside, the constant moves the graph with its **own** sign: $-1$ shifts down. A negative factor asks for a reflection **and** a stretch by $|a|$, not a stretch by a negative number.`,
        `$y = a|x - h| + k$ 的图象可由 $y = |x|$ 分步得到：

1. 若 $a < 0$，关于 $x$ 轴翻折；
2. 竖直方向伸缩为原来的 $|a|$ 倍（$|a| < 1$ 时是压缩）；
3. 平移使顶点移到 $(h, k)$。

翻折和伸缩都让顶点留在 $(0, 0)$，所以最后的平移把它带到 $(h, k)$。对于 $y = -2|x + 3| - 1$，写成 $-2|x - (-3)| + (-1)$：$a = -2$，$h = -3$，$k = -1$。先翻折，再伸长为原来的 $2$ 倍，然后向左平移 $3$ 个单位、向下平移 $1$ 个单位。

> **注意。** 绝对值里面的符号与移动方向**相反**：$|x + 3|$ 是向左移，不是向右。外面的常数带着**自己的**符号移动图象：$-1$ 是向下移。负系数表示既要翻折，**又要**伸缩为原来的 $|a|$ 倍，而不是伸缩为负数倍。`,
      ),
      generate(rng) {
        const a = rng.pick(combinedFactors);
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const options = [transformText(a, h, k), transformText(a.neg(), h, k), transformText(a, -h, k), transformText(a, h, -k)];
        const order = rng.shuffle([0, 1, 2, 3]);
        const A = a.abs();
        const down = a.sign() < 0;
        const raw = inForm(a, h, Q.of(k));
        const shown = raw ? steps(chain(absFn(a, h, k), raw)) : "";
        const stretchEn = A.eq(Q.one)
          ? "$|a| = 1$, so there is no stretch."
          : `$|a| = ${A.toLatex()}$, ${A.cmp(Q.one) > 0 ? "more than" : "less than"} $1$, so the graph is ${A.cmp(Q.one) > 0 ? "stretched" : "compressed"} vertically by a factor of $${A.toLatex()}$.`;
        const stretchZh = A.eq(Q.one)
          ? "$|a| = 1$，所以没有伸缩。"
          : `$|a| = ${A.toLatex()}$，${A.cmp(Q.one) > 0 ? "大于" : "小于"} $1$，所以图象在竖直方向${A.cmp(Q.one) > 0 ? "伸长" : "压缩"}为原来的 $${A.toLatex()}$ 倍。`;
        const [hx, kx] = [Math.abs(h), Math.abs(k)];
        const unitsEn = (n: number) => `$${n}$ unit${n === 1 ? "" : "s"}`;
        const x1 = Q.of(h + 1);
        return reasoned(
          choiceProblem({
            prompt: t(
              `Which sequence of transformations takes the graph of $y = |x|$ to the graph of $y = ${absFn(a, h, k)}$?`,
              `哪一组变换把 $y = |x|$ 的图象变成 $y = ${absFn(a, h, k)}$ 的图象？`,
            ),
            options: order.map((i) => options[i]!),
            correct: order.indexOf(0),
            solution: t(
              `**Step 1: read $a$, $h$ and $k$.** Compare with $a|x - h| + k$${shown ? `:${shown}so` : ":"} $a = ${a.toLatex()}$, $h = ${h}$ and $k = ${k}$.

**Step 2: the reflection and the stretch.** ${down ? "The factor is negative, so the graph is reflected in the $x$-axis." : "The factor is positive, so there is no reflection."} ${stretchEn}

**Step 3: the shift.** The vertex moves from $(0, 0)$ to $${pt(h, k)}$: ${unitsEn(hx)} ${h > 0 ? "right" : "left"} and ${unitsEn(kx)} ${k > 0 ? "up" : "down"}. Together: ${options[0]!.en}

**Check.** Follow the point $(1, 1)$ of $y = |x|$: the reflection and stretch take it to $${pt(1, a)}$, and the shift to $${pt(h + 1, a.add(Q.of(k)))}$. The equation agrees at $x = ${h + 1}$: $y = ${absEval(a, h, Q.of(k), x1)}$`,
              `**第一步：读出 $a$、$h$、$k$。** 与 $a|x - h| + k$ 对照${shown ? `：${shown}所以` : "可知"} $a = ${a.toLatex()}$，$h = ${h}$，$k = ${k}$。

**第二步：翻折与伸缩。** ${down ? "系数是负数，所以图象关于 $x$ 轴翻折。" : "系数是正数，所以没有翻折。"}${stretchZh}

**第三步：平移。** 顶点从 $(0, 0)$ 移到 $${pt(h, k)}$：向${h > 0 ? "右" : "左"} $${hx}$ 个单位，向${k > 0 ? "上" : "下"} $${kx}$ 个单位。合起来：${options[0]!["zh-CN"]}

**检验。** 跟踪 $y = |x|$ 上的点 $(1, 1)$：翻折和伸缩把它带到 $${pt(1, a)}$，平移再把它带到 $${pt(h + 1, a.add(Q.of(k)))}$。解析式在 $x = ${h + 1}$ 处也给出这个高度：$y = ${absEval(a, h, Q.of(k), x1)}$`,
            ),
          }),
          [
            [
              options[1]!.en,
              a.sign() < 0
                ? "This leaves out the reflection that the negative factor asks for."
                : "This adds a reflection, but the factor is positive.",
              a.sign() < 0 ? "这里漏掉了负系数要求的翻折。" : "这里多了翻折，但系数是正的。",
            ],
            [
              options[2]!.en,
              "The horizontal shift goes the wrong way: $|x - h|$ moves the graph $h$ to the right, against what the sign inside seems to say.",
              "水平平移方向反了：$|x - h|$ 把图象向右移 $h$，与绝对值里看到的符号相反。",
            ],
            [
              options[3]!.en,
              "The vertical shift goes the wrong way: the number added outside moves the graph by that amount, sign included.",
              "竖直平移方向反了：加在外面的数连同符号决定图象移动的量。",
            ],
          ],
        );
      },
    },
    {
      id: "combined-equations-from-graphs",
      figure: algebraDrawings["combining-transformations-of-absolute-value-graphs#combined-equations-from-graphs"],
      title: t("Equations from graphs", "由图象写解析式"),
      explanation: t(
        `To write $y = a|x - h| + k$ from a graph, read the vertex $(h, k)$ first. Then go right from the vertex to another point on the graph with whole-number coordinates: the right arm is a line of slope $a$, so $a$ is the change in $y$ divided by the change in $x$. It comes out negative when the graph opens downward.

If the vertex is $(1, 2)$ and the graph passes through $(3, -2)$:

$$a = \\frac{-2 - 2}{3 - 1} = \\frac{-4}{2} = -2,$$

so $y = -2|x - 1| + 2$. Check with the point $(-1, -2)$, on the other arm: $-2|-1 - 1| + 2 = -2 \\cdot 2 + 2 = -2$.

> **Watch out.** The factor is the change in $y$ **over** the change in $x$, not the other way round, and its sign comes from the direction: a V opening downward has $a < 0$. The vertex goes in as for any V: $h$ with the opposite sign inside the bars, $k$ with its own sign outside.`,
        `由图象写 $y = a|x - h| + k$，先读出顶点 $(h, k)$。再从顶点向右找图象上另一个横纵坐标都是整数的点：右支是斜率为 $a$ 的直线，所以 $a$ 等于 $y$ 的变化量除以 $x$ 的变化量。图象开口向下时它是负数。

若顶点是 $(1, 2)$，图象经过 $(3, -2)$：

$$a = \\frac{-2 - 2}{3 - 1} = \\frac{-4}{2} = -2,$$

所以 $y = -2|x - 1| + 2$。用另一支上的点 $(-1, -2)$ 检验：$-2|-1 - 1| + 2 = -2 \\cdot 2 + 2 = -2$。

> **注意。** 系数是 $y$ 的变化量**除以** $x$ 的变化量，不要倒过来；它的符号由开口方向决定：开口向下的 V 形 $a < 0$。顶点和其他 V 形一样代入：$h$ 以相反的符号放在绝对值里面，$k$ 带着自己的符号放在外面。`,
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
        const [x2, y2] = [h + run, k + rise];
        const slope = chain(`\\frac{${y2} - ${paren(k)}}{${x2} - ${paren(h)}}`, `\\frac{${rise}}{${run}}`, a.toLatex());
        const raw = inForm(a, h, Q.of(k));
        const write = raw ? chain(raw, answer) : answer;
        const down = a.sign() < 0;
        return annotate(
          {
            ...expressionProblem({
              prompt: graphPrompt,
              answer,
              prefix: "y =",
              wrong,
              solution: t(
                `**Step 1: read the vertex.** The V opens ${down ? "downward" : "upward"} from $${pt(h, k)}$, so $h = ${h}$ and $k = ${k}$.

**Step 2: find $a$.** The graph also passes through $${pt(x2, y2)}$, on the right arm. Divide the change in $y$ by the change in $x$:${steps(`a = ${slope}`)}**Step 3: write the equation.**${steps(`y = ${write}`)}**Check.** By symmetry the left arm passes through $${pt(h - run, y2)}$. The equation gives the same height at $x = ${h - run}$: $y = ${absEval(a, h, Q.of(k), Q.of(h - run))}$`,
                `**第一步：读出顶点。** V 形从 $${pt(h, k)}$ 开口向${down ? "下" : "上"}，所以 $h = ${h}$，$k = ${k}$。

**第二步：求 $a$。** 图象还经过右支上的点 $${pt(x2, y2)}$。用 $y$ 的变化量除以 $x$ 的变化量：${steps(`a = ${slope}`)}**第三步：写出解析式。**${steps(`y = ${write}`)}**检验。** 由对称性，左支经过 $${pt(h - run, y2)}$。解析式在 $x = ${h - run}$ 时给出同样的高度：$y = ${absEval(a, h, Q.of(k), Q.of(h - run))}$`,
              ),
            }),
            figure: vFigure(a, h, Q.of(k), [
              [h, k],
              [h + run, k + rise],
            ]),
          },
          view,
          [...riseRun([h, k], [h + run, k + rise]), { kind: "point", at: [h, k], tone: "result" }],
          `The vertex is ${at([h, k])}; from it, a run of ${run} goes with a rise of ${rise}.`,
          `顶点是 ${at([h, k])}；从顶点水平走 ${run}，竖直走 ${rise}。`,
        );
      },
    },
    {
      id: "values-and-intercepts",
      title: t("Values and the y-intercept", "函数值与 y 轴截距"),
      explanation: t(
        `To find a value of $f(x) = a|x - h| + k$, follow the order of operations: substitute, work out the inside, take its absolute value, and only then multiply by $a$ and add $k$. The $y$-intercept is the value at $x = 0$, $f(0) = a|-h| + k$. For $f(x) = -3|x + 2| + 5$:

$$f(0) = -3|0 + 2| + 5 = -3|2| + 5 = -3 \\cdot 2 + 5 = -1$$

The graph crosses the $y$-axis at $(0, -1)$.

> **Watch out.** Take the absolute value **before** multiplying by $a$: $-3|-4|$ is $-3 \\cdot 4 = -12$, not $-3 \\cdot (-4) = 12$, and the bars cannot be dropped as if they were brackets. The factor $a$ multiplies only the bars, not the $k$ added after them.`,
        `求 $f(x) = a|x - h| + k$ 的函数值要按运算顺序：代入，算出里面的值，取绝对值，然后才乘以 $a$、加上 $k$。$y$ 轴截距是 $x = 0$ 时的值 $f(0) = a|-h| + k$。对于 $f(x) = -3|x + 2| + 5$：

$$f(0) = -3|0 + 2| + 5 = -3|2| + 5 = -3 \\cdot 2 + 5 = -1$$

图象与 $y$ 轴交于 $(0, -1)$。

> **注意。** 先取绝对值，**再**乘以 $a$：$-3|-4|$ 等于 $-3 \\cdot 4 = -12$，不是 $-3 \\cdot (-4) = 12$；绝对值符号不能当作括号直接去掉。系数 $a$ 只乘绝对值部分，不乘后面加的 $k$。`,
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
        const work = steps(`f(${x}) = ${absEval(a, h, Q.of(k), Q.of(x))}`);
        const mirror = 2 * h - x;
        const addEn = k === 0 ? "" : k > 0 ? ` and adding $${k}$` : ` and subtracting $${-k}$`;
        const addZh = k === 0 ? "" : k > 0 ? `、加上 $${k}$` : `、减去 $${-k}$`;
        const endEn = x === 0 ? ` The graph crosses the $y$-axis at $${pt(0, answer)}$.` : "";
        const endZh = x === 0 ? `图象与 $y$ 轴交于 $${pt(0, answer)}$。` : "";
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
          solution: t(
            `**Step 1: substitute and simplify.** Put $x = ${x}$ into $f$. Work out the inside, $${x}${tail(-h)} = ${inner}$, and take its absolute value, $${Math.abs(inner)}$, before multiplying by $${a.toLatex()}$${addEn}:${work}**Step 2: state the answer.** ${x === 0 ? "The $y$-intercept is" : `$f(${x})$ is`} $${answer.toLatex()}$.${endEn}

**Check.** The graph is symmetric about $x = ${h}$, and $x = ${mirror}$ is as far from $${h}$ as $${x}$ is, on the other side. It should give the same value: $f(${mirror}) = ${absEval(a, h, Q.of(k), Q.of(mirror))}$`,
            `**第一步：代入并化简。** 把 $x = ${x}$ 代入 $f$。先算里面 $${x}${tail(-h)} = ${inner}$，取绝对值得 $${Math.abs(inner)}$，再乘以 $${a.toLatex()}$${addZh}：${work}**第二步：写出答案。** ${x === 0 ? "$y$ 轴截距是" : `$f(${x})$ 等于`} $${answer.toLatex()}$。${endZh}

**检验。** 图象关于 $x = ${h}$ 对称，$x = ${mirror}$ 与 $${x}$ 到 $${h}$ 的距离相同，在另一侧。它应给出同样的值：$f(${mirror}) = ${absEval(a, h, Q.of(k), Q.of(mirror))}$`,
          ),
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
  encompasses: [{ topic: "range-of-a-function", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.5"],
  intro: t(
    `The **domain** of a function is the set of inputs it accepts, and its **range** is the set of outputs it produces. We also know that the graph of $f(x) = a|x - h| + k$ is a V with vertex $(h, k)$, opening upward when $a > 0$ and downward when $a < 0$.

Take $f(x) = -2|x - 5| + 3$. Any number can go in: subtract $5$, take the absolute value, multiply by $-2$ and add $3$. So the domain is all real numbers. The outputs are another matter. Since $|x - 5| \\ge 0$, the product $-2|x - 5|$ is never positive, so $f(x)$ is never more than $3$. The value $3$ itself is reached at the vertex, $x = 5$, and the arms go down forever, so every value below $3$ is reached too. The range is $(-\\infty, 3]$, the part of the $y$-axis the graph covers:

{{figure 0}}

When the graph is drawn only for $x$ between two ends, both sets shrink: the domain is the interval between the ends, and the range runs from the lowest to the highest point of that piece. In this lesson we find domains and ranges from equations and graphs, on all real numbers and on closed intervals.`,
    `函数的**定义域**是它接受的输入组成的集合，**值域**是它产生的输出组成的集合。我们还知道 $f(x) = a|x - h| + k$ 的图象是顶点为 $(h, k)$ 的 V 形，$a > 0$ 时开口向上，$a < 0$ 时开口向下。

以 $f(x) = -2|x - 5| + 3$ 为例。任何数都可以代入：减去 $5$，取绝对值，乘以 $-2$，再加 $3$。所以定义域是全体实数。输出就不同了。因为 $|x - 5| \\ge 0$，乘积 $-2|x - 5|$ 不会是正数，所以 $f(x)$ 不会超过 $3$。值 $3$ 本身在顶点 $x = 5$ 处取到，而两支一直向下延伸，所以小于 $3$ 的每个值也都能取到。值域是 $(-\\infty, 3]$，也就是图象覆盖的那部分 $y$ 轴：

{{figure 0}}

如果图象只画在 $x$ 的两个端点之间，两个集合都会变小：定义域是两端点之间的区间，值域从这一段的最低点到最高点。这节课我们由解析式和图象求定义域与值域，既在全体实数上，也在闭区间上。`,
  ),
  introFigures: [
    graphFigure(
      view,
      [...vMarks(Q.of(-2), 5, Q.of(3)), { kind: "point", at: [5, 3], label: "(5, 3)", dir: "n" }, ...onAxis("y", union(ray("<=", 3)), 6)],
      "The upside-down V of f(x) = −2|x − 5| + 3 with its vertex (5, 3) marked; the y-axis is highlighted from 3 downward, the range (−∞, 3].",
      "f(x) = −2|x − 5| + 3 的倒 V 形图象，标出顶点 (5, 3)；y 轴上从 3 往下的部分被突出显示，即值域 (−∞, 3]。",
    ),
  ],
  knowledgePoints: [
    {
      id: "domain-and-range-from-an-equation",
      figure: algebraDrawings["domain-and-range-of-absolute-value-functions#domain-and-range-from-an-equation"],
      title: t("From an equation", "由解析式求"),
      explanation: t(
        `Every real number can be put into $f(x) = a|x - h| + k$, so the **domain** is $(-\\infty, \\infty)$.

The **range** is decided by the vertex. Because $|x - h| \\ge 0$: if $a > 0$, then $a|x - h| \\ge 0$ and $f(x) \\ge k$; the V opens upward, its lowest value is $k$, and the range is $[k, \\infty)$. If $a < 0$, then $a|x - h| \\le 0$ and $f(x) \\le k$; the range is $(-\\infty, k]$.

For $f(x) = -2|x - 5| + 3$: $a = -2 < 0$, so the range is $(-\\infty, 3]$. Indeed $f(5) = 3$, and $f(6) = 1$ is lower.

> **Watch out.** The range is read from $k$, the **height** of the vertex, not from $h$. Its direction comes from the sign of $a$, and the bracket at $k$ is square, because the vertex value is reached. The domain of these functions is always all real numbers; do not give the range in its place.`,
        `任何实数都可以代入 $f(x) = a|x - h| + k$，所以**定义域**是 $(-\\infty, \\infty)$。

**值域**由顶点决定。因为 $|x - h| \\ge 0$：若 $a > 0$，则 $a|x - h| \\ge 0$，$f(x) \\ge k$；V 形开口向上，最小值是 $k$，值域为 $[k, \\infty)$。若 $a < 0$，则 $a|x - h| \\le 0$，$f(x) \\le k$；值域为 $(-\\infty, k]$。

对 $f(x) = -2|x - 5| + 3$：$a = -2 < 0$，所以值域是 $(-\\infty, 3]$。确实 $f(5) = 3$，而 $f(6) = 1$ 更低。

> **注意。** 值域由顶点的**高度** $k$ 决定，不是由 $h$ 决定。方向由 $a$ 的符号决定；$k$ 处用方括号，因为顶点的值能取到。这类函数的定义域总是全体实数，不要把值域当成定义域。`,
      ),
      generate(rng) {
        const a = rng.pick([...combinedFactors, Q.one]);
        const h = rng.nonZero(-9, 9);
        const k = rng.int(-9, 9);
        const up = a.sign() > 0;
        const rangeSet = union(up ? ray(">=", k) : ray("<=", k));
        const domain = rng.bool(0.25);
        const f = absFn(a, h, k);
        const kq = Q.of(k);
        const term = poly([a, bars(linear(1, -h))]);
        if (domain) {
          return intervalProblem({
            prompt: ask(`Find the domain of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的定义域。`, asInterval),
            set: realLine,
            form: "interval",
            wrong: [rangeSet, union(ray(">=", h))],
            solution: t(
              `**Step 1: ask which inputs work.** For any number $x$, the inside $${linear(1, -h)}$ is a number, its absolute value is a number, and multiplying by $${a.toLatex()}$${k === 0 ? "" : k > 0 ? ` and adding $${k}$` : ` and subtracting $${-k}$`} gives a number. There is no division and no square root, so nothing is ruled out.

**Step 2: write the domain.** Every real number is allowed: the domain is $(-\\infty, \\infty)$.

**Check.** Even inputs far from the vertex work, for example $x = 100$: $f(100) = ${absEval(a, h, kq, Q.of(100))}$`,
              `**第一步：看哪些输入可以。** 对任何数 $x$，里面的 $${linear(1, -h)}$ 是一个数，它的绝对值是一个数，乘以 $${a.toLatex()}$${k === 0 ? "" : k > 0 ? ` 再加上 $${k}$` : ` 再减去 $${-k}$`} 还是一个数。式子里没有除法，也没有开平方，所以没有要排除的数。

**第二步：写出定义域。** 所有实数都可以：定义域是 $(-\\infty, \\infty)$。

**检验。** 离顶点很远的输入也可以，例如 $x = 100$：$f(100) = ${absEval(a, h, kq, Q.of(100))}$`,
            ),
          });
        }
        const one = Q.of(h + 1);
        const addEn = k === 0 ? "So" : k > 0 ? `Adding $${k}$ gives` : `Subtracting $${-k}$ gives`;
        const addZh = k === 0 ? "所以" : k > 0 ? `加上 $${k}$ 得` : `减去 $${-k}$ 得`;
        return intervalProblem({
          prompt: ask(`Find the range of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的值域。`, asInterval),
          set: rangeSet,
          form: "interval",
          wrong: [union(up ? ray("<=", k) : ray(">=", k)), union(up ? ray(">=", h) : ray("<=", h)), toggleEnds(rangeSet), realLine],
          solution: t(
            `**Step 1: bound the absolute value term.** Since $|${linear(1, -h)}| \\ge 0$ and $a = ${a.toLatex()}$ is ${up ? "positive" : "negative"}, $${term} ${up ? "\\ge" : "\\le"} 0$. ${addEn} $f(x) ${up ? "\\ge" : "\\le"} ${k}$.

**Step 2: see which values are reached.** At the vertex, $x = ${h}$, the value is exactly $${k}$, and the arms go ${up ? "up" : "down"} forever from there, so every value ${up ? "above" : "below"} $${k}$ is reached too. The range is $${intervalLatex(rangeSet)}$.

**Check.** One unit from the vertex, $f(${h + 1}) = ${absAt(a, h, kq, one).toLatex()}$, which is ${up ? "above" : "below"} $${k}$ and so inside the range. At the vertex itself the value is the ${up ? "least" : "greatest"} one: $f(${h}) = ${absEval(a, h, kq, Q.of(h))}$`,
            `**第一步：估计绝对值项。** 因为 $|${linear(1, -h)}| \\ge 0$，而 $a = ${a.toLatex()}$ 是${up ? "正" : "负"}数，所以 $${term} ${up ? "\\ge" : "\\le"} 0$。${addZh} $f(x) ${up ? "\\ge" : "\\le"} ${k}$。

**第二步：看哪些值能取到。** 在顶点 $x = ${h}$ 处，值恰好是 $${k}$，两支从那里一直向${up ? "上" : "下"}延伸，所以${up ? "大" : "小"}于 $${k}$ 的每个值也都能取到。值域是 $${intervalLatex(rangeSet)}$。

**检验。** 离顶点一个单位处，$f(${h + 1}) = ${absAt(a, h, kq, one).toLatex()}$，${up ? "大" : "小"}于 $${k}$，在值域内。顶点处的值是最${up ? "小" : "大"}值：$f(${h}) = ${absEval(a, h, kq, Q.of(h))}$`,
          ),
        });
      },
    },
    {
      id: "domain-and-range-from-a-graph",
      figure: algebraDrawings["domain-and-range-of-absolute-value-functions#domain-and-range-from-a-graph"],
      title: t("From a graph on an interval", "由区间上的图象求"),
      explanation: t(
        `When the graph is drawn only between two endpoints, the domain is the interval between their $x$-coordinates; filled dots mean the ends are included. For the range, find the lowest and highest $y$-values on the graph: they occur at the endpoints, or at the vertex if the vertex lies between them.

The graph of $y = |x - 1|$ from $(-2, 3)$ to $(2, 1)$ has domain $[-2, 2]$. Its heights at the ends are $3$ and $1$, but the vertex $(1, 0)$ lies between the ends and is lower, so the range is $[0, 3]$.

> **Watch out.** The domain is read along the $x$-axis and the range along the $y$-axis; do not swap them. A vertex between the ends is the lowest or highest point, so the range is not simply the interval between the heights of the ends.`,
        `当图象只画在两个端点之间时，定义域是端点 $x$ 坐标之间的区间；实心点表示端点包括在内。求值域时，找出图象上最低和最高的 $y$ 值：它们出现在端点处，或者（如果顶点在两端点之间）在顶点处。

$y = |x - 1|$ 从 $(-2, 3)$ 到 $(2, 1)$ 的图象，定义域是 $[-2, 2]$。两端的高度是 $3$ 和 $1$，但顶点 $(1, 0)$ 在两端之间而且更低，所以值域是 $[0, 3]$。

> **注意。** 定义域沿 $x$ 轴读，值域沿 $y$ 轴读，不要弄反。位于两端之间的顶点是最低点或最高点，所以值域不只是两端高度之间的区间。`,
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
          return annotate(
            {
              ...intervalProblem({
                prompt: ask("The graph of $f$ is shown. Find the domain of $f$.", "如图是 $f$ 的图象。求 $f$ 的定义域。", asInterval),
                set: domainSet,
                form: "interval",
                wrong: [rangeSet, realLine, toggleEnds(domainSet)],
                solution: t(
                  `**Step 1: read the ends along the $x$-axis.** The left end is $${pt(p, fp)}$ and the right end is $${pt(q, fq)}$, so the graph runs from $x = ${p}$ to $x = ${q}$. Both dots are filled, so both ends are included.

**Step 2: write the domain.** The domain is $${intervalLatex(domainSet)}$.

**Check.** Every $x$ from $${p}$ to $${q}$ has a point of the graph above or below it, and nothing is drawn to the left of $x = ${p}$ or to the right of $x = ${q}$.`,
                  `**第一步：沿 $x$ 轴读出两端。** 左端是 $${pt(p, fp)}$，右端是 $${pt(q, fq)}$，所以图象从 $x = ${p}$ 到 $x = ${q}$。两个点都是实心的，所以两端都包括在内。

**第二步：写出定义域。** 定义域是 $${intervalLatex(domainSet)}$。

**检验。** 从 $${p}$ 到 $${q}$ 的每个 $x$，图象上都有一个点在它的正上方或正下方；而 $x = ${p}$ 左边和 $x = ${q}$ 右边什么也没画。`,
                ),
              }),
              figure,
            },
            view,
            onAxis("x", domainSet, 6),
            `The graph covers x in ${setText(domainSet)}.`,
            `图象覆盖的 x 是 ${setText(domainSet)}。`,
          );
        }
        const lo = rangeSet[0]!.lo!;
        const hi = rangeSet[0]!.hi!;
        const candidates = [pt(p, fp), pt(q, fq), ...(vertexOn ? [pt(h, k)] : [])].map((s) => `$${s}$`);
        const atHeight = (y: Q) => {
          const x = [p, q, ...(vertexOn ? [h] : [])].find((v) => absAt(a, h, kq, Q.of(v)).eq(y))!;
          return pt(x, y);
        };
        return annotate(
          {
            ...intervalProblem({
              prompt: ask("The graph of $f$ is shown. Find the range of $f$.", "如图是 $f$ 的图象。求 $f$ 的值域。", asInterval),
              set: rangeSet,
              form: "interval",
              wrong: [ends, domainSet, union(a.sign() > 0 ? ray(">=", k) : ray("<=", k))],
              solution: t(
                `**Step 1: list the candidates.** The lowest and highest points can only be at the ends or at the corner of the V. ${vertexOn ? "The corner lies between the ends" : "The corner is not between the ends"}, so the points to compare are ${candidates.join(", ")}.

**Step 2: take the least and greatest heights.** The lowest height is $${num(lo)}$ and the highest is $${num(hi)}$, so the range is $${intervalLatex(rangeSet)}$.

**Check.** The lowest point $${atHeight(lo)}$ and the highest point $${atHeight(hi)}$ are both on the drawn graph, which is unbroken between them, so every height from $${num(lo)}$ to $${num(hi)}$ is taken and no other.`,
                `**第一步：列出候选点。** 最低点和最高点只可能在两端或 V 形的拐点处。${vertexOn ? "拐点在两端之间" : "拐点不在两端之间"}，所以要比较的点是 ${candidates.join("、")}。

**第二步：取最小和最大的高度。** 最低高度是 $${num(lo)}$，最高是 $${num(hi)}$，所以值域是 $${intervalLatex(rangeSet)}$。

**检验。** 最低点 $${atHeight(lo)}$ 和最高点 $${atHeight(hi)}$ 都在所画的图象上，而图象在它们之间是连续不断的，所以从 $${num(lo)}$ 到 $${num(hi)}$ 的每个高度都能取到，此外再没有别的高度。`,
              ),
            }),
            figure,
          },
          view,
          onAxis("y", rangeSet, 6),
          `The graph covers y in ${setText(rangeSet)}.`,
          `图象覆盖的 y 是 ${setText(rangeSet)}。`,
        );
      },
    },
    {
      id: "range-on-a-closed-interval",
      figure: algebraDrawings["domain-and-range-of-absolute-value-functions#range-on-a-closed-interval"],
      title: t("Range on a closed interval", "闭区间上的值域"),
      explanation: t(
        `To find the range of $f(x) = a|x - h| + k$ for $p \\le x \\le q$, evaluate $f$ at both ends, and also at the vertex $x = h$ if $p < h < q$. On each side of the vertex the graph is a straight piece, so the least and greatest values must be among these, and the range runs from the least to the greatest.

For $f(x) = 2|x + 1| - 3$ on $-3 \\le x \\le 2$: the vertex $x = -1$ lies inside, and $f(-3) = 1$, $f(2) = 3$, $f(-1) = -3$. The range is $[-3, 3]$.

> **Watch out.** When the vertex lies inside the interval, its value is the least (or greatest) one: here the range is $[-3, 3]$, not $[1, 3]$ from the ends alone. And the range on an interval is a closed interval, not the ray $[k, \\infty)$ of the whole function.`,
        `求 $f(x) = a|x - h| + k$ 在 $p \\le x \\le q$ 上的值域：计算两个端点处的函数值；若 $p < h < q$，还要计算顶点 $x = h$ 处的值。在顶点两侧图象都是直的一段，所以最小值和最大值一定在这几个值之中，值域从其中最小的到最大的。

$f(x) = 2|x + 1| - 3$ 在 $-3 \\le x \\le 2$ 上：顶点 $x = -1$ 在区间内，$f(-3) = 1$，$f(2) = 3$，$f(-1) = -3$。值域是 $[-3, 3]$。

> **注意。** 顶点在区间内时，它的值就是最小值（或最大值）：这里值域是 $[-3, 3]$，而不是只看两端得到的 $[1, 3]$。另外，闭区间上的值域是一个闭区间，不是整个函数的射线 $[k, \\infty)$。`,
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
        const s = steps(
          `f(${p}) = ${absEval(a, h, kq, Q.of(p))}`,
          `f(${q}) = ${absEval(a, h, kq, Q.of(q))}`,
          ...(vertexIn ? [`f(${h}) = ${absEval(a, h, kq, Q.of(h))}`] : []),
        );
        const up = a.sign() > 0;
        const [lo, hi] = [set[0]!.lo!, set[0]!.hi!];
        const [dp, dq] = [Math.abs(p - h), Math.abs(q - h)];
        const [near, far] = dp <= dq ? [p, q] : [q, p];
        const extremeEn = up ? "least" : "greatest";
        const otherEn = up ? "greatest" : "least";
        const checkEn = vertexIn
          ? `The V opens ${up ? "upward" : "downward"}, so its ${extremeEn} value on the interval is at the vertex, $${k}$, and its ${otherEn} at the end farther from $x = ${h}$, $x = ${far}$.`
          : `The V opens ${up ? "upward" : "downward"} and the vertex is outside the interval, so the ${extremeEn} value is at the end nearer to $x = ${h}$, $x = ${near}$, and the ${otherEn} at the other end.`;
        const checkZh = vertexIn
          ? `V 形开口向${up ? "上" : "下"}，所以在区间上的最${up ? "小" : "大"}值在顶点处，为 $${k}$；最${up ? "大" : "小"}值在离 $x = ${h}$ 较远的端点 $x = ${far}$ 处。`
          : `V 形开口向${up ? "上" : "下"}，顶点不在区间内，所以最${up ? "小" : "大"}值在离 $x = ${h}$ 较近的端点 $x = ${near}$ 处，最${up ? "大" : "小"}值在另一端。`;
        const problem = intervalProblem({
          prompt: ask(
            `Find the range of $f(x) = ${f}$ for $${p} \\le x \\le ${q}$.`,
            `求 $f(x) = ${f}$ 在 $${p} \\le x \\le ${q}$ 上的值域。`,
            asInterval,
          ),
          set,
          form: "interval",
          wrong: [ends, union(span(p, true, q, true)), union(a.sign() > 0 ? ray(">=", k) : ray("<=", k))],
          solution: t(
            `**Step 1: locate the vertex.** The vertex is at $x = ${h}$, which ${vertexIn ? `lies between $${p}$ and $${q}$` : h === p || h === q ? "is an end of the interval" : `is not between $${p}$ and $${q}$`}.

**Step 2: evaluate $f$.** At the ends${vertexIn ? " and at the vertex" : ""}:${s}**Step 3: take the least and greatest values.** They are $${num(lo)}$ and $${num(hi)}$, so the range is $${intervalLatex(set)}$.

{{figure 0}}

**Check.** ${checkEn} This agrees with the values above.`,
            `**第一步：找出顶点。** 顶点在 $x = ${h}$，${vertexIn ? `位于 $${p}$ 和 $${q}$ 之间` : h === p || h === q ? "正好是区间的端点" : `不在 $${p}$ 和 $${q}$ 之间`}。

**第二步：计算函数值。** 端点处${vertexIn ? "和顶点处" : ""}的值：${s}**第三步：取最小值和最大值。** 它们是 $${num(lo)}$ 和 $${num(hi)}$，所以值域是 $${intervalLatex(set)}$。

{{figure 0}}

**检验。** ${checkZh}这与上面算出的值一致。`,
          ),
        });
        return {
          ...problem,
          solutionFigures: [
            graphFigure(
              viewAround([
                [p, fp.toNumber()],
                [q, fq.toNumber()],
                [h, k],
              ]),
              [
                ...vMarks(a, h, kq, p, q),
                { kind: "point", at: [p, fp.toNumber()] },
                { kind: "point", at: [q, fq.toNumber()] },
                ...onAxis("y", set, 40),
              ],
              `The graph of f from x = ${p} to x = ${q}; the y-axis is highlighted over the range ${setText(set)}.`,
              `f 从 x = ${p} 到 x = ${q} 的图象；y 轴上突出显示值域 ${setText(set)}。`,
            ),
          ],
        };
      },
    },
  ],
};

/** rootCheck works out a|mx + n| + k at a number x. */
function rootCheck(a: number, m: number, n: number, k: number, x: Q): string {
  const A = Q.of(a);
  const v = Q.of(m).mul(x).add(Q.of(n));
  const V = v.abs().toLatex();
  const product = a === 1 ? V : a === -1 ? `-${V}` : `${a} \\cdot ${V}`;
  return chain(
    `${coef(A)}|${subst(m, x)}${tail(n)}|${tail(k)}`,
    `${coef(A)}|${v.toLatex()}|${tail(k)}`,
    `${product}${tail(k)}`,
    A.mul(v.abs()).add(Q.of(k)).toLatex(),
  );
}

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
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7.B", "CCSS.HSA.REI.D.11"],
  intro: t(
    `A **root** of a function $f$ is an input $x$ with $f(x) = 0$; on the graph it is where the curve meets the $x$-axis. For an absolute value function, finding the roots means solving an absolute value equation, which we already know how to do: get the absolute value alone, then split.

Take $f(x) = 2|x - 1| - 4$. Setting $f(x) = 0$ gives $2|x - 1| = 4$, so $|x - 1| = 2$: the inside is $2$ or $-2$, and $x = 3$ or $x = -1$. The graph tells the same story. Its vertex $(1, -4)$ is below the $x$-axis and the V opens upward, so both arms cross the axis, at the same distance $2$ on either side of $x = 1$:

{{figure 0}}

Had the vertex been above the axis with the V still opening upward, the graph would never reach the axis and there would be no roots. In this lesson we count the roots from the vertex and the opening, and find them from the formula and from the graph.`,
    `函数 $f$ 的**零点**是使 $f(x) = 0$ 的输入 $x$；在图象上，它是曲线与 $x$ 轴相交的地方。对绝对值函数来说，求零点就是解一个绝对值方程，这我们已经会了：先把绝对值单独放在一边，再拆开。

以 $f(x) = 2|x - 1| - 4$ 为例。令 $f(x) = 0$，得 $2|x - 1| = 4$，所以 $|x - 1| = 2$：里面等于 $2$ 或 $-2$，$x = 3$ 或 $x = -1$。图象说明了同样的事。它的顶点 $(1, -4)$ 在 $x$ 轴下方，V 形开口向上，所以两支都穿过 $x$ 轴，交点在 $x = 1$ 两侧，距离都是 $2$：

{{figure 0}}

如果顶点在 $x$ 轴上方而 V 形仍然开口向上，图象就永远碰不到 $x$ 轴，也就没有零点。这节课我们由顶点和开口方向判断零点的个数，并由解析式和图象求出零点。`,
  ),
  introFigures: [
    graphFigure(
      view,
      [
        ...vMarks(Q.of(2), 1, Q.of(-4)),
        { kind: "point", at: [1, -4], label: "(1, −4)", dir: "s" },
        { kind: "point", at: [-1, 0], tone: "result", label: "−1", dir: "nw" },
        { kind: "point", at: [3, 0], tone: "result", label: "3", dir: "ne" },
      ],
      "The V of f(x) = 2|x − 1| − 4 with vertex (1, −4) below the x-axis; it crosses the x-axis at x = −1 and x = 3.",
      "f(x) = 2|x − 1| − 4 的 V 形图象，顶点 (1, −4) 在 x 轴下方；它与 x 轴交于 x = −1 和 x = 3。",
    ),
  ],
  knowledgePoints: [
    {
      id: "how-many-roots",
      figure: algebraDrawings["roots-of-absolute-value-functions#how-many-roots"],
      title: t("How many roots", "零点的个数"),
      explanation: t(
        `The graph of $f(x) = a|x - h| + k$ is a V with vertex $(h, k)$, so its number of roots depends on where the vertex is and which way the V opens:

- vertex below the $x$-axis and opening upward, or above and opening downward: **two** roots;
- vertex on the $x$-axis ($k = 0$): **one** root, $x = h$;
- vertex above and opening upward, or below and opening downward: **no** roots.

In short: two roots when $a$ and $k$ have opposite signs, none when they have the same sign. For $f(x) = -3|x + 2| + 6$, the vertex $(-2, 6)$ is above the axis and the V opens downward, so there are two roots. Solving agrees: $|x + 2| = 2$ has two solutions.

> **Watch out.** The answer depends on the signs of **both** $a$ and $k$: a vertex above the axis gives two roots if the V opens downward but none if it opens upward. A vertex on the axis gives exactly **one** root, not two, and $h$ plays no part.`,
        `$f(x) = a|x - h| + k$ 的图象是顶点为 $(h, k)$ 的 V 形，零点个数取决于顶点的位置和开口方向：

- 顶点在 $x$ 轴下方且开口向上，或在上方且开口向下：**两个**零点；
- 顶点在 $x$ 轴上（$k = 0$）：**一个**零点 $x = h$；
- 顶点在上方且开口向上，或在下方且开口向下：**没有**零点。

简言之：$a$ 与 $k$ 异号时有两个零点，同号时没有零点。对 $f(x) = -3|x + 2| + 6$，顶点 $(-2, 6)$ 在 $x$ 轴上方，开口向下，所以有两个零点。解方程也一致：$|x + 2| = 2$ 有两个解。

> **注意。** 答案取决于 $a$ 和 $k$ **两者**的符号：顶点在 $x$ 轴上方时，开口向下有两个零点，开口向上则没有。顶点在 $x$ 轴上时恰好有**一个**零点，不是两个；$h$ 不起作用。`,
      ),
      generate(rng) {
        const a = rng.pick([...combinedFactors, Q.one]);
        const h = rng.int(-9, 9);
        const k = rng.bool(0.2) ? 0 : rng.nonZero(-9, 9);
        const count = k === 0 ? 1 : a.sign() * Math.sign(k) < 0 ? 2 : 0;
        const where = k === 0 ? t("on", "上") : k > 0 ? t("above", "上方") : t("below", "下方");
        const up = a.sign() > 0;
        const d = Q.of(-k).div(a);
        const term = poly([a, bars(linear(1, -h))]);
        const lines = [`${absFn(a, h, k)} = 0`, `${term} = ${-k}`, `${bars(linear(1, -h))} = ${d.toLatex()}`];
        const iso = steps(...lines.filter((line, i) => line !== lines[i - 1] && !(i === 1 && k === 0)));
        const meaningEn =
          count === 2
            ? `a positive number, so the inside is $${d.toLatex()}$ or $${d.neg().toLatex()}$: two roots.`
            : count === 1
              ? "zero, so the inside must be $0$: one root."
              : "negative, and an absolute value is never negative: no roots.";
        const meaningZh =
          count === 2
            ? `是正数，所以里面等于 $${d.toLatex()}$ 或 $${d.neg().toLatex()}$：两个零点。`
            : count === 1
              ? "是 $0$，所以里面只能等于 $0$：一个零点。"
              : "是负数，而绝对值不会是负数：没有零点。";
        const sideEn = k === 0 ? "" : count === 2 ? ", toward the axis" : ", away from the axis";
        const sideZh = k === 0 ? "" : count === 2 ? "，朝向 $x$ 轴" : "，背离 $x$ 轴";
        return reasoned(
          choiceProblem({
            prompt: t(`How many roots does $f(x) = ${absFn(a, h, k)}$ have?`, `$f(x) = ${absFn(a, h, k)}$ 有几个零点？`),
            options: [same("$0$"), same("$1$"), same("$2$")],
            correct: count,
            solution: t(
              `**Step 1: place the vertex.** The vertex is $${pt(h, k)}$, ${where.en} the $x$-axis${k === 0 ? "" : ` since $k = ${k}$ is ${k > 0 ? "positive" : "negative"}`}.

**Step 2: look at the opening.** Since $a = ${a.toLatex()}$ is ${up ? "positive" : "negative"}, the V opens ${up ? "upward" : "downward"}${sideEn}. ${count === 2 ? "Both arms cross the axis" : count === 1 ? "It touches the axis only at the vertex" : "It never reaches the axis"}, so there ${count === 1 ? "is $1$ root" : `are $${count}$ roots`}.

**Check.** Solve $f(x) = 0$ by getting the absolute value alone:${iso}The right side is ${meaningEn}`,
              `**第一步：确定顶点位置。** 顶点是 $${pt(h, k)}$，在 $x$ 轴${where["zh-CN"]}${k === 0 ? "" : `，因为 $k = ${k}$ 是${k > 0 ? "正" : "负"}数`}。

**第二步：看开口方向。** 因为 $a = ${a.toLatex()}$ 是${up ? "正" : "负"}数，V 形开口向${up ? "上" : "下"}${sideZh}。${count === 2 ? "两支都穿过 $x$ 轴" : count === 1 ? "它只在顶点处碰到 $x$ 轴" : "它永远碰不到 $x$ 轴"}，所以有 $${count}$ 个零点。

**检验。** 令 $f(x) = 0$，把绝对值单独放在一边：${iso}右边${meaningZh}`,
            ),
          }),
          [
            [
              "$0$",
              k === 0
                ? "The vertex lies on the $x$-axis, and that point is a root."
                : "From the vertex the graph opens toward the $x$-axis, so it does reach the axis.",
              k === 0 ? "顶点在 $x$ 轴上，这个点就是零点。" : "图象从顶点朝 $x$ 轴张开，所以一定会碰到 $x$ 轴。",
            ],
            [
              "$1$",
              "One root happens only when the vertex lies on the $x$-axis, and here it does not.",
              "只有顶点在 $x$ 轴上时才恰有一个零点，而这里不是。",
            ],
            [
              "$2$",
              k === 0
                ? "The arms leave the vertex in the same direction away from the axis, so they meet it only at the vertex."
                : "From the vertex the graph opens away from the $x$-axis, so it never reaches the axis.",
              k === 0
                ? "两支从顶点朝同一方向离开 $x$ 轴，所以只在顶点处与它相遇。"
                : "图象从顶点朝远离 $x$ 轴的方向张开，所以永远碰不到 $x$ 轴。",
            ],
          ],
        );
      },
    },
    {
      id: "roots-from-the-formula",
      title: t("Roots from the formula", "由解析式求零点"),
      explanation: t(
        `To find the roots, set $f(x) = 0$ and solve the absolute value equation: first get the absolute value alone, then split it into two cases.

For $f(x) = -2|x - 1| + 6$: subtract $6$ from both sides, then divide by $-2$:

$$-2|x - 1| + 6 = 0 \\;\\Rightarrow\\; -2|x - 1| = -6 \\;\\Rightarrow\\; |x - 1| = 3$$

So $x - 1 = 3$ or $x - 1 = -3$, giving $x = 4$ or $x = -2$. If the absolute value, once alone, equals a negative number, there are no roots.

> **Watch out.** Get the absolute value **alone** before splitting: splitting $-2|x - 1| + 6 = 0$ as it stands loses the factor and the constant. When the isolated value is negative there is nothing to split, since no absolute value is negative; and when it is positive, keep **both** cases.`,
        `求零点时，令 $f(x) = 0$，解这个绝对值方程：先把绝对值单独放在一边，再拆成两种情况。

对 $f(x) = -2|x - 1| + 6$：两边减去 $6$，再除以 $-2$：

$$-2|x - 1| + 6 = 0 \\;\\Rightarrow\\; -2|x - 1| = -6 \\;\\Rightarrow\\; |x - 1| = 3$$

所以 $x - 1 = 3$ 或 $x - 1 = -3$，得 $x = 4$ 或 $x = -2$。如果绝对值单独放好后等于负数，就没有零点。

> **注意。** 拆开之前先把绝对值**单独**放在一边：直接拆 $-2|x - 1| + 6 = 0$ 会丢掉系数和常数。单独放好后若等于负数，就无须再拆，因为绝对值不会是负数；若等于正数，**两种**情况都要保留。`,
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
        const how = undoing(a, k);
        const s = steps(`${f} = 0`, ...(a === 1 ? [] : [`${poly([a, bars(L)])} = ${-k}`]), `${bars(L)} = ${dist}`);
        const first = t(
          `**Step 1: set $f(x) = 0$ and get the absolute value alone.** Treat $${bars(L)}$ as one block: ${how.en}.${s}`,
          `**第一步：令 $f(x) = 0$，把绝对值单独放在一边。** 把 $${bars(L)}$ 看成一个整体：${how["zh-CN"]}。${s}`,
        );
        const sameSign = a > 0 ? "positive" : "negative";
        let solution: Text;
        if (x.length === 0) {
          solution = t(
            `${first.en}**Step 2: decide.** An absolute value is never negative, so $${bars(L)} = ${dist}$ has no solutions, and $f$ has no roots: $\\varnothing$.

**Check.** The graph of $f$ is a V whose lowest or highest point has height $${k}$. Here $a = ${a}$ and $k = ${k}$ are both ${sameSign}, so the V opens ${a > 0 ? "upward from a vertex above" : "downward from a vertex below"} the $x$-axis and never meets it.`,
            `${first["zh-CN"]}**第二步：判断。** 绝对值不会是负数，所以 $${bars(L)} = ${dist}$ 无解，$f$ 没有零点：$\\varnothing$。

**检验。** $f$ 的图象是 V 形，顶点的高度是 $${k}$。这里 $a = ${a}$ 和 $k = ${k}$ 都是${a > 0 ? "正" : "负"}数，所以 V 形从 $x$ 轴${a > 0 ? "上方的顶点开口向上" : "下方的顶点开口向下"}，永远碰不到 $x$ 轴。`,
          );
        } else {
          const split = splitAndSolve(m, n, dist, 2);
          const work = steps(...sortQ(x).map((r) => `f\\left(${r.toLatex()}\\right) = ${rootCheck(a, m, n, k, r)}`));
          solution = t(
            `${first.en}${split.en}So the roots are ${solsText(x).en}.

**Check.** Put each root into $f$:${work}Both give $0$.`,
            `${first["zh-CN"]}${split["zh-CN"]}所以零点是 ${solsText(x).zh}。

**检验。** 把每个零点代入 $f$：${work}结果都是 $0$。`,
          );
        }
        return solutionsProblem({
          prompt: ask(`Find all roots of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的所有零点。`, listSolutions),
          values: sols(x),
          wrong: [
            sols(solveAbs(m, n, -k)),
            sols(solveAbs(m, -n, Math.abs(dist))),
            sols(solveAbs(m, n, Math.abs(dist))),
            sols(solveAbs(m, n, Math.abs(dist)).slice(0, 1)),
          ],
          solution,
        });
      },
    },
    {
      id: "roots-from-the-graph",
      figure: algebraDrawings["roots-of-absolute-value-functions#roots-from-the-graph"],
      title: t("Roots from the graph", "由图象求零点"),
      explanation: t(
        `The roots are the $x$-coordinates of the points where the V meets the $x$-axis. Because the V is symmetric about the vertical line through its vertex, two roots are always the same distance from $x = h$, one on each side.

A V with vertex $(2, -3)$ that opens upward and crosses the $x$-axis at $(5, 0)$ also crosses it $3$ units to the left of $x = 2$, at $(-1, 0)$. Its roots are $x = -1$ and $x = 5$.

> **Watch out.** A root is an $x$-coordinate where the graph meets the **$x$-axis**: not the $y$-intercept, and not the vertex's $x$-coordinate unless the vertex is on the axis. A V that crosses the axis does so twice, so give both roots; a V that never meets the axis has none.`,
        `零点是 V 形图象与 $x$ 轴交点的 $x$ 坐标。由于 V 形关于经过顶点的竖直线对称，两个零点总是在 $x = h$ 两侧，到它的距离相等。

顶点为 $(2, -3)$、开口向上、与 $x$ 轴交于 $(5, 0)$ 的 V 形，也会在 $x = 2$ 左边 $3$ 个单位处与 $x$ 轴相交，即 $(-1, 0)$。它的零点是 $x = -1$ 和 $x = 5$。

> **注意。** 零点是图象与 **$x$ 轴**交点的 $x$ 坐标：不是 $y$ 轴截距，也不是顶点的横坐标（除非顶点就在 $x$ 轴上）。穿过 $x$ 轴的 V 形会穿过两次，两个零点都要写出；碰不到 $x$ 轴的 V 形没有零点。`,
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
          const up = a.sign() > 0;
          const kn = k.toNumber();
          const place = kn === 0 ? t("on", "上") : kn > 0 ? t("above", "上方") : t("below", "下方");
          const step1 = t(
            `**Step 1: read the vertex and the opening.** The vertex is $${pt(h, kn)}$, ${place.en} the $x$-axis, and the V opens ${up ? "upward" : "downward"}.`,
            `**第一步：读出顶点和开口方向。** 顶点是 $${pt(h, kn)}$，在 $x$ 轴${place["zh-CN"]}，V 形开口向${up ? "上" : "下"}。`,
          );
          const solution =
            roots.length === 0
              ? t(
                  `${step1.en}

**Step 2: look for crossings.** The V opens away from the $x$-axis, so the graph never meets it, and $f$ has no roots: $\\varnothing$.

**Check.** The arms only get farther from the axis as they leave the vertex, so even far to the left or right there is no crossing.`,
                  `${step1["zh-CN"]}

**第二步：找交点。** V 形背离 $x$ 轴张开，所以图象与 $x$ 轴没有交点，$f$ 没有零点：$\\varnothing$。

**检验。** 两支离开顶点后离 $x$ 轴越来越远，所以再往左或往右也不会相交。`,
                )
              : roots.length === 1
                ? t(
                    `${step1.en}

**Step 2: read the crossing.** The graph touches the $x$-axis only at its vertex $(${h}, 0)$, so the only root is ${solsText(roots).en}.

**Check.** Both arms leave the vertex ${up ? "upward" : "downward"}, away from the axis, so there is no other point on the axis.`,
                    `${step1["zh-CN"]}

**第二步：读出交点。** 图象只在顶点 $(${h}, 0)$ 处碰到 $x$ 轴，所以唯一的零点是 ${solsText(roots).zh}。

**检验。** 两支都从顶点向${up ? "上" : "下"}离开 $x$ 轴，所以 $x$ 轴上没有别的交点。`,
                  )
                : t(
                    `${step1.en} So both arms cross the $x$-axis.

**Step 2: read the crossings.** The graph meets the $x$-axis at ${roots.map((r) => `$(${r.toLatex()}, 0)$`).join(" and ")}, so the roots are ${solsText(roots).en}.

**Check.** The two roots should be equally far from $x = ${h}$, one on each side: $${h} - ${dist} = ${h - dist}$ and $${h} + ${dist} = ${h + dist}$. They are, $${dist}$ unit${dist === 1 ? "" : "s"} each way.`,
                    `${step1["zh-CN"]}所以两支都穿过 $x$ 轴。

**第二步：读出交点。** 图象与 $x$ 轴交于 ${roots.map((r) => `$(${r.toLatex()}, 0)$`).join("、")}，所以零点是 ${solsText(roots).zh}。

**检验。** 两个零点应该在 $x = ${h}$ 两侧，到它的距离相等：$${h} - ${dist} = ${h - dist}$，$${h} + ${dist} = ${h + dist}$。确实如此，每边都是 $${dist}$ 个单位。`,
                  );
          return annotate(
            {
              ...solutionsProblem({
                prompt: ask("The graph of $f$ is shown. Find all roots of $f$.", "如图是 $f$ 的图象。求 $f$ 的所有零点。", listSolutions),
                values: sols(roots),
                wrong: [[String(h)], [k.toLatex()], ...(f0.isZero() ? [] : [[f0.toLatex()]]), sols(roots.slice(0, 1))],
                solution,
              }),
              figure: vFigure(a, h, k, [[h, k.toNumber()], ...dots.filter(([x]) => x !== h)]),
            },
            view,
            dots.map((p): PlaneMark => ({ kind: "point", at: p, tone: "result" })),
            roots.length ? `The graph meets the x-axis at x = ${roots.map(plain).join(", ")}.` : "The graph does not meet the x-axis.",
            roots.length ? `图象与 x 轴交于 x = ${roots.map(plain).join("、")}。` : "图象与 x 轴没有交点。",
          );
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
