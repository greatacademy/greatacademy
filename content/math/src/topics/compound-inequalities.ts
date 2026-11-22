import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import {
  type Coefficient,
  type Interval,
  inequalityLatexOf,
  intersect,
  intervalLatex,
  linear,
  num,
  poly,
  Q,
  type RealSet,
  relSymbol,
  type Surd,
  setEqual,
  simplifyRadical,
  surd,
  surdLatex,
  svgDocument,
  union,
} from "@ga/subject-math";
import { algebraDrawings } from "../explanation-drawings-algebra.ts";

import {
  choiceProblem,
  type InequalityOp,
  inequalityLatex,
  inequalityProblem,
  intervalProblem,
  numberProblem,
  solutionsProblem,
  steps,
  yesNo,
} from "../problems.ts";
import { flip, holds, listRealSolutions, sqrtSurd, squareFree, toggleEnds, toQ } from "../solution-kit.ts";

const strictness: Record<InequalityOp, InequalityOp> = { "<": "<=", "<=": "<", ">": ">=", ">=": ">" };
const lessOps: readonly InequalityOp[] = ["<", "<="];
const greaterOps: readonly InequalityOp[] = [">", ">="];
const allOps: readonly InequalityOp[] = ["<", "<=", ">", ">="];

/** span is the set of numbers from lo to hi, with each end included when it is closed. */
function span(lo: Coefficient, loClosed: boolean, hi: Coefficient, hiClosed: boolean): Interval {
  return { lo: toQ(lo), hi: toQ(hi), loClosed, hiClosed };
}

/** ray is the set of x with x op v. */
export function ray(op: InequalityOp, v: Coefficient): Interval {
  return op === "<" || op === "<="
    ? { hi: toQ(v), hiClosed: op === "<=", loClosed: false }
    : { lo: toQ(v), loClosed: op === ">=", hiClosed: false };
}

/** hasPoint tells whether a set contains an isolated point, which interval notation cannot write. */
const hasPoint = (s: RealSet) => s.some((i) => i.lo !== undefined && i.hi !== undefined && i.lo.eq(i.hi));

/** mirror reflects an interval through 0. */
const mirror = (i: Interval): Interval => ({ lo: i.hi?.neg(), hi: i.lo?.neg(), loClosed: i.hiClosed, hiClosed: i.loClosed });

/** show writes one interval in interval notation. */
const show = (i: Interval) => intervalLatex([i]);

type Kind = "left" | "right" | "bounded";

/** randomInterval draws an interval of the given kind with integer endpoints in [-10, 10]. */
function randomInterval(rng: Rng, kind: Kind): Interval {
  if (kind === "left") return ray(rng.pick(lessOps), rng.int(-10, 10));
  if (kind === "right") return ray(rng.pick(greaterOps), rng.int(-10, 10));
  const a = rng.int(-10, 8);
  return span(a, rng.bool(), rng.int(a + 1, Math.min(10, a + 9)), rng.bool());
}

const asInterval = t("Write the answer in interval notation.", "用区间记号写出答案。");
const asInequality = (v: string) => t(`Write the answer as an inequality in $${v}$.`, `用关于 $${v}$ 的不等式写出答案。`);

/** ask builds a prompt from a question and an instruction about the form of the answer. */
const ask = (en: string, zh: string, form: Text): Text => t(`${en} ${form.en}`, `${zh}${form["zh-CN"]}`);

/** closedWords describes an endpoint marker on a number line. */
const closedWords = (closed: boolean) => (closed ? t("closed dot", "实心点") : t("open circle", "空心圈"));

/** numberLineRow draws a set on a number line at height y, with the line starting pad units from the left; it returns the SVG and the words for the shading. */
function numberLineRow(set: RealSet, min: number, max: number, y: number, pad: number): { body: string; alt: Text } {
  const width = 320;
  const x = (v: number) => Math.round((pad + ((v - min) / (max - min)) * (width - 30 - pad)) * 100) / 100;
  const left = x(min) - 16;
  const right = x(max) + 16;
  const open = set
    .flatMap((i) => [...(i.lo && !i.loClosed ? [i.lo.toNumber()] : []), ...(i.hi && !i.hiClosed ? [i.hi.toNumber()] : [])])
    .sort((a, b) => a - b);
  let body = "";
  let from = left;
  for (const v of open) {
    body += `<line x1="${from}" y1="${y}" x2="${x(v) - 5}" y2="${y}"/>`;
    from = x(v) + 5;
  }
  body += `<line x1="${from}" y1="${y}" x2="${right}" y2="${y}"/>`;
  for (let v = min; v <= max; v++) {
    if (!open.includes(v)) body += `<line x1="${x(v)}" y1="${y - 4}" x2="${x(v)}" y2="${y + 4}"/>`;
    if (max - min <= 12 || v % 2 === 0) body += `<text x="${x(v)}" y="${y + 22}" fill="currentColor" stroke="none">${v}</text>`;
  }
  const en: string[] = [];
  const zh: string[] = [];
  for (const i of set) {
    const a = i.lo ? x(i.lo.toNumber()) + (i.loClosed ? 0 : 5) : left;
    const b = i.hi ? x(i.hi.toNumber()) - (i.hiClosed ? 0 : 5) : right;
    body += `<line class="accent" x1="${a}" y1="${y}" x2="${b}" y2="${y}" stroke-width="4"/>`;
    if (!i.lo)
      body += `<polygon class="accent" points="${left - 8},${y} ${left + 2},${y - 6} ${left + 2},${y + 6}" fill="currentColor" stroke="none"/>`;
    if (!i.hi)
      body += `<polygon class="accent" points="${right + 8},${y} ${right - 2},${y - 6} ${right - 2},${y + 6}" fill="currentColor" stroke="none"/>`;
    for (const [v, closed] of [
      [i.lo, i.loClosed],
      [i.hi, i.hiClosed],
    ] as const) {
      if (v)
        body += `<circle class="accent" cx="${x(v.toNumber())}" cy="${y}" r="5" ${closed ? `fill="currentColor"` : `stroke-width="2"`}/>`;
    }
    const lo = i.lo && `${i.lo.toNumber()}`;
    const hi = i.hi && `${i.hi.toNumber()}`;
    const lw = closedWords(i.loClosed);
    const hw = closedWords(i.hiClosed);
    if (lo && hi) {
      en.push(`from ${lo} (${lw.en}) to ${hi} (${hw.en})`);
      zh.push(`从 ${lo}（${lw["zh-CN"]}）到 ${hi}（${hw["zh-CN"]}）`);
    } else if (lo) {
      en.push(`from ${lo} (${lw.en}) to the right, with an arrow`);
      zh.push(`从 ${lo}（${lw["zh-CN"]}）向右，带箭头`);
    } else if (hi) {
      en.push(`from ${hi} (${hw.en}) to the left, with an arrow`);
      zh.push(`从 ${hi}（${hw["zh-CN"]}）向左，带箭头`);
    } else {
      en.push("the whole line, with arrows at both ends");
      zh.push("整条数轴，两端带箭头");
    }
  }
  const alt = set.length === 0 ? t("nothing shaded", "没有涂色部分") : t(`shaded ${en.join(" and ")}`, `涂色部分${zh.join("，以及")}`);
  return { body, alt };
}

/** numberLineFigure graphs a set with integer endpoints on a number line from min to max. */
export function numberLineFigure(set: RealSet, min: number, max: number): Figure {
  const row = numberLineRow(set, min, max, 20, 30);
  return {
    svg: svgDocument(50, row.body),
    alt: t(`Number line from ${min} to ${max}, ${row.alt.en}.`, `从 ${min} 到 ${max} 的数轴，${row.alt["zh-CN"]}。`),
  };
}

/**
 * stackedNumberLines draws several sets on number lines from min to max, one under another and each named by a label on
 * its left, such as A, B and A ∪ B, so that a union or an intersection can be read off column by column.
 */
export function stackedNumberLines(rows: readonly { readonly set: RealSet; readonly label: string }[], min: number, max: number): Figure {
  let body = "";
  const en: string[] = [];
  const zh: string[] = [];
  rows.forEach((r, k) => {
    const y = 20 + 46 * k;
    const row = numberLineRow(r.set, min, max, y, 72);
    body += `<text x="24" y="${y + 4}" fill="currentColor" stroke="none">${r.label}</text>${row.body}`;
    en.push(`${r.label}: ${row.alt.en}`);
    zh.push(`${r.label}：${row.alt["zh-CN"]}`);
  });
  return {
    svg: svgDocument(46 * rows.length + 6, body),
    alt: t(
      `Number lines from ${min} to ${max}, one under another. ${en.join("; ")}.`,
      `从 ${min} 到 ${max} 的几条数轴上下排列。${zh.join("；")}。`,
    ),
  };
}

/** substitution writes b(x) + c = value for putting a number into bx + c. */
function substitution(b: number, c: number, x: Coefficient): string {
  const v = Q.of(b).mul(toQ(x)).add(Q.of(c));
  const coef = b === 1 ? "" : b === -1 ? "-" : num(b);
  return `${coef}(${num(x)}) ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${num(v)}`;
}

/** Compound is a generated double inequality a < bx + c ≤ d with its solution. */
interface Compound {
  readonly latex: string;
  readonly set: RealSet;
  readonly wrong: readonly RealSet[];
  /** work solves it step by step, ending in a display of the answer. */
  readonly work: Text;
  /** check tests the answer at a point inside it and one just outside. */
  readonly check: Text;
  readonly solution: Text;
}

/**
 * compoundCheck tests the answer p..r of L op1 bx + c op2 H at a point inside it and at the point r + 1 just past it, which
 * breaks the right part when b is positive and the left part when it is negative.
 */
function compoundCheck(b: number, c: number, p: number, r: number, L: number, op1: InequalityOp, op2: InequalityOp, H: number): Text {
  const m = r - p >= 2 ? Q.of(p + 1) : Q.of(2 * p + 1, 2);
  const vm = Q.of(b).mul(m).add(Q.of(c));
  const vo = b * (r + 1) + c;
  const broken = b > 0 ? `${num(vo)} ${relSymbol(op2)} ${num(H)}` : `${num(L)} ${relSymbol(op1)} ${num(vo)}`;
  return t(
    `**Check.** Take $x = ${num(m)}$, inside the answer: the middle part is $${substitution(b, c, m)}$, and $${num(L)} ${relSymbol(op1)} ${num(vm)} ${relSymbol(op2)} ${num(H)}$ is true. Take $x = ${r + 1}$, just outside: the middle part is $${substitution(b, c, r + 1)}$, and $${broken}$ is false.`,
    `**检验。** 取答案内的 $x = ${num(m)}$：中间部分是 $${substitution(b, c, m)}$，$${num(L)} ${relSymbol(op1)} ${num(vm)} ${relSymbol(op2)} ${num(H)}$ 成立。取刚好在答案外的 $x = ${r + 1}$：中间部分是 $${substitution(b, c, r + 1)}$，$${broken}$ 不成立。`,
  );
}

/** compound draws a double inequality whose middle part has a positive or a negative coefficient. */
function compound(rng: Rng, negative: boolean): Compound {
  const b = negative ? -(rng.bool(0.15) ? 1 : rng.int(2, 7)) : rng.bool(0.15) ? 1 : rng.int(2, 9);
  const c = rng.nonZero(-15, 15);
  const p = rng.int(-10, 7);
  const r = p + rng.int(1, 8);
  const op1 = rng.pick(lessOps);
  const op2 = rng.pick(lessOps);
  const c1 = op1 === "<=";
  const c2 = op2 === "<=";
  const shift =
    c > 0
      ? t(`Subtract $${c}$ from all three parts`, `三部分同时减去 $${c}$`)
      : t(`Add $${-c}$ to all three parts`, `三部分同时加上 $${-c}$`);
  const step1 = t(
    `**Step 1: remove the constant.** ${shift.en}. Doing the same thing to every part keeps both comparisons true:`,
    `**第一步：去掉常数。** ${shift["zh-CN"]}。对每一部分做同样的运算，两个比较都仍然成立：`,
  );
  if (!negative) {
    const L = b * p + c;
    const H = b * r + c;
    const latex = `${num(L)} ${relSymbol(op1)} ${linear(b, c)} ${relSymbol(op2)} ${num(H)}`;
    const set = union(span(p, c1, r, c2));
    const step2 =
      b === 1
        ? t(
            "**Step 2: read the answer.** The middle part is now $x$ alone, so this is the answer.",
            "**第二步：读出答案。** 中间只剩 $x$，这就是答案。",
          )
        : t(
            `**Step 2: divide by $${b}$.** Divide all three parts by $${b}$. It is positive, so both symbols stay as they are:${steps(inequalityLatexOf(set))}`,
            `**第二步：除以 $${b}$。** 三部分同时除以 $${b}$。它是正数，所以两个不等号方向都不变：${steps(inequalityLatexOf(set))}`,
          );
    const check = compoundCheck(b, c, p, r, L, op1, op2, H);
    const shifted = steps(latex, `${num(L - c)} ${relSymbol(op1)} ${poly([b, "x"])} ${relSymbol(op2)} ${num(H - c)}`);
    const work = t(`${step1.en}${shifted}${step2.en}\n\n`, `${step1["zh-CN"]}${shifted}${step2["zh-CN"]}\n\n`);
    return {
      latex,
      set,
      wrong: [
        union(span(p, !c1, r, !c2)),
        union(span(Q.of(L, b), c1, Q.of(H, b), c2)),
        union(span(Q.of(L + c, b), c1, Q.of(H + c, b), c2)),
      ],
      work,
      check,
      solution: t(`${work.en}${check.en}`, `${work["zh-CN"]}${check["zh-CN"]}`),
    };
  }
  const L = b * r + c;
  const H = b * p + c;
  const latex = `${num(L)} ${relSymbol(op1)} ${rng.bool() ? linear(b, c) : poly([c, ""], [b, "x"])} ${relSymbol(op2)} ${num(H)}`;
  const set = union(span(p, c2, r, c1));
  const shifted = steps(latex, `${num(L - c)} ${relSymbol(op1)} ${poly([b, "x"])} ${relSymbol(op2)} ${num(H - c)}`);
  const flipped = steps(`${num(r)} ${relSymbol(flip[op1])} x ${relSymbol(flip[op2])} ${num(p)}`, inequalityLatexOf(set));
  const check = compoundCheck(b, c, p, r, L, op1, op2, H);
  const work = t(
    `${step1.en}${shifted}**Step 2: divide by $${b}$.** Divide all three parts by $${b}$. Dividing by a negative number reverses the order of numbers, so **both** symbols turn around. Then rewrite from the smaller number to the larger; each endpoint keeps its own symbol:${flipped}`,
    `${step1["zh-CN"]}${shifted}**第二步：除以 $${b}$。** 三部分同时除以 $${b}$。除以负数会颠倒数的大小顺序，所以**两个**不等号都要改变方向。再按从小到大的顺序改写，每个端点保留自己的符号：${flipped}`,
  );
  return {
    latex,
    set,
    wrong: [union(span(p, c1, r, c2)), [], union(span(-r, c1, -p, c2))],
    work,
    check,
    solution: t(`${work.en}${check.en}`, `${work["zh-CN"]}${check["zh-CN"]}`),
  };
}

export const solvingCompoundInequalities: TopicDef = {
  id: "solving-compound-inequalities",
  title: t("Solving Compound Inequalities", "解复合不等式"),
  summary: t(
    "Check and solve double inequalities such as $-3 < 2x + 1 \\le 7$ by working on all three parts at once.",
    "检验并求解形如 $-3 < 2x + 1 \\le 7$ 的连不等式：对三部分同时运算。",
  ),
  prerequisites: ["solving-multi-step-inequalities"],
  encompasses: [
    { topic: "solving-multi-step-inequalities", weight: 0.5 },
    { topic: "inequalities-and-solutions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.3"],
  intro: t(
    `You can solve an inequality such as $2x + 1 \\le 7$: subtract $1$, divide by $2$, and $x \\le 3$. Many quantities are limited on **both** sides at once, though: a temperature between two marks, a score above a floor and below a ceiling. That is a **double inequality**, such as

$$-3 < 2x + 1 \\le 7.$$

It is two inequalities joined by "and": $-3 < 2x + 1$ and $2x + 1 \\le 7$. Solve them one at a time: the first gives $-4 < 2x$, so $x > -2$; the second gives $x \\le 3$. A solution must satisfy both, so $x$ lies between them:

{{figure 0}}

Notice that both solutions used the same steps, subtracting $1$ and dividing by $2$. So we can do them once, to all three parts together: $-4 < 2x \\le 6$, then $-2 < x \\le 3$. In this topic we check values against a double inequality and solve it this way, including when the coefficient of $x$ is negative.`,
    `你会解 $2x + 1 \\le 7$ 这样的不等式：减去 $1$，除以 $2$，得到 $x \\le 3$。但很多量是**两边**同时受限的：温度在两个刻度之间，分数高于下限又低于上限。这就是**连不等式**，例如

$$-3 < 2x + 1 \\le 7.$$

它是用"并且"连起来的两个不等式：$-3 < 2x + 1$ 并且 $2x + 1 \\le 7$。逐个求解：第一个得到 $-4 < 2x$，即 $x > -2$；第二个得到 $x \\le 3$。解必须同时满足两者，所以 $x$ 位于它们之间：

{{figure 0}}

注意两次求解用的是同样的步骤：减去 $1$，再除以 $2$。所以可以只做一次，对三部分同时进行：$-4 < 2x \\le 6$，再得到 $-2 < x \\le 3$。这个课题中，我们检验一个值是否满足连不等式，并用这种方法求解，包括 $x$ 的系数为负数的情形。`,
  ),
  introFigures: [numberLineFigure(union(span(-2, false, 3, true)), -5, 5)],
  knowledgePoints: [
    {
      id: "checking-double-inequalities",
      title: t("Reading a double inequality", "读连不等式"),
      explanation: t(
        `A **double inequality** such as $-3 < 2x + 1 \\le 7$ says two things at once: $-3 < 2x + 1$ **and** $2x + 1 \\le 7$. The middle part is compared with the number on its left and with the number on its right, so a value is a solution only if **both** comparisons are true.

To test a value, work out the middle part once, then read the two comparisons. For $x = 3$: $2(3) + 1 = 7$. Then $-3 < 7$ is true, and $7 \\le 7$ is true because $\\le$ allows equal, so $x = 3$ is a solution. For $x = -2$: $2(-2) + 1 = -3$, and $-3 < -3$ is false, because a number is not less than itself. So $x = -2$ is not a solution, even though the right part holds.

> **Watch out.** One true comparison is not enough: both must hold. When the middle part comes out equal to an end number, look at that end's symbol: $\\le$ lets the value in, $<$ keeps it out.`,
        `**连不等式**（如 $-3 < 2x + 1 \\le 7$）同时表示两件事：$-3 < 2x + 1$ **并且** $2x + 1 \\le 7$。中间部分既要和左边的数比较，也要和右边的数比较，所以只有两个比较**都**成立的值才是解。

检验一个值时，先算一次中间部分，再看两个比较。对 $x = 3$：$2(3) + 1 = 7$。$-3 < 7$ 成立；$7 \\le 7$ 也成立，因为 $\\le$ 允许相等，所以 $x = 3$ 是解。对 $x = -2$：$2(-2) + 1 = -3$，而 $-3 < -3$ 不成立，因为一个数不小于它自己。所以 $x = -2$ 不是解，尽管右边的比较成立。

> **注意。** 只有一个比较成立是不够的，两个都必须成立。中间部分恰好等于一端的数时，要看那一端的符号：$\\le$ 允许取到，$<$ 不允许。`,
      ),
      keyPrerequisites: ["inequalities-and-solutions"],
      generate(rng) {
        const b = rng.nonZero(-5, 5);
        const c = rng.nonZero(-10, 10);
        const x0 = rng.int(-8, 8);
        const v = b * x0 + c;
        const lo = v - rng.int(-3, 6);
        const hi = lo + rng.int(2, 10);
        const op1 = rng.pick(lessOps);
        const op2 = rng.pick(lessOps);
        const left = holds(lo, op1, v);
        const right = holds(v, op2, hi);
        const ok = left && right;
        const expr = linear(b, c);
        const sub = substitution(b, c, x0);
        const tf = (x: boolean) => (x ? t("true", "成立") : t("false", "不成立"));
        const why = (a: number, op: InequalityOp, z: number): Text =>
          a === z
            ? op === "<="
              ? t(" (equal is allowed by $\\le$)", "（$\\le$ 允许相等）")
              : t(" (a number is not less than itself)", "（一个数不小于它自己）")
            : t("", "");
        const wl = why(lo, op1, v);
        const wr = why(v, op2, hi);
        return choiceProblem({
          prompt: t(
            `Is $x = ${num(x0)}$ a solution of $${num(lo)} ${relSymbol(op1)} ${expr} ${relSymbol(op2)} ${num(hi)}$?`,
            `$x = ${num(x0)}$ 是 $${num(lo)} ${relSymbol(op1)} ${expr} ${relSymbol(op2)} ${num(hi)}$ 的解吗？`,
          ),
          options: yesNo,
          correct: ok ? 0 : 1,
          solution: t(
            `**Step 1: the middle part.** Substitute $x = ${num(x0)}$ into $${expr}$: $${sub}$.

**Step 2: both comparisons.** The double inequality holds only if both of its parts do. $${num(lo)} ${relSymbol(op1)} ${num(v)}$ is ${tf(left).en}${wl.en}, and $${num(v)} ${relSymbol(op2)} ${num(hi)}$ is ${tf(right).en}${wr.en}.

${ok ? `Both are true, so $x = ${num(x0)}$ is a solution.` : `${left || right ? "One of them is false" : "Both are false"}, so $x = ${num(x0)}$ is not a solution.`}`,
            `**第一步：中间部分。** 把 $x = ${num(x0)}$ 代入 $${expr}$：$${sub}$。

**第二步：两个比较。** 只有两部分都成立，连不等式才成立。$${num(lo)} ${relSymbol(op1)} ${num(v)}$ ${tf(left)["zh-CN"]}${wl["zh-CN"]}，$${num(v)} ${relSymbol(op2)} ${num(hi)}$ ${tf(right)["zh-CN"]}${wr["zh-CN"]}。

${ok ? `两个都成立，所以 $x = ${num(x0)}$ 是解。` : `${left || right ? "其中一个不成立" : "两个都不成立"}，所以 $x = ${num(x0)}$ 不是解。`}`,
          ),
        });
      },
    },
    {
      id: "double-inequalities-positive-coefficient",
      title: t("Solving with a positive coefficient", "系数为正时求解"),
      explanation: t(
        `A double inequality is two inequalities that need the same steps, so we do each step once, to **all three parts**. Adding, subtracting, or dividing by a positive number keeps every comparison true, so the result means the same thing with $x$ more alone.

Solve $-3 < 2x + 1 \\le 7$. The middle part is "$2x$, then add $1$", so undo the $+1$ first by subtracting $1$ from every part, then undo the doubling by dividing every part by $2$:

$$-3 < 2x + 1 \\le 7 \\;\\Rightarrow\\; -4 < 2x \\le 6 \\;\\Rightarrow\\; -2 < x \\le 3$$

Each symbol stays on its own side: the left end keeps $<$, so $-2$ is excluded; the right end keeps $\\le$, so $3$ is included. Check with $x = 0$: the middle is $1$, and $-3 < 1 \\le 7$ is true.

> **Watch out.** Change **all three** parts, not only the middle. Divide the end numbers only after subtracting the constant from them too, and subtract it, not add it. Keep each symbol where it was: swapping $<$ and $\\le$ includes the wrong endpoint.`,
        `连不等式是需要同样步骤的两个不等式，所以每一步只做一次，作用于**三部分**。加、减或除以正数都不改变比较的结果，所以得到的式子意思不变，只是 $x$ 更孤立了。

解 $-3 < 2x + 1 \\le 7$。中间部分是"先乘 $2$，再加 $1$"，所以先把每部分都减去 $1$ 去掉 $+1$，再把每部分都除以 $2$：

$$-3 < 2x + 1 \\le 7 \\;\\Rightarrow\\; -4 < 2x \\le 6 \\;\\Rightarrow\\; -2 < x \\le 3$$

每个不等号留在原来的一侧：左端仍是 $<$，所以不包含 $-2$；右端仍是 $\\le$，所以包含 $3$。用 $x = 0$ 检验：中间是 $1$，$-3 < 1 \\le 7$ 成立。

> **注意。** 要改变**三部分**，不只是中间。两端的数也要先减去常数再除，而且是减去，不是加上。每个不等号留在原位：把 $<$ 和 $\\le$ 对调会把端点弄错。`,
      ),
      keyPrerequisites: ["solving-multi-step-inequalities"],
      generate(rng) {
        const p = compound(rng, false);
        return intervalProblem({
          prompt: ask(`Solve $${p.latex}$.`, `解不等式 $${p.latex}$。`, asInequality("x")),
          set: p.set,
          form: "inequality",
          wrong: p.wrong,
          solution: p.solution,
        });
      },
    },
    {
      id: "double-inequalities-negative-coefficient",
      title: t("Solving with a negative coefficient", "系数为负时求解"),
      explanation: t(
        `When every part of a double inequality is divided by a **negative** number, the order of the numbers turns around: $2 < 3$, but $-2 > -3$. So **both** symbols reverse, and the result reads from large to small; rewrite it so the smaller number comes first.

Solve $-5 \\le 7 - 3x < 10$. Subtract $7$ from all three parts, then divide all three by $-3$ and reverse both symbols:

$$-5 \\le 7 - 3x < 10 \\;\\Rightarrow\\; -12 \\le -3x < 3 \\;\\Rightarrow\\; 4 \\ge x > -1 \\;\\Rightarrow\\; -1 < x \\le 4$$

Each endpoint keeps the kind of symbol it had: $4$ came from $\\le$ and stays included; $-1$ came from $<$ and stays excluded. Check with $x = 0$: the middle is $7$, and $-5 \\le 7 < 10$ is true; with $x = 5$, just outside, it is $-8$, and $-5 \\le -8$ is false.

> **Watch out.** Reverse **both** symbols. If you forget, you get $4 \\le x < -1$, which no number satisfies. When you turn the result around, move each symbol with its number: the end that had $\\le$ is still included, so do not swap which end is open.`,
        `三部分同时除以**负数**时，数的大小顺序会颠倒：$2 < 3$，但 $-2 > -3$。所以**两个**不等号都要改变方向，结果变成从大到小；再把它改写成小数在前。

解 $-5 \\le 7 - 3x < 10$。三部分同时减去 $7$，再同时除以 $-3$，两个不等号都改变方向：

$$-5 \\le 7 - 3x < 10 \\;\\Rightarrow\\; -12 \\le -3x < 3 \\;\\Rightarrow\\; 4 \\ge x > -1 \\;\\Rightarrow\\; -1 < x \\le 4$$

每个端点保留原来符号的类型：$4$ 来自 $\\le$，仍然包含；$-1$ 来自 $<$，仍然不包含。用 $x = 0$ 检验：中间是 $7$，$-5 \\le 7 < 10$ 成立；取刚好在外面的 $x = 5$，中间是 $-8$，$-5 \\le -8$ 不成立。

> **注意。** **两个**不等号都要改变方向。忘了改，就会得到 $4 \\le x < -1$，没有数满足它。把结果倒过来写时，符号要跟着自己的数走：原来是 $\\le$ 的那一端仍然包含，不要把开闭的端点弄反。`,
      ),
      keyPrerequisites: ["solving-one-step-inequalities"],
      generate(rng) {
        const p = compound(rng, true);
        return intervalProblem({
          prompt: ask(`Solve $${p.latex}$.`, `解不等式 $${p.latex}$。`, asInequality("x")),
          set: p.set,
          form: "inequality",
          wrong: p.wrong,
          solution: p.solution,
        });
      },
    },
  ],
};

/** boundedEnds draws lo < hi: integers, or now and then halves. */
function boundedEnds(rng: Rng): [Q, Q] {
  const lo = rng.bool(0.2) ? Q.of(2 * rng.int(-8, 6) + 1, 2) : Q.of(rng.int(-15, 12));
  return [lo, lo.add(Q.of(rng.int(1, 12)))];
}

/** bracketWords explains the brackets of a bounded interval. */
function bracketWords(i: Interval): Text {
  const end = (v: Q, closed: boolean) =>
    closed
      ? t(`$${num(v)}$ is included, so it gets a square bracket`, `包含 $${num(v)}$，用方括号`)
      : t(`$${num(v)}$ is excluded, so it gets a parenthesis`, `不包含 $${num(v)}$，用圆括号`);
  const a = end(i.lo!, i.loClosed);
  const b = end(i.hi!, i.hiClosed);
  return t(`${a.en}; ${b.en}`, `${a["zh-CN"]}；${b["zh-CN"]}`);
}

/** insidePoint is a number strictly between lo and hi: the integer after lo when there is room, else the midpoint. */
const insidePoint = (lo: Q, hi: Q): Q => (hi.sub(lo).cmp(Q.of(2)) >= 0 && lo.d === 1n ? lo.add(Q.one) : lo.add(hi).div(Q.of(2)));

/** intervalReadBack checks a bounded interval by reading it back as an inequality and testing a number inside it. */
function intervalReadBack(i: Interval): Text {
  const m = insidePoint(i.lo!, i.hi!);
  const ineq = inequalityLatexOf([i]);
  return t(
    `**Check.** Read it back: $${show(i)}$ means $${ineq}$. A number inside, such as $${num(m)}$, satisfies it, and each endpoint is in the set exactly when its bracket is square.`,
    `**检验。** 反过来读：$${show(i)}$ 表示 $${ineq}$。区间内的数，例如 $${num(m)}$，满足它；每个端点只有在方括号一侧时才属于这个集合。`,
  );
}

export const intervalNotation: TopicDef = {
  id: "interval-notation",
  title: t("Interval Notation", "区间记号"),
  summary: t(
    "Write bounded sets of numbers such as $-2 < x \\le 5$ in interval notation, and back.",
    "用区间记号表示 $-2 < x \\le 5$ 这样的有界数集，以及反过来。",
  ),
  prerequisites: ["solving-compound-inequalities"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSA.REI.B.3"],
  intro: t(
    `Solving $-3 < 2x + 1 \\le 7$ gave $-2 < x \\le 3$: every number from $-2$ to $3$, without $-2$ and with $3$. That set is fixed by just three facts: where it starts, where it ends, and whether each end belongs to it. **Interval notation** writes exactly those three facts and nothing else.

Write the two endpoints in order, smaller first, separated by a comma: $-2, 3$. Then enclose each end with a mark that says whether it is included. A **parenthesis** means excluded, like the open circle on a number line; a **square bracket** means included, like the closed dot:

{{figure 0}}

So $-2 < x \\le 3$ is written $(-2, 3]$. The notation is shorter than an inequality and needs no variable, which is why it is used for answers, for the domains and ranges of functions, and for combining sets later on. In this topic we translate between inequalities, intervals and number-line graphs, and write the solutions of double inequalities as intervals.`,
    `解 $-3 < 2x + 1 \\le 7$ 得到 $-2 < x \\le 3$：从 $-2$ 到 $3$ 的所有数，不含 $-2$，含 $3$。这个集合只由三件事确定：从哪里开始、到哪里结束、每个端点是否属于它。**区间记号**恰好写出这三件事，别的都不写。

把两个端点按从小到大写出，中间用逗号隔开：$-2, 3$。再在每一端加上一个记号，表示是否包含该端点。**圆括号**表示不包含，就像数轴上的空心圈；**方括号**表示包含，就像实心点：

{{figure 0}}

所以 $-2 < x \\le 3$ 写作 $(-2, 3]$。这种记号比不等式更短，也不需要变量，所以常用来写答案、写函数的定义域和值域，以及后面合并集合。这个课题中，我们在不等式、区间和数轴图像之间互相转换，并把连不等式的解写成区间。`,
  ),
  introFigures: [numberLineFigure(union(span(-2, false, 3, true)), -4, 5)],
  knowledgePoints: [
    {
      id: "inequality-to-interval-notation",
      title: t("From inequalities to intervals", "从不等式到区间"),
      explanation: t(
        `**Interval notation** writes the numbers between two endpoints as a pair: the smaller endpoint first, then the larger. Each end gets its own mark, decided by that end's symbol alone. A **square bracket** $[\\;]$ means the endpoint is included ($\\le$); a **parenthesis** $(\\;)$ means it is excluded ($<$):

| Inequality | Interval |
| :--- | :--- |
| $-2 < x < 5$ | $(-2, 5)$ |
| $-2 \\le x \\le 5$ | $[-2, 5]$ |
| $-2 < x \\le 5$ | $(-2, 5]$ |
| $-2 \\le x < 5$ | $[-2, 5)$ |

An inequality written from right to left, such as $5 > x \\ge -2$, is the same set as $-2 \\le x < 5$: $x$ is at least $-2$ and less than $5$. Turn it around first, carrying each symbol with its number, then write $[-2, 5)$.

> **Watch out.** A bracket belongs to its own endpoint: $-2 \\le x < 5$ has a square bracket at $-2$ and a parenthesis at $5$, not the other way round. Square brackets are only for ends that are included, so do not use them for every interval.`,
        `**区间记号**用一对数表示两个端点之间的数：较小的端点在前，较大的在后。每一端有自己的记号，只由这一端的符号决定。**方括号** $[\\;]$ 表示包含端点（$\\le$），**圆括号** $(\\;)$ 表示不包含（$<$）：

| 不等式 | 区间 |
| :--- | :--- |
| $-2 < x < 5$ | $(-2, 5)$ |
| $-2 \\le x \\le 5$ | $[-2, 5]$ |
| $-2 < x \\le 5$ | $(-2, 5]$ |
| $-2 \\le x < 5$ | $[-2, 5)$ |

从右往左写的不等式，如 $5 > x \\ge -2$，与 $-2 \\le x < 5$ 是同一个集合：$x$ 不小于 $-2$ 且小于 $5$。先把它倒过来写，每个符号跟着自己的数走，再写成 $[-2, 5)$。

> **注意。** 括号属于它自己那一端：$-2 \\le x < 5$ 在 $-2$ 处用方括号、在 $5$ 处用圆括号，不能反过来。方括号只用于包含的端点，不要每个区间都用方括号。`,
      ),
      generate(rng) {
        const [lo, hi] = boundedEnds(rng);
        const lc = rng.bool();
        const hc = rng.bool();
        const set = union(span(lo, lc, hi, hc));
        const reversed = rng.bool(0.25);
        const shown = reversed ? `${num(hi)} ${hc ? "\\ge" : ">"} x ${lc ? "\\ge" : ">"} ${num(lo)}` : inequalityLatexOf(set);
        const words = bracketWords(set[0]!);
        const order = reversed
          ? t(
              `**Step 1: the order.** The inequality is written from right to left. Read it from the smaller number, carrying each symbol with its number: $${inequalityLatexOf(set)}$. So $${num(lo)}$ comes first and $${num(hi)}$ second.`,
              `**第一步：顺序。** 这个不等式是从右往左写的。从较小的数读起，每个符号跟着自己的数：$${inequalityLatexOf(set)}$。所以 $${num(lo)}$ 在前，$${num(hi)}$ 在后。`,
            )
          : t(
              `**Step 1: the order.** The smaller endpoint, $${num(lo)}$, comes first and the larger, $${num(hi)}$, second.`,
              `**第一步：顺序。** 较小的端点 $${num(lo)}$ 在前，较大的端点 $${num(hi)}$ 在后。`,
            );
        const check = intervalReadBack(set[0]!);
        return intervalProblem({
          prompt: t(`Write $${shown}$ in interval notation.`, `用区间记号表示 $${shown}$。`),
          set,
          form: "interval",
          wrong: [union(span(lo, !lc, hi, !hc)), union(span(lo, hc, hi, lc)), union(span(lo, true, hi, true))],
          solution: t(
            `${order.en}\n\n**Step 2: the brackets.** Each end is decided by its own symbol: ${words.en}. The interval is $${intervalLatex(set)}$.\n\n${check.en}`,
            `${order["zh-CN"]}\n\n**第二步：括号。** 每一端由自己的符号决定：${words["zh-CN"]}。区间是 $${intervalLatex(set)}$。\n\n${check["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "interval-notation-to-inequality",
      title: t("From intervals to inequalities", "从区间到不等式"),
      explanation: t(
        `Interval notation lists the smallest and largest values of a set. A bracket means the endpoint is included, and a parenthesis means it is left out. An inequality says the same thing with symbols: $\\le$ allows equality, $<$ does not.

To read an interval, put $x$ between its endpoints, smaller on the left, and turn each mark into a symbol on its own side: a square bracket becomes $\\le$, a parenthesis becomes $<$. For $[-4, 1)$ the left end has a bracket, so $-4 \\le x$; the right end has a parenthesis, so $x < 1$:

$$[-4, 1) \\quad\\text{means}\\quad -4 \\le x < 1$$

> **Watch out.** Translate each end separately: a bracket on one side and a parenthesis on the other give $\\le$ on one side and $<$ on the other. A parenthesis is never $\\le$, and the symbols point the same way, with the smaller number on the left.`,
        `区间记号写出一个集合的最小值和最大值。方括号表示包含端点，圆括号表示不包含端点。不等式用符号说同样的事：$\\le$ 允许相等，$<$ 不允许。

读区间时，把 $x$ 放在两个端点之间，较小的在左边，再把每一端的记号变成这一侧的符号：方括号变成 $\\le$，圆括号变成 $<$。$[-4, 1)$ 的左端是方括号，所以 $-4 \\le x$；右端是圆括号，所以 $x < 1$：

$$[-4, 1) \\quad\\text{表示}\\quad -4 \\le x < 1$$

> **注意。** 两端要分别翻译：一侧方括号、另一侧圆括号，就是一侧 $\\le$、另一侧 $<$。圆括号绝不是 $\\le$；两个符号方向相同，较小的数在左边。`,
      ),
      generate(rng) {
        const [lo, hi] = boundedEnds(rng);
        const lc = rng.bool();
        const hc = rng.bool();
        const set = union(span(lo, lc, hi, hc));
        const sym = (closed: boolean) => (closed ? "\\le" : "<");
        const mark = (closed: boolean) => (closed ? t("a square bracket", "方括号") : t("a parenthesis", "圆括号"));
        const left = t(
          `**Step 1: the left end.** $${num(lo)}$ has ${mark(lc).en}, so $${num(lo)} ${sym(lc)} x$.`,
          `**第一步：左端。** $${num(lo)}$ 处是${mark(lc)["zh-CN"]}，所以 $${num(lo)} ${sym(lc)} x$。`,
        );
        const right = t(
          `**Step 2: the right end.** $${num(hi)}$ has ${mark(hc).en}, so $x ${sym(hc)} ${num(hi)}$. Together: $${inequalityLatexOf(set)}$.`,
          `**第二步：右端。** $${num(hi)}$ 处是${mark(hc)["zh-CN"]}，所以 $x ${sym(hc)} ${num(hi)}$。合起来：$${inequalityLatexOf(set)}$。`,
        );
        const inLo = lc ? t("satisfies", "满足") : t("does not satisfy", "不满足");
        return intervalProblem({
          prompt: ask(`The interval is $${intervalLatex(set)}$.`, `区间是 $${intervalLatex(set)}$。`, asInequality("x")),
          set,
          form: "inequality",
          wrong: [union(span(lo, !lc, hi, !hc)), union(span(lo, hc, hi, lc)), union(span(lo, true, hi, true))],
          solution: t(
            `${left.en}\n\n${right.en}\n\n**Check.** The endpoint $x = ${num(lo)}$ ${inLo.en} $${inequalityLatexOf(set)}$, just as ${mark(lc).en} at $${num(lo)}$ says it is ${lc ? "included" : "excluded"}.`,
            `${left["zh-CN"]}\n\n${right["zh-CN"]}\n\n**检验。** 端点 $x = ${num(lo)}$ ${inLo["zh-CN"]} $${inequalityLatexOf(set)}$，与 $${num(lo)}$ 处的${mark(lc)["zh-CN"]}表示的${lc ? "包含" : "不包含"}一致。`,
          ),
        });
      },
    },
    {
      id: "graphs-of-bounded-intervals",
      figure: algebraDrawings["interval-notation#graphs-of-bounded-intervals"],
      title: t("Reading graphs of intervals", "读区间的图像"),
      explanation: t(
        `A number line shows a set as a shaded piece of the line, and each end of the piece says whether its endpoint belongs. A **closed dot** marks an endpoint that is included and an **open circle** one that is excluded; the shaded segment between them holds the other numbers of the set.

The dots match the brackets: closed dot, square bracket; open circle, parenthesis. A segment from an open circle at $-1$ to a closed dot at $4$ holds every number from $-1$ to $4$, with $4$ but without $-1$, so it is $(-1, 4]$.

> **Watch out.** Read each end separately, left end first: the open circle at $-1$ gives the parenthesis at $-1$, whatever the other end shows. An open circle is not included even though it is drawn on the line.`,
        `数轴用线上的一段涂色部分表示一个集合，每一端说明端点是否属于集合。**实心点**表示包含该端点，**空心圈**表示不包含；两者之间的涂色线段是集合中的其他数。

点和括号一一对应：实心点对应方括号，空心圈对应圆括号。从 $-1$ 处的空心圈到 $4$ 处的实心点的线段包含从 $-1$ 到 $4$ 的每个数，含 $4$ 不含 $-1$，所以是 $(-1, 4]$。

> **注意。** 两端分别读，先读左端：$-1$ 处的空心圈对应 $-1$ 处的圆括号，与另一端无关。空心圈虽然画在线上，但并不包含在集合里。`,
      ),
      generate(rng) {
        const a = rng.int(-8, 5);
        const b = a + rng.int(1, 8);
        const lc = rng.bool();
        const hc = rng.bool();
        const set = union(span(a, lc, b, hc));
        const figure = numberLineFigure(set, a - rng.int(1, 3), b + rng.int(1, 3));
        const end = (v: number, closed: boolean, side: Text) =>
          t(
            `The ${side.en} end at $${v}$ is ${closed ? "a closed dot, so it is included: a square bracket" : "an open circle, so it is excluded: a parenthesis"}.`,
            `${side["zh-CN"]}端 $${v}$ 处是${closed ? "实心点，包含，用方括号" : "空心圈，不包含，用圆括号"}。`,
          );
        const l = end(a, lc, t("left", "左"));
        const r = end(b, hc, t("right", "右"));
        const check = intervalReadBack(set[0]!);
        return {
          ...intervalProblem({
            prompt: ask("Write the set graphed on the number line.", "写出数轴上所表示的集合。", asInterval),
            set,
            form: "interval",
            wrong: [union(span(a, !lc, b, !hc)), union(span(a, hc, b, lc))],
            solution: t(
              `**Step 1: the ends.** The shading runs from $${a}$ to $${b}$. ${l.en} ${r.en}\n\n**Step 2: write it.** Smaller endpoint first: $${intervalLatex(set)}$.\n\n${check.en}`,
              `**第一步：两端。** 涂色部分从 $${a}$ 到 $${b}$。${l["zh-CN"]}${r["zh-CN"]}\n\n**第二步：写出区间。** 较小的端点在前：$${intervalLatex(set)}$。\n\n${check["zh-CN"]}`,
            ),
          }),
          figure,
        };
      },
    },
    {
      id: "solving-in-interval-notation",
      title: t("Answers in interval notation", "用区间记号写解集"),
      explanation: t(
        `The solution of a double inequality is a set of numbers between two endpoints, and interval notation describes it compactly. Solve as before, doing each step to all three parts, then translate: each endpoint keeps the type of symbol it ended up with.

Solve $-1 \\le 3x + 5 < 11$. Subtract $5$ from all three parts and divide them by $3$:

$$-1 \\le 3x + 5 < 11 \\;\\Rightarrow\\; -6 \\le 3x < 6 \\;\\Rightarrow\\; -2 \\le x < 2 \\;\\Rightarrow\\; [-2, 2)$$

The $\\le$ at $-2$ becomes a square bracket and the $<$ at $2$ a parenthesis. When the coefficient is negative, reverse both symbols and put the smaller number first **before** choosing the brackets.

> **Watch out.** Brackets come from the final, solved inequality, not from the original one, and the smaller endpoint always comes first: an interval such as $(2, -2]$ is empty. Do the same step to all three parts, so that both endpoints move.`,
        `连不等式的解是两个端点之间的一组数，用区间记号可以简洁地表示。像之前一样求解，每一步都作用于三部分，然后翻译：每个端点按最后得到的符号类型选括号。

解 $-1 \\le 3x + 5 < 11$。三部分同时减去 $5$，再同时除以 $3$：

$$-1 \\le 3x + 5 < 11 \\;\\Rightarrow\\; -6 \\le 3x < 6 \\;\\Rightarrow\\; -2 \\le x < 2 \\;\\Rightarrow\\; [-2, 2)$$

$-2$ 处的 $\\le$ 变成方括号，$2$ 处的 $<$ 变成圆括号。系数为负数时，先把两个不等号都改变方向、把较小的数放在前面，**然后**再选括号。

> **注意。** 括号由最后解出的不等式决定，而不是由原来的不等式决定；较小的端点总在前面，像 $(2, -2]$ 这样的区间是空的。每一步都要作用于三部分，两个端点才都会改变。`,
      ),
      generate(rng) {
        const p = compound(rng, rng.bool(0.4));
        return intervalProblem({
          prompt: ask(`Solve $${p.latex}$.`, `解不等式 $${p.latex}$。`, asInterval),
          set: p.set,
          form: "interval",
          wrong: p.wrong,
          solution: t(
            `${p.work.en}**Step 3: interval notation.** Write the endpoints smaller first, with a square bracket for $\\le$ and a parenthesis for $<$: $${intervalLatex(p.set)}$.\n\n${p.check.en}`,
            `${p.work["zh-CN"]}**第三步：区间记号。** 较小的端点在前，$\\le$ 用方括号，$<$ 用圆括号：$${intervalLatex(p.set)}$。\n\n${p.check["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

/** rayEnd draws the endpoint of a ray: an integer, or now and then a fraction. */
function rayEnd(rng: Rng): Q {
  return rng.bool(0.2) ? Q.of(rng.sign() * rng.pick([1, 3, 5, 7, 9]), rng.pick([2, 4])) : Q.of(rng.int(-20, 20));
}

/** rayCheck tests the ray x op v at the number one unit inside it and at its endpoint. */
function rayCheck(op: InequalityOp, v: Q): Text {
  const left = op === "<" || op === "<=";
  const w = left ? v.sub(Q.one) : v.add(Q.one);
  const ineq = inequalityLatex("x", op, v);
  const closed = op.length === 2;
  return t(
    `**Check.** $${num(w)}$ lies on the ray, and $${num(w)} ${relSymbol(op)} ${num(v)}$ is true. The endpoint $${num(v)}$ ${closed ? "satisfies" : "does not satisfy"} $${ineq}$, so its ${closed ? "square bracket" : "parenthesis"} is right.`,
    `**检验。** $${num(w)}$ 在射线上，$${num(w)} ${relSymbol(op)} ${num(v)}$ 成立。端点 $${num(v)}$ ${closed ? "满足" : "不满足"} $${ineq}$，所以那一端用${closed ? "方括号" : "圆括号"}是对的。`,
  );
}

export const unboundedIntervals: TopicDef = {
  id: "unbounded-intervals",
  title: t("Unbounded Intervals", "无界区间"),
  summary: t(
    "Write sets such as $x \\ge 3$ as intervals that reach $\\infty$ or $-\\infty$.",
    "把 $x \\ge 3$ 这样的集合写成延伸到 $\\infty$ 或 $-\\infty$ 的区间。",
  ),
  prerequisites: ["interval-notation"],
  encompasses: [{ topic: "interval-notation", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSA.REI.B.3"],
  intro: t(
    `Interval notation writes a set by its two ends: $-2 < x \\le 3$ is $(-2, 3]$. But the solution of a single inequality, such as $x \\ge 3$, has only one end. It contains $3$, $10$, $1000$ and every larger number, so on a number line its shading runs off to the right with an arrow:

{{figure 0}}

There is no largest number to write as the right end. Instead we write the symbol $\\infty$, **infinity**, which means "with no end in this direction". So $x \\ge 3$ is $[3, \\infty)$. Infinity is not a number the set could contain, so it always takes a parenthesis. On the left, $-\\infty$ plays the same part: $x < 3$ is $(-\\infty, 3)$.

In this topic we write such **unbounded intervals**, read them back as inequalities and from graphs, and use them for the solutions of linear inequalities.`,
    `区间记号用两个端点表示一个集合：$-2 < x \\le 3$ 就是 $(-2, 3]$。但单个不等式的解，例如 $x \\ge 3$，只有一个端点。它包含 $3$、$10$、$1000$ 以及所有更大的数，所以在数轴上它的涂色部分带着箭头一直向右延伸：

{{figure 0}}

没有最大的数可以作为右端点。于是我们写符号 $\\infty$，即**无穷大**，意思是"这个方向没有尽头"。所以 $x \\ge 3$ 是 $[3, \\infty)$。无穷大不是集合能包含的数，所以总是用圆括号。在左边，$-\\infty$ 起同样的作用：$x < 3$ 是 $(-\\infty, 3)$。

这个课题中，我们书写这样的**无界区间**，把它们读回不等式、从图像中读出它们，并用它们表示一元一次不等式的解。`,
  ),
  introFigures: [numberLineFigure(union(ray(">=", 3)), -2, 8)],
  knowledgePoints: [
    {
      id: "rays-in-interval-notation",
      title: t("From inequalities to unbounded intervals", "从不等式到无界区间"),
      explanation: t(
        `A set with no largest number goes on to **infinity**, written $\\infty$; a set with no smallest number starts at $-\\infty$. Infinity is not a number, so it can never be included: it always gets a parenthesis. The other end is an ordinary endpoint, with a bracket when its symbol is $\\le$ or $\\ge$.

| Inequality | Interval |
| :--- | :--- |
| $x > 3$ | $(3, \\infty)$ |
| $x \\ge 3$ | $[3, \\infty)$ |
| $x < 3$ | $(-\\infty, 3)$ |
| $x \\le 3$ | $(-\\infty, 3]$ |

To decide the side, ask which numbers satisfy it. $x \\le 3$ holds for $3$, $0$, $-100$: it runs to the left, so it is $(-\\infty, 3]$. When the inequality is written with $x$ on the right, as $3 \\ge x$, read it as $x \\le 3$ first. All real numbers form $(-\\infty, \\infty)$, also written $\\mathbb{R}$.

> **Watch out.** $x > 3$ points **right**, toward $\\infty$; $x < 3$ points left. In $3 \\ge x$ the symbol opens toward $3$, so $x$ is the smaller: it is $x \\le 3$, not $x \\ge 3$. And $\\ge$ or $\\le$ gives a square bracket at the number, never at $\\infty$.`,
        `没有最大数的集合一直延伸到**无穷大**，记作 $\\infty$；没有最小数的集合从 $-\\infty$ 开始。无穷大不是一个数，不可能被包含，所以总是用圆括号。另一端是普通端点，符号是 $\\le$ 或 $\\ge$ 时用方括号。

| 不等式 | 区间 |
| :--- | :--- |
| $x > 3$ | $(3, \\infty)$ |
| $x \\ge 3$ | $[3, \\infty)$ |
| $x < 3$ | $(-\\infty, 3)$ |
| $x \\le 3$ | $(-\\infty, 3]$ |

判断方向时，问一问哪些数满足它。$x \\le 3$ 对 $3$、$0$、$-100$ 都成立：它向左延伸，所以是 $(-\\infty, 3]$。如果 $x$ 写在右边，如 $3 \\ge x$，先把它读成 $x \\le 3$。全体实数是 $(-\\infty, \\infty)$，也记作 $\\mathbb{R}$。

> **注意。** $x > 3$ 指向**右边**，朝 $\\infty$；$x < 3$ 指向左边。$3 \\ge x$ 中开口朝向 $3$，$x$ 较小：它是 $x \\le 3$，不是 $x \\ge 3$。$\\ge$ 或 $\\le$ 让那个数用方括号，$\\infty$ 永远不用方括号。`,
      ),
      generate(rng) {
        const v = rayEnd(rng);
        const op = rng.pick(allOps);
        const set = union(ray(op, v));
        const reversed = rng.bool(0.3);
        const shown = reversed ? `${num(v)} ${relSymbol(flip[op])} x` : inequalityLatex("x", op, v);
        const left = op === "<" || op === "<=";
        const read = reversed
          ? t(
              `With $x$ on the left, $${shown}$ says $${inequalityLatex("x", op, v)}$. `,
              `把 $x$ 写在左边，$${shown}$ 就是 $${inequalityLatex("x", op, v)}$。`,
            )
          : t("", "");
        return intervalProblem({
          prompt: t(`Write $${shown}$ in interval notation.`, `用区间记号表示 $${shown}$。`),
          set,
          form: "interval",
          wrong: [union(ray(strictness[op], v)), union(ray(flip[op], v)), union(ray(strictness[flip[op]], v))],
          solution: t(
            `**Step 1: the direction.** ${read.en}The numbers ${left ? "less" : "greater"} than $${num(v)}$ satisfy it, so the set ${left ? "has no smallest number and starts at $-\\infty$" : "has no largest number and goes on to $\\infty$"}, which takes a parenthesis.

**Step 2: the endpoint.** The symbol is ${op.length === 2 ? `$${relSymbol(op)}$, so $${num(v)}$ is included: a square bracket` : `$${relSymbol(op)}$, so $${num(v)}$ is excluded: a parenthesis`}. The interval is $${intervalLatex(set)}$.

${rayCheck(op, v).en}`,
            `**第一步：方向。** ${read["zh-CN"]}${left ? "小于" : "大于"} $${num(v)}$ 的数满足它，所以这个集合${left ? "没有最小的数，从 $-\\infty$ 开始" : "没有最大的数，延伸到 $\\infty$"}，这一端用圆括号。

**第二步：端点。** 符号是 ${op.length === 2 ? `$${relSymbol(op)}$，所以包含 $${num(v)}$：用方括号` : `$${relSymbol(op)}$，所以不包含 $${num(v)}$：用圆括号`}。区间是 $${intervalLatex(set)}$。

${rayCheck(op, v)["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "unbounded-intervals-to-inequalities",
      title: t("From unbounded intervals to inequalities", "从无界区间到不等式"),
      explanation: t(
        `An interval with no end on one side uses the symbol $\\infty$ or $-\\infty$, which always takes a parenthesis because infinity is not a number that can be included. Only the other end, the real endpoint, carries information about inclusion.

An interval that ends at $\\infty$ holds the numbers above its endpoint: it is $x > a$ or $x \\ge a$. One that starts at $-\\infty$ holds the numbers below: $x < b$ or $x \\le b$. In $(-\\infty, 7]$ the numbers run up to $7$, and the bracket at $7$ includes it:

$$(-\\infty, 7] \\quad\\text{means}\\quad x \\le 7$$

> **Watch out.** The direction comes from where $\\infty$ is, not from the bracket: $(-\\infty, 7]$ is $x \\le 7$, not $x \\ge 7$. The bracket at the number decides only between $\\le$ and $<$.`,
        `一侧没有端点的区间用 $\\infty$ 或 $-\\infty$ 表示。无穷大不是一个可以包含的数，所以总是用圆括号。只有另一端，即真正的端点，才说明是否包含。

以 $\\infty$ 结尾的区间包含端点以上的数：它是 $x > a$ 或 $x \\ge a$。以 $-\\infty$ 开头的区间包含端点以下的数：$x < b$ 或 $x \\le b$。$(-\\infty, 7]$ 中的数一直到 $7$，$7$ 处的方括号表示包含它：

$$(-\\infty, 7] \\quad\\text{表示}\\quad x \\le 7$$

> **注意。** 方向由 $\\infty$ 所在的位置决定，而不是由括号决定：$(-\\infty, 7]$ 是 $x \\le 7$，不是 $x \\ge 7$。数字处的括号只决定是 $\\le$ 还是 $<$。`,
      ),
      generate(rng) {
        const v = rayEnd(rng);
        const op = rng.pick(allOps);
        const set = union(ray(op, v));
        const left = op === "<" || op === "<=";
        return intervalProblem({
          prompt: ask(`The interval is $${intervalLatex(set)}$.`, `区间是 $${intervalLatex(set)}$。`, asInequality("x")),
          set,
          form: "inequality",
          wrong: [union(ray(strictness[op], v)), union(ray(flip[op], v))],
          solution: t(
            `**Step 1: the direction.** The interval ${left ? "starts at $-\\infty$, so it holds the numbers below" : "ends at $\\infty$, so it holds the numbers above"} $${num(v)}$: it is $x ${left ? "<" : ">"} ${num(v)}$ or $x ${left ? "\\le" : "\\ge"} ${num(v)}$.

**Step 2: the endpoint.** $${num(v)}$ has ${op.length === 2 ? "a square bracket, so it is included" : "a parenthesis, so it is excluded"}: $${inequalityLatex("x", op, v)}$.

${rayCheck(op, v).en}`,
            `**第一步：方向。** 这个区间${left ? `从 $-\\infty$ 开始，所以包含 $${num(v)}$ 以下的数` : `以 $\\infty$ 结尾，所以包含 $${num(v)}$ 以上的数`}：它是 $x ${left ? "<" : ">"} ${num(v)}$ 或 $x ${left ? "\\le" : "\\ge"} ${num(v)}$。

**第二步：端点。** $${num(v)}$ 处是${op.length === 2 ? "方括号，包含" : "圆括号，不包含"}：$${inequalityLatex("x", op, v)}$。

${rayCheck(op, v)["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "graphs-of-unbounded-intervals",
      figure: algebraDrawings["unbounded-intervals#graphs-of-unbounded-intervals"],
      title: t("Reading graphs of rays", "读射线的图像"),
      explanation: t(
        `A ray on a number line starts at a dot or a circle and has an arrow at the other end: the set goes on without end. An arrow to the right reaches $\\infty$, an arrow to the left $-\\infty$. The starting mark is read as before: a closed dot is included, an open circle is not.

A ray from a closed dot at $2$ to the left holds $2$ and every smaller number, so it is $x \\le 2$, written $(-\\infty, 2]$: $-\\infty$ first because it is on the left, and a bracket at $2$ for the closed dot.

> **Watch out.** The arrow decides the direction: an arrow to the left means $-\\infty$ comes **first**, as in $(-\\infty, 2]$, never $[2, -\\infty)$. The dot decides only the bracket at the number.`,
        `数轴上的射线从一个点或圈出发，另一端带箭头：集合无限延伸。向右的箭头到 $\\infty$，向左的箭头到 $-\\infty$。起点的记号照旧读：实心点包含，空心圈不包含。

从 $2$ 处的实心点向左的射线包含 $2$ 和所有更小的数，所以是 $x \\le 2$，写作 $(-\\infty, 2]$：$-\\infty$ 在左边，所以写在前面；实心点让 $2$ 处用方括号。

> **注意。** 箭头决定方向：向左的箭头表示 $-\\infty$ 写在**前面**，如 $(-\\infty, 2]$，绝不写成 $[2, -\\infty)$。点只决定数字处的括号。`,
      ),
      generate(rng) {
        const v = rng.int(-8, 8);
        const op = rng.pick(allOps);
        const set = union(ray(op, v));
        const min = v - rng.int(2, 6);
        const max = min + rng.int(8, 12);
        const left = op.startsWith("<");
        const closed = op.length === 2;
        return {
          figure: numberLineFigure(set, min, max),
          ...intervalProblem({
            prompt: ask("Write the set graphed on the number line.", "写出数轴上所表示的集合。", asInterval),
            set,
            form: "interval",
            wrong: [union(ray(strictness[op], v)), union(ray(flip[op], v))],
            solution: t(
              `**Step 1: the arrow.** The shading starts at $${v}$ and goes on to the ${left ? "left, so the set starts at $-\\infty$" : "right, so the set goes on to $\\infty$"}.

**Step 2: the mark at $${v}$.** It is ${closed ? `a closed dot, so $${v}$ is included: a square bracket` : `an open circle, so $${v}$ is excluded: a parenthesis`}. The interval is $${intervalLatex(set)}$.

${rayCheck(op, Q.of(v)).en}`,
              `**第一步：箭头。** 涂色从 $${v}$ 开始向${left ? "左延伸，所以集合从 $-\\infty$ 开始" : "右延伸，所以集合延伸到 $\\infty$"}。

**第二步：$${v}$ 处的记号。** 是${closed ? `实心点，包含 $${v}$：用方括号` : `空心圈，不包含 $${v}$：用圆括号`}。区间是 $${intervalLatex(set)}$。

${rayCheck(op, Q.of(v))["zh-CN"]}`,
            ),
          }),
        };
      },
    },
    {
      id: "solving-into-unbounded-intervals",
      title: t("Solutions as unbounded intervals", "用无界区间写解集"),
      explanation: t(
        `The solution set of a linear inequality is a ray: everything on one side of a single number. Solve it as usual, then write that ray as an interval, so the direction and the endpoint come straight from the solved inequality.

Solve $5 - 2x > 11$. Subtract $5$ from both sides, then divide by $-2$; dividing by a negative number reverses the symbol:

$$5 - 2x > 11 \\;\\Rightarrow\\; -2x > 6 \\;\\Rightarrow\\; x < -3 \\;\\Rightarrow\\; (-\\infty, -3)$$

Check: $x = -4$ gives $5 + 8 = 13 > 11$, true; the endpoint $x = -3$ gives $11 > 11$, false, so the parenthesis at $-3$ is right.

> **Watch out.** Reverse the symbol when you divide by a negative number, or the ray points the wrong way: $(-3, \\infty)$ instead of $(-\\infty, -3)$. Keep $\\le$ and $\\ge$ as brackets and $<$ and $>$ as parentheses, and keep the sign of the endpoint.`,
        `一元一次不等式的解集是一条射线：某个数一侧的所有数。像平常一样求解，再把这条射线写成区间，方向和端点都直接来自解出的不等式。

解 $5 - 2x > 11$。两边同时减去 $5$，再同时除以 $-2$；除以负数要改变不等号方向：

$$5 - 2x > 11 \\;\\Rightarrow\\; -2x > 6 \\;\\Rightarrow\\; x < -3 \\;\\Rightarrow\\; (-\\infty, -3)$$

检验：$x = -4$ 时 $5 + 8 = 13 > 11$，成立；端点 $x = -3$ 时 $11 > 11$，不成立，所以 $-3$ 处用圆括号是对的。

> **注意。** 除以负数时要改变不等号方向，否则射线方向就反了：会得到 $(-3, \\infty)$ 而不是 $(-\\infty, -3)$。$\\le$ 和 $\\ge$ 用方括号，$<$ 和 $>$ 用圆括号，端点的符号也不能丢。`,
      ),
      keyPrerequisites: ["solving-multi-step-inequalities"],
      generate(rng) {
        const a = rng.sign() * rng.int(2, 9);
        const b = rng.nonZero(-20, 20);
        const v = rng.int(-10, 10);
        const c = a * v + b;
        const op = rng.pick(allOps);
        const answerOp = a < 0 ? flip[op] : op;
        const lhs = a < 0 && rng.bool() ? poly([b, ""], [a, "x"]) : linear(a, b);
        const set = union(ray(answerOp, v));
        const shifted = steps(`${lhs} ${relSymbol(op)} ${num(c)}`, `${poly([a, "x"])} ${relSymbol(op)} ${num(c - b)}`);
        const divided = steps(inequalityLatex("x", answerOp, v));
        const w = answerOp.startsWith("<") ? v - 1 : v + 1;
        const vw = a * w + b;
        const closed = op.length === 2;
        return intervalProblem({
          prompt: ask(`Solve $${lhs} ${relSymbol(op)} ${num(c)}$.`, `解不等式 $${lhs} ${relSymbol(op)} ${num(c)}$。`, asInterval),
          set,
          form: "interval",
          wrong: [union(ray(flip[answerOp], v)), union(ray(strictness[answerOp], v)), union(ray(answerOp, -v))],
          solution: t(
            `**Step 1: remove the constant.** ${b > 0 ? `Subtract $${b}$ from` : `Add $${-b}$ to`} both sides:${shifted}**Step 2: divide by $${a}$.** ${a < 0 ? "It is negative, so the symbol reverses" : "It is positive, so the symbol stays"}:${divided}**Step 3: interval notation.** The ray runs to the ${answerOp.startsWith("<") ? "left, from $-\\infty$" : "right, to $\\infty$"}, with ${closed ? "a square bracket" : "a parenthesis"} at $${v}$: $${intervalLatex(set)}$.

**Check.** $x = ${w}$ is on the ray: $${substitution(a, b, w)}$, and $${num(vw)} ${relSymbol(op)} ${num(c)}$ is true. At the endpoint $x = ${v}$ the left side is $${num(c)}$, and $${num(c)} ${relSymbol(op)} ${num(c)}$ is ${closed ? "true, so it is included" : "false, so it is excluded"}.`,
            `**第一步：去掉常数。** 两边同时${b > 0 ? `减去 $${b}$` : `加上 $${-b}$`}：${shifted}**第二步：除以 $${a}$。** ${a < 0 ? "它是负数，所以不等号改变方向" : "它是正数，所以不等号方向不变"}：${divided}**第三步：区间记号。** 射线向${answerOp.startsWith("<") ? "左，从 $-\\infty$ 开始" : "右，延伸到 $\\infty$"}，$${v}$ 处用${closed ? "方括号" : "圆括号"}：$${intervalLatex(set)}$。

**检验。** $x = ${w}$ 在射线上：$${substitution(a, b, w)}$，$${num(vw)} ${relSymbol(op)} ${num(c)}$ 成立。在端点 $x = ${v}$ 处左边等于 $${num(c)}$，$${num(c)} ${relSymbol(op)} ${num(c)}$ ${closed ? "成立，所以包含它" : "不成立，所以不包含它"}。`,
          ),
        });
      },
    },
  ],
};

/** fourPoints draws four increasing integers. */
function fourPoints(rng: Rng): [number, number, number, number] {
  const a = rng.int(-10, 3);
  const b = a + rng.int(1, 4);
  const c = b + rng.int(1, 4);
  return [a, b, c, c + rng.int(1, 4)];
}

/** overlapping draws two bounded intervals that overlap, or one inside the other, in random order. */
function overlapping(rng: Rng): [Interval, Interval] {
  const [a, b, c, d] = fourPoints(rng);
  const pair: [Interval, Interval] = rng.bool(0.3)
    ? [span(a, rng.bool(), d, rng.bool()), span(b, rng.bool(), c, rng.bool())]
    : [span(a, rng.bool(), c, rng.bool()), span(b, rng.bool(), d, rng.bool())];
  return rng.bool() ? pair : [pair[1], pair[0]];
}

/** memberOf tells whether a number belongs to a set. */
function memberOf(s: RealSet, v: Q): boolean {
  return s.some(
    (i) =>
      (i.lo === undefined || v.cmp(i.lo) > 0 || (i.loClosed && v.eq(i.lo))) &&
      (i.hi === undefined || v.cmp(i.hi) < 0 || (i.hiClosed && v.eq(i.hi))),
  );
}

/** finiteEnds lists the finite endpoints of some intervals, sorted and without repeats. */
function finiteEnds(parts: readonly Interval[]): Q[] {
  const all = parts.flatMap((i) => [i.lo, i.hi]).filter((v): v is Q => v !== undefined);
  return all.sort((a, b) => a.cmp(b)).filter((v, k, arr) => k === 0 || !v.eq(arr[k - 1]!));
}

/** partsFigure draws the parts A, B (and C) of a union or an intersection, with the result under them. */
function partsFigure(parts: readonly Interval[], set: RealSet, symbol: "\\cup" | "\\cap"): Figure {
  const ends = finiteEnds(parts).map((v) => v.toNumber());
  const min = Math.floor(Math.min(...ends, 0)) - 2;
  const max = Math.ceil(Math.max(...ends, 0)) + 2;
  const names = ["A", "B", "C"].slice(0, parts.length);
  const glyph = symbol === "\\cup" ? "∪" : "∩";
  return stackedNumberLines(
    [...parts.map((p, k) => ({ set: [p], label: names[k]! })), { set, label: names.join(parts.length > 2 ? glyph : ` ${glyph} `) }],
    min,
    max,
  );
}

/** partsNamed introduces the parts of a union or an intersection by the names the figure gives them. */
function partsNamed(parts: readonly Interval[]): Text {
  const names = ["A", "B", "C"];
  const list = parts.map((p, k) => `$${names[k]} = ${show(p)}$`);
  const en = list.length === 2 ? `${list[0]} and ${list[1]}` : `${list.slice(0, -1).join(", ")} and ${list.at(-1)}`;
  return t(en, list.join("、"));
}

/**
 * setCheck tests the answer to a union or an intersection of some intervals at two numbers: one the answer contains and one
 * it leaves out, chosen near the endpoints, each placed in or out of every part.
 */
function setCheck(kind: "union" | "intersection", parts: readonly Interval[], set: RealSet): Text {
  const ends = finiteEnds(parts);
  const mids = ends.slice(1).map((v, k) => v.add(ends[k]!).div(Q.of(2)));
  const whole = mids.filter((v) => v.d === 1n);
  const candidates = [...whole, ...ends.flatMap((e) => [e.sub(Q.one), e.add(Q.one)]), ...ends, ...mids, Q.zero];
  const inParts = (v: Q) => parts.map((p) => memberOf([p], v));
  const some = (v: Q) => inParts(v).some(Boolean);
  const every = (v: Q) => inParts(v).every(Boolean);
  const inside =
    kind === "union"
      ? (candidates.find((v) => memberOf(set, v) && !every(v)) ?? candidates.find((v) => memberOf(set, v)))
      : candidates.find((v) => memberOf(set, v));
  const outside =
    kind === "union"
      ? candidates.find((v) => !some(v))
      : (candidates.find((v) => !memberOf(set, v) && some(v)) ?? candidates.find((v) => !memberOf(set, v)));
  const answer = intervalLatex(set);
  const names = ["A", "B", "C"].slice(0, parts.length).map((n) => `$${n}$`);
  const describe = (v: Q): Text => {
    const flags = inParts(v);
    const ins = names.filter((_, k) => flags[k]);
    const outs = names.filter((_, k) => !flags[k]);
    const where =
      outs.length === 0
        ? t(`lies in ${ins.join(" and ")}`, `同时属于 ${ins.join("、")}`)
        : ins.length === 0
          ? t("lies in none of the parts", "不属于任何一部分")
          : t(`lies in ${ins.join(" and ")} but not in ${outs.join(" or ")}`, `属于 ${ins.join("、")}，不属于 ${outs.join("、")}`);
    const inS = memberOf(set, v);
    const why =
      kind === "union"
        ? inS
          ? t("so it is in the union", "所以属于并集")
          : t("so it is not in the union", "所以不属于并集")
        : inS
          ? t("so it is in the intersection", "所以属于交集")
          : t("so it is not in the intersection", "所以不属于交集");
    return t(
      `$x = ${num(v)}$ ${where.en}, ${why.en}, and $${answer}$ ${inS ? "contains it" : "leaves it out"}.`,
      `$x = ${num(v)}$ ${where["zh-CN"]}，${why["zh-CN"]}，而 $${answer}$ ${inS ? "包含它" : "不包含它"}。`,
    );
  };
  const points = [inside, outside].filter((v): v is Q => v !== undefined).map(describe);
  return t(`**Check.** ${points.map((p) => p.en).join(" ")}`, `**检验。** ${points.map((p) => p["zh-CN"]).join("")}`);
}

/** setSolution works a union or an intersection of intervals: the parts drawn, the reasoning, the answer and a check. */
function setSolution(kind: "union" | "intersection", parts: readonly Interval[], set: RealSet, reason: Text): Text {
  const named = partsNamed(parts);
  const check = setCheck(kind, parts, set);
  const word = kind === "union" ? t("union", "并集") : t("intersection", "交集");
  const keep =
    kind === "union"
      ? t("keeps every number shaded on **at least one** line", "保留至少在**一条**数轴上涂色的每个数")
      : t("keeps only the numbers shaded on **every** line", "只保留在**每一条**数轴上都涂色的数");
  return t(
    `**Step 1: draw the parts.** Draw ${named.en} one under another; the ${word.en} ${keep.en}:

{{figure 0}}

**Step 2: read the ${word.en}.** ${reason.en} The answer is $${intervalLatex(set)}$.

${check.en}`,
    `**第一步：画出各部分。** 把 ${named["zh-CN"]} 上下排列画出；${word["zh-CN"]}${keep["zh-CN"]}：

{{figure 0}}

**第二步：读出${word["zh-CN"]}。** ${reason["zh-CN"]}答案是 $${intervalLatex(set)}$。

${check["zh-CN"]}`,
  );
}

/** endWords says where a union or an intersection of overlapping intervals starts and ends, and which bracket each end keeps. */
function endWords(set: RealSet, parts: readonly Interval[]): Text {
  const i = set[0];
  if (!i) return t("", "");
  const from = (v: Q | undefined, lo: boolean): Text => {
    if (!v)
      return lo
        ? t("It has no left end ($-\\infty$)", "它没有左端（$-\\infty$）")
        : t("has no right end ($\\infty$)", "没有右端（$\\infty$）");
    const owner = parts.find((p) => (lo ? p.lo?.eq(v) && p.loClosed === i.loClosed : p.hi?.eq(v) && p.hiClosed === i.hiClosed));
    const closed = lo ? i.loClosed : i.hiClosed;
    const src = owner ? t(` from $${show(owner)}$`, `（来自 $${show(owner)}$）`) : t("", "");
    return lo
      ? t(
          `It starts at $${num(v)}$${src.en}, ${closed ? "included" : "excluded"}`,
          `它从 $${num(v)}$${src["zh-CN"]}开始，${closed ? "包含" : "不包含"}该端点`,
        )
      : t(
          `ends at $${num(v)}$${src.en}, ${closed ? "included" : "excluded"}`,
          `到 $${num(v)}$${src["zh-CN"]}结束，${closed ? "包含" : "不包含"}该端点`,
        );
  };
  const a = from(i.lo, true);
  const b = from(i.hi, false);
  return t(`${a.en}, and ${b.en}.`, `${a["zh-CN"]}，${b["zh-CN"]}。`);
}

const unionIntro = t(
  `An inequality such as $x < -1$ or a double inequality such as $-3 \\le x < 2$ describes one piece of the number line, and interval notation writes that piece. Some sets are made of **several** pieces, or are built by putting two sets together: the hours a shop is open in the morning together with the hours it is open in the evening, or every $x$ with $x < -1$ together with every $x$ with $x \\ge 3$.

The **union** $A \\cup B$ is the set of numbers in $A$, in $B$, or in both. Read off a number line, it is everything shaded on **at least one** of the lines. Take $A = [-3, 2)$ and $B = (0, 5]$:

{{figure 0}}

Every number from $-3$ to $5$ is shaded at least once: the left part by $A$, the right part by $B$, the middle by both. So $[-3, 2) \\cup (0, 5] = [-3, 5]$, one interval; $-3$ keeps the bracket it has in $A$ and $5$ the bracket it has in $B$. Pieces that do not overlap stay apart: $(-\\infty, -1) \\cup [3, \\infty)$ cannot be written more simply. In this topic we simplify unions of bounded intervals, of rays, and of pieces that touch or stay separate.`,
  `$x < -1$ 这样的不等式，或 $-3 \\le x < 2$ 这样的连不等式，描述的是数轴上的一段，区间记号写出这一段。有些集合由**几段**组成，或者是把两个集合合在一起得到的：商店上午营业的时间加上晚上营业的时间，或者满足 $x < -1$ 的所有 $x$ 加上满足 $x \\ge 3$ 的所有 $x$。

**并集** $A \\cup B$ 是属于 $A$、属于 $B$ 或两者都属于的数组成的集合。在数轴上看，就是**至少在一条**数轴上涂色的全部数。取 $A = [-3, 2)$、$B = (0, 5]$：

{{figure 0}}

从 $-3$ 到 $5$ 的每个数都至少涂色一次：左边一段来自 $A$，右边一段来自 $B$，中间两者都有。所以 $[-3, 2) \\cup (0, 5] = [-3, 5]$，是一个区间；$-3$ 保留它在 $A$ 中的方括号，$5$ 保留它在 $B$ 中的方括号。不重叠的部分保持分开：$(-\\infty, -1) \\cup [3, \\infty)$ 无法写得更简单。这个课题中，我们化简有界区间的并集、射线的并集，以及相接或分离的几段的并集。`,
);

export const unionsOfIntervals: TopicDef = {
  id: "unions-of-intervals",
  title: t("Unions of Intervals", "区间的并集"),
  summary: t("Combine intervals with $\\cup$ and simplify the result.", "用 $\\cup$ 合并区间并化简结果。"),
  prerequisites: ["unbounded-intervals"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSA.REI.B.3"],
  intro: unionIntro,
  introFigures: [partsFigure([span(-3, true, 2, false), span(0, false, 5, true)], union(span(-3, true, 5, true)), "\\cup")],
  knowledgePoints: [
    {
      id: "unions-of-overlapping-intervals",
      title: t("Overlapping intervals", "重叠的区间"),
      explanation: t(
        `The **union** $A \\cup B$ is the set of numbers in $A$, in $B$, or in both. When two intervals overlap, there is no gap between them, so their union is one interval that runs from the leftmost endpoint to the rightmost. Each end keeps the bracket of the interval it came from, because whether that number is in the union depends on that interval alone.

For $[-3, 2) \\cup (0, 5]$: the leftmost endpoint is $-3$, from $[-3, 2)$, included; the rightmost is $5$, from $(0, 5]$, included. The ends $2$ and $0$ lie inside the union and disappear:

$$[-3, 2) \\cup (0, 5] = [-3, 5]$$

If one interval lies inside the other, the union is the larger one: $(-4, 6) \\cup [1, 3] = (-4, 6)$.

> **Watch out.** A union keeps numbers in **either** set; keeping only the overlap, $(0, 2)$ here, is the intersection. Take each bracket from the interval its end came from, and do not swap them.`,
        `**并集** $A \\cup B$ 是属于 $A$ 或属于 $B$（或两者都属于）的数组成的集合。两个区间重叠时，中间没有空隙，所以并集是从最左端点到最右端点的一个区间。每一端保留它所来自的区间的括号，因为这个数是否属于并集只取决于那个区间。

对 $[-3, 2) \\cup (0, 5]$：最左端点是 $-3$，来自 $[-3, 2)$，包含；最右端点是 $5$，来自 $(0, 5]$，包含。端点 $2$ 和 $0$ 在并集内部，不再出现：

$$[-3, 2) \\cup (0, 5] = [-3, 5]$$

如果一个区间在另一个之内，并集就是较大的那个：$(-4, 6) \\cup [1, 3] = (-4, 6)$。

> **注意。** 并集保留属于**任一**集合的数；只保留重叠部分（这里是 $(0, 2)$）得到的是交集。每一端的括号取自这一端所来自的区间，不要弄反。`,
      ),
      generate(rng) {
        const [A, B] = overlapping(rng);
        const set = union(A, B);
        const nested = setEqual(set, [A]) || setEqual(set, [B]);
        const reason = nested
          ? t(
              `One interval lies inside the other, so the union is the larger one. ${endWords(set, [A, B]).en}`,
              `一个区间在另一个之内，所以并集就是较大的那个。${endWords(set, [A, B])["zh-CN"]}`,
            )
          : t(
              `The intervals overlap, so there is no gap: the union runs from the leftmost endpoint to the rightmost. ${endWords(set, [A, B]).en}`,
              `两个区间重叠，中间没有空隙：并集从最左端点到最右端点。${endWords(set, [A, B])["zh-CN"]}`,
            );
        return {
          ...intervalProblem({
            prompt: ask(`Simplify $${show(A)} \\cup ${show(B)}$.`, `化简 $${show(A)} \\cup ${show(B)}$。`, asInterval),
            set,
            form: "interval",
            wrong: [intersect([A], [B]), toggleEnds(set)],
            solution: setSolution("union", [A, B], set, reason),
          }),
          solutionFigures: [partsFigure([A, B], set, "\\cup")],
        };
      },
    },
    {
      id: "unions-with-rays",
      title: t("Unions with unbounded intervals", "含无界区间的并集"),
      explanation: t(
        `The same idea works with rays, because a ray is just an interval with no end on one side. A ray absorbs any interval that overlaps it; two rays in the same direction give the longer ray; and two rays in opposite directions that overlap leave no number out, so they cover the whole line.

For $(-\\infty, 1] \\cup (-2, 4)$ the ray covers everything up to $1$ and the interval carries on to $4$, excluded, so the union is $(-\\infty, 4)$. For $(-\\infty, 3) \\cup [0, \\infty)$ every number is less than $3$ or at least $0$:

$$(-\\infty, 1] \\cup (-2, 4) = (-\\infty, 4) \\qquad (-\\infty, 3) \\cup [0, \\infty) = (-\\infty, \\infty)$$

> **Watch out.** The union is at least as big as each part: it is unbounded on every side where one part is. Keeping only the overlap, such as $[0, 3)$, gives the intersection instead.`,
        `射线也一样，因为射线只是一侧没有端点的区间。射线会吞并与它重叠的区间；同方向的两条射线合并为较长的那条；方向相反且重叠的两条射线不漏掉任何数，所以覆盖整条数轴。

对 $(-\\infty, 1] \\cup (-2, 4)$：射线覆盖 $1$ 以下的全部数，区间再延伸到 $4$（不含），所以并集是 $(-\\infty, 4)$。对 $(-\\infty, 3) \\cup [0, \\infty)$：每个数要么小于 $3$，要么不小于 $0$：

$$(-\\infty, 1] \\cup (-2, 4) = (-\\infty, 4) \\qquad (-\\infty, 3) \\cup [0, \\infty) = (-\\infty, \\infty)$$

> **注意。** 并集至少和每一部分一样大：只要有一部分在某一侧无界，并集在这一侧也无界。只保留重叠部分，如 $[0, 3)$，得到的是交集。`,
      ),
      generate(rng) {
        for (;;) {
          const A = randomInterval(rng, rng.pick(["left", "right"] as const));
          const B = randomInterval(rng, rng.pick(["left", "right", "bounded"] as const));
          const set = union(A, B);
          const both = intersect([A], [B]);
          if (set.length !== 1 || hasPoint(both) || setEqual([A], [B])) continue;
          const [first, second] = rng.bool() ? [A, B] : [B, A];
          const whole = set[0]!.lo === undefined && set[0]!.hi === undefined;
          const reason = whole
            ? t(
                "The two rays point in opposite directions and overlap, so every number is in at least one of them: the union is the whole line.",
                "两条射线方向相反且重叠，所以每个数至少属于其中一条：并集是整条数轴。",
              )
            : t(
                `The two sets overlap, so the union is a single piece. ${endWords(set, [first, second]).en}`,
                `两个集合重叠，所以并集是一个整体。${endWords(set, [first, second])["zh-CN"]}`,
              );
          return {
            ...intervalProblem({
              prompt: ask(`Simplify $${show(first)} \\cup ${show(second)}$.`, `化简 $${show(first)} \\cup ${show(second)}$。`, asInterval),
              set,
              form: "interval",
              wrong: [both, toggleEnds(set)],
              solution: setSolution("union", [first, second], set, reason),
            }),
            solutionFigures: [partsFigure([first, second], set, "\\cup")],
          };
        }
      },
    },
    {
      id: "unions-that-stay-separate",
      title: t("Touching and separate intervals", "相接与分离的区间"),
      explanation: t(
        `Intervals that do not overlap stay separate in the union: the numbers in the gap belong to neither, so no single interval can describe the union. Two intervals that meet at an endpoint are a special case. They join only if that endpoint is included in at least one of them, because only then does the union have no hole.

In $[1, 3) \\cup [3, 5]$ the number $3$ is in the second interval, so there is no hole and the union is $[1, 5]$. In $(1, 3) \\cup (3, 5)$ the number $3$ is in neither, so the union has a hole at $3$ and stays as two pieces:

$$[1, 3) \\cup [3, 5] = [1, 5] \\qquad (1, 3) \\cup (3, 5) \\text{ stays as it is, since } 3 \\text{ is in neither}$$

> **Watch out.** Check the shared endpoint before joining: $(1, 3) \\cup (3, 5)$ is **not** $(1, 5)$, because $3$ is missing. And when one of the two includes it, do join them: $[1, 3) \\cup [3, 5]$ should be written $[1, 5]$. A piece across a real gap always stays separate.`,
        `不重叠的区间在并集中保持分开：空隙中的数不属于任何一个，所以无法用一个区间表示并集。在一个端点相接的两个区间是特殊情形：只有当至少一个区间包含这个端点时它们才合并，因为只有这样并集才没有缺口。

在 $[1, 3) \\cup [3, 5]$ 中，$3$ 属于第二个区间，没有缺口，并集是 $[1, 5]$。在 $(1, 3) \\cup (3, 5)$ 中，$3$ 不属于任何一个，并集在 $3$ 处有缺口，仍是两段：

$$[1, 3) \\cup [3, 5] = [1, 5] \\qquad (1, 3) \\cup (3, 5) \\text{ 保持不变，因为 } 3 \\text{ 不在任何一个里}$$

> **注意。** 合并之前先看公共端点：$(1, 3) \\cup (3, 5)$ **不是** $(1, 5)$，因为缺了 $3$。而只要有一个包含它，就要合并：$[1, 3) \\cup [3, 5]$ 应写成 $[1, 5]$。隔着真正空隙的部分总是保持分开。`,
      ),
      generate(rng) {
        const p0 = rng.int(-12, -3);
        const p1 = p0 + rng.int(1, 5);
        const p2 = p1 + rng.int(1, 5);
        const p3 = p2 + rng.int(2, 4);
        const p4 = p3 + rng.int(1, 5);
        const touchA = rng.bool(0.6);
        const touchB = rng.bool(0.4);
        let A = span(p0, rng.bool(), p1, touchA);
        let B = span(p1, touchB, p2, rng.bool());
        let C = rng.bool() ? span(p3, rng.bool(), p4, rng.bool()) : ray(rng.pick(greaterOps), p3);
        let A2 = span(p0, A.loClosed, p1, !(touchA || touchB));
        let B2 = span(p1, false, p2, B.hiClosed);
        const mirrored = rng.bool();
        if (mirrored) [A, B, C, A2, B2] = [A, B, C, A2, B2].map(mirror) as [Interval, Interval, Interval, Interval, Interval];
        const meet = mirrored ? -p1 : p1;
        const set = union(A, B, C);
        const pieces = rng.shuffle([A, B, C]);
        const latex = pieces.map(show).join(" \\cup ");
        const joined = touchA || touchB;
        const reason = t(
          `$${show(A)}$ and $${show(B)}$ meet at $${meet}$, which ${joined ? "is included in at least one of them, so there is no hole and they join" : "is in neither, so the union has a hole there and they stay separate"}. $${show(C)}$ is across a gap from both, so it stays a piece of its own.`,
          `$${show(A)}$ 与 $${show(B)}$ 在 $${meet}$ 相接，${joined ? "至少有一个包含它，没有缺口，所以两者合并" : "两者都不包含它，并集在这里有缺口，所以保持分开"}。$${show(C)}$ 与它们之间隔着空隙，单独成为一段。`,
        );
        return {
          ...intervalProblem({
            prompt: ask(`Simplify $${latex}$.`, `化简 $${latex}$。`, asInterval),
            set,
            form: "interval",
            wrong: [union(A2, B2, C), toggleEnds(set)],
            solution: setSolution("union", pieces, set, reason),
          }),
          solutionFigures: [partsFigure(pieces, set, "\\cup")],
        };
      },
    },
  ],
};

export const intersectionsOfIntervals: TopicDef = {
  id: "intersections-of-intervals",
  title: t("Intersections of Intervals", "区间的交集"),
  summary: t("Find the numbers two intervals have in common, written with $\\cap$.", "求两个区间的公共部分，记作 $\\cap$。"),
  prerequisites: ["unions-of-intervals"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSA.REI.B.3"],
  intro: t(
    `The union $A \\cup B$ keeps the numbers in **at least one** of two sets. Often we need the opposite: the numbers that satisfy two conditions at once. A double inequality is exactly that. $-1 < x \\le 4$ asks for $x \\le 4$ **and** $x > -1$, the numbers in both $(-\\infty, 4]$ and $(-1, \\infty)$.

The **intersection** $A \\cap B$ is the set of numbers in **both** $A$ and $B$. On number lines drawn one under the other, it is what is shaded on **every** line:

{{figure 0}}

The first ray stops at $4$ and the second starts after $-1$, so the numbers they share run from $-1$, excluded, to $4$, included: $(-\\infty, 4] \\cap (-1, \\infty) = (-1, 4]$. In general an intersection starts at the **larger** left end and stops at the **smaller** right end, and when the sets share nothing it is the **empty set** $\\varnothing$. In this topic we find intersections of intervals and rays, and choose between union and intersection.`,
    `并集 $A \\cup B$ 保留**至少属于**两个集合之一的数。我们常常需要相反的东西：同时满足两个条件的数。连不等式正是如此。$-1 < x \\le 4$ 要求 $x \\le 4$ **并且** $x > -1$，即同时属于 $(-\\infty, 4]$ 和 $(-1, \\infty)$ 的数。

**交集** $A \\cap B$ 是**同时**属于 $A$ 和 $B$ 的数组成的集合。把数轴上下排列，交集就是在**每一条**数轴上都涂色的部分：

{{figure 0}}

第一条射线到 $4$ 为止，第二条从 $-1$ 之后开始，所以它们的公共部分从 $-1$（不含）到 $4$（含）：$(-\\infty, 4] \\cap (-1, \\infty) = (-1, 4]$。一般地，交集从**较大的**左端点开始，到**较小的**右端点结束；两个集合没有公共部分时，交集是**空集** $\\varnothing$。这个课题中，我们求区间与射线的交集，并区分并集与交集。`,
  ),
  introFigures: [partsFigure([ray("<=", 4), ray(">", -1)], union(span(-1, false, 4, true)), "\\cap")],
  knowledgePoints: [
    {
      id: "intersections-of-bounded-intervals",
      title: t("Overlapping intervals", "重叠的区间"),
      explanation: t(
        `The **intersection** $A \\cap B$ is the set of numbers in **both** $A$ and $B$. A number in both must be past both left ends, so the intersection starts at the **larger** left endpoint, and before both right ends, so it stops at the **smaller** right endpoint. Each end keeps the bracket of the interval it came from, since that interval is the one that decides whether the end is in.

For $[-3, 2) \\cap (0, 5]$: the larger left end is $0$, from $(0, 5]$, excluded; the smaller right end is $2$, from $[-3, 2)$, excluded:

$$[-3, 2) \\cap (0, 5] = (0, 2)$$

If one interval lies inside the other, the intersection is the smaller one.

> **Watch out.** The intersection is the overlap, not everything covered: $[-3, 5]$ here would be the union. Take each end from the interval that stops first, with that interval's bracket, and do not swap brackets.`,
        `**交集** $A \\cap B$ 是**同时**属于 $A$ 和 $B$ 的数组成的集合。同时属于两者的数必须越过两个左端点，所以交集从**较大的**左端点开始；还必须在两个右端点之前，所以到**较小的**右端点结束。每一端保留它所来自的区间的括号，因为正是那个区间决定这个端点是否属于交集。

对 $[-3, 2) \\cap (0, 5]$：较大的左端点是 $0$，来自 $(0, 5]$，不包含；较小的右端点是 $2$，来自 $[-3, 2)$，不包含：

$$[-3, 2) \\cap (0, 5] = (0, 2)$$

如果一个区间在另一个之内，交集就是较小的那个。

> **注意。** 交集是重叠的部分，而不是覆盖到的全部：这里的 $[-3, 5]$ 是并集。每一端取自先结束的那个区间，并沿用它的括号，不要把括号弄反。`,
      ),
      generate(rng) {
        const [A, B] = overlapping(rng);
        const set = intersect([A], [B]);
        const nested = setEqual(set, [A]) || setEqual(set, [B]);
        const reason = nested
          ? t(
              `One interval lies inside the other, so the numbers in both are just the smaller one. ${endWords(set, [A, B]).en}`,
              `一个区间在另一个之内，所以同时属于两者的数就是较小的那个。${endWords(set, [A, B])["zh-CN"]}`,
            )
          : t(
              `The intersection runs from the larger left endpoint to the smaller right endpoint. ${endWords(set, [A, B]).en}`,
              `交集从较大的左端点到较小的右端点。${endWords(set, [A, B])["zh-CN"]}`,
            );
        return {
          ...intervalProblem({
            prompt: ask(`Simplify $${show(A)} \\cap ${show(B)}$.`, `化简 $${show(A)} \\cap ${show(B)}$。`, asInterval),
            set,
            form: "interval",
            wrong: [union(A, B), toggleEnds(set)],
            solution: setSolution("intersection", [A, B], set, reason),
          }),
          solutionFigures: [partsFigure([A, B], set, "\\cap")],
        };
      },
    },
    {
      id: "intersections-with-rays",
      title: t("Intersections with unbounded intervals", "含无界区间的交集"),
      explanation: t(
        `Rays follow the same rule: start at the larger left end, stop at the smaller right end. So two rays in opposite directions that overlap meet in a bounded interval; two rays in the same direction give the shorter ray; and a ray cuts off part of an interval. If the larger left end lies beyond the smaller right end, no number is in both, and the intersection is the **empty set** $\\varnothing$.

$(-\\infty, 4]$ and $(-1, \\infty)$ share the numbers after $-1$ and up to $4$. $(-\\infty, 2)$ and $[5, \\infty)$ share nothing, since no number is both less than $2$ and at least $5$:

$$(-\\infty, 4] \\cap (-1, \\infty) = (-1, 4] \\qquad (-\\infty, 2) \\cap [5, \\infty) = \\varnothing$$

> **Watch out.** An intersection is never bigger than either part, so it cannot reach $\\infty$ unless both parts do. When the sets do not overlap, the answer is $\\varnothing$, not the gap between them and not their union.`,
        `射线遵循同样的规则：从较大的左端点开始，到较小的右端点结束。所以方向相反且重叠的两条射线交于一个有界区间；同方向的两条射线的交集是较短的那条；射线会截去区间的一部分。如果较大的左端点在较小的右端点之后，就没有数同时属于两者，交集是**空集** $\\varnothing$。

$(-\\infty, 4]$ 与 $(-1, \\infty)$ 的公共部分是 $-1$ 之后、到 $4$ 为止的数。$(-\\infty, 2)$ 与 $[5, \\infty)$ 没有公共部分，因为没有数既小于 $2$ 又不小于 $5$：

$$(-\\infty, 4] \\cap (-1, \\infty) = (-1, 4] \\qquad (-\\infty, 2) \\cap [5, \\infty) = \\varnothing$$

> **注意。** 交集不会比任何一部分大，所以只有两部分都延伸到 $\\infty$ 时，交集才延伸到 $\\infty$。两个集合不重叠时，答案是 $\\varnothing$，不是它们之间的空隙，也不是它们的并集。`,
      ),
      generate(rng) {
        for (;;) {
          const A = randomInterval(rng, rng.pick(["left", "right"] as const));
          const B = randomInterval(rng, rng.pick(["left", "right", "bounded"] as const));
          const set = intersect([A], [B]);
          if (hasPoint(set) || setEqual([A], [B]) || (set.length === 0 && !rng.bool(0.3))) continue;
          const [first, second] = rng.bool() ? [A, B] : [B, A];
          const reason =
            set.length === 0
              ? t(
                  "The larger left end lies beyond the smaller right end, so no number is shaded on both lines: the intersection is empty.",
                  "较大的左端点在较小的右端点之后，没有数在两条数轴上都涂色：交集是空集。",
                )
              : t(
                  `Keep only the part shaded on both lines, from the larger left end to the smaller right end. ${endWords(set, [first, second]).en}`,
                  `只保留两条数轴上都涂色的部分：从较大的左端点到较小的右端点。${endWords(set, [first, second])["zh-CN"]}`,
                );
          return {
            ...intervalProblem({
              prompt: ask(`Simplify $${show(first)} \\cap ${show(second)}$.`, `化简 $${show(first)} \\cap ${show(second)}$。`, asInterval),
              set,
              form: "interval",
              wrong: [union(A, B), toggleEnds(set)],
              solution: setSolution("intersection", [first, second], set, reason),
            }),
            solutionFigures: [partsFigure([first, second], set, "\\cap")],
          };
        }
      },
    },
    {
      id: "union-or-intersection",
      title: t("Union or intersection", "并集还是交集"),
      explanation: t(
        `Read the symbol carefully: $\\cup$ (union) keeps numbers in **either** set, $\\cap$ (intersection) keeps numbers in **both**. The union is always at least as big as each set and the intersection at most as big, so for the same two sets the answers can be very different. One way to remember: $\\cup$ opens upward like a cup that collects everything.

For $(-\\infty, 2]$ and $(0, \\infty)$, every number is in at least one of them, but only the numbers after $0$ and up to $2$ are in both:

$$(-\\infty, 2] \\cup (0, \\infty) = (-\\infty, \\infty) \\qquad (-\\infty, 2] \\cap (0, \\infty) = (0, 2]$$

> **Watch out.** Do not mix the two up: $\\cup$ gives the bigger set and $\\cap$ the smaller. Then take each bracket from the set its end comes from.`,
        `注意符号：$\\cup$（并集）保留属于**任一**集合的数，$\\cap$（交集）保留**同时**属于两个集合的数。并集至少和每个集合一样大，交集至多一样大，所以同样的两个集合，结果可能大不相同。一个记法：$\\cup$ 像一只开口向上的杯子，把所有数都装进来。

对 $(-\\infty, 2]$ 和 $(0, \\infty)$，每个数都至少属于其中一个，但只有 $0$ 之后、到 $2$ 为止的数同时属于两者：

$$(-\\infty, 2] \\cup (0, \\infty) = (-\\infty, \\infty) \\qquad (-\\infty, 2] \\cap (0, \\infty) = (0, 2]$$

> **注意。** 不要把两者混淆：$\\cup$ 得到较大的集合，$\\cap$ 得到较小的集合。然后每一端的括号取自这一端所来自的集合。`,
      ),
      generate(rng) {
        const kinds = ["left", "right", "bounded"] as const;
        for (;;) {
          const A = randomInterval(rng, rng.pick(kinds));
          const B = randomInterval(rng, rng.pick(kinds));
          const both = intersect([A], [B]);
          const either = union(A, B);
          if (hasPoint(both) || both.length === 0 || setEqual(both, either)) continue;
          const isUnion = rng.bool();
          const set = isUnion ? either : both;
          const symbol = isUnion ? "\\cup" : "\\cap";
          const kind = isUnion ? "union" : "intersection";
          const reason = isUnion
            ? set.length === 1
              ? t(
                  `The symbol is $\\cup$, so keep every number in either set. They overlap, so the union is one piece. ${endWords(set, [A, B]).en}`,
                  `符号是 $\\cup$，保留属于任一集合的每个数。两者重叠，所以并集是一个整体。${endWords(set, [A, B])["zh-CN"]}`,
                )
              : t(
                  "The symbol is $\\cup$, so keep every number in either set. They do not overlap, so the union stays as two pieces.",
                  "符号是 $\\cup$，保留属于任一集合的每个数。两者不重叠，所以并集仍是两段。",
                )
            : t(
                `The symbol is $\\cap$, so keep only the numbers in both sets, from the larger left end to the smaller right end. ${endWords(set, [A, B]).en}`,
                `符号是 $\\cap$，只保留同时属于两个集合的数：从较大的左端点到较小的右端点。${endWords(set, [A, B])["zh-CN"]}`,
              );
          return {
            ...intervalProblem({
              prompt: ask(`Simplify $${show(A)} ${symbol} ${show(B)}$.`, `化简 $${show(A)} ${symbol} ${show(B)}$。`, asInterval),
              set,
              form: "interval",
              wrong: [isUnion ? both : either, toggleEnds(set)],
              solution: setSolution(kind, [A, B], set, reason),
            }),
            solutionFigures: [partsFigure([A, B], set, symbol)],
          };
        }
      },
    },
  ],
};

/** Part is one linear inequality ax + b op c of a compound inequality, with its solution x opSol v. */
interface Part {
  readonly a: number;
  readonly b: number;
  readonly op: InequalityOp;
  readonly c: number;
  readonly latex: string;
  readonly solved: Interval;
  /** naive is the solution found by forgetting to reverse the symbol. */
  readonly naive: Interval;
  readonly work: string;
  /** note says what dividing does to this part's symbol. */
  readonly note: Text;
}

/** part draws ax + b op c whose solution set is x opSol v. */
function part(rng: Rng, opSol: InequalityOp, v: number, negative: boolean): Part {
  const a = negative ? -rng.int(1, 7) : rng.int(1, 7);
  const b = rng.nonZero(-12, 12);
  const op = a < 0 ? flip[opSol] : opSol;
  const c = a * v + b;
  const lhs = a < 0 && rng.bool() ? poly([b, ""], [a, "x"]) : linear(a, b);
  const latex = `${lhs} ${relSymbol(op)} ${num(c)}`;
  const middle = a === 1 ? "" : `${poly([a, "x"])} ${relSymbol(op)} ${num(c - b)} \\;\\Rightarrow\\; `;
  const shift = b > 0 ? t(`subtract $${b}$`, `减去 $${b}$`) : t(`add $${-b}$`, `加上 $${-b}$`);
  const note =
    a === 1
      ? t(`In $${latex}$, ${shift.en} on both sides.`, `在 $${latex}$ 中，两边同时${shift["zh-CN"]}。`)
      : a < 0
        ? t(
            `In $${latex}$, ${shift.en}, then divide by $${a}$: it is negative, so the symbol reverses.`,
            `在 $${latex}$ 中，${shift["zh-CN"]}，再除以 $${a}$：它是负数，所以不等号改变方向。`,
          )
        : t(
            `In $${latex}$, ${shift.en}, then divide by $${a}$: it is positive, so the symbol stays.`,
            `在 $${latex}$ 中，${shift["zh-CN"]}，再除以 $${a}$：它是正数，所以不等号方向不变。`,
          );
  return {
    a,
    b,
    op,
    c,
    latex,
    solved: ray(opSol, v),
    naive: ray(op, v),
    work: `${latex} \\;\\Rightarrow\\; ${middle}${inequalityLatex("x", opSol, v)}`,
    note,
  };
}

/** partsCheck tests the answer of an "or" or an "and" inequality in the original parts, at a number inside it and one outside. */
function partsCheck(kind: "union" | "intersection", parts: readonly Part[], set: RealSet): Text {
  const solved = parts.map((p) => p.solved);
  const ends = finiteEnds(solved);
  const mids = ends.slice(1).map((v, k) => v.add(ends[k]!).div(Q.of(2)));
  const candidates = [...mids.filter((v) => v.d === 1n), ...ends.flatMap((e) => [e.sub(Q.one), e.add(Q.one)]), ...ends, ...mids, Q.zero];
  const flags = (v: Q) => solved.map((s) => memberOf([s], v));
  const inside =
    kind === "union"
      ? (candidates.find((v) => memberOf(set, v) && !flags(v).every(Boolean)) ?? candidates.find((v) => memberOf(set, v)))
      : candidates.find((v) => memberOf(set, v));
  const outside =
    kind === "union"
      ? candidates.find((v) => !flags(v).some(Boolean))
      : (candidates.find((v) => !memberOf(set, v) && flags(v).some(Boolean)) ?? candidates.find((v) => !memberOf(set, v)));
  const answer = intervalLatex(set);
  const describe = (v: Q): Text => {
    const evals = parts.map((p) => {
      const val = Q.of(p.a).mul(v).add(Q.of(p.b));
      const ok = val.cmp(Q.of(p.c)) < 0 ? p.op.startsWith("<") : val.eq(Q.of(p.c)) ? p.op.length === 2 : p.op.startsWith(">");
      return { val, ok, p };
    });
    const said = evals.map((e) =>
      t(
        `$${num(e.val)} ${relSymbol(e.p.op)} ${num(e.p.c)}$ is ${e.ok ? "true" : "false"}`,
        `$${num(e.val)} ${relSymbol(e.p.op)} ${num(e.p.c)}$ ${e.ok ? "成立" : "不成立"}`,
      ),
    );
    const inS = memberOf(set, v);
    return t(
      `For $x = ${num(v)}$, ${said[0]!.en} and ${said[1]!.en}, so the compound inequality is ${inS ? "true" : "false"}, and $${answer}$ ${inS ? "contains" : "leaves out"} $${num(v)}$.`,
      `取 $x = ${num(v)}$：${said[0]!["zh-CN"]}，${said[1]!["zh-CN"]}，所以复合不等式${inS ? "成立" : "不成立"}，而 $${answer}$ ${inS ? "包含" : "不包含"} $${num(v)}$。`,
    );
  };
  const points = [inside, outside].filter((v): v is Q => v !== undefined).map(describe);
  return t(`**Check.** ${points.map((p) => p.en).join(" ")}`, `**检验。** ${points.map((p) => p["zh-CN"]).join("")}`);
}

/** compoundSolution works an "or" or an "and" inequality: each part solved, the parts combined on number lines, and a check. */
function compoundSolution(kind: "union" | "intersection", p: Part, q: Part, set: RealSet): Text {
  const parts = [p.solved, q.solved];
  const combine =
    kind === "union"
      ? t(
          `**Step 2: combine with "or".** A number is a solution if it satisfies **at least one** part, so take the union of $A = ${show(p.solved)}$ and $B = ${show(q.solved)}$:`,
          `**第二步：用"或"合并。** 满足**至少一部分**的数就是解，所以取 $A = ${show(p.solved)}$ 与 $B = ${show(q.solved)}$ 的并集：`,
        )
      : t(
          `**Step 2: combine with "and".** A solution must satisfy **both** parts, so take the intersection of $A = ${show(p.solved)}$ and $B = ${show(q.solved)}$:`,
          `**第二步：用"且"合并。** 解必须同时满足**两部分**，所以取 $A = ${show(p.solved)}$ 与 $B = ${show(q.solved)}$ 的交集：`,
        );
  const read =
    set.length === 0
      ? t(
          "No number is shaded on both lines, so there is no solution: $\\varnothing$.",
          "没有数在两条数轴上都涂色，所以无解：$\\varnothing$。",
        )
      : set.length === 2
        ? t(
            `The two pieces do not overlap, so they stay apart: $${intervalLatex(set)}$.`,
            `两段不重叠，保持分开：$${intervalLatex(set)}$。`,
          )
        : set[0]!.lo === undefined && set[0]!.hi === undefined
          ? t("Every number is in at least one part: $(-\\infty, \\infty)$.", "每个数都至少属于一部分：$(-\\infty, \\infty)$。")
          : t(
              `${endWords(set, parts).en} The answer is $${intervalLatex(set)}$.`,
              `${endWords(set, parts)["zh-CN"]}答案是 $${intervalLatex(set)}$。`,
            );
  const check = partsCheck(kind, [p, q], set);
  return t(
    `**Step 1: solve each part.** ${p.note.en} ${q.note.en}${steps(p.work, q.work)}${combine.en}

{{figure 0}}

${read.en}

${check.en}`,
    `**第一步：分别解每一部分。** ${p.note["zh-CN"]}${q.note["zh-CN"]}${steps(p.work, q.work)}${combine["zh-CN"]}

{{figure 0}}

${read["zh-CN"]}

${check["zh-CN"]}`,
  );
}

/** compoundProblem builds the problem of an "or" or an "and" inequality, with its number lines placed in the solution. */
function compoundProblem(kind: "union" | "intersection", A: Part, B: Part, wrong: readonly RealSet[]) {
  const set = kind === "union" ? union(A.solved, B.solved) : intersect([A.solved], [B.solved]);
  return {
    ...intervalProblem({
      prompt: kind === "union" ? orPrompt(A, B) : andPrompt(A, B),
      set,
      form: "interval",
      wrong,
      solution: compoundSolution(kind, A, B, set),
    }),
    solutionFigures: [partsFigure([A.solved, B.solved], set, kind === "union" ? "\\cup" : "\\cap")],
  };
}

const orPrompt = (p: Part, q: Part) =>
  ask(`Solve $${p.latex} \\text{ or } ${q.latex}$.`, `解复合不等式 $${p.latex} \\text{ 或 } ${q.latex}$。`, asInterval);
const andPrompt = (p: Part, q: Part) =>
  ask(`Solve $${p.latex} \\text{ and } ${q.latex}$.`, `解复合不等式 $${p.latex} \\text{ 且 } ${q.latex}$。`, asInterval);

/** splitRays draws x < p (or ≤) and x > r (or ≥) with p < r. */
function splitRays(rng: Rng): [InequalityOp, number, InequalityOp, number] {
  const p = rng.int(-10, 6);
  return [rng.pick(lessOps), p, rng.pick(greaterOps), p + rng.int(1, 8)];
}

/** negatives draws which of two parts get a negative coefficient: at least one. */
const negatives = (rng: Rng) =>
  rng.pick([
    [true, false],
    [false, true],
    [true, true],
  ] as const);

export const compoundOrInequalities: TopicDef = {
  id: "compound-or-inequalities",
  title: t("Compound OR Inequalities", "“或”型复合不等式"),
  summary: t(
    "Solve inequalities joined by “or” and write the solution set as a union of intervals.",
    "解用“或”连接的不等式，并把解集写成区间的并集。",
  ),
  prerequisites: ["unions-of-intervals"],
  encompasses: [
    { topic: "unions-of-intervals", weight: 0.6 },
    { topic: "solving-multi-step-inequalities", weight: 0.5 },
    { topic: "unbounded-intervals", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.3"],
  intro: t(
    `You can solve a single linear inequality, and you can take the union of two intervals. Put together, they answer conditions with the word **or**. A freezer alarm that sounds when the temperature is below $-20$ or above $-15$ degrees, or a ride that is closed to anyone shorter than $120$ cm or taller than $195$ cm, describes a set made of two pieces.

A compound inequality such as

$$2x + 1 < -3 \\text{ or } 3x - 2 \\ge 7$$

is true when **at least one** of its parts is true. So solve each part on its own: the first gives $x < -2$, the second $x \\ge 3$. A number is a solution if it is in either solution set, which is exactly the union:

{{figure 0}}

The solution is $(-\\infty, -2) \\cup [3, \\infty)$. In this topic we solve "or" inequalities, including parts with negative coefficients and parts whose solutions overlap.`,
    `你会解单个一元一次不等式，也会求两个区间的并集。把两者结合，就能处理带**或**的条件。冰柜温度低于 $-20$ 度或高于 $-15$ 度时报警，游乐设施不允许身高低于 $120$ 厘米或高于 $195$ 厘米的人乘坐，这些描述的都是由两段组成的集合。

复合不等式

$$2x + 1 < -3 \\text{ 或 } 3x - 2 \\ge 7$$

只要**至少一部分**成立就成立。所以分别解每一部分：第一部分得到 $x < -2$，第二部分得到 $x \\ge 3$。属于任一解集的数都是解，这正是并集：

{{figure 0}}

解集是 $(-\\infty, -2) \\cup [3, \\infty)$。这个课题中，我们解"或"型不等式，包括系数为负的部分，以及解集重叠的部分。`,
  ),
  introFigures: [partsFigure([ray("<", -2), ray(">=", 3)], union(ray("<", -2), ray(">=", 3)), "\\cup")],
  knowledgePoints: [
    {
      id: "solving-or-inequalities",
      title: t("Solving OR inequalities", "解“或”型不等式"),
      explanation: t(
        `A compound inequality joined by **or** is true when **at least one** of its parts is true, so its solution set is the **union** of the parts' solution sets. The two parts usually have different expressions, so they cannot be solved together as a double inequality; solve each separately:

$$2x + 1 < -3 \\;\\Rightarrow\\; x < -2 \\qquad 3x - 2 \\ge 7 \\;\\Rightarrow\\; x \\ge 3$$

The solution of $2x + 1 < -3 \\text{ or } 3x - 2 \\ge 7$ is $(-\\infty, -2) \\cup [3, \\infty)$. Check with $x = 4$: $3(4) - 2 = 10 \\ge 7$, so the second part holds and that is enough. With $x = 0$, $1 < -3$ and $-2 \\ge 7$ are both false, and $0$ is not in the answer.

> **Watch out.** "Or" needs only **one** part to be true. Do not answer $\\varnothing$ because no number satisfies both parts, and do not drop one of the pieces: the answer is the union of both. Keep each end's bracket from its own part.`,
        `用**或**连接的复合不等式，只要**至少一部分**成立就成立，所以解集是各部分解集的**并集**。两部分的表达式一般不同，不能像连不等式那样一起解；要分别解每一部分：

$$2x + 1 < -3 \\;\\Rightarrow\\; x < -2 \\qquad 3x - 2 \\ge 7 \\;\\Rightarrow\\; x \\ge 3$$

$2x + 1 < -3 \\text{ 或 } 3x - 2 \\ge 7$ 的解集是 $(-\\infty, -2) \\cup [3, \\infty)$。用 $x = 4$ 检验：$3(4) - 2 = 10 \\ge 7$，第二部分成立，这就够了。取 $x = 0$，$1 < -3$ 和 $-2 \\ge 7$ 都不成立，$0$ 也不在答案里。

> **注意。** "或"只需要**一部分**成立。不要因为没有数同时满足两部分就答 $\\varnothing$，也不要漏掉其中一段：答案是两部分的并集。每一端的括号取自它自己的那一部分。`,
      ),
      generate(rng) {
        const [o1, p, o2, r] = splitRays(rng);
        const parts = [part(rng, o1, p, false), part(rng, o2, r, false)];
        const [A, B] = rng.bool() ? parts : [parts[1]!, parts[0]!];
        const set = union(A!.solved, B!.solved);
        return compoundProblem("union", A!, B!, [[], toggleEnds(set), union(A!.solved)]);
      },
    },
    {
      id: "or-inequalities-with-negative-coefficients",
      title: t("Negative coefficients", "系数为负"),
      explanation: t(
        `Solve each part on its own terms: a part whose coefficient is negative reverses its symbol when you divide, because dividing by a negative number turns the order of numbers around; the other part does not.

$$4 - x \\ge 6 \\;\\Rightarrow\\; -x \\ge 2 \\;\\Rightarrow\\; x \\le -2$$

So $4 - x \\ge 6 \\text{ or } 2x - 1 > 5$ becomes $x \\le -2$ or $x > 3$, and the solution is $(-\\infty, -2] \\cup (3, \\infty)$. Check $x = -3$ in the original: $4 + 3 = 7 \\ge 6$, true.

> **Watch out.** Reverse the symbol only in the part you divide by a negative number, and do not forget it there: leaving $-x \\ge 2$ as $x \\ge -2$ points that piece the wrong way. Check a number from each piece in the **original** inequality.`,
        `每一部分单独处理：系数为负的部分在相除时改变不等号方向，因为除以负数会颠倒数的大小顺序；另一部分则不变。

$$4 - x \\ge 6 \\;\\Rightarrow\\; -x \\ge 2 \\;\\Rightarrow\\; x \\le -2$$

所以 $4 - x \\ge 6 \\text{ 或 } 2x - 1 > 5$ 变成 $x \\le -2$ 或 $x > 3$，解集是 $(-\\infty, -2] \\cup (3, \\infty)$。把 $x = -3$ 代入原式检验：$4 + 3 = 7 \\ge 6$，成立。

> **注意。** 只在除以负数的那一部分改变不等号方向，而且那里一定不能忘：把 $-x \\ge 2$ 写成 $x \\ge -2$，这一段的方向就反了。从每一段各取一个数，代入**原来的**不等式检验。`,
      ),
      generate(rng) {
        const [o1, p, o2, r] = splitRays(rng);
        const [n1, n2] = negatives(rng);
        const parts = [part(rng, o1, p, n1), part(rng, o2, r, n2)];
        const [A, B] = rng.bool() ? parts : [parts[1]!, parts[0]!];
        const set = union(A!.solved, B!.solved);
        return compoundProblem("union", A!, B!, [union(A!.naive, B!.naive), [], toggleEnds(set)]);
      },
    },
    {
      id: "or-inequalities-that-overlap",
      title: t("When the parts overlap", "各部分重叠时"),
      explanation: t(
        `When the solution sets of the parts overlap, the union merges them into one piece, because every number in the overlap is counted once. Rays in opposite directions that overlap leave no number out, so they cover every real number; rays in the same direction give the longer ray:

$$x > -1 \\text{ or } x < 4 \\;\\Rightarrow\\; (-\\infty, \\infty) \\qquad x < 2 \\text{ or } x \\le 5 \\;\\Rightarrow\\; (-\\infty, 5]$$

Any number at all satisfies $x > -1$ or $x < 4$: a number that is not greater than $-1$ is certainly less than $4$.

> **Watch out.** With "or", keep everything either part allows, not just the overlap: $x > -1 \\text{ or } x < 4$ is all real numbers, not $(-1, 4)$, which is the answer for "and".`,
        `各部分的解集重叠时，并集会把它们合并成一段，因为重叠部分的数只算一次。方向相反且重叠的射线不漏掉任何数，所以覆盖全体实数；同方向的射线得到较长的那条：

$$x > -1 \\text{ 或 } x < 4 \\;\\Rightarrow\\; (-\\infty, \\infty) \\qquad x < 2 \\text{ 或 } x \\le 5 \\;\\Rightarrow\\; (-\\infty, 5]$$

任何数都满足 $x > -1$ 或 $x < 4$：一个数如果不大于 $-1$，就一定小于 $4$。

> **注意。** 对"或"，要保留任一部分允许的全部数，而不只是重叠部分：$x > -1 \\text{ 或 } x < 4$ 是全体实数，不是 $(-1, 4)$，后者是"且"的答案。`,
      ),
      generate(rng) {
        const p = rng.int(-10, 6);
        const r = p + rng.int(1, 8);
        let ops: [InequalityOp, number, InequalityOp, number];
        const shape = rng.pick([0, 0, 1, 2]);
        if (shape === 0) ops = [rng.pick(greaterOps), p, rng.pick(lessOps), r];
        else if (shape === 1) ops = [rng.pick(lessOps), p, rng.pick(lessOps), r];
        else ops = [rng.pick(greaterOps), p, rng.pick(greaterOps), r];
        const parts = [part(rng, ops[0], ops[1], rng.bool(0.4)), part(rng, ops[2], ops[3], rng.bool(0.4))];
        const [A, B] = rng.bool() ? parts : [parts[1]!, parts[0]!];
        const set = union(A!.solved, B!.solved);
        return compoundProblem("union", A!, B!, [intersect([A!.solved], [B!.solved]), toggleEnds(set)]);
      },
    },
  ],
};

export const compoundAndInequalities: TopicDef = {
  id: "compound-and-inequalities",
  title: t("Compound AND Inequalities", "“且”型复合不等式"),
  summary: t(
    "Solve inequalities joined by “and” and write the solution set as an intersection.",
    "解用“且”连接的不等式，并把解集写成交集。",
  ),
  prerequisites: ["intersections-of-intervals"],
  encompasses: [
    { topic: "intersections-of-intervals", weight: 0.6 },
    { topic: "solving-multi-step-inequalities", weight: 0.5 },
    { topic: "unbounded-intervals", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.3"],
  intro: t(
    `A double inequality such as $-3 < 2x + 1 \\le 7$ is two conditions on the **same** expression, so we solved it in one go. Often the two conditions are on different expressions: a number $x$ with $2x - 1 > 3$ **and** $3x + 2 \\le 20$. They cannot be written as one double inequality, but the meaning is the same: both must hold.

So solve each part on its own: $2x - 1 > 3$ gives $x > 2$, and $3x + 2 \\le 20$ gives $x \\le 6$. A solution must be in both solution sets, which is their intersection:

{{figure 0}}

The solution is $(2, 6]$, the same set as the double inequality $2 < x \\le 6$. In this topic we solve "and" inequalities, including parts with negative coefficients, and recognize when the parts share nothing, so there is no solution.`,
    `连不等式 $-3 < 2x + 1 \\le 7$ 是对**同一个**表达式的两个条件，所以可以一次解完。但两个条件常常针对不同的表达式：满足 $2x - 1 > 3$ **并且** $3x + 2 \\le 20$ 的数 $x$。它们不能写成一个连不等式，但意思一样：两个条件都必须成立。

所以分别解每一部分：$2x - 1 > 3$ 得到 $x > 2$，$3x + 2 \\le 20$ 得到 $x \\le 6$。解必须同时属于两个解集，也就是它们的交集：

{{figure 0}}

解集是 $(2, 6]$，与连不等式 $2 < x \\le 6$ 是同一个集合。这个课题中，我们解"且"型不等式，包括系数为负的部分，并识别两部分没有公共部分、因而无解的情形。`,
  ),
  introFigures: [partsFigure([ray(">", 2), ray("<=", 6)], union(span(2, false, 6, true)), "\\cap")],
  knowledgePoints: [
    {
      id: "solving-and-inequalities",
      title: t("Solving AND inequalities", "解“且”型不等式"),
      explanation: t(
        `A compound inequality joined by **and** is true only when **both** parts are true, so its solution set is the **intersection** of the parts' solution sets. Solve each part, then keep only the numbers both allow:

$$2x - 1 > 3 \\;\\Rightarrow\\; x > 2 \\qquad 3x + 2 \\le 20 \\;\\Rightarrow\\; x \\le 6$$

The numbers greater than $2$ and at most $6$ form $(2, 6]$, the same as the double inequality $2 < x \\le 6$. Check with $x = 4$: $7 > 3$ and $14 \\le 20$, both true. With $x = 7$, $13 > 3$ is true but $23 \\le 20$ is false, so $7$ is not a solution.

> **Watch out.** "And" needs **both** parts, so the answer is the overlap, not everything either part allows: $(-\\infty, \\infty)$ would be the answer for "or". Each end keeps the bracket of the part it comes from.`,
        `用**且**连接的复合不等式，只有**两部分都**成立时才成立，所以解集是各部分解集的**交集**。分别解每一部分，再只保留两者都允许的数：

$$2x - 1 > 3 \\;\\Rightarrow\\; x > 2 \\qquad 3x + 2 \\le 20 \\;\\Rightarrow\\; x \\le 6$$

大于 $2$ 且不大于 $6$ 的数组成 $(2, 6]$，与连不等式 $2 < x \\le 6$ 相同。用 $x = 4$ 检验：$7 > 3$ 且 $14 \\le 20$，都成立。取 $x = 7$：$13 > 3$ 成立，但 $23 \\le 20$ 不成立，所以 $7$ 不是解。

> **注意。** "且"要求**两部分**都成立，所以答案是重叠部分，而不是任一部分允许的全部数：$(-\\infty, \\infty)$ 是"或"的答案。每一端保留它所来自的那一部分的括号。`,
      ),
      generate(rng) {
        const [less, small, greater, large] = splitRays(rng);
        const parts = [part(rng, greater, small, false), part(rng, less, large, false)];
        const [A, B] = rng.bool() ? parts : [parts[1]!, parts[0]!];
        const set = intersect([A!.solved], [B!.solved]);
        return compoundProblem("intersection", A!, B!, [union(A!.solved, B!.solved), toggleEnds(set)]);
      },
    },
    {
      id: "and-inequalities-with-negative-coefficients",
      title: t("Negative coefficients", "系数为负"),
      explanation: t(
        `As with "or", solve each part on its own and reverse a symbol only in the part where you divide by a negative number: that division turns the order of numbers around in that part alone.

$$-2x < 6 \\text{ and } x - 4 \\le 1 \\;\\Rightarrow\\; x > -3 \\text{ and } x \\le 5 \\;\\Rightarrow\\; (-3, 5]$$

Dividing $-2x < 6$ by $-2$ gives $x > -3$; the second part only needs $4$ added. Check $x = 0$: $0 < 6$ and $-4 \\le 1$, both true.

> **Watch out.** If you forget to reverse, $-2x < 6$ becomes $x < -3$, and the intersection with $x \\le 5$ is wrong. Reverse exactly where you divide by a negative, then intersect; the union is the answer to a different question.`,
        `与"或"一样，分别解每一部分，只在除以负数的那一部分改变不等号方向：这次除法只颠倒那一部分中数的大小顺序。

$$-2x < 6 \\text{ 且 } x - 4 \\le 1 \\;\\Rightarrow\\; x > -3 \\text{ 且 } x \\le 5 \\;\\Rightarrow\\; (-3, 5]$$

$-2x < 6$ 除以 $-2$ 得到 $x > -3$；第二部分只需加上 $4$。用 $x = 0$ 检验：$0 < 6$ 且 $-4 \\le 1$，都成立。

> **注意。** 如果忘了改变方向，$-2x < 6$ 会变成 $x < -3$，与 $x \\le 5$ 的交集就错了。在除以负数的地方准确地改变方向，然后取交集；并集回答的是另一个问题。`,
      ),
      generate(rng) {
        const [less, small, greater, large] = splitRays(rng);
        const [n1, n2] = negatives(rng);
        const parts = [part(rng, greater, small, n1), part(rng, less, large, n2)];
        const [A, B] = rng.bool() ? parts : [parts[1]!, parts[0]!];
        const set = intersect([A!.solved], [B!.solved]);
        return compoundProblem("intersection", A!, B!, [intersect([A!.naive], [B!.naive]), union(A!.solved, B!.solved), toggleEnds(set)]);
      },
    },
    {
      id: "and-inequalities-with-no-solution",
      title: t("No solution or a single ray", "无解或一条射线"),
      explanation: t(
        `If the parts' solution sets do not overlap, no number satisfies both and the solution set is $\\varnothing$. If both are rays in the same direction, every number in the shorter ray is also in the longer one, so the intersection is the shorter ray:

$$x < -1 \\text{ and } x \\ge 3 \\;\\Rightarrow\\; \\varnothing \\qquad x > 0 \\text{ and } x \\ge 4 \\;\\Rightarrow\\; [4, \\infty)$$

No number is both less than $-1$ and at least $3$. And a number that is at least $4$ is automatically greater than $0$, so only $x \\ge 4$ matters.

> **Watch out.** When the parts point away from each other, the answer is $\\varnothing$, not the union of the two rays. When they point the same way, keep the **shorter** ray: the longer one includes numbers that fail the other part.`,
        `如果各部分的解集不重叠，没有数能同时满足，解集是 $\\varnothing$。如果两部分都是同方向的射线，较短射线中的每个数也在较长的射线中，所以交集是较短的那条：

$$x < -1 \\text{ 且 } x \\ge 3 \\;\\Rightarrow\\; \\varnothing \\qquad x > 0 \\text{ 且 } x \\ge 4 \\;\\Rightarrow\\; [4, \\infty)$$

没有数既小于 $-1$ 又不小于 $3$。而不小于 $4$ 的数自然大于 $0$，所以只有 $x \\ge 4$ 起作用。

> **注意。** 两部分方向相背时，答案是 $\\varnothing$，不是两条射线的并集。方向相同时，保留**较短的**射线：较长的那条包含不满足另一部分的数。`,
      ),
      generate(rng) {
        const p = rng.int(-10, 6);
        const r = p + rng.int(1, 8);
        let ops: [InequalityOp, number, InequalityOp, number];
        const shape = rng.pick([0, 0, 1, 2]);
        if (shape === 0) ops = [rng.pick(lessOps), p, rng.pick(greaterOps), r];
        else if (shape === 1) ops = [rng.pick(lessOps), p, rng.pick(lessOps), r];
        else ops = [rng.pick(greaterOps), p, rng.pick(greaterOps), r];
        const parts = [part(rng, ops[0], ops[1], rng.bool(0.4)), part(rng, ops[2], ops[3], rng.bool(0.4))];
        const [A, B] = rng.bool() ? parts : [parts[1]!, parts[0]!];
        const set = intersect([A!.solved], [B!.solved]);
        return compoundProblem("intersection", A!, B!, [union(A!.solved, B!.solved), toggleEnds(set)]);
      },
    },
  ],
};

/** Constraint is a sentence that limits a quantity, such as "at least n cm tall". */
interface Constraint {
  readonly text: (n: number) => Text;
  readonly variable: string;
  readonly op: InequalityOp;
  readonly values: readonly [number, number];
}

const constraints: readonly Constraint[] = [
  {
    text: (n) =>
      t(
        `To ride a roller coaster, a rider must be at least ${n} cm tall. Let $h$ be the height of a rider, in centimeters.`,
        `乘坐过山车的人身高必须至少为 ${n} 厘米。设 $h$ 为乘客的身高（厘米）。`,
      ),
    variable: "h",
    op: ">=",
    values: [110, 140],
  },
  {
    text: (n) =>
      t(
        `An elevator can carry at most ${n} kg. Let $w$ be the weight of a load it may carry, in kilograms.`,
        `一部电梯最多能载重 ${n} 千克。设 $w$ 为它可以承载的重量（千克）。`,
      ),
    variable: "w",
    op: "<=",
    values: [500, 1500],
  },
  {
    text: (n) =>
      t(
        `The speed limit on a road is $${n}$ km/h. Let $s$ be a speed, in km/h, that obeys the limit.`,
        `一条道路的限速是每小时 $${n}$ 千米。设 $s$ 为符合限速的车速（千米/时）。`,
      ),
    variable: "s",
    op: "<=",
    values: [30, 120],
  },
  {
    text: (n) =>
      t(
        `A film may only be seen by viewers older than $${n}$. Let $a$ be the age of a viewer who may see it.`,
        `一部电影只允许年龄大于 $${n}$ 岁的观众观看。设 $a$ 为可以观看的观众的年龄。`,
      ),
    variable: "a",
    op: ">",
    values: [10, 21],
  },
  {
    text: (n) =>
      t(
        `Kim wants to spend less than $${n}$ dollars on a gift. Let $c$ be the cost of the gift, in dollars.`,
        `小金想花少于 $${n}$ 元买礼物。设 $c$ 为礼物的价格（元）。`,
      ),
    variable: "c",
    op: "<",
    values: [15, 90],
  },
  {
    text: (n) =>
      t(
        `A team needs more than $${n}$ points to reach the playoffs. Let $p$ be the team's number of points.`,
        `一支球队需要超过 $${n}$ 分才能进入季后赛。设 $p$ 为该队的得分。`,
      ),
    variable: "p",
    op: ">",
    values: [20, 70],
  },
  {
    text: (n) =>
      t(
        `The temperature in a freezer must stay below $${n}$ °C. Let $t$ be the temperature in the freezer, in degrees Celsius.`,
        `冷冻柜内的温度必须保持在 $${n}$°C 以下。设 $t$ 为冷冻柜内的温度（摄氏度）。`,
      ),
    variable: "t",
    op: "<",
    values: [-25, -12],
  },
  {
    text: (n) =>
      t(
        `A trip will run only if no fewer than $${n}$ people sign up. Let $n$ be the number of people who sign up for a trip that runs.`,
        `报名人数不少于 $${n}$ 人时旅行才会成行。设 $n$ 为一次成行的旅行的报名人数。`,
      ),
    variable: "n",
    op: ">=",
    values: [8, 40],
  },
  {
    text: (n) =>
      t(
        `A carry-on bag may weigh no more than $${n}$ kg. Let $m$ be the weight of a bag that is allowed, in kilograms.`,
        `随身行李的重量不能超过 $${n}$ 千克。设 $m$ 为允许携带的行李重量（千克）。`,
      ),
    variable: "m",
    op: "<=",
    values: [5, 23],
  },
];

/** Range is a sentence that keeps a quantity between two bounds. */
interface Range {
  readonly text: (a: number, b: number) => Text;
  readonly variable: string;
  readonly closed: readonly [boolean, boolean];
  readonly low: readonly [number, number];
  readonly width: readonly [number, number];
}

const ranges: readonly Range[] = [
  {
    text: (a, b) =>
      t(
        `A summer camp accepts children from $${a}$ to $${b}$ years old, inclusive. Let $a$ be the age of a camper.`,
        `一个夏令营接收 $${a}$ 到 $${b}$ 岁（含 $${a}$ 岁和 $${b}$ 岁）的儿童。设 $a$ 为营员的年龄。`,
      ),
    variable: "a",
    closed: [true, true],
    low: [5, 9],
    width: [3, 8],
  },
  {
    text: (a, b) =>
      t(
        `A plant grows well when the temperature is above $${a}$ °C but below $${b}$ °C. Let $t$ be such a temperature, in degrees Celsius.`,
        `当温度高于 $${a}$°C 且低于 $${b}$°C 时，一种植物长得好。设 $t$ 为这样的温度（摄氏度）。`,
      ),
    variable: "t",
    closed: [false, false],
    low: [5, 18],
    width: [8, 20],
  },
  {
    text: (a, b) =>
      t(
        `A parcel ships at the medium rate if it weighs more than $${a}$ kg and at most $${b}$ kg. Let $w$ be the weight of such a parcel, in kilograms.`,
        `重量超过 $${a}$ 千克且不超过 $${b}$ 千克的包裹按中档运费寄送。设 $w$ 为这样的包裹的重量（千克）。`,
      ),
    variable: "w",
    closed: [false, true],
    low: [1, 10],
    width: [2, 15],
  },
  {
    text: (a, b) =>
      t(
        `A score of at least $${a}$ but less than $${b}$ earns a B. Let $s$ be a score that earns a B.`,
        `成绩至少 $${a}$ 分但低于 $${b}$ 分为 B 等。设 $s$ 为获得 B 等的成绩。`,
      ),
    variable: "s",
    closed: [true, false],
    low: [60, 85],
    width: [5, 15],
  },
  {
    text: (a, b) =>
      t(
        `On a highway, cars must drive faster than $${a}$ km/h but no faster than $${b}$ km/h. Let $v$ be an allowed speed, in km/h.`,
        `在一条高速公路上，车速必须高于每小时 $${a}$ 千米，但不能高于每小时 $${b}$ 千米。设 $v$ 为允许的车速（千米/时）。`,
      ),
    variable: "v",
    closed: [false, true],
    low: [40, 70],
    width: [30, 60],
  },
];

/** linearModel draws a situation with the inequality that models it, three that do not, and the reasoning behind it. */
function linearModel(rng: Rng): { prompt: Text; correct: string; others: string[]; solution: Text } {
  const kind = rng.int(0, 2);
  if (kind === 0) {
    const f = rng.int(10, 40);
    let r = rng.int(2, 9);
    if (r === f) r += 1;
    const k = rng.int(4, 20);
    const B = f + r * k;
    return {
      prompt: t(
        `A phone plan costs $${f}$ dollars a month plus $${r}$ dollars for each gigabyte of data. Ana wants her monthly bill to be at most $${B}$ dollars. Which inequality describes the numbers of gigabytes $g$ she can use?`,
        `某手机套餐每月收费 $${f}$ 元，另外每使用 $1$ GB 流量收费 $${r}$ 元。安娜希望每月账单不超过 $${B}$ 元。下列哪个不等式描述了她可以使用的流量 $g$（GB）？`,
      ),
      correct: `${f} + ${r}g \\le ${B}`,
      others: [`${f} + ${r}g \\ge ${B}`, `${r} + ${f}g \\le ${B}`, `${f + r}g \\le ${B}`],
      solution: t(
        `**Step 1: the limited quantity.** The bill is the fixed $${f}$ dollars plus $${r}$ dollars for each of the $g$ gigabytes: $${f} + ${r}g$. The $${f}$ is paid once, so it is not multiplied by $g$.

**Step 2: compare with the limit.** "At most $${B}$" allows $${B}$ itself and anything less, so the symbol is $\\le$: $${f} + ${r}g \\le ${B}$.

**Check.** With $g = ${k}$ the bill is $${f} + ${r * k} = ${B}$, exactly the limit, which Ana accepts, and $${B} \\le ${B}$ is true. With $g = ${k + 1}$ it is $${B + r}$, over the limit, and the inequality is false.`,
        `**第一步：受限制的量。** 账单是固定的 $${f}$ 元，加上 $g$ GB 中每 GB $${r}$ 元：$${f} + ${r}g$。$${f}$ 元只付一次，所以不乘以 $g$。

**第二步：与限制值比较。** "不超过 $${B}$"允许 $${B}$ 本身以及更少，所以用 $\\le$：$${f} + ${r}g \\le ${B}$。

**检验。** $g = ${k}$ 时账单是 $${f} + ${r * k} = ${B}$，恰好等于限额，安娜可以接受，而 $${B} \\le ${B}$ 成立。$g = ${k + 1}$ 时账单是 $${B + r}$，超过限额，不等式不成立。`,
      ),
    };
  }
  if (kind === 1) {
    const s = rng.int(20, 150);
    let r = rng.int(5, 40);
    if (r === s) r += 1;
    const k = rng.int(3, 15);
    const T = s + r * k;
    return {
      prompt: t(
        `Leo has $${s}$ dollars saved and saves $${r}$ dollars more each week. Which inequality describes the numbers of weeks $w$ after which he has at least $${T}$ dollars?`,
        `小李已经存了 $${s}$ 元，每周再存 $${r}$ 元。下列哪个不等式描述了使他至少有 $${T}$ 元的周数 $w$？`,
      ),
      correct: `${s} + ${r}w \\ge ${T}`,
      others: [`${s} + ${r}w \\le ${T}`, `${r} + ${s}w \\ge ${T}`, `${s} - ${r}w \\ge ${T}`],
      solution: t(
        `**Step 1: the limited quantity.** After $w$ weeks Leo has the $${s}$ dollars he started with plus $${r}$ dollars for each week: $${s} + ${r}w$. Saving adds money, so the term is added, not subtracted.

**Step 2: compare with the limit.** "At least $${T}$" allows $${T}$ itself and anything more, so the symbol is $\\ge$: $${s} + ${r}w \\ge ${T}$.

**Check.** After $${k}$ weeks he has $${s} + ${r * k} = ${T}$ dollars, exactly enough, and $${T} \\ge ${T}$ is true. After $${k - 1}$ weeks he has $${T - r}$ dollars, too little, and the inequality is false.`,
        `**第一步：受限制的量。** $w$ 周后小李有原来的 $${s}$ 元，加上每周 $${r}$ 元：$${s} + ${r}w$。存钱是增加，所以这一项是加上，不是减去。

**第二步：与限制值比较。** "至少 $${T}$"允许 $${T}$ 本身以及更多，所以用 $\\ge$：$${s} + ${r}w \\ge ${T}$。

**检验。** $${k}$ 周后他有 $${s} + ${r * k} = ${T}$ 元，恰好够，而 $${T} \\ge ${T}$ 成立。$${k - 1}$ 周后他有 $${T - r}$ 元，不够，不等式不成立。`,
      ),
    };
  }
  const r = rng.int(2, 12);
  const V = r * rng.int(20, 60);
  const L = r * rng.int(2, 15);
  const k = (V - L) / r;
  return {
    prompt: t(
      `A tank holds $${V}$ liters of water and drains at $${r}$ liters per minute. Which inequality describes the times $m$, in minutes, at which it still holds more than $${L}$ liters?`,
      `一个水箱装有 $${V}$ 升水，每分钟流出 $${r}$ 升。下列哪个不等式描述了水箱中仍多于 $${L}$ 升水的时刻 $m$（分钟）？`,
    ),
    correct: `${V} - ${r}m > ${L}`,
    others: [`${V} - ${r}m < ${L}`, `${V} + ${r}m > ${L}`, `${r}m - ${V} > ${L}`],
    solution: t(
      `**Step 1: the limited quantity.** After $m$ minutes the tank has lost $${r}m$ liters of its $${V}$, so it holds $${V} - ${r}m$ liters. Draining takes water away, so the term is subtracted from $${V}$.

**Step 2: compare with the limit.** "More than $${L}$" does not allow $${L}$ itself, so the symbol is $>$: $${V} - ${r}m > ${L}$.

**Check.** At $m = ${k - 1}$ the tank holds $${V - r * (k - 1)}$ liters, more than $${L}$, and the inequality is true. At $m = ${k}$ it holds exactly $${L}$, which is not more than $${L}$, and $${L} > ${L}$ is false.`,
      `**第一步：受限制的量。** $m$ 分钟后水箱的 $${V}$ 升水流走了 $${r}m$ 升，所以还有 $${V} - ${r}m$ 升。流出是减少，所以从 $${V}$ 中减去这一项。

**第二步：与限制值比较。** "多于 $${L}$"不允许 $${L}$ 本身，所以用 $>$：$${V} - ${r}m > ${L}$。

**检验。** $m = ${k - 1}$ 时水箱有 $${V - r * (k - 1)}$ 升，多于 $${L}$，不等式成立。$m = ${k}$ 时恰好是 $${L}$ 升，不多于 $${L}$，而 $${L} > ${L}$ 不成立。`,
    ),
  };
}

const rangeWords: Record<string, Text> = {
  "true,true": t("at least {L} and at most {H}", "不少于 {L} 且不超过 {H}"),
  "false,true": t("more than {L} but at most {H}", "多于 {L} 但不超过 {H}"),
  "true,false": t("at least {L} but less than {H}", "不少于 {L} 但少于 {H}"),
  "false,false": t("more than {L} but less than {H}", "多于 {L} 但少于 {H}"),
};

/** between writes a range of values in words, such as "at least 120 and at most 200". */
function between(lc: boolean, hc: boolean, L: number, H: number): Text {
  const w = rangeWords[`${lc},${hc}`]!;
  const fill = (s: string) => s.replace("{L}", `$${L}$`).replace("{H}", `$${H}$`);
  return t(fill(w.en), fill(w["zh-CN"]));
}

export const introductionToModelingWithInequalities: TopicDef = {
  id: "introduction-to-modeling-with-inequalities",
  title: t("Introduction to Modeling With Inequalities", "用不等式建模入门"),
  summary: t(
    "Translate limits stated in words, such as “at least” or “between”, into inequalities.",
    "把“至少”“介于……之间”等文字表述的限制翻译成不等式。",
  ),
  prerequisites: ["solving-multi-step-inequalities", "compound-inequalities"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.HSA.CED.A.3"],
  intro: t(
    `You have modeled situations with equations: a quantity in words becomes an expression, and "is" becomes $=$. Many real questions are not about one exact value but about a **limit**: a bag may weigh no more than $23$ kg, a rider must be at least $120$ cm tall, a camp takes children from $8$ to $12$ years old. Each describes a whole set of allowed values, and an inequality is the way to write it.

Two questions turn the words into symbols. **Which way?** "No more than $23$" allows the smaller values, so the symbol points with $w$ on the small side: $w \\le 23$. **Is the boundary allowed?** A bag of exactly $23$ kg is not "more than $23$", so it is allowed, and the symbol includes equality: $\\le$, not $<$.

A test value settles any doubt: try the boundary itself and a value just past it. In this topic we write single limits, ranges between two limits as double inequalities, and inequalities for quantities built from a fixed amount and a rate.`,
    `你已经会用方程为情境建模：文字中的量变成表达式，"是"变成 $=$。但很多实际问题不是关于一个确定的值，而是关于一个**限制**：行李不能超过 $23$ 千克，乘客身高至少 $120$ 厘米，夏令营接收 $8$ 到 $12$ 岁的儿童。每一句都描述一整组允许的值，写出它的方式就是不等式。

把文字变成符号要回答两个问题。**朝哪个方向？** "不超过 $23$"允许较小的值，所以符号让 $w$ 在较小的一侧：$w \\le 23$。**边界值允许吗？** 恰好 $23$ 千克的行李并没有"超过 $23$"，所以允许，符号包含相等：用 $\\le$，不用 $<$。

有疑问时，用检验值来判断：试一试边界值本身，再试一个刚好越过它的值。这个课题中，我们书写单个限制，把两个限制之间的范围写成连不等式，并为由固定量加上变化率组成的量写不等式。`,
  ),
  knowledgePoints: [
    {
      id: "constraints-from-words",
      title: t("One limit", "单个限制"),
      explanation: t(
        `Real situations state limits in words. Two things must be read from them: which side of the limit is allowed, and whether the boundary itself is allowed. The words decide both:

| Words | Symbol |
| :--- | :--- |
| at least, no less than, minimum | $\\ge$ |
| at most, no more than, maximum | $\\le$ |
| more than, above, older than | $>$ |
| less than, below, under | $<$ |

"A rider must be at least $120$ cm tall" means $h \\ge 120$. Test the boundary: a rider of exactly $120$ cm is "at least $120$", so may ride, and $120 \\ge 120$ is true. A rider of $119$ cm may not, and $119 \\ge 120$ is false.

> **Watch out.** "At least" and "no less than" include the boundary: $\\ge$, not $>$. "At most" points to the **small** side: $\\le$, not $\\ge$. Test the boundary value in the words before choosing between $<$ and $\\le$.`,
        `实际情境常用文字表述限制。要从中读出两件事：允许的是限制值的哪一侧，以及边界值本身是否允许。这两件事都由文字决定：

| 文字 | 符号 |
| :--- | :--- |
| 至少、不少于、最低 | $\\ge$ |
| 至多、不超过、最高 | $\\le$ |
| 多于、高于、大于 | $>$ |
| 少于、低于、不到 | $<$ |

"乘客身高必须至少为 $120$ 厘米"表示 $h \\ge 120$。检验边界：恰好 $120$ 厘米的人"至少 $120$"，可以乘坐，而 $120 \\ge 120$ 成立。$119$ 厘米的人不能乘坐，$119 \\ge 120$ 也不成立。

> **注意。** "至少"和"不少于"包含边界：用 $\\ge$，不用 $>$。"至多"指向**较小**的一侧：用 $\\le$，不用 $\\ge$。在 $<$ 和 $\\le$ 之间选择前，先用文字检验边界值。`,
      ),
      generate(rng) {
        const c = rng.pick(constraints);
        const n = rng.int(c.values[0], c.values[1]);
        const text = c.text(n);
        const small = c.op.startsWith("<");
        const closed = c.op.length === 2;
        const past = small ? n + 1 : n - 1;
        const inside = small ? n - 1 : n + 1;
        return inequalityProblem({
          prompt: t(`${text.en} Write an inequality for $${c.variable}$.`, `${text["zh-CN"]}写出关于 $${c.variable}$ 的不等式。`),
          variable: c.variable,
          op: c.op,
          value: n,
          wrong: [
            [strictness[c.op], n],
            [flip[c.op], n],
          ],
          solution: t(
            `**Step 1: which side.** The limit is $${n}$, and the words allow values ${small ? "below" : "above"} it, so $${c.variable}$ is on the ${small ? "small" : "large"} side: $${c.variable} ${small ? "<" : ">"} ${n}$ or $${c.variable} ${small ? "\\le" : "\\ge"} ${n}$.

**Step 2: the boundary.** By the words, a value of exactly $${n}$ is ${closed ? "allowed, so the symbol includes equality" : "not allowed, so the symbol is strict"}: $${inequalityLatex(c.variable, c.op, n)}$.

**Check.** $${c.variable} = ${inside}$ is allowed and satisfies it; $${c.variable} = ${past}$ is not allowed and $${past} ${relSymbol(c.op)} ${n}$ is false; and $${n} ${relSymbol(c.op)} ${n}$ is ${closed ? "true" : "false"}, as the words say.`,
            `**第一步：哪一侧。** 限制值是 $${n}$，文字允许${small ? "低于" : "高于"}它的值，所以 $${c.variable}$ 在${small ? "较小" : "较大"}的一侧：$${c.variable} ${small ? "<" : ">"} ${n}$ 或 $${c.variable} ${small ? "\\le" : "\\ge"} ${n}$。

**第二步：边界。** 按照题意，恰好等于 $${n}$ 的值${closed ? "允许，所以符号包含相等" : "不允许，所以用严格不等号"}：$${inequalityLatex(c.variable, c.op, n)}$。

**检验。** $${c.variable} = ${inside}$ 允许，也满足它；$${c.variable} = ${past}$ 不允许，而 $${past} ${relSymbol(c.op)} ${n}$ 不成立；$${n} ${relSymbol(c.op)} ${n}$ ${closed ? "成立" : "不成立"}，与题意一致。`,
          ),
        });
      },
    },
    {
      id: "ranges-from-words",
      title: t("A range between two limits", "两个限制之间的范围"),
      explanation: t(
        `A quantity limited from both sides must satisfy both limits at once, so it is described by a double inequality with the smaller bound on the left. Each bound is read on its own, by asking whether that boundary value is allowed. "Inclusive" means both bounds are allowed.

"Children from $8$ to $12$ years old, inclusive" means $8 \\le a \\le 12$: a child of $8$ and a child of $12$ may come. "Above $10$ °C but below $25$ °C" means $10 < t < 25$: neither $10$ nor $25$ is above and below at once.

> **Watch out.** Decide each end separately: "at least $60$ but less than $70$" is $60 \\le s < 70$, with different symbols at the two ends. Do not make both ends $\\le$ just because the range has two numbers.`,
        `两侧都受限制的量必须同时满足两个限制，所以用连不等式描述，较小的边界写在左边。每个边界单独判断：问一问这个边界值是否允许。"含"表示两个边界都允许。

"$8$ 到 $12$ 岁（含）的儿童"表示 $8 \\le a \\le 12$：$8$ 岁和 $12$ 岁的孩子都可以参加。"高于 $10$°C 且低于 $25$°C"表示 $10 < t < 25$：$10$ 和 $25$ 都不满足"高于且低于"。

> **注意。** 两端分别判断："至少 $60$ 但少于 $70$"是 $60 \\le s < 70$，两端的符号不同。不要因为范围有两个数，就把两端都写成 $\\le$。`,
      ),
      generate(rng) {
        const r = rng.pick(ranges);
        const a = rng.int(r.low[0], r.low[1]);
        const b = a + rng.int(r.width[0], r.width[1]);
        const [lc, hc] = r.closed;
        const set = union(span(a, lc, b, hc));
        const text = r.text(a, b);
        const v = r.variable;
        const allow = (ok: boolean) => (ok ? t("allowed", "允许") : t("not allowed", "不允许"));
        return intervalProblem({
          prompt: t(`${text.en} Write a double inequality for $${v}$.`, `${text["zh-CN"]}写出关于 $${v}$ 的连不等式。`),
          set,
          form: "inequality",
          variable: v,
          wrong: [union(span(a, !lc, b, !hc)), union(span(a, hc, b, lc)), union(span(a, true, b, true))],
          solution: t(
            `**Step 1: the lower bound.** By the words, $${v} = ${a}$ is ${allow(lc).en}, so the left symbol is $${lc ? "\\le" : "<"}$: $${a} ${lc ? "\\le" : "<"} ${v}$.

**Step 2: the upper bound.** $${v} = ${b}$ is ${allow(hc).en}, so the right symbol is $${hc ? "\\le" : "<"}$. Both limits hold at once: $${inequalityLatexOf(set, v)}$.

**Check.** A value in the middle, $${v} = ${a + 1}$, satisfies both parts; $${v} = ${b + 1}$ breaks the upper limit, and the inequality is false for it.`,
            `**第一步：下界。** 按照题意，$${v} = ${a}$ ${allow(lc)["zh-CN"]}，所以左边的符号是 $${lc ? "\\le" : "<"}$：$${a} ${lc ? "\\le" : "<"} ${v}$。

**第二步：上界。** $${v} = ${b}$ ${allow(hc)["zh-CN"]}，所以右边的符号是 $${hc ? "\\le" : "<"}$。两个限制同时成立：$${inequalityLatexOf(set, v)}$。

**检验。** 中间的值 $${v} = ${a + 1}$ 满足两部分；$${v} = ${b + 1}$ 超出上限，不等式对它不成立。`,
          ),
        });
      },
    },
    {
      id: "choosing-an-inequality",
      title: t("Choosing a model", "选择模型"),
      explanation: t(
        `To model a situation, write the quantity that is limited as an expression in the unknown, then compare it with the limit using the symbol the words call for. Build the expression the same way as for an equation: a fixed amount is added once, and a rate is multiplied by the unknown.

A plan costing $20$ dollars plus $3$ dollars per gigabyte costs $20 + 3g$ for $g$ gigabytes. A bill of at most $50$ dollars allows $50$ and less, so

$$20 + 3g \\le 50$$

Check with $g = 10$: the bill is $50$, exactly the limit, and $50 \\le 50$ is true.

> **Watch out.** Multiply the **rate** by the unknown, not the fixed amount: $3 + 20g$ swaps them. Add what is gained and subtract what is lost, and point the symbol the way the words do: "at most" is $\\le$.`,
        `建模时，先把受限制的量写成关于未知数的式子，再用文字要求的符号与限制值比较。写式子的方法与列方程一样：固定量加一次，变化率乘以未知数。

月费 $20$ 元、每 GB 流量 $3$ 元的套餐，用 $g$ GB 的费用是 $20 + 3g$。账单不超过 $50$ 元允许 $50$ 及以下，所以

$$20 + 3g \\le 50$$

用 $g = 10$ 检验：账单是 $50$，恰好等于限额，$50 \\le 50$ 成立。

> **注意。** 用**变化率**乘以未知数，而不是固定量：$3 + 20g$ 把两者弄反了。增加的量用加，减少的量用减，符号方向按文字来："不超过"是 $\\le$。`,
      ),
      generate(rng) {
        const m = linearModel(rng);
        const options = rng.shuffle([m.correct, ...m.others]);
        return choiceProblem({
          prompt: m.prompt,
          options: options.map((o) => same(`$${o}$`)),
          correct: options.indexOf(m.correct),
          solution: m.solution,
        });
      },
    },
  ],
};
/** oneStepModel draws a situation solved by one inverse operation, with its solution worked and checked. */
function oneStepModel(rng: Rng): {
  text: Text;
  variable: string;
  op: InequalityOp;
  value: Q;
  wrong: [InequalityOp, Q][];
  solution: Text;
} {
  const kind = rng.int(0, 3);
  /** worked writes the model, its one step and a check at the boundary and past it. */
  const worked = (model: Text, step: Text, line: string, check: Text): Text =>
    t(
      `**Step 1: write the model.** ${model.en}\n\n**Step 2: solve.** ${step.en}${steps(line)}${check.en}`,
      `**第一步：列出模型。** ${model["zh-CN"]}\n\n**第二步：求解。** ${step["zh-CN"]}${steps(line)}${check["zh-CN"]}`,
    );
  if (kind === 0) {
    const C = 50 * rng.int(20, 60);
    const L = 50 * rng.int(4, C / 50 - 2);
    return {
      text: t(
        `A truck can carry at most $${C}$ kg. It is already loaded with $${L}$ kg. Let $w$ be the additional weight, in kilograms, that may be loaded.`,
        `一辆卡车最多能载重 $${C}$ 千克，车上已装有 $${L}$ 千克货物。设 $w$ 为还可以装载的重量（千克）。`,
      ),
      variable: "w",
      op: "<=",
      value: Q.of(C - L),
      wrong: [
        [">=", Q.of(C - L)],
        ["<=", Q.of(C + L)],
      ],
      solution: worked(
        t(
          `The total load is the $${L}$ kg already on plus $w$, and "at most $${C}$" means $\\le$: $${L} + w \\le ${C}$.`,
          `总载重是已装的 $${L}$ 千克加上 $w$，"最多 $${C}$"表示 $\\le$：$${L} + w \\le ${C}$。`,
        ),
        t(`Subtract $${L}$ from both sides; subtracting keeps the symbol:`, `两边同时减去 $${L}$；减法不改变不等号方向：`),
        `${L} + w \\le ${C} \\;\\Rightarrow\\; w \\le ${C - L}`,
        t(
          `**Check.** Loading $${C - L}$ kg more gives $${L} + ${C - L} = ${C}$ kg, exactly the limit; one more kilogram gives $${C + 1}$ kg, too much.`,
          `**检验。** 再装 $${C - L}$ 千克，总共 $${L} + ${C - L} = ${C}$ 千克，恰好等于上限；再多 $1$ 千克就是 $${C + 1}$ 千克，超载了。`,
        ),
      ),
    };
  }
  if (kind === 1) {
    const r = rng.int(8, 25);
    const D = rng.int(20, 120);
    const v = Q.of(D, r);
    return {
      text: t(
        `A cyclist rides at $${r}$ km/h. Let $t$ be a riding time, in hours, in which she covers at least $${D}$ km.`,
        `一名骑行者的速度是每小时 $${r}$ 千米。设 $t$ 为她至少骑行 $${D}$ 千米所用的时间（小时）。`,
      ),
      variable: "t",
      op: ">=",
      value: v,
      wrong: [
        ["<=", v],
        [">=", Q.of(D * r)],
      ],
      solution: worked(
        t(
          `In $t$ hours at $${r}$ km/h she covers $${r}t$ km, and "at least $${D}$" means $\\ge$: $${r}t \\ge ${D}$.`,
          `以每小时 $${r}$ 千米骑 $t$ 小时，路程是 $${r}t$ 千米；"至少 $${D}$"表示 $\\ge$：$${r}t \\ge ${D}$。`,
        ),
        t(`Divide both sides by $${r}$; it is positive, so the symbol stays:`, `两边同时除以 $${r}$；它是正数，不等号方向不变：`),
        `${r}t \\ge ${D} \\;\\Rightarrow\\; t \\ge ${num(v)}`,
        t(
          `**Check.** In $${num(v)}$ hours she covers $${r} \\cdot ${num(v)} = ${D}$ km, exactly the distance; riding longer covers more, riding less covers less.`,
          `**检验。** 骑 $${num(v)}$ 小时的路程是 $${r} \\cdot ${num(v)} = ${D}$ 千米，恰好够；骑得更久路程更长，更短则不够。`,
        ),
      ),
    };
  }
  if (kind === 2) {
    const r = rng.int(5, 30);
    const C = 50 * rng.int(6, 60);
    const v = Q.of(C, r);
    return {
      text: t(
        `A pump fills a pool at $${r}$ liters per minute. The pool holds at most $${C}$ liters. Let $m$ be a pumping time, in minutes, that does not make the pool overflow.`,
        `一台水泵每分钟向水池注水 $${r}$ 升，水池最多能装 $${C}$ 升。设 $m$ 为不会使水池溢出的注水时间（分钟）。`,
      ),
      variable: "m",
      op: "<=",
      value: v,
      wrong: [
        [">=", v],
        ["<=", Q.of(C - r)],
      ],
      solution: worked(
        t(
          `In $m$ minutes the pump adds $${r}m$ liters, and not overflowing means at most $${C}$: $${r}m \\le ${C}$.`,
          `$m$ 分钟内水泵注入 $${r}m$ 升；不溢出就是不超过 $${C}$ 升：$${r}m \\le ${C}$。`,
        ),
        t(`Divide both sides by $${r}$; it is positive, so the symbol stays:`, `两边同时除以 $${r}$；它是正数，不等号方向不变：`),
        `${r}m \\le ${C} \\;\\Rightarrow\\; m \\le ${num(v)}`,
        t(
          `**Check.** After $${num(v)}$ minutes the pool holds $${r} \\cdot ${num(v)} = ${C}$ liters, exactly full; any longer and it overflows.`,
          `**检验。** 注水 $${num(v)}$ 分钟后水池有 $${r} \\cdot ${num(v)} = ${C}$ 升，恰好装满；再久就会溢出。`,
        ),
      ),
    };
  }
  const s = rng.int(10, 200);
  const T = s + rng.int(20, 400);
  return {
    text: t(
      `Mia has saved $${s}$ dollars. She needs at least $${T}$ dollars for a bike. Let $d$ be the additional amount, in dollars, she must save.`,
      `米娅已经存了 $${s}$ 元，她至少需要 $${T}$ 元买一辆自行车。设 $d$ 为她还需要存的钱（元）。`,
    ),
    variable: "d",
    op: ">=",
    value: Q.of(T - s),
    wrong: [
      ["<=", Q.of(T - s)],
      [">=", Q.of(T + s)],
    ],
    solution: worked(
      t(
        `Her savings will be $${s} + d$ dollars, and "at least $${T}$" means $\\ge$: $${s} + d \\ge ${T}$.`,
        `她的存款将是 $${s} + d$ 元，"至少 $${T}$"表示 $\\ge$：$${s} + d \\ge ${T}$。`,
      ),
      t(`Subtract $${s}$ from both sides; subtracting keeps the symbol:`, `两边同时减去 $${s}$；减法不改变不等号方向：`),
      `${s} + d \\ge ${T} \\;\\Rightarrow\\; d \\ge ${T - s}`,
      t(
        `**Check.** Saving $${T - s}$ dollars more gives $${s} + ${T - s} = ${T}$ dollars, exactly enough; one dollar less gives $${T - 1}$, not enough.`,
        `**检验。** 再存 $${T - s}$ 元，共有 $${s} + ${T - s} = ${T}$ 元，恰好够；少存 $1$ 元就只有 $${T - 1}$ 元，不够。`,
      ),
    ),
  };
}

export const modelingWithOneStepInequalities: TopicDef = {
  id: "modeling-with-one-step-inequalities",
  title: t("Modeling With One-Step Inequalities", "用一步不等式建模"),
  summary: t(
    "Write and solve one-step inequalities for real situations, including whole-number answers.",
    "为实际情境列出并解一步不等式，包括答案须为整数的情形。",
  ),
  prerequisites: ["introduction-to-modeling-with-inequalities"],
  encompasses: [
    { topic: "introduction-to-modeling-with-inequalities", weight: 0.5 },
    { topic: "solving-one-step-inequalities", weight: 0.6 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.7.EE.B.4.B"],
  intro: t(
    `You can turn a limit in words into an inequality, such as $750 + w \\le 2000$ for a truck that already holds $750$ kg and may carry at most $2000$. Writing the model is half the job; the question usually asks **how much** is allowed, and that needs the inequality solved.

Solving works as with an equation, one inverse step: subtract $750$ from both sides, which keeps the symbol, and $w \\le 1250$. The truck may take up to $1250$ kg more. A quick check at the boundary confirms it: $750 + 1250 = 2000$, exactly the limit.

One thing is new in stories. When the unknown counts things, such as notebooks or buses, the answer must be a whole number, and the inequality says which way to round: down for a greatest number, up for a least number. In this topic we write and solve such models.`,
    `你会把文字表述的限制变成不等式，例如一辆已装 $750$ 千克、最多载重 $2000$ 千克的卡车，满足 $750 + w \\le 2000$。列出模型只完成了一半；题目通常问的是**最多（或至少）多少**，这需要解不等式。

解法与解方程一样，只需一步逆运算：两边同时减去 $750$，不等号方向不变，得到 $w \\le 1250$。卡车最多还能装 $1250$ 千克。在边界检验一下就能确认：$750 + 1250 = 2000$，恰好等于上限。

情境中有一点是新的。当未知数表示个数，例如笔记本或大巴时，答案必须是整数，而不等式告诉我们向哪个方向取整：求最大个数时向下取整，求最少个数时向上取整。这个课题中，我们列出并求解这样的模型。`,
  ),
  knowledgePoints: [
    {
      id: "solving-one-step-models",
      title: t("Writing and solving the model", "列出并求解模型"),
      explanation: t(
        `Write the inequality the situation describes, then solve it with one inverse operation. Adding or subtracting the same number on both sides, or dividing by a positive number, keeps the symbol, so the answer reads the same way as the limit in the words.

A truck that carries at most $2000$ kg and already holds $750$ kg can take $w$ more kilograms with

$$750 + w \\le 2000 \\;\\Rightarrow\\; w \\le 1250$$

Check at the boundary: $750 + 1250 = 2000$, exactly the limit, so $1250$ kg is the most it may take.

> **Watch out.** Undo the operation in the model: subtract the $750$ that is already on, do not add it. "At most" stays $\\le$ after the step, so the answer is $w \\le 1250$, not $w \\ge 1250$.`,
        `先列出情境所描述的不等式，再用一步逆运算求解。两边同时加上或减去同一个数，或除以正数，都不改变不等号方向，所以答案的方向与文字中的限制一致。

最多载重 $2000$ 千克、已装 $750$ 千克的卡车，还能装 $w$ 千克，满足

$$750 + w \\le 2000 \\;\\Rightarrow\\; w \\le 1250$$

在边界检验：$750 + 1250 = 2000$，恰好等于上限，所以最多还能装 $1250$ 千克。

> **注意。** 要抵消模型中的运算：减去已装的 $750$，而不是加上它。"最多"在这一步之后仍是 $\\le$，所以答案是 $w \\le 1250$，不是 $w \\ge 1250$。`,
      ),
      generate(rng) {
        const m = oneStepModel(rng);
        return inequalityProblem({
          prompt: t(`${m.text.en} Solve an inequality for $${m.variable}$.`, `${m.text["zh-CN"]}列出关于 $${m.variable}$ 的不等式并求解。`),
          variable: m.variable,
          op: m.op,
          value: m.value,
          wrong: m.wrong,
          solution: m.solution,
        });
      },
    },
    {
      id: "whole-number-answers",
      title: t("Whole-number answers", "整数答案"),
      explanation: t(
        `When the unknown counts objects, the answer must be a whole number, and the inequality tells which way to round: the solution set says which whole numbers are allowed, and we pick the greatest or the least of them.

With $20$ dollars and notebooks at $3$ dollars, $3n \\le 20$ gives $n \\le 6\\frac{2}{3}$. The whole numbers allowed are $6$ and below, so the greatest number is $6$: rounding up to $7$ would cost $21$. To pack at least $100$ eggs in boxes of $12$, $12b \\ge 100$ gives $b \\ge 8\\frac{1}{3}$, so the least number is $9$: $8$ boxes hold only $96$.

> **Watch out.** Do not round to the nearest whole number. A greatest number under a limit rounds **down**, even from $6\\frac{2}{3}$; a least number needed rounds **up**, even from $8\\frac{1}{3}$. Check the answer and the next whole number in the story.`,
        `当未知数表示物体个数时，答案必须是整数，而不等式决定向哪个方向取整：解集说明哪些整数被允许，我们从中取最大或最小的那个。

有 $20$ 元、笔记本每本 $3$ 元时，$3n \\le 20$ 得 $n \\le 6\\frac{2}{3}$。允许的整数是 $6$ 及以下，所以最多买 $6$ 本：买 $7$ 本要 $21$ 元。要用每盒 $12$ 个的盒子装至少 $100$ 个鸡蛋，$12b \\ge 100$ 得 $b \\ge 8\\frac{1}{3}$，所以至少需要 $9$ 盒：$8$ 盒只能装 $96$ 个。

> **注意。** 不要四舍五入。限制下的最大个数要**向下**取整，即使是 $6\\frac{2}{3}$；所需的最少个数要**向上**取整，即使是 $8\\frac{1}{3}$。在情境中检验答案和相邻的整数。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        let text: Text;
        let answer: number;
        let work: string;
        let greatest: boolean;
        let model: Text;
        let check: Text;
        if (kind === 0) {
          const p = rng.int(2, 9);
          const B = rng.int(15, 100);
          answer = Math.floor(B / p);
          greatest = true;
          work = `${p}n \\le ${B} \\;\\Rightarrow\\; n \\le ${num(Q.of(B, p))}`;
          text = t(
            `Notebooks cost $${p}$ dollars each and Sam has $${B}$ dollars. What is the greatest number of notebooks he can buy?`,
            `笔记本每本 $${p}$ 元，小山有 $${B}$ 元。他最多能买多少本笔记本？`,
          );
          model = t(
            `$n$ notebooks cost $${p}n$ dollars, which may be at most $${B}$. Divide by $${p}$:`,
            `$n$ 本笔记本要 $${p}n$ 元，不能超过 $${B}$ 元。两边除以 $${p}$：`,
          );
          check = t(
            `$${answer}$ notebooks cost $${p * answer}$ dollars, within $${B}$; $${answer + 1}$ would cost $${p * (answer + 1)}$, too much.`,
            `$${answer}$ 本要 $${p * answer}$ 元，没有超过 $${B}$ 元；$${answer + 1}$ 本要 $${p * (answer + 1)}$ 元，钱不够。`,
          );
        } else if (kind === 1) {
          const k = rng.pick([6, 10, 12, 18, 24, 30]);
          const N = rng.int(40, 400);
          answer = Math.ceil(N / k);
          greatest = false;
          work = `${k}b \\ge ${N} \\;\\Rightarrow\\; b \\ge ${num(Q.of(N, k))}`;
          text = t(
            `A farm packs eggs in boxes of $${k}$. What is the least number of boxes needed to pack at least $${N}$ eggs?`,
            `一个农场用每盒 $${k}$ 个的盒子装鸡蛋。要装至少 $${N}$ 个鸡蛋，至少需要多少盒？`,
          );
          model = t(
            `$b$ boxes hold $${k}b$ eggs, which must be at least $${N}$. Divide by $${k}$:`,
            `$b$ 盒能装 $${k}b$ 个鸡蛋，至少要 $${N}$ 个。两边除以 $${k}$：`,
          );
          check = t(
            `$${answer}$ boxes hold $${k * answer}$ eggs, enough for $${N}$; $${answer - 1}$ boxes hold only $${k * (answer - 1)}$.`,
            `$${answer}$ 盒能装 $${k * answer}$ 个，够装 $${N}$ 个；$${answer - 1}$ 盒只能装 $${k * (answer - 1)}$ 个。`,
          );
        } else if (kind === 2) {
          const k = rng.int(30, 60);
          const N = rng.int(80, 500);
          answer = Math.ceil(N / k);
          greatest = false;
          work = `${k}b \\ge ${N} \\;\\Rightarrow\\; b \\ge ${num(Q.of(N, k))}`;
          text = t(
            `Each bus holds $${k}$ students. What is the least number of buses needed to carry $${N}$ students?`,
            `每辆大巴能坐 $${k}$ 名学生。运送 $${N}$ 名学生至少需要多少辆大巴？`,
          );
          model = t(
            `$b$ buses hold $${k}b$ students, which must be at least $${N}$. Divide by $${k}$:`,
            `$b$ 辆大巴能坐 $${k}b$ 名学生，至少要 $${N}$ 名。两边除以 $${k}$：`,
          );
          check = t(
            `$${answer}$ buses hold $${k * answer}$ students, enough for $${N}$; $${answer - 1}$ buses hold only $${k * (answer - 1)}$.`,
            `$${answer}$ 辆大巴能坐 $${k * answer}$ 人，够坐 $${N}$ 人；$${answer - 1}$ 辆只能坐 $${k * (answer - 1)}$ 人。`,
          );
        } else {
          const w = rng.int(12, 40);
          const C = 10 * rng.int(30, 150);
          answer = Math.floor(C / w);
          greatest = true;
          work = `${w}n \\le ${C} \\;\\Rightarrow\\; n \\le ${num(Q.of(C, w))}`;
          text = t(
            `A lift can carry at most $${C}$ kg. Each crate weighs $${w}$ kg. What is the greatest number of crates it can carry at once?`,
            `一台升降机最多能载重 $${C}$ 千克，每个箱子重 $${w}$ 千克。它一次最多能运多少个箱子？`,
          );
          model = t(
            `$n$ crates weigh $${w}n$ kg, which may be at most $${C}$. Divide by $${w}$:`,
            `$n$ 个箱子重 $${w}n$ 千克，不能超过 $${C}$ 千克。两边除以 $${w}$：`,
          );
          check = t(
            `$${answer}$ crates weigh $${w * answer}$ kg, within $${C}$; $${answer + 1}$ would weigh $${w * (answer + 1)}$ kg, too much.`,
            `$${answer}$ 个箱子重 $${w * answer}$ 千克，没有超过 $${C}$ 千克；$${answer + 1}$ 个重 $${w * (answer + 1)}$ 千克，超载了。`,
          );
        }
        const exact = work.endsWith(` ${answer}`);
        const round = exact
          ? t(`The bound is already the whole number $${answer}$.`, `边界本身就是整数 $${answer}$。`)
          : greatest
            ? t(
                `Only whole numbers count, and they must be no greater than the bound, so round **down**: $${answer}$.`,
                `只有整数才有意义，而且不能大于这个边界，所以**向下**取整：$${answer}$。`,
              )
            : t(
                `Only whole numbers count, and they must be no less than the bound, so round **up**: $${answer}$.`,
                `只有整数才有意义，而且不能小于这个边界，所以**向上**取整：$${answer}$。`,
              );
        return numberProblem({
          prompt: text,
          answer,
          form: "integer",
          wrong: greatest ? [answer + 1] : [answer - 1],
          solution: t(
            `**Step 1: write and solve.** ${model.en}${steps(work)}**Step 2: a whole number.** ${round.en}\n\n**Check.** ${check.en}`,
            `**第一步：列式求解。** ${model["zh-CN"]}${steps(work)}**第二步：取整数。** ${round["zh-CN"]}\n\n**检验。** ${check["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

export const modelingWithTwoStepInequalities: TopicDef = {
  id: "modeling-with-two-step-inequalities",
  title: t("Modeling With Two-Step Inequalities", "用两步不等式建模"),
  summary: t(
    "Model situations with a fixed amount and a rate, and compare two plans, with inequalities.",
    "用不等式为含固定量和变化率的情境建模，并比较两种方案。",
  ),
  prerequisites: ["modeling-with-one-step-inequalities"],
  encompasses: [
    { topic: "modeling-with-one-step-inequalities", weight: 0.7 },
    { topic: "solving-multi-step-inequalities", weight: 0.5 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.7.EE.B.4.B"],
  intro: t(
    `You can already turn a one-step limit into an inequality: tickets at $8$ dollars each with $50$ dollars to spend give $8n \\le 50$. Most prices are not that simple. A phone plan may cost a fixed $20$ dollars a month plus $3$ dollars per gigabyte, so the bill for $g$ gigabytes is $20 + 3g$, and a budget of $35$ dollars gives

$$20 + 3g \\le 35$$

This is a two-step inequality, and you solve it the way you solve a two-step equation: first take away the fixed amount, $3g \\le 15$, then divide by the rate, $g \\le 5$. The only new rule is the one you know from inequalities: dividing by a negative rate, as with a battery that loses charge, reverses the symbol.

In this topic we model a fixed amount plus a rate, round the answer to the greatest or least whole number the story allows, and compare two plans by putting an inequality between their costs.`,
    `你已经会把一步的限制写成不等式：每张票 $8$ 元、可花 $50$ 元，得到 $8n \\le 50$。但大多数价格没有这么简单。一个手机套餐可能每月固定收 $20$ 元，另外每吉字节 $3$ 元，于是用 $g$ 吉字节的话费是 $20 + 3g$，预算 $35$ 元就给出

$$20 + 3g \\le 35$$

这是一个两步不等式，解法和两步方程一样：先去掉固定量，得 $3g \\le 15$，再除以变化率，得 $g \\le 5$。唯一的新规则你在不等式中已经学过：除以负的变化率时（比如电池电量不断下降），不等号要改变方向。

这个课题中，我们为"固定量加变化率"建模，按情境把答案取成允许的最大或最小整数，并在两种方案的费用之间写不等号来比较它们。`,
  ),
  knowledgePoints: [
    {
      id: "fixed-amount-and-rate",
      title: t("A fixed amount and a rate", "固定量加变化率"),
      explanation: t(
        `Many quantities are a fixed amount plus an amount per unit. A taxi that charges $5$ dollars plus $2$ dollars per kilometer costs $5 + 2d$ for $d$ km, because the $5$ is paid once and the $2$ is paid $d$ times. Spending at most $30$ dollars means

$$5 + 2d \\le 30 \\;\\Rightarrow\\; 2d \\le 25 \\;\\Rightarrow\\; d \\le 12.5$$

Undo the steps in reverse order, as for an equation: subtract the fixed amount first, because the rate multiplies only $d$; then divide by the rate. When the quantity **decreases** as the unknown grows, the rate is negative, and dividing by it reverses the symbol. Check with a value: at $d = 12$ the fare is $29$ dollars, within $30$; at $d = 13$ it is $31$.

> **Watch out.** Do not divide the whole limit by the rate, as in $d \\le 30 \\div 2$: the fixed amount must come off first, and it is subtracted, not added. When the rate is a loss, as in $90 - 5h \\ge 20$, dividing by $-5$ turns $\\ge$ into $\\le$; keeping $\\ge$ gives the wrong half of the line.`,
        `许多量是固定量加上单位量。起步价 $5$ 元、每千米 $2$ 元的出租车，行驶 $d$ 千米的费用是 $5 + 2d$，因为 $5$ 元只付一次，$2$ 元要付 $d$ 次。花费不超过 $30$ 元就是

$$5 + 2d \\le 30 \\;\\Rightarrow\\; 2d \\le 25 \\;\\Rightarrow\\; d \\le 12.5$$

和解方程一样，按相反的顺序还原：先减去固定量，因为变化率只乘 $d$；再除以变化率。当这个量随未知数增大而**减少**时，变化率是负数，除以它时不等号要改变方向。用一个值检验：$d = 12$ 时车费 $29$ 元，不超过 $30$ 元；$d = 13$ 时是 $31$ 元。

> **注意。** 不要直接用限额除以变化率，比如 $d \\le 30 \\div 2$：必须先去掉固定量，而且是减去它，不是加上它。当变化率表示减少时，比如 $90 - 5h \\ge 20$，除以 $-5$ 要把 $\\ge$ 变成 $\\le$；保留 $\\ge$ 会得到数轴上错误的那一半。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const f = rng.int(3, 9);
          const r = rng.int(2, 5);
          const B = f + rng.int(5, 30) * r + rng.int(0, r - 1);
          const v = Q.of(B - f, r);
          const n = Math.floor((B - f) / r);
          return inequalityProblem({
            prompt: t(
              `A taxi charges $${f}$ dollars plus $${r}$ dollars per kilometer. Ben can spend at most $${B}$ dollars. Let $d$ be a distance in kilometers that he can afford. Solve an inequality for $d$.`,
              `一辆出租车起步价 $${f}$ 元，另外每千米收费 $${r}$ 元。小本最多能花 $${B}$ 元。设 $d$ 为他负担得起的行驶距离（千米）。列出关于 $d$ 的不等式并求解。`,
            ),
            variable: "d",
            op: "<=",
            value: v,
            wrong: [
              [">=", v],
              ["<=", Q.of(B, r)],
              ["<=", Q.of(B + f, r)],
            ],
            solution: t(
              `**Step 1: Write the inequality.** The $${f}$ dollars are paid once and the $${r}$ dollars once per kilometer, so $d$ km cost $${f} + ${r}d$. "At most $${B}$" means this cost is $\\le ${B}$:${steps(`${f} + ${r}d \\le ${B}`)}**Step 2: Solve.** Subtract the fixed $${f}$ from both sides, then divide by $${r}$, which is positive, so the symbol stays:${steps(`${r}d \\le ${B - f}`, `d \\le ${num(v)}`)}**Check.** At $d = ${n}$ the fare is $${f} + ${r} \\cdot ${n} = ${f + r * n}$ dollars, within $${B}$; at $d = ${n + 1}$ it is $${f + r * (n + 1)}$ dollars, more than $${B}$.`,
              `**第一步：列不等式。** $${f}$ 元只付一次，$${r}$ 元每千米付一次，所以 $d$ 千米的费用是 $${f} + ${r}d$。"最多 $${B}$ 元"表示这个费用 $\\le ${B}$：${steps(`${f} + ${r}d \\le ${B}`)}**第二步：求解。** 两边减去固定的 $${f}$，再除以 $${r}$；$${r}$ 是正数，不等号方向不变：${steps(`${r}d \\le ${B - f}`, `d \\le ${num(v)}`)}**检验。** $d = ${n}$ 时车费是 $${f} + ${r} \\cdot ${n} = ${f + r * n}$ 元，不超过 $${B}$ 元；$d = ${n + 1}$ 时是 $${f + r * (n + 1)}$ 元，超过了 $${B}$ 元。`,
            ),
          });
        }
        if (kind === 1) {
          const P = rng.int(70, 100);
          const r = rng.int(4, 15);
          const L = rng.int(5, 30);
          const v = Q.of(P - L, r);
          const n = Math.floor((P - L) / r);
          const after = P - r * (n + 1);
          return inequalityProblem({
            prompt: t(
              `A phone battery is at $${P}\\%$ and loses $${r}$ percentage points of charge per hour. Let $h$ be a number of hours after which the charge is still at least $${L}\\%$. Solve an inequality for $h$.`,
              `一部手机的电量是 $${P}\\%$，每小时下降 $${r}$ 个百分点。设 $h$ 为经过的小时数，此时电量仍至少为 $${L}\\%$。列出关于 $h$ 的不等式并求解。`,
            ),
            variable: "h",
            op: "<=",
            value: v,
            wrong: [
              [">=", v],
              ["<=", Q.of(P + L, r)],
            ],
            solution: t(
              `**Step 1: Write the inequality.** The charge starts at $${P}$ and loses $${r}$ points each hour, so after $h$ hours it is $${P} - ${r}h$. "Still at least $${L}$" means:${steps(`${P} - ${r}h \\ge ${L}`)}**Step 2: Solve.** Subtract $${P}$ from both sides, then divide by $-${r}$. Dividing by a negative number reverses the symbol:${steps(`-${r}h \\ge ${L - P}`, `h \\le ${num(v)}`)}**Check.** After $${n}$ hours the charge is $${P} - ${r} \\cdot ${n} = ${P - r * n}\\%$, still at least $${L}\\%$; after $${n + 1}$ hours ${after >= 0 ? `it is $${after}\\%$, below $${L}\\%$` : "the battery is already empty"}. So the allowed times are the short ones, as $h \\le ${num(v)}$ says.`,
              `**第一步：列不等式。** 电量从 $${P}$ 开始，每小时减少 $${r}$ 个百分点，所以 $h$ 小时后是 $${P} - ${r}h$。"仍至少为 $${L}$"就是：${steps(`${P} - ${r}h \\ge ${L}`)}**第二步：求解。** 两边减去 $${P}$，再除以 $-${r}$。除以负数时不等号改变方向：${steps(`-${r}h \\ge ${L - P}`, `h \\le ${num(v)}`)}**检验。** $${n}$ 小时后电量是 $${P} - ${r} \\cdot ${n} = ${P - r * n}\\%$，仍不低于 $${L}\\%$；$${n + 1}$ 小时后${after >= 0 ? `是 $${after}\\%$，低于 $${L}\\%$` : "电池已经没电了"}。所以允许的是较短的时间，正如 $h \\le ${num(v)}$ 所说。`,
            ),
          });
        }
        const s = rng.int(0, 150);
        const r = rng.int(8, 40);
        const T = s + rng.int(3, 20) * r + rng.int(0, r - 1);
        const v = Q.of(T - s, r);
        const n = Math.ceil((T - s) / r);
        return inequalityProblem({
          prompt: t(
            `Lena has $${s}$ dollars and saves $${r}$ dollars a week. Let $w$ be a number of weeks after which she has at least $${T}$ dollars. Solve an inequality for $w$.`,
            `莉娜有 $${s}$ 元，每周存 $${r}$ 元。设 $w$ 为周数，此时她至少有 $${T}$ 元。列出关于 $w$ 的不等式并求解。`,
          ),
          variable: "w",
          op: ">=",
          value: v,
          wrong: [
            ["<=", v],
            [">=", Q.of(T, r)],
          ],
          solution: t(
            `**Step 1: Write the inequality.** She starts with $${s}$ dollars and adds $${r}$ each week, so after $w$ weeks she has $${s} + ${r}w$. "At least $${T}$" means:${steps(`${s} + ${r}w \\ge ${T}`)}**Step 2: Solve.** Subtract the $${s}$ she already has, then divide by $${r}$, which is positive, so the symbol stays:${steps(`${r}w \\ge ${T - s}`, `w \\ge ${num(v)}`)}**Check.** After $${n}$ weeks she has $${s} + ${r} \\cdot ${n} = ${s + r * n}$ dollars, at least $${T}$; after $${n - 1}$ weeks she has only $${s + r * (n - 1)}$.`,
            `**第一步：列不等式。** 她原有 $${s}$ 元，每周增加 $${r}$ 元，所以 $w$ 周后有 $${s} + ${r}w$ 元。"至少 $${T}$ 元"就是：${steps(`${s} + ${r}w \\ge ${T}`)}**第二步：求解。** 两边减去她原有的 $${s}$，再除以 $${r}$；$${r}$ 是正数，不等号方向不变：${steps(`${r}w \\ge ${T - s}`, `w \\ge ${num(v)}`)}**检验。** $${n}$ 周后她有 $${s} + ${r} \\cdot ${n} = ${s + r * n}$ 元，不少于 $${T}$ 元；$${n - 1}$ 周后只有 $${s + r * (n - 1)}$ 元。`,
          ),
        });
      },
    },
    {
      id: "greatest-or-least-whole-number",
      title: t("The greatest or least whole number", "最大或最小的整数"),
      explanation: t(
        `When the unknown counts whole things, such as guests, weeks or boxes, the solution of the inequality is usually not a whole number, and the question asks for the greatest or least whole number in it. Solve first, then round in the direction the inequality allows. A room costs $150$ dollars plus $18$ dollars per guest, with a budget of $500$ dollars:

$$150 + 18g \\le 500 \\;\\Rightarrow\\; 18g \\le 350 \\;\\Rightarrow\\; g \\le 19\\tfrac{4}{9}$$

The allowed values lie **below** $19\\frac49$, so the greatest whole number is found by rounding down: $19$ guests. Rounding up to $20$ would leave the allowed set: $150 + 18 \\cdot 20 = 510$, over budget. For "at least" ($\\ge$) the allowed values lie above, and you round up instead. Check both neighbors: the answer must work, and the next whole number past it must not.

> **Watch out.** Round by the inequality, not by the nearest whole number: $g \\le 19.8$ still means $19$, and $w \\ge 6.1$ still means $7$. Also keep the fixed amount in the inequality: $500 \\div 18$ ignores the $150$ and gives too many guests.`,
        `当未知数计数的是整体事物，比如客人、周数或箱子时，不等式的解通常不是整数，题目要的是其中最大或最小的整数。先求解，再按不等式允许的方向取整。场地费 $150$ 元、每位客人 $18$ 元、预算 $500$ 元：

$$150 + 18g \\le 500 \\;\\Rightarrow\\; 18g \\le 350 \\;\\Rightarrow\\; g \\le 19\\tfrac{4}{9}$$

允许的值在 $19\\frac49$ **以下**，所以最大的整数要向下取整：$19$ 位客人。向上取到 $20$ 就离开了允许的范围：$150 + 18 \\cdot 20 = 510$，超出预算。对于"至少"（$\\ge$），允许的值在上方，就要向上取整。检验两边的邻居：答案必须满足条件，越过它的下一个整数必须不满足。

> **注意。** 按不等式取整，而不是四舍五入：$g \\le 19.8$ 仍然是 $19$，$w \\ge 6.1$ 仍然是 $7$。还要把固定量留在不等式里：$500 \\div 18$ 忽略了那 $150$ 元，得到的客人数太多。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        let text: Text;
        let setup: Text;
        let line: string;
        let solved: string;
        let answer: number;
        let forgot: number;
        let greatest: boolean;
        let exact: boolean;
        let value: (k: number) => number;
        let unitWords: Text;
        if (kind === 0) {
          const f = 10 * rng.int(5, 20);
          const r = rng.int(12, 30);
          const B = f + rng.int(8, 40) * r + rng.int(0, r - 1);
          answer = Math.floor((B - f) / r);
          forgot = Math.floor(B / r);
          greatest = true;
          exact = (B - f) % r === 0;
          value = (k) => f + r * k;
          line = `${f} + ${r}g \\le ${B}`;
          solved = steps(`${r}g \\le ${B - f}`, `g \\le ${num(Q.of(B - f, r))}`);
          setup = t(
            `The room costs $${f}$ dollars once and $${r}$ dollars per guest, so $g$ guests cost $${f} + ${r}g$, which must be at most $${B}$:`,
            `场地费 $${f}$ 元只付一次，每位客人 $${r}$ 元，所以 $g$ 位客人的费用是 $${f} + ${r}g$，它不能超过 $${B}$：`,
          );
          unitWords = t(`guests cost`, `位客人的费用是`);
          text = t(
            `A party room costs $${f}$ dollars plus $${r}$ dollars per guest. The budget is $${B}$ dollars. What is the greatest number of guests that can be invited?`,
            `派对场地费 $${f}$ 元，另外每位客人 $${r}$ 元。预算是 $${B}$ 元。最多能邀请多少位客人？`,
          );
        } else if (kind === 1) {
          const s = rng.int(0, 120);
          const r = rng.int(15, 45);
          const T = s + rng.int(4, 20) * r + rng.int(1, r - 1);
          answer = Math.ceil((T - s) / r);
          forgot = Math.ceil(T / r);
          greatest = false;
          exact = false;
          value = (k) => s + r * k;
          line = `${s} + ${r}w \\ge ${T}`;
          solved = steps(`${r}w \\ge ${T - s}`, `w \\ge ${num(Q.of(T - s, r))}`);
          setup = t(
            `He starts with $${s}$ dollars and adds $${r}$ each week, so after $w$ weeks he has $${s} + ${r}w$, which must be at least $${T}$:`,
            `他原有 $${s}$ 元，每周增加 $${r}$ 元，所以 $w$ 周后有 $${s} + ${r}w$ 元，它至少要是 $${T}$：`,
          );
          unitWords = t(`weeks give`, `周后有`);
          text = t(
            `Omar has $${s}$ dollars and saves $${r}$ dollars each week. What is the least number of weeks until he has at least $${T}$ dollars?`,
            `奥马尔有 $${s}$ 元，每周存 $${r}$ 元。至少要多少周他才能有至少 $${T}$ 元？`,
          );
        } else {
          const w0 = rng.int(60, 90);
          const b = rng.int(15, 40);
          const C = w0 + rng.int(8, 40) * b + rng.int(0, b - 1);
          answer = Math.floor((C - w0) / b);
          forgot = Math.floor(C / b);
          greatest = true;
          exact = (C - w0) % b === 0;
          value = (k) => w0 + b * k;
          line = `${w0} + ${b}n \\le ${C}`;
          solved = steps(`${b}n \\le ${C - w0}`, `n \\le ${num(Q.of(C - w0, b))}`);
          setup = t(
            `The operator rides every trip and each box adds $${b}$ kg, so $n$ boxes make a load of $${w0} + ${b}n$ kg, which must be at most $${C}$:`,
            `操作员每趟都在电梯里，每个箱子增加 $${b}$ 千克，所以 $n$ 个箱子时总重是 $${w0} + ${b}n$ 千克，它不能超过 $${C}$：`,
          );
          unitWords = t(`boxes make`, `个箱子时总重是`);
          text = t(
            `A freight elevator can carry at most $${C}$ kg. The operator weighs $${w0}$ kg and each box weighs $${b}$ kg. What is the greatest number of boxes the operator can take in one trip?`,
            `一部货梯最多载重 $${C}$ 千克。操作员体重 $${w0}$ 千克，每个箱子重 $${b}$ 千克。操作员一次最多能运多少个箱子？`,
          );
        }
        const next = greatest ? answer + 1 : answer - 1;
        const round = exact
          ? t(
              `The bound is already the whole number $${answer}$, and it is allowed, so the answer is $${answer}$.`,
              `边界本身就是整数 $${answer}$，而且它是允许的，所以答案是 $${answer}$。`,
            )
          : greatest
            ? t(
                `The allowed values lie below the bound, so the greatest whole number is found by rounding down: $${answer}$.`,
                `允许的值在边界以下，所以最大的整数要向下取整：$${answer}$。`,
              )
            : t(
                `The allowed values lie above the bound, so the least whole number is found by rounding up: $${answer}$.`,
                `允许的值在边界以上，所以最小的整数要向上取整：$${answer}$。`,
              );
        const ok = greatest ? t("within", "不超过") : t("at least", "达到了");
        const fails = greatest ? t("too much", "超出了限制") : t("not enough", "还不够");
        return numberProblem({
          prompt: text,
          answer,
          form: "integer",
          wrong: [next, forgot],
          solution: t(
            `**Step 1: Write the inequality.** ${setup.en}${steps(line)}**Step 2: Solve.** Subtract the fixed amount, then divide by the positive rate, so the symbol stays:${solved}**Step 3: Round.** ${round.en}

**Check.** $${answer}$ ${unitWords.en} $${value(answer)}$, ${ok.en} the limit; $${next}$ ${unitWords.en} $${value(next)}$, ${fails.en}.`,
            `**第一步：列不等式。** ${setup["zh-CN"]}${steps(line)}**第二步：求解。** 减去固定量，再除以正的变化率，不等号方向不变：${solved}**第三步：取整。** ${round["zh-CN"]}

**检验。** $${answer}$ ${unitWords["zh-CN"]} $${value(answer)}$，${ok["zh-CN"]}限制；$${next}$ ${unitWords["zh-CN"]} $${value(next)}$，${fails["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "comparing-two-plans",
      title: t("Comparing two plans", "比较两种方案"),
      explanation: t(
        `To find when one plan is cheaper than another, write the cost of each for the same unknown and put an inequality between them. Gym A charges $60$ dollars plus $4$ dollars per visit, gym B $10$ dollars per visit. A is cheaper when its cost is the smaller one:

$$60 + 4n < 10n \\;\\Rightarrow\\; 60 < 6n \\;\\Rightarrow\\; n > 10$$

Collect the unknown on the side with the larger rate, so its coefficient stays positive. The fee makes A dearer at first, but each visit saves $6$ dollars, and after $10$ visits the savings have paid the fee. At exactly $10$ visits both cost $100$ dollars, which is equal, not cheaper, so the least whole number of visits for which A is cheaper is $11$: A costs $104$, B costs $110$.

> **Watch out.** The break-even value, where the costs are equal, is not the answer to "costs less": the inequality is strict, so step one whole number past it. And step the right way: "A cheaper" for the plan with the fee means more units ($n > 10$), "B cheaper" means fewer ($n < 10$).`,
        `要判断一种方案何时比另一种便宜，先用同一个未知数写出两者的费用，再在它们之间写不等号。健身房 A 收 $60$ 元会费、每次 $4$ 元，健身房 B 每次 $10$ 元。A 更便宜就是它的费用更小：

$$60 + 4n < 10n \\;\\Rightarrow\\; 60 < 6n \\;\\Rightarrow\\; n > 10$$

把未知数集中到变化率较大的一边，系数就保持为正。会费让 A 一开始更贵，但每次能省 $6$ 元，$10$ 次后省下的钱正好抵掉会费。恰好 $10$ 次时两者都是 $100$ 元，是相等而不是更便宜，所以使 A 更便宜的最少次数是 $11$：A 花 $104$ 元，B 花 $110$ 元。

> **注意。** 两种费用相等的那个"平衡点"不是"更便宜"的答案：不等式是严格的，要越过它一个整数。方向也要走对：对收会费的方案，"A 更便宜"意味着次数更多（$n > 10$），"B 更便宜"意味着次数更少（$n < 10$）。`,
      ),
      generate(rng) {
        const rA = rng.int(2, 8);
        const rB = rA + rng.int(2, 7);
        const d = rB - rA;
        const f = rng.bool(0.4) ? d * rng.int(3, 15) : rng.int(2 * d, 15 * d);
        const context = rng.pick([
          {
            a: t(`Gym A charges a $${f}$-dollar fee plus $${rA}$ dollars per visit`, `健身房 A 收 $${f}$ 元会费，另外每次 $${rA}$ 元`),
            b: t(`gym B charges $${rB}$ dollars per visit`, `健身房 B 每次收费 $${rB}$ 元`),
            unit: t("visits", "次数"),
            A: t("gym A", "健身房 A"),
            B: t("gym B", "健身房 B"),
          },
          {
            a: t(`Car rental A costs $${f}$ dollars plus $${rA}$ dollars per hour`, `租车公司 A 收 $${f}$ 元，另外每小时 $${rA}$ 元`),
            b: t(`rental B costs $${rB}$ dollars per hour`, `租车公司 B 每小时收费 $${rB}$ 元`),
            unit: t("hours", "小时数"),
            A: t("rental A", "公司 A"),
            B: t("rental B", "公司 B"),
          },
        ]);
        const cheapA = rng.bool();
        const q = Q.of(f, d);
        const answer = cheapA ? Math.floor(f / d) + 1 : Math.ceil(f / d) - 1;
        const other = cheapA ? answer - 1 : answer + 1;
        const work = cheapA
          ? steps(`${f} + ${rA}n < ${rB}n`, `${f} < ${d}n`, `n > ${num(q)}`)
          : steps(`${rB}n < ${f} + ${rA}n`, `${d}n < ${f}`, `n < ${num(q)}`);
        const winner = cheapA ? context.A : context.B;
        const costs = (n: number): Text =>
          t(
            `At $n = ${n}$, ${context.A.en} costs $${f} + ${rA} \\cdot ${n} = ${f + rA * n}$ and ${context.B.en} costs $${rB} \\cdot ${n} = ${rB * n}$`,
            `$n = ${n}$ 时，${context.A["zh-CN"]} 的费用是 $${f} + ${rA} \\cdot ${n} = ${f + rA * n}$，${context.B["zh-CN"]} 是 $${rB} \\cdot ${n} = ${rB * n}$`,
          );
        const upper = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
        const tie = f + rA * other === rB * other;
        return numberProblem({
          prompt: t(
            `${context.a.en}; ${context.b.en}. What is the ${cheapA ? "least" : "greatest"} whole number of ${context.unit.en} for which ${winner.en} costs less?`,
            `${context.a["zh-CN"]}；${context.b["zh-CN"]}。使${winner["zh-CN"]} 更便宜的${context.unit["zh-CN"]}${cheapA ? "最少" : "最多"}是多少？`,
          ),
          answer,
          form: "integer",
          wrong: [cheapA ? Math.ceil(f / d) : Math.floor(f / d), cheapA ? answer - 1 : answer + 1],
          solution: t(
            `**Step 1: Write both costs.** For $n$ ${context.unit.en}, ${context.A.en} costs $${f} + ${rA}n$ and ${context.B.en} costs $${rB}n$. ${cheapA ? `${upper(context.A.en)} costs less when $${f} + ${rA}n < ${rB}n$` : `${upper(context.B.en)} costs less when $${rB}n < ${f} + ${rA}n$`}.

**Step 2: Solve.** Subtract $${rA}n$ from both sides, which keeps the coefficient of $n$ positive, then divide by $${d}$:${work}**Step 3: Pick the whole number.** ${q.isInteger() ? `At exactly $${num(q)}$ the costs are equal, which is not cheaper, so step past it. ` : ""}The ${cheapA ? "least whole number above" : "greatest whole number below"} $${num(q)}$ is $${answer}$.

**Check.** ${costs(answer).en}, so ${winner.en} is cheaper. ${costs(other).en}, so ${tie ? "they cost the same" : `${winner.en} is not cheaper`}.`,
            `**第一步：写出两种费用。** ${context.unit["zh-CN"]}为 $n$ 时，${context.A["zh-CN"]} 的费用是 $${f} + ${rA}n$，${context.B["zh-CN"]} 是 $${rB}n$。${cheapA ? `${context.A["zh-CN"]} 更便宜就是 $${f} + ${rA}n < ${rB}n$` : `${context.B["zh-CN"]} 更便宜就是 $${rB}n < ${f} + ${rA}n$`}。

**第二步：求解。** 两边减去 $${rA}n$，使 $n$ 的系数保持为正，再除以 $${d}$：${work}**第三步：取整数。** ${q.isInteger() ? `恰好为 $${num(q)}$ 时两者费用相等，并不更便宜，所以要越过它。` : ""}${cheapA ? "大于" : "小于"} $${num(q)}$ 的${cheapA ? "最小" : "最大"}整数是 $${answer}$。

**检验。** ${costs(answer)["zh-CN"]}，所以${winner["zh-CN"]} 更便宜；${costs(other)["zh-CN"]}，所以${tie ? "两者费用相同" : `${winner["zh-CN"]} 并不更便宜`}。`,
          ),
        });
      },
    },
  ],
};

export const modelingWithCompoundInequalities: TopicDef = {
  id: "modeling-with-compound-inequalities",
  title: t("Modeling With Compound Inequalities", "用复合不等式建模"),
  summary: t(
    "Model quantities that must stay within a range, and solve the double inequalities that result.",
    "为必须保持在某个范围内的量建模，并解所得的连不等式。",
  ),
  prerequisites: ["modeling-with-two-step-inequalities", "solving-compound-inequalities"],
  encompasses: [
    { topic: "modeling-with-two-step-inequalities", weight: 0.5 },
    { topic: "solving-compound-inequalities", weight: 0.7 },
    { topic: "introduction-to-modeling-with-inequalities", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.HSA.CED.A.3"],
  intro: t(
    `You can solve a double inequality such as $3 \\le 2x + 1 < 9$ by doing the same step to all three parts, and you can model a fixed amount plus a rate, such as a bill of $60 + 45h$ dollars for $h$ hours of work. This topic joins the two. Many limits come in pairs: a bill was at least $150$ and at most $285$ dollars, a liquid must be kept between two temperatures, a mean score should land between $80$ and $90$. The quantity is trapped in a range, so the model is a double inequality with the expression in the middle:

$$150 \\le 60 + 45h \\le 285$$

Solving it on all three parts at once, $90 \\le 45h \\le 225$ and then $2 \\le h \\le 5$, answers the real question: the job took from $2$ to $5$ hours.

The words decide each end separately: "at least" and "at most" include the limit, "more than" and "less than" exclude it. In this topic we model costs and amounts within a range, put formulas in the middle of a double inequality, and count the whole numbers a range allows.`,
    `你已经会解 $3 \\le 2x + 1 < 9$ 这样的连不等式：对三部分做同样的运算；也会为"固定量加变化率"建模，比如工作 $h$ 小时的账单是 $60 + 45h$ 元。这个课题把两者结合起来。很多限制是成对出现的：账单不少于 $150$ 元且不超过 $285$ 元，一种液体必须保存在两个温度之间，平均分应落在 $80$ 到 $90$ 之间。这个量被夹在一个范围内，所以模型是一个把表达式放在中间的连不等式：

$$150 \\le 60 + 45h \\le 285$$

对三部分同时求解，先得 $90 \\le 45h \\le 225$，再得 $2 \\le h \\le 5$，就回答了实际问题：这项工作用了 $2$ 到 $5$ 小时。

两端由文字分别决定："不少于""不超过"包含界限，"多于""少于"不包含界限。这个课题中，我们为在某个范围内的费用和数量建模，把公式放在连不等式的中间，并数出一个范围允许的整数个数。`,
  ),
  knowledgePoints: [
    {
      id: "ranges-from-linear-models",
      title: t("A cost within a range", "费用在某个范围内"),
      explanation: t(
        `When a total must lie between two bounds, write a double inequality with the total in the middle and the bounds on the outside, then solve it on all three parts. Each step keeps the three parts in the same order, because subtracting the same number, or dividing by the same positive number, does not change which is larger. A plumber charges $60$ dollars plus $45$ dollars per hour, and the bill is at least $150$ and at most $285$ dollars:

$$150 \\le 60 + 45h \\le 285 \\;\\Rightarrow\\; 90 \\le 45h \\le 225 \\;\\Rightarrow\\; 2 \\le h \\le 5$$

Check the ends: $2$ hours cost $150$ and $5$ hours cost $285$, exactly the two limits, which "at least" and "at most" allow. When the quantity decreases, such as a candle burning down, the coefficient is negative: dividing by it reverses **both** symbols, and you then rewrite the result with the smaller number first.

> **Watch out.** Read each end's symbol from its own words: "more than" gives $<$ on the left, "at most" gives $\\le$ on the right; swapping strict and non-strict ends gives the wrong brackets. Subtract the fixed amount before dividing: dividing the limits straight by the rate ignores it. And with a decreasing quantity, both symbols reverse, so the end that came from "at least" moves to the other side.`,
        `当总量必须介于两个界限之间时，把总量放在中间、界限放在两边，写成连不等式，再对三部分同时求解。每一步都保持三部分的大小顺序不变，因为减去同一个数或除以同一个正数，不会改变谁大谁小。水管工收 $60$ 元上门费，另外每小时 $45$ 元，账单不少于 $150$ 元且不超过 $285$ 元：

$$150 \\le 60 + 45h \\le 285 \\;\\Rightarrow\\; 90 \\le 45h \\le 225 \\;\\Rightarrow\\; 2 \\le h \\le 5$$

检验两端：$2$ 小时的费用是 $150$ 元，$5$ 小时是 $285$ 元，正好是两个界限，"不少于"和"不超过"都允许取到。当量在减少时（如蜡烛燃烧变短），系数为负：除以它时**两个**不等号都要改变方向，然后把结果改写成小数在前的形式。

> **注意。** 每一端的符号要按它自己的文字来定："多于"在左边给出 $<$，"不超过"在右边给出 $\\le$；把严格与不严格弄反，括号就错了。先减去固定量再相除：直接用变化率去除界限就忽略了固定量。对于减少的量，两个不等号都改变方向，所以来自"不少于"的那一端会换到另一边。`,
      ),
      generate(rng) {
        const lc = rng.bool();
        const hc = rng.bool();
        const kind = rng.int(0, 2);
        if (kind < 2) {
          const variable = kind === 0 ? "h" : "d";
          const f = kind === 0 ? 5 * rng.int(8, 16) : rng.int(3, 9);
          const r = kind === 0 ? 5 * rng.int(5, 12) : rng.int(2, 4);
          const p = kind === 0 ? rng.int(1, 4) : rng.int(3, 10);
          const q = p + (kind === 0 ? rng.int(1, 5) : rng.int(2, 12));
          const L = f + r * p;
          const H = f + r * q;
          const words = between(lc, hc, L, H);
          const set = union(span(p, lc, q, hc));
          const text =
            kind === 0
              ? t(
                  `A plumber charges $${f}$ dollars for a visit plus $${r}$ dollars per hour. A bill was ${words.en} dollars. Let $h$ be the number of hours worked.`,
                  `一名水管工上门费 $${f}$ 元，另外每小时收费 $${r}$ 元。一张账单${words["zh-CN"]}元。设 $h$ 为工作的小时数。`,
                )
              : t(
                  `A taxi charges $${f}$ dollars plus $${r}$ dollars per kilometer. A fare was ${words.en} dollars. Let $d$ be the distance in kilometers.`,
                  `一辆出租车起步价 $${f}$ 元，另外每千米收费 $${r}$ 元。一次车费${words["zh-CN"]}元。设 $d$ 为行驶的距离（千米）。`,
                );
          const o1 = lc ? "\\le" : "<";
          const o2 = hc ? "\\le" : "<";
          const total = `${f} + ${r}${variable}`;
          return intervalProblem({
            prompt: ask(text.en, text["zh-CN"], asInequality(variable)),
            set,
            form: "inequality",
            variable,
            wrong: [union(span(p, !lc, q, !hc)), union(span(Q.of(L, r), lc, Q.of(H, r), hc))],
            solution: t(
              `**Step 1: Write the double inequality.** The total is $${total}$: the fixed $${f}$ plus $${r}$ for each unit. It must be ${words.en}, so it goes in the middle, with $${o1}$ on the left ("${lc ? "at least" : "more than"}") and $${o2}$ on the right ("${hc ? "at most" : "less than"}"):${steps(`${L} ${o1} ${total} ${o2} ${H}`)}**Step 2: Solve on all three parts.** Subtract $${f}$ from each part, then divide each part by $${r}$, which is positive, so both symbols stay:${steps(`${L - f} ${o1} ${r}${variable} ${o2} ${H - f}`, inequalityLatexOf(set, variable))}${
                rangeEnds(variable, [
                  { x: p, expr: `${f} + ${r} \\cdot ${p}`, value: L, included: lc },
                  { x: q, expr: `${f} + ${r} \\cdot ${q}`, value: H, included: hc },
                ]).en
              }`,
              `**第一步：列连不等式。** 总费用是 $${total}$：固定的 $${f}$ 元加上每单位 $${r}$ 元。它${words["zh-CN"]}，所以放在中间，左边用 $${o1}$（"${lc ? "不少于" : "多于"}"），右边用 $${o2}$（"${hc ? "不超过" : "少于"}"）：${steps(`${L} ${o1} ${total} ${o2} ${H}`)}**第二步：对三部分同时求解。** 每部分减去 $${f}$，再每部分除以 $${r}$；$${r}$ 是正数，两个不等号方向都不变：${steps(`${L - f} ${o1} ${r}${variable} ${o2} ${H - f}`, inequalityLatexOf(set, variable))}${
                rangeEnds(variable, [
                  { x: p, expr: `${f} + ${r} \\cdot ${p}`, value: L, included: lc },
                  { x: q, expr: `${f} + ${r} \\cdot ${q}`, value: H, included: hc },
                ])["zh-CN"]
              }`,
            ),
          });
        }
        const r = rng.int(1, 4);
        const p = rng.int(1, 4);
        const q = p + rng.int(1, 5);
        const H0 = r * q + rng.int(3, 20);
        const U = H0 - r * p;
        const L = H0 - r * q;
        const words = between(lc, hc, L, U);
        // height ≥ L ⟺ t ≤ q, height ≤ U ⟺ t ≥ p
        const set = union(span(p, hc, q, lc));
        const o1 = lc ? "\\le" : "<";
        const o2 = hc ? "\\le" : "<";
        const height = poly([H0, ""], [-r, "t"]);
        const text = t(
          `A candle is $${H0}$ cm tall and burns down $${r}$ cm per hour. Let $t$ be a time, in hours after it is lit, at which its height is ${words.en} cm.`,
          `一支蜡烛高 $${H0}$ 厘米，每小时燃烧变短 $${r}$ 厘米。设 $t$ 为点燃后的时间（小时），此时蜡烛的高度${words["zh-CN"]}厘米。`,
        );
        const ends = rangeEnds("t", [
          { x: p, expr: `${H0} - ${r} \\cdot ${p}`, value: U, included: hc },
          { x: q, expr: `${H0} - ${r} \\cdot ${q}`, value: L, included: lc },
        ]);
        return intervalProblem({
          prompt: ask(text.en, text["zh-CN"], asInequality("t")),
          set,
          form: "inequality",
          variable: "t",
          wrong: [union(span(p, lc, q, hc)), union(span(p, !hc, q, !lc))],
          solution: t(
            `**Step 1: Write the double inequality.** The candle starts at $${H0}$ cm and loses $${r}$ cm each hour, so after $t$ hours its height is $${height}$. The height goes in the middle:${steps(`${L} ${o1} ${height} ${o2} ${U}`)}**Step 2: Subtract $${H0}$ from all three parts.**${steps(`${L - H0} ${o1} ${poly([-r, "t"])} ${o2} ${U - H0}`)}**Step 3: Divide by $-${r}$.** Dividing by a negative number reverses both symbols. Then rewrite the result with the smaller number first:${steps(`${q} ${lc ? "\\ge" : ">"} t ${hc ? "\\ge" : ">"} ${p}`, inequalityLatexOf(set, "t"))}The early end, $t = ${p}$, comes from the upper limit on the height, because the candle is tallest at the start.

${ends.en}`,
            `**第一步：列连不等式。** 蜡烛开始时高 $${H0}$ 厘米，每小时变短 $${r}$ 厘米，所以 $t$ 小时后高度是 $${height}$。把高度放在中间：${steps(`${L} ${o1} ${height} ${o2} ${U}`)}**第二步：三部分同时减去 $${H0}$。**${steps(`${L - H0} ${o1} ${poly([-r, "t"])} ${o2} ${U - H0}`)}**第三步：除以 $-${r}$。** 除以负数时两个不等号都改变方向，然后把结果改写成小数在前的形式：${steps(`${q} ${lc ? "\\ge" : ">"} t ${hc ? "\\ge" : ">"} ${p}`, inequalityLatexOf(set, "t"))}较早的一端 $t = ${p}$ 来自高度的上限，因为蜡烛刚开始时最高。

${ends["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "ranges-from-formulas",
      title: t("Ranges from formulas", "由公式求范围"),
      explanation: t(
        `A formula links two quantities, so a range for one of them gives a range for the other. Put the formula in the middle of the double inequality, with the given range on the outside, and undo the formula's steps on all three parts in reverse order. With $F = \\frac{9}{5}C + 32$, temperatures from $50$ °F to $86$ °F inclusive give

$$50 \\le \\tfrac{9}{5}C + 32 \\le 86 \\;\\Rightarrow\\; 18 \\le \\tfrac{9}{5}C \\le 54 \\;\\Rightarrow\\; 10 \\le C \\le 30$$

The formula first multiplies by $\\frac{9}{5}$ and then adds $32$, so we first subtract $32$ and then multiply by $\\frac{5}{9}$. Check an end: $\\frac{9}{5} \\cdot 10 + 32 = 50$. The same plan works for a perimeter $2l + 2w$ or a mean $\\frac{a + b + s}{3}$.

> **Watch out.** Undo the formula in the right order: multiplying $50$ and $86$ by $\\frac{5}{9}$ before taking away the $32$ gives wrong bounds. Use the whole formula: a perimeter counts the width twice, so subtract $2w$, not $w$. And a range for the mean is not a range for the new score; solve for $s$.`,
        `公式把两个量联系起来，所以其中一个量的范围决定另一个量的范围。把公式放在连不等式的中间，已知范围放在两边，再按相反的顺序，对三部分同时还原公式的各步运算。由 $F = \\frac{9}{5}C + 32$，$50$°F 到 $86$°F（含）的温度给出

$$50 \\le \\tfrac{9}{5}C + 32 \\le 86 \\;\\Rightarrow\\; 18 \\le \\tfrac{9}{5}C \\le 54 \\;\\Rightarrow\\; 10 \\le C \\le 30$$

公式先乘以 $\\frac{9}{5}$ 再加 $32$，所以我们先减去 $32$，再乘以 $\\frac{5}{9}$。检验一端：$\\frac{9}{5} \\cdot 10 + 32 = 50$。同样的方法也适用于周长 $2l + 2w$ 或平均数 $\\frac{a + b + s}{3}$。

> **注意。** 还原的顺序要对：先把 $50$ 和 $86$ 乘以 $\\frac{5}{9}$ 再去掉 $32$，界限就错了。要用完整的公式：周长里宽算了两次，所以要减去 $2w$，而不是 $w$。平均分的范围也不是新成绩的范围，要解出 $s$。`,
      ),
      generate(rng) {
        const lc = rng.bool();
        const hc = rng.bool();
        const o1 = lc ? "\\le" : "<";
        const o2 = hc ? "\\le" : "<";
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const p = 5 * rng.int(-6, 6);
          const q = p + 5 * rng.int(1, 6);
          const L = (9 * p) / 5 + 32;
          const H = (9 * q) / 5 + 32;
          const set = union(span(p, lc, q, hc));
          const words = between(lc, hc, L, H);
          const at = (c: number) => `\\tfrac{9}{5} \\cdot ${c < 0 ? `(${c})` : c} + 32`;
          const ends = rangeEnds("C", [
            { x: p, expr: at(p), value: L, included: lc },
            { x: q, expr: at(q), value: H, included: hc },
          ]);
          return intervalProblem({
            prompt: ask(
              `The formula $F = \\frac{9}{5}C + 32$ converts degrees Celsius $C$ to degrees Fahrenheit $F$. A liquid must be kept at ${words.en} °F. What temperatures $C$ in degrees Celsius is that?`,
              `公式 $F = \\frac{9}{5}C + 32$ 把摄氏温度 $C$ 换算成华氏温度 $F$。一种液体必须保存在${words["zh-CN"]}°F 的温度下。这相当于哪些摄氏温度 $C$？`,
              asInequality("C"),
            ),
            set,
            form: "inequality",
            variable: "C",
            wrong: [union(span(p, !lc, q, !hc)), union(span(Q.of(5 * L, 9), lc, Q.of(5 * H, 9), hc))],
            solution: t(
              `**Step 1: Put the formula in the middle.** The temperature in °F is $\\tfrac{9}{5}C + 32$, and it must be ${words.en}:${steps(`${L} ${o1} \\tfrac{9}{5}C + 32 ${o2} ${H}`)}**Step 2: Undo the formula in reverse order.** The formula adds $32$ last, so subtract $32$ from all three parts first; then multiply all three parts by $\\frac{5}{9}$, which is positive, so the symbols stay:${steps(`${L - 32} ${o1} \\tfrac{9}{5}C ${o2} ${H - 32}`, inequalityLatexOf(set, "C"))}${ends.en}`,
              `**第一步：把公式放在中间。** 华氏温度是 $\\tfrac{9}{5}C + 32$，它${words["zh-CN"]}：${steps(`${L} ${o1} \\tfrac{9}{5}C + 32 ${o2} ${H}`)}**第二步：按相反的顺序还原公式。** 公式最后一步是加 $32$，所以先从三部分减去 $32$；再把三部分都乘以 $\\frac{5}{9}$，它是正数，不等号方向不变：${steps(`${L - 32} ${o1} \\tfrac{9}{5}C ${o2} ${H - 32}`, inequalityLatexOf(set, "C"))}${ends["zh-CN"]}`,
            ),
          });
        }
        if (kind === 1) {
          const w = rng.int(3, 15);
          const p = rng.int(4, 15);
          const q = p + rng.int(2, 12);
          const L = 2 * p + 2 * w;
          const H = 2 * q + 2 * w;
          const set = union(span(p, lc, q, hc));
          const words = between(lc, hc, L, H);
          const ends = rangeEnds("l", [
            { x: p, expr: `2 \\cdot ${p} + ${2 * w}`, value: L, included: lc },
            { x: q, expr: `2 \\cdot ${q} + ${2 * w}`, value: H, included: hc },
          ]);
          return intervalProblem({
            prompt: ask(
              `A rectangle is $${w}$ cm wide, and its perimeter is ${words.en} cm. Let $l$ be its length in centimeters.`,
              `一个长方形宽 $${w}$ 厘米，周长${words["zh-CN"]}厘米。设 $l$ 为它的长（厘米）。`,
              asInequality("l"),
            ),
            set,
            form: "inequality",
            variable: "l",
            wrong: [union(span(p, !lc, q, !hc)), union(span(Q.of(L - w, 2), lc, Q.of(H - w, 2), hc))],
            solution: t(
              `**Step 1: Put the formula in the middle.** The perimeter counts two lengths and two widths: $2l + 2 \\cdot ${w} = 2l + ${2 * w}$. It must be ${words.en}:${steps(`${L} ${o1} 2l + ${2 * w} ${o2} ${H}`)}**Step 2: Solve on all three parts.** Subtract $${2 * w}$ from each part, then divide each part by $2$:${steps(`${L - 2 * w} ${o1} 2l ${o2} ${H - 2 * w}`, inequalityLatexOf(set, "l"))}${ends.en}`,
              `**第一步：把公式放在中间。** 周长包括两条长和两条宽：$2l + 2 \\cdot ${w} = 2l + ${2 * w}$。它${words["zh-CN"]}：${steps(`${L} ${o1} 2l + ${2 * w} ${o2} ${H}`)}**第二步：对三部分同时求解。** 每部分减去 $${2 * w}$，再每部分除以 $2$：${steps(`${L - 2 * w} ${o1} 2l ${o2} ${H - 2 * w}`, inequalityLatexOf(set, "l"))}${ends["zh-CN"]}`,
            ),
          });
        }
        const a = rng.int(70, 95);
        const b = rng.int(70, 95);
        const lo = rng.pick([70, 75, 80]);
        const hi = lo + 10;
        const s0 = 3 * lo - a - b;
        const s1 = 3 * hi - a - b;
        const set = union(span(s0, lc, s1, hc));
        const words = between(lc, hc, lo, hi);
        const ends = rangeEnds("s", [
          { x: s0, expr: `\\frac{${a} + ${b} + ${s0}}{3}`, value: lo, included: lc },
          { x: s1, expr: `\\frac{${a} + ${b} + ${s1}}{3}`, value: hi, included: hc },
        ]);
        return intervalProblem({
          prompt: ask(
            `Yuki scored $${a}$ and $${b}$ on two tests. She wants the mean of these and a third test score $s$ to be ${words.en}.`,
            `由纪两次测验得了 $${a}$ 分和 $${b}$ 分。她希望这两次和第三次测验成绩 $s$ 的平均分${words["zh-CN"]}。`,
            asInequality("s"),
          ),
          set,
          form: "inequality",
          variable: "s",
          wrong: [union(span(s0, !lc, s1, !hc)), union(span(lo, lc, hi, hc))],
          solution: t(
            `**Step 1: Put the mean in the middle.** The mean of the three scores is $\\frac{${a} + ${b} + s}{3}$, and it must be ${words.en}:${steps(`${lo} ${o1} \\frac{${a} + ${b} + s}{3} ${o2} ${hi}`)}**Step 2: Solve on all three parts.** Multiply each part by $3$ to clear the fraction, then subtract $${a + b}$ from each part:${steps(`${3 * lo} ${o1} ${a + b} + s ${o2} ${3 * hi}`, inequalityLatexOf(set, "s"))}${ends.en}`,
            `**第一步：把平均数放在中间。** 三次成绩的平均分是 $\\frac{${a} + ${b} + s}{3}$，它${words["zh-CN"]}：${steps(`${lo} ${o1} \\frac{${a} + ${b} + s}{3} ${o2} ${hi}`)}**第二步：对三部分同时求解。** 每部分乘以 $3$ 去掉分母，再每部分减去 $${a + b}$：${steps(`${3 * lo} ${o1} ${a + b} + s ${o2} ${3 * hi}`, inequalityLatexOf(set, "s"))}${ends["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "counting-whole-number-solutions",
      title: t("Counting whole-number solutions", "数整数解的个数"),
      explanation: t(
        `When the unknown counts things, solve the double inequality, then find the least and the greatest whole number in the solution set and count from one to the other. The lower bound is rounded **up** and the upper bound **down**, because only whole numbers inside the range count. If $5\\frac{1}{2} \\le n \\le 11\\frac{1}{4}$, the least whole number is $6$ and the greatest is $11$.

Counting from $6$ to $11$ gives $6, 7, 8, 9, 10, 11$: that is $11 - 6 + 1 = 6$ numbers. The difference $11 - 6 = 5$ counts the gaps between neighbors, and there is always one more number than gaps, just as a fence with $5$ gaps has $6$ posts.

> **Watch out.** The count of whole numbers from $m$ to $M$ is $M - m + 1$, not $M - m$; and do not add a number that lies outside the range. Round the bounds inward, up at the bottom and down at the top, before you count.`,
        `当未知数表示个数时，先解出连不等式，再找出解集中最小和最大的整数，从一个数到另一个数。下界要向**上**取整，上界要向**下**取整，因为只有范围内的整数才算。若 $5\\frac{1}{2} \\le n \\le 11\\frac{1}{4}$，最小的整数是 $6$，最大的是 $11$。

从 $6$ 数到 $11$：$6, 7, 8, 9, 10, 11$，共 $11 - 6 + 1 = 6$ 个。差 $11 - 6 = 5$ 数的是相邻两数之间的间隔，而数总比间隔多一个，就像有 $5$ 段的栅栏有 $6$ 根柱子。

> **注意。** 从 $m$ 到 $M$ 的整数个数是 $M - m + 1$，不是 $M - m$；也不要多算一个范围外的数。数之前先把界限向内取整：下界向上，上界向下。`,
      ),
      generate(rng) {
        const f = 50 * rng.int(2, 8);
        const r = 5 * rng.int(4, 9);
        const lo = rng.int(10, 30);
        const hi = lo + rng.int(2, 12);
        const L = f + r * lo - rng.int(0, r - 1);
        const H = f + r * hi + rng.int(0, r - 1);
        const count = hi - lo + 1;
        const low = Q.of(L - f, r);
        const high = Q.of(H - f, r);
        return numberProblem({
          prompt: t(
            `A banquet hall charges $${f}$ dollars plus $${r}$ dollars per guest. The organizers want to spend at least $${L}$ and at most $${H}$ dollars. How many different numbers of guests are possible?`,
            `一个宴会厅收场地费 $${f}$ 元，另外每位客人 $${r}$ 元。组织者希望花费不少于 $${L}$ 元且不超过 $${H}$ 元。客人人数有多少种可能？`,
          ),
          answer: count,
          form: "integer",
          wrong: [count - 1, count + 1],
          solution: t(
            `**Step 1: Write and solve the double inequality.** With $n$ guests the cost is $${f} + ${r}n$, which lies from $${L}$ to $${H}$. Subtract $${f}$ from all three parts, then divide by $${r}$:${steps(`${L} \\le ${f} + ${r}n \\le ${H}`, `${L - f} \\le ${r}n \\le ${H - f}`, `${num(low)} \\le n \\le ${num(high)}`)}**Step 2: Find the whole numbers at the ends.** ${low.isInteger() ? `The lower bound $${lo}$ is a whole number and is included` : `Rounding the lower bound up gives $${lo}$`}; ${high.isInteger() ? `the upper bound $${hi}$ is a whole number and is included` : `rounding the upper bound down gives $${hi}$`}.

**Step 3: Count.** There are $${hi} - ${lo} + 1 = ${count}$ whole numbers from $${lo}$ to $${hi}$.

**Check.** $${lo}$ guests cost $${f + r * lo}$, at least $${L}$, but $${lo - 1}$ cost only $${f + r * (lo - 1)}$; $${hi}$ guests cost $${f + r * hi}$, at most $${H}$, but $${hi + 1}$ cost $${f + r * (hi + 1)}$.`,
            `**第一步：列出并解连不等式。** 有 $n$ 位客人时费用是 $${f} + ${r}n$，它在 $${L}$ 到 $${H}$ 之间。三部分同时减去 $${f}$，再除以 $${r}$：${steps(`${L} \\le ${f} + ${r}n \\le ${H}`, `${L - f} \\le ${r}n \\le ${H - f}`, `${num(low)} \\le n \\le ${num(high)}`)}**第二步：找出两端的整数。** ${low.isInteger() ? `下界 $${lo}$ 本身是整数，并且包含在内` : `下界向上取整得 $${lo}$`}；${high.isInteger() ? `上界 $${hi}$ 本身是整数，并且包含在内` : `上界向下取整得 $${hi}$`}。

**第三步：计数。** 从 $${lo}$ 到 $${hi}$ 的整数共有 $${hi} - ${lo} + 1 = ${count}$ 个。

**检验。** $${lo}$ 位客人花费 $${f + r * lo}$ 元，不少于 $${L}$ 元，而 $${lo - 1}$ 位只花 $${f + r * (lo - 1)}$ 元；$${hi}$ 位客人花费 $${f + r * hi}$ 元，不超过 $${H}$ 元，而 $${hi + 1}$ 位要花 $${f + r * (hi + 1)}$ 元。`,
          ),
        });
      },
    },
  ],
};

/**
 * rangeEnds writes the check of a modeled range: at each end of the answer the model takes one of the limits, and
 * the words of the problem decide whether that limit, and so that end, is allowed.
 */
function rangeEnds(variable: string, ends: readonly { x: number; expr: string; value: number; included: boolean }[]): Text {
  const en = ends.map(
    (e) =>
      `at $${variable} = ${e.x}$ the model gives $${e.expr} = ${e.value}$, a limit that is ${e.included ? "allowed, so the end is included" : "not allowed, so the end is excluded"}`,
  );
  const zh = ends.map(
    (e) =>
      `$${variable} = ${e.x}$ 时模型给出 $${e.expr} = ${e.value}$，这个界限${e.included ? "允许取到，所以端点包含在内" : "不允许取到，所以端点不包含在内"}`,
  );
  return t(`**Check.** ${en.join("; ").replace(/^at/, "At")}.`, `**检验。** ${zh.join("；")}。`);
}

/** plusMinus lists (center ± root) / scale in simplest form; one value when root is 0. */
function plusMinus(center: Q, root: Surd, scale: Q = Q.one): string[] {
  if (root.m === 1n) {
    if (root.a.isZero()) return [num(center.div(scale))];
    return [num(center.add(root.a).div(scale)), num(center.sub(root.a).div(scale))];
  }
  return [Q.one, Q.one.neg()].map((s) => surdLatex(surd(center.div(scale), root.b.mul(s).div(scale), root.m)));
}

/** coprimeFraction draws p/q in lowest terms with 1 ≤ p ≤ maxP and 2 ≤ q ≤ maxQ. */
function coprimeFraction(rng: Rng, maxP: number, maxQ: number): Q {
  const q = rng.int(2, maxQ);
  const candidates = Array.from({ length: maxP }, (_, i) => i + 1).filter((p) => Q.of(p, q).d === BigInt(q));
  return Q.of(rng.pick(candidates), q);
}

/** isolated writes a·u + b = c for an expression u, with a and b omitted when they are 1 and 0. */
function isolated(a: number, u: string, b: number, c: Coefficient): string {
  const lhs = `${a === 1 ? "" : a === -1 ? "-" : a}${u}`;
  return `${b === 0 ? lhs : `${lhs} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`} = ${num(c)}`;
}

/** isolatingWork shows a·u + b = c ⇒ u = k. */
function isolatingWork(a: number, u: string, b: number, c: Q): string[] {
  const k = c.sub(Q.of(b)).div(Q.of(a));
  const out = [isolated(a, u, b, c)];
  if (b !== 0 && a !== 1) out.push(isolated(a, u, 0, c.sub(Q.of(b))));
  if (b !== 0 || a !== 1) out.push(`${u} = ${num(k)}`);
  return out;
}

const noRealSquare = t("No real number has a negative square, so there is no real solution.", "任何实数的平方都不是负数，所以没有实数解。");

export const solvingEquationsWithSquareRoots: TopicDef = {
  id: "solving-equations-with-square-roots",
  title: t("Solving Equations Using the Square Root Method", "用平方根法解方程"),
  summary: t(
    "Solve equations such as $x^{2} = k$ and $(x - a)^{2} = k$ by taking square roots, with two, one or no real solutions.",
    "用开平方解 $x^{2} = k$、$(x - a)^{2} = k$ 等方程，解可能有两个、一个或没有实数解。",
  ),
  prerequisites: ["simplifying-square-roots", "two-step-equations"],
  encompasses: [{ topic: "square-roots-and-cube-roots", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.8.EE.A.2", "CCSS.HSA.REI.B.4.B"],
  intro: t(
    `You know that $\\sqrt{49} = 7$ because $7^{2} = 49$, and you can simplify a root such as $\\sqrt{50} = 5\\sqrt{2}$. You can also solve two-step equations by undoing operations in reverse order. Square roots let you undo one more operation: **squaring**. A square tile with an area of $50$ cm² has a side $s$ with $s^{2} = 50$, so $s = \\sqrt{50} = 5\\sqrt{2} \\approx 7.07$ cm.

An equation asks for **every** number that works, and squaring hides a sign. Both $7^{2}$ and $(-7)^{2}$ equal $49$, so $x^{2} = 49$ has two solutions, $x = 7$ and $x = -7$, written $x = \\pm 7$. A length cannot be negative, which is why the tile had only one side length, but the equation alone allows both.

The method is always the same: get the square alone on one side, take the square root of both sides with $\\pm$, then finish any linear step that is left. In this topic we solve $x^{2} = k$, isolate the square first, leave irrational answers in simplest radical form, and solve $(x - a)^{2} = k$. Along the way we see when there are two solutions, one, or none.`,
    `你知道 $\\sqrt{49} = 7$，因为 $7^{2} = 49$；也会把 $\\sqrt{50}$ 化简为 $5\\sqrt{2}$。你还会按相反的顺序还原运算来解两步方程。平方根让你能还原另一种运算：**平方**。面积为 $50$ 平方厘米的正方形瓷砖，边长 $s$ 满足 $s^{2} = 50$，所以 $s = \\sqrt{50} = 5\\sqrt{2} \\approx 7.07$ 厘米。

方程要求的是**所有**满足条件的数，而平方会把符号藏起来。$7^{2}$ 和 $(-7)^{2}$ 都等于 $49$，所以 $x^{2} = 49$ 有两个解：$x = 7$ 和 $x = -7$，记作 $x = \\pm 7$。长度不能是负数，所以瓷砖只有一个边长；但只看方程，两个值都可以。

方法总是一样的：先让平方项单独在一边，再对两边开平方并加上 $\\pm$，最后完成剩下的一次方程的步骤。这个课题中，我们解 $x^{2} = k$，先分离平方项，把无理数解写成最简根式，并解 $(x - a)^{2} = k$。在这个过程中，我们会看到什么时候有两个解、一个解或没有解。`,
  ),
  knowledgePoints: [
    {
      id: "square-equals-a-number",
      title: t("Solving $x^{2} = k$", "解 $x^{2} = k$"),
      explanation: t(
        `The equation $x^{2} = 25$ asks for the numbers whose square is $25$. One is $5$, but a negative times a negative is positive, so $(-5)^{2} = 25$ as well. The equation therefore has **two** solutions: $x = \\pm\\sqrt{25} = \\pm 5$. The symbol $\\sqrt{25}$ means only the positive root, $5$, so taking the square root of both sides of an equation always needs the $\\pm$ to bring back the negative one.

How many solutions there are depends on the sign of $k$:

- $x^{2} = k$ with $k > 0$: two solutions, $x = \\pm\\sqrt{k}$.
- $x^{2} = 0$: one solution, $x = 0$, because every other number has a positive square.
- $x^{2} = k$ with $k < 0$: no real solution, since no real number has a negative square.

> **Watch out.** Do not stop at the positive root: $x^{2} = 25$ means $x = 5$ **or** $x = -5$. Squaring is not doubling, so $x^{2} = 36$ does not give $x = 18$. And $x^{2} = -9$ has no real solution: $3$ and $-3$ both square to $+9$, not $-9$.`,
        `方程 $x^{2} = 25$ 问的是：哪些数的平方是 $25$？一个是 $5$，但负数乘负数得正数，所以 $(-5)^{2} = 25$ 也成立。因此方程有**两个**解：$x = \\pm\\sqrt{25} = \\pm 5$。符号 $\\sqrt{25}$ 只表示正的那个根 $5$，所以对方程两边开平方时，一定要加上 $\\pm$，把负根找回来。

解的个数取决于 $k$ 的符号：

- $x^{2} = k$ 且 $k > 0$：两个解，$x = \\pm\\sqrt{k}$。
- $x^{2} = 0$：一个解，$x = 0$，因为其他任何数的平方都是正数。
- $x^{2} = k$ 且 $k < 0$：没有实数解，因为实数的平方不会是负数。

> **注意。** 不要只写正根：$x^{2} = 25$ 的意思是 $x = 5$ **或** $x = -5$。平方不是乘以 $2$，所以 $x^{2} = 36$ 不会得到 $x = 18$。而 $x^{2} = -9$ 没有实数解：$3$ 和 $-3$ 的平方都是 $+9$，不是 $-9$。`,
      ),
      keyPrerequisites: ["square-roots-and-cube-roots"],
      generate(rng) {
        const kind = rng.pick(["integer", "integer", "integer", "fraction", "fraction", "zero", "negative", "negative"] as const);
        const r = kind === "fraction" ? coprimeFraction(rng, 9, 9) : Q.of(kind === "zero" ? 0 : rng.int(1, 15));
        const k = kind === "negative" ? r.mul(r).neg() : r.mul(r);
        const values = kind === "negative" ? [] : plusMinus(Q.zero, surd(r));
        return solutionsProblem({
          prompt: ask(`Solve $x^{2} = ${num(k)}$.`, `解方程 $x^{2} = ${num(k)}$。`, listRealSolutions),
          values,
          wrong:
            kind === "negative" ? [[num(r), num(r.neg())], [num(r.neg())]] : kind === "zero" ? [[]] : [[num(r)], [num(k.div(Q.of(2)))]],
          solution:
            kind === "negative"
              ? t(
                  `**Step 1: Look at the sign.** The square of a real number is never negative: a positive times a positive is positive, a negative times a negative is positive, and $0^{2} = 0$. Here the square would have to be $${num(k)}$, which is negative.

**Step 2: Conclude.** ${noRealSquare.en} Even $\\pm ${num(r)}$ fail: $${squareOf(r)} = ${num(k.neg())}$ and $${squareOf(r.neg())} = ${num(k.neg())}$, not $${num(k)}$.`,
                  `**第一步：看符号。** 实数的平方不会是负数：正数乘正数得正数，负数乘负数也得正数，而 $0^{2} = 0$。这里平方要等于 $${num(k)}$，是负数。

**第二步：下结论。** ${noRealSquare["zh-CN"]}就连 $\\pm ${num(r)}$ 也不行：$${squareOf(r)} = ${num(k.neg())}$，$${squareOf(r.neg())} = ${num(k.neg())}$，都不是 $${num(k)}$。`,
                )
              : kind === "zero"
                ? t(
                    `**Step 1: Think about which numbers square to $0$.** A positive number has a positive square, and so does a negative number. Only $0$ itself is left.

**Step 2: Conclude.** So there is exactly one solution, $x = 0$.

**Check.** $0^{2} = 0 \\cdot 0 = 0$.`,
                    `**第一步：想一想哪些数的平方是 $0$。** 正数的平方是正数，负数的平方也是正数，只剩下 $0$ 本身。

**第二步：下结论。** 所以只有一个解：$x = 0$。

**检验。** $0^{2} = 0 \\cdot 0 = 0$。`,
                  )
                : t(
                    `**Step 1: Take the square root of both sides, with $\\pm$.** The square is already alone. Both $${num(r)}$ and its opposite square to $${num(k)}$, so:${steps(`x = \\pm\\sqrt{${num(k)}} = \\pm ${num(r)}`)}**Check.** Squaring either value gives $${num(k)}$:${steps(`${squareOf(r)} = ${squareOf(r.neg())} = ${num(k)}`)}`,
                    `**第一步：两边开平方，加上 $\\pm$。** 平方项已经单独在一边。$${num(r)}$ 和它的相反数的平方都是 $${num(k)}$，所以：${steps(`x = \\pm\\sqrt{${num(k)}} = \\pm ${num(r)}`)}**检验。** 两个值的平方都是 $${num(k)}$：${steps(`${squareOf(r)} = ${squareOf(r.neg())} = ${num(k)}`)}`,
                  ),
        });
      },
    },
    {
      id: "isolating-the-square",
      title: t("Isolating the square first", "先分离平方项"),
      explanation: t(
        `Taking a square root undoes squaring, and nothing else. If the equation has other terms, the square must first be alone on one side. Isolate $x^{2}$ as in a two-step equation, undoing the other operations in reverse order, then take square roots:

$$3x^{2} - 7 = 41 \\;\\Rightarrow\\; 3x^{2} = 48 \\;\\Rightarrow\\; x^{2} = 16 \\;\\Rightarrow\\; x = \\pm 4$$

Check: $3 \\cdot 4^{2} - 7 = 48 - 7 = 41$, and $(-4)^{2}$ is also $16$, so $-4$ works too. If $x^{2}$ turns out to equal a negative number, there is no real solution; this can happen when the coefficient of $x^{2}$ is negative.

> **Watch out.** Finish isolating before taking the root: after $3x^{2} = 48$ you must still divide by $3$; taking $\\pm\\sqrt{48}$ there skips that step. Keep both roots, $\\pm 4$, not just $4$. And look at the sign of the number $x^{2}$ equals: $x^{2} = -16$ has no real solution, not $\\pm 4$.`,
        `开平方只能还原平方这一种运算。如果方程中还有其他项，必须先让平方项单独在一边。像解两步方程那样，按相反的顺序还原其他运算，分离出 $x^{2}$，再开平方：

$$3x^{2} - 7 = 41 \\;\\Rightarrow\\; 3x^{2} = 48 \\;\\Rightarrow\\; x^{2} = 16 \\;\\Rightarrow\\; x = \\pm 4$$

检验：$3 \\cdot 4^{2} - 7 = 48 - 7 = 41$，而 $(-4)^{2}$ 也是 $16$，所以 $-4$ 也成立。如果最后 $x^{2}$ 等于负数，就没有实数解；当 $x^{2}$ 的系数为负数时就可能出现这种情况。

> **注意。** 先分离完再开平方：得到 $3x^{2} = 48$ 后还要除以 $3$；在这里就写 $\\pm\\sqrt{48}$ 是跳过了这一步。两个根 $\\pm 4$ 都要保留，不能只写 $4$。还要看 $x^{2}$ 等于的数的符号：$x^{2} = -16$ 没有实数解，而不是 $\\pm 4$。`,
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5, -2, -3, -1]);
        const b = rng.nonZero(-30, 30);
        const negative = rng.bool(0.2);
        const r = rng.int(1, 10);
        const k = negative ? -r * r : r * r;
        const c = Q.of(a * k + b);
        const values = negative ? [] : [String(r), String(-r)];
        const raw = c.sub(Q.of(b));
        const how = isolateWords(a, b) ?? t("", "");
        const work = steps(...isolatingWork(a, "x^{2}", b, c));
        return solutionsProblem({
          prompt: ask(`Solve $${isolated(a, "x^{2}", b, c)}$.`, `解方程 $${isolated(a, "x^{2}", b, c)}$。`, listRealSolutions),
          values,
          wrong: [
            negative ? [String(r), String(-r)] : [String(r)],
            ...(raw.sign() > 0 && a !== 1 ? [plusMinus(Q.zero, sqrtSurd(raw))] : []),
          ],
          solution: negative
            ? t(
                `**Step 1: Isolate $x^{2}$.** Undo the other operations in reverse order: ${how.en}:${work}**Step 2: Look at the sign.** The square $x^{2}$ would have to equal $${k}$, a negative number. ${noRealSquare.en}`,
                `**第一步：分离 $x^{2}$。** 按相反的顺序还原其他运算：${how["zh-CN"]}：${work}**第二步：看符号。** $x^{2}$ 要等于负数 $${k}$。${noRealSquare["zh-CN"]}`,
              )
            : t(
                `**Step 1: Isolate $x^{2}$.** Undo the other operations in reverse order: ${how.en}:${work}**Step 2: Take square roots, with $\\pm$.** Both $${r}$ and $-${r}$ square to $${k}$, so $x = \\pm ${r}$.

**Check.** $${scaledSquare(a, `${r}^{2}`, r * r, b)} = ${c}$, and $(-${r})^{2} = ${k}$ as well, so $x = -${r}$ gives the same value.`,
                `**第一步：分离 $x^{2}$。** 按相反的顺序还原其他运算：${how["zh-CN"]}：${work}**第二步：开平方，加上 $\\pm$。** $${r}$ 和 $-${r}$ 的平方都是 $${k}$，所以 $x = \\pm ${r}$。

**检验。** $${scaledSquare(a, `${r}^{2}`, r * r, b)} = ${c}$；$(-${r})^{2}$ 也等于 $${k}$，所以 $x = -${r}$ 得到同样的值。`,
              ),
        });
      },
    },
    {
      id: "irrational-solutions",
      title: t("Irrational solutions", "无理数解"),
      explanation: t(
        `When $k$ is not a perfect square, $\\sqrt{k}$ is irrational: its decimal never ends or repeats. Leave the solutions as exact square roots in simplest radical form, which means taking out the largest square factor, since $\\sqrt{a^{2}b} = a\\sqrt{b}$:

$$2x^{2} + 1 = 25 \\;\\Rightarrow\\; x^{2} = 12 \\;\\Rightarrow\\; x = \\pm\\sqrt{12} = \\pm\\sqrt{4 \\cdot 3} = \\pm 2\\sqrt{3}$$

Check: $(2\\sqrt{3})^{2} = 4 \\cdot 3 = 12$. A decimal such as $\\pm 3.46$ is only an approximation, so it is not an exact solution.

> **Watch out.** Keep the $\\pm$: $2\\sqrt{3}$ alone misses $-2\\sqrt{3}$. When you simplify, the square factor comes out as its root and the rest stays inside: $\\sqrt{12} = 2\\sqrt{3}$, not $3\\sqrt{2}$, which is $\\sqrt{18}$.`,
        `当 $k$ 不是完全平方数时，$\\sqrt{k}$ 是无理数：它的小数既不终止也不循环。把解写成精确的最简根式，也就是把最大的平方因数提出来，因为 $\\sqrt{a^{2}b} = a\\sqrt{b}$：

$$2x^{2} + 1 = 25 \\;\\Rightarrow\\; x^{2} = 12 \\;\\Rightarrow\\; x = \\pm\\sqrt{12} = \\pm\\sqrt{4 \\cdot 3} = \\pm 2\\sqrt{3}$$

检验：$(2\\sqrt{3})^{2} = 4 \\cdot 3 = 12$。像 $\\pm 3.46$ 这样的小数只是近似值，不是精确解。

> **注意。** 要保留 $\\pm$：只写 $2\\sqrt{3}$ 会漏掉 $-2\\sqrt{3}$。化简时，平方因数开方后移到根号外，其余的留在根号内：$\\sqrt{12} = 2\\sqrt{3}$，而不是 $3\\sqrt{2}$，后者等于 $\\sqrt{18}$。`,
      ),
      keyPrerequisites: ["simplifying-square-roots"],
      generate(rng) {
        const m = rng.pick(squareFree);
        const s = rng.int(1, 5);
        const k = s * s * m;
        const a = rng.bool(0.4) ? 1 : rng.pick([2, 3, 4, -2, -1]);
        const b = a === 1 && rng.bool(0.5) ? 0 : rng.nonZero(-20, 20);
        const c = Q.of(a * k + b);
        const root = surd(Q.zero, Q.of(s), BigInt(m));
        const values = plusMinus(Q.zero, root);
        const simplified = s === 1 ? `\\pm\\sqrt{${m}}` : `\\pm\\sqrt{${k}} = \\pm\\sqrt{${s * s} \\cdot ${m}} = \\pm ${surdLatex(root)}`;
        const how = isolateWords(a, b);
        const work = steps(...isolatingWork(a, "x^{2}", b, c));
        const first = how
          ? t(
              `**Step 1: Isolate $x^{2}$.** Undo the other operations in reverse order: ${how.en}:${work}`,
              `**第一步：分离 $x^{2}$。** 按相反的顺序还原其他运算：${how["zh-CN"]}：${work}`,
            )
          : t(
              `**Step 1: Isolate $x^{2}$.** The square is already alone:${work}`,
              `**第一步：分离 $x^{2}$。** 平方项已经单独在一边：${work}`,
            );
        const reason =
          s === 1
            ? t(
                `$${m}$ has no square factor other than $1$, so $\\sqrt{${m}}$ is already in simplest form`,
                `$${m}$ 除 $1$ 外没有平方因数，所以 $\\sqrt{${m}}$ 已经是最简形式`,
              )
            : t(
                `the largest square factor of $${k}$ is $${s * s}$, and its root $${s}$ comes out of the radical`,
                `$${k}$ 的最大平方因数是 $${s * s}$，它的平方根 $${s}$ 移到根号外`,
              );
        const square =
          s === 1 ? `\\left(\\sqrt{${m}}\\right)^{2} = ${m}` : `\\left(${surdLatex(root)}\\right)^{2} = ${s}^{2} \\cdot ${m} = ${k}`;
        return solutionsProblem({
          prompt: ask(`Solve $${isolated(a, "x^{2}", b, c)}$.`, `解方程 $${isolated(a, "x^{2}", b, c)}$。`, listRealSolutions),
          values,
          wrong: [
            [surdLatex(root)],
            ...(s > 1 && isSquareFreeInt(s) && s !== m ? [plusMinus(Q.zero, surd(Q.zero, Q.of(m), BigInt(s)))] : []),
          ],
          solution: t(
            `${first.en}**Step 2: Take square roots, with $\\pm$, and simplify.** Here ${reason.en}:${steps(`x = ${simplified}`)}**Check.** $${square}$, and the negative root has the same square, so both values give $x^{2} = ${k}$.`,
            `${first["zh-CN"]}**第二步：开平方，加上 $\\pm$，再化简。** 这里${reason["zh-CN"]}：${steps(`x = ${simplified}`)}**检验。** $${square}$；负根的平方与它相同，所以两个值都使 $x^{2} = ${k}$。`,
          ),
        });
      },
    },
    {
      id: "squared-binomials",
      title: t("Solving $(x - a)^{2} = k$", "解 $(x - a)^{2} = k$"),
      explanation: t(
        `In $(x - 3)^{2} = 20$ the thing being squared is $x - 3$, not $x$. Treat the whole expression in parentheses as the unknown: whatever $x - 3$ is, its square is $20$, so $x - 3$ is $\\sqrt{20}$ or $-\\sqrt{20}$. Then solve the two linear equations:

$$(x - 3)^{2} = 20 \\;\\Rightarrow\\; x - 3 = \\pm 2\\sqrt{5} \\;\\Rightarrow\\; x = 3 \\pm 2\\sqrt{5}$$

$$(2x + 1)^{2} = 9 \\;\\Rightarrow\\; 2x + 1 = \\pm 3 \\;\\Rightarrow\\; x = 1 \\text{ or } x = -2$$

Check the second: $2 \\cdot 1 + 1 = 3$ and $2 \\cdot (-2) + 1 = -3$, and both square to $9$. As before, isolate the square first if there are other terms. If the square equals $0$ there is one solution; if it equals a negative number there is none.

> **Watch out.** Undo the inside with the opposite operation: $x - 3 = \\pm 2\\sqrt{5}$ gives $x = 3 \\pm 2\\sqrt{5}$, not $-3 \\pm 2\\sqrt{5}$. Keep both signs of the root, which give two different values of $x$. And a negative square, as in $(x - 3)^{2} = -4$, has no real solution: do not solve $(x - 3)^{2} = 4$ instead.`,
        `在 $(x - 3)^{2} = 20$ 中，被平方的是 $x - 3$，而不是 $x$。把括号里的整个式子看作未知数：不论 $x - 3$ 是多少，它的平方都是 $20$，所以 $x - 3$ 等于 $\\sqrt{20}$ 或 $-\\sqrt{20}$。然后解两个一次方程：

$$(x - 3)^{2} = 20 \\;\\Rightarrow\\; x - 3 = \\pm 2\\sqrt{5} \\;\\Rightarrow\\; x = 3 \\pm 2\\sqrt{5}$$

$$(2x + 1)^{2} = 9 \\;\\Rightarrow\\; 2x + 1 = \\pm 3 \\;\\Rightarrow\\; x = 1 \\text{ 或 } x = -2$$

检验第二个：$2 \\cdot 1 + 1 = 3$，$2 \\cdot (-2) + 1 = -3$，它们的平方都是 $9$。和前面一样，如果还有其他项，先分离出平方项。如果平方等于 $0$，只有一个解；如果等于负数，则没有实数解。

> **注意。** 用相反的运算还原括号内的式子：由 $x - 3 = \\pm 2\\sqrt{5}$ 得 $x = 3 \\pm 2\\sqrt{5}$，而不是 $-3 \\pm 2\\sqrt{5}$。根的两个符号都要保留，它们给出 $x$ 的两个不同的值。平方等于负数时，比如 $(x - 3)^{2} = -4$，没有实数解：不要把它当成 $(x - 3)^{2} = 4$ 来解。`,
      ),
      generate(rng) {
        const b = rng.bool(0.3) ? rng.int(2, 3) : 1;
        let c = rng.nonZero(-9, 9);
        if (b > 1 && c % b === 0) c += 1;
        const kind = rng.pick(["square", "square", "irrational", "irrational", "zero", "negative"] as const);
        const k =
          kind === "square"
            ? Q.of(rng.int(1, 10) ** 2)
            : kind === "irrational"
              ? Q.of(rng.int(1, 3) ** 2 * rng.pick(squareFree))
              : kind === "zero"
                ? Q.zero
                : Q.of(-rng.int(1, 30));
        const outer = rng.bool(0.3) ? rng.pick([2, 3, -2]) : 1;
        const d = outer === 1 && rng.bool() ? 0 : rng.nonZero(-15, 15);
        const e = k.mul(Q.of(outer)).add(Q.of(d));
        const u = `\\left(${linear(b, c)}\\right)^{2}`;
        const center = Q.of(-c);
        const values = kind === "negative" ? [] : plusMinus(center, sqrtSurd(k), Q.of(b));
        const absRoot = sqrtSurd(k.abs());
        const inside = linear(b, c);
        const how = isolateWords(outer, d);
        const work = steps(...isolatingWork(outer, u, d, e));
        const first = how
          ? t(
              `**Step 1: Isolate the square.** Undo the operations outside the parentheses in reverse order: ${how.en}:${work}`,
              `**第一步：分离平方项。** 按相反的顺序还原括号外的运算：${how["zh-CN"]}：${work}`,
            )
          : t(
              `**Step 1: Isolate the square.** The square is already alone:${work}`,
              `**第一步：分离平方项。** 平方项已经单独在一边：${work}`,
            );
        const undo = t(
          `${c > 0 ? `subtract $${c}$ from` : `add $${-c}$ to`} both sides${b === 1 ? "" : `, then divide by $${b}$`}`,
          `两边${c > 0 ? `减去 $${c}$` : `加上 $${-c}$`}${b === 1 ? "" : `，再除以 $${b}$`}`,
        );
        const R = kind === "negative" ? "" : surdLatex(sqrtSurd(k));
        const outside = (v: string): string =>
          how ? `, so the left side is $${scaledSquare(outer, `${v}^{2}`, Number(k.n), d)} = ${num(e)}$` : "";
        const outsideZh = (v: string): string =>
          how ? `，所以左边是 $${scaledSquare(outer, `${v}^{2}`, Number(k.n), d)} = ${num(e)}$` : "";
        let rest: Text;
        if (kind === "negative") {
          rest = t(
            `**Step 2: Look at the sign.** The square of $${inside}$ would have to equal $${num(k)}$, a negative number. ${noRealSquare.en}`,
            `**第二步：看符号。** $${inside}$ 的平方要等于负数 $${num(k)}$。${noRealSquare["zh-CN"]}`,
          );
        } else if (kind === "zero") {
          const v = Q.of(-c, b);
          rest = t(
            `**Step 2: Take square roots.** Only $0$ squares to $0$, so the inside must be $0$:${steps(`${inside} = 0`)}**Step 3: Solve the linear equation.** To undo the inside, ${undo.en}: $x = ${values[0]}$. There is only one solution.

**Check.** $${linearAt(b, c, v)}$, and $0^{2} = 0$${outside("0")}.`,
            `**第二步：开平方。** 只有 $0$ 的平方是 $0$，所以括号内必须等于 $0$：${steps(`${inside} = 0`)}**第三步：解一次方程。** 还原括号内的运算：${undo["zh-CN"]}，得 $x = ${values[0]}$。只有一个解。

**检验。** $${linearAt(b, c, v)}$，而 $0^{2} = 0$${outsideZh("0")}。`,
          );
        } else {
          const lines = [`${inside} = ${R}`, `${inside} = -${R}`];
          const check =
            kind === "square"
              ? (() => {
                  const root = Q.of(Math.round(Math.sqrt(Number(k.n))));
                  const v0 = root.sub(Q.of(c)).div(Q.of(b));
                  const v1 = root.neg().sub(Q.of(c)).div(Q.of(b));
                  return t(
                    `**Check.** $${linearAt(b, c, v0)}$ and $${linearAt(b, c, v1)}$; both square to $${num(k)}$${outside(`(\\pm ${R})`)}.`,
                    `**检验。** $${linearAt(b, c, v0)}$，$${linearAt(b, c, v1)}$；它们的平方都是 $${num(k)}$${outsideZh(`(\\pm ${R})`)}。`,
                  );
                })()
              : (() => {
                  const sr = sqrtSurd(k);
                  const coef = num(sr.b);
                  const sq =
                    coef === "1"
                      ? `\\left(\\sqrt{${sr.m}}\\right)^{2} = ${num(k)}`
                      : `\\left(${R}\\right)^{2} = ${coef}^{2} \\cdot ${sr.m} = ${num(k)}`;
                  return t(
                    `**Check.** Each value makes $${inside} = \\pm ${R}$, and $${sq}$; the negative root has the same square${outside(`(\\pm ${R})`)}.`,
                    `**检验。** 每个值都使 $${inside} = \\pm ${R}$，而 $${sq}$；负根的平方与它相同${outsideZh(`(\\pm ${R})`)}。`,
                  );
                })();
          rest = t(
            `**Step 2: Take square roots, with $\\pm$.** The inside, $${inside}$, has square $${num(k)}$, so it is $${R}$ or $-${R}$:${steps(lines.join(" \\quad \\text{or} \\quad "))}**Step 3: Solve both linear equations.** To undo the inside, ${undo.en}:${steps(`x = ${values.join(" \\quad \\text{or} \\quad x = ")}`)}${check.en}`,
            `**第二步：开平方，加上 $\\pm$。** 括号内的 $${inside}$ 的平方是 $${num(k)}$，所以它等于 $${R}$ 或 $-${R}$：${steps(lines.join(" \\quad \\text{或} \\quad "))}**第三步：解两个一次方程。** 还原括号内的运算：${undo["zh-CN"]}：${steps(`x = ${values.join(" \\quad \\text{或} \\quad x = ")}`)}${check["zh-CN"]}`,
          );
        }
        return solutionsProblem({
          prompt: ask(`Solve $${isolated(outer, u, d, e)}$.`, `解方程 $${isolated(outer, u, d, e)}$。`, listRealSolutions),
          values,
          wrong:
            kind === "negative"
              ? [plusMinus(center, absRoot, Q.of(b))]
              : [plusMinus(center.neg(), absRoot, Q.of(b)), [plusMinus(center, absRoot, Q.of(b))[0]!]],
          solution: t(`${first.en}${rest.en}`, `${first["zh-CN"]}${rest["zh-CN"]}`),
        });
      },
    },
  ],
};

/** squareOf writes v² for a rational v, with parentheses around a negative number or a fraction. */
function squareOf(v: Q): string {
  return v.isInteger() && v.sign() >= 0 ? `${num(v)}^{2}` : `\\left(${num(v)}\\right)^{2}`;
}

/** isolateWords says how to isolate u in a·u + b = c: undo the b, then the a; null when u is already alone. */
function isolateWords(a: number, b: number): Text | null {
  const en: string[] = [];
  const zh: string[] = [];
  if (b > 0) {
    en.push(`subtract $${b}$ from both sides`);
    zh.push(`两边减去 $${b}$`);
  } else if (b < 0) {
    en.push(`add $${-b}$ to both sides`);
    zh.push(`两边加上 $${-b}$`);
  }
  if (a !== 1) {
    en.push(`divide both sides by $${a}$`);
    zh.push(`两边除以 $${a}$`);
  }
  return en.length === 0 ? null : t(en.join(", then "), zh.join("，再"));
}

/** scaledSquare evaluates a·u + b for a square u whose value is given, as "a · u + b = a·value + b". */
function scaledSquare(a: number, u: string, value: number, b: number): string {
  return scaledPower(a, u, Q.of(value), b);
}

/** linearAt evaluates b·x + c at x = v, as "b · v + c = result". */
function linearAt(b: number, c: number, v: Q): string {
  const x = v.sign() < 0 ? `\\left(${num(v)}\\right)` : num(v);
  return `${b === 1 ? x : `${b} \\cdot ${x}`} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${num(Q.of(b).mul(v).add(Q.of(c)))}`;
}

/** isSquareFreeInt tells whether n has no square factor other than 1. */
function isSquareFreeInt(n: number): boolean {
  return simplifyRadical(n)[0] === 1;
}

/** powerOf writes u^n. */
const powerOf = (u: string, n: number) => `${u}^{${n}}`;

/** rootLatex writes the nth root of v. */
const rootLatex = (n: number, v: Q) => (n === 2 ? `\\sqrt{${num(v)}}` : `\\sqrt[${n}]{${num(v)}}`);

export const solvingOddPowerEquations: TopicDef = {
  id: "solving-odd-power-equations",
  title: t("Solving Equations With Odd Exponents Using the Nth Root Method", "用 n 次方根法解奇次幂方程"),
  summary: t(
    "Solve equations such as $x^{3} = -64$ and $(2x - 1)^{5} = 32$ by taking an odd root, which gives exactly one real solution.",
    "通过开奇次方解 $x^{3} = -64$、$(2x - 1)^{5} = 32$ 等方程，它们恰有一个实数解。",
  ),
  prerequisites: ["solving-equations-with-square-roots"],
  encompasses: [
    { topic: "square-roots-and-cube-roots", weight: 0.3 },
    { topic: "two-step-equations", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.8.EE.A.2"],
  intro: t(
    `You have solved $x^{2} = k$ by taking square roots, and you needed $\\pm$ because squaring hides the sign: $3^{2}$ and $(-3)^{2}$ are both $9$. Other powers are undone the same way, by the matching root. A cube-shaped box with a volume of $64$ cm³ has an edge $s$ with $s^{3} = 64$, so $s = \\sqrt[3]{64} = 4$ cm, because $4 \\cdot 4 \\cdot 4 = 64$.

Odd powers behave differently from squares: they **keep** the sign. A negative number multiplied by itself three times is negative, $(-2)^{3} = -8$, so $x^{3} = -8$ has a solution, $x = -2$, and $x^{3} = 8$ has only $x = 2$, since $(-2)^{3}$ is $-8$, not $8$. Every odd power works like this, so an equation $u^{n} = k$ with $n$ odd has exactly one real solution, for every $k$, with no $\\pm$.

In this topic we solve cube equations, then fifth and seventh powers, and finally odd powers of an expression such as $(2x - 1)^{3} = -27$. As before, isolate the power first, then take the root.`,
    `你已经会用开平方解 $x^{2} = k$，并且需要加 $\\pm$，因为平方会掩盖符号：$3^{2}$ 和 $(-3)^{2}$ 都是 $9$。其他的幂也用同样的方法还原，开对应次数的方根。体积为 $64$ 立方厘米的正方体盒子，棱长 $s$ 满足 $s^{3} = 64$，所以 $s = \\sqrt[3]{64} = 4$ 厘米，因为 $4 \\cdot 4 \\cdot 4 = 64$。

奇次幂与平方不同：它们**保留**符号。负数自乘三次仍是负数，$(-2)^{3} = -8$，所以 $x^{3} = -8$ 有解 $x = -2$；而 $x^{3} = 8$ 只有 $x = 2$，因为 $(-2)^{3}$ 是 $-8$，不是 $8$。所有奇次幂都是这样，所以当 $n$ 为奇数时，方程 $u^{n} = k$ 对任何 $k$ 都恰有一个实数解，不需要 $\\pm$。

这个课题中，我们先解立方方程，再解五次幂和七次幂方程，最后解 $(2x - 1)^{3} = -27$ 这样的式子的奇次幂方程。和以前一样，先分离幂，再开方。`,
  ),
  knowledgePoints: [
    {
      id: "cube-equations",
      title: t("Solving $x^{3} = k$", "解 $x^{3} = k$"),
      explanation: t(
        `Cubing keeps the sign: a positive number cubed is positive, a negative number cubed is negative, because three negative factors give a negative product. So different numbers have different cubes, every real number has exactly one real cube root, and $x^{3} = k$ has exactly **one** real solution, $x = \\sqrt[3]{k}$, with no $\\pm$. Isolate $x^{3}$ first, as for a square:

$$2x^{3} + 5 = -11 \\;\\Rightarrow\\; 2x^{3} = -16 \\;\\Rightarrow\\; x^{3} = -8 \\;\\Rightarrow\\; x = \\sqrt[3]{-8} = -2$$

Check: $2 \\cdot (-2)^{3} + 5 = -16 + 5 = -11$. The value $2$ fails, since $2^{3} = 8$, not $-8$.

> **Watch out.** Do not add $\\pm$ out of habit: $x^{3} = -8$ has only $x = -2$. A negative $k$ gives a negative root, not "no solution" and not a positive root. And taking a cube root is not dividing by $3$: $\\sqrt[3]{-8} = -2$, not $-\\frac{8}{3}$.`,
        `立方保留符号：正数的立方是正数，负数的立方是负数，因为三个负因数的积是负数。所以不同的数有不同的立方，每个实数恰有一个实数立方根，$x^{3} = k$ 恰有**一个**实数解 $x = \\sqrt[3]{k}$，不需要 $\\pm$。和平方一样，先分离 $x^{3}$：

$$2x^{3} + 5 = -11 \\;\\Rightarrow\\; 2x^{3} = -16 \\;\\Rightarrow\\; x^{3} = -8 \\;\\Rightarrow\\; x = \\sqrt[3]{-8} = -2$$

检验：$2 \\cdot (-2)^{3} + 5 = -16 + 5 = -11$。而 $2$ 不行，因为 $2^{3} = 8$，不是 $-8$。

> **注意。** 不要习惯性地加 $\\pm$：$x^{3} = -8$ 只有 $x = -2$。$k$ 为负数时根也是负数，既不是"无解"，也不是正根。开立方也不是除以 $3$：$\\sqrt[3]{-8} = -2$，而不是 $-\\frac{8}{3}$。`,
      ),
      keyPrerequisites: ["square-roots-and-cube-roots"],
      generate(rng) {
        const fraction = rng.bool(0.25);
        const r = fraction ? coprimeFraction(rng, 4, 5).mul(Q.of(rng.sign())) : Q.of(rng.nonZero(-6, 6));
        const k = r.pow(3);
        const a = fraction || rng.bool(0.4) ? 1 : rng.pick([2, 3, 4, -2, -1]);
        const b = fraction || rng.bool(0.4) ? 0 : rng.nonZero(-30, 30);
        const c = k.mul(Q.of(a)).add(Q.of(b));
        return solutionsProblem({
          prompt: ask(`Solve $${isolated(a, "x^{3}", b, c)}$.`, `解方程 $${isolated(a, "x^{3}", b, c)}$。`, listRealSolutions),
          values: [num(r)],
          wrong: [[num(r), num(r.neg())], [num(r.neg())], [num(k.div(Q.of(3)))]],
          solution: oddPowerSolution(a, b, c, 3, k, r),
        });
      },
    },
    {
      id: "higher-odd-powers",
      title: t("Fifth and seventh powers", "五次幂与七次幂"),
      explanation: t(
        `The same holds for every odd exponent $n$. An odd number of negative factors gives a negative product, so $x^{n}$ has the same sign as $x$, and $x^{n} = k$ has the single real solution $x = \\sqrt[n]{k}$, negative when $k$ is negative. To find the root, ask which number multiplied by itself $n$ times gives $k$:

$$x^{5} = -32 \\;\\Rightarrow\\; x = \\sqrt[5]{-32} = -2 \\qquad x^{7} = \\frac{1}{128} \\;\\Rightarrow\\; x = \\sqrt[7]{\\tfrac{1}{128}} = \\frac{1}{2}$$

since $2^{5} = 32$ and $2^{7} = 128$. For a fraction, take the root of the numerator and of the denominator. Isolate the power first if there are other terms.

> **Watch out.** Odd exponents give one solution, so no $\\pm$: $x^{5} = -32$ has only $-2$. Keep the sign of $k$: the root of a negative number is negative. And the fifth root is not division by $5$: $\\sqrt[5]{-32} = -2$, not $-\\frac{32}{5}$.`,
        `对每个奇数指数 $n$ 都一样。奇数个负因数的积是负数，所以 $x^{n}$ 与 $x$ 同号，$x^{n} = k$ 只有一个实数解 $x = \\sqrt[n]{k}$，$k$ 为负数时解也是负数。求根时，问自己：哪个数自乘 $n$ 次得到 $k$？

$$x^{5} = -32 \\;\\Rightarrow\\; x = \\sqrt[5]{-32} = -2 \\qquad x^{7} = \\frac{1}{128} \\;\\Rightarrow\\; x = \\sqrt[7]{\\tfrac{1}{128}} = \\frac{1}{2}$$

因为 $2^{5} = 32$，$2^{7} = 128$。对于分数，分别对分子和分母开方。如果还有其他项，先分离幂。

> **注意。** 奇次幂只有一个解，所以不加 $\\pm$：$x^{5} = -32$ 只有 $-2$。保留 $k$ 的符号：负数的奇次方根是负数。五次方根也不是除以 $5$：$\\sqrt[5]{-32} = -2$，而不是 $-\\frac{32}{5}$。`,
      ),
      generate(rng) {
        const n = rng.pick([5, 5, 7]);
        const r =
          n === 5
            ? rng.bool(0.7)
              ? Q.of(rng.nonZero(-3, 3))
              : rng.pick([Q.of(1, 2), Q.of(1, 3), Q.of(2, 3), Q.of(3, 2)]).mul(Q.of(rng.sign()))
            : rng.pick([Q.of(1), Q.of(2), Q.of(1, 2)]).mul(Q.of(rng.sign()));
        const k = r.pow(n);
        const simple = !r.isInteger() || rng.bool(0.4);
        const a = simple ? 1 : rng.pick([2, 3, -1, -2]);
        const b = simple ? 0 : rng.nonZero(-40, 40);
        const c = k.mul(Q.of(a)).add(Q.of(b));
        const u = powerOf("x", n);
        return solutionsProblem({
          prompt: ask(`Solve $${isolated(a, u, b, c)}$.`, `解方程 $${isolated(a, u, b, c)}$。`, listRealSolutions),
          values: [num(r)],
          wrong: [[num(r), num(r.neg())], [num(r.neg())], [num(k.div(Q.of(n)))]],
          solution: oddPowerSolution(a, b, c, n, k, r),
        });
      },
    },
    {
      id: "odd-powers-of-binomials",
      title: t("Odd powers of an expression", "式子的奇次幂"),
      explanation: t(
        `In $(2x - 1)^{3} = -27$ the thing being cubed is $2x - 1$. Treat it as one unknown: its cube is $-27$, and an odd power has one real root, so $2x - 1$ must be $\\sqrt[3]{-27} = -3$. Then solve the linear equation that remains, undoing the inside in reverse order:

$$(2x - 1)^{3} = -27 \\;\\Rightarrow\\; 2x - 1 = -3 \\;\\Rightarrow\\; 2x = -2 \\;\\Rightarrow\\; x = -1$$

Check: $2 \\cdot (-1) - 1 = -3$, and $(-3)^{3} = -27$. If there are terms outside the parentheses, isolate the power first.

> **Watch out.** Undo the inside with the opposite operations: from $2x - 1 = -3$ add $1$, giving $2x = -2$; subtracting $1$ gives the wrong value. Remember to divide by the coefficient of $x$ as well. And there is only one solution: an odd power needs no $\\pm$, so do not add a second value from $2x - 1 = 3$.`,
        `在 $(2x - 1)^{3} = -27$ 中，被立方的是 $2x - 1$。把它看作一个未知数：它的立方是 $-27$，而奇次幂只有一个实数根，所以 $2x - 1$ 必须等于 $\\sqrt[3]{-27} = -3$。再按相反的顺序还原括号内的运算，解剩下的一次方程：

$$(2x - 1)^{3} = -27 \\;\\Rightarrow\\; 2x - 1 = -3 \\;\\Rightarrow\\; 2x = -2 \\;\\Rightarrow\\; x = -1$$

检验：$2 \\cdot (-1) - 1 = -3$，$(-3)^{3} = -27$。如果括号外还有其他项，先分离幂。

> **注意。** 用相反的运算还原括号内的式子：由 $2x - 1 = -3$ 两边加 $1$，得 $2x = -2$；减 $1$ 会得到错误的值。还要记得除以 $x$ 的系数。而且只有一个解：奇次幂不需要 $\\pm$，不要再从 $2x - 1 = 3$ 加上第二个值。`,
      ),
      generate(rng) {
        const n = rng.pick([3, 3, 5]);
        const r = n === 3 ? rng.nonZero(-5, 5) : rng.nonZero(-2, 2);
        const b = rng.bool(0.4) ? rng.int(2, 4) : 1;
        const c = rng.nonZero(-9, 9);
        const k = Q.of(r ** n);
        const outer = rng.bool(0.3) ? rng.pick([2, -1]) : 1;
        const d = outer === 1 && rng.bool(0.6) ? 0 : rng.nonZero(-20, 20);
        const e = k.mul(Q.of(outer)).add(Q.of(d));
        const u = powerOf(`\\left(${linear(b, c)}\\right)`, n);
        const x = Q.of(r - c, b);
        const inside = linear(b, c);
        const how = isolateWords(outer, d);
        const work = steps(...isolatingWork(outer, u, d, e));
        const first = how
          ? t(
              `**Step 1: Isolate the power.** Undo the operations outside the parentheses in reverse order: ${how.en}:${work}`,
              `**第一步：分离幂。** 按相反的顺序还原括号外的运算：${how["zh-CN"]}：${work}`,
            )
          : t(`**Step 1: Isolate the power.** The power is already alone:${work}`, `**第一步：分离幂。** 幂已经单独在一边：${work}`);
        const root = oddRootWords(n);
        const linearSteps = b === 1 ? steps(`x = ${num(x)}`) : steps(`${b}x = ${r - c}`, `x = ${num(x)}`);
        const undo = t(
          `${c > 0 ? `subtract $${c}$ from` : `add $${-c}$ to`} both sides${b === 1 ? "" : `, then divide by $${b}$`}`,
          `两边${c > 0 ? `减去 $${c}$` : `加上 $${-c}$`}${b === 1 ? "" : `，再除以 $${b}$`}`,
        );
        const rq = Q.of(r);
        const left = how ? `, so the left side is $${scaledPower(outer, powerOfValue(rq, n), k, d)} = ${num(e)}$` : "";
        const leftZh = how ? `，所以左边是 $${scaledPower(outer, powerOfValue(rq, n), k, d)} = ${num(e)}$` : "";
        return solutionsProblem({
          prompt: ask(`Solve $${isolated(outer, u, d, e)}$.`, `解方程 $${isolated(outer, u, d, e)}$。`, listRealSolutions),
          values: [num(x)],
          wrong: [[num(Q.of(r + c, b))], [num(Q.of(-r - c, b)), num(x)], ...(b === 1 ? [] : [[num(Q.of(r - c))]])],
          solution: t(
            `${first.en}**Step 2: Take the ${root.en}.** The exponent $${n}$ is odd, so the inside has exactly one real value, with no $\\pm$:${steps(`${inside} = ${rootLatex(n, k)} = ${r}`)}**Step 3: Solve the linear equation.** To undo the inside, ${undo.en}:${linearSteps}**Check.** $${linearAt(b, c, x)}$ and $${powerOfValue(rq, n)} = ${num(k)}$${left}.`,
            `${first["zh-CN"]}**第二步：开${root["zh-CN"]}。** 指数 $${n}$ 是奇数，所以括号内只有一个实数值，不需要 $\\pm$：${steps(`${inside} = ${rootLatex(n, k)} = ${r}`)}**第三步：解一次方程。** 还原括号内的运算：${undo["zh-CN"]}：${linearSteps}**检验。** $${linearAt(b, c, x)}$，$${powerOfValue(rq, n)} = ${num(k)}$${leftZh}。`,
          ),
        });
      },
    },
  ],
};

/** oddRootWords names the nth root for an odd n: the cube root, the fifth root, the seventh root. */
function oddRootWords(n: number): Text {
  return n === 3 ? t("cube root", "立方") : t(`${n === 5 ? "fifth" : "seventh"} root`, ` ${n} 次方`);
}

/** powerOfValue writes vⁿ for a rational v, with parentheses around a negative number or a fraction. */
function powerOfValue(v: Q, n: number): string {
  return v.isInteger() && v.sign() >= 0 ? `${num(v)}^{${n}}` : `\\left(${num(v)}\\right)^{${n}}`;
}

/** scaledPower evaluates a·u + b for a power u whose value is given, as "a · u + b = a·value + b". */
function scaledPower(a: number, u: string, value: Q, b: number): string {
  const times = a === 1 ? u : a === -1 ? `-${u}` : `${a} \\cdot ${u}`;
  const tail = b === 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
  return `${times}${tail} = ${num(value.mul(Q.of(a)))}${tail}`;
}

/** oddPowerSolution solves a·xⁿ + b = c for an odd n: isolate the power, take the one real root r of k, check it. */
function oddPowerSolution(a: number, b: number, c: Q, n: number, k: Q, r: Q): Text {
  const u = powerOf("x", n);
  const how = isolateWords(a, b);
  const work = steps(...isolatingWork(a, u, b, c));
  const first = how
    ? t(
        `**Step 1: Isolate $${u}$.** Undo the other operations in reverse order: ${how.en}:${work}`,
        `**第一步：分离 $${u}$。** 按相反的顺序还原其他运算：${how["zh-CN"]}：${work}`,
      )
    : t(`**Step 1: Isolate $${u}$.** The power is already alone:${work}`, `**第一步：分离 $${u}$。** 幂已经单独在一边：${work}`);
  const root = oddRootWords(n);
  const power = powerOfValue(r, n);
  const left = how ? `, so the left side is $${scaledPower(a, power, k, b)} = ${num(c)}$` : "";
  const leftZh = how ? `，所以左边是 $${scaledPower(a, power, k, b)} = ${num(c)}$` : "";
  return t(
    `${first.en}**Step 2: Take the ${root.en}.** The exponent $${n}$ is odd, so the power keeps the sign of $x$: exactly one real number has this power, and no $\\pm$ is needed. ${r.sign() < 0 ? "The right side is negative, so the root is negative" : "The right side is positive, so the root is positive"}:${steps(`x = ${rootLatex(n, k)} = ${num(r)}`)}**Check.** $${power} = ${num(k)}$${left}. The opposite, $${num(r.neg())}$, gives $${powerOfValue(r.neg(), n)} = ${num(k.neg())}$ instead, so it is not a solution.`,
    `${first["zh-CN"]}**第二步：开${root["zh-CN"]}。** 指数 $${n}$ 是奇数，所以幂与 $x$ 同号：只有一个实数的幂等于它，不需要 $\\pm$。${r.sign() < 0 ? "右边是负数，所以根是负数" : "右边是正数，所以根是正数"}：${steps(`x = ${rootLatex(n, k)} = ${num(r)}`)}**检验。** $${power} = ${num(k)}$${leftZh}。它的相反数 $${num(r.neg())}$ 给出 $${powerOfValue(r.neg(), n)} = ${num(k.neg())}$，所以不是解。`,
  );
}

export const solvingEvenPowerEquations: TopicDef = {
  id: "solving-even-power-equations",
  title: t("Solving Equations With Even Exponents Using the Nth Root Method", "用 n 次方根法解偶次幂方程"),
  summary: t(
    "Solve equations such as $x^{4} = 81$ by taking an even root, and tell when there are two, one or no real solutions.",
    "通过开偶次方解 $x^{4} = 81$ 等方程，并判断实数解有两个、一个还是没有。",
  ),
  prerequisites: ["solving-odd-power-equations"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.8.EE.A.2"],
  intro: t(
    `You have seen two kinds of power equations. A square hides the sign, so $x^{2} = 9$ has two solutions, $\\pm 3$, and $x^{2} = -9$ has none. An odd power keeps the sign, so $x^{3} = k$ always has exactly one. Every exponent falls into one of these two kinds, and the kind decides the answer before you compute anything.

Even powers behave like squares. An even power is a product of pairs of equal factors, $x^{4} = (x \\cdot x)(x \\cdot x)$, and each pair is positive or zero, so an even power is **never negative**, and a number and its opposite have the same even power: $2^{4} = (-2)^{4} = 16$. So $x^{4} = 16$ has two solutions, $x = \\pm 2$; $x^{4} = 0$ has only $x = 0$; and $x^{4} = -16$ has none.

In this topic we solve fourth, sixth and eighth power equations, solve even powers of an expression such as $(x + 2)^{4} = 16$, and count the real solutions of any equation $u^{n} = k$ from the parity of $n$ and the sign of $k$.`,
    `你已经见过两类幂方程。平方会掩盖符号，所以 $x^{2} = 9$ 有两个解 $\\pm 3$，而 $x^{2} = -9$ 没有解。奇次幂保留符号，所以 $x^{3} = k$ 总是恰有一个解。每个指数都属于这两类之一，而类别在计算之前就决定了答案。

偶次幂的表现与平方相同。偶次幂是若干对相等因数的积，$x^{4} = (x \\cdot x)(x \\cdot x)$，每一对都是正数或零，所以偶次幂**永远不是负数**，而且一个数与它的相反数的偶次幂相等：$2^{4} = (-2)^{4} = 16$。所以 $x^{4} = 16$ 有两个解 $x = \\pm 2$；$x^{4} = 0$ 只有 $x = 0$；$x^{4} = -16$ 没有解。

这个课题中，我们解四次、六次和八次幂方程，解 $(x + 2)^{4} = 16$ 这样的式子的偶次幂方程，并根据 $n$ 的奇偶和 $k$ 的符号，数出任意方程 $u^{n} = k$ 的实数解个数。`,
  ),
  knowledgePoints: [
    {
      id: "fourth-power-equations",
      title: t("Solving $x^{4} = k$", "解 $x^{4} = k$"),
      explanation: t(
        `An even power is never negative, because it is a product of pairs of equal factors and each pair is positive or zero. And a number and its opposite have the same even power: $3^{4} = (-3)^{4} = 81$. So $x^{4} = k$ works just like $x^{2} = k$:

- $x^{4} = k$ with $k > 0$: two solutions, $x = \\pm\\sqrt[4]{k}$;
- $x^{4} = 0$: one solution, $x = 0$;
- $x^{4} = k$ with $k < 0$: no real solution.

To find $\\sqrt[4]{k}$, ask which positive number multiplied by itself four times gives $k$. For $2x^{4} - 7 = 155$, isolate first: $2x^{4} = 162$, $x^{4} = 81$, so $x = \\pm 3$. Check: $2 \\cdot 3^{4} - 7 = 162 - 7 = 155$.

> **Watch out.** Keep both roots: $x^{4} = 81$ gives $3$ **and** $-3$. The fourth root is not division by $4$: $\\sqrt[4]{81} = 3$, not $\\frac{81}{4}$. And $x^{4} = -81$ has no real solution, not $\\pm 3$; $x^{4} = 0$ has exactly one, $0$.`,
        `偶次幂不会是负数，因为它是若干对相等因数的积，每一对都是正数或零。而且一个数与它的相反数的偶次幂相等：$3^{4} = (-3)^{4} = 81$。所以 $x^{4} = k$ 与 $x^{2} = k$ 的情形完全一样：

- $x^{4} = k$ 且 $k > 0$：两个解，$x = \\pm\\sqrt[4]{k}$；
- $x^{4} = 0$：一个解，$x = 0$；
- $x^{4} = k$ 且 $k < 0$：没有实数解。

求 $\\sqrt[4]{k}$ 时，问自己：哪个正数自乘四次得到 $k$？解 $2x^{4} - 7 = 155$ 时先分离：$2x^{4} = 162$，$x^{4} = 81$，所以 $x = \\pm 3$。检验：$2 \\cdot 3^{4} - 7 = 162 - 7 = 155$。

> **注意。** 两个根都要保留：$x^{4} = 81$ 得 $3$ **和** $-3$。开四次方不是除以 $4$：$\\sqrt[4]{81} = 3$，不是 $\\frac{81}{4}$。$x^{4} = -81$ 没有实数解，而不是 $\\pm 3$；$x^{4} = 0$ 恰有一个解 $0$。`,
      ),
      generate(rng) {
        const kind = rng.pick(["positive", "positive", "positive", "fraction", "zero", "negative", "negative"] as const);
        const r =
          kind === "fraction"
            ? rng.pick([Q.of(1, 2), Q.of(1, 3), Q.of(2, 3), Q.of(3, 2), Q.of(1, 4)])
            : Q.of(kind === "zero" ? 0 : rng.int(1, 5));
        const k = kind === "negative" ? r.pow(4).neg() : r.pow(4);
        const simple = kind === "fraction" || rng.bool(0.4);
        const a = simple ? 1 : rng.pick([2, 3, -1, -2]);
        const b = simple ? 0 : rng.nonZero(-40, 40);
        const c = k.mul(Q.of(a)).add(Q.of(b));
        const values = kind === "negative" ? [] : plusMinus(Q.zero, surd(r));
        return solutionsProblem({
          prompt: ask(`Solve $${isolated(a, "x^{4}", b, c)}$.`, `解方程 $${isolated(a, "x^{4}", b, c)}$。`, listRealSolutions),
          values,
          wrong:
            kind === "negative" ? [[num(r), num(r.neg())], [num(r.neg())]] : kind === "zero" ? [[]] : [[num(r)], [num(k.div(Q.of(4)))]],
          solution: evenPowerSolution(a, b, c, 4, k, r),
        });
      },
    },
    {
      id: "higher-even-powers",
      title: t("Sixth and eighth powers", "六次幂与八次幂"),
      explanation: t(
        `Every even exponent behaves the same way, because $x^{n}$ is still a product of pairs of equal factors. For any even $n$, $x^{n} = k$ has the two solutions $x = \\pm\\sqrt[n]{k}$ when $k > 0$, the one solution $0$ when $k = 0$, and none when $k < 0$. Find the root by asking which positive number to the $n$th power gives $k$; for a fraction, take the root of the numerator and of the denominator:

$$x^{6} = 64 \\;\\Rightarrow\\; x = \\pm\\sqrt[6]{64} = \\pm 2 \\qquad x^{8} = \\frac{1}{256} \\;\\Rightarrow\\; x = \\pm\\frac{1}{2} \\qquad x^{8} = -1 \\;\\Rightarrow\\; \\text{no real solution}$$

since $2^{6} = 64$ and $2^{8} = 256$.

> **Watch out.** An even exponent always needs the $\\pm$: $x^{6} = 64$ has $2$ and $-2$. The sixth root is not division by $6$: $\\sqrt[6]{64} = 2$, not $\\frac{64}{6}$. And when the power equals a negative number there is no real solution; do not answer $\\pm\\sqrt[n]{|k|}$.`,
        `每个偶数指数的情形都一样，因为 $x^{n}$ 仍然是若干对相等因数的积。对任意偶数 $n$：$k > 0$ 时 $x^{n} = k$ 有两个解 $x = \\pm\\sqrt[n]{k}$；$k = 0$ 时只有一个解 $0$；$k < 0$ 时没有实数解。求根时，问自己：哪个正数的 $n$ 次方等于 $k$？对于分数，分别对分子和分母开方：

$$x^{6} = 64 \\;\\Rightarrow\\; x = \\pm\\sqrt[6]{64} = \\pm 2 \\qquad x^{8} = \\frac{1}{256} \\;\\Rightarrow\\; x = \\pm\\frac{1}{2} \\qquad x^{8} = -1 \\;\\Rightarrow\\; \\text{无实数解}$$

因为 $2^{6} = 64$，$2^{8} = 256$。

> **注意。** 偶数指数一定要加 $\\pm$：$x^{6} = 64$ 有 $2$ 和 $-2$。开六次方不是除以 $6$：$\\sqrt[6]{64} = 2$，不是 $\\frac{64}{6}$。幂等于负数时没有实数解，不要答 $\\pm\\sqrt[n]{|k|}$。`,
      ),
      generate(rng) {
        const n = rng.pick([6, 6, 8]);
        const negative = rng.bool(0.25);
        const r = n === 6 ? rng.pick([Q.of(1), Q.of(2), Q.of(3), Q.of(1, 2), Q.of(2, 3)]) : rng.pick([Q.of(1), Q.of(2), Q.of(1, 2)]);
        const k = negative ? r.pow(n).neg() : r.pow(n);
        const simple = !r.isInteger() || rng.bool(0.4);
        const a = simple ? 1 : rng.pick([2, 3, -1, -2]);
        const b = simple ? 0 : rng.nonZero(-40, 40);
        const c = k.mul(Q.of(a)).add(Q.of(b));
        const u = powerOf("x", n);
        return solutionsProblem({
          prompt: ask(`Solve $${isolated(a, u, b, c)}$.`, `解方程 $${isolated(a, u, b, c)}$。`, listRealSolutions),
          values: negative ? [] : plusMinus(Q.zero, surd(r)),
          wrong: negative ? [[num(r), num(r.neg())], [num(r.neg())]] : [[num(r)], [num(k.div(Q.of(n)))]],
          solution: evenPowerSolution(a, b, c, n, k, r),
        });
      },
    },
    {
      id: "even-powers-of-binomials",
      title: t("Even powers of an expression", "式子的偶次幂"),
      explanation: t(
        `In $(x + 2)^{4} = 16$ the thing raised to the fourth power is $x + 2$. An even power hides the sign of what is inside, so a positive result comes from two inside values, one positive and one negative, and each gives a solution. Take the even root of the whole expression with $\\pm$, then solve both linear equations:

$$(x + 2)^{4} = 16 \\;\\Rightarrow\\; x + 2 = \\pm 2 \\;\\Rightarrow\\; x = 0 \\text{ or } x = -4$$

Check: $0 + 2 = 2$ and $-4 + 2 = -2$, and $2^{4} = (-2)^{4} = 16$. If there are terms outside the parentheses, isolate the power first. If the power equals $0$, the inside must be $0$ and there is one solution; if it equals a negative number, there is none.

> **Watch out.** Keep both signs: $x + 2 = 2$ alone gives only $x = 0$ and misses $x = -4$. Undo the inside with the opposite operation: from $x + 2 = \\pm 2$ subtract $2$, so $x = -2 \\pm 2$, not $2 \\pm 2$. And a negative even power, as in $(x + 2)^{4} = -16$, has no real solution.`,
        `在 $(x + 2)^{4} = 16$ 中，被开四次方前的底数是 $x + 2$。偶次幂会掩盖底数的符号，所以一个正的结果来自括号内的两个值，一正一负，每个都给出一个解。对整个式子开偶次方并加上 $\\pm$，再解两个一次方程：

$$(x + 2)^{4} = 16 \\;\\Rightarrow\\; x + 2 = \\pm 2 \\;\\Rightarrow\\; x = 0 \\text{ 或 } x = -4$$

检验：$0 + 2 = 2$，$-4 + 2 = -2$，而 $2^{4} = (-2)^{4} = 16$。如果括号外还有其他项，先分离幂。如果幂等于 $0$，括号内必须为 $0$，只有一个解；如果幂等于负数，则没有解。

> **注意。** 两个符号都要保留：只解 $x + 2 = 2$ 只得到 $x = 0$，漏掉了 $x = -4$。用相反的运算还原括号内的式子：由 $x + 2 = \\pm 2$ 两边减 $2$，得 $x = -2 \\pm 2$，而不是 $2 \\pm 2$。偶次幂等于负数时，比如 $(x + 2)^{4} = -16$，没有实数解。`,
      ),
      generate(rng) {
        const n = rng.pick([4, 4, 6]);
        const kind = rng.pick(["positive", "positive", "positive", "zero", "negative"] as const);
        const r = kind === "zero" ? 0 : n === 4 ? rng.int(1, 4) : rng.int(1, 2);
        const k = Q.of(kind === "negative" ? -(r ** n) : r ** n);
        const b = rng.bool(0.3) ? rng.int(2, 3) : 1;
        let c = rng.nonZero(-9, 9);
        if (b > 1 && c % b === 0) c += 1;
        const outer = rng.bool(0.3) ? rng.pick([2, 3, -1]) : 1;
        const d = outer === 1 && rng.bool(0.6) ? 0 : rng.nonZero(-20, 20);
        const e = k.mul(Q.of(outer)).add(Q.of(d));
        const u = powerOf(`\\left(${linear(b, c)}\\right)`, n);
        const values = kind === "negative" ? [] : plusMinus(Q.of(-c), surd(Q.of(r)), Q.of(b));
        const inside = linear(b, c);
        const how = isolateWords(outer, d);
        const work = steps(...isolatingWork(outer, u, d, e));
        const first = how
          ? t(
              `**Step 1: Isolate the power.** Undo the operations outside the parentheses in reverse order: ${how.en}:${work}`,
              `**第一步：分离幂。** 按相反的顺序还原括号外的运算：${how["zh-CN"]}：${work}`,
            )
          : t(`**Step 1: Isolate the power.** The power is already alone:${work}`, `**第一步：分离幂。** 幂已经单独在一边：${work}`);
        const undo = t(
          `${c > 0 ? `subtract $${c}$ from` : `add $${-c}$ to`} both sides${b === 1 ? "" : `, then divide by $${b}$`}`,
          `两边${c > 0 ? `减去 $${c}$` : `加上 $${-c}$`}${b === 1 ? "" : `，再除以 $${b}$`}`,
        );
        const root = evenRootWords(n);
        const pm = `\\left(\\pm ${r}\\right)^{${n}}`;
        const left = (base: string) => (how ? `, so the left side is $${scaledPower(outer, base, k, d)} = ${num(e)}$` : "");
        const leftZh = (base: string) => (how ? `，所以左边是 $${scaledPower(outer, base, k, d)} = ${num(e)}$` : "");
        let rest: Text;
        if (kind === "negative") {
          rest = t(
            `**Step 2: Look at the sign.** The exponent $${n}$ is even, so the power of $${inside}$ cannot be negative, but it would have to equal $${num(k)}$. There is no real solution.`,
            `**第二步：看符号。** 指数 $${n}$ 是偶数，所以 $${inside}$ 的 $${n}$ 次方不可能是负数，但它要等于 $${num(k)}$。所以没有实数解。`,
          );
        } else if (kind === "zero") {
          const v = Q.of(-c, b);
          rest = t(
            `**Step 2: Take the ${root.en}.** Only $0$ has a ${n}th power of $0$, so the inside must be $0$:${steps(`${inside} = 0`)}**Step 3: Solve the linear equation.** To undo the inside, ${undo.en}: $x = ${values[0]}$. There is only one solution.

**Check.** $${linearAt(b, c, v)}$, and $0^{${n}} = 0$${left(`0^{${n}}`)}.`,
            `**第二步：开${root["zh-CN"]}。** 只有 $0$ 的 $${n}$ 次方是 $0$，所以括号内必须等于 $0$：${steps(`${inside} = 0`)}**第三步：解一次方程。** 还原括号内的运算：${undo["zh-CN"]}，得 $x = ${values[0]}$。只有一个解。

**检验。** $${linearAt(b, c, v)}$，而 $0^{${n}} = 0$${leftZh(`0^{${n}}`)}。`,
          );
        } else {
          const v0 = Q.of(r - c, b);
          const v1 = Q.of(-r - c, b);
          rest = t(
            `**Step 2: Take the ${root.en}, with $\\pm$.** The exponent $${n}$ is even, so the inside can be $${rootLatex(n, k)} = ${r}$ or its opposite:${steps(`${inside} = ${r} \\quad \\text{or} \\quad ${inside} = -${r}`)}**Step 3: Solve both linear equations.** To undo the inside, ${undo.en}:${steps(`x = ${values.join(" \\quad \\text{or} \\quad x = ")}`)}**Check.** $${linearAt(b, c, v0)}$ and $${linearAt(b, c, v1)}$, and $${r}^{${n}} = (-${r})^{${n}} = ${num(k)}$${left(pm)}.`,
            `**第二步：开${root["zh-CN"]}，加上 $\\pm$。** 指数 $${n}$ 是偶数，所以括号内可以是 $${rootLatex(n, k)} = ${r}$，也可以是它的相反数：${steps(`${inside} = ${r} \\quad \\text{或} \\quad ${inside} = -${r}`)}**第三步：解两个一次方程。** 还原括号内的运算：${undo["zh-CN"]}：${steps(`x = ${values.join(" \\quad \\text{或} \\quad x = ")}`)}**检验。** $${linearAt(b, c, v0)}$，$${linearAt(b, c, v1)}$，而 $${r}^{${n}} = (-${r})^{${n}} = ${num(k)}$${leftZh(pm)}。`,
          );
        }
        return solutionsProblem({
          prompt: ask(`Solve $${isolated(outer, u, d, e)}$.`, `解方程 $${isolated(outer, u, d, e)}$。`, listRealSolutions),
          values,
          wrong:
            kind === "negative"
              ? [plusMinus(Q.of(-c), surd(Q.of(r)), Q.of(b))]
              : [[num(Q.of(r - c, b))], plusMinus(Q.of(c), surd(Q.of(r)), Q.of(b))],
          solution: t(`${first.en}${rest.en}`, `${first["zh-CN"]}${rest["zh-CN"]}`),
        });
      },
    },
    {
      id: "counting-real-solutions",
      title: t("How many real solutions?", "有几个实数解"),
      explanation: t(
        `Once the power is isolated as $u^{n} = k$, the number of real solutions depends only on whether $n$ is odd or even and on the sign of $k$. An odd power keeps the sign of $u$ and takes every real value exactly once, so there is always one solution. An even power is never negative and gives the same value for $u$ and $-u$, so it has two solutions, one, or none:

| | $k > 0$ | $k = 0$ | $k < 0$ |
| :--- | :--- | :--- | :--- |
| $n$ odd | $1$ | $1$ | $1$ |
| $n$ even | $2$ | $1$ | $0$ |

For example, $3(x - 1)^{4} + 5 = 2$ gives $(x - 1)^{4} = -1$: even exponent, negative right side, so no real solution. Each value of $u$ gives one value of $x$, because $u$ is $x$ or $x - h$.

> **Watch out.** Isolate the power before you look at the sign: in $3x^{4} + 5 = 2$ the $2$ is positive, but $x^{4} = -1$. An odd exponent gives one solution even when $k$ is negative, never two and never none. And an even power equal to $0$ gives one solution, not two.`,
        `把幂分离成 $u^{n} = k$ 后，实数解的个数只取决于 $n$ 的奇偶和 $k$ 的符号。奇次幂保留 $u$ 的符号，每个实数值恰好取到一次，所以总是有一个解。偶次幂不会是负数，并且 $u$ 与 $-u$ 给出相同的值，所以可能有两个、一个或没有解：

| | $k > 0$ | $k = 0$ | $k < 0$ |
| :--- | :--- | :--- | :--- |
| $n$ 为奇数 | $1$ | $1$ | $1$ |
| $n$ 为偶数 | $2$ | $1$ | $0$ |

例如，由 $3(x - 1)^{4} + 5 = 2$ 得 $(x - 1)^{4} = -1$：偶数指数，右边为负，所以没有实数解。每个 $u$ 的值对应一个 $x$ 的值，因为 $u$ 是 $x$ 或 $x - h$。

> **注意。** 先分离幂，再看符号：在 $3x^{4} + 5 = 2$ 中，$2$ 是正数，但 $x^{4} = -1$。奇数指数即使 $k$ 为负也只有一个解，既不是两个，也不是没有。偶次幂等于 $0$ 时只有一个解，不是两个。`,
      ),
      generate(rng) {
        const n = rng.int(2, 8);
        const sign = rng.pick([1, 1, -1, -1, 0]);
        const k = sign * rng.int(1, 90);
        const a = rng.bool(0.5) ? 1 : rng.pick([2, 3, 5, -2, -3]);
        const b = a === 1 && rng.bool(0.5) ? 0 : rng.nonZero(-30, 30);
        const c = Q.of(a * k + b);
        const h = rng.int(-6, 6);
        const base = h === 0 ? "x" : linear(1, -h);
        const u = powerOf(h === 0 ? "x" : `\\left(${base}\\right)`, n);
        const count = n % 2 === 1 ? 1 : k > 0 ? 2 : k === 0 ? 1 : 0;
        const how = isolateWords(a, b);
        const work = steps(...isolatingWork(a, u, b, c));
        const first = how
          ? t(
              `**Step 1: Isolate the power.** Undo the other operations in reverse order: ${how.en}:${work}`,
              `**第一步：分离幂。** 按相反的顺序还原其他运算：${how["zh-CN"]}：${work}`,
            )
          : t(`**Step 1: Isolate the power.** The power is already alone:${work}`, `**第一步：分离幂。** 幂已经单独在一边：${work}`);
        const R = rootLatex(n, Q.of(Math.abs(k)));
        const odd = rootLatex(n, Q.of(k));
        const shift = (root: string) => (h === 0 ? root : `${h} + ${root}`);
        const shiftDown = (root: string) => (h === 0 ? `-${root}` : `${h} - ${root}`);
        const decide =
          n % 2 === 1
            ? t(
                `The exponent $${n}$ is odd, so the power keeps the sign of $${base}$ and takes the value $${k}$ exactly once: one real solution.`,
                `指数 $${n}$ 是奇数，所以幂与 $${base}$ 同号，恰好有一次取到 $${k}$：一个实数解。`,
              )
            : k > 0
              ? t(
                  `The exponent $${n}$ is even and the right side is positive, so $${base}$ can be a positive number or its opposite: two real solutions.`,
                  `指数 $${n}$ 是偶数且右边为正，所以 $${base}$ 可以是一个正数，也可以是它的相反数：两个实数解。`,
                )
              : k === 0
                ? t(
                    `The exponent $${n}$ is even and the right side is $0$, so $${base}$ must be $0$: one real solution.`,
                    `指数 $${n}$ 是偶数且右边为 $0$，所以 $${base}$ 必须是 $0$：一个实数解。`,
                  )
                : t(
                    `The exponent $${n}$ is even and the right side is negative, but an even power is never negative: no real solution.`,
                    `指数 $${n}$ 是偶数且右边为负，而偶次幂不会是负数：没有实数解。`,
                  );
        const check =
          k === 0
            ? t(`The only solution is $x = ${h}$.`, `唯一的解是 $x = ${h}$。`)
            : n % 2 === 1
              ? t(`The one solution is $x = ${shift(odd)}$.`, `唯一的解是 $x = ${shift(odd)}$。`)
              : k > 0
                ? t(
                    `$${base} = ${R}$ and $${base} = -${R}$ give the two different values $x = ${shift(R)}$ and $x = ${shiftDown(R)}$.`,
                    `$${base} = ${R}$ 和 $${base} = -${R}$ 给出两个不同的值 $x = ${shift(R)}$ 和 $x = ${shiftDown(R)}$。`,
                  )
                : t(
                    `For every real $x$, $${u} \\ge 0 > ${k}$, so no value works.`,
                    `对任意实数 $x$，$${u} \\ge 0 > ${k}$，所以没有值满足方程。`,
                  );
        return numberProblem({
          prompt: t(`How many real solutions does $${isolated(a, u, b, c)}$ have?`, `方程 $${isolated(a, u, b, c)}$ 有几个实数解？`),
          answer: count,
          form: "integer",
          wrong: [n % 2 === 1 ? 2 : 1, n % 2 === 1 && k < 0 ? 0 : 2, 0],
          solution: t(
            `${first.en}**Step 2: Decide from the exponent and the sign.** ${decide.en} The answer is $${count}$.

**Check.** ${check.en}`,
            `${first["zh-CN"]}**第二步：由指数和符号判断。** ${decide["zh-CN"]}答案是 $${count}$。

**检验。** ${check["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

/** evenRootWords names the nth root for an even n: the fourth root, the sixth root, the eighth root. */
function evenRootWords(n: number): Text {
  return t(`${n === 4 ? "fourth" : n === 6 ? "sixth" : "eighth"} root`, ` ${n} 次方`);
}

/** evenPowerSolution solves a·xⁿ + b = c for an even n: isolate the power, then two, one or no roots by the sign of k. */
function evenPowerSolution(a: number, b: number, c: Q, n: number, k: Q, r: Q): Text {
  const u = powerOf("x", n);
  const how = isolateWords(a, b);
  const work = steps(...isolatingWork(a, u, b, c));
  const first = how
    ? t(
        `**Step 1: Isolate $${u}$.** Undo the other operations in reverse order: ${how.en}:${work}`,
        `**第一步：分离 $${u}$。** 按相反的顺序还原其他运算：${how["zh-CN"]}：${work}`,
      )
    : t(`**Step 1: Isolate $${u}$.** The power is already alone:${work}`, `**第一步：分离 $${u}$。** 幂已经单独在一边：${work}`);
  const root = evenRootWords(n);
  if (k.sign() < 0) {
    return t(
      `${first.en}**Step 2: Look at the sign.** The exponent $${n}$ is even, so $${u}$ is a product of pairs of equal factors and is never negative. It would have to equal $${num(k)}$, so there is no real solution. Even $\\pm ${num(r)}$ fail: both give $${num(k.neg())}$.`,
      `${first["zh-CN"]}**第二步：看符号。** 指数 $${n}$ 是偶数，所以 $${u}$ 是若干对相等因数的积，不会是负数。它要等于 $${num(k)}$，所以没有实数解。就连 $\\pm ${num(r)}$ 也不行：它们都给出 $${num(k.neg())}$。`,
    );
  }
  if (k.isZero()) {
    const left = how ? `, so the left side is $${scaledPower(a, `0^{${n}}`, k, b)} = ${num(c)}$` : "";
    const leftZh = how ? `，所以左边是 $${scaledPower(a, `0^{${n}}`, k, b)} = ${num(c)}$` : "";
    return t(
      `${first.en}**Step 2: Take the ${root.en}.** Every nonzero number has a positive ${n}th power, so only $x = 0$ works. There is one solution.

**Check.** $0^{${n}} = 0$${left}.`,
      `${first["zh-CN"]}**第二步：开${root["zh-CN"]}。** 每个非零数的 $${n}$ 次方都是正数，所以只有 $x = 0$ 满足。只有一个解。

**检验。** $0^{${n}} = 0$${leftZh}。`,
    );
  }
  const pm = `\\left(\\pm ${num(r)}\\right)^{${n}}`;
  const left = how ? `, so the left side is $${scaledPower(a, pm, k, b)} = ${num(c)}$` : "";
  const leftZh = how ? `，所以左边是 $${scaledPower(a, pm, k, b)} = ${num(c)}$` : "";
  return t(
    `${first.en}**Step 2: Take the ${root.en}, with $\\pm$.** The exponent $${n}$ is even, so a number and its opposite have the same ${n}th power, and both are solutions:${steps(`x = \\pm${rootLatex(n, k)} = \\pm ${num(r)}`)}**Check.** $${powerOfValue(r, n)} = ${powerOfValue(r.neg(), n)} = ${num(k)}$${left}.`,
    `${first["zh-CN"]}**第二步：开${root["zh-CN"]}，加上 $\\pm$。** 指数 $${n}$ 是偶数，所以一个数与它的相反数的 $${n}$ 次方相等，两者都是解：${steps(`x = \\pm${rootLatex(n, k)} = \\pm ${num(r)}`)}**检验。** $${powerOfValue(r, n)} = ${powerOfValue(r.neg(), n)} = ${num(k)}$${leftZh}。`,
  );
}

/** compoundInequalityTopics are the topics of linear inequalities and nonlinear equations in Algebra I, in teaching order. */
export const compoundInequalityTopics: readonly TopicDef[] = [
  solvingCompoundInequalities,
  intervalNotation,
  unboundedIntervals,
  unionsOfIntervals,
  intersectionsOfIntervals,
  compoundOrInequalities,
  compoundAndInequalities,
  introductionToModelingWithInequalities,
  modelingWithOneStepInequalities,
  modelingWithTwoStepInequalities,
  modelingWithCompoundInequalities,
  solvingEquationsWithSquareRoots,
  solvingOddPowerEquations,
  solvingEvenPowerEquations,
];
