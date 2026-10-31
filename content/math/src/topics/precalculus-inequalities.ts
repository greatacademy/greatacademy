import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import {
  type Coefficient,
  type Interval,
  intersect,
  intervalLatex,
  linear,
  num,
  type PlaneMark,
  type PlaneView,
  paren,
  plane,
  poly,
  Q,
  type RealSet,
  realLine,
  union,
} from "@ga/subject-math";

import { choiceProblem, intervalProblem, numberProblem, steps, yesNo } from "../problems.ts";

// Precalculus unit 3: inequalities (modules 3.6 to 3.8).

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** range lists the integers from lo to hi. */
const range = (lo: number, hi: number) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

/** gcd is the greatest common divisor of two integers. */
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** Op is the relation of an inequality. */
type Op = "<" | "<=" | ">" | ">=";

const ops: readonly Op[] = ["<", "<=", ">", ">="];

const opL: Record<Op, string> = { "<": "<", "<=": "\\le", ">": ">", ">=": "\\ge" };

/** reversed is the relation after multiplying both sides by a negative number. */
const reversed: Record<Op, Op> = { "<": ">", "<=": ">=", ">": "<", ">=": "<=" };

/** toggled swaps a strict relation and its non-strict partner. */
const toggled: Record<Op, Op> = { "<": "<=", "<=": "<", ">": ">=", ">=": ">" };

const strict = (op: Op) => op === "<" || op === ">";
const above = (op: Op) => op === ">" || op === ">=";

/** front writes a constant factor before a product: "", "-", "3" or "\frac{1}{2}". */
function front(k: Coefficient): string {
  const v = toQ(k);
  if (v.eq(Q.one)) return "";
  if (v.eq(Q.of(-1))) return "-";
  return num(v);
}

/** tail writes a constant added after an expression: "", " + 3" or " - 3". */
function tail(c: Coefficient): string {
  const v = toQ(c);
  return v.isZero() ? "" : v.sign() < 0 ? ` - ${num(v.neg())}` : ` + ${num(v)}`;
}

/** plusGroup writes an expression added after another, in parentheses when it has several terms. */
function plusGroup(s: string): string {
  if (/[+-]/.test(s.slice(1))) return ` + (${s})`;
  return s.startsWith("-") ? ` - ${s.slice(1)}` : ` + ${s}`;
}

/** quad writes ax² + bx + c. */
const quad = (a: Coefficient, b: Coefficient, c: Coefficient, v = "x") => poly([a, `${v}^{2}`], [b, v], [c, ""]);

/** mk builds an interval from optional endpoints; infinite endpoints are open. */
const mk = (lo?: Q, hi?: Q, loClosed = false, hiClosed = false): Interval => ({
  ...(lo && { lo }),
  ...(hi && { hi }),
  loClosed: lo !== undefined && loClosed,
  hiClosed: hi !== undefined && hiClosed,
});

/** iv builds an interval from numbers. */
const iv = (lo: Coefficient | undefined, hi: Coefficient | undefined, loClosed = false, hiClosed = false): Interval =>
  mk(lo === undefined ? undefined : toQ(lo), hi === undefined ? undefined : toQ(hi), loClosed, hiClosed);

/** ray is the set of x with x op v. */
const ray = (op: Op, v: Coefficient): RealSet => union(above(op) ? iv(v, undefined, !strict(op)) : iv(undefined, v, false, !strict(op)));

/** point is the set {v}. */
const point = (v: Coefficient): Interval => iv(v, v, true, true);

/** absSet is the set of x with |x − c| op m, for m > 0. */
function absSet(c: Coefficient, m: Coefficient, op: Op): RealSet {
  const [C, M] = [toQ(c), toQ(m)];
  const closed = !strict(op);
  if (!above(op)) return union(mk(C.sub(M), C.add(M), closed, closed));
  return union(mk(undefined, C.sub(M), false, closed), mk(C.add(M), undefined, closed));
}

/** complement is the set of real numbers not in a set. */
function complement(set: RealSet): RealSet {
  const out: Interval[] = [];
  let start: { v?: Q; closed: boolean } | undefined = { closed: false };
  for (const i of set) {
    if (i.lo !== undefined && start) out.push(mk(start.v, i.lo, start.closed, !i.loClosed));
    start = i.hi === undefined ? undefined : { v: i.hi, closed: !i.hiClosed };
  }
  if (start) out.push(mk(start.v, undefined, start.closed));
  return union(...out);
}

/** setL writes a set in interval notation. */
const setL = (set: RealSet) => intervalLatex(set);

/** solvePrompt asks to solve an inequality in interval notation. */
const solvePrompt = (ineq: string): Text =>
  t(`Solve $${ineq}$. Write the answer in interval notation.`, `解不等式 $${ineq}$，用区间表示解集。`);

/** ends says whether the endpoints of a solution are included. */
const ends = (op: Op): Text =>
  strict(op)
    ? t("The inequality is strict, so the endpoints are not included.", "不等式是严格的，所以端点不包含在内。")
    : t("The inequality is not strict, so the endpoints are included.", "不等式不是严格的，所以端点包含在内。");

// Sign charts.

/** Factor is one factor of a product whose sign is charted. */
interface Factor {
  /** tex is the factor as it is written in a product, in parentheses when needed. */
  readonly tex: string;
  /** bare is the factor without its parentheses. */
  readonly bare: string;
  /** sign is the sign of the factor at x. */
  readonly sign: (x: Q) => number;
  /** root is where the factor is zero, if anywhere. */
  readonly root?: Q;
  /** pole marks a factor of the denominator: its root is excluded. */
  readonly pole?: boolean;
}

/** lin is the factor (px + q)^m, written with the constant first when flip is set. */
function lin(p: number, q: number, m = 1, o: { flip?: boolean; pole?: boolean } = {}): Factor {
  const body = o.flip && q !== 0 ? poly([q, ""], [p, "x"]) : linear(p, q);
  const plain = p === 1 && q === 0;
  const base = plain ? "x" : `(${body})`;
  return {
    tex: m === 1 ? base : `${base}^{${m}}`,
    bare: m === 1 ? body : `${base}^{${m}}`,
    sign: (x) => {
      const s = Q.of(p).mul(x).add(Q.of(q)).sign();
      return m % 2 === 0 ? s * s : s;
    },
    root: Q.of(-q, p),
    ...(o.pole && { pole: true }),
  };
}

/** product writes k times the factors. */
const product = (k: Coefficient, fs: readonly Factor[]) => `${front(k)}${fs.map((f) => f.tex).join("")}`;

/** part writes the numerator or denominator of a fraction: one factor needs no parentheses. */
const part = (fs: readonly Factor[]) => (fs.length === 1 ? fs[0]!.bare : fs.map((f) => f.tex).join(""));

/** fraction writes k times a quotient of factors. */
const fraction = (k: Coefficient, top: readonly Factor[], bottom: readonly Factor[]) => `${front(k)}\\frac{${part(top)}}{${part(bottom)}}`;

/** Chart is the sign of every factor, and of the product, on the intervals between the critical points. */
interface Chart {
  readonly cuts: readonly Q[];
  readonly rows: readonly (readonly number[])[];
  readonly signs: readonly number[];
}

/** chart computes the signs of k times the factors between their roots. */
function chart(k: Coefficient, fs: readonly Factor[]): Chart {
  const roots = fs.flatMap((f) => (f.root ? [f.root] : []));
  const cuts = roots.filter((r, i) => roots.findIndex((s) => s.eq(r)) === i).sort((p, q) => p.cmp(q));
  const tests =
    cuts.length === 0
      ? [Q.zero]
      : [cuts[0]!.sub(Q.one), ...cuts.slice(1).map((c, i) => c.add(cuts[i]!).div(Q.of(2))), cuts[cuts.length - 1]!.add(Q.one)];
  const rows = fs.map((f) => tests.map((x) => f.sign(x)));
  const s = toQ(k).sign();
  const signs = tests.map((_, i) => rows.reduce<number>((acc, r) => acc * r[i]!, s));
  return { cuts, rows, signs };
}

/** chartSet is the set where k times the factors op 0. */
function chartSet(k: Coefficient, fs: readonly Factor[], op: Op): RealSet {
  const { cuts, signs } = chart(k, fs);
  const parts: Interval[] = [];
  for (let i = 0; i <= cuts.length; i++) {
    if (above(op) ? signs[i]! > 0 : signs[i]! < 0) parts.push(mk(cuts[i - 1], cuts[i]));
  }
  if (!strict(op)) {
    for (const c of cuts) if (!fs.some((f) => f.pole && f.root?.eq(c))) parts.push(mk(c, c, true, true));
  }
  return union(...parts);
}

/** chartTable writes a sign table: a row per factor and the product, a column per interval. */
function chartTable(k: Coefficient, fs: readonly Factor[], name: string): string {
  const { cuts, rows, signs } = chart(k, fs);
  const heads = range(0, cuts.length).map(
    (i) => `(${i === 0 ? "-\\infty" : cuts[i - 1]!.toLatex()}, ${i === cuts.length ? "\\infty" : cuts[i]!.toLatex()})`,
  );
  const sym = (s: number) => (s > 0 ? "+" : "-");
  const lines = fs.map((f, j) => `${f.bare} & ${rows[j]!.map(sym).join(" & ")}`);
  if (toQ(k).sign() < 0) lines.unshift(`${num(k)} & ${heads.map(() => "-").join(" & ")}`);
  return `$$\\begin{array}{c|${"c".repeat(heads.length)}} & ${heads.join(" & ")} \\\\ \\hline ${lines.join(" \\\\ ")} \\\\ \\hline ${name} & ${signs.map(sym).join(" & ")} \\end{array}$$`;
}

/** zerosWords names the critical points of a chart. */
function critWords(fs: readonly Factor[]): Text {
  const zeros = fs.filter((f) => f.root && !f.pole).map((f) => `$${f.root!.toLatex()}$`);
  const poles = fs.filter((f) => f.root && f.pole).map((f) => `$${f.root!.toLatex()}$`);
  const z = [...new Set(zeros)];
  const p = [...new Set(poles)];
  return t(
    `The expression is zero at ${z.join(", ")}${p.length > 0 ? ` and not defined at ${p.join(", ")}` : ""}.`,
    `表达式在 ${z.join("、")} 处为零${p.length > 0 ? `，在 ${p.join("、")} 处无定义` : ""}。`,
  );
}

/** chartSolution explains a solution read from a sign table. */
function chartSolution(k: Coefficient, fs: readonly Factor[], name: string, op: Op, set: RealSet, lead?: Text): Text {
  const w = critWords(fs);
  const table = chartTable(k, fs, name);
  const hasPole = fs.some((f) => f.pole);
  const en = `${lead ? `${lead.en} ` : ""}${w.en} Test the sign on each interval:${table}We need $${name} ${opL[op]} 0$${strict(op) ? "" : hasPole ? ", so the zeros are included but the excluded values are not" : ", so the zeros are included"}. The solution is $${setL(set)}$.`;
  const zh = `${lead ? lead["zh-CN"] : ""}${w["zh-CN"]}检验每个区间上的符号：${table}要求 $${name} ${opL[op]} 0$${strict(op) ? "" : hasPole ? "，所以包含零点，但不包含使表达式无定义的值" : "，所以包含零点"}。解集是 $${setL(set)}$。`;
  return t(en, zh);
}

// Figures.

const view: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
const polyView: PlaneView = { xMin: -6, xMax: 6, yMin: -8, yMax: 8 };

/** minus writes a number for alt text, with a true minus sign. */
const minus = (n: number | Q) => (n instanceof Q ? n.toLatex() : String(n)).replace("-", "−");

// ─── 3.6.1 Solving elementary quadratic inequalities ───────────────────────

/** solvingElementaryQuadraticInequalities solves x² op k and (x − h)² op k by taking square roots. */
export const solvingElementaryQuadraticInequalities: TopicDef = {
  id: "solving-elementary-quadratic-inequalities",
  title: t("Solving Elementary Quadratic Inequalities", "解简单的二次不等式"),
  summary: t(
    "Solve inequalities such as $x^{2} < 9$ and $(x - 2)^{2} \\ge 16$ by taking square roots, remembering the negative side.",
    "通过开平方解 $x^{2} < 9$、$(x - 2)^{2} \\ge 16$ 这样的不等式，不要漏掉负的一侧。",
  ),
  prerequisites: ["solving-equations-with-square-roots", "compound-or-inequalities"],
  encompasses: [
    { topic: "solving-equations-with-square-roots", weight: 0.4 },
    { topic: "compound-or-inequalities", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.REI.B.4"],
  knowledgePoints: [
    {
      id: "squares-against-a-number",
      title: t("Comparing a square with a number", "平方与一个数比较"),
      explanation: t(
        "Since $x^{2} = |x|^{2}$, comparing $x^{2}$ with $9$ is comparing $|x|$ with $3$:\n\n- $x^{2} < 9 \\iff |x| < 3 \\iff -3 < x < 3$, the interval $(-3, 3)$;\n- $x^{2} \\ge 9 \\iff |x| \\ge 3 \\iff x \\le -3$ or $x \\ge 3$, the set $(-\\infty, -3] \\cup [3, \\infty)$.\n\nWriting only $x < 3$ is a common mistake: $x = -5$ satisfies $x < 3$, but $(-5)^{2} = 25$ is not less than $9$.",
        "因为 $x^{2} = |x|^{2}$，把 $x^{2}$ 与 $9$ 比较，就是把 $|x|$ 与 $3$ 比较：\n\n- $x^{2} < 9 \\iff |x| < 3 \\iff -3 < x < 3$，即区间 $(-3, 3)$；\n- $x^{2} \\ge 9 \\iff |x| \\ge 3 \\iff x \\le -3$ 或 $x \\ge 3$，即 $(-\\infty, -3] \\cup [3, \\infty)$。\n\n只写 $x < 3$ 是常见错误：$x = -5$ 满足 $x < 3$，但 $(-5)^{2} = 25$ 并不小于 $9$。",
      ),
      generate(rng) {
        const k = rng.int(1, 12);
        const op = rng.pick(ops);
        const set = absSet(0, k, op);
        return intervalProblem({
          prompt: solvePrompt(`x^{2} ${opL[op]} ${k * k}`),
          set,
          form: "interval",
          wrong: [ray(op, k), absSet(0, k * k, op), complement(set)],
          solution: t(
            `Take square roots: $\\sqrt{${k * k}} = ${k}$, so${steps(`x^{2} ${opL[op]} ${k * k} \\iff |x| ${opL[op]} ${k}`)}${above(op) ? `$x$ is at least $${k}$ away from $0$ on either side` : `$x$ lies between $-${k}$ and $${k}$`}. ${ends(op).en} The solution is $${setL(set)}$.`,
            `开平方：$\\sqrt{${k * k}} = ${k}$，所以${steps(`x^{2} ${opL[op]} ${k * k} \\iff |x| ${opL[op]} ${k}`)}${above(op) ? `$x$ 在 $0$ 的两侧且与 $0$ 的距离至少为 $${k}$` : `$x$ 在 $-${k}$ 与 $${k}$ 之间`}。${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
    {
      id: "isolating-the-square",
      title: t("Isolating the square first", "先把平方项单独留在一边"),
      explanation: t(
        "Isolate $x^{2}$ before taking square roots. Dividing by a negative number reverses the inequality:\n\n$$-2x^{2} + 5 > -45 \\implies -2x^{2} > -50 \\implies x^{2} < 25 \\implies -5 < x < 5$$\n\nThe solution is $(-5, 5)$.",
        "开平方之前先把 $x^{2}$ 单独留在一边。除以负数时不等号要反向：\n\n$$-2x^{2} + 5 > -45 \\implies -2x^{2} > -50 \\implies x^{2} < 25 \\implies -5 < x < 5$$\n\n解集是 $(-5, 5)$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const k = rng.int(1, 9);
        const c = rng.int(-20, 20);
        const d = a * k * k + c;
        const op = rng.pick(ops);
        const op2 = a < 0 ? reversed[op] : op;
        const set = absSet(0, k, op2);
        const lines = [
          ...(c === 0 ? [] : [`${poly([a, "x^{2}"])} ${opL[op]} ${a * k * k}`]),
          ...(a === 1 ? [] : [`x^{2} ${opL[op2]} ${k * k}`]),
          `|x| ${opL[op2]} ${k}`,
        ];
        return intervalProblem({
          prompt: solvePrompt(`${poly([a, "x^{2}"], [c, ""])} ${opL[op]} ${d}`),
          set,
          form: "interval",
          wrong: [absSet(0, k, op), complement(set), ray(op2, k)],
          solution: t(
            `Isolate $x^{2}$${a < 0 ? `; dividing by the negative number $${a}$ reverses the inequality` : ""}, then take square roots:${steps(...lines)}The solution is $${setL(set)}$.`,
            `先把 $x^{2}$ 单独留在一边${a < 0 ? `；除以负数 $${a}$ 时不等号反向` : ""}，再开平方：${steps(...lines)}解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
    {
      id: "shifted-squares-and-special-cases",
      title: t("Shifted squares and special cases", "平移的平方与特殊情形"),
      explanation: t(
        "For $(x - 2)^{2} \\le 16$, take square roots: $|x - 2| \\le 4$, so $-4 \\le x - 2 \\le 4$ and $-2 \\le x \\le 6$, the interval $[-2, 6]$.\n\nA square is never negative, which settles some inequalities at once:\n\n- $(x - 2)^{2} < -3$ has no solution, $\\varnothing$; $(x - 2)^{2} \\ge -3$ holds for all $x$, $\\mathbb{R}$;\n- $(x - 2)^{2} \\le 0$ holds only where the square is $0$: $\\{2\\}$;\n- $(x - 2)^{2} > 0$ holds everywhere except $x = 2$: $(-\\infty, 2) \\cup (2, \\infty)$.",
        "对 $(x - 2)^{2} \\le 16$ 开平方：$|x - 2| \\le 4$，所以 $-4 \\le x - 2 \\le 4$，即 $-2 \\le x \\le 6$，区间 $[-2, 6]$。\n\n平方永远不是负数，有些不等式可以直接判断：\n\n- $(x - 2)^{2} < -3$ 无解，$\\varnothing$；$(x - 2)^{2} \\ge -3$ 对所有 $x$ 成立，$\\mathbb{R}$；\n- $(x - 2)^{2} \\le 0$ 只在平方为 $0$ 时成立：$\\{2\\}$；\n- $(x - 2)^{2} > 0$ 除 $x = 2$ 外处处成立：$(-\\infty, 2) \\cup (2, \\infty)$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        const op = rng.pick(ops);
        const sq = `(${linear(1, -h)})^{2}`;
        if (rng.bool(0.3)) {
          const rhs = rng.bool(0.5) ? 0 : -rng.int(1, 9);
          let set: RealSet;
          let why: Text;
          if (rhs < 0) {
            set = above(op) ? realLine : [];
            why = above(op)
              ? t(`A square is never negative, so it is always greater than $${rhs}$.`, `平方永远不是负数，所以总大于 $${rhs}$。`)
              : t(`A square is never negative, so it is never less than $${rhs}$.`, `平方永远不是负数，所以不可能小于 $${rhs}$。`);
          } else {
            set = op === "<" ? [] : op === "<=" ? union(point(h)) : op === ">" ? union(iv(undefined, h), iv(h, undefined)) : realLine;
            why = {
              "<": t("A square is never negative, so it is never less than $0$.", "平方永远不是负数，所以不可能小于 $0$。"),
              "<=": t(
                `A square is at most $0$ only when it is $0$, that is when $x = ${h}$.`,
                `平方不大于 $0$ 只在它等于 $0$ 时成立，即 $x = ${h}$。`,
              ),
              ">": t(
                `A square is positive unless it is $0$, which happens only at $x = ${h}$.`,
                `平方除了等于 $0$ 时以外都是正数，而它只在 $x = ${h}$ 时等于 $0$。`,
              ),
              ">=": t(
                "A square is never negative, so the inequality holds for every $x$.",
                "平方永远不是负数，所以不等式对所有 $x$ 成立。",
              ),
            }[op];
          }
          return intervalProblem({
            prompt: solvePrompt(`${sq} ${opL[op]} ${rhs}`),
            set,
            form: "interval",
            wrong: [complement(set), realLine, [], union(point(h))],
            solution: t(`${why.en} The solution is $${setL(set)}$.`, `${why["zh-CN"]}解集是 $${setL(set)}$。`),
          });
        }
        const m = rng.int(1, 6);
        const set = absSet(h, m, op);
        return intervalProblem({
          prompt: solvePrompt(`${sq} ${opL[op]} ${m * m}`),
          set,
          form: "interval",
          wrong: [absSet(-h, m, op), absSet(h, m * m, op), complement(set)],
          solution: t(
            `Take square roots, then add $${h}$:${steps(`|${linear(1, -h)}| ${opL[op]} ${m}`, above(op) ? `${linear(1, -h)} ${opL[reversed[op]]} -${m} \\text{ or } ${linear(1, -h)} ${opL[op]} ${m}` : `-${m} ${opL[op]} ${linear(1, -h)} ${opL[op]} ${m}`)}The solution is $${setL(set)}$.`,
            `开平方，再加上 $${h}$：${steps(`|${linear(1, -h)}| ${opL[op]} ${m}`, above(op) ? `${linear(1, -h)} ${opL[reversed[op]]} -${m} \\text{ 或 } ${linear(1, -h)} ${opL[op]} ${m}` : `-${m} ${opL[op]} ${linear(1, -h)} ${opL[op]} ${m}`)}解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 3.6.2 Solving quadratic inequalities from graphs ──────────────────────

/** Parabola is y = a(x − r)(x − s) + k: it meets the line y = k at x = r and x = s. */
interface Parabola {
  readonly a: Q;
  readonly r: number;
  readonly s: number;
  readonly k: number;
}

/** drawParabola draws a parabola whose meeting points with y = k, and whose vertex, fit the view. */
function drawParabola(rng: Rng, shift: boolean): Parabola {
  for (;;) {
    const r = rng.int(-5, 3);
    const s = r + rng.int(2, 6);
    if (s > 5) continue;
    const a = rng.pick([Q.of(1, 2), Q.one, Q.of(2)]).mul(Q.of(rng.sign()));
    const k = shift ? rng.nonZero(-3, 3) : 0;
    const depth = (a.toNumber() * (s - r) ** 2) / 4;
    if (Math.abs(depth) < 1.5 || Math.abs(k - depth) > 5.5) continue;
    return { a, r, s, k };
  }
}

/** parabolaAt evaluates a drawn parabola. */
const parabolaAt = (p: Parabola) => (x: number) => p.a.toNumber() * (x - p.r) * (x - p.s) + p.k;

/** parabolaFigure draws a parabola, and the dashed line y = k when k is not 0, with their meeting points. */
function parabolaFigure(p: Parabola): Figure {
  const marks: PlaneMark[] = [{ kind: "curve", f: parabolaAt(p), accent: true }];
  if (p.k !== 0) marks.push({ kind: "line", a: [0, p.k], b: [1, p.k], dashed: true });
  marks.push({ kind: "point", at: [p.r, p.k] }, { kind: "point", at: [p.s, p.k] });
  const up = p.a.sign() > 0;
  const [r, s, k] = [minus(p.r), minus(p.s), minus(p.k)];
  return {
    svg: plane(view, marks),
    alt:
      p.k === 0
        ? t(
            `A parabola opening ${up ? "upward" : "downward"} that crosses the x-axis at x = ${r} and x = ${s}.`,
            `一条开口向${up ? "上" : "下"}的抛物线，与 x 轴交于 x = ${r} 和 x = ${s}。`,
          )
        : t(
            `A parabola opening ${up ? "upward" : "downward"} and the dashed horizontal line y = ${k}. They meet at (${r}, ${k}) and (${s}, ${k}).`,
            `一条开口向${up ? "上" : "下"}的抛物线和水平虚线 y = ${k}，它们交于 (${r}, ${k}) 和 (${s}, ${k})。`,
          ),
  };
}

/** sideWords says where a parabola is above or below a level: outside or between the meeting points. */
function sideWords(up: boolean, op: Op, r: number, s: number, level: Text): Text {
  const outside = up === above(op);
  const where = above(op) ? t("above", "上方") : t("below", "下方");
  return outside
    ? t(
        `The parabola opens ${up ? "upward" : "downward"}, so it is ${where.en} ${level.en} to the left of $x = ${r}$ and to the right of $x = ${s}$.`,
        `抛物线开口向${up ? "上" : "下"}，所以在 $x = ${r}$ 左侧和 $x = ${s}$ 右侧位于${level["zh-CN"]}${where["zh-CN"]}。`,
      )
    : t(
        `The parabola opens ${up ? "upward" : "downward"}, so it is ${where.en} ${level.en} between $x = ${r}$ and $x = ${s}$.`,
        `抛物线开口向${up ? "上" : "下"}，所以在 $x = ${r}$ 与 $x = ${s}$ 之间位于${level["zh-CN"]}${where["zh-CN"]}。`,
      );
}

/** solvingQuadraticInequalitiesFromGraphs reads the solutions of a quadratic inequality from the graph of the parabola. */
export const solvingQuadraticInequalitiesFromGraphs: TopicDef = {
  id: "solving-quadratic-inequalities-from-graphs",
  title: t("Solving Quadratic Inequalities From Graphs", "由图象解二次不等式"),
  summary: t(
    "Read the solutions of $f(x) > 0$, $f(x) \\le 0$ and $f(x) \\ge k$ from the graph of a quadratic function.",
    "由二次函数的图象读出 $f(x) > 0$、$f(x) \\le 0$ 和 $f(x) \\ge k$ 的解。",
  ),
  prerequisites: ["solving-elementary-quadratic-inequalities", "roots-of-quadratic-functions"],
  encompasses: [
    { topic: "roots-of-quadratic-functions", weight: 0.3 },
    { topic: "solving-elementary-quadratic-inequalities", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.REI.D.11"],
  knowledgePoints: [
    {
      id: "comparing-with-zero",
      title: t("Where the graph is above or below the x-axis", "图象在 x 轴上方或下方的部分"),
      explanation: t(
        "$f(x) > 0$ where the graph of $y = f(x)$ is **above** the $x$-axis, and $f(x) < 0$ where it is **below**. The graph changes sides only at its $x$-intercepts.\n\nThe parabola shown opens upward and crosses the $x$-axis at $-1$ and $3$. It is below the axis between them, so $f(x) < 0$ on $(-1, 3)$, and above it outside, so $f(x) > 0$ on $(-\\infty, -1) \\cup (3, \\infty)$. For $f(x) \\le 0$ the intercepts count too, since $f$ is $0$ there: $[-1, 3]$.",
        "当 $y = f(x)$ 的图象在 $x$ 轴**上方**时 $f(x) > 0$，在**下方**时 $f(x) < 0$。图象只在与 $x$ 轴的交点处换到另一侧。\n\n图中的抛物线开口向上，与 $x$ 轴交于 $-1$ 和 $3$。它在两交点之间位于 $x$ 轴下方，所以 $f(x) < 0$ 的解是 $(-1, 3)$；在两侧位于上方，所以 $f(x) > 0$ 的解是 $(-\\infty, -1) \\cup (3, \\infty)$。对 $f(x) \\le 0$，交点处 $f$ 为 $0$，也要算上：$[-1, 3]$。",
      ),
      figure: parabolaFigure({ a: Q.one, r: -1, s: 3, k: 0 }),
      generate(rng) {
        const p = drawParabola(rng, false);
        const op = rng.pick(ops);
        const fs = [lin(1, -p.r), lin(1, -p.s)];
        const set = chartSet(p.a, fs, op);
        const up = p.a.sign() > 0;
        const side = sideWords(up, op, p.r, p.s, t("the $x$-axis", "$x$ 轴"));
        return {
          ...intervalProblem({
            prompt: t(
              `The graph of the quadratic function $y = f(x)$ is shown. Solve $f(x) ${opL[op]} 0$. Write the answer in interval notation.`,
              `图中是二次函数 $y = f(x)$ 的图象。解不等式 $f(x) ${opL[op]} 0$，用区间表示解集。`,
            ),
            set,
            form: "interval",
            wrong: [complement(set), chartSet(p.a, fs, toggled[op]), chartSet(p.a, fs, reversed[op])],
            solution: t(
              `The graph crosses the $x$-axis at $x = ${p.r}$ and $x = ${p.s}$. ${side.en} ${ends(op).en} The solution is $${setL(set)}$.`,
              `图象与 $x$ 轴交于 $x = ${p.r}$ 和 $x = ${p.s}$。${side["zh-CN"]}${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`,
            ),
          }),
          figure: parabolaFigure(p),
        };
      },
    },
    {
      id: "comparing-with-a-line",
      title: t("Comparing with a horizontal line", "与水平直线比较"),
      explanation: t(
        "To solve $f(x) \\ge k$ from a graph, draw the line $y = k$: the solutions are the $x$-values where the parabola is on or above the line. They are bounded by the $x$-coordinates of the points where the two graphs meet.\n\nIf a downward parabola meets $y = 2$ at $(-3, 2)$ and $(1, 2)$, it is above the line between them, so $f(x) \\ge 2$ on $[-3, 1]$ and $f(x) < 2$ on $(-\\infty, -3) \\cup (1, \\infty)$.",
        "要由图象解 $f(x) \\ge k$，画出直线 $y = k$：解就是抛物线在这条直线上或上方的那些 $x$。它们以两图象交点的横坐标为界。\n\n如果一条开口向下的抛物线与 $y = 2$ 交于 $(-3, 2)$ 和 $(1, 2)$，它在两点之间位于直线上方，所以 $f(x) \\ge 2$ 的解是 $[-3, 1]$，$f(x) < 2$ 的解是 $(-\\infty, -3) \\cup (1, \\infty)$。",
      ),
      generate(rng) {
        const p = drawParabola(rng, true);
        const op = rng.pick(ops);
        const fs = [lin(1, -p.r), lin(1, -p.s)];
        const set = chartSet(p.a, fs, op);
        const up = p.a.sign() > 0;
        const side = sideWords(up, op, p.r, p.s, t(`the line $y = ${p.k}$`, `直线 $y = ${p.k}$ 的`));
        return {
          ...intervalProblem({
            prompt: t(
              `The graphs of the quadratic function $y = f(x)$ and the line $y = ${p.k}$ are shown. Solve $f(x) ${opL[op]} ${p.k}$. Write the answer in interval notation.`,
              `图中是二次函数 $y = f(x)$ 和直线 $y = ${p.k}$ 的图象。解不等式 $f(x) ${opL[op]} ${p.k}$，用区间表示解集。`,
            ),
            set,
            form: "interval",
            wrong: [complement(set), chartSet(p.a, fs, toggled[op]), chartSet(p.a, fs, reversed[op])],
            solution: t(
              `The graphs meet at $x = ${p.r}$ and $x = ${p.s}$. ${side.en} ${ends(op).en} The solution is $${setL(set)}$.`,
              `两图象交于 $x = ${p.r}$ 和 $x = ${p.s}$。${side["zh-CN"]}${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`,
            ),
          }),
          figure: parabolaFigure(p),
        };
      },
    },
  ],
};

// ─── 3.6.3 Solving quadratic inequalities using the graphical method ───────

/** graphicalWords explains the graphical method for k(x − r)(x − s) op 0 with r < s. */
function graphicalWords(k: number, r: Q, s: Q, op: Op, set: RealSet): Text {
  const up = k > 0;
  const outside = up === above(op);
  const [R, S] = [r.toLatex(), s.toLatex()];
  return t(
    `The roots are $${R}$ and $${S}$. The graph of the quadratic is a parabola that opens ${up ? "upward" : "downward"}, so it is ${above(op) ? "above" : "below"} the $x$-axis ${outside ? `to the left of $${R}$ and to the right of $${S}$` : `between $${R}$ and $${S}$`}. ${ends(op).en} The solution is $${setL(set)}$.`,
    `两根是 $${R}$ 和 $${S}$。二次式的图象是开口向${up ? "上" : "下"}的抛物线，所以${outside ? `在 $${R}$ 左侧和 $${S}$ 右侧` : `在 $${R}$ 与 $${S}$ 之间`}位于 $x$ 轴${above(op) ? "上方" : "下方"}。${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`,
  );
}

/** distinctPair draws two distinct integers in [lo, hi], the smaller first. */
function distinctPair(rng: Rng, lo: number, hi: number): [number, number] {
  const [r, s] = rng.sample(range(lo, hi), 2) as [number, number];
  return r < s ? [r, s] : [s, r];
}

/** solvingQuadraticInequalitiesUsingTheGraphicalMethod solves quadratic inequalities by finding the roots and picturing the parabola. */
export const solvingQuadraticInequalitiesUsingTheGraphicalMethod: TopicDef = {
  id: "solving-quadratic-inequalities-using-the-graphical-method",
  title: t("Solving Quadratic Inequalities Using the Graphical Method", "用图象法解二次不等式"),
  summary: t(
    "Solve a quadratic inequality by factoring, finding the roots and picturing which way the parabola opens.",
    "通过因式分解求根，再想象抛物线的开口方向来解二次不等式。",
  ),
  prerequisites: ["solving-quadratic-inequalities-from-graphs", "solving-quadratic-equations-with-leading-coefficients-by-factoring"],
  encompasses: [
    { topic: "solving-quadratic-inequalities-from-graphs", weight: 0.5 },
    { topic: "solving-quadratic-equations-with-leading-coefficients-by-factoring", weight: 0.3 },
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.4"],
  knowledgePoints: [
    {
      id: "monic-quadratic-inequalities",
      title: t("Factoring and picturing the parabola", "因式分解并想象抛物线"),
      explanation: t(
        "To solve $x^{2} - x - 6 > 0$ without a graph, factor to find the roots, then picture the graph:\n\n$$x^{2} - x - 6 = (x + 2)(x - 3)$$\n\nThe roots are $-2$ and $3$. The coefficient of $x^{2}$ is positive, so the parabola opens upward: it is below the $x$-axis between the roots and above it outside them. So $x^{2} - x - 6 > 0$ on $(-\\infty, -2) \\cup (3, \\infty)$, and $x^{2} - x - 6 \\le 0$ on $[-2, 3]$.",
        "不画图也能解 $x^{2} - x - 6 > 0$：先因式分解求根，再想象图象：\n\n$$x^{2} - x - 6 = (x + 2)(x - 3)$$\n\n两根是 $-2$ 和 $3$。$x^{2}$ 的系数为正，抛物线开口向上：在两根之间位于 $x$ 轴下方，在两根之外位于上方。所以 $x^{2} - x - 6 > 0$ 的解是 $(-\\infty, -2) \\cup (3, \\infty)$，$x^{2} - x - 6 \\le 0$ 的解是 $[-2, 3]$。",
      ),
      generate(rng) {
        const [r, s] = distinctPair(rng, -9, 9);
        const op = rng.pick(ops);
        const fs = [lin(1, -r), lin(1, -s)];
        const set = chartSet(1, fs, op);
        const f = quad(1, -(r + s), r * s);
        return intervalProblem({
          prompt: solvePrompt(`${f} ${opL[op]} 0`),
          set,
          form: "interval",
          wrong: [complement(set), chartSet(1, fs, toggled[op]), chartSet(1, [lin(1, r), lin(1, s)], op)],
          solution: t(
            `Factor:${steps(`${f} = ${product(1, fs)}`)}${graphicalWords(1, Q.of(r), Q.of(s), op, set).en}`,
            `因式分解：${steps(`${f} = ${product(1, fs)}`)}${graphicalWords(1, Q.of(r), Q.of(s), op, set)["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "quadratic-inequalities-with-leading-coefficients",
      title: t("Leading coefficients", "首项系数不为 1"),
      explanation: t(
        "The roots may be fractions. For $2x^{2} + x - 6 \\le 0$:\n\n$$2x^{2} + x - 6 = (2x - 3)(x + 2)$$\n\nThe roots are $-2$ and $\\frac{3}{2}$, and the parabola opens upward, so it is on or below the $x$-axis on $\\left[-2, \\frac{3}{2}\\right]$.\n\nWhen the coefficient of $x^{2}$ is negative, the parabola opens downward, and the roles swap: $-2x^{2} - x + 6 \\le 0$ on $(-\\infty, -2] \\cup \\left[\\frac{3}{2}, \\infty\\right)$.",
        "根可以是分数。对 $2x^{2} + x - 6 \\le 0$：\n\n$$2x^{2} + x - 6 = (2x - 3)(x + 2)$$\n\n两根是 $-2$ 和 $\\frac{3}{2}$，抛物线开口向上，所以在 $\\left[-2, \\frac{3}{2}\\right]$ 上位于 $x$ 轴上或下方。\n\n$x^{2}$ 的系数为负时，抛物线开口向下，两种情形互换：$-2x^{2} - x + 6 \\le 0$ 的解是 $(-\\infty, -2] \\cup \\left[\\frac{3}{2}, \\infty\\right)$。",
      ),
      generate(rng) {
        for (;;) {
          const p1 = rng.pick([1, 2, 3]);
          const p2 = rng.pick([2, 3, 4]);
          const q1 = rng.nonZero(-7, 7);
          const q2 = rng.nonZero(-7, 7);
          if (gcd(p1, q1) !== 1 || gcd(p2, q2) !== 1 || p1 * q2 === p2 * q1) continue;
          const k = rng.sign();
          const op = rng.pick(ops);
          const fs = [lin(p1, q1), lin(p2, q2)];
          const set = chartSet(k, fs, op);
          const f = quad(k * p1 * p2, k * (p1 * q2 + p2 * q1), k * q1 * q2);
          const roots = [Q.of(-q1, p1), Q.of(-q2, p2)].sort((a, b) => a.cmp(b)) as [Q, Q];
          const words = graphicalWords(k, roots[0], roots[1], op, set);
          return intervalProblem({
            prompt: solvePrompt(`${f} ${opL[op]} 0`),
            set,
            form: "interval",
            wrong: [complement(set), chartSet(-k, fs, op), chartSet(k, [lin(p1, -q1), lin(p2, -q2)], op)],
            solution: t(
              `Factor:${steps(`${f} = ${product(k, fs)}`)}${words.en}`,
              `因式分解：${steps(`${f} = ${product(k, fs)}`)}${words["zh-CN"]}`,
            ),
          });
        }
      },
    },
    {
      id: "moving-terms-to-one-side",
      title: t("Moving every term to one side", "把各项移到同一边"),
      explanation: t(
        "Move every term to one side so that the other side is $0$, then factor:\n\n$$x^{2} + 2x \\ge 15 \\implies x^{2} + 2x - 15 \\ge 0 \\implies (x + 5)(x - 3) \\ge 0$$\n\nso the solution is $(-\\infty, -5] \\cup [3, \\infty)$. If the $x^{2}$ term ends up negative, multiplying by $-1$ makes it positive but reverses the inequality:\n\n$$6 - x^{2} > x \\implies -x^{2} - x + 6 > 0 \\implies x^{2} + x - 6 < 0 \\implies (x + 3)(x - 2) < 0$$\n\nso the solution is $(-3, 2)$.",
        "先把各项移到同一边，使另一边为 $0$，再因式分解：\n\n$$x^{2} + 2x \\ge 15 \\implies x^{2} + 2x - 15 \\ge 0 \\implies (x + 5)(x - 3) \\ge 0$$\n\n所以解集是 $(-\\infty, -5] \\cup [3, \\infty)$。如果移项后 $x^{2}$ 项为负，乘以 $-1$ 使它变正，但不等号要反向：\n\n$$6 - x^{2} > x \\implies -x^{2} - x + 6 > 0 \\implies x^{2} + x - 6 < 0 \\implies (x + 3)(x - 2) < 0$$\n\n所以解集是 $(-3, 2)$。",
      ),
      generate(rng) {
        for (;;) {
          const [r, s] = distinctPair(rng, -7, 7);
          if (r * s === 0 || r + s === 0) continue;
          const g = rng.sign();
          const op = rng.pick(ops);
          const [A, B, C] = [g, -g * (r + s), g * r * s];
          const layout = rng.int(0, 2);
          const ineq =
            layout === 0
              ? `${poly([A, "x^{2}"], [B, "x"])} ${opL[op]} ${-C}`
              : layout === 1
                ? `${poly([A, "x^{2}"])} ${opL[op]} ${poly([-B, "x"], [-C, ""])}`
                : `${C} ${opL[op]} ${poly([-A, "x^{2}"], [-B, "x"])}`;
          const fs = [lin(1, -r), lin(1, -s)];
          const op2 = g < 0 ? reversed[op] : op;
          const set = chartSet(1, fs, op2);
          const moved = `${quad(A, B, C)} ${opL[op]} 0`;
          const lines = [moved, ...(g < 0 ? [`${quad(1, -(r + s), r * s)} ${opL[op2]} 0`] : []), `${product(1, fs)} ${opL[op2]} 0`];
          const words = graphicalWords(1, Q.of(r), Q.of(s), op2, set);
          return intervalProblem({
            prompt: solvePrompt(ineq),
            set,
            form: "interval",
            wrong: [complement(set), chartSet(1, fs, op), chartSet(1, fs, toggled[op2])],
            solution: t(
              `Move every term to one side${g < 0 ? ", then multiply by $-1$, which reverses the inequality" : ""}, and factor:${steps(...lines)}${words.en}`,
              `把各项移到同一边${g < 0 ? "，再乘以 $-1$，不等号反向" : ""}，然后因式分解：${steps(...lines)}${words["zh-CN"]}`,
            ),
          });
        }
      },
    },
  ],
};

// ─── 3.6.4 Solving quadratic inequalities using the sign table method ──────

/** Drawn is a linear factor as written, and the factor a learner who ignores the order of its terms would use. */
interface DrawnFactor {
  readonly f: Factor;
  readonly plain: Factor;
  /** p, q and flip describe the factor: px − q, or q − px when flip is set. */
  readonly p: number;
  readonly q: number;
  readonly flip: boolean;
}

/** drawFactor draws a factor px − q or q − px with a root q/p not among used. */
function drawFactor(rng: Rng, used: readonly Q[], flips = true, ps: readonly number[] = [1, 1, 2, 3]): DrawnFactor {
  for (;;) {
    const p = rng.pick(ps);
    const q = rng.int(-7, 7);
    if (gcd(p, q) !== 1 || used.some((u) => u.eq(Q.of(q, p)))) continue;
    const plain = lin(p, -q);
    if (flips && q !== 0 && rng.bool(0.35)) return { f: lin(-p, q, 1, { flip: true }), plain, p, q, flip: true };
    return { f: plain, plain, p, q, flip: false };
  }
}

/** drawFactors draws n factors with distinct roots. */
function drawFactors(rng: Rng, n: number, flips = true, ps?: readonly number[]): DrawnFactor[] {
  const out: DrawnFactor[] = [];
  for (let i = 0; i < n; i++)
    out.push(
      drawFactor(
        rng,
        out.map((d) => d.f.root!),
        flips,
        ps,
      ),
    );
  return out;
}

const signOptions: readonly Text[] = [t("Positive", "正"), t("Negative", "负")];

/** intervalName writes the i-th interval between the cuts. */
const intervalName = (cuts: readonly Q[], i: number) =>
  `(${i === 0 ? "-\\infty" : cuts[i - 1]!.toLatex()}, ${i === cuts.length ? "\\infty" : cuts[i]!.toLatex()})`;

/** signTableExample is the sign table of (2x − 1)(3 − x). */
const signTableExample = chartTable(1, [lin(2, -1), lin(-1, 3, 1, { flip: true })], "(2x - 1)(3 - x)");

/** solvingQuadraticInequalitiesUsingTheSignTableMethod solves factored quadratic inequalities with a sign table. */
export const solvingQuadraticInequalitiesUsingTheSignTableMethod: TopicDef = {
  id: "solving-quadratic-inequalities-using-the-sign-table-method",
  title: t("Solving Quadratic Inequalities Using the Sign Table Method", "用符号表法解二次不等式"),
  summary: t(
    "Record the sign of each factor on the intervals between the roots in a sign table, and read off where the product is positive or negative.",
    "在符号表中记录各因式在根之间各区间上的符号，读出乘积何时为正、何时为负。",
  ),
  prerequisites: ["solving-quadratic-inequalities-using-the-graphical-method"],
  encompasses: [{ topic: "solving-quadratic-inequalities-using-the-graphical-method", weight: 0.5 }],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.4"],
  knowledgePoints: [
    {
      id: "signs-of-a-product",
      title: t("The sign of a product on an interval", "乘积在区间上的符号"),
      explanation: t(
        `A linear factor changes sign only at its root. The roots of $(2x - 1)(3 - x)$ are $\\frac{1}{2}$ and $3$, which cut the number line into three intervals. Pick a test number in each, such as $0$, $1$ and $4$, and record the sign of each factor; the product has the sign given by the rule of signs:${signTableExample}So the product is positive on $\\left(\\frac{1}{2}, 3\\right)$ and negative on the other two intervals. Watch the factor $3 - x$: it is positive to the left of $3$, the opposite of $x - 3$.`,
        `一次因式只在它的根处变号。$(2x - 1)(3 - x)$ 的根是 $\\frac{1}{2}$ 和 $3$，它们把数轴分成三个区间。在每个区间中取一个检验数，例如 $0$、$1$ 和 $4$，记下各因式的符号；乘积的符号由符号法则给出：${signTableExample}所以乘积在 $\\left(\\frac{1}{2}, 3\\right)$ 上为正，在另两个区间上为负。注意因式 $3 - x$：它在 $3$ 的左侧为正，与 $x - 3$ 正好相反。`,
      ),
      generate(rng) {
        const fs = drawFactors(rng, 2).map((d) => d.f);
        const k = rng.pick([1, 1, -1, 2]);
        const c = chart(k, fs);
        const i = rng.int(0, c.cuts.length);
        const name = product(k, fs);
        const positive = c.signs[i]! > 0;
        return choiceProblem({
          prompt: t(
            `Is $f(x) = ${name}$ positive or negative on the interval $${intervalName(c.cuts, i)}$?`,
            `$f(x) = ${name}$ 在区间 $${intervalName(c.cuts, i)}$ 上为正还是为负？`,
          ),
          options: signOptions,
          correct: positive ? 0 : 1,
          solution: t(
            `${critWords(fs).en} The sign table:${chartTable(k, fs, "f(x)")}On $${intervalName(c.cuts, i)}$ the product is ${positive ? "positive" : "negative"}.`,
            `${critWords(fs)["zh-CN"]}符号表：${chartTable(k, fs, "f(x)")}在 $${intervalName(c.cuts, i)}$ 上乘积为${positive ? "正" : "负"}。`,
          ),
        });
      },
    },
    {
      id: "solving-with-a-sign-table",
      title: t("Solving with a sign table", "用符号表解不等式"),
      explanation: t(
        `To solve $(2x - 1)(3 - x) \\ge 0$, build the sign table:${signTableExample}The product is positive on $\\left(\\frac{1}{2}, 3\\right)$ and zero at the roots, which the non-strict $\\ge$ includes. The solution is $\\left[\\frac{1}{2}, 3\\right]$.`,
        `要解 $(2x - 1)(3 - x) \\ge 0$，先列符号表：${signTableExample}乘积在 $\\left(\\frac{1}{2}, 3\\right)$ 上为正，在两根处为零，而非严格的 $\\ge$ 包含零。解集是 $\\left[\\frac{1}{2}, 3\\right]$。`,
      ),
      generate(rng) {
        for (;;) {
          const ds = drawFactors(rng, 2);
          if (ds.every((d) => d.f === d.plain) && rng.bool(0.6)) continue;
          const fs = ds.map((d) => d.f);
          const k = rng.pick([1, 1, -1, 2, -3]);
          const op = rng.pick(ops);
          const set = chartSet(k, fs, op);
          const name = product(k, fs);
          return intervalProblem({
            prompt: solvePrompt(`${name} ${opL[op]} 0`),
            set,
            form: "interval",
            wrong: [
              complement(set),
              chartSet(
                k,
                ds.map((d) => d.plain),
                op,
              ),
              chartSet(k, fs, toggled[op]),
            ],
            solution: chartSolution(k, fs, name, op, set),
          });
        }
      },
    },
    {
      id: "products-compared-with-a-number",
      title: t("A product compared with a number", "乘积与非零数比较"),
      explanation: t(
        "The sign table works only when one side is $0$. In $(x - 1)(x - 3) > 8$ the roots $1$ and $3$ tell us nothing: expand, move the $8$ and factor again:\n\n$$x^{2} - 4x + 3 > 8 \\implies x^{2} - 4x - 5 > 0 \\implies (x + 1)(x - 5) > 0$$\n\nso the solution is $(-\\infty, -1) \\cup (5, \\infty)$.",
        "只有一边为 $0$ 时才能用符号表。在 $(x - 1)(x - 3) > 8$ 中，根 $1$ 和 $3$ 没有用处：展开，移走 $8$，再因式分解：\n\n$$x^{2} - 4x + 3 > 8 \\implies x^{2} - 4x - 5 > 0 \\implies (x + 1)(x - 5) > 0$$\n\n所以解集是 $(-\\infty, -1) \\cup (5, \\infty)$。",
      ),
      generate(rng) {
        for (;;) {
          const [r, s] = distinctPair(rng, -6, 6);
          const p = rng.int(-6, 6);
          const q = r + s - p;
          const k = r * s - p * q;
          if (k === 0 || p === q || Math.abs(q) > 8) continue;
          const op = rng.pick(ops);
          const given = [lin(1, -p), lin(1, -q)];
          const fs = [lin(1, -r), lin(1, -s)];
          const set = chartSet(1, fs, op);
          return intervalProblem({
            prompt: solvePrompt(`${product(1, given)} ${opL[op]} ${k}`),
            set,
            form: "interval",
            wrong: [chartSet(1, given, op), complement(set), chartSet(1, fs, toggled[op])],
            solution: chartSolution(
              1,
              fs,
              product(1, fs),
              op,
              set,
              t(
                `Expand, move the constant and factor again:${steps(`${quad(1, -(p + q), p * q)} ${opL[op]} ${k}`, `${quad(1, -(r + s), r * s)} ${opL[op]} 0`, `${product(1, fs)} ${opL[op]} 0`)}`,
                `展开，移走常数，再因式分解：${steps(`${quad(1, -(p + q), p * q)} ${opL[op]} ${k}`, `${quad(1, -(r + s), r * s)} ${opL[op]} 0`, `${product(1, fs)} ${opL[op]} 0`)}`,
              ),
            ),
          });
        }
      },
    },
  ],
};

// ─── 3.6.5–3.6.7 Unknown parameters in quadratic equations ─────────────────

/** Condition is what a quadratic equation is required to have. */
type Condition = "real" | "distinct" | "none";

const conditionText: Record<Condition, Text> = {
  real: t("real solutions", "有实数解"),
  distinct: t("two distinct real solutions", "有两个不相等的实数解"),
  none: t("no real solutions", "没有实数解"),
};

/** discriminantOp is the relation the discriminant must satisfy. */
const discriminantOp: Record<Condition, Op> = { real: ">=", distinct: ">", none: "<" };

const discriminantWords: Record<Condition, Text> = {
  real: t("at least $0$", "大于或等于 $0$"),
  distinct: t("positive", "为正"),
  none: t("negative", "为负"),
};

/** parameterPrompt asks for the values of k for which an equation meets a condition. */
const parameterPrompt = (eq: string, c: Condition): Text =>
  t(
    `For which values of $k$ does the equation $${eq}$ have ${conditionText[c].en}? Write the answer in interval notation.`,
    `$k$ 取哪些值时，方程 $${eq}$ ${conditionText[c]["zh-CN"]}？用区间表示。`,
  );

/** constantParameter is the knowledge point for ax² + bx + (k + d) = 0 under a condition. */
function constantParameter(rng: Rng, c: Condition) {
  const a = rng.pick([1, 2, 3, -1, -2]);
  const b = rng.nonZero(-10, 10);
  const d = rng.bool(0.5) ? 0 : rng.nonZero(-6, 6);
  const cTex = poly([1, "k"], [d, ""]);
  const eq = `${poly([a, "x^{2}"], [b, "x"])}${plusGroup(cTex)} = 0`;
  const v = Q.of(b * b - 4 * a * d, 4 * a);
  const dOp = discriminantOp[c];
  const op = -4 * a < 0 ? reversed[dOp] : dOp;
  const set = ray(op, v);
  const D = poly([-4 * a, "k"], [b * b - 4 * a * d, ""]);
  const lines = [
    `b^{2} - 4ac = ${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot ${d === 0 ? "k" : `(${cTex})`} = ${D}`,
    `${D} ${opL[dOp]} 0`,
    `k ${opL[op]} ${v.toLatex()}`,
  ];
  const flip = -4 * a < 0;
  return intervalProblem({
    prompt: parameterPrompt(eq, c),
    set,
    form: "interval",
    variable: "k",
    wrong: [ray(reversed[op], v), ray(toggled[op], v), ray(op, Q.of(b * b, 4 * a)), ray(op, Q.of(b * b - 4 * a * d, a))],
    solution: t(
      `The equation has ${conditionText[c].en} exactly when the discriminant is ${discriminantWords[c].en}. Here $a = ${a}$, $b = ${b}$ and $c = ${cTex}$; solve for $k$${flip ? `, reversing the inequality when dividing by $${-4 * a}$` : ""}:${steps(...lines)}The solution is $${setL(set)}$.`,
      `方程${conditionText[c]["zh-CN"]}当且仅当判别式${discriminantWords[c]["zh-CN"]}。这里 $a = ${a}$，$b = ${b}$，$c = ${cTex}$；解关于 $k$ 的不等式${flip ? `，除以 $${-4 * a}$ 时不等号反向` : ""}：${steps(...lines)}解集是 $${setL(set)}$。`,
    ),
  });
}

/** linearParameter is the knowledge point for ax² + kx + c = 0 with 4ac a perfect square, under a condition. */
function linearParameter(rng: Rng, c: Condition) {
  const a = rng.pick([1, 2, 3, -1, -2]);
  const m = rng.int(1, 6);
  const C = a * m * m;
  const B = 2 * Math.abs(a) * m;
  const eq = `${poly([a, "x^{2}"], [1, "kx"], [C, ""])} = 0`;
  const op = discriminantOp[c];
  const set = absSet(0, B, op);
  const lines = [
    `b^{2} - 4ac = k^{2} - 4 \\cdot ${paren(a)} \\cdot ${paren(C)} = k^{2} - ${B * B}`,
    `k^{2} ${opL[op]} ${B * B}`,
    `|k| ${opL[op]} ${B}`,
  ];
  return intervalProblem({
    prompt: parameterPrompt(eq, c),
    set,
    form: "interval",
    variable: "k",
    wrong: [ray(op, B), complement(set), absSet(0, B / 2, op), absSet(0, B * B, op)],
    solution: t(
      `The equation has ${conditionText[c].en} exactly when the discriminant is ${discriminantWords[c].en}. Here $b = k$, so the condition is a quadratic inequality in $k$:${steps(...lines)}The solution is $${setL(set)}$.`,
      `方程${conditionText[c]["zh-CN"]}当且仅当判别式${discriminantWords[c]["zh-CN"]}。这里 $b = k$，所以条件是关于 $k$ 的二次不等式：${steps(...lines)}解集是 $${setL(set)}$。`,
    ),
  });
}

/** determiningUnknownParametersInQuadraticEquationsWithRealSolutions finds the values of a parameter for which the discriminant is not negative. */
export const determiningUnknownParametersInQuadraticEquationsWithRealSolutions: TopicDef = {
  id: "determining-unknown-parameters-in-quadratic-equations-with-real-solutions",
  title: t("Determining Unknown Parameters in Quadratic Equations With Real Solutions", "确定有实数解的二次方程中的参数"),
  summary: t(
    "Find the values of $k$ for which a quadratic equation has real solutions, or two distinct real solutions, from an inequality for the discriminant.",
    "由判别式满足的不等式，求使二次方程有实数解或有两个不相等实数解的 $k$ 的值。",
  ),
  prerequisites: ["the-discriminant-of-a-quadratic-equation", "solving-elementary-quadratic-inequalities"],
  encompasses: [
    { topic: "the-discriminant-of-a-quadratic-equation", weight: 0.5 },
    { topic: "solving-multi-step-inequalities", weight: 0.3 },
    { topic: "solving-elementary-quadratic-inequalities", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "a-parameter-in-the-constant-term",
      title: t("A parameter in the constant term", "参数在常数项中"),
      explanation: t(
        "$ax^{2} + bx + c = 0$ has real solutions exactly when $b^{2} - 4ac \\ge 0$, and two distinct real solutions exactly when $b^{2} - 4ac > 0$. When the equation contains an unknown $k$, this gives an inequality for $k$. For $2x^{2} - 6x + k = 0$ to have real solutions:\n\n$$(-6)^{2} - 4 \\cdot 2 \\cdot k \\ge 0 \\implies 36 - 8k \\ge 0 \\implies -8k \\ge -36 \\implies k \\le \\frac{9}{2}$$\n\nDividing by $-8$ reverses the inequality. The answer is $\\left(-\\infty, \\frac{9}{2}\\right]$.",
        "$ax^{2} + bx + c = 0$ 有实数解当且仅当 $b^{2} - 4ac \\ge 0$，有两个不相等的实数解当且仅当 $b^{2} - 4ac > 0$。方程含有未知参数 $k$ 时，这就给出关于 $k$ 的不等式。要使 $2x^{2} - 6x + k = 0$ 有实数解：\n\n$$(-6)^{2} - 4 \\cdot 2 \\cdot k \\ge 0 \\implies 36 - 8k \\ge 0 \\implies -8k \\ge -36 \\implies k \\le \\frac{9}{2}$$\n\n除以 $-8$ 时不等号反向。答案是 $\\left(-\\infty, \\frac{9}{2}\\right]$。",
      ),
      keyPrerequisites: ["the-discriminant-of-a-quadratic-equation"],
      generate: (rng) => constantParameter(rng, rng.bool(0.6) ? "real" : "distinct"),
    },
    {
      id: "a-parameter-in-the-coefficient-of-x",
      title: t("A parameter in the coefficient of $x$", "参数在一次项系数中"),
      explanation: t(
        "When $k$ is the coefficient of $x$, the discriminant contains $k^{2}$, and the condition is a quadratic inequality. For $x^{2} + kx + 9 = 0$ to have real solutions:\n\n$$k^{2} - 4 \\cdot 1 \\cdot 9 \\ge 0 \\implies k^{2} \\ge 36 \\implies |k| \\ge 6$$\n\nThe answer is $(-\\infty, -6] \\cup [6, \\infty)$: negative values of $k$ work as well as positive ones.",
        "$k$ 是 $x$ 的系数时，判别式含有 $k^{2}$，条件是一个二次不等式。要使 $x^{2} + kx + 9 = 0$ 有实数解：\n\n$$k^{2} - 4 \\cdot 1 \\cdot 9 \\ge 0 \\implies k^{2} \\ge 36 \\implies |k| \\ge 6$$\n\n答案是 $(-\\infty, -6] \\cup [6, \\infty)$：负的 $k$ 和正的一样可以。",
      ),
      generate: (rng) => linearParameter(rng, rng.bool(0.6) ? "real" : "distinct"),
    },
  ],
};

/** determiningUnknownParametersInQuadraticEquationsWithNoRealSolutions finds the values of a parameter for which the discriminant is negative. */
export const determiningUnknownParametersInQuadraticEquationsWithNoRealSolutions: TopicDef = {
  id: "determining-unknown-parameters-in-quadratic-equations-with-no-real-solutions",
  title: t("Determining Unknown Parameters in Quadratic Equations With No Real Solutions", "确定没有实数解的二次方程中的参数"),
  summary: t(
    "Find the values of $k$ for which a quadratic equation has no real solutions, or a quadratic function stays on one side of the $x$-axis.",
    "求使二次方程没有实数解、或使二次函数始终在 $x$ 轴一侧的 $k$ 的值。",
  ),
  prerequisites: ["determining-unknown-parameters-in-quadratic-equations-with-real-solutions"],
  encompasses: [{ topic: "determining-unknown-parameters-in-quadratic-equations-with-real-solutions", weight: 0.5 }],
  xp: 14,
  standards: ["CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "no-real-solutions-constant-term",
      title: t("A parameter in the constant term", "参数在常数项中"),
      explanation: t(
        "$ax^{2} + bx + c = 0$ has no real solutions exactly when $b^{2} - 4ac < 0$. For $x^{2} + 4x + (k - 1) = 0$:\n\n$$4^{2} - 4 \\cdot 1 \\cdot (k - 1) < 0 \\implies 20 - 4k < 0 \\implies k > 5$$\n\nThe answer is $(5, \\infty)$. The endpoint $5$ is excluded: for $k = 5$ the discriminant is $0$ and the equation has one solution.",
        "$ax^{2} + bx + c = 0$ 没有实数解当且仅当 $b^{2} - 4ac < 0$。对 $x^{2} + 4x + (k - 1) = 0$：\n\n$$4^{2} - 4 \\cdot 1 \\cdot (k - 1) < 0 \\implies 20 - 4k < 0 \\implies k > 5$$\n\n答案是 $(5, \\infty)$。端点 $5$ 不包含：$k = 5$ 时判别式为 $0$，方程有一个解。",
      ),
      generate: (rng) => constantParameter(rng, "none"),
    },
    {
      id: "no-real-solutions-coefficient-of-x",
      title: t("A parameter in the coefficient of $x$", "参数在一次项系数中"),
      explanation: t(
        "For $2x^{2} + kx + 8 = 0$ to have no real solutions:\n\n$$k^{2} - 4 \\cdot 2 \\cdot 8 < 0 \\implies k^{2} < 64 \\implies -8 < k < 8$$\n\nThe answer is $(-8, 8)$.",
        "要使 $2x^{2} + kx + 8 = 0$ 没有实数解：\n\n$$k^{2} - 4 \\cdot 2 \\cdot 8 < 0 \\implies k^{2} < 64 \\implies -8 < k < 8$$\n\n答案是 $(-8, 8)$。",
      ),
      generate: (rng) => linearParameter(rng, "none"),
    },
    {
      id: "quadratics-of-one-sign",
      title: t("Quadratics that never change sign", "始终不变号的二次函数"),
      explanation: t(
        "A parabola that opens upward is above the $x$-axis everywhere exactly when it has no $x$-intercepts, that is when its discriminant is negative. It is on or above the axis everywhere when the discriminant is at most $0$, since it may touch the axis once.\n\nSo $x^{2} - 6x + k > 0$ for every $x$ exactly when $36 - 4k < 0$, that is $k > 9$. For a parabola that opens downward the same reasoning describes when it stays below the axis.",
        "开口向上的抛物线处处在 $x$ 轴上方，当且仅当它与 $x$ 轴没有交点，即判别式为负。它处处在 $x$ 轴上或上方，当且仅当判别式不大于 $0$，因为它可以与 $x$ 轴相切一次。\n\n所以 $x^{2} - 6x + k > 0$ 对所有 $x$ 成立当且仅当 $36 - 4k < 0$，即 $k > 9$。对开口向下的抛物线，同样的道理说明它何时始终在 $x$ 轴下方。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, -1, -2]);
        const b = rng.nonZero(-10, 10);
        const isStrict = rng.bool(0.6);
        const fOp: Op = a > 0 ? (isStrict ? ">" : ">=") : isStrict ? "<" : "<=";
        const dOp: Op = isStrict ? "<" : "<=";
        const op: Op = a > 0 ? reversed[dOp] : dOp;
        const v = Q.of(b * b, 4 * a);
        const set = ray(op, v);
        const f = poly([a, "x^{2}"], [b, "x"], [1, "k"]);
        const D = poly([b * b, ""], [-4 * a, "k"]);
        return intervalProblem({
          prompt: t(
            `For which values of $k$ is $${f} ${opL[fOp]} 0$ for every real number $x$? Write the answer in interval notation.`,
            `$k$ 取哪些值时，$${f} ${opL[fOp]} 0$ 对所有实数 $x$ 都成立？用区间表示。`,
          ),
          set,
          form: "interval",
          variable: "k",
          wrong: [ray(toggled[op], v), ray(reversed[op], v), ray(op, Q.of(b * b, a))],
          solution: t(
            `The parabola opens ${a > 0 ? "upward" : "downward"}, so it stays ${a > 0 ? "above" : "below"} the $x$-axis${isStrict ? "" : ", touching it at most once,"} exactly when the discriminant is ${isStrict ? "negative" : "at most $0$"}:${steps(`${D} ${opL[dOp]} 0`, `k ${opL[op]} ${v.toLatex()}`)}The solution is $${setL(set)}$.`,
            `抛物线开口向${a > 0 ? "上" : "下"}，所以它始终在 $x$ 轴${a > 0 ? "上方" : "下方"}${isStrict ? "" : "（最多与 $x$ 轴相切一次）"}当且仅当判别式${isStrict ? "为负" : "不大于 $0$"}：${steps(`${D} ${opL[dOp]} 0`, `k ${opL[op]} ${v.toLatex()}`)}解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
  ],
};

/** kFactor writes the factor k − r. */
const kFactor = (r: number) => (r === 0 ? "k" : `(${linear(1, -r, "k")})`);

/** determiningUnknownParametersInQuadraticEquationsAdvancedCases handles parameters in several coefficients and in the leading coefficient. */
export const determiningUnknownParametersInQuadraticEquationsAdvancedCases: TopicDef = {
  id: "determining-unknown-parameters-in-quadratic-equations-advanced-cases",
  title: t("Determining Unknown Parameters in Quadratic Equations: Advanced Cases", "确定二次方程中的参数：进阶情形"),
  summary: t(
    "Find the values of $k$ when $k$ appears in several coefficients, or in the leading coefficient, where $k = 0$ must be checked separately.",
    "当 $k$ 出现在多个系数中或出现在首项系数中时求 $k$ 的值，此时要单独检验 $k = 0$。",
  ),
  prerequisites: [
    "determining-unknown-parameters-in-quadratic-equations-with-no-real-solutions",
    "solving-quadratic-inequalities-using-the-graphical-method",
  ],
  encompasses: [
    { topic: "determining-unknown-parameters-in-quadratic-equations-with-no-real-solutions", weight: 0.5 },
    { topic: "determining-unknown-parameters-in-quadratic-equations-with-real-solutions", weight: 0.3 },
    { topic: "solving-quadratic-inequalities-using-the-graphical-method", weight: 0.4 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "parameters-in-several-coefficients",
      title: t("A parameter in several coefficients", "参数出现在多个系数中"),
      explanation: t(
        "When $k$ appears in more than one coefficient, the discriminant is a quadratic in $k$; solve the inequality by factoring. For $x^{2} + 2kx + (k + 6) = 0$ to have two distinct real solutions:\n\n$$(2k)^{2} - 4(k + 6) > 0 \\implies 4k^{2} - 4k - 24 > 0 \\implies k^{2} - k - 6 > 0 \\implies (k + 2)(k - 3) > 0$$\n\nso $k$ is in $(-\\infty, -2) \\cup (3, \\infty)$.",
        "$k$ 出现在多个系数中时，判别式是关于 $k$ 的二次式；通过因式分解解不等式。要使 $x^{2} + 2kx + (k + 6) = 0$ 有两个不相等的实数解：\n\n$$(2k)^{2} - 4(k + 6) > 0 \\implies 4k^{2} - 4k - 24 > 0 \\implies k^{2} - k - 6 > 0 \\implies (k + 2)(k - 3) > 0$$\n\n所以 $k$ 属于 $(-\\infty, -2) \\cup (3, \\infty)$。",
      ),
      generate(rng) {
        const [u, v] = distinctPair(rng, -6, 6);
        const [a, b] = [u + v, -u * v];
        const c = rng.pick(["real", "distinct", "none"] as const);
        const lc = poly([a, "k"], [b, ""]);
        const eq = `x^{2} + 2kx${plusGroup(lc)} = 0`;
        const op = discriminantOp[c];
        const fs = [lin(1, -u), lin(1, -v)];
        const set = chartSet(1, fs, op);
        const lines = [
          `(2k)^{2} - 4 \\cdot 1 \\cdot ${/[+-]/.test(lc.slice(1)) ? `(${lc})` : lc} ${opL[op]} 0`,
          `${poly([4, "k^{2}"], [-4 * a, "k"], [-4 * b, ""])} ${opL[op]} 0`,
          `${poly([1, "k^{2}"], [-a, "k"], [-b, ""])} ${opL[op]} 0`,
          `${kFactor(u)}${kFactor(v)} ${opL[op]} 0`,
        ];
        return intervalProblem({
          prompt: parameterPrompt(eq, c),
          set,
          form: "interval",
          variable: "k",
          wrong: [chartSet(1, fs, reversed[op]), chartSet(1, fs, toggled[op]), chartSet(1, [lin(1, u), lin(1, v)], op)],
          solution: t(
            `The equation has ${conditionText[c].en} exactly when the discriminant is ${discriminantWords[c].en}:${steps(...lines)}The roots in $k$ are $${u}$ and $${v}$, and the graph of this quadratic in $k$ is a parabola that opens upward. The solution is $${setL(set)}$.`,
            `方程${conditionText[c]["zh-CN"]}当且仅当判别式${discriminantWords[c]["zh-CN"]}：${steps(...lines)}关于 $k$ 的两根是 $${u}$ 和 $${v}$，而关于 $k$ 的这个二次式的图象是开口向上的抛物线。解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
    {
      id: "a-parameter-in-the-leading-coefficient",
      title: t("A parameter in the leading coefficient", "参数在首项系数中"),
      explanation: t(
        "When $k$ multiplies $x^{2}$, the value $k = 0$ needs its own check: the equation is then linear, not quadratic. For $kx^{2} + 4x + 2 = 0$:\n\n- **Two distinct real solutions** needs a quadratic, so $k \\ne 0$, and $16 - 8k > 0$, so $k < 2$: the answer is $(-\\infty, 0) \\cup (0, 2)$.\n- **At least one real solution**: for $k = 0$ the equation $4x + 2 = 0$ has the solution $x = -\\frac{1}{2}$, so $k = 0$ counts, and the answer is $(-\\infty, 2]$.",
        "当 $k$ 是 $x^{2}$ 的系数时，$k = 0$ 要单独检验：这时方程是一次方程，不是二次方程。对 $kx^{2} + 4x + 2 = 0$：\n\n- **有两个不相等的实数解**需要是二次方程，所以 $k \\ne 0$，并且 $16 - 8k > 0$，即 $k < 2$：答案是 $(-\\infty, 0) \\cup (0, 2)$。\n- **至少有一个实数解**：$k = 0$ 时方程 $4x + 2 = 0$ 有解 $x = -\\frac{1}{2}$，所以 $k = 0$ 也算，答案是 $(-\\infty, 2]$。",
      ),
      generate(rng) {
        const b = rng.nonZero(-8, 8);
        const c = rng.nonZero(-6, 6);
        const v = Q.of(b * b, 4 * c);
        const distinct = rng.bool(0.5);
        const eq = `${poly([1, "kx^{2}"], [b, "x"], [c, ""])} = 0`;
        const op: Op = c > 0 ? (distinct ? "<" : "<=") : distinct ? ">" : ">=";
        const quadratic = ray(op, v);
        const set = distinct ? intersect(quadratic, complement(union(point(0)))) : quadratic;
        const other = distinct ? quadratic : intersect(quadratic, complement(union(point(0))));
        const D = poly([b * b, ""], [-4 * c, "k"]);
        const zero = Q.of(-c, b);
        return intervalProblem({
          prompt: t(
            `For which values of $k$ does the equation $${eq}$ have ${distinct ? "two distinct real solutions" : "at least one real solution"}? Write the answer in interval notation.`,
            `$k$ 取哪些值时，方程 $${eq}$ ${distinct ? "有两个不相等的实数解" : "至少有一个实数解"}？用区间表示。`,
          ),
          set,
          form: "interval",
          variable: "k",
          wrong: [other, ray(reversed[op], v), ray(op, Q.of(b * b, c))],
          solution: t(
            `For $k \\ne 0$ the equation is quadratic, with discriminant${steps(`${D} ${opL[distinct ? ">" : ">="]} 0 \\implies k ${opL[op]} ${v.toLatex()}`)}${distinct ? "For $k = 0$ the equation is linear and has at most one solution, so $k = 0$ is excluded." : `For $k = 0$ the equation is $${linear(b, c)} = 0$, which has the solution $x = ${zero.toLatex()}$, so $k = 0$ is included.`} The solution is $${setL(set)}$.`,
            `$k \\ne 0$ 时方程是二次方程，判别式满足${steps(`${D} ${opL[distinct ? ">" : ">="]} 0 \\implies k ${opL[op]} ${v.toLatex()}`)}${distinct ? "$k = 0$ 时方程是一次方程，最多有一个解，所以去掉 $k = 0$。" : `$k = 0$ 时方程是 $${linear(b, c)} = 0$，有解 $x = ${zero.toLatex()}$，所以 $k = 0$ 包含在内。`}解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
    {
      id: "no-solutions-when-the-leading-coefficient-vanishes",
      title: t("When $k = 0$ leaves no solutions", "$k = 0$ 时无解的情形"),
      explanation: t(
        "In $kx^{2} - 4kx + 3 = 0$ every term but the constant contains $k$. For $k \\ne 0$ there are no real solutions when\n\n$$(-4k)^{2} - 4 \\cdot k \\cdot 3 < 0 \\implies 16k^{2} - 12k < 0 \\implies 4k(4k - 3) < 0 \\implies 0 < k < \\frac{3}{4}$$\n\nFor $k = 0$ the equation becomes $3 = 0$, which has no solutions either. So the equation has no real solutions for $k$ in $\\left[0, \\frac{3}{4}\\right)$.",
        "在 $kx^{2} - 4kx + 3 = 0$ 中，除常数项外每一项都含有 $k$。$k \\ne 0$ 时，没有实数解的条件是\n\n$$(-4k)^{2} - 4 \\cdot k \\cdot 3 < 0 \\implies 16k^{2} - 12k < 0 \\implies 4k(4k - 3) < 0 \\implies 0 < k < \\frac{3}{4}$$\n\n$k = 0$ 时方程变为 $3 = 0$，同样无解。所以 $k$ 属于 $\\left[0, \\frac{3}{4}\\right)$ 时方程没有实数解。",
      ),
      generate(rng) {
        const b = rng.nonZero(-6, 6);
        const c = rng.nonZero(-9, 9);
        const w = Q.of(4 * c, b * b);
        const eq = `${poly([1, "kx^{2}"], [b, "kx"], [c, ""])} = 0`;
        const set = c > 0 ? union(mk(Q.zero, w, true, false)) : union(mk(w, Q.zero, false, true));
        const open = c > 0 ? union(mk(Q.zero, w)) : union(mk(w, Q.zero));
        const closed = c > 0 ? union(mk(Q.zero, w, true, true)) : union(mk(w, Q.zero, true, true));
        const D = poly([b * b, "k^{2}"], [-4 * c, "k"]);
        return intervalProblem({
          prompt: parameterPrompt(eq, "none"),
          set,
          form: "interval",
          variable: "k",
          wrong: [open, closed, complement(set)],
          solution: t(
            `For $k \\ne 0$ the discriminant must be negative:${steps(`(${poly([b, "k"])})^{2} - 4 \\cdot k \\cdot ${paren(c)} < 0`, `${D} < 0`, `k(${linear(b * b, -4 * c, "k")}) < 0`)}so $k$ lies between $0$ and $${w.toLatex()}$. For $k = 0$ the equation is $${c} = 0$, which has no solutions, so $k = 0$ is included. The solution is $${setL(set)}$.`,
            `$k \\ne 0$ 时判别式必须为负：${steps(`(${poly([b, "k"])})^{2} - 4 \\cdot k \\cdot ${paren(c)} < 0`, `${D} < 0`, `k(${linear(b * b, -4 * c, "k")}) < 0`)}所以 $k$ 在 $0$ 与 $${w.toLatex()}$ 之间。$k = 0$ 时方程是 $${c} = 0$，无解，所以 $k = 0$ 包含在内。解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
  ],
};

/** distinctTriple draws three distinct integers in [lo, hi], sorted. */
function distinctTriple(rng: Rng, lo: number, hi: number): [number, number, number] {
  for (;;) {
    const a = rng.int(lo, hi);
    const b = rng.int(lo, hi);
    const c = rng.int(lo, hi);
    if (a !== b && b !== c && a !== c) {
      const arr = [a, b, c].sort((x, y) => x - y);
      return [arr[0]!, arr[1]!, arr[2]!];
    }
  }
}

/** polyFigure draws a polynomial curve y = P(x) with its roots highlighted. */
function polyFigure(roots: readonly number[], a: number, name: string): Figure {
  const f = (x: number) => a * roots.reduce((acc, r) => acc * (x - r), 1);
  const marks: PlaneMark[] = [
    { kind: "curve", f, accent: true },
    ...roots.map((r) => ({ kind: "point" as const, at: [r, 0] as [number, number] })),
  ];
  return {
    svg: plane(polyView, marks),
    alt: t(
      `A polynomial curve y = ${name} with x-intercepts at ${roots.join(", ")}.`,
      `一条多项式曲线 y = ${name}，与 x 轴交于 ${roots.join("、")}。`,
    ),
  };
}

// ─── 3.7.1 Inequalities involving powers of binomials ───────────────────────

/** inequalitiesInvolvingPowersOfBinomials solves inequalities where binomials are raised to powers. */
export const inequalitiesInvolvingPowersOfBinomials: TopicDef = {
  id: "inequalities-involving-powers-of-binomials",
  title: t("Inequalities Involving Powers of Binomials", "含二项式幂的不等式"),
  summary: t(
    "Solve inequalities where linear factors are raised to integer powers, distinguishing between even powers that never become negative and odd powers that preserve sign.",
    "解一次因式带有整式幂的不等式，区分恒非负的偶次幂与保持符号的奇次幂。",
  ),
  prerequisites: ["solving-elementary-quadratic-inequalities", "solving-even-power-equations"],
  encompasses: [{ topic: "solving-elementary-quadratic-inequalities", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.4"],
  knowledgePoints: [
    {
      id: "even-powers-of-binomials",
      title: t("Even powers of binomials", "二项式的偶次幂"),
      explanation: t(
        "An even power is always non-negative: $(ax + b)^{2m} ge 0$ for every real number $x$, and equals $0$ only when $ax + b = 0$. For $(x - 3)^{4}$:\n\n- $(x - 3)^{4} > 0$: true everywhere except $x = 3$, giving $(-infty, 3) cup (3, infty)$.\n- $(x - 3)^{4} ge 0$: true for all real numbers, $(-infty, infty)$.\n- $(x - 3)^{4} le 0$: only the root $x = 3$ works, giving $\\{3\\}$.\n- $(x - 3)^{4} < 0$: no real numbers satisfy this, giving $\\emptyset$.\n\nWhen compared with $c > 0$, taking roots gives $|ax + b| \text{ op } \\sqrt[2m]{c}$.",
        "偶次幂总是非负的：对任意实数 $x$，$(ax + b)^{2m} ge 0$ 恒成立，且仅当 $ax + b = 0$ 时等于 $0$。以 $(x - 3)^{4}$ 为例：\n\n- $(x - 3)^{4} > 0$：除 $x = 3$ 外处处成立，解集为 $(-infty, 3) cup (3, infty)$。\n- $(x - 3)^{4} ge 0$：对所有实数都成立，解集为 $(-infty, infty)$。\n- $(x - 3)^{4} le 0$：仅有零点 $x = 3$ 满足，解集为 $\\{3\\}$。\n- $(x - 3)^{4} < 0$：没有实数满足，解集为 $\\emptyset$。\n\n当与正数 $c > 0$ 比较时，开偶次方得到 $|ax + b| \text{ op } \\sqrt[2m]{c}$。",
      ),
      generate(rng) {
        const m = rng.pick([2, 4]);
        const h = rng.int(-6, 6);
        const kind = rng.pick(["zero", "zero", "positive"] as const);
        const op = rng.pick(ops);
        if (kind === "zero") {
          const ineq = `(x ${tail(-h)})^{${m}} ${opL[op]} 0`;
          let set: RealSet;
          if (op === ">") set = complement(union(point(h)));
          else if (op === ">=") set = union(mk());
          else if (op === "<=") set = union(point(h));
          else set = union();
          return intervalProblem({
            prompt: solvePrompt(ineq),
            set,
            form: "interval",
            wrong: [complement(set), union(mk(Q.of(h), undefined, false)), op === "<=" ? union() : union(point(h))],
            solution: t(
              `Since the exponent $${m}$ is even, $(x ${tail(-h)})^{${m}} ge 0$ for all real $x$, with equality only at $x = ${h}$. Therefore, the solution to $${ineq}$ is $${setL(set)}$.`,
              `由于指数 $${m}$ 为偶数，对任意实数 $x$ 都有 $(x ${tail(-h)})^{${m}} ge 0$，且仅在 $x = ${h}$ 时取等号。因此 $${ineq}$ 的解集是 $${setL(set)}$。`,
            ),
          });
        }
        const root = rng.int(1, 3);
        const c = root ** m;
        const ineq = `(x ${tail(-h)})^{${m}} ${opL[op]} ${c}`;
        const set = absSet(h, root, op);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [complement(set), absSet(h, root, toggled[op]), absSet(-h, root, op)],
          solution: t(
            `Take the $${m}$-th root on both sides: $|x ${tail(-h)}| ${opL[op]} ${root}$. ${ends(op).en} The solution is $${setL(set)}$.`,
            `两边开 $${m}$ 次方：$|x ${tail(-h)}| ${opL[op]} ${root}$。${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
    {
      id: "odd-powers-of-binomials",
      title: t("Odd powers of binomials", "二项式的奇次幂"),
      explanation: t(
        "Odd power functions are strictly increasing everywhere and preserve sign: $(ax + b)^{2m+1} \text{ op } c$ is equivalent to $ax + b \text{ op } \\sqrt[2m+1]{c}$. For $(2x - 1)^{3} le 27$:\n\n$$(2x - 1)^{3} le 27 implies 2x - 1 le 3 implies 2x le 4 implies x le 2$$\n\nso the solution is $(-infty, 2]$.",
        "奇次幂函数在整个实数集上严格单调递增并保持符号：$(ax + b)^{2m+1} \text{ op } c$ 等价于 $ax + b \text{ op } \\sqrt[2m+1]{c}$。以 $(2x - 1)^{3} le 27$ 为例：\n\n$$(2x - 1)^{3} le 27 implies 2x - 1 le 3 implies 2x le 4 implies x le 2$$\n\n所以解集为 $(-infty, 2]$。",
      ),
      generate(rng) {
        const m = rng.pick([3, 5]);
        const r = rng.int(-3, 3);
        const c = r ** m;
        const a = rng.pick([1, 1, 2]);
        const b = rng.int(-6, 6);
        const expr = linear(a, b);
        const op = rng.pick(ops);
        const ineq = `(${expr})^{${m}} ${opL[op]} ${c}`;
        const xVal = Q.of(r - b, a);
        const set = ray(op, xVal);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [ray(reversed[op], xVal), ray(op, Q.of(-r - b, a)), ray(reversed[op], Q.of(-r - b, a))],
          solution: t(
            `Take the $${m}$-th root of both sides (since $${m}$ is odd, the inequality direction is unchanged):${steps(`${expr} ${opL[op]} ${r}`, `x ${opL[op]} ${xVal.toLatex()}`)}The solution is $${setL(set)}$.`,
            `两边开 $${m}$ 次方（因为 $${m}$ 是奇数，不等号方向不变）：${steps(`${expr} ${opL[op]} ${r}`, `x ${opL[op]} ${xVal.toLatex()}`)}解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
    {
      id: "products-of-binomial-powers",
      title: t("Products of binomial powers", "二项式幂的乘积"),
      explanation: t(
        "In a product like $(x + 1)^{2}(x - 4) > 0$, the even power $(x + 1)^{2}$ is positive for all $x \\ne -1$ and zero at $x = -1$. It does not change sign across $-1$. The sign of the product is determined by $(x - 4)$, but $-1$ must be kept out of a strict inequality:\n\n$$(x + 1)^{2}(x - 4) > 0 implies x > 4$$\n\nFor $(x + 1)^{2}(x - 4) le 0$, the answer is $(-infty, 4]$, which includes the isolated zero $x = -1$.",
        "在像 $(x + 1)^{2}(x - 4) > 0$ 这样的乘积中，偶次幂 $(x + 1)^{2}$ 在 $x \\ne -1$ 时恒为正，在 $x = -1$ 时为零。它跨越 $-1$ 时不变号。乘积的符号完全由 $(x - 4)$ 决定，但在严格不等式中必须排除 $-1$：\n\n$$(x + 1)^{2}(x - 4) > 0 implies x > 4$$\n\n对 $(x + 1)^{2}(x - 4) le 0$，解集为 $(-infty, 4]$，它已经包含了孤立的零点 $x = -1$。",
      ),
      generate(rng) {
        const [u, v] = distinctPair(rng, -5, 5);
        const m = rng.pick([2, 4]);
        const n = rng.pick([1, 3]);
        const fs = [lin(1, -u, m), lin(1, -v, n)];
        const op = rng.pick(ops);
        const set = chartSet(1, fs, op);
        const name = product(1, fs);
        return intervalProblem({
          prompt: solvePrompt(`${name} ${opL[op]} 0`),
          set,
          form: "interval",
          wrong: [chartSet(1, fs, reversed[op]), chartSet(1, [lin(1, -u), lin(1, -v)], op), complement(set)],
          solution: chartSolution(1, fs, name, op, set),
        });
      },
    },
  ],
};

// ─── 3.7.2 Solving polynomial inequalities using a graphical method ─────────

/** solvingPolynomialInequalitiesUsingAGraphicalMethod solves polynomial inequalities graphically. */
export const solvingPolynomialInequalitiesUsingAGraphicalMethod: TopicDef = {
  id: "solving-polynomial-inequalities-using-a-graphical-method",
  title: t("Solving Polynomial Inequalities Using a Graphical Method", "用图象法解多项式不等式"),
  summary: t(
    "Sketch or inspect the graph of a polynomial function from its roots, multiplicities, and end behavior to determine where it is positive or negative.",
    "根据多项式函数的零点、重数和端点行为草绘或观察图象，确定其在何处为正、在何处为负。",
  ),
  prerequisites: [
    "solving-quadratic-inequalities-using-the-graphical-method",
    "graphing-general-polynomials",
    "inequalities-involving-powers-of-binomials",
  ],
  encompasses: [{ topic: "solving-quadratic-inequalities-using-the-graphical-method", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSA.REI.B.4"],
  knowledgePoints: [
    {
      id: "reading-polynomial-inequalities-from-graphs",
      title: t("Reading polynomial inequalities from graphs", "看多项式图象解不等式"),
      explanation: t(
        "The graph of $y = P(x)$ is above the $x$-axis where $P(x) > 0$ and below the $x$-axis where $P(x) < 0$. The roots partition the axis into intervals. The graph crosses the axis at roots of odd multiplicity, and touches without crossing at roots of even multiplicity.\n\nFor a cubic crossing at $-2, 1, 4$ and rising to the right, it is above the axis on $(-2, 1) cup (4, infty)$ and below on $(-infty, -2) cup (1, 4)$.",
        "当 $y = P(x)$ 的图象位于 $x$ 轴上方时 $P(x) > 0$，位于下方时 $P(x) < 0$。零点将 $x$ 轴分成若干区间。图象在奇数重零点处穿过 $x$ 轴，在偶数重零点处相切而不穿过。\n\n例如一条与 $x$ 轴交于 $-2, 1, 4$ 且向右上方延伸的三次曲线，在 $(-2, 1) cup (4, infty)$ 上位于上方，在 $(-infty, -2) cup (1, 4)$ 上位于下方。",
      ),
      generate(rng) {
        const r1 = rng.int(-4, -2);
        const r2 = rng.int(-1, 1);
        const r3 = rng.int(2, 4);
        const up = rng.bool(0.7);
        const a = up ? 0.2 : -0.2;
        const roots = [r1, r2, r3];
        const fs = roots.map((r) => lin(1, -r));
        const op = rng.pick(ops);
        const set = chartSet(up ? 1 : -1, fs, op);
        const name = product(up ? 1 : -1, fs);
        return {
          ...intervalProblem({
            prompt: t(
              `The graph of $y = ${name}$ is shown. Solve $${name} ${opL[op]} 0$. Write the answer in interval notation.`,
              `图中给出了 $y = ${name}$ 的图象。解不等式 $${name} ${opL[op]} 0$，用区间表示解集。`,
            ),
            set,
            form: "interval",
            wrong: [chartSet(up ? -1 : 1, fs, op), chartSet(up ? 1 : -1, fs, toggled[op]), complement(set)],
            solution: t(
              `The graph crosses the $x$-axis at $x = ${r1}$, $x = ${r2}$, and $x = ${r3}$. Looking at where the curve lies ${above(op) ? "above" : "below"} the $x$-axis${strict(op) ? "" : " (including the intercepts)"}, the solution is $${setL(set)}$.`,
              `图象与 $x$ 轴交于 $x = ${r1}$、$x = ${r2}$ 和 $x = ${r3}$。观察曲线位于 $x$ 轴${above(op) ? "上方" : "下方"}的部分${strict(op) ? "" : "（包括交点）"}，解集是 $${setL(set)}$。`,
            ),
          }),
          figure: polyFigure(roots, a, name),
        };
      },
    },
    {
      id: "solving-polynomial-inequalities-by-sketching",
      title: t("Solving by sketching end behavior and roots", "利用端点行为与零点草图求解"),
      explanation: t(
        "To solve $-(x + 3)(x - 1)(x - 4) ge 0$ without graphing software:\n\n1. **Roots**: $-3, 1, 4$, all multiplicity $1$ (the curve crosses the axis at each).\n2. **Leading coefficient**: negative, and degree is $3$ (odd), so the curve goes up to $+infty$ on the far left and down to $-infty$ on the far right.\n3. **Signs**: positive on $(-infty, -3]$, negative on $[-3, 1]$, positive on $[1, 4]$, negative on $[4, infty)$.\n\nSo the solution is $(-infty, -3] cup [1, 4]$.",
        "不用作图软件求解 $-(x + 3)(x - 1)(x - 4) ge 0$ 的步骤：\n\n1. **零点**：$-3, 1, 4$，均为 $1$ 重（曲线在每个零点处穿过 $x$ 轴）。\n2. **首项系数**：为负，且次数为 $3$（奇数），因此曲线在最左侧趋向 $+infty$，在最右侧趋向 $-infty$。\n3. **正负区间**：在 $(-infty, -3]$ 上为正，在 $[-3, 1]$ 上为负，在 $[1, 4]$ 上为正，在 $[4, infty)$ 上为负。\n\n所以解集是 $(-infty, -3] cup [1, 4]$。",
      ),
      generate(rng) {
        const [r1, r2, r3] = distinctTriple(rng, -5, 5);
        const k = rng.pick([-1, 1]);
        const fs = [lin(1, -r1), lin(1, -r2), lin(1, -r3)];
        const op = rng.pick(ops);
        const set = chartSet(k, fs, op);
        const name = product(k, fs);
        return intervalProblem({
          prompt: solvePrompt(`${name} ${opL[op]} 0`),
          set,
          form: "interval",
          wrong: [chartSet(-k, fs, op), chartSet(k, fs, toggled[op]), complement(set)],
          solution: chartSolution(k, fs, name, op, set),
        });
      },
    },
  ],
};

// ─── 3.7.3 Factoring techniques and graphical method ────────────────────────

/** solvingPolynomialInequalitiesUsingSpecialFactoringTechniquesAndTheGraphicalMethod factors polynomials first. */
export const solvingPolynomialInequalitiesUsingSpecialFactoringTechniquesAndTheGraphicalMethod: TopicDef = {
  id: "solving-polynomial-inequalities-using-special-factoring-techniques-and-the-graphical-method",
  title: t(
    "Solving Polynomial Inequalities Using Special Factoring Techniques and the Graphical Method",
    "用特殊因式分解法与图象法解多项式不等式",
  ),
  summary: t(
    "Factor cubic and quartic polynomials by extracting a common monomial, grouping terms, or using quadratic forms, then solve the inequality.",
    "通过提取公单项式、分组分解或利用二次型分解三次与四次多项式，再求解不等式。",
  ),
  prerequisites: [
    "solving-polynomial-inequalities-using-a-graphical-method",
    "factoring-higher-order-polynomials-as-a-difference-of-squares",
  ],
  encompasses: [{ topic: "solving-polynomial-inequalities-using-a-graphical-method", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSA.REI.B.4"],
  knowledgePoints: [
    {
      id: "factoring-out-a-monomial-in-polynomial-inequalities",
      title: t("Factoring out a monomial factor", "提取公单项式"),
      explanation: t(
        "When every term contains $x$, factor out $x$ (or $x^{2}$) first. For $x^{3} - 4x > 0$:\n\n$$x(x^{2} - 4) > 0 implies x(x - 2)(x + 2) > 0$$\n\nThe roots are $-2, 0, 2$. The leading coefficient is positive, so the solution is $(-2, 0) cup (2, infty)$.",
        "当每一项都含有 $x$ 时，先提取 $x$（或 $x^{2}$）。以 $x^{3} - 4x > 0$ 为例：\n\n$$x(x^{2} - 4) > 0 implies x(x - 2)(x + 2) > 0$$\n\n零点是 $-2, 0, 2$。首项系数为正，所以解集是 $(-2, 0) cup (2, infty)$。",
      ),
      generate(rng) {
        const r = rng.int(1, 9);
        const polyTex = poly([1, "x^{3}"], [-r * r, "x"]);
        const fs = [lin(1, r), lin(1, 0), lin(1, -r)];
        const op = rng.pick(ops);
        const set = chartSet(1, fs, op);
        return intervalProblem({
          prompt: solvePrompt(`${polyTex} ${opL[op]} 0`),
          set,
          form: "interval",
          wrong: [chartSet(-1, fs, op), chartSet(1, fs, toggled[op]), complement(set)],
          solution: t(
            `Factor out $x$, then factor the difference of squares:${steps(`${polyTex} = x(x^{2} - ${r * r}) = x(x - ${r})(x + ${r})`)}The roots are $-${r}$, $0$, and $${r}$. The solution is $${setL(set)}$.`,
            `先提出公因式 $x$，再利用平方差公式因式分解：${steps(`${polyTex} = x(x^{2} - ${r * r}) = x(x - ${r})(x + ${r})`)}零点为 $-${r}$、$0$ 和 $${r}$。解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
    {
      id: "factoring-by-grouping-in-polynomial-inequalities",
      title: t("Factoring by grouping", "分组分解法"),
      explanation: t(
        "For a four-term cubic such as $x^{3} + 2x^{2} - 9x - 18 le 0$, group into pairs:\n\n$$x^{2}(x + 2) - 9(x + 2) = (x^{2} - 9)(x + 2) = (x - 3)(x + 3)(x + 2) le 0$$\n\nThe roots are $-3, -2, 3$. The leading coefficient is $1$, so the solution is $(-infty, -3] cup [-2, 3]$.",
        "对于像 $x^{3} + 2x^{2} - 9x - 18 le 0$ 这样的四项三次式，两两分组：\n\n$$x^{2}(x + 2) - 9(x + 2) = (x^{2} - 9)(x + 2) = (x - 3)(x + 3)(x + 2) le 0$$\n\n零点是 $-3, -2, 3$。首项系数为 $1$，所以解集是 $(-infty, -3] cup [-2, 3]$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        let b = rng.int(1, 4);
        while (Math.abs(a) === b) {
          b += 1;
        }
        const polyTex = poly([1, "x^{3}"], [a, "x^{2}"], [-b * b, "x"], [-a * b * b, ""]);
        const fs = [lin(1, -a), lin(1, b), lin(1, -b)];
        const op = rng.pick(ops);
        const set = chartSet(1, fs, op);
        return intervalProblem({
          prompt: solvePrompt(`${polyTex} ${opL[op]} 0`),
          set,
          form: "interval",
          wrong: [chartSet(-1, fs, op), chartSet(1, fs, toggled[op]), complement(set)],
          solution: t(
            `Group terms to factor:${steps(
              `${polyTex} = x^{2}(x ${tail(a)}) - ${b * b}(x ${tail(a)})`,
              `= (x^{2} - ${b * b})(x ${tail(a)}) = (x - ${b})(x + ${b})(x ${tail(a)})`,
            )}The roots are $${b}$, $-${b}$, and $${-a}$. The solution is $${setL(set)}$.`,
            `分组提取公因式：${steps(
              `${polyTex} = x^{2}(x ${tail(a)}) - ${b * b}(x ${tail(a)})`,
              `= (x^{2} - ${b * b})(x ${tail(a)}) = (x - ${b})(x + ${b})(x ${tail(a)})`,
            )}零点为 $${b}$、$-${b}$ 和 $${-a}$。解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
    {
      id: "polynomial-inequalities-quadratic-in-form",
      title: t("Inequalities quadratic in form", "二次型多项式不等式"),
      explanation: t(
        "A quartic polynomial with only even powers, $x^{4} - 10x^{2} + 9 < 0$, is quadratic in $u = x^{2}$:\n\n$$(x^{2} - 1)(x^{2} - 9) < 0 implies (x - 1)(x + 1)(x - 3)(x + 3) < 0$$\n\nThe four roots are $-3, -1, 1, 3$. Testing intervals gives $(-3, -1) cup (1, 3)$.",
        "仅含偶次幂的四次多项式 $x^{4} - 10x^{2} + 9 < 0$ 可以看作关于 $u = x^{2}$ 的二次型：\n\n$$(x^{2} - 1)(x^{2} - 9) < 0 implies (x - 1)(x + 1)(x - 3)(x + 3) < 0$$\n\n四个零点为 $-3, -1, 1, 3$。检验各区间可得解集为 $(-3, -1) cup (1, 3)$。",
      ),
      generate(rng) {
        const [a, b] = distinctPair(rng, 1, 5).sort((p, q) => p - q);
        const [a2, b2] = [a * a, b * b];
        const polyTex = poly([1, "x^{4}"], [-(a2 + b2), "x^{2}"], [a2 * b2, ""]);
        const fs = [lin(1, -a), lin(1, a), lin(1, -b), lin(1, b)];
        const op = rng.pick(ops);
        const set = chartSet(1, fs, op);
        return intervalProblem({
          prompt: solvePrompt(`${polyTex} ${opL[op]} 0`),
          set,
          form: "interval",
          wrong: [chartSet(-1, fs, op), chartSet(1, fs, toggled[op]), complement(set)],
          solution: t(
            `Treat as quadratic in $x^{2}$ and factor completely:${steps(
              `${polyTex} = (x^{2} - ${a2})(x^{2} - ${b2})`,
              `= (x - ${a})(x + ${a})(x - ${b})(x + ${b})`,
            )}The roots are $-${b}, -${a}, ${a}, ${b}$. The solution is $${setL(set)}$.`,
            `视为关于 $x^{2}$ 的二次式并彻底分解：${steps(
              `${polyTex} = (x^{2} - ${a2})(x^{2} - ${b2})`,
              `= (x - ${a})(x + ${a})(x - ${b})(x + ${b})`,
            )}零点为 $-${b}, -${a}, ${a}, ${b}$。解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 3.7.4 Sign table method for polynomials ────────────────────────────────

/** solvingPolynomialInequalitiesUsingTheSignTableMethod solves higher-order inequalities with sign tables. */
export const solvingPolynomialInequalitiesUsingTheSignTableMethod: TopicDef = {
  id: "solving-polynomial-inequalities-using-the-sign-table-method",
  title: t("Solving Polynomial Inequalities Using the Sign Table Method", "用符号表法解多项式不等式"),
  summary: t(
    "Set up a complete sign table for products of three or more factors, tracking sign changes across roots to solve polynomial inequalities.",
    "为三个或更多因式的乘积列出完整符号表，追踪穿过各零点时的符号变化，从而求解多项式不等式。",
  ),
  prerequisites: ["solving-quadratic-inequalities-using-the-sign-table-method", "solving-polynomial-inequalities-using-a-graphical-method"],
  encompasses: [{ topic: "solving-quadratic-inequalities-using-the-sign-table-method", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSA.REI.B.4"],
  knowledgePoints: [
    {
      id: "sign-tables-with-three-factors",
      title: t("Sign tables with three factors", "三个因式的符号表"),
      explanation: t(
        "For $(x + 2)(x - 1)(x - 3) > 0$, the roots $-2, 1, 3$ divide the real line into four intervals. Set up a sign table with a row for each factor and determine the sign of the product in each column:\n\n- $(-infty, -2)$: $(-)(-)(-) = -$\n- $(-2, 1)$: $(+)(-)(-) = +$\n- $(1, 3)$: $(+)(+)(-) = -$\n- $(3, infty)$: $(+)(+)(+) = +$\n\nSo the solution is $(-2, 1) cup (3, infty)$.",
        "对于 $(x + 2)(x - 1)(x - 3) > 0$，零点 $-2, 1, 3$ 将数轴划分为四个区间。为每个因式列一行，在每列中计算乘积的符号：\n\n- $(-infty, -2)$：$(-)(-)(-) = -$\n- $(-2, 1)$：$(+)(-)(-) = +$\n- $(1, 3)$：$(+)(+)(-) = -$\n- $(3, infty)$：$(+)(+)(+) = +$\n\n所以解集是 $(-2, 1) cup (3, infty)$。",
      ),
      generate(rng) {
        const ds = drawFactors(rng, 3, false);
        const fs = ds.map((d) => d.f);
        const op = rng.pick(ops);
        const set = chartSet(1, fs, op);
        const name = product(1, fs);
        return intervalProblem({
          prompt: solvePrompt(`${name} ${opL[op]} 0`),
          set,
          form: "interval",
          wrong: [chartSet(-1, fs, op), chartSet(1, fs, toggled[op]), complement(set)],
          solution: chartSolution(1, fs, name, op, set),
        });
      },
    },
    {
      id: "sign-tables-with-repeated-factors",
      title: t("Sign tables with repeated factors", "含重因式的符号表"),
      explanation: t(
        "A repeated factor $(x - a)^{m}$ behaves differently depending on whether $m$ is even or odd:\n\n- **Even powers** like $(x - 1)^{2}$ are positive everywhere except at $x = 1$, where they are zero. In the sign table, they have $+$ in every interval.\n- **Odd powers** like $(x + 2)^{3}$ change sign across their root, behaving like a single linear factor.\n\nAlways include or exclude the roots according to whether the inequality is non-strict or strict.",
        "重因式 $(x - a)^{m}$ 的表现取决于重数 $m$ 是偶数还是奇数：\n\n- **偶次幂** 如 $(x - 1)^{2}$ 在除 $x = 1$ 外的所有区间上都为正。在符号表中，它在所有区间上都是 $+$。\n- **奇次幂** 如 $(x + 2)^{3}$ 跨过零点时会变号，行为与单个一次因式相同。\n\n始终根据不等式是非严格还是严格，来决定解集中是否包含这些零点。",
      ),
      generate(rng) {
        const [u, v] = distinctPair(rng, -4, 4);
        const m = 2;
        const n = 1;
        const fs = [lin(1, -u, m), lin(1, -v, n)];
        const op = rng.pick(ops);
        const set = chartSet(1, fs, op);
        const name = product(1, fs);
        return intervalProblem({
          prompt: solvePrompt(`${name} ${opL[op]} 0`),
          set,
          form: "interval",
          wrong: [chartSet(-1, fs, op), chartSet(1, fs, toggled[op]), complement(set)],
          solution: chartSolution(1, fs, name, op, set),
        });
      },
    },
  ],
};

// ─── 3.8.1 Solving radical inequalities ─────────────────────────────────────

/** solvingRadicalInequalities solves inequalities involving square root expressions. */
export const solvingRadicalInequalities: TopicDef = {
  id: "solving-radical-inequalities",
  title: t("Solving Radical Inequalities", "解根式不等式"),
  summary: t(
    "Solve inequalities involving square roots, remembering that radicands must be non-negative and taking care when squaring both sides.",
    "解含平方根的不等式，牢记被开方数必须非负，并在两边平方时注意前提条件。",
  ),
  prerequisites: ["solving-radical-equations", "solving-elementary-quadratic-inequalities"],
  encompasses: [{ topic: "solving-elementary-quadratic-inequalities", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSA.REI.A.2"],
  knowledgePoints: [
    {
      id: "radical-inequalities-with-a-constant",
      title: t("Square root compared with a constant", "平方根与常数比较"),
      explanation: t(
        "For $\\sqrt{ax + b} \text{ op } c$, the radicand must be non-negative: $ax + b ge 0$. Then:\n\n- $\\sqrt{ax + b} < c$: if $c le 0$, no solution. If $c > 0$, $0 le ax + b < c^{2}$.\n- $\\sqrt{ax + b} > c$: if $c < 0$, any $x$ with $ax + b ge 0$ works. If $c ge 0$, $ax + b > c^{2}$.\n\nFor $\\sqrt{2x - 3} le 5$:\n\n$$0 le 2x - 3 le 25 implies 3 le 2x le 28 implies \\frac{3}{2} le x le 14$$\n\nso the solution is $\\left[\\frac{3}{2}, 14\\right]$.",
        "对于 $\\sqrt{ax + b} \text{ op } c$，被开方数必须非负：$ax + b ge 0$。随后：\n\n- $\\sqrt{ax + b} < c$：若 $c le 0$，无解；若 $c > 0$，则 $0 le ax + b < c^{2}$。\n- $\\sqrt{ax + b} > c$：若 $c < 0$，只需 $ax + b ge 0$；若 $c ge 0$，则 $ax + b > c^{2}$。\n\n以 $\\sqrt{2x - 3} le 5$ 为例：\n\n$$0 le 2x - 3 le 25 implies 3 le 2x le 28 implies \\frac{3}{2} le x le 14$$\n\n所以解集是 $\\left[\\frac{3}{2}, 14\\right]$。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3]);
        const b = rng.int(-6, 6);
        const c = rng.int(1, 5);
        const op = rng.pick(ops);
        const radStr = linear(a, b);
        const ineq = `sqrt{${radStr}} ${opL[op]} ${c}`;
        const domainLo = Q.of(-b, a);
        const c2 = c * c;
        const rootBound = Q.of(c2 - b, a);
        let set: RealSet;
        if (op === "<") set = union(mk(domainLo, rootBound, true, false));
        else if (op === "<=") set = union(mk(domainLo, rootBound, true, true));
        else if (op === ">") set = union(mk(rootBound, undefined, false));
        else set = union(mk(rootBound, undefined, true));
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [ray(op, rootBound), union(mk(undefined, rootBound, false, !strict(op))), complement(set)],
          solution: t(
            `First, the domain requires $${radStr} ge 0 implies x ge ${domainLo.toLatex()}$. Since $${c} > 0$, square both sides:${steps(
              `${radStr} ${opL[op]} ${c2}`,
              `x ${opL[op]} ${rootBound.toLatex()}`,
            )}Intersecting with $x ge ${domainLo.toLatex()}$, the solution is $${setL(set)}$.`,
            `首先，定义域要求 $${radStr} ge 0 implies x ge ${domainLo.toLatex()}$。因为 $${c} > 0$，两边平方：${steps(
              `${radStr} ${opL[op]} ${c2}`,
              `x ${opL[op]} ${rootBound.toLatex()}`,
            )}与定义域 $x ge ${domainLo.toLatex()}$ 取交集，解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
    {
      id: "radical-inequalities-linear-bound",
      title: t("Radical inequalities with a variable side", "含变量边界的根式不等式"),
      explanation: t(
        "To solve $\\sqrt{x + 5} < x - 1$, both sides must be valid: the radicand $x + 5 ge 0 implies x ge -5$, and since the square root is non-negative, the right side must be positive: $x - 1 > 0 implies x > 1$. Then square both sides:\n\n$$x + 5 < (x - 1)^{2} = x^{2} - 2x + 1 implies x^{2} - 3x - 4 > 0 implies (x - 4)(x + 1) > 0$$\n\nSince $x > 1$, the only valid interval is $(4, infty)$.",
        "求解 $\\sqrt{x + 5} < x - 1$ 时两边都要满足条件：被开方数 $x + 5 ge 0 implies x ge -5$；且因为平方根非负，右侧必须为正：$x - 1 > 0 implies x > 1$。随后两边平方：\n\n$$x + 5 < (x - 1)^{2} = x^{2} - 2x + 1 implies x^{2} - 3x - 4 > 0 implies (x - 4)(x + 1) > 0$$\n\n结合 $x > 1$，唯一有效的区间是 $(4, infty)$。",
      ),
      generate(rng) {
        const r = rng.int(2, 7);
        const k = rng.int(1, 5);
        const b = r * r - k;
        const ineq = `sqrt{x ${tail(b)}} < ${r}`;
        const domainLo = Q.of(-b);
        const set = union(mk(domainLo, Q.of(k), true, false));
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [union(mk(undefined, Q.of(k), false, false)), complement(set), ray("<", Q.of(k))],
          solution: t(
            `The radicand must be non-negative: $x ${tail(b)} ge 0 implies x ge ${domainLo.toLatex()}$. Squaring gives $x ${tail(b)} < ${r * r} implies x < ${k}$. The solution is $${setL(set)}$.`,
            `被开方数必须非负：$x ${tail(b)} ge 0 implies x ge ${domainLo.toLatex()}$。两边平方得 $x ${tail(b)} < ${r * r} implies x < ${k}$。解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 3.8.2 Solving inequalities involving exponential functions ─────────────

/** solvingInequalitiesInvolvingExponentialFunctions solves exponential inequalities. */
export const solvingInequalitiesInvolvingExponentialFunctions: TopicDef = {
  id: "solving-inequalities-involving-exponential-functions",
  title: t("Solving Inequalities Involving Exponential Functions", "解含指数函数的不等式"),
  summary: t(
    "Solve inequalities with exponential expressions by matching bases, reversing the inequality when the base is between 0 and 1, or using quadratic substitution.",
    "通过化同底数比较指数解不等式，底数在 0 到 1 之间时反转不等号，或利用二次换元法求解。",
  ),
  prerequisites: ["solving-exponential-equations", "solving-elementary-quadratic-inequalities"],
  encompasses: [{ topic: "solving-exponential-equations", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.1"],
  knowledgePoints: [
    {
      id: "exponential-inequalities-with-base-greater-than-one",
      title: t("Base greater than one", "底数大于 1 的指数不等式"),
      explanation: t(
        "For $b > 1$, the function $f(x) = b^{x}$ is strictly increasing. Therefore, $b^{u} < b^{v}$ if and only if $u < v$. For example:\n\n$$2^{3x - 1} le 16 implies 2^{3x - 1} le 2^{4} implies 3x - 1 le 4 implies x le \\frac{5}{3}$$\n\nso the solution is $\\left(-\\infty, \\frac{5}{3}\\right]$.",
        "当 $b > 1$ 时，函数 $f(x) = b^{x}$ 在整个实数集上严格单调递增。因此 $b^{u} < b^{v}$ 当且仅当 $u < v$。例如：\n\n$$2^{3x - 1} le 16 implies 2^{3x - 1} le 2^{4} implies 3x - 1 le 4 implies x le \\frac{5}{3}$$\n\n所以解集是 $\\left(-\\infty, \\frac{5}{3}\\right]$。",
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 5]);
        const p = rng.pick([1, 2, 3]);
        const q = rng.int(-5, 5);
        const k = rng.int(1, 4);
        const bk = b ** k;
        const op = rng.pick(ops);
        const ineq = `${b}^{${linear(p, q)}} ${opL[op]} ${bk}`;
        const xVal = Q.of(k - q, p);
        const set = ray(op, xVal);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [ray(reversed[op], xVal), ray(op, Q.of(bk - q, p)), complement(set)],
          solution: t(
            `Rewrite ${bk} as $${b}^{${k}}$. Since $${b} > 1$, the exponential function is increasing, preserving the inequality:${steps(
              `${linear(p, q)} ${opL[op]} ${k}`,
              `x ${opL[op]} ${xVal.toLatex()}`,
            )}The solution is $${setL(set)}$.`,
            `将 ${bk} 写为 $${b}^{${k}}$。因为底数 $${b} > 1$，指数函数单调递增，不等号方向不变：${steps(
              `${linear(p, q)} ${opL[op]} ${k}`,
              `x ${opL[op]} ${xVal.toLatex()}`,
            )}解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
    {
      id: "exponential-inequalities-with-fractional-base",
      title: t("Base between zero and one", "底数在 0 到 1 之间的指数不等式"),
      explanation: t(
        "When $0 < b < 1$, the function $f(x) = b^{x}$ is strictly decreasing: larger exponents yield smaller values! Therefore, $b^{u} < b^{v} iff u > v$. For example:\n\n$$\\left(\\frac{1}{2}\\right)^{x + 2} > \\frac{1}{8} implies \\left(\\frac{1}{2}\\right)^{x + 2} > \\left(\\frac{1}{2}\\right)^{3} implies x + 2 < 3 implies x < 1$$\n\nso the solution is $(-infty, 1)$.",
        "当 $0 < b < 1$ 时，函数 $f(x) = b^{x}$ 严格单调递减：指数越大，函数值越小！因此 $b^{u} < b^{v} iff u > v$。例如：\n\n$$\\left(\\frac{1}{2}\\right)^{x + 2} > \\frac{1}{8} implies \\left(\\frac{1}{2}\\right)^{x + 2} > \\left(\\frac{1}{2}\\right)^{3} implies x + 2 < 3 implies x < 1$$\n\n所以解集是 $(-infty, 1)$。",
      ),
      generate(rng) {
        const den = rng.pick([2, 3]);
        const p = rng.pick([1, 2]);
        const q = rng.int(-4, 4);
        const k = rng.int(1, 3);
        const op = rng.pick(ops);
        const baseTex = `\frac{1}{${den}}`;
        const rhsTex = `\frac{1}{${den ** k}}`;
        const ineq = `left(${baseTex}\right)^{${linear(p, q)}} ${opL[op]} ${rhsTex}`;
        const xVal = Q.of(k - q, p);
        const set = ray(reversed[op], xVal);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [ray(op, xVal), ray(reversed[op], Q.of(-k - q, p)), complement(set)],
          solution: t(
            `Rewrite $${rhsTex}$ as $\\left(${baseTex}\\right)^{${k}}$. Because the base $${baseTex}$ is strictly between $0$ and $1$, the exponential function is decreasing, reversing the inequality:${steps(
              `${linear(p, q)} ${opL[reversed[op]]} ${k}`,
              `x ${opL[reversed[op]]} ${xVal.toLatex()}`,
            )}The solution is $${setL(set)}$.`,
            `将 $${rhsTex}$ 改写为 $\\left(${baseTex}\\right)^{${k}}$。因为底数 $${baseTex}$ 严格介于 $0$ 与 $1$ 之间，指数函数单调递减，不等号方向反转：${steps(
              `${linear(p, q)} ${opL[reversed[op]]} ${k}`,
              `x ${opL[reversed[op]]} ${xVal.toLatex()}`,
            )}解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
    {
      id: "exponential-inequalities-quadratic-in-form",
      title: t("Inequalities quadratic in an exponential", "二次型指数不等式"),
      explanation: t(
        "Substitute $u = 2^{x}$ in $4^{x} - 6 cdot 2^{x} + 8 < 0$:\n\n$$u^{2} - 6u + 8 < 0 implies (u - 2)(u - 4) < 0 implies 2 < u < 4$$\n\nSubstituting back $u = 2^{x}$ gives $2 < 2^{x} < 4 implies 1 < x < 2$, so the solution is $(1, 2)$.",
        "在 $4^{x} - 6 cdot 2^{x} + 8 < 0$ 中令 $u = 2^{x}$：\n\n$$u^{2} - 6u + 8 < 0 implies (u - 2)(u - 4) < 0 implies 2 < u < 4$$\n\n代回 $u = 2^{x}$ 得 $2 < 2^{x} < 4 implies 1 < x < 2$，所以解集是 $(1, 2)$。",
      ),
      generate(rng) {
        const [e1, e2] = distinctPair(rng, 0, 4).sort((p, q) => p - q);
        const [u1, u2] = [2 ** e1, 2 ** e2];
        const sum = u1 + u2;
        const prod = u1 * u2;
        const op = rng.pick(ops);
        const ineq = `4^{x} - ${sum} cdot 2^{x} + ${prod} ${opL[op]} 0`;
        const fs = [lin(1, -e1), lin(1, -e2)];
        const set = chartSet(1, fs, op);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [chartSet(-1, fs, op), chartSet(1, [lin(1, -u1), lin(1, -u2)], op), complement(set)],
          solution: t(
            `Let $u = 2^{x}$. The inequality becomes:${steps(
              `u^{2} - ${sum}u + ${prod} ${opL[op]} 0`,
              `(u - ${u1})(u - ${u2}) ${opL[op]} 0`,
            )}For $u$, the roots are $${u1} = 2^{${e1}}$ and $${u2} = 2^{${e2}}$. Converting back to $x$, the solution is $${setL(set)}$.`,
            `令 $u = 2^{x}$，不等式变为：${steps(
              `u^{2} - ${sum}u + ${prod} ${opL[op]} 0`,
              `(u - ${u1})(u - ${u2}) ${opL[op]} 0`,
            )}关于 $u$ 的两根是 $${u1} = 2^{${e1}}$ 和 $${u2} = 2^{${e2}}$。换回 $x$，解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 3.8.3 Solving inequalities involving logarithmic functions ─────────────

/** solvingInequalitiesInvolvingLogarithmicFunctions solves logarithmic inequalities. */
export const solvingInequalitiesInvolvingLogarithmicFunctions: TopicDef = {
  id: "solving-inequalities-involving-logarithmic-functions",
  title: t("Solving Inequalities Involving Logarithmic Functions", "解含对数函数的不等式"),
  summary: t(
    "Solve inequalities containing logarithmic expressions, keeping in mind the domain requirement that arguments must be strictly positive.",
    "解含对数表达式的不等式，牢记真数必须严格为正的定义域要求。",
  ),
  prerequisites: ["solving-logarithmic-equations", "solving-inequalities-involving-exponential-functions"],
  encompasses: [{ topic: "solving-logarithmic-equations", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSA.CED.A.1"],
  knowledgePoints: [
    {
      id: "logarithmic-inequalities-with-base-greater-than-one",
      title: t("Base greater than one", "底数大于 1 的对数不等式"),
      explanation: t(
        "When $b > 1$, $\\log_{b}(u)$ is strictly increasing. Remember the **domain**: the argument must be strictly positive ($u > 0$):\n\n- $\\log_{b}(u) < c iff 0 < u < b^{c}$\n- $\\log_{b}(u) > c iff u > b^{c}$\n\nFor $\\log_{2}(3x - 1) le 3$:\n\n$$0 < 3x - 1 le 2^{3} = 8 implies 1 < 3x le 9 implies \\frac{1}{3} < x le 3$$\n\nso the solution is $\\left(\\frac{1}{3}, 3\\right]$.",
        "当 $b > 1$ 时，$\\log_{b}(u)$ 严格单调递增。牢记**定义域**：真数必须严格大于零（$u > 0$）：\n\n- $\\log_{b}(u) < c iff 0 < u < b^{c}$\n- $\\log_{b}(u) > c iff u > b^{c}$\n\n以 $\\log_{2}(3x - 1) le 3$ 为例：\n\n$$0 < 3x - 1 le 2^{3} = 8 implies 1 < 3x le 9 implies \\frac{1}{3} < x le 3$$\n\n所以解集是 $\\left(\\frac{1}{3}, 3\\right]$。",
      ),
      generate(rng) {
        const b = rng.pick([2, 3]);
        const p = rng.pick([1, 2]);
        const q = rng.int(-5, 5);
        const c = rng.int(1, 3);
        const bc = b ** c;
        const op = rng.pick(ops);
        const ineq = `log_{${b}}(${linear(p, q)}) ${opL[op]} ${c}`;
        const domainLo = Q.of(-q, p);
        const xVal = Q.of(bc - q, p);
        let set: RealSet;
        if (op === "<") set = union(mk(domainLo, xVal, false, false));
        else if (op === "<=") set = union(mk(domainLo, xVal, false, true));
        else if (op === ">") set = union(mk(xVal, undefined, false));
        else set = union(mk(xVal, undefined, true));
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [ray(op, xVal), union(mk(undefined, xVal, false, !strict(op))), complement(set)],
          solution: t(
            `The argument must be positive: $${linear(p, q)} > 0 implies x > ${domainLo.toLatex()}$. Since $${b} > 1$, exponentiate with base $${b}$:${steps(
              `${linear(p, q)} ${opL[op]} ${b}^{${c}} = ${bc}`,
              `x ${opL[op]} ${xVal.toLatex()}`,
            )}Combining with the domain condition, the solution is $${setL(set)}$.`,
            `真数必须为正：$${linear(p, q)} > 0 implies x > ${domainLo.toLatex()}$。因为底数 $${b} > 1$，以 $${b}$ 为底转化为指数不等式：${steps(
              `${linear(p, q)} ${opL[op]} ${b}^{${c}} = ${bc}`,
              `x ${opL[op]} ${xVal.toLatex()}`,
            )}与定义域结合，解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
    {
      id: "logarithmic-inequalities-with-fractional-base",
      title: t("Base between zero and one", "底数在 0 到 1 之间的对数不等式"),
      explanation: t(
        "When $0 < b < 1$, $\\log_{b}(u)$ is decreasing, reversing the inequality. For $\\log_{1/2}(x - 3) ge -2$:\n\n$$0 < x - 3 le \\left(\\frac{1}{2}\\right)^{-2} = 4 implies 3 < x le 7$$\n\nso the solution is $(3, 7]$. Notice that $x > 3$ is open because the logarithm is not defined at $0$.",
        "当 $0 < b < 1$ 时，$\\log_{b}(u)$ 严格单调递减，不等号方向反转。以 $\\log_{1/2}(x - 3) ge -2$ 为例：\n\n$$0 < x - 3 le \\left(\\frac{1}{2}\\right)^{-2} = 4 implies 3 < x le 7$$\n\n所以解集是 $(3, 7]$。注意 $x > 3$ 处是开区间，因为对数在 $0$ 处无定义。",
      ),
      generate(rng) {
        const h = rng.int(1, 5);
        const c = rng.int(-2, 2);
        const pow = c >= 0 ? Q.of(1, 2 ** c) : Q.of(2 ** -c);
        const op = rng.pick(ops);
        const ineq = `log_{1/2}(x ${tail(-h)}) ${opL[op]} ${c}`;
        const rev = reversed[op];
        const hi = Q.of(h).add(pow);
        let set: RealSet;
        if (rev === "<") set = union(mk(Q.of(h), hi, false, false));
        else if (rev === "<=") set = union(mk(Q.of(h), hi, false, true));
        else if (rev === ">") set = union(mk(hi, undefined, false));
        else set = union(mk(hi, undefined, true));
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [ray(op, hi), ray(rev, hi), complement(set)],
          solution: t(
            `The domain requires $x ${tail(-h)} > 0 implies x > ${h}$. Because the base $\\frac{1}{2}$ is less than $1$, the inequality direction reverses:${steps(
              `x ${tail(-h)} ${opL[rev]} left(\frac{1}{2}\right)^{${c}} = ${pow.toLatex()}`,
              `x ${opL[rev]} ${hi.toLatex()}`,
            )}The solution is $${setL(set)}$.`,
            `定义域要求 $x ${tail(-h)} > 0 implies x > ${h}$。因为底数 $\\frac{1}{2} < 1$，不等号方向反转：${steps(
              `x ${tail(-h)} ${opL[rev]} left(\frac{1}{2}\right)^{${c}} = ${pow.toLatex()}`,
              `x ${opL[rev]} ${hi.toLatex()}`,
            )}解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 3.8.4 Exponential functions and polynomials ────────────────────────────

/** solvingInequalitiesInvolvingExponentialFunctionsAndPolynomials mixes exponentials and polynomials. */
export const solvingInequalitiesInvolvingExponentialFunctionsAndPolynomials: TopicDef = {
  id: "solving-inequalities-involving-exponential-functions-and-polynomials",
  title: t("Solving Inequalities Involving Exponential Functions and Polynomials", "解含指数函数与多项式的不等式"),
  summary: t(
    "Solve inequalities where polynomials are multiplied by exponential expressions, using the fact that exponential factors like $e^{x}$ are always strictly positive.",
    "解多项式与指数表达式相乘的不等式，利用形如 $e^{x}$ 的指数因式恒为正的性质进行化简。",
  ),
  prerequisites: ["solving-inequalities-involving-exponential-functions", "solving-polynomial-inequalities-using-the-sign-table-method"],
  encompasses: [{ topic: "solving-inequalities-involving-exponential-functions", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSA.CED.A.1"],
  knowledgePoints: [
    {
      id: "factoring-out-positive-exponentials",
      title: t("Dividing by positive exponential factors", "除以恒正的指数因式"),
      explanation: t(
        "For any real number $x$, $e^{x} > 0$ and $2^{x} > 0$. An exponential factor is never zero and never negative! We can divide both sides by it without changing the direction of the inequality:\n\n$$(x^{2} - 9)e^{x} ge 0 iff x^{2} - 9 ge 0 iff (x - 3)(x + 3) ge 0$$\n\nso the solution is $(-infty, -3] cup [3, infty)$.",
        "对任意实数 $x$，都有 $e^{x} > 0$ 以及 $2^{x} > 0$。指数因式永不为零，也永不为负！我们可以直接在两边除以它而不改变不等号方向：\n\n$$(x^{2} - 9)e^{x} ge 0 iff x^{2} - 9 ge 0 iff (x - 3)(x + 3) ge 0$$\n\n所以解集是 $(-infty, -3] cup [3, infty)$。",
      ),
      generate(rng) {
        const [u, v] = distinctPair(rng, -5, 5);
        const expStr = rng.pick(["e^{x}", "2^{x}", "3^{x}"]);
        const fs = [lin(1, -u), lin(1, -v)];
        const op = rng.pick(ops);
        const set = chartSet(1, fs, op);
        const polyName = `(x ${tail(-u)})(x ${tail(-v)})`;
        const ineq = `${polyName}${expStr} ${opL[op]} 0`;
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [chartSet(-1, fs, op), chartSet(1, fs, toggled[op]), complement(set)],
          solution: t(
            `Since $${expStr} > 0$ for all real $x$, divide both sides by $${expStr}$ without flipping the inequality:${steps(
              `${polyName} ${opL[op]} 0`,
            )}The roots are $${u}$ and $${v}$. The solution is $${setL(set)}$.`,
            `因为对所有实数 $x$ 都有 $${expStr} > 0$，两边同时除以 $${expStr}$（不等号方向不变）：${steps(
              `${polyName} ${opL[op]} 0`,
            )}两根为 $${u}$ 和 $${v}$。解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
    {
      id: "products-where-exponentials-change-sign",
      title: t("Factors of the form $b^{x} - c$", "形如 $b^{x} - c$ 的因式"),
      explanation: t(
        "The factor $(2^{x} - 4)$ changes sign at $x = 2$, since $2^{x} < 4$ when $x < 2$ and $2^{x} > 4$ when $x > 2$. To solve $(x + 1)(2^{x} - 4) < 0$:\n\n1. **Zeros**: $x = -1$ and $x = 2$.\n2. **Intervals**: on $(-1, 2)$, $(x + 1) > 0$ while $(2^{x} - 4) < 0$, so the product is negative.\n\nThe solution is $(-1, 2)$.",
        "因式 $(2^{x} - 4)$ 在 $x = 2$ 处变号，因为当 $x < 2$ 时 $2^{x} < 4$，当 $x > 2$ 时 $2^{x} > 4$。求解 $(x + 1)(2^{x} - 4) < 0$ 的步骤：\n\n1. **零点**：$x = -1$ 与 $x = 2$。\n2. **区间**：在 $(-1, 2)$ 上，$(x + 1) > 0$ 而 $(2^{x} - 4) < 0$，乘积为负。\n\n解集是 $(-1, 2)$。",
      ),
      generate(rng) {
        const u = rng.int(-4, 0);
        const e = rng.int(1, 3);
        const c = 2 ** e;
        const op = rng.pick(ops);
        const ineq = `(x ${tail(-u)})(2^{x} - ${c}) ${opL[op]} 0`;
        const fs = [lin(1, -u), lin(1, -e)];
        const set = chartSet(1, fs, op);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [chartSet(-1, fs, op), chartSet(1, fs, toggled[op]), complement(set)],
          solution: t(
            `The factor $x ${tail(-u)}$ is zero at $x = ${u}$, and $2^{x} - ${c}$ is zero at $x = ${e}$. Testing intervals around these two critical numbers yields the solution $${setL(set)}$.`,
            `因式 $x ${tail(-u)}$ 在 $x = ${u}$ 处为零，因式 $2^{x} - ${c}$ 在 $x = ${e}$ 处为零。围绕这两个关键值检验区间符号，解集为 $${setL(set)}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 3.8.5 Positive and negative factors ────────────────────────────────────

/** solvingInequalitiesInvolvingPositiveAndNegativeFactors handles definite factors. */
export const solvingInequalitiesInvolvingPositiveAndNegativeFactors: TopicDef = {
  id: "solving-inequalities-involving-positive-and-negative-factors",
  title: t("Solving Inequalities Involving Positive and Negative Factors", "解含恒正或恒负因式的不等式"),
  summary: t(
    "Simplify inequalities by dividing out factors with negative discriminants or even powers plus positive constants that are strictly positive or negative for all real numbers.",
    "通过除以判别式为负或偶次幂加正数这种恒正或恒负的因式化简不等式。",
  ),
  prerequisites: [
    "solving-polynomial-inequalities-using-the-sign-table-method",
    "determining-unknown-parameters-in-quadratic-equations-with-no-real-solutions",
  ],
  encompasses: [{ topic: "solving-polynomial-inequalities-using-the-sign-table-method", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.4"],
  knowledgePoints: [
    {
      id: "factors-with-no-real-roots",
      title: t("Strictly positive quadratic factors", "恒为正的二次因式"),
      explanation: t(
        "A quadratic factor $x^{2} + c$ with $c > 0$ (or $x^{2} + px + q$ with $p^{2} - 4q < 0$ and $a > 0$) is **strictly positive** for every real number $x$. It never equals zero and never changes sign. You can divide both sides by it:\n\n$$(x^{2} + 4)(x - 5) < 0 iff x - 5 < 0 iff x < 5$$\n\nso the solution is $(-infty, 5)$.",
        "当 $c > 0$ 时，二次因式 $x^{2} + c$（或判别式 $p^{2} - 4q < 0$ 且 $a > 0$ 的二次式 $x^{2} + px + q$）对任意实数 $x$ 都**恒为正**。它既不为零，也不变号。两边可直接除以该因式：\n\n$$(x^{2} + 4)(x - 5) < 0 iff x - 5 < 0 iff x < 5$$\n\n所以解集是 $(-infty, 5)$。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const r = rng.int(-6, 6);
        const op = rng.pick(ops);
        const ineq = `(x^{2} + ${c})(x ${tail(-r)}) ${opL[op]} 0`;
        const set = ray(op, r);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [ray(reversed[op], r), union(mk(Q.of(-c), Q.of(r))), complement(set)],
          solution: t(
            `Since $x^{2} + ${c} ge ${c} > 0$ for all real $x$, divide both sides by $x^{2} + ${c}$ without changing the inequality direction:${steps(
              `x ${tail(-r)} ${opL[op]} 0`,
              `x ${opL[op]} ${r}`,
            )}The solution is $${setL(set)}$.`,
            `因为对任意实数 $x$ 都有 $x^{2} + ${c} ge ${c} > 0$，两边直接除以 $x^{2} + ${c}$（不等号方向不变）：${steps(
              `x ${tail(-r)} ${opL[op]} 0`,
              `x ${opL[op]} ${r}`,
            )}解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
    {
      id: "negative-definite-factors",
      title: t("Strictly negative factors", "恒为负的因式"),
      explanation: t(
        "Similarly, $-x^{2} - 3 = -(x^{2} + 3)$ is strictly negative for all real $x$. Dividing both sides by it **reverses** the inequality direction:\n\n$$(-x^{2} - 3)(2x - 8) le 0 iff 2x - 8 ge 0 iff x ge 4$$\n\nso the solution is $[4, infty)$.",
        "同理，$-x^{2} - 3 = -(x^{2} + 3)$ 对所有实数 $x$ 都恒为负。两边同时除以它会**反转**不等号方向：\n\n$$(-x^{2} - 3)(2x - 8) le 0 iff 2x - 8 ge 0 iff x ge 4$$\n\n所以解集是 $[4, infty)$。",
      ),
      generate(rng) {
        const c = rng.int(1, 6);
        const r = rng.int(-5, 5);
        const op = rng.pick(ops);
        const ineq = `(-x^{2} - ${c})(x ${tail(-r)}) ${opL[op]} 0`;
        const set = ray(reversed[op], r);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [ray(op, r), complement(set), union(point(r))],
          solution: t(
            `Since $-x^{2} - ${c} le -${c} < 0$ for all real $x$, divide both sides by it and reverse the inequality:${steps(
              `x ${tail(-r)} ${opL[reversed[op]]} 0`,
              `x ${opL[reversed[op]]} ${r}`,
            )}The solution is $${setL(set)}$.`,
            `因为对所有实数 $x$ 都有 $-x^{2} - ${c} le -${c} < 0$，两边除以它并反转不等号：${steps(
              `x ${tail(-r)} ${opL[reversed[op]]} 0`,
              `x ${opL[reversed[op]]} ${r}`,
            )}解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 3.8.6 Geometric sequences inequalities ─────────────────────────────────

/** solvingInequalitiesInvolvingGeometricSequences solves inequalities arising from sequences. */
export const solvingInequalitiesInvolvingGeometricSequences: TopicDef = {
  id: "solving-inequalities-involving-geometric-sequences",
  title: t("Solving Inequalities Involving Geometric Sequences", "解含等比数列的不等式"),
  summary: t(
    "Find the smallest term index $n$ for which a term or partial sum of a geometric sequence exceeds a given threshold.",
    "求等比数列的某项或前项和超过给定阈值时的最小项数 $n$。",
  ),
  prerequisites: ["nth-term-of-a-geometric-sequence", "solving-inequalities-involving-exponential-functions"],
  encompasses: [{ topic: "nth-term-of-a-geometric-sequence", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.BF.A.2"],
  knowledgePoints: [
    {
      id: "terms-of-a-geometric-sequence-exceeding-a-bound",
      title: t("Term of a geometric sequence exceeding a bound", "等比数列某项超过阈值"),
      explanation: t(
        "For a geometric sequence with first term $a_{1}$ and common ratio $r > 1$, the $n$-th term is $a_{n} = a_{1} r^{n-1}$. To find the smallest $n$ such that $a_{n} > M$:\n\n$$a_{1} r^{n-1} > M implies r^{n-1} > \\frac{M}{a_{1}} implies n - 1 > \\frac{\\ln(M / a_{1})}{\\ln r}$$\n\nFor $a_{1} = 3$ and $r = 2$, to exceed $100$:\n\n$$3 cdot 2^{n-1} > 100 implies 2^{n-1} > 33.\\overline{3} implies n - 1 ge 6 implies n ge 7$$\n\nso the smallest integer is $n = 7$.",
        "对于首项为 $a_{1}$、公比为 $r > 1$ 的等比数列，第 $n$ 项为 $a_{n} = a_{1} r^{n-1}$。求使得 $a_{n} > M$ 成立的最小正整数 $n$：\n\n$$a_{1} r^{n-1} > M implies r^{n-1} > \\frac{M}{a_{1}} implies n - 1 > \\frac{\\ln(M / a_{1})}{\\ln r}$$\n\n以 $a_{1} = 3$、$r = 2$ 超过 $100$ 为例：\n\n$$3 cdot 2^{n-1} > 100 implies 2^{n-1} > 33.\\overline{3} implies n - 1 ge 6 implies n ge 7$$\n\n所以最小的正整数是 $n = 7$。",
      ),
      generate(rng) {
        const a1 = rng.int(2, 5);
        const r = rng.pick([2, 3]);
        const nTarget = rng.int(5, 8);
        const termVal = a1 * r ** (nTarget - 1);
        const M = termVal - rng.int(1, Math.floor(termVal / 3));
        return numberProblem({
          prompt: t(
            `A geometric sequence has first term $a_{1} = ${a1}$ and common ratio $r = ${r}$. Find the smallest positive integer $n$ such that $a_{n} > ${M}$.`,
            `一个等比数列的首项为 $a_{1} = ${a1}$，公比为 $r = ${r}$。求使得 $a_{n} > ${M}$ 成立的最小正整数 $n$。`,
          ),
          answer: nTarget,
          wrong: [nTarget - 1, nTarget + 1, nTarget + 2],
          solution: t(
            `The formula for the $n$-th term is $a_{n} = ${a1} cdot ${r}^{n-1}$. We require:${steps(
              `${a1} cdot ${r}^{n-1} > ${M}`,
              `${r}^{n-1} > ${(M / a1).toFixed(2)}`,
            )}For $n = ${nTarget - 1}$, $a_{${nTarget - 1}} = ${a1 * r ** (nTarget - 2)} le ${M}$. For $n = ${nTarget}$, $a_{${nTarget}} = ${termVal} > ${M}$. The smallest integer is $n = ${nTarget}$.`,
            `第 $n$ 项公式为 $a_{n} = ${a1} cdot ${r}^{n-1}$。要求：${steps(
              `${a1} cdot ${r}^{n-1} > ${M}`,
              `${r}^{n-1} > ${(M / a1).toFixed(2)}`,
            )}当 $n = ${nTarget - 1}$ 时，$a_{${nTarget - 1}} = ${a1 * r ** (nTarget - 2)} le ${M}$；当 $n = ${nTarget}$ 时，$a_{${nTarget}} = ${termVal} > ${M}$。因此最小正整数为 $n = ${nTarget}$。`,
          ),
        });
      },
    },
    {
      id: "sums-of-a-geometric-series-exceeding-a-bound",
      title: t("Partial sums of a geometric series exceeding a bound", "等比数列前项和超过阈值"),
      explanation: t(
        "The sum of the first $n$ terms of a geometric series is $S_{n} = a_{1} \\frac{r^{n} - 1}{r - 1}$. For $a_{1} = 1$ and $r = 2$:\n\n$$S_{n} = 2^{n} - 1 > 50 implies 2^{n} > 51 implies n ge 6$$\n\nso the smallest integer is $n = 6$.",
        "等比数列前 $n$ 项和为 $S_{n} = a_{1} \\frac{r^{n} - 1}{r - 1}$。以 $a_{1} = 1$、$r = 2$ 为例：\n\n$$S_{n} = 2^{n} - 1 > 50 implies 2^{n} > 51 implies n ge 6$$\n\n所以最小的正整数是 $n = 6$。",
      ),
      generate(rng) {
        const nTarget = rng.int(6, 9);
        const sumVal = 2 ** nTarget - 1;
        const M = sumVal - rng.int(1, 2 ** (nTarget - 2));
        return numberProblem({
          prompt: t(
            `For the geometric sequence with $a_{1} = 1$ and common ratio $r = 2$, find the smallest positive integer $n$ such that the sum of the first $n$ terms $S_{n} > ${M}$.`,
            `对于首项 $a_{1} = 1$、公比 $r = 2$ 的等比数列，求使得前 $n$ 项和 $S_{n} > ${M}$ 成立的最小正整数 $n$。`,
          ),
          answer: nTarget,
          wrong: [nTarget - 1, nTarget + 1, nTarget + 2],
          solution: t(
            `The sum formula is $S_{n} = \\frac{1(2^{n} - 1)}{2 - 1} = 2^{n} - 1$. We need $2^{n} - 1 > ${M} implies 2^{n} > ${M + 1}$. Since $2^{${nTarget - 1}} = ${2 ** (nTarget - 1)} le ${M + 1}$ and $2^{${nTarget}} = ${2 ** nTarget} > ${M + 1}$, the smallest integer is $n = ${nTarget}$.`,
            `前 $n$ 项和公式为 $S_{n} = \\frac{1(2^{n} - 1)}{2 - 1} = 2^{n} - 1$。需要 $2^{n} - 1 > ${M} implies 2^{n} > ${M + 1}$。由于 $2^{${nTarget - 1}} = ${2 ** (nTarget - 1)} le ${M + 1}$ 且 $2^{${nTarget}} = ${2 ** nTarget} > ${M + 1}$，因此最小正整数为 $n = ${nTarget}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 3.8.7 Solving rational inequalities ────────────────────────────────────

/** solvingRationalInequalities solves rational inequalities compared to zero. */
export const solvingRationalInequalities: TopicDef = {
  id: "solving-rational-inequalities",
  title: t("Solving Rational Inequalities", "解分式不等式"),
  summary: t(
    "Solve rational inequalities of the form $\\frac{P(x)}{Q(x)} \text{ op } 0$, remembering that denominator zeros (poles) are never included in the solution set.",
    "解形如 $\\frac{P(x)}{Q(x)} \text{ op } 0$ 的分式不等式，牢记分母零点（奇点）决不能包含在解集中。",
  ),
  prerequisites: ["solving-polynomial-inequalities-using-the-sign-table-method", "vertical-asymptotes-of-rational-functions"],
  encompasses: [{ topic: "solving-polynomial-inequalities-using-the-sign-table-method", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSA.REI.B.4"],
  knowledgePoints: [
    {
      id: "basic-rational-inequalities",
      title: t("Simple rational inequalities", "简单的分式不等式"),
      explanation: t(
        "To solve $\\frac{x - 1}{x + 3} le 0$:\n\n1. **Critical values**: numerator is zero at $x = 1$; denominator is zero at $x = -3$.\n2. **Sign table**: the quotient has the same sign as $(x - 1)(x + 3)$ on each interval, being negative on $(-3, 1)$.\n3. **Endpoints**: $x = 1$ gives $0 le 0$ (included), but $x = -3$ makes the fraction invalid since division by zero is not defined (excluded!).\n\nThe solution is $(-3, 1]$.",
        "求解 $\\frac{x - 1}{x + 3} le 0$ 的步骤：\n\n1. **关键值**：分子在 $x = 1$ 处为零；分母在 $x = -3$ 处为零。\n2. **符号表**：商在每个区间上的正负号与乘积 $(x - 1)(x + 3)$ 完全相同，在 $(-3, 1)$ 上为负。\n3. **端点**：$x = 1$ 使得 $0 le 0$（包含）；但 $x = -3$ 使得分母为零无意义（必须排除！）。\n\n解集是 $(-3, 1]$。",
      ),
      generate(rng) {
        const [u, v] = distinctPair(rng, -6, 6);
        const top = lin(1, -u);
        const bot = lin(1, -v, 1, { pole: true });
        const fs = [top, bot];
        const op = rng.pick(ops);
        const set = chartSet(1, fs, op);
        const expr = `\frac{x ${tail(-u)}}{x ${tail(-v)}}`;
        return intervalProblem({
          prompt: solvePrompt(`${expr} ${opL[op]} 0`),
          set,
          form: "interval",
          wrong: [chartSet(1, [top, lin(1, -v)], op), chartSet(-1, fs, op), complement(set)],
          solution: chartSolution(1, fs, expr, op, set),
        });
      },
    },
    {
      id: "rational-inequalities-with-multiple-factors",
      title: t("Rational inequalities with multiple factors", "含多个因式的分式不等式"),
      explanation: t(
        "For $\\frac{(x - 2)(x + 4)}{x - 1} > 0$, the critical points are $-4, 1, 2$. The denominator root $1$ must be excluded under all circumstances. Checking signs on the intervals gives $(-4, 1) cup (2, infty)$.",
        "对于 $\\frac{(x - 2)(x + 4)}{x - 1} > 0$，关键点为 $-4, 1, 2$。分母零点 $1$ 在任何情况下都必须排除。在各区间检验符号可得解集为 $(-4, 1) cup (2, infty)$。",
      ),
      generate(rng) {
        const [r1, r2, r3] = distinctTriple(rng, -5, 5);
        const top = [lin(1, -r1), lin(1, -r3)];
        const bot = [lin(1, -r2, 1, { pole: true })];
        const fs = [...top, ...bot];
        const op = rng.pick(ops);
        const set = chartSet(1, fs, op);
        const expr = fraction(1, top, bot);
        return intervalProblem({
          prompt: solvePrompt(`${expr} ${opL[op]} 0`),
          set,
          form: "interval",
          wrong: [chartSet(-1, fs, op), chartSet(1, fs, toggled[op]), complement(set)],
          solution: chartSolution(1, fs, expr, op, set),
        });
      },
    },
  ],
};

// ─── 3.8.8 Further solving of rational inequalities ─────────────────────────

/** furtherSolvingOfRationalInequalities solves inequalities compared to non-zero constants. */
export const furtherSolvingOfRationalInequalities: TopicDef = {
  id: "further-solving-of-rational-inequalities",
  title: t("Further Solving of Rational Inequalities", "进一步解分式不等式"),
  summary: t(
    "Solve rational inequalities compared to a non-zero constant by moving all terms to one side, combining into a single fraction, and using a sign chart.",
    "通过将所有项移至一侧、通分化为单个分式再用符号表求解与非零常数比较的分式不等式。",
  ),
  prerequisites: ["solving-rational-inequalities"],
  encompasses: [{ topic: "solving-rational-inequalities", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSA.REI.B.4"],
  knowledgePoints: [
    {
      id: "rational-inequalities-with-a-non-zero-constant",
      title: t("Comparing a rational expression to a non-zero number", "分式与非零常数比较"),
      explanation: t(
        "**Never** multiply both sides by the denominator, because its sign changes depending on $x$! Instead, subtract the constant and find a common denominator:\n\n$$\\frac{x + 1}{x - 2} ge 2 implies \\frac{x + 1}{x - 2} - 2 ge 0 implies \\frac{(x + 1) - 2(x - 2)}{x - 2} ge 0 implies \\frac{-x + 5}{x - 2} ge 0$$\n\nThe critical values are $x = 5$ (numerator zero) and $x = 2$ (pole). Testing intervals gives $(2, 5]$. Note that $2$ is open because it makes the denominator zero.",
        "**切勿**直接在两边乘以分母，因为分母的正负号随 $x$ 而变！正确方法是移项后通分：\n\n$$\\frac{x + 1}{x - 2} ge 2 implies \\frac{x + 1}{x - 2} - 2 ge 0 implies \\frac{(x + 1) - 2(x - 2)}{x - 2} ge 0 implies \\frac{-x + 5}{x - 2} ge 0$$\n\n关键值是 $x = 5$（分子零点）与 $x = 2$（奇点）。检验各区间可得解集为 $(2, 5]$。注意 $2$ 处为开区间，因为它使分母为零。",
      ),
      generate(rng) {
        const c = rng.int(-4, 4);
        const k = rng.pick([2, 3]);
        const numRoot = c + rng.pick([-3, -2, 2, 3]);
        const b = -numRoot + k * c;
        const topOrig = linear(1, b);
        const botOrig = `x ${tail(-c)}`;
        const op = rng.pick(ops);
        const topFact = lin(-k + 1, b + k * c);
        const botFact = lin(1, -c, 1, { pole: true });
        const fs = [topFact, botFact];
        const set = chartSet(1, fs, op);
        const ineq = `\frac{${topOrig}}{${botOrig}} ${opL[op]} ${k}`;
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [chartSet(-1, fs, op), chartSet(1, [lin(1, -numRoot), lin(1, -c)], op), complement(set)],
          solution: t(
            `Subtract $${k}$ and combine over a common denominator:${steps(
              `\frac{${topOrig}}{${botOrig}} - ${k} ${opL[op]} 0`,
              `\frac{(${topOrig}) - ${k}(${botOrig})}{${botOrig}} ${opL[op]} 0`,
              `\frac{${linear(1 - k, b + k * c)}}{${botOrig}} ${opL[op]} 0`,
            )}The critical values are $${numRoot}$ (from the numerator) and $${c}$ (from the denominator). The denominator root is never included. The solution is $${setL(set)}$.`,
            `移项减去 $${k}$ 并通分：${steps(
              `\frac{${topOrig}}{${botOrig}} - ${k} ${opL[op]} 0`,
              `\frac{(${topOrig}) - ${k}(${botOrig})}{${botOrig}} ${opL[op]} 0`,
              `\frac{${linear(1 - k, b + k * c)}}{${botOrig}} ${opL[op]} 0`,
            )}关键值为 $${numRoot}$（分子零点）和 $${c}$（分母零点，不可取）。解集是 $${setL(set)}$。`,
          ),
        });
      },
    },
    {
      id: "sum-of-two-rational-expressions",
      title: t("Comparing two rational expressions", "比较两个分式"),
      explanation: t(
        "To solve $\\frac{1}{x - 1} < \\frac{1}{x - 3}$, subtract the right-hand side to get zero on one side:\n\n$$\\frac{1}{x - 1} - \\frac{1}{x - 3} < 0 implies \\frac{(x - 3) - (x - 1)}{(x - 1)(x - 3)} < 0 implies \\frac{-2}{(x - 1)(x - 3)} < 0$$\n\nDividing by $-2$ reverses the inequality: $\\frac{1}{(x - 1)(x - 3)} > 0$, which yields $(-infty, 1) cup (3, infty)$.",
        "求解 $\\frac{1}{x - 1} < \\frac{1}{x - 3}$ 时，先移项使右边为零：\n\n$$\\frac{1}{x - 1} - \\frac{1}{x - 3} < 0 implies \\frac{(x - 3) - (x - 1)}{(x - 1)(x - 3)} < 0 implies \\frac{-2}{(x - 1)(x - 3)} < 0$$\n\n除以 $-2$ 反转不等号：$\\frac{1}{(x - 1)(x - 3)} > 0$，可得解集为 $(-infty, 1) cup (3, infty)$。",
      ),
      generate(rng) {
        const [u, v] = distinctPair(rng, -5, 5).sort((p, q) => p - q);
        const op = rng.pick(ops);
        const ineq = `\frac{1}{x ${tail(-u)}} ${opL[op]} \frac{1}{x ${tail(-v)}}`;
        const diff = u - v;
        const fs = [lin(1, -u, 1, { pole: true }), lin(1, -v, 1, { pole: true })];
        const set = chartSet(diff, fs, op);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [chartSet(-diff, fs, op), chartSet(1, fs, toggled[op]), complement(set)],
          solution: t(
            `Subtract to get zero on the right side and find a common denominator:${steps(
              `\frac{1}{x ${tail(-u)}} - \frac{1}{x ${tail(-v)}} ${opL[op]} 0`,
              `\frac{(x ${tail(-v)}) - (x ${tail(-u)})}{(x ${tail(-u)})(x ${tail(-v)})} ${opL[op]} 0`,
              `\frac{${diff}}{(x ${tail(-u)})(x ${tail(-v)})} ${opL[op]} 0`,
            )}The poles are $x = ${u}$ and $x = ${v}$. Testing intervals gives the solution $${setL(set)}$.`,
            `移项并通分：${steps(
              `\frac{1}{x ${tail(-u)}} - \frac{1}{x ${tail(-v)}} ${opL[op]} 0`,
              `\frac{(x ${tail(-v)}) - (x ${tail(-u)})}{(x ${tail(-u)})(x ${tail(-v)})} ${opL[op]} 0`,
              `\frac{${diff}}{(x ${tail(-u)})(x ${tail(-v)})} ${opL[op]} 0`,
            )}奇点为 $x = ${u}$ 和 $x = ${v}$。检验区间符号得解集为 $${setL(set)}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 3.8.9 Solving two-variable nonlinear inequalities ──────────────────────

/** solvingTwoVariableNonlinearInequalities graphs regions bounded by curves. */
export const solvingTwoVariableNonlinearInequalities: TopicDef = {
  id: "solving-two-variable-nonlinear-inequalities",
  title: t("Solving Two-Variable Nonlinear Inequalities", "解二元非线性不等式"),
  summary: t(
    "Graph the region representing the solutions to an inequality in two variables involving parabolas or circles, using test points to determine the shaded side.",
    "画出含抛物线或圆的二元不等式解集区域，利用检验点确定阴影所在侧。",
  ),
  prerequisites: ["graphing-non-strict-linear-inequalities", "roots-of-quadratic-functions"],
  encompasses: [{ topic: "graphing-non-strict-linear-inequalities", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSA.REI.D.12"],
  knowledgePoints: [
    {
      id: "testing-points-in-nonlinear-inequalities",
      title: t("Testing a point in a nonlinear inequality", "在非线性不等式中代入点检验"),
      explanation: t(
        "To determine whether a point $(x_{0}, y_{0})$ satisfies an inequality such as $y > x^{2} - 3$, substitute its coordinates directly. For $(1, 2)$:\n\n$$2 > 1^{2} - 3 = -2 quad \text{(true)}$$\n\nso $(1, 2)$ lies in the solution region. For $(2, 1)$:\n\n$$1 > 2^{2} - 3 = 1 quad \text{(false, since the inequality is strict)}$$\n\nso $(2, 1)$ does not belong to the solution set.",
        "要判断点 $(x_{0}, y_{0})$ 是否满足像 $y > x^{2} - 3$ 这样的不等式，直接代入坐标计算。对点 $(1, 2)$：\n\n$$2 > 1^{2} - 3 = -2 quad \text{（成立）}$$\n\n因此 $(1, 2)$ 在解集区域内。对点 $(2, 1)$：\n\n$$1 > 2^{2} - 3 = 1 quad \text{（不成立，因为是不等式严格为大于）}$$\n\n因此 $(2, 1)$ 不在解集内。",
      ),
      generate(rng) {
        const c = rng.int(-4, 2);
        const x0 = rng.int(-3, 3);
        const yVal = x0 * x0 + c;
        const offset = rng.pick([-2, -1, 0, 1, 2]);
        const y0 = yVal + offset;
        const op = rng.pick(ops);
        const ineq = `y ${opL[op]} x^{2} ${tail(c)}`;
        let satisfies = false;
        if (op === "<") satisfies = y0 < yVal;
        else if (op === "<=") satisfies = y0 <= yVal;
        else if (op === ">") satisfies = y0 > yVal;
        else satisfies = y0 >= yVal;
        return choiceProblem({
          prompt: t(`Does the point $(${x0}, ${y0})$ satisfy the inequality $${ineq}$?`, `点 $(${x0}, ${y0})$ 是否满足不等式 $${ineq}$？`),
          options: yesNo,
          correct: satisfies ? 0 : 1,
          solution: t(
            `Substitute $x = ${x0}$ and $y = ${y0}$ into the inequality:${steps(
              `${y0} ${opL[op]} (${x0})^{2} ${tail(c)}`,
              `${y0} ${opL[op]} ${yVal}`,
            )}This statement is ${satisfies ? "true" : "false"}. Therefore, the point $(${x0}, ${y0})$ ${satisfies ? "satisfies" : "does not satisfy"} the inequality.`,
            `将 $x = ${x0}$ 和 $y = ${y0}$ 代入不等式：${steps(
              `${y0} ${opL[op]} (${x0})^{2} ${tail(c)}`,
              `${y0} ${opL[op]} ${yVal}`,
            )}该不等式${satisfies ? "成立" : "不成立"}。因此点 $(${x0}, ${y0})$ ${satisfies ? "满足" : "不满足"}该不等式。`,
          ),
        });
      },
    },
    {
      id: "identifying-nonlinear-inequality-regions",
      title: t("Regions bounded by parabolas", "抛物线围成的区域"),
      explanation: t(
        "For $y ge ax^{2} + c$ with $a > 0$, the boundary is the solid curve $y = ax^{2} + c$, and the region contains all points **above** or on the curve. For $y < ax^{2} + c$, the boundary is dashed, and the region is **below** the curve.",
        "对于 $a > 0$ 的 $y ge ax^{2} + c$，边界是实线曲线 $y = ax^{2} + c$，区域包含曲线**上方**及曲线上的所有点。对 $y < ax^{2} + c$，边界为虚线，区域位于曲线**下方**。",
      ),
      generate(rng) {
        const c = rng.int(-5, 4);
        const aboveCurve = rng.bool();
        const solid = rng.bool();
        const op: Op = aboveCurve ? (solid ? ">=" : ">") : solid ? "<=" : "<";
        const correctIneq = `y ${opL[op]} x^{2} ${tail(c)}`;
        const wrongOps = ops.filter((o) => o !== op);
        const options = [op, ...wrongOps].map((o) => t(`$y ${opL[o]} x^{2} ${tail(c)}$`, `$y ${opL[o]} x^{2} ${tail(c)}$`));
        return choiceProblem({
          prompt: t(
            `Which inequality describes the region ${aboveCurve ? "above" : "below"} the parabola $y = x^{2} ${tail(c)}$, with a ${solid ? "solid" : "dashed"} boundary curve?`,
            `哪个不等式表示抛物线 $y = x^{2} ${tail(c)}$ ${aboveCurve ? "上方" : "下方"}的区域，且边界为${solid ? "实线" : "虚线"}？`,
          ),
          options,
          correct: 0,
          solution: t(
            `The region is ${aboveCurve ? "above" : "below"} the parabola, which corresponds to $y ${aboveCurve ? ">" : "<"}$. The boundary curve is ${solid ? "solid" : "dashed"}, which means points on the curve are ${solid ? "included ($ge$ or $le$)" : "excluded ($>$ or $<$)"}. Thus, the inequality is $${correctIneq}$.`,
            `区域位于抛物线${aboveCurve ? "上方" : "下方"}，对应于 $y ${aboveCurve ? ">" : "<"}$。边界为${solid ? "实线" : "虚线"}，意味着边界上的点${solid ? "包含在内（$ge$ 或 $le$）" : "不包含（$>$ 或 $<$）"}。因此不等式为 $${correctIneq}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 3.8.10 Further solving of two-variable nonlinear inequalities ──────────

/** furtherSolvingOfTwoVariableNonlinearInequalities solves systems with nonlinear boundaries. */
export const furtherSolvingOfTwoVariableNonlinearInequalities: TopicDef = {
  id: "further-solving-of-two-variable-nonlinear-inequalities",
  title: t("Further Solving of Two-Variable Nonlinear Inequalities", "进一步解二元非线性不等式"),
  summary: t(
    "Solve systems of nonlinear inequalities in two variables by finding the intersection of their individual solution regions in the coordinate plane.",
    "通过在坐标平面中求各不等式解集区域的交集，求解二元非线性不等式组。",
  ),
  prerequisites: ["solving-two-variable-nonlinear-inequalities", "systems-of-linear-inequalities"],
  encompasses: [{ topic: "solving-two-variable-nonlinear-inequalities", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSA.REI.D.12"],
  knowledgePoints: [
    {
      id: "testing-points-in-systems-of-nonlinear-inequalities",
      title: t("Testing points in a nonlinear system", "在非线性不等式组中代入点检验"),
      explanation: t(
        "A point $(x_{0}, y_{0})$ satisfies a system of inequalities if and only if it satisfies **every** inequality in the system. For:\n\n$$\\begin{cases} y ge x^{2} - 4 \\ y le 2x + 1 \\end{cases}$$\n\nFor $(0, 0)$:\n\n- $0 ge 0^{2} - 4 = -4$ (true)\n- $0 le 2(0) + 1 = 1$ (true)\n\nBoth are satisfied, so $(0, 0)$ lies in the solution set.",
        "点 $(x_{0}, y_{0})$ 满足不等式组当且仅当它满足组中的**每一个**不等式。例如：\n\n$$\\begin{cases} y ge x^{2} - 4 \\ y le 2x + 1 \\end{cases}$$\n\n对点 $(0, 0)$：\n\n- $0 ge 0^{2} - 4 = -4$（成立）\n- $0 le 2(0) + 1 = 1$（成立）\n\n两个条件均满足，因此 $(0, 0)$ 在解集中。",
      ),
      generate(rng) {
        const c = rng.int(1, 4);
        const m = rng.int(1, 3);
        const d = rng.int(1, 3);
        const ineq1 = `y ge x^{2} - ${c}`;
        const ineq2 = `y le ${linear(m, d)}`;
        const x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 4);
        const sat1 = y0 >= x0 * x0 - c;
        const sat2 = y0 <= m * x0 + d;
        const satisfies = sat1 && sat2;
        return choiceProblem({
          prompt: t(
            `Does the point $(${x0}, ${y0})$ satisfy the system $\\begin{cases} ${ineq1} \\ ${ineq2} \\end{cases}$?`,
            `点 $(${x0}, ${y0})$ 是否满足不等式组 $\\begin{cases} ${ineq1} \\ ${ineq2} \\end{cases}$？`,
          ),
          options: yesNo,
          correct: satisfies ? 0 : 1,
          solution: t(
            `Test the point $(${x0}, ${y0})$ in both inequalities:${steps(
              `${y0} ge (${x0})^{2} - ${c} = ${x0 * x0 - c} quad \text{(${sat1 ? "true" : "false"})}`,
              `${y0} le ${m}(${x0}) + ${d} = ${m * x0 + d} quad \text{(${sat2 ? "true" : "false"})}`,
            )}Since ${satisfies ? "both inequalities are" : "not all inequalities are"} satisfied, the point ${satisfies ? "satisfies" : "does not satisfy"} the system.`,
            `在两个不等式中分别检验点 $(${x0}, ${y0})$：${steps(
              `${y0} ge (${x0})^{2} - ${c} = ${x0 * x0 - c} quad \text{（${sat1 ? "成立" : "不成立"}）}`,
              `${y0} le ${m}(${x0}) + ${d} = ${m * x0 + d} quad \text{（${sat2 ? "成立" : "不成立"}）}`,
            )}因为两个不等式${satisfies ? "均成立" : "未能全部成立"}，所以该点${satisfies ? "满足" : "不满足"}该不等式组。`,
          ),
        });
      },
    },
    {
      id: "intersection-points-of-nonlinear-boundaries",
      title: t("Vertices of the solution region", "解集区域的交点顶点"),
      explanation: t(
        "To find where the boundary curves $y = x^{2} - 2$ and $y = x + 4$ meet, set them equal:\n\n$$x^{2} - 2 = x + 4 implies x^{2} - x - 6 = 0 implies (x - 3)(x + 2) = 0$$\n\nSubstituting $x = 3$ gives $y = 7$, and $x = -2$ gives $y = 2$. The intersection points are $(-2, 2)$ and $(3, 7)$.",
        "要找出边界曲线 $y = x^{2} - 2$ 与 $y = x + 4$ 的交点，联立方程：\n\n$$x^{2} - 2 = x + 4 implies x^{2} - x - 6 = 0 implies (x - 3)(x + 2) = 0$$\n\n代入 $x = 3$ 得 $y = 7$；代入 $x = -2$ 得 $y = 2$。交点坐标为 $(-2, 2)$ 与 $(3, 7)$。",
      ),
      generate(rng) {
        const [u, v] = distinctPair(rng, -3, 3).sort((p, q) => p - q);
        const m = u + v;
        const p = -u * v;
        const c = rng.int(1, 3);
        const d = p - c;
        const p1 = `(${u}, ${u * u - c})`;
        const p2 = `(${v}, ${v * v - c})`;
        const correctText = `$${p1}$ and $${p2}$`;
        const correctTextZh = `$${p1}$ 和 $${p2}$`;
        const options = [
          t(correctText, correctTextZh),
          t(`$(${u}, ${u * u + c})$ and $(${v}, ${v * v + c})$`, `$(${u}, ${u * u + c})$ 和 $(${v}, ${v * v + c})$`),
          t(`$(${-u}, ${u * u - c})$ and $(${-v}, ${v * v - c})$`, `$(${-u}, ${u * u - c})$ 和 $(${-v}, ${v * v - c})$`),
          t(`$(${u + 1}, ${u * u})$ and $(${v - 1}, ${v * v})$`, `$(${u + 1}, ${u * u})$ 和 $(${v - 1}, ${v * v})$`),
        ];
        return choiceProblem({
          prompt: t(
            `Find the intersection points of the boundary curves $y = x^{2} - ${c}$ and $y = ${linear(m, d)}$.`,
            `求边界曲线 $y = x^{2} - ${c}$ 与 $y = ${linear(m, d)}$ 的交点坐标。`,
          ),
          options,
          correct: 0,
          solution: t(
            `Set the two equations equal to solve for $x$:${steps(
              `x^{2} - ${c} = ${linear(m, d)}`,
              `x^{2} - ${linear(m, 0)} - ${p} = 0`,
              `(x - ${u})(x - ${v}) = 0`,
            )}The solutions are $x = ${u}$ and $x = ${v}$. Substituting back gives the points $${p1}$ and $${p2}$.`,
            `联立方程求 $x$：${steps(
              `x^{2} - ${c} = ${linear(m, d)}`,
              `x^{2} - ${linear(m, 0)} - ${p} = 0`,
              `(x - ${u})(x - ${v}) = 0`,
            )}解得 $x = ${u}$ 和 $x = ${v}$。代回求 $y$ 得交点坐标为 $${p1}$ 和 $${p2}$。`,
          ),
        });
      },
    },
  ],
};

export const precalculusInequalityTopics: readonly TopicDef[] = [
  solvingElementaryQuadraticInequalities,
  solvingQuadraticInequalitiesFromGraphs,
  solvingQuadraticInequalitiesUsingTheGraphicalMethod,
  solvingQuadraticInequalitiesUsingTheSignTableMethod,
  determiningUnknownParametersInQuadraticEquationsWithRealSolutions,
  determiningUnknownParametersInQuadraticEquationsWithNoRealSolutions,
  determiningUnknownParametersInQuadraticEquationsAdvancedCases,
  inequalitiesInvolvingPowersOfBinomials,
  solvingPolynomialInequalitiesUsingAGraphicalMethod,
  solvingPolynomialInequalitiesUsingSpecialFactoringTechniquesAndTheGraphicalMethod,
  solvingPolynomialInequalitiesUsingTheSignTableMethod,
  solvingRadicalInequalities,
  solvingInequalitiesInvolvingExponentialFunctions,
  solvingInequalitiesInvolvingLogarithmicFunctions,
  solvingInequalitiesInvolvingExponentialFunctionsAndPolynomials,
  solvingInequalitiesInvolvingPositiveAndNegativeFactors,
  solvingInequalitiesInvolvingGeometricSequences,
  solvingRationalInequalities,
  furtherSolvingOfRationalInequalities,
  solvingTwoVariableNonlinearInequalities,
  furtherSolvingOfTwoVariableNonlinearInequalities,
];
