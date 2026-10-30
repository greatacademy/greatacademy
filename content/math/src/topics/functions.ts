import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
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
  union,
} from "@ga/subject-math";

import {
  choiceProblem,
  expressionProblem,
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

/** plus writes a constant added to a term: " + 3", " - 3", or "" for 0. */
function plus(c: Coefficient): string {
  const v = toQ(c);
  if (v.isZero()) return "";
  return v.sign() < 0 ? ` - ${v.neg().toLatex()}` : ` + ${v.toLatex()}`;
}

/** withPrefix shows a prefix such as "f(x) =" before the answer field. */
function withPrefix(p: Problem, prefix: string): Problem {
  return { ...p, answer: { ...p.answer, input: { kind: "math", prefix } } };
}

/** Poly is a polynomial in x as coefficients from the constant term up. */
type Poly = readonly number[];

/** polyLatex writes a polynomial from its highest power down: "2x^{2} - x + 3". */
function polyLatex(p: Poly, variable = "x"): string {
  const terms: [number, string][] = [];
  for (let i = p.length - 1; i >= 0; i--) terms.push([p[i]!, i === 0 ? "" : i === 1 ? variable : `${variable}^{${i}}`]);
  return poly(...terms);
}

const evalPoly = (p: Poly, x: number) => p.reduce((acc, c, i) => acc + c * x ** i, 0);

function addPoly(a: Poly, b: Poly, sign = 1): Poly {
  return range(0, Math.max(a.length, b.length) - 1).map((i) => (a[i] ?? 0) + sign * (b[i] ?? 0));
}

function mulPoly(a: Poly, b: Poly): Poly {
  const out = new Array<number>(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => {
    b.forEach((y, j) => {
      out[i + j]! += x * y;
    });
  });
  return out;
}

/** composePoly is f(g(x)). */
function composePoly(f: Poly, g: Poly): Poly {
  let out: Poly = [0];
  let power: Poly = [1];
  for (const c of f) {
    out = addPoly(
      out,
      power.map((x) => x * c),
    );
    power = mulPoly(power, g);
  }
  return out;
}

/** substitution writes a polynomial with a number substituted: "2(-3)^{2} - 4(-3) + 1". */
function substitution(p: Poly, k: Coefficient): string {
  let out = "";
  for (let i = p.length - 1; i >= 0; i--) {
    const c = p[i]!;
    if (c === 0) continue;
    const a = Math.abs(c);
    const body = i === 0 ? String(a) : `${a === 1 ? "" : a}(${num(k)})${i > 1 ? `^{${i}}` : ""}`;
    if (out === "") out = c < 0 ? `-${body}` : body;
    else out += c < 0 ? ` - ${body}` : ` + ${body}`;
  }
  return out === "" ? "0" : out;
}

/** valueLatex writes "f(3) = 5". */
const valueLatex = (name: string, x: Coefficient, y: Coefficient) => `${name}(${num(x)}) = ${num(y)}`;

/** pairs writes a set of ordered pairs: "\{(1, 3), (2, 5)\}". */
const pairs = (ps: readonly Point[]) => `\\{${ps.map(([x, y]) => `(${num(x)}, ${num(y)})`).join(", ")}\\}`;

/** setOf writes a finite set in increasing order: "\{-1, 2, 5\}". */
const setOf = (xs: readonly number[]) => `\\{${[...new Set(xs)].sort((a, b) => a - b).join(", ")}\\}`;

/** valueTable writes a table of values as display math. */
function valueTable(name: string, xs: readonly number[], ys: readonly number[]): string {
  return `$$\\begin{array}{c|${"c".repeat(xs.length)}} x & ${xs.map(num).join(" & ")} \\\\ \\hline ${name}(x) & ${ys.map(num).join(" & ")} \\end{array}$$`;
}

/** iv is the interval between lo and hi (infinite when undefined), closed at the ends as given. */
function iv(lo: number | undefined, hi: number | undefined, loClosed = true, hiClosed = true): Interval {
  return {
    ...(lo !== undefined && { lo: Q.of(lo) }),
    ...(hi !== undefined && { hi: Q.of(hi) }),
    loClosed: lo !== undefined && loClosed,
    hiClosed: hi !== undefined && hiClosed,
  };
}

/** withEnds closes (true) or opens (false) every finite endpoint of a set. */
const withEnds = (set: RealSet, closed: boolean): RealSet =>
  union(...set.map((i) => ({ ...i, loClosed: i.lo !== undefined && closed, hiClosed: i.hi !== undefined && closed })));

/** hull is the smallest closed interval containing a bounded set. */
const hull = (set: RealSet): RealSet => union({ lo: set[0]!.lo, hi: set[set.length - 1]!.hi, loClosed: true, hiClosed: true });

const setText = (set: RealSet) => `$${intervalLatex(set)}$`;

// Graphs made of line segments.

const view: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

/** Piece is a connected part of a graph: line segments through its vertices, with a filled or open dot at each end. */
interface Piece {
  readonly pts: readonly Point[];
  readonly openStart?: boolean;
  readonly openEnd?: boolean;
}

const pointText = ([x, y]: Point) => `(${x}, ${y})`;

function pieceMarks(pieces: readonly Piece[]): PlaneMark[] {
  const marks: PlaneMark[] = [];
  for (const p of pieces) {
    for (let i = 0; i + 1 < p.pts.length; i++) marks.push({ kind: "segment", a: p.pts[i]!, b: p.pts[i + 1]!, accent: true });
    marks.push({ kind: "point", at: p.pts[0]!, open: p.openStart === true, accent: true });
    marks.push({ kind: "point", at: p.pts[p.pts.length - 1]!, open: p.openEnd === true, accent: true });
  }
  return marks;
}

function piecesAlt(pieces: readonly Piece[], name: string): Text {
  const en = pieces.map((p, i) => {
    const ends = `It starts with ${p.openStart ? "an open" : "a filled"} dot and ends with ${p.openEnd ? "an open" : "a filled"} dot.`;
    return `${pieces.length > 1 ? `Piece ${i + 1}: l` : "L"}ine segments through ${p.pts.map(pointText).join(", ")}. ${ends}`;
  });
  const zh = pieces.map((p, i) => {
    const ends = `起点为${p.openStart ? "空心" : "实心"}点，终点为${p.openEnd ? "空心" : "实心"}点。`;
    return `${pieces.length > 1 ? `第 ${i + 1} 段：` : ""}依次经过 ${p.pts.map(pointText).join("、")} 的折线，${ends}`;
  });
  return t(`The graph of ${name}. ${en.join(" ")}`, `${name} 的图象。${zh.join("")}`);
}

/** graphFigure draws a graph made of pieces. */
function graphFigure(pieces: readonly Piece[], name = "f"): Figure {
  return { svg: plane(view, pieceMarks(pieces)), alt: piecesAlt(pieces, name) };
}

/** distinctFrom draws an integer in [lo, hi] other than avoid. */
function distinctFrom(rng: Rng, lo: number, hi: number, avoid: number): number {
  const y = rng.int(lo, hi - 1);
  return y >= avoid ? y + 1 : y;
}

/** walkXs draws the x-coordinates of the vertices of a piece from x0 to x1: both ends and up to maxInterior points between. */
function walkXs(rng: Rng, x0: number, x1: number, maxInterior = 3): number[] {
  const inner = range(x0 + 1, x1 - 1);
  const k = Math.min(inner.length, rng.int(1, maxInterior));
  return [x0, ...rng.sample(inner, k).sort((a, b) => a - b), x1];
}

/** walk draws a piece from x0 to x1 with integer vertices in [yMin, yMax] and no horizontal segment. */
function walk(rng: Rng, x0: number, x1: number, yMin = -5, yMax = 5, maxInterior = 3): Point[] {
  const xs = walkXs(rng, x0, x1, maxInterior);
  const pts: Point[] = [];
  let y = rng.int(yMin, yMax);
  for (const x of xs) {
    pts.push([x, y]);
    y = distinctFrom(rng, yMin, yMax, y);
  }
  return pts;
}

/** segmentsOf lists the segments of the pieces, with whether each end is excluded. */
function segmentsOf(pieces: readonly Piece[]) {
  const out: { a: Point; b: Point; aOpen: boolean; bOpen: boolean }[] = [];
  for (const p of pieces) {
    const last = p.pts.length - 2;
    for (let i = 0; i <= last; i++)
      out.push({ a: p.pts[i]!, b: p.pts[i + 1]!, aOpen: i === 0 && p.openStart === true, bOpen: i === last && p.openEnd === true });
  }
  return out;
}

/** rangeOf is the set of y-values of a graph made of pieces. */
function rangeOf(pieces: readonly Piece[]): RealSet {
  return union(
    ...segmentsOf(pieces).map(({ a, b, aOpen, bOpen }) => {
      if (a[1] === b[1]) return iv(a[1], a[1]);
      const [lo, hi] = a[1] < b[1] ? [a, b] : [b, a];
      const [loOpen, hiOpen] = a[1] < b[1] ? [aOpen, bOpen] : [bOpen, aOpen];
      return iv(lo[1], hi[1], !loOpen, !hiOpen);
    }),
  );
}

/** domainOf is the set of x-values of a graph made of pieces. */
function domainOf(pieces: readonly Piece[]): RealSet {
  return union(...pieces.map((p) => iv(p.pts[0]![0], p.pts[p.pts.length - 1]![0], !p.openStart, !p.openEnd)));
}

/** levelWalk draws a piece over x0..x1 that meets the line y = c only at vertices, at least once. */
function levelWalk(rng: Rng, c: number, x0: number, x1: number): { pts: Point[]; hits: number[] } {
  const xs = walkXs(rng, x0, x1, 5);
  const states: number[] = [];
  for (let i = 0; i < xs.length; i++) {
    const prev = states[i - 1];
    states.push(prev === undefined ? rng.pick([-1, 0, 1]) : prev === 0 ? rng.sign() : rng.pick([prev, 0, 0]));
  }
  if (!states.includes(0)) states[rng.int(1, xs.length - 2)] = 0;
  const pts = xs.map((x, i): Point => {
    const s = states[i]!;
    return [x, s === 0 ? c : Math.max(-5, Math.min(5, c + s * rng.int(1, 3)))];
  });
  return { pts, hits: xs.filter((_, i) => states[i] === 0) };
}

/** valueAt is the y-coordinate of a piece's vertex at x, if there is one. */
const valueAt = (pts: readonly Point[], x: number) => pts.find((p) => p[0] === x)?.[1];

// Function names.

const names = ["f", "g", "h"] as const;

// Topic: introduction to functions.

export const introductionToFunctions: TopicDef = {
  id: "introduction-to-functions",
  title: t("Introduction to Functions", "函数入门"),
  summary: t(
    "Recognize functions as relations that give each input exactly one output, and use function notation.",
    "认识函数是每个输入恰好对应一个输出的关系，并使用函数记号。",
  ),
  prerequisites: ["two-step-equations"],
  encompasses: [
    { topic: "evaluating-expressions", weight: 0.5 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.A.2"],
  knowledgePoints: [
    {
      id: "relations-and-functions",
      title: t("Relations and functions", "关系与函数"),
      explanation: t(
        "A **relation** pairs inputs with outputs, for example as a set of ordered pairs $(x, y)$, where $x$ is the input and $y$ the output. A relation is a **function** if every input has **exactly one** output.\n\n- $\\{(1, 4), (2, 4), (3, 7)\\}$ is a function: each input appears once. Two inputs may share an output.\n- $\\{(1, 4), (1, 5), (3, 7)\\}$ is not a function: the input $1$ has two outputs, $4$ and $5$.",
        "**关系**把输入与输出配对，例如写成有序数对 $(x, y)$ 的集合，其中 $x$ 是输入，$y$ 是输出。如果每个输入都**恰好有一个**输出，这个关系就是**函数**。\n\n- $\\{(1, 4), (2, 4), (3, 7)\\}$ 是函数：每个输入只出现一次。不同的输入可以有相同的输出。\n- $\\{(1, 4), (1, 5), (3, 7)\\}$ 不是函数：输入 $1$ 有两个输出 $4$ 和 $5$。",
      ),
      generate(rng) {
        const n = rng.int(4, 5);
        const xs = rng.sample(range(-6, 9), n);
        const ys = xs.map(() => rng.int(-9, 9));
        const isFunction = rng.bool();
        let note: Text;
        if (isFunction) {
          if (rng.bool()) ys[1] = ys[0]!;
          note = t(
            "Every input appears in exactly one pair, so each input has exactly one output: it is a function. (Repeated outputs are allowed.)",
            "每个输入只出现在一个数对中，即每个输入恰好有一个输出，所以它是函数。（输出可以重复。）",
          );
        } else {
          xs[n - 1] = xs[0]!;
          ys[n - 1] = ys[0]! + rng.nonZero(-4, 4);
          note = t(
            `The input $${xs[0]}$ has two outputs, $${ys[0]}$ and $${ys[n - 1]}$, so it is not a function.`,
            `输入 $${xs[0]}$ 有两个输出 $${ys[0]}$ 和 $${ys[n - 1]}$，所以它不是函数。`,
          );
        }
        const ps = rng.shuffle(xs.map((x, i): Point => [x, ys[i]!]));
        return choiceProblem({
          prompt: t(`Is the relation $${pairs(ps)}$ a function?`, `关系 $${pairs(ps)}$ 是函数吗？`),
          options: yesNo,
          correct: isFunction ? 0 : 1,
          solution: note,
        });
      },
    },
    {
      id: "function-notation",
      title: t("Function notation", "函数记号"),
      explanation: t(
        'A function is often given by a formula and a name. $f(x) = x^{2} - 3x$ means: the function $f$ sends the input $x$ to the output $x^{2} - 3x$. Read $f(x)$ as "$f$ of $x$"; it is **not** $f$ times $x$.\n\nTo find $f(-2)$, substitute $-2$ for every $x$, in parentheses:\n\n$$f(-2) = (-2)^{2} - 3(-2) = 4 + 6 = 10.$$',
        '函数常用名称和公式给出。$f(x) = x^{2} - 3x$ 表示：函数 $f$ 把输入 $x$ 对应到输出 $x^{2} - 3x$。$f(x)$ 读作"$f$ $x$"，它**不是** $f$ 乘以 $x$。\n\n求 $f(-2)$ 时，把每个 $x$ 都换成带括号的 $-2$：\n\n$$f(-2) = (-2)^{2} - 3(-2) = 4 + 6 = 10.$$',
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const name = rng.pick(names);
        const p: Poly = rng.bool(0.3) ? [rng.int(-9, 9), rng.nonZero(-6, 6)] : [rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-3, 3)];
        const k = rng.nonZero(-5, 5);
        const value = evalPoly(p, k);
        const signSlip = p.reduce((acc, c, i) => acc + c * (i === 2 ? -(k * k) : k ** i), 0);
        return numberProblem({
          prompt: t(
            `Given $${name}(x) = ${polyLatex(p)}$, find $${name}(${k})$.`,
            `已知 $${name}(x) = ${polyLatex(p)}$，求 $${name}(${k})$。`,
          ),
          answer: value,
          wrong: [evalPoly(p, -k), signSlip, evalPoly(p, k) - 2 * (p[0] ?? 0)],
          solution: t(
            `Substitute $${k}$ for $x$:${steps(`${name}(${k}) = ${substitution(p, k)} = ${num(value)}`)}`,
            `把 $x$ 换成 $${k}$：${steps(`${name}(${k}) = ${substitution(p, k)} = ${num(value)}`)}`,
          ),
        });
      },
    },
    {
      id: "finding-an-input",
      title: t("Finding the input for an output", "由输出求输入"),
      explanation: t(
        "$f(x) = 11$ asks for the **input** whose output is $11$. For $f(x) = 3x - 4$, solve the equation\n\n$$3x - 4 = 11 \\;\\Rightarrow\\; 3x = 15 \\;\\Rightarrow\\; x = 5.$$\n\nCheck: $f(5) = 3(5) - 4 = 11$. Do not confuse this with $f(11)$, the output for the input $11$.",
        "$f(x) = 11$ 是问哪个**输入**的输出是 $11$。对于 $f(x) = 3x - 4$，解方程\n\n$$3x - 4 = 11 \\;\\Rightarrow\\; 3x = 15 \\;\\Rightarrow\\; x = 5.$$\n\n检验：$f(5) = 3(5) - 4 = 11$。不要与 $f(11)$（输入 $11$ 的输出）混淆。",
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const name = rng.pick(names);
        const a = rng.sign() * rng.int(2, 9);
        const b = rng.nonZero(-15, 15);
        const x = rng.int(-9, 9);
        const c = a * x + b;
        return numberProblem({
          prompt: t(
            `Given $${name}(x) = ${linear(a, b)}$, find the value of $x$ for which $${name}(x) = ${num(c)}$.`,
            `已知 $${name}(x) = ${linear(a, b)}$，求使 $${name}(x) = ${num(c)}$ 的 $x$ 的值。`,
          ),
          answer: x,
          solveFor: "x",
          wrong: [a * c + b, Q.of(c + b, a), -x],
          solution: t(
            `Solve $${linear(a, b)} = ${num(c)}$:${steps(`${poly([a, "x"])} = ${num(c - b)}`, `x = ${num(x)}`)}`,
            `解方程 $${linear(a, b)} = ${num(c)}$：${steps(`${poly([a, "x"])} = ${num(c - b)}`, `x = ${num(x)}`)}`,
          ),
        });
      },
    },
  ],
};

// Topic: visual representations of functions.

export const representationsOfFunctions: TopicDef = {
  id: "representations-of-functions",
  title: t("Visual Representations of Functions", "函数的直观表示"),
  summary: t("Read functions given by tables of values and by mapping diagrams.", "读懂用数值表和映射图表示的函数。"),
  prerequisites: ["introduction-to-functions"],
  encompasses: [{ topic: "introduction-to-functions", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.A.2"],
  knowledgePoints: [
    {
      id: "tables-of-values",
      title: t("Tables of values", "数值表"),
      explanation: t(
        "A **table of values** lists inputs in one row and their outputs in the other:\n\n$$\\begin{array}{c|cccc} x & -1 & 0 & 2 & 5 \\\\ \\hline f(x) & 6 & 3 & -1 & 0 \\end{array}$$\n\nTo find $f(2)$, find $2$ in the $x$ row and read the output below it: $f(2) = -1$. To solve $f(x) = 0$, find $0$ in the $f(x)$ row and read the input above it: $x = 5$.",
        "**数值表**一行列出输入，另一行列出对应的输出：\n\n$$\\begin{array}{c|cccc} x & -1 & 0 & 2 & 5 \\\\ \\hline f(x) & 6 & 3 & -1 & 0 \\end{array}$$\n\n求 $f(2)$：在 $x$ 行找到 $2$，读出它下面的输出：$f(2) = -1$。解 $f(x) = 0$：在 $f(x)$ 行找到 $0$，读出它上面的输入：$x = 5$。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const step = rng.int(1, 2);
        const start = rng.int(-4, 1);
        const xs = range(0, 4).map((i) => start + i * step);
        const ys = rng.sample(range(-12, 12), 5);
        const i = rng.int(0, 4);
        const table = valueTable(name, xs, ys);
        if (rng.bool()) {
          const a = xs[i]!;
          const swapped = xs[ys.indexOf(a)];
          return numberProblem({
            prompt: t(
              `The table shows some values of the function $${name}$.${table}Find $${name}(${a})$.`,
              `下表给出了函数 $${name}$ 的一些值。${table}求 $${name}(${a})$。`,
            ),
            answer: ys[i]!,
            wrong: [ys[(i + 1) % 5]!, ...(swapped !== undefined ? [swapped] : [])],
            solution: t(
              `Find $${a}$ in the $x$ row; the output below it is $${valueLatex(name, a, ys[i]!)}$.`,
              `在 $x$ 行找到 $${a}$，它下面的输出就是答案：$${valueLatex(name, a, ys[i]!)}$。`,
            ),
          });
        }
        const c = ys[i]!;
        const swapped = ys[xs.indexOf(c)];
        return numberProblem({
          prompt: t(
            `The table shows some values of the function $${name}$.${table}Find the value of $x$ in the table for which $${name}(x) = ${num(c)}$.`,
            `下表给出了函数 $${name}$ 的一些值。${table}求表中使 $${name}(x) = ${num(c)}$ 的 $x$ 的值。`,
          ),
          answer: xs[i]!,
          solveFor: "x",
          wrong: [xs[(i + 1) % 5]!, ...(swapped !== undefined ? [swapped] : [])],
          solution: t(
            `Find $${num(c)}$ in the $${name}(x)$ row; the input above it is $x = ${xs[i]}$, since $${valueLatex(name, xs[i]!, c)}$.`,
            `在 $${name}(x)$ 行找到 $${num(c)}$，它上面的输入是 $x = ${xs[i]}$，因为 $${valueLatex(name, xs[i]!, c)}$。`,
          ),
        });
      },
    },
    {
      id: "mapping-diagrams",
      title: t("Mapping diagrams", "映射图"),
      explanation: t(
        "A **mapping diagram** draws an arrow from each input to its output. It shows a function exactly when **every input has exactly one arrow** leaving it:\n\n$$\\begin{array}{rcl} 1 & \\longmapsto & 5 \\\\ 2 & \\longmapsto & 5 \\\\ 3 & \\longmapsto & -2 \\end{array} \\qquad \\begin{array}{rcl} 1 & \\longmapsto & 5 \\\\ 1 & \\longmapsto & 0 \\\\ 3 & \\longmapsto & -2 \\end{array}$$\n\nThe left diagram is a function: two arrows may end at the same output. The right one is not: two arrows leave the input $1$.",
        "**映射图**从每个输入画一个箭头指向它的输出。当且仅当**每个输入恰好引出一个箭头**时，它表示函数：\n\n$$\\begin{array}{rcl} 1 & \\longmapsto & 5 \\\\ 2 & \\longmapsto & 5 \\\\ 3 & \\longmapsto & -2 \\end{array} \\qquad \\begin{array}{rcl} 1 & \\longmapsto & 5 \\\\ 1 & \\longmapsto & 0 \\\\ 3 & \\longmapsto & -2 \\end{array}$$\n\n左边的图是函数：两个箭头可以指向同一个输出。右边的图不是函数：输入 $1$ 引出了两个箭头。",
      ),
      generate(rng) {
        const n = rng.int(3, 4);
        const xs = rng.sample(range(-5, 8), n).sort((a, b) => a - b);
        const outs = rng.sample(range(-9, 9), 3);
        const rows: Point[] = xs.map((x) => [x, rng.pick(outs)]);
        const isFunction = rng.bool();
        let note: Text;
        if (isFunction) {
          note = t(
            "Each input has exactly one arrow leaving it, so the diagram shows a function. Several arrows may end at the same output.",
            "每个输入恰好引出一个箭头，所以映射图表示函数。多个箭头可以指向同一个输出。",
          );
        } else {
          const i = rng.int(0, n - 1);
          const [x, y] = rows[i]!;
          const other = outs.find((o) => o !== y)!;
          rows.splice(i + 1, 0, [x, other]);
          note = t(
            `Two arrows leave the input $${x}$, to $${y}$ and to $${other}$, so the diagram does not show a function.`,
            `输入 $${x}$ 引出了两个箭头，分别指向 $${y}$ 和 $${other}$，所以映射图不表示函数。`,
          );
        }
        const diagram = `$$\\begin{array}{rcl} ${rows.map(([x, y]) => `${x} & \\longmapsto & ${y}`).join(" \\\\ ")} \\end{array}$$`;
        return choiceProblem({
          prompt: t(`Does this mapping diagram show a function?${diagram}`, `这个映射图表示函数吗？${diagram}`),
          options: yesNo,
          correct: isFunction ? 0 : 1,
          solution: note,
        });
      },
    },
  ],
};

// Topic: graphs of functions.

export const graphsOfFunctions: TopicDef = {
  id: "graphs-of-functions",
  title: t("Graphs of Functions", "函数的图象"),
  summary: t(
    "Read values of a function from its graph, solve equations from a graph, and check points against a formula.",
    "从图象读出函数值，借助图象解方程，并判断点是否在函数图象上。",
  ),
  prerequisites: ["representations-of-functions", "the-coordinate-plane"],
  encompasses: [
    { topic: "representations-of-functions", weight: 0.4 },
    { topic: "introduction-to-functions", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.A.2", "CCSS.HSA.REI.D.10"],
  knowledgePoints: [
    {
      id: "reading-values-from-a-graph",
      title: t("Reading values from a graph", "从图象读函数值"),
      explanation: t(
        "The **graph** of a function $f$ is the set of points $(x, f(x))$. To find $f(a)$ from the graph, go to $x = a$ on the $x$-axis, move up or down to the graph, and read the $y$-coordinate there.\n\nFor example, if the graph passes through $(2, -3)$, then $f(2) = -3$.",
        "函数 $f$ 的**图象**是所有点 $(x, f(x))$ 组成的集合。从图象求 $f(a)$：在 $x$ 轴上找到 $x = a$，竖直移动到图象上，读出该点的 $y$ 坐标。\n\n例如，若图象经过 $(2, -3)$，则 $f(2) = -3$。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const pts = walk(rng, -5, 5, -5, 5, 4);
        const i = rng.int(0, pts.length - 1);
        const [a, y] = pts[i]!;
        const swapped = pts.find((p) => p[1] === a)?.[0];
        return {
          ...numberProblem({
            prompt: t(`The graph of $${name}$ is shown. Find $${name}(${a})$.`, `如图是 $${name}$ 的图象。求 $${name}(${a})$。`),
            answer: y,
            wrong: [pts[(i + 1) % pts.length]![1], ...(swapped !== undefined ? [swapped] : []), a],
            solution: t(
              `The graph passes through $(${a}, ${y})$, so $${valueLatex(name, a, y)}$.`,
              `图象经过 $(${a}, ${y})$，所以 $${valueLatex(name, a, y)}$。`,
            ),
          }),
          figure: graphFigure([{ pts }], name),
        };
      },
    },
    {
      id: "solving-equations-from-a-graph",
      title: t("Solving equations from a graph", "借助图象解方程"),
      explanation: t(
        "To solve $f(x) = c$ from a graph, look for every point of the graph at height $y = c$, and read their $x$-coordinates. Imagine the horizontal line $y = c$: each place it meets the graph gives one solution. There may be one solution, several, or none.",
        "借助图象解 $f(x) = c$：找出图象上所有高度为 $y = c$ 的点，读出它们的 $x$ 坐标。可以想象一条水平直线 $y = c$：它与图象的每个交点都给出一个解。解可能有一个、多个，也可能没有。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const c = rng.int(-3, 3);
        const { pts, hits } = levelWalk(rng, c, -5, 5);
        const wrong: string[][] = [[String(c)]];
        if (hits.length > 1) wrong.push(hits.slice(1).map(String), hits.slice(0, -1).map(String));
        return {
          ...solutionsProblem({
            prompt: t(
              `The graph of $${name}$ is shown. Solve $${name}(x) = ${c}$.`,
              `如图是 $${name}$ 的图象。解方程 $${name}(x) = ${c}$。`,
            ),
            values: hits.map(String),
            wrong,
            solution: t(
              `The graph is at height $${c}$ at ${hits.map((x) => `$(${x}, ${c})$`).join(" and ")}, so ${hits.map((x) => `$x = ${x}$`).join(" or ")}.`,
              `图象在 ${hits.map((x) => `$(${x}, ${c})$`).join("、")} 处的高度为 $${c}$，所以 ${hits.map((x) => `$x = ${x}$`).join(" 或 ")}。`,
            ),
          }),
          figure: graphFigure([{ pts }], name),
        };
      },
    },
    {
      id: "points-on-a-graph",
      title: t("Points on the graph of a formula", "点是否在函数图象上"),
      explanation: t(
        "The point $(a, b)$ lies on the graph of $f$ exactly when $f(a) = b$. For $f(x) = 2x^{2} - 1$:\n\n- $(2, 7)$ is on the graph, because $f(2) = 2(2)^{2} - 1 = 7$;\n- $(7, 2)$ is not, because $f(7) = 97 \\ne 2$.\n\nThe first coordinate is the input and the second the output; do not swap them.",
        "点 $(a, b)$ 在 $f$ 的图象上，当且仅当 $f(a) = b$。对于 $f(x) = 2x^{2} - 1$：\n\n- $(2, 7)$ 在图象上，因为 $f(2) = 2(2)^{2} - 1 = 7$；\n- $(7, 2)$ 不在图象上，因为 $f(7) = 97 \\ne 2$。\n\n第一个坐标是输入，第二个是输出，不要弄反。",
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const name = rng.pick(names);
        const p: Poly = rng.bool() ? [rng.int(-9, 9), rng.nonZero(-5, 5)] : [rng.int(-6, 6), rng.int(-4, 4), rng.nonZero(-2, 2)];
        const a = rng.int(-4, 4);
        const fa = evalPoly(p, a);
        const kind = rng.int(0, 2);
        const pt: Point = kind === 0 ? [a, fa] : kind === 1 || Math.abs(fa) > 12 ? [a, fa + rng.nonZero(-3, 3)] : [fa, a];
        const on = evalPoly(p, pt[0]) === pt[1];
        const value = evalPoly(p, pt[0]);
        return choiceProblem({
          prompt: t(
            `Is the point $(${pt[0]}, ${pt[1]})$ on the graph of $${name}(x) = ${polyLatex(p)}$?`,
            `点 $(${pt[0]}, ${pt[1]})$ 在 $${name}(x) = ${polyLatex(p)}$ 的图象上吗？`,
          ),
          options: yesNo,
          correct: on ? 0 : 1,
          solution: t(
            `Substitute the first coordinate:${steps(`${name}(${pt[0]}) = ${substitution(p, pt[0])} = ${num(value)}`)}${on ? `This equals $${pt[1]}$, so the point is on the graph.` : `This is not $${pt[1]}$, so the point is not on the graph.`}`,
            `代入第一个坐标：${steps(`${name}(${pt[0]}) = ${substitution(p, pt[0])} = ${num(value)}`)}${on ? `它等于 $${pt[1]}$，所以点在图象上。` : `它不等于 $${pt[1]}$，所以点不在图象上。`}`,
          ),
        });
      },
    },
  ],
};

// Topic: the domain of a function.

/** twoPieces draws a graph of two pieces over x0..m and m2..x1, with random dots at the ends. */
function twoPieces(rng: Rng, x0: number, m: number, m2: number, x1: number, bands?: readonly [number, number][]): Piece[] {
  const [b1, b2] = bands ?? [
    [-5, 5],
    [-5, 5],
  ];
  return [
    { pts: walk(rng, x0, m, b1![0], b1![1], 2), openStart: rng.bool(), openEnd: rng.bool() },
    { pts: walk(rng, m2, x1, b2![0], b2![1], 2), openStart: rng.bool(), openEnd: rng.bool() },
  ];
}

export const domainOfAFunction: TopicDef = {
  id: "domain-of-a-function",
  title: t("The Domain of a Function", "函数的定义域"),
  summary: t(
    "Find the domain of a function from a set of pairs, a graph or a formula, and write it in interval notation.",
    "由数对集合、图象或公式求函数的定义域，并用区间表示。",
  ),
  prerequisites: ["graphs-of-functions", "interval-notation", "square-roots-and-cube-roots"],
  encompasses: [{ topic: "graphs-of-functions", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.B.5"],
  knowledgePoints: [
    {
      id: "domain-of-a-set-of-pairs",
      title: t("The domain of a set of pairs", "数对集合的定义域"),
      explanation: t(
        "The **domain** of a function is the set of all its inputs. For a function given as ordered pairs, the domain is the set of first coordinates:\n\n$$\\{(-1, 4), (2, 0), (5, 4)\\} \\text{ has domain } \\{-1, 2, 5\\}.$$\n\nThe set of second coordinates, $\\{0, 4\\}$, is the **range**: the set of outputs.",
        "函数的**定义域**是所有输入组成的集合。对于用有序数对给出的函数，定义域就是所有第一个坐标组成的集合：\n\n$$\\{(-1, 4), (2, 0), (5, 4)\\} \\text{ 的定义域是 } \\{-1, 2, 5\\}.$$\n\n所有第二个坐标组成的集合 $\\{0, 4\\}$ 是**值域**，即所有输出组成的集合。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        const xs = rng.sample(range(-6, 9), n);
        const ys = xs.map(() => rng.int(-9, 9));
        if (rng.bool()) ys[n - 1] = ys[0]!;
        const ps = rng.shuffle(xs.map((x, i): Point => [x, ys[i]!]));
        const candidates = [setOf(xs), setOf(ys), setOf([...xs, ...ys]), setOf(xs.slice(1))].filter((s, i, all) => all.indexOf(s) === i);
        const options = rng.shuffle(candidates);
        return choiceProblem({
          prompt: t(`What is the domain of the function $${pairs(ps)}$?`, `函数 $${pairs(ps)}$ 的定义域是什么？`),
          options: options.map((s) => same(`$${s}$`)),
          correct: options.indexOf(setOf(xs)),
          solution: t(
            `The domain is the set of inputs, the first coordinates: $${setOf(xs)}$.`,
            `定义域是所有输入，即第一个坐标组成的集合：$${setOf(xs)}$。`,
          ),
        });
      },
    },
    {
      id: "domain-from-a-graph",
      title: t("The domain from a graph", "由图象求定义域"),
      explanation: t(
        "On a graph, the domain is the set of $x$-values the graph covers: look at how far it reaches **left and right**. A filled dot means the endpoint belongs to the graph, an open dot that it does not.\n\nWrite the domain in **interval notation**: square brackets $[\\;]$ include an endpoint, parentheses $(\\;)$ exclude it. A graph from a filled dot at $x = -3$ to an open dot at $x = 4$ has domain $[-3, 4)$, that is $-3 \\le x < 4$. If the graph has a gap, join the parts with $\\cup$ (union): $[-5, -1] \\cup (2, 5]$.",
        "在图象上，定义域就是图象覆盖的所有 $x$ 值：看图象**向左和向右**延伸到哪里。实心点表示端点属于图象，空心点表示端点不属于图象。\n\n用**区间**表示定义域：方括号 $[\\;]$ 包含端点，圆括号 $(\\;)$ 不包含端点。从 $x = -3$ 处的实心点到 $x = 4$ 处的空心点的图象，定义域是 $[-3, 4)$，即 $-3 \\le x < 4$。如果图象中间断开，就用 $\\cup$（并集）把各部分连起来：$[-5, -1] \\cup (2, 5]$。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        let pieces: Piece[];
        if (rng.bool(0.65)) {
          pieces = [{ pts: walk(rng, rng.int(-5, -1), rng.int(1, 5)), openStart: rng.bool(), openEnd: rng.bool() }];
        } else {
          const m = rng.int(-3, 0);
          const m2 = rng.int(m + 1, 3);
          pieces = twoPieces(rng, rng.int(-5, m - 1), m, m2, rng.int(m2 + 1, 5));
        }
        const domain = domainOf(pieces);
        return {
          ...intervalProblem({
            prompt: t(`The graph of $${name}$ is shown. Find the domain of $${name}$.`, `如图是 $${name}$ 的图象。求 $${name}$ 的定义域。`),
            set: domain,
            wrong: [rangeOf(pieces), withEnds(domain, true), withEnds(domain, false), hull(domain)],
            solution: t(
              `The graph covers the $x$-values ${setText(domain)}: filled dots are included, open dots are not.`,
              `图象覆盖的 $x$ 值为 ${setText(domain)}：实心点包含在内，空心点不包含在内。`,
            ),
          }),
          figure: graphFigure(pieces, name),
        };
      },
    },
    {
      id: "domain-from-a-formula",
      title: t("The domain from a formula", "由公式求定义域"),
      explanation: t(
        "When a function is given by a formula alone, its domain is every real number for which the formula makes sense. Two things can fail:\n\n- **Division by zero.** $f(x) = \\dfrac{5}{x - 2}$ is undefined at $x = 2$, so the domain is $(-\\infty, 2) \\cup (2, \\infty)$.\n- **The square root of a negative number.** $g(x) = \\sqrt{x + 3}$ needs $x + 3 \\ge 0$, so the domain is $[-3, \\infty)$.\n\nA polynomial such as $x^{2} - 4x$ makes sense for every $x$: its domain is $(-\\infty, \\infty)$, also written $\\mathbb{R}$. The symbol $\\infty$ is never included, so it always takes a parenthesis.",
        "如果函数只给出公式，它的定义域就是使公式有意义的所有实数。有两种情况会出问题：\n\n- **除以零。** $f(x) = \\dfrac{5}{x - 2}$ 在 $x = 2$ 处无定义，所以定义域是 $(-\\infty, 2) \\cup (2, \\infty)$。\n- **负数开平方。** $g(x) = \\sqrt{x + 3}$ 要求 $x + 3 \\ge 0$，所以定义域是 $[-3, \\infty)$。\n\n像 $x^{2} - 4x$ 这样的多项式对所有 $x$ 都有意义，定义域是 $(-\\infty, \\infty)$，也记作 $\\mathbb{R}$。$\\infty$ 永远不包含在内，所以总是用圆括号。",
      ),
      keyPrerequisites: ["square-roots-and-cube-roots", "inequalities-and-solutions"],
      generate(rng) {
        const name = rng.pick(names);
        const kind = rng.int(0, 5);
        const a = rng.nonZero(-8, 8);
        const b = rng.int(2, 4);
        const k = rng.nonZero(-9, 9);
        const punctured = union(iv(undefined, a, false, false), iv(a, undefined, false, false));
        const cases: [string, RealSet, RealSet[], Text][] = [
          [
            polyLatex([rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-3, 3)]),
            realLine,
            [union(iv(0, undefined)), union(iv(0, undefined, false))],
            t("A polynomial is defined for every real number.", "多项式对所有实数都有定义。"),
          ],
          [
            `\\frac{${k}}{${linear(1, -a)}}`,
            punctured,
            [union(iv(-a, undefined, false, false), iv(undefined, -a, false, false)), union(iv(a, undefined, false)), realLine],
            t(
              `The denominator $${linear(1, -a)}$ is $0$ at $x = ${a}$; every other number works.`,
              `分母 $${linear(1, -a)}$ 在 $x = ${a}$ 时为 $0$，其他数都可以。`,
            ),
          ],
          [
            `\\frac{${k}}{${linear(b, -b * a)}}`,
            punctured,
            [
              union(iv(undefined, b * a, false, false), iv(b * a, undefined, false, false)),
              union(iv(undefined, -a, false, false), iv(-a, undefined, false, false)),
              union(iv(a, undefined, false)),
            ],
            t(
              `The denominator $${linear(b, -b * a)}$ is $0$ when $x = ${a}$; every other number works.`,
              `分母 $${linear(b, -b * a)}$ 在 $x = ${a}$ 时为 $0$，其他数都可以。`,
            ),
          ],
          [
            `\\sqrt{${linear(1, -a)}}`,
            union(iv(a, undefined)),
            [union(iv(a, undefined, false)), union(iv(-a, undefined)), union(iv(undefined, a))],
            t(`The root needs $${linear(1, -a)} \\ge 0$, that is $x \\ge ${a}$.`, `根号要求 $${linear(1, -a)} \\ge 0$，即 $x \\ge ${a}$。`),
          ],
          [
            `\\sqrt{${poly([a, ""], [-1, "x"])}}`,
            union(iv(undefined, a)),
            [union(iv(a, undefined)), union(iv(undefined, a, false, false)), union(iv(undefined, -a))],
            t(
              `The root needs $${poly([a, ""], [-1, "x"])} \\ge 0$, that is $x \\le ${a}$.`,
              `根号要求 $${poly([a, ""], [-1, "x"])} \\ge 0$，即 $x \\le ${a}$。`,
            ),
          ],
          [
            `\\sqrt{${linear(b, -b * a)}}`,
            union(iv(a, undefined)),
            [union(iv(b * a, undefined)), union(iv(a, undefined, false)), union(iv(-a, undefined))],
            t(
              `The root needs $${linear(b, -b * a)} \\ge 0$, that is $${b}x \\ge ${num(b * a)}$, so $x \\ge ${a}$.`,
              `根号要求 $${linear(b, -b * a)} \\ge 0$，即 $${b}x \\ge ${num(b * a)}$，所以 $x \\ge ${a}$。`,
            ),
          ],
        ];
        const [expr, set, wrong, why] = cases[kind]!;
        return intervalProblem({
          prompt: t(`Find the domain of $${name}(x) = ${expr}$.`, `求 $${name}(x) = ${expr}$ 的定义域。`),
          set,
          wrong,
          solution: t(`${why.en} The domain is ${setText(set)}.`, `${why["zh-CN"]}定义域是 ${setText(set)}。`),
        });
      },
    },
  ],
};

// Topic: the vertical line test.

/** curveFigure draws curves y = f(x) in the standard view. */
function curveFigure(marks: readonly PlaneMark[], en: string, zh: string): Figure {
  return { svg: plane(view, marks), alt: t(en, zh) };
}

const sqrt0 = (v: number) => Math.sqrt(Math.max(0, v));

/** relationGraph draws a graph that is (kind < 3) or is not (kind ≥ 3) the graph of a function. */
function relationGraph(rng: Rng, kind: number): Figure {
  const h = rng.int(-2, 2);
  const k = rng.int(-2, 2);
  switch (kind) {
    case 0: {
      const pts = walk(rng, rng.int(-5, -3), rng.int(3, 5), -5, 5, 4);
      return graphFigure([{ pts }], "a relation");
    }
    case 1: {
      const s = rng.sign();
      const m = rng.pick([1, 2, 3]);
      return curveFigure(
        [{ kind: "curve", f: (x) => k + (s * (x - h) ** 2) / m, accent: true }],
        `A parabola opening ${s > 0 ? "up" : "down"} with vertex (${h}, ${k}).`,
        `一条开口向${s > 0 ? "上" : "下"}、顶点为 (${h}, ${k}) 的抛物线。`,
      );
    }
    case 2: {
      const s = rng.pick([4, 6, 8]);
      return curveFigure(
        [{ kind: "curve", f: (x) => k + ((x - h) ** 3 - 4 * (x - h)) / s, accent: true }],
        `An S-shaped curve through (${h}, ${k}) that rises from the lower left to the upper right.`,
        `一条经过 (${h}, ${k}) 的 S 形曲线，从左下方升到右上方。`,
      );
    }
    case 3: {
      const s = rng.sign();
      const m = rng.pick([1, 2]);
      const half = (sign: number) => (x: number) => (s * (x - h) >= 0 ? k + sign * m * Math.sqrt(s * (x - h)) : Number.NaN);
      return curveFigure(
        [
          { kind: "curve", f: half(1), accent: true },
          { kind: "curve", f: half(-1), accent: true },
          { kind: "segment", a: [h, k], b: [h, k], accent: true },
        ],
        `A parabola opening to the ${s > 0 ? "right" : "left"} with vertex (${h}, ${k}).`,
        `一条开口向${s > 0 ? "右" : "左"}、顶点为 (${h}, ${k}) 的抛物线。`,
      );
    }
    case 4: {
      const r = rng.int(2, 3);
      return curveFigure(
        [
          { kind: "curve", f: (x) => k + sqrt0(r * r - (x - h) ** 2), from: h - r, to: h + r, accent: true },
          { kind: "curve", f: (x) => k - sqrt0(r * r - (x - h) ** 2), from: h - r, to: h + r, accent: true },
        ],
        `A circle with center (${h}, ${k}) and radius ${r}.`,
        `一个圆心为 (${h}, ${k})、半径为 ${r} 的圆。`,
      );
    }
    default: {
      const x0 = rng.int(-5, -3);
      const x1 = rng.int(0, 2);
      const y0 = rng.int(-5, 0);
      const pts: Point[] = [
        [x0, y0],
        [x1 + rng.int(2, 3), y0 + rng.int(1, 3)],
        [x1, y0 + rng.int(4, 6)],
        [rng.int(3, 5), rng.int(0, 5)],
      ];
      return graphFigure([{ pts }], "a relation");
    }
  }
}

export const verticalLineTest: TopicDef = {
  id: "vertical-line-test",
  title: t("The Vertical Line Test", "竖直线检验"),
  summary: t("Decide from a graph whether it is the graph of a function.", "根据图象判断它是否是函数的图象。"),
  prerequisites: ["graphs-of-functions"],
  encompasses: [
    { topic: "graphs-of-functions", weight: 0.2 },
    { topic: "introduction-to-functions", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.HSF.IF.A.1"],
  knowledgePoints: [
    {
      id: "applying-the-vertical-line-test",
      title: t("Applying the vertical line test", "使用竖直线检验"),
      explanation: t(
        "A graph is the graph of a function exactly when **no vertical line meets it more than once**. A vertical line $x = a$ meeting the graph at two points would give the input $a$ two outputs.\n\nThe parabola $y = x^{2}$ passes the test. The circle in the figure fails it: the line $x = 1$ meets it twice.",
        "一个图形是函数的图象，当且仅当**任何一条竖直线与它的交点都不超过一个**。如果竖直线 $x = a$ 与图形交于两点，输入 $a$ 就有两个输出。\n\n抛物线 $y = x^{2}$ 通过检验。图中的圆不通过检验：直线 $x = 1$ 与它交于两点。",
      ),
      figure: curveFigure(
        [
          { kind: "curve", f: (x) => sqrt0(9 - x * x), from: -3, to: 3, accent: true },
          { kind: "curve", f: (x) => -sqrt0(9 - x * x), from: -3, to: 3, accent: true },
          { kind: "line", a: [1, 0], b: [1, 1], dashed: true },
        ],
        "A circle with center (0, 0) and radius 3, and the dashed vertical line x = 1 crossing it twice.",
        "一个圆心为 (0, 0)、半径为 3 的圆，虚线竖直线 x = 1 与它交于两点。",
      ),
      generate(rng) {
        const kind = rng.int(0, 5);
        const isFunction = kind < 3;
        return {
          ...choiceProblem({
            prompt: t("Is this the graph of a function?", "这是函数的图象吗？"),
            options: yesNo,
            correct: isFunction ? 0 : 1,
            solution: isFunction
              ? t(
                  "Every vertical line meets the graph at most once, so it is the graph of a function.",
                  "每条竖直线与图象最多交于一点，所以它是函数的图象。",
                )
              : t(
                  "Some vertical line meets the graph more than once, so it is not the graph of a function.",
                  "存在与图形交于不止一点的竖直线，所以它不是函数的图象。",
                ),
          }),
          figure: relationGraph(rng, kind),
        };
      },
    },
    {
      id: "endpoints-and-the-vertical-line-test",
      title: t("Endpoints and the vertical line test", "端点与竖直线检验"),
      explanation: t(
        "Where two pieces of a graph end above each other at the same $x$, the dots decide. An open dot is not part of the graph, so the vertical line meets the graph twice only if **both** dots are filled.\n\n- A filled dot at $(2, 1)$ and an open dot at $(2, 4)$: a function, with $f(2) = 1$.\n- Filled dots at both $(2, 1)$ and $(2, 4)$: not a function.",
        "当图象的两段在同一个 $x$ 处上下对齐时，由端点决定。空心点不属于图象，所以只有**两个**点都是实心点时，竖直线才与图象交于两点。\n\n- $(2, 1)$ 处为实心点，$(2, 4)$ 处为空心点：是函数，且 $f(2) = 1$。\n- $(2, 1)$ 和 $(2, 4)$ 处都是实心点：不是函数。",
      ),
      generate(rng) {
        const a = rng.int(-2, 2);
        const left = walk(rng, -5, a, -5, 5, 2);
        const yl = left[left.length - 1]![1];
        const right = walk(rng, a, 5, -5, 5, 2);
        const yr = distinctFrom(rng, -5, 5, yl);
        right[0] = [a, yr];
        if (right[1]![1] === yr) right[1] = [right[1]![0], distinctFrom(rng, -5, 5, yr)];
        const both = rng.bool(0.45);
        const [openL, openR] = both ? [false, false] : rng.pick([[true, false] as const, [false, true] as const, [true, true] as const]);
        const pieces: Piece[] = [
          { pts: left, openEnd: openL },
          { pts: right, openStart: openR },
        ];
        const isFunction = openL || openR;
        return {
          ...choiceProblem({
            prompt: t("Is this the graph of a function?", "这是函数的图象吗？"),
            options: yesNo,
            correct: isFunction ? 0 : 1,
            solution: isFunction
              ? t(
                  `At $x = ${a}$ at least one of the dots at $(${a}, ${yl})$ and $(${a}, ${yr})$ is open, so the line $x = ${a}$ meets the graph at most once. Every other vertical line meets it once: it is a function.`,
                  `在 $x = ${a}$ 处，$(${a}, ${yl})$ 与 $(${a}, ${yr})$ 中至少有一个是空心点，所以直线 $x = ${a}$ 与图象最多交于一点。其他竖直线都只交于一点：它是函数。`,
                )
              : t(
                  `Both $(${a}, ${yl})$ and $(${a}, ${yr})$ are filled, so the line $x = ${a}$ meets the graph twice: it is not a function.`,
                  `$(${a}, ${yl})$ 与 $(${a}, ${yr})$ 都是实心点，所以直线 $x = ${a}$ 与图形交于两点：它不是函数。`,
                ),
          }),
          figure: graphFigure(pieces, "a relation"),
        };
      },
    },
  ],
};

// Topic: global extrema.

/** peakWalk draws a closed piece over -5..5 whose largest (sign 1) or smallest (sign -1) y-value, ±5, is at exactly one vertex. */
function peakWalk(rng: Rng, sign: 1 | -1): { pts: Point[]; at: number } {
  const pts = walk(rng, -5, 5, -4, 4, 4);
  const i = rng.int(0, pts.length - 1);
  pts[i] = [pts[i]![0], 5 * sign];
  return { pts, at: pts[i]![0] };
}

const extremumWord = (max: boolean) => (max ? t("maximum", "最大值") : t("minimum", "最小值"));

export const globalExtrema: TopicDef = {
  id: "global-extrema",
  title: t("Global Extrema of Functions", "函数的最值"),
  summary: t(
    "Find the maximum and minimum values of a function from its graph, and where they occur.",
    "从图象求函数的最大值、最小值及取得最值的位置。",
  ),
  prerequisites: ["graphs-of-functions"],
  encompasses: [{ topic: "graphs-of-functions", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.IF.B.4"],
  knowledgePoints: [
    {
      id: "maximum-and-minimum-values",
      title: t("Maximum and minimum values", "最大值与最小值"),
      explanation: t(
        "The **maximum value** of a function is its largest output, the $y$-coordinate of the **highest** point of the graph; the **minimum value** is the $y$-coordinate of the **lowest** point. They are also called the **global extrema**.\n\nThe maximum value is a $y$-value. The $x$-value where it occurs is a different number.",
        "函数的**最大值**是它最大的输出，即图象**最高点**的 $y$ 坐标；**最小值**是图象**最低点**的 $y$ 坐标。它们统称为**最值**。\n\n最大值是一个 $y$ 值，取得最大值处的 $x$ 值是另一个数。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const max = rng.bool();
        const pts = walk(rng, rng.int(-5, -3), rng.int(3, 5), -5, 5, 4);
        const ys = pts.map((p) => p[1]);
        const best = max ? Math.max(...ys) : Math.min(...ys);
        const other = max ? Math.min(...ys) : Math.max(...ys);
        const at = pts.find((p) => p[1] === best)![0];
        const word = extremumWord(max);
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $${name}$ is shown. What is the ${word.en} value of $${name}$?`,
              `如图是 $${name}$ 的图象。$${name}$ 的${word["zh-CN"]}是多少？`,
            ),
            answer: best,
            wrong: [at, other, pts[0]![1], pts[pts.length - 1]![1]],
            solution: t(
              `The ${max ? "highest" : "lowest"} point of the graph is $(${at}, ${best})$, so the ${word.en} value is $${best}$.`,
              `图象的最${max ? "高" : "低"}点是 $(${at}, ${best})$，所以${word["zh-CN"]}是 $${best}$。`,
            ),
          }),
          figure: graphFigure([{ pts }], name),
        };
      },
    },
    {
      id: "where-extrema-occur",
      title: t("Where the extrema occur", "取得最值的位置"),
      explanation: t(
        '"Where" a function takes its maximum asks for the **input**: the $x$-coordinate of the highest point. If the highest point is $(-2, 5)$, the maximum value is $5$ and it occurs at $x = -2$.',
        '问函数在"哪里"取得最大值，是问**输入**，即最高点的 $x$ 坐标。若最高点是 $(-2, 5)$，则最大值是 $5$，在 $x = -2$ 处取得。',
      ),
      generate(rng) {
        const name = rng.pick(names);
        const max = rng.bool();
        const { pts, at } = peakWalk(rng, max ? 1 : -1);
        const ys = pts.map((p) => p[1]);
        const opposite = pts.find((p) => p[1] === (max ? Math.min(...ys) : Math.max(...ys)))![0];
        const word = extremumWord(max);
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $${name}$ is shown. At what value of $x$ does $${name}$ reach its ${word.en} value?`,
              `如图是 $${name}$ 的图象。$${name}$ 在 $x$ 取何值时取得${word["zh-CN"]}？`,
            ),
            answer: at,
            solveFor: "x",
            wrong: [max ? 5 : -5, opposite],
            solution: t(
              `The ${max ? "highest" : "lowest"} point is $(${at}, ${max ? 5 : -5})$, so the ${word.en} occurs at $x = ${at}$.`,
              `最${max ? "高" : "低"}点是 $(${at}, ${max ? 5 : -5})$，所以在 $x = ${at}$ 处取得${word["zh-CN"]}。`,
            ),
          }),
          figure: graphFigure([{ pts }], name),
        };
      },
    },
    {
      id: "extrema-that-do-not-exist",
      title: t("When there is no maximum or minimum", "没有最值的情形"),
      explanation: t(
        "A graph can approach a height without reaching it. If the graph rises to an **open** dot at $(4, 5)$, the outputs get as close to $5$ as we like but never equal $5$; every output less than $5$ is beaten by a larger one. Then the function has **no maximum value**.\n\nIf some other point of the graph is at height $5$, the maximum value is $5$ after all. Check the dots before answering.",
        "图象可以无限接近某个高度却达不到它。如果图象上升到 $(4, 5)$ 处的**空心**点，输出可以任意接近 $5$，但永远不等于 $5$；任何小于 $5$ 的输出都有更大的输出。这时函数**没有最大值**。\n\n如果图象上另有一点高度为 $5$，那么最大值仍是 $5$。回答前要先看清端点。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const max = rng.bool();
        const sign = max ? 1 : -1;
        const pts = walk(rng, rng.int(-5, -3), rng.int(3, 5), -4, 4, 4);
        const end = rng.bool() ? 0 : pts.length - 1;
        pts[end] = [pts[end]![0], 5 * sign];
        const open = rng.bool(0.6);
        const reached = !open || rng.bool(0.3);
        if (open && reached) {
          // The extreme height is also reached at the other, filled end.
          const j = end === 0 ? pts.length - 1 : 0;
          pts[j] = [pts[j]![0], 5 * sign];
        }
        const piece: Piece = end === 0 ? { pts, openStart: open } : { pts, openEnd: open };
        const exists = !open || pts.some((p, i) => i !== end && p[1] === 5 * sign);
        const ys = pts.filter((_, i) => i !== end).map((p) => p[1]);
        const second = max ? Math.max(...ys) : Math.min(...ys);
        const word = extremumWord(max);
        const none = max
          ? t(`$${name}$ has no maximum value`, `$${name}$ 没有最大值`)
          : t(`$${name}$ has no minimum value`, `$${name}$ 没有最小值`);
        const values = [...new Set([5 * sign, second])];
        const options = [...values.map((v) => same(`$${v}$`)), none];
        const correct = exists ? 0 : options.length - 1;
        const edge = pts[end]!;
        return {
          ...choiceProblem({
            prompt: t(
              `The graph of $${name}$ is shown. What is the ${word.en} value of $${name}$?`,
              `如图是 $${name}$ 的图象。$${name}$ 的${word["zh-CN"]}是多少？`,
            ),
            options,
            correct,
            solution: exists
              ? t(
                  `The graph reaches height $${5 * sign}$${open ? " at a filled point, even though the dot at the end is open" : ` at the filled dot $(${edge[0]}, ${edge[1]})$`}, and nowhere goes ${max ? "higher" : "lower"}. The ${word.en} value is $${5 * sign}$.`,
                  `图象${open ? "虽然端点是空心点，但在另一个实心点处" : `在实心点 $(${edge[0]}, ${edge[1]})$ 处`}达到高度 $${5 * sign}$，且没有更${max ? "高" : "低"}的点。${word["zh-CN"]}是 $${5 * sign}$。`,
                )
              : t(
                  `The graph approaches height $${5 * sign}$ at the open dot $(${edge[0]}, ${edge[1]})$ but never reaches it, and every other output is ${max ? "smaller" : "larger"}. So there is no ${word.en} value.`,
                  `图象在空心点 $(${edge[0]}, ${edge[1]})$ 处趋近高度 $${5 * sign}$ 却达不到，其他输出都更${max ? "小" : "大"}。所以没有${word["zh-CN"]}。`,
                ),
          }),
          figure: graphFigure([piece], name),
        };
      },
    },
  ],
};

// Topic: end behavior.

const endOptions: readonly Text[] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
].map(([right, left]) => {
  const r = right! > 0 ? "\\infty" : "-\\infty";
  const l = left! > 0 ? "\\infty" : "-\\infty";
  return t(
    `As $x \\to \\infty$, $f(x) \\to ${r}$; as $x \\to -\\infty$, $f(x) \\to ${l}$`,
    `当 $x \\to \\infty$ 时 $f(x) \\to ${r}$；当 $x \\to -\\infty$ 时 $f(x) \\to ${l}$`,
  );
});

/** endIndex is the option of endOptions for a leading coefficient's sign and a degree. */
const endIndex = (sign: number, degree: number) => {
  const right = sign;
  const left = degree % 2 === 0 ? sign : -sign;
  return (right > 0 ? 0 : 2) + (left > 0 ? 0 : 1);
};

const arrowWord = (s: number) => (s > 0 ? "\\infty" : "-\\infty");

export const endBehavior: TopicDef = {
  id: "end-behavior",
  title: t("End Behavior of Functions", "函数的端点行为"),
  summary: t(
    "Describe what the outputs of a function do as x grows without bound in either direction, from a graph or from the leading term of a polynomial.",
    "从图象或多项式的首项，描述 x 向两个方向无限增大时函数输出的变化趋势。",
  ),
  prerequisites: ["graphs-of-functions", "degree-of-a-polynomial"],
  encompasses: [{ topic: "degree-of-a-polynomial", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.IF.C.7.C"],
  knowledgePoints: [
    {
      id: "end-behavior-from-a-graph",
      title: t("End behavior from a graph", "从图象看端点行为"),
      explanation: t(
        'The **end behavior** of a function describes its outputs at the far right and the far left of the graph. We write $f(x) \\to \\infty$ as $x \\to \\infty$ (read "$f(x)$ goes to infinity as $x$ goes to infinity") when the graph rises without bound as it goes right, and $f(x) \\to -\\infty$ when it falls without bound.\n\nFor $y = x^{2}$ both ends rise: $f(x) \\to \\infty$ as $x \\to \\infty$ and as $x \\to -\\infty$. Look only at the ends; the turns in the middle do not matter.',
        '函数的**端点行为**描述图象最右端和最左端的输出。当图象向右无限上升时，记作当 $x \\to \\infty$ 时 $f(x) \\to \\infty$（读作"当 $x$ 趋于无穷大时，$f(x)$ 趋于无穷大"）；当图象无限下降时，记作 $f(x) \\to -\\infty$。\n\n对于 $y = x^{2}$，两端都上升：当 $x \\to \\infty$ 以及 $x \\to -\\infty$ 时，都有 $f(x) \\to \\infty$。只看两端，中间的弯曲不影响端点行为。',
      ),
      generate(rng) {
        const degree = rng.int(1, 4);
        const roots = range(1, degree).map(() => rng.int(-3, 3));
        const sign = rng.sign();
        const scale = [1, 1, 2, 4, 12][degree]!;
        const f = (x: number) => (sign * roots.reduce((acc, r) => acc * (x - r), 1)) / scale;
        const shift = rng.int(-2, 2);
        const correct = endIndex(sign, degree);
        const right = sign > 0 ? "up" : "down";
        const left = (degree % 2 === 0 ? sign : -sign) > 0 ? "up" : "down";
        const zh = (d: string) => (d === "up" ? "上升" : "下降");
        return {
          ...choiceProblem({
            prompt: t(
              "The graph of the polynomial function $f$ is shown; it keeps going in the same direction beyond the window. Describe its end behavior.",
              "如图是多项式函数 $f$ 的图象，在窗口之外它保持原来的趋势。描述它的端点行为。",
            ),
            options: endOptions,
            correct,
            solution: t(
              `At the right the graph goes ${right}, so $f(x) \\to ${arrowWord(sign > 0 ? 1 : -1)}$ as $x \\to \\infty$. At the left it goes ${left}, so $f(x) \\to ${arrowWord(left === "up" ? 1 : -1)}$ as $x \\to -\\infty$.`,
              `图象右端${zh(right)}，所以当 $x \\to \\infty$ 时 $f(x) \\to ${arrowWord(sign > 0 ? 1 : -1)}$；左端${zh(left)}，所以当 $x \\to -\\infty$ 时 $f(x) \\to ${arrowWord(left === "up" ? 1 : -1)}$。`,
            ),
          }),
          figure: curveFigure(
            [{ kind: "curve", f: (x) => f(x) + shift, accent: true }],
            `The graph of a polynomial function of degree ${degree}. At the right end it goes ${right}; at the left end it goes ${left}.`,
            `一个 ${degree} 次多项式函数的图象。右端${zh(right)}，左端${zh(left)}。`,
          ),
        };
      },
    },
    {
      id: "end-behavior-of-polynomials",
      title: t("End behavior of polynomials", "多项式的端点行为"),
      explanation: t(
        "For large $|x|$ the term of highest degree, the **leading term** $ax^{n}$, outweighs all the others, so it alone decides the end behavior:\n\n| | $n$ even | $n$ odd |\n| :--- | :--- | :--- |\n| $a > 0$ | both ends rise | falls on the left, rises on the right |\n| $a < 0$ | both ends fall | rises on the left, falls on the right |\n\nFor $f(x) = 4x^{2} - 2x^{5} + 1$ the leading term is $-2x^{5}$ (not the first term written): $f(x) \\to -\\infty$ as $x \\to \\infty$ and $f(x) \\to \\infty$ as $x \\to -\\infty$.",
        "当 $|x|$ 很大时，次数最高的项，即**首项** $ax^{n}$，比其他各项都大得多，所以端点行为只由它决定：\n\n| | $n$ 为偶数 | $n$ 为奇数 |\n| :--- | :--- | :--- |\n| $a > 0$ | 两端都上升 | 左端下降，右端上升 |\n| $a < 0$ | 两端都下降 | 左端上升，右端下降 |\n\n对于 $f(x) = 4x^{2} - 2x^{5} + 1$，首项是 $-2x^{5}$（而不是写在最前面的项）：当 $x \\to \\infty$ 时 $f(x) \\to -\\infty$，当 $x \\to -\\infty$ 时 $f(x) \\to \\infty$。",
      ),
      keyPrerequisites: ["degree-of-a-polynomial"],
      generate(rng) {
        const n = rng.int(2, 6);
        const a = rng.nonZero(-7, 7);
        const lower = rng.sample(range(0, n - 1), 2).map((d): [number, number] => [rng.nonZero(-9, 9), d]);
        const terms = rng.shuffle([[a, n] as [number, number], ...lower]);
        const latex = poly(...terms.map(([c, d]): [number, string] => [c, d === 0 ? "" : d === 1 ? "x" : `x^{${d}}`]));
        const lead = poly([a, `x^{${n}}`]);
        return choiceProblem({
          prompt: t(`Describe the end behavior of $f(x) = ${latex}$.`, `描述 $f(x) = ${latex}$ 的端点行为。`),
          options: endOptions,
          correct: endIndex(Math.sign(a), n),
          solution: t(
            `The leading term is $${lead}$: its degree $${n}$ is ${n % 2 === 0 ? "even" : "odd"} and its coefficient is ${a > 0 ? "positive" : "negative"}. So $f(x) \\to ${arrowWord(a)}$ as $x \\to \\infty$ and $f(x) \\to ${arrowWord(n % 2 === 0 ? a : -a)}$ as $x \\to -\\infty$.`,
            `首项是 $${lead}$：次数 $${n}$ 是${n % 2 === 0 ? "偶数" : "奇数"}，系数为${a > 0 ? "正" : "负"}。所以当 $x \\to \\infty$ 时 $f(x) \\to ${arrowWord(a)}$，当 $x \\to -\\infty$ 时 $f(x) \\to ${arrowWord(n % 2 === 0 ? a : -a)}$。`,
          ),
        });
      },
    },
  ],
};

// Topic: the range of a function.

export const rangeOfAFunction: TopicDef = {
  id: "range-of-a-function",
  title: t("The Range of a Function", "函数的值域"),
  summary: t(
    "Find the range of a function from a set of pairs, a graph, or a linear formula on an interval.",
    "由数对集合、图象或区间上的一次函数公式求函数的值域。",
  ),
  prerequisites: ["domain-of-a-function", "global-extrema"],
  encompasses: [
    { topic: "domain-of-a-function", weight: 0.3 },
    { topic: "global-extrema", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.B.5"],
  knowledgePoints: [
    {
      id: "range-of-a-set-of-pairs",
      title: t("The range of a set of pairs", "数对集合的值域"),
      explanation: t(
        "The **range** of a function is the set of all its outputs. For a function given as ordered pairs, it is the set of second coordinates, each listed once:\n\n$$\\{(-2, 3), (0, 7), (4, 3)\\} \\text{ has range } \\{3, 7\\}.$$",
        "函数的**值域**是所有输出组成的集合。对于用有序数对给出的函数，它就是所有第二个坐标组成的集合，每个数只写一次：\n\n$$\\{(-2, 3), (0, 7), (4, 3)\\} \\text{ 的值域是 } \\{3, 7\\}.$$",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        const xs = rng.sample(range(-6, 9), n);
        const ys = xs.map(() => rng.int(-9, 9));
        if (rng.bool(0.6)) ys[n - 1] = ys[0]!;
        const ps = rng.shuffle(xs.map((x, i): Point => [x, ys[i]!]));
        const answer = setOf(ys);
        const extra = distinctFrom(rng, -9, 9, ys[0]!);
        const candidates = [answer, setOf(xs), setOf([...xs, ...ys]), setOf([...ys, extra])].filter((s, i, all) => all.indexOf(s) === i);
        const options = rng.shuffle(candidates);
        return choiceProblem({
          prompt: t(`What is the range of the function $${pairs(ps)}$?`, `函数 $${pairs(ps)}$ 的值域是什么？`),
          options: options.map((s) => same(`$${s}$`)),
          correct: options.indexOf(answer),
          solution: t(
            `The range is the set of outputs, the second coordinates: $${answer}$.`,
            `值域是所有输出，即第二个坐标组成的集合：$${answer}$。`,
          ),
        });
      },
    },
    {
      id: "range-from-a-graph",
      title: t("The range from a graph", "由图象求值域"),
      explanation: t(
        "On a graph, the range is the set of $y$-values the graph covers: look at how far it reaches **down and up**. The range runs from the minimum to the maximum value, which are often not at the ends of the graph.\n\nAn endpoint of the range is excluded only if the graph reaches that height **only** at an open dot.",
        "在图象上，值域就是图象覆盖的所有 $y$ 值：看图象**向下和向上**延伸到哪里。值域从最小值到最大值，而最值常常不在图象的两端取得。\n\n只有当图象**仅**在空心点处达到某个高度时，值域才不包含这个端点。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const pts = walk(rng, rng.int(-5, -2), rng.int(2, 5), -5, 5, 3);
        const piece: Piece = { pts, openStart: rng.bool(), openEnd: rng.bool() };
        const set = rangeOf([piece]);
        const ends = [pts[0]![1], pts[pts.length - 1]![1]].sort((a, b) => a - b);
        return {
          ...intervalProblem({
            prompt: t(`The graph of $${name}$ is shown. Find the range of $${name}$.`, `如图是 $${name}$ 的图象。求 $${name}$ 的值域。`),
            set,
            wrong: [domainOf([piece]), withEnds(set, true), withEnds(set, false), union(iv(ends[0], ends[1]))],
            solution: t(
              `The graph covers the heights from its lowest to its highest point: the range is ${setText(set)}.`,
              `图象覆盖从最低点到最高点的所有高度：值域是 ${setText(set)}。`,
            ),
          }),
          figure: graphFigure([piece], name),
        };
      },
    },
    {
      id: "range-of-a-linear-function-on-an-interval",
      title: t("Linear functions on an interval", "区间上的一次函数"),
      explanation: t(
        "A linear function $f(x) = mx + b$ with $m \\ne 0$ moves steadily in one direction, so on an interval its outputs run between the values at the two ends. For $f(x) = -2x + 1$ with domain $-1 \\le x < 3$:\n\n$$f(-1) = 3, \\qquad f(3) = -5.$$\n\nThe value at $x = 3$ is not reached, because $3$ is not in the domain. The range is $(-5, 3]$: the excluded end moves with the input that produces it.",
        "一次函数 $f(x) = mx + b$（$m \\ne 0$）总是朝一个方向变化，所以在一个区间上，它的输出介于两端的函数值之间。对于定义域为 $-1 \\le x < 3$ 的 $f(x) = -2x + 1$：\n\n$$f(-1) = 3, \\qquad f(3) = -5.$$\n\n$x = 3$ 不在定义域内，所以取不到 $x = 3$ 处的值。值域是 $(-5, 3]$：不包含的端点跟着产生它的输入走。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const m = rng.nonZero(-4, 4);
        const b = rng.int(-6, 6);
        const lo = rng.int(-6, 0);
        const hi = rng.int(lo + 1, 6);
        const [loIn, hiIn] = rng.pick([
          [true, true],
          [true, false],
          [false, true],
          [false, false],
        ] as const);
        const domain = union(iv(lo, hi, loIn, hiIn));
        const fl = m * lo + b;
        const fh = m * hi + b;
        const set = m > 0 ? union(iv(fl, fh, loIn, hiIn)) : union(iv(fh, fl, hiIn, loIn));
        const unswapped = m > 0 ? set : union(iv(fh, fl, loIn, hiIn));
        const domainText = `${lo} ${loIn ? "\\le" : "<"} x ${hiIn ? "\\le" : "<"} ${hi}`;
        return intervalProblem({
          prompt: t(
            `Find the range of $${name}(x) = ${linear(m, b)}$ with domain $${domainText}$.`,
            `求定义域为 $${domainText}$ 的函数 $${name}(x) = ${linear(m, b)}$ 的值域。`,
          ),
          set,
          wrong: [domain, unswapped, withEnds(set, true), withEnds(set, false)],
          solution: t(
            `Evaluate at the ends: $${valueLatex(name, lo, fl)}$ ${loIn ? "(included)" : "(excluded)"} and $${valueLatex(name, hi, fh)}$ ${hiIn ? "(included)" : "(excluded)"}. The range is ${setText(set)}.`,
            `计算两端的值：$${valueLatex(name, lo, fl)}$${loIn ? "（包含）" : "（不包含）"}，$${valueLatex(name, hi, fh)}$${hiIn ? "（包含）" : "（不包含）"}。值域是 ${setText(set)}。`,
          ),
        });
      },
    },
  ],
};

// Topic: the range of a function, advanced cases.

/** squareLatex writes a(x - h)^2 + k. */
function squareLatex(a: number, h: number, k: number): string {
  const inner = h === 0 ? "x" : `(${linear(1, -h)})`;
  const coef = a === 1 ? "" : a === -1 ? "-" : String(a);
  return `${coef}${inner}^{2}${plus(k)}`;
}

export const rangeAdvancedCases: TopicDef = {
  id: "range-advanced-cases",
  title: t("The Range of a Function: Advanced Cases", "函数的值域：进阶情形"),
  summary: t(
    "Find ranges of graphs made of several pieces, and of functions built from squares and square roots.",
    "求由几段组成的图象的值域，以及由平方和平方根构成的函数的值域。",
  ),
  prerequisites: ["range-of-a-function"],
  encompasses: [{ topic: "range-of-a-function", weight: 0.7 }],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.5"],
  knowledgePoints: [
    {
      id: "ranges-of-graphs-in-pieces",
      title: t("Graphs in several pieces", "分段的图象"),
      explanation: t(
        "When a graph comes in pieces, find the $y$-values covered by each piece and join them with $\\cup$. If the pieces cover overlapping heights, the parts merge into one interval; if there is a band of heights that no piece reaches, the range has a gap.\n\nAn open dot leaves a height out only if no other point of the graph is at that height.",
        "当图象由几段组成时，分别求出每一段覆盖的 $y$ 值，再用 $\\cup$ 合并。如果各段覆盖的高度有重叠，它们就合成一个区间；如果有一段高度没有任何一段图象达到，值域就有间断。\n\n只有当图象上没有其他点处于某个高度时，空心点才会使这个高度不在值域内。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const m = rng.int(-2, 0);
        const m2 = rng.int(m, m + 2);
        const bands: [number, number][] = rng.bool(0.6)
          ? rng.shuffle([
              [-5, -1],
              [1, 5],
            ])
          : [
              [-5, 5],
              [-5, 5],
            ];
        const pieces = twoPieces(rng, rng.int(-5, m - 1), m, m2, rng.int(m2 + 1, 5), bands);
        if (m2 === m && !pieces[0]!.openEnd && !pieces[1]!.openStart) pieces[1] = { ...pieces[1]!, openStart: true };
        const set = rangeOf(pieces);
        return {
          ...intervalProblem({
            prompt: t(`The graph of $${name}$ is shown. Find the range of $${name}$.`, `如图是 $${name}$ 的图象。求 $${name}$ 的值域。`),
            set,
            wrong: [hull(set), withEnds(set, true), withEnds(set, false), domainOf(pieces), rangeOf([pieces[0]!])],
            solution: t(
              `The left piece covers the heights ${setText(rangeOf([pieces[0]!]))} and the right piece ${setText(rangeOf([pieces[1]!]))}. Together: ${setText(set)}.`,
              `左边一段覆盖的高度为 ${setText(rangeOf([pieces[0]!]))}，右边一段为 ${setText(rangeOf([pieces[1]!]))}。合起来是 ${setText(set)}。`,
            ),
          }),
          figure: graphFigure(pieces, name),
        };
      },
    },
    {
      id: "ranges-of-squares-and-roots",
      title: t("Squares and square roots", "平方与平方根"),
      explanation: t(
        "A square is never negative and takes every value $\\ge 0$: $(x - 3)^{2}$ has range $[0, \\infty)$, wherever the $3$ is. So\n\n$$f(x) = (x - 3)^{2} + 2 \\text{ has range } [2, \\infty), \\qquad g(x) = -2(x + 1)^{2} + 5 \\text{ has range } (-\\infty, 5].$$\n\nThe same holds for a square root: $\\sqrt{x - 4}$ takes every value $\\ge 0$, so $\\sqrt{x - 4} - 1$ has range $[-1, \\infty)$. The number inside the square or root shifts the graph sideways and does not change the range.",
        "平方永远不是负数，并且能取到所有 $\\ge 0$ 的值：无论 $3$ 是多少，$(x - 3)^{2}$ 的值域都是 $[0, \\infty)$。所以\n\n$$f(x) = (x - 3)^{2} + 2 \\text{ 的值域是 } [2, \\infty), \\qquad g(x) = -2(x + 1)^{2} + 5 \\text{ 的值域是 } (-\\infty, 5].$$\n\n平方根也是如此：$\\sqrt{x - 4}$ 能取到所有 $\\ge 0$ 的值，所以 $\\sqrt{x - 4} - 1$ 的值域是 $[-1, \\infty)$。平方或根号里面的数只是使图象左右平移，不改变值域。",
      ),
      keyPrerequisites: ["square-roots-and-cube-roots"],
      generate(rng) {
        const name = rng.pick(names);
        const a = rng.sign() * rng.int(1, 3);
        const h = rng.int(-6, 6);
        let k = rng.int(-9, 9);
        if (k === h) k = h + rng.sign();
        const root = rng.bool(0.4);
        const s = a > 0 ? 1 : -1;
        const expr = root
          ? `${a < 0 ? "-" : ""}${Math.abs(a) === 1 ? "" : Math.abs(a)}\\sqrt{${linear(1, -h)}}${plus(k)}`
          : squareLatex(a, h, k);
        const set = s > 0 ? union(iv(k, undefined)) : union(iv(undefined, k));
        const shape = root ? t("square root", "平方根") : t("square", "平方");
        return intervalProblem({
          prompt: t(`Find the range of $${name}(x) = ${expr}$.`, `求 $${name}(x) = ${expr}$ 的值域。`),
          set,
          wrong: [
            s > 0 ? union(iv(h, undefined)) : union(iv(undefined, h)),
            withEnds(set, false),
            s > 0 ? union(iv(undefined, k)) : union(iv(k, undefined)),
            realLine,
          ],
          solution: t(
            `The ${shape.en} takes every value $\\ge 0$. ${s > 0 ? "Multiplied by a positive number" : "Multiplied by a negative number"}, it takes every value ${s > 0 ? "$\\ge 0$" : "$\\le 0$"}; adding $${num(k)}$ gives ${setText(set)}.`,
            `${shape["zh-CN"]}能取到所有 $\\ge 0$ 的值。乘以${s > 0 ? "正数" : "负数"}后，它取到所有 ${s > 0 ? "$\\ge 0$" : "$\\le 0$"} 的值；再加上 $${num(k)}$，得到 ${setText(set)}。`,
          ),
        });
      },
    },
  ],
};

// Topic: the roots of a function.

export const rootsOfAFunction: TopicDef = {
  id: "roots-of-a-function",
  title: t("The Roots of a Function", "函数的零点"),
  summary: t(
    "Find the roots of a function from its graph or its formula, and tell them from the y-intercept.",
    "从图象或公式求函数的零点，并区分零点与 y 轴截距。",
  ),
  prerequisites: ["graphs-of-functions", "properties-of-lines-in-slope-intercept-form"],
  encompasses: [
    { topic: "graphs-of-functions", weight: 0.3 },
    { topic: "two-step-equations", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSF.IF.C.7.A"],
  knowledgePoints: [
    {
      id: "roots-from-a-graph",
      title: t("Roots from a graph", "从图象求零点"),
      explanation: t(
        "A **root** (or **zero**) of a function $f$ is an input $x$ with $f(x) = 0$. On the graph, the roots are the $x$-coordinates of the points where the graph meets the $x$-axis: its **$x$-intercepts**.\n\nA root is an $x$-value. The point where the graph meets the $y$-axis gives the $y$-intercept $f(0)$, which is something else.",
        "函数 $f$ 的**零点**（也叫**根**）是满足 $f(x) = 0$ 的输入 $x$。在图象上，零点就是图象与 $x$ 轴交点的 $x$ 坐标，即 **$x$ 轴截距**。\n\n零点是 $x$ 值。图象与 $y$ 轴交点给出的是 $y$ 轴截距 $f(0)$，那是另一回事。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const { pts, hits } = levelWalk(rng, 0, -5, 5);
        const wrong: string[][] = [];
        const f0 = valueAt(pts, 0);
        if (f0 !== undefined && f0 !== 0) wrong.push([String(f0)]);
        if (hits.length > 1) wrong.push(hits.slice(1).map(String), hits.slice(0, -1).map(String));
        else wrong.push([String(-hits[0]!)]);
        return {
          ...solutionsProblem({
            prompt: t(
              `The graph of $${name}$ is shown. Find all roots of $${name}$.`,
              `如图是 $${name}$ 的图象。求 $${name}$ 的所有零点。`,
            ),
            values: hits.map(String),
            wrong,
            solution: t(
              `The graph meets the $x$-axis at ${hits.map((x) => `$(${x}, 0)$`).join(" and ")}, so the roots are ${hits.map((x) => `$x = ${x}$`).join(" and ")}.`,
              `图象与 $x$ 轴交于 ${hits.map((x) => `$(${x}, 0)$`).join("、")}，所以零点是 ${hits.map((x) => `$x = ${x}$`).join("、")}。`,
            ),
          }),
          figure: graphFigure([{ pts }], name),
        };
      },
    },
    {
      id: "roots-of-linear-functions",
      title: t("Roots of linear functions", "一次函数的零点"),
      explanation: t(
        "To find a root from a formula, set the function equal to $0$ and solve. For $f(x) = 4x + 6$:\n\n$$4x + 6 = 0 \\;\\Rightarrow\\; 4x = -6 \\;\\Rightarrow\\; x = -\\frac{3}{2}.$$",
        "由公式求零点，就是令函数等于 $0$ 并解方程。对于 $f(x) = 4x + 6$：\n\n$$4x + 6 = 0 \\;\\Rightarrow\\; 4x = -6 \\;\\Rightarrow\\; x = -\\frac{3}{2}.$$",
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const name = rng.pick(names);
        const a = rng.sign() * rng.int(2, 9);
        const b = rng.nonZero(-15, 15);
        const root = Q.of(-b, a);
        return numberProblem({
          prompt: t(`Find the root of $${name}(x) = ${linear(a, b)}$.`, `求 $${name}(x) = ${linear(a, b)}$ 的零点。`),
          answer: root,
          solveFor: "x",
          wrong: [Q.of(b, a), Q.of(-a, b), b],
          solution: t(
            `Set $${name}(x) = 0$ and solve:${steps(`${linear(a, b)} = 0`, `${poly([a, "x"])} = ${num(-b)}`, `x = ${root.toLatex()}`)}`,
            `令 $${name}(x) = 0$ 并求解：${steps(`${linear(a, b)} = 0`, `${poly([a, "x"])} = ${num(-b)}`, `x = ${root.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "x-and-y-intercepts",
      title: t("Intercepts of a graph", "图象的截距"),
      explanation: t(
        "The graph of $f$ meets the $x$-axis at $(r, 0)$ for each root $r$, and meets the $y$-axis at $(0, f(0))$. For $f(x) = 2x - 8$:\n\n- $x$-intercept: $2x - 8 = 0$ gives $x = 4$, the point $(4, 0)$;\n- $y$-intercept: $f(0) = -8$, the point $(0, -8)$.",
        "函数 $f$ 的图象与 $x$ 轴交于点 $(r, 0)$，其中 $r$ 是零点；与 $y$ 轴交于点 $(0, f(0))$。对于 $f(x) = 2x - 8$：\n\n- 与 $x$ 轴的交点：由 $2x - 8 = 0$ 得 $x = 4$，即点 $(4, 0)$；\n- 与 $y$ 轴的交点：$f(0) = -8$，即点 $(0, -8)$。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-12, 12);
        const root = Q.of(-b, a);
        const xAxis = rng.bool();
        const answer = xAxis ? [root, Q.zero] : [Q.zero, Q.of(b)];
        return pointProblem({
          prompt: t(
            `At which point does the graph of $${name}(x) = ${linear(a, b)}$ meet the ${xAxis ? "$x$" : "$y$"}-axis?`,
            `$${name}(x) = ${linear(a, b)}$ 的图象与 ${xAxis ? "$x$" : "$y$"} 轴交于哪一点？`,
          ),
          answer,
          wrong: xAxis
            ? [
                [Q.zero, root],
                [Q.zero, Q.of(b)],
                [Q.of(b, a), Q.zero],
              ]
            : [
                [Q.of(b), Q.zero],
                [root, Q.zero],
              ],
          solution: xAxis
            ? t(
                `On the $x$-axis $y = 0$: solving $${linear(a, b)} = 0$ gives $x = ${root.toLatex()}$. The point is $(${root.toLatex()}, 0)$.`,
                `在 $x$ 轴上 $y = 0$：解 $${linear(a, b)} = 0$ 得 $x = ${root.toLatex()}$。交点是 $(${root.toLatex()}, 0)$。`,
              )
            : t(
                `On the $y$-axis $x = 0$: $${valueLatex(name, 0, b)}$. The point is $(0, ${num(b)})$.`,
                `在 $y$ 轴上 $x = 0$：$${valueLatex(name, 0, b)}$。交点是 $(0, ${num(b)})$。`,
              ),
        });
      },
    },
  ],
};

// Topic: increasing and decreasing functions.

/** monotoneWalk draws a piece over -5..5 that both rises and falls, with integer vertices in [-5, 5]. */
function monotoneWalk(rng: Rng, flat: boolean): Point[] {
  const xs = walkXs(rng, -5, 5, 4);
  const n = xs.length - 1;
  const dirs: number[] = [];
  for (let i = 0; i < n; i++) dirs.push(i === 0 ? rng.sign() : rng.bool(0.65) ? -dirs[i - 1]! : dirs[i - 1]!);
  if (dirs.every((d) => d === dirs[0])) dirs[n - 1] = -dirs[0]!;
  if (flat && n >= 3) dirs[rng.int(1, n - 2)] = 0;
  const ys = [0];
  for (const d of dirs) ys.push(ys[ys.length - 1]! + d * rng.int(1, 2));
  const lo = Math.min(...ys);
  const hi = Math.max(...ys);
  const shift = rng.int(-5 - lo, 5 - hi);
  return xs.map((x, i) => [x, ys[i]! + shift]);
}

/** runsOf is the union of the open intervals of x where a piece moves in direction dir (1 up, -1 down, 0 flat). */
function runsOf(pts: readonly Point[], dir: number): RealSet {
  const runs: Interval[] = [];
  let start: number | undefined;
  for (let i = 0; i + 1 < pts.length; i++) {
    const d = Math.sign(pts[i + 1]![1] - pts[i]![1]);
    if (d === dir && start === undefined) start = pts[i]![0];
    if (d !== dir && start !== undefined) {
      runs.push(iv(start, pts[i]![0], false, false));
      start = undefined;
    }
  }
  if (start !== undefined) runs.push(iv(start, pts[pts.length - 1]![0], false, false));
  return union(...runs);
}

const directionWord = (dir: number) =>
  dir > 0 ? t("increasing", "递增") : dir < 0 ? t("decreasing", "递减") : t("constant", "不变（常数）");

export const increasingAndDecreasing: TopicDef = {
  id: "increasing-and-decreasing",
  title: t("Increasing and Decreasing Functions", "函数的增减性"),
  summary: t("Find the intervals on which a function increases, decreases or stays constant.", "求函数递增、递减或保持不变的区间。"),
  prerequisites: ["domain-of-a-function", "slope-of-a-line"],
  encompasses: [{ topic: "domain-of-a-function", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSF.IF.B.4"],
  knowledgePoints: [
    {
      id: "intervals-of-increase-and-decrease",
      title: t("Intervals of increase and decrease", "递增区间与递减区间"),
      explanation: t(
        "Reading a graph from left to right, a function is **increasing** where the graph goes up, **decreasing** where it goes down, and **constant** where it is flat. These are intervals of $x$-values, not of $y$-values.\n\nWe write them as **open** intervals, between the $x$-coordinates of the turning points: a graph that rises from $x = -4$ to $x = 1$ and falls from $x = 1$ to $x = 5$ is increasing on $(-4, 1)$ and decreasing on $(1, 5)$. Join separate intervals with $\\cup$.",
        "从左往右看图象，图象上升的部分函数**递增**，下降的部分函数**递减**，水平的部分函数**不变**。这些都是 $x$ 值的区间，而不是 $y$ 值的区间。\n\n我们用**开区间**表示它们，端点是转折点的 $x$ 坐标：从 $x = -4$ 上升到 $x = 1$、再从 $x = 1$ 下降到 $x = 5$ 的图象，在 $(-4, 1)$ 上递增，在 $(1, 5)$ 上递减。几个分开的区间用 $\\cup$ 连接。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const flat = rng.bool(0.3);
        const pts = monotoneWalk(rng, flat);
        const dirs = flat ? [1, -1, 0] : [1, -1];
        const dir = rng.pick(dirs.filter((d) => runsOf(pts, d).length > 0));
        const set = runsOf(pts, dir);
        const word = directionWord(dir);
        const yValues = union(
          ...set.map((i) => {
            const y0 = valueAt(pts, Number(i.lo!.n))!;
            const y1 = valueAt(pts, Number(i.hi!.n))!;
            return y0 === y1 ? iv(y0 - 1, y0 + 1, false, false) : iv(Math.min(y0, y1), Math.max(y0, y1), false, false);
          }),
        );
        return {
          ...intervalProblem({
            prompt: t(
              `The graph of $${name}$ is shown. On which interval or intervals is $${name}$ ${word.en}? Use open intervals.`,
              `如图是 $${name}$ 的图象。$${name}$ 在哪个或哪些区间上${word["zh-CN"]}？用开区间表示。`,
            ),
            set,
            form: "interval",
            wrong: [runsOf(pts, dir === 1 ? -1 : 1), withEnds(set, true), yValues],
            solution: t(
              `Reading from left to right, the graph is ${dir > 0 ? "going up" : dir < 0 ? "going down" : "flat"} for $x$ in ${setText(set)}.`,
              `从左往右看，当 $x$ 在 ${setText(set)} 内时，图象${dir > 0 ? "上升" : dir < 0 ? "下降" : "水平"}。`,
            ),
          }),
          figure: graphFigure([{ pts }], name),
        };
      },
    },
    {
      id: "increasing-and-decreasing-linear-functions",
      title: t("Linear functions", "一次函数的增减性"),
      explanation: t(
        "For a linear function $f(x) = mx + b$, increasing $x$ by $1$ changes $f(x)$ by $m$. So $f$ is **increasing** everywhere if $m > 0$, **decreasing** everywhere if $m < 0$, and **constant** if $m = 0$. The constant term $b$ plays no part.\n\n$f(x) = 7 - 3x$ is decreasing: the coefficient of $x$ is $-3$.",
        "对于一次函数 $f(x) = mx + b$，$x$ 每增加 $1$，$f(x)$ 就改变 $m$。所以 $m > 0$ 时 $f$ 处处**递增**，$m < 0$ 时处处**递减**，$m = 0$ 时**不变**。常数项 $b$ 不起作用。\n\n$f(x) = 7 - 3x$ 是递减的：$x$ 的系数是 $-3$。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const m = rng.bool(0.2) ? 0 : rng.nonZero(-9, 9);
        const b = rng.nonZero(-12, 12);
        const expr = m === 0 ? num(b) : rng.bool() ? linear(m, b) : poly([b, ""], [m, "x"]);
        const options = [t("Increasing", "递增"), t("Decreasing", "递减"), t("Constant", "不变（常数函数）")];
        const correct = m > 0 ? 0 : m < 0 ? 1 : 2;
        return choiceProblem({
          prompt: t(`Is $${name}(x) = ${expr}$ increasing, decreasing or constant?`, `$${name}(x) = ${expr}$ 是递增、递减还是不变的？`),
          options,
          correct,
          solution:
            m === 0
              ? t(
                  `The formula has no $x$ term: every input gives $${num(b)}$, so $${name}$ is constant.`,
                  `公式中没有 $x$ 项：每个输入的输出都是 $${num(b)}$，所以 $${name}$ 不变。`,
                )
              : t(
                  `The coefficient of $x$ is $${num(m)}$, which is ${m > 0 ? `positive, so $${name}$ is increasing` : `negative, so $${name}$ is decreasing`}.`,
                  `$x$ 的系数是 $${num(m)}$，${m > 0 ? `为正，所以 $${name}$ 递增` : `为负，所以 $${name}$ 递减`}。`,
                ),
        });
      },
    },
  ],
};

// Topic: piecewise functions.

/** Rule is one piece of a piecewise function: a polynomial and the condition on x. */
interface Rule {
  readonly p: Poly;
  readonly cond: string;
  readonly holds: (x: number) => boolean;
}

function casesLatex(name: string, rules: readonly Rule[], when: string): string {
  return `${name}(x) = \\begin{cases} ${rules.map((r) => `${polyLatex(r.p)} & \\text{${when} } ${r.cond}`).join(" \\\\ ")} \\end{cases}`;
}

export const piecewiseFunctions: TopicDef = {
  id: "piecewise-functions",
  title: t("Piecewise Functions", "分段函数"),
  summary: t(
    "Evaluate functions defined by different formulas on different intervals, and read them from graphs.",
    "计算在不同区间上由不同公式定义的函数的值，并从图象读取函数值。",
  ),
  prerequisites: ["graphs-of-functions", "inequalities-and-solutions"],
  encompasses: [
    { topic: "graphs-of-functions", weight: 0.3 },
    { topic: "inequalities-and-solutions", weight: 0.3 },
    { topic: "evaluating-expressions", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.B"],
  knowledgePoints: [
    {
      id: "evaluating-piecewise-functions",
      title: t("Evaluating piecewise functions", "分段函数求值"),
      explanation: t(
        "A **piecewise function** uses different formulas on different parts of its domain:\n\n$$f(x) = \\begin{cases} 2x + 1 & \\text{if } x < 3 \\\\ x^{2} & \\text{if } x \\ge 3 \\end{cases}$$\n\nTo evaluate, first find the condition the input satisfies, then use that formula only. $f(1) = 2(1) + 1 = 3$, since $1 < 3$. At the boundary, $3 \\ge 3$ holds, so $f(3) = 3^{2} = 9$.",
        "**分段函数**在定义域的不同部分使用不同的公式：\n\n$$f(x) = \\begin{cases} 2x + 1 & \\text{若 } x < 3 \\\\ x^{2} & \\text{若 } x \\ge 3 \\end{cases}$$\n\n求值时，先看输入满足哪个条件，再只用那一个公式。因为 $1 < 3$，所以 $f(1) = 2(1) + 1 = 3$。在分界点，$3 \\ge 3$ 成立，所以 $f(3) = 3^{2} = 9$。",
      ),
      keyPrerequisites: ["inequalities-and-solutions", "evaluating-expressions"],
      generate(rng) {
        const name = rng.pick(names);
        const formula = (): Poly =>
          rng.pick([
            () => [rng.int(-9, 9), rng.nonZero(-5, 5)],
            () => [rng.int(-6, 6), 0, rng.nonZero(-2, 2)],
            () => [rng.nonZero(-9, 9)],
          ])();
        const a = rng.int(-4, 2);
        const leftClosed = rng.bool();
        const rules: Rule[] = [{ p: formula(), cond: `x ${leftClosed ? "\\le" : "<"} ${a}`, holds: (x) => (leftClosed ? x <= a : x < a) }];
        if (rng.bool(0.4)) {
          const b = a + rng.int(2, 4);
          rules.push({
            p: formula(),
            cond: `${a} ${leftClosed ? "<" : "\\le"} x ${leftClosed ? "<" : "\\le"} ${b}`,
            holds: (x) => (leftClosed ? x > a && x < b : x >= a && x <= b),
          });
          rules.push({ p: formula(), cond: `x ${leftClosed ? "\\ge" : ">"} ${b}`, holds: (x) => (leftClosed ? x >= b : x > b) });
        } else {
          rules.push({ p: formula(), cond: `x ${leftClosed ? ">" : "\\ge"} ${a}`, holds: (x) => (leftClosed ? x > a : x >= a) });
        }
        const k = rng.bool(0.4) ? a : rng.int(-6, 6);
        const rule = rules.find((r) => r.holds(k))!;
        const value = evalPoly(rule.p, k);
        const others = rules.filter((r) => r !== rule).map((r) => evalPoly(r.p, k));
        const cases = (when: string) => casesLatex(name, rules, when);
        return numberProblem({
          prompt: t(`Given $$${cases("if")}$$ find $${name}(${k})$.`, `已知 $$${cases("若")}$$ 求 $${name}(${k})$。`),
          answer: value,
          wrong: others,
          solution:
            rule.p.length === 1
              ? t(
                  `The input $${k}$ satisfies $${rule.cond}$, and on that piece the function is the constant $${num(value)}$: $${valueLatex(name, k, value)}$.`,
                  `输入 $${k}$ 满足 $${rule.cond}$，在这一段上函数是常数 $${num(value)}$：$${valueLatex(name, k, value)}$。`,
                )
              : t(
                  `The input $${k}$ satisfies $${rule.cond}$, so use $${polyLatex(rule.p)}$:${steps(`${name}(${k}) = ${substitution(rule.p, k)} = ${num(value)}`)}`,
                  `输入 $${k}$ 满足 $${rule.cond}$，所以用 $${polyLatex(rule.p)}$：${steps(`${name}(${k}) = ${substitution(rule.p, k)} = ${num(value)}`)}`,
                ),
        });
      },
    },
    {
      id: "graphs-of-piecewise-functions",
      title: t("Graphs of piecewise functions", "分段函数的图象"),
      explanation: t(
        "The graph of a piecewise function often jumps at a boundary. At the jump, the filled dot shows the value of the function; the open dot marks a point that is not on the graph.\n\nIn the figure, the left piece ends with a filled dot at $(1, 3)$ and the right piece starts with an open dot at $(1, -2)$, so $f(1) = 3$.",
        "分段函数的图象常常在分界点处跳跃。在跳跃处，实心点表示函数值，空心点表示不在图象上的点。\n\n图中左边一段在 $(1, 3)$ 处以实心点结束，右边一段在 $(1, -2)$ 处以空心点开始，所以 $f(1) = 3$。",
      ),
      figure: graphFigure([
        {
          pts: [
            [-5, -1],
            [-2, 1],
            [1, 3],
          ],
        },
        {
          pts: [
            [1, -2],
            [5, 2],
          ],
          openStart: true,
        },
      ]),
      generate(rng) {
        const name = rng.pick(names);
        const a = rng.int(-2, 2);
        const left = walk(rng, -5, a, -5, 5, 2);
        const yl = left[left.length - 1]![1];
        const right = walk(rng, a, 5, -5, 5, 2);
        const yr = distinctFrom(rng, -5, 5, yl);
        right[0] = [a, yr];
        if (right[1]![1] === yr) right[1] = [right[1]![0], distinctFrom(rng, -5, 5, yr)];
        const leftFilled = rng.bool();
        const pieces: Piece[] = [
          { pts: left, openEnd: !leftFilled },
          { pts: right, openStart: leftFilled },
        ];
        const [value, other] = leftFilled ? [yl, yr] : [yr, yl];
        return {
          ...numberProblem({
            prompt: t(`The graph of $${name}$ is shown. Find $${name}(${a})$.`, `如图是 $${name}$ 的图象。求 $${name}(${a})$。`),
            answer: value,
            wrong: [other, Q.of(yl + yr, 2)],
            solution: t(
              `At $x = ${a}$ the filled dot is $(${a}, ${value})$; the open dot $(${a}, ${other})$ is not on the graph. So $${valueLatex(name, a, value)}$.`,
              `在 $x = ${a}$ 处，实心点是 $(${a}, ${value})$，空心点 $(${a}, ${other})$ 不在图象上。所以 $${valueLatex(name, a, value)}$。`,
            ),
          }),
          figure: graphFigure(pieces, name),
        };
      },
    },
  ],
};

// Topics: modeling with and constructing linear functions.

/** Context is a situation described by a linear function: output = fixed + sign · rate · input. */
interface Context {
  readonly fn: string;
  readonly v: string;
  readonly grows: boolean;
  readonly fixed: (rng: Rng) => number;
  readonly rate: (rng: Rng) => number;
  /** describe states the situation without the formula. */
  readonly describe: (fixed: number, rate: number) => Text;
  /** defines says what the function gives. */
  readonly defines: Text;
  /** outputOf asks for the output at an input. */
  readonly outputOf: (n: number) => Text;
  /** inputFor asks for the input that gives an output. */
  readonly inputFor: (out: number) => Text;
  readonly meanings: { readonly fixed: Text; readonly rate: Text; readonly output: Text; readonly input: Text };
}

const contexts: readonly Context[] = [
  {
    fn: "C",
    v: "d",
    grows: true,
    fixed: (rng) => rng.int(3, 9),
    rate: (rng) => rng.int(2, 5),
    describe: (f, r) =>
      t(
        `A taxi charges a fixed fee of $${f}$ dollars plus $${r}$ dollars per kilometer.`,
        `一辆出租车收取 $${f}$ 元的起步费，另外每千米收费 $${r}$ 元。`,
      ),
    defines: t("the fare in dollars for a ride of $d$ kilometers", "行驶 $d$ 千米的车费（元）"),
    outputOf: (n) => t(`What is the fare for a ride of $${n}$ kilometers?`, `行驶 $${n}$ 千米的车费是多少元？`),
    inputFor: (c) => t(`How many kilometers long is a ride that costs $${c}$ dollars?`, `车费为 $${c}$ 元的行程有多少千米？`),
    meanings: {
      fixed: t("The fixed fee charged for every ride", "每次乘车都要付的起步费"),
      rate: t("The cost of each kilometer", "每千米的费用"),
      output: t("The fare of the whole ride", "整个行程的车费"),
      input: t("The length of the ride", "行程的长度"),
    },
  },
  {
    fn: "C",
    v: "g",
    grows: true,
    fixed: (rng) => 5 * rng.int(2, 8),
    rate: (rng) => rng.int(3, 12),
    describe: (f, r) =>
      t(
        `A phone plan costs $${f}$ dollars a month plus $${r}$ dollars for each gigabyte of data used.`,
        `一种手机套餐每月月租 $${f}$ 元，另外每使用 $1$ GB 流量收费 $${r}$ 元。`,
      ),
    defines: t("the monthly cost in dollars when $g$ gigabytes are used", "使用 $g$ GB 流量时的月费（元）"),
    outputOf: (n) => t(`What is the cost of a month in which $${n}$ gigabytes are used?`, `某月使用了 $${n}$ GB 流量，月费是多少元？`),
    inputFor: (c) =>
      t(`How many gigabytes were used in a month that cost $${c}$ dollars?`, `某月月费为 $${c}$ 元，这个月使用了多少 GB 流量？`),
    meanings: {
      fixed: t("The monthly charge before any data is used", "不用流量时的月租"),
      rate: t("The cost of each gigabyte", "每 GB 流量的费用"),
      output: t("The total cost for the month", "当月的总费用"),
      input: t("The amount of data used", "使用的流量"),
    },
  },
  {
    fn: "V",
    v: "t",
    grows: false,
    fixed: (rng) => 50 * rng.int(4, 18),
    rate: (rng) => 5 * rng.int(1, 5),
    describe: (f, r) =>
      t(
        `A tank holds $${f}$ liters of water. It drains at $${r}$ liters per minute.`,
        `一个水箱装有 $${f}$ 升水，以每分钟 $${r}$ 升的速度排水。`,
      ),
    defines: t("the volume of water in liters left after $t$ minutes", "排水 $t$ 分钟后剩余的水量（升）"),
    outputOf: (n) => t(`How many liters are left after $${n}$ minutes?`, `排水 $${n}$ 分钟后还剩多少升水？`),
    inputFor: (c) => t(`After how many minutes are $${c}$ liters left?`, `排水多少分钟后还剩 $${c}$ 升水？`),
    meanings: {
      fixed: t("The volume of water at the start", "开始时的水量"),
      rate: t("The volume drained each minute", "每分钟排出的水量"),
      output: t("The volume left after the given time", "经过给定时间后剩余的水量"),
      input: t("The time since the tank started draining", "开始排水后经过的时间"),
    },
  },
  {
    fn: "h",
    v: "t",
    grows: false,
    fixed: (rng) => rng.int(20, 40),
    rate: (rng) => rng.int(1, 3),
    describe: (f, r) =>
      t(`A candle is $${f}$ cm tall and burns down $${r}$ cm each hour.`, `一支蜡烛高 $${f}$ 厘米，每小时燃烧掉 $${r}$ 厘米。`),
    defines: t("the height in centimeters after burning for $t$ hours", "燃烧 $t$ 小时后蜡烛的高度（厘米）"),
    outputOf: (n) => t(`How tall is the candle after $${n}$ hours?`, `燃烧 $${n}$ 小时后蜡烛高多少厘米？`),
    inputFor: (c) => t(`After how many hours is the candle $${c}$ cm tall?`, `燃烧多少小时后蜡烛高 $${c}$ 厘米？`),
    meanings: {
      fixed: t("The height of the candle before it is lit", "点燃前蜡烛的高度"),
      rate: t("The height burned each hour", "每小时燃烧掉的高度"),
      output: t("The height after the given time", "经过给定时间后的高度"),
      input: t("The time the candle has burned", "蜡烛燃烧的时间"),
    },
  },
  {
    fn: "S",
    v: "w",
    grows: true,
    fixed: (rng) => 10 * rng.int(5, 30),
    rate: (rng) => 5 * rng.int(2, 8),
    describe: (f, r) =>
      t(`Mia has $${f}$ dollars saved and adds $${r}$ dollars every week.`, `小米已经存了 $${f}$ 元，每周再存 $${r}$ 元。`),
    defines: t("Mia's savings in dollars after $w$ weeks", "小米 $w$ 周后的存款（元）"),
    outputOf: (n) => t(`How much has she saved after $${n}$ weeks?`, `$${n}$ 周后她有多少存款？`),
    inputFor: (c) => t(`After how many weeks will she have $${c}$ dollars?`, `多少周后她的存款达到 $${c}$ 元？`),
    meanings: {
      fixed: t("The amount saved at the start", "开始时的存款"),
      rate: t("The amount added each week", "每周存入的钱数"),
      output: t("The savings after the given number of weeks", "经过给定周数后的存款"),
      input: t("The number of weeks", "经过的周数"),
    },
  },
  {
    fn: "C",
    v: "m",
    grows: true,
    fixed: (rng) => 10 * rng.int(2, 10),
    rate: (rng) => 5 * rng.int(3, 9),
    describe: (f, r) =>
      t(
        `A gym charges a joining fee of $${f}$ dollars and $${r}$ dollars per month.`,
        `一家健身房收取 $${f}$ 元的入会费，另外每月收费 $${r}$ 元。`,
      ),
    defines: t("the total cost in dollars of $m$ months of membership", "会员 $m$ 个月的总费用（元）"),
    outputOf: (n) => t(`What is the total cost of $${n}$ months?`, `$${n}$ 个月的总费用是多少元？`),
    inputFor: (c) => t(`For how many months is the total cost $${c}$ dollars?`, `总费用为 $${c}$ 元时是多少个月？`),
    meanings: {
      fixed: t("The joining fee", "入会费"),
      rate: t("The cost of each month", "每月的费用"),
      output: t("The total cost of the membership", "会员的总费用"),
      input: t("The number of months", "会员的月数"),
    },
  },
];

/** model draws a context and its numbers. */
function model(rng: Rng) {
  const c = rng.pick(contexts);
  const fixed = c.fixed(rng);
  const rate = c.rate(rng);
  const slope = c.grows ? rate : -rate;
  const formula = poly([slope, c.v], [fixed, ""]);
  /** maxInput keeps a decreasing quantity positive. */
  const maxInput = c.grows ? 30 : Math.floor((fixed - 1) / rate);
  return { c, fixed, rate, slope, formula, maxInput, at: (n: number) => fixed + slope * n };
}

export const modelingWithLinearFunctions: TopicDef = {
  id: "modeling-with-linear-functions",
  title: t("Modeling With Linear Functions", "用一次函数建模"),
  summary: t(
    "Use linear functions that describe real situations: evaluate them, solve for the input, and interpret their numbers.",
    "使用描述实际情境的一次函数：求函数值、反求输入，并解释其中各数的含义。",
  ),
  prerequisites: ["introduction-to-functions", "slope-intercept-form"],
  encompasses: [
    { topic: "introduction-to-functions", weight: 0.4 },
    { topic: "two-step-equations", weight: 0.5 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.LE.B.5", "CCSS.HSF.IF.A.2"],
  knowledgePoints: [
    {
      id: "evaluating-linear-models",
      title: t("Evaluating a model", "用模型求值"),
      explanation: t(
        "A taxi fare of $C(d) = 2d + 5$ dollars for a ride of $d$ kilometers is a **linear model**: a fixed amount, $5$, plus a rate, $2$ per kilometer. To answer a question about a $12$ km ride, substitute the input:\n\n$$C(12) = 2(12) + 5 = 29 \\text{ dollars}.$$",
        "行驶 $d$ 千米的出租车费 $C(d) = 2d + 5$（元）是一个**一次函数模型**：固定的 $5$ 元，加上每千米 $2$ 元的费率。要回答行驶 $12$ 千米的问题，代入输入：\n\n$$C(12) = 2(12) + 5 = 29 \\text{ 元}.$$",
      ),
      generate(rng) {
        const { c, fixed, slope, formula, maxInput, at } = model(rng);
        const n = rng.int(2, Math.max(2, maxInput));
        const value = at(n);
        return numberProblem({
          prompt: t(
            `The function $${c.fn}(${c.v}) = ${formula}$ gives ${c.defines.en}. ${c.outputOf(n).en}`,
            `函数 $${c.fn}(${c.v}) = ${formula}$ 表示${c.defines["zh-CN"]}。${c.outputOf(n)["zh-CN"]}`,
          ),
          answer: value,
          wrong: [slope * n, (fixed + slope) * n, fixed - slope * n, fixed * n + slope],
          solution: t(
            `Substitute $${c.v} = ${n}$:${steps(`${c.fn}(${n}) = ${substitution([fixed, slope], n)} = ${value}`)}`,
            `代入 $${c.v} = ${n}$：${steps(`${c.fn}(${n}) = ${substitution([fixed, slope], n)} = ${value}`)}`,
          ),
        });
      },
    },
    {
      id: "solving-linear-models",
      title: t("Solving for the input", "反求输入"),
      explanation: t(
        "To find the input that gives a certain output, set the formula equal to that output and solve. Which ride costs $29$ dollars when $C(d) = 2d + 5$?\n\n$$2d + 5 = 29 \\;\\Rightarrow\\; 2d = 24 \\;\\Rightarrow\\; d = 12.$$\n\nA ride of $12$ kilometers.",
        "要求出使输出为某个值的输入，就令公式等于这个输出并解方程。当 $C(d) = 2d + 5$ 时，车费为 $29$ 元的行程有多长？\n\n$$2d + 5 = 29 \\;\\Rightarrow\\; 2d = 24 \\;\\Rightarrow\\; d = 12.$$\n\n即行驶 $12$ 千米。",
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const { c, fixed, rate, slope, formula, maxInput, at } = model(rng);
        const n = rng.int(2, Math.max(2, maxInput));
        const out = at(n);
        return numberProblem({
          prompt: t(
            `The function $${c.fn}(${c.v}) = ${formula}$ gives ${c.defines.en}. ${c.inputFor(out).en}`,
            `函数 $${c.fn}(${c.v}) = ${formula}$ 表示${c.defines["zh-CN"]}。${c.inputFor(out)["zh-CN"]}`,
          ),
          answer: n,
          wrong: [Q.of(out, rate), Q.of(out + fixed, rate), at(out)],
          solution: t(
            `Solve $${formula} = ${out}$:${steps(`${poly([slope, c.v])} = ${num(out - fixed)}`, `${c.v} = ${n}`)}`,
            `解方程 $${formula} = ${out}$：${steps(`${poly([slope, c.v])} = ${num(out - fixed)}`, `${c.v} = ${n}`)}`,
          ),
        });
      },
    },
    {
      id: "interpreting-linear-models",
      title: t("Interpreting the numbers in a model", "解释模型中的数"),
      explanation: t(
        "In a linear model $f(x) = mx + b$, the constant term $b$ is the output when the input is $0$: the **starting amount** or fixed part. The coefficient $m$ is the **rate**: how much the output changes for each unit of input. In $V(t) = 500 - 20t$, the tank starts with $500$ liters and loses $20$ liters each minute.",
        "在一次函数模型 $f(x) = mx + b$ 中，常数项 $b$ 是输入为 $0$ 时的输出，即**初始量**或固定部分；系数 $m$ 是**变化率**，即输入每增加一个单位，输出的变化量。在 $V(t) = 500 - 20t$ 中，水箱开始时有 $500$ 升水，每分钟减少 $20$ 升。",
      ),
      generate(rng) {
        const { c, fixed, rate, formula } = model(rng);
        const askFixed = rng.bool();
        const keys = ["fixed", "rate", "output", "input"] as const;
        const order = rng.shuffle(keys);
        const target = askFixed ? "fixed" : "rate";
        const shown = askFixed ? fixed : rate;
        return choiceProblem({
          prompt: t(
            `The function $${c.fn}(${c.v}) = ${formula}$ gives ${c.defines.en}. What does the number $${shown}$ represent?`,
            `函数 $${c.fn}(${c.v}) = ${formula}$ 表示${c.defines["zh-CN"]}。其中的数 $${shown}$ 表示什么？`,
          ),
          options: order.map((k) => c.meanings[k]),
          correct: order.indexOf(target),
          solution: askFixed
            ? t(
                `$${fixed}$ is the constant term: it is $${c.fn}(0)$, the value before any ${c.v === "t" ? "time passes" : "units are counted"}. ${c.meanings.fixed.en}.`,
                `$${fixed}$ 是常数项，即 $${c.fn}(0)$，也就是输入为 $0$ 时的值。它表示${c.meanings.fixed["zh-CN"]}。`,
              )
            : t(
                `$${rate}$ is the amount by which $${c.fn}$ changes each time $${c.v}$ grows by $1$. ${c.meanings.rate.en}.`,
                `$${rate}$ 是 $${c.v}$ 每增加 $1$ 时 $${c.fn}$ 的变化量。它表示${c.meanings.rate["zh-CN"]}。`,
              ),
        });
      },
    },
  ],
};

export const constructingLinearFunctions: TopicDef = {
  id: "constructing-linear-functions",
  title: t("Constructing Linear Functions", "构造一次函数"),
  summary: t(
    "Write the formula of a linear function from a description, a table of values, or two of its values.",
    "根据文字描述、数值表或两个函数值写出一次函数的解析式。",
  ),
  prerequisites: ["modeling-with-linear-functions", "representations-of-functions", "point-slope-form"],
  encompasses: [
    { topic: "modeling-with-linear-functions", weight: 0.5 },
    { topic: "representations-of-functions", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.LE.A.2", "CCSS.HSF.BF.A.1.A"],
  knowledgePoints: [
    {
      id: "linear-functions-from-a-description",
      title: t("From a description", "由文字描述构造"),
      explanation: t(
        "A situation with a starting amount and a constant rate gives a linear function: output $=$ starting amount $+$ rate $\\times$ input. Use a negative rate for an amount that goes down.\n\nA tank holding $500$ liters that drains $20$ liters per minute holds $V(t) = 500 - 20t$ liters after $t$ minutes.",
        "有初始量和固定变化率的情境给出一个一次函数：输出 $=$ 初始量 $+$ 变化率 $\\times$ 输入。对于减少的量，变化率取负数。\n\n装有 $500$ 升水、每分钟排水 $20$ 升的水箱，$t$ 分钟后的水量为 $V(t) = 500 - 20t$ 升。",
      ),
      generate(rng) {
        const { c, fixed, rate, slope, formula } = model(rng);
        const lhs = `${c.fn}(${c.v})`;
        return withPrefix(
          expressionProblem({
            prompt: t(
              `${c.describe(fixed, rate).en} Write a formula for $${lhs}$, ${c.defines.en}.`,
              `${c.describe(fixed, rate)["zh-CN"]}写出 $${lhs}$ 的公式，它表示${c.defines["zh-CN"]}。`,
            ),
            answer: formula,
            simplified: true,
            wrong: [poly([fixed, c.v], [slope, ""]), poly([-slope, c.v], [fixed, ""]), poly([slope, c.v]), poly([fixed + slope, c.v])],
            solution: t(
              `It starts at $${fixed}$ and ${c.grows ? "gains" : "loses"} $${rate}$ for each unit of $${c.v}$: $${lhs} = ${formula}$.`,
              `初始量是 $${fixed}$，$${c.v}$ 每增加 $1$ 就${c.grows ? "增加" : "减少"} $${rate}$：$${lhs} = ${formula}$。`,
            ),
          }),
          `${lhs} =`,
        );
      },
    },
    {
      id: "linear-functions-from-a-table",
      title: t("From a table", "由数值表构造"),
      explanation: t(
        "In a table of a linear function, equal steps in $x$ give equal steps in $f(x)$. The rate $m$ is the change in $f(x)$ divided by the change in $x$:\n\n$$\\begin{array}{c|cccc} x & 1 & 3 & 5 & 7 \\\\ \\hline f(x) & 4 & 10 & 16 & 22 \\end{array} \\qquad m = \\frac{10 - 4}{3 - 1} = 3.$$\n\nThen find the constant term from any column: $f(1) = 3(1) + b = 4$ gives $b = 1$, so $f(x) = 3x + 1$. The first value in the table is $f(0)$ only if the table starts at $x = 0$.",
        "在一次函数的数值表中，$x$ 每次变化相同的量，$f(x)$ 也每次变化相同的量。变化率 $m$ 等于 $f(x)$ 的变化量除以 $x$ 的变化量：\n\n$$\\begin{array}{c|cccc} x & 1 & 3 & 5 & 7 \\\\ \\hline f(x) & 4 & 10 & 16 & 22 \\end{array} \\qquad m = \\frac{10 - 4}{3 - 1} = 3.$$\n\n再用任意一列求常数项：由 $f(1) = 3(1) + b = 4$ 得 $b = 1$，所以 $f(x) = 3x + 1$。只有当表从 $x = 0$ 开始时，第一个值才是 $f(0)$。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const m = rng.nonZero(-6, 6);
        const b = rng.int(-10, 10);
        const step = rng.int(1, 3);
        const start = rng.int(-3, 3);
        const xs = range(0, 3).map((i) => start + i * step);
        const ys = xs.map((x) => m * x + b);
        const answer = linear(m, b);
        return withPrefix(
          expressionProblem({
            prompt: t(
              `The table shows values of a linear function $${name}$.${valueTable(name, xs, ys)}Write a formula for $${name}(x)$.`,
              `下表给出了一次函数 $${name}$ 的一些值。${valueTable(name, xs, ys)}写出 $${name}(x)$ 的解析式。`,
            ),
            answer,
            simplified: true,
            wrong: [linear(m * step, ys[0]! - m * step * start), linear(m, ys[0]!), linear(b, m)],
            solution: t(
              `Each step of $${step}$ in $x$ changes $${name}(x)$ by $${num(m * step)}$, so $m = ${m}$. From $${valueLatex(name, xs[0]!, ys[0]!)}$, $b = ${num(ys[0]!)} - (${m})(${xs[0]}) = ${b}$. So $${name}(x) = ${answer}$.`,
              `$x$ 每增加 $${step}$，$${name}(x)$ 改变 $${num(m * step)}$，所以 $m = ${m}$。由 $${valueLatex(name, xs[0]!, ys[0]!)}$ 得 $b = ${num(ys[0]!)} - (${m})(${xs[0]}) = ${b}$。所以 $${name}(x) = ${answer}$。`,
            ),
          }),
          `${name}(x) =`,
        );
      },
    },
    {
      id: "linear-functions-from-two-values",
      title: t("From two values", "由两个函数值构造"),
      explanation: t(
        "Two values of a linear function determine it. If $f(2) = 7$ and $f(5) = 16$:\n\n$$m = \\frac{16 - 7}{5 - 2} = 3, \\qquad 3(2) + b = 7 \\;\\Rightarrow\\; b = 1,$$\n\nso $f(x) = 3x + 1$. Check with the other value: $f(5) = 15 + 1 = 16$. ✓",
        "一次函数由它的两个函数值确定。若 $f(2) = 7$，$f(5) = 16$：\n\n$$m = \\frac{16 - 7}{5 - 2} = 3, \\qquad 3(2) + b = 7 \\;\\Rightarrow\\; b = 1,$$\n\n所以 $f(x) = 3x + 1$。用另一个值检验：$f(5) = 15 + 1 = 16$。✓",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const m = rng.nonZero(-6, 6);
        const b = rng.int(-10, 10);
        const x1 = rng.int(-5, 4);
        const x2 = x1 + rng.int(1, 5);
        const [y1, y2] = [m * x1 + b, m * x2 + b];
        const answer = linear(m, b);
        return withPrefix(
          expressionProblem({
            prompt: t(
              `$${name}$ is a linear function with $${valueLatex(name, x1, y1)}$ and $${valueLatex(name, x2, y2)}$. Write a formula for $${name}(x)$.`,
              `$${name}$ 是一次函数，且 $${valueLatex(name, x1, y1)}$，$${valueLatex(name, x2, y2)}$。写出 $${name}(x)$ 的解析式。`,
            ),
            answer,
            simplified: true,
            wrong: [
              linear(Q.of(1, m), Q.of(y1).sub(Q.of(x1, m))),
              linear(m, y1),
              linear(m * (x2 - x1), y1 - m * (x2 - x1) * x1),
              linear(m, -b),
            ],
            solution: t(
              `The rate is $m = \\frac{${num(y2)} - ${paren(y1)}}{${x2} - ${paren(x1)}} = ${m}$. Then $${m}(${x1}) + b = ${num(y1)}$ gives $b = ${b}$. So $${name}(x) = ${answer}$.`,
              `变化率 $m = \\frac{${num(y2)} - ${paren(y1)}}{${x2} - ${paren(x1)}} = ${m}$。再由 $${m}(${x1}) + b = ${num(y1)}$ 得 $b = ${b}$。所以 $${name}(x) = ${answer}$。`,
            ),
          }),
          `${name}(x) =`,
        );
      },
    },
  ],
};

// Topic: the arithmetic of functions.

/** smallPoly draws a polynomial of degree 1 or 2 with small coefficients. */
function smallPoly(rng: Rng, degree: number): Poly {
  return degree === 2 ? [rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-4, 4)] : [rng.nonZero(-9, 9), rng.nonZero(-6, 6)];
}

export const arithmeticOfFunctions: TopicDef = {
  id: "arithmetic-of-functions",
  title: t("The Arithmetic of Functions", "函数的四则运算"),
  summary: t(
    "Add, subtract, multiply and divide functions, as formulas and at a given input.",
    "对函数进行加、减、乘、除运算，既求解析式，也求给定输入处的值。",
  ),
  prerequisites: ["introduction-to-functions", "adding-and-subtracting-polynomials", "multiplying-binomials"],
  encompasses: [
    { topic: "adding-and-subtracting-polynomials", weight: 0.5 },
    { topic: "multiplying-binomials", weight: 0.4 },
    { topic: "introduction-to-functions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.BF.A.1.B"],
  knowledgePoints: [
    {
      id: "adding-and-subtracting-functions",
      title: t("Adding and subtracting functions", "函数的加减"),
      explanation: t(
        "The sum and difference of two functions are defined input by input:\n\n$$(f + g)(x) = f(x) + g(x), \\qquad (f - g)(x) = f(x) - g(x).$$\n\nFor $f(x) = x^{2} + 3x$ and $g(x) = 2x - 5$, subtract **all** of $g(x)$:\n\n$$(f - g)(x) = x^{2} + 3x - (2x - 5) = x^{2} + x + 5.$$",
        "两个函数的和与差是对每个输入分别定义的：\n\n$$(f + g)(x) = f(x) + g(x), \\qquad (f - g)(x) = f(x) - g(x).$$\n\n对于 $f(x) = x^{2} + 3x$ 和 $g(x) = 2x - 5$，要减去**整个** $g(x)$：\n\n$$(f - g)(x) = x^{2} + 3x - (2x - 5) = x^{2} + x + 5.$$",
      ),
      keyPrerequisites: ["adding-and-subtracting-polynomials"],
      generate(rng) {
        const f = smallPoly(rng, rng.pick([1, 2]));
        const g = smallPoly(rng, rng.pick([1, 2]));
        const minus = rng.bool(0.6);
        const answer = addPoly(f, g, minus ? -1 : 1);
        const op = minus ? "-" : "+";
        const slip = addPoly(
          f,
          [-(g[0] ?? 0), ...g.slice(1).map((c) => (minus ? -c : c))].map((c, i) => (i === 0 ? c : minus ? -c : c)),
        );
        const lhs = `(f ${op} g)(x)`;
        return withPrefix(
          expressionProblem({
            prompt: t(
              `Given $f(x) = ${polyLatex(f)}$ and $g(x) = ${polyLatex(g)}$, find $${lhs}$.`,
              `已知 $f(x) = ${polyLatex(f)}$，$g(x) = ${polyLatex(g)}$，求 $${lhs}$。`,
            ),
            answer: polyLatex(answer),
            simplified: true,
            wrong: [polyLatex(addPoly(f, g, minus ? 1 : -1)), polyLatex(addPoly(g, f, -1)), polyLatex(slip)],
            solution: t(
              `$${lhs}$ means $f(x) ${op} g(x)$:${steps(`${lhs} = ${polyLatex(f)} ${op} (${polyLatex(g)}) = ${polyLatex(answer)}`)}`,
              `$${lhs}$ 就是 $f(x) ${op} g(x)$：${steps(`${lhs} = ${polyLatex(f)} ${op} (${polyLatex(g)}) = ${polyLatex(answer)}`)}`,
            ),
          }),
          `${lhs} =`,
        );
      },
    },
    {
      id: "multiplying-functions",
      title: t("Multiplying functions", "函数的乘法"),
      explanation: t(
        "The product of two functions is $(fg)(x) = f(x) \\cdot g(x)$. Multiply the formulas as polynomials, every term by every term:\n\n$$f(x) = x + 4, \\; g(x) = 2x - 3: \\quad (fg)(x) = (x + 4)(2x - 3) = 2x^{2} + 5x - 12.$$",
        "两个函数的积是 $(fg)(x) = f(x) \\cdot g(x)$。把两个公式当作多项式相乘，每一项都要与另一个的每一项相乘：\n\n$$f(x) = x + 4, \\; g(x) = 2x - 3: \\quad (fg)(x) = (x + 4)(2x - 3) = 2x^{2} + 5x - 12.$$",
      ),
      keyPrerequisites: ["multiplying-binomials"],
      generate(rng) {
        const f: Poly = [rng.nonZero(-9, 9), rng.nonZero(-4, 4)];
        const g: Poly = [rng.nonZero(-9, 9), rng.nonZero(-4, 4)];
        const answer = mulPoly(f, g);
        return withPrefix(
          expressionProblem({
            prompt: t(
              `Given $f(x) = ${polyLatex(f)}$ and $g(x) = ${polyLatex(g)}$, find $(fg)(x)$.`,
              `已知 $f(x) = ${polyLatex(f)}$，$g(x) = ${polyLatex(g)}$，求 $(fg)(x)$。`,
            ),
            answer: polyLatex(answer),
            simplified: true,
            wrong: [
              polyLatex([f[0]! * g[0]!, 0, f[1]! * g[1]!]),
              polyLatex(addPoly(f, g)),
              polyLatex([f[0]! * g[0]!, f[1]! * g[0]!, f[1]! * g[1]!]),
            ],
            solution: t(
              `Multiply the two binomials:${steps(`(fg)(x) = (${polyLatex(f)})(${polyLatex(g)}) = ${polyLatex(answer)}`)}`,
              `把两个二项式相乘：${steps(`(fg)(x) = (${polyLatex(f)})(${polyLatex(g)}) = ${polyLatex(answer)}`)}`,
            ),
          }),
          "(fg)(x) =",
        );
      },
    },
    {
      id: "combining-functions-at-a-number",
      title: t("Combining functions at a number", "在某个数处的函数运算"),
      explanation: t(
        "To evaluate a combination at a number, evaluate each function there first, then combine the outputs:\n\n$$\\left(\\frac{f}{g}\\right)(2) = \\frac{f(2)}{g(2)}, \\qquad (f - g)(2) = f(2) - g(2).$$\n\nIf $f(2) = 9$ and $g(2) = -3$, then $\\left(\\frac{f}{g}\\right)(2) = -3$ and $(f - g)(2) = 12$. A quotient is undefined where the denominator is $0$.",
        "求函数运算在某个数处的值，先分别求出各函数在该处的值，再把输出组合起来：\n\n$$\\left(\\frac{f}{g}\\right)(2) = \\frac{f(2)}{g(2)}, \\qquad (f - g)(2) = f(2) - g(2).$$\n\n若 $f(2) = 9$，$g(2) = -3$，则 $\\left(\\frac{f}{g}\\right)(2) = -3$，$(f - g)(2) = 12$。分母为 $0$ 时商没有定义。",
      ),
      generate(rng) {
        const f = smallPoly(rng, rng.pick([1, 2]));
        const g = smallPoly(rng, 1);
        let k = rng.int(-4, 4);
        if (evalPoly(g, k) === 0) k = k === 4 ? -4 : k + 1;
        const fk = evalPoly(f, k);
        const gk = evalPoly(g, k);
        const kind = rng.int(0, 3);
        const ops: [string, Q, Q[]][] = [
          [`(f + g)(${k})`, Q.of(fk + gk), [Q.of(fk - gk), Q.of(fk * gk)]],
          [`(f - g)(${k})`, Q.of(fk - gk), [Q.of(gk - fk), Q.of(fk + gk)]],
          [`(fg)(${k})`, Q.of(fk * gk), [Q.of(fk + gk), Q.of(evalPoly(mulPoly(f, g), -k))]],
          [`\\left(\\frac{f}{g}\\right)(${k})`, Q.of(fk, gk), [...(fk !== 0 ? [Q.of(gk, fk)] : []), Q.of(fk * gk)]],
        ];
        const [lhs, value, wrong] = ops[kind]!;
        const quotient = `\\frac{${num(fk)}}{${num(gk)}}`;
        const combine = [`${num(fk)} + ${paren(gk)}`, `${num(fk)} - ${paren(gk)}`, `${paren(fk)} \\cdot ${paren(gk)}`, quotient][kind]!;
        const result = combine === value.toLatex() ? "" : ` = ${value.toLatex()}`;
        return numberProblem({
          prompt: t(
            `Given $f(x) = ${polyLatex(f)}$ and $g(x) = ${polyLatex(g)}$, find $${lhs}$.`,
            `已知 $f(x) = ${polyLatex(f)}$，$g(x) = ${polyLatex(g)}$，求 $${lhs}$。`,
          ),
          answer: value,
          wrong,
          solution: t(
            `First $${valueLatex("f", k, fk)}$ and $${valueLatex("g", k, gk)}$. Then${steps(`${lhs} = ${combine}${result}`)}`,
            `先求 $${valueLatex("f", k, fk)}$，$${valueLatex("g", k, gk)}$。于是${steps(`${lhs} = ${combine}${result}`)}`,
          ),
        });
      },
    },
  ],
};

// Topic: function composition.

export const functionComposition: TopicDef = {
  id: "function-composition",
  title: t("Function Composition", "函数的复合"),
  summary: t(
    "Compose functions: evaluate f(g(x)) at a number, from tables, and as a formula.",
    "复合函数：在某个数处、借助数值表以及以公式形式求 f(g(x))。",
  ),
  prerequisites: ["arithmetic-of-functions", "representations-of-functions", "squaring-binomials"],
  encompasses: [
    { topic: "introduction-to-functions", weight: 0.5 },
    { topic: "squaring-binomials", weight: 0.3 },
    { topic: "representations-of-functions", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.A.1.C"],
  knowledgePoints: [
    {
      id: "evaluating-compositions",
      title: t("Evaluating a composition", "复合函数求值"),
      explanation: t(
        "The **composition** $f \\circ g$ applies $g$ first and then $f$: $(f \\circ g)(x) = f(g(x))$. Work from the inside out. For $f(x) = x^{2} + 1$ and $g(x) = 3x - 2$:\n\n$$g(2) = 4, \\qquad f(g(2)) = f(4) = 17.$$\n\nThe order matters: $g(f(2)) = g(5) = 13$.",
        "**复合函数** $f \\circ g$ 先作用 $g$，再作用 $f$：$(f \\circ g)(x) = f(g(x))$。从里往外算。对于 $f(x) = x^{2} + 1$ 和 $g(x) = 3x - 2$：\n\n$$g(2) = 4, \\qquad f(g(2)) = f(4) = 17.$$\n\n顺序很重要：$g(f(2)) = g(5) = 13$。",
      ),
      generate(rng) {
        const f = smallPoly(rng, rng.pick([1, 2]));
        const g = smallPoly(rng, rng.pick([1, 1, 2]));
        const k = rng.int(-3, 3);
        const fOuter = rng.bool();
        const [outer, inner, on, ii] = fOuter ? ["f", "g", f, g] : ["g", "f", g, f];
        const mid = evalPoly(ii, k);
        const value = evalPoly(on, mid);
        const lhs = rng.bool() ? `${outer}(${inner}(${k}))` : `(${outer} \\circ ${inner})(${k})`;
        return numberProblem({
          prompt: t(
            `Given $f(x) = ${polyLatex(f)}$ and $g(x) = ${polyLatex(g)}$, find $${lhs}$.`,
            `已知 $f(x) = ${polyLatex(f)}$，$g(x) = ${polyLatex(g)}$，求 $${lhs}$。`,
          ),
          answer: value,
          wrong: [evalPoly(ii, evalPoly(on, k)), evalPoly(f, k) * evalPoly(g, k), evalPoly(on, k)],
          solution: t(
            `Inside first: $${valueLatex(inner, k, mid)}$. Then${steps(`${outer}(${num(mid)}) = ${substitution(on, mid)} = ${num(value)}`)}`,
            `先算里面：$${valueLatex(inner, k, mid)}$。再算${steps(`${outer}(${num(mid)}) = ${substitution(on, mid)} = ${num(value)}`)}`,
          ),
        });
      },
    },
    {
      id: "compositions-from-tables",
      title: t("Compositions from tables", "由数值表求复合函数值"),
      explanation: t(
        "With tables, read the inner function's output and look it up as an input of the outer function. To find $f(g(1))$, read $g(1)$ from the table of $g$, then find that number in the $x$ row of the table of $f$.",
        "借助数值表时，先读出内层函数的输出，再把它作为外层函数的输入去查表。求 $f(g(1))$：先在 $g$ 的表中读出 $g(1)$，再在 $f$ 的表的 $x$ 行中找到这个数。",
      ),
      generate(rng) {
        const xs = rng.sample(range(-4, 6), 5).sort((a, b) => a - b);
        const fy = rng.sample(range(-9, 9), 5);
        const gx = rng.sample(range(-4, 6), 5).sort((a, b) => a - b);
        const gy = gx.map(() => rng.pick(xs));
        const i = rng.int(0, 4);
        const a = gx[i]!;
        const mid = gy[i]!;
        const value = fy[xs.indexOf(mid)]!;
        const fa = xs.includes(a) ? fy[xs.indexOf(a)] : undefined;
        const reverse = fa !== undefined && gx.includes(fa) ? gy[gx.indexOf(fa)] : undefined;
        const tables = `${valueTable("f", xs, fy)}${valueTable("g", gx, gy)}`;
        return numberProblem({
          prompt: t(
            `The tables show some values of $f$ and $g$.${tables}Find $f(g(${a}))$.`,
            `下表给出了 $f$ 和 $g$ 的一些值。${tables}求 $f(g(${a}))$。`,
          ),
          answer: value,
          wrong: [mid, ...(fa !== undefined ? [fa] : []), ...(reverse !== undefined ? [reverse] : [])],
          solution: t(
            `From the table of $g$, $${valueLatex("g", a, mid)}$. From the table of $f$, $${valueLatex("f", mid, value)}$. So $f(g(${a})) = ${value}$.`,
            `由 $g$ 的表，$${valueLatex("g", a, mid)}$；由 $f$ 的表，$${valueLatex("f", mid, value)}$。所以 $f(g(${a})) = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "composing-formulas",
      title: t("Composing formulas", "求复合函数的解析式"),
      explanation: t(
        "To find $f(g(x))$ as a formula, substitute the whole expression $g(x)$, in parentheses, for every $x$ in $f(x)$, then simplify. For $f(x) = x^{2} - 1$ and $g(x) = x + 3$:\n\n$$f(g(x)) = (x + 3)^{2} - 1 = x^{2} + 6x + 8,$$\n\nwhile $g(f(x)) = (x^{2} - 1) + 3 = x^{2} + 2$.",
        "要求 $f(g(x))$ 的解析式，把 $f(x)$ 中的每个 $x$ 都换成带括号的整个式子 $g(x)$，再化简。对于 $f(x) = x^{2} - 1$ 和 $g(x) = x + 3$：\n\n$$f(g(x)) = (x + 3)^{2} - 1 = x^{2} + 6x + 8,$$\n\n而 $g(f(x)) = (x^{2} - 1) + 3 = x^{2} + 2$。",
      ),
      keyPrerequisites: ["squaring-binomials"],
      generate(rng) {
        const quadratic = rng.bool();
        const f: Poly = quadratic ? [rng.int(-9, 9), 0, rng.pick([1, 1, -1, 2])] : [rng.nonZero(-9, 9), rng.nonZero(-5, 5)];
        const g: Poly = [rng.nonZero(-6, 6), rng.pick([1, 1, -1, 2, 3, -2])];
        const fOuter = rng.bool();
        const [outer, inner, on, ii] = fOuter ? ["f", "g", f, g] : ["g", "f", g, f];
        const answer = composePoly(on, ii);
        const lhs = `${outer}(${inner}(x))`;
        const sub = substitutionOf(on, polyLatex(ii));
        return withPrefix(
          expressionProblem({
            prompt: t(
              `Given $f(x) = ${polyLatex(f)}$ and $g(x) = ${polyLatex(g)}$, find $${lhs}$.`,
              `已知 $f(x) = ${polyLatex(f)}$，$g(x) = ${polyLatex(g)}$，求 $${lhs}$。`,
            ),
            answer: polyLatex(answer),
            simplified: true,
            wrong: [polyLatex(composePoly(ii, on)), polyLatex(mulPoly(f, g)), polyLatex(addPoly(on, ii))],
            solution: t(
              `Substitute $${inner}(x) = ${polyLatex(ii)}$ for $x$ in $${outer}$:${steps(`${lhs} = ${sub} = ${polyLatex(answer)}`)}`,
              `把 $${outer}$ 中的 $x$ 换成 $${inner}(x) = ${polyLatex(ii)}$：${steps(`${lhs} = ${sub} = ${polyLatex(answer)}`)}`,
            ),
          }),
          `${lhs} =`,
        );
      },
    },
  ],
};

/** substitutionOf writes a polynomial with an expression substituted for x: "2(x + 3)^{2} - 1". */
function substitutionOf(p: Poly, inner: string): string {
  let out = "";
  for (let i = p.length - 1; i >= 0; i--) {
    const c = p[i]!;
    if (c === 0) continue;
    const a = Math.abs(c);
    const body = i === 0 ? String(a) : `${a === 1 ? "" : a}(${inner})${i > 1 ? `^{${i}}` : ""}`;
    if (out === "") out = c < 0 ? `-${body}` : body;
    else out += c < 0 ? ` - ${body}` : ` + ${body}`;
  }
  return out === "" ? "0" : out;
}

// Topic: describing function composition.

/** Step is a simple operation applied to an expression. */
interface Step {
  readonly kind: "shift" | "scale" | "square";
  readonly c: number;
}

const stepText = (s: Step): Text =>
  s.kind === "shift"
    ? s.c > 0
      ? t(`add $${s.c}$`, `加上 $${s.c}$`)
      : t(`subtract $${-s.c}$`, `减去 $${-s.c}$`)
    : s.kind === "scale"
      ? t(`multiply by $${s.c}$`, `乘以 $${s.c}$`)
      : t("square", "平方");

/** applyStep writes the step applied to an expression; atomic tells whether the expression needs no parentheses after a factor. */
function applyStep(s: Step, inner: string): string {
  const atomic = inner === "x" || /^-?\d*x(\^\{\d\})?$/.test(inner);
  if (s.kind === "shift") return `${inner}${plus(s.c)}`;
  if (s.kind === "scale") return atomic ? `${s.c}${inner}` : `${s.c}(${inner})`;
  return inner === "x" ? "x^{2}" : `(${inner})^{2}`;
}

function drawStep(rng: Rng, kind: Step["kind"]): Step {
  if (kind === "shift") return { kind, c: rng.nonZero(-9, 9) };
  if (kind === "scale") return { kind, c: rng.sign() * rng.int(2, 6) };
  return { kind, c: 0 };
}

/** Outer is the outer function of a decomposition: f(x) and f applied to an expression. */
const outers = [
  { f: "x^{2}", of: (e: string) => `(${e})^{2}` },
  { f: "x^{3}", of: (e: string) => `(${e})^{3}` },
  { f: "\\sqrt{x}", of: (e: string) => `\\sqrt{${e}}` },
  { f: "\\frac{1}{x}", of: (e: string) => `\\frac{1}{${e}}` },
] as const;

export const describingFunctionComposition: TopicDef = {
  id: "describing-function-composition",
  title: t("Describing Function Composition", "描述复合函数"),
  summary: t(
    "Describe compositions in words and break a function into an inner and an outer function.",
    "用文字描述复合函数，并把一个函数分解为内层函数与外层函数。",
  ),
  prerequisites: ["function-composition"],
  encompasses: [{ topic: "function-composition", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSF.BF.A.1.C"],
  knowledgePoints: [
    {
      id: "compositions-in-words",
      title: t("Compositions in words", "用文字描述复合"),
      explanation: t(
        "A composition is a sequence of steps. If $g(x) = x + 3$ (add $3$) and $f(x) = x^{2}$ (square), then $f(g(x)) = (x + 3)^{2}$ means: **first add $3$, then square**. The inner function acts first, even though it is written second.\n\nThe other order, $g(f(x)) = x^{2} + 3$, squares first and then adds $3$, a different function.",
        "复合函数就是一系列步骤。若 $g(x) = x + 3$（加上 $3$），$f(x) = x^{2}$（平方），则 $f(g(x)) = (x + 3)^{2}$ 表示：**先加上 $3$，再平方**。内层函数虽然写在后面，却先起作用。\n\n另一种顺序 $g(f(x)) = x^{2} + 3$ 是先平方再加上 $3$，这是另一个函数。",
      ),
      generate(rng) {
        const [k1, k2] = rng.sample(["shift", "scale", "square"] as const, 2);
        const first = drawStep(rng, k1!);
        const second = drawStep(rng, k2!);
        const right = applyStep(second, applyStep(first, "x"));
        const reversed = applyStep(first, applyStep(second, "x"));
        const [a, b] = [stepText(first), stepText(second)];
        if (rng.bool()) {
          const options = rng.shuffle([right, reversed]);
          return choiceProblem({
            prompt: t(
              `A function $h$ takes $x$, first ${a.en}, then ${b.en}. Which formula is $h(x)$?`,
              `函数 $h$ 对 $x$ 先${a["zh-CN"]}，再${b["zh-CN"]}。$h(x)$ 是哪个式子？`,
            ),
            options: options.map((o) => same(`$h(x) = ${o}$`)),
            correct: options.indexOf(right),
            solution: t(
              `The first step, ${a.en}, acts on $x$ and gives $${applyStep(first, "x")}$; then ${b.en}: $h(x) = ${right}$.`,
              `第一步${a["zh-CN"]}作用于 $x$，得到 $${applyStep(first, "x")}$；再${b["zh-CN"]}：$h(x) = ${right}$。`,
            ),
          });
        }
        const fName = rng.pick(["f", "g"] as const);
        const gName = fName === "f" ? "g" : "f";
        const options = rng.shuffle([0, 1]);
        const words = [
          t(`First ${a.en}, then ${b.en}`, `先${a["zh-CN"]}，再${b["zh-CN"]}`),
          t(`First ${b.en}, then ${a.en}`, `先${b["zh-CN"]}，再${a["zh-CN"]}`),
        ];
        return choiceProblem({
          prompt: t(
            `Let $${fName}(x) = ${applyStep(second, "x")}$ and $${gName}(x) = ${applyStep(first, "x")}$. Which describes $${fName}(${gName}(x))$?`,
            `设 $${fName}(x) = ${applyStep(second, "x")}$，$${gName}(x) = ${applyStep(first, "x")}$。哪一项描述了 $${fName}(${gName}(x))$？`,
          ),
          options: options.map((i) => words[i]!),
          correct: options.indexOf(0),
          solution: t(
            `The inner function $${gName}$ acts first (${a.en}), then the outer function $${fName}$ (${b.en}): $${fName}(${gName}(x)) = ${right}$.`,
            `内层函数 $${gName}$ 先起作用（${a["zh-CN"]}），然后是外层函数 $${fName}$（${b["zh-CN"]}）：$${fName}(${gName}(x)) = ${right}$。`,
          ),
        });
      },
    },
    {
      id: "decomposing-functions",
      title: t("Decomposing a function", "分解函数"),
      explanation: t(
        "To write $h$ as a composition $f(g(x))$, look for an expression that is computed first and then acted on. In $h(x) = (2x - 5)^{3}$, the inside $2x - 5$ is computed first and then cubed:\n\n$$g(x) = 2x - 5, \\qquad f(x) = x^{3}.$$\n\nCheck by composing: $f(g(x)) = (2x - 5)^{3}$. ✓ Swapping them gives $g(f(x)) = 2x^{3} - 5$, which is not $h$.",
        "要把 $h$ 写成复合函数 $f(g(x))$，先找出先计算、再被作用的那个式子。在 $h(x) = (2x - 5)^{3}$ 中，先算里面的 $2x - 5$，再立方：\n\n$$g(x) = 2x - 5, \\qquad f(x) = x^{3}.$$\n\n复合检验：$f(g(x)) = (2x - 5)^{3}$。✓ 把两者交换，得到 $g(f(x)) = 2x^{3} - 5$，它不是 $h$。",
      ),
      generate(rng) {
        const a = rng.sign() * rng.int(2, 6);
        const b = rng.nonZero(-9, 9);
        const L = linear(a, b);
        const outer = rng.pick(outers);
        const h = outer.of(L);
        const candidates = [
          `f(x) = ${outer.f}, \\; g(x) = ${L}`,
          `f(x) = ${L}, \\; g(x) = ${outer.f}`,
          `f(x) = ${outer.f}${plus(b)}, \\; g(x) = ${a}x`,
          `f(x) = ${outer.f}, \\; g(x) = ${a}x`,
        ];
        const options = rng.shuffle(candidates);
        return choiceProblem({
          prompt: t(`Which choice of $f$ and $g$ gives $f(g(x)) = ${h}$?`, `哪一组 $f$ 和 $g$ 满足 $f(g(x)) = ${h}$？`),
          options: options.map((o) => same(`$${o}$`)),
          correct: options.indexOf(candidates[0]!),
          solution: t(
            `The expression $${L}$ is computed first, so it is the inner function $g$; the outer function $f(x) = ${outer.f}$ then acts on it: $f(g(x)) = ${h}$.`,
            `先计算的是 $${L}$，所以它是内层函数 $g$；外层函数 $f(x) = ${outer.f}$ 再作用于它：$f(g(x)) = ${h}$。`,
          ),
        });
      },
    },
    {
      id: "finding-the-inner-or-outer-function",
      title: t("Finding the inner or outer function", "求内层或外层函数"),
      explanation: t(
        "If $h(x) = f(g(x))$ and one of the functions is known, the other can be read off. With $g(x) = 3x + 1$ and $h(x) = 2(3x + 1)^{2} - 7$, $h$ does to $g(x)$ what $f$ does to $x$, so $f(x) = 2x^{2} - 7$.\n\nWith $f(x) = x^{3} + 4$ and $h(x) = (x - 6)^{3} + 4$, the cube acts on $x - 6$, so $g(x) = x - 6$.",
        "若 $h(x) = f(g(x))$，并且已知其中一个函数，就可以读出另一个。若 $g(x) = 3x + 1$，$h(x) = 2(3x + 1)^{2} - 7$，则 $h$ 对 $g(x)$ 所做的就是 $f$ 对 $x$ 所做的，所以 $f(x) = 2x^{2} - 7$。\n\n若 $f(x) = x^{3} + 4$，$h(x) = (x - 6)^{3} + 4$，立方作用在 $x - 6$ 上，所以 $g(x) = x - 6$。",
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3, -1, -2]);
        const b = rng.nonZero(-9, 9);
        const L = linear(a, b);
        const d = rng.nonZero(-9, 9);
        if (rng.bool()) {
          const c = rng.pick([1, 2, 3, -1, -2]);
          const n = rng.pick([2, 3]);
          const coef = c === 1 ? "" : c === -1 ? "-" : String(c);
          const h = `${coef}(${L})^{${n}}${plus(d)}`;
          const answer = poly([c, `x^{${n}}`], [d, ""]);
          return withPrefix(
            expressionProblem({
              prompt: t(`Given $g(x) = ${L}$ and $f(g(x)) = ${h}$, find $f(x)$.`, `已知 $g(x) = ${L}$，$f(g(x)) = ${h}$，求 $f(x)$。`),
              answer,
              wrong: [h, `x^{${n}}`, poly([c, `x^{${n}}`]), poly([c, `x^{${n}}`], [d - b, ""])],
              solution: t(
                `$f(g(x))$ takes $g(x) = ${L}$ to $${h}$, so $f$ takes $x$ to $${answer}$: $f(x) = ${answer}$.`,
                `$f(g(x))$ 把 $g(x) = ${L}$ 变为 $${h}$，所以 $f$ 把 $x$ 变为 $${answer}$：$f(x) = ${answer}$。`,
              ),
            }),
            "f(x) =",
          );
        }
        const k = rng.sign() * rng.int(2, 5);
        const cube = rng.bool();
        const fLatex = cube ? `x^{3}${plus(d)}` : linear(k, d);
        const h = cube ? `(${L})^{3}${plus(d)}` : linear(k * a, k * b + d);
        return withPrefix(
          expressionProblem({
            prompt: t(
              `Given $f(x) = ${fLatex}$ and $f(g(x)) = ${h}$, find $g(x)$.`,
              `已知 $f(x) = ${fLatex}$，$f(g(x)) = ${h}$，求 $g(x)$。`,
            ),
            answer: L,
            wrong: cube ? [`(${L})^{3}`, linear(a, b + d), linear(a, -b)] : [h, linear(k * a, k * b), linear(a, b + d)],
            solution: cube
              ? t(
                  `$f$ cubes its input and adds $${num(d)}$; here the cube acts on $${L}$, so $g(x) = ${L}$.`,
                  `$f$ 把输入立方再加上 $${num(d)}$；这里立方作用在 $${L}$ 上，所以 $g(x) = ${L}$。`,
                )
              : t(
                  `$f(g(x)) = ${k}g(x)${plus(d)} = ${h}$, so $${k}g(x) = ${linear(k * a, k * b)}$ and $g(x) = ${L}$.`,
                  `$f(g(x)) = ${k}g(x)${plus(d)} = ${h}$，所以 $${k}g(x) = ${linear(k * a, k * b)}$，$g(x) = ${L}$。`,
                ),
          }),
          "g(x) =",
        );
      },
    },
  ],
};

// Topic: introduction to inverse functions.

export const introductionToInverseFunctions: TopicDef = {
  id: "introduction-to-inverse-functions",
  title: t("Introduction to Inverse Functions", "反函数入门"),
  summary: t(
    "Undo a function: read inverse values from a table, invert linear functions, and check inverses by composing.",
    "撤销一个函数：从数值表读出反函数值，求一次函数的反函数，并用复合检验反函数。",
  ),
  prerequisites: ["function-composition", "rearranging-formulas"],
  encompasses: [
    { topic: "function-composition", weight: 0.4 },
    { topic: "two-step-equations", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.4.A"],
  knowledgePoints: [
    {
      id: "inverse-values-from-a-table",
      title: t("Inverse values from a table", "从数值表读反函数值"),
      explanation: t(
        "The **inverse** $f^{-1}$ of a function $f$ undoes it: if $f(a) = b$, then $f^{-1}(b) = a$. It swaps inputs and outputs. To find $f^{-1}(b)$ from a table of $f$, find $b$ in the $f(x)$ row and read the input above it.\n\nThe $-1$ is not an exponent: $f^{-1}(b)$ is **not** $\\frac{1}{f(b)}$.",
        "函数 $f$ 的**反函数** $f^{-1}$ 撤销 $f$ 的作用：若 $f(a) = b$，则 $f^{-1}(b) = a$。它把输入和输出对调。从 $f$ 的数值表求 $f^{-1}(b)$：在 $f(x)$ 行找到 $b$，读出它上面的输入。\n\n这里的 $-1$ 不是指数：$f^{-1}(b)$ **不是** $\\frac{1}{f(b)}$。",
      ),
      generate(rng) {
        const xs = rng.sample(range(-5, 8), 5).sort((a, b) => a - b);
        const ys = rng.sample(range(-9, 12), 5);
        const i = rng.int(0, 4);
        const b = ys[i]!;
        const fb = xs.includes(b) ? ys[xs.indexOf(b)] : undefined;
        const wrong: Coefficient[] = [
          ...(fb !== undefined ? [fb] : []),
          ...(fb !== undefined && fb !== 0 ? [Q.of(1, fb)] : []),
          ...(b !== 0 ? [Q.of(1, b)] : []),
        ];
        return numberProblem({
          prompt: t(
            `The table shows the function $f$.${valueTable("f", xs, ys)}Find $f^{-1}(${b})$.`,
            `下表给出了函数 $f$。${valueTable("f", xs, ys)}求 $f^{-1}(${b})$。`,
          ),
          answer: xs[i]!,
          wrong,
          solution: t(
            `$f^{-1}(${b})$ is the input that $f$ sends to $${b}$. Since $${valueLatex("f", xs[i]!, b)}$, $f^{-1}(${b}) = ${xs[i]}$.`,
            `$f^{-1}(${b})$ 是被 $f$ 对应到 $${b}$ 的输入。因为 $${valueLatex("f", xs[i]!, b)}$，所以 $f^{-1}(${b}) = ${xs[i]}$。`,
          ),
        });
      },
    },
    {
      id: "inverses-of-linear-functions",
      title: t("Inverses of linear functions", "一次函数的反函数"),
      explanation: t(
        "$f(x) = 2x + 3$ multiplies by $2$, then adds $3$. To undo it, reverse the steps **in reverse order**: subtract $3$, then divide by $2$:\n\n$$f^{-1}(x) = \\frac{x - 3}{2}.$$\n\nEquivalently, write $y = 2x + 3$, swap $x$ and $y$, and solve $x = 2y + 3$ for $y$.",
        "$f(x) = 2x + 3$ 先乘以 $2$，再加上 $3$。要撤销它，就**按相反的顺序**做相反的运算：先减去 $3$，再除以 $2$：\n\n$$f^{-1}(x) = \\frac{x - 3}{2}.$$\n\n也可以写成 $y = 2x + 3$，交换 $x$ 与 $y$，再从 $x = 2y + 3$ 中解出 $y$。",
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const a = rng.bool(0.15) ? rng.sign() : rng.sign() * rng.int(2, 7);
        const b = rng.nonZero(-12, 12);
        const answer =
          a === 1
            ? linear(1, -b)
            : a === -1
              ? poly([-1, "x"], [b, ""])
              : a > 0
                ? `\\frac{${linear(1, -b)}}{${a}}`
                : `\\frac{${poly([b, ""], [-1, "x"])}}{${-a}}`;
        const canonical = answer;
        return withPrefix(
          expressionProblem({
            prompt: t(`Find the inverse of $f(x) = ${linear(a, b)}$.`, `求 $f(x) = ${linear(a, b)}$ 的反函数。`),
            answer: canonical,
            wrong: [
              `\\frac{${linear(1, b)}}{${a}}`,
              poly([Q.of(1, a), "x"], [-b, ""]),
              linear(a, -b),
              `\\frac{1}{${linear(a, b)}}`,
              poly([a, "x"], [Q.of(-b, a), ""]),
            ],
            solution: t(
              `$f$ multiplies by $${a}$ and then adds $${num(b)}$. Undo in reverse order: ${b > 0 ? `subtract $${b}$` : `add $${-b}$`}, then divide by $${a}$:${steps(`f^{-1}(x) = ${answer}`)}`,
              `$f$ 先乘以 $${a}$，再加上 $${num(b)}$。按相反顺序撤销：先${b > 0 ? `减去 $${b}$` : `加上 $${-b}$`}，再除以 $${a}$：${steps(`f^{-1}(x) = ${answer}`)}`,
            ),
          }),
          "f^{-1}(x) =",
        );
      },
    },
    {
      id: "checking-inverses",
      title: t("Checking inverses by composition", "用复合检验反函数"),
      explanation: t(
        "Two functions $f$ and $g$ are inverses exactly when each undoes the other: $f(g(x)) = x$ and $g(f(x)) = x$ for every $x$. For linear functions it is enough to check one of them.\n\n$f(x) = 3x - 6$ and $g(x) = \\frac{1}{3}x + 2$: $f(g(x)) = 3\\left(\\frac{1}{3}x + 2\\right) - 6 = x$. ✓ They are inverses.",
        "两个函数 $f$ 和 $g$ 互为反函数，当且仅当它们互相撤销：对每个 $x$ 都有 $f(g(x)) = x$ 且 $g(f(x)) = x$。对于一次函数，只需检验其中一个。\n\n$f(x) = 3x - 6$，$g(x) = \\frac{1}{3}x + 2$：$f(g(x)) = 3\\left(\\frac{1}{3}x + 2\\right) - 6 = x$。✓ 它们互为反函数。",
      ),
      keyPrerequisites: ["function-composition"],
      generate(rng) {
        const a = rng.sign() * rng.int(2, 6);
        const b = rng.nonZero(-9, 9);
        const kind = rng.bool() ? 0 : rng.int(1, 3);
        const [u, v] = [
          [Q.of(1, a), Q.of(-b, a)],
          [Q.of(1, a), Q.of(b, a)],
          [Q.of(1, a), Q.of(-b)],
          [Q.of(-1, a), Q.of(b, a)],
        ][kind] as [Q, Q];
        const g = poly([u, "x"], [v, ""]);
        const cx = Q.of(a).mul(u);
        const c0 = Q.of(a).mul(v).add(Q.of(b));
        const composed = poly([cx, "x"], [c0, ""]);
        const inverse = cx.eq(Q.one) && c0.isZero();
        return choiceProblem({
          prompt: t(
            `Are $f(x) = ${linear(a, b)}$ and $g(x) = ${g}$ inverse functions?`,
            `$f(x) = ${linear(a, b)}$ 与 $g(x) = ${g}$ 互为反函数吗？`,
          ),
          options: yesNo,
          correct: inverse ? 0 : 1,
          solution: t(
            `Compose:${steps(`f(g(x)) = ${a}\\left(${g}\\right)${plus(b)} = ${composed}`)}${inverse ? "This is $x$, so they are inverses." : "This is not $x$, so they are not inverses."}`,
            `求复合：${steps(`f(g(x)) = ${a}\\left(${g}\\right)${plus(b)} = ${composed}`)}${inverse ? "结果是 $x$，所以它们互为反函数。" : "结果不是 $x$，所以它们不互为反函数。"}`,
          ),
        });
      },
    },
  ],
};

/** functionTopics are the topics of the functions unit, in teaching order. */
export const functionTopics: readonly TopicDef[] = [
  introductionToFunctions,
  representationsOfFunctions,
  graphsOfFunctions,
  domainOfAFunction,
  verticalLineTest,
  globalExtrema,
  endBehavior,
  rangeOfAFunction,
  rangeAdvancedCases,
  rootsOfAFunction,
  increasingAndDecreasing,
  piecewiseFunctions,
  modelingWithLinearFunctions,
  constructingLinearFunctions,
  arithmeticOfFunctions,
  functionComposition,
  describingFunctionComposition,
  introductionToInverseFunctions,
];
