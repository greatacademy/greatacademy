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

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));
const flip: Record<InequalityOp, InequalityOp> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
const strictness: Record<InequalityOp, InequalityOp> = { "<": "<=", "<=": "<", ">": ">=", ">=": ">" };
const lessOps: readonly InequalityOp[] = ["<", "<="];
const greaterOps: readonly InequalityOp[] = [">", ">="];
const allOps: readonly InequalityOp[] = ["<", "<=", ">", ">="];
const holds = (l: number, op: InequalityOp, r: number) => ({ "<": l < r, "<=": l <= r, ">": l > r, ">=": l >= r })[op];

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

/** hasPoint tells whether a set contains an isolated point, which interval notation cannot write. */
const hasPoint = (s: RealSet) => s.some((i) => i.lo !== undefined && i.hi !== undefined && i.lo.eq(i.hi));

/** toggleEnds includes every finite endpoint that is excluded and excludes every one that is included. */
const toggleEnds = (s: RealSet): RealSet =>
  union(...s.map((i) => ({ ...i, loClosed: i.lo !== undefined && !i.loClosed, hiClosed: i.hi !== undefined && !i.hiClosed })));

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
const listSolutions = t(
  "Enter all real solutions separated by commas, or $\\varnothing$ if there are none.",
  "请用逗号分隔写出所有实数解；如果没有实数解，请输入 $\\varnothing$。",
);

/** ask builds a prompt from a question and an instruction about the form of the answer. */
const ask = (en: string, zh: string, form: Text): Text => t(`${en} ${form.en}`, `${zh}${form["zh-CN"]}`);

/** closedWords describes an endpoint marker on a number line. */
const closedWords = (closed: boolean) => (closed ? t("closed dot", "实心点") : t("open circle", "空心圈"));

/** numberLineFigure graphs a set with integer endpoints on a number line from min to max. */
function numberLineFigure(set: RealSet, min: number, max: number): Figure {
  const width = 320;
  const pad = 30;
  const y = 20;
  const x = (v: number) => Math.round((pad + ((v - min) / (max - min)) * (width - 2 * pad)) * 100) / 100;
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
  return {
    svg: svgDocument(50, body),
    alt: t(`Number line from ${min} to ${max}, shaded ${en.join(" and ")}.`, `从 ${min} 到 ${max} 的数轴，涂色部分${zh.join("，以及")}。`),
  };
}

/** Compound is a generated double inequality a < bx + c ≤ d with its solution. */
interface Compound {
  readonly latex: string;
  readonly set: RealSet;
  readonly wrong: readonly RealSet[];
  readonly solution: Text;
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
  const shift = c > 0 ? t(`Subtract $${c}$ from`, `三部分同时减去 $${c}$`) : t(`Add $${-c}$ to`, `三部分同时加上 $${-c}$`);
  if (!negative) {
    const L = b * p + c;
    const H = b * r + c;
    const latex = `${num(L)} ${relSymbol(op1)} ${linear(b, c)} ${relSymbol(op2)} ${num(H)}`;
    const set = union(span(p, c1, r, c2));
    const work = steps(
      latex,
      `${num(L - c)} ${relSymbol(op1)} ${poly([b, "x"])} ${relSymbol(op2)} ${num(H - c)}`,
      ...(b === 1 ? [] : [inequalityLatexOf(set)]),
    );
    return {
      latex,
      set,
      wrong: [
        union(span(p, !c1, r, !c2)),
        union(span(Q.of(L, b), c1, Q.of(H, b), c2)),
        union(span(Q.of(L + c, b), c1, Q.of(H + c, b), c2)),
      ],
      solution: t(
        `${shift.en} all three parts${b === 1 ? "" : `, then divide all three parts by $${b}$; it is positive, so the symbols stay`}:${work}`,
        `${shift["zh-CN"]}${b === 1 ? "" : `，再同时除以 $${b}$；它是正数，不等号方向不变`}：${work}`,
      ),
    };
  }
  const L = b * r + c;
  const H = b * p + c;
  const latex = `${num(L)} ${relSymbol(op1)} ${rng.bool() ? linear(b, c) : poly([c, ""], [b, "x"])} ${relSymbol(op2)} ${num(H)}`;
  const set = union(span(p, c2, r, c1));
  const work = steps(
    latex,
    `${num(L - c)} ${relSymbol(op1)} ${poly([b, "x"])} ${relSymbol(op2)} ${num(H - c)}`,
    `${num(r)} ${relSymbol(flip[op1])} x ${relSymbol(flip[op2])} ${num(p)}`,
    inequalityLatexOf(set),
  );
  return {
    latex,
    set,
    wrong: [union(span(p, c1, r, c2)), [], union(span(-r, c1, -p, c2))],
    solution: t(
      `${shift.en} all three parts, then divide all three parts by $${b}$. Dividing by a negative number reverses both symbols; finally write the inequality from the smaller number to the larger:${work}`,
      `${shift["zh-CN"]}，再同时除以 $${b}$。除以负数时两个不等号都要改变方向；最后按从小到大的顺序改写：${work}`,
    ),
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
  encompasses: [{ topic: "solving-multi-step-inequalities", weight: 0.5 }],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.3"],
  knowledgePoints: [
    {
      id: "checking-double-inequalities",
      title: t("Reading a double inequality", "读连不等式"),
      explanation: t(
        "A **double inequality** such as $-3 < 2x + 1 \\le 7$ says two things at once: $-3 < 2x + 1$ **and** $2x + 1 \\le 7$. A value is a solution only if **both** parts are true.\n\nFor $x = 3$: $2(3) + 1 = 7$, and $-3 < 7$ and $7 \\le 7$ are both true, so $x = 3$ is a solution. For $x = -2$: $2(-2) + 1 = -3$, and $-3 < -3$ is false, so $x = -2$ is not.",
        "**连不等式**（如 $-3 < 2x + 1 \\le 7$）同时表示两件事：$-3 < 2x + 1$ **并且** $2x + 1 \\le 7$。只有两部分**都**成立的值才是解。\n\n对 $x = 3$：$2(3) + 1 = 7$，$-3 < 7$ 与 $7 \\le 7$ 都成立，所以 $x = 3$ 是解。对 $x = -2$：$2(-2) + 1 = -3$，而 $-3 < -3$ 不成立，所以 $x = -2$ 不是解。",
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
        const sub = `${b === 1 ? "" : b === -1 ? "-" : num(b)}(${num(x0)}) ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${num(v)}`;
        const tf = (x: boolean) => (x ? t("true", "成立") : t("false", "不成立"));
        return choiceProblem({
          prompt: t(
            `Is $x = ${num(x0)}$ a solution of $${num(lo)} ${relSymbol(op1)} ${expr} ${relSymbol(op2)} ${num(hi)}$?`,
            `$x = ${num(x0)}$ 是 $${num(lo)} ${relSymbol(op1)} ${expr} ${relSymbol(op2)} ${num(hi)}$ 的解吗？`,
          ),
          options: yesNo,
          correct: ok ? 0 : 1,
          solution: t(
            `Substitute: $${sub}$. Then $${num(lo)} ${relSymbol(op1)} ${num(v)}$ is ${tf(left).en} and $${num(v)} ${relSymbol(op2)} ${num(hi)}$ is ${tf(right).en}, so it ${ok ? "is" : "is not"} a solution.`,
            `代入：$${sub}$。$${num(lo)} ${relSymbol(op1)} ${num(v)}$ ${tf(left)["zh-CN"]}，$${num(v)} ${relSymbol(op2)} ${num(hi)}$ ${tf(right)["zh-CN"]}，所以它${ok ? "是" : "不是"}解。`,
          ),
        });
      },
    },
    {
      id: "double-inequalities-positive-coefficient",
      title: t("Solving with a positive coefficient", "系数为正时求解"),
      explanation: t(
        "To solve a double inequality, isolate $x$ in the middle by doing the same thing to **all three parts**:\n\n$$-3 < 2x + 1 \\le 7 \\;\\Rightarrow\\; -4 < 2x \\le 6 \\;\\Rightarrow\\; -2 < x \\le 3$$\n\nSubtracting $1$ and dividing by the positive number $2$ keep both symbols as they are. Each symbol stays with its own side: the left endpoint keeps $<$, the right endpoint keeps $\\le$.",
        "解连不等式时，对**三部分**做同样的运算，把 $x$ 单独留在中间：\n\n$$-3 < 2x + 1 \\le 7 \\;\\Rightarrow\\; -4 < 2x \\le 6 \\;\\Rightarrow\\; -2 < x \\le 3$$\n\n减去 $1$、除以正数 $2$ 都不改变不等号。每个不等号留在原来的一侧：左端点仍是 $<$，右端点仍是 $\\le$。",
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
        "Dividing all three parts by a negative number reverses **both** symbols. Then rewrite the result so the smaller number comes first:\n\n$$-5 \\le 7 - 3x < 10 \\;\\Rightarrow\\; -12 \\le -3x < 3 \\;\\Rightarrow\\; 4 \\ge x > -1 \\;\\Rightarrow\\; -1 < x \\le 4$$\n\nEach endpoint keeps the kind of symbol it had: $4$ came from $\\le$ and stays included; $-1$ came from $<$ and stays excluded.",
        "三部分同时除以负数时，**两个**不等号都要改变方向。然后改写成小数在前的形式：\n\n$$-5 \\le 7 - 3x < 10 \\;\\Rightarrow\\; -12 \\le -3x < 3 \\;\\Rightarrow\\; 4 \\ge x > -1 \\;\\Rightarrow\\; -1 < x \\le 4$$\n\n每个端点保留原来符号的类型：$4$ 来自 $\\le$，仍然包含；$-1$ 来自 $<$，仍然不包含。",
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

export const intervalNotation: TopicDef = {
  id: "interval-notation",
  title: t("Interval Notation", "区间记号"),
  summary: t(
    "Write bounded sets of numbers such as $-2 < x \\le 5$ in interval notation, and back.",
    "用区间记号表示 $-2 < x \\le 5$ 这样的有界数集，以及反过来。",
  ),
  prerequisites: ["solving-compound-inequalities"],
  encompasses: [{ topic: "solving-compound-inequalities", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSA.REI.B.3"],
  knowledgePoints: [
    {
      id: "inequality-to-interval-notation",
      title: t("From inequalities to intervals", "从不等式到区间"),
      explanation: t(
        "**Interval notation** writes the numbers between two endpoints as a pair: the smaller endpoint first, then the larger. A **square bracket** $[\\;]$ means the endpoint is included; a **parenthesis** $(\\;)$ means it is excluded:\n\n| Inequality | Interval |\n| :--- | :--- |\n| $-2 < x < 5$ | $(-2, 5)$ |\n| $-2 \\le x \\le 5$ | $[-2, 5]$ |\n| $-2 < x \\le 5$ | $(-2, 5]$ |\n| $-2 \\le x < 5$ | $[-2, 5)$ |\n\nAn inequality written from right to left, such as $5 > x \\ge -2$, is the same set as $-2 \\le x < 5$.",
        "**区间记号**用一对数表示两个端点之间的数：较小的端点在前，较大的在后。**方括号** $[\\;]$ 表示包含端点，**圆括号** $(\\;)$ 表示不包含：\n\n| 不等式 | 区间 |\n| :--- | :--- |\n| $-2 < x < 5$ | $(-2, 5)$ |\n| $-2 \\le x \\le 5$ | $[-2, 5]$ |\n| $-2 < x \\le 5$ | $(-2, 5]$ |\n| $-2 \\le x < 5$ | $[-2, 5)$ |\n\n从右往左写的不等式，如 $5 > x \\ge -2$，与 $-2 \\le x < 5$ 是同一个集合。",
      ),
      generate(rng) {
        const [lo, hi] = boundedEnds(rng);
        const lc = rng.bool();
        const hc = rng.bool();
        const set = union(span(lo, lc, hi, hc));
        const shown = rng.bool(0.25) ? `${num(hi)} ${hc ? "\\ge" : ">"} x ${lc ? "\\ge" : ">"} ${num(lo)}` : inequalityLatexOf(set);
        const words = bracketWords(set[0]!);
        return intervalProblem({
          prompt: t(`Write $${shown}$ in interval notation.`, `用区间记号表示 $${shown}$。`),
          set,
          form: "interval",
          wrong: [union(span(lo, !lc, hi, !hc)), union(span(lo, hc, hi, lc)), union(span(lo, true, hi, true))],
          solution: t(`${words.en}: $${intervalLatex(set)}$.`, `${words["zh-CN"]}：$${intervalLatex(set)}$。`),
        });
      },
    },
    {
      id: "interval-notation-to-inequality",
      title: t("From intervals to inequalities", "从区间到不等式"),
      explanation: t(
        "To read an interval, put $x$ between its endpoints. A square bracket becomes $\\le$ and a parenthesis becomes $<$:\n\n$$[-4, 1) \\quad\\text{means}\\quad -4 \\le x < 1$$",
        "读区间时，把 $x$ 放在两个端点之间。方括号变成 $\\le$，圆括号变成 $<$：\n\n$$[-4, 1) \\quad\\text{表示}\\quad -4 \\le x < 1$$",
      ),
      generate(rng) {
        const [lo, hi] = boundedEnds(rng);
        const lc = rng.bool();
        const hc = rng.bool();
        const set = union(span(lo, lc, hi, hc));
        return intervalProblem({
          prompt: ask(`The interval is $${intervalLatex(set)}$.`, `区间是 $${intervalLatex(set)}$。`, asInequality("x")),
          set,
          form: "inequality",
          wrong: [union(span(lo, !lc, hi, !hc)), union(span(lo, hc, hi, lc)), union(span(lo, true, hi, true))],
          solution: t(
            `${bracketWords(set[0]!).en}: $${inequalityLatexOf(set)}$.`,
            `${bracketWords(set[0]!)["zh-CN"]}：$${inequalityLatexOf(set)}$。`,
          ),
        });
      },
    },
    {
      id: "graphs-of-bounded-intervals",
      title: t("Reading graphs of intervals", "读区间的图像"),
      explanation: t(
        "On a number line, a **closed dot** marks an endpoint that is included and an **open circle** one that is excluded; the shaded segment between them holds the other numbers of the set. A segment from an open circle at $-1$ to a closed dot at $4$ is $(-1, 4]$.",
        "在数轴上，**实心点**表示包含该端点，**空心圈**表示不包含；两者之间的涂色线段是集合中的其他数。从 $-1$ 处的空心圈到 $4$ 处的实心点的线段是 $(-1, 4]$。",
      ),
      generate(rng) {
        const a = rng.int(-8, 5);
        const b = a + rng.int(1, 8);
        const lc = rng.bool();
        const hc = rng.bool();
        const set = union(span(a, lc, b, hc));
        const figure = numberLineFigure(set, a - rng.int(1, 3), b + rng.int(1, 3));
        return {
          ...intervalProblem({
            prompt: ask("Write the set graphed on the number line.", "写出数轴上所表示的集合。", asInterval),
            set,
            form: "interval",
            wrong: [union(span(a, !lc, b, !hc)), union(span(a, hc, b, lc))],
            solution: t(
              `${bracketWords(set[0]!).en}: $${intervalLatex(set)}$.`,
              `${bracketWords(set[0]!)["zh-CN"]}：$${intervalLatex(set)}$。`,
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
        "Solve the double inequality as before, then write the solution set as an interval:\n\n$$-1 \\le 3x + 5 < 11 \\;\\Rightarrow\\; -2 \\le x < 2 \\;\\Rightarrow\\; [-2, 2)$$",
        "像之前一样解连不等式，再把解集写成区间：\n\n$$-1 \\le 3x + 5 < 11 \\;\\Rightarrow\\; -2 \\le x < 2 \\;\\Rightarrow\\; [-2, 2)$$",
      ),
      generate(rng) {
        const p = compound(rng, rng.bool(0.4));
        return intervalProblem({
          prompt: ask(`Solve $${p.latex}$.`, `解不等式 $${p.latex}$。`, asInterval),
          set: p.set,
          form: "interval",
          wrong: p.wrong,
          solution: t(
            `${p.solution.en}In interval notation: $${intervalLatex(p.set)}$.`,
            `${p.solution["zh-CN"]}用区间记号表示：$${intervalLatex(p.set)}$。`,
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

export const unboundedIntervals: TopicDef = {
  id: "unbounded-intervals",
  title: t("Unbounded Intervals", "无界区间"),
  summary: t(
    "Write sets such as $x \\ge 3$ as intervals that reach $\\infty$ or $-\\infty$.",
    "把 $x \\ge 3$ 这样的集合写成延伸到 $\\infty$ 或 $-\\infty$ 的区间。",
  ),
  prerequisites: ["interval-notation"],
  encompasses: [
    { topic: "interval-notation", weight: 0.5 },
    { topic: "solving-multi-step-inequalities", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.REI.B.3"],
  knowledgePoints: [
    {
      id: "rays-in-interval-notation",
      title: t("From inequalities to unbounded intervals", "从不等式到无界区间"),
      explanation: t(
        "A set with no largest number goes on to **infinity**, written $\\infty$; a set with no smallest number starts at $-\\infty$. Infinity is not a number, so it can never be included: it always gets a parenthesis.\n\n| Inequality | Interval |\n| :--- | :--- |\n| $x > 3$ | $(3, \\infty)$ |\n| $x \\ge 3$ | $[3, \\infty)$ |\n| $x < 3$ | $(-\\infty, 3)$ |\n| $x \\le 3$ | $(-\\infty, 3]$ |\n\nAll real numbers form $(-\\infty, \\infty)$, also written $\\mathbb{R}$.",
        "没有最大数的集合一直延伸到**无穷大**，记作 $\\infty$；没有最小数的集合从 $-\\infty$ 开始。无穷大不是一个数，不可能被包含，所以总是用圆括号。\n\n| 不等式 | 区间 |\n| :--- | :--- |\n| $x > 3$ | $(3, \\infty)$ |\n| $x \\ge 3$ | $[3, \\infty)$ |\n| $x < 3$ | $(-\\infty, 3)$ |\n| $x \\le 3$ | $(-\\infty, 3]$ |\n\n全体实数是 $(-\\infty, \\infty)$，也记作 $\\mathbb{R}$。",
      ),
      generate(rng) {
        const v = rayEnd(rng);
        const op = rng.pick(allOps);
        const set = union(ray(op, v));
        const shown = rng.bool(0.3) ? `${num(v)} ${relSymbol(flip[op])} x` : inequalityLatex("x", op, v);
        return intervalProblem({
          prompt: t(`Write $${shown}$ in interval notation.`, `用区间记号表示 $${shown}$。`),
          set,
          form: "interval",
          wrong: [union(ray(strictness[op], v)), union(ray(flip[op], v)), union(ray(strictness[flip[op]], v))],
          solution: t(
            `The set ${op === "<" || op === "<=" ? "has no smallest number, so it starts at $-\\infty$" : "has no largest number, so it goes on to $\\infty$"}, and $${num(v)}$ is ${op.length === 2 ? "included" : "excluded"}: $${intervalLatex(set)}$.`,
            `这个集合${op === "<" || op === "<=" ? "没有最小的数，所以从 $-\\infty$ 开始" : "没有最大的数，所以延伸到 $\\infty$"}，并且${op.length === 2 ? "包含" : "不包含"} $${num(v)}$：$${intervalLatex(set)}$。`,
          ),
        });
      },
    },
    {
      id: "unbounded-intervals-to-inequalities",
      title: t("From unbounded intervals to inequalities", "从无界区间到不等式"),
      explanation: t(
        "An interval that ends at $\\infty$ is a set $x > a$ or $x \\ge a$; one that starts at $-\\infty$ is $x < b$ or $x \\le b$:\n\n$$(-\\infty, 7] \\quad\\text{means}\\quad x \\le 7$$",
        "以 $\\infty$ 结尾的区间是 $x > a$ 或 $x \\ge a$；以 $-\\infty$ 开头的区间是 $x < b$ 或 $x \\le b$：\n\n$$(-\\infty, 7] \\quad\\text{表示}\\quad x \\le 7$$",
      ),
      generate(rng) {
        const v = rayEnd(rng);
        const op = rng.pick(allOps);
        const set = union(ray(op, v));
        return intervalProblem({
          prompt: ask(`The interval is $${intervalLatex(set)}$.`, `区间是 $${intervalLatex(set)}$。`, asInequality("x")),
          set,
          form: "inequality",
          wrong: [union(ray(strictness[op], v)), union(ray(flip[op], v))],
          solution: t(
            `$${intervalLatex(set)}$ is $${inequalityLatex("x", op, v)}$.`,
            `$${intervalLatex(set)}$ 即 $${inequalityLatex("x", op, v)}$。`,
          ),
        });
      },
    },
    {
      id: "graphs-of-unbounded-intervals",
      title: t("Reading graphs of rays", "读射线的图像"),
      explanation: t(
        "A ray on a number line starts at a dot or a circle and has an arrow at the other end: the set goes on without end. An arrow to the right reaches $\\infty$, an arrow to the left $-\\infty$. A ray from a closed dot at $2$ to the left is $(-\\infty, 2]$.",
        "数轴上的射线从一个点或圈出发，另一端带箭头：集合无限延伸。向右的箭头到 $\\infty$，向左的箭头到 $-\\infty$。从 $2$ 处的实心点向左的射线是 $(-\\infty, 2]$。",
      ),
      generate(rng) {
        const v = rng.int(-8, 8);
        const op = rng.pick(allOps);
        const set = union(ray(op, v));
        const min = v - rng.int(2, 6);
        const max = min + rng.int(8, 12);
        return {
          figure: numberLineFigure(set, min, max),
          ...intervalProblem({
            prompt: ask("Write the set graphed on the number line.", "写出数轴上所表示的集合。", asInterval),
            set,
            form: "interval",
            wrong: [union(ray(strictness[op], v)), union(ray(flip[op], v))],
            solution: t(
              `The shading starts at $${v}$ (${closedWords(op.length === 2).en}) and goes on to the ${op.startsWith("<") ? "left" : "right"}: $${intervalLatex(set)}$.`,
              `涂色从 $${v}$（${closedWords(op.length === 2)["zh-CN"]}）开始向${op.startsWith("<") ? "左" : "右"}延伸：$${intervalLatex(set)}$。`,
            ),
          }),
        };
      },
    },
    {
      id: "solving-into-unbounded-intervals",
      title: t("Solutions as unbounded intervals", "用无界区间写解集"),
      explanation: t(
        "The solution set of a linear inequality is a ray. Solve, then write it as an interval:\n\n$$5 - 2x > 11 \\;\\Rightarrow\\; -2x > 6 \\;\\Rightarrow\\; x < -3 \\;\\Rightarrow\\; (-\\infty, -3)$$",
        "一元一次不等式的解集是一条射线。先求解，再写成区间：\n\n$$5 - 2x > 11 \\;\\Rightarrow\\; -2x > 6 \\;\\Rightarrow\\; x < -3 \\;\\Rightarrow\\; (-\\infty, -3)$$",
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
        const work = steps(`${poly([a, "x"])} ${relSymbol(op)} ${num(c - b)}`, inequalityLatex("x", answerOp, v));
        return intervalProblem({
          prompt: ask(`Solve $${lhs} ${relSymbol(op)} ${num(c)}$.`, `解不等式 $${lhs} ${relSymbol(op)} ${num(c)}$。`, asInterval),
          set,
          form: "interval",
          wrong: [union(ray(flip[answerOp], v)), union(ray(strictness[answerOp], v)), union(ray(answerOp, -v))],
          solution: t(
            `${b > 0 ? `Subtract $${b}$ from` : `Add $${-b}$ to`} both sides, then divide by $${a}$${a < 0 ? ", reversing the symbol" : ""}:${work}In interval notation: $${intervalLatex(set)}$.`,
            `两边同时${b > 0 ? `减去 $${b}$` : `加上 $${-b}$`}，再同时除以 $${a}$${a < 0 ? "，并改变不等号方向" : ""}：${work}用区间记号表示：$${intervalLatex(set)}$。`,
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

const unionExplained = t(
  "The union contains every number that is in **at least one** of the sets.",
  "并集包含**至少属于其中一个**集合的所有数。",
);
const intersectionExplained = t(
  "The intersection contains only the numbers that are in **both** sets.",
  "交集只包含**同时属于两个**集合的数。",
);

export const unionsOfIntervals: TopicDef = {
  id: "unions-of-intervals",
  title: t("Unions of Intervals", "区间的并集"),
  summary: t("Combine intervals with $\\cup$ and simplify the result.", "用 $\\cup$ 合并区间并化简结果。"),
  prerequisites: ["unbounded-intervals"],
  encompasses: [{ topic: "unbounded-intervals", weight: 0.5 }],
  xp: 14,
  standards: ["CCSS.HSA.REI.B.3"],
  knowledgePoints: [
    {
      id: "unions-of-overlapping-intervals",
      title: t("Overlapping intervals", "重叠的区间"),
      explanation: t(
        "The **union** $A \\cup B$ is the set of numbers in $A$, in $B$, or in both. When two intervals overlap, their union is one interval that runs from the leftmost endpoint to the rightmost, and each end keeps the bracket of the interval it came from:\n\n$$[-3, 2) \\cup (0, 5] = [-3, 5]$$\n\nIf one interval lies inside the other, the union is the larger one: $(-4, 6) \\cup [1, 3] = (-4, 6)$.",
        "**并集** $A \\cup B$ 是属于 $A$ 或属于 $B$（或两者都属于）的数组成的集合。两个区间重叠时，并集是从最左端点到最右端点的一个区间，每一端保留它所来自的区间的括号：\n\n$$[-3, 2) \\cup (0, 5] = [-3, 5]$$\n\n如果一个区间在另一个之内，并集就是较大的那个：$(-4, 6) \\cup [1, 3] = (-4, 6)$。",
      ),
      generate(rng) {
        const [A, B] = overlapping(rng);
        const set = union(A, B);
        return intervalProblem({
          prompt: ask(`Simplify $${show(A)} \\cup ${show(B)}$.`, `化简 $${show(A)} \\cup ${show(B)}$。`, asInterval),
          set,
          form: "interval",
          wrong: [intersect([A], [B]), toggleEnds(set)],
          solution: t(
            `${unionExplained.en} The intervals overlap, so together they cover everything from the leftmost endpoint to the rightmost: $${intervalLatex(set)}$.`,
            `${unionExplained["zh-CN"]}两个区间重叠，合起来覆盖从最左端点到最右端点的全部：$${intervalLatex(set)}$。`,
          ),
        });
      },
    },
    {
      id: "unions-with-rays",
      title: t("Unions with unbounded intervals", "含无界区间的并集"),
      explanation: t(
        "The same idea works with rays. A ray absorbs any interval that overlaps it, two rays in the same direction give the longer ray, and two rays in opposite directions that overlap cover the whole line:\n\n$$(-\\infty, 1] \\cup (-2, 4) = (-\\infty, 4) \\qquad (-\\infty, 3) \\cup [0, \\infty) = (-\\infty, \\infty)$$",
        "射线也一样。射线会吞并与它重叠的区间；同方向的两条射线合并为较长的那条；方向相反且重叠的两条射线覆盖整条数轴：\n\n$$(-\\infty, 1] \\cup (-2, 4) = (-\\infty, 4) \\qquad (-\\infty, 3) \\cup [0, \\infty) = (-\\infty, \\infty)$$",
      ),
      generate(rng) {
        for (;;) {
          const A = randomInterval(rng, rng.pick(["left", "right"] as const));
          const B = randomInterval(rng, rng.pick(["left", "right", "bounded"] as const));
          const set = union(A, B);
          const both = intersect([A], [B]);
          if (set.length !== 1 || hasPoint(both) || setEqual([A], [B])) continue;
          const [first, second] = rng.bool() ? [A, B] : [B, A];
          return intervalProblem({
            prompt: ask(`Simplify $${show(first)} \\cup ${show(second)}$.`, `化简 $${show(first)} \\cup ${show(second)}$。`, asInterval),
            set,
            form: "interval",
            wrong: [both, toggleEnds(set)],
            solution: t(
              `${unionExplained.en} The two sets overlap, so the union is a single set: $${intervalLatex(set)}$.`,
              `${unionExplained["zh-CN"]}两个集合重叠，所以并集是一个整体：$${intervalLatex(set)}$。`,
            ),
          });
        }
      },
    },
    {
      id: "unions-that-stay-separate",
      title: t("Touching and separate intervals", "相接与分离的区间"),
      explanation: t(
        "Intervals that do not overlap stay separate in the union. Two intervals that meet at an endpoint join only if that endpoint is included in at least one of them:\n\n$$[1, 3) \\cup [3, 5] = [1, 5] \\qquad (1, 3) \\cup (3, 5) \\text{ stays as it is, since } 3 \\text{ is in neither}$$",
        "不重叠的区间在并集中保持分开。在一个端点相接的两个区间，只有当至少一个区间包含这个端点时才合并：\n\n$$[1, 3) \\cup [3, 5] = [1, 5] \\qquad (1, 3) \\cup (3, 5) \\text{ 保持不变，因为 } 3 \\text{ 不在任何一个里}$$",
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
        return intervalProblem({
          prompt: ask(`Simplify $${latex}$.`, `化简 $${latex}$。`, asInterval),
          set,
          form: "interval",
          wrong: [union(A2, B2, C), toggleEnds(set)],
          solution: t(
            `${unionExplained.en} $${show(A)}$ and $${show(B)}$ meet at $${meet}$, which ${touchA || touchB ? "is included in one of them, so they join" : "is in neither, so they stay separate"}; the third set does not touch them:${steps(intervalLatex(set))}`,
            `${unionExplained["zh-CN"]}$${show(A)}$ 与 $${show(B)}$ 在 $${meet}$ 相接，${touchA || touchB ? "其中一个包含它，所以两者合并" : "两者都不包含它，所以保持分开"}；第三个集合与它们不相接：${steps(intervalLatex(set))}`,
          ),
        });
      },
    },
  ],
};

export const intersectionsOfIntervals: TopicDef = {
  id: "intersections-of-intervals",
  title: t("Intersections of Intervals", "区间的交集"),
  summary: t("Find the numbers two intervals have in common, written with $\\cap$.", "求两个区间的公共部分，记作 $\\cap$。"),
  prerequisites: ["unions-of-intervals"],
  encompasses: [
    { topic: "unbounded-intervals", weight: 0.5 },
    { topic: "unions-of-intervals", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.REI.B.3"],
  knowledgePoints: [
    {
      id: "intersections-of-bounded-intervals",
      title: t("Overlapping intervals", "重叠的区间"),
      explanation: t(
        "The **intersection** $A \\cap B$ is the set of numbers in **both** $A$ and $B$. For two overlapping intervals it runs from the larger of the left endpoints to the smaller of the right endpoints, and each end keeps the bracket of the interval it came from:\n\n$$[-3, 2) \\cap (0, 5] = (0, 2)$$\n\nIf one interval lies inside the other, the intersection is the smaller one.",
        "**交集** $A \\cap B$ 是**同时**属于 $A$ 和 $B$ 的数组成的集合。两个重叠区间的交集从较大的左端点到较小的右端点，每一端保留它所来自的区间的括号：\n\n$$[-3, 2) \\cap (0, 5] = (0, 2)$$\n\n如果一个区间在另一个之内，交集就是较小的那个。",
      ),
      generate(rng) {
        const [A, B] = overlapping(rng);
        const set = intersect([A], [B]);
        return intervalProblem({
          prompt: ask(`Simplify $${show(A)} \\cap ${show(B)}$.`, `化简 $${show(A)} \\cap ${show(B)}$。`, asInterval),
          set,
          form: "interval",
          wrong: [union(A, B), toggleEnds(set)],
          solution: t(
            `${intersectionExplained.en} It runs from the larger left endpoint to the smaller right endpoint: $${intervalLatex(set)}$.`,
            `${intersectionExplained["zh-CN"]}它从较大的左端点到较小的右端点：$${intervalLatex(set)}$。`,
          ),
        });
      },
    },
    {
      id: "intersections-with-rays",
      title: t("Intersections with unbounded intervals", "含无界区间的交集"),
      explanation: t(
        "Two rays in opposite directions that overlap meet in a bounded interval; two rays in the same direction give the shorter ray; a ray cuts off part of an interval. Sets with nothing in common have the **empty set** $\\varnothing$ as their intersection:\n\n$$(-\\infty, 4] \\cap (-1, \\infty) = (-1, 4] \\qquad (-\\infty, 2) \\cap [5, \\infty) = \\varnothing$$",
        "方向相反且重叠的两条射线交于一个有界区间；同方向的两条射线的交集是较短的那条；射线会截去区间的一部分。没有公共数的两个集合，交集是**空集** $\\varnothing$：\n\n$$(-\\infty, 4] \\cap (-1, \\infty) = (-1, 4] \\qquad (-\\infty, 2) \\cap [5, \\infty) = \\varnothing$$",
      ),
      generate(rng) {
        for (;;) {
          const A = randomInterval(rng, rng.pick(["left", "right"] as const));
          const B = randomInterval(rng, rng.pick(["left", "right", "bounded"] as const));
          const set = intersect([A], [B]);
          if (hasPoint(set) || setEqual([A], [B]) || (set.length === 0 && !rng.bool(0.3))) continue;
          const [first, second] = rng.bool() ? [A, B] : [B, A];
          return intervalProblem({
            prompt: ask(`Simplify $${show(first)} \\cap ${show(second)}$.`, `化简 $${show(first)} \\cap ${show(second)}$。`, asInterval),
            set,
            form: "interval",
            wrong: [union(A, B), toggleEnds(set)],
            solution: t(
              `${intersectionExplained.en} ${set.length === 0 ? "These sets have no number in common" : "Keep only the part where the sets overlap"}: $${intervalLatex(set)}$.`,
              `${intersectionExplained["zh-CN"]}${set.length === 0 ? "这两个集合没有公共的数" : "只保留两个集合重叠的部分"}：$${intervalLatex(set)}$。`,
            ),
          });
        }
      },
    },
    {
      id: "union-or-intersection",
      title: t("Union or intersection", "并集还是交集"),
      explanation: t(
        "Read the symbol carefully: $\\cup$ (union) keeps numbers in **either** set, $\\cap$ (intersection) keeps numbers in **both**. For the same two sets the answers are very different:\n\n$$(-\\infty, 2] \\cup (0, \\infty) = (-\\infty, \\infty) \\qquad (-\\infty, 2] \\cap (0, \\infty) = (0, 2]$$",
        "注意符号：$\\cup$（并集）保留属于**任一**集合的数，$\\cap$（交集）保留**同时**属于两个集合的数。同样的两个集合，结果可能大不相同：\n\n$$(-\\infty, 2] \\cup (0, \\infty) = (-\\infty, \\infty) \\qquad (-\\infty, 2] \\cap (0, \\infty) = (0, 2]$$",
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
          return intervalProblem({
            prompt: ask(`Simplify $${show(A)} ${symbol} ${show(B)}$.`, `化简 $${show(A)} ${symbol} ${show(B)}$。`, asInterval),
            set,
            form: "interval",
            wrong: [isUnion ? both : either, toggleEnds(set)],
            solution: t(
              `${(isUnion ? unionExplained : intersectionExplained).en}${steps(`${show(A)} ${symbol} ${show(B)} = ${intervalLatex(set)}`)}`,
              `${(isUnion ? unionExplained : intersectionExplained)["zh-CN"]}${steps(`${show(A)} ${symbol} ${show(B)} = ${intervalLatex(set)}`)}`,
            ),
          });
        }
      },
    },
  ],
};

/** Part is one linear inequality ax + b op c of a compound inequality, with its solution x opSol v. */
interface Part {
  readonly latex: string;
  readonly solved: Interval;
  /** naive is the solution found by forgetting to reverse the symbol. */
  readonly naive: Interval;
  readonly work: string;
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
  return {
    latex,
    solved: ray(opSol, v),
    naive: ray(op, v),
    work: `${latex} \\;\\Rightarrow\\; ${middle}${inequalityLatex("x", opSol, v)}`,
  };
}

const orSolution = (p: Part, q: Part, set: RealSet): Text =>
  t(
    `Solve each part, reversing the symbol when dividing by a negative number:${steps(p.work, q.work)}A number is a solution if it satisfies **either** part, so take the union: $${intervalLatex(set)}$.`,
    `分别解每一部分，除以负数时改变不等号方向：${steps(p.work, q.work)}满足**任一**部分的数都是解，所以取并集：$${intervalLatex(set)}$。`,
  );

const andSolution = (p: Part, q: Part, set: RealSet): Text =>
  t(
    `Solve each part, reversing the symbol when dividing by a negative number:${steps(p.work, q.work)}A solution must satisfy **both** parts, so take the intersection: $${intervalLatex(set)}$.`,
    `分别解每一部分，除以负数时改变不等号方向：${steps(p.work, q.work)}解必须同时满足**两部分**，所以取交集：$${intervalLatex(set)}$。`,
  );

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
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.3"],
  knowledgePoints: [
    {
      id: "solving-or-inequalities",
      title: t("Solving OR inequalities", "解“或”型不等式"),
      explanation: t(
        "A compound inequality joined by **or** is true when **at least one** of its parts is true, so its solution set is the **union** of the parts' solution sets. Solve each part separately:\n\n$$2x + 1 < -3 \\;\\Rightarrow\\; x < -2 \\qquad 3x - 2 \\ge 7 \\;\\Rightarrow\\; x \\ge 3$$\n\nThe solution of $2x + 1 < -3 \\text{ or } 3x - 2 \\ge 7$ is $(-\\infty, -2) \\cup [3, \\infty)$.",
        "用**或**连接的复合不等式，只要**至少一部分**成立就成立，所以解集是各部分解集的**并集**。分别解每一部分：\n\n$$2x + 1 < -3 \\;\\Rightarrow\\; x < -2 \\qquad 3x - 2 \\ge 7 \\;\\Rightarrow\\; x \\ge 3$$\n\n$2x + 1 < -3 \\text{ 或 } 3x - 2 \\ge 7$ 的解集是 $(-\\infty, -2) \\cup [3, \\infty)$。",
      ),
      generate(rng) {
        const [o1, p, o2, r] = splitRays(rng);
        const parts = [part(rng, o1, p, false), part(rng, o2, r, false)];
        const [A, B] = rng.bool() ? parts : [parts[1]!, parts[0]!];
        const set = union(A!.solved, B!.solved);
        return intervalProblem({
          prompt: orPrompt(A!, B!),
          set,
          form: "interval",
          wrong: [[], toggleEnds(set), union(A!.solved)],
          solution: orSolution(A!, B!, set),
        });
      },
    },
    {
      id: "or-inequalities-with-negative-coefficients",
      title: t("Negative coefficients", "系数为负"),
      explanation: t(
        "Solve each part on its own terms: a part whose coefficient is negative reverses its symbol when you divide, and the other part does not.\n\n$$4 - x \\ge 6 \\;\\Rightarrow\\; -x \\ge 2 \\;\\Rightarrow\\; x \\le -2$$",
        "每一部分单独处理：系数为负的部分在相除时改变不等号方向，另一部分则不变。\n\n$$4 - x \\ge 6 \\;\\Rightarrow\\; -x \\ge 2 \\;\\Rightarrow\\; x \\le -2$$",
      ),
      generate(rng) {
        const [o1, p, o2, r] = splitRays(rng);
        const [n1, n2] = negatives(rng);
        const parts = [part(rng, o1, p, n1), part(rng, o2, r, n2)];
        const [A, B] = rng.bool() ? parts : [parts[1]!, parts[0]!];
        const set = union(A!.solved, B!.solved);
        return intervalProblem({
          prompt: orPrompt(A!, B!),
          set,
          form: "interval",
          wrong: [union(A!.naive, B!.naive), [], toggleEnds(set)],
          solution: orSolution(A!, B!, set),
        });
      },
    },
    {
      id: "or-inequalities-that-overlap",
      title: t("When the parts overlap", "各部分重叠时"),
      explanation: t(
        "When the solution sets of the parts overlap, the union merges them. Rays in opposite directions that overlap cover every real number; rays in the same direction give the longer ray:\n\n$$x > -1 \\text{ or } x < 4 \\;\\Rightarrow\\; (-\\infty, \\infty) \\qquad x < 2 \\text{ or } x \\le 5 \\;\\Rightarrow\\; (-\\infty, 5]$$",
        "各部分的解集重叠时，并集会把它们合并。方向相反且重叠的射线覆盖全体实数；同方向的射线得到较长的那条：\n\n$$x > -1 \\text{ 或 } x < 4 \\;\\Rightarrow\\; (-\\infty, \\infty) \\qquad x < 2 \\text{ 或 } x \\le 5 \\;\\Rightarrow\\; (-\\infty, 5]$$",
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
        return intervalProblem({
          prompt: orPrompt(A!, B!),
          set,
          form: "interval",
          wrong: [intersect([A!.solved], [B!.solved]), toggleEnds(set)],
          solution: orSolution(A!, B!, set),
        });
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
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.3"],
  knowledgePoints: [
    {
      id: "solving-and-inequalities",
      title: t("Solving AND inequalities", "解“且”型不等式"),
      explanation: t(
        "A compound inequality joined by **and** is true only when **both** parts are true, so its solution set is the **intersection** of the parts' solution sets:\n\n$$2x - 1 > 3 \\;\\Rightarrow\\; x > 2 \\qquad 3x + 2 \\le 20 \\;\\Rightarrow\\; x \\le 6$$\n\nThe solution of $2x - 1 > 3 \\text{ and } 3x + 2 \\le 20$ is $(2, 6]$, the same as the double inequality $2 < x \\le 6$.",
        "用**且**连接的复合不等式，只有**两部分都**成立时才成立，所以解集是各部分解集的**交集**：\n\n$$2x - 1 > 3 \\;\\Rightarrow\\; x > 2 \\qquad 3x + 2 \\le 20 \\;\\Rightarrow\\; x \\le 6$$\n\n$2x - 1 > 3 \\text{ 且 } 3x + 2 \\le 20$ 的解集是 $(2, 6]$，与连不等式 $2 < x \\le 6$ 相同。",
      ),
      generate(rng) {
        const [less, small, greater, large] = splitRays(rng);
        const parts = [part(rng, greater, small, false), part(rng, less, large, false)];
        const [A, B] = rng.bool() ? parts : [parts[1]!, parts[0]!];
        const set = intersect([A!.solved], [B!.solved]);
        return intervalProblem({
          prompt: andPrompt(A!, B!),
          set,
          form: "interval",
          wrong: [union(A!.solved, B!.solved), toggleEnds(set)],
          solution: andSolution(A!, B!, set),
        });
      },
    },
    {
      id: "and-inequalities-with-negative-coefficients",
      title: t("Negative coefficients", "系数为负"),
      explanation: t(
        "As with “or”, solve each part on its own and reverse a symbol only in the part where you divide by a negative number:\n\n$$-2x < 6 \\text{ and } x - 4 \\le 1 \\;\\Rightarrow\\; x > -3 \\text{ and } x \\le 5 \\;\\Rightarrow\\; (-3, 5]$$",
        "与“或”一样，分别解每一部分，只在除以负数的那一部分改变不等号方向：\n\n$$-2x < 6 \\text{ 且 } x - 4 \\le 1 \\;\\Rightarrow\\; x > -3 \\text{ 且 } x \\le 5 \\;\\Rightarrow\\; (-3, 5]$$",
      ),
      generate(rng) {
        const [less, small, greater, large] = splitRays(rng);
        const [n1, n2] = negatives(rng);
        const parts = [part(rng, greater, small, n1), part(rng, less, large, n2)];
        const [A, B] = rng.bool() ? parts : [parts[1]!, parts[0]!];
        const set = intersect([A!.solved], [B!.solved]);
        return intervalProblem({
          prompt: andPrompt(A!, B!),
          set,
          form: "interval",
          wrong: [intersect([A!.naive], [B!.naive]), union(A!.solved, B!.solved), toggleEnds(set)],
          solution: andSolution(A!, B!, set),
        });
      },
    },
    {
      id: "and-inequalities-with-no-solution",
      title: t("No solution or a single ray", "无解或一条射线"),
      explanation: t(
        "If the parts' solution sets do not overlap, no number satisfies both and the solution set is $\\varnothing$. If both are rays in the same direction, the intersection is the shorter ray:\n\n$$x < -1 \\text{ and } x \\ge 3 \\;\\Rightarrow\\; \\varnothing \\qquad x > 0 \\text{ and } x \\ge 4 \\;\\Rightarrow\\; [4, \\infty)$$",
        "如果各部分的解集不重叠，没有数能同时满足，解集是 $\\varnothing$。如果两部分都是同方向的射线，交集是较短的那条：\n\n$$x < -1 \\text{ 且 } x \\ge 3 \\;\\Rightarrow\\; \\varnothing \\qquad x > 0 \\text{ 且 } x \\ge 4 \\;\\Rightarrow\\; [4, \\infty)$$",
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
        return intervalProblem({
          prompt: andPrompt(A!, B!),
          set,
          form: "interval",
          wrong: [union(A!.solved, B!.solved), toggleEnds(set)],
          solution: andSolution(A!, B!, set),
        });
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
        `The speed limit on a road is ${n} km/h. Let $s$ be a speed, in km/h, that obeys the limit.`,
        `一条道路的限速是每小时 ${n} 千米。设 $s$ 为符合限速的车速（千米/时）。`,
      ),
    variable: "s",
    op: "<=",
    values: [30, 120],
  },
  {
    text: (n) =>
      t(
        `A film may only be seen by viewers older than ${n}. Let $a$ be the age of a viewer who may see it.`,
        `一部电影只允许年龄大于 ${n} 岁的观众观看。设 $a$ 为可以观看的观众的年龄。`,
      ),
    variable: "a",
    op: ">",
    values: [10, 21],
  },
  {
    text: (n) =>
      t(
        `Kim wants to spend less than ${n} dollars on a gift. Let $c$ be the cost of the gift, in dollars.`,
        `小金想花少于 ${n} 元买礼物。设 $c$ 为礼物的价格（元）。`,
      ),
    variable: "c",
    op: "<",
    values: [15, 90],
  },
  {
    text: (n) =>
      t(
        `A team needs more than ${n} points to reach the playoffs. Let $p$ be the team's number of points.`,
        `一支球队需要超过 ${n} 分才能进入季后赛。设 $p$ 为该队的得分。`,
      ),
    variable: "p",
    op: ">",
    values: [20, 70],
  },
  {
    text: (n) =>
      t(
        `The temperature in a freezer must stay below ${n} °C. Let $t$ be the temperature in the freezer, in degrees Celsius.`,
        `冷冻柜内的温度必须保持在 ${n}°C 以下。设 $t$ 为冷冻柜内的温度（摄氏度）。`,
      ),
    variable: "t",
    op: "<",
    values: [-25, -12],
  },
  {
    text: (n) =>
      t(
        `A trip will run only if no fewer than ${n} people sign up. Let $n$ be the number of people who sign up for a trip that runs.`,
        `报名人数不少于 ${n} 人时旅行才会成行。设 $n$ 为一次成行的旅行的报名人数。`,
      ),
    variable: "n",
    op: ">=",
    values: [8, 40],
  },
  {
    text: (n) =>
      t(
        `A carry-on bag may weigh no more than ${n} kg. Let $m$ be the weight of a bag that is allowed, in kilograms.`,
        `随身行李的重量不能超过 ${n} 千克。设 $m$ 为允许携带的行李重量（千克）。`,
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
        `A summer camp accepts children from ${a} to ${b} years old, inclusive. Let $a$ be the age of a camper.`,
        `一个夏令营接收 ${a} 到 ${b} 岁（含 ${a} 岁和 ${b} 岁）的儿童。设 $a$ 为营员的年龄。`,
      ),
    variable: "a",
    closed: [true, true],
    low: [5, 9],
    width: [3, 8],
  },
  {
    text: (a, b) =>
      t(
        `A plant grows well when the temperature is above ${a} °C but below ${b} °C. Let $t$ be such a temperature, in degrees Celsius.`,
        `当温度高于 ${a}°C 且低于 ${b}°C 时，一种植物长得好。设 $t$ 为这样的温度（摄氏度）。`,
      ),
    variable: "t",
    closed: [false, false],
    low: [5, 18],
    width: [8, 20],
  },
  {
    text: (a, b) =>
      t(
        `A parcel ships at the medium rate if it weighs more than ${a} kg and at most ${b} kg. Let $w$ be the weight of such a parcel, in kilograms.`,
        `重量超过 ${a} 千克且不超过 ${b} 千克的包裹按中档运费寄送。设 $w$ 为这样的包裹的重量（千克）。`,
      ),
    variable: "w",
    closed: [false, true],
    low: [1, 10],
    width: [2, 15],
  },
  {
    text: (a, b) =>
      t(
        `A score of at least ${a} but less than ${b} earns a B. Let $s$ be a score that earns a B.`,
        `成绩至少 ${a} 分但低于 ${b} 分为 B 等。设 $s$ 为获得 B 等的成绩。`,
      ),
    variable: "s",
    closed: [true, false],
    low: [60, 85],
    width: [5, 15],
  },
  {
    text: (a, b) =>
      t(
        `On a highway, cars must drive faster than ${a} km/h but no faster than ${b} km/h. Let $v$ be an allowed speed, in km/h.`,
        `在一条高速公路上，车速必须高于每小时 ${a} 千米，但不能高于每小时 ${b} 千米。设 $v$ 为允许的车速（千米/时）。`,
      ),
    variable: "v",
    closed: [false, true],
    low: [40, 70],
    width: [30, 60],
  },
];

/** linearModel draws a situation with the inequality that models it and three that do not. */
function linearModel(rng: Rng): { prompt: Text; correct: string; others: string[] } {
  const kind = rng.int(0, 2);
  if (kind === 0) {
    const f = rng.int(10, 40);
    let r = rng.int(2, 9);
    if (r === f) r += 1;
    const B = f + r * rng.int(4, 20);
    return {
      prompt: t(
        `A phone plan costs ${f} dollars a month plus ${r} dollars for each gigabyte of data. Ana wants her monthly bill to be at most ${B} dollars. Which inequality describes the numbers of gigabytes $g$ she can use?`,
        `某手机套餐每月收费 ${f} 元，另外每使用 1 GB 流量收费 ${r} 元。安娜希望每月账单不超过 ${B} 元。下列哪个不等式描述了她可以使用的流量 $g$（GB）？`,
      ),
      correct: `${f} + ${r}g \\le ${B}`,
      others: [`${f} + ${r}g \\ge ${B}`, `${r} + ${f}g \\le ${B}`, `${f + r}g \\le ${B}`],
    };
  }
  if (kind === 1) {
    const s = rng.int(20, 150);
    let r = rng.int(5, 40);
    if (r === s) r += 1;
    const T = s + r * rng.int(3, 15);
    return {
      prompt: t(
        `Leo has ${s} dollars saved and saves ${r} dollars more each week. Which inequality describes the numbers of weeks $w$ after which he has at least ${T} dollars?`,
        `小李已经存了 ${s} 元，每周再存 ${r} 元。下列哪个不等式描述了使他至少有 ${T} 元的周数 $w$？`,
      ),
      correct: `${s} + ${r}w \\ge ${T}`,
      others: [`${s} + ${r}w \\le ${T}`, `${r} + ${s}w \\ge ${T}`, `${s} - ${r}w \\ge ${T}`],
    };
  }
  const r = rng.int(2, 12);
  const V = r * rng.int(20, 60);
  const L = r * rng.int(2, 15);
  return {
    prompt: t(
      `A tank holds ${V} liters of water and drains at ${r} liters per minute. Which inequality describes the times $m$, in minutes, at which it still holds more than ${L} liters?`,
      `一个水箱装有 ${V} 升水，每分钟流出 ${r} 升。下列哪个不等式描述了水箱中仍多于 ${L} 升水的时刻 $m$（分钟）？`,
    ),
    correct: `${V} - ${r}m > ${L}`,
    others: [`${V} - ${r}m < ${L}`, `${V} + ${r}m > ${L}`, `${r}m - ${V} > ${L}`],
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
  const fill = (s: string) => s.replace("{L}", String(L)).replace("{H}", String(H));
  return t(fill(w.en), fill(w["zh-CN"]));
}

export const introductionToModelingWithInequalities: TopicDef = {
  id: "introduction-to-modeling-with-inequalities",
  title: t("Introduction to Modeling With Inequalities", "用不等式建模入门"),
  summary: t(
    "Translate limits stated in words, such as “at least” or “between”, into inequalities.",
    "把“至少”“介于……之间”等文字表述的限制翻译成不等式。",
  ),
  prerequisites: ["solving-compound-inequalities"],
  encompasses: [{ topic: "inequalities-and-solutions", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.HSA.CED.A.3"],
  knowledgePoints: [
    {
      id: "constraints-from-words",
      title: t("One limit", "单个限制"),
      explanation: t(
        "Real situations state limits in words. Watch whether the boundary itself is allowed:\n\n| Words | Symbol |\n| :--- | :--- |\n| at least, no less than, minimum | $\\ge$ |\n| at most, no more than, maximum | $\\le$ |\n| more than, above, older than | $>$ |\n| less than, below, under | $<$ |\n\n“A rider must be at least $120$ cm tall” means $h \\ge 120$: a rider of exactly $120$ cm may ride.",
        "实际情境常用文字表述限制。注意边界值本身是否允许：\n\n| 文字 | 符号 |\n| :--- | :--- |\n| 至少、不少于、最低 | $\\ge$ |\n| 至多、不超过、最高 | $\\le$ |\n| 多于、高于、大于 | $>$ |\n| 少于、低于、不到 | $<$ |\n\n“乘客身高必须至少为 $120$ 厘米”表示 $h \\ge 120$：身高恰好 $120$ 厘米的人可以乘坐。",
      ),
      generate(rng) {
        const c = rng.pick(constraints);
        const n = rng.int(c.values[0], c.values[1]);
        const text = c.text(n);
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
            `The words allow ${c.op.length === 2 ? `$${n}$ itself` : `values beyond $${n}$ but not $${n}$ itself`}: $${inequalityLatex(c.variable, c.op, n)}$.`,
            `按照题意，${c.op.length === 2 ? `$${n}$ 本身也允许` : `$${n}$ 本身不允许`}：$${inequalityLatex(c.variable, c.op, n)}$。`,
          ),
        });
      },
    },
    {
      id: "ranges-from-words",
      title: t("A range between two limits", "两个限制之间的范围"),
      explanation: t(
        "A quantity limited from both sides is described by a double inequality. “Inclusive” means both bounds are allowed:\n\n“Children from $8$ to $12$ years old, inclusive” means $8 \\le a \\le 12$; “above $10$ °C but below $25$ °C” means $10 < t < 25$.",
        "两侧都受限制的量用连不等式描述。“含”表示两个边界都允许：\n\n“$8$ 到 $12$ 岁（含）的儿童”表示 $8 \\le a \\le 12$；“高于 $10$°C 且低于 $25$°C”表示 $10 < t < 25$。",
      ),
      generate(rng) {
        const r = rng.pick(ranges);
        const a = rng.int(r.low[0], r.low[1]);
        const b = a + rng.int(r.width[0], r.width[1]);
        const [lc, hc] = r.closed;
        const set = union(span(a, lc, b, hc));
        const text = r.text(a, b);
        return intervalProblem({
          prompt: t(`${text.en} Write a double inequality for $${r.variable}$.`, `${text["zh-CN"]}写出关于 $${r.variable}$ 的连不等式。`),
          set,
          form: "inequality",
          variable: r.variable,
          wrong: [union(span(a, !lc, b, !hc)), union(span(a, hc, b, lc)), union(span(a, true, b, true))],
          solution: t(
            `$${a}$ is ${lc ? "allowed" : "not allowed"} and $${b}$ is ${hc ? "allowed" : "not allowed"}: $${inequalityLatexOf(set, r.variable)}$.`,
            `$${a}$ ${lc ? "允许" : "不允许"}，$${b}$ ${hc ? "允许" : "不允许"}：$${inequalityLatexOf(set, r.variable)}$。`,
          ),
        });
      },
    },
    {
      id: "choosing-an-inequality",
      title: t("Choosing a model", "选择模型"),
      explanation: t(
        "To model a situation, write the quantity that is limited as an expression in the unknown, then compare it with the limit. A plan costing $20$ dollars plus $3$ dollars per gigabyte costs $20 + 3g$ for $g$ gigabytes; a bill of at most $50$ dollars means\n\n$$20 + 3g \\le 50$$",
        "建模时，先把受限制的量写成关于未知数的式子，再与限制值比较。月费 $20$ 元、每 GB 流量 $3$ 元的套餐，用 $g$ GB 的费用是 $20 + 3g$；账单不超过 $50$ 元就是\n\n$$20 + 3g \\le 50$$",
      ),
      generate(rng) {
        const m = linearModel(rng);
        const options = rng.shuffle([m.correct, ...m.others]);
        return choiceProblem({
          prompt: m.prompt,
          options: options.map((o) => same(`$${o}$`)),
          correct: options.indexOf(m.correct),
          solution: t(`The limited quantity compared with its limit: $${m.correct}$.`, `把受限制的量与限制值比较：$${m.correct}$。`),
        });
      },
    },
  ],
};

/** oneStepModel draws a situation solved by one inverse operation. */
function oneStepModel(rng: Rng): {
  text: Text;
  variable: string;
  op: InequalityOp;
  value: Q;
  wrong: [InequalityOp, Q][];
  work: string;
} {
  const kind = rng.int(0, 3);
  if (kind === 0) {
    const C = 50 * rng.int(20, 60);
    const L = 50 * rng.int(4, C / 50 - 2);
    return {
      text: t(
        `A truck can carry at most ${C} kg. It is already loaded with ${L} kg. Let $w$ be the additional weight, in kilograms, that may be loaded.`,
        `一辆卡车最多能载重 ${C} 千克，车上已装有 ${L} 千克货物。设 $w$ 为还可以装载的重量（千克）。`,
      ),
      variable: "w",
      op: "<=",
      value: Q.of(C - L),
      wrong: [
        [">=", Q.of(C - L)],
        ["<=", Q.of(C + L)],
      ],
      work: `${L} + w \\le ${C} \\;\\Rightarrow\\; w \\le ${C - L}`,
    };
  }
  if (kind === 1) {
    const r = rng.int(8, 25);
    const D = rng.int(20, 120);
    const v = Q.of(D, r);
    return {
      text: t(
        `A cyclist rides at ${r} km/h. Let $t$ be a riding time, in hours, in which she covers at least ${D} km.`,
        `一名骑行者的速度是每小时 ${r} 千米。设 $t$ 为她至少骑行 ${D} 千米所用的时间（小时）。`,
      ),
      variable: "t",
      op: ">=",
      value: v,
      wrong: [
        ["<=", v],
        [">=", Q.of(D * r)],
      ],
      work: `${r}t \\ge ${D} \\;\\Rightarrow\\; t \\ge ${num(v)}`,
    };
  }
  if (kind === 2) {
    const r = rng.int(5, 30);
    const C = 50 * rng.int(6, 60);
    const v = Q.of(C, r);
    return {
      text: t(
        `A pump fills a pool at ${r} liters per minute. The pool holds at most ${C} liters. Let $m$ be a pumping time, in minutes, that does not make the pool overflow.`,
        `一台水泵每分钟向水池注水 ${r} 升，水池最多能装 ${C} 升。设 $m$ 为不会使水池溢出的注水时间（分钟）。`,
      ),
      variable: "m",
      op: "<=",
      value: v,
      wrong: [
        [">=", v],
        ["<=", Q.of(C - r)],
      ],
      work: `${r}m \\le ${C} \\;\\Rightarrow\\; m \\le ${num(v)}`,
    };
  }
  const s = rng.int(10, 200);
  const T = s + rng.int(20, 400);
  return {
    text: t(
      `Mia has saved ${s} dollars. She needs at least ${T} dollars for a bike. Let $d$ be the additional amount, in dollars, she must save.`,
      `米娅已经存了 ${s} 元，她至少需要 ${T} 元买一辆自行车。设 $d$ 为她还需要存的钱（元）。`,
    ),
    variable: "d",
    op: ">=",
    value: Q.of(T - s),
    wrong: [
      ["<=", Q.of(T - s)],
      [">=", Q.of(T + s)],
    ],
    work: `${s} + d \\ge ${T} \\;\\Rightarrow\\; d \\ge ${T - s}`,
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
  knowledgePoints: [
    {
      id: "solving-one-step-models",
      title: t("Writing and solving the model", "列出并求解模型"),
      explanation: t(
        "Write the inequality the situation describes, then solve it. A truck that carries at most $2000$ kg and already holds $750$ kg can take $w$ more kilograms with\n\n$$750 + w \\le 2000 \\;\\Rightarrow\\; w \\le 1250$$",
        "先列出情境所描述的不等式，再求解。最多载重 $2000$ 千克、已装 $750$ 千克的卡车，还能装 $w$ 千克，满足\n\n$$750 + w \\le 2000 \\;\\Rightarrow\\; w \\le 1250$$",
      ),
      generate(rng) {
        const m = oneStepModel(rng);
        return inequalityProblem({
          prompt: t(`${m.text.en} Solve an inequality for $${m.variable}$.`, `${m.text["zh-CN"]}列出关于 $${m.variable}$ 的不等式并求解。`),
          variable: m.variable,
          op: m.op,
          value: m.value,
          wrong: m.wrong,
          solution: t(`Write the inequality and solve it:${steps(m.work)}`, `列出不等式并求解：${steps(m.work)}`),
        });
      },
    },
    {
      id: "whole-number-answers",
      title: t("Whole-number answers", "整数答案"),
      explanation: t(
        "When the unknown counts objects, the answer must be a whole number, and the inequality tells which way to round. With $20$ dollars and notebooks at $3$ dollars, $3n \\le 20$ gives $n \\le 6\\frac{2}{3}$, so the greatest number is $6$ (rounding up to $7$ would cost $21$). To pack at least $100$ eggs in boxes of $12$, $12b \\ge 100$ gives $b \\ge 8\\frac{1}{3}$, so the least number is $9$.",
        "当未知数表示物体个数时，答案必须是整数，而不等式决定向哪个方向取整。有 $20$ 元、笔记本每本 $3$ 元时，$3n \\le 20$ 得 $n \\le 6\\frac{2}{3}$，所以最多买 $6$ 本（买 $7$ 本要 $21$ 元）。要用每盒 $12$ 个的盒子装至少 $100$ 个鸡蛋，$12b \\ge 100$ 得 $b \\ge 8\\frac{1}{3}$，所以至少需要 $9$ 盒。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        let text: Text;
        let answer: number;
        let work: string;
        let greatest: boolean;
        if (kind === 0) {
          const p = rng.int(2, 9);
          const B = rng.int(15, 100);
          answer = Math.floor(B / p);
          greatest = true;
          work = `${p}n \\le ${B} \\;\\Rightarrow\\; n \\le ${num(Q.of(B, p))}`;
          text = t(
            `Notebooks cost ${p} dollars each and Sam has ${B} dollars. What is the greatest number of notebooks he can buy?`,
            `笔记本每本 ${p} 元，小山有 ${B} 元。他最多能买多少本笔记本？`,
          );
        } else if (kind === 1) {
          const k = rng.pick([6, 10, 12, 18, 24, 30]);
          const N = rng.int(40, 400);
          answer = Math.ceil(N / k);
          greatest = false;
          work = `${k}b \\ge ${N} \\;\\Rightarrow\\; b \\ge ${num(Q.of(N, k))}`;
          text = t(
            `A farm packs eggs in boxes of ${k}. What is the least number of boxes needed to pack at least ${N} eggs?`,
            `一个农场用每盒 ${k} 个的盒子装鸡蛋。要装至少 ${N} 个鸡蛋，至少需要多少盒？`,
          );
        } else if (kind === 2) {
          const k = rng.int(30, 60);
          const N = rng.int(80, 500);
          answer = Math.ceil(N / k);
          greatest = false;
          work = `${k}b \\ge ${N} \\;\\Rightarrow\\; b \\ge ${num(Q.of(N, k))}`;
          text = t(
            `Each bus holds ${k} students. What is the least number of buses needed to carry ${N} students?`,
            `每辆大巴能坐 ${k} 名学生。运送 ${N} 名学生至少需要多少辆大巴？`,
          );
        } else {
          const w = rng.int(12, 40);
          const C = 10 * rng.int(30, 150);
          answer = Math.floor(C / w);
          greatest = true;
          work = `${w}n \\le ${C} \\;\\Rightarrow\\; n \\le ${num(Q.of(C, w))}`;
          text = t(
            `A lift can carry at most ${C} kg. Each crate weighs ${w} kg. What is the greatest number of crates it can carry at once?`,
            `一台升降机最多能载重 ${C} 千克，每个箱子重 ${w} 千克。它一次最多能运多少个箱子？`,
          );
        }
        return numberProblem({
          prompt: text,
          answer,
          form: "integer",
          wrong: greatest ? [answer + 1] : [answer - 1],
          solution: t(
            `Write and solve the inequality:${steps(work)}The number must be a whole number ${greatest ? "no greater than this, so round down" : "no less than this, so round up"}: $${answer}$.`,
            `列出不等式并求解：${steps(work)}答案必须是${greatest ? "不大于它的整数，所以向下取整" : "不小于它的整数，所以向上取整"}：$${answer}$。`,
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
  knowledgePoints: [
    {
      id: "fixed-amount-and-rate",
      title: t("A fixed amount and a rate", "固定量加变化率"),
      explanation: t(
        "Many situations combine a fixed amount with an amount per unit. A taxi that charges $5$ dollars plus $2$ dollars per kilometer costs $5 + 2d$ for $d$ km; spending at most $30$ dollars means\n\n$$5 + 2d \\le 30 \\;\\Rightarrow\\; 2d \\le 25 \\;\\Rightarrow\\; d \\le 12.5$$\n\nWhen the amount **decreases** with the unknown, the coefficient is negative and the symbol reverses when you divide.",
        "许多情境由固定量和单位量组成。起步价 $5$ 元、每千米 $2$ 元的出租车，行驶 $d$ 千米的费用是 $5 + 2d$；花费不超过 $30$ 元就是\n\n$$5 + 2d \\le 30 \\;\\Rightarrow\\; 2d \\le 25 \\;\\Rightarrow\\; d \\le 12.5$$\n\n当这个量随未知数**减少**时，系数为负，相除时不等号要改变方向。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const f = rng.int(3, 9);
          const r = rng.int(2, 5);
          const B = f + rng.int(5, 30) * r + rng.int(0, r - 1);
          const v = Q.of(B - f, r);
          return inequalityProblem({
            prompt: t(
              `A taxi charges ${f} dollars plus ${r} dollars per kilometer. Ben can spend at most ${B} dollars. Let $d$ be a distance in kilometers that he can afford. Solve an inequality for $d$.`,
              `一辆出租车起步价 ${f} 元，另外每千米收费 ${r} 元。小本最多能花 ${B} 元。设 $d$ 为他负担得起的行驶距离（千米）。列出关于 $d$ 的不等式并求解。`,
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
              `The fare is $${f} + ${r}d$:${steps(`${f} + ${r}d \\le ${B}`, `${r}d \\le ${B - f}`, `d \\le ${num(v)}`)}`,
              `车费是 $${f} + ${r}d$：${steps(`${f} + ${r}d \\le ${B}`, `${r}d \\le ${B - f}`, `d \\le ${num(v)}`)}`,
            ),
          });
        }
        if (kind === 1) {
          const P = rng.int(70, 100);
          const r = rng.int(4, 15);
          const L = rng.int(5, 30);
          const v = Q.of(P - L, r);
          return inequalityProblem({
            prompt: t(
              `A phone battery is at ${P}% and loses ${r} percentage points of charge per hour. Let $h$ be a number of hours after which the charge is still at least ${L}%. Solve an inequality for $h$.`,
              `一部手机的电量是 ${P}%，每小时下降 ${r} 个百分点。设 $h$ 为经过的小时数，此时电量仍至少为 ${L}%。列出关于 $h$ 的不等式并求解。`,
            ),
            variable: "h",
            op: "<=",
            value: v,
            wrong: [
              [">=", v],
              ["<=", Q.of(P + L, r)],
            ],
            solution: t(
              `The charge after $h$ hours is $${P} - ${r}h$. Dividing by $-${r}$ reverses the symbol:${steps(`${P} - ${r}h \\ge ${L}`, `-${r}h \\ge ${L - P}`, `h \\le ${num(v)}`)}`,
              `$h$ 小时后的电量是 $${P} - ${r}h$。除以 $-${r}$ 时不等号改变方向：${steps(`${P} - ${r}h \\ge ${L}`, `-${r}h \\ge ${L - P}`, `h \\le ${num(v)}`)}`,
            ),
          });
        }
        const s = rng.int(0, 150);
        const r = rng.int(8, 40);
        const T = s + rng.int(3, 20) * r + rng.int(0, r - 1);
        const v = Q.of(T - s, r);
        return inequalityProblem({
          prompt: t(
            `Lena has ${s} dollars and saves ${r} dollars a week. Let $w$ be a number of weeks after which she has at least ${T} dollars. Solve an inequality for $w$.`,
            `莉娜有 ${s} 元，每周存 ${r} 元。设 $w$ 为周数，此时她至少有 ${T} 元。列出关于 $w$ 的不等式并求解。`,
          ),
          variable: "w",
          op: ">=",
          value: v,
          wrong: [
            ["<=", v],
            [">=", Q.of(T, r)],
          ],
          solution: t(
            `After $w$ weeks she has $${s} + ${r}w$:${steps(`${s} + ${r}w \\ge ${T}`, `${r}w \\ge ${T - s}`, `w \\ge ${num(v)}`)}`,
            `$w$ 周后她有 $${s} + ${r}w$ 元：${steps(`${s} + ${r}w \\ge ${T}`, `${r}w \\ge ${T - s}`, `w \\ge ${num(v)}`)}`,
          ),
        });
      },
    },
    {
      id: "greatest-or-least-whole-number",
      title: t("The greatest or least whole number", "最大或最小的整数"),
      explanation: t(
        "Solve the two-step inequality, then round in the direction the inequality allows. A room that costs $150$ dollars plus $18$ dollars per guest, with a budget of $500$ dollars:\n\n$$150 + 18g \\le 500 \\;\\Rightarrow\\; g \\le 19\\frac{4}{9}$$\n\nso at most $19$ guests.",
        "先解两步不等式，再按不等式允许的方向取整。场地费 $150$ 元、每位客人 $18$ 元、预算 $500$ 元：\n\n$$150 + 18g \\le 500 \\;\\Rightarrow\\; g \\le 19\\frac{4}{9}$$\n\n所以最多 $19$ 位客人。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        let text: Text;
        let work: string;
        let answer: number;
        let forgot: number;
        let greatest: boolean;
        if (kind === 0) {
          const f = 10 * rng.int(5, 20);
          const r = rng.int(12, 30);
          const B = f + rng.int(8, 40) * r + rng.int(0, r - 1);
          answer = Math.floor((B - f) / r);
          forgot = Math.floor(B / r);
          greatest = true;
          work = `${f} + ${r}g \\le ${B} \\;\\Rightarrow\\; ${r}g \\le ${B - f} \\;\\Rightarrow\\; g \\le ${num(Q.of(B - f, r))}`;
          text = t(
            `A party room costs ${f} dollars plus ${r} dollars per guest. The budget is ${B} dollars. What is the greatest number of guests that can be invited?`,
            `派对场地费 ${f} 元，另外每位客人 ${r} 元。预算是 ${B} 元。最多能邀请多少位客人？`,
          );
        } else if (kind === 1) {
          const s = rng.int(0, 120);
          const r = rng.int(15, 45);
          const T = s + rng.int(4, 20) * r + rng.int(1, r - 1);
          answer = Math.ceil((T - s) / r);
          forgot = Math.ceil(T / r);
          greatest = false;
          work = `${s} + ${r}w \\ge ${T} \\;\\Rightarrow\\; ${r}w \\ge ${T - s} \\;\\Rightarrow\\; w \\ge ${num(Q.of(T - s, r))}`;
          text = t(
            `Omar has ${s} dollars and saves ${r} dollars each week. What is the least number of weeks until he has at least ${T} dollars?`,
            `奥马尔有 ${s} 元，每周存 ${r} 元。至少要多少周他才能有至少 ${T} 元？`,
          );
        } else {
          const w0 = rng.int(60, 90);
          const b = rng.int(15, 40);
          const C = w0 + rng.int(8, 40) * b + rng.int(0, b - 1);
          answer = Math.floor((C - w0) / b);
          forgot = Math.floor(C / b);
          greatest = true;
          work = `${w0} + ${b}n \\le ${C} \\;\\Rightarrow\\; ${b}n \\le ${C - w0} \\;\\Rightarrow\\; n \\le ${num(Q.of(C - w0, b))}`;
          text = t(
            `A freight elevator can carry at most ${C} kg. The operator weighs ${w0} kg and each box weighs ${b} kg. What is the greatest number of boxes the operator can take in one trip?`,
            `一部货梯最多载重 ${C} 千克。操作员体重 ${w0} 千克，每个箱子重 ${b} 千克。操作员一次最多能运多少个箱子？`,
          );
        }
        return numberProblem({
          prompt: text,
          answer,
          form: "integer",
          wrong: [greatest ? answer + 1 : answer - 1, forgot],
          solution: t(
            `Write and solve the inequality:${steps(work)}The answer is the ${greatest ? "greatest whole number allowed, so round down" : "least whole number allowed, so round up"}: $${answer}$.`,
            `列出不等式并求解：${steps(work)}答案是允许的${greatest ? "最大整数，所以向下取整" : "最小整数，所以向上取整"}：$${answer}$。`,
          ),
        });
      },
    },
    {
      id: "comparing-two-plans",
      title: t("Comparing two plans", "比较两种方案"),
      explanation: t(
        "To find when one plan is cheaper than another, write the cost of each and put an inequality between them. Gym A charges $60$ dollars plus $4$ dollars per visit, gym B $10$ dollars per visit. A is cheaper when\n\n$$60 + 4n < 10n \\;\\Rightarrow\\; 60 < 6n \\;\\Rightarrow\\; n > 10$$\n\nAt exactly $10$ visits they cost the same, so the least whole number of visits for which A is cheaper is $11$.",
        "要判断一种方案何时比另一种便宜，先写出两者的费用，再在它们之间写不等号。健身房 A 收 $60$ 元会费、每次 $4$ 元，健身房 B 每次 $10$ 元。A 更便宜时\n\n$$60 + 4n < 10n \\;\\Rightarrow\\; 60 < 6n \\;\\Rightarrow\\; n > 10$$\n\n恰好 $10$ 次时两者费用相同，所以使 A 更便宜的最少次数是 $11$。",
      ),
      generate(rng) {
        const rA = rng.int(2, 8);
        const rB = rA + rng.int(2, 7);
        const d = rB - rA;
        const f = rng.bool(0.4) ? d * rng.int(3, 15) : rng.int(2 * d, 15 * d);
        const context = rng.pick([
          {
            a: t(`Gym A charges a ${f}-dollar fee plus ${rA} dollars per visit`, `健身房 A 收 ${f} 元会费，另外每次 ${rA} 元`),
            b: t(`gym B charges ${rB} dollars per visit`, `健身房 B 每次收费 ${rB} 元`),
            unit: t("visits", "次数"),
            A: t("gym A", "健身房 A"),
            B: t("gym B", "健身房 B"),
          },
          {
            a: t(`Car rental A costs ${f} dollars plus ${rA} dollars per hour`, `租车公司 A 收 ${f} 元，另外每小时 ${rA} 元`),
            b: t(`rental B costs ${rB} dollars per hour`, `租车公司 B 每小时收费 ${rB} 元`),
            unit: t("hours", "小时数"),
            A: t("rental A", "公司 A"),
            B: t("rental B", "公司 B"),
          },
        ]);
        const cheapA = rng.bool();
        const q = Q.of(f, d);
        const answer = cheapA ? Math.floor(f / d) + 1 : Math.ceil(f / d) - 1;
        const work = cheapA
          ? steps(`${f} + ${rA}n < ${rB}n`, `${f} < ${d}n`, `n > ${num(q)}`)
          : steps(`${rB}n < ${f} + ${rA}n`, `${d}n < ${f}`, `n < ${num(q)}`);
        return numberProblem({
          prompt: t(
            `${context.a.en}; ${context.b.en}. What is the ${cheapA ? "least" : "greatest"} whole number of ${context.unit.en} for which ${(cheapA ? context.A : context.B).en} costs less?`,
            `${context.a["zh-CN"]}；${context.b["zh-CN"]}。使${(cheapA ? context.A : context.B)["zh-CN"]} 更便宜的${context.unit["zh-CN"]}${cheapA ? "最少" : "最多"}是多少？`,
          ),
          answer,
          form: "integer",
          wrong: [cheapA ? Math.ceil(f / d) : Math.floor(f / d), cheapA ? answer - 1 : answer + 1],
          solution: t(
            `Compare the two costs for $n$ ${context.unit.en}:${work}${q.isInteger() ? `At exactly $${num(q)}$ the costs are equal, which is not cheaper. ` : ""}The ${cheapA ? "least" : "greatest"} whole number that works is $${answer}$.`,
            `比较${context.unit["zh-CN"]}为 $n$ 时的两种费用：${work}${q.isInteger() ? `恰好为 $${num(q)}$ 时两者费用相等，并不更便宜。` : ""}满足条件的${cheapA ? "最小" : "最大"}整数是 $${answer}$。`,
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
  prerequisites: ["modeling-with-two-step-inequalities"],
  encompasses: [
    { topic: "modeling-with-two-step-inequalities", weight: 0.5 },
    { topic: "solving-compound-inequalities", weight: 0.7 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.HSA.CED.A.3"],
  knowledgePoints: [
    {
      id: "ranges-from-linear-models",
      title: t("A cost within a range", "费用在某个范围内"),
      explanation: t(
        "When a total must lie between two bounds, write a double inequality with the total in the middle and solve it on all three parts. A plumber charges $60$ dollars plus $45$ dollars per hour, and the bill is at least $150$ and at most $285$ dollars:\n\n$$150 \\le 60 + 45h \\le 285 \\;\\Rightarrow\\; 90 \\le 45h \\le 225 \\;\\Rightarrow\\; 2 \\le h \\le 5$$\n\nWhen the quantity decreases, such as a candle burning down, the coefficient is negative and both symbols reverse.",
        "当总量必须介于两个界限之间时，把总量放在中间写成连不等式，再对三部分同时求解。水管工收 $60$ 元上门费，另外每小时 $45$ 元，账单不少于 $150$ 元且不超过 $285$ 元：\n\n$$150 \\le 60 + 45h \\le 285 \\;\\Rightarrow\\; 90 \\le 45h \\le 225 \\;\\Rightarrow\\; 2 \\le h \\le 5$$\n\n当量在减少时（如蜡烛燃烧变短），系数为负，两个不等号都要改变方向。",
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
                  `A plumber charges ${f} dollars for a visit plus ${r} dollars per hour. A bill was ${words.en} dollars. Let $h$ be the number of hours worked.`,
                  `一名水管工上门费 ${f} 元，另外每小时收费 ${r} 元。一张账单${words["zh-CN"]}元。设 $h$ 为工作的小时数。`,
                )
              : t(
                  `A taxi charges ${f} dollars plus ${r} dollars per kilometer. A fare was ${words.en} dollars. Let $d$ be the distance in kilometers.`,
                  `一辆出租车起步价 ${f} 元，另外每千米收费 ${r} 元。一次车费${words["zh-CN"]}元。设 $d$ 为行驶的距离（千米）。`,
                );
          const o1 = lc ? "\\le" : "<";
          const o2 = hc ? "\\le" : "<";
          return intervalProblem({
            prompt: ask(text.en, text["zh-CN"], asInequality(variable)),
            set,
            form: "inequality",
            variable,
            wrong: [union(span(p, !lc, q, !hc)), union(span(Q.of(L, r), lc, Q.of(H, r), hc))],
            solution: t(
              `The total is $${f} + ${r}${variable}$:${steps(`${L} ${o1} ${f} + ${r}${variable} ${o2} ${H}`, `${L - f} ${o1} ${r}${variable} ${o2} ${H - f}`, inequalityLatexOf(set, variable))}`,
              `总费用是 $${f} + ${r}${variable}$：${steps(`${L} ${o1} ${f} + ${r}${variable} ${o2} ${H}`, `${L - f} ${o1} ${r}${variable} ${o2} ${H - f}`, inequalityLatexOf(set, variable))}`,
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
        const text = t(
          `A candle is ${H0} cm tall and burns down ${r} cm per hour. Let $t$ be a time, in hours after it is lit, at which its height is ${words.en} cm.`,
          `一支蜡烛高 ${H0} 厘米，每小时燃烧变短 ${r} 厘米。设 $t$ 为点燃后的时间（小时），此时蜡烛的高度${words["zh-CN"]}厘米。`,
        );
        return intervalProblem({
          prompt: ask(text.en, text["zh-CN"], asInequality("t")),
          set,
          form: "inequality",
          variable: "t",
          wrong: [union(span(p, lc, q, hc)), union(span(p, !hc, q, !lc))],
          solution: t(
            `The height is $${H0} - ${r}t$. Dividing by $-${r}$ reverses both symbols:${steps(`${L} ${o1} ${H0} - ${r}t ${o2} ${U}`, `${L - H0} ${o1} -${r}t ${o2} ${U - H0}`, `${q} ${lc ? "\\ge" : ">"} t ${hc ? "\\ge" : ">"} ${p}`, inequalityLatexOf(set, "t"))}`,
            `高度是 $${H0} - ${r}t$。除以 $-${r}$ 时两个不等号都改变方向：${steps(`${L} ${o1} ${H0} - ${r}t ${o2} ${U}`, `${L - H0} ${o1} -${r}t ${o2} ${U - H0}`, `${q} ${lc ? "\\ge" : ">"} t ${hc ? "\\ge" : ">"} ${p}`, inequalityLatexOf(set, "t"))}`,
          ),
        });
      },
    },
    {
      id: "ranges-from-formulas",
      title: t("Ranges from formulas", "由公式求范围"),
      explanation: t(
        "A formula links two quantities. Put the formula in the middle of the double inequality and solve for the other quantity. With $F = \\frac{9}{5}C + 32$, temperatures from $50$ °F to $86$ °F inclusive give\n\n$$50 \\le \\tfrac{9}{5}C + 32 \\le 86 \\;\\Rightarrow\\; 18 \\le \\tfrac{9}{5}C \\le 54 \\;\\Rightarrow\\; 10 \\le C \\le 30$$",
        "公式把两个量联系起来。把公式放在连不等式的中间，再解出另一个量。由 $F = \\frac{9}{5}C + 32$，$50$°F 到 $86$°F（含）的温度给出\n\n$$50 \\le \\tfrac{9}{5}C + 32 \\le 86 \\;\\Rightarrow\\; 18 \\le \\tfrac{9}{5}C \\le 54 \\;\\Rightarrow\\; 10 \\le C \\le 30$$",
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
              `Subtract $32$, then multiply by $\\frac{5}{9}$:${steps(`${L} ${o1} \\tfrac{9}{5}C + 32 ${o2} ${H}`, `${L - 32} ${o1} \\tfrac{9}{5}C ${o2} ${H - 32}`, inequalityLatexOf(set, "C"))}`,
              `减去 $32$，再乘以 $\\frac{5}{9}$：${steps(`${L} ${o1} \\tfrac{9}{5}C + 32 ${o2} ${H}`, `${L - 32} ${o1} \\tfrac{9}{5}C ${o2} ${H - 32}`, inequalityLatexOf(set, "C"))}`,
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
          return intervalProblem({
            prompt: ask(
              `A rectangle is ${w} cm wide, and its perimeter is ${words.en} cm. Let $l$ be its length in centimeters.`,
              `一个长方形宽 ${w} 厘米，周长${words["zh-CN"]}厘米。设 $l$ 为它的长（厘米）。`,
              asInequality("l"),
            ),
            set,
            form: "inequality",
            variable: "l",
            wrong: [union(span(p, !lc, q, !hc)), union(span(Q.of(L - w, 2), lc, Q.of(H - w, 2), hc))],
            solution: t(
              `The perimeter is $2l + ${2 * w}$:${steps(`${L} ${o1} 2l + ${2 * w} ${o2} ${H}`, `${L - 2 * w} ${o1} 2l ${o2} ${H - 2 * w}`, inequalityLatexOf(set, "l"))}`,
              `周长是 $2l + ${2 * w}$：${steps(`${L} ${o1} 2l + ${2 * w} ${o2} ${H}`, `${L - 2 * w} ${o1} 2l ${o2} ${H - 2 * w}`, inequalityLatexOf(set, "l"))}`,
            ),
          });
        }
        const a = rng.int(70, 95);
        const b = rng.int(70, 95);
        const lo = rng.pick([70, 75, 80]);
        const hi = lo + 10;
        const set = union(span(3 * lo - a - b, lc, 3 * hi - a - b, hc));
        const words = between(lc, hc, lo, hi);
        return intervalProblem({
          prompt: ask(
            `Yuki scored ${a} and ${b} on two tests. She wants the mean of these and a third test score $s$ to be ${words.en}.`,
            `由纪两次测验得了 ${a} 分和 ${b} 分。她希望这两次和第三次测验成绩 $s$ 的平均分${words["zh-CN"]}。`,
            asInequality("s"),
          ),
          set,
          form: "inequality",
          variable: "s",
          wrong: [union(span(3 * lo - a - b, !lc, 3 * hi - a - b, !hc)), union(span(lo, lc, hi, hc))],
          solution: t(
            `Multiply all three parts by $3$, then subtract $${a + b}$:${steps(`${lo} ${o1} \\frac{${a} + ${b} + s}{3} ${o2} ${hi}`, `${3 * lo} ${o1} ${a + b} + s ${o2} ${3 * hi}`, inequalityLatexOf(set, "s"))}`,
            `三部分同时乘以 $3$，再减去 $${a + b}$：${steps(`${lo} ${o1} \\frac{${a} + ${b} + s}{3} ${o2} ${hi}`, `${3 * lo} ${o1} ${a + b} + s ${o2} ${3 * hi}`, inequalityLatexOf(set, "s"))}`,
          ),
        });
      },
    },
    {
      id: "counting-whole-number-solutions",
      title: t("Counting whole-number solutions", "数整数解的个数"),
      explanation: t(
        "When the unknown counts things, solve the double inequality and count the whole numbers in the solution set. If $5 \\frac{1}{2} \\le n \\le 11\\frac{1}{4}$, the whole numbers are $6, 7, \\dots, 11$: that is $11 - 6 + 1 = 6$ numbers, not $11 - 6$.",
        "当未知数表示个数时，解出连不等式，再数解集中的整数个数。若 $5 \\frac{1}{2} \\le n \\le 11\\frac{1}{4}$，整数为 $6, 7, \\dots, 11$，共 $11 - 6 + 1 = 6$ 个，而不是 $11 - 6$ 个。",
      ),
      generate(rng) {
        const f = 50 * rng.int(2, 8);
        const r = 5 * rng.int(4, 9);
        const lo = rng.int(10, 30);
        const hi = lo + rng.int(2, 12);
        const L = f + r * lo - rng.int(0, r - 1);
        const H = f + r * hi + rng.int(0, r - 1);
        const count = hi - lo + 1;
        return numberProblem({
          prompt: t(
            `A banquet hall charges ${f} dollars plus ${r} dollars per guest. The organizers want to spend at least ${L} and at most ${H} dollars. How many different numbers of guests are possible?`,
            `一个宴会厅收场地费 ${f} 元，另外每位客人 ${r} 元。组织者希望花费不少于 ${L} 元且不超过 ${H} 元。客人人数有多少种可能？`,
          ),
          answer: count,
          form: "integer",
          wrong: [count - 1, count + 1],
          solution: t(
            `With $n$ guests:${steps(`${L} \\le ${f} + ${r}n \\le ${H}`, `${L - f} \\le ${r}n \\le ${H - f}`, `${num(Q.of(L - f, r))} \\le n \\le ${num(Q.of(H - f, r))}`)}The whole numbers are $${lo}$ through $${hi}$: $${hi} - ${lo} + 1 = ${count}$.`,
            `设客人数为 $n$：${steps(`${L} \\le ${f} + ${r}n \\le ${H}`, `${L - f} \\le ${r}n \\le ${H - f}`, `${num(Q.of(L - f, r))} \\le n \\le ${num(Q.of(H - f, r))}`)}整数为 $${lo}$ 到 $${hi}$，共 $${hi} - ${lo} + 1 = ${count}$ 个。`,
          ),
        });
      },
    },
  ],
};

/** sqrtSurd is √k for a rational k ≥ 0, in simplest form. */
function sqrtSurd(k: Q): Surd {
  if (k.isZero()) return surd(Q.zero);
  const [c, m] = simplifyRadical(Number(k.n * k.d));
  return surd(Q.zero, Q.of(c, k.d), BigInt(m));
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

const squareFree = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];

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
  encompasses: [
    { topic: "square-roots-and-cube-roots", weight: 0.5 },
    { topic: "simplifying-square-roots", weight: 0.4 },
    { topic: "two-step-equations", weight: 0.4 },
  ],
  xp: 18,
  standards: ["CCSS.8.EE.A.2", "CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "square-equals-a-number",
      title: t("Solving $x^{2} = k$", "解 $x^{2} = k$"),
      explanation: t(
        "Both $5^{2}$ and $(-5)^{2}$ equal $25$, so $x^{2} = 25$ has **two** solutions: $x = \\pm\\sqrt{25} = \\pm 5$. Taking the square root of both sides of an equation always needs the $\\pm$.\n\n- $x^{2} = k$ with $k > 0$: two solutions, $x = \\pm\\sqrt{k}$.\n- $x^{2} = 0$: one solution, $x = 0$.\n- $x^{2} = k$ with $k < 0$: no real solution, since no real number has a negative square.",
        "$5^{2}$ 和 $(-5)^{2}$ 都等于 $25$，所以 $x^{2} = 25$ 有**两个**解：$x = \\pm\\sqrt{25} = \\pm 5$。对方程两边开平方时，一定要加上 $\\pm$。\n\n- $x^{2} = k$ 且 $k > 0$：两个解，$x = \\pm\\sqrt{k}$。\n- $x^{2} = 0$：一个解，$x = 0$。\n- $x^{2} = k$ 且 $k < 0$：没有实数解，因为实数的平方不会是负数。",
      ),
      keyPrerequisites: ["square-roots-and-cube-roots"],
      generate(rng) {
        const kind = rng.pick(["integer", "integer", "integer", "fraction", "fraction", "zero", "negative", "negative"] as const);
        const r = kind === "fraction" ? coprimeFraction(rng, 9, 9) : Q.of(kind === "zero" ? 0 : rng.int(1, 15));
        const k = kind === "negative" ? r.mul(r).neg() : r.mul(r);
        const values = kind === "negative" ? [] : plusMinus(Q.zero, surd(r));
        return solutionsProblem({
          prompt: ask(`Solve $x^{2} = ${num(k)}$.`, `解方程 $x^{2} = ${num(k)}$。`, listSolutions),
          values,
          wrong:
            kind === "negative" ? [[num(r), num(r.neg())], [num(r.neg())]] : kind === "zero" ? [[]] : [[num(r)], [num(k.div(Q.of(2)))]],
          solution:
            kind === "negative"
              ? noRealSquare
              : kind === "zero"
                ? t("Only $0^{2} = 0$, so $x = 0$.", "只有 $0^{2} = 0$，所以 $x = 0$。")
                : t(
                    `Take the square root of both sides, with $\\pm$: $x = \\pm\\sqrt{${num(k)}} = \\pm ${num(r)}$.`,
                    `两边开平方，加上 $\\pm$：$x = \\pm\\sqrt{${num(k)}} = \\pm ${num(r)}$。`,
                  ),
        });
      },
    },
    {
      id: "isolating-the-square",
      title: t("Isolating the square first", "先分离平方项"),
      explanation: t(
        "If the equation has other terms, first isolate $x^{2}$ as in a two-step equation, then take square roots:\n\n$$3x^{2} - 7 = 41 \\;\\Rightarrow\\; 3x^{2} = 48 \\;\\Rightarrow\\; x^{2} = 16 \\;\\Rightarrow\\; x = \\pm 4$$\n\nIf $x^{2}$ turns out to equal a negative number, there is no real solution.",
        "如果方程中还有其他项，先像解两步方程那样分离出 $x^{2}$，再开平方：\n\n$$3x^{2} - 7 = 41 \\;\\Rightarrow\\; 3x^{2} = 48 \\;\\Rightarrow\\; x^{2} = 16 \\;\\Rightarrow\\; x = \\pm 4$$\n\n如果最后 $x^{2}$ 等于负数，就没有实数解。",
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
        return solutionsProblem({
          prompt: ask(`Solve $${isolated(a, "x^{2}", b, c)}$.`, `解方程 $${isolated(a, "x^{2}", b, c)}$。`, listSolutions),
          values,
          wrong: [
            negative ? [String(r), String(-r)] : [String(r)],
            ...(raw.sign() > 0 && a !== 1 ? [plusMinus(Q.zero, sqrtSurd(raw))] : []),
          ],
          solution: t(
            `Isolate $x^{2}$:${steps(...isolatingWork(a, "x^{2}", b, c))}${negative ? noRealSquare.en : `So $x = \\pm ${r}$.`}`,
            `先分离 $x^{2}$：${steps(...isolatingWork(a, "x^{2}", b, c))}${negative ? noRealSquare["zh-CN"] : `所以 $x = \\pm ${r}$。`}`,
          ),
        });
      },
    },
    {
      id: "irrational-solutions",
      title: t("Irrational solutions", "无理数解"),
      explanation: t(
        "When $k$ is not a perfect square, leave the solutions as square roots in simplest radical form:\n\n$$2x^{2} + 1 = 25 \\;\\Rightarrow\\; x^{2} = 12 \\;\\Rightarrow\\; x = \\pm\\sqrt{12} = \\pm 2\\sqrt{3}$$",
        "当 $k$ 不是完全平方数时，把解写成最简根式：\n\n$$2x^{2} + 1 = 25 \\;\\Rightarrow\\; x^{2} = 12 \\;\\Rightarrow\\; x = \\pm\\sqrt{12} = \\pm 2\\sqrt{3}$$",
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
        const simplified = s === 1 ? `\\sqrt{${m}}` : `\\sqrt{${k}} = ${surdLatex(root)}`;
        return solutionsProblem({
          prompt: ask(`Solve $${isolated(a, "x^{2}", b, c)}$.`, `解方程 $${isolated(a, "x^{2}", b, c)}$。`, listSolutions),
          values,
          wrong: [
            [surdLatex(root)],
            ...(s > 1 && isSquareFreeInt(s) && s !== m ? [plusMinus(Q.zero, surd(Q.zero, Q.of(m), BigInt(s)))] : []),
          ],
          solution: t(
            `${steps(...isolatingWork(a, "x^{2}", b, c))}Take square roots and simplify: $x = \\pm${simplified}$.`,
            `${steps(...isolatingWork(a, "x^{2}", b, c))}开平方并化简：$x = \\pm${simplified}$。`,
          ),
        });
      },
    },
    {
      id: "squared-binomials",
      title: t("Solving $(x - a)^{2} = k$", "解 $(x - a)^{2} = k$"),
      explanation: t(
        "Treat the whole expression in parentheses as the unknown: take square roots, then solve the two linear equations.\n\n$$(x - 3)^{2} = 20 \\;\\Rightarrow\\; x - 3 = \\pm 2\\sqrt{5} \\;\\Rightarrow\\; x = 3 \\pm 2\\sqrt{5}$$\n\n$$(2x + 1)^{2} = 9 \\;\\Rightarrow\\; 2x + 1 = \\pm 3 \\;\\Rightarrow\\; x = 1 \\text{ or } x = -2$$\n\nIf the square equals $0$ there is one solution; if it equals a negative number there is none.",
        "把括号里的整个式子看作未知数：先开平方，再解两个一次方程。\n\n$$(x - 3)^{2} = 20 \\;\\Rightarrow\\; x - 3 = \\pm 2\\sqrt{5} \\;\\Rightarrow\\; x = 3 \\pm 2\\sqrt{5}$$\n\n$$(2x + 1)^{2} = 9 \\;\\Rightarrow\\; 2x + 1 = \\pm 3 \\;\\Rightarrow\\; x = 1 \\text{ 或 } x = -2$$\n\n如果平方等于 $0$，只有一个解；如果等于负数，则没有实数解。",
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
        return solutionsProblem({
          prompt: ask(`Solve $${isolated(outer, u, d, e)}$.`, `解方程 $${isolated(outer, u, d, e)}$。`, listSolutions),
          values,
          wrong:
            kind === "negative"
              ? [plusMinus(center, absRoot, Q.of(b))]
              : [plusMinus(center.neg(), absRoot, Q.of(b)), [plusMinus(center, absRoot, Q.of(b))[0]!]],
          solution: t(
            `${steps(...isolatingWork(outer, u, d, e))}${
              kind === "negative"
                ? noRealSquare.en
                : `Take square roots: $${linear(b, c)} = ${kind === "zero" ? "0" : `\\pm ${surdLatex(sqrtSurd(k))}`}$, so $x = ${values.join(" \\text{ or } x = ")}$.`
            }`,
            `${steps(...isolatingWork(outer, u, d, e))}${
              kind === "negative"
                ? noRealSquare["zh-CN"]
                : `开平方：$${linear(b, c)} = ${kind === "zero" ? "0" : `\\pm ${surdLatex(sqrtSurd(k))}`}$，所以 $x = ${values.join(" \\text{ 或 } x = ")}$。`
            }`,
          ),
        });
      },
    },
  ],
};

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
  knowledgePoints: [
    {
      id: "cube-equations",
      title: t("Solving $x^{3} = k$", "解 $x^{3} = k$"),
      explanation: t(
        "Every real number has exactly one real cube root, and the cube of a negative number is negative. So $x^{3} = k$ has exactly **one** real solution, $x = \\sqrt[3]{k}$, with no $\\pm$:\n\n$$2x^{3} + 5 = -11 \\;\\Rightarrow\\; 2x^{3} = -16 \\;\\Rightarrow\\; x^{3} = -8 \\;\\Rightarrow\\; x = -2$$",
        "每个实数恰有一个实数立方根，负数的立方是负数。所以 $x^{3} = k$ 恰有**一个**实数解 $x = \\sqrt[3]{k}$，不需要 $\\pm$：\n\n$$2x^{3} + 5 = -11 \\;\\Rightarrow\\; 2x^{3} = -16 \\;\\Rightarrow\\; x^{3} = -8 \\;\\Rightarrow\\; x = -2$$",
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
          prompt: ask(`Solve $${isolated(a, "x^{3}", b, c)}$.`, `解方程 $${isolated(a, "x^{3}", b, c)}$。`, listSolutions),
          values: [num(r)],
          wrong: [[num(r), num(r.neg())], [num(r.neg())], [num(k.div(Q.of(3)))]],
          solution: t(
            `${steps(...isolatingWork(a, "x^{3}", b, c), `x = ${rootLatex(3, k)} = ${num(r)}`)}An odd power has exactly one real root, so this is the only solution.`,
            `${steps(...isolatingWork(a, "x^{3}", b, c), `x = ${rootLatex(3, k)} = ${num(r)}`)}奇次幂只有一个实数根，所以这是唯一的解。`,
          ),
        });
      },
    },
    {
      id: "higher-odd-powers",
      title: t("Fifth and seventh powers", "五次幂与七次幂"),
      explanation: t(
        "The same holds for every odd exponent $n$: $x^{n} = k$ has the single real solution $x = \\sqrt[n]{k}$, negative when $k$ is negative.\n\n$$x^{5} = -32 \\;\\Rightarrow\\; x = \\sqrt[5]{-32} = -2 \\qquad x^{7} = \\frac{1}{128} \\;\\Rightarrow\\; x = \\frac{1}{2}$$",
        "对任意奇数指数 $n$ 都一样：$x^{n} = k$ 只有一个实数解 $x = \\sqrt[n]{k}$，$k$ 为负数时解也是负数。\n\n$$x^{5} = -32 \\;\\Rightarrow\\; x = \\sqrt[5]{-32} = -2 \\qquad x^{7} = \\frac{1}{128} \\;\\Rightarrow\\; x = \\frac{1}{2}$$",
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
          prompt: ask(`Solve $${isolated(a, u, b, c)}$.`, `解方程 $${isolated(a, u, b, c)}$。`, listSolutions),
          values: [num(r)],
          wrong: [[num(r), num(r.neg())], [num(r.neg())], [num(k.div(Q.of(n)))]],
          solution: t(
            `${steps(...isolatingWork(a, u, b, c), `x = ${rootLatex(n, k)} = ${num(r)}`)}Since $${n}$ is odd, this is the only real solution.`,
            `${steps(...isolatingWork(a, u, b, c), `x = ${rootLatex(n, k)} = ${num(r)}`)}因为 $${n}$ 是奇数，这是唯一的实数解。`,
          ),
        });
      },
    },
    {
      id: "odd-powers-of-binomials",
      title: t("Odd powers of an expression", "式子的奇次幂"),
      explanation: t(
        "Take the root of the whole expression in parentheses, then solve the linear equation that remains:\n\n$$(2x - 1)^{3} = -27 \\;\\Rightarrow\\; 2x - 1 = -3 \\;\\Rightarrow\\; x = -1$$",
        "对括号里的整个式子开方，再解剩下的一次方程：\n\n$$(2x - 1)^{3} = -27 \\;\\Rightarrow\\; 2x - 1 = -3 \\;\\Rightarrow\\; x = -1$$",
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
        return solutionsProblem({
          prompt: ask(`Solve $${isolated(outer, u, d, e)}$.`, `解方程 $${isolated(outer, u, d, e)}$。`, listSolutions),
          values: [num(x)],
          wrong: [[num(Q.of(r + c, b))], [num(Q.of(-r - c, b)), num(x)], ...(b === 1 ? [] : [[num(Q.of(r - c))]])],
          solution: t(
            `${steps(...isolatingWork(outer, u, d, e), `${linear(b, c)} = ${rootLatex(n, k)} = ${r}`, `x = ${num(x)}`)}`,
            `${steps(...isolatingWork(outer, u, d, e), `${linear(b, c)} = ${rootLatex(n, k)} = ${r}`, `x = ${num(x)}`)}`,
          ),
        });
      },
    },
  ],
};

export const solvingEvenPowerEquations: TopicDef = {
  id: "solving-even-power-equations",
  title: t("Solving Equations With Even Exponents Using the Nth Root Method", "用 n 次方根法解偶次幂方程"),
  summary: t(
    "Solve equations such as $x^{4} = 81$ by taking an even root, and tell when there are two, one or no real solutions.",
    "通过开偶次方解 $x^{4} = 81$ 等方程，并判断实数解有两个、一个还是没有。",
  ),
  prerequisites: ["solving-odd-power-equations"],
  encompasses: [
    { topic: "solving-equations-with-square-roots", weight: 0.5 },
    { topic: "solving-odd-power-equations", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.8.EE.A.2"],
  knowledgePoints: [
    {
      id: "fourth-power-equations",
      title: t("Solving $x^{4} = k$", "解 $x^{4} = k$"),
      explanation: t(
        "An even power is never negative, and a number and its opposite have the same even power: $3^{4} = (-3)^{4} = 81$. So, like $x^{2} = k$:\n\n- $x^{4} = k$ with $k > 0$: two solutions, $x = \\pm\\sqrt[4]{k}$;\n- $x^{4} = 0$: one solution, $x = 0$;\n- $x^{4} = k$ with $k < 0$: no real solution.",
        "偶次幂不会是负数，并且一个数与它的相反数的偶次幂相等：$3^{4} = (-3)^{4} = 81$。所以与 $x^{2} = k$ 一样：\n\n- $x^{4} = k$ 且 $k > 0$：两个解，$x = \\pm\\sqrt[4]{k}$；\n- $x^{4} = 0$：一个解，$x = 0$；\n- $x^{4} = k$ 且 $k < 0$：没有实数解。",
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
          prompt: ask(`Solve $${isolated(a, "x^{4}", b, c)}$.`, `解方程 $${isolated(a, "x^{4}", b, c)}$。`, listSolutions),
          values,
          wrong:
            kind === "negative" ? [[num(r), num(r.neg())], [num(r.neg())]] : kind === "zero" ? [[]] : [[num(r)], [num(k.div(Q.of(4)))]],
          solution: t(
            `${steps(...isolatingWork(a, "x^{4}", b, c))}${
              kind === "negative"
                ? "No real number has a negative fourth power, so there is no real solution."
                : kind === "zero"
                  ? "Only $0^{4} = 0$, so $x = 0$."
                  : `The exponent is even, so take the root with $\\pm$: $x = \\pm${rootLatex(4, k)} = \\pm ${num(r)}$.`
            }`,
            `${steps(...isolatingWork(a, "x^{4}", b, c))}${
              kind === "negative"
                ? "任何实数的四次方都不是负数，所以没有实数解。"
                : kind === "zero"
                  ? "只有 $0^{4} = 0$，所以 $x = 0$。"
                  : `指数是偶数，开方时加上 $\\pm$：$x = \\pm${rootLatex(4, k)} = \\pm ${num(r)}$。`
            }`,
          ),
        });
      },
    },
    {
      id: "higher-even-powers",
      title: t("Sixth and eighth powers", "六次幂与八次幂"),
      explanation: t(
        "For any even exponent $n$, $x^{n} = k$ has the two solutions $x = \\pm\\sqrt[n]{k}$ when $k > 0$, the one solution $0$ when $k = 0$, and none when $k < 0$:\n\n$$x^{6} = 64 \\;\\Rightarrow\\; x = \\pm 2 \\qquad x^{8} = -1 \\;\\Rightarrow\\; \\text{no real solution}$$",
        "对任意偶数指数 $n$：$k > 0$ 时 $x^{n} = k$ 有两个解 $x = \\pm\\sqrt[n]{k}$；$k = 0$ 时只有一个解 $0$；$k < 0$ 时没有实数解：\n\n$$x^{6} = 64 \\;\\Rightarrow\\; x = \\pm 2 \\qquad x^{8} = -1 \\;\\Rightarrow\\; \\text{无实数解}$$",
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
          prompt: ask(`Solve $${isolated(a, u, b, c)}$.`, `解方程 $${isolated(a, u, b, c)}$。`, listSolutions),
          values: negative ? [] : plusMinus(Q.zero, surd(r)),
          wrong: negative ? [[num(r), num(r.neg())], [num(r.neg())]] : [[num(r)], [num(k.div(Q.of(n)))]],
          solution: t(
            `${steps(...isolatingWork(a, u, b, c))}${
              negative
                ? `No real number has a negative ${n === 6 ? "sixth" : "eighth"} power, so there is no real solution.`
                : `The exponent is even, so take the root with $\\pm$: $x = \\pm${rootLatex(n, k)} = \\pm ${num(r)}$.`
            }`,
            `${steps(...isolatingWork(a, u, b, c))}${
              negative
                ? `任何实数的 ${n} 次方都不是负数，所以没有实数解。`
                : `指数是偶数，开方时加上 $\\pm$：$x = \\pm${rootLatex(n, k)} = \\pm ${num(r)}$。`
            }`,
          ),
        });
      },
    },
    {
      id: "even-powers-of-binomials",
      title: t("Even powers of an expression", "式子的偶次幂"),
      explanation: t(
        "Take the even root of the whole expression with $\\pm$ and solve both linear equations:\n\n$$(x + 2)^{4} = 16 \\;\\Rightarrow\\; x + 2 = \\pm 2 \\;\\Rightarrow\\; x = 0 \\text{ or } x = -4$$",
        "对整个式子开偶次方并加上 $\\pm$，再解两个一次方程：\n\n$$(x + 2)^{4} = 16 \\;\\Rightarrow\\; x + 2 = \\pm 2 \\;\\Rightarrow\\; x = 0 \\text{ 或 } x = -4$$",
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
        return solutionsProblem({
          prompt: ask(`Solve $${isolated(outer, u, d, e)}$.`, `解方程 $${isolated(outer, u, d, e)}$。`, listSolutions),
          values,
          wrong:
            kind === "negative"
              ? [plusMinus(Q.of(-c), surd(Q.of(r)), Q.of(b))]
              : [[num(Q.of(r - c, b))], plusMinus(Q.of(c), surd(Q.of(r)), Q.of(b))],
          solution: t(
            `${steps(...isolatingWork(outer, u, d, e))}${
              kind === "negative"
                ? "An even power cannot be negative, so there is no real solution."
                : `Take the root with $\\pm$: $${linear(b, c)} = ${r === 0 ? "0" : `\\pm ${r}`}$, so $x = ${values.join(" \\text{ or } x = ")}$.`
            }`,
            `${steps(...isolatingWork(outer, u, d, e))}${
              kind === "negative"
                ? "偶次幂不可能是负数，所以没有实数解。"
                : `开方并加上 $\\pm$：$${linear(b, c)} = ${r === 0 ? "0" : `\\pm ${r}`}$，所以 $x = ${values.join(" \\text{ 或 } x = ")}$。`
            }`,
          ),
        });
      },
    },
    {
      id: "counting-real-solutions",
      title: t("How many real solutions?", "有几个实数解"),
      explanation: t(
        "Once the power is isolated as $u^{n} = k$, the number of real solutions depends only on whether $n$ is odd or even and on the sign of $k$:\n\n| | $k > 0$ | $k = 0$ | $k < 0$ |\n| :--- | :--- | :--- | :--- |\n| $n$ odd | $1$ | $1$ | $1$ |\n| $n$ even | $2$ | $1$ | $0$ |",
        "把幂分离成 $u^{n} = k$ 后，实数解的个数只取决于 $n$ 的奇偶和 $k$ 的符号：\n\n| | $k > 0$ | $k = 0$ | $k < 0$ |\n| :--- | :--- | :--- | :--- |\n| $n$ 为奇数 | $1$ | $1$ | $1$ |\n| $n$ 为偶数 | $2$ | $1$ | $0$ |",
      ),
      generate(rng) {
        const n = rng.int(2, 8);
        const sign = rng.pick([1, 1, -1, -1, 0]);
        const k = sign * rng.int(1, 90);
        const a = rng.bool(0.5) ? 1 : rng.pick([2, 3, 5, -2, -3]);
        const b = a === 1 && rng.bool(0.5) ? 0 : rng.nonZero(-30, 30);
        const c = Q.of(a * k + b);
        const h = rng.int(-6, 6);
        const u = powerOf(h === 0 ? "x" : `\\left(${linear(1, -h)}\\right)`, n);
        const count = n % 2 === 1 ? 1 : k > 0 ? 2 : k === 0 ? 1 : 0;
        return numberProblem({
          prompt: t(`How many real solutions does $${isolated(a, u, b, c)}$ have?`, `方程 $${isolated(a, u, b, c)}$ 有几个实数解？`),
          answer: count,
          form: "integer",
          wrong: [n % 2 === 1 ? 2 : 1, n % 2 === 1 && k < 0 ? 0 : 2, 0],
          solution: t(
            `Isolate the power:${steps(`${u} = ${k}`)}The exponent $${n}$ is ${n % 2 === 1 ? "odd, so there is exactly one real solution" : k > 0 ? "even and the right side is positive, so there are two real solutions" : k === 0 ? "even and the right side is $0$, so there is one real solution" : "even and the right side is negative, so there is no real solution"}: $${count}$.`,
            `分离幂：${steps(`${u} = ${k}`)}指数 $${n}$ ${n % 2 === 1 ? "是奇数，所以恰有一个实数解" : k > 0 ? "是偶数且右边为正，所以有两个实数解" : k === 0 ? "是偶数且右边为 $0$，所以有一个实数解" : "是偶数且右边为负，所以没有实数解"}：$${count}$。`,
          ),
        });
      },
    },
  ],
};

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
