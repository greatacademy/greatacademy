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
import { precalculusDrawings } from "../explanation-drawings-precalculus.ts";
import { choiceProblem, intervalProblem, numberProblem, steps, withMistakes, yesNo } from "../problems.ts";
import { listed, stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

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

// Steps and checks.

/** label writes the bold start of step i, followed by a space in English. */
const label = (i: number, en: string, zh: string): Text => {
  const s = stepLabel(i, en, zh);
  return t(`${s.en} `, s["zh-CN"]);
};

/** join puts texts one after another in each locale. */
const join = (...parts: readonly Text[]): Text => t(parts.map((p) => p.en).join(""), parts.map((p) => p["zh-CN"]).join(""));

/** para starts a new paragraph. */
const para = t("\n\n", "\n\n");

/** checked turns a text into a closing check paragraph. */
const checked = (c: Text) => t(`\n\n**Check.** ${c.en}`, `\n\n**检验。**${c["zh-CN"]}`);

/** disp is displayed work that closes a paragraph. */
const disp = (...lines: readonly string[]) => steps(...lines).trimEnd();

/** holds says whether l op r. */
function holds(l: Q, op: Op, r: Q): boolean {
  const c = l.cmp(r);
  return op === "<" ? c < 0 : op === "<=" ? c <= 0 : op === ">" ? c > 0 : c >= 0;
}

/** within says whether x lies strictly inside an interval, away from its endpoints. */
const within = (i: Interval, x: Q) => (!i.lo || i.lo.cmp(x) < 0) && (!i.hi || x.cmp(i.hi) < 0);

/** member says whether x belongs to a set. */
const member = (set: RealSet, x: Q) =>
  set.some((i) => (!i.lo || i.lo.cmp(x) < 0 || (i.loClosed && i.lo.eq(x))) && (!i.hi || x.cmp(i.hi) < 0 || (i.hiClosed && i.hi.eq(x))));

/** isEnd says whether x is an endpoint of one of the intervals of a set. */
const isEnd = (set: RealSet, x: Q) => set.some((i) => i.lo?.eq(x) || i.hi?.eq(x));

/** sample picks a number from a set, inside one of its intervals: 0 or another integer where one fits, other than avoid. */
function sample(set: RealSet, avoid?: Q): Q | undefined {
  const ok = (x: Q) => !avoid?.eq(x);
  for (const i of set) {
    if (i.lo && i.hi && i.lo.eq(i.hi)) {
      if (ok(i.lo)) return i.lo;
      continue;
    }
    const cands: Q[] = [Q.zero];
    if (i.lo && i.hi) {
      const mid = i.lo.add(i.hi).div(Q.of(2));
      const m = mid.toNumber();
      cands.push(Q.of(Math.round(m) + 0), Q.of(Math.floor(m) + 0), Q.of(Math.ceil(m) + 0), mid, i.lo.add(mid).div(Q.of(2)));
    } else if (i.lo) {
      const n = Math.floor(i.lo.toNumber()) + 1;
      cands.push(Q.of(n), Q.of(n + 1));
    } else if (i.hi) {
      const n = Math.ceil(i.hi.toNumber()) - 1;
      cands.push(Q.of(n), Q.of(n - 1));
    } else cands.push(Q.one);
    const c = cands.find((x) => ok(x) && within(i, x));
    if (c) return c;
  }
  return undefined;
}

/** picks chooses test numbers for a solution set: one inside, one outside, an endpoint (or hint when the set has none) and also. */
function picks(set: RealSet, o: { hint?: Q; avoid?: Q; end?: Q; also?: Q } = {}): Q[] {
  const first = set[0];
  const end = o.end ?? first?.lo ?? first?.hi ?? o.hint;
  const out: Q[] = [];
  for (const x of [sample(set, o.avoid), sample(complement(set), o.avoid), end, o.also]) {
    if (x && !out.some((y) => y.eq(x))) out.push(x);
  }
  return out;
}

/** say writes one substituted number: its role (in the solution, outside it, or an endpoint), the relation it gives and whether that is true. */
function say(at: string, inSet: boolean, end: boolean, l: Q, op: Op, r: Q): Text {
  const ok = holds(l, op, r);
  const role = end
    ? t("The endpoint", "端点")
    : inSet
      ? t("A number in the solution", "解集内的数")
      : t("A number outside the solution", "解集外的数");
  const rel = `$${l.toLatex()} ${opL[op]} ${r.toLatex()}$`;
  return t(
    `${role.en}, $${at}$, gives ${rel}, which is ${ok ? "true" : "false"}${end ? (ok ? ", so it is included" : ", so it is left out") : ""}.`,
    `${role["zh-CN"]} $${at}$ 代入得 ${rel}，${ok ? "成立" : "不成立"}${end ? (ok ? "，所以它包含在内" : "，所以它不包含在内") : ""}。`,
  );
}

/** sayAll joins the sentences of several substituted numbers. */
const sayAll = (parts: readonly Text[]) => t(parts.map((p) => p.en).join(" "), parts.map((p) => p["zh-CN"]).join(""));

/** tests substitutes numbers into an inequality, given by the values of its two sides, and says whether each one works. */
function tests(xs: readonly Q[], set: RealSet, sides: (x: Q) => readonly [Q, Q], op: Op, v = "x"): Text {
  return sayAll(
    xs.map((x) => {
      const [l, r] = sides(x);
      return say(`${v} = ${x.toLatex()}`, member(set, x), isEnd(set, x), l, op, r);
    }),
  );
}

/** substituted is a check that substitutes test numbers into the inequality that was given. */
const substituted = (xs: readonly Q[], set: RealSet, sides: (x: Q) => readonly [Q, Q], op: Op, v = "x") =>
  checked(join(t("Substitute numbers into the original inequality. ", "把数代入原不等式。"), tests(xs, set, sides, op, v)));

/** powerTests is a check for an exponential inequality at numbers that make the exponent a whole number, so that the power is exact. */
const powerTests = (xs: readonly Q[], set: RealSet, sides: (x: Q) => readonly [Q, Q], op: Op) =>
  checked(
    join(
      t(
        "Substitute numbers that make the exponent a whole number, so that the power is exact. ",
        "代入使指数为整数的值，这样幂的值是精确的。",
      ),
      tests(xs, set, sides, op),
    ),
  );

/** logTests is a check for a logarithmic inequality at numbers that make the argument a power of the base, so that the logarithm is a
 * whole number, and, when the domain bounds the answer, at the edge of the domain. */
function logTests(es: readonly number[], x: (e: number) => Q, set: RealSet, c: number, op: Op, edge?: Q): Text {
  const parts = es.map((e) => say(`x = ${x(e).toLatex()}`, member(set, x(e)), isEnd(set, x(e)), Q.of(e), op, Q.of(c)));
  const last = edge
    ? [
        t(
          `The endpoint $x = ${edge.toLatex()}$ makes the argument $0$, where the logarithm is not defined, so it is left out.`,
          `端点 $x = ${edge.toLatex()}$ 使真数为 $0$，对数在那里没有意义，所以它不包含在内。`,
        ),
      ]
    : [];
  return checked(
    join(
      t(
        "Substitute numbers that make the argument a power of the base, so that the logarithm is a whole number. ",
        "代入使真数为底数的幂的值，这样对数是整数。",
      ),
      sayAll([...parts, ...last]),
    ),
  );
}

/** signTests is a check that substitutes numbers and reads the sign of the left side from the signs of its factors, for an
 * inequality with $0$ on the right whose factors cannot all be evaluated exactly. Each item gives the number, the product as it
 * is evaluated, and its sign. */
function signTests(items: readonly { readonly x: Q; readonly work: string; readonly sign: number }[], set: RealSet, op: Op): Text {
  const parts = items.map(({ x, work, sign }) => {
    const ok = holds(Q.of(sign), op, Q.zero);
    const end = isEnd(set, x);
    const role = end
      ? t("The endpoint", "端点")
      : member(set, x)
        ? t("A number in the solution", "解集内的数")
        : t("A number outside the solution", "解集外的数");
    const word = sign > 0 ? t("positive", "正") : sign < 0 ? t("negative", "负") : t("zero", "零");
    return t(
      `${role.en}, $x = ${x.toLatex()}$, makes the left side $${work}$. This is ${word.en}, so the inequality ${ok ? "holds" : "fails"}${end ? (ok ? " and it is included" : " and it is left out") : ""}.`,
      `${role["zh-CN"]} $x = ${x.toLatex()}$ 使左边为 $${work}$。结果${sign === 0 ? "等于零" : `为${word["zh-CN"]}`}，所以不等式${ok ? "成立" : "不成立"}${end ? (ok ? "，它包含在内" : "，它不包含在内") : ""}。`,
    );
  });
  return checked(join(t("Substitute numbers into the original inequality. ", "把数代入原不等式。"), sayAll(parts)));
}

/** rootTests is a check for a square root against another side: each number makes the radicand the perfect square m², so the root is m. */
function rootTests(items: readonly { readonly x: Q; readonly m: number }[], set: RealSet, right: (x: Q) => Q, op: Op): Text {
  const xs = items.map((i) => i.x).filter((x, i, all) => all.findIndex((y) => y.eq(x)) === i);
  const root = (x: Q) => Q.of(items.find((i) => i.x.eq(x))!.m);
  return checked(
    join(
      t(
        "Substitute numbers that make the radicand a perfect square, so that the square root is exact. ",
        "代入使被开方数为完全平方数的值，这样平方根是精确的。",
      ),
      tests(xs, set, (x) => [root(x), right(x)], op),
    ),
  );
}

/** endpoints lists the finite endpoints of the intervals of a set. */
const endpoints = (set: RealSet): Q[] => set.flatMap((i) => [i.lo, i.hi]).filter((x): x is Q => x !== undefined);

/**
 * quotientTests is a check for an inequality with fractions: it substitutes a number in the solution, one outside it and every
 * endpoint, and says of each zero of a denominator that it is left out.
 */
function quotientTests(set: RealSet, poles: readonly Q[], sides: (x: Q) => readonly [Q, Q], op: Op): Text {
  const xs = [...picks(set), ...endpoints(set), ...poles]
    .filter((x, i, all) => all.findIndex((y) => y.eq(x)) === i)
    .sort((p, q) => p.cmp(q));
  const parts = xs.map((x) => {
    if (!poles.some((p) => p.eq(x))) {
      const [l, r] = sides(x);
      return say(`x = ${x.toLatex()}`, member(set, x), isEnd(set, x), l, op, r);
    }
    const end = isEnd(set, x);
    return t(
      `${end ? "The endpoint" : "The number"} $x = ${x.toLatex()}$ makes a denominator $0$, so the inequality is not defined there and it is left out.`,
      `${end ? "端点" : "数"} $x = ${x.toLatex()}$ 使分母为 $0$，不等式在那里没有意义，所以它不包含在内。`,
    );
  });
  return checked(join(t("Substitute numbers into the original inequality. ", "把数代入原不等式。"), sayAll(parts)));
}

/** qx turns a polynomial with integer coefficients, from the highest power down, into a function of a rational x. */
const qx =
  (...cs: readonly number[]) =>
  (x: Q): Q =>
    cs.reduce((acc, c) => acc.mul(x).add(Q.of(c)), Q.zero);

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

/** critWords names the critical points of a chart: the zeros and, for a quotient, the points where it is not defined. */
function critWords(fs: readonly Factor[]): Text {
  const zeros = fs.filter((f) => f.root && !f.pole).map((f) => `$${f.root!.toLatex()}$`);
  const poles = fs.filter((f) => f.root && f.pole).map((f) => `$${f.root!.toLatex()}$`);
  const z = listed([...new Set(zeros)]);
  const p = listed([...new Set(poles)]);
  if (zeros.length === 0) {
    return t(`The expression is never zero, and it is not defined at ${p.en}.`, `表达式不会为零，在 ${p["zh-CN"]} 处无定义。`);
  }
  return t(
    `The expression is zero at ${z.en}${poles.length > 0 ? ` and not defined at ${p.en}` : ""}.`,
    `表达式在 ${z["zh-CN"]} 处为零${poles.length > 0 ? `，在 ${p["zh-CN"]} 处无定义` : ""}。`,
  );
}

/**
 * chartSolution explains, step by step, a solution read from a sign table: lead, when given, is the work that brings one side to
 * zero, and check closes the solution.
 */
function chartSolution(k: Coefficient, fs: readonly Factor[], name: string, op: Op, set: RealSet, lead?: Text, check?: Text): Text {
  const w = critWords(fs);
  const table = chartTable(k, fs, name);
  const hasPole = fs.some((f) => f.pole);
  const n = lead ? 1 : 0;
  const en = [
    ...(lead ? [`${label(1, "Bring one side to zero", "使一边为零").en}${lead.en.trimEnd()}`] : []),
    `${label(n + 1, "Find the critical points", "找出临界点").en}${w.en}`,
    `${label(n + 2, "Build a sign table", "列符号表").en}Test the sign on each interval:\n\n${table}`,
    `${label(n + 3, "Read off the solution", "写出解集").en}We need $${name} ${opL[op]} 0$${strict(op) ? "" : hasPole ? ", so the zeros are included but the excluded values are not" : ", so the zeros are included"}. The solution is $${setL(set)}$.`,
  ];
  const zh = [
    ...(lead ? [`${label(1, "Bring one side to zero", "使一边为零")["zh-CN"]}${lead["zh-CN"].trimEnd()}`] : []),
    `${label(n + 1, "Find the critical points", "找出临界点")["zh-CN"]}${w["zh-CN"]}`,
    `${label(n + 2, "Build a sign table", "列符号表")["zh-CN"]}检验每个区间上的符号：\n\n${table}`,
    `${label(n + 3, "Read off the solution", "写出解集")["zh-CN"]}要求 $${name} ${opL[op]} 0$${strict(op) ? "" : hasPole ? "，所以包含零点，但不包含使表达式无定义的值" : "，所以包含零点"}。解集是 $${setL(set)}$。`,
  ];
  const c = check ?? t("", "");
  return t(en.join("\n\n") + c.en, zh.join("\n\n") + c["zh-CN"]);
}

// Figures.

const view: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
const polyView: PlaneView = { xMin: -6, xMax: 6, yMin: -8, yMax: 8 };

/** minus writes a number for alt text, with a true minus sign. */
const minus = (n: number | Q) => (n instanceof Q ? n.toLatex() : String(n)).replace("-", "−");

/** signFigure draws y = f(x) with the parts above the x-axis highlighted, the parts below dashed, and the roots marked. */
function signFigure(f: (x: number) => number, roots: readonly number[], en: string, zh: string): Figure {
  const cuts = [polyView.xMin, ...roots, polyView.xMax];
  const marks: PlaneMark[] = cuts.slice(0, -1).map((from, i) => {
    const to = cuts[i + 1]!;
    const above = f((from + to) / 2) > 0;
    return { kind: "curve", f, from, to, accent: above, dashed: !above };
  });
  for (const r of roots) marks.push({ kind: "point", at: [r, 0] });
  return { svg: plane(polyView, marks), alt: t(en, zh) };
}

/** quadraticSignFigure shows where y = x² − x − 6 is above and below the x-axis. */
const quadraticSignFigure = signFigure(
  (x) => x * x - x - 6,
  [-2, 3],
  "The graph of y = x² − x − 6, an upward parabola crossing the x-axis at −2 and 3. It lies above the axis to the left of −2 and to the right of 3, drawn solid and highlighted, and below the axis between them, drawn dashed.",
  "y = x² − x − 6 的图象：一条开口向上、与 x 轴交于 −2 和 3 的抛物线。它在 −2 左侧和 3 右侧位于 x 轴上方（实线、突出显示），在两者之间位于 x 轴下方（虚线）。",
);

/** cubicSignFigure shows where y = x³ − 4x is above and below the x-axis. */
const cubicSignFigure = signFigure(
  (x) => x ** 3 - 4 * x,
  [-2, 0, 2],
  "The graph of y = x³ − 4x, crossing the x-axis at −2, 0 and 2. It lies above the axis between −2 and 0 and to the right of 2, drawn solid and highlighted, and below the axis to the left of −2 and between 0 and 2, drawn dashed.",
  "y = x³ − 4x 的图象：与 x 轴交于 −2、0 和 2。它在 −2 与 0 之间以及 2 的右侧位于 x 轴上方（实线、突出显示），在 −2 左侧以及 0 与 2 之间位于 x 轴下方（虚线）。",
);

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
  intro: t(
    `You can solve $x^{2} = 16$ by taking square roots, which gives $x = 4$ or $x = -4$, and you can write an *or* inequality such as "$x < -4$ or $x > 4$" as a union of intervals. A quadratic inequality asks where a square is above or below a number, as when an area or a distance must stay within a limit. The square roots of the number mark the boundary, and the two signs give two sides of it.

Solve $x^{2} > 16$. The boundary is where $x^{2} = 16$, at $x = -4$ and $x = 4$. A number farther than $4$ from $0$ has a square larger than $16$, and a number closer to $0$ has a smaller one:

$$x^{2} > 16 \\iff |x| > 4 \\iff x < -4 \\text{ or } x > 4$$

The solution is $(-\\infty, -4) \\cup (4, \\infty)$. For instance, $(-5)^{2} = 25$ is larger than $16$, while $3^{2} = 9$ is not.`,
    `你会用开平方解 $x^{2} = 16$，得到 $x = 4$ 或 $x = -4$；也会把“$x < -4$ 或 $x > 4$”这样的“或”不等式写成区间的并集。二次不等式问的是：平方什么时候大于或小于一个数，比如面积或距离必须控制在某个限度以内。这个数的平方根划出边界，正负两个符号给出边界的两侧。

解 $x^{2} > 16$。边界是 $x^{2} = 16$ 的地方，即 $x = -4$ 和 $x = 4$。与 $0$ 的距离大于 $4$ 的数，平方大于 $16$；离 $0$ 更近的数，平方更小：

$$x^{2} > 16 \\iff |x| > 4 \\iff x < -4 \\text{ 或 } x > 4$$

解集是 $(-\\infty, -4) \\cup (4, \\infty)$。例如 $(-5)^{2} = 25$ 大于 $16$，而 $3^{2} = 9$ 不大于 $16$。`,
  ),
  knowledgePoints: [
    {
      id: "squares-against-a-number",
      title: t("Comparing a square with a number", "平方与一个数比较"),
      explanation: t(
        "Since $x^{2} = |x|^{2}$, comparing $x^{2}$ with $9$ is comparing $|x|$ with $3$:\n\n- $x^{2} < 9 \\iff |x| < 3 \\iff -3 < x < 3$, the interval $(-3, 3)$;\n- $x^{2} \\ge 9 \\iff |x| \\ge 3 \\iff x \\le -3$ or $x \\ge 3$, the set $(-\\infty, -3] \\cup [3, \\infty)$.\n\n> **Watch out.** Writing only $x < 3$ for $x^{2} < 9$ forgets the negative side: $x = -5$ satisfies $x < 3$, but $(-5)^{2} = 25$ is not less than $9$.",
        "因为 $x^{2} = |x|^{2}$，把 $x^{2}$ 与 $9$ 比较，就是把 $|x|$ 与 $3$ 比较：\n\n- $x^{2} < 9 \\iff |x| < 3 \\iff -3 < x < 3$，即区间 $(-3, 3)$；\n- $x^{2} \\ge 9 \\iff |x| \\ge 3 \\iff x \\le -3$ 或 $x \\ge 3$，即 $(-\\infty, -3] \\cup [3, \\infty)$。\n\n> **注意。** 把 $x^{2} < 9$ 只写成 $x < 3$，就漏掉了负的一侧：$x = -5$ 满足 $x < 3$，但 $(-5)^{2} = 25$ 并不小于 $9$。",
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
          solution: join(
            label(1, "Take square roots", "开平方"),
            t(
              `Since $\\sqrt{${k * k}} = ${k}$ and $x^{2} = |x|^{2}$,${disp(`x^{2} ${opL[op]} ${k * k} \\iff |x| ${opL[op]} ${k}`)}`,
              `因为 $\\sqrt{${k * k}} = ${k}$，且 $x^{2} = |x|^{2}$，所以${disp(`x^{2} ${opL[op]} ${k * k} \\iff |x| ${opL[op]} ${k}`)}`,
            ),
            para,
            label(2, "Read off the solution", "写出解集"),
            t(
              `${above(op) ? `The distance from $x$ to $0$ is ${strict(op) ? "more than" : "at least"} $${k}$, on either side of $0$` : `The number $x$ lies between $-${k}$ and $${k}$`}. ${ends(op).en} The solution is $${setL(set)}$.`,
              `${above(op) ? `$x$ 在 $0$ 的两侧，且与 $0$ 的距离${strict(op) ? "大于" : "至少为"} $${k}$` : `$x$ 在 $-${k}$ 与 $${k}$ 之间`}。${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`,
            ),
            substituted(picks(set), set, (x) => [x.mul(x), Q.of(k * k)], op),
          ),
        });
      },
    },
    {
      id: "isolating-the-square",
      title: t("Isolating the square first", "先把平方项单独留在一边"),
      explanation: t(
        "Isolate $x^{2}$ before taking square roots. Dividing by a negative number reverses the inequality:\n\n$$-2x^{2} + 5 > -45 \\implies -2x^{2} > -50 \\implies x^{2} < 25 \\implies -5 < x < 5$$\n\nThe solution is $(-5, 5)$.\n\n> **Watch out.** Take square roots only once $x^{2}$ is alone. Forgetting to reverse the inequality when dividing by $-2$ gives $x^{2} > 25$, and with it the numbers outside $(-5, 5)$ instead of inside.",
        "开平方之前先把 $x^{2}$ 单独留在一边。除以负数时不等号要反向：\n\n$$-2x^{2} + 5 > -45 \\implies -2x^{2} > -50 \\implies x^{2} < 25 \\implies -5 < x < 5$$\n\n解集是 $(-5, 5)$。\n\n> **注意。** 要等 $x^{2}$ 单独在一边后才开平方。除以 $-2$ 时忘记把不等号反向，会得到 $x^{2} > 25$，解出的就成了 $(-5, 5)$ 以外的数，而不是以内的数。",
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
        ];
        const move =
          c === 0
            ? t("", "")
            : c > 0
              ? t(`Subtract $${c}$ from both sides. `, `两边同减 $${c}$。`)
              : t(`Add $${-c}$ to both sides. `, `两边同加 $${-c}$。`);
        const divide =
          a === 1
            ? t("", "")
            : a < 0
              ? t(`Divide by $${a}$; dividing by a negative number reverses the inequality.`, `两边同除以 $${a}$；除以负数时不等号反向。`)
              : t(`Divide by $${a}$.`, `两边同除以 $${a}$。`);
        return intervalProblem({
          prompt: solvePrompt(`${poly([a, "x^{2}"], [c, ""])} ${opL[op]} ${d}`),
          set,
          form: "interval",
          wrong: [absSet(0, k, op), complement(set), ray(op2, k)],
          solution: join(
            label(1, "Isolate the square", "把平方项单独留在一边"),
            lines.length === 0
              ? t(`The square is already alone: $x^{2} ${opL[op]} ${k * k}$.`, `平方项已经单独在一边：$x^{2} ${opL[op]} ${k * k}$。`)
              : join(move, divide, t(disp(...lines), disp(...lines))),
            para,
            label(2, "Take square roots", "开平方"),
            t(
              `Since $\\sqrt{${k * k}} = ${k}$,${disp(`|x| ${opL[op2]} ${k}`)}\n\n${ends(op2).en} The solution is $${setL(set)}$.`,
              `因为 $\\sqrt{${k * k}} = ${k}$，所以${disp(`|x| ${opL[op2]} ${k}`)}\n\n${ends(op2)["zh-CN"]}解集是 $${setL(set)}$。`,
            ),
            substituted(picks(set), set, (x) => [Q.of(a).mul(x).mul(x).add(Q.of(c)), Q.of(d)], op),
          ),
        });
      },
    },
    {
      id: "shifted-squares-and-special-cases",
      title: t("Shifted squares and special cases", "平移的平方与特殊情形"),
      explanation: t(
        "For $(x - 2)^{2} \\le 16$, take square roots: $|x - 2| \\le 4$, so $-4 \\le x - 2 \\le 4$ and $-2 \\le x \\le 6$, the interval $[-2, 6]$.\n\nA square is never negative, which settles some inequalities at once:\n\n- $(x - 2)^{2} < -3$ has no solution, $\\varnothing$; $(x - 2)^{2} \\ge -3$ holds for all $x$, $\\mathbb{R}$;\n- $(x - 2)^{2} \\le 0$ holds only where the square is $0$: $\\{2\\}$;\n- $(x - 2)^{2} > 0$ holds everywhere except $x = 2$: $(-\\infty, 2) \\cup (2, \\infty)$.\n\n> **Watch out.** Before taking square roots, look at the sign of the number on the right. $(x - 2)^{2} < -3$ is not $|x - 2| < \\sqrt{-3}$, since $-3$ has no real square root; a square can never be below a negative number.",
        "对 $(x - 2)^{2} \\le 16$ 开平方：$|x - 2| \\le 4$，所以 $-4 \\le x - 2 \\le 4$，即 $-2 \\le x \\le 6$，区间 $[-2, 6]$。\n\n平方永远不是负数，有些不等式可以直接判断：\n\n- $(x - 2)^{2} < -3$ 无解，$\\varnothing$；$(x - 2)^{2} \\ge -3$ 对所有 $x$ 成立，$\\mathbb{R}$；\n- $(x - 2)^{2} \\le 0$ 只在平方为 $0$ 时成立：$\\{2\\}$；\n- $(x - 2)^{2} > 0$ 除 $x = 2$ 外处处成立：$(-\\infty, 2) \\cup (2, \\infty)$。\n\n> **注意。** 开平方之前，先看右边的数的符号。$(x - 2)^{2} < -3$ 不能写成 $|x - 2| < \\sqrt{-3}$，因为 $-3$ 没有实数平方根；平方永远不会小于一个负数。",
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
          const sqAt = (x: Q): readonly [Q, Q] => [x.sub(Q.of(h)).pow(2), Q.of(rhs)];
          return intervalProblem({
            prompt: solvePrompt(`${sq} ${opL[op]} ${rhs}`),
            set,
            form: "interval",
            wrong: [complement(set), realLine, [], union(point(h))],
            solution: join(
              label(1, `Compare the square with $${rhs}$`, `把平方与 $${rhs}$ 比较`),
              why,
              para,
              label(2, "Write the solution", "写出解集"),
              t(`The solution is $${setL(set)}$.`, `解集是 $${setL(set)}$。`),
              substituted(picks(set, { hint: Q.of(h) }), set, sqAt, op),
            ),
          });
        }
        const m = rng.int(1, 6);
        const set = absSet(h, m, op);
        const x = linear(1, -h);
        const split = above(op)
          ? `${x} ${opL[reversed[op]]} -${m} \\text{ or } ${x} ${opL[op]} ${m}`
          : `-${m} ${opL[op]} ${x} ${opL[op]} ${m}`;
        const solved = above(op)
          ? `x ${opL[reversed[op]]} ${h - m} \\text{ or } x ${opL[op]} ${h + m}`
          : `${h - m} ${opL[op]} x ${opL[op]} ${h + m}`;
        const shift = h > 0 ? t(`add $${h}$`, `加上 $${h}$`) : t(`subtract $${-h}$`, `减去 $${-h}$`);
        return intervalProblem({
          prompt: solvePrompt(`${sq} ${opL[op]} ${m * m}`),
          set,
          form: "interval",
          wrong: [absSet(-h, m, op), absSet(h, m * m, op), complement(set)],
          solution: join(
            label(1, "Take square roots", "开平方"),
            t(
              `Since $\\sqrt{${m * m}} = ${m}$,${disp(`|${x}| ${opL[op]} ${m}`)}`,
              `因为 $\\sqrt{${m * m}} = ${m}$，所以${disp(`|${x}| ${opL[op]} ${m}`)}`,
            ),
            para,
            label(2, "Solve for $x$", "解出 $x$"),
            t(
              `${above(op) ? "Split the absolute value into two inequalities" : "Write the absolute value as a double inequality"}, then ${shift.en} on every side:${disp(split, solved)}\n\nThe solution is $${setL(set)}$.`,
              `${above(op) ? "把绝对值不等式拆成两个不等式" : "把绝对值不等式写成连不等式"}，再在各边${shift["zh-CN"]}：${disp(split.replace("\\text{ or }", "\\text{ 或 }"), solved.replace("\\text{ or }", "\\text{ 或 }"))}\n\n解集是 $${setL(set)}$。`,
            ),
            substituted(picks(set), set, (v) => [v.sub(Q.of(h)).pow(2), Q.of(m * m)], op),
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

/** vertexCheck checks a solution read from a graph at the vertex, which lies halfway between the meeting points. */
function vertexCheck(p: Parabola, op: Op, set: RealSet, level: Text, rhs: string): Text {
  const up = p.a.sign() > 0;
  const m = Q.of(p.r + p.s, 2);
  const kept = member(set, m);
  const rel = `$f(x) ${opL[op]} ${rhs}$`;
  return checked(
    t(
      `The vertex is halfway between $x = ${p.r}$ and $x = ${p.s}$, at $x = ${m.toLatex()}$. The parabola opens ${up ? "upward" : "downward"}, so the vertex is its ${up ? "lowest" : "highest"} point and lies ${up ? "below" : "above"} ${level.en}. The numbers between the meeting points, such as $x = ${m.toLatex()}$, therefore give $f(x) ${up ? "<" : ">"} ${rhs}$, and ${kept ? "they are in the solution, as" : "they are left out of the solution, as"} ${rel} requires.`,
      `顶点在 $x = ${p.r}$ 与 $x = ${p.s}$ 的正中间，即 $x = ${m.toLatex()}$。抛物线开口向${up ? "上" : "下"}，所以顶点是它的最${up ? "低" : "高"}点，位于${level["zh-CN"]}${up ? "下方" : "上方"}。因此两交点之间的数（例如 $x = ${m.toLatex()}$）使 $f(x) ${up ? "<" : ">"} ${rhs}$；按 ${rel} 的要求，它们${kept ? "属于" : "不属于"}解集，与答案一致。`,
    ),
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
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSA.REI.D.11"],
  intro: t(
    `You can find the roots of a quadratic function, which are the $x$-intercepts of its graph, and you can solve $x^{2} < 9$ by taking square roots. A graph shows at a glance where a function is positive, negative or above some level, as when the height of a thrown ball must stay above a fence. Reading an inequality from a graph turns a question about numbers into a question about which part of the curve lies above or below a line.

Take $f(x) = -x^{2} + 2x + 3$, which factors as

$$f(x) = -(x + 1)(x - 3)$$

Its graph is a parabola that opens downward and crosses the $x$-axis at $-1$ and $3$. Between the intercepts it is above the axis, so $f(x) \\ge 0$ on $[-1, 3]$; the intercepts count, since $f$ is $0$ there. For example $f(0) = 3$ is positive, while $f(4) = -5$ is not.`,
    `你会求二次函数的根，也就是它的图象与 $x$ 轴交点的横坐标；也会用开平方解 $x^{2} < 9$。图象能让人一眼看出函数在哪里为正、为负或高于某个高度，比如抛出的球必须一直高于一道围栏。由图象解不等式，就是把关于数的问题变成“曲线的哪一部分在某条直线上方或下方”的问题。

取 $f(x) = -x^{2} + 2x + 3$，它可以分解为

$$f(x) = -(x + 1)(x - 3)$$

它的图象是开口向下的抛物线，与 $x$ 轴交于 $-1$ 和 $3$。在两个交点之间，图象位于 $x$ 轴上方，所以 $f(x) \\ge 0$ 的解是 $[-1, 3]$；交点处 $f$ 为 $0$，也要算上。例如 $f(0) = 3$ 是正数，而 $f(4) = -5$ 不是。`,
  ),
  knowledgePoints: [
    {
      id: "comparing-with-zero",
      title: t("Where the graph is above or below the x-axis", "图象在 x 轴上方或下方的部分"),
      explanation: t(
        "$f(x) > 0$ where the graph of $y = f(x)$ is **above** the $x$-axis, and $f(x) < 0$ where it is **below**. The graph changes sides only at its $x$-intercepts.\n\nThe parabola shown opens upward and crosses the $x$-axis at $-1$ and $3$. It is below the axis between them, so $f(x) < 0$ on $(-1, 3)$, and above it outside, so $f(x) > 0$ on $(-\\infty, -1) \\cup (3, \\infty)$. For $f(x) \\le 0$ the intercepts count too, since $f$ is $0$ there: $[-1, 3]$.\n\n> **Watch out.** The answer is a set of $x$-values, read along the $x$-axis, not the heights of the graph. Include the intercepts only when the inequality allows equality: for $f(x) < 0$ the answer is $(-1, 3)$, not $[-1, 3]$.",
        "当 $y = f(x)$ 的图象在 $x$ 轴**上方**时 $f(x) > 0$，在**下方**时 $f(x) < 0$。图象只在与 $x$ 轴的交点处换到另一侧。\n\n图中的抛物线开口向上，与 $x$ 轴交于 $-1$ 和 $3$。它在两交点之间位于 $x$ 轴下方，所以 $f(x) < 0$ 的解是 $(-1, 3)$；在两侧位于上方，所以 $f(x) > 0$ 的解是 $(-\\infty, -1) \\cup (3, \\infty)$。对 $f(x) \\le 0$，交点处 $f$ 为 $0$，也要算上：$[-1, 3]$。\n\n> **注意。** 答案是一组 $x$ 的值，要沿 $x$ 轴读，而不是读图象的高度。只有不等式含等号时才包含交点：$f(x) < 0$ 的解是 $(-1, 3)$，不是 $[-1, 3]$。",
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
            solution: join(
              label(1, "Find the intercepts", "找出交点"),
              t(
                `The graph crosses the $x$-axis at $x = ${p.r}$ and $x = ${p.s}$. These split the axis into three parts.`,
                `图象与 $x$ 轴交于 $x = ${p.r}$ 和 $x = ${p.s}$，它们把 $x$ 轴分成三段。`,
              ),
              para,
              label(2, "See which side the graph is on", "看图象在哪一侧"),
              t(`${side.en} ${ends(op).en} The solution is $${setL(set)}$.`, `${side["zh-CN"]}${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`),
              vertexCheck(p, op, set, t("the $x$-axis", "$x$ 轴"), "0"),
            ),
          }),
          figure: parabolaFigure(p),
        };
      },
    },
    {
      id: "comparing-with-a-line",
      figure: precalculusDrawings["solving-quadratic-inequalities-from-graphs#comparing-with-a-line"],
      title: t("Comparing with a horizontal line", "与水平直线比较"),
      explanation: t(
        "To solve $f(x) \\ge k$ from a graph, draw the line $y = k$: the solutions are the $x$-values where the parabola is on or above the line. They are bounded by the $x$-coordinates of the points where the two graphs meet.\n\nIf a downward parabola meets $y = 2$ at $(-3, 2)$ and $(1, 2)$, it is above the line between them, so $f(x) \\ge 2$ on $[-3, 1]$ and $f(x) < 2$ on $(-\\infty, -3) \\cup (1, \\infty)$.\n\n> **Watch out.** The boundaries are where the parabola meets the line $y = k$, not where it crosses the $x$-axis. Reading the $x$-intercepts solves $f(x) \\ge 0$ instead of $f(x) \\ge k$.",
        "要由图象解 $f(x) \\ge k$，画出直线 $y = k$：解就是抛物线在这条直线上或上方的那些 $x$。它们以两图象交点的横坐标为界。\n\n如果一条开口向下的抛物线与 $y = 2$ 交于 $(-3, 2)$ 和 $(1, 2)$，它在两点之间位于直线上方，所以 $f(x) \\ge 2$ 的解是 $[-3, 1]$，$f(x) < 2$ 的解是 $(-\\infty, -3) \\cup (1, \\infty)$。\n\n> **注意。** 边界是抛物线与直线 $y = k$ 的交点，而不是抛物线与 $x$ 轴的交点。读成与 $x$ 轴的交点，解的就是 $f(x) \\ge 0$，而不是 $f(x) \\ge k$。",
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
            solution: join(
              label(1, "Find where the graphs meet", "找出两图象的交点"),
              t(
                `The parabola meets the line $y = ${p.k}$ at $x = ${p.r}$ and $x = ${p.s}$. These are the boundaries of the solution.`,
                `抛物线与直线 $y = ${p.k}$ 交于 $x = ${p.r}$ 和 $x = ${p.s}$，它们是解集的边界。`,
              ),
              para,
              label(2, "See which side the parabola is on", "看抛物线在哪一侧"),
              t(`${side.en} ${ends(op).en} The solution is $${setL(set)}$.`, `${side["zh-CN"]}${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`),
              vertexCheck(p, op, set, t(`the line $y = ${p.k}$`, `直线 $y = ${p.k}$ 的`), String(p.k)),
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
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.4"],
  intro: t(
    `You can read the solution of a quadratic inequality from a drawn parabola, and you can factor quadratics to find their roots. Usually no graph is given, and drawing one carefully is slow. The roots and the sign of the coefficient of $x^{2}$ are all you need: they tell you where the parabola crosses the $x$-axis and which way it opens, which is enough to picture where it is above or below the axis.

Solve $x^{2} - 4x - 5 \\le 0$. Factor:

$$x^{2} - 4x - 5 = (x + 1)(x - 5)$$

The roots are $-1$ and $5$. The coefficient of $x^{2}$ is $1$, which is positive, so the parabola opens upward and is on or below the axis between the roots. The solution is $[-1, 5]$. For instance $x = 0$ gives $-5 \\le 0$, while $x = 6$ gives $7$, which is not.`,
    `你会从画出的抛物线读出二次不等式的解，也会通过因式分解求二次式的根。通常题目不给图象，而仔细画一个图又很慢。其实只需要根和 $x^{2}$ 系数的符号：它们说明抛物线在哪里穿过 $x$ 轴、开口朝哪边，足以想象出它在哪里位于 $x$ 轴上方或下方。

解 $x^{2} - 4x - 5 \\le 0$。因式分解：

$$x^{2} - 4x - 5 = (x + 1)(x - 5)$$

两根是 $-1$ 和 $5$。$x^{2}$ 的系数是 $1$，为正，所以抛物线开口向上，在两根之间位于 $x$ 轴上或下方。解集是 $[-1, 5]$。例如 $x = 0$ 时得 $-5 \\le 0$，而 $x = 6$ 时得 $7$，不满足。`,
  ),
  knowledgePoints: [
    {
      id: "monic-quadratic-inequalities",
      title: t("Factoring and picturing the parabola", "因式分解并想象抛物线"),
      explanation: t(
        "To solve $x^{2} - x - 6 > 0$ without a graph, factor to find the roots, then picture the graph:\n\n$$x^{2} - x - 6 = (x + 2)(x - 3)$$\n\nThe roots are $-2$ and $3$. The coefficient of $x^{2}$ is positive, so the parabola opens upward: it is below the $x$-axis between the roots and above it outside them. So $x^{2} - x - 6 > 0$ on $(-\\infty, -2) \\cup (3, \\infty)$, and $x^{2} - x - 6 \\le 0$ on $[-2, 3]$.\n\n> **Watch out.** The roots of $(x + 2)(x - 3)$ are $-2$ and $3$, the opposites of the numbers in the factors. Reading them as $2$ and $-3$ moves the whole solution to the wrong place.",
        "不画图也能解 $x^{2} - x - 6 > 0$：先因式分解求根，再想象图象：\n\n$$x^{2} - x - 6 = (x + 2)(x - 3)$$\n\n两根是 $-2$ 和 $3$。$x^{2}$ 的系数为正，抛物线开口向上：在两根之间位于 $x$ 轴下方，在两根之外位于上方。所以 $x^{2} - x - 6 > 0$ 的解是 $(-\\infty, -2) \\cup (3, \\infty)$，$x^{2} - x - 6 \\le 0$ 的解是 $[-2, 3]$。\n\n> **注意。** $(x + 2)(x - 3)$ 的根是 $-2$ 和 $3$，与因式中的数正好相反。把它们读成 $2$ 和 $-3$，整个解集就放错了位置。",
      ),
      figure: quadraticSignFigure,
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
          solution: join(
            label(1, "Factor", "因式分解"),
            t(
              `Find two numbers with sum $${-(r + s)}$ and product $${r * s}$:${disp(`${f} = ${product(1, fs)}`)}`,
              `找两个和为 $${-(r + s)}$、积为 $${r * s}$ 的数：${disp(`${f} = ${product(1, fs)}`)}`,
            ),
            para,
            label(2, "Picture the parabola", "想象抛物线"),
            graphicalWords(1, Q.of(r), Q.of(s), op, set),
            substituted(picks(set), set, (x) => [qx(1, -(r + s), r * s)(x), Q.zero], op),
          ),
        });
      },
    },
    {
      id: "quadratic-inequalities-with-leading-coefficients",
      figure:
        precalculusDrawings["solving-quadratic-inequalities-using-the-graphical-method#quadratic-inequalities-with-leading-coefficients"],
      title: t("Leading coefficients", "首项系数不为 1"),
      explanation: t(
        "The roots may be fractions. For $2x^{2} + x - 6 \\le 0$:\n\n$$2x^{2} + x - 6 = (2x - 3)(x + 2)$$\n\nThe roots are $-2$ and $\\frac{3}{2}$, and the parabola opens upward, so it is on or below the $x$-axis on $\\left[-2, \\frac{3}{2}\\right]$.\n\nWhen the coefficient of $x^{2}$ is negative, the parabola opens downward, and the roles swap: $-2x^{2} - x + 6 \\le 0$ on $(-\\infty, -2] \\cup \\left[\\frac{3}{2}, \\infty\\right)$.\n\n> **Watch out.** A root of $2x - 3$ is $\\frac{3}{2}$, found by solving $2x - 3 = 0$, not $3$. And look at the sign in front: a negative coefficient of $x^{2}$ turns the parabola over, so between and outside the roots swap.",
        "根可以是分数。对 $2x^{2} + x - 6 \\le 0$：\n\n$$2x^{2} + x - 6 = (2x - 3)(x + 2)$$\n\n两根是 $-2$ 和 $\\frac{3}{2}$，抛物线开口向上，所以在 $\\left[-2, \\frac{3}{2}\\right]$ 上位于 $x$ 轴上或下方。\n\n$x^{2}$ 的系数为负时，抛物线开口向下，两种情形互换：$-2x^{2} - x + 6 \\le 0$ 的解是 $(-\\infty, -2] \\cup \\left[\\frac{3}{2}, \\infty\\right)$。\n\n> **注意。** $2x - 3$ 的根是解 $2x - 3 = 0$ 得到的 $\\frac{3}{2}$，不是 $3$。还要看前面的符号：$x^{2}$ 的系数为负，抛物线就倒过来，两根之间和两根之外正好互换。",
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
            solution: join(
              label(1, "Factor", "因式分解"),
              t(
                `${k < 0 ? "Take out the factor $-1$, then factor what is left" : "Factor the quadratic"}:${disp(`${f} = ${product(k, fs)}`)}\n\nSetting each factor to $0$ gives the roots.`,
                `${k < 0 ? "先提出因数 $-1$，再分解剩下的部分" : "把二次式因式分解"}：${disp(`${f} = ${product(k, fs)}`)}\n\n令每个因式为 $0$，就得到两根。`,
              ),
              para,
              label(2, "Picture the parabola", "想象抛物线"),
              words,
              substituted(picks(set), set, (x) => [qx(k * p1 * p2, k * (p1 * q2 + p2 * q1), k * q1 * q2)(x), Q.zero], op),
            ),
          });
        }
      },
    },
    {
      id: "moving-terms-to-one-side",
      title: t("Moving every term to one side", "把各项移到同一边"),
      explanation: t(
        "Move every term to one side so that the other side is $0$, then factor:\n\n$$x^{2} + 2x \\ge 15 \\implies x^{2} + 2x - 15 \\ge 0 \\implies (x + 5)(x - 3) \\ge 0$$\n\nSo the solution is $(-\\infty, -5] \\cup [3, \\infty)$. If the $x^{2}$ term ends up negative, multiplying by $-1$ makes it positive but reverses the inequality:\n\n$$6 - x^{2} > x \\implies -x^{2} - x + 6 > 0 \\implies x^{2} + x - 6 < 0 \\implies (x + 3)(x - 2) < 0$$\n\nSo the solution is $(-3, 2)$.\n\n> **Watch out.** Factor only once one side is $0$. From $x(x + 2) \\ge 15$ nothing follows about $x$ or $x + 2$ alone; the roots of the product tell you where it equals $0$, not where it equals $15$.",
        "先把各项移到同一边，使另一边为 $0$，再因式分解：\n\n$$x^{2} + 2x \\ge 15 \\implies x^{2} + 2x - 15 \\ge 0 \\implies (x + 5)(x - 3) \\ge 0$$\n\n所以解集是 $(-\\infty, -5] \\cup [3, \\infty)$。如果移项后 $x^{2}$ 项为负，乘以 $-1$ 使它变正，但不等号要反向：\n\n$$6 - x^{2} > x \\implies -x^{2} - x + 6 > 0 \\implies x^{2} + x - 6 < 0 \\implies (x + 3)(x - 2) < 0$$\n\n所以解集是 $(-3, 2)$。\n\n> **注意。** 要等一边为 $0$ 后再因式分解。由 $x(x + 2) \\ge 15$ 推不出关于 $x$ 或 $x + 2$ 单独的结论；乘积的根说明它在哪里等于 $0$，而不是在哪里等于 $15$。",
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
            solution: join(
              label(1, "Bring every term to one side", "把各项移到同一边"),
              t(
                `Move every term to one side${g < 0 ? ", then multiply by $-1$, which reverses the inequality" : ""}, and factor:${disp(...lines)}`,
                `把各项移到同一边${g < 0 ? "，再乘以 $-1$，不等号反向" : ""}，然后因式分解：${disp(...lines)}`,
              ),
              para,
              label(2, "Picture the parabola", "想象抛物线"),
              words,
              substituted(
                picks(set),
                set,
                (x) =>
                  layout === 0 ? [qx(A, B, 0)(x), Q.of(-C)] : layout === 1 ? [qx(A, 0, 0)(x), qx(-B, -C)(x)] : [Q.of(C), qx(-A, -B, 0)(x)],
                op,
              ),
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

/** factorAt is the value of a drawn factor, as it is written, at x. */
const factorAt = (d: DrawnFactor, x: Q) => (d.flip ? Q.of(d.q).sub(Q.of(d.p).mul(x)) : Q.of(d.p).mul(x).sub(Q.of(d.q)));

/** rootFactor is the factor x − r, as a drawn factor. */
const rootFactor = (r: number): DrawnFactor => ({ f: lin(1, -r), plain: lin(1, -r), p: 1, q: r, flip: false });

/** productAt is the value of k times the drawn factors at x. */
const productAt = (k: number, ds: readonly DrawnFactor[], x: Q) => ds.reduce((acc, d) => acc.mul(factorAt(d, x)), Q.of(k));

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
  intro: t(
    `You can solve a factored quadratic inequality by picturing its parabola. That picture is harder to hold in mind once a factor points the other way, such as $3 - x$, or once there are more factors. A sign table puts the same reasoning on paper: each linear factor changes sign only at its root, so one test number in each interval gives the sign of every factor there, and the rule of signs gives the sign of the product.

Solve $(x + 1)(x - 4) \\le 0$. The roots $-1$ and $4$ cut the number line into three intervals; test $-2$, $0$ and $5$:

${chartTable(1, [lin(1, 1), lin(1, -4)], "(x + 1)(x - 4)")}

The product is negative on $(-1, 4)$ and zero at the roots, which $\\le$ allows. The solution is $[-1, 4]$.`,
    `你会通过想象抛物线来解已分解的二次不等式。可一旦有因式方向相反（例如 $3 - x$），或因式更多，这幅图就不容易在脑中想清楚。符号表把同样的推理写在纸上：每个一次因式只在它的根处变号，所以在每个区间里取一个检验数，就知道各因式在那里的符号，再由符号法则得到乘积的符号。

解 $(x + 1)(x - 4) \\le 0$。根 $-1$ 和 $4$ 把数轴分成三个区间；分别检验 $-2$、$0$ 和 $5$：

${chartTable(1, [lin(1, 1), lin(1, -4)], "(x + 1)(x - 4)")}

乘积在 $(-1, 4)$ 上为负，在两根处为零，而 $\\le$ 允许取零。解集是 $[-1, 4]$。`,
  ),
  knowledgePoints: [
    {
      id: "signs-of-a-product",
      figure: precalculusDrawings["solving-quadratic-inequalities-using-the-sign-table-method#signs-of-a-product"],
      title: t("The sign of a product on an interval", "乘积在区间上的符号"),
      explanation: t(
        `A linear factor changes sign only at its root. The roots of $(2x - 1)(3 - x)$ are $\\frac{1}{2}$ and $3$, which cut the number line into three intervals. Pick a test number in each, such as $0$, $1$ and $4$, and record the sign of each factor; the product has the sign given by the rule of signs:${signTableExample}So the product is positive on $\\left(\\frac{1}{2}, 3\\right)$ and negative on the other two intervals.\n\n> **Watch out.** The factor $3 - x$ is positive to the left of $3$, the opposite of $x - 3$. Find each sign with a test number instead of assuming every factor is negative on the left.`,
        `一次因式只在它的根处变号。$(2x - 1)(3 - x)$ 的根是 $\\frac{1}{2}$ 和 $3$，它们把数轴分成三个区间。在每个区间中取一个检验数，例如 $0$、$1$ 和 $4$，记下各因式的符号；乘积的符号由符号法则给出：${signTableExample}所以乘积在 $\\left(\\frac{1}{2}, 3\\right)$ 上为正，在另两个区间上为负。\n\n> **注意。** 因式 $3 - x$ 在 $3$ 的左侧为正，与 $x - 3$ 正好相反。每个符号都要用检验数求出，不要以为每个因式在左侧都是负的。`,
      ),
      generate(rng) {
        const ds = drawFactors(rng, 2);
        const fs = ds.map((d) => d.f);
        const k = rng.pick([1, 1, -1, 2]);
        const c = chart(k, fs);
        const i = rng.int(0, c.cuts.length);
        const name = product(k, fs);
        const positive = c.signs[i]! > 0;
        const span = intervalName(c.cuts, i);
        const neg = c.rows.filter((r) => r[i]! < 0).length + (k < 0 ? 1 : 0);
        const x0 = sample(union(mk(c.cuts[i - 1], c.cuts[i])))!;
        const values = ds.map((d) => paren(factorAt(d, x0)));
        const value = productAt(k, ds, x0);
        const work = `${k === 1 ? "" : `${paren(k)} \\cdot `}${values.join(" \\cdot ")} = ${value.toLatex()}`;
        const sign = positive ? t("positive", "正") : t("negative", "负");
        return withMistakes(
          choiceProblem({
            prompt: t(
              `Is $f(x) = ${name}$ positive or negative on the interval $${span}$?`,
              `$f(x) = ${name}$ 在区间 $${span}$ 上为正还是为负？`,
            ),
            options: signOptions,
            correct: positive ? 0 : 1,
            solution: join(
              label(1, "Find the critical points", "找出临界点"),
              critWords(fs),
              para,
              label(2, "Build a sign table", "列符号表"),
              t(
                `Test one number in each interval:\n\n${chartTable(k, fs, "f(x)")}`,
                `在每个区间里取一个数检验：\n\n${chartTable(k, fs, "f(x)")}`,
              ),
              para,
              label(3, "Read the column", "读出这一列"),
              t(
                `In the column for $${span}$ there ${neg === 1 ? "is" : "are"} $${neg}$ minus ${neg === 1 ? "sign" : "signs"}, an ${neg % 2 === 0 ? "even" : "odd"} number, so the product is ${sign.en} there.`,
                `在 $${span}$ 这一列中有 $${neg}$ 个负号，是${neg % 2 === 0 ? "偶" : "奇"}数个，所以乘积在这里为${sign["zh-CN"]}。`,
              ),
              checked(
                t(
                  `Take $x = ${x0.toLatex()}$, which lies in $${span}$, and multiply the values: $f(${x0.toLatex()}) = ${work}$. The result is ${value.sign() > 0 ? "positive" : "negative"}.`,
                  `取 $${span}$ 中的 $x = ${x0.toLatex()}$，把各值相乘：$f(${x0.toLatex()}) = ${work}$。结果为${value.sign() > 0 ? "正" : "负"}。`,
                ),
              ),
            ),
          }),
          [
            {
              response: positive ? "Negative" : "Positive",
              why: t(
                `The product is negative only when an odd number of its signs are negative; here $${neg}$ ${neg === 1 ? "is" : "are"}, so it is ${sign.en}.`,
                `只有负号个数为奇数时乘积才为负；这里有 $${neg}$ 个负号，所以乘积为${sign["zh-CN"]}。`,
              ),
            },
          ],
        );
      },
    },
    {
      id: "solving-with-a-sign-table",
      title: t("Solving with a sign table", "用符号表解不等式"),
      explanation: t(
        `To solve $(2x - 1)(3 - x) \\ge 0$, build the sign table:${signTableExample}The product is positive on $\\left(\\frac{1}{2}, 3\\right)$ and zero at the roots, which the non-strict $\\ge$ includes. The solution is $\\left[\\frac{1}{2}, 3\\right]$.\n\n> **Watch out.** The table gives the signs on open intervals; the roots are decided by the relation. Add them for $\\ge$ and $\\le$, where the product may be $0$, and leave them out for $>$ and $<$.`,
        `要解 $(2x - 1)(3 - x) \\ge 0$，先列符号表：${signTableExample}乘积在 $\\left(\\frac{1}{2}, 3\\right)$ 上为正，在两根处为零，而非严格的 $\\ge$ 包含零。解集是 $\\left[\\frac{1}{2}, 3\\right]$。\n\n> **注意。** 符号表给出的是开区间上的符号；根要不要算进去，由不等号决定。$\\ge$ 和 $\\le$ 允许乘积为 $0$，要加上根；$>$ 和 $<$ 则不包含根。`,
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
            solution: chartSolution(
              k,
              fs,
              name,
              op,
              set,
              undefined,
              substituted(picks(set), set, (x) => [productAt(k, ds, x), Q.zero], op),
            ),
          });
        }
      },
    },
    {
      id: "products-compared-with-a-number",
      title: t("A product compared with a number", "乘积与非零数比较"),
      explanation: t(
        "The sign table works only when one side is $0$. In $(x - 1)(x - 3) > 8$ the roots $1$ and $3$ tell us nothing: expand, move the $8$ and factor again:\n\n$$x^{2} - 4x + 3 > 8 \\implies x^{2} - 4x - 5 > 0 \\implies (x + 1)(x - 5) > 0$$\n\nSo the solution is $(-\\infty, -1) \\cup (5, \\infty)$.\n\n> **Watch out.** Do not compare each factor with $8$, as in $x - 1 > 8$: a product is not settled by its factors that way. Only a product compared with $0$ can be read from the signs of its factors.",
        "只有一边为 $0$ 时才能用符号表。在 $(x - 1)(x - 3) > 8$ 中，根 $1$ 和 $3$ 没有用处：展开，移走 $8$，再因式分解：\n\n$$x^{2} - 4x + 3 > 8 \\implies x^{2} - 4x - 5 > 0 \\implies (x + 1)(x - 5) > 0$$\n\n所以解集是 $(-\\infty, -1) \\cup (5, \\infty)$。\n\n> **注意。** 不要把每个因式分别与 $8$ 比较，比如写 $x - 1 > 8$：乘积不能这样由因式来定。只有乘积与 $0$ 比较时，才能由各因式的符号读出结果。",
      ),
      generate(rng) {
        for (;;) {
          const [r, s] = distinctPair(rng, -6, 6);
          const p = rng.int(-6, 6);
          const q = r + s - p;
          const k = p * q - r * s;
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
              substituted(picks(set), set, (x) => [x.sub(Q.of(p)).mul(x.sub(Q.of(q))), Q.of(k)], op),
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
    solution: join(
      label(1, "Write the condition", "写出条件"),
      t(
        `The equation has ${conditionText[c].en} exactly when the discriminant is ${discriminantWords[c].en}. Here $a = ${a}$, $b = ${b}$ and $c = ${cTex}$.`,
        `方程${conditionText[c]["zh-CN"]}当且仅当判别式${discriminantWords[c]["zh-CN"]}。这里 $a = ${a}$，$b = ${b}$，$c = ${cTex}$。`,
      ),
      para,
      label(2, "Solve for $k$", "解出 $k$"),
      t(
        `Work out the discriminant and solve the inequality${flip ? `, reversing it when dividing by $${-4 * a}$` : ""}:${disp(...lines)}\n\nThe solution is $${setL(set)}$.`,
        `算出判别式，再解不等式${flip ? `，除以 $${-4 * a}$ 时不等号反向` : ""}：${disp(...lines)}\n\n解集是 $${setL(set)}$。`,
      ),
      discriminantCheck(set, D, qx(-4 * a, b * b - 4 * a * d), dOp),
    ),
  });
}

/** discriminantCheck substitutes values of k into the discriminant D(k), written as dTex, and compares it with 0. */
function discriminantCheck(set: RealSet, dTex: string, d: (k: Q) => Q, op: Op, o: { avoid?: Q; end?: Q } = {}): Text {
  return checked(
    join(
      t(`Substitute values of $k$ into the discriminant $${dTex}$. `, `把 $k$ 的值代入判别式 $${dTex}$。`),
      tests(picks(set, o), set, (k) => [d(k), Q.zero], op, "k"),
    ),
  );
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
    solution: join(
      label(1, "Write the condition", "写出条件"),
      t(
        `The equation has ${conditionText[c].en} exactly when the discriminant is ${discriminantWords[c].en}. Here $a = ${a}$, $b = k$ and $c = ${C}$, so the condition is a quadratic inequality in $k$.`,
        `方程${conditionText[c]["zh-CN"]}当且仅当判别式${discriminantWords[c]["zh-CN"]}。这里 $a = ${a}$，$b = k$，$c = ${C}$，所以条件是关于 $k$ 的二次不等式。`,
      ),
      para,
      label(2, "Solve for $k$", "解出 $k$"),
      t(
        `Work out the discriminant and take square roots:${disp(...lines)}\n\nThe solution is $${setL(set)}$.`,
        `算出判别式，再开平方：${disp(...lines)}\n\n解集是 $${setL(set)}$。`,
      ),
      discriminantCheck(set, `k^{2} - ${B * B}`, qx(1, 0, -B * B), op),
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
  ],
  xp: 14,
  standards: ["CCSS.HSA.REI.B.4.B"],
  intro: t(
    `You know that the discriminant $b^{2} - 4ac$ tells how many real solutions $ax^{2} + bx + c = 0$ has, and you can solve inequalities in one unknown. When a coefficient is an unknown number $k$, as when a design has a dimension still to be chosen, the question turns around: for which $k$ does the equation have solutions? The discriminant becomes an expression in $k$, and the number of solutions becomes an inequality for it.

For which $k$ does $x^{2} + 4x + k = 0$ have two distinct real solutions? Two distinct solutions need a positive discriminant:

$$4^{2} - 4 \\cdot 1 \\cdot k > 0 \\implies 16 - 4k > 0 \\implies k < 4$$

The answer is $(-\\infty, 4)$. For instance $k = 3$ gives $x^{2} + 4x + 3 = (x + 1)(x + 3)$, with the two solutions $-1$ and $-3$.`,
    `你知道判别式 $b^{2} - 4ac$ 能说明 $ax^{2} + bx + c = 0$ 有几个实数解，也会解只含一个未知数的不等式。当某个系数是未知数 $k$ 时，比如设计中还有一个尺寸没定，问题就反过来了：$k$ 取哪些值时方程有解？判别式成为关于 $k$ 的式子，解的个数就成为关于 $k$ 的不等式。

$k$ 取哪些值时，$x^{2} + 4x + k = 0$ 有两个不相等的实数解？两个不相等的解要求判别式为正：

$$4^{2} - 4 \\cdot 1 \\cdot k > 0 \\implies 16 - 4k > 0 \\implies k < 4$$

答案是 $(-\\infty, 4)$。例如 $k = 3$ 时，$x^{2} + 4x + 3 = (x + 1)(x + 3)$，有两个解 $-1$ 和 $-3$。`,
  ),
  knowledgePoints: [
    {
      id: "a-parameter-in-the-constant-term",
      title: t("A parameter in the constant term", "参数在常数项中"),
      explanation: t(
        "$ax^{2} + bx + c = 0$ has real solutions exactly when $b^{2} - 4ac \\ge 0$, and two distinct real solutions exactly when $b^{2} - 4ac > 0$. When the equation contains an unknown $k$, this gives an inequality for $k$. For $2x^{2} - 6x + k = 0$ to have real solutions:\n\n$$(-6)^{2} - 4 \\cdot 2 \\cdot k \\ge 0 \\implies 36 - 8k \\ge 0 \\implies -8k \\ge -36 \\implies k \\le \\frac{9}{2}$$\n\nDividing by $-8$ reverses the inequality. The answer is $\\left(-\\infty, \\frac{9}{2}\\right]$.\n\n> **Watch out.** Use $\\ge 0$ for real solutions but $> 0$ for two distinct ones: at the endpoint the discriminant is $0$ and the equation has only one, repeated, solution. And dividing by a negative number, such as $-8$, reverses the inequality.",
        "$ax^{2} + bx + c = 0$ 有实数解当且仅当 $b^{2} - 4ac \\ge 0$，有两个不相等的实数解当且仅当 $b^{2} - 4ac > 0$。方程含有未知参数 $k$ 时，这就给出关于 $k$ 的不等式。要使 $2x^{2} - 6x + k = 0$ 有实数解：\n\n$$(-6)^{2} - 4 \\cdot 2 \\cdot k \\ge 0 \\implies 36 - 8k \\ge 0 \\implies -8k \\ge -36 \\implies k \\le \\frac{9}{2}$$\n\n除以 $-8$ 时不等号反向。答案是 $\\left(-\\infty, \\frac{9}{2}\\right]$。\n\n> **注意。** 有实数解用 $\\ge 0$，有两个不相等的实数解却要用 $> 0$：在端点处判别式为 $0$，方程只有一个（重）解。另外，除以负数（例如 $-8$）时不等号要反向。",
      ),
      keyPrerequisites: ["the-discriminant-of-a-quadratic-equation"],
      generate: (rng) => constantParameter(rng, rng.bool(0.6) ? "real" : "distinct"),
    },
    {
      id: "a-parameter-in-the-coefficient-of-x",
      title: t("A parameter in the coefficient of $x$", "参数在一次项系数中"),
      explanation: t(
        "When $k$ is the coefficient of $x$, the discriminant contains $k^{2}$, and the condition is a quadratic inequality. For $x^{2} + kx + 9 = 0$ to have real solutions:\n\n$$k^{2} - 4 \\cdot 1 \\cdot 9 \\ge 0 \\implies k^{2} \\ge 36 \\implies |k| \\ge 6$$\n\nThe answer is $(-\\infty, -6] \\cup [6, \\infty)$: negative values of $k$ work as well as positive ones.\n\n> **Watch out.** $k^{2} \\ge 36$ is not $k \\ge 6$. A negative value such as $k = -7$ also has $k^{2} = 49 \\ge 36$, so the answer has two pieces.",
        "$k$ 是 $x$ 的系数时，判别式含有 $k^{2}$，条件是一个二次不等式。要使 $x^{2} + kx + 9 = 0$ 有实数解：\n\n$$k^{2} - 4 \\cdot 1 \\cdot 9 \\ge 0 \\implies k^{2} \\ge 36 \\implies |k| \\ge 6$$\n\n答案是 $(-\\infty, -6] \\cup [6, \\infty)$：负的 $k$ 和正的一样可以。\n\n> **注意。** $k^{2} \\ge 36$ 不等于 $k \\ge 6$。负数如 $k = -7$ 也有 $k^{2} = 49 \\ge 36$，所以答案由两部分组成。",
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
  intro: t(
    `You can find the values of $k$ for which a quadratic equation has real solutions, from $b^{2} - 4ac \\ge 0$. The opposite question matters just as much: when does the equation have no real solutions, or, said with the graph, when does a parabola never reach the $x$-axis? That is what keeps a quantity such as a cost or a height above zero for every input. It happens exactly when the discriminant is negative.

For which $k$ does $x^{2} - 2x + k = 0$ have no real solutions?

$$(-2)^{2} - 4 \\cdot 1 \\cdot k < 0 \\implies 4 - 4k < 0 \\implies k > 1$$

The answer is $(1, \\infty)$. For instance $k = 2$ gives $x^{2} - 2x + 2 = (x - 1)^{2} + 1$, which is at least $1$ and never $0$.`,
    `你会由 $b^{2} - 4ac \\ge 0$ 求出使二次方程有实数解的 $k$。反过来的问题同样重要：方程什么时候没有实数解？换成图象的说法，抛物线什么时候碰不到 $x$ 轴？正是这一点保证了成本、高度这样的量对每个输入都大于零。这恰好发生在判别式为负的时候。

$k$ 取哪些值时，$x^{2} - 2x + k = 0$ 没有实数解？

$$(-2)^{2} - 4 \\cdot 1 \\cdot k < 0 \\implies 4 - 4k < 0 \\implies k > 1$$

答案是 $(1, \\infty)$。例如 $k = 2$ 时 $x^{2} - 2x + 2 = (x - 1)^{2} + 1$，它至少为 $1$，永远不等于 $0$。`,
  ),
  knowledgePoints: [
    {
      id: "no-real-solutions-constant-term",
      title: t("A parameter in the constant term", "参数在常数项中"),
      explanation: t(
        "$ax^{2} + bx + c = 0$ has no real solutions exactly when $b^{2} - 4ac < 0$. For $x^{2} + 4x + (k - 1) = 0$:\n\n$$4^{2} - 4 \\cdot 1 \\cdot (k - 1) < 0 \\implies 20 - 4k < 0 \\implies k > 5$$\n\nThe answer is $(5, \\infty)$. The endpoint $5$ is excluded: for $k = 5$ the discriminant is $0$ and the equation has one solution.\n\n> **Watch out.** No real solutions needs $b^{2} - 4ac < 0$, strictly. Writing $\\le 0$ lets in the value where the discriminant is $0$, which still gives one real solution.",
        "$ax^{2} + bx + c = 0$ 没有实数解当且仅当 $b^{2} - 4ac < 0$。对 $x^{2} + 4x + (k - 1) = 0$：\n\n$$4^{2} - 4 \\cdot 1 \\cdot (k - 1) < 0 \\implies 20 - 4k < 0 \\implies k > 5$$\n\n答案是 $(5, \\infty)$。端点 $5$ 不包含：$k = 5$ 时判别式为 $0$，方程有一个解。\n\n> **注意。** 没有实数解要求 $b^{2} - 4ac < 0$，必须是严格不等式。写成 $\\le 0$ 就放进了判别式为 $0$ 的值，而那时方程仍有一个实数解。",
      ),
      generate: (rng) => constantParameter(rng, "none"),
    },
    {
      id: "no-real-solutions-coefficient-of-x",
      title: t("A parameter in the coefficient of $x$", "参数在一次项系数中"),
      explanation: t(
        "A quadratic equation has no real solutions exactly when its discriminant $b^{2} - 4ac$ is negative. When the unknown parameter sits in the coefficient of $x$, the condition becomes an inequality in that parameter, which you solve like any other quadratic inequality.\n\nFor $2x^{2} + kx + 8 = 0$ to have no real solutions:\n\n$$k^{2} - 4 \\cdot 2 \\cdot 8 < 0 \\implies k^{2} < 64 \\implies -8 < k < 8$$\n\nThe answer is $(-8, 8)$.\n\n> **Watch out.** $k^{2} < 64$ means $k$ lies between $-8$ and $8$, not just $k < 8$: $k = -10$ satisfies $k < 8$, but $k^{2} = 100$.",
        "二次方程没有实数解，当且仅当它的判别式 $b^{2} - 4ac$ 为负。当未知参数出现在 $x$ 的系数中时，这个条件就成为关于参数的不等式，像解其他二次不等式一样求解即可。\n\n要使 $2x^{2} + kx + 8 = 0$ 没有实数解：\n\n$$k^{2} - 4 \\cdot 2 \\cdot 8 < 0 \\implies k^{2} < 64 \\implies -8 < k < 8$$\n\n答案是 $(-8, 8)$。\n\n> **注意。** $k^{2} < 64$ 说的是 $k$ 在 $-8$ 与 $8$ 之间，而不只是 $k < 8$：$k = -10$ 满足 $k < 8$，但 $k^{2} = 100$。",
      ),
      generate: (rng) => linearParameter(rng, "none"),
    },
    {
      id: "quadratics-of-one-sign",
      figure: precalculusDrawings["determining-unknown-parameters-in-quadratic-equations-with-no-real-solutions#quadratics-of-one-sign"],
      title: t("Quadratics that never change sign", "始终不变号的二次函数"),
      explanation: t(
        "A parabola that opens upward is above the $x$-axis everywhere exactly when it has no $x$-intercepts, that is when its discriminant is negative. It is on or above the axis everywhere when the discriminant is at most $0$, since it may touch the axis once.\n\nSo $x^{2} - 6x + k > 0$ for every $x$ exactly when $36 - 4k < 0$, that is $k > 9$. For a parabola that opens downward the same reasoning describes when it stays below the axis.\n\n> **Watch out.** A negative discriminant alone does not make a quadratic positive: it also has to open upward. A parabola that opens downward with no $x$-intercepts is negative for every $x$.",
        "开口向上的抛物线处处在 $x$ 轴上方，当且仅当它与 $x$ 轴没有交点，即判别式为负。它处处在 $x$ 轴上或上方，当且仅当判别式不大于 $0$，因为它可以与 $x$ 轴相切一次。\n\n所以 $x^{2} - 6x + k > 0$ 对所有 $x$ 成立当且仅当 $36 - 4k < 0$，即 $k > 9$。对开口向下的抛物线，同样的道理说明它何时始终在 $x$ 轴下方。\n\n> **注意。** 仅有判别式为负，并不能保证二次式为正：它还必须开口向上。开口向下又与 $x$ 轴没有交点的抛物线，对每个 $x$ 都是负的。",
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
          solution: join(
            label(1, "Link the sign to the discriminant", "把符号与判别式联系起来"),
            t(
              `The coefficient of $x^{2}$ is $${a}$, so the parabola opens ${a > 0 ? "upward" : "downward"}. It stays ${a > 0 ? "above" : "below"} the $x$-axis${isStrict ? "" : ", touching it at most once,"} exactly when the discriminant is ${isStrict ? "negative" : "at most $0$"}.`,
              `$x^{2}$ 的系数是 $${a}$，所以抛物线开口向${a > 0 ? "上" : "下"}。它始终在 $x$ 轴${a > 0 ? "上方" : "下方"}${isStrict ? "" : "（最多与 $x$ 轴相切一次）"}，当且仅当判别式${isStrict ? "为负" : "不大于 $0$"}。`,
            ),
            para,
            label(2, "Solve for $k$", "解出 $k$"),
            t(
              `The discriminant is $b^{2} - 4ac = ${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot k$. It must satisfy${disp(`${D} ${opL[dOp]} 0`, `k ${opL[op]} ${v.toLatex()}`)}\n\nThe solution is $${setL(set)}$.`,
              `判别式为 $b^{2} - 4ac = ${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot k$。它必须满足${disp(`${D} ${opL[dOp]} 0`, `k ${opL[op]} ${v.toLatex()}`)}\n\n解集是 $${setL(set)}$。`,
            ),
            discriminantCheck(set, D, qx(-4 * a, b * b), dOp),
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
    { topic: "solving-quadratic-inequalities-using-the-graphical-method", weight: 0.4 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.REI.B.4.B"],
  intro: t(
    `You can find the values of $k$ that give a quadratic equation real solutions, or none, when $k$ sits in one coefficient, and you can solve quadratic inequalities by factoring. Real problems are often less tidy: $k$ may appear in several coefficients, which makes the discriminant a quadratic in $k$, or it may multiply $x^{2}$, so that one value of $k$ makes the equation stop being quadratic. Both cases come up whenever a model has a parameter that is not yet fixed.

For which $k$ does $kx^{2} + 2x + 1 = 0$ have at least one real solution? For $k \\ne 0$ the equation is quadratic, and

$$2^{2} - 4 \\cdot k \\cdot 1 \\ge 0 \\implies 4 - 4k \\ge 0 \\implies k \\le 1$$

For $k = 0$ the discriminant does not apply: the equation is $2x + 1 = 0$, which has the solution $x = -\\frac{1}{2}$. So $k = 0$ counts as well, and the answer is $(-\\infty, 1]$.`,
    `$k$ 只在一个系数中时，你会求出使二次方程有实数解或没有实数解的 $k$，也会用因式分解解二次不等式。实际问题往往没这么整齐：$k$ 可能出现在多个系数中，这时判别式是关于 $k$ 的二次式；$k$ 也可能乘在 $x^{2}$ 前面，于是某个 $k$ 的值会让方程不再是二次方程。只要模型中有一个尚未确定的参数，这两种情形就会出现。

$k$ 取哪些值时，$kx^{2} + 2x + 1 = 0$ 至少有一个实数解？$k \\ne 0$ 时方程是二次方程，且

$$2^{2} - 4 \\cdot k \\cdot 1 \\ge 0 \\implies 4 - 4k \\ge 0 \\implies k \\le 1$$

$k = 0$ 时不能用判别式：方程是 $2x + 1 = 0$，有解 $x = -\\frac{1}{2}$。所以 $k = 0$ 也算，答案是 $(-\\infty, 1]$。`,
  ),
  knowledgePoints: [
    {
      id: "parameters-in-several-coefficients",
      title: t("A parameter in several coefficients", "参数出现在多个系数中"),
      explanation: t(
        "When $k$ appears in more than one coefficient, the discriminant is a quadratic in $k$; solve the inequality by factoring. For $x^{2} + 2kx + (k + 6) = 0$ to have two distinct real solutions:\n\n$$(2k)^{2} - 4(k + 6) > 0 \\implies 4k^{2} - 4k - 24 > 0 \\implies k^{2} - k - 6 > 0 \\implies (k + 2)(k - 3) > 0$$\n\nSo $k$ is in $(-\\infty, -2) \\cup (3, \\infty)$.\n\n> **Watch out.** Square the whole coefficient of $x$: $(2k)^{2} = 4k^{2}$, not $2k^{2}$. A slip there changes the quadratic in $k$ and every root found from it.",
        "$k$ 出现在多个系数中时，判别式是关于 $k$ 的二次式；通过因式分解解不等式。要使 $x^{2} + 2kx + (k + 6) = 0$ 有两个不相等的实数解：\n\n$$(2k)^{2} - 4(k + 6) > 0 \\implies 4k^{2} - 4k - 24 > 0 \\implies k^{2} - k - 6 > 0 \\implies (k + 2)(k - 3) > 0$$\n\n所以 $k$ 属于 $(-\\infty, -2) \\cup (3, \\infty)$。\n\n> **注意。** 要把 $x$ 的系数整个平方：$(2k)^{2} = 4k^{2}$，不是 $2k^{2}$。这里错一步，关于 $k$ 的二次式就变了，由它求出的每个根也都跟着错。",
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
          solution: join(
            label(1, "Write the condition", "写出条件"),
            t(
              `The equation has ${conditionText[c].en} exactly when the discriminant is ${discriminantWords[c].en}. With $b = 2k$ and $c = ${lc}$, divide by $4$ and factor:${disp(...lines)}`,
              `方程${conditionText[c]["zh-CN"]}当且仅当判别式${discriminantWords[c]["zh-CN"]}。$b = 2k$，$c = ${lc}$，两边除以 $4$ 后因式分解：${disp(...lines)}`,
            ),
            para,
            label(2, "Solve the inequality in $k$", "解关于 $k$ 的不等式"),
            t(
              `The roots in $k$ are $${u}$ and $${v}$, and the graph of this quadratic in $k$ is a parabola that opens upward, so it is ${above(op) ? "above" : "below"} the axis ${above(op) ? "outside the roots" : "between the roots"}. ${ends(op).en} The solution is $${setL(set)}$.`,
              `关于 $k$ 的两根是 $${u}$ 和 $${v}$，这个关于 $k$ 的二次式的图象是开口向上的抛物线，所以它在${above(op) ? "两根之外" : "两根之间"}位于轴的${above(op) ? "上方" : "下方"}。${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`,
            ),
            discriminantCheck(set, poly([4, "k^{2}"], [-4 * a, "k"], [-4 * b, ""]), qx(4, -4 * a, -4 * b), op),
          ),
        });
      },
    },
    {
      id: "a-parameter-in-the-leading-coefficient",
      title: t("A parameter in the leading coefficient", "参数在首项系数中"),
      explanation: t(
        "When $k$ multiplies $x^{2}$, the value $k = 0$ needs its own check: the equation is then linear, not quadratic. For $kx^{2} + 4x + 2 = 0$:\n\n- **Two distinct real solutions** needs a quadratic, so $k \\ne 0$, and $16 - 8k > 0$, so $k < 2$: the answer is $(-\\infty, 0) \\cup (0, 2)$.\n- **At least one real solution**: for $k = 0$ the equation $4x + 2 = 0$ has the solution $x = -\\frac{1}{2}$, so $k = 0$ counts, and the answer is $(-\\infty, 2]$.\n\n> **Watch out.** Check $k = 0$ on its own. The discriminant describes quadratic equations only; at $k = 0$ the equation is linear, so solve it directly to decide whether $k = 0$ belongs.",
        "当 $k$ 是 $x^{2}$ 的系数时，$k = 0$ 要单独检验：这时方程是一次方程，不是二次方程。对 $kx^{2} + 4x + 2 = 0$：\n\n- **有两个不相等的实数解**需要是二次方程，所以 $k \\ne 0$，并且 $16 - 8k > 0$，即 $k < 2$：答案是 $(-\\infty, 0) \\cup (0, 2)$。\n- **至少有一个实数解**：$k = 0$ 时方程 $4x + 2 = 0$ 有解 $x = -\\frac{1}{2}$，所以 $k = 0$ 也算，答案是 $(-\\infty, 2]$。\n\n> **注意。** $k = 0$ 要单独检验。判别式只适用于二次方程；$k = 0$ 时方程是一次方程，要直接解它，才能决定 $k = 0$ 是否算在内。",
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
          solution: join(
            label(1, "The quadratic case", "二次方程的情形"),
            t(
              `For $k \\ne 0$ the equation is quadratic, and it has ${distinct ? "two distinct real solutions" : "real solutions"} when its discriminant is ${distinct ? "positive" : "at least $0$"}. Dividing by $${-4 * c}$${c > 0 ? " reverses the inequality" : ""}:${disp(`${D} ${opL[distinct ? ">" : ">="]} 0 \\implies k ${opL[op]} ${v.toLatex()}`)}`,
              `$k \\ne 0$ 时方程是二次方程，判别式${distinct ? "为正" : "不小于 $0$"}时它${distinct ? "有两个不相等的实数解" : "有实数解"}。除以 $${-4 * c}$${c > 0 ? "，不等号反向" : ""}：${disp(`${D} ${opL[distinct ? ">" : ">="]} 0 \\implies k ${opL[op]} ${v.toLatex()}`)}`,
            ),
            para,
            label(2, "The case $k = 0$", "$k = 0$ 的情形"),
            t(
              `${distinct ? "For $k = 0$ the equation is linear and has at most one solution, so $k = 0$ is excluded." : `For $k = 0$ the equation is $${linear(b, c)} = 0$, which has the solution $x = ${zero.toLatex()}$, so $k = 0$ is included.`} The solution is $${setL(set)}$.`,
              `${distinct ? "$k = 0$ 时方程是一次方程，最多有一个解，所以去掉 $k = 0$。" : `$k = 0$ 时方程是 $${linear(b, c)} = 0$，有解 $x = ${zero.toLatex()}$，所以 $k = 0$ 包含在内。`}解集是 $${setL(set)}$。`,
            ),
            checked(
              join(
                t(
                  `For $k \\ne 0$, substitute values of $k$ into the discriminant $${D}$. `,
                  `对 $k \\ne 0$，把 $k$ 的值代入判别式 $${D}$。`,
                ),
                tests(picks(set, { avoid: Q.zero, end: v }), set, (k) => [qx(-4 * c, b * b)(k), Q.zero], distinct ? ">" : ">=", "k"),
              ),
            ),
          ),
        });
      },
    },
    {
      id: "no-solutions-when-the-leading-coefficient-vanishes",
      title: t("When $k = 0$ leaves no solutions", "$k = 0$ 时无解的情形"),
      explanation: t(
        "In $kx^{2} - 4kx + 3 = 0$ every term but the constant contains $k$. For $k \\ne 0$ there are no real solutions when\n\n$$(-4k)^{2} - 4 \\cdot k \\cdot 3 < 0 \\implies 16k^{2} - 12k < 0 \\implies 4k(4k - 3) < 0 \\implies 0 < k < \\frac{3}{4}$$\n\nFor $k = 0$ the equation becomes $3 = 0$, which has no solutions either. So the equation has no real solutions for $k$ in $\\left[0, \\frac{3}{4}\\right)$.\n\n> **Watch out.** At $k = 0$ the discriminant is $0$, which would suggest one solution, yet the equation $3 = 0$ has none. Decide $k = 0$ from the equation itself, not from the discriminant.",
        "在 $kx^{2} - 4kx + 3 = 0$ 中，除常数项外每一项都含有 $k$。$k \\ne 0$ 时，没有实数解的条件是\n\n$$(-4k)^{2} - 4 \\cdot k \\cdot 3 < 0 \\implies 16k^{2} - 12k < 0 \\implies 4k(4k - 3) < 0 \\implies 0 < k < \\frac{3}{4}$$\n\n$k = 0$ 时方程变为 $3 = 0$，同样无解。所以 $k$ 属于 $\\left[0, \\frac{3}{4}\\right)$ 时方程没有实数解。\n\n> **注意。** $k = 0$ 时判别式为 $0$，看起来像有一个解，可方程 $3 = 0$ 根本无解。$k = 0$ 是否算在内，要由方程本身决定，而不是由判别式决定。",
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
          solution: join(
            label(1, "The quadratic case", "二次方程的情形"),
            t(
              `For $k \\ne 0$ the equation is quadratic, and it has no real solutions when the discriminant is negative:${disp(`(${poly([b, "k"])})^{2} - 4 \\cdot k \\cdot ${paren(c)} < 0`, `${D} < 0`, `k(${linear(b * b, -4 * c, "k")}) < 0`)}\n\nThe roots in $k$ are $0$ and $${w.toLatex()}$, and this quadratic in $k$ opens upward, so it is negative between them: $k$ lies between $0$ and $${w.toLatex()}$.`,
              `$k \\ne 0$ 时方程是二次方程，判别式为负时它没有实数解：${disp(`(${poly([b, "k"])})^{2} - 4 \\cdot k \\cdot ${paren(c)} < 0`, `${D} < 0`, `k(${linear(b * b, -4 * c, "k")}) < 0`)}\n\n关于 $k$ 的两根是 $0$ 和 $${w.toLatex()}$，这个关于 $k$ 的二次式开口向上，在两根之间为负：$k$ 在 $0$ 与 $${w.toLatex()}$ 之间。`,
            ),
            para,
            label(2, "The case $k = 0$", "$k = 0$ 的情形"),
            t(
              `For $k = 0$ the equation is $${c} = 0$, which has no solutions, so $k = 0$ is included. The solution is $${setL(set)}$.`,
              `$k = 0$ 时方程是 $${c} = 0$，无解，所以 $k = 0$ 包含在内。解集是 $${setL(set)}$。`,
            ),
            checked(
              join(
                t(
                  `For $k \\ne 0$, substitute values of $k$ into the discriminant $${D}$. `,
                  `对 $k \\ne 0$，把 $k$ 的值代入判别式 $${D}$。`,
                ),
                tests(picks(set, { avoid: Q.zero, end: w }), set, (k) => [qx(b * b, -4 * c, 0)(k), Q.zero], "<", "k"),
              ),
            ),
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
  intro: t(
    `You can solve $(x - 2)^{2} \\le 16$ by taking square roots, and you can solve equations such as $x^{4} = 81$, remembering both $3$ and $-3$. Higher powers of a binomial work the same way once you know one fact about them: an even power is never negative and has two roots, while an odd power keeps the sign of what it raises and has one root. Powers like these appear in growth and volume formulas, and later inside longer products.

Solve $(x - 1)^{4} < 81$. The power is even, so a fourth root gives an absolute value:

$$(x - 1)^{4} < 81 \\iff |x - 1| < 3 \\iff -2 < x < 4$$

The solution is $(-2, 4)$. For instance $x = 0$ gives $1 < 81$, while $x = 5$ gives $4^{4} = 256$, which is too large.`,
    `你会用开平方解 $(x - 2)^{2} \\le 16$，也会解 $x^{4} = 81$ 这样的方程，并记得 $3$ 和 $-3$ 都是解。二项式的更高次幂也是同样的做法，只要记住一个事实：偶次幂永远不是负数，开方有正负两个根；奇次幂保持底数的符号，只有一个根。这样的幂出现在增长和体积的公式里，以后也会出现在更长的乘积中。

解 $(x - 1)^{4} < 81$。幂是偶数次的，开四次方会得到绝对值：

$$(x - 1)^{4} < 81 \\iff |x - 1| < 3 \\iff -2 < x < 4$$

解集是 $(-2, 4)$。例如 $x = 0$ 时得 $1 < 81$，而 $x = 5$ 时得 $4^{4} = 256$，太大了。`,
  ),
  knowledgePoints: [
    {
      id: "even-powers-of-binomials",
      title: t("Even powers of binomials", "二项式的偶次幂"),
      explanation: t(
        "An even power is always non-negative: $(ax + b)^{2m} \\ge 0$ for every real number $x$, and equals $0$ only when $ax + b = 0$. For $(x - 3)^{4}$:\n\n- $(x - 3)^{4} > 0$: true everywhere except $x = 3$, giving $(-\\infty, 3) \\cup (3, \\infty)$.\n- $(x - 3)^{4} \\ge 0$: true for all real numbers, $(-\\infty, \\infty)$.\n- $(x - 3)^{4} \\le 0$: only the root $x = 3$ works, giving $\\{3\\}$.\n- $(x - 3)^{4} < 0$: no real numbers satisfy this, giving $\\emptyset$.\n\nWhen compared with $c > 0$, taking roots gives $|ax + b| \\text{ op } \\sqrt[2m]{c}$.\n\n> **Watch out.** An even root brings an absolute value: $(x - 3)^{4} < 16$ means $|x - 3| < 2$, not $x - 3 < 2$, which would let in numbers far to the left of $3$.",
        "偶次幂总是非负的：对任意实数 $x$，$(ax + b)^{2m} \\ge 0$ 恒成立，且仅当 $ax + b = 0$ 时等于 $0$。以 $(x - 3)^{4}$ 为例：\n\n- $(x - 3)^{4} > 0$：除 $x = 3$ 外处处成立，解集为 $(-\\infty, 3) \\cup (3, \\infty)$。\n- $(x - 3)^{4} \\ge 0$：对所有实数都成立，解集为 $(-\\infty, \\infty)$。\n- $(x - 3)^{4} \\le 0$：仅有零点 $x = 3$ 满足，解集为 $\\{3\\}$。\n- $(x - 3)^{4} < 0$：没有实数满足，解集为 $\\emptyset$。\n\n当与正数 $c > 0$ 比较时，开偶次方得到 $|ax + b| \\text{ op } \\sqrt[2m]{c}$。\n\n> **注意。** 开偶次方会带来绝对值：$(x - 3)^{4} < 16$ 的意思是 $|x - 3| < 2$，不是 $x - 3 < 2$，后者会放进 $3$ 左边很远处的数。",
      ),
      generate(rng) {
        const m = rng.pick([2, 4]);
        const h = rng.int(-6, 6);
        const kind = rng.pick(["zero", "zero", "positive"] as const);
        const base = h === 0 ? "x" : `(${linear(1, -h)})`;
        const op = rng.pick(ops);
        if (kind === "zero") {
          const ineq = `${base}^{${m}} ${opL[op]} 0`;
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
            solution: join(
              label(1, "Use the sign of an even power", "利用偶次幂的符号"),
              t(
                `Since the exponent $${m}$ is even, $${base}^{${m}} \\ge 0$ for all real $x$, with equality only at $x = ${h}$.`,
                `由于指数 $${m}$ 为偶数，对任意实数 $x$ 都有 $${base}^{${m}} \\ge 0$，且仅在 $x = ${h}$ 时取等号。`,
              ),
              para,
              label(2, "Write the solution", "写出解集"),
              t(
                `${{ ">": `The power is positive everywhere except at $x = ${h}$.`, ">=": "The power is never negative, so every $x$ works.", "<=": `The power is at most $0$ only where it equals $0$, at $x = ${h}$.`, "<": "The power is never negative, so no $x$ works." }[op]} The solution is $${setL(set)}$.`,
                `${{ ">": `除 $x = ${h}$ 外，这个幂处处为正。`, ">=": "这个幂永远不是负数，所以每个 $x$ 都满足。", "<=": `这个幂不大于 $0$ 只在它等于 $0$ 时成立，即 $x = ${h}$。`, "<": "这个幂永远不是负数，所以没有 $x$ 满足。" }[op]}解集是 $${setL(set)}$。`,
              ),
              substituted(picks(set, { hint: Q.of(h) }), set, (x) => [x.sub(Q.of(h)).pow(m), Q.zero], op),
            ),
          });
        }
        const root = rng.int(1, 3);
        const c = root ** m;
        const ineq = `${base}^{${m}} ${opL[op]} ${c}`;
        const set = absSet(h, root, op);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [complement(set), absSet(h, root, toggled[op]), absSet(-h, root, op)],
          solution: join(
            label(1, "Take an even root", "开偶次方"),
            t(
              `Since $${root}^{${m}} = ${c}$ and the exponent is even, taking the ${m === 2 ? "square root" : "fourth root"} gives an absolute value:${disp(`|${linear(1, -h)}| ${opL[op]} ${root}`)}`,
              `因为 $${root}^{${m}} = ${c}$，且指数是偶数，${m === 2 ? "开平方" : "开四次方"}得到绝对值：${disp(`|${linear(1, -h)}| ${opL[op]} ${root}`)}`,
            ),
            para,
            label(2, "Read off the solution", "写出解集"),
            t(
              `The distance from $x$ to $${h}$ is ${above(op) ? (strict(op) ? "more than" : "at least") : strict(op) ? "less than" : "at most"} $${root}$. ${ends(op).en} The solution is $${setL(set)}$.`,
              `$x$ 与 $${h}$ 的距离${above(op) ? (strict(op) ? "大于" : "至少为") : strict(op) ? "小于" : "至多为"} $${root}$。${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`,
            ),
            substituted(picks(set), set, (x) => [x.sub(Q.of(h)).pow(m), Q.of(c)], op),
          ),
        });
      },
    },
    {
      id: "odd-powers-of-binomials",
      title: t("Odd powers of binomials", "二项式的奇次幂"),
      explanation: t(
        "Odd power functions are strictly increasing everywhere and preserve sign: $(ax + b)^{2m+1} \\text{ op } c$ is equivalent to $ax + b \\text{ op } \\sqrt[2m+1]{c}$. For $(2x - 1)^{3} \\le 27$:\n\n$$(2x - 1)^{3} \\le 27 \\implies 2x - 1 \\le 3 \\implies 2x \\le 4 \\implies x \\le 2$$\n\nSo the solution is $(-\\infty, 2]$.\n\n> **Watch out.** An odd root keeps the sign and needs no absolute value: $(2x - 1)^{3} \\le -27$ gives $2x - 1 \\le -3$. Splitting into two cases, as for an even power, adds numbers that do not solve the inequality.",
        "奇次幂函数在整个实数集上严格单调递增并保持符号：$(ax + b)^{2m+1} \\text{ op } c$ 等价于 $ax + b \\text{ op } \\sqrt[2m+1]{c}$。以 $(2x - 1)^{3} \\le 27$ 为例：\n\n$$(2x - 1)^{3} \\le 27 \\implies 2x - 1 \\le 3 \\implies 2x \\le 4 \\implies x \\le 2$$\n\n所以解集为 $(-\\infty, 2]$。\n\n> **注意。** 开奇次方保持符号，不需要绝对值：$(2x - 1)^{3} \\le -27$ 得 $2x - 1 \\le -3$。像偶次幂那样分成两种情形，会多出一些并不满足不等式的数。",
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
          solution: join(
            label(1, "Take an odd root", "开奇次方"),
            t(
              `Since $${paren(r)}^{${m}} = ${c}$ and $${m}$ is odd, the ${m === 3 ? "cube root" : "fifth root"} keeps the sign and the direction of the inequality:${disp(`${expr} ${opL[op]} ${r}`)}`,
              `因为 $${paren(r)}^{${m}} = ${c}$，且 $${m}$ 是奇数，${m === 3 ? "开立方" : "开五次方"}保持符号，不等号方向不变：${disp(`${expr} ${opL[op]} ${r}`)}`,
            ),
            para,
            label(2, "Solve for $x$", "解出 $x$"),
            t(
              `Solve the linear inequality:${disp(`x ${opL[op]} ${xVal.toLatex()}`)}\n\nThe solution is $${setL(set)}$.`,
              `解这个一次不等式：${disp(`x ${opL[op]} ${xVal.toLatex()}`)}\n\n解集是 $${setL(set)}$。`,
            ),
            substituted(picks(set), set, (x) => [Q.of(a).mul(x).add(Q.of(b)).pow(m), Q.of(c)], op),
          ),
        });
      },
    },
    {
      id: "products-of-binomial-powers",
      title: t("Products of binomial powers", "二项式幂的乘积"),
      explanation: t(
        "In a product like $(x + 1)^{2}(x - 4) > 0$, the even power $(x + 1)^{2}$ is positive for all $x \\ne -1$ and zero at $x = -1$. It does not change sign across $-1$. The sign of the product is determined by $(x - 4)$, but $-1$ must be kept out of a strict inequality:\n\n$$(x + 1)^{2}(x - 4) > 0 \\implies x > 4$$\n\nFor $(x + 1)^{2}(x - 4) \\le 0$, the answer is $(-\\infty, 4]$, which includes the isolated zero $x = -1$.\n\n> **Watch out.** A root of an even power is a zero of the product, though the sign does not change there. With $\\le$ or $\\ge$ it belongs to the solution even when it stands alone: $(x + 1)^{2}(x - 4) \\ge 0$ on $\\{-1\\} \\cup [4, \\infty)$.",
        "在像 $(x + 1)^{2}(x - 4) > 0$ 这样的乘积中，偶次幂 $(x + 1)^{2}$ 在 $x \\ne -1$ 时恒为正，在 $x = -1$ 时为零。它跨越 $-1$ 时不变号。乘积的符号完全由 $(x - 4)$ 决定，但在严格不等式中必须排除 $-1$：\n\n$$(x + 1)^{2}(x - 4) > 0 \\implies x > 4$$\n\n对 $(x + 1)^{2}(x - 4) \\le 0$，解集为 $(-\\infty, 4]$，它已经包含了孤立的零点 $x = -1$。\n\n> **注意。** 偶次幂的根是乘积的零点，只是符号在那里不变。对 $\\le$ 或 $\\ge$，即使它孤零零地单独出现，也属于解集：$(x + 1)^{2}(x - 4) \\ge 0$ 的解是 $\\{-1\\} \\cup [4, \\infty)$。",
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
          solution: chartSolution(
            1,
            fs,
            name,
            op,
            set,
            undefined,
            substituted(
              picks(set, { also: Q.of(u) }),
              set,
              (x) => [
                x
                  .sub(Q.of(u))
                  .pow(m)
                  .mul(x.sub(Q.of(v)).pow(n)),
                Q.zero,
              ],
              op,
            ),
          ),
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
  encompasses: [{ topic: "solving-quadratic-inequalities-using-the-graphical-method", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSA.REI.B.4"],
  intro: t(
    `You can solve a quadratic inequality from the roots and the direction of its parabola, you can sketch a polynomial from its roots and end behavior, and you know that an even power of a binomial never changes sign. Put together, these solve inequalities of any degree: the roots split the $x$-axis into intervals, the end behavior fixes the sign on the far right, and each root either flips the sign or, at an even multiplicity, keeps it.

Solve $P(x) > 0$ for

$$P(x) = (x + 1)(x - 2)^{2}$$

The roots are $-1$, where the graph crosses the axis, and $2$, a double root where it only touches. The degree is $3$ and the leading coefficient is positive, so the graph is high on the far right. It stays above the axis back to $2$, touches it there, stays above down to $-1$, and crosses below. So $P(x) > 0$ on $(-1, 2) \\cup (2, \\infty)$; the point $2$ is left out because $P(2) = 0$.`,
    `你会由根和抛物线的开口方向解二次不等式，会根据根和端点行为草绘多项式的图象，也知道二项式的偶次幂不会变号。把这些合在一起，就能解任意次数的多项式不等式：根把 $x$ 轴分成若干区间，端点行为确定最右边的符号，而每经过一个根，符号要么改变，要么（在偶数重根处）保持不变。

对

$$P(x) = (x + 1)(x - 2)^{2}$$

解 $P(x) > 0$。根是 $-1$（图象在这里穿过 $x$ 轴）和二重根 $2$（图象在这里只与 $x$ 轴相切）。次数是 $3$，首项系数为正，所以图象在最右边很高。往左看，它一直在 $x$ 轴上方，到 $2$ 处碰到 $x$ 轴后仍在上方，直到 $-1$ 处穿到下方。所以 $P(x) > 0$ 的解是 $(-1, 2) \\cup (2, \\infty)$；$P(2) = 0$，所以 $2$ 不包含在内。`,
  ),
  knowledgePoints: [
    {
      id: "reading-polynomial-inequalities-from-graphs",
      figure: precalculusDrawings["solving-polynomial-inequalities-using-a-graphical-method#reading-polynomial-inequalities-from-graphs"],
      title: t("Reading polynomial inequalities from graphs", "看多项式图象解不等式"),
      explanation: t(
        "The graph of $y = P(x)$ is above the $x$-axis where $P(x) > 0$ and below the $x$-axis where $P(x) < 0$. The roots partition the axis into intervals. The graph crosses the axis at roots of odd multiplicity, and touches without crossing at roots of even multiplicity.\n\nFor a cubic crossing at $-2, 1, 4$ and rising to the right, it is above the axis on $(-2, 1) \\cup (4, \\infty)$ and below on $(-\\infty, -2) \\cup (1, 4)$.\n\n> **Watch out.** Read the solution along the $x$-axis, between intercepts, and decide the intercepts themselves from the relation: they belong to the solution for $\\le$ and $\\ge$, where $P(x) = 0$ is allowed, but not for $<$ and $>$.",
        "当 $y = P(x)$ 的图象位于 $x$ 轴上方时 $P(x) > 0$，位于下方时 $P(x) < 0$。零点将 $x$ 轴分成若干区间。图象在奇数重零点处穿过 $x$ 轴，在偶数重零点处相切而不穿过。\n\n例如一条与 $x$ 轴交于 $-2, 1, 4$ 且向右上方延伸的三次曲线，在 $(-2, 1) \\cup (4, \\infty)$ 上位于上方，在 $(-\\infty, -2) \\cup (1, 4)$ 上位于下方。\n\n> **注意。** 解要沿 $x$ 轴在交点之间读出；交点本身算不算，由不等号决定：$\\le$ 和 $\\ge$ 允许 $P(x) = 0$，要包含交点，$<$ 和 $>$ 则不包含。",
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
            solution: join(
              label(1, "Read the intercepts", "读出交点"),
              t(
                `The graph crosses the $x$-axis at $x = ${r1}$, $x = ${r2}$ and $x = ${r3}$, which split the axis into four intervals.`,
                `图象与 $x$ 轴交于 $x = ${r1}$、$x = ${r2}$ 和 $x = ${r3}$，它们把 $x$ 轴分成四个区间。`,
              ),
              para,
              label(2, "See where the curve is", "看曲线的位置"),
              t(
                `The curve ${up ? "rises" : "falls"} to the right, so it is ${up ? "above" : "below"} the axis to the right of $${r3}$ and changes sides at each intercept. Keep the intervals where it lies ${above(op) ? "above" : "below"} the $x$-axis${strict(op) ? "" : ", together with the intercepts"}. The solution is $${setL(set)}$.`,
                `曲线向右${up ? "上升" : "下降"}，所以在 $${r3}$ 右侧位于 $x$ 轴${up ? "上方" : "下方"}，每经过一个交点就换到另一侧。保留曲线位于 $x$ 轴${above(op) ? "上方" : "下方"}的区间${strict(op) ? "" : "，再加上各交点"}。解集是 $${setL(set)}$。`,
              ),
              substituted(picks(set), set, (x) => [productAt(up ? 1 : -1, roots.map(rootFactor), x), Q.zero], op),
            ),
          }),
          figure: polyFigure(roots, a, name),
        };
      },
    },
    {
      id: "solving-polynomial-inequalities-by-sketching",
      figure: precalculusDrawings["solving-polynomial-inequalities-using-a-graphical-method#solving-polynomial-inequalities-by-sketching"],
      title: t("Solving by sketching end behavior and roots", "利用端点行为与零点草图求解"),
      explanation: t(
        "To solve $-(x + 3)(x - 1)(x - 4) \\ge 0$ without graphing software:\n\n1. **Roots**: $-3, 1, 4$, all multiplicity $1$ (the curve crosses the axis at each).\n2. **Leading coefficient**: negative, and degree is $3$ (odd), so the curve goes up to $+\\infty$ on the far left and down to $-\\infty$ on the far right.\n3. **Signs**: positive on $(-\\infty, -3)$, negative on $(-3, 1)$, positive on $(1, 4)$, negative on $(4, \\infty)$, and $0$ at the roots.\n\nSo the solution is $(-\\infty, -3] \\cup [1, 4]$.\n\n> **Watch out.** Start from the end behavior, not from a habit of writing $+$ on the far right: here the leading coefficient is negative, so the sign on the far right is $-$. Starting with the wrong sign flips every interval.",
        "不用作图软件求解 $-(x + 3)(x - 1)(x - 4) \\ge 0$ 的步骤：\n\n1. **零点**：$-3, 1, 4$，均为 $1$ 重（曲线在每个零点处穿过 $x$ 轴）。\n2. **首项系数**：为负，且次数为 $3$（奇数），因此曲线在最左侧趋向 $+\\infty$，在最右侧趋向 $-\\infty$。\n3. **正负区间**：在 $(-\\infty, -3)$ 上为正，在 $(-3, 1)$ 上为负，在 $(1, 4)$ 上为正，在 $(4, \\infty)$ 上为负，在各零点处为 $0$。\n\n所以解集是 $(-\\infty, -3] \\cup [1, 4]$。\n\n> **注意。** 要从端点行为出发，而不是习惯性地在最右边写 $+$：这里首项系数为负，所以最右边的符号是 $-$。起点的符号错了，每个区间都会跟着错。",
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
          solution: chartSolution(
            k,
            fs,
            name,
            op,
            set,
            undefined,
            substituted(picks(set), set, (x) => [productAt(k, [r1, r2, r3].map(rootFactor), x), Q.zero], op),
          ),
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
  intro: t(
    `You can solve a polynomial inequality once the polynomial is a product of linear factors: the roots split the $x$-axis, and the end behavior and the multiplicities give the sign on each piece. You can also factor a difference of squares, even one of higher powers. This topic is about the step in between, turning an expanded polynomial into factors: by taking out a common monomial, by grouping terms in pairs, or by treating a quartic as a quadratic in $x^{2}$.

Solve $x^{4} - 9x^{2} \\le 0$. Every term contains $x^{2}$, so take it out and then factor the difference of squares:

$$x^{4} - 9x^{2} = x^{2}(x^{2} - 9) = x^{2}(x - 3)(x + 3)$$

The roots are $-3$, $0$ and $3$, and $0$ is a double root, where the sign does not change. The polynomial is positive to the right of $3$, negative on $(0, 3)$, still negative on $(-3, 0)$, and positive again to the left of $-3$. With the roots included, the solution is $[-3, 3]$.`,
    `你会解已经分解成一次因式之积的多项式不等式：根把 $x$ 轴分成若干段，端点行为和重数给出每一段上的符号。你也会分解平方差，包括高次幂的平方差。这个主题讲的是中间那一步：把展开的多项式化成因式之积，方法有提取公单项式、两两分组，以及把四次式看作关于 $x^{2}$ 的二次式。

解 $x^{4} - 9x^{2} \\le 0$。每一项都含有 $x^{2}$，先把它提出来，再分解平方差：

$$x^{4} - 9x^{2} = x^{2}(x^{2} - 9) = x^{2}(x - 3)(x + 3)$$

根是 $-3$、$0$ 和 $3$，其中 $0$ 是二重根，经过它符号不变。多项式在 $3$ 的右边为正，在 $(0, 3)$ 上为负，在 $(-3, 0)$ 上仍为负，在 $-3$ 的左边又为正。再把根包含进来，解集是 $[-3, 3]$。`,
  ),
  knowledgePoints: [
    {
      id: "factoring-out-a-monomial-in-polynomial-inequalities",
      title: t("Factoring out a monomial factor", "提取公单项式"),
      explanation: t(
        "When every term contains $x$, factor out $x$ (or $x^{2}$) first. For $x^{3} - 4x > 0$:\n\n$$x(x^{2} - 4) > 0 \\implies x(x - 2)(x + 2) > 0$$\n\nThe roots are $-2, 0, 2$. The leading coefficient is positive, so the solution is $(-2, 0) \\cup (2, \\infty)$.\n\n> **Watch out.** Do not divide both sides by $x$. Its sign changes at $0$, so dividing loses the root $0$ and reverses the inequality for every negative $x$.",
        "当每一项都含有 $x$ 时，先提取 $x$（或 $x^{2}$）。以 $x^{3} - 4x > 0$ 为例：\n\n$$x(x^{2} - 4) > 0 \\implies x(x - 2)(x + 2) > 0$$\n\n零点是 $-2, 0, 2$。首项系数为正，所以解集是 $(-2, 0) \\cup (2, \\infty)$。\n\n> **注意。** 不要两边同除以 $x$。$x$ 的符号在 $0$ 处改变，同除会丢掉根 $0$，而且对每个负的 $x$ 都把不等号弄反了。",
      ),
      figure: cubicSignFigure,
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
          solution: join(
            label(1, "Factor", "因式分解"),
            t("Factor out $x$, then factor the difference of squares:", "先提出公因式 $x$，再利用平方差公式因式分解："),
            t(
              disp(`${polyTex} = x(x^{2} - ${r * r}) = x(x - ${r})(x + ${r})`),
              disp(`${polyTex} = x(x^{2} - ${r * r}) = x(x - ${r})(x + ${r})`),
            ),
            para,
            join(
              label(2, "Read the signs", "确定符号"),
              t(
                `The roots are $-${r}$, $0$ and $${r}$. The product is positive to the right of the largest root, and its sign changes at each root, since each root is simple. ${ends(op).en} The solution is $${setL(set)}$.`,
                `零点为 $-${r}$、$0$ 和 $${r}$。乘积在最大零点的右边为正，每个零点都是单根，所以每经过一个零点就变号。${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`,
              ),
            ),
            substituted(picks(set), set, (x) => [qx(1, 0, -r * r, 0)(x), Q.zero], op),
          ),
        });
      },
    },
    {
      id: "factoring-by-grouping-in-polynomial-inequalities",
      title: t("Factoring by grouping", "分组分解法"),
      explanation: t(
        "For a four-term cubic such as $x^{3} + 2x^{2} - 9x - 18 \\le 0$, group into pairs:\n\n$$x^{2}(x + 2) - 9(x + 2) = (x^{2} - 9)(x + 2) = (x - 3)(x + 3)(x + 2) \\le 0$$\n\nThe roots are $-3, -2, 3$. The leading coefficient is $1$, so the solution is $(-\\infty, -3] \\cup [-2, 3]$.\n\n> **Watch out.** Take the minus sign out with the second pair: $-9x - 18 = -9(x + 2)$, not $-9(x - 2)$. The two brackets must come out as the same binomial; if they do not, a sign has gone wrong.",
        "对于像 $x^{3} + 2x^{2} - 9x - 18 \\le 0$ 这样的四项三次式，两两分组：\n\n$$x^{2}(x + 2) - 9(x + 2) = (x^{2} - 9)(x + 2) = (x - 3)(x + 3)(x + 2) \\le 0$$\n\n零点是 $-3, -2, 3$。首项系数为 $1$，所以解集是 $(-\\infty, -3] \\cup [-2, 3]$。\n\n> **注意。** 提取第二组时要连同负号一起提：$-9x - 18 = -9(x + 2)$，而不是 $-9(x - 2)$。两个括号必须是同一个二项式；如果不同，说明某个符号错了。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        let b = rng.int(1, 4);
        while (Math.abs(a) === b) {
          b += 1;
        }
        const polyTex = poly([1, "x^{3}"], [a, "x^{2}"], [-b * b, "x"], [-a * b * b, ""]);
        const fs = [lin(1, a), lin(1, b), lin(1, -b)];
        const op = rng.pick(ops);
        const set = chartSet(1, fs, op);
        return intervalProblem({
          prompt: solvePrompt(`${polyTex} ${opL[op]} 0`),
          set,
          form: "interval",
          wrong: [chartSet(-1, fs, op), chartSet(1, fs, toggled[op]), complement(set)],
          solution: join(
            label(1, "Factor by grouping", "分组分解"),
            t(
              "Take $x^{2}$ out of the first two terms and the constant out of the last two, then factor the difference of squares:",
              "前两项提出 $x^{2}$，后两项提出常数，再分解平方差：",
            ),
            t(
              disp(
                `${polyTex} = x^{2}(x${tail(a)}) - ${b * b}(x${tail(a)})`,
                `= (x^{2} - ${b * b})(x${tail(a)}) = (x - ${b})(x + ${b})(x${tail(a)})`,
              ),
              disp(
                `${polyTex} = x^{2}(x${tail(a)}) - ${b * b}(x${tail(a)})`,
                `= (x^{2} - ${b * b})(x${tail(a)}) = (x - ${b})(x + ${b})(x${tail(a)})`,
              ),
            ),
            para,
            join(
              label(2, "Read the signs", "确定符号"),
              t(
                `The roots are $${b}$, $-${b}$ and $${-a}$. The product is positive to the right of the largest root, and its sign changes at each root, since each root is simple. ${ends(op).en} The solution is $${setL(set)}$.`,
                `零点为 $${b}$、$-${b}$ 和 $${-a}$。乘积在最大零点的右边为正，每个零点都是单根，所以每经过一个零点就变号。${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`,
              ),
            ),
            substituted(picks(set), set, (x) => [qx(1, a, -b * b, -a * b * b)(x), Q.zero], op),
          ),
        });
      },
    },
    {
      id: "polynomial-inequalities-quadratic-in-form",
      title: t("Inequalities quadratic in form", "二次型多项式不等式"),
      explanation: t(
        "A quartic polynomial with only even powers, $x^{4} - 10x^{2} + 9 < 0$, is quadratic in $u = x^{2}$:\n\n$$(x^{2} - 1)(x^{2} - 9) < 0 \\implies (x - 1)(x + 1)(x - 3)(x + 3) < 0$$\n\nThe four roots are $-3, -1, 1, 3$. Testing intervals gives $(-3, -1) \\cup (1, 3)$.\n\n> **Watch out.** Do not stop at $1 < x^{2} < 9$ and write $1 < x < 3$. Each square has two roots, so the negative numbers give a second interval, $(-3, -1)$.",
        "仅含偶次幂的四次多项式 $x^{4} - 10x^{2} + 9 < 0$ 可以看作关于 $u = x^{2}$ 的二次型：\n\n$$(x^{2} - 1)(x^{2} - 9) < 0 \\implies (x - 1)(x + 1)(x - 3)(x + 3) < 0$$\n\n四个零点为 $-3, -1, 1, 3$。检验各区间可得解集为 $(-3, -1) \\cup (1, 3)$。\n\n> **注意。** 不要停在 $1 < x^{2} < 9$ 就写成 $1 < x < 3$。每个平方都有两个根，负数还给出另一个区间 $(-3, -1)$。",
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
          solution: join(
            label(1, "Factor as a quadratic in $x^{2}$", "看作关于 $x^{2}$ 的二次式分解"),
            t(
              `Two numbers with product $${a2 * b2}$ and sum $${a2 + b2}$ are $${a2}$ and $${b2}$, so factor and then factor each difference of squares:`,
              `积为 $${a2 * b2}$、和为 $${a2 + b2}$ 的两个数是 $${a2}$ 和 $${b2}$，所以先分解，再分解每个平方差：`,
            ),
            t(
              disp(`${polyTex} = (x^{2} - ${a2})(x^{2} - ${b2})`, `= (x - ${a})(x + ${a})(x - ${b})(x + ${b})`),
              disp(`${polyTex} = (x^{2} - ${a2})(x^{2} - ${b2})`, `= (x - ${a})(x + ${a})(x - ${b})(x + ${b})`),
            ),
            para,
            join(
              label(2, "Read the signs", "确定符号"),
              t(
                `The roots are $-${b}$, $-${a}$, $${a}$ and $${b}$. The product is positive to the right of the largest root, and its sign changes at each root, since each root is simple. ${ends(op).en} The solution is $${setL(set)}$.`,
                `零点为 $-${b}$、$-${a}$、$${a}$ 和 $${b}$。乘积在最大零点的右边为正，每个零点都是单根，所以每经过一个零点就变号。${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`,
              ),
            ),
            substituted(picks(set), set, (x) => [qx(1, 0, -(a2 + b2), 0, a2 * b2)(x), Q.zero], op),
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
  intro: t(
    `You can solve a quadratic inequality with a sign table, a row for each of its two factors, and you can read a polynomial inequality from a sketch of the graph. A sign table works just as well for three factors or more, and it needs no sketch: each row records where one factor is negative, and the bottom row multiplies the signs in each column.

Solve $x(x + 3)(x - 2) < 0$. The zeros $-3$, $0$ and $2$ cut the line into four intervals:

$$\\begin{array}{c|cccc} & (-\\infty, -3) & (-3, 0) & (0, 2) & (2, \\infty) \\\\ \\hline x & - & - & + & + \\\\ x + 3 & - & + & + & + \\\\ x - 2 & - & - & - & + \\\\ \\hline \\text{product} & - & + & - & + \\end{array}$$

The product is negative in the first and third columns, so the solution is $(-\\infty, -3) \\cup (0, 2)$. At $x = 1$, for instance, the product is $1 \\cdot 4 \\cdot (-1) = -4$.`,
    `你会用符号表解二次不等式，两个因式各占一行；也会根据图象草图读出多项式不等式的解。三个或更多因式时，符号表同样好用，而且不用画图：每一行记下一个因式在哪里为负，最后一行把每一列的符号相乘。

解 $x(x + 3)(x - 2) < 0$。零点 $-3$、$0$、$2$ 把数轴分成四个区间：

$$\\begin{array}{c|cccc} & (-\\infty, -3) & (-3, 0) & (0, 2) & (2, \\infty) \\\\ \\hline x & - & - & + & + \\\\ x + 3 & - & + & + & + \\\\ x - 2 & - & - & - & + \\\\ \\hline \\text{积} & - & + & - & + \\end{array}$$

乘积在第一列和第三列为负，所以解集是 $(-\\infty, -3) \\cup (0, 2)$。例如 $x = 1$ 时，乘积为 $1 \\cdot 4 \\cdot (-1) = -4$。`,
  ),
  knowledgePoints: [
    {
      id: "sign-tables-with-three-factors",
      title: t("Sign tables with three factors", "三个因式的符号表"),
      explanation: t(
        "For $(x + 2)(x - 1)(x - 3) > 0$, the roots $-2, 1, 3$ divide the real line into four intervals. Set up a sign table with a row for each factor and determine the sign of the product in each column:\n\n- $(-\\infty, -2)$: $(-)(-)(-) = -$\n- $(-2, 1)$: $(+)(-)(-) = +$\n- $(1, 3)$: $(+)(+)(-) = -$\n- $(3, \\infty)$: $(+)(+)(+) = +$\n\nSo the solution is $(-2, 1) \\cup (3, \\infty)$.\n\n> **Watch out.** Read the answer from the bottom row, the sign of the whole product, not from any one factor's row. A factor written as $a - x$ is negative to the right of its root, so check its row instead of assuming every row ends in $+$.",
        "对于 $(x + 2)(x - 1)(x - 3) > 0$，零点 $-2, 1, 3$ 将数轴划分为四个区间。为每个因式列一行，在每列中计算乘积的符号：\n\n- $(-\\infty, -2)$：$(-)(-)(-) = -$\n- $(-2, 1)$：$(+)(-)(-) = +$\n- $(1, 3)$：$(+)(+)(-) = -$\n- $(3, \\infty)$：$(+)(+)(+) = +$\n\n所以解集是 $(-2, 1) \\cup (3, \\infty)$。\n\n> **注意。** 答案要从最后一行读，也就是整个乘积的符号，而不是某一个因式那一行。写成 $a - x$ 的因式在它的根的右边为负，所以要看清它那一行，不要以为每一行最右边都是 $+$。",
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
          solution: chartSolution(
            1,
            fs,
            name,
            op,
            set,
            undefined,
            substituted(picks(set), set, (x) => [productAt(1, ds, x), Q.zero], op),
          ),
        });
      },
    },
    {
      id: "sign-tables-with-repeated-factors",
      title: t("Sign tables with repeated factors", "含重因式的符号表"),
      explanation: t(
        "A repeated factor $(x - a)^{m}$ behaves differently depending on whether $m$ is even or odd:\n\n- **Even powers** like $(x - 1)^{2}$ are positive everywhere except at $x = 1$, where they are zero. In the sign table, they have $+$ in every interval.\n- **Odd powers** like $(x + 2)^{3}$ change sign across their root, behaving like a single linear factor.\n\nAlways include or exclude the roots according to whether the inequality is non-strict or strict.\n\n> **Watch out.** The signs do not simply alternate from one interval to the next: they stay the same across the root of an even power. With $\\le$ or $\\ge$ that root still belongs to the solution, even when the product has the wrong sign on both sides of it.",
        "重因式 $(x - a)^{m}$ 的表现取决于重数 $m$ 是偶数还是奇数：\n\n- **偶次幂** 如 $(x - 1)^{2}$ 在除 $x = 1$ 外的所有区间上都为正。在符号表中，它在所有区间上都是 $+$。\n- **奇次幂** 如 $(x + 2)^{3}$ 跨过零点时会变号，行为与单个一次因式相同。\n\n始终根据不等式是非严格还是严格，来决定解集中是否包含这些零点。\n\n> **注意。** 符号并不是每过一个区间就交替：经过偶次幂的根时符号不变。对 $\\le$ 或 $\\ge$，即使乘积在这个根两侧的符号都不对，这个根仍属于解集。",
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
          solution: chartSolution(
            1,
            fs,
            name,
            op,
            set,
            undefined,
            substituted(
              picks(set, { also: Q.of(u) }),
              set,
              (x) => [
                x
                  .sub(Q.of(u))
                  .pow(2)
                  .mul(x.sub(Q.of(v))),
                Q.zero,
              ],
              op,
            ),
          ),
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
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSA.REI.A.2"],
  intro: t(
    `You can solve a radical equation by squaring both sides and then checking for extraneous roots, and you can solve simple quadratic inequalities. A radical inequality needs the same care plus one more thing: the square root exists only where the radicand is at least $0$, and squaring keeps the direction of an inequality only when both sides are at least $0$. So every answer is the solution of the squared inequality, cut down to the values where squaring was allowed.

Solve $\\sqrt{x + 4} > 3$. The radicand needs $x + 4 \\ge 0$, that is $x \\ge -4$. Both sides are at least $0$, so square them:

$$x + 4 > 9 \\implies x > 5$$

Every $x > 5$ also satisfies $x \\ge -4$, so the solution is $(5, \\infty)$. For instance, $x = 12$ gives $\\sqrt{16} = 4$, which is more than $3$.`,
    `你会通过两边平方解根式方程，再检验是否有增根；也会解简单的二次不等式。根式不等式需要同样的小心，还要多注意一点：平方根只在被开方数不小于 $0$ 时才有意义，而两边平方只有在两边都不小于 $0$ 时才保持不等号方向。所以答案总是平方后不等式的解，再限制到允许平方的那些值上。

解 $\\sqrt{x + 4} > 3$。被开方数要求 $x + 4 \\ge 0$，即 $x \\ge -4$。两边都不小于 $0$，所以两边平方：

$$x + 4 > 9 \\implies x > 5$$

每个 $x > 5$ 都满足 $x \\ge -4$，所以解集是 $(5, \\infty)$。例如 $x = 12$ 时 $\\sqrt{16} = 4$，比 $3$ 大。`,
  ),
  knowledgePoints: [
    {
      id: "radical-inequalities-with-a-constant",
      title: t("Square root compared with a constant", "平方根与常数比较"),
      explanation: t(
        "For $\\sqrt{ax + b} \\text{ op } c$, the radicand must be non-negative: $ax + b \\ge 0$. Then:\n\n- $\\sqrt{ax + b} < c$: if $c \\le 0$, no solution. If $c > 0$, $0 \\le ax + b < c^{2}$.\n- $\\sqrt{ax + b} > c$: if $c < 0$, any $x$ with $ax + b \\ge 0$ works. If $c \\ge 0$, $ax + b > c^{2}$.\n\nFor $\\sqrt{2x - 3} \\le 5$:\n\n$$0 \\le 2x - 3 \\le 25 \\implies 3 \\le 2x \\le 28 \\implies \\frac{3}{2} \\le x \\le 14$$\n\nSo the solution is $\\left[\\frac{3}{2}, 14\\right]$.\n\n> **Watch out.** Squaring $\\sqrt{ax + b} < c$ gives only $ax + b < c^{2}$, which also allows a negative radicand. Keep the condition $ax + b \\ge 0$, which gives the left end of the answer.",
        "对于 $\\sqrt{ax + b} \\text{ op } c$，被开方数必须非负：$ax + b \\ge 0$。随后：\n\n- $\\sqrt{ax + b} < c$：若 $c \\le 0$，无解；若 $c > 0$，则 $0 \\le ax + b < c^{2}$。\n- $\\sqrt{ax + b} > c$：若 $c < 0$，只需 $ax + b \\ge 0$；若 $c \\ge 0$，则 $ax + b > c^{2}$。\n\n以 $\\sqrt{2x - 3} \\le 5$ 为例：\n\n$$0 \\le 2x - 3 \\le 25 \\implies 3 \\le 2x \\le 28 \\implies \\frac{3}{2} \\le x \\le 14$$\n\n所以解集是 $\\left[\\frac{3}{2}, 14\\right]$。\n\n> **注意。** 把 $\\sqrt{ax + b} < c$ 两边平方只得到 $ax + b < c^{2}$，它还允许被开方数为负。要保留条件 $ax + b \\ge 0$，它给出答案的左端点。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3]);
        const b = rng.int(-6, 6);
        const c = rng.int(1, 5);
        const op = rng.pick(ops);
        const radStr = linear(a, b);
        const ineq = `\\sqrt{${radStr}} ${opL[op]} ${c}`;
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
          solution: join(
            label(1, "Find the domain", "求定义域"),
            t(
              `The radicand must be at least $0$: $${radStr} \\ge 0$, so $x \\ge ${domainLo.toLatex()}$.`,
              `被开方数必须不小于 $0$：$${radStr} \\ge 0$，所以 $x \\ge ${domainLo.toLatex()}$。`,
            ),
            para,
            label(2, "Square both sides", "两边平方"),
            t(
              `Both sides are at least $0$, since $${c} > 0$, so squaring keeps the direction:`,
              `两边都不小于 $0$（因为 $${c} > 0$），所以平方后不等号方向不变：`,
            ),
            t(
              disp(`${radStr} ${opL[op]} ${c2}`, `x ${opL[op]} ${rootBound.toLatex()}`),
              disp(`${radStr} ${opL[op]} ${c2}`, `x ${opL[op]} ${rootBound.toLatex()}`),
            ),
            para,
            label(3, "Combine with the domain", "与定义域结合"),
            t(
              `Keep only the values with $x \\ge ${domainLo.toLatex()}$. The solution is $${setL(set)}$.`,
              `只保留满足 $x \\ge ${domainLo.toLatex()}$ 的值。解集是 $${setL(set)}$。`,
            ),
            rootTests(
              [0, c - 1, c, c + 1].map((m) => ({ x: Q.of(m * m - b, a), m })),
              set,
              () => Q.of(c),
              op,
            ),
          ),
        });
      },
    },
    {
      id: "radical-inequalities-linear-bound",
      title: t("Radical inequalities with a variable side", "含变量边界的根式不等式"),
      explanation: t(
        "To solve $\\sqrt{x + 5} < x - 1$, both sides must be valid: the radicand $x + 5 \\ge 0 \\implies x \\ge -5$, and since the square root is non-negative, the right side must be positive: $x - 1 > 0 \\implies x > 1$. Then square both sides:\n\n$$x + 5 < (x - 1)^{2} = x^{2} - 2x + 1 \\implies x^{2} - 3x - 4 > 0 \\implies (x - 4)(x + 1) > 0$$\n\nSince $x > 1$, the only valid interval is $(4, \\infty)$.\n\n> **Watch out.** Squaring keeps the direction only when both sides are at least $0$. Without the condition $x - 1 > 0$, the squared inequality also keeps $x < -1$, where the right side is negative and the original inequality fails.",
        "求解 $\\sqrt{x + 5} < x - 1$ 时两边都要满足条件：被开方数 $x + 5 \\ge 0 \\implies x \\ge -5$；且因为平方根非负，右侧必须为正：$x - 1 > 0 \\implies x > 1$。随后两边平方：\n\n$$x + 5 < (x - 1)^{2} = x^{2} - 2x + 1 \\implies x^{2} - 3x - 4 > 0 \\implies (x - 4)(x + 1) > 0$$\n\n结合 $x > 1$，唯一有效的区间是 $(4, \\infty)$。\n\n> **注意。** 只有两边都不小于 $0$ 时，平方才保持不等号方向。没有条件 $x - 1 > 0$，平方后的不等式还会保留 $x < -1$，而那里右边为负，原不等式并不成立。",
      ),
      generate(rng) {
        const c = rng.int(-4, 6);
        const d = rng.int(2, 6);
        const b = d * d - d - c;
        const [p, q] = [c + 1 - d, c + d];
        const radicand = linear(1, b);
        const right = linear(1, -c);
        const set = ray(">", q);
        return intervalProblem({
          prompt: solvePrompt(`\\sqrt{${radicand}} < ${right}`),
          set,
          form: "interval",
          wrong: [
            union(mk(Q.of(-b), Q.of(p), true, false), mk(Q.of(q), undefined, false, false)),
            ray(">", c),
            union(mk(Q.of(p), Q.of(q), false, false)),
          ],
          solution: join(
            label(1, "Find the allowed values", "找出允许的值"),
            t(
              `The radicand needs $x \\ge ${-b}$, and a square root is never negative, so the right side must be positive: $x > ${c}$.`,
              `被开方数要求 $x \\ge ${-b}$；平方根不会是负数，所以右边必须为正：$x > ${c}$。`,
            ),
            para,
            label(2, "Square both sides", "两边平方"),
            t("On these values both sides are at least $0$, so they may be squared:", "在这些值上两边都不小于 $0$，可以平方："),
            t(
              disp(`${radicand} < (${right})^{2}`, `${quad(1, -(p + q), p * q)} > 0`, `(${linear(1, -p)})(${linear(1, -q)}) > 0`),
              disp(`${radicand} < (${right})^{2}`, `${quad(1, -(p + q), p * q)} > 0`, `(${linear(1, -p)})(${linear(1, -q)}) > 0`),
            ),
            para,
            label(3, "Keep the allowed part", "保留允许的部分"),
            t(
              `So $x < ${p}$ or $x > ${q}$. But $${p}$ is less than $${c}$, so $x < ${p}$ makes the right side negative and is rejected. The solution is $${setL(set)}$.`,
              `所以 $x < ${p}$ 或 $x > ${q}$。但 $${p}$ 小于 $${c}$，$x < ${p}$ 会使右边为负，应舍去。解集是 $${setL(set)}$。`,
            ),
            rootTests(
              [
                { x: Q.of((d + 1) * (d + 1) - b), m: d + 1 },
                { x: Q.of(q), m: d },
                { x: Q.of((d - 2) * (d - 2) - b), m: d - 2 },
              ],
              set,
              (x) => x.sub(Q.of(c)),
              "<",
            ),
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
  intro: t(
    `You can solve an exponential equation by writing both sides as powers of the same base and setting the exponents equal. An inequality works the same way, with one question added: does the exponential grow or shrink as the exponent grows? With a base above $1$ it grows, so the inequality between the exponents points the same way. With a base between $0$ and $1$ it shrinks, so the inequality reverses.

Solve $3^{x + 1} > 27$. Write $27$ as $3^{3}$. The base $3$ is above $1$, so the exponents keep the direction:

$$3^{x + 1} > 3^{3} \\implies x + 1 > 3 \\implies x > 2$$

The solution is $(2, \\infty)$. For instance, $x = 3$ gives $3^{4} = 81$, which is more than $27$.`,
    `你会把两边写成同底数的幂、令指数相等来解指数方程。不等式的做法相同，只多一个问题：指数变大时，指数函数是变大还是变小？底数大于 $1$ 时它变大，所以指数之间的不等号方向不变；底数在 $0$ 和 $1$ 之间时它变小，所以不等号反向。

解 $3^{x + 1} > 27$。把 $27$ 写成 $3^{3}$。底数 $3$ 大于 $1$，所以比较指数时方向不变：

$$3^{x + 1} > 3^{3} \\implies x + 1 > 3 \\implies x > 2$$

解集是 $(2, \\infty)$。例如 $x = 3$ 时 $3^{4} = 81$，比 $27$ 大。`,
  ),
  knowledgePoints: [
    {
      id: "exponential-inequalities-with-base-greater-than-one",
      title: t("Base greater than one", "底数大于 1 的指数不等式"),
      explanation: t(
        "For $b > 1$, the function $f(x) = b^{x}$ is strictly increasing. Therefore, $b^{u} < b^{v}$ if and only if $u < v$. For example:\n\n$$2^{3x - 1} \\le 16 \\implies 2^{3x - 1} \\le 2^{4} \\implies 3x - 1 \\le 4 \\implies x \\le \\frac{5}{3}$$\n\nSo the solution is $\\left(-\\infty, \\frac{5}{3}\\right]$.\n\n> **Watch out.** Compare exponents only after both sides are powers of the same base. $2^{3x - 1} \\le 16$ does not give $3x - 1 \\le 16$: the number $16$ must first become $2^{4}$.",
        "当 $b > 1$ 时，函数 $f(x) = b^{x}$ 在整个实数集上严格单调递增。因此 $b^{u} < b^{v}$ 当且仅当 $u < v$。例如：\n\n$$2^{3x - 1} \\le 16 \\implies 2^{3x - 1} \\le 2^{4} \\implies 3x - 1 \\le 4 \\implies x \\le \\frac{5}{3}$$\n\n所以解集是 $\\left(-\\infty, \\frac{5}{3}\\right]$。\n\n> **注意。** 只有两边都化成同底数的幂以后才能比较指数。由 $2^{3x - 1} \\le 16$ 得不到 $3x - 1 \\le 16$：要先把 $16$ 写成 $2^{4}$。",
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
          solution: join(
            label(1, "Use one base", "化为同底数"),
            t(`Rewrite $${bk}$ as $${b}^{${k}}$.`, `把 $${bk}$ 写成 $${b}^{${k}}$。`),
            para,
            label(2, "Compare the exponents", "比较指数"),
            t(
              `Since $${b} > 1$, the exponential function is increasing, so the inequality keeps its direction:`,
              `因为底数 $${b} > 1$，指数函数单调递增，所以不等号方向不变：`,
            ),
            t(
              disp(`${linear(p, q)} ${opL[op]} ${k}`, `x ${opL[op]} ${xVal.toLatex()}`),
              disp(`${linear(p, q)} ${opL[op]} ${k}`, `x ${opL[op]} ${xVal.toLatex()}`),
            ),
            para,
            t(`The solution is $${setL(set)}$.`, `解集是 $${setL(set)}$。`),
            powerTests(
              [k + 1, k, k - 1].map((e) => Q.of(e - q, p)),
              set,
              (x) => [Q.of(b).pow(Math.round(p * x.toNumber()) + q), Q.of(bk)],
              op,
            ),
          ),
        });
      },
    },
    {
      id: "exponential-inequalities-with-fractional-base",
      title: t("Base between zero and one", "底数在 0 到 1 之间的指数不等式"),
      explanation: t(
        "When $0 < b < 1$, the function $f(x) = b^{x}$ is strictly decreasing: larger exponents yield smaller values! Therefore, $b^{u} < b^{v} \\iff u > v$. For example:\n\n$$\\left(\\frac{1}{2}\\right)^{x + 2} > \\frac{1}{8} \\implies \\left(\\frac{1}{2}\\right)^{x + 2} > \\left(\\frac{1}{2}\\right)^{3} \\implies x + 2 < 3 \\implies x < 1$$\n\nSo the solution is $(-\\infty, 1)$.\n\n> **Watch out.** Reverse the inequality when you pass from the powers to the exponents, and only then. Here $x + 2 < 3$, not $x + 2 > 3$; the steps after that, such as subtracting $2$, keep the direction as usual.",
        "当 $0 < b < 1$ 时，函数 $f(x) = b^{x}$ 严格单调递减：指数越大，函数值越小！因此 $b^{u} < b^{v} \\iff u > v$。例如：\n\n$$\\left(\\frac{1}{2}\\right)^{x + 2} > \\frac{1}{8} \\implies \\left(\\frac{1}{2}\\right)^{x + 2} > \\left(\\frac{1}{2}\\right)^{3} \\implies x + 2 < 3 \\implies x < 1$$\n\n所以解集是 $(-\\infty, 1)$。\n\n> **注意。** 只在从幂转到指数的那一步反转不等号。这里是 $x + 2 < 3$，而不是 $x + 2 > 3$；之后的步骤（比如减去 $2$）照常保持方向。",
      ),
      generate(rng) {
        const den = rng.pick([2, 3]);
        const p = rng.pick([1, 2]);
        const q = rng.int(-4, 4);
        const k = rng.int(1, 3);
        const op = rng.pick(ops);
        const baseTex = `\\frac{1}{${den}}`;
        const rhsTex = `\\frac{1}{${den ** k}}`;
        const ineq = `\\left(${baseTex}\\right)^{${linear(p, q)}} ${opL[op]} ${rhsTex}`;
        const xVal = Q.of(k - q, p);
        const set = ray(reversed[op], xVal);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [ray(op, xVal), ray(reversed[op], Q.of(-k - q, p)), complement(set)],
          solution: join(
            label(1, "Use one base", "化为同底数"),
            t(`Rewrite $${rhsTex}$ as $\\left(${baseTex}\\right)^{${k}}$.`, `把 $${rhsTex}$ 写成 $\\left(${baseTex}\\right)^{${k}}$。`),
            para,
            label(2, "Compare the exponents", "比较指数"),
            t(
              `The base $${baseTex}$ is between $0$ and $1$, so the exponential function is decreasing and the inequality reverses:`,
              `底数 $${baseTex}$ 介于 $0$ 与 $1$ 之间，指数函数单调递减，所以不等号反向：`,
            ),
            t(
              disp(`${linear(p, q)} ${opL[reversed[op]]} ${k}`, `x ${opL[reversed[op]]} ${xVal.toLatex()}`),
              disp(`${linear(p, q)} ${opL[reversed[op]]} ${k}`, `x ${opL[reversed[op]]} ${xVal.toLatex()}`),
            ),
            para,
            t(`The solution is $${setL(set)}$.`, `解集是 $${setL(set)}$。`),
            powerTests(
              [k + 1, k, k - 1].map((e) => Q.of(e - q, p)),
              set,
              (x) => [Q.of(1, den).pow(Math.round(p * x.toNumber()) + q), Q.of(1, den ** k)],
              op,
            ),
          ),
        });
      },
    },
    {
      id: "exponential-inequalities-quadratic-in-form",
      title: t("Inequalities quadratic in an exponential", "二次型指数不等式"),
      explanation: t(
        "When one power is the square of another, a substitution turns the inequality into a quadratic one; solve that, then undo the substitution, remembering that an exponential is always positive. Substitute $u = 2^{x}$ in $4^{x} - 6 \\cdot 2^{x} + 8 < 0$:\n\n$$u^{2} - 6u + 8 < 0 \\implies (u - 2)(u - 4) < 0 \\implies 2 < u < 4$$\n\nSubstituting back $u = 2^{x}$ gives $2 < 2^{x} < 4 \\implies 1 < x < 2$, so the solution is $(1, 2)$.\n\n> **Watch out.** Finish by turning the bounds on $u$ back into bounds on $x$: $2 < u < 4$ means $2 < 2^{x} < 4$, so $1 < x < 2$, not $2 < x < 4$.",
        "当一个幂是另一个幂的平方时，换元可以把不等式化为二次不等式；先解它，再代回原变量，并记住指数式总是正的。在 $4^{x} - 6 \\cdot 2^{x} + 8 < 0$ 中令 $u = 2^{x}$：\n\n$$u^{2} - 6u + 8 < 0 \\implies (u - 2)(u - 4) < 0 \\implies 2 < u < 4$$\n\n代回 $u = 2^{x}$ 得 $2 < 2^{x} < 4 \\implies 1 < x < 2$，所以解集是 $(1, 2)$。\n\n> **注意。** 最后要把关于 $u$ 的范围换回关于 $x$ 的范围：$2 < u < 4$ 即 $2 < 2^{x} < 4$，所以 $1 < x < 2$，而不是 $2 < x < 4$。",
      ),
      generate(rng) {
        const [e1, e2] = distinctPair(rng, 0, 4).sort((p, q) => p - q);
        const [u1, u2] = [2 ** e1, 2 ** e2];
        const sum = u1 + u2;
        const prod = u1 * u2;
        const op = rng.pick(ops);
        const ineq = `4^{x} - ${sum} \\cdot 2^{x} + ${prod} ${opL[op]} 0`;
        const fs = [lin(1, -e1), lin(1, -e2)];
        const set = chartSet(1, fs, op);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [chartSet(-1, fs, op), chartSet(1, [lin(1, -u1), lin(1, -u2)], op), complement(set)],
          solution: join(
            label(1, "Substitute", "换元"),
            t(`Let $u = 2^{x}$, so that $4^{x} = u^{2}$. The inequality becomes:`, `令 $u = 2^{x}$，则 $4^{x} = u^{2}$。不等式变为：`),
            t(
              disp(`u^{2} - ${sum}u + ${prod} ${opL[op]} 0`, `(u - ${u1})(u - ${u2}) ${opL[op]} 0`),
              disp(`u^{2} - ${sum}u + ${prod} ${opL[op]} 0`, `(u - ${u1})(u - ${u2}) ${opL[op]} 0`),
            ),
            para,
            label(2, "Return to x", "换回 x"),
            t(
              `The roots in $u$ are $${u1} = 2^{${e1}}$ and $${u2} = 2^{${e2}}$. Since $2^{x}$ is increasing, $u$ lies between them exactly when $x$ lies between $${e1}$ and $${e2}$. ${ends(op).en} The solution is $${setL(set)}$.`,
              `关于 $u$ 的两根是 $${u1} = 2^{${e1}}$ 和 $${u2} = 2^{${e2}}$。$2^{x}$ 单调递增，所以 $u$ 在两根之间当且仅当 $x$ 在 $${e1}$ 与 $${e2}$ 之间。${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`,
            ),
            (() => {
              const at = (u: Q) => u.mul(u).sub(Q.of(sum).mul(u)).add(Q.of(prod));
              const between = op === "<" || op === "<=";
              const mid = e2 - e1 >= 2 ? undefined : Q.of(u1 + u2, 2);
              const xs = [e1 - 1, e1, ...(mid ? [] : [e1 + 1]), e2 + 1];
              const parts = xs.map((x) => {
                const u = Q.of(2).pow(x);
                return say(`x = ${x}`, member(set, Q.of(x)), isEnd(set, Q.of(x)), at(u), op, Q.zero);
              });
              if (mid) {
                parts.splice(2, 0, say(`x = \\log_{2} ${mid.toLatex()}`, between, false, at(mid), op, Q.zero));
              }
              return checked(
                join(
                  t(
                    "Substitute numbers into the original inequality, using $4^{x} = (2^{x})^{2}$. ",
                    "把数代入原不等式，利用 $4^{x} = (2^{x})^{2}$。",
                  ),
                  sayAll(parts),
                ),
              );
            })(),
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
  intro: t(
    `You can solve a logarithmic equation by rewriting it in exponential form and checking that every argument stays positive, and you know that an exponential inequality reverses when the base is between $0$ and $1$. A logarithmic inequality combines the two. A logarithm with a base above $1$ is increasing, so it keeps the direction; with a base between $0$ and $1$ it is decreasing, so it reverses it. Either way the argument must stay positive, and that condition often gives one end of the answer.

Solve $\\log_{3}(x + 2) < 2$. The argument needs $x + 2 > 0$, so $x > -2$. The base $3$ is above $1$, so rewrite in exponential form with the same direction:

$$x + 2 < 3^{2} = 9 \\implies x < 7$$

Both conditions together give $(-2, 7)$. For instance, $x = 1$ gives $\\log_{3} 3 = 1$, which is less than $2$.`,
    `你会把对数方程化成指数形式来解，并检验每个真数都为正；也知道底数在 $0$ 和 $1$ 之间时，指数不等式要反向。对数不等式把这两点结合起来：底数大于 $1$ 的对数单调递增，不等号方向不变；底数在 $0$ 和 $1$ 之间的对数单调递减，不等号反向。无论哪种情况，真数都必须为正，这个条件常常给出答案的一个端点。

解 $\\log_{3}(x + 2) < 2$。真数要求 $x + 2 > 0$，所以 $x > -2$。底数 $3$ 大于 $1$，所以化成指数形式时方向不变：

$$x + 2 < 3^{2} = 9 \\implies x < 7$$

两个条件合起来得 $(-2, 7)$。例如 $x = 1$ 时 $\\log_{3} 3 = 1$，比 $2$ 小。`,
  ),
  knowledgePoints: [
    {
      id: "logarithmic-inequalities-with-base-greater-than-one",
      title: t("Base greater than one", "底数大于 1 的对数不等式"),
      explanation: t(
        "When $b > 1$, $\\log_{b}(u)$ is strictly increasing. Remember the **domain**: the argument must be strictly positive ($u > 0$):\n\n- $\\log_{b}(u) < c \\iff 0 < u < b^{c}$\n- $\\log_{b}(u) > c \\iff u > b^{c}$\n\nFor $\\log_{2}(3x - 1) \\le 3$:\n\n$$0 < 3x - 1 \\le 2^{3} = 8 \\implies 1 < 3x \\le 9 \\implies \\frac{1}{3} < x \\le 3$$\n\nSo the solution is $\\left(\\frac{1}{3}, 3\\right]$.\n\n> **Watch out.** Rewriting $\\log_{b}(u) < c$ as $u < b^{c}$ loses the condition $u > 0$, so keep it beside the result: the answer starts where the argument becomes positive, not at $-\\infty$.",
        "当 $b > 1$ 时，$\\log_{b}(u)$ 严格单调递增。牢记**定义域**：真数必须严格大于零（$u > 0$）：\n\n- $\\log_{b}(u) < c \\iff 0 < u < b^{c}$\n- $\\log_{b}(u) > c \\iff u > b^{c}$\n\n以 $\\log_{2}(3x - 1) \\le 3$ 为例：\n\n$$0 < 3x - 1 \\le 2^{3} = 8 \\implies 1 < 3x \\le 9 \\implies \\frac{1}{3} < x \\le 3$$\n\n所以解集是 $\\left(\\frac{1}{3}, 3\\right]$。\n\n> **注意。** 把 $\\log_{b}(u) < c$ 写成 $u < b^{c}$ 会丢掉条件 $u > 0$，所以要把它和结果放在一起：答案从真数开始为正的地方开始，而不是从 $-\\infty$ 开始。",
      ),
      generate(rng) {
        const b = rng.pick([2, 3]);
        const p = rng.pick([1, 2]);
        const q = rng.int(-5, 5);
        const c = rng.int(1, 3);
        const bc = b ** c;
        const op = rng.pick(ops);
        const ineq = `\\log_{${b}}(${linear(p, q)}) ${opL[op]} ${c}`;
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
          solution: join(
            label(1, "Find the domain", "求定义域"),
            t(
              `The argument must be positive: $${linear(p, q)} > 0$, so $x > ${domainLo.toLatex()}$.`,
              `真数必须为正：$${linear(p, q)} > 0$，所以 $x > ${domainLo.toLatex()}$。`,
            ),
            para,
            label(2, "Rewrite in exponential form", "化为指数形式"),
            t(
              `Since $${b} > 1$, the logarithm is increasing, so the direction stays:`,
              `因为底数 $${b} > 1$，对数单调递增，不等号方向不变：`,
            ),
            t(
              disp(`${linear(p, q)} ${opL[op]} ${b}^{${c}} = ${bc}`, `x ${opL[op]} ${xVal.toLatex()}`),
              disp(`${linear(p, q)} ${opL[op]} ${b}^{${c}} = ${bc}`, `x ${opL[op]} ${xVal.toLatex()}`),
            ),
            para,
            label(3, "Combine with the domain", "与定义域结合"),
            t(`The solution is $${setL(set)}$.`, `解集是 $${setL(set)}$。`),
            logTests([c + 1, c, c - 1], (e) => Q.of(b ** e - q, p), set, c, op, op === "<" || op === "<=" ? domainLo : undefined),
          ),
        });
      },
    },
    {
      id: "logarithmic-inequalities-with-fractional-base",
      title: t("Base between zero and one", "底数在 0 到 1 之间的对数不等式"),
      explanation: t(
        "When $0 < b < 1$, $\\log_{b}(u)$ is decreasing, reversing the inequality. For $\\log_{1/2}(x - 3) \\ge -2$:\n\n$$0 < x - 3 \\le \\left(\\frac{1}{2}\\right)^{-2} = 4 \\implies 3 < x \\le 7$$\n\nSo the solution is $(3, 7]$. Notice that $x > 3$ is open because the logarithm is not defined at $0$.\n\n> **Watch out.** The base reverses the inequality between the logarithm and the number, but not the domain condition: the argument must still be greater than $0$.",
        "当 $0 < b < 1$ 时，$\\log_{b}(u)$ 严格单调递减，不等号方向反转。以 $\\log_{1/2}(x - 3) \\ge -2$ 为例：\n\n$$0 < x - 3 \\le \\left(\\frac{1}{2}\\right)^{-2} = 4 \\implies 3 < x \\le 7$$\n\n所以解集是 $(3, 7]$。注意 $x > 3$ 处是开区间，因为对数在 $0$ 处无定义。\n\n> **注意。** 底数使对数与数之间的不等号反向，但不改变定义域条件：真数仍然必须大于 $0$。",
      ),
      generate(rng) {
        const h = rng.int(1, 5);
        const c = rng.int(-2, 2);
        const pow = c >= 0 ? Q.of(1, 2 ** c) : Q.of(2 ** -c);
        const op = rng.pick(ops);
        const ineq = `\\log_{1/2}(x${tail(-h)}) ${opL[op]} ${c}`;
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
          solution: join(
            label(1, "Find the domain", "求定义域"),
            t(`The argument must be positive: $x${tail(-h)} > 0$, so $x > ${h}$.`, `真数必须为正：$x${tail(-h)} > 0$，所以 $x > ${h}$。`),
            para,
            label(2, "Rewrite in exponential form", "化为指数形式"),
            t(
              "The base $\\frac{1}{2}$ is less than $1$, so the logarithm is decreasing and the direction reverses:",
              "底数 $\\frac{1}{2}$ 小于 $1$，对数单调递减，所以不等号反向：",
            ),
            t(
              disp(`x${tail(-h)} ${opL[rev]} \\left(\\frac{1}{2}\\right)^{${c}} = ${pow.toLatex()}`, `x ${opL[rev]} ${hi.toLatex()}`),
              disp(`x${tail(-h)} ${opL[rev]} \\left(\\frac{1}{2}\\right)^{${c}} = ${pow.toLatex()}`, `x ${opL[rev]} ${hi.toLatex()}`),
            ),
            para,
            label(3, "Combine with the domain", "与定义域结合"),
            t(`The solution is $${setL(set)}$.`, `解集是 $${setL(set)}$。`),
            logTests(
              [c + 1, c, c - 1],
              (e) => Q.of(h).add(Q.of(1, 2).pow(e)),
              set,
              c,
              op,
              rev === "<" || rev === "<=" ? Q.of(h) : undefined,
            ),
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
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSA.CED.A.1"],
  intro: t(
    `You can solve an exponential inequality such as $3^{x} < 9$, and you can solve a product inequality with a sign table. When a product mixes the two kinds of factor, each needs only its sign. A power such as $3^{x}$ is positive for every $x$, so it never changes the sign of a product. A factor such as $3^{x} - 9$ changes sign once, where $3^{x} = 9$.

Solve $x(3^{x} - 9) \\le 0$. The factor $x$ is zero at $0$, and $3^{x} - 9$ is zero where $3^{x} = 3^{2}$, at $2$. Both factors are positive to the right of $2$, and each changes sign at its zero:

$$\\begin{array}{c|ccc} & (-\\infty, 0) & (0, 2) & (2, \\infty) \\\\ \\hline x & - & + & + \\\\ 3^{x} - 9 & - & - & + \\\\ \\hline \\text{product} & + & - & + \\end{array}$$

With the zeros included, the solution is $[0, 2]$. For instance, $x = 1$ gives $1 \\cdot (3 - 9) = -6$.`,
    `你会解 $3^{x} < 9$ 这样的指数不等式，也会用符号表解乘积不等式。当乘积里两类因式混在一起时，每个因式只需要知道它的符号。像 $3^{x}$ 这样的幂对每个 $x$ 都是正的，所以不会改变乘积的符号；像 $3^{x} - 9$ 这样的因式只变号一次，在 $3^{x} = 9$ 的地方。

解 $x(3^{x} - 9) \\le 0$。因式 $x$ 在 $0$ 处为零，$3^{x} - 9$ 在 $3^{x} = 3^{2}$ 即 $2$ 处为零。两个因式在 $2$ 的右边都为正，各自经过零点时变号：

$$\\begin{array}{c|ccc} & (-\\infty, 0) & (0, 2) & (2, \\infty) \\\\ \\hline x & - & + & + \\\\ 3^{x} - 9 & - & - & + \\\\ \\hline \\text{积} & + & - & + \\end{array}$$

再把零点包含进来，解集是 $[0, 2]$。例如 $x = 1$ 时，乘积为 $1 \\cdot (3 - 9) = -6$。`,
  ),
  knowledgePoints: [
    {
      id: "factoring-out-positive-exponentials",
      title: t("Dividing by positive exponential factors", "除以恒正的指数因式"),
      explanation: t(
        "For any real number $x$, $e^{x} > 0$ and $2^{x} > 0$. An exponential factor is never zero and never negative! We can divide both sides by it without changing the direction of the inequality:\n\n$$(x^{2} - 9)e^{x} \\ge 0 \\iff x^{2} - 9 \\ge 0 \\iff (x - 3)(x + 3) \\ge 0$$\n\nSo the solution is $(-\\infty, -3] \\cup [3, \\infty)$.\n\n> **Watch out.** Dividing by $e^{x}$ is safe only because it is positive. A factor that can be negative or zero, such as $x$, cannot be divided out this way; it needs its own row in a sign table.",
        "对任意实数 $x$，都有 $e^{x} > 0$ 以及 $2^{x} > 0$。指数因式永不为零，也永不为负！我们可以直接在两边除以它而不改变不等号方向：\n\n$$(x^{2} - 9)e^{x} \\ge 0 \\iff x^{2} - 9 \\ge 0 \\iff (x - 3)(x + 3) \\ge 0$$\n\n所以解集是 $(-\\infty, -3] \\cup [3, \\infty)$。\n\n> **注意。** 能除以 $e^{x}$，只是因为它是正的。可能为负或为零的因式（比如 $x$）不能这样约去，它要在符号表里单独占一行。",
      ),
      generate(rng) {
        const [u, v] = distinctPair(rng, -5, 5);
        const expStr = rng.pick(["e^{x}", "2^{x}", "3^{x}"]);
        const fs = [lin(1, -u), lin(1, -v)];
        const op = rng.pick(ops);
        const set = chartSet(1, fs, op);
        const polyName = `(x${tail(-u)})(x${tail(-v)})`;
        const ineq = `${polyName}${expStr} ${opL[op]} 0`;
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [chartSet(-1, fs, op), chartSet(1, fs, toggled[op]), complement(set)],
          solution: join(
            label(1, "Divide out the exponential", "约去指数式"),
            t(
              `Since $${expStr} > 0$ for every real $x$, dividing both sides by it keeps the direction:`,
              `因为对每个实数 $x$ 都有 $${expStr} > 0$，两边同除以它，不等号方向不变：`,
            ),
            t(disp(`${polyName} ${opL[op]} 0`), disp(`${polyName} ${opL[op]} 0`)),
            para,
            label(2, "Solve the quadratic inequality", "解二次不等式"),
            t(
              `The roots are $${Math.min(u, v)}$ and $${Math.max(u, v)}$, and the product is positive outside them and negative between them. ${ends(op).en} The solution is $${setL(set)}$.`,
              `两根为 $${Math.min(u, v)}$ 和 $${Math.max(u, v)}$，乘积在两根之外为正、之间为负。${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`,
            ),
            signTests(
              picks(set).map((x) => {
                const [a, b] = [x.sub(Q.of(u)), x.sub(Q.of(v))];
                const e = `${expStr.slice(0, expStr.indexOf("^"))}^{${x.toLatex()}}`;
                return { x, work: `${paren(a)} \\cdot ${paren(b)} \\cdot ${e}`, sign: a.mul(b).sign() };
              }),
              set,
              op,
            ),
          ),
        });
      },
    },
    {
      id: "products-where-exponentials-change-sign",
      title: t("Factors of the form $b^{x} - c$", "形如 $b^{x} - c$ 的因式"),
      explanation: t(
        "The factor $(2^{x} - 4)$ changes sign at $x = 2$, since $2^{x} < 4$ when $x < 2$ and $2^{x} > 4$ when $x > 2$. To solve $(x + 1)(2^{x} - 4) < 0$:\n\n1. **Zeros**: $x = -1$ and $x = 2$.\n2. **Intervals**: on $(-1, 2)$, $(x + 1) > 0$ while $(2^{x} - 4) < 0$, so the product is negative.\n\nThe solution is $(-1, 2)$.\n\n> **Watch out.** The factor $2^{x} - 4$ is zero at $x = 2$, where $2^{x} = 4$, not at $x = 4$. Solve the exponential equation to find the critical point.",
        "因式 $(2^{x} - 4)$ 在 $x = 2$ 处变号，因为当 $x < 2$ 时 $2^{x} < 4$，当 $x > 2$ 时 $2^{x} > 4$。求解 $(x + 1)(2^{x} - 4) < 0$ 的步骤：\n\n1. **零点**：$x = -1$ 与 $x = 2$。\n2. **区间**：在 $(-1, 2)$ 上，$(x + 1) > 0$ 而 $(2^{x} - 4) < 0$，乘积为负。\n\n解集是 $(-1, 2)$。\n\n> **注意。** 因式 $2^{x} - 4$ 在 $2^{x} = 4$ 即 $x = 2$ 处为零，而不是在 $x = 4$ 处。要先解指数方程，才能找到临界点。",
      ),
      generate(rng) {
        const u = rng.int(-4, 0);
        const e = rng.int(1, 3);
        const c = 2 ** e;
        const op = rng.pick(ops);
        const ineq = `(x${tail(-u)})(2^{x} - ${c}) ${opL[op]} 0`;
        const fs = [lin(1, -u), lin(1, -e)];
        const set = chartSet(1, fs, op);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [chartSet(-1, fs, op), chartSet(1, fs, toggled[op]), complement(set)],
          solution: join(
            label(1, "Find the zeros", "找出零点"),
            t(
              `The factor $x${tail(-u)}$ is zero at $x = ${u}$, and $2^{x} - ${c}$ is zero where $2^{x} = 2^{${e}}$, at $x = ${e}$.`,
              `因式 $x${tail(-u)}$ 在 $x = ${u}$ 处为零；$2^{x} - ${c}$ 在 $2^{x} = 2^{${e}}$ 即 $x = ${e}$ 处为零。`,
            ),
            para,
            label(2, "Read the signs", "确定符号"),
            t(
              `Both factors are positive to the right of $${e}$, and each changes sign at its zero, since $2^{x}$ is increasing. So the product is positive on $(${e}, \\infty)$, negative on $(${u}, ${e})$ and positive on $(-\\infty, ${u})$. ${ends(op).en} The solution is $${setL(set)}$.`,
              `两个因式在 $${e}$ 的右边都为正；$2^{x}$ 单调递增，所以每个因式经过自己的零点时变号。于是乘积在 $(${e}, \\infty)$ 上为正，在 $(${u}, ${e})$ 上为负，在 $(-\\infty, ${u})$ 上为正。${ends(op)["zh-CN"]}解集是 $${setL(set)}$。`,
            ),
            signTests(
              [Q.of(u - 1), Q.of(u), e - u >= 2 ? Q.of(u + 1) : Q.of(2 * u + 1, 2), Q.of(e), Q.of(e + 1)].map((x) => {
                const a = x.sub(Q.of(u));
                const whole = Number.isInteger(x.toNumber());
                const b = whole ? Q.of(2).pow(x.toNumber()).sub(Q.of(c)) : undefined;
                const sign = a.sign() * Math.sign(x.toNumber() - e);
                return {
                  x,
                  work: b ? `${paren(a)} \\cdot ${paren(b)} = ${a.mul(b).toLatex()}` : `${paren(a)} \\cdot (2^{${x.toLatex()}} - ${c})`,
                  sign,
                };
              }),
              set,
              op,
            ),
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
  intro: t(
    `You can solve a product inequality with a sign table, and you know that a quadratic with a negative discriminant has no real roots, so it keeps one sign for every $x$. Such a factor needs no row in the table. If it is always positive, dividing by it leaves the inequality as it is; if it is always negative, dividing by it reverses the inequality.

Solve $(x^{2} + 2x + 5)(x - 1) \\ge 0$. The quadratic has discriminant $2^{2} - 4 \\cdot 5 = -16 < 0$ and a positive leading coefficient, so it is positive for every $x$. Dividing by it keeps the direction:

$$x - 1 \\ge 0 \\implies x \\ge 1$$

The solution is $[1, \\infty)$. For instance, $x = 0$ gives $5 \\cdot (-1) = -5$, which is not at least $0$, and indeed $0$ is not in the solution.`,
    `你会用符号表解乘积不等式，也知道判别式为负的二次式没有实数根，所以对每个 $x$ 都保持同一个符号。这样的因式在符号表里不需要占一行：如果它恒为正，除以它不等式不变；如果它恒为负，除以它不等号反向。

解 $(x^{2} + 2x + 5)(x - 1) \\ge 0$。这个二次式的判别式是 $2^{2} - 4 \\cdot 5 = -16 < 0$，首项系数为正，所以它对每个 $x$ 都为正。除以它，方向不变：

$$x - 1 \\ge 0 \\implies x \\ge 1$$

解集是 $[1, \\infty)$。例如 $x = 0$ 时，乘积为 $5 \\cdot (-1) = -5$，小于 $0$，而 $0$ 确实不在解集中。`,
  ),
  knowledgePoints: [
    {
      id: "factors-with-no-real-roots",
      title: t("Strictly positive quadratic factors", "恒为正的二次因式"),
      explanation: t(
        "A quadratic factor $x^{2} + c$ with $c > 0$ (or $x^{2} + px + q$ with $p^{2} - 4q < 0$ and $a > 0$) is **strictly positive** for every real number $x$. It never equals zero and never changes sign. You can divide both sides by it:\n\n$$(x^{2} + 4)(x - 5) < 0 \\iff x - 5 < 0 \\iff x < 5$$\n\nSo the solution is $(-\\infty, 5)$.\n\n> **Watch out.** Make sure the factor really has no real roots before dividing it out. $x^{2} - 4$ looks similar to $x^{2} + 4$, but it is zero at $\\pm 2$ and changes sign there.",
        "当 $c > 0$ 时，二次因式 $x^{2} + c$（或判别式 $p^{2} - 4q < 0$ 且 $a > 0$ 的二次式 $x^{2} + px + q$）对任意实数 $x$ 都**恒为正**。它既不为零，也不变号。两边可直接除以该因式：\n\n$$(x^{2} + 4)(x - 5) < 0 \\iff x - 5 < 0 \\iff x < 5$$\n\n所以解集是 $(-\\infty, 5)$。\n\n> **注意。** 约去因式之前，要确认它真的没有实数根。$x^{2} - 4$ 看上去和 $x^{2} + 4$ 差不多，但它在 $\\pm 2$ 处为零，并在那里变号。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const r = rng.int(-6, 6);
        const op = rng.pick(ops);
        const ineq = `(x^{2} + ${c})(${linear(1, -r)}) ${opL[op]} 0`;
        const set = ray(op, r);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [ray(reversed[op], r), union(mk(Q.of(-c), Q.of(r))), complement(set)],
          solution: join(
            label(1, "Find the sign of the quadratic", "确定二次式的符号"),
            t(
              `Since $x^{2} \\ge 0$, the factor satisfies $x^{2} + ${c} \\ge ${c} > 0$ for every real $x$.`,
              `因为 $x^{2} \\ge 0$，所以对每个实数 $x$ 都有 $x^{2} + ${c} \\ge ${c} > 0$。`,
            ),
            para,
            label(2, "Divide it out", "约去它"),
            t("Dividing by a positive number keeps the direction:", "除以正数，不等号方向不变："),
            t(disp(`${linear(1, -r)} ${opL[op]} 0`, `x ${opL[op]} ${r}`), disp(`${linear(1, -r)} ${opL[op]} 0`, `x ${opL[op]} ${r}`)),
            para,
            t(`The solution is $${setL(set)}$.`, `解集是 $${setL(set)}$。`),
            substituted(
              picks(set),
              set,
              (x) => [
                x
                  .mul(x)
                  .add(Q.of(c))
                  .mul(x.sub(Q.of(r))),
                Q.zero,
              ],
              op,
            ),
          ),
        });
      },
    },
    {
      id: "negative-definite-factors",
      title: t("Strictly negative factors", "恒为负的因式"),
      explanation: t(
        "Similarly, $-x^{2} - 3 = -(x^{2} + 3)$ is strictly negative for all real $x$. Dividing both sides by it **reverses** the inequality direction:\n\n$$(-x^{2} - 3)(2x - 8) \\le 0 \\iff 2x - 8 \\ge 0 \\iff x \\ge 4$$\n\nSo the solution is $[4, \\infty)$.\n\n> **Watch out.** Reverse the inequality once, when you divide by the negative factor. The steps after that, such as dividing $2x - 8 \\ge 0$ by $2$, keep the new direction.",
        "同理，$-x^{2} - 3 = -(x^{2} + 3)$ 对所有实数 $x$ 都恒为负。两边同时除以它会**反转**不等号方向：\n\n$$(-x^{2} - 3)(2x - 8) \\le 0 \\iff 2x - 8 \\ge 0 \\iff x \\ge 4$$\n\n所以解集是 $[4, \\infty)$。\n\n> **注意。** 只在除以负因式的那一步反转一次不等号。之后的步骤（比如把 $2x - 8 \\ge 0$ 两边除以 $2$）保持新的方向。",
      ),
      generate(rng) {
        const c = rng.int(1, 6);
        const r = rng.int(-5, 5);
        const op = rng.pick(ops);
        const ineq = `(-x^{2} - ${c})(${linear(1, -r)}) ${opL[op]} 0`;
        const set = ray(reversed[op], r);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [ray(op, r), complement(set), union(point(r))],
          solution: join(
            label(1, "Find the sign of the quadratic", "确定二次式的符号"),
            t(
              `Since $x^{2} \\ge 0$, the factor satisfies $-x^{2} - ${c} \\le -${c} < 0$ for every real $x$.`,
              `因为 $x^{2} \\ge 0$，所以对每个实数 $x$ 都有 $-x^{2} - ${c} \\le -${c} < 0$。`,
            ),
            para,
            label(2, "Divide it out", "约去它"),
            t("Dividing by a negative number reverses the direction:", "除以负数，不等号反向："),
            t(
              disp(`${linear(1, -r)} ${opL[reversed[op]]} 0`, `x ${opL[reversed[op]]} ${r}`),
              disp(`${linear(1, -r)} ${opL[reversed[op]]} 0`, `x ${opL[reversed[op]]} ${r}`),
            ),
            para,
            t(`The solution is $${setL(set)}$.`, `解集是 $${setL(set)}$。`),
            substituted(
              picks(set),
              set,
              (x) => [
                x
                  .mul(x)
                  .add(Q.of(c))
                  .neg()
                  .mul(x.sub(Q.of(r))),
                Q.zero,
              ],
              op,
            ),
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
  intro: t(
    "You know the $n$-th term of a geometric sequence, $a_{n} = a_{1} r^{n-1}$, and you can solve an exponential inequality by comparing powers. Together they answer questions such as when a quantity that grows by a fixed factor first passes a target. Because $n$ counts terms, the answer is the smallest whole number that works, found by comparing nearby powers.\n\nFor $a_{1} = 5$ and $r = 3$, find the smallest $n$ with $a_{n} > 1000$:\n\n$$5 \\cdot 3^{n-1} > 1000 \\implies 3^{n-1} > 200$$\n\nSince $3^{4} = 81$ and $3^{5} = 243$, the exponent $n - 1$ must be at least $5$, so $n = 6$. Indeed $a_{5} = 405$ is below $1000$ and $a_{6} = 1215$ is above it.",
    "你会写等比数列的第 $n$ 项 $a_{n} = a_{1} r^{n-1}$，也会通过比较幂来解指数不等式。把两者合起来，就能回答这样的问题：一个按固定倍数增长的量，什么时候第一次超过目标。因为 $n$ 是项数，答案是满足条件的最小整数，可以通过比较相邻的幂找到。\n\n设 $a_{1} = 5$、$r = 3$，求使 $a_{n} > 1000$ 的最小 $n$：\n\n$$5 \\cdot 3^{n-1} > 1000 \\implies 3^{n-1} > 200$$\n\n因为 $3^{4} = 81$、$3^{5} = 243$，指数 $n - 1$ 至少是 $5$，所以 $n = 6$。确实 $a_{5} = 405$ 小于 $1000$，而 $a_{6} = 1215$ 大于 $1000$。",
  ),
  knowledgePoints: [
    {
      id: "terms-of-a-geometric-sequence-exceeding-a-bound",
      title: t("Term of a geometric sequence exceeding a bound", "等比数列某项超过阈值"),
      explanation: t(
        "For a geometric sequence with first term $a_{1}$ and common ratio $r > 1$, the $n$-th term is $a_{n} = a_{1} r^{n-1}$. To find the smallest $n$ such that $a_{n} > M$:\n\n$$a_{1} r^{n-1} > M \\implies r^{n-1} > \\frac{M}{a_{1}} \\implies n - 1 > \\frac{\\ln(M / a_{1})}{\\ln r}$$\n\nFor $a_{1} = 3$ and $r = 2$, to exceed $100$:\n\n$$3 \\cdot 2^{n-1} > 100 \\implies 2^{n-1} > 33.\\overline{3} \\implies n - 1 \\ge 6 \\implies n \\ge 7$$\n\nSo the smallest integer is $n = 7$.\n\n> **Watch out.** The exponent is $n - 1$, not $n$, because the first term is $a_{1} = a_{1} r^{0}$. Solving $r^{n} > \\frac{M}{a_{1}}$ instead gives an answer one too small.",
        "对于首项为 $a_{1}$、公比为 $r > 1$ 的等比数列，第 $n$ 项为 $a_{n} = a_{1} r^{n-1}$。求使得 $a_{n} > M$ 成立的最小正整数 $n$：\n\n$$a_{1} r^{n-1} > M \\implies r^{n-1} > \\frac{M}{a_{1}} \\implies n - 1 > \\frac{\\ln(M / a_{1})}{\\ln r}$$\n\n以 $a_{1} = 3$、$r = 2$ 超过 $100$ 为例：\n\n$$3 \\cdot 2^{n-1} > 100 \\implies 2^{n-1} > 33.\\overline{3} \\implies n - 1 \\ge 6 \\implies n \\ge 7$$\n\n所以最小的正整数是 $n = 7$。\n\n> **注意。** 指数是 $n - 1$ 而不是 $n$，因为首项是 $a_{1} = a_{1} r^{0}$。如果解成 $r^{n} > \\frac{M}{a_{1}}$，答案会小 $1$。",
      ),
      generate(rng) {
        const a1 = rng.int(2, 5);
        const r = rng.pick([2, 3]);
        const nTarget = rng.int(5, 8);
        const termVal = a1 * r ** (nTarget - 1);
        const M = termVal - rng.int(1, Math.floor(termVal / 3));
        const ratio = Q.of(M, a1).toLatex();
        const terms = Array.from({ length: nTarget }, (_, i) => a1 * r ** i);
        return numberProblem({
          prompt: t(
            `A geometric sequence has first term $a_{1} = ${a1}$ and common ratio $r = ${r}$. Find the smallest positive integer $n$ such that $a_{n} > ${M}$.`,
            `一个等比数列的首项为 $a_{1} = ${a1}$，公比为 $r = ${r}$。求使得 $a_{n} > ${M}$ 成立的最小正整数 $n$。`,
          ),
          answer: nTarget,
          wrong: [nTarget - 1, nTarget + 1, nTarget + 2],
          solution: join(
            label(1, "Write the inequality", "列出不等式"),
            t(
              `The $n$-th term is $a_{n} = ${a1} \\cdot ${r}^{n-1}$, so we need`,
              `第 $n$ 项为 $a_{n} = ${a1} \\cdot ${r}^{n-1}$，所以要求`,
            ),
            t(
              disp(`${a1} \\cdot ${r}^{n-1} > ${M}`, `${r}^{n-1} > ${ratio}`),
              disp(`${a1} \\cdot ${r}^{n-1} > ${M}`, `${r}^{n-1} > ${ratio}`),
            ),
            para,
            label(2, "Compare powers", "比较幂"),
            t(
              `Since $${r}^{${nTarget - 2}} = ${r ** (nTarget - 2)}$ is not more than $${ratio}$ but $${r}^{${nTarget - 1}} = ${r ** (nTarget - 1)}$ is, the exponent $n - 1$ must be at least $${nTarget - 1}$. The smallest integer is $n = ${nTarget}$.`,
              `因为 $${r}^{${nTarget - 2}} = ${r ** (nTarget - 2)}$ 不超过 $${ratio}$，而 $${r}^{${nTarget - 1}} = ${r ** (nTarget - 1)}$ 超过它，指数 $n - 1$ 至少是 $${nTarget - 1}$。最小正整数为 $n = ${nTarget}$。`,
            ),
            checked(
              t(
                `List the terms, multiplying by $${r}$ each time: $${terms.join(", ")}$. The first one above $${M}$ is $a_{${nTarget}} = ${termVal}$, so $n = ${nTarget}$.`,
                `逐项乘以 $${r}$，列出各项：$${terms.join(", ")}$。第一个超过 $${M}$ 的是 $a_{${nTarget}} = ${termVal}$，所以 $n = ${nTarget}$。`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "sums-of-a-geometric-series-exceeding-a-bound",
      title: t("Partial sums of a geometric series exceeding a bound", "等比数列前项和超过阈值"),
      explanation: t(
        "The sum of the first $n$ terms of a geometric series is $S_{n} = a_{1} \\frac{r^{n} - 1}{r - 1}$. For $a_{1} = 1$ and $r = 2$:\n\n$$S_{n} = 2^{n} - 1 > 50 \\implies 2^{n} > 51 \\implies n \\ge 6$$\n\nSo the smallest integer is $n = 6$.\n\n> **Watch out.** Move the $1$ to the other side with its sign changed: $2^{n} - 1 > 50$ gives $2^{n} > 51$, not $2^{n} > 49$.",
        "等比数列前 $n$ 项和为 $S_{n} = a_{1} \\frac{r^{n} - 1}{r - 1}$。以 $a_{1} = 1$、$r = 2$ 为例：\n\n$$S_{n} = 2^{n} - 1 > 50 \\implies 2^{n} > 51 \\implies n \\ge 6$$\n\n所以最小的正整数是 $n = 6$。\n\n> **注意。** 把 $1$ 移到另一边时要变号：$2^{n} - 1 > 50$ 得 $2^{n} > 51$，而不是 $2^{n} > 49$。",
      ),
      generate(rng) {
        const nTarget = rng.int(6, 9);
        const sumVal = 2 ** nTarget - 1;
        const M = sumVal - rng.int(1, 2 ** (nTarget - 2));
        const sums = Array.from({ length: nTarget }, (_, i) => 2 ** (i + 1) - 1);
        return numberProblem({
          prompt: t(
            `For the geometric sequence with $a_{1} = 1$ and common ratio $r = 2$, find the smallest positive integer $n$ such that the sum of the first $n$ terms $S_{n} > ${M}$.`,
            `对于首项 $a_{1} = 1$、公比 $r = 2$ 的等比数列，求使得前 $n$ 项和 $S_{n} > ${M}$ 成立的最小正整数 $n$。`,
          ),
          answer: nTarget,
          wrong: [nTarget - 1, nTarget + 1, nTarget + 2],
          solution: join(
            label(1, "Write the sum", "写出和"),
            t(
              "The sum formula is $S_{n} = \\frac{1(2^{n} - 1)}{2 - 1} = 2^{n} - 1$, so we need",
              "前 $n$ 项和公式为 $S_{n} = \\frac{1(2^{n} - 1)}{2 - 1} = 2^{n} - 1$，所以要求",
            ),
            t(disp(`2^{n} - 1 > ${M}`, `2^{n} > ${M + 1}`), disp(`2^{n} - 1 > ${M}`, `2^{n} > ${M + 1}`)),
            para,
            label(2, "Compare powers", "比较幂"),
            t(
              `Since $2^{${nTarget - 1}} = ${2 ** (nTarget - 1)}$ is not more than $${M + 1}$ but $2^{${nTarget}} = ${2 ** nTarget}$ is, the smallest integer is $n = ${nTarget}$.`,
              `因为 $2^{${nTarget - 1}} = ${2 ** (nTarget - 1)}$ 不超过 $${M + 1}$，而 $2^{${nTarget}} = ${2 ** nTarget}$ 超过它，所以最小正整数为 $n = ${nTarget}$。`,
            ),
            checked(
              t(
                `Add the terms $1, 2, 4, \\ldots$ one at a time. The partial sums are $${sums.join(", ")}$, and the first one above $${M}$ is $S_{${nTarget}} = ${sumVal}$.`,
                `逐项加上 $1, 2, 4, \\ldots$，部分和依次是 $${sums.join(", ")}$，第一个超过 $${M}$ 的是 $S_{${nTarget}} = ${sumVal}$。`,
              ),
            ),
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
    "Solve rational inequalities of the form $\\frac{P(x)}{Q(x)} \\text{ op } 0$, remembering that denominator zeros (poles) are never included in the solution set.",
    "解形如 $\\frac{P(x)}{Q(x)} \\text{ op } 0$ 的分式不等式，牢记分母零点（奇点）决不能包含在解集中。",
  ),
  prerequisites: ["solving-polynomial-inequalities-using-the-sign-table-method", "vertical-asymptotes-of-rational-functions"],
  encompasses: [{ topic: "solving-polynomial-inequalities-using-the-sign-table-method", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSA.REI.B.4"],
  intro: t(
    "You can solve a polynomial inequality with a sign table, and you know that a rational function is not defined where its denominator is zero. A quotient can change sign only where its numerator or its denominator is zero, so the same sign table works, with one difference: a zero of the denominator is never a solution. Rational inequalities answer questions such as when an average cost per item falls below a target.\n\nSolve $\\frac{x + 2}{x - 4} > 0$. The critical points are $x = -2$, where the numerator is zero, and $x = 4$, where the denominator is zero. Test one number on each interval:\n\n$$x = -3: \\frac{-1}{-7} > 0, \\quad x = 0: \\frac{2}{-4} < 0, \\quad x = 5: \\frac{7}{1} > 0$$\n\nSo the solution is $(-\\infty, -2) \\cup (4, \\infty)$. Neither critical point belongs to it: the quotient is $0$ at $-2$ and is not defined at $4$.",
    "你会用符号表解多项式不等式，也知道有理函数在分母为零处没有定义。商只可能在分子或分母为零的地方变号，所以同样可以用符号表，只有一点不同：分母的零点绝不是解。分式不等式可以回答这样的问题：每件物品的平均成本什么时候低于目标。\n\n解 $\\frac{x + 2}{x - 4} > 0$。临界点是 $x = -2$（分子为零）和 $x = 4$（分母为零）。在每个区间上各试一个数：\n\n$$x = -3: \\frac{-1}{-7} > 0, \\quad x = 0: \\frac{2}{-4} < 0, \\quad x = 5: \\frac{7}{1} > 0$$\n\n所以解集是 $(-\\infty, -2) \\cup (4, \\infty)$。两个临界点都不在解集中：商在 $-2$ 处为 $0$，在 $4$ 处没有定义。",
  ),
  knowledgePoints: [
    {
      id: "basic-rational-inequalities",
      title: t("Simple rational inequalities", "简单的分式不等式"),
      explanation: t(
        "To solve $\\frac{x - 1}{x + 3} \\le 0$:\n\n1. **Critical values**: numerator is zero at $x = 1$; denominator is zero at $x = -3$.\n2. **Sign table**: the quotient has the same sign as $(x - 1)(x + 3)$ on each interval, being negative on $(-3, 1)$.\n3. **Endpoints**: $x = 1$ gives $0 \\le 0$ (included), but $x = -3$ makes the fraction invalid since division by zero is not defined (excluded!).\n\nThe solution is $(-3, 1]$.\n\n> **Watch out.** Do not multiply both sides by $x + 3$ to clear the fraction. Its sign depends on $x$, so the direction of the inequality would be right on one side of $-3$ and wrong on the other.",
        "求解 $\\frac{x - 1}{x + 3} \\le 0$ 的步骤：\n\n1. **关键值**：分子在 $x = 1$ 处为零；分母在 $x = -3$ 处为零。\n2. **符号表**：商在每个区间上的正负号与乘积 $(x - 1)(x + 3)$ 完全相同，在 $(-3, 1)$ 上为负。\n3. **端点**：$x = 1$ 使得 $0 \\le 0$（包含）；但 $x = -3$ 使得分母为零无意义（必须排除！）。\n\n解集是 $(-3, 1]$。\n\n> **注意。** 不要两边同乘 $x + 3$ 来去分母。它的符号随 $x$ 而变，不等号的方向在 $-3$ 的一侧对，在另一侧就错了。",
      ),
      generate(rng) {
        const [u, v] = distinctPair(rng, -6, 6);
        const top = lin(1, -u);
        const bot = lin(1, -v, 1, { pole: true });
        const fs = [top, bot];
        const op = rng.pick(ops);
        const set = chartSet(1, fs, op);
        const expr = `\\frac{x${tail(-u)}}{x${tail(-v)}}`;
        return intervalProblem({
          prompt: solvePrompt(`${expr} ${opL[op]} 0`),
          set,
          form: "interval",
          wrong: [chartSet(1, [top, lin(1, -v)], op), chartSet(-1, fs, op), complement(set)],
          solution: chartSolution(
            1,
            fs,
            expr,
            op,
            set,
            undefined,
            quotientTests(set, [Q.of(v)], (x) => [x.sub(Q.of(u)).div(x.sub(Q.of(v))), Q.zero], op),
          ),
        });
      },
    },
    {
      id: "rational-inequalities-with-multiple-factors",
      title: t("Rational inequalities with multiple factors", "含多个因式的分式不等式"),
      explanation: t(
        "For $\\frac{(x - 2)(x + 4)}{x - 1} > 0$, the critical points are $-4, 1, 2$. The denominator root $1$ must be excluded under all circumstances. Checking signs on the intervals gives $(-4, 1) \\cup (2, \\infty)$.\n\n> **Watch out.** With $\\le$ or $\\ge$, the zeros of the numerator are included, but a zero of the denominator never is. Write a round bracket there.",
        "对于 $\\frac{(x - 2)(x + 4)}{x - 1} > 0$，关键点为 $-4, 1, 2$。分母零点 $1$ 在任何情况下都必须排除。在各区间检验符号可得解集为 $(-4, 1) \\cup (2, \\infty)$。\n\n> **注意。** 对 $\\le$ 或 $\\ge$，分子的零点包含在内，但分母的零点绝不包含。那里要用圆括号。",
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
          solution: chartSolution(
            1,
            fs,
            expr,
            op,
            set,
            undefined,
            quotientTests(
              set,
              [Q.of(r2)],
              (x) => [
                x
                  .sub(Q.of(r1))
                  .mul(x.sub(Q.of(r3)))
                  .div(x.sub(Q.of(r2))),
                Q.zero,
              ],
              op,
            ),
          ),
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
  intro: t(
    "You can solve a rational inequality with $0$ on one side by a sign table. When the other side is not $0$, first bring everything to one side and combine it into a single fraction; then the sign table applies as before. Multiplying both sides by the denominator does not work, because the denominator can be positive or negative.\n\nSolve $\\frac{3}{x - 1} < 1$. Subtract $1$ and combine:\n\n$$\\frac{3}{x - 1} - 1 < 0 \\implies \\frac{3 - (x - 1)}{x - 1} < 0 \\implies \\frac{4 - x}{x - 1} < 0$$\n\nThe critical points are $x = 4$ and $x = 1$. At $x = 0$ the fraction is $\\frac{4}{-1} < 0$, at $x = 2$ it is $\\frac{2}{1} > 0$, and at $x = 5$ it is $\\frac{-1}{4} < 0$. So the solution is $(-\\infty, 1) \\cup (4, \\infty)$. For instance, $x = 5$ gives $\\frac{3}{4} < 1$ in the original inequality.",
    "你会用符号表解一边为 $0$ 的分式不等式。另一边不是 $0$ 时，先把所有项移到一边并通分成一个分式，然后照常用符号表。两边同乘分母是不行的，因为分母可正可负。\n\n解 $\\frac{3}{x - 1} < 1$。减去 $1$ 并通分：\n\n$$\\frac{3}{x - 1} - 1 < 0 \\implies \\frac{3 - (x - 1)}{x - 1} < 0 \\implies \\frac{4 - x}{x - 1} < 0$$\n\n临界点是 $x = 4$ 和 $x = 1$。$x = 0$ 时分式为 $\\frac{4}{-1} < 0$，$x = 2$ 时为 $\\frac{2}{1} > 0$，$x = 5$ 时为 $\\frac{-1}{4} < 0$。所以解集是 $(-\\infty, 1) \\cup (4, \\infty)$。例如 $x = 5$ 代入原不等式得 $\\frac{3}{4} < 1$。",
  ),
  knowledgePoints: [
    {
      id: "rational-inequalities-with-a-non-zero-constant",
      title: t("Comparing a rational expression to a non-zero number", "分式与非零常数比较"),
      explanation: t(
        "**Never** multiply both sides by the denominator, because its sign changes depending on $x$! Instead, subtract the constant and find a common denominator:\n\n$$\\frac{x + 1}{x - 2} \\ge 2 \\implies \\frac{x + 1}{x - 2} - 2 \\ge 0 \\implies \\frac{(x + 1) - 2(x - 2)}{x - 2} \\ge 0 \\implies \\frac{-x + 5}{x - 2} \\ge 0$$\n\nThe critical values are $x = 5$ (numerator zero) and $x = 2$ (pole). Testing intervals gives $(2, 5]$. Note that $2$ is open because it makes the denominator zero.\n\n> **Watch out.** Subtract the constant times the whole denominator. In the example, $2(x - 2) = 2x - 4$, so the numerator is $(x + 1) - 2x + 4$; dropping the parentheses gives $x + 1 - 2x - 2$, which is wrong.",
        "**切勿**直接在两边乘以分母，因为分母的正负号随 $x$ 而变！正确方法是移项后通分：\n\n$$\\frac{x + 1}{x - 2} \\ge 2 \\implies \\frac{x + 1}{x - 2} - 2 \\ge 0 \\implies \\frac{(x + 1) - 2(x - 2)}{x - 2} \\ge 0 \\implies \\frac{-x + 5}{x - 2} \\ge 0$$\n\n关键值是 $x = 5$（分子零点）与 $x = 2$（奇点）。检验各区间可得解集为 $(2, 5]$。注意 $2$ 处为开区间，因为它使分母为零。\n\n> **注意。** 要减去常数乘以整个分母。在例子中 $2(x - 2) = 2x - 4$，所以分子是 $(x + 1) - 2x + 4$；去掉括号写成 $x + 1 - 2x - 2$ 就错了。",
      ),
      generate(rng) {
        const c = rng.int(-4, 4);
        const k = rng.pick([2, 3]);
        const numRoot = c + rng.pick([-3, -2, 2, 3]);
        const b = (k - 1) * numRoot - k * c;
        const topOrig = linear(1, b);
        const botOrig = linear(1, -c);
        const op = rng.pick(ops);
        const topFact = lin(-k + 1, b + k * c);
        const botFact = lin(1, -c, 1, { pole: true });
        const fs = [topFact, botFact];
        const set = chartSet(1, fs, op);
        const ineq = `\\frac{${topOrig}}{${botOrig}} ${opL[op]} ${k}`;
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [chartSet(-1, fs, op), chartSet(1, [lin(1, -numRoot), lin(1, -c)], op), complement(set)],
          solution: chartSolution(
            1,
            fs,
            `\\frac{${linear(1 - k, b + k * c)}}{${botOrig}}`,
            op,
            set,
            t(
              `Subtract $${k}$ and combine over a common denominator:${disp(
                `\\frac{${topOrig}}{${botOrig}} - ${k} ${opL[op]} 0`,
                `\\frac{(${topOrig}) - ${k}(${botOrig})}{${botOrig}} ${opL[op]} 0`,
                `\\frac{${linear(1 - k, b + k * c)}}{${botOrig}} ${opL[op]} 0`,
              )}`,
              `减去 $${k}$ 并通分：${disp(
                `\\frac{${topOrig}}{${botOrig}} - ${k} ${opL[op]} 0`,
                `\\frac{(${topOrig}) - ${k}(${botOrig})}{${botOrig}} ${opL[op]} 0`,
                `\\frac{${linear(1 - k, b + k * c)}}{${botOrig}} ${opL[op]} 0`,
              )}`,
            ),
            quotientTests(set, [Q.of(c)], (x) => [x.add(Q.of(b)).div(x.sub(Q.of(c))), Q.of(k)], op),
          ),
        });
      },
    },
    {
      id: "sum-of-two-rational-expressions",
      title: t("Comparing two rational expressions", "比较两个分式"),
      explanation: t(
        "To solve $\\frac{1}{x - 1} < \\frac{1}{x - 3}$, subtract the right-hand side to get zero on one side:\n\n$$\\frac{1}{x - 1} - \\frac{1}{x - 3} < 0 \\implies \\frac{(x - 3) - (x - 1)}{(x - 1)(x - 3)} < 0 \\implies \\frac{-2}{(x - 1)(x - 3)} < 0$$\n\nDividing by $-2$ reverses the inequality: $\\frac{1}{(x - 1)(x - 3)} > 0$, which yields $(-\\infty, 1) \\cup (3, \\infty)$.\n\n> **Watch out.** Do not cross-multiply. $\\frac{1}{x - 1} < \\frac{1}{x - 3}$ is not the same as $x - 3 < x - 1$, because the denominators can be negative.",
        "求解 $\\frac{1}{x - 1} < \\frac{1}{x - 3}$ 时，先移项使右边为零：\n\n$$\\frac{1}{x - 1} - \\frac{1}{x - 3} < 0 \\implies \\frac{(x - 3) - (x - 1)}{(x - 1)(x - 3)} < 0 \\implies \\frac{-2}{(x - 1)(x - 3)} < 0$$\n\n除以 $-2$ 反转不等号：$\\frac{1}{(x - 1)(x - 3)} > 0$，可得解集为 $(-\\infty, 1) \\cup (3, \\infty)$。\n\n> **注意。** 不要交叉相乘。$\\frac{1}{x - 1} < \\frac{1}{x - 3}$ 与 $x - 3 < x - 1$ 并不等价，因为分母可能是负的。",
      ),
      generate(rng) {
        const [u, v] = distinctPair(rng, -5, 5).sort((p, q) => p - q);
        const op = rng.pick(ops);
        const ineq = `\\frac{1}{x${tail(-u)}} ${opL[op]} \\frac{1}{x${tail(-v)}}`;
        const diff = u - v;
        const fs = [lin(1, -u, 1, { pole: true }), lin(1, -v, 1, { pole: true })];
        const set = chartSet(diff, fs, op);
        return intervalProblem({
          prompt: solvePrompt(ineq),
          set,
          form: "interval",
          wrong: [chartSet(-diff, fs, op), chartSet(1, fs, toggled[op]), complement(set)],
          solution: chartSolution(
            diff,
            fs,
            `\\frac{${diff}}{(x${tail(-u)})(x${tail(-v)})}`,
            op,
            set,
            t(
              `Subtract to get zero on the right side and combine over a common denominator:${disp(
                `\\frac{1}{x${tail(-u)}} - \\frac{1}{x${tail(-v)}} ${opL[op]} 0`,
                `\\frac{(x${tail(-v)}) - (x${tail(-u)})}{(x${tail(-u)})(x${tail(-v)})} ${opL[op]} 0`,
                `\\frac{${diff}}{(x${tail(-u)})(x${tail(-v)})} ${opL[op]} 0`,
              )}`,
              `移项并通分，使右边为零：${disp(
                `\\frac{1}{x${tail(-u)}} - \\frac{1}{x${tail(-v)}} ${opL[op]} 0`,
                `\\frac{(x${tail(-v)}) - (x${tail(-u)})}{(x${tail(-u)})(x${tail(-v)})} ${opL[op]} 0`,
                `\\frac{${diff}}{(x${tail(-u)})(x${tail(-v)})} ${opL[op]} 0`,
              )}`,
            ),
            quotientTests(set, [Q.of(u), Q.of(v)], (x) => [Q.one.div(x.sub(Q.of(u))), Q.one.div(x.sub(Q.of(v)))], op),
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
  intro: t(
    "You can graph a linear inequality in two variables: draw the boundary line, solid or dashed, and shade the side whose points make the inequality true. The same method works when the boundary is a curve, such as the parabola from a quadratic function. Such regions describe, for example, the heights a thrown ball stays under.\n\nGraph $y \\le 4 - x^{2}$. The boundary $y = 4 - x^{2}$ is a parabola opening down, with vertex $(0, 4)$ and roots $\\pm 2$. It is solid, because $\\le$ includes it. Test the origin:\n\n$$0 \\le 4 - 0^{2} = 4$$\n\nThis is true, so the region is the side of the curve that holds the origin, the points on or below the parabola. A point above it, such as $(0, 5)$, gives $5 \\le 4$, which is false.",
    "你会画二元一次不等式的图像：画出边界直线（实线或虚线），再给使不等式成立的那一侧涂上阴影。边界是曲线时（比如二次函数的抛物线），方法相同。这样的区域可以描述，例如抛出的球始终低于哪些高度。\n\n画出 $y \\le 4 - x^{2}$。边界 $y = 4 - x^{2}$ 是开口向下的抛物线，顶点为 $(0, 4)$，根为 $\\pm 2$。因为 $\\le$ 包含边界，所以画实线。检验原点：\n\n$$0 \\le 4 - 0^{2} = 4$$\n\n这成立，所以区域是曲线含原点的一侧，即抛物线上及其下方的点。抛物线上方的点，比如 $(0, 5)$，得 $5 \\le 4$，不成立。",
  ),
  knowledgePoints: [
    {
      id: "testing-points-in-nonlinear-inequalities",
      title: t("Testing a point in a nonlinear inequality", "在非线性不等式中代入点检验"),
      explanation: t(
        "To determine whether a point $(x_{0}, y_{0})$ satisfies an inequality such as $y > x^{2} - 3$, substitute its coordinates directly. For $(1, 2)$:\n\n$$2 > 1^{2} - 3 = -2 \\quad \\text{(true)}$$\n\nSo $(1, 2)$ lies in the solution region. For $(2, 1)$:\n\n$$1 > 2^{2} - 3 = 1 \\quad \\text{(false, since the inequality is strict)}$$\n\nSo $(2, 1)$ does not belong to the solution set.\n\n> **Watch out.** A point on the boundary satisfies $\\ge$ or $\\le$ but not $>$ or $<$. Work out both sides exactly before deciding.",
        "要判断点 $(x_{0}, y_{0})$ 是否满足像 $y > x^{2} - 3$ 这样的不等式，直接代入坐标计算。对点 $(1, 2)$：\n\n$$2 > 1^{2} - 3 = -2 \\quad \\text{（成立）}$$\n\n因此 $(1, 2)$ 在解集区域内。对点 $(2, 1)$：\n\n$$1 > 2^{2} - 3 = 1 \\quad \\text{（不成立，因为是不等式严格为大于）}$$\n\n因此 $(2, 1)$ 不在解集内。\n\n> **注意。** 边界上的点满足 $\\ge$ 或 $\\le$，但不满足 $>$ 或 $<$。要把两边都精确算出来再判断。",
      ),
      generate(rng) {
        const c = rng.int(-4, 2);
        const x0 = rng.int(-3, 3);
        const yVal = x0 * x0 + c;
        const offset = rng.pick([-2, -1, 0, 1, 2]);
        const y0 = yVal + offset;
        const op = rng.pick(ops);
        const ineq = `y ${opL[op]} x^{2}${tail(c)}`;
        let satisfies = false;
        if (op === "<") satisfies = y0 < yVal;
        else if (op === "<=") satisfies = y0 <= yVal;
        else if (op === ">") satisfies = y0 > yVal;
        else satisfies = y0 >= yVal;
        return choiceProblem({
          prompt: t(`Does the point $(${x0}, ${y0})$ satisfy the inequality $${ineq}$?`, `点 $(${x0}, ${y0})$ 是否满足不等式 $${ineq}$？`),
          options: yesNo,
          correct: satisfies ? 0 : 1,
          solution: join(
            label(1, "Substitute the point", "代入点"),
            t(`Put $x = ${x0}$ and $y = ${y0}$ into the inequality:`, `把 $x = ${x0}$ 和 $y = ${y0}$ 代入不等式：`),
            t(
              disp(`${y0} ${opL[op]} (${x0})^{2}${tail(c)}`, `${y0} ${opL[op]} ${yVal}`),
              disp(`${y0} ${opL[op]} (${x0})^{2}${tail(c)}`, `${y0} ${opL[op]} ${yVal}`),
            ),
            para,
            label(2, "Decide", "作出判断"),
            t(
              `This statement is ${satisfies ? "true" : "false"}. Therefore, the point $(${x0}, ${y0})$ ${satisfies ? "satisfies" : "does not satisfy"} the inequality.`,
              `该不等式${satisfies ? "成立" : "不成立"}。因此点 $(${x0}, ${y0})$ ${satisfies ? "满足" : "不满足"}该不等式。`,
            ),
            checked(
              t(
                `On the boundary, $x = ${x0}$ gives $y = ${yVal}$. The point has $y = ${y0}$, so it lies ${offset === 0 ? "on the curve" : `${Math.abs(offset)} ${offset > 0 ? "above" : "below"} the curve`}. The inequality asks for the points ${above(op) ? "above" : "below"} the curve${strict(op) ? ", not on it" : " or on it"}, so the point ${satisfies ? "is" : "is not"} a solution.`,
                `在边界上，$x = ${x0}$ 时 $y = ${yVal}$。这个点的 $y = ${y0}$，所以它${offset === 0 ? "在曲线上" : `在曲线${offset > 0 ? "上方" : "下方"} $${Math.abs(offset)}$ 个单位处`}。不等式要求点在曲线${above(op) ? "上方" : "下方"}${strict(op) ? "，不含曲线本身" : "或曲线上"}，所以这个点${satisfies ? "是" : "不是"}解。`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "identifying-nonlinear-inequality-regions",
      figure: precalculusDrawings["solving-two-variable-nonlinear-inequalities#identifying-nonlinear-inequality-regions"],
      title: t("Regions bounded by parabolas", "抛物线围成的区域"),
      explanation: t(
        "For $y \\ge ax^{2} + c$ with $a > 0$, the boundary is the solid curve $y = ax^{2} + c$, and the region contains all points **above** or on the curve. For $y < ax^{2} + c$, the boundary is dashed, and the region is **below** the curve.\n\n> **Watch out.** $>$ means above only when $y$ stands alone on the left. The inequality $x^{2} + c < y$ also describes the region above the curve.",
        "对于 $a > 0$ 的 $y \\ge ax^{2} + c$，边界是实线曲线 $y = ax^{2} + c$，区域包含曲线**上方**及曲线上的所有点。对 $y < ax^{2} + c$，边界为虚线，区域位于曲线**下方**。\n\n> **注意。** 只有 $y$ 单独在左边时，$>$ 才表示上方。不等式 $x^{2} + c < y$ 表示的也是曲线上方的区域。",
      ),
      generate(rng) {
        const c = rng.int(-5, 4);
        const aboveCurve = rng.bool();
        const solid = rng.bool();
        const op: Op = aboveCurve ? (solid ? ">=" : ">") : solid ? "<=" : "<";
        const correctIneq = `y ${opL[op]} x^{2}${tail(c)}`;
        const options = ops.map((o) => t(`$y ${opL[o]} x^{2}${tail(c)}$`, `$y ${opL[o]} x^{2}${tail(c)}$`));
        const mark = aboveCurve ? 1 : -1;
        const reasons = ops
          .filter((o) => o !== op)
          .map((o): Reason => {
            const side = above(o) !== aboveCurve;
            const line = strict(o) === solid;
            const sideEn = `it shades ${above(o) ? "above" : "below"} the curve, not ${aboveCurve ? "above" : "below"}`;
            const sideZh = `它的阴影在曲线${above(o) ? "上方" : "下方"}，而不是${aboveCurve ? "上方" : "下方"}`;
            const lineEn = strict(o)
              ? "it leaves the curve out, but the boundary is solid"
              : "it includes the curve, but the boundary is dashed";
            const lineZh = strict(o) ? "它不含曲线本身，但边界是实线" : "它包含曲线本身，但边界是虚线";
            const en =
              side && line
                ? `Both are wrong: ${sideEn}, and ${lineEn}.`
                : side
                  ? `The side is wrong: ${sideEn}.`
                  : `The boundary is wrong: ${lineEn}.`;
            const zh = side && line ? `两处都错：${sideZh}，而且${lineZh}。` : side ? `方向错了：${sideZh}。` : `边界错了：${lineZh}。`;
            return [options[ops.indexOf(o)]!.en, en, zh];
          });
        return reasoned(
          choiceProblem({
            prompt: t(
              `Which inequality describes the region ${aboveCurve ? "above" : "below"} the parabola $y = x^{2}${tail(c)}$, with a ${solid ? "solid" : "dashed"} boundary curve?`,
              `哪个不等式表示抛物线 $y = x^{2}${tail(c)}$ ${aboveCurve ? "上方" : "下方"}的区域，且边界为${solid ? "实线" : "虚线"}？`,
            ),
            options,
            correct: ops.indexOf(op),
            solution: join(
              label(1, "Choose the side", "确定方向"),
              t(
                `The region is ${aboveCurve ? "above" : "below"} the parabola, so there $y$ is ${aboveCurve ? "greater" : "less"} than $x^{2}${tail(c)}$.`,
                `区域位于抛物线${aboveCurve ? "上方" : "下方"}，所以那里的 $y$ ${aboveCurve ? "大于" : "小于"} $x^{2}${tail(c)}$。`,
              ),
              para,
              label(2, "Choose the symbol", "确定符号"),
              t(
                `The boundary curve is ${solid ? "solid" : "dashed"}, which means points on the curve are ${solid ? "included ($\\ge$ or $\\le$)" : "excluded ($>$ or $<$)"}. Thus, the inequality is $${correctIneq}$.`,
                `边界为${solid ? "实线" : "虚线"}，意味着边界上的点${solid ? "包含在内（$\\ge$ 或 $\\le$）" : "不包含（$>$ 或 $<$）"}。因此不等式为 $${correctIneq}$。`,
              ),
              checked(
                t(
                  `The point $(0, ${c + mark})$ lies ${aboveCurve ? "above" : "below"} the vertex $(0, ${c})$, and it gives $${c + mark} ${opL[op]} ${c}$, which is true. The vertex itself gives $${c} ${opL[op]} ${c}$, which is ${solid ? "true, so the curve is included" : "false, so the curve is left out"}.`,
                  `点 $(0, ${c + mark})$ 在顶点 $(0, ${c})$ 的${aboveCurve ? "上方" : "下方"}，代入得 $${c + mark} ${opL[op]} ${c}$，成立。顶点本身代入得 $${c} ${opL[op]} ${c}$，${solid ? "成立，所以曲线包含在内" : "不成立，所以曲线不包含在内"}。`,
                ),
              ),
            ),
          }),
          reasons,
        );
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
  intro: t(
    "You can graph one nonlinear inequality in two variables, and you can solve a system of linear inequalities by taking the points that satisfy all of them. Putting the two together, a system with curved boundaries has as its solution the overlap of the regions, often bounded by the points where the boundaries meet. Such systems describe, for example, the area between a cable and a road.\n\nSolve the system $y \\ge x^{2} - 1$ and $y \\le 3$. The first region is on or above the parabola, the second on or below the horizontal line. They meet where $x^{2} - 1 = 3$, that is at $x = \\pm 2$, so the overlap is the region between the curves from $(-2, 3)$ to $(2, 3)$. The origin is in it:\n\n$$0 \\ge 0^{2} - 1 = -1, \\quad 0 \\le 3$$\n\nThe point $(3, 2)$ is not, since $2 \\ge 3^{2} - 1 = 8$ is false.",
    "你会画一个二元非线性不等式的图像，也会把同时满足所有不等式的点作为二元一次不等式组的解。把两者结合起来，边界是曲线的不等式组，其解就是各区域的重叠部分，常常以边界的交点为界。这样的不等式组可以描述，例如电缆与路面之间的区域。\n\n解不等式组 $y \\ge x^{2} - 1$ 和 $y \\le 3$。第一个区域是抛物线上及其上方，第二个是水平线上及其下方。它们在 $x^{2} - 1 = 3$ 处相交，即 $x = \\pm 2$，所以重叠部分是从 $(-2, 3)$ 到 $(2, 3)$ 之间两条边界围成的区域。原点在其中：\n\n$$0 \\ge 0^{2} - 1 = -1, \\quad 0 \\le 3$$\n\n点 $(3, 2)$ 不在其中，因为 $2 \\ge 3^{2} - 1 = 8$ 不成立。",
  ),
  knowledgePoints: [
    {
      id: "testing-points-in-systems-of-nonlinear-inequalities",
      title: t("Testing points in a nonlinear system", "在非线性不等式组中代入点检验"),
      explanation: t(
        "A point $(x_{0}, y_{0})$ satisfies a system of inequalities if and only if it satisfies **every** inequality in the system. For:\n\n$$\\begin{cases} y \\ge x^{2} - 4 \\\\ y \\le 2x + 1 \\end{cases}$$\n\nFor $(0, 0)$:\n\n- $0 \\ge 0^{2} - 4 = -4$ (true)\n- $0 \\le 2(0) + 1 = 1$ (true)\n\nBoth are satisfied, so $(0, 0)$ lies in the solution set.\n\n> **Watch out.** Passing the first inequality is not enough. A point is a solution only if it passes every inequality, so test them all.",
        "点 $(x_{0}, y_{0})$ 满足不等式组当且仅当它满足组中的**每一个**不等式。例如：\n\n$$\\begin{cases} y \\ge x^{2} - 4 \\\\ y \\le 2x + 1 \\end{cases}$$\n\n对点 $(0, 0)$：\n\n- $0 \\ge 0^{2} - 4 = -4$（成立）\n- $0 \\le 2(0) + 1 = 1$（成立）\n\n两个条件均满足，因此 $(0, 0)$ 在解集中。\n\n> **注意。** 满足第一个不等式还不够。只有满足每一个不等式的点才是解，所以要逐个检验。",
      ),
      generate(rng) {
        const c = rng.int(1, 4);
        const m = rng.int(1, 3);
        const d = rng.int(1, 3);
        const ineq1 = `y \\ge x^{2} - ${c}`;
        const ineq2 = `y \\le ${linear(m, d)}`;
        const x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 4);
        const sat1 = y0 >= x0 * x0 - c;
        const sat2 = y0 <= m * x0 + d;
        const satisfies = sat1 && sat2;
        const lowY = x0 * x0 - c;
        const highY = m * x0 + d;
        return choiceProblem({
          prompt: t(
            `Does the point $(${x0}, ${y0})$ satisfy the system $\\begin{cases} ${ineq1} \\\\ ${ineq2} \\end{cases}$?`,
            `点 $(${x0}, ${y0})$ 是否满足不等式组 $\\begin{cases} ${ineq1} \\\\ ${ineq2} \\end{cases}$？`,
          ),
          options: yesNo,
          correct: satisfies ? 0 : 1,
          solution: join(
            label(1, "Test the first inequality", "检验第一个不等式"),
            t(
              disp(`${y0} \\ge (${x0})^{2} - ${c} = ${x0 * x0 - c} \\quad \\text{(${sat1 ? "true" : "false"})}`),
              disp(`${y0} \\ge (${x0})^{2} - ${c} = ${x0 * x0 - c} \\quad \\text{（${sat1 ? "成立" : "不成立"}）}`),
            ),
            para,
            label(2, "Test the second inequality", "检验第二个不等式"),
            t(
              disp(`${y0} \\le ${m}(${x0}) + ${d} = ${m * x0 + d} \\quad \\text{(${sat2 ? "true" : "false"})}`),
              disp(`${y0} \\le ${m}(${x0}) + ${d} = ${m * x0 + d} \\quad \\text{（${sat2 ? "成立" : "不成立"}）}`),
            ),
            para,
            label(3, "Decide", "作出判断"),
            t(
              `Since ${satisfies ? "both inequalities are" : "not all inequalities are"} satisfied, the point ${satisfies ? "satisfies" : "does not satisfy"} the system.`,
              `因为两个不等式${satisfies ? "均成立" : "未能全部成立"}，所以该点${satisfies ? "满足" : "不满足"}该不等式组。`,
            ),
            checked(
              t(
                `At $x = ${x0}$ the parabola is at $y = ${lowY}$ and the line at $y = ${highY}$, and the system asks for $y$ from $${lowY}$ up to $${highY}$. ${lowY > highY ? `Since $${lowY} > ${highY}$, no point with $x = ${x0}$ satisfies both, so $(${x0}, ${y0})$ is not a solution.` : `The value $y = ${y0}$ is ${satisfies ? "" : "not "}in this range, so $(${x0}, ${y0})$ is ${satisfies ? "" : "not "}a solution.`}`,
                `在 $x = ${x0}$ 处，抛物线在 $y = ${lowY}$，直线在 $y = ${highY}$，不等式组要求 $y$ 从 $${lowY}$ 到 $${highY}$。${lowY > highY ? `因为 $${lowY} > ${highY}$，$x = ${x0}$ 处没有点同时满足两个不等式，所以 $(${x0}, ${y0})$ 不是解。` : `$y = ${y0}$ ${satisfies ? "在" : "不在"}这个范围内，所以 $(${x0}, ${y0})$ ${satisfies ? "是" : "不是"}解。`}`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "intersection-points-of-nonlinear-boundaries",
      title: t("Vertices of the solution region", "解集区域的交点顶点"),
      explanation: t(
        "To find where the boundary curves $y = x^{2} - 2$ and $y = x + 4$ meet, set them equal:\n\n$$x^{2} - 2 = x + 4 \\implies x^{2} - x - 6 = 0 \\implies (x - 3)(x + 2) = 0$$\n\nSubstituting $x = 3$ gives $y = 7$, and $x = -2$ gives $y = 2$. The intersection points are $(-2, 2)$ and $(3, 7)$.\n\n> **Watch out.** Find each $y$ from one of the original equations, not from the factored one. $(x - 3)(x + 2)$ is $0$ at both points, but $0$ is not their $y$-coordinate.",
        "要找出边界曲线 $y = x^{2} - 2$ 与 $y = x + 4$ 的交点，联立方程：\n\n$$x^{2} - 2 = x + 4 \\implies x^{2} - x - 6 = 0 \\implies (x - 3)(x + 2) = 0$$\n\n代入 $x = 3$ 得 $y = 7$；代入 $x = -2$ 得 $y = 2$。交点坐标为 $(-2, 2)$ 与 $(3, 7)$。\n\n> **注意。** 每个 $y$ 要由原来的某个方程求出，而不是由分解后的方程。$(x - 3)(x + 2)$ 在两个点处都是 $0$，但 $0$ 不是它们的纵坐标。",
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
          u === -v
            ? t(`$(${u}, ${u * u})$ and $(${v}, ${v * v})$`, `$(${u}, ${u * u})$ 和 $(${v}, ${v * v})$`)
            : t(`$(${-u}, ${u * u - c})$ and $(${-v}, ${v * v - c})$`, `$(${-u}, ${u * u - c})$ 和 $(${-v}, ${v * v - c})$`),
          t(`$(${u + 1}, ${u * u})$ and $(${v - 1}, ${v * v})$`, `$(${u + 1}, ${u * u})$ 和 $(${v - 1}, ${v * v})$`),
        ];
        const order = rng.shuffle([0, 1, 2, 3]);
        const fx = (r: number) => (r === 0 ? "x" : `(${linear(1, -r)})`);
        const reasons: Reason[] = [
          [
            options[1]!.en,
            `These use $+${c}$ for $y$. Substituting into $y = x^{2} - ${c}$ gives $${u * u - c}$ and $${v * v - c}$.`,
            `这里 $y$ 用了 $+${c}$。代入 $y = x^{2} - ${c}$ 得 $${u * u - c}$ 和 $${v * v - c}$。`,
          ],
          u === -v
            ? [options[2]!.en, `These leave out the $-${c}$ when finding $y$.`, `求 $y$ 时漏掉了 $-${c}$。`]
            : [
                options[2]!.en,
                `These take the roots with the wrong sign: $${fx(u)}${fx(v)} = 0$ gives $x = ${u}$ and $x = ${v}$.`,
                `根的符号弄反了：$${fx(u)}${fx(v)} = 0$ 得 $x = ${u}$ 和 $x = ${v}$。`,
              ],
          [
            options[3]!.en,
            `These shift the $x$-values by $1$; the factored equation gives $x = ${u}$ and $x = ${v}$ exactly.`,
            `横坐标偏移了 $1$；分解后的方程恰好给出 $x = ${u}$ 和 $x = ${v}$。`,
          ],
        ];
        return reasoned(
          choiceProblem({
            prompt: t(
              `Find the intersection points of the boundary curves $y = x^{2} - ${c}$ and $y = ${linear(m, d)}$.`,
              `求边界曲线 $y = x^{2} - ${c}$ 与 $y = ${linear(m, d)}$ 的交点坐标。`,
            ),
            options: order.map((k) => options[k]!),
            correct: order.indexOf(0),
            solution: join(
              label(1, "Set the curves equal", "联立方程"),
              t("At a meeting point both equations give the same $y$:", "在交点处两个方程给出相同的 $y$："),
              t(
                disp(`x^{2} - ${c} = ${linear(m, d)}`, `${poly([1, "x^{2}"], [-m, "x"], [-p, ""])} = 0`),
                disp(`x^{2} - ${c} = ${linear(m, d)}`, `${poly([1, "x^{2}"], [-m, "x"], [-p, ""])} = 0`),
              ),
              para,
              label(2, "Factor", "因式分解"),
              t(`Factor the quadratic:${disp(`${fx(u)}${fx(v)} = 0`)}`, `把二次式分解：${disp(`${fx(u)}${fx(v)} = 0`)}`),
              para,
              t(`The solutions are $x = ${u}$ and $x = ${v}$.`, `解得 $x = ${u}$ 和 $x = ${v}$。`),
              para,
              label(3, "Find the y-values", "求纵坐标"),
              t(
                `Substituting into $y = x^{2} - ${c}$ gives the points $${p1}$ and $${p2}$.`,
                `代入 $y = x^{2} - ${c}$ 得交点坐标为 $${p1}$ 和 $${p2}$。`,
              ),
              checked(
                t(
                  `Both points lie on the line too: $y = ${linear(m, d)}$ gives $y = ${m * u + d}$ at $x = ${u}$ and $y = ${m * v + d}$ at $x = ${v}$.`,
                  `两个点也都在直线上：$y = ${linear(m, d)}$ 在 $x = ${u}$ 处得 $y = ${m * u + d}$，在 $x = ${v}$ 处得 $y = ${m * v + d}$。`,
                ),
              ),
            ),
          }),
          reasons,
        );
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
